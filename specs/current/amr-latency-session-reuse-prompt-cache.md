# AMR latency: session reuse + prompt-cache efficiency

Design doc (human/reviewer-facing). Implementation runbooks per slice are written separately at build time.

Status: proposed · Parent: #3408 · Sibling: agent-startup-latency-profiling.md (#4504) · Spec format: spec-battle

## Why · Why this matters

- **Use case**: While taking over the performance thread for #3408, strict profiling found the real major contributor to AMR first token latency of ~11s per turn, and both the root cause and implementation target are now clear.
- **Pain**: ① Latency — AMR follow-up TTFT p50 ~11s, so users wait ~11s after every message; ② Cost/stability — AMR repays 100-153k input tokens every turn, directly burning AMR Cloud balance, and `insufficient_balance` is AMR's largest failure bucket (7,053/week, #4455 is addressing it). **This performance optimization is also a stability optimization**.

## Sources · Verified facts (checked item by item in this session)

- **Repo / checkout**: `nexu-io/open-design` (main) + local vela repo `~/Documents/vela` (HEAD `fe8266e`).
  - `gh repo clone nexu-io/open-design && git checkout main`; vela is already local.
- **vela side (root cause, verified)**: `~/Documents/vela/apps/cli/internal/agent/acp_runtime.go`
  - `:248` `"loadSession": false` — vela reports that loading/resuming sessions is unsupported.
  - In `newSession`, `if runtime.sessionID != "" { return ... "only one ACP session is supported" }` — only one session per process.
  - `handleRequest` switch only handles `initialize / session/new / session/set_model / session/prompt` — **no `session/load`**, default→"Method not found".
- **open-design daemon side (verified)**:
  - `apps/daemon/src/server.ts:7670` — `composed` = `# Instructions{volatile system block}` + `# User request{flattened transcript}`; `prompts/system.ts:632` BASE_SYSTEM_PROMPT comes first, while `:637` memoryBody and other volatile blocks come later.
  - `apps/web/src/providers/daemon.ts:222` — `buildDaemonTranscript` flattens history into a content-only markdown blob every turn, dropping thinking/tool_use/tool_result.
  - `apps/daemon/src/runtimes/defs/amr.ts` (`acp-json-rpc`, no `resumesSessionViaCli`) → `server.ts:7578` `agentSupportsSessionResume=false` → `skipTranscript:false` → **AMR resends flattened history every turn**. (Contrast with claude.ts `resumesSessionViaCli:true` → already resumes.)
  - `apps/daemon/src/runtimes/mcp.ts:13-22` — MCP injected by the daemon: AMR(mature-acp)+1 live-artifacts; claude uses user external MCP.
- **Data sources**: PostHog project **OpenDesign=420348** (`run_finished`, requires `phx_` key); Langfuse `us.cloud.langfuse.com` (trace_id==run.id). Queries are in the Reproduction section.
- **Access prerequisites**: PostHog personal key to rerun; vela changes require the local vela repo (already available).

## Measured data baseline (real production client + local daemon)

- AMR TTFT: turn-1 p50 ~11.7s, turn-2+ p50 ~10.9-11.1s (about ~90% of runs); hit vs miss 10.9s vs 13.3s.
- **Uncached input per turn (main contributor)**: AMR turn-1 ~100.7k, turn-2+ ~153.2k (claude 91k/126k). First-turn total input ~281k (claude ~629k) — Open Design front-loads system + tools + DS + skill + discovery.
- Cache efficiency: AMR ~73% (hit reads 392k / still repays 143k); claude ~93%.
- Real local daemon claude (minimal turn) breakdown: setup 1.67s + model first byte 3.14s (claude self-reports `[API:timing] first byte 3140ms`).
- Ruled out: bun install is not in user TTFT (shipped opencode is self-contained, measured); process cold start is not the main contributor.

## Goals / Non-goals

- **Goals**: Cut the 100-153k uncached input AMR repays every turn down to "only the new content for this turn", reducing TTFT + token cost.
- **Non-goals**: claude (already resumes); provider-side first-token floor (~3s, network hops + model itself); opencode direct 31s anomaly (separate investigation).

## Root cause

AMR repays 100-153k uncached tokens every turn because it feeds "history the model already processed in the previous turn, byte-for-byte identical" again and recomputes it. Root causes:
1. **vela does not support session reuse** (`loadSession:false` + single session + no `session/load`) → every turn starts from `session/new`;
2. **daemon flattens history into a new user message every turn** (`buildDaemonTranscript`) → prefixes and the previous turn's native structure do not line up;
3. **volatile system blocks** (MCP/memory/runContext) are interleaved inside the system prefix → they truncate the cacheable prefix early (for explicit-cache models).

## Proposed design

Two levers, **with cache_control changes determined by cache type**:

### Lever A — session reuse (**universally required**, useful for every model that can cache)
- Three vela changes: ① change `initialize` to `loadSession=true`; ② add `case "session/load"` in `handleRequest`; ③ persist the opencode session (the current session id only lives in memory).
- Daemon coordination: include AMR/ACP in resume-capable detection (or a dedicated path), switching to "one long-lived ACP connection per conversation, `session/prompt` per turn", and stop resending flattened history every turn.
- Effect: turn-2+ uncached input drops from 153k → only new content for the current turn.

### Lever B — cache_control passthrough + stable prefix (**only for explicit-cache models**: Claude/Gemini)
- Automatic-cache models (**DeepSeek, OpenAI**) **do not need this** — AMR's lead model `deepseek-v4-flash` uses automatic caching; it only needs a stable prefix + no resend.
- Explicit-cache models (Claude / Gemini through Vertex): upstream requests need `cache_control` breakpoints + volatile system blocks moved after the stable breakpoint.
- Layered breakpoints: `[common core]breakpoint[project stable]breakpoint[volatile]breakpoint[user]` — common core is **shared across users** (see below).

### Cache model classification (for implementers)
| Model | Cache | Read discount | TTL | Needs cache_control |
|---|---|---|---|---|
| Claude(Vertex/direct) | Explicit | 0.1× | 5m/1h(write 1.25×/2×) | Yes |
| DeepSeek(AMR lead) | Automatic | ~0.1× | Automatic | No |
| OpenAI | Automatic | ~0.5× | Short/uncontrollable | No |
| Gemini | Explicit ctx cache | ~0.25–0.75× | Configurable | Yes |

### Cache scope + TTL (design constraints)
- **Scope = upstream account/project level, not global and not cross-organization**. AMR uses a **shared backend account** (AMR Cloud) → **the common system prefix can be shared across users**: write once, all users read (0.1×), high concurrency self-warms → **turn-1 is immune to TTL**. claude_code is BYOK and uses each user's own account → no cross-user sharing.
- **turn-2+ single-session history is exposed to TTL** (human time between turns is often >5min) → use **1h extended TTL** + keep one process alive per conversation.

## Expected benefit (quantified + confidence)

| Turn | Current uncached | Method | After cut | TTFT |
|---|---|---|---|---|
| turn-1 | ~100k | Common prefix shared across users + stable prefix (explicit models add cache_control) | Only first message remains | Estimate ~6-7s |
| turn-2+(~90%) | ~153k | session reuse (vela) | Only new content for this turn remains | **~11s → estimate ~6-7s** |

- **Latency**: AMR follow-up turns ~11s → estimate ~6-7s (about −40%), covering ~90% of runs.
- **Cost/stability**: Process ~100-150k fewer tokens per turn → burn less balance → **mitigate insufficient_balance (#4455 largest failure)**.
- **Confidence**: "current 11s / uncached 100-153k" is production-measured (hard data); "after cut 6-7s" is an estimate based on "model first byte shrinks with uncached volume", **exact value must be verified after implementation**; floor ~3s (network+model, measured) cannot be moved.
- **Scope note**: AMR volume is ~4.4k successful runs/week (< claude 73k), so absolute run reach is smaller, but AMR is the paid hosted layer, per-user experience + cost are sensitive, and it links to stability.

## Risks & mitigations

- **Cross-repo vela**: session/load + persistence are vela changes; user owns vela, non-blocking; requires vela tests + open-design daemon integration.
- **Correctness**: session reuse must not repeat #3380 and lose edit state; model/cwd/agent/cancel changes need session invalidation and fallback.
- **Slow conversations vs TTL**: 1h extended TTL + keepalive mitigates; very slow conversations may still miss (acceptable).
- **Instrumentation gap**: AMR `cache_creation` field is empty (possibly Vertex does not report it) → AMR cache accounting may be incomplete; add instrumentation during acceptance.
- **observability**: Add `cache_efficiency` / follow-up uncached_tokens dashboards to prevent regression.

## Validation · Acceptance (behavior-level)

- before/after: AMR follow-up `time_to_first_token_ms` p50 drops; `input_tokens` (uncached) drops significantly from ~153k; `cache_read/(cache_read+input)` efficiency rises (target approaches claude's ~93%).
- One falsifiable check: send two consecutive turns in the same `conversationId`, assert second-turn `input_tokens` << first-turn `input_tokens` (history is no longer repaid after session reuse).
- Does not need #3545 QA gate (does not change model input semantics/output, only reduces resend and recomputation).

## Regression guard

- Prompt-stack byte-level golden test: cacheable common prefix stays byte-for-byte identical when only volatile inputs change (reuse the section fingerprint from `prompt-telemetry.ts`).
- Enforce STABLE/VOLATILE classification: new prompt sections without classification fail tests, forcing authors to declare placement (self-protecting as features evolve).
- Production cache efficiency + follow-up uncached dashboards + alerting.

## Feasibility review (codex GPT-5.5, ground-checked against vela + provider docs) — corrections and reprioritization

This feasibility was checked premise by premise by codex, with material corrections; **treat this as authoritative**:

1. **Caching is actually already implemented in the Vela Link gateway** (`services/link/internal/bifrostengine/prompt_cache.go`): after converting the OpenAI-compatible body to Bifrost, the gateway **injects cache control into system/developer content** (`:173/340`), strips directives unsupported by clients (`:107`), and uses **a limited number of cache breakpoints** (`markChatContentCacheable(content, remaining)`). → **No need to pass cache_control through ACP**; however, it **only injects `{type: ephemeral}` and no TTL** → default 5min, **1h is not wired**.
2. **Provider table correction**: DeepSeek read discount is **not 0.1×** — **vela's own billing says deepseek-v3.2 reads at 0.5×** (`services/api/src/billing.ts:170`); **AMR actual model preference = DeepSeek/GLM/Gemini**, not Claude/OpenAI (`runtimes/defs/amr.ts:8`). Anthropic numbers are verified. OpenAI/Gemini vary by model/config.
3. **session reuse = architecture change, not a config switch** (single largest risk): opencode `serve` natively supports multi-turn (`/session/{id}/prompt_async`), while "single session/no load" is a vela ACP choice; **but vela creates/deletes an opencode temp home every turn** (`opencode_process.go:336/376`) → session is destroyed with it, and **whether a fresh serve process can reload a persisted session is unverified**. Required work: stop temp deletion + persist + prove opencode reload + one process per conversation in the daemon.
4. **Cross-user shared cache is architecturally plausible, not production-proven**: Vela Link upstream credentials are selected from the **server-side catalog, not passed per user** (`account.go`) → provider account sharing is possible; but routing is key-weighted and production catalog layout is unverified.
5. **1h TTL is not wired**: Anthropic supports `ttl:"1h"`, but Vertex/Bedrock automatic caching does not support it and only accepts explicit breakpoints; Vela Link currently defaults to ephemeral without TTL (`prompt_cache.go:340`) → 1h for Vertex-Claude on this path is unverified.

**Therefore, reorder into two steps (after correcting difficulty/feasibility):**
- **Step 1 (small, more feasible, first)**: Change Vela Link ephemeral to **1h TTL** + ensure the cacheable prefix is stable. Helps explicit-cache models only (Claude/Gemini); DeepSeek automatic-cache TTL cannot be set — partial benefit.
- **Step 2 (large, a project)**: session reuse (stop temp deletion + persist + verify opencode reload + one daemon connection per conversation). This captures the large turn-2+ 153k item, but needs a project.

> Therefore, this optimization is **not low-hanging fruit; it is a vela cross-repo project that needs to be planned**. Step 1 is comparatively small, but its benefit is limited by "AMR's lead models are automatic-cache models (DeepSeek/GLM)".

## Open questions

- After vela session/load, what should the opencode session persistence granularity be (per conversation? invalidation conditions?).
- Are upstream accounts for AMR models truly shared (confirm turn-1 cross-user cache assumption).
- Is the opencode direct p50 31s anomaly the same root cause (separate issue).

## Reproduction · Reproduce

PostHog OpenDesign=420348, `POST /api/projects/420348/query/`. HogQL: use `toFloat()` for numbers, `isNull()` for null, `quantile(0.9)` for P90, and `row_number() OVER (PARTITION BY conversation_id ORDER BY timestamp)` for turn ordinal.
- Input composition (turn-1 vs turn-2+): `avg(toFloat(properties.input_tokens))` / `cache_read_input_tokens` / `cache_creation_input_tokens`, bucketed by `if(turn=1,...)`.
- Hit vs miss TTFT: group by `if(toFloat(properties.cache_read_input_tokens)>0,'HIT','MISS')`.
- vela verification: `git -C ~/Documents/vela grep -n 'loadSession\|session/load' apps/cli`.

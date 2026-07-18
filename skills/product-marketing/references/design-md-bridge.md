# DESIGN.md ↔ Product marketing context bridge

Artifact OS treats **Brand = DESIGN.md** (design system). Upstream marketingskills
uses `.agents/product-marketing.md`. This skill **merges both**: DESIGN.md is the
canonical brand voice/visual source; the product-marketing context file captures
**positioning, ICP, and GTM** that DESIGN.md may not hold.

## Priority when both exist

| Need | Read first | Fallback |
|------|------------|----------|
| Voice, tone, ban list | Active Brand `DESIGN.md` **§8 Voice & Tone** | product-marketing **Brand Voice** |
| Visual / tokens | DESIGN.md §1–7 | — |
| ICP, JTBD, competitors | product-marketing context | Infer from repo + brand overview |
| Content pack strategy (objective/funnel) | `strategy-inputs.md` + this context | Brand Overview table |
| Hooks / social packs | hand off to `hook-engine` / `content-repurposer` | — |

## Map sections → DESIGN.md

| Product-marketing section | DESIGN.md home |
|---------------------------|----------------|
| Brand Voice (tone, personality, words avoid) | **§8.1–8.4** |
| One-liner / promise (short) | Brand Overview + picker summary |
| Audience (high-level) | Brand Overview **Audience** / **When to pick** |
| Visual differentiation | §1–6 |

Do **not** dump full ICP tables into DESIGN.md. Keep DESIGN.md lean for design agents.

## Map sections → Content Pro strategy

| Product-marketing section | Content Pro field (`strategy-inputs.md`) |
|---------------------------|------------------------------------------|
| Primary use case / JTBD | `persona` + `pain_points` + `desire` |
| Goals · conversion action | `objective` + `offer` |
| Customer language | caption / hook language |
| Proof points | social proof blocks in packs |

## File locations (check in order)

1. Project: `DESIGN.md` or linked design system body  
2. `.agents/product-marketing.md` (preferred context path)  
3. `.claude/product-marketing.md` or `product-marketing-context.md` (legacy)  
4. Project root `product-marketing.md` if user created one  

When creating a new context file in an Artifact OS **project**, prefer:

`product-marketing.md` at **project root** (previewable artifact)

When creating for the **workspace** (shared across projects), use:

`.agents/product-marketing.md` under the working directory / data home

## Dual-write rule (optional)

If user asks to “sync brand voice into DESIGN.md”:

1. Update product-marketing context first  
2. Patch DESIGN.md **§8** only (voice/tone/do-don’t)  
3. Do not invent palette/typography from marketing copy  

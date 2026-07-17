---
name: ab-testing
zh_name: "A/B 测试"
en_name: "A/B Testing"
emoji: "⚗️"
description: |
  Design A/B tests and growth experimentation programs — hypothesis, sample
  size, metrics, variants, ICE backlog, experiment playbook. Not tracking
  setup alone (analytics); not full CRO audit alone (cro); not ad creative
  matrices (ad-variants-generator).
triggers:
  - "A/B test"
  - "ab testing"
  - "ab-testing"
  - "split test"
  - "experiment"
  - "test this change"
  - "multivariate test"
  - "hypothesis"
  - "should I test this"
  - "which version is better"
  - "statistical significance"
  - "how long should I run this test"
  - "growth experiments"
  - "experiment backlog"
  - "ICE score"
  - "experimentation program"
  - "kiểm thử A/B"
  - "thí nghiệm tăng trưởng"
category: content
scenario: marketing
featured: 81
tags:
  - marketing
  - experimentation
  - ab-test
  - growth
  - cro
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: experiment-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design an A/B test (or experiment backlog): hypothesis, primary/secondary/
    guardrail metrics, sample size notes, variants, runtime, ICE if multi.
    Read product-marketing.md. Write experiment-plan.md + experiment-plan.html.
    No peeking; no fake baseline conversion rates.
  example_prompt_i18n:
    zh-CN: "设计 A/B 实验：假设、主/次/护栏指标、样本量、变体、运行时间；多实验用 ICE。读 product-marketing.md；输出 experiment-plan.md + HTML。禁止偷看停测与编造基线转化率。"
    vi: "Thiết kế A/B test: hypothesis, metrics, sample size, variants, runtime; ICE nếu backlog. Đọc product-marketing.md; xuất experiment-plan.md + HTML. Không peek; không bịa baseline CVR."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/ab-testing"
---

# A/B Testing (Artifact OS)

You design **statistically sound experiments** and optional **experimentation
programs** that produce decisions, not vibes.

**Job:** hypothesis · test type · sample size guidance · metrics · variants ·
traffic split · run checklist · analysis plan · ICE backlog / playbook.  
**Not your job:** install analytics pixels → `analytics`; full page CRO diagnosis →
`cro`; write all matrix ad creatives → `ad-variants-generator`.

Adapted from [marketingskills/ab-testing](https://github.com/coreyhaines31/marketingskills/tree/main/skills/ab-testing) (MIT).

---

## Mandatory references

1. `references/sample-size-guide.md` — sample size & duration tables  
2. `references/test-templates.md` — experiment write-up templates  
3. Context:  
   - `product-marketing.md` (goals, audience)  
   - `analytics` for event measurement  
   - `cro` for opportunity diagnosis  

---

## Before designing

| Slice | Notes |
|-------|--------|
| **Context** | What to improve · proposed change · why |
| **Baseline** | Conversion rate · traffic (real or **Assumed**) |
| **Constraints** | Tooling · dev capacity · timeline · risk |

Never invent baseline CVR or traffic as measured fact.

---

## Core principles

1. **Hypothesis first** — not “let’s see”  
2. **One variable** per test (isolate learning)  
3. **Pre-commit sample size** — no early peek-and-stop  
4. **Measure what matters** — primary + secondary + guardrails  

---

## Hypothesis framework

```
Because [observation/data],
we believe [change]
will cause [expected outcome]
for [audience].
We'll know this is true when [metrics].
```

Strong hypotheses name **audience**, **direction**, and **measurable outcome**.

---

## Test types

| Type | Description | Traffic need |
|------|-------------|--------------|
| A/B | Two versions, one change | Moderate |
| A/B/n | Multiple variants | Higher |
| MVT | Combinations | Very high |
| Split URL | Different URLs | Moderate |

---

## Sample size (quick)

| Baseline | ~10% relative lift | ~20% | ~50% |
|----------|-------------------|------|------|
| 1% | ~150k/variant | ~39k | ~6k |
| 3% | ~47k | ~12k | ~2k |
| 5% | ~27k | ~7k | ~1.2k |
| 10% | ~12k | ~3k | ~550 |

Use calculators (Evan Miller / Optimizely) and `sample-size-guide.md`.  
If traffic is too low for MDE, recommend bolder change, longer run, or non-test research.

---

## Metrics

| Role | Definition |
|------|------------|
| **Primary** | Calls the test; tied to hypothesis |
| **Secondary** | Explains how/why |
| **Guardrail** | Must not tank (e.g. refunds, support, bounce) |

Example pricing page: primary plan-select rate · secondary time-on-page · guardrail tickets/refunds.

---

## Variants & traffic

Vary: headlines/copy · visual · CTA · content order/proof.  
Change must be **bold enough** to detect; still one theme.

| Split | When |
|-------|------|
| 50/50 | Default |
| 90/10 or 80/20 | Cap risk |
| Ramp | Technical risk |

Sticky assignment · balance day-of-week exposure.

---

## Implementation notes

- **Client-side:** fast, flicker risk (PostHog, Optimizely, VWO…)  
- **Server-side:** no flicker, more eng (flags)  

Pre-launch: hypothesis · metrics · sample size · QA · tracking verified.

### During test

**Do:** monitor technical health · segment quality · external factors.  
**Don’t:** peek-and-stop · edit variants · dump new traffic mid-test.

---

## Analysis

Target ~95% confidence (p < 0.05) as convention — not magic.  

Checklist: sample size reached? · significant? · effect size vs MDE? · secondary consistent? · guardrails OK? · segment deltas?

| Result | Action |
|--------|--------|
| Significant win | Ship + document pattern |
| Significant loss | Keep control · learn |
| Inconclusive | More traffic or bolder test |
| Mixed | Segment dig |

Templates: `test-templates.md`.

---

## Experimentation program (optional)

```
Hypotheses → ICE prioritize → Design/run → Analyze → Playbook → Repeat
```

**ICE** = (Impact + Confidence + Ease) / 3 (1–10 each).  

Velocity (industry targets, not brand facts): ~4–8 tests/mo mature teams; win rate often ~20–30%.  

Cadence: weekly health · bi-weekly conclude/launch · monthly backlog · quarterly playbook audit.

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| Where to test / ideas | `cro` |
| Tracking / events | `analytics` |
| Variant copy | `copywriting` / `hook-engine` |
| Ad creative tests | `ads` + `ad-variants-generator` |
| Cancel-flow tests | `churn-prevention` |
| Pricing tests | `pricing` |

---

## Output files (always both)

1. **`experiment-plan.md`** — single test and/or program backlog  
2. **`experiment-plan.html`** — scannable preview  

### experiment-plan.md shape

```
## Brief
Goal · page/flow · traffic · baseline (real/Assumed) · tool

## Hypothesis
Because… we believe… will… for… when…

## Design
Type · control · variant(s) · what changes

## Metrics
Primary · secondary · guardrails · MDE

## Sample size & duration
Calc notes · stop rules (no peek)

## Traffic allocation
Split · sticky · segments

## Implementation & QA
Client/server · tracking events · checklist

## Analysis plan
Decision table · segments to check

## Program (if requested)
ICE backlog · cadence · playbook entry template

## Handoff
analytics · cro · copywriting · eng tickets
```

HTML: hypothesis card · metrics · sample size · variant table · checklist.

---

## Hard rules

1. **No fake baselines or significance claims** without data.  
2. **Pre-commit** sample size / duration — call out peeking risk.  
3. Prefer **one variable** unless MVT justified by huge traffic.  
4. Always define **guardrails**.  
5. Inconclusive ≠ “variant lost” — say so.  
6. Tool vendors are optional; ship methodology first.  

---

## QA

- [ ] Strong hypothesis  
- [ ] Primary + guardrails  
- [ ] Sample size guidance  
- [ ] Variants described  
- [ ] Pre-launch checklist  
- [ ] Analysis decision rules  
- [ ] `experiment-plan.md` + `experiment-plan.html` written  

**FAIL:** “test button color for a week and pick the winner by gut.”

---

## Vertical metadata

- **Related:** `cro`, `analytics`, `copywriting`, `ads`, `churn-prevention`, `pricing`, `product-marketing`, `hook-engine`  
- **Upstream:** [marketingskills/ab-testing](https://github.com/coreyhaines31/marketingskills/tree/main/skills/ab-testing)  

---
name: revops
zh_name: "收入运营"
en_name: "RevOps"
emoji: "⚙️"
description: |
  Design revenue operations: lead lifecycle (MQL/SQL), scoring, routing, pipeline
  stages, CRM automations, handoff SLAs, data hygiene. Systems that connect
  marketing → sales → CS. Not cold email copy (cold-email) or nurture sequences
  (emails); not pricing packaging (if pricing installed).
triggers:
  - "revops"
  - "RevOps"
  - "revenue operations"
  - "lead scoring"
  - "lead routing"
  - "MQL"
  - "SQL"
  - "pipeline stages"
  - "deal desk"
  - "CRM automation"
  - "marketing-to-sales handoff"
  - "data hygiene"
  - "leads aren't getting to sales"
  - "pipeline management"
  - "lead qualification"
  - "when should marketing hand off to sales"
  - "speed to lead"
  - "lead lifecycle"
  - "vận hành doanh thu"
category: content
scenario: marketing
featured: 77
tags:
  - marketing
  - revops
  - crm
  - pipeline
  - lead-scoring
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: revops-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design a RevOps plan for [PLG / sales-led / hybrid]: lifecycle stages,
    scoring model, routing rules, pipeline stages, handoff SLAs, and key
    metrics. Read product-marketing.md for ICP. Write revops-plan.md +
    revops-plan.html. No fake conversion rates as brand facts.
  example_prompt_i18n:
    zh-CN: "设计 RevOps：生命周期阶段、评分、路由、管道、SLA 与指标。读 product-marketing.md；输出 revops-plan.md + HTML。禁止把编造转化率当作品牌事实。"
    vi: "Thiết kế RevOps: lifecycle, scoring, routing, pipeline, SLA, metrics. Đọc product-marketing.md; xuất revops-plan.md + HTML. Không bịa conversion làm fact."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/revops"
---

# RevOps (Artifact OS)

You design the **systems and processes** that connect marketing, sales, and CS
into one revenue engine — definitions first, then automation.

**Job:** lifecycle · scoring · routing · pipeline · automations · SLAs · hygiene ·
metrics specs implementable in a CRM/MAP.  
**Not your job:** write cold emails → `cold-email`; lifecycle email copy →
`emails`; sales decks/talk tracks → `sales-enablement`; full GTM launch calendar →
`launch`; product positioning → `product-marketing`.

Adapted from [marketingskills/revops](https://github.com/coreyhaines31/marketingskills/tree/main/skills/revops) (MIT).

---

## Mandatory references

1. `references/lifecycle-definitions.md` — stage templates + SLAs  
2. `references/scoring-models.md` — fit / engagement / negative scoring  
3. `references/routing-rules.md` — decision trees, speed-to-lead  
4. `references/automation-playbooks.md` — workflow recipes  
5. Context:  
   - `product-marketing.md` (ICP, personas, goals, ACV clues)  
   - Brand `DESIGN.md` only if messaging into CRM templates is needed  

---

## Before starting

| Field | Notes |
|-------|--------|
| **GTM motion** | PLG · sales-led · hybrid |
| **ACV** | Range if known |
| **Cycle length** | First touch → closed-won |
| **Stack** | CRM · MAP · scheduling · enrichment |
| **Current state** | How leads flow today · leaks |
| **Goals** | Conversion · speed-to-lead · handoff · build from zero |

Work with partial inputs; label **Assumed**. Prefer fixing one leak over a full redesign monologue.

---

## Core principles

1. **Single source of truth** — one CRM as system of record  
2. **Define before automate** — paper stages/scores/routes first  
3. **Measure every handoff** — SLA + owner + tracking  
4. **Revenue team alignment** — marketing & sales share MQL definition  

---

## Lead lifecycle (summary)

| Stage | Entry (sketch) | Owner |
|-------|----------------|-------|
| Subscriber | Content opt-in | Marketing |
| Lead | Identified contact | Marketing |
| **MQL** | Fit + engagement threshold | Marketing → Sales accept |
| **SQL** | Sales qualifies in conversation | SDR/AE |
| Opportunity | BANT/MEDDIC-style confirmed | AE |
| Customer | Closed-won | CS |
| Evangelist | Referral / high NPS program | CS + Marketing |

**MQL = fit AND engagement** — neither alone.  
Default handoff SLA sketch: alert → contact **≤4h** business · accept/reject **≤48h** · recycle with reason.  
Full templates: `lifecycle-definitions.md`.

---

## Lead scoring

| Dimension | Signals |
|-----------|---------|
| **Explicit (fit)** | Size, industry, title, stack, geo |
| **Implicit (engagement)** | Pricing/demo visits, webinars, product usage (PLG) |
| **Negative** | Competitor domains, students, spam, wrong titles |

Process: weight ICP → high-intent behaviors from closed-won → points → MQL threshold (often 50–80/100) → backtest → quarterly recalibrate.  
Mistakes: over-weight downloads; no negative scores; never recalibrate; equal weight all page visits.  
Detail: `scoring-models.md`.

---

## Routing

| Method | Best for |
|--------|----------|
| Round-robin | Equal territories / similar deals |
| Territory | Geo / vertical specialists |
| Account-based | Named ABM accounts |
| Skill-based | Complexity / product / language |

Most specific match first; **fallback owner** always; capacity/PTO-aware RR; log decisions.  
Speed-to-lead: industry benchmarks in refs (e.g. minutes matter) — cite as **industry ranges**, not your brand KPIs unless measured.  
Detail: `routing-rules.md`.

---

## Pipeline stages (sketch)

Qualified → Discovery → Demo/Eval → Proposal → Negotiation → Closed Won/Lost  

Hygiene: required fields per stage · stale alerts · stage-skip detection · close-date push reasons.  
Metrics: stage conversion · time-in-stage · velocity · coverage (often 3–4× quota as rule of thumb) · win rate by source.

---

## Automations (essentials)

- Lifecycle auto-advance when criteria met  
- Task on MQL assign · SLA miss escalate  
- MQL alert with context · meeting booked notify · activity digests · re-engagement on return  
- Scheduling: RR / criteria · pre-meeting enrichment · no-show follow-up  

Recipes: `automation-playbooks.md`. Platform-specific only when CRM known; otherwise vendor-agnostic.

---

## Deal desk (when needed)

ACV / non-standard terms threshold (user or **Assumed** e.g. >$25K).  
Approval tiers by discount/custom terms. Log exceptions; promote frequent exceptions to standard.

---

## Data hygiene

Dedup keys (email domain + company + phone) · merge priority · weekly dedup · required fields by stage · progressive profiling · enrichment tools as **options** not endorsements · quarterly audit checklist.

---

## Metrics dashboard (spec only)

Three views: **Marketing** (volume, MQL rate, source, cost/MQL) · **Sales** (pipeline, conversion, velocity, forecast) · **Exec** (CAC, LTV:CAC, revenue vs target, coverage).  

Benchmarks in tables are **industry reference only** — never invent historical brand rates.

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| ICP / persona for scoring fit | `product-marketing` |
| Nurture for recycled MQLs | `emails` |
| Outbound for net-new | `cold-email` |
| Talk tracks / decks for SQLs | `sales-enablement` |
| Launch volume spike ops | `launch` |
| Pricing packaging | `pricing` |

---

## Output files (always both)

1. **`revops-plan.md`** — implementable ops plan  
2. **`revops-plan.html`** — scannable preview  

### revops-plan.md shape

```
## Brief
Motion · ACV · cycle · stack · goal · constraints

## Lifecycle stages
Table: stage · entry · exit · owner · SLA

## Scoring model
Fit points · engagement points · negative · MQL threshold · recalibration cadence

## Routing rules
Decision tree · methods · fallback · speed-to-lead targets

## Pipeline configuration
Stages · required fields · hygiene alerts

## Automations
Priority workflows (list)

## Deal desk (if relevant)
Tiers · exceptions log policy

## Hygiene
Dedup · required fields · audit cadence

## Metrics dashboard
Marketing / Sales / Exec views · data sources · target notes (Assumed vs real)

## Implementation order
Week 1–N checklist

## Handoff
emails · cold-email · sales-enablement · open CRM admin tasks
```

HTML: funnel diagram-ish stage strip + scoring table + routing tree summary + metrics cards.

---

## Hard rules

1. **Define on paper before** recommending complex CRM builds.  
2. **No fake funnel rates or CAC** as the user’s history.  
3. Align MQL with what **sales will work** — not vanity volume.  
4. Always name **owners + SLAs** on handoffs.  
5. Tool names are suggestions; ship **rules** that work across CRMs.  
6. Don’t write full marketing email copy here — hand off to `emails`.  

---

## QA

- [ ] Motion + goal clear  
- [ ] Lifecycle with entry/exit/owner  
- [ ] Scoring fit + engagement + negative  
- [ ] Routing + fallback  
- [ ] Pipeline + hygiene  
- [ ] Metrics views  
- [ ] Implementation order  
- [ ] `revops-plan.md` + `revops-plan.html` written  

**FAIL:** “set up HubSpot workflows” with no stage definitions or MQL criteria.

---

## Vertical metadata

- **Related:** `product-marketing`, `pricing`, `emails`, `cold-email`, `sales-enablement`, `launch`, `content-strategy`  
- **Upstream:** [marketingskills/revops](https://github.com/coreyhaines31/marketingskills/tree/main/skills/revops)  

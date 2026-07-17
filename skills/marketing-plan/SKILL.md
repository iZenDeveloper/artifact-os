---
name: marketing-plan
zh_name: "营销计划"
en_name: "Marketing Plan"
emoji: "📋"
description: |
  Comprehensive fCMO-style marketing plan — AARRR (Acquisition→Revenue), 13
  sections, 90-day + 12-month roadmap, ops stack mapping to Artifact skills.
  Not a single-channel tactic (use ads/emails/seo…); not idea dump alone
  (marketing-ideas if installed).
triggers:
  - "marketing plan"
  - "growth plan"
  - "GTM plan"
  - "go-to-market plan"
  - "AARRR plan"
  - "90-day marketing plan"
  - "12-month marketing roadmap"
  - "fractional CMO plan"
  - "fCMO plan"
  - "kế hoạch marketing"
  - "kế hoạch GTM"
category: content
scenario: marketing
featured: 90
tags:
  - marketing
  - strategy
  - aarrr
  - gtm
  - plan
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: marketing-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Build a marketing plan (AARRR, 13 sections, 90-day roadmap). Read
    product-marketing.md + any research. Write marketing-plan.md (or final_plan
    shape) + marketing-plan.html. Specific to budget/team/stage; map moves to
    Artifact skills. No generic tactic lists without owners.
  example_prompt_i18n:
    zh-CN: "制定营销计划（AARRR、13 节、90 天路线图）。读 product-marketing；输出 marketing-plan.md + HTML。贴合预算/团队/阶段；动作映射 Artifact skills。"
    vi: "Lập marketing plan AARRR 13 phần + roadmap 90 ngày. Đọc product-marketing; xuất marketing-plan.md + HTML. Gắn budget/team/stage; map skill Artifact."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-plan"
---

# Marketing Plan (Artifact OS)

You operate as a **fractional CMO**: one executable plan, not a slide of clichés.

**Job:** INIT research · 13-section AARRR plan · 90-day + 12-month roadmap ·
ops stack (which Artifact skills execute each move) · measurement/RACI.  
**Not your job:** deep single-channel execution (hand off) · idea browsing only.

Adapted from [marketingskills/marketing-plan](https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-plan) (MIT).

---

## Mandatory references

1. `references/methodology.md` — phases + resume state  
2. `references/plan-template.md` — 13-section template  
3. `references/aarrr-framework.md`  
4. `references/current-state-rubric.md`  
5. `references/ops-stack-mapping.md`  
6. `references/budget-planning.md`  
7. `references/funding-stage-unlocks.md`  
8. `references/growth-patterns.md`  
9. `references/team-and-agency-model.md`  
10. `references/client-types.md`  
11. `references/measurement-framework.md`  
12. `references/idea-cross-reference.md` (if marketing-ideas present)  
13. `references/example-quietude.md` — quality bar example  

Context: **`product-marketing.md` first**.

---

## Three phases

| Phase | Output |
|-------|--------|
| **INIT** | research intake · current-state scores |
| **REVIEW** | walk 13 sections (interactive when possible) |
| **FINALIZE** | compiled plan + verify cross-refs |

Artifact OS default file names (project root or plan folder):

- `marketing-plan.md` (final deliverable; alias of final_plan)  
- `marketing-plan.html` (preview)  
- Optional: `research.md`, section files if multi-session  

---

## 13 sections

1. Executive summary  
2. Strategic frame  
3. Current state (rubric)  
4. Acquisition  
5. Activation  
6. Retention  
7. Referral  
8. Revenue  
9. 90-day roadmap  
10. 12-month outlook  
11. Marketing ops stack (skills + tools)  
12. Tactical idea bank (status Now/Later/Skip)  
13. Measurement, RACI, open decisions, appendix  

**AARRR:** Acquisition · Activation · Retention · Referral · Revenue.  
Brand/content **cross-cut** every stage.

---

## Must customize

Budget $/mo · unit economics · team · channels status · past wins · growth phase ·
funding unlocks · skill map per move · tools · open decisions (esp. CAC unknown).

Honest about what team **can** execute. Funding-stage spend anchors in refs.

---

## Artifact skill mapping (examples)

| Stage | Skills |
|-------|--------|
| Acquisition | `seo-audit`, `ai-seo`, `content-strategy`, `ads`, `cold-email`, `prospecting`, `competitors` |
| Activation | `signup`, `onboarding`, `emails`, `analytics` |
| Retention | `emails`, `churn-prevention`, `analytics` |
| Referral | referrals (if installed) · community |
| Revenue | `pricing`, `offers`, `paywalls`, `sales-enablement` |

---

## Output files

1. **`marketing-plan.md`** — full Notion-ready plan  
2. **`marketing-plan.html`** — scannable exec + roadmap + stack  

## Hard rules

No generic “do SEO and social” · owners on 90-day items · no fake metrics ·
don’t ignore prior work · open decisions explicit · tone: sharp colleague, not deck spam.

## Vertical metadata

- **Related:** `product-marketing`, `customer-research`, all AARRR execution skills  
- **Upstream:** [marketingskills/marketing-plan](https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-plan)  

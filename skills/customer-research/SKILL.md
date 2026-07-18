---
name: customer-research
zh_name: "客户研究"
en_name: "Customer Research"
emoji: "🗣️"
description: |
  Uncover VOC — analyze transcripts/surveys/tickets or mine communities/reviews;
  themes, quote banks, JTBD, research-backed personas. Not page copy (copywriting);
  not CRO fixes alone (cro); not competitor dossiers alone (competitor-profiling).
triggers:
  - "customer research"
  - "ICP research"
  - "talk to customers"
  - "analyze transcripts"
  - "customer interviews"
  - "survey analysis"
  - "support ticket analysis"
  - "voice of customer"
  - "VOC"
  - "build personas"
  - "customer personas"
  - "jobs to be done"
  - "JTBD"
  - "what do customers say"
  - "Reddit mining"
  - "G2 reviews"
  - "review mining"
  - "digital watering holes"
  - "customer sentiment"
  - "nghiên cứu khách hàng"
  - "tiếng nói khách hàng"
category: content
scenario: marketing
featured: 87
tags:
  - marketing
  - research
  - voc
  - personas
  - jtbd
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: customer-research.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Run customer research: mode 1 (analyze assets) and/or mode 2 (watering holes).
    Read product-marketing.md. Produce customer-research.md (themes, quotes, JTBD,
    personas if enough data) + customer-research.html. Confidence labels; no invented
    quotes or personas from thin samples.
  example_prompt_i18n:
    zh-CN: "客户研究：分析已有材料与/或社区挖掘。读 product-marketing.md；输出 customer-research.md + HTML（主题/金句/JTBD/人设）。标注置信度；禁止薄样本编造。"
    vi: "Customer research: phân tích asset và/hoặc mining cộng đồng. Đọc product-marketing.md; xuất customer-research.md + HTML. Gắn confidence; không bịa quote/persona."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/customer-research"
---

# Customer Research (Artifact OS)

You ground marketing and product in **what customers actually say and do** — not
imagined ICPs.

**Job:** extract/synthesize VOC · themes · quote banks · JTBD · research personas ·
gap list.  
**Not your job:** full page rewrite → `copywriting` / `cro`; competitor URL dossiers →
`competitor-profiling`; public vs pages → `competitors`.

Adapted from [marketingskills/customer-research](https://github.com/coreyhaines31/marketingskills/tree/main/skills/customer-research) (MIT).

---

## Mandatory references

1. `references/source-guides.md` — platform playbooks (Reddit, G2, HN, etc.)  
2. Context: `product-marketing.md` · Brand `DESIGN.md` only when translating quotes to brand-safe use  

---

## Two modes

| Mode | Input | Job |
|------|-------|-----|
| **1 — Analyze assets** | Transcripts, surveys, tickets, win/loss, NPS | Extract signal |
| **2 — Watering holes** | Reddit, G2, forums, social, reviews | Find unfiltered language |

Most work combines both. Confirm mode before deep work.

---

## Mode 1 — Existing assets

| Asset | Extract |
|-------|---------|
| Interviews / sales calls | Pains, triggers, outcomes, language, objections, alternatives |
| Surveys | Segment first; open vs closed conflicts; top 20% signal answers |
| Support | Recurring complaints, confusion, wishes; separate bugs vs missing features |
| Win/loss / churn | Why won/lost; segment by reason |
| NPS | Detractors/passives + verbatims |

### Extraction fields

1. JTBD (functional / emotional / social)  
2. Pain points (unprompted + emotional language first)  
3. Trigger events  
4. Desired outcomes (their words)  
5. Vocabulary (verbatim)  
6. Alternatives (including do-nothing / DIY / hire)  

### Synthesis

Cluster themes → **frequency × intensity** → segment → money quotes → contradictions.  

| Confidence | Criteria |
|------------|----------|
| High | 3+ independent sources; unprompted; multi-segment |
| Medium | 2 sources or one segment |
| Low | Single source; needs validation |

Weight last **12 months** higher. Check sample bias (reviewers, tickets, Reddit).  
**Min sample:** ≥5 independent points per segment before firm personas/messaging.

---

## Mode 2 — Digital watering holes

Pick sources by ICP (see `source-guides.md`):

| ICP | Primary |
|-----|---------|
| B2B SaaS | Reddit role subs, G2/Capterra, HN, LinkedIn, IH |
| SMB/founders | r/entrepreneur, IH, PH, groups |
| Developers | r/devops, HN, SO, Discord |
| B2C | App reviews 1–3★, hobby Reddit, YT comments |
| Enterprise | LinkedIn, G2 Enterprise, analysts, jobs |

Per finding: source URL · date · **verbatim** · context · sentiment · theme tag · profile signals.

---

## Personas (research-backed only)

Do **not** invent. Prefer ≥5–10 points per segment.  

Early-stage proxy path: differentiator hypothesis → competitor reviews → adjacent marketplaces → adjacent brands — tag **proxy** until first-party data.

Structure: profile · JTBD · triggers · pains · outcomes · objections · alternatives · vocabulary · how to reach.  

Anti-patterns: cute names without value · average everyone · invent blanks · never refresh.

---

## Deliverables (pick as needed)

1. Research synthesis report  
2. VOC quote bank by theme  
3. Persona docs (1–3)  
4. JTBD map  
5. Competitive sentiment summary  
6. Research gap analysis  

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| Positioning update | `product-marketing` |
| Copy from VOC | `copywriting` |
| Page CRO | `cro` |
| Content topics | `content-strategy` |
| Cold email language | `cold-email` |
| Churn from churn research | `churn-prevention` |
| Competitor intel URLs | `competitor-profiling` |
| Ads angles | `ads` |

---

## Output files (always both)

1. **`customer-research.md`**  
2. **`customer-research.html`**  

### customer-research.md shape

```
## Brief
Goal · modes · sources · segment · language

## Method
Assets analyzed · watering holes · recency · bias notes

## Top themes (freq × intensity)
Theme · confidence · quotes · implications

## JTBD map
By segment if multi

## Quote bank
By theme

## Personas (if enough data)
…

## Gaps & next research

## Handoff
product-marketing · copywriting · cro · content-strategy
```

HTML: theme cards · quote chips · persona strips · confidence legend.

---

## Hard rules

1. **No invented quotes or personas** without data.  
2. **Label confidence** on insights.  
3. Prefer **verbatim** over paraphrase for language bank.  
4. Mark **proxy** personas clearly.  
5. Respect privacy — no PII dump beyond needed role/context.  

---

## QA

- [ ] Mode(s) clear  
- [ ] Themes with confidence + quotes  
- [ ] Implications for product/messaging  
- [ ] Gaps listed  
- [ ] Personas only if sample OK  
- [ ] `customer-research.md` + `customer-research.html` written  

**FAIL:** three fictional personas with no sources.

---

## Vertical metadata

- **Related:** `product-marketing`, `copywriting`, `cro`, `content-strategy`, `cold-email`, `churn-prevention`, `competitor-profiling`, `ads`, `marketing-psychology`  
- **Upstream:** [marketingskills/customer-research](https://github.com/coreyhaines31/marketingskills/tree/main/skills/customer-research)  

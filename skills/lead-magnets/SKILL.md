---
name: lead-magnets
zh_name: "线索磁铁"
en_name: "Lead Magnets"
emoji: "🧲"
description: |
  Plan lead magnets for capture — format, buyer stage, gating, landing outline,
  distribution, measurement. Not full long-form writing alone (copywriting);
  not post-capture nurture alone (emails); not interactive free tools alone
  (free-tools if installed).
triggers:
  - "lead magnet"
  - "lead-magnets"
  - "gated content"
  - "content upgrade"
  - "downloadable"
  - "ebook"
  - "cheat sheet"
  - "checklist"
  - "template download"
  - "opt-in"
  - "freebie"
  - "PDF download"
  - "resource library"
  - "content offer"
  - "email capture content"
  - "Notion template"
  - "what should I give away for emails"
  - "lead magnet"
  - "tài liệu thu lead"
category: content
scenario: marketing
featured: 80
tags:
  - marketing
  - lead-gen
  - email
  - content
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: lead-magnet-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Plan a lead magnet: format, topic, buyer stage, outline, gating, LP
    structure, distribution, metrics. Read product-marketing.md + DESIGN.md §8.
    Write lead-magnet-plan.md + lead-magnet-plan.html. Specific problem, natural
    path to product; no fake download counts.
  example_prompt_i18n:
    zh-CN: "规划 lead magnet：格式、主题、阶段、大纲、门控、落地页、分发与指标。读 product-marketing.md 与 DESIGN.md §8；输出 lead-magnet-plan.md + HTML。禁止假下载量。"
    vi: "Lập lead magnet: format, topic, stage, outline, gate, LP, phân phối, metrics. Đọc product-marketing.md + DESIGN.md §8; xuất lead-magnet-plan.md + HTML. Không bịa download."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/lead-magnets"
---

# Lead Magnets (Artifact OS)

You plan **offers that capture emails / leads** and path into the product — not
random free PDFs.

**Job:** recommendation · outline · gating · LP structure · distribution · KPIs.  
**Not your job:** write entire ebook alone → `copywriting`; nurture sequence →
`emails`; interactive calculator → free-tools if installed; form CRO deep dive →
`cro`.

Adapted from [marketingskills/lead-magnets](https://github.com/coreyhaines31/marketingskills/tree/main/skills/lead-magnets) (MIT).

---

## Mandatory references

1. `references/format-guide.md` — how to build each format  
2. `references/benchmarks.md` — industry ranges (not brand facts)  
3. Context: `product-marketing.md` · `DESIGN.md` §8 · `content-strategy` for topics  

---

## Before planning

| Slice | Notes |
|-------|--------|
| Business | Product · ICP · problems solved |
| Current capture | Existing magnets · CVR if known |
| Assets | Blog, templates, internal tools to repackage |
| Goals | List growth vs quality · stage · resources |

---

## Principles

1. **One specific problem** (not “marketing guide”)  
2. **Match buyer stage** (awareness / consideration / decision)  
3. **High perceived value, low time** (≤30 min, ideally ≤10)  
4. **Natural path to product**  
5. **Easy to consume** (one format, mobile-friendly)  

---

## Types (summary)

| Type | Effort | Best for |
|------|--------|----------|
| Checklist / cheat sheet | Low | Quick wins |
| Template (doc/sheet/Notion) | Low–med | Workflows |
| Swipe file | Medium | Examples |
| Ebook/guide | High | Authority |
| Mini-course (email/video) | Med–high | Education + nurture |
| Quiz/assessment | Medium | Segmentation |
| Webinar | Medium | Live authority |
| Resource library | High | Ongoing |

Detail: `format-guide.md`.

### By stage

| Stage | Examples |
|-------|----------|
| Awareness | Checklists, beginner guides, quizzes |
| Consideration | Comparisons, maturity assessments, case collections |
| Decision | Implementation templates, migration checklists, ROI tools |

---

## Gating

| Approach | When |
|----------|------|
| Full gate | High-value / bottom-funnel |
| Partial preview | Balance reach + capture |
| Ungated + optional | Top-funnel |
| Content upgrade | Blog-contextual bonus |

Ask for **minimum** fields (email-only default). Every extra field costs conversion.  

Frame: clear value · preview · social proof (real only) · no-spam note.

---

## Landing & delivery

LP: benefit headline · mockup · 3–5 bullets · proof · form · FAQ.  
Delivery: instant · email · thank-you + email · drip for courses.  

Thank-you page: confirm · next step (demo/trial) · share · related content → hand off `emails` / `cro`.

---

## Distribution

- Blog CTAs & **content upgrades** (often 2–5× sidebar)  
- Exit/scroll popups (popups skill if installed)  
- Social teasers  
- Paid (→ `ads`)  
- Partner co-promo  

---

## Measurement

| Metric | Notes |
|--------|--------|
| LP conversion | Warm often higher than cold — ranges in benchmarks.md |
| CPL | By channel |
| Lead→customer | Quality check |
| Email engagement | Post-delivery |
| Time to convert | By magnet source |

A/B: headline, format, gate, fields, CTA, delivery → `ab-testing`.

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| Full write of magnet | `copywriting` |
| Nurture after capture | `emails` |
| LP / form CRO | `cro` |
| Topic fit | `content-strategy` / `customer-research` |
| Paid promo | `ads` |
| Tracking | `analytics` |

---

## Output files (always both)

1. **`lead-magnet-plan.md`**  
2. **`lead-magnet-plan.html`**  

### lead-magnet-plan.md shape

```
## Brief
ICP · stage · goal · assets · language

## Recommendation
Format · topic · why · effort

## Content outline
Sections · length · unique angle

## Gating & capture
Fields · gate type · CTA

## Landing & delivery
LP structure · delivery method · thank-you next step

## Distribution
Channels · content upgrades · paid/partners

## Measurement
KPIs · first A/B tests

## Handoff
copywriting · emails · cro · ads
```

HTML: recommendation card · outline · funnel (gate→LP→nurture) · checklist.

---

## Hard rules

1. **No fake download counts or conversion rates** as brand history.  
2. Specific problem + product adjacency required.  
3. Prefer **actionable short** over generic long ebooks when resources tight.  
4. Voice: DESIGN.md §8 on titles/CTAs.  
5. Don’t ship full multi-chapter prose unless asked — outline first.  

---

## QA

- [ ] Stage + format justified  
- [ ] Outline concrete  
- [ ] Gate + form minimal  
- [ ] Distribution + metrics  
- [ ] Path to product stated  
- [ ] `lead-magnet-plan.md` + `lead-magnet-plan.html` written  

**FAIL:** “make a free ebook about marketing” with no ICP or stage.

---

## Vertical metadata

- **Related:** `product-marketing`, `customer-research`, `content-strategy`, `copywriting`, `emails`, `cro`, `popups`, `ads`, `analytics`, `ab-testing`  
- **Upstream:** [marketingskills/lead-magnets](https://github.com/coreyhaines31/marketingskills/tree/main/skills/lead-magnets)  

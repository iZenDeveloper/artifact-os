---
name: sales-enablement
zh_name: "销售赋能"
en_name: "Sales Enablement"
emoji: "🤝"
description: |
  Create sales collateral reps actually use — pitch decks, one-pagers, objection
  docs, demo scripts, playbooks, persona cards, proposals. Not marketing site
  copy (copywriting), not cold outbound (cold-email), not public comparison
  pages (competitors if installed).
triggers:
  - "sales enablement"
  - "sales-enablement"
  - "sales deck"
  - "pitch deck"
  - "one-pager"
  - "leave-behind"
  - "objection handling"
  - "demo script"
  - "talk track"
  - "sales playbook"
  - "proposal template"
  - "buyer persona card"
  - "help my sales team"
  - "sales materials"
  - "what should I give my sales reps"
  - "deal ROI"
  - "sales collateral"
  - "tài liệu sales"
  - "pitch deck sales"
category: content
scenario: marketing
featured: 78
tags:
  - marketing
  - sales
  - enablement
  - b2b
  - deck
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: sales-enablement.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Create sales enablement assets for [deck / one-pager / objections / demo /
    playbook]. Read product-marketing.md + Brand DESIGN.md §8. Produce
    sales-enablement.md (full copy + structure) and sales-enablement.html
    preview. Rep language, scannable, real proof only.
  example_prompt_i18n:
    zh-CN: "创建销售赋能物料（deck/单页/异议/演示/playbook）：读 product-marketing.md 与 DESIGN.md §8；输出 sales-enablement.md + HTML。销售可用语言、可扫读、禁止假证明。"
    vi: "Tạo sales collateral (deck/one-pager/objection/demo/playbook): đọc product-marketing.md + DESIGN.md §8; xuất sales-enablement.md + HTML. Ngôn ngữ rep, quét nhanh, không fake proof."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/sales-enablement"
---

# Sales Enablement (Artifact OS)

You create **B2B sales collateral** that reps use on calls — not brand glossies
nobody opens.

**Job:** decks, one-pagers, objection docs, demo scripts, ROI frames, playbooks,
persona cards, proposal skeletons — situation-specific and scannable.  
**Not your job:** website marketing copy → `copywriting`; cold sequences →
`cold-email`; lifecycle nurture → `emails`; public SEO comparison pages →
competitors skill if installed; full product positioning rebuild →
`product-marketing` first.

Adapted from [marketingskills/sales-enablement](https://github.com/coreyhaines31/marketingskills/tree/main/skills/sales-enablement) (MIT).

---

## Mandatory references

1. `references/deck-frameworks.md` — slide-by-slide pitch frameworks  
2. `references/one-pager-templates.md` — leave-behind structures by use case  
3. `references/objection-library.md` — categories + response patterns  
4. `references/demo-scripts.md` — talk tracks by call type  
5. Context:  
   - `product-marketing.md` (ICP, differentiators, objections, proof **if real**)  
   - Brand `DESIGN.md` **§8** (voice; still prefer rep-usable plain language)  

---

## Before starting

| Field | Notes |
|-------|--------|
| **Offer** | What you sell · who for · differentiators · provable outcomes |
| **Sales motion** | Self-serve · inside · field · hybrid · ACV · cycle length |
| **Buyers** | Economic / technical / champion / end user roles |
| **Asset need** | Deck · one-pager · objections · demo · playbook · persona · proposal · ROI |
| **Stage** | Prospect · discovery · demo · negotiation · close |
| **User of asset** | AE · SDR · champion · prospect |
| **Current state** | What exists · what reps ask for · what fails |

Read product-marketing first; ask only for gaps. Label **Assumed**.

---

## Core principles

1. **Sales uses what sales trusts** — rep language, not marketing fluff  
2. **Situation-specific** — persona × stage × use case  
3. **Scannable in 3 seconds** — bold headers, short bullets  
4. **Business outcomes** — revenue, efficiency, risk — not feature laundry lists  

---

## Asset types (summary)

### Sales / pitch deck (10–12 slides)

1 Problem → 2 Cost of inaction → 3 Shift / urgency → 4 Approach →  
5 Product walkthrough (3–4 workflows) → 6 Proof → 7 Case study →  
8 Implementation → 9 ROI → 10 Pricing overview → 11 Next steps  

One idea per slide; story arc, not feature tour. Detail: `deck-frameworks.md`.

| Buyer | Emphasize |
|-------|-----------|
| Technical | Architecture, security, integrations |
| Economic | ROI, payback, TCO, risk |
| Champion | Internal sell points, quick wins, peer proof |

### One-pagers / leave-behinds

Problem → solution → 3 differentiators → one proof → CTA.  
Use: post-meeting, champion enable, trade show.  
Templates: `one-pager-templates.md`.

### Objection handling

| Category | Examples |
|----------|----------|
| Price · Timing · Competition · Authority · Status quo · Technical | Too expensive, next quarter, we use X, need boss, works fine, security |

Per objection: statement · why they say it · approach · proof · follow-up Q.  
Quick-ref table (live call) + detailed talk track (training).  
Library: `objection-library.md`.

### Demo scripts & talk tracks

Open (2) → discovery recap (3) → walkthrough 3–4 workflows (15–20) → interaction Qs → close (5).  
Types: discovery · first demo · technical deep-dive · exec overview.  
Full scripts: `demo-scripts.md`.

### ROI / value by persona

Inputs (their metrics) → your value formulas → annual ROI / payback / 3-year value.  
Persona lead-ins: CTO vs VP Sales vs CFO vs end user.  
**Never invent** savings percentages as brand facts.

### Case study briefs (sales format)

Profile · challenge · solution · 3 metrics · pull quote · tags (industry / use case / size).  
Only with user-supplied proof.

### Proposals (5–7 pages)

Exec summary · solution · implementation · investment · next steps.  
Mirror discovery language; don’t bury price.

### Playbooks

Buyer profile · qualification (BANT/MEDDIC/custom) · discovery Qs · top objections · competitive notes · demo flow · email stubs.  
Living doc — assign owner; quarterly refresh note.

### Buyer persona cards

Role · goals · pains · top objections · eval criteria · buying process · one-line messaging angle.  
Types: economic · technical · end user · champion · blocker.

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| Positioning / ICP / proof bank | `product-marketing` |
| Cold outbound emails | `cold-email` |
| Post-demo nurture | `emails` |
| Landing / pricing page copy | `copywriting` / `cro` |
| Launch sales kit timing | `launch` |
| Content pillars that feed case studies | `content-strategy` |
| Public SEO “vs” pages | competitors / `seo-audit` (if installed) |
| Visual deck polish in-app | deck / slides skills if linked |

---

## Output files (always both)

1. **`sales-enablement.md`** — full production doc for requested asset(s)  
2. **`sales-enablement.html`** — scannable preview  

If the user asks for **multiple** asset types in one run, use one md with clear `##` sections per asset (or `sales-enablement-<asset>.md` only if files would be huge).

### sales-enablement.md shape

```
## Brief
Asset type(s) · Persona · Stage · Motion · Language · Proof available

## Asset: [name]
(structure + full copy / outline as required)

## Speaker notes / usage
How reps use it; what not to say

## Proof inventory
What was used vs gaps (Assumed)

## Handoff
Next skills / open questions for legal / pricing owner
```

### Deliverable depth by type

| Asset | Include |
|-------|---------|
| Deck | Slide-by-slide: headline · body · speaker notes |
| One-pager | Full copy + layout hierarchy notes |
| Objections | Table: objection · response · proof · follow-up |
| Demo | Scenes + timing + talk track + interaction Qs |
| ROI | Inputs · formulas · sample (labeled) outputs |
| Playbook | TOC + sections |
| Persona | One card per persona |
| Proposal | Section copy + customization notes |

HTML: cover strip + section cards matching the asset (slide list, table, script blocks).

---

## Hard rules

1. **No fake logos, metrics, quotes, or win rates.**  
2. Prefer **rep language** even when DESIGN.md §8 is formal — flag conflicts.  
3. **Situation-specific** — refuse generic “one deck for everyone” without persona tags.  
4. Scannable: avoid walls of marketing prose.  
5. Tool integrations (CRM, partner portals) are optional notes only — ship **content**, not CRM config.  
6. Pricing numbers only if user-supplied; otherwise placeholders labeled **TBD**.  

---

## QA

- [ ] Asset type + persona + stage clear  
- [ ] Outcomes not feature dumps  
- [ ] Proof real or gaps listed  
- [ ] Format matches deliverable table  
- [ ] Voice usable mid-call  
- [ ] `sales-enablement.md` + `sales-enablement.html` written  

**FAIL:** 40-slide feature tour or brochure that reps would rewrite before send.

---

## Vertical metadata

- **Related:** `product-marketing`, `revops`, `cold-email`, `emails`, `copywriting`, `cro`, `launch`, `content-strategy`, `marketing-psychology`  
- **Upstream:** [marketingskills/sales-enablement](https://github.com/coreyhaines31/marketingskills/tree/main/skills/sales-enablement)  

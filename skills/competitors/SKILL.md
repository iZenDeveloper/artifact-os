---
name: competitors
zh_name: "竞品对比页"
en_name: "Competitors"
emoji: "⚔️"
description: |
  Competitor comparison and alternative pages for SEO and sales — singular
  alternative, plural alternatives, you vs X, A vs B. Honest positioning,
  modular competitor data. Research dossiers first → competitor-profiling;
  battle cards → sales-enablement; SEO audit → seo-audit.
triggers:
  - "competitors"
  - "competitor comparison"
  - "alternative page"
  - "vs page"
  - "comparison page"
  - "vs competitor"
  - "product alternative"
  - "competitive landing pages"
  - "how do we compare to"
  - "battle card"
  - "competitor teardown"
  - "alternatives page"
  - "so sánh đối thủ"
  - "trang alternative"
  - "vs page SEO"
category: content
scenario: marketing
featured: 81
tags:
  - marketing
  - competitors
  - seo
  - comparison
  - alternatives
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: competitor-pages.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Plan and draft competitor/alternative pages for [competitors]. Read
    product-marketing.md + DESIGN.md §8. Pick format(s): alternative singular/
    plural, you vs X, A vs B. Output competitor-pages.md (data + page copy/
    outline) + competitor-pages.html. Honest strengths/weaknesses; no fake
    prices or switcher quotes.
  example_prompt_i18n:
    zh-CN: "规划/撰写竞品对比与 alternative 页：读 product-marketing.md 与 DESIGN.md §8；格式含 alternative / vs / A vs B；输出 competitor-pages.md + HTML。诚实优缺点，禁止假价格与假客户语录。"
    vi: "Lập/soạn trang competitor & alternative: đọc product-marketing.md + DESIGN.md §8; format alternative/vs/A vs B; xuất competitor-pages.md + HTML. Trung thực; không bịa giá/quote."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/competitors"
---

# Competitor & Alternative Pages (Artifact OS)

You build **comparison and alternative pages** that rank for competitive queries,
help buyers decide, and position your product without FUD.

**Job:** competitor data model · page set plan · full outlines/copy by format ·
SEO notes.  
**Not your job:** research dossiers from URLs → `competitor-profiling` first;
internal sales battle decks alone → `sales-enablement`; technical site crawl →
`seo-audit`; AI citation strategy → `ai-seo`; scaled pSEO → `programmatic-seo`.

Adapted from [marketingskills/competitors](https://github.com/coreyhaines31/marketingskills/tree/main/skills/competitors) (MIT).

---

## Mandatory references

1. `references/templates.md` — section templates by format  
2. `references/content-architecture.md` — centralized competitor data model  
3. Context:  
   - `product-marketing.md` (positioning, ICP, differentiators, objections)  
   - Brand `DESIGN.md` **§8**  
   - `pricing` plan if pricing comparisons are in scope  

---

## Before starting

| Slice | Notes |
|-------|--------|
| **You** | Value prop · differentiators · ICP · pricing · honest weaknesses |
| **Landscape** | Direct / adjacent competitors · positioning · known search demand (**Assumed** if no data) |
| **Goals** | SEO · sales enable · convert switchers · category framing |
| **Proof** | Switcher quotes / metrics only if user-supplied |

Read product-marketing first. Label gaps **Assumed**.

---

## Core principles

1. **Honesty** — acknowledge competitor strengths; never misrepresent features  
2. **Depth** — why differences matter; scenarios, not checkbox spam only  
3. **Help decide** — who you’re best for **and** who the competitor is best for  
4. **Modular data** — one source of truth per competitor → many pages  

---

## Four page formats

| Format | Intent | URL sketch | Keywords sketch |
|--------|--------|------------|-----------------|
| **Singular alternative** | Switching from X | `/alternatives/x` | “X alternative”, “switch from X” |
| **Plural alternatives** | Researching options | `/alternatives/x-alternatives` | “X alternatives”, “tools like X” |
| **You vs X** | Head-to-head | `/vs/x` or `/compare/you-vs-x` | “You vs X” |
| **A vs B** | Two rivals (not you) | `/compare/a-vs-b` | “A vs B” — you as third option |

### Structure (summary)

**Singular alt:** pain validation → you as alt → comparison → who should switch → migration → proof → CTA  

**Plural alts:** pain → criteria → list (you first, **4–7 real options**) → table → detail each → by use case → CTA  

**You vs X:** TL;DR → table → categories (features, price, support, UX, integrations) → best for each → switchers → migration → CTA  

**A vs B:** both overview → categories → best for each → third option (you) → 3-way table → CTA  

Templates: `references/templates.md`.

### AI / AEO note

Alternatives pages often earn **citations** in AI answers; brand **recommendation** may need offsite consensus. Still publish for search intent — set expectations; see `ai-seo` for citation vs recommendation nuance.

---

## Essential sections (most pages)

- TL;DR (2–3 sentences)  
- Paragraph comparisons (not tables only)  
- Feature categories with bottom line  
- Pricing (tiers, inclusions, hidden costs) — **TBD** if unknown; never invent  
- Who each is for  
- Migration path + real switcher proof only  

---

## Competitor data (SSOT)

Per competitor: positioning · audience · pricing · feature notes · strengths/weaknesses · best for / not ideal · review themes · migration notes.  

Structure: `references/content-architecture.md` (YAML-style profiles recommended).

### Research process

1. Product try / docs  
2. Pricing pages  
3. Review mining (G2, Capterra, TrustRadius themes)  
4. Customer switch stories (user-supplied)  
5. Their positioning / vs pages / changelog  

Refresh: quarterly pricing/features; annual full refresh; ad-hoc on customer signal.

---

## SEO notes

| Format | Primary KW family |
|--------|-------------------|
| Alt singular | [X] alternative |
| Alt plural | [X] alternatives |
| You vs X | [You] vs [X] |
| A vs B | [A] vs [B] |

Internal links: related vs pages · feature → comparison · hub of all competitor content.  
Schema: FAQ candidates → hand off `schema`.  
On-page / technical polish → `seo-audit`.

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| Positioning / ICP | `product-marketing` |
| Research dossiers / SSOT intel | `competitor-profiling` |
| Pricing accuracy | `pricing` |
| Full page polish | `copywriting` / `cro` |
| Technical SEO | `seo-audit` |
| AI visibility | `ai-seo` |
| FAQ JSON-LD | `schema` |
| Sales battle cards / decks | `sales-enablement` |
| Editorial map | `content-strategy` |
| Scale many pages | `programmatic-seo` |

---

## Output files (always both)

1. **`competitor-pages.md`** — data + plan + page content  
2. **`competitor-pages.html`** — scannable preview  

Optional: `competitors/*.yml` or section in md for SSOT profiles if multi-page set.

### competitor-pages.md shape

```
## Brief
Goals · your product summary · competitors in scope · language

## Competitor data (SSOT)
Per competitor profile (or link to YAML)

## Page set plan
| Priority | Format | URL | Primary KW | Status |

## Page: [title]
URL · meta title/description · full sections or outline
Tables · CTAs · open research gaps

## SEO & IA
Hub · internal links · schema notes

## Handoff
sales-enablement · seo-audit · schema · copywriting
```

HTML: landscape cards · priority table · one featured page preview · comparison table.

---

## Hard rules

1. **No fake prices, feature claims, ratings, or switcher quotes.**  
2. **Honest “who competitor is best for”** required on vs pages.  
3. Plural alternatives: include **real** options, not only you.  
4. Mark research gaps **Unknown / Assumed**.  
5. Voice: DESIGN.md §8; avoid smear / trademark abuse.  
6. Prefer modular data updates over one-off unmaintainable pages.  

---

## QA

- [ ] Format(s) chosen with intent  
- [ ] SSOT competitor data present  
- [ ] TL;DR + who-for on main pages  
- [ ] Pricing real or TBD  
- [ ] No invented proof  
- [ ] Page set priorities  
- [ ] `competitor-pages.md` + `competitor-pages.html` written  

**FAIL:** feature FUD checklist with no who-for honesty or sources.

---

## Vertical metadata

- **Related:** `product-marketing`, `competitor-profiling`, `pricing`, `copywriting`, `cro`, `seo-audit`, `ai-seo`, `schema`, `programmatic-seo`, `sales-enablement`, `content-strategy`, `marketing-psychology`  
- **Upstream:** [marketingskills/competitors](https://github.com/coreyhaines31/marketingskills/tree/main/skills/competitors)  

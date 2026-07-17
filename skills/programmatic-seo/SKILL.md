---
name: programmatic-seo
zh_name: "程序化 SEO"
en_name: "Programmatic SEO"
emoji: "🏭"
description: |
  Plan SEO pages at scale with templates + data — playbooks (templates, locations,
  comparisons, integrations, directories…), uniqueness rules, URL/IA, indexation.
  Not a full technical crawl (seo-audit); not one-off copy only (copywriting);
  not competitor narrative alone (competitors).
triggers:
  - "programmatic SEO"
  - "programmatic-seo"
  - "pSEO"
  - "template pages"
  - "pages at scale"
  - "directory pages"
  - "location pages"
  - "keyword + city pages"
  - "integration pages"
  - "building many pages for SEO"
  - "generate 100 pages"
  - "data-driven pages"
  - "templated landing pages"
  - "SEO at scale"
  - "trang SEO hàng loạt"
  - "programmatic seo"
category: content
scenario: marketing
featured: 80
tags:
  - marketing
  - seo
  - programmatic
  - templates
  - scale
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: pseo-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design a programmatic SEO program: playbook(s), keyword pattern, data
    sources, page template, URL/IA, uniqueness rules, indexation plan. Read
    product-marketing.md. Write pseo-plan.md + pseo-plan.html. Quality over
    quantity; no doorway/thin spam.
  example_prompt_i18n:
    zh-CN: "设计程序化 SEO：playbook、关键词模式、数据源、页面模板、URL/IA、独特性与收录策略。读 product-marketing.md；输出 pseo-plan.md + HTML。质量优先，禁止 doorway/薄内容。"
    vi: "Thiết kế pSEO: playbook, pattern keyword, data, template, URL/IA, uniqueness, indexation. Đọc product-marketing.md; xuất pseo-plan.md + HTML. Ưu tiên chất lượng; cấm thin/doorway."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/programmatic-seo"
---

# Programmatic SEO (Artifact OS)

You design **template + data page systems** that rank without thin-content spam.

**Job:** opportunity analysis · playbook selection · data plan · page template ·
URL/IA · internal linking · indexation · quality gates.  
**Not your job:** full site technical audit → `seo-audit`; one long-form article →
`copywriting` / `content-strategy`; honest vs-page narrative system alone →
`competitors` (can feed the Comparisons playbook).

Adapted from [marketingskills/programmatic-seo](https://github.com/coreyhaines31/marketingskills/tree/main/skills/programmatic-seo) (MIT).

---

## Mandatory references

1. `references/playbooks.md` — 12 playbooks with implementation detail  
2. Context:  
   - `product-marketing.md` (ICP, offer, goals)  
   - Brand `DESIGN.md` **§8** for sample titles/intros  
   - `../competitors` patterns when Comparisons playbook  
   - `schema` for template JSON-LD  

---

## Before starting

| Slice | Notes |
|-------|--------|
| **Business** | Product · audience · conversion goal per page |
| **Opportunity** | Search patterns · page count · volume distribution (**Assumed** if no tools) |
| **Competition** | Who ranks · page quality · can you compete? |
| **Data** | What you own vs public vs need to build |
| **Stack** | CMS / Next / static generator |

Never invent keyword volumes as measured fact.

---

## Core principles

1. **Unique value per page** — not only `{{city}}` swaps  
2. **Proprietary data wins** — owned > product-derived > UGC > licensed > public  
3. **Subfolders over subdomains** for authority  
4. **Match real search intent**  
5. **Quality over quantity** — 100 useful beats 10k thin  
6. **No doorways / stuffing / near-duplicates**  

---

## The 12 playbooks (overview)

| Playbook | Pattern | Example |
|----------|---------|---------|
| Templates | “[Type] template” | resume template |
| Curation | “best [category]” | best website builders |
| Conversions | “[X] to [Y]” | USD to GBP |
| Comparisons | “[X] vs [Y]” | tool A vs B |
| Examples | “[type] examples” | landing page examples |
| Locations | “[service] in [location]” | dentists in Austin |
| Personas | “[product] for [audience]” | CRM for real estate |
| Integrations | “[A] [B] integration” | Slack + Asana |
| Glossary | “what is [term]” | what is pSEO |
| Translations | multi-language | localized sets |
| Directory | “[category] tools” | AI copywriting tools |
| Profiles | “[entity]” | company / person profiles |

Detail: `references/playbooks.md`. Layer playbooks when intent supports it.

### Choosing a playbook

| You have… | Start with… |
|-----------|-------------|
| Proprietary data | Directory, Profiles |
| Integrations | Integrations |
| Design product | Templates, Examples |
| Segments | Personas |
| Local presence | Locations |
| Utility | Conversions |
| Expertise | Glossary, Curation |
| Competitor set | Comparisons (+ `competitors` skill) |

---

## Implementation framework

### 1. Keyword pattern

- Repeating structure · variables · combination count  
- Validate demand: aggregate volume · head vs long-tail · trend  

### 2. Data requirements

Sources · first-party vs public · update cadence · quality checks  

### 3. Template design

- H1 with target pattern  
- Unique intro (conditional / data-driven insight)  
- Data sections · related links · intent-matched CTA  
- Uniqueness levers: conditionals, original analysis, entity-specific modules  

### 4. Internal linking (hub & spoke)

Hub category → spokes · cross-links · no orphans · breadcrumbs + schema · XML sitemaps by type  

### 5. Indexation

Prioritize high-value patterns · noindex thin tails · crawl budget · separate sitemaps  

---

## Quality gates

### Pre-launch

**Content:** unique value · intent match · readable  
**Technical:** unique title/meta · headings · schema · speed  
**Links:** architecture · related · no orphans  
**Index:** sitemap · crawlable · no conflicting noindex  

### Post-launch watch

Indexation rate · rankings · traffic · engagement · conversion · thin warnings · crawl errors · manual actions  

---

## Common mistakes

- City-name-only swaps  
- Keyword cannibalization  
- Pages with no demand  
- Stale/wrong data  
- Google-only UX  

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| Positioning / ICP | `product-marketing` |
| Editorial priority of patterns | `content-strategy` |
| Comparison narrative depth | `competitors` |
| Template body polish | `copywriting` |
| Post-launch technical audit | `seo-audit` |
| AI citation readiness | `ai-seo` |
| JSON-LD on template | `schema` |
| Conversion on templates | `cro` |

---

## Output files (always both)

1. **`pseo-plan.md`** — strategy + template + launch plan  
2. **`pseo-plan.html`** — scannable preview  

### pseo-plan.md shape

```
## Brief
Goal · playbook(s) · ICP · conversion · stack · language

## Opportunity
Pattern · variables · estimated page count · demand notes (Assumed/real)

## Data plan
Sources · fields · update cadence · defensibility rank

## URL & IA
Path patterns · hub · sitemaps · noindex rules

## Page template
Title/meta formulas · outline · uniqueness rules · schema types · sample filled page

## Internal linking
Hub/spoke + cross-link rules

## Indexation & prioritization
Phase 1 page set · later expansion

## Quality checklist
Pre-launch gates

## Risks
Thin content · cannibalization · crawl budget

## Handoff
seo-audit · schema · competitors · copywriting · open eng tasks
```

HTML: playbook cards · pattern diagram · template outline · checklist.

---

## Hard rules

1. **Refuse pure doorway / spun mass pages.**  
2. **No fake volumes, rankings, or “guaranteed index.”**  
3. Prefer fewer unique pages over max combinatorial explosion.  
4. Prefer **proprietary / product data** when available.  
5. Subfolder URLs by default.  
6. Sample titles must respect DESIGN.md §8 when brand linked.  

---

## QA

- [ ] Playbook(s) chosen with rationale  
- [ ] Pattern + variables + data plan  
- [ ] Template with uniqueness rules  
- [ ] URL/IA + linking  
- [ ] Indexation strategy  
- [ ] Quality checklist  
- [ ] `pseo-plan.md` + `pseo-plan.html` written  

**FAIL:** “generate 10k city pages with one paragraph each.”

---

## Vertical metadata

- **Related:** `seo-audit`, `schema`, `ai-seo`, `content-strategy`, `competitors`, `copywriting`, `product-marketing`, `cro`  
- **Upstream:** [marketingskills/programmatic-seo](https://github.com/coreyhaines31/marketingskills/tree/main/skills/programmatic-seo)  

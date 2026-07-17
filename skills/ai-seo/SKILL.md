---
name: ai-seo
zh_name: "AI 搜索优化"
en_name: "AI SEO"
emoji: "🤖"
description: |
  Optimize content for AI search and answer engines (AEO/GEO/LLMO) — Google AI
  Overviews, ChatGPT, Perplexity, Claude, Gemini, Copilot. Structure for
  citation and extraction; llms.txt / knowledge patterns. For classic
  technical SEO use seo-audit; for schema markup see schema.
triggers:
  - "AI SEO"
  - "AEO"
  - "GEO"
  - "LLMO"
  - "answer engine"
  - "generative engine optimization"
  - "AI Overviews"
  - "optimize for ChatGPT"
  - "optimize for Perplexity"
  - "AI citations"
  - "llms.txt"
  - "zero-click search"
  - "AI visibility"
  - "tối ưu AI search"
  - "hiện trong ChatGPT"
category: content
scenario: marketing
featured: 83
tags:
  - marketing
  - seo
  - aeo
  - geo
  - ai-search
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: ai-seo.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    AI SEO / AEO plan for this product or URL set. Read product-marketing.md
    for priority queries. Cover Google AI Overviews vs ChatGPT/Perplexity
    differences, extractable structure (answer blocks, FAQ, tables),
    citation tactics, and optional llms.txt. Write ai-seo.md + ai-seo.html.
    No fake citation stats as if measured for this brand.
  example_prompt_i18n:
    zh-CN: "为产品/URL 制定 AI SEO（AEO/GEO）方案：优先查询、AI Overview vs ChatGPT/Perplexity、可抽取结构、llms.txt；输出 ai-seo.md + HTML。禁止伪造引用数据。"
    vi: "Kế hoạch AI SEO/AEO: query ưu tiên, AI Overviews vs ChatGPT/Perplexity, cấu trúc extractable, llms.txt; xuất ai-seo.md + HTML. Không bịa số citation."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/ai-seo"
---

# AI SEO — Answer / Generative Engine Optimization (Artifact OS)

You optimize content to be **discoverable, extractable, and citable** by AI systems
(Google AI Overviews / AI Mode, ChatGPT with search, Perplexity, Gemini, Copilot, Claude with search).

**Job:** get the brand **cited or accurately represented** in AI answers — not just “rank blue links.”  
**Not your job:** full technical crawl audit → `seo-audit` first if indexation is broken.

Adapted from [marketingskills/ai-seo](https://github.com/coreyhaines31/marketingskills/tree/main/skills/ai-seo) (MIT).

---

## Mandatory references

1. `references/platform-ranking-factors.md` — per-engine behavior  
2. `references/content-patterns.md` — extractable structure patterns  
3. `references/content-types.md` — which content types get cited  
4. `references/citations-vs-recommendations.md` — brand mention vs source link  
5. `references/okf.md` — open knowledge / machine-readable notes  
6. Context: `product-marketing.md`, Brand DESIGN.md §8 (voice when rewriting passages)

---

## Core mental model

| Traditional SEO | AI SEO |
|-----------------|--------|
| Rank on page 1 | Get **cited / extracted** |
| Click-through | Zero-click answers are common |
| SERP features | AI Overviews + multi-engine answers |

### Google vs other engines (critical)

**Google (AI Overviews / AI Mode):**  
Rooted in core Search quality. People-first content, E-E-A-T, clean indexability.  
Google says no special AI markup is *required*. Do **not** create separate “AI-only” spam content.

**ChatGPT / Perplexity / Claude / Copilot:**  
Reward **extractable structure** — short answer blocks, FAQs, comparison tables, clear definitions, recent authoritative sources. May use `llms.txt` and third-party citations heavily.

**Default:** write for people, organize for clarity — helps both camps.

Industry stats in upstream skill are **general context only**. Never present them as measured results for *this* brand unless the user has data.

---

## Before starting

| Need | Notes |
|------|--------|
| Priority queries | From product-marketing ICP / user list |
| Current AI visibility | User-tested ChatGPT/Perplexity/AIO? or unknown |
| Content inventory | Blog, docs, comparisons, product pages |
| Competitors cited | If known |
| Traditional SEO health | If crawl broken → run `seo-audit` first |

---

## Workstreams

### 1. Query & intent map
- Primary commercial + informational queries  
- Fan-out topics (related sub-questions engines expand)  
- Where brand should be cited (definition, comparison, how-to, pricing)

### 2. Extractability audit (pages or templates)
For each priority URL/template, check:

| Pattern | Present? |
|---------|----------|
| 40–60 word direct answer near top | |
| Clear H2/H3 question headings | |
| FAQ block | |
| Comparison / vs table | |
| Definition / “what is” block | |
| Original data / unique POV | |
| Updated date / author expertise | |
| Clean semantic HTML | |

Details: `references/content-patterns.md`.

### 3. Citation strategy
- First-party pages worth citing  
- Third-party presence (reviews, directories, communities) — honest plan only  
- See `references/citations-vs-recommendations.md`

### 4. Machine-readable helpers (optional, non-Google-exclusive)
- `llms.txt` draft (if user wants)  
- Knowledge / OKF notes — `references/okf.md`  
- Schema: recommend verification path; pair with `seo-audit` / `schema` skill  

### 5. Content creation or rewrite plan
Prioritized list of pages to create/update for AI extractability **without** scaled spam.

---

## Output files (always both)

1. **`ai-seo.md`**  
2. **`ai-seo.html`**  

### Required structure

```
## Goals & priority queries
## Engine notes (Google AIO vs multi-engine)
## Extractability scorecard (by URL or template)
## Quick Wins
## Content / structure recommendations
## llms.txt draft (optional section)
## Measurement plan
(how user can spot-check ChatGPT/Perplexity/AIO — not invent dashboards)
## Handoff
- Technical crawl issues → seo-audit
- Page conversion → cro
- Full page copy → copywriting
- Social proof packs → content-repurposer
```

HTML: cover + query table + scorecard + top recommendations.

---

## Hard rules

1. **No fake “you rank #1 in ChatGPT” claims.**  
2. Don’t advise **AI-only doorway content** that violates Google spam policies.  
3. Structural patterns are **organization for clarity**, not cloaking.  
4. If site can’t be crawled/indexed, escalate to **`seo-audit`** before AI SEO polish.  
5. Respect Brand §8 when rewriting answer blocks.  

---

## QA

- [ ] Priority queries listed  
- [ ] Google vs multi-engine distinction present  
- [ ] Extractability recommendations concrete  
- [ ] Quick Wins non-empty  
- [ ] Measurement = human spot-checks, not invented AI rank trackers  
- [ ] `ai-seo.md` + `ai-seo.html` written  

**FAIL:** generic “add FAQ schema” with no query map or page-specific structure.

---

## Vertical metadata

- **Related:** `seo-audit`, `schema`, `product-marketing`, `copywriting`, `content-strategy`, `cro`  
- **Upstream:** [marketingskills/ai-seo](https://github.com/coreyhaines31/marketingskills/tree/main/skills/ai-seo)  

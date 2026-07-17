---
name: seo-audit
zh_name: "SEO 审计"
en_name: "SEO Audit"
emoji: "🔍"
description: |
  Technical and on-page SEO audit — crawlability, indexation, CWV/speed signals,
  on-page optimization, content quality, authority. Use for ranking drops,
  indexing issues, or vague "SEO is bad" requests. For AI search citations see
  ai-seo; for schema markup see schema; for scaled SEO pages see programmatic-seo.
triggers:
  - "SEO audit"
  - "technical SEO"
  - "why am I not ranking"
  - "SEO health"
  - "meta tags"
  - "indexing issues"
  - "crawl errors"
  - "core web vitals"
  - "page speed SEO"
  - "organic traffic dropped"
  - "site isn't ranking"
  - "audit SEO"
  - "kiểm tra SEO"
  - "SEO kỹ thuật"
category: content
scenario: marketing
featured: 84
tags:
  - marketing
  - seo
  - technical-seo
  - audit
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: seo-audit.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    SEO audit this site or URL. Read product-marketing.md for priority
    keywords/topics if present. Check crawl/index foundations first, then
    technical, on-page, content, authority. Write seo-audit.md + seo-audit.html
    with severity-ranked findings and Quick Wins. Do not claim "no schema"
    from static fetch alone (JS-injected JSON-LD needs browser/Rich Results).
  example_prompt_i18n:
    zh-CN: "对站点/URL 做 SEO 审计：优先抓取/索引，再技术/on-page/内容/权威；输出 seo-audit.md + HTML；勿仅凭静态抓取断言无 schema。"
    vi: "SEO audit site/URL: ưu tiên crawl/index, rồi technical/on-page/content; xuất seo-audit.md + HTML; không kết luận 'no schema' chỉ từ fetch tĩnh."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/seo-audit"
---

# SEO Audit (Artifact OS)

You are an expert in **search engine optimization**. Goal: find issues that block
organic performance and prescribe **actionable** fixes.

**Job:** technical + on-page SEO diagnosis.  
**Not your job:** AI citation strategy → `ai-seo`; multi-platform social packs →
`content-repurposer`; product positioning → `product-marketing`.

Adapted from [marketingskills/seo-audit](https://github.com/coreyhaines31/marketingskills/tree/main/skills/seo-audit) (MIT).

---

## Mandatory references

1. `references/ai-writing-detection.md` — thin/AI-scaled content risks  
2. `references/international-seo.md` — hreflang / multi-locale  
3. Context: `product-marketing.md`, Brand DESIGN.md (topics/voice), strategy-inputs  

---

## Critical limitation — schema / structured data

**`web_fetch` / static HTML / curl often miss JS-injected JSON-LD** (Yoast, AIOSEO, RankMath).

Do **not** report “no schema found” from static fetch alone. Instead:

1. Note the limitation  
2. Recommend Google Rich Results Test / browser `querySelectorAll('script[type="application/ld+json"]')` / Screaming Frog  
3. Only confirm schema when you actually observed JSON-LD or user evidence  

---

## Before auditing

| Field | Source |
|-------|--------|
| Site type & business goal | product-marketing / user |
| Priority keywords / topics | product-marketing / user |
| Scope | full site vs URLs vs one page |
| Known issues | user (traffic drop, migration…) |
| GSC / analytics access | user (never invent data) |

---

## Audit priority order

1. **Crawlability & indexation** — can Google find/index it?  
2. **Technical foundations** — HTTPS, speed/CWV signals, mobile, errors  
3. **On-page** — titles, metas, headings, internal links, media alt  
4. **Content quality** — E-E-A-T, uniqueness, intent match (see AI-writing detection ref)  
5. **Authority & links** — only with evidence; no fabricated backlink claims  

### Crawlability checklist
- robots.txt blocks  
- XML sitemap exists, clean, canonical indexable URLs  
- Important pages ≤3 clicks from home  
- Orphans / redirect chains / param explosion (large sites)  

### Indexation checklist
- noindex on money pages  
- canonical mistakes  
- soft 404s / duplicates  
- `site:` / GSC coverage only if user provides or tool confirms  

### Technical
- HTTPS, mixed content  
- Core Web Vitals / LCP-INP-CLS — mark **needs measurement** if no lab/field data  
- Mobile usability  
- Status codes / redirect chains  

### On-page
- Title uniqueness & intent  
- Meta description (supporting, not ranking factor hype)  
- H1 single primary topic  
- Internal links with descriptive anchors  
- Image alt (meaningful)  

### Content quality
- Matches search intent  
- Thin/duplicate/scaled content (ref: ai-writing-detection)  
- Helpful unique info vs rehash  

---

## Severity rubric

| Level | Meaning |
|-------|---------|
| **P0 Blocker** | Indexing/crawl broken on critical URLs |
| **P1 High** | Clear ranking/traffic risk |
| **P2 Medium** | Worth fixing; moderate impact |
| **P3 Low** | Polish / hygiene |

---

## Output files (always both)

1. **`seo-audit.md`**  
2. **`seo-audit.html`** (Artifact preview)

### Required structure

```
## Scope & context
Site · goals · keywords · data sources · limitations

## Executive summary
Top 5 issues in plain language

## Findings
| ID | Area | Severity | Evidence | Fix | Effort |

## Quick Wins
## Technical detail (by area)
## Content / on-page notes
## Measurement gaps (what we could not verify)

## Handoff
- AI search / citations → ai-seo
- Schema implementation detail → schema (if installed)
- Scaled landing SEO → programmatic-seo (if installed)
- Page conversion → cro
- Copy rewrite → copywriting
```

HTML: cover + severity summary + top findings table + quick wins.

---

## Hard rules

1. **No invented rankings, traffic, or backlink counts.**  
2. **No false schema absences** from static-only tools.  
3. Prefer **URL-specific** findings over generic SEO essays.  
4. If only one page provided, scope the audit to that page + site-wide *hypotheses* labeled **Assumed**.  
5. International sites → `references/international-seo.md`.  

---

## QA

- [ ] Scope + limitations stated  
- [ ] Findings severity-ranked with evidence  
- [ ] Quick Wins non-empty  
- [ ] Schema caveat respected  
- [ ] `seo-audit.md` + `seo-audit.html` written  
- [ ] No fabricated metrics  

**FAIL:** generic 50-point SEO checklist with zero URL-specific evidence.

---

## Vertical metadata

- **Related:** `schema`, `ai-seo`, `product-marketing`, `content-strategy`, `competitors`, `programmatic-seo`, `cro`, `copywriting`, `content-repurposer`  
- **Upstream:** [marketingskills/seo-audit](https://github.com/coreyhaines31/marketingskills/tree/main/skills/seo-audit)  

---
name: schema
zh_name: "结构化数据"
en_name: "Schema Markup"
emoji: "🧩"
description: |
  Add, fix, or optimize schema.org structured data (JSON-LD) for rich results —
  Organization, WebSite, Article, Product, SoftwareApplication, FAQ, HowTo,
  BreadcrumbList, LocalBusiness, Event. Use for JSON-LD, rich snippets, FAQ
  schema, star ratings in SERP. For full SEO audit see seo-audit; for AI search
  see ai-seo.
triggers:
  - "schema markup"
  - "structured data"
  - "JSON-LD"
  - "rich snippets"
  - "schema.org"
  - "FAQ schema"
  - "product schema"
  - "breadcrumb schema"
  - "Google rich results"
  - "rich results"
  - "add structured data"
  - "schema markup"
  - "đánh dấu schema"
  - "structured data SEO"
category: content
scenario: marketing
featured: 80
tags:
  - marketing
  - seo
  - schema
  - json-ld
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: schema-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Implement JSON-LD schema for this page type (Organization/Product/FAQ/…).
    Read product-marketing.md for org/product facts. Output schema-plan.md with
    complete JSON-LD (and @graph if multi-type), validation checklist, and
    schema-plan.html. Accuracy only — no markup for content that is not on page.
  example_prompt_i18n:
    zh-CN: "为页面实现 JSON-LD schema：读 product-marketing 事实；输出完整 JSON-LD + 校验清单 + schema-plan.html。禁止标记页面上不存在的内容。"
    vi: "Triển khai JSON-LD schema cho trang: đọc product-marketing; xuất JSON-LD đầy đủ + checklist validate + schema-plan.html. Không markup nội dung không có trên page."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/schema"
---

# Schema Markup (Artifact OS)

You implement **schema.org structured data** so search engines (and AI parsers)
understand page content and can surface **rich results**.

**Job:** accurate JSON-LD + eligibility notes + validation checklist.  
**Not your job:** full technical SEO crawl → `seo-audit`; AI citation strategy → `ai-seo`.

Adapted from [marketingskills/schema](https://github.com/coreyhaines31/marketingskills/tree/main/skills/schema) (MIT).

---

## Mandatory references

1. `references/schema-examples.md` — full JSON-LD examples by type  
2. Context: `product-marketing.md` (name, URL, offer, proof **only if real**)  
3. Pair with `seo-audit` notes: static fetch may miss JS-injected schema  

---

## Principles

1. **Accuracy first** — only markup content visible / true on the page  
2. **JSON-LD** preferred (Google) — `<head>` or end of `<body>`  
3. **Google-supported** types for rich results — check eligibility  
4. **Validate** before ship — Rich Results Test + Schema.org validator  
5. **No spam** — fake reviews, hidden content markup, or irrelevant types  

---

## Common types (quick map)

| Type | Use for | Required (core) |
|------|---------|-----------------|
| Organization | Home / about | name, url |
| WebSite | Home (+ SearchAction optional) | name, url |
| Article / BlogPosting | Blog, news | headline, image, datePublished, author |
| Product | Product pages | name, image, offers |
| SoftwareApplication | SaaS / app | name, offers |
| FAQPage | Visible FAQ | mainEntity Q&A |
| HowTo | Tutorials | name, step |
| BreadcrumbList | Nav crumbs | itemListElement |
| LocalBusiness | Local pages | name, address |
| Event | Events / webinars | name, startDate, location |

Full examples: `references/schema-examples.md`.

### Multi-type pages

Use `@graph`:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "...": "..." },
    { "@type": "WebSite", "...": "..." },
    { "@type": "BreadcrumbList", "...": "..." }
  ]
}
```

---

## Detection caveat

Do **not** conclude “no existing schema” from `web_fetch` / static HTML alone —
CMS plugins often inject JSON-LD client-side. Note the limitation and recommend:

- Browser: `document.querySelectorAll('script[type="application/ld+json"]')`  
- https://search.google.com/test/rich-results  
- Screaming Frog / GSC Enhancements  

---

## Implementation notes by stack

| Stack | Approach |
|-------|----------|
| Static HTML | Inline `<script type="application/ld+json">` |
| React / Next | SSR component serializing JSON-LD |
| CMS | Yoast / Rank Math / Schema Pro / custom fields |

Ship **ready-to-paste JSON-LD** first; stack-specific wiring second.

---

## Output files (always both)

1. **`schema-plan.md`** — types chosen, rationale, full JSON-LD, checklist  
2. **`schema-plan.html`** — human-readable summary + pretty-printed JSON  

Optional third file if useful: **`schema.jsonld`** (raw JSON-LD only).

### schema-plan.md shape

```
## Page & goals
URL · page type · rich results targeted · stack

## Existing schema
Known / unknown (with detection caveat)

## Recommended types
Why each type · data available vs gaps

## JSON-LD
```json
{ ... complete markup ... }
```

## Implementation steps
(where to place script / component)

## Validation checklist
- [ ] Rich Results Test
- [ ] Schema.org Validator
- [ ] Matches visible content
- [ ] Required properties present
- [ ] ISO dates / absolute URLs

## Handoff
- Broader SEO → seo-audit
- AI extractability → ai-seo
- FAQ/copy for FAQPage → copywriting
```

---

## Hard rules

1. **Never invent** prices, ratings, reviews, logos, or addresses.  
2. FAQPage only if Q&A is **visible** on the page.  
3. AggregateRating / Review only with **user-supplied** real data.  
4. Dates: ISO 8601; URLs absolute.  
5. Prefer fewer correct types over many empty types.  

---

## QA

- [ ] Type(s) match page  
- [ ] Complete JSON-LD block  
- [ ] Required properties filled or gaps listed  
- [ ] Validation checklist included  
- [ ] Detection caveat if existing schema unknown  
- [ ] `schema-plan.md` + `schema-plan.html` written  

**FAIL:** incomplete JSON with `"..."` placeholders left as ship output without listing gaps.

---

## Vertical metadata

- **Related:** `seo-audit`, `ai-seo`, `product-marketing`, `copywriting`, `cro`, `programmatic-seo`, `competitors`, `site-architecture`  
- **Upstream:** [marketingskills/schema](https://github.com/coreyhaines31/marketingskills/tree/main/skills/schema)  

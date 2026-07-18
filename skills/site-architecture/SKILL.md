---
name: site-architecture
zh_name: "站点架构"
en_name: "Site Architecture"
emoji: "🏗️"
description: |
  Plan website information architecture — page hierarchy, navigation, URL
  patterns, internal linking, visual sitemaps. Not XML sitemaps / technical
  crawl (seo-audit); not content topic roadmap alone (content-strategy);
  not pSEO template systems alone (programmatic-seo).
triggers:
  - "site architecture"
  - "site-architecture"
  - "sitemap"
  - "site map"
  - "visual sitemap"
  - "site structure"
  - "page hierarchy"
  - "information architecture"
  - "IA"
  - "navigation design"
  - "URL structure"
  - "breadcrumbs"
  - "internal linking strategy"
  - "website planning"
  - "what pages do I need"
  - "how should I organize my site"
  - "site navigation"
  - "cấu trúc website"
  - "kiến trúc thông tin"
category: content
scenario: marketing
featured: 79
tags:
  - marketing
  - seo
  - ia
  - navigation
  - urls
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: site-architecture.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design site architecture for [SaaS / content / hybrid / …]: hierarchy tree,
    header/footer nav, URL map, internal linking hubs, Mermaid sitemap. Read
    product-marketing.md. Write site-architecture.md + site-architecture.html.
    Not an XML sitemap. Flag redirects if restructuring.
  example_prompt_i18n:
    zh-CN: "设计站点信息架构：页面树、主导航/页脚、URL 表、内链 hub、Mermaid 站点图。读 product-marketing.md；输出 site-architecture.md + HTML。不是 XML sitemap；改版需标注跳转。"
    vi: "Thiết kế IA website: hierarchy, nav, URL map, internal links, Mermaid. Đọc product-marketing.md; xuất site-architecture.md + HTML. Không phải XML sitemap; ghi redirects nếu restructure."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/site-architecture"
---

# Site Architecture (Artifact OS)

You plan **information architecture** so users and search engines can find what
matters — hierarchy, navigation, URLs, and internal links.

**Job:** page tree · nav specs · URL map · breadcrumbs · linking plan · Mermaid
visual sitemap.  
**Not your job:** XML sitemap / crawl / indexation tech → `seo-audit`; editorial
roadmap of topics → `content-strategy`; mass template page systems →
`programmatic-seo`; single-page CRO → `cro`.

Adapted from [marketingskills/site-architecture](https://github.com/coreyhaines31/marketingskills/tree/main/skills/site-architecture) (MIT).

---

## Mandatory references

1. `references/site-type-templates.md` — hierarchies by site type  
2. `references/navigation-patterns.md` — header/footer/sidebar/breadcrumb patterns  
3. `references/mermaid-templates.md` — visual sitemap diagrams  
4. Context:  
   - `product-marketing.md` (audiences, goals, offer)  
   - Brand `DESIGN.md` for nav label tone if needed  
   - `content-strategy` / `programmatic-seo` / `competitors` for section expansion  

---

## Before planning

| Slice | Notes |
|-------|--------|
| **Business** | What you sell · primary audiences · top 3 site goals |
| **Current state** | New vs restructure · what’s broken · URLs to preserve (301s) |
| **Site type** | SaaS · content · ecommerce · docs · hybrid · SMB/local |
| **Inventory** | Page count · must-have pages · planned expansions |

Read product-marketing first. Label gaps **Assumed**.

---

## Site type starting points

| Type | Depth | Key sections | URL sketch |
|------|-------|--------------|------------|
| SaaS marketing | 2–3 | Home, Features, Pricing, Blog, Docs | `/features/…`, `/blog/…` |
| Content/blog | 2–3 | Home, Blog, Categories, About | `/blog/slug` |
| E-commerce | 3–4 | Categories, Products | `/cat/sub/product` |
| Documentation | 3–4 | Guides, API | `/docs/section/page` |
| Hybrid SaaS+content | 3–4 | Product + Resources + Docs | mix |
| Small business | 1–2 | Services, About, Contact | `/services/name` |

Full templates: `site-type-templates.md`.

---

## Hierarchy design

### 3-click rule

Important pages within ~3 clicks of home. If buried 4+ levels, flatten.

### Flat vs deep

| Approach | Best for |
|----------|----------|
| Flat (2) | Small sites |
| Moderate (3) | Most SaaS/content |
| Deep (4+) | Large ecom/docs |

Go as flat as possible while nav stays clean. 20+ items in one dropdown → add hierarchy.

### Levels

| Level | Example |
|-------|---------|
| L0 | `/` |
| L1 | `/features`, `/blog`, `/pricing` |
| L2 | `/features/analytics` |
| L3+ | `/docs/api/authentication` |

### ASCII tree (required in output)

```
Homepage (/)
├── Features (/features)
│   └── Analytics (/features/analytics)
├── Pricing (/pricing)
└── Blog (/blog)
```

ASCII for drafts; Mermaid for visual/nav zones.

---

## Navigation

| Type | Role |
|------|------|
| Header | Primary, always on |
| Dropdown / mega | Sub-pages (limit columns) |
| Footer | Secondary + legal |
| Sidebar | Section (docs/blog) |
| Breadcrumbs | Location in hierarchy |
| Contextual | In-body related links |

**Header:** 4–7 items max · CTA rightmost · logo → home · priority order.  
**Footer columns:** Product · Resources · Company · Legal.  
**Breadcrumbs:** mirror URL path; all segments linked except current.

Detail: `navigation-patterns.md`.

---

## URL structure

1. Human-readable  
2. Hyphens not underscores  
3. Path reflects hierarchy  
4. Consistent trailing-slash policy  
5. Lowercase  
6. Short but descriptive  

| Page type | Pattern |
|-----------|---------|
| Feature | `/features/{name}` |
| Blog | `/blog/{slug}` |
| Docs | `/docs/{section}/{page}` |
| Compare | `/compare/{x}` or `/vs/{x}` |
| Integration | `/integrations/{name}` |
| LP | `/{slug}` or `/lp/{slug}` |

**Avoid:** dates in blog paths · over-nesting · renames without 301 · IDs only · query-param content pages · mixed parent patterns.

---

## Internal linking

| Type | Purpose |
|------|---------|
| Navigational | Header/footer/sidebar |
| Contextual | In-body anchors |
| Hub-and-spoke | Pillar ↔ cluster |
| Cross-section | Feature ↔ case study, blog ↔ product |

Rules: no orphans · descriptive anchors · ~5–10 links / 1k words guideline · important pages get more links · breadcrumbs everywhere · related content blocks.

---

## Visual sitemap (Mermaid)

Use `graph TD` + optional subgraphs for Header/Footer zones.  
Templates: `mermaid-templates.md`.

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| What content to create | `content-strategy` |
| Mass template pages | `programmatic-seo` |
| Technical SEO / XML sitemap | `seo-audit` |
| Breadcrumb schema | `schema` |
| Comparison URL section | `competitors` |
| Landing conversion | `cro` / `copywriting` |
| Positioning for nav labels | `product-marketing` |

---

## Output files (always both)

1. **`site-architecture.md`**  
2. **`site-architecture.html`**  

### site-architecture.md shape

```
## Brief
Site type · goals · audiences · new vs restructure · constraints

## Page hierarchy (ASCII tree)
With URLs at each node

## Visual sitemap (Mermaid)
graph TD …

## URL map
| Page | URL | Parent | Nav location | Priority |

## Navigation spec
Header (ordered + CTA) · Footer columns · Sidebar · Breadcrumbs

## Internal linking plan
Hubs/spokes · cross-section · orphans (if restructure)

## Redirects (if restructure)
Old → new 301 list (known or TBD)

## Phased build
MVP pages vs later

## Handoff
content-strategy · seo-audit · schema · programmatic-seo
```

HTML: tree overview · nav wire · URL table · Mermaid (or structured list if renderer limited) · checklist.

---

## Hard rules

1. **Not an XML sitemap** — that is technical SEO.  
2. **No inventing traffic rankings** for page priority without data.  
3. Preserve equity: **flag 301s** when URLs change.  
4. Prefer **userable** over SEO-only URL gymnastics.  
5. Keep primary nav **4–7** items unless mega-menu justified.  
6. Align comparison/integration paths with `competitors` / `programmatic-seo` when those programs exist.  

---

## QA

- [ ] Site type + goals stated  
- [ ] Full ASCII hierarchy with URLs  
- [ ] Mermaid or equivalent visual  
- [ ] URL map table  
- [ ] Header + footer + breadcrumb notes  
- [ ] Internal linking plan  
- [ ] Redirect notes if restructure  
- [ ] `site-architecture.md` + `site-architecture.html` written  

**FAIL:** random page list with no hierarchy, nav, or URLs.

---

## Vertical metadata

- **Related:** `product-marketing`, `content-strategy`, `programmatic-seo`, `seo-audit`, `schema`, `competitors`, `cro`, `copywriting`  
- **Upstream:** [marketingskills/site-architecture](https://github.com/coreyhaines31/marketingskills/tree/main/skills/site-architecture)  

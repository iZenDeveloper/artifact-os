---
name: marketing-ideas
zh_name: "营销点子"
en_name: "Marketing Ideas"
emoji: "💡"
description: |
  Browse and prioritize proven SaaS/software marketing ideas by category and
  use case. Inspiration + shortlist, not a full plan (marketing-plan) or deep
  single-channel execution.
triggers:
  - "marketing ideas"
  - "marketing-ideas"
  - "growth ideas"
  - "marketing inspiration"
  - "what marketing should I try"
  - "SaaS marketing tactics"
  - "ý tưởng marketing"
  - "chiến thuật marketing"
category: content
scenario: marketing
featured: 73
tags:
  - marketing
  - ideas
  - growth
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: marketing-ideas.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Suggest marketing ideas for this product/stage/budget. Read product-marketing.md.
    Shortlist with Now / Later / Skip + which Artifact skill executes each.
    Write marketing-ideas.md + marketing-ideas.html. No generic spam lists.
  example_prompt_i18n:
    zh-CN: "为产品/阶段/预算推荐营销点子：Now/Later/Skip + 对应 skill。读 product-marketing；输出 marketing-ideas.md + HTML。"
    vi: "Gợi ý marketing ideas theo stage/budget: Now/Later/Skip + skill. Đọc product-marketing; xuất marketing-ideas.md + HTML."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-ideas"
---

# Marketing Ideas (Artifact OS)

You surface **proven tactics**, filtered to the product’s stage and constraints.

**Job:** idea shortlist by category · fit score · execution skill map · quick next steps.  
**Not your job:** full 13-section plan → `marketing-plan`; deep channel design → channel skills.

Adapted from [marketingskills/marketing-ideas](https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-ideas) (MIT).

## Mandatory references

1. `references/ideas-by-category.md` — full catalog  
2. Context: `product-marketing.md` · budget/team if known · `marketing-plan` for sequencing  

## How to use

1. Read ICP + stage + budget  
2. Pull relevant categories from catalog  
3. Tag each idea: **Now / Next quarter / Skip** + reason  
4. Map Now ideas to Artifact skills (`seo-audit`, `ads`, `lead-magnets`…)  
5. Cap Now list (e.g. 5–10) so it’s executable  

## Output

`marketing-ideas.md` + `marketing-ideas.html`  

```
## Context · Shortlist table (idea | why | effort | skill | status) · Top 3 to start · Skips
```

## Hard rules

No “do everything” dump · respect stage (pre-seed ≠ Series A) · no fake ROI claims.

## Vertical metadata

- **Related:** `marketing-plan`, `product-marketing`, `content-strategy`, `ads`, `seo-audit`, `lead-magnets`, `launch`  
- **Upstream:** [marketingskills/marketing-ideas](https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-ideas)  

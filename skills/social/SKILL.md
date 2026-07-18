---
name: social
zh_name: "社交媒体策略"
en_name: "Social"
emoji: "📱"
description: |
  Social media strategy and post systems — platforms, pillars, hooks, calendar,
  listening, short-form video notes. For batch ready-to-post packs prefer
  social-content-factory / content-repurposer; this skill is strategy + systems.
triggers:
  - "social media strategy"
  - "social content plan"
  - "LinkedIn strategy"
  - "Twitter content plan"
  - "Instagram strategy"
  - "TikTok content"
  - "content calendar social"
  - "social listening"
  - "chiến lược social"
  - "lịch đăng mạng xã hội"
category: content
scenario: marketing
featured: 79
tags:
  - marketing
  - social
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
    entry: social-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Build social strategy: platforms, pillars, cadence, sample hooks, listening.
    Read product-marketing.md + DESIGN.md §8. Write social-plan.md + social-plan.html.
    For large ready-to-post matrices hand off social-content-factory.
  example_prompt_i18n:
    zh-CN: "社交媒体策略：平台、支柱、节奏、钩子样例、监听。读 product-marketing 与 DESIGN.md §8；输出 social-plan.md + HTML。大批量成稿交给 social-content-factory。"
    vi: "Chiến lược social: platform, pillars, cadence, hooks, listening. Đọc product-marketing + DESIGN.md §8; xuất social-plan.md + HTML. Batch post → social-content-factory."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/social"
---

# Social (Artifact OS)

You plan **social systems** (where, what pillars, how often, how to listen).

**Job:** platform mix · content pillars · hooks · calendar structure · engagement ·
listening · short-form notes.  
**Not your job:** full multi-platform ready-to-post pack → `social-content-factory` /
`content-repurposer`; hooks lab only → `hook-engine`.

Adapted from [marketingskills/social](https://github.com/coreyhaines31/marketingskills/tree/main/skills/social) (MIT).

## Mandatory references

1. `references/platforms.md`  
2. `references/platform-limits.md`  
3. `references/post-templates.md`  
4. `references/carousel-frameworks.md`  
5. `references/listening.md`  
6. `references/listening-sources-template.md`  
7. `references/reverse-engineering.md`  
8. `references/short-form-video.md`  
9. Context: `product-marketing.md` · `DESIGN.md` §8 · Content Pro strategy-inputs  

## Distinction (important)

| Skill | Role |
|-------|------|
| **`social`** | Strategy, pillars, cadence, systems |
| **`social-content-factory`** | Batch original posts for a period |
| **`content-repurposer`** | One source → multi-platform pack |
| **`hook-engine`** | Hooks-only lab |

## Output

`social-plan.md` + `social-plan.html`  

```
## Platforms · Pillars · Cadence · Sample posts/hooks · Calendar skeleton
## Listening · Metrics · Handoff to content factory
```

## Hard rules

No fake engagement metrics · brand voice · honest claims · platform limits.

## Vertical metadata

- **Related:** `social-content-factory`, `content-repurposer`, `hook-engine`, `product-marketing`, `content-strategy`, `ads`, `marketing-psychology`  
- **Upstream:** [marketingskills/social](https://github.com/coreyhaines31/marketingskills/tree/main/skills/social)  

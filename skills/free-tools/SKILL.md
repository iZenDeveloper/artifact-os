---
name: free-tools
zh_name: "免费工具获客"
en_name: "Free Tools"
emoji: "🛠️"
description: |
  Plan free marketing tools (calculators, graders, generators) for lead gen,
  SEO, and brand — ideation, lead capture, MVP scope, build vs buy. Not static
  PDF lead magnets (lead-magnets); not full product build specs.
triggers:
  - "free tool"
  - "free tools"
  - "marketing calculator"
  - "lead gen tool"
  - "engineering as marketing"
  - "interactive lead magnet"
  - "grader tool"
  - "generator tool"
  - "free widget"
  - "công cụ miễn phí"
  - "calculator marketing"
category: content
scenario: marketing
featured: 77
tags:
  - marketing
  - lead-gen
  - seo
  - tools
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: free-tool-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Plan a free marketing tool: type, audience, inputs/outputs, lead capture,
    SEO, MVP scope, scorecard. Read product-marketing.md. Write free-tool-plan.md
    + free-tool-plan.html. Specific problem; natural path to paid product.
  example_prompt_i18n:
    zh-CN: "规划免费营销工具：类型、受众、输入输出、获客、SEO、MVP、评分。读 product-marketing；输出 free-tool-plan.md + HTML。"
    vi: "Lập free tool marketing: type, audience, I/O, capture, SEO, MVP, scorecard. Đọc product-marketing; xuất free-tool-plan.md + HTML."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/free-tools"
---

# Free Tools (Artifact OS)

You plan **engineering-as-marketing tools** that capture demand and demonstrate expertise.

**Job:** tool concept · type · capture strategy · SEO · MVP scope · build/buy · scorecard.  
**Not your job:** static PDF magnet → `lead-magnets`; full app engineering PRD.

Adapted from [marketingskills/free-tools](https://github.com/coreyhaines31/marketingskills/tree/main/skills/free-tools) (MIT).

## Mandatory references

1. `references/tool-types.md`  
2. Context: `product-marketing.md` · `lead-magnets` · `seo-audit` / `programmatic-seo` · `analytics`

## Principles

Specific problem · high utility · low time · path to product · shareable/SEO when possible.

## Types (see refs)

Calculators · graders/audits · generators · lookalike/finder tools · templates-as-app · converters.

## Capture

Gate after value (partial result → email for full) · soft gate · product CTAs. Minimize fields.

## MVP

Ship core loop only · no login if avoidable · instrument events (`analytics`).

## Output

`free-tool-plan.md` + `free-tool-plan.html`  
Scorecard: demand · fit · effort · defensibility · SEO potential.

## Vertical metadata

- **Related:** `lead-magnets`, `product-marketing`, `seo-audit`, `programmatic-seo`, `analytics`, `ads`, `copywriting`  
- **Upstream:** [marketingskills/free-tools](https://github.com/coreyhaines31/marketingskills/tree/main/skills/free-tools)  

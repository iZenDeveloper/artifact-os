---
name: marketing-loops
zh_name: "营销循环"
en_name: "Marketing Loops"
emoji: "🔁"
description: |
  Design recurring self-running marketing workflows (cadence loops) an agent
  can execute — catalog, template, orchestration, guardrails. Not one-off
  campaigns (launch/ads); not full marketing-plan.
triggers:
  - "marketing loops"
  - "marketing-loops"
  - "recurring marketing workflow"
  - "weekly marketing loop"
  - "agent marketing cadence"
  - "self-running marketing"
  - "marketing automation loop"
  - "vòng lặp marketing"
category: content
scenario: marketing
featured: 74
tags:
  - marketing
  - automation
  - loops
  - ops
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: marketing-loops.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design marketing loop(s): cadence, steps, inputs/outputs, skills invoked,
    guardrails. Read product-marketing.md. Write marketing-loops.md +
    marketing-loops.html using loop catalog/template. No spam loops.
  example_prompt_i18n:
    zh-CN: "设计营销循环：节奏、步骤、输入输出、调用 skills、护栏。读 product-marketing；输出 marketing-loops.md + HTML。"
    vi: "Thiết kế marketing loop: cadence, steps, I/O, skills, guardrails. Đọc product-marketing; xuất marketing-loops.md + HTML."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-loops"
---

# Marketing Loops (Artifact OS)

You design **repeatable agent-run marketing workflows** on a cadence.

**Job:** pick/author loops · cadence · steps · state · orchestration · guardrails.  
**Not your job:** one-shot launch plan → `launch`; full AARRR plan → `marketing-plan`.

Adapted from [marketingskills/marketing-loops](https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-loops) (MIT).

## Mandatory references

1. `references/loop-catalog.md`  
2. `references/loop-template.md`  
3. `references/loop-orchestration.md`  
4. `references/loop-state.md`  
5. `references/loop-guardrails.md`  

## Anatomy

Trigger/cadence · inputs · steps (skills + tools) · outputs · success metrics ·
kill switches · human review points.

## Cadence rule

Match loop cost to value. Daily only for high-signal cheap checks; weekly default
for content/ops; monthly for strategy refresh.

## When NOT to loop

Unstable product · no measurement · requires heavy creative each time · compliance risk.

## Output

`marketing-loops.md` + `marketing-loops.html`  
One or more loops from catalog or new via template; map steps to Artifact skills.

## Vertical metadata

- **Related:** `marketing-plan`, `content-strategy`, `analytics`, `social`, `seo-audit`, `emails`, `ads`  
- **Upstream:** [marketingskills/marketing-loops](https://github.com/coreyhaines31/marketingskills/tree/main/skills/marketing-loops)  

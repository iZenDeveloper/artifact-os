---
name: copy-editing
zh_name: "文案润色"
en_name: "Copy Editing"
emoji: "✏️"
description: |
  Edit and improve existing marketing copy — seven sweeps, plain-English fixes,
  content refresh. Not blank-page drafting (copywriting); not full CRO audit (cro).
triggers:
  - "copy editing"
  - "copy-editing"
  - "edit this copy"
  - "improve this copy"
  - "proofread marketing"
  - "tighten this copy"
  - "content refresh"
  - "rewrite for clarity"
  - "chỉnh sửa copy"
  - "sửa lại văn bản marketing"
category: content
scenario: marketing
featured: 80
tags:
  - marketing
  - copy
  - editing
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: copy-edit.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Edit this marketing copy with seven sweeps + clarity pass. Read DESIGN.md §8
    + product-marketing.md. Write copy-edit.md (before/after + notes) +
    copy-edit.html. No fake proof; keep brand voice.
  example_prompt_i18n:
    zh-CN: "七遍扫读润色营销文案：读 DESIGN.md §8 与 product-marketing；输出 copy-edit.md（前后对比）+ HTML。禁止假证明。"
    vi: "Edit copy 7 sweeps: đọc DESIGN.md §8 + product-marketing; xuất copy-edit.md (before/after) + HTML. Không fake proof."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/copy-editing"
---

# Copy Editing (Artifact OS)

You **improve existing marketing copy** systematically — clarity, conversion,
and brand fit.

**Job:** seven sweeps · plain-English replacements · checklist · refresh notes ·
before/after.  
**Not your job:** write from blank brief → `copywriting`; full page structure CRO →
`cro`.

Adapted from [marketingskills/copy-editing](https://github.com/coreyhaines31/marketingskills/tree/main/skills/copy-editing) (MIT).

## Mandatory references

1. `references/checklist.md`  
2. `references/plain-english-alternatives.md`  
3. `references/content-refresh.md`  
4. Context: `DESIGN.md` §8 · `product-marketing.md` · original draft  

## Core approach

Clarity before clever · specificity over superlatives · cut fluff · preserve voice ·
never invent claims.

## Seven sweeps (summary)

Clarity · specificity · benefits · friction/CTA · proof honesty · voice/brand ·
skim (headings, bullets, length).

## Output

`copy-edit.md` + `copy-edit.html`  

```
## Goals · Sweep notes · Before/After blocks · Remaining risks · Handoff
```

## Vertical metadata

- **Related:** `copywriting`, `cro`, `product-marketing`, `marketing-psychology`, `content-strategy`  
- **Upstream:** [marketingskills/copy-editing](https://github.com/coreyhaines31/marketingskills/tree/main/skills/copy-editing)  

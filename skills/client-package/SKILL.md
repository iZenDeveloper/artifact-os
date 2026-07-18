---
name: client-package
zh_name: "客户交付包"
en_name: "Client Package"
emoji: "📦"
description: |
  Assemble an agency-ready Client Package: brand slug, delivery notes, and
  per-platform ready-to-paste captions (plus optional source HTML). Not a
  full multi-platform craft run alone (content-repurposer); not zip of raw
  project tree alone (Export as ZIP).
triggers:
  - "client package"
  - "client-package"
  - "export for client"
  - "deliverable package"
  - "agency package"
  - "handoff package"
  - "captions zip"
  - "package for client"
  - "gói giao client"
  - "package giao khách"
  - "xuất package client"
  - "deliverable zip"
category: content
scenario: marketing
featured: 79
tags:
  - marketing
  - agency
  - deliverable
  - export
  - vertical-os
  - content-pro
  - brand
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Build a Client Package for this campaign / pack. Brand slug from active
    Brand if known. Extract or write per-platform ready-to-paste captions,
    delivery notes, PACKAGE.md + brand.json layout. Write files under
    client-package/ and a summary index.html.
  example_prompt_i18n:
    zh-CN: "客户交付包：品牌 slug、交付说明、各平台可粘贴文案；PACKAGE.md + brand.json；写入 client-package/ 与 index.html 摘要。"
    vi: "Client Package: brand slug, notes giao, caption từng nền; PACKAGE.md + brand.json; ghi client-package/ + index.html tóm tắt."
---

# Client Package — Artifact OS

You assemble a **folder a marketer can send to a client or scheduler** without
rewriting posts by hand.

**Job:** brand identity · delivery notes · captions per platform · package layout.  
**Not your job:** invent the full multi-platform craft from scratch when a
Content Pro pack already exists → extract then fill gaps; full repurpose →
`content-repurposer`.

---

## Mandatory references

1. `references/package-layout.md` — canonical zip / folder tree  
2. `../content-repurposer/references/ready-to-post.md` — caption fields per platform  
3. `../content-repurposer/references/brand-voice.md` — DESIGN.md §8  
4. Optional: active `design-systems/<brand-slug>/DESIGN.md`

---

## Inputs

| Field | Notes |
|-------|--------|
| **source** | Existing pack HTML, or brief to generate captions |
| **brandSlug** | Active Brand / design-system id (e.g. `professional-clean`) |
| **title** | Campaign / deliverable name |
| **platforms** | Subset of XHS · TikTok · LinkedIn · Threads · Email · FB · YT |
| **notes** | Strategy / usage constraints for the client |

---

## Hard rules

1. **One file per platform** under `captions/` — platform-native copy (no clone-across).  
2. **Brand slug required** when a Brand is active; else label `(not set)` and ask once.  
3. **No fake stats** in captions or notes.  
4. Prefer **extract** from `#ready-to-post` / `.copy` blocks when source HTML exists.  
5. Always write **`PACKAGE.md` + `brand.json` + `notes/delivery.md`**.  
6. Include **`source/index.html`** when packaging an existing artifact.

---

## Workflow

### Step 0 — Context

```
Title: …
Brand slug: …
Platforms: …
Source: pack HTML / brief
```

### Step 1 — Collect captions

- If HTML pack: pull Ready-to-post / `.copy` per platform.  
- If brief only: write ready-to-paste captions (Content Pro v2.2 fields).  
- Optional Variant B hooks → separate `captions/*-b.txt` only if user asked A/B.

### Step 2 — Notes

Strategy slice, offer, legal/compliance flags, posting windows (guidance).

### Step 3 — Layout files

Write under `client-package/` (or `{title-slug}/`) per `package-layout.md`.

### Step 4 — Preview

`index.html` summary: brand badge · platform list · copy-ready status · QA checklist.

### Step 5 — Handoff

User can **Export Client Package** from the app Download menu (zip), or download
the folder from the project tree.

---

## Output files

| Path | Required |
|------|----------|
| `PACKAGE.md` | Yes |
| `brand.json` | Yes |
| `notes/delivery.md` | Yes |
| `captions/{platform}.txt` | Yes (≥1) |
| `source/index.html` | When packaging an artifact |
| `index.html` | Preview summary |

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| Build the multi-platform pack first | `content-repurposer` / `social-content-factory` |
| Hooks only | `hook-engine` |
| Pick among variants | `variants-comparison` |
| Paid matrix | `ad-variants-generator` |

**App export:** Download → **Export Client Package** builds the same zip layout
from the open HTML + project brand when possible.

---

## QA

- [ ] brand slug recorded  
- [ ] ≥1 caption file, platform-native  
- [ ] PACKAGE.md + brand.json + notes  
- [ ] No invented metrics  
- [ ] Client can copy-paste without opening Figma  

**FAIL:** single giant .txt dumping all platforms without labels.

---

## Vertical metadata

- **Vertical:** marketing  
- **Related:** `content-repurposer`, `social-content-factory`, `hook-engine`, `variants-comparison`, `product-marketing`  
- **Standard:** Content Pro v2.2 deliverable layer  

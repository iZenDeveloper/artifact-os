---
name: social-content-factory
zh_name: "社媒内容工厂"
en_name: "Social Content Factory"
emoji: "🏭"
description: |
  Generate a batch of native social posts from a brief or product angle for XHS, TikTok, LinkedIn, and Threads.
  Complements content-repurposer (batch original vs single-source repurpose).
triggers:
  - "social content factory"
  - "batch social posts"
  - "content batch"
  - "lô nội dung social"
  - "xưởng content"
category: content
scenario: marketing
featured: 80
tags: ["social", "batch", "marketing", "vertical-os"]
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
    requires: true
  example_prompt: |
    Create a 1-week social content batch (XHS, TikTok, LinkedIn, Threads) for my brief.
    Follow the active Design System. Provide captions + visual direction.
---

# Social Content Factory (Vertical Content OS)

Batch **original** social content from a brief (not the same as repurposing one long asset).

## When to use

- User wants a **week of posts** or a **campaign batch**
- Starting from a product/angle, not from an existing article/transcript  
  → If they have a long source doc, prefer `content-repurposer`

## Workflow

1. Clarify offer, audience, language, CTA, platforms, volume (default: 5–7 pieces)
2. Build a content pillar map (3 pillars max)
3. For each piece: hook, body, CTA, visual note, platform
4. Render an HTML board: calendar view + per-post detail cards
5. Apply active Design System voice + visuals

## Output

- Content calendar table (day / platform / pillar / hook)
- Full captions per post
- Visual direction per post (size + layout)
- Optional variants (A/B hooks) for top 2 posts

## Vertical metadata

- **Vertical:** marketing
- **Related:** `content-repurposer`, `ad-variants-generator`, `card-xiaohongshu`

---
name: social-content-factory
zh_name: "社媒内容工厂"
en_name: "Social Content Factory"
emoji: "🏭"
description: |
  Batch original social posts under Content Pro v2.1: paradox hooks, personal stakes,
  TikTok peak 10/10, no soft middle cards, offer CTAs, calibrated scores. Consistent 9+/10.
triggers:
  - "social content factory"
  - "batch social posts"
  - "content batch"
  - "content pro batch"
  - "lô nội dung social"
  - "xưởng content"
category: content
scenario: marketing
featured: 80
tags: ["social", "batch", "marketing", "vertical-os", "content-pro"]
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
    1-week Content Pro v2 batch. Every piece: paradox hook, stakes, insight drama, CTA offer.
    TikTok items need filmable shot lists. No flat fact titles.
---

# Social Content Factory — Content Pro **v2**

Batch **original** posts from a brief.  
Long-form source → use `content-repurposer`.

**Mandatory:** `../content-repurposer/references/content-pro-standards.md` (v2.1).

---

## Bar

- Target **consistent 9+/10** per piece  
- **7.x clean copy fails**; **8.5–8.9 science-interesting fails** flagship bar  
- Personal stakes (*you/body/home*), not only spectacle  
- Flat fact hooks banned  
- CTA = keyword **+ offer**  
- TikTok: energy map + peak 10/10 cinematic frame  
- Calibrated self-score (no optimism)  

---

## Per-piece requirements

1. Hook with **paradox / cost / almost-loss**  
2. Mini-story (stakes + turn)  
3. Insight with drama + portable lesson  
4. Platform-native length  
5. CTA offer matrix row  
6. Visual direction (TikTok: shot list)  

### Platform bands

| Platform | Format | Hook bar |
|----------|--------|----------|
| XHS | 5–7 cards 1080×1440 | Cover ≥ 8.5 |
| TikTok | 15–25s | 0–3s kill + drama peak |
| LinkedIn | 1200–2200 chars | Paradox line 1 |
| Threads | 4–8 posts | P1 punch |

---

## Workflow

1. Pillars ≤ 3 · volume default 5–7  
2. For each piece write weak→strong hook pair; ship strong only  
3. HTML calendar + detail cards + offer column  
4. Self-score; rewrite any item &lt; 8.5 on hook  

## QA

- [ ] Flat-hook ban  
- [ ] Story not fact dump  
- [ ] Offer CTA  
- [ ] TikTok shot list if video  
- [ ] DS punch without hype spam  

## Vertical metadata

- **Standard:** Content Pro **v2**  
- **Related:** `content-repurposer`, `ad-variants-generator`  

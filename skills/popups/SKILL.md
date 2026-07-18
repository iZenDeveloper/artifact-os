---
name: popups
zh_name: "弹窗转化"
en_name: "Popups"
emoji: "🪟"
description: |
  Design conversion popups and overlays — triggers, types, copy, frequency,
  a11y/GDPR, measurement. Not full lead magnet strategy (lead-magnets); not
  signup form redesign alone (signup); not dark-pattern spam.
triggers:
  - "popup"
  - "pop-up"
  - "modal"
  - "exit intent"
  - "slide-in"
  - "email capture popup"
  - "overlay"
  - "banner popup"
  - "lead capture modal"
  - "popup CRO"
  - "popup quảng cáo"
  - "exit intent popup"
category: content
scenario: marketing
featured: 78
tags:
  - marketing
  - cro
  - popups
  - lead-gen
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: popup-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design popup strategy: trigger, type, copy, frequency, targeting, a11y/GDPR.
    Read product-marketing.md + lead-magnet-plan if any. Write popup-plan.md +
    popup-plan.html. Value-first; easy close; no spam walls.
  example_prompt_i18n:
    zh-CN: "设计弹窗策略：触发、类型、文案、频次、定向、无障碍/GDPR。读 product-marketing；输出 popup-plan.md + HTML。先价值；易关闭；禁骚扰墙。"
    vi: "Thiết kế popup: trigger, type, copy, frequency, targeting, a11y/GDPR. Đọc product-marketing; xuất popup-plan.md + HTML. Value-first; đóng dễ; không spam."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/popups"
---

# Popup CRO (Artifact OS)

You design **overlays that convert without destroying trust**.

**Job:** trigger strategy · popup type · design/copy · frequency/targeting ·
compliance/a11y · metrics · multi-popup map.  
**Not your job:** what lead magnet to create → `lead-magnets`; full page CRO →
`cro`; email sequence after capture → `emails`.

Adapted from [marketingskills/popups](https://github.com/coreyhaines31/marketingskills/tree/main/skills/popups) (MIT).

---

## Principles

1. **Timing** beats more popups  
2. **Value obvious** in 1 second  
3. **Respect** — easy close, frequency caps, no trap  

---

## Triggers

Time delay · scroll % · exit intent · click · page count · behavior (e.g. pricing
view). Match offer to page context.

## Types

Email capture · lead magnet · discount (if real) · exit intent · announcement
banner · slide-in.

## Design & copy

Clear hierarchy · not full-screen on mobile by default · visible close ·
headline benefit · short sub · CTA · soft decline (“No thanks”).  

Frequency: once per session / N days; suppress for customers & recent converters.

## Compliance

Consent for marketing · don’t block content permanently · keyboard/focus trap
rules · respect reduced motion when relevant · Google interstitial guidelines on
mobile.

## Measurement

View → engage → convert · close rate · email quality · unsubscribe after popup
source. Benchmarks only as industry ranges if no brand data.

---

## Output files

1. **`popup-plan.md`**  
2. **`popup-plan.html`**  

```
## Brief · Popup designs (trigger/type/copy) · Rules · Compliance · Metrics · Tests · Handoff lead-magnets/emails
```

## Hard rules

No fake exit offers · no unclosable modals · no fake countdown · honest free claims.

## Vertical metadata

- **Related:** `lead-magnets`, `cro`, `emails`, `copywriting`, `ab-testing`, `analytics`, `product-marketing`  
- **Upstream:** [marketingskills/popups](https://github.com/coreyhaines31/marketingskills/tree/main/skills/popups)  

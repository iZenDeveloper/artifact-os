---
name: ad-variants-generator
zh_name: "广告文案变体"
en_name: "Ad Variants Generator"
emoji: "🧪"
description: |
  Generate multiple paid-social / search ad creative variants (headlines, primary text, CTAs, angle matrix) from one brief.
triggers:
  - "ad variants"
  - "ad copy variants"
  - "A/B ad creative"
  - "biến thể quảng cáo"
category: content
scenario: marketing
featured: 70
tags: ["ads", "variants", "marketing", "vertical-os"]
od:
  mode: design-system
  category: marketing-creative
  design_system:
    requires: true
  example_prompt: |
    Generate 10 ad variants (headlines + primary text + CTA) for this offer. Group by angle. Follow the active Design System voice.
---

# Ad Variants Generator (Vertical Content OS)

Produce a **structured matrix of ad variants** for testing — not a single “best” ad.

## Workflow

1. Capture offer, audience, proof, offer constraints, platform (Meta / TikTok / LinkedIn / Google)
2. Define 4–6 angles (pain, outcome, social proof, objection, urgency, identity)
3. For each angle: 2–3 headlines + 1–2 primary texts + CTA
4. Mark compliance risks (unsubstantiated claims, restricted verticals)
5. Output a clean HTML or markdown table for copy-paste into ads manager

## Rules

- Follow Design System voice (Personal Bold ≠ Professional Clean)
- No fake statistics
- Label speculative claims for human review
- Keep headline length realistic per platform

## Vertical metadata

- **Vertical:** marketing
- **Related:** `content-repurposer`, `social-content-factory`, `ad-creative`

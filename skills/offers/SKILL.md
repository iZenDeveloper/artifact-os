---
name: offers
zh_name: "优惠设计"
en_name: "Offers"
emoji: "🎁"
description: |
  Construct the offer itself — value equation, bonuses, guarantees, real scarcity,
  naming, payment structure. For pure SaaS tiers see pricing first. For page copy
  see copywriting; for launch moment see launch.
triggers:
  - "offer design"
  - "build an offer"
  - "irresistible offer"
  - "grand slam offer"
  - "value stack"
  - "bonus stack"
  - "guarantee"
  - "risk reversal"
  - "scarcity"
  - "urgency"
  - "high-ticket offer"
  - "productize a service"
  - "payment plan"
  - "why isn't my offer converting"
  - "thiết kế offer"
  - "gói dịch vụ"
category: content
scenario: marketing
featured: 84
tags:
  - marketing
  - offers
  - conversion
  - monetization
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: offer-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design/improve the offer (not just the page): value equation, 6-part anatomy,
    bonuses, guarantee, real scarcity, name, price structure. Read product-marketing.md.
    Write offer-plan.md + offer-plan.html. No fake scarcity or inflated $ value.
  example_prompt_i18n:
    zh-CN: "设计/改进 offer 本体：价值公式、六要素、赠品、保证、真实稀缺、命名、支付结构。读 product-marketing；输出 offer-plan.md + HTML。禁止假倒计时与虚标价值。"
    vi: "Thiết kế offer: value equation, 6 thành phần, bonus, guarantee, scarcity thật, tên, payment. Đọc product-marketing; xuất offer-plan.md + HTML. Không scarcity giả."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/offers"
---

# Offer Design (Artifact OS)

You improve **the offer underneath the page** — not only the copy that describes it.

**Job:** value equation diagnosis · 6-part anatomy · bonuses · guarantee · real
scarcity · naming · payment structure.  
**Not your job:** SaaS tier packaging first → `pricing`; sales page prose →
`copywriting`; in-app upgrade UI → `paywalls`; GTM calendar → `launch`.

Adapted from [marketingskills/offers](https://github.com/coreyhaines31/marketingskills/tree/main/skills/offers) (MIT).

---

## When this skill vs pricing

| Use **offers** | Use **pricing** first |
|----------------|------------------------|
| Services, courses, coaching, info, high-ticket B2B, DR | Self-serve SaaS tiers, freemium, value metric |

---

## Mandatory references

1. `references/value-equation.md`  
2. `references/offer-anatomy.md`  
3. `references/guarantee-design.md`  
4. `references/bonus-stacking.md`  
5. `references/scarcity-urgency.md`  
6. `references/offer-formats.md`  
7. `references/examples.md`  

---

## Value equation

```
Value ≈ (Dream outcome × Likelihood) / (Time delay × Effort)
```

Raise numerator / lower denominator before defaulting to “cut price.”

---

## Six components

1. Core deliverable  
2. Bonus stack  
3. Guarantee  
4. Scarcity / urgency (**real only**)  
5. Name  
6. Price + payment structure  

### Diagnostic loop

Business type → state current offer → score 4 levers → audit anatomy → fix **one**
weakest lever → draft change → honest lift (often 10–40% per lever, not “5x”).

---

## Hard rules

No fake countdowns · no “worth $50k” without comparable · no guarantee spam ·
no course-bro banned vocab (game-changing, secret, 10x…) · specificity wins.

---

## Output files

1. **`offer-plan.md`**  
2. **`offer-plan.html`**  

```
## Brief · Value equation scores · Anatomy · Changed components · Name · Price structure
## Risk notes · Handoff (copywriting / pricing / launch / sales-enablement)
```

## Vertical metadata

- **Related:** `pricing`, `copywriting`, `cro`, `launch`, `paywalls`, `sales-enablement`, `emails`, `marketing-psychology`, `product-marketing`  
- **Upstream:** [marketingskills/offers](https://github.com/coreyhaines31/marketingskills/tree/main/skills/offers)  

---
name: pricing
zh_name: "定价策略"
en_name: "Pricing"
emoji: "💰"
description: |
  Design SaaS pricing, packaging, and monetization — value metric, tiers,
  price points, freemium/trial, annual vs monthly, increases. Strategy + page
  structure, not full long-form site copy alone. For paywall UI CRO see
  paywall-upgrade-cro if installed; deal desk → revops; sales proposals →
  sales-enablement.
triggers:
  - "pricing"
  - "pricing tiers"
  - "freemium"
  - "free trial"
  - "packaging"
  - "price increase"
  - "value metric"
  - "Van Westendorp"
  - "willingness to pay"
  - "monetization"
  - "how much should I charge"
  - "my pricing is wrong"
  - "pricing page"
  - "annual vs monthly"
  - "per seat pricing"
  - "should I offer a free plan"
  - "giá bán"
  - "gói giá"
  - "định giá SaaS"
category: content
scenario: marketing
featured: 84
tags:
  - marketing
  - pricing
  - monetization
  - packaging
  - saas
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: pricing-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design pricing strategy and packaging for this product: value metric, Good-
    Better-Best tiers, price points (or TBD), trial/freemium stance, annual
    discount. Read product-marketing.md + DESIGN.md §8. Write pricing-plan.md +
    pricing-plan.html. No fake competitor prices or conversion rates as facts.
  example_prompt_i18n:
    zh-CN: "设计定价与包装：价值指标、Good-Better-Best、价位/TBD、试用或 freemium、年付折扣。读 product-marketing.md 与 DESIGN.md §8；输出 pricing-plan.md + HTML。禁止编造竞品价格与转化率。"
    vi: "Thiết kế pricing + packaging: value metric, Good-Better-Best, price/TBD, trial/freemium, annual discount. Đọc product-marketing.md + DESIGN.md §8; xuất pricing-plan.md + HTML. Không bịa giá đối thủ / conversion."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/pricing"
---

# Pricing Strategy (Artifact OS)

You design **pricing, packaging, and monetization** so price captures value and
scales with customer success.

**Job:** value metric · tier packaging · price-point guidance · research plan ·
pricing-page structure · increase playbook.  
**Not your job:** full page HTML marketing rewrite alone → `copywriting` / `cro`;
in-app paywall micro-CRO → `paywall-upgrade-cro` if installed; deal-desk approval
chains → `revops`; proposal/deck delivery → `sales-enablement`.

Adapted from [marketingskills/pricing](https://github.com/coreyhaines31/marketingskills/tree/main/skills/pricing) (MIT).

---

## Mandatory references

1. `references/tier-structure.md` — Good-Better-Best, persona packaging  
2. `references/research-methods.md` — Van Westendorp, MaxDiff, WTP  
3. Context:  
   - `product-marketing.md` (ICP, offer, competitors, goals)  
   - Brand `DESIGN.md` **§8** for pricing-page tone  

---

## Before starting

| Slice | Ask / pull |
|-------|------------|
| **Business** | Product type · current prices · SMB/mid/ent · PLG/sales/hybrid |
| **Value & competition** | Primary value · alternatives · competitor packaging (**Assumed** if unknown) |
| **Performance** | Conversion · ARPU · churn — only if user has real numbers |
| **Goals** | Growth vs revenue vs profit · upmarket vs downmarket |

Read product-marketing first. Never invent ARPU/churn as brand fact.

---

## Three pricing axes

1. **Packaging** — what’s in each tier (features, limits, support)  
2. **Pricing metric** — what you charge for (seat, usage, flat…)  
3. **Price point** — dollar amounts and anchors  

### Value-based pricing

Price between **next best alternative** (floor for differentiation) and **perceived value** (ceiling). Cost-to-serve is a floor for margin, not the strategy.

---

## Value metrics

| Metric | Best for | Examples |
|--------|----------|----------|
| Per seat | Collaboration | Slack-style |
| Per usage | Variable consumption | API, infra |
| Per feature | Modular | Add-on packs |
| Per contact/record | CRM / email | Contact limits |
| Per transaction | Payments / marketplaces | % or fixed fee |
| Flat fee | Simple products | All-in one price |

Test: *As they use more of [metric], do they get more value?* If no → misaligned.

Good metrics: easy to understand · scale with growth · hard to game.

---

## Tier structure (summary)

**Good** — core, limited, entry price  
**Better** — recommended / full, anchor  
**Best** — premium, advanced, ~2–3× Better  

Differentiate via feature gates · usage limits · support · access (API, SSO, brand).  

Detail: `references/tier-structure.md`.

### Trial / freemium

| Model | When |
|-------|------|
| Free trial (time) | Clear aha, low setup cost |
| Freemium | Viral / network effects, clear upgrade path |
| Reverse trial | Show premium first, then free tier |
| Sales-assisted only | High ACV, complex onboarding |

State recommendation + risk (cost of free users, conversion path).

---

## Research

- **Van Westendorp** — too expensive / too cheap / expensive / bargain → acceptable range  
- **MaxDiff** — feature importance for packaging  
- Other methods: `references/research-methods.md`  

If no research exists: propose a **lightweight research plan**, not fake WTP curves.

---

## Price increases

**Signals (industry heuristics):** competitors raised · no price flinch · “too cheap” · very high conversion · low churn · more value shipped.  

**Plays:** grandfather existing · delayed announce 3–6 mo · raise + add value · restructure plans.  

Document who is grandfathered and comms path → hand off copy to `emails` / `copywriting`.

---

## Pricing page structure

Above fold: tier table · recommended highlight · monthly/annual toggle · CTA per tier.  
Also: feature matrix · who each tier is for · FAQ · annual discount callout · guarantee (if real) · logos (if real).  

Psychology (use carefully): anchoring · decoy middle · charm vs round for premium.  
Pair with `marketing-psychology` / `cro` for conversion pass.

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| ICP / positioning for packaging | `product-marketing` |
| Pricing page conversion | `cro` + `copywriting` |
| Schema Offer markup | `schema` |
| Deal desk / discount tiers | `revops` |
| Sales proposal pricing slides | `sales-enablement` |
| Launch new pricing | `launch` |
| In-app upgrade paywall | `paywall-upgrade-cro` if installed |

---

## Output files (always both)

1. **`pricing-plan.md`** — strategy + packaging + page outline  
2. **`pricing-plan.html`** — scannable preview (axes, tiers table, page wire)

### pricing-plan.md shape

```
## Brief
Product · motion · market · goal · current pricing (or none)

## Value metric
Choice · why · how it scales · gaming risks

## Packaging
Good / Better / Best (or custom) — features, limits, who-for
Free/trial stance

## Price points
Currency · monthly/annual · TBD vs user-supplied numbers
Annual discount strategy
Enterprise/custom note

## Research plan
Done / proposed methods · sample questions

## Pricing page outline
Sections · CTAs · FAQ seeds · Assumed competitive notes

## Increase / change rollout (if relevant)
Who grandfathered · timeline · comms handoff

## Metrics to watch
ARPU · conversion · expansion · churn — targets only if user-supplied

## Handoff
cro · copywriting · revops · sales-enablement · schema
```

HTML: value-metric card + tier comparison table + research checklist + page outline.

---

## Hard rules

1. **No invented competitor prices, conversion rates, or WTP survey results.**  
2. Prefer **value-based** reasoning over cost-plus alone.  
3. **TBD** for dollar amounts when user hasn’t decided — still ship packaging logic.  
4. Don’t recommend dark patterns (hidden fees, fake scarcity).  
5. Enterprise/custom: don’t invent discounts; sketch process → `revops`.  
6. Full long-form page prose optional; structure + key lines enough unless user asks for full copy.  

---

## QA

- [ ] Value metric stated with rationale  
- [ ] Tiers differentiated clearly  
- [ ] Price points real or TBD  
- [ ] Motion-aligned (self-serve vs sales)  
- [ ] Research status or plan  
- [ ] Page outline present  
- [ ] `pricing-plan.md` + `pricing-plan.html` written  

**FAIL:** random dollar amounts with no metric or packaging logic.

---

## Vertical metadata

- **Related:** `product-marketing`, `cro`, `copywriting`, `revops`, `sales-enablement`, `launch`, `schema`, `marketing-psychology`, `paywall-upgrade-cro`  
- **Upstream:** [marketingskills/pricing](https://github.com/coreyhaines31/marketingskills/tree/main/skills/pricing)  

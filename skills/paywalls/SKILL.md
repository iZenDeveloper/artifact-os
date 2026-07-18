---
name: paywalls
zh_name: "付费墙升级"
en_name: "Paywalls"
emoji: "🧱"
description: |
  Design in-app paywalls and upgrade screens — feature gates, usage limits, trial
  expiry, timing, anti-dark-patterns. Prefer this full skill over light
  paywall-upgrade-cro stub. Not pricing tiers alone (pricing); not cancel flows
  (churn-prevention).
triggers:
  - "paywall"
  - "upgrade screen"
  - "upgrade modal"
  - "feature gate"
  - "usage limit paywall"
  - "trial expiration"
  - "in-app upgrade"
  - "upsell screen"
  - "paywall CRO"
  - "màn hình nâng cấp"
  - "paywall ứng dụng"
category: content
scenario: marketing
featured: 85
tags:
  - marketing
  - monetization
  - paywall
  - cro
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: paywall-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design paywall/upgrade UX for [feature gate / usage / trial end]. Read
    product-marketing.md + pricing-plan if any. Write paywall-plan.md +
    paywall-plan.html. Value before ask; respect No; no dark patterns.
  example_prompt_i18n:
    zh-CN: "设计付费墙/升级屏：功能门/用量/试用到期。读 product-marketing 与 pricing；输出 paywall-plan.md + HTML。先价值后要价；禁止暗模式。"
    vi: "Thiết kế paywall/upgrade: feature gate/usage/trial. Đọc product-marketing + pricing; xuất paywall-plan.md + HTML. Value trước ask; không dark pattern."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/paywalls"
---

# Paywall & Upgrade CRO (Artifact OS)

You design **in-app monetization surfaces** that convert without trapping users.

**Job:** trigger points · screen components · feature/usage/trial patterns ·
timing/frequency · upgrade path · tests · anti-patterns.  
**Not your job:** tier packaging dollars → `pricing`; full cancel/save →
`churn-prevention`; marketing site pricing page → `cro` / `copywriting`.

**Note:** Prefer this skill over the light `paywall-upgrade-cro` catalogue stub.

Adapted from [marketingskills/paywalls](https://github.com/coreyhaines31/marketingskills/tree/main/skills/paywalls) (MIT).

---

## Mandatory references

1. `references/experiments.md`  
2. Context: `product-marketing.md` · `pricing` plan · `DESIGN.md` §8 · `ab-testing`  

---

## Principles

1. **Value before ask** — show what they get  
2. **Show, don’t only tell** — preview locked value when fair  
3. **Friction-free path** to payment  
4. **Respect the No** — clear dismiss; no trap loops  

---

## Triggers

| Type | When |
|------|------|
| Feature gate | Click locked feature |
| Usage limit | Hit plan cap |
| Trial expiration | Trial ending / ended |
| Time-based | After value demonstrated — not day 0 spam |

**Don’t show:** during critical failure recovery · right after signup before value · every session nag.

---

## Screen components

Headline (outcome) · benefit bullets · plan/price clarity · primary CTA · secondary dismiss · social proof **if real** · FAQ/trust micro · comparison to free plan when useful.

### Types

**Feature lock** · **Usage limit** (soft wall + upgrade) · **Trial end** (what they lose + continue options).

### Upgrade path

Paywall → plan select → payment → success + first paid feature highlight.

---

## Anti-patterns

Fake scarcity · hidden close · confirm-shaming · bait-and-switch · force continuous modals · invent “others upgraded” counts.

---

## Output files

1. **`paywall-plan.md`**  
2. **`paywall-plan.html`**  

```
## Brief · Triggers · Screen copy/wire · Timing rules · Metrics · Tests · Handoff
```

## Vertical metadata

- **Related:** `pricing`, `cro`, `copywriting`, `onboarding`, `churn-prevention`, `ab-testing`, `product-marketing`, `paywall-upgrade-cro`  
- **Upstream:** [marketingskills/paywalls](https://github.com/coreyhaines31/marketingskills/tree/main/skills/paywalls)  

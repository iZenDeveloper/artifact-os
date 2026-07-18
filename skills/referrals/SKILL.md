---
name: referrals
zh_name: "推荐计划"
en_name: "Referrals"
emoji: "🔗"
description: |
  Design referral and affiliate programs — incentives, dual-sided rewards,
  fraud guardrails, launch checklist, measurement. Not cold outbound lists
  (prospecting); not lifecycle email alone (emails).
triggers:
  - "referral program"
  - "referrals"
  - "affiliate program"
  - "word of mouth program"
  - "invite a friend"
  - "referral rewards"
  - "ambassador program"
  - "chương trình giới thiệu"
  - "affiliate marketing program"
category: content
scenario: marketing
featured: 76
tags:
  - marketing
  - growth
  - referrals
  - affiliate
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: referral-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design a referral/affiliate program: who refers, rewards, rules, fraud,
    launch, metrics. Read product-marketing.md. Write referral-plan.md +
    referral-plan.html. Dual-sided when possible; no fake “viral” claims.
  example_prompt_i18n:
    zh-CN: "设计推荐/联盟计划：对象、奖励、规则、防欺诈、上线、指标。读 product-marketing；输出 referral-plan.md + HTML。"
    vi: "Thiết kế referral/affiliate: ai mời, thưởng, rules, fraud, launch, metrics. Đọc product-marketing; xuất referral-plan.md + HTML."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/referrals"
---

# Referrals (Artifact OS)

You design **word-of-mouth systems** that retained users (and partners) use.

**Job:** referral vs affiliate choice · incentive design · program rules ·
optimize loops · metrics · launch checklist · email touchpoints handoff.  
**Not your job:** full email copy → `emails`; prospect lists → `prospecting`.

Adapted from [marketingskills/referrals](https://github.com/coreyhaines31/marketingskills/tree/main/skills/referrals) (MIT).

## Mandatory references

1. `references/affiliate-programs.md`  
2. `references/program-examples.md`  
3. Context: `product-marketing.md` · `pricing` · `churn-prevention` (happy users first)

## Referral vs affiliate

| | Referral | Affiliate |
|--|----------|-----------|
| Who | Customers | Creators/partners |
| Motivation | Product love + reward | Commission |
| Typical | Credit both sides | % of sale |

## Design levers

Who can join · what they share · dual-sided rewards · attribution window · caps ·
fraud (self-ref, disposable emails) · UX (one-click link).

## Metrics

Referral rate · viral coefficient · CAC of referred · fraud rate · reward cost %.

## Output

`referral-plan.md` + `referral-plan.html`  
Sections: model · rewards · rules · UX · emails (outline → `emails`) · launch · KPIs.

## Vertical metadata

- **Related:** `emails`, `product-marketing`, `pricing`, `marketing-plan`, `analytics`, `churn-prevention`  
- **Upstream:** [marketingskills/referrals](https://github.com/coreyhaines31/marketingskills/tree/main/skills/referrals)  

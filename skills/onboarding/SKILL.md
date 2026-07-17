---
name: onboarding
zh_name: "激活引导"
en_name: "Onboarding"
emoji: "🚀"
description: |
  Design product onboarding and activation — aha moment, first session, checklists,
  empty states, multi-channel coordination. Not lifecycle email alone (emails);
  not cancel/churn (churn-prevention); not signup form CRO alone (signup).
triggers:
  - "onboarding"
  - "user activation"
  - "aha moment"
  - "time to value"
  - "first session"
  - "onboarding checklist"
  - "empty state"
  - "guided tour"
  - "post-signup experience"
  - "activation rate"
  - "onboarding flow"
  - "kích hoạt người dùng"
  - "onboarding sản phẩm"
category: content
scenario: marketing
featured: 86
tags:
  - marketing
  - activation
  - onboarding
  - product
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: onboarding-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design onboarding/activation: aha moment, first 30s, checklist, empty states,
    stalled-user re-engage. Read product-marketing.md. Write onboarding-plan.md +
    onboarding-plan.html. One goal per session; no fake activation rates.
  example_prompt_i18n:
    zh-CN: "设计 onboarding/激活：aha、前30秒、清单、空状态、停滞用户。读 product-marketing.md；输出 onboarding-plan.md + HTML。每会话一目标；禁止编造激活率。"
    vi: "Thiết kế onboarding: aha moment, 30s đầu, checklist, empty state, re-engage. Đọc product-marketing.md; xuất onboarding-plan.md + HTML. Không bịa activation rate."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/onboarding"
---

# Onboarding CRO (Artifact OS)

You design **activation experiences** so new users reach value fast.

**Job:** define aha/activation · first-session flow · checklist · empty states ·
tours · multi-channel (in-app + email) · stalled recovery · metrics.  
**Not your job:** signup form fields alone → `signup`; full nurture drip → `emails`;
cancel flows → `churn-prevention`; paywall timing → `paywalls`.

Adapted from [marketingskills/onboarding](https://github.com/coreyhaines31/marketingskills/tree/main/skills/onboarding) (MIT).

---

## Mandatory references

1. `references/experiments.md` — test ideas for activation  
2. Context: `product-marketing.md` · `DESIGN.md` §8 · `emails` for sequence handoff · `analytics` for events  

---

## Principles

1. **Time-to-value** — shrink path to first win  
2. **One goal per session** — no 12-step tours on day 1  
3. **Do, don’t only show** — interactive > wall of tooltips  
4. **Progress motivates** — checklists, completion states  

---

## Activation

Find the **aha moment** (what retained users do that churned don’t).  

Metrics: activation rate · time-to-activate · step completion · day-1/7 retention.  
Never invent baselines — use user data or **Assumed**.

---

## Flow design

### First 30 seconds
Confirm success · immediate next action · optional skip · no feature dump.

### Checklist pattern
3–7 high-value tasks · progress % · celebrate completion · optional steps labeled.

### Empty states
Explain why empty · one primary CTA · sample data / template when helpful.

### Tours / tooltips
Contextual · dismissible · never block core task · skippable.

### Multi-channel
In-app is primary; email reinforces same job (`emails`) — don’t triple-spam the same tip.

### Stalled users
Detect: no aha in N days, incomplete checklist. Re-engage with help, not guilt.

---

## Output files

1. **`onboarding-plan.md`**  
2. **`onboarding-plan.html`**  

```
## Brief · Activation definition · Flow (steps) · Empty states · Email handoff
## Stalled recovery · Metrics · Experiments · Handoff
```

---

## Hard rules

No dark-pattern forced tours · no fake social proof · coordinate with product UX ·
tone from DESIGN.md §8.

## QA

Aha defined · steps with one job each · metrics · both files written.

## Vertical metadata

- **Related:** `signup`, `emails`, `churn-prevention`, `analytics`, `product-marketing`, `paywalls`, `ab-testing`  
- **Upstream:** [marketingskills/onboarding](https://github.com/coreyhaines31/marketingskills/tree/main/skills/onboarding)  

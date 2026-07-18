---
name: signup
zh_name: "注册流程"
en_name: "Signup"
emoji: "✍️"
description: |
  Optimize signup and registration flows — fields, multi-step, social auth,
  trust, mobile, post-submit. Not full onboarding after signup (onboarding);
  not generic page CRO alone (cro); not paywalls (paywalls).
triggers:
  - "signup flow"
  - "registration form"
  - "sign up CRO"
  - "create account"
  - "signup friction"
  - "multi-step signup"
  - "social login"
  - "trial signup"
  - "waitlist signup"
  - "đăng ký tài khoản"
  - "form signup"
category: content
scenario: marketing
featured: 85
tags:
  - marketing
  - cro
  - signup
  - conversion
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: signup-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Audit/redesign signup flow: fields, steps, social auth, trust, errors,
    post-submit. Read product-marketing.md. Write signup-plan.md + signup-plan.html.
    Minimize required fields; no dark patterns.
  example_prompt_i18n:
    zh-CN: "审计/重设计注册流：字段、步骤、社交登录、信任、错误、提交后。读 product-marketing；输出 signup-plan.md + HTML。最少必填；禁止暗模式。"
    vi: "Audit/thiết kế lại signup: fields, steps, social auth, trust, errors, post-submit. Đọc product-marketing; xuất signup-plan.md + HTML. Ít field; không dark pattern."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/signup"
---

# Signup Flow CRO (Artifact OS)

You reduce friction from **intent → account created**.

**Job:** field audit · single vs multi-step · social auth · trust/microcopy ·
errors · mobile · post-submit · metrics · experiments.  
**Not your job:** post-signup activation → `onboarding`; full landing CRO → `cro`;
lead magnet gate → `lead-magnets` / `popups`.

Adapted from [marketingskills/signup](https://github.com/coreyhaines31/marketingskills/tree/main/skills/signup) (MIT).

---

## Principles

1. **Minimize required fields**  
2. **Show value before heavy commitment**  
3. **Reduce perceived effort** (steps, progress)  
4. **Remove uncertainty** (privacy, trial terms, no credit card if true)  

---

## Fields (quick)

| Field | Guidance |
|-------|----------|
| Email | Primary ID; validate inline |
| Password | Strength without sadism; show/hide; SSO preferred |
| Name | Optional early if not needed |
| Phone | Avoid unless product needs it |
| Company/role | Progressive or multi-step B2B only |

Social auth when audience expects it. Every extra field costs conversion.

### Single vs multi-step

Single: short B2C / simple trial. Multi: complex B2B qualify — progress bar, one
job per step, allow back.

### Trust

Privacy link · clear trial terms · no surprise card · human error messages ·
mobile thumb-friendly.

### Post-submit

Success state → hand off `onboarding` first action · verification with resend ·
no dead ends.

---

## Patterns

B2B trial · B2C app · waitlist · e-com account — pick and adapt.

---

## Output files

1. **`signup-plan.md`**  
2. **`signup-plan.html`**  

```
## Context · Audit findings · Recommended fields/steps · Microcopy · Mobile · Metrics · Tests · Handoff onboarding
```

## Hard rules

No confirm-shaming · no pre-checked marketing spam · honest trial claims ·
no invent CVR baselines.

## Vertical metadata

- **Related:** `onboarding`, `cro`, `copywriting`, `analytics`, `ab-testing`, `lead-magnets`, `product-marketing`  
- **Upstream:** [marketingskills/signup](https://github.com/coreyhaines31/marketingskills/tree/main/skills/signup)  

---
name: churn-prevention
zh_name: "防流失"
en_name: "Churn Prevention"
emoji: "🛟"
description: |
  Reduce voluntary and involuntary churn — cancel flows, exit surveys, dynamic
  save offers, health scores, dunning/payment recovery. Not win-back email
  copy alone (emails); not in-app upgrade paywalls (paywall-upgrade-cro);
  not pricing redesign alone (pricing).
triggers:
  - "churn prevention"
  - "churn-prevention"
  - "churn"
  - "cancel flow"
  - "offboarding"
  - "save offer"
  - "dunning"
  - "failed payment recovery"
  - "win-back"
  - "retention"
  - "exit survey"
  - "pause subscription"
  - "involuntary churn"
  - "people keep canceling"
  - "churn rate is too high"
  - "how do I keep users"
  - "customers are leaving"
  - "giảm churn"
  - "hủy đăng ký"
category: content
scenario: marketing
featured: 75
tags:
  - marketing
  - retention
  - churn
  - dunning
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
    entry: churn-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design a churn prevention system: cancel flow (survey → offers → confirm),
    save-offer matrix by reason, proactive health signals, and dunning recovery.
    Read product-marketing.md + DESIGN.md §8. Write churn-plan.md + churn-plan.html.
    No dark-pattern cancel walls; no fake save rates as brand fact.
  example_prompt_i18n:
    zh-CN: "设计防流失：取消流（调研→优惠→确认）、按原因的挽回优惠、健康分与 dunning。读 product-marketing.md 与 DESIGN.md §8；输出 churn-plan.md + HTML。禁止暗模式取消墙与编造挽回率。"
    vi: "Thiết kế chống churn: cancel flow, save offers theo lý do, health score, dunning. Đọc product-marketing.md + DESIGN.md §8; xuất churn-plan.md + HTML. Không dark pattern; không bịa save rate."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/churn-prevention"
---

# Churn Prevention (Artifact OS)

You design systems that reduce **voluntary** churn (customer cancels) and
**involuntary** churn (failed payments).

**Job:** cancel flow · exit survey · dynamic save offers · proactive retention ·
dunning stack · metrics.  
**Not your job:** full win-back drip copy → `emails`; upgrade paywall CRO →
`paywall-upgrade-cro` if installed; plan packaging redesign → `pricing`; event
instrumentation alone → `analytics`.

Adapted from [marketingskills/churn-prevention](https://github.com/coreyhaines31/marketingskills/tree/main/skills/churn-prevention) (MIT).

---

## Mandatory references

1. `references/cancel-flow-patterns.md` — industry/billing cancel UX patterns  
2. `references/dunning-playbook.md` — payment recovery + provider notes  
3. Context:  
   - `product-marketing.md` (ICP, value, objections)  
   - Brand `DESIGN.md` **§8** (offboarding tone)  
   - `pricing` for downgrade paths  
   - `analytics` for churn signal events  

---

## Before starting

| Slice | Notes |
|-------|--------|
| **Churn situation** | Rate · voluntary vs involuntary · subscriber count · ACV/MRR · cancel UX today |
| **Billing** | Stripe / Chargebee / Paddle… · monthly/annual · pause/downgrade? · retention tools |
| **Usage data** | Feature usage · drop-offs · past cancel reasons · activation metric |
| **Constraints** | B2B/B2C · easy-cancel regs · brand tone |

Label unknowns **Assumed**. Never invent current churn % as fact.

---

## Two churn types

| Type | Cause | Levers |
|------|-------|--------|
| **Voluntary** | Customer chooses cancel | Survey, save offers, pause, CS outreach |
| **Involuntary** | Payment fails | Pre-dunning, smart retries, dunning emails, card updater |

Involuntary is often 30–50% of churn and highly recoverable — cite as **industry ranges**, not brand KPIs.

### Modes

1. **Build cancel flow** from scratch  
2. **Optimize** existing flow with data  
3. **Dunning** setup for failed payments  

---

## Cancel flow

```
Trigger → Survey → Dynamic offer → Confirmation → Post-cancel
```

### Exit survey

Single question · 5–8 reasons · optional free text · common reasons first · no guilt trip.  

| Reason | Implication |
|--------|-------------|
| Too expensive | Discount or downgrade |
| Not using enough | Pause / onboarding help |
| Missing feature | Roadmap / workaround |
| Switching competitor | Compete honestly / feedback |
| Tech issues | Support escalate |
| Temporary / seasonal | Pause |
| Business closed | Respect · skip hard sell |
| Other | Free text |

### Offer ↔ reason (match the problem)

| Reason | Primary | Fallback |
|--------|---------|----------|
| Too expensive | 20–30% off 2–3 mo | Lower plan |
| Not using | Pause 1–3 mo | Free onboarding |
| Missing feature | Roadmap + timeline | Workaround |
| Competitor | Honest compare + modest offer | Feedback call |
| Tech issues | Support now | Credit + priority fix |
| Temporary | Pause | Temp downgrade |
| Business closed | No offer | — |

**Offer types:** discount (avoid 50%+ habit) · pause (≤3 mo, auto-reactivate notice) ·
downgrade (“right-size”) · feature unlock · personal outreach for top MRR.

### UI principles

- Always visible path to **continue canceling** (no dark patterns)  
- One primary offer + one fallback  
- Show **$ saved**, not only %  
- Mobile-friendly  
- Clear end-of-period messaging on confirm  

Patterns: `cancel-flow-patterns.md`.

---

## Proactive retention

### Risk signals (examples)

Login drop · feature stop · support spike then silence · email engagement down ·
billing page visits · seats removed · data export · low NPS  

### Health score sketch (0–100)

Login ×0.30 + feature use ×0.25 + support sentiment ×0.15 + billing health ×0.15 +
engagement ×0.15  

| Band | Action |
|------|--------|
| 80–100 | Healthy / expand |
| 60–79 | Check-in |
| 40–59 | Intervention campaign |
| 0–39 | Personal outreach |

### Interventions

Usage drop emails · limit approaches (hand off paywall skill) · 14-day no-login re-engage ·
NPS detractor follow-up · unresolved tickets · annual renewal value recap  

---

## Involuntary: dunning stack

```
Pre-dunning → Smart retry → Dunning emails → Grace period → Hard cancel
```

**Pre-dunning:** card expiry 30/15/7 · backup method · network card updater · pre-bill annual  

**Retries:** soft vs hard vs auth-required · ~24h → 3d → 5d → 7d then hard cancel path  

**Emails (sketch):** Day 0 friendly · Day 3 reminder · Day 7 urgency · Day 10 final ·
update-card deep link · no blame · support contact  

Full: `dunning-playbook.md`. Recovery benchmarks in refs are **industry ranges only**.

---

## Metrics (spec)

| Metric | Notes |
|--------|--------|
| Monthly / revenue churn | User-supplied baselines |
| Cancel flow save rate | Target ranges industry-only if no data |
| Offer accept · pause reactivate · dunning recovery | Track by segment |
| Time from first risk signal → cancel | Trend |

Cohorts: channel · plan · tenure · reason · offer type.  
A/B one variable at a time → hand off experiment design to `ab-testing`.

---

## Common mistakes

No flow · hard-to-find cancel (legal/brand risk) · one offer for all · deep discount
addiction · ignore involuntary · guilt copy · no LTV of “saves” · pause too long ·
no reactivation path  

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| Win-back / lifecycle email copy | `emails` |
| Plan structure / discounts | `pricing` |
| Churn signal events | `analytics` |
| Upgrade / trial paywall | `paywall-upgrade-cro` if installed |
| Positioning / value for save copy | `product-marketing` |
| CS playbooks for high-touch | `sales-enablement` (light) |

---

## Output files (always both)

1. **`churn-plan.md`**  
2. **`churn-plan.html`**  

### churn-plan.md shape

```
## Brief
Motion · churn types · billing stack · constraints · tone

## Cancel flow
Steps · survey options · offer matrix · confirmation copy · post-cancel

## Proactive retention
Signals · health score · intervention table

## Dunning
Pre-dunning · retries · email outline · grace policy

## Metrics & tests
What to measure · first A/B ideas

## Implementation order
Week 1–N

## Handoff
emails · analytics · pricing · legal/compliance review for cancel ease
```

HTML: flow diagram · offer matrix · dunning timeline · checklist.

Sample microcopy must pass DESIGN.md §8 when brand linked.

---

## Hard rules

1. **No dark patterns** — cancel must remain findable and completable.  
2. **No fake churn/save/recovery rates** as the brand’s history.  
3. Match **offer to reason** — no blanket 50% for everyone.  
4. Respect **business closed** / hardship — skip hard sell.  
5. Legal: note easy-cancel regulations where relevant; not legal advice.  
6. Tool names (Churnkey, Stripe…) are options, not required stack.  

---

## QA

- [ ] Voluntary + involuntary covered (or scoped)  
- [ ] Survey + reason→offer map  
- [ ] Cancel path still clear  
- [ ] Dunning outline if payments relevant  
- [ ] Metrics + implementation order  
- [ ] `churn-plan.md` + `churn-plan.html` written  

**FAIL:** “send a discount email” with no flow or reason matching.

---

## Vertical metadata

- **Related:** `emails`, `pricing`, `analytics`, `ab-testing`, `product-marketing`, `paywall-upgrade-cro`, `cro`, `revops`  
- **Upstream:** [marketingskills/churn-prevention](https://github.com/coreyhaines31/marketingskills/tree/main/skills/churn-prevention)  

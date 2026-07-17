---
name: analytics
zh_name: "分析与埋点"
en_name: "Analytics"
emoji: "📊"
description: |
  Design and audit analytics tracking — tracking plans, events, UTMs, GA4/GTM,
  conversion measurement, debugging, privacy. Not CRO diagnosis (cro), not
  experiment design alone (ab-test), not pipeline CRM metrics alone (revops).
triggers:
  - "analytics"
  - "set up tracking"
  - "GA4"
  - "Google Analytics"
  - "conversion tracking"
  - "event tracking"
  - "UTM"
  - "UTM parameters"
  - "tag manager"
  - "GTM"
  - "analytics implementation"
  - "tracking plan"
  - "how do I measure this"
  - "track conversions"
  - "attribution"
  - "Mixpanel"
  - "Segment"
  - "are my events firing"
  - "analytics isn't working"
  - "theo dõi chuyển đổi"
  - "kế hoạch tracking"
category: content
scenario: marketing
featured: 82
tags:
  - marketing
  - analytics
  - ga4
  - gtm
  - tracking
  - measurement
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: tracking-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Create a tracking plan for this product/site: key decisions, events
    (object_action), properties, UTMs, GA4/GTM notes, validation checklist.
    Read product-marketing.md for goals/conversions. Write tracking-plan.md +
    tracking-plan.html. No PII in properties; no fake historical metrics.
  example_prompt_i18n:
    zh-CN: "制定 tracking plan：决策问题、事件命名、属性、UTM、GA4/GTM 与校验清单。读 product-marketing.md；输出 tracking-plan.md + HTML。属性禁 PII，禁止编造历史数据。"
    vi: "Lập tracking plan: quyết định cần data, events, properties, UTM, GA4/GTM, checklist validate. Đọc product-marketing.md; xuất tracking-plan.md + HTML. Không PII; không bịa metric."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/analytics"
---

# Analytics Tracking (Artifact OS)

You design **measurement systems** that answer business questions — not event
spam or vanity dashboards.

**Job:** tracking plan · naming · essential events · UTMs · GA4/GTM guidance ·
validation · privacy.  
**Not your job:** page conversion diagnosis → `cro`; experiment design → ab-test
if installed; CRM pipeline stages alone → `revops`; ad kill rules → `ads`.

Adapted from [marketingskills/analytics](https://github.com/coreyhaines31/marketingskills/tree/main/skills/analytics) (MIT).

---

## Mandatory references

1. `references/event-library.md` — events by business type  
2. `references/ga4-implementation.md` — GA4 setup patterns  
3. `references/gtm-implementation.md` — GTM tags/triggers/data layer  
4. Context:  
   - `product-marketing.md` (goals, funnel, key conversions)  
   - `ads` / `revops` if attribution or offline conversions matter  

---

## Before starting

| Slice | Notes |
|-------|--------|
| **Decisions** | What will data change? Key conversions? |
| **Current state** | Tools · what’s already tracked · known gaps |
| **Stack** | Site/app · CMS · SPA · consent platform |
| **Privacy** | GDPR/CCPA/consent mode · retention |

Read product-marketing first. Work with partial inputs; label **Assumed**.

---

## Core principles

1. **Track for decisions, not data hoarding**  
2. **Start from questions** → reverse into events  
3. **Consistent naming** before implement  
4. **Data quality** > more events  

---

## Tracking plan framework

```
Event Name | Description | Properties | Trigger | Owner | Notes
```

### Event types

| Type | Examples |
|------|----------|
| Pageviews | + enhanced metadata |
| User actions | clicks, forms, feature use |
| System events | signup, purchase, subscription change |
| Custom conversions | funnel stages, goals |

Full catalogs: `references/event-library.md`.

### Naming: Object-Action

```
signup_completed
cta_hero_clicked
form_submitted
checkout_payment_completed
```

Lowercase + underscores · specific names · context in **properties** · document choices.

### Essential (marketing site)

| Event | Properties (examples) |
|-------|------------------------|
| cta_clicked | button_text, location |
| form_submitted | form_type |
| signup_completed | method, source |
| demo_requested | — |

### Essential (product)

| Event | Properties |
|-------|------------|
| onboarding_step_completed | step_number, step_name |
| feature_used | feature_name |
| purchase_completed | plan, value |
| subscription_cancelled | reason |

### Properties

Page (title, location, referrer) · User (id, type, plan — no email as property) ·
Campaign (source/medium/campaign/content/term) · Product (id, name, price).  
Consistent names · no PII · don’t re-send auto GA fields unnecessarily.

---

## GA4 & GTM (summary)

**GA4:** property + stream · gtag or GTM · enhanced measurement · custom events · mark conversions.  

```javascript
gtag('event', 'signup_completed', { method: 'email', plan: 'free' });
```

Detail: `ga4-implementation.md`.

**GTM:** Tags · Triggers · Variables · dataLayer.push events.  

```javascript
dataLayer.push({
  event: 'form_submitted',
  form_name: 'contact',
  form_location: 'footer'
});
```

Detail: `gtm-implementation.md`.

---

## UTM strategy

| Param | Role | Example |
|-------|------|---------|
| utm_source | Source | google, newsletter |
| utm_medium | Medium | cpc, email, social |
| utm_campaign | Campaign | spring_sale |
| utm_content | Variant | hero_cta |
| utm_term | Paid keywords | running+shoes |

Lowercase · consistent separators · spreadsheet registry · hand off paid naming to `ads`.

---

## Debugging & validation

| Tool | Use |
|------|-----|
| GA4 DebugView | Real-time events |
| GTM Preview | Triggers before publish |
| Tag Assistant / dataLayer inspector | Client-side |

Checklist: correct triggers · properties filled · no duplicates · desktop+mobile · conversions count · no PII.

| Issue | Check |
|-------|-------|
| Not firing | Trigger, container load |
| Wrong values | Variable path, dataLayer |
| Duplicates | Double container / double fire |

---

## Privacy

Consent before marketing tags (EU/UK/CA) · consent mode · no PII in props · retention · deletion paths · minimize collection · CMP integration notes only (not legal advice).

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| What “conversion” means | `product-marketing` |
| Use data for page fixes | `cro` |
| Paid UTM + pixels | `ads` |
| Offline conversion / CRM | `revops` |
| Experiment measurement | ab-test if installed |
| SEO traffic interpretation | `seo-audit` |
| Churn signals / cancel funnel events | `churn-prevention` |

---

## Output files (always both)

1. **`tracking-plan.md`** — implementable plan  
2. **`tracking-plan.html`** — scannable preview  

### tracking-plan.md shape

```
## Overview
Tools · last updated · goals · stack · privacy notes

## Decisions this data answers
…

## Events
| Event | Description | Properties | Trigger | Priority |

## Custom dimensions / user props
…

## Conversions
| Name | Event | Counting |

## UTM conventions
…

## Implementation notes
GA4 / GTM / code snippets (minimal, accurate)

## Validation checklist
…

## Handoff
Dev tasks · cro · ads · revops
```

HTML: decision strip · event table · conversion list · UTM legend · checklist.

---

## Hard rules

1. **No PII** (email, phone, name) in event properties.  
2. **No fake historical metrics** as brand baselines.  
3. Every recommended event must map to a **decision**.  
4. Prefer fewer high-value events over kitchen-sink tracking.  
5. Consent/privacy callouts when geo unknown → flag **Confirm with counsel/CMP**.  
6. Code samples must match described naming; don’t invent platform IDs.  

---

## QA

- [ ] Business questions listed  
- [ ] Event table with naming convention  
- [ ] Properties + triggers  
- [ ] Conversions marked  
- [ ] UTM conventions  
- [ ] Validation + privacy notes  
- [ ] `tracking-plan.md` + `tracking-plan.html` written  

**FAIL:** dump of 80 events with no decisions or naming system.

---

## Vertical metadata

- **Related:** `product-marketing`, `cro`, `ads`, `revops`, `churn-prevention`, `seo-audit`, `launch`, `emails`  
- **Upstream:** [marketingskills/analytics](https://github.com/coreyhaines31/marketingskills/tree/main/skills/analytics)  

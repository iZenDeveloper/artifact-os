---
name: emails
zh_name: "邮件序列"
en_name: "Email Sequences"
emoji: "✉️"
description: |
  Design lifecycle email sequences — welcome, nurture, onboarding, re-engagement,
  post-purchase. One job per email, value before ask, full subject/preview/body/CTA.
  For cold B2B outreach see cold-email (if installed). Not for one-off newsletters only
  unless part of a flow.
triggers:
  - "email sequence"
  - "drip campaign"
  - "nurture sequence"
  - "welcome sequence"
  - "onboarding emails"
  - "re-engagement emails"
  - "lifecycle emails"
  - "email automation"
  - "welcome series"
  - "email funnel"
  - "chuỗi email"
  - "email nurture"
  - "welcome email"
category: content
scenario: marketing
featured: 82
tags:
  - marketing
  - email
  - lifecycle
  - nurture
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: email-sequence.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Design an email sequence for [welcome / nurture / re-engagement / post-purchase].
    Read product-marketing.md + Brand DESIGN.md §8. Produce email-sequence.md with
    full copy per email (subject, preview, body, CTA) and email-sequence.html for
    preview. One job per email. No fake proof.
  example_prompt_i18n:
    zh-CN: "设计邮件序列（欢迎/培育/召回/购后）：读 product-marketing.md 与 DESIGN.md §8；输出 email-sequence.md（每封完整文案）+ HTML 预览。每封一目标。"
    vi: "Thiết kế chuỗi email (welcome/nurture/re-engage/post-purchase): đọc product-marketing.md + DESIGN.md §8; xuất email-sequence.md + HTML. Mỗi email một job."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/emails"
---

# Email Sequences (Artifact OS)

You design **lifecycle / automated email flows** that nurture and convert.

**Job:** sequence strategy + full email copy (subject → CTA).  
**Not your job:** cold outbound sequences → `cold-email` if installed;  
landing pages emails link to → `copywriting` / `cro`; multi-platform social → `content-repurposer`.

Adapted from [marketingskills/emails](https://github.com/coreyhaines31/marketingskills/tree/main/skills/emails) (MIT).

---

## Mandatory references

1. `references/sequence-templates.md` — skeleton flows by type  
2. `references/email-types.md` — catalog of lifecycle email types  
3. `references/copy-guidelines.md` — tone, length, personalization, tests  
4. Context:  
   - `product-marketing.md` (ICP, offer, objections, goals)  
   - Brand `DESIGN.md` **§8 Voice & Tone**  
   - `../content-repurposer/references/strategy-inputs.md` (objective / funnel)  
   - `../hook-engine` patterns for subject lines when needed  

---

## Before writing

| Field | Required |
|-------|----------|
| **Sequence type** | welcome · lead nurture · re-engagement · post-purchase · onboarding · educational · sales · event |
| **Trigger** | What starts the flow |
| **Primary goal** | Activate · book demo · buy · re-open · educate… |
| **Audience stage** | What they know / just did |
| **Offer** | What the sequence sells or activates |
| **Language** | vi / en / zh |

Read product-marketing + DESIGN.md §8 first; only ask for gaps.

---

## Principles

1. **One email, one job** — one primary CTA  
2. **Value before ask** — earn the sell  
3. **Relevance over volume** — fewer better emails  
4. **Clear path forward** — every email moves the relationship  

### Length guidelines (defaults)

| Type | Emails | Cadence (default) |
|------|--------|-------------------|
| Welcome | 3–7 | Immediate, then 1–2 days |
| Lead nurture | 5–10 | 2–4 days |
| Onboarding (product) | 5–10 | Support aha moment; don’t duplicate in-app spam |
| Re-engagement | 3–5 | 2 weeks span; inactivity trigger |

B2B: avoid weekends unless data says otherwise. Label **Assumed** timing if user gave none.

### Subject lines
- Clear > clever; specific > vague  
- ~40–60 characters when possible  
- Patterns: question · how-to · number · direct · story tease  
- Always provide **2–3 subject alternatives** per email  

### Preview text
- Extends subject; don’t repeat it  
- ~90–140 characters  

---

## Sequence type map (summary)

| Type | Goal | Skeleton |
|------|------|----------|
| **Welcome** | Activate + convert | Deliver promise → quick win → story → proof → objection → convert |
| **Lead nurture** | Trust → offer | Magnet → expand → problem → framework → case → differentiate → offer |
| **Re-engagement** | Win back or clean | Check-in → value/new → incentive → last chance |
| **Onboarding** | Aha + upgrade | First step → help → feature → story → check-in → advanced → expand |
| **Post-purchase** | Retain / expand | Thanks → setup → success tip → upsell / referral |

Full templates: `references/sequence-templates.md`.  
Type catalog: `references/email-types.md`.

---

## Per-email body structure

1. **Hook** — first line  
2. **Context** — why this email now  
3. **Value** — useful content  
4. **CTA** — one primary (button text + destination)  
5. **Sign-off** — human  

Copy detail: `references/copy-guidelines.md`.

Length defaults:
- Transactional: 50–125 words  
- Educational: 150–300  
- Story: 300–500  

---

## Output files (always both)

1. **`email-sequence.md`** — full production doc  
2. **`email-sequence.html`** — scannable preview (sequence overview + each email card)

### email-sequence.md shape

```
## Sequence overview
Name · Trigger · Goal · Length · Timing · Exit conditions

## Audience & offer
(from product-marketing / assumed)

## Emails
### Email 1: …
Send · Subject (+ alts) · Preview · Body · CTA · Conditions

### Email 2: …
…

## Metrics plan
Opens / CTR / conversion / unsubscribe — what to watch (no fake benchmarks as brand fact)

## Handoff
- Landing pages for CTAs → copywriting / cro
- Hooks / ads → hook-engine / ad-variants-generator
- Lead magnet design → lead-magnets (if installed)
- Cold outbound → cold-email (if installed)
- MQL recycle / routing triggers → revops (if installed)
- Cancel / dunning / win-back system design → churn-prevention
- Lead magnet → nurture setup → lead-magnets + this skill
- Post-signup activation emails → onboarding (coordinate)
```

HTML: overview table + each email as a readable “message” block (subject, preview, body, CTA).  
Apply brand colors only if DESIGN.md palette is available.

---

## Hard rules

1. **DESIGN.md §8** constrains tone and banned phrases.  
2. **No fake proof** (metrics, logos, quotes).  
3. **One primary CTA** per email.  
4. Coordinate onboarding email with product UX — don’t spam the same tip thrice.  
5. Unsubscribe / preference honesty — never recommend dark patterns.  
6. Tool integrations (Mailchimp, Resend…) are optional notes only — this skill ships **copy + flow**, not ESP setup scripts.  

---

## QA

- [ ] Trigger + goal + exit stated  
- [ ] Every email has subject, preview, body, CTA  
- [ ] Subject alternatives for each email  
- [ ] Timing/delays specified  
- [ ] Voice matches brand or labeled Assumed  
- [ ] `email-sequence.md` + `email-sequence.html` written  

**FAIL:** vague “send a welcome email” without full copy blocks.

---

## Vertical metadata

- **Related:** `product-marketing`, `cold-email`, `revops`, `churn-prevention`, `lead-magnets`, `launch`, `copywriting`, `cro`, `hook-engine`, `content-repurposer`, `marketing-psychology`  
- **Upstream:** [marketingskills/emails](https://github.com/coreyhaines31/marketingskills/tree/main/skills/emails)  

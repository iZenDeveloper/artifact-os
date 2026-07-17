---
name: cold-email
zh_name: "冷邮件外联"
en_name: "Cold Email"
emoji: "📬"
description: |
  Write B2B cold emails and multi-touch follow-up sequences that get replies —
  subject lines, personalization, frameworks, low-friction CTAs. Outbound /
  prospecting / SDR only. For lifecycle welcome-nurture-onboarding see emails.
triggers:
  - "cold email"
  - "cold outreach"
  - "prospecting email"
  - "outbound email"
  - "SDR email"
  - "sales development"
  - "reach out to prospects"
  - "follow-up sequence"
  - "cold email sequence"
  - "nobody's replying"
  - "how do I write a cold email"
  - "email to leads"
  - "sales email"
  - "email lạnh"
  - "cold outreach B2B"
category: content
scenario: marketing
featured: 79
tags:
  - marketing
  - email
  - outbound
  - sdr
  - b2b
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: cold-outreach.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Write a cold outreach sequence for [ICP / persona]. Read product-marketing.md
    + Brand DESIGN.md §8. Produce cold-email-sequence.md (full email 1 + follow-ups
    with subjects/body/CTA) and cold-outreach.html preview. Peer voice, one low-
    friction ask, no fake proof or spammy subjects.
  example_prompt_i18n:
    zh-CN: "写 B2B 冷邮件序列：读 product-marketing.md 与 DESIGN.md §8；输出 cold-email-sequence.md（首封+跟进全文）+ cold-outreach.html。同行语气、单一低摩擦 CTA，禁止假证明与垃圾主题行。"
    vi: "Viết chuỗi cold email B2B: đọc product-marketing.md + DESIGN.md §8; xuất cold-email-sequence.md (email 1 + follow-ups) + cold-outreach.html. Giọng đồng nghiệp, một CTA dễ trả lời, không fake proof."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/cold-email"
---

# Cold Email (Artifact OS)

You write **B2B cold / outbound emails** that sound like a sharp peer — not a
sales machine or a lifecycle marketing blast.

**Job:** subject + body + CTA for first touch and follow-ups; personalization
tied to the problem; reply-oriented asks.  
**Not your job:** welcome / nurture / re-engagement drips → `emails`; full
landing pages → `copywriting` / `cro`; GTM calendar → `launch`.

Adapted from [marketingskills/cold-email](https://github.com/coreyhaines31/marketingskills/tree/main/skills/cold-email) (MIT).

---

## Mandatory references

1. `references/personalization.md` — 4-level personalization + research signals  
2. `references/frameworks.md` — copy structures with examples  
3. `references/subject-lines.md` — short, internal-looking subjects  
4. `references/follow-up-sequences.md` — cadence, angle rotation, breakup  
5. `references/benchmarks.md` — reply rates / mistakes (inform writing; not brand facts)  
6. Context:  
   - `product-marketing.md` (ICP, pain, proof **only if real**, offer)  
   - Brand `DESIGN.md` **§8 Voice & Tone** (when linked)  

---

## Before writing

| Field | Required |
|-------|----------|
| **Who** | Role, company type, why them |
| **Outcome** | Reply · intro · meeting · demo |
| **Value** | Problem you solve for people like them |
| **Proof** | Result / case / credibility (user-supplied only) |
| **Signals** | Funding, hiring, posts, news, stack — if any |
| **Language** | vi / en / zh |

Read product-marketing + DESIGN.md §8 first. Work with what you have; label gaps
as **Assumed** rather than blocking. Strong signal + clear value is enough.

---

## Principles

1. **Peer, not vendor** — contractions; read aloud; cut marketing-speak  
2. **Every sentence earns its place** — ruthlessly short  
3. **Personalization → problem** — if you delete the open and it still works, rewrite  
4. **Their world first** — you/your > I/we; don’t open with company pitch  
5. **One ask, low friction** — “Worth exploring?” beats “30 min next week?”  

### Voice

| Audience | Tone |
|----------|------|
| C-suite | Ultra-brief, peer, understated |
| Mid-level | Specific value, slightly more detail |
| Technical | Precise, no fluff |

**Never:** “I hope this finds you well,” “I came across your profile,” leverage,
synergy, best-in-class, pitch-deck paragraphs, fake Re:/Fwd: subjects.

---

## Structure (pick one)

- **Observation → Problem → Proof → Ask**  
- **Question → Value → Ask**  
- **Trigger → Insight → Ask**  
- **Story → Bridge → Ask**  

Full catalog: `references/frameworks.md`. Freeform is fine if it flows.

### Subject lines

- 2–4 words, lowercase, no punctuation tricks  
- Internal-looking (“reply rates,” “hiring ops,” “Q2 forecast”)  
- No product pitch, urgency, emoji, or first-name spam  
- Provide **2–3 subject alternatives** per email  

Detail: `references/subject-lines.md`.

### Follow-ups

- **3–5 total** emails; increasing gaps  
- Each adds a **new** angle / proof / resource — never “just checking in”  
- Each stands alone (they may not have read prior)  
- Honor the **breakup** as last touch  

Cadence + templates: `references/follow-up-sequences.md`.

---

## Output files (always both)

1. **`cold-email-sequence.md`** — production doc (full copy)  
2. **`cold-outreach.html`** — scannable preview (overview + each email as a message card)

Optional: `cold-email-variants.md` when user wants A/B angles for email 1 only.

### cold-email-sequence.md shape

```
## Campaign brief
ICP · Outcome · Value · Proof available · Signals · Language

## Personalization level
L1–L4 + what research was used (or Assumed)

## Sequence overview
Length · Cadence · Exit (reply / booking / breakup)

## Emails
### Email 1 — First touch
Send · Subject (+ alts) · Body · CTA · Why this framework

### Email 2 — …
…

### Email N — Breakup
…

## Metrics to watch
Opens / replies / positive reply rate — cite benchmarks as industry ranges only
(see references/benchmarks.md); never invent brand performance.

## Handoff
- Lifecycle post-reply nurture → emails
- Landing / calendar page for CTA → copywriting / cro
- Positioning refresh → product-marketing
- Launch moment outbound → launch (plan) + this skill (copy)
```

HTML: brief strip + cadence timeline + each email card (subject, body, CTA).  
Brand colors only if DESIGN.md palette is available.

---

## Hard rules

1. **DESIGN.md §8** constrains tone when brand is linked.  
2. **No fake proof** (metrics, logos, customer names) unless user-supplied.  
3. **One primary CTA** per email; low-friction default.  
4. **Plain text mindset** — no HTML gimmicks, images, or multi-link spam in copy.  
5. No fake Re:/Fwd:, no identical {{FirstName}}-only templates as the whole personalization.  
6. This skill ships **copy + sequence**, not ESP / domain warm-up / deliverability setup.  
7. Distinguish clearly from `emails` (lifecycle) — never mix welcome drip into cold.  

---

## QA

- [ ] Sounds human when read aloud  
- [ ] Personalization connected to the problem  
- [ ] One clear low-friction ask  
- [ ] Subject alternatives + boring/internal subjects  
- [ ] Follow-ups add new value (no “checking in”)  
- [ ] Voice matches brand or labeled Assumed  
- [ ] `cold-email-sequence.md` + `cold-outreach.html` written  

**FAIL:** long pitch dump, feature laundry list, or lifecycle “welcome series” mislabeled as cold.

---

## Vertical metadata

- **Related:** `product-marketing`, `sales-enablement`, `emails`, `copywriting`, `launch`, `cro`, `hook-engine`, `marketing-psychology`  
- **Upstream:** [marketingskills/cold-email](https://github.com/coreyhaines31/marketingskills/tree/main/skills/cold-email)  

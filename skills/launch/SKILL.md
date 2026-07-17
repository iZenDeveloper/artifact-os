---
name: launch
zh_name: "发布策略"
en_name: "Launch"
emoji: "🚀"
description: |
  Plan product launches, feature announcements, and GTM moments — ORB channels
  (Owned / Rented / Borrowed), five-phase launch (internal → full), Product Hunt
  prep, checklists, and post-launch momentum. Use when shipping something public
  or asking "how do we launch this."
triggers:
  - "launch"
  - "product launch"
  - "feature release"
  - "go-to-market"
  - "GTM"
  - "Product Hunt"
  - "beta launch"
  - "early access"
  - "waitlist"
  - "announcement"
  - "we're about to ship"
  - "launch checklist"
  - "ra mắt sản phẩm"
  - "kế hoạch launch"
category: content
scenario: marketing
featured: 81
tags:
  - marketing
  - launch
  - gtm
  - product-hunt
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: launch-plan.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Build a launch plan for [product/feature]. Read product-marketing.md + Brand
    DESIGN.md §8. Cover phase (internal→full), ORB channel map, assets checklist,
    email/social handoffs, optional Product Hunt prep. Write launch-plan.md +
    launch-plan.html. No fake waitlist sizes or PH rankings.
  example_prompt_i18n:
    zh-CN: "为产品/功能制定发布计划：读 product-marketing.md 与 DESIGN.md §8；覆盖五阶段、ORB 渠道、素材清单、邮件/社媒交接；输出 launch-plan.md + HTML。"
    vi: "Lập launch plan: đọc product-marketing.md + DESIGN.md §8; 5 phase + ORB channels + checklist assets + handoff email/social; xuất launch-plan.md + HTML."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/launch"
---

# Launch Strategy (Artifact OS)

You plan **SaaS / product / feature launches** that build momentum and convert attention into users.

**Job:** phased plan + channel map + asset checklist + handoffs to content skills.  
**Not your job:** write the full multi-platform content pack alone (hand off);  
cold outbound only; full CRO redesign of every page.

Adapted from [marketingskills/launch](https://github.com/coreyhaines31/marketingskills/tree/main/skills/launch) (MIT).

---

## Before starting

**Read first:**

1. `product-marketing.md` — ICP, offer, positioning, goals  
2. Brand `DESIGN.md` **§8** — voice for all public copy  
3. What is shipping (new product · major feature · medium update · minor)  

Gather only gaps:

| Field | Notes |
|-------|--------|
| What | Product / feature / update scope |
| Audience size | Email list, community, social — real numbers only |
| Timeline | Target dates / constraints |
| Owned channels | Email, blog, site, community |
| Prior launches | What worked / failed |
| PH? | Product Hunt planned? Y/N |

---

## Core philosophy

- Best teams **launch repeatedly** — every feature is a moment  
- Launch ≠ one day — phases + follow-through  
- **Everything feeds Owned** (email, site, product) — Rented/Borrowed only to capture into Owned  

---

## ORB channel framework

| Type | Control | Examples | Rule |
|------|---------|----------|------|
| **Owned** | You control access | Email, blog, community, website, product | Primary home for demand |
| **Rented** | Platform algorithms | X/LinkedIn/IG, YouTube, Reddit, app stores | 1–2 platforms; funnel to Owned |
| **Borrowed** | Someone else’s audience | Guest posts, podcasts, collabs, influencers, speaking | Proactive win-win pitches |

Start with **1–2 Owned** that fit the audience, then add Rented/Borrowed.

---

## Five-phase launch

| Phase | Goal | Key moves |
|-------|------|-----------|
| **1 Internal** | Friendly validation | 1:1 testers, fix blockers, demo-ready |
| **2 Alpha** | External + waitlist | Landing + early access form; invite individually |
| **3 Beta** | Buzz + broader feedback | Teasers, influencers/friends, beta framing |
| **4 Early access** | Scale controlled | Screenshots/GIFs/demos; throttle or “early access” cohort |
| **5 Full** | GA + convert | Self-serve, charge, full channel blast |

**Scale the marketing** by update size:

| Size | Marketing intensity |
|------|---------------------|
| Major | Full multi-channel campaign |
| Medium | Segmented email + in-app + one social |
| Minor | Changelog only |

---

## Product Hunt (optional)

**Pros:** early-adopter exposure, credibility, links.  
**Cons:** competitive, spikey traffic, needs prep.

**Before:** relationships, listing (tagline/visuals/demo), community value first.  
**Day:** all-day engagement, reply to every comment, capture to Owned.  
**After:** follow-ups, convert traffic to email, post-launch content.

Never invent PH rankings or “guaranteed PotD.”

---

## Post-launch momentum

- Onboarding / activation emails → `emails`  
- Roundup email for people who missed it  
- Comparison pages (if competitive)  
- Site sections updated for the new feature  
- Interactive demo if useful  
- Plan the **next** announceable moment  

---

## Artifact OS content handoffs

| Need | Skill |
|------|--------|
| Positioning / ICP | `product-marketing` |
| Landing conversion | `cro` + `copywriting` |
| Launch / onboarding email | `emails` |
| Outbound prospecting email | `cold-email` |
| Sales deck / demo kit for launch | `sales-enablement` |
| Lead routing / MQL for launch traffic | `revops` |
| Multi-platform social pack | `content-repurposer` / `social-content-factory` |
| Hooks for teasers | `hook-engine` |
| Paid amplification | `ad-variants-generator` / `ads` |
| SEO of launch article | `seo-audit` / `ai-seo` |

---

## Output files (always both)

1. **`launch-plan.md`**  
2. **`launch-plan.html`**

### Required structure

```
## Brief
What · Phase now · Timeline · Audience assets (real or Assumed)

## Narrative
One-liner + why launch now (from product-marketing)

## ORB map
Owned / Rented / Borrowed — specific channels + job of each

## Phase plan
Current phase + next steps (table)

## Channel calendar (if full/early launch)
Day -14 … Day 0 … Day +14 — action · owner · asset

## Asset checklist
Landing · waitlist · screenshots · demo · blog · social · email · in-app · PH (if any)

## Pre / Day / Post checklists
(toggles with status)

## Content production queue
→ which Artifact skills to run next (with one-line seed prompts)

## Risks & measurement
What to watch (signups, activation) — no fake benchmarks as brand facts
```

HTML: cover + phase timeline + ORB cards + checklist + production queue.

Voice on all sample copy must pass DESIGN.md §8 when brand linked.

---

## Hard rules

1. **No fake list sizes, PH ranks, or influencer guarantees.**  
2. Prefer **phased** plan over “post everywhere tomorrow.”  
3. Every Rented/Borrowed tactic must name the **Owned capture** path.  
4. Minor updates must not get full-campaign spam.  
5. Coordinate email with `emails` skill — this plan can outline subjects; full sequence may hand off.  

---

## QA

- [ ] What + phase + timeline clear  
- [ ] ORB map with Owned capture  
- [ ] Checklists pre / day / post  
- [ ] Asset list concrete  
- [ ] Handoff skills named  
- [ ] `launch-plan.md` + `launch-plan.html` written  

**FAIL:** generic “post on social and Product Hunt” with no phase or Owned path.

---

## Vertical metadata

- **Related:** `product-marketing`, `emails`, `cold-email`, `sales-enablement`, `revops`, `copywriting`, `cro`, `hook-engine`, `content-repurposer`, `social-content-factory`, `ad-variants-generator`  
- **Upstream:** [marketingskills/launch](https://github.com/coreyhaines31/marketingskills/tree/main/skills/launch)  

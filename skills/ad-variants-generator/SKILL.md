---
name: ad-variants-generator
zh_name: "广告文案变体"
en_name: "Ad Variants Generator"
emoji: "🧪"
description: |
  Paid-social / search ad creative matrix under Content Pro v2.2: strategy inputs,
  paradox hooks, angle matrix, ready-to-paste headlines/primary text/CTAs, compliance flags.
triggers:
  - "ad variants"
  - "ad copy variants"
  - "A/B ad creative"
  - "biến thể quảng cáo"
  - "ad matrix"
  - "paid creative variants"
category: content
scenario: marketing
featured: 78
tags: ["ads", "variants", "marketing", "vertical-os", "content-pro", "strategy", "ready-to-post"]
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: index.html
    reload: debounce-100
  design_system:
    requires: true
  example_prompt: |
    Generate a Content Pro v2.2 ad variant matrix (10+ rows) for this offer.
    Strategy: objective/funnel/persona. Group by angle. Ready-to-paste headlines + primary text + CTA.
    Flat hooks fail. No fake stats. Label compliance risks.
  example_prompt_i18n:
    zh-CN: "广告变体矩阵 v2.2：策略块+角度分组；可直接粘贴标题/主文/CTA；禁止假数据；标注合规风险。"
    vi: "Ma trận ad variants v2.2: strategy + góc; headline/primary/CTA copy-paste; không fake stat; gắn cờ compliance."
---

# Ad Variants Generator — Content Pro **v2.2**

Produce a **structured matrix of ad variants** for testing — not a single “best” ad.

**Campaign structure / budgets / targeting / kill rules** → `ads`.  
**Hooks-only lab** (organic + ads headlines) → `hook-engine`.  
**Organic batch / pack** → `social-content-factory` / `content-repurposer`.

---

## Mandatory references

1. `../content-repurposer/references/content-pro-standards.md` — flat-hook ban, stakes  
2. `../content-repurposer/references/strategy-inputs.md` — objective / funnel / persona / offer  
3. `../content-repurposer/references/marketing/frameworks.md`  
4. `../content-repurposer/references/marketing/psychology.md` — honest levers only  
5. `../content-repurposer/references/marketing/cro-basics.md` — one primary CTA  
6. `../content-repurposer/references/marketing/platforms-vn.md` — when market is VN  
7. Optional: `../hook-engine/references/hook-patterns.md` · `hook-scoring.md`

---

## Inputs

| Field | Notes |
|-------|--------|
| **offer** | Required — product + deliverable / ask |
| **platform** | Meta · TikTok · LinkedIn · Google (or mix) |
| **objective / funnel / persona** | Strategy block; infer if missing |
| **proof** | User-supplied only; never invent % |
| **constraints** | Claims ban, vertical restrictions, character caps |
| **volume** | Default 10–12 variant rows (angle × headlines) |

---

## Hard rules

1. Brand DESIGN.md **§8 Voice & Tone** (Personal Bold ≠ Professional Clean) — see `../content-repurposer/references/brand-voice.md`  
2. **Hook first:** paradox / cost / almost-loss / shock — bare facts fail; still pass brand ban list  
3. CTA = **specific + offer** (not “Learn more” alone)  
4. No fake statistics / social proof  
5. Label speculative claims for human review  
6. Headline length realistic per platform  
7. One **primary angle family** per row; tag framework id  
8. Strategy block present on output  
9. **Ready-to-paste** columns: headline · primary text · CTA · angle · notes  
10. Calibrated quality intent: ship rows that would score ≥ **8.7** hook; flagship rows ≥ **9.0**

---

## Workflow

### Step 0 — Strategy slice

```
Objective: …
Funnel: …
Persona: …
Offer / ask: …
Platform(s): …
Proof available: … (none if empty — do not invent)
Constraints: …
```

### Step 1 — Angle set (4–6)

pain · outcome · social_proof (only if real) · objection · urgency (only if real) · identity · paradox · almost_loss

### Step 2 — Matrix

For each angle: 2–3 headlines + 1–2 primary texts + 1 CTA.  
Weak→strong for the hero headline per angle.

### Step 3 — HTML (`index.html`)

1. Cover + Content Pro **v2.2** + scores  
2. Strategy slice  
3. Angle map  
4. **Ready-to-paste table** (copy-friendly)  
5. Compliance / risk flags  
6. Top 3 recommended tests (why)  
7. Handoff: organic pack → `content-repurposer`; more hooks → `hook-engine`

---

## QA

- [ ] Strategy slice present  
- [ ] Flat-hook ban on all ship headlines  
- [ ] CTA has offer  
- [ ] No invented metrics  
- [ ] Compliance risks labeled  
- [ ] Ready-to-paste complete  
- [ ] Platform length OK  

---

## Vertical metadata

- **Vertical:** marketing  
- **Standard:** Content Pro **v2.2** (strategy + shippable matrix)  
- **Related:** `ads` (paid strategy/ops first), `hook-engine`, `content-repurposer`, `social-content-factory`, `ad-creative`  
- **Knowledge:** `../content-repurposer/references/marketing/`  

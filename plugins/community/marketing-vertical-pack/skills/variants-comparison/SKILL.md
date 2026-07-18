---
name: variants-comparison
zh_name: "变体对比板"
en_name: "Variants Comparison"
emoji: "⚖️"
description: |
  Side-by-side comparison board for marketer A/B decisions — hooks, captions,
  ad rows, CTAs, or subject lines. Pick winners with explicit criteria (not
  vibes). Not full experiment design alone (ab-testing); not full ad matrix
  alone (ad-variants-generator); not full multi-platform pack (content-repurposer).
triggers:
  - "variants comparison"
  - "variant comparison"
  - "compare variants"
  - "A/B comparison"
  - "side by side variants"
  - "which hook is better"
  - "compare headlines"
  - "compare ad copy"
  - "pick a winner"
  - "variant board"
  - "comparison board"
  - "so sánh biến thể"
  - "so sánh hook"
  - "chọn bản nào"
  - "bảng so sánh A/B"
category: content
scenario: marketing
featured: 82
tags:
  - marketing
  - variants
  - ab-test
  - comparison
  - hooks
  - ads
  - vertical-os
  - content-pro
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
    requires: false
  example_prompt: |
    Build a Variants Comparison board for these candidates (or generate 2–4
    from this brief). Strategy: objective/funnel/persona. Score each on
    hook / persona fit / funnel fit / brand voice / risk. Recommend a ship
    pick + a test pick. Write comparison.md + index.html (side-by-side cards).
  example_prompt_i18n:
    zh-CN: "变体对比板：策略块；并排卡片；钩子/人群/漏斗/品牌/风险打分；推荐上线版+测试版；输出 comparison.md + index.html。"
    vi: "Bảng so sánh variants: strategy; thẻ cạnh nhau; chấm hook/persona/funnel/brand/risk; recommend ship + test; xuất comparison.md + index.html."
---

# Variants Comparison — Artifact OS

You build a **decision board** so marketers can choose between creative
variants without scrolling a giant matrix or trusting gut feel alone.

**Job:** side-by-side cards · scored criteria · ship vs test pick · risks.  
**Not your job:** full experiment sample size / ICE program → `ab-testing`;  
full paid matrix (10+ rows) → `ad-variants-generator`; full multi-platform pack
→ `content-repurposer` / `social-content-factory`; hooks-only generation →
`hook-engine` then come back here to compare.

---

## Mandatory references

1. `references/comparison-board.md` — board structure, criteria, embed rules  
2. `assets/comparison-board-template.html` — visual layout reference  
3. Shared craft (as needed):  
   - `../content-repurposer/references/content-pro-standards.md` — flat-hook ban  
   - `../content-repurposer/references/strategy-inputs.md`  
   - `../content-repurposer/references/brand-voice.md`  
   - `../content-repurposer/references/marketing/psychology.md`  
   - `../hook-engine/references/hook-scoring.md` (when comparing hooks)

---

## Inputs

| Field | Notes |
|-------|--------|
| **candidates** | 2–4 variants (paste) **or** brief to generate then compare |
| **kind** | hook · caption · ad row · subject · CTA · landing hero · other |
| **objective / funnel / persona** | Strategy slice; required for fair scoring |
| **surface** | XHS · TikTok · LinkedIn · Threads · Email · Meta/TikTok ads · web |
| **brand voice** | Active DESIGN.md §8 if present |
| **constraints** | Claims ban, length caps, compliance |

Prefer **2–4** candidates. More than 4 → rank top 4 then board them.

---

## Hard rules

1. **Strategy first** — score against objective/funnel/persona, not “sounds cool.”  
2. **Same variable family** — compare like with like (hook vs hook, not hook vs full script).  
3. **Flat-hook ban** on any ship recommendation (Content Pro).  
4. **No fake stats / social proof** — label Assumed.  
5. **Explicit criteria** with 1–10 scores + one-line rationale each.  
6. **Two picks:** **Ship** (default paste) and **Test** (Variant B for live A/B) — can be same if only one is safe.  
7. **Risk flags** — compliance, brand voice ban-list, clickbait without payoff.  
8. Output always **`comparison.md` + `index.html`**.

---

## Scoring criteria (default)

| Criterion | What “10” looks like |
|-----------|----------------------|
| **Hook / stop-scroll** | Unexpected + cost/paradox + open loop; surface-length OK |
| **Persona fit** | Speaks their pain/desire language |
| **Funnel fit** | Awareness ≠ hard sell L1; conversion has clear offer |
| **Brand voice** | Passes §8 ban list + tone-by-context |
| **Clarity / CTA** | Next action obvious (when kind needs CTA) |
| **Risk** | Inverse: 10 = clean; flag claims/compliance |

Weight: for awareness/hooks emphasize Hook + Persona; for conversion emphasize Clarity + Funnel + Risk.

---

## Workflow

### Step 0 — Strategy slice

```
Objective: …
Funnel: …
Persona: … (Assumed?)
Surface / kind: …
Offer / ask: …
Constraints: …
```

### Step 1 — Normalize candidates

Label **A · B · C · D**.  
If generating: write 2–4 strong options first (or pull from hook-engine / ad-variants output), then board.

### Step 2 — Score matrix

For each candidate × criterion: score + short why.  
Compute **weighted total** (state weights).

### Step 3 — Decision

| Pick | Rule |
|------|------|
| **Ship** | Highest total that also clears flat-hook + risk gates |
| **Test** | Strong runner-up that isolates a learnable difference (hook angle, CTA, proof) |
| **Kill** | Fail gates — list why (do not soft-ship) |

### Step 4 — Artifacts

1. **`comparison.md`** — strategy · matrix · picks · paste blocks · handoff  
2. **`index.html`** — visual board (see template + `comparison-board.md`)

HTML **must** include:

1. Cover + badges (kind · surface · Content Pro)  
2. Strategy strip  
3. **Side-by-side cards** (equal width; Ship/Test badges)  
4. Score radar or compact score table  
5. Ready-to-paste for Ship + Test  
6. Kill list (if any)  
7. Handoff (`ab-testing` if live test; pack skills if expanding)

---

## When to embed (not only stand-alone)

Other skills may add a **Variants Comparison** section instead of a full skill run:

| Skill | When |
|-------|------|
| `hook-engine` | ≥2 surface primaries competing — board top 2–3 |
| `ad-variants-generator` | After matrix — top 3 test rows side-by-side |
| `content-repurposer` | Leads/conversion packs — Variant A vs B hook on top platforms |
| `copywriting` | Hero / headline options |

Embed section id: `#variants-comparison` (see `comparison-board.md`).

---

## Artifact OS handoffs

| Need | Skill |
|------|--------|
| Generate hooks only | `hook-engine` |
| Full paid matrix | `ad-variants-generator` |
| Multi-platform pack | `content-repurposer` |
| Live experiment design | `ab-testing` |
| Page CRO opportunities | `cro` |
| Brand context | `product-marketing` |

---

## QA

- [ ] Strategy slice present  
- [ ] 2–4 candidates, like-with-like  
- [ ] Scores + rationale per criterion  
- [ ] Ship + Test labeled (or explicit single pick)  
- [ ] Flat-hook ban on Ship  
- [ ] No invented metrics  
- [ ] Ready-to-paste for Ship (and Test if different)  
- [ ] `comparison.md` + `index.html` written  

**FAIL:** pretty cards with no scores, or “A feels better” without criteria.

---

## Vertical metadata

- **Vertical:** marketing  
- **Related:** `hook-engine`, `ad-variants-generator`, `content-repurposer`, `ab-testing`, `copywriting`, `cro`, `product-marketing`  
- **Standard:** Content Pro decision layer (pair with v2.2 packs)  

# Comparison board — structure & embed rules

Lightweight **Variants Comparison** board for Artifact OS HTML artifacts.
Use from skill `variants-comparison` or as a section inside other pack outputs.

---

## Goals

1. Marketer sees **2–4 options at once** (not a 20-row matrix).  
2. Decision is **scored**, not vibes.  
3. **Ship** and **Test** picks are paste-ready.  
4. Board works on mobile (stack cards) and desktop (side-by-side).

---

## Stand-alone page (`index.html`)

```
header (title · badges · strategy strip)
#board          → equal cards A/B/C…
#scores         → matrix or per-card scores
#picks          → Ship + Test ready-to-paste
#kills          → rejected with reasons (optional)
#handoff        → next skill
```

### Card anatomy

| Zone | Content |
|------|---------|
| Label | A / B / C + optional name (“Paradox”, “Almost-loss”) |
| Badge | Ship · Test · Kill · Contender |
| Body | Hook / headline / primary text / CTA (kind-dependent) |
| Meta | Framework id · surface · char count if relevant |
| Scores | Mini chips: Hook · Persona · Funnel · Brand · Risk |
| Note | 1–2 lines why it wins or loses |

### Layout CSS (minimal contract)

```css
.board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}
.card[data-pick="ship"] { outline: 2px solid var(--accent, #1f4b99); }
.card[data-pick="test"] { outline: 2px dashed color-mix(in srgb, var(--accent, #1f4b99) 55%, transparent); }
.card[data-pick="kill"] { opacity: 0.72; }
```

Prefer brand tokens from active DESIGN.md when present; otherwise the
template palette in `assets/comparison-board-template.html`.

---

## Embed section (other skills)

Add one section; do **not** invent a second full document:

```html
<section id="variants-comparison" data-od-section="variants-comparison">
  <h2>Variants comparison</h2>
  <!-- strategy one-liner -->
  <div class="board">…cards…</div>
  <p><strong>Ship:</strong> …</p>
  <p><strong>Test:</strong> …</p>
</section>
```

### When packs embed

| Skill | Trigger |
|-------|---------|
| content-repurposer | objective `leads` / `conversion` · top-2 platforms get Variant B hook |
| ad-variants-generator | After matrix · top 3 recommended tests as cards |
| hook-engine | User asks “which is better” or ≥3 strong surface primaries compete |

Keep embed to **≤ 4 cards**. Full matrix stays in its own table.

---

## Scoring table (markdown)

```md
| Criterion | A | B | C | Weight |
|-----------|---|---|---|--------|
| Hook | 9.2 | 8.8 | 7.5 | 0.30 |
| Persona | 9.0 | 8.5 | 8.0 | 0.25 |
| Funnel | 8.5 | 9.0 | 8.0 | 0.20 |
| Brand | 9.0 | 9.0 | 7.0 | 0.15 |
| Risk (clean↑) | 9.0 | 8.5 | 6.0 | 0.10 |
| **Total** | … | … | … | 1.00 |
```

State weights in the artifact. Change weights only when strategy demands it
(e.g. conversion → Clarity/CTA weight up).

---

## Decision rules (ship gates)

A candidate **cannot** be Ship if:

1. Flat hook (bare fact, no stakes/open loop) when kind is hook/headline  
2. Invented metrics presented as fact  
3. Fails active brand ban list  
4. Compliance risk unlabeled on regulated claims  

Test pick should differ on **one learnable axis** (angle, CTA, proof, length).

---

## Ready-to-paste blocks

```md
### Ship (Variant A)
[plain text ready for platform]

### Test (Variant B)
[plain text — same slots, one deliberate change]
```

No markdown decoration inside paste blocks when the platform is plain text.

---

## Handoff lines

- Live traffic test design → `ab-testing`  
- Expand winning hook to full pack → `content-repurposer`  
- Expand to paid matrix → `ad-variants-generator`  
- More hook candidates → `hook-engine`  

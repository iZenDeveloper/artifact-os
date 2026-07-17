# Personal Minimal

> Category: Vertical OS · Personal Brand
> Clean personal brand system for creators who want calm authority, high readability, and zero visual noise. Default choice for long-form posts, carousels, and client-safe personal content.

## 1. Visual Theme & Atmosphere

A light, breathable canvas with near-black type and a single restrained accent. Feels like a well-typeset essay or a quiet portfolio — not a startup landing page. Prefer generous whitespace, soft borders, and one clear hierarchy at a time.

**Key characteristics:**
- Light-mode native: warm off-white surface, charcoal text
- One accent only (ink blue) for CTAs and emphasis
- Large readable type; no decorative gradients or glassmorphism
- Cards with subtle hairline borders, not heavy shadows
- Works for LinkedIn carousels, Threads posts, email headers, and simple landing sections

## 2. Color Palette & Roles

### Surfaces
- **Canvas** (`#FAFAF8`): Page / slide background — warm paper white
- **Surface** (`#FFFFFF`): Cards, panels, elevated blocks
- **Surface Muted** (`#F2F1EE`): Secondary blocks, quote backgrounds
- **Border** (`#E6E4DF`): Hairline dividers and card edges

### Text
- **Primary Text** (`#1A1A1A`): Headlines and body
- **Secondary Text** (`#5C5C5C`): Supporting copy, captions
- **Tertiary Text** (`#8A8A8A`): Metadata, timestamps, watermarks

### Brand & Status
- **Accent** (`#1F4B99`): Links, primary CTA, key highlight
- **Accent Soft** (`#E8EEF8`): Soft chip / tag background
- **Success** (`#1F7A4C`)
- **Warning** (`#B36B00`)
- **Danger** (`#B42318`)

**Usage rules:**
- Favor Accent for one CTA per frame only.
- Never use pure black (`#000`) or pure neon colors.
- Keep contrast WCAG AA for body text on Canvas/Surface.

## 3. Typography Rules

### Font Family
- **Display / Headings:** `Source Serif 4`, fallbacks: `Georgia, "Times New Roman", serif`
- **Body / UI:** `Inter`, fallbacks: `system-ui, -apple-system, Segoe UI, sans-serif`
- **Mono (optional):** `JetBrains Mono`, `ui-monospace, Menlo, monospace`

### Hierarchy

| Role | Family | Size | Weight | Line height | Notes |
|------|--------|------|--------|-------------|-------|
| Display | Source Serif 4 | 40–48px | 600 | 1.15 | Cover titles |
| H1 | Source Serif 4 | 32px | 600 | 1.2 | Section titles |
| H2 | Inter | 22–24px | 600 | 1.3 | Card titles |
| Body | Inter | 16–18px | 400 | 1.55 | Default copy |
| Caption | Inter | 13–14px | 500 | 1.4 | Meta / labels |

- Prefer sentence case for body; title case only for short cover lines.
- Max ~2 type sizes visible on a single social card besides the watermark.

## 4. Spacing & Grid

- **Base unit:** 8px
- **Scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
- Card internal padding: 24–32px
- Section gap: 32–48px
- Align content to a simple single-column or 12-column loose grid; avoid dense dashboards.

## 5. Layout & Composition

- Hierarchy: hook → one idea → proof/example → soft CTA
- One primary message per card / frame
- Prefer left-aligned text; center only on cover slides
- Safe margins ≥ 48px on social export sizes (1080×1350, 1080×1440)
- Watermark / handle: bottom-right, Tertiary Text, 12–13px

## 6. Components

- **Primary button:** Accent fill, white text, 10–12px radius, no heavy shadow
- **Secondary button:** Border only (`Border`), Primary Text
- **Chip / tag:** Accent Soft background, Accent text
- **Card:** Surface bg, 1px Border, 12–16px radius
- **Quote block:** Surface Muted left border 3px Accent
- **Divider:** 1px Border, never double lines

## 7. Motion & Interaction

- Transitions 150–200ms, ease-out only
- No bounce, no parallax, no autoplay video by default
- Hover: slight opacity or border darkening — not scale transforms

## 8. Voice & Brand

- Tone: calm, clear, expert-but-human
- Prefer concrete verbs and short sentences
- Avoid hype words: “game-changing”, “revolutionary”, “crush it”
- Microcopy is literal (“Save this”, “Reply with your niche”) not clever-for-clever’s-sake
- Bilingual (VI/EN) allowed; keep the same tone in both

## 9. Anti-patterns

- No neon gradients, glass blur, or 3D mockups unless the brief demands product UI
- No more than one accent color family per artifact
- No wall of text — break into cards or bullets
- No stock photos with generic handshakes / laptops unless brand-specific
- Do not mix serif and decorative script fonts

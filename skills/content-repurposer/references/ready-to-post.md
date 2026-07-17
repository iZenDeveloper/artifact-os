# Ready-to-post package — Content Pro v2.2

Marketers need **shippable posts**, not only a pretty HTML gallery.

Every platform section in `index.html` must include a **Ready-to-post** block that can be copied without opening design tools.

## Global rules

1. **Platform-native** — never clone the same caption across XHS / TikTok / LinkedIn / Threads / Facebook / YouTube / Email.  
2. **Offer present** — keyword + deliverable on every platform.  
3. **Alt text** — accessibility + SEO; describe the visual hook, not “image1”.  
4. **Best time** — suggest 1–2 windows for the market (default VN if language is `vi`); label as guidance, not guarantee.  
5. **Character limits** — respect `platform-specs.md`.  
6. **Brand** — match active DESIGN.md tone; no off-brand hype spam.

## Per-platform ready-to-post fields

### XHS

| Field | Required |
|-------|----------|
| On-image text (per card, ≤8–12 words) | Yes |
| Caption (story + bullets + offer) | Yes |
| Hashtags (5–8) | Yes |
| Alt text (cover + optional card 2) | Yes |
| Best time to post (local) | Yes |
| First comment (optional seed) | Optional |

### TikTok (**MVP: script + visual direction — not rendered video**)

| Field | Required |
|-------|----------|
| Spoken hook (0–3s) | Yes |
| Full spoken script (15–25s) | Yes |
| On-screen text lines | Yes |
| Caption + hashtags | Yes |
| Peak visual one-liner (non-substitutable, **filmable description**) | Yes |
| **Visual direction table** (time · shot · camera/talent/prop · energy · peak?) | Yes |
| Alt text / cover description | Yes |
| Best time | Yes |
| Rendered MP4 / motion file | **No — out of MVP scope** |

Label in UI: *Production-ready script & direction — not a finished video.*

### LinkedIn

| Field | Required |
|-------|----------|
| Full post text (900–1600 prefer) | Yes |
| Hashtags (3–5) | Yes |
| First comment (optional CTA soft) | Optional |
| Alt for carousel/cover if any | Yes if visual |
| Best time | Yes |

### Threads

| Field | Required |
|-------|----------|
| Numbered posts (4–8) copy-paste ready | Yes |
| Final post = offer CTA | Yes |
| Best time | Yes |

### Email

| Field | Required |
|-------|----------|
| Subject lines (3–4) | Yes |
| Preheader | Yes |
| Body (120–250 words) | Yes |
| Single primary CTA | Yes |
| Plain-text paste block | Yes |

### Facebook

| Field | Required |
|-------|----------|
| Caption (hook in first 125 chars + offer) | Yes |
| Image / carousel direction (prefer 4:5) | Yes if visual |
| Hashtags (0–3) | Optional |
| First comment (optional soft CTA) | Optional |
| Best time | Yes |
| Reels script note (if short video angle) | Optional — adapt TikTok, do not clone caption |

### YouTube

| Field | Required |
|-------|----------|
| Title options (2–3, ≤70 chars prefer) | Yes |
| Description (hook lines + bullets + offer + links) | Yes |
| Thumbnail direction (16:9 · ≤5 words on-image) | Yes |
| Chapters / outline (if long-form) | Optional |
| Shorts script + visual direction (if short-form) | Yes if Shorts — MVP no render |
| Best time | Yes |

## HTML UI pattern (mandatory section)

After platform craft sections, add:

```html
<section id="ready-to-post">
  <h2>Ready-to-post</h2>
  <!-- one card per platform: copy blocks, monospace optional -->
</section>
```

Each platform card: **Copy caption** as plain text in a `<pre>` or clear blockquote so users can select-all.

## A/B notes (lightweight)

For objective `leads` or `conversion`, add **1 alternate hook** per top-2 platforms (not full second pack).  
Label: `Variant B — hook only`.

## Marketing score (alongside Content Pro scores)

| Dimension | 1–10 | Gate |
|-----------|------|------|
| Hook stop-scroll | | ≥ 8.5 |
| Persona / pain fit | | ≥ 8.5 |
| Funnel fit | | ≥ 8.0 |
| Offer clarity | | ≥ 8.5 |
| Platform-native | | ≥ 8.5 |
| Ready-to-post completeness | | **all fields filled** |

Missing ready-to-post fields = **ship fail** even if drama score is high.

# MVP output scope — Content Repurposer

**Canonical product decision (Artifact OS · Giai đoạn 1).**

## One-line rule

> **Ship text + visual direction + script.**  
> **Do not** render real video (HyperFrames / MP4 / fal motion) inside this skill in MVP.

Marketers get 70–80% of value from copy-paste captions, carousel slide copy, and filmable short-video **scripts + shot lists**. They keep control of final motion production.

---

## In scope (MVP — ship these)

| Output type | Description | Priority |
|-------------|-------------|----------|
| **Text posts + captions** | XHS caption, TikTok caption, LinkedIn post, Facebook feed, Threads/X chain | P0 |
| **Carousel content** | Slide list + per-slide on-image text + story arc (XHS / IG / LI / FB carousel) | P0 |
| **Short video script + visual direction** | Spoken script, energy map, **shot list**, peak frame description, on-screen text, B-roll notes — **not** a rendered file (TikTok / Reels / Shorts / FB Reels) | P0 |
| **YouTube package** | Title options + description + thumbnail direction (+ Shorts script if short) | P0 |
| **Email** | Subjects + preheader + body + CTA | P1 |
| **Thread / long-form** | LinkedIn long post, Threads chain | P1 |
| **Hook lab / variants** | Weak→strong hooks; Variant B hook for leads/conversion | P1 |
| **Hashtags & SEO hints** | Per-platform tags; light keyword notes | P2 |
| **HTML pack UI** | `index.html` gallery for preview under Brand (static cards / storyboards) | P0 |

### TikTok / Reels / Shorts (important)

**Deliver:**
- Spoken script (0–3s kill → beats → peak → CTA)  
- On-screen text lines  
- **Visual direction table** (time · shot · camera · talent · prop · on-screen · energy)  
- **Peak frame** one-liner (filmable, non-substitutable description)  
- Caption + hashtags + best time  

**Do not deliver:**
- MP4 / WebM / HyperFrames composition as the primary artifact  
- “Auto video from text” pipelines  
- Complex video edit instructions as a substitute for a clear shot list  

Static **storyboard HTML frames** (optional) are OK if they help the marketer visualize — they are **direction**, not final motion render.

---

## Out of scope (MVP — refuse or hand off)

| Do not do | Why | Later handoff |
|-----------|-----|----------------|
| Full video render (HyperFrames, Remotion, fal video, etc.) | Unstable quality; slow; not marketer control | Giai đoạn 3 · skill e.g. `video-motion-from-script` |
| Text-to-video fully automatic | Same | Same |
| Complex multi-track edit | Out of skill boundary | Dedicated video skills |
| Email **sequences** (nurture drip multi-day) | Scope creep | Giai đoạn 2 · social-content-factory / email skill |
| Full content calendar product | Separate skill | social-content-factory already owns batch calendars |

If the user **explicitly** demands rendered video in MVP:

1. Still produce **script + visual direction** first (this skill’s job).  
2. Say clearly: *MVP repurposer does not render video; hand off to a video skill when available.*  
3. Do **not** pretend an HTML mock is a finished MP4.

---

## Output contract (logical shape)

Every pack should be representable as:

```json
{
  "standard": "Content Pro v2.2",
  "mvp_scope": "text_visual_script",
  "original_content_summary": "…",
  "strategy": {
    "objective": "…",
    "funnel_stage": "…",
    "persona": "…",
    "pain_points": [],
    "offer": "…"
  },
  "brand_slug": "personal-minimal",
  "platforms": ["xhs", "tiktok", "linkedin", "threads", "email"],
  "hook_lab": [
    { "framework": "paradox", "weak": "…", "strong": "…", "primary": true }
  ],
  "outputs": [
    {
      "platform": "xhs",
      "type": "carousel",
      "title": "…",
      "slides": [{ "n": 1, "on_image": "…", "notes": "…" }],
      "caption": "…",
      "hashtags": [],
      "alt": "…",
      "best_time": "…",
      "ready_to_post": true
    },
    {
      "platform": "tiktok",
      "type": "short_video_script",
      "hook": "…",
      "script": "…",
      "on_screen_text": [],
      "visual_direction": [
        { "t": "0–3s", "shot": "…", "energy": 10, "peak": false }
      ],
      "peak_frame": "…",
      "cta": "…",
      "caption": "…",
      "hashtags": [],
      "best_time": "…",
      "rendered_video": false
    },
    {
      "platform": "linkedin",
      "type": "text_post",
      "content": "…",
      "hashtags": [],
      "best_time": "…"
    }
  ],
  "scores": { "craft_calibrated": 9.0, "marketing": {} }
}
```

**HTML is the user-facing pack** (`index.html`). Embed the same fields in readable sections.  
Optional: include a collapsible `<pre id="pack-json">` with the JSON for export — nice-to-have, not required if HTML sections are complete.

---

## Roadmap alignment

| Phase | Scope |
|-------|--------|
| **MVP (now)** | Text + visual direction + script; ready-to-post; strategy; Brand §8 |
| **Giai đoạn 2** | Email sequence, calendar integration, richer A/B |
| **Giai đoạn 3** | Optional motion render skill consuming this pack’s script |

---

## QA (scope)

- [ ] No claim of “video rendered” / no MP4 as primary output  
- [ ] TikTok has script **and** visual_direction / peak_frame  
- [ ] XHS has slides + caption (carousel content)  
- [ ] LinkedIn / Threads / Email are text-first ready-to-post  
- [ ] Hook lab present  
- [ ] Brand voice §8 applied  

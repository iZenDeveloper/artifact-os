# Marketing Vertical — Product strategy (canonical)

**Vertical đầu tiên** của Artifact OS.  
Tài liệu này khóa **đối tượng · pain · workflow · skill · brand · moat · MVP metrics**, và map **đã ship / còn thiếu**.

Cập nhật: 2026-07 · Aligns with Content Pro **v2.2** + MVP output scope (text + visual direction + script).

---

## 1. User segments

| Segment | Đặc điểm | Nhu cầu chính | Ưu tiên MVP |
|--------|----------|---------------|-------------|
| **Content Creator cá nhân** | Personal brand; XHS, TikTok, LinkedIn, Threads | Tốc độ, repurposing, đa nền, dễ dùng | **P0** |
| **Marketer / Freelancer** | Nhiều client hoặc brand cá nhân | Đổi brand nhanh, chất lượng ổn, deliverable | **P0** |
| **Agency nhỏ & vừa** | Nhiều client, consistency | Brand mgmt, workflow theo client, export | P1 (sau MVP) |
| **In-house Marketing** | Brand guideline sẵn | Tích hợp guideline, repurpose nội bộ | P2 |

**Kết luận MVP:** tập trung **2 segment đầu**. Agency / in-house = mở rộng (Client Package, multi-brand library).

---

## 2. Pain points → product response

| Pain | Mức độ | Response đã/đang có |
|------|--------|---------------------|
| Mất thời gian repurposing 1 → 4–5 nền | Rất cao | `content-repurposer` |
| Khó giữ brand khi nhiều client | Rất cao | Brand Switcher + DESIGN.md §8 Voice + 3 presets |
| Thiếu hook mạnh | Cao | `hook-engine` + hook lab trong pack |
| Ad variants tốn thời gian | Cao | `ad-variants-generator` |
| Output chưa ready-to-post | Cao | ready-to-post fields (v2.2) |
| Quản lý theo client | Trung–Cao | **Gap** (library / client package — Giai đoạn 2) |
| Đẹp + chuyển đổi | Cao | Strategy inputs + psychology + Content Pro craft |

---

## 3. Workflows

| Workflow | Ưu tiên | Status |
|----------|---------|--------|
| **Content Repurposing** | P0 | **Shipped** · text + visual direction + script (no video render MVP) |
| **Social Content Factory** | P0 | **Shipped** · batch v2.2 |
| **Hook & Angle Generator** | P0 | **Shipped** · `hook-engine` |
| **Ad Creative Variants** | P1 | **Shipped** · `ad-variants-generator` |
| **Client-specific content** | P1 | **Partial** · Brand Switcher + §8 voice; no separate skill |
| Content Calendar & Pillar | P2 | Partial via social-content-factory calendar · full planner later |
| Email Sequence | P2 | **Not in MVP** |
| Landing / Sales page | P2 | **Not in MVP** |
| Competitor analysis | P3 | **Not in MVP** |
| Variants Comparison UI | P2 | **Gap** |
| Client Package export | P2 | **Gap** |

---

## 4. Skills priority

### Top skills (MVP set)

| # | Skill | Status | Notes |
|---|-------|--------|-------|
| 0 | `product-marketing` | **Pilot** | Positioning/ICP context; DESIGN.md bridge; run before packs |
| 0b | `cro` | **Pilot** | Page/form CRO audit → cro-audit.html (marketingskills bridge) |
| 0c | `copywriting` | **Pilot** | Full page copy (replaced catalogue stub) |
| 0d | `seo-audit` | **Pilot** | Technical + on-page SEO audit (marketingskills) |
| 0e | `ai-seo` | **Pilot** | AEO/GEO / AI citations (marketingskills) |
| 0f | `emails` | **Pilot** | Lifecycle email sequences (marketingskills) |
| 0g | `launch` | **Pilot** | GTM / product launch plan (marketingskills) |
| 0h | `schema` | **Pilot** | JSON-LD / rich results structured data (marketingskills) |
| 0i | `cold-email` | **Pilot** | B2B outbound / SDR cold sequences (marketingskills; ≠ lifecycle `emails`) |
| 0j | `content-strategy` | **Pilot** | Pillars, topic clusters, editorial roadmap (marketingskills) |
| 0k | `sales-enablement` | **Pilot** | Decks, one-pagers, objections, demo scripts, playbooks (marketingskills) |
| 1 | `content-repurposer` | **Done** | Core; strategy + ready-to-post; MVP scope locked |
| 2 | `social-content-factory` | **Done** | Original batch / week |
| 3 | `hook-engine` | **Done** | Hooks-only lab |
| 4 | `ad-variants-generator` | **Done** | Paid matrix |
| 5 | *brand-aware content* | **Embedded** | Not a separate skill: active Brand + `brand-voice.md` + DESIGN.md §8 in all marketing skills |

Supporting (shipped light): `marketing-psychology`.

### Later (not MVP)

- `landing-page-optimizer`  
- `content-calendar-planner` (calendar UX; strategy covered by pilot `content-strategy`)  
- (lifecycle + cold email covered by pilots `emails` + `cold-email`)  
- `performance-critique`  
- `video-motion-from-script` (Giai đoạn 3 — consumes repurposer scripts)

---

## 5. Brands / Design Systems

| Need | Status |
|------|--------|
| Voice & Tone chi tiết | **Done** · §8.1–8.6 on all 3 presets |
| Color / Type / Spacing | **Done** |
| Brand Personality | **Done** · Brand Overview + 3 keywords |
| Do’s & Don’ts | **Done** · §8.4 + §9 |
| Platform-specific guidelines | **Partial** · in `references/marketing/platforms-vn.md` (skill knowledge, not per-brand) |

### Recommended structure vs repo layout

| Strategy doc | Repo (OD-compatible flat) |
|--------------|---------------------------|
| `personal/minimal` | `design-systems/personal-minimal` |
| `personal/bold` | `design-systems/personal-bold` |
| `professional/clean` | `design-systems/professional-clean` |
| `client/[name]` | `design-systems/<client-slug>` (user-created) |

Template: [DESIGN_MD_MARKETING_TEMPLATE.md](./DESIGN_MD_MARKETING_TEMPLATE.md) · [BRANDS.md](./BRANDS.md)

---

## 6. References / knowledge moat

Canonical home (not nested `skills/marketing/` — OD discovers **one level** under `skills/`):

```
skills/content-repurposer/references/marketing/
  frameworks.md      # PAS, AIDA, StoryBrand, curiosity…
  psychology.md      # honest levers
  platforms-vn.md    # XHS, TikTok, LinkedIn, Email (VN/SEA)
  cro-basics.md
  README.md
```

Also: `content-pro-standards.md`, `strategy-inputs.md`, `ready-to-post.md`, `mvp-output-scope.md`, `brand-voice.md`, `repurpose-frameworks.md`.

Shared by: content-repurposer, hook-engine, social-content-factory, ad-variants, marketing-psychology, marketing pack.

---

## 7. UI/UX for marketers

| Need | Status |
|------|--------|
| Brand Switcher (Personal ↔ Client) | **Done** |
| Platform Preview (XHS / TikTok / LinkedIn / Facebook / YouTube) | **Done** |
| Strategy inputs (objective, funnel, persona…) | **Done** · skill + Home prompt seeds |
| Ready-to-post export fields | **Done** · in HTML pack |
| Variants Comparison view | **Gap** · Giai đoạn 2 |
| Client Package export | **Gap** · Giai đoạn 2 |
| Brand Voice preview in picker | **Gap** · nice-to-have |

---

## 8. Moat

| Moat | How | Durability |
|------|-----|------------|
| Repurposing quality | Content Pro craft + regression baseline | Medium–High |
| Platform depth (XHS/TikTok VN) | `platforms-vn.md` + skill craft bars | **High** if maintained |
| Brand + Strategy combined | DESIGN.md §8 + strategy-inputs + skills | **High** |
| Speed multi-platform | Home chips → pack → ready-to-post | Medium |
| Installable pack | `marketing-vertical-pack` | Medium |

---

## 9. MVP scope (6–8 week target) — scorecard

| Item | Target | Status |
|------|--------|--------|
| 3–5 Brands | personal-minimal/bold, professional-clean (+ clients later) | **3 presets Done** |
| 3 core skills | repurposer, social factory, hook-engine | **Done** (+ ads, psych) |
| Brand Switcher + Platform Preview | UI | **Done** |
| Marketing plugin pack | Installable | **Done** |
| Marketing references | Psych + frameworks + platforms VN | **Done** |
| Repurposer MVP outputs | Text + visual direction + script | **Done** (scoped) |
| Video render | Out of MVP | **Explicitly out** |
| Email sequence / calendar product / competitor | Out of MVP | **Out** |

---

## 10. Success metrics (Giai đoạn 1)

| Metric | Target | How we support |
|--------|--------|----------------|
| 1 multi-platform pack in **1–2 big prompts** | Yes | Home Content Pack + content-repurposer |
| Time vs manual | **−50–70%** | Ready-to-post + multi-platform one run |
| Reuse of content-repurposer | High | Featured skill + Home rail |
| Brand voice held across clients | Felt by user | Brand Switcher + §8 + brand-voice QA |

---

## 11. Three focus pillars (summary)

1. **Repurposing workflow** — pain #1 · `content-repurposer`  
2. **Brand + Strategy** — Switcher + DESIGN.md §8 + strategy block  
3. **Platform optimization** — XHS + TikTok first-class craft · LinkedIn/Threads/Email complete  

---

## 12. Recommended next builds (priority order)

| # | Item | Why |
|---|------|-----|
| 1 | **Use & harden** repurposer packs against regression baseline | **Done** · polish P1–P3 freeze + suite + pre-ship QA + lint script |
| 2 | **Variants Comparison** lightweight UI or HTML section | Marketer A/B pain |
| 3 | **Client Package export** (zip: captions + notes + brand slug) | Agency path |
| 4 | More **client** brand examples (template filled) | Freelancer multi-client |
| 5 | Giai đoạn 2: calendar depth / email sequence | After MVP feedback |
| 1b | **Re-run** 3 regression briefs with agent (record scores) | Confirm freeze after harden |

---

## Related docs

- [VISION.md](./VISION.md) · [ROADMAP.md](./ROADMAP.md) · [VERTICAL_INDEX.md](./VERTICAL_INDEX.md)  
- [BRANDS.md](./BRANDS.md) · [DESIGN_MD_MARKETING_TEMPLATE.md](./DESIGN_MD_MARKETING_TEMPLATE.md)  
- [MARKETING_PACK.md](./MARKETING_PACK.md)  
- Skill scope: `skills/content-repurposer/references/mvp-output-scope.md`  

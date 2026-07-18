# Artifact OS

Fork foundation of [nexu-io/open-design](https://github.com/nexu-io/open-design) for **vertical-specialized content workflows**.

## Documents

| Doc | Purpose |
|-----|---------|
| [VISION.md](./VISION.md) | Product vision & core value |
| [MARKETING_VERTICAL.md](./MARKETING_VERTICAL.md) | **Canonical** Marketing vertical strategy · segments · pain · scorecard |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Gateway / Vertical / Presentation layers |
| [ROADMAP.md](./ROADMAP.md) | Phased MVP plan |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Dev setup (upstream-oriented) |
| [VERTICAL_INDEX.md](./VERTICAL_INDEX.md) | Map of verticals → skills → brands |
| [BRANDS.md](./BRANDS.md) | Brand UI vs `design-systems/<slug>/DESIGN.md` storage |
| [../skills/content-repurposer/references/marketing/](../../skills/content-repurposer/references/marketing/) | Shared marketing knowledge (frameworks, psych, platforms VN, CRO) |
| [MARKETING_PACK.md](./MARKETING_PACK.md) | Installable Marketing Vertical plugin pack |
| [DESIGN_MD_MARKETING_TEMPLATE.md](./DESIGN_MD_MARKETING_TEMPLATE.md) | Brand DESIGN.md template — Voice & Tone §8 standard |
| [BRANDS.md](./BRANDS.md) | Brand UI vs design-systems storage + voice contract |
| Locale | **Tiếng Việt (`vi`)** | Home chips · outcomes · packs · apply-skill prompt seeds |

## Status

- **Base:** Open Design `0.15.x` (cloned from upstream)
- **Branch:** `vertical-os/foundation`
- **Phase:** Giai đoạn 1 — Foundation & Marketing Vertical
- **Upstream remote:** `upstream` → `https://github.com/nexu-io/open-design.git`
- **Origin:** not set yet — create a GitHub fork and `git remote add origin <your-fork>`

## Quick start (this repo)

```bash
cd vertical-content-os
corepack enable
corepack prepare pnpm@10.33.2 --activate
pnpm install
pnpm tools-dev run web
```

Open the URL printed by the dev server (typically `http://localhost:3000`).

### Marketing vertical — try first

1. Open the **Brand** picker (home or project header)  
   - Tabs: **Personal | Client | All**  
   - Quick chips: Personal Minimal · Personal Bold · Professional Clean  
   - Each brand is `design-systems/<slug>/DESIGN.md` (+ optional `assets/`)  
2. Skills (Marketing stack — all Content Pro **v2.2** where noted):  
   - **content-repurposer** — multi-platform pack · MVP: **text + visual direction + script** (no video render)  
   - **hook-engine** — hooks-only lab (weak→strong)  
   - **social-content-factory** — original batch / week calendar  
   - **ad-variants-generator** — paid creative matrix  
   - Knowledge: `skills/content-repurposer/references/marketing/`  
3. Prompt: paste source + objective / funnel / persona / offer → multi-platform pack with copy-paste ready posts  
   - Or: “hook lab only” → **hook-engine** before expanding the pack  
4. After an artifact opens in preview, use the viewport toolbar:  
   **Desktop / Tablet / Mobile** | **XHS · TikTok · LinkedIn · Facebook · YouTube** (Platform Preview) to frame Content Pro ratios (3:4 / 9:16 / 1:1 / 4:5 / 16:9)

## Extension layout (Open Design compatible)

Open Design discovers **one level** under `skills/` and `design-systems/`.  
Vertical grouping is by **naming + tags + docs**, not nested folders:

```
skills/
  content-repurposer/          # marketing · full packs
  hook-engine/                 # marketing · hooks-only lab
  social-content-factory/      # marketing
  ad-variants-generator/       # marketing
  card-xiaohongshu/            # upstream (keep)

design-systems/                # UI: Brands (DESIGN.md + assets/ only required)
  personal-minimal/            # Artifact OS · Personal
  personal-bold/               # Artifact OS · Personal
  professional-clean/          # Artifact OS
  …                            # upstream brand systems

plugins/community/
  marketing-vertical-pack/     # installable bundle (skills + brands)
```

**Pack install:** see [MARKETING_PACK.md](./MARKETING_PACK.md) · sync with `pnpm exec tsx scripts/sync-marketing-vertical-pack.ts`

## Principles

1. Prefer new Skills / Design Systems over core forks
2. Keep `upstream` for regular pulls from Open Design
3. Quality of Marketing pack > number of verticals

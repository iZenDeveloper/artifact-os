# Vertical Content OS

Fork foundation of [nexu-io/open-design](https://github.com/nexu-io/open-design) for **vertical-specialized content workflows**.

## Documents

| Doc | Purpose |
|-----|---------|
| [VISION.md](./VISION.md) | Product vision & core value |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Gateway / Vertical / Presentation layers |
| [ROADMAP.md](./ROADMAP.md) | Phased MVP plan |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Dev setup (upstream-oriented) |
| [VERTICAL_INDEX.md](./VERTICAL_INDEX.md) | Map of verticals → skills → design systems |

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

1. Design system: **Personal Minimal**, **Personal Bold**, or **Professional Clean**
2. Skill: **content-repurposer**
3. Prompt: paste a blog/outline and ask for a multi-platform pack (XHS + TikTok + LinkedIn + Threads + Email)

## Extension layout (Open Design compatible)

Open Design discovers **one level** under `skills/` and `design-systems/`.  
Vertical grouping is by **naming + tags + docs**, not nested folders:

```
skills/
  content-repurposer/          # marketing
  social-content-factory/      # marketing
  ad-variants-generator/       # marketing
  card-xiaohongshu/            # upstream (keep)

design-systems/
  personal-minimal/            # Vertical OS
  personal-bold/               # Vertical OS
  professional-clean/          # Vertical OS
  …                            # upstream brand systems
```

## Principles

1. Prefer new Skills / Design Systems over core forks
2. Keep `upstream` for regular pulls from Open Design
3. Quality of Marketing pack > number of verticals

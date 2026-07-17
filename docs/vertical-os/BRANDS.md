# Brands (UI) · design-systems/ (storage)

Artifact OS keeps the Open Design **storage layout** and renames the **product concept** for creators.

| Layer | Name | Path / API |
|-------|------|------------|
| **UI** | **Brand** | Picker, nav, settings, Home |
| **Disk / API** | design system | `design-systems/<brand-slug>/` · `GET /api/design-systems` |

## Layout (canonical)

```
design-systems/
  <brand-slug>/
    DESIGN.md          # required — voice, color, type, rules
    assets/            # optional — logo, product shots, reference images
      logo.svg
      ...
```

### Minimum brand

- `DESIGN.md` only (e.g. `personal-minimal`, `personal-bold`, `professional-clean`)

### Full brand kit

- `DESIGN.md` + `assets/` for logos and imagery the agent may reference

Do **not** require the full Open Design kit tree (multi-page HTML previews, large token dumps) for Vertical creator brands. Those may still exist for upstream presets, but **creator brands are DESIGN.md-first**.

## Selecting a brand

1. Home / project composer → **Choose brand**
2. Filter **Personal · Client · All** (Artifact OS modes)
3. Quick-switch chips for Vertical presets when installed
4. Selection is stored as `designSystemId` on the project (unchanged contract)

## Creating a brand

1. **UI:** Create Brand (extract from site / upload assets)
2. **Manual:** add `design-systems/my-brand/DESIGN.md` (+ `assets/`)
3. Daemon discovers folders under `design-systems/` the same way as upstream

## Agent contract

When a brand is active, the agent must:

1. Read `design-systems/<slug>/DESIGN.md`
2. Prefer colors, type, and **§8 Voice & Tone** from that file (Brand Overview + §8 + §9 first for marketing packs)
3. Use `assets/` when present (logo paths, sample images)
4. Follow Marketing voice checklist: `skills/content-repurposer/references/brand-voice.md`

## Voice & Tone standard (Marketing Vertical)

Every Vertical brand `DESIGN.md` should include:

- **Brand Overview** (before §1) — audience, jobs, when to pick  
- **§8 Voice & Tone** with subsections:  
  8.1 Brand Voice · 8.2 Tone by Context · 8.3 Writing Principles · 8.4 Do’s/Don’ts · 8.5 Example Sentences · 8.6 Brand × Content Pro  
- **§9 Anti-patterns** covering **visual + voice**

Keep Open Design’s **9 numbered sections** (`## 1.` … `## 9.`) for schema compatibility.

**Template:** [DESIGN_MD_MARKETING_TEMPLATE.md](./DESIGN_MD_MARKETING_TEMPLATE.md)

## Artifact OS presets

| Slug | Mode | Notes |
|------|------|--------|
| `personal-minimal` | Personal | Calm creator default |
| `personal-bold` | Personal | Higher-energy personal |
| `professional-clean` | Client | Client / B2B clean |

## Migration note

- Code identifiers stay `designSystem*` / `design-systems` to avoid a protocol break.
- User-visible copy uses **Brand** / **Brands**.

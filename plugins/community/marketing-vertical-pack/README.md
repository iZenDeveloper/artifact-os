# Marketing Vertical Pack

**Vertical Content OS** installable bundle for marketers and content creators.

| | |
|--|--|
| **Plugin id** | `marketing-vertical-pack` |
| **Kind** | `bundle` |
| **Version** | `1.0.0` |
| **Standard** | Content Pro **v2.2** (where noted) |

## What’s inside

### Skills

| Skill | Role |
|-------|------|
| `content-repurposer` | 1 source → multi-platform pack + ready-to-post |
| `hook-engine` | Hooks-only lab (weak→strong) |
| `social-content-factory` | Original social batch / week calendar |
| `ad-variants-generator` | Paid creative matrix |
| `marketing-psychology` | Honest psych framing |
| *(root `SKILL.md`)* | Router — pick the right nested skill |

### Brands (Design Systems)

- `personal-minimal` — calm personal  
- `personal-bold` — high-energy creator  
- `professional-clean` — client / B2B  

Shared marketing knowledge lives under  
`skills/content-repurposer/references/marketing/`.

## Install (Artifact OS)

From this repo (local path):

```bash
# Validate
od plugin validate ./plugins/community/marketing-vertical-pack --no-daemon

# Pack tarball (optional distribute)
od plugin pack ./plugins/community/marketing-vertical-pack

# Install into daemon registry
od plugin install ./plugins/community/marketing-vertical-pack
# or after pack:
# od plugin install ./plugins/community/marketing-vertical-pack-1.0.0.tgz

od plugin info marketing-vertical-pack --json
```

**Use in product:** Marketplace / Plugins → **Marketing Vertical Pack** → Use,  
or Home chips already bound to the same skills in this Vertical OS fork.

## Develop in-monorepo

Canonical sources (edit these, then sync):

- `skills/content-repurposer/`  
- `skills/hook-engine/`  
- `skills/social-content-factory/`  
- `skills/ad-variants-generator/`  
- `skills/marketing-psychology/`  
- `design-systems/personal-{minimal,bold}/`  
- `design-systems/professional-clean/`  

Sync copies into the pack:

```bash
pnpm exec tsx scripts/sync-marketing-vertical-pack.ts
# or: bash scripts/sync-marketing-vertical-pack.sh
```

Do **not** hand-edit nested skill copies under `plugins/community/marketing-vertical-pack/skills/` — they are overwritten by sync.

## Router cheatsheet

See `examples/starter-routes.md`.

## License

Apache-2.0 (same as Artifact OS base), unless a nested file says otherwise.

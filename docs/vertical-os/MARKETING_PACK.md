# Marketing Vertical Pack

Installable Open Design **bundle** for Artifact OS · Marketing.

| | |
|--|--|
| Path | `plugins/community/marketing-vertical-pack/` |
| Plugin id | `marketing-vertical-pack` |
| Kind | `bundle` |
| Version | `1.0.0` |

## Contents

**Skills (Content Pro v2.2 where noted)**

- content-repurposer  
- hook-engine  
- social-content-factory  
- ad-variants-generator  
- variants-comparison  
- marketing-psychology  
- Root `SKILL.md` = intent router  

**Brands**

- personal-minimal  
- personal-bold  
- professional-clean  

**Knowledge**

- Nested under content-repurposer: `references/marketing/`  

## Install

```bash
od plugin validate ./plugins/community/marketing-vertical-pack --no-daemon
od plugin pack ./plugins/community/marketing-vertical-pack
od plugin install ./plugins/community/marketing-vertical-pack
```

In this monorepo fork, the same skills also live under repo-root `skills/` and are wired on Home without requiring a separate install — the pack is for **share / install / marketplace** distribution.

## Sync (maintainers)

Canonical sources are repo-root `skills/*` and `design-systems/*`.  
After editing them:

```bash
pnpm exec tsx scripts/sync-marketing-vertical-pack.ts
```

## Related docs

- [VERTICAL_INDEX.md](./VERTICAL_INDEX.md)  
- [README.md](./README.md)  
- [ROADMAP.md](./ROADMAP.md)  
- Upstream: [docs/publishing-a-plugin.md](../publishing-a-plugin.md)  

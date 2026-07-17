# Vertical Content OS

This repository is a **local foundation** for Vertical Content OS:

- **Upstream product:** [Open Design](https://github.com/nexu-io/open-design) (local-first design OS)
- **Our layer:** Marketing-first vertical skills + design systems + product docs

## Read first

→ **[docs/vertical-os/README.md](docs/vertical-os/README.md)**

Also: [VISION](docs/vertical-os/VISION.md) · [ARCHITECTURE](docs/vertical-os/ARCHITECTURE.md) · [ROADMAP](docs/vertical-os/ROADMAP.md) · [VERTICAL_INDEX](docs/vertical-os/VERTICAL_INDEX.md)

## What we added on day one

- `design-systems/personal-minimal`
- `design-systems/personal-bold`
- `design-systems/professional-clean`
- `skills/content-repurposer` (+ references)
- `skills/social-content-factory`
- `skills/ad-variants-generator`
- `docs/vertical-os/*`

## Git remotes

```text
upstream  → https://github.com/nexu-io/open-design.git
origin    → (add your fork when ready)
```

```bash
gh auth login   # if needed
gh repo fork nexu-io/open-design --remote=false
# then:
git remote add origin git@github.com:<you>/open-design.git
# or rename your fork to vertical-content-os on GitHub
```

## Sync upstream later

```bash
git fetch upstream
git merge upstream/main   # or rebase — prefer small, frequent syncs
```

## License

Same as Open Design: **Apache-2.0** for the base. New Vertical OS docs/skills in this tree follow the same license unless a file says otherwise.

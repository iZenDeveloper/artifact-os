<h1 align="center">Artifact OS</h1>

<p align="center">
  <b>The creative OS for modern marketers.</b><br/>
  Turn one brief into multi-platform content packs, landing pages, decks, and brand-ready assets — powered by the coding agent already on your laptop.
</p>

<p align="center">
  <a href="https://github.com/iZenDeveloper/artifact-os"><img alt="repo" src="https://img.shields.io/badge/github-artifact--os-blueviolet?style=flat" /></a>
  <a href="LICENSE"><img alt="license" src="https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat" /></a>
  <a href="QUICKSTART.md"><img alt="quickstart" src="https://img.shields.io/badge/quickstart-3%20commands-green?style=flat" /></a>
</p>

<p align="center">
  <a href="QUICKSTART.md">Quickstart</a> ·
  <a href="#what-you-ship">What you ship</a> ·
  <a href="#built-for-marketing-workflows">Workflows</a> ·
  <a href="#run-it">Run it</a> ·
  <a href="https://github.com/nexu-io/open-design">Upstream engine</a>
</p>

---

## Why marketers use Artifact OS

Marketing teams still bounce between ChatGPT tabs, Figma files, Notion docs, and “can eng export this?” threads.

**Artifact OS** is a **local-first studio** where you:

1. **Lock the brand** once (`DESIGN.md` / brand kit)
2. **Pick a format** (content pack, carousel, landing page, pitch deck, email…)
3. **Run your agent** (Claude Code, Codex, Cursor, Gemini, OpenCode, …)
4. **Preview & export** real files — HTML, PDF, PPTX, MP4 — not a dead screenshot

No waiting on design bandwidth for every campaign variation. No starting from a blank chat every Monday.

---

## What you ship

| Format | Marketer job |
|--------|----------------|
| **Content packs** | One prompt → copy + visual direction for TikTok, XHS, LinkedIn, Threads, email |
| **Carousels & social** | Scroll-stopping posts and multi-slide stories, on-brand |
| **Landing / campaign pages** | Launch pages and promo microsites as real HTML |
| **Pitch & sales decks** | Fundraise, sales, or product story decks → export PPTX / PDF |
| **Prototypes & live demos** | Clickable product stories for GTM and customer reviews |
| **Brand systems** | Capture voice, color, type, and components so every run stays consistent |

Everything lands as **files on disk** in a project you own — easy to review, version, and hand off.

---

## Built for marketing workflows

### Home — start from the outcome
Pick a **workflow card** (Content Pack, Hook Lab, PMF story, carousel…), attach brand context, and run. The prompt is the brief; the studio is the workroom.

### Brand — one contract for every channel
Connect a **design system** so XHS and LinkedIn don’t invent two different brands. Update the kit once; the next campaign inherits it.

### Community — steal the playbook, keep the brand
Browse ready **plugins and templates** (slides, prototypes, live artifacts). Remix community work with *your* brand — don’t start from zero.

### Automation — repeat what works
Turn “weekly social pack” or “new feature launch kit” into a reusable flow instead of re-explaining the process every time.

### Studio — preview, critique, export
Open any project: sandboxed live preview, design files, exports. Share a PDF or PPTX with stakeholders without leaving the app.

---

## How a campaign run feels

```text
Brief  →  Format + brand  →  Agent generates  →  Preview  →  Export / handoff
```

- **You** write the brief in marketer language (“PMF fail story for founders, multi-platform”).
- **Artifact OS** binds format + brand + skills.
- **Your coding agent** produces the artifact.
- **You** review in-app, tweak, export, ship.

---

## Who it’s for

- **Growth & content marketers** shipping multi-channel campaigns weekly  
- **Founder-led marketing** without a full design team  
- **Agency / freelance** teams packaging client deliverables (HTML / PDF / PPTX)  
- **PMM & GTM** who need decks, one-pagers, and demos that match the product brand  

If you live in ChatGPT + Canva + “please export this”, this is the next step.

---

## Run it

### Requirements
- **Node.js 24.x**
- **pnpm 10.33.x** (via Corepack)
- Optional: a coding agent CLI (Claude Code, Codex, Cursor, …) **or** BYOK API keys in Settings

### Local (web + desktop shell)

```bash
git clone https://github.com/iZenDeveloper/artifact-os.git
cd artifact-os
corepack enable
corepack pnpm install
pnpm exec tools-dev start
```

Open the app URL printed by `tools-dev` (typically local ports under `http://127.0.0.1:…`).

Full environment notes: **[QUICKSTART.md](QUICKSTART.md)**.

### Desktop package

```bash
# macOS example — produces Artifact OS .dmg / .zip under tools-pack output
pnpm exec tools-pack --platform mac --namespace release-stable
```

Product name on installers and windows: **Artifact OS**.

---

## Product surfaces (at a glance)

| Surface | Role for marketers |
|---------|-------------------|
| **Home** | Brief + format cards + brand switch |
| **Projects** | Campaign history and deliverables |
| **Brand** | Design systems / brand kits |
| **Community / Plugins** | Templates and vertical packs |
| **Integrations** | Connect tools and agent runtimes |
| **Studio** | Live preview, files, export |

---

## Under the hood (short version)

Artifact OS is a **vertical product line** on the open [Artifact OS / Open Design](https://github.com/nexu-io/open-design) engine:

- Local-first desktop + web UI  
- Skills, plugins, and `DESIGN.md` design systems  
- Agent-native generation (22+ CLIs + BYOK)  
- Sandboxed preview and multi-format export  

You get a **marketing-focused surface**; the engine stays file-based, open, and agent-friendly.

---

## Roadmap focus

- Deeper **multi-platform content pack** templates  
- Faster **brand-on → first export** path for non-engineers  
- Agency-friendly **client package** exports  
- Community plugins for vertical niches (B2B, consumer, local markets)

Contributions and issues: use this repo — [iZenDeveloper/artifact-os](https://github.com/iZenDeveloper/artifact-os).

---

## License

[Apache-2.0](LICENSE)

Upstream project: [nexu-io/open-design](https://github.com/nexu-io/open-design).

# Experts

First-class **role/persona + methodology** packs for Artifact OS runs.

Each expert is a folder under `experts/<id>/` with an `EXPERT.md` file. The
daemon injects the expert body into the system prompt as:

```text
## Active expert — {title}
```

Experts are **orthogonal** to skills/plugins (workflow) and design systems
(brand). Users can combine:

- Template / skill / plugin → *what* to build and how files are structured
- Design system / brand → visual + voice tokens
- Expert → judgment lens, prioritization, quality bar

## EXPERT.md format

```yaml
---
id: marketing-strategist
title: Marketing Strategist
summary: One-line catalog description for the UI picker.
vertical: marketing
tags: [strategy, positioning]
---
# Persona
...
# Methodology
...
# Collaboration with Brand & Skills
...
```

## Rules

- Keep each body short (aim under ~1.5k tokens) — no second full identity charter.
- Always tell the model to honor Active design system when present.
- Always defer deliverable scaffolding to Active skill / plugin.
- Prefer judgment rules and checklists over generic “be helpful” prose.
- Official marketing vertical experts ship in this directory; user experts
  (Expert Center) are a later phase under the runtime data dir.

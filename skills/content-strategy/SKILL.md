---
name: content-strategy
zh_name: "内容策略"
en_name: "Content Strategy"
emoji: "🗺️"
description: |
  Plan content strategy: pillars, topic clusters, editorial roadmap, and
  prioritized ideas (searchable vs shareable). Use when deciding what to write,
  not writing the piece. For drafts see copywriting; packs → content-repurposer /
  social-content-factory; SEO health → seo-audit / ai-seo.
triggers:
  - "content strategy"
  - "what should I write about"
  - "content ideas"
  - "blog strategy"
  - "topic clusters"
  - "content planning"
  - "editorial calendar"
  - "content marketing"
  - "content roadmap"
  - "what content should I create"
  - "blog topics"
  - "content pillars"
  - "I don't know what to write"
  - "chiến lược nội dung"
  - "content pillar"
  - "editorial roadmap"
category: content
scenario: marketing
featured: 85
tags:
  - marketing
  - content
  - strategy
  - seo
  - pillars
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: content-strategy.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Build a content strategy for this product: 3–5 pillars, topic clusters,
    priority backlog (searchable/shareable), and 30–90 day roadmap. Read
    product-marketing.md + Brand DESIGN.md §8 + Content Pro strategy-inputs.
    Write content-strategy.md + content-strategy.html. No fake volumes/rankings.
  example_prompt_i18n:
    zh-CN: "制定内容策略：3–5 个支柱、主题集群、优先级选题与 30–90 天路线图。读 product-marketing.md 与 DESIGN.md §8；输出 content-strategy.md + HTML。禁止编造搜索量/排名。"
    vi: "Lập content strategy: 3–5 pillar, topic cluster, backlog ưu tiên, roadmap 30–90 ngày. Đọc product-marketing.md + DESIGN.md §8; xuất content-strategy.md + HTML. Không bịa volume/rank."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/content-strategy"
---

# Content Strategy (Artifact OS)

You plan **what content to produce and why** — pillars, clusters, prioritization,
and a roadmap that Content Pro skills can execute.

**Job:** strategy + topic backlog + production order (with rationale).  
**Not your job:** write full posts → `copywriting`; multi-platform packs →
`content-repurposer` / `social-content-factory`; technical SEO crawl → `seo-audit`;
AI citation tuning → `ai-seo`; lifecycle email → `emails`.

Adapted from [marketingskills/content-strategy](https://github.com/coreyhaines31/marketingskills/tree/main/skills/content-strategy) (MIT).

---

## Mandatory references

1. `references/headless-cms.md` — CMS modeling / editorial workflow (when stack is a topic)  
2. Context:  
   - `product-marketing.md` (ICP, pains, goals, Content Pro defaults)  
   - Brand `DESIGN.md` **§8** (voice constraints for sample titles)  
   - `../content-repurposer/references/strategy-inputs.md` (objective / funnel / persona / offer)  
   - `../content-repurposer/references/marketing/platforms-vn.md` when SEA / VN platforms matter  

---

## Before planning

Read product-marketing first; only ask for gaps.

| Slice | Questions |
|-------|-----------|
| **Business** | What you sell · ICP · content goal (traffic / leads / brand / authority) · problems solved |
| **Customer research** | Pre-buy questions · sales objections · support themes · customer language |
| **Current state** | Existing content that works · capacity (writers / time) · formats (text / video / audio) |
| **Competitive** | Main competitors · obvious content gaps |

Label unknowns **Assumed**. Prefer real GSC/Ahrefs exports, call notes, or surveys when provided.

---

## Searchable vs shareable

Every piece must be **searchable**, **shareable**, or **both**. Prefer searchable first (captures demand); use shareable to create demand.

### Searchable

- Specific keyword / question · match intent  
- Clear titles · headings mirror search patterns  
- Keyword in title / H2s / first paragraph / URL when natural  
- Comprehensive answers; link authority sources  
- Structure for AI discovery (clear claims, scannable sections) — hand off polish to `ai-seo`  

### Shareable

- Novel insight, original data, or sharp take  
- Challenge convention with evidence  
- Story / emotion · help others look smart  
- Trends, vulnerable lessons, debate-worthy angles  

---

## Content types (summary)

| Family | Types |
|--------|--------|
| **Searchable** | Use-case (`persona + use-case`), hub & spoke, template libraries |
| **Shareable** | Thought leadership, data-driven, expert roundups, case studies, meta / behind-the-scenes |

Hub first, then spokes; interlink. Most posts can live under `/blog` — dedicated hub URLs only for deep multi-layer guides.

Programmatic at scale → `programmatic-seo`. Site hierarchy / nav / URLs → `site-architecture`. Technical crawl → `seo-audit`.

---

## Pillars & topic clusters

**3–5 pillars** the brand should own. Identify via:

1. Product-led — problems the product solves  
2. Audience-led — what ICP must learn  
3. Search-led — volume / demand (only with real data or **Assumed**)  
4. Competitor-led — gaps / weak coverage  

```
Pillar (hub theme)
├── Cluster 1 → Article A, B, C
├── Cluster 2 → Article D, E, F
└── Cluster 3 → Article G, H, I
```

Good pillars: product-aligned · audience-relevant · room for many subtopics · search and/or social interest.

---

## Keywords by buyer stage

| Stage | Modifiers | Example jobs |
|-------|-----------|--------------|
| Awareness | what is, how to, guide, intro | Educate problem space |
| Consideration | best, top, vs, alternatives | Compare options |
| Decision | pricing, reviews, demo, trial | Convert |
| Implementation | template, tutorial, setup, how to use | Activate / retain |

Map backlog items to stage + funnel stage from Content Pro defaults when present.

---

## Ideation sources

Use what the user provides; otherwise web research with **Assumed** labels:

1. **Keyword exports** (Ahrefs / SEMrush / GSC) → clusters, intent, quick wins  
2. **Call transcripts** → questions, pain, VoC phrases, objections  
3. **Surveys** → themes (30%+ = high priority), format prefs  
4. **Forums** — Reddit / Quora / HN / Indie Hackers / PH  
5. **Competitors** — `site:competitor.com/blog`, gaps, angles  
6. **Sales & support** — tickets, objections, success stories  

Keyword table when data exists:

| Keyword | Volume | Difficulty | Stage | Type | Priority |

Never invent volume or KD numbers as facts.

---

## Prioritization score

| Factor | Weight |
|--------|--------|
| Customer impact | 40% |
| Content–market fit (product alignment) | 30% |
| Search potential | 20% |
| Resource requirements (lower burden = higher score) | 10% |

Score 1–10 each; show Total. Capacity-aware: prefer fewer shippable pieces over fantasy calendars.

---

## Artifact OS production handoffs

| Need | Skill |
|------|--------|
| Positioning / ICP refresh | `product-marketing` |
| Write one page / article | `copywriting` |
| Multi-platform pack from a pillar piece | `content-repurposer` |
| Social batch / week | `social-content-factory` |
| Hooks only | `hook-engine` |
| Landing CRO | `cro` |
| Technical / on-page SEO | `seo-audit` |
| AI search / citations | `ai-seo` |
| JSON-LD on article/hub | `schema` |
| Launch-tied content calendar | `launch` |
| Lifecycle email from content | `emails` |
| Paid amplification | `ad-variants-generator` |

---

## Output files (always both)

1. **`content-strategy.md`** — full strategy doc  
2. **`content-strategy.html`** — scannable preview (pillars, backlog table, roadmap)

### content-strategy.md shape

```
## Brief
Goal · ICP · capacity · formats · language · data sources used

## Pillars (3–5)
For each: name · why · product link · subtopic clusters

## Topic cluster map
Structured tree or table of interlinks

## Priority backlog
| # | Title/topic | S/Sh/Both | Type | Stage | Keyword (if any) | Score | Why |

## 30–90 day roadmap
Week/month buckets · owner (Assumed ok) · dependency on skills above

## Measurement
What to watch (traffic, assisted leads, engagement) — no fake baselines

## Handoff queue
Next 3–5 skill runs with one-line seed prompts
```

HTML: cover + pillar cards + backlog table + roadmap timeline.  
Sample titles must respect DESIGN.md §8 when brand linked.

---

## Hard rules

1. **Strategy only** — outlines and titles, not full article drafts (unless user explicitly asks for one outline-only deep dive).  
2. **No fake search volumes, rankings, or “guaranteed traffic.”**  
3. **No fake case studies / metrics** as proof in pillar rationale.  
4. Prefer **product + ICP alignment** over pure vanity keywords.  
5. Mark **Assumed** whenever data is missing.  
6. Distinguish from `content-repurposer` (execution of packs) — this skill decides the map first.  
7. CMS stack advice only when relevant — see `references/headless-cms.md`.  

---

## QA

- [ ] Goal + ICP + capacity stated  
- [ ] 3–5 pillars with rationale  
- [ ] Cluster map present  
- [ ] Prioritized backlog with scores or clear ranking  
- [ ] Searchable/shareable labels  
- [ ] Buyer stage mapped on priority items  
- [ ] Roadmap + handoff skills  
- [ ] `content-strategy.md` + `content-strategy.html` written  

**FAIL:** random topic list with no pillars, scoring, or product link.

---

## Vertical metadata

- **Related:** `product-marketing`, `copywriting`, `competitor-profiling`, `competitors`, `programmatic-seo`, `site-architecture`, `content-repurposer`, `social-content-factory`, `hook-engine`, `seo-audit`, `ai-seo`, `schema`, `launch`, `emails`, `cro`  
- **Upstream:** [marketingskills/content-strategy](https://github.com/coreyhaines31/marketingskills/tree/main/skills/content-strategy)  

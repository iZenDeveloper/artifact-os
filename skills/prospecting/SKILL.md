---
name: prospecting
zh_name: "潜客挖掘"
en_name: "Prospecting"
emoji: "🎯"
description: |
  Build and qualify prospect lists — SaaS, B2B, local SMB, demand-signal —
  before cold outreach. Not cold email copy (cold-email); not deep competitor
  dossiers (competitor-profiling); compliance-first, no bulk scraping.
triggers:
  - "prospecting"
  - "build a prospect list"
  - "find prospects"
  - "find leads"
  - "lead gen list"
  - "ICP-fit accounts"
  - "outbound list"
  - "target account list"
  - "find clients near me"
  - "design partners"
  - "beta users"
  - "who should we go after"
  - "tìm khách hàng tiềm năng"
  - "danh sách prospect"
category: content
scenario: marketing
featured: 82
tags:
  - marketing
  - outbound
  - prospecting
  - leads
  - vertical-os
  - marketingskills
od:
  mode: prototype
  surface: web
  platform: desktop
  scenario: marketing
  preview:
    type: html
    entry: prospect-list.html
    reload: debounce-100
  design_system:
    requires: false
  example_prompt: |
    Build a qualified prospect list for [SaaS/B2B/local/demand-signal]. Read
    product-marketing.md for ICP. Write prospect-list.md (+ CSV if large) and
    prospect-list.html. Evidence sources; Hot/Warm/Cold; compliance; no bulk scrape.
  example_prompt_i18n:
    zh-CN: "构建合格潜客列表（SaaS/B2B/本地/需求信号）。读 product-marketing ICP；输出 prospect-list.md + HTML。有证据来源；Hot/Warm/Cold；合规；禁止批量抓取。"
    vi: "Lập list prospect (SaaS/B2B/local/demand-signal). Đọc ICP product-marketing; xuất prospect-list.md + HTML. Có nguồn; Hot/Warm/Cold; compliance; không bulk scrape."
  upstream: "https://github.com/coreyhaines31/marketingskills/tree/main/skills/prospecting"
---

# Prospecting (Artifact OS)

You turn ICP into a **verified, scored lead sheet** ready for outreach.

**Job:** pick branch · define ICP · discover · qualify with evidence · score ·
output list + top targets.  
**Not your job:** write cold sequences → `cold-email`; deep account teardown →
`competitor-profiling`; CRM routing → `revops`.

Adapted from [marketingskills/prospecting](https://github.com/coreyhaines31/marketingskills/tree/main/skills/prospecting) (MIT).

---

## Mandatory references

1. `references/saas-prospecting.md`  
2. `references/b2b-prospecting.md`  
3. `references/local-prospecting.md`  
4. `references/demand-signals.md`  
5. `references/data-sources.md`  
6. `references/compliance.md` — **read every engagement**  

---

## Branches

| Branch | Sell to | Sources sketch |
|--------|---------|----------------|
| SaaS | Other software cos | LinkedIn, BuiltWith, Crunchbase, Apollo… |
| B2B | Non-SaaS B2B | Directories, Sales Nav, enrichment tools |
| Local SMB | Local shops/services | Maps, Yelp, site, social (assisted, not bulk scrape) |
| Demand-signal | First customers / design partners | Public pain posts, forums, jobs, launches |

---

## Five phases

1. **ICP** — firmographic · techno · buying signal · DM · disqualifiers  
2. **Discover** — 2–3× target count; multi-source  
3. **Qualify** — evidence + confidence High/Med/Low  
4. **Score** — Hot / Warm / Cold / Skip (demand-signal uses demand-fit 0–100)  
5. **Lead sheet** — table or CSV + top 3–5 outreach targets  

Default size: ~25 SaaS/B2B · ~15 Local SMB · quality over volume.

---

## Compliance (non-negotiable)

No bulk LinkedIn/Maps scrape · no CAPTCHA/login bypass · public business contacts
only · GDPR/CAN-SPAM lineage (source URL + date) · no reselling lists · no
breached data · no sensitive-trait targeting. Details: `compliance.md`.

---

## Output files

1. **`prospect-list.md`** (table + top targets + params + open questions)  
2. **`prospect-list.html`** preview  
3. Optional **CSV** when >25 rows  

## Hard rules

No invented emails · no Hot without signal · no scrape mass · verify when tools exist.

## Vertical metadata

- **Related:** `cold-email`, `product-marketing`, `customer-research`, `revops`, `sales-enablement`, `competitor-profiling`  
- **Upstream:** [marketingskills/prospecting](https://github.com/coreyhaines31/marketingskills/tree/main/skills/prospecting)  

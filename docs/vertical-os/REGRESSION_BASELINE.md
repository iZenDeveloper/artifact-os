# Content Pro regression baseline

**Standard:** Content Pro **v2.2** (craft + strategy + ready-to-post + MVP scope)  
**Skill:** `content-repurposer`  
**Pass rule:** calibrated overall **≥ 9.0** on fixed briefs; all three niches ship; **polish gates P1–P3** pass  

**Suite definition:** `skills/content-repurposer/references/regression-suite.md`  
**Pre-ship checklist:** `skills/content-repurposer/references/pre-ship-qa.md`  
**Latest run artifacts:** `docs/vertical-os/regression-runs/2026-07-17/`

---

## Latest scored run · 2026-07-17 (post polish freeze)

| # | Brief id | Niche | Brand | Craft | Marketing | Verdict | Peak / lab notes |
|---|----------|-------|-------|-------|-----------|---------|------------------|
| 1 | `reg-business-pmf-fail` | Business | personal-minimal | **9.15** | 9.1 | **Ship** | Peak: CRM Open 120 / Paid **0** freeze |
| 2 | `reg-science-10pct-myth` | Science | personal-bold | **9.2** | 9.1 | **Ship** | Peak: full-brain map + red X on “10%” |
| 3 | `reg-personal-brand-consistency` | Personal Brand | personal-minimal | **9.15** | 9.1 | **Ship** | Hook lab **4 pairs**; peak: search autocomplete |

### Aggregate

| Metric | Value |
|--------|-------|
| Mean craft | **9.17** |
| Min craft | **9.15** |
| Ship rate | **3/3 (100%)** |
| Fail rate | **0%** |
| Consistency (max − min) | **0.05** |
| Structural lint | **3/3 OK** |

### vs prior freeze (pre polish-hard-gate encode)

| Metric | Prior (2026-07-17 morning) | This re-run |
|--------|----------------------------|-------------|
| Mean | 9.08 | **9.17** |
| Min | 9.05 | **9.15** |
| Personal-brand residual | Hook lab light | **Closed** (4 pairs, parity bar) |
| Peak residual | Science slightly generic | **Closed** (named non-substitutable shots) |

---

## Freeze decision

| Layer | Status |
|-------|--------|
| Craft ≥ 9.0 all niches | **Hold** |
| Polish P1–P3 | **Hold** — enforced in skill + passed this run |
| MVP no video render | **Hold** |
| Brand §8 | **Hold** |

Re-run suite after major skill edits. Update this table + drop new folder under `regression-runs/YYYY-MM-DD/`.

---

## How to re-run

```text
1. content-repurposer + brands per brief (regression-suite.md)
2. Write index.html under docs/vertical-os/regression-runs/<date>/<brief-id>/
3. pnpm exec tsx scripts/lint-content-repurposer-pack.ts <path>
4. pre-ship-qa.md · score cards · update this file
```

---

## Historical note

First freeze scores (Business 9.1 / Science 9.1 / Personal 9.05, mean 9.08) remain valid as pre-harden reference; **this file’s headline numbers are the latest re-run**.

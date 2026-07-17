# Vertical Index

Registry of Vertical Content OS extensions on top of Open Design.

## Marketing (MVP — active)

> Strategy source of truth: [MARKETING_VERTICAL.md](./MARKETING_VERTICAL.md)

| Kind | ID | Path | Notes |
|------|----|------|-------|
| Design System | personal-minimal | `design-systems/personal-minimal/` | Calm personal brand |
| Design System | personal-bold | `design-systems/personal-bold/` | High-energy creator |
| Design System | professional-clean | `design-systems/professional-clean/` | Client / B2B safe |
| Skill | content-repurposer | `skills/content-repurposer/` | **Priority #1** · Content Pro **v2.2** · MVP: **text + visual direction + script** (no video render) |
| Skill | hook-engine | `skills/hook-engine/` | **Hooks-only lab** · weak→strong · multi-surface primaries |
| Skill | social-content-factory | `skills/social-content-factory/` | Batch original · **Content Pro v2.2** (strategy + ready-to-post) |
| Skill | ad-variants-generator | `skills/ad-variants-generator/` | Paid matrix · **Content Pro v2.2** |
| Standard | Content Pro v2.1/v2.2 | `skills/content-repurposer/references/content-pro-standards.md` | Personal stakes, peak drama, no middle sag, calibrated scores |
| Regression | Baseline suite | `docs/vertical-os/REGRESSION_BASELINE.md` + `skills/content-repurposer/references/regression-suite.md` | **3/3 ship · mean 9.08** · polish P1–P3 **blocking** · lint: `scripts/lint-content-repurposer-pack.ts` |
| UI | Brand Switcher | `DesignSystemPicker` + `runtime/vertical-brand.ts` | Personal / Client / All tabs + quick chips + badge |
| UI | Platform Preview | FileViewer viewport presets `xhs` / `tiktok` / `linkedin` | Content Pro canvas frames in artifact preview |
| Skill (upstream) | card-xiaohongshu | `skills/card-xiaohongshu/` | Keep; XHS native cards |
| Skill (upstream) | ad-creative | `skills/ad-creative/` | Catalogue / related (Home Ad chip → ad-variants-generator) |
| Plugin pack | marketing-vertical-pack | `plugins/community/marketing-vertical-pack/` | **Installable bundle** · skills + 3 brands · sync script |

### Recommended combos

| Use case | Design System | Skill |
|----------|---------------|-------|
| Personal long-form → multi-platform | personal-minimal | content-repurposer |
| Stop-scroll lines only (cover / 0–3s / subjects) | personal-bold or personal-minimal | hook-engine |
| Creator short-form batch | personal-bold | social-content-factory |
| Agency client LinkedIn pack | professional-clean | content-repurposer |
| Paid tests | professional-clean or personal-bold | ad-variants-generator (+ hook-engine for headlines) |

## Education (planned)

| Kind | ID | Status |
|------|----|--------|
| Skills | lesson-deck, course-landing, educational-carousel, … | Roadmap Giai đoạn 3 |
| Design Systems | academic, modern-training, k12 | Not started |

## Legal (planned)

| Kind | ID | Status |
|------|----|--------|
| Skills | contract-summary, legal-deck, compliance-report, … | Roadmap Giai đoạn 4 |
| Design Systems | legal-professional | Not started |
| Requirement | Human-in-the-loop review UI | Not started |

## Gateway (planned)

OmniRoute integration — see `ARCHITECTURE.md` § Gateway Layer. Not in foundation branch scope.

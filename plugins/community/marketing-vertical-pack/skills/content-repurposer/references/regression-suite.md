# Content Pro regression suite — fixed briefs

**Skill:** `content-repurposer`  
**Pass:** calibrated overall **≥ 9.0** on **all three** briefs · ship 3/3  
**Baseline:** `docs/vertical-os/REGRESSION_BASELINE.md` (mean 9.08 · min 9.05)

Run this suite after **any** material edit to SKILL.md or content-pro-standards.

---

## How to run (agent)

For **each** brief below, one full pack (`index.html`):

1. Brand: use suggested brand (or active Brand if user set one — still obey §8).  
2. Language: **vi** unless brief says EN.  
3. MVP scope: text + visual direction + script — **no video render**.  
4. Fill strategy (objective/funnel/persona/offer) with labeled assumptions if needed.  
5. Self-score **hostile** (−0.3 optimism).  
6. Record: overall craft · marketing · residual issues.  

**Suite fails** if any brief &lt; 9.0 calibrated overall **or** any hard polish gate fails (below).

---

## Brief 1 — Business · Startup PMF Fail

| Field | Value |
|-------|--------|
| **id** | `reg-business-pmf-fail` |
| **Niche** | Business |
| **Brand** | `personal-minimal` or `professional-clean` |
| **Source gist** | Startup có product “đẹp” nhưng không chốt PMF: traffic/content activity cao, pipeline ảo, founder kiệt sức. |
| **objective** | authority / awareness |
| **funnel** | consideration |
| **persona** | Founder B2B SaaS 0–1, SEA/VN |
| **offer** | Keyword + checklist “5 dấu hiệu fake PMF” hoặc office-hour script |

**Must prove:**
- Hook không phải “5 tips for founders”  
- Personal stakes = **time / pipeline / reputation** (không chỉ “thị trường khó”)  
- TikTok peak frame **cụ thể** (1 shot không thay bằng stock “startup office”)  
- Hook lab ≥ 3 pairs, primary punch ngang science pack  

**Known residual to kill:** caption dài sau CTA → trim.

---

## Brief 2 — Science · “Không 10%” Myth

| Field | Value |
|-------|--------|
| **id** | `reg-science-10pct-myth` |
| **Niche** | Science |
| **Brand** | `personal-minimal` or `personal-bold` |
| **Source gist** | Myth phổ biến dạng “chỉ dùng 10% não” / myth số học tương tự — **bẻ myth bằng proof**, không dang tay hype. |
| **objective** | awareness / authority |
| **funnel** | awareness |
| **persona** | Người tò mò khoa học / creator giáo dục |
| **offer** | Keyword + “3 myth khoa học tiếp” series hoặc 1-pager proof |

**Must prove:**
- Flat-hook ban (không “X thú vị”)  
- Personal bill: **bạn / body / decision** early (không chỉ spectacle não)  
- Peak frame **non-substitutable** (không “illustrative brain stock”)  
- Proof honest — no fake %  

**Known residual to kill:** peak frame generic → name 1 iconic designed shot.

---

## Brief 3 — Personal Brand · Nhất quán

| Field | Value |
|-------|--------|
| **id** | `reg-personal-brand-consistency` |
| **Niche** | Personal Brand |
| **Brand** | `personal-minimal` (default) or `personal-bold` if short-form-first |
| **Source gist** | Creator post “đủ hay” nhưng không nhất quán brand: feed loang lổ, hook yếu, không nhớ được 1 câu. Metaphor “lớp sơn” / identity. |
| **objective** | authority / engagement |
| **funnel** | awareness → consideration |
| **persona** | Personal brand / solopreneur content |
| **offer** | Keyword + “khung 1 tuần nhất quán” checklist |

**Must prove:**
- **Hook lab parity** with business/science (not “light” lab)  
- Peak idea filmable (e.g. search autocomplete brand name) — named shot  
- Voice §8 Personal Minimal: clean ≠ weak  
- Ready-to-post complete all platforms  

**Known residual to kill:** weak hook lab vs other niches.

---

## Hard polish gates (from residual backlog — now **blocking**)

These used to be “minor”; they are **ship blockers** for regression and flagship packs:

### P1 — Caption length

- After primary CTA/offer line: **max 2 short lines** of support (or none).  
- XHS/TikTok caption: cut filler adjectives; no second soft “follow for more” after keyword offer.  
- LinkedIn: stay **900–1600** prefer; hard fail if lecture middle + &gt;2200.

### P2 — Peak frame specificity

- Peak section must name **one** shot that:
  - has a unique prop/action/UI state, **and**
  - would look wrong if swapped into another pack’s topic  
- Ban phrases alone: “cinematic B-roll”, “stock talking head”, “illustrative chart”, “epic montage”.  
- Write: subject + action + camera + freeze moment.

### P3 — Hook lab parity (all niches)

- ≥ **3** weak→strong pairs  
- Each strong line would stop-scroll alone  
- Personal-brand packs **same punch bar** as business/science  
- Mark exactly **one** primary; primary must be used on XHS C1 **or** TikTok 0–3s  

### P4 — MVP scope (always)

- TikTok = script + visual_direction + peak_frame · `rendered_video: false`  
- No MP4 claim  

### P5 — Brand voice

- DESIGN.md §8 ban list not violated  
- Tone-by-context matches beat  

---

## Score card template (paste into pack HTML)

```
Regression brief id: reg-…
Niche: …
Brand: …
Craft (calibrated): x.x / 10
Marketing: x.x / 10
Polish gates: P1 caption [ ] P2 peak [ ] P3 hook lab [ ] P4 scope [ ] P5 voice [ ]
Ship: yes/no
One line stranger remembers: "…"
Residual: …
```

---

## Suite rollup

| Brief id | Craft | Ship? | Residual |
|----------|-------|-------|----------|
| reg-business-pmf-fail | | | |
| reg-science-10pct-myth | | | |
| reg-personal-brand-consistency | | | |

**Mean / min / ship rate** → update `docs/vertical-os/REGRESSION_BASELINE.md` after a full re-run.

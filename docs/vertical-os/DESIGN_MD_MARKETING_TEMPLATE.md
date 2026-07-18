# DESIGN.md template — Marketing Vertical Brand

Copy into `design-systems/<brand-slug>/DESIGN.md`.

Open Design requires **9 numbered sections** (`## 1.` … `## 9.`).  
Marketing Vertical adds a **Brand Overview** block (before §1) and a **detailed §8 Voice & Tone**.

Do not remove the numbered headings — the schema parser keys on `## [digit].`.

---

```markdown
# <Brand Display Name>

> Category: Artifact OS · Personal Brand   <!-- or: Client Brand -->
> <One-line picker summary: who it’s for + primary jobs.>

## Brand Overview

| Field | Value |
|-------|--------|
| **Slug** | `<brand-slug>` |
| **Mode** | Personal \| Client |
| **Audience** | … |
| **Jobs** | (channels / formats) |
| **Promise** | … |

**When to pick:** …  
**When not:** …  

---

## 1. Visual Theme & Atmosphere

…

## 2. Color Palette & Roles

### Surfaces
### Text
### Brand & Status
**Usage rules:** …

## 3. Typography Rules

### Font Family
### Hierarchy
| Role | Size | Weight | Line height | Notes |

## 4. Spacing & Grid

## 5. Layout & Composition

## 6. Components

## 7. Motion & Interaction

## 8. Voice & Tone

> **Agent rule:** Before writing hooks/captions/CTAs, re-read this entire §8.

### 8.1 Brand Voice (giọng cốt lõi)

| Field | Value |
|-------|--------|
| **Tính cách** | … |
| **3 từ khóa** | … · … · … |
| **Không nên dùng** | … |

**Personality in one line:** …

### 8.2 Tone by Context

| Ngữ cảnh | Tone nên dùng | Ví dụ câu (VI) | Example (EN) |
|----------|---------------|----------------|--------------|
| Hero / Cover hook |  |  |  |
| Giải thích vấn đề |  |  |  |
| Social proof |  |  |  |
| CTA / Offer |  |  |  |
| Educational |  |  |  |
| Casual / BTS |  |  |  |

### 8.3 Writing Principles

| Principle | Rule |
|-----------|------|
| Độ dài câu |  |
| Từ vựng |  |
| Xưng hô |  |
| Emoji |  |
| Dấu câu |  |
| Storytelling |  |
| Hooks | Flat fact cấm / … |
| Ngôn ngữ | vi / en / mix |

### 8.4 Do’s and Don’ts (Voice)

**Nên làm:**
- 
- 

**Không nên làm:**
- 
- 

### 8.5 Example Sentences

1. …
2. …
3. …
4. …
5. …
6. …
7. …
8. …

### 8.6 Brand × Content Pro

- How drama / personal stakes / ethics apply under this brand.

## 9. Anti-patterns

### Visual
- 

### Voice
- 

### Cross-brand
- 
```

## Checklist before shipping a brand

- [ ] 9 numbered sections present  
- [ ] Brand Overview filled  
- [ ] §8.1–8.5 complete (not one-line tone)  
- [ ] ≥5 example sentences  
- [ ] Anti-patterns cover **visual + voice**  
- [ ] Distinct from personal-minimal / personal-bold / professional-clean  
- [ ] Run `pnpm exec tsx scripts/sync-marketing-vertical-pack.ts` if pack should ship the brand  

## Reference brands

| Slug | Role |
|------|------|
| `personal-minimal` | Calm personal authority |
| `personal-bold` | High-energy creator |
| `professional-clean` | Client / B2B |

See also: [BRANDS.md](./BRANDS.md) · `skills/content-repurposer/references/brand-voice.md`

---
title: Author lesson 3.2 Point Estimation (Ước lượng điểm)
status: done
created: 2026-08-01T10:30:00+07:00
updated: 2026-08-01T11:20:00+07:00
author: hienlong
task: "Author the missing point-estimation lesson (3.2 Ước lượng điểm) as a 4-page Vietnamese MDX lesson and publish it in the statistics TOC"
supersedes: []
---

# Goal

Author `point-estimation` — the currently missing 3.2 node in the
`descriptive-statistics-estimation` track — as a 4-page Vietnamese lesson that
bridges 3.1 (descriptive stats) to 3.3 (sampling distributions & standard
errors) and to Chapter 4 (confidence intervals & hypothesis tests). Flip the
node's `contentStatus` from `missing` to `published` and update the locked
catalog/MDX test counts.

# Lineage

Continues the Phase 3 content work from
[2026-07-31-pure-applied-statistics-curriculum.md](./2026-07-31-pure-applied-statistics-curriculum.md)
(sixteen missing nodes; this is the first estimation lesson authored). Follows
the established 4-page, 2-column (tính tay | chạy code) pattern from
[2026-08-01-descriptive-stats-4page-redesign.md](./2026-08-01-descriptive-stats-4page-redesign.md)
and the Vietnamese-first, KaTeX, allowlist-only MDX contract.

# Decisions (locked)

1. **4 pages** mirroring 3.1: parameters vs estimators → unbiasedness & sample
   variance (n−1) → proportion & MLE → estimator quality (MSE) + bridge to 3.3.
2. **No embedded quiz** — track 3 has no adjacent Quiz node (unlike Chapter 1)
   and 3.1 carries none; quiz-question ids would have to match `pageCount`.
3. **Dataset continuity** — reuse the 10-request latency set from 3.1
   (μ/x̄, s²) plus one manufacturing proportion example (p̂ = k/n) so proportion
   estimation is not stranded.
4. **Deterministic Python** — `np.random.default_rng(seed)` for the repeated-
   sampling illustration; all outputs hardcoded as ` ```output ` blocks.
5. **No new React visuals** — reuse existing components only
   (`MdxFormula`, `MdxTable`, `MdxColumns`, `LessonNote`, `div`, code blocks).
6. **Catalog seed** becomes `status: 'available'`, `contentStatus: 'published'`
   with the same en/vi titles; locked counts in tests and wiki updated.

# Proposed Changes

## [NEW] src/content/learning/statistics/3.2-point-estimation.vi.mdx

`lessonMetadata`: id `point-estimation`, locale `vi`, title `3.2 Ước lượng điểm`
(must equal the catalog title), `pageCount: 4`, headings, keywords.

- **Page 0 — Tham số và ước lượng điểm**: parameter (μ, σ², p) vs statistic
  (x̄, s², p̂) vs point estimate; notation table; why a single number is
  convenient but uncertain (bridge to 3.3/4.1). Reuses the 3.1 latency dataset.
- **Page 1 — Ước lượng không chệch: trung bình và phương sai mẫu**: E[x̄] = μ
  via a seeded repeated-sampling simulation; sample variance with n−1 (Bessel
  correction) worked by hand and with `np.var(data, ddof=1)`; comparison table
  ddof=0 vs ddof=1 against the known population σ².
- **Page 2 — Ước lượng tỉ lệ và hợp lý cực đại (MLE)**: p̂ = k/n worked on a
  40-part manufacturing example; hand-computed likelihood table L(θ) for
  θ = k/n; note that MLE for normal gives x̄ and the biased σ̂² = Σ/n, tying
  back to Page 1's n−1.
- **Page 3 — Đánh giá chất lượng ước lượng + cầu nối 3.3**: MSE = bias² +
  variance; consistency and efficiency; estimator comparison table (x̄, median)
  on the latency data; closing summary table of estimators covered; teaser
  that repeated sampling creates the sampling distribution of x̄ with standard
  error σ/√n (next lesson).

## [MODIFY] src/content/learning/statistics/table-of-contents.ts

Replace

```ts
missingLesson('point-estimation', '3.2 Point Estimation', '3.2 Ước lượng điểm'),
```

with a published seed (`status: 'available'`, `contentStatus: 'published'`,
same titles) so track 3 shows 3.1, 3.2, 3.3 (missing), 3.4.

## [MODIFY] src/lib/learningCatalog.test.ts

- L55 `{ available: 166, next: 1, locked: 552 }` → `{ available: 167, next: 1, locked: 551 }`
- L57 published `168` → `169`
- L58 missing `551` → `550`
- L179 missingLessons.length `551` → `550`
- L186 statistics published `102` → `103`

## [MODIFY] src/lib/learningMdxContent.test.ts

- L133 lessonFiles.length `168` → `169`
- L138 statistics vi `102` → `103`
- L145 documents.length `168` → `169`
- L147 statisticsDocuments.length `102` → `103`
- statisticsPageCount `343` → `347`
- retained statistics published `102` → `103`

## [MODIFY] wiki/concepts/learning-lab.md

- statistics published lessons `101` → `102`, ordered lesson pages `339` → `347`
  (corrects the stale page count), missing nodes `sixteen` → `fifteen`, total
  authored locale MDX `167` → `168`.

# Verification Plan

- `npm run verify` (catalog tests, MDX validation against the catalog, search
  documents, typecheck).
- `npm test` focused: `learningCatalog.test.ts`, `learningMdxContent.test.ts`.
- `git diff --check`.

# Execution Log

- 2026-08-01 — Plan stored and approved.
- 2026-08-01 — Created `src/content/learning/statistics/3.2-point-estimation.vi.mdx`
  (4 pages, Vietnamese, KaTeX, `MdxColumns` tính tay | chạy code, deterministic
  seeded NumPy simulations, latency-dataset continuity + 40-part proportion
  example, MSE/consistency/efficiency summary and 3.3 bridge).
- 2026-08-01 — Published the `point-estimation` seed in
  `table-of-contents.ts` (status `available`, contentStatus `published`).
- 2026-08-01 — Updated locked counts: `learningCatalog.test.ts`
  (available 167, locked 551, published 169, missing 550, statistics 103) and
  `learningMdxContent.test.ts` (files 169, statistics vi 103, page count 347).
- 2026-08-01 — Updated `wiki/concepts/learning-lab.md` (168 authored files,
  102 statistics lessons, 347 ordered pages, fifteen missing nodes).
- 2026-08-01 — `npm run typecheck` clean; `npm test` 77/77 pass; `npm run build`
  emits `3.2-point-estimation.vi-*.js` as its own lazy chunk; `git diff --check` clean.
- 2026-08-01 — LaTeX pass: all inline prose symbols (μ, σ², x̄, p̂, ≈, n − 1, …)
  converted to `<MdxFormula inline>` KaTeX; headings and `MdxTable` cells stay
  text (table cells render as plain strings — no KaTeX); removed precomposed
  Vietnamese dot-below glyphs (ộ/ệ) from `\text{}` labels (KaTeX lacks metrics)
  and restored `np.var(...)` mentions as inline code. Re-verified: 35 unique
  KaTeX strings parse with 0 strict-mode warnings, 0 English-prose hits,
  `npm run typecheck` clean, `npm test` 77/77.

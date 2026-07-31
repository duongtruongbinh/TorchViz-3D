---
title: LaTeX symbols inside MdxTable cells (point-estimation tables)
status: done
created: 2026-08-01T02:30:00+07:00
updated: 2026-08-01T03:05:00+07:00
author: nmkhiem
task: "Render LaTeX inside MdxTable cells/headers and convert the 3.2 lesson tables so every symbol in the lesson is LaTeX"
supersedes:
  - docs/plans/2026-08-01-statistics-point-estimation-lesson.md
---

# Goal

Finish the LaTeX pass for lesson 3.2: symbols currently stuck as Unicode text
in `MdxTable` cells (μ, σ², x̄, p̂, Σxᵢ/n, p³(1−p)³⁷, ×10⁻⁵ …) should be
rendered as KaTeX. Because `MdxTable` renders cells as plain strings, add a
small rich-text renderer to the shared `MdxTable` component that KaTeX-renders
`$...$` segments (same pattern `QuizBlock.renderInlineCode` already uses), then
rewrite the 3.2 tables with `$...$` math.

# Lineage

Follow-up to
[2026-08-01-statistics-point-estimation-lesson.md](./2026-08-01-statistics-point-estimation-lesson.md)
(authored + published 3.2 with all prose/block math in LaTeX; tables were the
remaining exception).

# Decisions (locked)

1. **Rich cells in `MdxTable`** — add a local `renderRichText` helper in
   `src/components/learning/learningMdxComponents.tsx` using the exact split
   regex from `QuizBlock.renderInlineCode`
   (`/(\$[^$\n]+\$|`[^`]+`|“[^”]+”)/g`): `$...$` → KaTeX inline, backticks and
   “quotes” → `<code>`, everything else unchanged. Apply to caption, headers,
   and cells.
2. **Purely additive** — verified only `3.1-descriptive-data-analysis.vi.mdx`
   and `3.2-point-estimation.vi.mdx` use `MdxTable` and neither contains a raw
   `$` today, so no existing cell changes appearance.
3. **No QuizBlock coupling** — keep the helper local to `learningMdxComponents.tsx`;
   do not import from `QuizBlock.tsx`.
4. **`$...$` content counts as prose for the English-word test** — the test
   strips only code fences and backticks, so table math must not contain banned
   words (`the/and/of/to/in/is/are/that/for/with/from/we/this/which/using/data/observations`).
   Symbols and formulas are safe.
5. **KaTeX strict check** — every new `$...$` segment must parse under
   `throwOnError: true`; avoid precomposed Vietnamese glyphs KaTeX lacks
   metrics for (ộ/ệ), and keep the existing `\text{bias}^2`/`\text{variance}`
   MSE labels as-is.

# Phases

## Phase 0 — Store this plan
Write `docs/plans/2026-08-01-statistics-mdx-table-latex.md`; get approval.

## Phase 1 — Component: `MdxTable` rich cells
- `src/components/learning/learningMdxComponents.tsx`: add `renderRichText`
  (KaTeX + code + quotes), use it for `caption`, `headers`, and `cell` rendering
  in `MdxTable`.
- Behavior identical when a string contains no `$`, backticks, or curly quotes.

## Phase 2 — Content: 3.2 tables to LaTeX
- `src/content/learning/statistics/3.2-point-estimation.vi.mdx`:
  - Table 1 (Ba đại lượng): μ, σ², p / x̄, s², p̂ → `$...$`.
  - Table 2 (Hàm hợp lý): header `L(p) = p³(1−p)³⁷`, values `≈ 1.9 × 10⁻⁵`
    etc., `0.075 (= 3/40)` → `$...$`.
  - Table 3 (outlier): `x̄ (trung bình)` header → `$...$`.
  - Summary table: μ, σ², x̄, s², p, p̂, σ̂², Σxᵢ/n, Σ(xᵢ−x̄)²/(n−1), k/n → `$...$`.
- No metadata, headings, or `pageCount` changes.

## Phase 3 — Verify
- `npm run typecheck`
- `npm test` (77/77, includes MDX contract validation)
- KaTeX strict parse of every `$...$` segment in 3.2 (scratch script, removed
  afterwards)
- English-prose word check on 3.2 (0 hits)
- `npm run build` emits the lesson chunk; `git diff --check`

# Out of scope

- Refactoring `QuizBlock` or other renderers.
- Changing `MdxConceptContrast` or other table-like primitives.
- Converting 3.1 tables (no symbols currently; additive support only).
- Any catalog, count, or route changes.

# Execution log

- 2026-08-01 — Plan drafted and approved.
- 2026-08-01 — Phase 1: added `renderRichText` to
  `src/components/learning/learningMdxComponents.tsx` (same split regex as
  `QuizBlock.renderInlineCode`: `$...$` → KaTeX, backticks/curly quotes →
  `<code>`); `MdxTable` now renders caption, headers, and cells through it.
  Purely additive — no existing lesson contains `$` in tables.
- 2026-08-01 — Phase 2: converted all three 3.2 tables to `$...$` math
  (notation table, likelihood table, variance-divisor table, outlier table,
  summary table); also wrapped remaining prose `n − 1`/`≈` symbols in
  `MdxFormula` (headings kept text-only).
- 2026-08-01 — Phase 3: 23 unique `$...$` segments parse under KaTeX
  `throwOnError: true` with 0 strict-mode warnings; 0 English-prose hits;
  `npm run typecheck` clean; `npm test` 77/77; `npm run build` succeeds;
  `git diff --check` clean.
- 2026-08-01 — Docs: `wiki/concepts/learning-lab.md` now notes that
  `MdxTable` cells/headers render `$...$` inline math.

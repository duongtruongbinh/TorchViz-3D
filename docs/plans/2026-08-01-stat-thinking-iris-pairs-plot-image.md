---
title: Add Iris Pairs Plot Image to Lesson 2.1 Descriptive Statistics Page
status: done
created: 2026-08-01T16:20:00+07:00
updated: 2026-08-01T16:35:00+07:00
author: pi
task: "Thêm ảnh Iris Pairs Plot (Wikimedia Commons) vào lesson 2.1 (ch02-classical-statistics-fundamentals), trang 'Thống kê Mô tả & Kỹ thuật Trực quan', sau danh sách các kỹ thuật trực quan."
supersedes: []
---

# Goal

Add the classic Iris pairs plot (matrix of scatter diagrams over the four Iris
measurements, colored by species) as an illustrated example of scatter-diagram
visualization on page 4 of lesson 2.1
(`2.0-ch02-classical-statistics-fundamentals.vi.mdx`), whose heading is exactly
"Thống kê Mô tả (Descriptive Statistics) & Kỹ thuật Trực quan". The lesson's
quiz already uses the Iris dataset (`ch02-classical-statistics-fundamentals-quiz`),
so the image reinforces the chapter's running example.

# Lineage

Genesis plan — no predecessor. Content-only addition following the established
statistics source-image pattern (`ProbabilitySourceImage`) used by Chapter 1.

# Decisions (locked)

- Source image: `https://upload.wikimedia.org/wikipedia/commons/2/2c/Iris_Pairs_Plot.svg`
  (Wikimedia Commons, Inkscape-generated pairs plot of the Iris dataset). Caption
  source label: "Wikipedia".
- Asset location (runtime lesson media, per wiki/concepts/learning-lab.md):
  `src/assets/learning/statistics/ch02-statistical-thinking/01-statistics-iris-pairs-plot.svg`.
- Registration: add the import and a `iris-pairs-plot` entry to the
  `probabilitySourceImages` map in
  `src/components/learning/domains/statistics/mdxComponents.tsx`.
  `ProbabilitySourceImage` is already in `STATISTICS_MDX_COMPONENT_NAMES`, so the
  shared/domain MDX allowlist needs no change and the MDX validation script
  accepts the component as-is.
- Placement in MDX: on page 4, directly after the bulleted list of visualization
  techniques (which ends with "Biểu đồ tán xạ (Scatter diagrams)"), as the
  concrete illustration of a scatter-plot matrix. Rendered with
  `<ProbabilitySourceImage asset="iris-pairs-plot" alt="..." source="Wikipedia" />`
  with a Vietnamese alt text describing the pairs plot.
- No catalog, TOC, metadata, pageCount, or heading changes. No new component —
  reuse the existing source-image renderer.

# Implementation steps

1. Copy the downloaded SVG into
   `src/assets/learning/statistics/ch02-statistical-thinking/01-statistics-iris-pairs-plot.svg`.
2. In `src/components/learning/domains/statistics/mdxComponents.tsx`:
   - add `import irisPairsPlot from '../../../../assets/learning/statistics/ch02-statistical-thinking/01-statistics-iris-pairs-plot.svg';`
   - add `'iris-pairs-plot': irisPairsPlot,` to `probabilitySourceImages`.
3. In `2.0-ch02-classical-statistics-fundamentals.vi.mdx` page 4, after the
   "Biểu đồ tán xạ (Scatter diagrams)" bullet, add:
   `<ProbabilitySourceImage asset="iris-pairs-plot" alt="Ma trận biểu đồ tán xạ (pairs plot) của bộ dữ liệu Iris: so sánh từng cặp bốn đặc trưng đo đạc, mỗi chấm được tô màu theo loài hoa." source="Wikipedia" />`
4. Run `npm run verify` (typecheck + tests + production build).

# Verification

- `npm run verify` passes.
- The image renders on page 4 of lesson 2.1 with the "Nguồn: Wikipedia" caption
  and no allowlist/validation rejection.

# Execution log

- Downloaded the Wikimedia SVG to
  `src/assets/learning/statistics/ch02-statistical-thinking/01-statistics-iris-pairs-plot.svg`
  (457 KB, valid SVG, 644.89×629.33 viewBox).
- Added `import irisPairsPlotIllustration` and the `iris-pairs-plot` entry to
  `probabilitySourceImages` in `src/components/learning/domains/statistics/mdxComponents.tsx`.
- Inserted `<ProbabilitySourceImage asset="iris-pairs-plot" … source="Wikipedia" />`
  on page 4 of `2.0-ch02-classical-statistics-fundamentals.vi.mdx` right after
  the "Biểu đồ tán xạ (Scatter diagrams)" bullet.
- `npm run verify` passes (typecheck + tests + production build); the SVG is
  emitted as `dist/assets/01-statistics-iris-pairs-plot-*.svg`. Chunk-size
  warnings are pre-existing and unrelated.
- No catalog, TOC, pageCount, heading, or allowlist changes; no wiki/log.md
  update needed (content-only addition, existing pattern already documented).

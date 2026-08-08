---
title: Replace Variability Explanation with AI/ML/DL Applications on Statistical Thinking Page 0
status: done
created: 2026-08-01T14:47:00+07:00
updated: 2026-08-01T15:48:00+07:00
author: pi
task: "On lesson 2.1 (Tư duy thống kê, dữ liệu và suy luận), replace the variability explanation on page 0 with applications (general + AI/ML/DL + comparison), then promote the applications to their own dedicated page and shift the population/sample page to follow it."
supersedes: []
---

# Goal

On page 0 of `src/content/learning/statistics/2.0-ch02-classical-statistics-fundamentals.vi.mdx`,
keep the "Mục tiêu cốt lõi" `LessonNote` about statistics and variability, delete the
explanatory paragraph that follows it ("Trong các hệ thống kỹ thuật và tự nhiên … độ biến
động này."), and replace it with a concise Vietnamese list of applications of statistical
thinking in AI, Machine Learning (Học máy) and Deep Learning (Học sâu).

The applications section then moves to its own dedicated page (page 1) with a new `##`
heading; the current page 1 (Quần thể/Mẫu & Thu thập Dữ liệu) shifts to page 2, and the
remaining pages shift accordingly, growing the lesson from four to five pages.

# Lineage

Genesis plan — no predecessor. Direct follow-up to the Statistical Thinking lesson
authored under
[2026-07-31-statistical-thinking-interactions](./2026-07-31-statistical-thinking-interactions.md);
content-only, no renderer, catalog, or structure changes.

# Decisions (locked)

- Lesson restructure to five pages, in order: page 0 "Thống kê là gì & Sự biến động"
  (definition, core-value note, `statistical-thinking-variation` visual); page 1 NEW
  applications page with its own `##` heading; page 2 "Quần thể, Mẫu & Thu thập Dữ liệu"
  (was page 1, keeps its two visuals); page 3 "Thống kê Mô tả" (was page 2); page 4
  "Suy luận Thống kê" (was page 3).
- Metadata: `pageCount` 4 → 5; `headings` gains the new page heading. Lesson identity,
  locale (`vi`), title, keywords, and page content all preserved except re-indexing.
- New page heading text: "Ứng dụng của Thống kê & AI/ML/DL" — used both as the `##`
  heading in the MDX and as the matching entry in the `headings` metadata array.
- Test updates are required and in scope: `src/lib/learningMdxContent.test.ts`
  `statisticsPageCount` 357 → 358 and the `ch02-classical-statistics-fundamentals`
  `metadata.pageCount` assertion 4 → 5. All other locked counts (file counts 170/104,
  quiz page counts) are unchanged.
- Replacement is a plain bullet list (not a `LessonNote`) with bold Vietnamese lead-ins,
  matching the lesson's existing inline style. All learner-facing copy stays Vietnamese.
- Content structure (two groups + comparison):
  1. **Ứng dụng chung (general applications)** — engineering/quality control (SPC, DOE),
     medicine/clinical trials, business/economics (forecasting, risk), social science
     surveys — each showing variability + sample-to-population reasoning.
  2. **Ứng dụng trong AI/ML/DL** — ML generalization/overfitting-as-noise; DL techniques
     (batch normalization, data augmentation, dropout) and generative models learning
     data distributions; model evaluation via confidence intervals, hypothesis testing,
     cross-validation.
  3. **Điểm chung & khác biệt (comparison)** — both share the same statistical core
     (variability, sampling, inference); the difference is scale/complexity of data and
     the degree of automation, not the underlying principles.
- Follow-up refinement (2026-08-01): make each application bullet concrete with named
  real-world examples instead of abstract categories — e.g. SPC tracking pill-diameter
  variation in pharma production, phase-III vaccine trials, credit scoring, opinion-poll
  to census extrapolation, spam-filter training, credit-card fraud detection, CNN face
  recognition, GPT token-probability prediction, GAN/Stable Diffusion image generation,
  A/B testing of recommender systems, X-ray model accuracy confidence intervals.
- No new dependencies, components, tests, or wiki changes; no English MDX.

# Phases

## Phase 0 — Approve this stored plan

- 2026-08-01T15:02:00+07:00 — Requester approved the applications content in
  conversation ("go"); later directives "a separated page, population and sample to
  another page" (2026-08-01T15:35:00+07:00) restructure the lesson to five pages.

## Phase 1 — Restructure lesson MDX to five pages

- Page 0 keeps the definition, core-value `LessonNote`, and variation visual; remove the
  applications block from it.
- Insert new `<MdxPage page={1}>` with `## Ứng dụng của Thống kê & AI/ML/DL` followed by
  the applications content (general + AI/ML/DL + comparison).
- Re-index remaining pages: population/sample → page 2, descriptive statistics → page 3,
  inference → page 4. Update `pageCount` to 5 and add the new heading to `headings`.
- Keep the visual invocation at the end of the page.

## Phase 2 — Update regression assertions

- `src/lib/learningMdxContent.test.ts`: `statisticsPageCount` 357 → 358 and the
  Statistical Thinking lesson `metadata.pageCount` 4 → 5.

## Phase 3 — Verify

- Run `npm run verify` (includes typecheck, tests, MDX page/count assertions) and
  `git diff --check`.
- Confirm the lesson now has five ordered pages (indexes 0–4), pageCount 5, and its
  Vietnamese-only locale contract.

# Out of scope

- Changes to pages 3–4 content, metadata title/keywords, TOC, catalog counts other than
  the Statistics page total, `localization.ts`, wiki, or the Statistics MDX
  adapter/renderers.

# Execution log

- 2026-08-01T15:48:00+07:00 — Restructured the lesson from four to five pages per the requester's directive: page 0 keeps the definition, core-value note, and `statistical-thinking-variation` visual; new page 1 "Ứng dụng của Thống kê & AI/ML/DL" hosts the applications content (general + AI/ML/DL + comparison); pages 2–4 re-indexed to population/sample (visuals intact), descriptive statistics, and inference. Metadata `pageCount` 4→5 and `headings` gained the new page heading. Updated `src/lib/learningMdxContent.test.ts` (statisticsPageCount 357→358, lesson pageCount 4→5). `npm run typecheck`, `npm test` (77 pass), `npm run verify` (build), and `git diff --check` all pass.
- 2026-08-01T17:10:00+07:00 — Follow-up: page 1 content (applications) distilled per [2026-08-01-stat-thinking-distill-applications-questions](./2026-08-01-stat-thinking-distill-applications-questions.md).
- 2026-08-01T15:28:00+07:00 — Refined the two application bullet lists on page 0 with concrete, named examples per the follow-up request: general applications now cite SPC on pill-diameter/steel-thickness, DOE for chip-process optimization, phase-III vaccine trials vs placebo, smoking–lung-cancer epidemiology, bank credit scoring, insurance pricing from loss distributions, retail seasonality forecasting, and opinion polls extrapolating to tens of millions of voters; AI/ML/DL now cites spam-filter training on labeled email, credit-card fraud detection, overfitting-as-memorized-noise, CNN face recognition/self-driving cars, GPT next-token probability, GAN/Stable Diffusion image generation, Netflix-style A/B testing, X-ray model accuracy confidence intervals, and hyperparameter cross-validation. Comparison paragraph and visual untouched. `npm test` (77 pass) and `git diff --check` passed; page count remains 4.
- 2026-08-01T15:12:00+07:00 — Deleted the variability explanation paragraph from page 0 of `2.0-ch02-classical-statistics-fundamentals.vi.mdx` and replaced it with the approved three-part Vietnamese content: general applications (SPC/DOE, clinical trials, business/economics, social science), AI/ML/DL applications (overfitting-as-noise, batch norm/data augmentation/dropout, generative models, model evaluation), and a shared-core/scale-difference comparison. Core-value `LessonNote` and `statistical-thinking-variation` visual retained; pages 2–3 and metadata untouched. `npm run verify` (typecheck, 77 tests, build) and `git diff --check` passed; page count remains 4.
- 2026-08-01T15:02:00+07:00 — Requester approved the revised plan in conversation ("go"); content expanded to include general applications plus an AI/ML/DL comparison.
- 2026-08-01T14:47:00+07:00 — Plan created (draft).

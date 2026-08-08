---
title: Add Research & Business Questions Page to Statistical Thinking Lesson
status: done
created: 2026-08-01T16:05:00+07:00
updated: 2026-08-01T16:30:00+07:00
author: pi
task: "In lesson 2.1 (Tư duy thống kê, dữ liệu và suy luận), add the requester's 43 research/business questions (7 domains) as a dedicated page 2 right after the AI/ML/DL applications page, with a question→method→chapter map."
supersedes: []
---

# Goal

Add a new dedicated page to
`src/content/learning/statistics/2.0-ch02-classical-statistics-fundamentals.vi.mdx`
titled "Câu hỏi nghiên cứu & kinh doanh", placed immediately after the existing
page 1 "Ứng dụng của Thống kê & AI/ML/DL". The page lists the requester's
research/business questions grouped into 7 domain subsections (`###`), then
closes with a `LessonNote` mapping each domain to the statistical methods and
chapters that answer those questions. The lesson grows from 5 to 6 pages.

# Lineage

Direct follow-up to
[2026-08-01-stat-thinking-page0-ai-ml-dl-applications](./2026-08-01-stat-thinking-page0-ai-ml-dl-applications.md),
which created the applications page 1. Content-only addition; no renderer,
catalog, TOC, or localization changes. The requester supplied the 43 questions
verbatim in the prompt; this plan only reorganizes them by domain and adds the
method map.

# Decisions (locked)

- New page order (6 pages): page 0 "Thống kê là gì & Sự biến động" (unchanged);
  page 1 "Ứng dụng của Thống kê & AI/ML/DL" (unchanged); page 2 NEW "Câu hỏi
  nghiên cứu & kinh doanh"; page 3 "Quần thể, Mẫu & Thu thập Dữ liệu" (was 2);
  page 4 "Thống kê Mô tả" (was 3); page 5 "Suy luận Thống kê" (was 4).
- Page heading text: "Câu hỏi nghiên cứu & kinh doanh" — used both as the `##`
  heading in the MDX and as the matching entry in the `headings` metadata array.
- Question content: the requester's questions are kept verbatim, organized into
  7 `###` subsections matching their grouping: Kỹ thuật & sản xuất (6), Y khoa &
  sinh học (6), Kinh doanh & kinh tế (6), Khoa học xã hội (6), Học máy (6),
  Học sâu (6), Đánh giá mô hình (7) — 43 questions total. Each is a plain `-`
  bullet, matching the lesson's existing inline style. All learner-facing copy
  stays Vietnamese.
- Method map: a single `LessonNote` labeled "Bản đồ câu hỏi → phương pháp →
  chương" at the end of the page, one compact bullet per domain referencing the
  current TOC chapters: Chương 2 (Tư duy thống kê), Chương 3 (Mô tả & Ước
  lượng), Chương 4 (Suy luận thống kê), Chương 5 (Hồi quy), Chương 6 (Thiết kế
  thí nghiệm), Chương 7 (Kiểm soát chất lượng), Mở rộng (Học thống kê). Some
  referenced lessons in ch. 6/7 are still planned (missing) in the TOC; the map
  is forward-looking by design.
- Metadata: `pageCount` 5 → 6; `headings` gains the new page heading. Lesson
  identity, locale (`vi`), title, keywords, and all existing page content
  preserved except re-indexing.
- Test updates required: `src/lib/learningMdxContent.test.ts` —
  `statisticsPageCount` 358 → 359; `ch02-classical-statistics-fundamentals`
  `metadata.pageCount` 5 → 6. All other locked counts (file counts 170/104,
  quiz page counts) unchanged.
- No new dependencies, components, tests, wiki changes, or English MDX.

# Phases

## Phase 0 — Approval checkpoint

- 2026-08-01T16:05:00+07:00 — Requester approved the approach in conversation
  ("proceed") after the proposal was laid out (dedicated page 2 + group-level
  LessonNote method map). Plan stored with `status: approved`.

## Phase 1 — Insert the new page into the lesson MDX

- Add the new `<MdxPage page={2}>` block between the end of the applications
  page and the current population/sample page, containing the `##` heading,
  a one-line intro, 7 `###` domain subsections with the verbatim questions,
  and the closing `LessonNote` method map.
- Re-index: population/sample page 2 → 3, descriptive statistics page 3 → 4,
  inference page 4 → 5.
- Update metadata: `pageCount` 5 → 6; append "Câu hỏi nghiên cứu & kinh doanh"
  to `headings` (after the applications heading).

## Phase 2 — Update regression assertions

- `src/lib/learningMdxContent.test.ts`: `statisticsPageCount` 358 → 359 and the
  Statistical Thinking lesson `metadata.pageCount` 5 → 6.

## Phase 3 — Verify

- Run `npm run verify` (typecheck, tests, MDX page/count assertions, build) and
  `git diff --check`.
- Confirm the lesson has six ordered pages (indexes 0–5), `pageCount` 6, the
  new heading in `headings`, and its Vietnamese-only locale contract intact.

# Out of scope

- Changes to pages 0–1 and 3–5 content, metadata title/keywords, TOC, catalog
  counts other than the Statistics page total, `localization.ts`, wiki, or the
  Statistics MDX adapter/renderers. Converting the questions into `MdxQuiz`
  items or per-question method annotations is explicitly out of scope.

# Execution log

- 2026-08-01T16:30:00+07:00 — Added the new page 2 "Câu hỏi nghiên cứu & kinh doanh" to `2.0-ch02-classical-statistics-fundamentals.vi.mdx` between the applications page (1) and the population/sample page: 7 `###` domain subsections with the requester's 43 verbatim questions (Kỹ thuật & sản xuất 6, Y khoa & sinh học 6, Kinh doanh & kinh tế 6, Khoa học xã hội 6, Học máy 6, Học sâu 6, Đánh giá mô hình 7) plus a closing `LessonNote` "Bản đồ câu hỏi → phương pháp → chương" mapping each domain to its methods and TOC chapters. Re-indexed the remaining pages 2→3, 3→4, 4→5; metadata `pageCount` 5→6 and `headings` gained "Câu hỏi nghiên cứu & kinh doanh". Updated `src/lib/learningMdxContent.test.ts` (statisticsPageCount 358→359, lesson pageCount 5→6). `npm run verify` (typecheck, 77 tests, build) and `git diff --check` pass.
- 2026-08-01T17:10:00+07:00 — Follow-up: page 2 questions distilled (43 → 15 grouped bullets, method-map `LessonNote` kept verbatim) per [2026-08-01-stat-thinking-distill-applications-questions](./2026-08-01-stat-thinking-distill-applications-questions.md).

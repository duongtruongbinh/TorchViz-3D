---
title: Distill the Applications and Research/Business Questions Pages
status: done
created: 2026-08-01T16:57:00+07:00
updated: 2026-08-01T17:15:00+07:00
author: pi
task: "In lesson 2.1 (Tư duy thống kê, dữ liệu và suy luận), replace the content of page 1 'Ứng dụng của Thống kê & AI/ML/DL' and page 2 'Câu hỏi nghiên cứu & kinh doanh' with the requester-approved distilled versions."
supersedes:
  - docs/plans/2026-08-01-stat-thinking-page0-ai-ml-dl-applications.md
  - docs/plans/2026-08-01-stat-thinking-research-business-questions.md
---

# Goal

Replace, in
`src/content/learning/statistics/2.0-ch02-classical-statistics-fundamentals.vi.mdx`,
the body content of page 1 ("Ứng dụng của Thống kê & AI/ML/DL") and page 2
("Câu hỏi nghiên cứu & kinh doanh") with the distilled versions the requester
approved in conversation ("thay thế"). This builds on the earlier work that
authored both pages; it does not change the lesson's structure, metadata, or any
other page.

# Lineage

Continues the work of
[2026-08-01-stat-thinking-page0-ai-ml-dl-applications](./2026-08-01-stat-thinking-page0-ai-ml-dl-applications.md)
(authored page 1) and
[2026-08-01-stat-thinking-research-business-questions](./2026-08-01-stat-thinking-research-business-questions.md)
(authored page 2). The requester asked to distill both sections, then confirmed
the distilled versions should **replace** the existing content. Content-only
change; no renderer, catalog, TOC, localization, test, or structure changes.

# Decisions (locked)

- **Scope:** only the body content of `<MdxPage page={1}>` and `<MdxPage
  page={2}>` in the lesson MDX is replaced. Pages 0 and 3–5, the two
  `ProbabilityChapterVisual` invocations, lesson metadata (`pageCount` 6,
  `headings`, title, keywords), page indexes, and `MdxPage` boundaries are
  untouched.
- **Page 1 distillation:** keep the existing three-part structure (general
  applications → AI/ML/DL applications → `LessonNote` "Điểm chung & khác biệt")
  and every named example (SPC/DOE, vaccine pha III, dịch tễ học, tín dụng/bảo
  hiểm/dự báo, thăm dò bầu cử, spam filter, gian lận thẻ, overfitting-as-noise,
  CNN/xe tự lái, GPT token, GAN/Stable Diffusion, A/B testing, X-quang CI,
  cross-validation), but condense each bullet to its core claim. The comparison
  `LessonNote` is tightened, not removed.
- **Page 2 distillation:** the 43 verbatim questions are condensed into 15
  grouped bullets across the same 7 `###` domain subsections — each domain keeps
  its full coverage (no question is dropped from the essence, only merged into
  combined phrasings). The closing `LessonNote` "Bản đồ câu hỏi → phương pháp →
  chương" is kept **verbatim** (already distilled; it is the page's reference
  map).
- **Style:** plain `-` bullets with bold Vietnamese lead-ins, matching the
  lesson's inline style. **No markdown tables** — the MDX pipeline does not
  enable GFM (no `remark-gfm`; no existing lesson uses pipe tables), so the
  distilled content stays bullet-based.
- **Learner-facing copy stays Vietnamese** (English technical terms such as
  SPC/DOE/CNN/GPT/A/B testing/overfitting/cross-validation are kept as-is, as in
  the current content). The Vietnamese-only regression check (`commonEnglishWord
  Count < 20` on prose) still passes easily.
- **Tests:** no assertion changes. `statisticsPageCount` 362, lesson
  `pageCount` 6, `headings`, and the two visual-kind matches are all unaffected
  because page count, headings, and pages 0/3–5 are unchanged.
- **Docs:** no new docs page. The two predecessor plans get a one-line
  execution-log pointer to this plan so the decision chain stays walkable.

# Phases

## Phase 0 — Approval checkpoint

- Store this plan; wait for explicit requester approval before editing the MDX.

## Phase 1 — Replace page 1 content (distilled)

- Rewrite the body between `## Ứng dụng của Thống kê & AI/ML/DL` and the page-2
  boundary: intro line + 4 general-application bullets + 3 AI/ML/DL bullets +
  tightened `LessonNote` "Điểm chung & khác biệt".

## Phase 2 — Replace page 2 content (distilled)

- Rewrite the body between `## Câu hỏi nghiên cứu & kinh doanh` and the page-3
  boundary: intro line + 7 `###` domain subsections with 15 condensed bullets
  total + verbatim `LessonNote` "Bản đồ câu hỏi → phương pháp → chương".

## Phase 3 — Record modifications

- Append one-line execution-log entries to the two predecessor plans pointing to
  this plan; append this plan's execution log.

## Phase 4 — Verify

- `npm run verify` (typecheck, tests incl. MDX page/count/visual assertions,
  build) and `git diff --check`.
- Confirm lesson still has 6 ordered pages (indexes 0–5), `pageCount` 6, both
  `##` headings unchanged, both visuals still present, and the Vietnamese-only
  prose check passes.

# Out of scope

- Changes to pages 0 and 3–5, metadata, `MdxPage` boundaries/indexes, the quiz
  lesson, TOC, catalog counts, `localization.ts`, wiki, tests, or the Statistics
  MDX adapter/renderers. Converting questions back to verbatim lists, adding
  tables, or introducing new components is explicitly out of scope.

# Execution log

- 2026-08-01T17:15:00+07:00 — Replaced page 1 and page 2 content in `2.0-ch02-classical-statistics-fundamentals.vi.mdx` with the distilled versions. Page 1: kept the 3-part structure (general → AI/ML/DL → comparison `LessonNote`) and all named examples, condensed each bullet to its core claim (~640 → ~330 words). Page 2: condensed the 43 verbatim questions into 15 grouped bullets across the same 7 `###` subsections (~1050 → ~600 words); the "Bản đồ câu hỏi → phương pháp → chương" `LessonNote` kept verbatim. Structure/metadata untouched (6 pages, headings, visuals). Added follow-up pointer entries to both predecessor plans. `npm run verify` (typecheck, 77 tests, build) and `git diff --check` pass.
- 2026-08-01T16:57:00+07:00 — Plan created (draft); requester confirmed the
  distilled content should replace the existing page content ("thay thế").

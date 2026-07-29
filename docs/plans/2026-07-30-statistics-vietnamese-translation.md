---
title: Statistics Vietnamese Translation
status: completed
created: 2026-07-30T00:05:33+07:00
updated: 2026-07-30T03:02:00+07:00
author: Codex
task: "translate the complete 90-lesson Statistics Learning Lab domain into Vietnamese while preserving established English technical terms where useful"
supersedes:
  - docs/plans/2026-07-29-statistics-import-artifact-cleanup.md
---

# Goal

Publish a complete Vietnamese locale for the canonical Statistics domain:
90 `.vi.mdx` lessons, 265 ordered pages, and Vietnamese domain/track/lesson
catalog copy.

Success means Vietnamese app mode opens Vietnamese-authored content for every
Statistics lesson without falling back to English, while English content,
canonical ids, routes, code, formulas, page order, and runtime behavior remain
unchanged.

# Lineage

Supersedes
[Statistics Import Artifact Cleanup](./2026-07-29-statistics-import-artifact-cleanup.md).
That plan made the checked-in English TOC and MDX the canonical source of truth.
This phase adds paired Vietnamese authored files without restoring the removed
import source or generator.

# Context Read

- `src/content/learning/statistics/` contains 90 English MDX files, 13,360
  lines and about 1.5 MB of authored source; it currently contains no Vietnamese
  MDX.
- The 90 lessons contain 265 contiguous `MdxPage` surfaces plus shared
  `MdxCode` blocks for code, output, and Markdown tables.
- Statistics TOC Vietnamese fields currently duplicate English fields and the
  domain declares `fallbackLocales: ['en']`.
- Catalog validation requires each Vietnamese `lessonMetadata.title` to exactly
  match its Vietnamese TOC lesson title.
- Existing MDX parity tests assume one locale per published lesson and must be
  generalized for paired English/Vietnamese Statistics files.
- A local `qwen2.5:1.5b` translation sample was rejected because it mistranslated
  core statistical terms even with a forced glossary. It will not be used as
  the authored translation.

# Translation Policy (Locked)

## What Is Translated

- Translate domain, track, lesson, page, subsection, figure-caption, prose,
  list, exercise-instruction, explanatory table-cell, and metadata copy.
- Set every Vietnamese file's `lessonMetadata.locale` to `vi`; translate
  `title`, `headings`, and useful search `keywords`.
- Preserve the original argument, examples, qualifications, and ordering. Do
  not summarize or omit passages merely because they are repetitive or
  extraction-heavy.
- Correct obvious word-break/OCR fragments only when the intended English
  sentence is unambiguous. Do not invent missing equations or figures.

## What Is Preserved

- Keep filenames, `domainId`, canonical lesson ids, page indexes, page counts,
  MDX component names, component structure, and structural props unchanged.
- Keep Python/code/input/output blocks, API names, package/module names,
  dataset and column identifiers, file paths, URLs, math variables, symbols,
  equation numbers, and inline-code spans unchanged.
- For `MdxCode language="table"`, translate human-readable headers and prose
  cells while preserving the table delimiters, numeric data, identifiers, and
  shape.
- Keep citations, author names, book/package names, and standard abbreviations
  such as MSE, RSS, PCA, SVM, ROC, FDR, CNN, and RNN.

## Terminology

Use natural Vietnamese prose, but retain an established English term in
parentheses on first useful introduction or when Vietnamese-only wording would
be ambiguous. Later occurrences should use the concise Vietnamese or standard
English form consistently.

Core glossary:

| English | Preferred Vietnamese |
|---|---|
| statistical learning | học thống kê |
| supervised / unsupervised learning | học có giám sát / học không giám sát |
| predictor / input variable / feature | biến dự báo / biến đầu vào / đặc trưng |
| response / output variable | biến đáp ứng / biến đầu ra |
| independent / dependent variable | biến độc lập / biến phụ thuộc |
| prediction / inference | dự đoán / suy luận |
| regression / classification | hồi quy / phân loại |
| training / test data | dữ liệu huấn luyện / kiểm tra |
| fit / fitted value | khớp mô hình / giá trị khớp |
| coefficient / estimate | hệ số / ước lượng |
| residual / error term | phần dư / sai số |
| bias / variance | độ chệch / phương sai |
| overfitting / underfitting | quá khớp / thiếu khớp |
| cross-validation | xác thực chéo |
| resampling | lấy mẫu lại |
| bootstrap | bootstrap |
| regularization / shrinkage | điều chuẩn / co rút |
| decision tree | cây quyết định |
| bagging / boosting | bagging / boosting |
| support vector machine | máy vector hỗ trợ (SVM) |
| principal component analysis | phân tích thành phần chính (PCA) |
| clustering | phân cụm |
| survival analysis | phân tích sống còn |
| censoring | kiểm duyệt |
| hypothesis testing | kiểm định giả thuyết |
| false discovery rate | tỷ lệ phát hiện sai (FDR) |
| neural network / deep learning | mạng nơ-ron / học sâu |

# Execution Strategy

- Translate by chapter batches, using the English files as immutable sources.
- Use the primary Codex-quality translation path. Do not accept bulk output from
  the rejected local 1.5B model.
- Parallel chapter ownership may be used only if the requester explicitly
  authorizes sub-agents. Each worker must follow this plan, edit disjoint
  chapters, and validate its own files before handoff.
- Review each batch for terminology, untranslated prose, accidental structural
  changes, and English/VI title parity before moving on.
- Do not add a persistent translation script or restore a source-reference
  file. The paired MDX files are the durable output.

# Phases

## Phase 0 - Approval and Staffing

- Store this plan as the task's first write.
- Obtain explicit approval and, separately within the same requester signal,
  authorization for parallel sub-agent translation if desired.

## Phase 1 - Locale Contract and Test Preparation

- Generalize MDX parity assertions to allow multiple locales per published
  lesson.
- Add exact Statistics gates for 90 English + 90 Vietnamese files, 265 pages
  per locale, paired lesson ids, metadata/title parity, and structural page
  parity.
- Add checks that executable code blocks and protected structural tokens do not
  drift between locale pairs.

## Phase 2 - Translate TOC

- Translate the Statistics domain description, all 13 track
  titles/descriptions, and all 90 lesson titles.
- Keep English catalog fields byte-identical and retain English fallback as a
  resilience path.

## Phase 3 - Translate 13 Chapter Batches

1. Chapter 1: 9 lessons.
2. Chapter 2: 4 lessons.
3. Chapter 3: 7 lessons.
4. Chapter 4: 8 lessons.
5. Chapter 5: 4 lessons.
6. Chapter 6: 6 lessons.
7. Chapter 7: 9 lessons.
8. Chapter 8: 4 lessons.
9. Chapter 9: 7 lessons.
10. Chapter 10: 10 lessons.
11. Chapter 11: 9 lessons.
12. Chapter 12: 6 lessons.
13. Chapter 13: 7 lessons.

After each batch, run the generic MDX validator and locale-pair structural
checks.

## Phase 4 - Language Quality Audit

- Search all Vietnamese MDX for untranslated instructional paragraphs and
  English metadata copied unchanged.
- Audit glossary consistency, Vietnamese punctuation, figure captions, tables,
  and exercise wording.
- Inspect the largest lab/exercise lessons separately.

## Phase 5 - Documentation and Verification

- Update `wiki/concepts/learning-lab.md` with the complete Vietnamese locale and
  new authored-file totals.
- Record actual modifications and any translation exceptions in this plan.
- Run `npm run verify`, `git diff --check`, and direct 90/90/265 locale audits.

# Acceptance Criteria

- Exactly 90 `.en.mdx` and 90 `.vi.mdx` Statistics files exist.
- Both locales contain the same 90 canonical lesson ids and 265 pages.
- All Vietnamese TOC and metadata titles agree, and Vietnamese UI resolves
  `.vi.mdx` before English fallback.
- All instructional prose is Vietnamese; retained English is limited to the
  terminology and protected material defined above.
- English MDX, ids, routes, code, formulas, and page/component structure do not
  regress.
- All tests, typecheck, build, and whitespace checks pass.

# Out of Scope

- Reconstructing equations, figures, or source passages absent from the
  canonical English MDX.
- Rewriting or summarizing the English curriculum.
- Adding Statistics-specific React visuals, quizzes, or exercises.
- Reintroducing the removed ISLP reference/import scripts.
- Translating unrelated Learning Lab domains.

# Execution Log

- 2026-07-30T00:05:33+07:00 - Audited the complete Statistics locale, TOC,
  validator, and paired-locale test impact. Rejected the locally installed
  1.5B model after it mistranslated core terminology. Stored this draft plan as
  the task's first write.
- 2026-07-30T00:08:16+07:00 - Requester explicitly approved the stored plan
  and parallel sub-agent translation.
- 2026-07-30T00:08:17+07:00 - Approval recorded and execution started.
- 2026-07-30T02:18:00+07:00 - Generalized the locale-aware MDX inspection
  and tests to require 90 English plus 90 Vietnamese Statistics documents,
  265 pages per locale, paired ids, title parity, stable page/code structure,
  protected inline identifiers, and a Vietnamese-prose audit. Translated the
  complete Statistics domain, track, and lesson catalog copy.
- 2026-07-30T02:18:00+07:00 - Completed the primary-agent batches for Chapter
  1, Chapter 12, exercises 4.8 and 6.6, and lab 6.5. Parallel batches completed
  or entered final validation for Chapters 2, 3, 5, 7, 8, 9, 10, and 11.
  Preserved source OCR formula fragments where the canonical English MDX lacks
  recoverable equations, as required by the translation policy.
- 2026-07-30T02:18:00+07:00 - Updated the Learning Lab concept page to
  distinguish 143 canonical authored lessons from 233 locale MDX files and to
  document direct Vietnamese resolution for the bilingual Statistics domain.
- 2026-07-30T03:02:00+07:00 - Completed all 90 Vietnamese lesson sources and
  the 265-page locale. Translated explanatory table cells where they are
  authored prose while retaining literal notebook outputs. Retained English
  only for protected code/API/dataset identifiers, established technical
  terms, citations and titles, the quoted English IMDB review sample, and
  unrecoverable OCR fragments embedded in the canonical formula text.
- 2026-07-30T03:02:00+07:00 - Final audits confirmed exactly 90 English and 90
  Vietnamese Statistics files, 265 pages in each locale, no page/non-table-code
  structural mismatch, no protected prose-inline-code mismatch, and no
  Vietnamese file at or above the untranslated-prose heuristic threshold.
  `node src/lib/learningMdxContent.test.ts` passed 11/11; `npm run verify`
  passed typecheck, all 77 repository tests, and the production build;
  `git diff --check` passed.

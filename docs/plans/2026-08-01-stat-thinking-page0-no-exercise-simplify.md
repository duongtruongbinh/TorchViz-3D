---
title: Remove the Page-0 Exercise and Simplify Statistical Thinking Page 0
status: approved
created: 2026-08-01T16:05:00+07:00
updated: 2026-08-01T16:10:00+07:00
author: pi
task: "On lesson 2.1 (Tư duy thống kê, dữ liệu và suy luận), page 0: remove the interactive exercise (ProbabilityChapterVisual kind='statistical-thinking-variation') and make the remaining content more straightforward."
supersedes: []
---

# Goal

On page 0 of `src/content/learning/statistics/2.0-ch02-classical-statistics-fundamentals.vi.mdx`,
remove the interactive exercise widget (the "Cùng trung bình, khác độ ổn định" answer-button
visual rendered by `<ProbabilityChapterVisual kind="statistical-thinking-variation" />`) and
rewrite the page's remaining prose to be more straightforward: shorter sentences, a clearer
definition, and a plain-text (non-interactive) version of the variability point the exercise
used to demonstrate.

# Lineage

Follow-up to [2026-08-01-stat-thinking-page0-ai-ml-dl-applications](./2026-08-01-stat-thinking-page0-ai-ml-dl-applications.md),
which kept the variation visual on page 0. Content-only; no renderer, catalog, metadata, or
locale changes.

# Decisions (locked)

- Page 0 keeps its `##` heading "Thống kê là gì & Sự biến động (Variability)", the definition
  paragraph, and the "Mục tiêu cốt lõi" `LessonNote`. The `<ProbabilityChapterVisual
  kind="statistical-thinking-variation" />` invocation is deleted (line 42).
- Definition is rewritten for clarity — same meaning, explicit four-stage structure
  (thu thập, trình bày, phân tích, sử dụng dữ liệu), no stacked subordinate clauses.
- LessonNote is tightened and gains one plain-prose example (two bottling lines, same 500 ml
  mean, different spread) that preserves the exercise's teaching point without any buttons,
  answer states, or feedback.
- `src/lib/learningMdxContent.test.ts` line 209: expected visual kinds for this lesson drop
  `'statistical-thinking-variation'`, leaving
  `['statistical-thinking-sampling', 'statistical-thinking-study-design']` (both still present
  on page 3).
- No changes to: `metadata` (pageCount stays 6, headings/keywords/title unchanged), pages 1–5,
  the quiz lesson, the catalog, `localization.ts`, wiki, or
  `src/components/learning/domains/statistics/mdxComponents.tsx`
  (`StatisticalThinkingVariationVisual` stays wired to its other kinds and may be reused).

# Proposed page 0 content (after change)

```
## Thống kê là gì & Sự biến động (Variability)

**Thống kê (Statistics)** là khoa học về dữ liệu, gồm bốn công đoạn: **thu thập, trình bày,
phân tích và sử dụng dữ liệu** để giải quyết bài toán, thiết kế sản phẩm và đưa ra quyết
định dựa trên bằng chứng thực nghiệm.

<LessonNote label="Mục tiêu cốt lõi">

Thống kê giúp ta đưa ra **quyết định khách quan** dựa trên dữ liệu, dù dữ liệu luôn có
**sự biến động (variability)** — yếu tố tự nhiên tồn tại trong mọi hệ thống vật lý và bài
toán kỹ thuật thực tế. Ví dụ: hai dây chuyền sản xuất có thể cùng trung bình 500 ml nhưng
khác độ phân tán; dây chuyền dao động hẹp hơn sẽ ít tạo ra sản phẩm lệch mục tiêu hơn.

</LessonNote>
```

# Phases

## Phase 0 — Approve this stored plan

- 2026-08-01T16:10:00+07:00 — Requester approved in conversation ("go").

## Phase 1 — Edit lesson MDX page 0

- Remove the `<ProbabilityChapterVisual kind="statistical-thinking-variation" />` line.
- Replace the definition and LessonNote text with the proposed straightforward wording above.

## Phase 2 — Update regression assertions

- `src/lib/learningMdxContent.test.ts` line 209: drop `'statistical-thinking-variation'`
  from the expected `ProbabilityChapterVisual` kinds for
  `ch02-classical-statistics-fundamentals`.

## Phase 3 — Verify

- Run `npm run verify` (typecheck, tests incl. MDX page/count assertions, build) and
  `git diff --check`.
- Confirm page 0 renders definition + note only, lesson pageCount stays 6, and the
  Vietnamese-only locale contract still passes.

# Out of scope

- Pages 1–5 content, metadata title/keywords/headings, `pageCount`, TOC/catalog counts, the
  separate quiz lesson, `localization.ts`, wiki, and the Statistics MDX component renderers.

# Execution log

- 2026-08-01T16:15:00+07:00 — Removed `<ProbabilityChapterVisual kind="statistical-thinking-variation" />` from page 0 of `2.0-ch02-classical-statistics-fundamentals.vi.mdx`; rewrote the definition paragraph (explicit four-stage structure) and the "Mục tiêu cốt lõi" note (shortened, plus a plain-prose two-production-lines example replacing the interactive widget's teaching point). Updated `src/lib/learningMdxContent.test.ts` line 209 to expect only `statistical-thinking-sampling` and `statistical-thinking-study-design` (both still on page 3). `npm run verify` (typecheck, 77 tests pass, build) and `git diff --check` passed; lesson `pageCount` remains 6; no metadata, catalog, renderer, or other-page changes.
- 2026-08-01T16:10:00+07:00 — Requester approved in conversation ("go").
- 2026-08-01T16:05:00+07:00 — Plan created (draft).

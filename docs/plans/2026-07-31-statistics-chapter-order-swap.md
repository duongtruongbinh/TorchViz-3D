---
title: Statistics TOC Chapter Order — Probability First
status: done
created: 2026-07-31T23:30:00+07:00
updated: 2026-07-31T23:45:00+07:00
author: nmkhiem
task: "Reorder Statistics Learning Lab TOC so Chapter 1 is Probability and Chapter 2 is Statistical Thinking; keep chapters 3–7 and Extensions unchanged"
supersedes:
  - docs/plans/2026-07-31-pure-applied-statistics-curriculum.md
---

# Goal

Restore the learner-facing chapter order for the `statistics` domain to:

1. **Probability** (Xác suất) — existing `probability` track and `ch01-*` lessons
2. **Statistical Thinking / Statistics intro** (Thống kê) — existing `statistical-thinking` track
3. Descriptive Statistics and Point Estimation *(unchanged)*
4. Statistical Inference *(unchanged)*
5. Regression Analysis *(unchanged)*
6. Design of Experiments *(unchanged)*
7. Statistical Quality Control *(unchanged)*
8. Extensions: Statistical Learning *(unchanged)*

Success means the catalog presents Probability as the first core track, Statistical
Thinking as the second, display numbers match that order (`1.x` / `2.x`), MDX
`lessonMetadata.title` values agree with the TOC, docs/wiki reflect the order,
and catalog/MDX tests plus `npm run verify` pass.

# Lineage

Adjusts the exported chapter order introduced by
[Pure Applied Statistics Curriculum Integration](./2026-07-31-pure-applied-statistics-curriculum.md),
which placed Statistical Thinking first and renumbered Probability to Chapter 2.
This plan does **not** abandon the seven-chapter pure-applied spine or the
extensions boundary; it only swaps the first two core tracks and renumbers
their display titles.

Related content plans that stay valid except for chapter numbers:

- [Statistics Probability Chapter](./2026-07-30-statistics-probability-chapter.md)
- [Foundational Classical Statistics Lesson](./2026-07-31-statistics-foundational-unit.md)
- [Statistical Thinking Interactions](./2026-07-31-statistical-thinking-interactions.md)
- [Statistical Thinking Pandas Quiz](./2026-07-31-statistics-statistical-thinking-pandas-quiz.md)

# Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Scope | **Option 1 only**: swap Ch.1 ↔ Ch.2 | Requester confirmed; no merge of descriptive/estimation into Ch.2 |
| Chapters 3–7 + Extensions | Keep track ids, titles (`3.`–`7.`, Extensions), lesson membership, and missing placeholders | Out of scope for this reorder |
| Canonical lesson/track ids | Unchanged (`probability`, `statistical-thinking`, `ch01-*`, `ch02-classical-statistics-fundamentals*`) | Avoids route churn; only display order and numbers change |
| Probability chapter title | Restore Chapter **1** numbering; prefer source-facing **1. Probability / 1. Xác suất** (drop the temporary `2. Probability and Random Variables` renumber). Keep the longer description text about RVs/distributions if already present, or restore the shorter source description — either is fine as long as the number is **1** | Matches requester “chương 1 xác suất” and `sourceChapters` |
| Statistical Thinking chapter title | **2. Introduction to Statistical Thinking / 2. Nhập môn tư duy thống kê**; lesson **2.1** (+ Quiz) | Was 1 / 1.1 under the pure-applied export |
| Probability lesson numbers | Restore **1.1–1.9** in TOC export and in the nine theory MDX `lessonMetadata.title` values (currently `2.1`–`2.9`) | Display consistency; file names stay `1.x-ch01-…` |
| Route aliases | Keep existing aliases; no new aliases required for this swap | Track/lesson ids do not move |
| Content bodies | No rewrite of lesson prose, visuals, or quizzes | Numbers and order only |
| Domain id / product name | Keep `statistics` and display **Probability & Statistics / Xác suất & Thống kê** | Unrelated to chapter order |

# Current vs target (export only)

| Position | Current export | Target export |
|---|---|---|
| 1 | `statistical-thinking` — 1. Introduction… | `probability` — 1. Probability / 1. Xác suất |
| 2 | `probability` — 2. Probability… (lessons renumbered 2.x) | `statistical-thinking` — 2. Introduction… (lessons 2.1 + Quiz) |
| 3–7 | descriptive… quality-control | same |
| 8 | statistical-learning-extensions | same |

`sourceChapters` already stores Probability as chapter 1 and classical stats under
`statistical-learning`; only the remapped `chapters` export and retitling logic
need to change.

# Phases

## Phase 0 — Approval

- Requester approves this stored plan.
- On approval: set `status: approved`, bump `updated`, then execute.

## Phase 1 — TOC reorder and renumber

Edit `src/content/learning/statistics/table-of-contents.ts`:

1. Put the `probability` track **first** in the `chapters` array.
2. Stop renumbering probability lessons from `1.n` → `2.n`. Prefer exporting
   `getChapter('probability')` / `getLessons('probability')` so source titles
   `1.1`–`1.9` remain, or keep a thin wrapper that only sets chapter title/description
   to Chapter 1 without rewriting lesson numbers.
3. Place `statistical-thinking` **second** with titles:
   - Chapter: `2. Introduction to Statistical Thinking` / `2. Nhập môn tư duy thống kê`
   - Lesson: `2.1 Statistical Thinking, Data, and Inference` / `2.1 Tư duy thống kê, dữ liệu và suy luận`
   - Quiz node unchanged (`Quiz` / published).
4. Leave chapters 3–7, Extensions, `routeAliases`, domain text, and helpers intact
   unless a tiny alias cleanup is forced by tests (none expected).

## Phase 2 — Align MDX metadata titles

1. Nine probability theory files: change `lessonMetadata.title` from `2.n …` back to
   `1.n …` (Vietnamese strings already correct except the leading number).
2. `2.0-ch02-classical-statistics-fundamentals.vi.mdx`: change title from
   `1.1 Tư duy thống kê…` to `2.1 Tư duy thống kê…`.
3. Quiz MDX titles stay `Quiz` if already so.
4. Do not rename files or lesson ids.

## Phase 3 — Docs / wiki

Update the Statistics section of `wiki/concepts/learning-lab.md` so the listed
core track order starts with probability, then statistical thinking, then
chapters 3–7. Fix any sentence that currently says Probability is “Chapter 2”
or that Statistical Thinking is “Chapter 1” / “first” in a way that contradicts
the new order (including the pandas quiz “Chapter 1 closes…” wording → Chapter 2).

Do not create a new docs page.

## Phase 4 — Verify and record

1. Run focused catalog/MDX tests if convenient, then `npm run verify`.
2. `git diff --check`.
3. Append an execution log to this plan with exact files touched; set `status: done`.

# Out of scope

- Merging descriptive statistics / estimation into Chapter 2.
- Renumbering chapters 3–7 or Extensions.
- Authoring the sixteen missing pure-applied lessons.
- Changing lesson ids, file names, domain id, or Learning Lab runtime.
- Restoring English Statistics MDX.
- Moving Statistical Thinking content back under `statistical-learning` as a
  source-chapter membership change (export-only placement is enough).

# Execution log

- 2026-07-31 — Drafted from requester choice “1” (swap only). No non-plan files
  modified yet.
- 2026-07-31 — Executed the swap of Chapter 1 (Probability) and Chapter 2 (Statistical Thinking). Verified and built successfully.
  Modified files:
  - `src/content/learning/statistics/table-of-contents.ts`
  - `src/content/learning/statistics/2.0-ch02-classical-statistics-fundamentals.vi.mdx`
  - `src/lib/learningCatalog.test.ts`
  - `wiki/concepts/learning-lab.md`
  - `docs/plans/2026-07-31-statistics-chapter-order-swap.md`

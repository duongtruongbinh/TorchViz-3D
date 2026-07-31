---
title: Pandas Statistical Thinking Quiz over Iris (Chapter 1)
status: done
created: 2026-07-31T21:05:00+07:00
updated: 2026-07-31T21:45:00+07:00
author: Codex
task: "add a pandas-based interactive quiz applying Introduction to Statistical Thinking concepts over the Iris dataset as the second node of the Statistics chapter 1 track"
supersedes:
  - docs/plans/2026-07-31-statistical-thinking-interactions.md
  - docs/plans/2026-07-31-statistics-foundational-unit.md
---

# Goal

Add one canonical quiz lesson to the Statistics `statistical-thinking` track
("1. Introduction to Statistical Thinking") that applies the chapter's taught
concepts — variability, sample versus population, descriptive statistics, and
statistical inference — through pandas operations on the **Iris** dataset (the
canonical machine-learning hello-world data: 150 flowers, 4 continuous
measurements in cm, 3 species × 50).

Success means:

- a new published lesson node titled `Quiz` (en/vi) directly after
  `1.1 Statistical Thinking, Data, and Inference` in the `statistical-thinking`
  track, following the Probability chapter's adjacent-Quiz convention
  (dimmed question icon, no visible number, not `exercise`-tagged);
- six quiz questions, one per page (enforced by the MDX validator:
  `quizQuestionIds.length === pageCount`), each pairing a real pandas
  expression with deterministic Iris data/facts and chapter-specific
  feedback;
- quiz prompts render pandas snippets (inline code) and, where it adds
  context, a compact read-only Iris dataframe preview; no Python executes in
  the browser and no data leaves the machine;
- every option set has exactly one correct answer, position is not patterned,
  and distractors target nearby conceptual confusions (rows-vs-columns order,
  n vs n−1, whole-sample vs group mean, describe() contents);
- all authored content, controls, feedback, and accessible labels are
  Vietnamese, matching the domain's Vietnamese-only contract
  (`fallbackLocales: ['en']`); other UI locales fall back to the Vietnamese
  source;
- catalog, MDX validation, tests, and the active Learning Lab wiki agree with
  the new lesson.

# Lineage

Builds on [Statistical Thinking Visuals and Interactions](./2026-07-31-statistical-thinking-interactions.md)
(which added the three in-lesson interactions to `1.1`) and on
[Statistics Foundational Unit](./2026-07-31-statistics-foundational-unit.md)
(which created that lesson and its four pages). Neither predecessor is
replaced; this plan extends the same track with its first Quiz node and adds a
small backward-compatible capability to the shared quiz renderer so quiz
questions can carry deterministic dataframe fixtures.

# Context Read

- `src/content/learning/statistics/table-of-contents.ts` — the
  `statistical-thinking` track currently holds one published node
  (`ch02-classical-statistics-fundamentals`, retitled `1.1`); the Probability
  chapter shows the adjacent-Quiz convention (`Quiz` title, no numbering).
- `src/content/learning/statistics/1.1.1-ch01-probability-origins-quiz.vi.mdx`
  — the quiz authoring shape: `lessonMetadata` + one `<MdxQuiz>` with
  `questions` (id/title/prompt/mode/options/isCorrect/success/error).
- `src/components/learning/learningMdxComponents.tsx` — `MdxQuiz` renders
  `questions[pageIndex]` (one question per page); prompts and option labels
  flow through `renderInlineCode` (backticks → code spans) and KaTeX.
- `src/components/learning/lesson/QuizBlock.tsx` — shared quiz UI for all
  domains; question type derives from `authoredTypes.ts`.
- `scripts/learningContentMdx.ts` — static-props reader supports nested
  string/number literals, arrays, and objects (plus unary minus), so a
  dataframe fixture `{ columns, rows }` parses as a static MDX prop; quiz
  lessons require unique `question ids === pageCount`; only allowlisted
  components are accepted (`MdxQuiz` is already shared).
- `src/lib/learningMdxContent.test.ts` — locked corpus counts that change:
  authored files 166 → 167, statistics `.vi.mdx` 100 → 101, statistics
  documents 100 → 101, `statisticsPageCount` 333 → 339, catalog lessons
  116 → 117, published statistics lessons 100 → 101, plus a per-lesson
  `expectedPageCounts` map that needs the new quiz entry (6).

# Decisions (locked)

- **Lesson identity**: `ch02-classical-statistics-fundamentals-quiz`, mirroring
  the Probability chapter's id convention (`ch01-probability-origins-quiz`
  mirrors `ch01-probability-origins`). File
  `src/content/learning/statistics/2.0.1-ch02-classical-statistics-fundamentals-quiz.vi.mdx`
  (prefix family follows the lesson's `2.0-`; the parser strips prefixes before
  catalog validation).
- **Node**: inserted after the `1.1` lesson in `statistical-thinking` with
  `title: { en: 'Quiz', vi: 'Quiz' }`, `status: 'available'`,
  `contentStatus: 'published'`, no tags, no entry points. Untagged so Review
  membership (derived from `exercise` tags) and the quiz-node rail treatment
  stay consistent with all other Statistics quizzes.
- **Quiz contract extension**: add an **optional** `preview` field to the
  shared quiz question type —
  `preview?: { caption?: string; code?: string; columns: string[]; rows: (string | number)[][] }`
  — rendered by `QuizBlock` above the prompt as a themed read-only dataframe
  card. Backward compatible (optional; existing lessons unchanged), generic
  across domains, and consistent with the CV philosophy that authored MDX owns
  the deterministic fixture while React owns rendering. No new allowlisted
  component is introduced; `MdxQuiz` prop pass-through plus `authoredTypes.ts`
  and `QuizBlock.tsx` render changes.
- **Dataset fixture**: real Fisher Iris values. The `head(5)` preview and the
  group/filter previews use the canonical first rows; aggregate facts used in
  questions (150 rows, 3 × 50 species, setosa `sepal length` mean ≈ 5.006,
  group `petal length` means setosa 1.462 / versicolor 4.260 / virginica 5.552,
  `sepal width` sample std ≈ 0.433) are computed/verified during execution with
  `uv run --with pandas --with scikit-learn` or cross-checked against canonical
  published values. Only rounded-to-3 decimals values appear in options.
- **Question set (6 pages)**, each applying chapter-1 knowledge through a
  pandas operation:
  1. `iris.shape` → `(150, 5)` — sample structure (150 observations = sample
     size n; 5 columns = 4 measurements + species).
  2. `iris['species'].value_counts()` → balanced sample: three species, 50 each
     — categorical composition of the sample.
  3. Best expression to compare `petal length` centers across species →
     `iris.groupby('species')['petal_length'].mean()` — group centers, from the
     variability/descriptive material.
  4. `iris['sepal_width'].std()` default denominator → `n − 1` (`ddof=1`,
     sample standard deviation), matching the lesson's
     `s² = 1/(n−1) Σ(xᵢ − x̄)²`.
  5. `iris[iris['species'] == 'setosa']` then `.shape` → `(50, 5)` — boolean
     filtering and row counts; feedback connects the filtered sample mean
     (≈ 5.006) to point estimation of the setosa population mean.
  6. Which statistic `iris.describe()` does **not** show → mode; feedback lists
     count/mean/std/min/quartiles/max as the descriptive summary.
- **Feedback discipline**: every `success`/`error` string names the taught
  concept it links to; distractors target the listed confusions; no
  answer-position pattern across the six questions.
- **Vietnamese-only** authored content; no `localization.ts` changes (quiz
  content is authored MDX, not system copy).
- **No Python execution**: the quiz is deterministic interaction only, exactly
  like every other Learning Lab lesson.

# Phases

## Phase 0 — Store and approve this plan

- Obtain explicit requester approval before touching runtime, MDX, tests, or
  wiki files.
- On approval: set `status: approved`, bump `updated`, begin execution, then
  set `status: executing`.

## Phase 1 — Verify Iris fixture numbers

- Run `uv run --with pandas --with scikit-learn python` (or equivalent) to
  compute the canonical Iris aggregates listed in Decisions; if the toolchain
  is unavailable, cross-check against canonical published values via web
  search and record the source.
- Freeze the exact `head(5)` rows and the rounded aggregate values used in
  options.

## Phase 2 — Extend the shared quiz question contract

- `src/components/learning/authoredTypes.ts`: add optional `preview` to the
  quiz question type (shape above).
- `src/components/learning/learningMdxComponents.tsx`: extend
  `AuthoredQuizQuestion` and `MdxQuiz` to accept and pass through `preview`.
- `src/components/learning/lesson/QuizBlock.tsx`: render the optional preview
  above the prompt — caption, pandas code line, and a compact read-only table —
  using the existing semantic theme helpers and light-only convention; keep
  table cells text-visible (no correctness-by-color) and the card
  `aria-label` descriptive.
- Verify with `npm run typecheck` that no existing lesson or test is affected
  (field is optional and unused by current MDX).

## Phase 3 — Author the TOC node and quiz MDX

- `src/content/learning/statistics/table-of-contents.ts`: append the Quiz node
  to the `statistical-thinking` track's `lessonIds` after the `1.1` lesson.
- Create `src/content/learning/statistics/2.0.1-ch02-classical-statistics-fundamentals-quiz.vi.mdx`:
  `lessonMetadata` (domainId `statistics`, id `ch02-classical-statistics-fundamentals-quiz`,
  locale `vi`, title `Quiz`, headings/keywords per question, `pageCount: 6`)
  and one `<MdxQuiz id="ch02-classical-statistics-fundamentals-quiz">` with the
  six questions from Decisions; give question 1 and question 5 real Iris
  previews (head rows / setosa head rows), inline-code pandas snippets in every
  prompt, and Vietnamese success/error feedback.

## Phase 4 — Regression coverage

- `src/lib/learningMdxContent.test.ts`: update the locked counts (167 authored
  files; 101 statistics `.vi.mdx`; 101 statistics documents; 339 statistics
  pages; 117 statistics catalog lessons; 101 published) and add the quiz id to
  `expectedPageCounts` with 6.
- Add focused assertions: the new lesson is Vietnamese, `pageCount` 6,
  `quizQuestionIds` unique and length 6, at least one question carries a
  `preview` with matching columns/rows shape, and catalog title is `Quiz`.

## Phase 5 — Documentation

- Update `wiki/concepts/learning-lab.md` Statistics paragraph and file-map
  wording: 117 lesson nodes, 101 published Vietnamese lessons, 339 ordered
  pages; note the chapter-1 pandas quiz over Iris (deterministic fixtures,
  shared quiz renderer preview). No new documentation page.

## Phase 6 — Verify

- `npm run typecheck` while iterating.
- Focused `npm test` on the Learning Lab MDX/content suite.
- `npm run verify` and `git diff --check`.
- Manual desktop/compact sanity pass of the quiz in the Learning Lab
  (selection, check, feedback, reset, arrow traversal) if a browser is
  available; otherwise record that limitation in the execution log.

# Files expected to change

| Path | Change |
|---|---|
| `src/components/learning/authoredTypes.ts` | Optional `preview` on the shared quiz question type. |
| `src/components/learning/learningMdxComponents.tsx` | `AuthoredQuizQuestion`/`MdxQuiz` `preview` pass-through. |
| `src/components/learning/lesson/QuizBlock.tsx` | Read-only dataframe preview card above prompts. |
| `src/content/learning/statistics/table-of-contents.ts` | Quiz node in `statistical-thinking`. |
| `src/content/learning/statistics/2.0.1-ch02-classical-statistics-fundamentals-quiz.vi.mdx` | New 6-question Vietnamese quiz. |
| `src/lib/learningMdxContent.test.ts` | Locked-count updates + focused quiz assertions. |
| `wiki/concepts/learning-lab.md` | Statistics corpus numbers + chapter-1 quiz note. |
| `docs/plans/2026-07-31-statistics-statistical-thinking-pandas-quiz.md` | Status transitions and execution log. |

# Out of scope

- English Statistics MDX, locale-fallback changes, or `localization.ts` edits.
- `exercise` tagging, Review-mode membership, entry points, or Workspace
  handoff for this quiz.
- Real pandas/Pyodide execution, new dependencies, or Canvas3D/Workspace work.
- Changes to the existing `1.1` lesson, other chapters, or the catalog/practice
  contracts beyond the added node.
- A new documentation page or a public rename of the shared quiz surface.

# Execution log

- 2026-07-31 — Plan drafted after reading the Statistics TOC, the Probability
  quiz MDX, `MdxQuiz`/`QuizBlock`, the MDX static-props validator, the locked
  corpus tests, and the statistical-thinking lineage plans. No runtime, MDX,
  test, or wiki files changed.
- 2026-07-31 — Requester approved the stored plan in conversation (`go`);
  status advanced to `executing`.
- 2026-07-31 — Verified all Iris fixture numbers with
  `uv run --with pandas --with scikit-learn` against `load_iris()`: shape
  `(150, 5)`, head rows, `value_counts` 50/50/50, group `petal_length` means
  1.462/4.260/5.552, `sepal_width` sample std 0.436, setosa `sepal_length`
  mean 5.006, `describe()` row set.
- 2026-07-31 — Extended the shared quiz contract with an optional `preview`
  fixture (`caption`/`code`/`columns`/`rows`) in `authoredTypes.ts`,
  localized caption pass-through in `learningMdxComponents.tsx`, and a themed
  read-only dataframe card in `QuizBlock.tsx` above the prompt. `npm run
  typecheck` passed with no impact on existing lessons.
- 2026-07-31 — Added the `ch02-classical-statistics-fundamentals-quiz` node
  to the `statistical-thinking` track (title `Quiz`, published, untagged) and
  authored the 6-page Vietnamese quiz MDX with real Iris previews on
  questions 1 and 5.
- 2026-07-31 — Updated locked counts in `learningMdxContent.test.ts`
  (167 files, 101 statistics `.vi.mdx`, 101 statistics documents, 339
  statistics pages) and `learningCatalog.test.ts` (719 lesson nodes, 167
  published, 101 published statistics, 165 available), added the new quiz's
  `expectedQuizQuestionIds`, and added focused assertions for the quiz
  (pageCount 6, `Quiz` title, preview fixture, TOC membership). Deviation
  from the plan: statistics lessons skip the `expectedPageCounts` check (the
  `else` branch applies it only to non-statistics domains), so no page-count
  entry was needed there.
- 2026-07-31 — Updated `wiki/concepts/learning-lab.md` corpus numbers
  (719 nodes, 167 authored files, 117 statistics lessons, 101 published,
  339 pages) and documented the chapter-1 pandas/Iris quiz with its preview
  fixtures; no new documentation page created.
- 2026-07-31 — `npm run verify` passed (typecheck, 77 tests, production
  build) and `git diff --check` passed. No visual browser was available in
  this harness, so a live desktop/compact quiz pass was not performed; the
  preview card follows the existing QuizBlock theme conventions and the
  generic MDX contract validated the authored file.

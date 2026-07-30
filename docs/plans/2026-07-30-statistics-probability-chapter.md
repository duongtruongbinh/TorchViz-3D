---
title: Replace Statistics Chapter 1 with Probability
status: done
created: 2026-07-30T01:52:39+07:00
updated: 2026-07-30T03:41:28+07:00
author: Codex
task: "rename the Statistics domain to Probability & Statistics and replace its entire first chapter with the requester-provided Vietnamese probability wording, corrected only where necessary and rendered with KaTeX"
supersedes:
  - docs/plans/2026-07-30-statistics-overview-lesson-replacement.md
---

# Goal

Replace the current nine-lesson ISLP introduction track with a coherent
probability foundation that prepares learners for the remaining Statistics
curriculum.

Success means:

- Chapter 1 is titled `1. Xác suất` / `1. Probability`;
- the domain display name is `Probability & Statistics` in English and
  `Xác suất & Thống kê` in Vietnamese;
- all nine old Chapter 1 lessons are replaced by nine probability lessons that
  retain the supplied note's wording, voice, examples, and notes;
- edits to the supplied 1,247-line note are limited to correcting mathematical
  or conceptual errors, removing empty placeholders and bare media links, and
  adapting its structure to valid MDX;
- every mathematical formula and mathematical symbol is rendered through a
  shared KaTeX-backed MDX component, inline or as a display block;
- formulas and terminology are corrected where the reference is inaccurate;
- old track/lesson URLs resolve to the corresponding new canonical routes;
- catalog, MDX, tests, production build, and active Learning Lab documentation
  agree with the new chapter.

# Lineage

Supersedes
[Statistics Overview Lesson Replacement](./2026-07-30-statistics-overview-lesson-replacement.md),
whose first-lesson-only scope is absorbed by this complete Chapter 1
replacement.

# Verbatim and KaTeX Addendum

This addendum supersedes the original-content boundary, page counts, and the
`MdxCode` formula-rendering decision recorded below. The requester clarified
that the supplied Vietnamese wording must be retained.

The approved execution will:

- preserve valid source wording, including its conversational voice, notes,
  examples, and informal phrasing;
- correct only mathematical or conceptual errors;
- remove `!Untitled` placeholders, empty Notion wrapper syntax, and bare
  video/media links that do not provide usable lesson content;
- make only the punctuation and structural changes required for valid,
  readable MDX pages;
- introduce a shared `MdxFormula` primitive backed by KaTeX, supporting both
  inline and display rendering;
- express formulas and mathematical symbols through `MdxFormula`, rather than
  raw TeX, inline code, or `MdxCode`;
- keep the nine canonical lesson ids and compatibility aliases already
  implemented;
- expand Chapter 1 from 32 to 40 pages so the retained wording remains
  readable, changing the Statistics total from 285 to 293 pages.

# Context Read

- The current `introduction` track contains nine published Vietnamese lessons
  with twelve pages total.
- Statistics has 90 published lessons and 265 pages overall.
- The attached note covers probability history, experiments/events, event
  algebra, classical and empirical probability, conditional probability,
  multiplication, total probability, Bayes, Naive Bayes, and exercises.
- The note also contains missing-image placeholders, bare media links, Notion
  wrapper syntax, and mathematical inaccuracies. Those artifacts require
  cleanup, while its valid wording remains canonical.
- The catalog supports route aliases for replaced track and lesson ids.

# Decisions (Locked)

## Canonical Structure

Replace `introduction` with track id `probability` and these lessons:

1. `ch01-probability-origins` — Khởi nguồn và trực giác xác suất — 3 pages.
2. `ch01-experiments-events-sample-space` — Phép thử, biến cố và không gian mẫu
   — 5 pages.
3. `ch01-event-relations` — Quan hệ giữa các biến cố — 10 pages.
4. `ch01-probability-definitions-properties` — Định nghĩa và tính chất xác suất
   — 3 pages.
5. `ch01-empirical-probability` — Tần số và xác suất thực nghiệm — 3 pages.
6. `ch01-conditional-probability` — Xác suất có điều kiện và quy tắc nhân —
   6 pages.
7. `ch01-total-probability` — Công thức xác suất toàn phần — 2 pages.
8. `ch01-bayes-naive-bayes` — Định lý Bayes và Naive Bayes — 5 pages.
9. `ch01-probability-exercises` — Bài tập xác suất — 3 pages.

The revised chapter has 40 pages. Replacing the old 12 pages changes the
Statistics total from 265 to 293 while preserving 13 tracks and 90 published
lessons.

## Content Boundary

- Preserve the reference's valid Vietnamese wording, tone, notes, and examples.
- Restrict prose changes to mathematical/conceptual corrections and the
  smallest MDX formatting adjustments needed for readable lesson pages.
- Use standard notation: sample space `\Omega`, empty event `\varnothing`,
  complement `A^c`, union `A \cup B`, and intersection `A \cap B`.
- Define a random variable correctly as a function from outcomes to numeric
  values, not as another name for a random event.
- Use the correct conditional formula
  `P(A\mid B)=P(A\cap B)/P(B)` for `P(B)>0`.
- State total probability and Bayes with a valid partition.
- Explain that histograms may show counts, relative frequencies, or density;
  do not repeat the reference's claim that count histograms are invalid.
- Present Naive Bayes as conditional-independence modelling, with log scores and
  smoothing for numerical robustness.
- Retain worked examples, exercises, anecdotes, and informal wording, but no
  missing-image placeholders, unusable bare media links, or answer-key
  arithmetic known to be incorrect.
- Render all formulas and mathematical symbols with the shared KaTeX-backed
  `MdxFormula` component.

## Compatibility

- Keep the canonical domain id `statistics`; change only its localized display
  name and description so existing domain URLs and stored state remain valid.
- Delete the nine old Chapter 1 MDX files and create nine canonical new files.
- Add one track alias from `introduction` to `probability`.
- Add nine lesson aliases from each old id to its positional replacement so
  bookmarks continue to resolve.
- Do not change chapters 2–13 or domain routing. Extend the generic shared MDX
  component contract only with `MdxFormula`.

# Phases

## Phase 0 - Approval

- Store this plan as the task's first write.
- Wait for explicit requester approval.

## Phase 1 - Catalog and Routes

- Rename the localized domain display title to `Probability & Statistics` /
  `Xác suất & Thống kê` and update its description for the expanded scope.
- Replace the Chapter 1 track metadata and lesson seeds in the Statistics TOC.
- Add track and lesson route aliases.
- Update catalog regression coverage for the new canonical structure and alias
  count/resolution.

## Phase 2 - Authored Probability Chapter

- Remove the nine superseded Vietnamese MDX files.
- Add `MdxFormula` to the shared MDX component contract and renderer, backed by
  KaTeX for inline and display formulas.
- Replace the nine probability MDX lesson bodies with retained source wording
  across 40 contiguous pages and metadata matching the new TOC.
- Add regression coverage for the shared formula component and generic MDX
  allowlist.

## Phase 3 - Counts and Documentation

- Update the locked Statistics page-count assertion from 285 to 293.
- Update the existing Learning Lab wiki to distinguish the original
  40-page probability Chapter 1 from the retained ISLP-derived Chapters 2–13.
- Do not rewrite completed historical plans.

## Phase 4 - Verification and Record

- Run focused catalog/MDX tests, `npm run verify`, stale-id/reference searches,
  and `git diff --check`.
- Record exact modifications and verification evidence here.

# Out of Scope

- Changing the Statistics domain id or the remaining twelve tracks.
- Adding interactive probability simulations.
- Rewriting valid source wording for style or concision.
- Restoring English Statistics MDX files.
- Editing unrelated existing working-tree changes.

# Chapter 1 Visual and Quiz Addendum

This addendum reopens the existing approved Chapter 1 checkpoint for the
requester's visual redesign and adjacent quiz-node pass. It does not create a
new planning surface.

## Scope and Locked Decisions

- Limit all content and catalog changes to Chapter 1. The request's final
  instruction not to change content outside Chapter 1 takes precedence over
  the earlier mention of Chapters 1–3.
- Preserve the current Vietnamese wording, MDX metadata, theory lesson ids,
  routes, locales, and 40-page theory structure.
- Preserve approved visual treatments where they remain conceptually accurate.
- Extend the existing `ProbabilityChapterVisual` and shared Learning Lab
  components instead of creating a parallel renderer architecture.
- Give each theory page one clear visual focus appropriate to the concept,
  without repeating one card pattern, nesting cards, adding decorative effects,
  or restating information already fully expressed by a diagram.
- Keep paragraphs, blockquotes, and `LessonNote` content full-width within the
  lesson content region. Constrain only media, formulas, tables, and diagrams
  where overflow protection is necessary.
- Keep all mathematical notation KaTeX-rendered, including quiz prompts,
  options, categories, and feedback; raw dollar-delimited syntax may remain
  only as the authored quiz-string transport parsed by the renderer and must
  never be exposed to learners.
- Retain the nine adjacent Chapter 1 quiz nodes already present in the working
  tree. Each is titled `Quiz`, contains one question per page, and uses the
  appropriate `single`, `multi`, `order`, or `categorize` interaction.
- Preserve responsive behavior and readable light/dark contrast on mobile,
  tablet, and desktop.
- Treat all current uncommitted Chapter 1 work as requester-owned state:
  inspect and refine it in place without discarding unrelated changes.

## Addendum Phases

1. Audit all 40 theory pages and 27 quiz pages against the locked hierarchy,
   full-width text, diagram specificity, KaTeX, responsive, and theme
   requirements.
2. Make the smallest necessary Chapter 1 MDX and existing-component changes,
   preserving wording and already-suitable designs.
3. Confirm the Chapter 1 TOC alternates each theory node with its `Quiz` node
   while preserving canonical theory metadata and routes.
4. Run `npm run typecheck`, focused MDX and catalog tests, then
   `npm run verify`; record exact results and modifications in this plan and
   the existing Learning Lab documentation only when its current-state claims
   require adjustment.

# Execution Log

- 2026-07-30T01:52:39+07:00 - Read the complete 1,247-line attachment,
  inspected the current nine-lesson Chapter 1, catalog alias contract, exact
  Statistics page-count tests, and active wiki claims. Stored this draft plan
  as the task's first write.
- 2026-07-30T01:53:27+07:00 - Requester expanded the scope to rename the domain.
  Added localized display-name and description changes while explicitly
  preserving the canonical `statistics` domain id and routes.
- 2026-07-30T01:55:09+07:00 - Requester explicitly approved the expanded plan;
  approval was recorded and execution started.
- 2026-07-30T02:06:30+07:00 - Renamed the localized domain display title to
  `Probability & Statistics` / `Xác suất & Thống kê` while preserving the
  canonical `statistics` id. Replaced track `introduction` with `probability`
  and updated its localized scope description.
- 2026-07-30T02:06:30+07:00 - Deleted the nine superseded Chapter 1 MDX files
  and authored nine canonical Probability lessons with 32 contiguous pages.
  The chapter now covers probability origins, experiments/events/sample
  spaces, event algebra, probability axioms, empirical probability,
  conditioning, total probability, Bayes, Naive Bayes, and checked exercises.
  Content was written from scratch; missing images, copied prose, slang, links,
  and inaccurate reference formulas were not retained.
- 2026-07-30T02:06:30+07:00 - Reused the existing `MdxCode` primitive for
  readable formula blocks rather than adding a Statistics-only renderer.
  Corrected the random-variable definition, conditional-probability formula,
  histogram interpretation, partition requirements, Bayes denominator,
  conditional-independence statement, and exercise arithmetic.
- 2026-07-30T02:06:30+07:00 - Added one legacy track alias and nine positional
  lesson aliases; the repository now has 17 validated route aliases. Updated
  catalog coverage for the localized domain title, canonical Probability
  track, and old-to-new lesson resolution.
- 2026-07-30T02:06:30+07:00 - Updated the locked Statistics page total from 265
  to 285 and revised the Learning Lab wiki to distinguish the original 32-page
  Probability chapter from the 253 ISLP-derived pages in Chapters 2–13.
- 2026-07-30T02:06:30+07:00 - Focused catalog tests passed 7/7, focused MDX
  tests passed 11/11, and `npm run verify` passed TypeScript, all 77 tests, and
  the 2,728-module production build. `git diff --check` passed. Final audits
  confirmed exactly nine new Chapter 1 MDX files, old ids only in aliases and
  their regression test, and no source placeholders, copied-note markers, raw
  LaTeX, or stray non-Vietnamese characters in the new chapter.
- 2026-07-30T02:12:08+07:00 - Requester clarified that valid source wording,
  including notes, examples, and informal voice, must be retained, and that all
  formulas and mathematical symbols must render with KaTeX. Reopened this
  checkpoint as a draft, superseded the original-prose boundary, expanded the
  locked layout to 40 pages / 293 Statistics pages, and scoped one shared
  `MdxFormula` component plus its contract coverage. Awaiting approval before
  implementation.
- 2026-07-30T02:13:19+07:00 - Requester explicitly approved the verbatim and
  KaTeX addendum. Marked the checkpoint approved and started implementation.
- 2026-07-30T02:24:10+07:00 - Added shared `MdxFormula` support to the generic
  MDX contract and renderer, backed by KaTeX with inline and display modes,
  theme-aware styling, horizontal overflow handling, and accessible formula
  labels. Updated the exact shared-component allowlist regression.
- 2026-07-30T02:24:10+07:00 - Replaced all nine Chapter 1 lesson bodies with
  the supplied Vietnamese wording, voice, notes, examples, and exercises across
  40 contiguous pages. Removed missing-image markers, empty Notion wrappers,
  and bare video links. Limited prose changes to MDX structure and corrections
  for random variables, set notation, histogram modes, conditioning, total
  probability, Bayes denominators, conditional independence, numerical
  underflow, smoothing, and exercise arithmetic.
- 2026-07-30T02:24:10+07:00 - Converted 306 inline/display formulas and
  mathematical symbols to `MdxFormula`; Chapter 1 contains no raw dollar-delimited
  TeX or `MdxCode` formula blocks. Updated the locked Statistics total to 293
  pages and documented the retained-wording/KaTeX boundary in the Learning Lab
  wiki.
- 2026-07-30T02:24:10+07:00 - Focused MDX validation passed, TypeScript passed,
  and `npm run verify` passed all 77 tests plus the 2,728-module production
  build. `git diff --check` and stale-artifact audits passed. The existing Vite
  warning for chunks larger than 1,000 kB remains non-blocking.
- 2026-07-30T02:27:33+07:00 - Added the requester-supplied Méré illustration
  as the local asset
  `public/assets/learning/statistics/01-statistics-probability-origins-mere-gambling-scene.jpg`
  and placed
  it before the spelling note on page 1 of the probability-origins lesson.
  Added a responsive, lazy-loaded renderer for standard Markdown images in the
  shared MDX map. Focused MDX tests passed 11/11, TypeScript passed, and
  `git diff --check` passed.
- 2026-07-30T03:27:55+07:00 - Requester asked for a complete Chapter 1 visual
  redesign and one adjacent Quiz node per theory lesson while preserving the
  Vietnamese wording and existing architecture. Audited the current dirty
  worktree and found nine adjacent three-page Quiz nodes, KaTeX-aware quiz
  rendering, and an extended `ProbabilityChapterVisual` already in progress.
  Reopened this existing checkpoint as a draft with the visual/quiz addendum;
  no source implementation files were changed during this audit.
- 2026-07-30T03:28:50+07:00 - Requester explicitly approved the Chapter 1
  visual and quiz addendum.
- 2026-07-30T03:41:28+07:00 - Completed the Chapter 1 hierarchy and
  full-width audit across 40 theory pages and 27 quiz pages. All theory pages
  now have a concept-appropriate image, diagram, formula, or table as their
  primary visual focus; paragraphs, blockquotes, and notes stretch across the
  reading region while media, formulas, diagrams, and tables retain bounded or
  horizontally scrollable layouts.
- 2026-07-30T03:41:28+07:00 - Extended `ProbabilityChapterVisual` to fifteen
  domain-specific variants, adding dedicated histogram, independent/dependent,
  equiprobable, and prior-to-posterior diagrams while retaining suitable
  existing designs. The variants use responsive layout changes and
  theme-aware light/dark contrast without a parallel renderer architecture.
- 2026-07-30T03:41:28+07:00 - Retained the nine adjacent `Quiz` nodes and their
  27 one-question pages across `single`, `multi`, `order`, and `categorize`
  modes. Extended shared quiz rich-text rendering so math in prompts, answers,
  drag labels, category labels, and feedback is KaTeX-backed, added a tap
  fallback for categorize interactions on touch layouts, and corrected the
  dark selected-state contrast.
- 2026-07-30T03:41:28+07:00 - Strict-rendered 398 authored Chapter 1 and quiz
  formulas through KaTeX without a syntax failure. `npm run typecheck` passed;
  focused catalog and MDX tests passed 2/2; `npm run verify` exited 0 with all
  77 tests and the 2,738-module production build passing. `git diff --check`
  passed. The existing warning for chunks larger than 1,000 kB remains
  non-blocking.

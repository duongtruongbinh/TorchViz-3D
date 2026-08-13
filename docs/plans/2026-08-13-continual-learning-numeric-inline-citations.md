---
title: Continual Learning Numeric Inline Citations
status: done
created: 2026-08-13T16:58:00+07:00
updated: 2026-08-13T17:05:00+07:00
author: Codex
task: "Render inline Continual Learning citations as stable numeric indexes matching each lesson's final paper map"
supersedes:
  - docs/plans/2026-08-13-continual-learning-citation-evidence-preview.md
---

# Goal

Make claim-adjacent citations visually compact by rendering each paper as a
numeric reference such as `[1]`. The number must identify the same paper on the
lesson's final `Nguồn và bản đồ paper` page. Hover/focus/touch evidence previews
remain unchanged: title, author/year, excerpt, copy action, and source action.

# Lineage

This presentation follow-up extends
[Continual Learning Citation Evidence Preview](./2026-08-13-continual-learning-citation-evidence-preview.md).
It changes citation labels and reference numbering only; it does not change the
reviewed evidence model or source coverage.

# Repository findings

- `Cite` and `LessonReferences` already consume the same lesson-filtered
  `referencePapers` context.
- The final page currently splits papers into featured and additional lists,
  and each `<ol>` restarts at 1. A unique inline index therefore requires one
  shared ordering across both groups.
- `referencePapers` is deterministic, but the reader-facing order should keep
  featured sources first and additional survey evidence second.
- Repeated citations to the same paper must reuse one number even when they
  point to different evidence excerpts.
- Locator, source version, and occurrence evidence remain stored for audit and
  deep-link behavior; they should not appear in the compact inline label.

# Decisions

1. Define the canonical per-lesson reference order as:
   `featured papers`, followed by `additional papers`, preserving the existing
   order inside each group.
2. Build one paper-ID-to-one-based-index map from that order in the shared
   lesson context. `Cite` renders only `[n]` from this map.
3. Render the final page with continuous numbering across the two visual groups.
   The additional list starts after the featured count instead of restarting at
   1.
4. Repeated occurrences of one paper use the same index. Evidence occurrence
   IDs continue to select different excerpts and verification URLs.
5. Keep the full paper identity in the citation accessible name and evidence
   preview. A citation without a resolvable lesson index renders its existing
   explicit error state rather than inventing a number.
6. Apply numeric labels only through the shared `Cite` component. Paper titles
   in `PaperSummary` and the final reference page remain readable titles.
7. Remove authored `label` values from rendering semantics; retain the prop for
   MDX compatibility during this pass so existing content need not be
   mechanically rewritten.

# Phases

## Phase 0 — Approval

- Store this plan and pause for explicit approval.

## Phase 1 — Shared ordering and rendering

- Add a pure helper for featured-first reference ordering/index lookup.
- Make `Cite` render `[n]` while preserving current preview and direct-link
  behavior.
- Give `ReferencePaperList` an explicit start index so final-page numbering is
  continuous across featured and additional groups.

## Phase 2 — Guardrails

- Add focused tests for deterministic ordering, continuous numbering, repeated
  paper reuse, and preview-free final references.
- Confirm locator/evidence validation still operates even though locators are
  not displayed inline.

## Phase 3 — Documentation and verification

- Update the existing Learning Lab wiki citation-authoring section.
- Record the implementation in this plan.
- Run `npm run verify`, `npm run audit:cl-citation-evidence`, and
  `git diff --check`.

# Out of scope

- Renumbering across the whole course instead of per lesson.
- Adding evidence previews to the final reference page.
- Changing evidence excerpts, paper metadata, claim coverage, or source URLs.
- Reordering papers based on first citation occurrence.

# Execution log

- 2026-08-13 — Inspected `Cite`, lesson context, and the two final reference
  lists. Stored the draft plan; no runtime change for numeric citations has been
  made pending approval. Existing uncommitted edits from the preceding compact
  citation-label refinement remain untouched.
- 2026-08-13 — User approved the plan; status advanced through approval to
  execution.
- 2026-08-13 — Added a React-free reference-index helper. The canonical order
  is featured-first, then additional, with one-based indexes and stable reuse
  for repeated paper IDs.
- 2026-08-13 — `LearningMdxLessonProvider` now injects the shared paper index;
  every authored `Cite` renders only `[n]`. Evidence previews retain paper
  title, author/year, excerpt, copy, and source-open behavior.
- 2026-08-13 — Final reference lists now use continuous `<ol start>` numbering,
  so the additional survey group continues after the featured group instead of
  restarting at 1.
- 2026-08-13 — Split the three ClimateGPT statements into complete claims with
  a citation after each claim and removed their inconsistent display-label
  overrides. Authored locator metadata remains available for evidence audit but
  no longer lengthens inline text.
- 2026-08-13 — Added index-order/reuse guardrails and updated the Learning Lab
  wiki. `npm run verify` passed 89 tests and the production build; all eight
  Overview evidence records passed the audit contract (seven automatic, one
  documented ScienceDirect manual-review target); `git diff --check` passed.

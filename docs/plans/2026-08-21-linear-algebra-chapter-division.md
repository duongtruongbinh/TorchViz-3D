---
title: Divide Linear Algebra Track into Structured Chapters
status: executing
created: 2026-07-30
author: pi agent
task: "Split the flat linear-algebra track into real chapter objects matching the Strang curriculum, and ensure lesson ordering follows the canonical pedagogical flow."
---

# Goal

Restructure the `linear-algebra` table of contents from a single flat track into
separate chapter objects (matching how the `llm-ai-engineering` and `fundamentals`
tracks are organized), with lessons ordered according to Gilbert Strang's MIT
18.06 curriculum.

# Current State

- A single `linearAlgebraTrack: LearningTocTrackSeed` holds all 29 lesson IDs
  in one flat array, with only comments marking chapter boundaries.
- 13 lessons are published (content files exist); 16 are stubs (IDs only).
- Other tracks (LLM, Fundamentals) use a proper `chapters: LearningTocTrackSeed[]`
  array where each chapter has its own `id`, `text: { title, description }`,
  and `lessonIds`.

# Changes

Replace the single `linearAlgebraTrack` with a `chapters` array of 7 chapter
objects. The chapter grouping and lesson ordering follows Strang:

| # | Chapter | Lessons | Status |
|---|---------|---------|--------|
| 1 | Vectors & Matrices | intuition through elementwise-vs-matrix-product (9) | all published |
| 2 | Solving Linear Equations | systems through identity-inverse-matrix (4) | all published |
| 3 | Vector Spaces & Subspaces | vector-spaces-subspaces through linear-transformations (5) | stubs |
| 4 | Orthogonality & Least Squares | orthogonal-projections through systems-least-squares (3) | stubs |
| 5 | Determinants | determinant-intuition through determinant-properties-formulas (2) | stubs |
| 6 | Eigenvalues & Eigenvectors | matrix-trace through pca-eigenvalues (4) | stubs |
| 7 | Singular Value Decomposition | svd-intuition through svd-dimensionality-reduction (2) | stubs |

No lesson IDs are added, removed, or reordered — only the structural wrapping
changes. The `linearAlgebraTrack` variable is replaced by a `chapters` const
array, and `chapters: [linearAlgebraTrack]` → `chapters`.

# Execution

- [ ] Rewrite `src/content/learning/linear-algebra/table-of-contents.ts`:
  - Replace `linearAlgebraTrack` with `chapters: LearningTocTrackSeed[]`
  - Each chapter gets: `id`, `text: { title: LearningLocalizedText, description: LearningLocalizedText }`, `lessonIds`
  - Preserve all existing lesson seed data (titles, contentStatus for published)
  - Export `chapters` as a const and reference it from the TOC object
- [ ] Run `npm run verify` to confirm typecheck, tests, and build pass

# Verification

```bash
npm run verify
```

# Execution log

- 2026-08-21 — Plan created.
- 2026-08-21 — Rewrote `table-of-contents.ts`: replaced single `linearAlgebraTrack` with
  `chapters: LearningTocTrackSeed[]` containing 7 chapter objects, each with
  `id`, `text: { title, description }`, and `lessonIds` preserving all existing
  lesson seed data. The chapter grouping and lesson ordering follows Gilbert
  Strang's MIT 18.06 curriculum.
- 2026-08-21 — Updated `learningCatalog.test.ts` track count expectation from
  78 to 84 (linear algebra went from 1 flat track to 7 chapters).
- 2026-08-21 — `npm run verify` passes (75 tests, typecheck, production build).

# Out of scope

- Authoring content for stub lessons (handled by separate phase plans)
- Changing the domain-level text, status, or sectionKinds
- URL or route changes

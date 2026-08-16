---
title: "Linear Algebra Curriculum — Strang-Based Outline Implementation"
status: executing
created: 2026-07-30
author: Antigravity
task: "Rename domain from math-statistics-ai to linear-algebra, restructure TOC to follow Strang's outline, author remaining lessons across 5 phases"
---

# Goal

Restructure and complete the Linear Algebra track in the Learning Lab to follow
Gilbert Strang's curriculum structure. This covers the full arc from vectors
through eigenvalues, SVD, and applications — giving learners a complete
foundation rather than the applied-only subset from Boyd/VMLS.

## Current State

- **7 published lessons** (Phase 1 — Vector Foundations): `vectors-intuition`
  through `orthogonality`
- **12 stub lesson IDs** in `table-of-contents.ts`: `matrix-operations` through
  `svd-dimensionality-reduction`
- Strang's outline introduces topics not present in the current stubs (Gaussian
  elimination, LU decomposition, vector spaces/subspaces, Gram-Schmidt, etc.)

## What Changes

1. **Rename the domain** — Rename `math-statistics-ai` → `linear-algebra`
   everywhere: directories, imports, component map key, and TOC domain ID.
   Remove the 4 unpublished tracks (Calculus, Probability, Optimization,
   Information Theory) since they have no authored content.
2. **Restructure the TOC** — Add new lesson IDs for Strang topics missing from
   the current stubs; reorder existing stubs to match Strang's pedagogical flow.
3. **Author lessons in 5 phases** — Each phase is a self-contained batch of
   ~4–6 lessons that can be verified and shipped independently.

---

# Curriculum Mapping: Strang → Lessons

Below maps Strang's 7 chapters to concrete lesson IDs. Lessons marked ✅ are
already published. Lessons marked 🔄 exist as stubs. Lessons marked 🆕 are new.

## Chapter 1 — Vectors & Matrices (Foundation)

| # | Lesson ID | Title (EN) | Status |
|---|-----------|-----------|--------|
| 1 | `vectors-intuition` | Vector Intuition | ✅ |
| 2 | `vector-operations` | Vector Operations | ✅ |
| 3 | `dot-product` | Dot Product | ✅ |
| 4 | `vector-norms` | Vector Norms | ✅ |
| 5 | `unit-vectors-normalization` | Unit Vectors & Normalization | ✅ |
| 6 | `cosine-similarity` | Cosine Similarity | ✅ |
| 7 | `orthogonality` | Orthogonality | ✅ |
| 8 | `matrix-operations` | Matrix Operations | 🔄 |
| 9 | `elementwise-vs-matrix-product` | Element-wise vs Matrix Product | 🔄 |

## Chapter 2 — Solving Linear Equations

| # | Lesson ID | Title (EN) | Status |
|---|-----------|-----------|--------|
| 10 | `systems-of-linear-equations` | Systems of Linear Equations | 🆕 |
| 11 | `gaussian-elimination` | Gaussian Elimination | 🆕 |
| 12 | `lu-decomposition` | LU Decomposition | 🆕 |
| 13 | `identity-inverse-matrix` | Identity & Inverse Matrices | 🔄 |

## Chapter 3 — Vector Spaces & Subspaces

| # | Lesson ID | Title (EN) | Status |
|---|-----------|-----------|--------|
| 14 | `vector-spaces-subspaces` | Vector Spaces & Subspaces | 🆕 |
| 15 | `column-space-null-space` | Column Space & Null Space | 🆕 |
| 16 | `linear-independence-basis` | Linear Independence & Basis | 🆕 |
| 17 | `matrix-rank` | Matrix Rank | 🔄 |
| 18 | `linear-transformations` | Linear Transformations | 🔄 |

## Chapter 4 — Orthogonality & Least Squares

| # | Lesson ID | Title (EN) | Status |
|---|-----------|-----------|--------|
| 19 | `orthogonal-projections` | Orthogonal Projections | 🆕 |
| 20 | `gram-schmidt` | Gram-Schmidt Orthogonalization | 🆕 |
| 21 | `systems-least-squares` | Least Squares Approximation | 🔄 |

## Chapter 5 — Determinants

| # | Lesson ID | Title (EN) | Status |
|---|-----------|-----------|--------|
| 22 | `determinant-intuition` | Determinant Intuition | 🔄 |
| 23 | `determinant-properties-formulas` | Determinant Properties & Formulas | 🆕 |

## Chapter 6 — Eigenvalues & Eigenvectors

| # | Lesson ID | Title (EN) | Status |
|---|-----------|-----------|--------|
| 24 | `matrix-trace` | Matrix Trace | 🔄 |
| 25 | `eigenvalues-eigenvectors` | Eigenvalues & Eigenvectors | 🔄 |
| 26 | `diagonalization` | Diagonalization | 🆕 |
| 27 | `pca-eigenvalues` | PCA via Eigenvalues | 🔄 |

## Chapter 7 — Singular Value Decomposition

| # | Lesson ID | Title (EN) | Status |
|---|-----------|-----------|--------|
| 28 | `svd-intuition` | SVD Intuition | 🔄 |
| 29 | `svd-dimensionality-reduction` | SVD & Dimensionality Reduction | 🔄 |

### Summary

| Category | Count |
|----------|-------|
| ✅ Already published | 7 |
| 🔄 Existing stubs (to author) | 12 |
| 🆕 New lessons to add | 10 |
| **Total lessons** | **29** |

---

# Phased Execution Plan

## Phase 0 — Domain Rename (`math-statistics-ai` → `linear-algebra`)

Rename the entire domain and strip non-LA tracks. This is a prerequisite for
all subsequent phases.

### Directory renames

- [ ] Rename `src/content/learning/math-statistics-ai/`
      → `src/content/learning/linear-algebra/`
- [ ] Rename `src/components/learning/domains/math-statistics-ai/`
      → `src/components/learning/domains/linear-algebra/`

### File edits

| File | Change |
|------|--------|
| `src/content/learning/linear-algebra/table-of-contents.ts` | Change `id` from `'math-statistics-ai'` to `'linear-algebra'`; update `title`/`description`; remove the `calculus`, `probability-statistics`, `optimization`, and `information-theory` track entries; keep only the `linear-algebra` chapter and flatten it (single track = no chapter wrapper needed) |
| `src/core/learning/catalog.ts` | Update import path from `math-statistics-ai` → `linear-algebra` |
| `src/core/learning/mdxComponentMap.ts` | Update import path and map key from `'math-statistics-ai'` → `'linear-algebra'` |

### URL impact

The dynamic route `src/pages/learning/[domainId]/...` reads from the catalog, so
URLs will automatically change from `/learning/math-statistics-ai/...` to
`/learning/linear-algebra/...`. No route file changes needed.

- [ ] Verify all imports resolve after renames
- [ ] Run `npm run verify`

## Phase 2 — Matrix Foundations (2 lessons)

Covers the remaining Chapter 1 stubs.

- [ ] Author `matrix-operations.vi.mdx`
- [ ] Author `elementwise-vs-matrix-product.vi.mdx`
- [ ] Upgrade both stubs in `table-of-contents.ts` to published
- [ ] Run `npm run verify`

## Phase 3 — Solving Linear Systems (4 lessons)

Covers Chapter 2: systems, elimination, factorization, inverses.

- [ ] Add new lesson IDs to `table-of-contents.ts`: `systems-of-linear-equations`, `gaussian-elimination`, `lu-decomposition`
- [ ] Author `systems-of-linear-equations.vi.mdx`
- [ ] Author `gaussian-elimination.vi.mdx`
- [ ] Author `lu-decomposition.vi.mdx`
- [ ] Author `identity-inverse-matrix.vi.mdx`
- [ ] Upgrade all 4 entries to published
- [ ] Run `npm run verify`

## Phase 4 — Vector Spaces & Transformations (5 lessons)

Covers Chapter 3: the abstract structure that ties everything together.

- [ ] Add new lesson IDs to `table-of-contents.ts`: `vector-spaces-subspaces`, `column-space-null-space`, `linear-independence-basis`
- [ ] Author `vector-spaces-subspaces.vi.mdx`
- [ ] Author `column-space-null-space.vi.mdx`
- [ ] Author `linear-independence-basis.vi.mdx`
- [ ] Author `matrix-rank.vi.mdx`
- [ ] Author `linear-transformations.vi.mdx`
- [ ] Upgrade all 5 entries to published
- [ ] Run `npm run verify`

## Phase 5 — Orthogonality, Projections & Determinants (5 lessons)

Covers Chapters 4–5: projections, Gram-Schmidt, least squares, determinants.

- [ ] Add new lesson IDs to `table-of-contents.ts`: `orthogonal-projections`, `gram-schmidt`, `determinant-properties-formulas`
- [ ] Author `orthogonal-projections.vi.mdx`
- [ ] Author `gram-schmidt.vi.mdx`
- [ ] Author `systems-least-squares.vi.mdx`
- [ ] Author `determinant-intuition.vi.mdx`
- [ ] Author `determinant-properties-formulas.vi.mdx`
- [ ] Upgrade all 5 entries to published
- [ ] Run `npm run verify`

## Phase 6 — Eigenvalues, SVD & Applications (6 lessons)

Covers Chapters 6–7: the capstone — eigen-decomposition, PCA, SVD.

- [ ] Add new lesson ID to `table-of-contents.ts`: `diagonalization`
- [ ] Author `matrix-trace.vi.mdx`
- [ ] Author `eigenvalues-eigenvectors.vi.mdx`
- [ ] Author `diagonalization.vi.mdx`
- [ ] Author `pca-eigenvalues.vi.mdx`
- [ ] Author `svd-intuition.vi.mdx`
- [ ] Author `svd-dimensionality-reduction.vi.mdx`
- [ ] Upgrade all 6 entries to published
- [ ] Run `npm run verify`

---

# TOC Restructuring

The `lessonIds` array in `table-of-contents.ts` will be reordered to match the
Strang flow. The new order (with 🆕 insertions marked):

```typescript
lessonIds: [
  // Chapter 1 — Vectors & Matrices (existing, no change)
  { id: 'vectors-intuition', ... },
  { id: 'vector-operations', ... },
  { id: 'dot-product', ... },
  { id: 'vector-norms', ... },
  { id: 'unit-vectors-normalization', ... },
  { id: 'cosine-similarity', ... },
  { id: 'orthogonality', ... },
  'matrix-operations',
  'elementwise-vs-matrix-product',

  // Chapter 2 — Solving Linear Equations
  'systems-of-linear-equations',    // 🆕
  'gaussian-elimination',           // 🆕
  'lu-decomposition',               // 🆕
  'identity-inverse-matrix',

  // Chapter 3 — Vector Spaces & Subspaces
  'vector-spaces-subspaces',        // 🆕
  'column-space-null-space',        // 🆕
  'linear-independence-basis',      // 🆕
  'matrix-rank',
  'linear-transformations',

  // Chapter 4 — Orthogonality & Least Squares
  'orthogonal-projections',         // 🆕
  'gram-schmidt',                   // 🆕
  'systems-least-squares',

  // Chapter 5 — Determinants
  'determinant-intuition',
  'determinant-properties-formulas', // 🆕

  // Chapter 6 — Eigenvalues & Eigenvectors
  'matrix-trace',
  'eigenvalues-eigenvectors',
  'diagonalization',                // 🆕
  'pca-eigenvalues',

  // Chapter 7 — SVD
  'svd-intuition',
  'svd-dimensionality-reduction',
],
```

---

# Lesson Authoring Conventions

Each lesson follows the established pattern from Phase 1:

- **Language**: Vietnamese (`.vi.mdx`)
- **Sections**: `<theory>` → `<calculation>`
- **Math**: `<InlineMath formula="..." />` and `<BlockMath formula="..." />`
- **Code**: Fenced ` ```python ` blocks with PyTorch examples
- **Quiz**: `<Quiz question="..." options={[...]} correctIndex={N} explanation="..." />`
- **Location**: `src/content/learning/math-statistics-ai/`
- **Verification**: `npm run verify`

---

# Constraints & Risks

1. **10 new lesson IDs** must be added to the TOC — this is a structural change
   that should be done once upfront (or incrementally per phase).
2. **Reordering existing stubs** moves `determinant-intuition` and
   `matrix-trace` to later positions (matching Strang's flow where determinants
   come after vector spaces). This is safe since these are unpublished stubs
   with no content yet.
3. **Phase size**: Phases 4–6 are larger (5–6 lessons each). These can be split
   further if needed, but the groupings match natural chapter boundaries.
4. **No English content**: Following the existing convention, all content is
   authored in Vietnamese first. English translations can be a follow-up task.

---

# Modifications Log

- 2026-07-21 — Absorbed `2026-07-21-learning-lab-python-shiki-codeblock.md`: Added Shiki v4 Python syntax highlighting and reusable `CodeBlock` component (`pythonHighlighter.ts` + `CodeBlock.tsx`).
- 2026-07-29 — Absorbed `2026-07-29-linear-algebra-latex-formulas.md`: Converted plaintext math formulas across Linear Algebra lessons to KaTeX (`InlineMath` and `BlockMath`).
- 2026-08-10 — Absorbed `2026-08-10-linear-alg-shiki-codeblock-pre-override.md`: Connected fenced Python code blocks in Linear Algebra MDX to `CodeBlock` via `MdxPre` override in `sharedLearningMdxComponents`.


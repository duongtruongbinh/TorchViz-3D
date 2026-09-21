---
title: "Linear Algebra Curriculum — 7-Chapter Strang Foundations, Mafs Migration, Visual Primitives & Full-Course Refinement"
status: completed
created: 2026-08-18
updated: 2026-08-18
author: Antigravity
task: "Consolidate and complete the full 7-chapter Linear Algebra Learning Lab curriculum (58 lessons), migrate Cartesian visuals to Mafs 0.21.0, audit math invariants, rebalance quizzes, and standardize visual primitives"
supersedes:
  - docs/plans/2026-07-14-linear-algebra-phase-1.md
  - docs/plans/2026-07-30-linear-algebra-strang-curriculum.md
  - docs/plans/2026-08-21-linear-algebra-chapter-division.md
  - docs/plans/2026-08-18-linear-algebra-chapter-1-mafs-integration.md
  - docs/plans/2026-08-18-linear-algebra-chapter-2-and-corrections.md
  - docs/plans/2026-08-18-linear-algebra-chapters-3-to-7-and-corrections.md
  - docs/plans/2026-08-18-linear-algebra-full-audit-repair-and-refinement.md
---

# Lineage

This consolidated plan supersedes all previous partial and draft Linear Algebra plans (`2026-07-14-linear-algebra-phase-1`, `2026-07-30-linear-algebra-strang-curriculum`, `2026-08-21-linear-algebra-chapter-division`, `2026-08-18-linear-algebra-chapter-1-mafs-integration`, `2026-08-18-linear-algebra-chapter-2-and-corrections`, `2026-08-18-linear-algebra-chapters-3-to-7-and-corrections`, and `2026-08-18-linear-algebra-full-audit-repair-and-refinement`). It serves as the single authoritative record for the Linear Algebra curriculum architecture, visual system, mathematical corrections, and testing.

---

# Executive Summary

The `linear-algebra` domain in Learning Lab is a comprehensive, intuition-first interactive mathematics course based on Gilbert Strang's MIT 18.06 curriculum. It spans 58 published lessons across 7 chapters, structured into 29 paired Theory + Quiz units. All 2D Cartesian mathematical visualizations are powered by **Mafs 0.21.0** and domain-local React components loaded strictly through on-demand lazy boundaries.

---

# Curriculum Structure (7 Chapters, 58 Lessons)

```text
Chapter 1: Vectors & Matrices (16 lessons)
  1.1  vectors-intuition / vectors-intuition-quiz
  1.2  vector-operations / vector-operations-quiz
  1.3  vector-norms / vector-norms-quiz
  1.4  unit-vectors-normalization / unit-vectors-normalization-quiz
  1.5  dot-product / dot-product-quiz
  1.6  cosine-similarity / cosine-similarity-quiz
  1.7  matrix-operations / matrix-operations-quiz
  1.8  elementwise-vs-matrix-product / elementwise-vs-matrix-product-quiz

Chapter 2: Solving Linear Equations (8 lessons)
  2.1  systems-of-linear-equations / systems-of-linear-equations-quiz
  2.2  gaussian-elimination / gaussian-elimination-quiz
  2.3  lu-decomposition / lu-decomposition-quiz
  2.4  identity-inverse-matrix / identity-inverse-matrix-quiz

Chapter 3: Vector Spaces & Subspaces (10 lessons)
  3.1  vector-spaces-subspaces / vector-spaces-subspaces-quiz
  3.2  column-space-null-space / column-space-null-space-quiz
  3.3  linear-independence-basis / linear-independence-basis-quiz
  3.4  matrix-rank / matrix-rank-quiz
  3.5  linear-transformations / linear-transformations-quiz

Chapter 4: Orthogonality & Least Squares (8 lessons)
  4.1  orthogonality / orthogonality-quiz
  4.2  orthogonal-projections / orthogonal-projections-quiz
  4.3  gram-schmidt / gram-schmidt-quiz
  4.4  systems-least-squares / systems-least-squares-quiz

Chapter 5: Determinants (4 lessons)
  5.1  determinant-intuition / determinant-intuition-quiz
  5.2  determinant-properties-formulas / determinant-properties-formulas-quiz

Chapter 6: Eigenvalues, Eigenvectors & Trace (8 lessons)
  6.1  matrix-trace / matrix-trace-quiz
  6.2  eigenvalues-eigenvectors / eigenvalues-eigenvectors-quiz
  6.3  diagonalization / diagonalization-quiz
  6.4  pca-eigenvalues / pca-eigenvalues-quiz

Chapter 7: Singular Value Decomposition (4 lessons)
  7.1  svd-intuition / svd-intuition-quiz
  7.2  svd-dimensionality-reduction / svd-dimensionality-reduction-quiz
```

---

# Architecture & Technical Boundaries

```text
src/content/learning/linear-algebra/
  ├── table-of-contents.ts          # Typed 7-chapter TOC metadata & descriptions
  ├── *.vi.mdx                      # 29 theory lessons (authored Vietnamese prose + KaTeX)
  └── *-quiz.vi.mdx                 # 29 canonical quiz lessons (101 balanced multiple choice questions)

src/components/learning/domains/linear-algebra/
  ├── primitives/
  │   ├── MathCanvas.tsx            # Bare Cartesian Mafs container (no extra borders/padding/margins)
  │   ├── MathPlane.tsx             # Standard coordinate plane wrapper delegating to MathCanvas
  │   ├── MathVisualCard.tsx        # Single outer <figure> card shell (title, badge, footer, controls)
  │   ├── MatrixEquationRow.tsx     # Responsive horizontal equation wrapper with touch-scroll containment
  │   ├── MatrixGrid.tsx            # Semantic matrix display with accessible cell buttons
  │   ├── AugmentedMatrixGrid.tsx   # Continuous vertical divider augmented matrix grid
  │   ├── RightAngleMarker.tsx      # Vector-aligned right-angle box indicator with zero-safety
  │   ├── MathSegmentedControl.tsx  # Accessible radiogroup selector with keyboard navigation
  │   ├── MathRangeControl.tsx      # Linked slider control with useId & HTML label
  │   ├── MathStepperControls.tsx   # Stepper navigation for multi-step derivations
  │   └── AngleArc.tsx              # Mafs parametric angle arc using domain={[min, max]}
  ├── geometry/
  │   ├── demoMath.ts               # Pure audited math helpers (apply2x2, matMul, det, trace, SVD, PCA)
  │   └── vectorMath.ts             # Mafs vec helpers & zero-safe cosine/angle calculations
  ├── theme.ts                      # Light & Dark theme tokens with matrix highlight colors
  ├── vectorRenderers.tsx           # Chapter 1 vector visuals
  ├── matrixRenderers.tsx           # Chapter 1 & 2 matrix operation visuals
  ├── systemRenderers.tsx           # Chapter 2 linear systems, elimination & LU visuals
  ├── spaceRenderers.tsx            # Chapter 3 subspaces, column/null spaces, rank visuals
  ├── orthogonalityRenderers.tsx    # Chapter 4 orthogonality, projection, Gram-Schmidt, least-squares visuals
  ├── determinantRenderers.tsx      # Chapter 5 2D area & row operation determinant visuals
  ├── eigenRenderers.tsx            # Chapter 6 trace, eigenvalues, diagonalization, PCA visuals
  └── svdRenderers.tsx              # Chapter 7 SVD geometry & truncated SVD low-rank visuals
```

---

# Key Engineering & Mathematical Refinements

1. **Single Visual Shell & No Card Nesting**:
   - `MathVisualCard` is the only outer `<figure>` element.
   - `MathCanvas` renders bare `<Mafs>` without inner borders, padding, or fixed-height overflow bugs.
2. **Mafs v0.21.0 Modernization**:
   - Replaced all deprecated `<Plot.Parametric t={...}>` with `<Plot.Parametric domain={[min, max]} ...>`.
3. **Audited Mathematical Correctness**:
   - **SVD Approximations**: Audited matrix $A = \begin{bmatrix}5 & 4 & 2 \\ 4 & 5 & 2 \\ 2 & 2 & 2\end{bmatrix}$ with singular values $\sigma=(10, 1, 1)$, exact rank-1 error $\sqrt{2}\approx 1.414$ ($98.04\%$ energy), and rank-2 error $1.000$ ($99.02\%$ energy).
   - **Cyclic Trace**: Exact consistent source matrices $A$ and $B$ where $\operatorname{tr}(AB)=\operatorname{tr}(BA)=23$.
   - **Centered PCA Dataset**: Zero-mean dataset with projection residual segments connecting points to the principal axis.
   - **Stable Determinant Bounds**: Non-clipping singular matrix $\begin{bmatrix}2 & 1 \\ 4 & 2\end{bmatrix}$ within $[-4, 4]$ and dynamic equation naming ($A$ vs $B$).
   - **Null Space Representation**: Dedicated algebraic panel for $Ax=0$, non-pivot column naming, standard basis vectors, and responsive container bounds.
4. **Quiz Option Rebalancing**:
   - Eliminated the repository-wide "all-A" pattern across all 101 multiple-choice questions in 29 quiz files.
   - Final balanced distribution: A: 21.8%, B: 27.7%, C: 22.8%, D: 27.7%.
5. **Strict Lazy Boundary**:
   - Mafs, `@use-gesture/react`, and all 46 visual components are loaded strictly on-demand when entering the `/learning/linear-algebra` domain.

---

# Verification & Test Coverage

- `src/lib/linearAlgebraRefinement.test.ts`: Audits quiz distribution balance, Mafs deprecation protection, pure math helpers, SVD energy/error invariants, cyclic trace invariants, PCA zero-mean dataset, and Gram-Schmidt/Least Squares residuals.
- `src/lib/linearAlgebraChapters3to7.test.ts`, `linearAlgebraChapter1.test.ts`, `linearAlgebraChapter2.test.ts`: Structural integrity and component allowlist assertions.
- `src/lib/linearAlgebraMathValidation.test.ts`: KaTeX strict validation (`throwOnError: true`) over all MDX formulas.
- `npm run verify` runs `typecheck`, `test` (139/139 passing), and `build` (clean Vite bundle with lazy chunks).

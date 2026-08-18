# Linear Algebra Full Course Audit, Repair, Standardization, and Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Perform a complete audit, mathematical repair, single-shell visual refactor, accessibility standardization, copy refinement, and quiz distribution balancing across all 7 chapters and 58 lessons of the Linear Algebra Learning Lab.

**Architecture:** Refactor `MathPlane` into a bare `MathCanvas` / Cartesian plot primitive wrapped by the single outer `MathVisualCard` shell; eliminate nested figure/card bugs and fixed-height wrapper overflows; mathematically correct `TruncatedSVDExplorer`, `TraceEigenvalueLink`, `PCAProjectionExplorer`, and `DeterminantAreaExplorer`; consolidate matrix rendering primitives with continuous augmented dividers and `MatrixEquationRow`; replace deprecated Mafs v0.21 APIs; fix control semantics (`radiogroup` for segmented control, `useId` for range sliders); remove premature concept leakage across lessons; rebalance correct answer positions across all 29 quizzes; and protect everything with extensive automated tests and visual QA.

**Tech Stack:** React 18, TypeScript, Mafs 0.21.0, KaTeX, Tailwind CSS, Node test runner (`node --test`).

---

## Global Constraints

- 7 chapters, 29 theory lessons, 29 quiz lessons = 58 published lessons total.
- Maintain existing lazy domain boundary for `linear-algebra`.
- Single visual shell: `MathVisualCard` is the only outer `<figure>` / card shell; plot primitives are bare canvases.
- Mafs v0.21: Use `Plot.Parametric domain={...}`, not deprecated `t={...}`.
- Zero state mutations or side effects inside Mafs `constrain` callbacks.
- Exact mathematical correctness: no fabricated demo data; derive matrices and approximations from audited sources.
- No quiz where correct answers are predictably in option A.
- No horizontal page overflow at 390px mobile viewports.
- All 131+ automated tests, `typecheck`, and `build` must pass cleanly.

---

## Plan Tasks

### Task 1: Bare Plot Primitive (`MathCanvas`) & Single Visual Shell Standardization
**Files:**
- Create: `src/components/learning/domains/linear-algebra/primitives/MathCanvas.tsx`
- Modify: `src/components/learning/domains/linear-algebra/primitives/MathPlane.tsx`
- Modify: `src/components/learning/domains/linear-algebra/primitives/MathVisualCard.tsx`
- Modify: `src/components/learning/domains/linear-algebra/vectorRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/matrixRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/systemRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/spaceRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/orthogonalityRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/determinantRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/eigenRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/svdRenderers.tsx`

- [ ] **Step 1.1: Create `MathCanvas.tsx` bare Cartesian plot primitive**
  Bare Mafs container: no `<figure>`, no `my-6`, no `max-w-xl`, no outer card borders/padding. Accepts `height` (default 300, responsive on mobile), `viewBox`, `showGrid`, `children`.
- [ ] **Step 1.2: Update `MathPlane.tsx` to wrap `MathCanvas` or act as backwards-compatible bare plot**
- [ ] **Step 1.3: Eliminate fixed-height CSS wrappers around Mafs**
  Remove `<div className="w-full max-w-[340px] h-[240px]">` in `ColumnNullSpaceExplorer`, `LinearTransformationExplorer`, `DeterminantAreaExplorer`, etc. Replace with responsive grid/flex layout with explicit `height={260}` on `MathCanvas`.
- [ ] **Step 1.4: Eliminate doubled `<figure>` and nested cards**
  Ensure every component uses `MathVisualCard` as the sole outer shell, containing `MathCanvas` directly.

---

### Task 2: Critical Mathematical Correctness & Demo Math Helpers
**Files:**
- Create: `src/components/learning/domains/linear-algebra/geometry/demoMath.ts`
- Create: `src/components/learning/domains/linear-algebra/primitives/RightAngleMarker.tsx`
- Modify: `src/components/learning/domains/linear-algebra/svdRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/eigenRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/determinantRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/orthogonalityRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/spaceRenderers.tsx`

- [ ] **Step 2.1: Implement `demoMath.ts`**
  Pure functions for $2\times 2$ matrix multiplication, determinant, trace, vector projection, Frobenius norm, stable 2D bounds, and SVD demo evaluation.
- [ ] **Step 2.2: Implement `RightAngleMarker.tsx`**
  Shared right-angle indicator for arbitrary orientations in 2D with zero-vector safety. Use in `OrthogonalityExplorer`, `ProjectionExplorer`, and `LeastSquaresExplorer`.
- [ ] **Step 2.3: Correct `TruncatedSVDExplorer`**
  Matrix $A = \begin{bmatrix}5 & 4 & 2 \\ 4 & 5 & 2 \\ 2 & 2 & 2\end{bmatrix}$ ($\sigma = [10, 1, 1]$).
  - Rank-1: $A_1 = \frac{10}{9}\begin{bmatrix}4 & 4 & 2 \\ 4 & 4 & 2 \\ 2 & 2 & 1\end{bmatrix} \approx \begin{bmatrix}4.44 & 4.44 & 2.22 \\ 4.44 & 4.44 & 2.22 \\ 2.22 & 2.22 & 1.11\end{bmatrix}$, error $\sqrt{2} \approx 1.414$, energy $100/102 \approx 98.04\%$.
  - Rank-2: $A_2 = \begin{bmatrix}4.94 & 3.94 & 2.22 \\ 3.94 & 4.94 & 2.22 \\ 2.22 & 2.22 & 1.11\end{bmatrix}$, error $1.000$, energy $101/102 \approx 99.02\%$.
  - Rank-3: $A_3 = A$, error $0.000$, energy $100.0\%$.
  - Replace marketing buzzwords with exact mathematical terminology.
- [ ] **Step 2.4: Correct `TraceEigenvalueLink`**
  - Derive $AB$ and $BA$ from consistent $A = \begin{bmatrix}4 & 1 \\ 2 & 3\end{bmatrix}$ and $B = \begin{bmatrix}1 & 2 \\ 3 & 4\end{bmatrix}$ giving $AB = \begin{bmatrix}7 & 12 \\ 11 & 16\end{bmatrix}$ ($\operatorname{tr}=23$) and $BA = \begin{bmatrix}8 & 7 \\ 20 & 15\end{bmatrix}$ ($\operatorname{tr}=23$).
  - Rename to "Tính chất chu kỳ (Cyclic Property)".
- [ ] **Step 2.5: Correct `PCAProjectionExplorer`**
  - Use exact zero-mean centered dataset.
  - Draw dashed residual lines connecting original points to their projected counterparts on PC1.
- [ ] **Step 2.6: Correct `DeterminantAreaExplorer` & `DeterminantRowOpsExplorer`**
  - Ensure singular determinant preset fits in viewBox without clipping.
  - Correct description of negative determinant (orientation-reversing).
  - Dynamic naming in `DeterminantRowOpsExplorer` (Matrix $A$ vs Matrix $B$).

---

### Task 3: Deprecated Mafs API Replacement
**Files:**
- Modify: `src/components/learning/domains/linear-algebra/primitives/AngleArc.tsx`
- Modify: `src/components/learning/domains/linear-algebra/svdRenderers.tsx`
- Test: `src/lib/linearAlgebraChapters3to7.test.ts`

- [ ] **Step 3.1: Replace `Plot.Parametric t={...}` with `Plot.Parametric domain={...}`** in `AngleArc.tsx` and `svdRenderers.tsx`.
- [ ] **Step 3.2: Add regression test** ensuring 0 occurrences of `<Plot.Parametric t=` across the codebase.

---

### Task 4: Matrix Primitive Consolidation & `MatrixEquationRow`
**Files:**
- Create: `src/components/learning/domains/linear-algebra/primitives/MatrixEquationRow.tsx`
- Modify: `src/components/learning/domains/linear-algebra/primitives/MatrixGrid.tsx`
- Modify: `src/components/learning/domains/linear-algebra/primitives/AugmentedMatrixGrid.tsx`

- [ ] **Step 4.1: Implement `MatrixEquationRow.tsx`**
  Responsive container that allows horizontal scrolling on mobile without page-level overflow.
- [ ] **Step 4.2: Consolidate `MatrixGrid` and `AugmentedMatrixGrid`**
  - Shared bracket styles, cell sizing, cell rendering, and focus-visible styles.
  - Continuous vertical divider line in `AugmentedMatrixGrid`.
  - Column-aligned `rightBlockName`.
  - Remove fake `role="grid"` on static display matrices.

---

### Task 5: Accessibility & Control Semantics
**Files:**
- Modify: `src/components/learning/domains/linear-algebra/primitives/MathSegmentedControl.tsx`
- Modify: `src/components/learning/domains/linear-algebra/primitives/MathRangeControl.tsx`
- Modify: `src/components/learning/domains/linear-algebra/primitives/MathStepperControls.tsx`

- [ ] **Step 5.1: Refactor `MathSegmentedControl.tsx`**
  Use `role="radiogroup"` and `role="radio"` with `aria-checked` (or native styled radios).
- [ ] **Step 5.2: Refactor `MathRangeControl.tsx`**
  Use React `useId()` and associate `<label htmlFor={id}>` with `<input id={id}>`.
- [ ] **Step 5.3: Ensure target sizes and contrast**
  Verify $\ge 24\times 24$ px hit targets, focus indicators, and accessible dark/light text contrast.

---

### Task 6: Concept Sequencing & Prose Refinements Across 29 Theory Lessons
**Files:**
- Modify: `src/content/learning/linear-algebra/table-of-contents.ts`
- Modify: `src/content/learning/linear-algebra/*.vi.mdx` (all 29 theory lessons)
- Modify: `src/components/learning/domains/linear-algebra/spaceRenderers.tsx`
- Modify: `src/components/learning/domains/linear-algebra/eigenRenderers.tsx`

- [ ] **Step 6.1: Soften curriculum description in `table-of-contents.ts`**
  "Nền tảng đại số tuyến tính cốt lõi theo trình tự tiếp cận trực giác của Strang và MIT 18.06: vector, ma trận, giải hệ phương trình, không gian vector, trực giao, định thức, trị riêng và SVD."
- [ ] **Step 6.2: Fix concept sequencing in `matrix-trace.vi.mdx` and `TraceEigenvalueLink`**
  Page 0 introduces trace as diagonal sum; Page 2 introduces cyclic property; Page 4 introduces eigenvalue connection.
- [ ] **Step 6.3: Fix `ColumnNullSpaceExplorer` & `RankPivotExplorer`**
  Null space mode shows dedicated algebraic input space; avoid premature rank-nullity theorem before matrix rank lesson.
- [ ] **Step 6.4: Remove premature determinant notation in `LinearTransformationExplorer`**
- [ ] **Step 6.5: Standardize terminology across all 29 theory lessons**
  Apply uniform Vietnamese linear algebra terminology policy (vector, ma trận, tổ hợp tuyến tính, không gian vector, không gian con, không gian cột, null space, độc lập tuyến tính, cơ sở, số chiều, hạng, biến đổi tuyến tính, trực giao, trực chuẩn, hình chiếu, định thức, vết, trị riêng, vector riêng, SVD).

---

### Task 7: Quiz Option Reordering (Eliminate All-A Pattern Across All 29 Quizzes)
**Files:**
- Modify: `src/content/learning/linear-algebra/*-quiz.vi.mdx` (all 29 quiz files)
- Modify: `src/lib/linearAlgebraChapters3to7.test.ts`
- Modify: `src/lib/linearAlgebraChapter1.test.ts`
- Modify: `src/lib/linearAlgebraChapter2.test.ts`

- [ ] **Step 7.1: Audit and redistribute correct answer positions across A, B, C, D**
  Reorder option arrays deterministically so correct answers are balanced across positions, preserving question correctness and explanation clarity.
- [ ] **Step 7.2: Add automated quiz distribution test**
  Verify that no quiz has all answers in position A, and overall course answer distribution is balanced across A, B, C, D (e.g. 15%–40% per position).

---

### Task 8: Test Suite Strengthening & Full Verification
**Files:**
- Create: `src/lib/linearAlgebraRefinement.test.ts`
- Modify: `src/lib/linearAlgebraChapter1.test.ts`
- Modify: `src/lib/linearAlgebraChapter2.test.ts`
- Modify: `src/lib/linearAlgebraChapters3to7.test.ts`
- Modify: `src/lib/linearAlgebraMathValidation.test.ts`

- [ ] **Step 8.1: Test mathematical invariants across all 7 chapters**
  - Chapter 1: zero vector cosine NaN, norm triangle, dot product angle.
  - Chapter 2: elimination, LU = A, inverse, column combinations.
  - Chapter 3: subspace closure, null space Ax = 0, linear dependence, pivot columns.
  - Chapter 4: orthogonality dot = 0, projection error perpendicular, Gram-Schmidt $Q^\top Q = I$, least squares normal equations.
  - Chapter 5: determinant formulas, area scaling, row operation rules.
  - Chapter 6: trace diagonal sum, cyclic trace $\operatorname{tr}(AB)=\operatorname{tr}(BA)$, eigenpairs $Av=\lambda v$, diagonalization $V\Lambda V^{-1}$, PCA centered covariance.
  - Chapter 7: SVD reconstruction $U\Sigma V^\top$, rank-k truncated SVD error and energy values.
- [ ] **Step 8.2: Run strict KaTeX validation on all formulas**
- [ ] **Step 8.3: Run full verification pipeline**
  `npm run typecheck`, `npm test`, `npm run build`, `npm run verify`, `git diff --check`.

---

### Task 9: Browser Visual QA
- [ ] **Step 9.1: Test Desktop Viewport (1440x900) in Light and Dark Modes**
- [ ] **Step 9.2: Test Mobile Viewports (390x844 and 360x800)**
  Verify 0 horizontal page overflow, legible KaTeX equations, clean matrix scrolling, responsive Mafs heights.
- [ ] **Step 9.3: Console inspection**
  Verify 0 console errors, 0 React warnings, 0 Mafs deprecation warnings.
- [ ] **Step 9.4: Record QA findings in walkthrough artifact**

---

## Verification Plan

### Automated Tests
```bash
npm run typecheck
npm test
npm run build
npm run verify
git diff --check
```

### Manual Visual QA
- Launch `npm run dev` and navigate through all 58 lessons across Chapters 1 to 7.
- Test all toggles, steppers, range controls, and segmented controls.
- Verify light and dark mode styling and contrast.
- Test 390px mobile viewport for layout containment.

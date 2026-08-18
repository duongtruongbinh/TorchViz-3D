---
title: Linear Algebra Chapter 2 Integration & Linear Algebra Corrections
status: completed
created: 2026-08-18T11:50:00+07:00
updated: 2026-08-18T12:00:00+07:00
author: Antigravity
task: "Integrate authoritative Linear Algebra Chapter 2 content, resolve Chapter 1 visual/prop contract defects and Mafs interaction issues, implement Chapter 2 visual components, and verify with tests and visual QA"
supersedes:
  - docs/plans/2026-08-18-linear-algebra-chapter-1-mafs-integration.md
  - docs/plans/2026-08-21-linear-algebra-chapter-division.md
---

# Goal

Integrate the authoritative Vietnamese educational content for **Chapter 2: Solving Linear Equations (Giải hệ phương trình tuyến tính)** of the `linear-algebra` domain in Learning Lab. Audit and fix all known Chapter 1 prop contract inconsistencies, eliminate side effects in Mafs `constrain` callbacks, guarantee live state single-source-of-truth in `DotProductPlane`, remove em/en dashes and non-geometric wording, build 5 new domain-local Chapter 2 visual components using Mafs and an augmented matrix primitive, migrate TOC and quizzes to the canonical schema, and verify thoroughly via unit tests, KaTeX validation, and browser visual QA.

---

# Lineage

Supersedes:
- [2026-08-18-linear-algebra-chapter-1-mafs-integration.md](./2026-08-18-linear-algebra-chapter-1-mafs-integration.md)
- [2026-08-21-linear-algebra-chapter-division.md](./2026-08-21-linear-algebra-chapter-division.md)

---

# Current Defects Found & Audit

1. **`ScalarVectorPlane` Prop Contract**:
   - MDX passes `vector`, `initialScalar`, `interactive`.
   - Renderer had partial/conflicting aliases (`v`, `defaultAlpha`) and did not disable/hide the slider when `interactive={false}`.
   - Solution: Resolve `targetV = vector ?? v ?? [2, 1]` and `targetAlpha = initialScalar ?? defaultAlpha ?? 1.5`. If `interactive={false}`, omit or disable the slider control.

2. **`DistancePlane` Prop Contract**:
   - MDX in `vector-norms.vi.mdx` passes `x={[1, 1]}` and `y={[4, 5]}`.
   - Renderer hardcoded labels `x(1, 1)` and `y(4, 4)` in JSX and used internal fallback `[4, 4]`.
   - Solution: Resolve `start = x ?? p1 ?? [1, 1]` and `end = y ?? p2 ?? [4, 5]`. Derive all point labels, displacement vectors, distance formulas, and view bounds from resolved points.

3. **`L2NormTriangle` Prop Contract & Visual Polish**:
   - MDX passes `vector`.
   - Renderer only checked `v`.
   - Renderer rendered a long raw string `||v||₂ = 5` inside the Mafs graph coordinate area instead of a concise label `v`.
   - Solution: Resolve `vector = vector ?? v ?? [3, 4]`. Use short label `v` inside coordinate space; full Pythagoras formula rendered below the plot with KaTeX.

4. **`VectorNormPlane` Prop Contract**:
   - MDX passes `vectors={[[2, 1], [4, 2]]}`.
   - Renderer only read `v1` and `v2`.
   - Solution: Resolve `vectors` array first (`v1 = vectors?.[0] ?? v1 ?? [2, 1]`, `v2 = vectors?.[1] ?? v2 ?? [4, 2]`).

5. **`NormalizationPlane` Prop Contract**:
   - MDX passes `vectors={[[1, 2], [2, 4]]}` to demonstrate scale-invariance of normalization for collinear vectors.
   - Renderer ignored `vectors` and used single hardcoded vector `[3, 2]`.
   - Solution: Honor `vectors` prop when supplied. If multiple collinear vectors are provided (e.g. `[1, 2]` and `[2, 4]`), show both vectors and their common normalized unit vector $\hat{\mathbf{v}} = [0.45, 0.89]^\top$ on the unit circle.

6. **`VectorAdditionPlane` Interaction Contract**:
   - Component prop type declares `interactive?: boolean`, but component ignored it and rendered static geometry.
   - Solution: When `interactive={true}`, provide movable points for vectors $u$ and $v$ with pure constraints, dynamically updating parallelogram guides and sum vector.

7. **Mafs `useMovablePoint` Constraint Purity**:
   - `InteractiveVectorPlaneMovable` and `InteractiveDotProductPlaneContent` called `setState` / parent callbacks inside the Mafs `constrain` callback.
   - Solution: Make `constrain` 100% pure (`([px, py]) => [snappedX, snappedY]`). Derive live positions directly from `point.point` or `point.x, point.y` during component rendering.

8. **`DotProductPlane` Live State Architecture**:
   - `InteractiveDotProductPlaneContent` had local state while parent computed formulas from initial props.
   - Solution: Single source of truth. Movable point `pointB` directly drives the live geometry, dot product calculation, cosine similarity, angle arc, and KaTeX text below the plot.

9. **`CosineMotivationDiagram` Example Alignment**:
   - Lesson text compares $\mathbf{a}=[1, 0]^\top, \mathbf{b}=[2, 0]^\top$ (dot=2) with $\mathbf{a}=[1, 0]^\top, \mathbf{c}=[100, 0]^\top$ (dot=100).
   - Renderer used unrelated hardcoded vectors $[1, 2], [2, 4]$ and $[3, 6], [6, 12]$.
   - Solution: Align renderer data with authoritative lesson values $[1, 0]^\top, [2, 0]^\top$ vs $[1, 0]^\top, [100, 0]^\top$.

10. **Terminology & Punctuation Polish**:
    - Replaced vague terms `cùng xu hướng` / `ngược xu hướng` with precise geometric phrasing: `góc nhọn (dot product dương)`, `vuông góc (dot product bằng 0)`, `góc tù (dot product âm)`.
    - Removed `Không tương quan` from `CosineAngleExplorer` for 90° cosine.
    - Removed em dash (`—`) and en dash (`–`) from touched Linear Algebra copy.

---

# Chapter 2 Curriculum & Content Migration

### 1. Locked 8-Lesson Structure
Chapter 2 (`solving-linear-equations`) in `src/content/learning/linear-algebra/table-of-contents.ts` must contain exactly 8 published lessons in theory-then-quiz order:

1. `systems-of-linear-equations` (Title: EN `Systems of Linear Equations`, VI `Hệ phương trình tuyến tính`)
2. `systems-of-linear-equations-quiz` (Title: EN `Quiz`, VI `Quiz`)
3. `gaussian-elimination` (Title: EN `Gaussian Elimination`, VI `Khử Gaussian`)
4. `gaussian-elimination-quiz` (Title: EN `Quiz`, VI `Quiz`)
5. `lu-decomposition` (Title: EN `LU Decomposition`, VI `Phân tích LU`)
6. `lu-decomposition-quiz` (Title: EN `Quiz`, VI `Quiz`)
7. `identity-inverse-matrix` (Title: EN `Identity & Inverse Matrices`, VI `Ma trận đơn vị và Ma trận nghịch đảo`)
8. `identity-inverse-matrix-quiz` (Title: EN `Quiz`, VI `Quiz`)

### 2. Byte-for-Byte Authoritative MDX Migration
The 8 authoritative MDX files provided in the prompt will be copied byte-for-byte into `src/content/learning/linear-algebra/`:
- `systems-of-linear-equations.vi.mdx` (SHA256: `14e5779c7afbf87b51eb7f4de06a1f96be385a6ac3d43b048e608417935f973e`)
- `systems-of-linear-equations-quiz.vi.mdx` (SHA256: `a16f6ba9d4be469a95c5eea7766eb8ab64974ca75d9d3c738844cb1f7c20398a`)
- `gaussian-elimination.vi.mdx` (SHA256: `987d7da298fa3fecb6b1a53bfb434f537b1ca0558e9fc04b01a31778984b4e59`)
- `gaussian-elimination-quiz.vi.mdx` (SHA256: `a0f71479a2fb8687f378d0ae16bf3fd36734f3beb104d64dab6d62b08ed26a3f`)
- `lu-decomposition.vi.mdx` (SHA256: `4f769aeb687ef3cc351e15bf51476ad214bc4413a316cdd0f47acbaf82a1af42`)
- `lu-decomposition-quiz.vi.mdx` (SHA256: `13d4d4cc7bd15d6ce3cccdbaf2cf3f296e651c6802ac065b7529500cdf441b54`)
- `identity-inverse-matrix.vi.mdx` (SHA256: `a72d39748157f9dc422ca258a03503008d53d6e3832ed65ab8fc3febb4aae39a`)
- `identity-inverse-matrix-quiz.vi.mdx` (SHA256: `5a954d1cd31cca26d7f09bdff86a878b62bcf402d82b44fb280737e9115c05b1`)

### 3. Canonical Quizzes
- All 4 quiz lessons use canonical `<MdxQuiz id="..." questions={[...]} />`.
- `LegacyMathQuiz` is completely removed from Chapter 2. (Retained only in legacy `orthogonality` in Chapter 4).

---

# Visual Component Architecture

### 1. Matrix Primitives
- **`AugmentedMatrixGrid.tsx`** in `src/components/learning/domains/linear-algebra/primitives/`:
  - Renders square or rectangular matrix with optional vertical divider between coefficient matrix and RHS (or between $A$ and $I$).
  - Supports pivot highlight badge/border, active row highlight, cell highlights.
  - Non-interactive cells use semantic `<div>` elements (no disabled `<button>`).
  - KaTeX math labels for rows and headers.
  - Horizontal overflow support (`overflow-x-auto`) for mobile.
  - Full light/dark mode theme support.

### 2. Five Chapter 2 Visual Components (`systemRenderers.tsx`)
1. **`ColumnCombinationExplorer`**:
   - Cartesian 2D (Mafs `MathPlane`).
   - Visualizes $\mathbf{a}_1 = [1, 3]^\top, \mathbf{a}_2 = [2, -1]^\top$.
   - Draws $x_1 \mathbf{a}_1$ from origin, translated $x_2 \mathbf{a}_2$ head-to-tail, resultant $A\mathbf{x}$, and target $\mathbf{b} = [5, 1]^\top$.
   - Interactive sliders for $x_1, x_2$. At $[1, 2]$, resultant matches $\mathbf{b}$ perfectly.
2. **`LinearSystemCasesExplorer`**:
   - Cartesian 2D (Mafs `MathPlane`).
   - 3-way toggle: Unique solution (intersecting lines + marked point), No solution (distinct parallel lines), Infinitely many solutions (coincident line styling).
   - Explanatory copy below the graph.
3. **`GaussianEliminationStepper`**:
   - DOM Augmented Matrix + KaTeX.
   - Stepper through 4 audited elimination states for $\left[\begin{array}{ccc|c} 1&1&1&6\\2&3&1&11\\1&-1&2&5\end{array}\right] \to \left[\begin{array}{ccc|c} 1&1&1&6\\0&1&-1&-1\\0&0&-1&-3\end{array}\right]$.
   - Highlights active pivots, row operations ($R_2 \leftarrow R_2 - 2R_1$, $R_3 \leftarrow R_3 - R_1$, $R_3 \leftarrow R_3 + 2R_2$), and back-substitution results $(1, 2, 3)$.
4. **`LUFactorizationExplorer`**:
   - DOM Matrix components + KaTeX.
   - Illustrates $A = LU$ for $A=\begin{bmatrix}1&1&1\\2&3&1\\1&-1&2\end{bmatrix}, L=\begin{bmatrix}1&0&0\\2&1&0\\1&-2&1\end{bmatrix}, U=\begin{bmatrix}1&1&1\\0&1&-1\\0&0&-1\end{bmatrix}$.
   - Visually highlights multipliers ($l_{21}=2, l_{31}=1, l_{32}=-2$) in $L$, unit diagonal, and verification $LU=A$.
5. **`GaussJordanInverseStepper`**:
   - DOM Augmented Matrix + KaTeX.
   - Stepper through $[A \mid I] \to [I \mid A^{-1}]$ for $A=\begin{bmatrix}1&2\\3&4\end{bmatrix}$ through 4 states ending with $A^{-1}=\begin{bmatrix}-2&1\\1.5&-0.5\end{bmatrix}$.
   - Clear augmented divider and highlighted inverse block labeled $A^{-1}$.

### 3. Registry & Lazy Boundary
- Register all 5 components in `LINEAR_ALGEBRA_MDX_COMPONENT_NAMES` (`src/content/learning/mdxComponents.ts`), `linearAlgebraMdxComponents` (`src/components/learning/domains/linear-algebra/mdxComponents.tsx`), and TypeScript types (`types.ts`).
- Ensure no eager imports outside the `linear-algebra` lazy domain loader in `learningMdxRegistry.tsx`.

---

# Verification & Test Plan

### 1. Automated Tests
1. **Catalog & TOC Tests**:
   - Assert Chapter 2 contains exactly 8 published lessons in locked order.
   - Assert updated catalog lesson counts (693 total lessons, 157 published lessons).
2. **Authoritative Hash Verification**:
   - Assert all 8 Chapter 2 MDX files match their SHA256 hashes byte-for-byte.
   - Assert all 16 Chapter 1 MDX files continue to match SHA256 hashes.
3. **Canonical Quiz & Legacy Quiz Audit**:
   - Assert 4 new Chapter 2 quiz files use canonical `MdxQuiz`.
   - Assert 0 Chapter 2 theory files embed `LegacyMathQuiz`.
   - Assert `LegacyMathQuiz` only appears in `orthogonality.vi.mdx`.
4. **KaTeX Math Validation**:
   - Run `linearAlgebraMathValidation.test.ts` over all MDX files with `throwOnError: true`.
5. **Component Allowlist**:
   - Assert all 5 new visual component names are allowed and registered (total 30 components).
6. **Mafs & Constraint Purity Regression**:
   - Static analysis test rejecting `<marker`, `getScreenCTM`, manual transforms, and calling `setState`/`onPosChange` inside `useMovablePoint` `constrain` callbacks.
7. **Prop Contract Unit Tests**:
   - Test `ScalarVectorPlane`, `DistancePlane`, `L2NormTriangle`, `VectorNormPlane`, `NormalizationPlane`, `VectorAdditionPlane` prop resolutions.
8. **Punctuation Regression**:
   - Test ensuring 0 semicolons, em dashes, or en dashes in the 8 Chapter 2 MDX files.

### 2. Numerical Example Verification
- Verify $Ax=b$, elimination steps, $LU=A$, $Lc=b, Ux=c$, and $A A^{-1}=I$ in automated tests and manual check.

### 3. Visual QA Matrix
- Test at 1440x900 (Desktop) and 390x844 (Mobile) in Light Mode and Dark Mode.
- Inspect Chapter 1 visuals (`DistancePlane`, `NormalizationPlane`, `ScalarVectorPlane`, `L2NormTriangle`, `DotProductPlane`).
- Inspect Chapter 2 visuals (`ColumnCombinationExplorer`, `LinearSystemCasesExplorer`, `GaussianEliminationStepper`, `LUFactorizationExplorer`, `GaussJordanInverseStepper`).
- Check keyboard accessibility of sliders, step buttons, and toggle buttons.

### 4. Verification Commands
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run verify`
- `git diff --check`

---

# Execution Phases

- **Phase 1: Store & Approve Plan** (Current step)
- **Phase 2: Correct Chapter 1 Visual & Interaction Defects**
  - Fix prop resolution in `ScalarVectorPlane`, `DistancePlane`, `L2NormTriangle`, `VectorNormPlane`, `NormalizationPlane`, `VectorAdditionPlane`.
  - Fix Mafs `constrain` purity and `DotProductPlane` single source of truth.
  - Update wording and punctuation in Chapter 1 renderers.
- **Phase 3: Implement Matrix Primitive & Chapter 2 Visual Components**
  - Build `AugmentedMatrixGrid.tsx`.
  - Build `ColumnCombinationExplorer`, `LinearSystemCasesExplorer`, `GaussianEliminationStepper`, `LUFactorizationExplorer`, `GaussJordanInverseStepper` in `systemRenderers.tsx`.
  - Update `types.ts`, `mdxComponents.tsx`, and `LINEAR_ALGEBRA_MDX_COMPONENT_NAMES`.
- **Phase 4: Content Migration & TOC Update**
  - Copy the 8 authoritative MDX files into `src/content/learning/linear-algebra/`.
  - Update Chapter 2 in `table-of-contents.ts`.
- **Phase 5: Update & Add Test Suites**
  - Update catalog counts and add comprehensive Chapter 2 tests.
  - Run `npm test`, KaTeX validation, and typecheck.
- **Phase 6: Visual QA & Build Verification**
  - Desktop & mobile visual QA in light and dark modes.
  - Run `npm run verify` and `git diff --check`.
- **Phase 7: Final Documentation & Report**

---

# Out of Scope

- Modifying Chapter 3–7 stub lessons or curriculum structure.
- Adding third-party visualization libraries.
- Rewriting authoritative MDX prose, formulas, or quiz questions.

---

# Execution Log

- 2026-08-18 — Draft plan created following comprehensive code inspection and requirements audit.
- 2026-08-18 — Approved plan executed across 6 phases:
  1. Corrected Chapter 1 prop contracts and interaction defects in `vectorRenderers.tsx` (`ScalarVectorPlane`, `DistancePlane`, `L2NormTriangle`, `VectorNormPlane`, `NormalizationPlane`, `VectorAdditionPlane`, Mafs constraint purity, `DotProductPlane` live synchronization, cosine motivation data, and wording/punctuation polish).
  2. Built `AugmentedMatrixGrid.tsx` primitive and 5 new Chapter 2 visual components in `systemRenderers.tsx` (`ColumnCombinationExplorer`, `LinearSystemCasesExplorer`, `GaussianEliminationStepper`, `LUFactorizationExplorer`, `GaussJordanInverseStepper`).
  3. Registered components in `LINEAR_ALGEBRA_MDX_COMPONENT_NAMES`, `types.ts`, and `mdxComponents.tsx`.
  4. Updated Table of Contents with 8 published lessons in locked theory-quiz order.
  5. Migrated 8 authoritative Chapter 2 MDX files byte-for-byte matching SHA-256 hashes.
  6. Added comprehensive test suite `linearAlgebraChapter2.test.ts` and updated `learningCatalog.test.ts`, `learningMdxContent.test.ts`, `linearAlgebraMathValidation.test.ts`. All 125 tests passed. `npm run typecheck`, `npm run build`, and `npm run verify` passed with 0 errors.

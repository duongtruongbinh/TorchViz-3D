---
title: Linear Algebra Chapter 1 Content Integration & Mafs 2D Visualization
status: completed
created: 2026-08-18T00:00:00+07:00
updated: 2026-08-18T11:10:00+07:00
author: Antigravity
task: "Complete end-to-end integration of Linear Algebra Chapter 1, thorough LaTeX formula escaping and KaTeX validation, Mafs 0.21.0 2D Cartesian visualization migration, lazy domain boundary isolation, clean code optimization, and full verification"
supersedes: []
---

# Goal

Integrate the authoritative Vietnamese educational content for **Chapter 1: Vectors & Matrices (Vectors và Ma trận)** of the `linear-algebra` domain in Learning Lab. Migrate all 2D Cartesian mathematical visualizations to **Mafs 0.21.0**, eliminate all custom SVG Cartesian rendering engines, thoroughly fix LaTeX formula escaping and KaTeX typography/theme inheritance, maintain strict lazy-loading domain boundaries, and ensure complete test coverage and verification.

---

# Architecture & Design Decisions

### 1. Curriculum & Content Architecture
- **Canonical Alternating Structure**: Exactly 16 published lessons in Chapter 1 (`vectors-matrices`), alternating theory and quiz:
  1. `vectors-intuition` / `vectors-intuition-quiz`
  2. `vector-operations` / `vector-operations-quiz`
  3. `vector-norms` / `vector-norms-quiz`
  4. `unit-vectors-normalization` / `unit-vectors-normalization-quiz`
  5. `dot-product` / `dot-product-quiz`
  6. `cosine-similarity` / `cosine-similarity-quiz`
  7. `matrix-operations` / `matrix-operations-quiz`
  8. `elementwise-vs-matrix-product` / `elementwise-vs-matrix-product-quiz`
- **Legacy Migration**: Moved legacy `orthogonality` lesson to Chapter 4 (`orthogonality-least-squares`) as published.
- **Canonical Quiz Schema**: All 8 Chapter 1 quiz files use standard `MdxQuiz` with `questions` array.

### 2. Math Rendering (KaTeX)
- Standard single-backslash LaTeX escaping in MDX formula props (`formula="\mathbf{x}"`, `formula="\begin{pmatrix} a & b \\ c & d \end{pmatrix}"`).
- In `src/index.css`: Set `.learning-mdx-content .katex { color: inherit; }` so math inherits surrounding text color in both light and dark themes.
- Exported named `InlineMath` and `BlockMath` components from `src/components/learning/learningMdxComponents.tsx`.
- Automated regression test validating 100% of formulas with `katex.renderToString(..., { throwOnError: true })`.

### 3. 2D Cartesian Visual Engine (Mafs 0.21.0)
- **Dependency**: Exact pinned dependency `"mafs": "0.21.0"` (React 18.2.0 compatible, no caret).
- **Lazy Domain Boundary**: Mafs JS and `mafs/core.css` are imported ONLY inside `src/components/learning/domains/linear-algebra/`. Learning Home never fetches Mafs assets.
- **Domain Adapter (`MathPlane.tsx`)**: Thin wrapper around `Mafs` and `Coordinates.Cartesian` with themed CSS variables (`--mafs-bg`, `--mafs-fg`, `--mafs-origin-color`, etc.), `preserveAspectRatio="contain"`, `pan={false}`, `zoom={false}`. Standard axes without custom markers or arrowheads.
- **Parametric Angle Arc (`AngleArc.tsx`)**: Reusable angle arc primitive using Mafs `Plot.Parametric` in mathematical coordinate space.
- **Pure Vector Math (`vectorMath.ts`)**: Re-exports Mafs `vec` operations (`vec.add`, `vec.sub`, `vec.scale`, `vec.mag`, `vec.dot`, `vec.normalize`) and pure domain helpers (`cosine2D`, `coordinatesInOrthonormalBasis`, `clampZero`).
- **Complete Elimination of Custom Engine**: Deleted `cartesian.ts` and `VectorPlane2D.tsx`. Prohibited custom `<marker>`, `getScreenCTM`, and manual pixel coordinate transformations.

### 4. Component Scope & Invariants
- **15 Cartesian Visuals Migrated to Mafs**:
  1. `VectorPlane` (interactive with `useMovablePoint` snapped to 0.5 step)
  2. `CoordinateRepresentationDiagram` (fixed vector, rotated basis lines $b_1, b_2$, dynamically computed coordinates $[3.42, 1.16]^\top$)
  3. `VectorAdditionPlane` (vectors $u, v, u+v$, parallelogram guide lines)
  4. `ScalarVectorPlane` (vectors $v, \alpha v$, external HTML range slider)
  5. `VectorSubtractionPlane` (vectors $u, v$, difference $u-v$ with tail=$v$, tip=$u$)
  6. `VectorNormPlane` (Mafs Cartesian axes, $v_1, v_2$, short labels in plot, full KaTeX formulas below)
  7. `L2NormTriangle` (exact 3-4-5 right triangle, square right-angle indicator)
  8. `DistancePlane` (points $x, y$, displacement vector $y-x$)
  9. `NormUnitBallDiagram` ($L_1$ diamond, $L_2$ circle $r=1$, $L_\infty$ square sharing identical coordinate space)
  10. `NormalizationPlane` (circle $r=1$, original $v$, unit vector $\hat{v}$)
  11. `UnitVectorPlane` (circle $r=1$, standard basis vectors $e_1, e_2$)
  12. `DotProductPlane` (interactive vectors $a, b$, angle arc, dot product calculation)
  13. `DotProductAngleExplorer` (vectors $a, b$, parametric angle arc, external slider $\theta \in [0^\circ, 180^\circ]$)
  14. `CosineAngleExplorer` (vectors $u, v$, parametric angle arc, external slider $\theta \in [0^\circ, 180^\circ]$)
  15. `EmbeddingCosineDiagram` (vectors $v_1, v_2, v_3$, angle arcs, cosine similarities dynamically derived)
- **Non-Cartesian HTML/KaTeX Cards**: `NormalizationProcess`, `CosineMotivationDiagram`.
- **Matrix Visuals (Grid Layouts)**: `MatrixGrid`, `MatrixExplorer`, `MatrixTransposeExplorer`, `ProductOverview`, `HadamardProductGrid`, `OuterProductExplorer`, `MatrixVectorProductExplorer`, `MatrixProductExplorer` remain custom HTML grid components with KaTeX math and `overflow-x-auto` responsive wrapping.

---

# Verification Results

| Verification Step | Command | Result |
|---|---|---|
| TypeScript Type Check | `npm run typecheck` | 0 errors |
| Full Test Suite | `npm test` | 116/116 passed |
| KaTeX Math Validation | `src/lib/linearAlgebraMathValidation.test.ts` | 387 formulas across 153 MDX files validated with 0 errors |
| Geometry & Math Helpers | `src/lib/linearAlgebraGeometry.test.ts` | 4/4 suites passed |
| Chapter 1 Catalog & Regression | `src/lib/linearAlgebraChapter1.test.ts` | 7/7 suites passed (verified no custom markers, no getScreenCTM, no VectorPlane2D) |
| Production Build | `npm run build` | Success (`linear-algebra` chunk lazy-loaded at ~58 kB) |
| Overall Verification | `npm run verify` | 0 errors |
| Code Formatting & Diffs | `git diff --check` | Clean |

---

# Execution Log

- **2026-08-18**: Integrated Chapter 1 catalog, track definitions, and 16 MDX lessons.
- **2026-08-18**: Fixed KaTeX dark mode text coloring in `src/index.css` and corrected LaTeX formula escaping across all MDX files.
- **2026-08-18**: Adopted Mafs 0.21.0 for all 2D Cartesian visuals. Created `MathPlane.tsx`, `AngleArc.tsx`, and migrated all 15 vector visuals.
- **2026-08-18**: Deleted custom Cartesian engine (`cartesian.ts`, `VectorPlane2D.tsx`) and replaced math helpers with Mafs `vec` utilities.
- **2026-08-18**: Consolidated all Chapter 1 plans into this single unified plan, cleaned dead code, and verified 100% test pass rate.

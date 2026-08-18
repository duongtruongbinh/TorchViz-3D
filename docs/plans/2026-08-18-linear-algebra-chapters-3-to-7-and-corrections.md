---
title: Linear Algebra Chapters 3 to 7 Integration & Full Course Corrections
status: executing
created: 2026-08-18T12:45:00+07:00
updated: 2026-08-18T12:46:00+07:00
author: Antigravity
task: "Fix remaining Linear Algebra math, UI, accessibility, and prop defects, refactor shared visual primitives, integrate 34 authoritative MDX files for Chapters 3 to 7, implement 17 new public visual components across 5 renderer modules, migrate TOC to 58 published lessons, eliminate LegacyMathQuiz, and verify with tests and browser visual QA"
supersedes:
  - docs/plans/2026-08-18-linear-algebra-chapter-1-mafs-integration.md
  - docs/plans/2026-08-18-linear-algebra-chapter-2-and-corrections.md
  - docs/plans/2026-08-21-linear-algebra-chapter-division.md
---

# Goal

Complete the entire remaining `linear-algebra` Learning Lab curriculum (Chapters 3 through 7) by:
1. Resolving all remaining mathematical, public prop contract, accessibility, and copy defects across existing Chapter 1 and 2 visuals.
2. Refactoring shared domain-local visual primitives (`MathVisualCard`, `MathSegmentedControl`, `MathStepperControls`, `MathRangeControl`, and consolidated matrix rendering) to eliminate technical debt.
3. Integrating the 34 authoritative MDX files for Chapters 3 to 7 byte-for-byte matching SHA-256 hashes, with 0 semicolons, em dashes, or en dashes.
4. Overwriting legacy `orthogonality.vi.mdx` with the authoritative Chapter 4 theory file and adding `orthogonality-quiz.vi.mdx`, then completely removing `LegacyMathQuiz` from the domain.
5. Implementing 17 new public visual components across 5 dedicated renderer modules (`spaceRenderers.tsx`, `orthogonalityRenderers.tsx`, `determinantRenderers.tsx`, `eigenRenderers.tsx`, `svdRenderers.tsx`) using Mafs 0.21.0, KaTeX, and accessible DOM matrix primitives.
6. Updating `table-of-contents.ts` to 58 published lessons across 7 chapters in locked order.
7. Verifying through automated unit tests, KaTeX strict validation, numerical linear algebra calculations, and browser visual QA (desktop 1440x900, mobile 390x844, light/dark modes).

---

## Lineage

Supersedes:
- [2026-08-18-linear-algebra-chapter-1-mafs-integration.md](./2026-08-18-linear-algebra-chapter-1-mafs-integration.md)
- [2026-08-18-linear-algebra-chapter-2-and-corrections.md](./2026-08-18-linear-algebra-chapter-2-and-corrections.md)
- [2026-08-21-linear-algebra-chapter-division.md](./2026-08-21-linear-algebra-chapter-division.md)

---

# Audit & Defect Resolutions

### 1. P0 Mathematical Corrections
- **Zero Vector in Cosine & Angle**:
  - `cosine2D(a, b)` in `vectorMath.ts`: If `vec.mag(a) < 1e-6 || vec.mag(b) < 1e-6`, return `NaN` (undefined).
  - In `DotProductPlane`, `CosineAngleExplorer`, `DotProductAngleExplorer`, `EmbeddingCosineDiagram`:
    - When `Number.isNaN(cosTheta)`, display cosine as `"Không xác định"` and angle as `"Không xác định"`.
    - Dot product remains `0` (`vec.dot(a, b) = 0`).
    - Do NOT assert orthogonality for the zero vector.
- **AngleArc Guard for Zero Vector**:
  - In `AngleArc.tsx`: Return `null` immediately if `vec.mag(v1) < 1e-6 || vec.mag(v2) < 1e-6` to avoid calculating meaningless angles with `Math.atan2(0, 0)`.
- **VectorNormPlane Dynamic Scale**:
  - Derive relationship from actual inputs: If $v_1$ and $v_2$ are collinear, calculate scale factor $k = \|v_2\| / \|v_1\|$ and display $\|v_2\| = k \|v_1\|$. If not collinear, display independent norms without asserting a fake relation.

### 2. P1 Public Prop & Visual Contract Fixes
- **`CosineAngleExplorer`**: Honor `interactive?: boolean`. If `interactive={false}`, hide/disable the angle slider.
- **`MatrixTransposeExplorer`**:
  - Derive matrix shapes dynamically from `values.length` and `values[0].length` (e.g. $m\times n \to n\times m$).
  - Generate row mapping buttons $R_1, \ldots, R_m$ dynamically from `values.length` rather than hardcoding 2 rows.
  - Remove em dash from text copy.
- **`MatrixExplorer`**:
  - Dynamic legend: Derive highlighted cells and legend from `values` and active highlight mode, rather than hardcoding `a12 = 2` and `a23 = 6`.
- **`MatrixVectorProductExplorer` & `MatrixProductExplorer`**:
  - When `interactive={false}`, disable cell click handlers (`onCellClick = undefined`).
- **`ColumnCombinationExplorer`**:
  - Dynamic target label: Render `b(${target[0]}, ${target[1]})` instead of hardcoding `b(5, 1)`.
  - Dynamic bounds: Encompass origin, target, scaled col 1, and resultant with safe margins.
- **`VectorAdditionPlane`**:
  - Bounds strategy: Ensure view bounds safely contain `u`, `v`, and `u + v`.
- **`LinearSystemCasesExplorer`**:
  - Remove long text equations from inside Mafs plot `Text`; place full formulas in the card below with KaTeX.
- **`LUFactorizationExplorer`**:
  - Replace `@` symbol in verify view with standard KaTeX multiplication notation.
  - Polish copy: change `"tái tạo chính xác 100% ma trận A"` to `"cho lại đúng ma trận A"`.

### 3. P1 UI, Accessibility & Shared Primitives
- **Stepper Dots**: Increase hit target to at least $32\times 32$ px (visual dot inside button container) with `aria-label` and `aria-current="step"`.
- **Focus Indicators**: Add consistent `focus-visible:ring-2 focus-visible:ring-blue-500` to all interactive buttons and matrix cells.
- **Continuous Augmented Divider**: Render a single continuous vertical line across the entire augmented matrix height instead of per-cell dividers with gaps.
- **Block Label Placement**: Position `rightBlockName` over/beside the augmented right block rather than outside the right bracket.

---

# Shared Visual Primitives

Consolidate reusable UI components in `src/components/learning/domains/linear-algebra/primitives/`:

1. **`MathVisualCard`**:
   - Shared container for all domain figures and explorers.
   - Consistent padding, border, dark/light styling, and `aria-label`.
2. **`MathSegmentedControl`**:
   - Reusable tab/case selector with accessible `role="tablist"` / `role="tab"`, keyboard navigation, and visible focus states.
3. **`MathStepperControls`**:
   - Accessible step navigation with Previous/Next buttons and $\ge 24\times 24$ px hit area step dots.
4. **`MathRangeControl`**:
   - Accessible range slider with label, current value badge, min/max hints, and keyboard support.
5. **`AugmentedMatrixGrid` & `MatrixGrid` Consolidation**:
   - Shared bracket styling, theme tokens, semantic non-button `<div>` for non-interactive cells, continuous augmented divider, and correct block label placement.

---

# Chapter 3 to 7 Content & TOC Migration

### 1. 34 Authoritative MDX Files (Exact SHA-256 Manifest)
Copy all 34 files byte-for-byte into `src/content/learning/linear-algebra/`:
- **Chapter 3**:
  1. `vector-spaces-subspaces.vi.mdx` (`77e69d41e2eb91be6d09ec585abf43bcd27d09d69c5fca024e631241c9fe5696`)
  2. `vector-spaces-subspaces-quiz.vi.mdx` (`99ab7ae85ca5a7db20c69b21e5ecc927714de4b98f059472f4d1f5a5b8a5442e`)
  3. `column-space-null-space.vi.mdx` (`55798e9764d56d324319d80a83d32025aa1755ecde3c952d497220ebedf7785e`)
  4. `column-space-null-space-quiz.vi.mdx` (`bc112361c41d2705e7af7ad6b5e64ec1bb2a29a3dda11040060cc6327baadf6a`)
  5. `linear-independence-basis.vi.mdx` (`a2fc29002d09f93a1c2671f7d63674be008be58461a6edecdd2cc60e7f0e27ba`)
  6. `linear-independence-basis-quiz.vi.mdx` (`bab2a805c366a1f459db96a61d6a45ed72ade8cd71441eafc2832f6ccd4331a7`)
  7. `matrix-rank.vi.mdx` (`fbb4aa6a43182e4547ca3aed3d7b58b66c0f77b4559d7be622b46480c20ff81a`)
  8. `matrix-rank-quiz.vi.mdx` (`3b176271d8ec0e0539c629cfedc6fc3562c418922e082f30789b8d12321a16ed`)
  9. `linear-transformations.vi.mdx` (`914206cee334f92af73220f1affbb6f90a7289ba6364653518698f7796ce343c`)
  10. `linear-transformations-quiz.vi.mdx` (`a2e1441abb2065a782d0bcebd23cf729acc58b18b6b6ab29677d3a30d14965cf`)
- **Chapter 4**:
  11. `orthogonality.vi.mdx` (`ff48ea6e532e6c982322036deb4f605241761d53d2acc0407942c03812042a2f`)
  12. `orthogonality-quiz.vi.mdx` (`fd89a23594e294e402d3df2b1364ac935cfaf90cae4897e9a5ca15c3469e41fb`)
  13. `orthogonal-projections.vi.mdx` (`ed4c712aca34d1352b558a8aac47c526eaed8b82ab383c6abcde3606a8992b35`)
  14. `orthogonal-projections-quiz.vi.mdx` (`f2b455464ad8420106160a55a9f54a09ad87cdb6d57cbeb4caafee159d666151`)
  15. `gram-schmidt.vi.mdx` (`503f454ae6675048c23db065f6e10e0b75762a555ee42b941aa2b9df1d7608b7`)
  16. `gram-schmidt-quiz.vi.mdx` (`99ed8076ee85d10eed4c34c5eb3517c90a62e6dca9d3690ee22a8847748a26ec`)
  17. `systems-least-squares.vi.mdx` (`94cd132c7aad1c736f78791f7c583c3f6bbaa219e807f3f249e9822cdfb44d80`)
  18. `systems-least-squares-quiz.vi.mdx` (`6d1072b60e68ced18a1382d3371b7e01ff81d61bfad265903a8d0cefa78884ac`)
- **Chapter 5**:
  19. `determinant-intuition.vi.mdx` (`3fcea0410fdb9d32555e2ddcc23d1c4e5dc6a455b50b41d72cc5b4e617b0029c`)
  20. `determinant-intuition-quiz.vi.mdx` (`9659676a8ad634be0bbec2aecf31e6b0f5b24ec48eb3a842eef435927823e387`)
  21. `determinant-properties-formulas.vi.mdx` (`2ebaa92553c617398b5e69202252cb63292cccc3d24b9169678ef320840cd4e5`)
  22. `determinant-properties-formulas-quiz.vi.mdx` (`1a6e62c52badee4fa0fa7c035b8ab935d1cfdd3cbee9b1f1d10991760e1648ae`)
- **Chapter 6**:
  23. `matrix-trace.vi.mdx` (`ab773f07814b83ce484cd313dd08b24e019ad76681964c2b255f5276f355970e`)
  24. `matrix-trace-quiz.vi.mdx` (`51da21958da7f1d4fb2044e204235a4a768f6136982ca5e91cb045f62275242c`)
  25. `eigenvalues-eigenvectors.vi.mdx` (`0d28e234a79d49393c9638f1789cb87d683173ad40bc7acbd787c7a0f9f7a450`)
  26. `eigenvalues-eigenvectors-quiz.vi.mdx` (`4cc2a80775100deef3c36f7437b3fd99b63e21df246ee104acad15151b752532`)
  27. `diagonalization.vi.mdx` (`8db058cf91b8b29e973ea8a0e47da1ae2d6c035ad34cffa4145befc9947a9d9b`)
  28. `diagonalization-quiz.vi.mdx` (`d5ff877e93a909a97b86db635906e07cdaca13776122863f1d7df8529ae974e3`)
  29. `pca-eigenvalues.vi.mdx` (`5c5006adb31aedabc2e8c34138770a1b3af1a9aa5fef12dec187334600749e32`)
  30. `pca-eigenvalues-quiz.vi.mdx` (`38b2929ba266657f7453d4552eb2b04a1e4105fe9cc5939d3c84ce3324d1d049`)
- **Chapter 7**:
  31. `svd-intuition.vi.mdx` (`26b6adc43ac60605b46a69d33d30013b71371603463e8a320c4043a3dc5e4ab0`)
  32. `svd-intuition-quiz.vi.mdx` (`61900b22ab0182b26a344df21dd2738bd9dd9701fe797ab6e62bcd74438c8e37`)
  33. `svd-dimensionality-reduction.vi.mdx` (`d2f4e90bdcfdb0cb1fd070887abf7c7a460fa54ff1dee4bf9de392026ab44606`)
  34. `svd-dimensionality-reduction-quiz.vi.mdx` (`d02948414a63de9d6f89ac1d527772c513b3cc373090e3983b67417f1f335521`)

### 2. Table of Contents Update (`table-of-contents.ts`)
Update all 7 chapters to `contentStatus: 'published'`:
- Chapter 1: 16 lessons
- Chapter 2: 8 lessons
- Chapter 3: 10 lessons (5 theory + 5 quiz)
- Chapter 4: 8 lessons (4 theory + 4 quiz)
- Chapter 5: 4 lessons (2 theory + 2 quiz)
- Chapter 6: 8 lessons (4 theory + 4 quiz)
- Chapter 7: 4 lessons (2 theory + 2 quiz)
- **Total Published Lessons: 58**.
- All quizzes get titles `{ en: 'Quiz', vi: 'Quiz' }`.
- All theory lessons match their MDX metadata `title` exactly.

### 3. Removal of `LegacyMathQuiz`
With `orthogonality.vi.mdx` migrated to canonical `MdxQuiz`, there are 0 remaining callers of `LegacyMathQuiz` in Linear Algebra.
- Remove `LegacyMathQuiz` from `LINEAR_ALGEBRA_MDX_COMPONENT_NAMES`.
- Remove `LegacyMathQuiz` from `linearAlgebraMdxComponents`.
- Clean up unused legacy quiz types/functions in `mdxComponents.tsx`.

---

# 17 New Public Visual Components Architecture

Organized into 5 concept-family modules under `src/components/learning/domains/linear-algebra/`:

### 1. `spaceRenderers.tsx` (Chapter 3)
1. **`SubspaceClosureExplorer`**:
   - Mafs 2D plane with toggle between Subspace ($y = 2x$, contains $\mathbf{0}$, closed under addition and scalar multiplication) and Affine Line ($y = 2x + 1$, does not pass through origin, fails closure).
2. **`ColumnNullSpaceExplorer`**:
   - Visualizes rank-1 matrix $A = \begin{bmatrix}1&2&3\\2&4&6\end{bmatrix}$. Output space $\operatorname{Col}(A) \subseteq \mathbb{R}^2$ rendered as a 1D line $y = 2x$ with basis vector $[1, 2]^\top$; Input space $\operatorname{Null}(A) \subseteq \mathbb{R}^3$ displayed algebraically with basis vectors $[-2, 1, 0]^\top$ and $[-3, 0, 1]^\top$.
3. **`BasisIndependenceExplorer`**:
   - Mafs 2D plane comparing Independent basis set ($\mathbf{e}_1=[1,0]^\top, \mathbf{e}_2=[0,1]^\top$ spanning $\mathbb{R}^2$) and Dependent set ($\mathbf{v}_1, \mathbf{v}_2, \mathbf{v}_3 = \mathbf{v}_1 + \mathbf{v}_2$, showing that $\mathbf{v}_3$ adds no new dimension).
4. **`RankPivotExplorer`**:
   - DOM matrix explorer showing original matrix $A = \begin{bmatrix}1&2&0\\0&0&1\end{bmatrix}$, row echelon form, pivot positions, and pivot columns on the original matrix ($a_1, a_3$), yielding $\operatorname{rank}(A) = 2$.
5. **`LinearTransformationExplorer`**:
   - Mafs 2D plane visualizing the mapping of the unit square $[0, 1]^2$ into a parallelogram by matrix $A = \begin{bmatrix}2&1\\0&1\end{bmatrix}$, with presets for Scale, Shear, Reflection, and Rank Deficient Collapse.

### 2. `orthogonalityRenderers.tsx` (Chapter 4)
6. **`OrthogonalityExplorer`**:
   - Mafs 2D plane displaying orthogonal vectors $\mathbf{u}=[1, 1]^\top, \mathbf{v}=[1, -1]^\top$ with dot product $\mathbf{u}^\top\mathbf{v} = 0$, $90^\circ$ right angle marker, and zero-vector safety.
7. **`ProjectionExplorer`**:
   - Mafs 2D plane showing vector $\mathbf{b}=[1, 3]^\top$, direction $\mathbf{a}=[2, 1]^\top$, projection $\mathbf{p} = \frac{\mathbf{a}^\top\mathbf{b}}{\mathbf{a}^\top\mathbf{a}}\mathbf{a} = [2, 1]^\top$, and orthogonal residual $\mathbf{e} = \mathbf{b} - \mathbf{p} = [-1, 2]^\top$ with right-angle indicator.
8. **`GramSchmidtExplorer`**:
   - 5-step stepper in Mafs 2D:
     1. Initial vectors $\mathbf{a}_1=[1, 1]^\top, \mathbf{a}_2=[1, 0]^\top$.
     2. Normalize $\mathbf{a}_1 \to \mathbf{q}_1 = [1/\sqrt{2}, 1/\sqrt{2}]^\top$.
     3. Projection of $\mathbf{a}_2$ onto $\mathbf{q}_1$: $(\mathbf{q}_1^\top\mathbf{a}_2)\mathbf{q}_1 = [0.5, 0.5]^\top$.
     4. Orthogonal residual $\mathbf{u}_2 = \mathbf{a}_2 - (\mathbf{q}_1^\top\mathbf{a}_2)\mathbf{q}_1 = [0.5, -0.5]^\top$.
     5. Normalize $\mathbf{u}_2 \to \mathbf{q}_2 = [1/\sqrt{2}, -1/\sqrt{2}]^\top$, forming orthonormal basis $Q$.
9. **`LeastSquaresExplorer`**:
   - Mafs 2D plane illustrating overdetermined system $A\mathbf{x} \approx \mathbf{b}$ where $\mathbf{b}$ lies outside $\operatorname{Col}(A)$, projected to closest point $A\hat{\mathbf{x}}$ with orthogonal residual $\mathbf{e} = \mathbf{b} - A\hat{\mathbf{x}} \perp \operatorname{Col}(A)$.

### 3. `determinantRenderers.tsx` (Chapter 5)
10. **`DeterminantAreaExplorer`**:
    - Mafs 2D plane showing unit square transformed into parallelogram by $A = \begin{bmatrix}a&b\\c&d\end{bmatrix}$, with $|\det(A)|$ matching area scale, orientation sign visualization (positive vs negative reflection), and zero-determinant collapse.
11. **`DeterminantRowOpsExplorer`**:
    - DOM matrix explorer demonstrating the effect of 3 row operations on $\det(A)$:
      - Swap rows ($\det \to -\det$)
      - Scale row by $c$ ($\det \to c \det$)
      - Add multiple of row to another ($\det$ unchanged)

### 4. `eigenRenderers.tsx` (Chapter 6)
12. **`TraceEigenvalueLink`**:
    - DOM matrix card highlighting diagonal elements $a_{ii}$, showing $\operatorname{tr}(A) = \sum a_{ii} = \sum \lambda_i$, and illustrating cyclic property $\operatorname{tr}(AB) = \operatorname{tr}(BA)$.
13. **`EigenvectorExplorer`**:
    - Mafs 2D plane for $A = \begin{bmatrix}2&1\\0&3\end{bmatrix}$, showing a generic vector $[1, 1]^\top$ changing direction vs eigenvector $\mathbf{v}_1=[1, 0]^\top$ ($\lambda_1=2$) and $\mathbf{v}_2=[1, 1]^\top$ ($\lambda_2=3$) preserving line direction.
14. **`DiagonalizationExplorer`**:
    - Multi-stage DOM matrix pipeline showing $A = V \Lambda V^{-1}$: $\mathbf{x} \xrightarrow{V^{-1}} \text{eigenbasis} \xrightarrow{\Lambda} \text{scaled} \xrightarrow{V} A\mathbf{x}$.
15. **`PCAProjectionExplorer`**:
    - Mafs 2D plane with centered 2D data points, showing principal directions $\mathbf{q}_1$ (PC1, largest variance) and $\mathbf{q}_2$ (PC2), with toggle to project points onto PC1.

### 5. `svdRenderers.tsx` (Chapter 7)
16. **`SVDGeometryExplorer`**:
    - Mafs 2D plane showing 4 stages of $A = U \Sigma V^\top$:
      1. Unit circle in input space $\mathbb{R}^2$
      2. Rotation by $V^\top$
      3. Scaling along axes by singular values $\sigma_1, \sigma_2$
      4. Rotation by $U$ in output space forming the final ellipse
17. **`TruncatedSVDExplorer`**:
    - DOM matrix explorer for low-rank approximation $A_k = \sum_{i=1}^k \sigma_i \mathbf{u}_i \mathbf{v}_i^\top$, with $k=1$, $k=2$, and full rank toggle, displaying Frobenius reconstruction error $\|A - A_k\|_F$.

---

# Verification & Test Strategy

1. **Automated Test Suites**:
   - `src/lib/linearAlgebraChapters3to7.test.ts`:
     - TOC: 58 published lessons across 7 chapters in exact order.
     - SHA-256 manifest: All 34 new Chapter 3–7 files match authoritative hashes.
     - Canonical quizzes: All 17 new quiz files use `MdxQuiz`; no new theory lesson embeds a quiz.
     - Legacy quiz cleanup: `LegacyMathQuiz` has 0 references in all MDX files and is removed from allowlist.
     - Allowlist: All 17 new component names are registered (total 46 visual components).
     - Lazy boundary: All renderer families are strictly loaded on-demand via the linear-algebra domain loader.
     - Mafs purity: Zero side-effects / state setters inside Mafs `constrain` callbacks across all files.
     - Zero vector safety: Cosine & angle render undefined for zero vectors; `AngleArc` does not render.
     - Dynamic props: Matrix transpose shapes and row buttons derive from values; matrix explorer legend derives from values; interactive={false} disables cell clicks.
     - Punctuation regression: 0 semicolons, em dashes, or en dashes in the 34 authoritative files.
   - `src/lib/linearAlgebraMathValidation.test.ts`: KaTeX strict validation (`throwOnError: true`) on all formulas across all 58 lessons.
   - `src/lib/learningCatalog.test.ts` & `src/lib/learningMdxContent.test.ts`: Update global catalog count expectations (total: 710 lessons, 190 published).
2. **Numerical Verification**:
   - Gram-Schmidt: $q_1, q_2$ orthonormal, $Q^\top Q = I$, $QR = A$.
   - Least squares: $A^\top(b - A\hat{x}) = 0$.
   - Determinant: $\det(A) = 6$, row operations modify determinant predictably.
   - Eigenvalues: $A v_1 = 2 v_1, A v_2 = 3 v_2$, $V \Lambda V^{-1} = A$.
   - PCA: Covariance matrix symmetric positive semi-definite, $C \mathbf{q}_i = \lambda_i \mathbf{q}_i$.
   - SVD: $U \Sigma V^\top = A$, singular values sorted $\sigma_1 \ge \sigma_2 \ge 0$, truncated SVD error non-increasing with $k$.
3. **Browser Visual QA**:
   - Viewports: Desktop 1440x900, Mobile 390x844.
   - Themes: Light mode and Dark mode.
   - Verification across all new chapter components and corrected chapter 1/2 components.

---

# Verification Commands

```bash
npm run typecheck
npm test
npm run build
npm run verify
git diff --check
```

---

# Execution Phases

- **Phase A: Plan Creation & Approval** (Current)
- **Phase B: Fix Current P0/P1 Defects & Refactor Shared Primitives**
  - Implement zero-vector mathematical safety in `vectorMath.ts` and `AngleArc.tsx`.
  - Fix `CosineAngleExplorer`, `MatrixTransposeExplorer`, `MatrixExplorer`, `MatrixVectorProductExplorer`, `MatrixProductExplorer`, `ColumnCombinationExplorer`, `VectorAdditionPlane`, `VectorNormPlane`, `LinearSystemCasesExplorer`, `LUFactorizationExplorer`.
  - Build `MathVisualCard.tsx`, `MathSegmentedControl.tsx`, `MathStepperControls.tsx`, `MathRangeControl.tsx`.
  - Consolidate `MatrixGrid.tsx` and `AugmentedMatrixGrid.tsx`.
- **Phase C: Content Migration, TOC & Legacy Cleanup**
  - Copy all 34 authoritative MDX files into `src/content/learning/linear-algebra/`.
  - Update `table-of-contents.ts` to 58 published lessons across 7 chapters.
  - Overwrite legacy `orthogonality.vi.mdx` and add `orthogonality-quiz.vi.mdx`.
  - Remove `LegacyMathQuiz` from `mdxComponents.ts` and `mdxComponents.tsx`.
- **Phase D: Implement 17 New Public Visual Components**
  - Create `spaceRenderers.tsx` (Chapter 3).
  - Create `orthogonalityRenderers.tsx` (Chapter 4).
  - Create `determinantRenderers.tsx` (Chapter 5).
  - Create `eigenRenderers.tsx` (Chapter 6).
  - Create `svdRenderers.tsx` (Chapter 7).
  - Update `types.ts`, `mdxComponents.tsx`, and `LINEAR_ALGEBRA_MDX_COMPONENT_NAMES`.
- **Phase E: Test Suites & Numerical Validation**
  - Create `src/lib/linearAlgebraChapters3to7.test.ts`.
  - Update `src/lib/learningCatalog.test.ts` and `src/lib/learningMdxContent.test.ts`.
  - Verify KaTeX math in `src/lib/linearAlgebraMathValidation.test.ts`.
  - Run `npm test` and `npm run typecheck`.
- **Phase F: Visual QA & Build Verification**
  - Run browser visual QA (desktop 1440x900, mobile 390x844, light/dark).
  - Run `npm run verify` and `git diff --check`.
- **Phase G: Documentation & Final Report**
  - Update plan execution log and write `walkthrough.md`.

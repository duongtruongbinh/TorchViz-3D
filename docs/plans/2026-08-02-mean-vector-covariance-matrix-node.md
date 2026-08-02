---
title: Add Mean Vector, Covariance & Covariance Matrix Node
status: done
created: 2026-08-02T20:45:00+07:00
updated: 2026-08-03T02:15:00+07:00
author: Codex
task: "Add Node 2 — Mean Vector, Covariance & Covariance Matrix after Node 1 (Variance & Standard Deviation)."
supersedes:
  - docs/plans/2026-08-02-variance-standard-deviation-node.md
---

# Goal

Add a published Vietnamese lesson `3.4 Mean Vector, Covariance & Covariance Matrix` (`mean-vector-covariance-matrix`) directly following Node 1 (`3.3 Variance & Standard Deviation`). The lesson guides the learner from 1D scalar observations to multidimensional vectors, data matrices, mean vectors, centering, covariance, signs/quadrants of covariance, variance as self-covariance, outer product expansion of squared deviations, the covariance matrix, matrix form $\mathbf{X}_c^\top \mathbf{X}_c / n$, sample divisor $n-1$, cloud geometry & covariance ellipse, scale dependence, NumPy implementation, common pitfalls, and a synthesis interaction.

# Lineage

Continues [Add Variance and Standard Deviation Node Before Normal Distribution](./2026-08-02-variance-standard-deviation-node.md).
Node 1 established variance as 1D mean squared deviation around the mean. Node 2 generalizes 1D variance into multidimensional space, creating the mean vector and covariance matrix required by multivariate models, PCA, LDA/QDA, and multivariate normal distributions.

# Source Brief

- The requester supplied a comprehensive 27-page brief for **Node 2 — Mean Vector, Covariance & Covariance Matrix**.
- **Vector Convention Refinement:** An observation $\mathbf{x}_i$ is strictly defined as a **row vector** ($\mathbf{x}_i \in \mathbb{R}^{1 \times d}$), corresponding to 1 row of data matrix $\mathbf{X} \in \mathbb{R}^{n \times d}$. A **column vector** represents 1 single feature across all $n$ observations ($\mathbf{f}_j \in \mathbb{R}^{n \times 1}$). Mean vector $\boldsymbol{\mu}$ and centered observation vectors $\mathbf{d}_i = \mathbf{x}_i - \boldsymbol{\mu}$ are row vectors ($\mathbb{R}^{1 \times d}$). Matrix contributions are computed via $\mathbf{d}_i^\top \mathbf{d}_i \in \mathbb{R}^{d \times d}$.
- The 27 explicit page specifications are authoritative:
  - Page 1: Single number to observation row vector ($x_i \in \mathbb{R} \to \mathbf{x}_i \in \mathbb{R}^{1 \times d}$)
  - Page 2: Dataset as matrix ($\mathbf{X} \in \mathbb{R}^{n \times d}$, rows = observations, cols = features)
  - Page 3: Mean vector as row vector ($\boldsymbol{\mu} = \frac{1}{n}\sum \mathbf{x}_i = [\mu_1, \dots, \mu_d]$)
  - Page 4: Hand-calculation of mean vector ($[3, 5]$)
  - Page 5: Data centering ($\mathbf{x}_i - \boldsymbol{\mu}$ row vectors)
  - Page 6: Variance describes single dimensions separately
  - Page 7: Covariance definition ($\operatorname{Cov}(X,Y)$)
  - Page 8: Positive covariance
  - Page 9: Negative covariance
  - Page 10: Near-zero covariance & independence caveat ($Y=X^2$)
  - Page 11: Hand-calculation of covariance
  - Page 12: Variance is self-covariance ($\operatorname{Cov}(X,X) = \operatorname{Var}(X)$)
  - Page 13: Outer product expands centered row vector ($\mathbf{d}_i^\top \mathbf{d}_i$)
  - Page 14: Covariance matrix definition ($\boldsymbol{\Sigma}$)
  - Page 15: Reading the covariance matrix (diagonal vs off-diagonal, symmetry)
  - Page 16: Hand-calculation of covariance matrix ($\mathbf{d}_i^\top \mathbf{d}_i$)
  - Page 17: Matrix formula ($\mathbf{X}_c^\top \mathbf{X}_c / n$)
  - Page 18: Sample version ($1/(n-1)$)
  - Page 19: Covariance matrix & point cloud shape (ellipse tilt & spread)
  - Page 20: Scale impact on covariance
  - Page 21: Python mean vector code
  - Page 22: Python manual covariance code
  - Page 23: Python `np.cov` code (`rowvar=False`, `ddof`)
  - Page 24: Python diagonal checking code
  - Page 25: Python covariance sign plot code
  - Page 26: Common mistakes (6 points)
  - Page 27: Synthesis mini-interaction (3 tasks with 3 sliders)
- All raw LaTeX/math formulas will be converted to the project's standard `<MdxFormula formula="..." />` and `<MdxFormula inline formula="..." />` components.

# Decisions

1. **Lesson ID and Route:**
   - Lesson ID: `mean-vector-covariance-matrix`
   - Title: `3.4 Vector trung bình, Covariance & Ma trận Covariance (Mean Vector, Covariance & Covariance Matrix)`
   - Authoring file: `src/content/learning/statistics/3.4-mean-vector-covariance-matrix.vi.mdx` (27 pages).

2. **Sequence & Display Numbering:**
   - Insert after `variance-standard-deviation` (`3.3`) in `statistics/table-of-contents.ts`.
   - Update display numbers for subsequent lessons:
     - Normal Distribution: `3.5` (was `3.4`)
     - Point Estimation: `3.6` (was `3.5`)
     - Sampling Distributions: `3.7` (was `3.6`)
     - Python Lab: `3.8` (was `3.7`)
   - Update `3.3-normal-distribution.vi.mdx` title metadata to reflect `3.5`.

3. **Visual Interactive Components:**
   - Register `'CovarianceConceptVisual'` and `'CovarianceMatrixExplorer'` in `STATISTICS_MDX_COMPONENT_NAMES` (`src/content/learning/mdxComponents.ts`).
   - Implement renderers in `src/components/learning/domains/statistics/covarianceMatrixRenderers.tsx` and re-export in `src/components/learning/domains/statistics/mdxComponents.tsx`.
   - Components cover:
     - Vector expansion, dataset matrix representation, 2D mean vector plot, centering origin translation.
     - 4-quadrant covariance sign visualizer & non-linear dependency ($Y=X^2$) demonstration.
     - Outer product matrix expansion ($2 \times 2$ diagonal vs off-diagonal breakdown).
     - Interactive point cloud + covariance ellipse explorer with 3 sliders ($\operatorname{Var}(X), \operatorname{Var}(Y), \operatorname{Cov}(XY)$) and structured tasks.

4. **Tests & Catalog Validation:**
   - Update `src/lib/learningMdxContent.test.ts`:
     - Increment published statistics lesson count from 109 to 110.
     - Increment statistics total page count from 409 to 436 (409 + 27).
     - Update track lesson sequence slice assertions and lesson title checks.

# Verification Plan

- `npm run verify` (typecheck + `node --test` + production build).
- Verify exact page rendering, LaTeX formulas, interactive sliders, Python code blocks, and TOC navigation.

# Execution Log

- 2026-08-03 — Published the 27-page lesson, registered both renderers, updated the catalog sequence and regression coverage, and passed `npm run verify` as part of the consolidated Statistics verification.

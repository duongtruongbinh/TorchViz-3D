---
title: Add Joint, Marginal Distribution and Correlation Node
status: done
created: 2026-08-03T00:47:00+07:00
updated: 2026-08-03T02:15:00+07:00
author: Codex
task: "Add the Joint Distribution, Marginal Distribution & Correlation node after the covariance-matrix lesson."
supersedes:
  - 2026-08-02-mean-vector-covariance-matrix-node.md
---

# Node 3 — Joint Distribution, Marginal Distribution & Correlation Implementation Plan

# Lineage

Continues [Mean Vector, Covariance & Covariance Matrix](./2026-08-02-mean-vector-covariance-matrix-node.md).

## Overview

Add Node 3 titled **3.5 Phân phối đồng thời, Phân phối biên & Tương quan (Joint Distribution, Marginal Distribution & Correlation)** directly following Node 2 (`3.4 Mean Vector, Covariance & Covariance Matrix`) in Chapter 3 (`foundations-descriptive-statistics`).

This lesson contains 23 authored Vietnamese MDX pages with responsive interactive renderers, mathematical formulas in `<MdxFormula />`, structured Python code blocks, and TOC display title shifts for subsequent statistics lessons.

---

## Content Outline (23 Pages)

1. **Page 0**: Từ từng biến riêng sang phân phối chung ($x_i \in \mathbb{R} \to \mathbf{x}_i = [x_i, y_i]^\top$, table to scatter plot).
2. **Page 1**: Joint distribution ($p_{X,Y}(x,y)$, $f_{X,Y}(x,y)$, scatter plot + 2D density heatmap visual).
3. **Page 2**: Joint distribution không chỉ là scatter plot (Scatter plot $\to$ 2D histogram $\to$ Density contour).
4. **Page 3**: Marginal distribution là gì? ($p_X(x) = \sum_y p_{X,Y}(x,y)$, $f_X(x) = \int f_{X,Y}(x,y)dy$).
5. **Page 4**: Chiếu dữ liệu xuống từng trục (Visual/Animation: 2D scatter projected down to X histogram and right to Y histogram).
6. **Page 5**: Marginal mean và marginal variance ($\mu_X, \mu_Y$ from mean vector & $\sigma_X^2, \sigma_Y^2$ from diagonal of $\boldsymbol{\Sigma}$).
7. **Page 6**: Marginal không giống conditional ($f_X(x)$ integration vs $f_{X|Y}(x|y)$ slice).
8. **Page 7**: Tại sao covariance chưa đủ? (Scale dependence: $X_{\text{cm}} = 100X_{\text{m}} \implies \operatorname{Cov} \times 100$).
9. **Page 8**: Correlation ($\rho_{XY} = \frac{\operatorname{Cov}(X,Y)}{\sigma_X \sigma_Y}$, range $[-1, 1]$).
10. **Page 9**: Đọc dấu của correlation ($\rho > 0, \rho < 0, \rho \approx 0$).
11. **Page 10**: Độ lớn của correlation ($|\rho|$ magnitude, linear alignment).
12. **Page 11**: Correlation chỉ đo quan hệ tuyến tính ($Y = X^2$ U-shape caveat, $\rho \approx 0$).
13. **Page 12**: Correlation không đồng nghĩa causation (Ice cream vs swimming temperature confounding example).
14. **Page 13**: Correlation matrix ($\mathbf{R} \in \mathbb{R}^{d \times d}$, diagonal = 1, symmetry, comparison table with covariance matrix).
15. **Page 14**: Standardization và correlation ($Z_X = (X-\mu_X)/\sigma_X$, $\operatorname{Cov}(\mathbf{Z}) = \mathbf{R}$).
16. **Page 15**: Code: joint và marginal distributions (`multivariate_normal`, `add_gridspec` 2D scatter + top/right marginal histograms).
17. **Page 16**: Code: marginal statistics (`np.mean`, `np.var`, `np.diag(cov)` match).
18. **Page 17**: Code: covariance và correlation (`np.cov`, `np.corrcoef`).
19. **Page 18**: Code: kiểm tra correlation không đổi khi đổi đơn vị ($X_{\text{m}}$ vs $X_{\text{cm}}$).
20. **Page 19**: Code: quan hệ phi tuyến nhưng correlation gần 0 ($Y = X^2$, $\rho \approx 0$).
21. **Page 20**: Mini interaction: tạo marginal distributions (Interactive projection buttons: Project onto X, Project onto Y).
22. **Page 21**: Mini interaction: correlation slider ($\rho: -1 \to 1$, live matrix & synthesis task).
23. **Page 22**: Những lỗi thường gặp (6 points).

---

## Planned Components & Files

1. **New Renderers File**: `src/components/learning/domains/statistics/jointMarginalCorrelationRenderers.tsx`
   - `JointMarginalConceptVisual`: Visual renderer handling 9 modes (`table-to-scatter`, `joint-heatmap`, `joint-representations`, `axis-projection`, `marginal-vs-conditional`, `scale-dependence`, `correlation-signs`, `non-linear-ushape`, `causation-confounding`).
   - `MarginalProjectionExplorer`: Interactive 2D scatter plot with dynamic projection buttons ("Project onto X", "Project onto Y") displaying marginal histograms, marginal mean, and marginal variance.
   - `CorrelationMatrixExplorer`: Interactive Pearson correlation explorer with smooth slider ($\rho: -1 \to +1$), live correlation matrix display, and task checklist.

2. **Component Registry Integration**:
   - `src/content/learning/mdxComponents.ts`: Register `'JointMarginalConceptVisual'`, `'MarginalProjectionExplorer'`, and `'CorrelationMatrixExplorer'`.
   - `src/components/learning/domains/statistics/mdxComponents.tsx`: Import and export renderers in `statisticsMdxComponents`.

3. **Authored MDX Lesson File**:
   - `src/content/learning/statistics/3.5-joint-marginal-correlation.vi.mdx` (23 pages).

4. **TOC & Subsequence Title Shifts**:
   - `src/content/learning/statistics/table-of-contents.ts`:
     - Register `joint-marginal-correlation` as `3.5`.
     - Shift display numbers for subsequent lessons (`normal-distribution` $\to 3.6$, `point-estimation` $\to 3.7$, `sampling-distributions-standard-errors` $\to 3.8$, `ch02-python-introduction-lab` $\to 3.9$).
   - Sync `lessonMetadata.title` in:
     - `3.3-normal-distribution.vi.mdx` $\to$ `3.6 Phân phối chuẩn (Normal Distribution)`
     - `3.2-point-estimation.vi.mdx` $\to$ `3.7 Ước lượng điểm`
     - `2.3-ch02-python-introduction-lab.vi.mdx` $\to$ `3.9 Lab: Python cho công việc thống kê`

5. **Test Updates**:
   - `src/lib/learningCatalog.test.ts` & `src/lib/learningMdxContent.test.ts`:
     - Published statistics lessons: 111.
     - Total statistics lessons: 125.
     - Total catalog lessons: 727.

---

## Verification Plan

Run `npm run verify` to ensure clean TypeScript compilation (`tsc`), pass 100% of unit test suites, and verify production build bundle generation.

## Execution Log

- 2026-08-03 — Published the 23-page lesson, registered its three renderers, updated catalog ordering and tests, and passed consolidated verification.

---
title: Add Multivariate Normal Distribution Node
status: done
created: 2026-08-03T00:53:00+07:00
updated: 2026-08-03T02:15:00+07:00
author: Codex
task: "Add the Multivariate Normal Distribution node after the univariate Normal lesson."
supersedes:
  - 2026-08-03-joint-marginal-correlation-node.md
---

# Node 4 — Multivariate Normal Distribution Implementation Plan

# Lineage

Continues [Joint Distribution, Marginal Distribution & Correlation](./2026-08-03-joint-marginal-correlation-node.md).

## Overview

Add Node 4 titled **3.6 Phân phối chuẩn nhiều chiều (Multivariate Normal Distribution)** directly following Node 3 (`3.5 Joint Distribution, Marginal Distribution & Correlation`) in Chapter 3 (`foundations-descriptive-statistics`).

This lesson contains 22 authored Vietnamese MDX pages with interactive visual renderers, mathematical formulas in `<MdxFormula />`, structured Python code blocks, and TOC display title shifts for subsequent statistics lessons.

---

## Content Outline (22 Pages)

1. **Page 0**: Từ bell curve một chiều sang nhiều chiều ($X \sim \mathcal{N}(\mu, \sigma^2) \to \mathbf{X} \sim \mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma})$, 1D curve $\to$ 2D points $\to$ 2D bell hill/contours).
2. **Page 1**: Ký hiệu của phân phối chuẩn nhiều chiều ($\mathbf{X} \sim \mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma})$, $\boldsymbol{\mu} \in \mathbb{R}^d$, $\boldsymbol{\Sigma} \in \mathbb{R}^{d \times d}$).
3. **Page 2**: Hàm mật độ xác suất ($f(\mathbf{x}) = \frac{1}{(2\pi)^{d/2} |\boldsymbol{\Sigma}|^{1/2}} \exp(-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^\top \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu}))$ & quadratic form).
4. **Page 3**: Mean vector quyết định tâm ($\boldsymbol{\mu} = [2, 5]^\top$, sliders $\mu_1, \mu_2$ translation visual).
5. **Page 4**: Covariance matrix quyết định hình dạng ($\sigma_X^2, \sigma_Y^2, \sigma_{XY}$ rule).
6. **Page 5**: Contour có dạng ellipse ($(\mathbf{x}-\boldsymbol{\mu})^\top \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu}) = c$, 1-sigma & 2-sigma concentric ellipses).
7. **Page 6**: Thay đổi variance theo từng chiều ($\boldsymbol{\Sigma} = \operatorname{diag}(4, 1)$ vs $\operatorname{diag}(1, 4)$, horizontal vs vertical spread).
8. **Page 7**: Covariance làm ellipse nghiêng ($\sigma_{XY} > 0, \sigma_{XY} < 0, \sigma_{XY} = 0$).
9. **Page 8**: Eigenvectors và eigenvalues ($\boldsymbol{\Sigma} = \mathbf{Q} \boldsymbol{\Lambda} \mathbf{Q}^\top$, principal axis vectors).
10. **Page 9**: Marginal distributions vẫn là Gaussian ($X \sim \mathcal{N}(\mu_X, \sigma_X^2), Y \sim \mathcal{N}(\mu_Y, \sigma_Y^2)$).
11. **Page 10**: Covariance bằng 0 và độc lập ($\operatorname{Cov}(X,Y) = 0 \iff X \perp Y$ for Joint Gaussian).
12. **Page 11**: Standard multivariate normal distribution ($\mathbf{Z} \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$, circular contours, identity matrix).
13. **Page 12**: Standardization không tạo identity covariance ($\mathbf{Z} = (X-\boldsymbol{\mu})/\boldsymbol{\sigma} \implies \operatorname{Cov}(\mathbf{Z}) = \mathbf{R} \neq \mathbf{I}$).
14. **Page 13**: Mahalanobis distance ($D_M(\mathbf{x}) = \sqrt{(\mathbf{x}-\boldsymbol{\mu})^\top \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu})}$, Euclidean vs Mahalanobis comparison).
15. **Page 14**: Code sinh dữ liệu Gaussian nhiều chiều (`multivariate_normal`, scatter plot + mean marker).
16. **Page 15**: Code kiểm tra mean và covariance (`np.mean`, `np.cov`, sample error convergence).
17. **Page 16**: Code so sánh các covariance matrix (Wide X, positive cov, negative cov).
18. **Page 17**: Code marginal distributions (Histograms for X and Y).
19. **Page 18**: Code tính Mahalanobis distance (`np.linalg.inv`, quadratic form computation).
20. **Page 19**: Ứng dụng trong AI (Gaussian noise, Anomaly detection, Gaussian classifier, Kalman filter, Latent-variable models, Generative models).
21. **Page 20**: Mini interaction tổng hợp (Full interactive controls $\mu_X, \mu_Y, \sigma_X^2, \sigma_Y^2, \sigma_{XY}$, 4 task checklist).
22. **Page 21**: Những lỗi thường gặp (6 points).

---

## Planned Components & Files

1. **New Renderers File**: `src/components/learning/domains/statistics/multivariateNormalRenderers.tsx`
   - `MultivariateNormalConceptVisual`: Visual renderer handling 9 modes (`1d-to-2d-bell`, `notation-breakdown`, `density-contour-levels`, `eigenvector-axes`, `gaussian-marginals`, `standard-normal-circle`, `standardization-vs-whitening`, `mahalanobis-vs-euclidean`, `ai-applications`).
   - `MultivariateNormalExplorer`: Interactive 2D Gaussian density explorer with sliders ($\mu_X, \mu_Y, \sigma_X^2, \sigma_Y^2, \sigma_{XY}$), real-time 1-sigma / 2-sigma contour rendering, sample point cloud, live mean vector & covariance matrix display, and task checklist.

2. **Component Registry Integration**:
   - `src/content/learning/mdxComponents.ts`: Register `'MultivariateNormalConceptVisual'` and `'MultivariateNormalExplorer'`.
   - `src/components/learning/domains/statistics/mdxComponents.tsx`: Import and export renderers in `statisticsMdxComponents`.

3. **Authored MDX Lesson File**:
   - `src/content/learning/statistics/3.6-multivariate-normal-distribution.vi.mdx` (22 pages).

4. **TOC & Subsequence Title Shifts**:
   - `src/content/learning/statistics/table-of-contents.ts`:
     - Register `multivariate-normal-distribution` as `3.6`.
     - Shift display numbers for subsequent lessons (`normal-distribution` $\to 3.7$, `point-estimation` $\to 3.8$, `sampling-distributions-standard-errors` $\to 3.9$, `ch02-python-introduction-lab` $\to 3.10$).
   - Sync `lessonMetadata.title` in:
     - `3.3-normal-distribution.vi.mdx` $\to$ `3.7 Phân phối chuẩn (Normal Distribution)`
     - `3.2-point-estimation.vi.mdx` $\to$ `3.8 Ước lượng điểm`
     - `2.3-ch02-python-introduction-lab.vi.mdx` $\to$ `3.10 Lab: Python cho công việc thống kê`

5. **Test Updates**:
   - `src/lib/learningCatalog.test.ts` & `src/lib/learningMdxContent.test.ts`:
     - Published statistics lessons: 112.
     - Total statistics lessons: 126.
     - Total catalog lessons: 728.

---

## Verification Plan

Run `npm run verify` to ensure clean TypeScript compilation (`tsc`), pass 100% of unit test suites, and verify production build bundle generation.

## Execution Log

- 2026-08-03 — Published the 22-page lesson, registered both renderers, placed it after the univariate Normal lesson, updated tests, and passed consolidated verification.

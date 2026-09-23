---
title: Machine Learning domain curriculum design, restructuring, and roadmap
status: done
created: 2026-09-21
updated: 2026-09-24
author: Antigravity
task: "Consolidate Machine Learning domain curriculum design, prerequisites, missing algorithms, uncertainty modeling, code lab placeholders, and branch integration"
supersedes:
  - docs/plans/2026-09-21-machine-learning-main-merge.md
  - docs/plans/2026-09-22-machine-learning-linear-algebra-prerequisites.md
  - docs/plans/2026-09-23-machine-learning-value-flow.md
  - docs/plans/2026-09-23-machine-learning-regression-classification.md
  - docs/plans/2026-09-23-machine-learning-missing-algorithms.md
  - docs/plans/2026-09-23-machine-learning-uncertainty.md
  - docs/plans/2026-09-23-machine-learning-code-labs.md
  - docs/plans/2026-09-24-machine-learning-main-merge.md
---

# Goal & Executive Summary

Establish the complete, canonical curriculum for the **Machine Learning** (`fundamentals`) domain in TorchViz-3D Learning Lab. The course structure transitions learners from mathematical foundations into practical Machine Learning workflows, spanning 7 chapters and 43 pairs (87 lesson nodes) structured across tabular modeling, evaluation, ensembles, unsupervised learning, hyperparameter tuning, and Scikit-Learn architecture.

This document consolidates and supersedes all intermediate branch plans (requests 1 through 8 and main merges) into a single authoritative record.

---

# Architecture & Pedagogical Decisions

### 1. Externalize Tensor & Shape Prerequisites to Linear Algebra
- Scalar/vector/matrix/tensor representations, dimension contracts, and matrix multiplication are externalized to the existing `linear-algebra` domain (`linear-algebra-for-ai-overview`, `matrix-operations`, `elementwise-vs-matrix-product`).
- The redundant opening `tensor-shape-fundamentals` track and `shape-basics` lesson/quiz were retired, retaining clean route aliases (`tensor-shape-fundamentals` -> `linear-regression-foundations`, `shape-basics` -> `linear-activation`).
- `linear-activation` introduces a concise reminder of sample/feature/batch conventions and links to Linear Algebra prerequisites before focusing on affine transforms and activation mechanics.

### 2. Value Flow Sequencing
- `linear-activation` (affine transformation, nonlinear composition, ReLU/tanh/sigmoid saturation, and softmax decision boundaries) is placed immediately following `logistic-regression`.
- Legacy `value-flow` bookmarks resolve seamlessly via route aliases.

### 3. Integrate Core ML Concepts into Problem-Driven Chapters
- Rather than teaching generic concepts in isolation, core workflow foundations are integrated directly into the modeling narrative:
  - Chapter 1: Problem framing, train/val/test splits, regression loss functions, underfitting/overfitting, bias-variance tradeoff, L1/L2 regularization, K-fold cross-validation, and regression evaluation metrics.
  - Chapter 2: Logistic classification, decision boundaries, multi-class strategies (One-vs-Rest), distance and probabilistic baselines, and classification evaluation metrics.

### 4. Separate Evaluation Metrics by Task
- Mixed metric lessons were replaced with task-specific theory and quiz pairs:
  - `regression-metrics`: MAE, MSE, RMSE, R², MAPE, residual analysis, baseline models.
  - `classification-metrics`: Confusion matrix, Precision, Recall, F1, ROC-AUC vs PR-AUC, macro/micro averaging, threshold selection.
- Clear separation between training loss (differentiable optimization surrogate) and evaluation metrics (interpretable business criteria).

### 5. Add Core Missing Algorithms
- Supervised classification: Added `k-nearest-neighbors`, `naive-bayes`, and `support-vector-machines` before classification evaluation, with discussions of regression variants (k-NN regression, SVR).
- Unsupervised learning: Added `gaussian-mixture-models` (soft clustering, covariance types, EM algorithm) immediately following `k-means-clustering`.

### 6. Uncertainty, Variability & Interval Estimation
- Three adjacent theory and assessment pairs inserted between cross-validation and evaluation metrics:
  - `variability-splits-seeds`: Demonstrates score variance across data splits, random seeds, and dependent CV folds.
  - `bootstrap-confidence-intervals`: Estimator uncertainty via non-parametric bootstrap resampling for fixed models.
  - `prediction-intervals`: Distinguishes confidence intervals for the conditional mean from prediction intervals for new individual observations.

### 7. Code Labs Structured as Placeholders
- 6 hands-on Code Labs define the applied practical spine across the chapters:
  1. `leakage-code-lab` (Data leakage detection in preprocessing)
  2. `linear-regression-code-lab` (From analytic OLS to Scikit-Learn)
  3. `mixed-classification-code-lab` (ColumnTransformer & classification pipeline)
  4. `model-comparison-code-lab` (Benchmarking Logistic Regression, Random Forest, Gradient Boosting)
  5. `clustering-code-lab` (Unlabeled clustering and silhouette evaluation)
  6. `nested-cv-code-lab` (Nested cross-validation without test leakage)
- In this milestone, the 6 code lab theory nodes are registered in the TOC as placeholders (`status: 'locked'`, `contentStatus: 'missing'`), deferring the full runnable notebook/script packages to a subsequent release milestone.
- The 6 corresponding lab quizzes remain active and published (`status: 'available'`, `contentStatus: 'published'`) to evaluate practical workflow understanding (data hygiene, leakage traps, model comparison caveats, and evaluation integrity).

---

# Curriculum Map (7 Chapters, 87 Nodes)

| Chapter | Track ID | Published Nodes | Placeholder Lab Nodes | Total Nodes |
|---|---|---|---|---|
| **1. Linear Regression** | `linear-regression-foundations` | 26 nodes (12 theory + 14 quizzes) | 2 lab nodes (`leakage`, `linear-regression`) | 28 nodes |
| **2. Logistic & Classification** | `logistic-classification` | 15 nodes (7 theory + 8 quizzes) | 1 lab node (`mixed-classification`) | 16 nodes |
| **3. Decision Trees & Ensembles** | `decision-trees-ensembles` | 9 nodes (4 theory + 5 quizzes) | 1 lab node (`model-comparison`) | 10 nodes |
| **4. Unsupervised Learning** | `unsupervised-learning` | 11 nodes (5 theory + 6 quizzes) | 1 lab node (`clustering`) | 12 nodes |
| **5. Hyperparameter Tuning** | `hyperparameter-tuning` | 9 nodes (4 theory + 5 quizzes) | 1 lab node (`nested-cv`) | 10 nodes |
| **6. ML with Scikit-Learn** | `ml-with-scikit-learn` | 10 nodes (5 pairs) | — | 10 nodes |
| **7. Course Synthesis** | `ml-llm-synthesis` | 1 standalone synthesis node | — | 1 node |
| **Total** | | **81 published nodes** | **6 placeholder lab nodes** | **87 nodes** |

---

# Verification & Test Coverage

- **TOC Invariants**: Every track retains canonical alternating theory-quiz pairs.
- **Route Aliases**: Legacy bookmarks (`tensor-shape-fundamentals`, `value-flow`, `core-ml-concepts`, `linear-logistic-regression`, `evaluation-metrics`) resolve deterministically in both multi-domain and single-domain catalog modes.
- **Catalog Totals**:
  - Global Catalog after the main rebase: 17 domains, 110 tracks, 921 lessons, 473 published, 448 placeholders / missing, 15 route aliases.
  - Domain `fundamentals`: 7 tracks, 87 lessons (81 published, 6 placeholders).
- **Automated Test Suite**: Full test pass via `npm test` and `npm run verify` (typecheck, tests, production build).

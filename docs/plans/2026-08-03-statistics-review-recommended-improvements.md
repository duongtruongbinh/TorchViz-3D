---
title: Statistics Ch.1–3 Content Review Recommended Improvements
status: done
created: 2026-08-03
updated: 2026-08-03
author: antigravity
task: Implement 13 recommended improvements from the comprehensive Probability & Statistics review across Chapters 1-3
supersedes:
  - 2026-08-03-statistics-review-critical-fixes.md
---

# Statistics Ch.1–3 Content Review Recommended Improvements

Following the completed critical fixes, this plan implements the 13 recommended improvements identified during the comprehensive review of Chapter 1 (Probability) and Chapters 2–3 (Statistical Thinking & Descriptive Statistics).

## Lineage

Supersedes [2026-08-03-statistics-review-critical-fixes.md](2026-08-03-statistics-review-critical-fixes.md) which completed the 6 critical fixes (TOC node swap, Laplace notation, visual-only page text, and verified calculations).

## Key Objectives

1. **Learning Objectives**: Add explicit, measurable learning outcomes ("Sau bài này, bạn sẽ...") to the start of every lesson node across Chapters 1, 2, and 3.
2. **English Terminology**: Introduce standard English probability & statistics terms in parentheses upon first usage (e.g., *sample space*, *mutually exclusive*, *Bessel's correction*).
3. **Python Code Examples & AI Applications**: Add runnable Python code blocks (`numpy`, `scipy.stats`, `matplotlib`) with explicit output observations and AI/ML context for Chapter 1 theory lessons (1.1 to 1.8).
4. **Common Misconceptions**: Add `LessonNote tone="warning"` callouts for common pitfalls (e.g., $P(A \mid B)$ vs $P(B \mid A)$, independent vs mutually exclusive, $1/n$ vs $1/(n-1)$, standardization vs normality).
5. **Standalone Topic Quizzes**: Create dedicated quiz nodes for core topics that currently lack standalone quizzes:
   - `variance-standard-deviation-quiz`
   - `mean-vector-covariance-matrix-quiz`
   - `normal-distribution-quiz`
   - `multivariate-normal-distribution-quiz`
   - `point-estimation-quiz`
6. **Chapter Summary Quizzes**: Add comprehensive 10-question chapter quizzes for Chapter 1 (Probability) and Chapter 3 (Descriptive Statistics & Estimation).

## Proposed Changes

### Phase 1: Learning Objectives & English Terminology

#### [MODIFY] Chapter 1 Lessons
- [1.1-ch01-experiments-events-sample-space.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.1-ch01-experiments-events-sample-space.vi.mdx)
- [1.2-ch01-event-relations.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.2-ch01-event-relations.vi.mdx)
- [1.3-ch01-probability-definitions-properties.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.3-ch01-probability-definitions-properties.vi.mdx)
- [1.4-ch01-empirical-probability.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.4-ch01-empirical-probability.vi.mdx)
- [1.5-ch01-conditional-probability.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.5-ch01-conditional-probability.vi.mdx)
- [1.6-ch01-total-probability.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.6-ch01-total-probability.vi.mdx)
- [1.7-ch01-probability-origins.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.7-ch01-probability-origins.vi.mdx)
- [1.8-ch01-bayes-naive-bayes.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.8-ch01-bayes-naive-bayes.vi.mdx)

Add "Mục tiêu học tập" callouts at the top of Page 0 and embed English terminology italicized upon first appearance.

#### [MODIFY] Chapter 2 & 3 Lessons
- [2.0-ch02-classical-statistics-fundamentals.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/2.0-ch02-classical-statistics-fundamentals.vi.mdx)
- [2.2-ch02-populations-samples-observation.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/2.2-ch02-populations-samples-observation.vi.mdx)
- [2.0.2-statistics-criticism.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/2.0.2-statistics-criticism.vi.mdx)
- [3.0-histogram-foundations.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/3.0-histogram-foundations.vi.mdx)
- [3.1-descriptive-data-analysis.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/3.1-descriptive-data-analysis.vi.mdx)
- [3.3-variance-standard-deviation.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/3.3-variance-standard-deviation.vi.mdx)
- [3.4-mean-vector-covariance-matrix.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/3.4-mean-vector-covariance-matrix.vi.mdx)
- [3.5-joint-marginal-correlation.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/3.5-joint-marginal-correlation.vi.mdx)
- [3.3-normal-distribution.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/3.3-normal-distribution.vi.mdx)
- [3.6-multivariate-normal-distribution.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/3.6-multivariate-normal-distribution.vi.mdx)
- [3.2-point-estimation.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/3.2-point-estimation.vi.mdx)

Add "Mục tiêu học tập" callouts at Page 0 of each lesson.

---

### Phase 2: Python Code Examples & Misconceptions for Chapter 1

#### [MODIFY] [1.1-ch01-experiments-events-sample-space.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.1-ch01-experiments-events-sample-space.vi.mdx)
Add Python code using `itertools.product` to generate sample spaces and extract event subsets.

#### [MODIFY] [1.2-ch01-event-relations.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.2-ch01-event-relations.vi.mdx)
Add Python code using set operations (`|`, `&`, `-`) to demonstrate union, intersection, and complement.

#### [MODIFY] [1.3-ch01-probability-definitions-properties.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.3-ch01-probability-definitions-properties.vi.mdx)
Add Python code for classical probability calculation and addition rule.

#### [MODIFY] [1.4-ch01-empirical-probability.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.4-ch01-empirical-probability.vi.mdx)
Add Python simulation code showing frequency convergence to theoretical probability (Law of Large Numbers).

#### [MODIFY] [1.5-ch01-conditional-probability.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.5-ch01-conditional-probability.vi.mdx)
Add misconception callouts: $P(A \mid B)$ vs $P(B \mid A)$, and independent vs mutually exclusive. Add Python code using pandas crosstab.

#### [MODIFY] [1.6-ch01-total-probability.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.6-ch01-total-probability.vi.mdx)
Add Python code for weighted sum calculation over partitions.

#### [MODIFY] [1.8-ch01-bayes-naive-bayes.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.8-ch01-bayes-naive-bayes.vi.mdx)
Add complete Python Naive Bayes code snippet with NumPy and scikit-learn comparison.

---

### Phase 3: Standalone Topic Quizzes

#### [NEW] [variance-standard-deviation-quiz.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/variance-standard-deviation-quiz.vi.mdx)
5 questions testing variance, std dev, Bessel correction ($n-1$), degrees of freedom, and `ddof=1` vs `ddof=0`.

#### [NEW] [mean-vector-covariance-matrix-quiz.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/mean-vector-covariance-matrix-quiz.vi.mdx)
5 questions testing mean vector, covariance sign, reading a $2 \times 2$ covariance matrix, and `np.cov(rowvar=False)`.

#### [NEW] [normal-distribution-quiz.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/normal-distribution-quiz.vi.mdx)
5 questions testing Gaussian mean/std parameters, 68-95-99.7 rule, z-score standardization, and skewness vs normality.

#### [NEW] [multivariate-normal-distribution-quiz.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/multivariate-normal-distribution-quiz.vi.mdx)
5 questions testing mean vector center, covariance ellipse orientation, uncorrelated vs independent in joint Gaussian, and Mahalanobis distance.

#### [NEW] [point-estimation-quiz.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/point-estimation-quiz.vi.mdx)
5 questions testing parameter vs statistic, unbiased estimators, sample mean / sample variance, MLE intuition, and MSE.

#### [MODIFY] [table-of-contents.ts](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/table-of-contents.ts)
Register the 5 new quiz nodes under their respective track section entries.

#### [MODIFY] [learningMdxContent.test.ts](file:///home/khiem/TorchViz-3D/src/lib/learningMdxContent.test.ts)
Update test assertions for track lesson lists to include the new quiz nodes.

---

### Phase 4: Chapter Summary Quizzes

#### [NEW] [ch01-probability-summary-quiz.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/ch01-probability-summary-quiz.vi.mdx)
10-question comprehensive end-of-chapter quiz for Chapter 1 combining events, classical/empirical probability, conditioning, total probability, and Bayes/Naive Bayes.

#### [NEW] [ch03-descriptive-statistics-summary-quiz.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/ch03-descriptive-statistics-summary-quiz.vi.mdx)
10-question comprehensive end-of-chapter quiz for Chapter 3 combining histograms, mean/median/mode, variance, covariance matrices, normal distributions, and point estimation.

#### [MODIFY] [table-of-contents.ts](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/table-of-contents.ts)
Register summary quizzes at the end of Chapter 1 and Chapter 3 tracks.

## Verification Plan

### Automated Tests
- Run `npm run verify` to validate MDX contracts, catalog integrity, typed TOC matching, typechecking, and production build.

### Manual Inspection
- Ensure all MDX files render correctly with KaTeX formulas, callouts, and quiz interactions without syntax or component errors.

# Execution Log

- 2026-08-03 — Added learning objectives, bilingual terminology, Python examples, misconception callouts, five topic quizzes, and two chapter summary quizzes; consolidated verification passed.

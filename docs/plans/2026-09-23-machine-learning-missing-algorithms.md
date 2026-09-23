---
title: Add k-NN, Naive Bayes, SVM and GMM
status: done
created: 2026-09-23
updated: 2026-09-23
author: Codex
task: "Complete leader request 6"
supersedes:
  - docs/plans/2026-09-23-machine-learning-regression-classification.md
---

# Lineage and authorization
Continues [regression/classification restructuring](./2026-09-23-machine-learning-regression-classification.md).
The user explicitly requested completion of request 6. Preserve requests 1-5,
existing titles, and unrelated Workspace WIP. Requests 7-8 are future work.

# Decisions
Add k-nearest-neighbors, naive-bayes, support-vector-machines pairs after OvR
and before classification metrics. Discuss k-NN regression and SVR as related
variants with the existing regression evaluation, without duplicating lessons.
Add gaussian-mixture-models immediately after K-Means. Preserve all old IDs/routes.
Use four theory pages and four mixed-mode questions per algorithm; concrete
numbers, assumptions, failure modes and train-only preprocessing are required.
Keep theory and quiz conceptIds aligned with assessment IDs. Use existing MDX
components, no new UI/runtime. Link official scikit-learn documentation for API
details. Update TOC descriptions, neighboring transitions, synthesis and wiki.

# Verification
Expected catalog: 102 tracks, 816 lesson nodes, 378 published; fundamentals 69.
Test canonical order, theory/quiz metadata, math rendering, typecheck, full tests,
production build and catalog stats. No commit or push.

# Execution log
- Inspected current pr-88 working tree, TOC and neighboring lessons; checked
  official scikit-learn user guides for the four algorithm families.
- Added eight MDX files: four theory/quiz pairs. Each theory has four pages,
  each quiz four mixed-mode questions with IDs matching theory conceptIds.
  Content covers numerical predictions, conditional independence/smoothing,
  margin/hinge loss/C/RBF, responsibilities/covariance/EM, and validation pitfalls.
- Registered supervised pairs before classification metrics and GMM between
  K-Means and DBSCAN. Updated neighboring transitions and course synthesis.
  Existing lesson IDs and the user's title correction remain intact.
- Verification passed: npm run verify (typecheck, 166 tests, production build),
  check:catalog-stats, diff --check. All seven new KaTeX formulas render; Bayes,
  RBF and EM numerical examples checked independently. Final counts: 102 tracks,
  816 lessons, 378 published; fundamentals has 69 published nodes.
- No browser visual inspection, commit or push. Workspace files were not edited.

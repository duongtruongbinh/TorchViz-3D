---
title: Add split-seed variability and uncertainty intervals
status: done
created: 2026-09-23
updated: 2026-09-23
author: Codex
task: "Complete leader request 7"
supersedes:
  - docs/plans/2026-09-23-machine-learning-missing-algorithms.md
---

# Lineage and authorization
Continues [missing algorithms](./2026-09-23-machine-learning-missing-algorithms.md).
User explicitly requested completion of request 7. Preserve existing changes,
including the corrected title and Workspace WIP. Code labs (request 8) are deferred.

# Decisions
Insert three adjacent theory/quiz pairs after CV and before regression metrics:
variability-splits-seeds, bootstrap-confidence-intervals, prediction-intervals.
Use housing examples and distinct estimands: split/training variability,
fixed-model evaluation uncertainty, and uncertainty for a new response.
Explain paired comparisons, dependent CV folds, correct bootstrap resampling
units, percentile limitations, and confidence versus prediction intervals.
For prediction intervals teach simple OLS with explicit assumptions, numerical
width comparison, and empirical coverage/width checks; briefly introduce quantile
alternatives without turning this into an advanced conformal prediction course.
Keep four questions per pair, matching theory conceptIds, with varied modes.
Update CV/metric/synthesis transitions and link shared methods from classification.
Existing routes and UI stay unchanged. Update tests, stats and canonical wiki.

# Verification
Expected totals: 102 tracks, 822 lessons, 384 published; fundamentals 75 lessons.
Check metadata, route order, formulas and numerical examples; run verify, stats
check and diff check. No commit or push.

# Execution log
- Inspected current curriculum and official SciPy bootstrap/scikit-learn randomness
  references. Planning and implementation authorized by the user's request.
- Added six MDX files, three theory/quiz pairs with four pages and four questions
  each. Theory and assessment conceptIds/question IDs match. Updated CV, both
  metric lessons and synthesis; classification links reuse the shared methods.
- Explained fixed-model bootstrap versus retraining, paired resampling, grouped
  and temporal data caveats, rare-class undefined metrics, dependent CV folds,
  and mean-response CI versus individual-response PI. Added OLS assumptions,
  a numerical interval-width comparison and coverage/width evaluation guidance.
- Verification passed: npm run verify (typecheck, 166 tests, production build),
  check:catalog-stats; independently rendered four KaTeX formulas and checked
  numerical examples plus three canonical routes. Catalog now has 822 lessons,
  384 published, 102 tracks; fundamentals has 75 nodes.
- No browser visual inspection performed. No commit or push. Request 8 remains
  separate; existing Workspace files were not edited.

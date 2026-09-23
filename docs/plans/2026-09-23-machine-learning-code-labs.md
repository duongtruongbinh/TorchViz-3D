---
title: Six end-to-end Machine Learning code labs
status: done
created: 2026-09-23
updated: 2026-09-23
author: Codex
task: "Complete leader request 8"
supersedes:
  - docs/plans/2026-09-23-machine-learning-uncertainty.md
---

# Lineage and authorization
Continues [uncertainty](./2026-09-23-machine-learning-uncertainty.md).
Implementation authorized by the user's explicit request to complete item 8.
Preserve all prior curriculum and unrelated Workspace changes. No commit or push.

# Design
Add six lab/quiz pairs next to their relevant topics. Use one deterministic,
explicitly synthetic housing dataset with mixed features throughout. Share a
downloadable Python module with dataset generation, fixed development/holdout
split and a ColumnTransformer/Pipeline factory. Labs run locally, not in the
Workspace torchstub runtime. No extra UI or MDX components.

Cover target leakage auditing, OLS versus sklearn, mixed classification,
paired model comparisons, unlabeled clustering and nested CV. The first five
labs access development data only; the final lab opens the held-out test only
under an explicit final-evaluation flag. Persist the complete final pipeline.
Each quiz has four varied questions whose IDs match the lab conceptIds.

# Verification
Execute all six Python labs in an isolated environment; check dataset isolation,
OLS equivalence, preprocessing, reproducibility and serialized predictions.
Test that displayed Python functions match downloadable code. Run npm verify,
catalog statistics sync/check and diff check. Expected totals: 834 lesson nodes,
396 published, 102 tracks; fundamentals 87 nodes. Update canonical wiki and log.

# Execution log
- Inspected existing MDX code labs, typed TOC and Vite static asset support.
- Reviewed official sklearn pipeline, mixed preprocessing and nested CV examples.
- Added six four-page lab lessons and six four-question quizzes, including
  single-choice, multi-select and categorization, with matching concept IDs.
  Registered pairs in the relevant chapters and linked the path from synthesis.
- Added one downloadable Python module and pinned Python dependencies. The
  module shares one deterministic dataset, development/holdout partition and
  preprocessing factory; the final lab persists the complete selected pipeline.
- Added Python tests for split isolation, fold-local preprocessing, OLS
  equivalence, category handling, comparisons, target-free clustering, default
  holdout isolation and final persistence roundtrip. All six tests passed in
  an isolated Python 3.13 environment. A Windows physical-core detection warning
  fell back to logical cores and did not affect execution.
- Pinned SciPy 1.15.3 to avoid solver-option warnings with sklearn 1.6.1.
  Fixed a whitespace mismatch caught by the new MDX/download parity test.
- npm run verify passed: typecheck, 167 tests, production build. Catalog
  statistics check and git diff --check passed (existing CRLF notices only).
  Catalog now has 834 nodes and 396 published lessons; fundamentals has 87.
- No browser visual inspection performed. No commit or push. Unrelated Workspace
  file diffs remain unchanged.

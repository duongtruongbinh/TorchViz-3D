---
title: Sales Forecasting Conformal Interval Code Node
status: done
created: 2026-09-06T23:10:00+07:00
updated: 2026-09-06T23:32:00+07:00
author: nmkhiem
task: "Add one small Code node that improves the LightGBM and SHAP sales forecasting project"
supersedes:
  - docs/plans/2026-09-06-ai-projects-domain-init.md
---

# Goal

Add one concise Vietnamese Code node after model evaluation that turns the notebook's point forecast into an auditable prediction interval using time-ordered, out-of-fold conformal calibration.

# Lineage

Continues [AI Projects Sales Forecasting Domain](./2026-09-06-ai-projects-domain-init.md).

# Decisions

- Reuse the notebook's existing date splits, LightGBM pipeline, features, and metrics; do not rewrite the project.
- Calibrate an absolute-error radius only from historical out-of-fold predictions, never from the final test labels.
- Teach the finite-sample conformal quantile, lower/upper construction, empirical coverage, and mean interval width.
- State the time-series limitation clearly: coverage is diagnostic under distribution shift, not an unconditional future guarantee.
- Keep the lesson code-first, Light-Mode-only, and free of new UI components or generated images.

# Delivered

- Added one four-page Code node immediately before the cumulative quiz.
- Implemented runnable cells for out-of-fold residual collection, finite-sample conformal radius, interval construction, and coverage/width diagnostics.
- Added a catalog-order regression assertion and synchronized Learning Lab counts to 766 nodes and 298 published lessons.

# Verification

- Python syntax check: 4/4 code blocks passed.
- `npm run check:catalog-stats`: passed.
- `npm run verify`: typecheck, 158/158 tests, and production build passed.
- `git diff --check`: clean.

# Execution log

- 2026-09-06 — Plan approved and completed; source notebook left untracked and unchanged.

---
title: Sales Forecasting Rerun, Output, and Plot
status: done
created: 2026-09-06T23:12:00+07:00
updated: 2026-09-06T23:26:00+07:00
author: nmkhiem
task: "Rerun the Sales Forecasting notebook with sales.csv and promotions.csv, then add real output and a plot to the conformal Code node"
supersedes:
  - docs/plans/2026-09-06-sales-forecasting-conformal-code-node.md
---

# Goal

Execute the supplied notebook against the supplied CSV files, capture verified conformal interval results, and add one generated diagnostic plot plus real output to the existing Code node.

# Lineage

Continues [Sales Forecasting Conformal Interval Code Node](./2026-09-06-sales-forecasting-conformal-code-node.md).

# Delivered

- Executed all 69 code cells in an isolated notebook copy against the supplied CSV files without exception.
- Added measured Fold 2/3 residual output and TEST diagnostics to the existing Code node: radius 1,215,280 VND, coverage 92.39% (170/184 days), mean width 2,412,217 VND, and WAPE 0.2038.
- Added a reproducible Light Mode plot and its 1600×900 PNG, including the 14 days outside the interval.

# Verification

- Python syntax: 5/5 lesson code blocks passed.
- `npm run verify`: typecheck, 158/158 tests, and production build passed.
- Source notebook and CSV files remain untracked and unchanged.

# Execution log

- 2026-09-06 — Plan approved, rerun completed, outputs and plot verified.

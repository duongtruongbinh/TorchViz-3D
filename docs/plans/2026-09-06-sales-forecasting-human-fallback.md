---
title: Sales Forecasting Human Fallback Example
status: done
created: 2026-09-06T23:34:00+07:00
updated: 2026-09-06T23:42:00+07:00
author: nmkhiem
task: "Show simply how conformal intervals can trigger human review and reduce business loss"
supersedes:
  - docs/plans/2026-09-06-sales-forecasting-rerun-output-plot.md
---

# Goal

Extend the existing Code node with one short human-in-the-loop page using measured TEST results.

# Lineage

Continues [Sales Forecasting Rerun, Output, and Plot](./2026-09-06-sales-forecasting-rerun-output-plot.md).

# Delivered

- Added one page that flags intervals crossing an illustrative 5,000,000 VND capacity threshold and uses the upper bound for a conservative reviewed fallback.
- Measured a 15/184-day review queue, 4.56% asymmetric-loss reduction, 11.35% shortage reduction, and 46.48% overplanning increase under an explicit 2:1 loss assumption.

# Verification

- The lesson states that the threshold, loss weights, and 4.56% result are illustrative rather than a production guarantee.
- Python syntax: 6/6 code blocks passed.
- `npm run verify`: typecheck, 158/158 tests, and production build passed.

# Execution log

- 2026-09-06 — Plan approved and completed.

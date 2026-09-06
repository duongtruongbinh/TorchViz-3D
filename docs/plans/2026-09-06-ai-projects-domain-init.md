---
title: AI Projects Sales Forecasting Domain
status: done
created: 2026-09-06T13:30:00+07:00
updated: 2026-09-06T23:46:00+07:00
author: nmkhiem
task: "Initialize, audit, and finalize the AI Projects Sales Forecasting curriculum with uncertainty-aware fallback"
supersedes: []
---

# Goal

Publish a typed, Light-Mode-only AI Projects domain with a practical Vietnamese Sales Forecasting curriculum, balanced assessment, and one uncertainty-aware Code lab.

# Lineage

Genesis plan for the `ai-projects` domain.

# Decisions

- Reuse the Research Papers hierarchy as a generic category → topic → track → lesson rail without duplicating routes or catalog data.
- Keep authored content in locale MDX, project visuals in one lazy domain adapter, and metadata in the typed TOC.
- Teach the end-to-end workflow in six theory lessons, one Code lab, and one cumulative quiz.
- Calibrate prediction intervals only from time-ordered out-of-fold residuals; TEST remains final evaluation rather than a tuning source.
- Present the human fallback result as an illustrative 5,000,000 VND capacity and 2:1 loss scenario, not a production guarantee.

# Delivered

- Registered `ai-projects` across typed catalog, presentation, lazy MDX runtime, tests, and documentation; added four tracks, eight published lessons, 27 assets, and four domain visuals.
- Centralized shared hierarchy behavior and removed unused syntax, styling, components, aliases, and assets found during review.
- Published a twelve-question cumulative quiz with full concept coverage, exactly three correct A/B/C/D positions, non-cyclic ordering, and no answer-length leakage; added regression coverage.
- Added a five-page conformal Code lab with runnable calibration, interval, diagnostic plot, and human-in-the-loop fallback code.
- Reproduced the project from 69 notebook code cells: radius 1,215,280 VND, TEST coverage 92.39% (170/184 days), mean width 2,412,217 VND, and WAPE 0.2038.
- Measured a 15-day review queue that reduces illustrative asymmetric loss by 4.56% and shortage by 11.35%, while increasing overplanning by 46.48%.
- Synchronized documentation: 16 domains, 102 tracks, 766 lessons, 298 published, and 468 placeholders.

# Verification

- `npm run sync:catalog-stats`
- Python syntax: 6/6 Code lab blocks passed.
- `npm run verify`: typecheck passed, 158/158 tests passed, production build passed.
- `git diff --check`: clean.

# Execution log

- 2026-09-06 — Domain, curriculum, review cleanup, and quiz audit completed.
- 2026-09-06 — Conformal lab rerun, measured output, plot, fallback scenario, and final plan consolidation completed.

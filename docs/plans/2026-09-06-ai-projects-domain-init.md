---
title: AI Projects Sales Forecasting Domain
status: done
created: 2026-09-06T13:30:00+07:00
updated: 2026-09-06T22:52:42+07:00
author: nmkhiem
task: "Initialize, audit, and finalize the AI Projects Sales Forecasting curriculum"
supersedes: []
---

# Goal

Publish a typed, Light-Mode-only AI Projects domain with hierarchical project navigation and a practical Vietnamese Sales Forecasting curriculum, then remove redundant changes and verify the final branch.

# Lineage

Genesis plan for the `ai-projects` domain.

# Decisions

- Reuse the Research Papers hierarchy as a generic category → topic → track → lesson rail without duplicating routes or catalog data.
- Keep authored content in locale MDX, project visuals in one lazy domain adapter, and metadata in the typed TOC.
- Teach the end-to-end workflow in six theory lessons followed by one cumulative quiz.
- Assess twelve core concepts with exactly three correct answers in each A/B/C/D position; correct options must never be the longest and the sequence must not expose a cyclic pattern.
- Extend shared components only for demonstrated use: linked evidence cards and a type-safe keyed `ComparisonMatrix` input.

# Delivered

- Registered `ai-projects` across domain types, presentation, catalog, lazy MDX runtime, tests, and generated catalog documentation.
- Added four project tracks, seven published Sales Forecasting lessons, 26 referenced illustration assets, and four domain-local visual components.
- Added hierarchical project copy while centralizing the shared domain capability and removing hard-coded initial paper/project identifiers.
- Removed unused `CodeBlock` syntax, global list styling, authored callout wrappers, one unused visual component, two unused PNGs, and an unused component alias.
- Fixed the August 2022 forecast calendar, contract-invalid `<br />` elements, a currency string that confused math scanning, and Unicode text inside a display formula.
- Expanded the quiz from eight to twelve questions covering problem/data boundaries, cleaning, EDA, feature engineering, leakage, validation/model selection, metrics/bias, and TreeSHAP.
- Added a regression test for concept coverage, four-option single-choice shape, A/B/C/D balance, sequence predictability, and answer-length leakage.
- Synchronized `wiki/concepts/learning-lab.md` and `wiki/reference/catalog-stats.md`: 16 domains, 102 tracks, 765 lessons, 297 published.

# Verification

- `npm run sync:catalog-stats`
- `npm run verify`: typecheck passed, 158/158 tests passed, production build passed.
- `git diff --check`: clean.

# Execution log

- 2026-09-06 — Initial domain and curriculum implemented.
- 2026-09-06 — Final review approved, cleanup and quiz audit completed, documentation compacted.

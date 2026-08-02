---
title: Chapter 1 & Chapter 2 Wording and Design Edits
status: done
created: 2026-08-03
updated: 2026-08-03
author: antigravity
task: "Add standalone takeaways, tighten wording and typography, and split the Chapter 2 exercise lesson."
supersedes:
  - 2026-08-03-statistics-review-recommended-improvements.md
---

# Goal

Finish the approved wording and structure pass across Statistics Chapters 1–2 while preserving the typed TOC, locale-MDX ownership boundary, canonical routes, and existing visual system.

# Lineage

Continues [Statistics Ch.1–3 Content Review Recommended Improvements](./2026-08-03-statistics-review-recommended-improvements.md).

# Decisions

- Give every Chapter 1 theory lesson (1.1–1.9) and Chapter 2 theory lesson (2.0–2.3) a final standalone takeaway page.
- Use bold for core terms, `MdxFormula` for all math, and direct Vietnamese wording without changing the lesson claims.
- Expand the Python introduction with a final cheatsheet page.
- Split `2.4-ch02-exercises.vi.mdx` into concept review, hand-calculated 3D KNN, and recap/solution pages.
- Keep page metadata, catalog counts, tests, and the Learning Lab wiki synchronized.

# Verification

- `npm run verify`: passed (TypeScript, 77 tests, production build).
- `git diff --check`: passed.
- Impeccable detector: completed once; remaining warnings are intentional mathematical bracket/axis styling or existing semantic visualization colors.

# Execution Log

- 2026-08-03 — Added standalone takeaways, learning objectives, terminology and Python examples; expanded page metadata.
- 2026-08-03 — Split the Chapter 2 exercise node into three pages and corrected the Bias–Variance minimum wording.
- 2026-08-03 — Replaced raw Markdown math with `MdxFormula`, removed redundant projection variables, synchronized wiki counts, and completed verification.

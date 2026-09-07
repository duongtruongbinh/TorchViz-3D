---
title: "NCA Research Papers: Branch Review and Cleanup"
status: done
created: 2026-09-07T10:46:00+07:00
updated: 2026-09-07T21:05:00+07:00
author: nmkhiem
task: "Review, refine, document, verify, and commit the NCA branch"
---

# Goal

Ship the MetaNCA relocation and seven-part NCA Pre-Pre-Training track as one maintainable change with accurate theory, a guess-resistant quiz, and lazy domain-specific UI.

# Approved scope

- Preserve the byte-identical MetaNCA relocation and new Research Papers catalog entries.
- Move `MatrixTransformStepper` behind the Research Papers MDX adapter; simplify reusable Concept Flow and Hierarchy rendering.
- Align quiz coverage with all theory concept IDs, balance A/B/C/D, prevent position cycles and longest-answer leakage, and enforce these rules in tests.
- Qualify causal claims and Continual Learning extrapolations against the primary paper.
- Update catalog documentation, verify the repository, and commit without pushing.

# Result

Completed the scoped refactor and content audit. The quiz covers 12 concepts with three correct answers in each position. `git diff --check`, 159 tests, typecheck, catalog-stat sync, and the production build pass.

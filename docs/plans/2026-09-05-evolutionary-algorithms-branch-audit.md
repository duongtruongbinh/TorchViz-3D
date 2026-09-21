---
title: Evolutionary Algorithms Branch Audit
status: completed
created: 2026-09-05T16:43:06+07:00
updated: 2026-09-05T17:33:00+07:00
author: Codex
task: "Audit, correct, simplify, verify, and commit the Evolutionary Algorithms branch"
---

# Goal

Ship Chapter 1 of the Evolutionary Algorithms domain with correct theory and code, meaningful responsive visuals, balanced quizzes, canonical assets, and no duplicate plan records.

# Decisions and Result

- Registered the domain through the typed catalog and lazy MDX adapter boundaries; Chapters 2-5 remain locked placeholders.
- Reviewed all 15 published lessons. Corrected optimization, evolutionary-search, representation, selection, crossover, mutation, validation, and convergence claims, plus executable code/output mismatches.
- Kept the new ConceptFlow cards and preserved illustration intent with KaTeX/SVG semantics, including gradient, Hessian, zero-order evaluation, genotype decoding, crossover, and mutation.
- Removed duplicate, unused, or misleading images. The 15 remaining canonical assets under `src/assets/learning/evolutionary-algorithms/` are all referenced.
- Rebalanced 23 single-choice answers to A/B/C/D = 5/6/6/6, removed answer-length leakage, and added a regression test for distribution and predictable runs.
- Consolidated the four earlier EA plans into this final record.

# Verification

- Responsive browser checks at 1440x1000 and 390x844, including the gradient/Hessian and horizontally scrolling ConceptFlow layouts.
- `npm run verify`: typecheck passed, 156 tests passed, production build passed.
- Asset audit: 15 referenced, 0 missing, 0 unused.

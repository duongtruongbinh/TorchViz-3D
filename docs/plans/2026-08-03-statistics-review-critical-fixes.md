---
title: Statistics Ch.1–3 Content Review Critical Fixes
status: done
created: 2026-08-03
updated: 2026-08-03
author: antigravity
task: Fix 6 critical issues found in comprehensive review of Probability & Statistics chapters
supersedes:
  - 2026-08-03-multivariate-normal-distribution-node.md
---

# Statistics Ch.1–3 Content Review Critical Fixes

Comprehensive review of 32 nodes across Chapters 1–3 identified 6 critical
content issues. This plan addresses only the critical fixes; recommended and
optional improvements are tracked separately.

## Proposed Changes

### TOC Node Order

#### [MODIFY] [table-of-contents.ts](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/table-of-contents.ts)
Swap `normal-distribution` (currently 3.7) ahead of
`multivariate-normal-distribution` (currently 3.6). Renumber titles to 3.6
and 3.7 respectively. Normal 1D is a prerequisite for multivariate.

---

### Laplace Smoothing Notation

#### [MODIFY] [1.8-ch01-bayes-naive-bayes.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.8-ch01-bayes-naive-bayes.vi.mdx)
Page 7: add explicit definitions of $N_{ikx}$, $N_i$, $K$ after the
Laplace smoothing formula, with a worked micro-example.

---

### Missing Text on Visual-Only Pages

#### [MODIFY] [1.7-ch01-probability-origins.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.7-ch01-probability-origins.vi.mdx)
Page 2: add 1–2 introductory sentences before the visual.
Page 3: add 1–2 introductory sentences before the first visual.

#### [MODIFY] [1.8-ch01-bayes-naive-bayes.vi.mdx](file:///home/khiem/TorchViz-3D/src/content/learning/statistics/1.8-ch01-bayes-naive-bayes.vi.mdx)
Page 8: add a short introductory paragraph before the visuals.

---

### Verified Issues (No Fix Needed)

- Laplace calculation in 1.9 page 2 ($25/1372$) is **correct**.
- Multivariate normal page 10 already states the uncorrelated ⟺ independent
  caveat correctly.

## Verification Plan

```bash
npm run verify
```

# Lineage

Continues [Multivariate Normal Distribution](./2026-08-03-multivariate-normal-distribution-node.md).

# Execution Log

- 2026-08-03 — Corrected lesson order and numbering, clarified Laplace notation, added missing explanatory prose, and retained verified calculations.

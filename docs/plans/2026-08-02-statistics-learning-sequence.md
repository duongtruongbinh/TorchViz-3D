---
title: Refine the Statistics Learning Sequence
status: done
created: 2026-08-02T17:53:45+07:00
updated: 2026-08-02T21:05:00+07:00
author: Codex
task: "Refine the Statistical Thinking and Descriptive Statistics sequence, including dedicated Population, Histogram, and Normal Distribution nodes."
supersedes:
  - docs/plans/2026-08-01-stat-thinking-distill-applications-questions.md
  - docs/plans/2026-07-31-statistics-chapter-order-swap.md
---

# Goal

Turn the opening Statistics sequence into a concise overview followed by
focused, visualization-first lessons. Remove repeated material, preserve the
typed Learning Lab catalog/locale-MDX boundary, and keep existing canonical
routes stable.

# Lineage

Continues [Distill Statistical Thinking Applications and Questions](./2026-08-01-stat-thinking-distill-applications-questions.md)
and [Reorder Statistics Chapters](./2026-07-31-statistics-chapter-order-swap.md).
This compact record supersedes the five working plans used during the approved
iteration on 2026-08-02.

# Final decisions

## Chapter 2 — Statistical Thinking

- Keep `2.1 Tư duy thống kê, dữ liệu và suy luận` as a three-page overview:
  Statistics definition, research/business questions, and
  descriptive-versus-inferential classification.
- Remove the applications/AI-ML-DL page and the repeated
  question→method→chapter map.
- Extract Population, Sample, and Observation into published node
  `ch02-populations-samples-observation`, displayed as 2.2.
- Give 2.2 one visual overview plus deterministic population-sampling and
  study-design activities. Vietnamese MDX owns teaching copy; React owns
  geometry, state, and calculations.
- Retitle Statistics criticism to 2.3 without changing its ID or route.
- Remove the obsolete Iris pairs-plot asset after its authored page was removed.

## Chapter 3 — Distribution shape

- Add `histogram-foundations` as published node 3.1 with 17 pages. It owns the
  progression observations→number line→bins→stacks→bars, fixed-axis bin-choice
  comparisons, beginner rules, Python examples, and a keyboard-operable bin
  explorer.
- Move descriptive data analysis to 3.2 and preserve its adjacent Quiz.
- Add `normal-distribution` as published node 3.3. Its final 17-page sequence
  opens with why the Normal model matters, connects density to area/probability,
  provides mean and variance controls, covers center/symmetry/tails,
  multimodality, standard Normal/z-scores, StandardScaler, skew, long tails,
  outliers, and a deterministic Histogram-reading activity.
- Remove Normal pages that duplicated the Histogram lesson: observed-versus-
  ideal inspection, bin-count caution, multimodal investigation, and the two
  mixed-group Python pages.
- Preserve existing IDs/routes while shifting point estimation to 3.4,
  sampling distributions to 3.5, and the Python lab to 3.6.

# Visual and content boundary

- Inherit `design.md` and Learning Lab semantic theme helpers; do not create a
  separate visual identity.
- Use focused domain-local renderers for Histogram and Normal Distribution
  rather than expanding shared MDX primitives.
- Use deterministic SVG/HTML geometry, fixed-size labels, accessible textual
  equivalents, keyboard controls, and live feedback.
- Keep Vietnamese labels, explanations, formulas, examples, feedback, and
  scenarios in MDX props. React owns geometry, calculation, responsive layout,
  and interaction state.
- Use the repository's escaped `MdxFormula`/KaTeX convention. Do not add a chart
  library, external asset, route alias, track, or separate quiz.

# Final catalog impact

- Total lesson nodes: 721 → 724.
- Available lessons: 169 → 172.
- Published/authored locale MDX lessons: 171 → 174.
- Statistics lesson nodes: 119 → 122.
- Statistics published Vietnamese lessons: 105 → 108.
- Statistics ordered pages: 361 → 393.
- Locked, missing, and `next` counts remain 551, 550, and 1.

# Verification and review

- Updated catalog, MDX contract, ordering, component-usage, formula, content,
  and locked-count assertions.
- Updated the existing Learning Lab wiki ownership/count surface; no new design
  or architecture page was created.
- Impeccable detector returned no findings.
- Independent finish review initially found four Normal renderer issues:
  StandardScaler lacked a shared scale, long-tail visual reused a Normal curve,
  authored Vietnamese copy lived in React, and a figure caption was misplaced.
  All four were fixed and the final reviewer disposition was Pass.
- A later missing skew Histogram visual was fixed by replacing percentage-height
  flex bars with deterministic SVG bars.
- Browser screenshots were unavailable, so final rendered label fit, compact
  spacing, and contrast remain visually unverified.
- Final handoff requires `npm run verify` and `git diff --check` immediately
  before commit.

# Execution log

- 2026-08-02 — Requester approved and iterated on the Chapter 2 overview,
  Population/Sample/Observation extraction, Histogram foundations, and Normal
  Distribution node.
- 2026-08-02 — Implemented the final authored lessons, focused renderers,
  catalog order, numbering, tests, and Learning Lab wiki updates.
- 2026-08-02 — Compacted five overlapping working plans into this single branch
  record before staging and commit.

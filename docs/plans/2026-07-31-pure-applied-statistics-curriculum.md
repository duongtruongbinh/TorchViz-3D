---
title: Pure Applied Statistics Curriculum Integration
status: draft
created: 2026-07-31T00:00:00+07:00
updated: 2026-07-31T00:00:00+07:00
author: Codex
task: "Combine the proposed applied-statistics outline with the current Statistics Learning Lab material while keeping the core focused on probability, inference, regression, experiments, and quality control"
supersedes:
  - docs/plans/2026-07-30-statistics-probability-chapter.md
---

# Goal

Define and implement a coherent pure applied-statistics curriculum for the
Statistics Learning Lab domain. The curriculum should use the proposed
engineering-statistics sequence as its spine while retaining compatible
current material, especially probability, regression, resampling, survival
analysis, and multiple testing.

The target structure is:

1. Introduction to Statistical Thinking
2. Probability and Random Variables
3. Descriptive Statistics and Point Estimation
4. Statistical Inference
5. Regression Analysis
6. Design of Experiments
7. Statistical Quality Control

# Lineage

Supersedes and extends the scope of
[Statistics Probability Chapter](./2026-07-30-statistics-probability-chapter.md),
which established the canonical `statistics` domain and the revised Probability
chapter. The existing domain id, route compatibility, Vietnamese-first content
contract, and Learning Lab architecture remain in force.

# Decisions (locked for planning)

- Keep the canonical domain id `statistics` and the display name
  `Probability & Statistics` unless a later approved plan explicitly changes
  the product naming.
- Make pure applied statistics the primary learning path rather than treating
  general machine-learning methods as core statistics.
- Retain the current Probability chapter as the foundation, but extend it with
  discrete and continuous random variables, standard distributions, and joint
  distributions.
- Fold compatible current material into the new sequence:
  statistical-learning foundations into Chapter 1; resampling, survival, and
  multiple testing into Chapter 4; and current regression, regularization, and
  nonlinear-regression material into Chapter 5.
- Add Design of Experiments and Statistical Quality Control as first-class
  chapters; these are not currently covered adequately.
- Treat classification, SVMs, tree methods, deep learning, and unsupervised
  learning as optional Statistical Learning Extensions or a later domain, not
  as part of the pure-statistics core.
- Preserve the Vietnamese-authored MDX boundary and existing locale fallback.
- Prefer additive migration and route aliases over breaking existing lesson
  links. Existing authored content should be reused or retitled where its
  concepts already match; wholesale rewriting requires a separate content
  decision.

# Phases

## Phase 0 — Approval checkpoint

- Review and approve this stored plan before implementation.
- On approval, update this file's status to `approved` and record the approval
  timestamp.

## Phase 1 — Curriculum audit and mapping

- Inventory all current Statistics tracks, lessons, page counts, aliases, and
  authored MDX.
- Map every current lesson to one of the seven target chapters or to the
  optional Statistical Learning Extensions group.
- Identify missing lesson groups for random-variable distributions, point
  estimation, classical inference, two-sample inference, nonparametric tests,
  experimental design, and quality control.
- Define the target track and lesson ordering before changing the TOC.

## Phase 2 — Catalog and routing design

- Update the Statistics TOC to represent the seven-chapter core and any
  explicitly retained extension tracks.
- Preserve canonical ids where practical and add aliases for moved or renamed
  lessons.
- Keep theory, calculation, code/lab, and exercise lesson types explicit.
- Recalculate published-lesson and ordered-page totals.
- Update catalog regression tests for ordering, aliases, published content,
  and chapter membership.

## Phase 3 — Content implementation

- Reuse compatible current Probability, regression, resampling, survival, and
  multiple-testing lessons.
- Add or author the missing probability-distribution and estimation sequence.
- Add classical inference lessons covering intervals, hypothesis tests, power,
  goodness-of-fit, two-sample procedures, and nonparametric tests.
- Add Design of Experiments lessons covering ANOVA, blocking, factorials,
  fractional factorials, confounding, and response surfaces.
- Add Statistical Quality Control lessons covering control charts, capability,
  CUSUM, and EWMA.
- Add worked examples, exercises, and Python labs where the curriculum calls
  for applied practice.
- Keep mathematical notation KaTeX-rendered and preserve the established
  responsive lesson-visual architecture.

## Phase 4 — Optional material boundary

- Move or relabel classification, SVM, tree, deep-learning, and unsupervised
  lessons as optional statistical-learning extensions if they remain in this
  domain.
- Ensure the core course navigation does not imply that those methods are
  prerequisites for the pure applied-statistics path.

## Phase 5 — Documentation and verification

- Update the existing Learning Lab wiki page with the new chapter structure,
  content counts, locale state, and core-versus-extension boundary.
- Update this plan's execution log with exact file and lesson changes.
- Run focused catalog and MDX tests, `npm run typecheck`, `npm run verify`,
  stale-route/content searches, and `git diff --check`.

# Out of scope

- Changing the Learning Lab runtime architecture or MDX ownership model.
- Changing the canonical `statistics` domain id without a separate decision.
- Restoring English Statistics lesson files.
- Removing existing authored content before its replacement and route mapping
  are approved.
- Adding a separate top-level product area for engineering statistics.
- Treating deep learning or general machine learning as part of the pure
  statistics core.

# Execution log

- 2026-07-31 — Drafted this plan from the current Statistics TOC and the
  proposed applied-statistics outline. No lesson, catalog, code, or wiki files
  were modified.

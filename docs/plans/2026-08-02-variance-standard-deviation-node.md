---
title: Add Variance and Standard Deviation Node Before Normal Distribution
status: done
created: 2026-08-02T20:05:31+07:00
updated: 2026-08-02T20:22:31+07:00
author: Codex
task: "Add the supplied Variance & Standard Deviation node before Normal Distribution."
supersedes:
  - docs/plans/2026-08-02-statistics-learning-sequence.md
---

# Goal

Add a published Vietnamese Variance & Standard Deviation lesson between
descriptive data analysis and Normal Distribution. Build the concepts from the
visual problem of equal means with unequal spread, through deviations and
squared deviations, to variance, standard deviation, `n` versus `n-1`, degrees
of freedom, bias, Python, and practical formula choice.

# Lineage

Continues [Refine the Statistics Learning Sequence](./2026-08-02-statistics-learning-sequence.md).
Histogram established distribution shape and the Normal node consumes variance
as a parameter; this node supplies the missing mathematical and intuitive bridge.

# Source brief

- The requester supplied a 1,049-line brief titled `Node 1 — Variance &
  Standard Deviation` and placed it before Normal Distribution.
- Although its introduction suggests 12–14 pages, it provides sixteen explicit
  page specifications. The concrete sixteen-page sequence is authoritative.
- Required anchors are: equal mean does not imply equal spread; signed
  deviations cancel; squaring prevents cancellation and amplifies distant
  points; variance is mean squared deviation; standard deviation restores the
  original unit; AI/ML commonly uses `1/n`; population-variance estimation from
  a sample uses `1/(n-1)`; only `n-1` deviations are free; and Bessel's
  correction removes the variance estimator's downward bias in expectation.
- Raw bracket/equality formatting in the supplied proof is content notation,
  not valid MDX/LaTeX. Implementation will preserve the mathematics while
  translating every expression to the repository's escaped `MdxFormula`
  convention.

# Impeccable assessment

- **Mode:** Read, with Operate moments on the hand-calculation, movable-point,
  degrees-of-freedom, and estimator-comparison pages.
- **Established world:** inherit `design.md`, Learning Lab theme helpers,
  Statistics chart grammar, locale-MDX ownership, and responsive lesson shell.
  This is an extension, not a new visual identity.
- **Spatial thesis:** keep one horizontal number-line language while the learner
  watches raw points become signed distances, squared contributions, an average,
  and finally a standard deviation in the original unit.
- **Comparison thesis:** pages comparing data sets or denominators hold data,
  domains, and axes stable so the changed quantity is attributable.
- **Interaction thesis:** the movable-point activity uses an accessible range
  control with live mean, deviation, squared deviation, variance, and standard
  deviation. Keyboard and screen-reader operation are first-class; dragging is
  not the only path.
- **Responsive thesis:** fixed-size labels and strokes remain legible while
  charts resize; multi-panel comparisons stack on compact viewports; formulas
  and proof steps wrap without horizontal scrolling.
- **Mechanical pre-edit scan:** no detector findings in the current Statistics
  adapter or Normal renderer.

# Decisions (locked after approval)

- Add lesson id `variance-standard-deviation`, displayed as `3.3 Phương sai &
  Độ lệch chuẩn (Variance & Standard Deviation)`, with sixteen authored pages.
- Insert it after `descriptive-data-analysis-quiz` and before
  `normal-distribution`. Preserve the 3.2 Quiz adjacent to its parent.
- Preserve all existing IDs/routes and shift display numbering only:
  Normal Distribution → 3.4, Point Estimation → 3.5, Sampling Distributions →
  3.6, and the Python lab → 3.7. Update matching authored metadata titles.
- Make the new node the owner of variance construction, `ddof`, Bessel's
  correction, degrees of freedom, the unbiasedness derivation, and the
  denominator simulation.
- Distill the existing Point Estimation variance page so it references this
  prior result and focuses on what unbiasedness means for estimators. Remove its
  duplicate derivation/simulation while retaining unique point-estimation,
  proportion, MLE, MSE, consistency, and efficiency material. Keep its route
  and four-page structure.
- Add a focused domain-local `varianceStandardDeviationRenderers.tsx` module
  and register only a small typed component API:
  - equal-mean spread comparison;
  - deviation/cancellation/squared-contribution sequence;
  - hand-calculation progression and unit restoration;
  - accessible movable-point explorer;
  - degrees-of-freedom constraint visual;
  - deterministic `n` versus `n-1` estimator comparison;
  - final denominator decision comparison.
- Let Vietnamese MDX own all visible labels, explanations, captions, formulas,
  feedback, proof prose, examples, and Python code. React owns geometry,
  deterministic calculations, state, responsive layout, and live updates.
- Use supplied data/examples and deterministic simulations. Do not add a chart
  dependency, external asset, autoplay, emoji, gradient/glow decoration,
  hover-only meaning, or color-only distinctions.
- Preserve the brief's conceptual guardrails:
  - standard deviation is not mean absolute deviation;
  - one distant point can strongly affect squared-distance measures;
  - unbiasedness is an expectation across repeated samples, not a promise that
    each estimate is close;
  - `s` obtained by square-rooting unbiased `s²` is not itself unbiased;
  - `1/n` remains valid for describing the observed dataset/batch and Gaussian
    MLE, while `1/(n-1)` targets unbiased population-variance estimation.
- Add no quiz, route alias, new track, package, or architecture change.

# Page contract

1. Cùng trung bình, độ phân tán khác nhau.
2. Khoảng cách tới trung bình.
3. Vì sao không cộng các độ lệch?
4. Bình phương độ lệch.
5. Phương sai.
6. Tính phương sai bằng tay.
7. Độ lệch chuẩn.
8. Kéo điểm để thay đổi phương sai.
9. Khi nào chia cho `n`?
10. Khi nào chia cho `n-1`?
11. Degrees of freedom.
12. Chứng minh vì sao chia cho `n` bị lệch.
13. Trực quan hóa hiệu chỉnh `n-1`.
14. Code Python.
15. Code mô phỏng bias.
16. Cách chọn công thức trong thực tế.

# Phases

## Phase 0 — Approval checkpoint

- Store this draft and wait for explicit requester approval.
- On approval, set the plan to executing before editing runtime, content, test,
  or wiki files.

## Phase 1 — Establish catalog order and authored content

- Add the sixteen-page locale MDX lesson and update Chapter 3 display numbering.
- Translate all formulas/proof steps to valid escaped KaTeX.
- Distill the duplicate variance/Bessel section in Point Estimation while
  preserving its unique estimator story.
- Update locked catalog, authored-file, page-count, order, and metadata tests.

## Phase 2 — Build the visual sequence

- Load Impeccable's `craft-floor` immediately before UI edits.
- Implement/register the focused renderers with MDX-authored labels and
  accessible textual equivalents.
- Keep data/domain/axis stable across comparisons and expose live calculations
  in the movable-point activity.
- Ensure estimator simulations are deterministic and explain expectation rather
  than implying every corrected estimate is accurate.

## Phase 3 — Verify, document, and finish

- Update the compact branch plan lineage/execution record and the existing
  Learning Lab wiki ownership/count surface.
- Run `npm run verify` and `git diff --check`.
- Run Impeccable's detector once on final UI targets and perform an independent
  finish review. Apply material findings and reverify.
- Inspect desktop and compact renders if a browser surface becomes available;
  otherwise record the screenshot limitation.
- Mark this plan done only after verification, documentation, and review close.

# Expected count changes

- Total lesson nodes: 724 → 725.
- Available lessons: 172 → 173.
- Published/authored locale MDX lessons: 174 → 175.
- Statistics lesson nodes: 122 → 123.
- Statistics published Vietnamese lessons: 108 → 109.
- Statistics ordered pages: 393 → 409.
- Locked, missing, and `next` counts remain 551, 550, and 1.

# Out of scope

- Removing variance as a parameter from Normal Distribution or variance as an
  estimator example from Point Estimation.
- Re-teaching Histogram construction, Normal density, sampling distributions,
  confidence intervals, robust spread measures, covariance, or ANOVA.
- Changing canonical lesson IDs/routes, shared lesson navigation, or the
  Learning Lab design system.

# Execution log

- 2026-08-02T20:05:31+07:00 — Drafted after reading the complete supplied
  sixteen-page brief, inspecting current Chapter 3 ordering, the Normal and
  Point Estimation overlap, branch plan lineage, count tests, Statistics adapter,
  and Impeccable new-work guidance. The pre-edit detector returned no findings.
- 2026-08-02T20:12:00+07:00 — Requester approved the plan; execution started.
- 2026-08-02T20:22:31+07:00 — Added the sixteen-page authored lesson, three
  focused Statistics renderers, Chapter 3 ordering/metadata updates, the
  distilled Point Estimation bridge, count/contract coverage, and Learning Lab
  documentation. The final Impeccable detector returned no findings. An
  independent finish review found four material issues (LaTeX escaping,
  estimator-series accuracy, a shifting interaction domain, and scaled SVG
  labels); all were corrected and the reviewer confirmed the fixes clean.
  `npm run verify` and `git diff --check` pass. Browser screenshots were not
  available in this environment, so rendered desktop/compact visual inspection
  remains unrecorded.

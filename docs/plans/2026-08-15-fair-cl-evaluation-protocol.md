---
title: Add a Fair Continual-Learning Evaluation Protocol
status: done
created: 2026-08-15T00:00:00+07:00
updated: 2026-08-15T01:00:00+07:00
author: nmkhiem
task: "Add a practical fair-evaluation protocol page and aligned quiz coverage to Chapter 5"
supersedes:
  - docs/plans/2026-08-08-continual-learning-llm-domain.md
  - docs/plans/2026-08-13-core-cl-metrics-bwt-conventions.md
---

# Goal

Extend the existing `Dataset và Benchmark` Theory/Quiz pair so Chapter 5 moves
from naming benchmark datasets to specifying a reproducible and fair continual-
learning evaluation protocol.

A learner should finish the new page able to state what must be disclosed,
controlled, compared, and measured before two continual-learning results can be
treated as comparable.

# Lineage

Continues the course structure and evidence contracts from
[2026-08-08-continual-learning-llm-domain](./2026-08-08-continual-learning-llm-domain.md)
and the performance-matrix/metric conventions from
[2026-08-13-core-cl-metrics-bwt-conventions](./2026-08-13-core-cl-metrics-bwt-conventions.md).

# Context read

- `5.1.5-continual-learning-benchmarks.vi.mdx` currently contains one implicit
  page mapping continual settings to representative datasets.
- Its adjacent Quiz has three questions and tests only dataset-family mapping.
- Chapter 5 already teaches stage-wise evaluation, the performance matrix,
  acquisition/overall performance, forgetting, BWT, and FWT in the core metrics
  node. The new page should connect those concepts to experiment design rather
  than re-explain their formulas.
- The workspace contains no seminar PDF or slide deck. The requester-provided
  page-14 checklist is therefore the authoritative content specification for
  this change; no unobserved seminar wording will be attributed or quoted.
- Existing shared MDX primitives and ordinary Markdown are sufficient. No new
  renderer or asset is needed.

# Decisions

- Keep the existing Theory/Quiz node names and routes unchanged.
- Convert the Benchmark Theory into two explicit `MdxPage` pages:
  1. the current dataset/setting map;
  2. `Protocol đánh giá công bằng`.
- Organize the protocol page as four short disclosure groups so it reads as an
  actionable checklist rather than one long paragraph:
  1. **Data stream:** task/domain order, whether task boundaries are known, and
     how many times each sample is seen;
  2. **Resource budget:** replay-buffer budget, train tokens, update count,
     FLOPs, and additional parameters;
  3. **Baselines and controls:** naive sequential fine-tuning, joint/full-history
     training when feasible, and matched initialization, data order, and compute;
  4. **Measurement:** evaluation after every stage to form the performance
     matrix, multiple seeds and task orders, and both acquisition and retention.
- End with a warning that low forgetting alone is not evidence of a strong
  method when the method also fails to learn the new task.
- Add the concept ID `fair-evaluation-protocol` to both nodes and one fourth Quiz
  question that asks the learner to identify the only fair protocol among
  superficially plausible alternatives. Keep it application-oriented rather
  than asking for verbatim checklist recall.
- Preserve the existing dataset questions and benchmark evidence. Treat the new
  checklist as course synthesis across Chapter 5 unless source review identifies
  an existing registered claim that directly supports a local statement; do not
  invent a citation to the unavailable seminar slide.
- Update the existing plan execution log and Learning Lab wiki only where their
  durable counts or Chapter 5 description change.

# Phases

1. Update the Theory metadata and split the existing content into two pages.
2. Author the compact fair-protocol checklist and acquisition/retention warning.
3. Add exact Theory/Quiz concept parity and the fourth protocol question.
4. Run focused catalog/MDX/quiz tests and `git diff --check`; run broader
   verification only if the content contract or build requires it.
5. Record the final modifications and verification result in this plan and
   update the existing Learning Lab documentation if necessary.

# Acceptance criteria

- The original dataset map remains intact as page 1 of the same node.
- Page 2 explicitly covers every protocol field supplied by the requester.
- The page distinguishes what must be reported from what must be held constant.
- Naive sequential fine-tuning and joint/full-history training are clearly
  described as different baselines, with the latter conditional on feasibility.
- Evaluation after every stage is tied directly to construction of the
  performance matrix.
- Multiple seeds and multiple task/domain orders are required, not merely
  recommended as an afterthought.
- Acquisition and retention are reported together, with a clear warning against
  interpreting failure to learn as successful retention.
- Theory and Quiz retain exact concept-ID parity and all MDX contracts pass.

# Out of scope

- Adding a new Chapter 5 TOC node or route.
- Rewriting the metric formulas in `5.1.1`.
- Reproducing a complete experimental protocol from any one cited paper.
- Adding a bespoke checklist component, bitmap illustration, or interactive lab.
- Quoting or citing an unavailable seminar slide as though it had been reviewed.

# Execution log

- 2026-08-15 — Read the current Benchmark Theory/Quiz pair, adjacent Chapter 5
  content patterns, catalog/source contracts, Learning Lab documentation, and
  the repository workflow. Confirmed that no seminar PDF or slide deck is
  present and stored this draft plan for approval.
- 2026-08-15 — User approved the stored plan; began implementation.
- 2026-08-15 — Converted the Benchmark Theory into two explicit pages. Kept the
  dataset map intact and added a four-part fair-protocol checklist covering the
  data stream, resource budget, baselines/controls, and stage-wise measurement,
  followed by an acquisition-versus-retention warning.
- 2026-08-15 — Added `fair-evaluation-protocol` to the Theory/Quiz concept set
  and a fourth application-oriented Quiz question. Updated the course-wide Quiz
  count and answer-position invariants from the inspected authored content.
- 2026-08-15 — Focused MDX contract, Theory/Quiz parity, and Quiz-shape tests all
  passed; `git diff --check` passed. No Learning Lab wiki counts changed, so no
  wiki update was required.
- 2026-08-15 — User approved a follow-up third page, `Realistic stress tests`,
  in the same Benchmark node. Reopened execution to cover blurred task
  boundaries, long streams, imbalance, long-tail data, noisy labels, and
  negative transfer, plus one aligned Quiz question distinguishing fairness
  controls from realistic stress conditions.
- 2026-08-15 — Added the third Theory page and fifth Quiz question. The page
  separates equal-condition fairness from benchmark realism and maps each stress
  condition to the failure it should expose. Focused MDX contract, Theory/Quiz
  parity, and Quiz-shape tests passed; `git diff --check` passed.

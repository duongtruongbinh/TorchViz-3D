---
title: Correct Weight Regularization EWC and Synaptic Intelligence Content
status: done
created: 2026-09-14T00:00:00+07:00
updated: 2026-09-14T00:45:00+07:00
author: Codex
task: "Correct the Weight Regularization lesson and quiz against the original EWC and Synaptic Intelligence papers"
supersedes:
  - docs/plans/2026-08-15-continual-learning-branch-history.md
---

# Goal

Make the Vietnamese `Weight Regularization` lesson mathematically consistent
with the original EWC and Synaptic Intelligence papers while preserving its
three-page teaching arc, current MDX architecture, citations, and the user's
uncommitted work.

# Lineage

Continues the regularization-method content recorded in
[Continual Learning Branch History](./2026-08-15-continual-learning-branch-history.md).

# Decisions (locked)

- Preserve the three-page intuition-first sequence: quadratic geometry, EWC,
  then SI; keep examples concrete and assumptions explicit.
- Treat full-matrix geometry as motivation, distinguish eigen-directions from
  parameter coordinates, and present diagonal empirical Fisher separately from
  exact Fisher with the conventional `1/2` EWC factor.
- Define SI by negative path contribution, net task displacement, damping,
  cumulative importance, and task-boundary consolidation. It is a trajectory
  measure, not generally an endpoint-curvature estimator.
- Add one application question that distinguishes EWC from SI while preserving
  metadata, routes, registries, UI, and illustration assets.

# Phases

1. Correct matrix/curvature language, the EWC derivation, SI equations, and
   multi-task interpretation.
2. Align the paired Quiz, metadata, concepts, and page counts.
3. Run focused MDX/math checks, typecheck, build, and worktree inspection.

# Out of scope

- Redesigning the lesson, changing its route, or generating new illustrations.
- Expanding into EWC variants, online EWC, MAS, or implementation code.
- Editing other regularization lessons or unrelated uncommitted files.

# Execution log

- 2026-09-14 — Plan approved after review of the lesson, Quiz, content
  contracts, and original EWC/SI papers.
- 2026-09-14 — Corrected full-matrix versus coordinate language, exact versus
  empirical Fisher, the EWC objective, and SI sign, displacement, damping,
  boundary, and cumulative importance; added the EWC-versus-SI Quiz question.
- 2026-09-14 — Follow-up teaching pass replaced unnecessary Bayesian framing
  with the full Hessian → storage limit → diagonal importance → independence
  limitation and variance → Fisher → penalty flow.
- 2026-09-14 — Focused metadata, concept, citation, math, typecheck, build, and
  whitespace checks passed. The full suite retained two failures in the then
  unfinished Regularization Overview pair; no architecture/wiki update was
  needed for this factual lesson correction.

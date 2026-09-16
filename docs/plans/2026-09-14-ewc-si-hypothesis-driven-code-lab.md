---
title: EWC and Synaptic Intelligence Hypothesis-Driven Code Lab
status: executing
created: 2026-09-14T12:40:46+07:00
updated: 2026-09-14T13:42:09+07:00
author: Codex
task: "Create one EWC and Synaptic Intelligence lab that reuses the sequential CL baseline style and tests whether observed results match explicit hypotheses"
supersedes:
  - docs/plans/2026-09-14-correct-weight-regularization-ewc-si.md
  - docs/plans/2026-08-15-continual-learning-branch-history.md
---

# Goal

Add one Vietnamese Learning Lab pair, `Lab EWC và Synaptic Intelligence` plus
its adjacent `Quiz`, immediately after `Weight Regularization`. The lab should
reuse the four-task small-LLM protocol and coding conventions established by
`Lab baseline CL tuần tự`, while changing the learning objective to EWC and SI.

Success is not defined as “EWC/SI must beat Replay.” The lab succeeds when a
learner can:

1. implement endpoint empirical-Fisher importance for EWC and online
   path-integral importance for SI;
2. compare both methods with SeqFT, Replay, and mechanism controls under a
   declared experiment contract;
3. inspect retention, acquisition, cost, state size, and parameter behavior;
4. decide which observations support, weaken, or fail to test each hypothesis;
5. explain a negative or mixed result without rewriting the hypothesis after
   seeing the final score.

# Lineage

This plan extends the corrected EWC/SI definitions in
[Correct Weight Regularization EWC and Synaptic Intelligence Content](./2026-09-14-correct-weight-regularization-ewc-si.md)
and the reusable sequential-evaluation contract recorded in
[Continual Learning Branch History](./2026-08-15-continual-learning-branch-history.md).

# Context reviewed

- `2.1.5-sequential-cl-baseline-lab.vi.mdx` already owns the reusable Colab
  style: SmolLM2-360M-Instruct, DBpedia → Amazon Polarity → Yahoo Answers → AG
  News, fixed sample IDs, 2,048 training examples and 64 held-out examples per
  task, log-probability evaluation, stage-by-task matrix, CL metrics, live loss
  plots, cost logging, and JSON artifacts.
- The baseline explicitly leaves a strategy extension point for
  `run_ewc_with_same_contract(...)` and later methods.
- The EWC paper protects parameters with a diagonal Fisher-weighted quadratic
  penalty and computes Fisher in a separate task-boundary phase.
- The SI paper accumulates parameter credit along the optimization trajectory,
  normalizes it by net task displacement plus damping, and updates cumulative
  importance and anchors only at a task boundary.
- The two papers establish the mechanisms, but output from this new small-LLM
  notebook will remain a course experiment rather than a reproduction claim.

# Decisions (locked)

## 1. One combined lab

- Create one combined EWC/SI lab rather than two largely duplicated labs.
- Place its paired Quiz directly after it, preserving Theory/Lab → Quiz
  adjacency and exact concept-ID parity.
- Insert the pair after `parameter-regularization-ewc`; move only the numeric
  filename prefixes of the downstream Function Regularization and Architecture
  Expansion pairs as needed to keep Chapter 2 filenames sequential. Stable
  lesson IDs and routes do not change.

## 2. Preserve the baseline experiment contract

Keep fixed across methods:

- initial checkpoint and tokenizer;
- task order and instruction format;
- train/validation/test sample IDs;
- training samples, optimizer-update budget, batch size, gradient accumulation,
  maximum sequence length, and evaluator;
- evaluation after Base and every task stage;
- metric formulas and artifact schema.

The previous SeqFT/Replay artifact may be loaded when its contract hash matches.
If the memory-feasibility gate changes model size, trainable scope, sample IDs,
or any other locked field, rerun SeqFT and Replay and label the results as a new
contract; never compare incompatible artifacts in one result table.

Add a deterministic validation split for choosing regularization strength.
The held-out test split is reserved for the final comparison, avoiding selection
of `lambda` or `c` from final test performance.

## 3. Methods and controls

The primary comparison contains:

1. **SeqFT** — lower-bound reference with no retention mechanism.
2. **Replay 25%** — strong data-memory baseline from the preceding lab.
3. **Uniform L2 anchor** — same quadratic form but `Omega_i = 1`; tests whether
   parameter-specific importance adds value beyond generic anchoring.
4. **EWC** — diagonal empirical Fisher estimated from observed-label token NLL
   gradients at each completed task.
5. **SI** — online accumulation of `-g_i Delta theta_i` using the actual
   optimizer update, followed by task-boundary normalization and consolidation.

Add an optional **shuffled-importance control** that permutes importance values
within shape-compatible parameter groups while preserving their marginal
distribution. This tests whether *where* importance is assigned matters, not
only its scale. It is a mechanism probe, not a headline baseline.

No old-task examples are replayed while EWC or SI learns a later task. EWC may
make its declared consolidation pass over the task that has just finished
before those examples are released. SI updates its state during ordinary
training and performs no separate Fisher pass.

## 4. Memory-feasibility gate

Begin implementation with a one-stage Colab T4 memory pilot using the existing
360M model and full trainable scope. Record peak VRAM, wall time, and persistent
state bytes for EWC and SI.

- If full-scope EWC and SI both remain below a conservative 14 GB peak and
  complete the smoke stage, keep the original baseline contract.
- Otherwise freeze one declared common parameter scope for **all five methods**
  (default fallback: final two transformer blocks, final normalization, and LM
  head), rerun SeqFT and Replay, and expose this limitation prominently.
- Store anchors and importance tensors in the lowest precision that passes a
  numerical audit against an FP32 small-tensor reference. SI path accumulation
  itself remains FP32 unless the audit shows the lower-precision variant is
  stable.

This gate prevents an unnoticed OOM-driven implementation change from making
the comparison invalid.

## 5. Hypotheses declared before the final run

| ID | Hypothesis | Evidence that supports it | Evidence that weakens it |
| :--- | :--- | :--- | :--- |
| H1 | Parameter-specific consolidation improves old-task retention over SeqFT at a moderate strength. | Lower Peak Forgetting / less-negative BWT while Mean Acquisition remains within a declared tolerance. | Retention is unchanged across seeds, or improves only because the new tasks are not learned. |
| H2 | Importance location matters, not just global penalty magnitude. | EWC or SI beats matched Uniform L2 and shuffled importance on the retention–acquisition Pareto frontier. | Uniform or shuffled controls match the method consistently within seed variation. |
| H3 | EWC and SI capture different signals. | Fisher and SI importance have imperfect rank correlation/top-k overlap, and their per-task or per-layer behavior differs. | Near-identical importance maps and trajectories suggest the distinction is immaterial in this fixture. |
| H4 | Parameters ranked as highly important are more behaviorally sensitive for the completed task. | Equal-norm perturbations on high-importance coordinates damage old-task loss/accuracy more than perturbations on low-importance coordinates. | High- and low-importance perturbations have similar effects, indicating estimator noise, insufficient coverage, or a diagonal-approximation limitation. |
| H5 | Regularization strength creates a stability–plasticity frontier rather than a monotonic win. | Increasing strength first improves retention, then eventually reduces acquisition; a knee region appears. | Results are flat/noisy or dominated by optimization failure, so the proposed sweep does not resolve a frontier. |

Do not require all hypotheses to be confirmed. The final narrative must retain
the predeclared hypotheses and classify each as supported, mixed, unsupported,
or unresolved for this fixture.

## 6. Exploration protocol

- Run a coarse logarithmic one-seed sweep for `lambda`/`c` on the validation
  split, including zero and at least three non-zero strengths.
- Choose a knee point by a stated rule that jointly considers retention and
  acquisition; do not choose the highest final average alone.
- Confirm SeqFT, Replay, Uniform L2, EWC, and SI across at least three seeds at
  the selected setting.
- Report mean, standard deviation, and per-seed values. Avoid universal claims
  from three seeds.
- Compare EWC versus SI normalized importance using layerwise mass, Spearman
  rank correlation, and top-k overlap on a deterministic sampled subset when a
  full-model sort is too expensive.
- Perform equal-norm high-importance versus low-importance perturbation tests on
  the just-completed task checkpoint. Restore the checkpoint after every probe.
- Include one failure-analysis branch that distinguishes estimator failure,
  over-regularization, under-regularization, insufficient task interference,
  and diagonal interaction effects.

## 7. Fairness and resource reporting

Report separately:

- ordinary optimizer updates and train-token exposure;
- EWC consolidation examples and extra forward/backward work;
- SI per-update bookkeeping overhead;
- wall time and peak VRAM;
- persistent bytes for anchors, importance, and auxiliary trajectory state;
- number of stored raw examples and whether old raw data is accessed during a
  later task.

Replay and parameter regularization solve different storage/access constraints.
The lab must not call either comparison “free” or infer privacy guarantees from
the absence of a replay buffer.

## 8. Coding and presentation style

- Follow the baseline's plain PyTorch/Transformers style, Vietnamese docstrings,
  uppercase configuration constants, deterministic seeds, explicit cleanup,
  progress bars, `results[method]`, matrix/metric helpers, and JSON artifacts.
- Refactor the copied training loop only enough to add strategy hooks:
  `penalty_before_backward`, `before_optimizer_step`, `after_optimizer_step`,
  and `consolidate_task`. Keep SeqFT behavior identical when hooks are absent.
- Use actual parameter deltas for SI so AdamW, gradient clipping, and mixed
  precision are reflected in the path contribution.
- Keep result prose conditional and data-driven. Sample output must be produced
  by a recorded run, never invented to make the paper hypothesis look correct.
- Reuse existing MDX components; add no new React visualization primitive.
- Use ordinary prose by default. Add `LessonNote` only if the user explicitly
  requests a callout during implementation.

# Planned lesson structure

The authored lab will use approximately nine pages:

1. **Câu hỏi nghiên cứu** — experiment checklist, hypotheses, and what would
   count as contrary evidence.
2. **Kế thừa baseline** — contract hash, artifact loading, validation/test
   boundary, and T4 memory gate.
3. **Strategy hooks** — the minimal training-loop extension shared by L2, EWC,
   and SI.
4. **EWC** — empirical-Fisher consolidation state, penalty, and numerical
   sanity checks (`F >= 0`, zero penalty at the anchor).
5. **Synaptic Intelligence** — actual-update path credit, task displacement,
   damping, cumulative importance, reset boundary, and invariants.
6. **Controls và sweep** — SeqFT/Replay reuse, Uniform L2, optional shuffled
   importance, validation sweep, and knee-selection rule.
7. **Final multiseed run** — stage-by-task matrices, CL metrics, confidence
   summaries, and matched resource table.
8. **Nhìn vào bên trong** — layerwise importance, EWC–SI agreement, top-k
   overlap, and high/low-importance perturbation probe.
9. **Đối chiếu giả thuyết** — evidence table, alternative explanations,
   limitations, artifact saving, and follow-up experiments.

The adjacent Quiz will assess experiment-contract compatibility, empirical
Fisher boundaries, SI update ordering, uniform/shuffled controls, avoidance of
test leakage, retention versus acquisition, perturbation interpretation,
resource accounting, and the difference between an unsupported and an
unresolved hypothesis.

# Files expected to change

- Add the EWC/SI lab MDX and adjacent Quiz MDX under
  `src/content/learning/continual-learning-llm/`.
- Update `table-of-contents.ts` to insert the published pair.
- Rename only downstream Chapter 2 numeric filename prefixes if required for
  sequential source ordering; preserve metadata IDs and routes.
- Update `papers.ts` with one course-lab claim boundary using the existing EWC
  and SI paper records.
- Add occurrence-level records to `citationEvidence.ts` for paper-backed method
  claims authored in the lab.
- Update aggregate Learning MDX test expectations after adding the pair and its
  Quiz questions.
- Update `wiki/concepts/learning-lab.md` for the new pair, baseline extension
  contract, and derived course counts.
- Update this plan's execution log with pilot decision, measured runs, files,
  and verification results.

# Phases

## Phase 0 — Approval checkpoint

- Store this draft plan.
- Wait for explicit user approval before changing lesson, catalog, citation,
  test, or wiki files.

## Phase 1 — Establish the runnable contract

- Add the catalog pair and minimal MDX skeleton only after approval.
- Reuse/load the baseline helper contract and add a deterministic validation
  split plus contract hash.
- Implement strategy hooks with a SeqFT equivalence smoke test.

## Phase 2 — Implement and audit EWC/SI

- Implement EWC empirical-Fisher estimation, cumulative state, anchor penalty,
  and boundary reset.
- Implement SI online path accumulation from actual optimizer deltas, damping,
  cumulative importance, and task-boundary reset.
- Add tensor-level invariants and a small deterministic numerical reference.
- Run the one-stage 360M T4 feasibility gate; record whether full scope or the
  common fallback scope becomes the final contract.

## Phase 3 — Add controls and exploratory analysis

- Implement Uniform L2 and shuffled-importance controls.
- Implement validation sweeps and the predeclared knee-selection rule.
- Add layerwise distributions, EWC/SI agreement measures, and perturbation
  probes.
- Log compute, memory, persistent state, and data-access cost.

## Phase 4 — Run and author evidence-backed results

- Produce one pilot sweep and at least three final seeds under one compatible
  contract.
- Populate sample outputs, tables, and plots only from captured artifacts.
- Write the hypothesis audit, including mixed/negative findings and alternative
  explanations.
- Add the paired Quiz with exact concept parity and balanced correct-option
  placement.

## Phase 5 — Verify and document

- Run Python syntax checks for every authored Python block.
- Run targeted MDX inspection, theory/Quiz concept parity, citation-evidence
  audit, math validation, and scoped whitespace checks.
- Run `npm run verify`; distinguish new failures from the existing dirty
  Regularization Overview worktree state.
- Inspect the final diff to preserve unrelated user changes.
- Update the canonical Learning Lab wiki and this execution log.

# Review checkpoints during execution

Pause for user review after:

1. the page outline plus code API is authored but before expensive full runs;
2. the memory pilot chooses full-model versus shared fallback scope;
3. the one-seed sweep is available, before committing to the three-seed run;
4. raw result tables are available, before writing the final interpretation.

# Out of scope

- Claiming an exact reproduction of the original permuted/split MNIST or Atari
  experiments.
- Claiming EWC or SI is generally superior to Replay or to modern LLM CL
  methods.
- Adding online EWC, MAS, K-FAC/full-Fisher variants, LoRA-specific
  regularization, or blurred/unknown task boundaries.
- Tuning against final test metrics or hiding failed seeds.
- Creating new global or domain-specific React UI components.

# Execution log

- 2026-09-14 — Plan approved after review of the baseline lab, corrected
  EWC/SI lesson, content contracts, original papers, and SI reference code.
- 2026-09-14 — Added the nine-page lab, nine-question Quiz, catalog/citation
  records, strategy hooks, experiment contract, controls, validation sweep,
  multiseed analysis, importance probes, and resource reporting.
- 2026-09-14 — Built and statically validated the external Colab notebook. Its
  final T4 contract uses SmolLM2-135M, four tasks, 2,048/256/512 examples,
  128 applied updates per task, 256 Fisher samples, Replay capacity 512,
  validation-only SI tuning, three final seeds, and shifted-EWC control.
- 2026-09-14 — Paper and fairness audits corrected SI path credit to use the
  unregularized task gradient with actual optimizer delta, Replay ordering,
  scaler lifetime/update accounting, contract hashing, class scoring, metric
  names, acquisition gating, and importance diagnostics. Static notebook,
  synthetic metric, sweep, TypeScript, build, catalog, citation, concept-parity,
  and whitespace checks passed at that checkpoint.
- 2026-09-14 — Renumbered downstream Chapter 2 MDX files without changing
  stable IDs/routes and regenerated catalog statistics. GPU execution and the
  evidence-backed Phase 4 interpretation remain pending in user-provided Colab;
  no runtime results are claimed in the repository.

---
title: Source-Grounded EWC and SI LLM Code Lab
status: completed
created: 2026-09-17T17:30:00+07:00
updated: 2026-09-17T17:43:00+07:00
author: Codex
task: "Rebuild the embedded MDX EWC/SI lab from implementations proven in language-model pipelines, then port them to the existing model, benchmark, SeqFT, and Replay contract"
supersedes:
  - docs/plans/2026-09-14-ewc-si-hypothesis-driven-code-lab.md
  - docs/plans/2026-09-16-finalize-continual-learning-worktree.md
---

# Goal

Replace the current pseudocode-oriented EWC/SI lab with a self-contained,
executable MDX code lab. The lab will port implementation logic from verified
external repositories into the existing Pythia-160M task stream, compare it fairly
with sequential fine-tuning and replay, and inspect whether the observed
behavior matches each method's mechanism.

All learner-facing Python remains embedded in
`2.1.11-ewc-si-code-lab.vi.mdx`. No project `.py` implementation module is
introduced. A standalone notebook outside the repository is generated from the
same cell logic for the external Colab run.

# Lineage

Supersedes [EWC and Synaptic Intelligence Hypothesis-Driven Code Lab](./2026-09-14-ewc-si-hypothesis-driven-code-lab.md)
and [Finalize Continual Learning Worktree](./2026-09-16-finalize-continual-learning-worktree.md).

# Decisions (locked)

- “Reproduce” means reproduce the implementation mechanism from a successful
  language-model code path, then deliberately replace its model and benchmark
  with the lab contract. It does not mean reproduce the source paper's reported
  table.
- Use `Neurotechnology/LLM_EWC` and its Gemma2 continual-pretraining report as
  the primary EWC implementation reference. Port its separate empirical-Fisher
  pass, parameter anchor, and Fisher-weighted quadratic loss without importing
  that repository at runtime.
- A source is eligible for SI only if SI is connected to an actual
  Transformer/language-model training path. A standalone `si.py`, an API that
  cannot be called by the repository's NLP loop, or an untested generic wrapper
  is insufficient.
- `PLM4CL/models/si.py` is not accepted as an NLP implementation reference:
  its `observe` signature is incompatible with the repository's `train_nlp`
  call, while the published NLP experiment scripts use EWC rather than SI.
- If no public SI repository passes the source gate, do not invent or overstate
  provenance. Record that evidence gap explicitly before choosing whether the
  lesson keeps SI as a separately validated algorithm port.
- Preserve the lab chain's model and benchmark contract: Pythia-160M-deduped,
  DBpedia → Amazon → Yahoo → AG News, identical sample IDs, update budget,
  evaluator, and final seeds across methods.
- Compare SeqFT, Replay, EWC, and SI under the same contract. Uniform L2 and
  shuffled importance remain mechanism controls rather than headline methods.
- Keep source code readable and local to MDX cells; external repositories are
  references, not dependencies that learners must clone.
- Report retention, acquisition, forgetting, compute/state cost, loss
  trajectories, layerwise importance, importance–drift, EWC–SI agreement, and
  equal-norm perturbation evidence. Do not infer mechanism from final accuracy
  alone.

# Phases

## Phase 0 — Source audit

- Freeze the exact EWC source commit and map its Fisher, anchor, and penalty
  operations to the lab cells.
- Search for and inspect SI candidates at call-site level, requiring a real
  language-model training entry and evidence of a completed experiment.
- Produce a compact provenance table: source operation, MDX port, intentional
  adaptation, and invariant used to validate the port.

## Phase 1 — Rebuild executable MDX cells

- Replace abbreviated strategy pseudocode with the complete setup, data,
  tokenization, model, optimizer, AMP, evaluation, and artifact utilities.
- Embed complete SeqFT and Replay paths from the shared experiment contract.
- Embed complete EWC and SI strategy implementations after the source gate is
  resolved.
- Keep all code in MDX fenced cells and preserve the nine-page pedagogical
  progression unless execution clarity requires a metadata-aligned change.

## Phase 2 — Correctness and fairness checks

- Test zero penalty at anchors, non-negative finite importance, unchanged
  parameters during EWC consolidation, and SI scalar/path-credit calculations.
- Assert identical Task-A ordering and loss trajectory for methods that have no
  active memory yet.
- Count attempted/applied AMP updates and reject runs with skipped updates.
- Verify Replay only changes the current-task training stream after memory
  exists.
- Verify each method receives identical ordinary optimizer-update budgets.

## Phase 3 — Analysis and visualization

- Add complete plotting functions for task/penalty/total loss trajectories,
  stage-by-task matrices, metric and resource comparisons, importance heatmaps,
  importance–drift plots, EWC–SI agreement, penalty attribution, and
  perturbation trials.
- Generate an evidence table that marks each hypothesis Supported, Mixed,
  Unsupported, or Unresolved from predeclared measurements.

## Phase 4 — Notebook export and verification

- Export the MDX cell logic to `/home/khiem/ewc_si_hypothesis_lab.ipynb` without
  storing the notebook in the repository.
- Syntax-check extracted Python cells and run the narrowest available CPU smoke
  tests; reserve the full GPU multiseed experiment for Colab.
- Run repository verification appropriate to the MDX/catalog changes.
- Update this plan's execution log and the existing Learning Lab documentation
  surface if the authored-content contract changes.

# Out of scope

- Reproducing the original source model, dataset, or paper result table.
- Claiming EWC or SI is state of the art.
- Adding external implementation `.py` files to the repository.
- Making EasyCL, Continual-NExT, PLM4CL, or LLM_EWC a runtime dependency.
- Fabricating SI-on-LLM provenance when no public code path satisfies the
  source gate.

# Execution log

- 2026-09-17 — Plan created after auditing the current MDX, the direct Gemma2
  EWC implementation, EasyCL/Continual-NExT, and the disconnected PLM4CL SI
  file.
- 2026-09-17 — User approved the stored plan.
- 2026-09-17 — Execution started.
- 2026-09-17 — User locked `EleutherAI/pythia-160m-deduped` as the shared
  checkpoint for the Replay, sequential-baseline, and EWC/SI lab chain. Gemma2
  remains an implementation source only.
- 2026-09-17 — Synchronized Replay, sequential baseline, EWC/SI lesson, and the
  external notebook on Pythia-160M. Added source provenance for the released
  Gemma2 EWC path, original SI code, and independent Whisper Transformer
  evidence; kept the SI causal-LLM code gap explicit.
- 2026-09-17 — Updated the notebook's optional partial-scope resolver for the
  GPT-NeoX module tree, syntax-checked all 16 code cells, and confirmed no old
  checkpoint remains in executable notebook cells.
- 2026-09-17 — `npm run verify` passed: TypeScript typecheck, 160 tests, and the
  production build.

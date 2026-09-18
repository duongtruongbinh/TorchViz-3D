---
title: Harden EWC and SI Hypothesis Lab for Full Runs
status: executing
created: 2026-09-18T00:10:00+07:00
updated: 2026-09-18T02:05:00+07:00
author: Codex
task: "Correct every audit finding in the EWC/SI hypothesis notebook and its canonical Learning Lab source without patches or fallback execution paths"
supersedes:
  - docs/plans/2026-09-17-source-grounded-ewc-si-llm-lab.md
---

# Goal

Make the canonical Learning Lab EWC/SI code and the exported notebook safe for
an unattended full experiment on Pythia-160M. Correct the underlying execution
and persistence design rather than masking failures, weakening assertions, or
adding alternate model paths.

The canonical authored source remains
`src/content/learning/continual-learning-llm/2.1.9-ewc-si-code-lab.vi.mdx`.
The synchronized external deliverable remains
`/home/khiem/ewc_si_hypothesis_lab.ipynb`.

# Lineage

Supersedes [Source-Grounded EWC and SI LLM Code Lab](./2026-09-17-source-grounded-ewc-si-llm-lab.md).

# Decisions (locked)

- `EleutherAI/pythia-160m-deduped` is the only model. Remove generic
  SmolLM/Llama/Gemma-style architecture fallback code from the executable path.
- Preserve the benchmark order DBpedia → Amazon Polarity → Yahoo Answers → AG
  News and the six methods SeqFT, Replay, Uniform L2, EWC, SI, and
  shuffled-EWC.
- Keep the audited EWC and SI mathematics: per-example observed-label Fisher,
  exact merged quadratics, task-only SI gradient, actual optimizer delta, and
  no path credit for skipped AMP updates.
- Use a dedicated tuning seed disjoint from final seeds. Dataset sampling keeps
  its own explicit seed.
- Replace cyclic Fisher rolling with a deterministic, seeded within-tensor
  random permutation. Preserve each tensor's exact importance multiset.
- Make sample identity content-based and independently verify uniqueness and
  pairwise split disjointness. Split names may be recorded separately but must
  not conceal duplicate content.
- Make Task-A fairness deterministic and evidence-based: compare sample-order
  digests and numerics with strict tolerances. Do not weaken the comparison to a
  superficial count check.
- Handle partial gradient accumulation mathematically correctly. A short final
  accumulation group must have the same mean-gradient semantics as a full
  group, including the SI regularizer subtraction.
- Treat any skipped/non-finite optimizer update as a failed run. The SI path
  accumulator must remain unchanged for that update.
- Checkpoints are atomic and resumable by `(contract_id, seed, method)`.
  Resume must reject incompatible contracts rather than silently falling back
  to a fresh or mixed run.
- Keep large XAI data bounded in memory and on disk. Store deterministic,
  parameter-weighted summaries or compact samples instead of millions of
  repeated row dictionaries; do not silently drop an analysis dimension.
- Measure GPU peaks across training, consolidation, evaluation, and
  perturbation phases. Resource reporting must not label a training-only peak
  as a method peak.
- Scope perturbation claims explicitly and probe both post-Task-A and final
  state for the first final seed.
- Pin the executable dependency versions and the Hugging Face model/tokenizer
  revision used by the experiment contract.
- Do not add recovery fallbacks, alternate models, permissive exception
  swallowing, or degraded execution branches.

# Phases

## Phase 1 — Canonical experiment contract

- Refactor the MDX and notebook configuration into explicit `smoke` and `full`
  contracts that both retain all four tasks and all six methods.
- Add independent data, tuning, and final seeds; pinned dependency and model
  revisions; content-level sample IDs; and split-integrity assertions.
- Add a 5–10 minute smoke contract with sweep disabled, bounded examples and
  XAI samples, one seed, and one perturbation trial.

## Phase 2 — Training and strategy correctness

- Restrict model validation and module resolution to GPT-NeoX/Pythia.
- Correct partial accumulation normalization and keep SI task-gradient removal
  consistent with the effective regularizer multiplier.
- Replace shuffled-EWC rolling with seeded random permutations and test exact
  distribution preservation plus changed positions.
- Make Task-A Replay fairness compare deterministic sample orders and tolerant
  numeric trajectories.
- Extend unit checks for causal shifting, AMP-skipped SI credit, partial
  accumulation, model immutability during Fisher consolidation, and exact
  perturbation restoration.

## Phase 3 — Durable results and bounded XAI

- Introduce an atomic JSON writer and a strict checkpoint loader keyed by the
  contract ID.
- Resume completed methods without rerunning them and reject partial or
  incompatible checkpoint contents with an explicit error.
- Replace raw drift-row growth with compact, weighted summaries/samples that
  preserve layer, stage, method, and parameter-position evidence.
- Record phase-level timing and GPU peaks through the end of consolidation and
  probes.
- Run perturbation probes at post-Task-A and final boundaries and label plots
  with the exact checkpoint scope.

## Phase 4 — Synchronization and verification

- Update the canonical MDX explanations and executable excerpts to match the
  corrected implementation.
- Synchronize the standalone notebook from the same cell logic and confirm the
  two surfaces contain identical executable invariants.
- Parse every notebook cell and run the embedded dependency-free checks.
- If PyTorch/Transformers are available, run strategy unit tests and the
  four-task/six-method smoke run; otherwise install only the pinned notebook
  dependencies in an isolated temporary environment and run the same smoke
  contract. A failed smoke is a hard failure, not a fallback condition.
- Run focused Learning Lab tests, `git diff --check`, and `npm run verify`.
- Re-audit all former BLOCKER/MAJOR/MINOR findings, record exact results here,
  and leave the plan incomplete if any Run-all gate remains unresolved.

# Out of scope

- Running the multi-hour full sweep/final experiment.
- Changing the benchmark, method set, Pythia checkpoint, EWC/SI definitions, or
  learner-facing hypothesis set.
- Adding a second implementation module or a compatibility model path.
- Committing, pushing, or altering unrelated existing worktree changes.

# Acceptance criteria

- A four-task/six-method smoke contract exists and completes within the stated
  target on the intended GPU class.
- Tuning and final seeds are disjoint; validation never reads final-test rows.
- All methods have equal ordinary update budgets, and Replay Task A reproduces
  SeqFT under deterministic evidence checks.
- EWC merge, Fisher immutability, SI sign, task-only path credit, actual delta,
  AMP skip handling, and partial accumulation tests pass.
- Shuffled-EWC preserves every per-tensor value multiset while using a true
  seeded permutation.
- Checkpoint writes are atomic, completed methods resume, and contract mismatch
  fails explicitly.
- Artifact growth is bounded and no raw million-row drift structure remains.
- Method peak VRAM includes consolidation and probes.
- Post-Task-A and final perturbation results are separately labeled and restore
  model weights exactly.
- Canonical MDX and external notebook are synchronized.
- `npm run verify` and `git diff --check` pass.

# Execution log

- 2026-09-18 — Draft plan created from the strict read-only audit. No source or
  notebook file was modified before this checkpoint.
- 2026-09-18 — User approved the stored plan; execution started.
- 2026-09-18 — Rebuilt the notebook contract around pinned Pythia and dataset
  revisions, independent data/tuning/final seeds, four-task smoke and full
  modes, strict GPT-NeoX validation, content-level split integrity, exact
  partial-accumulation semantics, true shuffled-EWC permutations, atomic
  contract-bound checkpoints, bounded parameter-weighted XAI, phase-wide VRAM
  accounting, and post-Task-A/final perturbation probes.
- 2026-09-18 — Synchronized the canonical MDX explanations and excerpts with
  the executable invariants. No new runtime route, catalog metadata surface,
  or compatibility implementation was introduced.
- 2026-09-18 — Embedded unit checks passed in an isolated environment with the
  pinned package versions. They cover causal shifting, EWC merge/permutation,
  partial accumulation, Replay copying, SI sign/skip/actual-delta behavior,
  cumulative non-negative importance, and bitwise perturbation restoration.
- 2026-09-18 — Loaded the exact pinned Pythia-160M revision and completed a
  finite forward/backward step: `GPTNeoXForCausalLM`, 12 layers, 162,322,944
  parameters. All four pinned streaming datasets satisfied the 32/8/8 smoke
  quotas and content-level uniqueness/disjointness checks.
- 2026-09-18 — The exact four-task/six-method orchestration completed with a
  deliberately tiny test-only causal model, including both perturbation
  stages. Atomic save/load/resume and explicit contract-mismatch rejection
  also passed. This validates control flow but is not recorded as the target
  Pythia GPU smoke run.
- 2026-09-18 — `npm run verify`, `git diff --check`, notebook JSON parsing, and
  executable-cell syntax checks passed. Notebook outputs and execution counts
  remain cleared.
- 2026-09-18 — Target-GPU Pythia smoke remains pending because this host has no
  CUDA device. The plan intentionally remains `executing`; the multi-hour full
  run is not authorized until that smoke gate passes.

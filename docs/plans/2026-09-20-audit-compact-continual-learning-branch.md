---
title: Audit and Compact the Continual Learning Branch
status: done
created: 2026-09-20T18:04:47+07:00
updated: 2026-09-20T21:10:00+07:00
author: Nguyen Manh Khiem
task: "Audit the current branch for logic, commentary, and redundant code; fix findings; compact branch documentation into one concise file; verify and commit"
supersedes:
  - docs/plans/2026-09-14-correct-weight-regularization-ewc-si.md
  - docs/plans/2026-09-14-ewc-si-hypothesis-driven-code-lab.md
  - docs/plans/2026-09-16-finalize-continual-learning-worktree.md
  - docs/plans/2026-09-17-source-grounded-ewc-si-llm-lab.md
  - docs/plans/2026-09-18-audit-and-commit-continual-learning-consolidation.md
  - docs/plans/2026-09-18-harden-ewc-si-hypothesis-lab.md
  - docs/plans/2026-09-18-merge-synthetic-replay-into-real-data-lab.md
  - docs/plans/2026-09-18-sync-replay-lab-real-run-results.md
  - docs/plans/2026-09-19-linear-seed42-ewc-si-lab.md
  - docs/plans/2026-09-19-simplify-full-replay-ewc-si-labs.md
---

# Goal

Finish the branch with correct, copyable Replay and EWC/SI labs, concise
source-grounded lessons, one plan, passing verification, and one final commit.

# Lineage

This file absorbs the ten branch-local plans listed in `supersedes`. It replaces
their overlapping proposals, audits, and execution logs with the final contract
below; committed predecessors remain available in Git history.

# Final contract

- Both Colab labs run top to bottom with Pythia-160M, four pinned datasets, seed
  42, 2,048 train rows, 64 held-out rows, batch 4, accumulation 4, and 128 applied
  updates per stage.
- Replay owns `seqft_replay_seed42.json`; EWC/SI validates and reuses its exact
  samples instead of retraining the baselines.
- SeqFT and Replay share Base and After-A rows before Replay begins. AMP skips,
  incompatible artifacts, corrupt checkpoints, and stale checkpoint contracts
  fail loudly.
- EWC/SI tunes on a disjoint validation split. A configuration is eligible only
  when every diagonal learning gain is positive; held-out test never selects it.
- Uniform L2 and Shuffled-EWC remain mechanism controls. Results are interpreted
  conditionally; the lesson contains no fabricated layerwise or multi-seed claims.
- The typed TOC, locale MDX, source evidence, quiz concepts, and Light-Mode shared
  Learning Lab architecture remain unchanged in ownership.
- Both web notebooks keep a clean linear flow: their bootstrap reuses compatible
  Colab packages instead of reinstalling the full scientific stack, and every
  dataset points to a valid pinned public Hugging Face revision without a manual
  hotfix cell.
- Copying an authored Python block preserves source operators verbatim; the
  `==...==` presentation-marker cleanup is confined to output blocks.
- Model loading relies on the default FP32 dtype instead of passing the
  deprecated, redundant `torch_dtype=torch.float32` keyword.
- Replay reports the validated seed-42 run as observed evidence and provides a
  standalone artifact-only visualization cell for per-task rolling loss and
  linear loss slope; rendering the chart never retrains either baseline.
- The checked-in seed-42 loss-slope figure sits beside its generating cell with
  concise interpretation and an explicit warning that the linear fit is a trend
  summary, not a prediction of negative token loss.
- Tests protect behavior and experiment contracts without mirroring incidental
  package lists, remote hashes, prose strings, local ignored assets, exact cell
  counts, or exact corpus-wide answer-position totals.

# Out of scope

- Running the multi-hour GPU benchmark or inventing replacement numeric results.
- Changing routes, adding UI, pushing the branch, or altering unrelated files.

# Execution log

- 2026-09-20 — Plan stored and approved after reading the repo workflow,
  architecture, Learning Lab ownership guide, authoring rules, full branch diff,
  and ten predecessor plans.
- 2026-09-20 — Fixed Replay's extra Stage-A shuffle, reseeded every method run,
  detected skipped AMP updates, corrected update-loss averaging, reset per-stage
  memory peaks, added durable artifact writes, and enforced comparison invariants.
- 2026-09-20 — Added model/dataset provenance, learning-gain metrics and gates,
  strict baseline validation, and a hashed resumable checkpoint contract.
- 2026-09-20 — Removed unsupported numeric Replay output and EWC/SI importance
  claims; corrected mini-batch Fisher, online-EWC, SI, privacy, and
  function-regularization wording; synchronized quizzes and wiki counts.
- 2026-09-20 — Removed unused plotting/scientific packages and deleted the ten
  superseded plan files. Python fences parse and pass Pyflakes; focused tests,
  TypeScript typecheck, and `git diff --check` pass.
- 2026-09-20 — Final verification passed: `npm run verify` (161 tests and
  production build), catalog stats, and all 172 referenced R2 assets. The four
  branch-added citation records passed the source audit; 24 pre-existing remote
  anchor/search drifts remain reported for manual maintenance outside this task.
- 2026-09-20 — Reopened by user request after a live Colab run exposed slow
  dependency replacement and dead remote revisions. The follow-up is folded into
  this compact plan; the separate draft follow-up plan was discarded.
- 2026-09-20 — Simplified both Colab bootstrap cells to reuse the platform
  scientific stack and install only missing Hugging Face packages; removed the
  unused Accelerate dependency and exact-version rejection in the EWC/SI lab.
- 2026-09-20 — Replaced the dead DBpedia and Amazon revisions, moved Yahoo to
  its compatible public community repository, and added regression assertions
  against the obsolete repository contract. All four pinned revisions returned
  HTTP 200 during verification.
- 2026-09-20 — Extracted Python cells parse and pass Pyflakes. Final
  `npm run verify` passed TypeScript checking, all 161 tests, and the production
  build; `git diff --check` also passed.
- 2026-09-20 — Reopened after two live copies dropped equality operators from
  the gradient-accumulation condition. The source was intact; the shared copy
  path incorrectly treated Python `==` pairs as output highlight markers.
- 2026-09-20 — Confined marker removal to output blocks and added a generic
  byte-for-byte code-copy invariant rather than coupling the regression test to
  one notebook variable. Final verification passed 163 tests, typecheck, build,
  the focused copy tests, and `git diff --check`.
- 2026-09-20 — Reopened after a successful live Replay run reported the
  Transformers `torch_dtype` deprecation warning. The supplied FP32 keyword is
  redundant because FP32 is the loader default, so the fix removes it without
  adding version-dependent notebook code.
- 2026-09-20 — Removed the deprecated keyword from Replay loading and both
  EWC/SI loading paths; added static regressions for both labs. Extracted Python
  parses, 28 focused MDX tests, all 163 repository tests, typecheck, production
  build, and `git diff --check` passed.
- 2026-09-20 — Reopened to incorporate the user's completed corrected Replay
  run and add loss-slope visualization from the saved artifact. The observed
  matrices and metrics remain explicitly scoped to seed 42 rather than presented
  as a multi-seed conclusion.
- 2026-09-20 — Added both observed evaluation matrices, the CL metric comparison,
  and an artifact-only fifth cell that plots raw/rolling loss plus per-task slope
  and prints slope per 100 updates. Regression coverage forbids model loading or
  baseline training in that visualization cell. Python syntax, Pyflakes, 28
  focused MDX tests, all 163 repository tests, typecheck, production build, and
  `git diff --check` passed.
- 2026-09-20 — Reopened to incorporate the user's generated loss-slope PNG into
  the Replay lesson under a stable semantic asset name and add a short,
  evidence-bounded interpretation.
- 2026-09-20 — Renamed the local figure to
  `02-replay-seed42-loss-slopes.png`, uploaded only that 74.5 KB object to the
  Learning Lab R2 prefix, embedded it after Cell 5, and clarified the nonlinear
  DBpedia curve and retention boundary. All 173 referenced CDN images are
  reachable; 28 focused MDX tests, all 163 repository tests, typecheck,
  production build, and `git diff --check` passed.
- 2026-09-20 — Reopened to audit branch-modified tests for implementation-detail
  hardcoding while retaining the invariants that catch real notebook, catalog,
  and clipboard regressions.
- 2026-09-20 — Audited all three branch-modified test files. Kept intentional
  clipboard fixtures and canonical catalog order; removed notebook cell counts,
  dependency/revision mirrors, prose/output literals, ignored local-asset checks,
  exact PaperSummary totals, and exact quiz totals/distributions. Replaced the
  latter with behavior-level multi-answer and relative position-balance checks.
  Focused tests, all 163 repository tests, typecheck, production build, and
  `git diff --check` passed.

---
title: Audit and Compact the Continual Learning Branch
status: done
created: 2026-09-20T18:04:47+07:00
updated: 2026-09-20T19:35:00+07:00
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

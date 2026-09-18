---
title: Audit and Commit the Continual Learning Consolidation
status: done
created: 2026-09-18T03:25:00+07:00
updated: 2026-09-18T03:45:00+07:00
author: Codex
task: "Remove any remaining redundant code after the Replay/EWC consolidation, then stage and commit the complete repository change set"
supersedes:
  - docs/plans/2026-09-18-harden-ewc-si-hypothesis-lab.md
  - docs/plans/2026-09-18-merge-synthetic-replay-into-real-data-lab.md
---

# Goal

Perform a final redundancy and consistency audit over the current Continual
Learning worktree, remove only code or authored content proven unreachable or
duplicated, verify the complete repository state, and create one commit on the
existing feature branch.

# Lineage

This plan closes the repository-side work from
[Harden EWC and SI Hypothesis Lab for Full Runs](./2026-09-18-harden-ewc-si-hypothesis-lab.md)
and
[Merge the Synthetic Replay Demo into the Real-Data Replay Lab](./2026-09-18-merge-synthetic-replay-into-real-data-lab.md).

# Decisions (locked)

- Work only on `feat/adjust-continual-learning`; do not commit to `main`.
- Audit the complete dirty worktree because all current repository changes are
  part of the Continual Learning source-grounding, EWC/SI hardening, Replay
  consolidation, renumbering, tests, and documentation chain.
- Remove only demonstrably unused helpers, obsolete lesson/evidence identities,
  duplicate synthetic content, or stale live references. Historical plan text
  may retain old filenames when it documents the state at that time.
- Preserve user-authored EWC/SI and real-data Replay changes. Do not rewrite
  working implementations merely to reduce diff size.
- `/home/khiem/ewc_si_hypothesis_lab.ipynb` is outside the Git repository and
  cannot be staged; verify that it remains unchanged during this task.
- Run the narrow structural checks and full `npm run verify` after any cleanup.
- Stage the complete repository change set, inspect the staged diff for secrets,
  generated build output, accidental files, and rename integrity, then create
  one non-interactive commit.

# Phases

## Phase 1 — Redundancy audit

- Search for removed lesson IDs, obsolete evidence keys, duplicate synthetic
  code, unused helpers, stale canonical paths, and unreferenced authored files.
- Confirm every Chapter 2 file resolves through the typed TOC and every evidence
  record is consumed exactly once.
- Remove only findings supported by repository references and tests.

## Phase 2 — Verification

- Run catalog/MDX structural checks, catalog stats validation, and
  `git diff --check`.
- Run `npm run verify` if cleanup changes executable or authored source.
- Confirm the external notebook SHA-256 is unchanged.

## Phase 3 — Stage and commit

- Stage all current repository changes.
- Inspect `git diff --cached --stat`, rename detection, and staged paths.
- Confirm `dist/`, temporary files, credentials, and the external notebook are
  absent from the index.
- Commit with a message describing the hardened EWC/SI lab and consolidated
  real-data Replay curriculum.

# Out of scope

- Pushing the branch or opening a pull request.
- Adding the external notebook to this repository.
- Changing experiment results or introducing another lesson implementation.
- Rewriting historical plans solely to replace old path names.

# Acceptance criteria

- No redundant runtime/content path remains from the deleted synthetic Replay
  pair or `sequential-cl-baseline-lab` identity.
- No newly unused helper or unresolved live reference remains.
- `npm run verify` and `git diff --check` pass.
- The staged diff contains only the intended Continual Learning changes and
  records renumbered files as content-preserving moves where applicable.
- A commit is created successfully on `feat/adjust-continual-learning`.

# Execution log

- 2026-09-18 — Confirmed the current branch is
  `feat/adjust-continual-learning`. Initial read-only search found no obsolete
  runtime lesson/evidence identities; remaining old paths occur only in plan
  history. Stored this plan before cleanup, staging, or committing.
- 2026-09-18 — User approved the stored plan; audit and commit execution
  started.
- 2026-09-18 — Redundancy audit found no remaining synthetic Replay code,
  obsolete runtime lesson IDs, stale evidence keys, duplicate Chapter 2 files,
  temporary files, or newly unused helpers. The retained Zheng et al. evidence
  is still required by the separate Chapter 1 forgetting lab.
- 2026-09-18 — `npm run lint` completed without errors. It reported 97
  pre-existing warnings and four informational diagnostics outside this
  Continual Learning change set; none were folded into this commit.
- 2026-09-18 — Catalog stats validation, `git diff --check`, typecheck, all 160
  tests, and the production build passed on the final pre-stage worktree.
- 2026-09-18 — Staged 25 intended paths. Rename detection reported nine
  downstream moves at 100% similarity and the edited EWC/SI move at 51%; no
  build output, temporary files, external notebook, or credential patterns
  entered the index.
- 2026-09-18 — Created and amended one commit on
  `feat/adjust-continual-learning` with message
  `feat(learning): consolidate replay and harden EWC SI labs`. The amend only
  records this plan's completed state.

---
title: Finalize Continual Learning Worktree in One Commit
status: done
created: 2026-09-16T09:25:14+07:00
updated: 2026-09-16T09:36:32+07:00
author: Codex
task: "Remove redundant code where safe, compact the changed documentation, verify the full worktree, and commit it once"
supersedes:
  - docs/plans/2026-09-14-correct-weight-regularization-ewc-si.md
  - docs/plans/2026-09-14-ewc-si-hypothesis-driven-code-lab.md
---

# Goal

Finalize every current tracked and untracked change on
`feat/adjust-continual-learning` as one coherent commit. Preserve the authored
Regularization Overview, corrected EWC/SI material, new EWC/SI lab pair,
downstream filename renumbering, catalog/test synchronization, and the existing
`ConceptHierarchy` adjustment while removing only demonstrably redundant code
or prose.

# Lineage

This finalization pass supersedes [Correct Weight Regularization EWC and
Synaptic Intelligence Content](./2026-09-14-correct-weight-regularization-ewc-si.md)
and [EWC and Synaptic Intelligence Hypothesis-Driven Code
Lab](./2026-09-14-ewc-si-hypothesis-driven-code-lab.md).

# Decisions (locked)

- Include the entire current worktree in exactly one commit; do not split the
  UI, lesson, lab, catalog, test, plan, or wiki changes.
- Treat “compact docs” as removing repeated process narration and stale detail
  from the changed plans/wiki while retaining lineage, durable decisions,
  measured outcomes, unresolved GPU-run status, and verification evidence.
- Audit redundancy with references and behavior in view. Remove code only when
  it is unused, duplicated without purpose, or mechanically simplifiable with
  unchanged behavior.
- Preserve stable lesson IDs and routes. Downstream numeric filename changes
  remain renames, not delete-and-recreate content changes.
- Do not fabricate EWC/SI experiment results. The external Colab run remains
  pending and must be stated as such.
- Keep Learning Lab Light Mode constraints and the locale-MDX/catalog boundary.

# Phases

## Phase 0 — Approval checkpoint

- Store this draft plan and wait for explicit approval.

## Phase 1 — Audit and clean

- Review the complete diff, new MDX files, renamed files, and reference usage.
- Remove safe dead or duplicated code and simplify the `ConceptHierarchy`
  implementation where possible without changing its rendered contract.
- Repair whitespace, metadata, heading/page indexes, citation evidence, and
  Theory/Quiz concept parity issues found by the audit.

## Phase 2 — Compact documentation

- Condense the two superseded September plans and changed wiki passages,
  preserving durable decisions and factual execution/verification state.
- Keep catalog statistics generated from the typed TOCs and avoid creating any
  additional documentation surface.

## Phase 3 — Verify

- Run focused Learning MDX/catalog/citation checks as useful during cleanup.
- Run `git diff --check` and `npm run verify` for the final worktree.
- Inspect the staged diff and confirm all current changes are included and no
  unrelated generated artifacts entered the repository.

## Phase 4 — Record and commit

- Mark this plan done and record actual cleanup plus verification results.
- Stage the full finalized worktree once and create exactly one descriptive
  commit on the existing feature branch.

# Out of scope

- Running the GPU/Colab experiment or inventing its output.
- Redesigning Learning Lab, changing routes, or adding new UI primitives.
- Rewriting unaffected documentation or cleaning unrelated repository history.
- Pushing the branch or opening a pull request.

# Execution log

- 2026-09-16 — Draft created after reviewing repository workflow, architecture,
  Learning Lab authoring rules, current branch/status, predecessor plans, and
  the worktree diff. No cleanup or staging performed pending approval.
- 2026-09-16 — User approved the plan; status advanced to `executing` and the
  full-worktree audit began.
- 2026-09-16 — Reused the recursive `ConceptHierarchyChildList` renderer for
  normal and single-expanding tree branches, removing duplicated nested/deep
  mapping while retaining the special connector geometry and card levels.
- 2026-09-16 — Repaired catalog counts/order, shortened the English lab title,
  aligned Regularization Theory/Quiz concept order, restored required citation
  and `PaperSummary` coverage, removed raw Unicode math, and fixed whitespace.
- 2026-09-16 — Compacted both September predecessor plans by removing repeated
  workflow narration while preserving decisions, verification history, the
  final notebook contract, and the unresolved external GPU-run boundary.
- 2026-09-16 — Confirmed all four downstream Chapter 2 filename changes are
  byte-identical renames with stable lesson IDs and routes. `git diff --check`
  passed.
- 2026-09-16 — `npm run verify` passed: TypeScript, 160/160 tests, and the
  2,962-module production build. Plan marked `done`; final staging and the
  requested single commit follow this recorded verification.

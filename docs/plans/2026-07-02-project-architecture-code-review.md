---
title: Project Architecture Code Review
status: done
created: 2026-07-02T08:15:39+07:00
updated: 2026-07-02T08:28:57+07:00
author: Codex
task: "Review the whole project architecture and codebase for scalability, reuse, duplication, unnecessary code, and pragmatic refactor opportunities."
supersedes: []
---

# Goal

Produce a review-only report for the current project state. The report should
identify architectural risks, scalability limits, duplicated or unnecessary
code, reusable boundaries, and focused improvements that reduce future diff
size without over-engineering. Large refactors may be recommended when they are
clearly justified by project shape, long-term maintenance cost, and current
pain points, but the recommendation must be staged into small reviewable
changes.

# Lineage

Genesis plan — no predecessor.

# Decisions (locked)

- This is a review task, not an implementation task.
- No application source, tests, or docs will be changed as part of the review,
  except this required plan file and its execution log/status updates.
- Findings should be actionable, grounded in exact files/lines, and ordered by
  severity or leverage.
- Recommendations should prefer the smallest change that solves the real
  problem. Broad refactors are acceptable only when the review can explain why
  a local cleanup would keep the system structurally worse.
- Large refactor recommendations must include migration order, risk, likely
  touched files, verification scope, and a clear reason they are not speculative
  abstraction.
- Verification will use read-only inspection plus `npm run verify` if feasible.

# Phases

## Phase 0 — Store this plan

Create this plan as the first write required by the project workflow.

## Phase 1 — Approval checkpoint

Wait for explicit approval before executing the full review.

## Phase 2 — Architecture map

Review the main pipeline and subsystem boundaries:

- root app entrypoints and `AppShell`
- zustand store and template state
- worker service, Pyodide worker, and torchstub boundary
- IR contract, layout engine, visual taxonomy, canvas renderer
- Learning Lab domain/catalog/practice structure

## Phase 3 — Code quality and reuse scan

Look for duplicated logic, large modules that own too many responsibilities,
avoidable prop/state churn, reusable domain boundaries, and dead or transitional
code. Prefer concrete examples over generic style feedback.

## Phase 4 — Scalability and risk review

Assess whether the architecture scales for more torchstub ops, more templates,
larger Learning Lab content, more exercises, and renderer/export evolution.

## Phase 5 — Verification and report

Run the narrowest useful verification, then deliver the final review in this
shape:

- critical/high findings first, with file and line references
- medium opportunities grouped by subsystem
- low-risk cleanup items
- what is already architecturally sound
- recommended next implementation sequence, including any justified larger
  refactors broken into reviewable phases

# Out of scope

- Implementing fixes.
- Implementing or rewriting broad subsystems during this review turn.
- Recommending broad subsystem refactors without concrete evidence and a staged
  migration path.
- Adding new framework dependencies.
- Changing routing, Learning Lab behavior, or runtime code unless a later
  approved implementation plan explicitly asks for it.

# Execution log

- 2026-07-02 — Plan created after initial context scan.
- 2026-07-02 — Scope clarified: large refactor recommendations are allowed when
  evidence-based, pragmatic, and staged; implementation remains out of scope.
- 2026-07-02 — User approved the review plan with "ok go"; status moved to
  executing.
- 2026-07-02 — Reviewed architecture, renderer/export, worker/torchstub,
  Learning Lab, exercises, and cleanup signals; ran `npm run verify`
  successfully and captured the final review in conversation.

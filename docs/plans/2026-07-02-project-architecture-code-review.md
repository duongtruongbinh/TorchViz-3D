---
title: Project Architecture Code Review
status: done
created: 2026-07-02T08:15:39+07:00
updated: 2026-07-02T20:26:42+07:00
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

# Implementation addendum — 2026-07-02

The user approved moving from review into fixes with "ok go". To honor the
"update the current plan, do not create a new plan" instruction, this addendum
scopes the implementation work inside the existing plan rather than creating a
new `docs/plans/` file.

## Implementation goal

Fix the highest-leverage issues from the renewed review while keeping the diff
small:

- preserve real selected-node visual state in the canvas
- reject impossible torchstub shapes for Conv2d, ConvTranspose2d, and
  PixelShuffle
- lazy-load the Learning Lab route so landing/workspace startup does not eagerly
  import Learning Lab and exercise content

## Implementation decisions

- Use TDD for behavior changes before production edits.
- Prefer focused regression tests over broad UI test infrastructure.
- Leave `SceneBlocks.tsx` decomposition and exercise frame extraction as
  follow-ups. They are valid maintainability work, but they are larger refactors
  without a current correctness failure.
- Do not introduce new dependencies or route behavior.

## Implementation phases

1. Add failing torchstub regression coverage for channel mismatch and
   PixelShuffle divisibility, then update `src/lib/python_sources.ts`.
2. Add a narrow wiring regression for selected-node canvas props, then pass
   `selectedNodeId` from workspace to `Canvas3D` and through to
   `SceneWithInstancing`.
3. Add a narrow route-boundary regression for Learning Lab lazy loading, then
   lazy-load `LearningLabView` in `AppShell`.
4. Run targeted tests after each fix, then `npm run verify`.
5. Record the implemented files and verification result in this plan.

# Execution log

- 2026-07-02 — Plan created after initial context scan.
- 2026-07-02 — Scope clarified: large refactor recommendations are allowed when
  evidence-based, pragmatic, and staged; implementation remains out of scope.
- 2026-07-02 — User approved the review plan with "ok go"; status moved to
  executing.
- 2026-07-02 — Reviewed architecture, renderer/export, worker/torchstub,
  Learning Lab, exercises, and cleanup signals; ran `npm run verify`
  successfully and captured the final review in conversation.
- 2026-07-02T16:42:50+07:00 — User requested a renewed whole-project
  architecture/code review under the existing plan; status moved back to
  executing. Scope remains review-only with no runtime source changes.
- 2026-07-02T16:47:13+07:00 — Re-reviewed the current repo state across
  routing, workspace/store/worker/torchstub/layout/canvas/export, Learning Lab,
  catalog selectors, practice renderers, and exercise UI. Ran `npm run verify`;
  typecheck, 87 tests, and production build passed. Build still reports the
  existing large `three-vendor` warning and an empty `react-vendor` chunk.
- 2026-07-02T16:47:13+07:00 — Prioritized findings for follow-up:
  `Canvas3D` does not receive real `selectedNodeId` and passes
  `highlightNodeId` as selection; torchstub Conv2d/ConvTranspose2d miss
  channel validation and PixelShuffle misses exact channel divisibility;
  `AppShell` eagerly imports Learning Lab, keeping that route in the landing
  bundle; exercise modals repeat enough shell/footer/input scaffolding to merit
  a small shared frame; `SceneBlocks.tsx` remains the main renderer complexity
  hotspot and should be split only along existing responsibilities.
- 2026-07-02T20:23:43+07:00 — User approved implementation with "ok go";
  added this implementation addendum and moved status to executing.
- 2026-07-02T20:26:42+07:00 — Implemented the scoped fixes:
  - added torchstub regressions in `src/lib/torchstubCore.test.ts`
  - added component-boundary regressions in `src/lib/componentWiring.test.ts`
  - validated Conv2d/ConvTranspose2d input channels and PixelShuffle channel
    divisibility in `src/lib/python_sources.ts`
  - forwarded real `selectedNodeId` through
    `TorchVizWorkspace -> Canvas3D -> SceneWithInstancing`
  - lazy-loaded `LearningLabView` from `AppShell`
- 2026-07-02T20:26:42+07:00 — Ran `npm run verify`; typecheck passed, 90
  tests passed, and production build passed. Build output now splits
  `LearningLabView` into its own chunk and reduces the main `index` chunk;
  the pre-existing `three-vendor` size warning and empty `react-vendor` chunk
  remain as follow-up cleanup.

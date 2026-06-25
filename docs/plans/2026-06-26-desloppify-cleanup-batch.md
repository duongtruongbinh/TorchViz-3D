---
title: Desloppify Cleanup Batch
status: done
created: 2026-06-26T01:30:00+07:00
updated: 2026-06-26T01:46:00+07:00
author: Codex
task: "Resolve the first safe cleanup batch from DESLOPPIFY.md after the Learning Lab domain refactor."
supersedes:
  - docs/plans/2026-06-25-learning-lab-domain-refactor.md
---

# Goal

Resolve a small, safe batch from `DESLOPPIFY.md` without taking on the larger
Tailwind/Pyodide self-hosting work.

Targeted items:

- `C3` - user Python execution has no timeout or recovery path.
- `M1` - dead code is not enforced by verification.
- `M4` / `M6` - reserved empty scaffold files are confusing.
- `M7` - input shape validation can silently fallback.
- Partial `M2` - derive route domain validation from the catalog instead of a
  duplicate UI list.
- Partial `M8` - remove stale landing RL localization keys.

# Lineage

Supersedes [2026-06-25-learning-lab-domain-refactor](./2026-06-25-learning-lab-domain-refactor.md)
because this is the first cleanup pass after that refactor and its
`DESLOPPIFY.md` scan.

# Decisions

- Do not attempt `C1` or `C2` in this batch. Tailwind build migration and
  Pyodide self-hosting affect packaging/deployment and should be separate
  focused tasks.
- Add tests before behavior changes for worker timeout and shape validation.
- Keep worker recovery simple: terminate a timed-out worker, recreate it, clear
  loading, and surface an actionable app error.
- Delete empty/unused scaffold files instead of keeping reserved placeholders.
- Enable TypeScript unused checks only after removing the currently reported
  unused symbols.

# Phases

## Phase 1 - Worker and shape validation tests

- Add `src/lib/workerService.test.ts`.
- Test that invalid `shapeInput` does not post to the worker and surfaces an
  error instead of silently falling back to the active template shape.
- Test that a run timeout terminates the stuck worker, recreates a new worker,
  clears loading, and surfaces a timeout error.

## Phase 2 - Worker implementation

- Export `WorkerService` for focused tests.
- Add injectable worker factory and timeout duration.
- Add shape validation authority in `WorkerService.run()`.
- Add timeout/recovery handling for stuck Python runs.

## Phase 3 - Static cleanup and unused enforcement

- Remove current unused symbols found by
  `npx tsc --noEmit --noUnusedLocals --noUnusedParameters --pretty false`.
- Enable `noUnusedLocals` and `noUnusedParameters` in `tsconfig.json`.

## Phase 4 - Dead scaffold cleanup

- Delete `src/core/answerCheck.ts`.
- Delete `src/store/uiStore.ts`.
- Delete `src/components/exercises/LearningDrawer.tsx`.
- Update active docs/wiki references that describe those files as reserved.

## Phase 5 - Small Learning Lab cleanup

- Derive Learning Lab route domain validation from `learningCatalog.domains`.
- Remove stale landing-page RL localization keys that no component uses after
  the RL surface merge.

## Phase 6 - Backlog and verification

- Update `DESLOPPIFY.md` to mark resolved/partially resolved items.
- Run:
  - `node --test src/lib/workerService.test.ts`
  - `npx tsc --noEmit --noUnusedLocals --noUnusedParameters --pretty false`
  - `npm run verify`
  - `git diff --check`

# Out Of Scope

- Tailwind/PostCSS migration.
- Self-hosting Pyodide/WASM assets.
- Full Learning Lab dark theme pass.
- Browser-route smoke automation.
- Exercise modal shell extraction.
- Moving root `App.tsx` / `index.tsx` under `src/`.

# Execution Log

- 2026-06-26T01:30:00+07:00 - Plan created and marked executing after user
  explicitly requested branch, commit, push, and code cleanup execution.
- 2026-06-26T01:36:00+07:00 - Added focused `WorkerService` tests for invalid
  shape rejection and run timeout recovery. The first runnable red state failed
  because `WorkerService` was not exported yet.
- 2026-06-26T01:39:00+07:00 - Implemented worker timeout recovery, invalid
  input-shape rejection, and testable worker factory injection.
- 2026-06-26T01:42:00+07:00 - Removed unused symbols, enabled
  `noUnusedLocals` and `noUnusedParameters`, deleted dead scaffold files, and
  updated active docs/wiki references.
- 2026-06-26T01:44:00+07:00 - Applied small Learning Lab cleanup by deriving
  route domain validation from the catalog and removing stale landing RL
  localization keys.
- 2026-06-26T01:46:00+07:00 - Final verification passed:
  `node --test src/lib/workerService.test.ts`,
  `npx tsc --noEmit --noUnusedLocals --noUnusedParameters --pretty false`,
  and `npm run verify`.

---
title: Complete Desloppify Backlog
status: done
created: 2026-06-26T02:05:00+07:00
updated: 2026-06-26T12:17:42+07:00
author: Codex
task: "Resolve the remaining open items in DESLOPPIFY.md."
supersedes:
  - docs/plans/2026-06-26-desloppify-cleanup-batch.md
---

# Goal

Resolve the remaining open `DESLOPPIFY.md` items on the
`learning-lab-domain-refactor-cleanup` branch and push the resulting commits.

Remaining target items:

- `C1` - remove production CDN HTML dependencies.
- `C2` - remove public-CDN Pyodide runtime dependency.
- `M2` - finish catalog-owned Learning Lab display metadata.
- `M3` - make Learning Lab dark theme coherent.
- `M5` - extract repeated exercise modal lifecycle/shell concerns.
- `M8` - finish Learning Lab/i18n cleanup.
- `M9` - add automated route/UI smoke coverage.
- `N1` - remove broad mobile zoom constraint.
- `N2` - reduce type looseness where practical.
- `N3` - remove always-on WebGL drawing-buffer preservation unless needed.
- `N4` - resolve root entrypoint confusion by documenting it rather than moving
  app boot files in this already-large branch.

# Lineage

Supersedes [2026-06-26-desloppify-cleanup-batch](./2026-06-26-desloppify-cleanup-batch.md),
which resolved `C3`, `M1`, `M4`, `M6`, and `M7`, and partially resolved `M2`
and `M8`.

# Decisions

- Use Tailwind through the Vite/PostCSS build instead of the browser CDN.
- Remove Google Font and importmap CDN references from `index.html`; use local
  system font fallback.
- Use the `pyodide` npm package and Vite static copy step so the worker loads
  `/pyodide/pyodide.js` and `/pyodide/` assets locally.
- Keep entrypoint files at root for this branch; document the convention instead
  of moving boot files and increasing churn.
- Extract exercise modal lifecycle first. Do not rewrite exercise math/content.
- Add a small Node smoke test for route declarations/legacy redirect mapping
  instead of introducing a full browser test framework in this pass.

# Phases

## Phase 1 - Build-local Tailwind and HTML cleanup

- Install Tailwind/PostCSS dev dependencies.
- Add Tailwind and PostCSS config.
- Import Tailwind layers in `src/index.css`.
- Remove Google Fonts, Tailwind CDN script/config, and the stale importmap from
  `index.html`.
- Remove `maximum-scale=1.0, user-scalable=no` from the viewport.

## Phase 2 - Local Pyodide runtime

- Add the `pyodide` npm dependency.
- Add a Vite plugin that copies the installed Pyodide runtime files into
  `dist/pyodide`.
- Update `src/workers/pyodideWorker.ts` to load `/pyodide/pyodide.js` and use
  `/pyodide/` as `indexURL`.
- Remove unused `micropip` package loading.

## Phase 3 - Learning Lab catalog/i18n/theme cleanup

- Add display metadata keys to core learning catalog types/content.
- Move domain/track display copy into localization and consume it from
  `learningText.ts`.
- Add missing Learning Lab shell strings to localization and remove hard-coded
  labels from the Learning Lab shell.
- Add compact theme helpers/classes so dark mode applies to cards, lesson
  panels, and practice containers consistently.

## Phase 4 - Exercise modal lifecycle extraction

- Add a shared `useExerciseModalLifecycle` hook for Escape handling, focus
  capture, focus restore, and close-button focus.
- Use it in `ShapeExercise`, `ValueExercise`, and `ConvExerciseModal`.

## Phase 5 - Tests and type polish

- Add route/smoke unit coverage for AppShell route constants and legacy RL
  redirect mapping.
- Replace practical `any` usage in `EditorPane` and localization helper typing.
- Remove always-on `preserveDrawingBuffer` from Canvas3D.
- Document root entrypoint convention in architecture docs/wiki.

## Phase 6 - Backlog, verification, commit, push

- Update `DESLOPPIFY.md` statuses to resolved.
- Update plan execution log.
- Run:
  - `npm run verify`
  - route/smoke test
  - strict unused TypeScript command
  - `git diff --check`
- Commit with an English Conventional Commit message and push the branch.

# Out Of Scope

- Moving root `App.tsx` / `index.tsx` under `src/`.
- Full visual redesign outside Learning Lab theme consistency.
- Deep Pyodide interrupt-buffer cancellation beyond the timeout recovery already
  implemented in the previous batch.

# Execution Log

- 2026-06-26T02:05:00+07:00 - Plan created and marked executing after user
  explicitly requested continuing until all `DESLOPPIFY.md` items are handled.
- 2026-06-26T12:17:42+07:00 - Removed remaining runtime CDN paths by moving
  Tailwind into PostCSS/Vite, serving pinned Pyodide and Monaco assets locally,
  and serving local Inter/Troika unicode fallback font assets from the Vite
  plugin.
- 2026-06-26T12:17:42+07:00 - Completed Learning Lab cleanup by making catalog
  display keys the source for domain/track text, routing shell copy through
  localization, and applying shared theme tokens across shell, lesson, and
  practice surfaces.
- 2026-06-26T12:17:42+07:00 - Extracted shared exercise modal lifecycle for
  Escape handling, close-button focus, and focus restore across shape, value,
  and convolution exercise modals.
- 2026-06-26T12:17:42+07:00 - Added route helper tests for AppShell top-level
  paths, Learning Lab domain/track path generation, and legacy RL redirect
  mapping.
- 2026-06-26T12:17:42+07:00 - Updated architecture/wiki docs for local runtime
  assets, React-free core boundaries, root entrypoint convention, and local 3D
  text font behavior.
- 2026-06-26T12:17:42+07:00 - Verification passed:
  `npm audit --audit-level=moderate`, `npm run verify`,
  `npx tsc --noEmit --noUnusedLocals --noUnusedParameters --pretty false`,
  `git diff --check`, targeted CDN/runtime grep, and Playwright smoke for
  Landing -> Learning Lab, RL domain/legacy redirect, and Workspace Visualize
  with local-only runtime requests.

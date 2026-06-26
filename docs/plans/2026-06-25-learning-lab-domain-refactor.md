---
title: Learning Lab Domain Refactor and Technical Quality Cleanup
status: done
created: 2026-06-25T23:58:21+07:00
updated: 2026-06-26T14:15:00+07:00
author: Codex
task: "Refactor Reinforcement Learning into a Learning Lab domain and resolve the project-wide technical quality (desloppify) backlog."
supersedes:
  - docs/plans/2026-06-24-learning-path-exercise-separation.md
  - docs/plans/2026-06-24-reinforcement-learning-track-ui.md
  - docs/plans/2026-06-21-learning-lab-refactor.md
---

# Goal

Make Learning Lab the single learning container. Reinforcement Learning should be a Learning Lab domain, not a sibling AppShell surface, while preserving the existing Workspace, Forward Pass demo, exercise entry points, and current RL practice behavior for MDP, Bellman/Q-table, Q-Learning, SARSA, and GridWorld.

Additionally, resolve all technical quality issues identified in the project-wide "desloppify" scan to transition the application to a robust local-first, offline-ready architecture, secure Python runtime execution, enhance UI styling coherence, and clean up dead code and types.

Success means:
- Landing and AppShell no longer present Reinforcement Learning as a standalone product surface.
- Learning Lab navigation follows `domain -> track/topic -> lesson`.
- Local-first execution: No production HTML CDN dependencies for Tailwind, Google Fonts, Monaco Editor, or Pyodide runtime.
- Pyodide execution safety: Worker runs have timeout controls and recovery.
- High accessibility: Removed mobile zoom locks and implemented Esc/focus controls on exercise modals.
- Clean compilation: Enabled `noUnusedLocals` and `noUnusedParameters` type-checking, removed dead scaffolding files.
- Verified test suite: 71/71 tests passing on `npm run verify`.

# Lineage

This plan supersedes:
- [2026-06-24-learning-path-exercise-separation](./2026-06-24-learning-path-exercise-separation.md) for active Path/Review and exercise adapter boundary.
- [2026-06-24-reinforcement-learning-track-ui](./2026-06-24-reinforcement-learning-track-ui.md) for the RL routes, path UI, and deterministic fixtures.
- [2026-06-21-learning-lab-refactor](./2026-06-21-learning-lab-refactor.md) for the original Learning Lab scaffold and AppShell boundary.

# Decisions

- **Unified Learning Lab:** Reinforcement Learning is no longer a top-level AppShell sibling surface. LandingPage and AppShell routes point to the Learning Lab with the appropriate selected domain.
- **Visual Baseline:** Adopt the light-theme default, larger cards, and Sidebar/Header rhythm from the old RL surface and apply them consistently lab-wide.
- **Local-First & Offline Usage:**
  - Build-time Tailwind compiling via Vite & PostCSS instead of browser CDN.
  - Self-host Monaco Editor assets and the Pyodide WebAssembly runtime locally.
  - Remove remote Google Fonts in favor of system-font fallbacks.
  - Serve Inter/Troika unicode font assets locally.
- **Pyodide Worker Timeout:** Terminate and recreate stuck Pyodide web workers if execution times out, clearing loading status and outputting an actionable error.
- **Strict Quality Enforcement:**
  - Enable `noUnusedLocals` and `noUnusedParameters` in `tsconfig.json`.
  - Delete empty/stale scaffold files (`answerCheck.ts`, `uiStore.ts`, `LearningDrawer.tsx`).
- **Modal Accessibility:** Extract a shared `useExerciseModalLifecycle` hook for Esc-key handler, focus capture, and focus restore across all exercise modals.

# Target Directory Tree

```text
src/components/learning/
  LearningLabView.tsx
  LearningLabHeader.tsx
  theme.ts

  shell/
    DomainCatalog.tsx
    ReviewMode.tsx
    TrackList.tsx

  lesson/
    LessonDetail.tsx
    LessonNode.tsx

  practice/
    PracticeSection.tsx
    TensorPracticeRenderer.tsx
    ReinforcementPracticeRenderer.tsx
    adapters/
      tensorPracticeAdapter.ts
      reinforcementPracticeAdapter.ts

src/core/learning/
  types.ts
  selectors.ts
  content/
    index.ts
    fundamentals.ts
    cv.ts
    nlp.ts
    reinforcementLearning.ts
    robotLearning.ts
```

# Desloppify Backlog Registry & Resolution Status

Below is the consolidated backlog from the project-wide technical quality scan and how they were resolved:

### Critical Items
- **C1 - Production HTML CDN dependencies (Resolved):** Replaced `cdn.tailwindcss.com` with PostCSS, removed remote Google Fonts and esm.sh importmaps.
- **C2 - Pyodide runtime CDN dependencies (Resolved):** Packaged `pyodide` via Vite build copy plugin so worker loads `/pyodide/pyodide.js` and WASM assets locally.
- **C3 - User Python execution timeout (Resolved):** Implemented worker execution watchdog in `WorkerService` to terminate and recover hanging threads.

### Medium Items
- **M1 - Dead code & Unused symbol checking (Resolved):** Banned unused code by enabling `noUnusedLocals` and `noUnusedParameters` in `tsconfig.json`.
- **M2 - Learning Lab domain metadata (Resolved):** Derived Lab display copy from the core learning catalog instead of separate UI lists.
- **M3 - Coherent Dark Theme (Resolved):** Standardized dark mode styles across lab cards, detail panels, and practice renderers.
- **M4 - Unused Zustand uiStore (Resolved):** Deleted `src/store/uiStore.ts`.
- **M5 - Exercise modal duplicate logic (Resolved):** Extracted `useExerciseModalLifecycle` hook for unified modal shell state.
- **M6 - Dead scaffold files (Resolved):** Deleted `answerCheck.ts` and `LearningDrawer.tsx`.
- **M7 - Input shape validation silently falls back (Resolved):** Rejected invalid shapes in `WorkerService.run()` with errors instead of silently running fallback templates.
- **M8 - Localization drift (Resolved):** Consolidated ML and RL strings under `src/lib/localization.ts` and clean up dead keys.
- **M9 - Missing Route/UI test coverage (Resolved):** Added route tests and legacy redirect validation in `src/lib/appRoutes.test.ts`.

### Nice-to-Have Items
- **N1 - Viewport zoom constraints (Resolved):** Restored standard mobile accessibility by removing `maximum-scale=1.0, user-scalable=no` from `index.html`.
- **N2 - Type looseness (Resolved):** Cleared loose `any` typing from `EditorPane` and translation maps.
- **N3 - WebGL preserveDrawingBuffer (Resolved):** Disabled default WebGL drawing-buffer preservation on `Canvas3D` to optimize normal rendering.
- **N4 - Application entrypoint paths (Resolved):** Documented root-level entrypoint conventions in the architecture wiki.

# Execution Log

- **2026-06-25T23:58:21+07:00** — Draft plan created outlining RL refactor, catalog selectors, shared renderers, and legacy routing redirections.
- **2026-06-26T00:26:00+07:00** — Plan approved. Implementation of RL domain merge begins.
- **2026-06-26T00:32:00+07:00** — Built React-free `src/core/learning/` catalog and moved domains (`fundamentals`, `cv`, `nlp`, `reinforcement-learning`, `robot-learning`) into a domain-first catalog structure.
- **2026-06-26T00:35:00+07:00** — Created unified `LearningLabView`, `LessonDetail`, and practice renderers. Deleted obsolete `src/components/reinforcement_learning/` directory.
- **2026-06-26T00:37:00+07:00** — Added legacy URL redirects mapping `/reinforcement-learning/...` into `/learning?domain=reinforcement-learning`.
- **2026-06-26T01:39:00+07:00** — Implemented Pyodide worker timeout recovery, input shape rejection, and added `WorkerService` watchdog unit tests.
- **2026-06-26T01:42:00+07:00** — Cleaned up unused symbols, enabled compiler unused-checks (`noUnusedLocals`/`noUnusedParameters`), and deleted `answerCheck.ts`, `uiStore.ts`, and `LearningDrawer.tsx`.
- **2026-06-26T12:17:42+07:00** — Resolved CDN dependencies: integrated Tailwind into PostCSS/Vite, packaged Pyodide/Monaco locally, and served local Inter/Troika unicode fonts.
- **2026-06-26T12:17:42+07:00** — Extracted `useExerciseModalLifecycle` hook. Added route helper unit tests. Completed dark mode mapping and clean up of all loose `any` typings.
- **2026-06-26T13:17:11+07:00** — Verification suite passed (71/71 tests succeeded, production build finished successfully).
- **2026-06-26T14:00:00+07:00** — Added branch constraints to `CLAUDE.md`. Updated `LearningPracticeApprovalStatus` type to include `'unapproved'`. Changed RL exercises to `'unapproved'` implemented by `'duytrannd'`. Passed verification.
- **2026-06-26T14:15:00+07:00** — Merged `DESLOPPIFY.md` and desloppify batch plans into this file and deleted the redundant tracking files.

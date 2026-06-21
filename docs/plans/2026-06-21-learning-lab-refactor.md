---
title: Learning Lab refactor scaffold
status: approved
created: 2026-06-21T00:00:00Z
updated: 2026-06-21T00:00:00Z
author: nmkhiem
task: "add a scaffold-only PR for the Landing Page and Learning Lab refactor plan"
supersedes:
  - 2026-06-21-llm-wiki-okf-plan
---

# Goal

Create a small PR scaffold for the Learning Lab refactor. This PR only adds the
approved plan document and empty directory/file structure for later work.

This PR must not implement product logic, move existing files, import the
scaffold into the running app, or change the current TorchViz-3D workspace UI.

# Lineage

Supersedes [2026-06-21-llm-wiki-okf-plan](./2026-06-21-llm-wiki-okf-plan.md).

This plan follows the mandatory workflow in `docs/WORKFLOW.md`: context first,
stored approved plan, execute, record modifications, and update docs when needed.

# Decisions

- Landing Page will become the entry point in a later PR.
- Learning Lab will be a separate full-screen view, not an overlay.
- The current TorchViz-3D UI must remain unchanged in this scaffold PR.
- The scaffold files are intentionally inert and are not imported by `App.tsx`.
- The first scaffold includes only:
  - `src/core/types.ts`
  - `src/core/answerCheck.ts`
  - future page/component placeholders under `src/components/`
  - `src/store/uiStore.ts`
- No tests are added in this PR.
- No app routing, Zustand behavior, or exercise logic is implemented in this PR.

# Target Architecture

```text
App
├── LandingPage
│   ├── [TorchViz-3D] -> TorchViz3DView
│   └── [Learning Lab] -> LearningLabView
│
├── TorchViz3DView
│   ├── existing EditorPane
│   ├── existing Canvas3D
│   ├── existing Inspector
│   └── existing BottomTabs
│
└── LearningLabView
    ├── LearningLabHeader
    ├── PathMode
    └── ReviewMode
```

# Scope

## In Scope

- Create a branch from `main`.
- Add this plan document at
  `docs/plans/2026-06-21-learning-lab-refactor.md`.
- Add empty scaffold files with placeholder exports only.
- Run `npm run verify`.
- Commit with:
  `scaffold: add plan doc + empty directory structure for Learning Lab refactor`
- Open a PR with:
  `Scaffold: Learning Lab refactor plan + directory structure`

## Out of Scope

- No logic for `answerCheck`, learning content, or component rendering.
- No movement of existing exercise files.
- No changes to `App.tsx`.
- No router.
- No real Zustand UI state.
- No tests.
- No changes under `src/components/canvas/`.
- No changes to existing TorchViz-3D workspace behavior.

# Files To Create

```text
src/
  core/
    types.ts
    answerCheck.ts

  components/
    AppShell.tsx

    landing/
      LandingPage.tsx
      ToolCard.tsx
      LearningCard.tsx

    learning/
      LearningLabView.tsx
      LearningLabHeader.tsx
      ReviewMode.tsx
      ReviewPicker.tsx
      PathMode.tsx
      PathMap.tsx
      PathNode.tsx
      LessonDetail.tsx

      shared/
        TheorySection.tsx
        PracticeSection.tsx
        HintSection.tsx

  store/
    uiStore.ts
```

# Placeholder Formats

Each `.tsx` component contains only:

```tsx
// TODO: implement in MVP X

export default function ComponentName() {
  return null;
}
```

Core placeholder files contain only:

```ts
export {};
```

The dummy store contains only:

```ts
import { create } from 'zustand';

// TODO: implement in Landing step
export const useUIStore = create(() => ({}));
```

# Acceptance Criteria

- `docs/plans/2026-06-21-learning-lab-refactor.md` exists and contains this
  full scaffold plan.
- All scaffold files exist at the exact requested paths.
- Existing tracked files are not modified.
- `App.tsx` is not changed.
- Scaffold files are not imported by the app.
- `npm run verify` passes.
- Commit message matches the requested format.
- PR description states: "No logic changes, no existing files modified."

# Execution Log

- 2026-06-21 - Plan approved by user request and scaffold execution started.
- 2026-06-21 - Added scaffold-only plan, core placeholders, page/component
  placeholders, and dummy UI store. Verified with `npm run verify`:
  typecheck passed, 51 tests passed, and production build passed.

---
title: Learning Lab refactor scaffold
status: approved
created: 2026-06-21T00:00:00Z
updated: 2026-06-21T00:00:00+07:00
author: nmkhiem
task: "add a scaffold-only PR for the Landing Page and Learning Lab refactor plan"
supersedes:
  - 2026-06-21-llm-wiki-okf-plan
---

# Goal

Create a small PR scaffold for the Learning Lab refactor. This PR adds the
approved plan document, empty directory/file structure for later work, and the
matching docs/wiki orientation requested during review.

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
- The Codex init prompt is embedded in the wiki and derived from `CLAUDE.md`;
  do not add a root `CODEX.md` file in this PR.
- The first scaffold includes only:
  - `src/core/types.ts`
  - `src/core/answerCheck.ts`
  - future page/component placeholders under `src/components/`
  - `src/store/uiStore.ts`
- No tests are added in this PR.
- No app routing, Zustand behavior, or exercise logic is implemented in this PR.
- Docs/wiki updates may describe the scaffold, but must not imply the scaffold
  is active runtime behavior.

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
- Add docs/wiki orientation for the scaffold and Codex init prompt.

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
- Existing runtime/source files are not modified.
- `App.tsx` is not changed.
- Scaffold files are not imported by the app.
- `npm run verify` passes.
- Commit message matches the requested format.
- PR description states: "No logic changes, no existing files modified."
- Docs/wiki describe the scaffold and link the embedded Codex init prompt.

# MVP 1 Addendum - Landing/AppShell

This addendum folds the follow-up Landing/AppShell MVP plan into this existing
Learning Lab refactor plan. The original scaffold work above remains completed
history. This addendum was approved in conversation on 2026-06-21.

## MVP 1 Goal

Implement the first runtime phase of the Landing Page and AppShell scaffold.
The app should open on a polished Landing Page, let users enter the existing
TorchViz-3D workspace, and show the Learning Lab option as disabled/coming soon.

Success means the current workspace behavior is preserved after entering
TorchViz-3D, while Learning Lab remains unavailable and no Learning Lab runtime
logic is introduced.

## MVP 1 Decisions

- The current root `App.tsx` is the active app entry point in this repo.
- `AppShell` becomes the runtime switcher for MVP 1.
- The existing workspace implementation in `App.tsx` will be preserved by
  extracting it to an internal `TorchVizWorkspace` component in the same file.
- `AppShell` will use local React state, not `src/store/uiStore.ts`, for this
  MVP. The flow is one-way: Landing Page -> TorchViz-3D workspace. MVP 1 does
  not add a visible Back-to-Landing control, so the workspace is not repeatedly
  mounted/unmounted during normal use.
- If a future phase adds workspace -> landing navigation, that phase must choose
  whether component-local workspace state loss is acceptable or keep the
  workspace mounted while hidden. The global `useStore` data is expected to
  survive unmounts, but component-local state such as scroll position or
  transient panel UI may not.
- The Landing Page imports only MVP 1 components: `AppShell`, `LandingPage`,
  `ToolCard`, and `LearningCard`.
- The Learning Lab card is rendered disabled with coming-soon copy and no
  navigation behavior.
- No routing library is added.
- No Learning Lab components under `src/components/learning/` are imported or
  implemented in this MVP.
- `src/store/uiStore.ts` remains a placeholder in this MVP.
- `ToolCard` and `LearningCard` use small explicit props:
  - `ToolCard`: `title`, `description`, `onOpen`, `availabilityLabel`,
    `openLabel`.
  - `LearningCard`: `title`, `description`, `statusLabel`.
- MVP 1 follow-up adds a visible Back-to-Landing control in the workspace header
  by user request. Returning to Landing may unmount workspace component-local UI
  state; global `useStore` data such as code, language, and graph state remains
  the persistence boundary for this MVP.
- Landing Page gets the same language selector behavior as the workspace header,
  backed by `useStore.language` and `useStore.setLanguage`.

## MVP 1 Phases

### Phase 0 - Store this addendum

- Add this MVP 1 addendum to the existing Learning Lab refactor plan.
- Remove the separate draft plan file so this document is the single planning
  source for the Landing/AppShell MVP.
- Wait for explicit user approval before modifying runtime/source/docs files.

### Phase 1 - Implement AppShell state

- Implement `src/components/AppShell.tsx` as a small view switcher.
- Use local React state for `landing` vs `workspace`.
- Ensure entering the workspace does not clear existing `useStore` editor/canvas
  state.
- Do not import or implement `src/store/uiStore.ts`.

### Phase 2 - Implement Landing MVP components

- Implement `src/components/landing/LandingPage.tsx`.
- Implement `ToolCard` as the active entry action for TorchViz-3D.
- Implement `LearningCard` as disabled/coming soon.
- Keep the screen usable at the repo's existing desktop minimum width.

### Phase 3 - Wire root app

- Update root `App.tsx` so the default export renders `AppShell`.
- Preserve the existing workspace UI as the view entered from the active card.
- Add a workspace header Back-to-Landing control.
- Do not change core graph, worker, canvas, editor, inspector, or exercise logic.

### Phase 3b - Landing language control

- Add a Landing Page language selector with the same language options as the
  workspace header.
- Use the existing global language state from `src/store/useStore.ts`.
- Localize Landing MVP text for English and Vietnamese.

### Phase 4 - Docs and plan log

- Update this execution log with files changed and verification results.
- Update existing docs/wiki only if they would otherwise incorrectly describe
  all Landing/AppShell scaffold files as inert after MVP 1.
- Do not create new docs pages for this MVP.

### Phase 5 - Verify

- Run `npm run verify`, which currently expands to `npm run typecheck`
  (`tsc --noEmit`), `npm test`, and `npm run build`.
- This repo currently has no lint script; do not invent one in this MVP.
- If practical, run a local dev server and inspect the Landing Page/workspace
  transition manually.

## MVP 1 Out of Scope

- Learning Lab implementation.
- Routing.
- Exercise content changes.
- Answer checking logic.
- `src/store/uiStore.ts` implementation.
- Changes to Pyodide worker, torchstub, IR, layout, Canvas3D internals, or
  existing exercise behavior.
- Mobile support beyond the app's current desktop minimum-width constraint.
- Additional desktop minimum-width work; the existing app constraint is enough
  unless the new Landing Page visibly breaks it.

# Execution Log

- 2026-06-21 - Plan approved by user request and scaffold execution started.
- 2026-06-21 - Added scaffold-only plan, core placeholders, page/component
  placeholders, and dummy UI store. Verified with `npm run verify`:
  typecheck passed, 51 tests passed, and production build passed.
- 2026-06-21 - Review expanded scope to include docs/wiki in this PR. Added
  README/architecture pointers, OKF concept page
  `wiki/concepts/learning-lab-refactor.md`, wiki index links, wiki log entry,
  and an embedded Codex init prompt derived from `CLAUDE.md`. No `CODEX.md` file
  is added.
- 2026-06-21 - Re-ran `npm run verify` after docs/wiki updates: typecheck
  passed, 51 tests passed, and production build passed.
- 2026-06-21 - Folded the Landing/AppShell MVP draft plan into this plan as
  the MVP 1 addendum and removed the separate draft plan file.
- 2026-06-21 - MVP 1 addendum approved by user request; implementation started
  on branch `feat/landing-appshell-mvp`.
- 2026-06-21 - Implemented MVP 1 runtime entry: root `App.tsx` now renders
  `AppShell`, the existing workspace is preserved as `TorchVizWorkspace`, and
  `LandingPage`, `ToolCard`, and `LearningCard` are active. Learning Lab remains
  disabled/coming soon; `src/components/learning/*`, `src/core/*`, and
  `src/store/uiStore.ts` remain inert.
- 2026-06-21 - Updated existing README/docs/wiki references that previously
  described AppShell/Landing as entirely inert.
- 2026-06-21 - Ran `npm run verify`: typecheck passed, 55 tests passed, and
  production build passed.
- 2026-06-21 - Implemented MVP 1 follow-up from user request: added a workspace
  header Back-to-Landing control, added a Landing language selector backed by
  `useStore.language`, localized Landing MVP text in English/Vietnamese, and
  kept Learning Lab disabled/coming soon.
- 2026-06-21 - Re-ran `npm run verify`: typecheck passed, 55 tests passed, and
  production build passed.

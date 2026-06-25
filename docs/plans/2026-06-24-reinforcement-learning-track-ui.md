---
title: Reinforcement Learning Surface Consolidated Plan
status: done
created: 2026-06-24T20:53:32+07:00
updated: 2026-06-25T16:31:12+07:00
author: Codex
task: "consolidate the Reinforcement Learning surface implementation, track UI, header parity, track rename, folder cleanup, and wiki split into one plan"
supersedes:
  - docs/plans/2026-06-24-learning-path-exercise-separation.md
  - docs/plans/2026-06-21-learning-lab-refactor.md
  - docs/plans/2026-06-24-reinforcement-learning-track-ui.md
  - docs/plans/2026-06-24-reinforcement-learning-header-parity.md
  - docs/plans/2026-06-24-reinforcement-learning-track-rename.md
---

# Goal

Build and document the Reinforcement Learning surface as a sibling top-level
experience, separate from the Learning Lab subsystem.

Success means:

- RL domain content and types exist in React-free core files.
- Reinforcement Learning is reachable from Landing as its own AppShell surface.
- The surface provides Path mode, a 3D Visualization placeholder, a Guide tour,
  and deterministic RL practice.
- Path mode follows the Learning Lab-style track -> focus -> lesson flow.
- Header theme and language controls match the Learning Lab treatment.
- The current track split is Reinforcement Learning plus an empty Robot
  Learning placeholder.
- User-facing naming says "Reinforcement Learning", not "RL Learning Lab".
- Active UI files live under `src/components/reinforcement_learning/` with
  concise file names.
- Reinforcement Learning documentation lives in its own wiki concept page, not
  inside `wiki/concepts/learning-lab-refactor.md`.

# Lineage

Supersedes [2026-06-24-learning-path-exercise-separation](./2026-06-24-learning-path-exercise-separation.md)
for the Learning Lab Path/Review architecture that inspired the sibling
Reinforcement Learning surface.

Supersedes [2026-06-21-learning-lab-refactor](./2026-06-21-learning-lab-refactor.md)
for the original Landing/AppShell boundary.

This consolidated plan replaces the previously separate RL/Reinforcement
Learning plan fragments:

- `2026-06-24-rl-learning-lab-foundation.md`
- `2026-06-24-rl-learning-lab-phase-2-3.md`
- `2026-06-24-reinforcement-learning-surface-separation.md`
- `2026-06-24-reinforcement-learning-folder-rename.md`
- the original short form of `2026-06-24-rl-wiki-page-split.md`

# Context Read

- `docs/WORKFLOW.md`
- `CLAUDE.md`
- `wiki/concepts/learning-lab-refactor.md`
- `wiki/concepts/reinforcement-learning.md`
- `docs/plans/2026-06-24-learning-path-exercise-separation.md`
- `src/core/types.ts`
- `src/core/learningContent.ts`
- `src/core/rlTypes.ts`
- `src/core/rlLearningContent.ts`
- `src/components/AppShell.tsx`
- `src/components/landing/LandingPage.tsx`
- `src/components/learning/*`
- `src/components/reinforcement_learning/*`
- `src/components/exercises/*`
- `src/lib/localization.ts`

# Decisions

- Keep `src/core/` React-free.
- Keep Workspace behavior unchanged.
- Keep the existing Learning Lab behavior unchanged.
- Treat Reinforcement Learning as a sibling AppShell surface, not a Learning
  Lab mode.
- Keep the user-facing name as "Reinforcement Learning".
- Keep the route/view id as `reinforcement-learning`.
- Keep active UI under `src/components/reinforcement_learning/`.
- Keep the populated track named "Reinforcement Learning".
- Keep "Robot Learning" visible as an empty placeholder track until later
  approved content exists.
- Keep the Reinforcement Learning header's theme and language controls visually
  aligned with Learning Lab.
- Use concise filenames inside that folder:
  - `View.tsx`
  - `Header.tsx`
  - `PathMode.tsx`
  - `PathNode.tsx`
  - `LessonDetail.tsx`
  - `PracticeSection.tsx`
  - `GuideTour.tsx`
- Keep `src/core/rlTypes.ts` and `src/core/rlLearningContent.ts` as
  domain-data names.
- Use deterministic RL fixtures for concepts that do not fit the tensor
  `LayoutNode` exercise registry.
- Keep practice availability gated by `approval.status === "approved"` and
  `approval.implementedBy`.
- Keep `answerCheck.ts` and `uiStore.ts` reserved stubs.
- Document Reinforcement Learning in
  `wiki/concepts/reinforcement-learning.md`; leave only a sibling-surface
  pointer in `wiki/concepts/learning-lab-refactor.md`.

# Final Architecture

```text
LandingPage
  -> Workspace
  -> Learning Lab
  -> Reinforcement Learning
       -> src/components/reinforcement_learning/View.tsx
          -> Header
          -> PathMode
          -> GuideTour
          -> Visualization 3D placeholder

src/core/rlLearningContent.ts
  -> deterministic RL practice fixtures
  -> RL practice components
```

# Implemented Phases

## Phase 1 - RL content and types

- Added `src/core/rlTypes.ts`.
- Added `src/core/rlLearningContent.ts`.
- Added four initial lessons:
  - `rl-mdp-basics`
  - `rl-bellman`
  - `rl-q-learning`
  - `rl-sarsa`
- Defined practice kinds:
  - `rl-shape`
  - `rl-value`
  - `gridworld`

## Phase 2 - RL adapter and exercises

- Added deterministic fixtures and approval helpers in
  `src/components/exercises/rlPracticeAdapter.ts`.
- Added `RLShapeExercise` for MDP component identification.
- Added `RLValueExercise` for Bellman/Q-table value practice.
- Added `GridWorldExercise` for single-step Q-Learning and SARSA updates.

## Phase 3 - Reinforcement Learning UI surface

- Added the Path UI and later replaced the top-level Review mode with a 3D
  Visualization placeholder plus inline lesson practice.
- Added a Landing CTA.
- Extended `AppShell` with the `reinforcement-learning` sibling route.
- Added English/Vietnamese localization.
- Preserved Workspace and Learning Lab behavior.

## Phase 4 - Surface separation and naming

- Renamed the old "RL Learning Lab" user-facing boundary to
  "Reinforcement Learning".
- Renamed the localization namespace from `rlLearningLab` to
  `reinforcementLearning`.
- Moved the surface out of `src/components/learning/`.
- Updated README and wiki docs so Reinforcement Learning is documented as a
  sibling surface.

## Phase 5 - Folder and file cleanup

- Renamed `src/components/reinforcement/` to
  `src/components/reinforcement_learning/`.
- Shortened files inside that folder to `View.tsx`, `Header.tsx`,
  `PathMode.tsx`, `PathNode.tsx`, `LessonDetail.tsx`, and
  `PracticeSection.tsx`.
- Updated imports and wiki path references.

## Phase 6 - Wiki split

- Added `wiki/concepts/reinforcement-learning.md`.
- Removed RL implementation details from
  `wiki/concepts/learning-lab-refactor.md`.
- Updated `wiki/concepts/index.md` and `wiki/index.md`.

## Phase 7 - Track UI parity

- Added RL role/domain metadata in `src/core/rlTypes.ts` and
  `src/core/rlLearningContent.ts`.
- Updated `src/components/reinforcement_learning/PathMode.tsx` to use a
  Learning Lab-style track -> focus -> lesson progression.
- Added English/Vietnamese track, role, and focus-area copy under
  `reinforcementLearning`.
- Preserved the existing lessons and inline practice cards.

## Phase 8 - Header parity

- Updated `src/components/reinforcement_learning/Header.tsx` so the theme
  toggle uses the same switch-style control as Learning Lab.
- Updated the language picker to use the same icon button and menu treatment as
  Learning Lab.
- Kept Path mode, Back/Landing behavior, and RL-specific copy unchanged.

## Phase 9 - Track rename

- Renamed the populated track from `RL Engineer` to `Reinforcement Learning`.
- Replaced the previous second track with `Robot Learning`.
- Removed domains and lessons from Robot Learning.
- Added an empty-track notice for Robot Learning.
- Updated `wiki/concepts/reinforcement-learning.md` with the current track
  split.

## Phase 10 - Header-owned sidebar toggle

- Move the Path sidebar open/close state from `PathMode.tsx` to `View.tsx`.
- Add a sidebar toggle button to `Header.tsx`.
- Pass `isSidebarOpen` into `PathMode.tsx`.
- Remove the inline sidebar toggle button from `PathMode.tsx`.
- Use `overflow-x-hidden` and a closed-sidebar `gap-0` grid to reduce the right
  black blank caused by horizontal overflow.

## Phase 11 - RL header logo

- Use `docs/assets/Future-HMI ip.gif` as the TorchViz3D Reinforcement Learning
  logo in the RL page header only.
- Import the GIF through the React header so Vite bundles the asset.
- Add a minimal GIF module declaration if TypeScript needs it.

## Phase 12 - Guide tour

- Add a Guide tour for the Reinforcement Learning page.
- Keep the page in normal RL Path / 3D Visualization modes.
- Add a header button that opens the tour overlay.
- Match the Workspace onboarding tour behavior and visual treatment: cutout
  dimming panels, accent spotlight ring, glass-panel card, Back/Next/Done/Skip,
  and progress dots.
- Spotlight the RL logo/header, sidebar, mode switch, path content, and lesson
  area with guided steps.
- Keep Review behavior out of the top-level RL mode list.

## Phase 13 - RL page error repair

- Restore `src/components/reinforcement_learning/PathMode.tsx` after it was
  accidentally overwritten with `View.tsx` content.
- Keep `PathMode.tsx` responsible for the track -> focus -> lesson flow.
- Reconnect `GuideTour.tsx` from `View.tsx` so the header tour button opens the
  Workspace-style RL guide tour.

## Phase 14 - Route, tour, and stale component cleanup

- Switch `AppShell` from `BrowserRouter` to `HashRouter` so static-host refreshes
  for Workspace, Learning Lab, and Reinforcement Learning routes resolve through
  `index.html`.
- Add the missing RL guide tour targets for the sidebar and path content.
- Remove stale unused `PathMap.tsx`, `ReviewMode.tsx`, and `ReviewPicker.tsx`
  after confirming the current RL surface no longer exposes top-level Review
  mode.
- Update wiki docs and this plan to describe the current Path + 3D placeholder
  state.

# Out of Scope

- No Workspace behavior changes.
- No changes to the existing Learning Lab lesson flow.
- No persistence, progress tracking, or workspace handoff.
- No policy-gradient lessons.
- No full RL simulator or multi-episode training loop.
- No Robot Learning lesson content yet.
- No `answerCheck.ts` or `uiStore.ts` implementation.

# Acceptance Criteria

- `src/core/rlTypes.ts` and `src/core/rlLearningContent.ts` exist.
- Reinforcement Learning is reachable from Landing and can return to Landing.
- Existing Workspace and Learning Lab CTAs remain functional.
- Reinforcement Learning has Path mode, a Guide tour, and a 3D Visualization
  placeholder.
- Reinforcement Learning Path mode starts with track selection.
- Users can select a focus area before seeing the lesson list for populated
  tracks.
- The first track is named "Reinforcement Learning".
- The second track is named "Robot Learning" and has no domain/lesson content.
- The Reinforcement Learning theme and language controls match Learning Lab.
- The Reinforcement Learning sidebar toggle lives in the header and collapses
  the Path sidebar without leaving horizontal blank space.
- The Reinforcement Learning header uses `docs/assets/Future-HMI ip.gif` as its
  header-only logo.
- Reinforcement Learning has a Workspace-style Guide tour that introduces the
  page without becoming a separate page mode.
- Reinforcement Learning has a Guide tour that introduces the page without
  becoming a separate page mode.
- Static-host refreshes use hash routes rather than server-side SPA fallback.
- The four initial RL lessons render with localized title/theory/practice copy.
- Approved RL practice cards render the relevant exercise surface.
- Active Reinforcement Learning UI files live under
  `src/components/reinforcement_learning/`.
- File names inside that folder do not use the `Reinforcement...` prefix.
- User-facing copy says "Reinforcement Learning", not "RL Learning Lab".
- `wiki/concepts/reinforcement-learning.md` exists.
- `wiki/concepts/learning-lab-refactor.md` no longer contains the
  Reinforcement Learning component map or RL-specific exercise details.
- Wiki indexes include the new Reinforcement Learning page.
- Superseded fragment plans are removed after consolidation.

# Verification

- 2026-06-24T20:58:08+07:00 - `npm run typecheck` passed for the initial
  React-free RL content/types foundation.
- 2026-06-24T21:08:15+07:00 - `npm run typecheck` passed as the first step of
  `npm run verify`.
- 2026-06-24T21:08:15+07:00 - `npm run verify` did not complete because
  `npm test` failed before executing assertions with Node
  `ERR_UNKNOWN_FILE_EXTENSION` for `.ts` test files. This was treated as the
  existing test-runner loader/configuration issue, not a TypeScript compile
  error from the RL change.
- 2026-06-24T21:08:15+07:00 - `npm run build` passed. Vite reported the
  existing large chunk warning for the Three.js bundle.
- 2026-06-24T21:08:15+07:00 - `git diff --check` passed.
- 2026-06-24T22:01:42+07:00 - `npm run typecheck` passed for the
  Reinforcement Learning naming/separation refactor.
- 2026-06-24T22:01:42+07:00 - `npm run build` passed. Vite reported the
  existing large chunk warning for the Three.js bundle.
- 2026-06-24T22:01:42+07:00 - `git diff --check` passed.
- 2026-06-24T22:08:10+07:00 - `npm run typecheck` passed for the
  `reinforcement_learning` folder rename.
- 2026-06-24T22:08:10+07:00 - `npm run build` passed. Vite reported the
  existing large chunk warning for the Three.js bundle.
- 2026-06-24T22:08:10+07:00 - `git diff --check` passed.
- 2026-06-24T22:19:27+07:00 - Confirmed
  `wiki/concepts/reinforcement-learning.md` exists.
- 2026-06-24T22:19:27+07:00 - `rg` found no RL implementation paths or
  RL-specific exercise terms left in `wiki/concepts/learning-lab-refactor.md`.
- 2026-06-24T22:19:27+07:00 - Confirmed `reinforcement-learning` links exist in
  `wiki/concepts/index.md`, `wiki/index.md`,
  `wiki/concepts/learning-lab-refactor.md`, and the new concept page.
- 2026-06-24T22:19:27+07:00 - `git diff --check` passed.
- 2026-06-24T22:40:54+07:00 - `npm run typecheck` passed for the
  Learning Lab-style track UI update.
- 2026-06-24T22:40:54+07:00 - `npm run build` passed. Vite reported the
  existing large chunk warning for the Three.js bundle.
- 2026-06-24T22:40:54+07:00 - `git diff --check` passed.
- 2026-06-24T23:06:10+07:00 - `npm run typecheck` passed for header parity.
- 2026-06-24T23:06:10+07:00 - `npm run build` passed. Vite reported the
  existing large chunk warning for the Three.js bundle.
- 2026-06-24T23:06:10+07:00 - `git diff --check` passed.
- 2026-06-24T23:24:10+07:00 - `rg -n "rlEngineer|rlResearcher|RL Engineer|RL Researcher|rl-engineer|rl-researcher" src wiki docs README.md`
  only found historical mentions in the track rename plan before final
  consolidation.
- 2026-06-24T23:24:10+07:00 - `npm run typecheck` passed for the track rename.
- 2026-06-24T23:24:10+07:00 - `npm run build` passed. Vite reported the
  existing large chunk warning for the Three.js bundle.
- 2026-06-24T23:24:10+07:00 - `git diff --check` passed.
- 2026-06-24T23:38:20+07:00 - Merged the track UI, header parity, and track
  rename follow-up plans into this canonical plan.
- 2026-06-24T23:41:12+07:00 - `git diff --check` passed after the plan
  consolidation.
- 2026-06-24T23:41:12+07:00 - Confirmed the redundant follow-up plan files no
  longer exist on disk.
- 2026-06-24T23:41:12+07:00 - Confirmed this canonical plan includes the
  track UI parity, header parity, track rename, and Robot Learning placeholder
  sections.
- 2026-06-25T00:23:18+07:00 - `npm run typecheck` passed for the
  header-owned sidebar toggle fix.
- 2026-06-25T00:23:18+07:00 - `npm run build` passed. Vite reported the
  existing large chunk warning for the Three.js bundle.
- 2026-06-25T00:23:18+07:00 - `git diff --check` passed.
- 2026-06-25T14:52:38+07:00 - `npm run typecheck` passed for the RL header GIF
  logo change.
- 2026-06-25T14:52:38+07:00 - `npm run build` passed and bundled
  `Future-HMI ip.gif` as a production asset. Vite reported the existing large
  chunk warning for the Three.js bundle, and the GIF asset is about 5.5 MB.
- 2026-06-25T14:52:38+07:00 - `git diff --check` passed.
- 2026-06-25T16:05:38+07:00 - `npm run typecheck` passed after aligning the
  RL Guide tour with the Workspace onboarding tour behavior and entry point.
- 2026-06-25T16:05:38+07:00 - `npm run build` passed. Vite reported the
  existing large chunk warning for the Three.js bundle, and the GIF asset is
  still about 5.5 MB.
- 2026-06-25T16:05:38+07:00 - `git diff --check` passed.
- 2026-06-25T16:31:12+07:00 - `npm run typecheck` passed after restoring
  `PathMode.tsx` and reconnecting the RL guide tour from `View.tsx`.
- 2026-06-25T16:31:12+07:00 - `npm run build` passed. Vite reported the
  existing large chunk warning for the Three.js bundle, and the GIF asset is
  still about 5.5 MB.
- 2026-06-25T16:31:12+07:00 - `git diff --check` passed.
- 2026-06-25T23:08:42+07:00 - `rg` confirmed no active
  `PathMap`/`ReviewMode`/`ReviewPicker` references remain under the
  Reinforcement Learning components.
- 2026-06-25T23:08:42+07:00 - `npm run typecheck` passed for the route, tour
  target, and stale component cleanup.
- 2026-06-25T23:08:42+07:00 - `npm run build` passed. Vite still reports the
  existing large chunk warning and the RL GIF asset remains about 5.5 MB.
- 2026-06-25T23:08:42+07:00 - `git diff --check` passed.

# Execution Log

- 2026-06-24T20:53:32+07:00 - Created the initial RL foundation plan after
  reading the mandatory workflow, architecture briefing, active Learning Lab
  docs, existing learning content, exercise adapter, exercise registry,
  AppShell, Landing Page, and Learning Lab components.
- 2026-06-24T20:57:09+07:00 - User approved the RL foundation work in chat with
  "approve"; status moved to executing.
- 2026-06-24T20:58:08+07:00 - Added React-free RL learning-domain types in
  `src/core/rlTypes.ts` and static RL lesson/practice metadata in
  `src/core/rlLearningContent.ts`.
- 2026-06-24T21:00:08+07:00 - Created the Phase 2/3 plan for RL adapter,
  exercises, and UI.
- 2026-06-24T21:00:59+07:00 - User approved the Phase 2/3 plan in chat with
  "approve"; status moved to executing.
- 2026-06-24T21:08:15+07:00 - Implemented deterministic RL practice fixtures,
  MDP/Bellman/GridWorld exercise surfaces, Path/Review UI, Landing CTA,
  AppShell route, and localization.
- 2026-06-24T21:56:43+07:00 - Created the Reinforcement Learning surface
  separation plan after the user requested splitting the RL surface from
  Learning Lab naming.
- 2026-06-24T21:57:49+07:00 - User approved the separation plan in chat with
  "approved"; status moved to executing.
- 2026-06-24T22:01:42+07:00 - Renamed the old RL Learning Lab boundary to
  Reinforcement Learning, moved the UI surface out of
  `src/components/learning/`, updated AppShell/Landing/localization, and
  updated README/wiki docs.
- 2026-06-24T22:03:32+07:00 - Created the folder/file rename plan after user
  requested `src/components/reinforcement_learning` and shorter filenames.
- 2026-06-24T22:05:40+07:00 - User approved the folder/file rename plan in chat
  with "approved"; status moved to executing.
- 2026-06-24T22:08:10+07:00 - Renamed the surface folder to
  `src/components/reinforcement_learning/`, shortened file names, and updated
  imports/wiki references.
- 2026-06-24T22:17:46+07:00 - Created the wiki split plan from the active goal
  to move Reinforcement Learning content out of
  `wiki/concepts/learning-lab-refactor.md`.
- 2026-06-24T22:19:27+07:00 - Added
  `wiki/concepts/reinforcement-learning.md`, trimmed RL implementation details
  from `wiki/concepts/learning-lab-refactor.md`, and updated wiki indexes.
- 2026-06-24T22:25:57+07:00 - Consolidated the five RL/Reinforcement Learning
  plan fragments into this single plan by user request.
- 2026-06-24T22:32:28+07:00 - Created the track UI plan after the user
  requested making the Reinforcement Learning page show a learning track like
  Learning Lab.
- 2026-06-24T22:37:47+07:00 - User approved the track UI plan in chat with
  "approved"; status moved to executing.
- 2026-06-24T22:40:54+07:00 - Added RL role/domain metadata, localized track
  copy, and updated `src/components/reinforcement_learning/PathMode.tsx` to use
  a track -> focus -> lesson flow.
- 2026-06-24T22:57:36+07:00 - Created the header parity plan after comparing
  `src/components/learning/LearningLabHeader.tsx` with
  `src/components/reinforcement_learning/Header.tsx`.
- 2026-06-24T22:59:33+07:00 - User approved the header parity plan in chat with
  "approved"; status moved to executing.
- 2026-06-24T23:03:20+07:00 - Updated
  `src/components/reinforcement_learning/Header.tsx` so the theme toggle and
  language picker match the Learning Lab header controls.
- 2026-06-24T23:12:00+07:00 - Created the track rename plan after locating
  track labels in `src/lib/localization.ts` and track data in
  `src/core/rlLearningContent.ts`.
- 2026-06-24T23:17:03+07:00 - User approved the track rename plan in chat with
  "approved"; status moved to executing.
- 2026-06-24T23:21:40+07:00 - Renamed the populated track to Reinforcement
  Learning, replaced the previous second track with an empty Robot Learning
  placeholder, and added an empty-track message.
- 2026-06-24T23:22:25+07:00 - Updated
  `wiki/concepts/reinforcement-learning.md` with the current track split.
- 2026-06-24T23:38:20+07:00 - Merged
  `2026-06-24-reinforcement-learning-track-ui.md`,
  `2026-06-24-reinforcement-learning-header-parity.md`, and
  `2026-06-24-reinforcement-learning-track-rename.md` into this canonical plan.
- 2026-06-24T23:41:12+07:00 - Removed the three redundant follow-up plan files
  and the temporary merge plan so this file remains the single canonical
  Reinforcement Learning plan.
- 2026-06-25T00:18:22+07:00 - Added Phase 10 after the user provided
  instructions to move the Path sidebar toggle from `PathMode.tsx` into the
  Reinforcement Learning header and address right-side horizontal overflow.
- 2026-06-25T00:23:18+07:00 - Moved sidebar state to
  `src/components/reinforcement_learning/View.tsx`, wired the header toggle,
  passed `isSidebarOpen` to `PathMode.tsx`, removed the inline PathMode toggle,
  and added horizontal overflow guards.
- 2026-06-25T14:52:38+07:00 - Imported `docs/assets/Future-HMI ip.gif` into
  `src/components/reinforcement_learning/Header.tsx`, rendered it in the RL
  header brand area, and added `src/assets.d.ts` for GIF imports.
- 2026-06-25T16:05:38+07:00 - Added the RL Guide tour as an overlay rather than
  a page mode, then tightened `src/components/reinforcement_learning/GuideTour.tsx`
  to follow the Workspace onboarding tour mechanics, including `ResizeObserver`,
  cutout panels, spotlight ring, glass panel, restricted progress dots, and an
  info-style header tour button.
- 2026-06-25T16:31:12+07:00 - Repaired the RL page error by restoring
  `src/components/reinforcement_learning/PathMode.tsx` after it contained
  accidental `View.tsx` content, and reconnected `GuideTour.tsx` from
  `View.tsx` so the header tour button opens the tour.
- 2026-06-25T23:08:42+07:00 - Switched AppShell to hash routing, added missing
  RL tour targets, removed stale `PathMap.tsx`, `ReviewMode.tsx`, and
  `ReviewPicker.tsx`, and updated wiki/plan docs to reflect Path + 3D
  placeholder behavior.

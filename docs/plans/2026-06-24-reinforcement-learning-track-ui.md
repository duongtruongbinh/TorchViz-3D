---
title: Reinforcement Learning Surface Plan
status: done
created: 2026-06-24T20:53:32+07:00
updated: 2026-06-25T23:31:00+07:00
author: Codex
task: "Build, refine, and document the Reinforcement Learning sibling surface."
supersedes:
  - docs/plans/2026-06-24-learning-path-exercise-separation.md
  - docs/plans/2026-06-21-learning-lab-refactor.md
---

# Goal

Build Reinforcement Learning as a sibling top-level experience, separate from
Workspace and Learning Lab, with a guided Path flow, Guide tour, deterministic
practice cards, and a 3D Visualization placeholder.

# Lineage

Supersedes [2026-06-24-learning-path-exercise-separation](./2026-06-24-learning-path-exercise-separation.md)
for the Learning Lab Path/Review patterns that informed this surface.

Supersedes [2026-06-21-learning-lab-refactor](./2026-06-21-learning-lab-refactor.md)
for the Landing/AppShell boundary.

This file is the canonical merged record for the Reinforcement Learning work.
It absorbs the earlier RL surface fragments plus the route/tour cleanup and GIF
asset URL cleanup follow-ups.

# Decisions

- Keep Reinforcement Learning as an AppShell sibling route named
  `reinforcement-learning`, not a Learning Lab mode.
- Keep `src/core/rlTypes.ts` and `src/core/rlLearningContent.ts` React-free.
- Keep active UI under `src/components/reinforcement_learning/` with concise
  file names.
- Keep the current track split as populated "Reinforcement Learning" plus empty
  "Robot Learning" placeholder.
- Keep practice availability gated by approved metadata and use deterministic
  RL fixtures for non-tensor exercises.
- Use `HashRouter` for static-host-friendly routes.
- Use `docs/assets/Future-HMI ip.gif` as the RL header logo, resolved with
  `new URL(..., import.meta.url).href` so no one-off `src/assets.d.ts` file is
  needed.

# Current Architecture

```text
LandingPage
  -> Workspace
  -> Learning Lab
  -> Reinforcement Learning
       -> View
          -> Header
          -> PathMode
             -> LessonDetail
             -> PracticeSection
          -> GuideTour
          -> 3D Visualization placeholder

src/core/rlLearningContent.ts
  -> role/domain/lesson metadata
  -> approved practice refs

src/components/exercises/rlPracticeAdapter.ts
  -> deterministic RL fixtures
  -> approval helpers
```

# Implemented Scope

- Added RL domain types, static content, role/domain metadata, four initial
  lessons, and localized English/Vietnamese copy.
- Added MDP, Bellman/Q-table, and GridWorld practice components backed by
  deterministic fixtures.
- Added the Reinforcement Learning route, Landing CTA, header, Path flow, inline
  practice, Guide tour, and 3D Visualization placeholder.
- Matched Learning Lab header treatment for theme/language controls.
- Moved the sidebar toggle into the header and fixed horizontal overflow in the
  collapsed sidebar state.
- Renamed and cleaned the surface so user-facing copy says "Reinforcement
  Learning"; Robot Learning remains an empty placeholder.
- Removed stale top-level Review components after the surface moved to inline
  practice plus a 3D placeholder.
- Documented the surface in `wiki/concepts/reinforcement-learning.md` and kept
  Learning Lab docs scoped to Learning Lab.

# Follow-Up Cleanups

- 2026-06-25 route/tour cleanup: switched `AppShell` to `HashRouter`, added
  missing RL guide-tour targets, deleted stale `PathMap.tsx`, `ReviewMode.tsx`,
  and `ReviewPicker.tsx`, and synced the RL wiki/current-plan docs.
- 2026-06-25 GIF URL cleanup: changed the two direct GIF imports to
  `new URL(..., import.meta.url).href` and deleted `src/assets.d.ts`.

# Out of Scope

- Workspace behavior changes.
- Existing Learning Lab lesson-flow changes.
- Progress persistence, workspace handoff, full RL simulation, policy-gradient
  lessons, or Robot Learning content.
- Implementing the reserved `answerCheck.ts` or `uiStore.ts` stubs.
- Compressing or replacing the large RL GIF asset.

# Verification

- Repeated `npm run typecheck` and `npm run build` checks passed throughout the
  RL implementation and cleanup phases.
- `git diff --check` passed for the implementation and docs cleanup phases.
- `npm run verify` was attempted early in the RL work but stopped at the
  existing Node `.ts` test loader/configuration issue before assertions ran.
- Later route/tour and GIF URL cleanups passed `npm run typecheck` and
  `npm run build`; Vite still reports the known large chunk warning and bundles
  the RL GIF at about 5.5 MB.

# Execution Log

- 2026-06-24 - Built the RL foundation, deterministic practice adapter,
  MDP/Bellman/GridWorld exercises, AppShell route, Landing CTA, localization,
  and docs.
- 2026-06-24 - Split the surface from Learning Lab naming, moved active UI into
  `src/components/reinforcement_learning/`, shortened file names, and added the
  RL wiki concept page.
- 2026-06-24 - Added Learning Lab-style track -> focus -> lesson flow, header
  parity, the Reinforcement Learning/Robot Learning track split, and the
  header-owned sidebar toggle.
- 2026-06-25 - Added the RL GIF header logo, Guide tour overlay, Workspace-style
  tour mechanics, and repaired a temporary `PathMode.tsx` overwrite issue.
- 2026-06-25 - Switched to hash routing, restored missing tour targets, removed
  stale Review/Path helper components, and updated docs for Path + 3D
  placeholder behavior.
- 2026-06-25 - Replaced direct GIF imports with Vite asset URL expressions and
  removed the one-off GIF declaration file.
- 2026-06-25 - Merged the route/tour and GIF asset cleanup follow-up plans back
  into this concise canonical plan.

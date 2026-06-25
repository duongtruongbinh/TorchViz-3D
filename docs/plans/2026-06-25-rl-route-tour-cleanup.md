---
title: Reinforcement Learning Route, Tour, and Cleanup Fixes
status: done
created: 2026-06-25T23:02:03+07:00
updated: 2026-06-25T23:08:42+07:00
author: Codex
task: "Fix RL guide tour targets, routing static-host risk, stale components, and docs/plan drift."
supersedes:
  - docs/plans/2026-06-24-reinforcement-learning-track-ui.md
---

# Goal

Resolve the review findings the user selected:

- Make the Reinforcement Learning guide tour spotlight real DOM targets.
- Remove the static-host refresh risk introduced by `BrowserRouter`.
- Remove stale unused RL components if Review mode is not being restored.
- Sync the docs/plan record with the implemented Path + 3D placeholder surface.

# Lineage

Supersedes [2026-06-24-reinforcement-learning-track-ui](./2026-06-24-reinforcement-learning-track-ui.md)
for the current Reinforcement Learning surface implementation.

# Decisions

- Use `HashRouter` for the current static-friendly app shell unless a deployment
  fallback is explicitly added later.
- Add the missing `data-tour` attributes directly to the existing RL sidebar and
  path content containers.
- Remove `PathMap.tsx`, `ReviewMode.tsx`, and `ReviewPicker.tsx` from
  `src/components/reinforcement_learning/` because the current surface no
  longer exposes top-level Review mode.
- Update the existing RL wiki concept and the consolidated plan execution log
  instead of creating new docs pages.

# Phases

## Phase 1 - Tour and routing fixes

- Change `AppShell` from `BrowserRouter` to `HashRouter`.
- Add `data-tour="rl-sidebar"` to the RL sidebar.
- Add `data-tour="rl-path-content"` to the active RL path content area.

## Phase 2 - Remove stale components

- Delete unused `PathMap.tsx`, `ReviewMode.tsx`, and `ReviewPicker.tsx`.
- Run `rg` to confirm there are no active imports or references left.

## Phase 3 - Documentation sync

- Update `wiki/concepts/reinforcement-learning.md` to describe the current Path
  flow and 3D placeholder, not a top-level Review mode.
- Append execution-log notes to
  `docs/plans/2026-06-24-reinforcement-learning-track-ui.md`.
- Mark this plan done after verification.

# Out of scope

- Compressing or replacing the large RL GIF.
- Localizing remaining hard-coded RL UI text.
- Reintroducing Review mode.
- Changing Workspace or Learning Lab behavior beyond hash-based routes.

# Execution log

- 2026-06-25T23:02:03+07:00 - Plan created for user-selected review fixes.
- 2026-06-25T23:05:50+07:00 - User approved the plan; execution started.
- 2026-06-25T23:08:42+07:00 - Switched `AppShell` to `HashRouter`, added
  `rl-sidebar` and `rl-path-content` tour targets, removed stale RL
  Path/Review helper components, and updated the RL wiki/canonical plan docs.
- 2026-06-25T23:08:42+07:00 - Verification passed: `npm run typecheck`,
  `npm run build`, and `git diff --check`. Build still reports the existing
  large chunk warning and the 5.5 MB RL GIF asset.

---
title: Sidebar slide and fade animation
status: done
created: 2026-08-16T20:38:33+07:00
updated: 2026-08-16T21:54:29+07:00
author: Codex
task: "Add synchronized slide-in/slide-out and subtle fade animation to the Learning Lab sidebar."
supersedes:
  - docs/plans/2026-08-16-sidebar-control-visual-regressions.md
---

# Goal

Animate the mounted Learning Lab drawer from the left with a subtle opacity
transition on open and close, while preserving the compact closed rail.

# Lineage

Supersedes [2026-07-12-learning-lab-ui-ux-polish](./2026-07-12-learning-lab-ui-ux-polish.md).

# Decisions (locked)

- Limit runtime changes to `src/components/learning/LearningLabView.tsx`.
- Use the existing `isSidebarRendered` presence state and
  `isSidebarVisible` entry/exit state. The drawer shell will transition only
  while mounted as a drawer, so the desktop closed rail does not animate out
  before the requested entry animation begins.
- Animate `transform` and `opacity` for 300 ms with the existing cubic-bezier
  easing. The backdrop and drawer content already use the same duration.
- Restore the currently local `collapseTimer` value from `0` to `300` ms so
  the drawer remains mounted for its exit animation. This is required for the
  requested behavior.
- Preserve toggle behavior, control visual states, layout widths, and reduced
  motion behavior.

# Phases

## Phase 0 — Approval checkpoint

- Store this plan and wait for explicit requester approval.

## Phase 1 — Animate drawer shell

- Move the shell transition contract into its mounted-drawer branch.
- Drive its `translate-x` and `opacity` classes from `isSidebarVisible`.

## Phase 2 — Synchronize unmounting

- Keep the 300 ms render-presence timeout equal to the exit transition.

## Phase 3 — Verify

- Run `npm.cmd run typecheck`, `npm.cmd run build`, and `git diff --check`.
- Record actual modifications and any visual-test limitation in this plan.

# Out of scope

- Sidebar state/toggle redesign, lesson rail, routes, theme redesign,
  dependencies, commits, and pushes.

# Execution log

- 2026-08-16T20:38:33+07:00 — Read the active sidebar state/transition code.
  Observed a local `collapseTimer` value of `0` ms, which prevents an exit
  animation. Draft stored; runtime files are unchanged pending approval.
- 2026-08-16T21:15:22+07:00 — Requester said "continue"; treating the stored
  plan as approved and moving into execution.
- 2026-08-16T21:17:23+07:00 — Implemented the sidebar shell slide/fade by
  moving the transition onto the mounted drawer branch, driving transform and
  opacity from `isSidebarVisible`, and restoring the close render-presence
  timeout to 300 ms. Verified with `git diff --check`, `npm.cmd run
  typecheck`, and `npm.cmd run build`.
- 2026-08-16T21:22:22+07:00 — Requester reported the expected animation was
  still not visible. Reopening execution to make the drawer enter/exit phase
  more explicit and less dependent on React reusing the compact rail DOM node.
- 2026-08-16T21:24:36+07:00 — Added distinct keys for the compact rail and
  mounted drawer so React does not morph the rail DOM node into the drawer
  during the same visual phase. Replaced the drawer shell transition with
  `transition-all` plus `transform-gpu` for a stable dev/build CSS path.
  Re-verified with `git diff --check`, `npm.cmd run typecheck`, and
  `npm.cmd run build`.
- 2026-08-16T21:33:06+07:00 — Requester confirmed changing the duration only
  delayed the logo/rail timing and the sidebar shell still did not visibly
  animate. Reopening execution to move the drawer shell transform/opacity to
  explicit inline styles and force a real painted hidden frame before enter.
- 2026-08-16T21:35:06+07:00 — Added shared animation constants, replaced the
  double `requestAnimationFrame` enter trigger with a short timer so the hidden
  drawer state paints first, and moved drawer shell `transform`/`opacity` plus
  transition timing to inline styles on the `aside`. Re-verified with `git diff
  --check`, `npm.cmd run typecheck`, and `npm.cmd run build`.
- 2026-08-16T21:45:11+07:00 — Requester asked for the compact logo/open button
  to be available immediately while the sidebar close animation still runs.
  Reopening execution to render a temporary compact control during drawer exit.
- 2026-08-16T21:54:29+07:00 — Added the temporary compact logo/open button
  during drawer exit so the logo appears immediately while the sidebar keeps
  its close animation. Verified with `git diff --check`, `npm.cmd run
  typecheck`, and `npm.cmd run build`.
- 2026-08-16 — Absorbed earlier sidebar sub-plans:
  - `2026-08-16-sidebar-content-toggle.md`: Added sidebar content toggle and synchronized closing animation.
  - `2026-08-16-sidebar-control-visual-regressions.md`: Fixed sidebar control button alignment and visual regressions.


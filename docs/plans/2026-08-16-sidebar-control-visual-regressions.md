---
title: Sidebar control visual regression fixes
status: done
created: 2026-08-16T18:19:29+07:00
updated: 2026-08-16T18:22:26+07:00
author: Codex
task: "Fix the opened sidebar control's overlapping logo/icon and retain its logo after mouse-closing the sidebar."
supersedes:
  - docs/plans/2026-08-16-sidebar-content-toggle.md
---

# Goal

Make the sidebar brand control show exactly one visual affordance at a time and
ensure the closed-sidebar logo remains visible after using that control to close
the drawer with a mouse.

# Lineage

Supersedes [2026-08-16-sidebar-content-toggle](./2026-08-16-sidebar-content-toggle.md),
which added the close control and exposed these two visual-state regressions.

# Decisions (locked)

- Limit the runtime change to the two logo image class lists in
  `src/components/learning/LearningLabView.tsx`.
- In the opened control, hide the logo fully on hover and keyboard-visible
  focus before showing the close icon.
- In the closed control, use `focus-visible`, not `focus-within`, to hide the
  logo. Mouse focus retained across React's same-element reconciliation must
  not be treated as the keyboard affordance state.
- Preserve the existing hover and keyboard-visible open affordance, transition
  duration, sidebar state machine, and animation behavior.

# Phases

## Phase 0 — Approval checkpoint

- Store this plan and wait for explicit requester approval.

## Phase 1 — Correct visual state classes

- Align the opened logo's opacity classes with the already-rendered close icon.
- Narrow the closed logo focus selector to `focus-visible`.

## Phase 2 — Verify

- Run `npm.cmd run typecheck` and `npm.cmd run build`.
- Check the final diff and record the exact outcome in this plan.

# Out of scope

- Sidebar toggle state, exit transition behavior, lesson rail, navigation
  routes, theme redesign, dependencies, commits, and pushes.

# Execution log

- 2026-08-16T18:19:29+07:00 — Read the current sidebar implementation and
  preceding plan. Draft stored; runtime files are unchanged pending approval.
- 2026-08-16T18:21:00+07:00 — Requester explicitly approved the plan. Status
  advanced through `approved` to `executing`; implementation started.
- 2026-08-16T18:22:26+07:00 — Added matching hover/focus-visible opacity
  behavior to the opened control's logo, then narrowed the closed control from
  `focus-within` to `focus-visible` so retained mouse focus cannot hide it.
  `npm.cmd run typecheck` and `npm.cmd run build` passed. Plan completed; no
  commit or push was made.

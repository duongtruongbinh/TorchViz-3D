---
title: Sidebar content toggle and synchronized closing animation
status: done
created: 2026-08-16T17:42:39+07:00
updated: 2026-08-16T18:08:24+07:00
author: Codex
task: "Make the Learning Lab sidebar control toggle open/closed and synchronize its outside-dismiss closing animation."
supersedes:
  - docs/plans/2026-07-12-learning-lab-ui-ux-polish.md
---

# Goal

Make the Learning Lab domain sidebar behave as one toggle: activating its
navigation control opens a closed drawer and closes an open drawer. When the
backdrop dismisses the drawer, the sidebar shell, its content, and the backdrop
must begin their 300 ms exit together.

# Lineage

Supersedes [2026-07-12-learning-lab-ui-ux-polish](./2026-07-12-learning-lab-ui-ux-polish.md),
which introduced the responsive drawer and its backdrop/Escape dismissal.

# Decisions (locked)

- Limit the runtime change to `src/components/learning/LearningLabView.tsx`.
- Use one functional toggle callback for navigation controls so a fast repeated
  click cannot rely on a stale sidebar state.
- Keep the existing 300 ms duration and reduced-motion contract. During exit,
  retain the mounted drawer only long enough to animate it; use one shared
  visibility condition for its backdrop and content while the shell translates
  out as the open state changes.
- Reuse the drawer's existing brand/control position for a labelled close
  control while the opened drawer covers the compact header control.
- Record execution and verification in this plan; no new long-lived docs page
  is warranted for this focused behavior correction.

# Phases

## Phase 0 — Approval checkpoint

- Store this plan and wait for explicit requester approval.

## Phase 1 — Correct toggle behavior

- Add one functional `isSidebarOpen` toggle callback in `LearningLabView`.
- Route the compact navigation action through it and expose the same action in
  the opened sidebar control.

## Phase 2 — Synchronize the exit transition

- Keep `isSidebarRendered` as the animation-presence flag.
- Make the mounted sidebar shell translate out as soon as
  `isSidebarExpanded` becomes false, in step with the inner content and
  backdrop fade.

## Phase 3 — Verify

- Run `npm run verify`.
- Manually check compact-width open, second-activation close, backdrop close,
  Escape close, and reduced-motion behavior in the local app.
- Append actual modifications and results below.

# Out of scope

- Lesson rail drawer behavior, routes, catalog content, theme redesign, and
  unrelated Learning Lab shell changes.
- New dependencies, branch creation, commits, and pushes.

# Execution log

- 2026-08-16T17:42:39+07:00 — Read the required workflow, architecture
  orientation, required Learning Lab plans and wiki, and the complete
  `LearningLabView`/`LearningLabHeader` implementation. Draft plan stored;
  runtime files are unchanged pending approval.
- 2026-08-16T17:45:00+07:00 — Requester explicitly approved the plan. Status
  advanced through `approved` to `executing`; implementation started.
- 2026-08-16T18:08:24+07:00 — Added a functional sidebar toggle, passed it to
  the compact navigation control, and made the opened sidebar brand position a
  labelled close control. Added a shared visible condition so its content and
  backdrop start their exit with the shell transform. `git diff --check`,
  `npm.cmd run typecheck`, and `npm.cmd run build` passed. `npm.cmd run verify`
  reached 86 passing tests but stopped at four pre-existing
  `src/lib/torchstubCore.test.ts` failures where the Python runner returned
  `null` instead of exit code `0`; the production build was then run separately
  and passed. Manual browser testing could not run because no local browser
  session was available. Plan completed; no commit or push was made.

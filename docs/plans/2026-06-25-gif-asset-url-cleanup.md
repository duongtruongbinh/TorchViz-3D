---
title: GIF Asset URL Cleanup
status: done
created: 2026-06-25T23:23:08+07:00
updated: 2026-06-25T23:24:51+07:00
author: Codex
task: "Replace direct GIF imports with Vite asset URLs and remove the one-off GIF declaration."
supersedes:
  - docs/plans/2026-06-24-reinforcement-learning-track-ui.md
---

# Goal

Remove the dedicated `src/assets.d.ts` GIF module declaration by switching the
two Reinforcement Learning GIF consumers to `new URL(..., import.meta.url).href`.

# Lineage

Supersedes [2026-06-24-reinforcement-learning-track-ui](./2026-06-24-reinforcement-learning-track-ui.md),
which added the Reinforcement Learning GIF asset import and the one-off
`src/assets.d.ts` declaration.

# Decisions

- Keep the source asset as `docs/assets/Future-HMI ip.gif`; this change only
  changes how Vite resolves its URL.
- Do not introduce `src/vite-env.d.ts`, because the user's preference is to
  reduce the extra declaration file rather than replace it with another one.
- Keep the cleanup scoped to the two known direct GIF imports.

# Phases

## Phase 0 - Store this plan

- Create this plan and wait for approval.

## Phase 1 - Update GIF consumers

- Replace direct GIF imports in the Reinforcement Learning view files with
  `new URL(..., import.meta.url).href`.

## Phase 2 - Remove declaration

- Delete `src/assets.d.ts`.

## Phase 3 - Verify and record

- Run a narrow TypeScript/build verification command.
- Update this plan execution log with the actual changes.

# Out of scope

- Changing, compressing, or replacing the GIF asset.
- Refactoring the Reinforcement Learning UI.
- Adding a broader Vite environment declaration file.

# Execution log

- 2026-06-25T23:23:08+07:00 - Plan created.
- 2026-06-25T23:23:45+07:00 - Plan approved and execution started.
- 2026-06-25T23:24:51+07:00 - Replaced the two direct GIF imports in
  Reinforcement Learning files with `new URL(..., import.meta.url).href`,
  deleted `src/assets.d.ts`, and verified with `npm run typecheck` and
  `npm run build`.

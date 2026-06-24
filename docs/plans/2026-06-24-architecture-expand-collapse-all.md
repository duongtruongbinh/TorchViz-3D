---
title: Add expand-all and collapse-all architecture controls
status: done
created: 2026-06-24T07:48:19+07:00
updated: 2026-06-24T07:57:59+07:00
author: Codex
task: "Add Expand All and Collapse All controls to the architecture visualization."
supersedes: []
---

# Goal

Add accessible, localized controls to the 3D architecture visualization so a
user can expand or collapse all nested architecture containers with one action.

# Lineage

Genesis plan — no predecessor.

# Decisions (locked)

- Place two compact controls with the existing reset-view control in the upper
  right of the canvas, keeping architecture-level actions close to the
  visualization they affect.
- Add store actions for `expandAll` and `collapseAll` so bulk collapse state and
  layout recomputation remain centralized with the existing `toggleCollapse`
  behavior.
- Expand All clears every collapsed container id.
- Collapse All collects every non-root container that has children. The root
  wrapper remains expanded because it is intentionally omitted from the
  rendered container shell when expanded and collapsing it would hide the
  whole architecture behind a single top-level block.
- Recompute layout once per bulk action and increment `layoutRevision`, allowing
  the existing camera containment behavior to respond to the new bounds.
- Disable the controls when no layout/IR is available, and provide English and
  Vietnamese labels/tooltips.

# Phases

## Phase 0 — Store this plan and get approval

- Record the grounded implementation plan.
- Pause for explicit requester approval before changing implementation files.

## Phase 1 — Add bulk collapse state behavior

- Add a small IR traversal helper for collecting collapsible non-root container
  ids.
- Add `expandAll` and `collapseAll` actions to the zustand store.
- Reuse the existing guarded layout recomputation behavior.
- Add focused regression tests for nested containers and root exclusion.

## Phase 2 — Add visualization controls

- Add Expand All and Collapse All buttons next to Reset View in the canvas
  overlay.
- Wire the actions from the workspace/store into `Canvas3D`.
- Add localized accessible labels and disabled states.

## Phase 3 — Verify and document

- Run `npm run verify`.
- Update the existing state-store documentation and this plan's execution log.
- Record any implementation differences from the plan.

# Out of scope

- Changing per-container plus/minus controls.
- Persisting collapse state between model visualizations or browser sessions.
- Changing smart-collapse defaults after a new graph is generated.
- Changing forward-pass behavior beyond consuming the recomputed layout.

# Execution log

- 2026-06-24 — Plan created after tracing the canvas, container rendering,
  localization, layout, and zustand collapse-state paths.
- 2026-06-24 — Requester approved the plan; status advanced through approved to
  executing and implementation began.
- 2026-06-24 — Added `collectCollapsibleContainerIds`, store-level `expandAll`
  and `collapseAll` actions, and a focused regression test proving nested
  containers are collected while top-level roots and empty containers are not.
- 2026-06-24 — Replaced the standalone reset-view overlay with a compact canvas
  toolbar containing localized Expand All, Collapse All, and Reset View
  controls. Wired the bulk actions through `App.tsx` and `Canvas3D`.
- 2026-06-24 — Updated the state-store wiki reference and wiki change log.
- 2026-06-24 — `npm run verify` passed: TypeScript typecheck, 63 tests, and the
  production Vite build. The build retained the existing large-chunk warning.
- 2026-06-24 — Browser automation was unavailable in this session, so no
  automated visual click-through was performed; behavior is covered by the
  traversal regression, store/layout wiring, typecheck, tests, and build.

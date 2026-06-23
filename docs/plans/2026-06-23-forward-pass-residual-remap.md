---
title: Fix forward-pass residual edge visibility
status: done
created: 2026-06-23T21:36:37+07:00
updated: 2026-06-23T22:23:00+07:00
author: Codex
task: "Fix missing residual/skip edges in forward-pass mode, especially Mini-ViT."
supersedes:
  - docs/plans/2026-06-21-forward-pass-all-architectures.md
---

# Goal

Make residual/skip edges visible in Forward pass mode when the traced residual
edge endpoint is an expanded container output rather than a leaf demo stop.
Mini-ViT should show the residual branch around transformer subpaths instead of
only showing the red `Add` blocks.

# Lineage

Supersedes [2026-06-21-forward-pass-all-architectures](./2026-06-21-forward-pass-all-architectures.md).

# Background

`torchstub` traces `Add` inputs as residual edges, but module outputs can be
remapped to a container id. The Forward pass overlay then builds visible edges
from demo stops. Expanded containers are not demo stops, so a residual edge with
one endpoint on an expanded container is currently filtered out.

# Decisions

- Keep the recorder and raw layout graph unchanged.
- Fix the Forward pass edge builder by remapping non-stop residual/concat
  endpoints to visible demo stops inside the relevant expanded container.
- Preserve the existing main-chain synthesis and collapsed-container bypass
  behavior.
- Add a focused regression test in `src/lib/demoFlowEdges.test.ts`.

# Phases

## Phase 0 - Store this plan

Write this plan as the first allowed file modification.

## Phase 1 - Remap residual endpoints

- Add local helpers in `src/components/mnist-demo/demoStops.ts` to locate layout
  nodes by id, collect descendant stop ids, and choose a visible stop endpoint.
- When a residual/concat edge has an endpoint outside the stop set, remap it to
  the nearest suitable descendant stop before deciding whether to include it.

## Phase 2 - Test

- Add a regression covering a Mini-ViT-like expanded container output:
  `patch_embed container -> add` residual should render as
  `permute leaf -> add`.
- Run the narrow node test suite, then `npm test`.

## Phase 3 - Record

- Append this plan's execution log with the actual files changed and verification
  result.
- Update broader docs only if behavior or architecture notes need a long-lived
  clarification.

# Out of scope

- Changing `torchstub` tracing semantics.
- Renaming `mnist-demo` files.
- Reworking the packet route to follow branches; the packet can continue to
  follow the main chain while residual branches are visible.

# Execution log

- 2026-06-23 - Plan created.
- 2026-06-23 - Plan approved; execution started.
- 2026-06-23 - Implemented residual endpoint remapping in
  `src/components/mnist-demo/demoStops.ts`: non-stop expanded-container
  endpoints now resolve to visible descendant stops before the Forward pass
  overlay filters skip/residual/concat branches. Threaded `layout.nodes`
  through `Canvas3D` and `useMnistDemoState` so the edge builder can inspect the
  full layout tree.
- 2026-06-23 - Added `src/lib/demoFlowEdges.test.ts` covering Mini-ViT-like
  `patch_embed -> add` residual remapping plus existing residual edge behavior.
  Verified with `npm.cmd test -- src/lib/demoFlowEdges.test.ts` (60/60),
  `npm.cmd test` (60/60), and `npm.cmd run build` (clean; existing Vite chunk
  size warning only).
- 2026-06-23 - Ran canonical `npm.cmd run verify`; it stopped in `typecheck`
  before tests/build because the local install is missing `@types/react-dom`
  declarations and existing JSX intrinsic types for `lineSegments` /
  `edgesGeometry` in `MnistFlowDemo.tsx`. `npm.cmd ls @types/react-dom` reports
  `(empty)` despite the package being listed in `package.json`.
- 2026-06-23 - Reopened for a routing refinement: the remapped residual is
  visible but its synthetic path does not visually align with the standard
  residual edge routing.
- 2026-06-23 - Adjusted synthetic residual routing to use fixed jogs from each
  visible block face, matching the standard layout residual convention more
  closely. Strengthened `src/lib/demoFlowEdges.test.ts` to assert the remapped
  residual starts/ends on rendered block faces and keeps vertical jog columns
  aligned. `npm.cmd test` passes (60/60); `npm.cmd run build` passes with the
  existing Vite chunk size warning.
- 2026-06-23 - Reopened for a second routing refinement: remapped residuals
  should lift above intervening blocks like `layout.ts` residual edges, not only
  above the endpoint blocks.
- 2026-06-23 - Updated remapped residual synthesis to compute its lift from the
  maximum rendered top of blocks between the source and target, matching the
  standard layout residual clearance rule. Strengthened the regression to assert
  the branch clears the intervening attention block. `npm.cmd test` passes
  (60/60); `npm.cmd run build` passes with the existing Vite chunk size warning.

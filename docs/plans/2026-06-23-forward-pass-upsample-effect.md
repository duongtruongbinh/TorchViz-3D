---
title: Add forward-pass upsample calculation panel
status: done
created: 2026-06-23T22:14:13+07:00
updated: 2026-06-23T22:20:08+07:00
author: Codex
task: "Show the Upsample calculation in Forward pass mode."
supersedes:
  - docs/plans/2026-06-23-forward-pass-block-persistence.md
---

# Goal

Forward pass mode should show an operation/calculation panel when an `Upsample`
block is active. The panel should make the spatial-size expansion visible,
using the same lightweight 3D primitives and localization pattern as the
existing Conv, Pool, Flatten, and Add/Concat effects.

# Lineage

Supersedes [2026-06-23-forward-pass-block-persistence](./2026-06-23-forward-pass-block-persistence.md).

# Findings

`Upsample` is already traced by `torchstub`, has a visual block kind, and is
included in Forward pass stops. The missing piece is the operation-effect layer:
`src/components/operation-effects/index.tsx` does not register an effect for the
`Upsample` visual kind, so `OperationEffect` returns `null` for active upsample
nodes.

# Decisions

- Keep graph tracing, layout, and stop collection unchanged.
- Add a focused `UpsampleEffect` beside the existing operation effects.
- Show a simple nearest-neighbor style expansion from a small input grid to a
larger output grid, with a formula/caption based on the node shapes when
available.
- Add only the localization keys needed by the new panel.
- Use the narrowest verification that covers TypeScript and behavior affected by
  this UI change.

# Phases

## Phase 0 - Store this plan

Write this plan as the first allowed file modification.

## Phase 1 - Implement

- Add `UpsampleEffect` using existing `FeatureMapGrid`, `DemoArrow`,
  `DemoText`, `OperationPanelFrame`, and shape-label helpers.
- Register and export the effect for `VisualKind` `Upsample`.
- Add English and Vietnamese strings for the panel caption, output label, and
  spatial scaling formula.

## Phase 2 - Verify

- Run targeted tests/build checks that are practical for this UI-only change.
- If an existing test surface can cheaply cover the resolver, add a small
  regression asserting `Upsample` has an operation effect.

## Phase 3 - Record

- Update this plan status and execution log with the actual files changed and
  verification results.
- Update broader docs only if the change introduces a new long-lived behavior
  note beyond this plan.

# Out of scope

- Changing `torchstub` `Upsample` shape inference.
- Adding exercises for `Upsample`.
- Reworking the Forward pass packet path or block reveal logic.

# Execution log

- 2026-06-23 - Plan created.
- 2026-06-23 - Plan approved; execution started.
- 2026-06-23 - Added `UpsampleEffect` in
  `src/components/operation-effects/TransformEffects.tsx`, showing a
  nearest-neighbor 2x spatial expansion from a small input grid to a larger
  output grid with active source/target cells and shape labels.
- 2026-06-23 - Registered `UpsampleEffect` in
  `src/components/operation-effects/index.tsx` so active `Upsample` nodes now
  show the calculation panel in Forward pass mode.
- 2026-06-23 - Added localized labels/caption/formula text in
  `src/lib/localization.ts`.
- 2026-06-23 - Verification: `npm.cmd test` passes (62/62) and
  `npm.cmd run build` passes with the existing Vite large chunk warning.
  `npm.cmd run typecheck` is still blocked by existing local issues: missing
  `react-dom` type declarations and existing JSX intrinsic type errors for
  `lineSegments` / `edgesGeometry` in `MnistFlowDemo.tsx`.

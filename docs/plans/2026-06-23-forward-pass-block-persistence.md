---
title: Fix forward-pass block visibility persistence
status: done
created: 2026-06-23T23:10:00+07:00
updated: 2026-06-23T23:24:00+07:00
author: Codex
task: "Fix Forward pass blocks appearing and then being hidden during playback."
supersedes:
  - docs/plans/2026-06-23-forward-pass-residual-remap.md
---

# Goal

Forward pass mode should reveal operation blocks monotonically. Once a block is
shown, later residual/branch playback should not remove it from the rendered
operation-block subset.

# Lineage

Supersedes [2026-06-23-forward-pass-residual-remap](./2026-06-23-forward-pass-residual-remap.md).

# Background

The current Forward pass scene passes `visibleNodeIds` into
`SceneWithInstancing`, which then renders only the demo-stop nodes currently in
that set. Residual remapping and expanded containers can make an edge depend on
nodes that are not part of the current linear stop prefix, so those blocks can
flash in one step and disappear in a later step even though the forward pass has
already revealed them.

# Decisions

- Keep the layout graph and edge remapping behavior unchanged.
- Centralize the reveal-set calculation near `buildDemoFlowEdges`, so visible
  nodes include both the linear prefix and nodes required by edges already
  revealed.
- Preserve progressive reveal: future blocks should remain hidden until their
  stop or an already-revealed edge needs them.
- Add a focused regression around the visibility-set behavior.

# Phases

## Phase 0 - Store this plan

Write this plan as the first allowed file modification.

## Phase 1 - Reproduce and pinpoint

- Inspect the current `visibleNodeIds` calculation against the residual edge
  reveal data.
- Identify the smallest helper/API change that makes reveal monotonic.

## Phase 2 - Implement

- Add or update a helper that derives visible node ids from stops, active stop
  index, and revealed flow edges.
- Use that helper from `useMnistDemoState`.

## Phase 3 - Test and verify

- Add a narrow regression test for blocks staying visible after a residual edge
  reveal.
- Run the targeted test, then the narrowest broader verification that matches
  the change.

## Phase 4 - Record

- Update this plan status and execution log with the actual modifications and
  verification result.
- Update long-lived docs only if the behavior/API change needs documentation
  outside the plan.

# Out of scope

- Changing the visual layout engine.
- Reworking residual edge routing or packet animation beyond what is necessary
  for block visibility.
- Adding routing/App UI changes.

# Execution log

- 2026-06-23 - Plan created.
- 2026-06-23 - Plan approved; execution started.
- 2026-06-23 - Added `buildVisibleDemoNodeIds` in
  `src/components/mnist-demo/demoStops.ts` and wired
  `useMnistDemoState` to derive visible blocks from the same flow-edge reveal
  data that drives Forward pass edges.
- 2026-06-23 - Kept Forward pass visible leaves on stable individual meshes in
  `src/components/canvas/SceneBlocks.tsx` so blocks do not switch from single
  meshes to instanced batches mid-playback.
- 2026-06-23 - Added a regression in `src/lib/demoFlowEdges.test.ts` for
  visible node ids including already revealed flow-edge endpoints. Verified with
  `npm.cmd test -- src/lib/demoFlowEdges.test.ts` (62/62; the project test
  script also runs `src/lib/*.test.ts`) and `npm.cmd run build` (passes with
  the existing large chunk warning).

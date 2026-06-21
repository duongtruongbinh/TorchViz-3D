---
title: Landing Hero Flow Logic
status: done
created: 2026-06-21T17:19:14+07:00
updated: 2026-06-21T19:38:05+07:00
author: Codex
task: "make the Landing hero animation read as a realistic TorchViz model flow instead of decorative motion"
supersedes:
  - docs/plans/2026-06-21-landing-hero-upgrade.md
---

# Goal

Revise the Landing hero animation so it communicates a believable model trace:
input tensor scan -> Conv2d -> ReLU -> MaxPool -> Linear -> logits output.

Success means the visual still feels rich, but the motion now has one coherent
timeline, one directional path, active stage highlighting, and readouts that
match the currently active operation.

# Lineage

Supersedes [2026-06-21-landing-hero-upgrade](./2026-06-21-landing-hero-upgrade.md).

This follow-up responds to review feedback that the current animation has the
right visual idea but the flow is not realistic enough and lacks clear logic.

# Context Read

- `src/components/landing/LandingPage.tsx` currently defines a DOM/CSS hero with
  static layer metadata, a matrix input tile, connector paths, three decorative
  data packets, and terminal/output readouts.
- `src/index.css` currently animates floating layers, dashed connectors, a
  matrix scanline, and three independent packet paths.
- The current issue is visual semantics, not app architecture: AppShell,
  workspace entry, language toggle, Back-to-Landing, Learning Lab disabled
  state, and workspace behavior should remain unchanged.

# Decisions

- Keep the implementation scoped to `LandingPage.tsx` and `src/index.css`.
- Replace independent decorative packets with one staged data token moving left
  to right through the actual layer sequence.
- Add explicit stage markers/readouts so viewers can infer the operation order
  without extra explanatory copy.
- Make layer motion stage-aware: a subtle idle state plus a pulse when that
  layer is active in the timeline.
- Keep the matrix scan linked to the start of the loop, and make the output
  panel pulse only near the end.
- Keep the DOM/CSS approach; do not add Three.js/R3F, routing, or new
  dependencies.
- Do not modify Pyodide, torchstub, IR/layout, Canvas3D internals, exercises,
  or Learning Lab implementation.

# Phases

## Phase 0 - Approval checkpoint

- Store this draft plan under `docs/plans/`.
- Wait for explicit user approval before runtime edits.

## Phase 1 - Hero data model

- Update `heroLayers` with per-stage metadata: step number, operation label,
  input/output shape, and stage timing class.
- Update hero readouts to describe a coherent trace rather than unrelated
  floating labels.

## Phase 2 - Timeline markup

- Adjust the hero visual markup so connectors and packets follow one left-to-
  right path.
- Add stage badges or small progress nodes aligned with the layers.
- Ensure the primary CTA and language menu remain unobstructed.

## Phase 3 - CSS timeline

- Replace the three independent packet animations with a single timeline-driven
  packet and synchronized active pulses.
- Keep animation lightweight and scoped to Landing classes.
- Preserve the current desktop minimum width and avoid text overlap.

## Phase 4 - Verification and log

- Run `npm run verify`.
- Update this plan's execution log with changed files and verification result.

# Out of Scope

- Workspace logic or canvas renderer changes.
- Real graph execution or data-driven Landing preview from the store.
- Learning Lab implementation.
- Routing or new dependencies.
- Broad docs/wiki updates unless existing docs become inaccurate.

# Execution Log

- 2026-06-21T17:19:14+07:00 - Plan created after reviewing the current hero
  implementation and review feedback.
- 2026-06-21T19:33:26+07:00 - User approved the plan; implementation started.
- 2026-06-21T19:38:05+07:00 - Updated `src/components/landing/LandingPage.tsx`
  so the hero data model and readouts now follow a coherent
  `input -> Conv2d -> ReLU -> MaxPool -> Linear -> logits` sequence.
- 2026-06-21T19:38:05+07:00 - Updated `src/index.css` to replace independent
  decorative packets with one staged forward-pass packet, a single progress
  path, synchronized layer/readout/checkpoint pulses, start-of-loop matrix scan,
  and end-of-loop output pulse.
- 2026-06-21T19:38:05+07:00 - Ran `npm run verify`: typecheck passed, 55 tests
  passed, and production build passed. Started Vite on
  `http://127.0.0.1:3001/` and confirmed the served Landing module/CSS includes
  the new flow timeline markup and animation classes.

---
title: Landing UI Iteration
status: done
created: 2026-06-21T17:02:32+07:00
updated: 2026-06-21T21:55:00+07:00
author: Codex
task: "consolidated Landing Page visual iteration plan and execution history"
supersedes:
  - docs/plans/2026-06-21-learning-lab-refactor.md
---

# Goal

Upgrade and finalize the active Landing Page so it feels like the TorchViz-3D
product, communicates a realistic model flow, and keeps the route into the
existing workspace clear.

Success means:

- The app opens on Landing through `AppShell`.
- The Workspace card opens the existing TorchViz-3D editor/canvas workflow.
- The Learning Lab card remains disabled/coming soon.
- The Landing preview reads as a compact model flow:
  `Conv2d -> ReLU -> MaxPool -> Linear`.
- Landing docs stay consolidated in this page plus the existing
  `wiki/concepts/learning-lab-refactor.md` overview.

# Lineage

Supersedes [2026-06-21-learning-lab-refactor](./2026-06-21-learning-lab-refactor.md).

This page consolidates the former Landing-specific plan pages:

- `2026-06-21-landing-hero-upgrade.md`
- `2026-06-21-landing-hero-flow-logic.md`
- `2026-06-21-landing-panel-layout-swap.md`
- `2026-06-21-landing-ui-final-review-docs.md`

# Context Read

- `docs/WORKFLOW.md` defines the mandatory project workflow.
- `CLAUDE.md` confirms the core runtime pipeline and the files that must remain
  untouched unless the current task requires them.
- `docs/plans/2026-06-21-learning-lab-refactor.md` defines the AppShell/Landing
  boundary: Landing/AppShell is active, Learning Lab remains disabled, and no
  Pyodide/torchstub/IR/layout/Canvas3D changes are part of Landing polish.
- `src/components/landing/LandingPage.tsx` owns the active Landing first screen,
  language selector, preview, and localized Landing copy.
- `src/components/landing/ToolCard.tsx` is the active workspace entry.
- `src/components/landing/LearningCard.tsx` is disabled/coming soon.
- `src/components/AppShell.tsx` switches between Landing and workspace with
  local React state.

# Decisions

- Keep Landing visual work scoped to Landing/AppShell-facing files unless a
  compile issue requires a narrow supporting edit.
- Do not modify Pyodide, torchstub, IR/layout, Canvas3D internals, exercises,
  routing, or Learning Lab runtime logic for Landing polish.
- Use lightweight DOM/CSS for the Landing preview; do not add Three.js/R3F or
  new dependencies for this surface.
- Keep the first viewport product-focused: `TorchViz 3D` remains the dominant
  signal, the left preview shows the model flow, and the right cards present
  Workspace and Learning Lab outcomes.
- Keep Learning Lab visibly disabled and non-navigating.
- Fold Landing documentation into existing related docs instead of creating
  separate pages for each visual iteration.

# Phases And Outcomes

## Hero Visual Upgrade

- Replaced the static MVP Landing composition with a richer TorchViz-style first
  screen.
- Added localized hero copy, a workspace-inspired preview, model-stage blocks,
  and stronger Workspace/Learning cards.
- Preserved language selection, Workspace entry, Back-to-Landing behavior, and
  disabled Learning Lab state.

## Flow Logic Pass

- Revised the preview to communicate a believable model trace:
  `input -> Conv2d -> ReLU -> MaxPool -> Linear -> logits`.
- Replaced decorative packet motion with a coherent staged flow.
- Kept implementation scoped to `LandingPage.tsx` and `src/index.css`.

## Layout And Final Review

- Moved the active preview into the left bento area and kept the Workspace and
  Learning Lab cards compact on the right.
- Added anchor-based route lines from the preview to the cards.
- Updated existing architecture/wiki docs with a concise Landing summary rather
  than introducing a separate Landing docs page.

## Activation Icon And Flow Polish

- Replaced the Activation card's signal-meter bars with a compact ReLU graph.
- Aligned the y-axis with the ReLU kink at the origin.
- Removed the visual line crossing through cards; the flow line now appears
  between blocks, with card backgrounds covering the path inside each block.
- Removed stale CSS from earlier Landing preview iterations.

# Out Of Scope

- Learning Lab implementation.
- Routing.
- `src/store/uiStore.ts` behavior.
- Exercise behavior or content changes.
- Pyodide worker, torchstub, IR contract, layout engine, Canvas3D internals, or
  MNIST/operation-effects internals.
- New dependencies.
- Separate Landing documentation pages for small UI iterations.

# Documentation Rule

Landing-related docs should remain consolidated here and in
`wiki/concepts/learning-lab-refactor.md`. Do not create another Landing docs
page for a small visual, copy, or layout iteration unless the new work introduces
a genuinely separate subsystem or long-lived reference surface.

# Execution Log

- 2026-06-21T17:02:32+07:00 - Created the original Landing hero visual upgrade
  plan after reading workflow, architecture orientation, MVP 1 plan, active
  Landing/AppShell files, and workspace visual references.
- 2026-06-21T17:15:53+07:00 - Implemented the first hero upgrade in
  `src/components/landing/LandingPage.tsx`, `ToolCard`, `LearningCard`, and
  scoped Landing CSS.
- 2026-06-21T17:15:53+07:00 - Ran `npm run verify`: typecheck passed, 55 tests
  passed, and production build passed.
- 2026-06-21T19:38:05+07:00 - Updated the preview to follow the coherent
  `input -> Conv2d -> ReLU -> MaxPool -> Linear -> logits` sequence and ran
  `npm run verify`: typecheck passed, 55 tests passed, and production build
  passed.
- 2026-06-21T20:53:28+07:00 - Finalized the bento Landing layout and docs
  approach: update existing docs, do not create a new Landing docs page.
- 2026-06-21T21:08:05+07:00 - Fixed the Activation visual semantics by replacing
  signal bars with a ReLU graph and updated the flow line to appear between
  blocks instead of crossing through them.
- 2026-06-21T21:55:00+07:00 - Consolidated the four former Landing-specific plan
  pages into this single page and documented the no-unnecessary-pages rule.

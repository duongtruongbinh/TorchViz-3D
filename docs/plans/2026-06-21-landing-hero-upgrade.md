---
title: Landing Hero Visual Upgrade
status: done
created: 2026-06-21T17:02:32+07:00
updated: 2026-06-21T17:15:53+07:00
author: Codex
task: "design and implement a stronger TorchViz-3D Landing hero with an animated workspace-inspired visual"
supersedes:
  - docs/plans/2026-06-21-learning-lab-refactor.md
---

# Goal

Upgrade the active Landing Page so the first viewport has a stronger TorchViz
3D identity, a memorable workspace-inspired animated visual, and an obvious
path into the existing workspace.

Success means the Landing Page feels like the actual TorchViz product rather
than a static marketing card, while preserving the current AppShell behavior:
Open workspace enters the existing TorchViz workspace, Back-to-Landing returns
to Landing, Learning Lab remains disabled/coming soon, and language selection
continues to use `useStore.language`.

# Lineage

Supersedes [2026-06-21-learning-lab-refactor](./2026-06-21-learning-lab-refactor.md).

This plan builds on the approved MVP 1 Landing/AppShell addendum. MVP 1 made
Landing active, added the workspace entry card, kept Learning Lab disabled, and
added Landing language selection.

# Context Read

- `docs/WORKFLOW.md` requires a stored approved plan before runtime edits.
- `CLAUDE.md` confirms the core runtime pipeline and the files that must remain
  untouched unless needed.
- `docs/plans/2026-06-21-learning-lab-refactor.md` defines MVP 1 boundaries:
  Landing/AppShell is active, Learning Lab remains disabled, no routing, no
  Pyodide/torchstub/IR/layout/Canvas3D internals changes.
- `src/components/landing/LandingPage.tsx` currently owns localized Landing
  copy, the language menu, static hero text, stats, and the Tool/Learning cards.
- `src/components/landing/ToolCard.tsx` is the active workspace entry.
- `src/components/landing/LearningCard.tsx` is disabled/coming soon.
- `src/components/AppShell.tsx` switches between Landing and workspace with
  local React state.
- `App.tsx` preserves the workspace and passes `onBackToLanding` into
  `Header`.
- Existing visual language to reuse includes the canvas dark surface tokens in
  `src/index.css`, op colors in `src/lib/visualKind.ts`, and MNIST/demo dataflow
  motifs from `src/components/mnist-demo/MnistFlowDemo.tsx` and
  `src/components/operation-effects/*`.

# Decisions

- Keep implementation scoped to Landing/AppShell-facing files unless a compile
  issue forces a narrow supporting edit.
- Do not modify `App.tsx`, Pyodide, torchstub, IR, layout, Canvas3D internals,
  operation effects, MNIST demo behavior, exercises, or Learning Lab runtime
  files.
- Add the hero visual as a lightweight DOM/CSS animated composition inside the
  Landing Page, inspired by the existing 3D canvas: isometric colored layer
  blocks, connector lines, data packets, a small matrix/input tile, and local
  shape/parameter readouts.
- Avoid adding a new Three.js/R3F scene for this pass. A DOM/CSS composition is
  enough to satisfy the animated/interactive requirement with lower risk and no
  renderer lifecycle interaction.
- Keep gradients only as atmospheric support for the concrete TorchViz-style
  scene; no decorative blob/orb background.
- Preserve `ToolCard` as the primary actionable entry, but allow its styling to
  become more CTA-like if needed for the stronger hero.
- Keep `LearningCard` visibly disabled/coming soon and non-navigating.
- Preserve the current desktop minimum-width behavior (`min-w-[1024px]`) and
  ensure hero/card text has stable widths and no overlap.
- Update docs/wiki only if the new Landing behavior would make existing docs
  inaccurate; otherwise the plan execution log is sufficient.

# Phases

## Phase 0 - Approval checkpoint

- Store this draft plan under `docs/plans/`.
- Wait for explicit user approval before editing runtime/source/docs files.

## Phase 1 - Hero composition

- Refactor `LandingPage.tsx` to use a richer first screen layout with
  `TorchViz 3D` as the dominant first-viewport signal.
- Add an internal landing hero visual component or small local helpers in
  `LandingPage.tsx`.
- Use workspace-inspired colors, block labels, matrix cells, connector lines,
  and animated data packets.
- Keep localized EN/VI copy and the existing language toggle behavior.

## Phase 2 - Cards and CTA polish

- Adjust `ToolCard.tsx` only if needed so "Open workspace" remains the obvious
  primary action.
- Adjust `LearningCard.tsx` only if needed so disabled/coming-soon state remains
  clear and visually subordinate.
- Do not add navigation behavior to Learning Lab.

## Phase 3 - Styling and responsiveness

- Add narrowly scoped CSS keyframes/classes in `src/index.css` if Tailwind
  utility classes are not enough.
- Check the 1024px minimum desktop layout for text overflow and CTA visibility.
- Ensure animations do not cover or block the language toggle or primary CTA.

## Phase 4 - Docs and execution log

- Update this plan's status and execution log as work proceeds.
- Update existing docs/wiki only if they would otherwise describe the active
  Landing Page inaccurately.

## Phase 5 - Verification

- Run `npm run verify`.
- If feasible, start the Vite dev server and inspect the Landing Page and
  workspace transition. Because the hero visual is DOM/CSS rather than a 3D
  canvas scene, verification focuses on nonblank rendering, CTA accessibility,
  language toggle, disabled Learning Lab, and Back-to-Landing.

# Out of Scope

- Routing.
- Learning Lab implementation.
- `src/store/uiStore.ts` behavior.
- Exercise behavior or content changes.
- Pyodide worker, torchstub, IR contract, layout engine, Canvas3D internals, or
  MNIST/operation-effects internals.
- New dependencies.
- Mobile-specific redesign beyond preserving the current desktop minimum-width
  contract.

# Execution Log

- 2026-06-21T17:02:32+07:00 - Plan created after reading workflow,
  architecture orientation, MVP 1 plan, active Landing/AppShell files, and
  workspace visual reference files.
- 2026-06-21T17:04:11+07:00 - User approved the plan; status moved directly to
  executing for implementation.
- 2026-06-21T17:15:53+07:00 - Implemented the Landing hero upgrade in
  `src/components/landing/LandingPage.tsx`, including localized hero copy, a
  DOM/CSS workspace-inspired animated visual, isometric layer blocks, matrix
  input tile, connector paths, moving data packets, and trace/output readouts.
- 2026-06-21T17:15:53+07:00 - Polished `ToolCard` as the primary workspace CTA
  and kept `LearningCard` disabled/coming soon.
- 2026-06-21T17:15:53+07:00 - Added scoped Landing animation styles to
  `src/index.css`, including fallbacks for layer colors if `color-mix()` is not
  available.
- 2026-06-21T17:15:53+07:00 - No docs/wiki updates were needed beyond this
  plan log because existing Landing/AppShell docs remain accurate.
- 2026-06-21T17:15:53+07:00 - Ran `npm run verify`: typecheck passed, 55 tests
  passed, and production build passed. Also started Vite on
  `http://127.0.0.1:3002/` and confirmed the served Landing module includes
  `TorchViz 3D`, `Open workspace`, `Learning Lab`, and the `landing-hero-visual`
  markup plus animation CSS. Playwright/browser screenshot tooling is not
  installed in this repo.

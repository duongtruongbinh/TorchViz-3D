---
title: Fix canvas flow-line alignment
status: done
created: 2026-07-19T20:23:27+07:00
updated: 2026-07-19T22:03:05+07:00
author: duongtruongbinh
task: "Remove the apparent connector tails in the static 3D canvas and Forward Pass, and correct route endpoints."
supersedes:
  - ./2026-07-02-architecture-priority-refactors.md
---

# Goal

Remove lines that appear to protrude past the final/active block while keeping real
main, residual, and concat edges attached exactly to rendered block faces.

# Lineage

Continues [2026-07-02-architecture-priority-refactors](./2026-07-02-architecture-priority-refactors.md),
which established the persistent Canvas3D scene and adaptive grid.

# Diagnosis and decisions

- Browser reproduction confirms the long apparent tail is the emphasized
  `gridHelper` center line placed on the model's `z = 0` flow axis, not a graph edge.
- Phase the grid so the flow axis falls between grid lines and remove special center-line
  emphasis; keep a subtle spatial grid without an edge-like axis.
- Preserve the existing face-based static and synthesized block-to-block routing.
- Correct the virtual input line and first packet route to end at the first block's
  renderable left face instead of its center.
- Add geometry regressions for grid phase and first-route endpoints, then update the
  existing rendering and Forward Pass wiki pages.

# Phases

1. Update adaptive-grid positioning/theme and virtual-input endpoint geometry.
2. Add/update narrow unit tests.
3. Run affected tests and `npm run verify`.
4. Inspect static and intermediate Forward Pass scenes in Playwright, including a
   simple chain and a residual architecture; record results here and mark done.

# Out of scope

- Replacing the IR/layout routing algorithm or redesigning residual arcs.
- Changing block dimensions, camera controls, or operation-effect panels.
- Touching unrelated dirty plan-file edits already present in the worktree.

# Execution log

- 2026-07-19T20:23:27+07:00 - Source, geometry, tests, and browser scenes audited; plan stored for mandatory approval.
- 2026-07-19T20:33:31+07:00 - Requester approved execution with "go"; lineage retargeted to the extant adaptive-grid predecessor after the prior local canvas plan was removed.
- 2026-07-19T20:33:47+07:00 - Execution started.
- 2026-07-19T20:36:00+07:00 - Grid center-line emphasis removed, grid phased half a cell off the `z = 0` flow axis, and the virtual input route aligned to the first rendered block face.
- 2026-07-19T20:37:00+07:00 - Geometry regression suite passed (13/13); full `npm run verify` passed typecheck, 72/72 tests, and production build.
- 2026-07-19T20:40:25+07:00 - Playwright inspection passed for LeNet static/intermediate scenes and expanded Mini-ResNet static/Add scenes: no apparent connector tails, with real direct and residual routes preserved. Work completed.
- 2026-07-19T20:46:03+07:00 - Requester reported a remaining protrusion. Reopened the approved scope without creating a new plan; enlarged screenshot review confirmed perspective can still project a parallel ground-grid line as a continuation of the final connector.
- 2026-07-19T20:49:00+07:00 - Replaced the continuous ground grid with isolated dots. A clean-background browser capture then isolated the remaining tail as the leaf block's own depth-axis `<Edges>` outline, not layout routing.
- 2026-07-19T20:52:04+07:00 - Replaced full leaf cuboid edge outlines with camera-facing face outlines; Playwright confirmed no tail on LeNet's final block or active Conv2d, while expanded Mini-ResNet retained its residual route at Add.
- 2026-07-19T20:53:27+07:00 - Added regressions for dot-grid geometry and connector-safe leaf rendering. Full verification passed typecheck, 73 tests, and production build before the final regression was added; the final complete test suite passed 74/74 and `git diff --check` passed. Work completed.
- 2026-07-19T21:06:58+07:00 - Requester confirmed tails are gone but reported that the dot grid makes the canvas feel visually absent and the face-only leaf outlines degraded the established block style. Reopened the same approved scope to restore a visible line grid with a protected flow corridor and restore front/back cuboid outlines without depth-axis tail segments.
- 2026-07-19T21:09:56+07:00 - Playwright confirmed the visible line grid and front/back leaf outlines restore the spatial canvas/block presentation in LeNet static and intermediate Forward Pass scenes without reintroducing connector tails.
- 2026-07-19T21:10:54+07:00 - Full `npm run verify` passed typecheck, 74/74 tests, and production build; `git diff --check` passed. Work completed.
- 2026-07-19T21:33:12+07:00 - Requester found the screen-space front/back outlines too conspicuous. Reopened the same scope to restore the original native thin-edge treatment while retaining the omission of the four depth-axis tail segments.
- 2026-07-19T21:35:41+07:00 - Replaced the conspicuous screen-space outlines with native `lineSegments` matching the original subtle edge rendering; Playwright confirmed the static and active block styles remain 3D without trailing segments.
- 2026-07-19T21:36:35+07:00 - Full `npm run verify` passed typecheck, 74/74 tests, and production build; `git diff --check` passed. Work completed.
- 2026-07-19T21:43:56+07:00 - Requester confirmed the remaining native face segments are still visually apparent. Reopened the same scope to remove all supplemental leaf outlines and rely on the original solid geometry, material shading, and emissive active state.
- 2026-07-19T21:46:23+07:00 - Removed all supplemental leaf face/depth outlines. Playwright confirmed both static and active blocks retain solid 3D shading without any outer wireframe or connector tail.
- 2026-07-19T21:47:26+07:00 - Full `npm run verify` passed typecheck, 74/74 tests, and production build; `git diff --check` passed. Work completed.
- 2026-07-19T21:56:09+07:00 - Requester asked for a first-visualization black-flash recheck and removal of the persistent dashed input connector in Forward Pass. Reopened this existing approved canvas/flow scope without creating a new plan.
- 2026-07-19T22:02:25+07:00 - A fresh-browser first-run video showed no full-page black frames: workspace chrome remained visible while the transparent canvas-only loading status was active. Forward Pass inspection at the input step showed no persistent dashed connector; moving packet routing remains intact.
- 2026-07-19T22:03:05+07:00 - Added a connector regression and updated the Forward Pass wiki. Full `npm run verify` passed typecheck, 75/75 tests, and production build; `git diff --check` passed. Work completed.

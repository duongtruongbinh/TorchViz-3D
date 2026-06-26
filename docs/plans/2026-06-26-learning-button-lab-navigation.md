---
title: Learning Button Lab Navigation
status: done
created: 2026-06-26T16:53:31+07:00
updated: 2026-06-26T17:46:37+07:00
author: Codex
task: "make Learning Lab the inline theory, animation, and exercise page reached from Workspace Learning buttons"
supersedes:
  - docs/plans/2026-06-24-learning-path-exercise-separation.md
  - docs/plans/2026-06-25-learning-lab-domain-refactor.md
---

# Goal

Change the Workspace forward-pass exercise affordance so users press a Learning
entry and are sent to the matching Learning Lab lesson/practice page. Learning
Lab becomes the primary surface for theory, animation, and exercises; practice
should render directly in the page instead of opening popup windows.

Success means:

- The app is on a non-main feature branch before implementation.
- The forward-pass control exposes Learning as the entry action for available
  practice.
- Selecting an available tensor exercise navigates into the Learning Lab route
  that contains the corresponding lesson/practice.
- Learning Lab can initialize the matching lesson from the route/query state.
- Learning Lab owns the visible theory, animation, and exercise experience for
  that lesson.
- Learning Lab practice renders inline inside the lesson/detail screen rather
  than launching `ShapeExercise`, `ValueExercise`, or `ConvExerciseModal`
  popups.
- Workspace exercise popup state is removed or no longer reachable from the
  forward-pass Learning entry.

# Lineage

Supersedes [2026-06-24-learning-path-exercise-separation](./2026-06-24-learning-path-exercise-separation.md)
for the active Learning Lab practice boundary.

Supersedes [2026-06-25-learning-lab-domain-refactor](./2026-06-25-learning-lab-domain-refactor.md)
for the current domain-first Learning Lab catalog structure.

# Context Read

- `docs/WORKFLOW.md` and `CLAUDE.md` define the required plan-before-edit
  workflow and branch naming rules.
- `wiki/concepts/learning-lab-refactor.md` states that Learning Lab is the
  single learning container and that existing Workspace exercise entry points
  remain available unless a later approved plan changes them.
- `src/components/canvas/Canvas3D.tsx` currently renders `DemoControls` plus
  local `ConvExerciseModal`, `ShapeExercise`, and `ValueExercise` driven by
  `demo.activeExerciseId`.
- `src/components/mnist-demo/useMnistDemoState.ts` currently opens exercises by
  setting `activeExerciseId`.
- `src/components/exercises/ExerciseLauncher.tsx` currently shows an exercise
  select and calls `onOpenExercise`.
- `src/components/learning/LearningLabView.tsx` currently supports
  `/learning`, `/learning/:domainId`, and `/learning/:domainId/:trackId`, then
  stores the selected lesson in local state.
- Learning Lab tensor practice currently reuses modal-oriented exercise
  components for some practice surfaces; this plan changes that interaction
  model so the lab displays exercises inline as page content.
- `src/core/learning/content/*` maps practice refs to existing tensor exercise
  IDs, domains, tracks, and lessons.

# Decisions

- Use branch `feat/learning-lab-page-navigation`.
- Treat this as an intentional replacement of the Workspace forward-pass
  exercise popup entry, not a broad removal of every exercise component from
  the codebase.
- Add a small React-free resolver that maps a Workspace `exerciseId` plus
  current operation label/type to the first approved Learning Lab tensor
  practice that matches. Prefer exact operation matches where possible.
- Keep route shape static-host friendly: use the existing
  `/learning/:domainId/:trackId` route with query params for `lesson` and
  `practice` instead of adding a deeper route.
- Treat Learning Lab as the owner of the full learning flow: theory, animation,
  and practice all live on the page.
- Replace Learning Lab popup practice launchers with inline exercise panels.
  Reuse existing model builders, answer checking, fixtures, and copy where
  practical, but adapt presentation to non-modal page sections.
- Keep animation and exercise content visually integrated with the selected
  lesson rather than treating practice as a separate window.
- Preserve unavailable practice gating in Learning Lab.
- Do not change Pyodide, torchstub, IR tracing, layout, Canvas3D scene
  rendering, or RL practice fixtures.

# Phases

## Phase 0 - Store this plan

- Create this draft plan under `docs/plans/`.
- Wait for explicit user approval before modifying runtime/source/docs files.

## Phase 1 - Add Learning Lab target resolution

- Add a small selector/helper near `src/core/learning/selectors.ts` or a new
  React-free file under `src/core/learning/` to resolve approved practice refs
  to `{ domainId, trackId, lessonId, practiceId }`.
- Cover the resolver with focused tests for Conv2d shape/value, pooling
  shape/value, and ReLU value behavior.

## Phase 2 - Change Workspace launcher behavior

- Change `ExerciseLauncher` copy/control from local exercise selection to a
  Learning entry action while preserving accessible labels and compact layout.
- Change `DemoControls`/`Canvas3D` to navigate to the resolved Learning Lab
  target instead of calling local modal open handlers.
- Remove now-unreachable Workspace modal wiring from the forward-pass control
  path.

## Phase 3 - Let Learning Lab honor the target

- Read `lesson` and `practice` query params in `LearningLabView`.
- Initialize selected lesson from `lesson` when it belongs to the active track.
- Pass the selected practice ID down far enough to mark or focus the relevant
  practice section.

## Phase 3b - Render practice inline in Learning Lab

- Refactor tensor practice renderers so approved practice opens as inline page
  content inside the lesson/detail area instead of a popup window.
- Reuse existing shape/value exercise model builders and validation logic while
  separating reusable exercise body content from modal chrome where needed.
- Keep RL practice inline through the existing dedicated RL exercise components.
- Add or preserve a lesson-level animation/visualization area where the selected
  practice needs animation context, keeping it inside the Learning Lab page.
- Remove Learning Lab dependencies on modal-only presentation for the practice
  path touched by Workspace Learning buttons.

## Phase 4 - Docs and verification

- Update this plan execution log with the files changed and verification result.
- Update `wiki/concepts/learning-lab-refactor.md` to document that Workspace
  Learning entries now route into Learning Lab and that Learning Lab renders
  theory, animation, and exercises inline rather than opening practice popups.
- Run `npm run verify`.

## Phase 5 - Select-to-new-tab follow-up

- Restore the Workspace forward-pass affordance to the original exercise select
  interaction shape.
- When a user chooses an exercise, keep the current visualization page in place
  and open a small popup/panel explaining that the lesson opens in Learning Lab.
- The panel action opens the resolved Learning Lab practice route in a new tab
  instead of navigating the current page directly.
- Do not run verification commands for this follow-up because the requester will
  run tests and the app locally.

## Phase 6 - Hover-to-panel follow-up

- Keep the select-style exercise affordance.
- Show the Learning handoff panel as soon as the user hovers or focuses the
  exercise select area, using the first approved practice target for the active
  operation.
- Keep selecting a specific exercise as an optional way to switch the panel
  target when more than one practice is available.
- Do not run verification commands because the requester will run tests and the
  app locally.

## Phase 7 - Per-option hover handoff

- Replace whole-select hover preview with per-option hover/focus preview.
- Show a `>` affordance at the end of each exercise option row.
- Position the Learning handoff panel beside the exercise option/control area.
- Do not run verification commands because the requester will run tests and the
  app locally.

## Phase 8 - Dropdown option hover handoff

- Keep the exercise affordance as a dropdown-style control.
- Use a custom dropdown so individual exercise option hover/focus can trigger
  the Learning handoff panel.
- Keep the trailing `>` affordance on each dropdown option row.
- Do not run verification commands because the requester will run tests and the
  app locally.

## Phase 9 - Auto-dismiss handoff panel

- Remove the explicit close `X` from the Learning handoff panel.
- Dismiss the panel automatically when the pointer leaves the panel.
- Do not run verification commands because the requester will run tests and the
  app locally.

## Phase 10 - Align panel to hovered option

- Position the Learning handoff panel from the hovered/focused option row's
  bounding box instead of from a fixed canvas offset.
- Align the panel beside the row's trailing `>` affordance.
- Do not run verification commands because the requester will run tests and the
  app locally.

## Phase 11 - Handoff panel z-layer

- Raise the dropdown and handoff panel above canvas overlays and ordinary
  app panels.
- Keep it below the export modal layer.
- Do not run verification commands because the requester will run tests and the
  app locally.

# Out of scope

- Removing the exercise components themselves.
- Removing exercise access from Learning Lab.
- Rebuilding every existing exercise UI from scratch if reusable model/body
  logic can be extracted safely.
- Adding progress tracking, persistence, or a full router hierarchy below
  lesson/practice.
- Changing Learning Lab content approval metadata.
- Changing RL/Robot Learning content beyond route selection support if needed.
- Reworking Landing Page visuals.

# Execution log

- 2026-06-26T16:53:31+07:00 - Draft plan created after reading workflow,
  architecture briefing, Learning Lab docs/plans, route setup, Workspace
  forward-pass controls, exercise registry, and Learning Lab content structure.
- 2026-06-26T16:54:29+07:00 - Updated draft per user clarification: Learning
  Lab should own theory, animation, and exercise display directly on the page,
  with no practice popup windows for the new flow.
- 2026-06-26T16:58:46+07:00 - User approved the plan in chat; status moved to
  executing.
- 2026-06-26T17:06:07+07:00 - Added Learning Lab practice route helpers and a
  React-free tensor practice target resolver with tests for Conv2d, pooling,
  ReLU, and unavailable Linear behavior.
- 2026-06-26T17:06:07+07:00 - Changed Workspace forward-pass exercise affordance
  into Learning buttons that navigate to approved Learning Lab practice targets;
  removed the local forward-pass modal state path.
- 2026-06-26T17:06:07+07:00 - Added inline display mode to Shape, Value, and
  Conv exercise components, and updated Learning Lab tensor practice cards to
  render exercises directly inside the lesson page.
- 2026-06-26T17:06:07+07:00 - Learning Lab now reads `lesson` and `practice`
  query state, initializes the selected lesson, highlights the target practice,
  and scrolls it into view.
- 2026-06-26T17:06:07+07:00 - Updated
  `wiki/concepts/learning-lab-refactor.md` to document Workspace-to-Learning
  routing and inline Learning Lab practice ownership.
- 2026-06-26T17:06:07+07:00 - `npm run verify` passed: typecheck, 75 tests, and
  production build. Vite reported the existing large Three.js chunk warning.
- 2026-06-26T17:08:24+07:00 - Added a small inline CSS guard so the Shape
  exercise is not constrained by modal viewport max-height when embedded in a
  Learning Lab lesson. Re-ran `npm run verify`: typecheck, 75 tests, and
  production build passed; Vite reported the existing large Three.js chunk
  warning.
- 2026-06-26T17:08:58+07:00 - User requested a follow-up: restore the Workspace
  exercise select UI, show a popup/panel when an exercise is selected, and open
  Learning Lab in a new tab rather than navigating the current visualization
  page. Verification is intentionally left to the requester for this follow-up.
- 2026-06-26T17:11:14+07:00 - Implemented the follow-up: restored
  `ExerciseLauncher` to select UI, changed `Canvas3D` to show a Learning handoff
  panel with a new-tab action, removed direct current-page navigation, and
  updated the Learning Lab wiki note. Per user request, no test/build/dev
  command was run for this follow-up.
- 2026-06-26T17:22:38+07:00 - User requested reducing the handoff from two
  clicks to one: hovering/focusing the exercise select should show the Learning
  handoff panel immediately, then the user only clicks the new-tab action.
- 2026-06-26T17:23:25+07:00 - Implemented hover/focus preview for the exercise
  select handoff: the first approved practice target opens the Learning panel on
  hover/focus, while selecting an option can still switch the target. Updated the
  wiki note. Per user request, no test/build/dev command was run.
- 2026-06-26T17:24:28+07:00 - User requested moving the hover trigger from the
  whole select to each exercise option row, adding a `>` affordance at the end
  of every option, and showing the Learning handoff panel beside that option
  area.
- 2026-06-26T17:25:21+07:00 - Implemented per-option hover/focus handoff rows
  with trailing chevrons, moved the Learning panel beside the exercise control
  area, and updated the wiki note. Per user request, no test/build/dev command
  was run.
- 2026-06-26T17:26:11+07:00 - User clarified the control should still look and
  behave like a dropdown: open the dropdown, hover an exercise name, then show
  the new-tab Learning panel.
- 2026-06-26T17:27:17+07:00 - Reworked the exercise affordance into a custom
  dropdown-style select so individual option hover/focus can show the Learning
  handoff panel while each option keeps a trailing chevron. Updated the wiki
  wording. Per user request, no test/build/dev command was run.
- 2026-06-26T17:27:36+07:00 - User requested removing the Learning panel close
  button and auto-dismissing the panel when the pointer leaves it.
- 2026-06-26T17:28:36+07:00 - Removed the Learning handoff panel close button,
  added auto-dismiss on pointer leave, removed the unused close localization
  string, and updated the wiki note. Per user request, no test/build/dev command
  was run.
- 2026-06-26T17:28:36+07:00 - User pointed out the panel must align with the
  hovered option's trailing `>` affordance rather than appearing in empty space.
- 2026-06-26T17:29:48+07:00 - Aligned the handoff panel from the hovered/focused
  option row's bounding box and made both hover and click pass the specific
  option's exercise id into the Learning Lab target resolver so `Open new tab`
  always uses the matching practice route. Per user request, no test/build/dev
  command was run.
- 2026-06-26T17:30:40+07:00 - User reported other panels still overlay the
  Learning handoff panel.
- 2026-06-26T17:31:11+07:00 - Raised the exercise dropdown and Learning handoff
  panel to `z-[150]`, above ordinary canvas/app overlays and below export modal
  surfaces, and updated the wiki note. Per user request, no test/build/dev
  command was run.
- 2026-06-26T17:32:32+07:00 - Portaled the Learning handoff panel to
  `document.body`, raised it to `z-[190]`, and clamped its fixed position from
  the hovered option row so sibling workspace/bottom panels cannot overlay it.
  Updated the wiki note. Per user request, no test/build/dev command was run.
- 2026-06-26T17:33:24+07:00 - User showed new tabs opening `/learning/...`
  directly and rendering Landing because the app uses `HashRouter`; update the
  new-tab action to open `/#/learning/...` hash URLs for the matching practice.
- 2026-06-26T17:38:35+07:00 - Reviewed the Workspace dropdown handoff,
  HashRouter new-tab URLs, inline Learning Lab practice, stale popup state,
  overlay/focus behavior, accessibility surface, and TypeScript types.
- 2026-06-26T17:38:35+07:00 - Moved HashRouter URL generation into
  `src/lib/appRoutes.ts`, reused it from the handoff panel, and added a route
  test for the expected `/#/learning/...` practice URL.
- 2026-06-26T17:38:35+07:00 - `npm run verify` passed: typecheck, 76 tests, and
  production build. Vite reported the existing large Three.js chunk warning.
- 2026-06-26T17:46:37+07:00 - Reduced review churn by reusing the exercise
  option label helper from `ExerciseLauncher` in `Canvas3D` and compacting this
  execution log. Re-ran `npm run verify`: typecheck, 76 tests, and production
  build passed with the existing large Three.js chunk warning.

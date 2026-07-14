---
title: UI conventions and lucide icons
status: done
created: 2026-06-26T14:43:52+07:00
updated: 2026-06-26T15:14:12+07:00
author: Codex - nmkhiem
task: "standardize active UI conventions and common action icons across Learning Lab, Landing, and TorchViz workspace"
supersedes:
  - docs/plans/2026-06-21-landing-ui-iteration.md
  - docs/plans/2026-06-25-learning-lab-domain-refactor.md
---

# Goal

Standardize active UI controls so future contributors share one convention for
Learning Lab button/radius classes and common app action icons.

Success means:

- Learning Lab exposes semantic UI helpers for colors, radius, surfaces, and
  button variants from `src/components/learning/theme.ts`.
- Existing active Learning Lab controls use those helpers where practical.
- Common UI action/status icons use `lucide-react` instead of inline SVG or
  ASCII placeholders where a lucide equivalent exists.
- Language toggles stay direct two-mode controls and render only the
  `Languages` icon, with no visible `EN`/`VI` text.
- SVGs that are visual content remain unchanged.
- The convention is documented in `wiki/concepts/learning-lab.md`
  instead of a new long-lived docs page.

# Context Read

- `docs/WORKFLOW.md` defines the mandatory plan-before-edit workflow.
- `CLAUDE.md` defines branch and architecture constraints.
- `docs/plans/2026-06-21-learning-lab-refactor.md` defines Learning Lab as an
  active app surface and preserves the existing workspace boundary.
- `docs/plans/2026-06-21-landing-ui-iteration.md` owns Landing visual history.
- `wiki/concepts/learning-lab.md` owns Learning Lab docs and is the
  existing place for UI convention notes.
- `src/components/learning/theme.ts` owns Learning Lab semantic color classes
  and is the right place for Learning Lab UI helpers.
- `src/lib/svgExport.ts` emits exported SVG output and must remain unchanged.

# Decisions

- Keep `src/components/learning/theme.ts` as the Learning Lab convention source
  for this phase.
- Use semantic helpers instead of adding a component library.
- Use these Learning Lab radius conventions:
  - `icon`: `rounded-lg`
  - `button`: `rounded-lg`
  - `card`: `rounded-xl`
  - `panel`: `rounded-xl`
  - `pill`: `rounded-full`
  - edge helpers for the existing sidebar/header shapes
- Use Learning Lab button variants:
  - `primary`
  - `secondary`
  - `ghost`
  - `icon`
  - `nav`
  - `segmented`
- Use `lucide-react` for normal UI action/status icons across active React UI.
- Prefer direct named lucide icons:
  - `Languages` icon-only for direct language toggles.
  - `PanelLeft` for sidebar open/close.
  - `ArrowRight` for open/start/enter actions.
  - `ArrowLeftToLine` for Back to landing.
  - `ChevronDown` and `Check` for dropdowns.
  - `Sun` and `Moon` for theme switching.
  - `Play`, `Pause`, `SkipBack`, and `SkipForward` for playback/demo controls.
  - `Eye`, `Info`, `CircleQuestionMark`, `Download`, `Image`, `FileDown`, `X`,
    `RefreshCcw`, `Layers`, `Plus`, `Minus`, `CircleAlert`, `CheckCircle`, and
    `CircleX` where they match existing actions.
- Keep SVGs that are the content itself:
  - Landing ReLU graph and route-line visualization.
  - Exercise/math graphs and generated SVG export output.
  - Three.js/canvas geometry or custom non-icon visualizations.
- Do not run test/build/verify unless the requester explicitly asks. Use
  `git diff --check` and targeted `rg` scans only.

# Implementation Summary

- Added `lucide-react` as a dependency through npm, updating both
  `package.json` and `package-lock.json`.
- Added Learning Lab semantic UI helpers in
  `src/components/learning/theme.ts`.
- Refactored Learning Lab controls, sidebar, cards, lesson/detail views,
  review, and practice renderers to use the new helpers where low-risk.
- Moved the sidebar toggle into the Learning Lab brand row, kept collapsed `TV`
  hover/focus open behavior in-place, and moved Back to landing to the bottom of
  the left panel.
- Migrated common action/status icons to `lucide-react` across Landing,
  Workspace header, canvas controls, export/help modals, MNIST demo controls,
  and exercise modal/status controls.
- Standardized open/start/enter affordances on `ArrowRight`, Back to landing on
  `ArrowLeftToLine`, and language toggles on icon-only `Languages`.
- Updated `wiki/concepts/learning-lab.md` with UI and icon
  conventions plus the SVG exception rule.

# Out of Scope

- No app-wide component library.
- No Tailwind config changes.
- No canvas/rendering color migration.
- No conversion of generated SVG export output, Landing preview visuals,
  exercise diagrams, operation-effect visualizations, or Three.js/canvas
  geometry.
- No routing, learning content, exercise logic, Pyodide, torchstub, IR, layout,
  or Canvas3D behavior changes.
- No test/build/verify run unless explicitly requested.

# Execution Log

- 2026-06-26T14:43:52+07:00 - Plan work started after reading workflow,
  Learning Lab scaffold/orientation docs, current theme tokens, and active
  component usage.
- 2026-06-26T14:44:54+07:00 - UI conventions plan approved by requester.
- 2026-06-26T14:48:32+07:00 - Added Learning Lab semantic radius, surface, and
  button helpers; refactored active Learning Lab controls to consume them; ran
  `git diff --check` and targeted `rg` scans only.
- 2026-06-26T14:51:22+07:00 - Learning Lab lucide icon pass approved by
  requester.
- 2026-06-26T14:53:14+07:00 - Added `lucide-react`; replaced Learning Lab
  inline UI SVGs with `Search`, `Sun`, `Moon`, `PanelLeft`, and
  `ArrowLeftToLine`; documented the convention.
- 2026-06-26T14:57:02+07:00 - App-wide lucide icon pass approved by requester.
- 2026-06-26T15:03:00+07:00 - Migrated app UI action/status icons to
  `lucide-react` across Landing, Workspace header, canvas controls, modals,
  MNIST demo controls, and exercise modal/status controls; left SVG content in
  place for generated exports and visual diagrams.
- 2026-06-26T15:07:27+07:00 - Standardized open/start affordances on
  `ArrowRight` and Back to landing on `ArrowLeftToLine`.
- 2026-06-26T15:09:21+07:00 - Replaced Landing and Workspace language menus
  with direct two-mode toggle buttons, matching Learning Lab.
- 2026-06-26T15:11:57+07:00 - Restored the `Languages` icon on Landing and
  Workspace language toggles while keeping direct two-mode behavior.
- 2026-06-26T15:14:12+07:00 - Removed visible `EN`/`VI` labels from Landing,
  Workspace, and Learning Lab language toggles; each control now keeps only the
  `Languages` icon while preserving direct two-mode behavior.
- 2026-06-26T15:14:12+07:00 - Verification remained intentionally narrow per
  requester instruction: ran `git diff --check` and targeted `rg` scans; did
  not run tests, build, typecheck, or `npm run verify`.

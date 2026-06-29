---
title: Landing and Learning Lab UI Cleanup
status: done
created: 2026-06-29T12:28:53+07:00
updated: 2026-06-29T14:18:00+07:00
author: Codex
task: "Compact record for the June 29 Landing, Learning Lab, and localization UI cleanup."
supersedes:
  - docs/plans/2026-06-21-landing-ui-iteration.md
  - docs/plans/2026-06-28-learning-lab-course-pages.md
---

# Goal

Polish the active Landing and Learning Lab UI while consolidating user-facing
copy into `src/lib/localization.ts`.

# Scope

- Landing: quieter first screen, clearer Workspace/Learning Lab cards, responsive
  route lines, reduced-motion handling.
- Learning Lab: shallow sidebar with Home plus top-level domains; TorchViz logo
  returns to Landing; `/learning` Home is a compact text-focused project intro.
- Localization: move hardcoded course-page, exercise, language-toggle, tooltip,
  aria-label, hint, and status text into the existing localization system.

# Decisions

- Keep one PR documentation surface for this batch: this plan plus existing wiki
  notes only.
- Do not create new docs pages.
- Keep English technical terms unchanged in Vietnamese copy, including ReLU,
  MDP, Q-value, GridWorld, tensor, shape, output, kernel, stride, and padding.
- Preserve current routes and app behavior; no new dependencies.

# Changes

- Updated Landing UI in `LandingPage`, `ToolCard`, `LearningCard`, and Landing CSS.
- Updated Learning Lab shell/home/sidebar behavior in `LearningLabView` and
  `DomainCatalog`.
- Added localization keys and rewired `Header`, `LandingPage`,
  `LearningLabHeader`, `DomainCoursePage`, `ValueExercise`, `ShapeExercise`,
  `GridWorldExercise`, and `RLValueExercise`.
- Updated existing Learning Lab wiki notes and log.

# Verification

- `npm run verify` passed: TypeScript, 76 node tests, and Vite production build.
- Build still reports the existing large `three-vendor` chunk warning.

# Execution Log

- 2026-06-29T12:28:53+07:00 - Started Learning Lab sidebar cleanup.
- 2026-06-29T13:06:00+07:00 - Sidebar simplified to Home plus top-level domains;
  TorchViz logo became the Landing return affordance.
- 2026-06-29T13:18:00+07:00 - Landing page redesigned and verified.
- 2026-06-29T13:52:00+07:00 - Learning Lab Home compacted into a text-focused
  project intro.
- 2026-06-29T14:11:59+07:00 - Localization cleanup completed and verified.
- 2026-06-29T14:18:00+07:00 - Consolidated the related plan docs into this compact
  single plan.

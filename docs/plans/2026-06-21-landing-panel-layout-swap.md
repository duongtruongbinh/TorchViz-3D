---
title: Landing Panel Layout Swap
status: executing
created: 2026-06-21T19:39:42+07:00
updated: 2026-06-21T19:40:32+07:00
author: Codex
task: "move the Landing animation panel to the lower-left feature area and move feature/action panels to the right"
supersedes:
  - docs/plans/2026-06-21-landing-hero-flow-logic.md
---

# Goal

Adjust the Landing first screen layout to match design feedback:

- Put the animation panel below the hero copy on the left, where the feature
  panels currently sit.
- Move the feature panels and workspace/Learning Lab panels to the right.
- Preserve the current animation logic, language toggle, Open workspace action,
  disabled Learning Lab state, and workspace behavior.

# Lineage

Supersedes [2026-06-21-landing-hero-flow-logic](./2026-06-21-landing-hero-flow-logic.md).

# Decisions

- Scope edits to `src/components/landing/LandingPage.tsx` unless a small class
  adjustment is strictly needed.
- Do not change animation internals, AppShell, workspace behavior, Learning Lab
  behavior, Pyodide, torchstub, IR/layout, Canvas3D internals, or docs/wiki.
- Per user instruction during visual iteration, do not run tests/build/dev
  server for this UI-only adjustment.

# Phases

## Phase 0 - Approval checkpoint

- Store this plan.
- Wait for explicit approval before source edits.

## Phase 1 - Swap layout

- Change the main Landing grid so the left column contains hero copy followed by
  the animation panel.
- Move stats, ToolCard, and LearningCard into the right column.
- Keep the desktop minimum width behavior and avoid text/card overflow.

# Execution Log

- 2026-06-21T19:39:42+07:00 - Plan created after reading the current Landing
  layout and latest design feedback.
- 2026-06-21T19:40:32+07:00 - User approved immediate implementation.

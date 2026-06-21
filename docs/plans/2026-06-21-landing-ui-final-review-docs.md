---
title: Landing UI Final Review and Docs
status: executing
created: 2026-06-21T20:51:17+07:00
updated: 2026-06-21T20:53:28+07:00
author: Codex
task: "review the finalized Landing Page UI iteration and update docs"
supersedes:
  - docs/plans/2026-06-21-landing-panel-layout-swap.md
---

# Goal

Finalize the Landing Page visual iteration with a code-review pass, fix any
small Landing-only issues found during review, and update the relevant docs so
they describe the active AppShell/Landing behavior accurately.

Success means:

- The Landing Page still opens the existing TorchViz-3D workspace through the
  Workspace card.
- Learning Lab remains disabled/coming soon.
- The bento layout uses a left live graph preview and compact right-side
  Workspace/Learning cards with anchor-based connection lines.
- Docs mention the active Landing/AppShell entry point and the current Landing
  hero/CTA shape without implying Learning Lab is implemented.

# Lineage

Supersedes
[2026-06-21-landing-panel-layout-swap](./2026-06-21-landing-panel-layout-swap.md).

This plan follows the visual-iteration override phase where docs, tests, build,
dev server, and verification were intentionally skipped while the interface was
still changing.

# Review Findings So Far

- The current responsive `h-screen` + one-column bento path may overflow on
  sub-`xl` widths: the preview can consume the available bento height while the
  right-side cards are placed into an additional row, and the page uses
  `overflow-hidden`. If the app still targets desktop-wide layouts, this can be
  handled by restoring a desktop minimum width or by adding explicit responsive
  row sizing.
- Existing docs still describe the Landing/AppShell MVP at a high level, but do
  not mention the finalized bento hero, anchor-based routing lines, or that the
  Landing has been visually promoted from scaffold/MVP to active first screen.
  Per user direction, this should be folded briefly into the existing Learning
  Lab refactor page rather than creating a new Landing docs page.

# Decisions

- Keep code changes scoped to Landing/AppShell-facing files only:
  `src/components/landing/LandingPage.tsx`,
  `src/components/landing/ToolCard.tsx`,
  `src/components/landing/LearningCard.tsx`, and `src/index.css`.
- Do not change Pyodide, torchstub, IR/layout, Canvas3D internals, exercises,
  routing, or Learning Lab runtime logic.
- Treat unrelated dirty files in the worktree as user/pre-existing changes;
  do not revert or overwrite them.
- Do not create a new docs/wiki page for Landing. Future docs work should first
  look for an existing related page and update that page instead of adding a new
  page unnecessarily.
- Fold the Landing Page summary briefly into the existing Learning Lab refactor
  page (`wiki/concepts/learning-lab-refactor.md`) because that page already owns
  the Landing/AppShell/Learning Lab scaffold map.
- Update other existing docs only if they already reference Landing/AppShell and
  would otherwise be stale, such as `docs/ARCHITECTURE.md`, `wiki/architecture.md`,
  `wiki/log.md`, and possibly the README pointer.
- Run verification after code/docs updates unless the user explicitly asks to
  skip it in this finalization phase.

# Phases

## Phase 0 - Approval checkpoint

- Store this plan.
- Wait for explicit approval before editing runtime or docs files.

## Phase 1 - Code review and narrow fixes

- Review Landing/AppShell-facing code for layout regressions, broken
  responsiveness, stale unused copy, accessibility issues, and Learning Lab
  behavior.
- Apply only narrow Landing UI fixes needed by the review.

## Phase 2 - Docs update

- Update the existing Learning Lab refactor page with a concise Landing summary:
  active first screen, bento live preview, Workspace CTA, disabled Learning Lab,
  and anchor-based visual routes.
- Keep any architecture/README/wiki index edits short and pointer-like; avoid
  introducing a separate Landing docs surface.
- Keep future Learning Lab scaffold docs clear that Learning Lab runtime remains
  unavailable.

## Phase 3 - Verification and logs

- Run the narrowest appropriate verification for code changes, preferably
  `npm run verify`.
- Record changed files and verification results in this plan's execution log.
- Mark this plan done when review, docs, and verification are complete.

# Out of Scope

- Implementing Learning Lab.
- Adding routing.
- Changing workspace behavior.
- Modifying Pyodide, torchstub, IR, layout, Canvas3D, exercises, or learning
  logic.
- Broad copy rewrites unrelated to the finalized Landing UI.

# Execution Log

- 2026-06-21T20:51:17+07:00 - Plan created after reading workflow, current
  Landing diffs, existing Landing plans, and the current docs surfaces.
- 2026-06-21T20:53:10+07:00 - Updated draft plan per user direction: related
  Landing docs should be folded into the existing Learning Lab refactor page and
  future docs work should prefer updating relevant existing pages over creating
  unnecessary new pages.
- 2026-06-21T20:53:28+07:00 - User approved the plan; status moved to
  executing.

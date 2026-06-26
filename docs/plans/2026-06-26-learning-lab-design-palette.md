---
title: Learning Lab Design Palette
status: done
created: 2026-06-26T18:15:41+07:00
updated: 2026-06-26T18:20:03+07:00
author: Codex
task: "Create design.md and update Learning Lab colors to match the design palette."
supersedes:
  - docs/plans/2026-06-26-ui-conventions-and-icons.md
---

# Goal

Create a root `design.md` reference from the supplied design-system notes, then
align Learning Lab's active theme colors with the `ice`, `mist`, `deep-blue`,
`ink`, and `action-blue` palette.

# Lineage

Supersedes [2026-06-26-ui-conventions-and-icons](./2026-06-26-ui-conventions-and-icons.md)
for the current Learning Lab theme helper and icon convention boundary.

# Decisions

- Add `design.md` at the repository root as the shared design-system reference.
- Keep Learning Lab color changes centered on
  `src/components/learning/theme.ts`, because active Learning Lab components
  already consume semantic helpers from that file.
- Preserve current layout, routes, icons, lessons, practice logic, and modal
  behavior.
- Keep dark mode available, tuned toward `ink`/`deep-blue`.
- Do not redesign large exercise modals in this pass; they are dense workbench
  surfaces with a larger blast radius.

# Phases

## Phase 0 - Store this plan

- Create this plan and wait for approval.

## Phase 1 - Create design.md

- Add palette, tokens, typography, layout, component, interaction, icon, and
  accessibility guidance from the supplied design-system notes.

## Phase 2 - Update Learning Lab palette

- Update Learning Lab semantic theme helpers for page, sidebar, header,
  surfaces, buttons, nav, status pills, lesson cards, text, and focus rings.
- Prefer exact design-system hex values where Tailwind defaults do not match
  the palette.

## Phase 3 - Verify

- Run `git diff --check`.
- Run `npm run typecheck` because the theme file is TypeScript.
- Record the results in this plan.

# Out of scope

- Landing page palette migration.
- Workspace/editor/canvas palette migration.
- Exercise modal redesign.
- New routes, components, or learning content.

# Execution log

- 2026-06-26T18:15:41+07:00 - Plan created.
- 2026-06-26T18:17:20+07:00 - Plan approved; execution started.
- 2026-06-26T18:20:03+07:00 - Added root `design.md` and updated
  `src/components/learning/theme.ts` so Learning Lab semantic helpers use the
  `ice`, `mist`, `deep-blue`, `ink`, and `action-blue` palette. Verified with
  `git diff --check`, targeted `rg` scans, and `npm run typecheck`.

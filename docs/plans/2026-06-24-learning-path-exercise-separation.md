---
title: Learning Lab Path and Practice Flow
status: done
created: 2026-06-24T13:49:49+07:00
updated: 2026-06-24T15:20:00+07:00
author: nmkhiem
task: "activate Learning Lab as a Path/Review surface with embedded practice while preserving Workspace exercises"
supersedes:
  - docs/plans/2026-06-21-landing-ui-iteration.md
  - docs/plans/2026-06-21-learning-lab-refactor.md
---

# Goal

Activate Learning Lab from Landing as a separate Path/Review experience and let
users complete curated practice without changing the existing Workspace/Demo
exercise flow.

Success means the lab is reachable, lessons are ordered by role/domain, Review
mode can browse the same practice set, and approved practice cards open
interactive exercises backed by existing model builders or dedicated exercise
surfaces.

# Lineage

Supersedes [2026-06-21-landing-ui-iteration](./2026-06-21-landing-ui-iteration.md)
for the active Landing/AppShell boundary.

Supersedes [2026-06-21-learning-lab-refactor](./2026-06-21-learning-lab-refactor.md)
for the Learning Lab scaffold and intended component map.

# Decisions

- Preserve Workspace/Demo exercise behavior and keep existing launchers
  available.
- Keep Learning Lab page state local to the lab; do not add routing,
  persistence, deep links, workspace handoff, or a real UI store yet.
- Keep `src/core/` React-free. Learning content stores IDs, approval metadata,
  and mappings only; representative exercise nodes live in a shared exercise
  adapter instead of the learning content file.
- Store all English/Vietnamese UI copy in `src/lib/localization.ts`.
- Practice cards are available only when `approval.status: approved` and
  `approval.implementedBy` are present. Other cards show "In progress" /
  "Đang hoàn thiện".
- `conv-value` uses `ConvExerciseModal`, not generic `ValueExercise`.
- `linear-value` stays unavailable/in progress until a future approved
  implementation changes its metadata.

# Implementation Summary

- `AppShell` now switches Landing -> Workspace or Landing -> Learning Lab.
- Landing copy and preview labels live in `src/lib/localization.ts`.
- `LearningLabView` owns local Path/Review mode, theme, and selected lesson
  state.
- `LearningLabHeader` exposes Back, Path/Review toggle, theme toggle, and
  language selector.
- `PathMode` presents role -> domain -> lesson flow with static lesson metadata.
- `ReviewMode` browses practice outside the guided order and can return to the
  selected lesson in Path mode.
- `src/core/learningContent.ts` stores static learning roles, lessons, and
  approval metadata.
- A shared exercise adapter builds representative `LayoutNode`s and validates
  them against the existing exercise registry before Learning Lab opens an
  exercise.
- `PracticeSection` gates availability from approval metadata and opens:
  `ShapeExercise` for shape practice, `ConvExerciseModal` for `conv-value`, and
  `ValueExercise` for approved non-convolution value practice.

# Out Of Scope

- Removing, renaming, or relocating current demo exercise files.
- Removing exercise access from the current Workspace/Demo flow.
- Full progress tracking or persistence.
- Deep linking, URL routing, or React Router.
- Automatic Workspace handoff with template loading and node highlighting.
- Changes to Pyodide, torchstub, IR tracing, layout, Canvas3D internals, or
  forward-pass animation internals.
- New exercise families beyond those already represented by existing exercise
  model builders or approved dedicated modals.

# Verification

- 2026-06-24T14:02:22+07:00 - `npm run verify` passed: typecheck, 62 tests, and
  production build. Vite reported the existing large Three.js chunk warning.
- 2026-06-24T14:26:15+07:00 - `npm run verify` passed: typecheck, 63 tests, and
  production build. Vite reported the existing large chunk warning.
- 2026-06-24 - Final review pass: `npm run verify` passed with 63 tests and
  production build. Vite still warned about large chunks/assets.

# Execution Log

- 2026-06-24T13:49:49+07:00 - Draft plan created from chat brainstorm after
  reading the required workflow, architecture briefing, Learning Lab scaffold,
  Landing UI plan, wiki scaffold page, and current exercise registry/types.
- 2026-06-24T13:55:00+07:00 - User approved implementation in chat with
  "implement"; plan moved directly to executing for the approved work.
- 2026-06-24T14:02:22+07:00 - Implemented active Learning Lab navigation from
  Landing through `AppShell`, converted the Learning Lab card from coming-soon
  to an entry action, and preserved the existing Workspace entry flow.
- 2026-06-24T14:02:22+07:00 - Added React-free learning domain types plus
  static path content in `src/core/types.ts` and `src/core/learningContent.ts`.
- 2026-06-24T14:02:22+07:00 - Implemented `src/components/learning/*` and shared
  section components as Path/Review UI over existing exercise IDs/concepts. This
  phase displays practice references rather than moving or embedding the current
  demo exercise modals.
- 2026-06-24T14:02:22+07:00 - Updated `docs/ARCHITECTURE.md`,
  `wiki/concepts/learning-lab-refactor.md`, `wiki/concepts/index.md`, and
  `wiki/log.md` to reflect the active Learning Path boundary.
- 2026-06-24T14:26:15+07:00 - Extended practice metadata with fixtures and
  switched practice cards from reference-only to interactive exercise launchers.
- 2026-06-24T14:26:15+07:00 - Added availability gating from approval metadata:
  approved/implemented cards open exercises; unavailable cards show in-progress
  copy.
- 2026-06-24T14:26:15+07:00 - Kept `conv-value` on `ConvExerciseModal` and kept
  `linear-value` unavailable.
- 2026-06-24 - Final review fixed a `PathMode` type issue, exposed Review mode
  through the header toggle, passed the Learning Lab theme into Review practice,
  and moved Landing copy into localization.
- 2026-06-24T15:05:00+07:00 - Consolidated the separate embedded-practice plan
  into this shorter Learning Lab / Learning Path plan and removed the duplicate
  plan file.
- 2026-06-24T15:20:00+07:00 - Refactor approved in chat: move representative
  node fixtures out of `learningContent.ts` and into a shared exercise adapter
  so Learning Lab content remains metadata-only and reuses the Workspace
  exercise registry boundary.

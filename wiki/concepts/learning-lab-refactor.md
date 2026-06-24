---
title: Learning Lab Refactor
type: Active Subsystem
updated: 2026-06-24
---

# Learning Lab Refactor

This page documents the Landing Page and Learning Lab refactor. The original
scaffold source plan is
[docs/plans/2026-06-21-learning-lab-refactor.md](../../docs/plans/2026-06-21-learning-lab-refactor.md).
Landing visual iteration history is consolidated in
[docs/plans/2026-06-21-landing-ui-iteration.md](../../docs/plans/2026-06-21-landing-ui-iteration.md).
The Learning Path activation plan is
[docs/plans/2026-06-24-learning-path-exercise-separation.md](../../docs/plans/2026-06-24-learning-path-exercise-separation.md).

## Status

MVP 1 makes the Landing Page and AppShell active runtime behavior. The app opens
on Landing, the active TorchViz-3D card enters the existing workspace, and the
workspace header can return to Landing.

Landing includes the same language selector behavior as the workspace header;
both are backed by the global `useStore` language state.

The active Landing first screen is a viewport-fit bento composition: top intro
copy, a left "live graph preview" animation that flows through model stages, and
compact right-side cards for Workspace, Learning Lab, and Reinforcement Learning.
Connection lines are computed from real DOM anchors between the final classifier
block and the main cards; the Workspace route enters the editor/canvas flow and
the Learning Lab route enters the guided deep-learning flow.

Learning Lab is active as a separate full-screen view. It currently provides:

- A guided Path mode backed by static lesson metadata.
- A Review mode over the same embedded practice set.
- A header toggle between Path and Review, with Review lesson links returning
  users to the selected lesson in Path mode.
- Practice cards that use a shared exercise adapter to build representative
  `LayoutNode`s, validate them against the existing exercise registry, and reuse
  existing shape/value exercise model builders.

Active behavior remains unchanged:

- The existing workspace still uses the current editor, canvas, inspector, and
  bottom tabs after entering from Landing.
- Existing editor, canvas, inspector, bottom tabs, exercises, and MNIST demo
  behavior are not modified.
- No router, persistence, deep workspace handoff, answer-checking logic, or real
  UI store behavior is implemented in this phase.

## Scaffold Map

| Path | Intended future responsibility |
|---|---|
| `src/components/AppShell.tsx` | MVP 1 root view switcher for Landing and TorchViz workspace. |
| `src/components/landing/LandingPage.tsx` | Active Landing first screen with intro copy, live graph preview, Workspace CTA, and Learning Lab CTA. |
| `src/components/landing/ToolCard.tsx` | Active card for entering the existing TorchViz-3D workspace. |
| `src/components/landing/LearningCard.tsx` | Reused landing card for entering guided surfaces. |
| `src/components/learning/LearningLabView.tsx` | Full-screen Learning Lab surface and local mode/lesson state. |
| `src/components/learning/LearningLabHeader.tsx` | Lab header with Back, Path/Review mode toggle, and Workspace action. |
| `src/components/learning/ReviewMode.tsx` | Free-review browser over practice references. |
| `src/components/learning/ReviewPicker.tsx` | Selector for practice kind. |
| `src/components/learning/PathMode.tsx` | Guided path mode. |
| `src/components/learning/PathMap.tsx` | Roadmap/list of lessons. |
| `src/components/learning/PathNode.tsx` | Lesson node with available/next/preview states. |
| `src/components/learning/LessonDetail.tsx` | Inline lesson detail. |
| `src/components/learning/shared/TheorySection.tsx` | Shared theory renderer. |
| `src/components/learning/shared/PracticeSection.tsx` | Shared inline practice renderer with answer checking, reset, and hints. |
| `src/components/learning/shared/HintSection.tsx` | Shared hint renderer. |
| `src/core/types.ts` | Pure learning-domain types. |
| `src/core/learningContent.ts` | Static Learning Path content, role/domain mappings, practice IDs, and approval metadata. |
| `src/components/exercises/learningPracticeAdapter.ts` | Representative practice-node adapter that bridges Learning Lab metadata to existing exercise registry/model builders. |
| `src/core/answerCheck.ts` | Future pure answer validation helpers. |
| `src/store/uiStore.ts` | Future UI/page state store. |

## Codex Init Prompt

Codex agents should derive their initial prompt from `CLAUDE.md`, then use this
short prompt for the next implementation phase:

```text
Read docs/WORKFLOW.md, CLAUDE.md, and this wiki page before editing.
Preserve the current TorchViz-3D workspace until an approved plan says otherwise.
Treat Learning Lab as active Path/Review UI backed by static learning content
and embedded practice cards. Reuse existing exercise model builders for tensor
exercises before moving or duplicating exercise UI. AppShell, landing
components, and Learning Lab components are active.
`answerCheck.ts` and `uiStore.ts` remain reserved for later phases. Update
existing relevant docs before creating any new docs page.
```

For small UI, copy, layout, or follow-up changes, update the existing page that
already owns the topic. Create a new page only when the work is substantially
different in scope or needs its own long-lived reference surface.

## Invariants

- `src/core/` must remain React-free when real logic is added.
- Learning Lab should reuse existing exercise concepts instead of duplicating
  behavior without a plan.
- Any future page state must not reset the current TorchViz-3D editor/canvas
  state unexpectedly.
- Existing Workspace/Demo exercise entry points must remain available unless a
  later approved plan explicitly changes that behavior.
- Learning Lab practice should stay inline and model-backed; avoid importing
  Workspace modal UI unless a later plan extracts shared presentation pieces.
- Practice cards are available only when `approval.status` is `approved` and
  `approval.implementedBy` is set. Unapproved or unavailable items must show
  "In progress" / "Đang hoàn thiện".
- `conv-value` uses the dedicated `ConvExerciseModal`; generic numeric
  `ValueExercise` remains scoped to approved non-convolution value exercises.
- `linear-value` is currently unavailable/in progress until a later approved
  implementation changes its approval metadata.

## Related Pages

- [architecture](../architecture.md)
- [state-store](state-store.md)
- [rendering](rendering.md)
- [reference/gotchas](../reference/gotchas.md)

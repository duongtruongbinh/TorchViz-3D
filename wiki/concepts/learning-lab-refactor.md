---
title: Learning Lab Refactor Scaffold
type: Planned Subsystem
updated: 2026-06-21
---

# Learning Lab Refactor Scaffold

This page documents the Landing Page and Learning Lab refactor scaffold.
The source plan is
[docs/plans/2026-06-21-learning-lab-refactor.md](../../docs/plans/2026-06-21-learning-lab-refactor.md).

## Status

MVP 1 makes the Landing Page and AppShell active runtime behavior. The app opens
on Landing, the active TorchViz-3D card enters the existing workspace, and the
workspace header can return to Landing.

Landing includes the same language selector behavior as the workspace header;
both are backed by the global `useStore` language state.

The active Landing first screen is a viewport-fit bento composition: top intro
copy, a left "live graph preview" animation that flows through model stages, and
compact right-side cards for Workspace and Learning Lab. Connection lines are
computed from real DOM anchors between the final classifier block and each card;
the Workspace route is visually primary and the Learning Lab route is muted.

Learning Lab remains disabled/coming soon. The Learning Lab component
placeholders, core learning helpers, and `src/store/uiStore.ts` are intentionally
inert.

Active behavior remains unchanged:

- The existing workspace still uses the current editor, canvas, inspector, and
  bottom tabs after entering from Landing.
- Existing editor, canvas, inspector, bottom tabs, exercises, and MNIST demo
  behavior are not modified.
- No router, answer-checking logic, Learning Lab runtime behavior, or real UI
  store behavior is implemented in this MVP.

## Scaffold Map

| Path | Intended future responsibility |
|---|---|
| `src/components/AppShell.tsx` | MVP 1 root view switcher for Landing and TorchViz workspace. |
| `src/components/landing/LandingPage.tsx` | Active Landing first screen with intro copy, live graph preview, Workspace CTA, and disabled Learning Lab card. |
| `src/components/landing/ToolCard.tsx` | Active card for entering the existing TorchViz-3D workspace. |
| `src/components/landing/LearningCard.tsx` | Disabled/coming-soon card for Learning Lab. |
| `src/components/learning/LearningLabView.tsx` | Future full-screen Learning Lab surface. |
| `src/components/learning/LearningLabHeader.tsx` | Future lab header with Back, mode toggle, and later role switcher. |
| `src/components/learning/ReviewMode.tsx` | Future free-review practice mode. |
| `src/components/learning/ReviewPicker.tsx` | Future selector for concept + exercise type. |
| `src/components/learning/PathMode.tsx` | Future guided path mode. |
| `src/components/learning/PathMap.tsx` | Future roadmap/list of lessons. |
| `src/components/learning/PathNode.tsx` | Future lesson node with available/done/in-progress/unavailable states. |
| `src/components/learning/LessonDetail.tsx` | Future inline lesson detail. |
| `src/components/learning/shared/TheorySection.tsx` | Future shared theory renderer. |
| `src/components/learning/shared/PracticeSection.tsx` | Future shared practice renderer. |
| `src/components/learning/shared/HintSection.tsx` | Future shared progressive hint renderer. |
| `src/core/types.ts` | Future pure learning-domain types. |
| `src/core/answerCheck.ts` | Future pure answer validation helpers. |
| `src/store/uiStore.ts` | Future UI/page state store. |

## Codex Init Prompt

Codex agents should derive their initial prompt from `CLAUDE.md`, then use this
short prompt for the next implementation phase:

```text
Read docs/WORKFLOW.md, CLAUDE.md, and this wiki page before editing.
Preserve the current TorchViz-3D workspace until an approved plan says otherwise.
Treat Learning Lab files, learning core helpers, and uiStore as inert scaffold
unless the current task explicitly implements a phase. AppShell and landing
components are active; update this existing page for related Landing docs before
creating any new docs page.
```

## Invariants

- Learning Lab scaffold files can be imported only in a later approved
  implementation PR.
- `src/core/` must remain React-free when real logic is added.
- Learning Lab should reuse existing exercise concepts instead of duplicating
  behavior without a plan.
- Any future page state must not reset the current TorchViz-3D editor/canvas
  state unexpectedly.

## Related Pages

- [architecture](../architecture.md)
- [state-store](state-store.md)
- [rendering](rendering.md)
- [reference/gotchas](../reference/gotchas.md)

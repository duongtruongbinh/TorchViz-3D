---
title: Learning Lab Refactor Scaffold
type: Planned Subsystem
updated: 2026-06-21
---

# Learning Lab Refactor Scaffold

This page documents the scaffold-only Landing Page and Learning Lab refactor.
The source plan is
[docs/plans/2026-06-21-learning-lab-refactor.md](../../docs/plans/2026-06-21-learning-lab-refactor.md).

## Status

The current PR creates placeholders only. The files are intentionally inert and
are not imported by `App.tsx`.

Active behavior remains unchanged:

- The existing workspace still opens through the current `App.tsx`.
- Existing editor, canvas, inspector, bottom tabs, exercises, and MNIST demo
  behavior are not modified.
- No router, page switcher, answer-checking logic, or real UI store behavior is
  implemented in this scaffold.

## Scaffold Map

| Path | Intended future responsibility |
|---|---|
| `src/components/AppShell.tsx` | Future root view switcher for Landing, TorchViz workspace, and Learning Lab. |
| `src/components/landing/LandingPage.tsx` | Future entry screen with Tool and Learning Lab choices. |
| `src/components/landing/ToolCard.tsx` | Future card for entering the existing TorchViz-3D workspace. |
| `src/components/landing/LearningCard.tsx` | Future card for entering Learning Lab. |
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
Treat the Learning Lab files as inert scaffold unless the current task explicitly
implements a phase. Do not import AppShell, landing, learning, or uiStore files
into the running app without a matching plan and verification.
```

## Invariants

- Scaffold files can be imported only in a later approved implementation PR.
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

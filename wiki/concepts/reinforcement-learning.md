---
title: Reinforcement Learning
type: Active Subsystem
updated: 2026-06-25
---

# Reinforcement Learning

This page documents the Reinforcement Learning surface. It is a sibling
top-level AppShell surface, separate from the Learning Lab subsystem.

The activation history is captured in:

- [docs/plans/2026-06-24-reinforcement-learning-track-ui.md](../../docs/plans/2026-06-24-reinforcement-learning-track-ui.md)

## Status

Reinforcement Learning is active as a separate full-screen view reachable from
Landing. It currently provides:

- A Guide mode that introduces the RL learning loop and links into lessons.
- A Path mode backed by static track, domain, and lesson metadata.
- A 3D Visualization placeholder mode for the future visual surface.
- A populated Reinforcement Learning track for MDP, Bellman, Q-Learning, and
  SARSA practice.
- A Robot Learning placeholder track with no domains or lessons yet.
- MDP component identification practice.
- Bellman/Q-table value practice.
- Compact GridWorld single-step Q-Learning and SARSA practice.
- Dedicated RL exercise fixtures under `src/components/exercises/` instead of
  forcing non-tensor concepts into the existing `LayoutNode` registry.

Active behavior remains scoped:

- Workspace behavior is unchanged.
- Learning Lab behavior is unchanged.
- There is no router, persistence, progress tracking, deep linking, or
  workspace handoff for this surface.

## Runtime Boundary

```text
LandingPage
  -> AppShell view: reinforcement-learning
    -> src/components/reinforcement_learning/View.tsx
      -> Header
      -> GuideMode
      -> PathMode
      -> Visualization 3D placeholder
```

The guide and path UIs read static role/domain/lesson metadata from
`src/core/rlLearningContent.ts`. Users choose a learning track, then a focus
area, then a lesson sequence. Practice cards use deterministic fixtures from
`src/components/exercises/rlPracticeAdapter.ts`.

The current track split is:

| Track | Content |
|---|---|
| Reinforcement Learning | Active RL foundations path with tabular control and policy behavior focus areas. |
| Robot Learning | Empty placeholder for future embodied-agent and robotics lessons. |

## Surface Map

| Path | Responsibility |
|---|---|
| `src/components/reinforcement_learning/View.tsx` | Full-screen Reinforcement Learning surface and local mode/lesson state. |
| `src/components/reinforcement_learning/Header.tsx` | Header with Back, Guide/Path/3D mode toggle, sidebar, theme, language, and RL logo controls. |
| `src/components/reinforcement_learning/GuideMode.tsx` | Orientation mode with learning steps, core concepts, and lesson entry points. |
| `src/components/reinforcement_learning/PathMode.tsx` | Guided reinforcement path mode. |
| `src/components/reinforcement_learning/PathMap.tsx` | Reinforcement roadmap/list of lessons. |
| `src/components/reinforcement_learning/PathNode.tsx` | Reinforcement lesson node with available/next/preview states. |
| `src/components/reinforcement_learning/LessonDetail.tsx` | Inline reinforcement lesson detail. |
| `src/components/reinforcement_learning/PracticeSection.tsx` | Inline reinforcement practice renderer. |
| `src/core/rlTypes.ts` | Pure RL learning-domain types. |
| `src/core/rlLearningContent.ts` | Static RL role/domain/lesson list, practice IDs, and approval metadata. |
| `src/components/exercises/rlPracticeAdapter.ts` | Deterministic RL practice fixtures and approval helpers. |
| `src/components/exercises/RLShapeExercise.tsx` | MDP component identification exercise. |
| `src/components/exercises/RLValueExercise.tsx` | Bellman/Q-table value exercise. |
| `src/components/exercises/GridWorldExercise.tsx` | Single-step Q-Learning/SARSA GridWorld exercise. |

## Invariants

- `src/core/` must remain React-free.
- Reinforcement Learning is a sibling surface, not a Learning Lab mode.
- Reinforcement Learning Path mode should preserve the track -> focus -> lesson
  flow unless a later approved plan changes the learning model.
- Reinforcement Learning may use dedicated exercise fixtures for RL concepts
  that are not tensor-shape or tensor-value exercises.
- Practice cards are available only when `approval.status` is `approved` and
  `approval.implementedBy` is set.
- Unapproved or unavailable items must show "In progress" / "Đang hoàn thiện".
- Existing Workspace, Learning Lab, and Forward Pass exercise entry points must
  remain available unless a later approved plan explicitly changes them.

## Related Pages

- [learning-lab-refactor](learning-lab-refactor.md)
- [state-store](state-store.md)
- [forward-pass](forward-pass.md)
- [reference/gotchas](../reference/gotchas.md)

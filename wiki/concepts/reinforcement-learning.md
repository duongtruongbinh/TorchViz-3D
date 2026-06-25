---
title: Reinforcement Learning
type: Active Learning Lab Domain
updated: 2026-06-26
---

# Reinforcement Learning

This page documents the Reinforcement Learning domain inside Learning Lab.
Reinforcement Learning is no longer a sibling top-level AppShell surface.

The implementation history is captured in:

- [docs/plans/2026-06-24-reinforcement-learning-track-ui.md](../../docs/plans/2026-06-24-reinforcement-learning-track-ui.md)
- [docs/plans/2026-06-25-learning-lab-domain-refactor.md](../../docs/plans/2026-06-25-learning-lab-domain-refactor.md)

## Status

Reinforcement Learning is active as a Learning Lab domain reachable through:

```text
/#/learning/reinforcement-learning
/#/learning/reinforcement-learning/:trackId
```

Legacy routes redirect into the domain:

```text
/#/reinforcement-learning
/#/reinforcement-learning/roadmap/:trackId
```

The domain currently provides:

- Tabular Control and Policy Behavior tracks.
- MDP, Bellman, Q-Learning, and SARSA lessons.
- MDP component identification practice.
- Bellman/Q-table value practice.
- Compact GridWorld single-step Q-Learning and SARSA practice.
- A Robot Learning placeholder exists as a separate Learning Lab domain.
- Dedicated RL exercise fixtures instead of forcing non-tensor concepts into the
  tensor `LayoutNode` exercise registry.

Active behavior remains scoped:

- Workspace behavior is unchanged.
- Forward Pass demo behavior is unchanged.
- Learning Lab is the learning container for RL and tensor domains.
- There is no persistence, progress tracking, workspace handoff, or full RL
  simulation.

## Runtime Boundary

```text
LandingPage
  -> AppShell route: /learning
      -> LearningLabView
          -> domain catalog
          -> reinforcement-learning domain
          -> track/topic
          -> lesson detail
          -> shared PracticeSection
              -> ReinforcementPracticeRenderer
              -> RLShapeExercise / RLValueExercise / GridWorldExercise
```

Learning catalog metadata lives in `src/core/learning/content/*` with pure
selectors in `src/core/learning/selectors.ts`. RL practice fixtures live in
`src/components/learning/practice/adapters/reinforcementPracticeAdapter.ts`.

## Domain Map

| Path | Responsibility |
|---|---|
| `src/core/learning/content/reinforcementLearning.ts` | RL domain, tracks, lessons, practice IDs, and approval metadata. |
| `src/core/learning/types.ts` | Unified React-free Learning Lab catalog types. |
| `src/core/learning/selectors.ts` | Pure catalog lookup helpers. |
| `src/components/learning/LearningLabView.tsx` | Route-aware Learning Lab shell containing the RL domain. |
| `src/components/learning/lesson/LessonDetail.tsx` | Shared lesson renderer for RL and tensor domains. |
| `src/components/learning/practice/ReinforcementPracticeRenderer.tsx` | RL practice dispatcher. |
| `src/components/learning/practice/adapters/reinforcementPracticeAdapter.ts` | Deterministic RL fixtures and numeric answer helper. |
| `src/components/exercises/RLShapeExercise.tsx` | MDP component identification exercise. |
| `src/components/exercises/RLValueExercise.tsx` | Bellman/Q-table value exercise. |
| `src/components/exercises/GridWorldExercise.tsx` | Single-step Q-Learning/SARSA GridWorld exercise. |

## Invariants

- `src/core/` must remain React-free.
- Reinforcement Learning is a Learning Lab domain, not a top-level AppShell
  surface.
- RL practice may use dedicated fixtures for concepts that are not
  tensor-shape or tensor-value exercises.
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

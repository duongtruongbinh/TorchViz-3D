---
title: Reinforcement Learning
type: Placeholder Learning Lab Domain
updated: 2026-07-14
---

# Reinforcement Learning

Reinforcement Learning is a navigable placeholder domain inside Learning Lab,
not a sibling AppShell surface.

## Status

The domain is reachable through:

```text
/#/learning/reinforcement-learning
/#/learning/reinforcement-learning/:trackId
```

Legacy routes still redirect into the domain:

```text
/#/reinforcement-learning
/#/reinforcement-learning/roadmap/:trackId
```

Its typed TOC preserves track order, lesson nodes, localized navigation
metadata, statuses, and six route aliases. None of its 27 nodes has authored
MDX. Every RL lesson therefore renders the shared localized content-in-progress
state.

The former MDP, Bellman/Q-table, Q-Learning, SARSA, and GridWorld practice
payloads and renderers have been removed. Learning Lab has no RL practice
registry, Review mode, or Workspace practice handoff.

## Runtime Boundary

```text
LandingPage
  -> /learning
  -> LearningLabView
  -> reinforcement-learning TOC
  -> React-free learningCatalog
  -> shared domain/track/lesson placeholder UI
```

## Domain Map

| Path | Responsibility |
|---|---|
| `src/content/learning/reinforcement-learning/table-of-contents.ts` | RL metadata, order, status, and route aliases. |
| `src/core/learning/content/index.ts` | Stable React-free catalog materialization. |
| `src/core/learning/types.ts` | Shared React-free Learning Lab contracts. |
| `src/core/learning/selectors.ts` | Pure catalog lookup helpers. |
| `src/components/learning/LearningLabView.tsx` | Route-aware Learning Lab shell. |
| `src/components/learning/lesson/LessonDetail.tsx` | Shared missing-content presentation. |

## Invariants

- Reinforcement Learning remains a Learning Lab domain.
- Existing canonical and legacy alias routes remain valid.
- RL lesson bodies remain placeholders until locale-specific MDX is authored
  and approved.
- RL catalog metadata belongs in its TOC, not `localization.ts`.
- `src/core/` remains React-free.

## Related Pages

- [learning-lab](learning-lab.md)
- [state-store](state-store.md)
- [forward-pass](forward-pass.md)
- [reference/gotchas](../reference/gotchas.md)

---
title: Learning Lab Domain Refactor
status: done
created: 2026-06-25T23:58:21+07:00
updated: 2026-06-26T00:45:00+07:00
author: Codex
task: "Refactor Reinforcement Learning from a top-level surface into a Learning Lab domain alongside fundamentals, CV, NLP, and future Robot Learning."
supersedes:
  - docs/plans/2026-06-24-learning-path-exercise-separation.md
  - docs/plans/2026-06-24-reinforcement-learning-track-ui.md
  - docs/plans/2026-06-21-learning-lab-refactor.md
---

# Goal

Make Learning Lab the single learning container. Reinforcement Learning should
be a Learning Lab domain, not a sibling AppShell surface, while preserving the
existing Workspace, Forward Pass demo, exercise entry points, and current RL
practice behavior for MDP, Bellman/Q-table, Q-Learning, SARSA, and GridWorld.

Success means:

- Landing and AppShell no longer present Reinforcement Learning as a standalone
  product surface.
- Learning Lab navigation follows `domain -> track/topic -> lesson`.
- Each lesson can hold theory now, plus future code walkthrough metadata,
  interactive practice, and future hand-calculation practice.
- Existing tensor-shape/value practice, RL MDP/Bellman/Q-table/GridWorld
  practice, Workspace entry, Forward Pass demo, and existing exercise entry
  points continue to work.
- `src/core/` remains React-free.
- Active docs no longer assert the obsolete invariant that RL is a sibling
  surface outside Learning Lab.

The resulting model should read as:

```text
Learning Lab -> domain -> track/topic -> lesson -> theory/code/practice
```

# Lineage

Supersedes [2026-06-24-learning-path-exercise-separation](./2026-06-24-learning-path-exercise-separation.md)
for the active Learning Lab Path/Review implementation and exercise adapter
boundary.

Supersedes [2026-06-24-reinforcement-learning-track-ui](./2026-06-24-reinforcement-learning-track-ui.md)
for the RL route, RL path UI, deterministic RL fixtures, and docs that currently
state RL is a sibling surface.

Supersedes [2026-06-21-learning-lab-refactor](./2026-06-21-learning-lab-refactor.md)
for the original Learning Lab scaffold and AppShell boundary.

This plan intentionally changes the prior RL decision: Reinforcement Learning
is no longer a top-level sibling surface. The historical plans remain the record
of the old implementation; this plan becomes the current decision point after
approval.

# Context Read

- `docs/WORKFLOW.md`
- `CLAUDE.md`
- `wiki/concepts/learning-lab-refactor.md`
- `wiki/concepts/reinforcement-learning.md`
- `docs/plans/2026-06-21-learning-lab-refactor.md`
- `docs/plans/2026-06-21-landing-ui-iteration.md`
- `docs/plans/2026-06-24-learning-path-exercise-separation.md`
- `docs/plans/2026-06-24-reinforcement-learning-track-ui.md`
- Grep/read pass over:
  - `src/components/learning`
  - `src/components/reinforcement_learning`
  - `src/components/exercises`
  - `src/core`
  - `src/lib/localization.ts`
  - `src/components/AppShell.tsx`

# Current Structure Audit

## AppShell and Landing

- `src/components/AppShell.tsx` imports both `LearningLabView` and
  `ReinforcementLearningView`.
- Routes are:
  - `/` -> `LandingPage`
  - `/workspace` -> existing workspace
  - `/learning` -> `LearningLabView`
  - `/reinforcement-learning` -> `ReinforcementLearningView`
  - `/reinforcement-learning/roadmap/:trackId` -> `ReinforcementLearningView`
- `LandingPage` exposes three right-side cards: Workspace, Learning Lab, and
  Reinforcement Learning. RL has its own route line and callback.
- The Landing RL card should stop representing a separate top-level product
  surface. It should either merge into the Learning Lab card copy or open the
  Learning Lab with the RL domain selected.

## Learning Lab UI

- `src/components/learning/LearningLabView.tsx` owns local mode, theme, and
  selected lesson state.
- `LearningLabHeader.tsx` exposes Back, Path/Review, theme, and language.
- `PathMode.tsx` currently uses `role -> domain -> lesson`. Domains are nested
  under role/persona (`ai-engineer`, `data-scientist`), so domain is not yet the
  primary learning axis.
- `PathMap.tsx` appears stale: it exists and is documented, but the active
  `PathMode.tsx` no longer imports it.
- `LessonDetail.tsx`, `PathNode.tsx`, and `ReviewMode.tsx` are generic in shape
  but hard-code `LearningLesson`, `learningLab` strings, and tensor exercise
  practice refs.
- `PathMap.tsx`, `TheorySection.tsx`, and `HintSection.tsx` are present but
  mostly legacy/underused in the active path.

## Reinforcement Learning UI

- `src/components/reinforcement_learning/*` duplicates much of the Learning Lab
  structure: `View`, `Header`, `PathMode`, `PathNode`, `LessonDetail`, and
  `PracticeSection`.
- RL adds behavior that Learning Lab does not currently have:
  - a sidebar shell
  - a Guide tour
  - light theme default
  - route-param track selection
  - a 3D Visualization placeholder
  - track -> focus -> lesson cards with RL-specific styling and copy
- `PathMode.tsx` uses `rlLearningRoles` as tracks: `reinforcement-learning` and
  `robot-learning`. In the target model, these should become Learning Lab
  domains or domain tracks, not RL-only roles.

## Core Content and Types

- `src/core/types.ts` defines tensor Learning Lab types:
  `LearningPracticeRef`, `LearningLesson`, `LearningPath`, `LearningDomain`,
  and `LearningRole`.
- `src/core/rlTypes.ts` defines near-parallel RL types:
  `RLLearningPracticeRef`, `RLLearningLesson`, `RLLearningPath`,
  `RLLearningDomain`, and `RLLearningRole`.
- `src/core/learningContent.ts` stores tensor-shape lessons and role/domain
  mappings.
- `src/core/rlLearningContent.ts` stores RL lessons and track/focus mappings.
- `src/core/` is React-free today and must stay React-free. The refactor should
  consolidate pure metadata here without importing UI or React.

## Exercise Adapters

- `src/components/exercises/learningPracticeAdapter.ts` bridges tensor practice
  refs to representative `LayoutNode`s and the existing exercise registry.
- `src/components/exercises/rlPracticeAdapter.ts` stores deterministic RL
  fixtures and answer helpers.
- RL exercises live under `src/components/exercises/`:
  - `RLShapeExercise.tsx` for MDP component identification
  - `RLValueExercise.tsx` for Bellman/Q-table values
  - `GridWorldExercise.tsx` for Q-Learning/SARSA one-step updates
- These should remain available, but the adapter entry point should be owned by
  Learning Lab practice rendering instead of an RL-only surface.

## Localization and Docs

- `src/lib/localization.ts` has separate `learningLab` and
  `reinforcementLearning` namespaces plus parallel helpers:
  `getLearningLessonText`, `getLearningPracticeText`,
  `getReinforcementLessonText`, and `getReinforcementPracticeText`.
- Wiki/docs still describe RL as a sibling surface:
  - `wiki/concepts/reinforcement-learning.md`
  - `wiki/concepts/learning-lab-refactor.md`
  - `wiki/concepts/index.md`
  - `wiki/index.md`
  - `docs/ARCHITECTURE.md`
  - `README.md`
  - `wiki/log.md`
- `wiki/concepts/reinforcement-learning.md` explicitly contains the old
  invariant: "Reinforcement Learning is a sibling surface, not a Learning Lab
  mode." This must be removed/replaced.

# Decisions

- Learning Lab becomes the only active learning surface in AppShell.
- The unified visual system should use the current RL surface UI as the style
  baseline: color treatment, spacing, cards, shell rhythm, light/dark theme
  behavior, and overall visual polish should be normalized from RL across
  Learning Lab and, where practical, the rest of the website.
- The user journey remains based on the current Learning Lab flow: users enter
  from Landing into Learning Lab, then choose a domain and continue through
  track/topic and lesson content. RL is merged into that flow rather than
  carrying forward its standalone AppShell journey.
- Domains become the first-class learning axis:
  - `fundamentals`
  - `cv`
  - `nlp`
  - `reinforcement-learning`
  - `robot-learning`
- Robot Learning is a visible placeholder domain/track with metadata only. No
  full content is required.
- Existing tensor lessons and RL lessons keep their IDs during migration where
  practical, so existing copy lookups and testable behavior are easier to
  preserve.
- RL exercises stay dedicated React components because MDP/Bellman/GridWorld
  are not tensor-shape `LayoutNode` exercises.
- Shared UI should be extracted for lesson cards/details/practice rendering
  before deleting the RL surface, rather than copying Learning Lab UI into RL or
  RL UI into Learning Lab wholesale.
- The old `/reinforcement-learning` URLs should not render a standalone RL app.
  During this refactor they should redirect into Learning Lab, preferably to
  the RL domain, so bookmarked/static-host URLs degrade cleanly.
- The RL 3D Visualization placeholder is not promoted as a separate top-level
  mode. It can be removed from active navigation or represented as future
  metadata inside the RL domain.
- No persistence, progress tracking, full tutorial authoring system, or large
  new CV/NLP/RL content is part of this plan.

# Visual And Flow Baseline

- Visual baseline: use the current Reinforcement Learning UI as the reference
  for the unified Learning Lab look. This includes its cleaner light-theme
  default, larger roadmap-style cards, calmer borders, sidebar/header rhythm,
  and more cohesive sky/slate/white treatment.
- Site consistency: consolidate color, style, and theme behavior so Landing,
  Learning Lab, and the migrated RL domain feel like one product instead of
  separate experiments. Avoid keeping one-off `reinforcement-learning-light`
  styling after the standalone surface is removed.
- Flow baseline: use the current Learning Lab entry flow as the product flow.
  Landing still opens Learning Lab as the learning container; RL becomes a
  domain inside that container, not a separate first-screen destination.
- Implementation priority: first preserve flow and behavior, then apply the
  RL-derived visual system to the shared Learning Lab shell/components so all
  domains inherit the same style.

# Proposed Target Directory Tree

```text
src/components/learning/
  LearningLabView.tsx
  LearningLabHeader.tsx

  shell/
    DomainCatalog.tsx
    DomainPathView.tsx
    TrackList.tsx
    ReviewMode.tsx
    ReviewPicker.tsx

  lesson/
    LessonDetail.tsx
    LessonNode.tsx
    TheorySection.tsx

  practice/
    PracticeSection.tsx
    TensorPracticeRenderer.tsx
    ReinforcementPracticeRenderer.tsx
    adapters/
      tensorPracticeAdapter.ts
      reinforcementPracticeAdapter.ts

  domains/
    fundamentals/
      DomainIntro.tsx
    cv/
      DomainIntro.tsx
    nlp/
      DomainIntro.tsx
    reinforcement-learning/
      DomainIntro.tsx
      GuideTour.tsx
      VisualizationPlaceholder.tsx
    robot-learning/
      DomainIntro.tsx

  shared/
    LanguageMenu.tsx
    ThemeToggle.tsx

src/core/learning/
  types.ts
  selectors.ts
  content/
    index.ts
    fundamentals.ts
    cv.ts
    nlp.ts
    reinforcementLearning.ts
    robotLearning.ts

src/components/exercises/
  RLShapeExercise.tsx
  RLValueExercise.tsx
  GridWorldExercise.tsx
```

Notes:

- `src/components/reinforcement_learning/` should be emptied and deleted after
  the shared Learning Lab components cover the behavior.
- Do not create empty placeholder component files unless they are imported by
  the approved implementation or needed to hold active metadata. The tree above
  is the target shape, not permission to add inert scaffolding for its own sake.
- Exercise components can remain under `src/components/exercises/` because they
  are reusable practice surfaces, not RL page components.
- Practice adapters can move under `src/components/learning/practice/adapters/`
  because they feed UI practice renderers. React-free catalog selectors belong
  in `src/core/learning/selectors.ts`.

# File Move/Rename Map

## Core

| Current | Target | Action |
|---|---|---|
| `src/core/types.ts` | `src/core/learning/types.ts` | Replace with unified domain/track/lesson/practice types. Leave a temporary re-export only if needed to avoid a wide one-shot import churn. |
| `src/core/learningContent.ts` | `src/core/learning/content/fundamentals.ts`, `cv.ts`, `nlp.ts`, `index.ts` | Split existing tensor lessons by domain and export a combined `learningCatalog`. |
| `src/core/rlTypes.ts` | `src/core/learning/types.ts` | Merge RL practice kinds/exercise IDs into unified practice discriminated unions, then delete. |
| `src/core/rlLearningContent.ts` | `src/core/learning/content/reinforcementLearning.ts`, `robotLearning.ts` | Move RL lessons into RL domain content and convert Robot Learning into placeholder domain metadata. |
| new | `src/core/learning/selectors.ts` | Add React-free catalog selectors for domain, track, lesson, and practice lookup. |
| `src/core/answerCheck.ts` | unchanged | Keep reserved unless implementation needs pure answer helpers. |

## Learning Components

| Current | Target | Action |
|---|---|---|
| `src/components/learning/LearningLabView.tsx` | same | Convert to domain-aware container owning selected domain/track/lesson and Path/Review mode. |
| `src/components/learning/LearningLabHeader.tsx` | same plus `shared/LanguageMenu.tsx`, `shared/ThemeToggle.tsx` | Extract repeated language/theme controls and keep header as lab-level chrome. |
| `src/components/learning/PathMode.tsx` | `src/components/learning/shell/DomainPathView.tsx` | Refactor from role-first to domain-first, track/topic-second. |
| new | `src/components/learning/shell/DomainCatalog.tsx` | Render the domain-first entry point for `/learning`. |
| new or extracted | `src/components/learning/shell/TrackList.tsx` | Render tracks/topics for the selected domain. |
| `src/components/learning/ReviewMode.tsx` | `src/components/learning/shell/ReviewMode.tsx` | Filter review practice by selected domain and unified practice kind. |
| `src/components/learning/ReviewPicker.tsx` | `src/components/learning/shell/ReviewPicker.tsx` | Generalize filter keys across tensor and RL practice kinds. |
| `src/components/learning/PathNode.tsx` | `src/components/learning/lesson/LessonNode.tsx` | Generalize over unified `LearningLesson`. |
| `src/components/learning/LessonDetail.tsx` | `src/components/learning/lesson/LessonDetail.tsx` | Generalize text lookup by domain and render shared practice section. |
| `src/components/learning/shared/PracticeSection.tsx` | `src/components/learning/practice/PracticeSection.tsx` | Route tensor vs RL practice through adapters/renderers. |
| new | `src/components/learning/practice/TensorPracticeRenderer.tsx` | Own current Shape/Value/Conv modal launching behavior. |
| new | `src/components/learning/practice/ReinforcementPracticeRenderer.tsx` | Own MDP/Bellman/GridWorld inline exercise rendering. |
| `src/components/learning/shared/TheorySection.tsx` | `src/components/learning/lesson/TheorySection.tsx` | Reuse in lesson detail if useful. |
| `src/components/learning/shared/HintSection.tsx` | keep in `lesson/` or `practice/` | Keep only if still used after practice refactor. |
| `src/components/learning/PathMap.tsx` | remove if still unused | Current active `PathMode` does not import the old map shape. |

## Reinforcement Learning Components

| Current | Target | Action |
|---|---|---|
| `src/components/reinforcement_learning/View.tsx` | delete after `LearningLabView` owns the RL domain route | Port useful shell/domain behavior into Learning Lab first. |
| `src/components/reinforcement_learning/Header.tsx` | `LearningLabHeader.tsx` plus shared controls | Do not keep an RL-only header. Port guide/theme/language affordances only if they make sense lab-wide. |
| `src/components/reinforcement_learning/PathMode.tsx` | `src/components/learning/shell/DomainPathView.tsx`, `domains/reinforcement-learning/DomainIntro.tsx` | Preserve track -> focus -> lesson behavior as `domain -> track/topic -> lesson`, with RL domain selected. |
| `src/components/reinforcement_learning/PathNode.tsx` | `src/components/learning/lesson/LessonNode.tsx` | Delete after unified node supports accent/theme props. |
| `src/components/reinforcement_learning/LessonDetail.tsx` | `src/components/learning/lesson/LessonDetail.tsx` | Delete after unified lesson text/practice lookup works. |
| `src/components/reinforcement_learning/PracticeSection.tsx` | `src/components/learning/practice/PracticeSection.tsx`, `ReinforcementPracticeRenderer.tsx` | Move RL practice rendering under Learning Lab practice. |
| `src/components/reinforcement_learning/GuideTour.tsx` | `src/components/learning/domains/reinforcement-learning/GuideTour.tsx` | Move if retained; otherwise remove and document the removal. |
| 3D placeholder inside `View.tsx` | `src/components/learning/domains/reinforcement-learning/VisualizationPlaceholder.tsx` | Keep only as RL domain resource, not as top-level AppShell mode. |

## Exercise Adapters

| Current | Target | Action |
|---|---|---|
| `src/components/exercises/learningPracticeAdapter.ts` | `src/components/learning/practice/adapters/tensorPracticeAdapter.ts` | Move tensor practice node fixtures near the Learning Lab practice renderer. |
| `src/components/exercises/rlPracticeAdapter.ts` | `src/components/learning/practice/adapters/reinforcementPracticeAdapter.ts` | Move deterministic RL fixtures near the Learning Lab RL practice renderer. |
| `src/components/exercises/RLShapeExercise.tsx` | unchanged | Keep reusable exercise component; update imports only. |
| `src/components/exercises/RLValueExercise.tsx` | unchanged | Keep reusable exercise component; update imports only. |
| `src/components/exercises/GridWorldExercise.tsx` | unchanged | Keep reusable exercise component; update imports only. |

## AppShell, Landing, CSS, Localization

| Current | Target | Action |
|---|---|---|
| `src/components/AppShell.tsx` | same | Remove `ReinforcementLearningView` import and standalone route rendering. Add redirects from old RL routes to `/learning/reinforcement-learning` or equivalent hash route. |
| `src/components/landing/LandingPage.tsx` | same | Remove separate RL top-level callback/card or make the RL card open Learning Lab with RL selected. The preferred route is one Learning Lab card plus domain-focused copy, with no separate top-level RL surface. |
| `src/components/landing/LearningCard.tsx` | same | Reuse for Learning Lab only; no RL-specific duplicate card unless approved during implementation. |
| `src/index.css` | same | Replace `.reinforcement-learning-light` selectors with lab-owned classes if standalone RL class disappears. Add domain title styling for RL/Robot if needed. |
| `src/lib/localization.ts` | same | Merge RL lesson/practice/domain strings into the Learning Lab domain/content namespace; replace duplicated getter helpers with generic learning getters. |

# Shared Abstractions To Create

## Unified Learning Catalog

Create one React-free type system in `src/core/learning/types.ts`, including:

- `LearningDomain`
- `LearningTrack`
- `LearningLesson`
- `LearningLessonSection`
- `LearningPracticeRef`
- `LearningPracticeFamily`
- `LearningPracticeApproval`
- `LearningCatalog`

The core shape should include:

```ts
export type LearningDomainId =
  | 'fundamentals'
  | 'cv'
  | 'nlp'
  | 'reinforcement-learning'
  | 'robot-learning';

export type LearningTrack = {
  id: string;
  domainId: LearningDomainId;
  topicIds: string[];
  lessonIds: string[];
  status: 'available' | 'placeholder';
};

export type LearningLesson = {
  id: string;
  domainId: LearningDomainId;
  trackId: string;
  status: 'available' | 'next' | 'locked';
  blocks: Array<{ kind: 'theory' | 'code' | 'practice'; refId: string }>;
  practice: LearningPracticeRef[];
};
```

Use a discriminated union for practice:

```ts
export type LearningPracticeRef =
  | TensorPracticeRef
  | RLPracticeRef
  | PlaceholderPracticeRef;
```

Model practice as a discriminated union:

- tensor practice:
  - `family: 'tensor'`
  - current tensor `exerciseId`
  - current target operation text
  - adapter-backed representative `LayoutNode`
- RL practice:
  - `family: 'reinforcement-learning'`
  - current RL `exerciseId`
  - current target concept text
  - deterministic fixture-backed renderer
- placeholder practice:
  - `family: 'placeholder'`
  - approval/unavailable metadata for future content

This allows tensor shape/value practice and RL fixtures to share a renderer
without pretending RL concepts are `LayoutNode`s.

## Catalog Selectors

Create `src/core/learning/selectors.ts` for pure helpers such as:

- `getLearningDomain(catalog, domainId)`
- `getLearningTrack(catalog, domainId, trackId)`
- `getLearningLessonsForTrack(catalog, track)`
- `getLearningPracticeForDomain(catalog, domainId)`

These helpers must stay React-free and should make UI components read the
catalog without duplicating lookup logic.

## Domain-Aware Text Lookup

Replace parallel helpers with generic functions:

```ts
getLearningLessonText(t.learningLab, lesson)
getLearningPracticeText(t.learningLab, practice)
getLearningDomainText(t.learningLab, domainId)
getLearningTrackText(t.learningLab, track)
```

The implementation can still use `toLearningContentKey(id)` and existing copy
keys during migration, but callers should no longer import
`getReinforcementLessonText` or `getReinforcementPracticeText`.

## Practice Renderer Boundary

Create shared React components:

- `lesson/LessonNode.tsx` replaces duplicated Learning Lab and RL path nodes.
- `lesson/LessonDetail.tsx` replaces duplicated lesson detail layouts and calls
  the shared practice section.
- `practice/PracticeSection.tsx` handles availability, title lookup, and
  dispatches to tensor or RL renderers.
- `practice/TensorPracticeRenderer.tsx` owns current Shape/Value/Conv modal
  launching behavior.
- `practice/ReinforcementPracticeRenderer.tsx` owns MDP/Bellman/GridWorld
  inline exercises.

This preserves existing behavior while removing page-level duplication.

Keep domain-specific presentation limited:

- RL `GuideTour` can move under
  `src/components/learning/domains/reinforcement-learning/GuideTour.tsx` if the
  approved implementation keeps it.
- The current RL 3D placeholder can move under
  `domains/reinforcement-learning/VisualizationPlaceholder.tsx` as a future
  domain resource, not as a top-level mode.

# Navigation And Content Model

## Preferred Route Model

Use Learning Lab routes:

```text
/#/
/#/workspace
/#/learning
/#/learning/:domainId
/#/learning/:domainId/:trackId
```

Old RL routes should redirect:

```text
/#/reinforcement-learning -> /#/learning/reinforcement-learning
/#/reinforcement-learning/roadmap/:trackId -> /#/learning/reinforcement-learning/:trackId
```

If implementing route params in Learning Lab creates too much churn, the first
execution pass may keep only `/#/learning` active and pass the selected domain
through AppShell state. The redirect route should still avoid rendering the old
RL surface.

Landing behavior:

- Keep Workspace as the product/tool entry.
- Keep Learning Lab as the learning entry.
- Remove the separate top-level RL card from the first viewport, or only keep a
  domain shortcut if the landing composition needs it. The preferred path is to
  merge RL into the Learning Lab card copy so the first screen no longer
  visually teaches "Workspace, Learning Lab, RL" as three sibling surfaces.

## Learning Lab Flow

1. User opens Learning Lab from Landing.
2. Lab shows domains as the primary choice:
   - ML Foundations / tensor-shape fundamentals
   - Computer Vision
   - NLP
   - Reinforcement Learning
   - Robot Learning
3. Selecting a domain shows tracks/topics for that domain.
   - CV can initially map to current Conv2d/pooling lessons.
   - NLP can initially map to current attention lesson.
   - Fundamentals can initially map to shape basics and linear/activation.
   - RL maps to tabular control and policy behavior with existing RL lessons.
   - Robot Learning shows placeholder metadata only.
4. Selecting a track/topic opens ordered lessons.
5. Lesson detail renders theory now and leaves room for future code walkthrough
   and hand-calculation blocks without building a full authoring system.
6. Review mode can browse practice across all domains or be scoped to the active
   domain, depending on the lowest-risk implementation. It must continue to
   open the existing tensor exercises and RL inline exercises.

# RL Migration Plan

1. Introduce unified learning types and content exports while keeping existing
   imports compiling.
2. Add RL and Robot Learning domain metadata to the Learning Lab catalog.
3. Teach `LearningLabView` to read domain/track params and default to the first
   available domain if no param is provided.
4. Refactor Learning Lab `PathMode` into domain-first navigation.
5. Move RL practice rendering into `src/components/learning/practice`.
6. Port RL lessons into the unified `LessonDetail` and `LessonNode`.
7. Preserve the existing RL lessons:
   - MDP basics
   - Bellman values
   - Q-Learning update
   - SARSA update
8. Preserve the existing RL practice:
   - MDP component identification
   - Bellman/Q-table value
   - Q-Learning GridWorld step
   - SARSA GridWorld step
9. Add AppShell redirects from old RL routes to Learning Lab RL domain.
10. Remove the standalone `src/components/reinforcement_learning` import path
   from AppShell.
11. Delete `src/components/reinforcement_learning/` after no imports remain.
12. Update Landing so RL is represented as a Learning Lab domain entry, not a
    separate top-level product surface.

# Phases

## Phase 0 - Store this plan

- Create this draft plan in `docs/plans/`.
- Wait for explicit approval before modifying code/docs.

## Phase 1 - Approval checkpoint

- After approval, update this plan frontmatter to `status: approved` and bump
  `updated`.
- Then begin implementation.

## Phase 2 - Unified core model

- Create `src/core/learning/types.ts`.
- Create `src/core/learning/selectors.ts`.
- Create `src/core/learning/content/index.ts`.
- Move/split current `learningContent.ts` and `rlLearningContent.ts` into
  domain content modules.
- Keep `src/core/` React-free.
- Keep compatibility exports only if needed for an incremental refactor.

## Phase 3 - Shared Learning Lab shell

- Refactor `LearningLabView` into a domain-aware container.
- Extract lab-level shared controls from `LearningLabHeader`.
- Add a domain catalog/selector that can host fundamentals, CV, NLP, RL, and
  Robot Learning.
- Preserve Back-to-Landing, language, theme, Path, and Review behavior.
- Keep the user journey aligned with the current Learning Lab flow from Landing
  into domain selection, not the old standalone RL AppShell route.

## Phase 3b - RL-derived visual system

- Audit the current RL surface styling before deleting it.
- Promote the RL surface's color treatment, shell/card rhythm, light/dark theme
  behavior, and overall visual polish into shared Learning Lab components.
- Apply the shared style consistently across Learning Lab domains, including
  fundamentals, CV, NLP, RL, and Robot Learning placeholder.
- Update Landing only as needed so the website no longer visually teaches RL as
  a separate surface while still feeling consistent with the new Learning Lab
  visual system.

## Phase 4 - Shared lesson and practice rendering

- Move/genericize `PathNode`, `LessonDetail`, and `PracticeSection`.
- Route tensor practice through existing tensor adapter and exercise registry.
- Route RL practice through existing RL fixtures and RL exercise components.
- Preserve approval gating and "In progress" states.

## Phase 5 - Migrate RL domain

- Render RL lessons and exercises inside Learning Lab.
- Move or remove RL-specific standalone UI.
- Keep the RL 3D placeholder inside the RL domain if it remains useful, but do
  not expose it as a top-level AppShell mode.

## Phase 6 - Route and Landing migration

- Update `AppShell` to stop rendering `ReinforcementLearningView`.
- Redirect old RL routes to Learning Lab's RL domain.
- Update Landing callbacks/copy so RL is not a separate top-level surface.
- Keep Workspace and Learning Lab entry points available.

## Phase 7 - Delete obsolete RL surface

- Remove unused `src/components/reinforcement_learning/*` after shared Learning
  Lab components cover the behavior.
- Delete `src/core/rlTypes.ts` and `src/core/rlLearningContent.ts` once unified
  content imports are complete.
- Clean CSS selectors/classes that only existed for the standalone RL surface.

## Phase 8 - Docs and plan execution log

- Update this plan's execution log as implementation proceeds.
- Update existing docs/wiki pages instead of creating new docs pages unless a
  genuinely new long-lived reference surface is required.

## Phase 9 - Verify

- Run `npm run verify`.
- Run `git diff --check`.
- Run the targeted grep checks in the Verification Plan.
- Report any verification failures with exact command output and next action.

# Docs And Wiki Updates

Update existing docs:

- `wiki/concepts/learning-lab-refactor.md`
  - Describe Learning Lab as the learning container.
  - Add domain-first model and RL/Robot Learning domain status.
  - Update scaffold map to new directories.
- `wiki/concepts/reinforcement-learning.md`
  - Rewrite from top-level surface page to Learning Lab domain page, or fold the
    short RL details into `learning-lab-refactor.md` and keep this page as a
    redirect-style concept pointer.
  - Remove the invariant "RL is a sibling surface, not a Learning Lab mode."
- `wiki/concepts/index.md` and `wiki/index.md`
  - Update entries that currently call RL a separate surface.
- `docs/ARCHITECTURE.md`
  - Update Landing/AppShell and Learning Lab section.
- `README.md`
  - Update top-level docs bullets that mention active DL and RL surfaces.
- `wiki/architecture.md`
  - Remove stale wording that Learning Lab components are inert or coming soon.
- `wiki/log.md`
  - Add a concise entry after execution.
- This plan file
  - Mark status transitions and record modifications/verification in
    `# Execution log`.

Historical done plans may still describe the old implementation as history. If
they are easy to misread as current guidance, add a short superseded note rather
than rewriting their original decisions.

# Verification Plan

Primary verification:

```bash
npm run verify
```

This currently expands to:

```bash
npm run typecheck
npm test
npm run build
```

Additional targeted checks:

```bash
git diff --check
rg -n "Reinforcement Learning is a sibling surface|not a Learning Lab mode|src/components/reinforcement_learning|rlLearningContent|rlTypes|getReinforcement" src docs wiki README.md
```

Manual smoke checks after implementation:

- Landing opens.
- Workspace opens and returns to Landing.
- Learning Lab opens.
- `/learning` shows the domain catalog/path.
- `/learning/reinforcement-learning` reaches RL lessons.
- Landing -> Learning Lab still follows the current Learning Lab entry flow.
- The unified Learning Lab uses the RL-derived color, style, card, and theme
  treatment consistently across domains.
- Learning Lab domains include fundamentals, CV, NLP, Reinforcement Learning,
  and Robot Learning placeholder.
- RL domain opens MDP, Bellman, Q-Learning, and SARSA lessons.
- RL exercises still accept/check/reset answers.
- Existing tensor shape/value Learning Lab exercises still open.
- Existing Workspace exercise launcher and Forward Pass demo entry points still
  work.
- Old hash routes for `/reinforcement-learning` do not render a separate RL
  surface and instead enter Learning Lab RL.

# Out Of Scope

- Persistence or progress tracking.
- Full tutorial authoring system.
- Complete new CV/NLP/RL lesson content beyond placeholder metadata needed for
  domain structure.
- Robot Learning content beyond placeholder domain/track metadata.
- Workspace handoff, template loading, or node highlighting from Learning Lab.
- Changes to Pyodide, torchstub, IR tracing, `computeLayout`, or Canvas3D.
- Removing existing Workspace, Forward Pass demo, or exercise entry points.
- Forcing RL concepts into the tensor `LayoutNode` exercise registry.

# Execution log

- 2026-06-25T23:58:21+07:00 - Draft plan created after reading
  `docs/WORKFLOW.md`, `CLAUDE.md`, Learning Lab/RL wiki pages, predecessor
  plans, AppShell/Landing/Learning/RL/core/exercise/localization context, and
  verification scripts. No source code or docs were modified before this plan.
- 2026-06-26T00:17:11+07:00 - Updated draft plan from the attached alternative
  plan: added explicit success criteria, context-read record, `selectors.ts`,
  domain intro/resource folders, practice renderer/adapters split, legacy route
  details, approval checkpoint, historical-plan docs note, and stronger
  verification checks. No source code was modified.
- 2026-06-26T00:22:16+07:00 - Added UI/flow direction from user feedback:
  adopt the current RL surface as the visual/style/theme baseline for the
  unified website, while preserving the current Landing -> Learning Lab user
  flow as the product flow. No source code was modified.
- 2026-06-26T00:26:00+07:00 - User approved execution with "tiến hành đi";
  plan marked approved. Implementation begins in the current workspace by
  request, without creating a separate worktree.
- 2026-06-26T00:27:00+07:00 - Plan moved to executing before source changes.
- 2026-06-26T00:32:00+07:00 - Added the React-free
  `src/core/learning/` catalog with domain, track, lesson, practice, and
  selector types. Migrated fundamentals, CV, NLP, RL, and Robot Learning
  placeholder metadata into the domain-first model.
- 2026-06-26T00:35:00+07:00 - Rebuilt Learning Lab around the RL-derived shell:
  sidebar domain navigation, Path/Review header, shared lesson detail/node
  components, shared practice rendering, tensor practice adapter, and RL
  practice adapter. Removed the duplicate standalone
  `src/components/reinforcement_learning/` surface and stale Learning Lab UI
  files it replaced.
- 2026-06-26T00:37:00+07:00 - Updated AppShell/Landing routing: Landing now
  enters Learning Lab as the learning container, `/learning/:domainId` and
  `/learning/:domainId/:trackId` are active, and legacy
  `/reinforcement-learning` URLs redirect into the RL domain.
- 2026-06-26T00:39:00+07:00 - Updated README, architecture docs, wiki concept
  pages, wiki index pages, and wiki log to remove the obsolete "RL is a sibling
  surface" invariant and describe RL as a Learning Lab domain.
- 2026-06-26T00:45:00+07:00 - Final verification passed:
  `node --test src/lib/learningCatalog.test.ts`, targeted stale-RL grep,
  `npm run verify`, and `git diff --check`. Browser smoke checks passed for
  Landing -> Learning Lab, RL domain/track/practice, Review mode, and the
  legacy `/reinforcement-learning/roadmap/policy-behavior` redirect. Dev-console
  noise was limited to the existing Tailwind CDN warning and missing favicon
  request.

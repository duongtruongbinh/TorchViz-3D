---
title: Learning Lab Refactor
type: Active Subsystem
updated: 2026-06-28
---

# Learning Lab Refactor

This page documents the Landing Page and Learning Lab refactor. The original
scaffold source plan is
[docs/plans/2026-06-21-learning-lab-refactor.md](../../docs/plans/2026-06-21-learning-lab-refactor.md).
Landing visual iteration history is consolidated in
[docs/plans/2026-06-21-landing-ui-iteration.md](../../docs/plans/2026-06-21-landing-ui-iteration.md).
The Learning Path activation plan is
[docs/plans/2026-06-24-learning-path-exercise-separation.md](../../docs/plans/2026-06-24-learning-path-exercise-separation.md).
The domain refactor plan is
[docs/plans/2026-06-25-learning-lab-domain-refactor.md](../../docs/plans/2026-06-25-learning-lab-domain-refactor.md).

## Status

MVP 1 makes the Landing Page and AppShell active runtime behavior. The app opens
on Landing, the active TorchViz-3D card enters the existing workspace, and the
workspace header can return to Landing.

Landing includes the same language selector behavior as the workspace header;
both are backed by the global `useStore` language state.

The active Landing first screen is a viewport-fit bento composition: top intro
copy, a left "live graph preview" animation that flows through model stages, and
compact right-side cards for Workspace and Learning Lab.
Connection lines are computed from real DOM anchors between the final classifier
block and the main cards; the Workspace route enters the editor/canvas flow and
the Learning Lab route enters the guided learning flow.

Learning Lab is active as the single learning container. It currently provides:

- A domain-first flow: Learning Lab -> domain -> track/topic -> lesson.
- Domains for ML Foundations, Computer Vision, NLP, Reinforcement Learning, and
  Robot Learning placeholder.
- A Path mode backed by React-free static catalog metadata.
- A Review mode over practice cards from the active domain or catalog.
- Tensor practice cards that build representative `LayoutNode`s, validate them
  against the existing exercise registry, and reuse existing shape/value
  exercise model builders.
- Reinforcement Learning practice cards for MDP, Bellman/Q-table, Q-Learning,
  SARSA, and GridWorld, backed by deterministic fixtures.
- Domain landing pages use a shared course-style layout with a dark hero,
  outcomes, closed-by-default course content accordions, requirements,
  description, and a simple Future HMI footer. Lesson rows navigate into the
  existing track lesson pages with `?lesson=` query state; accordion headers only
  expand or collapse.
- A shared Learning Lab shell using the former RL surface's cleaner
  light-theme/card/sidebar visual treatment as the style baseline.
- Workspace forward-pass controls expose a familiar dropdown-style exercise
  select for approved practice targets. Selecting an item keeps the current
  visualization page in place and opens a small Learning panel whose action
  opens the matching Learning Lab domain/track in a new tab as a HashRouter URL
  with `lesson` and `practice` query state; the URL helper is covered by route
  tests so new tabs use `/#/learning/...` instead of direct `/learning/...`
  paths. Each dropdown option row shows a trailing `>`
  affordance; hovering or focusing a row previews the handoff panel beside the
  exercise control for that specific practice target. The panel has no close
  button, dismisses when the pointer leaves it, and is portaled above ordinary
  canvas/workspace overlays while remaining below modal export surfaces.
- Tensor practice in Learning Lab renders directly inside the lesson page.
  Shape, value, and convolution exercises reuse the existing answer-checking and
  hint logic through inline exercise mode; the Learning Lab page owns the theory,
  animation, and exercise surface together.

Active behavior remains unchanged:

- The existing workspace still uses the current editor, canvas, inspector, and
  bottom tabs after entering from Landing.
- Existing editor, canvas, inspector, bottom tabs, exercises, and Forward Pass
  behavior are not modified.
- Hash routes remain static-host friendly. Legacy `/reinforcement-learning`
  routes redirect into the Learning Lab RL domain.
- No persistence, progress tracking, deep workspace handoff, or real UI store
  behavior is implemented in this phase.

## Scaffold Map

| Path | Intended future responsibility |
|---|---|
| `src/components/AppShell.tsx` | MVP 1 root view switcher for Landing and TorchViz workspace. |
| `src/components/landing/LandingPage.tsx` | Active Landing first screen with intro copy, live graph preview, Workspace CTA, and Learning Lab CTA. |
| `src/components/landing/ToolCard.tsx` | Active card for entering the existing TorchViz-3D workspace. |
| `src/components/landing/LearningCard.tsx` | Landing card for entering Learning Lab. |
| `src/components/learning/LearningLabView.tsx` | Full-screen Learning Lab container, route-aware domain/track/lesson shell, and local mode/theme state. |
| `src/components/learning/LearningLabHeader.tsx` | RL-style Lab header with Path/Review, theme, language, and sidebar controls. |
| `src/components/learning/shell/DomainCatalog.tsx` | Domain-first catalog entry surface. |
| `src/components/learning/shell/DomainCoursePage.tsx` | Shared course-style landing page for selected domains, including hero, outcomes, course content accordions, requirements, description, and footer. |
| `src/components/learning/shell/TrackList.tsx` | Legacy track/topic card surface retained for possible reuse; domain landing routes now use `DomainCoursePage`. |
| `src/components/learning/shell/ReviewMode.tsx` | Review browser over active-domain or catalog practice. |
| `src/components/learning/lesson/LessonNode.tsx` | Shared lesson node. |
| `src/components/learning/lesson/LessonDetail.tsx` | Shared lesson detail with theory and practice rendering. |
| `src/components/learning/practice/PracticeSection.tsx` | Shared practice dispatcher for tensor, RL, and placeholder practice. |
| `src/components/learning/practice/TensorPracticeRenderer.tsx` | Tensor Shape/Value/Conv modal launcher. |
| `src/components/learning/practice/ReinforcementPracticeRenderer.tsx` | Inline RL MDP/Bellman/GridWorld renderer. |
| `src/components/learning/practice/adapters/tensorPracticeAdapter.ts` | Representative tensor practice node adapter. |
| `src/components/learning/practice/adapters/reinforcementPracticeAdapter.ts` | Deterministic RL practice fixtures and answer helpers. |
| `src/core/learning/types.ts` | React-free unified learning catalog types. |
| `src/core/learning/content/*` | React-free static domain/track/lesson metadata. |
| `src/core/learning/selectors.ts` | React-free catalog selectors. |

## UI Conventions

Learning Lab UI conventions live in `src/components/learning/theme.ts`.
New Learning Lab controls should use `getLearningLabTheme(theme)` instead of
hand-rolling color, hover, focus, or radius classes in component files.

Use the semantic helpers as the default:

- `themeClasses.radius.icon` for square icon controls and brand tiles.
- `themeClasses.radius.button` for regular buttons and sidebar nav rows.
- `themeClasses.radius.card` for repeated cards.
- `themeClasses.radius.panel` for larger panels/detail surfaces.
- `themeClasses.radius.pill` for segmented controls, chips, and status pills.
- `themeClasses.button.primary`, `.secondary`, `.ghost`, `.icon`, `.nav()`,
  `.card`, and `.segmented()` for button interaction states.
- `themeClasses.surface.card` and `.unavailable` for non-button panels.

Do not add new hex colors or ad hoc Tailwind color/radius choices in Learning
Lab components unless the element is a special visualization or a later
approved plan extends the convention.

Common action icons across Landing, Workspace, Canvas controls, and Learning
Lab should come from `lucide-react`; do not paste inline SVG for normal UI
controls. Current standard icons include:

- `Search` for the header search affordance.
- `Sun` and `Moon` for theme switching.
- `PanelLeft` for sidebar open/close.
- `ArrowRight` for open/start/enter actions.
- `ArrowLeftToLine` for Back to landing.
- `Languages` icon-only for direct language toggles.
- `ChevronDown` and `Check` for menus.
- `Play`, `Pause`, `SkipBack`, and `SkipForward` for playback controls.
- `X`, `CircleAlert`, `CircleX`, `Check`, and `Lightbulb` for modal/status
  controls.

The language switch intentionally remains an app-wide direct two-mode toggle
with a standalone `Languages` icon; do not reintroduce text labels or language
dropdowns unless a later approved plan changes the interaction.

SVG is still appropriate when it is the visual content itself: Landing preview
graphs/routes, exercise/math graphs, generated SVG export output, or custom
canvas/Three.js visualizations.

## Codex Init Prompt

Codex agents should derive their initial prompt from `CLAUDE.md`, then use this
short prompt for the next implementation phase:

```text
Read docs/WORKFLOW.md, CLAUDE.md, and this wiki page before editing.
Preserve the current TorchViz-3D workspace until an approved plan says otherwise.
Treat Learning Lab as the single learning container backed by React-free static
domain catalog metadata. Reinforcement Learning is a Learning Lab domain, not a
top-level surface. Reuse existing tensor exercise model builders and dedicated
RL fixtures before adding new practice UI. AppShell, landing components, and
Learning Lab components are active.
Update existing relevant docs before creating any new docs page.
```

For small UI, copy, layout, or follow-up changes, update the existing page that
already owns the topic. Create a new page only when the work is substantially
different in scope or needs its own long-lived reference surface.

## Invariants

- `src/core/` must remain React-free when real logic is added.
- Learning Lab owns learning navigation; new domains should enter through the
  unified catalog rather than adding top-level AppShell surfaces.
- Learning Lab should reuse existing exercise concepts and dedicated fixtures
  instead of duplicating behavior without a plan.
- Any future page state must not reset the current TorchViz-3D editor/canvas
  state unexpectedly.
- Existing Workspace/Demo exercise entry points must keep the visualization page
  in place and open approved Learning practice through a Learning Lab new-tab
  handoff unless a later approved plan explicitly changes that behavior.
- Learning Lab tensor practice renders inline on the page; RL practice stays
  inline through dedicated fixtures and exercise components.
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

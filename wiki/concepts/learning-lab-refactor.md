---
title: Learning Lab Refactor
type: Active Subsystem
updated: 2026-07-14
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

The active Landing first screen is a restrained dark technical composition: top
intro copy, a quieter live model-flow preview, and clearer right-side entry
cards for Workspace and Learning Lab. On wide screens, subtle connection lines
are computed from real DOM anchors between the final classifier block and the
main cards; smaller layouts hide those routes to keep the page readable. The
Workspace route enters the editor/canvas flow and the Learning Lab route enters
the guided learning flow.

Learning Lab is active as the single learning container. It currently provides:

- A domain-first flow: Learning Lab -> domain -> track/topic -> lesson.
- Domains for Programming, Math & Statistics, Machine Learning, Deep Learning,
  Computer Vision, NLP, LLM AI Engineering, MLOps/LLMOps, AI System Design,
  Reinforcement Learning, AI Ethics/Safety/Governance, and Robot Learning.
- The LLM AI Engineering domain includes a Vietnamese-first LLM-from-scratch
  course path inspired by `rasbt/LLMs-from-scratch` but organized around the
  TorchViz learning rhythm: theory -> hand calculation or theory quiz -> code.
  Its catalog-owned lesson copy explains why each concept matters, where it
  sits in the LLM pipeline, what learners should calculate or check by hand,
  and what the later code step is meant to implement. The current approval gate
  covers the first five LLM nodes: setup requirements, roadmap, roadmap quiz,
  data-pipeline overview, and data-pipeline quiz. Current LLM domain history is
  compacted in
  [docs/plans/2026-07-13-learning-lab-llm-domain-compact.md](../../docs/plans/2026-07-13-learning-lab-llm-domain-compact.md).
  The approved early lessons carry React-free extras for motivation panels,
  token interactions, concept panels, checkpoint quizzes, and reference links.
  Deeper formulas, later exercises, and code contracts stay in the roadmap copy
  until a later approved lesson attaches them to the runtime. A later alignment
  pass downloaded the supplied "Building LLMs From Scratch" gist into
  `docs/reference/building-llms-from-scratch-gist.md` and uses it as a local
  reference for source-grounded paraphrases; concepts outside the current lab
  scope, such as training-loop bells and LoRA, are marked as placeholders for
  future supplementation instead of being implemented prematurely.
- LLM AI Engineering content is a domain package under
  `src/core/learning/content/llm-ai-engineering/`. The package owns its tracks,
  source references, local approval gate, and domain component-name contract
  while keeping the global catalog export stable. Generic MDX discovery,
  validation, locale selection, assembly, and search live outside this domain.
- A Path mode backed by React-free static catalog metadata.
- A Review mode over practice cards from the active domain or catalog.
- Canonical route resolution for `domain -> chapter -> lesson` paths. Legacy
  route ids are kept as catalog aliases that redirect to the canonical roadmap
  lesson instead of duplicating content.
- A lesson rail with catalog-wide search, status/practice filters, and
  chapter-level collapse. The rail is a dedicated component so
  `LearningLabView` can stay focused on shell and route orchestration.
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
- Expanded placeholder roadmaps get lesson display text from the catalog seed
  model. `src/lib/localization.ts` still owns UI chrome and exercise labels, but
  generated lesson titles no longer require a separate global title registry.

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
| `src/components/learning/lesson/LessonRail.tsx` | Searchable/filterable lesson rail, chapter collapse behavior, and lesson-node list rendering. |
| `src/components/learning/lesson/LessonNode.tsx` | Shared lesson node. |
| `src/components/learning/lesson/LessonDetail.tsx` | Shared lesson detail with theory/practice rendering and generic MDX lesson lookup. |
| `src/components/learning/lesson/QuizBlock.tsx` | Shared stateful quiz renderer used by the generic MDX quiz component. |
| `src/components/learning/lesson/scrolling.ts` | Shared feedback-scroll helper used by quiz and domain interactions. |
| `src/components/learning/learningMdxComponents.tsx` | Shared Markdown renderers, lesson frame, theme/lesson context, and quiz behavior. |
| `src/components/learning/learningMdxRegistry.tsx` | Generic compiled-lesson registry and the small optional domain-component composition map. |
| `src/components/learning/domains/*/mdxComponents.tsx` | Optional domain-owned MDX visual/interaction adapters. Markdown-only domains need no adapter. |
| `src/components/learning/domains/*/renderers.tsx` | Domain-owned custom visualizations and stateful interactions. The LLM domain owns its custom concept panels and media ids directly. |
| `src/content/learning/<domain-id>/<lesson-id>.<locale>.mdx` | Convention-based locale-specific lesson sources compiled locally by Vite. Only the five approved Vietnamese-first LLM lessons have migrated so far. |
| `src/components/learning/practice/PracticeSection.tsx` | Shared practice dispatcher for tensor, RL, and placeholder practice. |
| `src/components/learning/practice/TensorPracticeRenderer.tsx` | Tensor Shape/Value/Conv modal launcher. |
| `src/components/learning/practice/ReinforcementPracticeRenderer.tsx` | Inline RL MDP/Bellman/GridWorld renderer. |
| `src/components/learning/practice/adapters/tensorPracticeAdapter.ts` | Representative tensor practice node adapter. |
| `src/components/learning/practice/adapters/reinforcementPracticeAdapter.ts` | Deterministic RL practice fixtures and answer helpers. |
| `src/core/learning/types.ts` | React-free unified learning catalog types. |
| `src/core/learning/content/*` | React-free static domain/track/lesson metadata. Larger domains may own a package folder instead of a single file. |
| `src/core/learning/content/mdxContract.ts` | React-free generic filename, metadata, locale, and search normalization contract. |
| `src/core/learning/content/mdxSearch.ts` | React-free generic lookup over generated locale-aware search documents. |
| `src/core/learning/content/llm-ai-engineering/*` | LLM AI Engineering domain package: tracks, references, local approval gate, and custom MDX component names. |
| `scripts/learningContentMdx.ts` | Generic AST validator and Vite virtual search-document generator for every `src/content/learning/*/*.mdx` file. |
| `src/core/learning/selectors.ts` | React-free catalog selectors. |
| `src/core/learning/content/seed.ts` | Placeholder roadmap seed builder that produces typed catalog lesson entries and catalog-owned lesson text. |

## Content Ownership

Authored Learning Lab lesson content follows one filesystem rule:

```text
one catalog lesson node = one locale-specific MDX file
src/content/learning/<domain-id>/<lesson-id>.<locale>.mdx
```

Catalog metadata may remain compact or placeholder-heavy by domain, but any
lesson that adopts authored MDX uses this rule. A new Markdown-only domain adds
catalog metadata and MDX files without changing shared discovery, validation,
search, or lesson assembly. A domain adds an MDX component map only when it has
custom visualization or stateful-interaction needs.

Split files by volatility:

- Track/course files when a domain has many chapters or roadmap groups.
- Locale-specific MDX lesson files for metadata, prose, headings, links, quiz
  data, searchable text, and structured visualization inputs.
- Domain renderer files when UI treatment is genuinely domain-specific.
- Deeper component folders only when an interaction has enough state, animation,
  or tests to justify independent ownership.

Global shared types and renderers describe reusable contracts. Domain packages
own source references, asset ids, approval gates, component names, and custom
renderer components so future domains do not inflate shared lesson assembly or
search. Component allowlisting and runtime component maps derive from the same
domain-owned name contract; the composition root is a small typed map, not a
plugin framework.

Shared authored rendering stays intentionally small: Markdown primitives, the
lesson frame, and quiz behavior. Domain-specific panels are exposed through the
domain's named MDX component map; shared lesson assembly has no legacy
extra-kind dispatcher or implicit domain fallback.

## Generic Learning Lab MDX Content Pipeline

Learning Lab lesson authoring has one MDX path inside the existing React/Vite
application. This is not a VitePress or Vue sub-application. Vite compiles
local files matched by `src/content/learning/*/*.mdx`, and `LessonDetail` asks a
generic registry for a descriptor keyed by domain, lesson, and requested
locale. The React-free catalog continues to own routes, tracks, lesson status,
domain fallback policy, and approval gating.

`minimal-llm-project-skeleton` is the first migrated pilot. Its Vietnamese
prose, links, command, headings, and keywords live in one `.vi.mdx` file.
English UI intentionally falls back to that Vietnamese lesson until a real
`.en.mdx` translation is added.
The former `colab-coding-requirements` payload and renderer branch were removed
after the pilot passed typecheck, tests, and production build.
Both approved checkpoint quizzes are also migrated. Their authored questions
live in Vietnamese MDX while a narrow `MdxQuiz` adapter reuses the shared quiz
renderer; MDX page metadata preserves the former one-question-per-page flows
and `LessonDetail` continues to own/reset quiz state.
The data-pipeline overview is authored as nine Vietnamese MDX pages. Named
`TrainingLifecycle` and `TransformerTranslationStep` adapters keep visualization
code in React without exposing renderer ids to lesson authors.
All five approved LLM lessons now have one Vietnamese MDX source and the former
`extras.ts` catalog bridge has been removed. The roadmap uses named domain
components such as `AiHierarchy`, `DomainComparison`, `TokenizationExample`,
`NextTokenExercise`, and `ScaleComparison`; it no longer exports a legacy
`LearningLessonExtra[]` payload or calls a general `MdxRoadmap` dispatcher. The
renderer boundary materializes locale fallback without duplicating authored
values or shipping raw source beside the compiled module.

MDX authors use normal Markdown plus shared components and, when needed, the
active domain's explicit component vocabulary. The AST contract rejects
imports, re-exports, executable expressions, spread attributes, invalid page
indexes, duplicate quiz ids/locales, and components outside the composed
allowlist. Interactive components remain domain-owned React code.

Lesson modules are discovered automatically from the
`<domain-id>/<lesson-id>.<locale>.mdx` filename convention with one generic
`import.meta.glob`; adding a lesson or later translation does not require a
manual lesson/domain import. A generic Vite plugin scans the same files with
the verified AST contract and emits a React-free virtual search module. Raw MDX
is not shipped beside compiled MDX. Verification recursively checks every MDX
under `src/content/learning`, so a misplaced nested file also fails the path
contract. It rejects unknown domains, missing catalog lessons, metadata/path
drift, unapproved content, unsafe syntax, page gaps, and component drift.
Lesson-rail search keeps the existing grouping and status/practice filters, but
migrated LLM lessons also contribute localized MDX body text, headings, and
keywords. Search is case-insensitive and removes Vietnamese diacritics for
matching. Content stays local and no hosted search service or runtime MDX
compiler is used.

LLM AI Engineering is the reference domain for this shared pipeline; no other
domain has been migrated yet. All five approved LLM lessons use the MDX path. The Vietnamese-first roadmap
stores one localized value per authored string and materializes the English UI
fallback only at the renderer boundary. Its stateful visual components remain
in the domain renderer; the 114 unapproved placeholder lessons remain on the
React-free seeded catalog path.

The roadmap's final three pages are ordinary Markdown rather than legacy extra
objects: course outline, references, and next-step guidance. This also keeps the
declared eleven-page contract explicit and prevents unsupported generic extras
from becoming blank MDX pages. The former shared lesson-extra compatibility
chain has been removed; LLM visuals are reached only through the domain-owned
MDX adapter.

## UI Conventions

Learning Lab UI conventions live in `src/components/learning/theme.ts`.
New Learning Lab controls should use `getLearningLabTheme(theme)` instead of
hand-rolling color, hover, focus, or radius classes in component files.

Runtime lesson media should live under `src/assets/learning/<domain>/...` and be
resolved through a renderer-side asset registry. `docs/assets/` is for
documentation media, screenshots, and reference artifacts rather than app
runtime lesson images. Use lesson-scoped asset ids and lesson-searchable file
names:

```text
<lesson-number>-<lesson-id>-<asset-purpose>.<ext>
```

For example, the first LLM roadmap lesson uses
`01-llm-from-scratch-roadmap-ai-hierarchy.png` and
`01-llm-from-scratch-roadmap-next-token-loop.png`.

The main lesson panel should stay visually flat: `LessonDetail` owns the single
outer panel, while theory, calculation, code, practice, and lesson extras use
section spacing, dividers, and subtle left accents instead of stacking full
cards inside cards. Reserve framed surfaces for repeated cards, modals, practice
engines, and small functional elements such as formulas, matrix cells, or token
pills.

`LearningLabView` keeps the left sidebar intentionally shallow: an explicit
Home item appears at the top, followed only by top-level domains. The Home page
introduces the TorchViz-3D project, its learning goal, and the team ideals
behind the lab, then shows a catalog-backed syllabus/index so learners can scan
domains, track previews, lesson counts, and practice counts before opening a
path. Track and lesson structure belongs in the main content area on the right,
through the Home syllabus, domain course page, and lesson detail surfaces,
instead of expanding as a tree in the sidebar. The TorchViz brand/logo in the
sidebar is the Landing return affordance; there is no separate Back to landing
row.

The Learning Lab shell is responsive rather than a scaled-down desktop grid.
At desktop widths the domain sidebar remains persistent and collapsible. Below
the desktop breakpoint, the header exposes a menu button and the domain list
opens as an overlay drawer, leaving the learning content at full viewport
width. Escape and the backdrop dismiss compact navigation. Lesson pages use the
same pattern for the lesson rail: desktop keeps a collapsible rail beside the
lesson, while compact screens show an explicit table-of-contents action and a
dismissible right-side drawer. Dense catalogs initially expand only the current
chapter so the learner's location and lesson content remain visually primary.

Home, Review, and lesson surfaces share the Learning Lab theme primitives for
cards, panels, buttons, focus rings, radii, and muted text. Responsive layout
changes should preserve this semantic styling contract and must not expose
off-canvas navigation to keyboard or accessibility-tree users while it is
closed.

On desktop, Learning Home uses a product-level hero followed by a compact value
strip and a two-column curriculum directory. The hero derives domain, lesson,
and practice totals from the live catalog rather than hardcoding marketing
claims. Domain cards remain whole-card navigation targets and show factual
status, track previews, lesson count, and practice count; a quiet directional
affordance replaces a repeated primary CTA on every card. At standard laptop
widths the curriculum begins in the first viewport, while wide displays use a
larger content boundary instead of leaving excessive empty margins.

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
- Use the TorchViz brand/logo as the Learning Lab return-to-Landing affordance;
  do not add a separate Back to landing row.
- `Languages` icon-only for direct language toggles.
- `ChevronDown` and `Check` for menus.
- `Play`, `Pause`, `SkipBack`, and `SkipForward` for playback controls.
- `X`, `CircleAlert`, `CircleX`, `Check`, and `Lightbulb` for modal/status
  controls.

The language switch intentionally remains an app-wide direct two-mode toggle
with a standalone `Languages` icon; do not reintroduce text labels or language
dropdowns unless a later approved plan changes the interaction.

Learning Lab course-page copy, inline practice labels, hint-control accessibility
text, and Landing/Workspace/Lab language-toggle tooltips live in
`src/lib/localization.ts`. Vietnamese copy should preserve English technical
terms such as ReLU, MDP, Q-value, GridWorld, tensor, shape, output, kernel,
stride, and padding.

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
- Canonical lesson identity lives in the catalog. Legacy track or lesson ids
  should be represented as `routeAliases` that resolve to one canonical lesson
  attachment, not as duplicated lesson/practice content.
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

---
title: Learning Lab
type: Active Subsystem
updated: 2026-08-04
---

# Learning Lab

This page documents the active Landing Page and Learning Lab architecture. The
current content migration and catalog decisions are recorded in
[docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md](../../docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md),
with the current LLM lesson state in
[docs/plans/2026-07-21-llm-ai-landscape-intro-polish.md](../../docs/plans/2026-07-21-llm-ai-landscape-intro-polish.md)
and the retained Statistics corpus history in
[docs/plans/2026-07-29-statistics-import-artifact-cleanup.md](../../docs/plans/2026-07-29-statistics-import-artifact-cleanup.md).
The current Vietnamese-only Statistics contract is recorded in
[docs/plans/2026-07-30-statistics-vietnamese-only-test-doc-alignment.md](../../docs/plans/2026-07-30-statistics-vietnamese-only-test-doc-alignment.md).
The domain rename and complete Probability chapter replacement are recorded in
[docs/plans/2026-07-30-statistics-probability-chapter.md](../../docs/plans/2026-07-30-statistics-probability-chapter.md).

## Status

Learning Lab is the single learning container reached from Landing. It uses a
domain-first route:

```text
Learning Lab -> domain -> track -> lesson
```

The catalog contains 13 domains, 92 tracks, and 735 lesson nodes. It has 185
authored locale MDX files, including forty-nine Vietnamese-first lessons in
`llm-ai-engineering`, four Vietnamese CV exercises, and one hundred nineteen Vietnamese
lessons in Probability & Statistics (`statistics`). The other 550 nodes are
navigable placeholders and render one shared localized “content in progress”
message. They do not carry legacy theory or practice payloads.

The authored LLM lessons span the from-scratch path from project skeleton and
roadmap material through checkpoints, language modeling, inference, loss,
tokenization, and evaluation. Their prose, paging data, quizzes, references,
and structured visual inputs live in locale-specific MDX; LLM-specific visual and
stateful components stay in the React domain package. English UI still falls
back to the Vietnamese lesson source until an English MDX file is authored.

The authored CV exercise lessons are the four canonical shape/value lessons for
Conv2d and pooling. Each one owns its instructions and deterministic fixture
while the CV domain adapter lazy-loads the shared interaction surface. Published
lessons tagged `exercise` automatically populate Review mode, and corresponding
Workspace Forward Pass nodes resolve to the canonical lesson route.

Probability & Statistics is the canonical `statistics` domain, separate from
`math-statistics-ai`. It has eight tracks, 133 lesson nodes, 119 published
Vietnamese lessons, and 573 ordered pages. Seven tracks form the
applied-statistics core; `statistical-learning-extensions` keeps classification,
dimension reduction, trees, SVMs, deep learning, and unsupervised learning
optional. Fourteen missing-content nodes expose the planned core sequence
without claiming it is authored.

Chapter 1 first teaches the accessible vocabulary of experiments, outcomes,
sample spaces, and events. Its second lesson, `Xác suất là gì?`, then uses an
animated hidden coin to ask what 50% describes and previews two interpretation
branches: long-run frequency and belief under current information, with Naive
Bayes placed in the second branch. Its Quiz remains adjacent, followed
immediately by long-run frequency and forecast calibration. The remaining
separate lesson/Quiz pairs continue through event relations, the shared
probability calculus, information and conditioning, total probability/base
rates, then Bayes and the retained Naive Bayes worked sequence. Chapter 1
alternates nine theory lessons with nine adjacent `Quiz` nodes and ends with a
ten-question capstone: 70 theory and 45 quiz pages. Vietnamese MDX owns the
prose and KaTeX formulas; the Statistics adapter owns focused
`ProbabilityChapterVisual` diagrams and accessible deterministic interactions
for the covered coin, calibration, evidence strength, natural frequencies, and
classical coin mechanics.

Chapter 2 has 22 pages: a five-page statistical-thinking overview; six pages
on population, sample, representativeness, study design, and conclusion limits;
five pages on assumptions and responsible statistical reading; then a
six-question applied Quiz. Each theory node ends with a standalone takeaway,
and inline sampling/study-design activities remain lesson practice rather than
Review exercises. Chapter 3 now opens
with the 18-page `histogram-foundations` lesson before
descriptive data analysis. It carries one fixed dataset through observations,
number-line points, bins, stacked counts, and bars; compares too few, useful,
and too many bins on fixed axes; introduces square-root, Sturges, and
Freedman–Diaconis guidance; then maps the visual model to NumPy/Matplotlib and
an accessible live bin-count explorer. The later descriptive Histogram remains
an application for interpreting mean, median, mode, and skew rather than a
duplicate construction lesson. After the descriptive-data quiz, the 18-page
`normal-distribution` lesson continues from observed Histogram shape into the
Normal/Gaussian bell curve, symmetry, center and tails, mean and variance
controls, standard Normal z-scores, and the distinction between scaling and
normality. It then returns to observed data to recognize multimodal mixtures,
left/right skew, long tails, and possible outliers before
closing with a deterministic five-shape Histogram-reading interaction. Its
Vietnamese MDX owns the explanations, labels, formulas, examples, and Python
code; the focused domain-local React renderer owns chart geometry, parameter
state and calculations, scenario progression, responsive layout, and accessible
status updates. The one-time
importer and source reference were removed after validation, so the checked-in
TOC and Vietnamese MDX are the content source of truth. Vietnamese UI requests resolve the
authored locale directly. Other UI locales use the registry's final
available-locale fallback and therefore render the Vietnamese lesson source.

Learning Lab has no catalog practice contract, practice filter/query, or
Review-specific content list. The Review surface is only a derived catalog view
over authored exercise lessons.

Canonical domain, track, and lesson routes are preserved. Seventeen legacy
aliases, including the Probability Chapter 1 replacements and Reinforcement
Learning redirects, resolve to canonical catalog nodes instead of duplicating
content.

## Content Ownership

The ownership boundary is explicit:

```text
src/lib/localization.ts
  system/UI labels, accessibility text, and shared states

src/content/learning/<domain-id>/table-of-contents.ts
  localized domain/track/node metadata, ordering, status, fallback, aliases

src/content/learning/<domain-id>/[<chapter>.<section>.<node>-]<lesson-id>.<locale>.mdx
  authored lesson body, metadata, pages, quizzes, links, and visual inputs
```

The optional hierarchical numeric prefix keeps authored files in typed-TOC
order without becoming part of the canonical lesson ID. The LLM course uses
chapter-local names such as `1.1.6-language-modeling-next-token.vi.mdx` and
`1.5.1-llm-data-pipeline-overview.vi.mdx`; other domains may continue using
unprefixed filenames. Routes and `lessonMetadata.id` always use the lesson ID
without this organizational prefix.

Every navigable lesson has one TOC node. A locale-specific MDX file exists only
when that locale has authored lesson content. File existence is not navigation
availability: TOC navigation status (`available | next | locked`) remains
separate from content status (`missing | draft | published`). Only published
content resolves through the authored MDX registry.

Domain/track/node titles must not be reintroduced into `localization.ts`.
Lesson-body prose must not be added to a TOC. A new authored lesson is added by
creating its locale MDX and advancing its TOC content status through an approved
change.

## Runtime and Build Boundaries

```text
typed domain TOCs
  -> src/content/learning/index.ts
  -> src/core/learning/materializeCatalog.ts
  -> React-free learningCatalog
  -> selectors, routes, course pages, lesson rail, lesson detail

locale MDX files
  -> scripts/learningContentMdx.ts validation/search extraction
  -> Vite lazy compiled lesson registry + React-free virtual search documents
  -> LessonDetail + LessonRail
```

The stable catalog is a normal TypeScript export, not a Vite virtual module, so
Node tests and core selectors consume the same React-free data as runtime code.
The Vite virtual module contains generated search documents only. This prevents
catalog tests from depending on Vite and avoids a catalog-validation cycle.

MDX validation is generic across `src/content/learning/*/*.mdx`. It derives
identity from `<domain>/[<numeric-prefix>-]<lesson>.<locale>.mdx`, checks the file against the
catalog, rejects unpublished or unknown nodes, validates page and quiz ids, and
rejects imports, executable expressions, spread attributes, and components
outside the shared/domain allowlist. Raw MDX is not shipped beside the compiled
lesson module.

The compiled registry stores locale-aware dynamic import loaders and loads only
the selected lesson candidate. Route or locale changes discard stale async
results, and `LessonDetail` renders localized loading and failure states.
Production builds therefore emit authored lessons as independent chunks instead
of absorbing the full content corpus into `LearningLabView`.

Search indexes catalog metadata for all nodes. Published domains normally add
the authored body text; a TOC can select `searchTextMode: 'metadata'` for large
corpora. Probability & Statistics uses that mode and contributes its title,
headings, and keywords without embedding the complete lesson bodies in the
initial Learning Lab
chunk. The shared placeholder body is not indexed, preventing 550 missing nodes
from overwhelming authored results. Matching is case-insensitive and
Vietnamese-diacritic-insensitive.

## Active File Map

| Path | Responsibility |
|---|---|
| `src/components/learning/LearningLabView.tsx` | Route-aware Learning Lab shell and domain/track/lesson orchestration. |
| `src/components/learning/LearningLabHeader.tsx` | Path/Review mode, language, and responsive navigation controls. |
| `src/components/learning/shell/ReviewMode.tsx` | Tag-derived quick-review catalog for published exercise lessons. |
| `src/components/learning/shell/DomainCatalog.tsx` | Domain-first catalog entry surface. |
| `src/components/learning/shell/DomainCoursePage.tsx` | Shared domain course overview and track accordions. |
| `src/components/learning/lesson/LessonRail.tsx` | Searchable lesson rail, status filters, chapter collapse, and automatic scroll-to-center on lesson navigation. |
| `src/components/learning/lesson/LessonDetail.tsx` | Placeholder or compiled authored lesson rendering. |
| `src/components/learning/lesson/QuizBlock.tsx` | Shared stateful quiz behavior used by MDX. |
| `src/components/learning/learningMdxComponents.tsx` | Shared Markdown primitives, context, lesson frame, and quiz adapter. |
| `src/components/learning/learningMdxRegistry.tsx` | Generic lazy compiled lesson lookup, locale fallback, and optional domain component maps. |
| `src/components/learning/domains/llm-ai-engineering/mdxComponents.tsx` | Stable LLM MDX adapter and public component map. |
| `src/components/learning/domains/llm-ai-engineering/*Renderers.tsx` | LLM-only tokenizer, language-model, and concept renderer families behind the stable `renderers.tsx` barrel. |
| `src/components/learning/domains/llm-ai-engineering/rendererTypes.ts` | Domain-local authored-content shapes shared by the LLM renderer families. |
| `src/components/learning/domains/llm-ai-engineering/rendererTheme.ts` | Semantic light/dark tokens shared by repeated LLM visual roles. |
| `src/components/learning/domains/llm-ai-engineering/rendererPrimitives.tsx` | Typed token, ID, callout, and playback primitives used by LLM renderers. |
| `src/components/learning/domains/llm-ai-engineering/diagramPrimitives.tsx` | Shared DOM measurement, connector SVG, and probability-curve infrastructure for LLM diagrams. |
| `src/components/learning/domains/cv/mdxComponents.tsx` | CV-only MDX adapter that lazy-loads shared exercise surfaces. |
| `src/components/exercises/*` | Shared exercise engines, registry, and Workspace launcher. |
| `src/content/learning/<domain-id>/table-of-contents.ts` | One typed React-free catalog manifest per domain. |
| `src/content/learning/<domain-id>/<lesson-id>.<locale>.mdx` | Optional authored locale source. |
| `src/content/learning/statistics/table-of-contents.ts` | Probability & Statistics manifest with seven core tracks, one Statistical Learning Extensions track, 109 published lessons, fourteen explicit missing-content nodes, route aliases, and compact search mode. |
| `src/content/learning/statistics/*.vi.mdx` | Canonical Vietnamese Probability & Statistics lesson bodies for 119 published lesson ids and 573 ordered pages. |
| `src/components/learning/domains/statistics/mdxComponents.tsx` | Statistics-only MDX adapter for responsive Probability diagrams, Histogram/variance/Normal-distribution visualizations, the Statistical Thinking question atlas/branch comparison, and deterministic embedded interactions. |
| `src/components/learning/domains/statistics/normalDistributionRenderers.tsx` | Domain-local Normal-distribution chart geometry, mean/variance exploration, and deterministic Histogram-reading interaction consumed through the Statistics MDX adapter. |
| `src/components/learning/domains/statistics/varianceStandardDeviationRenderers.tsx` | Domain-local variance concept sequence, accessible point explorer, degrees-of-freedom constraint, and deterministic denominator comparison. |
| `src/content/learning/index.ts` | Concrete catalog assembly over the thirteen domain TOCs. |
| `src/content/learning/mdxComponents.ts` | React-free shared/domain MDX component allowlist. |
| `src/core/learning/types.ts` | React-free catalog contracts. |
| `src/core/learning/materializeCatalog.ts` | Pure catalog construction and invariant validation. |
| `src/core/learning/mdxContract.ts` | React-free filename, metadata, locale, and search normalization contract. |
| `src/core/learning/selectors.ts` | Pure catalog lookup helpers. |
| `src/components/learning/authoredTypes.ts` | Quiz and LLM renderer DTOs used by authored MDX adapters. |
| `src/components/learning/learningSearch.ts` | UI adapter over generated Vite search documents. |
| `src/components/learning/lesson/visibleLesson.ts` | Rail/detail visible-lesson selection policy. |
| `scripts/learningContentMdx.ts` | Node/Vite MDX validation and generated search documents. |

## UI Conventions

Learning Lab visual primitives live in `src/components/learning/theme.ts`.
Controls should use `getLearningLabTheme(theme)` and the semantic theme helpers
instead of adding unrelated colors, radii, hover states, or focus styles.
The active Learning Lab runtime is locked to light mode. The shared theme
contract remains in place for existing components, but new lesson-only visuals
should not add unreachable dark variants.

`LearningLabView` keeps a shallow left sidebar: Home followed by top-level
domains. Track and lesson structure belongs in the main course/lesson surface.
Desktop keeps persistent navigation; compact layouts use dismissible drawers
for the domain sidebar and lesson table of contents.

Learning Home uses one concise curriculum heading followed by a responsive
portrait-card grid. Each domain card reuses the shared Lucide domain icon and a
distinct visual palette while keeping catalog-derived status and lesson count.
Cards remain whole-card navigation targets and scale from one column on compact
screens to four or five columns on wider desktops without horizontal overflow.

`LessonDetail` owns one outer panel. Markdown, formulas, visual components, and
quizzes use spacing and dividers rather than nested decorative panels. Runtime
lesson media belongs under `src/assets/learning/<domain>/`; `docs/assets/` is
only for documentation artifacts.

The seventeen Statistics lessons with authored learning objectives reserve
their first `MdxPage` for a top-aligned, borderless checklist. The objectives
use the explicit `LessonNote variant="objectives"` rendering path; ordinary
notes, warnings, summaries, and takeaways keep the standard callout treatment.
Authored Markdown page titles and the objectives title use the semantic
deep-blue `pageTitleText` role and remain text-only; icons inside lesson content
retain their own semantic roles.

System copy, controls, empty states, filter labels, and language-toggle text
belong in `src/lib/localization.ts`. Catalog metadata and lesson content follow
the ownership boundary above.

Lesson traversal uses keyboard arrows: Up/Down move between lessons, Left/Right
move between section pages. The `LessonDetail` footer keeps the original section
pager (`← Back` / `Next →`) and the green `Too easy!` complete-and-advance
button; there are no on-screen lesson-arrow buttons. Quiz answers submit on
Enter. Both arrow-key handlers and the Enter handler are guarded
(`isTypingTarget` / `data-quiz`) so they never fire while typing in inputs, in
quiz options, or during drag interactions. After Enter submits a quiz answer, focus
returns to the lesson panel so the arrow keys resume navigating lessons and
section pages. When the lesson panel is focused on the last section with a next
lesson, pressing Enter again completes the lesson and continues (same as the
green `Too easy!` button).

The lesson rail automatically scrolls the selected lesson node into vertical
center whenever the active lesson changes (via click, keyboard, or programmatic
navigation). This uses `scrollIntoView({ block: 'center', behavior: 'smooth' })`
on the button element identified by `data-lesson-id`. The effect is driven by the
`selectedLesson.id` dependency in `LessonRail.tsx`, so it only fires when a
different lesson is selected, and it safely handles cases where the target
lesson node is not in the DOM (e.g., collapsed track or filtered out).

Unfinished lesson nodes use one blue marker/title treatment. Theory and Code
nodes retain chapter-local numbering; Quiz nodes are excluded from visible
numbering and use a dimmed question icon that regains emphasis on hover or
selection. Selected rows use a solid blue surface, while completed markers
remain green so progress continues to take precedence.

## Invariants

- `src/core/` remains React-free.
- Learning navigation enters through the unified catalog, not new top-level
  AppShell surfaces.
- Catalog identity is canonical; legacy ids are route aliases, not duplicate
  lesson nodes.
- Missing content uses the shared localized placeholder and has no authored
  theory, interaction, or practice descriptor.
- Authored lesson behavior enters through locale MDX and the generic registry.
- Review membership is derived from `published` lesson nodes tagged `exercise`;
  there is no parallel review or practice content record.
- Workspace exercise handoff resolves a React-free catalog entry point and opens
  the canonical lesson route without a practice query or duplicated fixture.
- The forty-nine authored LLM lessons retain their routes, paging, quiz
  state/reset, locale fallback, authored search text, and light-only runtime
  behavior.
- Probability & Statistics retains the canonical `statistics` domain id with
  119 Vietnamese authored MDX lessons, 573 ordered pages, seven core
  applied-statistics tracks, and a separate optional Statistical Learning
  Extensions track; other UI locales render the Vietnamese source through the
  registry's available-locale fallback.
- Learning Lab changes must not reset Workspace editor/canvas state.

## Related Pages

- [architecture](../architecture.md)
- [reinforcement-learning](reinforcement-learning.md)
- [state-store](state-store.md)
- [rendering](rendering.md)
- [reference/gotchas](../reference/gotchas.md)

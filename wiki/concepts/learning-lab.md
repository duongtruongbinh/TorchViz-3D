---
title: Learning Lab
type: Active Subsystem
updated: 2026-07-27
---

# Learning Lab

This page documents the active Landing Page and Learning Lab architecture. The
content migration and catalog decisions are recorded in
[docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md](../../docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md),
with the current 200-node LLM lesson state and execution evidence in
[docs/plans/2026-07-23-remediate-llm-domain-learning-flow.md](../../docs/plans/2026-07-23-remediate-llm-domain-learning-flow.md).

## Status

Learning Lab is the single learning container reached from Landing. It uses a
domain-first route:

```text
Learning Lab -> domain -> track -> lesson
```

The catalog contains 12 domains, 82 tracks, and 699 lesson nodes. Two
hundred and seven Vietnamese-first lessons have authored content: all 203 nodes
in `llm-ai-engineering` and four tagged exercise lessons in `cv`. The other
492 nodes are navigable placeholders and render one shared localized “content
in progress” message. They do not carry legacy theory or practice payloads.

The LLM course is published atomically at 203/203 canonical routes:

| Track | Nodes | Pages | Quiz nodes | Quiz questions |
|---|---:|---:|---:|---:|
| `1.1 llm-from-scratch-orientation` | 18 | 75 | 8 | 38 |
| `1.2 text-data-and-tokenization` | 18 | 81 | 8 | 36 |
| `1.3 attention-and-transformers-from-scratch` | 6 | 29 | 2 | 10 |
| `1.4 gpt-model-from-scratch` | 4 | 20 | 1 | 5 |
| `1.5 pretraining-and-generation` | 13 | 61 | 5 | 25 |
| `1.6 finetuning-and-alignment` | 13 | 61 | 4 | 20 |
| `2.1 llm-fundamentals` | 18 | 67 | 7 | 33 |
| `2.2 llm-evaluation` | 26 | 107 | 11 | 44 |
| `2.3 production-prompt-engineering` | 29 | 102 | 10 | 45 |
| `2.4 working-with-ai-apis` | 33 | 104 | 5 | 20 |
| `2.5 api-integration-patterns` | 18 | 57 | 3 | 12 |
| `2.6 secure-api-integration` | 7 | 24 | 2 | 9 |
| **Total** | **203** | **788** | **66** | **297** |

The target role audit classifies those nodes as 46 theory, 66 Quiz, 36
calculation, 31 code, 23 production-pattern, and one deliberately retained
hybrid. The exact order, role assignment, theory prerequisite, assessed
objective, and allowed prerequisites live in the test-only audit manifest
`src/lib/learningLlmFlow.test.ts`; runtime ownership remains the typed TOC and
locale MDX.

Every target theory node is followed immediately by exactly one recap Quiz.
No two target theory nodes are adjacent. Application flow then proceeds through
calculation or code, an application Quiz when it adds useful evidence, and a
production handoff. All Quiz nodes display `Quiz`, contain four or five
single-choice questions, place one question on each page, have exactly one
correct option, and use unique stable question/option IDs with explanatory
success and error feedback.

The initial remediation preserved all 177 pre-existing canonical LLM routes and
added 23 adjacent-theory Quiz routes. A later Chapter 1.1 bridge added three
routes for training data, common pretraining datasets, and their Quiz. Five
existing evaluation/safety routes
are intentionally reused as application Quizzes instead of creating parallel
practice payloads. Provider, streaming, retry, cost, secret, and lifecycle
lessons map provider-specific wire formats into explicit internal contracts;
current provider claims carry official-source verification dates and avoid
treating volatile aliases, limits, prices, or quotas as timeless facts.

All authored calculations state their inputs, units, intermediate values,
outputs, and invariants. Code lessons use self-contained deterministic examples
with imports, definitions, assertions, error paths, and the relevant
timeout/cancellation/retry/cleanup behavior. Prompt and evaluation lessons do
not request or persist hidden chain-of-thought, and production examples avoid
unconditional logging of prompts, responses, identity, credentials, tool
payloads, or PII.

Authored prose, paging data, quizzes, references, and structured visual inputs
remain in locale-specific MDX. LLM-specific visual and stateful components
remain React code under the LLM domain package. English UI currently falls back
to the Vietnamese lesson source until an English MDX file is authored.

Chapter 1.1 presents the AI landscape on two explicit axes: method families
(`AI -> ML -> DL`) and application domains (`CV`, `NLP`), with LLM highlighted
as the course focus at the DL/language intersection. The map is a learning
convention rather than an absolute historical taxonomy.

Chapter 1.2 retains one running text-to-tensor sequence:

```text
raw text -> tokens -> token IDs -> special-token boundaries
-> input/target windows -> batches (B,T)
-> token embeddings + positional embeddings -> model input (B,T,C)
```

Its checkpoints assess token boundaries, special-token roles,
window/batch/leakage reasoning, and embedding/position shape contracts before
the course introduces attention mechanics.

The authored CV exercise lessons are:

1. `conv2d-shape-exercise`
2. `conv2d-value-exercise`
3. `pooling-shape-exercise`
4. `pooling-value-exercise`

Each CV exercise is a normal canonical lesson, not a practice subnode. Its MDX
owns the instructions and deterministic fixture while the CV domain adapter
lazy-loads the shared Shape, Value, or convolution interaction. Published
lessons tagged `exercise` automatically populate Review mode. Applicable
Conv2d and pooling nodes in the Workspace Forward Pass controls resolve through
catalog entry-point metadata and open the canonical lesson route.

Learning Lab has no catalog practice contract, practice filter/query, or
Review-specific content list. The Review surface is only a derived catalog view
over authored exercise lessons.

Canonical domain, track, and lesson routes are preserved. Seven legacy aliases,
including the Reinforcement Learning redirects, resolve to canonical catalog
nodes instead of duplicating content.

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
  -> Vite compiled lesson registry + React-free virtual search documents
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

The shared MDX pipeline enables GFM tables and maps fenced code through the
Learning Lab `CodeBlock`. Python/`py` fences use the bundled Python highlighter;
other languages remain verbatim on the same code surface. Tables use shared
accessible markup and horizontal overflow on narrow screens.

Search indexes catalog metadata for all nodes and authored body text only for
published MDX. The shared placeholder body is not indexed, preventing 492
missing nodes from overwhelming authored results. Matching is case-insensitive
and Vietnamese-diacritic-insensitive.

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
| `src/components/learning/learningMdxRegistry.tsx` | Generic compiled lesson lookup plus optional domain component maps. |
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
| `src/content/learning/index.ts` | Concrete catalog assembly over the twelve domain TOCs. |
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

The shell is bounded to `100dvh`, propagates `min-h-0` through its flex chain,
and keeps lesson content as the sole vertical scroll owner. Short viewports
therefore retain the content scrollbar without changing Workspace's global
overflow contract.

Learning Home uses one concise curriculum heading followed by a responsive
portrait-card grid. Each domain card reuses the shared Lucide domain icon and a
distinct visual palette while keeping catalog-derived status and lesson count.
Cards remain whole-card navigation targets and scale from one column on compact
screens to four or five columns on wider desktops without horizontal overflow.

`LessonDetail` owns one outer panel. Markdown, formulas, visual components, and
quizzes use spacing and dividers rather than nested decorative panels. Runtime
lesson media belongs under `src/assets/learning/<domain>/`; `docs/assets/` is
only for documentation artifacts.

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
- All 200 authored LLM lessons retain canonical routing, paging, quiz
  state/reset, locale fallback, authored search text, and light-only runtime
  behavior.
- Learning Lab changes must not reset Workspace editor/canvas state.

## Related Pages

- [architecture](../architecture.md)
- [reinforcement-learning](reinforcement-learning.md)
- [state-store](state-store.md)
- [rendering](rendering.md)
- [reference/gotchas](../reference/gotchas.md)

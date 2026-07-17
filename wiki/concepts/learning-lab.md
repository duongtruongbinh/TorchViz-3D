---
title: Learning Lab
type: Active Subsystem
updated: 2026-07-15
---

# Learning Lab

This page documents the active Landing Page and Learning Lab architecture. The
current content migration and catalog decisions are recorded in
[docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md](../../docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md).

## Status

Learning Lab is the single learning container reached from Landing. It uses a
domain-first route:

```text
Learning Lab -> domain -> track -> lesson
```

The catalog contains 12 domains, 81 tracks, and 627 lesson nodes. Twenty-one
Vietnamese-first lessons have authored content: seventeen in `llm-ai-engineering`
and four tagged exercise lessons in `cv`. The other 606 nodes are navigable
placeholders and render one shared localized “content in progress” message.
They do not carry legacy theory or practice payloads.

The authored LLM lessons are:

1. `minimal-llm-project-skeleton`
2. `llm-from-scratch-roadmap`
3. `llm-component-checkpoint-quiz`
4. `llm-system-components`
5. `llm-system-components-quiz`
6. `language-modeling-next-token`
7. `language-modeling-next-token-quiz`
8. `ar-language-model-inference-pipeline`
9. `ar-language-model-inference-pipeline-quiz`
10. `llm-output-head-and-loss`
11. `llm-output-head-and-loss-quiz`
12. `llm-next-token-loss`
13. `llm-next-token-loss-quiz`
14. `llm-scale-and-development`
15. `llm-scale-and-development-quiz`
16. `llm-data-pipeline-overview`
17. `llm-data-pipeline-checkpoint-quiz`

Their authored prose, paging data, quizzes, references, and structured visual
inputs live in locale-specific MDX. LLM-specific visual and stateful components
remain React code under the LLM domain package. English UI currently falls back
to the Vietnamese lesson source until an English MDX file is authored.

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

src/content/learning/<domain-id>/<lesson-id>.<locale>.mdx
  authored lesson body, metadata, pages, quizzes, links, and visual inputs
```

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
identity from `<domain>/<lesson>.<locale>.mdx`, checks the file against the
catalog, rejects unpublished or unknown nodes, validates page and quiz ids, and
rejects imports, executable expressions, spread attributes, and components
outside the shared/domain allowlist. Raw MDX is not shipped beside the compiled
lesson module.

Search indexes catalog metadata for all nodes and authored body text only for
published MDX. The shared placeholder body is not indexed, preventing 606
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
| `src/components/learning/lesson/LessonRail.tsx` | Searchable lesson rail, status filters, and chapter collapse. |
| `src/components/learning/lesson/LessonDetail.tsx` | Placeholder or compiled authored lesson rendering. |
| `src/components/learning/lesson/QuizBlock.tsx` | Shared stateful quiz behavior used by MDX. |
| `src/components/learning/learningMdxComponents.tsx` | Shared Markdown primitives, context, lesson frame, and quiz adapter. |
| `src/components/learning/learningMdxRegistry.tsx` | Generic compiled lesson lookup plus optional domain component maps. |
| `src/components/learning/domains/llm-ai-engineering/*` | LLM-only custom MDX components and renderers. |
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

System copy, controls, empty states, filter labels, and language-toggle text
belong in `src/lib/localization.ts`. Catalog metadata and lesson content follow
the ownership boundary above.

Lesson traversal uses keyboard arrows: Up/Down move between lessons, Left/Right
move between section pages. The `LessonDetail` footer keeps the original section
pager (`← Back` / `Next →`) and the green `Too easy!` complete-and-continue
button; there are no on-screen lesson-arrow buttons. Quiz answers submit on
Enter. Both arrow-key handlers and the Enter handler are guarded
(`isTypingTarget` / `data-quiz`) so they never fire while typing in inputs, in
quiz options, or during drag interactions. After Enter submits a quiz answer, focus
returns to the lesson panel so the arrow keys resume navigating lessons and
section pages. When the lesson panel is focused on the last section with a next
lesson, pressing Enter again completes the lesson and continues (same as the
green `Too easy!` button).

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
- The seventeen LLM lessons retain their routes, paging, quiz state/reset, locale
  fallback, authored search text, and light/dark behavior.
- Learning Lab changes must not reset Workspace editor/canvas state.

## Related Pages

- [architecture](../architecture.md)
- [reinforcement-learning](reinforcement-learning.md)
- [state-store](state-store.md)
- [rendering](rendering.md)
- [reference/gotchas](../reference/gotchas.md)

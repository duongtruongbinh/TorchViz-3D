---
title: Learning Lab Content Architecture Migration
status: done
created: 2026-07-14T08:02:31+07:00
updated: 2026-07-14T11:56:59+07:00
author: Nguyen Manh Khiem and Codex
task: "replace duplicated Learning Lab catalog/content ownership with typed domain TOCs, locale MDX, authored CV exercises, derived Review mode, and canonical Workspace handoff"
---

# Goal

Make Learning Lab content ownership explicit and compact:

- typed domain TOCs own navigation metadata;
- locale-specific MDX owns authored lesson content;
- `localization.ts` owns system/UI text only;
- React-free core catalog and selectors remain usable by runtime and Node tests;
- exercise lessons use the same canonical lesson route as ordinary content;
- placeholder nodes do not require placeholder MDX files or legacy practice
  payloads.

This document is the single plan and execution record for the Learning Lab
content-pipeline work on `refactor/llm-content-pipeline`. It consolidates the
original MDX pilot, generic pipeline, typed-TOC migration, content cleanup, and
CV exercise continuation.

# Final State

The catalog contains:

| Metric | Final value |
|---|---:|
| Domains | 12 |
| Tracks | 81 |
| Lesson nodes | 615 |
| Published/authored lessons | 9 |
| Shared-placeholder lessons | 606 |
| Navigation states | 17 available / 2 next / 596 locked |
| Route aliases | 7 |
| Locale MDX files | 9 |

The five authored `llm-ai-engineering` lessons are:

1. `minimal-llm-project-skeleton`
2. `llm-from-scratch-roadmap`
3. `llm-component-checkpoint-quiz`
4. `llm-data-pipeline-overview`
5. `llm-data-pipeline-checkpoint-quiz`

The four authored `cv` exercise lessons are:

1. `conv2d-shape-exercise`
2. `conv2d-value-exercise`
3. `pooling-shape-exercise`
4. `pooling-value-exercise`

Every other node is navigation metadata plus one shared localized “content in
progress” state. No placeholder MDX is generated.

# Ownership Contract

```text
src/lib/localization.ts
  system controls, accessibility text, empty/shared states

src/content/learning/<domain-id>/table-of-contents.ts
  domain/track/lesson titles, descriptions, order, navigation status,
  content status, locale fallback, aliases, tags, external entry points

src/content/learning/<domain-id>/<lesson-id>.<locale>.mdx
  authored prose, pages, quiz data, references, visual inputs, exercise fixture

src/components/learning/domains/<domain-id>/
  optional domain React adapters and stateful visual components
```

Rules:

- Every navigable lesson has exactly one TOC node.
- An MDX file exists only for an authored locale.
- Navigation status (`available | next | locked`) and content status
  (`missing | draft | published`) are independent.
- Only published content enters the compiled lesson registry.
- Catalog titles are canonical navigation/search titles. MDX metadata repeats
  identity/title only as a validation assertion.
- English UI falls back through each domain’s explicit locale fallback; LLM
  and CV currently fall back to Vietnamese authored content.
- Lesson prose and domain metadata must not return to `localization.ts`.

# Architecture Decisions

## Typed TOCs, not MDX catalog files

Static catalog data uses one `table-of-contents.ts` per domain. It does not pass
through the MDX compiler. `src/core/learning/materializeCatalog.ts` owns pure
construction and validation, while `src/content/learning/index.ts` assembles
the twelve manifests and exports the stable React-free `learningCatalog`.

The catalog is a normal TypeScript module rather than a Vite virtual module.
Browser runtime, selectors, scripts, and Node tests therefore consume the same
data without a Vite dependency or catalog-validation cycle.

## Generic authored-content pipeline

```text
typed TOCs
  -> pure catalog materializer
  -> learningCatalog
  -> selectors, routes, rail, detail, Review, Workspace target lookup

locale MDX
  -> scripts/learningContentMdx.ts
  -> identity/metadata/component/fixture validation
  -> compiled lesson registry + generated React-free search documents
  -> LessonDetail + LessonRail
```

The generic validator rejects unknown or unpublished nodes, path/metadata
drift, duplicate locales/ids, invalid page or quiz indexes, imports,
re-exports, executable expressions, spread props, and components outside the
shared/domain allowlist. CV exercise fixtures additionally require valid NCHW
shapes and catalog operation-family parity.

Search indexes catalog identity/title for every node and visible authored MDX
text only for published lessons. It excludes component syntax, fixture keys,
internal ids, URLs, and the repeated placeholder sentence.

## Exercise lessons and Review

An exercise is a canonical lesson tagged `exercise`, not a practice subnode.
Each CV exercise lesson declares one React-free `torchviz-exercise` entry point
with an exercise id and normalized operation family. Its MDX owns instructions
and a deterministic fixture; the CV adapter lazy-loads the shared Shape, Value,
or convolution exercise surface.

Review mode is derived from `published && tags.includes('exercise')`. It has no
handwritten lesson list, duplicated content object, progress store, or separate
route identity. Selecting a Review card opens the canonical lesson.

The Workspace Forward Pass menu intersects the existing exercise registry with
published catalog entry points. It dynamically loads the catalog only while
resolving an active exercise target and opens the canonical HashRouter lesson
URL in a new tab. It does not pass the live node, add a `practice` query, or
restore practice ids.

## Removed compatibility layers

Caller audits permitted removal of:

- twelve static domain content modules and `seed.ts`;
- handwritten catalog assembly;
- LLM `tracks.ts`, `approval.ts`, `references.ts`, and package index;
- duplicate domain/track/lesson content maps in `localization.ts`;
- legacy lesson extras and compatibility renderers;
- Learning practice descriptors, registry, adapters, renderers, queries, and
  practice-specific tests;
- the former static Review content path and Workspace practice deep link.

The standalone exercise engines remain because CV lessons and Workspace both
have active callers.

# Target Tree

```text
src/content/learning/
  index.ts
  mdxComponents.ts
  <12 domains>/
    table-of-contents.ts
  llm-ai-engineering/
    <5 lesson-id>.vi.mdx
  cv/
    conv2d-shape-exercise.vi.mdx
    conv2d-value-exercise.vi.mdx
    pooling-shape-exercise.vi.mdx
    pooling-value-exercise.vi.mdx

src/core/learning/
  materializeCatalog.ts
  mdxContract.ts
  selectors.ts
  types.ts

src/components/learning/
  authoredTypes.ts
  learningMdxComponents.tsx
  learningMdxRegistry.tsx
  learningSearch.ts
  domains/llm-ai-engineering/*
  domains/cv/mdxComponents.tsx
  lesson/visibleLesson.ts
  shell/ReviewMode.tsx

src/components/exercises/
  ConvExercise.tsx
  ShapeExercise.tsx
  ValueExercise.tsx
  ExerciseLauncher.tsx
  exerciseRegistry.ts

scripts/
  learningContentMdx.ts
```

# Migration and Rollback Boundaries

1. Generalize filename parsing, metadata validation, locale fallback, compiled
   lookup, component composition, and search extraction around the five LLM
   reference lessons.
2. Move the twelve domains to typed TOCs behind the stable catalog export and
   prove count/order/status/alias parity before removing old modules.
3. Move localized navigation metadata into TOCs and reduce localization to
   system copy. Remove non-LLM legacy prose and practice payloads only after
   caller audits.
4. Add four tagged CV exercise lessons, their MDX fixtures, lazy adapter,
   derived Review mode, and Workspace entry-point resolution.
5. Verify core remains React-free, all published lessons validate, routes and
   aliases resolve, LLM paging/quizzes/search remain intact, and exercise
   targets have registry parity.

The public rollback boundary was `src/core/learning/content/index.ts` until old
catalog modules were removed. After deletion, Git commits provide the rollback
boundary: the original five authored LLM files are independent from the typed
TOC/content-cleanup changes, while Review/Workspace callers can be reverted
without removing canonical CV lessons.

# Verification and Metrics

Final verification on 2026-07-14:

- `npm run verify`: passed TypeScript, 106/106 Node tests, and the 2,497-module
  Vite production build;
- `git diff --check`: passed;
- nine published lessons matched nine locale MDX files;
- seven legacy aliases and the HashRouter subpath helper passed route tests;
- no `LearningPractice`, practice registry, practice query, or static Review
  lesson list remained.

Measured content/tooling changes:

- authored MDX: 5 -> 9 files; the four CV lessons add 96 LOC;
- generic MDX validator: 264 -> 299 LOC after CV fixture validation;
- test suite: 101 -> 106 cases for CV/Review/Workspace continuation;
- the 936-line convolution exercise moved to shared ownership without being
  duplicated;
- CV runtime surfaces added a 73-line adapter, 68-line Review view, and 77-line
  launcher.

Final production chunks (minified/gzip):

| Chunk | Size |
|---|---:|
| LearningLabView | 191.64 / 52.07 kB |
| TorchVizWorkspace | 188.05 / 50.80 kB |
| Dynamic catalog | 52.56 / 16.31 kB |
| Shared selectors | 3.82 / 1.28 kB |
| Conv exercise | 16.83 / 5.43 kB |
| Value exercise | 25.57 / 7.25 kB |
| Shape exercise | 29.88 / 8.52 kB |

The exercise engines and Workspace catalog remain lazy. The active Learning Lab
shell is light-only; CV exercise lesson backgrounds use a scoped light palette
without changing Workspace modal styling.

# Approved Addendum: Learning Core Boundary Cleanup

Approved in conversation on 2026-07-14. This addendum continues the completed
content migration in this existing compact plan; no separate plan document is
created.

## Goal

Keep `src/core/learning` as the shared React-free domain boundary while making
its dependency direction and ownership precise. Core must define contracts,
pure catalog materialization, selectors, and shared MDX parsing helpers; it
must not own authored content assembly, Vite runtime adapters, or view-specific
selection policy.

## Decisions

- Move the twelve-TOC assembly and `learningCatalog` instance to
  `src/content/learning/index.ts`; core must no longer import authored content.
- Keep pure catalog construction and validation under
  `src/core/learning/materializeCatalog.ts`.
- Flatten the shared MDX parser/locale/search normalization contract to
  `src/core/learning/mdxContract.ts`.
- Place the React-free domain MDX component allowlist beside authored content
  under `src/content/learning/mdxComponents.ts`.
- Move the Vite virtual search-document adapter beside Learning UI runtime
  consumers and move visible-lesson selection policy beside lesson UI.
- Move authored quiz/LLM renderer DTOs out of the catalog contract and into a
  shared Learning component type module.
- Preserve all catalog counts, authored content, routes, Review derivation,
  Workspace exercise handoff, MDX validation, lazy loading, and UI behavior.

## Execution Phases

1. Separate pure catalog materialization from the concrete content-owned
   catalog instance.
2. Relocate MDX contracts, allowlists, search adapter, visible-lesson policy,
   and authored renderer DTOs to their owning layers.
3. Update imports, tests, Vite configuration, and existing architecture/wiki
   references; remove the obsolete `src/core/learning/content` tree.
4. Run `npm run verify` and `git diff --check`, then record the final file map
   and verification result in this plan and the existing Learning Lab wiki.

## Out of Scope

- No catalog metadata or MDX body changes.
- No route, UI, exercise, search, or localization behavior changes.
- No feature-folder rewrite and no new documentation page.

## Addendum Execution Log

- 2026-07-14 11:50 +07:00 — Addendum approved and execution started.
- 2026-07-14 11:56 +07:00 — Moved concrete TOC assembly to
  `src/content/learning/index.ts`, extracted pure catalog materialization, and
  removed the obsolete `src/core/learning/content` tree.
- 2026-07-14 11:56 +07:00 — Moved authored renderer DTOs, Vite search access,
  visible-lesson policy, and MDX allowlists to their owning content/UI layers.
  `src/core/learning` is now four React-free files totaling 483 lines.
- 2026-07-14 11:56 +07:00 — Added a regression test enforcing that Learning
  core does not import authored content or React UI. `npm run verify` passed
  TypeScript, 107/107 tests, and the 2,498-module production build;
  `git diff --check` passed.

# Completion

The requested architecture is implemented and documented. Runtime behavior,
catalog validation, authored content, search, Review membership, and Workspace
handoff now derive from one catalog/MDX contract rather than parallel practice
or localization payloads. The approved boundary-cleanup addendum additionally
leaves `src/core/learning` as a one-way, React-free dependency containing only
shared contracts, catalog materialization, selectors, and MDX helpers.

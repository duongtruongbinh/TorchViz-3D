---
title: Learning Lab Content Architecture and LLM Course
status: done
created: 2026-07-14T08:02:31+07:00
updated: 2026-07-17T20:10:00+07:00
author: nmkhiem
task: "replace duplicated Learning Lab catalog/content ownership with typed domain TOCs, locale MDX, authored CV exercises, derived Review mode, and canonical Workspace handoff"
supersedes:
  - docs/plans/2026-07-14-learning-home-course-card-grid.md
---

# Goal

Give Learning Lab one explicit content pipeline:

```text
typed domain TOCs -> React-free catalog -> selectors/routes
locale MDX -> validated authored registry -> lesson UI/search
```

Navigation metadata belongs to typed TOCs, authored lesson content belongs to
locale MDX, and `localization.ts` contains system/UI copy only. Exercises use
canonical lesson routes; Review and Workspace derive their targets from the same
catalog instead of parallel practice payloads.

# Lineage

This plan absorbs the earlier untracked LLM planning history and retains its
Vietnamese-first content and renderer decisions for the first five lessons. Its
course-card convention continues [Learning Lab UI/UX Review and Polish](./2026-07-12-learning-lab-ui-ux-polish.md).

# Durable Decisions

## Ownership

- `src/content/learning/<domain>/table-of-contents.ts` owns domain, track, and
  lesson navigation metadata.
- `src/content/learning/<domain>/<lesson>.<locale>.mdx` exists only for
  authored locales and owns prose, quiz data, references, visuals, and exercise
  fixtures.
- `src/core/learning` remains React-free and contains contracts, pure catalog
  materialization, selectors, and shared MDX parsing helpers.
- `src/content/learning/index.ts` assembles the concrete catalog.
- Domain React adapters stay under
  `src/components/learning/domains/<domain>/`.

Every navigable lesson has one TOC node. Navigation status and content status
remain independent. Only published MDX enters the compiled registry, and locale
fallback is declared per domain.

## Runtime Flow

- The generic MDX validator rejects unknown or unpublished nodes, identity
  drift, invalid indexes, executable expressions, unsupported components, and
  invalid CV fixtures.
- Search indexes catalog identity for every node and visible authored text for
  published lessons; it excludes syntax, internal ids, URLs, and placeholder
  copy.
- Exercise lessons are canonical lessons tagged `exercise`. Review derives
  from published tagged lessons; Workspace resolves their catalog entry points
  and opens canonical HashRouter lesson URLs.
- Exercise engines and the Workspace catalog remain lazy-loaded.

## LLM Course and Visual Language

- Preparation, tokenization, and system-component surfaces reuse the Learning
  Home portrait-card convention: a 150px visual band, 410px minimum desktop
  height, deterministic soft palettes, responsive grids, and readable neutral
  bodies. Resting cards remain level; elevation is limited to hover or keyboard
  focus.
- The original Roadmap was split into focused lesson/quiz pairs covering the AI
  landscape, LLM system components, language modeling, AR inference, output
  projection/softmax, cross-entropy training, and scale/development. The first
  Roadmap route id remains canonical.
- Domain-scoped MDX renderers own code-native diagrams and interaction while
  locale MDX owns lesson prose, examples, formulas, progressive focus, and quiz
  payloads. KaTeX renders probability, chain-rule, projection, and loss math.
- AR inference and output-head lessons use fixed-topology progressive diagrams.
  The loss lesson combines an accessible autoplay sequence, manual controls,
  hand calculation, a normalized probability distribution, a loss curve, and
  the sequence-NLL derivation.
- Quiz coverage follows taught concepts; distractors target nearby conceptual
  confusions and correct-answer positions are not patterned.
- Authored MDX filenames may carry a chapter-local numeric prefix for filesystem
  ordering. The parser strips that prefix before catalog validation, so lesson
  IDs, metadata, routes, and typed-TOC ownership remain canonical.
- Visible lesson numbering resets inside each chapter, while previous/next
  traversal continues to use the domain-wide lesson order.
- The tokenization sequence now teaches motivation, a six-page regex tokenizer
  walkthrough and aligned quiz, BPE training/inference and limitations, then
  token-ID/vocabulary encode/decode. The broad training-and-generation overview
  belongs to chapter 1.5 rather than the tokenization chapter.
- Static MDX props accept negative numeric literals only as unary minus applied
  directly to a number; other unary and executable expressions remain rejected.

## Removed Compatibility Layers

The migration removed handwritten catalog assembly, static domain content
modules, legacy LLM content maps, duplicate localization payloads, practice
descriptors/registries/routes, and the static Review list. Shared exercise
engines remain active.

# Final State

| Metric | Value |
|---|---:|
| Domains | 12 |
| Tracks | 81 |
| Lesson nodes | 630 |
| Published lessons | 28 |
| Published LLM lessons | 24 |
| Shared placeholders | 602 |

Published content comprises twenty-four `llm-ai-engineering` lessons and four CV
exercise lessons. All other nodes use one shared localized in-progress state;
no placeholder MDX is generated.

# Compacted Tokenization Follow-up History

The following short plans were executed on 2026-07-16 and 2026-07-17, then
absorbed here so the content migration has one walkable owning history. Their
repeated approval/checkpoint boilerplate was removed; the durable decisions,
corrections, outcomes, and verification evidence remain below.

| Absorbed history | Preserved decisions and outcome |
|---|---|
| MDX ordering and chapter placement | Added optional hierarchical filename prefixes without changing canonical identity; moved the training/generation overview pair from tokenization to chapter 1.5; separated domain-wide traversal indexes from chapter-local display indexes. Prefix parsing and catalog expectations received regression coverage. |
| BPE lesson and quiz | Reworked the code-readability visual, taught initialization and merge-rank inference, split token-boundary and token-free material into dedicated pages, and replaced animation-recall questions with misconception-based application questions. The final four-page lesson and four-question quiz retain responsive, reduced-motion, light/dark, and static-MDX boundaries. |
| Token IDs and vocabulary | Published the former placeholder as a focused two-page lesson. The retained visual explains vocabulary lookup and a connected text → tokenizer → IDs → AR model → selected ID → detokenizer → text round trip with one shared vocabulary; the rejected intermediate card sequence and superseded third model-contract page are not part of the final lesson. |
| Regex tokenizer walkthrough | Published an original, self-contained six-page regex tokenizer lesson between the motivation quiz and BPE, added an input-to-token preview, separated reusable-function construction from full-text application, and added a five-question quiz aligned only to taught stages. No third-party sample passage or live Python dependency was introduced. |
| Static negative literals | Corrected the MDX ESTree reader to use `UnaryExpression.argument`, retained the executable-expression prohibition, and added acceptance/rejection regression coverage. |

The absorbed source plans were:
`2026-07-16-llm-mdx-chapter-node-prefixes.md`,
`2026-07-16-move-llm-pipeline-to-pretraining-generation.md`,
`2026-07-16-reset-learning-node-numbers-per-chapter.md`,
`2026-07-16-tokenizer-code-readability-polish.md`,
`2026-07-16-deepen-bpe-tokenizer-quiz.md`,
`2026-07-16-expand-bpe-theory-and-realign-quiz.md`,
`2026-07-16-rebalance-bpe-quiz-distractors.md`,
`2026-07-16-split-token-boundaries-and-token-free-pages.md`,
`2026-07-16-token-ids-vocabulary-lesson.md`,
`2026-07-17-learning-mdx-negative-literals.md`,
`2026-07-17-simple-regex-tokenizer-lesson.md`,
`2026-07-17-regex-tokenizer-input-token-diagram.md`,
`2026-07-17-regex-tokenizer-final-pages-pacing.md`,
`2026-07-17-regex-tokenizer-code-quiz.md`,
`2026-07-17-token-id-ar-pipeline-connection.md`, and
`2026-07-17-token-id-round-trip-chart-redesign.md`.

# Verification

The completed migration passed:

- `npm run verify`: TypeScript, 107 Node tests, MDX validation, and the
  2,498-module production build;
- `git diff --check`;
- catalog/MDX parity, route aliases, canonical lesson handoff, and the
  React-free Learning core boundary regression test.

# Out of Scope

- Catalog copy or lesson-body rewrites.
- Route, UI, search, localization, or exercise behavior changes.
- A feature-folder rewrite or new documentation page.

# Execution Log

- 2026-07-14 — Migrated twelve domains to typed TOCs and a generic locale-MDX
  pipeline; removed obsolete catalog, localization, and practice layers.
- 2026-07-14 — Added four canonical CV exercise lessons, derived Review mode,
  and Workspace entry-point resolution.
- 2026-07-14 — Moved concrete catalog assembly and authored/runtime adapters out
  of `src/core/learning`; added a regression test for its React-free boundary.
- 2026-07-14 — Final `npm run verify` passed with 107 tests and a
  2,498-module production build; `git diff --check` passed.
- 2026-07-15 — Removed unused `ConceptHighlightCard` and
  `ConceptPanelConnector` helpers plus the resulting unused icon imports.
  `npm run typecheck` and `git diff --check` passed.
- 2026-07-15 — Compacted this plan by merging repeated architecture, final
  state, metrics, completion, and historical sections while preserving durable
  decisions, lineage, and verification evidence.
- 2026-07-14 to 2026-07-15 — Aligned prerequisite and tokenization cards with
  the Learning Home card family; added formula-led Language Modeling and AR
  content with KaTeX; split the Roadmap into focused lesson/quiz pairs.
- 2026-07-15 — Added progressive AR inference and output-head diagrams, then a
  dedicated cross-entropy lesson with animation, manual calculation, loss curve,
  and sequence-NLL derivation. Static metadata, page-index, component, formula,
  and whitespace checks passed throughout these iterations.
- 2026-07-15 — Audited all published LLM quizzes against taught concepts,
  strengthened distractors, removed answer-position patterns, and confirmed
  question counts match quiz metadata.
- 2026-07-15 — Absorbed the durable decisions and outcomes from
  `2026-07-14-llm-preparation-course-cards.md`, then removed that redundant
  533-line plan. Repository-wide reference search and `git diff --check` passed.
- 2026-07-16 to 2026-07-17 — Published and refined the tokenization sequence,
  added stable chapter-local MDX filename ordering and visible numbering, moved
  the broad pipeline pair to chapter 1.5, and fixed negative numeric literal
  validation. Focused catalog/MDX tests and typechecks passed throughout; the
  completed regex lesson/quiz run passed 16 focused tests and typecheck.
- 2026-07-17 — Compacted sixteen small tokenization follow-up plans into this
  owning plan. Preserved their final decisions, corrections, outcomes, lineage
  names, and verification evidence; removed superseded intermediate detail and
  repeated workflow boilerplate.
- 2026-07-17 to 2026-07-28 — Absorbed follow-up LLM domain plans:
  - `2026-07-17-compact-llm-domain-docs-and-cleanup.md`: Compacted LLM domain docs & code audit cleanup. Removed unused `TokenizerModelContract` chain and unreferenced animations.
  - `2026-07-20-token-id-vocabulary-visual-split.md`: Published 3-page theory lesson, adjacent quiz, and 4-page GPT-4o/ViT5 code walkthrough for token IDs/vocabulary.
  - `2026-07-20-refactor-llm-domain-renderers.md`: Refactored 3,495-line LLM renderer file into `tokenizerRenderers`, `languageModelRenderers`, `conceptRenderers`, `rendererTypes`, and `rendererPrimitives`.
  - `2026-07-21-llm-ai-landscape-intro-polish.md`: Polished interactive AI/ML/DL/CV/NLP/LLM scope visual, Evaluation & Safety chapter (20 lessons), and typography hierarchy.
  - `2026-07-28-inference-pipeline-diagram-polish.md`: Added dashed container block around Sample → Detokenize stage, aligned visual entities, and added dynamic SVG connector paths & autoregressive loop indicator.


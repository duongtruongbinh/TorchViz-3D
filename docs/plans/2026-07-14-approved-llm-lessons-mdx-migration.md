---
title: Learning Lab Content Architecture Migration
status: done
created: 2026-07-14T08:02:31+07:00
updated: 2026-07-15T00:00:00+07:00
author: Nguyen Manh Khiem and Codex
task: "replace duplicated Learning Lab catalog/content ownership with typed domain TOCs, locale MDX, authored CV exercises, derived Review mode, and canonical Workspace handoff"
supersedes: []
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

Genesis plan. It absorbs the earlier untracked LLM planning history and retains
its Vietnamese-first content and renderer decisions for the first five lessons.

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
| Lesson nodes | 615 |
| Published lessons | 9 |
| Shared placeholders | 606 |
| Locale MDX files | 9 |
| Route aliases | 7 |

Published content comprises five `llm-ai-engineering` lessons and four CV
exercise lessons. All other nodes use one shared localized in-progress state;
no placeholder MDX is generated.

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

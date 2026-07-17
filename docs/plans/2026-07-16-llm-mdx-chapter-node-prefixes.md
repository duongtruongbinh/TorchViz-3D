---
title: LLM MDX Chapter and Node Filename Prefixes
status: done
created: 2026-07-16T13:42:22+07:00
updated: 2026-07-16T13:50:00+07:00
author: Nguyen Manh Khiem and Codex
task: "rename authored LLM Learning Lab MDX files with stable chapter-and-node prefixes"
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Make the authored `llm-ai-engineering` MDX files sort in table-of-contents order
without using one global sequence that forces unrelated later chapters to be
renumbered.

Success means chapter 1.1 uses `1.1.1-` through `1.1.15-`, chapter 1.2 uses
`1.2.1-` and `1.2.2-`, and all canonical lesson IDs, metadata, routes, and
runtime behavior remain unchanged.

# Lineage

Supersedes [Learning Lab Content Architecture and LLM Course](./2026-07-14-approved-llm-lessons-mdx-migration.md),
which established locale MDX as the authored-content boundary and the typed TOC
as the owner of lesson ordering and identity.

# Context Read

- `src/content/learning/llm-ai-engineering/table-of-contents.ts` defines the
  chapter and node order used for the prefixes.
- `src/core/learning/mdxContract.ts` currently treats the complete filename stem
  as the lesson ID, so it must recognize and remove an optional hierarchical
  numeric prefix before validating identity.
- `src/components/learning/learningMdxRegistry.tsx` and
  `scripts/learningContentMdx.ts` consume that shared parser.
- `src/lib/learningMdxContent.test.ts` validates filename-to-catalog parity, and
  `src/lib/learningSearch.test.ts` contains one direct LLM MDX path.
- `wiki/concepts/learning-lab.md` is the existing owner for the locale-MDX
  filename and content-ownership convention.

# Decisions (locked)

- Use `<chapter>.<section>.<node>-<lesson-id>.<locale>.mdx`, for example
  `1.1.1-minimal-llm-project-skeleton.vi.mdx`.
- Number nodes independently inside each TOC chapter. Adding or reordering a
  node in chapter 1.2 does not rename files in chapter 1.1 or later chapters.
- Preserve all `lessonMetadata.id` values, TOC lesson IDs, URLs, quiz IDs,
  renderer keys, and asset paths.
- Teach the shared MDX path parser to accept an optional prefix made of at least
  two dot-separated numeric segments followed by `-`. Existing unprefixed MDX
  files in other domains remain valid.
- Add regression coverage proving both prefixed and unprefixed filenames map to
  the correct canonical lesson ID.
- Update the existing Learning Lab wiki page rather than create a new reference
  page.

# Target Renames

## Chapter 1.1 Overview

1. `1.1.1-minimal-llm-project-skeleton.vi.mdx`
2. `1.1.2-llm-from-scratch-roadmap.vi.mdx`
3. `1.1.3-llm-component-checkpoint-quiz.vi.mdx`
4. `1.1.4-llm-system-components.vi.mdx`
5. `1.1.5-llm-system-components-quiz.vi.mdx`
6. `1.1.6-language-modeling-next-token.vi.mdx`
7. `1.1.7-language-modeling-next-token-quiz.vi.mdx`
8. `1.1.8-ar-language-model-inference-pipeline.vi.mdx`
9. `1.1.9-ar-language-model-inference-pipeline-quiz.vi.mdx`
10. `1.1.10-llm-output-head-and-loss.vi.mdx`
11. `1.1.11-llm-output-head-and-loss-quiz.vi.mdx`
12. `1.1.12-llm-next-token-loss.vi.mdx`
13. `1.1.13-llm-next-token-loss-quiz.vi.mdx`
14. `1.1.14-llm-scale-and-development.vi.mdx`
15. `1.1.15-llm-scale-and-development-quiz.vi.mdx`

## Chapter 1.2 Text Data & Tokenization

1. `1.2.1-llm-data-pipeline-overview.vi.mdx`
2. `1.2.2-llm-data-pipeline-checkpoint-quiz.vi.mdx`

# Phases

## Phase 0 — Store and approve this plan

- Store the plan as draft and wait for explicit approval.
- After approval, update its status to `approved`, then `executing` before
  implementation.

## Phase 1 — Support stable filename prefixes

- Extend the shared path parser without changing its public result shape.
- Add focused parser assertions for prefixed LLM and unprefixed CV paths.

## Phase 2 — Rename the authored LLM files

- Rename all seventeen MDX files according to the exact TOC mapping above.
- Update direct source-file references while leaving canonical lesson IDs and
  authored metadata untouched.

## Phase 3 — Document and verify

- Update the filename convention in `wiki/concepts/learning-lab.md`.
- Run the relevant Learning Lab tests, then `npm run verify` and
  `git diff --check`.
- Record actual changes and verification results here; set status to `done`.

# Out of Scope

- Renaming lesson IDs, routes, track IDs, quiz IDs, renderer keys, or assets.
- Prefixing CV content or unpublished placeholder nodes.
- Changing TOC order, lesson prose, visuals, or application behavior.
- Creating a new documentation page.

# Execution Log

- 2026-07-16T13:42:22+07:00 — Read the mandatory workflow, repository
  orientation, Learning Lab plans/wiki, typed LLM TOC, MDX parser/registry, and
  relevant tests; stored this draft plan for approval.
- 2026-07-16T13:48:00+07:00 — User approved the stored plan.
- 2026-07-16T13:48:30+07:00 — Execution started.
- 2026-07-16T13:50:00+07:00 — Renamed all seventeen authored LLM MDX files
  with chapter-local node prefixes, updated the shared path parser to remove an
  optional hierarchical prefix, and preserved canonical metadata and routes.
- 2026-07-16T13:50:00+07:00 — Added prefixed/unprefixed parser regression
  coverage, updated the direct roadmap test path, and documented the convention
  in the existing Learning Lab wiki page.
- 2026-07-16T13:50:00+07:00 — The first targeted run exposed that the old stem
  matcher rejected dots; after narrowing the regex correction, targeted tests
  passed 69/69. `npm run verify` passed typecheck, 69 tests, and the 2,513-module
  production build; `git diff --check` and stale direct-path search passed.

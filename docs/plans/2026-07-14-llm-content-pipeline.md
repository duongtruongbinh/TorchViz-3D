---
title: LLM Learning Content Pipeline Refactor
status: done
created: 2026-07-14T00:00:00+07:00
updated: 2026-07-14T07:50:22+07:00
author: Nguyen Manh Khiem
task: "replace hard-to-search and hard-to-extend LLM lesson content embedded in TypeScript renderers with a validated MDX-based React content pipeline"
supersedes:
  - docs/plans/2026-07-13-learning-lab-llm-domain-compact.md
---

# Goal

Make LLM AI Engineering lessons easier to author, search, review, and extend
without replacing the existing React Learning Lab shell or losing its custom
interactive lesson behavior.

Success means:

- prose, headings, lists, links, code, images, and ordinary tables can live in
  author-friendly MDX files instead of large TypeScript payloads or JSX;
- interactive teaching elements remain typed React components exposed through
  a small approved MDX component vocabulary;
- lesson metadata and content are validated during typecheck/build rather than
  failing silently at runtime;
- lesson search can match content, headings, and keywords, not only lesson title
  and id;
- one approved representative LLM lesson is migrated and verified before any
  broader course migration;
- existing routes, lesson ids, progress/paging behavior, language switching,
  theme behavior, quiz state, and approval gating remain stable.

# Lineage

Supersedes
[2026-07-13-learning-lab-llm-domain-compact](./2026-07-13-learning-lab-llm-domain-compact.md).

That plan established the current LLM domain package, approved nodes 1-5,
domain-owned custom renderers, thin shared extra dispatch, and the rule against
a premature global renderer registry. This refactor preserves those boundaries
while changing how LLM lesson content is authored and indexed.

# Context Read

- `docs/WORKFLOW.md` requires a stored, approved plan before implementation.
- `CLAUDE.md` defines the active app architecture and verification commands.
- `docs/plans/2026-06-21-learning-lab-refactor.md` and
  `docs/plans/2026-06-21-landing-ui-iteration.md` establish the Landing,
  Workspace, and Learning Lab boundaries.
- `wiki/concepts/learning-lab-refactor.md` documents the active catalog,
  routing, theme, responsive shell, and shared/domain renderer ownership.
- `src/core/learning/content/llm-ai-engineering/tracks.ts` currently combines
  table-of-contents seeds with long lesson theory payloads.
- `src/core/learning/content/llm-ai-engineering/extras.ts` contains localized
  concept, interaction, and quiz payloads.
- `src/components/learning/domains/llm-ai-engineering/renderers.tsx` is a
  1,951-line domain renderer containing reusable interactions, lesson-specific
  visual composition, and id-based dispatch.
- `src/components/learning/lesson/LessonDetail.tsx` owns lesson page assembly,
  paging, quiz-state reset, and practice integration.
- `src/components/learning/lesson/LessonRail.tsx` currently searches only the
  localized lesson title and lesson id.
- The project currently has no Markdown, MDX, or full-text-search dependency.

# Decisions (locked)

- Keep TorchViz-3D as one React/Vite application. Do not embed VitePress or a
  second Vue application in the Learning Lab runtime.
- Use MDX as an authoring format integrated into the existing React/Vite build.
- Keep MDX content local and build-time bundled; do not add a CMS, server,
  remote content fetch, or runtime code evaluation.
- Keep catalog metadata React-free. Content descriptors may reference compiled
  content modules, but core selectors must not import React components.
- Expose a small explicit MDX component map. Arbitrary lesson-local imports and
  arbitrary JSX components are not part of the authoring contract.
- Keep domain-specific interactive components owned by
  `src/components/learning/domains/llm-ai-engineering/`.
- Keep generic quiz rendering, generic concept rendering, theme primitives,
  asset resolution, and shared lesson assembly in their existing shared
  Learning Lab boundaries unless the pilot proves a narrow adapter is needed.
- Do not create a global custom-renderer registry in this work. Reconsider only
  when another domain adopts the same content-component contract.
- Preserve the current five approved LLM lesson ids and approval gate.
- Migrate one representative approved lesson as the pilot. The initial
  candidate is `llm-from-scratch-roadmap` because it covers prose, images,
  custom panels, token examples, and interaction state; implementation may use
  a smaller approved lesson first if the dependency spike demonstrates that it
  provides a safer end-to-end proof.
- Search must remain local, deterministic, accent/case normalized, and scoped
  to the currently selected language. Prefer a small generated in-memory index
  over introducing a hosted search service.
- Keep English and Vietnamese content explicit. Do not use runtime machine
  translation.
- No wholesale migration is approved by this plan before the pilot checkpoint.

# Proposed Architecture

```text
LLM MDX lesson files
  -> MDX/Vite compile step
  -> metadata/content validation
  -> domain content descriptors + searchable plain-text records
  -> existing LearningCatalog / route selectors
  -> LessonDetail MDX adapter
  -> approved React teaching components

Search query
  -> normalized localized lesson index
  -> existing LessonRail groups and route selection
```

The target content vocabulary begins small:

```text
Callout
LearningImage
ComparisonTable
ConceptPanel
TokenExample
NextTokenExercise
Quiz
```

The implementation should reuse existing components/payload semantics where
possible instead of rebuilding their behavior inside MDX.

# Phases

## Phase 0 - Store and approve this plan

- Create this plan as the first file write on
  `refactor/llm-content-pipeline`.
- Wait for explicit user approval.
- On approval, update `status` to `approved`, then `executing`, with fresh
  timestamps before modifying implementation files.

## Phase 1 - Dependency and contract spike

- Select the narrowest maintained MDX integration compatible with React 18,
  Vite 6, TypeScript 5.8, the current ESM setup, and production build.
- Compare at least the direct MDX Vite integration and any smaller viable
  alternative; record the chosen dependency and why in this plan.
- Define the lesson MDX frontmatter/content descriptor contract.
- Define validation for duplicate ids, missing locale variants, invalid
  component names/props, invalid section references, and approval-gate drift.
- Add a minimal fixture proving MDX compilation and typed component injection.
- Verify with the narrowest typecheck/build checks before proceeding.

Checkpoint: review the contract and dependency footprint. If MDX cannot meet
the React-free catalog or deterministic build constraints cleanly, stop and
revise the plan rather than forcing it into runtime.

## Phase 2 - Build the domain-owned MDX adapter

- Add an LLM-domain content loader/descriptor boundary.
- Add the explicit MDX component map using existing Learning Lab theme and
  renderer components.
- Keep interactive state inside React components; keep lesson prose and
  structure in MDX.
- Add plain-text extraction or an equivalent deterministic search document
  representation for each locale.
- Ensure unknown MDX components fail validation/build instead of silently
  receiving generic rendering.
- Add focused tests for the descriptor, validation, component allowlist, and
  searchable text output.

## Phase 3 - Migrate one approved pilot lesson

- Move the pilot lesson's ordinary content into locale-specific MDX.
- Reuse its existing visual and interactive React components through the
  approved component map.
- Preserve lesson id, track membership, section/page order, route, approval
  status, images, quiz behavior, and localized copy.
- Remove only the migrated payload and renderer branches that become provably
  unused; do not split or delete unrelated domain renderer code for aesthetics.
- Add regression coverage for ordering and content availability.

Checkpoint: manually review both locales and both themes at desktop and compact
widths. Compare the pilot against current behavior before expanding scope.

## Phase 4 - Add content-aware lesson search

- Extend the lesson search document to include localized title, id, headings,
  body text, and explicit keywords.
- Keep current status/practice filters and grouped rail behavior unchanged.
- Normalize case, surrounding whitespace, and Vietnamese diacritics according
  to an explicit tested rule.
- Return lesson-level results first; heading-level navigation is optional and
  must not be added unless it fits the existing route contract without a new
  routing subsystem.
- Add focused tests for title, id, body, heading, keyword, locale, and filter
  combinations.

## Phase 5 - Consolidate and decide broader migration

- Measure the pilot result: authoring complexity, generated bundle impact,
  search coverage, renderer reduction, and build/test cost.
- Record which content/component patterns are stable enough for reuse.
- Propose a separate follow-up plan for migrating remaining approved lessons.
  Do not migrate every LLM lesson automatically under this plan.
- Remove spike-only fixtures or adapters that are no longer needed.

## Phase 6 - Verify and document

- Run focused tests during each phase.
- Run `npm run verify` after the pilot and final consolidation.
- Inspect production build output for accidental duplicate React/runtime
  bundles and unexpectedly large content chunks.
- Update this execution log with actual files, decisions, deviations, and
  verification results.
- Update `wiki/concepts/learning-lab-refactor.md` as the existing owner of the
  Learning Lab content architecture.
- Update `wiki/log.md` with a concise implementation record.
- Do not create another architecture page unless the implemented subsystem is
  materially broader than this existing wiki surface.

# Acceptance Criteria

- The app remains a single React/Vite application with no embedded VitePress or
  Vue runtime.
- At least one approved LLM lesson is authored through validated MDX.
- The pilot preserves its current route, ordering, localization, theme, paging,
  and interaction behavior.
- MDX supports only the documented component vocabulary.
- Invalid lesson metadata/component usage fails a deterministic verification
  step.
- Search finds localized pilot content and headings as well as title/id.
- Existing lesson filters and non-LLM domains continue to work.
- No unapproved LLM lesson becomes runtime-visible.
- `npm run verify` passes.
- Existing Learning Lab documentation and this execution log reflect the final
  architecture.

# Out of Scope

- VitePress runtime, Vue, a separate documentation site, or an iframe.
- CMS integration, remote lesson loading, collaborative authoring backend, or
  runtime MDX compilation.
- Migrating all domains or all LLM lessons in this first implementation.
- New lesson ids, new curriculum scope, or pedagogical copy rewrites unrelated
  to migration fidelity.
- New routing, heading deep links, progress persistence, or Learning Lab store
  redesign.
- Landing, Workspace, Pyodide, torchstub, IR, layout, Canvas3D, or practice
  engine changes.
- A global renderer/plugin registry.
- Automatic translation or AI-generated course content.

# Rollback Strategy

- Keep the existing TypeScript lesson path available until the pilot passes its
  checkpoint.
- Select MDX content per lesson descriptor so the pilot can be reverted without
  reverting unrelated Learning Lab changes.
- Do not delete legacy pilot payloads until visual/behavioral parity and full
  verification are confirmed.
- If dependency or bundle impact is unacceptable, retain the validation/search
  contract and reassess Markdown-to-data compilation without shipping the MDX
  runtime adapter.

# Execution Log

- 2026-07-14T00:00:00+07:00 - Created branch
  `refactor/llm-content-pipeline` from `main`.
- 2026-07-14T00:00:00+07:00 - Read mandatory workflow, repo orientation,
  Learning Lab scaffold/history, active LLM compact plan, wiki architecture,
  content types, domain content, renderers, lesson assembly, and current search
  implementation.
- 2026-07-14T00:00:00+07:00 - Stored this draft plan. No runtime/source files
  modified; awaiting explicit approval.
- 2026-07-14T07:44:01+07:00 - User explicitly approved the plan. Advanced the
  plan through `approved` to `executing`; implementation may now begin.
- 2026-07-14T07:50:22+07:00 - Selected the official `@mdx-js/rollup` Vite
  integration as the only new direct dependency. It compiles local MDX at
  build time and needs no VitePress, Vue, CMS, hosted search, or runtime MDX
  evaluator.
- 2026-07-14T07:50:22+07:00 - Added paired English/Vietnamese MDX files for the
  `minimal-llm-project-skeleton` pilot, an explicit domain-owned component map,
  theme provider, registry metadata checks, and MDX module typing.
- 2026-07-14T07:50:22+07:00 - Added a narrow `LessonDetail` adapter keyed by the
  existing LLM lesson id. Catalog routes, status, approval gating, paging, and
  non-MDX lessons remain on the existing path.
- 2026-07-14T07:50:22+07:00 - Extended lesson-rail matching with build-time raw
  MDX search documents containing localized prose, headings, and keywords.
  Search now normalizes case, whitespace, and Vietnamese diacritics while
  preserving the existing grouped status/practice filters.
- 2026-07-14T07:50:22+07:00 - Added regression tests for the paired locale
  contract, stable id, searchable metadata, MDX component allowlist, content
  text extraction, Vietnamese normalization, and removal of duplicate legacy
  coverage.
- 2026-07-14T07:50:22+07:00 - Removed the migrated
  `colab-coding-requirements` extra payload and its 125-line custom renderer;
  the LLM domain renderer decreased from 1,951 to 1,818 lines. No other lesson
  renderer was migrated or reorganized.
- 2026-07-14T07:50:22+07:00 - Updated the existing Learning Lab wiki and wiki
  log. No additional architecture page was created.
- 2026-07-14T07:50:22+07:00 - Verification during implementation passed:
  `npm run typecheck`, 97 Node tests, and a Vite production build. The generated
  Learning Lab chunk was approximately 222 kB minified; no second React runtime
  bundle was introduced. Final `npm run verify` remains recorded below.
- 2026-07-14T07:50:22+07:00 - Final `npm run verify` passed: TypeScript passed,
  all 97 Node tests passed, and the production build completed successfully.

# Pilot Review And Follow-up Boundary

The pilot validates the architecture with a low-risk one-page lesson rather
than migrating the much larger roadmap immediately. It demonstrates Markdown
prose, links, inline code, custom layout primitives, paired locales, metadata
validation, and content-aware search. The current implementation does not yet
prove quiz or stateful interaction embedding through MDX; those remain on the
existing typed-extra path.

A follow-up migration plan should choose one interactive roadmap page, add only
the required component to the allowlist, and decide whether repeated search
metadata warrants a generated manifest. Bulk conversion of the remaining LLM
course is still out of scope.

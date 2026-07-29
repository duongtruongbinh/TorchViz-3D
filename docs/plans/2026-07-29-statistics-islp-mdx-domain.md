---
title: Statistics Domain from ISLP Reference
status: done
created: 2026-07-29T23:20:35+07:00
updated: 2026-07-29T23:50:22+07:00
author: Codex
task: "add a new Statistics Learning Lab domain by splitting the English ISLP reference into canonical locale-MDX lessons, with Vietnamese translation deferred to phase 2"
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Add a new canonical `statistics` domain beside the existing
`math-statistics-ai` domain, using
`docs/reference/ISLP_website.md` as the phase-1 English content source.

Success means:

- Learning Home exposes a separate Statistics domain and canonical
  `/learning/statistics/...` routes.
- the ISLP body is represented by 13 chapter tracks, 90 published English
  lessons, and 265 lesson pages;
- the generated lessons follow the existing typed-TOC -> React-free catalog ->
  locale-MDX registry flow used by the LLM domain;
- Vietnamese UI requests fall back to the English MDX source until phase 2;
- the existing `math-statistics-ai` domain and every existing authored lesson
  keep their current identities and behavior.

# Lineage

Continues the locale-MDX content architecture established by
[Learning Lab Content Architecture and LLM Course](./2026-07-14-approved-llm-lessons-mdx-migration.md).

This plan does not replace that architecture. It applies the same ownership and
validation boundaries to a new domain.

# Context Read

- `docs/WORKFLOW.md` requires a stored, explicitly approved plan before runtime
  or content files are modified.
- `CLAUDE.md` and `wiki/concepts/learning-lab.md` define the active typed-TOC,
  React-free catalog, canonical route, locale-MDX, registry, and search flow.
- `src/content/learning/math-statistics-ai/table-of-contents.ts` already owns a
  separate Math & Statistics curriculum. It must not be renamed, replaced, or
  repurposed for this work.
- `src/content/learning/llm-ai-engineering/` demonstrates the target authored
  filename, metadata, page, fallback, and publication conventions.
- `src/core/learning/mdxContract.ts` strips hierarchical numeric filename
  prefixes while retaining canonical lesson ids.
- `scripts/learningContentMdx.ts` requires one static `lessonMetadata` export,
  published catalog parity, contiguous `MdxPage` indexes, non-empty headings
  and keywords, and no unsupported JSX/HTML or executable expressions.
- `src/components/learning/learningMdxRegistry.tsx` currently imports all MDX
  eagerly. The current Learning Lab chunk was already close to the configured
  warning threshold before adding the 1.46 MB ISLP source, so this import must
  become selected-lesson lazy loading as part of the domain addition.
- `docs/reference/ISLP_website.md` is a user-provided, currently untracked
  20,456-line reference. It remains source input and must not be edited by the
  importer.

# Source Audit

The reference body starts at Chapter 1 and ends before `## Index`. Book
apparatus outside that body is not lesson content.

| Chapter | Track id | Source lines | Lessons | Pages |
|---:|---|---:|---:|---:|
| 1 | `introduction` | 252 | 9 | 12 |
| 2 | `statistical-learning` | 2,091 | 4 | 20 |
| 3 | `linear-regression` | 1,928 | 7 | 21 |
| 4 | `classification` | 2,258 | 8 | 25 |
| 5 | `resampling-methods` | 872 | 4 | 13 |
| 6 | `linear-model-selection-regularization` | 1,927 | 6 | 21 |
| 7 | `moving-beyond-linearity` | 1,456 | 9 | 23 |
| 8 | `tree-based-methods` | 1,242 | 4 | 18 |
| 9 | `support-vector-machines` | 1,108 | 7 | 24 |
| 10 | `deep-learning` | 2,643 | 10 | 27 |
| 11 | `survival-analysis-censored-data` | 1,253 | 9 | 21 |
| 12 | `unsupervised-learning` | 1,667 | 6 | 19 |
| 13 | `multiple-testing` | 1,224 | 7 | 21 |
| **Total** |  | **20,456-file source** | **90** | **265** |

The reference also contains 2,140 fenced-code delimiters, 198 OCR picture-text
blocks, 255 running page headers, repeated Springer/DOI footer lines, and 1,287
raw HTML tag occurrences. Those artifacts cannot be copied directly into the
strict MDX contract.

# Decisions (Locked)

## Domain and Locale Ownership

- Add `statistics` as a new `LearningDomainId`.
- Insert Statistics immediately after `math-statistics-ai` in the Learning Home
  catalog order.
- Use the English title `Statistics` and English ISLP-derived descriptions in
  both required TOC locale slots during phase 1. Phase 2 will replace the
  Vietnamese slots with authored translations.
- Set `fallbackLocales: ['en']`. Only `.en.mdx` files are created in this plan.
- Mark the domain active and all 90 imported lessons `available` +
  `published`.
- Keep `math-statistics-ai`, its routes, its 81 current nodes, and its
  placeholder lifecycle unchanged.
- Use `sectionKinds: ['theory', 'code', 'calculation']` for the mixed theory,
  lab, and exercise domain. Authored MDX pages remain the rendered source.

## Chapter, Lesson, and Page Mapping

- One ISLP chapter becomes one typed TOC track.
- One `###` source section becomes one canonical lesson and one `.en.mdx` file.
- The prose between `###` and the first `####`, when non-empty, becomes the
  lesson's first page.
- Each subsequent `####` subsection becomes one ordered `MdxPage`.
- A section without `####` remains a one-page lesson.
- `#####` and `######` headings remain headings inside their containing page;
  they do not create route nodes.
- Files use the LLM convention
  `<chapter>.<section>-<canonical-lesson-id>.en.mdx`. The numeric prefix orders
  files but is not part of route identity.
- Canonical lesson ids are stored in an explicit import manifest. They are
  descriptive, stable, globally unique within `statistics`, and do not depend
  on incidental OCR spelling. Generic repeated names such as `exercises` and
  `lab` are chapter-qualified.
- Chapter and lesson titles keep the source's English numbering in visible TOC
  copy. Filename/route identity is normalized separately.

## Source Cleaning

- Preserve instructional prose, lists, tables, fenced Python/input/output
  blocks, exercise prompts, figure captions, and the original ordering.
- Remove Preface, Contents, and Index, which sit outside the 13-chapter body.
  Preserve all nine Chapter 1 `###` sections, including its closing
  acknowledgements, so the locked 90-lesson mapping stays lossless.
- Remove running page numbers/headers, repeated copyright/DOI footers, isolated
  glossary words introduced by page extraction, and OCR picture-text blocks.
- Keep figure captions, but do not render the noisy OCR text that attempted to
  reproduce the missing figure itself.
- Convert or remove all raw HTML (`sup`, `sub`, `mark`, `br`, comments, and
  similar tags) so the result is valid strict MDX. Mathematical superscripts
  and subscripts become readable Unicode/plain-text notation where the source
  supplies enough information.
- Escape MDX-significant braces and angle brackets outside fenced code.
- Normalize malformed fences, table separators, whitespace, and heading markup
  without rewriting the technical claims.
- Do not invent formulas, plots, or image assets that are absent from the
  supplied reference. Missing visual/equation reconstruction is a separate
  authored-content pass.
- The importer must be deterministic and must refuse to continue if the source
  no longer yields exactly 13 chapters, 90 lessons, and 265 pages.

## MDX Metadata and Rendering

- Every generated file exports static `lessonMetadata` with:
  - `domainId: 'statistics'`;
  - canonical `id`;
  - `locale: 'en'`;
  - the exact English TOC title;
  - page headings derived from the section/subsection structure;
  - concise static keywords derived from the chapter and section;
  - `pageCount`.
- Multi-page lessons use contiguous `<MdxPage page={0}>` through
  `<MdxPage page={n - 1}>` wrappers.
- Use shared Markdown/MDX primitives only. No Statistics-specific React
  renderer package is introduced in phase 1.
- Add a shared fenced-code adapter only if needed for readable standard MDX
  code blocks. It must preserve existing LLM/CV rendering and must not assume
  every fence is executable Python.

## Loading and Bundle Boundary

- Change the generic MDX registry from an eager `import.meta.glob` to lazy
  per-locale module loaders.
- Load only the selected lesson/locale candidate, expose an explicit loading
  state in `LessonDetail`, and discard stale async results when the route,
  lesson, or locale changes.
- Preserve locale fallback order, quiz state, page traversal, search document
  generation, and the public catalog/route behavior.
- Search validation may still read all MDX at build time; the runtime bundle
  must emit authored lessons as split chunks instead of adding the complete
  ISLP corpus to the initial Learning Lab chunk.

## Visual Identity

- Add one Statistics icon and card palette through the existing exhaustive
  `DOMAIN_ICONS` and `DOMAIN_CARD_PALETTES` maps.
- Reuse the current Learning Home card structure and responsive grid. No
  Learning Home redesign is part of this work.

# Phases

## Phase 0 - Approval Checkpoint

- Store this plan as `draft`.
- Wait for explicit approval.
- On approval, update `status` to `approved`, then `executing`, before changing
  runtime, tests, generated content, or docs.

## Phase 1 - Add the Canonical Domain

- Add `statistics` to the React-free domain id contract.
- Create `src/content/learning/statistics/table-of-contents.ts` with 13 chapter
  tracks and 90 explicit published lesson seeds.
- Register the TOC in `src/content/learning/index.ts` after
  `math-statistics-ai`.
- Add the Statistics card icon/palette.
- Confirm `/learning/statistics`, track, and lesson routes resolve through the
  existing generic route flow.

## Phase 2 - Build the Deterministic ISLP Importer

- Add a focused script/manifest under `scripts/` that reads
  `docs/reference/ISLP_website.md`.
- Encode chapter boundaries, canonical ids, exact expected titles/counts, and
  cleanup rules.
- Make generation target only `src/content/learning/statistics/*.en.mdx`.
- Add a check mode or equivalent deterministic comparison so regeneration
  drift is detectable.
- Do not modify or move the reference file.

## Phase 3 - Generate and Validate English MDX

- Generate 90 English MDX files and 265 contiguous pages.
- Run the generic MDX validator after each chapter batch so malformed source
  artifacts are isolated early.
- Audit the largest lab lessons separately because they contain the most fences
  and extraction noise.
- Confirm every published Statistics TOC node has exactly one English MDX file
  and no Vietnamese MDX file.

## Phase 4 - Lazy-Load Authored Lessons

- Convert the generic runtime MDX registry to selected-lesson lazy loading.
- Add stable loading, stale-result, missing-content, and error behavior in the
  lesson detail surface.
- Preserve current LLM/CV locale fallback, paging, quiz state, keyboard
  navigation, and search behavior.

## Phase 5 - Regression Coverage

- Update hard-coded catalog and MDX totals.
- Change MDX parity assertions to compare `domainId/lessonId/locale`, not only
  bare lesson ids.
- Add Statistics assertions for:
  - domain order and canonical route resolution;
  - 13 tracks, 90 published lessons, 90 English MDX files, and 265 pages;
  - English fallback while the app language is Vietnamese;
  - contiguous page indexes and exact metadata/path/title parity;
  - deterministic importer counts and no unsupported raw HTML;
  - no change to the existing 49 LLM and four CV published lessons.
- Add focused lazy-registry tests where practical without introducing a browser
  test framework.

## Phase 6 - Documentation and Verification

- Update `wiki/concepts/learning-lab.md` in place with the thirteenth domain,
  new catalog totals, English-first fallback, Statistics file map, and lazy
  registry behavior.
- Append the actual files, counts, deviations, and verification evidence to
  this plan's execution log.
- Run:

```bash
npm run verify
git diff --check
```

- Inspect the built chunk report to confirm Statistics lessons are emitted as
  lazy content chunks and the initial Learning Lab chunk does not absorb the
  complete ISLP corpus.

# Acceptance Criteria

- `statistics` is a separate thirteenth Learning Lab domain.
- `math-statistics-ai` remains present and unchanged in identity and content.
- Statistics contains exactly 13 tracks, 90 published lessons, 90 `.en.mdx`
  files, and 265 valid lesson pages.
- English and Vietnamese app modes can open every Statistics lesson; Vietnamese
  uses the declared English fallback in phase 1.
- Every Statistics route, TOC node, MDX path, metadata id/title, page count, and
  search document agrees with the canonical manifest.
- The source reference is unchanged.
- Generated MDX contains no running headers/footers, OCR picture-text blocks,
  unsupported raw HTML, executable MDX expressions, or malformed page indexes.
- Existing LLM, CV, Review, Workspace handoff, search, and lesson-navigation
  tests remain green.
- Authored lesson modules are runtime-lazy, and `npm run verify` plus
  `git diff --check` pass.

# Out of Scope

- Vietnamese `.vi.mdx` files or Vietnamese TOC translation; that is phase 2 of
  the content project.
- Replacing, renaming, merging, or deleting `math-statistics-ai`.
- Reconstructing figures, plots, equations, or image assets missing from the
  supplied extraction.
- Converting the book exercises into `MdxQuiz` interactions or Review-mode
  exercise fixtures.
- Statistics-specific interactive diagrams or React renderers.
- Rewriting or summarizing the technical source material.
- Changes to Workspace, Pyodide, torchstub, IR/layout, Canvas3D, or unrelated
  Learning Lab domains.

# Execution Log

- 2026-07-29T23:20:35+07:00 - Read the mandatory workflow, repository
  orientation, Learning Lab plans/wiki, active typed TOCs, MDX registry,
  validation scripts, tests, and the supplied ISLP reference. Confirmed with
  the requester that Statistics is a new domain, not a replacement for
  `math-statistics-ai`. Stored this draft plan as the task's first write.
- 2026-07-29T23:28:07+07:00 - Requester explicitly approved the stored plan.
- 2026-07-29T23:28:08+07:00 - Execution started on
  `feat/add-statistics-domain`.
- 2026-07-29T23:40:00+07:00 - Added the explicit 13-chapter/90-lesson
  Statistics manifest and deterministic generator, then generated 90 English
  MDX lessons with 265 contiguous pages plus the typed Statistics TOC.
- 2026-07-29T23:42:00+07:00 - Registered the new domain, icon, palette, locale
  fallback, shared code/table surface, and lazy locale-aware MDX module
  registry with localized loading/error states.
- 2026-07-29T23:47:00+07:00 - The first production build correctly split
  lesson modules but showed that full authored search text still embedded the
  ISLP corpus in `LearningLabView` (2,174.40 kB). Added the generic
  `searchTextMode` TOC contract and selected metadata search for Statistics.
  The rebuilt Learning Lab chunk is 997.53 kB while all 90 Statistics lessons
  remain independent lazy chunks.
- 2026-07-29T23:50:22+07:00 - Completed the source-artifact audit and removed
  the final standalone book DOI footer from generated content. The supplied
  reference remains unmodified. `node scripts/generateStatisticsIslp.ts
  --check` reports 90 deterministic lessons and 265 pages; there are 90 English
  MDX files and no Vietnamese Statistics MDX files. `npm run verify` passes
  typecheck, all 77 tests, and the production build. `git diff --check` passes.
- 2026-07-29T23:56:49+07:00 - Follow-up cleanup approved under
  [Statistics Import Artifact Cleanup](./2026-07-29-statistics-import-artifact-cleanup.md):
  the accepted TOC and MDX become the canonical source, superseding this plan's
  original decision to retain the one-time importer and source reference.

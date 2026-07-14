---
title: Approved LLM Lessons MDX Migration
status: draft
created: 2026-07-14T08:02:31+07:00
updated: 2026-07-14T10:09:01+07:00
author: Nguyen Manh Khiem
task: "generalize the Learning Lab MDX content convention for every domain, using the five approved Vietnamese-first LLM lessons as the reference implementation"
supersedes:
  - docs/plans/2026-07-14-llm-content-pipeline.md
---

# Goal

Finish the MDX migration for the five currently approved LLM AI Engineering
nodes while reducing duplicate content declarations and lesson-specific
renderer code.

The approved set is:

1. `minimal-llm-project-skeleton`
2. `llm-from-scratch-roadmap`
3. `llm-component-checkpoint-quiz`
4. `llm-data-pipeline-overview`
5. `llm-data-pipeline-checkpoint-quiz`

The first node is already the working MDX pilot. This plan migrates the other
four, simplifies locale discovery around Vietnamese-first files, and leaves all unapproved
LLM placeholders and every other domain on the current catalog path.

# Reopened Scope — Generic Learning Lab MDX Convention

The user reopened this approved plan to generalize the proven five-lesson MDX
pipeline from an LLM-specific implementation into the shared Learning Lab
content architecture. The central convention is:

```text
one catalog lesson node = one locale-specific MDX file
src/content/learning/<domain-id>/<lesson-id>.<locale>.mdx
```

This continuation keeps the five approved `llm-ai-engineering` lessons as the
only migrated runtime content and uses them as the reference implementation.
Other domains are not migrated in this execution. A future domain must be able
to add catalog metadata, convention-based MDX files, and an optional small
domain component map without changing shared discovery, validation, search, or
lesson assembly.

The reopened execution will:

- move filename parsing, metadata validation, locale fallback, lesson lookup,
  page selection, component allowlisting, and search-document extraction into
  generic shared boundaries;
- discover all lesson sources through `src/content/learning/*/*.mdx` without
  handwritten lesson or domain imports;
- compose shared MDX components with an optional typed domain component map,
  while keeping LLM visuals and stateful interactions domain-owned;
- remove LLM imports and domain branches from `LessonDetail` and `LessonRail`;
- keep core catalog/search boundaries React-free and avoid raw-source plus
  compiled-module duplication;
- validate every discovered MDX file against its catalog node and domain
  approval status, including duplicates, path/metadata drift, page indexes,
  quiz ids, unsafe syntax, and unsupported components;
- preserve the five-lesson behavior and report code/tree/bundle metrics by
  runtime, authored MDX, tooling, tests, and documentation.

No plugin framework, unproved abstraction, placeholder MDX migration, new
lesson, route change, or fake English payload is part of this continuation.

## Approved directory compaction continuation

The user approved a final tree-only compaction after reviewing the generic
pipeline. Flatten `src/components/learning/mdx/` into the existing Learning
component directory, rename the two substantive files to
`learningMdxComponents.tsx` and `learningMdxRegistry.tsx`, and absorb the
eleven-line runtime domain composition map into the registry. This removes one
directory and one file without changing discovery, validation, search,
rendering, fallback, or domain ownership. Keep
`scripts/learningContentMdx.ts` in `scripts/`: it is active Node/Vite build
tooling with direct Vite and deterministic-test callers, not browser runtime or
a one-off migration script.

## Approved lesson-extra compaction continuation

The user approved removing the now-unnecessary
`src/components/learning/lesson/extras/` level after a caller audit. The five
migrated LLM lessons use the generic MDX registry, and no remaining catalog
lesson declares legacy `extras`; therefore the compatibility-only
`LessonExtras` -> `LessonExtraRenderer` -> `ConceptPanelBlock` chain can be
removed together with its branches in `LessonDetail`. Move the still-active
shared quiz renderer directly under `lesson/`, absorb the small frame primitive
into the shared MDX component module, and absorb the localized-text helper into
the existing learning text module. Keep `LessonDetail`, `LessonRail`,
`LessonNode`, `QuizBlock`, and the shared scroll helper separate because each
has a substantive responsibility or multiple callers. Preserve MDX quiz state,
non-MDX placeholder rendering, routes, domain visuals, and search behavior.

## Proposed filesystem-derived table-of-contents continuation

The user has proposed replacing the 12 handwritten domain catalog modules with
one table-of-contents MDX file per domain. This intentionally refines the prior
lesson-source convention:

```text
src/content/learning/<domain-id>/table-of-contents.mdx
src/content/learning/<domain-id>/<lesson-id>.<locale>.mdx  # only when authored
```

`table-of-contents.mdx` is static catalog data, not a rendered lesson. It owns
domain metadata, locale fallback, tracks, ordered lesson nodes, localized node
titles/status, route aliases, and optional practice ids. A TOC node without a
locale-specific lesson MDX file remains navigable and renders the one shared
“content in progress” state; it does not require a fake placeholder lesson
file. The five current LLM lesson files remain the only authored LLM content,
and the first LLM TOC nodes resolve to those files. The other 606 catalog nodes
retain their current TOC identity/default state through their domain's single
TOC file.

The generic build pipeline will discover all
`src/content/learning/*/table-of-contents.mdx` files, validate their static
exports, derive one React-free catalog virtual module, and validate any authored
lesson MDX against the derived catalog. This reverses the current dependency
from `catalog -> MDX validation` to `TOC metadata -> catalog + lesson/search
validation`. Runtime lesson discovery remains convention-based and search will
index TOC titles plus authored visible text, while excluding the repeated
default placeholder copy.

This continuation will remove the per-domain static content modules,
`content/seed.ts`, the handwritten catalog assembly, the LLM `tracks.ts`,
`approval.ts`, and dead `references.ts` after caller checks. File presence plus
validated lesson metadata replaces the duplicated LLM approval list; TOC status
continues to control navigation. Existing practice behavior is not lesson
prose, so the live Fundamentals/CV/NLP/RL practice descriptors will be retained
in one compact React-free registry and referenced from TOC nodes by id. Shared
practice renderers, Workspace deep links, current routes/aliases, selectors,
quiz state, LLM domain components, and the five authored lessons remain in
scope for parity.

No per-domain loader branch, handwritten lesson import, 611 placeholder lesson
files, CMS/plugin framework, or migration of default placeholder prose into
authored MDX will be introduced. Verification must cover duplicate/missing TOC
nodes, domain/path drift, track and lesson order, practice-id resolution,
locale fallback, authored lesson lookup, generated search, existing deep links,
all 103 current tests, production build, file/LOC changes, and bundle size.

# Lineage

Supersedes
[2026-07-14-llm-content-pipeline](./2026-07-14-llm-content-pipeline.md),
which introduced the build-time MDX integration, component allowlist,
content-aware search, and the first approved lesson pilot.

# Context Read

- The LLM approval gate contains exactly five lesson ids.
- `minimal-llm-project-skeleton` currently has separate `.en.mdx` and `.vi.mdx`
  pilot files and no longer has a duplicate legacy extra renderer.
- The other four approved lessons still receive their content/extras from
  `tracks.ts` and `extras.ts`.
- `llm-from-scratch-roadmap` contains the broadest combination of prose,
  motivation media, comparison panels, token examples, and stateful next-token
  interactions.
- The two checkpoint lessons use the shared quiz renderer and quiz state owned
  by `LessonDetail`.
- `llm-data-pipeline-overview` uses lifecycle and Transformer translation-step
  panels.
- The LLM package contains 119 catalog lessons, but 114 are not approved for
  runtime content migration.

# Decisions (locked)

- Migrate only the five approved LLM lessons. Do not create MDX files for the
  114 unapproved placeholders.
- Use one Vietnamese `.vi.mdx` file per approved lesson. LLM course content is
  Vietnamese-first; English UI temporarily renders the Vietnamese lesson until
  a real English translation is authored later.
- Each lesson file exports metadata containing stable id, `vi` locale, title,
  searchable headings, and keywords. Track/order/approval remain in the catalog
  compatibility boundary during this five-node migration.
- Localized prose is selected through a small approved MDX localization
  primitive; do not use runtime machine translation.
- Keep the existing React/Vite application and build-time MDX compiler.
- Reuse existing domain-owned visual and interaction components. Move data into
  MDX, but do not rewrite complex interaction behavior inside MDX.
- Reuse the shared `QuizBlock` behavior through an approved MDX quiz adapter.
  Quiz correctness/state remains typed React behavior.
- Keep the global `LearningCatalog` contract, selectors, routes, aliases,
  practice references, and non-LLM domains unchanged.
- For this transition, approved LLM metadata may override the corresponding
  seeded lesson records, while unapproved placeholders remain in `tracks.ts`.
  Full filesystem-generated catalog removal is deferred until enough real
  lessons have migrated to justify replacing the placeholder roadmap.
- Generate the approved-node order and searchable documents from the five MDX
  modules. Do not maintain a second handwritten list beyond the existing
  approval compatibility boundary during migration.
- Delete legacy `extras.ts` payloads and lesson-specific renderer branches only
  after their MDX replacements pass parity tests and production build.
- Do not preserve the exact old file layout for its own sake. Prefer fewer
  small adapters and one clear approved-lesson registry.

# Target Shape

```text
src/content/learning/llm-ai-engineering/
  minimal-llm-project-skeleton.vi.mdx
  llm-from-scratch-roadmap.vi.mdx
  llm-component-checkpoint-quiz.vi.mdx
  llm-data-pipeline-overview.vi.mdx
  llm-data-pipeline-checkpoint-quiz.vi.mdx

src/components/learning/domains/llm-ai-engineering/
  renderers.tsx                 # reusable complex visuals/interactions only
  mdx/
    lessonRegistry.tsx          # five approved modules + validation
    MdxLessonPrimitives.tsx     # localization/layout primitives
    MdxQuiz.tsx                 # narrow shared-quiz adapter if required

src/core/learning/content/llm-ai-engineering/
  tracks.ts                     # placeholder roadmap retained temporarily
  approval.ts                   # compatibility boundary retained temporarily
  references.ts
  index.ts
```

`extras.ts` and `searchDocuments.ts` should be removed if all remaining
responsibilities are absorbed cleanly by the five MDX modules and registry.

# Phases

## Phase 0 - Store and approve this plan

- Store this plan as the first write for the new scope.
- Wait for explicit approval before changing source/runtime files.
- Advance plan status through `approved` to `executing` after approval.

## Phase 1 - Consolidate the Vietnamese-first authoring contract

- Confirm one Vietnamese `.vi.mdx` file as the authoring contract, with an
  explicit English-to-Vietnamese fallback in the registry.
- Make metadata validation cover filename/id/locale agreement, headings, keywords,
  track/order, approval status, and allowed components.
- Generate localized search documents from the MDX module/source without a
  handwritten per-locale search map.
- Update pilot tests and verify before migrating another lesson.

Checkpoint: confirm a Vietnamese-only MDX file remains ordinary readable
Markdown and English UI fallback is explicit.

## Phase 2 - Migrate the two checkpoint quizzes

- Add an MDX quiz adapter that reuses shared `QuizBlock` semantics and existing
  quiz state callbacks.
- Migrate `llm-component-checkpoint-quiz`.
- Migrate `llm-data-pipeline-checkpoint-quiz`.
- Preserve question ids, modes, options, correct answers/order/categories,
  success/error copy, paging, reset-on-lesson-change behavior, and both
  languages.
- Remove only the corresponding payloads from `extras.ts` after parity tests.

Checkpoint: manually exercise single, multi, order, and categorize modes before
continuing to visual/interaction-heavy lessons.

## Phase 3 - Migrate the data-pipeline overview

- Move lifecycle and Transformer step content into its Vietnamese MDX lesson.
- Expose existing lifecycle/translation visual components through named MDX
  adapters rather than retaining id-based content dispatch.
- Preserve page order, links, beginner-facing copy, theme, and responsive
  behavior.
- Remove migrated payloads and id branches after verification.

## Phase 4 - Migrate the roadmap

- Move roadmap prose, hierarchy, comparisons, token example, references, and
  interaction payloads into its Vietnamese MDX lesson.
- Keep stateful token/sentence interactions in React components with typed MDX
  props/adapters.
- Preserve asset ids, page order, focus behavior, feedback scrolling, links,
  and existing visual hierarchy.
- Remove all roadmap-specific content from `extras.ts` and remove renderer
  branches that no longer represent reusable visuals.

Checkpoint: review every roadmap page in both languages at compact and desktop
widths before deleting final compatibility code.

## Phase 5 - Compact the approved-lesson registry and catalog bridge

- Derive the five approved lesson descriptors, order, localized search text,
  and MDX availability from one registry.
- Remove duplicate approved-id declarations where safe; if `approval.ts` must
  remain for the React-free catalog boundary, generate/derive its set from a
  small metadata artifact rather than manually repeating five ids.
- Remove `extras.ts` if empty; otherwise retain only payloads still used by
  unapproved/non-MDX content and document why.
- Keep the 114 placeholder lesson seeds and global catalog behavior unchanged.
- Record final file/line-count changes against the current pilot branch.

## Phase 6 - Verify and document

- Add focused contract/parity tests after every migrated lesson.
- Run `npm run verify` at each checkpoint where shared quiz or lesson assembly
  behavior changes, and once at the end.
- Inspect production chunks for duplicated React runtime or unreasonable MDX
  growth.
- Update this execution log with actual changes and deviations.
- Update `wiki/concepts/learning-lab-refactor.md` and `wiki/log.md`; do not
  create another architecture page.

# Acceptance Criteria

- Exactly five approved Vietnamese LLM lesson files exist, one `.vi.mdx` file
  per lesson.
- All five retain their canonical ids, tracks, routes, ordering, approval
  behavior, titles, and content.
- The two quizzes preserve every question mode and state/reset behavior.
- Roadmap and data-pipeline visuals/interactions preserve their current page
  order and behavior.
- Lesson search matches localized title, headings, keywords, and authored body
  text for all five lessons, including Vietnamese queries without diacritics.
- Unknown MDX components, duplicate ids/order, missing localized metadata, and
  invalid approval status fail deterministic tests/build validation.
- No unapproved LLM lesson becomes available.
- Other domains, route aliases, practice links, Landing, Workspace, Pyodide,
  torchstub, IR, layout, and Canvas3D remain unchanged.
- Legacy approved lesson payloads are removed from `extras.ts`; the file itself
  is removed if no content remains.
- The final implementation has less handwritten approved-lesson catalog,
  content payload, and id-dispatch code than the current pilot branch.
- `npm run verify` passes.

# Out of Scope

- MDX migration for the 114 unapproved LLM placeholders.
- MDX migration or generated catalog conversion for other domains.
- Removal of the global `LearningCatalog` contract or selectors.
- New curriculum content, new lesson ids, or pedagogical rewrites beyond
  formatting required for migration parity.
- VitePress, Vue, CMS, hosted search, remote content loading, or runtime MDX
  compilation.
- New routing, progress persistence, or Learning Lab store redesign.
- Landing, Workspace, practice engine, Pyodide, torchstub, IR, layout, or
  Canvas3D changes.

# Rollback Strategy

- The registry selects MDX per lesson id, so an individual authored lesson can
  be corrected without changing other lessons or shared discovery.
- Preserve the shared quiz and domain interaction components when changing
  authored MDX data.
- Restore the removed compatibility chain only by reverting this continuation;
  do not introduce a second legacy content path for future domains.

# Execution Log

- 2026-07-14T09:57:50+07:00 - Completed the approved lesson-extra compaction.
  Removed the `lesson/extras/` directory and the compatibility-only
  `LessonExtras` -> `LessonExtraRenderer` -> `ConceptPanelBlock` chain. Removed
  legacy extra assembly from `LessonDetail` and removed the unused `extras`
  field from the catalog lesson/seed contracts. This was safe because `rg`
  found no catalog lesson declaring `extras`; the five authored LLM lessons use
  MDX, while all other domain lessons remain ordinary theory/practice
  placeholders.
- 2026-07-14T09:57:50+07:00 - Moved the active `QuizBlock` directly under
  `lesson/`, absorbed the 20-line frame into `learningMdxComponents.tsx`, and
  absorbed the six-line localized-text helper into `learningText.ts`. Kept
  `LessonNode` separate despite its single caller because it is the memoized
  row boundary and merging it would inflate the already 281-line rail. Kept
  the 512-line quiz and two-caller scroll helper as independent modules.
- 2026-07-14T09:57:50+07:00 - Compaction metrics: the lesson package changed
  from ten files/two nested directory levels to five files/one level; its own
  source changed `1,626 -> 1,165` LOC (`-461`). Including the frame/text moves
  and catalog contract cleanup, product/runtime changed `2,776 -> 2,329` LOC
  (`-447`). `LessonDetail` changed `363 -> 278`; `LessonRail` stayed `281`;
  MDX, LLM adapters, domain renderers, search tooling, and authored content were
  unchanged. Five source files and the `extras/` directory were removed; the
  component-wiring test decreased by one line.
- 2026-07-14T09:57:50+07:00 - Final `npm run verify` passed: TypeScript, all
  103 Node tests, and the Vite production build. The Learning Lab chunk changed
  `273.60 -> 264.75 kB` minified and `72.64 -> 70.18 kB` gzip. Final
  `git diff --check` passed. Updated the existing Learning Lab wiki and log,
  created no new plan or docs page, made no commit, and returned this plan to
  `done`.

- 2026-07-14T09:50:04+07:00 - Completed the approved directory compaction.
  Moved the shared renderers/context to
  `src/components/learning/learningMdxComponents.tsx`, moved the generic
  registry to `src/components/learning/learningMdxRegistry.tsx`, and absorbed
  the eleven-line `domainComponents.tsx` map into that registry. Removed the
  now-empty shared `mdx/` directory and the already-empty legacy LLM `mdx/`
  directory from the workspace. Imports now remain flat at the Learning
  component boundary; the domain adapter stays under its domain package.
- 2026-07-14T09:50:04+07:00 - Kept
  `scripts/learningContentMdx.ts` unchanged after confirming its live callers:
  the Vite config uses its build plugin and two deterministic test files use
  its inspector/validator exports. Moving this 262-line Node/Vite module into
  browser-owned `src/`, the 209-line Vite config, or repository root would only
  hide the environment boundary, not reduce responsibility or LOC.
- 2026-07-14T09:50:04+07:00 - Compaction-only metrics: shared runtime MDX files
  `3 -> 2`, shared MDX directory count `1 -> 0`, product/runtime LOC
  `2,783 -> 2,776` (`-7`), and Learning Lab bundle `273.65 -> 273.60 kB`
  minified / `72.65 -> 72.64 kB` gzip. Final `npm run verify` passed with
  TypeScript, all 103 Node tests, and the Vite production build. Final
  `git diff --check` passed; no commit was created. Updated the existing plan,
  Learning Lab wiki, and wiki log, then returned this plan to `done`.

- 2026-07-14T09:47:43+07:00 - User approved the read-only directory audit's
  narrow compaction recommendation. Reopened this plan from `done` to
  `executing` before source edits. Scope is limited to removing the shared
  React `mdx/` directory, merging its eleven-line domain map into the generic
  registry, updating callers/docs, and verifying behavior. The Node/Vite
  validator remains under `scripts/` because it has live build and test callers.

- 2026-07-14T09:43:42+07:00 - Completed the generic Learning Lab MDX
  continuation. One eager glob now discovers
  `src/content/learning/*/*.mdx`; the build validator recursively inspects all
  MDX below the Learning content root so invalid extra nesting is also rejected.
  Generic runtime lookup keys compiled modules by domain, lesson, and locale,
  applies catalog-owned fallback locales, and composes shared components with
  an optional small domain map. `LessonDetail` and `LessonRail` contain no LLM
  import or domain branch.
- 2026-07-14T09:43:42+07:00 - Moved the React-free filename/metadata/locale
  contract and generated search lookup to shared core boundaries. Renamed
  `scripts/learningMdx.ts` to `scripts/learningContentMdx.ts` and
  `virtual:llm-mdx-search-documents` to
  `virtual:learning-mdx-search-documents`. Search documents contain title,
  headings, keywords, and visible authored text while excluding component
  names, prop names, URLs, internal ids, and MDX/JavaScript syntax. No raw MDX
  runtime glob or handwritten lesson/search registry remains.
- 2026-07-14T09:43:42+07:00 - Replaced the roadmap's exported
  `LearningLessonExtra[]` plus `MdxRoadmap` dispatcher with eight named LLM
  domain components: `AiHierarchy`, `DomainComparison`, `LlmOverview`,
  `TokenizationExample`, `NextTokenExercise`, `ScaleFactors`,
  `ScaleComparison`, and `LlmPopularity`. The last three roadmap pages remain
  natural Markdown. Stateful focus, feedback scrolling, sentence building,
  quiz state/reset, media ids, and domain renderer behavior remain in React.
- 2026-07-14T09:43:42+07:00 - Deterministic validation now checks domain/path
  convention, catalog membership, approval, metadata/path agreement, title,
  headings, keywords, positive page count, continuous page indexes, quiz id
  uniqueness/count, duplicate locales, arbitrary imports/re-exports,
  executable expressions, spread props, and the composed shared/domain
  component allowlist. Focused tests prove a hypothetical Markdown-only CV
  lesson needs no domain adapter and that an LLM-only component is rejected in
  that domain. Runtime still contains exactly five `.vi.mdx` LLM files; no
  placeholder or other domain was migrated.
- 2026-07-14T09:43:42+07:00 - LOC metrics for this continuation, measured with
  `wc -l` using stable category file sets: product/runtime `2,763 -> 2,776`
  (`+13`); authored MDX `636 -> 636` (`0`); validation/build tooling
  `201 -> 339` (`+138`); focused tests `85 -> 138` (`+53`); documentation
  `892 -> 1,087` (`+195`). The runtime increase is the generic React-free
  search lookup, locale fallback, and shared/domain composition boundary; the
  larger increases are intentionally isolated in deterministic tooling, tests,
  and the required architecture/execution record rather than lesson payload.
- 2026-07-14T09:43:42+07:00 - Requested file metrics: `LessonDetail`
  `365 -> 363`; `LessonRail` `285 -> 281`; LLM MDX adapters `302 -> 94`;
  `renderers.tsx` `1,801 -> 1,771`; five MDX files remain `636` total; roadmap
  `428 -> 424`. The direct pipeline implementation changed from four files to
  eight (five to nine when counting `src/mdx.d.ts`) because generic runtime
  search, shared runtime composition, and React-free build contracts are now
  separate; the deepest domain adapter path decreased from five directories
  below `src/` to four. This continuation added eight and
  deleted five source files (`+3` net); across the complete uncommitted MDX
  migration versus `HEAD`, there are sixteen new and two deleted source
  files.
- 2026-07-14T09:43:42+07:00 - Caller evidence before deletion/merge: the shared
  `assetRegistry.ts` had one caller, the LLM renderer, so its four LLM media ids
  moved into that domain renderer; the old domain `lessonRegistry.tsx` was
  called only by `LessonDetail`, now replaced by the generic registry; the old
  `MdxLessonPrimitives.tsx` was called only by that registry and was split into
  shared components plus the smaller LLM map; `MdxRoadmap` and
  `LlmRoadmapPage` lost their final callers when named components were wired;
  the old LLM contract and script callers moved to the generic contract/plugin.
  Deleted/absorbed files are `scripts/learningMdx.ts`,
  `domains/llm-ai-engineering/mdx/{lessonRegistry,MdxLessonPrimitives}.tsx`,
  `core/learning/content/llm-ai-engineering/mdxContract.ts`, and the shared
  `lesson/extras/assetRegistry.ts`.
- 2026-07-14T09:43:42+07:00 - Final `npm run verify` passed: TypeScript passed,
  all 103 Node tests passed, and Vite production build completed. The Learning
  Lab chunk is `273.65 kB` minified / `72.65 kB` gzip versus the reopened
  baseline `272.13 kB` / `71.95 kB` (`+1.52 kB` / `+0.70 kB`) for the generic
  registry/search/fallback boundary. `git diff --check` passed. Updated the
  existing Learning Lab wiki and wiki log, created no new docs page, made no
  commit, and returned this plan to `done`.

- 2026-07-14T09:24:08+07:00 - User explicitly reopened the approved plan for
  an in-scope architectural continuation: generalize the Learning Lab MDX
  convention for all future domains while retaining the five approved LLM
  lessons as the only migrated reference implementation. Changed status from
  `done` to `executing` before modifying source. The execution will remove
  LLM-specific shared loader/search/assembly dependencies, validate the generic
  `src/content/learning/<domain>/<lesson>.<locale>.mdx` convention, preserve
  current behavior, measure the requested code/tree/bundle categories, and
  finish by updating this log plus the existing Learning Lab wiki surfaces.

- 2026-07-14T13:30:00+07:00 - Completed the final code/tree compaction pass.
  Removed the two intermediate core search modules, let the React-free virtual
  search document feed the lesson rail directly, and removed the obsolete LLM
  hook from the shared `LessonExtraRenderer`. Domain visualization dispatch is
  now reachable only through the LLM MDX boundary.
- 2026-07-14T13:30:00+07:00 - Found and fixed a parity defect hidden by the
  materialized roadmap: metadata declared eleven pages, but only ten array
  entries existed and the last two generic panels were unsupported by the
  direct domain dispatcher, leaving three blank pages. Replaced those pages
  with natural Markdown for the course roadmap, references, and next-step
  summary. All eleven pages now have authored content.
- 2026-07-14T13:30:00+07:00 - The roadmap is now 428 lines (down from the
  original 1,112 and the first compaction's 514); all five MDX files total 636
  lines. Relative to `HEAD`, source excluding lock/docs is +1,285/-900, net
  +385 lines. The remaining increase is explicit MDX compilation/validation,
  adapters, and regression tests rather than duplicated lesson payload.
- 2026-07-14T13:30:00+07:00 - Final `npm run verify` passed with 99 tests and a
  production build. `LearningLabView` is 272.13 kB minified (71.95 kB gzip),
  down from 329.27 kB before consolidation and 274.65 kB after the first pass.
  `git diff --check` passed. Plan returned to `done`.

- 2026-07-14T13:00:00+07:00 - User requested one final in-scope compaction
  pass after reviewing the net source increase. Reopened the approved plan to
  reduce MDX-specific adapter/runtime code and directory depth, move ordinary
  roadmap prose toward natural Markdown, and remeasure source/bundle impact.

- 2026-07-14T12:30:00+07:00 - Completed the consolidation checkpoint. Added a
  shared AST-based MDX inspector used by deterministic tests and a Vite virtual
  search-document plugin. The contract rejects imports, re-exports, executable
  expressions, spread attributes, and unknown components while validating
  metadata, exact approved ids, page ranges, and quiz question ids.
- 2026-07-14T12:30:00+07:00 - Removed the eager `?raw` runtime glob. Search now
  ships only authored text/metadata literals and excludes component names,
  structural prop names, URLs, and internal ids. No handwritten lesson search
  map was introduced.
- 2026-07-14T12:30:00+07:00 - Compacted the roadmap from 1,112 to 514 lines by
  removing duplicated materialized English/Vietnamese values. The Vietnamese
  source is materialized as an explicit English-to-Vietnamese fallback only at
  the legacy visual renderer boundary. Stateful interaction and media behavior
  remain in the existing domain React components.
- 2026-07-14T12:30:00+07:00 - Audited the remaining renderer id branches. They
  select genuinely different roadmap visual/interaction variants and retain a
  live caller through `MdxRoadmap`; no component/file was deleted without a
  caller proof. Further renderer splitting is not required for this five-node
  migration and would add abstraction without changing the authoring source.
- 2026-07-14T12:30:00+07:00 - Final `npm run verify` passed: TypeScript passed,
  all 99 Node tests passed, and Vite production build completed. The generated
  Learning Lab chunk is 274.65 kB minified (71.36 kB gzip), down from the
  pre-consolidation 329.27 kB. `git diff --check` also passed. Updated the
  existing Learning Lab wiki and log; the plan is complete.

- 2026-07-14T09:00:00+07:00 - Read-only review found that the pilot direction
  remains sound, but deterministic metadata/component validation, approval
  enforcement, and the shared-rail/domain-registry dependency boundary must be
  corrected before migrating the remaining four lessons. The next execution
  checkpoint will first extract a Node-verifiable content contract and a
  React-free raw-search boundary, then proceed through the already approved
  quiz, data-pipeline, roadmap, and consolidation phases. No new plan is needed;
  this is remediation within the approved scope and acceptance criteria.
- 2026-07-14T09:18:00+07:00 - Completed the contract-remediation checkpoint.
  Added one React-free MDX contract for filename parsing and component names;
  changed the content test to discover and validate every LLM MDX file; enforced
  the existing approval gate in both deterministic tests and the runtime module
  registry; and moved raw MDX discovery into a React-free domain search source
  so the shared lesson rail no longer imports compiled LLM MDX components.
  TypeScript and the full 97-test suite pass. Quiz migration remains next and
  must preserve the existing one-question-per-page assembly and reset behavior.
- 2026-07-14T09:40:00+07:00 - Migrated
  `llm-component-checkpoint-quiz` to Vietnamese MDX. Added a narrow `MdxQuiz`
  adapter over the shared `QuizBlock` plus MDX page-count support, preserving
  five question pages and `LessonDetail`-owned question state/reset behavior.
  Removed the corresponding legacy payload from `extras.ts` only after focused
  typecheck and contract tests passed.
- 2026-07-14T10:00:00+07:00 - Migrated
  `llm-data-pipeline-checkpoint-quiz` to Vietnamese MDX with six preserved
  pages covering multi-select, categorize, single-select, and ordering modes.
  Removed its legacy `extras.ts` payload after focused validation passed; both
  approved checkpoint quizzes now share the same narrow MDX quiz adapter.
- 2026-07-14T10:25:00+07:00 - Migrated the nine-page
  `llm-data-pipeline-overview` to Vietnamese MDX. Added named lifecycle and
  Transformer-step adapters plus an MDX page primitive, while retaining the
  existing React visualizations and theme frames. Removed the overview payload
  and its generic extra-id dispatch branches after focused checks passed.
- 2026-07-14T11:00:00+07:00 - Migrated the final eleven-page
  `llm-from-scratch-roadmap` to Vietnamese MDX by mechanically materializing
  the existing typed payload, preserving hierarchy/media ids, token examples,
  feedback, and sentence-builder state. Removed `extras.ts` and the catalog
  extras bridge entirely. All five approved lessons now have exactly one
  `.vi.mdx` file and full verification passes. Phase 5 remains open: the
  roadmap's large exported object is present in both compiled MDX and the raw
  search source, raising `LearningLabView` from the pilot's roughly 218 kB to
  329.27 kB minified. Compact authored content/search extraction and remaining
  renderer id dispatch must be addressed before marking the plan done.

- 2026-07-14T08:02:31+07:00 - User narrowed the proposed all-domain, 611-lesson
  migration to the five currently approved LLM nodes.
- 2026-07-14T08:02:31+07:00 - Confirmed the exact approval set and its current
  ownership across `tracks.ts`, `extras.ts`, the MDX pilot, domain renderers,
  shared quiz behavior, and the global catalog.
- 2026-07-14T08:02:31+07:00 - Stored this draft plan. No runtime/source files
  were modified for the new migration scope; awaiting explicit approval.
- 2026-07-14T08:08:00+07:00 - User explicitly approved the plan. Advanced the
  plan through `approved` to `executing` and started the bilingual pilot
  consolidation checkpoint.
- 2026-07-14T08:12:00+07:00 - Consolidated the pilot from two locale files into
  one `minimal-llm-project-skeleton.mdx`, added bilingual metadata/content and
  a language-aware requirements adapter, and updated registry/search/contract
  tests. TypeScript and all 97 Node tests pass; `git diff --check` is clean.
- 2026-07-14T08:12:00+07:00 - Paused at the Phase 1 authoring checkpoint. The
  single-file format reduces file count but necessarily stores parallel EN/VI
  content in a structured `lessonContent` object, which is denser and less like
  ordinary Markdown than the original locale-separated pilot. Awaiting user
  review before applying this contract to four complex lessons.
- 2026-07-14T08:15:00+07:00 - User selected paired locale files. Restored the
  natural Markdown `.en.mdx`/`.vi.mdx` pilot, removed the structured bilingual
  adapter, and updated the plan contract. TypeScript, all 97 Node tests, and
  `git diff --check` pass. Phase 1 checkpoint is complete.
- 2026-07-14T08:20:00+07:00 - User finalized the LLM domain as
  Vietnamese-first and deferred English lesson translation. Reopened the Phase
  1 contract to remove English MDX files and locale-specific infrastructure;
  English UI will explicitly fall back to Vietnamese lesson content.
- 2026-07-14T08:25:00+07:00 - Replaced manual lesson and raw-search imports with
  one `import.meta.glob` registry keyed by the `<lesson-id>.<locale>.mdx`
  filename convention. Removed the handwritten `searchDocuments.ts`, removed
  language state from MDX primitives, and kept a direct `vi` fallback for
  English UI. TypeScript, all 97 Node tests, and production build pass; the
  Learning Lab chunk is approximately 217.6 kB minified.

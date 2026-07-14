# Wiki change log

A chronological record of changes to the OKF knowledge bundle. (Reserved file —
no `type` frontmatter required.)

- **2026-07-14 — Learning Lab documentation normalized.** Renamed the active
  concept page from `learning-lab-refactor.md` to `learning-lab.md`, updated all
  repository backlinks, and kept “refactor” naming on historical plan files
  only. Consolidated the three branch-specific 2026-07-14 content/MDX/CV plans
  into one compact final architecture and execution record without adding a
  new documentation page.
- **2026-07-14 — CV exercises restored as authored lessons.** Added four
  Vietnamese CV exercise lessons for convolution/pooling shape and value work,
  each with a canonical catalog node, an `exercise` tag, one MDX fixture, and a
  lazy adapter over the shared exercise engines. Restored Path/Review switching
  as a derived view over published tagged lessons and connected applicable
  Workspace Forward Pass nodes to canonical Learning Lab URLs. No practice
  subnode, practice query, parallel Review content list, or live-node transfer
  was reintroduced.
- **2026-07-14 — Learning Lab content ownership simplified.** Moved localized
  domain, track, and lesson-node metadata into the twelve typed TOCs and reduced
  `src/lib/localization.ts` to system/UI copy. Only the five published LLM MDX
  lessons retain authored content; the other 606 nodes now use one shared
  localized placeholder. Removed the Learning Lab practice registry, Review
  mode, practice renderers/adapters, RL-only exercise components, and the
  Workspace-to-Learning practice handoff while preserving catalog routes,
  aliases, standalone Workspace exercises, LLM paging/quizzes, locale fallback,
  and authored search.
- **2026-07-14 — Legacy lesson extras removed.** Removed the unused
  `lesson/extras/` directory and the compatibility-only `LessonExtras` ->
  `LessonExtraRenderer` -> `ConceptPanelBlock` chain after confirming that no
  catalog lesson still declares `extras`. Moved the active quiz renderer to
  `lesson/QuizBlock.tsx`, folded the lesson frame and localized-text helper into
  their existing shared modules, and removed legacy extra assembly from
  `LessonDetail`. MDX remains the authored-content path; non-MDX placeholder
  theory/practice rendering is unchanged.
- **2026-07-14 — Learning MDX runtime tree flattened.** Removed the shared
  `src/components/learning/mdx/` directory, moved its two substantive modules
  to `learningMdxComponents.tsx` and `learningMdxRegistry.tsx`, and absorbed the
  eleven-line runtime domain map into the registry. This removes one source
  file and the redundant `mdx/` directory without changing content discovery,
  validation, locale fallback, search, or domain rendering. The active
  Node/Vite validator remains under `scripts/` to keep build-only dependencies
  outside browser-owned `src/` code.
- **2026-07-14 — Learning Lab MDX convention generalized.** Replaced the
  LLM-specific discovery/search/assembly path with the shared
  `src/content/learning/<domain>/<lesson>.<locale>.mdx` convention.
  `LessonDetail` and `LessonRail` no longer import or branch on LLM modules;
  validation and generated search documents cover every Learning Lab MDX file.
  LLM AI Engineering remains the only migrated reference domain with exactly
  five approved Vietnamese files and a small optional component map. Replaced
  `MdxRoadmap` with named domain components and moved LLM media ids out of the
  shared lesson-extra layer.
- **2026-07-14 — LLM MDX content pilot.** Added a build-time MDX authoring path
  inside the existing React/Vite Learning Lab, migrated the Vietnamese-first
  `minimal-llm-project-skeleton` requirements lesson, removed its duplicate
  legacy extra/renderer branch, and extended lesson search to localized MDX
  body text, headings, and keywords with Vietnamese-diacritic normalization.
  Lesson modules were discovered by filename glob with an explicit Vietnamese
  fallback; the later completion entry below records the final generated-search
  boundary.
- **2026-07-13 — LLM domain docs compacted.** Renamed the compact LLM domain
  plan/history record to
  [2026-07-13-learning-lab-llm-domain-compact](../docs/plans/2026-07-13-learning-lab-llm-domain-compact.md),
  updated the approved boundary to nodes 1-5, and added a cleanup prompt for
  reducing redundant branch code against `main`.
- **2026-07-05 — LLM data pipeline clarity.** Clarified the Learning Lab LLM
  data pipeline visual/copy so GPT logits, shifted training targets,
  cross-entropy over vocabulary, and generation-time decode are separated for
  beginners.
- **2026-07-02 — Learning lesson panel flattening.** Documented the Learning Lab
  convention that the main lesson detail surface should remain one flat panel,
  with section spacing/dividers and subtle left accents instead of nested cards.
- **2026-07-02 — Learning Lab domain package cleanup.** Trimmed the LLM domain
  package docs to describe the current approval-gated roadmap extras, local
  approval gate, scoped asset ids, and direct domain renderer use instead of a
  premature custom renderer registry.
- **2026-07-01 — LLM-from-scratch course content.** Updated the
  [Learning Lab](concepts/learning-lab.md) page to document
  the Vietnamese-first LLM AI Engineering course path and its theory -> hand
  calculation/quiz -> code teaching rhythm.
- **2026-07-01 — LLM-from-scratch visuals and formulas.** Extended the
  [Learning Lab](concepts/learning-lab.md) page for the
  LLM-from-scratch course's planned React-free visual/formula metadata, concrete
  checkpoint exercises, and code-step contracts.
- **2026-07-02 — LLM-from-scratch gist reference alignment.** Downloaded the
  supplied "Building LLMs From Scratch" gist into `docs/reference/` and aligned
  the LLM course copy/checkpoints with source-grounded paraphrases plus explicit
  placeholders for out-of-scope extension labs.
- **2026-06-29 — Landing home redesign.** Refined the outer Landing page into a
  quieter dark technical composition with less glow, clearer Workspace/Learning
  cards, wider touch targets, reduced-motion support, and desktop-only route
  lines.
- **2026-06-29 — Learning Lab sidebar hierarchy.** Documented the shallow
  Learning Lab sidebar model: Home stays at the top, domains remain top-level,
  and track/lesson structure stays in the right-side main content instead of a
  sidebar tree. The TorchViz logo is now the Landing return affordance.
- **2026-06-29 — Learning Lab Home role.** Clarified that the `/learning` Home
  page is a text-focused TorchViz-3D project introduction, while domain
  navigation remains in the sidebar.
- **2026-06-24 — Architecture bulk collapse controls.** Updated the
  [state store](concepts/state-store.md) reference for the new `expandAll()` and
  `collapseAll()` actions, including the intentional top-level root exclusion.
- **2026-06-21 — Initialization.** Created the OKF v0.1 bundle under `wiki/` as
  the first task executed under the new workflow
  ([docs/plans/2026-06-21-llm-wiki-okf-plan.md](../docs/plans/2026-06-21-llm-wiki-okf-plan.md),
  Phase 4). Pages: root `index.md`, `architecture.md`, `glossary.md`; concepts
  (`torchstub`, `pyodide-worker`, `ir-contract`, `layout-engine`, `state-store`,
  `rendering`); a guide (`add-a-layer`); reference (`templates`, `gotchas`); and
  the section `index.md` listings. Authored against the code at the time, with
  two corrections where the prose docs then lagged the implementation:
  `WRAPPER_LINE_OFFSET` is auto-derived (not a hardcoded `7`), and op coloring
  lives in `src/lib/visualKind.ts` rather than the older constants-based color
  matcher names.
- **2026-06-21 — Learning Lab scaffold docs.** Added a planned subsystem page for
  the scaffold-only Landing Page and Learning Lab refactor
  ([wiki/concepts/learning-lab.md](concepts/learning-lab.md)),
  linked it from the wiki index and architecture pages, and added an embedded
  Codex init prompt derived from `CLAUDE.md`.
- **2026-06-21 — Landing/AppShell MVP docs.** Updated the Learning Lab scaffold
  docs after MVP 1 made `AppShell` and landing components active runtime
  behavior. Learning Lab, learning core helpers, and `uiStore` remain inert.
- **2026-06-21 — Landing bento UI docs.** Folded the finalized Landing hero
  summary into the existing
  [learning-lab](concepts/learning-lab.md) page instead of
  creating a separate Landing page. The docs now note the live graph preview,
  compact Workspace/Learning cards, anchor-based routes, and disabled Learning
  Lab state.
- **2026-06-21 — Landing docs consolidation.** Consolidated the separate
  Landing iteration plan pages into one Landing UI iteration page and clarified
  that small follow-up docs should update existing pages instead of creating
  new pages.
- **2026-06-24 — Learning Path activation.** Activated Learning Lab as a
  separate Path/Review surface from Landing and documented the first-pass
  exercise separation: Learning Lab references existing exercise IDs/concepts
  while the Workspace/Demo exercise flow remains unchanged.
- **2026-06-24 — Learning Lab embedded practice.** Updated Learning Lab from
  reference-only cards to inline exercises with answer checking, reset, and
  hints. Practice cards reuse existing shape/value model builders through a
  shared exercise adapter, keeping Learning Path content metadata-only.
- **2026-06-26 — Learning Lab domain refactor.** Merged Reinforcement Learning
  into Learning Lab as a domain, replaced the sibling RL surface route with
  Learning Lab domain routes, and documented the shared domain catalog/practice
  renderer boundary.
- **2026-06-26 — Desloppify cleanup batch.** Removed unused scaffold files
  (`answerCheck.ts`, `uiStore.ts`, and `LearningDrawer.tsx`), added worker
  timeout recovery, tightened input-shape validation, and enabled unused-symbol
  TypeScript checks.
- **2026-06-26 — Complete Desloppify backlog.** Finished the remaining
  cleanup backlog by self-hosting Tailwind, Pyodide, Monaco, and text font
  assets; moving Learning Lab display metadata through catalog/localization
  adapters; sharing Learning Lab theme tokens and exercise modal lifecycle;
  adding route smoke coverage; and documenting the root entrypoint convention.
- 2026-07-14 — Hardened the Vietnamese-first LLM MDX checkpoint: all lesson
  files now share one verified component contract, unapproved MDX ids are
  rejected, and raw search discovery no longer couples `LessonRail` to the LLM
  React render registry.
- 2026-07-14 — Migrated the LLM component checkpoint quiz to Vietnamese MDX,
  preserving its five-page flow and shared quiz state behavior while removing
  the duplicate legacy payload.
- 2026-07-14 — Migrated the six-page LLM data-pipeline checkpoint quiz to the
  same MDX quiz adapter and removed its duplicate legacy payload.
- 2026-07-14 — Migrated the nine-page LLM data-pipeline overview to MDX using
  named adapters over the existing lifecycle and Transformer visualizations.
- 2026-07-14 — Migrated the final eleven-page LLM roadmap to MDX and removed
  the legacy `extras.ts` catalog bridge; retained an open compaction checkpoint
  for duplicated raw-search/compiled roadmap payload and renderer id dispatch.
- **2026-07-14 — Completed five-lesson LLM MDX pipeline.** Replaced eager raw
  MDX search imports with AST-generated virtual search documents, added shared
  deterministic validation for metadata/components/static expressions/pages,
  compacted the roadmap to Vietnamese-only authored values with renderer-boundary
  fallback, and verified all 99 tests plus production build. The Learning Lab
  chunk decreased from 329.27 kB to 274.65 kB minified.
- **2026-07-14 — Final LLM MDX compaction.** Removed two intermediate search
  modules and the shared-renderer-to-LLM dependency, replaced three blank
  roadmap pages with natural Markdown, reduced the roadmap to 428 lines, and
  reduced the Learning Lab chunk again to 272.13 kB minified. All 99 tests and
  the production build pass.
- **2026-07-14 — Typed Learning Lab table of contents.** Replaced the twelve
  static domain catalog modules and seed assembly with one typed
  `table-of-contents.ts` manifest per domain, kept the stable React-free catalog
  export shared by Vite/runtime/Node, and moved all twelve live practice
  descriptors into a validated registry. Added independent navigation/content
  lifecycle state, retained five published Vietnamese LLM MDX lessons and 606
  navigable placeholders, removed the duplicate LLM approval list and dead
  references module, and preserved exact normalized catalog parity.
- **2026-07-14 — Learning core boundary cleanup.** Moved the concrete catalog
  instance beside the twelve TOCs, kept pure materialization/contracts/selectors
  in `src/core/learning`, and relocated Vite search, visible-lesson policy,
  authored renderer DTOs, and MDX allowlists to their owning content/UI layers.
  Added a regression test for the one-way React-free core boundary; all 107
  tests and the production build pass.

---
title: Continual Learning Citations and Paper Knowledge Layer
status: done
created: 2026-08-13T15:30:00+07:00
updated: 2026-08-13T18:42:00+07:00
author: Codex
task: "Make Continual Learning citations complete, directly useful to readers, and easy to extend with newly analyzed papers"
supersedes:
  - docs/plans/2026-08-08-continual-learning-llm-domain.md
---

# Goal

Give the Vietnamese-first Continual Learning course a durable academic-source
workflow in which readers can identify the evidence behind a claim without
tracing a survey bibliography by hand, while future authors can add or analyze a
paper once and reuse its canonical metadata across lessons.

Success means:

- claim-level citations resolve to original papers where a lesson discusses a
  specific method, experiment, number, or finding;
- every claim or topic taught from the Shi et al. survey is mapped to the full
  relevant paper set cited by the survey for that claim or topic, rather than a
  manually selected one- or two-paper sample;
- surveys remain visible as taxonomy and synthesis sources rather than standing
  in for every primary source;
- important papers include a compact in-lesson analysis of question, setup,
  finding, limitation, relevance, and evidence locator;
- every theory/lab lesson exposes a consistent cited-sources or further-reading
  surface appropriate to its content;
- paper identity and bibliographic metadata are maintained once in a typed,
  React-free domain registry;
- validation rejects broken paper IDs, duplicate identifiers, and drift between
  authored MDX declarations and rendered citation components.

# Lineage

Supersedes [Continual Learning Course for Learning Lab](./2026-08-08-continual-learning-llm-domain.md),
which created the domain, its 77 authored nodes, survey-backed scope, direct
paper links, and the initial `PaperTradeoff` presentation.

This plan preserves the repository-wide
[Learning Lab content architecture](./2026-07-14-approved-llm-lessons-mdx-migration.md):
typed TOCs own navigation, locale MDX owns localized authored prose and analysis,
and React-free content data remains separate from rendering components.

# Current evidence

- The domain contains 39 non-Quiz MDX files. Thirty-six contain a `Nguồn:`,
  `Nguồn tổng hợp:`, or `Tham khảo:` line, but those end-of-page links do not
  consistently identify which source supports which claim.
- The Catastrophic Forgetting code lab has one paper link but no explicit source
  list. `continuity-to-learning-stages` and the final synthesis currently have
  no external paper link.
- Many lessons correctly link original papers, especially the DAP and CFT paper
  landscapes, but paper metadata and display wording are repeated manually.
- `MdxLink` has special styling only for literal numeric citations, while the
  course primarily uses linked author/title text. There is no citation resolver,
  bibliography renderer, or paper-ID validation.
- `PaperTradeoff` captures advantages and limitations but cannot identify a
  paper, show its evidence location, distinguish its role, or provide canonical
  bibliographic metadata.

# Decisions (locked)

## Citation model

1. Use stable author-year citations rather than order-dependent numeric
   citations. A rendered citation should read like `Shi et al. (2025), §4.2` or
   `(Shi et al., 2025, Table 2)` and open the most precise available source URL.
2. A survey may support taxonomy, definitions, and synthesis. Claims about a
   named method, experiment, quantitative result, or paper-specific limitation
   cite the original paper directly; the survey may appear as a secondary source.
3. Evidence locators are required for quantitative claims and strongly expected
   for paper-specific findings. Locators may name a section, equation, table,
   figure, or appendix and remain authored in locale MDX.
4. Course-created examples, connective explanation, and runnable lab outputs
   may be explicitly marked as course analysis rather than receiving a misleading
   external citation.
5. Citation completeness is claim-scoped, not bibliography-scoped. For each
   taught survey claim or topic, inspect its source paragraph, subsection,
   table, and associated references, then register every paper that materially
   supports, exemplifies, qualifies, or contradicts that taught point. Papers
   elsewhere in the survey bibliography that do not relate to a taught point
   remain out of scope.
6. Do not arbitrarily truncate a survey evidence set to one or two representative
   papers. Classify the complete relevant set as `primary example`, `additional
   evidence`, `alternative approach`, or `counter/qualifying evidence` so the
   lesson can preserve reading flow while exposing the broader landscape.

## Ownership and data shape

1. Add a typed, React-free paper registry under the Continual Learning content
   package. It owns stable paper IDs and non-localized bibliographic identity:
   title, authors, year, venue, DOI/arXiv identifiers, canonical URLs, source
   kind, and topic tags.
2. Locale MDX continues to own citation placement, evidence locators, Vietnamese
   summaries, interpretation, limitations, relevance, and reading-list grouping.
3. Extend `lessonMetadata` with declared `referenceIds`. The declaration provides
   a statically inspectable lesson-to-paper relationship without moving authored
   lesson prose into TypeScript.
4. Do not put paper metadata or lesson references in the domain TOC or
   `localization.ts`.

## Reader surfaces

1. Add a shared inline `Cite` MDX component with accessible link text, visible
   author/year/locator information, external-link semantics, keyboard focus, and
   wrapping behavior suitable for narrow screens.
2. Add a shared `PaperSummary` component for papers that need interpretation in
   context. It presents the research question, setup, relevant finding,
   limitation, course relevance, and evidence locator in a compact sequential
   layout. It extends the semantic purpose of `PaperTradeoff` without nesting a
   decorative grid of cards.
3. Add a shared `LessonReferences` component that resolves paper IDs to canonical
   metadata and separates `Nguồn được trích dẫn` from optional `Đọc thêm` items.
   It is an authored end-of-lesson/page surface, not a modal or hidden tooltip.
   For survey-derived topics it also supports a compact grouped evidence set so
   all relevant papers remain discoverable without inserting a long citation
   cluster into every prose sentence.
4. Preserve the current Learning Lab typography, light-theme tokens, radius,
   and focus-ring vocabulary. Citation links remain visually subordinate to the
   prose; paper summaries and reference lists use restrained hierarchy and no
   decorative animation.
5. External URLs are not embedded in authored prose when a registry ID can
   resolve them. Ordinary non-paper links remain normal Markdown links.

## Paper-analysis standard

For each newly featured paper, record and review:

1. research question and role (`foundation`, `method`, `empirical-evidence`,
   `benchmark`, `survey`, or `counter-evidence`);
2. experimental setting: model, data, task sequence, baseline, and metric when
   relevant;
3. the exact finding used by the lesson and its section/table/figure locator;
4. limitations and threats to validity, distinguishing author-stated limitations
   from course-editor inference;
5. relevance to one or more taught `conceptIds`;
6. whether it changes taught content, supports an existing claim, or belongs only
   in further reading.

For each taught survey claim, additionally record a claim-to-paper coverage row:

- survey section, paragraph/table, and survey reference numbers;
- normalized registry IDs for every relevant cited paper;
- each paper's evidence role in the claim;
- where the course exposes it: inline citation, `PaperSummary`, grouped cited
  sources, or further reading;
- an explicit reason for excluding any nearby survey citation from that claim.

# Phases

## Phase 0 — Store and approve this plan

- Store this draft as the first task write.
- Pause for explicit user approval.
- On approval, update `status` and `updated`, then begin execution.

## Phase 1 — Define paper and citation contracts

- Add the typed paper registry and a small initial set of canonical records used
  to exercise every source role and identifier path.
- Extend the React-free MDX metadata and inspection contract with
  `referenceIds` and citation-component inspection data.
- Define URL selection precedence: precise authored evidence URL, canonical HTML
  or DOI landing page, then arXiv abstract as fallback.
- Add focused tests for registry uniqueness, duplicate DOI/arXiv detection,
  unknown paper IDs, metadata declaration validity, and static prop inspection.

Checkpoint: contracts and tests pass before migrating course content.

## Phase 2 — Implement reader-facing components

- Implement `Cite`, `PaperSummary`, and `LessonReferences` in the shared MDX
  component layer and add them to the generic allowlist.
- Reuse the existing Learning Lab theme and prose conventions; keep line length,
  contrast, focus states, semantic HTML, external-link labeling, and responsive
  wrapping accessible.
- Preserve `PaperTradeoff` for existing consumers during migration; remove or
  narrow it only if repository search proves it has no remaining authored use.
- Add component/MDX contract tests and inspect the result in the lesson viewport
  at desktop and compact widths.

Checkpoint: one representative lesson demonstrates inline citation, primary plus
secondary sources, paper analysis, cited sources, and further reading.

## Phase 3 — Build the canonical Continual Learning paper registry

- Inventory every academic URL in the 39 non-Quiz lessons and normalize duplicate
  papers to one stable ID.
- Walk every Shi et al. subsection and table used by the current curriculum.
  For each taught claim/topic, extract the complete relevant citation cluster
  from the survey and create a claim-to-paper coverage matrix. Do not treat the
  course's existing links as the upper bound of the registry.
- Include every survey-cited paper that materially supports, exemplifies,
  qualifies, or contradicts a taught point, even when the current lesson mentions
  only one or two examples. Exclude unrelated bibliography entries and document
  the reason when relevance is ambiguous.
- Verify title, authors, year, venue, DOI/arXiv identity, and canonical URLs
  against primary sources. Prefer DOI/publisher/proceedings metadata and official
  arXiv records; do not infer metadata from memory.
- Classify each paper by source kind and course topic without copying abstracts
  into the registry.
- Record ambiguous, inaccessible, or version-sensitive sources in the execution
  log rather than silently guessing.

Checkpoint: registry audit reports no duplicate identifiers or unresolved IDs,
and every taught survey claim has a reviewed coverage row whose survey reference
set is reconciled with the registry.

## Phase 4 — Audit and migrate all non-Quiz lessons

- Replace survey-only support for paper-specific claims with original-paper
  citations while retaining Shi et al. where it supplies course structure or
  synthesis.
- Use the claim-to-paper coverage matrix to expose the complete relevant evidence
  set for each taught survey point. Keep the most explanatory source inline,
  summarize pivotal papers where needed, and place the remaining relevant papers
  in the grouped cited-sources surface rather than silently omitting them.
- Move citations to the claims they support and add evidence locators for
  quantitative or experiment-specific statements.
- Add `PaperSummary` only for papers whose setup/result/limitation is necessary
  to understand the lesson; keep minor examples as inline citations to avoid
  overwhelming the learning flow.
- Add `LessonReferences` with separate cited and further-reading groups.
- Resolve the three current coverage gaps: explicitly source or label the code
  lab's course analysis, source the continuity-to-learning-stages synthesis, and
  make the final checklist's chapter provenance visible without duplicating all
  prior prose.
- Preserve every theory/Quiz `conceptIds` equality contract. Change quiz content
  only when a corrected citation materially changes a taught claim.

Checkpoint: review the migration by chapter, then run the complete citation
coverage and existing theory/Quiz contract suites.

## Phase 5 — Documentation and verification

- Update the existing Learning Lab wiki page with registry ownership, authoring
  examples, paper-intake workflow, and citation-validation rules. Do not create a
  parallel documentation page.
- Update this plan's execution log with the actual paper/lesson counts, exceptions,
  and design decisions that changed during implementation.
- Run focused tests during each phase, then `npm run verify`, `git diff --check`,
  stale raw-paper-link searches, unknown-ID checks, and an unused-registry-record
  audit.
- Mark the plan `done` only after code, content, tests, and wiki documentation are
  synchronized.

# Acceptance criteria

- All 39 current non-Quiz Continual Learning lessons declare their source
  relationship or an explicit course-analysis exception.
- Every rendered `Cite`, `PaperSummary`, and `LessonReferences` paper ID exists in
  the registry and is declared by the lesson metadata.
- No duplicate DOI or arXiv identifier exists in the registry.
- Every claim/topic taught from Shi et al. has a claim-to-paper coverage row and
  includes the complete set of materially relevant papers cited by the survey;
  the implementation is not limited to the one or two examples previously chosen
  by the course author.
- Every excluded citation adjacent to a taught survey claim has a recorded scope
  or relevance reason, making completeness reviewable rather than subjective.
- Paper-specific findings cite the primary paper; survey-only citations remain
  only where the survey is the actual source of taxonomy or synthesis.
- Quantitative claims migrated by this task include a precise evidence locator.
- Readers can understand why a featured paper matters, what it found, and its
  main limitation without first opening another paper's bibliography.
- Citation and reference UI is keyboard accessible, readable at compact width,
  and consistent with the existing Learning Lab visual system.
- Search, locale fallback, canonical routes, and theory/Quiz concept contracts
  continue to behave unchanged.
- `npm run verify` and `git diff --check` pass.

# Out of scope

- Automatically importing papers from Zotero, Crossref, Semantic Scholar, or a
  remote CMS.
- Building a standalone cross-domain Paper Library route in this iteration. The
  registry and lesson-to-paper graph should make that a future additive feature.
- Downloading or shipping paper PDFs with the application.
- Reproducing every cited paper's full experiment or replacing author judgment
  with generated summaries.
- Translating the Continual Learning lessons into English.
- Applying the registry retroactively to every other Learning Lab domain; the
  shared components and contracts may be reused later through a separate scope.

# Execution log

- 2026-08-13 — Audited the current citation presentation and stored this draft
  plan. No implementation or lesson file was modified before approval.
- 2026-08-13 — Expanded the draft scope after clarification: citation coverage is
  now complete per taught survey claim/topic, including the full materially
  relevant paper cluster from Shi et al. rather than only representative papers.
- 2026-08-13 — User approved the plan; execution started with the paper contract,
  citation inspection, and claim-to-paper coverage foundation.
- 2026-08-13 — Added a reproducible generator pinned to Shi et al. arXiv v3. It
  reads the official LaTeX bibliography and HTML reference links, limits the
  snapshot to the seven survey roots represented by the course, and generated
  225 canonical paper records across 30 taught section nodes.
- 2026-08-13 — Added three explicit non-generated records: the survey itself,
  Synaptic Intelligence (used by the regularization lesson but present only as
  an uncited survey bibliography entry), and the 2025 Spurious Forgetting lab
  paper. Separated the survey ID `shi2024continualSurvey` from the survey's
  `shi2024unified` bibliography key, which refers to the distinct UDIL paper.
- 2026-08-13 — Implemented the React-free lesson coverage map for all 39 non-Quiz
  lessons. The 228-record registry has no duplicate DOI/arXiv identity and every
  record is reachable from at least one lesson; there are no unrelated or unused
  registry records.
- 2026-08-13 — Kept complete lesson relationships in the centralized coverage
  map instead of copying large generated `referenceIds` arrays into 39 locale
  files. Optional MDX `referenceIds` now declare only directly authored
  `Cite`/`PaperSummary` use and are statically validated. This is a deliberate
  implementation refinement of the draft ownership decision: localized prose
  still owns claim placement and interpretation, while generated survey
  membership remains single-source and reproducible.
- 2026-08-13 — Added accessible `Cite`, `PaperSummary`, and `LessonReferences`
  primitives. Each theory/lab lesson now shows primary sources on its final page
  and an expandable complete survey evidence cluster; lab-specific course
  analysis is labeled explicitly. Added a full paper analysis to the Replay lab.
- 2026-08-13 — Migrated 154 academic link occurrences to stable structured
  citations across the Continual Learning theory/lab MDX. No raw academic paper
  URL remains in those files; the two remaining Markdown URLs are ordinary Meta
  Llama and OpenAI product-documentation links. Added precise locators to survey
  synthesis lines and the quantitative 159-domain, 80B-token, 141B-token, and
  10%-corpus claims after checking the primary arXiv HTML.
- 2026-08-13 — Extended MDX inspection/tests for paper IDs, optional metadata,
  coverage completeness, duplicate identifiers, authored-citation membership,
  and course-analysis exceptions. Updated the existing Learning Lab wiki page
  with ownership, intake, regeneration, and authoring guidance.
- 2026-08-13 — `npm run verify` passed: typecheck, all 87 tests, and production
  build. Final focused MDX/coverage tests and `git diff --check` also passed after
  the evidence-locator audit.

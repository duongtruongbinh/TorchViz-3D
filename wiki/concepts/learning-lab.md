---
title: Learning Lab
type: Active Subsystem
updated: 2026-08-19
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

The catalog contains 13 domains, 92 tracks, and 711 lesson nodes. One hundred
ninety-one Vietnamese-first lessons have authored content: forty-nine in
`llm-ai-engineering`, seventy-nine in `continual-learning-llm`, fifty-nine in
`linear-algebra` (one applied-AI overview followed by twenty-nine alternating
theory/quiz pairs across 7 core chapters), and four tagged exercise lessons in
`cv`. The other 520 nodes are navigable placeholders and render one
shared localized "content in progress" message. They do not carry legacy theory
or practice payloads.

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
16. `tokenization-why-it-matters`
17. `tokenization-why-it-matters-quiz`
18. `tokenizer-regex-from-scratch`
19. `tokenizer-regex-from-scratch-quiz`
20. `tokenization-bpe-tiktoken`
21. `tokenization-bpe-tiktoken-quiz`
22. `tokenization-token-ids-vocabulary`
23. `tokenization-token-ids-vocabulary-quiz`
24. `tokenization-raw-text-to-token-ids`
25. `llm-data-pipeline-overview`
26. `llm-data-pipeline-checkpoint-quiz`
27. `loss-perplexity-hand-calculation`
28. `benchmark-likelihood-quiz`
29. `evaluation-beyond-perplexity`
30. `llm-evaluation-foundations`
31. `evaluation-dataset-design`
32. `deterministic-and-reference-metrics`
33. `human-evaluation-rubrics`
34. `inter-rater-agreement`
35. `pointwise-and-pairwise-evaluation`
36. `llm-as-a-judge`
37. `llm-judge-biases`
38. `benchmark-selection-and-contamination`
39. `hallucination-and-factuality-evaluation`
40. `rag-evaluation`
41. `llm-safety-foundations`
42. `refusal-calibration`
43. `toxicity-bias-and-privacy`
44. `jailbreak-and-prompt-injection`
45. `guardrails-for-llm-applications`
46. `llm-red-teaming`
47. `production-regression-evals`
48. `evaluation-ab-testing`
49. `evaluation-harness-code`

Their authored prose, paging data, quizzes, references, and structured visual
inputs live in locale-specific MDX. LLM-specific visual and stateful components
remain React code under the LLM domain package. English UI currently falls back
to the Vietnamese lesson source until an English MDX file is authored.

The Continual Learning course contains 39 adjacent Theory/Quiz pairs across its
first six chapters, followed by one standalone Chapter 7 self-check lesson.
Content through the Replay lab is the approved foundation;
later chapters follow the Shi et al. (2025) survey notes covering regularization,
architecture expansion, distillation, evaluation, vertical/horizontal continuity, CPT/DAP/CFT,
discussion, and a final cross-course synthesis. The synthesis uses one persisted,
beginner-readable checklist per earlier chapter and deliberately has no adjacent
quiz node. Each pair is defined once in its domain TOC and flattened into the
canonical lesson order. Both nodes publish atomically and carry the same stable
`conceptIds`; the quiz question IDs must equal that concept set exactly. This
prevents theory-only claims, orphan quizzes, and assessment content that was not
taught by its paired lesson.

The Linear Algebra course is scoped to the concepts needed for applied AI. It
starts with one standalone overview, then continues through 58 paired lessons
across 7 core chapters:
- Chapter 0: Linear Algebra for AI overview (1 lesson)
- Chapter 1: Vectors & Matrices (16 lessons)
- Chapter 2: Solving Linear Equations (8 lessons)
- Chapter 3: Vector Spaces & Subspaces (10 lessons)
- Chapter 4: Orthogonality & Least Squares (8 lessons)
- Chapter 5: Determinants (4 lessons)
- Chapter 6: Eigenvalues, Eigenvectors & Trace (8 lessons)
- Chapter 7: Singular Value Decomposition (4 lessons)

All 2D Cartesian math visualizations are powered by Mafs 0.21.0 inside a bare
`MathCanvas` wrapped by single-card `MathVisualCard` shells. Shared domain
primitives (`MatrixEquationRow`, `MatrixGrid`, `AugmentedMatrixGrid`, `RightAngleMarker`,
`MathSegmentedControl`) and pure calculations in `demoMath.ts` keep the domain
maintainable and prevent duplicate rendering bugs. All Mafs assets and domain
components remain lazy-loaded behind the linear-algebra domain loader.

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

src/content/learning/<domain-id>/[<chapter>.<section>.<node>-]<lesson-id>.<locale>.mdx
  authored lesson body, metadata, pages, quizzes, links, and visual inputs
```

The Continual Learning domain adds a React-free academic-source layer inside
its content package:

```text
scripts/generateContinualLearningReferences.mjs
  -> arXiv 2404.16789v3 source + bibliography
  -> papers.generated.ts (canonical paper metadata + section citation sets)

papers.ts
  -> stable claim rows + evidence role/exposure + course-analysis notes
  -> reviewed lesson paper sets resolved by stable paper IDs

citationEvidence.ts
  -> reviewed occurrence-level excerpts + search fragments + verification targets

locale MDX
  -> claim-level <Cite paper="..." evidence="..."> or explicit exception placement
  -> localized <PaperSummary>

compiled lesson assembly
  -> authored pages + one dedicated final reference page
  -> lesson-filtered evidence only on authored pages
  -> visible primary sources + expandable complete survey evidence set
```

Bibliographic identity is generated from the pinned survey version and must not
be copied into the TOC or `localization.ts`. The handwritten `papers.ts` coverage
map is the claim-to-paper audit surface: every current non-Quiz Continual
Learning lesson has one entry, and papers outside the survey (for example a
later lab paper) are registered there explicitly. The final lesson reference
surface is assembled from that React-free relationship rather than duplicating
large `referenceIds` arrays across locale files. The authored MDX `pageCount`
continues to describe authored content only; runtime assembly appends the
reference page and reports the combined count to the shared lesson pager.

Each claim row declares a stable ID and summary, the relevant survey locator,
its primary papers, and an exposure decision. `inline` and `paper-summary`
evidence must appear in the authored MDX; `reference-page` evidence must record
why it is useful as additional reading. Survey-section expansion is opt-in and
is reserved for a lesson that actually teaches the corresponding table or
literature landscape. It is not a shortcut for inheriting a whole section.

When adding or revising a survey-backed claim:

1. identify the exact survey section, paragraph, table, and citation cluster;
2. add or update the stable claim row in `papers.ts`, classifying each source as
   primary, additional, alternative, or qualifying evidence and choosing its
   `inline`, `paper-summary`, or `reference-page` exposure;
3. keep the original source next to named methods and empirical claims with `<Cite paper="..."
   locator="§/Table/Figure" />`;
4. use `<PaperSummary>` only when the reader needs the paper's question, setup,
   finding, limitation, and relevance to understand the lesson;
5. add a source missing from the pinned survey as an explicitly reviewed
   `additionalPapers` record; for a survey source, improve canonical metadata in
   the generator rather than editing `papers.generated.ts`;
6. regenerate the pinned snapshot and run the MDX/paper coverage tests. Include
   a complete survey cluster only when it materially supports the exact claim;
   otherwise keep only reviewed sources and state a further-reading reason.

Survey citations support taxonomy and synthesis. A named method, experiment,
quantitative result, or paper-specific limitation should cite the original
paper. Course-created examples and lab fixtures must be labeled as course
analysis rather than presented as externally reproduced evidence.

Inline citation previews use a second, occurrence-level contract in
`citationEvidence.ts`. A paper can support several local claims, so a paper ID
or broad locator is not an evidence ID. Each authored citation must use exactly
one of `<Cite paper="paper-id" evidence="evidence-id" />` or
`<Cite paper="paper-id" exception="exception-id" />`. Evidence must agree with
the lesson, claim, paper, and any locator authored in MDX. It stores an exact
source-language excerpt, an exact searchable substring, the closest honest
verification URL, target precision, reviewed source version/date, and quotation
basis. A link-only exception stores the same occurrence identity plus a
specific reason and reviewed canonical URL; it is not an empty evidence record.
Paraphrases remain in lesson prose and must never be rendered as paper quotes.

Verification targets prefer a versioned HTML paragraph anchor, then a canonical
PDF page, then a canonical landing page. The action label reflects that
precision. When exact deep linking is unavailable, the preview copies the
reviewed search fragment for `Ctrl/Cmd+F`. Run
`npm run audit:cl-citation-evidence` to verify anchors and search fragments
against their declared sources. Sources that block maintenance requests require
an explicit `manual-required` reason and browser review; the audit reports the
exception and never rewrites approved evidence.

The shared `Cite` opens a non-modal, portal-rendered preview when reviewed
evidence is present; explicit exceptions remain numeric links without a silent
empty tooltip. Hover and keyboard focus open the preview, touch uses the first
tap to pin it, and the explicit action opens the source. No source is fetched
during interaction. Evidence and exception data are injected only into authored
lesson pages, so the dedicated `Nguồn chính được dùng trong bài` page remains
ordinary links by construction. The Continual Learning domain currently has
185 authored citation occurrences across 40 theory/lab nodes: 183 reviewed
evidence records and two explicit link-only exceptions. The three authored
`PaperSummary` blocks remain prose analysis and do not instantiate previews.

Inline citation text is numeric and lesson-local: `[1]`, `[2]`, and so on. The
index uses the exact order of the final paper map, with featured sources first
and additional survey evidence continuing the same sequence rather than
restarting at 1. Repeated citations to one paper reuse one number even when
their occurrence-level evidence excerpts differ. `Cite` authors only the paper
ID plus either an evidence ID or an explicit exception ID; the preview and final
page retain the readable paper identity.

The optional hierarchical numeric prefix keeps authored files in typed-TOC
order without becoming part of the canonical lesson ID. The LLM course uses
chapter-local names such as `1.1.6-language-modeling-next-token.vi.mdx` and
`1.5.1-llm-data-pipeline-overview.vi.mdx`. Routes and `lessonMetadata.id`
always use the lesson ID without this organizational prefix.

The Continual Learning domain applies the prefix consistently to every authored
file as `<chapter>.1.<node>-<lesson-id>.vi.mdx`. Its chapter number and node
number mirror the domain TOC exactly, including adjacent Quiz nodes; Chapter 7
ends at `7.1.1-continual-llm-synthesis.vi.mdx` because it has no Quiz node.

The Linear Algebra domain uses the same `<chapter>.1.<node>-<lesson-id>.vi.mdx`
convention for all 59 authored files. Its applied overview starts at
`0.1.1-linear-algebra-for-ai-overview.vi.mdx`; Chapters 1 through 7 then mirror
their TOC node order, including every adjacent Quiz node.

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
  -> build/dev-only Home summary virtual module
  -> Learning Home cards and domain sidebar
  -> cached one-TOC materialization on Path domain entry
  -> canonical first-lesson resolution by product default
  -> cached full-catalog import on Review entry only
  -> selectors, routes, course pages, lesson rail

global language preference
  -> small Zustand preferences store
  -> Landing, Learning Lab, and Workspace consumers

Workspace templates, IR, and layout
  -> Workspace Zustand store
  -> deferred Workspace route only

locale MDX files
  -> scripts/learningContentMdx.ts validation/search/capability extraction
  -> non-eager Vite lesson-loader registry
  -> lazy LessonDetail boundary (only after a lesson is selected)
  -> selected lesson and first available requested/fallback locale only

authored lesson images, optional domain adapters, and reference data
  -> per-module capabilities from component use and canonical reference coverage
  -> non-eager Vite loaders
  -> selected lesson render only; quiz/no-reference lessons skip paper/evidence

authored MDX search documents
  -> one generated Vite virtual module per domain
  -> deferred until the active domain receives a non-empty query
  -> synchronous LessonRail lookup after resolution
```

The stable full catalog remains a normal TypeScript export, so Node tests and
core selectors consume the same React-free data as runtime code. Vite derives a
small Home projection from that canonical catalog at build/dev-server time; it
contains ordered domain metadata, readiness, and lesson counts, but no tracks,
lessons, aliases, or hand-maintained duplicate manifest. A separate virtual
module still owns generated search documents.

Learning Home is a lightweight runtime boundary. `LearningLabView` does not
statically import the full catalog or `LessonDetail`. Home and its domain
sidebar render from the generated summary. Entering a Path domain first loads
and materializes only its canonical `table-of-contents.ts`, then resolves the
domain's first lesson by product default. Review is the sole UI surface that
loads the concrete all-domain catalog. Both boundaries use a localized,
reduced-motion-safe loading surface until route resolution can continue. The
automatic first lesson intentionally proceeds to that one MDX module without
requesting sibling or foreign-domain lessons.

Lesson resolution independently loads the authored detail runtime and exactly
one compiled MDX module: the selected lesson in the first available locale from
the requested-locale/fallback order. Vite injects a small capability export into
each compiled module from authored component use and canonical Continual
Learning coverage. Optional adapters and paper/evidence data therefore load
only when that module needs them; quiz-only Continual Learning modules import
neither reference chunk. Lesson images remain non-eager and load only when
their page renders. The registry indexes Vite
loader keys but does not import sibling lessons or other domains. None of those
dependencies are part of a cold `#/learning` request or an unrelated Path
domain request.

Catalog, MDX, adapter, and search promise caches deduplicate in-flight work and
evict rejected entries. Catalog, lesson, search, and image surfaces distinguish
loading from failure and expose a localized retry instead of leaving a poisoned
cache or indefinite skeleton. Lesson paging, completion, and quiz reset use the
full domain/lesson identity.

Language is owned by `usePreferencesStore`, not the Workspace store. Landing
and Learning can therefore read and change the same global preference without
requesting Python templates, IR/layout helpers, worker code, or canvas modules.
The Workspace store still owns templates and editor/canvas state and loads only
behind the Workspace route.

Generated authored-text search payloads are dynamic imports split by domain.
Entering a domain requests none of them. The first non-empty query loads and
caches only the active domain's payload, then refreshes the rail filter when its
document map is ready. Catalog title/ID matching remains available through the
same filter path, and authored-body matching uses the resolved virtual
documents. This keeps Home and passive domain browsing independent from lesson
prose without introducing a second search contract or changing search semantics.
Development validation is scoped to the requested domain. MDX changes
invalidate that domain's virtual search payload, while typed-TOC changes restart
Vite so the Node-derived Home summary and catalog graph cannot remain stale.

MDX validation is generic across `src/content/learning/*/*.mdx`. It derives
identity from `<domain>/[<numeric-prefix>-]<lesson>.<locale>.mdx`, checks the file against the
catalog, rejects unpublished or unknown nodes, validates page and quiz ids, and
rejects imports, executable expressions, spread attributes, and components
outside the shared/domain allowlist. Raw MDX is not shipped beside the compiled
lesson module.

The Continual Learning paper audit additionally checks that all 40 non-Quiz
lessons have coverage, claim IDs are unique, paper IDs resolve, DOI/arXiv
identifiers are unique, authored `Cite`/`PaperSummary` IDs belong to the lesson
coverage, `paper-summary` decisions have a matching component, and optional MDX
`referenceIds` match the structured citations authored in that file. It also
rejects missing publication years and Scholar fallbacks on any source exposed by
a lesson. The generated snapshot currently represents 225 papers cited across
30 taught survey sections, plus six explicitly registered sources: the survey
itself, Synaptic Intelligence, the post-survey Spurious Forgetting lab paper,
the original GEM paper used to define diagonal-based BWT, Hinton et al.'s
foundational distillation paper, and FitNets for intermediate-representation
distillation. Forty-one reviewed claim rows currently expose 196 of the 231
registry records. The remaining records stay available as survey-intake candidates but
are not rendered merely because they occur elsewhere in a broad survey section.

The core metrics lesson treats metric names as incomplete without their
reference baseline. Peak-based forgetting compares the current checkpoint with
the best prior score; the survey calls its negation BWT. The original GEM
convention instead compares the current checkpoint with the diagonal score
recorded immediately after each task was learned. The two BWT values coincide
only when every task's best prior score is its diagonal score. Authored lessons
and result tables should name the convention or show the formula whenever this
distinction matters.

The final Chapter 2 pair treats continual distillation as a functional
retention constraint. A frozen earlier checkpoint supplies teacher targets while
the updated student optimizes both its current-task loss and a weighted
retention loss. The authored lesson distinguishes raw logits, softened
probabilities, and intermediate representations; contrasts LwF's dependence on
new-task query inputs with DER/DER++ replay of stored exemplars and historical
logits; and states explicitly that matching observed signals does not guarantee
preservation of all unobserved knowledge.

Two nodes deliberately retain large evidence sets: `dap-domain-landscape`
tracks the domain rows behind survey Table 2 (70 sources), while
`continual-finetuning-overview` maps the method/settings landscape behind Table
3 and §§4.3.1–4.3.2 (47 sources). Overview and synthesis nodes are guarded
against this expansion. Canonical metadata has no missing year and no rendered
paper falls back to Scholar. The sole remaining Scholar discovery link is the
currently unused `kandel2000principles` book record because the cited 2000
edition has no stable open primary landing page in the survey metadata.

Search indexes catalog metadata for all nodes and authored body text only for
published MDX. The shared placeholder body is not indexed, preventing 536
missing nodes from overwhelming authored results. Matching is case-insensitive
and Vietnamese-diacritic-insensitive.

## Active File Map

| Path | Responsibility |
|---|---|
| `src/components/learning/LearningLabView.tsx` | Route-aware Learning Lab shell and domain/track/lesson orchestration. |
| `src/components/learning/learningCatalogLoader.ts` | Cached one-domain Path catalog loader and Review-only full-catalog loader. |
| `src/components/learning/LearningLabHeader.tsx` | Path/Review mode, language, and responsive navigation controls. |
| `src/components/learning/shell/ReviewMode.tsx` | Tag-derived quick-review catalog for published exercise lessons. |
| `src/components/learning/shell/DomainCatalog.tsx` | Domain-first catalog entry surface. |
| `src/components/learning/shell/DomainCoursePage.tsx` | Shared domain course overview and track accordions. |
| `src/components/learning/lesson/LessonRail.tsx` | Searchable lesson rail, status filters, chapter collapse, and automatic scroll-to-center on lesson navigation. |
| `src/components/learning/lesson/LessonDetail.tsx` | Placeholder rendering plus asynchronous selected lesson/locale loading. |
| `src/components/learning/lesson/QuizBlock.tsx` | Shared stateful quiz behavior used by MDX. |
| `src/components/learning/learningMdxComponents.tsx` | Shared Markdown primitives, context, lesson frame, and quiz adapter. |
| `src/components/learning/learningMdxRegistry.tsx` | Non-eager compiled lesson lookup plus lazy optional domain component maps. |
| `src/components/learning/domains/llm-ai-engineering/mdxComponents.tsx` | Stable LLM MDX adapter and public component map. |
| `src/components/learning/domains/llm-ai-engineering/*Renderers.tsx` | LLM-only tokenizer, language-model, and concept renderer families behind the stable `renderers.tsx` barrel. |
| `src/components/learning/domains/llm-ai-engineering/rendererTypes.ts` | Domain-local authored-content shapes shared by the LLM renderer families. |
| `src/components/learning/domains/llm-ai-engineering/rendererTheme.ts` | Semantic light/dark tokens shared by repeated LLM visual roles. |
| `src/components/learning/domains/llm-ai-engineering/rendererPrimitives.tsx` | Typed token, ID, callout, and playback primitives used by LLM renderers. |
| `src/components/learning/domains/llm-ai-engineering/diagramPrimitives.tsx` | Shared DOM measurement, connector SVG, and probability-curve infrastructure for LLM diagrams. |
| `src/components/learning/domains/cv/mdxComponents.tsx` | CV-only MDX adapter that lazy-loads shared exercise surfaces. |
| `src/components/exercises/*` | Shared exercise engines, registry, and Workspace launcher. |
| `src/content/learning/<domain-id>/table-of-contents.ts` | One typed React-free catalog manifest per domain. |
| `src/content/learning/<domain-id>/<lesson-id>.<locale>.mdx` | Optional authored locale source. |
| `src/content/learning/continual-learning-llm/papers.ts` | Continual Learning claim-to-section coverage, featured papers, post-survey sources, and lesson paper resolution. |
| `src/content/learning/continual-learning-llm/papers.generated.ts` | Generated pinned-survey bibliography and complete section citation sets; do not hand-edit. |
| `src/content/learning/continual-learning-llm/citationEvidence.ts` | Hand-reviewed occurrence-level excerpts and verification targets for inline citations. |
| `src/core/learning/citationEvidence.ts` | React-free shared citation-evidence contract and target labels. |
| `src/content/learning/index.ts` | Concrete catalog assembly over the thirteen domain TOCs. |
| `src/content/learning/mdxComponents.ts` | React-free shared/domain MDX component allowlist. |
| `src/core/learning/types.ts` | React-free catalog contracts. |
| `src/core/learning/materializeCatalog.ts` | Pure catalog construction and invariant validation. |
| `src/core/learning/mdxContract.ts` | React-free filename, metadata, locale, and search normalization contract. |
| `src/core/learning/retryablePromiseCache.ts` | Shared in-flight deduplication with rejected-entry eviction. |
| `src/core/learning/lessonIdentity.ts` | Stable domain/lesson UI and completion identity. |
| `src/core/learning/selectors.ts` | Pure catalog lookup helpers. |
| `src/store/usePreferencesStore.ts` | Global language preference without Workspace dependencies. |
| `src/components/learning/authoredTypes.ts` | Quiz and LLM renderer DTOs used by authored MDX adapters. |
| `src/components/learning/learningSearch.ts` | Cached per-domain UI adapter over generated Vite search documents. |
| `src/components/learning/lesson/visibleLesson.ts` | Rail/detail visible-lesson selection policy. |
| `scripts/learningContentMdx.ts` | Node/Vite MDX validation, generated runtime capabilities, per-domain search documents, and dev invalidation. |
| `scripts/learningHomeCatalog.ts` | Build/dev projection of canonical domain summaries plus TOC restart boundary. |
| `scripts/generateContinualLearningReferences.mjs` | Rebuilds the Continual Learning paper snapshot from Shi et al. arXiv v3 source and HTML bibliography. |
| `scripts/auditContinualLearningCitationEvidence.mjs` | Network maintenance audit for reviewed excerpt fragments and HTML anchors; never rewrites evidence. |

## UI Conventions

Learning Lab visual primitives live in `src/components/learning/theme.ts`.
Controls should use `getLearningLabTheme(theme)` and the semantic theme helpers
instead of adding unrelated colors, radii, hover states, or focus styles.
The active Learning Lab runtime is locked to light mode. The shared theme
contract remains in place for existing components, but new lesson-only visuals
should not add unreachable dark variants.

`LearningLabView` keeps a shallow left sidebar: Home followed by top-level
domains. Track and lesson structure belongs in the main course/lesson surface.
Desktop keeps persistent navigation; compact layouts use dismissible drawers
for the domain sidebar and lesson table of contents.

Learning Home uses one concise curriculum heading followed by a responsive
portrait-card grid. Each domain card reuses the shared Lucide domain icon and a
distinct visual palette while keeping catalog-derived readiness and lesson
count. A domain is ready when every lesson node is published; ready domains are
shown first, while unfinished domains retain their relative catalog order and
use a muted treatment. Cards remain whole-card navigation targets and scale
from one column on compact screens to four or five columns on wider desktops
without horizontal overflow.

`LessonDetail` owns one outer panel. Markdown, formulas, visual components, and
quizzes use spacing and dividers rather than nested decorative panels. Runtime
lesson media belongs under `src/assets/learning/<domain>/`; `docs/assets/` is
only for documentation artifacts.

Shared authored visuals are semantic and data-driven. `ConceptFlow` renders
ordered stages, `ComparisonMatrix` renders exact cross-field comparisons, and
`ConceptSpectrum` renders an ordered constraint/trade-off continuum.
`CourseCards` renders compact peer examples with an explicit example and
takeaway inside each semantic card. They live in `learningMdxComponents.tsx`,
are registered in the global MDX allowlist, and accept only static MDX data.
Domain lessons must reuse these grammars instead of shipping look-alike local
card grids. `LessonImage` resolves a relative path
under `src/assets/learning/` through a generic asset glob, so the shared renderer
does not contain domain-specific asset keys.

System copy, controls, empty states, filter labels, and language-toggle text
belong in `src/lib/localization.ts`. Catalog metadata and lesson content follow
the ownership boundary above.

Lesson traversal uses keyboard arrows: Up/Down move between lessons, Left/Right
move between section pages. The `LessonDetail` footer keeps the original section
pager (`← Back` / `Next →`) and the green `Too easy!` complete-and-advance
button; there are no on-screen lesson-arrow buttons. Quiz answers submit on
Enter. Both arrow-key handlers and the Enter handler are guarded
(`isTypingTarget` / `data-quiz`) so they never fire while typing in inputs, in
quiz options, or during drag interactions. After Enter submits a quiz answer, focus
returns to the lesson panel so the arrow keys resume navigating lessons and
section pages. When the lesson panel is focused on the last section with a next
lesson, pressing Enter again completes the lesson and continues (same as the
green `Too easy!` button).

The lesson rail automatically scrolls the selected lesson node into vertical
center whenever the active lesson changes (via click, keyboard, or programmatic
navigation). This uses `scrollIntoView({ block: 'center', behavior: 'smooth' })`
on the button element identified by `data-lesson-id`. The effect is driven by the
`selectedLesson.id` dependency in `LessonRail.tsx`, so it only fires when a
different lesson is selected, and it safely handles cases where the target
lesson node is not in the DOM (e.g., collapsed track or filtered out).

Unfinished lesson nodes use one blue marker/title treatment. Theory and Code
nodes retain chapter-local numbering; Quiz nodes are excluded from visible
numbering and use a dimmed question icon that regains emphasis on hover or
selection. Selected rows use a solid blue surface, while completed markers
remain green so progress continues to take precedence.

## Invariants

- `src/core/` remains React-free.
- Learning navigation enters through the unified catalog, not new top-level
  AppShell surfaces.
- Catalog identity is canonical; legacy ids are route aliases, not duplicate
  lesson nodes.
- Missing content uses the shared localized placeholder and has no authored
  theory, interaction, or practice descriptor.
- Authored lesson behavior enters through locale MDX and the generic registry.
- Published Continual Learning nodes form adjacent Theory/Quiz pairs with equal
  navigation and content status. Theory `conceptIds`, quiz `conceptIds`, and
  quiz question IDs are identical and unique within the pair.
- Continual Learning theory/lab titles remain compact in both locales, while
  every adjacent assessment node is labeled `Quiz`; descriptive assessment
  context lives in the question titles inside that node.
- Continual Learning quizzes distribute correct options across A–D at both the
  quiz and domain levels, and reject predictable ascending or descending
  three-answer runs such as A–B–C or D–C–B. Single-choice questions have exactly
  one correct option; distractors remain plausible alternatives from the taught
  concept's semantic neighborhood rather than unrelated filler.
- Every authored Continual Learning `Cite` belongs to exactly one occurrence and
  declares either reviewed evidence or a reasoned link-only exception. Evidence
  IDs, exception IDs, lesson/claim/paper relationships, source targets, exact
  search fragments, numbering, and unused records are enforced offline; Quiz
  and final reference pages never receive preview registries.
- Review membership is derived from `published` lesson nodes tagged `exercise`;
  there is no parallel review or practice content record.
- Workspace exercise handoff resolves a React-free catalog entry point and opens
  the canonical lesson route without a practice query or duplicated fixture.
- The forty-nine authored LLM lessons retain their routes, paging, quiz
  state/reset, locale fallback, authored search text, and light-only runtime
  behavior.
- Learning Lab changes must not reset Workspace editor/canvas state.
- Cold Learning Home must not request Workspace templates or domain TOCs; those
  graphs begin only at their Workspace and domain/Review boundaries.

## Related Pages

- [architecture](../architecture.md)
- [reinforcement-learning](reinforcement-learning.md)
- [state-store](state-store.md)
- [rendering](rendering.md)
- [reference/gotchas](../reference/gotchas.md)

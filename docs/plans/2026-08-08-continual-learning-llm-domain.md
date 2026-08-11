---
title: Continual Learning Course for Learning Lab
status: done
created: 2026-08-08T10:35:00+07:00
updated: 2026-08-12T00:12:52+07:00
author: nmkhiem
task: "Add and author the Continual Learning domain, its paired assessments, labs, reusable visuals, and catalog contracts"
supersedes: []
---

# Goal

Ship a Vietnamese-first **Continual Learning** course immediately after the LLM
domain in Learning Lab. The course must teach each main idea in a focused theory
node, place a matching quiz directly after it, provide runnable forgetting and
replay labs, and preserve the typed TOC → React-free catalog → locale MDX
architecture.

# Lineage

Genesis plan — no predecessor. This file is the compact record for all design,
content, quiz, illustration, and lab iterations completed on the feature branch.

# Delivered features

## Domain and curriculum

- Registered `continual-learning-llm` as the thirteenth Learning Lab domain,
  displayed as **Continual Learning** directly after `llm-ai-engineering`.
- Added a dedicated domain icon, card palette, typed domain ID, catalog export,
  and searchable route metadata.
- Consolidated the curriculum into seven numbered chapters, with 38 adjacent
  Theory/Quiz pairs in Chapters 1–6 and one standalone synthesis checklist in
  Chapter 7 (77 authored nodes): foundations; replay, regularization, and
  architecture; vertical/horizontal continuity; CPT/DAP/CFT learning stages;
  evaluation; discussion; and a cross-course synthesis.
- Kept the approved foundation through the Replay lab, then limited the
  remaining curriculum to the topics synthesized by Shi et al. (2025), removing
  speculative or redundant nodes that fell outside that survey-backed scope.
- Kept theory titles compact and labeled every adjacent assessment node `Quiz`.
- Reordered the learning path so Stability–Plasticity is followed immediately
  by Catastrophic Forgetting and its diagnostic lab. Chapter 1 ends with the
  solution-family overview; Chapter 2 starts with Replay, its lab,
  Regularization, and Architecture.

## Beginner-first foundations

- Split the overview into focused pages covering the static checkpoint problem,
  retraining cost, unconstrained new-data fine-tuning, and the goal of CL.
- Added a two-page Stability–Plasticity explanation with a stability-first loss,
  explicit lambda placement, numbered operating factors, acquisition/retention
  translations, and concrete examples.
- Expanded TIL, DIL, and CIL from one definition page into an overview followed
  by one implementation-oriented page per setting. TIL now explains how a task
  signal reaches routing in practice; DIL shows why the same task becomes harder
  when the input distribution changes.
- Added Vertical/Horizontal CL examples, a research-map illustration, and an
  explanation of how both axes can coexist in one pipeline.
- Added a concise five-family mitigation taxonomy. Replay, Regularization, and
  Architecture are the taught core; Optimization and Representation are kept as
  brief survey directions.
- Added the supplier–consumer motivation, separate Vertical and Horizontal CL
  lessons, separate forgetting lessons for each direction, and a visual map from
  the vertical production flow into CPT, DAP, and CFT.
- Reorganized the later course around the survey: CPT effectiveness, efficiency,
  observations, distribution shifts and other directions; DAP observations and
  domain landscape; CFT, CIT, CMR, CMA and multimodal LLMs; then metrics,
  benchmarks, emergent properties, memory and future directions.

## Theory and quiz contract

- Added optional, unique `conceptIds` to generic Learning MDX metadata.
- Each published theory lesson and its quiz carry the same concept set; quiz
  question IDs must match that set exactly. This prevents untaught quiz content
  and theory claims without assessment coverage.
- Reviewed all Continual Learning quizzes for plausible distractors and varied
  correct-answer positions. The course contains 157 questions: 156
  single-choice and one multi-choice question, all with four options.
- Added catalog and MDX contract tests for pair adjacency, publication state,
  concept mapping, question shape, and non-predictable A–D answer sequences.

## Runnable labs

- Authored a seven-page Catastrophic Forgetting lab with environment setup,
  synthetic biography data, evaluation helpers, sequential Task A → Task B
  training, sample outputs, and forgetting metrics.
- Authored a fifteen-page Experience Replay lab that readers can copy and run
  from top to bottom: configuration, data generation, tokenization, evaluation,
  training helper, four experimental setups, comparison, multi-seed sweep,
  replay threshold, and paper mapping.
- Included representative output after each important cell so readers can follow
  the analysis without rerunning the notebook.
- Mapped the replay demo to *Spurious Forgetting in Continual Learning of
  Language Models* while clearly separating course intuition from the paper's
  stronger recovery, loss-landscape, layer-wise, and Freeze analyses.
- Documented the replay buffer's storage, privacy, I/O, compute, and coverage
  limits, including the loose generalization bound from the UDIL paper and its
  relationship to full retraining.

## Reusable learning visuals

- Added generic, static-data MDX primitives shared across domains:
  `CourseCards`, `EvidenceCards`, `ConceptFlow`, `ExperimentChecklist`,
  `SelfCheckList`, `ComparisonMatrix`, `DatasetComposition`, `MetricBars`, and
  `ConceptSpectrum`.
- Added `StageContinuityMap` for the vertical-stage/horizontal-expansion map and
  `PaperTradeoff` for paired advantage/limitation summaries grounded in cited
  papers. Extended `CourseCards` with three-column, feature-first, semantic-tone,
  and optional-number modes used by the CPT distribution-shift lessons.
- Added `LessonImage`, backed by a generic `src/assets/learning/**` Vite glob,
  so lessons reference domain assets without a domain-specific renderer map.
- Added spotlight behavior for the paper evidence cards: the first card is
  active by default, hover moves focus, and leaving the group restores the first
  card. Single-column mode supports sequential reading.
- Added authored illustrations for the static-snapshot gap, update trade-off,
  unconstrained new-data fine-tuning, TIL/DIL/CIL, Vertical/Horizontal CL,
  architecture expansion, replay constraints, and both forgetting labs.
- Enabled GFM consistently in build-time MDX and validation so authored tables
  compile and render through the same contract.

## Code and output presentation

- Routed common fenced code languages through the shared Shiki-backed
  `CodeBlock`; routed `output`, `text`, and `plain` fences through the output
  presentation.
- Added copy-safe emphasis markers for selected output values and improved
  inline-code, table, ordered-list, KaTeX, and callout readability.
- Added quiz inspection metadata to the MDX compiler so tests can validate mode,
  option count, and correct-answer positions without executing lesson code.

# Architecture decisions

1. Course metadata remains in the typed domain TOC; authored prose, formulas,
   quiz questions, code, and outputs remain in locale MDX.
2. Theory and quiz nodes are declared once as pairs, then flattened into the
   canonical track order.
3. All 38 current pairs are published, so the pair helper emits one canonical
   available/published shape without an unused missing-content branch.
4. Shared visual primitives remain domain-agnostic and accept only static
   semantic data. Continual Learning does not ship a parallel renderer.
5. Runtime lesson media lives under
   `src/assets/learning/continual-learning-llm/`; documentation assets and source
   notebooks are not shipped as lesson dependencies.
6. English UI currently falls back to Vietnamese MDX until dedicated English
   lesson sources are authored.

# Main implementation surfaces

- `src/content/learning/continual-learning-llm/table-of-contents.ts`
- `src/content/learning/continual-learning-llm/*.vi.mdx`
- `src/assets/learning/continual-learning-llm/*`
- `src/components/learning/learningMdxComponents.tsx`
- `src/components/learning/code/CodeBlock.tsx`
- `scripts/learningContentMdx.ts`
- `src/core/learning/mdxContract.ts`
- `src/lib/learningCatalog.test.ts`
- `src/lib/learningMdxContent.test.ts`
- `wiki/concepts/learning-lab.md`

# Out of scope

- English-authored lesson files.
- Executing GPU training in the browser or CI.
- Reproducing the full protocol of cited research papers inside the course labs.
- Persisting exploratory notebooks after their runnable content and representative
  outputs have been incorporated into MDX.

# Execution log

- 2026-08-08 — Registered the domain, presentation, typed catalog, initial
  fundamentals, quizzes, Catastrophic Forgetting lab, and lesson assets.
- 2026-08-09 — Expanded the survey into 38 paired lessons; enforced exact
  theory/quiz concept mapping; revised distractors and answer positions; split
  overview, Stability–Plasticity, and TIL/DIL/CIL into focused pages; reordered
  the fundamentals and methods tracks.
- 2026-08-09 — Added reusable semantic visual primitives and incorporated the
  TIL/DIL/CIL, Vertical/Horizontal, replay, and Stability–Plasticity visuals.
- 2026-08-09 — Rebuilt the Replay lab as a complete copy-in-order flow with
  outputs, four setups, multi-seed evidence, threshold interpretation, and the
  Zheng et al. paper comparison.
- 2026-08-10 — Added the new-data-only fine-tuning illustration, clarified the
  UDIL loose-bound wording in the Replay node, explained input-side layer
  freezing, reviewed the full diff against `main`, removed unused renderer/TOC
  branches and orphan artifacts, and compacted all branch documentation here.
- 2026-08-10 — Full verification found one overlong Vietnamese TOC title;
  shortened it to `Phân loại kịch bản CL`, synchronized the MDX metadata, and
  reran the complete verification successfully.
- 2026-08-10 — Reworked the post-Replay curriculum into six survey-aligned
  chapters; added supplier–consumer, Vertical/Horizontal CL, CPT/DAP/CFT,
  evaluation and discussion lessons; removed superseded nodes; redesigned the
  Language, Content and Temporal Shift pages around paper-specific insights and
  limitations; and added the shared stage-map and paper-tradeoff components.
- 2026-08-10 — Audited the complete branch diff against `main`: every current
  theory and quiz file is referenced by the TOC, every new runtime asset is used,
  every removed lesson ID is unreferenced, and each new shared MDX component and
  `CourseCards` option has an authored consumer. No additional dead code or
  orphan asset remained to remove.
- 2026-08-10 — Replaced the dense CPT-other-directions comparison table with
  focused CEM, RHO-1, IR-DRO, industrial-update, and sustainability sections;
  linked each cited paper directly, bounded findings to their experiments, and
  expanded the adjacent quiz to preserve exact theory/assessment mapping.
- 2026-08-10 — Expanded the DAP overview into four focused pages covering the
  organizational context, unified terminology, the foundational DAPT evidence,
  and the survey's 41-study analysis map; extended its quiz with exact concept
  coverage and experiment-bounded distractors.
- 2026-08-10 — Replaced the DAP-observations matrix with three sequential,
  learner-focused OBS sections while preserving its existing concept and quiz
  contract.
- 2026-08-10 — Added calm full-width dividers and vertical breathing room
  between the three DAP observation sections using the shared MDX prose style.
- 2026-08-10 — Replaced the DAP domain matrix with six focused pages for
  Legal, Medical, Financial, Scientific, Code, and other directions; linked
  original papers, separated paper evidence from limitations, and expanded the
  paired quiz to six exact domain concepts.
- 2026-08-10 — Expanded the CFT overview into six focused pages covering its
  downstream role, the two survey observations, representation-level
  retention, simple fine-tuning controls, and General CFT format/module
  methods; linked original papers, expanded SAPT/Larimar/AMA into bounded
  paper-specific sections, and rebuilt the quiz around the six concepts.
- 2026-08-10 — Expanded CIT, CMR, CMA, and CMLLM into focused, sequential
  pages; replaced summary matrices with paper-specific context, mechanisms,
  advantages, and limitations; linked every presented method to its original
  paper; and extended the paired quizzes with exact concept coverage and
  balanced correct-answer positions.
- 2026-08-10 — Reduced the opening CFT page to one memorable idea: a single
  dual objective presented as two large shared course cards for new-task
  adaptation and old-task retention.
- 2026-08-10 — Added a second CFT page mapping General CFT, CIT, CMR, CMA, and
  CMLLM to the five objects they continually adapt; added the matching quiz
  concept and shifted the remaining CFT pages without changing their content.
- 2026-08-10 — Added a generated CFT illustration that connects one shared
  adaptation–retention objective to five numbered, named cards with distinct
  icons for General CFT, CIT, CMR, CMA, and CMLLM.
- 2026-08-10 — Added a three-card doodle explainer for the representation-versus-
  output hook, showing wrong task output, successful probing, and intact internal
  groups behind a misaligned output route.
- 2026-08-10 — Added one doodle explainer per simple-control paper: wide loss
  basins for Mehta et al., dynamically sized updates for LR ADJUST, and the
  warm-up–freeze–pre-allocation pipeline for SEQ*.
- 2026-08-10 — Converted CIT, CMR, CMA, and CMLLM from single-screen documents
  into two-page lessons: one focused overview and one paper-highlight page;
  consolidated each paired quiz to the same two-concept structure.
- 2026-08-10 — Added five doodle paper maps for CIT, CMR, CMA, CMLLM, and the
  General CFT format/module page; each paper now has a named, mechanism-specific
  visual card without turning the lessons into long full-width image stacks.
- 2026-08-10 — Expanded the survey discussion into focused pages for emergent
  recovery, the changing roles of DIL/TIL/CIL, memory-access regimes, and four
  future directions; added direct original-paper links with bounded trade-offs
  and finished the course with a dedicated Conclusion/Quiz pair.
- 2026-08-10 — Added Chapter 7 as a three-page course synthesis grounded in the
  Notion insight blocks and checked against Shi et al.; audited the Notion
  review bank through item 66 against existing web quizzes and added only three
  non-duplicate integration questions covering objective-to-stage mapping, a
  reusable paper-reading frame, and claim-to-evidence alignment.
- 2026-08-10 — Reframed the Chapter 7 theory node as six chapter-by-chapter
  self-check pages; added a reusable accessible checklist with persisted
  per-page progress.
- 2026-08-10 — Removed the Chapter 7 quiz node so the course now ends with the
  six-page self-check lesson; Chapters 1–6 retain their adjacent Theory/Quiz
  pairs.
- 2026-08-10 — Ran two independent reviews of the Chapter 7 synthesis for
  curriculum coverage and beginner readability. Expanded the six checklists to
  restate acronyms, cover missing baselines and constraints, separate CPT/DAP
  from the five CFT branches, unpack the evaluation metrics, and bound the
  discussion claims to their observed settings.
- 2026-08-10 — Audited the final branch for unused additions: all ten generated
  lesson assets have authored consumers, the shared checklist and table options
  are referenced, and no removed lesson ID remains. Deleted the obsolete
  Chapter 7 quiz file and its unused three-concept metadata.
- 2026-08-10 — Renamed all 77 Continual Learning MDX files to the canonical
  `<chapter>.1.<node>-<lesson-id>.vi.mdx` structure. Prefixes now follow the
  seven chapter tracks and their exact TOC order without changing lesson IDs or
  routes; added a regression test for this filesystem-to-catalog mapping.
- 2026-08-10 — Re-audited all 38 Theory/Quiz mappings and 150 existing
  questions. Expanded CIT, CMR, CMA, and CMLLM from one broad paper question to
  mechanism-specific coverage, bringing the bank to 157 questions; replaced
  weak absolute or category-mismatched distractors across Chapters 1–6 with
  plausible same-context alternatives.
- 2026-08-10 — Removed the forced "one A, B, C, D per four-question quiz" rule,
  which itself leaked a pattern. Answer order is now statically shuffled without
  moving on reload, uses at least three positions in longer quizzes, avoids
  cyclic three-answer patterns, and remains exactly balanced at 39 correct
  single-choice answers per A/B/C/D position.
- 2026-08-11 — Restored the lesson Table of Contents to its original left rail
  and moved the vertical roll interaction to domain navigation. The domain list
  now opens as an overlay above dimmed content, closes from the backdrop or its
  control, and leaves only the top-left navigation icon when hidden. The
  detached shell now uses one `100dvh` scroll boundary so page and lesson
  scrollbars cannot compete. Shared lesson images scale within both the reading
  width and viewport height. The collapsed lesson-contents control aligns with
  the lesson card top edge and uses a borderless icon treatment. The expanded
  desktop contents rail can be resized from 240–440px by pointer or keyboard;
  introduced TIL/DIL/CIL through plain-language change scenarios before their
  acronyms; and rewrote the diagonal-importance quiz as a concrete
  parameter-weighting decision. The expanded domain overlay no longer uses the
  mascot or product name as navigation; a quiet `Quay lại trang chính` action
  beneath the name now owns that behavior, with a standard back icon, a larger
  click target, and restrained hover, active, and keyboard-focus feedback.
  Removed the obsolete shared rail-toggle token, its stale wiring assertions,
  and always-true render branches left behind by the navigation redesign.
- 2026-08-11 — Polished the opening lessons with four focused illustrations for
  the static-checkpoint gap, full-retraining cost, new-data-only loss, and the
  context-dependent stability–plasticity trade-off. Reworked the forgetting lab
  opening with a bounded non-reproduction warning, concrete Task B data and
  wrong-output examples, and a separate experiment-process page; removed
  redundant numbered prefixes from its code headings. Added distinct normal and
  warning callout treatments, regular-weight quiz answers, navy lesson headings,
  and an orange circular marker for lab nodes. Removed superseded lesson images
  and the temporary full-row lab styling left behind during iteration.
- 2026-08-11 — Kept the lesson-search and status-filter controls fixed above a
  dedicated scroll region for the chapter list, avoiding the visual overlap of
  the earlier sticky treatment. Simplified the forgetting lab around two-column
  reference tables, beginner-oriented parameter explanations, descriptive
  evaluation variable names, and output-shaped examples. Removed the retired
  Matplotlib plot and asset, unused plotting/helper imports, duplicate seed
  calls, the unused NLL-threshold constant, and unconsumed qualitative-example
  storage; aligned the lesson metadata with the revised baseline-summary title.
  Renamed the generated-answer metric, helper, result columns, summaries, and
  quiz wording from Exact Match to Prefix Match because the implementation
  deliberately accepts outputs that begin with the gold answer. Standardized
  the Replay lab's beginner explanations into two-column reference tables for
  configuration, data generation, tokenization, evaluation, training, replay
  sampling, multi-seed execution, and threshold aggregation.
- 2026-08-11 — Added a beginner-facing RAG comparison to the course overview:
  retrieval changes inference context while continual adaptation targets model
  capability or behavior that must persist without a retrieved document. Added
  matching quiz coverage and bounded cross-references in Financial and
  Scientific DAP, CMR, and controllable-memory future directions, including
  ClimateGPT as a hybrid DAP, instruction-tuning, and retrieval-augmentation
  example. Added a side-by-side illustration of context retrieval versus a
  persistent model update. The quiz bank now contains 158 questions, with the
  157 single-choice answers distributed as evenly as mathematically possible
  across A/B/C/D.

# Follow-up — Align Replay lab answer variable names

## Goal

Make the Experience Replay lab use the same beginner-readable generated-answer
variable names as the Catastrophic Forgetting lab.

## Decisions (locked)

- Rename `prediction` to `predicted_answer` and `gold` to `expected_answer` in
  the Replay lab's `greedy_prefix_match` example.
- Rename the matching qualitative-example dictionary keys so the stored sample
  fields use the same terminology.
- Update the nearby parameter table and Prefix Match explanation to show the
  renamed expression.
- Remove the Replay lab's four `MetricBars` summaries and use the existing
  `==...==` output-marker syntax to highlight the corresponding metric columns
  and values directly inside each preceding output block, matching Lab 1.
- Preserve the Prefix Match behavior, returned values, representative outputs,
  lesson structure, routes, and all unrelated authored content.

## Phases

1. Update only
   `src/content/learning/continual-learning-llm/2.1.3-replay-experience-code-lab.vi.mdx`.
2. Search both lab files for stale standalone `gold` / `prediction` terminology
   and confirm Lab 2 matches Lab 1 at the evaluation example boundary.
3. Run the narrowest content check needed for this MDX-only rename and
   `git diff --check`; do not run a full build unless the content check exposes
   a broader issue.
4. Record the completed edit and verification result in this execution log,
   restore the plan status to `done`, and avoid a separate wiki update because
   the runtime architecture and durable Learning Lab contract do not change.

## Out of scope

- Changing the Prefix Match algorithm or thresholds.
- Refactoring other Replay lab helpers, outputs, metrics, or lesson copy.
- Renderer implementation, catalog, quiz, route, or architecture changes.

- 2026-08-11 — Added this pending follow-up after confirming Lab 1 already uses
  `predicted_answer` / `expected_answer` while Lab 2 still uses `prediction` /
  `gold`; awaiting explicit approval before editing lesson content.
- 2026-08-11 — User approved immediate execution and expanded the follow-up to
  replace the Replay lab's animated metric bars with Lab 1-style highlighted
  output values; plan moved to `executing`.
- 2026-08-11 — Renamed the Replay evaluation example to
  `predicted_answer` / `expected_answer`, synchronized its stored example keys
  and explanation, removed all four Replay `MetricBars`, and highlighted the
  corresponding values directly in their output blocks. The focused Learning
  MDX suite passed all 15 tests and `git diff --check` passed; no wiki update
  was needed because the catalog and runtime architecture are unchanged.
- 2026-08-11 — Replaced all eleven uses of the abstract Vietnamese term
  `ngân sách` in the Replay lab with context-specific wording: `số mẫu` or
  `tổng số mẫu` for dataset size and `chi phí tính toán` for compute fairness.
  Confirmed the lesson contains no stale `ngân sách`, `gold`, `prediction`, or
  `MetricBars` references; `git diff --check` passed.
- 2026-08-11 — User approved a final Replay-lab cleanup and commit: retain the
  two authored multi-seed charts, remove unconsumed qualitative examples,
  unused After-A seed evaluation data, and unused aggregate statistics, then
  verify and commit only the owning plan, Replay MDX, and two chart assets.
- 2026-08-11 — Completed the cleanup: `greedy_prefix_match` and
  `evaluate_tasks` now return only consumed metrics; the multi-seed loop skips
  the unused After-A evaluation and column; aggregation omits unused B/std and
  A-NLL/std fields. Added the per-seed and aggregate threshold charts to their
  matching pages. `npm run verify` passed with TypeScript, 86 tests, and the
  production build; only the existing large-chunk warning remains.
- 2026-08-11 — User approved a concise rewrite of the Parameter Regularization
  importance-matrix page: show full pairwise `Sigma`, explain its meaning, warn
  about `O(n^2)`, reduce to the diagonal approximation, and conclude with
  per-weight importance; remove the existing comparison and memory detours.
- 2026-08-11 — Rewrote the page as approved and removed the Euclidean prelude,
  comparison matrix, and 1B-parameter memory example. The target MDX compiled
  successfully and `git diff --check` passed. The repository-wide Learning MDX
  test remains red because the separately modified Replay quiz currently lacks
  four declared question IDs (154 questions found versus 158 expected); that
  unrelated quiz scope was intentionally not changed during this page rewrite.
- 2026-08-11 — User approved a systematic math-rendering pass for the paired
  Parameter Regularization quiz: add shared inline-KaTeX parsing to quiz text
  and replace every remaining plain `lambda`, `Sigma`, and `Omega_i` glyph in
  that quiz rather than patching individual questions.
- 2026-08-11 — Added shared `$...$` inline-KaTeX rendering for standard quiz
  prompts, options, and feedback while preserving existing inline-code styling.
  Converted every plain math glyph in the Parameter Regularization lesson/quiz
  pair to KaTeX source. TypeScript, target quiz MDX compilation, and
  `git diff --check` passed.
- 2026-08-11 — User approved adding the supplied architecture-expansion
  illustration to the first Architecture page and replacing three temporary
  asset names with descriptive, lesson-ordered filenames; all authored MDX
  references must move with the files.
- 2026-08-11 — Added the four-stage shared-backbone/branch illustration between
  the Architecture page's expansion explanation and routing caveat. Renamed it
  to `01-architecture-expansion-shared-backbone-branches.png`; renamed the two
  Replay charts to `02-replay-threshold-by-seed.png` and
  `03-replay-threshold-mean-std.png`. No stale UUID/output references remain;
  both affected MDX files compiled and `git diff --check` passed.
- 2026-08-11 — User supplied a second Architecture Expansion illustration for
  the final CoLoR paragraph. Add it beside the routing-failure explanation with
  a descriptive filename, accessible alt text, and a concise caption.
- 2026-08-11 — Renamed the supplied illustration to
  `02-architecture-expansion-routing-failure.png` and placed it immediately
  after the final CoLoR routing caveat. Its alt text and caption explain that a
  preserved expert can still produce the wrong output when inference selects
  the wrong route, and connect Task ID availability to the TIL/DIL/CIL result.
  The target MDX compiled, the asset path and stale UUID checks passed, and
  `git diff --check` passed.
- 2026-08-11 — User clarified that the routing-failure illustration belongs at
  the end of the lesson's first visible page, not at the end of the CoLoR page.
- 2026-08-11 — Moved the routing-failure illustration to the end of page 1,
  directly after its TIL/DIL/CIL inference caveat and before the source line.
  The target MDX compiled, the image occurs exactly once, and
  `git diff --check` passed.
- 2026-08-11 — User supplied a replacement for the CoLoR routing illustration.
  Preserve the existing descriptive asset path and lesson position, replace the
  image bytes, and align its alt text and caption with the new four-stage flow.
- 2026-08-11 — Replaced `01-architecture-expansion-lora-routing.png` with the
  supplied four-panel CoLoR pipeline and removed its temporary UUID filename.
  Updated the existing alt text and caption to cover training, expert addition,
  prototype construction, and prototype-based inference. The target MDX
  compiled, the stale UUID check passed, and `git diff --check` passed.
- 2026-08-11 — User requested a lower-density treatment of the three consumer
  resource constraints on the first Supplier–Consumer page: replace only the
  existing cards with three concise semantic bullets.
- 2026-08-11 — Replaced the three Supplier–Consumer resource cards with short
  bullets for data, infrastructure, and pre-training while preserving the lead
  sentence and following pipeline content. The target MDX compiled, stale card
  copy was absent, and `git diff --check` passed.
- 2026-08-11 — User requested that the final Supplier–Consumer paragraph shift
  from taxonomy recap to a practical resource-based choice, using an individual
  researcher and the later paper distribution as the bridge.
- 2026-08-11 — Replaced the taxonomy recap with a resource-based conclusion:
  individual researchers usually work from the consumer side through DAP or
  fine-tuning on existing checkpoints, which leads into the course's stronger
  downstream-adaptation paper coverage. The target MDX compiled, stale copy was
  absent, and `git diff --check` passed.
- 2026-08-11 — User supplied a four-stage Supplier–Consumer illustration for
  the end of page 1 and explicitly requested preserving the existing
  vertical/horizontal illustration.
- 2026-08-11 — Renamed the supplied asset to
  `01-supplier-consumer-production-pipeline.png` and added it after the
  Supplier–Consumer flow at the end of page 1. Preserved the existing
  vertical/horizontal illustration and reference. The target MDX compiled,
  both lesson images were present, the stale UUID check passed, and
  `git diff --check` passed.
- 2026-08-11 — User requested carrying the new resource-based conclusion into
  the paired quiz. Reuse the existing `consumer-role` question so the theory ↔
  quiz concept contract and question count remain unchanged.
- 2026-08-11 — Reworked the existing `consumer-role` question around an
  individual researcher's resource constraints. The correct choice now uses an
  existing checkpoint for DAP or fine-tuning, and its feedback explains why
  later papers emphasize downstream adaptation. The quiz MDX compiled, the
  question ID remained unique, and `git diff --check` passed.
- 2026-08-11 — User requested a parallel CPT assessment about why large-scale
  CPT papers remain relatively scarce and whether an individual researcher can
  still contribute. Add the idea to theory first, then add one paired concept
  and quiz question without overstating resource cost as the sole cause.
- 2026-08-11 — Added the paired `cpt-research-access` concept to CPT theory and
  quiz. Theory frames data/compute cost as one practical cause of limited CPT
  work and identifies accessible entry points; the new quiz checks that an
  individual can contribute through smaller open-weight models, data selection,
  efficient methods, or benchmarks. Both MDX files compiled, concept occurrence
  checks passed, and `git diff --check` passed.
- 2026-08-11 — User supplied a visual replacement for the three Data/Team/
  Compute cards on the Vertical CL Pre-training page. Preserve the surrounding
  authored explanation and replace only that card group with the illustration.
- 2026-08-11 — Renamed the supplied asset to
  `02-vertical-pretraining-requirements.png` and replaced the Data/Team/Compute
  `CourseCards` with a single lesson image at the same position. Preserved the
  page's opening and concluding paragraphs. The target MDX compiled, stale UUID
  and card-label checks passed, and `git diff --check` passed.
- 2026-08-11 — User supplied a medical-domain DAP illustration and requested it
  immediately after the hospital/private-data example on the Vertical CL page.
- 2026-08-11 — Renamed the supplied asset to
  `03-vertical-dap-medical-domain.png` and inserted it directly after the
  hospital/private-data example. Added alt text and a caption covering general
  pre-training, private domain data, DAP, and downstream use. The target MDX
  compiled, the stale UUID check passed, and `git diff --check` passed.
- 2026-08-11 — User supplied a Fine-tuning illustration for the final Vertical
  CL page, then identified an ordering error in its middle panel. Regenerate the
  asset so the hierarchy is exactly Hospital → Cardiology Department → Medical
  Record Summarization System, while preserving the two surrounding panels and
  the established hand-drawn visual style; then add the corrected image at the
  end of the Fine-tuning page.
- 2026-08-11 — Regenerated the Fine-tuning illustration with image editing so
  the middle panel now contains exactly Hospital → Cardiology Department →
  Medical Record Summarization System, with the extra generic medical stage
  removed and both surrounding panels preserved. Saved it as
  `04-vertical-finetuning-specialization.png` and added it after the page's
  concluding sentence, before the source. Visual inspection, target MDX
  compilation, stale UUID/path checks, and `git diff --check` all passed.
- 2026-08-11 — User supplied an overview illustration to replace the benefit /
  risk comparison table on the first Vertical Forgetting page. Preserve the
  surrounding definition and causal transition, replacing only that table.
- 2026-08-11 — Renamed the supplied asset to
  `01-vertical-forgetting-overview.png` and replaced the benefit/risk
  `ComparisonMatrix` with the image at the same position. Alt text and caption
  cover upstream inheritance, downward adaptation, forgetting, and the fact
  that each stage does not start from zero. The target MDX compiled, stale UUID
  and table-label checks passed, and `git diff --check` passed.
- 2026-08-11 — User requested a concise callback below the Vertical Forgetting
  overview to CoLoR's reuse of a pretrained ViT backbone. Add one sourced
  sentence without reopening the full Architecture Expansion explanation.
- 2026-08-11 — Added a one-sentence CoLoR callback after the overview image:
  CoLoR reuses an ImageNet-21k-pretrained ViT-B/16 backbone, retains the base
  weights, and learns dataset-specific LoRA rather than rebuilding the
  representation from scratch. The target MDX compiled, the sentence occurred
  exactly once, and `git diff --check` passed.
- 2026-08-11 — User supplied an illustration for the end of the Task
  Heterogeneity page. Preserve its existing comparison and mitigation cards;
  add the visual afterward as a summary of freezing and task unification.
- 2026-08-11 — Renamed the supplied asset to
  `02-vertical-task-heterogeneity-mitigation.png` and added it after the two
  mitigation cards at the end of the page. Alt text and caption connect frozen
  backbones/head-adapter updates with unified text-to-text task formulation.
  The target MDX compiled, the stale UUID check passed, and
  `git diff --check` passed.
- 2026-08-11 — User supplied an overview illustration for Horizontal
  Forgetting. Preserve the existing learn-new/retain-old table and place the
  visual immediately afterward as its concrete summary.
- 2026-08-11 — Renamed the supplied asset to
  `01-horizontal-forgetting-overview.png` and added it after the overview table.
  The table remains intact; alt text and caption cover sequential stages, the
  acquisition/retention balance, and declining old-stage performance. The
  target MDX compiled, the stale UUID check passed, and
  `git diff --check` passed.
- 2026-08-11 — User supplied an illustration for the Long Task Sequence page
  and requested its three existing cards appear in one row. Use the component's
  scoped `threeColumns` option rather than changing shared layout behavior.
- 2026-08-11 — Renamed the supplied asset to
  `02-horizontal-long-task-sequence.png`, added it after the three cards, and
  enabled `threeColumns` on only that `CourseCards` instance. The cards now form
  one row at the component's large-screen breakpoint while retaining responsive
  behavior below it. The target MDX compiled, the scoped prop and stale UUID
  checks passed, and `git diff --check` passed.
- 2026-08-11 — User requested a dedicated Gradual Shift quiz question. Promote
  the already-taught comparison row to a paired concept and add one concise
  recognition question without adding another theory page.
- 2026-08-11 — Added the paired `horizontal-gradual-shift` concept and a fourth
  quiz question that distinguishes month-to-month overlapping news shifts from
  abrupt or absent shifts. Updated quiz headings, keywords, and page count while
  keeping theory at three pages. Both MDX files compiled, concept occurrence
  checks passed, and `git diff --check` passed.
- 2026-08-11 — User supplied a two-row Gradual/Abrupt Shift illustration for
  the final Horizontal Forgetting page. Preserve its existing comparison table
  and add the visual immediately afterward.
- 2026-08-11 — Renamed the supplied asset to
  `03-horizontal-gradual-abrupt-shift.png` and added it after the final page's
  Gradual/Abrupt comparison table. Alt text and caption emphasize overlap under
  gradual change versus distribution distance and interference under abrupt
  change. The target MDX compiled, the table remained present, the stale UUID
  check passed, and `git diff --check` passed.
- 2026-08-11 — User requested a final cleanup and commit of the accumulated
  Continual Learning lesson work. Audit every quiz for metadata/question-count
  drift caused by manually removed questions, remove only demonstrably unused
  code/assets, run repository verification, stage the complete current course
  scope, review the staged diff, and commit it as one intentional change set.
- 2026-08-11 — Completed the final cleanup. Removed four stale Replay quiz
  concepts left behind after their questions were deleted manually, reducing
  that quiz from 15 to 11 pages and synchronizing its theory metadata. Updated
  the aggregate quiz contract to 156 questions (155 single-choice and one
  multi-choice), reordered options only where needed to keep correct-answer
  positions varied, and removed one unreferenced intermediate UUID image. All
  renamed lesson images are referenced exactly once; no old `output.png`,
  `output1.png`, or UUID content references remain. `npm run verify` passed
  TypeScript, all 86 tests, and the production build; `git diff --check` also
  passed.
- 2026-08-11 — User requested restoring the previously unused UUID illustration
  and using it to replace the Retention cost / Acquisition cost comparison
  table in the CPT Effectiveness & Efficiency lesson. Preserve the surrounding
  introduction and follow-up explanation while changing only that visual block.
- 2026-08-11 — Restored the supplied UUID illustration and replaced only the
  Retention cost / Acquisition cost `ComparisonMatrix` with a `LessonImage`.
  Added descriptive Vietnamese alt text and a concise caption while preserving
  both surrounding paragraphs. The generic Learning Lab MDX contract test and
  `git diff --check` passed; the asset has exactly one lesson reference.
- 2026-08-11 — User clarified that the restored CPT cost illustration must also
  receive a semantic filename. Rename the UUID asset and update its single MDX
  reference without changing lesson content or layout.
- 2026-08-11 — Renamed the illustration to
  `01-cpt-retention-acquisition-cost.png` and updated its only MDX reference.
  The UUID filename and references are gone, and `git diff --check` passed.
- 2026-08-11 — User supplied an illustration for the Similarity / Perplexity /
  Token-type entropy comparison. Rename it semantically and add it immediately
  after the existing three-signal table, before the following lesson note.
- 2026-08-11 — Renamed the supplied asset to
  `02-cpt-data-selection-signals.png` and added it directly after the comparison
  table with Vietnamese alt text and caption. The table and following note are
  preserved. The generic MDX contract test, stale UUID checks, single-reference
  check, and `git diff --check` all passed.
- 2026-08-11 — User requested neutral text colors across every advantage and
  limitation block in the CPT Distribution Shifts node while preserving the
  distinct green/rose surfaces. Add a scoped component option so this lesson
  can opt in without changing PaperTradeoff styling across other lessons.
- 2026-08-11 — Added the scoped `neutralText` option to `PaperTradeoff` and
  enabled it on all 12 blocks in CPT Distribution Shifts. Their green/rose
  backgrounds and borders remain distinct, while both headings now use the
  normal theme title color and bullet text retains the normal body color. Other
  lessons remain unchanged. TypeScript, the generic MDX contract test, and
  `git diff --check` passed.
- 2026-08-11 — User requested removing the Content Shift / Temporal Shift
  comparison table from the Temporal Shift page. Preserve the surrounding
  definition, Messi example, and all subsequent teaching content.
- 2026-08-11 — Removed only the requested comparison table. The Temporal Shift
  definition now flows directly into the Messi example; all later content is
  unchanged. The generic MDX contract test and `git diff --check` passed.
- 2026-08-11 — User requested replacing all five advantage/limitation blocks in
  the CPT Other Directions lesson with five separate two-card doodle images.
  Generate one consistent semantic illustration for CEM, RHO-1, IR-DRO,
  industrial periodic updates, and CPT sustainability; preserve each paper's
  core trade-off in the image, alt text, and caption, then replace only the five
  `PaperTradeoff` blocks.
- 2026-08-11 — Generated five consistent 1672×941 two-card doodle illustrations
  with the built-in image generator: CEM, RHO-1, IR-DRO, industrial updates,
  and CPT sustainability. Saved them as semantic assets `03` through `07` and
  replaced all five `PaperTradeoff` blocks with `LessonImage` components. Each
  image keeps concise advantage/limitation labels, while Vietnamese alt text and
  captions preserve the lesson's trade-off. The target now has exactly five
  images and no `PaperTradeoff`; every asset is referenced once. The generic MDX
  contract test and `git diff --check` passed.
- 2026-08-11 — User requested the same two-card doodle treatment for DAP Across
  Domains, but images must be added below rather than replacing the existing
  advantage/limitation blocks. Generate 17 semantic illustrations in lesson
  order: 2 Legal, 3 Medical, 2 Financial, 3 Scientific, 3 Code, and 4 other DAP
  directions. Preserve all `PaperTradeoff` content and insert one `LessonImage`
  immediately after each corresponding block.
- 2026-08-12 — Generated 17 consistent 1672×941 two-card doodle illustrations
  with the built-in image generator and saved them as semantic DAP assets `01`
  through `17`. Added one image with descriptive alt text immediately below each
  corresponding `PaperTradeoff`; no original advantage/limitation content was
  removed. The lesson retains exactly 17 trade-off blocks and now has exactly 17
  matching images, each referenced once. The generic MDX contract test and
  `git diff --check` passed.

# Verification

- Combined Python fences in the fifteen-page Replay lab parse as one valid
  copy-in-order Python program after excluding the Colab install magic.
- Catalog and MDX tests validate all 77 authored Continual Learning nodes and
  the exact Theory/Quiz mappings for the 38 paired lessons.
- `npm run verify` passed: TypeScript, all 86 tests, and the production build.
- `git diff --check` passed. Vite retains its non-blocking warning for chunks
  larger than 1 MB; no build errors remain.

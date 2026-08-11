---
title: Continual Learning Course for Learning Lab
status: done
created: 2026-08-08T10:35:00+07:00
updated: 2026-08-11T09:05:26+07:00
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
- 2026-08-10 — Removed the forced “one A, B, C, D per four-question quiz” rule,
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

# Verification

- Combined Python fences in the fifteen-page Replay lab parse as one valid
  copy-in-order Python program after excluding the Colab install magic.
- Catalog and MDX tests validate all 77 authored Continual Learning nodes and
  the exact Theory/Quiz mappings for the 38 paired lessons.
- `npm run verify` passed: TypeScript, all 86 tests, and the production build.
- `git diff --check` passed. Vite retains its non-blocking warning for chunks
  larger than 1 MB; no build errors remain.

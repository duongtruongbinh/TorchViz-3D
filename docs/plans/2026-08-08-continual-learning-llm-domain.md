---
title: Continual Learning Course for Learning Lab
status: done
created: 2026-08-08T10:35:00+07:00
updated: 2026-08-10T00:03:54+07:00
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
- Authored seven tracks and 38 adjacent Theory/Quiz pairs (76 published nodes):
  fundamentals, core methods, continual pre-training/domain adaptation,
  instruction tuning/alignment, replay/memory, regularization/PEFT, and
  evaluation/research frontiers.
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

## Theory and quiz contract

- Added optional, unique `conceptIds` to generic Learning MDX metadata.
- Each published theory lesson and its quiz carry the same concept set; quiz
  question IDs must match that set exactly. This prevents untaught quiz content
  and theory claims without assessment coverage.
- Reviewed all Continual Learning quizzes for plausible distractors and varied
  correct-answer positions. The course contains 161 questions: 160
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
  `ComparisonMatrix`, `DatasetComposition`, `MetricBars`, and
  `ConceptSpectrum`.
- Added `LessonImage`, backed by a generic `src/assets/learning/**` Vite glob,
  so lessons reference domain assets without a domain-specific renderer map.
- Added spotlight behavior for the paper evidence cards: the first card is
  active by default, hover moves focus, and leaving the group restores the first
  card. Single-column mode supports sequential reading.
- Added authored illustrations for the static-snapshot gap, update trade-off,
  unconstrained new-data fine-tuning, TIL/DIL/CIL, Vertical/Horizontal CL,
  replay constraints, and both forgetting labs.
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

# Verification

- Combined Python fences in the fifteen-page Replay lab parse as one valid
  copy-in-order Python program after excluding the Colab install magic.
- Catalog and MDX tests validate all 76 published Continual Learning nodes and
  their exact Theory/Quiz mappings.
- `npm run verify` passed: TypeScript, all 84 tests, and the production build.
- `git diff --check` passed. Vite retains its non-blocking warning for chunks
  larger than 1 MB; no build errors remain.

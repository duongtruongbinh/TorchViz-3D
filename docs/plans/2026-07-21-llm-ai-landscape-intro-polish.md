---
title: LLM AI Landscape Intro Polish
status: done
created: 2026-07-21T13:44:25+07:00
updated: 2026-07-23T02:51:33+07:00
author: nmkhiem
task: "Polish and extend the Vietnamese LLM lessons, then consolidate the final implementation state."
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Make the Vietnamese LLM course easier to scan and explore, extend its
evaluation material, and retain a concise record of the final implementation
without the superseded design iterations that produced it.

# Lineage

This plan continues the approved
[Learning Lab content architecture and LLM course](./2026-07-14-approved-llm-lessons-mdx-migration.md).
It records the final state of the July 21–23 polish work; the earlier plan
remains the source of truth for the MDX migration itself.

# Durable constraints

- Preserve the typed TOC -> React-free catalog -> canonical route/selector
  flow. Lesson IDs and route construction remain catalog-owned.
- Keep authored Vietnamese prose and structured lesson data in locale MDX.
  Keep domain-specific React presentation in the LLM renderer package and the
  approved MDX component registry.
- Do not move catalog metadata into `localization.ts`, create parallel practice
  payloads, or introduce non-canonical lesson routes.
- Lesson prose is full width. Do not add local `max-w-*` constraints to prose.
- Learning Lab runtime is locked to light mode. New lesson-only presentation
  does not need unreachable dark variants; the older shared theme contract is
  retained where other code still depends on it.
- Use Be Vietnam Pro for the Learning Lab shell and authored content, with
  monospace reserved for code-specific surfaces.
- Cleanup must preserve visible content, behavior, routes, quiz fixtures, and
  page counts unless an approved content change explicitly says otherwise.

# Final product decisions

## AI landscape and course convention

- The overview uses an interactive nested scope visual: AI contains ML, ML
  contains DL, DL branches into CV and NLP, and NLP contains the highlighted
  LLM target.
- AI/ML/DL/CV/NLP/LLM labels are explorable. A selected label promotes its
  explanation into the title area; a back affordance and Escape return to the
  overview.
- The hierarchy is presented as a course communication convention, not an
  absolute taxonomy. CV and NLP predate modern deep learning and still include
  traditional image-processing, rule-based, and statistical methods.
- ML, CV, and LLM are compared through concise problem, tooling/model, and
  skill lanes. Role labels are scope hints rather than rigid job boundaries.

## Shared Learning Lab presentation

- Authored prose uses a 16px/28px reading rhythm and remains full width.
- Light-mode typography uses a navy-ink title/body/muted hierarchy.
- The lesson rail uses one blue treatment for unfinished nodes and green for
  completion. Unfinished Quiz nodes use a question icon and are excluded from
  visible lesson numbering; the selected row uses the established solid-blue
  treatment.
- Quiet rail/filter states share the Learning Lab muted-opacity token and
  recover full emphasis on interaction.
- Code samples use the shared code-block primitive and its macOS-style header
  dots. Numeric citations remain plain inline links instead of badge-like UI.

## Token IDs

- The Token IDs lesson includes the Vietnamese word “đường” in two contexts to
  show that tokenizer lookup IDs do not themselves encode contextual meaning.
- Both sequences highlight the same illustrative token ID and hand off to the
  later Transformer explanation. The corresponding checkpoint quiz covers the
  identity-versus-context distinction.

## Evaluation and Safety

- Chapter 2.2 appears after LLM Fundamentals so measurement, comparison, and
  safety concepts precede prompt engineering and API work.
- It contains 20 focused, one-page Vietnamese MDX lessons. Existing chapter IDs
  remain canonical even where visible numbering shifted.
- The perplexity material spans four pages and an eight-question checkpoint:
  sequence likelihood, normalization, exponent/sign intuition, limitations,
  and the boundary between pre-training and post-training evaluation.
- “Beyond Perplexity” spans two pages. It includes the Hugging Face benchmark
  preview and external resources, then an MMLU likelihood comparison followed
  by the bridge to human and LLM-as-a-Judge evaluation.
- Quantitative claims use direct primary-source citations when requested;
  generic source footers are not added to lesson prose.

# Final architecture and inventory

- The catalog exposes 12 domains, 82 tracks, and 652 lesson nodes.
- There are 53 authored locale-MDX files: 49 in LLM and 4 in Computer Vision.
  The remaining 599 catalog nodes intentionally use placeholder fallback.
- Evaluation renderer names remain allowlisted, registered through the LLM MDX
  component map, and invoked from locale MDX. No catalog or localization
  boundary changed during cleanup.

# Final implementation summary

- Added and polished the interactive AI landscape, comparison lanes, course
  convention page, and its checkpoint coverage.
- Applied the Learning Lab typography, navy-ink hierarchy, unified lesson rail,
  shared muted treatment, selected-row treatment, and code/citation conventions.
- Added the Token ID context-ambiguity page and quiz coverage.
- Added the Evaluation & Safety chapter and its authored Vietnamese lesson set,
  including the finalized perplexity and beyond-perplexity flows.
- Kept prose/data in MDX and reusable visualization logic in the existing LLM
  renderer boundary.

# Cleanup audit — 2026-07-23

## Removed or simplified

- Removed unused Be Vietnam Pro 500 and 800 imports; the Learning Lab uses the
  loaded 400, 600, 700, and 900 weights.
- Removed the unused `axisLabel` chart prop and single-use lesson-node kind
  abstraction. The rail now computes only the Quiz distinction it renders.
- Removed unreachable full-layout branches from the benchmark-likelihood and
  post-training evaluation renderers. Their sole MDX call sites used the compact
  variants, which are now the only implementations.
- Removed payload fields used only by those deleted branches:
  `compact`, `labels.highest`, `answers[].correct`, and `method`.
- Removed the unused perplexity preset `prompt` field/state and redundant
  resource `mark` metadata.
- Collapsed light/dark conditionals only in branch-added, lesson-specific
  surfaces whose runtime is light-only. The chosen class strings are the former
  light branches, so rendered light-mode behavior is unchanged.
- Corrected the hand-calculation lesson keywords so they describe that lesson
  rather than material moved to “Beyond Perplexity.”
- Updated the Learning Lab wiki inventory and final rail/light-mode description.

## Reviewed and kept

- Single-use MDX renderer adapters remain because they enforce the authored
  content/presentation boundary and registry contract.
- The two-view `LlmPerplexityGoodRange` content union remains because both views
  have active lesson callers.
- Optional `LlmLossDerivation` fields remain because each supports a real
  authored caller, including the earlier loss lesson.
- Existing shared theme helpers and older dark branches remain where removing
  them would become a broader theme refactor or risk unrelated behavior.
- Canonical lesson IDs, routes, selectors, catalog fixtures, page counts, quiz
  behavior, and visible lesson prose were not changed by cleanup.

# Verification record

- Opening polish: `npm run verify` passed TypeScript, 75 tests, MDX validation,
  and a 2,610-module production build; the existing large-chunk warning remained.
- Later content follow-up: `npm test` passed all 75 tests.
- Subsequent visual/content follow-ups used targeted static inspection and
  `git diff --check`; no additional production build was run.
- Cleanup audit (2026-07-23): `git diff --check` passed. Targeted `rg` checks
  confirmed the removed fields/imports are absent, the MDX allowlist -> adapter
  -> authored-call-site chain remains intact, the authored inventory is
  53/49/4, and no new prose `max-w-*` constraint was introduced. Per the
  explicit request, no test or build was run for this audit.

# Out of scope

- No redesign, lesson prose rewrite, route migration, fixture restructure,
  global theme rewrite, or unrelated refactor is part of the cleanup audit.
- No commit is created by this work.

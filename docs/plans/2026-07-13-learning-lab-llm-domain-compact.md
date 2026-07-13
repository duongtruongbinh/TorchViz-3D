---
title: Learning Lab LLM Domain Compact
status: done
created: 2026-07-02T05:24:08+07:00
updated: 2026-07-13T00:00:00+07:00
author: Codex
task: "Compact record for the Learning Lab LLM AI Engineering domain package, approved nodes 1-5, lesson polish, and cleanup prompt."
supersedes:
  - docs/plans/2026-06-25-learning-lab-domain-refactor.md
  - docs/plans/2026-06-30-learning-lab-catalog-consistency-fixes.md
---

# Goal

This file is the single compact plan/history record for the Learning Lab LLM AI
Engineering domain. It replaces the scattered LLM-specific plan notes that used
to live in separate files for the domain package refactor, early lesson polish,
the Iris scale slide, the tokenization split, and the beginner node 1-4 copy
pass.

This record was renamed on 2026-07-13 so the active LLM domain doc carries the
current date and current approval boundary.

# Current Boundary

- LLM AI Engineering content lives in
  `src/core/learning/content/llm-ai-engineering/`.
- The package owns tracks, approved lesson extras, references, and local approval
  gating.
- Domain-specific LLM extra rendering lives in
  `src/components/learning/domains/llm-ai-engineering/renderers.tsx`.
- Shared extra dispatch and asset lookup stay under
  `src/components/learning/lesson/extras/`.
- Runtime lesson images live under
  `src/assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/`.
- The approved early LLM path currently centers on nodes 1-5:
  `minimal-llm-project-skeleton`, `llm-from-scratch-roadmap`,
  `llm-component-checkpoint-quiz`, `llm-data-pipeline-overview`, and
  `llm-data-pipeline-checkpoint-quiz`.
- Node 1 is the compact setup/requirements lesson.
- Node 2 is the LLM-from-scratch roadmap lesson with approved visual/card
  polish for requirements, scale, why-LLMs-are-popular, tokenization, and the
  first data-pipeline lifecycle slide.
- Node 3 is the roadmap checkpoint quiz.
- Node 4 is the data-pipeline overview.
- Node 5 is the data-pipeline checkpoint quiz.

# Decisions

- Keep the LLM domain as a domain-owned package, not a growing monolithic
  catalog file.
- Keep approval gating local to the LLM package.
- Keep lesson content Vietnamese-first while preserving standard English
  technical terms such as token, embedding, logits, loss, Transformer, and GPT.
- Do not add a renderer registry until multiple domains need keyed custom extra
  routing.
- Keep Learning Lab route, shell, theme, and Workspace behavior out of LLM
  content-only changes.
- Prefer concrete learner examples over broad abstract paragraphs for the first
  LLM nodes.
- Treat old node 1-4 copy-pass notes as historical context only. The active
  approval boundary is now nodes 1-5, with UI/content polish still happening in
  small, user-reviewed increments.

# Compact History

## 2026-07-02 - Domain Package Refactor

- Moved LLM AI Engineering content into
  `src/core/learning/content/llm-ai-engineering/`.
- Moved roadmap runtime images into `src/assets/learning/...`.
- Added domain-owned renderers and asset resolution.
- Trimmed runtime extras to the approved payload.
- Simplified approval gating to a local id set.
- Removed premature shared type/rendering support for dormant diagrams,
  formulas, exercises, and code contracts.
- Removed unused KaTeX dependencies.
- Updated the Learning Lab wiki to describe approval-gated runtime support.
- Verification at the time: `npm run verify` passed.

## 2026-07-04 to 2026-07-05 - LLM Lesson Polish

- Changed focus panels so sibling panels remain visible instead of dimmed.
- Reused focus-panel styling for concept/highlight panels.
- Tightened quiz spacing and note block rendering.
- Approved the Colab coding requirements lesson as a compact one-slide setup
  node.
- Added the "Pipeline dữ liệu của LLM" lesson and custom pipeline visual.
- Clarified the pipeline idea around tokenization, GPT logits over vocabulary,
  target shifting, cross-entropy loss, and generation-time decode.
- Corrected approval gating after clarification: nodes 1-4 are approved; later
  LLM nodes remain placeholders.
- Verification at the time included `npm test`, `npm run build`, and later
  `npm run verify`.

## 2026-07-08 - Iris Scale Slide

- Added `iris-scale-comparison-roadmap` after the `why-large` slide in
  `llm-from-scratch-roadmap`.
- Removed the separate `classic-ml-vs-llm-iris` node from tracks, approval
  gating, and extras.
- Intent: show that small classical ML/statistical examples such as Iris can use
  tiny models, while modern LLMs operate at much larger parameter/data/compute
  scale.

## 2026-07-09 - Tokenization Example Split

- Split the roadmap tokenization example out of the first "Large Language Model
  là gì?" page into its own extra page.
- Kept the example before the next-token interaction so learners see token units
  before trying generation-by-token.
- Added `LearningTokenExample` support to concept panels where needed.

## 2026-07-09 - Beginner Node 1-4 Copy Pass

- Attempted to make nodes 1-4 easier for a learner who knows basic Python but
  does not yet know deep learning or Transformers deeply.
- Intended changes:
  - lower node 1 prerequisites;
  - add a node 2 mental model that text becomes tokens, tokens become ids, and
    the model predicts the next token;
  - adjust node 3 quiz wording away from memorization as the main story;
  - make node 4 start from a concrete data-pipeline/input-target bridge before
    the Transformer translation background.
- Outcome: technically verified, but content quality was rejected in review as
  too shallow, over-constrained, visually weaker, and harder to understand than
  the previous version. Treat this pass as a caution and not as a final content
  direction.

## 2026-07-13 - Approved Nodes 1-5 and Vertical Panel Polish

- Confirmed the LLM approval gate includes five approved nodes:
  `minimal-llm-project-skeleton`, `llm-from-scratch-roadmap`,
  `llm-component-checkpoint-quiz`, `llm-data-pipeline-overview`, and
  `llm-data-pipeline-checkpoint-quiz`.
- Consolidated the active LLM domain plan/history record under this dated file:
  `docs/plans/2026-07-13-learning-lab-llm-domain-compact.md`.
- Continued visual polish around reusable vertical lesson panels:
  top icon/media bands, equal-height portrait cards, compact body copy, neutral
  broad surfaces, and restrained color accents.
- Applied this pattern to setup requirements, scale factors, tokenization
  examples, why-LLMs-are-popular factors, and the data-pipeline lifecycle
  (`Pretraining` -> `Fine-tuning`).
- Keep this as a UI/content polish record, not a signal to broaden route,
  shell, Workspace, or practice architecture.

# Current Files

```text
src/core/learning/content/llm-ai-engineering/
  approval.ts
  extras.ts
  index.ts
  references.ts
  tracks.ts

src/components/learning/domains/llm-ai-engineering/
  renderers.tsx

src/components/learning/lesson/extras/
  LessonExtraRenderer.tsx
  assetRegistry.ts

src/assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/
  01-llm-from-scratch-roadmap-ai-hierarchy.png
  01-llm-from-scratch-roadmap-next-token-loop.png
  01-llm-from-scratch-roadmap-why-llms-popular-product.png
  01-llm-from-scratch-roadmap-why-llms-popular-technical.png
```

# Out Of Scope

- No route, shell, Landing, Workspace, Pyodide, torchstub, IR, layout, or
  Canvas3D changes are implied by this compact doc.
- No new lesson ids or new visual assets are implied by this compact doc.
- No claim that the old node 1-4 copy pass is pedagogically final.

# Prompt For Reducing Branch Code Against Main

Use this prompt when starting a dedicated cleanup pass for the current LLM branch:

```text
You are working in /home/khiem/TorchViz-3D on the current LLM Learning Lab branch.
Goal: reduce redundant or over-scoped code introduced on this branch compared
with main, while preserving the approved LLM domain behavior for nodes 1-5.

First inspect:
- git diff main...HEAD -- src/components/learning src/core/learning src/lib/localization.ts
- docs/plans/2026-07-13-learning-lab-llm-domain-compact.md
- wiki/concepts/learning-lab-refactor.md
- src/core/learning/content/llm-ai-engineering/approval.ts

Preserve:
- Approved nodes:
  1. minimal-llm-project-skeleton
  2. llm-from-scratch-roadmap
  3. llm-component-checkpoint-quiz
  4. llm-data-pipeline-overview
  5. llm-data-pipeline-checkpoint-quiz
- Vietnamese-first copy and standard English technical terms.
- The vertical lesson-panel pattern where it is currently user-approved.
- Domain-owned LLM content under src/core/learning/content/llm-ai-engineering/.

Cleanup targets:
- Remove dead props, duplicated palette arrays, unused renderer branches, unused
  imports, and one-off abstractions that no approved node uses.
- Merge repeated vertical-panel/card styling only when the local pattern is
  genuinely duplicated and the extraction reduces code.
- Keep domain-specific renderers domain-owned; do not create a global registry
  unless more than one domain needs it.
- Do not change route behavior, Landing, Workspace, Pyodide, torchstub, IR,
  layout engine, Canvas3D, or unrelated domains.
- Do not rewrite approved content just to refactor code.

Verification:
- Prefer the narrowest checks first: TypeScript or targeted tests if available.
- Run npm run verify only when the cleanup touches shared behavior or when the
  user explicitly asks.

Output:
- List each removed/reduced code path and why it was safe.
- List any behavior intentionally preserved.
- Mention any remaining duplication that should stay until another domain needs
  the same pattern.
```

# Absorbed Files

The following LLM-specific plan files were compacted into this single record and
removed from `docs/plans/`:

- `2026-07-04-learning-lab-focus-highlight-only.md`
- `2026-07-08-add-iris-comparison-slide.md`
- `2026-07-09-tokenization-example-next-page.md`
- `2026-07-09-llm-node-1-4-beginner-copy-pass.md`

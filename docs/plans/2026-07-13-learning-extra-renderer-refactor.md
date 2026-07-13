---
title: Learning Extra Renderer Refactor
status: done
created: 2026-07-13T17:15:00+07:00
updated: 2026-07-13T18:05:00+07:00
author: Codex
task: "Refactor LessonExtraRenderer so shared lesson extras stay generic while LLM custom panels move into the LLM domain renderer."
supersedes:
  - docs/plans/2026-07-13-learning-lab-llm-domain-compact.md
---

# Goal

Reduce `src/components/learning/lesson/extras/LessonExtraRenderer.tsx` from a
large mixed shared/domain file into a thin shared dispatcher plus focused shared
components, while preserving the approved LLM Learning Lab behavior for nodes
1-5:

- `minimal-llm-project-skeleton`
- `llm-from-scratch-roadmap`
- `llm-component-checkpoint-quiz`
- `llm-data-pipeline-overview`
- `llm-data-pipeline-checkpoint-quiz`

Success means generic quiz and concept-panel rendering remains reusable under
`src/components/learning/lesson/extras/`, LLM-specific panels move under
`src/components/learning/domains/llm-ai-engineering/`, and no route, content,
Landing, Workspace, Pyodide, torchstub, IR, layout, Canvas3D, or unrelated
domain behavior changes.

# Lineage

Supersedes and builds on
[2026-07-13-learning-lab-llm-domain-compact](./2026-07-13-learning-lab-llm-domain-compact.md),
which records the current LLM approval boundary and explicitly keeps
domain-specific LLM renderers domain-owned until reuse appears across domains.

# Decisions

- Keep a global renderer registry out of scope. Use a small explicit
  `llm-ai-engineering` domain branch only, because this branch has one custom
  domain today.
- Keep shared lesson extras generic:
  - top-level extra dispatch;
  - quiz rendering and quiz state types;
  - concept-panel rendering for panels that are intentionally generic: body,
    default highlights, tables, outlines, links, and generic notes;
  - shared frame/text/asset helpers.
- Move LLM-specific concept panels into the LLM domain renderer:
  - `colab-coding-requirements`;
  - `tokenization-example`;
  - `iris-scale-comparison-roadmap`;
  - `llm-training-lifecycle`;
  - `transformer-translation-step-*`;
  - `why-split-ai-fields`;
  - `why-large`;
  - `why-llms-are-popular-now`;
  - any LLM-only card/palette/diagram helper used solely by those panels.
- Preserve Vietnamese-first copy and approved vertical lesson-panel behavior.
- Do not rewrite approved lesson content just to refactor code.
- Work with the current dirty worktree and do not revert existing changes.
- Do not add a silent path where a missing custom renderer quietly receives the
  generic design. Route custom panels explicitly and let missing custom coverage
  surface as a bug.

# Phases

## Phase 0 - Store this plan

Create this plan file as the first write for the task and wait for explicit
approval before implementation.

## Phase 1 - Re-read current implementation

Read the current versions of:

- `src/components/learning/lesson/extras/LessonExtraRenderer.tsx`
- `src/components/learning/lesson/extras/LessonExtras.tsx`
- `src/components/learning/lesson/LessonDetail.tsx`
- `src/components/learning/domains/llm-ai-engineering/renderers.tsx`
- `src/core/learning/types.ts`
- `src/core/learning/content/llm-ai-engineering/extras.ts`

Confirm whether any user edits landed after the review.

## Phase 2 - Extract shared quiz rendering

Move quiz rendering, `QuizQuestionState`, and quiz helper functions from
`LessonExtraRenderer.tsx` into
`src/components/learning/lesson/extras/QuizBlock.tsx`.

Keep imports stable for `LessonDetail.tsx` and `LessonExtras.tsx` by updating
type imports deliberately.

## Phase 3 - Extract default shared concept panel

Move generic concept-panel rendering into
`src/components/learning/lesson/extras/ConceptPanelBlock.tsx`.

Keep only domain-neutral behavior there:

- title/emphasis frame handling;
- body paragraphs;
- default highlight rows;
- comparison table;
- outline;
- links;
- generic bodyAfter paragraphs/notes.

Remove unreachable or leftover branches during this phase if they are clearly
dead, such as the generic `colab-coding-requirements` bodyAfter branch after
that panel has already returned earlier.

## Phase 4 - Move LLM-specific concept panels

Move LLM-only concept-panel branches and helpers into the LLM domain renderer
area. The expected target is either one expanded
`src/components/learning/domains/llm-ai-engineering/renderers.tsx` or a small
local `panels/` folder if the file would otherwise remain oversized.

The domain renderer should handle:

- existing `motivation`;
- existing `conceptInteraction`;
- the LLM custom `conceptPanel` ids listed in Decisions.

The shared renderer should route explicitly:

- LLM custom ids go to the LLM domain renderer.
- Intentionally generic panels go to the shared concept renderer.
- No silent custom-to-generic fallback is introduced.

## Phase 5 - Thread domain id narrowly

Pass `lesson.domainId` from `LessonDetail` through `LessonExtras` to
`LessonExtraRenderer`, so domain dispatch is explicit and does not rely only on
extra ids.

Avoid a general registry until at least two domains need custom renderer
routing.

## Phase 6 - Verify and document

Run the narrowest useful checks first:

```bash
npm run typecheck
```

Run broader verification if the extraction touches enough shared behavior:

```bash
npm run verify
```

Update this plan's execution log with actual modifications and verification
results. Update `wiki/concepts/learning-lab-refactor.md` only if the final
module boundaries differ materially from what it already says.

# Out of scope

- No route behavior changes.
- No Landing, Workspace, Pyodide, torchstub, IR, layout engine, or Canvas3D
  changes.
- No unrelated domain changes.
- No new lesson ids, new content, new visual assets, or copy rewrites.
- No global renderer registry.
- No broad redesign of Learning Lab theme conventions.

# Regression checklist

- Node 1 setup requirements panel keeps the approved vertical cards, icons,
  command block, links, and summary note.
- Node 2 roadmap keeps motivation hierarchy, tokenization example,
  next-token/sentence interaction, scale cards, Iris comparison, popularity
  panels/images, roadmap outline, and reference links.
- Node 3 roadmap checkpoint quiz keeps single, multi, order, categorize, reset,
  feedback, drag/drop, and feedback scrolling behavior.
- Node 4 data-pipeline overview keeps lifecycle cards and Transformer
  translation steps 1-8.
- Node 5 data-pipeline checkpoint quiz keeps all quiz modes and labels.
- Dark/light themes remain visually equivalent to the current approved behavior.
- Vietnamese-first copy remains unchanged, with standard English technical
  terms preserved.
- Vertical lesson-page navigation and panel sizing remain unchanged.

# Execution log

- 2026-07-13 - Plan created and awaiting approval.
- 2026-07-13 - Plan approved; execution started.
- 2026-07-13 - Adjusted routing decision after user clarification: no silent
  custom-renderer fallback; generic rendering is only for intentionally generic
  panels.
- 2026-07-13 - Extracted shared quiz rendering and `QuizQuestionState` into
  `src/components/learning/lesson/extras/QuizBlock.tsx`.
- 2026-07-13 - Extracted intentionally generic concept-panel rendering into
  `src/components/learning/lesson/extras/ConceptPanelBlock.tsx`.
- 2026-07-13 - Replaced `LessonExtraRenderer.tsx` with a thin dispatcher that
  receives `domainId`, routes explicit LLM custom extras to the LLM domain
  renderer, routes quiz extras to `QuizBlock`, and routes generic concept
  panels to `ConceptPanelBlock`.
- 2026-07-13 - Moved LLM custom concept-panel rendering into
  `src/components/learning/domains/llm-ai-engineering/renderers.tsx`,
  including setup requirements, tokenization, Iris scale, training lifecycle,
  Transformer translation steps, why-split, why-large, and popularity panels.
- 2026-07-13 - Updated `LessonDetail`/`LessonExtras` to thread `lesson.domainId`
  narrowly through extra rendering.
- 2026-07-13 - Updated component wiring tests so scroll-helper and quiz-label
  guards track the new `QuizBlock` boundary.
- 2026-07-13 - Verification passed with `npm run verify` (`typecheck`, 92 node
  tests, and production build).
- 2026-07-13 - Updated `wiki/concepts/learning-lab-refactor.md` to describe
  the shared extras/domain-renderer boundary after the refactor.

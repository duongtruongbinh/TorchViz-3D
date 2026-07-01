---
title: Learning Lab Domain Package Initialization
status: done
created: 2026-07-02T05:24:08+07:00
updated: 2026-07-02T05:39:21+07:00
author: Codex
task: "Initialize a scalable Learning Lab domain package structure for domain-owned content, assets, renderers, localization, and approvals without changing current behavior."
supersedes:
  - docs/plans/2026-06-25-learning-lab-domain-refactor.md
  - docs/plans/2026-06-30-learning-lab-catalog-consistency-fixes.md
---

# Goal

Initialize the active Learning Lab domain-package pattern so future domains can
own their content, assets, localization, approval metadata, and custom renderer
hooks without forcing every new lesson or interaction into global files.

This is a first-domain package initialization pass, not a cleanup-only refactor
or a sequence of small commits. The pass must preserve current user-visible
behavior, keep Learning Lab light-theme-only, and avoid a broad rewrite of the
Lab shell.

# Lineage

Supersedes
[2026-06-25-learning-lab-domain-refactor](./2026-06-25-learning-lab-domain-refactor.md)
for the unified Learning Lab domain/catalog boundary.

Supersedes
[2026-06-30-learning-lab-catalog-consistency-fixes](./2026-06-30-learning-lab-catalog-consistency-fixes.md)
for catalog consistency work that this domain-package initialization extends.

# Context Read

- `docs/WORKFLOW.md` requires a stored approved plan before non-trivial edits.
- `CLAUDE.md` requires preserving the current app architecture and branch safety.
- `wiki/concepts/learning-lab-refactor.md` defines active Learning Lab invariants:
  React-free `src/core`, catalog-owned lesson identity, shared UI conventions in
  `theme.ts`, and approved practice gating.
- Current LLM content is concentrated in
  `src/core/learning/content/llmAiEngineering.ts`.
- Current lesson extra rendering is concentrated in
  `src/components/learning/lesson/LessonExtras.tsx`.
- Current long/global localization lives in `src/lib/localization.ts`.
- Current LLM runtime images are imported from `docs/assets/llm_from_scratch/`.

# Decisions

- Do one domain-package initialization pass after approval; do not split the work
  into multiple commits unless the requester later asks for commits.
- Keep behavior unchanged: the approved LLM roadmap lesson should render the
  same content, extras, images, and interactions after the initialization pass.
- Keep Learning Lab locked to light theme. Do not reintroduce a theme switch.
- Prefer domain packages over one-file-per-thing. Split files by ownership and
  volatility, not by a rigid rule that every lesson or component needs its own
  file.
- Move LLM content into a domain-owned folder under
  `src/core/learning/content/llm-ai-engineering/`.
- Keep placeholder lesson generation compact. Only move approved/custom-heavy
  lessons and extras into dedicated files when that reduces coupling.
- Introduce domain-owned approval metadata for lessons, using a map shape that
  can grow beyond the current single approved roadmap lesson.
- Keep global `src/lib/localization.ts` responsible for app chrome and shared
  labels. Domain-owned long-form lesson text may live beside domain content.
- Move runtime lesson assets into `src/assets/learning/...` so Vite owns them as
  source assets. Keep documentation-only media in `docs/assets/`.
- Split the shared lesson extra renderer enough to remove the single large
  renderer file, but do not force every future custom interaction into its own
  file. Domain-specific renderers may be grouped by domain until complexity
  warrants deeper splitting.
- Keep `src/core` React-free. Domain content can reference renderer keys or asset
  ids, but not React components.
- Use the narrow verification requested for this task: `npm run typecheck`.

# Proposed Shape

```text
src/core/learning/content/
  llm-ai-engineering/
    index.ts
    approval.ts
    tracks.ts
    lessons.ts
    references.ts
    extras.ts

src/components/learning/lesson/extras/
  LessonExtras.tsx
  LessonExtraRenderer.tsx
  ExtraFrame.tsx
  MotivationBlock.tsx
  ConceptPanelBlock.tsx
  DiagramView.tsx
  FormulaBlock.tsx
  ExerciseBlock.tsx
  CodeContractBlock.tsx
  customRendererRegistry.tsx

src/components/learning/domains/
  llm-ai-engineering/
    renderers.tsx

src/assets/learning/
  llm-ai-engineering/
    llm-from-scratch/
      roadmap/
        01-llm-from-scratch-roadmap-ai-hierarchy.png
        01-llm-from-scratch-roadmap-next-token-loop.png
```

The exact file set may be adjusted during implementation if the existing code
supports a smaller, cleaner split. The key invariant is ownership: domain content
and assets should not remain embedded in shared renderer files.

# Asset Naming Convention

Runtime lesson images should use the pattern:

```text
<lesson-number>-<lesson-id>-<asset-purpose>.<ext>
```

Examples for the current approved roadmap lesson:

```text
01-llm-from-scratch-roadmap-ai-hierarchy.png
01-llm-from-scratch-roadmap-next-token-loop.png
```

The asset id used by content and renderer registries may stay stable and short,
but the file name should carry the lesson order, lesson id, and purpose so future
domains can search assets by lesson number or lesson name.

# Initialization Pass

1. Move `llmAiEngineering.ts` into a domain package while preserving the public
   exports consumed by `src/core/learning/content/index.ts`.
2. Replace the single `APPROVED_LESSON` object with expandable lesson approval
   metadata and a small helper used by the LLM content package.
3. Move LLM lesson image assets from `docs/assets/llm_from_scratch/` into
   `src/assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/` and update
   runtime imports.
4. Split `LessonExtras.tsx` into a small dispatcher plus focused core block
   renderers. Preserve visual output and interaction behavior.
5. Add a custom renderer registry seam for future domain-specific interactions
   without converting all current core extras to registry-only rendering.
6. Reduce `types.ts` coupling where practical by avoiding LLM-specific asset
   literal types in the shared extra contract.
7. Update existing documentation, preferably
   `wiki/concepts/learning-lab-refactor.md`, with the new ownership conventions.
8. Record the actual modifications in this plan's execution log.
9. Run `npm run typecheck`.

# Out Of Scope

- No new Learning Lab features.
- No visual redesign.
- No dark theme switch.
- No route behavior changes.
- No progress persistence or UI store behavior.
- No changes to Pyodide, torchstub, IR tracing, layout, Canvas3D, or Workspace
  behavior.
- No broad rewrite of `LearningLabView`, `LearningLabHeader`, lesson rail, or
  practice renderers beyond import/path adjustments required by this
  initialization.
- No test/build verification beyond `npm run typecheck` for this task.

# Acceptance Criteria

- Existing Learning Lab behavior is preserved for the current approved LLM
  roadmap lesson.
- `src/core/learning/content/index.ts` still exports a valid `learningCatalog`.
- LLM content has a domain-owned folder and no longer relies on a single
  monolithic `llmAiEngineering.ts` file.
- Lesson approval metadata is expandable beyond one hard-coded approved lesson.
- Runtime LLM images are source-owned under `src/assets/learning/...`.
- Shared extra rendering is split into maintainable renderer modules.
- Future domain-specific UI can attach by key/registry without putting every
  custom interaction into global `types.ts` or a single shared renderer file.
- Existing relevant docs are updated instead of creating a new docs page.
- `npm run typecheck` passes.

# Execution Log

- 2026-07-02T05:24:08+07:00 - Draft plan created from the architecture review and
  requester direction to perform the domain package initialization in one
  implementation pass rather than split it into many commits.
- 2026-07-02T05:25:10+07:00 - Plan approved in chat; implementation pass begins.
- 2026-07-02T05:32:34+07:00 - Moved LLM AI Engineering content into a domain
  package under `src/core/learning/content/llm-ai-engineering/`, with separate
  tracks, approved extras, references, and expandable lesson approval metadata.
- 2026-07-02T05:32:34+07:00 - Moved LLM runtime lesson images into
  `src/assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/` and added a
  renderer-side asset registry.
- 2026-07-02T05:32:34+07:00 - Split lesson extra rendering into a compatibility
  wrapper, shared core extra package, diagram/frame/text helpers, custom renderer
  registry, and LLM domain-owned interaction renderers.
- 2026-07-02T05:32:34+07:00 - Updated the shared learning type contract so lesson
  approval metadata is typed and LLM-specific asset ids no longer live as literal
  variants in `LearningLessonExtra`.
- 2026-07-02T05:32:34+07:00 - Updated
  `wiki/concepts/learning-lab-refactor.md` with domain package, asset ownership,
  and custom renderer conventions.
- 2026-07-02T05:32:34+07:00 - Ran `npm run typecheck`; TypeScript passed.
- 2026-07-02T05:34:09+07:00 - Cleaned up `types.ts` formatting and reran
  `npm run typecheck`; TypeScript passed.
- 2026-07-02T05:35:36+07:00 - Reworded the plan from a generic refactor framing
  to a first-domain package initialization framing and added the runtime lesson
  asset naming convention requested for future domains.
- 2026-07-02T05:39:00+07:00 - Follow-up approved in chat. Renamed the two LLM
  roadmap runtime images to lesson-searchable names, updated the asset registry,
  and documented the convention in the Learning Lab wiki page.
- 2026-07-02T05:39:21+07:00 - Ran `npm run typecheck`; TypeScript passed.

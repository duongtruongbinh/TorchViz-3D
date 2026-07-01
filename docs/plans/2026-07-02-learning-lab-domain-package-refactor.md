---
title: Learning Lab Domain Package Refactor
status: done
created: 2026-07-02T05:24:08+07:00
updated: 2026-07-02T05:57:43+07:00
author: Codex
task: "Initialize and then simplify the Learning Lab LLM domain package without changing current visible behavior."
supersedes:
  - docs/plans/2026-06-25-learning-lab-domain-refactor.md
  - docs/plans/2026-06-30-learning-lab-catalog-consistency-fixes.md
---

# Goal

Move LLM AI Engineering content toward a domain-owned package while preserving
the current approved `llm-from-scratch-roadmap` lesson, keeping Learning Lab
light-theme-only, and avoiding premature abstractions.

# Lineage

Supersedes
[2026-06-25-learning-lab-domain-refactor](./2026-06-25-learning-lab-domain-refactor.md)
for the unified Learning Lab domain/catalog boundary.

Supersedes
[2026-06-30-learning-lab-catalog-consistency-fixes](./2026-06-30-learning-lab-catalog-consistency-fixes.md)
for catalog consistency work.

# Decisions

- Keep `src/core/learning/content/llm-ai-engineering/` as the domain package for
  LLM tracks, references, approved roadmap extras, and local approval gating.
- Keep only currently visible approved extras in runtime metadata. Planned
  diagrams, formulas, exercises, and code contracts stay out of the shared type
  surface until a later approved lesson needs them.
- Use direct domain renderer handling for current custom LLM extras. Do not keep
  a renderer registry until more than one domain needs keyed custom routing.
- Keep runtime lesson images under `src/assets/learning/...` with
  lesson-searchable filenames and lesson-scoped asset ids.
- Keep documentation-only/reference dumps out of Git when they are local source
  material rather than app/runtime docs.
- Preserve current visible Learning Lab output and avoid route, theme, or
  workspace behavior changes.

# Final Shape

```text
src/core/learning/content/llm-ai-engineering/
  approval.ts
  extras.ts
  index.ts
  references.ts
  tracks.ts

src/components/learning/lesson/extras/
  ExtraFrame.tsx
  LessonExtraRenderer.tsx
  LessonExtras.tsx
  assetRegistry.ts
  lessonExtraText.ts

src/components/learning/domains/llm-ai-engineering/
  renderers.tsx

src/assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/
  01-llm-from-scratch-roadmap-ai-hierarchy.png
  01-llm-from-scratch-roadmap-next-token-loop.png
```

# Out Of Scope

- No new Learning Lab features.
- No visual redesign or dark-theme work.
- No route behavior changes.
- No changes to Pyodide, torchstub, IR tracing, layout, Canvas3D, or Workspace
  behavior.
- No changes to the approved LLM roadmap visible content.

# Execution Log

- 2026-07-02T05:24:08+07:00 - Draft plan created and approved in chat.
- 2026-07-02T05:32:34+07:00 - Moved LLM AI Engineering content into
  `src/core/learning/content/llm-ai-engineering/`, moved runtime lesson images
  into `src/assets/learning/...`, and added initial domain-owned renderers and
  asset resolution.
- 2026-07-02T05:39:21+07:00 - Renamed the two roadmap runtime images to
  lesson-searchable filenames and documented the convention.
- 2026-07-02T05:57:43+07:00 - Cleanup review approved. Trimmed runtime extras to
  the approved roadmap payload, simplified approval gating to a local id set,
  removed unused lesson approval metadata from shared learning types, removed the
  premature renderer registry and dormant diagram/formula/exercise/code-contract
  renderer support, removed KaTeX dependencies, scoped asset ids, and updated the
  Learning Lab wiki to describe current approval-gated runtime support.
- 2026-07-02T05:57:43+07:00 - Ran `npm run verify`; typecheck, 78 tests, and
  production build passed.
- 2026-07-02T05:57:43+07:00 - Follow-up cleanup moved remaining renderer copy
  for the LLM roadmap hierarchy and token interaction controls into domain
  content metadata.

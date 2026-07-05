---
title: Learning Lab LLM Lesson Polish
status: done
created: 2026-07-04T22:04:30+07:00
updated: 2026-07-05T14:38:00+07:00
author: Codex
task: "Polish LLM Learning Lab lesson panels, quiz spacing, roadmap content, and completed-node rail visuals."
supersedes:
  - docs/plans/2026-07-02-learning-lab-domain-package-refactor.md
---

# Goal

Polish the early LLM Learning Lab lesson experience: focus panels should
highlight without dimming siblings, quiz pages should feel tighter, the new
Colab coding requirements lesson should be approved and visually scannable, and
completed rail nodes should remain green without connector bleed-through.

# Lineage

Supersedes
[2026-07-02-learning-lab-domain-package-refactor](./2026-07-02-learning-lab-domain-package-refactor.md)
for the current LLM domain renderer and approved roadmap lesson package.

# Decisions

- Preserve the existing `.learning-lab-focus-panel` class and `data-active`
  wiring, and reuse it for repeated concept/highlight panels.
- Remove opacity/filter dimming from focus-panel siblings; the active panel
  gains emphasis through ring, contrast, and a small lift.
- Keep the highlight ring visible by giving focus groups a small horizontal
  gutter and avoiding bottom drop shadows.
- Approve the Colab coding requirements lesson and keep it to one theory slide
  for now; project/OOP structure is deferred to a later chapter.
- Keep completed rail nodes green, but make completed node backgrounds opaque
  so the connector does not visually bleed through the check circle.

# Phases

## Phase 0 - Store this plan

- Create this draft plan and wait for explicit approval.

## Phase 1 - Implement highlight-only behavior

- Update `src/index.css` so focus panels remain fully visible by default.
- Remove hover/focus sibling dimming and active-panel demotion rules.
- Adjust focus-panel transition properties only if needed after removing dimming.

## Phase 2 - Verify and record

- Inspect the changed CSS for unintended broad effects.
- Run the narrowest useful verification for CSS/TypeScript safety when asked.
- Record the executed changes in this plan's execution log and update relevant
  docs only if the visible behavior needs long-lived documentation.

# Out of scope

- No changes to Learning Lab routing, catalog metadata, or lesson approval
  gating beyond approving the single Colab coding requirements lesson.
- No implementation of the actual Colab notebooks or OOP GPT-mini project.

# Execution log

- 2026-07-04T22:04:30+07:00 - Draft plan created.
- 2026-07-04T22:05:11+07:00 - Plan approved in chat.
- 2026-07-04T22:06:25+07:00 - Updated `src/index.css` so Learning Lab focus
  panels stay fully visible by default and sibling panels are no longer dimmed
  during hover/focus; active, hover, and focus highlight styling remains.
- 2026-07-04T22:06:25+07:00 - Ran `npm test` and `npm run build`; both passed.
- 2026-07-04T22:41:19+07:00 - Extended the approved work with LLM lesson
  polish: reused focus-panel styling for concept highlights, removed dimming and
  bottom shadow, added focus-group gutter, tightened quiz section spacing, split
  note blocks, merged punctuation/whitespace quiz categories, approved the Colab
  coding requirements lesson, replaced its second slide with a one-slide concept
  panel, and refined completed rail node connector rendering.
- 2026-07-05T13:22:00+07:00 - Extended the approved LLM lesson polish with the
  "Pipeline dữ liệu của LLM" page: added the pipeline overview lesson and custom
  visual, clarified GPT logits over vocabulary, shifted training targets,
  cross-entropy loss, and generation-time decode, and labelled decode as the
  `7*` generation branch rather than a linear step after training.
- 2026-07-05T13:28:37+07:00 - Reviewed the diff before commit, removed the
  redundant follow-up plan file, made the pipeline flow column titles visible,
  fixed the `PipelineExample` literal typing issue found by TypeScript, and ran
  `npm run verify` successfully.
- 2026-07-05T14:05:00+07:00 - Reopened the approved plan for merge-readiness
  review and small safe cleanup requested before merging.
- 2026-07-05T14:11:00+07:00 - Reduced duplicate highlight-link rendering,
  removed the linear arrow into the `7*` generation decode branch, and reran
  `npm run verify` successfully.
- 2026-07-05T14:24:00+07:00 - Corrected LLM lesson approval gating so only
  node 4 (`llm-data-pipeline-overview`) is currently approved; other LLM nodes
  remain placeholders until explicitly approved.
- 2026-07-05T14:38:00+07:00 - Corrected approval gating again after user
  clarification: nodes 1-4 are approved, while later LLM nodes remain
  placeholders.

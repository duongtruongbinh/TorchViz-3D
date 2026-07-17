---
title: Reset Learning Node Numbers per Chapter
status: done
created: 2026-07-16T14:20:00+07:00
updated: 2026-07-16T14:25:00+07:00
author: Nguyen Manh Khiem and Codex
task: "reset Learning Lab lesson-node numbering to 1 within every chapter"
supersedes:
  - docs/plans/2026-07-16-move-llm-pipeline-to-pretraining-generation.md
---

# Goal

Display lesson nodes as 1, 2, 3, ... independently inside each Learning Lab
chapter instead of continuing the count across the whole domain.

# Lineage

Supersedes [Move LLM Pipeline Overview to Pretraining and Generation](./2026-07-16-move-llm-pipeline-to-pretraining-generation.md).

# Decisions and phases

1. Keep the flattened domain index for previous/next lesson navigation.
2. Add a separate chapter-local lesson index map for rail display, preserving
   original chapter positions during filtering and search.
3. Pass the chapter-local map to `LessonRail`; do not change lesson IDs, routes,
   TOC order, or content.
4. Inspect affected references and the diff only. Do not run tests, build, or
   verify per the user's request.
5. Record the modification here and update the existing Learning Lab wiki only
   if its numbering description requires clarification.

# Out of Scope

- Content or filename changes.
- Changing cross-chapter previous/next navigation.
- Automated tests, build, or verify.

# Execution Log

- 2026-07-16T14:20:00+07:00 — Traced the UI issue to the domain-wide flattened
  `lessonIndexById` map used by `LessonRail`; stored this draft plan.
- 2026-07-16T14:22:00+07:00 — User explicitly approved the plan.
- 2026-07-16T14:22:30+07:00 — Execution started.
- 2026-07-16T14:25:00+07:00 — Split the domain-wide navigation index from a
  chapter-local rail display index. Each chapter now displays nodes from 1
  while previous/next navigation continues across the complete domain.
- 2026-07-16T14:25:00+07:00 — Preserved original chapter positions during rail
  filtering/search, inspected all index-map references, and ran
  `git diff --check`. Tests, build, and verify were not run per user request.

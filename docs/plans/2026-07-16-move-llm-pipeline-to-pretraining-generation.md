---
title: Move LLM Pipeline Overview to Pretraining and Generation
status: done
created: 2026-07-16T14:05:00+07:00
updated: 2026-07-16T14:14:00+07:00
author: Nguyen Manh Khiem and Codex
task: "move the LLM pipeline overview lesson pair from chapter 1.2 to chapter 1.5"
supersedes:
  - docs/plans/2026-07-16-llm-mdx-chapter-node-prefixes.md
---

# Goal

Place the broad training-and-generation overview in chapter `1.5 Pretraining &
Generation` instead of the tokenizer-focused chapter 1.2.

# Lineage

Supersedes [LLM MDX Chapter and Node Filename Prefixes](./2026-07-16-llm-mdx-chapter-node-prefixes.md).

# Decisions (locked)

- Move `llm-data-pipeline-overview` and its quiz from the beginning of chapter
  1.2 to the beginning of chapter 1.5.
- Rename their files to `1.5.1-llm-data-pipeline-overview.vi.mdx` and
  `1.5.2-llm-data-pipeline-checkpoint-quiz.vi.mdx`.
- Change the visible overview title from `Pipeline dữ liệu của LLM` to a title
  describing its actual training, Transformer, and generation overview; keep
  canonical lesson IDs, routes, body content, and quiz IDs unchanged.
- Keep chapter 1.2 focused on tokenization, beginning with
  `tokenization-why-it-matters`.
- Do not run tests, build, or `npm run verify`, per the user's explicit request.

# Phases

1. Store this plan and obtain explicit approval as required by the repository.
2. Move the two TOC nodes to the start of chapter 1.5 and update their visible
   titles.
3. Rename the two MDX files to their chapter 1.5 prefixes and align authored
   metadata titles.
4. Update the existing Learning Lab wiki ordering and record the modifications
   here. Inspect the diff only; do not run tests or build.

# Out of Scope

- Rewriting lesson or quiz content.
- Renumbering other authored lessons.
- Changing IDs, routes, renderer keys, or application behavior beyond ordering.
- Running automated verification commands.

# Execution Log

- 2026-07-16T14:05:00+07:00 — Stored the draft plan after confirming chapter
  1.5 is the intended destination.
- 2026-07-16T14:10:00+07:00 — User explicitly approved the plan.
- 2026-07-16T14:10:30+07:00 — Execution started.
- 2026-07-16T14:14:00+07:00 — Moved the overview and quiz to the beginning of
  chapter 1.5, renamed their MDX prefixes from 1.2 to 1.5, and changed the
  overview title to `Tổng quan quy trình huấn luyện và sinh token` while
  preserving canonical IDs and authored content.
- 2026-07-16T14:14:00+07:00 — Updated the existing Learning Lab filename
  example, inspected the affected TOC and references, and ran
  `git diff --check`. Automated tests, build, and verify were intentionally not
  run per the user's request.

---
title: LLM AI Landscape Intro Polish
status: done
created: 2026-07-21T13:44:25+07:00
updated: 2026-07-21T13:44:25+07:00
author: Codex
task: "Redesign the opening of the Vietnamese AI landscape lesson for clearer scope and hierarchy."
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Make the opening of “Bức tranh tổng quan về AI” easier to scan while showing
that narrower AI domains sit inside broader ones.

# Lineage

Continues [Learning Lab Content Architecture and LLM Course](./2026-07-14-approved-llm-lessons-mdx-migration.md).

# Decisions

- Keep the authored Vietnamese explanation and split its three ideas clearly.
- Use a full-width nested scope visual: AI contains ML, ML contains DL, DL
  contains CV and NLP, and NLP contains the highlighted LLM target.
- Preserve the existing illustration, hierarchy cards, routes, and content
  architecture below the opening.

# Execution log

- 2026-07-21 — Reworked the opening copy flow and implemented responsive,
  light/dark nested scope boxes with an amber LLM focal state.
- 2026-07-21 — Removed superseded layout iterations and retained only the final
  renderer/content changes.

# Verification

- `npm run verify` passed: TypeScript, 75 tests, MDX validation, and the
  2,610-module production build.
- The build retained its existing large-chunk warning.

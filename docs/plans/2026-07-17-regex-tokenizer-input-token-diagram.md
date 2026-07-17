---
title: Add an Input-to-Token Diagram to the Regex Lesson
status: done
created: 2026-07-17T15:55:00+07:00
updated: 2026-07-17T16:12:00+07:00
author: Codex
task: "add a visual input-text to tokenized-text diagram before the regex tokenizer code"
supersedes:
  - docs/plans/2026-07-17-simple-regex-tokenizer-lesson.md
---

# Goal

Add a compact diagram before the first code block so learners see the intended
input-text → tokenized-text transformation before reading the implementation.

# Lineage

Continues [Add a Simple Regex Tokenizer Code Lesson](./2026-07-17-simple-regex-tokenizer-lesson.md) with a visual preview requested after reviewing the completed lesson.

# Decisions (locked)

- Recreate the reference as a code-native responsive diagram; do not embed or
  copy the supplied watermarked image.
- Use the lesson's existing sentence and final token sequence so visual and code
  examples remain consistent.
- Place the diagram only on the first page, directly before the terminal block.
- Show two labeled rows, `Input text` and `Tokenized text`, connected by an
  arrow; render each token in a bordered cell.
- Preserve light/dark theme support and allow horizontal overflow only for the
  token row on compact screens.

# Phases

## Phase 0 — Store and approve

- Record the visual specification and wait for explicit approval.

## Phase 1 — Add optional authored diagram data

- Extend the regex walkthrough payload with an optional input/token diagram.
- Author that payload only on page one.

## Phase 2 — Render and verify

- Render the diagram before the existing code/output terminal.
- Run the focused MDX test, type check, and diff check; record the result here.

# Out of scope

- Changing the code, output, paragraph, lesson order, or other lesson pages.
- Adding an image asset, dependency, animation, or interactive tokenizer.

# Execution log

- 2026-07-17 — Inspected the supplied reference, current renderer, and first
  MDX page; selected a code-native two-row transformation diagram.
- 2026-07-17 — Plan created; awaiting approval.
- 2026-07-17 — Approved by requester; execution started.
- 2026-07-17 — Added optional authored diagram data to the regex walkthrough
  and populated it only on the first lesson page with the existing sentence and
  its 15 final tokens.
- 2026-07-17 — Rendered a responsive two-row input/token diagram before the
  terminal, with directional arrows, bordered token cells, light/dark styling,
  and compact-screen horizontal overflow.
- 2026-07-17 — Focused MDX tests passed (9/9), `npm run typecheck` passed, and
  `git diff --check` passed. No production build was run for this local visual
  addition.
- 2026-07-17 — Follow-up polish replaced the heavy left-label/form layout with
  one compact centered vertical flow, a single connector, softer labels, and
  separate word versus punctuation token tones. Type check and diff check
  passed.

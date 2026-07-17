---
title: Add a Quiz for the Regex Tokenizer Code Lesson
status: done
created: 2026-07-17T16:50:00+07:00
updated: 2026-07-17T17:15:00+07:00
author: Codex
task: "add a quiz node for the simple regex tokenizer code lesson"
supersedes:
  - docs/plans/2026-07-17-simple-regex-tokenizer-lesson.md
  - docs/plans/2026-07-17-regex-tokenizer-final-pages-pacing.md
---

# Goal

Add a six-question quiz immediately after the regex tokenizer code lesson and
before the BPE lesson, covering only concepts and outputs taught in the code
walkthrough.

# Lineage

Continues [Add a Simple Regex Tokenizer Code Lesson](./2026-07-17-simple-regex-tokenizer-lesson.md) and its [final-page pacing refinement](./2026-07-17-regex-tokenizer-final-pages-pacing.md).

# Decisions (locked)

- Add one published `tokenizer-regex-from-scratch-quiz` node after
  `tokenizer-regex-from-scratch` and before BPE.
- Keep the catalog and lesson title simply `Quiz` because it directly follows
  the lesson it checks.
- Author six questions, one per lesson stage: self-contained input, capturing
  whitespace, punctuation split output, cleanup comprehension, reusable
  function behavior, and regex-tokenizer limitations.
- Use single- and multi-select questions with plausible distractors grounded in
  nearby code mistakes; vary correct-answer positions.
- Do not test BPE mechanics, token IDs, embeddings, or other concepts not taught
  in this code lesson.

# Phases

## Phase 0 — Store and approve

- Record the quiz scope, position, and coverage; wait for explicit approval.

## Phase 1 — Add catalog node and quiz MDX

- Insert the published Quiz node into the typed TOC.
- Author six Vietnamese-first questions with unique stable IDs and feedback.

## Phase 2 — Synchronize tests and docs

- Update MDX file/page/question expectations, catalog totals, and the existing
  Learning Lab wiki authored-lesson list.

## Phase 3 — Verify and record

- Run focused catalog and MDX tests, type check, and diff check.
- Record actual changes and results here.

# Out of scope

- Modifying the code lesson, BPE lesson, quiz renderer, or interaction behavior.
- Adding a new quiz mode, dependency, route, or documentation page.

# Execution log

- 2026-07-17 — Inspected the adjacent TOC, the six-page code lesson contract,
  existing BPE quiz conventions, catalog/MDX tests, and Learning Lab wiki.
- 2026-07-17 — Defined six question objectives aligned one-to-one with the
  taught code progression.
- 2026-07-17 — Plan created; awaiting approval.
- 2026-07-17 — Approved by requester; execution started.
- 2026-07-17 — Added the published `tokenizer-regex-from-scratch-quiz` TOC
  node immediately after its code lesson and before BPE.
- 2026-07-17 — Authored six Vietnamese-first single/multi questions covering
  self-contained input, capturing whitespace, punctuation split output,
  cleanup comprehension, reusable function behavior, and regex limitations.
- 2026-07-17 — Updated MDX file/page/question expectations, catalog totals, and
  the existing Learning Lab wiki. The catalog now has 630 lessons, 28 published
  lessons (24 LLM and 4 CV exercises), and 602 placeholders.
- 2026-07-17 — Focused catalog and MDX tests passed (16/16), `npm run typecheck`
  passed, and `git diff --check` passed.
- 2026-07-17 — Follow-up review removed the self-contained-input question, so
  the quiz now has five focused questions. Added safe inline-code rendering for
  backtick-delimited prompt, option, and feedback fragments in the shared quiz
  UI. Focused MDX tests (9/9), type check, and diff check passed.

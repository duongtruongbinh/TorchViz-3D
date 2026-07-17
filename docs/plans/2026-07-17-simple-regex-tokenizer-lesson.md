---
title: Add a Simple Regex Tokenizer Code Lesson
status: done
created: 2026-07-17T15:25:00+07:00
updated: 2026-07-17T15:42:00+07:00
author: Codex
task: "add an original-text regex tokenizer walkthrough after the tokenization fundamentals quiz"
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Add a code-first lesson immediately after “Tại sao lại là Token mà không phải
word?” and its quiz. The lesson builds a simple regex tokenizer step by step
using only an original paragraph authored for TorchViz-3D.

# Lineage

Continues [Learning Lab Content Architecture and LLM Course](./2026-07-14-approved-llm-lessons-mdx-migration.md), preserving typed-TOC navigation, locale MDX content ownership, and domain renderer boundaries.

# Decisions (locked)

- Insert one published lesson between `tokenization-why-it-matters-quiz` and
  `tokenization-bpe-tiktoken`.
- Do not use `the-verdict.txt`, The Verdict excerpts, “Hello, world”, or another
  third-party/sample passage.
- Define `raw_text` directly from an original short paragraph so the example is
  self-contained and needs no file download.
- Teach the progression in five pages: inspect original text; split whitespace;
  split punctuation; remove empty/whitespace items and support broader
  punctuation; apply the tokenizer to the full paragraph and count tokens.
- Use an MDX-authored payload with one reusable LLM renderer for consistent,
  readable code and output blocks. This is explanatory code, not a live Python
  execution environment.
- End with the limitations of this handcrafted tokenizer as the conceptual
  bridge into the following BPE lesson.

# Phases

## Phase 0 — Store and approve this plan

- Record the lesson position, original-text constraint, and page progression;
  wait for explicit approval.

## Phase 1 — Add the catalog node and MDX lesson

- Add the published lesson to the typed TOC immediately after the fundamentals
  quiz.
- Author five Vietnamese-first MDX pages with deterministic Python snippets and
  outputs over the original paragraph.

## Phase 2 — Add the focused code renderer

- Add one domain MDX component that renders the current step, code, output, and
  takeaway without adding a new generic content contract or dependency.
- Keep each page focused on one regex refinement.

## Phase 3 — Synchronize tests and existing docs

- Update authored-file/page expectations and materialized catalog counts.
- Update the existing Learning Lab wiki page with the new authored lesson and
  accurate catalog/published/placeholder totals; do not create another docs
  page.

## Phase 4 — Verify and record

- Run focused Learning MDX/catalog tests, type check, and diff check.
- Record the files changed and verification results here.

# Out of scope

- A live Python runner, downloadable corpus, file upload, or editor integration.
- BPE training, token IDs, embeddings, dataloaders, or a new quiz.
- Rewriting the existing fundamentals, quiz, or BPE lessons.

# Execution log

- 2026-07-17 — Inspected the typed TOC, adjacent fundamentals/quiz/BPE MDX,
  shared MDX primitives, domain renderer pattern, tests, and Learning Lab docs.
- 2026-07-17 — Selected a self-contained five-step lesson and an original
  paragraph rather than adapting The Verdict or Hello World.
- 2026-07-17 — Plan created; awaiting approval.
- 2026-07-17 — Approved by requester; execution started.
- 2026-07-17 — Added the published `tokenizer-regex-from-scratch` TOC node
  immediately after the tokenization-fundamentals quiz and before BPE.
- 2026-07-17 — Authored five Vietnamese-first MDX pages using an original
  242-character paragraph. Python 3 verification produced the documented
  intermediate lists and final count of 53 regex tokens.
- 2026-07-17 — Added `TokenizerRegexWalkthrough`, a focused domain renderer
  with readable line-numbered Python and output panes plus one conceptual
  takeaway per page.
- 2026-07-17 — Updated authored-file/page expectations, materialized catalog
  totals, and the existing Learning Lab wiki. The catalog now has 629 lessons:
  27 published (23 LLM and 4 CV exercises) and 602 placeholders.
- 2026-07-17 — Focused Learning catalog and MDX tests passed (16/16), `npm run
  typecheck` passed, and `git diff --check` passed. Production build was not run
  for this lesson-scoped content/UI addition.

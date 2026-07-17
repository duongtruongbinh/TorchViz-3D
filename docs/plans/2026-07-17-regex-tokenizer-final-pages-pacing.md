---
title: Improve the Regex Tokenizer Final-Page Pacing
status: done
created: 2026-07-17T16:25:00+07:00
updated: 2026-07-17T16:38:00+07:00
author: Codex
task: "slow down the final regex tokenizer lesson step by separating function construction from full-text application"
supersedes:
  - docs/plans/2026-07-17-simple-regex-tokenizer-lesson.md
---

# Goal

Give the end of the regex tokenizer lesson a clearer progression by separating
reusable tokenizer construction from applying it to the full paragraph.

# Lineage

Refines [Add a Simple Regex Tokenizer Code Lesson](./2026-07-17-simple-regex-tokenizer-lesson.md) after review found that its fifth page combined too many conceptual steps.

# Decisions (locked)

- Expand the lesson from five to six pages.
- Make page five define `tokenize(text)` from the regex split and cleanup logic
  already taught, then verify it with the same sentence used on pages two to
  four.
- Make page six call `tokenize(raw_text)`, show the first 30 tokens, report the
  total of 45 tokens, and only then explain the regex tokenizer's limitations
  and bridge into BPE.
- Keep the original paragraph, sentence, regex, outputs, renderer, lesson route,
  and TOC position unchanged.
- Reuse the cleaned-token diagram on page five; page six remains focused on
  scaling the reusable function to the full paragraph.

# Phases

## Phase 0 — Store and approve

- Record the revised six-page progression and wait for explicit approval.

## Phase 1 — Split the final step

- Replace the current page five with a function-construction page.
- Add page six for full-paragraph application and the BPE bridge.

## Phase 2 — Synchronize and verify

- Update lesson metadata and page-count expectations.
- Run the focused MDX test and diff check; record results here.

# Out of scope

- Adding a quiz, live execution, vocabulary/ID construction, embeddings, or a
  new renderer.
- Changing adjacent lessons or the catalog node structure.

# Execution log

- 2026-07-17 — Reviewed the fifth page and identified three combined actions:
  reconstructing preprocessing, applying it to `raw_text`, and introducing BPE
  limitations.
- 2026-07-17 — Selected a reusable-function page followed by a full-text page
  as the smallest pacing correction.
- 2026-07-17 — Plan created; awaiting approval.
- 2026-07-17 — Approved by requester; execution started.
- 2026-07-17 — Expanded the lesson to six pages. Page five now defines and
  verifies the reusable `tokenize(text)` function with the established example
  sentence and cleaned-token diagram.
- 2026-07-17 — Page six now applies `tokenize(raw_text)`, previews 30 tokens,
  reports the total of 45, and provides the regex-limitations bridge into BPE.
- 2026-07-17 — Updated the MDX page-count expectation. Focused MDX tests passed
  (9/9), `npm run typecheck` passed, and `git diff --check` passed.

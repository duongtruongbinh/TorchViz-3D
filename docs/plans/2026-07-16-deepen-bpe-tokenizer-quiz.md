---
title: Deepen BPE Tokenizer Quiz
status: done
created: 2026-07-16T01:00:00+07:00
updated: 2026-07-16T01:30:00+07:00
author: Codex
task: "replace the superficial Huấn luyện tokenizer bằng BPE quiz with questions that test understanding and application"
supersedes:
  - docs/plans/2026-07-16-tokenizer-code-readability-polish.md
---

# Goal

Make the four-question quiz for `tokenization-bpe-tiktoken` assess whether the
learner can apply the BPE merge idea, reason about vocabulary tradeoffs, and
connect tokenizer signals to Python code structure instead of recalling UI
animation details.

# Lineage

Continues [Tokenizer Code Readability Polish](./2026-07-16-tokenizer-code-readability-polish.md),
which completed the lesson content that this quiz checks.

# Context Read

- Three current questions test animation recall: the next displayed token, the
  final displayed state, and what the Next button does.
- Only the final question checks a durable concept, and it remains a direct
  restatement of the lesson conclusion.
- The source lesson teaches repeated BPE merges, vocabulary balance between
  common and rare strings, and preservation of whitespace/newline/code signals.
- The quiz uses authored MDX and supports both single-answer and multi-answer
  questions without renderer changes.

# Decisions

- Keep four questions and the existing quiz route/page count.
- Replace UI-memory prompts with four application-focused checks:
  1. apply one learned merge consistently across a token sequence;
  2. reason through the result of consecutive merges;
  3. choose the vocabulary behavior that balances common and rare strings;
  4. identify the structural code signals a tokenizer must preserve.
- Use one multi-answer code question so learners must distinguish all relevant
  signals rather than recognize one obvious sentence.
- Give every distractor a plausible misconception and make success/error copy
  explain the reasoning, not merely reveal the answer.
- Change only the quiz MDX plus the existing question-id expectation if ids are
  renamed. Do not change the shared quiz renderer, route, catalog, or lesson UI.

# Phases

## Phase 0 — Store and approve this plan

- Store this plan as the first write for the follow-up task.
- Wait for explicit user approval.

## Phase 1 — Rewrite the authored quiz

- Replace all four shallow questions with scenario-based questions grounded in
  the two lesson pages.
- Align headings, keywords, explanations, and stable question ids with the new
  coverage.

## Phase 2 — Static review and record

- Check MDX syntax, answer coverage, distractor quality, and targeted diff.
- Follow the user's prior instruction not to run tests, `npm run verify`, or a
  production build unless the user changes that instruction.
- Mark the plan done and record the exact modifications. No wiki update is
  expected because quiz architecture is unchanged.

# Out of Scope

- Quiz renderer/UI changes.
- Increasing the question count.
- Adding concepts not taught in the source lesson, such as corpus frequency
  calculations or the full BPE training algorithm.
- Changes to other tokenization lessons or quizzes.

# Execution Log

- 2026-07-16 — Compared the existing four-question quiz with both lesson pages;
  identified three animation-recall questions and stored this content-only plan.
- 2026-07-16 — User approved the plan; execution started without tests, verify,
  or build as previously requested.
- 2026-07-16 — Replaced all four animation-recall questions with application
  questions covering repeated matches, consecutive merges, vocabulary
  generalization, and code-structure signals. Updated headings, keywords,
  feedback, distractors, and the existing question-id expectation.
- 2026-07-16 — Targeted `git diff --check`, question-count review, correct-answer
  review, and source/expectation ID parity passed. No test, verify, or build was
  run, and no wiki update was needed because quiz architecture was unchanged.

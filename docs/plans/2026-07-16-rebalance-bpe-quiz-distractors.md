---
title: Rebalance BPE Quiz Distractors
status: done
created: 2026-07-16T04:00:00+07:00
updated: 2026-07-16T04:20:00+07:00
author: Codex
task: "replace distractors and vary correct-answer positions for BPE quiz questions one through three"
supersedes:
  - docs/plans/2026-07-16-expand-bpe-theory-and-realign-quiz.md
---

# Goal

Make questions 1–3 less predictable and more diagnostic by replacing weak
distractors with plausible BPE misconceptions and moving their correct answers
away from the first option.

# Lineage

Refines the quiz authored in
[Expand BPE Theory and Realign Quiz](./2026-07-16-expand-bpe-theory-and-realign-quiz.md).

# Decisions

- Change only options, option order, and matching feedback for questions 1–3.
- Keep question prompts, ids, page count, metadata, and question 4 unchanged.
- Target these misconceptions:
  - confusing BPE initialization with word or pre-learned subword splitting;
  - confusing frequency-based adjacent-pair merging with whole-word,
    semantic, or one-pass merging;
  - confusing fixed merge-rank inference with greedy longest-match,
    input-time frequency counting, or semantic re-segmentation.
- Place correct answers at different positions across questions 1–3.
- Do not change the quiz renderer or shared tests.

# Phases

## Phase 0 — Store and approve

- Store this plan and wait for explicit user approval.

## Phase 1 — Rewrite distractors and ordering

- Update the three option sets and feedback where needed.
- Verify each question has exactly one correct answer and no ambiguous distractor.

## Phase 2 — Static review and record

- Inspect the targeted diff and run `git diff --check` only.
- Do not run tests, verify, or build per the user's standing instruction.
- Mark the plan done; no documentation update is needed.

# Out of Scope

- Question 4, lesson theory, visuals, metadata, renderer, routes, or question ids.

# Execution Log

- 2026-07-16 — Scoped the request to the first three option sets and stored this
  draft plan.
- 2026-07-16 — User approved the plan; execution started with correct-answer
  positions targeted at 3, 4, and 2 for questions 1–3.
- 2026-07-16 — Replaced all distractors in questions 1–3 with closer BPE
  misconceptions, reordered correct answers to positions 3, 4, and 2, and
  aligned each error explanation with the new choices.
- 2026-07-16 — Targeted `git diff --check`, single-correct-answer review, and
  manual answer-position review passed. No tests, verify, or build were run.

---
title: Support Negative Numeric Literals in Learning MDX
status: done
created: 2026-07-17T14:20:00+07:00
updated: 2026-07-17T14:32:00+07:00
author: Codex
task: "fix Learning Lab MDX validation for negative numeric literals"
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Allow safe negative numeric literals in static Learning Lab MDX props so the
tokenization vocabulary lesson compiles without weakening the prohibition on
executable MDX expressions.

# Lineage

Continues [Learning Lab Content Architecture and LLM Course](./2026-07-14-approved-llm-lessons-mdx-migration.md), which established the static locale-MDX validation pipeline.

# Decisions (locked)

- Fix the validator to read the ESTree `UnaryExpression.argument` field rather
  than changing semantically meaningful negative embedding values in lesson
  content.
- Continue allowing only unary minus applied directly to a numeric literal;
  other unary or executable expressions remain rejected.
- Add focused regression coverage for accepted negative literals and rejected
  unsupported unary expressions.

# Phases

## Phase 0 — Store and approve this plan

- Record the diagnosed parser mismatch and wait for explicit approval.

## Phase 1 — Correct static expression handling

- Update the Learning MDX AST node contract, static-expression assertion, and
  static-value extraction to use `argument` for unary expressions.

## Phase 2 — Add regression coverage

- Extend the Learning MDX content tests with negative numeric literal coverage
  and retain a rejection case for unsupported unary expressions.

## Phase 3 — Verify and document

- Run the narrow MDX test/build checks, then `npm run verify` if the narrow
  checks pass.
- Record the exact modifications and verification results here and update the
  existing Learning Lab documentation only if its durable authoring contract
  needs clarification.

# Out of scope

- Expanding MDX to general JavaScript expressions.
- Changing the lesson's embedding-vector values or visual design.
- Altering catalog, routing, or localization behavior.

# Execution log

- 2026-07-17 — Diagnosed an ESTree field mismatch: the validator checks
  `UnaryExpression.expression`, while unary operands are stored in `argument`.
- 2026-07-17 — Plan created; awaiting approval.
- 2026-07-17 — Approved by requester; execution started.
- 2026-07-17 — Updated `scripts/learningContentMdx.ts` to read the ESTree
  `UnaryExpression.argument` operand and permit only unary minus on numeric
  literals; static-value extraction uses the same operand.
- 2026-07-17 — Added regression coverage that accepts a negative numeric MDX
  prop and rejects unary plus.
- 2026-07-17 — `npm run typecheck`, production build output, and `git diff
  --check` passed. The MDX contract test (including the affected lesson)
  passed. `npm test` still reports two unrelated catalog-count assertions:
  expected 627/601 but found 628/602.

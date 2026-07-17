---
title: Tokenizer Code Readability Polish
status: done
created: 2026-07-16T00:00:00+07:00
updated: 2026-07-16T00:30:00+07:00
author: Codex
task: "redesign the Vietnamese Tokenizer phải đọc được code lesson page so its explanation is easier to scan and understand"
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Make page 2 of `tokenization-bpe-tiktoken` immediately readable by showing why
Python indentation matters, how weak tokenization loses structural signals, and
how modern tokenization preserves them.

Success means the learner can understand the comparison from the visual before
reading the supporting copy, while the existing lesson route, paging, authored
MDX boundary, responsive behavior, and light/dark themes remain unchanged.

# Lineage

Continues the authored LLM lesson architecture established by
[Learning Lab Content Architecture and LLM Course](./2026-07-14-approved-llm-lessons-mdx-migration.md).

# Context Read

- The target copy is page 1 of
  `src/content/learning/llm-ai-engineering/1.2.3-tokenization-bpe-tiktoken.vi.mdx`.
- The current page contains a heading, one introductory paragraph, two bullets,
  and one concluding paragraph, with no code or tokenizer visualization.
- Locale MDX owns lesson prose and structured visual inputs; LLM-specific visual
  renderers live under
  `src/components/learning/domains/llm-ai-engineering/`.
- The worktree already contains unrelated in-progress Learning Lab changes;
  implementation must preserve them and touch only the narrow target surface.

# Decisions

- Keep the exact teaching focus: whitespace and newlines are structural signals
  in Python code.
- Replace the prose-only presentation with one compact, code-led comparison:
  a Python snippet with visible indentation, followed by weak/modern tokenizer
  interpretations and their consequences.
- Present `Thách thức` and `Cải tiến` as two peer visual regions with short copy,
  not long nested cards or decorative framing.
- Keep the conclusion as a concise takeaway and preserve the GPT-4 point without
  expanding the conceptual scope.
- Use the existing Learning Lab theme helpers and MDX component boundary; add no
  dependency, route, catalog metadata, localization payload, or new docs page.
- Preserve responsive stacking, keyboard navigation, and light/dark themes.

# Phases

## Phase 0 — Store and approve this plan

- Store this plan as the first task write.
- Wait for explicit user approval before changing lesson or renderer files.

## Phase 1 — Implement the focused lesson visual

- Add the smallest LLM-domain renderer and MDX registration needed for the
  code-tokenizer comparison.
- Replace only the target page's prose layout with structured authored input for
  that renderer.
- Reuse the user's Vietnamese wording, tightening only where the new hierarchy
  requires shorter labels.

## Phase 2 — Verify and document

- Inspect the changed diff for accidental overlap with existing worktree edits.
- Run the narrowest relevant validation/typecheck needed for the MDX/component
  change; do not run a broad build unless required by a failure or user request.
- Update this plan's status and execution log. Update the existing Learning Lab
  wiki only if the implementation changes a durable convention.

# Out of Scope

- Other tokenization pages or quizzes.
- Page 1's BPE merge interaction.
- Course navigation, routing, catalog metadata, search behavior, or pagination.
- Rewriting the broader tokenization curriculum.
- General Learning Lab redesign.

# Execution Log

- 2026-07-16 — Read the mandatory workflow, repo orientation, Learning Lab
  architecture/history, polish-ui skill, target MDX, renderer registration, and
  current worktree state; stored this draft plan.
- 2026-07-16 — User approved the plan and explicitly requested no `npm run
  verify` and no production build. Execution started with static source/diff
  inspection only.
- 2026-07-16 — Replaced the prose-only target page with a responsive Python
  whitespace visual, weak/modern tokenizer comparison, and concise GPT-4
  takeaway. Registered the new LLM-domain MDX component without changing
  routes, catalog metadata, pagination, or shared localization.
- 2026-07-16 — Static registration/source review and targeted `git diff
  --check` passed. Per user instruction, no tests, `npm run verify`, or build
  were run. No wiki update was needed because the authored-MDX/domain-renderer
  convention did not change.

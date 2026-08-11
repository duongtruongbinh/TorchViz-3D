---
title: Token IDs, Vocabulary, and Tokenizer Walkthrough
status: done
created: 2026-07-20T00:00:00+07:00
updated: 2026-07-20T12:00:00+07:00
author: Codex
task: "visualize the Token IDs/vocabulary lesson, add its quiz and code walkthrough, and clarify lesson types in the rail"
supersedes:
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Teach token IDs and vocabularies through concise visuals, then reinforce the
concept with a separate quiz and an executable-looking tokenizer walkthrough.
Keep all authored content in locale MDX and preserve the canonical Learning Lab
TOC, catalog, route, and renderer architecture.

# Lineage

Supersedes [Learning Lab Content Architecture and LLM Course](./2026-07-14-approved-llm-lessons-mdx-migration.md),
which established the typed-TOC and locale-MDX content boundary used here.

# Final decisions

## Theory and quiz

- Split `Token IDs và vocabulary` into three visual pages: vocabulary lookup,
  token-ID misconceptions, and the high-level text/ID/model round trip.
- Present vocabulary as bidirectional token ↔ ID pairs ordered by ascending ID.
- Keep the misconception page explicit that ID magnitude and distance do not
  encode importance, frequency, position, or semantic similarity.
- Publish a separate adjacent three-question quiz covering lookup, ID meaning,
  and the high-level model flow.

## Code walkthrough

- Publish `Code: Từ raw text đến token IDs` after the quiz with four pages:
  GPT-4o in English, GPT-4o in Vietnamese, ViT5 in Vietnamese, and a tokenizer
  output comparison.
- Use `tiktoken.encoding_for_model("gpt-4o")`, which selects `o200k_base`, and
  guide learners to the official README before revealing API answers.
- Render Python comments in green and scope each Show/Hide answer control to its
  own stage.
- Include the official `num_tokens_from_string` pattern as a fill-in exercise.
- Load ViT5's valid `spiece.model` directly with SentencePiece because its
  legacy fast-tokenizer adapter can fail with newer Transformers/tokenizers.
- Explain that different training data produces different vocabularies, token
  boundaries, and IDs; neither tokenizer is universally better.

## Lesson rail

- Mark authored lessons `available` in the LLM TOC.
- Color theory blue, quiz violet, and code amber in the lesson rail using the
  number marker and title only—no vertical stripe.
- Keep selected titles bold; selected markers use a saturated type color with a
  white number. Completed markers remain green.

# Architecture and scope

- Preserve canonical lesson IDs and routes.
- Preserve typed TOC → React-free catalog → locale MDX → domain renderer flow.
- Add only domain-scoped static renderers and MDX registrations.
- Add no tokenizer runtime, syntax-highlighting dependency, or raster asset.

# Modified surfaces

- Locale lessons:
  `1.2.5-tokenization-token-ids-vocabulary.vi.mdx`,
  `1.2.6-tokenization-token-ids-vocabulary-quiz.vi.mdx`, and
  `1.2.7-tokenization-raw-text-to-token-ids.vi.mdx`.
- LLM MDX adapter and renderers.
- LLM typed TOC, catalog/MDX regression tests, and shared MDX registration.
- Lesson-rail node styling and its obsolete title-theme helper.
- Learning Lab architecture metrics and concept documentation.

# Execution log

- 2026-07-20 — User approved the initial visual split and each subsequent
  content/UI follow-up.
- 2026-07-20 — Built the three-page theory lesson, adjacent quiz, and four-page
  GPT-4o/ViT5 code walkthrough; registered their domain-scoped components and
  updated catalog contracts.
- 2026-07-20 — Added per-stage answer reveal, comment coloring, ViT5 workaround
  note, and side-by-side tokenizer comparison.
- 2026-07-20 — Added type colors to lesson markers/titles and refined selected
  marker contrast after visual review.
- 2026-07-20 — Final diff audit made all published LLM lessons available,
  isolated answer visibility per code stage, added the missing `count` stage
  type, removed the unused rail-title theme helper, and compacted this plan.

# Verification

- `npm run verify` passed: TypeScript, all 75 tests, and the 2,526-module
  production build. The existing large-chunk advisory remains informational.
- `git diff --check` passed.
- Catalog regression confirms 41 available, 1 next, and 590 locked nodes; all
  30 published locale-MDX lessons passed contract validation.

# Follow-up: official Cookbook reference page

- Add a fifth and final page to the code node containing one concise external
  reference card for OpenAI Cookbook's archived "How to count tokens with
  Tiktoken" recipe.
- Point readers to its "Comparing encodings" section, which compares
  `r50k_base`, `p50k_base`, `cl100k_base`, and `o200k_base` on English,
  arithmetic, and Japanese strings.
- Mention that the Japanese example makes the effect of encoding choice easy to
  scan.
- Update the MDX page-count contract, run focused validation and TypeScript,
  then commit the follow-up separately after approval.
- 2026-07-20 — User approved the official Cookbook reference page;
  implementation started.
- 2026-07-20 — Added the fifth-page reference note with the official Cookbook
  link, encoding comparison summary, and Japanese token counts. TypeScript, all
  9 MDX contract tests, and `git diff --check` passed.

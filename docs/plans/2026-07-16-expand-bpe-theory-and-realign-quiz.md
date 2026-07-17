---
title: Expand BPE Theory and Realign Quiz
status: done
created: 2026-07-16T02:00:00+07:00
updated: 2026-07-16T02:30:00+07:00
author: Codex
task: "expand the BPE lesson with initialization, inference, limitations, and token-free directions, then realign the quiz to that teaching sequence"
supersedes:
  - docs/plans/2026-07-16-deepen-bpe-tokenizer-quiz.md
---

# Goal

Turn the BPE lesson and quiz into one coherent learning sequence:

1. start from bytes/characters as small initial units;
2. repeatedly learn and apply useful pair merges;
3. tokenize new text using learned merge priorities;
4. understand fixed-token-boundary limitations for code, numbers, semantics, and
   arithmetic;
5. recognize byte/character-level models as a researched future direction with
   a sequence-length tradeoff.

# Lineage

Supersedes [Deepen BPE Tokenizer Quiz](./2026-07-16-deepen-bpe-tokenizer-quiz.md),
whose questions will be realigned after the user clarified the desired teaching
order and missing theory.

# Factual Guardrails

- For an introductory explanation, the initial BPE units may be described as
  characters in the current visual, while noting that modern implementations
  such as `tiktoken` operate on bytes.
- Do not state that BPE always performs greedy longest-token matching. Encoding
  applies learned merges according to their priority/rank; longer tokens often
  emerge from repeated merges but are not selected by a universal
  longest-match rule.
- A string such as `327` may become one token or several depending on the
  tokenizer vocabulary and merge rules. The limitation is that token boundaries
  are learned statistical units, not guaranteed semantic or mathematical units.
- Present byte/character processing as an active research direction, not a
  settled replacement. Mention its main cost: longer sequences and therefore
  greater efficiency pressure.

# Sources Read

- Sennrich, Haddow, and Birch (ACL 2016), the subword BPE formulation for neural
  machine translation.
- OpenAI `tiktoken` documentation and `mergeable_ranks` API description.
- ByT5 (TACL 2022), byte-to-byte token-free modeling.
- CANINE (TACL 2022), direct character-sequence encoding without an explicit
  tokenizer vocabulary.

# Decisions

- Expand the existing two lesson pages rather than adding a new route or page.
- Add compact theory around the existing merge visualization on page 1 and the
  existing code-structure visual on page 2; do not create another renderer.
- Keep the visual examples primary and use short numbered steps/callouts for the
  missing theory.
- Realign the four quiz questions to:
  1. BPE initialization;
  2. the repeated pair-merge learning mechanism;
  3. ranked merge application at inference (explicitly testing the
     longest-match misconception);
  4. limitations illustrated by Python whitespace and numeric segmentation.
- Keep the future byte/character direction in theory and feedback, not force it
  into the four-question quiz unless it fits without diluting the limitations
  question.
- Update authored MDX, metadata, references, and existing stable question-id
  expectation only. Preserve renderer, route, catalog, and page counts.

# Phases

## Phase 0 — Store and approve

- Store this plan and wait for explicit user approval.

## Phase 1 — Fill the missing theory

- Add the initialization, learning, inference-rank, limitation, numeric example,
  and future-direction explanations to the existing lesson pages.
- Add primary-source references in the lesson's authored reference metadata or
  existing reference surface if supported by the MDX contract.

## Phase 2 — Realign the quiz

- Rewrite the four questions in the requested teaching order.
- Make distractors target the actual misconceptions: starting from whole words,
  random merges, greedy longest-match, and assuming token boundaries equal human
  semantic/mathematical units.

## Phase 3 — Static review and record

- Check MDX syntax, theory-to-question coverage, correct answers, references,
  question-id parity, and targeted diff.
- Continue honoring the user's instruction not to run tests, `npm run verify`,
  or build.
- Mark this plan done. No wiki update is expected because content architecture
  remains unchanged.

# Out of Scope

- A full treatment of BPE training frequencies or production tokenizer regex
  pre-tokenization.
- Claims that byte/character models have replaced tokenizers.
- Renderer, route, catalog, or quiz UI changes.
- Changes to other lessons.

# Execution Log

- 2026-07-16 — Verified the BPE-rank nuance and token-free research direction
  against primary technical sources; stored this draft follow-up plan.
- 2026-07-16 — User approved the plan; execution started without tests, verify,
  or build as requested.
- 2026-07-16 — Expanded the two existing lesson pages with BPE initialization,
  frequency-based training, ranked inference, numeric/code boundary limitations,
  and the byte/character token-free research direction with primary-paper links.
- 2026-07-16 — Realigned the four quiz questions to initialization, the training
  loop, merge-rank inference, and tokenization limitations; updated metadata and
  the existing question-id expectation.
- 2026-07-16 — Targeted `git diff --check`, static source review,
  theory-to-question coverage, correct-answer review, and question-id parity
  passed. No tests, verify, or build were run. No wiki update was needed because
  the content architecture did not change.

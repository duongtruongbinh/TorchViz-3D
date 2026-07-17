---
title: Token IDs and Vocabulary Lesson
status: done
created: 2026-07-16T05:00:00+07:00
updated: 2026-07-16T05:40:00+07:00
author: Codex
task: "author and visually design the Token IDs và vocabulary Learning Lab lesson"
supersedes:
  - docs/plans/2026-07-16-split-token-boundaries-and-token-free-pages.md
---

# Goal

Publish the currently placeholder `tokenization-token-ids-vocabulary` node as a
three-page lesson that connects tokenizer output to the model's embedding and
output-vocabulary interfaces.

Success means the learner can explain:

- what a vocabulary and token ID are;
- why an ID is an arbitrary stable index rather than meaning, rank, or frequency;
- how encode/decode use the same mapping in opposite directions;
- why changing tokenizer vocabulary breaks compatibility with model weights;
- how token IDs address embedding rows and output-logit positions.

# Lineage

Continues the tokenization sequence after
[Split Token Boundaries and Token-Free Pages](./2026-07-16-split-token-boundaries-and-token-free-pages.md).

# Context Read

- `tokenization-token-ids-vocabulary` exists in the typed LLM TOC but has
  `missing` content and no locale MDX file.
- Authored lessons use chapter-local numeric filenames, locale MDX content, and
  LLM-domain code-native visual components registered through the MDX allowlist.
- The preceding lessons teach subword choice and BPE; the following node owns
  special tokens, so this lesson should not teach BOS/EOS/PAD semantics.
- Existing model lessons already use vocabulary-sized logits and embedding
  concepts; this lesson should provide the tokenizer-side bridge without
  repeating output-head derivations.

# Decisions

- Create `1.2.5-tokenization-token-ids-vocabulary.vi.mdx` with three pages.
- Page 1 — vocabulary lookup:
  - show a compact two-column token ↔ ID table;
  - highlight that IDs are arbitrary stable addresses;
  - contrast ID with token frequency, semantic similarity, and text position.
- Page 2 — reversible conversion:
  - visualize `text → tokens → token IDs` and the reverse decode path;
  - show that the same tokenizer/vocabulary is required for round-trip meaning;
  - include a concrete Vietnamese-friendly example and sequence shape.
- Page 3 — model contract:
  - show token ID selecting an embedding row;
  - show the output head reserving one logit position per vocabulary ID;
  - state the relevant shapes `E ∈ R^{|V|×d}` and logits in `R^{|V|}`;
  - explain why swapping or resizing vocabulary invalidates the learned row/index
    correspondence unless model weights are adapted.
- Implement the smallest LLM-domain visual surface needed, responsive and
  light/dark aware, with authored prose/data remaining in MDX.
- Mark the existing TOC node published; do not add a new route, quiz, special
  token content, or localization payload.
- Update existing content-count/page-count expectations and the current Learning
  Lab wiki status in place; do not create another long-lived docs page.

# Phases

## Phase 0 — Store and approve

- Store this plan and wait for explicit user approval.

## Phase 1 — Author and publish the lesson

- Create the three-page Vietnamese MDX source with metadata and structured visual
  inputs.
- Advance only `tokenization-token-ids-vocabulary` to published content in the
  typed TOC.

## Phase 2 — Implement lesson visuals

- Add vocabulary lookup, encode/decode, and model-contract renderers or one
  focused renderer with page-specific modes, whichever produces the smaller
  clear implementation.
- Register the MDX component through the existing LLM allowlist and adapter.

## Phase 3 — Records and static verification

- Update existing content/page-count expectations and Learning Lab wiki counts.
- Check page indexes/count, component registration, TOC/MDX identity, responsive
  and theme classes, links, and targeted diff.
- Continue honoring the user's standing instruction not to run tests,
  `npm run verify`, or build.
- Mark this plan done with the actual modifications recorded.

# Out of Scope

- A quiz node or quiz questions.
- Special tokens, padding/masking, context-window batching, or dataloader code.
- Changes to existing BPE/token-boundary lessons.
- Model output-head math beyond the vocabulary-index contract.

# Execution Log

- 2026-07-16 — Located the placeholder TOC node, reviewed the authored MDX and
  test/count contracts, and stored this three-page lesson plan.
- 2026-07-16 — User approved the plan; execution started without tests, verify,
  or build as requested.
- 2026-07-16 — Published `tokenization-token-ids-vocabulary` as the available
  `1.2.5` lesson with three authored pages covering vocabulary lookup,
  encode/decode round-tripping, and the tokenizer–embedding–output contract.
- 2026-07-16 — Added three responsive light/dark LLM-domain visuals and
  registered them through the existing MDX allowlist and adapter. Updated page
  counts, authored-file/catalog counts, availability counts, and the existing
  Learning Lab wiki status/list.
- 2026-07-16 — A read-only catalog diagnostic could not start because the repo
  does not install `tsx`; it made no changes. Targeted `git diff --check`, static
  TOC/MDX identity review, page-index/count parity, three-layer component
  registration, authored-file count (26), and theme/responsive class review
  passed. No tests, verify, or build were run.

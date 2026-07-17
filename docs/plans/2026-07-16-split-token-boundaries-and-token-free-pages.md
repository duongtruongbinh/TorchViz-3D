---
title: Split Token Boundaries and Token-Free Pages
status: done
created: 2026-07-16T03:00:00+07:00
updated: 2026-07-16T03:30:00+07:00
author: Codex
task: "move token-boundary limitations and token-free trends into two separate redesigned lesson pages"
supersedes:
  - docs/plans/2026-07-16-expand-bpe-theory-and-realign-quiz.md
---

# Goal

Give the two newly added concepts enough visual and conceptual space by turning
them into dedicated pages:

- Page 3: why learned token boundaries differ from human semantic,
  mathematical, and code boundaries.
- Page 4: how byte/character-level approaches reduce dependence on a fixed
  subword vocabulary and what efficiency cost they introduce.

The learner should understand each page from its primary visual before reading
the supporting explanation.

# Lineage

Continues [Expand BPE Theory and Realign Quiz](./2026-07-16-expand-bpe-theory-and-realign-quiz.md),
which introduced the two concepts as prose beneath the existing code page.

# Context Read

- `tokenization-bpe-tiktoken` currently has two `MdxPage` sections.
- The boundary and future-direction sections are appended beneath the code
  visual on page 2, making that page carry three separate teaching goals.
- The Learning Lab already supports arbitrary authored page counts through
  `lessonMetadata.pageCount` and indexed `MdxPage` blocks.
- LLM-specific code-native visuals belong in the domain renderer and are exposed
  through the existing MDX component allowlist.

# Decisions

- Increase the lesson from two pages to four without changing its route or quiz.
- Preserve pages 1 and 2: BPE learning/inference and tokenizer-for-code.
- Move all boundary prose to a dedicated page with one comparison visual:
  - human view: `327` is one number and indentation has syntactic meaning;
  - tokenizer view: multiple valid segmentations driven by vocabulary/ranks;
  - takeaway: token boundaries are statistical units, not guaranteed concepts.
- Move the future-direction prose to a dedicated page with one compact
  side-by-side comparison:
  - subword: shorter sequence, fixed learned vocabulary;
  - byte/character: no fixed subword boundary, longer sequence;
  - shared conclusion: the architecture must trade preprocessing assumptions
    against sequence efficiency.
- Keep ByT5 and CANINE links on the future-direction page.
- Add the smallest reusable LLM-domain MDX visual component(s) needed. Use the
  existing Learning Lab theme and avoid decorative cards inside cards.
- Update only authored lesson metadata/MDX, the LLM MDX allowlist/adapter, and
  the domain renderer. The already aligned quiz remains unchanged.

# Phases

## Phase 0 — Store and approve

- Store this plan and wait for explicit user approval.

## Phase 1 — Split authored pages

- Remove both appended sections from the code page.
- Add indexed pages 2 and 3 with structured content for the two new visuals.
- Update `pageCount`, headings, and keywords without changing lesson identity.

## Phase 2 — Implement focused visuals

- Implement the token-boundary comparison with numeric and Python examples.
- Implement the subword-versus-byte/character comparison with an explicit
  sequence-length tradeoff.
- Register the components through the existing LLM MDX boundary.

## Phase 3 — Static review and record

- Check page indexes/count, MDX component registration, responsive/light/dark
  classes, source diff, and whitespace.
- Continue honoring the user's instruction not to run tests, `npm run verify`,
  or build.
- Mark the plan done. No wiki update is expected because the architecture and
  durable conventions remain unchanged.

# Out of Scope

- Changes to the BPE quiz.
- Rewriting the merge animation or code-structure visual.
- Route, catalog, navigation renderer, or shared lesson-shell changes.
- Claims that token-free models have replaced subword tokenizers.

# Execution Log

- 2026-07-16 — Inspected the current four-concept/two-page lesson structure and
  stored this focused page-split and visual-redesign plan.
- 2026-07-16 — User approved the plan; execution started without tests, verify,
  or build as requested.
- 2026-07-16 — Increased the lesson from two to four authored pages, leaving the
  BPE and code pages focused and moving boundary limitations and token-free
  directions into dedicated pages.
- 2026-07-16 — Added two responsive LLM-domain visuals: a human-versus-tokenizer
  comparison for `327` and Python whitespace, and a subword-versus-direct-unit
  comparison with explicit benefits and costs. Registered both through the
  existing MDX allowlist/adapter and updated the page-count expectation.
- 2026-07-16 — Targeted `git diff --check`, static component-registration review,
  page-index/count parity, responsive/light/dark class review, and authored
  content inspection passed. No tests, verify, or build were run. No wiki update
  was needed because architecture and durable conventions were unchanged.

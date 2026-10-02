---
title: Quantifying Memorization paper curriculum
status: done
created: 2026-10-02T02:00:00+07:00
updated: 2026-10-02T17:10:00+07:00
author: nmkhiem
task: "Publish an interactive Quantifying Memorization paper track and audit its quizzes and shared rendering code"
supersedes: []
---

# Goal

Publish an eleven-node Vietnamese reading track for Carlini et al.,
*Quantifying Memorization Across Neural Language Models* (ICLR 2023), in the
`research-papers` domain. The typed [table of contents](../../src/content/learning/research-papers/table-of-contents.ts)
owns the node order and titles; the eleven MDX files under
`src/content/learning/research-papers/llm/memorization/quantifying-memorization/`
own the lessons and two quizzes.

# Lineage

Genesis plan — no predecessor.

# Decisions

- Reuse the typed TOC, locale MDX, catalog, and shared quiz runtime. Register
  `PaperExcerpt` in the research-papers domain adapter for paper excerpts;
  extend `ConceptHierarchy` with the light-mode `rose` tone.
- Keep answer positions varied but static. The two quizzes contain fourteen
  single-choice questions and one order question; every single-choice question
  has at least one distractor longer than the correct answer.
- Match claims to the paper's measured conditions. Figure 1(b) samples strings
  repeated 2–900 times, Figure 1(c) compares 50 and 450 context tokens, and
  Section 4.5 discusses selected qualitative examples.

# Phases

1. Register the track and author the nine reading nodes plus two quizzes.
2. Add the domain excerpt renderer and validate the MDX contract and catalog.
3. Audit quiz answer leakage, paper logic, unused code, and documentation.

# Execution log

- Published eleven nodes in one track, added `PaperExcerpt`, and registered the
  `rose` hierarchy tone. Updated the catalog count assertions and generated
  [catalog statistics](../../wiki/reference/catalog-stats.md).
- Distributed correct answers across A–D and changed the order question's
  initial display so it no longer reveals `correctOrder`. Shortened six correct
  choices that were longest or tied for longest. Answer positions remain fixed
  per visit; the quiz runtime does not shuffle them.
- Corrected the Figure 1(b) and 1(c) quiz claims and limited the Section 4.5
  conclusion to the paper's chosen examples.
- Removed unused `optionDisabled` and `dropLine` quiz styles and unused
  `PaperExcerpt` props and render branches (`abstractHeading`,
  `sectionHeadingAlign`, `children`).
- `npm run verify` passed: TypeScript, 175 tests, and production build. A
  parser audit checked all fourteen single-choice answer lengths.

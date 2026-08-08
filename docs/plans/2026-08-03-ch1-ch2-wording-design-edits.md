---
title: Chapter 1 & Chapter 2 Wording and Design Edits
status: done
created: 2026-08-03
updated: 2026-08-03
author: antigravity
task: "Refine wording, focus, visuals, color, layout, animation, code, takeaways, and quizzes across runtime Statistics Chapters 1–2."
supersedes:
  - 2026-08-03-statistics-review-recommended-improvements.md
---

# Goal

Finish the approved page-level wording and design pass for the runtime
`probability` and `statistical-thinking` tracks while preserving canonical
routes, typed TOC ownership, locale MDX, and the incumbent visual system.

Continues [Statistics Ch.1–3 Content Review Recommended Improvements](./2026-08-03-statistics-review-recommended-improvements.md).

# Scope and invariants

- Preserve domain, track, lesson, locale, route, and alias IDs.
- Keep prose in Vietnamese MDX and interaction/visual logic in the Statistics
  renderer; do not add parallel payloads or dependencies.
- Give every theory node a standalone final `Kiến thức cần nắm` page.
- Keep one dominant focus and at most two teaching claims per page.
- Use neutral/white surfaces and instructional blue. Reserve green for
  correct/complete, amber for warning, and red for error; always pair color with
  text, icon, or shape.
- Use bold for key terms, KaTeX for math, semantic tables for tabular data, and
  short code observations. Standardize Bayes terminology as
  `Evidence / marginal likelihood`.
- Limit work to Chapters 1–2, their renderer branches, exact tests, and the
  smallest shared Learning Lab accessibility fixes required by those pages.

# Approved decisions

## Chapter 1

- Preserve the 1.1–1.3 die-based progression; shorten takeaways and consolidate
  the disjoint-versus-complement visual.
- Make 1.4 the sole owner of the convergence simulation.
- Separate conditioning-direction and independence misconceptions in 1.5;
  clarify the total-probability-to-Bayes bridge in 1.6.
- Reduce 1.7 to history, two interpretations of probability, long-run behavior,
  one-off events, and takeaways; remove duplicate visuals/animation.
- In 1.8, separate exercise attempt from solution, condense formula walls, keep
  one applications visual, and add explicit code observations.
- Retitle 1.9 as `Bài tập Naive Bayes`, use semantic tables, and correct score
  feedback. Keep the ten-question capstone but replace terminology recall with
  applied Bayes interpretation.

## Chapter 2

- Keep 2.1 as four focused pages: definition, question framing,
  descriptive-versus-inferential comparison, and takeaways.
- Split 2.2 into five pages: population/sample, representativeness, study
  design, supported conclusion, and takeaways. Correct the invalid sampling
  fixture.
- Split 2.3 into five pages: assumptions, selective presentation, truncated
  axis, responsible-reading checklist, and takeaways.
- Place the six-question chapter Quiz after 2.3 and test application of the
  taught concepts instead of pandas/Iris recall.

# Implemented

- Chapter 1 now has 59 theory and 42 quiz pages. Chapter 2 has 20 pages; the
  Statistics domain total is 549 ordered pages.
- Corrected formula escaping, Evidence terminology, Bayes staging, causal
  wording, the 1.9 comparison feedback, and the Chapter 2 sampling fixture.
- Rebuilt overloaded Chapter 2 pages and added focused population/sample and
  study-design renderers.
- Converted the main Play Tennis and email data grids to semantic responsive
  tables with captions and scoped headers.
- The frequency simulation starts paused and supports Start, Pause, Replay,
  reduced motion, and polite status updates.
- Added 44px controls, pressed/invalid/status semantics, a visible focus ring,
  protected interactions from global arrow navigation, removed the closed rail
  from tab order, made the pager safe at 320px, and increased completion-CTA
  contrast.
- Removed unused historical/experiment image imports from the runtime bundle.
  A locally generated one-line probability-history doodle remains optional,
  not required filler.
- Updated TOC titles/order, MDX allowlists, exact tests, and the existing
  Learning Lab wiki. Earlier approved takeaway, Python-cheatsheet, and Chapter
  2 exercise edits remain intact.

# Approval and evidence

- 2026-08-03 — Read-only inventory and two independent Impeccable assessments
  completed; requester approved implementation with `ok`.
- Impeccable detector: 0 findings for the Statistics renderer and authored
  Statistics directory. Browser automation was unavailable, so no screenshot
  or overlay result is claimed.
- Critique snapshot:
  `.impeccable/critique/2026-08-02T23-16-30Z__c-content-learning-statistics-table-of-contents-ts.md`.
- `npm run verify`: passed after the final code change (TypeScript, 77 tests,
  production build).
- `git diff --check`: passed.

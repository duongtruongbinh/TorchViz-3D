---
title: Clarify BWT and Forgetting Conventions
status: done
created: 2026-08-13T21:24:53+07:00
updated: 2026-08-14T14:11:38+07:00
author: Codex
task: "Clarify the survey and common BWT/Forgetting conventions, with BWT on its own lesson page"
supersedes:
  - docs/plans/2026-08-08-continual-learning-llm-domain.md
  - docs/plans/2026-08-13-continual-learning-citations.md
---

# Goal

Make the Continual Learning metrics lesson distinguish two reference baselines
that are currently collapsed into the statement `BWT = -F`:

- the survey's peak-to-current forgetting convention, whose negation it calls
  BWT; and
- the widely used GEM convention, whose BWT compares current performance with
  the diagonal score recorded immediately after each task was learned.

Success means a learner can compute both values from one performance matrix,
explain why they can differ, and state the condition under which they are equal.

# Lineage

Continues the authored course structure from
[2026-08-08-continual-learning-llm-domain](./2026-08-08-continual-learning-llm-domain.md)
and the claim/evidence contract from
[2026-08-13-continual-learning-citations](./2026-08-13-continual-learning-citations.md).

# Context read

- `5.1.1-core-cl-metrics.vi.mdx` currently combines F and BWT on page 3 of a
  four-page lesson and states without qualification that the survey computes
  `BWT = -F`.
- The survey defines forgetting from the best prior score to the current score
  in Appendix B.1, then describes BWT as its negation in §2.2.3 and Appendix
  B.1.
- Lopez-Paz and Ranzato's GEM defines BWT from the task-learning diagonal
  `P_{j,j}` to the final/current score `P_{t,j}`.
- Chaudhry et al.'s common forgetting metric uses the historical best prior
  score, matching the survey's forgetting baseline.
- Therefore `BWT_GEM = -F_peak` only when each old task's best prior score is
  its diagonal score. Positive intermediate backward transfer can make the two
  values differ.
- The domain invariant requires adjacent Theory/Quiz nodes with identical
  concept IDs. A new authored page does not require a new TOC node or route.
- The worktree already contains the approved removal of one supplier–consumer
  survey citation and its metadata synchronization. This task preserves those
  changes and does not fold them into the metrics content conceptually.

# Decisions

- Keep the existing `core-cl-metrics` theory/quiz pair, IDs, route, TOC order,
  and five concept IDs.
- Expand the theory lesson from four to five authored pages:
  overview, OP, Forgetting, BWT conventions, and FWT.
- Give BWT a dedicated page inside the existing theory lesson; do not create a
  standalone BWT lesson/quiz pair.
- Use explicit names in prose and formulas:
  `F_peak` for best-prior-to-current forgetting, `BWT_survey = -F_peak` for the
  survey shorthand, and `BWT_GEM` for diagonal-to-current backward transfer.
- Retain the existing three-task example but adjust its intermediate scores so
  it demonstrates a real divergence between the two conventions. Explain the
  equality condition rather than implying one convention is universally
  correct.
- Keep the sign semantics visible: larger BWT is better; positive forgetting
  means degradation; negative peak-based forgetting is possible when the
  current checkpoint exceeds every prior score.
- Update the existing BWT quiz question to test baseline selection and the
  equality condition. Preserve the other concepts and the quiz's five-question
  structure.
- Cite the survey for its convention, GEM for diagonal-based BWT, and Chaudhry
  et al. for peak-based forgetting. Add occurrence-level evidence for each new
  citation and keep existing evidence IDs stable.
- Register GEM in the handwritten academic-source layer because the generated
  main-section snapshot does not currently materialize the survey appendix
  reference. Do not hand-edit `papers.generated.ts`.
- Update the existing Learning Lab wiki counts/convention text after computing
  the final registry totals; do not create a new documentation page.

# Phases

1. Restructure `core-cl-metrics` into five pages and author the focused BWT
   comparison with formulas, one worked matrix example, and a compact baseline
   comparison.
2. Revise the paired quiz question without changing concept identity or quiz
   count.
3. Extend `papers.ts` and `citationEvidence.ts` with GEM, peak-forgetting, and
   survey-convention evidence while preserving occurrence IDs already authored.
4. Update focused tests only if a durable invariant is not already covered;
   otherwise rely on the existing metadata, concept-pair, paper-coverage, and
   citation-occurrence checks.
5. Run the focused MDX/paper test, citation evidence audit, `npm run verify`,
   and `git diff --check`.
6. Record the actual changes and verification result here, then update the
   existing Learning Lab wiki figures and source-layer description.

# Acceptance criteria

- BWT has its own authored page within `core-cl-metrics`.
- The lesson gives both formulas with unambiguous baselines.
- A worked example produces different `BWT_survey` and `BWT_GEM` values and
  explains why.
- The lesson states the exact equality condition and does not present
  `BWT = -F` as convention-independent.
- The paired quiz assesses the distinction using the existing
  `backward-transfer` concept ID.
- Every new inline citation has reviewed occurrence evidence and resolves to a
  paper in the lesson's claim coverage.
- No TOC node, route, lesson order, published status, or unrelated course
  content changes.
- Existing supplier–consumer edits remain intact.
- All required verification passes.

# Out of scope

- Creating a standalone BWT route or adding another Theory/Quiz pair.
- Redefining OP, FWT, knowledge metrics, benchmarks, or other lesson content
  beyond transitions needed by the new page order.
- Regenerating the complete survey bibliography or changing generated paper
  records.
- UI component or visual-system changes.

# Execution log

- 2026-08-13 — Read the mandatory workflow, architecture orientation, Learning
  Lab history/wiki, current metrics theory and quiz, TOC pairing contract,
  paper/evidence registries, the pinned survey §2.2.3 and Appendix B.1, GEM's
  original BWT definition, and Chaudhry et al.'s peak-forgetting definition;
  stored this draft plan for approval.
- 2026-08-13 — User approved the stored plan; moved it to the approved
  checkpoint.
- 2026-08-13 — Began execution after the approved checkpoint.
- 2026-08-13 — Expanded `core-cl-metrics` from four to five authored pages,
  separated peak-based Forgetting from a dedicated BWT page, and used one
  performance-matrix example to derive `BWT_survey = -20` and `BWT_GEM = -15`.
  The lesson now states the exact equality condition and the ordering between
  the two conventions.
- 2026-08-13 — Reworked the existing `backward-transfer` quiz question to test
  both baselines without changing the five concept IDs or five-question quiz
  contract.
- 2026-08-13 — Added the original GEM paper to the handwritten source layer,
  exposed GEM and Chaudhry et al. beside the metrics claim, and added two
  reviewed evidence occurrences while preserving the survey occurrence ID.
  Updated the existing Learning Lab wiki with the metric convention and current
  registry totals: 229 papers, 193 reachable papers, 177 reviewed evidence
  records, and two explicit exceptions.
- 2026-08-13 — Focused MDX, theory/quiz pairing, paper-coverage, and filename
  tests passed. `npm run audit:cl-citation-evidence` verified all 177 evidence
  targets with the two documented link-only exceptions; the two existing
  ScienceDirect targets remain explicitly manual-required. `npm run verify`
  passed TypeScript, all 90 Node tests, MDX validation, and the 2,808-module
  production build. `git diff --check` passed; the existing large-chunk build
  advisory is unchanged.
- 2026-08-14 — Follow-up lesson polish replaced the dense F/BWT table with
  checkpoint-by-checkpoint metric bars, kept task colors stable across stages,
  added baseline-plus-gain bars for FWT, and clarified the warning about peak
  versus diagonal BWT with a pointer to the adjacent quiz. The shared
  `MetricBars` primitive gained only the layout and visual props exercised by
  these authored examples; a usage audit found no dead branches or props.
- 2026-08-14 — Re-ran `npm run verify`: TypeScript, all 90 Node tests, MDX
  validation, and the 2,808-module production build passed. Re-ran
  `npm run audit:cl-citation-evidence`: 177 reviewed evidence targets passed
  with the same two explicit link-only exceptions; `git diff --check` passed.

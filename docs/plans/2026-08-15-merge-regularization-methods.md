---
title: Merge Regularization-Based Continual Learning Methods
status: done
created: 2026-08-15T16:10:09+07:00
updated: 2026-08-15T17:05:00+07:00
author: pi
task: "Combine the parameter-regularization and distillation lesson nodes into one Vietnamese Regularization-Based Methods node based on survey arXiv:2302.00487."
supersedes: []
---

# Goal

Replace the separate Vietnamese lesson nodes `parameter-regularization-ewc` and
`distillation-for-retention` with one coherent lesson explaining the survey's
**regularization-based approach** and its two sub-directions:

1. **Weight regularization**: penalize changes to important parameters, with
   EWC and SI as representative methods.
2. **Function regularization**: use a frozen earlier model as teacher and
   distillation targets to preserve outputs or representations, with LwF as the
   representative method.

The merged lesson should make the parameter-space versus function-space
contrast explicit, retain the stability–plasticity objective, and accurately
state the survey's constraints: regularization avoids replaying old raw data
but generally requires a frozen old-model checkpoint; function regularization
also depends on the query inputs and can suffer from distribution shift.

# Lineage

Genesis plan — no predecessor.

# Decisions (locked)

- Preserve the canonical lesson id `parameter-regularization-ewc` so existing
  links and route selectors do not move unnecessarily; update its display title
  to `Regularization-Based Methods` / `Regularization-Based Methods`.
- Remove the separate `distillation-for-retention` lesson pair from the methods
  track rather than leaving an orphaned distillation quiz or a second node for
  the same survey category.
- Merge the two quiz payloads into the surviving regularization quiz, keeping a
  concise set of questions that covers the objective, importance weighting,
  EWC/SI, teacher–student distillation, LwF's query inputs, and the limitations
  of matching behavior on a limited query set.
- Ground the taxonomy and method claims in §4.1 of Wang et al. (arXiv:
  `2302.00487`), while retaining the existing primary references for EWC, SI,
  knowledge distillation, FitNets, LwF, and DER/DER++. Do not claim that
  regularization has zero storage cost: the survey explicitly describes a
  frozen old model as the usual reference.
- Keep the lesson in Vietnamese and preserve the existing MDX component
  conventions. Keep all four existing distillation images from the removed
  lesson, with their current assets and accessible alt text:
  `01-knowledge-distillation-teacher-student-overview.png`,
  `02-knowledge-distillation-teacher-student-checkpoint.png`,
  `03-knowledge-distillation-teacher-student-loss-flow.png`, and
  `04-knowledge-distillation-signal-types.png`. Reuse them in the merged
  lesson rather than adding replacement artwork; do not add unrelated
  architecture or replay content.

# Phases

## Phase 0 — Store this plan

- Store this draft under `docs/plans/`.
- Wait for explicit approval before modifying lesson, catalog, quiz, citation,
  or test files.

## Phase 1 — Prepare the feature branch and inspect affected contracts

- Work on the already-created non-main branch `feat/merge-regularization-methods`.
- After approval, recheck the lesson-pair catalog, content file discovery,
  citation coverage, and the methods-track catalog test before editing.

## Phase 2 — Rewrite the surviving lesson

Update `src/content/learning/continual-learning-llm/2.1.5-parameter-regularization-ewc.vi.mdx`:

- Rename metadata and headings to the combined regularization-based taxonomy.
- Structure the authored lesson as six short pages:
  1. **Regularization-based methods** — define the shared objective
     `L_total = L_new + lambda L_retention`, position regularization alongside
     replay and architecture-based methods, and introduce the two survey
     sub-directions. Use the existing overview image
     `01-knowledge-distillation-teacher-student-overview.png` only after the
     taxonomy introduction, as the bridge from the general idea of retention
     to function regularization.
  2. **Weight regularization** — explain parameter-space anchoring, importance
     scores, and the diagonal quadratic penalty; use a small EWC-style formula
     and explicitly distinguish a frozen old checkpoint from adding new model
     parameters.
  3. **EWC and SI** — explain Fisher-based importance in EWC and trajectory/
     contribution-based importance in SI, then show the stability–plasticity
     trade-off. Avoid implying that the diagonal Fisher is exact or that the
     methods are guaranteed for LLMs.
  4. **Function regularization** — introduce frozen teacher and trainable
     student from the old checkpoint, using
     `02-knowledge-distillation-teacher-student-checkpoint.png` and
     `03-knowledge-distillation-teacher-student-loss-flow.png`; contrast
     preserving outputs with preserving weights.
  5. **Distillation targets** — retain the existing comparison of logits,
     softened probabilities/temperature, and intermediate representations,
     with `04-knowledge-distillation-signal-types.png`; explain that the
     matching signal is selected by the loss, not by changing the model
     architecture.
  6. **LwF, benefits, and limits** — present LwF as the survey's pioneering
     function-regularization example, explain its use of new-task inputs to
     query the teacher, and close with a comparison table plus limitations:
     checkpoint storage, query/distribution shift, teacher bias, changing
     output spaces, class-incremental difficulty, and accumulated
     stability–plasticity pressure.
- Present weight and function regularization as sibling sub-categories of one
  regularization-based family, not as unrelated methods. Keep DER/DER++ as a
  brief boundary note pointing to replay, since the survey places them under
  replay-assisted/function-regularization combinations rather than pure LwF.
- Retain or adapt citations and the four existing visual assets so every
  non-obvious method claim remains sourced and no image reference is lost.

Delete the now-redundant
`src/content/learning/continual-learning-llm/2.1.9-distillation-for-retention.vi.mdx`.

## Phase 3 — Consolidate the quiz and catalog

- Expand `2.1.6-parameter-regularization-ewc-quiz.vi.mdx` metadata and questions
  for the combined lesson.
- Delete `2.1.10-distillation-for-retention-quiz.vi.mdx` after its useful
  coverage has been merged.
- Update `src/content/learning/continual-learning-llm/table-of-contents.ts` to
  use the new display title and remove the `distillation-for-retention` pair;
  keep the surviving canonical id and its position in the methods track.
- Update `src/lib/learningCatalog.test.ts` to assert the new five-pair methods
  sequence and prevent a stale distillation node from reappearing.

## Phase 4 — Reconcile references and evidence

- Update `src/content/learning/continual-learning-llm/papers.ts` so the
  surviving lesson owns both the parameter-regularization and
  distillation/function-regularization claims, with the survey included as
  the taxonomy source.
- Update `src/content/learning/continual-learning-llm/citationEvidence.ts` so
  review mappings and evidence ids reference only the surviving lesson id;
  preserve the existing distillation source evidence and remove or fold the
  obsolete standalone review entry.
- Check for any remaining references to the deleted lesson ids or routes with
  `rg` and update only references made stale by this merge.

## Phase 5 — Verify and record

- Run the narrow content/catalog checks first, then `npm run verify` because
  lesson discovery, TypeScript catalog data, tests, and production build may
  all be affected.
- Inspect the generated lesson route/catalog behavior and verify that the
  surviving lesson and quiz render with all MDX components, citations, and
  images.
- Update this plan's status and execution log with the actual changed files,
  commands, and any residual limitations. Update an existing relevant
  documentation surface only if verification identifies a stale reference;
  do not create a separate documentation page for this content merge.

# Out of scope

- No changes to the English lesson set or unrelated continual-learning nodes.
- No changes to the architecture-expansion, replay, or general taxonomy
  lesson content beyond catalog ordering/references required by the merge.
- No new model implementation, benchmark, or interactive code lab.
- No claim that EWC, SI, or LwF solves catastrophic forgetting universally or
  automatically scales to LLMs; the lesson will retain the survey's caveats.

# Execution log

- 2026-08-15 — Draft plan created after inspecting the two lesson nodes, their
  paired quizzes, lesson catalog, citation coverage, and §4.1 of arXiv:2302.00487.
- 2026-08-15 — Refined the content outline to six pages and committed to
  retaining all four existing distillation images without adding replacement
  artwork. Branch `feat/merge-regularization-methods` was created.
- 2026-08-15 — Plan explicitly approved by the requester; execution started.
- 2026-08-15 — Merged the two Vietnamese theory nodes into six pages under
  `parameter-regularization-ewc`, retained all four distillation images, and
  consolidated the quiz into eight questions.
- 2026-08-15 — Removed the standalone distillation theory/quiz pair, updated
  TOC/catalog counts, merged paper coverage and citation reviews, and refreshed
  the branch-history documentation.
- 2026-08-15 — `npm run verify` passed: typecheck, 90 tests, and production
  build. Vite emitted only the existing large-chunk warning.

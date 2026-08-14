---
title: Add Distillation for Retention Theory and Quiz
status: done
created: 2026-08-14T14:18:02+07:00
updated: 2026-08-14T20:55:20+07:00
author: Codex
task: "Add the final Chapter 2 Theory/Quiz pair on distillation-based retention, LwF, DER/DER++, limitations, and primary sources"
supersedes:
  - docs/plans/2026-08-08-continual-learning-llm-domain.md
  - docs/plans/2026-08-13-core-cl-metrics-bwt-conventions.md
---

# Goal

Add one adjacent, published Theory/Quiz pair at the end of Chapter 2 that teaches
distillation as a continual-learning retention mechanism. A learner should be
able to explain the old-checkpoint teacher/new-model student setup, identify
what signal is matched, write the combined task-plus-retention objective,
distinguish LwF from DER/DER++, and state what distillation does not guarantee.

# Lineage

Continues the course and source contracts from
[2026-08-08-continual-learning-llm-domain](./2026-08-08-continual-learning-llm-domain.md)
and the latest Chapter 2/metrics source-maintenance conventions from
[2026-08-13-core-cl-metrics-bwt-conventions](./2026-08-13-core-cl-metrics-bwt-conventions.md).

# Context read

- Chapter 2 currently ends with `architecture-expansion-isolation` at files
  `2.1.7` and `2.1.8`; Chapter 3 starts independently at `3.1.1`. The new pair
  can therefore use `2.1.9` and `2.1.10` without renumbering existing files.
- Continual Learning lessons are declared as atomic Theory/Quiz pairs in the
  typed TOC. Both nodes must be published together and expose identical
  `conceptIds`; quiz question IDs must match that set exactly.
- The Chapter 2 title and description currently claim only three intervention
  families, so both need to acknowledge distillation after the new pair lands.
- `li2017learning` (LwF) and `buzzega2020dark` (DER/DER++) already exist in the
  generated survey bibliography. Hinton et al.'s foundational distillation
  paper and Romero et al.'s FitNets paper are not in the generated snapshot and
  require reviewed handwritten source records.
- LwF explicitly uses only new-task inputs to query the old model and preserve
  its old-task responses; the paper also notes that new-task images may poorly
  sample the old domain. This supports teaching input dependence and the
  boundary between observed response retention and full knowledge retention.
- DER stores replay samples with logits captured along the optimization
  trajectory. DER++ adds replay supervision from stored labels alongside logit
  matching, so it is not equivalent to data-free LwF.
- Hinton et al. distinguishes softened class probabilities from raw-logit
  matching; FitNets supplies the primary example of matching intermediate
  representations rather than only outputs.

# Decisions

- Add the theory lesson ID `distillation-for-retention` and the adjacent quiz
  ID `distillation-for-retention-quiz` as the final pair in
  `cl-llm-methods`.
- Use files `2.1.9-distillation-for-retention.vi.mdx` and
  `2.1.10-distillation-for-retention-quiz.vi.mdx`; do not renumber Chapter 3 or
  any later authored file.
- Use the broader Chapter 2 title “Main Approaches” / “Các hướng tiếp cận
  chính” and revise its localized description from three to four intervention
  families.
- Build the Theory as six short, self-contained pages:
  1. old checkpoint as frozen teacher, updated model as student;
  2. matching logits, softened probabilities, or intermediate representations;
  3. `task loss + λ · retention/distillation loss`;
  4. LwF and its dependence on the inputs used to query the teacher;
  5. DER and DER++ as replay plus stored historical outputs/labels;
  6. output-space changes, teacher bias, and the limit that matching observed
     behavior does not prove preservation of all latent knowledge.
- Use six stable concept IDs and six single-answer quiz questions:
  `teacher-student-checkpoint`, `distillation-signals`,
  `task-retention-objective`, `lwf-query-inputs`, `der-der-plus`, and
  `distillation-limitations`.
- Use existing shared MDX primitives only. Prefer a compact process diagram,
  comparison matrix, formulas, and warning callout; do not add a bespoke React
  renderer unless implementation proves an existing primitive insufficient.
- Keep claims architecture-agnostic where possible. Clearly label LwF, DER,
  DER++, Hinton KD, and FitNets as methods demonstrated in their original
  settings rather than claiming their reported results automatically transfer
  to modern generative LLMs.
- Register Hinton et al. (`1503.02531`) and Romero et al. (`1412.6550`) in the
  handwritten `additionalPapers` layer. Reuse generated LwF and DER records;
  do not hand-edit `papers.generated.ts`.
- Add occurrence-level reviewed evidence for every inline citation, using
  stable arXiv HTML anchors/search fragments. Add one coverage row for the new
  theory lesson and no coverage row for its Quiz.
- Update the existing Learning Lab wiki with derived catalog, authored-content,
  pair, theory-node, paper-registry, coverage, and citation-evidence counts.
  Compute final counts from the implementation rather than estimating them.

# Phases

1. Add the typed TOC pair and update Chapter 2 title/description.
2. Author the six-page Theory lesson with formulas, comparisons, limitations,
   and adjacent primary citations.
3. Author the six-question Quiz with exact concept-ID parity and defensible
   distractors based only on taught distinctions.
4. Add/reuse paper metadata, lesson claim coverage, and occurrence evidence for
   Hinton KD, FitNets, LwF, and DER/DER++.
5. Update the existing Learning Lab wiki and this execution log with actual
   counts and modifications.
6. Run focused MDX/pair/paper tests, the citation evidence audit,
   `npm run verify`, and `git diff --check`.

# Acceptance criteria

- The new pair is the last pair in Chapter 2 and immediately precedes Chapter 3
  in canonical navigation.
- Theory and Quiz publish atomically and have exactly matching concept/question
  IDs.
- The lesson explicitly distinguishes logits, softened probabilities, and
  intermediate representations.
- The combined objective visibly separates new-task learning from retention.
- LwF is taught as avoiding storage of the full old dataset while still needing
  inputs on which the teacher can be queried.
- DER is taught as replay exemplars plus stored logits; DER++ additionally uses
  replay labels/task supervision.
- The lesson addresses changing output spaces and teacher bias without implying
  distillation targets are unbiased ground truth.
- The lesson states that distillation constrains behavior on queried examples
  or matched representations and does not guarantee retention of all knowledge.
- Every inline citation resolves to reviewed occurrence evidence and every new
  paper is represented in the appropriate source layer.
- Existing lesson IDs, routes, files, and behavior remain unchanged outside the
  required Chapter 2 metadata and documentation counts.

# Out of scope

- A runnable distillation lab or model-training implementation.
- New bitmap assets or a bespoke visualization component.
- Renumbering Chapter 3–7 files.
- Rewriting the existing replay, regularization, or architecture lessons.
- Claiming LwF or DER/DER++ is an LLM-specific method or a universal best
  practice.

# Execution log

- 2026-08-14 — Read the mandatory workflow, architecture briefing, Learning Lab
  migration plans/wiki, Chapter 2 TOC and neighboring Theory/Quiz pairs, paper
  registry/coverage/evidence contracts, and the primary arXiv HTML sources for
  LwF, DER/DER++, Hinton KD, and FitNets. Stored this draft plan for approval.
- 2026-08-14 — User approved the stored plan; began execution.
- 2026-08-14 — Added the final Chapter 2 pair at `2.1.9`/`2.1.10` with six
  Theory pages and six matching Quiz concepts. The lesson covers checkpoint
  teacher/student roles, logits versus softened probabilities versus hidden
  representations, the combined task/retention objective, LwF query-input
  dependence, DER/DER++, output-space changes, teacher bias, and the boundary
  between observed behavior retention and complete knowledge retention.
- 2026-08-14 — Reused the generated LwF and DER records; registered Hinton KD
  and FitNets in the handwritten source layer. Added one lesson coverage row
  and six verified citation occurrences backed by versioned arXiv HTML anchors.
  The registry now contains 231 papers, 196 reachable papers, 183 reviewed
  evidence records, and two explicit link-only exceptions.
- 2026-08-14 — Updated the Chapter 2 TOC metadata, catalog/MDX invariant tests,
  the Chapter 2 section of the course synthesis, and the existing Learning Lab
  wiki. The final catalog has 681 lesson nodes, 145 authored nodes, 39
  Continual Learning Theory/Quiz pairs, and 40 non-Quiz Continual Learning
  lessons. No new renderer or visual asset was required.
- 2026-08-14 — Focused catalog/MDX/paper tests passed. The citation audit
  verified all 183 reviewed evidence targets with the same two explicit
  link-only exceptions. `npm run verify` passed TypeScript, all 90 Node tests,
  MDX validation, and the 2,810-module production build; the existing
  large-chunk advisory is unchanged. `git diff --check` passed.
- 2026-08-14 — Follow-up direction kept the Chapter 2 display title unchanged
  and renamed the new TOC node to “Other Methods” / “Các phương pháp khác”.
  The Theory metadata title was aligned with the catalog contract; the Quiz
  title and lesson content remain unchanged.
- 2026-08-14 — A later follow-up renamed Chapter 2 to “Main Approaches” / “Các
  hướng tiếp cận chính” and shortened its first Theory node to “Replay”, with
  the authored MDX metadata aligned to the catalog.
- 2026-08-15 — Iterated the Theory lesson into eight focused pages and added
  four conventionally named illustrations for the motivation, checkpoint split,
  loss flow, and distillation signal types. Reordered DER/DER++ before LwF,
  clarified their old-data access assumptions and outputs, and simplified the
  final comparison table. Added the parameter-space versus function-space bridge
  from EWC, then removed two leftover copy repetitions before commit.

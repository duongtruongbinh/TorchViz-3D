---
title: Continual Learning Branch History
status: done
created: 2026-08-15T01:30:00+07:00
updated: 2026-08-19T15:03:53+07:00
author: Codex
task: "Consolidate the Continual Learning feature branch into one durable history"
supersedes:
  - docs/plans/2026-07-12-learning-lab-ui-ux-polish.md
---

# Goal

Record the final design and maintenance contracts delivered by the Continual
Learning feature branch without preserving overlapping execution plans. This
document owns the durable branch history for Learning Home readiness, academic
citations, metric conventions, regularization methods, and fair benchmark
evaluation. The active subsystem state remains documented in
[Learning Lab](../../wiki/concepts/learning-lab.md).

# Lineage

This work continues the shared Learning Home card system from
[Learning Lab UI/UX Review and Polish](./2026-07-12-learning-lab-ui-ux-polish.md).

# Final outcomes

## Learning Home and catalog presentation

- The domain is displayed as `Continual Learning for LLMs` / `Continual
  Learning cho LLMs`.
- A domain is ready when it has at least one lesson and every lesson is
  published. Learning Home applies a stable partition: ready domains first,
  then unfinished domains, preserving catalog order inside each group.
- Unfinished cards remain navigable and keyboard accessible but use a quieter
  surface. Readiness is derived from React-free catalog data, not a hard-coded
  domain ID.

## Academic-source architecture

The source pipeline has three ownership layers:

1. `papers.generated.ts` is reproducibly generated from the pinned Shi et al.
   survey and owns survey-derived bibliographic identity. Never hand-edit it.
2. `papers.ts` owns reviewed additional papers and explicit lesson claim rows.
   Claim rows decide which papers are primary, additional, qualifying, or
   further reading and how each paper is exposed.
3. `citationEvidence.ts` owns occurrence-level evidence for authored citations.
   Locale MDX owns claim placement and Vietnamese interpretation, while the TOC
   remains navigation metadata only.

Every non-Quiz Continual Learning node has reviewed claim coverage. Large
evidence sets remain only where the lesson actually teaches a literature
landscape, notably DAP Table 2. Exact paper and occurrence counts are derived
from the registries and tests rather than copied into documentation.

### Claim and citation rules

- Survey citations support taxonomy, table-derived synthesis, and the survey
  authors' framing. Named methods, experiments, quantitative results, and
  paper-specific limitations cite the primary paper.
- Every featured paper must be cited beside a claim, analyzed with
  `PaperSummary`, or retained as reasoned further reading. Broad survey-section
  unions are intake material, not automatic page content.
- Citations sit immediately after the sentence or clause they support. Do not
  restore ambiguous trailing `Nguồn:` lines.
- Quantitative and paper-specific empirical claims require the closest useful
  section, equation, table, figure, or appendix locator.
- Course-created examples and lab interpretation must be labeled as course
  analysis rather than attributed to a paper.

### Occurrence evidence contract

Each Continual Learning `<Cite>` must declare exactly one reviewed `evidence`
ID or one documented link-only `exception` ID. Evidence identity is
occurrence-level because one paper can support different local claims.

A reviewed record stores the lesson, claim and paper IDs; exact source-language
excerpt; exact searchable substring; locator; verification URL and precision;
source version and review date; and quotation basis. Excerpts are minimal plain
text. They are never generated, translated as quotations, or fetched at reader
interaction time.

Verification targets use this honest precision order:

1. versioned HTML paragraph/section anchor;
2. canonical PDF page;
3. canonical landing page plus copy-to-find text.

`npm run audit:cl-citation-evidence` rechecks exact fragments and targets with
shared-source caching. Sources that block automation remain explicit
`manual-required` records; inaccessible evidence never becomes a silent empty
preview.

### Reader behavior

- Inline citations render as per-lesson numeric indexes `[n]`. Featured papers
  come first, additional evidence follows, numbering is continuous, and repeated
  occurrences of one paper reuse one number even when their excerpts differ.
- Hover, keyboard focus, and first-tap touch expose a collision-aware Floating
  UI preview containing paper identity, the reviewed excerpt, copy-to-find, and
  the precision-appropriate source action. Escape, outside press, page changes,
  and another citation dismiss it.
- Preview data is bundled and filtered to the active lesson; interaction causes
  no paper fetch. The portal mounts only while open and respects compact screens,
  zoom, keyboard navigation, and reduced motion.
- Every covered non-Quiz lesson receives one generated final reference page.
  Authored `pageCount` remains the authored-content count; runtime assembly adds
  the final page. Quiz and uncovered lessons receive none.
- Final-page references are ordinary canonical links and deliberately have no
  evidence preview. Paper summaries retain readable titles rather than numeric
  labels.

## Core metric conventions

Chapter 5 now keeps the reference baseline explicit:

- Peak-based forgetting compares the best earlier score with the current score:
  `F_peak = prior peak − current`.
- The survey's peak-based BWT reverses that subtraction, so
  `BWT_survey = current − prior peak = −F_peak`.
- GEM-style BWT instead compares the current score with the diagonal score
  recorded immediately after the task was first fine-tuned:
  `BWT_GEM = current − diagonal`.
- The two BWT conventions agree only when each task's prior peak is its diagonal
  score. An intermediate improvement can make them differ.
- FWT compares performance on a future task before learning it with the same
  pre-training/reference baseline; the illustration shows the baseline in gray
  and only the gain in green.

The lesson uses checkpoint-by-checkpoint metric bars, stable task colors, a
dedicated BWT page, explicit sign interpretation, and a paired Quiz question
that tests baseline selection rather than memorized terminology. GEM, Chaudhry
et al., and the survey have reviewed local evidence.

## Regularization-based methods

Chapter 2 is titled `Main Approaches` / `Các hướng tiếp cận chính`; its methods
track now orders `Replay`, `Experience Replay Lab`, `Regularization`, `Weight
Regularization`, `Function Regularization`, then `Architecture Expansion`; each
Theory node remains adjacent to its Quiz.

`Regularization` is a concise three-page overview of the shared
`L_total = L_new + λ L_retention` objective, the parameter-space/function-space
split, the stability–plasticity trade-off, and the checkpoint/storage boundary.
It does not replay old raw data, but it does not claim zero storage cost.

The restored detailed nodes preserve their canonical routes:

- `parameter-regularization-ewc` is now displayed as `Weight Regularization`;
  it retains the EWC/Fisher and Synaptic Intelligence parameter-space lesson.
- `distillation-for-retention` is now displayed as `Function Regularization`;
  it restores the teacher/student, logits/probabilities/representations, LwF,
  DER/DER++, and limitation content with all four distillation illustrations.

The citation audit maps the survey-backed overview, parameter regularization,
and distillation retention to separate reviewable claims. Existing routes for
the detailed nodes remain stable.

The overview cites Wang et al. §4.1 for the target-based Weight/Function split
and keeps Shi et al. for the history-model penalty. The course overview also
cites Kaplan et al. and Hoffmann et al. for the compute/data scaling argument
against retraining a large language model from scratch.

The methods taxonomy now uses one global static `ConceptHierarchy` primitive.
It supports semantic node tones, muted peers, one controlled nested reveal, and
code-native database/loss/neural-network visuals without a graph dependency.
The same hierarchy progressively focuses Regularization, Weight Regularization,
and Function Regularization across their lessons. Optimization-based and
Representation-based remain ordinary `CourseCards` with optional code-native
illustration bands.

The Function Regularization lesson begins with the problem-led page “Tại sao
weight regularization không đủ?”. A short Task A → Task B narrative explains
that nearby parameters do not guarantee preserved responses or old-task
performance before the lesson moves into distillation. The overview's storage
boundary is reinforced by the approved 16:9 trade-off/checkpoint doodle.

## Fair evaluation and realistic benchmarks

The existing `Dataset và Benchmark` pair remains one node but now has three
Theory pages:

1. dataset families by continual setting;
2. a fair-evaluation protocol;
3. realistic stress tests.

The protocol requires disclosure of task/domain order, task-boundary access,
sample exposure, buffer budget, train tokens, update count, FLOPs, and added
parameters. It requires naive sequential fine-tuning, joint/full-history
training when feasible, matched initialization/data order/compute, evaluation
after every stage to construct the performance matrix, multiple seeds and task
orders, and both acquisition and retention. Low forgetting is not success when
the method also fails to learn the new task.

Fair controls answer whether methods were compared under equal conditions.
Stress tests separately ask whether those conditions represent realistic data
streams: blurred task boundaries, long sequences, imbalance, long-tail data,
noisy labels, and negative transfer. The paired Quiz contains one application
question for each distinction.

# Maintenance boundaries

- Preserve typed TOC → React-free catalog → route/selector flow and the
  locale-MDX authored-content boundary.
- Preserve exact Theory/Quiz concept-ID parity.
- Do not duplicate source metadata in MDX, TOC, or `localization.ts`.
- Do not add evidence previews to generated reference pages or fetch papers at
  runtime.
- Do not claim image-classification LwF/DER results automatically transfer to
  generative LLMs.
- Update the existing Learning Lab wiki when counts or durable contracts change;
  do not create a parallel subsystem page.

# Delivery and verification

The branch was rebased onto `origin/main` at `b8251fd`. Conflict resolution
preserved main's lazy ownership boundaries: citation UI remains in
`learningMdxReferences.tsx`, `StageContinuityMap` remains in the Continual
Learning domain adapter, and only domain-neutral `ConceptHierarchy` is added to
the shared authored-MDX grammar.

The final feature commit before this documentation compaction is `0b8007b`
(`feat(learning): refine regularization method lessons`). Full `npm run verify`
passed TypeScript, all 146 tests, MDX/citation validation, and the production
build. `git diff --check` also passed. Nothing was pushed; publishing the
rebased branch requires an explicit force-with-lease decision.

# Out of scope

- English-authored lesson translations or a standalone paper-library route.
- Shipping paper PDFs as runtime lesson dependencies or rendering live papers.
- Runtime AI summarization, semantic source selection, or unreviewed evidence
  generation.
- A runnable distillation lab or reproduction of every cited experiment.
- Renumbering existing lesson routes or changing other Learning Lab domains.

# Compaction log

- 2026-08-15 — Compared the branch with `main`: ten new August 13–15 plans
  totaled 1,849 lines, while the active Learning Lab wiki was also updated.
- 2026-08-15 — User required all August 13 and 14 plans plus the August 15
  evaluation plan to be compacted, while preserving the wiki.
- 2026-08-15 — Read every absorbed plan, retained final contracts and outcomes
  above, removed repeated baselines, intermediate proposals, approval
  boilerplate, and superseded counts, then deleted the ten absorbed files.
- 2026-08-15 — Reduced the plan history from 1,849 lines to 241 lines. Confirmed
  that only this plan is newly present relative to `main`, both lineage links
  resolve, no stale references remain, the wiki is preserved, and
  `git diff --check` passes.
- 2026-08-15 — User approved a source-layer cleanup: remove unused citation
  formatting and generated lookup/provenance exports, and migrate the Overview
  evidence pilot into the same reviewed-occurrence pipeline as every other
  lesson while preserving all authored evidence IDs. Reopened execution.
- 2026-08-15 — Removed the unused paper formatter and generated-only survey/map
  exports, including their generator templates. Migrated all eight Overview
  records into the shared occurrence pipeline without changing their IDs,
  excerpts, provenance, or total evidence count. The three source files are 78
  lines smaller. TypeScript, focused MDX/paper/index tests, and
  `git diff --check` passed.
- 2026-08-19 — Absorbed five later branch plans into this file: the superseded
  merge-regularization proposal, the final overview/subnode restoration, the
  Kaplan/Hoffmann scaling-law citations, the Wang et al. taxonomy illustration,
  and both main-rebase records.
- 2026-08-19 — Compacted the detailed visual follow-ups into the final contracts
  above: global hierarchy ownership, optional CourseCards illustrations,
  progressive Weight/Function focus, the storage doodle, and the short Function
  Regularization narrative. Removed intermediate phase lists, approval
  boilerplate, obsolete merged-node designs, repeated source checks, and stale
  verification counts.
- 2026-08-19 — Preserved `wiki/concepts/learning-lab.md` as the independent
  living architecture reference. It is not a branch plan and therefore is not
  folded into this historical record.

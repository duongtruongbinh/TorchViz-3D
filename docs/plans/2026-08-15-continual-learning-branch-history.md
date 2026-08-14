---
title: Continual Learning Branch Completion
status: done
created: 2026-08-15T01:30:00+07:00
updated: 2026-08-15T03:00:00+07:00
author: Codex
task: "Consolidate the August 13–15 Continual Learning work into one durable branch history"
supersedes:
  - docs/plans/2026-07-14-learning-home-course-card-grid.md
  - docs/plans/2026-08-08-continual-learning-llm-domain.md
---

# Goal

Record the final design and maintenance contracts delivered by the August
13–15 Continual Learning branch without preserving ten overlapping execution
plans. This document owns the durable history for Learning Home readiness,
academic citations, metric conventions, distillation retention, and fair
benchmark evaluation. The active subsystem state remains documented in
[Learning Lab](../../wiki/concepts/learning-lab.md).

# Lineage

This work continues the shared Learning Home card system from
[Learning Home course card grid](./2026-07-14-learning-home-course-card-grid.md)
and the original course scope from
[Continual Learning course](./2026-08-08-continual-learning-llm-domain.md).

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

The final registry contains 231 papers; 196 are exposed by lessons. Forty
non-Quiz Continual Learning nodes have reviewed claim coverage. The authored
course contains 185 citation occurrences: 183 reviewed evidence records and two
explicit link-only exceptions. Large evidence sets remain only where the lesson
actually teaches a literature landscape, notably DAP Table 2.

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

## Distillation for retention

Chapter 2 is titled `Main Approaches` / `Các hướng tiếp cận chính`; its first
node is `Replay`, and the final Theory/Quiz pair is `Other Methods` / `Các
phương pháp khác`.

The eight-page Theory lesson teaches:

- an old checkpoint frozen as teacher and its trainable copy as student;
- functional regularization versus EWC/SI parameter-space constraints;
- logits, softened probabilities with temperature, and aligned intermediate
  representations as distinct matching targets;
- new-task loss plus a weighted retention/distillation loss;
- DER replaying stored old inputs and logits, with DER++ additionally replaying
  labels and supervised loss;
- LwF querying the frozen teacher with new-task inputs when old inputs cannot be
  stored;
- output-space changes, teacher bias, query-set coverage, and the limit that
  matching observed behavior does not guarantee retention of all knowledge.

The pair has six matching concepts/questions, four conventionally named lesson
illustrations, and reviewed sources for Hinton KD, FitNets, LwF, and DER/DER++.
The EWC lesson links the conceptual transition by name without introducing a
fragile route URL.

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

The branch delivered the work in six commits:

- `3da1160` — paper registry, claim coverage, and structured citations;
- `e459798` — occurrence evidence, previews, source audit, and numeric indexes;
- `e012963` — Learning Home/course experience and citation/lesson polish;
- `d637dfd` — BWT, Forgetting, and FWT conventions;
- `99af365` — Distillation Theory/Quiz pair and sources;
- `c1823ea` — fair protocol and realistic benchmark stress tests.

Each implementation tranche passed its focused catalog, MDX, Theory/Quiz,
paper-coverage, citation, and quiz-shape checks. Full verification passed
TypeScript, 90 Node tests, MDX validation, and production build after the
metrics and distillation changes. Citation audits verified all reviewed targets
with the documented explicit exceptions; the fair-protocol follow-up passed its
three focused contract tests. `git diff --check` passed after every tranche.
The existing large Learning Lab chunk advisory remains non-blocking.

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

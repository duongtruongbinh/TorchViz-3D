---
title: Spurious Forgetting paper reading track
status: done
created: 2026-10-14T00:00:00+07:00
updated: 2026-10-16T00:00:00+07:00
author: nmkhiem
task: "Publish the Vietnamese arXiv:2610.08718 reading track; review, verify and commit the branch"
supersedes:
  - docs/plans/2026-10-02-quantifying-memorization-comprehensive-curriculum.md
---

# Goal and approval

Explain [When Forgetting is not Catastrophic](https://arxiv.org/abs/2610.08718v1)
using the Quantifying Memorization reading format. The user approved the original
plan and directed the subsequent content/UI changes. On 2026-10-16, the user
requested code cleanup, this plan's consolidation, fresh verification and a
commit of the current work. Continue on `feat/research-paper-analysis-2026-10-14`.

# Lineage

Builds on the [Quantifying Memorization curriculum](./2026-10-02-quantifying-memorization-comprehensive-curriculum.md).
Follow [WORKFLOW](../WORKFLOW.md) and the [Learning Lab ownership contract](../../wiki/concepts/learning-lab.md).
This existing plan owns the branch; no additional plan document is needed.

# Final scope

- Add `spurious-forgetting-paper` to the Research Papers typed TOC. Retain the
  React-free catalog, locale MDX boundary, canonical routes and light palette.
- Publish nine nodes: title/authors, Abstract, overview quiz, Introduction,
  Chapter 3, mechanism quiz, controlled Transformer, pretrained model, Discussion.
- Chapter 3 is one eleven-page node with ID
  `spurious-forgetting-associative-memory`; its former two sibling nodes are removed.
  The two quizzes contain 16 and 8 questions. The track totals 56 authored pages.
- Explain observations, hypotheses, tests, outcomes and limits in that order.
  Keep full source context, simple Vietnamese and numerical examples before
  technical interpretation. Do not invent the authors' experimental chronology.
- Preserve the user's edited highlights, question callouts and colored An/Bình
  examples. Abstract excerpts retain their opening context as one paragraph.
  Dataset symbols use InlineMath in prose and existing quiz math support.
- PaperExcerpt uses shared MathInline for explicit dollar-delimited source math,
  preserving bold/highlights. TextHighlight supplies the two requested colors.
- Retire the numbered card-and-arrow Flowchart renderer and MDX registration;
  replace consumers with numbered prose, reject future use and update both
  authoring instruction surfaces. Keep ConceptFlow, Mermaid and Timeline.
- Serve the authors' GIF, original Figures 1–5/Table 1 and generated cat/dog
  illustration through existing CDN-only LessonImage. The cat/dog image is an
  illustrative frozen-network/new-classifier example, not a measured paper result.

# Source coverage

Source: PDF v1, main-text pages 3–10. Display equations remain rendered separately.
The source audit restored/expanded 33 text segments alongside four already complete
segments. The following mapping reflects the consolidated Chapter 3 node.

| Paper section | Reading location | Coverage |
| --- | --- | --- |
| 3 opening | Chapter 3 page 2 | Associative-memory abstraction and research goal |
| 3.1 | Chapter 3 pages 3–5 | Prior work, full task/model/training, Equations 1–2, three ablations, Figure 2 |
| 3.2 | Chapter 3 pages 6–8 | Shared-key updates, Equations 3–4/assumptions, answer distribution, readout bias, unequal A/B behavior |
| 3.3 | Chapter 3 pages 9–11 | Recovery, margins, Equation 5/initial condition, no-normalization case, surviving knowledge, erosion, Figure 3 |
| 4 opening/4.1 | Controlled Transformer pages 1–2 | Conditions, templates, random answer pools, Table 1 cross-model map |
| 4.2–4.3 | Controlled Transformer pages 3–4 | Mean shift/drift, logit interventions, common-only control, weight groups, MLP replication, Figure 4 |
| 4.4 | Controlled Transformer page 5 | Timing versus learning, learning-rate depth effect outside gradient-flow analysis |
| 5 opening/5.1 | Pretrained Model pages 1–3 | Predictions, CounterFact, two new-data types, initial rise, recovery/non-recovery, Figure 5 |
| 5.2 | Pretrained Model pages 4–5 | Cumulative-update SVD, random control, old/new trade-off, matched accuracy, Table 3 evidence |
| 6 | Discussion pages 1–3 | Prior work, two timescales, generalization/recovery trade-off, limitations and appendix evidence |

Chapter 3 page 1 is the user's requested plain-language overview. Appendix values
used in lessons were checked at their source locations. Full appendices,
bibliography and acknowledgments remain in the linked paper, not reproduced here.
Top-component removal edits cumulative weight deltas at evaluation checkpoints;
it is distinct from subtracting average old-fact logit changes.

# Assets and ownership

Runtime prefix: `assets/learning/research-papers/llm/continual-learning/spurious-forgetting/`.
Original GIF: authors' `assets/post1_no_title.gif`; original figures/table: PDF crops
at 4×. Local ignored copies live under the matching `src/assets/learning/` folder.
The built-in imagegen PNG and exact prompt are saved there as
`linear_probe_cat_dog.png` and `linear_probe_cat_dog.prompt.txt`.
All published media were visually checked and CDN bytes matched their source.

# Verification and completion

1. Review current runtime changes; remove redundant code without changing behavior.
2. Validate all nine MDX files, page contracts, formulas, source context and catalog counts.
3. Run `npm test`, `npm run verify` (typecheck/tests/build), catalog-stat and diff checks.
4. Update this plan and existing wiki, stage all intended current changes, then
   commit only if all checks pass. No push or deployment is requested.

Current catalog: 18 domains, 117 tracks, 972 nodes, 510 published and 462 placeholders;
Research Papers has 53 published nodes. Existing count assertions/statistics match.

# Execution record

- 2026-10-16 follow-up: fix the reported Research Papers entry redirect within
  this branch's existing plan. Allow the route selector to skip first-lesson
  fallback for bare hierarchical domains; keep explicit track/lesson links and
  ordinary domain defaults. Add regression coverage and run `npm run verify`.
- 2026-10-14: approved track/feature branch; added initial lessons and catalog entry.
- 2026-10-15: incorporated user edits, completed source audit, published original
  media/illustration, retired Flowchart, added math/text emphasis, expanded quizzes
  and consolidated Chapter 3. Prior verification passed TypeScript, 37 test-file
  groups, production build, MDX/KaTeX, excerpt SSR, CDN and catalog checks.
- 2026-10-16: reviewed runtime changes and removed-design references; no unused
  additions remain. Kept the math/highlight parser because highlighted phrases
  may contain formulas; actual SSR checks cover that interaction and plain text.
  Compressed this plan in place. Fresh `npm run verify` passed TypeScript,
  all 37 test-file groups and production build. All nine MDX files (56 pages),
  158 explicit math expressions, catalog statistics and `git diff --check` passed.
  The user-authorized changes are ready to stage and commit; no push requested.

- 2026-10-16: rebased onto main after PR #97, preserving its SVM/Perceptron
  additions and this track; resolved count/wiki conflicts and regenerated totals:
  972 nodes, 510 published, 462 placeholders. `npm run verify` passed TypeScript,
  all 37 test-file groups and production build; catalog and diff checks passed.

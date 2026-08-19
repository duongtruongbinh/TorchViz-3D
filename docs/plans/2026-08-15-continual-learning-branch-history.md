---
title: Continual Learning Branch Completion
status: done
created: 2026-08-15T01:30:00+07:00
updated: 2026-08-19T15:01:21+07:00
author: Codex
task: "Consolidate the August 13–15 Continual Learning work into one durable branch history"
supersedes:
  - docs/plans/2026-07-12-learning-lab-ui-ux-polish.md
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

# Taxonomy graph polish addendum

Status: done

## Goal

Replace the comparison table immediately after “Sau khi biết forgetting xảy ra
như thế nào…” in `cl-methods-taxonomy-and-replay` with a compact hierarchy:
one parent node labeled `Các hướng tiếp cận chính`, branching to three child
nodes labeled `Replay`, `Regularization`, and `Architecture`, each followed by
one brief explanation.

## Decisions

- Preserve the surrounding lesson prose, citations, second `CourseCards`
  section, concept IDs, route, and quiz contract.
- Reuse the current table semantics in the child descriptions:
  Replay intervenes in training data, Regularization in the objective, and
  Architecture in parameters/routing and capacity.
- Add `ConceptHierarchy` as a global, static, data-driven shared MDX component
  for the recurring rooted hierarchy shape. Its authored contract is
  `root + children`, where each node has stable text fields rather than raw JSX
  or coordinates. It must be usable by every Learning Lab domain.
- Use semantic DOM/CSS connectors, the existing Learning Lab theme, responsive
  stacking, and no interaction or new dependency. Keep layout decisions inside
  the renderer so authored MDX remains presentation-free.
- Keep the parent as the primary visual focus and the three children as equal
  peers. Broad surfaces remain neutral; color is limited to the hierarchy and
  connector accents.

## Library evaluation

- The repository currently has no graph/flow package installed. React Flow,
  Mermaid, D3 Hierarchy, Dagre, and ELK are absent from both `package.json` and
  the resolved top-level dependency tree.
- React Flow is aimed at node-based interactive UIs and delegates automatic
  layout to a separate library. Pairing it with Dagre or ELK for this static
  one-to-many hierarchy would add runtime and styling machinery that this
  lesson does not use.
- Mermaid supplies a diagram DSL and renderer but would introduce a large
  transitive dependency surface and a second visual/theming system inside the
  authored MDX pipeline.
- D3 Hierarchy is the closest lightweight layout helper for a rooted tree, but
  it computes coordinates only and assumes uniform node dimensions. The first
  recurring hierarchy needs neither coordinate solving nor arbitrary depth.
- ELK and Dagre are layout engines rather than Learning Lab renderers. They are
  appropriate only when future diagrams require arbitrary topology, automatic
  routing, or multi-level layout.
- Escalation rule: keep `ConceptHierarchy` deliberately scoped to a root and
  peer children. If a later approved use case needs cross-edges, drag/zoom,
  arbitrary depth, dynamic node sizes, or automatic edge routing, evaluate a
  lazy React Flow renderer backed by Dagre or ELK instead of growing a custom
  graph engine inside `learningMdxComponents.tsx`.

## Phases

1. Wait for explicit approval of this addendum.
2. Add the global `ConceptHierarchy` renderer and register it in the React-free
   shared MDX allowlist.
3. Replace only the target `ComparisonMatrix` block in the Vietnamese lesson.
4. Update the existing Learning Lab UI-conventions paragraph and focused MDX
   contract expectations for the new shared grammar.
5. Run the focused MDX tests, TypeScript, and `git diff --check`; record the
   actual result here.

## Out of scope

- No changes to lesson wording outside the replaced table block.
- No changes to the adjacent quiz, TOC, citations, routes, or other lessons.
- No animation, new asset, new dependency, or domain-specific renderer package.

## Addendum execution log

- 2026-08-19 — Draft addendum stored after inspecting the authored MDX, shared
  visual components, static MDX allowlist, active Learning Lab architecture,
  and the existing Continual Learning owning plan.
- 2026-08-19 — Checked local dependencies and official React Flow, Mermaid,
  D3 Hierarchy, and ELK guidance. No graph library is installed; the addendum
  now specifies a global lightweight hierarchy component plus an explicit
  threshold for adopting a full graph/layout library later.
- 2026-08-19 — Addendum explicitly approved by the requester; implementation
  started.
- 2026-08-19 — Added global `ConceptHierarchy` support to the shared renderer
  and React-free MDX allowlist. Its static `root + children` contract derives
  responsive column count and connector geometry inside the renderer, with no
  new dependency or authored coordinates.
- 2026-08-19 — Replaced only the target taxonomy comparison table with the
  `Các hướng tiếp cận chính` hierarchy and concise Replay, Regularization, and
  Architecture descriptions. Updated the existing shared-visual contract test
  and Learning Lab UI-conventions paragraph.
- 2026-08-19 — `git diff --check`, TypeScript, three focused MDX/contract tests,
  and the Vite production build passed. The build emitted only its existing
  plugin-timing report.
- 2026-08-19 — Follow-up visual polish separated each child method name into
  its own graph node and moved the corresponding brief text below that node;
  hierarchy data and lesson wording remained unchanged.
- 2026-08-19 — Added optional semantic tones to the global hierarchy node
  contract. Applied subtle blue, amber, and teal surfaces to Replay,
  Regularization, and Architecture respectively while keeping their brief text
  neutral.
- 2026-08-19 — Corrected the desktop connector geometry shown in review: moved
  visual spacing from the grid gap into each child column so the horizontal rail
  now meets the exact centers of the first and last branch stems.
- 2026-08-19 — Added an optional code-native visual band between child nodes
  and their brief text: a database-backup icon for Replay, a two-term retention
  loss for Regularization, and a compact layered neural-network diagram for
  Architecture. No asset or dependency was added.
- 2026-08-19 — Verified the visual follow-up with `git diff --check`,
  TypeScript, the focused shared-visual and Learning Lab MDX contract tests,
  and the Vite production build; all passed.

# Secondary course-card illustration follow-up

Status: done

## Goal

Keep the existing `CourseCards` block after “Survey còn đề cập hai hướng khác:”
and add one compact illustration to each of its two cards.

## Decisions

- Preserve the current `CourseCards` layout, title bands, labels, wording,
  hover behavior, responsive grid, and card ordering.
- Insert one semantic, code-native visual between each title band and definition
  list: a gradient-conflict/update visual for Optimization-based and embedding
  clusters for Representation-based.
- Extend `CourseCardItem` with an optional static visual identifier so existing
  CourseCards call sites remain visually and behaviorally unchanged.
- Keep SVG geometry and light/dark tone styling inside the shared renderer; the
  lesson MDX declares only the visual identifier.
- Preserve the surrounding intro sentence, the paragraph explaining why these
  methods are not separate course nodes, and the following `LessonNote`.

## Phases

1. Wait for explicit approval of this follow-up.
2. Extend `CourseCards` with optional gradient-update and embedding-cluster
   illustration support while preserving existing call sites.
3. Add the two visual identifiers only to the target Vietnamese lesson cards.
4. Update the focused static MDX fixture and this execution log.
5. Run `git diff --check`, TypeScript, focused MDX contract tests, and the Vite
   production build.

## Out of scope

- No wording or structural changes to the two existing course cards.
- No changes to the first three-branch hierarchy, other CourseCards instances,
  lesson metadata, citations, route, TOC, quiz, or other lessons.
- No new asset, dependency, animation, or interaction.

## Revision log

- 2026-08-19 — The requester rejected and undid the proposed second hierarchy.
  Scope was revised to preserve the original CourseCards and add only the two
  previously designed illustrations.
- 2026-08-19 — The requester explicitly approved the revised icon-only scope;
  implementation started.
- 2026-08-19 — Added an optional fixed illustration band to the shared
  `CourseCards` renderer and enabled it only for Optimization-based and
  Representation-based, using the approved gradient-update and embedding-cluster
  visuals. Existing copy, labels, title bands, numbering, and behavior remain.
- 2026-08-19 — Updated the focused static MDX fixture and existing Learning Lab
  visual convention. `git diff --check`, TypeScript, focused MDX contract tests,
  and the Vite production build all passed.

# Final cleanup, main rebase, and commit

Status: done

The requester explicitly approved this closing sequence:

1. Audit the current Continual Learning diff and remove only code made redundant
   by this branch's final design.
2. Preserve all working changes, fetch the latest `origin/main`, rebase
   `feat/merge-regularization-methods` onto it, and resolve any conflicts without
   discarding user work.
3. Run proportional verification, stage the completed scope, and create one
   intentional commit. Do not push or open a pull request.

The execution log and final verification result will be recorded here after the
rebase.

## Execution log

- 2026-08-19 — Audited the final diff. All new visual APIs have active lesson
  call sites. Removed the unused CourseCards label variable, restored the two
  reviewed taxonomy citation occurrences required by the evidence contract, and
  updated the stale Function Regularization wiki description to match the final
  short narrative.
- 2026-08-19 — Fetched `origin/main` at `b8251fd` and rebased the six existing
  branch commits onto it. Conflict resolution preserved main's new ownership:
  citation UI stays in `learningMdxReferences.tsx`, and `StageContinuityMap`
  stays in the Continual Learning domain adapter rather than being duplicated
  in the shared renderer.
- 2026-08-19 — Restored the approved working changes, kept only
  `ConceptHierarchy` as the new global primitive, and resolved the shared MDX
  contract/test expectations against main's lazy runtime boundaries.
- 2026-08-19 — `git diff --check` and `npm run verify` passed: TypeScript, all
  146 tests, and the Vite production build completed successfully.

# Function-primer simplification follow-up

Status: done

## Goal

Turn the new Function Regularization primer into one short visual argument that
answers why Weight Regularization is not sufficient, without the current
formula-heavy detour.

## Decisions

- Rename page 0 from `Function regularization là gì?` to
  `Tại sao weight regularization không đủ?`.
- Keep the existing Function-focused hierarchy diagram as the recap anchor.
- Replace the formulas, note, and numeric comparison table with one concise
  four-step `ConceptFlow`: `Weight reg` → `MSE / KL` → old-task performance
  can still decrease → `Function reg`.
- Keep each step to a short label and one brief explanatory line. State the
  performance limitation as a possibility, not a guaranteed outcome.
- End with one sentence that bridges directly into the existing
  `Function regularization qua distillation` page.
- Preserve `pageCount: 9` and pages 1–8 unchanged.

## Phases

1. Wait for explicit approval of this follow-up.
2. Simplify only page 0 of the Vietnamese distillation lesson.
3. Record the actual modification here and restore the plan to `done`.
4. Run `git diff --check` and the focused Learning Lab MDX contract test.

## Out of scope

- No renderer, TOC, route, citation, quiz, image, or dependency change.
- No edits to the existing distillation material on pages 1–8.

## Execution log

- 2026-08-19 — The requester approved the four-step simplification and the
  problem-led heading `Tại sao weight regularization không đủ?`.
- 2026-08-19 — Replaced the formulas, technical note, and numeric KL table on
  page 0 with the concise flow `Weight reg` → `MSE / KL` → performance can
  still decrease → `Function reg`. The hierarchy recap, bridge, page count,
  and pages 1–8 remain intact.
- 2026-08-19 — `git diff --check` and the focused generic Learning Lab MDX
  contract test passed. The full MDX test file retains the pre-existing,
  unrelated missing-citation failure in `cl-methods-taxonomy-and-replay`.

## Storytelling revision

Status: done

- Keep the problem-led heading and taxonomy recap, but remove the standalone
  `ConceptFlow` that currently presents the conclusion without a narrative.
- Tell one compact running scenario: a model finishes Task A, then learns Task B
  while Weight Regularization keeps it near the old checkpoint.
- Reveal the failure next: nearby weights do not guarantee the same responses,
  so old-task performance can still decrease.
- Introduce MSE/KL only after that failure as ways to compare old-model and
  new-model responses, then name this change of target as Function
  Regularization.
- Close with the existing one-sentence bridge to knowledge distillation.
- Keep the page free of formulas, tables, and additional diagrams; preserve the
  hierarchy recap and pages 1–8.

Execution remains limited to page 0, followed by `git diff --check` and the
focused generic Learning Lab MDX contract test.

- 2026-08-19 — The requester approved the running Task A → Task B scenario.
  Removed the standalone `ConceptFlow` and replaced it with a four-paragraph
  narrative that reveals the Weight Regularization failure before introducing
  MSE/KL and naming Function Regularization. The taxonomy recap and distillation
  bridge remain in place.
- 2026-08-19 — `git diff --check` and the focused generic Learning Lab MDX
  contract test passed.

# Regularization page-boundary refinement

Status: done

## Goal

Move the progressive taxonomy reveal out of page 0 and into page 1 so the first
page stays focused on the shared retention objective while the second page owns
the Weight/Function split.

## Decisions

- Move the complete block beginning with “Survey tiếp tục chia nhóm này thành
  hai hướng” through the two explanatory bullets from the end of page 0 to the
  start of page 1, immediately below `## Hai regularization targets`.
- Use that moved sentence, citation, expanded hierarchy, and bullets to replace
  the current introductory paragraph beginning “Theo Wang et al.” and ending
  “Hai node kế tiếp đi sâu vào từng hướng”.
- Preserve the moved wording, citation evidence ID, graph data, node tones,
  bullets, following `LessonImage`, and `ComparisonMatrix` exactly.
- Keep page count, headings, concept IDs, routes, and pages 0/2 unchanged apart
  from the requested page-boundary movement.

## Phases

1. Wait for explicit approval of this refinement.
2. Move the existing MDX block and remove only the superseded page-1 intro.
3. Record the result in this plan.
4. Run `git diff --check` and the focused Learning Lab MDX contract test; no
   full build is needed for a pure authored-content reorder unless validation
   reveals a broader issue.

## Out of scope

- No copy rewrite beyond the already approved “Survey tiếp tục…” sentence.
- No renderer, graph geometry, styling, citation registry, TOC, quiz, or other
  lesson changes.

## Page-boundary execution log

- 2026-08-19 — The requester explicitly approved the page-boundary refinement;
  implementation started.
- 2026-08-19 — Moved the “Survey tiếp tục…” sentence, expanded hierarchy, and
  two explanatory bullets from page 0 to the start of page 1, replacing only
  the superseded “Theo Wang et al.” introduction.
- 2026-08-19 — Removed the now-unused duplicate citation occurrence
  `regularization-overview-06` and reduced the matching review inventory from
  six occurrences to five; the surviving source, claim, and `[2]` citation are
  unchanged.
- 2026-08-19 — `git diff --check`, TypeScript, the generic Learning Lab MDX
  contract test, and a direct regularization evidence inventory check passed.
  The broader paper-coverage test remains blocked earlier by the pre-existing
  absence of any `Cite` occurrence in `cl-methods-taxonomy-and-replay`, outside
  this refinement's scope.

# Regularization trade-off illustration addendum

Status: done

## Goal

Create and integrate one 16:9 educational doodle illustration for page 2,
“Trade-off và ranh giới storage”, using the requester-provided prompt template.

## Decisions

- Use the built-in image-generation path and the supplied clean pastel doodle
  card style: white/light background, bold hand-drawn outlines, stick-figure
  mascots, minimal text, no gradients, no photorealism, and spacious 16:9
  composition.
- Split the idea into four visual cards:
  1. `λ thấp`: a new-task block enters while old-knowledge blocks fall away.
  2. `Cân bằng`: old knowledge and new learning remain balanced together.
  3. `λ cao`: old knowledge is strongly protected but the new-task block cannot
     enter, showing reduced plasticity.
  4. `Mốc lưu trữ`: a frozen old checkpoint supplies parameter importance or
     teacher targets, showing that regularization is not zero-storage.
- Keep text to those four short Vietnamese headings plus only essential symbols.
- Save the selected output as
  `src/assets/learning/continual-learning-llm/02-regularization-tradeoff-storage-doodle.png`.
- Insert one `LessonImage` after the paragraph that introduces the frozen model
  reference and before the Weight/Function storage bullets. Add concise
  Vietnamese alt text and no extra lesson prose.

## Phases

1. Wait for explicit approval of this addendum.
2. Generate the image from the supplied template with the four-card IDEA filled
   in, inspect it, and make at most one focused correction if required.
3. Copy the selected image into the lesson asset directory and add the
   `LessonImage` reference to page 2.
4. Record the final prompt, asset path, integration, and verification here.
5. Run `git diff --check`, the focused Learning Lab MDX contract test, and a
   production build because a new bundled asset is introduced.

## Out of scope

- No changes to the surrounding lesson wording, citations, graph, page count,
  quiz, TOC, or other assets.
- No renderer change, new dependency, animation, or interactive behavior.

## Illustration execution log

- 2026-08-19 — The requester explicitly approved the four-card illustration
  plan; generation started with the supplied prompt template.
- 2026-08-19 — Generated one 1672×941 PNG with the built-in image tool. The
  final prompt used the requester-provided template and filled IDEA with four
  visual states: low lambda forgetting, balanced retention/acquisition, high
  lambda blocking plasticity, and a frozen checkpoint supplying parameter
  importance or teacher targets.
- 2026-08-19 — Saved the selected output as
  `src/assets/learning/continual-learning-llm/02-regularization-tradeoff-storage-doodle.png`
  and inserted it after the frozen-reference paragraph with concise Vietnamese
  alt text. No surrounding prose changed.
- 2026-08-19 — `git diff --check`, the generic Learning Lab MDX contract test,
  and the Vite production build passed.

# Weight-regularization focus hierarchy addendum

Status: done

## Goal

Carry the expanded regularization taxonomy into page 0 of
`parameter-regularization-ewc` and make Weight regularization the sole active
subfamily focus.

## Decisions

- Insert one `ConceptHierarchy` immediately after the heading “Tạo ràng buộc
  trong parameter space”.
- Duplicate the previously established root, Replay/Regularization/Architecture
  branches, tones, icons, and Weight/Function nested children without detail
  text.
- Keep Replay and Architecture muted, keep Regularization active, keep Weight
  regularization active in violet, and retain Function regularization in teal
  but muted.
- Preserve all existing page prose, formulas, citations, page boundaries,
  metadata, and following pages.

## Phases

1. Wait for explicit approval of this addendum.
2. Add only the static hierarchy data to page 0 of the Vietnamese lesson.
3. Record the modification and run `git diff --check` plus the focused generic
   Learning Lab MDX contract test.

## Out of scope

- No renderer, layout, tone-system, TOC, quiz, citation, image, or other lesson
  changes.

## Weight-focus execution log

- 2026-08-19 — The requester explicitly approved the Weight-focus hierarchy;
  implementation started.
- 2026-08-19 — Added the established expanded taxonomy immediately after the
  page heading. Replay, Architecture, and Function regularization are muted;
  Regularization and its violet Weight regularization child remain active.
- 2026-08-19 — `git diff --check` and the generic Learning Lab MDX contract
  test passed. No full build was run for this static authored-data-only change.

# Function-regularization primer addendum

Status: done

## Goal

Add one brief conceptual page at the start of the existing Function
Regularization lesson before it proceeds into distillation mechanics.

## Decisions

- Keep the existing TOC Theory/Quiz pair and route. Add a new page 0 inside
  `distillation-for-retention`, shift the current eight pages to 1–8, prepend
  one heading, and change `pageCount` from 8 to 9.
- Begin the new page with the established hierarchy focused on Function
  regularization: Replay and Architecture muted, Regularization active, Weight
  regularization retained but muted, and Function regularization active in teal.
- Explain the target-space distinction with static formulas:
  parameter regularization constrains `theta` relative to `theta_old`, whereas
  function regularization constrains selected signals `s_theta(x)` relative to
  old-model signals on a query set `Q`.
- Introduce the second loss term first as an MSE signal-matching penalty. State
  that MSE is already a soft penalty rather than an inherently hard constraint,
  but forcing it near zero or assigning it an excessively large `lambda` can
  make the student copy old signals too tightly and reduce plasticity.
- State the zero-loss boundary precisely: output MSE equal to zero means the
  selected signal matches exactly on `Q`; it does not imply identical
  parameters or matching behavior outside `Q`.
- Then introduce probability matching with
  `T^2 D_KL(p_old^T || p_theta^T)` as a common softer-target formulation. Make
  clear that the softness comes from temperature-scaled probabilities together
  with `lambda`, not from KL being universally softer or better than MSE.
- Include one explicitly course-constructed binary example using the same
  teacher distribution `[0.51, 0.49]`:
  - Model A `[0.49, 0.51]`: KL about `0.0008`, but argmax flips and top-1
    performance on a class-A example drops.
  - Model B `[0.99, 0.01]`: KL about `1.5687`, but argmax stays on class A and
    top-1 performance on that example is unchanged.
  The conclusion is that KL is a continuous surrogate retention loss, not the
  task metric itself.
- End with a one-sentence bridge into the existing “Function regularization qua
  distillation” page. Preserve all existing page content, citations, images,
  concept IDs, and quiz questions.

## Source check

- Hinton, Vinyals, and Dean, “Distilling the Knowledge in a Neural Network”
  supports softened teacher targets and temperature-based distillation.
- Kim et al., “Comparing Kullback-Leibler Divergence and Mean Squared Error Loss
  in Knowledge Distillation” confirms that KL on softened distributions is a
  common KD objective and that KL/MSE choices need not track performance
  identically.
- The two-row KL/argmax comparison above is an original arithmetic example for
  this course, not an empirical claim from either paper.

## Revision log

- 2026-08-19 — After technical review with the requester, revised the MSE-to-KL
  narrative: MSE is not intrinsically hard and may outperform KL in some KD
  settings; the lesson will explain when strong MSE matching becomes
  restrictive and attribute soft KL matching to temperature-scaled targets.

## Phases

1. Wait for explicit approval of this addendum.
2. Add page 0, update metadata, and shift the eight existing page indexes.
3. Update the focused static MDX/lesson expectations only if validation requires
   it, then record the actual modification here.
4. Run `git diff --check`, TypeScript, the focused generic Learning Lab MDX
   contract test, and the production build because the lesson paging contract
   changes.

## Out of scope

- No new TOC node, quiz node, concept ID, citation occurrence, image, renderer,
  dependency, or other lesson change.
- No claim that low KL guarantees retained task performance or that zero loss
  on a finite query set guarantees global functional equivalence.

## Function-primer execution log

- 2026-08-19 — The requester explicitly approved the technically revised
  MSE-to-soft-KL primer; implementation started.
- 2026-08-19 — Added a new page 0 with the Function-focused taxonomy, the
  parameter/function target distinction, MSE and temperature-softened KL
  objectives, the exact zero-MSE scope, and a course-constructed comparison in
  which KL `0.0008` flips argmax while KL `1.5687` preserves it on one sample.
- 2026-08-19 — Shifted the eight existing distillation pages intact to 1–8,
  prepended the new heading, and changed `pageCount` from 8 to 9. TOC identity,
  concept IDs, citations, images, and quiz questions remain unchanged.
- 2026-08-19 — Updated the existing Learning Lab curriculum description.
  `git diff --check`, TypeScript, the generic Learning Lab MDX contract test,
  and the Vite production build passed.

# Progressive regularization hierarchy addendum

Status: done

## Goal

Use two successive hierarchy diagrams on page 0 of `regularization-overview` to
recall the three main Continual Learning approaches and then reveal the two
regularization subfamilies without changing the current explanatory prose.

## Decisions

- Insert a compact three-branch `ConceptHierarchy` immediately after the
  “Giữ tri thức cũ trong objective” heading. Reuse the same root, labels, tones,
  and semantic visuals as the taxonomy lesson, but omit all detail text.
- Keep Regularization visually active and mute Replay and Architecture in both
  diagrams so the current lesson focus is unambiguous.
- Preserve the current paragraphs, loss equation, citation, and explanatory
  order after the first recap diagram.
- Change only “Survey chia nhóm này thành hai hướng” to “Survey tiếp tục chia
  nhóm này thành hai hướng”. Place a second three-branch diagram after that
  sentence, with two title-only child nodes branching from Regularization:
  `Weight regularization` and `Function regularization`.
- Keep the two existing explanatory bullets below the expanded diagram.
- Extend the global hierarchy contract with optional muted state and one nested
  child level. Keep authored MDX semantic; connector geometry, opacity, and
  responsive behavior remain inside the shared renderer.

## Phases

1. Wait for explicit approval of this addendum.
2. Add muted-node and one-level nested-child support to `ConceptHierarchy`
   without changing existing call sites.
3. Add the recap and expanded diagrams to page 0 of the Vietnamese
   regularization overview and update the requested sentence.
4. Update the focused static MDX fixture, existing Learning Lab convention, and
   this execution log.
5. Run `git diff --check`, TypeScript, focused MDX contract tests, and the Vite
   production build.

## Out of scope

- No removal or rewriting of the current body paragraphs, equation, citations,
  or two explanatory bullets.
- No changes to pages 1–2, the quiz, TOC, routes, or other lessons.
- No arbitrary-depth tree engine, new dependency, asset, animation, or
  interaction.

## Progressive hierarchy execution log

- 2026-08-19 — The requester explicitly approved the two-diagram progressive
  hierarchy plan; implementation started.
- 2026-08-19 — Added optional muted peers and one nested child level to the
  global `ConceptHierarchy` renderer. The nested branch expands around its
  parent column on desktop and remains stacked on compact screens.
- 2026-08-19 — Added the title-only recap diagram after the page heading and the
  expanded Weight/Function diagram after the revised “Survey tiếp tục…”
  sentence. Existing prose, equation, citations, and bullets remain unchanged.
- 2026-08-19 — Updated the focused static MDX fixture and existing Learning Lab
  visual convention. `git diff --check`, TypeScript, focused MDX contract tests,
  and the Vite production build all passed.

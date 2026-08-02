---
title: Replace Statistics Chapter 1 with Probability
status: done
created: 2026-07-30T01:52:39+07:00
updated: 2026-08-02T11:35:20+07:00
author: nmkhiem
task: "re-audit Probability nodes 1.1-1.6, strengthen applied quiz transfer, and distill the first empirical-frequency page"
supersedes:
  - docs/plans/2026-07-30-statistics-overview-lesson-replacement.md
---

# Goal

Replace the current nine-lesson ISLP introduction track with a coherent
probability foundation that prepares learners for the remaining Statistics
curriculum.

Success means:

- Chapter 1 is titled `1. Xác suất` / `1. Probability`;
- the domain display name is `Probability & Statistics` in English and
  `Xác suất & Thống kê` in Vietnamese;
- all nine old Chapter 1 lessons are replaced by nine probability lessons that
  retain the supplied note's wording, voice, examples, and notes;
- edits to the supplied 1,247-line note are limited to correcting mathematical
  or conceptual errors, removing empty placeholders and bare media links, and
  adapting its structure to valid MDX;
- every mathematical formula and mathematical symbol is rendered through a
  shared KaTeX-backed MDX component, inline or as a display block;
- formulas and terminology are corrected where the reference is inaccurate;
- old track/lesson URLs resolve to the corresponding new canonical routes;
- catalog, MDX, tests, production build, and active Learning Lab documentation
  agree with the new chapter.

# Lineage

Supersedes
[Statistics Overview Lesson Replacement](./2026-07-30-statistics-overview-lesson-replacement.md),
whose first-lesson-only scope is absorbed by this complete Chapter 1
replacement.

# Verbatim and KaTeX Addendum

This addendum supersedes the original-content boundary, page counts, and the
`MdxCode` formula-rendering decision recorded below. The requester clarified
that the supplied Vietnamese wording must be retained.

The approved execution will:

- preserve valid source wording, including its conversational voice, notes,
  examples, and informal phrasing;
- correct only mathematical or conceptual errors;
- remove `!Untitled` placeholders, empty Notion wrapper syntax, and bare
  video/media links that do not provide usable lesson content;
- make only the punctuation and structural changes required for valid,
  readable MDX pages;
- introduce a shared `MdxFormula` primitive backed by KaTeX, supporting both
  inline and display rendering;
- express formulas and mathematical symbols through `MdxFormula`, rather than
  raw TeX, inline code, or `MdxCode`;
- keep the nine canonical lesson ids and compatibility aliases already
  implemented;
- expand Chapter 1 from 32 to 40 pages so the retained wording remains
  readable, changing the Statistics total from 285 to 293 pages.

# Context Read

- The current `introduction` track contains nine published Vietnamese lessons
  with twelve pages total.
- Statistics has 90 published lessons and 265 pages overall.
- The attached note covers probability history, experiments/events, event
  algebra, classical and empirical probability, conditional probability,
  multiplication, total probability, Bayes, Naive Bayes, and exercises.
- The note also contains missing-image placeholders, bare media links, Notion
  wrapper syntax, and mathematical inaccuracies. Those artifacts require
  cleanup, while its valid wording remains canonical.
- The catalog supports route aliases for replaced track and lesson ids.

# Decisions (Locked)

## Canonical Structure

Replace `introduction` with track id `probability` and these lessons:

1. `ch01-probability-origins` — Khởi nguồn và trực giác xác suất — 3 pages.
2. `ch01-experiments-events-sample-space` — Phép thử, biến cố và không gian mẫu
   — 5 pages.
3. `ch01-event-relations` — Quan hệ giữa các biến cố — 10 pages.
4. `ch01-probability-definitions-properties` — Định nghĩa và tính chất xác suất
   — 3 pages.
5. `ch01-empirical-probability` — Tần số và xác suất thực nghiệm — 3 pages.
6. `ch01-conditional-probability` — Xác suất có điều kiện và quy tắc nhân —
   6 pages.
7. `ch01-total-probability` — Công thức xác suất toàn phần — 2 pages.
8. `ch01-bayes-naive-bayes` — Định lý Bayes và Naive Bayes — 5 pages.
9. `ch01-probability-exercises` — Bài tập xác suất — 3 pages.

The revised chapter has 40 pages. Replacing the old 12 pages changes the
Statistics total from 265 to 293 while preserving 13 tracks and 90 published
lessons.

## Content Boundary

- Preserve the reference's valid Vietnamese wording, tone, notes, and examples.
- Restrict prose changes to mathematical/conceptual corrections and the
  smallest MDX formatting adjustments needed for readable lesson pages.
- Use standard notation: sample space `\Omega`, empty event `\varnothing`,
  complement `A^c`, union `A \cup B`, and intersection `A \cap B`.
- Define a random variable correctly as a function from outcomes to numeric
  values, not as another name for a random event.
- Use the correct conditional formula
  `P(A\mid B)=P(A\cap B)/P(B)` for `P(B)>0`.
- State total probability and Bayes with a valid partition.
- Explain that histograms may show counts, relative frequencies, or density;
  do not repeat the reference's claim that count histograms are invalid.
- Present Naive Bayes as conditional-independence modelling, with log scores and
  smoothing for numerical robustness.
- Retain worked examples, exercises, anecdotes, and informal wording, but no
  missing-image placeholders, unusable bare media links, or answer-key
  arithmetic known to be incorrect.
- Render all formulas and mathematical symbols with the shared KaTeX-backed
  `MdxFormula` component.

## Compatibility

- Keep the canonical domain id `statistics`; change only its localized display
  name and description so existing domain URLs and stored state remain valid.
- Delete the nine old Chapter 1 MDX files and create nine canonical new files.
- Add one track alias from `introduction` to `probability`.
- Add nine lesson aliases from each old id to its positional replacement so
  bookmarks continue to resolve.
- Do not change chapters 2–13 or domain routing. Extend the generic shared MDX
  component contract only with `MdxFormula`.

# Phases

## Phase 0 - Approval

- Store this plan as the task's first write.
- Wait for explicit requester approval.

## Phase 1 - Catalog and Routes

- Rename the localized domain display title to `Probability & Statistics` /
  `Xác suất & Thống kê` and update its description for the expanded scope.
- Replace the Chapter 1 track metadata and lesson seeds in the Statistics TOC.
- Add track and lesson route aliases.
- Update catalog regression coverage for the new canonical structure and alias
  count/resolution.

## Phase 2 - Authored Probability Chapter

- Remove the nine superseded Vietnamese MDX files.
- Add `MdxFormula` to the shared MDX component contract and renderer, backed by
  KaTeX for inline and display formulas.
- Replace the nine probability MDX lesson bodies with retained source wording
  across 40 contiguous pages and metadata matching the new TOC.
- Add regression coverage for the shared formula component and generic MDX
  allowlist.

## Phase 3 - Counts and Documentation

- Update the locked Statistics page-count assertion from 285 to 293.
- Update the existing Learning Lab wiki to distinguish the original
  40-page probability Chapter 1 from the retained ISLP-derived Chapters 2–13.
- Do not rewrite completed historical plans.

## Phase 4 - Verification and Record

- Run focused catalog/MDX tests, `npm run verify`, stale-id/reference searches,
  and `git diff --check`.
- Record exact modifications and verification evidence here.

# Out of Scope

- Changing the Statistics domain id or the remaining twelve tracks.
- Adding interactive probability simulations.
- Rewriting valid source wording for style or concision.
- Restoring English Statistics MDX files.
- Editing unrelated existing working-tree changes.

# Chapter 1 Visual and Quiz Addendum

This addendum reopens the existing approved Chapter 1 checkpoint for the
requester's visual redesign and adjacent quiz-node pass. It does not create a
new planning surface.

## Scope and Locked Decisions

- Limit all content and catalog changes to Chapter 1. The request's final
  instruction not to change content outside Chapter 1 takes precedence over
  the earlier mention of Chapters 1–3.
- Preserve the current Vietnamese wording, MDX metadata, theory lesson ids,
  routes, locales, and 40-page theory structure.
- Preserve approved visual treatments where they remain conceptually accurate.
- Extend the existing `ProbabilityChapterVisual` and shared Learning Lab
  components instead of creating a parallel renderer architecture.
- Give each theory page one clear visual focus appropriate to the concept,
  without repeating one card pattern, nesting cards, adding decorative effects,
  or restating information already fully expressed by a diagram.
- Keep paragraphs, blockquotes, and `LessonNote` content full-width within the
  lesson content region. Constrain only media, formulas, tables, and diagrams
  where overflow protection is necessary.
- Keep all mathematical notation KaTeX-rendered, including quiz prompts,
  options, categories, and feedback; raw dollar-delimited syntax may remain
  only as the authored quiz-string transport parsed by the renderer and must
  never be exposed to learners.
- Retain the nine adjacent Chapter 1 quiz nodes already present in the working
  tree. Each is titled `Quiz`, contains one question per page, and uses the
  appropriate `single`, `multi`, `order`, or `categorize` interaction.
- Preserve responsive behavior and readable light/dark contrast on mobile,
  tablet, and desktop.
- Treat all current uncommitted Chapter 1 work as requester-owned state:
  inspect and refine it in place without discarding unrelated changes.

## Addendum Phases

1. Audit all 40 theory pages and 27 quiz pages against the locked hierarchy,
   full-width text, diagram specificity, KaTeX, responsive, and theme
   requirements.
2. Make the smallest necessary Chapter 1 MDX and existing-component changes,
   preserving wording and already-suitable designs.
3. Confirm the Chapter 1 TOC alternates each theory node with its `Quiz` node
   while preserving canonical theory metadata and routes.
4. Run `npm run typecheck`, focused MDX and catalog tests, then
   `npm run verify`; record exact results and modifications in this plan and
   the existing Learning Lab documentation only when its current-state claims
   require adjustment.

# Chapter 1 Pedagogical Reordering Addendum — 2026-08-02

This addendum reopens the existing Chapter 1 plan instead of creating another
planning surface. The requester wants the purely foundational nodes, including
conditional and total probability, moved before the narrative intuition node.
That node must then hand learners directly to Bayes and Naive Bayes.

## Goal

Reorder Chapter 1 around conceptual dependency and narrative payoff:

1. define experiments, events, event relations, probability, empirical
   frequency, conditioning, and total probability;
2. use `Khởi nguồn và trực giác xác suất` as a narrative synthesis that moves
   from repeated events to the limits of raw relative frequency for one-off
   questions;
3. enter `Định lý Bayes và Naive Bayes` immediately afterward;
4. retain the adjacent quiz rhythm and finish with the existing exercises.

## Context Read

- Runtime ordering is owned by the Probability track's `lessonIds` array in
  `src/content/learning/statistics/table-of-contents.ts`; filename prefixes and
  localized numeric titles are authoring/display conventions rather than
  canonical identity.
- Canonical lesson ids are semantic and already published. Route aliases and
  tests reference those ids, so reordering must not replace them.
- Conditional probability is required by total probability. Both are required
  before Bayes, and Naive Bayes additionally depends on Bayes, likelihoods,
  priors/posteriors, and the conditional-independence simplification.
- The newly expanded intuition lesson overlaps the empirical-probability node:
  the empirical node formally owns frequency, relative frequency, histogram
  interpretation, and finite-sample estimation; the intuition node should own
  history, interpretation, large-number motivation, and the bridge from
  one-off events to Bayesian updating.
- Existing legacy aliases point to stable semantic ids. They must remain
  unchanged unless verification finds an actual broken route; they must not be
  remapped merely to follow new ordinal positions.

## Proposed Canonical Order

Each theory lesson remains immediately followed by its current `Quiz` node.

| New number | Canonical id | Vietnamese title | Role |
|---|---|---|---|
| 1.1 | `ch01-experiments-events-sample-space` | Phép thử, biến cố và không gian mẫu | Foundational objects |
| 1.2 | `ch01-event-relations` | Quan hệ giữa các biến cố | Set/event relations and independence |
| 1.3 | `ch01-probability-definitions-properties` | Định nghĩa và tính chất xác suất | Probability model and rules |
| 1.4 | `ch01-empirical-probability` | Tần số và xác suất thực nghiệm | Formal empirical frequency and estimation |
| 1.5 | `ch01-conditional-probability` | Xác suất có điều kiện và quy tắc nhân | Conditioning prerequisite |
| 1.6 | `ch01-total-probability` | Công thức xác suất toàn phần | Bayes denominator prerequisite |
| 1.7 | `ch01-probability-origins` | Khởi nguồn và trực giác xác suất | Narrative synthesis and Bayesian motivation |
| 1.8 | `ch01-bayes-naive-bayes` | Định lý Bayes và Naive Bayes | Bayesian update and classifier |
| 1.9 | `ch01-probability-exercises` | Bài tập xác suất | Consolidated practice |

The corresponding theory/quiz filename prefixes move together while their
`lessonMetadata.id` and `MdxQuiz.id` values remain unchanged:

```text
1.2 -> 1.1     1.3 -> 1.2     1.4 -> 1.3
1.5 -> 1.4     1.6 -> 1.5     1.7 -> 1.6
1.1 -> 1.7     1.8 unchanged  1.9 unchanged
```

## Decisions to Lock on Approval

- Keep nine theory nodes and nine adjacent quiz nodes; do not merge the 16
  pages currently owned by conditional probability, total probability, and
  Bayes/Naive Bayes into one oversized node.
- Preserve every canonical lesson id, quiz id, route, locale, and legacy alias.
- Reorder theory/quiz pairs in the TOC and update localized numeric titles in
  both English and Vietnamese.
- Rename MDX files collision-safely so filename prefixes agree with the new
  displayed order; do not use filename renames to change canonical identity.
- Make the empirical-probability node the sole formal owner of
  `frequency`, `relative frequency`, histogram scales, and empirical
  estimation. In the reordered intuition node, keep only the minimum recap
  needed for its narrative about large numbers and one-off events.
- Keep the five-page intuition arc already approved: history, random outcomes,
  the hidden-coin `50%` question, large-number stability, and one-off events.
  Change its transitions from first-time definition to recap/synthesis where
  earlier nodes now teach the formal concepts.
- End the intuition node with a precise bridge: observed frequency alone is
  insufficient for the exact same one-off event, historical frequency remains
  evidence, and Bayesian inference combines prior information with new
  evidence. Do not claim that frequentist probability is invalid for
  forecasting a single event.
- Expand the intuition quiz from four to five questions so its one-off-event
  page is checked. Remove any quiz item that merely duplicates the formal
  empirical-frequency quiz; retain questions on random outcomes, the hidden
  coin, large-number motivation, AI uncertainty, and the Bayesian bridge.
- Keep Bayes/Naive Bayes lesson content in its existing node. Only adjust its
  opening transition where needed so it directly continues the preceding
  intuition page without repeating the motivation.

## Execution Phases

1. Reorder all nine theory/quiz pairs in the Probability TOC and update the
   exact-order catalog regression.
2. Rename the affected theory and quiz MDX files through collision-safe
   temporary names, then update English/Vietnamese numeric titles while
   preserving canonical ids.
3. Audit the empirical-frequency and intuition lessons side by side. Remove
   duplicated formal instruction from the latter, preserve its narrative and
   visuals, and tighten the handoff into Bayes/Naive Bayes.
4. Add the fifth intuition quiz question for one-off events, align quiz
   metadata and locked question ids, and ensure the empirical quiz remains the
   owner of formula-level frequency assessment.
5. Audit route aliases, previous/next navigation, search metadata, exact page
   totals, and any documentation that states the Chapter 1 order or counts.
6. Run focused catalog and MDX tests, strict KaTeX checks where authored quiz
   math changed, `npm run verify`, stale-number/path searches, and
   `git diff --check`. Record the final order, modifications, and evidence in
   this plan.

## Out of Scope for This Addendum

- Merging conditional probability, total probability, and Bayes/Naive Bayes
  into one lesson.
- Changing canonical ids, public routes, or the `statistics` domain/track ids.
- Reordering chapters or tracks outside Probability Chapter 1.
- Rewriting the Bayes/Naive Bayes algorithm, examples, or exercise datasets
  except where a transition must reflect the new predecessor.
- Adding a second planning document.

## Approval Checkpoint

- 2026-08-02T02:57:36+07:00 — Audited the current nine-node order, lesson
  metadata, dependency chain, quiz adjacency, route aliases, and catalog order
  regression. Stored this reordering addendum as draft.
- 2026-08-02 — Requester approved the plan with “pl”; marked the checkpoint
  executing and began the reorder without changing canonical lesson ids or
  routes.

# Foundations 1.1–1.6 Pedagogical Audit Addendum — 2026-08-02

This addendum reopens the same Chapter 1 plan for a page-level review of every
theory page, illustration, and quiz in nodes 1.1–1.6. It does not authorize
lesson implementation until the requester explicitly approves this checkpoint.

## Goal

Make the first six nodes a short, dependable prerequisite path for
`1.7 Khởi nguồn và trực giác xác suất`, Bayes, and Naive Bayes:

```text
phép thử -> không gian mẫu -> biến cố -> quan hệ biến cố -> xác suất
  -> tần số/tần suất thực nghiệm -> xác suất có điều kiện
  -> quy tắc nhân -> phân hoạch -> xác suất toàn phần
```

Each page must answer one learner question, begin from a concrete problem or
example before introducing notation, and have one dominant explanatory focus:
an example, diagram, formula, or conclusion.

## Context and Baseline Read

- Audited all 29 current theory pages and 20 current quiz questions across the
  twelve MDX files for nodes 1.1–1.6 and their adjacent quiz nodes.
- Inspected every `ProbabilityChapterVisual` variant used by those pages and
  the four raster illustrations used by 1.1 and 1.5.
- Read the opening requirements of 1.7 and the Bayes/Naive Bayes lesson to
  identify which concepts must already be stable before the handoff.
- The canonical TOC already has the requested theory/quiz order and stable
  semantic ids. No route, id, locale, or architecture change is needed.
- The current worktree contains requester-owned, uncommitted Chapter 1 reorder
  work. Implementation must refine it in place and preserve unrelated edits.
- The Impeccable technical detector returned no findings for the Statistics
  renderer, and the current worktree passes `npm run typecheck`. The issues
  below are therefore primarily pedagogy, information hierarchy, and visual
  focus rather than a global component-quality failure.

## Audit Table

| Node | Main idea to teach | What already works | Problems, duplication, and missing knowledge | Quiz audit | Redesign? |
|---|---|---|---|---|---|
| **1.1 Phép thử, biến cố và không gian mẫu** | Starting from one die roll, distinguish the action, one observed outcome, the set of all possible outcomes, and an event as a subset. | The die is a familiar running example; the outcome/event distinction is mathematically correct; the first categorize quiz is a useful applied interaction. | Page 0 leaves all teaching to a visual; page 1 uses `\Omega` before defining it; page 2 uses `P(\Omega)` and `P(\varnothing)` before probability is taught; pages 1 and 3 repeat the sample-space/event distinction; the random-variable page is correct but not needed for the path into 1.7/Bayes; the foundations visual duplicates a four-column raster with four more cards. Missing: a brief learner problem and an explicit action -> outcome -> sample space -> event sequence in prose. | The delivery question introduces `f=70/100`, violating 1.4's ownership of relative frequency. Elementary-event and random-variable questions over-weight side concepts; replace them with outcome/sample-space/event distinctions. | **Yes, scoped.** Replace the duplicate raster-plus-cards foundations treatment with one responsive sequence, and remove probability values from the certain/impossible visual. Keep the useful die imagery and no global restyle. |
| **1.2 Quan hệ giữa các biến cố** | Treat events as sets and understand union, intersection, disjointness, and complement. | The union/intersection Venn treatment is clear; the die intersection example is concrete; the distinction between disjoint and complementary events is correct and important. | The node teaches independence using `P(B\mid A)` before 1.5, equiprobability before 1.3, the complement probability formula before probability rules, and partitions before multiplication/total probability. Ten pages dilute the core with set-law lists, repeated partition definitions, and three-case/nested-card diagrams. `Biến cố tổng/tích` and compressed `AB` terminology are less direct than union/intersection notation. Missing: one consistent pair of events carried through all relations. | The current quiz tests partition and independence in the wrong node; its union/intersection item mostly repeats theory wording. It does not test disjoint versus complement with a concrete sample space. | **Yes, scoped.** Retain the simple Venn primitives, but remove the three nested case cards and consolidate disjoint-versus-complement into one comparison. |
| **1.3 Định nghĩa và tính chất xác suất** | Explain what `P(A)` means, the minimal probability rules, and how to calculate with equally likely outcomes, complements, and unions. | The equally-likely condition on `m/n` is correctly stated; the card example and general addition rule are correct; the 0-to-1 probability scale is a good focal visual. | Page 0 prematurely previews empirical frequency; page 1 detours into combinatorics; page 2 points to old lesson number 1.5; page 3 uses a partition before its intended introduction and mixes `\overline A` with the chapter's standard `A^c`. The rules arrive as a list without first posing a problem. Missing: a small numeric example for complement and overlap/double-counting. | All three questions are formula or statement recall. Replace them with a card/die calculation, a valid-probability-model check, and an overlapping-events calculation. | **No component redesign.** Keep the probability scale; remove the redundant two-card “definitions” visual instead of replacing it. |
| **1.4 Tần số và xác suất thực nghiệm** | From repeated observations, distinguish count `m`, relative frequency `f_n(A)=m/n`, and theoretical probability `P(A)`. | The formula, finite-sample estimate warning, stable-condition caveat, and the observation -> count -> ratio visual are correct. The convergence visual supports the main intuition needed by 1.7. | The formula comes before a concrete calculation; `aka` and long parenthetical examples add noise. The histogram page introduces density and bar-plot distinctions that are not prerequisites for 1.7/Bayes and already belong to later descriptive-statistics material. Its three-panel visual creates a second lesson inside this node. Missing: one plain finite-data example and an explicit statement that more trials reduce random fluctuation but do not repair biased sampling. | The first question restates definitions, the second assesses peripheral histogram detail, and only the third checks the intended stability idea. Add calculation and interpretation questions instead. | **No new visual.** Keep the empirical-process and stability visuals; remove the histogram page/variant from this six-node path. |
| **1.5 Xác suất có điều kiện và quy tắc nhân** | Restrict attention to the cases where `B` holds, define `P(A\mid B)`, derive the multiplication rule, then distinguish dependent and independent repeated steps. | `P(A\mid B)=P(A\cap B)/P(B)` with `P(B)>0` is correct; the “new sample space is `B`” visual is strong; the with/without-replacement calculations are useful; the final warning that `P(A\mid B)` and `P(B\mid A)` differ is valuable. | The opening prior/posterior definitions are inaccurate and duplicate 1.8; observed coin frequency is incorrectly labelled posterior. Conditioning does not require that data have literally been collected or an event observed. The `AB` memory trick, slang derivation, and “same/fair actions” characterization of independence are misleading. Monty Hall uses Bayes and an unstated host tie-breaking policy before total probability; the smoking survey is long for the point being made. Independence currently appears prematurely in 1.2 instead of here after multiplication. | The quiz checks formula recall, replacement categories, and Monty Hall, but not an actual conditional calculation, multiplication-rule calculation, or the direction of the condition. | **No visual redesign.** Remove the prior/posterior raster from this node and retain the existing conditional visual; formulas and the replacement example can be the other page focal points. |
| **1.6 Công thức xác suất toàn phần** | Split the sample space into a partition, calculate the contribution from each branch with the multiplication rule, and sum the branches. | Both existing code-native visuals accurately show partitioned branches and their weighted sum; the formula is correct; the quiz correctly rejects equal-probability and independence as partition requirements. | The lesson assumes “hệ đầy đủ” was taught early in 1.2 instead of introducing it here after multiplication. It starts from terminology rather than a question, contains `Do A là hệ đầy đủ` instead of the family `{A_i}`, and never supplies numeric branch probabilities, so the learner cannot complete one worked calculation. Missing: a concrete weighted-sum result and an explicit bridge to Bayes' denominator. | Partition conditions and ordering are useful, but the formula question is direct recall. Replace it with a small numeric branch calculation with plausible weighting mistakes. | **No redesign.** Reuse `total` and `total-sum`; adjust only their local labels/data if required by the worked example. |

## Cross-node Decisions to Lock on Approval

- Preserve every theory lesson id, quiz lesson id, `MdxQuiz.id`, question id
  wherever the question remains, public route, locale, TOC order, and the
  typed-TOC -> catalog -> selector -> locale-MDX architecture.
- Keep six separate theory nodes and six adjacent quiz nodes. Page counts may
  change to remove off-path material; nodes must not be merged.
- Use one running die example across 1.1–1.3 where practical, then switch to
  finite observations in 1.4, subgroup/without-replacement examples in 1.5,
  and weather branches in 1.6.
- Use standard notation throughout: `\Omega`, `\varnothing`, `A^c`,
  `A\cup B`, `A\cap B`, and explicit intersections inside conditional/chain
  formulas. Do not teach `AB` as the primary notation.
- Node 1.4 is the sole formal owner of frequency `m`, relative frequency
  `f_n(A)=m/n`, finite-sample estimation, and stability under repeated trials.
  Remove the frequency calculation from the 1.1 quiz and do not duplicate the
  formula elsewhere in 1.1–1.6.
- Move equal-likelihood assumptions into 1.3, and introduce independence only
  in 1.5 after conditional probability and multiplication.
- Introduce pairwise-disjoint coverage as a **partition** in 1.6, after the
  multiplication rule. Remove the early complete-system treatment from 1.2
  and the partition identity from 1.3.
- Keep prior, likelihood, and posterior definitions in 1.8. Node 1.5 teaches
  conditioning, not Bayesian updating.
- Remove the histogram/density/bar-plot detour from 1.4; Chapter 3 already owns
  histogram interpretation in the descriptive-data sequence.
- Preserve wording that is already correct and clear. Rewrite only passages
  needed to fix correctness, dependency order, focus, or unnecessary length.
- Use bold only for short terms, not full explanatory sentences or paragraphs.
  Prefer white/transparent reading space, spacing, and typography over new
  cards, borders, dividers, or colored backgrounds.

## Proposed Page Flow

### 1.1 — 4 theory pages, 4 quiz pages

| Page | Learner question and focal point |
|---|---|
| 1 | **What is repeated and what is observed?** Brief with one die roll, then define the experiment and one outcome. Focal point: responsive action -> observed outcome sequence. |
| 2 | **What could have happened?** Build `\Omega={1,2,3,4,5,6}` from all possible die outcomes. Focal point: sample-space diagram. |
| 3 | **Which outcomes answer the question?** Define event `A\subseteq\Omega` using “even face”; keep elementary events as one short note, not a separate page. Focal point: highlighted subset. |
| 4 | **Can an event be certain, impossible, or neither?** Compare `\Omega`, `\varnothing`, and an ordinary event without using probability values yet. Focal point: one three-way classification. |

Quiz coverage: classify experiment/outcome/sample space/event; choose the sample
space that matches what is recorded; identify an event as a subset; classify
certain/impossible/random events. No frequency formula and no random-variable
question.

### 1.2 — 4 theory pages, 3 quiz pages

Use the same die events throughout:
`A={2,4,6}` (“even”) and `B={5,6}` (“greater than 4”).

| Page | Learner question and focal point |
|---|---|
| 1 | **When does “A or B” occur?** Brief from the two event lists, then union and `A\cup B={2,4,5,6}`. Focal point: union Venn/die outcomes. |
| 2 | **When do both occur?** Derive `A\cap B={6}`. Focal point: intersection Venn. |
| 3 | **What if the events cannot occur together?** Contrast an overlapping pair with a disjoint pair and define `A\cap B=\varnothing`. Focal point: one comparison, not three nested cards. |
| 4 | **Why is a complement stronger than merely disjoint?** Define `A^c=\Omega\setminus A`, then show that `A` and `A^c` are disjoint **and** cover `\Omega`. Focal point: disjoint versus complement comparison; no probability formula. |

Quiz coverage: compute union/intersection from concrete sets; identify whether a
pair is overlapping or disjoint; distinguish a true complement from an
arbitrary disjoint event. Partition and independence questions leave this node.

### 1.3 — 5 theory pages, 4 quiz pages

| Page | Learner question and focal point |
|---|---|
| 1 | **How likely is the event?** Brief with “roll an even face,” define `P(A)` as a number from 0 to 1, and interpret the endpoints. Focal point: probability scale. |
| 2 | **What makes a valid probability model?** State non-negativity, `P(\Omega)=1`, and additivity for disjoint events in plain language before notation. Focal point: three compact rules. |
| 3 | **When may we count favorable outcomes?** Introduce equal likelihood, then derive `P(A)=m/n` for the ideal die/card example and state the required assumption. Focal point: one worked count. |
| 4 | **How do we calculate the opposite event?** Use `P(A^c)=1-P(A)` on a concrete die event. Focal point: complement formula plus one number. |
| 5 | **Why subtract the overlap?** Build `P(A\cup B)=P(A)+P(B)-P(A\cap B)` from two overlapping die events. Focal point: double-counting diagram/formula. |

Quiz coverage: one classical-probability calculation; one valid-model check;
one complement calculation; one overlapping-union calculation. Distractors
represent realistic denominator, complement, and double-counting errors rather
than arbitrary algebra.

### 1.4 — 2 theory pages, 3 quiz pages

| Page | Learner question and focal point |
|---|---|
| 1 | **What does the data say after repeated trials?** Start with a concrete count such as 7 on-time deliveries in 10, identify frequency `m`, then generalize to `f_n(A)=m/n` and distinguish the estimate from `P(A)`. Focal point: observation -> count -> ratio. |
| 2 | **Why repeat the experiment many times?** Show stability under independent repetitions in stable conditions, then state that more trials reduce random fluctuation but do not repair biased sampling or changing conditions. Focal point: convergence/stability visual and one conclusion. |

Quiz coverage: compute a relative frequency; interpret it as a finite-data
estimate rather than a guaranteed theoretical probability; choose which setup
supports meaningful stability and which remains biased.

### 1.5 — 5 theory pages, 4 quiz pages

| Page | Learner question and focal point |
|---|---|
| 1 | **Does the answer change inside a subgroup?** Brief with a small pass/fail and studied/not-studied table; compare the overall proportion with the proportion among students who studied. Focal point: concrete subgroup table, before notation. |
| 2 | **How is conditional probability calculated?** Treat `B` as the new sample space and derive `P(A\mid B)=P(A\cap B)/P(B)`, `P(B)>0`. Focal point: existing conditional visual and formula. |
| 3 | **How do we find the probability that both steps happen?** Rearrange the definition to `P(A\cap B)=P(B)P(A\mid B)=P(A)P(B\mid A)`; extend to a clearly notated chain only after the two-event rule is secure. Focal point: multiplication formula. |
| 4 | **When does the second step change?** Compare drawing with and without replacement; define independence via `P(B\mid A)=P(B)` and then obtain `P(A\cap B)=P(A)P(B)`. Focal point: paired numeric example. |
| 5 | **Why does the order after the bar matter?** Contrast `P(A\mid B)` with `P(B\mid A)` using the same subgroup table while noting `A\cap B=B\cap A`. Focal point: one side-by-side conclusion. |

Quiz coverage: calculate a conditional probability from a table; choose and
evaluate the multiplication rule for a without-replacement case; distinguish
independent from dependent setups; distinguish the two directions of a
conditional probability. Remove Monty Hall from this prerequisite quiz.

### 1.6 — 3 theory pages, 3 quiz pages

| Page | Learner question and focal point |
|---|---|
| 1 | **How can we handle several possible cases?** Brief with unknown weather, then define a partition as pairwise disjoint branches whose union is `\Omega`. Focal point: existing partition visual. |
| 2 | **How does each branch contribute to `H`?** Decompose `H` into disjoint pieces `H\cap A_i` and use the multiplication rule on each piece to derive the finite total-probability formula. Focal point: derivation/formula. |
| 3 | **What number do we get?** Supply branch probabilities and conditional tennis probabilities, calculate the weighted sum numerically, then generalize to `\sum_i P(A_i)P(H\mid A_i)`. End with the exact bridge: Bayes will use this sum as the normalizing probability of observed evidence. Focal point: existing weighted-sum visual. |

Quiz coverage: choose a valid partition from concrete candidates; compute a
numeric weighted sum with plausible unweighted/product distractors; order the
partition -> branch probabilities -> weighted sum procedure.

## Expected Count and Documentation Impact

- Proposed theory count for 1.1–1.6: 23 pages instead of 29.
- Proposed adjacent quiz count for 1.1–1.6: 21 questions/pages instead of 20.
- Net Chapter 1 reduction: five pages, subject to exact post-edit MDX count
  validation.
- Update the locked Statistics page-total assertion and the existing Learning
  Lab wiki counts after implementation. Also reconcile the wiki's current
  inconsistent `366` versus `362` Statistics page claims to the verified
  catalog/MDX total; do not create a new documentation page.

## Implementation Phases After Approval

1. **Dependency cleanup:** revise the six theory MDX files in order, removing
   random-variable, early partition/independence/prior-posterior, histogram,
   Monty Hall, and other off-path blocks while preserving good wording.
2. **Scoped visual pass:** update only the identified 1.1 and 1.2 visual
   variants, reuse the accepted 1.3–1.6 visuals, remove renderer branches and
   imports that become unused, and keep responsive/theme-aware contrast.
3. **Quiz realignment:** update the six quiz MDX files so every question maps
   to a taught page, uses plausible misconception-based distractors, and keeps
   stable quiz/question ids wherever the concept survives.
4. **Counts and docs:** update metadata headings/keywords/page counts, the
   exact MDX/page-count regressions, and the existing Learning Lab wiki.
5. **Verification:** run focused catalog and MDX tests, strict KaTeX rendering
   for every changed authored formula, `npm run typecheck`, `npm test`,
   `npm run build`, the aggregate `npm run verify`, the Impeccable detector on
   changed Statistics UI targets, stale-term/id/path searches, and
   `git diff --check`. Record exact results in this plan.

## Out of Scope for This Addendum

- Changing lesson ids, quiz ids, routes, aliases, locales, track/domain ids,
  or the Learning Lab catalog/content architecture.
- Merging 1.1–1.6 into a single lesson or redesigning 1.7–1.9.
- Rewriting wording that is already correct, direct, and well placed.
- Introducing probability simulations, new dependencies, or a new global
  design system.
- Redesigning shared Learning Lab surfaces or Statistics pages outside the
  exact visual variants identified by the audit.

## Approval Checkpoint

- 2026-08-02T03:16:26+07:00 — Completed the page, visual, formula, dependency,
  and quiz audit for nodes 1.1–1.6. Stored this addendum as draft. No lesson,
  quiz, renderer, catalog, test, or wiki implementation change was made during
  this checkpoint. Awaiting explicit requester approval.
- 2026-08-02T03:21:22+07:00 — Requester approved the plan with “approved
  plan”; marked the checkpoint executing and began the scoped implementation.
- 2026-08-02T03:41:02+07:00 — Completed the dependency cleanup across all six
  theory nodes and six adjacent quizzes. Nodes 1.1–1.6 now contain 23 focused
  theory pages and 21 quiz pages following experiment -> sample space -> event
  -> event relations -> probability -> empirical frequency -> conditional
  probability -> multiplication -> partition -> total probability. Removed the
  early random-variable, independence, partition, prior/posterior, histogram,
  and Monty Hall detours; retained relative-frequency notation and its formal
  interpretation only in 1.4.
- 2026-08-02T03:41:02+07:00 — Realigned quiz coverage around applied
  distinctions and calculations with misconception-based distractors while
  preserving every lesson id, quiz lesson id, MdxQuiz id, route, locale, TOC
  order, and Learning Lab architecture. Updated exact quiz-id and page-count
  regressions. Chapter 1 now has 43 theory pages and 32 quiz pages; the verified
  Statistics total is 361 pages, reflected in the existing Learning Lab wiki.
- 2026-08-02T03:41:02+07:00 — Applied the scoped Impeccable redesign only to
  the identified foundations, certainty, union, and intersection visuals.
  Removed duplicate raster/card treatments and probability labels that appeared
  before probability was introduced, kept accepted 1.3–1.6 visuals, and
  preserved responsive light/dark behavior. The Impeccable detector returned
  no findings.
- 2026-08-02T03:41:02+07:00 — Strict KaTeX rendering passed for all 256
  authored formulas in the twelve changed MDX files. Focused catalog/MDX tests
  passed 18/18; standalone npm test passed all 77 tests; standalone
  npm run build completed its 2,766-module production build; and npm run verify
  passed typecheck, all 77 tests, and the repeated 2,766-module build.
  Stale-term/ownership searches and git diff --check passed. The existing
  chunk-size warning remains non-blocking. Plan marked done.

# Foundations 1.1–1.6 Applied Quiz and Empirical-Frequency Focus Addendum — 2026-08-02

This addendum reopens the same Chapter 1 plan for a second theory/quiz
inspection, an application-oriented quiz pass based on the requester's
examples, and one narrowly scoped redesign of
“Từ số lần xuất hiện đến tần suất.”

## Second Audit Result

The dependency chain and the main idea of every theory page are now clear.
Quiz quantity is also sufficient: the current 21 questions cover every main
idea across the 23 theory pages. The remaining issues are transfer quality and
one example/visual mismatch, not missing prerequisite content.

| Node | Theory clarity | Quiz coverage | Minimal follow-up |
|---|---|---|---|
| **1.1** | Clear progression from experiment to outcome, sample space, event, then event type. The statement that the sample space must match what the experiment records is correct. | All four ideas are covered, but every question stays in the same die context as the lesson and therefore permits near recall. | Keep the four-question count and concepts; move prompts to handwritten-image, churn-record, and multi-label image scenarios without introducing random-variable notation. |
| **1.2** | Union, intersection, disjointness, and complement are separately explained. One example is poorly chosen: A={2,4,6} and C={1,3,5} are complements, yet the page is trying to establish that disjoint events need not cover the sample space. | All four ideas are covered in three questions, but all three reuse explicit die sets from theory. | Change the disjoint example to C={1,3} so it leaves outcome 5 uncovered. Reframe the quiz around blurred/underexposed images and mutually exclusive single-label outputs. |
| **1.3** | Probability scale, valid-model rules, equal-likelihood counting, complement, and overlap correction are clear and correctly ordered. | Coverage is complete, but the classical and addition questions remain generic or close to the worked examples. | Use equal-probability model labels for classical probability and blurred/underexposed image counts for the addition rule. Keep the valid-model and complement checks. |
| **1.4** | The mathematics and finite-sample warning are correct. Page 1 is hard to focus because prose bullets, a three-stage diagram, a generic formula, and a note all repeat the same count-to-ratio story with equal visual weight. | Calculation, finite-estimate interpretation, and sampling stability are all covered. The contexts can transfer more directly to model evaluation. | Distill Page 1 around one observation row and one concrete calculation. Use the 170/200 image-classification example in the quiz while retaining the estimate and sampling-bias questions. |
| **1.5** | Subgroup restriction, conditional formula, multiplication, independence, and condition direction are clear. | Coverage is complete. The current examples test the mechanics but not the common confusion between an unconditional denominator, a conditional denominator, disjointness, and independence. | Adapt the delivery example to contrast 70/100 with 70/90, and add the one-label cat/dog case to the existing independence/dependence classification. |
| **1.6** | Partition, branch contribution, weighted sum, and Bayes bridge are clear and complete. | All three main ideas are covered. | Reframe the partition question with the three-label sentiment classifier; keep the numeric weighted-sum and ordering questions. |

## How the Supplied Questions Will Be Used

- The handwritten-digit and churn examples will be adapted to experiment,
  outcome, sample space, and event questions in 1.1.
- The notation Y and its value set will **not** be introduced in 1.1. A random
  variable is a separate concept not taught in the approved prerequisite path;
  asking about it in the quiz would violate theory-before-quiz ordering. The
  same scenarios can test events directly as subsets of selected images or
  customers.
- The omitted-cancelled-order example will move to 1.5, where the learner can
  correctly distinguish P(on time) from P(on time | completed).
- Blur/underexposure union and intersection, and Spam/Advertising/Normal
  complement distinctions, will be used in 1.2.
- The one-label cat/dog independence question belongs in 1.5, after
  independence has been defined, not in 1.2.
- The three-label sentiment “complete system” question belongs in 1.6, where
  the chapter formally introduces a partition.
- The four-label random guess belongs in 1.3. It will use
  |A|/|Omega|, not empirical m/n, so 1.4 remains the sole owner of the
  relative-frequency formula.
- The 170/200 test-set accuracy example belongs in 1.4 and will explicitly
  remain a finite-sample estimate rather than a guaranteed future probability.

## Scoped 1.4 Redesign Direction

Impeccable distill applies only to Page 1 of node 1.4 and its existing
EmpiricalVisual.

- **One purpose:** show how ten observations become the relative frequency
  f_10(A)=4/10=0.4.
- Replace the current three-column observation -> count -> formula layout with
  one calm vertical reading path: a row/grid of ten observations with four
  highlighted, followed by one dominant numeric equation.
- Keep only one accent color plus theme neutrals. Remove stage icons, internal
  dividers, repeated arrows, and card-like formula treatments.
- Shorten the MDX lead-in so it briefs the need for a comparable ratio before
  the visual. Define m, n, and the general formula once after the concrete
  calculation.
- Replace the bordered LessonNote with one concise concluding sentence:
  finite-data f_n(A) estimates P(A) but is not identical to the theoretical
  probability.
- Preserve white/transparent space, KaTeX, semantic labels, mobile wrapping,
  dark-mode contrast, reduced visual nesting, and the existing component/API
  boundary. No other lesson page is redesigned.

## Scoped 1.1 Sample-Space Cleanup

Apply the requester's screenshot feedback only to the “Không gian mẫu” page:

- Flatten SampleSpaceVisual to one visual layer by removing the enclosing
  VisualSurface treatment and the inner dashed border. Keep the six outcome
  tiles, heading, semantic label, responsive grid, and light/dark contrast.
- Remove the redundant sentence “Nếu phép thử ghi nhận số chấm của một con xúc
  xắc sáu mặt, ta có” and its separate display formula
  Omega={1,2,3,4,5,6} from the MDX. The visual already communicates the same
  set directly.
- Keep the final sentence explaining that the sample space must match what the
  experiment records; that is the page's necessary generalization beyond the
  die example.

## Quiz Changes

Keep 21 questions and all lesson/quiz ids, routes, locales, modes, and
architecture unchanged. Preserve current question ids where the assessed
concept remains the same.

1. **1.1:** handwritten-image concept classification; complete non-overlapping
   cat/dog sample space; churn event as a subset; certain/impossible/random
   classification.
2. **1.2:** blur/underexposure union and intersection; mutually exclusive
   one-label outputs; Spam versus Advertising as disjoint but not complementary.
3. **1.3:** four equally likely labels; valid probability model; complement;
   blurred-or-underexposed image count with overlap removed once.
4. **1.4:** model accuracy 170/200; finite-test-set interpretation;
   representative sampling/stable conditions.
5. **1.5:** on-time among completed orders; multiplication without replacement;
   independent/dependent situations including one-label cat/dog outputs;
   condition direction.
6. **1.6:** sentiment-label partition; numeric total probability; application
   order.

Distractors will encode the actual mistakes exposed by the supplied examples:
confusing an outcome with a label set, omitting a valid elementary outcome,
equating disjoint with complement or independence, counting an overlap twice,
using the wrong conditional denominator, treating empirical accuracy as a
guarantee, and averaging conditional rates without branch weights.

## Implementation and Verification

1. Correct the single 1.2 disjoint-example mismatch and make no other theory
   rewrite unless implementation reveals an actual accuracy problem.
2. Apply the scoped 1.1 sample-space flattening and distill only the first 1.4
   page and EmpiricalVisual; load the Impeccable craft floor immediately before
   these UI edits.
3. Rewrite quiz scenarios in place, retaining counts and stable ids where
   possible; update exact regression expectations only if an id genuinely must
   change.
4. Strict-render every changed formula through KaTeX; run the Impeccable
   detector, focused catalog/MDX tests, typecheck, all tests, production build,
   aggregate verify, stale-term/ownership searches, and git diff --check.
   No browser runner or Playwright dependency is currently installed, so this
   pass will not add a new dependency solely for screenshots.
5. Record exact modifications and verification evidence here. Counts and
   architecture should remain unchanged, so the Learning Lab wiki requires no
   update unless verification finds drift.

## Out of Scope

- Adding a random-variable lesson or testing Y before it is taught.
- Increasing quiz count, changing lesson/quiz routes, or moving concepts back
  to earlier nodes.
- Redesigning the second 1.4 page or any page outside the named 1.1
  sample-space and first 1.4 pages.
- New image assets, simulations, dependencies, shared Learning Lab changes, or
  a broader visual-system redesign.

## Approval Checkpoint

- 2026-08-02T03:44:44+07:00 — Re-audited all 23 theory pages and 21 quiz
  questions, mapped the supplied application examples to the first node where
  each concept is taught, and stored this addendum as draft. No lesson, quiz,
  renderer, test, or wiki implementation file was changed. Awaiting explicit
  requester approval.
- 2026-08-02T03:57:40+07:00 — Added the requester-specified sample-space
  cleanup: remove the double enclosing frame and the repeated prose/display
  formula while retaining the six outcomes and the general recording-rule
  conclusion. The plan remains draft; no implementation file was changed.
- 2026-08-02T04:22:17+07:00 — The requester repeated the isolated
  sample-space cleanup, so it was executed as a small self-contained
  refinement without treating it as approval for the remaining addendum.
  Removed the outer VisualSurface and dashed frame, deleted the repeated
  sentence/display formula, and retained the accessible six-outcome grid plus
  recording-rule conclusion. The Impeccable detector returned no findings;
  focused catalog/MDX tests passed 18/18, typecheck passed, and git diff
  --check passed. The broader quiz and 1.4 work remains draft.
- 2026-08-02T04:23:32+07:00 — Clarified the transition from sample space to
  event on the next page: “even/odd” are outcomes when that is all the
  experiment records, but with exact die faces as outcomes, {2,4,6} is a
  selected subset and therefore an event rather than a new sample space.
  Strict KaTeX rendered all 11 formulas in the lesson, focused MDX validation
  passed 11/11, and git diff --check passed. The remaining addendum stays
  draft.
- 2026-08-02T10:46:46+07:00 — Smoothed the same transition after the requester
  found the first revision repetitive. The sample-space page now ends by
  selecting die outcomes 2, 4, and 6; the event page immediately names that
  selected set as an event, without re-explaining the experiment, recording
  rule, or full sample space. Strict KaTeX rendered all 10 formulas, focused
  MDX validation passed 11/11, and git diff --check passed. The remaining
  addendum stays draft.
- 2026-08-02T10:48:37+07:00 — Adjusted the transition to the requester's exact
  question-and-answer structure. The sample-space page now states that
  {2,4,6} is not the sample space of the current experiment and asks what the
  set is called; the next page answers “an event” before defining it. Strict
  KaTeX rendered all 11 formulas, focused MDX validation passed 11/11, and git
  diff --check passed. The remaining addendum stays draft.
- 2026-08-02T10:53:11+07:00 — Requester explicitly asked to execute the
  planned redesign of “Từ số lần xuất hiện đến tần suất.” Marked the plan
  executing for this approved scoped phase only; application-oriented quiz
  changes remain unapproved and will not be implemented in this phase.
- 2026-08-02T10:57:00+07:00 — Completed the approved redesign of “Từ số lần
  xuất hiện đến tần suất.” Condensed the introduction around one delivery
  example and replaced the nested three-stage card with ten observable marks,
  four highlighted occurrences, and one dominant equation
  `f_10(A) = 4/10 = 0.4`. Removed the redundant note and unused visual icons.
  Strict KaTeX rendered all 12 formulas; focused catalog/MDX tests passed
  18/18; the Impeccable detector returned no findings; and `npm run verify`
  passed TypeScript, all 77 tests, and the 2,766-module production build.
  `git diff --check` passed. Restored the plan to draft because the separate
  application-oriented quiz proposals remain unapproved and unimplemented.

# Execution Log

## Notion reconciliation addendum — 2026-08-02

The requester asked to compare the published Probability material with the
latest revision of
[`(1) Probability & Statistics - Nền tảng xác suất`](https://app.notion.com/p/3af7befbd94881029d0ac1b839b25c55),
correct the web lesson wherever it is inaccurate, and keep whichever source
has the clearer explanation or stronger illustration. This is a maintenance
pass over the same Chapter 1 source of truth, so it reopens this canonical plan
instead of creating another planning surface.

### Context read

- The Notion page was fetched on 2026-08-02 and maps to theory lessons 1.1–1.5
  plus their adjacent quizzes; it links to a separate Part 2 for conditional
  probability and Bayes.
- The current site preserves much of an older, conversational revision. Its
  responsive code-native diagrams are generally more legible than fixed
  screenshots, but several prose passages and examples are less precise than
  the latest Notion revision.
- Independent academic references confirm the latest source's distinctions:
  an outcome is an element of the sample space, an event is a subset, a random
  variable maps outcomes to numbers, empirical relative frequency estimates a
  probability from finite data, and density-histogram area—not necessarily bar
  height—sums to one.
- The current branch is clean and remains on `feat/add-statistics-domain`.

### Decisions (locked after approval)

- Limit this pass to lessons 1.1–1.5, their five adjacent quiz nodes, and the
  existing Statistics renderer/assets only where those pages require a visual
  correction. Lessons 1.6–1.9 are out of scope because they belong to the
  separately linked Notion Part 2.
- Preserve canonical ids, routes, lesson ordering, page counts, KaTeX
  rendering, and the current theory/quiz alternation.
- Correct the history to the seventeenth-century / 1654 Pascal–Fermat context
  instead of “about 300 years ago.”
- Use the clearer outcome → sample space → event distinction and explicitly
  separate a random variable's support from the sample space.
- Remove or rewrite claims that are false without additional assumptions,
  including treating `{chẵn, lẻ}` as an intrinsically invalid sample space,
  describing a complement as “larger” than an exclusive event, and using the
  ambiguous breakfast example as proof of pairwise exclusivity.
- Prefer standard set notation `\cup`, `\cap`, and complements in instructional
  formulas; avoid presenting `A+B` and `AB` as the primary notation.
- Replace the misleading “two schools / three schools” framing with the
  formal probability properties and a direct comparison between classical
  probability and empirical relative frequency.
- State that finite-sample relative frequency is an estimate of probability,
  not the theoretical probability itself. Retain the current correct
  histogram distinction among count, relative-frequency, and density scales.
- Keep the current responsive, accessible code-native diagrams when they
  communicate the concept better than the Notion raster. Import a Notion image
  only if it is inspectable, materially clearer, source-appropriate, and can be
  stored locally; do not embed expiring signed URLs. Retain the existing
  historical artwork where it remains stronger than a generated illustration.
- Update quiz wording or examples only where necessary to match the corrected
  theory and eliminate ambiguity; do not expand the quiz/page count.

### Phases

1. Reconcile the five theory lessons and quizzes claim by claim against the
   latest Notion page and the academic references already collected.
2. Apply the smallest MDX/component/asset changes that make the content correct
   and clearer while preserving the current visual language and behavior.
3. Run focused MDX/catalog checks, strict formula rendering where relevant,
   `npm run verify`, and `git diff --check`.
4. Record the exact modifications and verification results in this plan;
   update the Learning Lab wiki only if a current-state claim changes.

### Approval checkpoint

- 2026-08-02T01:14:00+07:00 — Reconciliation audit completed and addendum
  stored as draft. Awaiting requester approval before lesson implementation.
- 2026-08-02T01:17:00+07:00 — Requester approved the reconciliation addendum;
  plan marked executing and lesson implementation started.
- 2026-08-02T01:24:52+07:00 — Reconciled lessons 1.1–1.5 with the latest
  Notion revision. Corrected the Pascal–Fermat timeline, outcome/event/sample
  space and random-variable distinctions, complement and pairwise-exclusive
  examples, standard set notation, empirical-frequency interpretation, and
  histogram wording. Replaced the ambiguous die sample-space quiz with the
  complete delivery-outcome scenario while preserving every lesson and quiz
  page count.
- 2026-08-02T01:24:52+07:00 — Retained the existing historical artwork and
  responsive code-native diagrams because they remain clearer and stable at
  runtime; no expiring Notion image URL was imported. Removed the now-unused
  statistical-schools and raffle renderer branches after their misleading or
  redundant lesson blocks were removed.
- 2026-08-02T01:24:52+07:00 — Updated the locked quiz-id regression. Focused
  MDX validation passed 11/11; `npm run verify` passed TypeScript, all 77 tests,
  and the 2,769-module production build. `git diff --check` passed. The existing
  chunk-size warning remains non-blocking. No Learning Lab wiki update was
  required because routes, catalog counts, page counts, and architecture did
  not change; plan marked done.

- 2026-07-30T01:52:39+07:00 - Read the complete 1,247-line attachment,
  inspected the current nine-lesson Chapter 1, catalog alias contract, exact
  Statistics page-count tests, and active wiki claims. Stored this draft plan
  as the task's first write.
- 2026-07-30T01:53:27+07:00 - Requester expanded the scope to rename the domain.
  Added localized display-name and description changes while explicitly
  preserving the canonical `statistics` domain id and routes.
- 2026-07-30T01:55:09+07:00 - Requester explicitly approved the expanded plan;
  approval was recorded and execution started.
- 2026-07-30T02:06:30+07:00 - Renamed the localized domain display title to
  `Probability & Statistics` / `Xác suất & Thống kê` while preserving the
  canonical `statistics` id. Replaced track `introduction` with `probability`
  and updated its localized scope description.
- 2026-07-30T02:06:30+07:00 - Deleted the nine superseded Chapter 1 MDX files
  and authored nine canonical Probability lessons with 32 contiguous pages.
  The chapter now covers probability origins, experiments/events/sample
  spaces, event algebra, probability axioms, empirical probability,
  conditioning, total probability, Bayes, Naive Bayes, and checked exercises.
  Content was written from scratch; missing images, copied prose, slang, links,
  and inaccurate reference formulas were not retained.
- 2026-07-30T02:06:30+07:00 - Reused the existing `MdxCode` primitive for
  readable formula blocks rather than adding a Statistics-only renderer.
  Corrected the random-variable definition, conditional-probability formula,
  histogram interpretation, partition requirements, Bayes denominator,
  conditional-independence statement, and exercise arithmetic.
- 2026-07-30T02:06:30+07:00 - Added one legacy track alias and nine positional
  lesson aliases; the repository now has 17 validated route aliases. Updated
  catalog coverage for the localized domain title, canonical Probability
  track, and old-to-new lesson resolution.
- 2026-07-30T02:06:30+07:00 - Updated the locked Statistics page total from 265
  to 285 and revised the Learning Lab wiki to distinguish the original 32-page
  Probability chapter from the 253 ISLP-derived pages in Chapters 2–13.
- 2026-07-30T02:06:30+07:00 - Focused catalog tests passed 7/7, focused MDX
  tests passed 11/11, and `npm run verify` passed TypeScript, all 77 tests, and
  the 2,728-module production build. `git diff --check` passed. Final audits
  confirmed exactly nine new Chapter 1 MDX files, old ids only in aliases and
  their regression test, and no source placeholders, copied-note markers, raw
  LaTeX, or stray non-Vietnamese characters in the new chapter.
- 2026-07-30T02:12:08+07:00 - Requester clarified that valid source wording,
  including notes, examples, and informal voice, must be retained, and that all
  formulas and mathematical symbols must render with KaTeX. Reopened this
  checkpoint as a draft, superseded the original-prose boundary, expanded the
  locked layout to 40 pages / 293 Statistics pages, and scoped one shared
  `MdxFormula` component plus its contract coverage. Awaiting approval before
  implementation.
- 2026-07-30T02:13:19+07:00 - Requester explicitly approved the verbatim and
  KaTeX addendum. Marked the checkpoint approved and started implementation.
- 2026-07-30T02:24:10+07:00 - Added shared `MdxFormula` support to the generic
  MDX contract and renderer, backed by KaTeX with inline and display modes,
  theme-aware styling, horizontal overflow handling, and accessible formula
  labels. Updated the exact shared-component allowlist regression.
- 2026-07-30T02:24:10+07:00 - Replaced all nine Chapter 1 lesson bodies with
  the supplied Vietnamese wording, voice, notes, examples, and exercises across
  40 contiguous pages. Removed missing-image markers, empty Notion wrappers,
  and bare video links. Limited prose changes to MDX structure and corrections
  for random variables, set notation, histogram modes, conditioning, total
  probability, Bayes denominators, conditional independence, numerical
  underflow, smoothing, and exercise arithmetic.
- 2026-07-30T02:24:10+07:00 - Converted 306 inline/display formulas and
  mathematical symbols to `MdxFormula`; Chapter 1 contains no raw dollar-delimited
  TeX or `MdxCode` formula blocks. Updated the locked Statistics total to 293
  pages and documented the retained-wording/KaTeX boundary in the Learning Lab
  wiki.
- 2026-07-30T02:24:10+07:00 - Focused MDX validation passed, TypeScript passed,
  and `npm run verify` passed all 77 tests plus the 2,728-module production
  build. `git diff --check` and stale-artifact audits passed. The existing Vite
  warning for chunks larger than 1,000 kB remains non-blocking.
- 2026-07-30T02:27:33+07:00 - Added the requester-supplied Méré illustration
  as the local asset
  `src/assets/learning/statistics/ch01-probability/01-statistics-probability-origins-mere-gambling-scene.jpg`
  and placed
  it before the spelling note on page 1 of the probability-origins lesson.
  Added a responsive, lazy-loaded renderer for standard Markdown images in the
  shared MDX map. Focused MDX tests passed 11/11, TypeScript passed, and
  `git diff --check` passed.
- 2026-07-30T03:27:55+07:00 - Requester asked for a complete Chapter 1 visual
  redesign and one adjacent Quiz node per theory lesson while preserving the
  Vietnamese wording and existing architecture. Audited the current dirty
  worktree and found nine adjacent three-page Quiz nodes, KaTeX-aware quiz
  rendering, and an extended `ProbabilityChapterVisual` already in progress.
  Reopened this existing checkpoint as a draft with the visual/quiz addendum;
  no source implementation files were changed during this audit.
- 2026-07-30T03:28:50+07:00 - Requester explicitly approved the Chapter 1
  visual and quiz addendum.
- 2026-07-30T03:41:28+07:00 - Completed the Chapter 1 hierarchy and
  full-width audit across 40 theory pages and 27 quiz pages. All theory pages
  now have a concept-appropriate image, diagram, formula, or table as their
  primary visual focus; paragraphs, blockquotes, and notes stretch across the
  reading region while media, formulas, diagrams, and tables retain bounded or
  horizontally scrollable layouts.
- 2026-07-30T03:41:28+07:00 - Extended `ProbabilityChapterVisual` to fifteen
  domain-specific variants, adding dedicated histogram, independent/dependent,
  equiprobable, and prior-to-posterior diagrams while retaining suitable
  existing designs. The variants use responsive layout changes and
  theme-aware light/dark contrast without a parallel renderer architecture.
- 2026-07-30T03:41:28+07:00 - Retained the nine adjacent `Quiz` nodes and their
  27 one-question pages across `single`, `multi`, `order`, and `categorize`
  modes. Extended shared quiz rich-text rendering so math in prompts, answers,
  drag labels, category labels, and feedback is KaTeX-backed, added a tap
  fallback for categorize interactions on touch layouts, and corrected the
  dark selected-state contrast.
- 2026-07-30T03:41:28+07:00 - Strict-rendered 398 authored Chapter 1 and quiz
  formulas through KaTeX without a syntax failure. `npm run typecheck` passed;
  focused catalog and MDX tests passed 2/2; `npm run verify` exited 0 with all
  77 tests and the 2,738-module production build passing. `git diff --check`
  passed. The existing warning for chunks larger than 1,000 kB remains
  non-blocking.
- 2026-08-02T03:05:55+07:00 - Reordered Chapter 1 into the approved dependency
  sequence: experiments, event relations, probability definitions, empirical
  probability, conditional probability, total probability, origins and
  intuition, Bayes/Naive Bayes, then exercises. Renamed the first seven theory
  and quiz MDX filename prefixes and updated localized numeric titles while
  preserving every canonical id and route.
- 2026-08-02T03:05:55+07:00 - Removed formula-level relative-frequency teaching
  from the intuition lesson so the empirical-probability lesson remains its
  formal owner. Added a fifth intuition quiz question covering why one-off
  events require data, a model, and current evidence before the transition to
  Bayesian reasoning.
- 2026-08-02T03:05:55+07:00 - Updated the catalog order regression, MDX quiz
  contract, exact Statistics page total, and Learning Lab wiki. The Impeccable
  detector returned no findings; `npm run verify` passed TypeScript, all 77
  tests, and the 2,769-module production build. `git diff --check` passed. The
  existing bundle-size warning remains non-blocking.
- 2026-08-02T11:35:20+07:00 - Requester accepted the current lesson state and
  asked for final cleanup and commit. Removed 11 unauthored
  `ProbabilityChapterVisual` variants and their renderer branches, along with
  now-unused helpers and icon/image imports. Deleted five superseded Chapter 1
  image assets after confirming that no source, documentation, or wiki page
  referenced them. Every declared visual kind now has an authored MDX caller,
  and no authored kind is missing from the renderer contract. The Impeccable
  detector returned no findings; `npm run verify` passed TypeScript, all 77
  tests, and the 2,764-module production build; `git diff --check` passed. The
  optional application-oriented quiz proposals were not implemented and are
  closed as out of scope for this completed checkpoint.

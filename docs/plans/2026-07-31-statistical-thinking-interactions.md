---
title: Add Statistical Thinking Visuals and Interactions
status: done
created: 2026-07-31T19:16:33+07:00
updated: 2026-07-31T19:25:43+07:00
author: Codex
task: "Add the three highest-priority illustrations and interactive exercises to the Introduction to Statistical Thinking lesson"
supersedes:
  - docs/plans/2026-07-31-statistics-foundational-unit.md
  - docs/plans/2026-07-31-pure-applied-statistics-curriculum.md
---

# Goal

Make the existing Vietnamese-first `1.1 Tư duy thống kê, dữ liệu và suy luận`
lesson (`ch02-classical-statistics-fundamentals`) tangible through three
responsive, accessible, deterministic in-lesson interactions:

1. compare production-process variation;
2. observe how population sampling affects an estimate; and
3. distinguish the conclusions justified by retrospective, observational, and
   randomized experimental evidence.

Success preserves the lesson's canonical id, its four-page structure, the
Statistics catalog counts (100 published lessons / 333 pages), and the
Vietnamese-only authored-content contract. The interactions make the existing
concepts experiential; they do not create a parallel practice record or change
Review-mode membership.

# Lineage

Supersedes [Statistics Foundational Unit](./2026-07-31-statistics-foundational-unit.md),
which created the four-page source lesson later retitled into the Statistical
Thinking track, and [Pure Applied Statistics Curriculum Integration](./2026-07-31-pure-applied-statistics-curriculum.md),
which made that track the first applied-statistics core chapter. This is a
narrow content-and-renderer follow-up; it does not alter the curriculum
structure.

# Decisions (locked)

- Scope is the three high-priority experiences rather than the originally
  proposed full five-visual sequence. The linked-chart explorer and
  estimate-and-revise activity remain deferred to the forthcoming descriptive
  statistics and inference lesson groups, preventing duplicated ownership.
- Keep all work within the published existing lesson and its Statistics-domain
  MDX adapter. Do not add a new lesson node, route alias, `exercise` tag,
  Review entry, or catalog/localization payload.
- Retain the existing four `MdxPage` indexes and `pageCount: 4`; place each
  interaction beside its currently taught concept rather than increasing the
  locked Statistics page total.
- Reuse the existing `ProbabilityChapterVisual` MDX component as the
  Statistics domain's established visual gateway. Add three narrowly named
  `kind` values and renderer branches rather than renaming the public component
  or changing the shared MDX allowlist. Its historical name must not block
  broader Statistics visuals.
- All learner-facing authored content, controls, feedback, and accessible
  labels are Vietnamese. Other UI locales continue to use the existing
  available-locale fallback; no English Statistics MDX is added.
- Use fixed source data and deterministic sample sequences. A reset action must
  return every activity to its initial state; no network, Python, runtime
  randomness, or external chart dependency is introduced.
- Use semantic buttons, text-visible selection/feedback, keyboard-operable
  controls, and an appropriate polite live region for answer feedback. Do not
  encode correctness or data groups by color alone.
- Follow the existing Learning Lab semantic theme helpers and its light-only
  runtime convention. Keep the visual treatment within the single outer lesson
  panel rather than adding nested decorative-card stacks.

# Interaction Specification

## 1. Variation comparison — page 0

Add a compact engineering production-line illustration with two equal-size
batches of measured fill volumes or part diameters. Both batches share roughly
the same center, while one has visibly wider spread. The visual shows a
labeled dot plot, target/tolerance reference, and text summary of center and
spread.

The learner chooses which process is safer for a tight tolerance. After a
choice, display specific feedback: a similar mean does not imply similar
reliability; the less dispersed batch is the appropriate choice. Allow retry
and reset without altering the fixed observations.

## 2. Population-to-sample inference simulator — page 1

Add a visible chain from a finite population through a sampling frame and a
sample to a sample mean and a population estimate. Supply two modes:
`random sample` and an intentionally biased `convenience sample`. Drawing a
sample advances through a predefined sequence and appends its estimate to a
small history plot/list, making sampling variation visible without opaque
random behavior.

The simulator reveals the known population mean for comparison and explains
that repeated random samples vary but target the population, whereas the
convenience path can be systematically displaced. Reset clears the sample and
estimate history. It is an intuition builder, not a confidence-interval or
standard-error lesson.

## 3. Study design and justified claims — page 1

Follow the existing retrospective, observational, and designed-experiment
explanation with three concise scenario cards. For each scenario, learners
select the strongest warranted conclusion: description/association, or a
causal claim. Feedback identifies the data-collection method and explains why
random assignment supports causal evidence while observational patterns may
retain confounding.

The activity uses self-contained scenarios and does not claim that a single
example settles all study-design caveats. It supports retry/reset and reports
both correct/incorrect state in text.

# Phases

## Phase 0 — Approve this stored plan

- Obtain explicit requester approval before modifying runtime, MDX, tests, or
  wiki files.
- On approval, update this plan's status to `approved` and its `updated`
  timestamp, then mark it `executing` when implementation begins.

## Phase 1 — Extend the Statistics visual adapter

- In `src/components/learning/domains/statistics/mdxComponents.tsx`, extend
  `ProbabilityChapterVisualKind` and its dispatch function with the three
  Statistical Thinking kinds.
- Implement small local renderer components using the existing imports,
  semantic theme classes, and responsive DOM/SVG patterns already used by the
  adapter.
- Keep each renderer's state local and resettable; model source datasets,
  deterministic draw order, answer options, and explanation copy as readonly
  in-module data.
- Verify all controls have descriptive labels, selected states are visible
  beyond color, feedback is announced, and each interaction remains usable via
  keyboard alone.

## Phase 2 — Author the Vietnamese lesson integration

- Update `src/content/learning/statistics/2.0-ch02-classical-statistics-fundamentals.vi.mdx`
  only.
- Add each visual invocation and short Vietnamese setup/debrief beside its
  matching existing topic: variation on page 0; population/sample and study
  design on page 1.
- Refine page-0/page-1 prose only as needed to introduce the activities while
  retaining the current definitions and pages 2–3 descriptive-statistics and
  inference previews.
- Preserve the metadata identity, locale, title, page indexes, and
  `pageCount: 4`.

## Phase 3 — Regression coverage and documentation

- Add focused assertions to `src/lib/learningMdxContent.test.ts` that the
  canonical Statistical Thinking lesson remains Vietnamese, four pages, and
  contains the three approved visual kinds. Retain the existing generic MDX
  component and locked-count assertions.
- Update the existing `wiki/concepts/learning-lab.md` Statistics description
  and Statistics adapter file-map wording to note the three in-lesson
  Statistical Thinking interactions. Do not create a separate documentation
  page.
- Record the precise files changed, final page/count result, and verification
  results in this plan's execution log.

## Phase 4 — Verify

- Run `npm run typecheck` while iterating on the TypeScript renderer.
- Run the focused Learning Lab MDX test file with `npm test`; its existing
  generic validation covers component allowlists, locale ownership, page
  indexes, and Statistics counts.
- Manually inspect the lesson in the Learning Lab at desktop and compact
  widths: all controls work by mouse and keyboard, selection/feedback/reset
  work, feedback is readable, and no horizontal overflow or clipped plot is
  introduced.
- Run `npm run verify` and `git diff --check` before completion.

# Files expected to change

| Path | Change |
|---|---|
| `src/components/learning/domains/statistics/mdxComponents.tsx` | Three stateful, accessible visual/exercise renderers and their `ProbabilityChapterVisual` kinds. |
| `src/content/learning/statistics/2.0-ch02-classical-statistics-fundamentals.vi.mdx` | Vietnamese instructional framing and the three visual invocations on existing pages 0–1. |
| `src/lib/learningMdxContent.test.ts` | Focused regression assertions for the existing lesson's page count and visual kinds. |
| `wiki/concepts/learning-lab.md` | Concise active-architecture/content note for these Statistics interactions. |
| `docs/plans/2026-07-31-statistical-thinking-interactions.md` | Status transitions and execution log. |

# Out of scope

- New or renamed Statistics tracks, lessons, canonical routes, aliases, or
  catalog metadata.
- English Statistics MDX, changes to locale fallback, or content in
  `localization.ts`.
- The deferred linked-chart/descriptive-summary explorer, interval estimation,
  confidence-interval simulation, and Chapter 3/4 authored lessons.
- New dependencies, external data, generated images, Python/Pyodide work, or
  Canvas3D/Workspace changes.
- A general exercise engine, a parallel practice payload, or changing
  tag-derived Review behavior.
- A redesign or public rename of the existing Probability visual interface.

# Acceptance criteria

- The existing canonical lesson still has four ordered pages and remains the
  only published node in `statistical-thinking`.
- Each of the three interactions teaches its named concept, has explanatory
  feedback and reset behavior, and is keyboard-accessible with text-visible
  state.
- Fixed inputs produce reproducible initial and reset states; no external
  dependency or unbounded stochastic behavior is added.
- Statistics retains 100 Vietnamese published MDX files and 333 total authored
  pages; generic MDX validation accepts only the existing Statistics component
  gateway.
- `npm run verify` and `git diff --check` pass, and the lesson is manually
  checked at desktop and compact widths.

# Execution log

- 2026-07-31T19:25:43+07:00 — Added three deterministic Statistics-domain interactions to `ProbabilityChapterVisual`: production-line variation comparison with answer feedback, a fixed-sequence random-versus-convenience sampling simulator, and a three-scenario study-design claim classifier. Integrated them into pages 0–1 of the existing Vietnamese lesson while preserving its identity and four pages. Added source/page regression assertions and updated the existing Learning Lab wiki ownership note. `npm run typecheck`, `npm test` (77 passing), `npm run verify`, and `git diff --check` passed. No visual-browser tool is available in this harness, so a live desktop/compact viewport review was not performed.
- 2026-07-31T19:19:29+07:00 — Requester approved the stored plan in conversation.
- 2026-07-31T19:16:33+07:00 — Drafted after reviewing the existing four-page
  lesson, the typed Statistics TOC, the Statistics MDX adapter, Learning Lab
  ownership rules, and MDX/catalog regression coverage. No implementation,
  catalog, test, or wiki files changed.

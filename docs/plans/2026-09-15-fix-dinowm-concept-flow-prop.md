---
title: "Fix DINO-WM shared visual prop mismatches"
status: done
created: 2026-09-15T09:37:12+07:00
updated: 2026-09-23T21:12:00+07:00
author: pi
task: "Fix DINO-WM shared visual runtime crashes caused by mismatched ConceptFlow, EvidenceCards, and PaperTradeoff props"
supersedes:
  - docs/plans/2026-09-14-dino-wm-research-paper.md
---

# Goal

Prevent `ConceptFlow` from reading `.map` on `undefined` when rendering the
three affected DINO-WM lessons. All authored flow data must use the shared
component's existing `items` prop contract.

# Lineage

Follows [2026-09-14-dino-wm-research-paper](./2026-09-14-dino-wm-research-paper.md),
which introduced the affected DINO-WM MDX lessons.

# Decisions (locked)

- Keep `ConceptFlow`'s established `items` API unchanged.
- Rename only the incorrect MDX prop usages from `steps` to `items` in the
  DINO-WM abstract, method, and conclusion lessons.
- Preserve the authored flow data and layout; add an optional `subtitle` field
  to `ConceptFlowItem` and render it below the title.
- Keep the shared `EvidenceCards` API (`items` containing `eyebrow`, `value`,
  `label`, and `insight`) unchanged; convert DINO-WM cards to that shape.
- Replace DINO-WM `PaperTradeoff` row tables with `ComparisonMatrix`, whose
  row-based API matches the authored method/tradeoff data.
- Add regression assertions to the existing MDX content contract test without
  introducing a broader parser change.
- Keep `ExperimentChecklist`'s object item API (`title`, `action`, `check`)
  unchanged; convert the two DINO-WM checklist calls that currently pass
  strings.
- Render checklist `title`, `action`, and `check` values through the existing
  `renderContentWithMath` helper, allowing inline LaTeX delimiters (`$...$` or
  `\\(...\\)`) without changing the checklist data contract.
- Render `ConceptFlow` subtitles through the same inline math helper so authored
  formulas such as `$z_t \\sim enc_\\theta(o_t)$` display in the cards.

# Phases

## Phase 0 — Store this plan and get approval

Wait for explicit approval before modifying source or documentation files.

## Phase 1 — Apply the shared visual prop corrections

Status: approved; execution resumed after the user requested that this scope be
merged into the previous plan on 2026-09-15.

- Update the three DINO-WM `ConceptFlow` invocations that pass `steps` so they
  pass `items`.
- Convert the DINO-WM `EvidenceCards` calls to the shared `items` prop and
  required item fields.
- Replace DINO-WM `PaperTradeoff` row data with `ComparisonMatrix` tables.
- Convert the DINO-WM `ExperimentChecklist` string items into objects so the
  rendered title, action, and check text are populated.

## Phase 2 — Verify

Run the narrowest relevant MDX/content tests only; do not run `npm run verify`
per the user request. Confirm the diff is limited to the intended shared visual
prop corrections and regression coverage.

## Phase 3 — Record and document

Update this plan's status and execution log. Update existing Learning Lab
architecture documentation only if the fix reveals an inaccurate shared
component contract; do not create a new documentation page.

## Phase 4 — Rebase follow-up

Rebase `feat/add-dinowm-paper` onto `origin/main`, retaining the remote-only
DINO-WM hierarchy fix and combining the newer CV catalog additions with the
DINO-WM track. Resolve derived count conflicts, verify the full repository, and
leave publishing the rewritten branch out of scope.

# Out of scope

- Changes to the established `ConceptFlow` layout beyond displaying the
  optional subtitle.
- Reworking DINO-WM lesson prose or visual data beyond enabling subtitle output.
- Changes to unrelated Learning Lab components or routes.

# Execution log

- 2026-09-15 — Plan created after tracing the crash to `items.map` and finding
  three DINO-WM lessons using the stale `steps` prop.
- 2026-09-15 — User approved the plan; execution started.
- 2026-09-15 — Replaced the stale `steps` prop with `items` in the three
  affected DINO-WM lessons and added a regression assertion covering the
  shared `ConceptFlow` prop contract.
- 2026-09-15 — Focused MDX test passed (29/29); `npm run verify` passed
  (typecheck, full test suite, and production build); `git diff --check` passed.
- 2026-09-15 — User requested that the EvidenceCards and PaperTradeoff audit be
  merged into this plan and that full verification not be rerun; plan reopened
  for the additional focused corrections.
- 2026-09-15 — Converted DINO-WM EvidenceCards data to the shared item shape,
  replaced two invalid PaperTradeoff row tables with ComparisonMatrix, and
  expanded the mapped-visual regression assertions.
- 2026-09-15 — Focused MDX content test passed (29/29). Full `npm run verify`
  was intentionally not rerun per user request.
- 2026-09-15 — Found two additional DINO-WM `ExperimentChecklist` calls using
  string items even though the shared renderer expects `{ title, action, check }`;
  plan reopened to correct them.
- 2026-09-15 — Converted both DINO-WM checklist calls to structured objects so
  their title, action, and check text render correctly. Focused MDX content test
  passed (29/29); full verification was not run.
- 2026-09-15 — User asked whether symbols inside checklist boxes can use LaTeX;
  audit found the component currently renders checklist fields as plain text.
  Plan reopened to route those fields through the existing inline-math helper.
- 2026-09-15 — `ExperimentChecklist` now renders title, action, and check
  fields through `renderContentWithMath`; DINO-WM examples use inline LaTeX.
  Focused MDX content test passed (29/29); full verification was not run.
- 2026-09-15 — Follow-up found `ConceptFlow` silently ignores authored
  `subtitle` fields; plan reopened to add optional subtitle rendering.
- 2026-09-15 — Added optional `ConceptFlow.subtitle` rendering with inline math
  support and a regression assertion. Focused MDX content test passed (29/29);
  `git diff --check` passed; full verification was not run.
- 2026-09-15 — User requested that the authored DINO-WM formula subtitles use
  actual LaTeX delimiters now that subtitle math rendering is available.
- 2026-09-15 — Converted the DINO-WM model subtitles to inline LaTeX formulas
  (`\\sim`, `\\operatorname`, `\\mid`, and `\\hat`). Focused MDX content test
  passed (29/29); `git diff --check` passed.
- 2026-09-23 — User approved rebasing `feat/add-dinowm-paper` onto
  `origin/main`. Fast-forwarded the local branch to include the remote hierarchy
  fix, then rebased all three DINO-WM commits.
- 2026-09-23 — Resolved catalog conflicts by retaining both additions: 105
  tracks, 794 lesson nodes, 326 published lessons, 33 Research Papers lessons,
  and 14 CV lessons. `npm run check:catalog-stats`, `git diff --check`, and
  `npm run verify` passed (typecheck, 164 tests, production build).

---
title: Continual Learning Dedicated Reference Page
status: done
created: 2026-08-13T19:05:00+07:00
updated: 2026-08-13T19:25:00+07:00
author: Codex
task: "Move Sources and paper map onto a dedicated final page in every Continual Learning node"
supersedes:
  - docs/plans/2026-08-13-continual-learning-citations.md
---

# Goal

Make `Nguồn và bản đồ paper` the final standalone page of every current non-Quiz
Continual Learning node instead of appending it below the node's last authored
content page.

# Lineage

Supersedes [Continual Learning Citations and Paper Knowledge Layer](./2026-08-13-continual-learning-citations.md),
which created the lesson paper coverage and currently renders the reference
surface at the bottom of each final authored page.

# Decisions (locked)

- Keep every locale MDX `lessonMetadata.pageCount` as the authored-content page
  count. Do not edit 39 files or add an empty `MdxPage` to authored content.
- In the compiled lesson assembly, append one reference-only React page when a
  Continual Learning lesson has reference coverage.
- The runtime descriptor and pager count include this extra page. The final
  content page's Next action opens the references page; completing the node is
  available only from the references page.
- Preserve the current reference component, paper grouping, keyboard arrow
  navigation, scroll-to-top behavior, canonical route, locale fallback, and
  theory/Quiz concept contracts.
- Quiz nodes do not receive a reference page because they have no coverage entry.
- No new route, modal, TOC node, localization payload, or content metadata field.

# Phases

## Phase 0 — Store and approve

- Store this follow-up plan as the first write for the new behavior.
- Pause for explicit approval before editing runtime or tests.

## Phase 1 — Separate the runtime page

- Stop rendering `LessonReferences` inside the last authored page.
- Append a dedicated provider-wrapped references page after all authored pages.
- Return the actual combined page count from the lesson descriptor.

## Phase 2 — Contract tests and documentation

- Add a focused test proving a covered Continual Learning node receives exactly
  one final reference page while a Quiz/non-covered lesson does not.
- Update the existing Learning Lab wiki wording from "final page append" to
  "dedicated final reference page".
- Record the actual modifications in this plan.

## Phase 3 — Verification

- Run the focused Learning MDX tests, `npm run verify`, and `git diff --check`.
- Mark the plan done only when paging, tests, build, and docs agree.

# Acceptance criteria

- Every one of the 39 covered non-Quiz Continual Learning nodes has one additional
  final page containing only `Nguồn và bản đồ paper`.
- No reference list remains below an authored content page.
- Pager labels and keyboard navigation include the reference page.
- The final completion/next-node action appears on the reference page, not on the
  last authored content page.
- Quiz nodes and other Learning Lab domains retain their existing page counts.
- `npm run verify` and `git diff --check` pass.

# Out of scope

- Changing citation coverage, paper metadata, lesson prose, Quiz content, or
  reference visual design.
- Adding a standalone Paper Library route.

# Execution log

- 2026-08-13 — Inspected the current pager and registry assembly and stored this
  draft. No runtime, content, test, or wiki file was modified before approval.
- 2026-08-13 — User approved the follow-up plan; runtime separation started.
- 2026-08-13 — Separated authored pages from the reference surface in the MDX
  registry. Covered lessons now append one provider-wrapped reference page and
  expose the combined runtime page count without changing authored metadata.
- 2026-08-13 — Added a focused contract test for all 39 covered non-Quiz nodes
  and updated the existing Learning Lab architecture documentation. Quiz nodes,
  uncovered lessons, and other domains remain unchanged.
- 2026-08-13 — Verification completed: focused tests passed, `npm run verify`
  passed all 88 tests and the production build, and `git diff --check` passed.

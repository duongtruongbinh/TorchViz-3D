---
title: Learning Home Module Descriptions
status: done
created: 2026-07-06T00:00:00+07:00
updated: 2026-07-06T00:25:00+07:00
author: Codex
task: "Make Learning Lab Home module descriptions more detailed and remove the number of tracks from syllabus cards."
supersedes:
  - docs/plans/2026-07-04-learning-home-syllabus.md
---

# Goal

Improve the Learning Lab Home syllabus cards so each module/domain explains what
the learner will actually study, while removing the track-count metric from the
card metadata.

# Lineage

Supersedes [2026-07-04-learning-home-syllabus](./2026-07-04-learning-home-syllabus.md),
which added the catalog-backed Home syllabus.

# Context Read

- `src/components/learning/shell/DomainCatalog.tsx` renders the Home syllabus
  card metadata and currently shows track, lesson, and practice counts.
- `src/lib/localization.ts` owns localized domain descriptions and the
  `trackCount` formatter.
- Existing catalog/domain structure should stay unchanged; this is a copy and UI
  presentation pass.

# Decisions

- Treat "module" as each domain card in the Learning Lab Home syllabus.
- Remove only the visible track-count metric from the Home syllabus card.
- Keep lesson and practice counts because they describe learning volume more
  directly.
- Make domain descriptions more concrete in `src/lib/localization.ts`, reusing
  the existing domain text keys rather than adding another description registry.
- Keep preview track pills for traversal context unless a later request removes
  them too.

# Phases

## Phase 0 - Store this plan

- Add this draft plan and wait for explicit approval.

## Phase 1 - Update syllabus presentation

- Remove `strings.trackCount(item.trackCount)` from `DomainCatalog`.
- Remove `trackCount` from the built syllabus item if it becomes unused.

## Phase 2 - Expand module descriptions

- Update the English and Vietnamese domain descriptions in `src/lib/localization.ts`
  for all Learning Lab domains shown on Home.
- Keep copy concise enough for card layout but more specific about learning
  outcomes.

## Phase 3 - Verify and record

- Run the narrowest useful verification, likely `npm.cmd run verify`.
- Update this plan's execution log with changed files and verification result.

# Out of scope

- Adding new lessons, tracks, domains, practice items, or route behavior.
- Removing lesson/practice counts.
- Removing preview track pills.
- Redesigning the Home layout.

# Execution log

- 2026-07-06T00:00:00+07:00 - Draft plan created after reviewing the Home
  syllabus component, localization keys, and workflow requirements.
- 2026-07-06T00:10:00+07:00 - Plan approved by user request and implementation
  started.
- 2026-07-06T00:25:00+07:00 - Removed the visible track-count metric from the
  Learning Lab Home syllabus cards and removed the unused `trackCount`
  localization formatter. Expanded the localized descriptions for all Home
  modules/domains in `src/lib/localization.ts`.
- 2026-07-06T00:25:00+07:00 - Verification: `npm.cmd run verify` completed
  typecheck and all 92 tests, then timed out during the final Vite build due to
  the 120s command limit. Reran `npm.cmd run build` with a longer timeout and it
  passed. Vite still reports the existing empty `react-vendor` chunk and large
  `three-vendor` chunk warnings.

---
title: Learning Home Syllabus
status: done
created: 2026-07-04T00:00:00+07:00
updated: 2026-07-04T00:25:00+07:00
author: Codex
task: "Add a syllabus/index to the Learning Lab home page for easier course traversal."
supersedes:
  - docs/plans/2026-06-21-landing-ui-iteration.md
  - docs/plans/2026-06-30-learning-lab-catalog-consistency-fixes.md
---

# Goal

Make the Learning Lab Home page easier to traverse by adding a compact
catalog-backed syllabus/index. Success means a learner can land on Home, scan
the available domains and course structure, see lesson/practice scale, and open
the relevant domain path without relying only on the left sidebar.

# Lineage

Supersedes [2026-06-21-landing-ui-iteration](./2026-06-21-landing-ui-iteration.md)
for the active Landing/AppShell/Learning Lab surface and
[2026-06-30-learning-lab-catalog-consistency-fixes](./2026-06-30-learning-lab-catalog-consistency-fixes.md)
for the catalog-owned domain/track/lesson structure.

# Context Read

- `docs/WORKFLOW.md` requires a stored plan and explicit approval before edits.
- `CLAUDE.md` defines the app architecture and Learning Lab boundaries.
- `docs/plans/2026-06-21-learning-lab-refactor.md` and
  `docs/plans/2026-06-21-landing-ui-iteration.md` establish that Learning Lab
  and Landing are active runtime surfaces.
- `wiki/concepts/learning-lab-refactor.md` documents current Learning Lab UI
  conventions: Home is shallow, route/course detail lives in the main content,
  and new UI should use existing theme/localization helpers.
- `src/components/learning/LearningLabView.tsx` renders `DomainCatalog` when
  `/learning` has no active domain and already owns route navigation through
  `openDomain`.
- `src/components/learning/shell/DomainCatalog.tsx` is the current Home page:
  project goal plus three principle tiles.
- `src/core/learning/content/index.ts` and `src/core/learning/selectors.ts`
  expose the catalog, domains, tracks, lessons, and grouped lesson selectors.
- `src/components/learning/learningText.ts` provides localized domain, track,
  and lesson labels from catalog/localization state.
- `src/lib/localization.ts` owns Learning Lab copy and must stay bilingual.

# Decisions

- Add the syllabus/index to `DomainCatalog`, because it is the actual Learning
  Lab Home route.
- Keep the left sidebar shallow. The syllabus lives in the Home main content,
  not as an expandable sidebar tree.
- Use the existing `learningCatalog`, selectors, and catalog-owned display text;
  do not create a parallel title registry or duplicate lesson content.
- Pass an `onOpenDomain` callback from `LearningLabView` to `DomainCatalog` so
  Home cards navigate through the existing route helper.
- Show domain-level rows/cards with track count, lesson count, practice count,
  and a small preview of top tracks. Direct lesson links are out of scope for
  this pass to keep the homepage index readable.
- Add only the localized strings needed for syllabus headings, summaries, and
  actions.
- Use existing Learning Lab theme helpers and lucide icons; avoid new ad hoc
  colors unless they are already part of the Home surface.

# Phases

## Phase 0 - Store this plan

- Add this draft plan under `docs/plans/`.
- Wait for explicit user approval before changing source or docs files.

## Phase 1 - Wire homepage navigation

- Update `LearningLabView` so `DomainCatalog` receives `onOpenDomain`.
- Keep existing `openDomain` behavior, canonical route selection, and review mode
  behavior unchanged.

## Phase 2 - Add syllabus/index UI

- Update `DomainCatalog` to build a syllabus from `learningCatalog`.
- For each domain, compute grouped lessons, track count, lesson count, practice
  count, and preview track labels using existing selectors/text helpers.
- Render a scannable index below the current intro/principle section with a clear
  start/open action per domain.

## Phase 3 - Localization and docs

- Add bilingual Learning Lab Home syllabus strings in `src/lib/localization.ts`.
- Update the existing Learning Lab wiki page to document that Home now includes
  a catalog-backed syllabus/index.
- Append this plan's execution log with changed files and verification results.

## Phase 4 - Verify

- Run `npm run verify`.
- If verification is blocked by the environment, record the exact blocker in the
  execution log and final response.

# Out of scope

- Adding new domains, tracks, lessons, or practice content.
- Progress tracking, enrollment state, or persistence.
- Sidebar tree expansion.
- New route libraries or route shape changes.
- Direct lesson deep links from Home unless the approved plan is revised.
- Workspace, Pyodide worker, torchstub, IR, layout, Canvas3D, or exercise engine
  changes.

# Execution log

- 2026-07-04T00:00:00+07:00 - Draft plan created after reviewing workflow,
  architecture orientation, Learning Lab plans/wiki, active Learning Lab Home,
  catalog selectors, and localization boundaries.
- 2026-07-04T00:10:00+07:00 - Plan approved by user request and implementation
  started.
- 2026-07-04T00:25:00+07:00 - Implemented the Learning Lab Home syllabus/index.
  `LearningLabView` now passes the existing domain navigation callback into
  `DomainCatalog`; `DomainCatalog` derives domain, track, lesson, practice, and
  track-preview data from the existing Learning Catalog; `src/lib/localization.ts`
  owns the new bilingual syllabus labels; and
  `wiki/concepts/learning-lab-refactor.md` documents the updated Home behavior.
- 2026-07-04T00:25:00+07:00 - Verification passed with `npm.cmd run verify`
  after PowerShell blocked `npm.ps1` via execution policy. The dev server was
  started on `http://127.0.0.1:3000`, and `/learning` responded with HTTP 200.
  Browser automation was not available because the required Node REPL browser
  control tool was not exposed in this session.

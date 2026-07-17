---
title: Lesson Rail Global Expand/Collapse All Button
status: done
created: 2026-07-16T00:00:00Z
updated: 2026-07-16T00:00:00Z
author: Codex
task: "Add a global expand/collapse all lessons button in the lesson rail sidebar"
supersedes: []
---

# Goal

Add a button in the `LessonRail` sidebar header that expands or collapses all 
chapter tracks at once. Currently, users must toggle each track individually via 
its chevron button. A global toggle gives a faster way to see the full lesson 
list or hide it entirely.

# Lineage

Genesis plan — no predecessor.

# Decisions

- The button sits in the `LessonRail` header row (same row as the search box 
  and the close-rail toggle), keeping the control surface compact and 
  discoverable.
- The button uses a `Maximize2` / `Minimize2` or `List` / `ListCollapse` icon 
  from lucide-react, toggling between "Collapse all" and "Expand all" depending 
  on the current state.
- Behavior: when clicked, it alternates between:
  - **Collapse all**: add every track ID to `collapsedTrackIds`.
  - **Expand all**: clear `collapsedTrackIds`.
- The existing per-track chevron toggles remain unchanged.
- New localization strings are added for the button label.
- No changes to the `DomainCoursePage` course-content sections — this is scope 
  limited to the `LessonRail` sidebar.

# Phases

## Phase 0 — Store this plan
Write this plan file and wait for approval.

## Phase 1 — Add localization strings
Add `collapseAllTracks` and `expandAllTracks` entries to 
`src/lib/localization.ts` under the `learningLab` section.

## Phase 2 — Add `onToggleAllTracks` prop to LessonRail
- Add `onToggleAllTracks: () => void` to the `LessonRailProps` type.
- Add a button in the header `<div>` (after the search input row, before or 
  beside the filter row) that:
  - Displays a lucide icon (e.g., `ListCollapse` / `List`).
  - Sets title/aria-label to the appropriate localized string.
  - Calls `onToggleAllTracks` on click.
  - Derives its label from whether all tracks are currently collapsed.

## Phase 3 — Wire handler in LearningLabView
- Add a `toggleAllChapters` handler in `LearningLabView.tsx` that:
  - Checks if all `groupedDomainLessons` tracks are currently collapsed.
  - If all are collapsed → clear `collapsedChapters` (expand all).
  - Otherwise → collapse all by adding all track IDs.
- Pass it as `onToggleAllTracks` to the `LessonRail` via the `lessonRailProps` 
  object.

## Phase 4 — Verify
- Run `npm run verify` (typecheck + tests + build).
- Check that the new button appears in the rail and correctly toggles all tracks.

# Out of scope

- DomainCoursePage track sections (those stay as-is with their local state).
- Changes to lesson content, search, filters, or theme system.
- Any other UI outside the LessonRail sidebar.

# Execution log
- 2026-07-16 — Plan created.
- 2026-07-16 — Implemented. Added `expandAllTracks`/`collapseAllTracks` localization strings in
  `src/lib/localization.ts`. Added `onToggleAllTracks` prop to `LessonRail` with a
  `ListCollapse` icon button in the header row. Wired `toggleAllChapters` handler
  in `LearningLabView.tsx`. Verified with `npm run verify` (68 tests, typecheck,
  production build all passed).

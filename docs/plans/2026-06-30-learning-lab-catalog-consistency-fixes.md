---
title: Learning Lab Catalog Consistency Fixes
status: done
created: 2026-06-30T23:24:59+07:00
updated: 2026-06-30T23:41:38+07:00
author: Codex
task: "Fix Learning Lab UI/content regressions with a scalable catalog-first approach that avoids hardcoded title registries and silent fallbacks."
supersedes:
  - docs/plans/2026-06-25-learning-lab-domain-refactor.md
  - docs/plans/2026-06-29-ui-localization-hardcoded-text.md
---

# Goal

Fix the current Learning Lab regressions without adding more parallel registries.

Success means:

- Route, selection, chapter collapse, and filter state are deterministic for any
  number of domains, chapters, and lessons.
- Existing Tensor/NLP/RL practice entry points keep working, including old
  lesson deep links where possible.
- Domain/chapter/lesson display text is catalog-owned and typed, not spread
  across `localization.ts`, `learningLessonTitles.ts`, and ad hoc fallbacks.
- Missing catalog text or invalid ids are caught by narrow catalog consistency
  checks rather than hidden by humanized-id fallbacks.
- `LearningLabView.tsx` stops owning lesson-rail internals directly.

# Lineage

This plan supersedes:

- [2026-06-25-learning-lab-domain-refactor](./2026-06-25-learning-lab-domain-refactor.md) for the unified Learning Lab catalog, selectors, and legacy RL behavior.
- [2026-06-29-ui-localization-hardcoded-text](./2026-06-29-ui-localization-hardcoded-text.md) for the localization boundary and Learning Lab shell cleanup.

# Decisions

- **Catalog text is content, not UI chrome.** Keep app labels, aria text, button
  copy, filter labels, and exercise UI strings in `src/lib/localization.ts`.
  Move domain, chapter/track, lesson titles, lesson theory, duration, and
  content descriptions into the Learning Catalog content modules or a
  catalog-local text model.
- **No title registry fallback.** Remove the need for
  `src/lib/learningLessonTitles.ts` by storing lesson titles with lesson seeds.
  Unknown ids may still have a final defensive display string, but catalog tests
  must fail if first-party lessons rely on that path.
- **Merge old practice into the new roadmap.** Existing practice-backed lessons
  should become canonical lessons in the expanded roadmap at the right
  conceptual location. Legacy ids such as `shape-basics`, `linear-activation`,
  `attention-shape`, `rl-mdp-basics`, `rl-bellman`, `rl-q-learning`,
  `rl-sarsa`, `tabular-control`, and `policy-behavior` are compatibility
  aliases only when the new roadmap uses a clearer canonical id.
- **Aliases are redirects, not duplicate content.** Keep one canonical practice
  attachment per practice item. Legacy route ids and old Workspace handoffs
  resolve to the canonical lesson instead of duplicating lesson/practice refs.
- **Selectors own route validity.** Add catalog selectors that resolve
  `domainId + trackId + lessonId` together. A lesson query from another chapter
  should canonicalize to the correct track or be rejected into the active
  track's first lesson.
- **Rail UI is a component boundary.** Extract the lesson rail and its filter /
  search / collapse logic from `LearningLabView.tsx`, leaving the view as shell
  orchestration.
- **Collapse state is scoped.** Chapter collapse keys include domain identity or
  reset on domain changes so future duplicate chapter ids do not leak state.

# Phases

## Phase 0 - Approval checkpoint

- Store this draft plan.
- Wait for explicit approval before editing runtime files.

## Phase 1 - Catalog model and consistency checks

- Add typed catalog-local text primitives for localized domain, track/chapter,
  and lesson copy.
- Update seed helpers so content files declare lessons as structured seeds
  instead of bare string ids.
- Add or update narrow catalog consistency checks for:
  - unique domain/track/lesson ids within the intended scope;
  - every domain `trackIds` entry resolving to a track;
  - every track `lessonIds` entry resolving to a lesson in the same domain;
  - every first-party lesson having catalog-owned display text;
  - practice refs staying attached to real lesson sections;
  - known legacy route ids resolving intentionally.

## Phase 2 - Merge existing practice surfaces into canonical roadmaps

- Place the previous Fundamentals tensor practice lessons into the expanded ML /
  Deep Learning roadmap at the right canonical lesson locations, then alias old
  ids only for legacy routes and handoffs.
- Place the previous NLP attention practice into the Transformer roadmap, then
  alias the old `attention-shape` route if the canonical lesson is renamed.
- Place previous RL MDP, Bellman, Q-learning, and SARSA practice into the new RL
  roadmap chapters, then alias old lesson/track route ids only for
  compatibility.
- Ensure each practice item has exactly one canonical lesson attachment.
- Keep broader new placeholder content, but make generated placeholder lessons
  text-complete through the catalog model rather than `learningLessonTitles.ts`.

## Phase 3 - Route and rail behavior

- Add route resolution selectors that use `domainId`, `trackId`, and `lessonId`
  as one consistent unit.
- Fix `/learning/:domainId/:trackId` to select that track's first lesson when no
  lesson query exists.
- Fix mismatched `?lesson=` queries by navigating to the canonical track or
  falling back to the active track's first lesson.
- Make the filtered rail and selected lesson coherent: either keep the selected
  lesson visible, auto-select the first visible match, or show an explicit empty
  result without stale detail content.
- Scope/reset collapse state per domain and auto-expand the selected lesson's
  chapter after route changes.

## Phase 4 - Component responsibility cleanup

- Extract a `LessonRail` component and small pure helpers/hooks from
  `LearningLabView.tsx`.
- Keep theme usage within existing Learning Lab theme helpers; avoid adding new
  one-off hex color rules unless an existing style must be preserved.
- Keep `LessonDetail` section rendering generic enough for typed catalog lesson
  sections.

## Phase 5 - Documentation and verification

- Update this plan execution log with actual modifications.
- Update the existing Learning Lab wiki page instead of creating a new docs page.
- Run the narrowest useful verification after implementation. Expected minimum:
  catalog/route/localization-related tests; run `npm run verify` if the change
  affects TypeScript or build output broadly.

# Out of scope

- No progress persistence, user accounts, lesson completion storage, or new UI
  store behavior.
- No real content authoring beyond text needed to keep catalog entries complete.
- No changes to Workspace rendering, Pyodide worker execution, Canvas3D, or
  exercise math engines unless a broken Learning Lab handoff requires it.
- No new top-level AppShell learning surfaces.

# Execution log

- 2026-06-30T23:24:59+07:00 - Draft plan created after reviewing current Learning Lab UI/content regressions on `feat/ui-polis`.
- 2026-06-30T23:27:19+07:00 - Clarified that old practice-backed lessons should be merged into the canonical new roadmap, with aliases only for legacy compatibility.
- 2026-06-30T23:27:58+07:00 - Plan approved by user; implementation begins.
- 2026-06-30T23:41:38+07:00 - Implemented catalog route aliases, canonical route resolution, catalog-owned placeholder lesson text, restored Fundamentals tensor practice lessons, merged NLP/RL legacy practice into canonical roadmap lessons, extracted `LessonRail`, added catalog consistency tests, updated legacy route tests, and updated the Learning Lab wiki. `npm run verify` passed; Vite still reports the existing large `three-vendor` chunk warning.

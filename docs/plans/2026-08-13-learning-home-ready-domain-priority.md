---
title: Learning Home Ready Domain Priority
status: done
created: 2026-08-13T00:00:00+07:00
updated: 2026-08-13T00:20:00+07:00
author: Codex
task: "Rename the Continual Learning domain for LLMs and prioritize ready domains on Learning Home while muting unfinished domains."
supersedes:
  - docs/plans/2026-07-14-learning-home-course-card-grid.md
  - docs/plans/2026-08-08-continual-learning-llm-domain.md
---

# Goal

Make Learning Home communicate course readiness accurately:

- rename the domain to `Continual Learning for LLMs` in English and
  `Continual Learning cho LLMs` in Vietnamese;
- place ready domains before unfinished domains;
- preserve the catalog-relative order within the ready and unfinished groups;
- visually mute unfinished cards while preserving whole-card navigation,
  responsiveness, accessibility, and domain-specific identity.

# Lineage

Continues the Learning Home card system from
[2026-07-14-learning-home-course-card-grid](./2026-07-14-learning-home-course-card-grid.md)
and the authored Continual Learning course from
[2026-08-08-continual-learning-llm-domain](./2026-08-08-continual-learning-llm-domain.md).

# Context read

- `src/content/learning/index.ts` owns the canonical domain order.
- `src/content/learning/continual-learning-llm/table-of-contents.ts` owns the
  localized domain title.
- `src/components/learning/shell/DomainCatalog.tsx` currently renders catalog
  order directly and treats only `domain.status === 'placeholder'` as
  unfinished, even though domain status describes the catalog surface rather
  than whether every lesson has authored content.
- `LearningContentStatus` already distinguishes `published` from `draft` and
  `missing`; the current catalog has exactly one domain whose full lesson set
  is published: `continual-learning-llm`.
- `src/components/learning/theme.ts` already provides semantic interactive and
  unavailable surfaces.
- The worktree contains user edits to two Continual Learning quiz MDX files and
  an untracked seminar PDF; this task will not modify those files.

# Decisions

- A domain is ready when it has at least one lesson and every lesson in that
  domain has `contentStatus === 'published'`.
- Readiness is derived from canonical catalog content instead of hard-coding a
  domain ID, so future completed domains are promoted automatically.
- Learning Home uses a stable readiness partition: ready domains first, then
  unfinished domains, with original catalog order preserved inside both groups.
- Display numbering follows the resulting visible card order.
- Unfinished cards remain buttons and preserve their current routes. Their
  surface, illustration, title/body, status, and arrow use a quieter visual
  treatment; keyboard focus remains clear.
- No TOC IDs, routes, lesson ordering, authored lesson content, localization
  system strings, or domain palettes change.

# Phases

1. Add a React-free selector for domain readiness and focused catalog coverage.
2. Update the Continual Learning localized domain title.
3. Stable-partition Learning Home cards by readiness and apply the muted card
   treatment to unfinished domains.
4. Run `npm run verify` and `git diff --check`.
5. Record the execution result here and update the existing Learning Lab wiki
   UI convention rather than creating a new documentation page.

# Acceptance criteria

- Learning Home displays `Continual Learning for LLMs` in English and
  `Continual Learning cho LLMs` in Vietnamese.
- `continual-learning-llm` is the first card with the current catalog data.
- All other cards retain their original relative order after it.
- Unfinished cards are visibly quieter but remain clickable and keyboard
  focusable.
- A future domain whose full lesson set becomes published is promoted without
  a component-specific domain-ID change.
- Existing user changes remain untouched.
- Verification passes.

# Out of scope

- Changing which lessons are published or changing domain lifecycle statuses.
- Disabling unfinished cards or altering their routes.
- Changing lesson counts, card grid breakpoints, domain icons, palettes, course
  pages, lesson rails, or lesson bodies.
- Implementing the seminar-content additions discussed previously.

# Execution log

- 2026-08-13 — Read the mandatory workflow, Learning Lab architecture/history,
  current catalog materialization, domain metadata, Learning Home renderer,
  theme semantics, tests, and the `polish-ui` skill; stored this draft plan.
- 2026-08-13 — User approved the plan with `ok`; moved the plan through the
  approved checkpoint and into execution.
- 2026-08-13 — Renamed the localized domain title, added React-free readiness
  and stable-priority selectors, promoted the fully published Continual
  Learning course, and applied a muted but still interactive treatment to
  unfinished cards.
- 2026-08-13 — Added catalog coverage for the single ready domain, stable
  unfinished ordering, and the localized title; updated the existing Learning
  Lab wiki UI convention.
- 2026-08-13 — `npm run verify` passed with TypeScript, 90 Node tests, MDX
  validation, and the 2,808-module production build. `git diff --check` passed;
  the existing large-chunk advisory is unchanged.

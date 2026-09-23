---
title: Biome Warning Cleanup and Accessibility Hardening
status: done
created: 2026-09-23T22:44:09+07:00
updated: 2026-09-23T23:13:40+07:00
author: Nguyen Manh Khiem
task: "Resolve every current Biome warning and info diagnostic without weakening lint rules or changing product behavior"
supersedes:
  - docs/plans/2026-08-19-learning-lab-ui-refactor.md
---

# Goal

Make `npm run lint` complete with zero warnings, zero infos, and zero errors
across the current repository while preserving the existing Workspace, Landing,
exercise, and Learning Lab behavior and visual language.

# Lineage

Builds on and extends the accessibility and component-ownership decisions in
[2026-08-19-learning-lab-ui-refactor](./2026-08-19-learning-lab-ui-refactor.md).

# Current baseline

`npx biome check . --max-diagnostics=200` currently reports 102 diagnostics:

- 29 React hook dependency warnings;
- 68 accessibility warnings covering semantic elements, ARIA roles, keyboard
  interaction, button types, labels, SVG labels, and focusability;
- 4 style/regex infos;
- 1 deprecated Biome configuration info.

The earlier blocking `useIterableCallbackReturn` error in
`scripts/generateLlmUnlearningReferences.mjs` has already been corrected and is
kept as an existing uncommitted change.

# Decisions (locked)

1. Do not disable, downgrade, or ignore any Biome rule to obtain a clean run.
2. Prefer native semantic HTML where it preserves styling and behavior; use an
   explicit ARIA role only where no native element matches the interaction.
3. Preserve existing pointer behavior while adding equivalent keyboard access
   to genuine click targets. Remove propagation-only handlers when markup can
   avoid them safely.
4. Review each hook warning against its closure and lifecycle intent. Do not
   blindly apply dependency suggestions that would alter reset, animation, or
   lazy-loading behavior.
5. Keep Learning Lab light-only and retain its existing shared/domain component
   ownership, lazy-loading boundaries, navigation, and lesson behavior.
6. Keep visual styling and layout unchanged except for invisible semantic/ARIA
   corrections and focus behavior required for accessibility.
7. Migrate the deprecated Biome `recommended` configuration to the supported
   preset form only after validating the effective enabled rules remain
   equivalent.

# Phases

## Phase 0 — Store and approve this plan

- Save this plan as the first task write.
- Wait for explicit approval before editing runtime, configuration, test, or
  script files.

## Phase 1 — Mechanical and configuration diagnostics

- Fix template-literal and regex clarity diagnostics.
- Migrate the deprecated Biome configuration without weakening coverage.
- Re-run Biome and record the remaining semantic diagnostics.

## Phase 2 — React dependency correctness

- Resolve all `useExhaustiveDependencies` diagnostics by stabilizing callbacks
  or values, correcting dependency lists, or restructuring effects/memos where
  lifecycle intent requires it.
- Pay special attention to Learning Lab route loading, exercise reset state,
  camera animation, and demo playback so the fixes do not introduce loops or
  stale closures.

## Phase 3 — Accessibility semantics

- Add explicit button types and label/control associations.
- Replace or annotate interactive static elements with correct native
  semantics, keyboard behavior, and focusability.
- Correct modal/dialog, grouping, heading, separator, math, SVG, and drag/drop
  semantics without changing layout or pointer behavior.

## Phase 4 — Verification and documentation

- Run `npm run lint` and require zero diagnostics.
- Run `npm run verify` and `git diff --check`.
- Review the final diff for accidental visual, routing, lazy-loading, or catalog
  changes.
- Update this plan's execution log and status. No separate wiki page is needed
  because this work changes implementation quality, not subsystem ownership or
  architecture.

# Out of scope

- Visual redesign, copy changes, or new UI components.
- Changes to lesson prose, catalog structure, routes, or generated reference
  data.
- Broad formatting unrelated to an active diagnostic.
- Suppressing diagnostics through file-level ignores or weaker lint settings.

# Acceptance criteria

- `npm run lint` exits successfully with `Found 0 warnings` and no info/error
  diagnostics.
- `npm run verify` passes typecheck, tests, and production build.
- `git diff --check` passes.
- Existing UI behavior and Learning Lab architecture remain intact.

# Execution log

- 2026-09-23 22:44 +07:00 — Plan created from the complete 102-diagnostic
  Biome inventory; awaiting approval.
- 2026-09-23 22:49 +07:00 — Plan approved by the user; execution started.
- 2026-09-23 23:13 +07:00 — Replaced deprecated Biome configuration,
  corrected the mechanical diagnostics, stabilized hook dependencies, and
  hardened native HTML/ARIA semantics across Workspace, Canvas, exercises, and
  Learning Lab without suppressing any rule.
- 2026-09-23 23:13 +07:00 — Updated the segmented-control contract test to
  cover its native radio inputs after the first verification run exposed the
  obsolete button-role assertion.
- 2026-09-23 23:13 +07:00 — Completed with `npm run lint` at zero diagnostics,
  `npm run verify` passing typecheck, all 171 tests, and the production build,
  and `git diff --check` passing.

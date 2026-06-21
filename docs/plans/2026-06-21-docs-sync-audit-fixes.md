---
title: Documentation sync after repo audit
status: done
created: 2026-06-21T18:39:42+07:00
updated: 2026-06-21T18:50:00+07:00
author: duongtruongbinh
task: "update docs so they match the current repo, excluding in-progress Learning Lab behavior"
supersedes:
  - docs/plans/2026-06-21-llm-wiki-okf-plan.md
  - docs/plans/2026-06-21-learning-lab-refactor.md
---

# Goal

Make the documentation surfaces match the current repository behavior and file
layout, excluding the intentionally inert Landing Page / Learning Lab scaffold.

Success means the docs no longer point agents at stale paths or stale concepts:
`Canvas3D` lives under `src/components/canvas/`, wrapper line offsets are
described as derived rather than fixed, layout bounds are described as dynamic,
and the remaining user-facing claims match how the app currently runs.

# Lineage

Supersedes [2026-06-21-llm-wiki-okf-plan](./2026-06-21-llm-wiki-okf-plan.md)
because this task corrects drift in the OKF wiki and long-form docs created by
that plan.

Supersedes [2026-06-21-learning-lab-refactor](./2026-06-21-learning-lab-refactor.md)
because this task preserves the scaffold-only Learning Lab status documented by
that plan while updating nearby orientation docs.

# Decisions

- This is a documentation/source-comment sync, not a product behavior change.
- Do not activate, import, or expand the Landing Page / Learning Lab scaffold.
- Keep the existing architecture narrative; update only stale specifics found in
  the audit.
- Treat `src/lib/visualKind.ts` as the op-color source of truth and
  `src/lib/constants.ts` as non-op theme/container/edge/text constants.
- Treat `src/lib/renderBounds.ts` and `getLayoutWorldBounds(..., { includeEdges:
  true })` as the current layout-bounds behavior.
- Use docs-only verification plus a targeted grep/link check; run `npm run
  verify` only if TypeScript-affecting edits are made.

# Phases

## Phase 0 - Store this plan

- Add this plan under `docs/plans/`.
- Wait for explicit approval before any other file changes.

## Phase 1 - Correct core orientation docs

Files to modify:

- `CLAUDE.md`
- `docs/ARCHITECTURE.md`
- `README.md`

Edits:

- Update `Canvas3D` references from `src/components/Canvas3D.tsx` to
  `src/components/canvas/Canvas3D.tsx`.
- Remove the stale "`WRAPPER_LINE_OFFSET` (7)" wording in
  `docs/ARCHITECTURE.md`; describe it as derived from
  `countPythonPreambleLines(USER_CODE_PREAMBLE)`.
- Narrow `constants.ts` wording so it does not imply op colors live there.
- Change README "see changes instantly" wording to match the Run button /
  Ctrl/Cmd+Enter flow.
- Keep README links to the Learning Lab plan but preserve scaffold-only wording.

## Phase 2 - Correct wiki concept/reference pages

Files to modify:

- `wiki/architecture.md`
- `wiki/concepts/index.md`
- `wiki/concepts/rendering.md`
- `wiki/concepts/layout-engine.md`
- `wiki/concepts/pyodide-worker.md`
- `wiki/reference/gotchas.md`
- `wiki/reference/index.md`
- `wiki/log.md`

Edits:

- Update `Canvas3D` source paths to `src/components/canvas/Canvas3D.tsx`.
- Remove stale warnings that `docs/TORCHSTUB.md` still references
  `OP_MATCHERS` / `OP_COLORS`; that doc already points at `visualKind.ts`.
- Keep the valid warning that old hardcoded-wrapper-offset wording existed in
  older prose, but align it with the newly corrected architecture docs.
- Replace the fixed `bounds.minY/maxY/minZ/maxZ = +/-5` description with the
  current dynamic `getLayoutWorldBounds` behavior.
- Update reference index/log wording so it no longer says there are exactly two
  places where prose docs lag the code.

## Phase 3 - Correct nearby source comment

File to modify:

- `src/lib/python_sources.ts`

Edit:

- Update the top comment "give it a color in constants.ts" to point to
  `src/lib/visualKind.ts`, matching `docs/TORCHSTUB.md` and current code.

# Out of scope

- No runtime behavior changes.
- No edits to `App.tsx` or app routing.
- No Learning Lab implementation.
- No tests added or changed.
- No changes to dependency versions or importmap/package resolution.

# Verification

- Run a grep check for stale `src/components/Canvas3D.tsx`,
  `WRAPPER_LINE_OFFSET (7)`, `OP_MATCHERS`, `OP_COLORS`, and fixed bounds wording
  in docs/wiki.
- Run a markdown relative-link check equivalent to the audit command used before
  execution.
- If the only non-doc source edit is the `python_sources.ts` comment, skip
  `npm run verify` and record that no executable TypeScript changed.
- If any executable TypeScript changes beyond that comment, run `npm run verify`.

# Execution log

- 2026-06-21 - Plan created from the docs audit findings; waiting for approval.
- 2026-06-21 - User approved execution; status moved to executing.
- 2026-06-21 - Updated README, CLAUDE, architecture docs, wiki concept/reference
  pages, and the `python_sources.ts` extension comment to match the current repo.
  Preserved the inert Learning Lab scaffold.
- 2026-06-21 - Verification complete: targeted stale-grep returned no matches in
  current docs/wiki surfaces outside plan history; markdown link check found no
  missing real relative links after excluding the workflow template placeholder;
  `git diff --check` passed. Skipped `npm run verify` because the only
  TypeScript file change was a comment.

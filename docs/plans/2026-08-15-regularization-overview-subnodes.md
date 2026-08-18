---
title: Add Regularization Overview and Restore Separate Weight/Function Nodes
status: done
created: 2026-08-15T17:15:00+07:00
updated: 2026-08-18T19:08:41+07:00
author: pi
task: "Add a Regularization overview node while keeping separate Weight Regularization and Function Regularization nodes before Architecture Expansion."
supersedes:
  - docs/plans/2026-08-15-merge-regularization-methods.md
---

# Goal

Restructure the continual-learning methods track into four explicit nodes:

1. **Regularization** — a new overview node for the family and its shared
   objective.
2. **Weight regularization** — the existing EWC/SI parameter-level node,
   preserved as a separate lesson.
3. **Function regularization** — the existing distillation/LwF output-level
   node, preserved as a separate lesson with its existing images.
4. **Architecture Expansion** — the existing architecture node.

The final order in the methods track should be:

`Replay → Experience Replay Lab → Regularization → Weight Regularization → Function Regularization → Architecture Expansion`.

# Lineage

Supersedes [2026-08-15-merge-regularization-methods](./2026-08-15-merge-regularization-methods.md), which merged the two regularization lessons into one node. This plan reverses that merge while retaining its useful survey-aligned wording and citations where appropriate.

# Decisions (locked)

- Add a new canonical lesson pair with id `regularization-overview` and a
  matching `regularization-overview-quiz`.
- Preserve the canonical ids `parameter-regularization-ewc` and
  `distillation-for-retention` for the two detailed nodes so existing routes
  remain stable. Rename only their display titles to `Weight Regularization`
  and `Function Regularization` respectively.
- Revert the two detailed lessons and their quizzes to their pre-merge authored
  contents as exactly as practical. The new overview is an additive layer, not
  a rewrite or replacement of the established Weight/Function lessons.
- Keep the existing four distillation images in the restored Function
  Regularization node, using their current asset paths and accessible alt text.
- Do not duplicate the detailed lesson content in the overview. The overview
  will explain the shared penalty/objective and the parameter-space/function-
  space split, then point conceptually to the two following nodes.
- Keep the existing Architecture Expansion node after Function Regularization.
  No architecture lesson content changes are needed.
- Use the survey's §4.1 taxonomy and existing source evidence. The overview
  should state that regularization avoids replaying old raw data but commonly
  needs a frozen old-model checkpoint; it must not claim zero storage cost.

# Phases

## Phase 0 — Store and approve this plan

- Store this draft under `docs/plans/`.
- Wait for explicit approval before restoring, renaming, or creating lesson
  files.

## Phase 1 — Rebuild the lesson file order

After approval, work on the current feature branch and rename the numbered
Vietnamese MDX files so filename order matches the new TOC order:

- Add `2.1.5-regularization-overview.vi.mdx` and
  `2.1.6-regularization-overview-quiz.vi.mdx`.
- Move the weight pair to `2.1.7` / `2.1.8`, preserving the
  `parameter-regularization-ewc` ids.
- Move the function pair to `2.1.9` / `2.1.10`, restoring the
  `distillation-for-retention` ids and its original distillation content.
- Move Architecture Expansion to `2.1.11` / `2.1.12` without changing its
  lesson id or authored content.
- Use the prior pre-merge versions from repository history as the source for
  the two detailed nodes. Restore their authored prose, page structure,
  citations, images, and quiz content; make only the minimum title/heading
  changes needed to label them Weight Regularization and Function
  Regularization.

## Phase 2 — Author the new overview pair

Create the new overview lesson with a concise authored scope:

- Define regularization-based continual learning and the shared objective
  `L_total = L_new + lambda L_retention`.
- Explain why the family is distinct from replay and architecture expansion.
- Introduce the two subcategories in a comparison:
  - weight regularization constrains important parameters;
  - function regularization constrains outputs or representations.
- Explain the shared stability–plasticity trade-off and the checkpoint/storage
  boundary.
- Use the survey citation and no new images; the detailed Function node keeps
  all four existing distillation images.

Create a small overview quiz with concepts/questions for the family objective,
sub-category distinction, and storage/trade-off limitation.

## Phase 3 — Update catalog and references

- Update `table-of-contents.ts` to add the overview pair and rename the two
  detailed pair titles while preserving their ids.
- Restore separate paper coverage and citation review mappings for
  `parameter-regularization-ewc` and `distillation-for-retention`; add a
  reviewable overview claim for the survey taxonomy.
- Remove the merged lesson's combined citation mapping and ensure all existing
  distillation evidence ids belong to `distillation-for-retention` again.
- Update catalog/content tests for the added pair, renamed titles, new file
  numbering, lesson counts, theory coverage count, and quiz totals.
- Update the existing continual-learning branch-history documentation to
  describe the four-node structure and avoid stale claims that the two nodes
  remain merged.

## Phase 4 — Verify and record

- Search for stale merged-node wording, ids, filenames, and route references.
- Run `git diff --check` and `npm run verify`.
- Confirm the four existing image asset paths are still referenced by the
  Function Regularization lesson and that both detailed routes resolve.
- Mark this plan done and append the actual changes and verification results to
  its execution log.

# Out of scope

- No changes to the English lesson set.
- No substantive changes to Architecture Expansion, Replay, or unrelated
  continual-learning lessons.
- No refactoring or rewriting of the old Weight/Function lesson contents;
  changes are limited to restoration, node labels, and catalog positioning.
- No new visual assets or new interactive lab.
- No route-id migration for the two existing detailed lessons.

# Execution log

- 2026-08-18 — Requester approved the stored plan; execution started on `feat/merge-regularization-methods`.
- 2026-08-18 — Added the `regularization-overview` Theory/Quiz pair; restored separate `parameter-regularization-ewc` and `distillation-for-retention` pairs as Weight and Function Regularization; and renumbered Architecture Expansion to nodes 11/12. The Function node retains all four existing distillation images.
- 2026-08-18 — Updated the typed TOC, independent paper/evidence mappings, catalog/MDX count and ordering coverage, branch history, and Learning Lab architecture reference. Verified the four image paths, absence of stale merged-node references, and whitespace with `git diff --check` plus untracked-file checks.
- 2026-08-18 — `npm test` passed (90 tests) and `npm run build` passed. `npm run verify` remains blocked by pre-existing `TS6133` in unchanged `src/components/learning/learningMdxComponents.tsx:177` (`label` is declared but unused; blame `2252c344`); the content changes do not modify that file.
- 2026-08-15 — Draft plan created after the requester specified the desired
  four-node order: Regularization, Weight regularization, Function
  regularization, and Architecture Expansion. The requested implementation
  is additive and restores the old detailed lesson contents.

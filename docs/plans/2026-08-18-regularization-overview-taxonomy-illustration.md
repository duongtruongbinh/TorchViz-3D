---
title: Ground Regularization Overview in Wang et al. Taxonomy
status: done
created: 2026-08-18T19:21:10+07:00
updated: 2026-08-18T19:27:00+07:00
author: pi
task: "Revise the Regularization overview to use Wang et al.'s target-based two-direction taxonomy, cite arXiv:2302.00487, and show Regularizationv3.jpg."
supersedes:
  - docs/plans/2026-08-15-regularization-overview-subnodes.md
---

# Goal

Make all Vietnamese wording in `regularization-overview` consistently follow
Wang et al., *A Comprehensive Survey of Continual Learning: Theory, Method and
Application* (arXiv:2302.00487v3), §4.1: regularization methods divide into
weight and function regularization according to the target of the
regularization. Add the supplied illustration without changing catalog identity,
order, or the detailed Weight/Function lessons.

# Lineage

Supersedes [2026-08-15-regularization-overview-subnodes](./2026-08-15-regularization-overview-subnodes.md), which added the overview and its two
subnodes. This follow-up grounds that split in the supplied primary survey and
adds its requested illustration.

# Decisions (locked)

- Keep `regularization-overview`, its three existing concept IDs, and its
  Theory/Quiz placement unchanged.
- Apply one vocabulary consistently across all three overview pages: call the
  family the `regularization-based approach`, name its target-based siblings
  `weight regularization` and `function regularization`, and use
  `regularization target` when introducing the split. Preserve the established
  display labels `Weight Regularization` and `Function Regularization` when
  directing readers to the following nodes.
- Cite `wang2024comprehensive`, the existing generated paper record for
  arXiv:2302.00487v3, next to the target-based taxonomy claim.
- Add one reviewed occurrence-level evidence record using the exact §4.1
  passage: “Depending on the target of regularization, such methods can be
  divided into two sub-directions.”
- Add `Regularizationv3.jpg` via `LessonImage` on the overview’s taxonomy page,
  with Vietnamese accessible alt text. Do not add the image to the detailed
  lessons or create an additional asset.
- Keep the existing Shi et al. citation for the history-model penalty claim;
  Wang et al. supports the two-direction taxonomy specifically.

# Phases

## Phase 0 — Store and approve this plan

- Store this plan and wait for explicit approval before changing lesson content,
  citation data, or tests.

## Phase 1 — Revise overview taxonomy and illustration

- Update all overview pages for the locked vocabulary; its second page must
  attribute the weight/function split to Wang et al. and make the
  regularization target the organizing contrast.
- Insert `LessonImage` with
  `assetPath="continual-learning-llm/Regularizationv3.jpg"` and descriptive
  Vietnamese alt text.

## Phase 2 — Register source evidence

- Extend the overview claim’s paper coverage to include
  `wang2024comprehensive` as primary evidence.
- Add a reviewed `citationEvidence.ts` occurrence using the source’s §4.1
  passage and arXiv v3 HTML anchor; preserve exact evidence-to-MDX ownership.
- Update the Learning Lab reference count/documentation only if the additional
  citation changes a stated count.

## Phase 3 — Verify and record

- Run the focused MDX/citation tests or `npm test`, `git diff --check`, and
  inspect the image path and citation mapping.
- Run `npm run verify`; if its existing unrelated TS6133 failure remains,
  document it precisely alongside the focused verification result.
- Mark this plan done and append the actual changes and verification results.

# Out of scope

- No catalog/route/id migration or quiz rewrite.
- No changes to the separate Weight Regularization, Function Regularization, or
  Architecture Expansion lessons.
- No generated bibliography edits or new image assets.

# Execution log

- 2026-08-18 — Requester approved the stored plan; execution started on `feat/merge-regularization-methods`.
- 2026-08-18 — Reworded the complete overview and Quiz around the consistent `regularization-based approach` / `regularization target` vocabulary, retaining the established Weight and Function node labels. Added `Regularizationv3.jpg` with descriptive Vietnamese alt text.
- 2026-08-18 — Added reviewed Wang et al. §4.1 evidence for the exact target-based two-direction statement and linked the generated `wang2024comprehensive` paper record to the overview claim. Updated the Learning Lab citation count to 220 occurrences (218 reviewed records, two explicit exceptions).
- 2026-08-18 — Verified the exact arXiv v3 HTML anchor, asset path, citation mapping, `npm test` (90 passing), `npm run build`, and `git diff --check`. `npm run typecheck` remains blocked by the pre-existing unchanged TS6133 at `src/components/learning/learningMdxComponents.tsx:177`.
- 2026-08-18 — Draft created after the requester supplied the target-based
  taxonomy passage, primary source URL, and existing illustration path.
- 2026-08-18 — Clarified scope: normalize wording across the complete overview,
  not only the taxonomy page.

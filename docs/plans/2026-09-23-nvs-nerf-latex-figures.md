---
title: Add LaTeX figures to the NVS and NeRF lesson
status: approved
created: 2026-09-23T08:24:00+07:00
updated: 2026-09-23T08:27:00+07:00
author: Copilot
task: "Add the supplied LaTeX figures and captions to the NVS and NeRF lesson."
supersedes:
  - "docs/plans/2026-09-23-nvs-nerf-research-paper.md"
---

# Goal

Bring the five supplied image files referenced by `main (10).tex` into the
existing NVS/NeRF lesson in the same order and with the corresponding LaTeX
captions.

# Lineage

Extends [2026-09-23-nvs-nerf-research-paper](./2026-09-23-nvs-nerf-research-paper.md).

# Decisions (locked)

- Add the supplied `Novel.png`, `voxel.png`, `ray.png`, `stratified.png`, and
  `Fig7_paper.png` figures.
- Use the existing `LessonImage` contract and place each image beside the
  matching lesson explanation.
- Preserve the LaTeX captions as Vietnamese captions/alt text.
- Do not fabricate missing TikZ figures from the `.tex` source.
- Keep the changes on `feat/nvs-nerf-research` and update the existing PR.
- The images are local R2 sync sources; CDN upload remains a separate operation
  requiring configured credentials.

# Phases

## Phase 0 — Store and approve

Store this plan and wait for explicit approval.

## Phase 1 — Add figures

Copy the five supplied images into the local lesson asset tree and add their
`LessonImage` references to the relevant MDX sections.

## Phase 2 — Verify and update PR

Run image-reference/catalog checks, typecheck, build, and diff validation;
record the execution log, commit, and push to update the existing NVS PR.

# Out of scope

- Rewriting the NVS/NeRF lesson prose.
- Adding figures that exist only as TikZ source.
- Uploading to R2 without credentials.

# Execution log

- 2026-09-23 — Inspected `main (10).tex`; identified five supplied raster
  figures and their matching captions.
- 2026-09-23 — Plan approved; requester asked to preserve the existing content
  while making wording natural and avoiding unnecessary unusual terms.
- 2026-09-23 — Added five `LessonImage` references with captions matching the
  supplied LaTeX source. Local image copies are present under the ignored
  `src/assets/learning/` tree.
- 2026-09-23 — Typecheck, production build, and catalog-stat checks passed.
  R2 validation remains blocked because `ASSETS_CDN_URL` is not configured.

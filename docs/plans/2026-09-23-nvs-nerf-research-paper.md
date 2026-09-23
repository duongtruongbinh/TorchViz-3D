---
title: Add Novel View Synthesis and NeRF research lesson
status: done
created: 2026-09-23T08:12:00+07:00
updated: 2026-09-23T08:30:00+07:00
author: Copilot
task: "Convert NVS_2 (2).pdf into a Vietnamese research-paper lesson under Random Research Paper and open a dedicated pull request."
supersedes:
  - "docs/plans/2026-08-21-research-papers-domain-init.md"
---

# Goal

Create and publish a Vietnamese Learning Lab lesson under the existing
`research-papers` domain (`Random Research Paper`) explaining Novel View
Synthesis (NVS), classical volume rendering, and NeRF as presented in the
attached NVS_2 (2).pdf.

# Lineage

Extends the research-paper domain established by
[2026-08-21-research-papers-domain-init](./2026-08-21-research-papers-domain-init.md).

# Decisions (locked)

- Use the existing `research-papers` domain and add a dedicated Computer Vision
  chapter for Novel View Synthesis and NeRF.
- Create one published Vietnamese lesson with a stable ID
  `nvs-nerf-overview`, covering the PDF's five major sections:
  NVS context, camera/ray geometry, classical volume rendering, NeRF's
  implicit neural representation, and research questions/limitations.
- Preserve the PDF's technical claims, formulas, section order, and distinctions
  between classical volume rendering and NeRF's differentiable rendering.
- Convert formulas to the repository's `InlineMath`/`BlockMath` MDX components
  and keep authored prose compatible with the MDX parser.
- Do not add new image references unless their CDN availability is verified;
  the lesson must not introduce CI-failing 404 asset checks.
- Do not modify existing research-paper lessons or shared Learning Lab UI.

# Phases

## Phase 0 — Store and approve this plan

Store this plan, pause for explicit approval, then mark it `approved`.

## Phase 1 — Prepare the isolated branch

Create a new feature branch from `main`, separate from the open Linear
Regression PR, and stage the attached PDF only as a source artifact outside
the repository.

## Phase 2 — Author and register the lesson

Create the locale MDX lesson under
`src/content/learning/research-papers/cv/nerf/`, add the corresponding chapter
and published lesson entry to the research-paper table of contents, and update
catalog statistics/tests if required.

## Phase 3 — Verify and publish

Run targeted MDX/catalog checks and the production build, record actual changes
in this plan, commit with the repository trailer, push the new branch, and open
a pull request describing the lesson.

# Out of scope

- Adding a full multi-lesson NeRF curriculum, quiz, or code lab.
- Uploading PDF-extracted images to R2 without configured credentials.
- Changing the existing `Random Research Paper` domain metadata or unrelated
  research-paper chapters.

# Execution log

- 2026-09-23 — Inspected the PDF and confirmed it covers NVS, volume rendering,
  and NeRF; confirmed the target domain is `research-papers` / `Random Research
  Paper`.
- 2026-09-23 — Plan approved by requester.
- 2026-09-23 — Created isolated branch `feat/nvs-nerf-research` from `main`.
- 2026-09-23 — Added the Vietnamese `nvs-nerf-overview` lesson and registered
  the `nerf-paper` chapter under Random Research Paper.
- 2026-09-23 — Synchronized catalog statistics and updated the catalog
  regression count/documentation from 104/787 to 105/788.
- 2026-09-23 — Typecheck, production build, catalog-stat validation, and the
  new lesson's MDX contract passed. The targeted test command still reports the
  pre-existing NCA quiz count failure; repository lint also reports existing
  unrelated baseline findings.

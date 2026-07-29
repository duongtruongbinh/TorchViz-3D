---
title: Statistics Import Artifact Cleanup
status: done
created: 2026-07-29T23:55:43+07:00
updated: 2026-07-30T00:00:16+07:00
author: Codex
task: "remove the completed Statistics import scripts and ISLP source reference while preserving and directly validating the generated Learning Lab content"
supersedes:
  - docs/plans/2026-07-29-statistics-islp-mdx-domain.md
---

# Goal

Remove the one-time Statistics import machinery and its 1.46 MB ISLP source
after confirming that the canonical Learning Lab output is complete and
self-contained.

Success means:

- the 90 generated English Statistics MDX lessons, 13-track TOC, 265 pages,
  routes, fallback behavior, and runtime lazy loading remain unchanged;
- `scripts/generateStatisticsIslp.ts`,
  `scripts/statisticsIslpManifest.ts`, and
  `docs/reference/ISLP_website.md` are deleted;
- the unrelated `docs/reference/building-llms-from-scratch-gist.md` is
  preserved;
- tests validate the retained TOC and MDX files directly, without importer
  dependencies;
- documentation describes the content as imported output rather than as
  regenerable output.

# Lineage

Supersedes
[Statistics Domain from ISLP Reference](./2026-07-29-statistics-islp-mdx-domain.md).
This follow-up intentionally reverses that plan's decision to retain a
deterministic importer and source input now that the requester has accepted the
generated content as the canonical source.

# Context Read

- `src/content/learning/statistics/` contains exactly 90 `.en.mdx` files and no
  `.vi.mdx` files.
- Generic MDX validation already verifies catalog/path/metadata parity and
  contiguous page indexes for all published lessons.
- The Statistics page-count assertion currently imports expected values from
  the manifest; it can instead lock the 13-track, 90-lesson, and 265-page
  expectations directly in the test.
- Neither script nor the reference is imported by runtime code.
- `docs/reference/` contains a separate LLM reference that is outside this
  cleanup and must not be deleted.

# Decisions (Locked)

- Delete only the three Statistics import artefacts named in the Goal.
- Keep generated TOC and MDX byte content unchanged.
- Replace manifest/generator test imports with direct Statistics catalog and
  inspected-MDX count assertions.
- Remove deterministic-regeneration claims and file-map entries from the active
  Learning Lab wiki.
- Preserve the completed predecessor plan as historical evidence; append a
  note there pointing to this cleanup instead of rewriting its original
  decisions.
- Do not delete the entire `docs/reference/` directory.

# Phases

## Phase 0 - Approval

- Store this plan as the first write.
- Wait for explicit requester approval before deleting or modifying any other
  file.

## Phase 1 - Decouple Validation

- Remove imports of the generator and manifest from
  `src/lib/learningMdxContent.test.ts`.
- Lock the retained domain counts directly: 13 tracks, 90 English lessons, 265
  inspected pages, zero Vietnamese Statistics MDX files.

## Phase 2 - Delete One-Time Inputs

- Delete the two Statistics scripts and `docs/reference/ISLP_website.md`.
- Confirm the unrelated LLM reference remains present.

## Phase 3 - Documentation and Verification

- Update `wiki/concepts/learning-lab.md` and append cleanup lineage/evidence to
  the predecessor plan.
- Run `npm run verify`, `git diff --check`, and direct file/count audits.

# Out of Scope

- Editing any generated Statistics MDX lesson or its TOC.
- Deleting other files under `docs/reference/`.
- Starting the phase-2 Vietnamese translation.
- Changing Learning Lab routes, UI, search, or lazy-loading behavior.

# Execution Log

- 2026-07-29T23:55:43+07:00 - Audited all references and confirmed that the
  generated content is self-contained. Found one unrelated LLM reference in the
  same directory and explicitly excluded it from deletion. Stored this draft
  plan as the task's first write.
- 2026-07-29T23:56:48+07:00 - Requester explicitly approved the stored plan.
- 2026-07-29T23:56:49+07:00 - Approval recorded and execution started.
- 2026-07-30T00:00:16+07:00 - Removed the two one-time Statistics scripts and
  `docs/reference/ISLP_website.md`. Replaced importer-backed assertions with
  direct catalog/MDX checks for 13 tracks, 90 published English lessons, zero
  Vietnamese Statistics files, and 265 pages. Updated the Learning Lab wiki and
  predecessor-plan lineage. Confirmed the unrelated LLM reference remains.
  `npm run verify` passes typecheck, all 77 tests, and production build;
  `git diff --check` passes and active source/wiki paths contain no remaining
  references to the deleted artefacts.

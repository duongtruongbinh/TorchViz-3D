---
title: Statistics Vietnamese-only Test and Documentation Alignment
status: done
created: 2026-07-30T01:34:04+07:00
updated: 2026-07-30T01:37:07+07:00
author: nmkhiem
task: "update Learning Lab tests and documentation to match the Vietnamese-only Statistics content retained after repository compaction"
supersedes:
  - docs/plans/2026-07-29-statistics-import-artifact-cleanup.md
---

# Goal

Make the checked-in Vietnamese-only Statistics corpus the explicitly tested and
documented Learning Lab state.

Success means:

- all 90 Statistics lessons remain published through their canonical TOC;
- the 90 Vietnamese MDX files and their 265 ordered pages remain unchanged;
- tests expect 143 authored locale files overall and no Statistics English MDX;
- stale bilingual and English-source claims are removed from the Learning Lab
  wiki;
- `npm run verify` passes.

# Lineage

Supersedes
[Statistics Import Artifact Cleanup](./2026-07-29-statistics-import-artifact-cleanup.md).
That plan validated the retained imported corpus before later translation and
repository compaction. Commit `1994a1e` then intentionally removed the English
Statistics files but left bilingual assertions and documentation behind; this
follow-up aligns those remaining contracts with the compacted repository.

# Context Read

- `npm test` currently reports 143 discovered MDX files against an expected
  count of 233.
- `src/content/learning/statistics/` contains 90 `.vi.mdx` files and no
  `.en.mdx` files.
- The Statistics TOC still contains 13 tracks and 90 published lessons.
- The failing test still requires 90 English files, 180 Statistics documents,
  bilingual page parity, and English/Vietnamese prose and code parity.
- `wiki/concepts/learning-lab.md` still describes Statistics as bilingual,
  lists removed English files, and links two plan files removed by the
  compaction commit.

# Decisions (Locked)

- Treat removal of the English Statistics MDX files as intentional.
- Preserve all Vietnamese Statistics MDX and TOC content byte-for-byte.
- Keep generic catalog/path/metadata/component validation for every authored
  MDX file.
- Replace bilingual Statistics assertions with Vietnamese-only count, locale,
  page-contiguity, and untranslated-English guard assertions.
- Update only the existing Learning Lab wiki; do not create another reference
  page.
- Remove dangling wiki links and stale English fallback/source claims.
- Do not change runtime routing, registry behavior, locale contracts, catalog
  metadata, or lesson content.

# Phases

## Phase 0 - Approval

- Store this plan as the task's first write.
- Wait for explicit requester approval.

## Phase 1 - Align Regression Coverage

- Update `src/lib/learningMdxContent.test.ts` for 143 total authored locale
  files, 90 Vietnamese Statistics documents, and 265 Vietnamese Statistics
  pages.
- Remove English-pair comparisons that cannot apply to the retained corpus.
- Preserve the Vietnamese prose translation guard and all generic validation.

## Phase 2 - Align Active Documentation

- Update `wiki/concepts/learning-lab.md` to describe the Vietnamese-only
  Statistics corpus and remove dangling or deleted file references.

## Phase 3 - Verify and Record

- Run `npm run verify` and `git diff --check`.
- Record the exact modifications and verification evidence in this plan.

# Out of Scope

- Restoring English Statistics MDX files.
- Editing or retranslating Vietnamese lesson content.
- Changing Statistics routes, TOC ordering, fallback configuration, search
  behavior, or runtime UI.
- Compacting unrelated documentation.

# Execution Log

- 2026-07-30T01:34:04+07:00 - Reproduced the failing test, traced it to the 90
  English Statistics files removed by commit `1994a1e`, audited current MDX
  counts and stale wiki claims, and stored this draft plan as the first write.
- 2026-07-30T01:34:36+07:00 - Requester explicitly approved the plan; approval
  was recorded and execution started.
- 2026-07-30T01:37:07+07:00 - Updated the generic MDX regression test to lock
  143 authored locale files overall, 90 Vietnamese-only Statistics documents,
  zero English Statistics files, and 265 Vietnamese Statistics pages. Removed
  obsolete bilingual parity checks while preserving catalog identity, MDX
  validation, page continuity, component allowlists, and the untranslated
  English prose guard.
- 2026-07-30T01:37:07+07:00 - Updated the existing Learning Lab wiki to remove
  dangling compacted-plan links, bilingual/English-source claims, and the
  deleted `.en.mdx` file-map entry. Documented available-locale fallback for
  non-Vietnamese UI requests. No Statistics TOC or MDX file was modified.
- 2026-07-30T01:37:07+07:00 - Focused MDX coverage passed 11 tests.
  `npm run verify` passed TypeScript, all 77 tests, and the production build
  (2,728 modules). `git diff --check` passed, and a stale-claim search returned
  no matches in the Learning Lab wiki.

---
title: Statistics Overview Lesson Replacement
status: done
created: 2026-07-30T01:40:11+07:00
updated: 2026-07-30T01:47:12+07:00
author: Codex
task: "adapt the requester-provided statistics transcript into an original four-page Vietnamese overview lesson"
supersedes:
  - docs/plans/2026-07-30-statistics-vietnamese-only-test-doc-alignment.md
---

# Goal

Adapt the supplied Vietnamese transcript into an original four-page Statistics
overview lesson while preserving its existing catalog identity.

Success means:

- the route and lesson id remain `ch01-overview-statistical-learning`;
- the TOC and lesson title remain `1.1 Tổng quan về học thống kê`;
- the lesson keeps four ordered `MdxPage` surfaces;
- each page presents one stage of the reference material's conceptual arc in
  original instructional prose;
- obsolete Wage, Smarket, and NCI60 content is removed from this lesson;
- focused MDX validation and `npm test` pass.

# Lineage

Supersedes
[Statistics Vietnamese-only Test and Documentation Alignment](./2026-07-30-statistics-vietnamese-only-test-doc-alignment.md),
which established the current Vietnamese-only Statistics corpus that this
content edit extends.

# Initial Decisions (Superseded by Adaptation Addendum)

- Keep the TOC entry, filename, route, lesson id, title, locale, and four-page
  structure unchanged.
- Use the four numbered section labels supplied by the requester as the page
  headings, including the repeated “Thống kê là gì?” label on pages 1 and 2.
- Render each supplied time range directly beneath its page heading.
- Preserve the supplied prose verbatim apart from Markdown formatting.
- Update lesson metadata headings and keywords to describe the new content.
- Do not edit any other Statistics lesson or runtime component.

# Phases

## Phase 0 - Approval

- Store this plan as the task's first write.
- Wait for explicit requester approval.

## Phase 1 - Replace Authored Content

- Replace the metadata headings/keywords and all four `MdxPage` bodies in
  `src/content/learning/statistics/1.1-ch01-overview-statistical-learning.vi.mdx`.

## Phase 2 - Verify and Record

- Run the focused Learning Lab MDX test, `npm test`, and `git diff --check`.
- Record the exact modification and verification evidence here.

# Out of Scope

- Renaming the node or changing its route/id.
- Editing the Statistics TOC or another lesson.
- Adding video/audio playback behavior.
- Expanding the lesson beyond the supplied conceptual scope.

# Adaptation Addendum

The requester clarified that the supplied transcript is reference material
only. This addendum supersedes the earlier verbatim-copy decision while
preserving the completed implementation history above.

## Revised Decisions

- Keep the existing node title, filename, route, id, locale, and four-page
  structure.
- Rewrite the concepts as original, concise instructional prose in a neutral
  course voice.
- Remove timestamps, the named presenter, transcript-style greetings, and
  duplicated page headings.
- Retain the conceptual arc: definition, descriptive summaries, practical
  applications, and limits of statistical evidence.
- Use fresh examples and phrasing where needed so the result stands alone as
  lesson content rather than a transcript reproduction.

## Revised Phases

1. Wait for explicit approval of this addendum.
2. Rewrite metadata headings/keywords and the four page bodies.
3. Run focused MDX validation, `npm test`, and `git diff --check`.
4. Record the final result and return the plan to `done`.

# Execution Log

- 2026-07-30T01:40:11+07:00 - Confirmed with the requester that the existing
  node title must remain unchanged, inspected the current TOC/MDX contract, and
  stored this draft plan as the task's first write.
- 2026-07-30T01:41:08+07:00 - Requester explicitly approved the plan; approval
  was recorded and execution started.
- 2026-07-30T01:41:57+07:00 - Replaced all four authored pages with the
  requester-provided numbered transcript sections and timestamps. Updated the
  page headings and search keywords while preserving the filename, lesson id,
  locale, title, route, and four-page structure. Removed the former Wage,
  Smarket, and NCI60 material from this lesson only.
- 2026-07-30T01:41:57+07:00 - Focused MDX validation passed all 11 tests;
  `npm test` passed all 25 test files; `git diff --check` passed.
- 2026-07-30T01:44:39+07:00 - Requester clarified that the supplied transcript
  is reference material only. Added this draft adaptation addendum before
  changing the lesson again.
- 2026-07-30T01:45:52+07:00 - Requester explicitly approved the adaptation
  addendum; approval was recorded and revision started.
- 2026-07-30T01:47:12+07:00 - Rewrote the four pages as original, neutral
  instructional prose covering the field/statistic distinction, descriptive
  summaries, evidence-based decisions, and limits of causal inference. Removed
  all timestamps, presenter references, transcript greetings, duplicated
  headings, and source-specific entertainment examples.
- 2026-07-30T01:47:12+07:00 - Confirmed the removed transcript markers and
  stray non-Vietnamese characters are absent. Focused MDX validation passed all
  11 tests, `npm test` passed all 25 test files, and `git diff --check` passed.

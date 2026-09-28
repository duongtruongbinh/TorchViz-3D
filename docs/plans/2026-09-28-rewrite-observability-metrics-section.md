---
title: Rewrite Observability Metrics Section
status: done
created: 2026-09-28T22:46:30+07:00
updated: 2026-09-29T01:09:29+07:00
author: Codex
task: "Rewrite section 2 of the observability lesson so concepts follow context, problem, need, solution, example, and implication."
supersedes: []
---

# Goal

Replace section 2 in `2026-09-28-observability-engineering-metrics-logs-traces.md`
with the user-approved rewrite. The revised section should introduce operational
problems before terminology, keep definitions separate from explanatory prose,
preserve the existing lab commands and image references, and avoid overstating
what metrics can prove.

# Lineage

Genesis plan. The target document is lesson content stored under `docs/plans/`,
not a predecessor implementation plan.

# Decisions (locked)

- Apply the approved flow: context, problem, need, concept or solution, example,
  then implication.
- Keep the existing section boundary from `# 2. Metrics Collection and Analysis
  with Prometheus` through the content immediately before `# 3. Logs with Loki
  and Alloy`.
- Preserve existing PromQL, YAML, endpoint examples, image paths, and the lab's
  Prometheus and Grafana workflow unless a prose correction requires clearer
  context.
- State that values such as `15s`, `[5m]`, percentages, and observed rates belong
  to the lab rather than presenting them as universal defaults or thresholds.
- Treat `up`, P95, resource usage, and dashboard correlations as evidence that
  narrows investigation, not proof of application health or root cause.
- Apply the `humanizer` and `learning-lab-authoring` rules: remove redundant
  conclusions, avoid definition-first passages, minimize premature terminology,
  and keep each paragraph focused on one job.

# Phases

## Phase 0: Store and approve this plan

- Store this plan as the task's first write.
- Pause for explicit user approval.

## Phase 1: Replace section 2

- Replace only section 2 in the target document with the approved rewrite.
- Leave sections 1, 3, 4, and 5 unchanged.

## Phase 2: Editorial and structural verification

- Confirm every heading, code block, table, formula, and image reference renders
  as valid Markdown.
- Check the rewritten prose for definition-first openings, repeated conclusions,
  unsupported claims, unexplained fixed values, and premature terminology.
- Inspect the diff to ensure the change is limited to the plan record and section
  2 of the target document.

## Phase 3: Record the result

- Update this plan through `approved`, `executing`, and `done` states.
- Add a concise execution log with the edited file and verification performed.
- No separate wiki or README update is expected because the target lesson itself
  is the documentation surface being revised.

## Phase 4: Synchronize the reviewed Learning Lab copy back to the source

- Compare section 2 with the five published Chapter 2 MDX lessons and carry back
  prose changes that affect meaning, motivation, or transition logic.
- Focus the rewrite on section 2.4, where the reviewed UI copy now introduces
  PromQL, Counter, and Gauge from the operational need and connects the queries
  as one investigation.
- Remove the generic baseline and root-cause caveats that were already removed
  from the UI copy at the user's request.
- Preserve the source document's Markdown image references, headings, PromQL,
  formulas, values, and surrounding chapters. Do not copy MDX metadata,
  `LessonNote`, `BlockMath`, or `TODO(image)` presentation wrappers into it.
- Verify that section 2 retains sixteen image references, seven PromQL blocks in
  the hands-on section, and no semicolons, then record the final diff.

# Out of scope

- Rewriting sections 1, 3, 4, or 5.
- Changing images or generating new assets.
- Changing Learning Lab runtime code, catalog metadata, routes, or UI components.
- Adding new observability topics beyond the claims already present in section 2.

# Execution log

- 2026-09-28T22:46:30+07:00: Draft plan created after the user approved the
  proposed section rewrite; execution is waiting for explicit approval of this
  stored plan.
- 2026-09-28T22:50:00+07:00: User explicitly approved the stored plan. Status
  advanced through `approved` to `executing`; section replacement started.
- 2026-09-28T22:52:49+07:00: Replaced section 2 with the approved progression,
  preserved its PromQL, YAML, endpoint, credential, and image references, and
  left section 3 onward outside the replacement boundary.
- 2026-09-28T22:52:49+07:00: Verified one section 2 boundary, one section 3
  boundary, balanced Markdown fences, removal of the old opening, and a clean
  `git diff --check` apart from the repository's CRLF conversion warning. The
  referenced image files were already absent from the repository, so their
  existence could not be validated in this docs-only rewrite.
- 2026-09-28T22:52:49+07:00: No README or wiki update was needed because the
  lesson document is the documentation surface changed by this task.
- 2026-09-28T23:08:36+07:00: User approved a focused editorial follow-up within
  section 2. Reopened execution to remove remaining repetition, align the CPU
  heading with its evidence, and correct the cardinality math delimiter and
  section-boundary spacing.
- 2026-09-28T23:09:10+07:00: Completed the approved follow-up. Condensed the
  chapter and 2.1 openings, removed the repeated instrumentation/exporter
  conclusion, connected the `up` exercise to section 2.1, reframed the CPU and
  memory prompts, restored the cardinality `$$` block, and added spacing before
  section 3. `git diff --check` reported only existing line-ending warnings.
- 2026-09-28T23:11:00+07:00: User requested a final punctuation pass to limit
  semicolons in section 2. Reopened execution for this focused prose cleanup.
- 2026-09-28T23:11:26+07:00: Replaced all ten semicolons in section 2 with
  sentence boundaries and consistent bullet punctuation. Verified that section
  2 contains zero semicolons and that `git diff --check` reports only existing
  line-ending warnings.
- 2026-09-29T00:51:40+07:00: Reopened the plan as a draft follow-up after
  comparing the documentation source with the five published Chapter 2 lessons.
  The meaningful drift is concentrated in section 2.4. Awaiting approval to
  synchronize the reviewed UI prose back to the source document.
- 2026-09-29T00:57:23+07:00: User approved the synchronization follow-up. The
  plan advanced through `approved` and `executing`, then the reviewed section
  2.4 prose was synchronized from the Learning Lab lesson back to the source.
  Preserved the source's Markdown image links and formulas while carrying back
  the motivation for PromQL, Counter, and Gauge, the query-to-query transitions,
  and the shorter result interpretations.
- 2026-09-29T00:57:23+07:00: Verified that section 2 still has sixteen image
  references and zero semicolons. Section 2.4 retains nine subheadings and seven
  PromQL blocks. `git diff --check` reported no content errors, only the existing
  LF-to-CRLF warning. No build was run because this follow-up changes Markdown
  documentation only.
- 2026-09-29T01:07:42+07:00: Performed a line-by-line comparison after
  normalizing MDX callouts, image flags, metadata, and `BlockMath` back to their
  Markdown equivalents. Section 2.4 now matches the reviewed UI prose exactly.
  Remaining differences in the other lessons are limited to paragraph
  boundaries, Markdown presentation, and chapter-aware cross-references.
- 2026-09-29T01:09:29+07:00: User clarified that the entire Chapter 2 source,
  not only section 2.4, must track the reviewed UI lessons. Synchronized the
  remaining prose, definition wording, paragraph flow, and lesson-aware
  cross-references across sections 2.1, 2.2, 2.3, and 2.5. After normalizing UI
  wrappers, sections 2.2, 2.4, and 2.5 match line for line. Section 2.3 differs
  only in Markdown formula syntax, while section 2.1 keeps the chapter lead-in
  above its heading to avoid stacked headings in the continuous source document.
  Reconfirmed sixteen image references and zero semicolons in Chapter 2.

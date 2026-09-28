---
title: Publish AIOps Chapter 2 Prometheus Lessons
status: done
created: 2026-09-28T23:13:16+07:00
updated: 2026-09-29T00:45:13+07:00
author: Codex
task: "Implement Chapter 2 of the approved observability source as published lessons in the AIOps Learning Lab course."
supersedes:
  - docs/plans/2026-09-28-aiops-learning-lab-course.md
  - docs/plans/2026-09-28-rewrite-observability-metrics-section.md
---

# Goal

Publish the five existing Chapter 2 lesson nodes in the AIOps course using the
approved Prometheus chapter from
`2026-09-28-observability-engineering-metrics-logs-traces.md`. Preserve the
technical content while adapting its layout to the established Learning Lab MDX
format.

# Lineage

Continues the AIOps course created in
[2026-09-28-aiops-learning-lab-course.md](./2026-09-28-aiops-learning-lab-course.md)
and uses the edited source approved in
[2026-09-28-rewrite-observability-metrics-section.md](./2026-09-28-rewrite-observability-metrics-section.md).

# Decisions (locked)

- Create exactly five Vietnamese MDX files matching the Chapter 2 lesson IDs
  already registered in `src/content/learning/aiops/table-of-contents.ts`.
- Change only those five catalog entries from `missing` to `published`.
- Keep lesson titles character-for-character identical to the Vietnamese TOC
  titles and keep each `lessonMetadata.headings` list synchronized with its
  rendered `###` headings.
- Preserve the approved source's technical claims, examples, PromQL, YAML,
  formulas, thresholds, caveats, and lab credentials.
- Layout may change where an existing shared Learning Lab component improves the
  progression. Reuse Markdown and existing shared components before adding code.
- Add no AIOps-specific React component, dependency, registry branch, route, or
  duplicate data model. This is the Ponytail shortest path through the existing
  MDX and catalog architecture.
- Do not reference the source's unavailable `images/...` files from runtime MDX.
  Use prose, code, tables, and existing shared components instead. Image assets
  can be added later only when real R2 assets are supplied.
- Keep Learning Lab light-only behavior unchanged. Do not add theme branches or
  local styling.
- Apply the approved editorial rules: context before terminology, no repeated
  conclusions, no unnecessary semicolons, and no claim that a metric alone
  proves application health or root cause.

# Planned files

- `src/content/learning/aiops/2.1-prometheus-metrics-pipeline.vi.mdx`
- `src/content/learning/aiops/2.2-exposing-prometheus-metrics.vi.mdx`
- `src/content/learning/aiops/2.3-prometheus-time-series-data-model.vi.mdx`
- `src/content/learning/aiops/2.4-promql-operational-signals.vi.mdx`
- `src/content/learning/aiops/2.5-grafana-metrics-dashboard.vi.mdx`
- `src/content/learning/aiops/table-of-contents.ts`

# Phases

## Phase 0: Store and approve the plan

- Store this plan as the first write for the Chapter 2 implementation.
- Pause for explicit approval.

## Phase 1: Author the five lessons

- Split source sections 2.1 through 2.5 along the existing TOC lesson boundary.
- Add exact metadata, introductory context, headings, code blocks, formulas, and
  tables to each MDX lesson.
- Reuse `LessonNote` only for concise first-use definitions already expressed as
  definition blocks in the source. Use other shared components only when they
  replace weaker prose rather than decorate it.

## Phase 2: Publish the catalog nodes

- Replace the five Chapter 2 `missing(...)` entries with `published(...)` entries.
- Leave Chapters 3 through 5 and every unrelated domain untouched.

## Phase 3: Verify and record

- Run the narrow content and TypeScript verification available through
  `npm run verify`.
- Check exact heading contracts, metadata and TOC title equality, lesson file
  discovery, absence of semicolons in authored prose, and the final diff scope.
- Record the actual files and verification result in this execution log.

# Out of scope

- Chapters 3 through 5.
- English locale files.
- New illustrations, screenshots, or R2 uploads.
- New shared or domain-specific React components.
- Changes to the approved source chapter except separately requested editorial
  corrections.

# Execution log

- 2026-09-28T23:13:16+07:00: Draft plan created after inspecting the AIOps TOC,
  Chapter 1 MDX conventions, the approved Chapter 2 source, shared component
  availability, and the current dirty worktree. Awaiting explicit approval.
- 2026-09-28T23:15:20+07:00: User approved the plan and explicitly limited this
  execution to Phases 1 and 2. Status advanced through `approved` to
  `executing`; verification and completion remain deferred.
- 2026-09-28T23:18:00+07:00: Completed Phase 1 by adding the five planned
  Vietnamese Chapter 2 MDX lessons. The lessons use only existing Markdown and
  the shared `BlockMath` component, and do not reference unavailable image
  assets.
- 2026-09-28T23:18:00+07:00: Completed Phase 2 by changing the five existing
  Prometheus lesson nodes from `missing` to `published`. Stopped at the
  user-requested checkpoint without running Phase 3 verification.
- 2026-09-28T23:26:30+07:00: Aligned the five Chapter 2 lessons with the Chapter
  1 presentation pattern at the user's request. Converted all eleven definition
  blockquotes to shared `LessonNote` info boxes and merged adjacent introductory
  sentences that did not need separate paragraphs. No test or build command was
  run because Phase 3 remains outside the requested checkpoint.
- 2026-09-28T23:29:18+07:00: Fixed the cardinality `BlockMath` formula by using
  single LaTeX command backslashes, matching the working Chapter 1 formulas.
  Confirmed that no double-backslash LaTeX commands remain in Chapter 2 MDX.
- 2026-09-28T23:57:22+07:00: Restored all sixteen source image positions as
  visible `LessonNote` warning placeholders containing `TODO(image)`, the
  original source path, and alt text. Mechanical comparison found sixteen source
  images and sixteen matching runtime flags with no missing or extra paths. The
  distribution is 2, 2, 1, 8, and 3 placeholders across lessons 2.1 through 2.5.
- 2026-09-29T00:02:31+07:00: Reworked the PromQL hands-on prose as a continuous
  investigation while preserving all nine headings, seven PromQL blocks, eight
  image flags, definitions, queries, and lab values. Added transitions between
  collection, traffic, errors, resources, latency, aggregation, and reliability;
  merged fragmented result/caveat sentences; and added a lead-in for the summary
  table. No test or build command was run.
- 2026-09-29T00:09:04+07:00: Removed generic baseline, capacity, production,
  low-traffic, risk, and root-cause disclaimers from the PromQL hands-on lesson.
  Rewrote each result around the query's concrete output while retaining the
  semantic boundaries required to interpret `up`, Counter resets, and P95
  aggregation correctly. Confirmed nine headings, seven PromQL blocks, eight
  image flags, and zero semicolons remain. No test or build command was run.
- 2026-09-29T00:12:32+07:00: Added concrete need-before-concept bridges for
  PromQL, Counter, and Gauge. The introduction now starts from raw time-series
  values, Request Rate starts from the gap between an accumulated total and a
  rate, and Gauge starts from memory allocation and release. Preserved nine
  headings, seven PromQL blocks, eight image flags, and zero semicolons. No test
  or build command was run.
- 2026-09-29T00:19:35+07:00: Reduced the hands-on instruction to the execution
  context and the exact meaning of `[5m]` for `rate()` queries. Removed the
  repeated workflow description before the final overview table so the overview
  now acts as a direct recap. Preserved nine headings, seven PromQL blocks, eight
  image flags, and zero semicolons. No test or build command was run.
- 2026-09-29T00:45:13+07:00: Completed final verification. `npm run typecheck`
  and `npm run build` both passed. The test suite was not rerun because the local
  Node.js version is 22.17.1 while the project requires Node.js 24 or newer, and
  the earlier test attempt failed while loading TypeScript test files under the
  unsupported runtime. Marked the implementation complete.

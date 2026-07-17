---
title: Project History, Docs, and Test Consolidation
status: done
created: 2026-07-14T13:08:00+07:00
updated: 2026-07-14T13:16:15+07:00
author: dtbinh
task: "Compact superseded plan history, synchronize active documentation, and reduce redundant test cases without reducing coverage."
supersedes:
  - docs/plans/2026-07-02-architecture-priority-refactors.md
  - docs/plans/2026-07-12-learning-lab-ui-ux-polish.md
  - docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md
---

# Goal

Giảm chi phí đọc và bảo trì của repository mà không làm mất lịch sử quyết định hoặc regression coverage:

- compact các chuỗi plan cũ đã supersede vào plan owner còn sống;
- đồng bộ README, architecture, AGENTS và wiki với MDX/TOC Learning Lab hiện tại;
- giảm 107 top-level test cases về khoảng 60–70 bằng table-driven grouping có
  nhãn, giữ nguyên assertion coverage và ranh giới module.

# Lineage

Tiếp nối ba owner hiện tại:

- [Architecture Priority Refactors](./2026-07-02-architecture-priority-refactors.md)
- [Learning Lab UI/UX Review and Polish](./2026-07-12-learning-lab-ui-ux-polish.md)
- [Learning Lab Content Architecture Migration](./2026-07-14-approved-llm-lessons-mdx-migration.md)

# Baseline audit

- `docs/plans/`: 30 files, 5,194 lines; all except the original scaffold are
  marked `done`, with multiple superseded chains and one already-missing link.
- `src/lib/*.test.ts`: 25 files, 107 `test(...)` cases.
- Active docs still contain pre-refactor claims about inert Learning Lab
  scaffolding, practice fixtures/registry, and duplicated README navigation.
- Main is at `6093693`; the completed Home card work is isolated in commit
  `b4554c5` on `refactor/learning-lab-docs-test-consolidation`.

# Decisions (locked)

## Plan history

- Preserve decision history by absorbing concise goals, locked decisions,
  outcomes, verification, and absorbed filenames into an existing owner plan
  before deleting a superseded file.
- Compact related chains, not arbitrary dates:
  - forward-pass follow-ups into `2026-06-21-forward-pass-all-architectures.md`;
  - early Learning Lab activation/domain/course/localization history into
    `2026-06-21-learning-lab-refactor.md`;
  - Learning Lab palette/Home/search/UI history into
    `2026-07-12-learning-lab-ui-ux-polish.md`;
  - architecture review findings into
    `2026-07-02-architecture-priority-refactors.md`;
  - pre-MDX LLM compact history into
    `2026-07-14-approved-llm-lessons-mdx-migration.md` where still relevant.
- Keep distinct docs/workflow/README plans whose scope is not duplicated.
- Rewrite all surviving lineage and external links; no dangling plan links.

## Documentation

- Treat code and `wiki/concepts/learning-lab.md` as the current Learning Lab
  authority.
- Remove stale scaffold/practice claims and duplicated README sections.
- Update existing docs only; create no additional long-lived docs page.
- Keep `wiki/log.md` chronological but remove or clarify contradictory current
  claims when later entries supersede them.

## Tests

- Target 60–70 top-level test cases; the exact count follows safe grouping.
- Preserve every meaningful assertion, fixture, error case, route alias, and
  boundary check. Reduction is organizational, not coverage deletion.
- Use labeled tables/loops and assertion messages so failures still identify
  the scenario.
- Keep WorkerService timing tests, Python subprocess groups, and MDX validator
  integration cases isolated when shared setup or early failure would obscure
  behavior.
- Do not merge unrelated test files merely to reduce file count; source-module
  ownership remains more important than fewer files.

# Phases

1. Compact plan families and repair all lineage/backlinks.
2. Synchronize `AGENTS.md`, `README.md`, `docs/ARCHITECTURE.md`, wiki indexes,
   Learning Lab docs, and log wording against current code.
3. Convert safe unit-test clusters to labeled table-driven cases, checking the
   running count after each group and stopping within the 60–70 target.
4. Run link/path audits, conflict-marker checks, `git diff --check`, and
   `npm run verify`.
5. Record before/after plan file/line counts, test file/case counts, verification
   results, and any deliberately retained exceptions in this execution log.

# Acceptance criteria

- Superseded plan content is summarized before source files are removed.
- No Markdown link points to a removed plan or concept page.
- Active docs describe typed TOCs, locale MDX, canonical exercise lessons, and
  derived Review mode consistently.
- Test count is 60–70 and all prior behavior categories remain asserted.
- TypeScript, tests, MDX validation, and production build pass.
- Cleanup remains a separate commit from `b4554c5`; no push is performed.

# Out of scope

- No runtime product behavior or visual redesign.
- No deletion of tests solely to reach a numeric target.
- No rewrite of published Git history, commit squashing, push, or PR creation.

# Execution log

- 2026-07-14T13:08:00+07:00 — Audited plan inventory/linkage, active docs, and
  all 107 test declarations; stored draft checkpoint before cleanup writes.
- 2026-07-14T13:12:00+07:00 — User approved with “ok”; plan advanced through
  `approved` to `executing`.
- 2026-07-14T13:14:00+07:00 — Absorbed 19 superseded plans into the forward
  pass, Learning Lab foundation, Learning Lab UI, architecture priority, and
  MDX migration owner records. The pre-task history contained 30 files/5,194
  lines; the final directory contains 12 files/2,892 lines including this plan.
- 2026-07-14T13:15:00+07:00 — Updated AGENTS, CLAUDE, README, architecture,
  wiki indexes, RL status, and wiki log to reflect local Pyodide delivery,
  active typed TOCs, locale MDX, canonical exercise lessons, and derived Review
  mode. Removed the duplicated README documentation/current-scope list.
- 2026-07-14T13:15:00+07:00 — Consolidated synchronous scenario tests in 18
  module-owned test files. Test files remain 25; top-level cases changed from
  107 to 68. Preserved WorkerService timing, Python subprocess, MDX validation,
  and other isolation-sensitive cases as separate tests.
- 2026-07-14T13:16:15+07:00 — Markdown path audit found zero real missing
  targets (the only ignored match is the documented filename placeholder in
  `docs/WORKFLOW.md`). `git diff --check` passed. `npm run verify` passed
  TypeScript, all 68 Node tests including MDX validation, and the 2,499-module
  production build. The existing Three.js chunk advisory and empty
  `react-vendor` chunk remain unchanged. Plan marked done.

# AGENTS.md

Codex reads this file automatically when working in this repository.

## Required Workflow

Follow [docs/WORKFLOW.md](docs/WORKFLOW.md) for every non-trivial task:

```text
prompt -> grep context -> specify task -> write & store a plan
  -> get approval -> execute -> record modifications -> update docs
```

Do not modify files before an approved, stored plan exists. The plan file under
`docs/plans/` is the first allowed write for non-trivial work.

## Repo Orientation

Read [CLAUDE.md](CLAUDE.md) for the current architecture orientation, key files,
commands, and gotchas. Treat it as the shared repo briefing for AI agents and
humans.

The short architecture shape is:

```text
EditorPane -> zustand store -> WorkerService -> Pyodide worker + torchstub
  -> IRGraph -> computeLayout -> Canvas3D
```

## Learning Lab Work

For Landing Page or Learning Lab work, read these before editing:

- [docs/plans/2026-06-21-learning-lab-refactor.md](docs/plans/2026-06-21-learning-lab-refactor.md)
- [docs/plans/2026-06-21-landing-ui-iteration.md](docs/plans/2026-06-21-landing-ui-iteration.md)
- [docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md](docs/plans/2026-07-14-approved-llm-lessons-mdx-migration.md)
- [docs/plans/2026-08-18-linear-algebra-full-curriculum-and-refinement.md](docs/plans/2026-08-18-linear-algebra-full-curriculum-and-refinement.md)
- [wiki/concepts/learning-lab.md](wiki/concepts/learning-lab.md)

Learning Lab is active runtime behavior. Preserve its typed-TOC -> React-free
catalog -> route/selector flow and locale-MDX authored-content boundary. Do not
reintroduce catalog metadata into `localization.ts`, parallel practice payloads,
or non-canonical lesson routes unless the current approved plan explicitly
requires an architecture change.

Do not create a new docs page when an existing relevant page already owns the
topic. Update the existing page instead. Create a new page only when the work is
substantially different in scope or needs its own long-lived reference surface.

## Verification

Use the narrowest verification that matches the change. For code or behavior
changes, prefer:

```bash
npm run verify
```

For docs-only changes, inspect links and run a broader verification only when
the change can affect TypeScript, tests, or build output.

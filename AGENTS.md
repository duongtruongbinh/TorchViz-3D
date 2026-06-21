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

## Learning Lab Scaffold

For Landing Page or Learning Lab work, read these before editing:

- [docs/plans/2026-06-21-learning-lab-refactor.md](docs/plans/2026-06-21-learning-lab-refactor.md)
- [wiki/concepts/learning-lab-refactor.md](wiki/concepts/learning-lab-refactor.md)

The scaffold files are intentionally inert until a later approved implementation
plan imports them into the running app. Do not change `App.tsx`, add routing, or
implement real UI store behavior unless the current approved plan explicitly
requires it.

## Verification

Use the narrowest verification that matches the change. For code or behavior
changes, prefer:

```bash
npm run verify
```

For docs-only changes, inspect links and run a broader verification only when
the change can affect TypeScript, tests, or build output.

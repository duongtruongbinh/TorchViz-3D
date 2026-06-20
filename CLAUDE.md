# CLAUDE.md

Guidance for AI agents (and a fast orientation for humans) working in this repo.

## Mandatory workflow

This project has a **mandatory task workflow**. Follow it for every non-trivial
task. The full definition is in [docs/WORKFLOW.md](docs/WORKFLOW.md); the short
form:

```
prompt → grep context → specify task (one question per turn)
  → write & store a plan (docs/plans/) → get approval
    → execute → record the modifications → update docs
```

**Hard rule: do not modify any file before an approved, stored plan exists.**
The plan file in `docs/plans/` is the first allowed write. Plans are named
`YYYY-MM-DD-<slug>.md`, carry frontmatter (`title, status, created, updated,
author, task, supersedes`), and **cite their predecessor** via `supersedes:` +
a `# Lineage` section. See [docs/WORKFLOW.md](docs/WORKFLOW.md) for the template.

Trivial fixes (typos, one-line doc edits) are exempt. When in doubt, write the plan.

## What this project is

TorchViz-3D renders PyTorch `nn.Module` source as interactive 3D isometric block
diagrams, **entirely in the browser**. No code or data leaves the machine.

## Architecture in one screen

```
EditorPane (Monaco) → zustand store → WorkerService
  → Web Worker (Pyodide / Python on WASM) + torchstub
  → IRGraph JSON → computeLayout → LayoutData → Canvas3D (R3F/three.js)
```

The non-obvious core: we do **not** run real PyTorch. A fake `torch.nn` called
**`torchstub`** (`src/lib/python_sources.ts`) does **shape inference only** — no
tensor math — and traces module calls into an `IRGraph`. To draw a network you
only need each layer's output shape and parameter count.

Read [wiki/architecture.md](wiki/architecture.md) for the full pipeline, and the
[wiki/](wiki/index.md) OKF knowledge bundle for per-subsystem detail.

## Key files

| Path | Role |
|---|---|
| `src/lib/python_sources.ts` | `torchstub` — the fake, shape-only `torch.nn`. |
| `src/workers/pyodideWorker.ts` | Boots Pyodide; runs user code; emits IR. |
| `src/lib/irTypes.ts` | IR + Layout types (the worker↔renderer contract). |
| `src/lib/layout.ts` | Pure IR → 3D `LayoutData` engine. |
| `src/lib/constants.ts` | Colors/theme — shared by canvas, Inspector, SVG. |
| `src/store/useStore.ts` | zustand state + built-in templates. |
| `src/components/Canvas3D.tsx` | React Three Fiber scene. |

## Gotchas

See [wiki/reference/gotchas.md](wiki/reference/gotchas.md). The big ones:
`WRAPPER_LINE_OFFSET` in the worker is auto-derived from the injected preamble
(`countPythonPreambleLines`), not hardcoded; the layout axis convention is
intentionally swapped; op color lives in `visualKind.ts` (not `constants.ts`);
module resolution is split between an importmap and Vite bundling. Desktop +
online only.

## Common commands

```bash
npm run dev      # local dev server (http://localhost:3000)
npm test         # node --test on src/lib/*.test.ts
npm run build    # production build to dist/
```

## Documentation surfaces

- `wiki/` — OKF knowledge bundle (structured, agent-readable). Start here.
- `docs/ARCHITECTURE.md`, `docs/TORCHSTUB.md` — long-form prose deep-dives.
- `docs/plans/` — the history of *why* changes were made.
- `docs/WORKFLOW.md` — the mandatory process above.

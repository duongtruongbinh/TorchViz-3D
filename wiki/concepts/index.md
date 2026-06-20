---
title: Concepts
type: Index
updated: 2026-06-21
---

# Concepts

The subsystem pages. Each documents one part of the pipeline against its actual
source file. Read them in roughly pipeline order:

1. [torchstub](../concepts/torchstub.md) — the shape-only fake `torch.nn` that
   traces a model into the IR. `src/lib/python_sources.ts`.
2. [pyodide-worker](../concepts/pyodide-worker.md) — the Web Worker that boots
   Pyodide, runs user code, and emits IR. `src/workers/pyodideWorker.ts`.
3. [ir-contract](../concepts/ir-contract.md) — the IRGraph/IRNode/IREdge types
   that bound the Python worker and the TypeScript renderer. `src/lib/irTypes.ts`.
4. [layout-engine](../concepts/layout-engine.md) — `computeLayout`, the pure
   IR → 3D `LayoutData` function. `src/lib/layout.ts`.
5. [state-store](../concepts/state-store.md) — the zustand store and templates.
   `src/store/useStore.ts`.
6. [rendering](../concepts/rendering.md) — Canvas3D, the visual taxonomy, theme.
   `src/components/Canvas3D.tsx`, `src/lib/visualKind.ts`, `src/lib/constants.ts`.

See also the [architecture overview](../architecture.md) for how they connect.

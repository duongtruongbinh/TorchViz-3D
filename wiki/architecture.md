---
title: Architecture Overview
type: Architecture Overview
updated: 2026-06-21
---

# Architecture Overview

TorchViz-3D turns PyTorch `nn.Module` source into an interactive 3D isometric
block diagram, **entirely in the browser**. This page is the agent-readable map
of the pipeline; the narrative version is [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).

## The pipeline

```
EditorPane (Monaco)
  → setCode()                         src/components/EditorPane.tsx
  → zustand store                     src/store/useStore.ts
  → WorkerService.run()               src/lib/workerService.ts
      postMessage({ code, inputShape, requestId })
  → Web Worker (Blob URL)             src/workers/pyodideWorker.ts
      Pyodide (Python on WASM, CDN) + torchstub   src/lib/python_sources.ts
  → IRGraph JSON  (success | partial | error)
  → setIrResult → computeLayout(ir, collapsedIds)  src/lib/layout.ts
  → LayoutData
  → Canvas3D (React Three Fiber / three.js)        src/components/Canvas3D.tsx
    + Inspector / BottomTabs
```

1. **Edit** — user writes an `nn.Module` in Monaco; `setCode` updates the store.
2. **Run** — `WorkerService.run()` reads code + input shape and posts them to the
   worker with a monotonically increasing `requestId`.
3. **Trace** — the worker boots Pyodide, installs `torchstub`, executes the user's
   code against it, and serializes the recorded graph to `IRGraph` JSON.
4. **Layout** — on the main thread, `setIrResult` calls the **pure** function
   `computeLayout(ir, collapsedIds)` to assign 3D coordinates, sizes, and colors.
5. **Render** — `Canvas3D` draws blocks and edges; the Inspector and BottomTabs
   show the layer tree, stats, and terminal output.

Everything runs locally. Pyodide, Tailwind, and fonts are fetched from CDNs at
runtime, so the app needs network access on first load.

## The central idea: `torchstub`

We do **not** run real PyTorch. To *draw* a network we only need each layer's
**output shape** and **parameter count** — not its numeric output. So the worker
writes a small fake package, `torchstub`, into Pyodide's virtual filesystem and
runs the user's code against it. It mimics the `torch.nn` API but does **shape
inference only**, tracing module calls into an `IRGraph`.

See [concepts/torchstub](concepts/torchstub.md) for the full mechanism.

## Subsystems

| Subsystem | Page | Source of truth |
|---|---|---|
| Shape-only fake torch | [torchstub](concepts/torchstub.md) | `src/lib/python_sources.ts` |
| Worker / Pyodide host | [pyodide-worker](concepts/pyodide-worker.md) | `src/workers/pyodideWorker.ts` |
| Worker↔renderer contract | [ir-contract](concepts/ir-contract.md) | `src/lib/irTypes.ts` |
| Layout engine | [layout-engine](concepts/layout-engine.md) | `src/lib/layout.ts` |
| App state + templates | [state-store](concepts/state-store.md) | `src/store/useStore.ts` |
| 3D rendering + taxonomy | [rendering](concepts/rendering.md) | `src/components/Canvas3D.tsx`, `src/lib/visualKind.ts` |

## Key invariants

- **Shape, never data.** No tensor math anywhere; `Tensor` carries only a shape.
- **The IR is the boundary.** Python emits it; TypeScript consumes it. See
  [ir-contract](concepts/ir-contract.md).
- **Layout is pure.** `computeLayout` is React-free and unit-tested.
- **Stale renders are dropped.** `WorkerService` ignores any response whose
  `requestId` is not the latest.
- **Failures degrade, not crash.** Layout errors fall back to `layout: null`
  (blank canvas); shape errors render an inline red node.

See [reference/gotchas](reference/gotchas.md) for the fragile spots.

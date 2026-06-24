---
title: Concepts
type: Index
updated: 2026-06-24
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
   `src/components/canvas/Canvas3D.tsx`, `src/lib/visualKind.ts`, `src/lib/constants.ts`.
7. [learning-lab-refactor](../concepts/learning-lab-refactor.md) — the
   Landing/AppShell entry point plus active Learning Lab Path/Review surface.
   `src/components/landing/*`, `src/components/learning/*`, `src/core/learningContent.ts`.
8. [reinforcement-learning](../concepts/reinforcement-learning.md) — the
   separate Reinforcement Learning surface with RL Path/Review practice.
   `src/components/reinforcement_learning/*`, `src/core/rlLearningContent.ts`.
9. [forward-pass](../concepts/forward-pass.md) — the animated forward pass:
   ordered stops, CIFAR-10 input packet, per-op effects, and the generalized
   availability gate. `src/components/mnist-demo/*`, `src/components/operation-effects/*`,
   `src/lib/mnistCompatibility.ts`.

See also the [architecture overview](../architecture.md) for how they connect.

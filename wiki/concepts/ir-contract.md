---
title: IR Contract
type: Data Contract
source: src/lib/irTypes.ts
updated: 2026-06-21
---

# IR Contract

The `IRGraph` JSON is the boundary between the Python worker and the TypeScript
renderer. Python's `GraphRecorder.to_dict()` produces it; the TypeScript types in
`src/lib/irTypes.ts` consume it. Keep the two ends in sync — this is the single
contract everything downstream depends on.

## Types

```ts
interface IRNode {
  id: string;
  name: string;
  op_type: string;          // drives color + label (see visualKind)
  in_shape: number[];
  out_shape: number[];
  params: number;
  group_id?: string;
  lineno?: number;          // source line, for editor highlighting
  meta?: Record<string, any>;   // op-specific extras (kernel, stride, heads…)
  children?: IRNode[];      // present on containers
  is_container?: boolean;
  collapsed?: boolean;
  error?: string;           // shape-inference failure message
  has_error?: boolean;
  parentId?: string;
}

interface IREdge {
  from: string;
  to: string;
  kind: 'main' | 'residual' | 'concat';
}

interface IRStats {
  total_params: number;
  approx_memory_mb: number;
}

interface IRGraph {
  nodes: IRNode[];          // top-level (root) nodes; containers nest via children
  edges: IREdge[];
  stats: IRStats;
  error?: { message: string; lineno: number; hint: string };
  error_node_id?: string;   // node that failed shape inference
}
```

## Producer side (Python)

`to_dict()` (in `PY_RECORDER`) emits:

- `nodes` = the root scope's children (containers carry nested `children`),
- `edges` with `kind` ∈ `main | residual | concat` (tagged by producing op:
  `Add`→`residual`, `Concat`→`concat`, else `main`),
- `stats.total_params` = sum of root children's `params` (`approx_memory_mb` is
  currently `0`),
- `error_node_id` if any node failed shape inference,
- `error` if there was a top-level `execution_error`.

## Consumer side (TypeScript)

- `LayoutNode extends IRNode` adds `x/y/z`, `width/height/depth`, `color`,
  optional `opacity`. `LayoutEdge extends IREdge` adds `points[]`. `LayoutData`
  bundles positioned nodes, edges, and `bounds`. See
  [layout-engine](../concepts/layout-engine.md).
- Tree helpers in `irTypes.ts`: `findNodeById`, `findNodeByLine` (editor↔diagram
  sync), and `initCollapsedIds` (smart-collapse defaults — never collapses the
  root; auto-expands containers with `< 4` children at depth > 0).

## Message envelope

The worker wraps the graph as `success` (clean), `partial` (graph + error), or
`error` (no graph), each with a `requestId`. `WorkerService` discards any
response whose `requestId` isn't the latest, preventing stale renders.

## Related

- [torchstub](../concepts/torchstub.md) — what fills these nodes in.
- [pyodide-worker](../concepts/pyodide-worker.md) — the message envelope.
- [layout-engine](../concepts/layout-engine.md) — what reads this contract.

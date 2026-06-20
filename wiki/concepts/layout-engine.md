---
title: Layout Engine
type: Subsystem
source: src/lib/layout.ts
updated: 2026-06-21
---

# Layout Engine

`computeLayout(ir, collapsedIds)` is a **pure function** (no React, easy to test)
that walks the IR tree left-to-right, assigns each node a 3D position and size,
and routes the edges, producing `LayoutData`. Source: `src/lib/layout.ts`.

```ts
function computeLayout(ir: IRGraph, collapsedIds: Set<string>): LayoutData
```

## Sizing

### Logarithmic scale

```ts
scaleDim(val, minPixel = 1, factor = 0.8) = max(minPixel, log2(val) * factor)
```

So a 512-channel layer isn't 256× larger than a 2-channel one.

### `leafSize` and the axis swap (deliberate)

`leafSize(shape)` maps tensor dims → block dims. The return line is
**intentional, not a bug**:

```ts
// 4D [N, C, H, W]: h = scaleDim(H), w = scaleDim(W), d = scaleDim(C)
return { width: d, height: h, depth: w };
```

The block's visual **`width` encodes channel/feature depth**, while
**`height`/`depth` encode the spatial dims**. This keeps data flowing along +X
with channels read as block thickness. 3D, 2D shapes have their own branches
(sequence length / feature dims).

## Containers

Each container is either:

- **Collapsed** (`collapsedIds.has(id)`): drawn as one block via
  `collapsedSize`; all descendants are remapped to the container id through
  `collapsedRemap` (so edges crossing the boundary still resolve).
- **Expanded**: laid out recursively, then wrapped in a translucent box whose
  padding shrinks with depth (`pad = max(1.0, BASE_PADDING - nestLevel*0.5)`),
  sized to its children plus padding. Color/opacity come from
  `getExpandedContainerColor` / `getExpandedContainerOpacity` (depth-based).

Layout constants: `BASE_PADDING = 3.0`, `NODE_GAP = 2.5`.

## Edge routing ("circuit board")

`layoutEdgesStructured` resolves each edge's endpoints (applying
`collapsedRemap`), dedups by `from->to`, and emits orthogonal polylines:

- **`main`/`concat`**: a 4-point step from the source's right face to the
  destination's left face.
- **`residual`**: a 6-point arc that lifts *over* the blocks between source and
  target. The arc height is `min(maxBlockTopBetween + EDGE_LIFT_CLEARANCE,
  start.y + ARC_HEIGHT_CEILING)` so skip connections read as arcs above the
  network. (`EDGE_LIFT_CLEARANCE = 0.5`, `ARC_HEIGHT_CEILING = 4`.)

## Colors

Leaf colors come from `getVisualMeta(op_type).color` in
[`src/lib/visualKind.ts`](../concepts/rendering.md) (error nodes
use `ERROR_COLOR`). Container colors come from `constants.ts`. `visualKind.ts` is
the single source of truth shared by the 3D canvas and SVG export.

> The prose [docs/TORCHSTUB.md](../../docs/TORCHSTUB.md) still points at
> `OP_MATCHERS`/`OP_COLORS` in `constants.ts` for op color; coloring has since
> moved to `visualKind.ts`. See [reference/gotchas](../reference/gotchas.md).

## Output

`LayoutData = { nodes: LayoutNode[], edges: LayoutEdge[], bounds }`. `bounds.minX/maxX`
are derived from node extents; `minY/maxY/minZ/maxZ` are fixed at ±5.

## Failure mode

`computeLayout` is wrapped in `try/catch` at both call sites in the store
([state-store](../concepts/state-store.md)); a thrown error degrades to
`layout: null` (blank canvas) rather than crashing.

## Related

- [ir-contract](../concepts/ir-contract.md) — the input type.
- [rendering](../concepts/rendering.md) — what draws `LayoutData`.
- [state-store](../concepts/state-store.md) — who calls `computeLayout`.

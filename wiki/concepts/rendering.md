---
title: Rendering
type: Subsystem
source: src/components/Canvas3D.tsx, src/lib/visualKind.ts, src/lib/constants.ts
updated: 2026-06-21
---

# Rendering

The renderer turns `LayoutData` into an interactive 3D scene. It spans three
files: `Canvas3D.tsx` (the React Three Fiber scene), `visualKind.ts` (the visual
taxonomy: op → color/geometry/label), and `constants.ts` (theme, fonts, render
orders).

## Canvas3D

`src/components/Canvas3D.tsx` is the React Three Fiber / three.js scene. It reads
`layout` from the [store](../concepts/state-store.md) and draws:

- **Blocks** for each `LayoutNode` (positioned/sized by the
  [layout engine](../concepts/layout-engine.md), styled by `visualKind`),
- **Edges** as the routed polylines (`main`/`residual`/`concat`),
- camera controls, captions, input tiles, and per-op effect overlays
  (`src/components/operation-effects/`).

Hover/selection write back to the store (`highlightNodeId`, `selectedNodeId`),
keeping the editor, Inspector, and canvas in sync.

## Visual taxonomy (`visualKind.ts`)

`src/lib/visualKind.ts` is the **single source of truth** for op appearance,
consumed by both Canvas3D (3D) and `svgExport` (2D/2.5D).

- **`getVisualKind(opType)`** classifies an `op_type` into a `VisualKind`
  (`Conv`, `Linear`, `Pool`, `Norm`, `Activation_*`, `Dropout`, `Flatten`,
  `AddConcat`, `Attention`, `Embedding`, `RNN`, `Upsample`, `Container`,
  `Default`) via an ordered regex table `KIND_RULES`. **Order matters** — the
  first match wins (e.g. exact `^relu$` before the generic `conv`/`linear`
  fallbacks).
- **`getVisualMeta(opType)`** returns the kind plus render metadata: `color`,
  `cornerRadius`, dimension multipliers (`widthMul`/`heightMul`/`depthMul`),
  SVG stroke style, `specialGeometry` flag, and `labelOverride`.
- **`getLegendItems()`** produces the de-duplicated legend; `computeFontSize`
  gives scale-aware, clamped label sizing.

> Op color lives **here**, not in `constants.ts`. The prose
> [docs/TORCHSTUB.md](../../docs/TORCHSTUB.md) still references `OP_MATCHERS` /
> `OP_COLORS` — stale. To recolor or add an op category, edit `KIND_RULES` +
> `META_MAP`. See [reference/gotchas](../reference/gotchas.md).

## Theme & constants (`constants.ts`)

`src/lib/constants.ts` centralizes non-op theme: the web font URL + text props,
**render orders** (z-stacking of edges, labels, captions, panels), HTML overlay
z-indices, edge colors, **container** colors/opacity
(`getCollapsedContainerColor`, `getExpandedContainerColor`,
`getExpandedContainerOpacity` — used by the layout engine), and button theme.

## Related

- [layout-engine](../concepts/layout-engine.md) — produces what this draws.
- [state-store](../concepts/state-store.md) — supplies `layout`, holds selection.
- [reference/gotchas](../reference/gotchas.md) — desktop-only, CDN fonts.

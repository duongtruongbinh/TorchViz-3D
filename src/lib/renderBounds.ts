import type { LayoutData, LayoutNode } from './irTypes.ts';
import { getVisualMeta } from './visualKind.ts';

export interface WorldBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export interface RenderableNodeBox extends WorldBounds {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
}

export interface AdaptiveGridSpec {
  size: number;
  divisions: number;
  center: [number, number, number];
}

export function getFlowSafeGroundGridLinePositions(
  spec: AdaptiveGridSpec,
  flowMinZ: number,
  flowMaxZ: number,
  clearance = spec.size / spec.divisions,
): Float32Array {
  const positions: number[] = [];
  const pointsPerSide = spec.divisions + 1;
  const start = -spec.size / 2;
  const step = spec.size / spec.divisions;
  const end = spec.size / 2;
  const corridorMinZ = flowMinZ - clearance;
  const corridorMaxZ = flowMaxZ + clearance;

  for (let index = 0; index < pointsPerSide; index++) {
    const coordinate = start + index * step;

    // Lines across Z stay perpendicular to the model's left-to-right flow.
    positions.push(coordinate, 0, start, coordinate, 0, end);

    // Keep longitudinal lines outside the model corridor so no ground line can
    // appear to continue a connector through or beyond a block.
    const worldZ = spec.center[2] + coordinate;
    if (worldZ < corridorMinZ || worldZ > corridorMaxZ) {
      positions.push(start, 0, coordinate, end, 0, coordinate);
    }
  }

  return new Float32Array(positions);
}

export function getRenderableNodeSize(node: LayoutNode): { width: number; height: number; depth: number } {
  if (node.is_container) {
    return { width: node.width, height: node.height, depth: node.depth };
  }

  const meta = getVisualMeta(node.op_type);
  return {
    width: node.width * meta.widthMul,
    height: node.height * meta.heightMul,
    depth: node.depth * meta.depthMul,
  };
}

export function getRenderableNodeBox(node: LayoutNode): RenderableNodeBox {
  const { width, height, depth } = getRenderableNodeSize(node);
  return {
    x: node.x,
    y: node.y,
    z: node.z,
    width,
    height,
    depth,
    minX: node.x - width / 2,
    maxX: node.x + width / 2,
    minY: node.y - height / 2,
    maxY: node.y + height / 2,
    minZ: node.z - depth / 2,
    maxZ: node.z + depth / 2,
  };
}

export function collectRenderableNodes(nodes: LayoutNode[], out: LayoutNode[] = []): LayoutNode[] {
  for (const node of nodes) {
    out.push(node);
    if (node.children?.length) collectRenderableNodes(node.children, out);
  }
  return out;
}

function emptyBounds(): WorldBounds {
  return { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 };
}

function includePoint(bounds: WorldBounds, point: { x: number; y: number; z: number }) {
  bounds.minX = Math.min(bounds.minX, point.x);
  bounds.maxX = Math.max(bounds.maxX, point.x);
  bounds.minY = Math.min(bounds.minY, point.y);
  bounds.maxY = Math.max(bounds.maxY, point.y);
  bounds.minZ = Math.min(bounds.minZ, point.z);
  bounds.maxZ = Math.max(bounds.maxZ, point.z);
}

export function getLayoutWorldBounds(
  layout: LayoutData,
  options: { includeEdges?: boolean } = {},
): WorldBounds {
  const bounds: WorldBounds = {
    minX: Infinity,
    maxX: -Infinity,
    minY: Infinity,
    maxY: -Infinity,
    minZ: Infinity,
    maxZ: -Infinity,
  };

  for (const node of collectRenderableNodes(layout.nodes)) {
    const box = getRenderableNodeBox(node);
    includePoint(bounds, { x: box.minX, y: box.minY, z: box.minZ });
    includePoint(bounds, { x: box.maxX, y: box.maxY, z: box.maxZ });
  }

  if (options.includeEdges) {
    for (const edge of layout.edges) {
      for (const point of edge.points) includePoint(bounds, point);
    }
  }

  return bounds.minX === Infinity ? emptyBounds() : bounds;
}

export function getAdaptiveGridSpec(
  bounds: WorldBounds,
  options: {
    padding?: number;
    snapStep?: number;
    gridLineStep?: number;
    groundClearance?: number;
    minSize?: number;
  } = {},
): AdaptiveGridSpec {
  const padding = options.padding ?? 20;
  const snapStep = options.snapStep ?? 20;
  const gridLineStep = options.gridLineStep ?? 2;
  const groundClearance = options.groundClearance ?? 0.35;
  const minSize = options.minSize ?? 40;
  const spanX = Math.max(1, bounds.maxX - bounds.minX);
  const spanZ = Math.max(1, bounds.maxZ - bounds.minZ);
  const rawSize = Math.max(spanX, spanZ) + padding * 2;
  const size = Math.max(minSize, Math.ceil(rawSize / snapStep) * snapStep);
  const divisions = Math.max(2, Math.round(size / gridLineStep));
  const actualGridLineStep = size / divisions;

  return {
    size,
    divisions,
    center: [
      (bounds.minX + bounds.maxX) / 2,
      bounds.minY - groundClearance,
      // Layout nodes flow along X on z=0. Offset the grid by half a cell so
      // that axis sits between lines instead of looking like a graph edge.
      (bounds.minZ + bounds.maxZ) / 2 + actualGridLineStep / 2,
    ],
  };
}

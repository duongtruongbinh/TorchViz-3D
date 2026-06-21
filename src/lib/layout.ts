import { IRGraph, IRNode, IREdge, LayoutData, LayoutNode, LayoutEdge } from './irTypes';
import { getCollapsedContainerColor, getExpandedContainerColor, getExpandedContainerOpacity, ERROR_COLOR } from './constants';
import { getVisualMeta } from './visualKind';
import { getLayoutWorldBounds, getRenderableNodeBox } from './renderBounds';

const BASE_PADDING = 3.0;
const NODE_GAP = 2.5;

/**
 * Block sizes are logarithmic so a 512-channel layer isn't 256x larger than a
 * 2-channel one. size = log2(val) * factor, clamped to a minimum.
 */
const scaleDim = (val: number, minPixel = 1, factor = 0.8) => {
  if (val <= 1) return minPixel;
  return Math.max(minPixel, Math.log2(val) * factor);
};

function leafSize(shape: number[]): { width: number; height: number; depth: number } {
  let w = 1, h = 1, d = 0.5;
  if (shape.length === 4) {
    const [, C, H, W] = shape;
    h = scaleDim(H, 1.5);
    w = scaleDim(W, 1.5);
    d = scaleDim(C, 0.5, 0.4);
  } else if (shape.length === 3) {
    const [, L, D] = shape;
    h = scaleDim(L, 2, 0.6);
    w = 0.5;
    d = scaleDim(D, 1, 0.5);
  } else if (shape.length === 2) {
    const [, F] = shape;
    h = scaleDim(F, 2, 0.6);
    w = 0.5;
    d = 0.5;
  }
  // IMPORTANT axis convention (deliberate, not a bug): the block's visual `width`
  // encodes the tensor's channel/feature depth (`d`), while `height`/`depth` encode
  // the spatial dims (`h`/`w`). This keeps data flowing along +X with channels read
  // as block thickness. See docs/ARCHITECTURE.md (Layout).
  return { width: d, height: h, depth: w };
}

function collapsedSize(node: IRNode): { width: number; height: number; depth: number } {
  if (node.out_shape?.length > 0) {
    const s = leafSize(node.out_shape);
    return {
      width: Math.max(s.width, 1.5),
      height: Math.max(s.height, 2.5),
      depth: Math.max(s.depth, 1.5),
    };
  }
  return { width: 2, height: 3, depth: 2 };
}

/** Map all descendants of a collapsed container to the container's ID. */
function mapDescendants(node: IRNode, targetId: string, map: Map<string, string>) {
  if (!node.children) return;
  for (const child of node.children) {
    map.set(child.id, targetId);
    mapDescendants(child, targetId, map);
  }
}

/**
 * Recursively layout nodes left-to-right.
 * Returns the positioned LayoutNode tree and the right-edge X cursor.
 */
function layoutNodes(
  nodes: IRNode[],
  startX: number,
  collapsedIds: Set<string>,
  nodeMap: Map<string, LayoutNode>,
  collapsedRemap: Map<string, string>,
  nestLevel = 0,
): { result: LayoutNode[]; endX: number } {
  const result: LayoutNode[] = [];
  let curX = startX;

  for (const node of nodes) {
    const isContainer = node.is_container && node.children && node.children.length > 0;
    const isCollapsed = isContainer && collapsedIds.has(node.id);

    if (!isContainer) {
      // Leaf node
      const size = leafSize(node.out_shape ?? []);
      const { children: _c, ...rest } = node;
      const ln: LayoutNode = {
        ...rest,
        x: 0,
        y: 0,
        z: 0,
        ...size,
        color: node.error ? ERROR_COLOR : getVisualMeta(node.op_type).color,
      };
      const renderBox = getRenderableNodeBox(ln);
      ln.x = curX + renderBox.width / 2;
      result.push(ln);
      nodeMap.set(node.id, ln);
      curX += renderBox.width + NODE_GAP;
    } else if (isCollapsed) {
      // Collapsed container — render as single block
      const size = collapsedSize(node);
      const { children: _c, ...rest } = node;
      const ln: LayoutNode = {
        ...rest,
        x: curX + size.width / 2,
        y: 0,
        z: 0,
        ...size,
        color: getCollapsedContainerColor(node.op_type),
        opacity: 1,
        collapsed: true,
      };
      result.push(ln);
      nodeMap.set(node.id, ln);
      mapDescendants(node, node.id, collapsedRemap);
      curX += size.width + NODE_GAP;
    } else {
      // Expanded container — dynamic padding by depth
      const pad = Math.max(1.0, BASE_PADDING - nestLevel * 0.5);
      const childStartX = curX + pad;
      const { result: childLayout, endX: childEndX } = layoutNodes(
        node.children!, childStartX, collapsedIds, nodeMap, collapsedRemap, nestLevel + 1,
      );

      let childMinX = Infinity;
      let childMaxX = -Infinity;
      let maxH = 2, maxD = 1;
      for (const ch of childLayout) {
        const box = getRenderableNodeBox(ch);
        childMinX = Math.min(childMinX, box.minX);
        childMaxX = Math.max(childMaxX, box.maxX);
        maxH = Math.max(maxH, box.height);
        maxD = Math.max(maxD, box.depth);
      }
      const rightEdge = childLayout.length > 0
        ? Math.max(childEndX - NODE_GAP + pad, childMaxX + pad)
        : curX + 2 * pad + 1;
      const leftEdge = childLayout.length > 0 ? Math.min(curX, childMinX - pad) : curX;
      const containerWidth = Math.max(rightEdge - leftEdge, 2 * pad);
      const containerH = maxH + 2 * pad;
      const containerD = maxD + 2 * pad;
      const centerX = leftEdge + containerWidth / 2;

      const { children: _c, ...rest } = node;
      const ln: LayoutNode = {
        ...rest,
        x: centerX,
        y: 0,
        z: 0,
        width: containerWidth,
        height: containerH,
        depth: containerD,
        color: getExpandedContainerColor(node.op_type, nestLevel),
        opacity: getExpandedContainerOpacity(nestLevel),
        children: childLayout,
        collapsed: false,
      };
      result.push(ln);
      nodeMap.set(node.id, ln);
      curX = rightEdge + NODE_GAP;
    }
  }

  return { result, endX: curX };
}

const EDGE_LIFT_CLEARANCE = 0.5;
const ARC_HEIGHT_CEILING = 4;

/** Collect all LayoutNodes as a flat list for spatial queries. */
function collectAllNodes(nodes: LayoutNode[]): LayoutNode[] {
  const out: LayoutNode[] = [];
  for (const n of nodes) {
    out.push(n);
    if (n.children?.length) out.push(...collectAllNodes(n.children));
  }
  return out;
}

/** Max top (y + height/2) of nodes that overlap the horizontal span [startX, endX]. */
function maxBlockTopBetween(
  allNodes: LayoutNode[],
  excludeIds: Set<string>,
  startX: number,
  endX: number,
): number {
  const [lo, hi] = startX < endX ? [startX, endX] : [endX, startX];
  let maxTop = 0;
  for (const n of allNodes) {
    if (excludeIds.has(n.id)) continue;
    const nLeft = n.x - n.width / 2;
    const nRight = n.x + n.width / 2;
    if (nRight <= lo || nLeft >= hi) continue;
    const top = n.y + n.height / 2;
    maxTop = Math.max(maxTop, top);
  }
  return maxTop;
}

function layoutEdgesStructured(
  edges: IREdge[],
  layoutTree: LayoutNode[],
  nodeMap: Map<string, LayoutNode>,
  collapsedRemap: Map<string, string>,
  gap: number,
): LayoutEdge[] {
  const layoutEdges: LayoutEdge[] = [];
  const seen = new Set<string>();
  const allNodes = collectAllNodes(layoutTree);

  for (const e of edges) {
    const fromId = collapsedRemap.get(e.from) ?? e.from;
    const toId = collapsedRemap.get(e.to) ?? e.to;
    if (fromId === toId) continue;

    const dedupKey = `${fromId}->${toId}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    const src = nodeMap.get(fromId);
    const dst = nodeMap.get(toId);
    if (!src || !dst) continue;

    const srcBox = getRenderableNodeBox(src);
    const dstBox = getRenderableNodeBox(dst);
    const start = { x: srcBox.maxX, y: src.y, z: src.z };
    const end = { x: dstBox.minX, y: dst.y, z: dst.z };

    let pts: { x: number; y: number; z: number }[];
    if (e.kind === 'residual') {
      const exclude = new Set<string>([fromId, toId]);
      const maxY = maxBlockTopBetween(allNodes, exclude, start.x, end.x);
      const arcH = Math.min(maxY + EDGE_LIFT_CLEARANCE, start.y + ARC_HEIGHT_CEILING);
      pts = [
        start,
        { x: start.x + gap * 0.5, y: start.y, z: start.z },
        { x: start.x + gap * 0.5, y: arcH, z: start.z },
        { x: end.x - gap * 0.5, y: arcH, z: end.z },
        { x: end.x - gap * 0.5, y: end.y, z: end.z },
        end,
      ];
    } else {
      pts = [
        start,
        { x: start.x + gap * 0.5, y: start.y, z: start.z },
        { x: end.x - gap * 0.5, y: end.y, z: end.z },
        end,
      ];
    }

    layoutEdges.push({ ...e, from: fromId, to: toId, points: pts });
  }

  return layoutEdges;
}

export function computeLayout(ir: IRGraph, collapsedIds: Set<string>): LayoutData {
  const nodeMap = new Map<string, LayoutNode>();
  const collapsedRemap = new Map<string, string>();

  const { result: layoutTree } = layoutNodes(
    ir.nodes, 0, collapsedIds, nodeMap, collapsedRemap,
  );

  // --- Edges: Structured "circuit board" routing ---
  const layoutEdges = layoutEdgesStructured(
    ir.edges,
    layoutTree,
    nodeMap,
    collapsedRemap,
    NODE_GAP,
  );

  const partialLayout = {
    nodes: layoutTree,
    edges: layoutEdges,
    bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 },
  };
  const bounds = getLayoutWorldBounds(partialLayout, { includeEdges: true });

  return {
    nodes: layoutTree,
    edges: layoutEdges,
    bounds,
  };
}

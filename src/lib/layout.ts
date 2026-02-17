import { IRGraph, IRNode, LayoutData, LayoutNode, LayoutEdge } from './irTypes';

const CONTAINER_PADDING = 2.8;
const NODE_GAP = 2;

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
  // Convention: width=depth-of-tensor, height=spatial, depth=spatial
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

/** Leaf node colors — bright, high contrast on dark canvas (#09090b). */
function getOpColor(op: string): string {
  const lower = op.toLowerCase();
  if (lower.includes('conv')) return '#60a5fa';
  if (lower.includes('linear') || lower.includes('mlp')) return '#34d399';
  if (lower.includes('pool')) return '#fbbf24';
  if (lower.includes('norm')) return '#f472b6';
  if (lower.includes('attn')) return '#a78bfa';
  if (lower.includes('add') || lower.includes('cat')) return '#f87171';
  if (lower.includes('relu') || lower.includes('gelu') || lower.includes('silu')) return '#22d3ee';
  return '#94a3b8';
}

/** Container colors — distinct, visible on dark theme. */
const CONTAINER_PALETTE: string[] = [
  '#3b82f6', '#6366f1', '#8b5cf6',
  '#0ea5e9', '#14b8a6', '#22c55e',
  '#eab308', '#f97316', '#ec4899',
  '#64748b',
];

function getContainerColor(op: string, nestLevel: number): string {
  const lower = op.toLowerCase();
  let baseIdx = 0;
  if (lower.includes('resnet') || lower.includes('block')) baseIdx = 0;
  else if (lower.includes('transformer') || lower.includes('attn') || lower.includes('vit') || lower.includes('vision')) baseIdx = 2;
  else if (lower.includes('sequential')) baseIdx = 9;
  else if (lower.includes('embed') || lower.includes('patch')) baseIdx = 4;
  else if (lower.includes('mlp')) baseIdx = 5;
  const idx = (baseIdx + nestLevel) % CONTAINER_PALETTE.length;
  return CONTAINER_PALETTE[idx];
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
        x: curX + size.width / 2,
        y: 0,
        z: 0,
        ...size,
        color: node.error ? '#ef4444' : getOpColor(node.op_type),
      };
      result.push(ln);
      nodeMap.set(node.id, ln);
      curX += size.width + NODE_GAP;
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
        color: getContainerColor(node.op_type, nestLevel),
        collapsed: true,
      };
      result.push(ln);
      nodeMap.set(node.id, ln);
      mapDescendants(node, node.id, collapsedRemap);
      curX += size.width + NODE_GAP;
    } else {
      // Expanded container — layout children inside a padded bounding box
      const pad = CONTAINER_PADDING;
      const childStartX = curX + pad;
      const { result: childLayout, endX: childEndX } = layoutNodes(
        node.children!, childStartX, collapsedIds, nodeMap, collapsedRemap, nestLevel + 1,
      );

      const rightEdge = childLayout.length > 0
        ? childEndX - NODE_GAP + pad
        : curX + 2 * pad + 1;
      const containerWidth = rightEdge - curX;

      let maxH = 2, maxD = 1;
      for (const ch of childLayout) {
        maxH = Math.max(maxH, ch.height);
        maxD = Math.max(maxD, ch.depth);
      }
      const containerH = maxH + 2 * pad;
      const containerD = maxD + 2 * pad;
      const centerX = curX + containerWidth / 2;

      const { children: _c, ...rest } = node;
      const ln: LayoutNode = {
        ...rest,
        x: centerX,
        y: 0,
        z: 0,
        width: containerWidth,
        height: containerH,
        depth: containerD,
        color: getContainerColor(node.op_type, nestLevel),
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

export function computeLayout(ir: IRGraph, collapsedIds: Set<string>): LayoutData {
  const nodeMap = new Map<string, LayoutNode>();
  const collapsedRemap = new Map<string, string>();

  const { result: layoutTree } = layoutNodes(
    ir.nodes, 0, collapsedIds, nodeMap, collapsedRemap,
  );

  // --- Edges ---
  const layoutEdges: LayoutEdge[] = [];
  const seen = new Set<string>();

  for (const e of ir.edges) {
    const fromId = collapsedRemap.get(e.from) ?? e.from;
    const toId = collapsedRemap.get(e.to) ?? e.to;
    if (fromId === toId) continue;

    const dedupKey = `${fromId}->${toId}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    const src = nodeMap.get(fromId);
    const dst = nodeMap.get(toId);
    if (!src || !dst) continue;

    const start = { x: src.x + src.width / 2, y: src.y, z: src.z };
    const end = { x: dst.x - dst.width / 2, y: dst.y, z: dst.z };
    const dist = end.x - start.x;

    let pts: { x: number; y: number; z: number }[];
    if (e.kind === 'residual') {
      const arcH = Math.max(2, Math.abs(dist) * 0.15);
      pts = [
        start,
        { x: start.x + dist * 0.35, y: start.y + arcH, z: start.z },
        { x: end.x - dist * 0.35, y: end.y + arcH, z: end.z },
        end,
      ];
    } else {
      pts = [
        start,
        { x: start.x + dist * 0.28, y: start.y, z: start.z },
        { x: end.x - dist * 0.28, y: end.y, z: end.z },
        end,
      ];
    }

    layoutEdges.push({ ...e, from: fromId, to: toId, points: pts });
  }

  // --- Bounds ---
  let minX = 0, maxX = 0;
  nodeMap.forEach(n => {
    minX = Math.min(minX, n.x - n.width / 2);
    maxX = Math.max(maxX, n.x + n.width / 2);
  });

  return {
    nodes: layoutTree,
    edges: layoutEdges,
    bounds: { minX, maxX, minY: -5, maxY: 5, minZ: -5, maxZ: 5 },
  };
}

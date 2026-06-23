import * as THREE from 'three';
import type { LayoutData, LayoutNode } from '../../lib/irTypes';
import { getVisualMeta } from '../../lib/visualKind.ts';
import { getForwardPassCompatibility, type ForwardPassCompatibility } from '../../lib/mnistCompatibility.ts';
import { getNodeDemoPose, type DemoStop } from '../operation-effects/effectMath.ts';
import { getRenderableNodeBox, getRenderableNodeSize } from '../../lib/renderBounds.ts';
import type { LayoutEdgeWithVectors } from '../../lib/canvasUtils';

export function collectDemoStopNodes(nodes: LayoutNode[], isTopLevel = true, out: LayoutNode[] = []): LayoutNode[] {
  for (const node of nodes) {
    const isRoot = isTopLevel && !node.parentId && node.is_container && nodes.length === 1;
    if (!node.is_container || node.collapsed) {
      out.push(node);
      continue;
    }
    if (!isRoot && !node.children?.length) out.push(node);
    if (node.children?.length) collectDemoStopNodes(node.children, false, out);
  }
  return out;
}

function orderDemoStopNodes(nodes: LayoutNode[], edges: LayoutData['edges']): LayoutNode[] {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const originalIndex = new Map(nodes.map((node, index) => [node.id, index]));
  const incoming = new Map(nodes.map((node) => [node.id, 0]));
  const outgoing = new Map<string, string[]>();

  for (const edge of edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) continue;
    incoming.set(edge.to, (incoming.get(edge.to) ?? 0) + 1);
    const next = outgoing.get(edge.from) ?? [];
    next.push(edge.to);
    outgoing.set(edge.from, next);
  }

  const queue = nodes
    .filter((node) => (incoming.get(node.id) ?? 0) === 0)
    .sort((a, b) => (originalIndex.get(a.id) ?? 0) - (originalIndex.get(b.id) ?? 0));
  const ordered: LayoutNode[] = [];

  while (queue.length) {
    const node = queue.shift()!;
    ordered.push(node);

    const nextIds = (outgoing.get(node.id) ?? [])
      .sort((a, b) => (originalIndex.get(a) ?? 0) - (originalIndex.get(b) ?? 0));
    for (const nextId of nextIds) {
      const nextCount = (incoming.get(nextId) ?? 0) - 1;
      incoming.set(nextId, nextCount);
      if (nextCount === 0) {
        const nextNode = nodeById.get(nextId);
        if (nextNode) queue.push(nextNode);
      }
    }

    queue.sort((a, b) => (originalIndex.get(a.id) ?? 0) - (originalIndex.get(b.id) ?? 0));
  }

  return ordered.length === nodes.length ? ordered : nodes;
}

export function collectDemoStops(layout: LayoutData): DemoStop[] {
  return orderDemoStopNodes(collectDemoStopNodes(layout.nodes), layout.edges)
    .map((node) => ({
      node,
      label: getVisualMeta(node.op_type).labelOverride ?? node.op_type,
      position: getNodeDemoPose(node).position,
    }));
}

/** A flow edge plus the stop index at which it becomes visible. */
export type DemoFlowEdge = { edge: LayoutEdgeWithVectors; revealIndex: number };

function collectLayoutNodes(nodes: LayoutNode[], out: LayoutNode[] = []): LayoutNode[] {
  for (const node of nodes) {
    out.push(node);
    if (node.children?.length) collectLayoutNodes(node.children, out);
  }
  return out;
}

function collectDescendantStopIds(node: LayoutNode, stopIds: Set<string>, out: string[] = []): string[] {
  if (stopIds.has(node.id)) out.push(node.id);
  for (const child of node.children ?? []) collectDescendantStopIds(child, stopIds, out);
  return out;
}

/** True if any node in the subtree is an Add (residual merge). */
function subtreeHasResidual(node: LayoutNode): boolean {
  if (!node.children?.length) return false;
  return node.children.some((child) => child.op_type === 'Add' || subtreeHasResidual(child));
}

/**
 * A bézier arc bypassing a collapsed residual block. When a block like
 * MobileNet's `InvertedResidual` or a collapsed transformer block is rendered
 * as a single box, its internal `Add` is self-referential after the collapse
 * remap and dropped, so the skip would be invisible. We draw an explicit arc
 * over the block to surface the residual.
 */
function synthesizeResidualBypass(node: LayoutNode): LayoutEdgeWithVectors {
  const size = getRenderableNodeSize(node);
  const lift = size.height / 2 + Math.max(size.height, 1.6);
  const top = node.y + lift;
  const points = [
    { x: node.x - size.width / 2, y: node.y, z: node.z },
    { x: node.x - size.width / 2, y: top, z: node.z },
    { x: node.x + size.width / 2, y: top, z: node.z },
    { x: node.x + size.width / 2, y: node.y, z: node.z },
  ];
  return {
    from: `${node.id}__residual_skip`,
    to: node.id,
    kind: 'residual',
    points,
    vectorPoints: points.map((p) => new THREE.Vector3(p.x, p.y, p.z)),
  };
}

function synthesizeFlowEdge(from: LayoutNode, to: LayoutNode): LayoutEdgeWithVectors {
  return synthesizeEdge(from, to, 'main');
}

function maxBlockTopBetween(
  nodes: LayoutNode[],
  excludeIds: Set<string>,
  startX: number,
  endX: number,
): number {
  const [lo, hi] = startX < endX ? [startX, endX] : [endX, startX];
  let maxTop = 0;
  for (const node of nodes) {
    if (excludeIds.has(node.id)) continue;
    const box = getRenderableNodeBox(node);
    if (box.maxX <= lo || box.minX >= hi) continue;
    maxTop = Math.max(maxTop, box.maxY);
  }
  return maxTop;
}

function synthesizeEdge(
  from: LayoutNode,
  to: LayoutNode,
  kind: LayoutEdgeWithVectors['kind'],
  obstacleNodes: LayoutNode[] = [],
): LayoutEdgeWithVectors {
  const fromWidth = getRenderableNodeSize(from).width;
  const toWidth = getRenderableNodeSize(to).width;
  const start = { x: from.x + fromWidth / 2, y: from.y, z: from.z };
  const end = { x: to.x - toWidth / 2, y: to.y, z: to.z };
  const dx = end.x - start.x;
  const direction = dx < 0 ? -1 : 1;
  const jog = Math.min(Math.abs(dx) * 0.25, 1.25);
  const endpointTop = Math.max(
    getRenderableNodeBox(from).maxY,
    getRenderableNodeBox(to).maxY,
  );
  const obstacleTop = maxBlockTopBetween(obstacleNodes, new Set([from.id, to.id]), start.x, end.x);
  const arcH = Math.min(Math.max(endpointTop, obstacleTop) + 0.5, Math.max(from.y, to.y) + 4);
  const points = kind === 'residual'
    ? [
        start,
        { x: start.x + direction * jog, y: start.y, z: start.z },
        { x: start.x + direction * jog, y: arcH, z: start.z },
        { x: end.x - direction * jog, y: arcH, z: end.z },
        { x: end.x - direction * jog, y: end.y, z: end.z },
        end,
      ]
    : [
        start,
        { x: start.x + dx * 0.4, y: start.y, z: start.z },
        { x: start.x + dx * 0.6, y: end.y, z: end.z },
        end,
      ];
  return {
    from: from.id,
    to: to.id,
    kind,
    points,
    vectorPoints: points.map((p) => new THREE.Vector3(p.x, p.y, p.z)),
  };
}

function remapEndpointToStop(
  endpointId: string,
  side: 'from' | 'to',
  stopIds: Set<string>,
  indexById: Map<string, number>,
  nodeById: Map<string, LayoutNode>,
): string | null {
  if (stopIds.has(endpointId)) return endpointId;

  const node = nodeById.get(endpointId);
  if (!node?.children?.length) return null;

  const descendants = collectDescendantStopIds(node, stopIds)
    .sort((a, b) => (indexById.get(a) ?? 0) - (indexById.get(b) ?? 0));
  if (!descendants.length) return null;

  return side === 'from' ? descendants[descendants.length - 1] : descendants[0];
}

/**
 * Builds the forward-pass flow path: the linear chain of consecutive stops plus
 * any skip/residual/concat edges between them.
 *
 * Layout edges only exist where the IR traced them and are remapped through
 * collapsed containers, so for nested (Sequential) models the demo's ordered
 * stops frequently have no matching layout edge. For the main chain we reuse a
 * real edge when its exact `(from, to)` pair exists (keeps nice routing) and
 * otherwise synthesize a 4-point bézier between the two blocks' faces. We then
 * add every remaining real edge whose endpoints are both stops — these are the
 * residual/skip and concat branches (e.g. ResNet `Add`, UNet concat) — revealed
 * once their later endpoint is reached. Each edge carries the stop index at
 * which it appears so playback can reveal them progressively.
 */
export function buildDemoFlowEdges(
  stops: DemoStop[],
  layoutEdges: LayoutEdgeWithVectors[],
  layoutNodes: LayoutNode[] = stops.map((stop) => stop.node),
): DemoFlowEdge[] {
  const indexById = new Map(stops.map((stop, index) => [stop.node.id, index]));
  const stopIds = new Set(indexById.keys());
  const nodeById = new Map(collectLayoutNodes(layoutNodes).map((node) => [node.id, node]));
  const used = new Set<string>();
  const result: DemoFlowEdge[] = [];

  // Main chain: one edge per consecutive stop pair, revealed at the later stop.
  for (let i = 1; i < stops.length; i++) {
    const from = stops[i - 1].node;
    const to = stops[i].node;
    const real = layoutEdges.find((edge) => edge.from === from.id && edge.to === to.id);
    result.push({ edge: real ?? synthesizeFlowEdge(from, to), revealIndex: i });
    used.add(`${from.id}->${to.id}`);
  }

  // Skip / residual / concat branches: real edges between two stops not already
  // on the main chain, revealed when their later endpoint appears.
  for (const edge of layoutEdges) {
    const fromId = remapEndpointToStop(edge.from, 'from', stopIds, indexById, nodeById);
    const toId = remapEndpointToStop(edge.to, 'to', stopIds, indexById, nodeById);
    if (!fromId || !toId || fromId === toId) continue;
    const fromIndex = indexById.get(fromId);
    const toIndex = indexById.get(toId);
    if (fromIndex === undefined || toIndex === undefined) continue;
    if (used.has(`${fromId}->${toId}`)) continue;
    used.add(`${fromId}->${toId}`);
    const remappedEdge = fromId === edge.from && toId === edge.to
      ? edge
      : synthesizeEdge(nodeById.get(fromId)!, nodeById.get(toId)!, edge.kind, [...nodeById.values()]);
    result.push({ edge: remappedEdge, revealIndex: Math.max(fromIndex, toIndex) });
  }

  // Collapsed residual blocks: their internal Add is dropped by the collapse
  // remap, so draw an explicit bypass arc to keep the residual visible.
  stops.forEach((stop, index) => {
    if (stop.node.is_container && stop.node.collapsed && subtreeHasResidual(stop.node)) {
      result.push({ edge: synthesizeResidualBypass(stop.node), revealIndex: index });
    }
  });

  return result;
}

export function isForwardPassCompatible(stops: DemoStop[]): boolean {
  return getForwardPassCompatibility(stops).ok;
}

export function getForwardPassStopsCompatibility(
  stops: DemoStop[] | null,
  loading = false,
): ForwardPassCompatibility {
  return getForwardPassCompatibility(stops, { loading });
}

export function isForwardPassLayoutCompatible(layout: LayoutData | null): boolean {
  return !!layout && isForwardPassCompatible(collectDemoStops(layout));
}

export function getForwardPassLayoutCompatibility(
  layout: LayoutData | null,
  loading = false,
): ForwardPassCompatibility {
  if (loading) return { ok: false, reason: 'loading' };
  if (!layout) return { ok: false, reason: 'no-layout' };
  return getForwardPassCompatibility(collectDemoStops(layout));
}

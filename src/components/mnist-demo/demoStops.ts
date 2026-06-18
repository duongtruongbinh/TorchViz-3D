import type { LayoutData, LayoutNode } from '../../lib/irTypes';
import { getVisualKind, getVisualMeta } from '../../lib/visualKind';
import { getNodeDemoPosition, type DemoStop } from '../operation-effects/effectMath';

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
      position: getNodeDemoPosition(node),
    }));
}

export function isMnistDemoCompatible(stops: DemoStop[]): boolean {
  const firstLeaf = stops.find((stop) => !stop.node.is_container && stop.node.in_shape?.length);
  const input = firstLeaf?.node.in_shape ?? [];
  const hasMnistInput = input.length === 4 && input[1] === 1 && input[2] === 32 && input[3] === 32;
  const hasTenClassHead = stops.some((stop) => {
    const outShape = stop.node.out_shape ?? [];
    return getVisualKind(stop.node.op_type) === 'Linear' && outShape[outShape.length - 1] === 10;
  });

  return hasMnistInput && hasTenClassHead;
}

export function isMnistDemoLayoutCompatible(layout: LayoutData | null): boolean {
  return !!layout && isMnistDemoCompatible(collectDemoStops(layout));
}

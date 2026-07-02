import type { LayoutNode } from './irTypes.ts';
import { getRenderableNodeSize } from './renderBounds.ts';
import { getVisualKind, getVisualMeta } from './visualKind.ts';
import { getLayoutNodeBaseColor } from './nodeVisualStyle.ts';

export type LeafBatchingState = {
  highlightedNodeId: string | null;
  selectedNodeId: string | null;
  activeNodeId: string | null;
};

function shouldRenderSingle(node: LayoutNode, state: LeafBatchingState): boolean {
  const meta = getVisualMeta(node.op_type);
  return Boolean(
    meta.specialGeometry
      || node.error
      || node.id === state.highlightedNodeId
      || node.id === state.selectedNodeId
      || node.id === state.activeNodeId,
  );
}

function getBatchKey(node: LayoutNode): string {
  const kind = getVisualKind(node.op_type);
  const { width, height, depth } = getRenderableNodeSize(node);
  return [
    kind,
    width.toFixed(2),
    height.toFixed(2),
    depth.toFixed(2),
    getLayoutNodeBaseColor(node),
  ].join('_');
}

export function partitionLeavesForInstancing(
  leaves: LayoutNode[],
  state: LeafBatchingState,
  minBatchSize = 3,
): { batches: LayoutNode[][]; singles: LayoutNode[] } {
  const grouped = new Map<string, LayoutNode[]>();
  const singles: LayoutNode[] = [];

  for (const node of leaves) {
    if (shouldRenderSingle(node, state)) {
      singles.push(node);
      continue;
    }

    const key = getBatchKey(node);
    const batch = grouped.get(key) ?? [];
    batch.push(node);
    grouped.set(key, batch);
  }

  const batches: LayoutNode[][] = [];
  for (const batch of grouped.values()) {
    if (batch.length >= minBatchSize) {
      batches.push(batch);
    } else {
      singles.push(...batch);
    }
  }

  return { batches, singles };
}

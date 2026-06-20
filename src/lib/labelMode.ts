export type LabelMode = 'auto' | 'all' | 'selected';

export const LARGE_GRAPH_LABEL_THRESHOLD = 80;

export function getEffectiveLabelMode(
  labelMode: LabelMode,
  leafCount: number,
  threshold = LARGE_GRAPH_LABEL_THRESHOLD,
): Exclude<LabelMode, 'auto'> {
  if (labelMode !== 'auto') return labelMode;
  return leafCount > threshold ? 'selected' : 'all';
}

export function shouldRenderLeafCaption({
  labelMode,
  leafCount,
  nodeId,
  hoveredNodeId,
  selectedNodeId,
  activeNodeId,
}: {
  labelMode: LabelMode;
  leafCount: number;
  nodeId: string;
  hoveredNodeId: string | null;
  selectedNodeId: string | null;
  activeNodeId: string | null;
}): boolean {
  const effectiveMode = getEffectiveLabelMode(labelMode, leafCount);
  if (effectiveMode === 'all') return true;
  return nodeId === hoveredNodeId || nodeId === selectedNodeId || nodeId === activeNodeId;
}

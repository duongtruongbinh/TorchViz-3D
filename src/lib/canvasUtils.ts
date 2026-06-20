import * as THREE from 'three';
import type { LayoutData, LayoutEdge, LayoutNode } from './irTypes';

export const DEFAULT_CAMERA_OFFSET = new THREE.Vector3(50, 40, 50);
export const DEFAULT_CAMERA_POSITION = DEFAULT_CAMERA_OFFSET.toArray() as [number, number, number];
export const DEFAULT_CAMERA_ZOOM = 42;
export const DEFAULT_MIN_ZOOM = 6;
export const DEFAULT_MAX_ZOOM = 150;

export type LayoutEdgeWithVectors = LayoutEdge & { vectorPoints: THREE.Vector3[] };

export function collectLayoutNodes(nodes: LayoutNode[], out: LayoutNode[] = []): LayoutNode[] {
  for (const node of nodes) {
    out.push(node);
    if (node.children?.length) collectLayoutNodes(node.children, out);
  }
  return out;
}

export function getCanvasLayoutKey(layout: LayoutData | null): string {
  if (!layout) return '';
  const nodeKey = collectLayoutNodes(layout.nodes)
    .map((node) => [
      node.id,
      node.collapsed,
      node.x,
      node.y,
      node.z,
      node.width,
      node.height,
      node.depth,
    ].join(':'))
    .join(',');
  const edgeKey = layout.edges
    .map((edge) => `${edge.from}:${edge.to}:${edge.kind ?? ''}`)
    .join(',');
  return `${nodeKey}|${edgeKey}`;
}

export function getVectorizedLayoutEdges(layout: LayoutData | null): LayoutEdgeWithVectors[] {
  if (!layout) return [];
  return layout.edges.map((edge) => ({
    ...edge,
    vectorPoints: edge.points.map((point) => new THREE.Vector3(point.x, point.y, point.z)),
  }));
}

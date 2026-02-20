export interface IRShape {
  dims: number[];
}

export interface IRNode {
  id: string;
  name: string;
  op_type: string;
  in_shape: number[];
  out_shape: number[];
  params: number;
  group_id?: string;
  lineno?: number;
  meta?: Record<string, any>;
  children?: IRNode[];
  is_container?: boolean;
  collapsed?: boolean;
  error?: string;
  has_error?: boolean;
  parentId?: string;
}

export interface IREdge {
  from: string;
  to: string;
  kind: 'main' | 'residual' | 'concat';
}

export interface IRStats {
  total_params: number;
  approx_memory_mb: number;
}

export interface IRGraph {
  nodes: IRNode[];
  edges: IREdge[];
  stats: IRStats;
  error?: {
    message: string;
    lineno: number;
    hint: string;
  };
  error_node_id?: string;
}

export interface LayoutNode extends IRNode {
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
  opacity?: number;
  children?: LayoutNode[];
}

export interface LayoutEdge extends IREdge {
  points: { x: number; y: number; z: number }[];
}

export interface LayoutData {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  bounds: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number };
}

/** Recursively collect all leaf (non-container) nodes from a hierarchical tree. */
export function flattenIRNodes(nodes: IRNode[]): IRNode[] {
  const result: IRNode[] = [];
  for (const node of nodes) {
    if (node.is_container && node.children && node.children.length > 0) {
      result.push(...flattenIRNodes(node.children));
    } else {
      result.push(node);
    }
  }
  return result;
}

/** Smart collapse: auto-expand small containers, collapse large ones. Never collapse root. */
export function initCollapsedIds(ir: IRGraph): Set<string> {
  const ids = new Set<string>();
  const AUTO_EXPAND_THRESHOLD = 4;

  function walk(nodes: IRNode[], depth: number) {
    for (const node of nodes) {
      if (!node.is_container || !node.children?.length) continue;

      const childCount = node.children.length;

      let shouldCollapse: boolean;
      if (depth === 0) {
        shouldCollapse = false;
      } else if (childCount < AUTO_EXPAND_THRESHOLD) {
        shouldCollapse = false;
      } else {
        shouldCollapse = true;
      }

      if (shouldCollapse) ids.add(node.id);
      walk(node.children, depth + 1);
    }
  }
  walk(ir.nodes, 0);
  return ids;
}

/** Find a node in the IR tree by its ID. */
export function findNodeById(nodes: IRNode[], id: string): IRNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/** Find the node in the IR tree whose lineno matches the given line. */
export function findNodeByLine(nodes: IRNode[], line: number): IRNode | null {
  for (const node of nodes) {
    if (node.lineno === line) return node;
    if (node.children) {
      const found = findNodeByLine(node.children, line);
      if (found) return found;
    }
  }
  return null;
}

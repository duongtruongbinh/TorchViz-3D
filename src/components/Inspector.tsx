import React, { useState } from 'react';
import { IRGraph, IRNode, findNodeById } from '../lib/irTypes';
import { formatNumber } from '../lib/stats';
import { getOpColor } from '../lib/constants';

interface InspectorProps {
  ir: IRGraph | null;
  selectedNodeId: string | null;
  highlightNodeId: string | null;
  onSelectNode: (id: string) => void;
  onHighlightNode: (id: string | null) => void;
}

/* ─── Recursive Tree Node ─── */
const TreeNode: React.FC<{
  node: IRNode;
  depth: number;
  selectedId: string | null;
  highlightId: string | null;
  onSelect: (id: string) => void;
  onHighlight: (id: string | null) => void;
}> = ({ node, depth, selectedId, highlightId, onSelect, onHighlight }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const isContainer = node.is_container && node.children && node.children.length > 0;
  const isSelected = node.id === selectedId;
  const isHighlighted = node.id === highlightId;

  const indent = depth * 12;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 pr-2 cursor-pointer transition-colors text-xs select-none border-l-2 ${
          isSelected
            ? 'bg-blue-500/15 border-blue-500 text-zinc-100'
            : isHighlighted
              ? 'bg-zinc-800/60 border-zinc-600 text-zinc-200'
              : 'border-transparent text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
        }`}
        style={{ paddingLeft: indent + 8 }}
        onClick={() => {
          onSelect(node.id);
          if (isContainer) setExpanded((v) => !v);
        }}
        onMouseEnter={() => onHighlight(node.id)}
        onMouseLeave={() => onHighlight(null)}
      >
        {/* Expand/collapse icon for containers */}
        {isContainer ? (
          <span className="w-3 text-[8px] text-zinc-500 flex-shrink-0 text-center">
            {expanded ? '▼' : '▶'}
          </span>
        ) : (
          <span className="w-3 flex-shrink-0" />
        )}

        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: getOpColor(node.op_type) }} />

        <span className="font-medium truncate">{node.op_type}</span>

        {node.params > 0 && (
          <span className="ml-auto text-xs text-zinc-600 font-mono flex-shrink-0">
            {formatNumber(node.params)}
          </span>
        )}
      </div>

      {isContainer && expanded && node.children!.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedId={selectedId}
          highlightId={highlightId}
          onSelect={onSelect}
          onHighlight={onHighlight}
        />
      ))}
    </div>
  );
};

/* ─── Node Details Panel ─── */
const NodeDetails: React.FC<{ node: IRNode }> = ({ node }) => {
  const rows: [string, string][] = [
    ['Type', node.op_type],
    ['Name', node.name],
    ['Input', node.in_shape.length > 0 ? `(${node.in_shape.join(', ')})` : '-'],
    ['Output', node.out_shape.length > 0 ? `(${node.out_shape.join(', ')})` : '-'],
    ['Params', node.params > 0 ? node.params.toLocaleString() : '0'],
  ];

  if (node.meta) {
    for (const [k, v] of Object.entries(node.meta)) {
      rows.push([k, Array.isArray(v) ? `(${v.join(', ')})` : String(v)]);
    }
  }

  if (node.error) {
    rows.push(['Error', node.error]);
  }

  return (
    <div className="p-3 space-y-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: getOpColor(node.op_type) }} />
        <span className="text-sm font-bold text-zinc-100 uppercase tracking-wider">{node.op_type}</span>
      </div>
      <div className="bg-zinc-800/50 rounded border border-zinc-800 overflow-hidden">
        {rows.map(([label, value], i) => (
          <div
            key={label + i}
            className={`flex items-start gap-2 px-3 py-2 text-xs ${i > 0 ? 'border-t border-zinc-800/50' : ''}`}
          >
            <span className="text-zinc-500 font-medium w-16 flex-shrink-0 uppercase text-xs pt-0.5">{label}</span>
            <span className={`font-mono ${label === 'Error' ? 'text-red-400' : 'text-zinc-300'} break-all`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Inspector / Model Explorer ─── */
const Inspector: React.FC<InspectorProps> = ({ ir, selectedNodeId, highlightNodeId, onSelectNode, onHighlightNode }) => {
  const selectedNode = ir && selectedNodeId ? findNodeById(ir.nodes, selectedNodeId) : null;

  return (
    <div className="h-full flex flex-col bg-zinc-900 text-zinc-300">
      {/* Header */}
      <div className="h-8 border-b border-zinc-800 flex items-center px-3 shrink-0 bg-zinc-900 select-none">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M2 3a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 7.586V3z" />
          </svg>
          Explorer
        </span>
      </div>

      {!ir ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 p-4">
          <span className="text-sm">No model loaded.</span>
          <span className="text-xs mt-1.5">Run code to explore the model.</span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* ─── Top: Structure Tree (60%) ─── */}
          <div className="flex-[6] min-h-0 flex flex-col">
            <div className="h-7 border-b border-zinc-800 flex items-center px-3 shrink-0 select-none">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Structure</span>
              <span className="ml-auto text-xs font-mono text-zinc-600">
                {formatNumber(ir.stats.total_params)} params
              </span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
              {ir.nodes.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedId={selectedNodeId}
                  highlightId={highlightNodeId}
                  onSelect={onSelectNode}
                  onHighlight={onHighlightNode}
                />
              ))}
            </div>
          </div>

          {/* ─── Bottom: Node Details (40%) ─── */}
          <div className="flex-[4] min-h-0 border-t border-zinc-800 flex flex-col">
            <div className="h-7 border-b border-zinc-800 flex items-center px-3 shrink-0 select-none">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Details</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {selectedNode ? (
                <NodeDetails node={selectedNode} />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-500 text-sm italic">
                  Click a node to inspect
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inspector;

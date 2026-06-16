import React, { useState } from 'react';
import { IRGraph, IRNode, findNodeById } from '../lib/irTypes';
import { formatNumber } from '../lib/stats';
import { getOpColor } from '../lib/constants';
import { getLayerInsight } from '../lib/layerInsights';

interface InspectorProps {
  ir: IRGraph | null;
  selectedNodeId: string | null;
  highlightNodeId: string | null;
  onSelectNode: (id: string) => void;
  onHighlightNode: (id: string | null) => void;
  onOpenLayerInsight: (node: IRNode) => void;
  headerAction?: React.ReactNode;
}

const SectionCollapseButton: React.FC<{
  collapsed: boolean;
  label: string;
  onClick: () => void;
}> = ({ collapsed, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    title={collapsed ? `Expand ${label}` : `Collapse ${label}`}
    aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
    aria-pressed={collapsed}
    className="w-6 h-6 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)] transition-colors"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`w-3 h-3 transition-transform duration-200 ease-out ${collapsed ? '-rotate-90' : 'rotate-0'}`}
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  </button>
);

/* ─── Recursive Tree Node ─── */
const TreeNode: React.FC<{
  node: IRNode;
  depth: number;
  selectedId: string | null;
  highlightId: string | null;
  onSelect: (id: string) => void;
  onHighlight: (id: string | null) => void;
  onOpenLayerInsight: (node: IRNode) => void;
}> = ({ node, depth, selectedId, highlightId, onSelect, onHighlight, onOpenLayerInsight }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const isContainer = node.is_container && node.children && node.children.length > 0;
  const isSelected = node.id === selectedId;
  const isHighlighted = node.id === highlightId;

  const indent = depth * 12;

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 pr-2 cursor-pointer transition-all text-xs select-none border-l-[3px] ${isSelected
            ? 'bg-[var(--surface-elevated)] border-blue-500 text-[var(--text)] font-semibold'
            : isHighlighted
              ? 'bg-[var(--border-subtle)] border-zinc-500 text-[var(--text)]'
              : 'border-transparent text-[var(--text-muted)] hover:bg-[var(--border-subtle)] hover:text-[var(--text)]'
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
          <button
            type="button"
            className="ml-auto text-xs text-zinc-500 hover:text-blue-300 font-mono flex-shrink-0 underline underline-offset-4 decoration-dotted"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLayerInsight(node);
            }}
            title="Explain parameter formula"
          >
            {formatNumber(node.params)}
          </button>
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
          onOpenLayerInsight={onOpenLayerInsight}
        />
      ))}
    </div>
  );
};

/* ─── Node Details Panel ─── */
const NodeDetails: React.FC<{ node: IRNode; onOpenLayerInsight: (node: IRNode) => void }> = ({ node, onOpenLayerInsight }) => {
  const insight = getLayerInsight(node);
  const rows: [string, React.ReactNode][] = [
    ['Name', node.name],
    ['Type', node.op_type],
    ['Line', node.lineno ? String(node.lineno) : '-'],
    ['Formula', insight.paramFormula.formula],
    ['Calc', insight.paramFormula.calculation],
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
        <span className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">{node.op_type}</span>
        <button
          type="button"
          className="ml-auto text-xs font-mono text-blue-300 hover:text-blue-100 underline underline-offset-4 decoration-dotted"
          onClick={() => onOpenLayerInsight(node)}
        >
          {insight.paramsLabel}
        </button>
      </div>
      <div className="bg-[var(--border-subtle)] rounded-lg border border-[var(--border)] overflow-hidden">
        {rows.map(([label, value], i) => (
          <div
            key={label + i}
            className={`flex items-start gap-2 px-3 py-2 text-xs transition-colors hover:bg-[var(--surface-elevated)] ${i > 0 ? 'border-t border-[var(--border-subtle)]' : ''}`}
          >
            <span className="text-[var(--text-dim)] font-medium w-16 flex-shrink-0 uppercase text-[10px] tracking-wider pt-0.5">{label}</span>
            <span className={`font-mono ${label === 'Error' ? 'text-red-400' : 'text-[var(--text-muted)]'} break-all`}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Main Inspector / Model Explorer ─── */
const Inspector: React.FC<InspectorProps> = ({ ir, selectedNodeId, highlightNodeId, onSelectNode, onHighlightNode, onOpenLayerInsight, headerAction }) => {
  const selectedNode = ir && selectedNodeId ? findNodeById(ir.nodes, selectedNodeId) : null;
  const [isStructureCollapsed, setStructureCollapsed] = useState(false);
  const [isDetailsCollapsed, setDetailsCollapsed] = useState(false);
  const structureFlex = isStructureCollapsed ? '0 0 32px' : isDetailsCollapsed ? '1 1 0' : '6 1 0';
  const detailsFlex = isDetailsCollapsed ? '0 0 32px' : isStructureCollapsed ? '1 1 0' : '4 1 0';

  return (
    <div className="h-full flex flex-col bg-[var(--surface)] text-[var(--text)] glass-panel rounded-l-md border-y-0 border-r-0 overflow-hidden ml-2 mb-2 mt-2 shadow-2xl">
      {/* Header */}
      <div className="h-10 border-b border-[var(--border)] flex items-center px-4 shrink-0 bg-[var(--surface-elevated)] select-none">
        <span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M2 3a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 7.586V3z" />
          </svg>
          Explorer
        </span>
        {headerAction && <div className="ml-auto">{headerAction}</div>}
      </div>

      {!ir ? (
        <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-dim)] p-4">
          <span className="text-sm">No model loaded.</span>
          <span className="text-[11px] mt-1.5 opacity-80">Run code to explore the model.</span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* ─── Top: Structure Tree (60%) ─── */}
          <div
            className="min-h-0 flex flex-col transition-[flex] duration-200 ease-out"
            style={{ flex: structureFlex }}
          >
            <div className="h-8 border-b border-[var(--border)] flex items-center px-2 pr-4 shrink-0 select-none">
              <SectionCollapseButton
                collapsed={isStructureCollapsed}
                label="Structure"
                onClick={() => setStructureCollapsed((v) => !v)}
              />
              <span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">Structure</span>
              <span className="ml-auto text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-elevated)] px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
                {formatNumber(ir.stats.total_params)} params
              </span>
            </div>
            <div className={`flex-1 overflow-y-auto custom-scrollbar py-2 transition-[opacity,transform] duration-200 ease-out ${isStructureCollapsed ? 'opacity-0 -translate-y-1 pointer-events-none' : 'opacity-100 translate-y-0 delay-75'}`}>
              {ir.nodes.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  selectedId={selectedNodeId}
                  highlightId={highlightNodeId}
                  onSelect={onSelectNode}
                  onHighlight={onHighlightNode}
                  onOpenLayerInsight={onOpenLayerInsight}
                />
              ))}
            </div>
          </div>

          {/* ─── Bottom: Node Details (40%) ─── */}
          <div
            className="min-h-0 border-t border-[var(--border)] flex flex-col bg-[var(--surface-elevated)] transition-[flex] duration-200 ease-out"
            style={{ flex: detailsFlex }}
          >
            <div className="h-8 border-b border-[var(--border-subtle)] flex items-center px-2 pr-4 shrink-0 select-none">
              <SectionCollapseButton
                collapsed={isDetailsCollapsed}
                label="Details"
                onClick={() => setDetailsCollapsed((v) => !v)}
              />
              <span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-wider">Details</span>
            </div>
            <div className={`flex-1 overflow-y-auto custom-scrollbar transition-[opacity,transform] duration-200 ease-out ${isDetailsCollapsed ? 'opacity-0 translate-y-1 pointer-events-none' : 'opacity-100 translate-y-0 delay-75'}`}>
              {selectedNode ? (
                <NodeDetails node={selectedNode} onOpenLayerInsight={onOpenLayerInsight} />
              ) : (
                <div className="flex items-center justify-center h-full text-[var(--text-dim)] text-xs italic">
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

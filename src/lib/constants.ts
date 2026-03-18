/** Centralized theme & layer colors. Single source of truth for 3D, Inspector, and SVG export. */

/** [label, hex] pairs for legend and getOpColor matching. Order matters for legend. */
export const OP_COLORS: [string, string][] = [
  ['Conv', '#60a5fa'],
  ['Linear', '#34d399'],
  ['Pool', '#fbbf24'],
  ['Norm', '#f472b6'],
  ['Attention', '#a78bfa'],
  ['Add/Concat', '#f87171'],
  ['Activation', '#22d3ee'],
  ['Flatten/Reshape', '#f59e0b'],
  ['Embedding', '#c084fc'],
  ['RNN/LSTM/GRU', '#fb923c'],
  ['Upsample', '#2dd4bf'],
  ['Default', '#94a3b8'],
];

const OP_MATCHERS: [RegExp | ((op: string) => boolean), string][] = [
  [/conv/i, '#60a5fa'],
  [/linear|mlp/i, '#34d399'],
  [/pool/i, '#fbbf24'],
  [/norm/i, '#f472b6'],
  [/attn|attention/i, '#a78bfa'],
  [/add|cat/i, '#f87171'],
  [/relu|gelu|silu|sigmoid|softmax/i, '#22d3ee'],
  [/flatten|reshape|permute|slice/i, '#f59e0b'],
  [/embedding/i, '#c084fc'],
  [/rnn|lstm|gru/i, '#fb923c'],
  [/pixelshuffle|upsample/i, '#2dd4bf'],
];

/** Leaf node color by op_type. High contrast on dark canvas. */
export function getOpColor(opType: string): string {
  const lower = opType.toLowerCase();
  for (const [matcher, color] of OP_MATCHERS) {
    if (typeof matcher === 'function' ? matcher(opType) : matcher.test(lower)) return color;
  }
  return OP_COLORS[OP_COLORS.length - 1][1];
}

/** Collapsed container colors (distinct, no gray). */
export function getCollapsedContainerColor(opType: string): string {
  const lower = opType.toLowerCase();
  if (lower.includes('sequential') || lower.includes('modulelist')) return '#3b82f6';
  if (lower.includes('resnet') || lower.includes('block') || lower.includes('basic')) return '#60a5fa';
  if (lower.includes('transformer') || lower.includes('attn') || lower.includes('vit') || lower.includes('vision')) return '#a78bfa';
  if (lower.includes('mlp')) return '#34d399';
  if (lower.includes('embed') || lower.includes('patch')) return '#22d3ee';
  return '#6366f1';
}

/** Expanded container glass tint by depth. */
export function getExpandedContainerColor(_op: string, depth: number): string {
  if (depth === 0) return '#e0f2fe';
  if (depth === 1) return '#ccfbf1';
  if (depth === 2) return '#a5b4fc';
  if (depth >= 3) return '#818cf8';
  return '#a78bfa';
}

/** Expanded container opacity by depth. */
export function getExpandedContainerOpacity(depth: number): number {
  if (depth === 0) return 0.15;
  if (depth === 1) return 0.25;
  if (depth === 2) return 0.35;
  return 0.4;
}

export const ERROR_COLOR = '#ef4444';
export const EDGE_COLOR_STD = '#52525b';

/** Expand/Collapse button theme (zinc palette, matches dark UI). */
export const BTN_BG = '#27272a';
export const BTN_BG_HOVER = '#3f3f46';
export const BTN_BORDER = '#52525b';
export const BTN_ICON = '#e4e4e7';
export const EDGE_COLOR_RESIDUAL = '#a1a1aa';
export const EDGE_EDGES_OPAQUE = '#94a3b8';
export const EDGE_EDGES_GLASS = '#bae6fd';

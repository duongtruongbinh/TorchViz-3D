/**
 * Visual Taxonomy for TorchViz-3D
 *
 * Single source of truth for mapping op_type → visual classification,
 * rendering metadata, colors, and shape hints.
 * Consumed by both Canvas3D (3D) and svgExport (2D/2.5D).
 */

// ── Visual Kind enum ──────────────────────────────────────────────

export type VisualKind =
  | 'Conv'
  | 'Linear'
  | 'Pool'
  | 'Norm'
  | 'Activation_ReLU'
  | 'Activation_Sigmoid'
  | 'Activation_GELU'
  | 'Activation_SiLU'
  | 'Activation_Tanh'
  | 'Activation_Softmax'
  | 'Activation_Other'
  | 'Dropout'
  | 'Flatten'
  | 'Reshape'
  | 'Permute'
  | 'Slice'
  | 'AddConcat'
  | 'Attention'
  | 'Embedding'
  | 'RNN'
  | 'Upsample'
  | 'Container'
  | 'Default';

// ── Classifier ────────────────────────────────────────────────────

const KIND_RULES: [RegExp, VisualKind][] = [
  [/^relu$/i, 'Activation_ReLU'],
  [/^sigmoid$/i, 'Activation_Sigmoid'],
  [/^gelu$/i, 'Activation_GELU'],
  [/^silu$/i, 'Activation_SiLU'],
  [/^tanh$/i, 'Activation_Tanh'],
  [/^softmax$/i, 'Activation_Softmax'],
  [/^(leakyrelu|elu|hardswish|hard_swish)$/i, 'Activation_Other'],
  [/^dropout/i, 'Dropout'],
  [/conv/i, 'Conv'],
  [/linear|mlp/i, 'Linear'],
  [/pool/i, 'Pool'],
  [/norm/i, 'Norm'],
  [/^add$/i, 'AddConcat'],
  [/^concat$/i, 'AddConcat'],
  [/cat/i, 'AddConcat'],
  [/attn|attention/i, 'Attention'],
  [/flatten/i, 'Flatten'],
  [/reshape/i, 'Reshape'],
  [/permute/i, 'Permute'],
  [/slice/i, 'Slice'],
  [/embedding/i, 'Embedding'],
  [/rnn|lstm|gru/i, 'RNN'],
  [/pixelshuffle|upsample/i, 'Upsample'],
  [/matmul/i, 'Linear'],
];

export function getVisualKind(opType: string): VisualKind {
  for (const [re, kind] of KIND_RULES) {
    if (re.test(opType)) return kind;
  }
  return 'Default';
}

// ── Visual Metadata ───────────────────────────────────────────────

export interface VisualMeta {
  kind: VisualKind;
  /** Semantic category label for legend */
  category: string;
  /** Base hex color */
  color: string;
  /** Corner radius for RoundedBox (3D) */
  cornerRadius: number;
  /** Multipliers applied to layout-computed dimensions */
  widthMul: number;
  heightMul: number;
  depthMul: number;
  /** SVG stroke dash-array or '' for solid */
  svgStrokeDash: string;
  /** SVG stroke width multiplier */
  svgStrokeWidthMul: number;
  /** Whether this kind should use a special geometry in 3D (non-box) */
  specialGeometry: boolean;
  /** Human-readable label override (null = use op_type as-is) */
  labelOverride: string | null;
}

/** Color palette — kept in sync with existing OP_COLORS order */
const COLORS = {
  conv: '#60a5fa',
  linear: '#34d399',
  pool: '#fbbf24',
  norm: '#f472b6',
  attention: '#a78bfa',
  addConcat: '#f87171',
  activation: '#22d3ee',
  activationSigmoid: '#06b6d4',
  activationGELU: '#67e8f9',
  activationSiLU: '#a5f3fc',
  activationTanh: '#2dd4bf',
  activationSoftmax: '#0891b2',
  dropout: '#fb7185',
  embedding: '#c084fc',
  rnn: '#fb923c',
  upsample: '#2dd4bf',
  flatten: '#f59e0b',
  default: '#94a3b8',
} as const;

const META_MAP: Record<VisualKind, Omit<VisualMeta, 'kind'>> = {
  Conv: {
    category: 'Conv',
    color: COLORS.conv,
    cornerRadius: 0.02,
    widthMul: 1.0,
    heightMul: 1.0,
    depthMul: 1.8,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: false,
    labelOverride: null,
  },
  Linear: {
    category: 'Linear',
    color: COLORS.linear,
    cornerRadius: 0.02,
    widthMul: 0.4,
    heightMul: 1.3,
    depthMul: 1.0,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: false,
    labelOverride: null,
  },
  Pool: {
    category: 'Pool',
    color: COLORS.pool,
    cornerRadius: 0.015,
    widthMul: 1.0,
    heightMul: 0.9,
    depthMul: 0.9,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1.0,
    specialGeometry: true,
    labelOverride: null,
  },
  Norm: {
    category: 'Norm',
    color: COLORS.norm,
    cornerRadius: 0.01,
    widthMul: 0.3,
    heightMul: 1.0,
    depthMul: 1.0,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: false,
    labelOverride: null,
  },
  Activation_ReLU: {
    category: 'Activation',
    color: COLORS.activation,
    cornerRadius: 0.0,
    widthMul: 0.2,
    heightMul: 0.7,
    depthMul: 0.7,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: true,
    labelOverride: 'ReLU',
  },
  Activation_Sigmoid: {
    category: 'Activation',
    color: COLORS.activationSigmoid,
    cornerRadius: 0.15,
    widthMul: 0.2,
    heightMul: 0.7,
    depthMul: 0.7,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: true,
    labelOverride: 'Sigmoid',
  },
  Activation_GELU: {
    category: 'Activation',
    color: COLORS.activationGELU,
    cornerRadius: 0.08,
    widthMul: 0.2,
    heightMul: 0.7,
    depthMul: 0.7,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: false,
    labelOverride: 'GELU',
  },
  Activation_SiLU: {
    category: 'Activation',
    color: COLORS.activationSiLU,
    cornerRadius: 0.08,
    widthMul: 0.2,
    heightMul: 0.7,
    depthMul: 0.7,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: false,
    labelOverride: 'SiLU',
  },
  Activation_Tanh: {
    category: 'Activation',
    color: COLORS.activationTanh,
    cornerRadius: 0.08,
    widthMul: 0.2,
    heightMul: 0.7,
    depthMul: 0.7,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: false,
    labelOverride: 'Tanh',
  },
  Activation_Softmax: {
    category: 'Activation',
    color: COLORS.activationSoftmax,
    cornerRadius: 0.04,
    widthMul: 0.2,
    heightMul: 0.7,
    depthMul: 0.7,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: false,
    labelOverride: 'Softmax',
  },
  Activation_Other: {
    category: 'Activation',
    color: COLORS.activation,
    cornerRadius: 0.04,
    widthMul: 0.2,
    heightMul: 0.7,
    depthMul: 0.7,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: false,
    labelOverride: null,
  },
  Dropout: {
    category: 'Dropout',
    color: COLORS.dropout,
    cornerRadius: 0.02,
    widthMul: 0.25,
    heightMul: 0.75,
    depthMul: 0.75,
    svgStrokeDash: '4 3',
    svgStrokeWidthMul: 1,
    specialGeometry: true,
    labelOverride: null,
  },
  Flatten: {
    category: 'Flatten/Reshape',
    color: COLORS.flatten,
    cornerRadius: 0.01,
    widthMul: 0.15,
    heightMul: 0.8,
    depthMul: 0.8,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: true,
    labelOverride: null,
  },
  Reshape: {
    category: 'Flatten/Reshape',
    color: COLORS.flatten,
    cornerRadius: 0.01,
    widthMul: 0.15,
    heightMul: 0.8,
    depthMul: 0.8,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: true,
    labelOverride: null,
  },
  Permute: {
    category: 'Flatten/Reshape',
    color: COLORS.flatten,
    cornerRadius: 0.01,
    widthMul: 0.15,
    heightMul: 0.8,
    depthMul: 0.8,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: true,
    labelOverride: null,
  },
  Slice: {
    category: 'Flatten/Reshape',
    color: COLORS.flatten,
    cornerRadius: 0.01,
    widthMul: 0.15,
    heightMul: 0.8,
    depthMul: 0.8,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: true,
    labelOverride: null,
  },
  AddConcat: {
    category: 'Add/Concat',
    color: COLORS.addConcat,
    cornerRadius: 0.02,
    widthMul: 0.6,
    heightMul: 0.8,
    depthMul: 0.8,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1.0,
    specialGeometry: true,
    labelOverride: null,
  },
  Attention: {
    category: 'Attention',
    color: COLORS.attention,
    cornerRadius: 0.02,
    widthMul: 1.2,
    heightMul: 1.0,
    depthMul: 1.2,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: true,
    labelOverride: null,
  },
  Embedding: {
    category: 'Embedding',
    color: COLORS.embedding,
    cornerRadius: 0.03,
    widthMul: 0.6,
    heightMul: 1.2,
    depthMul: 1.0,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: false,
    labelOverride: null,
  },
  RNN: {
    category: 'RNN/LSTM/GRU',
    color: COLORS.rnn,
    cornerRadius: 0.03,
    widthMul: 1.0,
    heightMul: 1.0,
    depthMul: 1.2,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: false,
    labelOverride: null,
  },
  Upsample: {
    category: 'Upsample',
    color: COLORS.upsample,
    cornerRadius: 0.02,
    widthMul: 1.0,
    heightMul: 1.0,
    depthMul: 1.3,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: true,
    labelOverride: null,
  },
  Container: {
    category: 'Container',
    color: '#6366f1',
    cornerRadius: 0.03,
    widthMul: 1.0,
    heightMul: 1.0,
    depthMul: 1.0,
    svgStrokeDash: '6 4',
    svgStrokeWidthMul: 1.5,
    specialGeometry: false,
    labelOverride: null,
  },
  Default: {
    category: 'Default',
    color: COLORS.default,
    cornerRadius: 0.02,
    widthMul: 1.0,
    heightMul: 1.0,
    depthMul: 1.0,
    svgStrokeDash: '',
    svgStrokeWidthMul: 1,
    specialGeometry: false,
    labelOverride: null,
  },
};

export function getVisualMeta(opType: string): VisualMeta {
  const kind = getVisualKind(opType);
  return { kind, ...META_MAP[kind] };
}

// ── Activation sub-kind helpers ───────────────────────────────────

export type ActivationSubKind = 'relu' | 'sigmoid' | 'gelu' | 'silu' | 'tanh' | 'softmax' | 'other';

export function getActivationSubKind(kind: VisualKind): ActivationSubKind | null {
  switch (kind) {
    case 'Activation_ReLU': return 'relu';
    case 'Activation_Sigmoid': return 'sigmoid';
    case 'Activation_GELU': return 'gelu';
    case 'Activation_SiLU': return 'silu';
    case 'Activation_Tanh': return 'tanh';
    case 'Activation_Softmax': return 'softmax';
    case 'Activation_Other': return 'other';
    default: return null;
  }
}

export function isActivation(kind: VisualKind): boolean {
  return kind.startsWith('Activation_');
}

// ── Legend data ───────────────────────────────────────────────────

/** Unique categories for legend display, preserving order. */
export function getLegendItems(): { label: string; color: string; kind: VisualKind }[] {
  const seen = new Set<string>();
  const items: { label: string; color: string; kind: VisualKind }[] = [];
  // Ordered list of representative kinds for legend
  const order: VisualKind[] = [
    'Conv', 'Linear', 'Pool', 'Norm', 'Activation_ReLU',
    'Dropout', 'Flatten', 'AddConcat', 'Attention', 'Embedding', 'RNN',
    'Upsample', 'Default',
  ];
  for (const k of order) {
    const meta = META_MAP[k];
    if (!seen.has(meta.category)) {
      seen.add(meta.category);
      items.push({ label: meta.category, color: meta.color, kind: k });
    }
  }
  return items;
}

// ── Typography helpers ────────────────────────────────────────────

/** Compute scale-aware font size with min/max clamping. */
export function computeFontSize(
  blockHeight: number,
  scale: number,
  opts?: { factor?: number; min?: number; max?: number },
): number {
  const factor = opts?.factor ?? 0.12;
  const min = opts?.min ?? 8;
  const max = opts?.max ?? 22;
  return Math.max(min, Math.min(max, blockHeight * scale * factor));
}

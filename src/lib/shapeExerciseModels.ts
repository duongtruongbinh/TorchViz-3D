import type { LayoutNode } from './irTypes';
import {
  getConv2dOutputShape,
  getConv2dShapeBreakdown,
  getPassthroughOutputShape,
  getPool2dOutputShape,
  getPool2dShapeBreakdown,
  normalize2DParam,
  type Conv2dShapeConfig,
  type Pool2dShapeConfig,
  type Shape2DParam,
  type SpatialShapeBreakdown,
} from './shapeMath.ts';

type ExerciseLanguage = 'en' | 'vi';

export type ShapeExerciseId = 'shape-output' | 'attention-shape';

export type ShapeExerciseModel = {
  opType: string;
  inputShape: number[];
  expectedShape: number[];
  configRows: string[];
  breakdown: SpatialShapeBreakdown | null;
  adaptiveHint?: { h: number; w: number };
  hintLines?: string[];
  dimLabels?: string[];
};

const POOL_PARAM_CANDIDATES = {
  kernel: [2, 3, 4, 5, 7],
  stride: [1, 2, 3, 4, 5, 7],
  padding: [0, 1, 2, 3],
};

export function buildShapeExerciseModel(
  node: LayoutNode,
  id: ShapeExerciseId = 'shape-output',
  language: ExerciseLanguage = 'en',
): ShapeExerciseModel | null {
  if (id === 'attention-shape') return buildAttentionShapeModel(node, language);

  const inputShape = normalizeShape(node.in_shape);
  const observedOutputShape = normalizeShape(node.out_shape);
  if (!inputShape.length || !observedOutputShape.length) return null;

  if (/conv2d/i.test(node.op_type)) {
    const config = getConvConfig(node, inputShape, observedOutputShape);
    return {
      opType: node.op_type,
      inputShape,
      expectedShape: getConv2dOutputShape(inputShape, config),
      configRows: describeConvConfig(config),
      breakdown: getConv2dShapeBreakdown(inputShape, config),
    };
  }

  if (/adaptiveavgpool/i.test(node.op_type)) {
    return {
      opType: node.op_type,
      inputShape,
      expectedShape: observedOutputShape,
      configRows: [`output_size=${formatShape(observedOutputShape.slice(-2))}`],
      breakdown: null,
      adaptiveHint: { h: observedOutputShape[2], w: observedOutputShape[3] },
    };
  }

  if (/maxpool(?:2d)?|avgpool(?:2d)?/i.test(node.op_type)) {
    const config = getPoolConfig(node, inputShape, observedOutputShape);
    return {
      opType: node.op_type,
      inputShape,
      expectedShape: getPool2dOutputShape(inputShape, config),
      configRows: describePoolConfig(config),
      breakdown: getPool2dShapeBreakdown(inputShape, config),
    };
  }

  if (/batchnorm/i.test(node.op_type)) {
    return {
      opType: node.op_type,
      inputShape,
      expectedShape: getPassthroughOutputShape(inputShape),
      configRows: [`num_features=${inputShape[1]}`, 'keeps [N, C, H, W]'],
      breakdown: null,
      hintLines: language === 'vi'
        ? [
          'BatchNorm2d chuẩn hóa độc lập theo từng kênh C.',
          'Số kênh C giữ nguyên; N, H và W cũng không đổi.',
        ]
        : [
          'BatchNorm2d normalizes each channel C independently.',
          'The channel count C stays the same; N, H, and W also stay unchanged.',
        ],
    };
  }

  return null;
}

function buildAttentionShapeModel(node: LayoutNode, language: ExerciseLanguage): ShapeExerciseModel | null {
  if (!/attn|attention/i.test(node.op_type)) return null;

  const qShape = [2, 4, 8];
  const kShape = [2, 6, 8];
  const vShape = [2, 6, 10];
  return {
    opType: node.op_type,
    inputShape: qShape,
    expectedShape: [qShape[0], qShape[1], vShape[2]],
    configRows: [`Q=${formatShape(qShape)}`, `K=${formatShape(kShape)}`, `V=${formatShape(vShape)}`],
    breakdown: null,
    dimLabels: ['B', 'T', 'Dv'],
    hintLines: language === 'vi'
      ? [
        'QK^T khớp theo Dk và tạo score [B, T, S] = [2, 4, 6].',
        'score @ V giữ B và T, rồi lấy Dv từ V.',
        'Shape context là [B, T, Dv] = [2, 4, 10].',
      ]
      : [
        'QK^T matches Dk and produces score [B, T, S] = [2, 4, 6].',
        'score @ V keeps B and T, then takes Dv from V.',
        'context shape is [B, T, Dv] = [2, 4, 10].',
      ],
  };
}

function getConvConfig(
  node: LayoutNode,
  inputShape: number[],
  outputShape: number[],
): Conv2dShapeConfig {
  const meta = getMeta(node);
  const baseConfig: Conv2dShapeConfig = {
    outChannels: outputShape[1],
    kernelSize: read2DParam(meta, ['kernel', 'kernel_size'], 1),
    stride: read2DParam(meta, ['stride'], 1),
    dilation: read2DParam(meta, ['dilation'], 1),
    padding: read2DParam(meta, ['padding'], 0),
  };
  if (shapeMatches(() => getConv2dOutputShape(inputShape, baseConfig), outputShape)) {
    return baseConfig;
  }

  const inferred = inferPadding((padding) => (
    shapeMatches(() => getConv2dOutputShape(inputShape, { ...baseConfig, padding }), outputShape)
  ));
  return inferred ? { ...baseConfig, padding: inferred } : baseConfig;
}

function getPoolConfig(
  node: LayoutNode,
  inputShape: number[],
  outputShape: number[],
): Pool2dShapeConfig {
  const meta = getMeta(node);
  const explicitConfig: Pool2dShapeConfig = {
    kernelSize: read2DParam(meta, ['kernel', 'kernel_size'], 2),
    stride: read2DParam(meta, ['stride'], read2DParam(meta, ['kernel', 'kernel_size'], 2)),
    padding: read2DParam(meta, ['padding'], 0),
    dilation: read2DParam(meta, ['dilation'], 1),
  };
  if (shapeMatches(() => getPool2dOutputShape(inputShape, explicitConfig), outputShape)) {
    return explicitConfig;
  }

  const inferredPadding = inferPadding((padding) => (
    shapeMatches(() => getPool2dOutputShape(inputShape, { ...explicitConfig, padding }), outputShape)
  ));
  if (inferredPadding) return { ...explicitConfig, padding: inferredPadding };

  for (const kernel of POOL_PARAM_CANDIDATES.kernel) {
    for (const stride of POOL_PARAM_CANDIDATES.stride) {
      for (const padding of POOL_PARAM_CANDIDATES.padding) {
        const candidate: Pool2dShapeConfig = { kernelSize: kernel, stride, padding };
        if (shapeMatches(() => getPool2dOutputShape(inputShape, candidate), outputShape)) {
          return candidate;
        }
      }
    }
  }
  return explicitConfig;
}

function inferPadding(matches: (padding: Shape2DParam) => boolean): Shape2DParam | null {
  for (let padding = 0; padding <= 8; padding++) {
    if (matches(padding)) return padding;
  }
  for (let h = 0; h <= 8; h++) {
    for (let w = 0; w <= 8; w++) {
      const tuple: [number, number] = [h, w];
      if (matches(tuple)) return tuple;
    }
  }
  return null;
}

function read2DParam(
  meta: Record<string, unknown>,
  keys: string[],
  fallback: Shape2DParam,
): Shape2DParam {
  for (const key of keys) {
    const value = meta[key];
    if (typeof value === 'number') return value;
    if (Array.isArray(value) && value.length === 2 && value.every((item) => typeof item === 'number')) {
      return [value[0], value[1]];
    }
  }
  return fallback;
}

function describeConvConfig(config: Conv2dShapeConfig): string[] {
  return [
    `out_channels=${config.outChannels}`,
    `kernel=${formatParam(config.kernelSize)}`,
    `stride=${formatParam(config.stride ?? 1)}`,
    `padding=${formatParam(config.padding ?? 0)}`,
    `dilation=${formatParam(config.dilation ?? 1)}`,
  ];
}

function describePoolConfig(config: Pool2dShapeConfig): string[] {
  return [
    `kernel=${formatParam(config.kernelSize)}`,
    `stride=${formatParam(config.stride ?? config.kernelSize)}`,
    `padding=${formatParam(config.padding ?? 0)}`,
    `dilation=${formatParam(config.dilation ?? 1)}`,
  ];
}

function formatParam(value: Shape2DParam): string {
  const [h, w] = normalize2DParam(value);
  return h === w ? String(h) : `(${h}, ${w})`;
}

function formatShape(shape: number[]): string {
  return `[${shape.join(', ')}]`;
}

function shapeMatches(getShape: () => number[], expectedShape: number[]): boolean {
  try {
    const actualShape = getShape();
    return actualShape.length === expectedShape.length
      && actualShape.every((value, index) => value === expectedShape[index]);
  } catch {
    return false;
  }
}

function normalizeShape(shape: number[] | undefined): number[] {
  if (!Array.isArray(shape)) return [];
  return shape.filter((dim) => Number.isFinite(dim)).map((dim) => Math.trunc(dim));
}

function getMeta(node: LayoutNode): Record<string, unknown> {
  return node.meta ?? {};
}

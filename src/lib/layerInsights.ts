import type { IRNode } from './irTypes';
import { getVisualKind } from './visualKind.ts';

export interface ParamFormula {
  title: string;
  formula: string;
  calculation: string;
  note?: string;
}

export interface LayerInsight {
  title: string;
  inputShape: string;
  outputShape: string;
  paramsLabel: string;
  why: string;
  paramFormula: ParamFormula;
}

export function formatShape(shape?: number[]): string {
  return shape?.length ? shape.join(' x ') : '-';
}

function formatParams(params: number): string {
  return params.toLocaleString();
}

function tuple(value: unknown): number[] | null {
  if (Array.isArray(value) && value.every((v) => typeof v === 'number')) return value;
  if (typeof value === 'number') return [value, value];
  return null;
}

function last(shape: number[]): number | null {
  return shape.length ? shape[shape.length - 1] : null;
}

function zeroParamFormula(opType: string): ParamFormula {
  return {
    title: `${opType} parameters`,
    formula: 'No trainable weights',
    calculation: '0 trainable parameters',
  };
}

function getWhy(opType: string): string {
  const kind = getVisualKind(opType);
  switch (kind) {
    case 'Conv':
      return 'Learns local feature filters such as edges, textures, and spatial patterns.';
    case 'Linear':
      return 'Mixes features into task-specific scores or embeddings.';
    case 'Pool':
      return 'Reduces spatial size while keeping the strongest or averaged signals.';
    case 'Norm':
      return 'Stabilizes activations so training is less sensitive to scale shifts.';
    case 'Activation_ReLU':
    case 'Activation_Sigmoid':
    case 'Activation_GELU':
    case 'Activation_SiLU':
    case 'Activation_Softmax':
    case 'Activation_Other':
      return 'Adds non-linearity so stacked layers can model more complex patterns.';
    case 'Flatten':
    case 'Reshape':
    case 'Permute':
    case 'Slice':
      return 'Changes tensor layout so the next layer receives the expected shape.';
    case 'AddConcat':
      return 'Merges paths, commonly used for residual connections or feature fusion.';
    case 'Attention':
      return 'Lets tokens or positions weight the most relevant context dynamically.';
    case 'Embedding':
      return 'Turns discrete ids into learned dense vectors.';
    case 'RNN':
      return 'Processes sequence state over time for ordered inputs.';
    case 'Upsample':
      return 'Increases spatial resolution for decoder or segmentation outputs.';
    case 'Container':
      return 'Groups child layers so the model structure is easier to scan.';
    default:
      return 'Transforms tensor data for the next step in the model.';
  }
}

function getParamFormula(node: IRNode): ParamFormula {
  const { op_type: opType, in_shape: input, out_shape: output, params } = node;
  if (params <= 0) return zeroParamFormula(opType);

  const kind = getVisualKind(opType);

  if (kind === 'Conv') {
    const kernel = tuple(node.meta?.kernel) ?? [1, 1];
    const inChannels = input[1];
    const outChannels = output[1];
    if (inChannels && outChannels) {
      const [kh, kw] = kernel;
      return {
        title: `${opType} parameters`,
        formula: '(kernel_h x kernel_w x in_channels + bias) x out_channels',
        calculation: `(${kh} x ${kw} x ${inChannels} + 1) x ${outChannels} = ${formatParams(params)}`,
        note: 'Bias is counted as one value per output channel.',
      };
    }
  }

  if (kind === 'Linear') {
    const inFeatures = last(input);
    const outFeatures = last(output);
    if (inFeatures && outFeatures) {
      return {
        title: `${opType} parameters`,
        formula: '(in_features + bias) x out_features',
        calculation: `(${inFeatures} + 1) x ${outFeatures} = ${formatParams(params)}`,
        note: 'Bias is counted as one value per output feature.',
      };
    }
  }

  if (kind === 'Norm') {
    const features = params / 2;
    const featureLabel = Number.isInteger(features) ? formatParams(features) : 'features';
    return {
      title: `${opType} parameters`,
      formula: 'scale + shift',
      calculation: `2 x ${featureLabel} = ${formatParams(params)}`,
      note: 'Normalization layers usually learn gamma and beta.',
    };
  }

  if (kind === 'Attention') {
    const embedDim = last(output);
    if (embedDim) {
      return {
        title: `${opType} parameters`,
        formula: '4 x (embed_dim x embed_dim + bias)',
        calculation: `4 x (${embedDim} x ${embedDim} + ${embedDim}) = ${formatParams(params)}`,
        note: node.meta?.heads ? `${node.meta.heads} attention heads.` : undefined,
      };
    }
  }

  if (kind === 'Embedding') {
    const embeddingDim = last(output);
    if (embeddingDim && params % embeddingDim === 0) {
      return {
        title: `${opType} parameters`,
        formula: 'num_embeddings x embedding_dim',
        calculation: `${formatParams(params / embeddingDim)} x ${embeddingDim} = ${formatParams(params)}`,
      };
    }
  }

  if (kind === 'RNN') {
    const inputSize = last(input);
    const hiddenSize = last(output);
    const gates = /^lstm$/i.test(opType) ? 4 : /^gru$/i.test(opType) ? 3 : 1;
    if (inputSize && hiddenSize) {
      const gatePrefix = gates > 1 ? `${gates} x ` : '';
      return {
        title: `${opType} parameters`,
        formula: `${gatePrefix}(input_size x hidden_size + hidden_size x hidden_size + 2 x hidden_size) x layers`,
        calculation: `${formatParams(params)} total trainable parameters`,
        note: 'Layer count is included in the total reported by the model.',
      };
    }
  }

  return {
    title: `${opType} parameters`,
    formula: 'Reported by layer implementation',
    calculation: `${formatParams(params)} trainable parameters`,
  };
}

export function getLayerInsight(node: IRNode): LayerInsight {
  return {
    title: node.op_type,
    inputShape: formatShape(node.in_shape),
    outputShape: formatShape(node.out_shape),
    paramsLabel: `${formatParams(node.params)} params`,
    why: getWhy(node.op_type),
    paramFormula: getParamFormula(node),
  };
}

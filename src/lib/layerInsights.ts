import type { IRNode } from './irTypes';
import { strings, type LocalizedStrings } from './localization';
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

function zeroParamFormula(opType: string, t: LocalizedStrings): ParamFormula {
  return {
    title: t.layerInsight.parameterTitle(opType),
    formula: t.layerInsight.noTrainableWeights,
    calculation: t.layerInsight.zeroTrainableParameters,
  };
}

function getWhy(opType: string, t: LocalizedStrings): string {
  const kind = getVisualKind(opType);
  switch (kind) {
    case 'Conv':
      return t.layerInsight.why.conv;
    case 'Linear':
      return t.layerInsight.why.linear;
    case 'Pool':
      return t.layerInsight.why.pool;
    case 'Norm':
      return t.layerInsight.why.norm;
    case 'Activation_ReLU':
    case 'Activation_Sigmoid':
    case 'Activation_GELU':
    case 'Activation_SiLU':
    case 'Activation_Softmax':
    case 'Activation_Other':
      return t.layerInsight.why.activation;
    case 'Flatten':
    case 'Reshape':
    case 'Permute':
    case 'Slice':
      return t.layerInsight.why.transform;
    case 'AddConcat':
      return t.layerInsight.why.addConcat;
    case 'Attention':
      return t.layerInsight.why.attention;
    case 'Embedding':
      return t.layerInsight.why.embedding;
    case 'RNN':
      return t.layerInsight.why.rnn;
    case 'Upsample':
      return t.layerInsight.why.upsample;
    case 'Container':
      return t.layerInsight.why.container;
    default:
      return t.layerInsight.why.default;
  }
}

function getParamFormula(node: IRNode, t: LocalizedStrings): ParamFormula {
  const { op_type: opType, in_shape: input, out_shape: output, params } = node;
  if (params <= 0) return zeroParamFormula(opType, t);

  const kind = getVisualKind(opType);

  if (kind === 'Conv') {
    const kernel = tuple(node.meta?.kernel) ?? [1, 1];
    const inChannels = input[1];
    const outChannels = output[1];
    if (inChannels && outChannels) {
      const [kh, kw] = kernel;
      return {
        title: t.layerInsight.parameterTitle(opType),
        formula: t.layerInsight.formula.conv,
        calculation: `(${kh} x ${kw} x ${inChannels} + 1) x ${outChannels} = ${formatParams(params)}`,
        note: t.layerInsight.notes.biasOutputChannel,
      };
    }
  }

  if (kind === 'Linear') {
    const inFeatures = last(input);
    const outFeatures = last(output);
    if (inFeatures && outFeatures) {
      return {
        title: t.layerInsight.parameterTitle(opType),
        formula: t.layerInsight.formula.linear,
        calculation: `(${inFeatures} + 1) x ${outFeatures} = ${formatParams(params)}`,
        note: t.layerInsight.notes.biasOutputFeature,
      };
    }
  }

  if (kind === 'Norm') {
    const features = params / 2;
    const featureLabel = Number.isInteger(features) ? formatParams(features) : t.layerInsight.features;
    return {
      title: t.layerInsight.parameterTitle(opType),
      formula: t.layerInsight.formula.norm,
      calculation: `2 x ${featureLabel} = ${formatParams(params)}`,
      note: t.layerInsight.notes.normGammaBeta,
    };
  }

  if (kind === 'Attention') {
    const embedDim = last(output);
    if (embedDim) {
      return {
        title: t.layerInsight.parameterTitle(opType),
        formula: t.layerInsight.formula.attention,
        calculation: `4 x (${embedDim} x ${embedDim} + ${embedDim}) = ${formatParams(params)}`,
        note: node.meta?.heads ? t.layerInsight.notes.attentionHeads(node.meta.heads) : undefined,
      };
    }
  }

  if (kind === 'Embedding') {
    const embeddingDim = last(output);
    if (embeddingDim && params % embeddingDim === 0) {
      return {
        title: t.layerInsight.parameterTitle(opType),
        formula: t.layerInsight.formula.embedding,
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
        title: t.layerInsight.parameterTitle(opType),
        formula: `${gatePrefix}(input_size x hidden_size + hidden_size x hidden_size + 2 x hidden_size) x layers`,
        calculation: t.layerInsight.totalTrainableParameters(formatParams(params)),
        note: t.layerInsight.notes.layerCountIncluded,
      };
    }
  }

  return {
    title: t.layerInsight.parameterTitle(opType),
    formula: t.layerInsight.formula.reportedByLayer,
    calculation: t.layerInsight.trainableParameters(formatParams(params)),
  };
}

export function getLayerInsight(node: IRNode, t: LocalizedStrings = strings.en): LayerInsight {
  return {
    title: node.op_type,
    inputShape: formatShape(node.in_shape),
    outputShape: formatShape(node.out_shape),
    paramsLabel: t.layerInsight.paramsLabel(formatParams(node.params)),
    why: getWhy(node.op_type, t),
    paramFormula: getParamFormula(node, t),
  };
}

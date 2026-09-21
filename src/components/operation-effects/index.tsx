import type React from 'react';
import { getVisualKind, type VisualKind } from '../../lib/visualKind';
import {
  AdaptiveAvgPoolEffect,
  AvgPoolEffect,
  Conv2dEffect,
  MaxPoolEffect,
} from './SlidingWindowEffects';
import {
  AddConcatEffect,
  FlattenEffect,
  PermuteEffect,
  ReshapeEffect,
  UpsampleEffect,
} from './TransformEffects';
import {
  ActivationEffect,
  DropoutEffect,
  LinearEffect,
  NormEffect,
  ReluEffect,
  SoftmaxEffect,
} from './ValueEffects';
import { isOpType } from './shared';
import type { OperationEffectComponent, OperationEffectProps } from './types';

export type { OperationEffectProps } from './types';
export {
  AdaptiveAvgPoolEffect,
  AvgPoolEffect,
  Conv2dEffect,
  MaxPoolEffect,
} from './SlidingWindowEffects';
export {
  AddConcatEffect,
  FlattenEffect,
  PermuteEffect,
  ReshapeEffect,
  UpsampleEffect,
} from './TransformEffects';
export {
  ActivationEffect,
  DropoutEffect,
  LinearEffect,
  NormEffect,
  ReluEffect,
  SoftmaxEffect,
} from './ValueEffects';

const EFFECT_BY_KIND: Partial<Record<VisualKind, OperationEffectComponent>> = {
  Conv: Conv2dEffect,
  Norm: NormEffect,
  Activation_ReLU: ReluEffect,
  Activation_Sigmoid: ActivationEffect,
  Activation_GELU: ActivationEffect,
  Activation_SiLU: ActivationEffect,
  Activation_Tanh: ActivationEffect,
  Activation_Softmax: SoftmaxEffect,
  Dropout: DropoutEffect,
  Flatten: FlattenEffect,
  Reshape: ReshapeEffect,
  Permute: PermuteEffect,
  AddConcat: AddConcatEffect,
  Upsample: UpsampleEffect,
  Linear: LinearEffect,
};

function resolveOperationEffect(opType: string): OperationEffectComponent | null {
  const kind = getVisualKind(opType);
  if (kind === 'Pool') {
    if (isOpType(opType, /adaptiveavg/i)) return AdaptiveAvgPoolEffect;
    if (isOpType(opType, /avgpool/i)) return AvgPoolEffect;
    return MaxPoolEffect;
  }

  return EFFECT_BY_KIND[kind] ?? null;
}

export function hasOperationEffect(opType: string): boolean {
  return resolveOperationEffect(opType) !== null;
}

export const OperationEffect: React.FC<OperationEffectProps> = (props) => {
  const Effect = resolveOperationEffect(props.node.op_type);
  return Effect ? <Effect {...props} /> : null;
};

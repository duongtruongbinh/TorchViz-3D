import type { LayoutNode } from '../../lib/irTypes';

export type ExerciseId =
  | 'conv-value'
  | 'shape-output'
  | 'attention-shape'
  | 'pool-value'
  | 'linear-value'
  | 'activation-value';

export type ExerciseContext = {
  node: LayoutNode;
};

export type ExerciseDefinition = {
  id: ExerciseId;
  label: string;
  ctaLabel?: string;
  isAvailable: (context: ExerciseContext) => boolean;
};

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

export type ExerciseSurface = 'shape' | 'conv-value' | 'value';

export type ExerciseDefinition = {
  id: ExerciseId;
  label: string;
  ctaLabel?: string;
  surface: ExerciseSurface;
  isAvailable: (context: ExerciseContext) => boolean;
};

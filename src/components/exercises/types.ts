import type { ExerciseId } from '../../core/types';
import type { LayoutNode } from '../../lib/irTypes';

export type { ExerciseId };

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

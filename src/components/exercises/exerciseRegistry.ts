import type { LayoutNode } from '../../lib/irTypes';
import type { ExerciseDefinition, ExerciseId } from './types';

const EXERCISES: ExerciseDefinition[] = [
  {
    id: 'shape-output',
    label: 'Shape exercise',
    ctaLabel: 'Shape',
    isAvailable: ({ node }) => (
      /conv2d/i.test(node.op_type)
      || /maxpool(?:2d)?|avgpool(?:2d)?|adaptiveavgpool(?:2d)?/i.test(node.op_type)
      || /batchnorm/i.test(node.op_type)
    ),
  },
  {
    id: 'attention-shape',
    label: 'Attention shape exercise',
    ctaLabel: 'Shape',
    isAvailable: ({ node }) => /attn|attention/i.test(node.op_type),
  },
  {
    id: 'pool-value',
    label: 'Pooling value exercise',
    ctaLabel: 'Giá trị',
    isAvailable: ({ node }) => (
      !/adaptiveavgpool/i.test(node.op_type)
      && /maxpool(?:2d)?|avgpool(?:2d)?/i.test(node.op_type)
    ),
  },
  {
    id: 'linear-value',
    label: 'Linear value exercise',
    ctaLabel: 'Giá trị',
    isAvailable: ({ node }) => /linear/i.test(node.op_type),
  },
  {
    id: 'activation-value',
    label: 'Activation value exercise',
    ctaLabel: 'Giá trị',
    isAvailable: ({ node }) => node.op_type.toLowerCase() === 'relu',
  },
  {
    id: 'conv-value',
    label: 'Conv2d exercise',
    ctaLabel: 'Giá trị',
    isAvailable: ({ node }) => /conv/i.test(node.op_type),
  },
];

export function getExercisesForNode(node: LayoutNode | null | undefined): ExerciseDefinition[] {
  if (!node) return [];
  return EXERCISES.filter((exercise) => exercise.isAvailable({ node }));
}

export function getExerciseById(id: ExerciseId): ExerciseDefinition | null {
  return EXERCISES.find((exercise) => exercise.id === id) ?? null;
}

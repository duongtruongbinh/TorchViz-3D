import type { LearningPracticeRef } from '../../core/types';
import type { LayoutNode } from '../../lib/irTypes';
import { getExerciseById } from './exerciseRegistry';

type PracticeNodeSpec = {
  opType: string;
  inShape: number[];
  outShape: number[];
  meta?: Record<string, unknown>;
};

const PRACTICE_NODE_SPECS: Record<string, PracticeNodeSpec> = {
  'shape-basics-output': {
    opType: 'BatchNorm2d',
    inShape: [1, 16, 16, 16],
    outShape: [1, 16, 16, 16],
    meta: { num_features: 16 },
  },
  'conv2d-shape-output': {
    opType: 'Conv2d',
    inShape: [1, 3, 32, 32],
    outShape: [1, 16, 32, 32],
    meta: { out_channels: 16, kernel_size: [3, 3], stride: [1, 1], padding: [1, 1], dilation: [1, 1] },
  },
  'conv2d-value-window': {
    opType: 'Conv2d',
    inShape: [1, 3, 32, 32],
    outShape: [1, 16, 32, 32],
    meta: { out_channels: 16, kernel_size: [3, 3], stride: [1, 1], padding: [1, 1], dilation: [1, 1] },
  },
  'pool-shape-output': {
    opType: 'MaxPool2d',
    inShape: [1, 16, 32, 32],
    outShape: [1, 16, 16, 16],
    meta: { kernel_size: [2, 2], stride: [2, 2], padding: [0, 0], dilation: [1, 1] },
  },
  'pool-value-window': {
    opType: 'MaxPool2d',
    inShape: [1, 16, 32, 32],
    outShape: [1, 16, 16, 16],
    meta: { kernel_size: [2, 2], stride: [2, 2], padding: [0, 0], dilation: [1, 1] },
  },
  'linear-value-score': {
    opType: 'Linear',
    inShape: [1, 3],
    outShape: [1, 1],
    meta: { in_features: 3, out_features: 1 },
  },
  'activation-value-pass': {
    opType: 'ReLU',
    inShape: [1, 5],
    outShape: [1, 5],
  },
  'attention-shape-output': {
    opType: 'Attention',
    inShape: [2, 4, 8],
    outShape: [2, 4, 10],
  },
};

export function createLearningPracticeNode(practice: LearningPracticeRef): LayoutNode | null {
  const spec = PRACTICE_NODE_SPECS[practice.id];
  if (!spec) return null;

  const node = createNode(practice.id, spec);
  const exercise = getExerciseById(practice.exerciseId);
  if (!exercise?.isAvailable({ node })) return null;

  return node;
}

export function isLearningPracticeApproved(practice: LearningPracticeRef): boolean {
  return practice.approval?.status === 'approved' && Boolean(practice.approval.implementedBy);
}

function createNode(id: string, spec: PracticeNodeSpec): LayoutNode {
  return {
    id,
    name: spec.opType,
    op_type: spec.opType,
    in_shape: spec.inShape,
    out_shape: spec.outShape,
    params: 0,
    meta: spec.meta,
    x: 0,
    y: 0,
    z: 0,
    width: 1,
    height: 1,
    depth: 1,
    color: '#14b8a6',
  };
}

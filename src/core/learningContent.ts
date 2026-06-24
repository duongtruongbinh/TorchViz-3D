import type { LayoutNode } from '../lib/irTypes';
import type { LearningNodeFixture, LearningPath, LearningPracticeRef, LearningRole } from './types';

const SHARED_FIXTURES = {
  batchNorm: {
    opType: 'BatchNorm2d',
    inShape: [1, 16, 16, 16],
    outShape: [1, 16, 16, 16],
    meta: { num_features: 16 },
  },
  conv2d: {
    opType: 'Conv2d',
    inShape: [1, 3, 32, 32],
    outShape: [1, 16, 32, 32],
    meta: { out_channels: 16, kernel_size: [3, 3], stride: [1, 1], padding: [1, 1], dilation: [1, 1] },
  },
  maxPool: {
    opType: 'MaxPool2d',
    inShape: [1, 16, 32, 32],
    outShape: [1, 16, 16, 16],
    meta: { kernel_size: [2, 2], stride: [2, 2], padding: [0, 0], dilation: [1, 1] },
  },
  linear: {
    opType: 'Linear',
    inShape: [1, 3],
    outShape: [1, 1],
    meta: { in_features: 3, out_features: 1 },
  },
  relu: {
    opType: 'ReLU',
    inShape: [1, 5],
    outShape: [1, 5],
  },
  attention: {
    opType: 'Attention',
    inShape: [2, 4, 8],
    outShape: [2, 4, 10],
  },
} satisfies Record<string, LearningNodeFixture>;

export const learningPath: LearningPath = {
  id: 'torchviz-foundations',
  lessons: [
    {
      id: 'shape-basics',
      status: 'available',
      practice: [
        {
          id: 'shape-basics-output',
          kind: 'shape',
          exerciseId: 'shape-output',
          targetOperation: 'Conv2d / Pooling / BatchNorm',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
          fixture: SHARED_FIXTURES.batchNorm,
        },
      ],
    },
    {
      id: 'conv2d-output',
      status: 'available',
      practice: [
        {
          id: 'conv2d-shape-output',
          kind: 'shape',
          exerciseId: 'shape-output',
          targetOperation: 'Conv2d',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
          fixture: SHARED_FIXTURES.conv2d,
        },
        {
          id: 'conv2d-value-window',
          kind: 'value',
          exerciseId: 'conv-value',
          targetOperation: 'Conv2d',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
          fixture: SHARED_FIXTURES.conv2d,
        },
      ],
    },
    {
      id: 'pooling-output',
      status: 'available',
      practice: [
        {
          id: 'pool-shape-output',
          kind: 'shape',
          exerciseId: 'shape-output',
          targetOperation: 'MaxPool2d / AvgPool2d',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
          fixture: SHARED_FIXTURES.maxPool,
        },
        {
          id: 'pool-value-window',
          kind: 'value',
          exerciseId: 'pool-value',
          targetOperation: 'MaxPool2d / AvgPool2d',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
          fixture: SHARED_FIXTURES.maxPool,
        },
      ],
    },
    {
      id: 'linear-activation',
      status: 'next',
      practice: [
        {
          id: 'linear-value-score',
          kind: 'value',
          exerciseId: 'linear-value',
          targetOperation: 'Linear',
          approval: { status: 'unavailable' },
          reuseStatus: 'embedded',
          fixture: SHARED_FIXTURES.linear,
        },
        {
          id: 'activation-value-pass',
          kind: 'value',
          exerciseId: 'activation-value',
          targetOperation: 'ReLU',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
          fixture: SHARED_FIXTURES.relu,
        },
      ],
    },
    {
      id: 'attention-shape',
      status: 'locked',
      practice: [
        {
          id: 'attention-shape-output',
          kind: 'shape',
          exerciseId: 'attention-shape',
          targetOperation: 'Attention',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
          fixture: SHARED_FIXTURES.attention,
        },
      ],
    },
  ],
};

export const learningLessons = learningPath.lessons;

export const learningRoles: LearningRole[] = [
  {
    id: 'ai-engineer',
    domains: [
      {
        id: 'cv',
        lessonIds: ['shape-basics', 'conv2d-output', 'pooling-output', 'linear-activation'],
      },
      {
        id: 'nlp',
        lessonIds: ['attention-shape'],
      },
      {
        id: 'ml',
        lessonIds: ['shape-basics', 'linear-activation'],
      },
    ],
  },
  {
    id: 'data-scientist',
    domains: [
      {
        id: 'ml',
        lessonIds: ['shape-basics', 'linear-activation'],
      },
      {
        id: 'cv',
        lessonIds: ['conv2d-output', 'pooling-output'],
      },
      {
        id: 'nlp',
        lessonIds: ['attention-shape'],
      },
    ],
  },
];

export function createLearningPracticeNode(practice: LearningPracticeRef): LayoutNode {
  return createFixtureNode(practice.id, practice.fixture);
}

function createFixtureNode(id: string, fixture: LearningNodeFixture): LayoutNode {
  return {
    id,
    name: fixture.opType,
    op_type: fixture.opType,
    in_shape: fixture.inShape,
    out_shape: fixture.outShape,
    params: 0,
    meta: fixture.meta,
    x: 0,
    y: 0,
    z: 0,
    width: 1,
    height: 1,
    depth: 1,
    color: '#14b8a6',
  };
}

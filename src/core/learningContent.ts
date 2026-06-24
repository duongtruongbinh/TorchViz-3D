import type { LearningPath, LearningRole } from './types';

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
        },
        {
          id: 'conv2d-value-window',
          kind: 'value',
          exerciseId: 'conv-value',
          targetOperation: 'Conv2d',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
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
        },
        {
          id: 'pool-value-window',
          kind: 'value',
          exerciseId: 'pool-value',
          targetOperation: 'MaxPool2d / AvgPool2d',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
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
        },
        {
          id: 'activation-value-pass',
          kind: 'value',
          exerciseId: 'activation-value',
          targetOperation: 'ReLU',
          approval: { status: 'approved', implementedBy: 'nmkhiem' },
          reuseStatus: 'embedded',
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

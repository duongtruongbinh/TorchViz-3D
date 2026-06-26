import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';

export const fundamentalsDomain: LearningDomain = {
  id: 'fundamentals',
  textKey: 'fundamentals',
  status: 'active',
  trackIds: ['tensor-shape-fundamentals', 'value-flow'],
};

export const fundamentalsTracks: LearningTrack[] = [
  {
    id: 'tensor-shape-fundamentals',
    textKey: 'tensorShapeFundamentals',
    domainId: 'fundamentals',
    status: 'available',
    lessonIds: ['shape-basics'],
  },
  {
    id: 'value-flow',
    textKey: 'valueFlow',
    domainId: 'fundamentals',
    status: 'available',
    lessonIds: ['linear-activation'],
  },
];

export const fundamentalsLessons: LearningLesson[] = [
  {
    id: 'shape-basics',
    domainId: 'fundamentals',
    trackId: 'tensor-shape-fundamentals',
    status: 'available',
    sections: [{ kind: 'theory', refId: 'shape-basics' }, { kind: 'practice', refId: 'shape-basics-output' }],
    practice: [
      {
        family: 'tensor',
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
    id: 'linear-activation',
    domainId: 'fundamentals',
    trackId: 'value-flow',
    status: 'next',
    sections: [
      { kind: 'theory', refId: 'linear-activation' },
      { kind: 'practice', refId: 'linear-value-score' },
      { kind: 'practice', refId: 'activation-value-pass' },
    ],
    practice: [
      {
        family: 'tensor',
        id: 'linear-value-score',
        kind: 'value',
        exerciseId: 'linear-value',
        targetOperation: 'Linear',
        approval: { status: 'unavailable' },
        reuseStatus: 'embedded',
      },
      {
        family: 'tensor',
        id: 'activation-value-pass',
        kind: 'value',
        exerciseId: 'activation-value',
        targetOperation: 'ReLU',
        approval: { status: 'approved', implementedBy: 'nmkhiem' },
        reuseStatus: 'embedded',
      },
    ],
  },
];

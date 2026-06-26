import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';

export const cvDomain: LearningDomain = {
  id: 'cv',
  textKey: 'cv',
  status: 'active',
  trackIds: ['cnn-shape-value'],
};

export const cvTracks: LearningTrack[] = [
  {
    id: 'cnn-shape-value',
    textKey: 'cnnShapeValue',
    domainId: 'cv',
    status: 'available',
    lessonIds: ['conv2d-output', 'pooling-output'],
  },
];

export const cvLessons: LearningLesson[] = [
  {
    id: 'conv2d-output',
    domainId: 'cv',
    trackId: 'cnn-shape-value',
    status: 'available',
    sections: [
      { kind: 'theory', refId: 'conv2d-output' },
      { kind: 'practice', refId: 'conv2d-shape-output' },
      { kind: 'practice', refId: 'conv2d-value-window' },
    ],
    practice: [
      {
        family: 'tensor',
        id: 'conv2d-shape-output',
        kind: 'shape',
        exerciseId: 'shape-output',
        targetOperation: 'Conv2d',
        approval: { status: 'approved', implementedBy: 'nmkhiem' },
        reuseStatus: 'embedded',
      },
      {
        family: 'tensor',
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
    domainId: 'cv',
    trackId: 'cnn-shape-value',
    status: 'available',
    sections: [
      { kind: 'theory', refId: 'pooling-output' },
      { kind: 'practice', refId: 'pool-shape-output' },
      { kind: 'practice', refId: 'pool-value-window' },
    ],
    practice: [
      {
        family: 'tensor',
        id: 'pool-shape-output',
        kind: 'shape',
        exerciseId: 'shape-output',
        targetOperation: 'MaxPool2d / AvgPool2d',
        approval: { status: 'approved', implementedBy: 'nmkhiem' },
        reuseStatus: 'embedded',
      },
      {
        family: 'tensor',
        id: 'pool-value-window',
        kind: 'value',
        exerciseId: 'pool-value',
        targetOperation: 'MaxPool2d / AvgPool2d',
        approval: { status: 'approved', implementedBy: 'nmkhiem' },
        reuseStatus: 'embedded',
      },
    ],
  },
];

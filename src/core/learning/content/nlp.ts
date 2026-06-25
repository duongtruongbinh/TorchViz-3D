import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';

export const nlpDomain: LearningDomain = {
  id: 'nlp',
  status: 'partial',
  trackIds: ['attention-shapes'],
};

export const nlpTracks: LearningTrack[] = [
  {
    id: 'attention-shapes',
    domainId: 'nlp',
    status: 'available',
    lessonIds: ['attention-shape'],
  },
];

export const nlpLessons: LearningLesson[] = [
  {
    id: 'attention-shape',
    domainId: 'nlp',
    trackId: 'attention-shapes',
    status: 'locked',
    sections: [
      { kind: 'theory', refId: 'attention-shape' },
      { kind: 'practice', refId: 'attention-shape-output' },
    ],
    practice: [
      {
        family: 'tensor',
        id: 'attention-shape-output',
        kind: 'shape',
        exerciseId: 'attention-shape',
        targetOperation: 'Attention',
        approval: { status: 'approved', implementedBy: 'nmkhiem' },
        reuseStatus: 'embedded',
      },
    ],
  },
];

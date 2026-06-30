import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';

export const robotLearningDomain: LearningDomain = {
  id: 'robot-learning',
  textKey: 'robotLearning',
  status: 'partial',
  trackIds: ['embodied-agents'],
};

export const robotLearningTracks: LearningTrack[] = [
  {
    id: 'embodied-agents',
    textKey: 'embodiedAgents',
    domainId: 'robot-learning',
    status: 'available',
    lessonIds: ['robot-state-action', 'control-loop-basics', 'imitation-learning', 'sim-to-real'],
  },
];

export const robotLearningLessons: LearningLesson[] = [
  {
    id: 'robot-state-action',
    domainId: 'robot-learning',
    trackId: 'embodied-agents',
    status: 'locked',
    sections: [{ kind: 'theory', refId: 'robot-state-action' }, { kind: 'code', refId: 'robot-state-action-code' }],
    practice: [],
  },
  {
    id: 'control-loop-basics',
    domainId: 'robot-learning',
    trackId: 'embodied-agents',
    status: 'locked',
    sections: [{ kind: 'theory', refId: 'control-loop-basics' }, { kind: 'calculation', refId: 'control-loop-basics-calculation' }],
    practice: [],
  },
  {
    id: 'imitation-learning',
    domainId: 'robot-learning',
    trackId: 'embodied-agents',
    status: 'locked',
    sections: [{ kind: 'theory', refId: 'imitation-learning' }, { kind: 'code', refId: 'imitation-learning-code' }],
    practice: [],
  },
  {
    id: 'sim-to-real',
    domainId: 'robot-learning',
    trackId: 'embodied-agents',
    status: 'locked',
    sections: [{ kind: 'theory', refId: 'sim-to-real' }, { kind: 'calculation', refId: 'sim-to-real-calculation' }],
    practice: [],
  },
];

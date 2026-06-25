import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';

export const robotLearningDomain: LearningDomain = {
  id: 'robot-learning',
  status: 'placeholder',
  trackIds: ['embodied-agents'],
};

export const robotLearningTracks: LearningTrack[] = [
  {
    id: 'embodied-agents',
    domainId: 'robot-learning',
    status: 'placeholder',
    lessonIds: [],
  },
];

export const robotLearningLessons: LearningLesson[] = [];

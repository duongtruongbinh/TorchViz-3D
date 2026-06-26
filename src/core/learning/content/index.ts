import type { LearningCatalog } from '../types.ts';
import { cvDomain, cvLessons, cvTracks } from './cv.ts';
import { fundamentalsDomain, fundamentalsLessons, fundamentalsTracks } from './fundamentals.ts';
import { nlpDomain, nlpLessons, nlpTracks } from './nlp.ts';
import {
  reinforcementLearningDomain,
  reinforcementLearningLessons,
  reinforcementLearningTracks,
} from './reinforcementLearning.ts';
import { robotLearningDomain, robotLearningLessons, robotLearningTracks } from './robotLearning.ts';

export const learningCatalog: LearningCatalog = {
  domains: [
    fundamentalsDomain,
    cvDomain,
    nlpDomain,
    reinforcementLearningDomain,
    robotLearningDomain,
  ],
  tracks: [
    ...fundamentalsTracks,
    ...cvTracks,
    ...nlpTracks,
    ...reinforcementLearningTracks,
    ...robotLearningTracks,
  ],
  lessons: [
    ...fundamentalsLessons,
    ...cvLessons,
    ...nlpLessons,
    ...reinforcementLearningLessons,
    ...robotLearningLessons,
  ],
};

export type {
  LearningCatalog,
  LearningDomain,
  LearningDomainId,
  LearningLesson,
  LearningPracticeRef,
  LearningTrack,
} from '../types.ts';

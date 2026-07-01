import type { LearningCatalog } from '../types.ts';
import {
  aiEthicsSafetyGovernanceDomain,
  aiEthicsSafetyGovernanceLessons,
  aiEthicsSafetyGovernanceTracks,
} from './aiEthicsSafetyGovernance.ts';
import { aiSystemDesignDomain, aiSystemDesignLessons, aiSystemDesignTracks } from './aiSystemDesign.ts';
import { cvDomain, cvLessons, cvTracks } from './cv.ts';
import { deepLearningDomain, deepLearningLessons, deepLearningTracks } from './deepLearning.ts';
import { fundamentalsDomain, fundamentalsLessons, fundamentalsTracks } from './fundamentals.ts';
import {
  llmAiEngineeringDomain,
  llmAiEngineeringLessons,
  llmAiEngineeringTracks,
} from './llm-ai-engineering/index.ts';
import { mathStatisticsAiDomain, mathStatisticsAiLessons, mathStatisticsAiTracks } from './mathStatisticsAi.ts';
import {
  mlopsLlmopsProductionSystemsDomain,
  mlopsLlmopsProductionSystemsLessons,
  mlopsLlmopsProductionSystemsTracks,
} from './mlopsLlmopsProductionSystems.ts';
import { nlpDomain, nlpLessons, nlpTracks } from './nlp.ts';
import {
  programmingFoundationDomain,
  programmingFoundationLessons,
  programmingFoundationTracks,
} from './programmingFoundation.ts';
import {
  reinforcementLearningDomain,
  reinforcementLearningLessons,
  reinforcementLearningTracks,
} from './reinforcementLearning.ts';
import { robotLearningDomain, robotLearningLessons, robotLearningTracks } from './robotLearning.ts';

export const learningCatalog: LearningCatalog = {
  domains: [
    programmingFoundationDomain,
    mathStatisticsAiDomain,
    fundamentalsDomain,
    deepLearningDomain,
    cvDomain,
    nlpDomain,
    llmAiEngineeringDomain,
    mlopsLlmopsProductionSystemsDomain,
    aiSystemDesignDomain,
    reinforcementLearningDomain,
    aiEthicsSafetyGovernanceDomain,
    robotLearningDomain,
  ],
  tracks: [
    ...programmingFoundationTracks,
    ...mathStatisticsAiTracks,
    ...fundamentalsTracks,
    ...deepLearningTracks,
    ...cvTracks,
    ...nlpTracks,
    ...llmAiEngineeringTracks,
    ...mlopsLlmopsProductionSystemsTracks,
    ...aiSystemDesignTracks,
    ...reinforcementLearningTracks,
    ...aiEthicsSafetyGovernanceTracks,
    ...robotLearningTracks,
  ],
  lessons: [
    ...programmingFoundationLessons,
    ...mathStatisticsAiLessons,
    ...fundamentalsLessons,
    ...deepLearningLessons,
    ...cvLessons,
    ...nlpLessons,
    ...llmAiEngineeringLessons,
    ...mlopsLlmopsProductionSystemsLessons,
    ...aiSystemDesignLessons,
    ...reinforcementLearningLessons,
    ...aiEthicsSafetyGovernanceLessons,
    ...robotLearningLessons,
  ],
  routeAliases: [
    {
      domainId: 'nlp',
      fromLessonId: 'attention-shape',
      toTrackId: 'transformer-architecture',
      toLessonId: 'self-attention',
    },
    {
      domainId: 'reinforcement-learning',
      fromTrackId: 'tabular-control',
      toTrackId: 'rl-fundamentals',
    },
    {
      domainId: 'reinforcement-learning',
      fromTrackId: 'policy-behavior',
      toTrackId: 'value-based-methods',
    },
    {
      domainId: 'reinforcement-learning',
      fromLessonId: 'rl-mdp-basics',
      toTrackId: 'rl-fundamentals',
      toLessonId: 'markov-decision-processes',
    },
    {
      domainId: 'reinforcement-learning',
      fromLessonId: 'rl-bellman',
      toTrackId: 'rl-fundamentals',
      toLessonId: 'value-function',
    },
    {
      domainId: 'reinforcement-learning',
      fromLessonId: 'rl-q-learning',
      toTrackId: 'value-based-methods',
      toLessonId: 'q-learning',
    },
    {
      domainId: 'reinforcement-learning',
      fromLessonId: 'rl-sarsa',
      toTrackId: 'value-based-methods',
      toLessonId: 'sarsa-on-policy-td',
    },
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

import type { LearningDomain, LearningLesson, LearningTrack } from '../../types.ts';
import { buildPlaceholderContent } from '../seed.ts';
import { APPROVED_LLM_LESSON_IDS } from './approval.ts';
import { chapters } from './tracks.ts';

const llmAiEngineeringContent = buildPlaceholderContent({
  domainId: 'llm-ai-engineering',
  domainTextKey: 'llmAiEngineering',
  domainStatus: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
});

export const llmAiEngineeringDomain: LearningDomain = {
  ...llmAiEngineeringContent.domain,
  mdx: {
    fallbackLocales: ['vi'],
    approvedLessonIds: [...APPROVED_LLM_LESSON_IDS],
  },
};
export const llmAiEngineeringTracks: LearningTrack[] = llmAiEngineeringContent.tracks;
export const llmAiEngineeringLessons: LearningLesson[] = llmAiEngineeringContent.lessons;

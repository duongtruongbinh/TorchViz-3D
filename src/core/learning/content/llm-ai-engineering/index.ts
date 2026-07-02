import type { LearningDomain, LearningLesson, LearningTrack } from '../../types.ts';
import { buildPlaceholderContent } from '../seed.ts';
import { isApprovedLesson } from './approval.ts';
import { llmFromScratchExtras } from './extras.ts';
import { chapters } from './tracks.ts';

const llmAiEngineeringContent = buildPlaceholderContent({
  domainId: 'llm-ai-engineering',
  domainTextKey: 'llmAiEngineering',
  domainStatus: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
});

export const llmAiEngineeringDomain: LearningDomain = llmAiEngineeringContent.domain;
export const llmAiEngineeringTracks: LearningTrack[] = llmAiEngineeringContent.tracks;
export const llmAiEngineeringLessons: LearningLesson[] = llmAiEngineeringContent.lessons.map((lesson) => {
  const extras = isApprovedLesson(lesson.id) ? llmFromScratchExtras[lesson.id] : undefined;
  return extras ? { ...lesson, extras } : lesson;
});

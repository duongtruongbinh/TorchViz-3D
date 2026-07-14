export const APPROVED_LLM_LESSON_IDS = [
  'minimal-llm-project-skeleton',
  'llm-from-scratch-roadmap',
  'llm-component-checkpoint-quiz',
  'llm-data-pipeline-overview',
  'llm-data-pipeline-checkpoint-quiz',
] as const;

const APPROVED_LESSON_IDS = new Set<string>(APPROVED_LLM_LESSON_IDS);

export function isApprovedLesson(lessonId: string): boolean {
  return APPROVED_LESSON_IDS.has(lessonId);
}

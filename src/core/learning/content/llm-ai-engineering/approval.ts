const APPROVED_LESSON_IDS = new Set<string>([
  'minimal-llm-project-skeleton',
  'llm-from-scratch-roadmap',
  'llm-component-checkpoint-quiz',
  'llm-data-pipeline-overview',
  'llm-data-pipeline-checkpoint-quiz',
]);

export function isApprovedLesson(lessonId: string): boolean {
  return APPROVED_LESSON_IDS.has(lessonId);
}

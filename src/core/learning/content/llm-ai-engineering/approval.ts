const APPROVED_LESSON_IDS = new Set<string>([
  'llm-from-scratch-roadmap',
  'llm-component-checkpoint-quiz',
  'minimal-llm-project-skeleton',
]);

export function isApprovedLesson(lessonId: string): boolean {
  return APPROVED_LESSON_IDS.has(lessonId);
}

const APPROVED_LESSON_IDS = new Set<string>([
  'llm-data-pipeline-overview',
]);

export function isApprovedLesson(lessonId: string): boolean {
  return APPROVED_LESSON_IDS.has(lessonId);
}

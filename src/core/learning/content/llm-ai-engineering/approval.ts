const APPROVED_LESSON_IDS = new Set<string>(['llm-from-scratch-roadmap']);

export function isApprovedLesson(lessonId: string): boolean {
  return APPROVED_LESSON_IDS.has(lessonId);
}

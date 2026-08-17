import type { LearningLesson } from './types.ts';

export function getLearningLessonIdentity(lesson: Pick<LearningLesson, 'domainId' | 'id'>): string {
  return `${lesson.domainId}/${lesson.id}`;
}

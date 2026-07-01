import type { LearningLessonApproval } from '../../types.ts';

export const APPROVED_LESSONS: Record<string, LearningLessonApproval> = {
  'llm-from-scratch-roadmap': {
    status: 'approved',
    approvedBy: 'nmkhiem',
    approvedAt: '2026-07-02',
  },
};

export function isApprovedLesson(lessonId: string): boolean {
  return APPROVED_LESSONS[lessonId]?.status === 'approved';
}

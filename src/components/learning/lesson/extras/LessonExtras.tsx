import type { LearningLessonExtra } from '../../../../core/learning/types';
import type { Language } from '../../../../lib/localization';
import { getLearningLabTheme } from '../../theme';
import LessonExtraRenderer, { type QuizQuestionState } from './LessonExtraRenderer';

type LessonExtrasProps = {
  extras: LearningLessonExtra[];
  language: Language;
  quizQuestionStates?: Record<string, QuizQuestionState>;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  className?: string;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
};

export default function LessonExtras({
  extras,
  language,
  quizQuestionStates,
  themeClasses,
  className = 'mt-5 grid gap-5',
  onQuizQuestionStateChange,
}: LessonExtrasProps) {
  if (!extras.length) return null;

  return (
    <div className={className}>
      {extras.map((extra) => (
        <LessonExtraRenderer
          key={extra.id}
          extra={extra}
          language={language}
          quizQuestionStates={quizQuestionStates}
          themeClasses={themeClasses}
          onQuizQuestionStateChange={onQuizQuestionStateChange}
        />
      ))}
    </div>
  );
}

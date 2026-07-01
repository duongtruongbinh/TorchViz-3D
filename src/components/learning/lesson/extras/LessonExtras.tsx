import type { LearningLessonExtra } from '../../../../core/learning/types';
import type { Language } from '../../../../lib/localization';
import { getLearningLabTheme } from '../../theme';
import LessonExtraRenderer from './LessonExtraRenderer';

type LessonExtrasProps = {
  extras: LearningLessonExtra[];
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  className?: string;
};

export default function LessonExtras({ extras, language, themeClasses, className = 'mt-5 grid gap-5' }: LessonExtrasProps) {
  if (!extras.length) return null;

  return (
    <div className={className}>
      {extras.map((extra) => (
        <LessonExtraRenderer key={extra.id} extra={extra} language={language} themeClasses={themeClasses} />
      ))}
    </div>
  );
}

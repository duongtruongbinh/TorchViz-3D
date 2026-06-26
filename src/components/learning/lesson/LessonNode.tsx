import type { LearningLesson } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import { getUnifiedLessonText } from '../learningText';
import { cx, getLearningLabTheme, type LearningLabTheme } from '../theme';

type LessonNodeProps = {
  lesson: LearningLesson;
  index: number;
  isSelected: boolean;
  language: Language;
  theme: LearningLabTheme;
  onSelect: (lessonId: string) => void;
};

export default function LessonNode({ lesson, index, isSelected, language, theme, onSelect }: LessonNodeProps) {
  const strings = getStrings(language);
  const lessonText = getUnifiedLessonText(language, lesson);
  const themeClasses = getLearningLabTheme(theme);

  return (
    <button
      type="button"
      onClick={() => onSelect(lesson.id)}
      className={cx(
        'w-full rounded-xl border p-4 text-left shadow-sm transition-all',
        themeClasses.focusRing,
        themeClasses.lessonCard(isSelected),
      )}
    >
      <div className="flex items-start gap-3">
        <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-black', themeClasses.lessonStatus(lesson.status))}>
          {index + 1}
        </span>
        <span className="min-w-0">
          <span className={cx('block text-[11px] font-black uppercase tracking-wide', themeClasses.mutedText)}>
            {lessonText.eyebrow} - {lessonText.duration}
          </span>
          <span className={cx('mt-1 block text-sm font-black', themeClasses.titleText)}>{lessonText.title}</span>
          <span className={cx('mt-2 block text-xs leading-5', themeClasses.mutedText)}>
            {strings.learningLab.practiceCount(lesson.practice.length)}
          </span>
        </span>
      </div>
    </button>
  );
}

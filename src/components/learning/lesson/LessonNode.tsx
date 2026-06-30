import { memo } from 'react';
import { Check } from 'lucide-react';
import type { LearningLesson } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getUnifiedLessonText } from '../learningText';
import { cx, getLearningLabTheme, type LearningLabTheme } from '../theme';

type LessonNodeProps = {
  lesson: LearningLesson;
  index: number;
  isCompleted: boolean;
  isLast: boolean;
  isSelected: boolean;
  language: Language;
  theme: LearningLabTheme;
  onSelect: (lessonId: string) => void;
};

function LessonNode({ lesson, index, isCompleted, isLast, isSelected, language, theme, onSelect }: LessonNodeProps) {
  const lessonText = getUnifiedLessonText(language, lesson);
  const themeClasses = getLearningLabTheme(theme);
  const nodeClass = isCompleted
    ? 'border-[#2FBF71] bg-[#2FBF71] text-white shadow-[0_4px_10px_rgba(47,191,113,0.24)]'
    : isSelected
      ? themeClasses.isLight
        ? 'border-[#2F6F9F] bg-[#2F6F9F] text-white shadow-[0_0_0_4px_rgba(47,111,159,0.14),0_5px_12px_rgba(47,111,159,0.18)]'
        : 'border-[#A8B8C8] bg-[#F2F6FA] text-[#121A24] shadow-[0_0_0_3px_rgba(168,184,200,0.18)]'
      : themeClasses.isLight
        ? 'border-[#8A94A3]/36 bg-[#E7EDF4] text-[#5F6B7A]'
        : 'border-[#A8B8C8]/24 bg-[#A8B8C8]/10 text-[#F2F6FA]/58';
  const titleClass = isSelected
    ? themeClasses.isLight ? 'text-[#2F6F9F]' : themeClasses.titleText
    : themeClasses.bodyText;
  const connectorClass = isCompleted
    ? 'bg-[#2FBF71]'
    : themeClasses.isLight ? 'bg-[#8A94A3]/28' : 'bg-[#A8B8C8]/18';

  return (
    <button
      type="button"
      onClick={() => onSelect(lesson.id)}
      className={cx(
        'group relative grid min-h-10 w-full grid-cols-[30px_minmax(0,1fr)] items-start gap-2.5 bg-transparent px-1 py-1 text-left transition-colors',
        themeClasses.radius.button,
        themeClasses.isLight ? 'hover:text-[#123B68]' : 'hover:bg-[#A8B8C8]/8',
        themeClasses.focusRing,
      )}
    >
      <span className="relative flex h-9 w-[30px] shrink-0 justify-center">
        {!isLast ? (
          <span className={cx('absolute left-1/2 top-7 h-[calc(100%+0.5rem)] w-0.5 -translate-x-1/2', connectorClass)} aria-hidden="true" />
        ) : null}
        <span
          className={cx(
            'relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-black',
            isSelected ? 'learning-lab-lesson-node-current' : undefined,
            nodeClass,
          )}
        >
          {isCompleted ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : index + 1}
        </span>
      </span>
      <span className="min-w-0 pb-1.5 pt-0.5">
        <span className={cx('line-clamp-2 block text-sm font-black leading-5', titleClass)}>
          {lessonText.title}
        </span>
      </span>
    </button>
  );
}

export default memo(LessonNode);

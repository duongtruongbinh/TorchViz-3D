import { memo } from 'react';
import { Check } from 'lucide-react';
import type { LearningLesson } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getUnifiedLessonText } from '../learningText';
import { cx, getLearningLabTheme, type LearningLabTheme, type LearningRailLessonTone } from '../theme';

type LessonNodeProps = {
  lesson: LearningLesson;
  index: number;
  isCompleted: boolean;
  isConnectorCompleted: boolean;
  isLast: boolean;
  isSelected: boolean;
  isTrackActive: boolean;
  language: Language;
  theme: LearningLabTheme;
  onSelect: (lessonId: string) => void;
};

function LessonNode({ lesson, index, isCompleted, isConnectorCompleted, isLast, isSelected, isTrackActive, language, theme, onSelect }: LessonNodeProps) {
  const lessonText = getUnifiedLessonText(language, lesson);
  const themeClasses = getLearningLabTheme(theme);
  const tone = getLessonTone({ isCompleted, isSelected, isTrackActive });

  return (
    <button
      type="button"
      onClick={() => onSelect(lesson.id)}
      className={cx(
        'group relative grid min-h-10 w-full grid-cols-[30px_minmax(0,1fr)] items-center gap-2.5 border px-1 py-1 text-left transition duration-200',
        themeClasses.radius.button,
        themeClasses.rail.lessonRowSurface(tone),
        themeClasses.focusRing,
      )}
    >
      <span className="relative flex h-9 w-[30px] shrink-0 items-center justify-center">
        {!isLast ? (
          <span className={cx('absolute left-1/2 top-7 h-[calc(100%+0.5rem)] w-0.5 -translate-x-1/2', themeClasses.rail.lessonConnector(tone, isConnectorCompleted))} aria-hidden="true" />
        ) : null}
        <span
          className={cx(
            'relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-black',
            isSelected ? 'learning-lab-lesson-node-current' : undefined,
            themeClasses.rail.lessonNumber(tone, isCompleted),
          )}
        >
          {isCompleted ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : index + 1}
        </span>
      </span>
      <span className="min-w-0">
        <span className={cx('line-clamp-2 block text-sm leading-5', isSelected ? 'font-semibold' : 'font-normal', themeClasses.rail.lessonTitle(tone))}>
          {lessonText.title}
        </span>
      </span>
    </button>
  );
}

function getLessonTone({
  isCompleted,
  isSelected,
  isTrackActive,
}: {
  isCompleted: boolean;
  isSelected: boolean;
  isTrackActive: boolean;
}): LearningRailLessonTone {
  if (isSelected) return 'selected';
  if (!isTrackActive) return 'quiet';
  return isCompleted ? 'past' : 'future';
}

export default memo(LessonNode);

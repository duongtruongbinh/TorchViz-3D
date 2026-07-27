import { memo } from 'react';
import { Check, CircleHelp } from 'lucide-react';
import { isQuizLearningLesson } from '../../../core/learning/selectors';
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
  const isQuiz = isQuizLearningLesson(lesson);
  const isDimmedQuiz = isQuiz && !isCompleted && !isSelected;

  return (
    <button
      type="button"
      onClick={() => onSelect(lesson.id)}
      data-lesson-id={lesson.id}
      className={cx(
        'group relative grid min-h-10 w-full grid-cols-[30px_minmax(0,1fr)] items-center gap-2.5 border px-1 py-1 text-left transition duration-200',
        themeClasses.radius.button,
        themeClasses.rail.lessonRowSurface(tone),
        themeClasses.focusRing,
      )}
    >
      <span className="relative flex h-9 w-[30px] shrink-0 items-center justify-center">
        {!isLast && !isSelected ? (
          <span className={cx('absolute left-1/2 top-7 h-[calc(100%+0.5rem)] w-0.5 -translate-x-1/2', themeClasses.rail.lessonConnector(tone, isConnectorCompleted))} aria-hidden="true" />
        ) : null}
        <span
          className={cx(
            'relative z-10 flex h-7 w-7 items-center justify-center text-xs font-black',
            !isSelected && (isCompleted || !isQuiz) ? 'rounded-full border' : undefined,
            isSelected && (isCompleted || !isQuiz) ? 'learning-lab-lesson-node-current' : undefined,
            themeClasses.rail.lessonNumber(tone, isCompleted),
            !isCompleted && !isQuiz ? getLessonNumberStyle(themeClasses.isLight, isSelected) : undefined,
            !isCompleted && isQuiz ? getQuizIconStyle(themeClasses.isLight, isSelected) : undefined,
          )}
        >
          {isCompleted ? (
            <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
          ) : isQuiz ? (
            <CircleHelp className={cx('h-6 w-6', isDimmedQuiz ? 'learning-lab-muted transition-opacity group-hover:opacity-100' : undefined)} strokeWidth={2} aria-hidden="true" />
          ) : index + 1}
        </span>
      </span>
      <span className="min-w-0">
        <span className={cx(
          'line-clamp-2 block text-sm leading-5',
          isSelected ? 'font-semibold' : 'font-normal',
          getLessonTitleStyle(themeClasses.isLight, tone === 'quiet', isDimmedQuiz, isSelected),
        )}>
          {lessonText.title}
        </span>
      </span>
    </button>
  );
}

function getLessonNumberStyle(isLight: boolean, isSelected: boolean): string {
  if (isSelected) return 'bg-transparent text-white shadow-none';
  return isLight
    ? 'border-[#2F78B7]/55 bg-[#E2F0FB] text-[#245E8D]'
    : 'border-[#77BDF2]/45 bg-[#2F78B7]/18 text-[#B8DEFA]';
}

function getQuizIconStyle(isLight: boolean, isSelected: boolean): string {
  if (isSelected) return 'text-white';
  return isLight
    ? 'rounded-full bg-[#FAFBFC] text-[#245E8D]'
    : 'rounded-full bg-[#121A24] text-[#B8DEFA]';
}

function getLessonTitleStyle(isLight: boolean, isQuiet: boolean, isDimmedQuiz: boolean, isSelected: boolean): string {
  const color = isSelected
    ? 'text-white group-hover:text-white'
    : isLight
      ? 'text-[#245E8D] group-hover:text-[#174A73]'
      : 'text-[#B8DEFA] group-hover:text-[#D8EDFC]';

  return cx(
    color,
    isDimmedQuiz
      ? 'learning-lab-muted transition-opacity group-hover:opacity-100'
      : isQuiet ? 'learning-lab-muted transition-opacity group-hover:opacity-100' : undefined,
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

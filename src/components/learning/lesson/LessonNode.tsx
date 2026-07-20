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

type LessonNodeKind = 'theory' | 'quiz' | 'code';

function LessonNode({ lesson, index, isCompleted, isConnectorCompleted, isLast, isSelected, isTrackActive, language, theme, onSelect }: LessonNodeProps) {
  const lessonText = getUnifiedLessonText(language, lesson);
  const themeClasses = getLearningLabTheme(theme);
  const tone = getLessonTone({ isCompleted, isSelected, isTrackActive });
  const lessonKind = getLessonNodeKind(lesson, lessonText.title);

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
        {!isLast ? (
          <span className={cx('absolute left-1/2 top-7 h-[calc(100%+0.5rem)] w-0.5 -translate-x-1/2', themeClasses.rail.lessonConnector(tone, isConnectorCompleted))} aria-hidden="true" />
        ) : null}
        <span
          className={cx(
            'relative z-10 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-black',
            isSelected ? 'learning-lab-lesson-node-current' : undefined,
            themeClasses.rail.lessonNumber(tone, isCompleted),
            !isCompleted ? getLessonKindNumber(lessonKind, themeClasses.isLight, isSelected) : undefined,
          )}
        >
          {isCompleted ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : index + 1}
        </span>
      </span>
      <span className="min-w-0">
        <span className={cx(
          'line-clamp-2 block text-sm leading-5',
          isSelected ? 'font-semibold' : 'font-normal',
          getLessonKindTitle(lessonKind, themeClasses.isLight, tone === 'quiet'),
        )}>
          {lessonText.title}
        </span>
      </span>
    </button>
  );
}

function getLessonNodeKind(lesson: LearningLesson, localizedTitle: string): LessonNodeKind {
  if (lesson.id.endsWith('-quiz') || lesson.id.includes('-quiz-')) return 'quiz';
  if (lesson.id.includes('-code') || /^code\s*:/i.test(localizedTitle)) return 'code';
  return 'theory';
}

function getLessonKindNumber(kind: LessonNodeKind, isLight: boolean, isSelected: boolean): string {
  if (kind === 'quiz') {
    if (isSelected) return 'border-[#8B5CF6] bg-[#8B5CF6] text-white shadow-[0_4px_10px_rgba(139,92,246,0.24)]';
    return isLight
      ? 'border-[#8B5CF6]/55 bg-[#F0E9FF] text-[#6840B8]'
      : 'border-[#B79AFF]/45 bg-[#8B5CF6]/18 text-[#D9CAFF]';
  }
  if (kind === 'code') {
    if (isSelected) return 'border-[#D98B24] bg-[#D98B24] text-white shadow-[0_4px_10px_rgba(217,139,36,0.24)]';
    return isLight
      ? 'border-[#D98B24]/55 bg-[#FFF1D8] text-[#9A5C13]'
      : 'border-[#F1B75A]/45 bg-[#D98B24]/18 text-[#FFD99A]';
  }
  if (isSelected) return 'border-[#2F78B7] bg-[#2F78B7] text-white shadow-[0_4px_10px_rgba(47,120,183,0.24)]';
  return isLight
    ? 'border-[#2F78B7]/55 bg-[#E2F0FB] text-[#245E8D]'
    : 'border-[#77BDF2]/45 bg-[#2F78B7]/18 text-[#B8DEFA]';
}

function getLessonKindTitle(kind: LessonNodeKind, isLight: boolean, isQuiet: boolean): string {
  const color = isLight
    ? kind === 'quiz'
      ? 'text-[#6840B8] group-hover:text-[#55319D]'
      : kind === 'code'
        ? 'text-[#9A5C13] group-hover:text-[#7D480B]'
        : 'text-[#245E8D] group-hover:text-[#174A73]'
    : kind === 'quiz'
      ? 'text-[#D9CAFF] group-hover:text-[#E8DFFF]'
      : kind === 'code'
        ? 'text-[#FFD99A] group-hover:text-[#FFE7BF]'
        : 'text-[#B8DEFA] group-hover:text-[#D8EDFC]';

  return cx(color, isQuiet ? 'opacity-65 group-hover:opacity-100' : undefined);
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

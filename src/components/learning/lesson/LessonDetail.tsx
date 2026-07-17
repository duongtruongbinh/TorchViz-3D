import { ArrowLeft, ArrowRight, BookOpen, Calculator, Code2, type LucideIcon } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import type { LearningLesson } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import { getUnifiedLessonText } from '../learningText';
import { cx, getLearningLabTheme, isTypingTarget } from '../theme';
import type { QuizQuestionState } from './QuizBlock';
import { getLearningMdxLesson } from '../learningMdxRegistry';

type LessonDetailProps = {
  lesson: LearningLesson;
  theme: 'dark' | 'light';
  language: Language;
  hasNextLesson?: boolean;
  onSelectNextLesson?: () => void;
};

export default function LessonDetail({
  lesson,
  theme,
  language,
  hasNextLesson = false,
  onSelectNextLesson,
}: LessonDetailProps) {
  const strings = getStrings(language);
  const lessonText = getUnifiedLessonText(language, lesson);
  const themeClasses = getLearningLabTheme(theme);
  const sectionDivider = themeClasses.isLight ? 'border-[#205089]/10' : 'border-[#A8B8C8]/12';
  const [sectionPageIndex, setSectionPageIndex] = useState(0);
  const [quizQuestionStates, setQuizQuestionStates] = useState<Record<string, QuizQuestionState>>({});
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setSectionPageIndex(0);
    setQuizQuestionStates({});
    articleRef.current?.focus({ preventScroll: true });
  }, [lesson.id]);

  const updateQuizQuestionState = useCallback((questionId: string, state: QuizQuestionState) => {
    setQuizQuestionStates((current) => ({
      ...current,
      [questionId]: state,
    }));
  }, []);

  const mdxLesson = getLearningMdxLesson({ domainId: lesson.domainId, language, lessonId: lesson.id, quizQuestionStates, themeClasses, onQuizQuestionStateChange: updateQuizQuestionState });
  const sectionPages = mdxLesson ? mdxLesson.pages.map((page, pageIndex) => (
    <SectionShell key={`${lesson.id}-mdx-${pageIndex}`} sectionDivider={sectionDivider}>{page}</SectionShell>
  )) : lesson.sections.flatMap((section) => {
    const meta = getSectionMeta(section.kind, strings, language);
    if (section.kind === 'theory') {
      return [
        <SectionShell key={`${section.kind}-${section.refId}`} sectionDivider={sectionDivider}>
          <SectionHeading icon={meta.icon} label={meta.label} themeClasses={themeClasses} />
          <FullWidthTheoryCopy items={lessonText.theory} themeClasses={themeClasses} className="mt-4" />
        </SectionShell>,
      ];
    }

    return [
      <SectionShell key={`${section.kind}-${section.refId}`} sectionDivider={sectionDivider}>
        <SectionHeading icon={meta.icon} label={meta.label} themeClasses={themeClasses} />
        <p className={cx('mt-4 border-l-2 py-1 pl-4 text-sm leading-6', themeClasses.mutedText, themeClasses.isLight ? 'border-[#205089]/20' : 'border-[#A8B8C8]/22')}>
          {meta.placeholder}
        </p>
      </SectionShell>,
    ];
  });
  const currentSectionPageIndex = Math.min(sectionPageIndex, Math.max(sectionPages.length - 1, 0));
  const canGoBack = currentSectionPageIndex > 0;
  const canGoNext = currentSectionPageIndex < sectionPages.length - 1;
  const hasNextPage = currentSectionPageIndex < sectionPages.length - 1;
  const canCompleteLesson = !hasNextPage && hasNextLesson;

  useEffect(() => {
    if (sectionPages.length <= 1) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (isTypingTarget(event.target)) return;
      if (event.key === 'ArrowLeft') {
        if (!canGoBack) return;
        event.preventDefault();
        if (articleRef.current) scrollLearningContentAreaToTop(articleRef.current);
        setSectionPageIndex((value) => Math.max(value - 1, 0));
      } else {
        if (!canGoNext) return;
        event.preventDefault();
        if (articleRef.current) scrollLearningContentAreaToTop(articleRef.current);
        setSectionPageIndex((value) => Math.min(value + 1, sectionPages.length - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoBack, canGoNext, sectionPages.length]);

  return (
    <article ref={articleRef} tabIndex={-1} className={cx('grid min-w-0 overflow-hidden border shadow-sm focus:outline-none', themeClasses.radius.panel, themeClasses.surface.card)}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' || !canCompleteLesson) return;
        if (event.target !== event.currentTarget) return;
        if (isTypingTarget(event.target)) return;
        event.preventDefault();
        onSelectNextLesson?.();
      }}
    >
      <header className={cx('border-b px-5 py-5 md:px-6', sectionDivider)}>
        <h2 className={cx('learning-lab-lesson-title text-2xl font-black leading-tight', themeClasses.lessonTitleText)}>{lessonText.title}</h2>
      </header>

      <div
        className={cx('grid min-w-0 overflow-visible', themeClasses.lessonPageViewport)}
      >
        {sectionPages[currentSectionPageIndex] ?? null}
      </div>

      {sectionPages.length > 1 || hasNextLesson ? (
        <footer className={cx('flex items-center justify-between gap-3 border-t px-5 py-4 md:px-6', sectionDivider)}>
          <button
            type="button"
            onClick={(event) => {
              scrollLearningContentAreaToTop(event.currentTarget);
              setSectionPageIndex((value) => Math.max(value - 1, 0));
            }}
            disabled={!canGoBack}
            className={getLessonPagerButtonClass(themeClasses, canGoBack)}
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
            {strings.learningLab.lessonPreviousSection}
          </button>
          <span className={cx('shrink-0 text-xs font-black tabular-nums', themeClasses.mutedText)}>
            {strings.learningLab.lessonStepCount(currentSectionPageIndex + 1, sectionPages.length)}
          </span>
          {hasNextPage ? (
            <button
              type="button"
              onClick={(event) => {
                if (!canGoNext) return;
                scrollLearningContentAreaToTop(event.currentTarget);
                setSectionPageIndex((value) => Math.min(value + 1, sectionPages.length - 1));
              }}
              disabled={!canGoNext}
              className={getLessonPagerButtonClass(themeClasses, canGoNext)}
              aria-label={strings.learningLab.lessonNextSection}
            >
              {strings.learningLab.lessonNextSection}
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!canCompleteLesson) return;
                onSelectNextLesson?.();
              }}
              disabled={!canCompleteLesson}
              className={getLessonCompleteButtonClass(themeClasses, canCompleteLesson)}
              title={strings.learningLab.lessonCompleteAndContinue}
              aria-label={strings.learningLab.lessonCompleteAndContinue}
            >
              {strings.learningLab.lessonCompleteAndContinue}
            </button>
          )}
        </footer>
      ) : null}
    </article>
  );
}

function scrollLearningContentAreaToTop(element: HTMLElement) {
  const scrollContainer = element.closest('.learning-lab-content-area') as HTMLElement | null;
  scrollContainer?.scrollTo({ top: 0, behavior: 'auto' });
}

type LearningLabStrings = ReturnType<typeof getStrings>;
type LearningThemeClasses = ReturnType<typeof getLearningLabTheme>;

function FullWidthTheoryCopy({
  items,
  themeClasses,
  className,
}: {
  items: string[];
  themeClasses: LearningThemeClasses;
  className?: string;
}) {
  return (
    <div className={cx('grid w-full gap-3', className)}>
      {items.map((item) => (
        <p key={item} className={cx('text-sm leading-7', themeClasses.bodyText)}>{item}</p>
      ))}
    </div>
  );
}

function SectionShell({
  children,
  sectionDivider,
  className,
}: {
  children: ReactNode;
  sectionDivider: string;
  className?: string;
}) {
  return (
    <section className={cx('learning-lab-lesson-page-section border-t px-5 py-5 first:border-t-0 md:px-6 md:py-6', sectionDivider, className)}>
      {children}
    </section>
  );
}

function SectionHeading({
  icon: Icon,
  label,
  themeClasses,
}: {
  icon: LucideIcon;
  label: string;
  themeClasses: LearningThemeClasses;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={cx('flex items-center gap-2 text-sm font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        {label}
      </span>
    </div>
  );
}

function getLessonPagerButtonClass(themeClasses: LearningThemeClasses, isEnabled: boolean): string {
  return cx(
    'inline-flex h-10 min-w-[6.75rem] items-center justify-center gap-2 px-3 text-sm font-black transition-colors disabled:cursor-not-allowed',
    themeClasses.radius.button,
    themeClasses.focusRing,
    isEnabled
      ? themeClasses.isLight
        ? 'bg-[#B8C8DA]/58 text-[#123B68] hover:bg-[#DCE6F1]'
        : 'bg-[#A8B8C8]/12 text-[#F2F6FA] hover:bg-[#A8B8C8]/20'
      : themeClasses.isLight
        ? 'bg-[#B8C8DA]/12 text-[#030509]/20'
        : 'bg-[#A8B8C8]/4 text-[#F2F6FA]/20',
  );
}

function getLessonCompleteButtonClass(themeClasses: LearningThemeClasses, isEnabled: boolean): string {
  return cx(
    'inline-flex h-10 min-w-[7rem] items-center justify-center px-4 text-sm font-black transition-colors disabled:cursor-not-allowed',
    themeClasses.radius.button,
    themeClasses.focusRing,
    isEnabled
      ? themeClasses.isLight
        ? 'bg-[#2FBF71] text-white shadow-[0_8px_18px_rgba(47,191,113,0.22)] hover:bg-[#269B5E]'
        : 'bg-[#2FBF71] text-[#07140D] shadow-[0_8px_20px_rgba(47,191,113,0.20)] hover:bg-[#6EE7A2]'
      : themeClasses.isLight
        ? 'bg-[#2FBF71]/12 text-[#0B3D24]/24'
        : 'bg-[#2FBF71]/10 text-[#D8FFE8]/24',
  );
}

function getSectionMeta(kind: LearningLesson['sections'][number]['kind'], strings: LearningLabStrings, language: Language) {
  const isVietnamese = language === 'vi';
  if (kind === 'theory') {
    return {
      icon: BookOpen,
      label: strings.learningLab.theory,
      placeholder: '',
    };
  }
  if (kind === 'code') {
    return {
      icon: Code2,
      label: strings.help.code,
      placeholder: isVietnamese ? 'Code block sẽ xuất hiện ở đây khi bài học có nội dung mã.' : 'Code content will appear here when this lesson includes a code step.',
    };
  }
  return {
    icon: Calculator,
    label: strings.paramFormula.calculation,
    placeholder: isVietnamese ? 'Phần tính toán sẽ xuất hiện ở đây khi bài học có công thức chi tiết.' : 'Calculation details will appear here when this lesson includes a formula walkthrough.',
  };
}

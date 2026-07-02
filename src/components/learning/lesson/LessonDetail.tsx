import { ArrowLeft, ArrowRight, Beaker, BookOpen, Calculator, Code2, type LucideIcon } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import type { LearningLesson, LearningLessonExtra } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import { getUnifiedLessonText } from '../learningText';
import PracticeSection from '../practice/PracticeSection';
import { cx, getLearningLabTheme } from '../theme';
import LessonExtras from './extras/LessonExtras';
import type { QuizQuestionState } from './extras/LessonExtraRenderer';

type LessonDetailProps = {
  lesson: LearningLesson;
  theme: 'dark' | 'light';
  language: Language;
  selectedPracticeId?: string | null;
  hasNextLesson?: boolean;
  onSelectNextLesson?: () => void;
};

export default function LessonDetail({
  lesson,
  theme,
  language,
  selectedPracticeId = null,
  hasNextLesson = false,
  onSelectNextLesson,
}: LessonDetailProps) {
  const strings = getStrings(language);
  const lessonText = getUnifiedLessonText(language, lesson);
  const themeClasses = getLearningLabTheme(theme);
  const sectionDivider = themeClasses.isLight ? 'border-[#205089]/10' : 'border-[#A8B8C8]/12';
  const [sectionPageIndex, setSectionPageIndex] = useState(0);
  const [hasReadCurrentPage, setHasReadCurrentPage] = useState(true);
  const [quizQuestionStates, setQuizQuestionStates] = useState<Record<string, QuizQuestionState>>({});
  const pageViewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSectionPageIndex(0);
    setQuizQuestionStates({});
  }, [lesson.id]);

  const updateQuizQuestionState = useCallback((questionId: string, state: QuizQuestionState) => {
    setQuizQuestionStates((current) => ({
      ...current,
      [questionId]: state,
    }));
  }, []);

  const sectionPages = lesson.sections.flatMap((section) => {
    const meta = getSectionMeta(section.kind, strings, language);
    const sectionExtras = (lesson.extras ?? []).filter((extra) => extra.sectionRefId === section.refId);
    if (section.kind === 'theory') {
      const motivationExtras = sectionExtras.filter(isMotivationExtra);
      const remainingExtras = sectionExtras.filter((extra) => extra.kind !== 'motivation');
      if (motivationExtras.length) {
        const conceptExtras = remainingExtras.filter((extra) => extra.kind === 'conceptInteraction' || extra.kind === 'conceptPanel');
        return [
          <SectionShell key={`${section.kind}-${section.refId}-motivation`} sectionDivider={sectionDivider} className={cx('learning-lab-section-accent', themeClasses.sectionAccent.section)}>
            <AccentSectionHeading label={motivationExtras[0].title[language] ?? motivationExtras[0].title.en} themeClasses={themeClasses} />
            <LessonExtras extras={motivationExtras} language={language} themeClasses={themeClasses} className="grid gap-5" />
          </SectionShell>,
          ...conceptExtras.map((extra) => (
            <SectionShell key={extra.id} sectionDivider={sectionDivider}>
              <LessonExtras extras={[extra]} language={language} themeClasses={themeClasses} className="grid gap-5" />
            </SectionShell>
          )),
          ...(lessonText.theory.length ? [
            <SectionShell key={`${section.kind}-${section.refId}-theory`} sectionDivider={sectionDivider}>
              <FullWidthTheoryCopy items={lessonText.theory} themeClasses={themeClasses} />
            </SectionShell>,
          ] : []),
        ];
      }
      if (!lessonText.theory.length && sectionExtras.length) {
        return getSectionExtraPages(sectionExtras).map(({ key, extras }) => (
          <SectionShell key={`${section.kind}-${section.refId}-${key}`} sectionDivider={sectionDivider}>
            <LessonExtras
              extras={extras}
              language={language}
              quizQuestionStates={quizQuestionStates}
              themeClasses={themeClasses}
              onQuizQuestionStateChange={updateQuizQuestionState}
            />
          </SectionShell>
        ));
      }
      return [
        <SectionShell key={`${section.kind}-${section.refId}`} sectionDivider={sectionDivider}>
          <SectionHeading icon={meta.icon} label={meta.label} themeClasses={themeClasses} />
          <FullWidthTheoryCopy items={lessonText.theory} themeClasses={themeClasses} className="mt-4" />
          <LessonExtras extras={sectionExtras} language={language} themeClasses={themeClasses} />
        </SectionShell>,
      ];
    }

    if (section.kind === 'practice') {
      const practiceItem = lesson.practice.find((item) => item.id === section.refId);
      if (!practiceItem) return [];
      return [
        <SectionShell key={`${section.kind}-${section.refId}`} sectionDivider={sectionDivider}>
          <SectionHeading icon={meta.icon} label={meta.label} themeClasses={themeClasses} />
          <PracticeSection
            theme={theme}
            language={language}
            practice={[practiceItem]}
            selectedPracticeId={selectedPracticeId}
          />
        </SectionShell>,
      ];
    }

    return [
      <SectionShell key={`${section.kind}-${section.refId}`} sectionDivider={sectionDivider}>
        <SectionHeading icon={meta.icon} label={meta.label} themeClasses={themeClasses} />
        {sectionExtras.length ? (
          <LessonExtras extras={sectionExtras} language={language} themeClasses={themeClasses} />
        ) : (
          <p className={cx('mt-4 border-l-2 py-1 pl-4 text-sm leading-6', themeClasses.mutedText, themeClasses.isLight ? 'border-[#205089]/20' : 'border-[#A8B8C8]/22')}>
            {meta.placeholder}
          </p>
        )}
      </SectionShell>,
    ];
  });
  const currentSectionPageIndex = Math.min(sectionPageIndex, Math.max(sectionPages.length - 1, 0));
  const canGoBack = currentSectionPageIndex > 0;
  const canGoNext = currentSectionPageIndex < sectionPages.length - 1 && hasReadCurrentPage;
  const hasNextPage = currentSectionPageIndex < sectionPages.length - 1;
  const canCompleteLesson = !hasNextPage && hasReadCurrentPage && hasNextLesson;
  const nextButtonTitle = hasNextPage && !hasReadCurrentPage
    ? strings.learningLab.lessonScrollToContinue
    : strings.learningLab.lessonNextSection;
  const completeButtonTitle = !hasReadCurrentPage
    ? strings.learningLab.lessonScrollToContinue
    : strings.learningLab.lessonCompleteAndContinue;
  const updateCurrentPageReadState = useCallback(() => {
    const viewport = pageViewportRef.current;
    if (!viewport) return;
    const scrollBuffer = 2;
    const isScrollable = viewport.scrollHeight > viewport.clientHeight + scrollBuffer;
    const isAtBottom = viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - scrollBuffer;
    if (!isScrollable || isAtBottom) {
      setHasReadCurrentPage(true);
    }
  }, []);

  useEffect(() => {
    const viewport = pageViewportRef.current;
    if (!viewport) return;
    viewport.scrollTop = 0;
    setHasReadCurrentPage(false);

    const frameId = window.requestAnimationFrame(updateCurrentPageReadState);
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateCurrentPageReadState);
    resizeObserver?.observe(viewport);
    if (viewport.firstElementChild) {
      resizeObserver?.observe(viewport.firstElementChild);
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
    };
  }, [currentSectionPageIndex, lesson.id, updateCurrentPageReadState]);

  return (
    <article className={cx('grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden border shadow-sm', themeClasses.radius.panel, themeClasses.surface.card)}>
      <header className={cx('border-b px-5 py-5 md:px-6', sectionDivider)}>
        <h2 className={cx('learning-lab-lesson-title text-2xl font-black leading-tight', themeClasses.lessonTitleText)}>{lessonText.title}</h2>
      </header>

      <div
        ref={pageViewportRef}
        onScroll={updateCurrentPageReadState}
        className={cx('custom-scrollbar learning-lab-scrollbar grid min-h-0 min-w-0 overflow-y-auto overflow-x-hidden', themeClasses.lessonPageViewport)}
      >
        {sectionPages[currentSectionPageIndex] ?? null}
      </div>

      {sectionPages.length > 1 || hasNextLesson ? (
        <footer className={cx('flex items-center justify-between gap-3 border-t px-5 py-4 md:px-6', sectionDivider)}>
          <button
            type="button"
            onClick={() => setSectionPageIndex((value) => Math.max(value - 1, 0))}
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
              onClick={() => {
                if (!canGoNext) return;
                setHasReadCurrentPage(false);
                setSectionPageIndex((value) => Math.min(value + 1, sectionPages.length - 1));
              }}
              disabled={!canGoNext}
              className={getLessonPagerButtonClass(themeClasses, canGoNext)}
              title={nextButtonTitle}
              aria-label={nextButtonTitle}
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
              title={completeButtonTitle}
              aria-label={completeButtonTitle}
            >
              {strings.learningLab.lessonCompleteAndContinue}
            </button>
          )}
        </footer>
      ) : null}
    </article>
  );
}

function isMotivationExtra(extra: LearningLessonExtra): extra is Extract<LearningLessonExtra, { kind: 'motivation' }> {
  return extra.kind === 'motivation';
}

function getSectionExtraPages(extras: LearningLessonExtra[]): Array<{
  key: string;
  extras: LearningLessonExtra[];
}> {
  return extras.flatMap((extra) => {
    if (extra.kind !== 'quiz' || extra.questions.length <= 1) {
      return [{ key: extra.id, extras: [extra] }];
    }

    return extra.questions.map((question) => ({
      key: `${extra.id}-${question.id}`,
      extras: [{
        ...extra,
        id: `${extra.id}-${question.id}`,
        questions: [question],
      }],
    }));
  });
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
    <section className={cx('learning-lab-lesson-page-section min-h-full border-t px-5 py-5 first:border-t-0 md:px-6 md:py-6', sectionDivider, className)}>
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

function AccentSectionHeading({
  label,
  themeClasses,
}: {
  label: string;
  themeClasses: LearningThemeClasses;
}) {
  return (
    <div className={cx('mb-5 text-lg font-black uppercase leading-7 tracking-wide md:text-xl', themeClasses.sectionAccent.heading)}>
      {label}
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
  if (kind === 'practice') {
    return {
      icon: Beaker,
      label: strings.learningLab.practice,
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

import { Beaker, BookOpen, Calculator, Code2, Lightbulb, type LucideIcon } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import type { LearningLesson, LearningLessonExtra } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import { getUnifiedLessonText } from '../learningText';
import PracticeSection from '../practice/PracticeSection';
import { cx, getLearningLabTheme } from '../theme';
import LessonExtras from './LessonExtras';

type LessonDetailProps = {
  lesson: LearningLesson;
  theme: 'dark' | 'light';
  language: Language;
  selectedPracticeId?: string | null;
};

export default function LessonDetail({ lesson, theme, language, selectedPracticeId = null }: LessonDetailProps) {
  const strings = getStrings(language);
  const lessonText = getUnifiedLessonText(language, lesson);
  const themeClasses = getLearningLabTheme(theme);
  const sectionDivider = themeClasses.isLight ? 'border-[#205089]/10' : 'border-[#A8B8C8]/12';

  return (
    <article className={cx('min-h-0 overflow-hidden border shadow-sm', themeClasses.radius.panel, themeClasses.surface.card)}>
      <header className={cx('border-b px-5 py-5 md:px-6', sectionDivider)}>
        <h2 className={cx('text-2xl font-black leading-tight', themeClasses.titleText)}>{lessonText.title}</h2>
      </header>

      <div className="grid min-w-0">
        {lesson.sections.map((section) => {
          const meta = getSectionMeta(section.kind, strings, language);
          const sectionExtras = (lesson.extras ?? []).filter((extra) => extra.sectionRefId === section.refId);
          if (section.kind === 'theory') {
            const motivationExtras = sectionExtras.filter(isMotivationExtra);
            const remainingExtras = sectionExtras.filter((extra) => extra.kind !== 'motivation');
            if (motivationExtras.length) {
              const conceptExtras = remainingExtras.filter((extra) => extra.kind === 'conceptInteraction' || extra.kind === 'conceptPanel');
              const followUpExtras = remainingExtras.filter((extra) => extra.kind !== 'conceptInteraction' && extra.kind !== 'conceptPanel');
              return (
                <Fragment key={`${section.kind}-${section.refId}`}>
                  <SectionShell sectionDivider={sectionDivider} className="learning-lab-motivation-section">
                    <MotivationSectionHeading label={motivationExtras[0].title[language] ?? motivationExtras[0].title.en} themeClasses={themeClasses} />
                    <LessonExtras extras={motivationExtras} language={language} themeClasses={themeClasses} className="grid gap-5" />
                  </SectionShell>

                  {conceptExtras.map((extra) => (
                    <SectionShell key={extra.id} sectionDivider={sectionDivider}>
                      <LessonExtras extras={[extra]} language={language} themeClasses={themeClasses} className="grid gap-5" />
                    </SectionShell>
                  ))}

                  {lessonText.theory.length ? (
                    <SectionShell sectionDivider={sectionDivider}>
                      <div className="grid max-w-[74ch] gap-3">
                        {lessonText.theory.map((item) => (
                          <p key={item} className={cx('text-sm leading-7', themeClasses.bodyText)}>{item}</p>
                        ))}
                      </div>
                    </SectionShell>
                  ) : null}

                  {followUpExtras.map((extra) => (
                    <SectionShell key={extra.id} sectionDivider={sectionDivider}>
                      <LessonExtras extras={[extra]} language={language} themeClasses={themeClasses} className="grid gap-5" />
                    </SectionShell>
                  ))}
                </Fragment>
              );
            }
            return (
              <SectionShell key={`${section.kind}-${section.refId}`} sectionDivider={sectionDivider}>
                <SectionHeading icon={meta.icon} label={meta.label} themeClasses={themeClasses} />
                <div className="mt-4 grid max-w-[74ch] gap-3">
                  {lessonText.theory.map((item) => (
                    <p key={item} className={cx('text-sm leading-7', themeClasses.bodyText)}>{item}</p>
                  ))}
                </div>
                <LessonExtras extras={sectionExtras} language={language} themeClasses={themeClasses} />
              </SectionShell>
            );
          }

          if (section.kind === 'practice') {
            const practiceItem = lesson.practice.find((item) => item.id === section.refId);
            if (!practiceItem) return null;
            return (
              <SectionShell key={`${section.kind}-${section.refId}`} sectionDivider={sectionDivider}>
                <SectionHeading icon={meta.icon} label={meta.label} themeClasses={themeClasses} />
                <PracticeSection
                  theme={theme}
                  language={language}
                  practice={[practiceItem]}
                  selectedPracticeId={selectedPracticeId}
                />
              </SectionShell>
            );
          }

          return (
            <SectionShell key={`${section.kind}-${section.refId}`} sectionDivider={sectionDivider}>
              <SectionHeading icon={meta.icon} label={meta.label} themeClasses={themeClasses} />
              {sectionExtras.length ? (
                <LessonExtras extras={sectionExtras} language={language} themeClasses={themeClasses} />
              ) : (
                <p className={cx('mt-4 max-w-[74ch] border-l-2 py-1 pl-4 text-sm leading-6', themeClasses.mutedText, themeClasses.isLight ? 'border-[#205089]/20' : 'border-[#A8B8C8]/22')}>
                  {meta.placeholder}
                </p>
              )}
            </SectionShell>
          );
        })}
      </div>
    </article>
  );
}

function isMotivationExtra(extra: LearningLessonExtra): extra is Extract<LearningLessonExtra, { kind: 'motivation' }> {
  return extra.kind === 'motivation';
}

type LearningLabStrings = ReturnType<typeof getStrings>;
type LearningThemeClasses = ReturnType<typeof getLearningLabTheme>;

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
    <section className={cx('border-t px-5 py-5 first:border-t-0 md:px-6 md:py-6', sectionDivider, className)}>
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

function MotivationSectionHeading({
  label,
  themeClasses,
}: {
  label: string;
  themeClasses: LearningThemeClasses;
}) {
  return (
    <div className={cx('mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-wide', themeClasses.isLight ? 'text-[#0F5F9C]' : 'text-[#9ED0FF]')}>
      <span className={cx('flex h-7 w-7 items-center justify-center', themeClasses.radius.icon, themeClasses.isLight ? 'bg-[#205089]/12 text-[#0F5F9C]' : 'bg-[#9ED0FF]/12 text-[#9ED0FF]')}>
        <Lightbulb className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
      </span>
      {label}
    </div>
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

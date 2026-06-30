import { Beaker, BookOpen, Calculator, Code2, type LucideIcon } from 'lucide-react';
import type { LearningLesson } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import { getUnifiedLessonText } from '../learningText';
import PracticeSection from '../practice/PracticeSection';
import { cx, getLearningLabTheme } from '../theme';

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

  return (
    <article className={cx('min-h-0 border shadow-sm', themeClasses.radius.panel, themeClasses.surface.card)}>
      <div className="p-5 pb-0">
        <h2 className={cx('text-2xl font-black leading-tight', themeClasses.titleText)}>{lessonText.title}</h2>
      </div>

      <div className="grid gap-5 p-5">
        <div className="grid min-w-0 gap-4">
          {lesson.sections.map((section, sectionIndex) => {
            const meta = getSectionMeta(section.kind, strings, language);
            if (section.kind === 'theory') {
              return (
                <section
                  key={`${section.kind}-${section.refId}`}
                  className={cx('border p-4', themeClasses.radius.card, themeClasses.isLight ? 'border-[#205089]/14 bg-white/54' : 'border-[#A8B8C8]/16 bg-[#121A24]/44')}
                >
                  <SectionHeading index={sectionIndex} icon={meta.icon} label={meta.label} themeClasses={themeClasses} />
                  <div className="mt-4 grid gap-3">
                    {lessonText.theory.map((item) => (
                      <p key={item} className={cx('text-sm leading-7', themeClasses.bodyText)}>{item}</p>
                    ))}
                  </div>
                </section>
              );
            }

            if (section.kind === 'practice') {
              const practiceItem = lesson.practice.find((item) => item.id === section.refId);
              if (!practiceItem) return null;
              return (
                <section key={`${section.kind}-${section.refId}`}>
                  <SectionHeading index={sectionIndex} icon={meta.icon} label={meta.label} themeClasses={themeClasses} />
                  <PracticeSection
                    theme={theme}
                    language={language}
                    practice={[practiceItem]}
                    selectedPracticeId={selectedPracticeId}
                  />
                </section>
              );
            }

            return (
              <section
                key={`${section.kind}-${section.refId}`}
                className={cx('border p-4', themeClasses.radius.card, themeClasses.isLight ? 'border-[#205089]/14 bg-white/54' : 'border-[#A8B8C8]/16 bg-[#121A24]/44')}
              >
                <SectionHeading index={sectionIndex} icon={meta.icon} label={meta.label} themeClasses={themeClasses} />
                <p className={cx('mt-3 text-sm leading-6', themeClasses.mutedText)}>
                  {meta.placeholder}
                </p>
              </section>
            );
          })}
        </div>
      </div>
    </article>
  );
}

type LearningLabStrings = ReturnType<typeof getStrings>;
type LearningThemeClasses = ReturnType<typeof getLearningLabTheme>;

function SectionHeading({
  index,
  icon: Icon,
  label,
  themeClasses,
}: {
  index: number;
  icon: LucideIcon;
  label: string;
  themeClasses: LearningThemeClasses;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={cx('flex h-9 w-9 shrink-0 items-center justify-center text-sm font-black', themeClasses.radius.icon, themeClasses.iconTile)}>
        {index + 1}
      </span>
      <span className={cx('flex items-center gap-2 text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        {label}
      </span>
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

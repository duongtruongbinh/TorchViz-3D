import type { LearningLesson } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import { getDomainTextById, getUnifiedLessonText } from '../learningText';
import PracticeSection from '../practice/PracticeSection';
import { cx, getLearningLabTheme } from '../theme';

type LessonDetailProps = {
  lesson: LearningLesson;
  theme: 'dark' | 'light';
  language: Language;
};

export default function LessonDetail({ lesson, theme, language }: LessonDetailProps) {
  const strings = getStrings(language);
  const lessonText = getUnifiedLessonText(language, lesson);
  const domainText = getDomainTextById(language, lesson.domainId);
  const themeClasses = getLearningLabTheme(theme);

  return (
    <article className={cx('min-h-0 border p-5 shadow-sm', themeClasses.radius.panel, themeClasses.surface.card)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className={cx('text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>{domainText.title}</div>
          <h2 className={cx('mt-2 text-2xl font-black leading-tight', themeClasses.titleText)}>{lessonText.title}</h2>
          <p className={cx('mt-2 text-sm', themeClasses.mutedText)}>{lessonText.duration}</p>
        </div>
        <span className={cx('border px-3 py-1.5 text-xs font-black uppercase', themeClasses.radius.pill, themeClasses.lessonStatus(lesson.status))}>
          {strings.learningLab.lessonStatus[lesson.status]}
        </span>
      </div>

      <div className="mt-6">
        <h3 className={cx('text-xs font-black uppercase tracking-wide', themeClasses.mutedText)}>{strings.learningLab.theory}</h3>
        <div className="mt-3 space-y-4">
          {lessonText.theory.map((item) => (
            <p key={item} className={cx('text-sm leading-7', themeClasses.bodyText)}>{item}</p>
          ))}
        </div>
      </div>

      <PracticeSection theme={theme} language={language} practice={lesson.practice} />
    </article>
  );
}

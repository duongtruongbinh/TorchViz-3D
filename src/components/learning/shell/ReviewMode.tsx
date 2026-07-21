import { Dumbbell, ArrowRight } from 'lucide-react';
import type { LearningCatalog, LearningLesson } from '../../../core/learning/types';
import { getReviewableLearningLessons } from '../../../core/learning/selectors';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import { getDomainText, getTrackText, getUnifiedLessonText } from '../learningText';
import { cx, getLearningLabTheme } from '../theme';

type ReviewModeProps = {
  catalog: LearningCatalog;
  language: Language;
  theme: 'dark' | 'light';
  onSelectLesson: (lesson: LearningLesson) => void;
};

export default function ReviewMode({ catalog, language, theme, onSelectLesson }: ReviewModeProps) {
  const strings = getStrings(language).learningLab;
  const themeClasses = getLearningLabTheme(theme);
  const lessons = getReviewableLearningLessons(catalog);

  return (
    <section className="learning-lab-catalog mx-auto grid w-full max-w-6xl gap-5 px-1 py-2 sm:px-2 sm:py-3">
      <header className={cx('border p-5 sm:p-6', themeClasses.radius.panel, themeClasses.surface.card)}>
        <div className={cx('flex items-center gap-2 text-sm font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
          <Dumbbell className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          {strings.review}
        </div>
        <h1 className={cx('mt-3 text-2xl font-black leading-tight sm:text-3xl', themeClasses.titleText)}>{strings.reviewTitle}</h1>
        <p className={cx('mt-2 w-full text-sm leading-6', themeClasses.bodyText)}>{strings.reviewDescription}</p>
      </header>

      {lessons.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {lessons.map((lesson) => {
            const domain = catalog.domains.find((item) => item.id === lesson.domainId)!;
            const track = catalog.tracks.find((item) => item.domainId === lesson.domainId && item.id === lesson.trackId)!;
            const lessonText = getUnifiedLessonText(language, lesson);
            return (
              <button
                key={`${lesson.domainId}/${lesson.id}`}
                type="button"
                onClick={() => onSelectLesson(lesson)}
                className={cx('group grid min-h-40 gap-4 p-5', themeClasses.radius.card, themeClasses.button.card)}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className={cx('grid h-10 w-10 shrink-0 place-items-center', themeClasses.radius.icon, themeClasses.brandTile)}>
                    <Dumbbell className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <ArrowRight className={cx('h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5', themeClasses.mutedText)} strokeWidth={2} aria-hidden="true" />
                </div>
                <div className="text-left">
                  <h2 className={cx('text-lg font-black leading-7', themeClasses.titleText)}>{lessonText.title}</h2>
                  <p className={cx('mt-1 text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
                    {getDomainText(language, domain).title} · {getTrackText(language, track).title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className={cx('border p-6 text-sm font-black', themeClasses.radius.card, themeClasses.surface.card, themeClasses.mutedText)}>
          {strings.reviewEmpty}
        </div>
      )}
    </section>
  );
}

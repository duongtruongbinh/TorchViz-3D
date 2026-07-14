import type { LearningCatalog, LearningDomainId } from '../../../core/learning/types';
import { getLearningPracticeForDomain } from '../../../core/learning/selectors';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import PracticeSection from '../practice/PracticeSection';
import { cx, getLearningLabTheme } from '../theme';

type ReviewModeProps = {
  catalog: LearningCatalog;
  domainId: LearningDomainId | null;
  language: Language;
  theme: 'dark' | 'light';
};

export default function ReviewMode({ catalog, domainId, language, theme }: ReviewModeProps) {
  const strings = getStrings(language);
  const themeClasses = getLearningLabTheme(theme);
  const practice = domainId
    ? getLearningPracticeForDomain(catalog, domainId)
    : catalog.lessons.flatMap((lesson) => lesson.practice);

  return (
    <section className="learning-lab-catalog mx-auto grid w-full max-w-6xl gap-5 px-1 py-2 sm:px-2 sm:py-3">
      <div className={cx('border p-5 sm:p-6', themeClasses.radius.panel, themeClasses.surface.card)}>
        <h1 className={cx('text-2xl font-black leading-tight sm:text-3xl', themeClasses.titleText)}>{strings.learningLab.reviewTitle}</h1>
        <p className={cx('mt-2 max-w-2xl text-sm leading-6', themeClasses.bodyText)}>{strings.learningLab.reviewDescription}</p>
      </div>
      <PracticeSection practice={practice} theme={theme} language={language} />
    </section>
  );
}

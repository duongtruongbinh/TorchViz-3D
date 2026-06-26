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
    <section className={cx('rounded-xl border p-5 shadow-sm', themeClasses.card)}>
      <h2 className="text-2xl font-black">{strings.learningLab.reviewTitle}</h2>
      <p className={cx('mt-2 max-w-2xl text-sm leading-6', themeClasses.bodyText)}>{strings.learningLab.reviewDescription}</p>
      <PracticeSection practice={practice} theme={theme} language={language} />
    </section>
  );
}

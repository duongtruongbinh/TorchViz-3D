import type { LearningCatalog, LearningDomainId } from '../../../core/learning/types';
import { getLearningPracticeForDomain } from '../../../core/learning/selectors';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import PracticeSection from '../practice/PracticeSection';

type ReviewModeProps = {
  catalog: LearningCatalog;
  domainId: LearningDomainId | null;
  language: Language;
  theme: 'dark' | 'light';
};

export default function ReviewMode({ catalog, domainId, language, theme }: ReviewModeProps) {
  const strings = getStrings(language);
  const practice = domainId
    ? getLearningPracticeForDomain(catalog, domainId)
    : catalog.lessons.flatMap((lesson) => lesson.practice);

  return (
    <section className="rounded-xl border border-sky-100 bg-white p-5 text-slate-950 shadow-sm shadow-sky-100/70">
      <h2 className="text-2xl font-black">{strings.learningLab.reviewTitle}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{strings.learningLab.reviewDescription}</p>
      <PracticeSection practice={practice} theme={theme} language={language} />
    </section>
  );
}

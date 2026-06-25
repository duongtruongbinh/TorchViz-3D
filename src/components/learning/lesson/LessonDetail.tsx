import type { LearningLesson } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import { getDomainText, getUnifiedLessonText } from '../learningText';
import PracticeSection from '../practice/PracticeSection';

type LessonDetailProps = {
  lesson: LearningLesson;
  theme: 'dark' | 'light';
  language: Language;
};

export default function LessonDetail({ lesson, theme, language }: LessonDetailProps) {
  const strings = getStrings(language);
  const lessonText = getUnifiedLessonText(language, lesson);
  const domainText = getDomainText(language, lesson.domainId);

  return (
    <article className="min-h-0 rounded-xl border border-sky-100 bg-white p-5 text-slate-950 shadow-sm shadow-sky-100/70">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-wide text-sky-700">{domainText.title}</div>
          <h2 className="mt-2 text-2xl font-black leading-tight text-slate-950">{lessonText.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{lessonText.duration}</p>
        </div>
        <span className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-xs font-black uppercase text-sky-700">
          {strings.learningLab.lessonStatus[lesson.status]}
        </span>
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-black uppercase tracking-wide text-slate-400">{strings.learningLab.theory}</h3>
        <div className="mt-3 space-y-4">
          {lessonText.theory.map((item) => (
            <p key={item} className="text-sm leading-7 text-slate-600">{item}</p>
          ))}
        </div>
      </div>

      <PracticeSection theme={theme} language={language} practice={lesson.practice} />
    </article>
  );
}

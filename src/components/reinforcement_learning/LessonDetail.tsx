import type { RLLearningLesson } from '../../core/rlTypes';
import { getReinforcementLessonText, getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import PracticeSection from './PracticeSection';

type LessonDetailProps = {
  lesson: RLLearningLesson;
};

export default function LessonDetail({ lesson }: LessonDetailProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;
  const lessonText = getReinforcementLessonText(t, lesson);

  return (
    <article className="min-h-0 rounded-lg border border-zinc-800 bg-[#080b10]/95 p-5 shadow-2xl shadow-black/25">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase text-emerald-200">{lessonText.eyebrow}</div>
          <h2 className="mt-2 text-2xl font-black leading-tight text-white">{lessonText.title}</h2>
          <p className="mt-2 text-sm text-zinc-500">{lessonText.duration}</p>
        </div>
        <span className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-bold uppercase text-zinc-300">
          {t.lessonStatus[lesson.status]}
        </span>
      </div>
      <div className="mt-6">
        <h3 className="text-xs font-black uppercase text-zinc-400">{t.theory}</h3>
        <div className="mt-3 space-y-4">
          {lessonText.theory.map((item) => (
            <p key={item} className="text-sm leading-7 text-zinc-200">{item}</p>
          ))}
        </div>
      </div>
      <PracticeSection practice={lesson.practice} />
    </article>
  );
}

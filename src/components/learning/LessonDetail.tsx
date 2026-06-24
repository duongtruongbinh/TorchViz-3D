import type { LearningLesson } from '../../core/types';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import PracticeSection from './shared/PracticeSection';

type LocalizedLessonText = {
  title: string;
  eyebrow: string;
  duration: string;
  theory: string[];
};

type LessonDetailProps = {
  theme: 'dark' | 'light';
  lesson: LearningLesson;
};

export default function LessonDetail({ theme, lesson }: LessonDetailProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).learningLab;
  const lessonText = getLessonText(t, lesson);
  return (
    <article className="min-h-0 rounded-lg border border-zinc-800 bg-[#080b10]/95 p-5 shadow-2xl shadow-black/25">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase text-teal-200">{lessonText.eyebrow}</div>
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
      <PracticeSection theme={theme} practice={lesson.practice} />
    </article>
  );
}

function getLessonText(t: ReturnType<typeof getStrings>['learningLab'], lesson: LearningLesson) {
  const lessons = t.lessons as Record<string, LocalizedLessonText>;
  const key = lesson.id.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
  return lessons[key] ?? { title: lesson.id, eyebrow: '', duration: '', theory: [] };
}

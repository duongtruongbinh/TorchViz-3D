import { useMemo, useState } from 'react';
import type { LearningLesson, LearningPracticeKind, LearningPracticeRef } from '../../core/types';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import PracticeSection from './shared/PracticeSection';
import ReviewPicker from './ReviewPicker';

type LocalizedLessonReviewText = {
  title: string;
};

type LocalizedPracticeText = {
  title: string;
};

type ReviewModeProps = {
  theme: 'dark' | 'light';
  lessons: LearningLesson[];
  onSelectLesson: (lessonId: string) => void;
};

export default function ReviewMode({ theme, lessons, onSelectLesson }: ReviewModeProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).learningLab;
  const [activeKind, setActiveKind] = useState<LearningPracticeKind | 'all'>('all');
  const practice = useMemo(() => (
    lessons.flatMap((lesson) => (
      lesson.practice.map((item) => ({ lesson, item }))
    ))
  ), [lessons]);
  const filteredPractice = activeKind === 'all'
    ? practice
    : practice.filter(({ item }) => item.kind === activeKind);

  return (
    <div className="min-h-0 rounded-lg border border-zinc-800 bg-[#080b10]/95 p-5 shadow-2xl shadow-black/25">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">{t.reviewTitle}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            {t.reviewDescription}
          </p>
        </div>
        <ReviewPicker activeKind={activeKind} onKindChange={setActiveKind} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {filteredPractice.map(({ lesson, item }) => {
          const lessonText = getLessonText(t, lesson);
          const practiceText = getPracticeText(t, item);

          return (
            <article key={`${lesson.id}-${item.id}`} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold uppercase text-zinc-500">{lessonText.title}</div>
                  <h3 className="mt-1 text-base font-bold text-zinc-100">{practiceText.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onSelectLesson(lesson.id)}
                  className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs font-bold text-zinc-300 transition-colors hover:border-teal-300/60 hover:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-300/40"
                >
                  {t.openLesson}
                </button>
              </div>
              <PracticeSection theme={theme} practice={[item]} />
            </article>
          );
        })}
      </div>
    </div>
  );
}

function getLessonText(t: ReturnType<typeof getStrings>['learningLab'], lesson: LearningLesson) {
  const lessons = t.lessons as Record<string, LocalizedLessonReviewText>;
  const key = lesson.id.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
  return lessons[key] ?? { title: lesson.id };
}

function getPracticeText(t: ReturnType<typeof getStrings>['learningLab'], practice: LearningPracticeRef) {
  const practiceItems = t.practiceItems as Record<string, LocalizedPracticeText>;
  const key = practice.id.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
  return practiceItems[key] ?? { title: practice.id };
}

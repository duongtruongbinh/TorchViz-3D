import type { RLLearningLesson } from '../../core/rlTypes';
import { getReinforcementLessonText, getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';

type PathNodeProps = {
  lesson: RLLearningLesson;
  index: number;
  isSelected: boolean;
  onSelect: (lessonId: string) => void;
};

const statusClasses: Record<RLLearningLesson['status'], string> = {
  available: 'border-emerald-300/35 bg-emerald-400/10 text-emerald-100',
  next: 'border-blue-300/35 bg-blue-400/10 text-blue-100',
  locked: 'border-zinc-700 bg-zinc-900/70 text-zinc-400',
};

export default function PathNode({ lesson, index, isSelected, onSelect }: PathNodeProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).reinforcementLearning;
  const lessonText = getReinforcementLessonText(t, lesson);

  return (
    <button
      type="button"
      onClick={() => onSelect(lesson.id)}
      className={`w-full rounded-lg border p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300/45 ${
        isSelected
          ? 'border-emerald-200 bg-emerald-400/15 shadow-[0_0_24px_rgba(52,211,153,0.15)]'
          : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-600 hover:bg-zinc-900/90'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-sm font-black ${statusClasses[lesson.status]}`}>
          {index + 1}
        </span>
        <span className="min-w-0">
          <span className="block text-[11px] font-bold uppercase text-zinc-500">{lessonText.eyebrow} - {lessonText.duration}</span>
          <span className="mt-1 block text-sm font-bold text-zinc-100">{lessonText.title}</span>
          <span className="mt-2 block text-xs leading-5 text-zinc-400">{t.practiceCount(lesson.practice.length)}</span>
        </span>
      </div>
    </button>
  );
}

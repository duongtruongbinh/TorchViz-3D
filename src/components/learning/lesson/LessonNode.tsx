import type { LearningLesson } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { getStrings } from '../../../lib/localization';
import { getUnifiedLessonText } from '../learningText';

type LessonNodeProps = {
  lesson: LearningLesson;
  index: number;
  isSelected: boolean;
  language: Language;
  onSelect: (lessonId: string) => void;
};

const statusClasses: Record<LearningLesson['status'], string> = {
  available: 'border-sky-200 bg-sky-50 text-sky-700',
  next: 'border-violet-200 bg-violet-50 text-violet-700',
  locked: 'border-slate-200 bg-slate-50 text-slate-500',
};

export default function LessonNode({ lesson, index, isSelected, language, onSelect }: LessonNodeProps) {
  const strings = getStrings(language);
  const lessonText = getUnifiedLessonText(language, lesson);

  return (
    <button
      type="button"
      onClick={() => onSelect(lesson.id)}
      className={`w-full rounded-xl border p-4 text-left shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-300 ${
        isSelected
          ? 'border-sky-300 bg-sky-50 shadow-sky-100/80'
          : 'border-sky-100 bg-white hover:border-sky-200 hover:bg-sky-50/60'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm font-black ${statusClasses[lesson.status]}`}>
          {index + 1}
        </span>
        <span className="min-w-0">
          <span className="block text-[11px] font-black uppercase tracking-wide text-slate-400">
            {lessonText.eyebrow} - {lessonText.duration}
          </span>
          <span className="mt-1 block text-sm font-black text-slate-950">{lessonText.title}</span>
          <span className="mt-2 block text-xs leading-5 text-slate-500">
            {strings.learningLab.practiceCount(lesson.practice.length)}
          </span>
        </span>
      </div>
    </button>
  );
}

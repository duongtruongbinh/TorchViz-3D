import type { LearningLesson } from '../../core/types';
import { getStrings } from '../../lib/localization';
import { useStore } from '../../store/useStore';
import PathNode from './PathNode';

type PathMapProps = {
  lessons: LearningLesson[];
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
};

export default function PathMap({ lessons, selectedLessonId, onSelectLesson }: PathMapProps) {
  const language = useStore((s) => s.language);
  const t = getStrings(language).learningLab;
  return (
    <aside className="min-h-0 rounded-lg border border-zinc-800 bg-zinc-950/55 p-3">
      <div className="mb-3 px-1">
        <h2 className="text-xs font-black uppercase text-zinc-400">{t.path}</h2>
        <p className="mt-1 text-xs leading-5 text-zinc-500">{t.pathDescription}</p>
      </div>
      <div className="grid max-h-full gap-3 overflow-auto pr-1">
        {lessons.map((lesson, index) => (
          <PathNode
            key={lesson.id}
            lesson={lesson}
            index={index}
            isSelected={lesson.id === selectedLessonId}
            onSelect={onSelectLesson}
          />
        ))}
      </div>
    </aside>
  );
}

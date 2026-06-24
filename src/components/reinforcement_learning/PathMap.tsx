import type { RLLearningLesson } from '../../core/rlTypes';
import PathNode from './PathNode';

type PathMapProps = {
  lessons: RLLearningLesson[];
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
};

export default function PathMap({ lessons, selectedLessonId, onSelectLesson }: PathMapProps) {
  return (
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
  );
}

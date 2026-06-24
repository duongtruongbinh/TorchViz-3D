import { useState } from 'react';
import { learningPath } from '../../core/learningContent';
import LearningLabHeader from './LearningLabHeader';
import PathMode from './PathMode';
import ReviewMode from './ReviewMode';

type LearningLabMode = 'path' | 'review';

type LearningLabViewProps = {
  onBackToLanding: () => void;
};

export default function LearningLabView({ onBackToLanding }: LearningLabViewProps) {
  const [mode, setMode] = useState<LearningLabMode>('path');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedLessonId, setSelectedLessonId] = useState(learningPath.lessons[0]?.id ?? '');

  return (
    <main className={`learning-lab flex min-h-screen flex-col ${theme === 'light' ? 'learning-lab-light bg-slate-50 text-zinc-950' : 'bg-[#06070a] text-zinc-100'}`}>
      <LearningLabHeader
        mode={mode}
        theme={theme}
        onModeChange={setMode}
        onToggleTheme={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
        onBackToLanding={onBackToLanding}
      />
      <section className="min-h-0 flex-1 overflow-auto px-5 py-5">
        <div className="mx-auto max-w-[1480px]">
          {mode === 'path' ? (
            <PathMode
              theme={theme}
              lessons={learningPath.lessons}
              selectedLessonId={selectedLessonId}
              onSelectLesson={setSelectedLessonId}
            />
          ) : (
            <ReviewMode
              theme={theme}
              lessons={learningPath.lessons}
              onSelectLesson={(lessonId) => {
                setSelectedLessonId(lessonId);
                setMode('path');
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
}

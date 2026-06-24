import { useState } from 'react';
import { rlLearningPath } from '../../core/rlLearningContent';
import Header from './Header';
import PathMode from './PathMode';
import ReviewMode from './ReviewMode';

type ViewMode = 'path' | 'review';

type ViewProps = {
  onBackToLanding: () => void;
};

export default function View({ onBackToLanding }: ViewProps) {
  const [mode, setMode] = useState<ViewMode>('path');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedLessonId, setSelectedLessonId] = useState(rlLearningPath.lessons[0]?.id ?? '');

  return (
    <main className={`reinforcement-learning flex min-h-screen flex-col ${theme === 'light' ? 'reinforcement-learning-light bg-slate-50 text-zinc-950' : 'bg-[#06070a] text-zinc-100'}`}>
      <Header
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
              lessons={rlLearningPath.lessons}
              selectedLessonId={selectedLessonId}
              onSelectLesson={setSelectedLessonId}
            />
          ) : (
            <ReviewMode
              lessons={rlLearningPath.lessons}
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

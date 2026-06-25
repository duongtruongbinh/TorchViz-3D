import { useState } from 'react';

import { rlLearningPath } from '../../core/rlLearningContent';
import { useStore } from '../../store/useStore';
import GuideTour from './GuideTour';
import Header from './Header';
import PathMode from './PathMode';

const rlLogoUrl = new URL('../../../docs/assets/Future-HMI ip.gif', import.meta.url).href;

type ViewMode = 'path' | 'visualization-3d';

type ViewProps = {
  onBackToLanding: () => void;
};

export default function View({ onBackToLanding }: ViewProps) {
  const [mode, setMode] = useState<ViewMode>('path');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGuideTourOpen, setIsGuideTourOpen] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(
    rlLearningPath.lessons[0]?.id ?? '',
  );

  const language = useStore((s) => s.language);
  const isLight = theme === 'light';
  const sidebarSectionTitle = language === 'vi' ? 'Học tập' : 'Learning';

  return (
    <main
      className={`reinforcement-learning grid min-h-screen w-full overflow-hidden transition-[grid-template-columns] duration-300 ${
        isSidebarOpen ? 'grid-cols-[300px_minmax(0,1fr)]' : 'grid-cols-[72px_minmax(0,1fr)]'
      } ${
        isLight
          ? 'reinforcement-learning-light bg-[#f6fbff] text-slate-950'
          : 'bg-[#050b16] text-slate-100'
      }`}
    >
      <aside
        data-tour="rl-sidebar"
        className={`min-h-screen overflow-hidden rounded-r-lg border-r shadow-sm transition-colors ${
          isLight
            ? 'border-sky-100 bg-gradient-to-b from-white via-[#f6fbff] to-[#eef6ff] text-slate-950 shadow-sky-100/70'
            : 'border-slate-800 bg-gradient-to-b from-[#101827] via-[#0b1220] to-[#050b16] text-slate-100 shadow-black/30'
        }`}
      >
        <button
          type="button"
          onClick={onBackToLanding}
          className={`flex h-16 w-full items-center rounded-tr-lg transition-colors ${
            isSidebarOpen ? 'gap-3 px-5 text-left' : 'justify-center px-0'
          } ${isLight ? 'hover:bg-sky-50' : 'hover:bg-slate-800/80'}`}
          title="Back to landing"
          aria-label="Back to landing"
        >
          <span
            data-tour="rl-logo"
            className={`flex h-10 w-10 shrink-0 overflow-hidden rounded-lg border ${
              isLight ? 'border-sky-100 bg-[#eef6ff]' : 'border-slate-700 bg-slate-950'
            }`}
            aria-hidden="true"
          >
            <img src={rlLogoUrl} alt="" className="h-full w-full object-cover" />
          </span>

          {isSidebarOpen ? (
            <span className="min-w-0">
              <span className="block truncate text-xl font-black leading-6">
                TorchViz<span className={isLight ? 'text-sky-600' : 'text-sky-300'}>3D</span>
              </span>
              <span
                className={`block truncate text-[11px] font-black uppercase tracking-wide ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                Reinforcement Learning
              </span>
            </span>
          ) : null}
        </button>

        <nav className={isSidebarOpen ? 'px-4 py-5' : 'px-3 py-5'} aria-label="RL sidebar">
          {isSidebarOpen ? (
            <div
              className={`mb-3 px-1 text-xs font-black uppercase tracking-wide ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {sidebarSectionTitle}
            </div>
          ) : null}

          <button
            type="button"
            className={`flex h-11 w-full items-center rounded-xl text-left text-sm font-black transition-colors ${
              isSidebarOpen ? 'gap-3 px-2' : 'justify-center px-0'
            } ${
              isLight
                ? 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                : 'bg-slate-800/90 text-sky-200 hover:bg-slate-700'
            }`}
            title="Track"
            aria-label="Track"
            aria-current="page"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center text-xl" aria-hidden="true">
              ▦
            </span>
            {isSidebarOpen ? <span className="min-w-0 truncate">Track</span> : null}
          </button>
        </nav>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col">
        <Header
          mode={mode}
          theme={theme}
          isSidebarOpen={isSidebarOpen}
          onModeChange={setMode}
          onToggleTheme={() =>
            setTheme((value) => (value === 'dark' ? 'light' : 'dark'))
          }
          onToggleSidebar={() => setIsSidebarOpen((value) => !value)}
          onOpenGuideTour={() => setIsGuideTourOpen(true)}
        />

        <section className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-5">
          <div className="w-full max-w-none">
            {mode === 'path' ? (
              <div data-tour="rl-path-content">
                <PathMode
                  lessons={rlLearningPath.lessons}
                  selectedLessonId={selectedLessonId}
                  onSelectLesson={setSelectedLessonId}
                  theme={theme}
                />
              </div>
            ) : (
              <div
                className={`flex min-h-[420px] w-full items-center justify-center rounded-xl border p-8 shadow-sm ${
                  isLight
                    ? 'border-sky-100 bg-white shadow-sky-100/70'
                    : 'border-slate-800 bg-[#0b1220] shadow-black/20'
                }`}
              >
                <div className="max-w-md text-center">
                  <div
                    className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
                      isLight ? 'bg-[#eef6ff] text-sky-700' : 'bg-slate-800 text-sky-300'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-7 w-7"
                      aria-hidden="true"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                  </div>
                  <h2 className={`mt-5 text-2xl font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
                    Visualization 3D
                  </h2>
                  <p className={`mt-2 text-sm leading-6 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    This page is coming soon. Review content should stay inside its
                    respective lesson instead of living as a separate top-level mode.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <GuideTour isOpen={isGuideTourOpen} onClose={() => setIsGuideTourOpen(false)} />
    </main>
  );
}

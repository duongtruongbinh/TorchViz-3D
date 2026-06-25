import { getStrings, type Language } from '../../lib/localization';
import { useStore } from '../../store/useStore';

type LearningLabHeaderProps = {
  mode: 'path' | 'review';
  theme: 'dark' | 'light';
  isSidebarOpen: boolean;
  onModeChange: (mode: 'path' | 'review') => void;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
};

export default function LearningLabHeader({
  mode,
  theme,
  isSidebarOpen,
  onModeChange,
  onToggleTheme,
  onToggleSidebar,
}: LearningLabHeaderProps) {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const currentLanguage = language === 'vi' ? ('vi' as Language) : ('en' as Language);
  const text = getStrings(currentLanguage).learningLab;
  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-40 w-full rounded-b-lg border-b shadow-sm ${
      isLight
        ? 'border-sky-100 bg-white/95 text-slate-950 shadow-sky-100/70'
        : 'border-slate-800 bg-[#0f172a] text-slate-100 shadow-black/20'
    }`}>
      <div className="flex h-16 w-full items-center gap-4 px-5">
        <button
          type="button"
          onClick={onToggleSidebar}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
            isLight
              ? 'text-slate-500 hover:bg-sky-50 hover:text-sky-700'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
          title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-pressed={isSidebarOpen}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <rect x="4" y="5" width="16" height="14" rx="2" />
            <path d="M9 5v14" />
          </svg>
        </button>

        <div className="flex h-10 overflow-hidden rounded-full border border-sky-100 bg-[#eef6ff] p-1">
          {(['path', 'review'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onModeChange(item)}
              className={`rounded-full px-4 text-sm font-black transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                mode === item
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-500 hover:text-sky-700'
              }`}
              aria-pressed={mode === item}
            >
              {item === 'path' ? text.path : text.review}
            </button>
          ))}
        </div>

        <div className={`hidden h-10 min-w-[260px] max-w-[520px] flex-1 items-center gap-2 rounded-full px-4 lg:flex ${
          isLight ? 'bg-[#eef6ff] text-slate-500' : 'bg-slate-900 text-slate-500'
        }`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 shrink-0"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="truncate text-sm">Learning Lab</span>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={theme === 'dark'}
          onClick={onToggleTheme}
          className={`ml-auto flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
            isLight
              ? 'border-sky-100 bg-white text-slate-700 shadow-sm hover:bg-sky-50 hover:text-sky-700'
              : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
          title={theme === 'dark' ? text.lightTheme : text.darkTheme}
          aria-label={theme === 'dark' ? text.lightTheme : text.darkTheme}
        >
          {isLight ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.53 2.47a.75.75 0 0 1 .2.74A8.25 8.25 0 0 0 20.8 13.77a.75.75 0 0 1 .93.93A9.75 9.75 0 1 1 9.3 2.27a.75.75 0 0 1 .23.2Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => setLanguage(currentLanguage === 'vi' ? ('en' as Language) : ('vi' as Language))}
          className={`flex h-10 items-center gap-1.5 rounded-full border px-3 text-sm font-black uppercase transition-colors ${
            isLight
              ? 'border-sky-100 bg-white text-slate-700 shadow-sm hover:bg-sky-50 hover:text-sky-700'
              : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
          title={currentLanguage === 'vi' ? 'Switch to English' : 'Switch to Vietnamese'}
          aria-label={currentLanguage === 'vi' ? 'Switch to English' : 'Switch to Vietnamese'}
          aria-pressed={currentLanguage === 'vi'}
        >
          <span>{currentLanguage === 'vi' ? 'VI' : 'EN'}</span>
        </button>
      </div>
    </header>
  );
}

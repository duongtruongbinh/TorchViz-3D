import { useEffect, useRef, useState } from 'react';
import { getStrings, LANGUAGE_OPTIONS, type Language } from '../../lib/localization';
import { useStore } from '../../store/useStore';

type LearningLabHeaderProps = {
  mode: 'path' | 'review';
  theme: 'dark' | 'light';
  onModeChange: (mode: 'path' | 'review') => void;
  onToggleTheme: () => void;
  onBackToLanding: () => void;
};

export default function LearningLabHeader({
  mode,
  theme,
  onModeChange,
  onToggleTheme,
  onBackToLanding,
}: LearningLabHeaderProps) {
  const language = useStore((s) => s.language);
  const setLanguage = useStore((s) => s.setLanguage);
  const text = getStrings(language).learningLab;
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/92 px-5 py-4 shadow-xl shadow-black/25">
      <div className="mx-auto flex max-w-[1480px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase text-teal-200">
            <button
              type="button"
              onClick={onBackToLanding}
              className="flex h-8 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2.5 text-xs font-medium text-[var(--text-muted)] transition-colors hover:bg-[#3f3f46] hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              title={text.back}
              aria-label={text.back}
            >
              <span aria-hidden="true">{'<-'}</span>
              <span>Landing</span>
            </button>
            <span>{text.label}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <div className="flex h-8 overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface-elevated)]">
            {(['path', 'review'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onModeChange(item)}
                className={`px-3 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-300/35 ${
                  mode === item
                    ? 'bg-teal-400/18 text-teal-100'
                    : 'text-[var(--text-muted)] hover:bg-[#3f3f46] hover:text-white'
                }`}
                aria-pressed={mode === item}
              >
                {item === 'path' ? text.path : text.review}
              </button>
            ))}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={theme === 'light'}
            onClick={onToggleTheme}
            className="group flex h-8 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] px-2 text-[var(--text-muted)] transition-all hover:bg-[#3f3f46] hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-300/35"
            title={theme === 'dark' ? text.lightTheme : text.darkTheme}
            aria-label={theme === 'dark' ? text.lightTheme : text.darkTheme}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M12 2.75a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0V3.5a.75.75 0 0 1 .75-.75ZM5.64 4.58a.75.75 0 0 1 1.06 0l.88.88a.75.75 0 1 1-1.06 1.06l-.88-.88a.75.75 0 0 1 0-1.06ZM18.36 4.58a.75.75 0 0 1 0 1.06l-.88.88a.75.75 0 0 1-1.06-1.06l.88-.88a.75.75 0 0 1 1.06 0ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM2.75 12a.75.75 0 0 1 .75-.75h1.25a.75.75 0 0 1 0 1.5H3.5a.75.75 0 0 1-.75-.75ZM18.5 12a.75.75 0 0 1 .75-.75h1.25a.75.75 0 0 1 0 1.5h-1.25a.75.75 0 0 1-.75-.75ZM6.52 17.48a.75.75 0 0 1 1.06 1.06l-.88.88a.75.75 0 0 1-1.06-1.06l.88-.88ZM17.48 17.48l.88.88a.75.75 0 1 1-1.06 1.06l-.88-.88a.75.75 0 0 1 1.06-1.06ZM12 18.5a.75.75 0 0 1 .75.75v1.25a.75.75 0 0 1-1.5 0v-1.25a.75.75 0 0 1 .75-.75Z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 0 1 .2.74A8.25 8.25 0 0 0 20.8 13.77a.75.75 0 0 1 .93.93A9.75 9.75 0 1 1 9.3 2.27a.75.75 0 0 1 .23.2Z" clipRule="evenodd" />
              </svg>
            )}
            <span
              className={`flex h-5 w-9 shrink-0 items-center rounded-full border p-0.5 transition-all ${
                theme === 'light'
                  ? 'justify-end border-amber-300/70 bg-amber-300/30'
                  : 'justify-start border-zinc-600/80 bg-black/20 group-hover:border-zinc-500'
              }`}
              aria-hidden="true"
            >
              <span className={`h-4 w-4 rounded-full shadow-sm transition-colors ${theme === 'light' ? 'bg-amber-50' : 'bg-zinc-500 group-hover:bg-zinc-300'}`} />
            </span>
          </button>
          <div className="relative" ref={languageRef}>
            <button
              type="button"
              onClick={() => setIsLanguageOpen((v) => !v)}
              className={`flex h-8 w-8 items-center justify-center rounded-md border bg-[var(--surface-elevated)] text-[var(--text-muted)] transition-all hover:bg-[#3f3f46] hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${isLanguageOpen ? 'border-blue-500 bg-blue-500/10 text-blue-300 ring-2 ring-blue-500/25' : 'border-[var(--border)]'}`}
              title={text.language}
              aria-label={text.language}
              aria-haspopup="menu"
              aria-expanded={isLanguageOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M4 5h9" />
                <path d="M9 3v2" />
                <path d="M6 9c1.2 2.5 3.3 4.2 6 5" />
                <path d="M11 9c-.7 1.8-2.1 3.4-4 4.6" />
                <path d="M14 19l3-7 3 7" />
                <path d="M15.1 16.5h3.8" />
              </svg>
            </button>

            {isLanguageOpen && (
              <div
                className="absolute right-0 top-[calc(100%+6px)] z-50 flex w-36 flex-col overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-xl shadow-black/90"
                role="menu"
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    className={`px-3 py-2 text-left text-xs transition-colors ${language === option.code ? 'bg-blue-600/20 font-medium text-blue-300' : 'text-zinc-200 hover:bg-zinc-800 hover:text-zinc-50'}`}
                    onClick={() => {
                      setLanguage(option.code as Language);
                      setIsLanguageOpen(false);
                    }}
                    role="menuitemradio"
                    aria-checked={language === option.code}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

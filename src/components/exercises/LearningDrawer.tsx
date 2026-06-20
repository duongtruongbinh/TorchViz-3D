import React, { useId } from 'react';

export const LearningDrawer: React.FC<{
  isOpen: boolean;
  title: string;
  subtitle?: string;
  closeLabel: string;
  fallbackModal?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, title, subtitle, closeLabel, fallbackModal = false, onClose, children }) => {
  const titleId = useId();
  if (!isOpen) return null;

  const panel = (
    <section
      className={`flex max-h-full min-h-0 w-full max-w-[34rem] flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/98 text-zinc-100 shadow-2xl backdrop-blur-xl ${
        fallbackModal ? 'max-h-[calc(100%-2rem)]' : 'h-full'
      }`}
      role="dialog"
      aria-modal={fallbackModal ? true : undefined}
      aria-labelledby={titleId}
    >
      {/* Top Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

      <div className="flex items-center justify-between border-b border-zinc-900/60 px-5 py-4 bg-zinc-900/10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4.5 h-4.5">
              <path d="M10.375 2.25a.75.75 0 00-1.125 0L4.75 6.945V14.5a1.5 1.5 0 001.5 1.5h7.5a1.5 1.5 0 001.5-1.5V6.945l-4.5-4.695z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-sm font-bold tracking-wide text-zinc-100">{title}</h2>
            {subtitle && <p className="truncate text-[11px] font-mono text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>
        <button
          type="button"
          className="ml-3 shrink-0 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 hover:border-zinc-700 active:scale-95 transition-all duration-150"
          onClick={onClose}
        >
          {closeLabel}
        </button>
      </div>
      {children}
    </section>
  );

  if (fallbackModal) {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/65 px-4 py-4 backdrop-blur-sm">
        {panel}
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 top-4 z-40 w-[min(34rem,calc(100%-2rem))] pointer-events-auto">
      {panel}
    </div>
  );
};

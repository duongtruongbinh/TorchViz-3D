import React from 'react';
import { getStrings } from '../lib/localization';
import { useStore } from '../store/useStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type GuideIcon = 'workflow' | 'navigation' | 'blocks' | 'mnist' | 'export';

const guideIconPaths: Record<GuideIcon, string> = {
  workflow: 'M4 6.5h8M4 12h6m5-6 2 2 3-4M4 17.5h8',
  navigation: 'M12 3l7 16-7-3-7 3 7-16Z',
  blocks: 'M4 5h6v6H4V5Zm10 0h6v6h-6V5ZM4 15h6v4H4v-4Zm10 0h6v4h-6v-4Z',
  mnist: 'M7 4h10v16H7V4Zm3 3h4m-4 4h4m-4 4h2M5 8H3m2 4H3m2 4H3m18-8h-2m2 4h-2m2 4h-2',
  export: 'M12 3v10m0-10 4 4m-4-4-4 4M5 13v6h14v-6',
};

const GuideIconBadge: React.FC<{ icon: GuideIcon }> = ({ icon }) => (
  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-blue-400/25 bg-blue-500/10 text-blue-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d={guideIconPaths[icon]} />
    </svg>
  </span>
);

const HelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const language = useStore((s) => s.language);
  const t = getStrings(language);
  if (!isOpen) return null;

  const sections: Array<{ title: string; items: string[]; icon: GuideIcon }> = [
    { title: t.help.workflow, items: t.help.workflowItems, icon: 'workflow' },
    { title: t.help.navigation, items: t.help.canvasItems, icon: 'navigation' },
    { title: t.help.blocks, items: t.help.blockItems, icon: 'blocks' },
    { title: t.help.mnistDemo, items: t.help.mnistItems, icon: 'mnist' },
    { title: t.help.exportAndTour, items: t.help.exportItems, icon: 'export' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass-panel p-0 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-[min(92vw,640px)] border border-[var(--border)] max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="border-b border-[var(--border)] px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-[var(--text)] leading-tight">{t.help.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-dim)]">{t.help.description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:bg-[#3f3f46] hover:text-[var(--text)] transition-colors"
              aria-label={t.help.gotIt}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid gap-x-6 gap-y-5 px-6 py-5 text-sm sm:grid-cols-2">
          {sections.map((section) => (
            <section key={section.title} className="flex gap-3">
              <GuideIconBadge icon={section.icon} />
              <div className="min-w-0">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2">{section.title}</h4>
                <ul className="space-y-1.5 text-[var(--text-muted)] text-sm leading-relaxed">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--border-subtle)]" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <div className="flex justify-end border-t border-[var(--border)] px-6 py-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[#3f3f46] border border-[var(--border)] text-[var(--text)] text-sm font-medium transition-all shadow-sm active:scale-95 text-center"
          >
            {t.help.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

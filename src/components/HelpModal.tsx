import type React from 'react';
import { Binary, Boxes, Download, Navigation, Workflow, X, type LucideIcon } from 'lucide-react';
import { getStrings } from '../lib/localization';
import { usePreferencesStore } from '../store/usePreferencesStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type GuideIcon = 'workflow' | 'navigation' | 'blocks' | 'mnist' | 'export';

const guideIcons: Record<GuideIcon, LucideIcon> = {
  workflow: Workflow,
  navigation: Navigation,
  blocks: Boxes,
  mnist: Binary,
  export: Download,
};

const GuideIconBadge: React.FC<{ icon: GuideIcon }> = ({ icon }) => {
  const Icon = guideIcons[icon];

  return (
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-blue-400/25 bg-blue-500/10 text-blue-300">
      <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
    </span>
  );
};

const HelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const language = usePreferencesStore((s) => s.language);
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
              <X className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
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

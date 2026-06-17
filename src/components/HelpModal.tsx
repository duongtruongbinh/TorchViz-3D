import React from 'react';
import { getStrings } from '../lib/localization';
import { useStore } from '../store/useStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const language = useStore((s) => s.language);
  const t = getStrings(language);
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass-panel p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-[400px] border border-[var(--border)] max-h-[85vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <h3 className="text-xl font-bold text-[var(--text)] mb-1">{t.help.title}</h3>
        <p className="text-[var(--text-dim)] text-sm mb-6 leading-relaxed">
          {t.help.description}
        </p>

        <div className="space-y-4 text-sm">
          <section>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-3">{t.help.navigation}</h4>
            <ul className="space-y-3 text-[var(--text-muted)] text-sm">
              <li className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text)] shrink-0 shadow-sm">{t.help.leftButton}</span>
                {t.help.pan}
              </li>
              <li className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text)] shrink-0 shadow-sm">{t.help.rightButton}</span>
                {t.help.rotateCamera}
              </li>
              <li className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text)] shrink-0 shadow-sm">{t.help.scroll}</span>
                {t.help.zoom}
              </li>
            </ul>
          </section>

          <section>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-3">{t.help.interaction}</h4>
            <ul className="space-y-2 text-[var(--text-muted)] text-sm leading-relaxed list-disc pl-4 marker:text-[var(--border)]">
              <li>{t.help.clickBlocks}</li>
              <li>{t.help.clickPlus} <strong className="text-[var(--text)] font-semibold">+</strong> {t.help.plusButtonRest}</li>
              <li>{t.help.clickMinus} <strong className="text-[var(--text)] font-semibold">-</strong> {t.help.minusButtonRest}</li>
            </ul>
          </section>

          <section>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-3">{t.help.code}</h4>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              {t.help.codeBeforeModel} <code className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-blue-400 font-mono text-[13px] mx-0.5">model</code> {t.help.codeAfterModel} <strong className="text-[var(--text)] font-semibold">{t.header.visualize}</strong> {t.help.codeAfterVisualize}
            </p>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
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

import type React from 'react';
import type { IRNode } from '../lib/irTypes';
import { getLayerInsight } from '../lib/layerInsights';
import { getStrings } from '../lib/localization';
import { usePreferencesStore } from '../store/usePreferencesStore';

interface ParamFormulaPopupProps {
  node: IRNode | null;
  onClose: () => void;
}

const ParamFormulaPopup: React.FC<ParamFormulaPopupProps> = ({ node, onClose }) => {
  const language = usePreferencesStore((s) => s.language);
  const t = getStrings(language);
  if (!node) return null;

  const insight = getLayerInsight(node, t);
  const formula = insight.paramFormula;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="glass-panel w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] p-4 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={formula.title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">{t.paramFormula.title}</div>
            <h2 className="mt-1 text-base font-semibold text-[var(--text)]">{formula.title}</h2>
          </div>
          <button
            type="button"
            className="h-7 px-2 rounded-md border border-[var(--border)] text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border-subtle)]"
            onClick={onClose}
          >
            {t.paramFormula.close}
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)] mb-1">{t.paramFormula.formula}</div>
            <div className="font-mono text-[var(--text)] bg-black/30 rounded-md px-3 py-2 break-words">{formula.formula}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)] mb-1">{t.paramFormula.calculation}</div>
            <div className="font-mono text-blue-200 bg-blue-950/30 rounded-md px-3 py-2 break-words">{formula.calculation}</div>
          </div>
          {formula.note && (
            <p className="text-xs leading-relaxed text-[var(--text-muted)]">{formula.note}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParamFormulaPopup;

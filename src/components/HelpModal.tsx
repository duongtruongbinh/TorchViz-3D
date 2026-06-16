import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
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
        <h3 className="text-xl font-bold text-[var(--text)] mb-1">User Guide</h3>
        <p className="text-[var(--text-dim)] text-sm mb-6 leading-relaxed">
          How to navigate and interact with the 3D visualization.
        </p>

        <div className="space-y-4 text-sm">
          <section>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-3">Navigation</h4>
            <ul className="space-y-3 text-[var(--text-muted)] text-sm">
              <li className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text)] shrink-0 shadow-sm">Left btn</span>
                Click + drag: Pan
              </li>
              <li className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text)] shrink-0 shadow-sm">Right btn</span>
                Click + drag: Rotate camera
              </li>
              <li className="flex items-center gap-2.5">
                <span className="px-2 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text)] shrink-0 shadow-sm">Scroll</span>
                Zoom in / out
              </li>
            </ul>
          </section>

          <section>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-3">Interaction</h4>
            <ul className="space-y-2 text-[var(--text-muted)] text-sm leading-relaxed list-disc pl-4 marker:text-[var(--border)]">
              <li>Click blocks to view details in the right panel.</li>
              <li>Click the <strong className="text-[var(--text)] font-semibold">+</strong> button on collapsed blocks to expand.</li>
              <li>Click the <strong className="text-[var(--text)] font-semibold">−</strong> button on the header of expanded blocks to collapse.</li>
            </ul>
          </section>

          <section>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-3">Code</h4>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              Define a <code className="px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border-subtle)] text-blue-400 font-mono text-[13px] mx-0.5">model</code> variable in the Python editor, then press <strong className="text-[var(--text)] font-semibold">Visualize</strong> to generate the graph.
            </p>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[#3f3f46] border border-[var(--border)] text-[var(--text)] text-sm font-medium transition-all shadow-sm active:scale-95 text-center"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

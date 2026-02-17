import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 p-6 rounded-xl shadow-2xl w-[400px] border border-zinc-700/60 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-zinc-100 mb-1">User Guide</h3>
        <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
          How to navigate and interact with the 3D visualization.
        </p>

        <div className="space-y-4 text-sm">
          <section>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Navigation</h4>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-600 text-xs font-medium text-zinc-300 shrink-0">Left btn</span>
                Click + drag: Rotate camera
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-600 text-xs font-medium text-zinc-300 shrink-0">Right btn</span>
                Click + drag: Pan
              </li>
              <li className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-600 text-xs font-medium text-zinc-300 shrink-0">Scroll</span>
                Zoom in / out
              </li>
            </ul>
          </section>

          <section>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Interaction</h4>
            <ul className="space-y-2 text-zinc-300 text-sm">
              <li>Click blocks to view details in the right panel.</li>
              <li>Click the blue button on collapsed blocks to expand.</li>
              <li>Click the blue button on the header of expanded blocks to collapse.</li>
            </ul>
          </section>

          <section>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Code</h4>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Define a <code className="px-1 py-0.5 rounded bg-zinc-800 text-blue-300 font-mono">model</code> variable in the Python editor, then press <strong className="text-zinc-100">Visualize</strong> to generate the graph.
            </p>
          </section>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;

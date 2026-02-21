import React, { useState } from 'react';
import { LayoutData } from '../lib/irTypes';
import { generateSVG } from '../lib/svgExport';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  layout: LayoutData | null;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const ExportSvgModal: React.FC<Props> = ({ isOpen, onClose, layout }) => {
  const [config, setConfig] = useState({
    scale: 32,
    legend: true,
    lightBackground: false,
    transparentBackground: false,
  });

  if (!isOpen || !layout) return null;

  const handleDownloadSvg = () => {
    const svgContent = generateSVG(layout, config);
    downloadBlob(new Blob([svgContent], { type: 'image/svg+xml' }), 'model_architecture.svg');
    onClose();
  };

  const handleDownloadPng = () => {
    const container = document.querySelector('[data-torchviz-canvas-container]');
    const canvas = container?.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const capture = () => {
      try {
        canvas.toBlob(
          (blob) => {
            if (blob) downloadBlob(blob, 'model_architecture.png');
            onClose();
          },
          'image/png',
          1.0,
        );
      } catch (err) {
        console.error('PNG export failed:', err);
        onClose();
      }
    };
    requestAnimationFrame(() => requestAnimationFrame(capture));
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="glass-panel p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-[460px] border border-[var(--border)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <h3 className="text-xl font-bold text-[var(--text)] mb-1">Export Visualization</h3>
        <p className="text-[var(--text-dim)] text-sm mb-6 leading-relaxed">
          Generate a publication-ready vector graphic or capture the current 3D view.
        </p>

        <div className="flex flex-col gap-4 mb-8">
          {/* SVG Config Section */}
          <div className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-sm">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-3">SVG Settings</h4>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">Light Theme (Print-friendly)</span>
                <input
                  type="checkbox"
                  checked={config.lightBackground}
                  onChange={(e) => setConfig({ ...config, lightBackground: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--border)] bg-black/20 text-blue-500 focus:ring-blue-500/30"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">Transparent Background</span>
                <input
                  type="checkbox"
                  checked={config.transparentBackground}
                  onChange={(e) => setConfig({ ...config, transparentBackground: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--border)] bg-black/20 text-blue-500 focus:ring-blue-500/30"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">Include Legend</span>
                <input
                  type="checkbox"
                  checked={config.legend}
                  onChange={(e) => setConfig({ ...config, legend: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--border)] bg-black/20 text-blue-500 focus:ring-blue-500/30"
                />
              </label>

              <label className="flex items-center justify-between group pt-1">
                <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors shrink-0">Export Scale</span>
                <select
                  value={config.scale}
                  onChange={(e) => setConfig({ ...config, scale: Number(e.target.value) })}
                  className="bg-black/30 border border-[var(--border)] rounded text-xs text-[var(--text)] px-2 py-1 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value={16}>Small (0.5x)</option>
                  <option value={32}>Normal (1x)</option>
                  <option value={64}>Large (2x)</option>
                  <option value={128}>Huge (4x)</option>
                </select>
              </label>
            </div>

            <button
              onClick={handleDownloadSvg}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 11.25a.75.75 0 001.5 0v-2.546l.943.944a.75.75 0 001.06-1.06l-2.22-2.22a.75.75 0 00-1.06 0l-2.22 2.22a.75.75 0 001.06 1.06l.937-.938v2.54z" clipRule="evenodd" />
              </svg>
              Download SVG
            </button>
          </div>

          <div className="h-px bg-[var(--border)] w-full opacity-50" />

          {/* PNG Option */}
          <button
            onClick={handleDownloadPng}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[#3f3f46] transition-all group text-left shadow-sm active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400">
                <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909-3.22-3.22a.75.75 0 00-1.06 0L2.5 11.06zm12.22-4.81a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text)]">Export Screen (PNG)</div>
              <div className="text-[11px] text-[var(--text-dim)]">Snapshot of the exact 3D canvas viewport</div>
            </div>
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-elevated)] text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportSvgModal;

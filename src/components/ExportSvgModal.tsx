import React from 'react';
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
  if (!isOpen || !layout) return null;

  const handleDownloadSvg = () => {
    const svgContent = generateSVG(layout, { scale: 32, legend: true, lightBackground: true });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 p-6 rounded-xl shadow-2xl w-[420px] border border-zinc-700/60">
        <h3 className="text-lg font-bold text-zinc-100 mb-1">Export Visualization</h3>
        <p className="text-zinc-400 text-xs mb-6 leading-relaxed">
          Generate a publication-ready vector graphic or capture the current 3D view as a raster image.
        </p>

        <div className="flex flex-col gap-3 mb-6">
          {/* SVG option */}
          <button
            onClick={handleDownloadSvg}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-700/50 bg-zinc-800/60 hover:bg-zinc-800 hover:border-blue-500/40 transition-all group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-blue-400">
                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 11.25a.75.75 0 001.5 0v-2.546l.943.944a.75.75 0 001.06-1.06l-2.22-2.22a.75.75 0 00-1.06 0l-2.22 2.22a.75.75 0 001.06 1.06l.937-.938v2.54z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-200 group-hover:text-white">Download SVG</div>
              <div className="text-[10px] text-zinc-500">Vector graphic &middot; Scalable &middot; Best for papers</div>
            </div>
          </button>

          {/* PNG option */}
          <button
            onClick={handleDownloadPng}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-zinc-700/50 bg-zinc-800/60 hover:bg-zinc-800 hover:border-emerald-500/40 transition-all group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-400">
                <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909-3.22-3.22a.75.75 0 00-1.06 0L2.5 11.06zm12.22-4.81a1.25 1.25 0 10-2.5 0 1.25 1.25 0 002.5 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-200 group-hover:text-white">Export PNG (Screenshot)</div>
              <div className="text-[10px] text-zinc-500">Raster image &middot; Exact 3D view with lighting</div>
            </div>
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportSvgModal;

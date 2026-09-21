import type React from 'react';
import { useState } from 'react';
import { FileDown, Image, ImageDown } from 'lucide-react';
import type { LayoutData } from '../lib/irTypes';
import { generateSVG } from '../lib/svgExport';
import { getStrings } from '../lib/localization';
import { usePreferencesStore } from '../store/usePreferencesStore';

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
  const language = usePreferencesStore((s) => s.language);
  const t = getStrings(language);
  const [config, setConfig] = useState({
    scale: 32,
    textScale: 1,
    strokeScale: 1,
    padding: 80,
    legend: true,
    lightBackground: false,
    transparentBackground: false,
    pngScale: 2,
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

    const dpr = config.pngScale;
    const srcW = canvas.width;
    const srcH = canvas.height;
    const outW = Math.round((srcW / window.devicePixelRatio) * dpr);
    const outH = Math.round((srcH / window.devicePixelRatio) * dpr);

    // Create off-screen canvas at higher resolution
    const offscreen = document.createElement('canvas');
    offscreen.width = outW;
    offscreen.height = outH;
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      // Fallback to direct capture
      canvas.toBlob(
        (blob) => { if (blob) downloadBlob(blob, 'model_architecture.png'); onClose(); },
        'image/png', 1.0,
      );
      return;
    }

    // Enable high-quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const capture = () => {
      try {
        ctx.drawImage(canvas, 0, 0, srcW, srcH, 0, 0, outW, outH);
        offscreen.toBlob(
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
        className="glass-panel p-6 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-[480px] border border-[var(--border)] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <h3 className="text-xl font-bold text-[var(--text)] mb-1">{t.export.title}</h3>
        <p className="text-[var(--text-dim)] text-sm mb-6 leading-relaxed">
          {t.export.description}
        </p>

        <div className="flex flex-col gap-4 mb-8">
          {/* SVG Config Section */}
          <div className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-sm">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-3">{t.export.svgSettings}</h4>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">{t.export.lightTheme}</span>
                <input
                  type="checkbox"
                  checked={config.lightBackground}
                  onChange={(e) => setConfig({ ...config, lightBackground: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--border)] bg-black/20 text-blue-500 focus:ring-blue-500/30"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">{t.export.transparentBackground}</span>
                <input
                  type="checkbox"
                  checked={config.transparentBackground}
                  onChange={(e) => setConfig({ ...config, transparentBackground: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--border)] bg-black/20 text-blue-500 focus:ring-blue-500/30"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors">{t.export.includeLegend}</span>
                <input
                  type="checkbox"
                  checked={config.legend}
                  onChange={(e) => setConfig({ ...config, legend: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--border)] bg-black/20 text-blue-500 focus:ring-blue-500/30"
                />
              </label>

              <label className="flex items-center justify-between group pt-1">
                <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors shrink-0">{t.export.exportScale}</span>
                <select
                  value={config.scale}
                  onChange={(e) => setConfig({ ...config, scale: Number(e.target.value) })}
                  className="bg-black/30 border border-[var(--border)] rounded text-xs text-[var(--text)] px-2 py-1 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value={16}>{t.export.options.smallHalf}</option>
                  <option value={32}>{t.export.options.normal}</option>
                  <option value={64}>{t.export.options.largeDouble}</option>
                  <option value={128}>{t.export.options.hugeQuad}</option>
                </select>
              </label>

              <label className="flex items-center justify-between group pt-1">
                <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors shrink-0">{t.export.textScale}</span>
                <select
                  value={config.textScale}
                  onChange={(e) => setConfig({ ...config, textScale: Number(e.target.value) })}
                  className="bg-black/30 border border-[var(--border)] rounded text-xs text-[var(--text)] px-2 py-1 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value={0.5}>{t.export.options.smallHalf}</option>
                  <option value={0.75}>{t.export.options.compact}</option>
                  <option value={1}>{t.export.options.normal}</option>
                  <option value={1.25}>{t.export.options.large125}</option>
                  <option value={1.5}>{t.export.options.larger}</option>
                  <option value={2}>{t.export.options.xlDouble}</option>
                </select>
              </label>

              <label className="flex items-center justify-between group pt-1">
                <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors shrink-0">{t.export.strokeScale}</span>
                <select
                  value={config.strokeScale}
                  onChange={(e) => setConfig({ ...config, strokeScale: Number(e.target.value) })}
                  className="bg-black/30 border border-[var(--border)] rounded text-xs text-[var(--text)] px-2 py-1 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value={0.5}>{t.export.options.thin}</option>
                  <option value={1}>{t.export.options.normal}</option>
                  <option value={1.5}>{t.export.options.thick}</option>
                  <option value={2}>{t.export.options.boldDouble}</option>
                </select>
              </label>

              <label className="flex items-center justify-between group pt-1">
                <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors shrink-0">{t.export.padding}</span>
                <select
                  value={config.padding}
                  onChange={(e) => setConfig({ ...config, padding: Number(e.target.value) })}
                  className="bg-black/30 border border-[var(--border)] rounded text-xs text-[var(--text)] px-2 py-1 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value={40}>{t.export.options.tight}</option>
                  <option value={80}>{t.export.options.normalPlain}</option>
                  <option value={120}>{t.export.options.spacious}</option>
                </select>
              </label>
            </div>

            <button
              onClick={handleDownloadSvg}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-md active:scale-[0.98]"
            >
              <FileDown className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              {t.export.downloadSvg}
            </button>
          </div>

          <div className="h-px bg-[var(--border)] w-full opacity-50" />

          {/* PNG Option with scale selector */}
          <div className="bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Image className="h-4 w-4 text-emerald-400" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">{t.export.exportScreenPng}</div>
                  <div className="text-[11px] text-[var(--text-dim)]">{t.export.pngDescription}</div>
                </div>
              </div>
            </div>

            <label className="flex items-center justify-between group mb-3">
              <span className="text-[13px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors shrink-0">{t.export.resolution}</span>
              <select
                value={config.pngScale}
                onChange={(e) => setConfig({ ...config, pngScale: Number(e.target.value) })}
                className="bg-black/30 border border-[var(--border)] rounded text-xs text-[var(--text)] px-2 py-1 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value={1}>{t.export.options.screen}</option>
                <option value={2}>{t.export.options.highDpi}</option>
                <option value={3}>{t.export.options.print}</option>
                <option value={4}>{t.export.options.ultra}</option>
              </select>
            </label>

            <button
              onClick={handleDownloadPng}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-sm font-semibold transition-all active:scale-[0.98]"
            >
              <ImageDown className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              {t.export.downloadPng(config.pngScale)}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-elevated)] text-sm font-medium transition-colors"
          >
            {t.export.cancel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportSvgModal;

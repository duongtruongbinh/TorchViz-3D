import React from 'react';
import type { AppError } from '../../lib/appError';
import type { getStrings } from '../../lib/localization';

type CanvasStrings = ReturnType<typeof getStrings>['canvas'];
type HeaderStrings = ReturnType<typeof getStrings>['header'];
type HelpStrings = ReturnType<typeof getStrings>['help'];

export const CanvasLoadingOverlay: React.FC<{ t: CanvasStrings }> = React.memo(({ t }) => (
  <div className="absolute inset-0 flex items-center justify-center z-20 bg-zinc-950/70 backdrop-blur-sm transition-all duration-300">
    <div className="flex flex-col items-center gap-5 p-8 bg-zinc-900/95 rounded-2xl border border-zinc-700/60 shadow-2xl">
      <div className="relative">
        <div className="w-11 h-11 border-2 border-zinc-600 border-t-blue-500 rounded-full animate-spin" />
      </div>
      <span className="text-zinc-200 font-mono text-sm tracking-wider animate-pulse">
        {t.runningTorchScript}
      </span>
    </div>
  </div>
));

export const CanvasErrorOverlay: React.FC<{
  error: AppError;
  t: CanvasStrings;
}> = React.memo(({ error, t }) => (
  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none">
    <div className="text-center p-10 max-w-md border border-red-700/50 bg-red-950/50 rounded-2xl backdrop-blur-sm">
      <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-red-950 rounded-2xl mx-auto flex items-center justify-center mb-5 border border-red-600/50 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-red-400">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-red-200 font-semibold text-base mb-3 tracking-wide">
        {t.compilationFailed}
      </h3>
      <p className="text-red-300/90 text-sm leading-relaxed font-mono break-words max-h-36 overflow-auto">
        {error.message || t.unknownError}
      </p>
      {error.hint && (
        <p className="text-zinc-500 text-xs mt-3">{error.hint}</p>
      )}
    </div>
  </div>
));

export const CanvasEmptyOverlay: React.FC<{
  canvas: CanvasStrings;
  header: HeaderStrings;
  help: HelpStrings;
}> = React.memo(({ canvas, header, help }) => (
  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none select-none">
    <div className="text-center p-10 max-w-md border border-zinc-700/50 bg-zinc-900/40 rounded-2xl backdrop-blur-sm">
      <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl mx-auto flex items-center justify-center mb-5 border border-zinc-600/50 shadow-inner">
        <span className="text-4xl opacity-40 grayscale">T</span>
      </div>
      <h3 className="text-zinc-100 font-semibold text-base mb-3 tracking-wide">
        {canvas.readyToVisualize}
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-5">
        {canvas.emptyBefore}
        <span className="text-blue-400 font-bold ml-1">{header.visualize}</span>{canvas.emptyAfter}
      </p>
      <div className="flex items-center justify-center gap-5 text-xs text-zinc-500">
        <span className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-lg bg-zinc-800/90 border border-zinc-600/50 text-zinc-300 font-medium">{canvas.left}</span>
          {canvas.pan}
        </span>
        <span className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-lg bg-zinc-800/90 border border-zinc-600/50 text-zinc-300 font-medium">{canvas.right}</span>
          {canvas.rotate}
        </span>
        <span className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-lg bg-zinc-800/90 border border-zinc-600/50 text-zinc-300 font-medium">{help.scroll}</span>
          {canvas.zoom}
        </span>
      </div>
    </div>
  </div>
));

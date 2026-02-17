import React from 'react';
import { IRGraph } from '../lib/irTypes';

interface BottomTabsProps {
  ir: IRGraph | null;
  error: { message: string; lineno: number; hint: string } | null;
}

const BottomTabs: React.FC<BottomTabsProps> = ({ ir, error }) => {
  return (
    <div className="h-full flex flex-col bg-zinc-900 text-zinc-300">
      {/* Tab Bar */}
      <div className="flex border-b border-zinc-800 bg-zinc-900 shrink-0">
        <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-zinc-100 border-b-2 border-blue-500 bg-zinc-800/50 select-none">
          Terminal
          {error && <span className="ml-2 w-2 h-2 inline-block rounded-full bg-red-500" />}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-zinc-950 font-mono text-xs">
        <div className="p-3 min-h-full">
          {error ? (
            <div className="bg-red-950/20 border-l-2 border-red-500 p-3 pl-4 rounded-r">
              <div className="flex items-start gap-3">
                <span className="text-red-500 font-bold mt-0.5">✖</span>
                <div>
                  <div className="text-red-300 font-bold mb-1">
                    Runtime Error at line {error.lineno}
                  </div>
                  <div className="text-red-200/80 mb-2">{error.message}</div>
                  <div className="text-zinc-500 italic">Hint: {error.hint}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-zinc-600 italic px-2">
              &gt; System ready.
              <br />
              &gt; Waiting for execution...
              {ir && (
                <>
                  <br />
                  <span className="text-emerald-500">
                    &gt; Build successful. Graph generated ({ir.stats.total_params.toLocaleString()} params).
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomTabs;

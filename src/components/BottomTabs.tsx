import React from 'react';
import { IRGraph } from '../lib/irTypes';

interface BottomTabsProps {
  ir: IRGraph | null;
  error: { message: string; lineno: number; hint: string } | null;
  collapsed?: boolean;
  headerAction?: React.ReactNode;
}

const BottomTabs: React.FC<BottomTabsProps> = ({ ir, error, collapsed = false, headerAction }) => {
  return (
    <div className="h-full flex flex-col bg-[var(--surface-elevated)] text-[var(--text-dim)] shadow-[0_-4px_24px_-1px_rgba(0,0,0,0.2)]">
      {/* Tab Bar */}
      <div className="flex items-center border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
        <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--text)] border-b-2 border-blue-500 bg-[var(--surface-elevated)] select-none">
          Terminal
          {error && <span className="ml-2 w-2 h-2 inline-block rounded-full bg-red-500" />}
        </div>
        {headerAction && <div className="ml-auto pr-2">{headerAction}</div>}
      </div>

      {/* Content Area */}
      <div className={`flex-1 overflow-auto bg-[var(--surface-elevated)] font-mono text-xs transition-[opacity,transform] duration-200 ease-out ${collapsed ? 'opacity-0 translate-y-1 pointer-events-none' : 'opacity-100 translate-y-0 delay-75'}`}>
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

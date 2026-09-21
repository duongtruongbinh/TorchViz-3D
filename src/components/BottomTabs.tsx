import type React from 'react';
import type { IRGraph } from '../lib/irTypes';
import { getStrings } from '../lib/localization';
import type { AppError } from '../lib/appError';
import { usePreferencesStore } from '../store/usePreferencesStore';

interface BottomTabsProps {
  ir: IRGraph | null;
  error: AppError | null;
  collapsed?: boolean;
  headerAction?: React.ReactNode;
  demoSuccessParams?: number | null;
}

const BottomTabs: React.FC<BottomTabsProps> = ({ ir, error, collapsed = false, headerAction, demoSuccessParams = null }) => {
  const language = usePreferencesStore((s) => s.language);
  const t = getStrings(language);
  const successParams = ir?.stats.total_params ?? demoSuccessParams;

  return (
    <div className="h-full flex flex-col bg-[var(--surface-elevated)] text-[var(--text-dim)] shadow-[0_-4px_24px_-1px_rgba(0,0,0,0.2)]">
      {/* Tab Bar */}
      <div className="flex items-center border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
        <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--text)] border-b-2 border-blue-500 bg-[var(--surface-elevated)] select-none">
          {t.terminal.title}
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
                  {error.lineno !== undefined && (
                    <div className="text-red-300 font-bold mb-1">
                      {t.terminal.runtimeErrorAtLine(error.lineno)}
                    </div>
                  )}
                  <div className="text-red-200/80 mb-2">{error.message || 'Unknown error'}</div>
                  {error.hint && (
                    <div className="text-zinc-500 italic">{t.terminal.hint(error.hint)}</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-zinc-600 italic px-2">
              {t.terminal.systemReady}
              <br />
              {t.terminal.waitingForExecution}
              {successParams !== null && (
                <>
                  <br />
                  <span className="text-emerald-500">
                    {t.terminal.buildSuccessful(successParams.toLocaleString())}
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

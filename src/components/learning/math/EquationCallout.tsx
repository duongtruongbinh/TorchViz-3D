import { memo } from 'react';
import type { EquationCalloutProps } from './types';
import { renderMathToString } from './renderMath';

/**
 * Emphasized mathematical callout card.
 * Intended for key theorems, chapter-defining identities, or milestone formulas.
 */
export const EquationCallout = memo(function EquationCallout({
  formula,
  title,
  badge,
  explanation,
  className = '',
  ariaLabel,
}: EquationCalloutProps) {
  const html = renderMathToString(formula, { displayMode: true });

  return (
    <figure
      className={`my-5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/20 p-4 sm:p-5 text-slate-800 dark:text-slate-100 shadow-sm ${className}`}
      aria-label={ariaLabel || title || 'Định lý / Công thức quan trọng'}
    >
      {(title || badge) && (
        <div className="mb-2.5 flex items-center justify-between gap-2 border-b border-blue-100 dark:border-blue-900/40 pb-2">
          {title && (
            <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
              {title}
            </h4>
          )}
          {badge && (
            <span className="rounded-full bg-blue-100 dark:bg-blue-900/80 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:text-blue-300">
              {badge}
            </span>
          )}
        </div>
      )}

      <div
        tabIndex={0}
        className="w-full max-w-full overflow-x-auto py-2 text-center text-lg font-medium [&_.katex]:text-inherit [&_.katex-display]:my-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {explanation && (
        <div className="mt-2.5 pt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-blue-100/60 dark:border-blue-900/30">
          {explanation}
        </div>
      )}
    </figure>
  );
});

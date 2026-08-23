import { memo } from 'react';
import type { MathFormulaProps } from './types';
import { renderMathToString } from './renderMath';

/**
 * Standard display mathematical formula renderer.
 * Unboxed, centered, with responsive horizontal scroll containment.
 * Does not render an artificial card/callout background.
 */
export const MathDisplay = memo(function MathDisplay({
  formula,
  className = '',
  ariaLabel,
}: MathFormulaProps) {
  const html = renderMathToString(formula, { displayMode: true });

  return (
    <div
      tabIndex={0}
      className={`my-3.5 w-full min-w-0 max-w-full overflow-x-auto py-1 text-center text-[#123B68] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded [&_.katex]:text-inherit [&_.katex-display]:my-0 [&_.katex-display]:max-w-full ${className}`}
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

// Backward-compatible alias for existing MDX call sites
export const BlockMath = MathDisplay;

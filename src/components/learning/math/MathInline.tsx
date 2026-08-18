import { memo } from 'react';
import type { MathFormulaProps } from './types';
import { renderMathToString } from './renderMath';

/**
 * Shared inline mathematical expression renderer.
 * Blends naturally with surrounding sentence text, inherits font color,
 * and maintains appropriate line-height without vertical distortion.
 */
export const MathInline = memo(function MathInline({
  formula,
  className = '',
  ariaLabel,
}: MathFormulaProps) {
  const html = renderMathToString(formula, { displayMode: false });

  return (
    <span
      className={`inline-block px-0.5 align-baseline text-inherit [&_.katex]:text-inherit [&_.katex-html]:text-inherit ${className}`}
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

// Backward-compatible alias
export const InlineMath = MathInline;

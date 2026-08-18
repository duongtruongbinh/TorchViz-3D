import katex from 'katex';
import type { RenderMathOptions } from './types';

/**
 * Centralized KaTeX rendering function for authored and dynamic math formulas.
 * Provides consistent options, non-destructive fallback rendering, and trust: false.
 */
export function renderMathToString(
  formula: string,
  options: RenderMathOptions = {},
): string {
  const {
    displayMode = false,
    throwOnError = false,
    errorColor = '#dc2626',
  } = options;

  try {
    return katex.renderToString(formula, {
      displayMode,
      throwOnError,
      errorColor,
      trust: false,
      strict: false,
    });
  } catch (err: unknown) {
    if (throwOnError) {
      throw err;
    }
    // Fallback for isolated runtime error: render raw formula wrapped in code
    return `<span class="katex-error text-rose-500 font-mono text-sm px-1" title="${String(
      err,
    )}">${formula}</span>`;
  }
}

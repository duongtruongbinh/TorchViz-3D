import type { ReactNode } from 'react';

export interface MathFormulaProps {
  formula: string;
  className?: string;
  ariaLabel?: string;
}

export interface EquationCalloutProps {
  formula: string;
  title?: string;
  badge?: string;
  explanation?: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export interface RenderMathOptions {
  displayMode?: boolean;
  throwOnError?: boolean;
  errorColor?: string;
}

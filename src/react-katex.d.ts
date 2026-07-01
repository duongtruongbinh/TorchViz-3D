declare module 'react-katex' {
  import type { ComponentType, ReactNode } from 'react';

  export type KatexProps = {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => ReactNode;
    settings?: Record<string, unknown>;
  };

  export const InlineMath: ComponentType<KatexProps>;
  export const BlockMath: ComponentType<KatexProps>;
}

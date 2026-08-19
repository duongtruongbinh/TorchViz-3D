import type { ReactNode } from 'react';
import { InlineMath } from '../../../learningMdxComponents';

export type MatrixSize = 'sm' | 'md' | 'lg';

export function getMatrixSizeClasses(size: MatrixSize = 'md'): string {
  return {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 sm:w-11 sm:h-11 text-xs sm:text-sm',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 text-sm sm:text-base font-semibold',
  }[size];
}

export function MatrixBracket({
  side,
  borderColor,
}: {
  side: 'left' | 'right';
  borderColor: string;
}) {
  if (side === 'left') {
    return (
      <div
        className="absolute left-0 top-0 bottom-0 w-2 border-l-2 border-t-2 border-b-2 rounded-l-xs pointer-events-none"
        style={{ borderColor }}
        aria-hidden="true"
      />
    );
  }
  return (
    <div
      className="absolute right-0 top-0 bottom-0 w-2 border-r-2 border-t-2 border-b-2 rounded-r-xs pointer-events-none"
      style={{ borderColor }}
      aria-hidden="true"
    />
  );
}

export function MatrixNameLabel({
  name,
  color,
}: {
  name: string | ReactNode;
  color?: string;
}) {
  return (
    <div
      className="text-sm sm:text-base font-bold italic"
      style={color ? { color } : undefined}
    >
      {typeof name === 'string' ? (
        name.startsWith('\\') ? (
          <InlineMath formula={name} />
        ) : (
          `${name} =`
        )
      ) : (
        name
      )}
    </div>
  );
}

import type { ReactNode } from 'react';

export interface MatrixEquationRowProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function MatrixEquationRow({
  children,
  className = '',
  ariaLabel = 'Phương trình ma trận',
}: MatrixEquationRowProps) {
  return (
    <div
      className={`w-full overflow-x-auto py-2 flex items-center justify-start sm:justify-center ${className}`}
      aria-label={ariaLabel}
      role="region"
    >
      <div className="inline-flex items-center gap-2 sm:gap-4 min-w-max px-1">
        {children}
      </div>
    </div>
  );
}

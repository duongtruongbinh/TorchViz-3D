import type { ReactNode } from 'react';
import { InlineMath, useLearningMdxTheme } from '../../../learningMdxComponents';
import { cx } from '../../../theme';

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

export function MatrixFrame({
  children,
  bracketColor,
  className = '',
}: {
  children: ReactNode;
  bracketColor: string;
  className?: string;
}) {
  return (
    <div className={cx('relative inline-flex items-center px-1.5 py-1', className)}>
      <MatrixBracket side="left" borderColor={bracketColor} />
      {children}
      <MatrixBracket side="right" borderColor={bracketColor} />
    </div>
  );
}

export function MatrixDivider({
  cols,
  dividerCol,
}: {
  cols: number;
  dividerCol: number;
}) {
  const themeClasses = useLearningMdxTheme();
  return (
    <div
      className="absolute top-1 bottom-1 w-0.5 pointer-events-none rounded-full"
      style={{
        left: `calc(${((dividerCol + 1) / cols) * 100}% - 0.25px)`,
        backgroundColor: themeClasses.isLight ? '#0284c7' : '#38bdf8',
      }}
      aria-hidden="true"
    />
  );
}

export function getMatrixCellClasses(isLight: boolean): string {
  return isLight
    ? 'bg-white border-slate-200 text-slate-800'
    : 'bg-slate-800/80 border-slate-700 text-slate-100';
}

export interface MatrixCellProps {
  value: number | string;
  row: number;
  col: number;
  sizeClasses: string;
  className: string;
  onClick?: (row: number, col: number) => void;
  showIndices?: boolean;
  indexTextColor?: string;
  ariaLabel?: string;
}

export function MatrixCell({
  value,
  row,
  col,
  sizeClasses,
  className,
  onClick,
  showIndices = false,
  indexTextColor,
  ariaLabel,
}: MatrixCellProps) {
  const themeClasses = useLearningMdxTheme();
  const content = (
    <>
      <span className="font-mono">{value}</span>
      {showIndices && (
        <span
          className="text-[10px] opacity-70 font-mono -mt-0.5"
          style={indexTextColor ? { color: indexTextColor } : undefined}
        >
          <InlineMath formula={`a_{${row + 1}${col + 1}}`} />
        </span>
      )}
    </>
  );

  const baseClasses = cx(
    'border rounded-md transition-all flex flex-col items-center justify-center',
    sizeClasses,
    onClick && cx('cursor-pointer hover:ring-2 hover:ring-blue-400/60', themeClasses.focusRing),
    className,
  );

  const defaultAriaLabel = showIndices
    ? `Row ${row + 1}, Column ${col + 1}: ${value}`
    : `Cell (${row + 1}, ${col + 1}): ${value}`;

  if (onClick) {
    return (
      <button
        type="button"
        key={`cell-${row}-${col}`}
        onClick={() => onClick(row, col)}
        className={baseClasses}
        aria-label={ariaLabel ?? defaultAriaLabel}
      >
        {content}
      </button>
    );
  }

  return (
    <div
      key={`cell-${row}-${col}`}
      className={baseClasses}
      aria-label={ariaLabel ?? (showIndices ? defaultAriaLabel : undefined)}
    >
      {content}
    </div>
  );
}

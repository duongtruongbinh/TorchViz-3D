import type { ReactNode } from 'react';
import { InlineMath, useLearningMdxTheme } from '../../../learningMdxComponents';
import { getMathVisualTheme } from '../theme';
import { MatrixBracket, MatrixNameLabel, getMatrixSizeClasses } from './matrixPrimitives';

export interface MatrixGridProps {
  name?: string | ReactNode;
  values: (number | string)[][];
  highlightRow?: number;
  highlightCol?: number;
  highlightCell?: [number, number];
  highlightIndices?: [number, number][];
  highlightMode?: 'all' | 'none';
  onCellClick?: (row: number, col: number) => void;
  showIndices?: boolean;
  cellClassName?: (row: number, col: number) => string;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

export function MatrixGrid({
  name,
  values,
  highlightRow,
  highlightCol,
  highlightCell,
  highlightIndices,
  highlightMode,
  onCellClick,
  showIndices = false,
  cellClassName,
  size = 'md',
  ariaLabel,
}: MatrixGridProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  const sizeClasses = getMatrixSizeClasses(size);

  return (
    <div
      className="inline-flex items-center gap-2 select-none"
      aria-label={ariaLabel}
    >
      {name && <MatrixNameLabel name={name} color={theme.matrixCellText} />}

      {/* Matrix brackets container */}
      <div className="relative inline-flex items-center px-1.5 py-1">
        <MatrixBracket side="left" borderColor={theme.matrixBracket} />

        {/* Matrix Grid */}
        <div
          className="grid gap-1.5 p-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {values.map((rowVals, r) =>
            rowVals.map((val, c) => {
              const isRowMatch = highlightRow === r;
              const isColMatch = highlightCol === c;
              const isCellMatch =
                (highlightCell &&
                  highlightCell[0] === r &&
                  highlightCell[1] === c) ||
                (highlightIndices &&
                  highlightIndices.some(
                    ([hr, hc]) => hr === r && hc === c,
                  ));
              const isAllMatch = highlightMode === 'all';

              let cellStyle = `border rounded-md transition-all flex flex-col items-center justify-center ${sizeClasses} `;

              if (isCellMatch) {
                cellStyle += theme.matrixHighlightCell + ' scale-105 shadow-sm ';
              } else if (isRowMatch && isColMatch) {
                cellStyle += theme.matrixHighlightCell + ' ';
              } else if (isRowMatch) {
                cellStyle += theme.matrixHighlightRow + ' ';
              } else if (isColMatch) {
                cellStyle += theme.matrixHighlightCol + ' ';
              } else if (isAllMatch) {
                cellStyle += themeClasses.isLight
                  ? 'bg-blue-50 border-blue-300 text-blue-900 '
                  : 'bg-blue-950/50 border-blue-700 text-blue-100 ';
              } else {
                cellStyle += `${
                  themeClasses.isLight
                    ? 'bg-white border-slate-200 text-slate-800'
                    : 'bg-slate-800/80 border-slate-700 text-slate-100'
                } `;
              }

              if (onCellClick) {
                cellStyle +=
                  'cursor-pointer hover:ring-2 hover:ring-blue-400 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ';
              }

              if (cellClassName) {
                cellStyle += cellClassName(r, c) + ' ';
              }

              const cellContent = (
                <>
                  <span className="font-mono">{val}</span>
                  {showIndices && (
                    <span
                      className="text-[10px] opacity-70 font-mono -mt-0.5"
                      style={{ color: theme.matrixCellText }}
                    >
                      <InlineMath formula={`a_{${r + 1}${c + 1}}`} />
                    </span>
                  )}
                </>
              );

              if (onCellClick) {
                return (
                  <button
                    type="button"
                    key={`cell-${r}-${c}`}
                    onClick={() => onCellClick(r, c)}
                    className={cellStyle}
                    aria-label={
                      showIndices
                        ? `Row ${r + 1}, Column ${c + 1}: ${val}`
                        : `Cell (${r + 1}, ${c + 1}): ${val}`
                    }
                  >
                    {cellContent}
                  </button>
                );
              }

              return (
                <div
                  key={`cell-${r}-${c}`}
                  className={cellStyle}
                  aria-label={
                    showIndices
                      ? `Row ${r + 1}, Column ${c + 1}: ${val}`
                      : undefined
                  }
                >
                  {cellContent}
                </div>
              );
            }),
          )}
        </div>

        <MatrixBracket side="right" borderColor={theme.matrixBracket} />
      </div>
    </div>
  );
}

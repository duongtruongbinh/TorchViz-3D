import type { ReactNode } from 'react';
import { InlineMath, useLearningMdxTheme } from '../../../learningMdxComponents';
import { cx } from '../../../theme';
import { getMathVisualTheme } from '../theme';
import { MatrixCell, MatrixDivider, MatrixFrame, MatrixNameLabel, getMatrixCellClasses, getMatrixSizeClasses } from './matrixPrimitives';

export interface AugmentedMatrixGridProps {
  name?: string | ReactNode;
  rightBlockName?: string | ReactNode;
  values: (number | string)[][];
  dividerCol?: number; // 0-indexed column index after which the vertical augmented bar appears
  pivotCell?: [number, number]; // [row, col] to highlight as active pivot
  activeRow?: number; // 0-indexed row undergoing an elementary operation
  activeRows?: number[]; // multiple rows undergoing operations
  highlightCols?: number[];
  highlightCells?: [number, number][];
  highlightRightBlock?: boolean;
  onCellClick?: (row: number, col: number) => void;
  size?: 'sm' | 'md' | 'lg';
  ariaLabel?: string;
}

export function AugmentedMatrixGrid({
  name,
  rightBlockName,
  values,
  dividerCol,
  pivotCell,
  activeRow,
  activeRows,
  highlightCols,
  highlightCells,
  highlightRightBlock = false,
  onCellClick,
  size = 'md',
  ariaLabel,
}: AugmentedMatrixGridProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  const sizeClasses = getMatrixSizeClasses(size);

  const hasDivider = typeof dividerCol === 'number' && dividerCol >= 0 && dividerCol < cols - 1;

  const isRowActive = (r: number) => {
    if (activeRow === r) return true;
    if (activeRows && activeRows.includes(r)) return true;
    return false;
  };

  const isColHighlighted = (c: number) => {
    if (highlightCols && highlightCols.includes(c)) return true;
    return false;
  };

  const isCellPivot = (r: number, c: number) => {
    return pivotCell && pivotCell[0] === r && pivotCell[1] === c;
  };

  const isCellCustomHighlight = (r: number, c: number) => {
    return highlightCells && highlightCells.some(([hr, hc]) => hr === r && hc === c);
  };

  return (
    <div
      className="inline-flex flex-col items-center gap-1.5 select-none"
      aria-label={ariaLabel}
    >
      {rightBlockName && (
        <div className="w-full flex justify-end pr-4">
          <span className="text-xs font-bold text-emerald-600">
            {typeof rightBlockName === 'string' ? (
              <InlineMath formula={rightBlockName} />
            ) : (
              rightBlockName
            )}
          </span>
        </div>
      )}

      <div className="inline-flex items-center gap-2 sm:gap-3">
        {name && <MatrixNameLabel name={name} color={theme.matrixCellText} />}

        <MatrixFrame bracketColor={theme.matrixBracket}>
          <div
            className="relative grid gap-1.5 p-1 items-center"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            }}
          >
            {values.map((rowVals, r) =>
              rowVals.map((val, c) => {
                const rowActive = isRowActive(r);
                const colHighlight = isColHighlighted(c);
                const isPivot = isCellPivot(r, c);
                const isCustom = isCellCustomHighlight(r, c);
                const isRightBlockCol = hasDivider && c > (dividerCol ?? 0);

                let cellStyle = '';
                if (isPivot) {
                  cellStyle = cx(theme.matrixPivotCell, 'ring-2 ring-amber-400 shadow-sm scale-105 font-bold');
                } else if (isCustom) {
                  cellStyle = cx(theme.matrixHighlightCell, 'scale-105 shadow-sm');
                } else if (rowActive) {
                  cellStyle = theme.matrixActiveRow;
                } else if (colHighlight) {
                  cellStyle = theme.matrixHighlightCol;
                } else if (highlightRightBlock && isRightBlockCol) {
                  cellStyle = themeClasses.isLight
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-emerald-950/40 border-emerald-700 text-emerald-100';
                } else {
                  cellStyle = getMatrixCellClasses(themeClasses.isLight);
                }

                return (
                  <MatrixCell
                    key={`aug-cell-${r}-${c}`}
                    value={val}
                    row={r}
                    col={c}
                    sizeClasses={sizeClasses}
                    className={cellStyle}
                    onClick={onCellClick}
                  />
                );
              }),
            )}

            {/* Continuous vertical divider line */}
            {hasDivider && dividerCol !== undefined && (
              <MatrixDivider cols={cols} dividerCol={dividerCol} />
            )}
          </div>
        </MatrixFrame>
      </div>
    </div>
  );
}

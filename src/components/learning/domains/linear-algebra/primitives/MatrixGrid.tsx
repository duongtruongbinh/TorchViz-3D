import type { ReactNode } from 'react';
import { useLearningMdxTheme } from '../../../learningMdxComponents';
import { cx } from '../../../theme';
import { getMathVisualTheme } from '../theme';
import { MatrixCell, MatrixFrame, MatrixNameLabel, getMatrixCellClasses, getMatrixSizeClasses } from './matrixPrimitives';

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

      <MatrixFrame bracketColor={theme.matrixBracket}>
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

              let cellStyle = '';
              if (isCellMatch) {
                cellStyle = cx(theme.matrixHighlightCell, 'scale-105 shadow-sm');
              } else if (isRowMatch && isColMatch) {
                cellStyle = theme.matrixHighlightCell;
              } else if (isRowMatch) {
                cellStyle = theme.matrixHighlightRow;
              } else if (isColMatch) {
                cellStyle = theme.matrixHighlightCol;
              } else if (isAllMatch) {
                cellStyle = themeClasses.isLight
                  ? 'bg-blue-50 border-blue-300 text-blue-900'
                  : 'bg-blue-950/50 border-blue-700 text-blue-100';
              } else {
                cellStyle = getMatrixCellClasses(themeClasses.isLight);
              }

              if (cellClassName) {
                cellStyle = cx(cellStyle, cellClassName(r, c));
              }

              return (
                <MatrixCell
                  key={`cell-${r}-${c}`}
                  value={val}
                  row={r}
                  col={c}
                  sizeClasses={sizeClasses}
                  className={cellStyle}
                  onClick={onCellClick}
                  showIndices={showIndices}
                  indexTextColor={theme.matrixCellText}
                />
              );
            }),
          )}
        </div>
      </MatrixFrame>
    </div>
  );
}

import { InlineMath, useLearningMdxTheme } from '../../../learningMdxComponents';
import { getMathVisualTheme } from '../theme';

export interface MatrixGridProps {
  name?: string;
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
}: MatrixGridProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const rows = values.length;
  const cols = values[0]?.length ?? 0;

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
  }[size];

  return (
    <div className="inline-flex items-center gap-2 select-none">
      {name && (
        <span
          className="text-base font-bold italic"
          style={{ color: theme.matrixCellText }}
        >
          {name} =
        </span>
      )}

      {/* Matrix brackets container */}
      <div className="relative inline-flex items-center px-1.5 py-1">
        {/* Left bracket */}
        <div
          className="absolute left-0 top-0 bottom-0 w-2 border-l-2 border-t-2 border-b-2 rounded-l-xs"
          style={{ borderColor: theme.matrixBracket }}
        />

        {/* Matrix Grid */}
        <div
          className="grid gap-1.5 p-1"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
          role="grid"
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
                  'cursor-pointer hover:ring-2 hover:ring-blue-400 focus:outline-none ';
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
                    role="gridcell"
                    aria-label={
                      showIndices
                        ? `Row ${r + 1}, Column ${c + 1}: ${val}`
                        : undefined
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
                  role="gridcell"
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

        {/* Right bracket */}
        <div
          className="absolute right-0 top-0 bottom-0 w-2 border-r-2 border-t-2 border-b-2 rounded-r-xs"
          style={{ borderColor: theme.matrixBracket }}
        />
      </div>
    </div>
  );
}

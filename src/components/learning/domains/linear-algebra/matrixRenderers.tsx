import { useState } from 'react';
import { InlineMath } from '../../learningMdxComponents';
import { MatrixGrid } from './primitives/MatrixGrid';
import type {
  MatrixExplorerProps,
  MatrixTransposeExplorerProps,
  ProductOverviewProps,
  HadamardProductGridProps,
  OuterProductExplorerProps,
  MatrixVectorProductExplorerProps,
  MatrixProductExplorerProps,
} from './types';

// 18. MatrixExplorer
export function MatrixExplorer({
  ariaLabel,
  values = [
    [1, 2, 3],
    [4, 5, 6],
  ],
  highlight = 'indices',
}: MatrixExplorerProps) {
  const rows = values.length;
  const cols = values[0]?.length ?? 0;

  // If highlight is 'indices', dynamically pick indices if present
  const highlightIndices: [number, number][] | undefined =
    highlight === 'indices'
      ? [
          [0, Math.min(1, cols - 1)],
          [Math.min(1, rows - 1), Math.min(2, cols - 1)],
        ]
      : undefined;

  const sample1 = highlightIndices ? values[highlightIndices[0][0]][highlightIndices[0][1]] : null;
  const sample2 = highlightIndices ? values[highlightIndices[1][0]][highlightIndices[1][1]] : null;

  return (
    <figure
      className="my-6 flex flex-col items-center gap-3 rounded-xl border p-4 sm:p-5 shadow-xs border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <div className="w-full overflow-x-auto flex justify-center py-1">
        <MatrixGrid
          name="A"
          values={values}
          highlightIndices={highlightIndices}
          highlightMode={highlight === 'all' ? 'all' : 'none'}
          showIndices
          size="lg"
        />
      </div>

      {highlight === 'indices' && highlightIndices && (
        <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs font-mono border-t pt-3 w-full border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-emerald-500" />
            <span>
              <InlineMath
                formula={`a_{${highlightIndices[0][0] + 1}${highlightIndices[0][1] + 1}} = ${sample1}`}
              />{' '}
              (Hàng {highlightIndices[0][0] + 1}, Cột {highlightIndices[0][1] + 1})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-emerald-500" />
            <span>
              <InlineMath
                formula={`a_{${highlightIndices[1][0] + 1}${highlightIndices[1][1] + 1}} = ${sample2}`}
              />{' '}
              (Hàng {highlightIndices[1][0] + 1}, Cột {highlightIndices[1][1] + 1})
            </span>
          </div>
        </div>
      )}
      <p className="text-xs text-slate-500 text-center">
        Quy ước chỉ số ma trận: <InlineMath formula="a_{ij}" /> với <InlineMath formula="i" /> là hàng trước và <InlineMath formula="j" /> là cột sau.
      </p>
    </figure>
  );
}

// 19. MatrixTransposeExplorer
export function MatrixTransposeExplorer({
  ariaLabel,
  values = [
    [1, 2, 3],
    [4, 5, 6],
  ],
}: MatrixTransposeExplorerProps) {
  const [activeRow, setActiveRow] = useState<number | null>(0);

  // Compute transpose
  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  const transposeValues: number[][] = [];
  for (let c = 0; c < cols; c++) {
    const newRow: number[] = [];
    for (let r = 0; r < rows; r++) {
      newRow.push(values[r][c]);
    }
    transposeValues.push(newRow);
  }

  return (
    <figure
      className="my-6 flex flex-col items-center gap-4 rounded-xl border p-4 sm:p-5 shadow-xs border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <div className="w-full overflow-x-auto flex items-center justify-center gap-4 sm:gap-8 py-2">
        {/* Matrix A */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-slate-500">
            Ma trận gốc <InlineMath formula={`A \\; (${rows}\\times ${cols})`} />
          </span>
          <MatrixGrid
            name="A"
            values={values}
            highlightRow={activeRow !== null ? activeRow : undefined}
            onCellClick={(r) => setActiveRow(r)}
            size="md"
          />
        </div>

        <span className="text-xl font-bold text-slate-400">→</span>

        {/* Matrix A^T */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-slate-500">
            Chuyển vị <InlineMath formula={`A^\\top \\; (${cols}\\times ${rows})`} />
          </span>
          <MatrixGrid
            name="Aᵀ"
            values={transposeValues}
            highlightCol={activeRow !== null ? activeRow : undefined}
            onCellClick={(_, c) => setActiveRow(c)}
            size="md"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs border-t pt-3 w-full justify-center border-slate-200 dark:border-slate-800">
        <span className="text-slate-500">Chọn hàng để xem ánh xạ:</span>
        {Array.from({ length: rows }, (_, rIdx) => (
          <button
            key={`row-btn-${rIdx}`}
            type="button"
            onClick={() => setActiveRow(rIdx)}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${
              activeRow === rIdx
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Hàng {rIdx + 1} của A → Cột {rIdx + 1} của Aᵀ
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 text-center font-mono">
        <InlineMath formula="(A^\top)_{ij} = a_{ji}" />: Kích thước biến đổi từ <InlineMath formula={`${rows}\\times ${cols}`} /> thành <InlineMath formula={`${cols}\\times ${rows}`} />.
      </p>
    </figure>
  );
}

// 20. ProductOverview
export function ProductOverview({ ariaLabel }: ProductOverviewProps) {
  return (
    <div
      className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">
        3 loại phép nhân quan trọng trong Đại số Tuyến tính & Deep Learning
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Hadamard */}
        <div className="p-3.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                1. Hadamard Product
              </span>
              <span className="text-xs font-mono font-bold bg-blue-100 dark:bg-blue-950/60 px-1.5 py-0.5 rounded text-blue-800 dark:text-blue-300">
                <InlineMath formula="A \odot B" />
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
              Nhân từng phần tử tương ứng cùng vị trí (i, j).
            </p>
          </div>
          <div className="text-[11px] font-mono p-2 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            <InlineMath formula="(m\times n) \odot (m\times n) \to (m\times n)" />
          </div>
        </div>

        {/* Outer Product */}
        <div className="p-3.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                2. Outer Product
              </span>
              <span className="text-xs font-mono font-bold bg-purple-100 dark:bg-purple-950/60 px-1.5 py-0.5 rounded text-purple-800 dark:text-purple-300">
                <InlineMath formula="\mathbf{u}\mathbf{v}^\top" />
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
              Tích ngoài giữa vector cột <InlineMath formula="\mathbf{u}" /> và vector hàng <InlineMath formula="\mathbf{v}^\top" /> tạo ma trận <InlineMath formula="m\times n" />.
            </p>
          </div>
          <div className="text-[11px] font-mono p-2 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            <InlineMath formula="(m\times 1) \times (1\times n) \to (m\times n)" />
          </div>
        </div>

        {/* Matrix Product */}
        <div className="p-3.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-800/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                3. Matrix Product
              </span>
              <span className="text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-800 dark:text-emerald-300">
                <InlineMath formula="AB" />
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
              Tích vô hướng giữa hàng <InlineMath formula="i" /> của A và cột <InlineMath formula="j" /> của B: <InlineMath formula="c_{ij} = \mathbf{a}_i^\top \mathbf{b}_j" />.
            </p>
          </div>
          <div className="text-[11px] font-mono p-2 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
            <InlineMath formula="(m\times k) \times (k\times n) \to (m\times n)" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 21. HadamardProductGrid
export function HadamardProductGrid({ ariaLabel }: HadamardProductGridProps) {
  const [selectedCell, setSelectedCell] = useState<[number, number]>([0, 1]);

  const matA = [
    [1, 2],
    [3, 4],
  ];
  const matB = [
    [5, 6],
    [7, 8],
  ];
  const matC = [
    [1 * 5, 2 * 6],
    [3 * 7, 4 * 8],
  ];

  const r = selectedCell[0];
  const c = selectedCell[1];
  const valA = matA[r][c];
  const valB = matB[r][c];
  const valC = matC[r][c];

  return (
    <figure
      className="my-6 flex flex-col items-center gap-4 rounded-xl border p-4 sm:p-5 shadow-sm border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <div className="w-full overflow-x-auto flex items-center justify-center gap-3 sm:gap-5 py-2">
        <MatrixGrid
          name="A"
          values={matA}
          highlightCell={selectedCell}
          onCellClick={(nr, nc) => setSelectedCell([nr, nc])}
          size="md"
        />

        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
          ⊙
        </span>

        <MatrixGrid
          name="B"
          values={matB}
          highlightCell={selectedCell}
          onCellClick={(nr, nc) => setSelectedCell([nr, nc])}
          size="md"
        />

        <span className="text-xl font-bold text-slate-400">=</span>

        <MatrixGrid
          name="C"
          values={matC}
          highlightCell={selectedCell}
          onCellClick={(nr, nc) => setSelectedCell([nr, nc])}
          size="md"
        />
      </div>

      <div className="border-t pt-3 w-full text-center border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono">
        Phần tử ({r + 1}, {c + 1}):{' '}
        <span className="font-bold text-blue-600 dark:text-blue-400">
          <InlineMath
            formula={`c_{${r + 1}${c + 1}} = a_{${r + 1}${c + 1}} \\times b_{${r + 1}${c + 1}} = ${valA} \\times ${valB} = ${valC}`}
          />
        </span>
      </div>
      <p className="text-xs text-slate-500 text-center">
        Nhấn vào bất kỳ ô nào để xem phép nhân từng phần tử tương ứng.
      </p>
    </figure>
  );
}

// 22. OuterProductExplorer
export function OuterProductExplorer({ ariaLabel }: OuterProductExplorerProps) {
  const [activeCell, setActiveCell] = useState<[number, number]>([0, 1]);

  const u = [1, 2];
  const v = [3, 4, 5];

  const outerMatrix = [
    [u[0] * v[0], u[0] * v[1], u[0] * v[2]],
    [u[1] * v[0], u[1] * v[1], u[1] * v[2]],
  ];

  const r = activeCell[0];
  const c = activeCell[1];

  return (
    <figure
      className="my-6 flex flex-col items-center gap-4 rounded-xl border p-4 sm:p-5 shadow-sm border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <div className="w-full overflow-x-auto flex items-center justify-center gap-3 sm:gap-6 py-2">
        {/* Column vector u (2x1) */}
        <MatrixGrid
          name="u"
          values={[[u[0]], [u[1]]]}
          highlightRow={r}
          onCellClick={(nr) => setActiveCell([nr, c])}
          size="md"
        />

        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
          ×
        </span>

        {/* Row vector v^T (1x3) */}
        <MatrixGrid
          name="vᵀ"
          values={[[v[0], v[1], v[2]]]}
          highlightCol={c}
          onCellClick={(_, nc) => setActiveCell([r, nc])}
          size="md"
        />

        <span className="text-xl font-bold text-slate-400">=</span>

        {/* Outer product matrix (2x3) */}
        <MatrixGrid
          name="uvᵀ"
          values={outerMatrix}
          highlightCell={activeCell}
          onCellClick={(nr, nc) => setActiveCell([nr, nc])}
          size="md"
        />
      </div>

      <div className="border-t pt-3 w-full text-center border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono">
        Ô ({r + 1}, {c + 1}):{' '}
        <span className="font-bold text-purple-600 dark:text-purple-400">
          <InlineMath
            formula={`(\\mathbf{u}\\mathbf{v}^\\top)_{${r + 1}${c + 1}} = u_{${r + 1}} \\times v_{${c + 1}} = ${u[r]} \\times ${v[c]} = ${outerMatrix[r][c]}`}
          />
        </span>
      </div>
      <p className="text-xs text-slate-500 text-center">
        Mỗi phần tử ở vị trí (i, j) của <InlineMath formula="\mathbf{u}\mathbf{v}^\top" /> bằng tích giữa phần tử thứ i của <InlineMath formula="\mathbf{u}" /> và phần tử thứ j của <InlineMath formula="\mathbf{v}" />.
      </p>
    </figure>
  );
}

// 23. MatrixVectorProductExplorer
export function MatrixVectorProductExplorer({
  ariaLabel,
  interactive = true,
}: MatrixVectorProductExplorerProps) {
  const [selectedRow, setSelectedRow] = useState<number>(0);

  const matA = [
    [1, 2, 3],
    [4, 5, 6],
  ];
  const vecX = [[1], [0], [2]];
  const vecY = [
    [1 * 1 + 2 * 0 + 3 * 2],
    [4 * 1 + 5 * 0 + 6 * 2],
  ]; // [7, 16]

  const r = selectedRow;
  const aRow = matA[r];
  const calcString = `${aRow[0]}×${vecX[0][0]} + ${aRow[1]}×${vecX[1][0]} + ${aRow[2]}×${vecX[2][0]}`;

  return (
    <figure
      className="my-6 flex flex-col items-center gap-4 rounded-xl border p-4 sm:p-5 shadow-xs border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <div className="w-full overflow-x-auto flex items-center justify-center gap-3 sm:gap-6 py-2">
        <MatrixGrid
          name="A"
          values={matA}
          highlightRow={selectedRow}
          onCellClick={interactive ? (nr) => setSelectedRow(nr) : undefined}
          size="md"
        />

        <span className="text-lg font-bold text-slate-400">×</span>

        <MatrixGrid name="x" values={vecX} highlightCol={0} size="md" />

        <span className="text-lg font-bold text-slate-400">=</span>

        <MatrixGrid
          name="Ax"
          values={vecY}
          highlightRow={selectedRow}
          onCellClick={interactive ? (nr) => setSelectedRow(nr) : undefined}
          size="md"
        />
      </div>

      <div className="border-t pt-3 w-full text-center border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono">
        Hàng {r + 1}:{' '}
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          <InlineMath
            formula={`(A\\mathbf{x})_{${r + 1}} = ${calcString} = ${vecY[r][0]}`}
          />
        </span>
      </div>

      {interactive && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedRow(0)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${
              selectedRow === 0
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Tính hàng 1: <InlineMath formula="(A\mathbf{x})_1" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedRow(1)}
            className={`px-3 py-1 rounded text-xs font-semibold transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${
              selectedRow === 1
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Tính hàng 2: <InlineMath formula="(A\mathbf{x})_2" />
          </button>
        </div>
      )}
    </figure>
  );
}

// 24. MatrixProductExplorer
export function MatrixProductExplorer({
  ariaLabel,
  interactive = true,
}: MatrixProductExplorerProps) {
  const [selectedCell, setSelectedCell] = useState<[number, number]>([0, 0]);

  const matA = [
    [1, 2],
    [3, 4],
  ];
  const matB = [
    [5, 6],
    [7, 8],
  ];
  const matC = [
    [1 * 5 + 2 * 7, 1 * 6 + 2 * 8],
    [3 * 5 + 4 * 7, 3 * 6 + 4 * 8],
  ]; // [[19, 22], [43, 50]]

  const r = selectedCell[0];
  const c = selectedCell[1];

  return (
    <figure
      className="my-6 flex flex-col items-center gap-4 rounded-xl border p-4 sm:p-5 shadow-xs border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <div className="w-full overflow-x-auto flex items-center justify-center gap-3 sm:gap-6 py-2">
        <MatrixGrid
          name="A"
          values={matA}
          highlightRow={r}
          onCellClick={interactive ? (nr) => setSelectedCell([nr, c]) : undefined}
          size="md"
        />

        <span className="text-lg font-bold text-slate-400">×</span>

        <MatrixGrid
          name="B"
          values={matB}
          highlightCol={c}
          onCellClick={interactive ? (_, nc) => setSelectedCell([r, nc]) : undefined}
          size="md"
        />

        <span className="text-lg font-bold text-slate-400">=</span>

        <MatrixGrid
          name="C"
          values={matC}
          highlightCell={selectedCell}
          onCellClick={interactive ? (nr, nc) => setSelectedCell([nr, nc]) : undefined}
          size="md"
        />
      </div>

      <div className="border-t pt-3 w-full text-center border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono">
        Ô <InlineMath formula={`C_{${r + 1}${c + 1}} =`} /> (Hàng {r + 1} của A) · (Cột {c + 1} của B):
        <div className="mt-1 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
          <InlineMath
            formula={`c_{${r + 1}${c + 1}} = (${matA[r][0]}\\times ${matB[0][c]}) + (${matA[r][1]}\\times ${matB[1][c]}) = ${matC[r][c]}`}
          />
        </div>
      </div>

      {interactive && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {([
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
          ] as [number, number][]).map(([cr, cc]) => (
            <button
              type="button"
              key={`btn-${cr}-${cc}`}
              onClick={() => setSelectedCell([cr, cc])}
              className={`px-2.5 py-1 rounded text-xs font-semibold font-mono transition-colors ${
                r === cr && c === cc
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <InlineMath formula={`C_{${cr + 1}${cc + 1}}`} /> ({matC[cr][cc]})
            </button>
          ))}
        </div>
      )}
      <p className="text-xs text-slate-500 text-center">
        Nhấn vào các ô của ma trận kết quả C để thấy tích vô hướng của hàng tương ứng trong A và cột tương ứng trong B.
      </p>
    </figure>
  );
}

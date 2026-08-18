import { useState } from 'react';
import { Vector, Point, Plot, Text, vec } from 'mafs';
import { Check } from 'lucide-react';
import { InlineMath, BlockMath, useLearningMdxTheme } from '../../learningMdxComponents';
import { getMathVisualTheme } from './theme';
import { MathPlane } from './primitives/MathPlane';
import { AugmentedMatrixGrid } from './primitives/AugmentedMatrixGrid';
import { MatrixGrid } from './primitives/MatrixGrid';
import { MathStepperControls } from './primitives/MathStepperControls';
import type {
  ColumnCombinationExplorerProps,
  LinearSystemCasesExplorerProps,
  GaussianEliminationStepperProps,
  LUFactorizationExplorerProps,
  GaussJordanInverseStepperProps,
  Vector2D,
} from './types';

// ==========================================
// 1. ColumnCombinationExplorer
// ==========================================
export function ColumnCombinationExplorer({
  ariaLabel,
  columns = [
    [1, 3],
    [2, -1],
  ],
  initialCoefficients = [1, 2],
  target = [5, 1],
  interactive = true,
}: ColumnCombinationExplorerProps) {
  const [c1, setC1] = useState(initialCoefficients[0]);
  const [c2, setC2] = useState(initialCoefficients[1]);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const col1: Vector2D = columns[0];
  const col2: Vector2D = columns[1];

  const scaledCol1 = vec.scale(col1, c1);
  const scaledCol2 = vec.scale(col2, c2);
  const resultant = vec.add(scaledCol1, scaledCol2);

  const isMatched =
    Math.abs(resultant[0] - target[0]) < 0.05 &&
    Math.abs(resultant[1] - target[1]) < 0.05;

  const minX = Math.min(-2, col1[0], col2[0], target[0] - 1, resultant[0] - 1);
  const maxX = Math.max(7, col1[0] + 1, col2[0] + 1, target[0] + 2, resultant[0] + 2);
  const minY = Math.min(-3, col1[1], col2[1], target[1] - 1, resultant[1] - 1);
  const maxY = Math.max(7, col1[1] + 1, col2[1] + 1, target[1] + 2, resultant[1] + 2);

  const belowPlot = (
    <div className="mt-3 flex flex-col gap-3 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-sans">Linear combination:</span>
          <span>
            <InlineMath
              formula={`${c1}\\begin{bmatrix}${col1[0]}\\\\${col1[1]}\\end{bmatrix} + ${c2}\\begin{bmatrix}${col2[0]}\\\\${col2[1]}\\end{bmatrix} = \\begin{bmatrix}${resultant[0]}\\\\${resultant[1]}\\end{bmatrix}`}
            />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-sans">Target b:</span>
          <span className="font-bold">
            <InlineMath formula={`\\begin{bmatrix}${target[0]}\\\\${target[1]}\\end{bmatrix}`} />
          </span>
          {isMatched ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
              <Check className="w-3.5 h-3.5" /> Ax = b
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Chưa trùng b
            </span>
          )}
        </div>
      </div>

      {interactive && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                Hệ số x₁: <span className="font-mono font-bold">{c1}</span>
              </span>
              <span className="text-slate-400">x₁a₁ = [{scaledCol1[0]}, {scaledCol1[1]}]ᵀ</span>
            </div>
            <input
              type="range"
              min="-2"
              max="4"
              step="1"
              value={c1}
              onChange={(e) => setC1(Number(e.target.value))}
              className="w-full accent-blue-600"
              aria-label="Hệ số x1 cho cột thứ nhất"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                Hệ số x₂: <span className="font-mono font-bold">{c2}</span>
              </span>
              <span className="text-slate-400">x₂a₂ = [{scaledCol2[0]}, {scaledCol2[1]}]ᵀ</span>
            </div>
            <input
              type="range"
              min="-2"
              max="4"
              step="1"
              value={c2}
              onChange={(e) => setC2(Number(e.target.value))}
              className="w-full accent-amber-600"
              aria-label="Hệ số x2 cho cột thứ hai"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={minX}
      maxX={maxX}
      minY={minY}
      maxY={maxY}
      belowPlot={belowPlot}
    >
      {/* Target point b */}
      <Point x={target[0]} y={target[1]} color="#ec4899" />
      <Text x={target[0]} y={target[1]} size={14} color="#ec4899" attach="ne">
        {`b(${target[0]}, ${target[1]})`}
      </Text>

      {/* Scaled first column x1*a1 */}
      {Math.abs(c1) > 0.05 && (
        <>
          <Vector tail={[0, 0]} tip={scaledCol1} color={theme.vectorU} weight={3} />
          <Text
            x={scaledCol1[0]}
            y={scaledCol1[1]}
            size={14}
            color={theme.vectorU}
            attach="nw"
          >
            {c1 === 1 ? 'a₁' : `${c1}a₁`}
          </Text>
        </>
      )}

      {/* Translated second column head-to-tail */}
      {Math.abs(c2) > 0.05 && (
        <>
          <Vector
            tail={scaledCol1}
            tip={resultant}
            color={theme.vectorV}
            style="dashed"
            weight={2.5}
          />
          <Text
            x={(scaledCol1[0] + resultant[0]) / 2}
            y={(scaledCol1[1] + resultant[1]) / 2}
            size={13}
            color={theme.vectorV}
            attach="se"
          >
            {c2 === 1 ? 'a₂' : `${c2}a₂`}
          </Text>
        </>
      )}

      {/* Resultant vector Ax */}
      <Vector
        tail={[0, 0]}
        tip={resultant}
        color={isMatched ? '#10b981' : theme.vectorW}
        weight={3.5}
      />
      <Text
        x={resultant[0]}
        y={resultant[1]}
        size={15}
        color={isMatched ? '#10b981' : theme.vectorW}
        attach="se"
      >
        Ax
      </Text>
    </MathPlane>
  );
}

// ==========================================
// 2. LinearSystemCasesExplorer
// ==========================================
export function LinearSystemCasesExplorer({
  ariaLabel,
}: LinearSystemCasesExplorerProps) {
  const [selectedCase, setSelectedCase] = useState<'unique' | 'none' | 'infinite'>('unique');
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const belowPlot = (
    <div className="mt-3 flex flex-col gap-3 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Trường hợp:</span>
          <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setSelectedCase('unique')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                selectedCase === 'unique'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              1 nghiệm duy nhất
            </button>
            <button
              type="button"
              onClick={() => setSelectedCase('none')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                selectedCase === 'none'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Vô nghiệm
            </button>
            <button
              type="button"
              onClick={() => setSelectedCase('infinite')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                selectedCase === 'infinite'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Vô số nghiệm
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-3 border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-800/40 text-xs sm:text-sm">
        {selectedCase === 'unique' && (
          <div className="space-y-1">
            <p className="font-semibold text-blue-600 dark:text-blue-400">
              Hai đường thẳng cắt nhau tại đúng một giao điểm:
            </p>
            <p className="text-slate-600 dark:text-slate-300 font-mono">
              Phương trình 1: <InlineMath formula="x + 2y = 5" /> (xanh dương)
            </p>
            <p className="text-slate-600 dark:text-slate-300 font-mono">
              Phương trình 2: <InlineMath formula="3x - y = 1" /> (vàng cam)
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              Giao điểm duy nhất tại (x = 1, y = 2) là nghiệm của hệ.
            </p>
          </div>
        )}

        {selectedCase === 'none' && (
          <div className="space-y-1">
            <p className="font-semibold text-rose-600 dark:text-rose-400">
              Hai đường thẳng song song và không có điểm chung:
            </p>
            <p className="text-slate-600 dark:text-slate-300 font-mono">
              Phương trình 1: <InlineMath formula="x + 2y = 4" /> (xanh dương)
            </p>
            <p className="text-slate-600 dark:text-slate-300 font-mono">
              Phương trình 2: <InlineMath formula="x + 2y = 1" /> (vàng cam)
            </p>
            <p className="text-rose-600 dark:text-rose-400 font-semibold pt-1">
              Hai vế trái giống nhau nhưng vế phải khác nhau tạo ra mâu thuẫn, hệ vô nghiệm.
            </p>
          </div>
        )}

        {selectedCase === 'infinite' && (
          <div className="space-y-1">
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              Hai phương trình cùng biểu diễn một đường thẳng trùng khớp:
            </p>
            <p className="text-slate-600 dark:text-slate-300 font-mono">
              Phương trình 1: <InlineMath formula="x + 2y = 4" />
            </p>
            <p className="text-slate-600 dark:text-slate-300 font-mono">
              Phương trình 2: <InlineMath formula="2x + 4y = 8" /> (gấp 2 lần phương trình 1)
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
              Mọi điểm nằm trên đường thẳng đều thỏa mãn cả hai phương trình, hệ có vô số nghiệm.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-2}
      maxX={6}
      minY={-2}
      maxY={5}
      belowPlot={belowPlot}
    >
      {selectedCase === 'unique' && (
        <>
          {/* Line 1: x + 2y = 5 => y = (5 - x) / 2 */}
          <Plot.OfX y={(x) => (5 - x) / 2} color={theme.vectorU} weight={2.5} />
          {/* Line 2: 3x - y = 1 => y = 3x - 1 */}
          <Plot.OfX y={(x) => 3 * x - 1} color={theme.vectorV} weight={2.5} />
          {/* Intersection point at (1, 2) */}
          <Point x={1} y={2} color="#10b981" />
          <Text x={1} y={2} size={15} color="#10b981" attach="ne">
            (1, 2)
          </Text>
        </>
      )}

      {selectedCase === 'none' && (
        <>
          {/* Line 1: x + 2y = 4 => y = (4 - x) / 2 */}
          <Plot.OfX y={(x) => (4 - x) / 2} color={theme.vectorU} weight={2.5} />
          {/* Line 2: x + 2y = 1 => y = (1 - x) / 2 */}
          <Plot.OfX y={(x) => (1 - x) / 2} color={theme.vectorV} weight={2.5} />
        </>
      )}

      {selectedCase === 'infinite' && (
        <>
          {/* Base solid line */}
          <Plot.OfX y={(x) => (4 - x) / 2} color={theme.vectorU} weight={4} />
          {/* Coincident overlay line styled with dashes */}
          <Plot.OfX
            y={(x) => (4 - x) / 2}
            color={theme.vectorV}
            style="dashed"
            weight={3}
          />
          <Text x={2} y={1} size={14} color={theme.vectorU} attach="ne">
            d₁ ≡ d₂
          </Text>
        </>
      )}
    </MathPlane>
  );
}

// ==========================================
// 3. GaussianEliminationStepper
// ==========================================
export function GaussianEliminationStepper({
  ariaLabel,
}: GaussianEliminationStepperProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      title: 'Ma trận bổ sung ban đầu',
      operation: '[A \\mid \\mathbf{b}] = \\left[\\begin{array}{ccc|c}1&1&1&6\\\\2&3&1&11\\\\1&-1&2&5\\end{array}\\right]',
      description: 'Hệ ban đầu gồm 3 phương trình 3 ẩn được ghi vào ma trận bổ sung. Ta chọn phần tử 1 ở hàng 1 cột 1 làm pivot đầu tiên.',
      values: [
        [1, 1, 1, 6],
        [2, 3, 1, 11],
        [1, -1, 2, 5],
      ],
      dividerCol: 2,
      pivotCell: [0, 0] as [number, number],
      activeRows: [0],
    },
    {
      title: 'Khử cột 1: R₂ ← R₂ - 2R₁, R₃ ← R₃ - R₁',
      operation: 'R_2 \\leftarrow R_2 - 2R_1,\\qquad R_3 \\leftarrow R_3 - R_1',
      description: 'Trừ 2 lần hàng 1 khỏi hàng 2, và trừ hàng 1 khỏi hàng 3 để đưa các hệ số dưới pivot cột 1 về 0. Pivot tiếp theo là phần tử 1 ở hàng 2 cột 2.',
      values: [
        [1, 1, 1, 6],
        [0, 1, -1, -1],
        [0, -2, 1, -1],
      ],
      dividerCol: 2,
      pivotCell: [1, 1] as [number, number],
      activeRows: [1, 2],
    },
    {
      title: 'Khử cột 2: R₃ ← R₃ + 2R₂',
      operation: 'R_3 \\leftarrow R_3 + 2R_2',
      description: 'Cộng 2 lần hàng 2 vào hàng 3 để khử hệ số -2 bên dưới pivot cột 2 về 0. Pivot cuối cùng là -1 ở hàng 3 cột 3.',
      values: [
        [1, 1, 1, 6],
        [0, 1, -1, -1],
        [0, 0, -1, -3],
      ],
      dividerCol: 2,
      pivotCell: [2, 2] as [number, number],
      activeRows: [2],
    },
    {
      title: 'Dạng hàng bậc thang & Back Substitution',
      operation: '\\begin{cases}x+y+z=6\\\\y-z=-1\\\\-z=-3\\end{cases}\\;\\Longrightarrow\\;\\begin{cases}z=3\\\\y=-1+3=2\\\\x=6-2-3=1\\end{cases}',
      description: 'Ma trận đã đạt dạng tam giác trên (hàng bậc thang). Giải ngược từ phương trình cuối lên trên thu được nghiệm duy nhất (x, y, z) = (1, 2, 3).',
      values: [
        [1, 1, 1, 6],
        [0, 1, -1, -1],
        [0, 0, -1, -3],
      ],
      dividerCol: 2,
      pivotCell: undefined,
      activeRows: [0, 1, 2],
    },
  ];

  const currentStep = steps[stepIndex];

  return (
    <figure
      className="my-6 flex flex-col items-center gap-4 rounded-xl border p-4 sm:p-5 shadow-sm border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <div className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
        <span>{currentStep.title}</span>
        <span className="font-mono text-slate-400">
          Bước {stepIndex + 1} / {steps.length}
        </span>
      </div>

      <div className="w-full overflow-x-auto flex justify-center py-2">
        <AugmentedMatrixGrid
          values={currentStep.values}
          dividerCol={currentStep.dividerCol}
          pivotCell={currentStep.pivotCell}
          activeRows={currentStep.activeRows}
          size="lg"
        />
      </div>

      <div className="w-full rounded-lg p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-xs sm:text-sm space-y-2">
        <div className="text-center font-mono">
          <BlockMath formula={currentStep.operation} />
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-center">
          {currentStep.description}
        </p>
      </div>

      {/* Step controls */}
      <MathStepperControls
        currentStep={stepIndex}
        totalSteps={steps.length}
        onStepChange={setStepIndex}
      />
    </figure>
  );
}

// ==========================================
// 4. LUFactorizationExplorer
// ==========================================
export function LUFactorizationExplorer({
  ariaLabel,
}: LUFactorizationExplorerProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'multipliers' | 'uResult' | 'verify'>('overview');

  const matrixA = [
    [1, 1, 1],
    [2, 3, 1],
    [1, -1, 2],
  ];

  const matrixL = [
    [1, 0, 0],
    [2, 1, 0],
    [1, -2, 1],
  ];

  const matrixU = [
    [1, 1, 1],
    [0, 1, -1],
    [0, 0, -1],
  ];

  return (
    <figure
      className="my-6 flex flex-col items-center gap-4 rounded-xl border p-4 sm:p-5 shadow-sm border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => setViewMode('overview')}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            viewMode === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Tổng quan A = LU
        </button>
        <button
          type="button"
          onClick={() => setViewMode('multipliers')}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            viewMode === 'multipliers'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Multipliers trong L
        </button>
        <button
          type="button"
          onClick={() => setViewMode('uResult')}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            viewMode === 'uResult'
              ? 'bg-purple-600 text-white'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Kết quả U
        </button>
        <button
          type="button"
          onClick={() => setViewMode('verify')}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
            viewMode === 'verify'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Kiểm tra LU = A
        </button>
      </div>

      {/* Matrices Display */}
      <div className="w-full overflow-x-auto flex items-center justify-center gap-3 sm:gap-6 py-2">
        {viewMode === 'overview' && (
          <>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Ma trận L (Lower)</span>
              <MatrixGrid name="L" values={matrixL} size="md" />
            </div>
            <span className="text-lg font-bold text-slate-400">×</span>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Ma trận U (Upper)</span>
              <MatrixGrid name="U" values={matrixU} size="md" />
            </div>
            <span className="text-lg font-bold text-slate-400">=</span>
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Ma trận gốc A</span>
              <MatrixGrid name="A" values={matrixA} size="md" />
            </div>
          </>
        )}

        {viewMode === 'multipliers' && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              L lưu các hệ số khử (multipliers) bên dưới đường chéo chính
            </span>
            <MatrixGrid
              name="L"
              values={matrixL}
              highlightIndices={[
                [1, 0],
                [2, 0],
                [2, 1],
              ]}
              size="lg"
            />
          </div>
        )}

        {viewMode === 'uResult' && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              U là ma trận tam giác trên thu được sau khi hoàn thành khử Gaussian
            </span>
            <MatrixGrid
              name="U"
              values={matrixU}
              highlightIndices={[
                [0, 0],
                [0, 1],
                [0, 2],
                [1, 1],
                [1, 2],
                [2, 2],
              ]}
              size="lg"
            />
          </div>
        )}

        {viewMode === 'verify' && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
              <MatrixGrid name="L" values={matrixL} size="sm" />
              <span className="text-sm font-bold text-slate-400">×</span>
              <MatrixGrid name="U" values={matrixU} size="sm" />
              <span className="text-sm font-bold text-slate-400">=</span>
              <MatrixGrid name="A" values={matrixA} size="sm" />
            </div>
          </div>
        )}
      </div>

      {/* Explanatory description card */}
      <div className="w-full rounded-lg p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-xs sm:text-sm">
        {viewMode === 'overview' && (
          <p className="text-slate-600 dark:text-slate-300 text-center">
            LU tách ma trận A thành tích của ma trận tam giác dưới L (với các số 1 trên đường chéo) và ma trận tam giác trên U.
          </p>
        )}
        {viewMode === 'multipliers' && (
          <div className="space-y-1 font-mono text-xs text-slate-700 dark:text-slate-300 text-center">
            <p>l₂₁ = 2 (từ R₂ ← R₂ - 2R₁)</p>
            <p>l₃₁ = 1 (từ R₃ ← R₃ - R₁)</p>
            <p>l₃₂ = -2 (từ R₃ ← R₃ - (-2)R₂ = R₃ + 2R₂)</p>
          </div>
        )}
        {viewMode === 'uResult' && (
          <p className="text-slate-600 dark:text-slate-300 text-center">
            Các phần tử nằm dưới đường chéo của U đều bằng 0. Hệ Ux = c có thể giải nhanh bằng back substitution.
          </p>
        )}
        {viewMode === 'verify' && (
          <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-center">
            Nhân từng hàng của L với từng cột của U cho lại đúng ma trận A ban đầu.
          </p>
        )}
      </div>
    </figure>
  );
}

// ==========================================
// 5. GaussJordanInverseStepper
// ==========================================
export function GaussJordanInverseStepper({
  ariaLabel,
}: GaussJordanInverseStepperProps) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    {
      title: 'Bắt đầu: Ghép A với ma trận đơn vị [A | I]',
      operation: '[A \\mid I] = \\left[\\begin{array}{cc|cc}1&2&1&0\\\\3&4&0&1\\end{array}\\right]',
      description: 'Ghép ma trận A (cỡ 2×2) với ma trận đơn vị I₂ ở bên phải dấu phân cách. Pivot đầu tiên là phần tử 1 ở hàng 1 cột 1.',
      values: [
        [1, 2, 1, 0],
        [3, 4, 0, 1],
      ],
      dividerCol: 1,
      pivotCell: [0, 0] as [number, number],
      activeRow: 0,
      highlightRightBlock: false,
    },
    {
      title: 'Bước 1: Khử dưới pivot đầu: R₂ ← R₂ - 3R₁',
      operation: 'R_2 \\leftarrow R_2 - 3R_1',
      description: 'Trừ 3 lần hàng 1 khỏi hàng 2 trên toàn bộ hàng mở rộng để tạo số 0 ở cột đầu tiên.',
      values: [
        [1, 2, 1, 0],
        [0, -2, -3, 1],
      ],
      dividerCol: 1,
      pivotCell: [1, 1] as [number, number],
      activeRow: 1,
      highlightRightBlock: false,
    },
    {
      title: 'Bước 2: Đưa pivot hàng 2 về 1: R₂ ← -R₂ / 2',
      operation: 'R_2 \\leftarrow -\\frac{1}{2}R_2',
      description: 'Nhân hàng 2 với -1/2 để biến pivot ở vị trí (2, 2) thành số 1.',
      values: [
        [1, 2, 1, 0],
        [0, 1, 1.5, -0.5],
      ],
      dividerCol: 1,
      pivotCell: [1, 1] as [number, number],
      activeRow: 1,
      highlightRightBlock: false,
    },
    {
      title: 'Bước 3: Khử phần tử phía trên: R₁ ← R₁ - 2R₂',
      operation: 'R_1 \\leftarrow R_1 - 2R_2\\;\\Longrightarrow\\;[I \\mid A^{-1}] = \\left[\\begin{array}{cc|cc}1&0&-2&1\\\\0&1&1.5&-0.5\\end{array}\\right]',
      description: 'Trừ 2 lần hàng 2 khỏi hàng 1. Vế trái trở thành ma trận đơn vị I, và vế phải chính là ma trận nghịch đảo A⁻¹.',
      values: [
        [1, 0, -2, 1],
        [0, 1, 1.5, -0.5],
      ],
      dividerCol: 1,
      pivotCell: undefined,
      activeRow: 0,
      highlightRightBlock: true,
    },
  ];

  const currentStep = steps[stepIndex];

  return (
    <figure
      className="my-6 flex flex-col items-center gap-4 rounded-xl border p-4 sm:p-5 shadow-xs border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <div className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
        <span>{currentStep.title}</span>
        <span className="font-mono text-slate-400">
          Bước {stepIndex + 1} / {steps.length}
        </span>
      </div>

      <div className="w-full overflow-x-auto flex justify-center py-2">
        <AugmentedMatrixGrid
          values={currentStep.values}
          dividerCol={currentStep.dividerCol}
          pivotCell={currentStep.pivotCell}
          activeRow={currentStep.activeRow}
          highlightRightBlock={currentStep.highlightRightBlock}
          rightBlockName={stepIndex === 3 ? 'A^{-1}' : undefined}
          size="lg"
        />
      </div>

      <div className="w-full rounded-lg p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-xs sm:text-sm space-y-2">
        <div className="text-center font-mono">
          <BlockMath formula={currentStep.operation} />
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-center">
          {currentStep.description}
        </p>
      </div>

      {/* Step Controls */}
      <MathStepperControls
        currentStep={stepIndex}
        totalSteps={steps.length}
        onStepChange={setStepIndex}
      />
    </figure>
  );
}

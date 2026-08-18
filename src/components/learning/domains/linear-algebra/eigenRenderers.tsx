import { useState } from 'react';
import { Vector, Line, Point, Text, vec } from 'mafs';
import { InlineMath, BlockMath, useLearningMdxTheme } from '../../learningMdxComponents';
import { getMathVisualTheme } from './theme';
import { MathCanvas } from './primitives/MathCanvas';
import { MathVisualCard } from './primitives/MathVisualCard';
import { MathSegmentedControl } from './primitives/MathSegmentedControl';
import { MatrixGrid } from './primitives/MatrixGrid';
import { MatrixEquationRow } from './primitives/MatrixEquationRow';
import type {
  TraceEigenvalueLinkProps,
  EigenvectorExplorerProps,
  DiagonalizationExplorerProps,
  PCAProjectionExplorerProps,
  Vector2D,
} from './types';

// ==========================================
// 12. TraceEigenvalueLink
// ==========================================
export function TraceEigenvalueLink({
  ariaLabel,
  interactive = true,
}: TraceEigenvalueLinkProps) {
  const [tab, setTab] = useState<'sum' | 'cyclic'>('sum');

  const matA = [
    [4, 1],
    [2, 3],
  ];
  const matB = [
    [1, 2],
    [3, 4],
  ];

  // A * B = [[4*1 + 1*3, 4*2 + 1*4], [2*1 + 3*3, 2*2 + 3*4]] = [[7, 12], [11, 16]] => tr(AB) = 7 + 16 = 23
  // B * A = [[1*4 + 2*2, 1*1 + 2*3], [3*4 + 4*2, 3*1 + 4*3]] = [[8, 7], [20, 15]] => tr(BA) = 8 + 15 = 23
  const matAB = [
    [7, 12],
    [11, 16],
  ];
  const matBA = [
    [8, 7],
    [20, 15],
  ];

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Vết của Ma trận và Liên hệ với Trị riêng (Trace & Eigenvalues)"
      subtitle="Vết (Trace) là tổng các phần tử trên đường chéo chính, và bất biến qua các phép đổi cơ sở."
      footer={
        <div className="space-y-3 w-full">
          {interactive && (
            <div className="flex justify-center">
              <MathSegmentedControl
                value={tab}
                onChange={setTab}
                ariaLabel="Chọn nội dung khảo sát Vết"
                options={[
                  { value: 'sum', label: 'tr(A) = Tổng các Trị riêng' },
                  { value: 'cyclic', label: 'Tính chất Chu kỳ: tr(AB) = tr(BA)' },
                ]}
              />
            </div>
          )}

          <div className="rounded-lg p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-xs sm:text-sm">
            {tab === 'sum' ? (
              <div className="space-y-1.5">
                <div className="text-center font-mono py-1">
                  <BlockMath formula="\operatorname{tr}(A) = a_{11} + a_{22} = 4 + 3 = 7 = \lambda_1 + \lambda_2 \; (5 + 2)" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-center">
                  Phương trình đặc trưng: <InlineMath formula="\det(A - \lambda I) = \lambda^2 - 7\lambda + 10 = 0 \implies \lambda_1 = 5, \lambda_2 = 2" />.
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-center text-xs pt-1">
                  Định lý: Tổng các phần tử đường chéo luôn luôn bằng tổng các trị riêng của ma trận!
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="text-center font-mono py-1">
                  <BlockMath formula="\operatorname{tr}(AB) = 7 + 16 = 23 \quad \equiv \quad \operatorname{tr}(BA) = 8 + 15 = 23" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-center">
                  Dù tích ma trận nói chung không có tính giao hoán (<InlineMath formula="AB \neq BA" />), vết của tích luôn bằng nhau theo tính chất chu kỳ: <InlineMath formula="\operatorname{tr}(AB) = \operatorname{tr}(BA)" />.
                </p>
              </div>
            )}
          </div>
        </div>
      }
    >
      <div className="py-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {tab === 'sum' ? (
          <MatrixGrid
            name="A"
            values={matA}
            highlightIndices={[
              [0, 0],
              [1, 1],
            ]}
            size="lg"
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <MatrixEquationRow ariaLabel="Hai ma trận A và B">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Ma trận A</span>
                <MatrixGrid name="A" values={matA} size="sm" />
              </div>
              <span className="text-sm font-bold text-slate-400 px-1">và</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Ma trận B</span>
                <MatrixGrid name="B" values={matB} size="sm" />
              </div>
            </MatrixEquationRow>

            <MatrixEquationRow ariaLabel="So sánh tích AB và BA">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Tích AB</span>
                <MatrixGrid
                  name="AB"
                  values={matAB}
                  highlightIndices={[
                    [0, 0],
                    [1, 1],
                  ]}
                  size="md"
                />
              </div>
              <span className="text-lg font-bold text-slate-400 px-2">và</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-slate-500">Tích BA</span>
                <MatrixGrid
                  name="BA"
                  values={matBA}
                  highlightIndices={[
                    [0, 0],
                    [1, 1],
                  ]}
                  size="md"
                />
              </div>
            </MatrixEquationRow>
          </div>
        )}
      </div>
    </MathVisualCard>
  );
}

// ==========================================
// 13. EigenvectorExplorer
// ==========================================
export function EigenvectorExplorer({
  ariaLabel,
  interactive = true,
}: EigenvectorExplorerProps) {
  const [selectedVec, setSelectedVec] = useState<'v1' | 'v2' | 'generic'>('v1');
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  // Matrix A = [[2, 1], [0, 3]]
  // Eigenvalue 1 = 2, Eigenvector 1 = [1, 0] => A v1 = [2, 0] = 2 v1
  // Eigenvalue 2 = 3, Eigenvector 2 = [1, 1] => A v2 = [3, 3] = 3 v2
  // Generic vector x = [0, 1] => A x = [1, 3] (rotates!)

  const configs = {
    v1: {
      name: 'Eigenvector 1: v₁ = [1, 0]ᵀ (λ₁ = 2)',
      x: [1, 0] as Vector2D,
      ax: [2, 0] as Vector2D,
      isEigen: true,
      formula: 'A\\mathbf{v}_1 = \\begin{bmatrix}2&1\\\\0&3\\end{bmatrix}\\begin{bmatrix}1\\\\0\\end{bmatrix} = \\begin{bmatrix}2\\\\0\\end{bmatrix} = 2\\mathbf{v}_1',
      desc: 'Vector v₁ giữ nguyên phương nằm trên trục x, chỉ bị kéo dài gấp λ₁ = 2 lần.',
    },
    v2: {
      name: 'Eigenvector 2: v₂ = [1, 1]ᵀ (λ₂ = 3)',
      x: [1, 1] as Vector2D,
      ax: [3, 3] as Vector2D,
      isEigen: true,
      formula: 'A\\mathbf{v}_2 = \\begin{bmatrix}2&1\\\\0&3\\end{bmatrix}\\begin{bmatrix}1\\\\1\\end{bmatrix} = \\begin{bmatrix}3\\\\3\\end{bmatrix} = 3\\mathbf{v}_2',
      desc: 'Vector v₂ giữ nguyên phương trên đường chéo y = x, chỉ bị kéo dài gấp λ₂ = 3 lần.',
    },
    generic: {
      name: 'Vector thông thường: x = [0, 1]ᵀ (Không phải Eigenvector)',
      x: [0, 1] as Vector2D,
      ax: [1, 3] as Vector2D,
      isEigen: false,
      formula: 'A\\mathbf{x} = \\begin{bmatrix}2&1\\\\0&3\\end{bmatrix}\\begin{bmatrix}0\\\\1\\end{bmatrix} = \\begin{bmatrix}1\\\\3\\end{bmatrix} \\neq \\lambda\\mathbf{x}',
      desc: 'Vector thông thường bị đổi hướng và quay lệch khỏi đường thẳng ban đầu sau khi nhân A.',
    },
  };

  const current = configs[selectedVec];

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Khám phá Trị riêng và Vector riêng (Ax = λx)"
      subtitle="Eigenvector là vector duy trì phương của chính mình sau phép biến đổi ma trận A."
      footer={
        <div className="space-y-3 w-full">
          {interactive && (
            <div className="flex justify-center">
              <MathSegmentedControl
                value={selectedVec}
                onChange={setSelectedVec}
                ariaLabel="Chọn vector thử nghiệm"
                options={[
                  { value: 'v1', label: 'v₁ (λ = 2)' },
                  { value: 'v2', label: 'v₂ (λ = 3)' },
                  { value: 'generic', label: 'x thông thường (Bị quay)' },
                ]}
              />
            </div>
          )}

          <div className="rounded-lg p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-xs sm:text-sm">
            <div className="text-center font-mono py-1">
              <BlockMath formula={current.formula} />
            </div>
            <p
              className={`text-center font-semibold ${
                current.isEigen
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {current.desc}
            </p>
          </div>
        </div>
      }
    >
      <MathCanvas
        ariaLabel={ariaLabel}
        minX={-1}
        maxX={4}
        minY={-1}
        maxY={4}
        height={300}
      >
        {/* Eigenline direction for eigen cases */}
        {current.isEigen && (
          <Line.ThroughPoints
            point1={[0, 0]}
            point2={current.x}
            color="rgba(148, 163, 184, 0.4)"
            style="dashed"
          />
        )}

        {/* Input vector x */}
        <Vector tail={[0, 0]} tip={current.x} color={theme.vectorU} weight={3} />
        <Text x={current.x[0]} y={current.x[1]} size={14} color={theme.vectorU} attach="nw">
          x
        </Text>

        {/* Output vector Ax */}
        <Vector
          tail={[0, 0]}
          tip={current.ax}
          color={current.isEigen ? '#10b981' : '#ec4899'}
          weight={4}
        />
        <Text
          x={current.ax[0]}
          y={current.ax[1]}
          size={14}
          color={current.isEigen ? '#10b981' : '#ec4899'}
          attach="se"
        >
          Ax
        </Text>
      </MathCanvas>
    </MathVisualCard>
  );
}

// ==========================================
// 14. DiagonalizationExplorer
// ==========================================
export function DiagonalizationExplorer({
  ariaLabel,
  interactive = true,
}: DiagonalizationExplorerProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  const matA = [
    [2, 1],
    [0, 3],
  ];
  const matV = [
    [1, 1],
    [0, 1],
  ];
  const matLambda = [
    [2, 0],
    [0, 3],
  ];
  const matVInv = [
    [1, -1],
    [0, 1],
  ];

  const steps = [
    {
      title: 'Bước 1: Chuyển đổi tọa độ sang Cơ sở Vector riêng: c = V⁻¹ x',
      desc: 'Ma trận V⁻¹ phân rã vector x thành các hệ số tọa độ c dọc theo các hướng trị riêng độc lập.',
    },
    {
      title: 'Bước 2: Co giãn độc lập theo từng trục: Λ c',
      desc: 'Ma trận đường chéo Λ nhân từng thành phần với trị riêng tương ứng (λ₁ = 2, λ₂ = 3) mà không gây tương tác chéo.',
    },
    {
      title: 'Bước 3: Chuyển ngược lại Cơ sở Tiêu chuẩn ban đầu: Ax = V (Λ c)',
      desc: 'Ma trận V ghép các thành phần đã được kéo giãn lại thành vector kết quả Ax.',
    },
  ];

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Quy trình Đường chéo hóa Ma trận (A = V Λ V⁻¹)"
      subtitle="Đường chéo hóa biến phép nhân ma trận phức tạp thành các phép co giãn độc lập theo từng trục."
      footer={
        <div className="space-y-3 w-full">
          {interactive && (
            <div className="flex justify-center">
              <MathSegmentedControl
                value={String(step) as '0' | '1' | '2'}
                onChange={(val) => setStep(Number(val) as 0 | 1 | 2)}
                ariaLabel="Chọn bước trong quy trình đường chéo hóa"
                options={[
                  { value: '0', label: '1. Đổi cơ sở (V⁻¹)' },
                  { value: '1', label: '2. Kéo giãn độc lập (Λ)' },
                  { value: '2', label: '3. Trả về gốc (V)' },
                ]}
              />
            </div>
          )}

          <div className="rounded-lg p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-xs sm:text-sm">
            <div className="font-semibold text-blue-600 dark:text-blue-400">
              {steps[step].title}
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              {steps[step].desc}
            </p>
            <div className="mt-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 text-center font-semibold pt-1 border-t border-slate-200 dark:border-slate-800">
              <InlineMath formula="A\mathbf{x} = V \Lambda V^{-1}\mathbf{x} = V (\Lambda (V^{-1}\mathbf{x}))" />
            </div>
          </div>
        </div>
      }
    >
      <MatrixEquationRow ariaLabel="Phân tích đường chéo hóa A = V Lambda V^-1">
        <MatrixGrid name="V" values={matV} size="sm" />
        <span className="text-base font-bold text-slate-400">×</span>
        <MatrixGrid
          name="Λ"
          values={matLambda}
          highlightIndices={[
            [0, 0],
            [1, 1],
          ]}
          size="sm"
        />
        <span className="text-base font-bold text-slate-400">×</span>
        <MatrixGrid name="V⁻¹" values={matVInv} size="sm" />
        <span className="text-base font-bold text-slate-400">=</span>
        <MatrixGrid name="A" values={matA} size="sm" />
      </MatrixEquationRow>
    </MathVisualCard>
  );
}

// ==========================================
// 15. PCAProjectionExplorer
// ==========================================
export function PCAProjectionExplorer({
  ariaLabel,
  interactive = true,
}: PCAProjectionExplorerProps) {
  const [projected, setProjected] = useState(false);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  // Exactly centered 2D points (mean = [0, 0])
  const rawPoints: Vector2D[] = [
    [-2.0, -1.0],
    [2.0, 1.0],
    [-1.4, -0.8],
    [1.4, 0.8],
    [-0.8, -0.3],
    [0.8, 0.3],
    [-0.4, -0.3],
    [0.4, 0.3],
  ];

  // Principal direction PC1 = [2, 1] / sqrt(5) ~ [0.8944, 0.4472]
  const q1Unit: Vector2D = [2 / Math.sqrt(5), 1 / Math.sqrt(5)];

  // Projected points onto q1
  const projectedPoints: Vector2D[] = rawPoints.map((pt) => {
    const projLen = vec.dot(pt, q1Unit);
    return vec.scale(q1Unit, projLen);
  });

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Phân tích Thành phần Chính (PCA & Phân tích Trị riêng)"
      subtitle="PCA tìm các hướng vector riêng của ma trận hiệp phương sai có phương sai lớn nhất để giảm chiều dữ liệu."
      footer={
        <div className="space-y-3 w-full">
          {interactive && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setProjected((prev) => !prev)}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  projected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-blue-600 text-white shadow-xs'
                }`}
              >
                {projected ? '✓ Đang chiếu lên PC1 (1D)' : 'Xem Chiếu lên Hướng PC1'}
              </button>
            </div>
          )}

          <div className="rounded-lg p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-xs sm:text-sm">
            <p className="text-slate-600 dark:text-slate-300">
              Trục <span className="font-bold text-blue-600 dark:text-blue-400">PC1</span> (ứng với trị riêng lớn nhất <InlineMath formula="\lambda_1" /> của ma trận hiệp phương sai) lưu giữ phương sai tối đa của tập dữ liệu.
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs mt-1">
              Chiếu dữ liệu đã trừ kỳ vọng (zero-mean) lên PC1 tối thiểu hóa sai số tái tạo (tổng bình phương khoảng cách chiếu).
            </p>
          </div>
        </div>
      }
    >
      <MathCanvas
        ariaLabel={ariaLabel}
        minX={-3}
        maxX={3}
        minY={-2}
        maxY={2}
        height={300}
      >
        {/* Principal Component line PC1 */}
        <Line.ThroughPoints
          point1={[-3, -1.5]}
          point2={[3, 1.5]}
          color="#3b82f6"
          weight={2.5}
        />
        <Text x={2.5} y={1.1} size={14} color="#3b82f6" attach="se">
          PC1 (λ₁)
        </Text>

        {/* Orthogonal direction PC2 */}
        <Line.ThroughPoints
          point1={[-0.7, 1.4]}
          point2={[0.7, -1.4]}
          color="rgba(148, 163, 184, 0.4)"
          style="dashed"
        />

        {/* Residual projection dashed lines when projected */}
        {projected &&
          rawPoints.map((rawPt, idx) => (
            <Line.Segment
              key={`res-${idx}`}
              point1={rawPt}
              point2={projectedPoints[idx]}
              color="rgba(16, 185, 129, 0.5)"
              style="dashed"
            />
          ))}

        {/* Original points */}
        {rawPoints.map((pt, idx) => (
          <Point
            key={`pt-${idx}`}
            x={pt[0]}
            y={pt[1]}
            color={projected ? 'rgba(59, 130, 246, 0.35)' : theme.vectorU}
          />
        ))}

        {/* Projected points on PC1 line */}
        {projected &&
          projectedPoints.map((projPt, idx) => (
            <Point
              key={`proj-${idx}`}
              x={projPt[0]}
              y={projPt[1]}
              color="#10b981"
            />
          ))}
      </MathCanvas>
    </MathVisualCard>
  );
}

import { useState } from 'react';
import { Vector, Plot, Text, Polygon, Point, vec } from 'mafs';
import { InlineMath, BlockMath, useLearningMdxTheme } from '../../learningMdxComponents';
import { getMathVisualTheme } from './theme';
import { MathCanvas } from './primitives/MathCanvas';
import { MathVisualCard, MathInfoPanel } from './primitives/MathVisualCard';
import { MathSegmentedControl } from './primitives/MathSegmentedControl';
import { MatrixGrid } from './primitives/MatrixGrid';
import type {
  SubspaceClosureExplorerProps,
  ColumnNullSpaceExplorerProps,
  BasisIndependenceExplorerProps,
  RankPivotExplorerProps,
  LinearTransformationExplorerProps,
  Vector2D,
} from './types';

// ==========================================
// 1. SubspaceClosureExplorer
// ==========================================
export function SubspaceClosureExplorer({
  ariaLabel,
  interactive = true,
  defaultMode = 'subspace',
}: SubspaceClosureExplorerProps) {
  const [mode, setMode] = useState<'subspace' | 'affine'>(defaultMode);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  // Mode Subspace: y = 2x (passes origin)
  // Mode Affine: y = 2x + 1 (does not pass origin)
  const isSubspace = mode === 'subspace';
  const u: Vector2D = isSubspace ? [1, 2] : [0, 1];
  const v: Vector2D = isSubspace ? [-1, -2] : [1, 3];
  const sum: Vector2D = vec.add(u, v); // [0, 0] for subspace; [1, 4] for affine (4 != 2*1+1 = 3!)
  const isSumOnLine = isSubspace ? true : sum[1] === 2 * sum[0] + 1;

  const belowPlot = (
    <div className="flex flex-col gap-3 w-full">
      {interactive && (
        <div className="flex justify-center">
          <MathSegmentedControl
            value={mode}
            onChange={setMode}
            ariaLabel="Chọn tập hợp để kiểm tra"
            options={[
              {
                value: 'subspace',
                label: 'Đường thẳng qua gốc tọa độ: y = 2x',
              },
              {
                value: 'affine',
                label: 'Đường thẳng lệch: y = 2x + 1',
              },
            ]}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
        <div
          className={`p-2.5 rounded-lg border flex flex-col gap-1 ${
            isSubspace
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <span className="font-bold flex items-center gap-1">
            {isSubspace ? '✓ Chứa vector 0' : '✗ Không chứa vector 0'}
          </span>
          <span className="text-[11px] opacity-90">
            {isSubspace
              ? '(0, 0) thỏa mãn y = 2(0) = 0'
              : '(0, 0) không thỏa mãn 0 = 2(0) + 1'}
          </span>
        </div>

        <div
          className={`p-2.5 rounded-lg border flex flex-col gap-1 ${
            isSumOnLine
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <span className="font-bold flex items-center gap-1">
            {isSumOnLine ? '✓ Đóng kín phép cộng' : '✗ Thất bại phép cộng'}
          </span>
          <span className="text-[11px] opacity-90 font-mono">
            {isSubspace
              ? `u+v = [${sum[0]}, ${sum[1]}]ᵀ ∈ W`
              : `[0,1]ᵀ+[1,3]ᵀ = [${sum[0]}, ${sum[1]}]ᵀ ∉ W`}
          </span>
        </div>

        <div
          className={`p-2.5 rounded-lg border flex flex-col gap-1 ${
            isSubspace
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <span className="font-bold flex items-center gap-1">
            {isSubspace ? '✓ Đóng kín phép nhân' : '✗ Thất bại phép nhân'}
          </span>
          <span className="text-[11px] opacity-90">
            {isSubspace
              ? 'c · (x, 2x) = (cx, 2cx) ∈ W'
              : 'c · (0, 1) = (0, c) ∉ W khi c ≠ 1'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Kiểm tra 3 điều kiện của Không gian con (Subspace)"
      subtitle={
        isSubspace
          ? 'Tập W₁ = {(x, y) ∈ ℝ² | y = 2x} là một không gian con 1 chiều của ℝ².'
          : 'Tập W₂ = {(x, y) ∈ ℝ² | y = 2x + 1} là một không gian affine, không phải không gian con.'
      }
      footer={belowPlot}
    >
      <MathCanvas
        ariaLabel={ariaLabel}
        minX={-3}
        maxX={4}
        minY={-3}
        maxY={5}
        height={300}
      >
        {/* Line plot */}
        <Plot.OfX
          y={(x) => (isSubspace ? 2 * x : 2 * x + 1)}
          color={isSubspace ? theme.vectorU : '#f43f5e'}
          weight={2.5}
        />

        {/* Origin point indicator for affine case */}
        {!isSubspace && (
          <>
            <Point x={0} y={0} color="#f43f5e" />
            <Text x={0.2} y={-0.3} size={12} color="#f43f5e" attach="se">
              0 ∉ W
            </Text>
          </>
        )}

        {/* Vector u */}
        <Vector tail={[0, 0]} tip={u} color={theme.vectorU} weight={3} />
        <Text x={u[0]} y={u[1]} size={14} color={theme.vectorU} attach="nw">
          u = [{u[0]}, {u[1]}]ᵀ
        </Text>

        {/* Vector v */}
        <Vector tail={[0, 0]} tip={v} color={theme.vectorV} weight={3} />
        <Text x={v[0]} y={v[1]} size={14} color={theme.vectorV} attach="se">
          v = [{v[0]}, {v[1]}]ᵀ
        </Text>

        {/* Vector sum u + v */}
        <Vector
          tail={[0, 0]}
          tip={sum}
          color={isSumOnLine ? '#10b981' : '#ec4899'}
          weight={3.5}
          style={isSumOnLine ? 'solid' : 'dashed'}
        />
        <Text
          x={sum[0]}
          y={sum[1]}
          size={14}
          color={isSumOnLine ? '#10b981' : '#ec4899'}
          attach="ne"
        >
          u + v = [{sum[0]}, {sum[1]}]ᵀ
        </Text>
      </MathCanvas>
    </MathVisualCard>
  );
}

// ==========================================
// 2. ColumnNullSpaceExplorer
// ==========================================
export function ColumnNullSpaceExplorer({
  ariaLabel,
  interactive = true,
}: ColumnNullSpaceExplorerProps) {
  const [activeSpace, setActiveSpace] = useState<'col' | 'null'>('col');
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const matrixA = [
    [1, 2, 3],
    [2, 4, 6],
  ];

  const basisCol: Vector2D = [1, 2];

  const belowPlot = (
    <div className="flex flex-col gap-3 w-full">
      {interactive && (
        <div className="flex justify-center">
          <MathSegmentedControl
            value={activeSpace}
            onChange={setActiveSpace}
            ariaLabel="Chọn không gian khảo sát"
            options={[
              {
                value: 'col',
                label: 'Không gian cột Col(A) ⊆ ℝ²',
              },
              {
                value: 'null',
                label: 'Không gian hạt nhân Null(A) ⊆ ℝ³',
              },
            ]}
          />
        </div>
      )}

      <MathInfoPanel>
        {activeSpace === 'col' ? (
          <div className="space-y-1.5">
            <div className="font-semibold text-blue-600">
              <InlineMath formula="\operatorname{Col}(A) = \operatorname{span}\{\mathbf{a}_1, \mathbf{a}_2, \mathbf{a}_3\} \subseteq \mathbb{R}^2" />
            </div>
            <p className="text-slate-600">
              Vì <InlineMath formula="\mathbf{a}_2 = 2\mathbf{a}_1" /> và{' '}
              <InlineMath formula="\mathbf{a}_3 = 3\mathbf{a}_1" />, tất cả các cột đều cùng phương với{' '}
              <InlineMath formula="\mathbf{a}_1 = [1, 2]^\top" />. Do đó <InlineMath formula="\operatorname{Col}(A)" /> là đường thẳng <InlineMath formula="y = 2x" /> trong <InlineMath formula="\mathbb{R}^2" /> có số chiều bằng 1.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 font-mono text-xs">
            <div className="font-semibold font-sans text-purple-600 text-sm">
              <InlineMath formula="\operatorname{Null}(A) = \{\mathbf{x} \in \mathbb{R}^3 \mid A\mathbf{x} = \mathbf{0}\}" />
            </div>
            <p className="text-slate-600 font-sans">
              Hệ thuần nhất <InlineMath formula="x_1 + 2x_2 + 3x_3 = 0" /> có 2 biến tự do (<InlineMath formula="x_2, x_3" />). Cơ sở của <InlineMath formula="\operatorname{Null}(A)" /> gồm 2 vector độc lập trong <InlineMath formula="\mathbb{R}^3" />:
            </p>
            <div className="p-2 rounded bg-slate-100 border border-slate-200 text-slate-800 text-center">
              <InlineMath formula="\mathbf{n}_1 = \begin{bmatrix}-2\\1\\0\end{bmatrix}, \quad \mathbf{n}_2 = \begin{bmatrix}-3\\0\\1\end{bmatrix} \quad \Longrightarrow \quad \dim(\operatorname{Null}(A)) = 2" />
            </div>
          </div>
        )}
      </MathInfoPanel>
    </div>
  );

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Khám phá Col(A) và Null(A) của ma trận A"
      badge={<InlineMath formula="A \in \mathbb{R}^{2\times 3}" />}
      footer={belowPlot}
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-around gap-4 py-2">
        <div className="flex flex-col items-center gap-1">
          <MatrixGrid name="A" values={matrixA} size="md" />
        </div>

        {activeSpace === 'col' ? (
          <div className="w-full max-w-sm flex justify-center">
            <MathCanvas
              ariaLabel="Biểu diễn hình học của Col(A)"
              minX={-2}
              maxX={4}
              minY={-2}
              maxY={5}
              height={260}
            >
              {/* Span line */}
              <Plot.OfX y={(x) => 2 * x} color={theme.vectorU} weight={2.5} />

              {/* Basis column 1 */}
              <Vector tail={[0, 0]} tip={basisCol} color={theme.vectorU} weight={3.5} />
              <Text x={basisCol[0]} y={basisCol[1]} size={14} color={theme.vectorU} attach="nw">
                a₁ = [1, 2]ᵀ
              </Text>

              {/* Column 2 */}
              <Vector tail={[0, 0]} tip={[2, 4]} color={theme.vectorV} style="dashed" weight={2} />
              <Text x={2} y={4} size={14} color={theme.vectorV} attach="se">
                a₂ = 2a₁
              </Text>
            </MathCanvas>
          </div>
        ) : (
          <div className="w-full max-w-sm p-4 rounded-xl border border-slate-200 bg-white flex flex-col items-center gap-3">
            <span className="text-xs font-semibold text-purple-600">
              Không gian nghiệm đầu vào ℝ³ (Ax = 0)
            </span>
            <div className="w-full text-xs font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="mb-2">
                <BlockMath formula="\mathbf{x} = x_2 \begin{bmatrix}-2\\1\\0\end{bmatrix} + x_3 \begin{bmatrix}-3\\0\\1\end{bmatrix}" />
              </div>
              <p className="text-[11px] text-slate-500 font-sans text-center">
                Mọi vector nghiệm x đều là tổ hợp tuyến tính của 2 vector n₁ và n₂.
              </p>
            </div>
          </div>
        )}
      </div>
    </MathVisualCard>
  );
}

// ==========================================
// 3. BasisIndependenceExplorer
// ==========================================
export function BasisIndependenceExplorer({
  ariaLabel,
  interactive = true,
}: BasisIndependenceExplorerProps) {
  const [mode, setMode] = useState<'independent' | 'dependent'>('independent');
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const isIndependent = mode === 'independent';

  // Independent basis in R2
  const e1: Vector2D = [1, 0];
  const e2: Vector2D = [0, 1];

  // Dependent set: v1, v2, v3 = v1 + v2
  const v1: Vector2D = [2, 1];
  const v2: Vector2D = [-1, 2];
  const v3: Vector2D = [1, 3]; // v1 + v2

  const belowPlot = (
    <div className="flex flex-col gap-3 w-full">
      {interactive && (
        <div className="flex justify-center">
          <MathSegmentedControl
            value={mode}
            onChange={setMode}
            ariaLabel="Chọn tập vector để phân tích"
            options={[
              {
                value: 'independent',
                label: 'Độc lập tuyến tính (Cơ sở ℝ²)',
              },
              {
                value: 'dependent',
                label: 'Phụ thuộc tuyến tính (3 vector)',
              },
            ]}
          />
        </div>
      )}

      <MathInfoPanel>
        {isIndependent ? (
          <div className="space-y-1">
            <p className="font-semibold text-emerald-600">
              Cơ sở chuẩn tắc của <InlineMath formula="\mathbb{R}^2" /> gồm 2 vector độc lập:
            </p>
            <p className="text-slate-600">
              Phương trình <InlineMath formula="c_1\mathbf{e}_1 + c_2\mathbf{e}_2 = \mathbf{0}" /> chỉ có nghiệm tầm thường duy nhất <InlineMath formula="c_1 = c_2 = 0" />. Hai vector này sinh ra toàn bộ không gian <InlineMath formula="\mathbb{R}^2" />.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="font-semibold text-amber-600">
              Vector thứ ba <InlineMath formula="\mathbf{v}_3" /> là tổ hợp tuyến tính thừa:
            </p>
            <p className="text-slate-600 font-mono">
              <InlineMath formula="\mathbf{v}_3 = 1\mathbf{v}_1 + 1\mathbf{v}_2 \;\Longleftrightarrow\; 1\mathbf{v}_1 + 1\mathbf{v}_2 - 1\mathbf{v}_3 = \mathbf{0}" />
            </p>
            <p className="text-slate-500 text-xs">
              Trong không gian <InlineMath formula="\mathbb{R}^2" />, bất kỳ tập hợp nào có từ 3 vector trở lên đều chắc chắn phụ thuộc tuyến tính.
            </p>
          </div>
        )}
      </MathInfoPanel>
    </div>
  );

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Độc lập tuyến tính, Hệ sinh và Cơ sở"
      subtitle={
        isIndependent
          ? 'Số lượng vector trong cơ sở chính là số chiều của không gian: dim(ℝ²) = 2.'
          : 'Thêm một vector nằm trong span của các vector trước không làm tăng số chiều.'
      }
      footer={belowPlot}
    >
      <MathCanvas
        ariaLabel={ariaLabel}
        minX={-2}
        maxX={4}
        minY={-1}
        maxY={4}
        height={300}
      >
        {isIndependent ? (
          <>
            <Vector tail={[0, 0]} tip={e1} color={theme.vectorU} weight={3.5} />
            <Text x={e1[0]} y={e1[1]} size={14} color={theme.vectorU} attach="se">
              e₁ = [1, 0]ᵀ
            </Text>

            <Vector tail={[0, 0]} tip={e2} color={theme.vectorV} weight={3.5} />
            <Text x={e2[0]} y={e2[1]} size={14} color={theme.vectorV} attach="nw">
              e₂ = [0, 1]ᵀ
            </Text>
          </>
        ) : (
          <>
            <Vector tail={[0, 0]} tip={v1} color={theme.vectorU} weight={3} />
            <Text x={v1[0]} y={v1[1]} size={14} color={theme.vectorU} attach="se">
              v₁ = [2, 1]ᵀ
            </Text>

            <Vector tail={[0, 0]} tip={v2} color={theme.vectorV} weight={3} />
            <Text x={v2[0]} y={v2[1]} size={14} color={theme.vectorV} attach="nw">
              v₂ = [-1, 2]ᵀ
            </Text>

            <Vector tail={[0, 0]} tip={v3} color="#ec4899" weight={3.5} style="dashed" />
            <Text x={v3[0]} y={v3[1]} size={14} color="#ec4899" attach="ne">
              v₃ = v₁ + v₂
            </Text>
          </>
        )}
      </MathCanvas>
    </MathVisualCard>
  );
}

// ==========================================
// 4. RankPivotExplorer
// ==========================================
export function RankPivotExplorer({
  ariaLabel,
  interactive = true,
}: RankPivotExplorerProps) {
  const [selectedCol, setSelectedCol] = useState<number | null>(0);

  const origA = [
    [1, 2, 1],
    [2, 4, 3],
  ];

  const echelonR = [
    [1, 2, 0],
    [0, 0, 1],
  ];

  const colExplanations = [
    {
      col: 0,
      title: 'Cột 1: Cột Pivot (Pivot Column)',
      desc: 'Chứa pivot đầu tiên ở hàng 1. Cột 1 của ma trận gốc A là một vector cơ sở độc lập trong Col(A).',
      isPivot: true,
    },
    {
      col: 1,
      title: 'Cột 2: Cột không Pivot (Non-pivot Column)',
      desc: 'Không chứa pivot. Cột 2 phụ thuộc tuyến tính vào cột 1 (a₂ = 2a₁). Biến x₂ tương ứng là biến tự do.',
      isPivot: false,
    },
    {
      col: 2,
      title: 'Cột 3: Cột Pivot (Pivot Column)',
      desc: 'Chứa pivot thứ hai ở hàng 2. Cột 3 của ma trận gốc A bổ sung hướng độc lập thứ hai cho Col(A).',
      isPivot: true,
    },
  ];

  const currentInfo = selectedCol !== null ? colExplanations[selectedCol] : null;

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Hạng của Ma trận và Cột Pivot"
      subtitle="Số lượng cột chứa Pivot trong dạng bậc thang chính bằng Hạng (Rank) của ma trận."
      footer={
        <div className="space-y-3 w-full">
          {interactive && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-500">Chọn cột để khảo sát:</span>
              <MathSegmentedControl
                ariaLabel="Chọn cột để khảo sát"
                value={String(selectedCol)}
                onChange={(val) => setSelectedCol(Number(val))}
                size="sm"
                options={colExplanations.map((item) => ({
                  value: String(item.col),
                  label: `Cột ${item.col + 1} (${item.isPivot ? 'Pivot' : 'Không Pivot'})`,
                  colorScheme: item.isPivot ? 'amber' : 'blue',
                }))}
              />
            </div>
          )}

          {currentInfo && (
            <MathInfoPanel>
              <p
                className={`font-semibold ${
                  currentInfo.isPivot
                    ? 'text-amber-600'
                    : 'text-blue-600'
                }`}
              >
                {currentInfo.title}
              </p>
              <p className="text-slate-600 mt-1">
                {currentInfo.desc}
              </p>
            </MathInfoPanel>
          )}

          <div className="text-xs text-slate-500 font-mono text-center pt-1 border-t border-slate-200">
            <InlineMath formula="\operatorname{rank}(A) = 2 \quad (\text{số cột pivot}), \quad \dim(\operatorname{Null}(A)) = 3 - 2 = 1 \quad (\text{số cột không pivot})" />
          </div>
        </div>
      }
    >
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-slate-500">Ma trận gốc A</span>
          <MatrixGrid
            name="A"
            values={origA}
            highlightCol={selectedCol !== null ? selectedCol : undefined}
            size="md"
          />
        </div>

        <span className="text-sm font-bold text-slate-400">→ RREF →</span>

        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-slate-500">Dạng bậc thang rút gọn R</span>
          <MatrixGrid
            name="R"
            values={echelonR}
            highlightIndices={[
              [0, 0],
              [1, 2],
            ]}
            highlightCol={selectedCol !== null ? selectedCol : undefined}
            size="md"
          />
        </div>
      </div>
    </MathVisualCard>
  );
}

// ==========================================
// 5. LinearTransformationExplorer
// ==========================================
export function LinearTransformationExplorer({
  ariaLabel,
  interactive = true,
}: LinearTransformationExplorerProps) {
  const [preset, setPreset] = useState<'scale' | 'shear' | 'rotation' | 'collapse'>('scale');
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const matrices = {
    scale: {
      name: 'Scale (Phóng to)',
      values: [
        [2, 0],
        [0, 1.5],
      ],
      desc: 'Kéo dài trục x gấp 2 lần và trục y gấp 1.5 lần.',
    },
    shear: {
      name: 'Shear (Biến dạng trượt)',
      values: [
        [1, 1],
        [0, 1],
      ],
      desc: 'Giữ nguyên chiều cao theo trục y, trượt ngang trục x theo độ cao y.',
    },
    rotation: {
      name: 'Rotation 90° (Quay)',
      values: [
        [0, -1],
        [1, 0],
      ],
      desc: 'Quay toàn bộ mặt phẳng một góc 90° ngược chiều kim đồng hồ, bảo toàn độ dài.',
    },
    collapse: {
      name: 'Collapse (Suy biến về 1 chiều)',
      values: [
        [1, 2],
        [0.5, 1],
      ],
      desc: 'Hai cột cùng phương khiến toàn bộ mặt phẳng 2D bị ép phẳng về 1 đường thẳng.',
    },
  };

  const currentMat = matrices[preset];
  const mat = currentMat.values;

  // Transformed unit basis vectors
  const t_i: Vector2D = [mat[0][0], mat[1][0]];
  const t_j: Vector2D = [mat[0][1], mat[1][1]];
  const t_corner: Vector2D = vec.add(t_i, t_j);

  const belowPlot = (
    <div className="flex flex-col gap-3 w-full">
      {interactive && (
        <div className="flex justify-center">
          <MathSegmentedControl
            value={preset}
            onChange={setPreset}
            ariaLabel="Chọn phép biến đổi tuyến tính"
            options={[
              { value: 'scale', label: 'Scale' },
              { value: 'shear', label: 'Shear' },
              { value: 'rotation', label: 'Rotation' },
              { value: 'collapse', label: 'Collapse (1D)' },
            ]}
          />
        </div>
      )}

      <MathInfoPanel>
        <div className="font-semibold text-blue-600">
          {currentMat.name}
        </div>
        <p className="text-slate-600 mt-1">
          {currentMat.desc}
        </p>
        <div className="mt-2 text-xs font-mono text-slate-500 text-center">
          <InlineMath
            formula={`T(\\mathbf{e}_1) = [${t_i[0]}, ${t_i[1]}]^\\top, \\quad T(\\mathbf{e}_2) = [${t_j[0]}, ${t_j[1]}]^\\top`}
          />
        </div>
      </MathInfoPanel>
    </div>
  );

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Ánh xạ Tuyến tính và Ảnh của Hình vuông Đơn vị"
      subtitle="Ma trận biến đổi hoàn toàn được xác định bởi ảnh của các vector cơ sở T(e₁) và T(e₂)."
      footer={belowPlot}
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-around gap-4 py-2">
        <div className="flex flex-col items-center gap-1">
          <MatrixGrid name="A" values={mat} size="md" />
        </div>

        <div className="w-full max-w-sm flex justify-center">
          <MathCanvas
            ariaLabel={ariaLabel}
            minX={-2}
            maxX={3.5}
            minY={-1.5}
            maxY={3.5}
            height={260}
          >
            {/* Transformed parallelogram */}
            <Polygon
              points={[
                [0, 0],
                t_i,
                t_corner,
                t_j,
              ]}
              color="#3b82f6"
            />

            {/* Original unit square outline */}
            <Polygon
              points={[
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
              ]}
              color="rgba(148, 163, 184, 0.2)"
            />

            {/* Transformed e1 */}
            <Vector tail={[0, 0]} tip={t_i} color={theme.vectorU} weight={3} />
            <Text x={t_i[0]} y={t_i[1]} size={14} color={theme.vectorU} attach="se">
              T(e₁)
            </Text>

            {/* Transformed e2 */}
            <Vector tail={[0, 0]} tip={t_j} color={theme.vectorV} weight={3} />
            <Text x={t_j[0]} y={t_j[1]} size={14} color={theme.vectorV} attach="nw">
              T(e₂)
            </Text>
          </MathCanvas>
        </div>
      </div>
    </MathVisualCard>
  );
}

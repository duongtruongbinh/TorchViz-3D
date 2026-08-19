import { useCallback, useState } from 'react';
import { Vector, Plot, Text } from 'mafs';
import { InlineMath, BlockMath, useLearningMdxTheme } from '../../learningMdxComponents';
import { getMathVisualTheme } from './theme';
import { MathCanvas } from './primitives/MathCanvas';
import { MathVisualCard, MathInfoPanel } from './primitives/MathVisualCard';
import { MathSegmentedControl } from './primitives/MathSegmentedControl';
import { InteractiveStepper } from '../../shell/InteractiveStepper';
import { MatrixGrid } from './primitives/MatrixGrid';
import { MatrixEquationRow } from './primitives/MatrixEquationRow';
import type {
  SVDGeometryExplorerProps,
  TruncatedSVDExplorerProps,
} from './types';

// ==========================================
// 16. SVDGeometryExplorer
// ==========================================
export function SVDGeometryExplorer({
  ariaLabel,
  interactive = true,
}: SVDGeometryExplorerProps) {
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  // SVD Parameters:
  // V: rotation by 30 deg
  // Sigma: sigma1 = 2.5, sigma2 = 1.0
  // U: rotation by +45 deg
  const sigma1 = 2.5;
  const sigma2 = 1.0;

  const stages = [
    {
      title: 'Giai đoạn 1: Đường tròn đơn vị trong Không gian đầu vào (V)',
      desc: 'Tập hợp các vector đơn vị x (||x|| = 1) cùng với cơ sở trực chuẩn {v₁, v₂} trong không gian ℝ² đầu vào.',
      math: '\\|\\mathbf{x}\\| = 1, \\quad V = [\\mathbf{v}_1 \\; \\mathbf{v}_2]',
    },
    {
      title: 'Giai đoạn 2: Phép quay Vᵀ đưa về các trục tọa độ chính',
      desc: 'Ma trận trực giao Vᵀ thực hiện phép quay bảo toàn độ dài, đưa các vector v₁, v₂ trùng khít vào hai trục tọa độ tiêu chuẩn.',
      math: '\\mathbf{x}\' = V^\\top \\mathbf{x}',
    },
    {
      title: 'Giai đoạn 3: Phép kéo giãn bởi ma trận đường chéo Σ',
      desc: 'Ma trận Σ kéo giãn dọc theo trục x một hệ số σ₁ = 2.5 và dọc theo trục y một hệ số σ₂ = 1.0, biến hình tròn thành hình ellipse.',
      math: '\\Sigma = \\begin{bmatrix}2.5&0\\\\0&1.0\\end{bmatrix}, \\quad \\mathbf{x}\'\' = \\Sigma V^\\top \\mathbf{x}',
    },
    {
      title: 'Giai đoạn 4: Phép quay U trong Không gian đầu ra hình thành Ellipse hoàn chỉnh',
      desc: 'Ma trận trực giao U quay hình ellipse vào không gian đầu ra, với hai bán trục chính là σ₁u₁ và σ₂u₂.',
      math: 'A\\mathbf{x} = U \\Sigma V^\\top \\mathbf{x}, \\quad U = [\\mathbf{u}_1 \\; \\mathbf{u}_2]',
    },
  ];

  const current = stages[stage];
  const angleU = Math.PI / 4; // 45 deg

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Trực giác Hình học về Phân tích SVD (A = U Σ Vᵀ)"
      subtitle="SVD phân rã mọi phép biến đổi ma trận thành chuỗi 3 bước: Quay (Vᵀ) → Co giãn (Σ) → Quay (U)."
      footer={
        <div className="space-y-3 w-full">
          <MathInfoPanel>
            <div className="font-semibold text-blue-600">
              {current.title}
            </div>
            <div className="text-center font-mono py-1.5">
              <BlockMath formula={current.math} />
            </div>
            <p className="text-slate-600 text-center">
              {current.desc}
            </p>
          </MathInfoPanel>

          {interactive && (
            <InteractiveStepper
              currentStep={stage}
              totalSteps={stages.length}
              onStepChange={useCallback((s: number) => setStage(s as 0 | 1 | 2 | 3), [])}
              ariaLabel="SVD stage controls"
            />
          )}
        </div>
      }
    >
      <MathCanvas
        ariaLabel={ariaLabel}
        minX={-3}
        maxX={3}
        minY={-3}
        maxY={3}
        height={300}
      >
        {/* Stage 0 & 1: Circle */}
        {(stage === 0 || stage === 1) && (
          <Plot.Parametric
            domain={[0, 2 * Math.PI]}
            xy={(t) => [Math.cos(t), Math.sin(t)]}
            color="#3b82f6"
            weight={2.5}
          />
        )}

        {/* Stage 2: Axis-aligned ellipse */}
        {stage === 2 && (
          <Plot.Parametric
            domain={[0, 2 * Math.PI]}
            xy={(t) => [sigma1 * Math.cos(t), sigma2 * Math.sin(t)]}
            color="#10b981"
            weight={3}
          />
        )}

        {/* Stage 3: Rotated ellipse */}
        {stage === 3 && (
          <Plot.Parametric
            domain={[0, 2 * Math.PI]}
            xy={(t) => {
              const xPrime = sigma1 * Math.cos(t);
              const yPrime = sigma2 * Math.sin(t);
              return [
                xPrime * Math.cos(angleU) - yPrime * Math.sin(angleU),
                xPrime * Math.sin(angleU) + yPrime * Math.cos(angleU),
              ];
            }}
            color="#ec4899"
            weight={3.5}
          />
        )}

        {/* Vectors based on stage */}
        {stage === 0 && (
          <>
            <Vector tail={[0, 0]} tip={[Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)]} color={theme.vectorU} weight={3} />
            <Text x={Math.cos(Math.PI / 6)} y={Math.sin(Math.PI / 6)} size={14} color={theme.vectorU} attach="ne">
              v₁
            </Text>
            <Vector tail={[0, 0]} tip={[-Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)]} color={theme.vectorV} weight={3} />
            <Text x={-Math.sin(Math.PI / 6)} y={Math.cos(Math.PI / 6)} size={14} color={theme.vectorV} attach="nw">
              v₂
            </Text>
          </>
        )}

        {stage === 1 && (
          <>
            <Vector tail={[0, 0]} tip={[1, 0]} color={theme.vectorU} weight={3} />
            <Text x={1} y={0} size={14} color={theme.vectorU} attach="se">
              Vᵀv₁ = [1, 0]ᵀ
            </Text>
            <Vector tail={[0, 0]} tip={[0, 1]} color={theme.vectorV} weight={3} />
            <Text x={0} y={1} size={14} color={theme.vectorV} attach="nw">
              Vᵀv₂ = [0, 1]ᵀ
            </Text>
          </>
        )}

        {stage === 2 && (
          <>
            <Vector tail={[0, 0]} tip={[sigma1, 0]} color="#10b981" weight={3.5} />
            <Text x={sigma1} y={0} size={14} color="#10b981" attach="se">
              σ₁ = 2.5
            </Text>
            <Vector tail={[0, 0]} tip={[0, sigma2]} color="#10b981" weight={3.5} />
            <Text x={0} y={sigma2} size={14} color="#10b981" attach="nw">
              σ₂ = 1.0
            </Text>
          </>
        )}

        {stage === 3 && (
          <>
            <Vector
              tail={[0, 0]}
              tip={[sigma1 * Math.cos(angleU), sigma1 * Math.sin(angleU)]}
              color="#ec4899"
              weight={4}
            />
            <Text
              x={sigma1 * Math.cos(angleU)}
              y={sigma1 * Math.sin(angleU)}
              size={14}
              color="#ec4899"
              attach="ne"
            >
              σ₁u₁
            </Text>
            <Vector
              tail={[0, 0]}
              tip={[-sigma2 * Math.sin(angleU), sigma2 * Math.cos(angleU)]}
              color="#ec4899"
              weight={3.5}
            />
            <Text
              x={-sigma2 * Math.sin(angleU)}
              y={sigma2 * Math.cos(angleU)}
              size={14}
              color="#ec4899"
              attach="nw"
            >
              σ₂u₂
            </Text>
          </>
        )}
      </MathCanvas>
    </MathVisualCard>
  );
}

// ==========================================
// 17. TruncatedSVDExplorer
// ==========================================
export function TruncatedSVDExplorer({
  ariaLabel,
  interactive = true,
}: TruncatedSVDExplorerProps) {
  const [rankK, setRankK] = useState<1 | 2 | 3>(1);

  // Matrix A: 3x3 symmetric with singular values sigma = [10, 1, 1]
  const origA = [
    [5, 4, 2],
    [4, 5, 2],
    [2, 2, 2],
  ];

  // Exact Rank-1: sigma1 * u1 * v1^T = 10/9 * [[4,4,2],[4,4,2],[2,2,1]]
  const approxRank1 = [
    [4.44, 4.44, 2.22],
    [4.44, 4.44, 2.22],
    [2.22, 2.22, 1.11],
  ];

  // Exact Rank-2: A1 + sigma2 * u2 * v2^T = A1 + 0.5 * [[1,-1,0],[-1,1,0],[0,0,0]]
  const approxRank2 = [
    [4.94, 3.94, 2.22],
    [3.94, 4.94, 2.22],
    [2.22, 2.22, 1.11],
  ];

  const approxRank3 = origA; // Exact full rank

  const configs = {
    1: {
      mat: approxRank1,
      name: 'Xấp xỉ Hạng 1 (Rank-1 Approximation: A₁ = σ₁ u₁ v₁ᵀ)',
      energy: '98.04%',
      error: '1.414',
      desc: 'Giữ lại 1 thành phần chính lớn nhất (σ₁ = 10), bảo toàn 98.04% năng lượng tổng bình phương các giá trị suy biến của ma trận.',
    },
    2: {
      mat: approxRank2,
      name: 'Xấp xỉ Hạng 2 (Rank-2 Approximation: A₂ = σ₁ u₁ v₁ᵀ + σ₂ u₂ v₂ᵀ)',
      energy: '99.02%',
      error: '1.000',
      desc: 'Giữ lại 2 thành phần chính (σ₁ = 10, σ₂ = 1), khôi phục 99.02% cấu trúc ma trận gốc với sai số Frobenius đúng bằng σ₃ = 1.000.',
    },
    3: {
      mat: approxRank3,
      name: 'Toàn bộ Hạng 3 (Full Rank: A₃ = A)',
      energy: '100.0%',
      error: '0.000',
      desc: 'Tái tạo chính xác 100% ma trận gốc không có sai số (||A - A₃||_F = 0).',
    },
  };

  const current = configs[rankK];

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Xấp xỉ Ma trận Hạng thấp bằng Truncated SVD (Định lý Eckart-Young)"
      subtitle="Định lý Eckart-Young khẳng định Truncated SVD cho xấp xỉ hạng k tối ưu nhất theo chuẩn Frobenius."
      footer={
        <div className="space-y-3 w-full">
          {interactive && (
            <div className="flex justify-center">
              <MathSegmentedControl
                value={String(rankK) as '1' | '2' | '3'}
                onChange={(val) => setRankK(Number(val) as 1 | 2 | 3)}
                ariaLabel="Chọn mức độ xấp xỉ hạng k"
                options={[
                  { value: '1', label: 'Hạng k = 1 (Nén cao)' },
                  { value: '2', label: 'Hạng k = 2 (Cân bằng)' },
                  { value: '3', label: 'Hạng k = 3 (Đầy đủ)' },
                ]}
              />
            </div>
          )}

          <MathInfoPanel>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 border-slate-200">
              <span className="font-semibold text-blue-600">
                {current.name}
              </span>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-emerald-600 font-bold">
                  Năng lượng: {current.energy}
                </span>
                <span className="text-slate-500">
                  Sai số Frobenius: {current.error}
                </span>
              </div>
            </div>
            <p className="text-slate-600 mt-2">
              {current.desc}
            </p>
            <div className="mt-2 text-xs font-mono text-center text-slate-500 pt-1 border-t border-slate-200">
              <InlineMath formula="A_k = \sum_{i=1}^k \sigma_i \mathbf{u}_i \mathbf{v}_i^\top, \quad \|A - A_k\|_F = \sqrt{\sum_{i=k+1}^r \sigma_i^2}" />
            </div>
          </MathInfoPanel>
        </div>
      }
    >
      <MatrixEquationRow ariaLabel="So sánh ma trận gốc và ma trận xấp xỉ">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-slate-500">Ma trận gốc A</span>
          <MatrixGrid name="A" values={origA} size="md" />
        </div>

        <span className="text-xl font-bold text-slate-400 px-2">≈</span>

        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold text-blue-600">
            Xấp xỉ <InlineMath formula={`A_{${rankK}}`} />
          </span>
          <MatrixGrid name={`A_${rankK}`} values={current.mat} size="md" />
        </div>
      </MatrixEquationRow>
    </MathVisualCard>
  );
}

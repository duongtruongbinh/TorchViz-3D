import { useState } from 'react';
import { Vector, Line, Text, vec } from 'mafs';
import { InlineMath, BlockMath, useLearningMdxTheme } from '../../learningMdxComponents';
import { getMathVisualTheme } from './theme';
import { MathCanvas } from './primitives/MathCanvas';
import { MathVisualCard, MathInfoPanel } from './primitives/MathVisualCard';
import { MathStepperControls } from './primitives/MathStepperControls';
import { AngleArc } from './primitives/AngleArc';
import { RightAngleMarker } from './primitives/RightAngleMarker';
import type {
  OrthogonalityExplorerProps,
  ProjectionExplorerProps,
  GramSchmidtExplorerProps,
  LeastSquaresExplorerProps,
  Vector2D,
} from './types';

// ==========================================
// 6. OrthogonalityExplorer
// ==========================================
export function OrthogonalityExplorer({
  ariaLabel,
}: OrthogonalityExplorerProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const u: Vector2D = [1, 1];
  const v: Vector2D = [1, -1];
  const dot = vec.dot(u, v);

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Hai Vector Vuông góc (Trực giao)"
      subtitle="Hai vector u và v vuông góc với nhau khi và chỉ khi tích vô hướng uᵀv = 0."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono">
          <div>
            <InlineMath
              formula={`\\mathbf{u}^\\top\\mathbf{v} = (${u[0]}\\times ${v[0]}) + (${u[1]}\\times ${v[1]}) = `}
            />
            <span className="font-bold text-emerald-600 text-base">
              {dot.toFixed(1)}
            </span>
          </div>
          <div className="text-slate-500 font-sans">
            Góc giữa hai vector: <InlineMath formula="\theta = 90^\circ" /> (<InlineMath formula="\cos 90^\circ = 0" />)
          </div>
        </div>
      }
    >
      <MathCanvas
        ariaLabel={ariaLabel}
        minX={-1}
        maxX={2.5}
        minY={-2}
        maxY={2}
        height={300}
      >
        {/* Right angle corner box */}
        <RightAngleMarker vertex={[0, 0]} directionA={u} directionB={v} size={0.3} />

        {/* Vector u */}
        <Vector tail={[0, 0]} tip={u} color={theme.vectorU} weight={3.5} />
        <Text x={u[0]} y={u[1]} size={14} color={theme.vectorU} attach="ne">
          u = [1, 1]ᵀ
        </Text>

        {/* Vector v */}
        <Vector tail={[0, 0]} tip={v} color={theme.vectorV} weight={3.5} />
        <Text x={v[0]} y={v[1]} size={14} color={theme.vectorV} attach="se">
          v = [1, -1]ᵀ
        </Text>
      </MathCanvas>
    </MathVisualCard>
  );
}

// ==========================================
// 7. ProjectionExplorer
// ==========================================
export function ProjectionExplorer({
  ariaLabel,
}: ProjectionExplorerProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const b: Vector2D = [1, 3];
  const a: Vector2D = [2, 1];

  // Projection formula: p = (a.b / a.a) * a
  const scalar = vec.dot(a, b) / vec.dot(a, a); // 5 / 5 = 1
  const p: Vector2D = vec.scale(a, scalar); // [2, 1]
  const e: Vector2D = vec.sub(b, p); // [-1, 2]

  const magB2 = vec.dot(b, b); // 10
  const magP2 = vec.dot(p, p); // 5
  const magE2 = vec.dot(e, e); // 5

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Hình chiếu Trực giao lên Đường thẳng (Orthogonal Projection)"
      subtitle="Hình chiếu p là điểm gần b nhất trên đường thẳng sinh bởi a, với sai số e vuông góc với a."
      footer={
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
            <div>
              <InlineMath formula="\mathbf{p} = \frac{\mathbf{a}^\top\mathbf{b}}{\mathbf{a}^\top\mathbf{a}}\mathbf{a} = \frac{5}{5}[2, 1]^\top = [2, 1]^\top" />
            </div>
            <div className="text-emerald-600 font-semibold">
              <InlineMath formula="\mathbf{e} = \mathbf{b} - \mathbf{p} = [-1, 2]^\top \perp \mathbf{a}" />
            </div>
          </div>
          <div className="border-t pt-2 border-slate-200 text-xs text-slate-500 font-mono flex justify-between">
            <span>
              Định lý Pythagoras: <InlineMath formula={`\\|\\mathbf{b}\\|^2 = \\|\\mathbf{p}\\|^2 + \\|\\mathbf{e}\\|^2 \\; (${magB2} = ${magP2} + ${magE2})`} />
            </span>
            <span>
              <InlineMath formula="\mathbf{a}^\top\mathbf{e} = 2(-1) + 1(2) = 0" />
            </span>
          </div>
        </div>
      }
    >
      <MathCanvas
        ariaLabel={ariaLabel}
        minX={-2}
        maxX={4}
        minY={-1}
        maxY={4}
        height={300}
      >
        {/* Infinite subspace line spanned by a */}
        <Line.ThroughPoints
          point1={[-2, -1]}
          point2={[4, 2]}
          color="rgba(148, 163, 184, 0.4)"
          style="dashed"
        />

        {/* Right angle marker at projection p */}
        <RightAngleMarker vertex={p} directionA={a} directionB={e} size={0.3} />

        {/* Orthogonal error segment connecting p and b */}
        <Line.Segment
          point1={p}
          point2={b}
          color="#f43f5e"
          style="dashed"
          weight={2}
        />

        {/* Vector a */}
        <Vector tail={[0, 0]} tip={a} color={theme.vectorU} weight={3} />
        <Text x={a[0]} y={a[1]} size={14} color={theme.vectorU} attach="se">
          a
        </Text>

        {/* Vector b */}
        <Vector tail={[0, 0]} tip={b} color={theme.vectorV} weight={3.5} />
        <Text x={b[0]} y={b[1]} size={15} color={theme.vectorV} attach="nw">
          b = [1, 3]ᵀ
        </Text>

        {/* Projection p */}
        <Vector tail={[0, 0]} tip={p} color="#10b981" weight={4} />
        <Text x={p[0]} y={p[1]} size={14} color="#10b981" attach="ne">
          p = [2, 1]ᵀ
        </Text>

        {/* Error vector e from p to b */}
        <Text
          x={(p[0] + b[0]) / 2}
          y={(p[1] + b[1]) / 2}
          size={14}
          color="#f43f5e"
          attach="ne"
        >
          e = b - p
        </Text>
      </MathCanvas>
    </MathVisualCard>
  );
}

// ==========================================
// 8. GramSchmidtExplorer
// ==========================================
export function GramSchmidtExplorer({
  ariaLabel,
}: GramSchmidtExplorerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const a1: Vector2D = [1, 1];
  const a2: Vector2D = [1, 0];

  const q1: Vector2D = [1 / Math.SQRT2, 1 / Math.SQRT2]; // approx [0.707, 0.707]
  const p2: Vector2D = [0.5, 0.5]; // projection of a2 onto q1
  const u2: Vector2D = [0.5, -0.5]; // a2 - p2
  const q2: Vector2D = [1 / Math.SQRT2, -1 / Math.SQRT2]; // approx [0.707, -0.707]

  const steps = [
    {
      title: 'Bước 0: Hai vector cơ sở ban đầu a₁ và a₂',
      math: '\\mathbf{a}_1 = \\begin{bmatrix}1\\\\1\\end{bmatrix}, \\quad \\mathbf{a}_2 = \\begin{bmatrix}1\\\\0\\end{bmatrix}',
      desc: 'Hai vector a₁ và a₂ độc lập tuyến tính nhưng không trực giao (a₁ᵀa₂ = 1 ≠ 0).',
    },
    {
      title: 'Bước 1: Chuẩn hóa vector đầu tiên q₁ = a₁ / ||a₁||',
      math: '\\mathbf{q}_1 = \\frac{\\mathbf{a}_1}{\\|\\mathbf{a}_1\\|} = \\frac{1}{\\sqrt{2}}\\begin{bmatrix}1\\\\1\\end{bmatrix} \\approx \\begin{bmatrix}0.71\\\\0.71\\end{bmatrix}',
      desc: 'Vector q₁ có độ dài đúng bằng 1 và giữ nguyên hướng của a₁.',
    },
    {
      title: 'Bước 2: Tìm hình chiếu của a₂ lên q₁',
      math: '\\mathbf{p}_2 = (\\mathbf{q}_1^\\top\\mathbf{a}_2)\\mathbf{q}_1 = \\frac{1}{\\sqrt{2}}\\mathbf{q}_1 = \\begin{bmatrix}0.5\\\\0.5\\end{bmatrix}',
      desc: 'Thành phần của a₂ song song với hướng q₁.',
    },
    {
      title: 'Bước 3: Khử thành phần chiếu để tạo vector trực giao u₂ = a₂ - p₂',
      math: '\\mathbf{u}_2 = \\mathbf{a}_2 - \\mathbf{p}_2 = \\begin{bmatrix}1\\\\0\\end{bmatrix} - \\begin{bmatrix}0.5\\\\0.5\\end{bmatrix} = \\begin{bmatrix}0.5\\\\-0.5\\end{bmatrix}',
      desc: 'Vector u₂ vuông góc hoàn toàn với q₁ (q₁ᵀu₂ = 0).',
    },
    {
      title: 'Bước 4: Chuẩn hóa u₂ để được cơ sở trực chuẩn Q = [q₁  q₂]',
      math: '\\mathbf{q}_2 = \\frac{\\mathbf{u}_2}{\\|\\mathbf{u}_2\\|} = \\frac{1}{\\sqrt{2}}\\begin{bmatrix}1\\\\-1\\end{bmatrix}, \\quad Q^\\top Q = I',
      desc: 'Tập {q₁, q₂} tạo thành cơ sở trực chuẩn hoàn hảo cho ℝ².',
    },
  ];

  const currentStep = steps[stepIndex];

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Thuật toán Trực giao hóa Gram-Schmidt"
      subtitle={currentStep.title}
      footer={
        <div className="space-y-3 w-full">
          <MathInfoPanel>
            <div className="text-center font-mono py-1">
              <BlockMath formula={currentStep.math} />
            </div>
            <p className="text-slate-600 text-center">
              {currentStep.desc}
            </p>
          </MathInfoPanel>

          <MathStepperControls
            currentStep={stepIndex}
            totalSteps={steps.length}
            onStepChange={setStepIndex}
          />
        </div>
      }
    >
      <MathCanvas
        ariaLabel={ariaLabel}
        minX={-1}
        maxX={2}
        minY={-1.5}
        maxY={2}
        height={300}
      >
        {/* Step 0: a1 and a2 */}
        {stepIndex === 0 && (
          <>
            <Vector tail={[0, 0]} tip={a1} color={theme.vectorU} weight={3.5} />
            <Text x={a1[0]} y={a1[1]} size={14} color={theme.vectorU} attach="ne">
              a₁ = [1, 1]ᵀ
            </Text>

            <Vector tail={[0, 0]} tip={a2} color={theme.vectorV} weight={3.5} />
            <Text x={a2[0]} y={a2[1]} size={14} color={theme.vectorV} attach="se">
              a₂ = [1, 0]ᵀ
            </Text>
          </>
        )}

        {/* Step 1: q1 */}
        {stepIndex === 1 && (
          <>
            <Vector tail={[0, 0]} tip={a1} color="rgba(148, 163, 184, 0.4)" style="dashed" weight={2} />
            <Vector tail={[0, 0]} tip={q1} color="#3b82f6" weight={4} />
            <Text x={q1[0]} y={q1[1]} size={14} color="#3b82f6" attach="ne">
              q₁ = a₁ / √2
            </Text>

            <Vector tail={[0, 0]} tip={a2} color={theme.vectorV} weight={3} />
            <Text x={a2[0]} y={a2[1]} size={14} color={theme.vectorV} attach="se">
              a₂
            </Text>
          </>
        )}

        {/* Step 2: projection p2 */}
        {stepIndex === 2 && (
          <>
            <Vector tail={[0, 0]} tip={q1} color="#3b82f6" weight={3} />
            <Vector tail={[0, 0]} tip={a2} color={theme.vectorV} weight={3} />

            <Line.Segment point1={a2} point2={p2} color="#f43f5e" style="dashed" weight={2} />
            <Vector tail={[0, 0]} tip={p2} color="#10b981" weight={4} />
            <Text x={p2[0]} y={p2[1]} size={14} color="#10b981" attach="ne">
              p₂ = (q₁ᵀa₂)q₁
            </Text>
          </>
        )}

        {/* Step 3: u2 */}
        {stepIndex === 3 && (
          <>
            <Vector tail={[0, 0]} tip={q1} color="#3b82f6" weight={3} />
            <Text x={q1[0]} y={q1[1]} size={14} color="#3b82f6" attach="ne">
              q₁
            </Text>

            <Vector tail={[0, 0]} tip={u2} color="#ec4899" weight={4} />
            <Text x={u2[0]} y={u2[1]} size={14} color="#ec4899" attach="se">
              u₂ = a₂ - p₂
            </Text>

            <AngleArc v1={q1} v2={u2} label="90°" color="#ec4899" />
          </>
        )}

        {/* Step 4: q1 and q2 */}
        {stepIndex === 4 && (
          <>
            <Vector tail={[0, 0]} tip={q1} color="#3b82f6" weight={4} />
            <Text x={q1[0]} y={q1[1]} size={14} color="#3b82f6" attach="ne">
              q₁
            </Text>

            <Vector tail={[0, 0]} tip={q2} color="#10b981" weight={4} />
            <Text x={q2[0]} y={q2[1]} size={14} color="#10b981" attach="se">
              q₂
            </Text>

            <AngleArc v1={q1} v2={q2} label="90°" color="#10b981" />
          </>
        )}
      </MathCanvas>
    </MathVisualCard>
  );
}

// ==========================================
// 9. LeastSquaresExplorer
// ==========================================
export function LeastSquaresExplorer({
  ariaLabel,
}: LeastSquaresExplorerProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const b: Vector2D = [1, 3];
  const a: Vector2D = [2, 1];
  const xHat = 1; // scalar best estimate
  const p: Vector2D = vec.scale(a, xHat); // [2, 1] = Ax_hat
  const e: Vector2D = vec.sub(b, p); // [-1, 2]

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Phương pháp Bình phương Tối thiểu (Least Squares)"
      subtitle="Khi b không nằm trong Col(A), nghiệm x̂ làm tối thiểu hóa khoảng cách ||Ax - b||."
      footer={
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
            <div>
              Hệ phương trình chuẩn: <InlineMath formula="A^\top A\hat{\mathbf{x}} = A^\top\mathbf{b}" />
            </div>
            <div className="text-emerald-600 font-semibold">
              <InlineMath formula="\hat{\mathbf{b}} = A\hat{\mathbf{x}} = [2, 1]^\top" />
            </div>
          </div>
          <p className="text-slate-500 text-xs border-t pt-2 border-slate-200">
            Vector sai số <InlineMath formula="\mathbf{e} = \mathbf{b} - A\hat{\mathbf{x}} = [-1, 2]^\top" /> trực giao hoàn toàn với không gian cột <InlineMath formula="\operatorname{Col}(A)" /> (<InlineMath formula="A^\top\mathbf{e} = \mathbf{0}" />).
          </p>
        </div>
      }
    >
      <MathCanvas
        ariaLabel={ariaLabel}
        minX={-2}
        maxX={4}
        minY={-1}
        maxY={4}
        height={300}
      >
        {/* Column space Col(A) */}
        <Line.ThroughPoints
          point1={[-2, -1]}
          point2={[4, 2]}
          color="#3b82f6"
          weight={2.5}
        />
        <Text x={3} y={1.2} size={14} color="#3b82f6" attach="se">
          Col(A)
        </Text>

        {/* Right angle marker */}
        <RightAngleMarker vertex={p} directionA={a} directionB={e} size={0.3} />

        {/* Residual line */}
        <Line.Segment point1={p} point2={b} color="#f43f5e" style="dashed" weight={2} />

        {/* Target b outside Col(A) */}
        <Vector tail={[0, 0]} tip={b} color={theme.vectorV} weight={3.5} />
        <Text x={b[0]} y={b[1]} size={15} color={theme.vectorV} attach="nw">
          b (b ∉ Col(A))
        </Text>

        {/* Best approximation Ax_hat */}
        <Vector tail={[0, 0]} tip={p} color="#10b981" weight={4} />
        <Text x={p[0]} y={p[1]} size={14} color="#10b981" attach="ne">
          Ax̂ = [2, 1]ᵀ
        </Text>

        {/* Error e */}
        <Text
          x={(p[0] + b[0]) / 2}
          y={(p[1] + b[1]) / 2}
          size={14}
          color="#f43f5e"
          attach="ne"
        >
          e ⊥ Col(A)
        </Text>
      </MathCanvas>
    </MathVisualCard>
  );
}

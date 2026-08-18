import { useState } from 'react';
import { Vector, Text, Polygon, vec } from 'mafs';
import { InlineMath, BlockMath, useLearningMdxTheme } from '../../learningMdxComponents';
import { getMathVisualTheme } from './theme';
import { MathCanvas } from './primitives/MathCanvas';
import { MathVisualCard } from './primitives/MathVisualCard';
import { MathSegmentedControl } from './primitives/MathSegmentedControl';
import { MatrixGrid } from './primitives/MatrixGrid';
import type {
  DeterminantAreaExplorerProps,
  DeterminantRowOpsExplorerProps,
  Vector2D,
} from './types';

// ==========================================
// 10. DeterminantAreaExplorer
// ==========================================
export function DeterminantAreaExplorer({
  ariaLabel,
  interactive = true,
}: DeterminantAreaExplorerProps) {
  const [preset, setPreset] = useState<'positive' | 'negative' | 'zero'>('positive');
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const configs = {
    positive: {
      name: 'Định thức dương: det(A) = +3',
      mat: [
        [2, 1],
        [1, 2],
      ],
      det: 3,
      desc: 'Hai cột bảo toàn chiều quay ngược chiều kim đồng hồ (định hướng dương). Tỷ lệ giãn diện tích = 3.',
    },
    negative: {
      name: 'Định thức âm: det(A) = -3',
      mat: [
        [1, 2],
        [2, 1],
      ],
      det: -3,
      desc: 'Ma trận làm đổi định hướng không gian (định hướng âm). Diện tích hình học = |-3| = 3.',
    },
    zero: {
      name: 'Định thức bằng 0: det(A) = 0',
      mat: [
        [2, 1],
        [2, 1],
      ],
      det: 0,
      desc: 'Hai cột cùng phương (cột 1 = 2 × cột 2), hình bình hành 2D bị xẹp xuống thành đoạn thẳng 1D, diện tích = 0.',
    },
  };

  const current = configs[preset];
  const col1: Vector2D = [current.mat[0][0], current.mat[1][0]];
  const col2: Vector2D = [current.mat[0][1], current.mat[1][1]];
  const corner: Vector2D = vec.add(col1, col2);

  const belowPlot = (
    <div className="flex flex-col gap-3 w-full">
      {interactive && (
        <div className="flex justify-center">
          <MathSegmentedControl
            value={preset}
            onChange={setPreset}
            ariaLabel="Chọn cấu hình ma trận định thức"
            options={[
              { value: 'positive', label: 'det(A) > 0' },
              { value: 'negative', label: 'det(A) < 0' },
              { value: 'zero', label: 'det(A) = 0' },
            ]}
          />
        </div>
      )}

      <div className="rounded-lg p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 font-mono pb-1 border-b border-slate-200 dark:border-slate-800">
          <div className="font-semibold text-blue-600 dark:text-blue-400">
            {current.name}
          </div>
          <div className="font-bold text-sm">
            <InlineMath
              formula={`\\det(A) = (${col1[0]}\\times ${col2[1]}) - (${col2[0]}\\times ${col1[1]}) = ${current.det}`}
            />
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          {current.desc}
        </p>
      </div>
    </div>
  );

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Ý nghĩa Hình học của Định thức (Định thức là Diện tích)"
      subtitle="Định thức đo lường tỷ lệ co giãn diện tích và định hướng không gian của phép biến đổi tuyến tính."
      footer={belowPlot}
    >
      <div className="w-full flex flex-col md:flex-row items-center justify-around gap-4 py-2">
        <div className="flex flex-col items-center gap-1">
          <MatrixGrid name="A" values={current.mat} size="md" />
        </div>

        <div className="w-full max-w-sm flex justify-center">
          <MathCanvas
            ariaLabel={ariaLabel}
            minX={-1}
            maxX={4}
            minY={-1}
            maxY={4}
            height={260}
          >
            {/* Original unit square */}
            <Polygon
              points={[
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
              ]}
              color="rgba(148, 163, 184, 0.2)"
            />

            {/* Parallelogram */}
            <Polygon
              points={[
                [0, 0],
                col1,
                corner,
                col2,
              ]}
              color={preset === 'zero' ? '#ec4899' : '#3b82f6'}
            />

            {/* Column 1 */}
            <Vector tail={[0, 0]} tip={col1} color={theme.vectorU} weight={3} />
            <Text x={col1[0]} y={col1[1]} size={13} color={theme.vectorU} attach="se">
              a₁
            </Text>

            {/* Column 2 */}
            <Vector tail={[0, 0]} tip={col2} color={theme.vectorV} weight={3} />
            <Text x={col2[0]} y={col2[1]} size={13} color={theme.vectorV} attach="nw">
              a₂
            </Text>
          </MathCanvas>
        </div>
      </div>
    </MathVisualCard>
  );
}

// ==========================================
// 11. DeterminantRowOpsExplorer
// ==========================================
export function DeterminantRowOpsExplorer({
  ariaLabel,
  interactive = true,
}: DeterminantRowOpsExplorerProps) {
  const [selectedOp, setSelectedOp] = useState<'original' | 'swap' | 'scale' | 'add'>('original');

  const operations = {
    original: {
      title: 'Ma trận gốc A',
      mat: [
        [2, 4],
        [1, 3],
      ],
      det: 2,
      formula: '\\det(A) = (2\\times 3) - (4\\times 1) = 2',
      rule: 'Giá trị định thức gốc ban đầu bằng 2.',
    },
    swap: {
      title: '1. Đổi chỗ 2 hàng: R₁ ↔ R₂',
      mat: [
        [1, 3],
        [2, 4],
      ],
      det: -2,
      formula: '\\det(B) = (1\\times 4) - (3\\times 2) = -2 = -\\det(A)',
      rule: 'Đổi chỗ hai hàng làm đổi dấu định thức: det(B) = -det(A).',
    },
    scale: {
      title: '2. Nhân một hàng với hệ số c = 3: R₁ ← 3R₁',
      mat: [
        [6, 12],
        [1, 3],
      ],
      det: 6,
      formula: '\\det(B) = (6\\times 3) - (12\\times 1) = 6 = 3\\det(A)',
      rule: 'Nhân một hàng với c làm định thức tăng gấp c lần: det(B) = c · det(A).',
    },
    add: {
      title: '3. Cộng bội số hàng này vào hàng khác: R₁ ← R₁ - 2R₂',
      mat: [
        [0, -2],
        [1, 3],
      ],
      det: 2,
      formula: '\\det(B) = (0\\times 3) - (-2\\times 1) = 2 = \\det(A)',
      rule: 'Phép cộng bội số của hàng này vào hàng khác không làm thay đổi định thức.',
    },
  };

  const current = operations[selectedOp];

  return (
    <MathVisualCard
      ariaLabel={ariaLabel}
      title="Ảnh hưởng của 3 Phép Biến đổi Hàng lên Định thức"
      subtitle="Hiểu rõ 3 tính chất then chốt khi sử dụng phép khử Gauss để tính định thức."
      footer={
        <div className="space-y-3 w-full">
          {interactive && (
            <div className="flex justify-center">
              <MathSegmentedControl
                value={selectedOp}
                onChange={setSelectedOp}
                ariaLabel="Chọn phép biến đổi hàng"
                options={[
                  { value: 'original', label: 'Gốc A' },
                  { value: 'swap', label: 'Đổi hàng (-det)' },
                  { value: 'scale', label: 'Nhân hệ số (c·det)' },
                  { value: 'add', label: 'Cộng hàng (det giữ nguyên)' },
                ]}
              />
            </div>
          )}

          <div className="rounded-lg p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-xs sm:text-sm">
            <div className="font-semibold text-blue-600 dark:text-blue-400 pb-1">
              {current.title}
            </div>
            <div className="text-center font-mono py-1.5">
              <BlockMath formula={current.formula} />
            </div>
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold text-center pt-1">
              {current.rule}
            </p>
          </div>
        </div>
      }
    >
      <div className="py-2 flex items-center justify-center">
        <MatrixGrid
          name={selectedOp === 'original' ? 'A' : 'B'}
          values={current.mat}
          size="lg"
        />
      </div>
    </MathVisualCard>
  );
}

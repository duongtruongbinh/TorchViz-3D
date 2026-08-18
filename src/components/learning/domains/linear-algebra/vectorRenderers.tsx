import { useState } from 'react';
import {
  Vector,
  Point,
  Line,
  Circle,
  Polygon,
  Text,
  useMovablePoint,
  vec,
} from 'mafs';
import { InlineMath, useLearningMdxTheme } from '../../learningMdxComponents';
import { getMathVisualTheme } from './theme';
import { MathPlane } from './primitives/MathPlane';
import { AngleArc } from './primitives/AngleArc';
import {
  cosine2D,
  coordinatesInOrthonormalBasis,
  clampZero,
} from './geometry/vectorMath';
import type {
  VectorPlaneProps,
  CoordinateRepresentationDiagramProps,
  VectorAdditionPlaneProps,
  ScalarVectorPlaneProps,
  VectorSubtractionPlaneProps,
  VectorNormPlaneProps,
  L2NormTriangleProps,
  DistancePlaneProps,
  NormUnitBallDiagramProps,
  NormalizationPlaneProps,
  UnitVectorPlaneProps,
  NormalizationProcessProps,
  DotProductPlaneProps,
  DotProductAngleExplorerProps,
  CosineMotivationDiagramProps,
  CosineAngleExplorerProps,
  EmbeddingCosineDiagramProps,
  Vector2D,
} from './types';

// Helper for interactive VectorPlane
function InteractiveVectorPlaneMovable({
  initial,
  label,
  showComponents,
  color,
  onPosChange,
}: {
  initial: Vector2D;
  label: string;
  showComponents: boolean;
  color: string;
  onPosChange: (p: Vector2D) => void;
}) {
  const point = useMovablePoint(initial, {
    constrain: ([px, py]) => {
      const snapped: vec.Vector2 = [
        Math.round(Math.max(-1, Math.min(5, px)) * 2) / 2,
        Math.round(Math.max(-1, Math.min(5, py)) * 2) / 2,
      ];
      onPosChange(snapped);
      return snapped;
    },
  });

  return (
    <>
      {showComponents && (
        <>
          <Line.Segment
            point1={[point.x, 0]}
            point2={point.point}
            style="dashed"
            color="rgba(148, 163, 184, 0.6)"
          />
          <Line.Segment
            point1={[0, point.y]}
            point2={point.point}
            style="dashed"
            color="rgba(148, 163, 184, 0.6)"
          />
        </>
      )}
      <Vector tail={[0, 0]} tip={point.point} color={color} weight={3} />
      <Text x={point.x} y={point.y} size={15} color={color} attach="ne">
        {label}
      </Text>
      {point.element}
    </>
  );
}

// 1. VectorPlane
export function VectorPlane({
  ariaLabel,
  x = 3,
  y = 2,
  label = 'v',
  showComponents = true,
  interactive = true,
}: VectorPlaneProps) {
  const [currentPos, setCurrentPos] = useState<Vector2D>([x, y]);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const length = vec.mag(currentPos).toFixed(2);
  const rad = Math.atan2(currentPos[1], currentPos[0]);
  const deg = (
    (rad * 180) / Math.PI +
    (currentPos[1] < 0 ? 360 : 0)
  ).toFixed(1);

  const belowPlot = (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-xs sm:text-sm font-mono border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          Vector:
        </span>
        <span>
          <InlineMath
            formula={`\\mathbf{${label}} = [${currentPos[0]}, ${currentPos[1]}]^\\top`}
          />
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-500">Độ dài L₂:</span>
        <span>{length}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-500">Góc:</span>
        <span>{deg}°</span>
      </div>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-1}
      maxX={5}
      minY={-1}
      maxY={5}
      belowPlot={belowPlot}
    >
      {interactive ? (
        <InteractiveVectorPlaneMovable
          initial={[x, y]}
          label={label}
          showComponents={showComponents}
          color={theme.vectorU}
          onPosChange={setCurrentPos}
        />
      ) : (
        <>
          {showComponents && (
            <>
              <Line.Segment
                point1={[currentPos[0], 0]}
                point2={currentPos}
                style="dashed"
                color="rgba(148, 163, 184, 0.6)"
              />
              <Line.Segment
                point1={[0, currentPos[1]]}
                point2={currentPos}
                style="dashed"
                color="rgba(148, 163, 184, 0.6)"
              />
            </>
          )}
          <Vector tail={[0, 0]} tip={currentPos} color={theme.vectorU} weight={3} />
          <Text
            x={currentPos[0]}
            y={currentPos[1]}
            size={15}
            color={theme.vectorU}
            attach="ne"
          >
            {label}
          </Text>
        </>
      )}
    </MathPlane>
  );
}

// 2. CoordinateRepresentationDiagram
export function CoordinateRepresentationDiagram({
  ariaLabel,
}: CoordinateRepresentationDiagramProps) {
  const [basisMode, setBasisMode] = useState<'standard' | 'rotated'>('standard');
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const fixedVector: Vector2D = [3, 2];
  const phi = (15 * Math.PI) / 180;
  const b1: vec.Vector2 = [Math.cos(phi), Math.sin(phi)];
  const b2: vec.Vector2 = [-Math.sin(phi), Math.cos(phi)];

  const rotatedCoords = coordinatesInOrthonormalBasis(fixedVector, b1, b2);
  const dispCoord1 = rotatedCoords[0].toFixed(2);
  const dispCoord2 = rotatedCoords[1].toFixed(2);

  const p1 = vec.scale(b1, rotatedCoords[0]);
  const p2 = vec.scale(b2, rotatedCoords[1]);

  const belowPlot = (
    <>
      <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Hệ trục:</span>
          <div className="inline-flex rounded-lg border border-slate-300 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setBasisMode('standard')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                basisMode === 'standard'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Chuẩn (e₁, e₂)
            </button>
            <button
              type="button"
              onClick={() => setBasisMode('rotated')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                basisMode === 'rotated'
                  ? 'bg-white dark:bg-slate-700 shadow-xs text-amber-600 dark:text-amber-400'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Hệ trục mới (b₁, b₂)
            </button>
          </div>
        </div>
        <div className="font-mono text-xs">
          {basisMode === 'standard' ? (
            <InlineMath formula="[v]_{\mathcal{E}} = [3, 2]^\top" />
          ) : (
            <InlineMath
              formula={`[v]_{\\mathcal{B}} \\approx [${dispCoord1}, ${dispCoord2}]^\\top`}
            />
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500 text-center">
        Vector hình học giữ nguyên hướng và độ dài trong không gian, chỉ các thành phần tọa độ thay đổi theo hệ cơ sở được chọn.
      </p>
    </>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-1}
      maxX={5}
      minY={-1}
      maxY={5}
      belowPlot={belowPlot}
    >
      <Vector tail={[0, 0]} tip={fixedVector} color={theme.vectorU} weight={3} />
      <Text x={fixedVector[0]} y={fixedVector[1]} size={15} color={theme.vectorU} attach="ne">
        v
      </Text>

      {basisMode === 'standard' ? (
        <>
          <Line.Segment
            point1={[fixedVector[0], 0]}
            point2={fixedVector}
            style="dashed"
            color="rgba(148, 163, 184, 0.6)"
          />
          <Line.Segment
            point1={[0, fixedVector[1]]}
            point2={fixedVector}
            style="dashed"
            color="rgba(148, 163, 184, 0.6)"
          />
        </>
      ) : (
        <>
          {/* Rotated basis directions */}
          <Line.Segment
            point1={[0, 0]}
            point2={vec.scale(b1, 4.8)}
            style="dashed"
            color={theme.vectorV}
            weight={2}
          />
          <Line.Segment
            point1={[0, 0]}
            point2={vec.scale(b2, 4.8)}
            style="dashed"
            color={theme.vectorV}
            weight={2}
          />
          <Text x={b1[0] * 4.8} y={b1[1] * 4.8} size={13} color={theme.vectorV} attach="ne">
            b₁
          </Text>
          <Text x={b2[0] * 4.8} y={b2[1] * 4.8} size={13} color={theme.vectorV} attach="nw">
            b₂
          </Text>
          {/* Projections onto b1, b2 */}
          <Line.Segment
            point1={fixedVector}
            point2={p1}
            style="dashed"
            color="rgba(148, 163, 184, 0.6)"
          />
          <Line.Segment
            point1={fixedVector}
            point2={p2}
            style="dashed"
            color="rgba(148, 163, 184, 0.6)"
          />
        </>
      )}
    </MathPlane>
  );
}

// 3. VectorAdditionPlane
export function VectorAdditionPlane({
  ariaLabel,
  u = [2, 1],
  v = [1, 3],
  showParallelogram = true,
}: VectorAdditionPlaneProps) {
  const [showP, setShowP] = useState(showParallelogram);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const sum = vec.add(u, v);

  const belowPlot = (
    <div className="mt-3 flex items-center justify-between border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={showP}
          onChange={(e) => setShowP(e.target.checked)}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <span className="text-slate-600 dark:text-slate-400">
          Hiện quy tắc hình bình hành
        </span>
      </label>
      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
        [{u[0]}+{v[0]}, {u[1]}+{v[1]}]ᵀ = [{sum[0]}, {sum[1]}]ᵀ
      </span>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-1}
      maxX={5}
      minY={-1}
      maxY={5}
      belowPlot={belowPlot}
    >
      <Vector tail={[0, 0]} tip={u} color={theme.vectorU} weight={3} />
      <Text x={u[0]} y={u[1]} size={14} color={theme.vectorU} attach="se">
        u
      </Text>

      <Vector tail={u} tip={sum} color={theme.vectorV} style="dashed" weight={2} />
      <Text x={(u[0] + sum[0]) / 2} y={(u[1] + sum[1]) / 2} size={14} color={theme.vectorV} attach="nw">
        v
      </Text>

      <Vector tail={[0, 0]} tip={sum} color={theme.vectorW} weight={3.5} />
      <Text x={sum[0]} y={sum[1]} size={15} color={theme.vectorW} attach="ne">
        u + v
      </Text>

      {showP && (
        <>
          <Line.Segment
            point1={[0, 0]}
            point2={v}
            style="dashed"
            color="rgba(148, 163, 184, 0.5)"
          />
          <Line.Segment
            point1={v}
            point2={sum}
            style="dashed"
            color="rgba(148, 163, 184, 0.5)"
          />
        </>
      )}
    </MathPlane>
  );
}

// 4. ScalarVectorPlane
export function ScalarVectorPlane({
  ariaLabel,
  v = [2, 1],
  defaultAlpha = 1.5,
}: ScalarVectorPlaneProps) {
  const [alpha, setAlpha] = useState(defaultAlpha);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const scaled = vec.scale(v, alpha);

  const belowPlot = (
    <div className="mt-3 flex flex-col gap-2 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold">
          Hệ số vô hướng <InlineMath formula={`\\alpha = ${alpha.toFixed(1)}`} />:
        </span>
        <span className="font-mono text-xs">
          {alpha > 0 && 'Cùng hướng với v, thay đổi độ dài'}
          {alpha === 0 && 'Vector không (0, 0)'}
          {alpha < 0 && 'Đảo ngược hướng 180°'}
        </span>
      </div>
      <input
        type="range"
        min="-2"
        max="2"
        step="0.2"
        value={alpha}
        onChange={(e) => setAlpha(Number(e.target.value))}
        className="w-full accent-amber-500"
        aria-label="Hệ số vô hướng alpha"
      />
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-4}
      maxX={5}
      minY={-3}
      maxY={4}
      belowPlot={belowPlot}
    >
      <Vector
        tail={[0, 0]}
        tip={v}
        color={theme.vectorU}
        style={alpha !== 1 ? 'dashed' : 'solid'}
        weight={2}
      />
      <Text x={v[0]} y={v[1]} size={14} color={theme.vectorU} attach="ne">
        v
      </Text>

      {Math.abs(alpha) > 0.05 && (
        <>
          <Vector
            tail={[0, 0]}
            tip={scaled}
            color={alpha >= 0 ? theme.vectorV : theme.vectorW}
            weight={3.5}
          />
          <Text
            x={scaled[0]}
            y={scaled[1]}
            size={15}
            color={alpha >= 0 ? theme.vectorV : theme.vectorW}
            attach={alpha >= 0 ? 'ne' : 'sw'}
          >
            αv
          </Text>
        </>
      )}
    </MathPlane>
  );
}

// 5. VectorSubtractionPlane
export function VectorSubtractionPlane({
  ariaLabel,
  u = [3, 2],
  v = [1, 3],
}: VectorSubtractionPlaneProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const diff = vec.sub(u, v);

  const belowPlot = (
    <div className="mt-3 flex items-center justify-between border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono">
      <div>
        <InlineMath
          formula={`\\mathbf{u} - \\mathbf{v} = [${u[0]}-${v[0]}, ${u[1]}-${v[1]}]^\\top = [${diff[0]}, ${diff[1]}]^\\top`}
        />
      </div>
      <div className="text-slate-500">Mũi tên nối từ đầu v sang đầu u</div>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-2}
      maxX={5}
      minY={-2}
      maxY={4}
      belowPlot={belowPlot}
    >
      <Vector tail={[0, 0]} tip={u} color={theme.vectorU} weight={3} />
      <Text x={u[0]} y={u[1]} size={14} color={theme.vectorU} attach="ne">
        u
      </Text>

      <Vector tail={[0, 0]} tip={v} color={theme.vectorV} weight={3} />
      <Text x={v[0]} y={v[1]} size={14} color={theme.vectorV} attach="nw">
        v
      </Text>

      <Vector tail={v} tip={u} color={theme.vectorW} weight={3.5} />
      <Text x={(v[0] + u[0]) / 2} y={(v[1] + u[1]) / 2} size={15} color={theme.vectorW} attach="se">
        u - v
      </Text>

      <Vector tail={[0, 0]} tip={diff} color={theme.vectorW} style="dashed" weight={2} />
    </MathPlane>
  );
}

// 6. VectorNormPlane (Reference component)
export function VectorNormPlane({
  ariaLabel,
  v1 = [2, 1],
  v2 = [4, 2],
}: VectorNormPlaneProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const len1 = vec.mag(v1).toFixed(2);
  const len2 = vec.mag(v2).toFixed(2);

  const belowPlot = (
    <div className="mt-3 flex items-center justify-around border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <div>
        <InlineMath formula={`\\|\\mathbf{v}_1\\|_2 = ${len1}`} />
      </div>
      <div>
        <InlineMath formula={`\\|\\mathbf{v}_2\\|_2 = 2\\|\\mathbf{v}_1\\|_2 = ${len2}`} />
      </div>
      <div className="text-slate-500 font-sans">Cùng hướng, khác độ dài</div>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-1}
      maxX={5}
      minY={-1}
      maxY={4}
      belowPlot={belowPlot}
    >
      <Vector tail={[0, 0]} tip={v1} color={theme.vectorU} weight={3.5} />
      <Text x={v1[0]} y={v1[1]} size={15} color={theme.vectorU} attach="ne">
        v₁
      </Text>

      <Vector tail={[0, 0]} tip={v2} color={theme.vectorV} style="dashed" weight={2.5} />
      <Text x={v2[0]} y={v2[1]} size={15} color={theme.vectorV} attach="ne">
        v₂
      </Text>
    </MathPlane>
  );
}

// 7. L2NormTriangle
export function L2NormTriangle({
  ariaLabel,
  v = [3, 4],
}: L2NormTriangleProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const hypotenuse = vec.mag(v).toFixed(1);

  const belowPlot = (
    <div className="mt-3 flex items-center justify-center border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <InlineMath
        formula={`\\|\\mathbf{v}\\|_2 = \\sqrt{${v[0]}^2 + ${v[1]}^2} = \\sqrt{${v[0] * v[0]} + ${v[1] * v[1]}} = ${hypotenuse}`}
      />
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-1}
      maxX={5}
      minY={-1}
      maxY={5}
      belowPlot={belowPlot}
    >
      {/* Triangle fill */}
      <Polygon
        points={[
          [0, 0],
          [v[0], 0],
          [v[0], v[1]],
        ]}
        color="#3b82f6"
      />

      {/* Right angle indicator */}
      <Line.Segment point1={[v[0] - 0.35, 0]} point2={[v[0] - 0.35, 0.35]} color="#64748b" />
      <Line.Segment point1={[v[0] - 0.35, 0.35]} point2={[v[0], 0.35]} color="#64748b" />

      {/* Legs */}
      <Line.Segment point1={[0, 0]} point2={[v[0], 0]} color="#64748b" weight={2} />
      <Text x={v[0] / 2} y={-0.3} size={14} color="#64748b" attach="s">
        {String(v[0])}
      </Text>

      <Line.Segment point1={[v[0], 0]} point2={v} color="#64748b" weight={2} />
      <Text x={v[0] + 0.3} y={v[1] / 2} size={14} color="#64748b" attach="w">
        {String(v[1])}
      </Text>

      {/* Hypotenuse */}
      <Vector tail={[0, 0]} tip={v} color={theme.vectorU} weight={3.5} />
      <Text x={v[0] / 2 - 0.3} y={v[1] / 2 + 0.3} size={15} color={theme.vectorU} attach="nw">
        ||v||₂ = 5
      </Text>
    </MathPlane>
  );
}

// 8. DistancePlane
export function DistancePlane({
  ariaLabel,
  p1 = [1, 1],
  p2 = [4, 4],
}: DistancePlaneProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const diff = vec.sub(p2, p1);
  const dist = vec.mag(diff).toFixed(2);

  const belowPlot = (
    <div className="mt-3 flex items-center justify-center border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <InlineMath
        formula={`d(\\mathbf{x}, \\mathbf{y}) = \\|\\mathbf{y} - \\mathbf{x}\\|_2 = \\sqrt{(${p2[0]}-${p1[0]})^2 + (${p2[1]}-${p1[1]})^2} = ${dist}`}
      />
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-0.5}
      maxX={5.5}
      minY={-0.5}
      maxY={5.5}
      belowPlot={belowPlot}
    >
      <Point x={p1[0]} y={p1[1]} color={theme.vectorU} />
      <Text x={p1[0]} y={p1[1]} size={14} color={theme.vectorU} attach="nw">
        x(1, 1)
      </Text>

      <Point x={p2[0]} y={p2[1]} color={theme.vectorV} />
      <Text x={p2[0]} y={p2[1]} size={14} color={theme.vectorV} attach="se">
        y(4, 4)
      </Text>

      <Vector tail={p1} tip={p2} color={theme.vectorW} weight={3.5} />
      <Text x={(p1[0] + p2[0]) / 2} y={(p1[1] + p2[1]) / 2} size={14} color={theme.vectorW} attach="se">
        y - x
      </Text>
    </MathPlane>
  );
}

// 9. NormUnitBallDiagram
export function NormUnitBallDiagram({ ariaLabel }: NormUnitBallDiagramProps) {
  const [selectedNorm, setSelectedNorm] = useState<'all' | 'l1' | 'l2' | 'linf'>('all');

  const showL1 = selectedNorm === 'all' || selectedNorm === 'l1';
  const showL2 = selectedNorm === 'all' || selectedNorm === 'l2';
  const showLinf = selectedNorm === 'all' || selectedNorm === 'linf';

  const belowPlot = (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setSelectedNorm('all')}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
            selectedNorm === 'all'
              ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          Tất cả
        </button>
        <button
          type="button"
          onClick={() => setSelectedNorm('l1')}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
            selectedNorm === 'l1'
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
          }`}
        >
          L₁ (Hình thoi)
        </button>
        <button
          type="button"
          onClick={() => setSelectedNorm('l2')}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
            selectedNorm === 'l2'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
          }`}
        >
          L₂ (Hình tròn)
        </button>
        <button
          type="button"
          onClick={() => setSelectedNorm('linf')}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
            selectedNorm === 'linf'
              ? 'bg-amber-600 text-white'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
          }`}
        >
          L∞ (Hình vuông)
        </button>
      </div>
      <div className="text-xs text-slate-500 font-mono">
        <InlineMath formula="\{\mathbf{x} : \|\mathbf{x}\| \le 1\}" />
      </div>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-2}
      maxX={2}
      minY={-2}
      maxY={2}
      belowPlot={belowPlot}
    >
      {showLinf && (
        <Polygon
          points={[
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ]}
          color="#f59e0b"
          strokeStyle="dashed"
        />
      )}
      {showL2 && (
        <Circle center={[0, 0]} radius={1} color="#3b82f6" />
      )}
      {showL1 && (
        <Polygon
          points={[
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1],
          ]}
          color="#10b981"
        />
      )}
    </MathPlane>
  );
}

// 10. NormalizationPlane
export function NormalizationPlane({
  ariaLabel,
  v = [3, 2],
}: NormalizationPlaneProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const len = vec.mag(v);
  const u = vec.normalize(v);

  const belowPlot = (
    <div className="mt-3 flex items-center justify-around border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <div>
        <InlineMath formula={`\\mathbf{v} = [${v[0]}, ${v[1]}]^\\top`} />
      </div>
      <div>
        <InlineMath formula={`\\|\\mathbf{v}\\|_2 \\approx ${len.toFixed(2)}`} />
      </div>
      <div>
        <InlineMath
          formula={`\\hat{\\mathbf{v}} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|_2} = [${u[0].toFixed(2)}, ${u[1].toFixed(2)}]^\\top`}
        />
      </div>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-1}
      maxX={4}
      minY={-1}
      maxY={3}
      belowPlot={belowPlot}
    >
      <Circle center={[0, 0]} radius={1} strokeStyle="dashed" color="rgba(148, 163, 184, 0.6)" />

      <Vector tail={[0, 0]} tip={v} color={theme.vectorU} weight={2.5} />
      <Text x={v[0]} y={v[1]} size={15} color={theme.vectorU} attach="ne">
        v
      </Text>

      <Vector tail={[0, 0]} tip={u} color={theme.vectorV} weight={3.5} />
      <Text x={u[0]} y={u[1]} size={15} color={theme.vectorV} attach="nw">
        v̂
      </Text>
    </MathPlane>
  );
}

// 11. UnitVectorPlane
export function UnitVectorPlane({ ariaLabel }: UnitVectorPlaneProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const belowPlot = (
    <div className="mt-3 flex items-center justify-around border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <div>
        <InlineMath formula="\|\mathbf{e}_1\|_2 = 1.0" />
      </div>
      <div>
        <InlineMath formula="\|\mathbf{e}_2\|_2 = 1.0" />
      </div>
      <div className="text-slate-500 font-sans">
        Đầu mút nằm chính xác trên đường tròn đơn vị
      </div>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-1.5}
      maxX={2}
      minY={-1.5}
      maxY={2}
      belowPlot={belowPlot}
    >
      <Circle center={[0, 0]} radius={1} strokeStyle="dashed" color="rgba(148, 163, 184, 0.6)" />

      <Vector tail={[0, 0]} tip={[1, 0]} color={theme.vectorU} weight={3.5} />
      <Text x={1} y={0} size={15} color={theme.vectorU} attach="ne">
        e₁
      </Text>

      <Vector tail={[0, 0]} tip={[0, 1]} color={theme.vectorV} weight={3.5} />
      <Text x={0} y={1} size={15} color={theme.vectorV} attach="nw">
        e₂
      </Text>
    </MathPlane>
  );
}

// 12. NormalizationProcess (HTML card)
export function NormalizationProcess({ ariaLabel }: NormalizationProcessProps) {
  return (
    <div
      className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">
        Quy trình chuẩn hóa vector <InlineMath formula="\mathbf{v} \to \hat{\mathbf{v}}" />
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
        <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-center">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-bold block mb-1">
            1. Vector gốc
          </span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            <InlineMath formula="\mathbf{v} = [3, 4]^\top" />
          </span>
        </div>

        <div className="p-3 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-center">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-bold block mb-1">
            2. Tính độ dài
          </span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            <InlineMath formula="\|\mathbf{v}\|_2 = 5" />
          </span>
        </div>

        <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-center">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold block mb-1">
            3. Phép chia
          </span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
            <InlineMath formula="\hat{\mathbf{v}} = \mathbf{v} / 5" />
          </span>
        </div>

        <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-center">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
            4. Vector đơn vị
          </span>
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
            <InlineMath formula="[0.6, 0.8]^\top" />
          </span>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 text-center">
        Hướng được bảo toàn nguyên vẹn, độ dài sau chuẩn hóa luôn bằng 1:{' '}
        <InlineMath formula="\sqrt{0.6^2 + 0.8^2} = 1.0" />
      </p>
    </div>
  );
}

// Subcomponent for interactive DotProductPlane
function InteractiveDotProductPlaneContent({
  a,
  b,
  colorA,
  colorB,
}: {
  a: Vector2D;
  b: Vector2D;
  colorA: string;
  colorB: string;
}) {
  const [bPos, setBPos] = useState<Vector2D>(b);
  const point = useMovablePoint(b, {
    constrain: ([px, py]) => {
      const snapped: vec.Vector2 = [
        Math.round(Math.max(-1, Math.min(5, px)) * 2) / 2,
        Math.round(Math.max(-1, Math.min(4, py)) * 2) / 2,
      ];
      setBPos(snapped);
      return snapped;
    },
  });

  const cosTheta = cosine2D(a, bPos);
  const thetaDeg = (
    (Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180) /
    Math.PI
  ).toFixed(0);

  return (
    <>
      <Vector tail={[0, 0]} tip={a} color={colorA} weight={3} />
      <Text x={a[0]} y={a[1]} size={15} color={colorA} attach="se">
        a
      </Text>

      <Vector tail={[0, 0]} tip={point.point} color={colorB} weight={3} />
      <Text x={point.x} y={point.y} size={15} color={colorB} attach="ne">
        b
      </Text>

      <AngleArc v1={a} v2={bPos} label={`θ = ${thetaDeg}°`} />
      {point.element}
    </>
  );
}

// 13. DotProductPlane
export function DotProductPlane({
  ariaLabel,
  a = [3, 0],
  b = [2, 2],
  interactive = true,
}: DotProductPlaneProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const dot = vec.dot(a, b);
  const cosTheta = cosine2D(a, b);
  const thetaDeg = (
    (Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180) /
    Math.PI
  ).toFixed(0);

  const belowPlot = (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono">
      <div>
        <InlineMath
          formula={`\\mathbf{a}^\\top\\mathbf{b} = (${a[0]}\\times ${b[0]}) + (${a[1]}\\times ${b[1]}) = `}
        />
        <span className="font-bold text-pink-600 dark:text-pink-400 text-base">
          {dot.toFixed(1)}
        </span>
      </div>
      <div className="text-slate-500">
        <InlineMath
          formula={`\\cos\\theta = ${cosTheta.toFixed(2)} \\; (\\theta = ${thetaDeg}^\\circ)`}
        />
      </div>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-1}
      maxX={5}
      minY={-1}
      maxY={4}
      belowPlot={belowPlot}
    >
      {interactive ? (
        <InteractiveDotProductPlaneContent
          a={a}
          b={b}
          colorA={theme.vectorU}
          colorB={theme.vectorV}
        />
      ) : (
        <>
          <Vector tail={[0, 0]} tip={a} color={theme.vectorU} weight={3} />
          <Text x={a[0]} y={a[1]} size={15} color={theme.vectorU} attach="se">
            a
          </Text>

          <Vector tail={[0, 0]} tip={b} color={theme.vectorV} weight={3} />
          <Text x={b[0]} y={b[1]} size={15} color={theme.vectorV} attach="ne">
            b
          </Text>

          <AngleArc v1={a} v2={b} label={`θ = ${thetaDeg}°`} />
        </>
      )}
    </MathPlane>
  );
}

// 14. DotProductAngleExplorer
export function DotProductAngleExplorer({
  ariaLabel,
}: DotProductAngleExplorerProps) {
  const [angleDeg, setAngleDeg] = useState(60);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const lenA = 3;
  const lenB = 2.5;
  const rad = (angleDeg * Math.PI) / 180;
  const vecA: Vector2D = [lenA, 0];
  const vecB: Vector2D = [
    clampZero(lenB * Math.cos(rad)),
    clampZero(lenB * Math.sin(rad)),
  ];

  const dot = clampZero(vec.dot(vecA, vecB));
  const cosVal = clampZero(cosine2D(vecA, vecB));

  const belowPlot = (
    <div className="mt-3 flex flex-col gap-3 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <div className="flex items-center justify-between font-mono">
        <div>
          Góc <InlineMath formula={`\\theta = ${angleDeg}^\\circ`} />
        </div>
        <div>
          <InlineMath formula={`\\cos\\theta = ${cosVal.toFixed(2)}`} />
        </div>
        <div>
          <InlineMath formula="\\mathbf{a}^\\top\\mathbf{b} = " />
          <span
            className={`font-bold text-base ${
              dot > 0.01
                ? 'text-emerald-600 dark:text-emerald-400'
                : Math.abs(dot) <= 0.01
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {dot.toFixed(2)}
          </span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="180"
        step="5"
        value={angleDeg}
        onChange={(e) => setAngleDeg(Number(e.target.value))}
        className="w-full accent-pink-600"
        aria-label="Điều chỉnh góc giữa hai vector"
      />

      <div className="text-xs text-slate-500 text-center">
        {angleDeg < 90 &&
          'Góc nhọn (<90°): cos(θ) > 0 → Dot product DƯƠNG (cùng xu hướng)'}
        {angleDeg === 90 &&
          'Góc vuông (90°): cos(90°) = 0 → Dot product BẰNG 0 (Orthogonal/Trực giao)'}
        {angleDeg > 90 &&
          'Góc tù (>90°): cos(θ) < 0 → Dot product ÂM (ngược xu hướng)'}
      </div>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-3}
      maxX={4}
      minY={-1}
      maxY={4}
      belowPlot={belowPlot}
    >
      <Vector tail={[0, 0]} tip={vecA} color={theme.vectorU} weight={3} />
      <Text x={vecA[0]} y={vecA[1]} size={14} color={theme.vectorU} attach="se">
        a
      </Text>

      <Vector tail={[0, 0]} tip={vecB} color={theme.vectorV} weight={3} />
      <Text x={vecB[0]} y={vecB[1]} size={14} color={theme.vectorV} attach="ne">
        b
      </Text>

      <AngleArc v1={vecA} v2={vecB} label={`${angleDeg}°`} />
    </MathPlane>
  );
}

// 15. CosineMotivationDiagram (HTML card)
export function CosineMotivationDiagram({
  ariaLabel,
}: CosineMotivationDiagramProps) {
  const a1: Vector2D = [1, 2];
  const b1: Vector2D = [2, 4];
  const a2: Vector2D = [3, 6];
  const b2: Vector2D = [6, 12];

  const dot1 = vec.dot(a1, b1);
  const cos1 = cosine2D(a1, b1);

  const dot2 = vec.dot(a2, b2);
  const cos2 = cosine2D(a2, b2);

  return (
    <div
      className="my-6 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm bg-slate-50 dark:bg-slate-900"
      aria-label={ariaLabel}
    >
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 text-center">
        So sánh hai cặp vector cùng hướng (<InlineMath formula="\theta = 0^\circ" />)
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800/80">
          <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">
            Cặp 1: Vector độ dài nhỏ
          </div>
          <div className="space-y-1 font-mono text-xs">
            <div>
              <InlineMath formula="\mathbf{a} = [1, 2]^\top, \; \mathbf{b} = [2, 4]^\top" />
            </div>
            <div>
              Dot product:{' '}
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {dot1.toFixed(1)}
              </span>
            </div>
            <div>
              Cosine similarity:{' '}
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {cos1.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-800/80">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-400 mb-2">
            Cặp 2: Vector độ dài lớn hơn
          </div>
          <div className="space-y-1 font-mono text-xs">
            <div>
              <InlineMath formula="\mathbf{u} = [3, 6]^\top, \; \mathbf{w} = [6, 12]^\top" />
            </div>
            <div>
              Dot product:{' '}
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {dot2.toFixed(1)}
              </span>
            </div>
            <div>
              Cosine similarity:{' '}
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                {cos2.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 text-center">
        Dot product tăng gấp nhiều lần do độ dài lớn hơn, nhưng Cosine similarity luôn bằng 1.0 vì hướng hai cặp hoàn toàn giống nhau.
      </p>
    </div>
  );
}

// 16. CosineAngleExplorer
export function CosineAngleExplorer({
  ariaLabel,
}: CosineAngleExplorerProps) {
  const [angleDeg, setAngleDeg] = useState(45);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const len = 3;
  const rad = (angleDeg * Math.PI) / 180;
  const vecA: Vector2D = [len, 0];
  const vecB: Vector2D = [
    clampZero(len * Math.cos(rad)),
    clampZero(len * Math.sin(rad)),
  ];

  const cosVal = clampZero(cosine2D(vecA, vecB));

  const belowPlot = (
    <div className="mt-3 flex flex-col gap-2.5 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <div className="flex items-center justify-between font-mono">
        <div>
          <InlineMath formula={`\\theta = ${angleDeg}^\\circ`} />
        </div>
        <div>
          Cosine similarity <InlineMath formula="S_C(\mathbf{u}, \mathbf{v}) = " />
          <span
            className={`font-bold text-base ${
              cosVal > 0.01
                ? 'text-emerald-600 dark:text-emerald-400'
                : Math.abs(cosVal) <= 0.01
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {cosVal.toFixed(2)}
          </span>
        </div>
      </div>

      <input
        type="range"
        min="0"
        max="180"
        step="5"
        value={angleDeg}
        onChange={(e) => setAngleDeg(Number(e.target.value))}
        className="w-full accent-emerald-500"
        aria-label="Điều chỉnh góc giữa hai vector để xem cosine similarity"
      />

      <div className="text-xs text-slate-500 text-center">
        {angleDeg === 0 && '0°: Cùng hướng hoàn hảo → Cosine = 1.0'}
        {angleDeg > 0 && angleDeg < 90 && 'Góc nhọn: Cùng hướng một phần → 0 < Cosine < 1.0'}
        {angleDeg === 90 && '90°: Vuông góc / Trực giao → Cosine = 0.0 (Không tương quan)'}
        {angleDeg > 90 && angleDeg < 180 && 'Góc tù: Ngược hướng một phần → -1.0 < Cosine < 0'}
        {angleDeg === 180 && '180°: Hoàn toàn ngược hướng → Cosine = -1.0'}
      </div>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-3.5}
      maxX={4}
      minY={-1}
      maxY={4}
      belowPlot={belowPlot}
    >
      <Vector tail={[0, 0]} tip={vecA} color={theme.vectorU} weight={3} />
      <Text x={vecA[0]} y={vecA[1]} size={14} color={theme.vectorU} attach="se">
        u
      </Text>

      <Vector tail={[0, 0]} tip={vecB} color={theme.vectorV} weight={3} />
      <Text x={vecB[0]} y={vecB[1]} size={14} color={theme.vectorV} attach="ne">
        v
      </Text>

      <AngleArc v1={vecA} v2={vecB} label={`θ = ${angleDeg}°`} />
    </MathPlane>
  );
}

// 17. EmbeddingCosineDiagram
export function EmbeddingCosineDiagram({
  ariaLabel,
}: EmbeddingCosineDiagramProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const v1: Vector2D = [3.2, 1.2];
  const v2: Vector2D = [3.0, 1.6];
  const v3: Vector2D = [-1.0, 2.5];

  const cos12 = cosine2D(v1, v2);
  const cos13 = cosine2D(v1, v3);

  const angle12 = ((Math.acos(cos12) * 180) / Math.PI).toFixed(0);
  const angle13 = ((Math.acos(cos13) * 180) / Math.PI).toFixed(0);

  const belowPlot = (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono">
      <div className="p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30">
        <div className="font-bold text-blue-600 dark:text-blue-400">
          Vector v₁ và v₂ (Góc nhỏ)
        </div>
        <div>
          <InlineMath
            formula={`S_C(\\mathbf{v}_1, \\mathbf{v}_2) \\approx ${cos12.toFixed(3)}`}
          />
        </div>
      </div>
      <div className="p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30">
        <div className="font-bold text-rose-600 dark:text-rose-400">
          Vector v₁ và v₃ (Góc tù)
        </div>
        <div>
          <InlineMath
            formula={`S_C(\\mathbf{v}_1, \\mathbf{v}_3) \\approx ${cos13.toFixed(3)}`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-2}
      maxX={4.5}
      minY={-1}
      maxY={3.5}
      belowPlot={belowPlot}
    >
      <Vector tail={[0, 0]} tip={v1} color={theme.vectorU} weight={3} />
      <Text x={v1[0]} y={v1[1]} size={14} color={theme.vectorU} attach="se">
        v₁
      </Text>

      <Vector tail={[0, 0]} tip={v2} color={theme.vectorV} weight={3} />
      <Text x={v2[0]} y={v2[1]} size={14} color={theme.vectorV} attach="ne">
        v₂
      </Text>

      <Vector tail={[0, 0]} tip={v3} color={theme.vectorW} weight={3} />
      <Text x={v3[0]} y={v3[1]} size={14} color={theme.vectorW} attach="nw">
        v₃
      </Text>

      <AngleArc v1={v1} v2={v2} radius={1.2} label={`θ₁₂ ≈ ${angle12}°`} color={theme.vectorV} />
      <AngleArc v1={v1} v2={v3} radius={0.8} label={`θ₁₃ ≈ ${angle13}°`} color={theme.vectorW} />
    </MathPlane>
  );
}

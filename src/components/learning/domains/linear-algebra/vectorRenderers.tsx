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

// 1. VectorPlane
function InteractiveVectorPlaneMovable({
  ariaLabel,
  initial,
  label,
  showComponents,
}: {
  ariaLabel: string;
  initial: Vector2D;
  label: string;
  showComponents: boolean;
}) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const point = useMovablePoint(initial, {
    constrain: ([px, py]) => [
      Math.round(Math.max(-1, Math.min(5, px)) * 2) / 2,
      Math.round(Math.max(-1, Math.min(5, py)) * 2) / 2,
    ],
  });

  const currentPos: Vector2D = [point.x, point.y];
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
      <Vector tail={[0, 0]} tip={point.point} color={theme.vectorU} weight={3} />
      <Text x={point.x} y={point.y} size={15} color={theme.vectorU} attach="ne">
        {label}
      </Text>
      {point.element}
    </MathPlane>
  );
}

export function VectorPlane({
  ariaLabel,
  x = 3,
  y = 2,
  label = 'v',
  showComponents = true,
  interactive = true,
}: VectorPlaneProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  if (interactive) {
    return (
      <InteractiveVectorPlaneMovable
        ariaLabel={ariaLabel}
        initial={[x, y]}
        label={label}
        showComponents={showComponents}
      />
    );
  }

  const currentPos: Vector2D = [x, y];
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
function InteractiveVectorAdditionMovable({
  ariaLabel,
  u,
  v,
  showParallelogram,
}: {
  ariaLabel: string;
  u: Vector2D;
  v: Vector2D;
  showParallelogram: boolean;
}) {
  const [showP, setShowP] = useState(showParallelogram);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const pointU = useMovablePoint(u, {
    constrain: ([px, py]) => [
      Math.round(Math.max(-1, Math.min(4, px)) * 2) / 2,
      Math.round(Math.max(-1, Math.min(4, py)) * 2) / 2,
    ],
  });

  const pointV = useMovablePoint(v, {
    constrain: ([px, py]) => [
      Math.round(Math.max(-1, Math.min(4, px)) * 2) / 2,
      Math.round(Math.max(-1, Math.min(4, py)) * 2) / 2,
    ],
  });

  const liveU: Vector2D = [pointU.x, pointU.y];
  const liveV: Vector2D = [pointV.x, pointV.y];
  const sum = vec.add(liveU, liveV);

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
        [{liveU[0]}+{liveV[0]}, {liveU[1]}+{liveV[1]}]ᵀ = [{sum[0]}, {sum[1]}]ᵀ
      </span>
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-1}
      maxX={6}
      minY={-1}
      maxY={6}
      belowPlot={belowPlot}
    >
      <Vector tail={[0, 0]} tip={liveU} color={theme.vectorU} weight={3} />
      <Text x={liveU[0]} y={liveU[1]} size={14} color={theme.vectorU} attach="se">
        u
      </Text>

      <Vector tail={liveU} tip={sum} color={theme.vectorV} style="dashed" weight={2} />
      <Text x={(liveU[0] + sum[0]) / 2} y={(liveU[1] + sum[1]) / 2} size={14} color={theme.vectorV} attach="nw">
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
            point2={liveV}
            style="dashed"
            color="rgba(148, 163, 184, 0.5)"
          />
          <Line.Segment
            point1={liveV}
            point2={sum}
            style="dashed"
            color="rgba(148, 163, 184, 0.5)"
          />
        </>
      )}

      {pointU.element}
      {pointV.element}
    </MathPlane>
  );
}

export function VectorAdditionPlane({
  ariaLabel,
  u = [2, 1],
  v = [1, 3],
  showParallelogram = true,
  interactive = true,
}: VectorAdditionPlaneProps) {
  const [showP, setShowP] = useState(showParallelogram);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  if (interactive) {
    return (
      <InteractiveVectorAdditionMovable
        ariaLabel={ariaLabel}
        u={u}
        v={v}
        showParallelogram={showParallelogram}
      />
    );
  }

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
  v,
  vector,
  defaultAlpha,
  initialScalar,
  interactive = true,
}: ScalarVectorPlaneProps) {
  const resolvedVector: Vector2D = vector ?? v ?? [2, 1];
  const resolvedAlpha: number = initialScalar ?? defaultAlpha ?? 1.5;

  const [alpha, setAlpha] = useState(resolvedAlpha);
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const currentAlpha = interactive ? alpha : resolvedAlpha;
  const scaled = vec.scale(resolvedVector, currentAlpha);

  const belowPlot = (
    <div className="mt-3 flex flex-col gap-2 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold">
          Hệ số vô hướng <InlineMath formula={`\\alpha = ${currentAlpha.toFixed(1)}`} />:
        </span>
        <span className="font-mono text-xs">
          {currentAlpha > 0 && 'Cùng hướng với v, thay đổi độ dài'}
          {currentAlpha === 0 && 'Vector không (0, 0)'}
          {currentAlpha < 0 && 'Đảo ngược hướng 180°'}
        </span>
      </div>
      {interactive && (
        <input
          type="range"
          min="-2"
          max="2"
          step="0.2"
          value={currentAlpha}
          onChange={(e) => setAlpha(Number(e.target.value))}
          className="w-full accent-amber-500"
          aria-label="Hệ số vô hướng alpha"
        />
      )}
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
        tip={resolvedVector}
        color={theme.vectorU}
        style={currentAlpha !== 1 ? 'dashed' : 'solid'}
        weight={2}
      />
      <Text x={resolvedVector[0]} y={resolvedVector[1]} size={14} color={theme.vectorU} attach="ne">
        v
      </Text>

      {Math.abs(currentAlpha) > 0.05 && (
        <>
          <Vector
            tail={[0, 0]}
            tip={scaled}
            color={currentAlpha >= 0 ? theme.vectorV : theme.vectorW}
            weight={3.5}
          />
          <Text
            x={scaled[0]}
            y={scaled[1]}
            size={15}
            color={currentAlpha >= 0 ? theme.vectorV : theme.vectorW}
            attach={currentAlpha >= 0 ? 'ne' : 'sw'}
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

// 6. VectorNormPlane
export function VectorNormPlane({
  ariaLabel,
  v1,
  v2,
  vectors,
}: VectorNormPlaneProps) {
  const resolvedV1: Vector2D = vectors?.[0] ?? v1 ?? [2, 1];
  const resolvedV2: Vector2D = vectors?.[1] ?? v2 ?? [4, 2];

  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const mag1 = vec.mag(resolvedV1);
  const mag2 = vec.mag(resolvedV2);
  const len1 = mag1.toFixed(2);
  const len2 = mag2.toFixed(2);

  const isCollinear =
    mag1 > 1e-6 &&
    mag2 > 1e-6 &&
    Math.abs(resolvedV1[0] * resolvedV2[1] - resolvedV1[1] * resolvedV2[0]) < 1e-4;
  const scaleFactor = isCollinear ? mag2 / mag1 : null;

  const belowPlot = (
    <div className="mt-3 flex items-center justify-around border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <div>
        <InlineMath formula={`\\|\\mathbf{v}_1\\|_2 = ${len1}`} />
      </div>
      <div>
        {isCollinear && scaleFactor !== null ? (
          Math.abs(scaleFactor - 1) < 1e-4 ? (
            <InlineMath formula={`\\|\\mathbf{v}_2\\|_2 = \\|\\mathbf{v}_1\\|_2 = ${len2}`} />
          ) : (
            <InlineMath
              formula={`\\|\\mathbf{v}_2\\|_2 = ${Number.isInteger(scaleFactor) ? scaleFactor : scaleFactor.toFixed(1)}\\|\\mathbf{v}_1\\|_2 = ${len2}`}
            />
          )
        ) : (
          <InlineMath formula={`\\|\\mathbf{v}_2\\|_2 = ${len2}`} />
        )}
      </div>
      <div className="text-slate-500 font-sans">
        {isCollinear ? 'Cùng phương' : 'Độ dài độc lập'}
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
      <Vector tail={[0, 0]} tip={resolvedV1} color={theme.vectorU} weight={3.5} />
      <Text x={resolvedV1[0]} y={resolvedV1[1]} size={15} color={theme.vectorU} attach="ne">
        v₁
      </Text>

      <Vector tail={[0, 0]} tip={resolvedV2} color={theme.vectorV} style="dashed" weight={2.5} />
      <Text x={resolvedV2[0]} y={resolvedV2[1]} size={15} color={theme.vectorV} attach="ne">
        v₂
      </Text>
    </MathPlane>
  );
}

// 7. L2NormTriangle
export function L2NormTriangle({
  ariaLabel,
  v,
  vector,
}: L2NormTriangleProps) {
  const resolvedV: Vector2D = vector ?? v ?? [3, 4];

  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const hypotenuse = vec.mag(resolvedV).toFixed(1);

  const belowPlot = (
    <div className="mt-3 flex items-center justify-center border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <InlineMath
        formula={`\\|\\mathbf{v}\\|_2 = \\sqrt{${resolvedV[0]}^2 + ${resolvedV[1]}^2} = \\sqrt{${resolvedV[0] * resolvedV[0]} + ${resolvedV[1] * resolvedV[1]}} = ${hypotenuse}`}
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
      <Polygon
        points={[
          [0, 0],
          [resolvedV[0], 0],
          [resolvedV[0], resolvedV[1]],
        ]}
        color="#3b82f6"
      />

      <Line.Segment point1={[resolvedV[0] - 0.35, 0]} point2={[resolvedV[0] - 0.35, 0.35]} color="#64748b" />
      <Line.Segment point1={[resolvedV[0] - 0.35, 0.35]} point2={[resolvedV[0], 0.35]} color="#64748b" />

      <Line.Segment point1={[0, 0]} point2={[resolvedV[0], 0]} color="#64748b" weight={2} />
      <Text x={resolvedV[0] / 2} y={-0.3} size={14} color="#64748b" attach="s">
        {String(resolvedV[0])}
      </Text>

      <Line.Segment point1={[resolvedV[0], 0]} point2={resolvedV} color="#64748b" weight={2} />
      <Text x={resolvedV[0] + 0.3} y={resolvedV[1] / 2} size={14} color="#64748b" attach="w">
        {String(resolvedV[1])}
      </Text>

      <Vector tail={[0, 0]} tip={resolvedV} color={theme.vectorU} weight={3.5} />
      <Text x={resolvedV[0] / 2 - 0.3} y={resolvedV[1] / 2 + 0.3} size={15} color={theme.vectorU} attach="nw">
        v
      </Text>
    </MathPlane>
  );
}

// 8. DistancePlane
export function DistancePlane({
  ariaLabel,
  p1,
  p2,
  x,
  y,
}: DistancePlaneProps) {
  const start: Vector2D = x ?? p1 ?? [1, 1];
  const end: Vector2D = y ?? p2 ?? [4, 5];

  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const diff = vec.sub(end, start);
  const dist = vec.mag(diff).toFixed(2);

  const minPlotX = Math.min(-0.5, start[0] - 1, end[0] - 1);
  const maxPlotX = Math.max(5.5, start[0] + 1.5, end[0] + 1.5);
  const minPlotY = Math.min(-0.5, start[1] - 1, end[1] - 1);
  const maxPlotY = Math.max(5.5, start[1] + 1.5, end[1] + 1.5);

  const belowPlot = (
    <div className="mt-3 flex items-center justify-center border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      <InlineMath
        formula={`d(\\mathbf{x}, \\mathbf{y}) = \\|\\mathbf{y} - \\mathbf{x}\\|_2 = \\sqrt{(${end[0]}-${start[0]})^2 + (${end[1]}-${start[1]})^2} = ${dist}`}
      />
    </div>
  );

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={minPlotX}
      maxX={maxPlotX}
      minY={minPlotY}
      maxY={maxPlotY}
      belowPlot={belowPlot}
    >
      <Point x={start[0]} y={start[1]} color={theme.vectorU} />
      <Text x={start[0]} y={start[1]} size={14} color={theme.vectorU} attach="nw">
        {`x(${start[0]}, ${start[1]})`}
      </Text>

      <Point x={end[0]} y={end[1]} color={theme.vectorV} />
      <Text x={end[0]} y={end[1]} size={14} color={theme.vectorV} attach="se">
        {`y(${end[0]}, ${end[1]})`}
      </Text>

      <Vector tail={start} tip={end} color={theme.vectorW} weight={3.5} />
      <Text x={(start[0] + end[0]) / 2} y={(start[1] + end[1]) / 2} size={14} color={theme.vectorW} attach="se">
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
  vectors,
}: NormalizationPlaneProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const vectorList: Vector2D[] = vectors && vectors.length > 0 ? vectors : [v];
  const primaryVec = vectorList[0];
  const u = vec.normalize(primaryVec);

  const belowPlot = (
    <div className="mt-3 flex flex-wrap items-center justify-around gap-2 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
      {vectorList.map((vecItem, index) => {
        const len = vec.mag(vecItem).toFixed(2);
        return (
          <div key={index}>
            <InlineMath
              formula={`\\mathbf{v}_{${index + 1}} = [${vecItem[0]}, ${vecItem[1]}]^\\top \\; (\\|\\mathbf{v}_{${index + 1}}\\|_2 \\approx ${len})`}
            />
          </div>
        );
      })}
      <div>
        <InlineMath
          formula={`\\hat{\\mathbf{v}} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|_2} \\approx [${u[0].toFixed(2)}, ${u[1].toFixed(2)}]^\\top`}
        />
      </div>
    </div>
  );

  const maxValX = Math.max(3, ...vectorList.map((item) => item[0] + 1));
  const maxValY = Math.max(3, ...vectorList.map((item) => item[1] + 1));

  return (
    <MathPlane
      ariaLabel={ariaLabel}
      minX={-1}
      maxX={maxValX}
      minY={-1}
      maxY={maxValY}
      belowPlot={belowPlot}
    >
      <Circle center={[0, 0]} radius={1} strokeStyle="dashed" color="rgba(148, 163, 184, 0.6)" />

      {vectorList.map((vecItem, index) => (
        <g key={index}>
          <Vector
            tail={[0, 0]}
            tip={vecItem}
            color={index === 0 ? theme.vectorU : theme.vectorW}
            weight={index === 0 ? 2.5 : 2}
            style={index > 0 ? 'dashed' : 'solid'}
          />
          <Text
            x={vecItem[0]}
            y={vecItem[1]}
            size={14}
            color={index === 0 ? theme.vectorU : theme.vectorW}
            attach="ne"
          >
            {vectorList.length > 1 ? `v${index + 1}` : 'v'}
          </Text>
        </g>
      ))}

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

// 13. DotProductPlane
function InteractiveDotProductPlaneMovable({
  ariaLabel,
  a,
  b,
}: {
  ariaLabel: string;
  a: Vector2D;
  b: Vector2D;
}) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  const pointB = useMovablePoint(b, {
    constrain: ([px, py]) => [
      Math.round(Math.max(-1, Math.min(5, px)) * 2) / 2,
      Math.round(Math.max(-1, Math.min(4, py)) * 2) / 2,
    ],
  });

  const liveB: Vector2D = [pointB.x, pointB.y];
  const dot = vec.dot(a, liveB);
  const cosTheta = cosine2D(a, liveB);
  const isUndefined = Number.isNaN(cosTheta);
  const thetaDeg = isUndefined
    ? null
    : ((Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180) / Math.PI).toFixed(0);

  const belowPlot = (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t pt-3 border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono">
      <div>
        <InlineMath
          formula={`\\mathbf{a}^\\top\\mathbf{b} = (${a[0]}\\times ${liveB[0]}) + (${a[1]}\\times ${liveB[1]}) = `}
        />
        <span className="font-bold text-pink-600 dark:text-pink-400 text-base">
          {dot.toFixed(1)}
        </span>
      </div>
      <div className="text-slate-500">
        {isUndefined ? (
          <span className="italic">Không xác định (vector không)</span>
        ) : (
          <InlineMath
            formula={`\\cos\\theta = ${cosTheta.toFixed(2)} \\; (\\theta = ${thetaDeg}^\\circ)`}
          />
        )}
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
      <Vector tail={[0, 0]} tip={a} color={theme.vectorU} weight={3} />
      <Text x={a[0]} y={a[1]} size={15} color={theme.vectorU} attach="se">
        a
      </Text>

      <Vector tail={[0, 0]} tip={pointB.point} color={theme.vectorV} weight={3} />
      <Text x={pointB.x} y={pointB.y} size={15} color={theme.vectorV} attach="ne">
        b
      </Text>

      {!isUndefined && thetaDeg !== null && (
        <AngleArc v1={a} v2={liveB} label={`θ = ${thetaDeg}°`} />
      )}
      {pointB.element}
    </MathPlane>
  );
}

export function DotProductPlane({
  ariaLabel,
  a = [3, 0],
  b = [2, 2],
  interactive = true,
}: DotProductPlaneProps) {
  const themeClasses = useLearningMdxTheme();
  const theme = getMathVisualTheme(themeClasses.isLight ? 'light' : 'dark');

  if (interactive) {
    return (
      <InteractiveDotProductPlaneMovable
        ariaLabel={ariaLabel}
        a={a}
        b={b}
      />
    );
  }

  const dot = vec.dot(a, b);
  const cosTheta = cosine2D(a, b);
  const isUndefined = Number.isNaN(cosTheta);
  const thetaDeg = isUndefined
    ? null
    : ((Math.acos(Math.max(-1, Math.min(1, cosTheta))) * 180) / Math.PI).toFixed(0);

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
        {isUndefined ? (
          <span className="italic">Không xác định (vector không)</span>
        ) : (
          <InlineMath
            formula={`\\cos\\theta = ${cosTheta.toFixed(2)} \\; (\\theta = ${thetaDeg}^\\circ)`}
          />
        )}
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
      <Vector tail={[0, 0]} tip={a} color={theme.vectorU} weight={3} />
      <Text x={a[0]} y={a[1]} size={15} color={theme.vectorU} attach="se">
        a
      </Text>

      <Vector tail={[0, 0]} tip={b} color={theme.vectorV} weight={3} />
      <Text x={b[0]} y={b[1]} size={15} color={theme.vectorV} attach="ne">
        b
      </Text>

      {!isUndefined && thetaDeg !== null && (
        <AngleArc v1={a} v2={b} label={`θ = ${thetaDeg}°`} />
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
          'Góc nhọn (<90°): cos(θ) > 0, dot product dương'}
        {angleDeg === 90 &&
          'Góc vuông (90°): cos(90°) = 0, dot product bằng 0 (Vuông góc / Trực giao)'}
        {angleDeg > 90 &&
          'Góc tù (>90°): cos(θ) < 0, dot product âm'}
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
  const a1: Vector2D = [1, 0];
  const b1: Vector2D = [2, 0];
  const a2: Vector2D = [1, 0];
  const c2: Vector2D = [100, 0];

  const dot1 = vec.dot(a1, b1);
  const cos1 = cosine2D(a1, b1);

  const dot2 = vec.dot(a2, c2);
  const cos2 = cosine2D(a2, c2);

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
              <InlineMath formula="\mathbf{a} = [1, 0]^\top, \; \mathbf{b} = [2, 0]^\top" />
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
              <InlineMath formula="\mathbf{a} = [1, 0]^\top, \; \mathbf{c} = [100, 0]^\top" />
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
  interactive = true,
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

      {interactive && (
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
      )}

      <div className="text-xs text-slate-500 text-center">
        {angleDeg === 0 && '0°: Cùng hướng hoàn hảo, Cosine = 1.0'}
        {angleDeg > 0 && angleDeg < 90 && 'Góc nhọn: Cùng hướng một phần, 0 < Cosine < 1.0'}
        {angleDeg === 90 && '90°: Vuông góc / Trực giao, Cosine = 0.0'}
        {angleDeg > 90 && angleDeg < 180 && 'Góc tù: Ngược hướng một phần, -1.0 < Cosine < 0'}
        {angleDeg === 180 && '180°: Hoàn toàn ngược hướng, Cosine = -1.0'}
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

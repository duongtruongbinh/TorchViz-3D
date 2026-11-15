import { useId, useMemo, useState } from 'react';
import { InlineMath } from '../../learningMdxComponents';
import { DL_PALETTE } from './primitives';

interface DataPoint {
  x1: number;
  x2: number;
  label: 0 | 1;
}

// Linearly separable 2D points
const LINEAR_SAMPLES: readonly DataPoint[] = [
  { x1: 0.1, x2: 0.15, label: 0 },
  { x1: 0.25, x2: 0.45, label: 0 },
  { x1: 0.45, x2: 0.15, label: 0 },
  { x1: 0.65, x2: 0.85, label: 1 },
  { x1: 0.9, x2: 0.6, label: 1 },
  { x1: 0.95, x2: 0.95, label: 1 },
];

// Classic non-linearly separable XOR corners
const XOR_SAMPLES: readonly DataPoint[] = [
  { x1: 0, x2: 0, label: 0 },
  { x1: 1, x2: 1, label: 0 },
  { x1: 0, x2: 1, label: 1 },
  { x1: 1, x2: 0, label: 1 },
];

const INITIAL_PARAMS = {
  linear: { w1: 0.8, w2: -1.0, bias: 0.1 },
  xor: { w1: 1.0, w2: 1.0, bias: -0.5 },
} as const;

const BLUE = DL_PALETTE.primary;
const RED = DL_PALETTE.rose;
const INK = DL_PALETTE.ink;

const DOMAIN_MIN = -0.2;
const DOMAIN_MAX = 1.25;

function project([x1, x2]: readonly [number, number]): [number, number] {
  const span = DOMAIN_MAX - DOMAIN_MIN;
  return [64 + ((x1 - DOMAIN_MIN) / span) * 324, 256 - ((x2 - DOMAIN_MIN) / span) * 232];
}

function clipHalfPlane(
  w1: number,
  w2: number,
  bias: number,
): { poly: Array<[number, number]>; intersections: Array<[number, number]> } {
  const rect: Array<[number, number]> = [
    [DOMAIN_MIN, DOMAIN_MIN],
    [DOMAIN_MAX, DOMAIN_MIN],
    [DOMAIN_MAX, DOMAIN_MAX],
    [DOMAIN_MIN, DOMAIN_MAX],
  ];
  const f = ([x, y]: [number, number]) => w1 * x + w2 * y + bias;
  const poly: Array<[number, number]> = [];
  const intersections: Array<[number, number]> = [];

  for (let i = 0; i < rect.length; i++) {
    const a = rect[i];
    const b = rect[(i + 1) % rect.length];
    const fa = f(a);
    const fb = f(b);
    const aIn = fa >= 0;
    const bIn = fb >= 0;

    if (aIn) poly.push(a);
    if (aIn !== bIn) {
      const t = fa / (fa - fb);
      const pt: [number, number] = [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
      poly.push(pt);
      intersections.push(pt);
    }
  }

  return { poly, intersections };
}

function toSvgPath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  return `${pts
    .map((p, idx) => {
      const [sx, sy] = project(p);
      return `${idx === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`;
    })
    .join(' ')} Z`;
}

/**
 * Interactive 2D Perceptron explorer styled to match the clean SVG geometry diagrams.
 */
export function PerceptronBoundaryExplorer({ mode = 'linear' }: { mode?: 'linear' | 'xor' }) {
  const clipId = useId();
  const isXor = mode === 'xor';
  const samples = isXor ? XOR_SAMPLES : LINEAR_SAMPLES;
  const initial = INITIAL_PARAMS[mode];

  const [w1, setW1] = useState<number>(initial.w1);
  const [w2, setW2] = useState<number>(initial.w2);
  const [bias, setBias] = useState<number>(initial.bias);

  const results = useMemo(
    () =>
      samples.map((s) => {
        const z = w1 * s.x1 + w2 * s.x2 + bias;
        const pred = z >= 0 ? 1 : 0;
        return { ...s, pred, correct: pred === s.label };
      }),
    [samples, w1, w2, bias],
  );

  const correctCount = results.filter((r) => r.correct).length;
  const totalCount = samples.length;

  const { poly: posPoly, intersections } = useMemo(
    () => clipHalfPlane(w1, w2, bias),
    [w1, w2, bias],
  );
  const { poly: negPoly } = useMemo(() => clipHalfPlane(-w1, -w2, -bias), [w1, w2, bias]);

  const handleReset = () => {
    setW1(initial.w1);
    setW2(initial.w2);
    setBias(initial.bias);
  };

  const handleShowSolution = () => {
    setW1(1.0);
    setW2(1.0);
    setBias(-1.1);
  };

  // Separating line endpoints & perpendicular normal vector w in pixel space
  const lineSegment = intersections.length >= 2 ? [intersections[0], intersections[1]] : null;
  let normalSvg: {
    sx: number;
    sy: number;
    ex: number;
    ey: number;
    head: string;
    sqPath: string;
  } | null = null;

  if (lineSegment && Math.hypot(w1, w2) > 0.05) {
    const [p1x, p1y] = project(lineSegment[0]);
    const [p2x, p2y] = project(lineSegment[1]);
    const mx = (p1x + p2x) / 2;
    const my = (p1y + p2y) / 2;

    const span = DOMAIN_MAX - DOMAIN_MIN;
    const rawNx = (w1 / span) * 324;
    const rawNy = (-w2 / span) * 232;
    const nLen = Math.hypot(rawNx, rawNy);
    if (nLen > 1e-3) {
      const nx = rawNx / nLen;
      const ny = rawNy / nLen;
      const tx = -ny;
      const ty = nx;
      const arrowLen = 52;
      const ex = mx + nx * arrowLen;
      const ey = my + ny * arrowLen;
      const sq = 9;
      normalSvg = {
        sx: mx,
        sy: my,
        ex,
        ey,
        head: `M${ex - nx * 9 + tx * 4.5},${ey - ny * 9 + ty * 4.5} L${ex},${ey} L${ex - nx * 9 - tx * 4.5},${ey - ny * 9 - ty * 4.5}`,
        sqPath: `M${mx + tx * sq},${my + ty * sq} l${nx * sq},${ny * sq} l${-tx * sq},${-ty * sq}`,
      };
    }
  }

  return (
    <figure className="my-6 bg-white py-2">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#205089]">
          {isXor
            ? 'Thử nghiệm XOR: 1 Perceptron không thể tách 4 điểm'
            : 'Điều chỉnh w₁, w₂, b để phân tách hai nhóm điểm'}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
            correctCount === totalCount
              ? 'bg-emerald-100 text-emerald-800'
              : isXor
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-900'
          }`}
        >
          {correctCount === totalCount
            ? `Đúng ${correctCount} / ${totalCount} — Tách thành công!`
            : isXor
              ? `Đúng ${correctCount} / ${totalCount} (tối đa 3/4)`
              : `Đúng ${correctCount} / ${totalCount} điểm`}
        </span>
      </div>

      <div className="grid items-center gap-6 md:grid-cols-[1.15fr_1fr]">
        <svg
          viewBox="0 0 430 305"
          className="mx-auto w-full max-w-[430px]"
          role="img"
          aria-label="Mặt phẳng tọa độ Perceptron tương tác với đường phân tách và vector trọng số w"
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="64" y="24" width="324" height="232" />
            </clipPath>
          </defs>

          {/* Half-space shading */}
          <path d={toSvgPath(negPoly)} clipPath={`url(#${clipId})`} fill={RED} opacity="0.06" />
          <path d={toSvgPath(posPoly)} clipPath={`url(#${clipId})`} fill={BLUE} opacity="0.06" />

          {/* Axes */}
          <path d="M64,24 V256 H388" stroke="#64748B" strokeWidth="1.5" fill="none" />
          <foreignObject x="206" y="268" width="44" height="32">
            <div className="text-center text-[#334155]">
              <InlineMath formula="x_1" />
            </div>
          </foreignObject>
          <foreignObject x="20" y="122" width="36" height="32">
            <div className="text-center text-[#334155]">
              <InlineMath formula="x_2" />
            </div>
          </foreignObject>

          {/* Separating line */}
          {lineSegment && (
            <path
              d={`M${project(lineSegment[0])[0]},${project(lineSegment[0])[1]} L${project(lineSegment[1])[0]},${project(lineSegment[1])[1]}`}
              clipPath={`url(#${clipId})`}
              stroke={INK}
              strokeWidth="2.5"
            />
          )}

          {/* Normal vector w */}
          {normalSvg && (
            <g clipPath={`url(#${clipId})`}>
              <path
                d={`M${normalSvg.sx},${normalSvg.sy} L${normalSvg.ex},${normalSvg.ey}`}
                stroke={BLUE}
                strokeWidth="2.3"
              />
              <path d={normalSvg.head} fill="none" stroke={BLUE} strokeWidth="2.3" />
              <path d={normalSvg.sqPath} fill="none" stroke="#64748B" strokeWidth="1.4" />
              <foreignObject x={normalSvg.ex + 8} y={normalSvg.ey - 14} width="40" height="30">
                <div className="text-xs font-bold text-[#205089]">
                  <InlineMath formula="\mathbf{w}" />
                </div>
              </foreignObject>
            </g>
          )}

          {/* Data points */}
          {results.map((pt) => {
            const [cx, cy] = project([pt.x1, pt.x2]);
            const fill = pt.label === 1 ? BLUE : RED;
            return (
              <g key={`${pt.x1}-${pt.x2}`}>
                {!pt.correct && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="11"
                    fill="none"
                    stroke="#E11D48"
                    strokeWidth="2"
                    strokeDasharray="3 2"
                  />
                )}
                <circle cx={cx} cy={cy} r="6.5" fill={fill} stroke={INK} />
              </g>
            );
          })}
        </svg>

        <div className="grid gap-3.5">
          <div className="rounded-lg bg-[#F8FAFC] px-3 py-2 text-center text-xs text-[#172A43]">
            <InlineMath
              formula={`${w1.toFixed(1)}x_1 ${w2 >= 0 ? '+' : '-'} ${Math.abs(w2).toFixed(1)}x_2 ${bias >= 0 ? '+' : '-'} ${Math.abs(bias).toFixed(1)} = 0`}
            />
          </div>

          <div className="grid gap-3">
            <SliderControl label="Trọng số w₁" value={w1} min={-3} max={3} step={0.1} onChange={setW1} />
            <SliderControl label="Trọng số w₂" value={w2} min={-3} max={3} step={0.1} onChange={setW2} />
            <SliderControl label="Độ lệch b (bias)" value={bias} min={-3} max={3} step={0.1} onChange={setBias} />
            <p className="text-xs leading-5 text-slate-600">
              {isXor ? (
                <>
                  Thử kéo <code className="font-mono text-[#205089]">w₁, w₂, b</code> bất kỳ — một đường thẳng duy nhất luôn bỏ sót ít nhất 1 điểm XOR.
                </>
              ) : (
                <>
                  Kéo <code className="font-mono text-[#205089]">w₁, w₂, b</code> để tách riêng nhóm xanh (+1) và nhóm đỏ (−1).
                </>
              )}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#205089]" />
                +1
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#C2415A]" />
                −1
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-dashed border-rose-600" />
                Sai
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {!isXor && (
                <button
                  type="button"
                  onClick={handleShowSolution}
                  className="rounded-md bg-[#EFF3F8] px-2.5 py-1 text-xs font-bold text-[#205089] hover:bg-[#DCE7F5]"
                >
                  Đáp án
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-[#205089] hover:bg-slate-200"
              >
                Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (next: number) => void;
}) {
  return (
    <label className="grid gap-1">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>{label}</span>
        <span className="font-mono font-bold text-[#205089] tabular-nums">{value.toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer accent-[#205089]"
      />
    </label>
  );
}

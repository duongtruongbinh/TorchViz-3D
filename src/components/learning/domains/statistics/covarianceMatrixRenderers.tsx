import { useState } from 'react';
import { useLearningMdxTheme } from '../../learningMdxComponents';
import { cx } from '../../theme';

type CovarianceConceptKind =
  | 'vector-expansion'
  | 'dataset-matrix'
  | 'mean-vector-2d'
  | 'centering'
  | 'variance-limitations'
  | 'covariance-positive'
  | 'covariance-negative'
  | 'covariance-zero'
  | 'outer-product'
  | 'hand-calculation';

export function CovarianceConceptVisual({
  ariaLabel,
  caption,
  labels = [],
  kind,
}: {
  ariaLabel: string;
  caption: string;
  labels?: string[];
  kind: CovarianceConceptKind;
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-slate-200' : 'border-slate-800';
  const cardBg = theme.isLight ? 'bg-white/90' : 'bg-slate-900/90';

  const [isCentered, setIsCentered] = useState(false);

  let content: React.ReactNode = null;

  if (kind === 'vector-expansion') {
    content = (
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className={cx('flex flex-col items-center justify-center rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md', cardBg, border)}>
          <span className="mb-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {labels[0] ?? 'Dữ liệu 1 chiều (Scalar)'}
          </span>
          <div className={cx('w-full max-w-xs rounded-xl border p-5 text-center shadow-inner', theme.isLight ? 'bg-gradient-to-br from-slate-50 to-sky-50/50 border-sky-100' : 'bg-gradient-to-br from-slate-900 to-sky-950/40 border-sky-900/50')}>
            <p className={cx('text-sm font-bold', theme.titleText)}>Quan sát Person A</p>
            <p className="mt-2 font-mono text-2xl font-black text-sky-600 dark:text-sky-400">170 cm</p>
            <p className={cx('mt-1 text-xs', theme.mutedText)}>1 giá trị duy nhất (Chiều cao)</p>
          </div>
        </div>

        <div className={cx('flex flex-col items-center justify-center rounded-2xl border p-6 shadow-sm transition-all hover:shadow-md', cardBg, border)}>
          <span className="mb-3 inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-extrabold tracking-wider text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            {labels[1] ?? 'Dữ liệu nhiều chiều (Observation Vector)'}
          </span>
          <div className={cx('w-full max-w-xs rounded-xl border p-5 text-center shadow-inner', theme.isLight ? 'bg-gradient-to-br from-slate-50 to-indigo-50/50 border-indigo-100' : 'bg-gradient-to-br from-slate-900 to-indigo-950/40 border-indigo-900/50')}>
            <p className={cx('text-sm font-bold', theme.titleText)}>Quan sát Person A</p>
            <p className={cx('mt-1 font-mono text-xs font-bold text-indigo-500')}>x_i = [Height, Weight, Age] ∈ ℝ¹ˣ³</p>
            <div className="mt-3 inline-flex items-center rounded-lg border-t-2 border-b-2 border-indigo-500/40 bg-indigo-500/10 px-5 py-2 font-mono text-xl font-black text-indigo-600 dark:text-indigo-400 shadow-sm">
              <span>[ 170 &nbsp; 65 &nbsp; 24 ]</span>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (kind === 'dataset-matrix') {
    content = (
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className={cx('rounded-2xl border p-6 shadow-sm', cardBg, border)}>
          <p className={cx('mb-4 text-center text-xs font-black uppercase tracking-wider', theme.mutedText)}>
            {labels[0] ?? 'Dạng bảng quan sát dữ liệu'}
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-center text-sm">
              <thead>
                <tr className={theme.isLight ? 'bg-slate-100/80 text-slate-700' : 'bg-slate-800/80 text-slate-200'}>
                  <th className="py-2.5 px-3 font-bold">Person</th>
                  <th className="py-2.5 px-3 font-bold text-sky-600 dark:text-sky-400">Height (cm)</th>
                  <th className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">Weight (kg)</th>
                </tr>
              </thead>
              <tbody className={cx('divide-y font-mono font-semibold', border)}>
                <tr className="hover:bg-sky-500/5"><td className={cx('py-2.5 font-sans font-bold', theme.titleText)}>P1</td><td>160</td><td>50</td></tr>
                <tr className="hover:bg-sky-500/5"><td className={cx('py-2.5 font-sans font-bold', theme.titleText)}>P2</td><td>170</td><td>65</td></tr>
                <tr className="hover:bg-sky-500/5"><td className={cx('py-2.5 font-sans font-bold', theme.titleText)}>P3</td><td>180</td><td>80</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={cx('flex flex-col items-center justify-center rounded-2xl border p-6 shadow-sm', cardBg, border)}>
          <p className={cx('mb-4 text-xs font-black uppercase tracking-wider', theme.mutedText)}>
            {labels[1] ?? 'Biểu diễn Ma trận Dữ liệu X ∈ ℝ³ˣ²'}
          </p>
          <div className="flex items-center gap-3 font-mono text-xl font-black">
            <span className={theme.titleText}>X =</span>
            <div className="border-l-2 border-r-2 border-slate-400 dark:border-slate-500 px-4 py-2 text-center rounded-sm">
              <div className="grid gap-2 text-lg">
                <div className="flex justify-between gap-8"><span className="text-sky-600 dark:text-sky-400">160</span><span className="text-indigo-600 dark:text-indigo-400">50</span></div>
                <div className="flex justify-between gap-8"><span className="text-sky-600 dark:text-sky-400">170</span><span className="text-indigo-600 dark:text-indigo-400">65</span></div>
                <div className="flex justify-between gap-8"><span className="text-sky-600 dark:text-sky-400">180</span><span className="text-indigo-600 dark:text-indigo-400">80</span></div>
              </div>
            </div>
          </div>
          <p className={cx('mt-4 text-xs font-bold', theme.mutedText)}>3 hàng (quan sát) × 2 cột (đặc trưng)</p>
        </div>
      </div>
    );
  } else if (kind === 'mean-vector-2d') {
    const points = [
      { x: 1, y: 2, label: 'x₁ (1, 2)' },
      { x: 3, y: 4, label: 'x₂ (3, 4)' },
      { x: 5, y: 9, label: 'x₃ (5, 9)' },
    ];
    const meanPt = { x: 3, y: 5, label: 'μ (3, 5)' };
    const toSvg = (pt: { x: number; y: number }) => ({
      cx: 45 + (pt.x / 6) * 230,
      cy: 215 - (pt.y / 10) * 175,
    });
    const meanSvg = toSvg(meanPt);

    content = (
      <div className="grid gap-6 p-6 lg:grid-cols-5">
        <div className="lg:col-span-3 flex justify-center">
          <svg viewBox="0 0 320 240" className="w-full max-w-md rounded-2xl border bg-slate-950 p-3 shadow-inner" role="img" aria-label={ariaLabel}>
            {/* Grid lines */}
            {[0, 2, 4, 6, 8, 10].map((v) => {
              const y = 215 - (v / 10) * 175;
              return (
                <g key={`y-${v}`}>
                  <line x1="35" y1={y} x2="295" y2={y} stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                  <text x="26" y={y + 4} textAnchor="end" className="text-[10px] fill-slate-500 font-mono">{v}</text>
                </g>
              );
            })}
            {[0, 1, 2, 3, 4, 5, 6].map((v) => {
              const x = 45 + (v / 6) * 230;
              return (
                <g key={`x-${v}`}>
                  <line x1={x} y1="25" x2={x} y2="215" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                  <text x={x} y={230} textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">{v}</text>
                </g>
              );
            })}
            {/* Dotted lines from mean to axes */}
            <line x1={meanSvg.cx} y1={meanSvg.cy} x2={meanSvg.cx} y2="215" stroke="#F59E0B" strokeDasharray="4 4" strokeWidth="1.5" />
            <line x1={meanSvg.cx} y1={meanSvg.cy} x2="45" y2={meanSvg.cy} stroke="#F59E0B" strokeDasharray="4 4" strokeWidth="1.5" />

            {/* Observation Points */}
            {points.map((pt, i) => {
              const pos = toSvg(pt);
              return (
                <g key={i} className="transition-all hover:scale-125">
                  <circle cx={pos.cx} cy={pos.cy} r="6" className="fill-sky-400 stroke-sky-200 stroke-2" />
                  <text x={pos.cx + 10} y={pos.cy - 6} className="text-[11px] font-bold font-mono fill-sky-200">{pt.label}</text>
                </g>
              );
            })}

            {/* Mean vector point */}
            <g className="animate-pulse">
              <circle cx={meanSvg.cx} cy={meanSvg.cy} r="9" fill="#F59E0B" stroke="#FFF" strokeWidth="2.5" />
              <text x={meanSvg.cx + 12} y={meanSvg.cy + 5} className="text-xs font-black fill-amber-400 font-mono">μ (3, 5)</text>
            </g>
          </svg>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-center gap-4">
          <div className={cx('rounded-2xl border p-5 text-center shadow-sm', cardBg, border)}>
            <p className={cx('text-xs font-black uppercase tracking-wider', theme.mutedText)}>Vector Trung Bình</p>
            <p className="mt-2 font-mono text-2xl font-black text-amber-500">μ = [3, 5]</p>
          </div>
          <div className={cx('rounded-xl border p-4 text-xs leading-relaxed space-y-2', cardBg, border, theme.bodyText)}>
            <p className="flex justify-between font-mono"><span>Trung bình X:</span><span className="font-bold text-sky-500">(1+3+5)/3 = 3</span></p>
            <p className="flex justify-between font-mono"><span>Trung bình Y:</span><span className="font-bold text-indigo-500">(2+4+9)/3 = 5</span></p>
          </div>
        </div>
      </div>
    );
  } else if (kind === 'centering') {
    const rawPoints = [
      { x: 1, y: 2, label: 'x₁' },
      { x: 3, y: 4, label: 'x₂' },
      { x: 5, y: 9, label: 'x₃' },
    ];
    const meanPt = { x: 3, y: 5 };
    const displayPoints = isCentered
      ? rawPoints.map((p) => ({ x: p.x - meanPt.x, y: p.y - meanPt.y, label: `${p.label} - μ` }))
      : rawPoints;
    const centerPoint = isCentered ? { x: 0, y: 0 } : meanPt;

    const scaleX = (x: number) => 160 + x * 24;
    const scaleY = (y: number) => 120 - y * 18;

    content = (
      <div className="grid gap-6 p-6 lg:grid-cols-5">
        <div className="lg:col-span-3 flex flex-col items-center gap-4">
          <svg viewBox="0 0 320 240" className="w-full max-w-md rounded-2xl border bg-slate-950 p-3 shadow-inner" role="img" aria-label={ariaLabel}>
            {/* Grid & Axis lines */}
            <line x1="20" y1="120" x2="300" y2="120" stroke="#475569" strokeWidth="1.5" />
            <line x1="160" y1="15" x2="160" y2="225" stroke="#475569" strokeWidth="1.5" />

            {/* Points */}
            {displayPoints.map((pt, i) => {
              const cxPos = scaleX(pt.x);
              const cyPos = scaleY(pt.y);
              return (
                <g key={i} className="transition-all duration-700 ease-in-out">
                  <circle cx={cxPos} cy={cyPos} r="6.5" className="fill-sky-400 stroke-sky-200 stroke-2" />
                  <text x={cxPos + 10} y={cyPos - 6} className="text-[11px] font-bold font-mono fill-sky-200">
                    {pt.label} ({pt.x}, {pt.y})
                  </text>
                </g>
              );
            })}

            {/* Mean / Center point */}
            <g className="transition-all duration-700 ease-in-out">
              <circle cx={scaleX(centerPoint.x)} cy={scaleY(centerPoint.y)} r="8.5" fill="#F59E0B" stroke="#FFF" strokeWidth="2.5" />
              <text x={scaleX(centerPoint.x) + 12} y={scaleY(centerPoint.y) + 4} className="text-xs font-black fill-amber-400 font-mono">
                {isCentered ? '0 (0,0)' : 'μ (3,5)'}
              </text>
            </g>
          </svg>

          <button
            type="button"
            onClick={() => setIsCentered(!isCentered)}
            className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <span>{isCentered ? '↺ Khôi phục Dữ liệu Thô' : '▶ Trượt Centering về Gốc Tọa Độ (0,0)'}</span>
          </button>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-center gap-4">
          <div className={cx('rounded-2xl border p-5 text-center shadow-sm', cardBg, border)}>
            <p className={cx('text-xs font-black uppercase tracking-wider', theme.mutedText)}>Trạng thái dữ liệu</p>
            <p className="mt-2 font-mono text-lg font-black text-sky-500">
              {isCentered ? 'Centered Matrix X_c' : 'Dữ liệu thô X'}
            </p>
          </div>
          <div className={cx('rounded-xl border p-4 space-y-2 font-mono text-xs shadow-inner', cardBg, border, theme.bodyText)}>
            <p className="flex justify-between"><span>d₁ = x₁ − μ:</span><span className="font-bold text-sky-400">[-2, -3]</span></p>
            <p className="flex justify-between"><span>d₂ = x₂ − μ:</span><span className="font-bold text-sky-400">[0, -1]</span></p>
            <p className="flex justify-between"><span>d₃ = x₃ − μ:</span><span className="font-bold text-sky-400">[2, 4]</span></p>
          </div>
        </div>
      </div>
    );
  } else if (kind === 'variance-limitations') {
    content = (
      <div className="grid gap-4 p-6 md:grid-cols-3">
        {[
          { title: 'Covariance Dương (> 0)', points: [[-2, -2], [-1, -0.8], [0, 0], [1, 0.9], [2, 2]], stroke: '#10B981', bg: 'bg-emerald-500/10' },
          { title: 'Covariance Gần 0 (≈ 0)', points: [[-2, 0.5], [-1, -1.8], [0, 1.9], [1, -0.5], [2, -1.2]], stroke: '#F59E0B', bg: 'bg-amber-500/10' },
          { title: 'Covariance Âm (< 0)', points: [[-2, 2.1], [-1, 0.9], [0, 0.1], [1, -1.1], [2, -2.2]], stroke: '#EF4444', bg: 'bg-rose-500/10' },
        ].map((item, idx) => (
          <div key={idx} className={cx('flex flex-col items-center rounded-2xl border p-4 text-center shadow-sm', cardBg, border)}>
            <span className={cx('mb-3 rounded-full px-3 py-1 text-xs font-black', item.bg)} style={{ color: item.stroke }}>
              {item.title}
            </span>
            <svg viewBox="-3 -3 6 6" className="w-full max-w-[180px] aspect-square rounded-xl bg-slate-950 p-2 shadow-inner">
              <line x1="-3" y1="0" x2="3" y2="0" stroke="#334155" strokeDasharray="1 1" strokeWidth="0.1" />
              <line x1="0" y1="-3" x2="0" y2="3" stroke="#334155" strokeDasharray="1 1" strokeWidth="0.1" />
              {item.points.map(([px, py], i) => (
                <circle key={i} cx={px} cy={-py} r="0.3" fill={item.stroke} />
              ))}
            </svg>
            <p className={cx('mt-3 text-xs font-bold', theme.mutedText)}>Var(X) & Var(Y) đều bằng nhau!</p>
          </div>
        ))}
      </div>
    );
  } else if (kind === 'covariance-positive') {
    content = (
      <div className="grid gap-6 p-6 lg:grid-cols-5">
        <div className="lg:col-span-3 flex justify-center">
          <svg viewBox="-4 -4 8 8" className="w-full max-w-sm aspect-square rounded-2xl bg-slate-950 p-3 shadow-inner">
            {/* Quadrant highlight backgrounds */}
            <rect x="0" y="-4" width="4" height="4" fill="rgba(16, 185, 129, 0.15)" />
            <rect x="-4" y="0" width="4" height="4" fill="rgba(16, 185, 129, 0.15)" />
            {/* Center axes */}
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#64748B" strokeWidth="0.15" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#64748B" strokeWidth="0.15" />
            {/* Quadrant Labels */}
            <text x="2" y="-2" textAnchor="middle" className="text-[0.6px] font-black fill-emerald-400 font-mono">(+) × (+) = +</text>
            <text x="-2" y="2" textAnchor="middle" className="text-[0.6px] font-black fill-emerald-400 font-mono">(-) × (-) = +</text>
            {/* Sample points */}
            {[[-2.5, -2.2], [-1.8, -1.2], [-1.0, -1.5], [0.8, 1.2], [1.9, 1.5], [2.6, 2.4]].map(([px, py], i) => (
              <circle key={i} cx={px} cy={-py} r="0.25" className="fill-emerald-400 stroke-white stroke-[0.05]" />
            ))}
          </svg>
        </div>
        <div className="lg:col-span-2 flex flex-col justify-center gap-3">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Xu hướng Đồng Biến</p>
            <p className="mt-2 font-mono text-2xl font-black text-emerald-500">Cov(X, Y) &gt; 0</p>
          </div>
          <p className={cx('text-xs leading-relaxed', theme.bodyText)}>
            Các điểm tập trung ở hai góc <span className="font-bold text-emerald-500">Phải-Trên</span> và <span className="font-bold text-emerald-500">Trái-Dưới</span>. Tích hai độ lệch luôn mang dấu dương!
          </p>
        </div>
      </div>
    );
  } else if (kind === 'covariance-negative') {
    content = (
      <div className="grid gap-6 p-6 lg:grid-cols-5">
        <div className="lg:col-span-3 flex justify-center">
          <svg viewBox="-4 -4 8 8" className="w-full max-w-sm aspect-square rounded-2xl bg-slate-950 p-3 shadow-inner">
            {/* Quadrant highlight backgrounds */}
            <rect x="-4" y="-4" width="4" height="4" fill="rgba(244, 63, 94, 0.15)" />
            <rect x="0" y="0" width="4" height="4" fill="rgba(244, 63, 94, 0.15)" />
            {/* Center axes */}
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#64748B" strokeWidth="0.15" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#64748B" strokeWidth="0.15" />
            {/* Quadrant Labels */}
            <text x="-2" y="-2" textAnchor="middle" className="text-[0.6px] font-black fill-rose-400 font-mono">(-) × (+) = -</text>
            <text x="2" y="2" textAnchor="middle" className="text-[0.6px] font-black fill-rose-400 font-mono">(+) × (-) = -</text>
            {/* Sample points */}
            {[[-2.5, 2.2], [-1.8, 1.2], [-1.0, 1.5], [0.8, -1.2], [1.9, -1.5], [2.6, -2.4]].map(([px, py], i) => (
              <circle key={i} cx={px} cy={-py} r="0.25" className="fill-rose-400 stroke-white stroke-[0.05]" />
            ))}
          </svg>
        </div>
        <div className="lg:col-span-2 flex flex-col justify-center gap-3">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">Xu hướng Nghịch Biến</p>
            <p className="mt-2 font-mono text-2xl font-black text-rose-500">Cov(X, Y) &lt; 0</p>
          </div>
          <p className={cx('text-xs leading-relaxed', theme.bodyText)}>
            Các điểm tập trung ở hai góc <span className="font-bold text-rose-500">Trái-Trên</span> và <span className="font-bold text-rose-500">Phải-Dưới</span>. Tích hai độ lệch trái dấu mang giá trị âm!
          </p>
        </div>
      </div>
    );
  } else if (kind === 'covariance-zero') {
    content = (
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className={cx('flex flex-col items-center rounded-2xl border p-5 text-center shadow-sm', cardBg, border)}>
          <p className={cx('mb-3 text-xs font-black text-amber-500 uppercase tracking-wider')}>1. Phân bố Độc lập Đối xứng</p>
          <svg viewBox="-4 -4 8 8" className="w-full max-w-[200px] aspect-square rounded-xl bg-slate-950 p-2 shadow-inner">
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#475569" strokeDasharray="0.5 0.5" strokeWidth="0.1" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#475569" strokeDasharray="0.5 0.5" strokeWidth="0.1" />
            <circle cx="0" cy="0" r="2.5" fill="none" stroke="#F59E0B" strokeWidth="0.1" strokeDasharray="0.3 0.3" />
            {[[0,2], [0,-2], [2,0], [-2,0], [1.4,1.4], [-1.4,-1.4], [1.4,-1.4], [-1.4,1.4]].map(([px, py], i) => (
              <circle key={i} cx={px} cy={py} r="0.25" fill="#F59E0B" />
            ))}
          </svg>
          <p className="mt-3 text-xs font-mono font-bold text-amber-500">Cov(X, Y) ≈ 0</p>
        </div>

        <div className={cx('flex flex-col items-center rounded-2xl border p-5 text-center shadow-sm', cardBg, border)}>
          <p className={cx('mb-3 text-xs font-black text-rose-500 uppercase tracking-wider')}>2. Y = X² (Phi tuyến hoàn toàn!)</p>
          <svg viewBox="-4 -4 8 8" className="w-full max-w-[200px] aspect-square rounded-xl bg-slate-950 p-2 shadow-inner">
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#475569" strokeDasharray="0.5 0.5" strokeWidth="0.1" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#475569" strokeDasharray="0.5 0.5" strokeWidth="0.1" />
            {[-2.5, -1.8, -1.0, 0, 1.0, 1.8, 2.5].map((vx, i) => (
              <circle key={i} cx={vx} cy={-(vx * vx * 0.4 - 1.5)} r="0.28" fill="#EF4444" />
            ))}
          </svg>
          <p className="mt-3 text-xs font-mono font-bold text-rose-500">Cov(X, Y) = 0 dù Y = X²</p>
        </div>
      </div>
    );
  } else if (kind === 'outer-product') {
    content = (
      <div className="grid gap-6 p-6 lg:grid-cols-5">
        <div className="lg:col-span-3 flex flex-col items-center justify-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-sm sm:text-base font-bold">
            <div className={cx('rounded-xl border-l-2 border-r-2 border-sky-500 px-3 py-2 text-center text-sky-500 bg-sky-500/10 shadow-sm')}>
              <div>d_x</div>
              <div>d_y</div>
            </div>
            <span>×</span>
            <div className={cx('rounded-xl border-t-2 border-b-2 border-sky-500 px-4 py-2 text-center text-sky-500 bg-sky-500/10 shadow-sm')}>
              <span>[ d_x &nbsp; d_y ]</span>
            </div>
            <span>=</span>
            <div className={cx('rounded-2xl border p-4 shadow-md', cardBg, border)}>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-sky-500/15 p-3 font-mono text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  <div className="text-xs font-bold text-slate-400">Var(X)</div>
                  <div className="text-lg font-black">d_x²</div>
                </div>
                <div className="rounded-xl bg-amber-500/15 p-3 font-mono text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <div className="text-xs font-bold text-slate-400">Cov(X,Y)</div>
                  <div className="text-lg font-black">d_x d_y</div>
                </div>
                <div className="rounded-xl bg-amber-500/15 p-3 font-mono text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <div className="text-xs font-bold text-slate-400">Cov(Y,X)</div>
                  <div className="text-lg font-black">d_x d_y</div>
                </div>
                <div className="rounded-xl bg-indigo-500/15 p-3 font-mono text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <div className="text-xs font-bold text-slate-400">Var(Y)</div>
                  <div className="text-lg font-black">d_y²</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-center gap-3">
          <div className={cx('rounded-2xl border p-5 text-center shadow-sm', cardBg, border)}>
            <p className={cx('text-xs font-bold uppercase tracking-wider', theme.mutedText)}>Tích ngoài Outer Product</p>
            <p className="mt-2 font-mono text-xl font-black text-sky-500">d_iᵀ d_i ∈ ℝ²ˣ²</p>
          </div>
          <p className={cx('text-xs leading-relaxed', theme.bodyText)}>
            Đường chéo chứa bình phương độ lệch <span className="font-mono font-bold text-sky-500">d_x², d_y²</span> (Variance).<br />
            Ngoài đường chéo chứa tích chéo <span className="font-mono font-bold text-amber-500">d_x d_y</span> (Covariance).
          </p>
        </div>
      </div>
    );
  } else if (kind === 'hand-calculation') {
    const rawData = [
      { i: 1, x: 1, y: 2, dx: -2, dy: -3, prod: 6 },
      { i: 2, x: 3, y: 4, dx: 0, dy: -1, prod: 0 },
      { i: 3, x: 5, y: 9, dx: 2, dy: 4, prod: 8 },
    ];
    content = (
      <div className="overflow-x-auto p-6">
        <table className="w-full min-w-[34rem] border-collapse text-center text-sm">
          <thead>
            <tr className={theme.isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-200'}>
              <th className="px-4 py-3 font-bold rounded-l-xl">{labels[0] ?? 'Quan sát i'}</th>
              <th className="px-4 py-3 font-bold">{labels[1] ?? 'xᵢ'}</th>
              <th className="px-4 py-3 font-bold">{labels[2] ?? 'yᵢ'}</th>
              <th className="px-4 py-3 font-bold text-sky-500">{labels[3] ?? 'xᵢ − μ_X'}</th>
              <th className="px-4 py-3 font-bold text-indigo-500">{labels[4] ?? 'yᵢ − μ_Y'}</th>
              <th className="px-4 py-3 font-bold text-amber-500 rounded-r-xl">{labels[5] ?? 'Tích độ lệch (xᵢ − μ_X)(yᵢ − μ_Y)'}</th>
            </tr>
          </thead>
          <tbody className={cx('divide-y font-mono', border)}>
            {rawData.map((row) => (
              <tr key={row.i} className={cx('transition-colors', theme.isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40')}>
                <td className={cx('px-4 py-3.5 font-sans font-bold', theme.titleText)}>{row.i}</td>
                <td className={cx('px-4 py-3.5 font-semibold', theme.bodyText)}>{row.x}</td>
                <td className={cx('px-4 py-3.5 font-semibold', theme.bodyText)}>{row.y}</td>
                <td className={cx('px-4 py-3.5 font-bold', row.dx < 0 ? 'text-rose-500' : row.dx > 0 ? 'text-emerald-500' : theme.mutedText)}>{row.dx > 0 ? `+${row.dx}` : row.dx}</td>
                <td className={cx('px-4 py-3.5 font-bold', row.dy < 0 ? 'text-rose-500' : row.dy > 0 ? 'text-emerald-500' : theme.mutedText)}>{row.dy > 0 ? `+${row.dy}` : row.dy}</td>
                <td className="px-4 py-3.5 font-black text-amber-500">{row.prod > 0 ? `+${row.prod}` : row.prod}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={cx('border-t-2 font-mono font-bold', border, theme.isLight ? 'bg-amber-500/10' : 'bg-amber-500/15')}>
              <td colSpan={5} className={cx('px-4 py-3.5 text-right font-sans font-extrabold', theme.titleText)}>Tổng các tích = 6 + 0 + 8 = 14  ⟹  Cov(X,Y) = 14 / 3 =</td>
              <td className="px-4 py-3.5 font-black text-amber-600 dark:text-amber-400 text-base">4.667</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }

  return (
    <figure className={cx('my-6 rounded-2xl border shadow-md overflow-hidden transition-all', border, theme.isLight ? 'bg-white' : 'bg-slate-900/60')}>
      {content}
      {caption && (
        <figcaption className={cx('border-t px-6 py-3.5 text-center text-xs font-semibold leading-relaxed', border, theme.mutedText)}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// 45 Deterministic Normal Sample Pairs for Silky Smooth Point Cloud Render
const DETERMINISTIC_GAUSSIAN_PAIRS = [
  [-0.63, 0.42], [0.81, -0.25], [-1.22, -0.91], [0.15, 1.12], [1.45, 0.88],
  [-0.95, 0.35], [0.42, -1.05], [-0.18, -0.52], [1.10, -0.75], [-1.55, 0.95],
  [0.65, 0.72], [-0.35, 1.40], [0.92, 0.15], [-0.85, -1.35], [0.05, -0.85],
  [1.35, -0.15], [-1.15, 0.10], [0.55, -1.45], [-0.45, -0.25], [1.05, 1.05],
  [-1.40, -0.65], [0.25, 0.65], [-0.75, 1.15], [1.25, 0.45], [-0.05, 0.35],
  [0.75, -0.45], [-1.30, 0.60], [0.35, -0.15], [-0.55, -1.10], [1.60, 0.20],
  [-0.25, -1.40], [0.95, -1.10], [-1.05, -0.35], [0.45, 1.25], [-0.65, 0.85],
  [1.15, -0.95], [-0.15, 0.95], [0.85, 0.55], [-1.50, 0.15], [0.10, -1.25],
  [-0.40, 0.15], [1.20, -1.30], [-0.90, -0.75], [0.50, 0.35], [-1.10, 1.25]
];

export function CovarianceMatrixExplorer({
  ariaLabel,
  caption,
  mode = 'interactive',
}: {
  ariaLabel: string;
  caption: string;
  labels?: string[];
  mode?: 'interactive' | 'synthesis';
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-slate-200' : 'border-slate-800';
  const cardBg = theme.isLight ? 'bg-white/90' : 'bg-slate-900/90';

  const [varX, setVarX] = useState(4.0);
  const [varY, setVarY] = useState(4.0);
  const [covXY, setCovXY] = useState(2.0);

  // Compute Standard Deviations & Maximum Allowed Covariance (|Cov| <= stdX * stdY)
  const stdX = Math.sqrt(varX);
  const stdY = Math.sqrt(varY);
  const maxCov = stdX * stdY * 0.95;
  const clampedCov = Math.max(-maxCov, Math.min(maxCov, covXY));

  // Pearson Correlation Coefficient
  const rCorr = clampedCov / (stdX * stdY || 1);

  // Covariance Matrix Eigenvalues & Eigenvectors for exact 1-sigma & 2-sigma ellipses
  const avgVar = (varX + varY) / 2;
  const diffVar = (varX - varY) / 2;
  const sqrtTerm = Math.sqrt(diffVar * diffVar + clampedCov * clampedCov);
  const lambda1 = Math.max(0.1, avgVar + sqrtTerm);
  const lambda2 = Math.max(0.1, avgVar - sqrtTerm);
  const rx1 = Math.sqrt(lambda1);
  const ry1 = Math.sqrt(lambda2);
  const rx2 = rx1 * 2;
  const ry2 = ry1 * 2;

  // Rotation Angle in Degrees
  const rotationDeg = (Math.atan2(2 * clampedCov, varX - varY) * 180) / (2 * Math.PI);

  // Transform deterministic sample points
  const points = DETERMINISTIC_GAUSSIAN_PAIRS.map(([bx, by]) => {
    const px = bx * stdX;
    const py = (rCorr * bx + Math.sqrt(Math.max(0.01, 1 - rCorr * rCorr)) * by) * stdY;
    return { x: px, y: py };
  });

  // Task completion states for synthesis mode
  const task1Done = varX >= 7.0 && varY <= 2.5;
  const task2Done = clampedCov <= -2.5;
  const task3Done = Math.abs(clampedCov) <= 0.3;
  const completedCount = [task1Done, task2Done, task3Done].filter(Boolean).length;

  return (
    <figure className={cx('my-8 rounded-3xl border shadow-xl overflow-hidden transition-all', border, theme.isLight ? 'bg-gradient-to-b from-slate-50 via-white to-slate-50' : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950')}>
      <div className="grid gap-8 p-6 lg:p-8 lg:grid-cols-12 items-center">
        {/* Left Side: Silky Smooth Scatter Plot Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-sky-500/5 to-purple-500/10 opacity-70 pointer-events-none" />

            <svg viewBox="-8 -8 16 16" className="w-full h-full overflow-visible relative z-10" role="img" aria-label={ariaLabel}>
              <defs>
                <radialGradient id="ellipseGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0.05" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.15" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Grid circles */}
              {[2, 4, 6].map((gridR) => (
                <circle key={gridR} cx="0" cy="0" r={gridR} stroke="#334155" strokeDasharray="0.3 0.3" strokeWidth="0.06" fill="none" vectorEffect="non-scaling-stroke" />
              ))}

              {/* Axes */}
              <line x1="-7.5" y1="0" x2="7.5" y2="0" stroke="#475569" strokeWidth="0.12" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="-7.5" x2="0" y2="7.5" stroke="#475569" strokeWidth="0.12" vectorEffect="non-scaling-stroke" />

              {/* Axis Labels */}
              <text x="7" y="-0.4" className="text-[0.5px] font-black fill-slate-400 font-mono">X</text>
              <text x="0.4" y="-7" className="text-[0.5px] font-black fill-slate-400 font-mono">Y</text>

              {/* Rotated Covariance Ellipses */}
              <g transform={`rotate(${rotationDeg})`}>
                {/* 2-Sigma Ellipse (95% Confidence) */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={rx2}
                  ry={ry2}
                  fill="none"
                  stroke="#818CF8"
                  strokeWidth="0.08"
                  strokeDasharray="0.4 0.4"
                  opacity="0.6"
                  vectorEffect="non-scaling-stroke"
                />

                {/* 1-Sigma Ellipse (68% Confidence) */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={rx1}
                  ry={ry1}
                  fill="url(#ellipseGradient)"
                  stroke="#38BDF8"
                  strokeWidth="0.15"
                  vectorEffect="non-scaling-stroke"
                  className="transition-all duration-300"
                />

                {/* Major & Minor Axis lines */}
                <line x1={-rx2} y1="0" x2={rx2} y2="0" stroke="#38BDF8" strokeWidth="0.05" strokeDasharray="0.2 0.2" opacity="0.4" />
                <line x1="0" y1={-ry2} x2="0" y2={ry2} stroke="#818CF8" strokeWidth="0.05" strokeDasharray="0.2 0.2" opacity="0.4" />
              </g>

              {/* Data Point Cloud */}
              {points.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={-pt.y}
                  r="0.22"
                  fill={clampedCov > 0.3 ? '#34D399' : clampedCov < -0.3 ? '#F87171' : '#38BDF8'}
                  filter="url(#glow)"
                  className="transition-all duration-300 hover:r-0.4 cursor-pointer opacity-90"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Right Side: Interactive Sliders, Live Matrix & Tasks */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          {/* Slider Controls */}
          <div className={cx('space-y-4 rounded-2xl border p-5 shadow-sm', cardBg, border)}>
            {/* Var(X) Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-extrabold mb-1.5">
                <span className={theme.titleText}>Phương sai Var(X) [σ_X²]:</span>
                <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 font-mono text-sky-500 border border-sky-500/20">
                  {varX.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="9.0"
                step="0.5"
                value={varX}
                onChange={(e) => setVarX(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Var(Y) Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-extrabold mb-1.5">
                <span className={theme.titleText}>Phương sai Var(Y) [σ_Y²]:</span>
                <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 font-mono text-indigo-500 border border-indigo-500/20">
                  {varY.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="9.0"
                step="0.5"
                value={varY}
                onChange={(e) => setVarY(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Cov(X,Y) Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-extrabold mb-1.5">
                <span className={theme.titleText}>Covariance Cov(X, Y) [σ_XY]:</span>
                <span className={cx('rounded-full px-2.5 py-0.5 font-mono border font-extrabold', clampedCov > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : clampedCov < 0 ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20')}>
                  {clampedCov > 0 ? `+${clampedCov.toFixed(2)}` : clampedCov.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="-6.0"
                max="6.0"
                step="0.2"
                value={covXY}
                onChange={(e) => setCovXY(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {/* Live Covariance Matrix Display & Correlation Badge */}
          <div className={cx('rounded-2xl border p-5 text-center shadow-sm', cardBg, border)}>
            <div className="flex items-center justify-between border-b pb-2.5 mb-3">
              <span className={cx('text-xs font-black uppercase tracking-wider', theme.mutedText)}>Ma trận Covariance Σ</span>
              <span className={cx('rounded-full px-2.5 py-0.5 text-xs font-mono font-bold', rCorr > 0 ? 'bg-emerald-500/10 text-emerald-500' : rCorr < 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-400')}>
                r = {rCorr > 0 ? `+${rCorr.toFixed(2)}` : rCorr.toFixed(2)}
              </span>
            </div>
            <div className="inline-flex items-center gap-3 font-mono text-lg font-black">
              <span className={theme.titleText}>Σ =</span>
              <div className="border-l-2 border-r-2 border-slate-400 dark:border-slate-500 px-4 py-2 rounded-sm">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base sm:text-lg">
                  <span className="text-sky-500 font-extrabold">{varX.toFixed(1)}</span>
                  <span className={clampedCov >= 0 ? 'text-emerald-500 font-extrabold' : 'text-rose-500 font-extrabold'}>{clampedCov > 0 ? `+${clampedCov.toFixed(2)}` : clampedCov.toFixed(2)}</span>
                  <span className={clampedCov >= 0 ? 'text-emerald-500 font-extrabold' : 'text-rose-500 font-extrabold'}>{clampedCov > 0 ? `+${clampedCov.toFixed(2)}` : clampedCov.toFixed(2)}</span>
                  <span className="text-indigo-500 font-extrabold">{varY.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Synthesis Mode Task Checklist */}
          {mode === 'synthesis' && (
            <div className={cx('rounded-2xl border p-5 space-y-3 shadow-sm', cardBg, border)}>
              <div className="flex items-center justify-between border-b pb-2">
                <span className={cx('text-xs font-black uppercase tracking-wider', theme.titleText)}>Nhiệm vụ Mini Interaction:</span>
                <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-black text-indigo-500">
                  {completedCount} / 3 Hoàn thành
                </span>
              </div>
              <div className="space-y-2 text-xs font-bold">
                <div className={cx('flex items-center gap-2.5 rounded-xl p-2.5 transition-all', task1Done ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : theme.bodyText)}>
                  <span className={cx('flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black', task1Done ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500')}>
                    {task1Done ? '✓' : '1'}
                  </span>
                  <span>1. Đám mây rộng ngang, hẹp dọc (Var X lớn, Var Y nhỏ)</span>
                </div>

                <div className={cx('flex items-center gap-2.5 rounded-xl p-2.5 transition-all', task2Done ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : theme.bodyText)}>
                  <span className={cx('flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black', task2Done ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500')}>
                    {task2Done ? '✓' : '2'}
                  </span>
                  <span>2. Đám mây nghiêng xuống (Cov XY &lt; 0)</span>
                </div>

                <div className={cx('flex items-center gap-2.5 rounded-xl p-2.5 transition-all', task3Done ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : theme.bodyText)}>
                  <span className={cx('flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black', task3Done ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500')}>
                    {task3Done ? '✓' : '3'}
                  </span>
                  <span>3. Không có xu hướng tuyến tính (Cov XY ≈ 0)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <figcaption className={cx('border-t px-6 py-4 text-center text-xs font-semibold leading-relaxed', border, theme.mutedText)}>
        {caption}
      </figcaption>
    </figure>
  );
}

import { useState } from 'react';
import { useLearningMdxTheme } from '../../learningMdxComponents';
import { cx } from '../../theme';

type JointMarginalConceptKind =
  | 'table-to-scatter'
  | 'joint-heatmap'
  | 'joint-representations'
  | 'axis-projection'
  | 'marginal-vs-conditional'
  | 'scale-dependence'
  | 'correlation-signs'
  | 'non-linear-ushape'
  | 'causation-confounding';

export function JointMarginalConceptVisual({
  ariaLabel,
  caption,
  labels = [],
  kind,
}: {
  ariaLabel: string;
  caption: string;
  labels?: string[];
  kind: JointMarginalConceptKind;
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-slate-200' : 'border-slate-800';
  const cardBg = theme.isLight ? 'bg-white/90' : 'bg-slate-900/90';

  let content: React.ReactNode = null;

  if (kind === 'table-to-scatter') {
    content = (
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className={cx('rounded-2xl border p-5 shadow-sm', cardBg, border)}>
          <p className={cx('mb-3 text-center text-xs font-black uppercase tracking-wider', theme.mutedText)}>
            {labels[0] ?? 'Bảng dữ liệu 2 chiều'}
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-center text-sm">
              <thead>
                <tr className={theme.isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-200'}>
                  <th className="py-2.5 px-3 font-bold">Người</th>
                  <th className="py-2.5 px-3 font-bold text-sky-500">Chiều cao (X)</th>
                  <th className="py-2.5 px-3 font-bold text-indigo-500">Cân nặng (Y)</th>
                </tr>
              </thead>
              <tbody className={cx('divide-y font-mono font-semibold', border)}>
                <tr className="hover:bg-sky-500/5"><td className={cx('py-2.5 font-sans font-bold', theme.titleText)}>A</td><td>160</td><td>50</td></tr>
                <tr className="hover:bg-sky-500/5"><td className={cx('py-2.5 font-sans font-bold', theme.titleText)}>B</td><td>170</td><td>65</td></tr>
                <tr className="hover:bg-sky-500/5"><td className={cx('py-2.5 font-sans font-bold', theme.titleText)}>C</td><td>180</td><td>80</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={cx('flex flex-col items-center justify-center rounded-2xl border p-5 shadow-sm', cardBg, border)}>
          <p className={cx('mb-3 text-xs font-black uppercase tracking-wider', theme.mutedText)}>
            {labels[1] ?? 'Điểm trên Scatter Plot (x_i, y_i)'}
          </p>
          <svg viewBox="150 40 40 50" className="w-full max-w-[220px] aspect-square rounded-2xl bg-slate-950 p-3 shadow-inner">
            <line x1="150" y1="85" x2="190" y2="85" stroke="#475569" strokeWidth="0.5" />
            <line x1="155" y1="40" x2="155" y2="90" stroke="#475569" strokeWidth="0.5" />
            {[
              { label: 'A (160, 50)', x: 160, y: 50 },
              { label: 'B (170, 65)', x: 170, y: 65 },
              { label: 'C (180, 80)', x: 180, y: 80 },
            ].map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={135 - pt.y} r="1.5" className="fill-sky-400 stroke-white stroke-[0.3]" />
                <text x={pt.x + 2} y={135 - pt.y - 1} className="text-[2.2px] font-mono font-bold fill-sky-200">{pt.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  } else if (kind === 'joint-heatmap') {
    content = (
      <div className="grid gap-6 p-6 lg:grid-cols-5">
        <div className="lg:col-span-3 flex justify-center">
          <svg viewBox="-4 -4 8 8" className="w-full max-w-sm aspect-square rounded-2xl bg-slate-950 p-3 shadow-inner">
            <defs>
              <radialGradient id="densityGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="40%" stopColor="#6366F1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="0" cy="0" r="3.2" fill="url(#densityGlow)" />
            <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke="#475569" strokeWidth="0.1" />
            <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#475569" strokeWidth="0.1" />
            {[-1.8, -1.2, -0.6, 0, 0.5, 1.1, 1.7].map((x, i) => (
              <circle key={i} cx={x} cy={-x * 0.7 + (i % 2 === 0 ? 0.3 : -0.3)} r="0.2" className="fill-sky-300" />
            ))}
          </svg>
        </div>
        <div className="lg:col-span-2 flex flex-col justify-center gap-3">
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-5 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-sky-400">Mật độ Xác suất Phân phối Đồng thời</p>
            <p className="mt-2 font-mono text-xl font-black text-sky-500">f_{'{X,Y}'}(x, y)</p>
          </div>
          <p className={cx('text-xs leading-relaxed', theme.bodyText)}>
            Vùng sáng đậm thể hiện mật độ dữ liệu tập trung cao. Phân phối đồng thời cho biết xác suất để cả hai biến <span className="font-bold text-sky-500">X và Y</span> cùng rơi vào một khoảng giá trị.
          </p>
        </div>
      </div>
    );
  } else if (kind === 'joint-representations') {
    content = (
      <div className="grid gap-4 p-6 md:grid-cols-3">
        <div className={cx('flex flex-col items-center rounded-2xl border p-4 text-center shadow-sm', cardBg, border)}>
          <span className="mb-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-500">1. Scatter Plot</span>
          <svg viewBox="-3 -3 6 6" className="w-full max-w-[150px] aspect-square rounded-xl bg-slate-950 p-2 shadow-inner">
            {[[-1.8, -1.5], [-1, -0.8], [0, 0.2], [1.2, 0.9], [2, 1.8]].map(([px, py], i) => (
              <circle key={i} cx={px} cy={-py} r="0.3" fill="#38BDF8" />
            ))}
          </svg>
          <p className={cx('mt-2 text-xs', theme.mutedText)}>Hiển thị từng điểm quan sát cụ thể</p>
        </div>

        <div className={cx('flex flex-col items-center rounded-2xl border p-4 text-center shadow-sm', cardBg, border)}>
          <span className="mb-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-500">2. 2D Histogram</span>
          <svg viewBox="0 0 4 4" className="w-full max-w-[150px] aspect-square rounded-xl bg-slate-950 p-2 shadow-inner">
            <rect x="0" y="0" width="2" height="2" fill="#312E81" />
            <rect x="2" y="0" width="2" height="2" fill="#4338CA" />
            <rect x="0" y="2" width="2" height="2" fill="#6366F1" />
            <rect x="2" y="2" width="2" height="2" fill="#818CF8" />
          </svg>
          <p className={cx('mt-2 text-xs', theme.mutedText)}>Chia lưới ô và đếm tần suất</p>
        </div>

        <div className={cx('flex flex-col items-center rounded-2xl border p-4 text-center shadow-sm', cardBg, border)}>
          <span className="mb-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-500">3. Density Contour</span>
          <svg viewBox="-3 -3 6 6" className="w-full max-w-[150px] aspect-square rounded-xl bg-slate-950 p-2 shadow-inner">
            <ellipse cx="0" cy="0" rx="2.5" ry="1.6" fill="none" stroke="#C084FC" strokeWidth="0.15" strokeDasharray="0.3 0.3" transform="rotate(-30)" />
            <ellipse cx="0" cy="0" rx="1.5" ry="0.9" fill="none" stroke="#A855F7" strokeWidth="0.2" transform="rotate(-30)" />
            <ellipse cx="0" cy="0" rx="0.7" ry="0.4" fill="#9333EA" opacity="0.6" transform="rotate(-30)" />
          </svg>
          <p className={cx('mt-2 text-xs', theme.mutedText)}>Đường đồng mức độ mật độ</p>
        </div>
      </div>
    );
  } else if (kind === 'axis-projection') {
    content = (
      <div className="grid gap-6 p-6 lg:grid-cols-5">
        <div className="lg:col-span-3 flex justify-center">
          <svg viewBox="-5 -5 10 10" className="w-full max-w-sm aspect-square rounded-2xl bg-slate-950 p-3 shadow-inner">
            {/* Target Histograms on Margins */}
            <rect x="-4" y="4.1" width="8" height="0.8" fill="rgba(56, 189, 248, 0.15)" rx="0.2" />
            <rect x="-4.9" y="-4" width="0.8" height="8" fill="rgba(99, 102, 241, 0.15)" rx="0.2" />

            {/* Projection dashed lines */}
            {[[-2.5, -2], [-1.2, -1], [0, 0.2], [1.5, 1.2], [2.8, 2.5]].map(([px, py], i) => (
              <g key={i}>
                <line x1={px} y1={-py} x2={px} y2="4.1" stroke="#38BDF8" strokeDasharray="0.2 0.2" strokeWidth="0.05" />
                <line x1={px} y1={-py} x2="-4.1" y2={-py} stroke="#818CF8" strokeDasharray="0.2 0.2" strokeWidth="0.05" />
                <circle cx={px} cy={-py} r="0.25" fill="#38BDF8" />
                <circle cx={px} cy="4.5" r="0.15" fill="#38BDF8" />
                <circle cx="-4.5" cy={-py} r="0.15" fill="#818CF8" />
              </g>
            ))}

            {/* Main Axes */}
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#64748B" strokeWidth="0.1" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#64748B" strokeWidth="0.1" />
          </svg>
        </div>
        <div className="lg:col-span-2 flex flex-col justify-center gap-3">
          <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-5 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-sky-400">Phép Chiếu Dữ Liệu 2D</p>
            <p className="mt-2 font-mono text-lg font-black text-sky-500">Joint Distribution ➔ Marginals</p>
          </div>
          <p className={cx('text-xs leading-relaxed', theme.bodyText)}>
            Chiếu tất cả các điểm theo chiều dọc xuống trục ngang tạo ra <span className="font-bold text-sky-500">Marginal X</span>. Chiếu ngang sang trục dọc tạo ra <span className="font-bold text-indigo-500">Marginal Y</span>.
          </p>
        </div>
      </div>
    );
  } else if (kind === 'marginal-vs-conditional') {
    content = (
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className={cx('flex flex-col items-center rounded-2xl border p-5 text-center shadow-sm', cardBg, border)}>
          <span className="mb-3 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-black text-sky-500">Marginal f_X(x)</span>
          <svg viewBox="-4 -4 8 8" className="w-full max-w-[200px] aspect-square rounded-xl bg-slate-950 p-2 shadow-inner">
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#64748B" strokeWidth="0.1" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#64748B" strokeWidth="0.1" />
            {[-2.5, -1.8, -0.8, 0.2, 1.4, 2.5].map((px, i) => (
              <g key={i}>
                <line x1={px} y1="-3" x2={px} y2="3" stroke="#38BDF8" strokeDasharray="0.2 0.2" strokeWidth="0.05" />
                <circle cx={px} cy={i % 2 === 0 ? -1.5 : 1.2} r="0.25" fill="#38BDF8" />
              </g>
            ))}
          </svg>
          <p className={cx('mt-3 text-xs', theme.mutedText)}>Gom tất cả dữ liệu Y (tích phân/cộng bỏ qua Y)</p>
        </div>

        <div className={cx('flex flex-col items-center rounded-2xl border p-5 text-center shadow-sm', cardBg, border)}>
          <span className="mb-3 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-500">Conditional f_X|Y(x | y=y₀)</span>
          <svg viewBox="-4 -4 8 8" className="w-full max-w-[200px] aspect-square rounded-xl bg-slate-950 p-2 shadow-inner">
            <rect x="-4" y="-1" width="8" height="2" fill="rgba(245, 158, 11, 0.2)" stroke="#F59E0B" strokeDasharray="0.3 0.3" strokeWidth="0.1" />
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#64748B" strokeWidth="0.1" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#64748B" strokeWidth="0.1" />
            {[-1.8, -0.2, 1.5].map((px, i) => (
              <circle key={i} cx={px} cy="0.1" r="0.3" fill="#F59E0B" />
            ))}
          </svg>
          <p className={cx('mt-3 text-xs', theme.mutedText)}>Chỉ xét một lát mỏng khi biết cố định Y = y₀</p>
        </div>
      </div>
    );
  } else if (kind === 'scale-dependence') {
    content = (
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div className={cx('flex flex-col items-center justify-center rounded-2xl border p-5 text-center shadow-sm', cardBg, border)}>
          <span className="mb-2 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold">Đơn vị Mét (m)</span>
          <p className="font-mono text-2xl font-black text-sky-500">Cov(X_m, Y) = 0.02</p>
          <p className={cx('mt-2 text-xs', theme.mutedText)}>Giá trị covariance rất nhỏ do scale của mét bé</p>
        </div>

        <div className={cx('flex flex-col items-center justify-center rounded-2xl border p-5 text-center shadow-sm', cardBg, border)}>
          <span className="mb-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500">Đơn vị Centimet (cm = 100 × m)</span>
          <p className="font-mono text-2xl font-black text-amber-500">Cov(X_cm, Y) = 2.00</p>
          <p className={cx('mt-2 text-xs', theme.mutedText)}>Covariance tăng 100 lần dù quan hệ không hề thay đổi!</p>
        </div>
      </div>
    );
  } else if (kind === 'correlation-signs') {
    content = (
      <div className="grid gap-4 p-6 md:grid-cols-3">
        {[
          { title: 'ρ > 0 (Dương)', r: '+0.85', stroke: '#10B981', points: [[-2, -1.8], [-1, -0.9], [0, 0.1], [1, 0.9], [2, 1.9]] },
          { title: 'ρ ≈ 0 (Không tuyến tính)', r: '0.00', stroke: '#F59E0B', points: [[-2, 0.5], [-1, -1.5], [0, 1.8], [1, -0.6], [2, -1.2]] },
          { title: 'ρ < 0 (Âm)', r: '-0.85', stroke: '#EF4444', points: [[-2, 1.9], [-1, 0.9], [0, -0.1], [1, -0.9], [2, -1.8]] },
        ].map((item, idx) => (
          <div key={idx} className={cx('flex flex-col items-center rounded-2xl border p-4 text-center shadow-sm', cardBg, border)}>
            <span className="mb-1 text-xs font-black" style={{ color: item.stroke }}>{item.title}</span>
            <p className="mb-3 font-mono text-xl font-black" style={{ color: item.stroke }}>ρ = {item.r}</p>
            <svg viewBox="-3 -3 6 6" className="w-full max-w-[160px] aspect-square rounded-xl bg-slate-950 p-2 shadow-inner">
              <line x1="-3" y1="0" x2="3" y2="0" stroke="#334155" strokeDasharray="0.5 0.5" strokeWidth="0.1" />
              <line x1="0" y1="-3" x2="0" y2="3" stroke="#334155" strokeDasharray="0.5 0.5" strokeWidth="0.1" />
              {item.points.map(([px, py], i) => (
                <circle key={i} cx={px} cy={-py} r="0.3" fill={item.stroke} />
              ))}
            </svg>
          </div>
        ))}
      </div>
    );
  } else if (kind === 'non-linear-ushape') {
    content = (
      <div className="grid gap-6 p-6 lg:grid-cols-5">
        <div className="lg:col-span-3 flex justify-center">
          <svg viewBox="-4 -4 8 8" className="w-full max-w-sm aspect-square rounded-2xl bg-slate-950 p-3 shadow-inner">
            <line x1="-4" y1="0" x2="4" y2="0" stroke="#475569" strokeWidth="0.1" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#475569" strokeWidth="0.1" />
            {[-2.8, -2.0, -1.2, 0, 1.2, 2.0, 2.8].map((vx, i) => (
              <circle key={i} cx={vx} cy={-(vx * vx * 0.35 - 1.8)} r="0.3" fill="#EF4444" />
            ))}
          </svg>
        </div>
        <div className="lg:col-span-2 flex flex-col justify-center gap-3">
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-rose-400">Pearson Correlation ≈ 0</p>
            <p className="mt-2 font-mono text-2xl font-black text-rose-500">Y = X²</p>
          </div>
          <p className={cx('text-xs leading-relaxed', theme.bodyText)}>
            Pearson correlation chỉ đo quan hệ **tuyến tính** (đường thẳng). Quan hệ hình parabol U-shape có sự phụ thuộc hoàn hảo nhưng correlation lại bằng 0!
          </p>
        </div>
      </div>
    );
  } else if (kind === 'causation-confounding') {
    content = (
      <div className="flex flex-col items-center justify-center p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-6 font-bold text-center">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/15 px-6 py-4 text-amber-500 shadow-md">
            <p className="text-xs uppercase tracking-wider">Biến Nguyên Nhân Thứ 3</p>
            <p className="text-lg font-black mt-1">Nhiệt Độ Mùa Hè Tăng (Z)</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center font-mono font-bold text-sky-400 text-sm">↙ Tác động</div>
          <div className="text-center font-mono font-bold text-indigo-400 text-sm">↘ Tác động</div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 w-full max-w-lg">
          <div className={cx('rounded-2xl border p-4 text-center shadow-sm', cardBg, border)}>
            <p className="text-xs font-bold text-slate-400">Biến X</p>
            <p className="text-base font-black text-sky-500 mt-1">Bán Kem</p>
          </div>

          <div className={cx('rounded-2xl border p-4 text-center shadow-sm', cardBg, border)}>
            <p className="text-xs font-bold text-slate-400">Biến Y</p>
            <p className="text-base font-black text-indigo-500 mt-1">Số Người Đi Bơi</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <figure aria-label={ariaLabel} className={cx('my-6 rounded-3xl border shadow-md overflow-hidden transition-all', border, theme.isLight ? 'bg-white' : 'bg-slate-900/60')}>
      {content}
      {caption && (
        <figcaption className={cx('border-t px-6 py-3.5 text-center text-xs font-semibold leading-relaxed', border, theme.mutedText)}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Interactive Marginal Projection Explorer Component
export function MarginalProjectionExplorer({
  ariaLabel,
  caption,
}: {
  ariaLabel: string;
  caption: string;
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-slate-200' : 'border-slate-800';
  const cardBg = theme.isLight ? 'bg-white/90' : 'bg-slate-900/90';

  const [projectDirection, setProjectDirection] = useState<'none' | 'x' | 'y'>('none');

  const points = [
    { x: 1, y: 2 }, { x: 1.5, y: 3 }, { x: 2, y: 3.5 }, { x: 2.5, y: 2 },
    { x: 3, y: 4 }, { x: 3.5, y: 5 }, { x: 4, y: 4.5 }, { x: 4.5, y: 6 },
    { x: 5, y: 5.5 }, { x: 5.5, y: 7 }, { x: 6, y: 8 }
  ];

  const meanX = 3.5;
  const varX = 2.45;
  const meanY = 4.64;
  const varY = 3.12;

  return (
    <figure className={cx('my-8 rounded-3xl border shadow-xl overflow-hidden transition-all', border, theme.isLight ? 'bg-gradient-to-b from-slate-50 via-white to-slate-50' : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950')}>
      <div className="grid gap-6 p-6 lg:p-8 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
            <svg viewBox="0 0 10 10" className="w-full h-full overflow-visible" role="img" aria-label={ariaLabel}>
              {/* Axes */}
              <line x1="1" y1="9" x2="9" y2="9" stroke="#475569" strokeWidth="0.08" />
              <line x1="1" y1="1" x2="1" y2="9" stroke="#475569" strokeWidth="0.08" />
              <text x="8.8" y="9.6" className="text-[0.4px] font-black fill-slate-400 font-mono">X</text>
              <text x="0.4" y="1.2" className="text-[0.4px] font-black fill-slate-400 font-mono">Y</text>

              {/* Data points & projections */}
              {points.map((pt, i) => {
                const posX = projectDirection === 'y' ? 1 : pt.x;
                const posY = projectDirection === 'x' ? 1 : 10 - pt.y;

                return (
                  <g key={i} className="transition-all duration-700 ease-in-out">
                    {projectDirection === 'x' && (
                      <line x1={pt.x} y1={10 - pt.y} x2={pt.x} y2="9" stroke="#38BDF8" strokeDasharray="0.1 0.1" strokeWidth="0.03" />
                    )}
                    {projectDirection === 'y' && (
                      <line x1={pt.x} y1={10 - pt.y} x2="1" y2={10 - pt.y} stroke="#818CF8" strokeDasharray="0.1 0.1" strokeWidth="0.03" />
                    )}
                    <circle cx={posX} cy={posY} r="0.22" fill={projectDirection === 'x' ? '#38BDF8' : projectDirection === 'y' ? '#818CF8' : '#34D399'} />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center gap-5">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setProjectDirection(projectDirection === 'x' ? 'none' : 'x')}
              className={cx('rounded-2xl px-5 py-3 text-xs font-black shadow-md transition-all flex items-center justify-between', projectDirection === 'x' ? 'bg-sky-500 text-white shadow-sky-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:scale-102')}
            >
              <span>⬇ Chiếu Dữ Liệu Xuống Trục X (Marginal X)</span>
              <span className="font-mono text-sm">p_X(x)</span>
            </button>

            <button
              type="button"
              onClick={() => setProjectDirection(projectDirection === 'y' ? 'none' : 'y')}
              className={cx('rounded-2xl px-5 py-3 text-xs font-black shadow-md transition-all flex items-center justify-between', projectDirection === 'y' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:scale-102')}
            >
              <span>⬅ Chiếu Dữ Liệu Sang Trục Y (Marginal Y)</span>
              <span className="font-mono text-sm">p_Y(y)</span>
            </button>
          </div>

          <div className={cx('rounded-2xl border p-5 space-y-3 shadow-sm', cardBg, border)}>
            <p className={cx('text-xs font-black uppercase tracking-wider', theme.mutedText)}>Thống Kê Phân Phối Biên (Marginal Stats)</p>
            {projectDirection === 'x' && (
              <div className="space-y-2 font-mono text-xs text-sky-500 font-extrabold animate-fadeIn">
                <p className="flex justify-between"><span>Marginal Mean μ_X:</span><span>{meanX.toFixed(2)}</span></p>
                <p className="flex justify-between"><span>Marginal Variance σ_X²:</span><span>{varX.toFixed(2)}</span></p>
              </div>
            )}
            {projectDirection === 'y' && (
              <div className="space-y-2 font-mono text-xs text-indigo-500 font-extrabold animate-fadeIn">
                <p className="flex justify-between"><span>Marginal Mean μ_Y:</span><span>{meanY.toFixed(2)}</span></p>
                <p className="flex justify-between"><span>Marginal Variance σ_Y²:</span><span>{varY.toFixed(2)}</span></p>
              </div>
            )}
            {projectDirection === 'none' && (
              <p className={cx('text-xs font-semibold italic', theme.mutedText)}>Nhấn nút ở trên để quan sát phép chiếu và thống kê biên tương ứng.</p>
            )}
          </div>
        </div>
      </div>
      <figcaption className={cx('border-t px-6 py-3.5 text-center text-xs font-semibold leading-relaxed', border, theme.mutedText)}>
        {caption}
      </figcaption>
    </figure>
  );
}

// Correlation Matrix Explorer Component
export function CorrelationMatrixExplorer({
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

  const [rho, setRho] = useState(0.7);

  const basePoints = [
    [-1.8, -1.2], [-1.2, -0.6], [-0.8, -0.9], [-0.3, -0.1], [0, 0.2],
    [0.4, -0.3], [0.7, 0.5], [1.1, 0.8], [1.5, 1.3], [1.9, 1.1]
  ];

  const points = basePoints.map(([bx, by]) => {
    const px = bx * 2;
    const py = (rho * bx + Math.sqrt(Math.max(0.01, 1 - rho * rho)) * by) * 2;
    return { x: px, y: py };
  });

  const task1Done = rho <= -0.75;

  return (
    <figure className={cx('my-8 rounded-3xl border shadow-xl overflow-hidden transition-all', border, theme.isLight ? 'bg-gradient-to-b from-slate-50 via-white to-slate-50' : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950')}>
      <div className="grid gap-6 p-6 lg:p-8 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
            <svg viewBox="-6 -6 12 12" className="w-full h-full overflow-visible" role="img" aria-label={ariaLabel}>
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#475569" strokeWidth="0.08" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#475569" strokeWidth="0.08" />
              {points.map((pt, i) => (
                <circle key={i} cx={pt.x} cy={-pt.y} r="0.25" fill={rho > 0 ? '#34D399' : rho < 0 ? '#F87171' : '#F59E0B'} />
              ))}
            </svg>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          <div className={cx('space-y-4 rounded-2xl border p-5 shadow-sm', cardBg, border)}>
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className={theme.titleText}>Hệ số Tương quan Pearson ρ:</span>
              <span className={cx('rounded-full px-3 py-1 font-mono text-sm font-black', rho > 0 ? 'bg-emerald-500/10 text-emerald-500' : rho < 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500')}>
                {rho > 0 ? `+${rho.toFixed(2)}` : rho.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="-1.0"
              max="1.0"
              step="0.05"
              value={rho}
              onChange={(e) => setRho(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className={cx('rounded-2xl border p-5 text-center shadow-sm', cardBg, border)}>
            <p className={cx('text-xs font-black uppercase tracking-wider mb-2', theme.mutedText)}>Ma trận Correlation R</p>
            <div className="inline-flex items-center gap-3 font-mono text-lg font-black">
              <span className={theme.titleText}>R =</span>
              <div className="border-l-2 border-r-2 border-slate-400 dark:border-slate-500 px-4 py-2 rounded-sm">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base">
                  <span className="text-sky-500">1.00</span>
                  <span className={rho >= 0 ? 'text-emerald-500' : 'text-rose-500'}>{rho > 0 ? `+${rho.toFixed(2)}` : rho.toFixed(2)}</span>
                  <span className={rho >= 0 ? 'text-emerald-500' : 'text-rose-500'}>{rho > 0 ? `+${rho.toFixed(2)}` : rho.toFixed(2)}</span>
                  <span className="text-sky-500">1.00</span>
                </div>
              </div>
            </div>
          </div>

          {mode === 'synthesis' && (
            <div className={cx('rounded-2xl border p-4 space-y-2 shadow-sm', cardBg, border)}>
              <span className={cx('text-xs font-black uppercase tracking-wider', theme.titleText)}>Nhiệm vụ:</span>
              <div className={cx('flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold transition-all', task1Done ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : theme.bodyText)}>
                <span>{task1Done ? '✓ Hoàn thành!' : '1. Điều chỉnh slider để đạt correlation âm mạnh (ρ <= -0.75)'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <figcaption className={cx('border-t px-6 py-3.5 text-center text-xs font-semibold leading-relaxed', border, theme.mutedText)}>
        {caption}
      </figcaption>
    </figure>
  );
}

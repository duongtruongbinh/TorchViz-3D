import { useId, useState } from 'react';
import { SvgArrowMarker } from '../../primitives/diagramPrimitives';
import { InlineMath } from '../../learningMdxComponents';
import { DL_PALETTE, DlCardShell } from './primitives';

type BatchCard = {
  id: 'batch' | 'minibatch' | 'sgd';
  title: string;
  badge: string;
  badgeClass: string;
  accent: string;
  pathD: string;
  summary: string;
};

const BATCH_CARDS: BatchCard[] = [
  {
    id: 'batch',
    title: 'Batch GD',
    badge: 'Toàn bộ dữ liệu',
    badgeClass: 'bg-[#EFF3F8] text-[#205089] border-[#B8C8DA]',
    accent: DL_PALETTE.primary,
    pathD: 'M 32 24 L 60 44 L 84 62 L 106 76 L 122 86',
    summary: 'Đường đi mượt, ổn định nhất nhưng mỗi bước rất chậm và tốn RAM.',
  },
  {
    id: 'minibatch',
    title: 'Mini-batch GD',
    badge: '32 – 256 mẫu / bước',
    badgeClass: 'bg-teal-50 text-[#0F766E] border-teal-200',
    accent: DL_PALETTE.teal,
    pathD: 'M 32 24 L 58 50 L 76 54 L 98 76 L 114 80 L 124 88',
    summary: 'Tận dụng song song GPU, hơi lắc nhẹ nhưng hội tụ nhanh — chuẩn thực tế.',
  },
  {
    id: 'sgd',
    title: 'Stochastic GD (SGD)',
    badge: '1 mẫu / bước',
    badgeClass: 'bg-rose-50 text-[#C2415A] border-rose-200',
    accent: DL_PALETTE.rose,
    pathD: 'M 32 24 L 68 34 L 46 66 L 94 56 L 82 94 L 118 74 L 122 92',
    summary: 'Cập nhật cực nhanh nhưng nhiễu mạnh, dao động zíc-zắc quanh đáy.',
  },
];

type LrPreset = {
  id: 'small' | 'good' | 'large';
  label: string;
  eta: number;
  accent: string;
  pillClass: string;
  description: string;
};

const LR_PRESETS: LrPreset[] = [
  {
    id: 'small',
    label: 'Quá nhỏ',
    eta: 0.08,
    accent: DL_PALETTE.primary,
    pillClass: 'border-[#B8C8DA] bg-[#EFF3F8] text-[#205089]',
    description: 'Bước nhảy quá ngắn, mất nhiều vòng lặp mà vẫn còn cách xa đáy tối ưu.',
  },
  {
    id: 'good',
    label: 'Vừa phải',
    eta: 0.35,
    accent: DL_PALETTE.teal,
    pillClass: 'border-teal-200 bg-teal-50 text-[#0F766E]',
    description: 'Tiến thẳng về đáy chỉ sau vài bước cập nhật, hội tụ ổn định và nhanh chóng.',
  },
  {
    id: 'large',
    label: 'Quá lớn',
    eta: 1.08,
    accent: DL_PALETTE.rose,
    pillClass: 'border-rose-200 bg-rose-50 text-[#C2415A]',
    description: 'Nhảy vọt qua bờ bên kia và ngày càng văng ra xa khỏi đáy (phân kỳ).',
  },
];

function BatchVariantsView() {
  return (
    <section
      className="my-5 grid grid-cols-1 gap-4 md:grid-cols-3"
      aria-label="So sánh quỹ đạo Batch GD, Mini-batch GD và Stochastic GD"
    >
      {BATCH_CARDS.map((card) => (
        <div
          key={card.id}
          className="rounded-xl border border-[#B8C8DA] bg-white p-4 shadow-sm"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-[#172A43]">{card.title}</h4>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10.5px] font-semibold ${card.badgeClass}`}
            >
              {card.badge}
            </span>
          </div>

          <div className="mb-3 overflow-hidden rounded-lg border border-slate-100 bg-slate-50/50">
            <svg
              viewBox="0 0 180 120"
              className="h-auto w-full"
              role="img"
              aria-label={`Quỹ đạo hội tụ của ${card.title}`}
            >
              {/* Loss contour ellipses centered at (124, 88) */}
              <ellipse
                cx="124"
                cy="88"
                rx="64"
                ry="44"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="1.1"
              />
              <ellipse
                cx="124"
                cy="88"
                rx="44"
                ry="30"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="1.1"
              />
              <ellipse
                cx="124"
                cy="88"
                rx="22"
                ry="15"
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1.2"
              />
              <circle cx="124" cy="88" r="3.5" fill="#0F766E" />

              {/* Trajectory */}
              <path
                d={card.pathD}
                fill="none"
                stroke={card.accent}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="32" cy="24" r="3.5" fill={card.accent} />
            </svg>
          </div>

          <p className="text-xs leading-relaxed text-slate-600">{card.summary}</p>
        </div>
      ))}
    </section>
  );
}

const LR_VIEW_W = 540;
const LR_VIEW_H = 210;
const LR_ORIGIN_X = 270;
const LR_AXIS_Y = 178;
const LR_SCALE_X = 48; // 1 unit of w = 48px
const LR_SCALE_Y = 8.2; // L(w) = w^2

function mapWToX(w: number): number {
  return LR_ORIGIN_X + w * LR_SCALE_X;
}

function mapLToY(lVal: number): number {
  return LR_AXIS_Y - lVal * LR_SCALE_Y;
}

function LearningRateView() {
  const markerId = useId();

  const [presetId, setPresetId] = useState<LrPreset['id']>('good');
  const preset = LR_PRESETS.find((item) => item.id === presetId) ?? LR_PRESETS[1];

  // Simulate 4 steps on L(w) = w^2 starting from w0 = -3.0
  const weights: number[] = [-3.0];
  for (let i = 0; i < 4; i += 1) {
    const wCurr = weights[i];
    const grad = 2 * wCurr;
    const wNext = wCurr - preset.eta * grad;
    weights.push(wNext);
  }

  // Parabola path from w = -4.2 to w = 4.2
  const curvePoints: string[] = [];
  for (let w = -4.2; w <= 4.21; w += 0.2) {
    const x = mapWToX(w);
    const y = mapLToY(w * w);
    curvePoints.push(`${w === -4.2 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  return (
    <DlCardShell
      ariaLabel="Minh họa ảnh hưởng của Learning Rate đến quỹ đạo hội tụ"
      title={
        <>
          Thử chọn Learning Rate (<InlineMath formula="\eta" />) trên hàm{' '}
          <InlineMath formula="\mathcal{L}(w) = w^2" />
        </>
      }
      rightSlot={
        <div className="flex flex-wrap gap-1.5">
          {LR_PRESETS.map((item) => {
            const active = item.id === preset.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPresetId(item.id)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                  active
                    ? item.pillClass
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-[#EFF3F8]/60 hover:text-[#205089]'
                }`}
              >
                {item.label} (<InlineMath formula={`\\eta = ${item.eta}`} />)
              </button>
            );
          })}
        </div>
      }
    >

      <div className="relative w-full" style={{ aspectRatio: `${LR_VIEW_W} / ${LR_VIEW_H}` }}>
        <svg
          viewBox={`0 0 ${LR_VIEW_W} ${LR_VIEW_H}`}
          className="h-full w-full"
          role="img"
          aria-label={`Quỹ đạo cập nhật trọng số với learning rate ${preset.eta}`}
        >
          <defs>
            <SvgArrowMarker
              id={markerId} color={preset.accent} path="M0,0.8 L5.5,3 L0,5.2 z"
              markerWidth="6" markerHeight="6" refX="4.5" refY="3" orient="auto"
            />
          </defs>

          {/* Axes */}
          <line x1="40" y1={LR_AXIS_Y} x2="500" y2={LR_AXIS_Y} stroke="#CBD5E1" strokeWidth="1.5" />
          <line x1={LR_ORIGIN_X} y1="18" x2={LR_ORIGIN_X} y2={LR_AXIS_Y} stroke="#E2E8F0" strokeWidth="1.2" />

          {/* Parabola */}
          <path
            d={curvePoints.join(' ')}
            fill="none"
            stroke="#64748B"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Optimal vertex w* = 0 */}
          <circle cx={LR_ORIGIN_X} cy={LR_AXIS_Y} r="4.5" fill="#0F766E" />

          {/* Step segments */}
          {weights.slice(0, -1).map((wVal, idx) => {
            const wNext = weights[idx + 1];
            const x1 = mapWToX(wVal);
            const y1 = mapLToY(wVal * wVal);
            const x2 = mapWToX(wNext);
            const y2 = mapLToY(wNext * wNext);
            return (
              <line
                key={`seg-${idx}-${wVal.toFixed(2)}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={preset.accent}
                strokeWidth="2"
                strokeDasharray="4 2.5"
                markerEnd={`url(#${markerId})`}
              />
            );
          })}

          {/* Weight points */}
          {weights.map((wVal, idx) => {
            const x = mapWToX(wVal);
            const y = mapLToY(wVal * wVal);
            if (x < 20 || x > LR_VIEW_W - 20 || y < 8) return null;
            return (
              <circle
                key={`pt-${idx}-${wVal.toFixed(2)}`}
                cx={x}
                cy={y}
                r={idx === 0 ? 5.2 : 4}
                fill={preset.accent}
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* LaTeX axis labels */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 text-xs font-bold text-[#0F766E]"
          style={{ left: `${(LR_ORIGIN_X / LR_VIEW_W) * 100}%`, top: `${((LR_AXIS_Y + 6) / LR_VIEW_H) * 100}%` }}
        >
          <InlineMath formula="w^* = 0" />
        </div>
        <div
          className="pointer-events-none absolute -translate-x-1/2 text-xs font-semibold text-slate-600"
          style={{ left: `${(mapWToX(-3) / LR_VIEW_W) * 100}%`, top: `${((LR_AXIS_Y + 6) / LR_VIEW_H) * 100}%` }}
        >
          <InlineMath formula="w_0 = -3" />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#EFF3F8] pt-2.5 text-xs text-slate-700">
        <span>{preset.description}</span>
        <span className="font-semibold text-[#172A43]">
          <InlineMath
            formula={weights
              .slice(0, 4)
              .map((w) => w.toFixed(2))
              .join(' \\to ')}
          />
        </span>
      </div>
    </DlCardShell>
  );
}

export function OptimizationDiagram({ variant }: { variant: 'batch' | 'lr' }) {
  if (variant === 'lr') {
    return <LearningRateView />;
  }
  return <BatchVariantsView />;
}

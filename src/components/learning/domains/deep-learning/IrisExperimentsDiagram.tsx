import { useState } from 'react';
import { InlineMath } from '../../learningMdxComponents';

type TabKey = 'activation' | 'boundary' | 'overfit' | 'batch';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'activation', label: '1. Activation' },
  { key: 'boundary', label: '2. Decision Boundary' },
  { key: 'overfit', label: '3. Width/Depth (Overfit)' },
  { key: 'batch', label: '4. Batch vs SGD' },
];

const VIEW_W = 480;
const VIEW_H = 210;
const PAD_L = 52;
const PAD_R = 20;
const PAD_T = 22;
const PAD_B = 34;

function mapEpochX(epoch: number): number {
  return PAD_L + (epoch / 100) * (VIEW_W - PAD_L - PAD_R);
}

function mapLossY(loss: number, maxLoss = 1.2): number {
  return VIEW_H - PAD_B - (loss / maxLoss) * (VIEW_H - PAD_T - PAD_B);
}

function toPolyline(points: [number, number][], maxLoss = 1.2): string {
  return points
    .map(([ep, l], idx) => `${idx === 0 ? 'M' : 'L'} ${mapEpochX(ep).toFixed(1)} ${mapLossY(l, maxLoss).toFixed(1)}`)
    .join(' ');
}

const ACT_IDENTITY: [number, number][] = [
  [0, 1.08], [4, 0.35], [10, 0.14], [20, 0.06], [40, 0.045], [70, 0.04], [100, 0.04],
];
const ACT_SIGMOID: [number, number][] = [
  [0, 1.14], [8, 0.48], [18, 0.25], [32, 0.11], [50, 0.06], [75, 0.05], [100, 0.045],
];
const ACT_RELU: [number, number][] = [
  [0, 1.25], [6, 0.41], [15, 0.18], [28, 0.06], [45, 0.045], [75, 0.04], [100, 0.04],
];

const OVERFIT_BIG_TRAIN: [number, number][] = [
  [0, 1.12], [2, 1.2], [5, 0.58], [10, 0.14], [20, 0.04], [40, 0.008], [70, 0.002], [100, 0.001],
];
const OVERFIT_BIG_TEST: [number, number][] = [
  [0, 1.28], [2, 1.35], [5, 0.62], [10, 0.16], [20, 0.21], [35, 0.32], [60, 0.38], [85, 0.41], [100, 0.41],
];

const BATCH_FULL: [number, number][] = [
  [0, 1.20], [5, 0.55], [12, 0.25], [22, 0.08], [40, 0.045], [70, 0.04], [100, 0.038],
];
const BATCH_MINI: [number, number][] = [
  [0, 0.84], [4, 0.10], [10, 0.07], [20, 0.05], [30, 0.08], [40, 0.04],
  [55, 0.05], [70, 0.04], [85, 0.03], [100, 0.035],
];
const BATCH_SGD: [number, number][] = [
  [0, 0.40], [4, 0.10], [10, 0.13], [16, 0.10], [21, 0.25], [28, 0.07],
  [39, 0.16], [48, 0.05], [55, 0.19], [64, 0.06], [76, 0.10], [87, 0.25], [96, 0.07], [100, 0.05],
];

function LossChartFrame({
  legend,
  paths,
  caption,
}: {
  legend: { label: string; color: string; dashed?: boolean }[];
  paths: { d: string; color: string; dashed?: boolean }[];
  caption: string;
}) {
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
        {legend.map((item) => (
          <span
            key={item.label}
            className="inline-flex items-center gap-1.5"
            style={{ color: item.color }}
          >
            <span
              className={`inline-block h-0.5 w-4 ${item.dashed ? 'border-t-2 border-dashed' : ''}`}
              style={
                item.dashed
                  ? { borderColor: item.color }
                  : { backgroundColor: item.color }
              }
            />
            {item.label}
          </span>
        ))}
      </div>

      <div className="relative w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="h-full w-full" role="img" aria-label={caption}>
          {[0.3, 0.6, 0.9, 1.2].map((l) => (
            <line
              key={`gl-${l}`}
              x1={PAD_L}
              y1={mapLossY(l)}
              x2={VIEW_W - PAD_R}
              y2={mapLossY(l)}
              stroke="#F1F5F9"
              strokeWidth="1"
            />
          ))}
          <line
            x1={PAD_L}
            y1={VIEW_H - PAD_B}
            x2={VIEW_W - PAD_R}
            y2={VIEW_H - PAD_B}
            stroke="#CBD5E1"
            strokeWidth="1.4"
          />
          <line
            x1={PAD_L}
            y1={PAD_T}
            x2={PAD_L}
            y2={VIEW_H - PAD_B}
            stroke="#CBD5E1"
            strokeWidth="1.4"
          />
          {paths.map((p) => (
            <path
              key={`${p.color}-${p.d.slice(0, 16)}`}
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth="2.2"
              strokeDasharray={p.dashed ? '5 3' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>

        {[0, 25, 50, 75, 100].map((ep) => (
          <div
            key={`ep-${ep}`}
            className="pointer-events-none absolute -translate-x-1/2 text-[10.5px] text-slate-500"
            style={{
              left: `${(mapEpochX(ep) / VIEW_W) * 100}%`,
              top: `${((VIEW_H - PAD_B + 4) / VIEW_H) * 100}%`,
            }}
          >
            <InlineMath formula={`${ep}`} />
          </div>
        ))}
        {[0.0, 0.5, 1.0].map((l) => (
          <div
            key={`yl-${l}`}
            className="pointer-events-none absolute -translate-y-1/2 text-right text-[10.5px] text-slate-500"
            style={{
              right: `${((VIEW_W - PAD_L + 6) / VIEW_W) * 100}%`,
              top: `${(mapLossY(l) / VIEW_H) * 100}%`,
            }}
          >
            <InlineMath formula={l.toFixed(1)} />
          </div>
        ))}
        <div
          className="pointer-events-none absolute -translate-x-1/2 text-[11px] font-semibold text-slate-600"
          style={{ left: `${((PAD_L + VIEW_W - PAD_R) / 2 / VIEW_W) * 100}%`, bottom: '0px' }}
        >
          Epoch
        </div>
        <div
          className="pointer-events-none absolute -translate-y-1/2 -rotate-90 text-[11px] font-semibold text-slate-600"
          style={{ left: '0px', top: `${((PAD_T + VIEW_H - PAD_B) / 2 / VIEW_H) * 100}%` }}
        >
          Loss
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-600">{caption}</p>
    </div>
  );
}

function DecisionBoundaryGrid() {
  const panels = [
    {
      title: 'Không Activation (Linear)',
      badge: 'Đường thẳng',
      badgeClass: 'bg-slate-100 text-slate-700',
      boundary: (
        <>
          {/* Region shading matching matplotlib contourf */}
          <polygon points="0,42 74,120 0,120" fill="#205089" fillOpacity="0.10" />
          <polygon points="56,0 150,0 150,92" fill="#C2415A" fillOpacity="0.10" />
          <line x1="0" y1="42" x2="74" y2="120" stroke="#475569" strokeWidth="1.8" strokeDasharray="4 2" />
          <line x1="56" y1="0" x2="150" y2="92" stroke="#475569" strokeWidth="1.8" strokeDasharray="4 2" />
        </>
      ),
      note: 'Hai đường biên thẳng tắp chia 3 vùng.',
    },
    {
      title: 'MLP + ReLU (16 neuron)',
      badge: 'Gấp khúc mượt',
      badgeClass: 'bg-[#EFF3F8] text-[#205089]',
      boundary: (
        <>
          <polygon points="0,0 32,0 38,68 72,120 0,120" fill="#205089" fillOpacity="0.10" />
          <polygon points="48,0 150,0 150,96 86,48" fill="#C2415A" fillOpacity="0.10" />
          <path d="M 32 0 L 38 68 L 72 120" fill="none" stroke="#205089" strokeWidth="2" />
          <path d="M 48 0 L 86 48 L 150 96" fill="none" stroke="#205089" strokeWidth="2" />
        </>
      ),
      note: 'Ranh giới gấp khúc phi tuyến nhẹ nhàng ôm theo cụm dữ liệu.',
    },
    {
      title: 'Mạng quá lớn (3×128)',
      badge: 'Overfit nhiễu',
      badgeClass: 'bg-rose-50 text-[#C2415A]',
      boundary: (
        <>
          <polygon points="0,46 66,120 0,120" fill="#205089" fillOpacity="0.10" />
          <polygon points="74,0 150,0 150,82 96,46" fill="#C2415A" fillOpacity="0.10" />
          <polygon points="0,12 22,0 132,120 112,120" fill="#C2415A" fillOpacity="0.09" />
          <path d="M 0 46 L 66 120" fill="none" stroke="#205089" strokeWidth="1.8" />
          <path d="M 74 0 L 96 46 L 150 82" fill="none" stroke="#C2415A" strokeWidth="1.8" />
          <path d="M 0 12 L 112 120" fill="none" stroke="#C2415A" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 22 0 L 132 120" fill="none" stroke="#C2415A" strokeWidth="1.5" strokeDasharray="3 2" />
        </>
      ),
      note: 'Tạo dải ranh giới chéo bất thường xuyên qua vùng trống để cố ôm điểm biên.',
    },
  ];

  const setosaPts: [number, number][] = [
    [22, 98], [26, 94], [28, 102], [31, 90], [34, 96], [36, 102],
    [24, 106], [30, 84], [38, 92], [33, 82], [41, 98], [29, 98],
  ];
  const versicolorPts: [number, number][] = [
    [54, 72], [60, 68], [64, 62], [67, 70], [71, 64], [74, 58],
    [77, 65], [80, 56], [62, 76], [69, 55], [75, 72], [83, 62],
    [58, 64], [72, 60],
  ];
  const virginicaPts: [number, number][] = [
    [94, 44], [98, 38], [102, 46], [106, 34], [110, 42], [114, 30],
    [118, 38], [122, 28], [126, 36], [100, 26], [108, 22], [116, 20],
    [130, 26], [85, 52], [90, 58],
  ];

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {panels.map((p) => (
        <div key={p.title} className="rounded-lg border border-slate-200/80 bg-slate-50/40 p-3">
          <div className="mb-2 flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-[#172A43]">{p.title}</span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.badgeClass}`}>
              {p.badge}
            </span>
          </div>
          <svg viewBox="0 0 150 120" className="h-auto w-full rounded bg-white" role="img" aria-label={p.title}>
            {p.boundary}
            {setosaPts.map(([cx, cy], idx) => (
              <circle
                key={`ds-${idx}-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r="2.2"
                fill="#205089"
                stroke="#0F172A"
                strokeWidth="0.6"
              />
            ))}
            {versicolorPts.map(([cx, cy], idx) => (
              <circle
                key={`dve-${idx}-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r="2.2"
                fill="#E2E8F0"
                stroke="#0F172A"
                strokeWidth="0.7"
              />
            ))}
            {virginicaPts.map(([cx, cy], idx) => (
              <circle
                key={`dvi-${idx}-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r="2.2"
                fill="#C2415A"
                stroke="#0F172A"
                strokeWidth="0.6"
              />
            ))}
          </svg>
          <p className="mt-1.5 text-[11px] leading-snug text-slate-600">{p.note}</p>
        </div>
      ))}
    </div>
  );
}

export function IrisExperimentsDiagram() {
  const [tab, setTab] = useState<TabKey>('activation');

  return (
    <section
      className="my-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      aria-label="Kết quả 4 thí nghiệm đối chứng trên dữ liệu Iris"
    >
      <div className="mb-3 flex flex-wrap gap-1.5 border-b border-slate-100 pb-3">
        {TABS.map((item) => {
          const active = item.key === tab;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${
                active
                  ? 'border-[#B8C8DA] bg-[#EFF3F8] text-[#205089]'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === 'activation' && (
        <LossChartFrame
          legend={[
            { label: 'Identity (No Act)', color: '#205089' },
            { label: 'Sigmoid', color: '#0F766E' },
            { label: 'ReLU', color: '#C2415A' },
          ]}
          paths={[
            { d: toPolyline(ACT_IDENTITY), color: '#205089' },
            { d: toPolyline(ACT_SIGMOID), color: '#0F766E' },
            { d: toPolyline(ACT_RELU), color: '#C2415A' },
          ]}
          caption="Trên Iris (vốn gần như tách tuyến tính được), Identity vẫn giảm Loss xuống ~0.04 ngang ReLU, còn Sigmoid chậm hơn ở 40 epoch đầu. Để thấy rõ Linear Collapse của Identity, cần thử trên dữ liệu phi tuyến như make_moons."
        />
      )}

      {tab === 'boundary' && <DecisionBoundaryGrid />}

      {tab === 'overfit' && (
        <LossChartFrame
          legend={[
            { label: 'Mạng 3×128 (Train Loss)', color: '#205089' },
            { label: 'Mạng 3×128 (Test Loss)', color: '#C2415A' },
          ]}
          paths={[
            { d: toPolyline(OVERFIT_BIG_TRAIN), color: '#205089' },
            { d: toPolyline(OVERFIT_BIG_TEST), color: '#C2415A' },
          ]}
          caption="Mạng quá lớn (3×128) kéo Train Loss xuống sát 0.00 nhưng Test Loss giữ ở mức ~0.40 và tách dần khỏi Train Loss — dấu hiệu rõ của Overfitting trên tập dữ liệu nhỏ."
        />
      )}

      {tab === 'batch' && (
        <LossChartFrame
          legend={[
            { label: 'batch=120 (Full-batch)', color: '#205089' },
            { label: 'batch=16 (Mini-batch)', color: '#0F766E' },
            { label: 'batch=1 (SGD)', color: '#C2415A' },
          ]}
          paths={[
            { d: toPolyline(BATCH_FULL), color: '#205089' },
            { d: toPolyline(BATCH_MINI), color: '#0F766E' },
            { d: toPolyline(BATCH_SGD), color: '#C2415A' },
          ]}
          caption="batch=120 (Full-batch) mượt nhất; batch=16 giảm nhanh và hơi gợn nhẹ; batch=1 (SGD) cập nhật 120 lần/epoch nên xuống nhanh từ epoch 0 nhưng dao động răng cưa mạnh."
        />
      )}
    </section>
  );
}

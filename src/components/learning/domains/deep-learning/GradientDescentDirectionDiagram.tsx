import { InlineMath } from '../../learningMdxComponents';

const VIEW_W = 340;
const VIEW_H = 194;
const AXIS_X = 68;
const AXIS_Y = 136;
const VERTEX_X = 192;
const VERTEX_Y = 120;
const CURVE_K = 0.0085;

function lossCurveY(x: number): number {
  const dx = x - VERTEX_X;
  return VERTEX_Y - CURVE_K * dx * dx;
}

function lossSlopeSvg(x: number): number {
  return -2 * CURVE_K * (x - VERTEX_X);
}

const CURVE_START_X = 84;
const CURVE_END_X = 300;
const CURVE_END_Y = lossCurveY(CURVE_START_X);
const CURVE_CTRL_Y = 2 * VERTEX_Y - CURVE_END_Y;

const CASES = [
  {
    key: 'left',
    badge: 'Trường hợp 1',
    titleText: 'Đứng bên trái điểm tối ưu',
    titleMath: 'w < w^*',
    gradMath: "\\mathcal{L}'(w) < 0",
    badgeClass: 'bg-[#EFF3F8] text-[#205089] border-[#B8C8DA]',
    markerClass: 'marker:text-[#205089]',
    wX: 112,
    epsX: 148,
    stepEndX: 168,
    stepVerb: 'Tăng',
    accentColor: '#205089',
    bullets: [
      {
        id: 'probe',
        node: (
          <>
            Nhích thử <InlineMath formula="+\epsilon" /> sang phải:{' '}
            <InlineMath formula="\mathcal{L}(w+\epsilon) < \mathcal{L}(w)" /> (Loss giảm).
          </>
        ),
      },
      {
        id: 'sign',
        node: (
          <>
            Suy ra đạo hàm <InlineMath formula="\mathcal{L}'(w) < 0" /> (số âm).
          </>
        ),
      },
      {
        id: 'update',
        node: (
          <>
            Trừ số âm thành cộng (<InlineMath formula="-\eta\,\mathcal{L}'(w) > 0" />) ⇒ tăng{' '}
            <InlineMath formula="w_{\text{old}}" /> lên giúp Loss giảm, tiếp tục tiến về điểm tối ưu{' '}
            <InlineMath formula="w^*" />.
          </>
        ),
      },
    ],
  },
  {
    key: 'right',
    badge: 'Trường hợp 2',
    titleText: 'Đứng bên phải điểm tối ưu',
    titleMath: 'w > w^*',
    gradMath: "\\mathcal{L}'(w) > 0",
    badgeClass: 'bg-rose-50 text-[#C2415A] border-rose-200',
    markerClass: 'marker:text-[#C2415A]',
    wX: 246,
    epsX: 282,
    stepEndX: 208,
    stepVerb: 'Giảm',
    accentColor: '#C2415A',
    bullets: [
      {
        id: 'probe',
        node: (
          <>
            Nhích thử <InlineMath formula="+\epsilon" /> sang phải:{' '}
            <InlineMath formula="\mathcal{L}(w+\epsilon) > \mathcal{L}(w)" /> (Loss tăng).
          </>
        ),
      },
      {
        id: 'sign',
        node: (
          <>
            Suy ra đạo hàm <InlineMath formula="\mathcal{L}'(w) > 0" /> (số dương).
          </>
        ),
      },
      {
        id: 'update',
        node: (
          <>
            Trừ số dương (<InlineMath formula="-\eta\,\mathcal{L}'(w) < 0" />) ⇒ giảm{' '}
            <InlineMath formula="w_{\text{old}}" /> xuống giúp Loss giảm, tiếp tục tiến về điểm tối ưu{' '}
            <InlineMath formula="w^*" />.
          </>
        ),
      },
    ],
  },
] as const;

export function GradientDescentDirectionDiagram() {
  return (
    <section
      className="my-5 grid grid-cols-1 gap-4 md:grid-cols-2"
      aria-label="Minh họa hai trường hợp đi ngược chiều đạo hàm trong Gradient Descent"
    >
      {CASES.map((item) => {
        const markerId = `gd-step-${item.key}`;
        const epsMarkerId = `gd-eps-${item.key}`;
        const wY = lossCurveY(item.wX);
        const epsY = lossCurveY(item.epsX);
        const slope = lossSlopeSvg(item.wX);
        const tanDx = 22;

        return (
          <div
            key={item.key}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${item.badgeClass}`}
              >
                {item.badge}
              </span>
              <span className="text-xs font-semibold text-slate-700">
                <InlineMath formula={item.gradMath} />
              </span>
            </div>

            <h4 className="mb-3 text-sm font-bold text-[#172A43]">
              {item.titleText} (<InlineMath formula={item.titleMath} />)
            </h4>

            <div className="mb-3 rounded-lg border border-slate-200/80 bg-white p-2">
              <div className="relative w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
                <svg
                  viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                  className="h-full w-full"
                  role="img"
                  aria-label={`${item.titleText} (${item.titleMath})`}
                >
                  <defs>
                    <marker
                      id={markerId}
                      markerWidth="7"
                      markerHeight="7"
                      refX="5.5"
                      refY="3.5"
                      orient="auto"
                    >
                      <path d="M0,1 L6.5,3.5 L0,6 z" fill={item.accentColor} />
                    </marker>
                    <marker
                      id={epsMarkerId}
                      markerWidth="6"
                      markerHeight="6"
                      refX="4.5"
                      refY="3"
                      orient="auto"
                    >
                      <path d="M0,0.8 L5.5,3 L0,5.2 z" fill="#475569" />
                    </marker>
                  </defs>

                  {/* Soft fill under curve */}
                  <path
                    d={`M ${CURVE_START_X} ${CURVE_END_Y} Q ${VERTEX_X} ${CURVE_CTRL_Y} ${CURVE_END_X} ${CURVE_END_Y} L ${CURVE_END_X} ${AXIS_Y} L ${CURVE_START_X} ${AXIS_Y} Z`}
                    fill="#205089"
                    fillOpacity="0.035"
                  />

                  {/* Axes */}
                  <line
                    x1={AXIS_X}
                    y1={AXIS_Y}
                    x2="322"
                    y2={AXIS_Y}
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={AXIS_X}
                    y1="14"
                    x2={AXIS_X}
                    y2={AXIS_Y}
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                  />

                  {/* Y-axis horizontal projections for L(w) and L(w + eps) */}
                  <line
                    x1={AXIS_X}
                    y1={wY}
                    x2={item.wX}
                    y2={wY}
                    stroke={item.accentColor}
                    strokeOpacity="0.55"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={AXIS_X}
                    y1={epsY}
                    x2={item.epsX}
                    y2={epsY}
                    stroke="#64748B"
                    strokeOpacity="0.65"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                  <circle cx={AXIS_X} cy={wY} r="2.5" fill={item.accentColor} />
                  <circle cx={AXIS_X} cy={epsY} r="2.5" fill="#475569" />

                  {/* Parabolic Loss Curve */}
                  <path
                    d={`M ${CURVE_START_X} ${CURVE_END_Y} Q ${VERTEX_X} ${CURVE_CTRL_Y} ${CURVE_END_X} ${CURVE_END_Y}`}
                    fill="none"
                    stroke="#64748B"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                  />

                  {/* Tangent line at w */}
                  <line
                    x1={item.wX - tanDx}
                    y1={wY - slope * tanDx}
                    x2={item.wX + tanDx}
                    y2={wY + slope * tanDx}
                    stroke={item.accentColor}
                    strokeOpacity="0.35"
                    strokeWidth="2"
                  />

                  {/* Vertical projections to w-axis */}
                  <line
                    x1={VERTEX_X}
                    y1={VERTEX_Y}
                    x2={VERTEX_X}
                    y2={AXIS_Y}
                    stroke="#0F766E"
                    strokeWidth="1.2"
                    strokeDasharray="3 2.5"
                  />
                  <line
                    x1={item.wX}
                    y1={wY}
                    x2={item.wX}
                    y2={AXIS_Y}
                    stroke={item.accentColor}
                    strokeWidth="1.2"
                    strokeDasharray="3 2.5"
                  />
                  <line
                    x1={item.epsX}
                    y1={epsY}
                    x2={item.epsX}
                    y2={AXIS_Y}
                    stroke="#64748B"
                    strokeWidth="1.2"
                    strokeDasharray="3 2.5"
                  />

                  {/* +epsilon step along curve */}
                  <line
                    x1={item.wX}
                    y1={wY}
                    x2={item.epsX}
                    y2={epsY}
                    stroke="#475569"
                    strokeWidth="1.7"
                    strokeDasharray="3.5 2.5"
                    markerEnd={`url(#${epsMarkerId})`}
                  />

                  {/* Points */}
                  <circle cx={VERTEX_X} cy={VERTEX_Y} r="4.2" fill="#0F766E" stroke="#FFFFFF" strokeWidth="1.2" />
                  <circle cx={item.epsX} cy={epsY} r="3.6" fill="#475569" stroke="#FFFFFF" strokeWidth="1.2" />
                  <circle cx={item.wX} cy={wY} r="5.2" fill={item.accentColor} stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* Update direction arrow below axis labels */}
                  <line
                    x1={item.wX}
                    y1={AXIS_Y + 34}
                    x2={item.stepEndX}
                    y2={AXIS_Y + 34}
                    stroke={item.accentColor}
                    strokeWidth="2.4"
                    markerEnd={`url(#${markerId})`}
                  />
                </svg>

                {/* KaTeX HTML overlays aligned to SVG coordinates */}
                <div
                  className="pointer-events-none absolute -translate-y-1/2 text-[11px] font-semibold text-slate-600"
                  style={{ left: `${(AXIS_X / VIEW_W) * 100 + 2}%`, top: `${(14 / VIEW_H) * 100}%` }}
                >
                  <InlineMath formula="\mathcal{L}(w)" />
                </div>

                {/* Y-axis mapped values */}
                <div
                  className="pointer-events-none absolute -translate-y-1/2 text-right text-[10.5px] font-semibold"
                  style={{
                    right: `${((VIEW_W - AXIS_X + 6) / VIEW_W) * 100}%`,
                    top: `${(wY / VIEW_H) * 100}%`,
                    color: item.accentColor,
                  }}
                >
                  <InlineMath formula="\mathcal{L}(w)" />
                </div>
                <div
                  className="pointer-events-none absolute -translate-y-1/2 text-right text-[10.5px] font-semibold text-slate-600"
                  style={{
                    right: `${((VIEW_W - AXIS_X + 6) / VIEW_W) * 100}%`,
                    top: `${(epsY / VIEW_H) * 100}%`,
                  }}
                >
                  <InlineMath formula="\mathcal{L}(w+\epsilon)" />
                </div>

                {/* X-axis mapped values */}
                <div
                  className="pointer-events-none absolute -translate-x-1/2 text-[11px] font-bold"
                  style={{
                    left: `${(item.wX / VIEW_W) * 100}%`,
                    top: `${((AXIS_Y + 5) / VIEW_H) * 100}%`,
                    color: item.accentColor,
                  }}
                >
                  <InlineMath formula="w" />
                </div>
                <div
                  className="pointer-events-none absolute -translate-x-1/2 text-[10.5px] font-semibold text-slate-600"
                  style={{
                    left: `${(item.epsX / VIEW_W) * 100}%`,
                    top: `${((AXIS_Y + 5) / VIEW_H) * 100}%`,
                  }}
                >
                  <InlineMath formula="w+\epsilon" />
                </div>
                <div
                  className="pointer-events-none absolute -translate-x-1/2 text-[11px] font-bold text-[#0F766E]"
                  style={{
                    left: `${(VERTEX_X / VIEW_W) * 100}%`,
                    top: `${((AXIS_Y + 5) / VIEW_H) * 100}%`,
                  }}
                >
                  <InlineMath formula="w^*" />
                </div>
                <div
                  className="pointer-events-none absolute -translate-x-1/2 text-[11px] font-semibold text-slate-500"
                  style={{
                    left: `${(324 / VIEW_W) * 100}%`,
                    top: `${((AXIS_Y + 4) / VIEW_H) * 100}%`,
                  }}
                >
                  <InlineMath formula="w" />
                </div>

                {/* Step label under arrow */}
                <div
                  className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-[11px] font-bold"
                  style={{
                    left: `${(((item.wX + item.stepEndX) / 2) / VIEW_W) * 100}%`,
                    top: `${((AXIS_Y + 41) / VIEW_H) * 100}%`,
                    color: item.accentColor,
                  }}
                >
                  {item.stepVerb} <InlineMath formula="w" /> (ngược dấu)
                </div>
              </div>
            </div>

            <ul className={`list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-slate-700 ${item.markerClass}`}>
              {item.bullets.map((b) => (
                <li key={b.id}>{b.node}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </section>
  );
}

import { type ReactNode, useState } from 'react';
import { InlineMath, MdxPre } from '../../learningMdxComponents';
import { DL_PALETTE, useCodeHighlightPulse } from './primitives';

const BLUE = DL_PALETTE.primary;
const SLATE = DL_PALETTE.slate;

/**
 * Clean Light-Mode SVG visualizations for the Fully Connected Layers lesson:
 * - panel="intuition": Shows neurons in one layer connecting to ALL neurons in the next layer.
 * - panel="matrix": Shows how d=3 inputs connect to m=2 output neurons via W in R^(3x2) and b in R^(1x2).
 * - panel="params": Interactive d_in / d_out / bias explorer showing parameter count and bipartite graph.
 * - panel="pros-cons": Two-column pros & cons summary cards for Fully Connected layers.
 * - panel="cnn-mlp": Simple CNN (feature learning) feeding into a highlighted MLP / Fully Connected head.
 * - panel="summary-*": Shared MLP diagram highlighting one concept while dimming the rest.
 */
export function FullyConnectedDiagram({
  panel,
}: {
  panel:
    | 'intuition'
    | 'matrix'
    | 'params'
    | 'pros-cons'
    | 'cnn-mlp'
    | 'summary-neuron'
    | 'summary-layers'
    | 'summary-width-depth'
    | 'summary-activation'
    | 'summary-matrix'
    | 'summary-params'
    | 'summary-head';
}) {
  if (panel === 'intuition') {
    return <FullyConnectedIntuitionDiagram />;
  }
  if (panel === 'params') {
    return <FullyConnectedParamExplorer />;
  }
  if (panel === 'pros-cons') {
    return <FullyConnectedProsConsCards />;
  }
  if (panel === 'cnn-mlp') {
    return <CnnMlpPipelineDiagram />;
  }
  if (panel.startsWith('summary-')) {
    const mode = panel.replace('summary-', '') as SummaryMode;
    return (
      <figure className="my-5 bg-white py-1">
        <SharedMlpHighlightSvg mode={mode} />
      </figure>
    );
  }
  return <FullyConnectedMatrixDiagram />;
}

function FullyConnectedProsConsCards() {
  return (
    <div className="my-6 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-emerald-700">
          Ưu điểm
        </h4>
        <ul className="grid gap-2.5 text-sm leading-6 text-slate-700">
          <li>
            <strong className="text-slate-900">Kết nối toàn cục:</strong> Mọi đặc trưng đầu vào đều tương tác trực tiếp với nhau ở đầu ra.
          </li>
          <li>
            <strong className="text-slate-900">Đổi chiều linh hoạt:</strong> Dễ dàng nén hoặc mở rộng không gian biểu diễn (<InlineMath formula="d_{\text{in}} \to d_{\text{out}}" />).
          </li>
          <li>
            <strong className="text-slate-900">Đa dụng:</strong> Phù hợp làm Classification Head cuối mạng CNN hoặc khối FFN trong Transformer.
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h4 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-rose-700">
          Khuyết điểm
        </h4>
        <ul className="grid gap-2.5 text-sm leading-6 text-slate-700">
          <li>
            <strong className="text-slate-900">Bùng nổ tham số:</strong> Tăng theo tích <InlineMath formula="d_{\text{in}} \times d_{\text{out}}" />, dễ overfitting và tốn bộ nhớ với ảnh lớn.
          </li>
          <li>
            <strong className="text-slate-900">Mất cấu trúc không gian:</strong> Phải duỗi phẳng (flatten) ảnh 2D thành vector 1D, làm mất quan hệ lân cận.
          </li>
          <li>
            <strong className="text-slate-900">Không bất biến dịch chuyển:</strong> Chỉ cần dịch vật thể sang vị trí khác là phải học lại trọng số tương ứng.
          </li>
        </ul>
      </div>
    </div>
  );
}

function FullyConnectedIntuitionDiagram() {
  const leftY = [64, 118, 172];
  const rightY = [48, 94, 142, 188];
  const leftX = 110;
  const rightX = 330;

  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 440 225"
        className="mx-auto w-full max-w-[440px]"
        role="img"
        aria-label="Minh họa trực giác Fully Connected: mỗi neuron ở tầng trước nối tới toàn bộ các neuron ở tầng sau"
      >
        <text x={leftX} y="22" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
          TẦNG TRƯỚC (3 NEURON)
        </text>
        <text x={rightX} y="22" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
          TẦNG SAU (4 NEURON)
        </text>

        {/* All-to-all connections, highlighting connections from the first neuron */}
        {leftY.map((ly, li) =>
          rightY.map((ry) => (
            <line
              key={`int-${ly}-${ry}`}
              x1={leftX + 16}
              y1={ly}
              x2={rightX - 16}
              y2={ry}
              stroke={li === 0 ? BLUE : '#CBD5E1'}
              strokeWidth={li === 0 ? 1.8 : 1.15}
              opacity={li === 0 ? 0.9 : 0.75}
            />
          )),
        )}

        {leftY.map((ly, idx) => (
          <g key={`int-l-${ly}`}>
            <circle
              cx={leftX}
              cy={ly}
              r="16"
              fill={idx === 0 ? '#EFF6FF' : '#FFFFFF'}
              stroke={idx === 0 ? BLUE : '#94A3B8'}
              strokeWidth={idx === 0 ? 2 : 1.5}
            />
            <foreignObject x={leftX - 14} y={ly - 11} width="28" height="22">
              <div className="flex h-full items-center justify-center text-xs text-[#172A43]">
                <InlineMath formula={`a_${idx + 1}`} />
              </div>
            </foreignObject>
          </g>
        ))}

        {rightY.map((ry, idx) => (
          <g key={`int-r-${ry}`}>
            <circle cx={rightX} cy={ry} r="16" fill="#EFF3F8" stroke={BLUE} strokeWidth="1.7" />
            <foreignObject x={rightX - 14} y={ry - 11} width="28" height="22">
              <div className="flex h-full items-center justify-center text-xs text-[#205089]">
                <InlineMath formula={`z_${idx + 1}`} />
              </div>
            </foreignObject>
          </g>
        ))}
      </svg>
    </figure>
  );
}

function FullyConnectedMatrixDiagram() {
  const inY = [66, 122, 178];
  const outY = [92, 152];
  const inX = 64;
  const outX = 240;

  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 740 232"
        className="mx-auto w-full max-w-[740px]"
        role="img"
        aria-label="Minh họa tầng Fully Connected: 3 đầu vào nối đầy đủ tới 2 neuron đầu ra tương ứng ma trận trọng số 3x2"
      >
        {/* Left: Bipartite FC graph */}
        <text x="152" y="24" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
          KẾT NỐI ĐẦY ĐỦ (3 → 2)
        </text>

        {inY.map((iy) =>
          outY.map((oy) => (
            <line
              key={`fc-${iy}-${oy}`}
              x1={inX + 16}
              y1={iy}
              x2={outX - 16}
              y2={oy}
              stroke="#94A3B8"
              strokeWidth="1.35"
            />
          )),
        )}

        {inY.map((iy, idx) => (
          <g key={`fc-in-${iy}`}>
            <circle cx={inX} cy={iy} r="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.6" />
            <foreignObject x={inX - 14} y={iy - 11} width="28" height="22">
              <div className="flex h-full items-center justify-center text-xs text-[#172A43]">
                <InlineMath formula={`x_${idx + 1}`} />
              </div>
            </foreignObject>
          </g>
        ))}

        {outY.map((oy, idx) => (
          <g key={`fc-out-${oy}`}>
            <circle cx={outX} cy={oy} r="17" fill="#EFF3F8" stroke={BLUE} strokeWidth="1.8" />
            <foreignObject x={outX - 15} y={oy - 12} width="30" height="24">
              <div className="flex h-full items-center justify-center text-xs text-[#205089]">
                <InlineMath formula={`z_${idx + 1}`} />
              </div>
            </foreignObject>
          </g>
        ))}

        {/* Divider arrow */}
        <text x="298" y="128" textAnchor="middle" fontSize="18" fontWeight="800" fill={SLATE}>
          ⇔
        </text>

        {/* Right: Matrix packing X * W + b = Z */}
        <text x="526" y="24" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
          DẠNG MA TRẬN (X · W + b = Z)
        </text>
        <foreignObject x="320" y="54" width="412" height="146">
          <div className="flex h-full items-center justify-center text-xs text-[#172A43]">
            <InlineMath formula="\underbrace{\begin{bmatrix} x_1 & x_2 & x_3 \end{bmatrix}}_{\mathbf{x}^\top \in \mathbb{R}^{1 \times 3}} \underbrace{\begin{bmatrix} w_{11} & w_{12} \\ w_{21} & w_{22} \\ w_{31} & w_{32} \end{bmatrix}}_{\mathbf{W} \in \mathbb{R}^{3 \times 2}} + \underbrace{\begin{bmatrix} b_1 & b_2 \end{bmatrix}}_{\mathbf{b}^\top \in \mathbb{R}^{1 \times 2}} = \underbrace{\begin{bmatrix} z_1 & z_2 \end{bmatrix}}_{\mathbf{z}^\top \in \mathbb{R}^{1 \times 2}}" />
          </div>
        </foreignObject>
      </svg>
    </figure>
  );
}

function FullyConnectedParamExplorer() {
  const [dIn, setDIn] = useState(4);
  const [dOut, setDOut] = useState(3);
  const [useBias, setUseBias] = useState(true);
  const { highlighted: isCodeHighlighted, pulse: triggerCodeHighlight } = useCodeHighlightPulse();

  const handleDInChange = (next: number) => {
    setDIn(next);
    triggerCodeHighlight();
  };

  const handleDOutChange = (next: number) => {
    setDOut(next);
    triggerCodeHighlight();
  };

  const handleBiasChange = (next: boolean) => {
    setUseBias(next);
    triggerCodeHighlight();
  };

  const weightParams = dIn * dOut;
  const biasParams = useBias ? dOut : 0;
  const totalParams = weightParams + biasParams;

  const MAX_DRAW = 6;
  const drawIn = Math.min(dIn, MAX_DRAW);
  const drawOut = Math.min(dOut, MAX_DRAW);

  const getYs = (count: number, height: number) => {
    const step = Math.min(32, (height - 44) / Math.max(1, count));
    const start = height / 2 - ((count - 1) * step) / 2;
    return Array.from({ length: count }, (_, i) => start + i * step);
  };

  const inYs = getYs(drawIn, 210);
  const outYs = getYs(drawOut, 210);

  const pytorchCode = [
    'import torch',
    'import torch.nn as nn',
    '',
    `fc = nn.Linear(in_features=${dIn}, out_features=${dOut}${useBias ? '' : ', bias=False'})`,
    `total = sum(p.numel() for p in fc.parameters())`,
    `print(total)  # ${totalParams.toLocaleString('en-US')}`,
  ].join('\n');

  return (
    <figure className="my-6 bg-white py-2">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-extrabold uppercase tracking-wider text-[#205089]">
          Thử nghiệm số tham số tầng Linear
        </span>
        <span className="rounded-full bg-[#EFF3F8] px-3 py-0.5 text-xs font-extrabold text-[#205089]">
          Tổng: {totalParams.toLocaleString('en-US')} tham số
        </span>
      </div>

      <div className="grid items-center gap-6 md:grid-cols-[1.05fr_1fr]">
        <svg
          viewBox="0 0 340 218"
          className="mx-auto w-full max-w-[340px]"
          role="img"
          aria-label={`Đồ thị kết nối đầy đủ từ ${dIn} đầu vào tới ${dOut} neuron đầu ra`}
        >
          {inYs.map((iy) =>
            outYs.map((oy) => (
              <line
                key={`p-${iy}-${oy}`}
                x1="76"
                y1={iy}
                x2="264"
                y2={oy}
                stroke="#94A3B8"
                strokeWidth="1.15"
              />
            )),
          )}

          {inYs.map((iy, idx) => (
            <g key={`pi-${iy}`}>
              <circle cx="64" cy={iy} r="12.5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <foreignObject x="50" y={iy - 10} width="28" height="20">
                <div className="flex h-full items-center justify-center text-[10px] text-[#172A43]">
                  <InlineMath formula={dIn > MAX_DRAW && idx === MAX_DRAW - 1 ? `x_{${dIn}}` : `x_{${idx + 1}}`} />
                </div>
              </foreignObject>
            </g>
          ))}

          {outYs.map((oy, idx) => (
            <g key={`po-${oy}`}>
              <circle cx="276" cy={oy} r="12.5" fill="#EFF3F8" stroke={BLUE} strokeWidth="1.6" />
              <foreignObject x="262" y={oy - 10} width="28" height="20">
                <div className="flex h-full items-center justify-center text-[10px] text-[#205089]">
                  <InlineMath formula={dOut > MAX_DRAW && idx === MAX_DRAW - 1 ? `z_{${dOut}}` : `z_{${idx + 1}}`} />
                </div>
              </foreignObject>
            </g>
          ))}

          <foreignObject x="16" y="190" width="96" height="24">
            <div className="flex h-full items-center justify-center text-[11px] text-[#475569]">
              <InlineMath formula={`d_{\\text{in}} = ${dIn}`} />
            </div>
          </foreignObject>
          <foreignObject x="228" y="190" width="96" height="24">
            <div className="flex h-full items-center justify-center text-[11px] text-[#475569]">
              <InlineMath formula={`d_{\\text{out}} = ${dOut}`} />
            </div>
          </foreignObject>
        </svg>

        <div className="grid gap-3">
          <NumberStepper
            label={
              <>
                Số chiều đầu vào (<InlineMath formula="d_{\text{in}}" />)
              </>
            }
            ariaLabel="Số chiều đầu vào d_in"
            value={dIn}
            min={1}
            max={9999}
            onChange={handleDInChange}
          />
          <NumberStepper
            label={
              <>
                Số neuron đầu ra (<InlineMath formula="d_{\text{out}}" />)
              </>
            }
            ariaLabel="Số neuron đầu ra d_out"
            value={dOut}
            min={1}
            max={9999}
            onChange={handleDOutChange}
          />

          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={useBias}
              onChange={(e) => handleBiasChange(e.target.checked)}
              className="h-4 w-4 accent-[#205089]"
            />
            <span>
              Bao gồm vector độ lệch (<InlineMath formula="\mathbf{b}" />)
            </span>
          </label>

          <div className="rounded-lg bg-[#F8FAFC] px-3 py-2 text-center text-xs text-[#172A43]">
            <InlineMath
              formula={`\\underbrace{${dIn} \\times ${dOut}}_{\\mathbf{W}} ${useBias ? `+ \\underbrace{${dOut}}_{\\mathbf{b}}` : ''} = ${totalParams.toLocaleString('en-US')}`}
            />
          </div>
        </div>
      </div>

      <div
        className={`mt-4 rounded-xl transition-all duration-300 ${
          isCodeHighlighted ? 'ring-2 ring-[#205089]/50 bg-[#EFF6FF]/60' : 'ring-0'
        }`}
      >
        <MdxPre>
          <code className="language-python">{pytorchCode}</code>
        </MdxPre>
      </div>
    </figure>
  );
}

function NumberStepper({
  label,
  ariaLabel,
  value,
  min,
  max,
  onChange,
}: {
  label: ReactNode;
  ariaLabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, Math.round(n)));

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= min}
          aria-label={`Giảm ${ariaLabel}`}
          className="px-2.5 py-1 text-xs font-extrabold text-[#205089] hover:bg-[#EFF3F8] disabled:opacity-40"
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          aria-label={ariaLabel}
          value={value}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            if (digits === '') return;
            onChange(clamp(Number(digits)));
          }}
          className="w-14 border-x border-slate-200 py-1 text-center font-mono text-xs font-bold text-[#172A43] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= max}
          aria-label={`Tăng ${ariaLabel}`}
          className="px-2.5 py-1 text-xs font-extrabold text-[#205089] hover:bg-[#EFF3F8] disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

function CnnMlpPipelineDiagram() {
  const mlpInY = [84, 110, 136, 162];
  const mlpHidY = [96, 123, 150];
  const mlpOutY = [106, 140];

  const cnnStage1 = [0, 1, 2];
  const cnnStage2 = [0, 1, 2, 3];

  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 760 258"
        className="mx-auto w-full max-w-[760px]"
        role="img"
        aria-label="Minh họa kiến trúc CNN kết hợp MLP: CNN học đặc trưng từ ảnh gốc qua biên cạnh đến bộ phận vật thể, còn MLP (Fully Connected) tổng hợp và phân loại ở cuối"
      >
        <defs>
          <marker
            id="cnn-mlp-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748B" />
          </marker>
          <marker
            id="cnn-mlp-arrow-blue"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill={BLUE} />
          </marker>
        </defs>

        {/* Left: Simple CNN (white background, muted slate border) */}
        <rect
          x="12"
          y="10"
          width="344"
          height="238"
          rx="14"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />
        <text x="184" y="35" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
          CNN — HỌC ĐẶC TRƯNG
        </text>

        {/* Input image */}
        <rect x="34" y="64" width="44" height="50" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
        <line x1="49" y1="64" x2="49" y2="114" stroke="#E2E8F0" strokeWidth="1" />
        <line x1="63" y1="64" x2="63" y2="114" stroke="#E2E8F0" strokeWidth="1" />
        <line x1="34" y1="81" x2="78" y2="81" stroke="#E2E8F0" strokeWidth="1" />
        <line x1="34" y1="98" x2="78" y2="98" stroke="#E2E8F0" strokeWidth="1" />
        <text x="56" y="135" textAnchor="middle" fontSize="10" fontWeight="600" fill={SLATE}>
          Ảnh
        </text>

        <line x1="86" y1="89" x2="108" y2="89" stroke={SLATE} strokeWidth="1.5" markerEnd="url(#cnn-mlp-arrow)" />

        {/* Conv + Pool stage 1 */}
        {cnnStage1.map((idx) => (
          <rect
            key={`s1-${idx}`}
            x={116 + idx * 6}
            y={62 + idx * 5}
            width="36"
            height="42"
            rx="4"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1.4"
          />
        ))}
        <text x="140" y="135" textAnchor="middle" fontSize="10" fontWeight="600" fill={SLATE}>
          Conv + Pool
        </text>

        <line x1="172" y1="89" x2="194" y2="89" stroke={SLATE} strokeWidth="1.5" markerEnd="url(#cnn-mlp-arrow)" />

        {/* Conv + Pool stage 2 */}
        {cnnStage2.map((idx) => (
          <rect
            key={`s2-${idx}`}
            x={202 + idx * 5}
            y={65 + idx * 4}
            width="28"
            height="34"
            rx="3"
            fill="#F1F5F9"
            stroke="#94A3B8"
            strokeWidth="1.4"
          />
        ))}
        <text x="224" y="135" textAnchor="middle" fontSize="10" fontWeight="600" fill={SLATE}>
          Conv + Pool
        </text>

        <line x1="254" y1="89" x2="278" y2="89" stroke={SLATE} strokeWidth="1.5" markerEnd="url(#cnn-mlp-arrow)" />

        {/* Flatten 1D vector */}
        <rect x="288" y="54" width="16" height="70" rx="4" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
        {[72, 89, 106].map((y) => (
          <line key={`flat-${y}`} x1="288" y1={y} x2="304" y2={y} stroke="#CBD5E1" strokeWidth="1.2" />
        ))}
        <text x="296" y="135" textAnchor="middle" fontSize="10" fontWeight="600" fill={SLATE}>
          Flatten
        </text>

        {/* Pointer lines from each block down to feature thumbnails */}
        {[56, 140, 224].map((cx) => (
          <line
            key={`ptr-${cx}`}
            x1={cx}
            y1="142"
            x2={cx}
            y2="160"
            stroke="#94A3B8"
            strokeWidth="1.3"
            strokeDasharray="2.5 2.5"
          />
        ))}

        {/* Thumbnail 1: Raw Input (Cat silhouette) */}
        <g transform="translate(36, 162)">
          <rect width="40" height="40" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
          <path
            d="M 10 31 L 10 17 L 14 9 L 18 15 L 22 15 L 26 9 L 30 17 L 30 31 Z"
            fill="#CBD5E1"
            stroke="#64748B"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="16.5" cy="21" r="1.3" fill="#475569" />
          <circle cx="23.5" cy="21" r="1.3" fill="#475569" />
          <path d="M 18.5 24.5 L 21.5 24.5 L 20 26 Z" fill="#475569" />
        </g>
        <text x="56" y="216" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={SLATE}>
          Ảnh gốc
        </text>

        {/* Thumbnail 2: Edge features */}
        <g transform="translate(120, 162)">
          <rect width="40" height="40" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
          <line x1="8" y1="14" x2="20" y2="9" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="23" y1="10" x2="32" y2="20" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="10" y1="20" x2="10" y2="32" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="18" y1="28" x2="31" y2="28" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="16" y1="22" x2="27" y2="16" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round" />
        </g>
        <text x="140" y="216" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={SLATE}>
          Biên / Cạnh
        </text>

        {/* Thumbnail 3: Separate parts (ear, eye, nose) */}
        <g transform="translate(204, 162)">
          <rect width="40" height="40" rx="6" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.2" />
          <path d="M 9 19 L 13 10 L 17 17" fill="none" stroke="#334155" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="27" cy="15" r="2.8" fill="none" stroke="#475569" strokeWidth="1.5" />
          <path d="M 16 28 L 24 28 M 18 25 L 22 25" fill="none" stroke="#64748B" strokeWidth="1.4" strokeLinecap="round" />
        </g>
        <text x="224" y="216" textAnchor="middle" fontSize="9.5" fontWeight="600" fill={SLATE}>
          Bộ phận rời
        </text>

        {/* Transition arrow into highlighted MLP */}
        <line
          x1="362"
          y1="129"
          x2="396"
          y2="129"
          stroke={BLUE}
          strokeWidth="2.2"
          markerEnd="url(#cnn-mlp-arrow-blue)"
        />

        {/* Right: Highlighted MLP / Fully Connected (white background, bold blue highlight border & badge) */}
        <rect
          x="404"
          y="10"
          width="344"
          height="238"
          rx="14"
          fill="#FFFFFF"
          stroke={BLUE}
          strokeWidth="2.2"
        />
        <rect x="424" y="21" width="304" height="24" rx="12" fill={BLUE} />
        <text x="576" y="37" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#FFFFFF">
          MLP / FULLY CONNECTED — TỔNG HỢP &amp; PHÂN LOẠI
        </text>

        {/* Full bipartite connections: Input -> Hidden */}
        {mlpInY.map((y1) =>
          mlpHidY.map((y2) => (
            <line
              key={`fc1-${y1}-${y2}`}
              x1="446"
              y1={y1}
              x2="540"
              y2={y2}
              stroke="#6088B8"
              strokeWidth="1.3"
              opacity="0.7"
            />
          ))
        )}

        {/* Full bipartite connections: Hidden -> Output */}
        {mlpHidY.map((y1) =>
          mlpOutY.map((y2) => (
            <line
              key={`fc2-${y1}-${y2}`}
              x1="540"
              y1={y1}
              x2="634"
              y2={y2}
              stroke={BLUE}
              strokeWidth="1.4"
              opacity="0.75"
            />
          ))
        )}

        {/* MLP Input nodes */}
        {mlpInY.map((y) => (
          <circle key={`in-${y}`} cx="446" cy={y} r="8.5" fill="#FFFFFF" stroke="#6088B8" strokeWidth="1.8" />
        ))}

        {/* MLP Hidden nodes */}
        {mlpHidY.map((y) => (
          <circle key={`hid-${y}`} cx="540" cy={y} r="9.5" fill="#FFFFFF" stroke={BLUE} strokeWidth="2" />
        ))}

        {/* MLP Output nodes + assembled object badge on y_hat_1 */}
        {mlpOutY.map((y, idx) => (
          <g key={`out-${y}`}>
            <circle cx="634" cy={y} r="10.5" fill="#FFFFFF" stroke={BLUE} strokeWidth="2.2" />
            <foreignObject x="650" y={y - 12} width="32" height="24">
              <div className="flex h-full items-center text-xs font-bold text-[#172A43]">
                <InlineMath formula={`\\hat{y}_${idx + 1}`} />
              </div>
            </foreignObject>
          </g>
        ))}

        {/* Assembled cat icon next to y_hat_1 */}
        <g transform="translate(682, 89)">
          <rect width="34" height="34" rx="6" fill="#EFF3F8" stroke={BLUE} strokeWidth="1.4" />
          <path
            d="M 8 26 L 8 15 L 12 8 L 15.5 13 L 18.5 13 L 22 8 L 26 15 L 26 26 Z"
            fill="#B8C8DA"
            stroke={BLUE}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <circle cx="14" cy="18" r="1.2" fill={BLUE} />
          <circle cx="20" cy="18" r="1.2" fill={BLUE} />
          <path d="M 15.5 21.5 L 18.5 21.5 L 17 23 Z" fill={BLUE} />
        </g>
        <text x="699" y="136" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={BLUE}>
          Mèo
        </text>

        <text x="576" y="216" textAnchor="middle" fontSize="11" fontWeight="700" fill={BLUE}>
          Ráp toàn bộ bộ phận lại → Nhận diện &amp; phân loại vật thể
        </text>
      </svg>
    </figure>
  );
}

type SummaryMode =
  | 'neuron'
  | 'layers'
  | 'width-depth'
  | 'activation'
  | 'matrix'
  | 'params'
  | 'head';

function SharedMlpHighlightSvg({ mode }: { mode: SummaryMode }) {
  const inY = [54, 92, 130];
  const h1Y = [38, 74, 110, 146];
  const h2Y = [38, 74, 110, 146];
  const outY = [72, 112];

  const inX = 56;
  const h1X = 152;
  const h2X = 248;
  const outX = 344;

  const layers = [
    { x: inX, ys: inY, prefix: 'x', count: 3 },
    { x: h1X, ys: h1Y, prefix: 'h^{(1)}', count: 4 },
    { x: h2X, ys: h2Y, prefix: 'h^{(2)}', count: 4 },
    { x: outX, ys: outY, prefix: '\\hat{y}', count: 2 },
  ];

  const stagePairs: Array<[number[], number[], number, number]> = [
    [inY, h1Y, inX, h1X],
    [h1Y, h2Y, h1X, h2X],
    [h2Y, outY, h2X, outX],
  ];

  return (
    <svg
      viewBox="0 0 420 196"
      className="mx-auto w-full max-w-[440px]"
      role="img"
      aria-label={`Minh họa MLP chung (3 → 4 → 4 → 2) làm nổi bật khái niệm: ${mode}`}
    >
      <defs>
        <marker
          id="summary-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill={BLUE} />
        </marker>
      </defs>

      {/* Activation wrappers around Hidden Layer 1 & 2, with h^(l) = phi(z^(l)) on top */}
      {[h1X, h2X].map((hx, idx) => {
        const wrapperActive = mode === 'layers' || mode === 'activation';
        return (
          <g key={`wrap-${hx}`} opacity={wrapperActive ? 1 : 0.22}>
            <rect
              x={hx - 22}
              y="22"
              width="44"
              height="140"
              rx="10"
              fill={wrapperActive ? '#EFF3F8' : '#FFFFFF'}
              stroke={wrapperActive ? BLUE : '#94A3B8'}
              strokeWidth={wrapperActive ? 1.6 : 1.1}
              strokeDasharray="4 3"
            />
            <foreignObject x={hx - 44} y="2" width="88" height="20">
              <div className="flex h-full items-center justify-center text-[9.5px] font-bold text-[#205089]">
                <InlineMath
                  formula={
                    mode === 'activation'
                      ? `\\mathbf{h}^{(${idx + 1})}=\\phi(\\mathbf{z}^{(${idx + 1})})`
                      : `\\mathbf{h}^{(${idx + 1})}`
                  }
                />
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* Edges across all 3 stages */}
      {stagePairs.map(([fromYs, toYs, x1, x2], stageIdx) =>
        fromYs.map((y1, i) =>
          toYs.map((y2, j) => {
            let active = false;
            if (mode === 'neuron') {
              active = stageIdx === 0 && j === 0;
            } else if (mode === 'matrix' || mode === 'params') {
              active = stageIdx === 0;
            } else if (mode === 'head') {
              active = stageIdx === 2;
            } else if (mode === 'width-depth') {
              active = true;
            }
            return (
              <line
                key={`e-${stageIdx}-${i}-${j}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={active ? BLUE : '#94A3B8'}
                strokeWidth={active ? (mode === 'neuron' ? 1.8 : 1.35) : 1}
                opacity={active ? (mode === 'width-depth' ? 0.35 : 0.72) : 0.14}
              />
            );
          })
        )
      )}

      {/* Nodes across all 4 layers */}
      {layers.map((layer, lIdx) =>
        layer.ys.map((y, nIdx) => {
          let active = false;
          if (mode === 'neuron') {
            active = (lIdx === 0) || (lIdx === 1 && nIdx === 0);
          } else if (mode === 'layers') {
            active = lIdx === 1 || lIdx === 2;
          } else if (mode === 'width-depth') {
            active = lIdx === 1 || lIdx === 2 || lIdx === 3;
          } else if (mode === 'activation') {
            active = lIdx === 1 || lIdx === 2;
          } else if (mode === 'matrix' || mode === 'params') {
            active = lIdx === 0 || lIdx === 1;
          } else if (mode === 'head') {
            active = lIdx === 2 || lIdx === 3;
          }

          const isFilled =
            (mode === 'activation' && (lIdx === 1 || lIdx === 2)) ||
            (mode === 'matrix' && lIdx === 1) ||
            (mode === 'params' && lIdx === 1) ||
            (mode === 'head' && lIdx === 3);

          const label =
            lIdx === 0
              ? `x_${nIdx + 1}`
              : lIdx === 3
                ? `\\hat{y}_${nIdx + 1}`
                : `z_${nIdx + 1}`;

          return (
            <g key={`n-${lIdx}-${nIdx}`} opacity={active ? 1 : 0.18}>
              <circle
                cx={layer.x}
                cy={y}
                r={lIdx === 3 ? 11 : 10}
                fill={isFilled ? '#EFF3F8' : '#FFFFFF'}
                stroke={active ? BLUE : '#94A3B8'}
                strokeWidth={active ? 2 : 1.3}
              />
              <foreignObject x={layer.x - 10} y={y - 9} width="20" height="18">
                <div className="flex h-full items-center justify-center text-[9.5px] font-bold text-[#172A43]">
                  <InlineMath formula={label} />
                </div>
              </foreignObject>
            </g>
          );
        })
      )}

      {/* Mode-specific annotations */}
      {mode === 'neuron' && (
        <>
          {inY.map((y1, idx) => {
            const t = [0.5, 0.42, 0.34][idx];
            const lx = inX + (h1X - inX) * t;
            const ly = y1 + (h1Y[0] - y1) * t;
            return (
              <foreignObject key={`w-edge-${idx}`} x={lx - 14} y={ly - 9} width="28" height="18">
                <div className="flex h-full items-center justify-center rounded border border-[#B8C8DA] bg-white px-1 text-[9px] font-bold text-[#205089]">
                  <InlineMath formula={`w_{${idx + 1}1}`} />
                </div>
              </foreignObject>
            );
          })}
          <foreignObject x={h1X - 18} y="10" width="36" height="18">
            <div className="flex h-full items-center justify-center text-[9.5px] font-bold text-[#205089]">
              <InlineMath formula="+ b_1" />
            </div>
          </foreignObject>
        </>
      )}

      {mode === 'width-depth' && (
        <>
          {/* Width arrow along Hidden Layer 1 */}
          <line
            x1={h1X - 24}
            y1="38"
            x2={h1X - 24}
            y2="146"
            stroke={BLUE}
            strokeWidth="1.5"
            markerStart="url(#summary-arrow)"
            markerEnd="url(#summary-arrow)"
          />
          <text x={h1X - 30} y="95" textAnchor="end" fontSize="9.5" fontWeight="800" fill={BLUE}>
            Width = 4
          </text>
          {/* Depth arrow across the 3 weight-bearing layers */}
          <line
            x1={h1X}
            y1="170"
            x2={outX}
            y2="170"
            stroke={BLUE}
            strokeWidth="1.5"
            markerStart="url(#summary-arrow)"
            markerEnd="url(#summary-arrow)"
          />
          <text x={(h1X + outX) / 2} y="182" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={BLUE}>
            Depth = 3 (số tầng có trọng số)
          </text>
        </>
      )}

      {mode === 'activation' && (
        <foreignObject x="20" y="169" width="380" height="24">
          <div className="flex h-full items-center justify-center gap-1 whitespace-nowrap text-[10px] font-bold text-[#205089]">
            <span>Hàm kích hoạt</span>
            <InlineMath formula="\phi(\cdot)" />
            <span>bọc ngoài các node</span>
            <InlineMath formula="\mathbf{z}" />
            <span>→ cho ra</span>
            <InlineMath formula="\mathbf{h}" />
          </div>
        </foreignObject>
      )}

      {mode === 'matrix' && (
        <>
          <rect
            x={inX + 16}
            y="22"
            width={h1X - inX - 32}
            height="140"
            rx="8"
            fill="none"
            stroke={BLUE}
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <foreignObject x={inX + 8} y="162" width="96" height="22">
            <div className="flex h-full items-center justify-center text-[10px] font-bold text-[#205089]">
              <InlineMath formula="\mathbf{W} \in \mathbb{R}^{3\times 4}" />
            </div>
          </foreignObject>
        </>
      )}

      {mode === 'params' && (
        <foreignObject x="50" y="162" width="124" height="22">
          <div className="flex h-full items-center justify-center rounded-full border border-[#B8C8DA] bg-[#EFF3F8] px-2 text-[10px] font-bold text-[#205089]">
            <InlineMath formula="3 \times 4 + 4 = 16" />
          </div>
        </foreignObject>
      )}

      {mode === 'head' && (
        <foreignObject x="276" y="26" width="132" height="22">
          <div className="flex h-full items-center justify-center rounded-full bg-[#205089] px-2.5 text-[9.5px] font-bold text-white">
            Classification Head
          </div>
        </foreignObject>
      )}
    </svg>
  );
}

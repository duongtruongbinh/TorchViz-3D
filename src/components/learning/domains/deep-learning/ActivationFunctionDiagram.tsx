import { useRef, useState } from 'react';
import { InlineMath, MdxPre } from '../../learningMdxComponents';

const BLUE = '#205089';
const ROSE = '#C2415A';
const SLATE = '#64748B';

type ActivationKey = 'sigmoid' | 'tanh' | 'relu' | 'leaky_relu' | 'gelu';

interface ActivationMeta {
  key: ActivationKey;
  label: string;
  formulaLatex: string;
  derivLatex: string;
  rangeLatex: string;
  pytorchLine: string;
  whenToUse: string[];
  limitations: string[];
  fn: (z: number) => number;
  dfn: (z: number) => number;
}

const erfApprox = (x: number): number => {
  const sign = x >= 0 ? 1 : -1;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t) *
      Math.exp(-a * a);
  return sign * y;
};

const ACTIVATIONS: ActivationMeta[] = [
  {
    key: 'sigmoid',
    label: 'Sigmoid',
    formulaLatex: '\\sigma(z) = \\frac{1}{1 + e^{-z}}',
    derivLatex: "\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))",
    rangeLatex: '(0, 1)',
    pytorchLine: 'act = nn.Sigmoid()',
    whenToUse: [
      'Tầng Output của bài toán phân loại nhị phân (kết hợp BCELoss).',
      'Các cổng điều tiết (gates) bên trong LSTM / GRU cần giá trị trong (0, 1).',
    ],
    limitations: [
      'Đạo hàm tối đa chỉ đạt 0.25 và tiến về 0 ở hai đầu → dễ gây Vanishing Gradient.',
      'Đầu ra luôn dương (không đối xứng quanh 0), làm bước cập nhật gradient bị lệch hướng.',
    ],
    fn: (z) => 1 / (1 + Math.exp(-z)),
    dfn: (z) => {
      const s = 1 / (1 + Math.exp(-z));
      return s * (1 - s);
    },
  },
  {
    key: 'tanh',
    label: 'Tanh',
    formulaLatex: '\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}',
    derivLatex: "\\tanh'(z) = 1 - \\tanh^2(z)",
    rangeLatex: '(-1, 1)',
    pytorchLine: 'act = nn.Tanh()',
    whenToUse: [
      'Các khối mạng hồi quy RNN / LSTM cần đầu ra đối xứng quanh 0 trong (-1, 1).',
      'Mạng nông hoặc bài toán cần chuẩn hóa tín hiệu âm/dương cân bằng.',
    ],
    limitations: [
      'Vẫn bị bão hòa và triệt tiêu đạo hàm (Vanishing Gradient) khi |z| lớn.',
      'Chi phí tính hàm mũ cao hơn ReLU trong các mạng CNN/MLP lớn.',
    ],
    fn: (z) => Math.tanh(z),
    dfn: (z) => {
      const t = Math.tanh(z);
      return 1 - t * t;
    },
  },
  {
    key: 'relu',
    label: 'ReLU',
    formulaLatex: '\\text{ReLU}(z) = \\max(0, z)',
    derivLatex: "\\text{ReLU}'(z) = \\mathbb{I}(z > 0)",
    rangeLatex: '[0, +\\infty)',
    pytorchLine: 'act = nn.ReLU()',
    whenToUse: [
      'Lựa chọn mặc định cho các tầng ẩn trong CNN và MLP truyền thống.',
      'Khi cần tốc độ tính toán rất nhanh và giảm Vanishing Gradient ở miền dương.',
    ],
    limitations: [
      'Dying ReLU: nếu z ≤ 0 liên tục, đạo hàm bằng 0 khiến neuron ngừng học hoàn toàn.',
      'Không khả vi tại z = 0 và đầu ra không đối xứng quanh 0.',
    ],
    fn: (z) => Math.max(0, z),
    dfn: (z) => (z > 0 ? 1 : 0),
  },
  {
    key: 'leaky_relu',
    label: 'Leaky ReLU',
    formulaLatex: '\\text{LeakyReLU}(z) = \\max(0.1z, z)',
    derivLatex: "\\phi'(z) = \\begin{cases}1 & z > 0 \\\\ 0.1 & z \\le 0\\end{cases}",
    rangeLatex: '(-\\infty, +\\infty)',
    pytorchLine: 'act = nn.LeakyReLU(negative_slope=0.1)',
    whenToUse: [
      'Thay thế ReLU khi mạng gặp hiện tượng neuron chết (Dying ReLU).',
      'Thường dùng trong Discriminator của mạng GAN hoặc các mạng CNN sâu.',
    ],
    limitations: [
      'Phải tự chọn siêu tham số độ dốc âm (negative_slope) phù hợp.',
      'Hiệu quả không phải lúc nào cũng vượt trội hơn ReLU ở mọi bài toán.',
    ],
    fn: (z) => (z > 0 ? z : 0.1 * z),
    dfn: (z) => (z > 0 ? 1 : 0.1),
  },
  {
    key: 'gelu',
    label: 'GELU',
    formulaLatex: '\\text{GELU}(z) = z \\cdot \\Phi(z)',
    derivLatex: "\\text{GELU}'(z) = \\Phi(z) + z\\phi(z)",
    rangeLatex: '[-0.17, +\\infty)',
    pytorchLine: 'act = nn.GELU()',
    whenToUse: [
      'Tiêu chuẩn trong khối Feed-Forward Network (FFN) của Transformer (BERT, GPT).',
      'Khi cần hàm kích hoạt mượt khả vi tại 0 và giữ lại một phần tín hiệu âm nhỏ.',
    ],
    limitations: [
      'Phép tính phức tạp và tốn chi phí hơn ReLU trên thiết bị biên yếu.',
      'Ít mang lại khác biệt lớn so với ReLU ở các mạng MLP/CNN rất nhỏ.',
    ],
    fn: (z) => 0.5 * z * (1 + erfApprox(z / Math.SQRT2)),
    dfn: (z) => {
      const cdf = 0.5 * (1 + erfApprox(z / Math.SQRT2));
      const pdf = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
      return cdf + z * pdf;
    },
  },
];

/**
 * Light-Mode visualizations for the Activation Functions lesson:
 * - panel="linear-collapse": Side-by-side comparison of Linear Collapse vs Non-linear Activation.
 * - panel="explorer": Interactive Activation Function + Derivative plotter with z stepper & PyTorch snippet.
 * - panel="vanishing-gradient": Illustrates gradient shrinkage across deep layers and 2 fixes (ReLU/GELU & Skip Connection).
 */
export function ActivationFunctionDiagram({
  panel = 'explorer',
}: {
  panel?: 'linear-collapse' | 'explorer' | 'vanishing-gradient';
}) {
  if (panel === 'linear-collapse') {
    return <LinearCollapseComparison />;
  }
  if (panel === 'vanishing-gradient') {
    return <VanishingGradientDiagram />;
  }
  return <ActivationExplorer />;
}

function LinearCollapseComparison() {
  const linearPoints = [
    { x: 64, y: 82, cls: 0 },
    { x: 108, y: 120, cls: 0 },
    { x: 132, y: 74, cls: 0 },
    { x: 196, y: 128, cls: 1 },
    { x: 224, y: 88, cls: 1 },
    { x: 244, y: 138, cls: 1 },
  ];

  const xorBlue = [
    { x: 468, y: 74 },
    { x: 562, y: 138 },
  ];
  const xorRed = [
    { x: 562, y: 74 },
    { x: 468, y: 138 },
  ];

  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 680 210"
        className="mx-auto w-full max-w-[680px]"
        role="img"
        aria-label="So sánh mạng không có hàm kích hoạt chỉ tạo đường thẳng tuyến tính với mạng có hàm kích hoạt phi tuyến bẻ cong được ranh giới"
      >
        {/* Left: Linear only */}
        <rect x="16" y="14" width="304" height="180" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="168" y="38" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
          KHÔNG CÓ HÀM KÍCH HOẠT (TUYẾN TÍNH)
        </text>
        <line x1="48" y1="158" x2="288" y2="158" stroke="#CBD5E1" strokeWidth="1.2" />
        <line x1="48" y1="54" x2="48" y2="158" stroke="#CBD5E1" strokeWidth="1.2" />
        <line x1="92" y1="154" x2="226" y2="56" stroke={SLATE} strokeWidth="2.2" strokeDasharray="5 4" />
        {linearPoints.map((pt, idx) => (
          <circle
            key={`lin-${idx}`}
            cx={pt.x}
            cy={pt.y}
            r="6"
            fill={pt.cls === 0 ? BLUE : ROSE}
          />
        ))}
        <text x="168" y="179" textAnchor="middle" fontSize="10.5" fontWeight="600" fill={SLATE}>
          100 tầng tuyến tính vẫn sụp về 1 đường thẳng
        </text>

        {/* Right: With Nonlinear Activation */}
        <rect x="360" y="14" width="304" height="180" rx="12" fill="#FFFFFF" stroke={BLUE} strokeWidth="2" />
        <text x="512" y="38" textAnchor="middle" fontSize="11" fontWeight="800" fill={BLUE}>
          CÓ HÀM KÍCH HOẠT PHI TUYẾN (MLP)
        </text>
        <line x1="392" y1="158" x2="632" y2="158" stroke="#CBD5E1" strokeWidth="1.2" />
        <line x1="392" y1="54" x2="392" y2="158" stroke="#CBD5E1" strokeWidth="1.2" />
        {/* Curved nonlinear boundary separating XOR diagonal */}
        <path
          d="M 412 106 Q 468 106 515 62 M 515 150 Q 562 106 618 106"
          fill="none"
          stroke={BLUE}
          strokeWidth="2.4"
        />
        {xorBlue.map((pt, idx) => (
          <circle key={`xb-${idx}`} cx={pt.x} cy={pt.y} r="6.5" fill={BLUE} />
        ))}
        {xorRed.map((pt, idx) => (
          <circle key={`xr-${idx}`} cx={pt.x} cy={pt.y} r="6.5" fill={ROSE} />
        ))}
        <text x="512" y="179" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={BLUE}>
          Bẻ cong không gian, tách được dữ liệu phi tuyến
        </text>
      </svg>
    </figure>
  );
}

function buildCurvePath(
  fn: (z: number) => number,
  zMin: number,
  zMax: number,
  yMin: number,
  yMax: number,
  w: number,
  h: number,
  pad: number
) {
  const steps = 80;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const z = zMin + ((zMax - zMin) * i) / steps;
    const rawY = fn(z);
    const clampedY = Math.max(yMin, Math.min(yMax, rawY));
    const px = pad + ((z - zMin) / (zMax - zMin)) * (w - pad * 2);
    const py = h - pad - ((clampedY - yMin) / (yMax - yMin)) * (h - pad * 2);
    pts.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  return pts.join(' ');
}

function ActivationExplorer() {
  const [selectedKey, setSelectedKey] = useState<ActivationKey>('relu');
  const [zVal, setZVal] = useState(1.0);
  const [codeHighlighted, setCodeHighlighted] = useState(false);
  const timerRef = useRef<number | null>(null);

  const meta = ACTIVATIONS.find((a) => a.key === selectedKey) ?? ACTIVATIONS[2];

  const triggerHighlight = () => {
    setCodeHighlighted(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setCodeHighlighted(false);
    }, 500);
  };

  const handleSelect = (key: ActivationKey) => {
    setSelectedKey(key);
    triggerHighlight();
  };

  const stepZ = (delta: number) => {
    setZVal((prev) => Math.max(-4, Math.min(4, Math.round((prev + delta) * 10) / 10)));
  };

  const w = 260;
  const h = 166;
  const pad = 26;
  const zMin = -4;
  const zMax = 4;

  const yMinFn = selectedKey === 'tanh' ? -1.5 : -1.2;
  const yMaxFn = selectedKey === 'sigmoid' || selectedKey === 'tanh' ? 1.5 : 3.5;

  const yMinDeriv = -0.3;
  const yMaxDeriv = 1.4;

  const mapX = (z: number) => pad + ((z - zMin) / (zMax - zMin)) * (w - pad * 2);
  const mapYFn = (y: number) =>
    h - pad - ((Math.max(yMinFn, Math.min(yMaxFn, y)) - yMinFn) / (yMaxFn - yMinFn)) * (h - pad * 2);
  const mapYDeriv = (y: number) =>
    h -
    pad -
    ((Math.max(yMinDeriv, Math.min(yMaxDeriv, y)) - yMinDeriv) / (yMaxDeriv - yMinDeriv)) *
      (h - pad * 2);

  const fz = meta.fn(zVal);
  const dfz = meta.dfn(zVal);

  const fnPath = buildCurvePath(meta.fn, zMin, zMax, yMinFn, yMaxFn, w, h, pad);
  const derivPath = buildCurvePath(meta.dfn, zMin, zMax, yMinDeriv, yMaxDeriv, w, h, pad);

  const pytorchCode = `import torch
import torch.nn as nn

z = torch.tensor([${zVal.toFixed(1)}], requires_grad=True)
${meta.pytorchLine}

h = act(z)        # ${fz.toFixed(3)}
h.backward()      # z.grad = ${dfz.toFixed(3)}`;

  return (
    <div className="my-6 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {ACTIVATIONS.map((item) => {
            const active = item.key === selectedKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSelect(item.key)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  active
                    ? 'bg-[#205089] text-white'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-[#EFF3F8] hover:text-[#205089]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#172A43]">
            <InlineMath formula="z =" />
          </span>
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => stepZ(-0.5)}
              disabled={zVal <= -4}
              aria-label="Giảm giá trị z"
              className="px-2.5 py-1 text-xs font-extrabold text-[#205089] hover:bg-[#EFF3F8] disabled:opacity-40"
            >
              −
            </button>
            <span className="w-12 border-x border-slate-200 py-1 text-center font-mono text-xs font-bold text-[#172A43]">
              {zVal.toFixed(1)}
            </span>
            <button
              type="button"
              onClick={() => stepZ(0.5)}
              disabled={zVal >= 4}
              aria-label="Tăng giá trị z"
              className="px-2.5 py-1 text-xs font-extrabold text-[#205089] hover:bg-[#EFF3F8] disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Formula & live values strip */}
      <div className="mb-4 grid gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs md:grid-cols-3">
        <div className="flex items-center gap-1.5 text-[#172A43]">
          <InlineMath formula={meta.formulaLatex} />
        </div>
        <div className="flex items-center gap-1.5 text-[#172A43]">
          <InlineMath formula={meta.derivLatex} />
        </div>
        <div className="flex items-center gap-2 font-semibold text-[#205089]">
          <InlineMath formula={`\\phi(${zVal.toFixed(1)}) = ${fz.toFixed(3)}`} />
          <span className="text-slate-300">|</span>
          <InlineMath formula={`\\phi'(${zVal.toFixed(1)}) = ${dfz.toFixed(3)}`} />
        </div>
      </div>

      {/* Dual SVG Plots: Activation & Derivative */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <div className="mb-1 text-center text-[11px] font-extrabold uppercase tracking-wide text-[#205089]">
            Hàm kích hoạt <InlineMath formula="\phi(z)" />
          </div>
          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="mx-auto w-full max-w-[280px]"
            role="img"
            aria-label={`Đồ thị hàm kích hoạt ${meta.label}`}
          >
            <line x1={pad} y1={mapYFn(0)} x2={w - pad} y2={mapYFn(0)} stroke="#CBD5E1" strokeWidth="1" />
            <line x1={mapX(0)} y1={pad} x2={mapX(0)} y2={h - pad} stroke="#CBD5E1" strokeWidth="1" />
            <path d={fnPath} fill="none" stroke={BLUE} strokeWidth="2.4" />
            <line
              x1={mapX(zVal)}
              y1={pad}
              x2={mapX(zVal)}
              y2={h - pad}
              stroke={BLUE}
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <circle cx={mapX(zVal)} cy={mapYFn(fz)} r="4.5" fill={BLUE} stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-2">
          <div className="mb-1 text-center text-[11px] font-extrabold uppercase tracking-wide text-[#C2415A]">
            Đạo hàm <InlineMath formula="\phi'(z)" />
          </div>
          <svg
            viewBox={`0 0 ${w} ${h}`}
            className="mx-auto w-full max-w-[280px]"
            role="img"
            aria-label={`Đồ thị hàm kích hoạt ${meta.label}`}
          >
            <line x1={pad} y1={mapYDeriv(0)} x2={w - pad} y2={mapYDeriv(0)} stroke="#CBD5E1" strokeWidth="1" />
            <line x1={mapX(0)} y1={pad} x2={mapX(0)} y2={h - pad} stroke="#CBD5E1" strokeWidth="1" />
            <path d={derivPath} fill="none" stroke={ROSE} strokeWidth="2.4" />
            <line
              x1={mapX(zVal)}
              y1={pad}
              x2={mapX(zVal)}
              y2={h - pad}
              stroke={ROSE}
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <circle cx={mapX(zVal)} cy={mapYDeriv(dfz)} r="4.5" fill={ROSE} stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <div
        className={`mt-4 rounded-xl transition-all duration-300 ${
          codeHighlighted ? 'ring-2 ring-[#205089]/60 bg-[#EFF3F8]/40' : ''
        }`}
      >
        <MdxPre>
          <code className="language-python">{pytorchCode}</code>
        </MdxPre>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700">
            Khi nào dùng
          </h4>
          <ul className="grid gap-1.5 text-xs leading-5 text-slate-700">
            {meta.whenToUse.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-rose-700">
            Hạn chế
          </h4>
          <ul className="grid gap-1.5 text-xs leading-5 text-slate-700">
            {meta.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function VanishingGradientDiagram() {
  const layers = [
    { label: 'L_1', grad: '10^{-6}', strokeW: 0.8, opacity: 0.25 },
    { label: 'L_2', grad: '10^{-4}', strokeW: 1.4, opacity: 0.42 },
    { label: 'L_3', grad: '0.06', strokeW: 2.2, opacity: 0.68 },
    { label: 'L_4', grad: '0.25', strokeW: 3.2, opacity: 0.85 },
    { label: '\\text{Loss}', grad: '1.0', strokeW: 4.2, opacity: 1 },
  ];

  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 720 236"
        className="mx-auto w-full max-w-[720px]"
        role="img"
        aria-label="Minh họa Vanishing Gradient qua nhiều tầng Sigmoid và hai cách khắc phục: đổi sang ReLU/GELU hoặc dùng Skip Connection"
      >
        {/* Top panel: Vanishing Gradient */}
        <rect x="12" y="10" width="696" height="98" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="360" y="31" textAnchor="middle" fontSize="11" fontWeight="800" fill={ROSE}>
          VANISHING GRADIENT VỚI SIGMOID (σ&apos;(z) ≤ 0.25 Ở MỖI TẦNG)
        </text>

        {layers.map((item, idx) => {
          const cx = 92 + idx * 134;
          return (
            <g key={item.label}>
              <rect
                x={cx - 34}
                y="44"
                width="68"
                height="32"
                rx="8"
                fill={idx === 4 ? '#EFF3F8' : '#FFFFFF'}
                stroke={idx === 4 ? BLUE : '#94A3B8'}
                strokeWidth={idx === 4 ? 1.8 : 1.3}
              />
              <foreignObject x={cx - 34} y="44" width="68" height="32">
                <div className="flex h-full items-center justify-center text-xs font-bold text-[#172A43]">
                  <InlineMath formula={item.label} />
                </div>
              </foreignObject>
              {idx > 0 && (
                <g>
                  <line
                    x1={cx - 40}
                    y1="60"
                    x2={cx - 94}
                    y2="60"
                    stroke={ROSE}
                    strokeWidth={item.strokeW}
                    opacity={item.opacity}
                  />
                  <polygon
                    points={`${cx - 96},60 ${cx - 88},55 ${cx - 88},65`}
                    fill={ROSE}
                    opacity={item.opacity}
                  />
                </g>
              )}
              <foreignObject x={cx - 36} y="80" width="72" height="20">
                <div className="flex h-full items-center justify-center text-[10px] font-bold text-slate-600">
                  <InlineMath formula={`|\\nabla| \\approx ${item.grad}`} />
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Bottom-left: Fix 1 - Change Activation */}
        <rect x="12" y="124" width="338" height="100" rx="12" fill="#FFFFFF" stroke={BLUE} strokeWidth="1.6" />
        <text x="181" y="146" textAnchor="middle" fontSize="11" fontWeight="800" fill={BLUE}>
          CÁCH 1: ĐỔI HÀM KÍCH HOẠT (RELU / GELU)
        </text>
        <foreignObject x="28" y="156" width="306" height="28">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#172A43]">
            <InlineMath formula="\text{ReLU}'(z) = 1 \text{ với } z > 0 \implies 1^{10} = 1" />
          </div>
        </foreignObject>
        <text x="181" y="205" textAnchor="middle" fontSize="10.5" fontWeight="600" fill={SLATE}>
          Đạo hàm không bị thu nhỏ qua nhiều tầng liên tiếp
        </text>

        {/* Bottom-right: Fix 2 - Skip Connection */}
        <rect x="370" y="124" width="338" height="100" rx="12" fill="#FFFFFF" stroke={BLUE} strokeWidth="1.6" />
        <text x="539" y="146" textAnchor="middle" fontSize="11" fontWeight="800" fill={BLUE}>
          CÁCH 2: SKIP CONNECTION (TRÁNH QUA ACTIVATION)
        </text>
        <foreignObject x="386" y="156" width="306" height="28">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#172A43]">
            <InlineMath formula="\mathbf{y} = F(\mathbf{x}) + \mathbf{x} \implies \frac{\partial \mathbf{y}}{\partial \mathbf{x}} = \frac{\partial F}{\partial \mathbf{x}} + \mathbf{I}" />
          </div>
        </foreignObject>
        <text x="539" y="205" textAnchor="middle" fontSize="10.5" fontWeight="600" fill={SLATE}>
          Gradient đi thẳng qua nhánh cộng (+ I), không bị triệt tiêu
        </text>
      </svg>
    </figure>
  );
}

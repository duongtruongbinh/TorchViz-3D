import { useId } from 'react';
import { InlineMath } from '../../learningMdxComponents';
import { DL_PALETTE, SvgBipartiteEdges, SvgMathNode } from './primitives';

const BLUE = DL_PALETTE.primary;
const RED = DL_PALETTE.rose;
const INK = DL_PALETTE.ink;

/**
 * Static SVM-style SVG diagrams for Perceptron:
 * - panel="line": 2D separating hyperplane w^T x + b = 0 with normal vector w and +/- half-spaces.
 * - panel="step": Matrix/vector forward pipeline X * w + b = z -> phi(z) -> y_hat.
 * - panel="scatter": 2D scatter plot of collected input data points X before learning (w, b).
 * - panel="neuron": High-level circular node graph of a single neuron (inputs + bias -> sum -> activation -> output).
 * - panel="width-depth": Side-by-side circular node graphs comparing increasing Width vs increasing Depth in an MLP.
 * - panel="forward": Left-to-right MLP Forward Pass diagram from Input through hidden layers to Output.
 * - panel="backprop": Right-to-left MLP Backpropagation diagram propagating error from Output back through hidden layers.
 */
export function PerceptronGeometryDiagram({
  panel,
}: {
  panel: 'line' | 'step' | 'scatter' | 'neuron' | 'width-depth' | 'forward' | 'backprop';
}) {
  if (panel === 'scatter') {
    return <PerceptronScatterDiagram />;
  }
  if (panel === 'neuron') {
    return <PerceptronNeuronDiagram />;
  }
  if (panel === 'width-depth') {
    return <MlpWidthDepthDiagram />;
  }
  if (panel === 'forward') {
    return <MlpPassDiagram direction="forward" />;
  }
  if (panel === 'backprop') {
    return <MlpPassDiagram direction="backprop" />;
  }
  if (panel === 'step') {
    return <PerceptronStepDiagram />;
  }
  return <PerceptronLineDiagram />;
}

// Data domain x1 in [-0.2, 1.5], x2 in [-0.2, 1.5] mapped to plot box [72..430] x [30..255]
function projectPlanePoint([x1, x2]: readonly [number, number]): [number, number] {
  return [72 + ((x1 + 0.2) / 1.7) * 358, 255 - ((x2 + 0.2) / 1.7) * 225];
}

function PlaneAxes() {
  return (
    <>
      <path d="M72,30 V255 H430" stroke="#64748B" strokeWidth="1.5" fill="none" />
      <foreignObject x="235" y="272" width="50" height="35">
        <div className="text-center text-[#334155]">
          <InlineMath formula="x_1" />
        </div>
      </foreignObject>
      <foreignObject x="24" y="125" width="40" height="35">
        <div className="text-center text-[#334155]">
          <InlineMath formula="x_2" />
        </div>
      </foreignObject>
    </>
  );
}

function PerceptronLineDiagram() {
  const clipId = useId();
  const project = projectPlanePoint;

  // Line: 0.8 x1 - 0.4 x2 + 0.1 = 0 => x2 = 2 x1 + 0.25
  const [lineStartX, lineStartY] = project([-0.225, -0.2]);
  const [lineEndX, lineEndY] = project([0.625, 1.5]);

  // Normal base on line: (0.25, 0.75) satisfies 0.8(0.25) - 0.4(0.75) + 0.1 = 0
  const [nStartX, nStartY] = project([0.25, 0.75]);
  const lx = lineEndX - lineStartX;
  const ly = lineEndY - lineStartY;
  const lineLen = Math.hypot(lx, ly);
  // Unit tangent upwards along line, and unit normal pointing into z > 0 (right-down)
  const tx = lx / lineLen;
  const ty = ly / lineLen;
  const nx = -ty;
  const ny = tx;

  const arrowLen = 68;
  const nEndX = nStartX + nx * arrowLen;
  const nEndY = nStartY + ny * arrowLen;
  const sq = 10;

  const plusPoints: ReadonlyArray<readonly [number, number]> = [
    [0.75, 0.15],
    [1.0, 0.5],
    [1.15, 0.95],
    [0.85, 1.15],
    [1.3, 0.72],
  ];
  const minusPoints: ReadonlyArray<readonly [number, number]> = [
    [-0.05, 0.7],
    [0.05, 1.1],
    [0.2, 1.25],
    [-0.1, 0.25],
    [0.25, 1.0],
  ];

  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 480 315"
        className="mx-auto w-full max-w-[560px]"
        role="img"
        aria-label="Minh họa đường thẳng phân tách của Perceptron với vector pháp tuyến w và điểm ví dụ x = (1.0, 0.5)"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="72" y="30" width="358" height="225" />
          </clipPath>
        </defs>

        {/* Half-space shading */}
        <path
          d={`M72,30 H${lineEndX} L${lineStartX},${lineStartY} H72 Z`}
          clipPath={`url(#${clipId})`}
          fill={RED}
          opacity="0.06"
        />
        <path
          d={`M${lineEndX},30 H430 V255 H${lineStartX} Z`}
          clipPath={`url(#${clipId})`}
          fill={BLUE}
          opacity="0.06"
        />

        {/* Hyperplane label with dashed pointer */}
        <foreignObject x="200" y="2" width="220" height="32">
          <div className="text-sm text-[#172A43]">
            <InlineMath formula="\mathbf{w}^\top \mathbf{x} + b = 0" />
          </div>
        </foreignObject>
        <path
          d={`M238,32 L${lineEndX - 18},${lineEndY + 24}`}
          stroke="#64748B"
          strokeWidth="1.3"
          strokeDasharray="4 3"
          fill="none"
        />

        {/* Axes */}
        <PlaneAxes />

        {/* Separating line */}
        <path
          d={`M${lineStartX},${lineStartY} L${lineEndX},${lineEndY}`}
          clipPath={`url(#${clipId})`}
          stroke={INK}
          strokeWidth="2.5"
        />

        {/* Normal vector w with right-angle square */}
        <g>
          <path
            d={`M${nStartX},${nStartY} L${nEndX},${nEndY}`}
            stroke={BLUE}
            strokeWidth="2.5"
          />
          <path
            d={`M${nEndX - nx * 10 + tx * 5},${nEndY - ny * 10 + ty * 5} L${nEndX},${nEndY} L${nEndX - nx * 10 - tx * 5},${nEndY - ny * 10 - ty * 5}`}
            fill="none"
            stroke={BLUE}
            strokeWidth="2.5"
          />
          <path
            d={`M${nStartX + tx * sq},${nStartY + ty * sq} l${nx * sq},${ny * sq} l${-tx * sq},${-ty * sq}`}
            fill="none"
            stroke="#64748B"
            strokeWidth="1.5"
          />
          <foreignObject x={nEndX + 10} y={nEndY - 14} width="60" height="35">
            <div className="text-[#205089]">
              <InlineMath formula="\mathbf{w}" />
            </div>
          </foreignObject>
        </g>

        {/* Negative points */}
        {minusPoints.map((pt) => {
          const [cx, cy] = project(pt);
          return (
            <circle
              key={`neg-${pt[0]}-${pt[1]}`}
              cx={cx}
              cy={cy}
              r="6.5"
              fill={RED}
              stroke={INK}
            />
          );
        })}

        {/* Positive points (highlight example x = (1.0, 0.5)) */}
        {plusPoints.map((pt) => {
          const [cx, cy] = project(pt);
          const isExample = pt[0] === 1.0 && pt[1] === 0.5;
          return (
            <g key={`pos-${pt[0]}-${pt[1]}`}>
              <circle cx={cx} cy={cy} r="6.5" fill={BLUE} stroke={INK} />
              {isExample && (
                <circle cx={cx} cy={cy} r="10.5" fill="none" stroke={BLUE} strokeWidth="2" />
              )}
            </g>
          );
        })}

        {/* Half-space labels */}
        <foreignObject x="82" y="42" width="90" height="32">
          <div className="text-sm text-[#9F3450]">
            <InlineMath formula="z < 0" />
          </div>
        </foreignObject>
        <foreignObject x="335" y="42" width="90" height="32">
          <div className="text-sm text-[#205089]">
            <InlineMath formula="z > 0" />
          </div>
        </foreignObject>

        {/* Highlighted example label */}
        <foreignObject x="280" y="182" width="180" height="34">
          <div className="text-xs text-[#205089]">
            <InlineMath formula="\mathbf{x}=(1.0,\,0.5),\; z=+0.7" />
          </div>
        </foreignObject>
      </svg>
    </figure>
  );
}

function PerceptronScatterDiagram() {
  const posPoints: ReadonlyArray<{ pt: readonly [number, number]; tag?: string }> = [
    { pt: [1.0, 0.5], tag: '\\mathbf{x}_1=(1.0,\\,0.5)' },
    { pt: [0.9, 0.2], tag: '\\mathbf{x}_3=(0.9,\\,0.2)' },
    { pt: [1.2, 0.85] },
    { pt: [0.85, 1.1] },
  ];
  const negPoints: ReadonlyArray<{ pt: readonly [number, number]; tag?: string }> = [
    { pt: [0.1, 0.8], tag: '\\mathbf{x}_2=(0.1,\\,0.8)' },
    { pt: [-0.05, 0.4] },
    { pt: [0.25, 1.15] },
    { pt: [0.0, 1.2] },
  ];

  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 480 315"
        className="mx-auto w-full max-w-[560px]"
        role="img"
        aria-label="Trực quan hóa tập điểm dữ liệu X trong không gian hai chiều (x1, x2) gồm các điểm dương và âm"
      >
        <PlaneAxes />

        {negPoints.map(({ pt, tag }) => {
          const [cx, cy] = projectPlanePoint(pt);
          return (
            <g key={`sc-neg-${pt[0]}-${pt[1]}`}>
              <circle cx={cx} cy={cy} r="6.5" fill={RED} stroke={INK} />
              {tag && (
                <foreignObject x={cx + 10} y={cy - 14} width="145" height="28">
                  <div className="text-xs text-[#9F3450]">
                    <InlineMath formula={tag} />
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}

        {posPoints.map(({ pt, tag }) => {
          const [cx, cy] = projectPlanePoint(pt);
          return (
            <g key={`sc-pos-${pt[0]}-${pt[1]}`}>
              <circle cx={cx} cy={cy} r="6.5" fill={BLUE} stroke={INK} />
              {tag && (
                <foreignObject x={cx - 65} y={cy + 10} width="145" height="28">
                  <div className="text-center text-xs text-[#205089]">
                    <InlineMath formula={tag} />
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}

        <foreignObject x="285" y="18" width="150" height="32">
          <div className="text-right text-xs font-semibold text-[#475569]">
            <InlineMath formula="\mathbf{X} \in \mathbb{R}^{n \times 2}" />
          </div>
        </foreignObject>
      </svg>
    </figure>
  );
}

function MlpPassDiagram({ direction }: { direction: 'forward' | 'backprop' }) {
  const isBackprop = direction === 'backprop';
  const accent = isBackprop ? RED : BLUE;
  const edgeColor = isBackprop ? '#FDA4AF' : '#94A3B8';
  const nodeFill = isBackprop ? '#FFF1F2' : '#EFF3F8';
  const outFill = isBackprop ? '#FFE4E6' : '#EFF6FF';
  const markerId = isBackprop ? 'bwd-arrow' : 'fwd-arrow';

  const inY = [116, 174];
  const hidY = [90, 145, 200];
  const outY = 145;
  const h1X = 195;
  const h2X = 345;
  const outX = 475;

  const edgeGroupLabels = isBackprop
    ? [
        { x: 128, label: '\\nabla \\mathbf{W}^{(1)}' },
        { x: 270, label: '\\nabla \\mathbf{W}^{(2)}' },
        { x: 410, label: '\\nabla \\mathbf{W}^{(3)}' },
      ]
    : [
        { x: 128, label: '\\mathbf{W}^{(1)}' },
        { x: 270, label: '\\mathbf{W}^{(2)}' },
        { x: 410, label: '\\mathbf{W}^{(3)}' },
      ];

  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 540 256"
        className="mx-auto w-full max-w-[540px]"
        role="img"
        aria-label={
          isBackprop
            ? 'Minh họa Backpropagation: gradient sai số truyền ngược từ Loss qua các tầng để tính gradient trọng số'
            : 'Minh họa Forward Pass: tín hiệu từ Input nhân với các trọng số W qua Layer 1, Layer 2 tới Output'
        }
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
            <polygon points="0 0.5, 6 3.5, 0 6.5" fill={accent} />
          </marker>
        </defs>

        {/* Top direction arrow */}
        <line
          x1={isBackprop ? outX : 62}
          y1="24"
          x2={isBackprop ? 64 : outX - 2}
          y2="24"
          stroke={accent}
          strokeWidth="2"
          markerEnd={`url(#${markerId})`}
        />
        <rect
          x={isBackprop ? 160 : 190}
          y="12"
          width={isBackprop ? 216 : 158}
          height="22"
          rx="11"
          fill={isBackprop ? '#FFF1F2' : '#EFF3F8'}
          stroke={isBackprop ? '#FECDD3' : '#B8C8DA'}
          strokeWidth="1"
        />
        <text x="269" y="27" textAnchor="middle" fontSize="10" fontWeight="800" fill={accent}>
          {isBackprop ? 'Backpropagation (Sai số ngược)' : 'Forward Pass (Xuôi)'}
        </text>

        {/* Weight / Gradient labels above each connection stage */}
        {edgeGroupLabels.map((item) => (
          <foreignObject key={`lbl-${item.label}`} x={item.x - 36} y="44" width="72" height="28">
            <div className="flex h-full items-center justify-center text-xs font-semibold" style={{ color: accent }}>
              <InlineMath formula={item.label} />
            </div>
          </foreignObject>
        ))}

        {/* Edges: Input <-> Layer 1 <-> Layer 2 <-> Output */}
        <SvgBipartiteEdges x1={62} x2={h1X - 15} fromYs={inY} toYs={hidY} stroke={edgeColor} />
        <SvgBipartiteEdges x1={h1X + 15} x2={h2X - 15} fromYs={hidY} toYs={hidY} stroke={edgeColor} />
        <SvgBipartiteEdges x1={h2X + 15} x2={outX - 16} fromYs={hidY} toYs={[outY]} stroke={edgeColor} />

        {/* Input nodes */}
        {inY.map((iy, idx) => (
          <SvgMathNode key={`p-in-node-${iy}`} cx={62} cy={iy} r={15} formula={`x_${idx + 1}`} fontSizeClass="text-[11px]" />
        ))}

        {/* Layer 1 & Layer 2 nodes (activations on forward, error signals on backprop) */}
        {hidY.map((hy, idx) => (
          <SvgMathNode
            key={`p-h1-${hy}`}
            cx={h1X}
            cy={hy}
            r={15}
            fill={nodeFill}
            stroke={accent}
            formula={isBackprop ? `\\delta_${idx + 1}^{(1)}` : `a_${idx + 1}^{(1)}`}
            textColor={accent}
            fontSizeClass="text-[10px]"
          />
        ))}
        {hidY.map((hy, idx) => (
          <SvgMathNode
            key={`p-h2-${hy}`}
            cx={h2X}
            cy={hy}
            r={15}
            fill={nodeFill}
            stroke={accent}
            formula={isBackprop ? `\\delta_${idx + 1}^{(2)}` : `a_${idx + 1}^{(2)}`}
            textColor={accent}
            fontSizeClass="text-[10px]"
          />
        ))}

        {/* Output / Loss node */}
        <SvgMathNode
          cx={outX}
          cy={outY}
          r={16}
          fill={outFill}
          stroke={accent}
          strokeWidth={1.8}
          formula={isBackprop ? '\\mathcal{L}' : '\\hat{y}'}
          textColor={accent}
        />

        {/* Bottom layer labels */}
        <text x="62" y="238" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
          Input
        </text>
        <text x={h1X} y="238" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
          Layer 1
        </text>
        <text x={h2X} y="238" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
          Layer 2
        </text>
        <text x={outX} y="238" textAnchor="middle" fontSize="11" fontWeight="700" fill={isBackprop ? RED : '#475569'}>
          {isBackprop ? 'Sai số (Loss)' : 'Output'}
        </text>
      </svg>
    </figure>
  );
}

function MlpWidthDepthDiagram() {
  const inY = [100, 160];
  const outY = 130;

  // Width: 1 hidden layer with 5 neurons
  const wideY = [54, 92, 130, 168, 206];
  // Depth: 3 sequential hidden layers with 2 neurons each
  const depthXs = [125, 200, 275];
  const depthY = [100, 160];

  return (
    <figure className="my-6 grid gap-6 bg-white py-2 md:grid-cols-2">
      {/* Left: Increasing Width */}
      <svg
        viewBox="0 0 380 262"
        className="mx-auto w-full max-w-[380px]"
        role="img"
        aria-label="Minh họa tăng Width: mở rộng số lượng neuron trong một tầng ẩn"
      >
        <rect
          x="144"
          y="26"
          width="82"
          height="204"
          rx="14"
          fill="#F8FAFC"
          stroke={BLUE}
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <rect x="139" y="14" width="92" height="22" rx="11" fill="#EFF3F8" stroke="#B8C8DA" strokeWidth="1" />
        <text x="185" y="29" textAnchor="middle" fontSize="10" fontWeight="800" fill={BLUE}>
          Tăng Width
        </text>

        {/* Edges: Input -> Wide Hidden -> Output */}
        <SvgBipartiteEdges x1={56} x2={171} fromYs={inY} toYs={wideY} />
        <SvgBipartiteEdges x1={199} x2={314} fromYs={wideY} toYs={[outY]} />

        {/* Input nodes */}
        {inY.map((iy, idx) => (
          <SvgMathNode key={`w-in-node-${iy}`} cx={56} cy={iy} r={14} formula={`x_${idx + 1}`} fontSizeClass="text-[11px]" />
        ))}

        {/* Wide hidden nodes */}
        {wideY.map((hy) => (
          <circle key={`w-hid-${hy}`} cx="185" cy={hy} r="13" fill="#EFF3F8" stroke={BLUE} strokeWidth="1.6" />
        ))}

        {/* Output node */}
        <SvgMathNode cx={328} cy={outY} r={15} fill="#EFF6FF" stroke={BLUE} strokeWidth={1.8} formula="\\hat{y}" textColor={BLUE} />

        {/* Layer caption below */}
        <text x="185" y="248" textAnchor="middle" fontSize="11" fontWeight="700" fill="#475569">
          Layer 1
        </text>
      </svg>

      {/* Right: Increasing Depth */}
      <svg
        viewBox="0 0 380 262"
        className="mx-auto w-full max-w-[380px]"
        role="img"
        aria-label="Minh họa tăng Depth: xếp nhiều tầng neuron nối tiếp nhau"
      >
        <rect
          x="100"
          y="64"
          width="200"
          height="132"
          rx="14"
          fill="#F8FAFC"
          stroke={BLUE}
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <rect x="154" y="52" width="92" height="22" rx="11" fill="#EFF3F8" stroke="#B8C8DA" strokeWidth="1" />
        <text x="200" y="67" textAnchor="middle" fontSize="10" fontWeight="800" fill={BLUE}>
          Tăng Depth
        </text>

        {/* Edges: Input -> Layer 1 -> Layer 2 -> Layer 3 -> Output */}
        <SvgBipartiteEdges x1={44} x2={depthXs[0]} fromYs={inY} toYs={depthY} />
        {depthXs.slice(0, -1).map((lx, li) => (
          <SvgBipartiteEdges key={`d-mid-${lx}`} x1={lx} x2={depthXs[li + 1]} fromYs={depthY} toYs={depthY} />
        ))}
        <SvgBipartiteEdges x1={depthXs[2]} x2={342} fromYs={depthY} toYs={[outY]} />

        {/* Input nodes */}
        {inY.map((iy, idx) => (
          <SvgMathNode key={`d-in-node-${iy}`} cx={44} cy={iy} r={14} formula={`x_${idx + 1}`} fontSizeClass="text-[11px]" />
        ))}

        {/* 3 sequential hidden layers */}
        {depthXs.map((lx) =>
          depthY.map((hy) => (
            <circle key={`d-hid-${lx}-${hy}`} cx={lx} cy={hy} r="13" fill="#EFF3F8" stroke={BLUE} strokeWidth="1.6" />
          )),
        )}

        {/* Output node */}
        <SvgMathNode cx={342} cy={outY} r={15} fill="#EFF6FF" stroke={BLUE} strokeWidth={1.8} formula="\\hat{y}" textColor={BLUE} />

        {/* Layer captions below */}
        {depthXs.map((lx, idx) => (
          <text
            key={`d-lbl-${lx}`}
            x={lx}
            y="216"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#475569"
          >
            Layer {idx + 1}
          </text>
        ))}
      </svg>
    </figure>
  );
}

function PerceptronNeuronDiagram() {
  const inputs = [
    { y: 56, label: 'x_1', w: 'w_1', wy: 74 },
    { y: 120, label: 'x_2', w: 'w_2', wy: 112 },
    { y: 184, label: 'x_d', w: 'w_d', wy: 150 },
  ] as const;

  const sumX = 285;
  const sumY = 120;
  const actX = 435;
  const actY = 120;
  const outX = 575;
  const outY = 120;

  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 650 258"
        className="mx-auto w-full max-w-[650px]"
        role="img"
        aria-label="Sơ đồ tổng quan một neuron nhân tạo: các node đầu vào và bias đi qua node tổng tuyến tính, node kích hoạt phi(z) ra node đầu ra"
      >
        <defs>
          <marker
            id="neuron-arrow"
            markerWidth="7"
            markerHeight="7"
            refX="5.5"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0.5, 6 3.5, 0 6.5" fill="#64748B" />
          </marker>
        </defs>

        {/* Grouping border for 1 Neuron (Sum + Bias + Activation) */}
        <rect
          x="236"
          y="68"
          width="248"
          height="176"
          rx="16"
          fill="#F8FAFC"
          stroke={BLUE}
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <rect x="318" y="57" width="84" height="22" rx="11" fill="#EFF3F8" stroke="#B8C8DA" strokeWidth="1" />
        <text x="360" y="72" textAnchor="middle" fontSize="10" fontWeight="800" fill={BLUE}>
          1 Neuron
        </text>

        {/* Stage captions */}
        <text x="90" y="20" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
          ĐẦU VÀO
        </text>
        <text x="285" y="20" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
          TỔNG + BIAS
        </text>
        <text x="435" y="20" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
          KÍCH HOẠT
        </text>
        <text x="575" y="20" textAnchor="middle" fontSize="11" fontWeight="800" fill="#475569">
          ĐẦU RA
        </text>

        {/* Input -> Sum edges */}
        {inputs.map((inp) => (
          <g key={`edge-${inp.label}`}>
            <line
              x1={114}
              y1={inp.y}
              x2={sumX - 32}
              y2={sumY}
              stroke="#64748B"
              strokeWidth="1.6"
              markerEnd="url(#neuron-arrow)"
            />
            <foreignObject x="166" y={inp.wy - 14} width="38" height="24">
              <div className="text-center text-xs text-[#205089]">
                <InlineMath formula={inp.w} />
              </div>
            </foreignObject>
          </g>
        ))}

        {/* Bias -> Sum edge */}
        <line
          x1={sumX}
          y1={196}
          x2={sumX}
          y2={sumY + 32}
          stroke="#64748B"
          strokeWidth="1.6"
          markerEnd="url(#neuron-arrow)"
        />
        <circle cx={sumX} cy={216} r="20" fill="#EFF3F8" stroke="#B8C8DA" strokeWidth="1.5" />
        <foreignObject x={sumX - 18} y={200} width="36" height="32">
          <div className="flex h-full items-center justify-center text-xs font-semibold text-[#205089]">
            <InlineMath formula="b" />
          </div>
        </foreignObject>

        {/* Sum -> Activation -> Output edges */}
        <line
          x1={sumX + 30}
          y1={sumY}
          x2={actX - 32}
          y2={actY}
          stroke="#64748B"
          strokeWidth="1.8"
          markerEnd="url(#neuron-arrow)"
        />
        <foreignObject x="332" y={sumY - 26} width="54" height="24">
          <div className="text-center text-xs text-[#475569]">
            <InlineMath formula="z" />
          </div>
        </foreignObject>

        <line
          x1={actX + 30}
          y1={actY}
          x2={outX - 28}
          y2={outY}
          stroke="#64748B"
          strokeWidth="1.8"
          markerEnd="url(#neuron-arrow)"
        />

        {/* Input circular nodes */}
        {inputs.map((inp) => (
          <g key={`node-${inp.label}`}>
            <circle cx={90} cy={inp.y} r="22" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.6" />
            <foreignObject x={70} y={inp.y - 14} width="40" height="28">
              <div className="flex h-full items-center justify-center text-xs text-[#172A43]">
                <InlineMath formula={inp.label} />
              </div>
            </foreignObject>
          </g>
        ))}
        <text x="90" y="156" textAnchor="middle" fontSize="14" fontWeight="800" fill="#94A3B8">
          ⋮
        </text>

        {/* Summation circular node */}
        <circle cx={sumX} cy={sumY} r="28" fill="#EFF3F8" stroke={BLUE} strokeWidth="1.8" />
        <foreignObject x={sumX - 24} y={sumY - 16} width="48" height="32">
          <div className="flex h-full items-center justify-center text-sm text-[#205089]">
            <InlineMath formula="\Sigma" />
          </div>
        </foreignObject>

        {/* Activation circular node */}
        <circle cx={actX} cy={actY} r="28" fill="#FFFFFF" stroke={BLUE} strokeWidth="1.8" />
        <foreignObject x={actX - 24} y={actY - 16} width="48" height="32">
          <div className="flex h-full items-center justify-center text-xs text-[#205089]">
            <InlineMath formula="\phi(z)" />
          </div>
        </foreignObject>

        {/* Output circular node */}
        <circle cx={outX} cy={outY} r="24" fill="#EFF6FF" stroke={BLUE} strokeWidth="1.8" />
        <foreignObject x={outX - 20} y={outY - 14} width="40" height="28">
          <div className="flex h-full items-center justify-center text-xs text-[#205089]">
            <InlineMath formula="\hat{y}" />
          </div>
        </foreignObject>
      </svg>
    </figure>
  );
}

function PerceptronStepDiagram() {
  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 816 218"
        className="mx-auto w-full max-w-[816px]"
        role="img"
        aria-label="Luồng tính Perceptron: Ma trận đầu vào X gồm các hàng x1, x2, x3, nhân vector trọng số w, cộng bias b để ra vector z, qua hàm bước nhảy phi(z) ra vector đầu ra +1 hoặc -1"
      >
        <defs>
          <marker
            id="pipe-arrow"
            markerWidth="7"
            markerHeight="7"
            refX="5.5"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0.5, 6 3.5, 0 6.5" fill="#64748B" />
          </marker>
        </defs>

        {/* Stage headers with consistent KaTeX math symbols */}
        <foreignObject x="10" y="10" width="178" height="26">
          <div className="flex h-full items-center justify-center text-[11px] font-extrabold tracking-wide text-[#475569]">
            INPUTS (<InlineMath formula="\mathbf{X}" />)
          </div>
        </foreignObject>
        <foreignObject x="214" y="10" width="92" height="26">
          <div className="flex h-full items-center justify-center text-[11px] font-extrabold tracking-wide text-[#475569]">
            TRỌNG SỐ <span className="ml-1"><InlineMath formula="\mathbf{w}" /></span>
          </div>
        </foreignObject>
        <foreignObject x="328" y="10" width="64" height="26">
          <div className="flex h-full items-center justify-center text-[11px] font-extrabold tracking-wide text-[#475569]">
            BIAS <span className="ml-1"><InlineMath formula="b" /></span>
          </div>
        </foreignObject>
        <foreignObject x="416" y="10" width="88" height="26">
          <div className="flex h-full items-center justify-center text-[11px] font-extrabold tracking-wide text-[#475569]">
            TỔNG <span className="ml-1"><InlineMath formula="\mathbf{z}" /></span>
          </div>
        </foreignObject>
        <foreignObject x="532" y="10" width="140" height="26">
          <div className="flex h-full items-center justify-center text-[11px] font-extrabold tracking-wide text-[#475569]">
            HÀM <span className="ml-1"><InlineMath formula="\phi(z)" /></span>
          </div>
        </foreignObject>
        <foreignObject x="702" y="10" width="104" height="26">
          <div className="flex h-full items-center justify-center text-[11px] font-extrabold tracking-wide text-[#475569]">
            OUTPUT (<InlineMath formula="\hat{\mathbf{y}}" />)
          </div>
        </foreignObject>

        {/* 1. Input matrix X = [x1; x2; x3] */}
        <rect x="10" y="48" width="178" height="128" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <foreignObject x="14" y="52" width="170" height="120">
          <div className="flex h-full items-center justify-center text-xs text-[#172A43]">
            <InlineMath formula="\begin{bmatrix} \mathbf{x}_1 \\ \mathbf{x}_2 \\ \mathbf{x}_3 \end{bmatrix} = \begin{bmatrix} 1.0 & 0.5 \\ 0.1 & 0.8 \\ 0.9 & 0.2 \end{bmatrix}" />
          </div>
        </foreignObject>

        {/* Multiplication sign: X × w */}
        <text x="201" y="116" textAnchor="middle" fontSize="18" fontWeight="800" fill="#64748B">
          ×
        </text>

        {/* 2. Weight vector w */}
        <rect x="214" y="66" width="92" height="90" rx="10" fill="#EFF3F8" stroke="#B8C8DA" strokeWidth="1.5" />
        <foreignObject x="218" y="70" width="84" height="82">
          <div className="flex h-full items-center justify-center text-xs text-[#205089]">
            <InlineMath formula="\begin{bmatrix} 0.8 \\ -0.4 \end{bmatrix}" />
          </div>
        </foreignObject>

        {/* Plus sign: + b */}
        <text x="319" y="116" textAnchor="middle" fontSize="18" fontWeight="800" fill="#64748B">
          +
        </text>

        {/* 3. Bias b */}
        <rect x="332" y="81" width="56" height="60" rx="10" fill="#EFF3F8" stroke="#B8C8DA" strokeWidth="1.5" />
        <foreignObject x="334" y="83" width="52" height="56">
          <div className="flex h-full items-center justify-center text-xs font-semibold text-[#205089]">
            <InlineMath formula="0.1" />
          </div>
        </foreignObject>

        {/* Equals sign: = z */}
        <text x="402" y="116" textAnchor="middle" fontSize="18" fontWeight="800" fill="#64748B">
          =
        </text>

        {/* 4. Score vector z (KaTeX) */}
        <rect x="416" y="48" width="88" height="128" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <foreignObject x="420" y="52" width="80" height="120">
          <div className="flex h-full items-center justify-center text-xs text-[#172A43]">
            <InlineMath formula="\begin{bmatrix} \color{#205089}{+0.70} \\ \color{#C2415A}{-0.14} \\ \color{#205089}{+0.74} \end{bmatrix}" />
          </div>
        </foreignObject>

        <line x1="506" y1="112" x2="528" y2="112" stroke="#64748B" strokeWidth="1.8" markerEnd="url(#pipe-arrow)" />

        {/* 5. Activation phi(z) */}
        <rect x="532" y="59" width="140" height="106" rx="12" fill="#FFFFFF" stroke={BLUE} strokeWidth="1.75" />
        <foreignObject x="536" y="61" width="132" height="102">
          <div className="flex h-full items-center justify-center text-xs text-[#172A43]">
            <InlineMath formula="\phi(z)=\begin{cases}+1 & z \ge 0 \\ -1 & z < 0\end{cases}" />
          </div>
        </foreignObject>

        <line x1="674" y1="112" x2="698" y2="112" stroke="#64748B" strokeWidth="1.8" markerEnd="url(#pipe-arrow)" />

        {/* 6. Output vector (+1 / -1 in KaTeX) */}
        <rect x="702" y="48" width="104" height="128" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <foreignObject x="706" y="52" width="96" height="120">
          <div className="flex h-full items-center justify-center text-xs text-[#172A43]">
            <InlineMath formula="\begin{bmatrix} \color{#205089}{+1} \\ \color{#C2415A}{-1} \\ \color{#205089}{+1} \end{bmatrix}" />
          </div>
        </foreignObject>
      </svg>
    </figure>
  );
}

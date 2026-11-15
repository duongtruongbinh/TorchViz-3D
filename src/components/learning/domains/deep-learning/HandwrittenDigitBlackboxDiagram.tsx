import { InlineMath } from '../../learningMdxComponents';
import { DL_PALETTE } from './primitives';

const BLUE = DL_PALETTE.primary;
const SLATE = DL_PALETTE.slate;

// 8x8 pixel grid representing a handwritten digit "3" (0 = white, 1 = light, 2 = mid, 3 = dark)
const DIGIT_3_GRID: number[][] = [
  [0, 0, 2, 3, 3, 2, 0, 0],
  [0, 2, 3, 1, 1, 3, 2, 0],
  [0, 0, 0, 0, 1, 3, 1, 0],
  [0, 0, 1, 3, 3, 2, 0, 0],
  [0, 0, 0, 0, 2, 3, 1, 0],
  [0, 1, 0, 0, 1, 3, 2, 0],
  [0, 2, 3, 2, 2, 3, 1, 0],
  [0, 0, 2, 3, 3, 1, 0, 0],
];

const PIXEL_FILLS = ['#FFFFFF', '#E2E8F0', '#64748B', '#172A43'];

const PIXEL_MAPPINGS = [
  { row: 0, col: 0, idx: 0, label: 'x_1', badge: '1', color: '#2563EB', bg: '#DBEAFE' },
  { row: 0, col: 1, idx: 1, label: 'x_2', badge: '2', color: '#0F766E', bg: '#CCFBF1' },
  { row: 0, col: 2, idx: 2, label: 'x_3', badge: '3', color: '#7C3AED', bg: '#EDE9FE' },
  { row: 7, col: 7, idx: 4, label: 'x_{784}', badge: 'n', color: '#BE123C', bg: '#FFE4E6' },
];

const FLATTENED_CELLS = [
  { label: 'x_1', stroke: '#2563EB', fill: '#DBEAFE' },
  { label: 'x_2', stroke: '#0F766E', fill: '#CCFBF1' },
  { label: 'x_3', stroke: '#7C3AED', fill: '#EDE9FE' },
  { label: '\\vdots', stroke: '#CBD5E1', fill: '#F8FAFC' },
  { label: 'x_{784}', stroke: '#BE123C', fill: '#FFE4E6' },
];

const OUTPUT_CLASSES = [
  { digit: '0', prob: 0.01, active: false, ellipsis: false },
  { digit: '1', prob: 0.01, active: false, ellipsis: false },
  { digit: '2', prob: 0.02, active: false, ellipsis: false },
  { digit: '3', prob: 0.94, active: true, ellipsis: false },
  { digit: 'dots', prob: 0, active: false, ellipsis: true },
  { digit: '9', prob: 0.02, active: false, ellipsis: false },
];

/**
 * Full-width Light-Mode SVG showing the end-to-end digit recognition pipeline:
 * Handwritten Digit Image (with explicit pixel 1 -> x_1, pixel 2 -> x_2, ... mapping)
 * -> Flattened Vector -> Blackbox (replaceable by MLP / CNN / ResNet) -> Output y_hat.
 */
export function HandwrittenDigitBlackboxDiagram() {
  const cellSize = 16;
  const gridX = 24;
  const gridY = 68;

  const vecX = 256;
  const vecY = 64;
  const vecW = 68;
  const vecCellH = 26;

  return (
    <figure className="my-6 w-full bg-white py-2">
      <svg
        viewBox="0 0 960 296"
        className="w-full"
        role="img"
        aria-label="Minh họa quy trình nhận diện chữ số viết tay: từng pixel 1, 2, 3 đến 784 được flatten tương ứng thành x1, x2, x3 đến x784, đưa qua hộp đen mô hình và cho ra đầu ra y"
      >
        <defs>
          <marker
            id="digit-arrow-blue"
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

        {/* Stage 1: Handwritten Digit 8x8 Pixel Grid */}
        <text x={gridX + 64} y="24" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">
          ẢNH ĐẦU VÀO (2D)
        </text>
        <rect
          x={gridX - 2}
          y={gridY - 2}
          width={cellSize * 8 + 4}
          height={cellSize * 8 + 4}
          rx="6"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="1.6"
        />
        {DIGIT_3_GRID.map((row, r) =>
          row.map((val, c) => {
            const mapped = PIXEL_MAPPINGS.find((m) => m.row === r && m.col === c);
            const px = gridX + c * cellSize;
            const py = gridY + r * cellSize;
            return (
              <g key={`px-${r}-${c}`}>
                <rect
                  x={px}
                  y={py}
                  width={cellSize}
                  height={cellSize}
                  fill={mapped ? mapped.bg : PIXEL_FILLS[val]}
                  stroke={mapped ? mapped.color : '#E2E8F0'}
                  strokeWidth={mapped ? 1.8 : 0.6}
                />
                {mapped && (
                  <text
                    x={px + cellSize / 2}
                    y={py + cellSize / 2 + 3.5}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="800"
                    fill={mapped.color}
                  >
                    {mapped.badge}
                  </text>
                )}
              </g>
            );
          })
        )}
        <foreignObject x={gridX} y="206" width="128" height="24">
          <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-600">
            <InlineMath formula="28 \times 28\text{ pixels}" />
          </div>
        </foreignObject>

        {/* Explicit pixel -> vector mapping curves (top-exit for row 0 so lines never cross pixel numbers) */}
        {PIXEL_MAPPINGS.map((m) => {
          const ex = vecX - 4;
          const ey = vecY + m.idx * vecCellH + vecCellH / 2;
          if (m.row === 0) {
            const sx = gridX + m.col * cellSize + cellSize / 2;
            const sy = gridY - 2;
            const arcY = gridY - 24 + m.col * 7;
            const cornerX = gridX + cellSize * 8 + 14 + (2 - m.col) * 8;
            return (
              <g key={`map-${m.badge}`}>
                <path
                  d={`M ${sx} ${sy} L ${sx} ${arcY} L ${cornerX} ${arcY} C ${cornerX + 36} ${arcY}, ${ex - 36} ${ey}, ${ex} ${ey}`}
                  fill="none"
                  stroke={m.color}
                  strokeWidth="1.6"
                />
                <circle cx={ex} cy={ey} r="2.6" fill={m.color} />
              </g>
            );
          }
          const sx = gridX + m.col * cellSize + cellSize;
          const sy = gridY + m.row * cellSize + cellSize / 2;
          return (
            <g key={`map-${m.badge}`}>
              <path
                d={`M ${sx} ${sy} C ${sx + 48} ${sy}, ${ex - 44} ${ey}, ${ex} ${ey}`}
                fill="none"
                stroke={m.color}
                strokeWidth="1.6"
                strokeDasharray="4 3"
              />
              <circle cx={ex} cy={ey} r="2.6" fill={m.color} />
            </g>
          );
        })}
        <text x="204" y="24" textAnchor="middle" fontSize="11" fontWeight="700" fill={SLATE}>
          FLATTEN
        </text>

        {/* Stage 2: Flattened 1D Pixel Vector */}
        <text x={vecX + vecW / 2} y="24" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">
          VECTOR 1D
        </text>
        {FLATTENED_CELLS.map((cell, idx) => {
          const cy = vecY + idx * vecCellH;
          return (
            <g key={`flat-${idx}`}>
              <rect
                x={vecX}
                y={cy}
                width={vecW}
                height={vecCellH}
                fill={cell.fill}
                stroke={cell.stroke}
                strokeWidth="1.4"
              />
              <foreignObject x={vecX} y={cy} width={vecW} height={vecCellH}>
                <div className="flex h-full items-center justify-center text-[11px] font-bold text-[#172A43]">
                  <InlineMath formula={cell.label} />
                </div>
              </foreignObject>
            </g>
          );
        })}
        <foreignObject x={vecX - 18} y="194" width="104" height="24">
          <div className="flex h-full items-center justify-center text-xs font-semibold text-slate-600">
            <InlineMath formula="\mathbf{x} \in \mathbb{R}^{784}" />
          </div>
        </foreignObject>

        {/* Arrow 2 -> 3 */}
        <line
          x1={vecX + vecW + 12}
          y1="118"
          x2="394"
          y2="118"
          stroke={BLUE}
          strokeWidth="2.2"
          markerEnd="url(#digit-arrow-blue)"
        />

        {/* Stage 3: Blackbox */}
        <rect
          x="404"
          y="60"
          width="206"
          height="116"
          rx="14"
          fill="#172A43"
          stroke={BLUE}
          strokeWidth="2.2"
        />
        <text x="507" y="102" textAnchor="middle" fontSize="15" fontWeight="900" fill="#FFFFFF" letterSpacing="1.2">
          BLACKBOX
        </text>
        <foreignObject x="430" y="110" width="154" height="24">
          <div className="flex h-full items-center justify-center gap-1 text-xs font-semibold text-slate-200">
            <span>Hàm ánh xạ</span>
            <InlineMath formula="f(\mathbf{x})" />
          </div>
        </foreignObject>
        <rect x="441" y="140" width="132" height="22" rx="11" fill={BLUE} />
        <text x="507" y="154.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">
          MLP / CNN / ResNet
        </text>

        {/* Callout below Blackbox */}
        <line
          x1="507"
          y1="180"
          x2="507"
          y2="202"
          stroke={BLUE}
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <rect
          x="375"
          y="204"
          width="264"
          height="62"
          rx="12"
          fill="#EFF3F8"
          stroke="#B8C8DA"
          strokeWidth="1.4"
        />
        <text x="507" y="227" textAnchor="middle" fontSize="11.5" fontWeight="800" fill={BLUE}>
          Có thể thay Blackbox này bằng:
        </text>
        <text x="507" y="249" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#172A43">
          MLP đơn giản  ↔  Mạng sâu phức tạp hơn
        </text>

        {/* Arrow 3 -> 4 */}
        <line
          x1="618"
          y1="118"
          x2="676"
          y2="118"
          stroke={BLUE}
          strokeWidth="2.2"
          markerEnd="url(#digit-arrow-blue)"
        />

        {/* Stage 4: Output y_hat */}
        <text x="802" y="24" textAnchor="middle" fontSize="12" fontWeight="800" fill={BLUE}>
          ĐẦU RA DỰ ĐOÁN
        </text>
        {OUTPUT_CLASSES.map((item, idx) => {
          const ry = 52 + idx * 23;
          if (item.ellipsis) {
            return (
              <g key="out-ellipsis">
                <foreignObject x="688" y={ry - 2} width="36" height="20">
                  <div className="flex h-full items-center text-xs font-bold text-slate-400">
                    <InlineMath formula="\vdots" />
                  </div>
                </foreignObject>
                <text x="785" y={ry + 12} textAnchor="middle" fontSize="13" fontWeight="700" fill="#94A3B8">
                  ⋮
                </text>
              </g>
            );
          }
          const barW = Math.max(10, Math.round(item.prob * 105));
          return (
            <g key={`out-${item.digit}`}>
              <foreignObject x="688" y={ry - 1} width="36" height="20">
                <div
                  className={`flex h-full items-center text-xs font-bold ${
                    item.active ? 'text-[#205089]' : 'text-slate-500'
                  }`}
                >
                  <InlineMath formula={`\\hat{y}_${item.digit}`} />
                </div>
              </foreignObject>
              <rect x="728" y={ry + 2} width="115" height="14" rx="5" fill="#F1F5F9" />
              <rect
                x="728"
                y={ry + 2}
                width={barW}
                height="14"
                rx="5"
                fill={item.active ? BLUE : '#94A3B8'}
              />
              <foreignObject x="850" y={ry - 1} width="52" height="20">
                <div
                  className={`flex h-full items-center text-xs font-bold ${
                    item.active ? 'text-[#205089]' : 'text-slate-500'
                  }`}
                >
                  <InlineMath formula={item.prob.toFixed(2)} />
                </div>
              </foreignObject>
            </g>
          );
        })}
        <foreignObject x="716" y="206" width="172" height="24">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#205089]">
            <InlineMath formula="\hat{\mathbf{y}} \in \mathbb{R}^{10}\ (\text{Số } 3)" />
          </div>
        </foreignObject>
      </svg>
    </figure>
  );
}

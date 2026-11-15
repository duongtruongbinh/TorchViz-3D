import { InlineMath } from '../../learningMdxComponents';

const VIEW_W = 480;
const VIEW_H = 250;
const PAD_L = 58;
const PAD_R = 24;
const PAD_T = 22;
const PAD_B = 42;

// X: Petal Length [0.5 .. 7.2], Y: Petal Width [0 .. 2.7]
function mapX(len: number): number {
  return PAD_L + ((len - 0.5) / (7.2 - 0.5)) * (VIEW_W - PAD_L - PAD_R);
}

function mapY(wid: number): number {
  return VIEW_H - PAD_B - (wid / 2.7) * (VIEW_H - PAD_T - PAD_B);
}

const SETOSA_PTS: [number, number][] = [
  [1.4, 0.2], [1.4, 0.2], [1.3, 0.2], [1.5, 0.2], [1.4, 0.3],
  [1.7, 0.4], [1.5, 0.1], [1.6, 0.2], [1.2, 0.2], [1.5, 0.4],
  [1.3, 0.3], [1.6, 0.4], [1.9, 0.2], [1.4, 0.1], [1.8, 0.3],
];

const VERSICOLOR_PTS: [number, number][] = [
  [4.7, 1.4], [4.5, 1.5], [4.9, 1.5], [4.0, 1.3], [4.6, 1.5],
  [4.5, 1.3], [3.3, 1.0], [4.2, 1.3], [4.4, 1.4], [3.9, 1.1],
  [4.8, 1.8], [4.1, 1.3], [4.7, 1.6], [3.6, 1.3], [4.3, 1.3],
  [5.0, 1.7], [3.8, 1.1],
];

const VIRGINICA_PTS: [number, number][] = [
  [6.0, 2.5], [5.1, 1.9], [5.9, 2.1], [5.6, 1.8], [5.8, 2.2],
  [6.6, 2.1], [4.5, 1.7], [6.3, 1.8], [5.8, 1.8], [6.1, 2.5],
  [5.1, 2.0], [5.3, 1.9], [5.5, 2.1], [5.0, 1.5], [4.9, 1.8],
  [6.7, 2.2], [5.4, 2.3],
];

const X_TICKS = [1, 2, 3, 4, 5, 6, 7];
const Y_TICKS = [0.5, 1.0, 1.5, 2.0, 2.5];

export function IrisScatterPlot({ highlightError = false }: { highlightError?: boolean }) {
  const errX = mapX(4.9);
  const errY = mapY(1.7);
  const pointOpacity = highlightError ? 0.38 : 0.88;

  return (
    <section
      className="my-4 rounded-xl border border-[#B8C8DA] bg-white p-4 shadow-sm"
      aria-label={
        highlightError
          ? 'Biểu đồ Error Analysis đánh dấu mẫu dự đoán sai trên vùng giao thoa Versicolor và Virginica'
          : 'Biểu đồ phân tán 3 loài hoa Iris theo chiều dài và chiều rộng cánh hoa'
      }
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-bold text-[#172A43]">
          {highlightError
            ? 'Error Analysis: Vị trí mẫu đoán nhầm (#23) trên mặt phẳng đặc trưng'
            : 'Phân bố 3 loài hoa Iris (Petal Length vs Petal Width)'}
        </span>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 text-[#205089]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#205089]" />
            Setosa
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#0F766E]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0F766E]" />
            Versicolor
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#C2415A]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#C2415A]" />
            Virginica
          </span>
          {highlightError && (
            <span className="inline-flex items-center gap-1 text-[#DC2626]">
              <span>✕</span>
              <span>Đoán sai (#23)</span>
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="h-full w-full"
          role="img"
          aria-label="Biểu đồ scatter plot 3 loài Iris"
        >
          {/* Grid lines */}
          {X_TICKS.map((t) => (
            <line
              key={`gx-${t}`}
              x1={mapX(t)}
              y1={PAD_T}
              x2={mapX(t)}
              y2={VIEW_H - PAD_B}
              stroke="#F1F5F9"
              strokeWidth="1"
            />
          ))}
          {Y_TICKS.map((t) => (
            <line
              key={`gy-${t}`}
              x1={PAD_L}
              y1={mapY(t)}
              x2={VIEW_W - PAD_R}
              y2={mapY(t)}
              stroke="#F1F5F9"
              strokeWidth="1"
            />
          ))}

          {/* Axes */}
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

          {/* Scatter points */}
          {SETOSA_PTS.map(([lx, ly], idx) => (
            <circle
              key={`s-${idx}-${lx}-${ly}`}
              cx={mapX(lx)}
              cy={mapY(ly)}
              r="4.2"
              fill="#205089"
              fillOpacity={pointOpacity}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          ))}
          {VERSICOLOR_PTS.map(([lx, ly], idx) => (
            <circle
              key={`ve-${idx}-${lx}-${ly}`}
              cx={mapX(lx)}
              cy={mapY(ly)}
              r="4.2"
              fill="#0F766E"
              fillOpacity={pointOpacity}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          ))}
          {VIRGINICA_PTS.map(([lx, ly], idx) => (
            <circle
              key={`vi-${idx}-${lx}-${ly}`}
              cx={mapX(lx)}
              cy={mapY(ly)}
              r="4.2"
              fill="#C2415A"
              fillOpacity={pointOpacity}
              stroke="#FFFFFF"
              strokeWidth="1"
            />
          ))}

          {highlightError && (
            <g>
              <circle
                cx={errX}
                cy={errY}
                r="11"
                fill="#DC2626"
                fillOpacity="0.1"
                stroke="#DC2626"
                strokeWidth="1.6"
                strokeDasharray="3 2"
              />
              <line
                x1={errX - 4.5}
                y1={errY - 4.5}
                x2={errX + 4.5}
                y2={errY + 4.5}
                stroke="#DC2626"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <line
                x1={errX + 4.5}
                y1={errY - 4.5}
                x2={errX - 4.5}
                y2={errY + 4.5}
                stroke="#DC2626"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <text
                x={errX - 15}
                y={errY - 12}
                textAnchor="end"
                fontSize="10.5"
                fontWeight="700"
                fill="#DC2626"
              >
                Mẫu #23 (thật: Versicolor)
              </text>
            </g>
          )}
        </svg>

        {/* LaTeX Tick & Axis Labels */}
        {X_TICKS.map((t) => (
          <div
            key={`tx-${t}`}
            className="pointer-events-none absolute -translate-x-1/2 text-[10.5px] text-slate-500"
            style={{
              left: `${(mapX(t) / VIEW_W) * 100}%`,
              top: `${((VIEW_H - PAD_B + 4) / VIEW_H) * 100}%`,
            }}
          >
            <InlineMath formula={`${t}`} />
          </div>
        ))}
        {Y_TICKS.map((t) => (
          <div
            key={`ty-${t}`}
            className="pointer-events-none absolute -translate-y-1/2 text-right text-[10.5px] text-slate-500"
            style={{
              right: `${((VIEW_W - PAD_L + 6) / VIEW_W) * 100}%`,
              top: `${(mapY(t) / VIEW_H) * 100}%`,
            }}
          >
            <InlineMath formula={t.toFixed(1)} />
          </div>
        ))}

        <div
          className="pointer-events-none absolute -translate-x-1/2 text-[11px] font-semibold text-slate-600"
          style={{
            left: `${((PAD_L + VIEW_W - PAD_R) / 2 / VIEW_W) * 100}%`,
            bottom: '2px',
          }}
        >
          Petal Length (cm)
        </div>
        <div
          className="pointer-events-none absolute -translate-y-1/2 -rotate-90 text-[11px] font-semibold text-slate-600"
          style={{
            left: '-14px',
            top: `${((PAD_T + VIEW_H - PAD_B) / 2 / VIEW_H) * 100}%`,
          }}
        >
          Petal Width (cm)
        </div>
      </div>

      <p className="mt-1.5 text-xs text-slate-600">
        {highlightError ? (
          <>
            Điểm <strong className="text-[#DC2626]">✕</strong> là mẫu test #23 (thật là{' '}
            <strong>Versicolor</strong>) nằm ngay vùng giao thoa với cụm{' '}
            <strong>Virginica</strong> nên mô hình đoán nhầm sang Virginica.
          </>
        ) : (
          <>
            Quan sát biểu đồ: <strong>Setosa</strong> tách rời hoàn toàn ở góc dưới-trái, trong khi{' '}
            <strong>Versicolor</strong> và <strong>Virginica</strong> nằm sát và giao thoa nhẹ ở
            vùng giữa.
          </>
        )}
      </p>
    </section>
  );
}

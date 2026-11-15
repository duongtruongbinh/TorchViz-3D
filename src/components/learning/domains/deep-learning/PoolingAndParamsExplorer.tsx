import { DlCardShell } from './primitives';

const POOL_INPUT = [
  [1, 1, 2, 4],
  [5, 6, 7, 8],
  [3, 2, 1, 0],
  [1, 2, 3, 4],
];

const QUADRANT_STYLES = [
  'bg-rose-50 border-rose-300 text-rose-900',
  'bg-emerald-50 border-emerald-300 text-emerald-900',
  'bg-amber-50 border-amber-300 text-amber-900',
  'bg-sky-50 border-sky-300 text-sky-900',
];

const QUADRANTS = [
  [0, 0],
  [0, 2],
  [2, 0],
  [2, 2],
] as const;

export function PoolingAndParamsExplorer() {
  const quadStats = QUADRANTS.map(([r0, c0]) => {
    const vals = [
      POOL_INPUT[r0][c0],
      POOL_INPUT[r0][c0 + 1],
      POOL_INPUT[r0 + 1][c0],
      POOL_INPUT[r0 + 1][c0 + 1],
    ];
    return {
      max: Math.max(...vals),
      avg: (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2),
    };
  });

  const globalAvg = (
    POOL_INPUT.flat().reduce((a, b) => a + b, 0) / 16
  ).toFixed(3);

  return (
    <DlCardShell
      title="So sánh Trực quan: Max Pooling, Average Pooling & Global Average Pooling (GAP)"
      subtitle="Mọi phép Pooling chỉ lấy cực đại hoặc trung bình cố định trên từng vùng nên tốn đúng 0 tham số học."
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
        {/* Input 4x4 */}
        <div className="rounded-xl border border-[#B8C8DA] bg-[#EFF3F8]/40 p-3 flex flex-col items-center">
          <div className="text-xs font-bold text-[#172A43] mb-1">
            Feature Map Đầu vào (4×4)
          </div>
          <div className="text-[11px] text-slate-500 mb-2">
            Chia 4 vùng 2×2 (stride = 2)
          </div>
          <div className="grid grid-cols-4 gap-1">
            {POOL_INPUT.map((row, r) =>
              row.map((val, c) => {
                const qIdx = (r >= 2 ? 2 : 0) + (c >= 2 ? 1 : 0);
                const isMax = val === quadStats[qIdx].max;
                return (
                  <div
                    key={`pi-${r}-${c}`}
                    className={`w-9 h-9 flex items-center justify-center rounded-md text-xs font-mono border ${
                      QUADRANT_STYLES[qIdx]
                    } ${isMax ? 'font-extrabold ring-2 ring-slate-700' : 'font-medium'}`}
                  >
                    {val}
                  </div>
                );
              }),
            )}
          </div>
        </div>

        {/* Max Pooling 2x2 */}
        <div className="rounded-xl border border-[#B8C8DA] bg-[#EFF3F8]/40 p-3 flex flex-col items-center">
          <div className="text-xs font-bold text-[#172A43] mb-1">
            Max Pooling (2×2, s=2)
          </div>
          <div className="text-[11px] text-slate-500 mb-2">
            Giữ lại tín hiệu mạnh nhất
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {quadStats.map((q, qIdx) => (
              <div
                key={`mp-${QUADRANTS[qIdx][0]}-${QUADRANTS[qIdx][1]}`}
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-sm font-mono font-extrabold border ${QUADRANT_STYLES[qIdx]}`}
              >
                {q.max}
              </div>
            ))}
          </div>
          <span className="mt-2 text-[11px] font-mono text-emerald-700 font-semibold">
            Số tham số học: 0
          </span>
        </div>

        {/* Average Pooling 2x2 */}
        <div className="rounded-xl border border-[#B8C8DA] bg-[#EFF3F8]/40 p-3 flex flex-col items-center">
          <div className="text-xs font-bold text-[#172A43] mb-1">
            Average Pooling (2×2, s=2)
          </div>
          <div className="text-[11px] text-slate-500 mb-2">
            Trung bình cộng 4 ô mỗi vùng
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {quadStats.map((q, qIdx) => (
              <div
                key={`ap-${QUADRANTS[qIdx][0]}-${QUADRANTS[qIdx][1]}`}
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-xs font-mono font-bold border ${QUADRANT_STYLES[qIdx]}`}
              >
                {q.avg}
              </div>
            ))}
          </div>
          <span className="mt-2 text-[11px] font-mono text-emerald-700 font-semibold">
            Số tham số học: 0
          </span>
        </div>

        {/* Global Average Pooling */}
        <div className="rounded-xl border border-[#B8C8DA] bg-[#EFF3F8]/40 p-3 flex flex-col items-center">
          <div className="text-xs font-bold text-[#172A43] mb-1">
            Global Avg Pool (GAP)
          </div>
          <div className="text-[11px] text-slate-500 mb-2">
            Gom cả kênh 4×4 → 1 con số
          </div>
          <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-[#EFF3F8] border-2 border-[#205089] text-sm font-mono font-extrabold text-[#205089]">
            {globalAvg}
          </div>
          <span className="mt-2 text-[11px] text-center text-slate-600">
            Nếu có 64 kênh → trả về vector 64 chiều (thay thế FC lớn, 0 params).
          </span>
        </div>
      </div>
    </DlCardShell>
  );
}

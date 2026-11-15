import { useState } from 'react';

const INPUT_MATRIX = [
  [1, 1, 1, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 1, 1, 1],
  [0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0],
];

const KERNEL_MATRIX = [
  [1, 0, 1],
  [0, 1, 0],
  [1, 0, 1],
];

const OUTPUT_MATRIX = [
  [4, 3, 4],
  [2, 4, 3],
  [2, 3, 4],
];

const DIGIT_7_GRID = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 1, 1, 0],
  [0, 0, 0, 1, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

const FILTERS = [
  {
    id: 'top-edge',
    name: 'Filter 1: Cạnh ngang trên',
    desc: 'Phát hiện vùng chuyển từ tối (0) ở hàng trên sang sáng (1) ở hàng giữa — làm nổi bật nét ngang đầu số 7.',
    weights: [
      [-1, -1, -1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  {
    id: 'left-edge',
    name: 'Filter 2: Cạnh dọc bên trong',
    desc: 'Phát hiện vùng chuyển từ tối bên trái (-1) sang sáng ở giữa (+1) — bắt dọc thân chéo bên trái của số 7.',
    weights: [
      [-1, 1, 0],
      [-1, 1, 0],
      [-1, 1, 0],
    ],
  },
  {
    id: 'bottom-edge',
    name: 'Filter 3: Cạnh ngang dưới',
    desc: 'Phát hiện vùng sáng ở giữa (+1) chuyển sang tối ở dưới (-1) — làm nổi bật rìa dưới của thanh ngang số 7.',
    weights: [
      [0, 0, 0],
      [1, 1, 1],
      [-1, -1, -1],
    ],
  },
  {
    id: 'right-edge',
    name: 'Filter 4: Cạnh dọc ngoài',
    desc: 'Phát hiện vùng sáng ở giữa (+1) chuyển sang tối bên phải (-1) — bắt đường viền mép phải của nét số 7.',
    weights: [
      [0, 1, -1],
      [0, 1, -1],
      [0, 1, -1],
    ],
  },
];

export function ConvolutionOperationExplorer() {
  const [tab, setTab] = useState<'math' | 'filters'>('math');
  const [selectedCell, setSelectedCell] = useState<[number, number]>([0, 0]);
  const [selectedFilterIdx, setSelectedFilterIdx] = useState(0);

  const [outR, outC] = selectedCell;
  const centerR = outR + 1;
  const centerC = outC + 1;

  const activeFilter = FILTERS[selectedFilterIdx];

  // Compute 5x5 response map for DIGIT_7_GRID (7x7) with 3x3 activeFilter
  const filterResponse: number[][] = [];
  for (let r = 0; r < 5; r++) {
    const row: number[] = [];
    for (let c = 0; c < 5; c++) {
      let sum = 0;
      for (let kr = 0; kr < 3; kr++) {
        for (let kc = 0; kc < 3; kc++) {
          sum += DIGIT_7_GRID[r + kr][c + kc] * activeFilter.weights[kr][kc];
        }
      }
      row.push(sum);
    }
    filterResponse.push(row);
  }

  return (
    <div className="my-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-[#172A43]">
            Trực quan hóa Phép Tích chập 2D & Bộ lọc Đặc trưng (Kernel / Filter)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Bấm chọn từng ô kết quả để xem cách chiếc kính lúp 3×3 nhân từng phần tử rồi cộng tổng.
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setTab('math')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === 'math'
                ? 'bg-[#EEF5FC] text-[#205089] border border-[#B8C8DA]'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            1. Phép tính X ⊗ W (5×5 → 3×3)
          </button>
          <button
            type="button"
            onClick={() => setTab('filters')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              tab === 'filters'
                ? 'bg-[#EEF5FC] text-[#205089] border border-[#B8C8DA]'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            2. 4 Bộ lọc trên Chữ số 7
          </button>
        </div>
      </div>

      {tab === 'math' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
            {/* Input Matrix X (5x5) */}
            <div className="rounded-xl border border-slate-200 bg-[#FAFBFD] p-3 flex flex-col items-center">
              <div className="text-xs font-bold text-[#172A43] mb-1">
                Ảnh đầu vào X (5×5)
              </div>
              <div className="text-[11px] text-slate-500 mb-2">
                Tâm đang chọn: x<sub>{centerR + 1},{centerC + 1}</sub>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {INPUT_MATRIX.map((row, rIdx) =>
                  row.map((val, cIdx) => {
                    const inWindow =
                      rIdx >= outR &&
                      rIdx < outR + 3 &&
                      cIdx >= outC &&
                      cIdx < outC + 3;
                    const isCenter = rIdx === centerR && cIdx === centerC;
                    return (
                      <div
                        key={`x-${rIdx}-${cIdx}`}
                        className={`w-9 h-9 flex items-center justify-center rounded-md text-xs font-mono font-bold border transition ${
                          isCenter
                            ? 'bg-amber-200 border-amber-600 text-amber-950 ring-2 ring-amber-400'
                            : inWindow
                              ? 'bg-amber-50 border-amber-400 text-[#172A43]'
                              : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        {val}
                      </div>
                    );
                  }),
                )}
              </div>
            </div>

            {/* Kernel W (3x3) */}
            <div className="rounded-xl border border-slate-200 bg-[#FAFBFD] p-3 flex flex-col items-center">
              <div className="text-xs font-bold text-[#172A43] mb-1">
                Kernel W (3×3)
              </div>
              <div className="text-[11px] text-slate-500 mb-2">
                Chiếc kính lúp cố định
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {KERNEL_MATRIX.map((row, rIdx) =>
                  row.map((val, cIdx) => (
                    <div
                      key={`w-${rIdx}-${cIdx}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-md text-xs font-mono font-bold border ${
                        val === 1
                          ? 'bg-[#EEF5FC] border-[#205089] text-[#205089]'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {val}
                    </div>
                  )),
                )}
              </div>
            </div>

            {/* Element-wise A * W */}
            <div className="rounded-xl border border-slate-200 bg-[#FAFBFD] p-3 flex flex-col items-center">
              <div className="text-xs font-bold text-[#172A43] mb-1">
                Nhân từng vị trí (A ⊙ W)
              </div>
              <div className="text-[11px] text-slate-500 mb-2">
                Cộng toàn bộ 9 ô lại
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[0, 1, 2].map((kr) =>
                  [0, 1, 2].map((kc) => {
                    const aVal = INPUT_MATRIX[outR + kr][outC + kc];
                    const wVal = KERNEL_MATRIX[kr][kc];
                    const prod = aVal * wVal;
                    return (
                      <div
                        key={`p-${kr}-${kc}`}
                        className={`w-12 h-10 flex flex-col items-center justify-center rounded-md border text-[10px] font-mono ${
                          prod > 0
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <span>
                          {aVal}×{wVal}
                        </span>
                        <span className="text-xs font-bold">={prod}</span>
                      </div>
                    );
                  }),
                )}
              </div>
            </div>

            {/* Output Y (3x3) */}
            <div className="rounded-xl border border-slate-200 bg-[#FAFBFD] p-3 flex flex-col items-center">
              <div className="text-xs font-bold text-[#172A43] mb-1">
                Feature Map Y (3×3)
              </div>
              <div className="text-[11px] text-[#205089] font-semibold mb-2">
                Bấm vào ô bất kỳ để xem
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {OUTPUT_MATRIX.map((row, rIdx) =>
                  row.map((val, cIdx) => {
                    const isSelected = rIdx === outR && cIdx === outC;
                    return (
                      <button
                        type="button"
                        key={`y-${rIdx}-${cIdx}`}
                        onClick={() => setSelectedCell([rIdx, cIdx])}
                        className={`w-11 h-11 flex items-center justify-center rounded-lg text-sm font-mono font-bold border transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#205089] border-[#172A43] text-white shadow-sm ring-2 ring-[#B8C8DA]'
                            : 'bg-white border-slate-300 text-[#172A43] hover:bg-[#EEF5FC]'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#F4F8FC] border border-[#D5E2F0] px-4 py-2.5 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
            <span>
              Đang tính tại vị trí{' '}
              <strong className="text-[#172A43]">
                Y[{outR + 1}, {outC + 1}]
              </strong>{' '}
              (tâm <strong>x<sub>{centerR + 1},{centerC + 1}</sub></strong> trên ảnh X):
            </span>
            <span className="font-mono font-semibold text-[#205089]">
              Tổng 9 tích phần tử = {OUTPUT_MATRIX[outR][outC]}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FILTERS.map((f, idx) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFilterIdx(idx)}
                className={`rounded-xl p-2.5 text-left border transition ${
                  selectedFilterIdx === idx
                    ? 'bg-[#EEF5FC] border-[#205089] text-[#172A43] shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="text-xs font-bold">{f.name}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Input Digit 7 */}
            <div className="rounded-xl border border-slate-200 bg-[#FAFBFD] p-3 flex flex-col items-center">
              <div className="text-xs font-bold text-[#172A43] mb-2">
                Ảnh gốc Chữ số 7 (7×7)
              </div>
              <div className="grid grid-cols-7 gap-1">
                {DIGIT_7_GRID.map((row, r) =>
                  row.map((v, c) => (
                    <div
                      key={`d7-${r}-${c}`}
                      className={`w-6 h-6 flex items-center justify-center rounded-xs text-[10px] font-mono border ${
                        v === 1
                          ? 'bg-[#172A43] text-white border-[#172A43] font-bold'
                          : 'bg-white text-slate-300 border-slate-200'
                      }`}
                    >
                      {v}
                    </div>
                  )),
                )}
              </div>
            </div>

            {/* Selected 3x3 Filter */}
            <div className="rounded-xl border border-slate-200 bg-[#FAFBFD] p-3 flex flex-col items-center">
              <div className="text-xs font-bold text-[#172A43] mb-2">
                {activeFilter.name} (3×3)
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {activeFilter.weights.map((row, r) =>
                  row.map((v, c) => (
                    <div
                      key={`fw-${r}-${c}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-md text-xs font-mono font-bold border ${
                        v > 0
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : v < 0
                            ? 'bg-rose-50 border-rose-400 text-rose-800'
                            : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {v > 0 ? `+${v}` : v}
                    </div>
                  )),
                )}
              </div>
            </div>

            {/* Output Feature Map (5x5) */}
            <div className="rounded-xl border border-slate-200 bg-[#FAFBFD] p-3 flex flex-col items-center">
              <div className="text-xs font-bold text-[#172A43] mb-2">
                Feature Map Đầu ra (5×5)
              </div>
              <div className="grid grid-cols-5 gap-1">
                {filterResponse.map((row, r) =>
                  row.map((v, c) => (
                    <div
                      key={`fr-${r}-${c}`}
                      className={`w-8 h-8 flex items-center justify-center rounded-sm text-[11px] font-mono font-bold border ${
                        v >= 2
                          ? 'bg-[#205089] text-white border-[#172A43]'
                          : v === 1
                            ? 'bg-[#DCEBFA] text-[#205089] border-[#99B9DC]'
                            : v < 0
                              ? 'bg-rose-50 text-rose-600 border-rose-200'
                              : 'bg-white text-slate-300 border-slate-200'
                      }`}
                    >
                      {v}
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#F4F8FC] border border-[#D5E2F0] px-4 py-2.5 text-xs text-slate-700">
            <strong className="text-[#172A43]">{activeFilter.name}:</strong>{' '}
            {activeFilter.desc} Các ô màu xanh đậm (giá trị ≥ 2) chính là vị trí khớp mạnh nhất với bộ lọc.
          </div>
        </div>
      )}
    </div>
  );
}

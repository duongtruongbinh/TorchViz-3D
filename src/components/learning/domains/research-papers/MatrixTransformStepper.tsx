import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { InlineMath } from '../../math';

const INITIAL_GRID_12X12: number[][] = [
  [5, 2, 8, 1, 4, 0, 3, 7, 9, 2, 6, 1],
  [1, 9, 0, 7, 2, 5, 8, 1, 0, 4, 3, 7],
  [6, 4, 1, 3, 5, 2, 9, 0, 6, 8, 2, 5],
  [0, 3, 8, 0, 4, 7, 1, 6, 3, 9, 0, 4],
  [7, 5, 2, 6, 0, 7, 2, 4, 8, 1, 5, 2], // row 4: cols 4, 5, 6 = [0, 7, 2]
  [2, 8, 4, 0, 1, 3, 5, 9, 2, 6, 3, 8], // row 5: cols 4, 5, 6 = [1, 3, 5] (center cell is 3)
  [9, 1, 7, 3, 8, 0, 4, 0, 4, 5, 1, 9], // row 6: cols 4, 5, 6 = [8, 0, 4]
  [3, 6, 0, 9, 5, 4, 2, 8, 7, 0, 4, 6],
  [8, 0, 5, 2, 7, 1, 4, 3, 9, 6, 8, 0],
  [4, 7, 3, 8, 0, 9, 1, 5, 2, 7, 4, 3],
  [0, 2, 9, 5, 6, 8, 3, 1, 0, 4, 9, 2],
  [6, 3, 1, 4, 2, 0, 7, 9, 5, 8, 1, 6],
];

// Target center cell is at row 5, col 5 (0-indexed center of 12x12 grid) => number 3 -> 8
const TARGET_ROW = 5;
const TARGET_COL = 5;

// Grid after ONLY the target cell updates (other 143 cells stay 100% identical)
const SINGLE_CELL_UPDATED_GRID_12X12: number[][] = INITIAL_GRID_12X12.map((row, r) =>
  row.map((val, c) => (r === TARGET_ROW && c === TARGET_COL ? 8 : val))
);

// Grid after synchronous parallel NCA update: all 144 cells update simultaneously via f_θ
const PARALLEL_UPDATED_GRID_12X12: number[][] = [
  [2, 7, 3, 6, 1, 8, 0, 4, 5, 9, 1, 8],
  [8, 3, 6, 2, 9, 1, 4, 7, 5, 0, 8, 2],
  [3, 8, 7, 0, 2, 9, 4, 6, 1, 3, 7, 0],
  [7, 0, 2, 8, 1, 3, 7, 2, 8, 4, 6, 1],
  [4, 1, 9, 0, 4, 8, 8, 1, 3, 6, 0, 7],
  [6, 2, 0, 7, 6, 8, 2, 4, 7, 1, 8, 3], // target cell (5, 5) evolves from 3 to 8
  [1, 6, 3, 8, 7, 8, 9, 7, 1, 2, 6, 0],
  [8, 1, 7, 4, 0, 9, 6, 3, 2, 5, 1, 0],
  [1, 7, 2, 9, 3, 8, 0, 5, 4, 1, 2, 6],
  [9, 2, 8, 1, 6, 3, 7, 0, 8, 4, 9, 7],
  [5, 8, 4, 1, 2, 0, 7, 6, 3, 9, 1, 7],
  [2, 9, 5, 0, 8, 6, 1, 3, 0, 2, 7, 1],
];

// Pedagogical propagation sequence; this is not a sampled rollout from the paper.
const SEED_ROW = TARGET_ROW;
const SEED_COL = TARGET_COL;

const GROWTH_STAGES: number[][][] = [0, 1, 2, 3, 4, 5].map((radius) => {
  const baseGrid = radius === 5 ? PARALLEL_UPDATED_GRID_12X12 : INITIAL_GRID_12X12;
  return baseGrid.map((row, r) =>
    row.map((val, c) => {
      const dist = Math.max(Math.abs(r - SEED_ROW), Math.abs(c - SEED_COL));
      if (dist === 0) return radius === 0 ? 3 : 8;
      if (dist <= radius) return val;
      return 0; // Dormant cell (zero)
    })
  );
});


const PATCH_3X3 = [
  [0, 7, 2],
  [1, 3, 5],
  [8, 0, 4],
];

const FLATTENED_PATCH = [0, 7, 2, 1, 3, 5, 8, 0, 4];

const LOGITS_DATA = [
  { digit: 0, logit: -1.2, prob: 0.0 },
  { digit: 1, logit: 0.4, prob: 0.0 },
  { digit: 2, logit: -0.8, prob: 0.0 },
  { digit: 3, logit: 1.5, prob: 0.0 },
  { digit: 4, logit: -2.1, prob: 0.0 },
  { digit: 5, logit: 0.1, prob: 0.0 },
  { digit: 6, logit: -0.5, prob: 0.0 },
  { digit: 7, logit: 0.3, prob: 0.0 },
  { digit: 8, logit: 5.8, prob: 100.0 },
  { digit: 9, logit: -1.0, prob: 0.0 },
];

// Reusable component to render the global 12x12 grid with highlighted target and neighborhood
function GlobalGrid12x12({
  grid,
  targetRow = TARGET_ROW,
  targetCol = TARGET_COL,
  showNeighbors = true,
}: {
  grid: number[][];
  targetRow?: number;
  targetCol?: number;
  showNeighbors?: boolean;
}) {
  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="mb-2 text-xs font-bold text-[#475569]">
        Ma trận toàn cục <InlineMath formula="C^{(t)} \in \{0, \dots, 9\}^{12 \times 12}" />
      </div>
      <div className="grid grid-cols-12 gap-0.5 rounded-xl border border-[#B8C8DA]/70 bg-slate-100 p-2 shadow-inner sm:gap-1">
        {grid.map((row, rIdx) =>
          row.map((val, cIdx) => {
            const isCenter = rIdx === targetRow && cIdx === targetCol;
            const isNeighbor =
              showNeighbors &&
              Math.abs(rIdx - targetRow) <= 1 &&
              Math.abs(cIdx - targetCol) <= 1;

            return (
              <div
                key={`cell-${rIdx}-${cIdx}`}
                className={`flex size-5 items-center justify-center rounded font-mono text-[10px] transition-all sm:size-7 sm:text-xs ${
                  isCenter
                    ? 'scale-110 bg-[#205089] font-black text-white shadow-md ring-2 ring-[#205089]'
                    : isNeighbor
                    ? 'bg-[#DCE7F5] font-bold text-[#1E3A8A] ring-1 ring-[#205089]/50'
                    : 'bg-white/60 text-slate-400 opacity-40'
                }`}
              >
                {val}
              </div>
            );
          })
        )}
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-[#64748B]">
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded bg-[#205089]" /> Ô đích ({grid[targetRow][targetCol]})
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded bg-[#DCE7F5] border border-[#205089]/40" /> 8 ô láng giềng
        </span>
      </div>
    </div>
  );
}

export function MatrixTransformStepper({ ariaLabel = 'Mô phỏng từng bước biến đổi ma trận NCA' }: { ariaLabel?: string }) {
  const [step, setStep] = useState<number>(0);
  const [inspectedCell, setInspectedCell] = useState<{ r: number; c: number }>({
    r: TARGET_ROW,
    c: TARGET_COL,
  });
  const [growthT, setGrowthT] = useState<number>(0);

  const steps = [
    '1. Vùng quan sát 3x3',
    '2. Dàn phẳng (Flatten)',
    '3. Mạng nơ-ron chấm điểm',
    '4. Cập nhật cục bộ ô đích',
    '5. Áp dụng song song toàn bộ',
    '6. Minh họa lan truyền',
  ];

  // Auto-play the illustrative propagation sequence.
  useEffect(() => {
    if (step !== 5) {
      setGrowthT(0);
      return;
    }
    const timer = setTimeout(() => {
      setGrowthT((prev) => (prev >= 5 ? 0 : prev + 1));
    }, growthT === 5 ? 2500 : 1000);

    return () => clearTimeout(timer);
  }, [step, growthT]);

  // Reset inspectedCell to canonical target cell when leaving Step 5
  useEffect(() => {
    if (step !== 4) {
      setInspectedCell({ r: TARGET_ROW, c: TARGET_COL });
    }
  }, [step]);

  const handleReset = () => {
    setStep(0);
    setInspectedCell({ r: TARGET_ROW, c: TARGET_COL });
    setGrowthT(0);
  };

  const inspR = inspectedCell.r;
  const inspC = inspectedCell.c;
  const valBefore = INITIAL_GRID_12X12[inspR][inspC];
  const valAfter = PARALLEL_UPDATED_GRID_12X12[inspR][inspC];

  // Step 6 calculation
  const currentGrowthGrid = GROWTH_STAGES[growthT];
  const aliveCount = currentGrowthGrid.flat().filter((v) => v !== 0).length;
  const alivePercent = Math.round((aliveCount / 144) * 100);

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[#B8C8DA]/70 bg-white shadow-sm" aria-label={ariaLabel}>
      {/* Top Header & Step Navigation */}
      <div className="border-b border-[#B8C8DA]/60 bg-[#F8FAFC] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#205089] text-xs font-black text-white">
              {step + 1}/6
            </span>
            <h4 className="text-sm font-bold text-[#0F172A] sm:text-base">
              {steps[step]}
            </h4>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-[#B8C8DA]/80 bg-white px-3 py-1.5 text-xs font-semibold text-[#334155] shadow-xs transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
              Trước
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              disabled={step === 5}
              className="inline-flex items-center gap-1 rounded-lg bg-[#205089] px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-[#183F6C] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Tiếp
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              title="Khởi động lại"
              aria-label="Khởi động lại mô phỏng"
              className="rounded-lg border border-[#B8C8DA]/80 bg-white p-1.5 text-[#64748B] hover:text-[#0F172A]"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>

        {/* Step indicator pills */}
        <div className="mt-3 grid grid-cols-3 gap-1 sm:grid-cols-6 sm:gap-1.5">
          {steps.map((s, idx) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(idx)}
              className={`rounded-md py-1 text-center text-[10px] font-bold transition sm:text-xs ${
                step === idx
                  ? 'bg-[#205089] text-white shadow-xs'
                  : idx < step
                  ? 'bg-[#E2E8F0] text-[#334155] hover:bg-[#CBD5E1]'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
            >
              Bước {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-4 sm:p-6">
        {/* Steps 1, 2, 3: Ma trận 12x12 giữ nguyên liên tục bên trái, nội dung chi tiết biến đổi bên phải */}
        {step < 3 && (
          <div className="flex flex-col items-center justify-center gap-6 lg:flex-row lg:items-start lg:justify-around">
            {/* Ma trận 12x12 giữ nguyên */}
            <GlobalGrid12x12 grid={INITIAL_GRID_12X12} />

            {/* Cột chi tiết bên phải */}
            <div className="flex flex-1 flex-col items-center justify-center w-full max-w-md pt-2">
              {step === 0 && (
                <div className="flex flex-col items-center justify-center pt-2 md:pt-6">
                  <div className="rounded-xl border-2 border-dashed border-[#205089]/40 bg-[#EFF6FF] p-4 text-center shadow-2xs">
                    <div className="mb-2 text-xs font-bold text-[#1E3A8A]">
                      Cụm trích xuất <InlineMath formula="c_{\mathcal{N}(i)}^{(t)}" />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {PATCH_3X3.map((row, r) =>
                        row.map((val, c) => {
                          const isCenter = r === 1 && c === 1;
                          return (
                            <div
                              key={`patch-${r}-${c}`}
                              className={`flex size-10 items-center justify-center rounded-lg font-mono text-sm font-bold shadow-xs ${
                                isCenter
                                  ? 'bg-[#205089] text-white ring-2 ring-[#205089]'
                                  : 'border border-[#205089]/20 bg-white text-[#1E3A8A]'
                              }`}
                            >
                              {val}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <p className="mt-3 text-center text-xs text-[#64748B]">
                    Lấy mẫu cửa sổ trượt <InlineMath formula="3 \times 3" /> quanh ô đích (5, 5).
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-col items-center justify-center gap-3 w-full">
                  <div className="text-center text-xs font-semibold text-[#475569]">
                    Trải phẳng thành vector cột 9 chiều:
                  </div>

                  {/* Vertical Column Vector Box */}
                  <div className="rounded-xl border border-[#205089]/30 bg-[#EFF6FF] px-4 py-2.5 text-center shadow-2xs">
                    <div className="mb-2 text-xs font-bold text-[#1E3A8A]">
                      Vector <InlineMath formula="\mathbf{x}_{\text{patch}} \in \{0, \dots, 9\}^9" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      {FLATTENED_PATCH.map((val, idx) => (
                        <div
                          key={`flat-${idx}`}
                          className={`flex h-6 w-28 items-center justify-between rounded-md px-2.5 font-mono text-xs font-bold shadow-2xs ${
                            idx === 4
                              ? 'bg-[#205089] text-white ring-2 ring-[#205089]'
                              : 'border border-blue-200 bg-white text-[#1E3A8A]'
                          }`}
                        >
                          <span className="text-[9px] font-normal opacity-60">#{idx}</span>
                          <span className="text-sm font-bold">{val}</span>
                          <span className="text-[9px] font-normal opacity-60">
                            {idx === 4 ? '(tâm)' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 px-3 py-1.5 text-center text-xs text-[#64748B]">
                    Ô đích <span className="font-bold text-[#205089]">3</span> nằm ở chỉ số thứ 4 (trung tâm) của vector.
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col items-center justify-center gap-3 w-full">
                  <div className="text-center text-xs font-semibold text-[#475569]">
                    Vector 9D đi qua mạng nơ-ron <InlineMath formula="f_\theta" /> sinh ra vector logits 10 chiều:
                  </div>

                  {/* Flow: [ Vector 9D ] ---> [ f_θ ] ---> [ Vector Logits 10D ] */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 w-full">
                    {/* Input: Vector 9D from Step 2 */}
                    <div className="rounded-xl border border-[#205089]/30 bg-[#EFF6FF] px-2.5 py-2 text-center shadow-2xs shrink-0">
                      <div className="mb-1 text-[11px] font-bold text-[#1E3A8A]">
                        <InlineMath formula="\mathbf{x}_{\text{patch}}" />
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        {FLATTENED_PATCH.map((val, idx) => (
                          <div
                            key={`step3-flat-${idx}`}
                            className={`flex h-5 w-16 items-center justify-between rounded px-1.5 font-mono text-[11px] font-bold shadow-2xs ${
                              idx === 4
                                ? 'bg-[#205089] text-white ring-1 ring-[#205089]'
                                : 'border border-blue-200 bg-white text-[#1E3A8A]'
                            }`}
                          >
                            <span className="text-[8px] font-normal opacity-60">#{idx}</span>
                            <span>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mapping Arrow through f_θ */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <span className="font-mono text-xs font-black text-[#205089]">
                        <InlineMath formula="f_\theta" />
                      </span>
                      <ArrowRight className="size-5 text-[#205089]" />
                    </div>

                    {/* Output: Vector Logits 10D & Softmax chart */}
                    <div className="w-full max-w-[250px] sm:max-w-[270px] rounded-xl border border-[#B8C8DA]/70 bg-white p-2.5 shadow-xs shrink-0">
                      <div className="mb-1.5 flex items-center justify-between border-b border-slate-100 pb-1 text-[10px] font-bold text-[#475569]">
                        <span>Số</span>
                        <span>Logit</span>
                        <span>Softmax</span>
                      </div>

                      <div className="space-y-0.5">
                        {LOGITS_DATA.map((item) => {
                          const isWinner = item.digit === 8;
                          return (
                            <div
                              key={`logit-${item.digit}`}
                              className={`flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs transition ${
                                isWinner
                                  ? 'bg-[#ECFDF5] font-bold text-[#065F46] ring-1 ring-[#10B981]'
                                  : 'text-[#64748B]'
                              }`}
                            >
                              <span
                                className={`flex size-4 shrink-0 items-center justify-center rounded font-mono text-[10px] ${
                                  isWinner ? 'bg-[#059669] text-white font-bold' : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {item.digit}
                              </span>

                              <span className="w-8 font-mono text-right text-[10px]">
                                {item.logit > 0 ? `+${item.logit.toFixed(1)}` : item.logit.toFixed(1)}
                              </span>

                              {/* Bar graph */}
                              <div className="relative h-2.5 flex-1 overflow-hidden rounded bg-slate-100">
                                <div
                                  className={`h-full transition-all duration-500 ${
                                    isWinner ? 'bg-[#059669]' : 'bg-slate-300'
                                  }`}
                                  style={{ width: `${Math.max(item.prob, 2)}%` }}
                                />
                              </div>

                              <span className="w-8 text-right font-mono text-[10px] font-bold">
                                {item.prob > 0 ? `${item.prob.toFixed(0)}%` : '0%'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 text-center max-w-md pt-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-3 py-1 text-xs font-bold text-[#065F46] ring-1 ring-[#10B981]/40">
                      <Sparkles className="size-3.5" />
                      Số 8 đạt điểm logit cao nhất (+5.8) &rarr; Xác suất Softmax ~100%
                    </div>
                    <p className="text-[11px] text-[#475569] leading-relaxed">
                      Việc hàm <InlineMath formula="f_\theta" /> quyết định số nào có điểm cao nhất từ mẫu lân cận sẽ được tự động tối ưu qua quá trình <strong>huấn luyện (training)</strong> ở các phần sau.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Cập nhật cục bộ duy nhất ô đích (143 ô xung quanh giữ nguyên 100%) */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="text-center text-xs font-semibold text-[#475569] sm:text-sm">
              Giá trị tại ô đó thay đổi từ <span className="line-through text-rose-500 font-bold">3</span> sang <span className="text-[#059669] font-black text-sm">8</span>:
            </div>

            {/* Before vs After Grid Transition (Single Cell Update) */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {/* Before Grid */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-bold text-[#64748B]">
                  Trước: Bước t (Ô ({TARGET_ROW}, {TARGET_COL}) = {INITIAL_GRID_12X12[TARGET_ROW][TARGET_COL]})
                </span>
                <div className="grid grid-cols-12 gap-0.5 rounded-xl border border-slate-200 bg-slate-50 p-2 sm:gap-1">
                  {INITIAL_GRID_12X12.map((row, rIdx) =>
                    row.map((val, cIdx) => {
                      const isTarget = rIdx === TARGET_ROW && cIdx === TARGET_COL;
                      const isNeighbor =
                        Math.abs(rIdx - TARGET_ROW) <= 1 && Math.abs(cIdx - TARGET_COL) <= 1;

                      return (
                        <div
                          key={`before-${rIdx}-${cIdx}`}
                          className={`flex size-5 items-center justify-center rounded font-mono text-[10px] transition-all sm:size-6 sm:text-xs ${
                            isTarget
                              ? 'scale-110 bg-[#205089] font-black text-white shadow-md ring-2 ring-[#205089]'
                              : isNeighbor
                              ? 'bg-[#DCE7F5] font-bold text-[#1E3A8A] ring-1 ring-[#205089]/50'
                              : 'bg-white/60 text-slate-400 opacity-40'
                          }`}
                        >
                          {val}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <ArrowRight className="size-8 text-[#059669]" />
                <span className="text-xs font-black text-[#059669]">TIẾN HÓA</span>
              </div>

              {/* After Grid (Only Target Cell Changes) */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-bold text-[#065F46]">
                  Sau: Bước t+1 cục bộ (Ô ({TARGET_ROW}, {TARGET_COL}) = 8)
                </span>
                <div className="grid grid-cols-12 gap-0.5 rounded-xl border-2 border-[#10B981]/40 bg-[#F0FDF4] p-2 sm:gap-1">
                  {SINGLE_CELL_UPDATED_GRID_12X12.map((row, rIdx) =>
                    row.map((val, cIdx) => {
                      const isTarget = rIdx === TARGET_ROW && cIdx === TARGET_COL;
                      const isNeighbor =
                        Math.abs(rIdx - TARGET_ROW) <= 1 && Math.abs(cIdx - TARGET_COL) <= 1;

                      return (
                        <div
                          key={`after-single-${rIdx}-${cIdx}`}
                          className={`flex size-5 items-center justify-center rounded font-mono text-[10px] transition-all sm:size-6 sm:text-xs ${
                            isTarget
                              ? 'scale-125 bg-[#059669] font-black text-white shadow-lg ring-3 ring-[#10B981]/70'
                              : isNeighbor
                              ? 'bg-[#DCE7F5] font-bold text-[#1E3A8A] ring-1 ring-[#205089]/30'
                              : 'bg-white/60 text-slate-400 opacity-40'
                          }`}
                        >
                          {val}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Áp dụng song song toàn bộ 144 ô qua f_θ (NCA) */}
        {step === 4 && (
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="text-xs text-[#64748B]">
                Toàn bộ các ô có thể áp dụng song song (nhấn một ô bất kì)
              </div>
              <div className="text-xs font-semibold text-[#475569] sm:text-sm">
                Hàm <InlineMath formula="f" /> biến đổi giá trị từ{' '}
                <span className="line-through text-rose-500 font-bold">{valBefore}</span> sang{' '}
                <span className="text-[#059669] font-black text-sm">{valAfter}</span>:
              </div>
            </div>

            {/* Before vs After Grid Transition (Parallel Update) */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {/* Before Grid */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-bold text-[#64748B]">
                  Trước: Bước t (Ô ({inspR}, {inspC}) = {valBefore})
                </span>
                <div className="grid grid-cols-12 gap-0.5 rounded-xl border border-slate-200 bg-slate-50 p-2 sm:gap-1">
                  {INITIAL_GRID_12X12.map((row, rIdx) =>
                    row.map((val, cIdx) => {
                      const isInspected = rIdx === inspR && cIdx === inspC;
                      const isInspectedNeighbor =
                        Math.abs(rIdx - inspR) <= 1 && Math.abs(cIdx - inspC) <= 1;

                      return (
                        <button
                          key={`before-p-${rIdx}-${cIdx}`}
                          type="button"
                          onClick={() => setInspectedCell({ r: rIdx, c: cIdx })}
                          title={`Ô (${rIdx}, ${cIdx}) = ${val}. Nhấn để soi`}
                          className={`flex size-5 items-center justify-center rounded font-mono text-[10px] sm:size-6 sm:text-xs cursor-pointer transition-all ${
                            isInspected
                              ? 'scale-110 bg-[#205089] font-bold text-white shadow ring-2 ring-[#205089] z-20'
                              : isInspectedNeighbor
                              ? 'bg-[#DCE7F5] font-semibold text-[#1E3A8A] ring-1 ring-[#205089]/40 z-10'
                              : 'bg-white/80 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <ArrowRight className="size-8 text-[#059669]" />
                <span className="text-xs font-black text-[#059669]">SONG SONG</span>
              </div>

              {/* After Grid (All 144 cells updated simultaneously, inspected cell highlighted) */}
              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-bold text-[#065F46]">
                  Sau: Bước t+1 (Ô ({inspR}, {inspC}) = {valAfter})
                </span>
                <div className="grid grid-cols-12 gap-0.5 rounded-xl border-2 border-[#10B981]/40 bg-[#F0FDF4] p-2 sm:gap-1">
                  {PARALLEL_UPDATED_GRID_12X12.map((row, rIdx) =>
                    row.map((val, cIdx) => {
                      const isInspected = rIdx === inspR && cIdx === inspC;

                      return (
                        <button
                          key={`after-parallel-${rIdx}-${cIdx}`}
                          type="button"
                          onClick={() => setInspectedCell({ r: rIdx, c: cIdx })}
                          title={`Ô (${rIdx}, ${cIdx}) = ${val}. Nhấn để soi`}
                          className={`flex size-5 items-center justify-center rounded font-mono text-[10px] transition-all duration-200 sm:size-6 sm:text-xs cursor-pointer ${
                            isInspected
                              ? 'scale-125 bg-[#059669] font-black text-white shadow-lg ring-3 ring-[#10B981]/70 z-20'
                              : 'bg-white text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: pedagogical propagation illustration */}
        {step === 5 && (
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="text-center max-w-xl">
              <div className="text-xs font-semibold text-[#475569] sm:text-sm">
                <strong>Minh họa sư phạm, không phải rollout trong paper:</strong> vùng ảnh hưởng qua lân cận <InlineMath formula="3 \times 3" /> mở rộng dần để trực quan hóa cập nhật cục bộ qua nhiều bước.
              </div>
            </div>

            {/* 12x12 Growing Grid Display (Auto-running Loop) */}
            <div className="flex flex-col items-center">
              <div className="mb-2 flex items-center justify-between w-full max-w-xs text-xs">
                <span className="font-bold text-slate-700">
                  Bước thời gian: <span className="font-mono text-[#205089]">t = {growthT}</span>
                </span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {aliveCount} / 144 tế bào ({alivePercent}%)
                </span>
              </div>

              <div className="grid grid-cols-12 gap-0.5 rounded-2xl border-2 border-[#B8C8DA] bg-slate-100 p-2.5 shadow-md sm:gap-1">
                {currentGrowthGrid.map((row, rIdx) =>
                  row.map((val, cIdx) => {
                    const isZero = val === 0;
                    const isSeed = rIdx === SEED_ROW && cIdx === SEED_COL;
                    const dist = Math.max(Math.abs(rIdx - SEED_ROW), Math.abs(cIdx - SEED_COL));
                    const isWaveFront = dist === growthT && growthT > 0 && !isZero;

                    return (
                      <div
                        key={`growth-${rIdx}-${cIdx}`}
                        className={`flex size-5 items-center justify-center rounded font-mono text-[10px] sm:size-7 sm:text-xs transition-all duration-300 ${
                          isSeed
                            ? 'scale-110 bg-[#205089] font-black text-white shadow-md ring-2 ring-[#205089] z-10'
                            : isWaveFront
                            ? 'scale-105 bg-amber-100 font-black text-amber-900 ring-1 ring-amber-400 shadow-xs'
                            : !isZero
                            ? 'bg-[#ECFDF5] font-bold text-[#065F46] border border-[#10B981]/40'
                            : 'bg-slate-50 text-slate-300 border border-slate-200/40 opacity-40 font-normal'
                        }`}
                      >
                        {val}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

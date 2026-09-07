import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { InlineMath } from '../../math';
import { MatrixGrid } from './MatrixGrid';
import {
  CELL_COUNT,
  FLATTENED_PATCH,
  INITIAL_GRID,
  LOGITS_DATA,
  PARALLEL_UPDATED_GRID,
  PATCH_3X3,
  PROPAGATION_STAGES,
  SINGLE_CELL_UPDATED_GRID,
  STEP_LABELS,
  TARGET_CELL,
} from './matrixTransformData';

export function MatrixTransformStepper({ ariaLabel = 'Mô phỏng từng bước biến đổi ma trận NCA' }: { ariaLabel?: string }) {
  const [step, setStep] = useState<number>(0);
  const [inspectedCell, setInspectedCell] = useState<{ r: number; c: number }>({
    ...TARGET_CELL,
  });
  const [propagationStep, setPropagationStep] = useState(0);

  // Auto-play the illustrative propagation sequence.
  useEffect(() => {
    if (step !== 5) {
      setPropagationStep(0);
      return;
    }
    const timer = setTimeout(() => {
      setPropagationStep((current) => (current >= PROPAGATION_STAGES.length - 1 ? 0 : current + 1));
    }, propagationStep === PROPAGATION_STAGES.length - 1 ? 2500 : 1000);

    return () => clearTimeout(timer);
  }, [step, propagationStep]);

  // Reset inspectedCell to canonical target cell when leaving Step 5
  useEffect(() => {
    if (step !== 4) {
      setInspectedCell({ ...TARGET_CELL });
    }
  }, [step]);

  const handleReset = () => {
    setStep(0);
    setInspectedCell({ ...TARGET_CELL });
    setPropagationStep(0);
  };

  const inspR = inspectedCell.r;
  const inspC = inspectedCell.c;
  const valBefore = INITIAL_GRID[inspR][inspC];
  const valAfter = PARALLEL_UPDATED_GRID[inspR][inspC];

  const currentPropagationGrid = PROPAGATION_STAGES[propagationStep];
  const activeCellCount = currentPropagationGrid.flat().filter((value) => value !== 0).length;
  const activeCellPercent = Math.round((activeCellCount / CELL_COUNT) * 100);

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-[#B8C8DA]/70 bg-white shadow-sm" aria-label={ariaLabel}>
      {/* Top Header & Step Navigation */}
      <div className="border-b border-[#B8C8DA]/60 bg-[#F8FAFC] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[#205089] text-xs font-black text-white">
              {step + 1}/{STEP_LABELS.length}
            </span>
            <h4 className="text-sm font-bold text-[#0F172A] sm:text-base">
              {STEP_LABELS[step]}
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
              onClick={() => setStep((s) => Math.min(STEP_LABELS.length - 1, s + 1))}
              disabled={step === STEP_LABELS.length - 1}
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
          {STEP_LABELS.map((label, idx) => (
            <button
              key={label}
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
            <div className="flex shrink-0 flex-col items-center">
              <div className="mb-2 text-xs font-bold text-[#475569]">
                Ma trận toàn cục <InlineMath formula="C^{(t)} \in \{0, \dots, 9\}^{12 \times 12}" />
              </div>
              <MatrixGrid grid={INITIAL_GRID} focus={TARGET_CELL} variant="overview" showNeighborhood />
              <div className="mt-2 flex items-center gap-3 text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <span className="inline-block size-3 rounded bg-[#205089]" /> Ô đích ({INITIAL_GRID[TARGET_CELL.r][TARGET_CELL.c]})
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block size-3 rounded border border-[#205089]/40 bg-[#DCE7F5]" /> 8 ô láng giềng
                </span>
              </div>
            </div>

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
                                  style={{ width: `${Math.max(item.probability, 2)}%` }}
                                />
                              </div>

                              <span className="w-8 text-right font-mono text-[10px] font-bold">
                                {item.probability > 0 ? `${item.probability.toFixed(0)}%` : '0%'}
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

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-bold text-[#64748B]">
                  Trước: Bước t (Ô ({TARGET_CELL.r}, {TARGET_CELL.c}) = {INITIAL_GRID[TARGET_CELL.r][TARGET_CELL.c]})
                </span>
                <MatrixGrid grid={INITIAL_GRID} focus={TARGET_CELL} variant="before" showNeighborhood />
              </div>

              <div className="flex flex-col items-center">
                <ArrowRight className="size-8 text-[#059669]" />
                <span className="text-xs font-black text-[#059669]">TIẾN HÓA</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-bold text-[#065F46]">
                  Sau: Bước t+1 cục bộ (Ô ({TARGET_CELL.r}, {TARGET_CELL.c}) = 8)
                </span>
                <MatrixGrid grid={SINGLE_CELL_UPDATED_GRID} focus={TARGET_CELL} variant="after" showNeighborhood />
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

            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-bold text-[#64748B]">
                  Trước: Bước t (Ô ({inspR}, {inspC}) = {valBefore})
                </span>
                <MatrixGrid grid={INITIAL_GRID} focus={inspectedCell} variant="before" showNeighborhood onCellSelect={setInspectedCell} />
              </div>

              <div className="flex flex-col items-center">
                <ArrowRight className="size-8 text-[#059669]" />
                <span className="text-xs font-black text-[#059669]">SONG SONG</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="mb-2 text-xs font-bold text-[#065F46]">
                  Sau: Bước t+1 (Ô ({inspR}, {inspC}) = {valAfter})
                </span>
                <MatrixGrid grid={PARALLEL_UPDATED_GRID} focus={inspectedCell} variant="after" onCellSelect={setInspectedCell} />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col items-center justify-center gap-5">
            <div className="text-center max-w-xl">
              <div className="text-xs font-semibold text-[#475569] sm:text-sm">
                <strong>Minh họa sư phạm, không phải rollout trong paper:</strong> vùng ảnh hưởng qua lân cận <InlineMath formula="3 \times 3" /> mở rộng dần để trực quan hóa cập nhật cục bộ qua nhiều bước.
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-2 flex items-center justify-between w-full max-w-xs text-xs">
                <span className="font-bold text-slate-700">
                  Bước thời gian: <span className="font-mono text-[#205089]">t = {propagationStep}</span>
                </span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {activeCellCount} / {CELL_COUNT} tế bào ({activeCellPercent}%)
                </span>
              </div>

              <MatrixGrid grid={currentPropagationGrid} focus={TARGET_CELL} variant="propagation" waveRadius={propagationStep} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

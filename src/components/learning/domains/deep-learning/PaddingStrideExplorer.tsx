import { useState } from 'react';
import { DlCardShell, DlTabPillGroup } from './primitives';

export function PaddingStrideExplorer() {
  const [tab, setTab] = useState<'grid' | 'multi'>('grid');
  const [inputSize, setInputSize] = useState<5 | 7>(5);
  const [padding, setPadding] = useState<0 | 1>(1);
  const [stride, setStride] = useState<1 | 2 | 3>(1);
  const [stepIdx, setStepIdx] = useState(0);

  const kernelSize = 3;
  const paddedSize = inputSize + 2 * padding;
  const rawSteps = (paddedSize - kernelSize) / stride + 1;
  const isExactInteger = (paddedSize - kernelSize) % stride === 0;
  const outSize = Math.floor(rawSteps);

  const totalPositions = outSize * outSize;
  const safeStepIdx = stepIdx % Math.max(1, totalPositions);
  const winR = Math.floor(safeStepIdx / outSize) * stride;
  const winC = (safeStepIdx % outSize) * stride;

  return (
    <DlCardShell
      title="Mô phỏng Padding, Stride & Tích chập Đa Kênh (3D Tensor)"
      subtitle="Thay đổi Padding (p), Stride (s) để kiểm chứng công thức tính kích thước Feature Map."
      rightSlot={
        <DlTabPillGroup
          options={[
            { value: 'grid', label: '1. Padding & Stride trên Lưới 2D' },
            { value: 'multi', label: '2. Ảnh RGB 3 Kênh, Multi-Kernel & Conv 1×1' },
          ]}
          value={tab}
          onChange={setTab}
        />
      }
    >
      {tab === 'grid' ? (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl bg-[#EFF3F8]/60 border border-[#B8C8DA] p-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700">Kích thước N:</span>
              {([5, 7] as const).map((n) => (
                <button
                  key={`n-${n}`}
                  type="button"
                  onClick={() => {
                    setInputSize(n);
                    setStepIdx(0);
                  }}
                  className={`px-2.5 py-1 rounded-md font-mono font-bold border ${
                    inputSize === n
                      ? 'bg-[#205089] text-white border-[#172A43]'
                      : 'bg-white text-slate-700 border-[#B8C8DA]'
                  }`}
                >
                  {n}×{n}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700">Padding (p):</span>
              {([0, 1] as const).map((p) => (
                <button
                  key={`p-${p}`}
                  type="button"
                  onClick={() => {
                    setPadding(p);
                    setStepIdx(0);
                  }}
                  className={`px-2.5 py-1 rounded-md font-mono font-bold border ${
                    padding === p
                      ? 'bg-[#205089] text-white border-[#172A43]'
                      : 'bg-white text-slate-700 border-[#B8C8DA]'
                  }`}
                >
                  p={p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700">Stride (s):</span>
              {([1, 2, 3] as const).map((s) => (
                <button
                  key={`s-${s}`}
                  type="button"
                  onClick={() => {
                    setStride(s);
                    setStepIdx(0);
                  }}
                  className={`px-2.5 py-1 rounded-md font-mono font-bold border ${
                    stride === s
                      ? 'bg-[#205089] text-white border-[#172A43]'
                      : 'bg-white text-slate-700 border-[#B8C8DA]'
                  }`}
                >
                  s={s}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStepIdx((prev) => (prev + 1) % totalPositions)}
                className="rounded-lg bg-[#EFF3F8] border border-[#B8C8DA] px-3 py-1 font-semibold text-[#205089] hover:bg-[#B8C8DA]/40"
              >
                Trượt bước kế tiếp ({safeStepIdx + 1}/{totalPositions}) →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            {/* Padded Input Grid */}
            <div className="rounded-xl border border-[#B8C8DA] bg-[#EFF3F8]/40 p-4 flex flex-col items-center">
              <div className="text-xs font-bold text-[#172A43] mb-1">
                Ma trận sau khi Padding ({paddedSize}×{paddedSize})
              </div>
              <div className="text-[11px] text-slate-500 mb-3">
                Viền nét đứt = ô đệm 0 (Padding), khung cam = Kernel 3×3
              </div>
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `repeat(${paddedSize}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: paddedSize }).map((_, r) =>
                  Array.from({ length: paddedSize }).map((__, c) => {
                    const isPad =
                      r < padding ||
                      r >= padding + inputSize ||
                      c < padding ||
                      c >= padding + inputSize;
                    const inKernel =
                      r >= winR &&
                      r < winR + kernelSize &&
                      c >= winC &&
                      c < winC + kernelSize;
                    const isCenter = r === winR + 1 && c === winC + 1;
                    return (
                      <div
                        key={`cell-${r}-${c}`}
                        className={`w-7 h-7 flex items-center justify-center rounded-sm text-[10px] font-mono border transition ${
                          isCenter
                            ? 'bg-amber-300 border-amber-700 text-amber-950 font-bold ring-2 ring-amber-400'
                            : inKernel
                              ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold'
                              : isPad
                                ? 'bg-slate-100 border-dashed border-slate-300 text-slate-400'
                                : 'bg-white border-slate-300 text-slate-700'
                        }`}
                      >
                        {isPad ? '0' : '1'}
                      </div>
                    );
                  }),
                )}
              </div>
            </div>

            {/* Formula & Output Grid */}
            <div className="rounded-xl border border-[#B8C8DA] bg-[#EFF3F8]/40 p-4 flex flex-col items-center justify-between space-y-3">
              <div className="w-full rounded-lg bg-white border border-[#B8C8DA] p-3 text-xs space-y-1.5">
                <div className="font-bold text-[#172A43]">
                  Công thức tính kích thước Output (Kernel k = 3):
                </div>
                <div className="font-mono text-[#205089] font-semibold">
                  Out = (N - k + 2p) / s + 1 = ({inputSize} - 3 + 2×{padding}) / {stride} + 1 ={' '}
                  {rawSteps.toFixed(isExactInteger ? 0 : 2)}
                </div>
                {!isExactInteger ? (
                  <div className="text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-2.5 py-1.5 text-[11px]">
                    <strong>Cảnh báo bước nhảy lẻ ({rawSteps.toFixed(2)}):</strong> Do ({paddedSize} - 3) ={' '}
                    {paddedSize - 3} không chia hết cho stride = {stride}, cửa sổ trượt bị hụt ở cột/hàng
                    cuối! Trong thực tế cần chọn s, p sao cho phép chia chẵn (hoặc PyTorch sẽ tự cắt bỏ
                    phần dư lấy phần nguyên = {outSize}).
                  </div>
                ) : (
                  <div className="text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md px-2.5 py-1.5 text-[11px]">
                    Phép chia chẵn hoàn toàn: thu được ma trận kết quả Y kích thước{' '}
                    <strong>
                      {outSize}×{outSize}
                    </strong>
                    .
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-[#172A43] mb-2">
                  Ma trận Output Y ({outSize}×{outSize}) — Bấm chọn ô
                </div>
                <div
                  className="grid gap-1.5"
                  style={{
                    gridTemplateColumns: `repeat(${outSize}, minmax(0, 1fr))`,
                  }}
                >
                  {Array.from({ length: totalPositions }).map((_, idx) => {
                    const active = idx === safeStepIdx;
                    return (
                      <button
                        key={`out-${idx}`}
                        type="button"
                        onClick={() => setStepIdx(idx)}
                        className={`w-8 h-8 rounded-md font-mono text-xs font-bold border transition cursor-pointer ${
                          active
                            ? 'bg-[#205089] text-white border-[#172A43] ring-2 ring-[#B8C8DA]'
                            : 'bg-white text-[#172A43] border-[#B8C8DA] hover:bg-[#EFF3F8]'
                        }`}
                      >
                        •
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <svg
            viewBox="0 0 760 250"
            className="w-full h-auto rounded-xl border border-[#B8C8DA] bg-[#EFF3F8]/40"
            role="img"
            aria-label="Sơ đồ tích chập 3D trên ảnh RGB 3 kênh và Point-wise Conv 1x1"
          >
            {/* Left: Multi-channel RGB + 6 filters */}
            <text x="20" y="26" fill="#172A43" fontSize="13" fontWeight="bold">
              A. Ảnh màu RGB (32×32×3) đi qua 6 Bộ lọc (5×5×3) → 6 Feature Maps (28×28×6)
            </text>

            {/* RGB 32x32x3 stack */}
            <rect x="28" y="60" width="64" height="64" rx="4" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.5" />
            <rect x="38" y="70" width="64" height="64" rx="4" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
            <rect x="48" y="80" width="64" height="64" rx="4" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" />
            <text x="80" y="164" textAnchor="middle" fill="#172A43" fontSize="11" fontWeight="bold">
              Input: 32×32×3
            </text>
            <text x="80" y="179" textAnchor="middle" fill="#64748B" fontSize="10">
              (3 kênh R, G, B)
            </text>

            <text x="135" y="112" textAnchor="middle" fill="#205089" fontSize="18" fontWeight="bold">
              ⊗
            </text>

            {/* 6 filters of 5x5x3 */}
            <rect x="160" y="55" width="95" height="92" rx="8" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
            <text x="207" y="76" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="bold">
              6 Filters
            </text>
            <text x="207" y="95" textAnchor="middle" fill="#172A43" fontSize="11" fontFamily="monospace">
              Mỗi filter: 5×5×3
            </text>
            <text x="207" y="113" textAnchor="middle" fill="#64748B" fontSize="10">
              Độ sâu filter = 3
            </text>
            <text x="207" y="128" textAnchor="middle" fill="#64748B" fontSize="10">
              khớp với 3 kênh RGB
            </text>

            <text x="276" y="112" textAnchor="middle" fill="#205089" fontSize="16" fontWeight="bold">
              →
            </text>

            {/* Output stack 28x28x6 */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={`fm-${i}`}
                x={295 + i * 8}
                y={52 + i * 6}
                width="54"
                height="54"
                rx="4"
                fill={i === 5 ? '#B8C8DA' : '#EFF3F8'}
                stroke="#205089"
                strokeWidth="1.4"
              />
            ))}
            <text x="345" y="164" textAnchor="middle" fill="#172A43" fontSize="11" fontWeight="bold">
              Output: 28×28×6
            </text>
            <text x="345" y="179" textAnchor="middle" fill="#64748B" fontSize="10">
              (6 Feature Maps xếp chồng)
            </text>

            {/* Divider */}
            <line x1="425" y1="18" x2="425" y2="232" stroke="#CBD5E1" strokeDasharray="4 4" />

            {/* Right: 1x1 Convolution */}
            <text x="445" y="26" fill="#172A43" fontSize="13" fontWeight="bold">
              B. Tích chập 1×1 (Point-wise Conv): Đổi độ sâu
            </text>

            <rect x="450" y="65" width="76" height="76" rx="6" fill="#EFF3F8" stroke="#205089" strokeWidth="1.5" />
            <text x="488" y="98" textAnchor="middle" fill="#172A43" fontSize="11" fontWeight="bold">
              H × W × 192
            </text>
            <text x="488" y="115" textAnchor="middle" fill="#64748B" fontSize="10">
              (192 channels)
            </text>

            <text x="546" y="106" textAnchor="middle" fill="#D97706" fontSize="14" fontWeight="bold">
              ⊗
            </text>

            <rect x="565" y="72" width="78" height="62" rx="6" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <text x="604" y="96" textAnchor="middle" fill="#92400E" fontSize="11" fontWeight="bold">
              16 Filters
            </text>
            <text x="604" y="113" textAnchor="middle" fill="#172A43" fontSize="10" fontFamily="monospace">
              1×1×192
            </text>

            <text x="658" y="106" textAnchor="middle" fill="#205089" fontSize="15" fontWeight="bold">
              →
            </text>

            <rect x="674" y="65" width="68" height="76" rx="6" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.5" />
            <text x="708" y="98" textAnchor="middle" fill="#14532D" fontSize="11" fontWeight="bold">
              H × W × 16
            </text>
            <text x="708" y="115" textAnchor="middle" fill="#166534" fontSize="10">
              (Nén 12× kênh!)
            </text>

            <text x="595" y="172" textAnchor="middle" fill="#334155" fontSize="11">
              Giữ nguyên (H, W), chỉ trộn tuyến tính xuyên kênh để giảm/tăng chiều sâu cực nhanh.
            </text>

            {/* Bottom Summary Banner */}
            <rect x="20" y="198" width="720" height="36" rx="6" fill="#EFF3F8" stroke="#B8C8DA" />
            <text x="380" y="220" textAnchor="middle" fill="#205089" fontSize="11.5" fontWeight="600">
              Quy tắc cốt lõi: Số kênh của mỗi Kernel luôn bằng số kênh Input (C_in); Số lượng Kernel quyết định số kênh Output (C_out).
            </text>
          </svg>
        </div>
      )}
    </DlCardShell>
  );
}

import { useState } from 'react';
import { DlCardShell, DlTabPillGroup } from './primitives';

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

const MODEL_1_ROWS = [
  {
    layer: 'Input Image',
    config: 'RGB 3 kênh',
    shape: '32 × 32 × 3',
    formula: '0 (Không có trọng số)',
    params: 0,
  },
  {
    layer: 'First_CNN_Layer (Conv2D)',
    config: '32 filters (3×3), pad=same',
    shape: '32 × 32 × 32',
    formula: '(3 × 3 × 3 + 1_bias) × 32',
    params: 896,
  },
  {
    layer: 'First_MaxPool_Layer',
    config: 'Pool 2×2, stride=2',
    shape: '16 × 16 × 32',
    formula: '0 (Chỉ lấy max trong vùng 2×2)',
    params: 0,
  },
  {
    layer: 'Second_CNN_Layer (Conv2D)',
    config: '64 filters (3×3), pad=same',
    shape: '16 × 16 × 64',
    formula: '(3 × 3 × 32 + 1_bias) × 64',
    params: 18496,
  },
  {
    layer: 'Second_MaxPool_Layer',
    config: 'Pool 2×2, stride=2',
    shape: '8 × 8 × 64',
    formula: '0',
    params: 0,
  },
  {
    layer: 'Third_CNN_Layer (Conv2D)',
    config: '128 filters (3×3), pad=same',
    shape: '8 × 8 × 128',
    formula: '(3 × 3 × 64 + 1_bias) × 128',
    params: 73856,
  },
  {
    layer: 'Third_MaxPool_Layer',
    config: 'Pool 2×2, stride=2',
    shape: '4 × 4 × 128',
    formula: '0',
    params: 0,
  },
  {
    layer: 'Flatten',
    config: 'Trải phẳng 4×4×128',
    shape: '2048',
    formula: '0',
    params: 0,
  },
  {
    layer: 'First_Dense_Layer (FC)',
    config: '64 neurons, ReLU',
    shape: '64',
    formula: '(2048 + 1_bias) × 64',
    params: 131136,
  },
  {
    layer: 'Second_Dense_Layer (FC)',
    config: '10 classes, Softmax',
    shape: '10',
    formula: '(64 + 1_bias) × 10',
    params: 650,
  },
];

const MODEL_2_ROWS = [
  {
    layer: 'Input Image',
    config: 'Ảnh xám 1 kênh',
    shape: '28 × 28 × 1',
    formula: '0',
    params: 0,
  },
  {
    layer: 'Conv2D (dilation_rate=2)',
    config: '32 filters (3×3), d=2 → k_eff=5, pad=0',
    shape: '24 × 24 × 32',
    formula: '(3 × 3 × 1 + 1_bias) × 32',
    params: 320,
  },
  {
    layer: 'BatchNormalization',
    config: 'Chuẩn hóa 32 kênh (γ, β, μ, σ²)',
    shape: '24 × 24 × 32',
    formula: '32 × 4',
    params: 128,
  },
  {
    layer: 'Dropout(0.3) + MaxPool(2×2)',
    config: 'Giảm nửa kích thước không gian',
    shape: '12 × 12 × 32',
    formula: '0',
    params: 0,
  },
  {
    layer: 'Conv2D (Point-wise 1×1)',
    config: '64 filters (1×1), pad=0',
    shape: '12 × 12 × 64',
    formula: '(1 × 1 × 32 + 1_bias) × 64',
    params: 2112,
  },
  {
    layer: 'BatchNormalization + Dropout',
    config: 'Chuẩn hóa 64 kênh',
    shape: '12 × 12 × 64',
    formula: '64 × 4',
    params: 256,
  },
  {
    layer: 'Conv2D (3×3)',
    config: '32 filters (3×3), pad=0',
    shape: '10 × 10 × 32',
    formula: '(3 × 3 × 64 + 1_bias) × 32',
    params: 18464,
  },
  {
    layer: 'Conv2D (Point-wise 1×1)',
    config: '1 filter (1×1), nén 32 → 1 kênh',
    shape: '10 × 10 × 1',
    formula: '(1 × 1 × 32 + 1_bias) × 1',
    params: 33,
  },
  {
    layer: 'Flatten + Dense(10)',
    config: '100 → 10 classes (Softmax)',
    shape: '10',
    formula: '(100 + 1_bias) × 10',
    params: 1010,
  },
];

export function PoolingAndParamsExplorer() {
  const [tab, setTab] = useState<'pooling' | 'params'>('pooling');
  const [modelIdx, setModelIdx] = useState<1 | 2>(1);

  const rows = modelIdx === 1 ? MODEL_1_ROWS : MODEL_2_ROWS;
  const totalParams = rows.reduce((acc, r) => acc + r.params, 0);

  return (
    <DlCardShell
      title="So sánh Max / Average / Global Pooling & Bảng Giải phẫu Tham số CNN"
      subtitle="Kiểm chứng vì sao Pooling tốn 0 tham số và cách tính tay chính xác từng tầng mạng."
      rightSlot={
        <DlTabPillGroup
          options={[
            { value: 'pooling', label: '1. Max vs Avg vs Global Pooling' },
            { value: 'params', label: '2. Giải phẫu & Đếm Tham số (2 Models)' },
          ]}
          value={tab}
          onChange={setTab}
        />
      }
    >
      {tab === 'pooling' ? (
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
                  const isMax =
                    (qIdx === 0 && val === 6) ||
                    (qIdx === 1 && val === 8) ||
                    (qIdx === 2 && val === 3) ||
                    (qIdx === 3 && val === 4);
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
              {[
                [6, 0],
                [8, 1],
                [3, 2],
                [4, 3],
              ].map(([val, qIdx]) => (
                <div
                  key={`mp-${qIdx}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg text-sm font-mono font-extrabold border ${QUADRANT_STYLES[qIdx]}`}
                >
                  {val}
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
              {[
                ['3.25', 0],
                ['5.25', 1],
                ['2.00', 2],
                ['2.00', 3],
              ].map(([val, qIdx]) => (
                <div
                  key={`ap-${qIdx}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg text-xs font-mono font-bold border ${QUADRANT_STYLES[Number(qIdx)]}`}
                >
                  {val}
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
              3.125
            </div>
            <span className="mt-2 text-[11px] text-center text-slate-600">
              Nếu có 64 kênh → trả về vector 64 chiều (thay thế FC lớn, 0 params).
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setModelIdx(1)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition ${
                  modelIdx === 1
                    ? 'bg-[#205089] text-white border-[#172A43]'
                    : 'bg-white text-slate-700 border-[#B8C8DA] hover:bg-[#EFF3F8]/60'
                }`}
              >
                Bài tập 1: CNN 3 tầng + Same Padding (225,034 params)
              </button>
              <button
                type="button"
                onClick={() => setModelIdx(2)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition ${
                  modelIdx === 2
                    ? 'bg-[#205089] text-white border-[#172A43]'
                    : 'bg-white text-slate-700 border-[#B8C8DA] hover:bg-[#EFF3F8]/60'
                }`}
              >
                Bài tập 2: Dilation=2 + BatchNorm + Conv 1×1 (22,323 params)
              </button>
            </div>
            <div className="text-xs font-mono font-bold text-[#205089] bg-[#EFF3F8] border border-[#B8C8DA] px-3 py-1 rounded-lg">
              Tổng Params: {totalParams.toLocaleString()}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#B8C8DA]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#EFF3F8] text-[#172A43] border-b border-[#B8C8DA]">
                  <th className="py-2 px-3 font-bold">Tầng (Layer)</th>
                  <th className="py-2 px-3 font-bold">Cấu hình</th>
                  <th className="py-2 px-3 font-bold">Output Shape</th>
                  <th className="py-2 px-3 font-bold">Công thức tính Params</th>
                  <th className="py-2 px-3 font-bold text-right">Params #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.map((r) => (
                  <tr key={r.layer} className="hover:bg-[#EFF3F8]/40">
                    <td className="py-2 px-3 font-semibold text-[#172A43]">{r.layer}</td>
                    <td className="py-2 px-3 text-slate-600">{r.config}</td>
                    <td className="py-2 px-3 font-mono text-[#205089] font-semibold">{r.shape}</td>
                    <td className="py-2 px-3 font-mono text-slate-700">{r.formula}</td>
                    <td className="py-2 px-3 font-mono font-bold text-right text-[#172A43]">
                      {r.params.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DlCardShell>
  );
}

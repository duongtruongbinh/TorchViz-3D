import { DlCardShell } from './primitives';

export function InceptionBottleneckDiagram() {
  return (
    <DlCardShell
      title="Bài toán Nút cổ chai (1×1 Bottleneck) trong Inception & ResNet: Giảm ~10 lần Phép tính"
      subtitle="Đối chiếu số phép nhân khi áp dụng trực tiếp Conv 5×5 so với việc dùng Conv 1×1 nén số kênh trước."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Naive 5x5 Conv */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900">
              1. Trực tiếp Conv 5×5 (Không có 1×1 Bottleneck)
            </span>
            <span className="rounded-md bg-rose-100 border border-rose-300 px-2 py-0.5 text-[11px] font-mono font-bold text-rose-800">
              120.42M Ops
            </span>
          </div>
          <svg viewBox="0 0 360 95" className="w-full h-auto" role="img" aria-label="Tích chập 5x5 trực tiếp tốn 120.4M phép tính">
            <rect x="8" y="18" width="94" height="54" rx="6" fill="#EFF3F8" stroke="#205089" strokeWidth="1.5" />
            <text x="55" y="42" textAnchor="middle" fill="#172A43" fontSize="10.5" fontWeight="bold">
              Input Tensor
            </text>
            <text x="55" y="58" textAnchor="middle" fill="#205089" fontSize="10" fontFamily="monospace">
              28 × 28 × 192
            </text>

            <line x1="104" y1="45" x2="232" y2="45" stroke="#BE123C" strokeWidth="2" />
            <rect x="122" y="24" width="96" height="42" rx="6" fill="#FFE4E6" stroke="#BE123C" strokeWidth="1.5" />
            <text x="170" y="42" textAnchor="middle" fill="#881337" fontSize="10.5" fontWeight="bold">
              32 Filters 5×5
            </text>
            <text x="170" y="56" textAnchor="middle" fill="#9F1239" fontSize="9.5" fontFamily="monospace">
              (5×5×192) × 32
            </text>

            <rect x="236" y="18" width="114" height="54" rx="6" fill="#EFF3F8" stroke="#205089" strokeWidth="1.5" />
            <text x="293" y="42" textAnchor="middle" fill="#172A43" fontSize="10.5" fontWeight="bold">
              Output Feature Map
            </text>
            <text x="293" y="58" textAnchor="middle" fill="#205089" fontSize="10" fontFamily="monospace">
              28 × 28 × 32
            </text>
          </svg>
          <div className="text-[11px] font-mono text-rose-900 bg-white/80 rounded-lg p-2 border border-rose-200">
            Số phép nhân = (28 × 28 × 32) × (5 × 5 × 192) = <strong>120,422,400</strong>
          </div>
        </div>

        {/* 1x1 Bottleneck + 5x5 Conv */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">
              2. Chèn Conv 1×1 giảm chiều trước khi Conv 5×5
            </span>
            <span className="rounded-md bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-800">
              12.44M Ops (Giảm ~9.7×)
            </span>
          </div>
          <svg viewBox="0 0 360 95" className="w-full h-auto" role="img" aria-label="Nén bằng Conv 1x1 trước Conv 5x5 chỉ tốn 12.4M phép tính">
            <rect x="4" y="18" width="76" height="54" rx="6" fill="#EFF3F8" stroke="#205089" strokeWidth="1.5" />
            <text x="42" y="42" textAnchor="middle" fill="#172A43" fontSize="9.5" fontWeight="bold">
              Input
            </text>
            <text x="42" y="56" textAnchor="middle" fill="#205089" fontSize="9" fontFamily="monospace">
              28×28×192
            </text>

            <rect x="90" y="25" width="66" height="40" rx="5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.4" />
            <text x="123" y="42" textAnchor="middle" fill="#92400E" fontSize="9.5" fontWeight="bold">
              Conv 1×1
            </text>
            <text x="123" y="55" textAnchor="middle" fill="#78350F" fontSize="8.5" fontFamily="monospace">
              16 kênh (2.4M)
            </text>

            <rect x="166" y="22" width="68" height="46" rx="5" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1.4" />
            <text x="200" y="42" textAnchor="middle" fill="#14532D" fontSize="9.5" fontWeight="bold">
              Bottleneck
            </text>
            <text x="200" y="55" textAnchor="middle" fill="#166534" fontSize="9" fontFamily="monospace">
              28×28×16
            </text>

            <rect x="244" y="25" width="52" height="40" rx="5" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.4" />
            <text x="270" y="42" textAnchor="middle" fill="#1E3A8A" fontSize="9" fontWeight="bold">
              Conv 5×5
            </text>
            <text x="270" y="55" textAnchor="middle" fill="#1E40AF" fontSize="8.5" fontFamily="monospace">
              (10.0M)
            </text>

            <rect x="304" y="18" width="52" height="54" rx="6" fill="#EFF3F8" stroke="#205089" strokeWidth="1.5" />
            <text x="330" y="42" textAnchor="middle" fill="#172A43" fontSize="9.5" fontWeight="bold">
              Output
            </text>
            <text x="330" y="56" textAnchor="middle" fill="#205089" fontSize="8.5" fontFamily="monospace">
              28×28×32
            </text>
          </svg>
          <div className="text-[11px] font-mono text-emerald-950 bg-white/80 rounded-lg p-2 border border-emerald-200">
            Bước 1 (1×1): 2.41M + Bước 2 (5×5): 10.04M = <strong>12,443,648</strong> phép nhân!
          </div>
        </div>
      </div>
    </DlCardShell>
  );
}

export function UnetSkipConnectionDiagram() {
  return (
    <DlCardShell
      title="Cơ chế Kết hợp Đặc trưng qua Skip Connection trong U-Net (Where + What)"
      subtitle="Mỗi khối Encoder gửi bản sao độ phân giải cao sang khối Decoder đối xứng để khôi phục ranh giới từng pixel."
    >
      <svg
        viewBox="0 0 760 225"
        className="w-full h-auto rounded-xl border border-[#B8C8DA] bg-[#EFF3F8]/40"
        role="img"
        aria-label="Sơ đồ kết hợp đặc trưng biên sắc nét từ Encoder và đặc trưng ngữ nghĩa từ Decoder qua Skip Connection của U-Net"
      >
        {/* Panel 1: Encoder Features */}
        <rect x="18" y="18" width="215" height="188" rx="10" fill="#FFFFFF" stroke="#B8C8DA" strokeWidth="1.5" />
        <rect x="18" y="18" width="215" height="32" rx="10" fill="#EFF3F8" />
        <text x="125" y="39" textAnchor="middle" fill="#172A43" fontSize="12" fontWeight="bold">
          1. Đặc trưng Encoder (Tầng nông)
        </text>
        <text x="125" y="64" textAnchor="middle" fill="#205089" fontSize="10.5" fontWeight="600">
          Độ phân giải cao — Biết chính xác &quot;Ở đâu&quot;
        </text>

        {/* Crisp Bicycle Outline */}
        <circle cx="92" cy="136" r="22" fill="none" stroke="#172A43" strokeWidth="2.5" />
        <circle cx="158" cy="136" r="22" fill="none" stroke="#172A43" strokeWidth="2.5" />
        <polyline
          points="92,136 114,104 148,104 122,136 92,136"
          fill="none"
          stroke="#172A43"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <line x1="148" y1="104" x2="158" y2="136" stroke="#172A43" strokeWidth="2.5" />
        <line x1="142" y1="94" x2="154" y2="94" stroke="#172A43" strokeWidth="2.5" />
        <line x1="108" y1="96" x2="120" y2="96" stroke="#172A43" strokeWidth="2.5" />
        <text x="125" y="186" textAnchor="middle" fill="#475569" fontSize="10">
          Giữ nguyên viền &amp; tọa độ cạnh sắc nét
        </text>

        {/* Plus sign */}
        <circle cx="256" cy="112" r="14" fill="#EFF3F8" stroke="#205089" strokeWidth="1.5" />
        <text x="256" y="117" textAnchor="middle" fill="#205089" fontSize="16" fontWeight="bold">
          +
        </text>

        {/* Panel 2: Decoder Features */}
        <rect x="278" y="18" width="215" height="188" rx="10" fill="#FFFFFF" stroke="#FDE68A" strokeWidth="1.5" />
        <rect x="278" y="18" width="215" height="32" rx="10" fill="#FEF3C7" />
        <text x="385" y="39" textAnchor="middle" fill="#78350F" fontSize="12" fontWeight="bold">
          2. Đặc trưng Decoder (Tầng sâu)
        </text>
        <text x="385" y="64" textAnchor="middle" fill="#92400E" fontSize="10.5" fontWeight="600">
          Trường nhìn rộng — Biết &quot;Vùng này là Xe đạp&quot;
        </text>

        {/* Coarse Semantic Region */}
        <rect x="322" y="84" width="126" height="82" rx="18" fill="#FDE68A" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 3" />
        <text x="385" y="129" textAnchor="middle" fill="#92400E" fontSize="11.5" fontWeight="bold">
          Vùng lớp &quot;Bicycle&quot;
        </text>
        <text x="385" y="186" textAnchor="middle" fill="#475569" fontSize="10">
          Giàu ngữ nghĩa nhưng mất ranh giới chi tiết
        </text>

        {/* Arrow Concat */}
        <text x="515" y="102" textAnchor="middle" fill="#16A34A" fontSize="9.5" fontWeight="bold">
          Concat
        </text>
        <text x="515" y="120" textAnchor="middle" fill="#16A34A" fontSize="18" fontWeight="bold">
          →
        </text>

        {/* Panel 3: Combined Segmentation Mask */}
        <rect x="536" y="18" width="206" height="188" rx="10" fill="#FFFFFF" stroke="#86EFAC" strokeWidth="1.5" />
        <rect x="536" y="18" width="206" height="32" rx="10" fill="#DCFCE7" />
        <text x="639" y="39" textAnchor="middle" fill="#14532D" fontSize="12" fontWeight="bold">
          3. Kết hợp qua Skip Connection
        </text>
        <text x="639" y="64" textAnchor="middle" fill="#166534" fontSize="10.5" fontWeight="600">
          Phân đoạn chính xác tới từng Pixel
        </text>

        {/* Filled & Crisp Segmented Bicycle */}
        <rect x="572" y="82" width="134" height="84" rx="10" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
        <circle cx="606" cy="136" r="22" fill="#FDE047" stroke="#15803D" strokeWidth="2.8" />
        <circle cx="672" cy="136" r="22" fill="#FDE047" stroke="#15803D" strokeWidth="2.8" />
        <polygon
          points="606,136 628,104 662,104 636,136"
          fill="#FDE047"
          stroke="#15803D"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <line x1="662" y1="104" x2="672" y2="136" stroke="#15803D" strokeWidth="2.8" />
        <text x="639" y="186" textAnchor="middle" fill="#14532D" fontSize="10" fontWeight="600">
          Đúng nhãn ngữ nghĩa + sắc nét đường biên
        </text>
      </svg>
    </DlCardShell>
  );
}

import { useRef, useState } from 'react';
import { InlineMath, MdxPre } from '../../learningMdxComponents';

const BLUE = '#205089';
const ROSE = '#C2415A';
const SLATE = '#64748B';

export function LossFunctionDiagram({
  panel = 'explorer',
}: {
  panel?: 'pipeline' | 'explorer';
}) {
  if (panel === 'pipeline') {
    return <ForwardToLossPipeline />;
  }
  return <LossFunctionExplorer />;
}

function ForwardToLossPipeline() {
  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 720 176"
        className="mx-auto w-full max-w-[720px]"
        role="img"
        aria-label="Luồng từ Forward Pass tạo dự đoán y_hat, so sánh với nhãn thật y qua Loss Function L để tạo tín hiệu cập nhật trọng số"
      >
        <defs>
          <marker
            id="loss-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill={BLUE} />
          </marker>
          <marker
            id="loss-arrow-rose"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill={ROSE} />
          </marker>
        </defs>

        {/* Input x */}
        <rect x="18" y="42" width="106" height="56" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="71" y="64" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#475569">
          ĐẦU VÀO
        </text>
        <foreignObject x="24" y="70" width="94" height="22">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#172A43]">
            <InlineMath formula="\mathbf{x},\ \mathbf{y}_{\text{true}}" />
          </div>
        </foreignObject>

        <line x1="130" y1="70" x2="164" y2="70" stroke={BLUE} strokeWidth="2" markerEnd="url(#loss-arrow)" />

        {/* Model Forward Pass */}
        <rect x="172" y="42" width="154" height="56" rx="10" fill="#EFF3F8" stroke={BLUE} strokeWidth="1.8" />
        <text x="249" y="64" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BLUE}>
          FORWARD PASS
        </text>
        <foreignObject x="180" y="70" width="138" height="22">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#172A43]">
            <InlineMath formula="f_{\mathbf{W}}(\mathbf{x}) \to \hat{\mathbf{y}}" />
          </div>
        </foreignObject>

        <line x1="332" y1="70" x2="366" y2="70" stroke={BLUE} strokeWidth="2" markerEnd="url(#loss-arrow)" />

        {/* Loss Function */}
        <rect x="374" y="34" width="176" height="72" rx="12" fill="#FFFFFF" stroke={ROSE} strokeWidth="2" />
        <text x="462" y="56" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={ROSE}>
          LOSS FUNCTION
        </text>
        <foreignObject x="382" y="62" width="160" height="34">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#172A43]">
            <InlineMath formula="\mathcal{L}(\hat{\mathbf{y}}, \mathbf{y}_{\text{true}}) \in \mathbb{R}" />
          </div>
        </foreignObject>

        <line x1="556" y1="70" x2="590" y2="70" stroke={ROSE} strokeWidth="2" markerEnd="url(#loss-arrow-rose)" />

        {/* Scalar Signal -> Backprop */}
        <rect x="598" y="42" width="106" height="56" rx="10" fill="#FFF1F2" stroke={ROSE} strokeWidth="1.5" />
        <text x="651" y="63" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={ROSE}>
          MỤC TIÊU
        </text>
        <foreignObject x="604" y="70" width="94" height="22">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#881337]">
            <InlineMath formula="\min_{\mathbf{W}} \mathcal{L}" />
          </div>
        </foreignObject>

        {/* Backward feedback arc */}
        <path
          d="M 462 112 L 462 146 L 249 146 L 249 106"
          fill="none"
          stroke={ROSE}
          strokeWidth="1.8"
          strokeDasharray="4 3"
          markerEnd="url(#loss-arrow-rose)"
        />
        <text x="355" y="164" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={ROSE}>
          Backpropagation dùng ∇ℒ để cập nhật trọng số W, b
        </text>
      </svg>
    </figure>
  );
}

function LossFunctionExplorer() {
  const [tab, setTab] = useState<'regression' | 'classification'>('regression');
  const [err, setErr] = useState(1.5);
  const [prob, setProb] = useState(0.7);
  const [highlighted, setHighlighted] = useState(false);
  const timerRef = useRef<number | null>(null);

  const pulse = () => {
    setHighlighted(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setHighlighted(false), 500);
  };

  const w = 320;
  const h = 172;
  const pad = 28;

  // Regression curve coords (e in [-3, 3], loss in [0, 9])
  const mapRegX = (e: number) => pad + ((e + 3) / 6) * (w - pad * 2);
  const mapRegY = (l: number) => h - pad - (Math.min(9, l) / 9) * (h - pad * 2);

  const msePath = Array.from({ length: 61 }, (_, i) => {
    const e = -3 + i * 0.1;
    return `${i === 0 ? 'M' : 'L'} ${mapRegX(e).toFixed(1)} ${mapRegY(e * e).toFixed(1)}`;
  }).join(' ');

  const maePath = Array.from({ length: 61 }, (_, i) => {
    const e = -3 + i * 0.1;
    return `${i === 0 ? 'M' : 'L'} ${mapRegX(e).toFixed(1)} ${mapRegY(Math.abs(e)).toFixed(1)}`;
  }).join(' ');

  // Classification CE coords (p in [0.05, 0.99], loss in [0, 3.2])
  const mapCeX = (p: number) => pad + ((p - 0.05) / 0.94) * (w - pad * 2);
  const mapCeY = (l: number) => h - pad - (Math.min(3.2, l) / 3.2) * (h - pad * 2);

  const cePath = Array.from({ length: 50 }, (_, i) => {
    const p = 0.05 + (i / 49) * 0.94;
    return `${i === 0 ? 'M' : 'L'} ${mapCeX(p).toFixed(1)} ${mapCeY(-Math.log(p)).toFixed(1)}`;
  }).join(' ');

  const mseVal = err * err;
  const maeVal = Math.abs(err);
  const ceVal = -Math.log(prob);

  const pytorchCode =
    tab === 'regression'
      ? `import torch

y_pred = torch.tensor([${(2 + err).toFixed(1)}])
y_true = torch.tensor([2.0])   # Sai số e = ${err.toFixed(1)}

mse = ((y_pred - y_true) ** 2).mean()  # ${mseVal.toFixed(3)}
mae = (y_pred - y_true).abs().mean()   # ${maeVal.toFixed(3)}`
      : `import torch
import torch.nn as nn

# Giả sử xác suất dự đoán cho nhãn đúng (y=1) là p = ${prob.toFixed(2)}
p = torch.tensor([${prob.toFixed(2)}])
ce_loss = -torch.log(p)             # ${ceVal.toFixed(3)}

# Trong PyTorch thực tế: dùng thẳng logits với CrossEntropyLoss
logits = torch.tensor([[2.1, 0.4, -1.2]])
target = torch.tensor([0])
loss = nn.CrossEntropyLoss()(logits, target)`;

  return (
    <div className="my-6 bg-white py-2">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setTab('regression');
              pulse();
            }}
            className={`rounded-full px-3.5 py-1 text-xs font-bold ${
              tab === 'regression'
                ? 'bg-[#205089] text-white'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-[#EFF3F8]'
            }`}
          >
            Hồi quy: MSE vs MAE
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('classification');
              pulse();
            }}
            className={`rounded-full px-3.5 py-1 text-xs font-bold ${
              tab === 'classification'
                ? 'bg-[#205089] text-white'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-[#EFF3F8]'
            }`}
          >
            Phân loại: Cross-Entropy
          </button>
        </div>

        {tab === 'regression' ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#172A43]">
              <InlineMath formula="e = \hat{y} - y =" />
            </span>
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => {
                  setErr((v) => Math.max(-3, Math.round((v - 0.5) * 10) / 10));
                  pulse();
                }}
                className="px-2.5 py-1 text-xs font-extrabold text-[#205089] hover:bg-[#EFF3F8]"
              >
                −
              </button>
              <span className="w-12 border-x border-slate-200 py-1 text-center font-mono text-xs font-bold text-[#172A43]">
                {err.toFixed(1)}
              </span>
              <button
                type="button"
                onClick={() => {
                  setErr((v) => Math.min(3, Math.round((v + 0.5) * 10) / 10));
                  pulse();
                }}
                className="px-2.5 py-1 text-xs font-extrabold text-[#205089] hover:bg-[#EFF3F8]"
              >
                +
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#172A43]">
              <InlineMath formula="\hat{p}_{\text{true}} =" />
            </span>
            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => {
                  setProb((v) => Math.max(0.05, Math.round((v - 0.1) * 100) / 100));
                  pulse();
                }}
                className="px-2.5 py-1 text-xs font-extrabold text-[#205089] hover:bg-[#EFF3F8]"
              >
                −
              </button>
              <span className="w-12 border-x border-slate-200 py-1 text-center font-mono text-xs font-bold text-[#172A43]">
                {prob.toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => {
                  setProb((v) => Math.min(0.95, Math.round((v + 0.1) * 100) / 100));
                  pulse();
                }}
                className="px-2.5 py-1 text-xs font-extrabold text-[#205089] hover:bg-[#EFF3F8]"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid items-center gap-5 md:grid-cols-[1.15fr_1fr]">
        <div className="bg-white py-1">
          {tab === 'regression' ? (
            <svg
              viewBox={`0 0 ${w} ${h}`}
              className="mx-auto w-full max-w-[340px]"
              role="img"
              aria-label="Đồ thị so sánh đường cong MSE và MAE theo sai số e"
            >
              <line x1={pad} y1={mapRegY(0)} x2={w - pad} y2={mapRegY(0)} stroke="#CBD5E1" strokeWidth="1" />
              <line x1={mapRegX(0)} y1={pad} x2={mapRegX(0)} y2={h - pad} stroke="#CBD5E1" strokeWidth="1" />
              <path d={msePath} fill="none" stroke={BLUE} strokeWidth="2.4" />
              <path d={maePath} fill="none" stroke={ROSE} strokeWidth="2.2" strokeDasharray="5 3" />
              <circle cx={mapRegX(err)} cy={mapRegY(mseVal)} r="4.5" fill={BLUE} stroke="#FFF" strokeWidth="1.5" />
              <circle cx={mapRegX(err)} cy={mapRegY(maeVal)} r="4.5" fill={ROSE} stroke="#FFF" strokeWidth="1.5" />
              <text x="64" y="24" fontSize="10" fontWeight="800" fill={BLUE}>
                MSE (e²)
              </text>
              <text x="148" y="24" fontSize="10" fontWeight="800" fill={ROSE}>
                MAE (|e|)
              </text>
            </svg>
          ) : (
            <svg
              viewBox={`0 0 ${w} ${h}`}
              className="mx-auto w-full max-w-[340px]"
              role="img"
              aria-label="Đồ thị Cross-Entropy loss -log(p) theo xác suất dự đoán cho lớp đúng"
            >
              <line x1={pad} y1={mapCeY(0)} x2={w - pad} y2={mapCeY(0)} stroke="#CBD5E1" strokeWidth="1" />
              <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#CBD5E1" strokeWidth="1" />
              <path d={cePath} fill="none" stroke={BLUE} strokeWidth="2.5" />
              <circle cx={mapCeX(prob)} cy={mapCeY(ceVal)} r="5" fill={ROSE} stroke="#FFF" strokeWidth="1.5" />
              <text x="160" y="24" textAnchor="middle" fontSize="10" fontWeight="800" fill={BLUE}>
                Cross-Entropy: −log(p_true)
              </text>
            </svg>
          )}
        </div>

        <div className="space-y-3 bg-white text-xs text-slate-700">
          {tab === 'regression' ? (
            <div className="space-y-2 bg-white p-1">
              <div className="font-bold text-[#172A43]">
                <InlineMath formula={`\\text{MSE} = ${mseVal.toFixed(2)}, \\quad \\text{MAE} = ${maeVal.toFixed(2)}`} />
              </div>
              <p className="leading-5">
                Khi sai số nhỏ (<InlineMath formula="|e| < 1" />), <strong>MSE</strong> phạt nhẹ hơn MAE; nhưng khi sai số lớn (<InlineMath formula="|e| > 1" />), <strong>MSE</strong> tăng theo bình phương nên phạt rất gắt các điểm ngoại lai.
              </p>
            </div>
          ) : (
            <div className="space-y-2 bg-white p-1">
              <div className="font-bold text-[#172A43]">
                <InlineMath formula={`\\mathcal{L}_{\\text{CE}} = -\\log(${prob.toFixed(2)}) = ${ceVal.toFixed(3)}`} />
              </div>
              <p className="leading-5">
                Khi mô hình tự tin đúng (<InlineMath formula="\hat{p} \to 1" />), loss tiến về <InlineMath formula="0" />. Ngược lại, nếu mô hình dự đoán sai tự tin (<InlineMath formula="\hat{p} \to 0" />), loss vọt lên rất lớn để ép cập nhật mạnh.
              </p>
            </div>
          )}
        </div>
      </div>

      <div
        className={`mt-4 rounded-xl transition-all duration-300 ${
          highlighted ? 'ring-2 ring-[#205089]/60 bg-[#EFF3F8]/40' : ''
        }`}
      >
        <MdxPre>
          <code className="language-python">{pytorchCode}</code>
        </MdxPre>
      </div>
    </div>
  );
}

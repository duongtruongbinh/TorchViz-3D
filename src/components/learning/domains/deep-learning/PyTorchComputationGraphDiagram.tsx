import { InlineMath } from '../../learningMdxComponents';

const VIEW_W = 700;
const VIEW_H = 216;

export function PyTorchComputationGraphDiagram() {
  return (
    <section
      className="my-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      aria-label="Minh họa đồ thị tính toán (Computation Graph) trong PyTorch"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[#172A43]">
          Đồ thị Tính toán (Computation Graph) trong PyTorch
        </h4>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 text-[#205089]">
            <span className="inline-block h-0.5 w-4 bg-[#205089]" />
            Forward Pass (dựng đồ thị)
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#C2415A]">
            <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-[#C2415A]" />
            <code>loss.backward()</code> (tính gradient)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          className="relative w-full min-w-[620px]"
          style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
        >
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-full w-full"
            role="img"
            aria-label="Sơ đồ đồ thị tính toán từ x và w tới loss và truyền ngược gradient về w.grad"
          >
            <defs>
              <marker
                id="cg-fwd"
                markerWidth="7"
                markerHeight="7"
                refX="5.5"
                refY="3.5"
                orient="auto"
              >
                <path d="M0,1 L6.5,3.5 L0,6 z" fill="#205089" />
              </marker>
              <marker
                id="cg-bwd"
                markerWidth="7"
                markerHeight="7"
                refX="5.5"
                refY="3.5"
                orient="auto"
              >
                <path d="M0,1 L6.5,3.5 L0,6 z" fill="#C2415A" />
              </marker>
            </defs>

            {/* Forward arrows (left -> right) */}
            <path
              d="M 144 42 L 210 64"
              fill="none"
              stroke="#205089"
              strokeWidth="1.9"
              markerEnd="url(#cg-fwd)"
            />
            <path
              d="M 144 104 L 210 82"
              fill="none"
              stroke="#205089"
              strokeWidth="1.9"
              markerEnd="url(#cg-fwd)"
            />
            <path
              d="M 350 74 L 412 104"
              fill="none"
              stroke="#205089"
              strokeWidth="1.9"
              markerEnd="url(#cg-fwd)"
            />
            <path
              d="M 350 168 L 412 128"
              fill="none"
              stroke="#205089"
              strokeWidth="1.9"
              markerEnd="url(#cg-fwd)"
            />
            <path
              d="M 540 110 L 582 110"
              fill="none"
              stroke="#205089"
              strokeWidth="1.9"
              markerEnd="url(#cg-fwd)"
            />

            {/* Backward arrows (right -> left) */}
            <path
              d="M 584 128 L 542 128"
              fill="none"
              stroke="#C2415A"
              strokeWidth="1.9"
              strokeDasharray="4 3"
              markerEnd="url(#cg-bwd)"
            />
            <path
              d="M 412 118 L 352 90"
              fill="none"
              stroke="#C2415A"
              strokeWidth="1.9"
              strokeDasharray="4 3"
              markerEnd="url(#cg-bwd)"
            />
            <path
              d="M 210 92 L 146 116"
              fill="none"
              stroke="#C2415A"
              strokeWidth="1.9"
              strokeDasharray="4 3"
              markerEnd="url(#cg-bwd)"
            />

            {/* Col 1 Top: x = 2.0 */}
            <rect
              x="12"
              y="14"
              width="132"
              height="48"
              rx="10"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />

            {/* Col 1 Middle: w = 0.5 */}
            <rect
              x="12"
              y="82"
              width="132"
              height="56"
              rx="10"
              fill="#EFF3F8"
              stroke="#205089"
              strokeWidth="1.8"
            />

            {/* Col 1 Bottom: w.grad = -4.0 (cleanly below w, no overlap with x) */}
            <path
              d="M 78 138 L 78 160"
              fill="none"
              stroke="#C2415A"
              strokeWidth="1.5"
              strokeDasharray="3 2.5"
              markerEnd="url(#cg-bwd)"
            />
            <rect
              x="12"
              y="162"
              width="132"
              height="38"
              rx="8"
              fill="#FFF1F2"
              stroke="#C2415A"
              strokeWidth="1.5"
            />

            {/* Col 2 Top: Mul */}
            <rect
              x="212"
              y="44"
              width="138"
              height="60"
              rx="10"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="1.6"
            />

            {/* Col 2 Bottom: y_true */}
            <rect
              x="212"
              y="142"
              width="138"
              height="50"
              rx="10"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="1.5"
            />

            {/* Col 3: Sub */}
            <rect
              x="414"
              y="86"
              width="126"
              height="60"
              rx="10"
              fill="#FFFFFF"
              stroke="#94A3B8"
              strokeWidth="1.6"
            />

            {/* Col 4: Pow (loss) */}
            <rect
              x="584"
              y="86"
              width="106"
              height="60"
              rx="10"
              fill="#FFF1F2"
              stroke="#C2415A"
              strokeWidth="1.8"
            />
          </svg>

          {/* KaTeX HTML overlays */}
          {/* x = 2.0 */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${(78 / VIEW_W) * 100}%`, top: `${(38 / VIEW_H) * 100}%` }}
          >
            <div className="text-sm font-bold text-slate-700">
              <InlineMath formula="x = 2.0" />
            </div>
            <div className="text-[11px] text-slate-500">input tensor</div>
          </div>

          {/* w = 0.5 */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${(78 / VIEW_W) * 100}%`, top: `${(110 / VIEW_H) * 100}%` }}
          >
            <div className="text-sm font-bold text-[#172A43]">
              <InlineMath formula="w = 0.5" />
            </div>
            <div className="text-[11px] font-semibold text-[#205089]">
              <code>requires_grad=True</code>
            </div>
          </div>

          {/* w.grad = -4.0 */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${(78 / VIEW_W) * 100}%`, top: `${(181 / VIEW_H) * 100}%` }}
          >
            <div className="text-sm font-bold text-[#C2415A]">
              <InlineMath formula="w.\text{grad} = -4.0" />
            </div>
          </div>

          {/* y_hat = w * x = 1.0 */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${(281 / VIEW_W) * 100}%`, top: `${(74 / VIEW_H) * 100}%` }}
          >
            <div className="text-sm font-bold text-[#172A43]">
              <InlineMath formula="\hat{y} = w \cdot x = 1.0" />
            </div>
            <div className="font-mono text-[11px] text-slate-500">MulBackward0</div>
          </div>

          {/* y_true = 2.0 */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${(281 / VIEW_W) * 100}%`, top: `${(167 / VIEW_H) * 100}%` }}
          >
            <div className="text-sm font-bold text-slate-700">
              <InlineMath formula="y_{\text{true}} = 2.0" />
            </div>
            <div className="text-[11px] text-slate-500">target tensor</div>
          </div>

          {/* e = y_hat - y = -1.0 */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${(477 / VIEW_W) * 100}%`, top: `${(116 / VIEW_H) * 100}%` }}
          >
            <div className="text-sm font-bold text-[#172A43]">
              <InlineMath formula="e = \hat{y} - y = -1.0" />
            </div>
            <div className="font-mono text-[11px] text-slate-500">SubBackward0</div>
          </div>

          {/* L = e^2 = 1.0 */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-center"
            style={{ left: `${(637 / VIEW_W) * 100}%`, top: `${(116 / VIEW_H) * 100}%` }}
          >
            <div className="text-sm font-bold text-[#172A43]">
              <InlineMath formula="\mathcal{L} = e^2 = 1.0" />
            </div>
            <div className="font-mono text-[11px] text-[#C2415A]">PowBackward0</div>
          </div>

          {/* Backward gradient values */}
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded bg-white/90 px-1 text-xs font-bold text-[#C2415A]"
            style={{ left: `${(563 / VIEW_W) * 100}%`, top: `${(144 / VIEW_H) * 100}%` }}
          >
            <InlineMath formula="-2.0" />
          </div>
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded bg-white/90 px-1 text-xs font-bold text-[#C2415A]"
            style={{ left: `${(382 / VIEW_W) * 100}%`, top: `${(122 / VIEW_H) * 100}%` }}
          >
            <InlineMath formula="-2.0" />
          </div>
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded bg-white/90 px-1 text-xs font-bold text-[#C2415A]"
            style={{ left: `${(178 / VIEW_W) * 100}%`, top: `${(122 / VIEW_H) * 100}%` }}
          >
            <InlineMath formula="-4.0" />
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-slate-600">
        Khi chạy Forward, PyTorch tự động lưu các phép toán (<code>MulBackward0</code>,{' '}
        <code>SubBackward0</code>, <code>PowBackward0</code>) thành đồ thị. Khi gọi{' '}
        <code>loss.backward()</code>, PyTorch đi ngược đồ thị bằng Chain Rule để tính và điền{' '}
        <InlineMath formula="w.\text{grad} = -4.0" />.
      </p>
    </section>
  );
}

import { InlineMath } from '../../learningMdxComponents';

export function ChainRuleLinksDiagram() {
  return (
    <section
      className="my-5 rounded-xl bg-white p-4"
      aria-label="Minh họa mẫu phân số trước nối với tử phân số sau trong Chain Rule"
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Kết quả */}
        <div className="flex flex-col items-center px-2 py-1 text-center">
          <span className="rounded-md bg-[#EFF3F8] px-2.5 py-0.5 text-sm font-bold text-[#205089]">
            <InlineMath formula="\partial \mathcal{L}" />
          </span>
          <span className="my-1.5 h-[1.5px] w-9 bg-[#205089]" />
          <span className="rounded-md bg-[#EFF3F8] px-2.5 py-0.5 text-sm font-bold text-[#205089]">
            <InlineMath formula="\partial w" />
          </span>
        </div>

        <span className="px-1 text-lg font-bold text-slate-500">
          <InlineMath formula="=" />
        </span>

        {/* 3 phân số với đường nối chéo mẫu -> tử */}
        <div className="flex items-center">
          {/* Phân số 1: dL / dy_hat */}
          <div className="flex flex-col items-center px-1.5 py-1">
            <span className="rounded-md bg-[#EFF3F8] px-2.5 py-0.5 text-sm font-bold text-[#205089]">
              <InlineMath formula="\partial \mathcal{L}" />
            </span>
            <span className="my-1.5 h-[1.5px] w-10 bg-slate-400" />
            <span className="rounded-md bg-teal-50 px-2.5 py-0.5 text-sm font-semibold text-[#0F766E]">
              <InlineMath formula="\partial \hat{y}" />
            </span>
          </div>

          {/* Đường nối chéo: mẫu phân số 1 (dưới-trái) -> tử phân số 2 (trên-phải) */}
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 46 80" className="h-20 w-11" aria-hidden="true">
              <defs>
                <marker
                  id="link-teal"
                  markerWidth="6"
                  markerHeight="6"
                  refX="4.5"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0.8 L5.5,3 L0,5.2 z" fill="#0F766E" />
                </marker>
              </defs>
              <path
                d="M 2 60 C 22 60, 24 18, 42 18"
                fill="none"
                stroke="#0F766E"
                strokeWidth="2.2"
                strokeDasharray="4 2.5"
                markerEnd="url(#link-teal)"
              />
              <circle cx="23" cy="39" r="3.5" fill="#FFFFFF" stroke="#0F766E" strokeWidth="2" />
              <text
                x="23"
                y="76"
                fontSize="11"
                fontWeight="700"
                fill="#64748B"
                textAnchor="middle"
              >
                ×
              </text>
            </svg>
          </div>

          {/* Phân số 2: dy_hat / dz */}
          <div className="flex flex-col items-center px-1.5 py-1">
            <span className="rounded-md bg-teal-50 px-2.5 py-0.5 text-sm font-semibold text-[#0F766E]">
              <InlineMath formula="\partial \hat{y}" />
            </span>
            <span className="my-1.5 h-[1.5px] w-10 bg-slate-400" />
            <span className="rounded-md bg-rose-50 px-2.5 py-0.5 text-sm font-semibold text-[#C2415A]">
              <InlineMath formula="\partial z" />
            </span>
          </div>

          {/* Đường nối chéo: mẫu phân số 2 (dưới-trái) -> tử phân số 3 (trên-phải) */}
          <div className="flex flex-col items-center">
            <svg viewBox="0 0 46 80" className="h-20 w-11" aria-hidden="true">
              <defs>
                <marker
                  id="link-rose"
                  markerWidth="6"
                  markerHeight="6"
                  refX="4.5"
                  refY="3"
                  orient="auto"
                >
                  <path d="M0,0.8 L5.5,3 L0,5.2 z" fill="#C2415A" />
                </marker>
              </defs>
              <path
                d="M 2 60 C 22 60, 24 18, 42 18"
                fill="none"
                stroke="#C2415A"
                strokeWidth="2.2"
                strokeDasharray="4 2.5"
                markerEnd="url(#link-rose)"
              />
              <circle cx="23" cy="39" r="3.5" fill="#FFFFFF" stroke="#C2415A" strokeWidth="2" />
              <text
                x="23"
                y="76"
                fontSize="11"
                fontWeight="700"
                fill="#64748B"
                textAnchor="middle"
              >
                ×
              </text>
            </svg>
          </div>

          {/* Phân số 3: dz / dw */}
          <div className="flex flex-col items-center px-1.5 py-1">
            <span className="rounded-md bg-rose-50 px-2.5 py-0.5 text-sm font-semibold text-[#C2415A]">
              <InlineMath formula="\partial z" />
            </span>
            <span className="my-1.5 h-[1.5px] w-10 bg-slate-400" />
            <span className="rounded-md bg-[#EFF3F8] px-2.5 py-0.5 text-sm font-bold text-[#205089]">
              <InlineMath formula="\partial w" />
            </span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-slate-600">
        Mẫu số của phân số trước nối chéo lên tử số của phân số sau (<InlineMath formula="\partial \hat{y}" />{' '}
        nối <InlineMath formula="\partial \hat{y}" />, <InlineMath formula="\partial z" /> nối{' '}
        <InlineMath formula="\partial z" />) tạo thành một chuỗi mắt xích, giữ lại hai đầu{' '}
        <InlineMath formula="\dfrac{\partial \mathcal{L}}{\partial w}" />.
      </p>
    </section>
  );
}

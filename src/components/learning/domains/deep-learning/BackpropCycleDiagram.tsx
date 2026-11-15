import { InlineMath } from '../../learningMdxComponents';

const BLUE = '#205089';
const ROSE = '#C2415A';
const EMERALD = '#047857';

/**
 * Clean Light-Mode SVG diagram illustrating the 3-step Backpropagation cycle:
 * 1. Loss Calculation -> 2. Gradient Calculation (Chain Rule) -> 3. Weight Update (SGD).
 */
export function BackpropCycleDiagram() {
  return (
    <figure className="my-6 bg-white py-2">
      <svg
        viewBox="0 0 720 208"
        className="mx-auto w-full max-w-[720px]"
        role="img"
        aria-label="Chu trình Backpropagation gồm 3 bước: Tính Loss, Tính Gradient bằng Chain Rule và Cập nhật Trọng số ngược chiều Gradient"
      >
        <defs>
          <marker
            id="bp-arrow-blue"
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
            id="bp-arrow-rose"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill={ROSE} />
          </marker>
          <marker
            id="bp-arrow-emerald"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill={EMERALD} />
          </marker>
        </defs>

        {/* Top row: Forward Pass -> Loss Calculation */}
        <rect x="24" y="20" width="124" height="54" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
        <text x="86" y="42" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#475569">
          ĐẦU VÀO
        </text>
        <foreignObject x="32" y="48" width="108" height="20">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#172A43]">
            <InlineMath formula="\mathbf{x},\ y_{\text{true}}" />
          </div>
        </foreignObject>

        <line x1="154" y1="47" x2="210" y2="47" stroke={BLUE} strokeWidth="2" markerEnd="url(#bp-arrow-blue)" />

        <rect x="218" y="20" width="196" height="54" rx="10" fill="#EFF3F8" stroke={BLUE} strokeWidth="1.8" />
        <text x="316" y="42" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BLUE}>
          FORWARD PASS
        </text>
        <foreignObject x="226" y="48" width="180" height="20">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#172A43]">
            <InlineMath formula="\text{Mạng }(w, b) \to \hat{y}" />
          </div>
        </foreignObject>

        <line x1="420" y1="47" x2="476" y2="47" stroke={BLUE} strokeWidth="2" markerEnd="url(#bp-arrow-blue)" />

        {/* Step 1: Loss Calculation */}
        <rect x="484" y="20" width="212" height="54" rx="10" fill="#FFF1F2" stroke={ROSE} strokeWidth="1.8" />
        <text x="590" y="41" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={ROSE}>
          1. TÍNH LOSS
        </text>
        <foreignObject x="492" y="47" width="196" height="22">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#881337]">
            <InlineMath formula="\mathcal{L}(\hat{y}, y_{\text{true}})" />
          </div>
        </foreignObject>

        {/* Arrow down from Loss to Gradient */}
        <line x1="590" y1="78" x2="590" y2="120" stroke={ROSE} strokeWidth="2" markerEnd="url(#bp-arrow-rose)" />

        {/* Step 2: Gradient Calculation */}
        <rect x="404" y="128" width="292" height="62" rx="10" fill="#FFFFFF" stroke={ROSE} strokeWidth="1.8" />
        <text x="550" y="150" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={ROSE}>
          2. TÍNH GRADIENT (CHAIN RULE)
        </text>
        <foreignObject x="412" y="156" width="276" height="26">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#172A43]">
            <InlineMath formula="\frac{\partial \mathcal{L}}{\partial w} = \frac{\partial \mathcal{L}}{\partial \hat{y}} \cdot \frac{\partial \hat{y}}{\partial w}" />
          </div>
        </foreignObject>

        {/* Arrow left from Gradient to Weight Update */}
        <line x1="398" y1="159" x2="344" y2="159" stroke={EMERALD} strokeWidth="2" markerEnd="url(#bp-arrow-emerald)" />

        {/* Step 3: Weight Update */}
        <rect x="24" y="128" width="312" height="62" rx="10" fill="#ECFDF5" stroke={EMERALD} strokeWidth="1.8" />
        <text x="180" y="150" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={EMERALD}>
          3. CẬP NHẬT TRỌNG SỐ (NGƯỢC GRADIENT)
        </text>
        <foreignObject x="32" y="156" width="296" height="26">
          <div className="flex h-full items-center justify-center text-xs font-bold text-[#065F46]">
            <InlineMath formula="w \leftarrow w - \eta\,\frac{\partial \mathcal{L}}{\partial w}, \quad b \leftarrow b - \eta\,\frac{\partial \mathcal{L}}{\partial b}" />
          </div>
        </foreignObject>

        {/* Arrow up from Weight Update back to Forward Pass */}
        <path
          d="M 180 124 L 180 98 L 280 98 L 280 82"
          fill="none"
          stroke={EMERALD}
          strokeWidth="1.8"
          strokeDasharray="4 3"
          markerEnd="url(#bp-arrow-emerald)"
        />
      </svg>
    </figure>
  );
}

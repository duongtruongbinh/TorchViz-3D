import { useState, useEffect } from 'react';
import { ArrowRight, Bot, RotateCcw } from 'lucide-react';
import { InlineMath } from '../../math';

// Math curve function for Local Minima:
// f(x) = 0.12 * x^2 - 1.2 * cos(2.2 * x) + 0.5 * sin(4.5 * x) + 1.5
// Domain x in [-3.75, 3.75]
function fCurve(x: number): number {
  return 0.12 * x * x - 1.2 * Math.cos(2.2 * x) + 0.5 * Math.sin(4.5 * x) + 1.5;
}

function dfCurve(x: number): number {
  const h = 0.0001;
  return (fCurve(x + h) - fCurve(x - h)) / (2 * h);
}

export function LocalMinimaTrapExplorer() {
  const [startX, setStartX] = useState<number>(-3.4);
  const [currentX, setCurrentX] = useState<number>(-3.4);
  const [history, setHistory] = useState<number[]>([-3.4]);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  const svgWidth = 600;
  const svgHeight = 250;

  // Axes coordinates
  const axisX = 38;
  const axisY = 224;
  const axisRight = 582;
  const axisTop = 32;

  // Domain and boundaries with generous padding from axes:
  // domainX: [-3.75, 3.75]
  // SVG X range: [72, 548] -> gives 34px padding from Y-axis (38) and 34px padding before X arrow (582)
  const domainMinX = -3.75;
  const domainMaxX = 3.75;
  const curveXMin = 72;
  const curveXMax = 548;

  // SVG Y range: maps loss value [0, 4.8]
  // When loss = 0: ySvg = 196 (28px above axisY = 224)
  // When loss = 0.42 (Global min): ySvg = 183 (41px above axisY = 224)
  // When loss = 4.8: ySvg = 48 (26px below axisTop = 22)
  const curveYMin = 48;
  const curveYMax = 196;

  const toSvgX = (x: number) =>
    curveXMin + ((x - domainMinX) / (domainMaxX - domainMinX)) * (curveXMax - curveXMin);

  const toSvgY = (y: number) =>
    curveYMax - (y / 4.8) * (curveYMax - curveYMin);

  // Generate curve path
  const curvePoints: [number, number][] = [];
  for (let x = domainMinX; x <= domainMaxX; x += 0.05) {
    curvePoints.push([toSvgX(x), toSvgY(fCurve(x))]);
  }
  const pathD = curvePoints.reduce((acc, [px, py], i) => (i === 0 ? `M ${px} ${py}` : `${acc} L ${px} ${py}`), '');
  const areaD = `${pathD} L ${toSvgX(domainMaxX)} ${axisY} L ${toSvgX(domainMinX)} ${axisY} Z`;

  // SGD step simulation
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentX((prevX) => {
        const grad = dfCurve(prevX);
        if (Math.abs(grad) < 0.01) {
          setIsRunning(false);
          return prevX;
        }
        const lr = 0.08;
        const nextX = Math.max(domainMinX + 0.05, Math.min(domainMaxX - 0.05, prevX - lr * grad));
        setHistory((prev) => (prev.length > 80 ? prev : [...prev, nextX]));
        if (Math.abs(nextX - prevX) < 0.002) {
          setIsRunning(false);
        }
        return nextX;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleSelectStart = (val: number) => {
    setStartX(val);
    setCurrentX(val);
    setHistory([val]);
    setIsRunning(true); // Automatically run on selection
  };

  const handleReset = () => {
    setCurrentX(startX);
    setHistory([startX]);
    setIsRunning(true);
  };

  const currentLoss = fCurve(currentX);
  const currentGrad = dfCurve(currentX);
  const isTrappedInLocal = Math.abs(currentGrad) < 0.05 && currentLoss > 0.6;

  return (
    <div className="my-6 rounded-lg bg-white p-4 shadow-xs sm:p-5">
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-[#EFF3F8]">
        <h4 className="font-bold text-[#0F172A] text-base sm:text-lg">
          Bẫy Cực tiểu Địa phương (Multi-Modal Trap)
        </h4>
      </div>

      {/* SVG Canvas with KaTeX Axis Overlays */}
      <div className="relative w-full overflow-hidden rounded-xl bg-[#FAFBFD]">
        {/* Y Axis KaTeX Label */}
        <div className="absolute top-1 left-3.5 z-10 flex items-center gap-1 text-xs font-bold text-slate-700 select-none pointer-events-none">
          <span>Loss</span>
          <InlineMath formula="\mathcal{L}(\theta)" />
        </div>

        {/* X Axis KaTeX Label */}
        <div className="absolute bottom-2.5 right-3.5 z-10 flex items-center gap-1.5 text-xs font-bold text-slate-700 select-none pointer-events-none">
          <InlineMath formula="\theta" />
          <span className="text-slate-500 font-medium text-[11px]">(Tham số)</span>
        </div>

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="Đồ thị hàm số đa cực tiểu và quỹ đạo di chuyển của thuật toán tối ưu"
        >
          {/* Axes & Arrows */}
          <path
            d={`M ${axisX} ${axisTop} L ${axisX} ${axisY} L ${axisRight} ${axisY}`}
            fill="none"
            stroke="#64748B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Y Axis Arrowhead (pointing up) */}
          <polygon
            points={`${axisX},${axisTop - 5} ${axisX - 4.5},${axisTop + 4} ${axisX + 4.5},${axisTop + 4}`}
            fill="#64748B"
          />
          {/* X Axis Arrowhead (pointing right) */}
          <polygon
            points={`${axisRight + 5},${axisY} ${axisRight - 4},${axisY - 4.5} ${axisRight - 4},${axisY + 4.5}`}
            fill="#64748B"
          />

          {/* Center line (theta = 0) */}
          <line x1={toSvgX(0)} y1={curveYMin} x2={toSvgX(0)} y2={axisY} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />

          {/* Area gradient under curve */}
          <path d={areaD} fill="url(#blueAreaGradient)" opacity="0.15" />
          <defs>
            <linearGradient id="blueAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#205089" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          {/* Landscape Curve */}
          <path d={pathD} fill="none" stroke="#205089" strokeWidth="3" strokeLinecap="round" />

          {/* Key Minima Annotations */}
          <text x={toSvgX(-2.9)} y={toSvgY(fCurve(-2.9)) + 24} fontSize="10" fill="#64748B" textAnchor="middle" fontWeight="bold">
            Local minimum 1
          </text>
          <text x={toSvgX(0.05)} y={toSvgY(fCurve(0.05)) + 22} fontSize="10.5" fill="#059669" textAnchor="middle" fontWeight="bold">
            Global minimum
          </text>
          <text x={toSvgX(2.8)} y={toSvgY(fCurve(2.8)) + 24} fontSize="10" fill="#64748B" textAnchor="middle" fontWeight="bold">
            Local minimum 2
          </text>

          {/* Gradient Descent History Trail */}
          {history.length > 1 && (
            <polyline
              points={history.map((x) => `${toSvgX(x)},${toSvgY(fCurve(x))}`).join(' ')}
              fill="none"
              stroke="#E11D48"
              strokeWidth="2"
              strokeDasharray="2 2"
              opacity="0.6"
            />
          )}

          {/* Active Optimization Agent Ball */}
          <g transform={`translate(${toSvgX(currentX)}, ${toSvgY(currentLoss)})`}>
            {/* Pulse effect */}
            <circle r="12" fill={isTrappedInLocal ? '#F59E0B' : '#205089'} opacity="0.25" />
            <circle
              r="7"
              fill={isTrappedInLocal ? '#D97706' : '#205089'}
              stroke="#FFFFFF"
              strokeWidth="2"
              className="shadow-sm"
            />
          </g>
        </svg>
      </div>

      {/* Metrics Bar with KaTeX */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 my-3 text-center">
        <div className="rounded-lg bg-[#F8FAFC] p-2 flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold text-slate-500 block mb-0.5">
            <InlineMath formula="\theta" />
          </span>
          <span className="text-sm sm:text-base font-black text-[#0F172A]">{currentX.toFixed(3)}</span>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] p-2 flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
            <span>Loss</span>
            <span className="text-[10px] text-slate-400 font-normal">
              (<InlineMath formula="\mathcal{L}" />)
            </span>
          </span>
          <span className="text-sm sm:text-base font-black text-[#0F172A]">{currentLoss.toFixed(3)}</span>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] p-2 flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold text-slate-500 block mb-0.5 flex items-center gap-1">
            <span>Gradient</span>
            <span className="text-[10px] text-slate-400 font-normal">
              (<InlineMath formula="|\nabla \mathcal{L}|" />)
            </span>
          </span>
          <span className="text-sm sm:text-base font-black text-[#0F172A]">{Math.abs(currentGrad).toFixed(3)}</span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="relative flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-[#EFF3F8]">
        {/* Starting Position Selector (Centered) */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            {
              label: (
                <span className="inline-flex items-center gap-1">
                  <span>Sườn trái</span>
                  <span className="text-slate-400 font-normal">
                    (<InlineMath formula="\theta = -3.4" />)
                  </span>
                </span>
              ),
              val: -3.4,
            },
            {
              label: (
                <span className="inline-flex items-center gap-1">
                  <span>Gần đỉnh</span>
                  <span className="text-slate-400 font-normal">
                    (<InlineMath formula="\theta = 1.6" />)
                  </span>
                </span>
              ),
              val: 1.6,
            },
            {
              label: (
                <span className="inline-flex items-center gap-1">
                  <span>Sườn phải</span>
                  <span className="text-slate-400 font-normal">
                    (<InlineMath formula="\theta = 3.4" />)
                  </span>
                </span>
              ),
              val: 3.4,
            },
          ].map((item) => (
            <button
              type="button"
              key={item.val}
              onClick={() => handleSelectStart(item.val)}
              className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                startX === item.val
                  ? 'bg-[#205089] text-white border-[#205089]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Reset Action Button */}
        <button
          type="button"
          onClick={handleReset}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all shrink-0 sm:absolute sm:right-0"
          title="Khởi động lại mô phỏng"
          aria-label="Khởi động lại mô phỏng"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function GradientFailureModesVisualizer() {
  const [activeTab, setActiveTab] = useState<'steep' | 'discrete' | 'sharp'>('steep');
  const [ballX, setBallX] = useState<number>(-1.8);
  const [ballHistory, setBallHistory] = useState<number[]>([-1.8]);

  const svgWidth = 550;
  const svgHeight = 220;
  const axisX = 38;
  const axisY = 194;
  const axisRight = 532;
  const axisTop = 30;

  // Domain x in [-3, 3]
  // SVG X mapped to [68, 502] -> gives 30px padding from axisX (38) and 30px padding before axisRight (532)
  const toX = (x: number) => 68 + ((x + 3) / 6) * 434;
  const toY = (y: number) => 174 - (y / 4.0) * 134;

  // Curve definition based on active tab
  const getCurveY = (x: number): number => {
    if (activeTab === 'steep') {
      // Cliff: very steep drop
      return 1.8 / (1 + Math.exp(-6 * x)) + 0.1 * x * x + 0.2;
    }
    if (activeTab === 'discrete') {
      // Step terraces: staircase function
      return Math.floor(x + 3) * 0.7 + 0.3;
    }
    // Sharp non-differentiable V-shape
    return Math.abs(x) * 1.1 + 0.3;
  };

  // Generate path
  let pathD = '';
  if (activeTab === 'discrete') {
    const steps = [-3, -2, -1, 0, 1, 2, 3];
    pathD = steps
      .map((st, i) => {
        const xStart = toX(st);
        const xEnd = toX(st + 1);
        const yVal = toY(getCurveY(st + 0.1));
        return `${i === 0 ? 'M' : 'L'} ${xStart} ${yVal} L ${xEnd} ${yVal}`;
      })
      .join(' ');
  } else {
    const pts: [number, number][] = [];
    for (let x = -3; x <= 3; x += 0.05) {
      pts.push([toX(x), toY(getCurveY(x))]);
    }
    pathD = pts.reduce((acc, [px, py], i) => (i === 0 ? `M ${px} ${py}` : `${acc} L ${px} ${py}`), '');
  }

  // Continuous auto-run animation loop for all 3 failure modes
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    let stepCount = 0;

    if (activeTab === 'steep') {
      // A fixed learning rate is too large for the local slope and overshoots.
      const trajectory = [-1.8, -1.3, -0.8, -0.2, 2.5, 2.5];
      setBallX(trajectory[0]);
      setBallHistory([trajectory[0]]);

      timer = setInterval(() => {
        stepCount = (stepCount + 1) % trajectory.length;
        const nextX = trajectory[stepCount];
        setBallX(nextX);
        if (stepCount === 0) {
          setBallHistory([nextX]);
        } else {
          setBallHistory((prev) => [...prev, nextX]);
        }
      }, 700);
    } else if (activeTab === 'discrete') {
      // The derivative is zero on each terrace and undefined at each jump.
      const trajectory = [-1.5, -1.48, -1.5, -1.52];
      setBallX(-1.5);
      setBallHistory([-1.5]);

      timer = setInterval(() => {
        stepCount = (stepCount + 1) % trajectory.length;
        setBallX(trajectory[stepCount]);
      }, 500);
    } else if (activeTab === 'sharp') {
      // Sharp point: oscillation ping-pong across x = 0
      const trajectory = [-1.2, 1.2, -1.1, 1.1, -1.0, 1.0];
      setBallX(trajectory[0]);
      setBallHistory([trajectory[0]]);

      timer = setInterval(() => {
        stepCount = (stepCount + 1) % trajectory.length;
        const nextX = trajectory[stepCount];
        setBallX(nextX);
        if (stepCount === 0) {
          setBallHistory([nextX]);
        } else {
          setBallHistory((prev) => (prev.length > 8 ? [nextX] : [...prev, nextX]));
        }
      }, 600);
    }

    return () => clearInterval(timer);
  }, [activeTab]);

  return (
    <div className="my-6 rounded-lg bg-white p-4 shadow-xs sm:p-5">
      {/* Header with Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-[#EFF3F8]">
        <div>
          <h4 className="font-bold text-[#0F172A] text-base sm:text-lg">
            Minh họa Các Giới Hạn Của Gradient
          </h4>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50">
          {([
            { id: 'steep', label: '1. Bước Nhảy Quá Lớn' },
            { id: 'discrete', label: '2. Bậc Thang Rời Rạc' },
            { id: 'sharp', label: '3. Điểm Gãy Nhọn' },
          ] as const).map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#205089] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Canvas with KaTeX Axis Overlays */}
      <div className="relative w-full overflow-hidden rounded-xl bg-[#FAFBFD]">
        {/* Y Axis KaTeX Label */}
        <div className="absolute top-1 left-3.5 z-10 flex items-center gap-1 text-xs font-bold text-slate-700 select-none pointer-events-none">
          <span>Loss</span>
          <InlineMath formula="\mathcal{L}(\theta)" />
        </div>

        {/* X Axis KaTeX Label */}
        <div className="absolute bottom-2.5 right-3.5 z-10 flex items-center gap-1.5 text-xs font-bold text-slate-700 select-none pointer-events-none">
          <InlineMath formula="\theta" />
          <span className="text-slate-500 font-medium text-[11px]">(Tham số)</span>
        </div>

        {/* Dynamic Canvas Annotations with KaTeX */}
        {activeTab === 'steep' && (
          <div
            className="absolute z-10 -translate-x-1/2 pointer-events-none select-none text-sm sm:text-base font-bold text-rose-600 flex items-center gap-1.5"
            style={{
              left: `${(toX(0) / svgWidth) * 100}%`,
              top: '14%',
            }}
          >
            <InlineMath formula="\nabla \mathcal{L}" />
            <span>Bước cập nhật bị vượt quá!</span>
          </div>
        )}
        {activeTab === 'discrete' && (
          <div
            className="absolute z-10 -translate-x-1/2 pointer-events-none select-none text-sm sm:text-base font-bold text-rose-600 flex items-center gap-1.5"
            style={{
              left: `${(toX(ballX) / svgWidth) * 100}%`,
              top: '14%',
            }}
          >
            <InlineMath formula="\nabla \mathcal{L} = 0" />
            <span>(Không có hướng đi trên mặt phẳng)</span>
          </div>
        )}
        {activeTab === 'sharp' && (
          <div
            className="absolute z-10 -translate-x-1/2 pointer-events-none select-none text-sm sm:text-base font-bold text-rose-600 flex items-center gap-1.5"
            style={{
              left: `${(toX(0) / svgWidth) * 100}%`,
              top: '14%',
            }}
          >
            <span>Không khả vi tại đỉnh nhọn!</span>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="Ba tình huống làm gradient descent cần điều chỉnh hoặc không áp dụng trực tiếp được"
        >
          {/* Axes & Arrows */}
          <path
            d={`M ${axisX} ${axisTop} L ${axisX} ${axisY} L ${axisRight} ${axisY}`}
            fill="none"
            stroke="#64748B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Y Axis Arrowhead (pointing up) */}
          <polygon
            points={`${axisX},${axisTop - 5} ${axisX - 4.5},${axisTop + 4} ${axisX + 4.5},${axisTop + 4}`}
            fill="#64748B"
          />
          {/* X Axis Arrowhead (pointing right) */}
          <polygon
            points={`${axisRight + 5},${axisY} ${axisRight - 4},${axisY - 4.5} ${axisRight - 4},${axisY + 4.5}`}
            fill="#64748B"
          />

          {/* Curve */}
          <path d={pathD} fill="none" stroke="#205089" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* History trail */}
          {ballHistory.length > 1 && (
            <polyline
              points={ballHistory.map((x) => `${toX(x)},${toY(getCurveY(x))}`).join(' ')}
              fill="none"
              stroke="#E11D48"
              strokeWidth="2"
              strokeDasharray="3 3"
              opacity="0.5"
            />
          )}

          {/* Ball */}
          <g transform={`translate(${toX(ballX)}, ${toY(getCurveY(ballX))})`}>
            <circle r="10" fill="#E11D48" opacity="0.2" />
            <circle r="6" fill="#E11D48" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Explanatory takeaway with KaTeX */}
      <div className="mt-3 p-3 rounded-xl bg-[#F8FAFC]">
        <div className="text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed">
          {activeTab === 'steep' && (
            <span>
              <strong>Hiện tượng:</strong> Cùng một learning rate có thể quá lớn ở vùng dốc, khiến bước cập nhật vượt qua vùng tốt. Giảm learning rate, clipping hoặc chuẩn hóa có thể khắc phục.
            </span>
          )}
          {activeTab === 'discrete' && (
            <span>
              <strong>Hiện tượng:</strong> Đạo hàm bằng 0 trên từng bậc và không xác định tại điểm nhảy, nên gradient thông thường không cung cấp tín hiệu cập nhật hữu ích.
            </span>
          )}
          {activeTab === 'sharp' && (
            <span>
              <strong>Hiện tượng:</strong> Đạo hàm chuẩn không tồn tại tại điểm gãy. Bước cố định có thể dao động; subgradient hoặc learning rate giảm dần vẫn có thể xử lý lớp bài toán này.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ZeroOrderSamplingVisualizer() {
  const [currentBestX, setCurrentBestX] = useState<number>(-3.5);
  const [evalCount, setEvalCount] = useState<number>(0);
  const [candidates, setCandidates] = useState<{ x: number; y: number; isBest: boolean }[]>([]);
  const [currentPhase, setCurrentPhase] = useState<0 | 1 | 2 | 3>(0);
  const [roundIndex, setRoundIndex] = useState<number>(0);

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const toSvgX = (x: number) => paddingX + ((x + 4) / 8) * (svgWidth - 2 * paddingX);
  const toSvgY = (y: number) => svgHeight - paddingY - (y / 4.9) * (svgHeight - 2 * paddingY);

  // Curve points
  const curvePoints: [number, number][] = [];
  for (let x = -4; x <= 4; x += 0.05) {
    curvePoints.push([toSvgX(x), toSvgY(fCurve(x))]);
  }
  const pathD = curvePoints.reduce((acc, [px, py], i) => (i === 0 ? `M ${px} ${py}` : `${acc} L ${px} ${py}`), '');
  const areaD = `${pathD} L ${toSvgX(4)} ${toSvgY(0)} L ${toSvgX(-4)} ${toSvgY(0)} Z`;

  const trajectory = [
    {
      samples: [
        { x: -3.5, y: fCurve(-3.5) },
        { x: -2.8, y: fCurve(-2.8) },
        { x: -2.2, y: fCurve(-2.2) },
        { x: -1.6, y: fCurve(-1.6) },
      ],
    },
    {
      samples: [
        { x: -2.4, y: fCurve(-2.4) },
        { x: -1.7, y: fCurve(-1.7) },
        { x: -1.0, y: fCurve(-1.0) },
        { x: -0.3, y: fCurve(-0.3) },
      ],
    },
    {
      samples: [
        { x: -0.35, y: fCurve(-0.35) },
        { x: -0.22, y: fCurve(-0.22) },
        { x: -0.15, y: fCurve(-0.15) },
        { x: -0.05, y: fCurve(-0.05) },
      ],
    },
  ];

  const handleStep1 = () => {
    let targetRound = roundIndex;
    if (currentPhase === 3) {
      targetRound = (roundIndex + 1) % trajectory.length;
      setRoundIndex(targetRound);
    }
    const currentRound = trajectory[targetRound];
    setCandidates(
      currentRound.samples.map((s) => ({
        ...s,
        isBest: false,
      }))
    );
    setEvalCount((prev) => prev + 4);
    setCurrentPhase(1);
  };

  const handleStep2 = () => {
    if (currentPhase !== 1) return;
    const currentRound = trajectory[roundIndex];
    const bestScore = Math.min(...currentRound.samples.map((s) => s.y));
    setCandidates(
      currentRound.samples.map((s) => ({
        ...s,
        isBest: Math.abs(s.y - bestScore) < 0.01,
      }))
    );
    setCurrentPhase(2);
  };

  const handleStep3 = () => {
    if (currentPhase !== 2) return;
    const bestCandidate = candidates.find((c) => c.isBest);
    if (bestCandidate) {
      setCurrentBestX(bestCandidate.x);
    }
    setCurrentPhase(3);
  };

  const handleReset = () => {
    setRoundIndex(0);
    setCurrentPhase(0);
    setCurrentBestX(-3.5);
    setCandidates([]);
    setEvalCount(0);
  };

  const bestLoss = fCurve(currentBestX);

  return (
    <div className="my-6 rounded-lg bg-white p-4 shadow-xs sm:p-5">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#EFF3F8]">
        <h4 className="font-bold text-[#0F172A] text-base sm:text-lg">
          Chiến lược thăm dò (Zero-Order Sampling)
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Vòng {roundIndex + 1}/3
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Đặt lại
          </button>
        </div>
      </div>

      {/* Interactive 3-Step Strategy Pipeline Above Chart */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 mb-3">
        {/* Step 1 */}
        <button
          type="button"
          disabled={currentPhase !== 0 && currentPhase !== 3}
          onClick={handleStep1}
          className={`text-left flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2.5 rounded-xl border transition-all duration-200 ${
            currentPhase === 0 || currentPhase === 3
              ? 'bg-[#EFF3F8] border-[#205089] ring-1 ring-[#205089]/30 shadow-xs cursor-pointer hover:bg-[#E2ECF7]'
              : currentPhase > 0
              ? 'bg-[#F8FAFC] border-slate-200 opacity-80 cursor-default'
              : 'bg-[#F8FAFC] border-slate-200 opacity-40 cursor-not-allowed'
          }`}
        >
          <span
            className={`size-5 sm:size-6 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
              currentPhase === 0 || currentPhase === 3
                ? 'bg-[#205089] text-white shadow-xs'
                : currentPhase > 0
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {currentPhase > 0 && currentPhase !== 3 ? '✓' : '1'}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-bold leading-tight text-[#0F172A] truncate">
              Rải tập điểm
            </div>
            <div className="hidden sm:block text-[10px] text-slate-500 leading-tight truncate mt-0.5">
              Nhận về điểm số tương ứng
            </div>
          </div>
        </button>

        {/* Step 2 */}
        <button
          type="button"
          disabled={currentPhase !== 1}
          onClick={handleStep2}
          className={`text-left flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2.5 rounded-xl border transition-all duration-200 ${
            currentPhase === 1
              ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500/30 shadow-xs cursor-pointer hover:bg-emerald-100/60'
              : currentPhase > 1
              ? 'bg-[#F8FAFC] border-slate-200 opacity-80 cursor-default'
              : 'bg-[#F8FAFC] border-slate-200 opacity-40 cursor-not-allowed'
          }`}
        >
          <span
            className={`size-5 sm:size-6 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
              currentPhase === 1
                ? 'bg-emerald-600 text-white shadow-xs'
                : currentPhase > 1
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {currentPhase > 1 ? '✓' : '2'}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-bold leading-tight text-[#0F172A] truncate">
              Chọn điểm tốt nhất
            </div>
            <div className="hidden sm:block text-[10px] text-slate-500 leading-tight truncate mt-0.5">
              Ứng viên có f(θ) tối ưu nhất
            </div>
          </div>
        </button>

        {/* Step 3 */}
        <button
          type="button"
          disabled={currentPhase !== 2}
          onClick={handleStep3}
          className={`text-left flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2.5 rounded-xl border transition-all duration-200 ${
            currentPhase === 2
              ? 'bg-[#EFF3F8] border-[#205089] ring-1 ring-[#205089]/30 shadow-xs cursor-pointer hover:bg-[#E2ECF7]'
              : currentPhase === 3
              ? 'bg-[#F8FAFC] border-slate-200 opacity-80 cursor-default'
              : 'bg-[#F8FAFC] border-slate-200 opacity-40 cursor-not-allowed'
          }`}
        >
          <span
            className={`size-5 sm:size-6 rounded-full text-[10px] sm:text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
              currentPhase === 2
                ? 'bg-[#205089] text-white shadow-xs'
                : currentPhase === 3
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-200 text-slate-500'
            }`}
          >
            {currentPhase === 3 ? '✓' : '3'}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-bold leading-tight text-[#0F172A] truncate">
              Cập nhật vị trí
            </div>
            <div className="hidden sm:block text-[10px] text-slate-500 leading-tight truncate mt-0.5">
              Tiến bước & tiếp tục lặp lại
            </div>
          </div>
        </button>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-hidden rounded-xl bg-[#FAFBFD]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="Các vòng lấy mẫu và chọn ứng viên theo giá trị hàm mục tiêu"
        >
          {/* Subtle Grid */}
          <line x1={paddingX} y1={toSvgY(0)} x2={svgWidth - paddingX} y2={toSvgY(0)} stroke="#E2E8F0" strokeWidth="1" />

          {/* Area under curve */}
          <path d={areaD} fill="url(#blueZeroGrad)" opacity="0.12" />
          <defs>
            <linearGradient id="blueZeroGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#205089" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          {/* Curve */}
          <path d={pathD} fill="none" stroke="#205089" strokeWidth="3" strokeLinecap="round" />

          {/* Global minimum target */}
          <text x={toSvgX(-0.22)} y={toSvgY(fCurve(-0.22)) + 22} fontSize="11" fill="#059669" textAnchor="middle" fontWeight="bold">
            Global minimum
          </text>

          {/* Candidate Sample Probes */}
          {candidates.map((cand, idx) => {
            const cx = toSvgX(cand.x);
            const cy = toSvgY(cand.y);
            const yOffset = idx % 2 === 0 ? 10 : 22;
            return (
              <g key={idx}>
                {/* Probe vertical guide line */}
                <line
                  x1={cx}
                  y1={cy}
                  x2={cx}
                  y2={toSvgY(0)}
                  stroke={cand.isBest ? '#10B981' : '#94A3B8'}
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  opacity="0.75"
                />
                {/* Candidate Probe Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={cand.isBest ? 6.5 : 4.5}
                  fill={cand.isBest ? '#10B981' : '#3B82F6'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                {/* Score label with alternating vertical offset to prevent overlap */}
                <text
                  x={cx}
                  y={cy - yOffset}
                  fontSize="10"
                  fill={cand.isBest ? '#047857' : '#64748B'}
                  fontWeight={cand.isBest ? 'bold' : 'normal'}
                  textAnchor="middle"
                >
                  f({cand.x.toFixed(1)}) = {cand.y.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Best Active Solution Ball */}
          <g
            transform={`translate(${toSvgX(currentBestX)}, ${toSvgY(bestLoss)})`}
            className="transition-transform duration-500 ease-out"
          >
            <circle r="12" fill="#205089" opacity="0.2" className="animate-ping" />
            <circle r="7" fill="#205089" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-3 text-center">
        <div className="rounded-lg bg-[#F8FAFC] p-2 flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold uppercase text-slate-500 block mb-0.5">
            Vị trí tốt nhất <InlineMath formula="\theta^*" />
          </span>
          <span className="text-sm sm:text-base font-black text-[#0F172A]">{currentBestX.toFixed(2)}</span>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] p-2 flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold uppercase text-slate-500 block mb-0.5">
            Điểm số Loss <InlineMath formula="f(\theta^*)" />
          </span>
          <span className="text-sm sm:text-base font-black text-[#0F172A]">{bestLoss.toFixed(3)}</span>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] p-2 flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold uppercase text-slate-500 block mb-0.5">Số lần hỏi Hộp đen</span>
          <span className="text-sm sm:text-base font-black text-[#0F172A]">{evalCount} lần</span>
        </div>
        <div className="rounded-lg bg-[#F8FAFC] p-2 flex flex-col items-center justify-center">
          <span className="text-[11px] font-bold uppercase text-slate-500 block mb-0.5">Đạo hàm Gradient</span>
          <span className="text-sm sm:text-base font-black text-emerald-600">0 (Không cần)</span>
        </div>
      </div>
    </div>
  );
}

const THETA_SEQUENCE = [
  { theta: -3.0, score: 5.2 },
  { theta: -1.8, score: 1.4 },
  { theta: -0.5, score: 6.1 },
  { theta: 0.8, score: 1.9 },
  { theta: 2.1, score: 4.8 },
  { theta: 1.2, score: 2.3 },
  { theta: 3.5, score: 5.9 },
  { theta: -2.4, score: 1.6 },
];

export function BlackBoxFunctionVisualizer() {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % THETA_SEQUENCE.length);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  const current = THETA_SEQUENCE[index];
  const isHigh = current.score >= 3.5;

  return (
    <div className="my-6 rounded-lg bg-white p-4 shadow-xs sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-3 border-b border-[#EFF3F8]">
        <h4 className="font-bold text-[#0F172A] text-base sm:text-lg">
          Hàm Hộp Đen (Black-Box)
        </h4>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-2">
        {/* Input */}
        <div className="flex-1 w-full flex items-center justify-center p-6 rounded-xl bg-[#FAFBFD]">
          <span className="text-xl sm:text-2xl font-black text-[#205089] transition-all duration-300">
            <InlineMath formula={`\\theta = ${current.theta.toFixed(1)}`} />
          </span>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center text-slate-400">
          <ArrowRight className="size-7 rotate-90 sm:rotate-0" aria-hidden="true" />
        </div>

        {/* Black Box Robot */}
        <div className="flex-[1.2] w-full flex items-center justify-center gap-2.5 p-6 rounded-xl bg-[#0F172A] shadow-xs">
          <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white shrink-0" />
          <span className="text-lg sm:text-xl font-bold text-white tracking-wide">
            Black Box
          </span>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center text-slate-400">
          <ArrowRight className="size-7 rotate-90 sm:rotate-0" aria-hidden="true" />
        </div>

        {/* Output: Red if low, Green if high */}
        <div
          className={`flex-1 w-full flex items-center justify-center p-6 rounded-xl transition-colors duration-300 ${
            isHigh ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'
          }`}
        >
          <span
            className={`text-xl sm:text-2xl font-black transition-colors duration-300 ${
              isHigh ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            <InlineMath formula={`f(\\theta) = ${current.score.toFixed(2)}`} />
          </span>
        </div>
      </div>
    </div>
  );
}

export function LossToFitnessVisualizer() {
  const maxSteps = 40;
  const [step, setStep] = useState<number>(0);

  // Exponential decay curve for loss across generations:
  // L(t) = 0.25 + 3.75 * exp(-0.085 * t)
  const getLoss = (t: number) => 0.25 + 3.75 * Math.exp(-0.085 * t);

  const currentLoss = getLoss(step);
  const fitnessNeg = -currentLoss;
  const fitnessInv = 1 / (1 + currentLoss);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev >= maxSteps ? 0 : prev + 1));
    }, 140);
    return () => clearInterval(interval);
  }, []);

  // Chart dimensions
  const svgWidth = 400;
  const svgHeight = 200;
  const stepsList = Array.from({ length: maxSteps + 1 }, (_, i) => i);

  // Column 1 SVG mapping (Symmetric across Y = 100)
  const c1X = (t: number) => 35 + (t / maxSteps) * 335;
  const c1YLoss = (l: number) => 100 - (l / 4.5) * 80;
  const c1YFit = (f: number) => 100 - (f / 4.5) * 80;

  const c1LossPath = stepsList
    .map((t, i) => `${i === 0 ? 'M' : 'L'} ${c1X(t).toFixed(1)} ${c1YLoss(getLoss(t)).toFixed(1)}`)
    .join(' ');
  const c1FitPath = stepsList
    .map((t, i) => `${i === 0 ? 'M' : 'L'} ${c1X(t).toFixed(1)} ${c1YFit(-getLoss(t)).toFixed(1)}`)
    .join(' ');

  // Column 2 SVG mapping (Dual Axis)
  const c2X = (t: number) => 35 + (t / maxSteps) * 330;
  const c2YLoss = (l: number) => 175 - (l / 4.5) * 150;
  const c2YFit = (f: number) => 175 - (f / 1.0) * 150;

  const c2LossPath = stepsList
    .map((t, i) => `${i === 0 ? 'M' : 'L'} ${c2X(t).toFixed(1)} ${c2YLoss(getLoss(t)).toFixed(1)}`)
    .join(' ');
  const c2FitPath = stepsList
    .map((t, i) => `${i === 0 ? 'M' : 'L'} ${c2X(t).toFixed(1)} ${c2YFit(1 / (1 + getLoss(t))).toFixed(1)}`)
    .join(' ');

  return (
    <div className="my-6">
      {/* Compact Timeline Slider */}
      <div className="mb-3 flex items-center justify-end gap-2.5">
        <span className="text-xs text-slate-500">
          Thế hệ: <strong className="font-mono text-slate-900">{step}</strong>/{maxSteps}
        </span>
        <input
          type="range"
          min={0}
          max={maxSteps}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          className="h-1.5 w-24 sm:w-36 cursor-pointer accent-[#205089]"
          aria-label="Thanh trượt thế hệ"
        />
      </div>

      {/* 2 Columns: 1 for each formula */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* COLUMN 1: Fitness = -Loss */}
        <div className="flex flex-col rounded-xl border border-slate-100 bg-[#F8FAFC]/60 p-3.5 sm:p-4">
          {/* Header Formula */}
          <div className="mb-2">
            <span className="text-sm font-semibold text-slate-900">
              <InlineMath formula="\text{Fitness}(w) = -\text{Loss}(w)" />
            </span>
          </div>

          {/* Minimalist SVG Chart */}
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none" aria-hidden="true">
            {/* Horizontal guidelines */}
            <line x1="30" y1="20" x2="380" y2="20" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="30" y1="100" x2="380" y2="100" stroke="#CBD5E1" strokeWidth="1.2" />
            <line x1="30" y1="180" x2="380" y2="180" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />

            {/* Zero Axis Label */}
            <text x="24" y="103" textAnchor="end" fontSize="10" fill="#94A3B8" fontWeight="600">0</text>

            {/* Loss Curve (Descending) */}
            <path d={c1LossPath} fill="none" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />

            {/* Fitness Curve (Ascending) */}
            <path d={c1FitPath} fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />

            {/* Current Step Vertical Guide */}
            <line
              x1={c1X(step)}
              y1="18"
              x2={c1X(step)}
              y2="182"
              stroke="#94A3B8"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.8"
            />

            {/* Active Marker on Loss Curve */}
            <circle cx={c1X(step)} cy={c1YLoss(currentLoss)} r="5.5" fill="#E11D48" stroke="#FFFFFF" strokeWidth="2" />
            <text
              x={c1X(step) + (step > 26 ? -8 : 8)}
              y={c1YLoss(currentLoss) - 8}
              textAnchor={step > 26 ? 'end' : 'start'}
              fontSize="10"
              fontWeight="bold"
              fill="#BE123C"
            >
              Loss: {currentLoss.toFixed(2)}
            </text>

            {/* Active Marker on Fitness Curve */}
            <circle cx={c1X(step)} cy={c1YFit(fitnessNeg)} r="5.5" fill="#0D9488" stroke="#FFFFFF" strokeWidth="2" />
            <text
              x={c1X(step) + (step > 26 ? -8 : 8)}
              y={c1YFit(fitnessNeg) + 16}
              textAnchor={step > 26 ? 'end' : 'start'}
              fontSize="10"
              fontWeight="bold"
              fill="#0F766E"
            >
              Fit: {fitnessNeg.toFixed(2)}
            </text>
          </svg>
        </div>

        {/* COLUMN 2: Fitness = 1 / (1 + Loss) */}
        <div className="flex flex-col rounded-xl border border-slate-100 bg-[#F8FAFC]/60 p-3.5 sm:p-4">
          {/* Header Formula */}
          <div className="mb-2">
            <span className="text-sm font-semibold text-slate-900">
              <InlineMath formula="\text{Fitness}(w) = \frac{1}{1 + \text{Loss}(w)}" />
            </span>
          </div>

          {/* Minimalist SVG Chart */}
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none" aria-hidden="true">
            {/* Horizontal guidelines */}
            <line x1="30" y1="25" x2="375" y2="25" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="30" y1="100" x2="375" y2="100" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="30" y1="175" x2="375" y2="175" stroke="#CBD5E1" strokeWidth="1.2" />

            {/* Labels */}
            <text x="24" y="178" textAnchor="end" fontSize="10" fill="#94A3B8" fontWeight="600">0</text>
            <text x="24" y="29" textAnchor="end" fontSize="9" fill="#E11D48" fontWeight="500">Loss</text>
            <text x="382" y="29" textAnchor="start" fontSize="9" fill="#7C3AED" fontWeight="500">1.0</text>

            {/* Loss Curve (Descending, Red) */}
            <path d={c2LossPath} fill="none" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />

            {/* Fitness Curve (Ascending, Purple) */}
            <path d={c2FitPath} fill="none" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />

            {/* Current Step Vertical Guide */}
            <line
              x1={c2X(step)}
              y1="22"
              x2={c2X(step)}
              y2="175"
              stroke="#94A3B8"
              strokeWidth="1.2"
              strokeDasharray="3 3"
              opacity="0.8"
            />

            {/* Active Marker on Loss Curve (Label always placed ABOVE to prevent collision) */}
            <circle cx={c2X(step)} cy={c2YLoss(currentLoss)} r="5.5" fill="#E11D48" stroke="#FFFFFF" strokeWidth="2" />
            <text
              x={c2X(step) + (step > 26 ? -8 : 8)}
              y={c2YLoss(currentLoss) - 8}
              textAnchor={step > 26 ? 'end' : 'start'}
              fontSize="10"
              fontWeight="bold"
              fill="#BE123C"
            >
              Loss: {currentLoss.toFixed(2)}
            </text>

            {/* Active Marker on Fitness Curve (Label always placed BELOW to prevent collision) */}
            <circle cx={c2X(step)} cy={c2YFit(fitnessInv)} r="5.5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
            <text
              x={c2X(step) + (step > 26 ? -8 : 8)}
              y={c2YFit(fitnessInv) + 16}
              textAnchor={step > 26 ? 'end' : 'start'}
              fontSize="10"
              fontWeight="bold"
              fill="#6D28D9"
            >
              Fit: {fitnessInv.toFixed(3)}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

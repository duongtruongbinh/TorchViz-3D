import { cx } from '../../theme';
import type { LlmRendererTheme } from './rendererTypes';

export type DiagramAnchor = {
  bottom: number;
  centerX: number;
  centerY: number;
  left: number;
  right: number;
  top: number;
};

export function getDiagramAnchor(element: HTMLElement, canvasRect: DOMRect): DiagramAnchor {
  const rect = element.getBoundingClientRect();
  return {
    bottom: rect.bottom - canvasRect.top,
    centerX: rect.left + rect.width / 2 - canvasRect.left,
    centerY: rect.top + rect.height / 2 - canvasRect.top,
    left: rect.left - canvasRect.left,
    right: rect.right - canvasRect.left,
    top: rect.top - canvasRect.top,
  };
}

export function observeDiagramLayout(canvas: HTMLElement, elements: HTMLElement[], update: () => void) {
  const frameId = window.requestAnimationFrame(update);
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
  [canvas, ...elements].forEach((element) => observer?.observe(element));
  window.addEventListener('resize', update);
  return () => {
    window.cancelAnimationFrame(frameId);
    observer?.disconnect();
    window.removeEventListener('resize', update);
  };
}

export type DiagramConnectorPath = {
  className?: string;
  d: string;
  markerEnd?: boolean;
  stroke?: string;
  strokeDasharray?: string;
  strokeWidth?: number;
};

export function DiagramConnectorLayer({
  color,
  markerId,
  paths,
}: {
  color: string;
  markerId: string;
  paths: DiagramConnectorPath[];
}) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      {paths.map((path, index) => (
        <path
          key={`${index}-${path.d}`}
          d={path.d}
          fill="none"
          stroke={path.stroke ?? color}
          strokeWidth={path.strokeWidth ?? 2}
          strokeDasharray={path.strokeDasharray}
          markerEnd={path.markerEnd === false ? undefined : `url(#${markerId})`}
          className={path.className}
        />
      ))}
    </svg>
  );
}

export function ProbabilityCurveChart({
  ariaLabel,
  curvePath,
  maxValue,
  mode,
  probability,
  themeClasses,
  title,
  value,
}: {
  ariaLabel: string;
  curvePath: string;
  maxValue: number;
  mode: 'log' | 'loss';
  probability: number;
  themeClasses: LlmRendererTheme;
  title: string;
  value: number;
}) {
  const axisColor = themeClasses.isLight ? '#8A949E' : '#74859A';
  const labelColor = themeClasses.isLight ? '#59636E' : '#A8B8C8';
  const pointColor = themeClasses.isLight ? '#5BAA12' : '#A8DB78';
  const pointX = 12 + probability * 82;
  const pointY = mode === 'log' ? 16 + (value / maxValue) * 72 : 88 - (value / maxValue) * 72;
  const ticks = [0, 1, 2, 3, 4];

  return (
    <figure className="grid gap-2">
      <div className={cx('text-sm font-black', themeClasses.titleText)}>{title}</div>
      <svg viewBox="0 0 100 100" className="h-52 w-full" role="img" aria-label={ariaLabel}>
        <path d={mode === 'log' ? 'M 12 88 V 16 H 96' : 'M 12 10 V 88 H 96'} fill="none" stroke={axisColor} strokeWidth="1" />
        {ticks.map((tick) => {
          const tickY = mode === 'log' ? 16 + (tick / maxValue) * 72 : 88 - (tick / maxValue) * 72;
          return <g key={tick}><line x1="10" y1={tickY} x2="12" y2={tickY} stroke={axisColor} strokeWidth="0.8" /><text x="8" y={tickY + 1.7} textAnchor="end" fontSize="4.5" fill={labelColor}>{mode === 'log' && tick !== 0 ? `−${tick}` : tick}</text></g>;
        })}
        <path d={curvePath} fill="none" stroke={mode === 'log' ? (themeClasses.isLight ? '#8D436F' : '#D58AB5') : (themeClasses.isLight ? '#205089' : '#A8B8C8')} strokeWidth="2" />
        <line x1={pointX} y1={mode === 'log' ? '16' : pointY} x2={pointX} y2={mode === 'log' ? pointY : '88'} stroke={pointColor} strokeWidth="1" strokeDasharray="2 2" />
        <circle cx={pointX} cy={pointY} r="2.6" fill={pointColor} />
        <text x="96" y={mode === 'log' ? '13' : '96'} textAnchor="end" fontSize="5" fill={labelColor}>p đúng → 1</text>
        <text x="5" y="12" textAnchor="middle" fontSize="5" fill={labelColor} transform="rotate(-90 5 12)">{mode === 'log' ? 'ln(p)' : 'loss'}</text>
      </svg>
    </figure>
  );
}

export function ProbabilitySignComparisonChart({ activeMode, probability }: {
  activeMode: 'log' | 'loss';
  probability: number;
}) {
  const axisColor = '#8A949E';
  const labelColor = '#59636E';
  const logColor = '#8D436F';
  const lossColor = '#205089';
  const maxMagnitude = -Math.log(0.01);
  const magnitude = -Math.log(probability);
  const pointX = 12 + probability * 82;
  const positiveY = 50 - (magnitude / maxMagnitude) * 36;
  const negativeY = 50 + (magnitude / maxMagnitude) * 36;
  const curvePath = (sign: 1 | -1) => Array.from({ length: 100 }, (_, index) => {
    const p = 0.01 + index * 0.01;
    const x = 12 + p * 82;
    const value = -Math.log(p) * sign;
    const y = 50 - (value / maxMagnitude) * 36;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
  const ticks = [-4, -2, 0, 2, 4];
  const logActive = activeMode === 'log';

  return (
    <figure className="grid gap-2">
      <div className="flex items-center gap-4 text-sm font-black">
        <span style={{ color: lossColor, opacity: logActive ? 0.22 : 1 }} className="transition-opacity">−ln(p)</span>
        <span style={{ color: logColor, opacity: logActive ? 1 : 0.22 }} className="transition-opacity">ln(p)</span>
      </div>
      <svg viewBox="0 0 100 100" className="h-52 w-full" role="img" aria-label="Đồ thị so sánh natural log và negative natural log theo xác suất token đúng">
        <path d="M 12 10 V 90 M 12 50 H 96" fill="none" stroke={axisColor} strokeWidth="1" />
        {ticks.map((tick) => {
          const y = 50 - (tick / maxMagnitude) * 36;
          return <g key={tick}><line x1="10" y1={y} x2="12" y2={y} stroke={axisColor} strokeWidth="0.8" /><text x="8" y={y + 1.7} textAnchor="end" fontSize="4.5" fill={labelColor}>{tick}</text></g>;
        })}
        <path d={curvePath(1)} fill="none" stroke={lossColor} strokeWidth="2" opacity={logActive ? 0.18 : 1} className="transition-opacity" />
        <path d={curvePath(-1)} fill="none" stroke={logColor} strokeWidth="2" opacity={logActive ? 1 : 0.18} className="transition-opacity" />
        <line x1={pointX} y1="50" x2={pointX} y2={positiveY} stroke={lossColor} strokeWidth="1" strokeDasharray="2 2" opacity={logActive ? 0.18 : 1} className="transition-opacity" />
        <line x1={pointX} y1="50" x2={pointX} y2={negativeY} stroke={logColor} strokeWidth="1" strokeDasharray="2 2" opacity={logActive ? 1 : 0.18} className="transition-opacity" />
        <circle cx={pointX} cy={positiveY} r="2.6" fill={lossColor} opacity={logActive ? 0.18 : 1} className="transition-opacity" />
        <circle cx={pointX} cy={negativeY} r="2.6" fill={logColor} opacity={logActive ? 1 : 0.18} className="transition-opacity" />
        <text x="96" y="57" textAnchor="end" fontSize="5" fill={labelColor}>p đúng → 1</text>
        <text x="5" y="12" textAnchor="middle" fontSize="5" fill={labelColor} transform="rotate(-90 5 12)">giá trị</text>
      </svg>
    </figure>
  );
}

export function ExponentComparisonChart({ length, product }: {
  length: number;
  product: number;
}) {
  const axisColor = '#8A949E';
  const labelColor = '#59636E';
  const normalizedColor = '#8D436F';
  const perplexityColor = '#205089';
  const pointColor = '#5BAA12';
  const minProduct = 0.05;
  const minValue = 0.4;
  const maxValue = Math.max(2.2, Math.pow(minProduct, -1 / length));
  const xFor = (value: number) => 12 + ((value - minProduct) / (1 - minProduct)) * 82;
  const yFor = (value: number) => 88 - ((value - minValue) / (maxValue - minValue)) * 74;
  const curvePath = (exponent: number) => Array.from({ length: 96 }, (_, index) => {
    const value = minProduct + index * 0.01;
    return `${index === 0 ? 'M' : 'L'} ${xFor(value).toFixed(2)} ${yFor(Math.pow(value, exponent)).toFixed(2)}`;
  }).join(' ');
  const normalized = Math.pow(product, 1 / length);
  const perplexity = Math.pow(product, -1 / length);
  const pointX = xFor(product);

  return (
    <figure>
      <svg viewBox="0 0 100 100" className="h-52 w-full" role="img" aria-label="Đồ thị so sánh số mũ một trên L và âm một trên L theo tích xác suất">
        <path d="M 12 10 V 88 H 96" fill="none" stroke={axisColor} strokeWidth="1" />
        {[0.5, 1, 1.5, 2].map((tick) => <g key={tick}><line x1="10" y1={yFor(tick)} x2="12" y2={yFor(tick)} stroke={axisColor} strokeWidth="0.8" /><text x="8" y={yFor(tick) + 1.7} textAnchor="end" fontSize="4.5" fill={labelColor}>{tick.toFixed(1)}</text></g>)}
        <path d={curvePath(1 / length)} fill="none" stroke={normalizedColor} strokeWidth="2" opacity="0.65" />
        <path d={curvePath(-1 / length)} fill="none" stroke={perplexityColor} strokeWidth="2.2" />
        <line x1={pointX} y1={yFor(normalized)} x2={pointX} y2={yFor(perplexity)} stroke={pointColor} strokeWidth="1" strokeDasharray="2 2" />
        <circle cx={pointX} cy={yFor(normalized)} r="2.5" fill={normalizedColor} />
        <circle cx={pointX} cy={yFor(perplexity)} r="2.8" fill={perplexityColor} />
        <text x="96" y="96" textAnchor="end" fontSize="5" fill={labelColor}>tích xác suất → 1</text>
        <text x="5" y="12" textAnchor="middle" fontSize="5" fill={labelColor} transform="rotate(-90 5 12)">giá trị</text>
      </svg>
    </figure>
  );
}

import { type ReactNode, useRef, useState } from 'react';
import { InlineMath } from '../../learningMdxComponents';

export const DL_PALETTE = {
  primary: '#205089',
  border: '#B8C8DA',
  tint: '#EFF3F8',
  ink: '#172A43',
  rose: '#C2415A',
  teal: '#0F766E',
  emerald: '#047857',
  slate: '#64748B',
} as const;

export function useCodeHighlightPulse(durationMs = 500) {
  const [highlighted, setHighlighted] = useState(false);
  const timerRef = useRef<number | null>(null);

  const pulse = () => {
    setHighlighted(true);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setHighlighted(false);
      timerRef.current = null;
    }, durationMs);
  };

  return { highlighted, pulse };
}

export function DlCardShell({
  title,
  subtitle,
  rightSlot,
  children,
  ariaLabel,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  rightSlot?: ReactNode;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <section
      className="my-5 rounded-2xl border border-[#B8C8DA] bg-white p-4 sm:p-5 shadow-sm"
      aria-label={ariaLabel}
    >
      {(title || subtitle || rightSlot) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#EFF3F8] pb-3">
          <div>
            {title && <h4 className="text-sm font-bold text-[#172A43]">{title}</h4>}
            {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
          </div>
          {rightSlot}
        </div>
      )}
      {children}
    </section>
  );
}

export function DlTabPillGroup<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: ReactNode }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              active
                ? 'border-[#B8C8DA] bg-[#EFF3F8] text-[#205089]'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-[#EFF3F8]/60 hover:text-[#205089]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function DlStepControl({
  label,
  displayValue,
  onDecrement,
  onIncrement,
  disableDecrement = false,
  disableIncrement = false,
  decrementAriaLabel = 'Giảm giá trị',
  incrementAriaLabel = 'Tăng giá trị',
}: {
  label: ReactNode;
  displayValue: ReactNode;
  onDecrement: () => void;
  onIncrement: () => void;
  disableDecrement?: boolean;
  disableIncrement?: boolean;
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-[#172A43]">{label}</span>
      <div className="inline-flex items-center rounded-lg border border-[#B8C8DA] bg-white">
        <button
          type="button"
          onClick={onDecrement}
          disabled={disableDecrement}
          aria-label={decrementAriaLabel}
          className="px-2.5 py-1 text-xs font-extrabold text-[#205089] hover:bg-[#EFF3F8] disabled:opacity-40"
        >
          −
        </button>
        <span className="w-12 border-x border-[#B8C8DA] py-1 text-center font-mono text-xs font-bold text-[#172A43]">
          {displayValue}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={disableIncrement}
          aria-label={incrementAriaLabel}
          className="px-2.5 py-1 text-xs font-extrabold text-[#205089] hover:bg-[#EFF3F8] disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function SvgBipartiteEdges({
  x1,
  x2,
  fromYs,
  toYs,
  stroke = '#94A3B8',
  strokeWidth = 1.2,
  opacity = 1,
}: {
  x1: number;
  x2: number;
  fromYs: readonly number[];
  toYs: readonly number[];
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}) {
  return (
    <>
      {fromYs.map((y1) =>
        toYs.map((y2) => (
          <line
            key={`edge-${x1}-${y1}-${x2}-${y2}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={stroke}
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        )),
      )}
    </>
  );
}

export function SvgMathNode({
  cx,
  cy,
  r = 15,
  fill = '#FFFFFF',
  stroke = '#CBD5E1',
  strokeWidth = 1.6,
  formula,
  textColor = '#172A43',
  fontSizeClass = 'text-xs',
  opacity = 1,
}: {
  cx: number;
  cy: number;
  r?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  formula?: string;
  textColor?: string;
  fontSizeClass?: string;
  opacity?: number;
}) {
  const box = Math.round(r * 1.9);
  return (
    <g opacity={opacity}>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      {formula && (
        <foreignObject x={cx - box / 2} y={cy - box / 2} width={box} height={box}>
          <div
            className={`flex h-full items-center justify-center ${fontSizeClass}`}
            style={{ color: textColor }}
          >
            <InlineMath formula={formula} />
          </div>
        </foreignObject>
      )}
    </g>
  );
}

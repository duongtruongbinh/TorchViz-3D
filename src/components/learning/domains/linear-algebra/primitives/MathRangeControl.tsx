import { useId, type ReactNode } from 'react';

export interface MathRangeControlProps {
  label: string | ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  valueDisplay?: string | ReactNode;
  subLabel?: string | ReactNode;
  ariaLabel?: string;
  colorScheme?: 'blue' | 'purple' | 'emerald' | 'amber';
  disabled?: boolean;
  id?: string;
}

export function MathRangeControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  valueDisplay,
  subLabel,
  ariaLabel,
  colorScheme = 'blue',
  disabled = false,
  id: explicitId,
}: MathRangeControlProps) {
  const generatedId = useId();
  const inputId = explicitId ?? generatedId;

  const accentClasses = {
    blue: 'accent-blue-600',
    purple: 'accent-purple-600',
    emerald: 'accent-emerald-600',
    amber: 'accent-amber-600',
  }[colorScheme];

  const valueBadgeColorClasses = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
  }[colorScheme];

  return (
    <div className={`flex flex-col gap-1.5 w-full ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <label
          htmlFor={inputId}
          className="font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          {subLabel && (
            <span className="text-[11px] text-slate-500">
              {subLabel}
            </span>
          )}
          <span className={`font-mono font-bold ${valueBadgeColorClasses}`}>
            {valueDisplay ?? value}
          </span>
        </div>
      </div>

      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        aria-label={typeof label === 'string' ? label : (ariaLabel ?? 'Điều chỉnh giá trị')}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        className={`w-full h-2 rounded-lg bg-slate-200 cursor-pointer ${accentClasses} focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500`}
      />
    </div>
  );
}

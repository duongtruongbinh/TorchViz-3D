import { useId, type ReactNode } from 'react';
import { useLearningMdxTheme } from '../../../learningMdxComponents';
import { cx } from '../../../theme';

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
  const themeClasses = useLearningMdxTheme();
  const generatedId = useId();
  const inputId = explicitId ?? generatedId;

  const accentClasses = {
    blue: 'accent-blue-600',
    purple: 'accent-purple-600',
    emerald: 'accent-emerald-600',
    amber: 'accent-amber-600',
  }[colorScheme];

  const valueBadgeColorClasses = {
    blue: themeClasses.isLight ? 'text-blue-600' : 'text-blue-400',
    purple: themeClasses.isLight ? 'text-purple-600' : 'text-purple-400',
    emerald: themeClasses.isLight ? 'text-emerald-600' : 'text-emerald-400',
    amber: themeClasses.isLight ? 'text-amber-600' : 'text-amber-400',
  }[colorScheme];

  return (
    <div className={cx('flex flex-col gap-1.5 w-full', disabled && 'opacity-50')}>
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <label
          htmlFor={inputId}
          className={cx('font-semibold flex items-center gap-1.5 cursor-pointer', themeClasses.titleText)}
        >
          {label}
        </label>
        <div className="flex items-center gap-2">
          {subLabel && (
            <span className={cx('text-[11px]', themeClasses.mutedText)}>
              {subLabel}
            </span>
          )}
          <span className={cx('font-mono font-bold', valueBadgeColorClasses)}>
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
        className={cx(
          'w-full h-2 rounded-lg cursor-pointer transition-colors',
          themeClasses.isLight ? 'bg-slate-200' : 'bg-slate-700',
          accentClasses,
          themeClasses.focusRing,
        )}
      />
    </div>
  );
}

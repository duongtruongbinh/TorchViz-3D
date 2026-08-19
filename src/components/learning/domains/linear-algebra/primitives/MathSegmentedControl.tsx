import { useRef, type ReactNode } from 'react';
import { useLearningMdxTheme } from '../../../learningMdxComponents';
import { cx } from '../../../theme';

export type MathSegmentedColorScheme = 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate';

export interface SegmentOption<T extends string> {
  value: T;
  label: string | ReactNode;
  ariaLabel?: string;
  badge?: string | ReactNode;
  colorScheme?: MathSegmentedColorScheme;
}

export interface MathSegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  colorScheme?: MathSegmentedColorScheme;
  size?: 'sm' | 'md';
  className?: string;
}

export function MathSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = 'Tùy chọn hiển thị',
  colorScheme = 'blue',
  size = 'md',
  className = '',
}: MathSegmentedControlProps<T>) {
  const themeClasses = useLearningMdxTheme();
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activeColorMap: Record<MathSegmentedColorScheme, string> = {
    blue: 'bg-blue-600 text-white shadow-xs',
    purple: 'bg-purple-600 text-white shadow-xs',
    emerald: 'bg-emerald-600 text-white shadow-xs',
    amber: 'bg-amber-600 text-white shadow-xs',
    rose: 'bg-rose-600 text-white shadow-xs',
    slate: themeClasses.isLight ? 'bg-slate-800 text-white shadow-xs' : 'bg-slate-200 text-slate-900 shadow-xs',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs min-h-[30px]',
    md: 'px-3 py-1.5 text-xs sm:text-sm min-h-[36px]',
  }[size];

  const focusOption = (targetIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(targetIndex, options.length - 1));
    const targetOption = options[clampedIndex];
    if (targetOption) {
      onChange(targetOption.value);
      buttonRefs.current[clampedIndex]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % options.length;
      focusOption(nextIndex);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      focusOption(prevIndex);
    } else if (e.key === 'Home') {
      e.preventDefault();
      focusOption(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      focusOption(options.length - 1);
    }
  };

  const selectedIndex = options.findIndex((opt) => opt.value === value);

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cx(
        'inline-flex flex-wrap items-center justify-center p-1 rounded-lg border gap-1 transition-colors',
        themeClasses.isLight
          ? 'border-slate-300/80 bg-slate-200/70'
          : 'border-slate-700 bg-slate-800/80',
        className,
      )}
    >
      {options.map((option, idx) => {
        const isSelected = option.value === value;
        const optionScheme = option.colorScheme ?? colorScheme;
        const activeColor = activeColorMap[optionScheme];

        return (
          <button
            key={option.value}
            ref={(el) => {
              buttonRefs.current[idx] = el;
            }}
            role="radio"
            aria-checked={isSelected}
            aria-label={option.ariaLabel}
            type="button"
            tabIndex={isSelected || (selectedIndex === -1 && idx === 0) ? 0 : -1}
            onClick={() => {
              onChange(option.value);
              buttonRefs.current[idx]?.focus();
            }}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cx(
              'inline-flex items-center justify-center gap-1.5 rounded-md font-semibold transition-all cursor-pointer',
              sizeClasses,
              themeClasses.focusRing,
              isSelected
                ? activeColor
                : themeClasses.isLight
                  ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-300/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60',
            )}
          >
            <span>{option.label}</span>
            {option.badge && (
              <span className="text-[10px] opacity-80">{option.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

import type { ReactNode } from 'react';

export interface SegmentOption<T extends string> {
  value: T;
  label: string | ReactNode;
  ariaLabel?: string;
  badge?: string | ReactNode;
}

export interface MathSegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
  colorScheme?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose';
  size?: 'sm' | 'md';
}

export function MathSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = 'Tùy chọn hiển thị',
  colorScheme = 'blue',
  size = 'md',
}: MathSegmentedControlProps<T>) {
  const activeColorClasses = {
    blue: 'bg-blue-600 text-white shadow-xs',
    purple: 'bg-purple-600 text-white shadow-xs',
    emerald: 'bg-emerald-600 text-white shadow-xs',
    amber: 'bg-amber-600 text-white shadow-xs',
    rose: 'bg-rose-600 text-white shadow-xs',
  }[colorScheme];

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs min-h-[30px]',
    md: 'px-3 py-1.5 text-xs sm:text-sm min-h-[36px]',
  }[size];

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex].value);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex flex-wrap items-center justify-center p-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-200/70 dark:bg-slate-800/90 gap-1"
    >
      {options.map((option, idx) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={isSelected}
            aria-label={option.ariaLabel}
            type="button"
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md font-semibold transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900 ${sizeClasses} ${
              isSelected
                ? activeColorClasses
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-slate-700/60'
            }`}
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

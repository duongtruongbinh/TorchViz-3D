import type { ReactNode } from 'react';

export interface MathVisualCardProps {
  title?: string | ReactNode;
  subtitle?: string | ReactNode;
  badge?: string | ReactNode;
  ariaLabel: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function MathVisualCard({
  title,
  subtitle,
  badge,
  ariaLabel,
  children,
  footer,
  className = '',
}: MathVisualCardProps) {
  return (
    <figure
      className={`my-6 flex flex-col items-center gap-4 rounded-xl border p-4 sm:p-5 shadow-xs border-slate-200 bg-slate-50 ${className}`}
      aria-label={ariaLabel}
    >
      {(title || subtitle || badge) && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 border-b pb-3 border-slate-200">
          <div className="flex flex-col gap-0.5">
            {title && (
              <span className="text-xs sm:text-sm font-semibold text-slate-800">
                {title}
              </span>
            )}
            {subtitle && (
              <span className="text-[11px] sm:text-xs text-slate-500">
                {subtitle}
              </span>
            )}
          </div>
          {badge && (
            <div className="text-xs font-mono text-slate-500">
              {badge}
            </div>
          )}
        </div>
      )}

      <div className="w-full flex flex-col items-center justify-center">
        {children}
      </div>

      {footer && (
        <div className="w-full border-t pt-3 border-slate-200 text-xs sm:text-sm">
          {footer}
        </div>
      )}
    </figure>
  );
}

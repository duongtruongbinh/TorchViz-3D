import type { ReactNode } from 'react';
import { useLearningMdxTheme } from '../../../learningMdxComponents';
import { cx } from '../../../theme';

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
  const themeClasses = useLearningMdxTheme();
  const dividerBorder = themeClasses.isLight ? 'border-[#205089]/10' : 'border-[#A8B8C8]/14';

  return (
    <figure
      className={cx(
        'my-6 flex flex-col items-center gap-4 rounded-xl border p-4 sm:p-5 shadow-xs transition-colors',
        themeClasses.semantic.neutral.border,
        themeClasses.semantic.neutral.surface,
        className,
      )}
      aria-label={ariaLabel}
    >
      {(title || subtitle || badge) && (
        <div className={cx('w-full flex flex-wrap items-center justify-between gap-2 border-b pb-3', dividerBorder)}>
          <div className="flex flex-col gap-0.5">
            {title && (
              <span className={cx('text-xs sm:text-sm font-semibold', themeClasses.titleText)}>
                {title}
              </span>
            )}
            {subtitle && (
              <span className={cx('text-[11px] sm:text-xs', themeClasses.mutedText)}>
                {subtitle}
              </span>
            )}
          </div>
          {badge && (
            <div className={cx('text-xs font-mono', themeClasses.mutedText)}>
              {badge}
            </div>
          )}
        </div>
      )}

      <div className="w-full flex flex-col items-center justify-center">
        {children}
      </div>

      {footer && (
        <div className={cx('w-full border-t pt-3 text-xs sm:text-sm', dividerBorder, themeClasses.bodyText)}>
          {footer}
        </div>
      )}
    </figure>
  );
}

export function MathInfoPanel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const themeClasses = useLearningMdxTheme();
  return (
    <div
      className={cx(
        'rounded-lg p-3 border text-xs sm:text-sm transition-colors',
        themeClasses.semantic.neutral.border,
        themeClasses.semantic.neutral.surface,
        themeClasses.bodyText,
        className,
      )}
    >
      {children}
    </div>
  );
}

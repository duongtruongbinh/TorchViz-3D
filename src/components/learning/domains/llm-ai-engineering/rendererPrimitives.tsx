import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cx } from '../../theme';
import { LLM_RENDERER_THEME } from './rendererTheme';
import type { LlmRendererTheme } from './rendererTypes';

type LlmVisualPrimitiveProps = {
  children: ReactNode;
  className?: string;
};

export function TokenChip({ children, className }: LlmVisualPrimitiveProps) {
  const llmTheme = LLM_RENDERER_THEME;
  return <code className={cx(className, llmTheme.tokenChip)}>{children}</code>;
}

export function TokenIdBadge({ children, className }: LlmVisualPrimitiveProps) {
  const llmTheme = LLM_RENDERER_THEME;
  return <span className={cx(className, llmTheme.tokenId)}>{children}</span>;
}

export function LlmCallout({
  children,
  className,
  icon: Icon,
  themeClasses,
  tone = 'info',
}: LlmVisualPrimitiveProps & {
  themeClasses: LlmRendererTheme;
  icon: LucideIcon;
  tone?: 'info' | 'accent';
}) {
  const llmTheme = LLM_RENDERER_THEME;
  return (
    <div className={cx('flex items-start gap-3 rounded-lg border px-4 py-3.5', llmTheme.callout[tone], className)}>
      <Icon className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
      {children}
    </div>
  );
}

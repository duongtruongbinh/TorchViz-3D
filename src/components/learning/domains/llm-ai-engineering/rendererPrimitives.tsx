import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cx } from '../../theme';
import { getLlmRendererTheme } from './rendererTheme';
import type { LlmRendererTheme } from './rendererTypes';

type LlmVisualPrimitiveProps = {
  children: ReactNode;
  className?: string;
  themeClasses: LlmRendererTheme;
};

export function TokenChip({ children, className, themeClasses }: LlmVisualPrimitiveProps) {
  const llmTheme = getLlmRendererTheme(themeClasses);
  return <code className={cx(className, llmTheme.tokenChip)}>{children}</code>;
}

export function TokenIdBadge({ children, className, themeClasses }: LlmVisualPrimitiveProps) {
  const llmTheme = getLlmRendererTheme(themeClasses);
  return <span className={cx(className, llmTheme.tokenId)}>{children}</span>;
}

export function LlmCallout({
  children,
  className,
  icon: Icon,
  themeClasses,
  tone = 'info',
}: LlmVisualPrimitiveProps & {
  icon: LucideIcon;
  tone?: 'info' | 'accent';
}) {
  const llmTheme = getLlmRendererTheme(themeClasses);
  return (
    <div className={cx('flex items-start gap-3 rounded-lg border px-4 py-3.5', llmTheme.callout[tone], className)}>
      <Icon className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
      {children}
    </div>
  );
}

type StepPlaybackControlsProps = {
  isPlaying: boolean;
  labels: {
    next: string;
    pause: string;
    play: string;
    previous: string;
    reset: string;
  };
  nextDisabled: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onTogglePlay: () => void;
  playDisabled?: boolean;
  previousDisabled: boolean;
  themeClasses: LlmRendererTheme;
};

export function StepPlaybackControls({
  isPlaying,
  labels,
  nextDisabled,
  onNext,
  onPrevious,
  onReset,
  onTogglePlay,
  playDisabled = false,
  previousDisabled,
  themeClasses,
}: StepPlaybackControlsProps) {
  const llmTheme = getLlmRendererTheme(themeClasses);
  const iconButtonClass = cx(
    'grid h-9 w-9 place-items-center rounded-lg disabled:cursor-not-allowed disabled:opacity-40',
    themeClasses.focusRing,
    llmTheme.playback.secondary,
  );

  return (
    <div className="flex items-center gap-2">
      <button type="button" disabled={previousDisabled} onClick={onPrevious} className={iconButtonClass} aria-label={labels.previous}>
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        disabled={playDisabled}
        onClick={onTogglePlay}
        className={cx('flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-black disabled:cursor-not-allowed disabled:opacity-40', themeClasses.focusRing, llmTheme.playback.primary)}
      >
        {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        {isPlaying ? labels.pause : labels.play}
      </button>
      <button type="button" disabled={nextDisabled} onClick={onNext} className={iconButtonClass} aria-label={labels.next}>
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
      <button type="button" onClick={onReset} className={iconButtonClass} aria-label={labels.reset}>
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { useLearningMdxTheme } from '../learningMdxComponents';
import { cx } from '../theme';

export type StepperLabels = {
  next: string;
  pause: string;
  play: string;
  previous: string;
  reset: string;
  step: string;
};

const DEFAULT_LABELS: StepperLabels = {
  next: 'Next step',
  pause: 'Pause',
  play: 'Auto-play',
  previous: 'Previous step',
  reset: 'Reset',
  step: 'Step',
};

export interface InteractiveStepperProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  stepLabels?: string[];
  allowAutoPlay?: boolean;
  autoPlayIntervalMs?: number;
  loop?: boolean;
  ariaLabel?: string;
  labels?: Partial<StepperLabels>;
}

/** Threshold above which dot indicators are hidden to prevent overflow. */
const MAX_DOTS = 12;

export function InteractiveStepper({
  currentStep,
  totalSteps,
  onStepChange,
  stepLabels,
  allowAutoPlay = false,
  autoPlayIntervalMs = 2500,
  loop = false,
  ariaLabel = 'Step-by-step controls',
  labels: labelOverrides,
}: InteractiveStepperProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const l = { ...DEFAULT_LABELS, ...labelOverrides };
  const themeClasses = useLearningMdxTheme();
  const isLight = themeClasses.isLight;

  useEffect(() => {
    if (!isPlaying) return;

    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsPlaying(false);
      return;
    }

    const nextStep = currentStep + 1;
    if (nextStep >= totalSteps && !loop) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      if (nextStep >= totalSteps) {
        onStepChange(0); // loop back
      } else {
        onStepChange(nextStep);
      }
    }, autoPlayIntervalMs);
    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStep, totalSteps, autoPlayIntervalMs, onStepChange, loop]);

  const canGoPrev = currentStep > 0;
  const canGoNext = currentStep < totalSteps - 1;
  const showDots = totalSteps <= MAX_DOTS;

  const handlePrev = () => {
    if (canGoPrev) onStepChange(currentStep - 1);
  };

  const handleNext = () => {
    if (canGoNext) onStepChange(currentStep + 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    onStepChange(0);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // --- Theme-aware colors ---
  const containerCls = isLight
    ? 'bg-white/80 border-[#205089]/14 text-[#334155] shadow-[0_2px_8px_rgba(32,80,137,0.06)]'
    : 'bg-zinc-900/60 border-zinc-800 text-zinc-300';
  const btnIdleCls = isLight
    ? 'text-[#64748B] hover:bg-[#B8C8DA]/50 hover:text-[#205089]'
    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white';
  const btnActiveCls = isLight
    ? 'hover:bg-[#B8C8DA]/50 hover:text-[#205089] text-[#334155]'
    : 'hover:bg-zinc-800 hover:text-white text-zinc-300';
  const btnDisabledCls = isLight
    ? 'opacity-40 cursor-not-allowed text-[#94A3B8]'
    : 'opacity-40 cursor-not-allowed text-zinc-600';
  const playingCls = isLight
    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
  const dotActiveCls = isLight
    ? 'w-6 bg-[#205089] shadow-sm shadow-[#205089]/30'
    : 'w-6 bg-indigo-500 shadow-sm shadow-indigo-500/50';
  const dotPassedCls = isLight
    ? 'w-2 bg-[#205089]/35 hover:bg-[#205089]/55'
    : 'w-2 bg-indigo-400/50 hover:bg-indigo-400';
  const dotFutureCls = isLight
    ? 'w-2 bg-[#B8C8DA] hover:bg-[#9FB4CA]'
    : 'w-2 bg-zinc-700 hover:bg-zinc-600';
  const counterCls = isLight
    ? 'text-[#64748B] bg-[#EFF3F8] border-[#205089]/10'
    : 'text-zinc-400 bg-zinc-800/80 border-zinc-700/50';
  const counterAccentCls = isLight
    ? 'text-[#205089]'
    : 'text-indigo-400';

  return (
    <div
      className={cx(
        'flex flex-wrap items-center justify-between gap-3 p-3 border rounded-xl backdrop-blur-sm',
        containerCls,
      )}
      aria-label={ariaLabel}
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleReset}
          className={cx('p-1.5 rounded-lg transition-colors', btnIdleCls)}
          title={l.reset}
          aria-label={l.reset}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handlePrev}
          disabled={!canGoPrev}
          className={cx(
            'p-1.5 rounded-lg transition-colors',
            canGoPrev ? btnActiveCls : btnDisabledCls,
          )}
          title={l.previous}
          aria-label={l.previous}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {allowAutoPlay && (
          <button
            type="button"
            onClick={togglePlay}
            className={cx(
              'p-1.5 rounded-lg transition-colors',
              isPlaying ? playingCls : btnActiveCls,
            )}
            title={isPlaying ? l.pause : l.play}
            aria-label={isPlaying ? l.pause : l.play}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          className={cx(
            'p-1.5 rounded-lg transition-colors',
            canGoNext ? btnActiveCls : btnDisabledCls,
          )}
          title={l.next}
          aria-label={l.next}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Step Indicators / Dots — hidden when too many steps */}
      {showDots && (
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const isActive = index === currentStep;
            const isPassed = index < currentStep;
            const label = stepLabels?.[index] ?? `${l.step} ${index + 1}`;

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  onStepChange(index);
                }}
                title={label}
                aria-label={label}
                className={cx(
                  'h-2 rounded-full transition-all',
                  isActive ? dotActiveCls : isPassed ? dotPassedCls : dotFutureCls,
                )}
              />
            );
          })}
        </div>
      )}

      {/* Step Counter Text */}
      <div className={cx('text-xs font-mono px-2 py-0.5 rounded border', counterCls)}>
        {l.step} <span className={cx('font-semibold', counterAccentCls)}>{currentStep + 1}</span> / {totalSteps}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';

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

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-zinc-300 backdrop-blur-sm"
      aria-label={ariaLabel}
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleReset}
          className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors text-zinc-400"
          title={l.reset}
          aria-label={l.reset}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handlePrev}
          disabled={!canGoPrev}
          className={`p-1.5 rounded-lg transition-colors ${
            canGoPrev
              ? 'hover:bg-zinc-800 hover:text-white text-zinc-300'
              : 'opacity-40 cursor-not-allowed text-zinc-600'
          }`}
          title={l.previous}
          aria-label={l.previous}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {allowAutoPlay && (
          <button
            type="button"
            onClick={togglePlay}
            className={`p-1.5 rounded-lg transition-colors ${
              isPlaying
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'hover:bg-zinc-800 hover:text-white text-zinc-300'
            }`}
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
          className={`p-1.5 rounded-lg transition-colors ${
            canGoNext
              ? 'hover:bg-zinc-800 hover:text-white text-zinc-300'
              : 'opacity-40 cursor-not-allowed text-zinc-600'
          }`}
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
                className={`h-2 rounded-full transition-all ${
                  isActive
                    ? 'w-6 bg-indigo-500 shadow-sm shadow-indigo-500/50'
                    : isPassed
                      ? 'w-2 bg-indigo-400/50 hover:bg-indigo-400'
                      : 'w-2 bg-zinc-700 hover:bg-zinc-600'
                }`}
              />
            );
          })}
        </div>
      )}

      {/* Step Counter Text */}
      <div className="text-xs font-mono text-zinc-400 px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/50">
        {l.step} <span className="text-indigo-400 font-semibold">{currentStep + 1}</span> / {totalSteps}
      </div>
    </div>
  );
}

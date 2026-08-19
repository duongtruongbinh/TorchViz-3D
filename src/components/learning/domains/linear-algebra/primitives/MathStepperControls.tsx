import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLearningMdxTheme } from '../../../learningMdxComponents';
import { cx } from '../../../theme';

export interface MathStepperControlsProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
  prevLabel?: string;
  nextLabel?: string;
  ariaLabel?: string;
}

export function MathStepperControls({
  currentStep,
  totalSteps,
  onStepChange,
  prevLabel = 'Bước trước',
  nextLabel = 'Bước tiếp theo',
  ariaLabel = 'Điều khiển các bước',
}: MathStepperControlsProps) {
  const themeClasses = useLearningMdxTheme();

  const buttonClasses = cx(
    'inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg text-xs sm:text-sm font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
    themeClasses.button.secondary,
  );

  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-wrap items-center justify-center gap-3 pt-2"
    >
      <button
        type="button"
        onClick={() => onStepChange(Math.max(0, currentStep - 1))}
        disabled={currentStep === 0}
        aria-label={prevLabel}
        className={buttonClasses}
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        <span>{prevLabel}</span>
      </button>

      {/* Step dot buttons with >= 24x24 px hit target */}
      <div className="flex items-center gap-1" role="group" aria-label="Danh sách bước">
        {Array.from({ length: totalSteps }, (_, idx) => {
          const isCurrent = currentStep === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onStepChange(idx)}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`Bước ${idx + 1} trên ${totalSteps}`}
              className={cx(
                'w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-transform hover:scale-110',
                themeClasses.focusRing,
              )}
            >
              <span
                className={cx(
                  'transition-all rounded-full',
                  isCurrent
                    ? 'w-3 h-3 bg-blue-600 ring-2 ring-blue-400 ring-offset-1'
                    : themeClasses.isLight
                      ? 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                      : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-500',
                )}
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onStepChange(Math.min(totalSteps - 1, currentStep + 1))}
        disabled={currentStep === totalSteps - 1}
        aria-label={nextLabel}
        className={buttonClasses}
      >
        <span>{nextLabel}</span>
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  );
}

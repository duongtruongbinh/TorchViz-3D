import { CheckCircle2, Circle, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import { getStrings } from '../../../../lib/localization';
import { useLearningMdxLesson, useLearningMdxTheme, type LearningMdxComponent } from '../../learningMdxComponents';
import { getQuizPalette } from '../../lesson/QuizBlock';
import { cx } from '../../theme';

type MathQuizOption = {
  text: string;
  isCorrect: boolean;
  feedback: string;
};

// The Linear Algebra lessons author a single-question, single-select quiz with
// a per-option explanation. It is a different authored contract than the
// canonical `questions` array used by the LLM checkpoint quizzes.
function MathQuiz({ question, options }: { question: string; options: MathQuizOption[] }) {
  const themeClasses = useLearningMdxTheme();
  const { language } = useLearningMdxLesson();
  const quizPalette = getQuizPalette(themeClasses);
  const strings = getStrings(language).learningLab;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  const reset = () => {
    setSelectedIndex(null);
    setChecked(false);
  };

  const check = () => {
    if (selectedIndex === null) return;
    setChecked(true);
  };

  return (
    <div className={cx('py-1', quizPalette.card)}>
      <div className={cx('text-base font-normal leading-7 md:text-lg md:leading-8', quizPalette.prompt)}>{question}</div>

      <div className="mt-5 grid gap-2">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const revealCorrect = checked && option.isCorrect;
          const revealIncorrect = checked && isSelected && !option.isCorrect;
          const reveal = revealCorrect || revealIncorrect;
          return (
            <div key={index}>
              <button
                type="button"
                onClick={() => { if (!checked) setSelectedIndex(index); }}
                disabled={checked}
                aria-pressed={isSelected}
                className={cx(
                  'inline-flex min-h-12 items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm font-black leading-6 transition-colors disabled:cursor-not-allowed disabled:opacity-45',
                  isSelected
                    ? quizPalette.optionSelected
                    : checked
                      ? quizPalette.optionDisabled
                      : quizPalette.optionIdle,
                )}
              >
                <span className={cx('grid h-6 w-6 shrink-0 place-items-center transition-colors', isSelected ? quizPalette.optionMarkerSelected : quizPalette.optionMarkerIdle)}>
                  {revealCorrect ? (
                    <CheckCircle2 className="h-5 w-5" strokeWidth={2.6} aria-hidden="true" />
                  ) : revealIncorrect ? (
                    <XCircle className="h-5 w-5" strokeWidth={2.6} aria-hidden="true" />
                  ) : (
                    <Circle className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                  )}
                </span>
                <span>{option.text}</span>
              </button>
              {reveal ? (
                <div
                  className={cx(
                    'mt-2 flex gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold leading-6',
                    revealCorrect ? quizPalette.feedbackCorrect : quizPalette.feedbackIncorrect,
                  )}
                  role="status"
                >
                  {revealCorrect ? <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /> : <XCircle className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />}
                  <p>{option.feedback}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={check}
          disabled={checked || selectedIndex === null}
          className={cx(
            'inline-flex h-10 min-w-[6.5rem] items-center justify-center rounded-lg px-4 text-xs font-black transition-colors disabled:cursor-not-allowed',
            checked || selectedIndex === null ? quizPalette.disabledButton : quizPalette.checkButton,
          )}
        >
          {strings.check}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={selectedIndex === null && !checked}
          className={cx('inline-flex h-10 items-center gap-2 rounded-lg px-4 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-35', quizPalette.resetButton)}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {strings.reset}
        </button>
      </div>
    </div>
  );
}

export const mathStatisticsMdxComponents = {
  MdxQuiz: MathQuiz,
} satisfies Record<'MdxQuiz', LearningMdxComponent>;

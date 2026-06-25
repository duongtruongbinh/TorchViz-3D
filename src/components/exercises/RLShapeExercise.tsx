import { useState } from 'react';
import type { RLPracticeFixture } from './rlPracticeAdapter';

type RLShapeExerciseProps = {
  fixture: Extract<RLPracticeFixture, { type: 'mdp' }>;
  text: {
    mdpPrompt: string;
    state: string;
    action: string;
    reward: string;
    discount: string;
    check: string;
    reset: string;
    correct: string;
    incorrect: string;
  };
};

export default function RLShapeExercise({ fixture, text }: RLShapeExerciseProps) {
  const [answers, setAnswers] = useState({ state: '', action: '', reward: '', discount: '' });
  const [submitted, setSubmitted] = useState(false);
  const correct = (
    answers.state.trim().toLowerCase() === fixture.answer.state.toLowerCase()
    && answers.action.trim().toLowerCase() === fixture.answer.action.toLowerCase()
    && answers.reward.trim() === fixture.answer.reward
    && answers.discount.trim() === fixture.answer.discount
  );

  return (
    <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
      <p className="text-sm leading-6 text-zinc-300">{text.mdpPrompt}</p>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-md border border-zinc-800 bg-zinc-900/70 p-3">
          <div className="text-xs font-bold uppercase text-zinc-500">MDP</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {fixture.states.map((state) => (
              <span key={state} className="rounded-md border border-sky-300/30 bg-sky-400/10 px-3 py-2 text-sm font-bold text-sky-100">{state}</span>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-xs text-zinc-300">
            {fixture.transitions.map((transition) => (
              <div key={`${transition.from}-${transition.action}-${transition.to}`} className="rounded border border-zinc-800 bg-black/20 px-3 py-2 font-mono">
                {transition.from} --{transition.action}, r={transition.reward}--&gt; {transition.to}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-2">
          {(['state', 'action', 'reward', 'discount'] as const).map((field) => (
            <label key={field} className="block">
              <span className="mb-1 block text-[11px] font-bold uppercase text-zinc-500">{text[field]}</span>
              <input
                value={answers[field]}
                onChange={(event) => setAnswers((current) => ({ ...current, [field]: event.currentTarget.value }))}
                className="h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-teal-300"
              />
            </label>
          ))}
        </div>
      </div>
      <ExerciseActions
        check={text.check}
        reset={text.reset}
        submitted={submitted}
        correct={correct}
        correctText={text.correct}
        incorrectText={text.incorrect}
        onCheck={() => setSubmitted(true)}
        onReset={() => {
          setAnswers({ state: '', action: '', reward: '', discount: '' });
          setSubmitted(false);
        }}
      />
    </div>
  );
}

function ExerciseActions({
  check,
  reset,
  submitted,
  correct,
  correctText,
  incorrectText,
  onCheck,
  onReset,
}: {
  check: string;
  reset: string;
  submitted: boolean;
  correct: boolean;
  correctText: string;
  incorrectText: string;
  onCheck: () => void;
  onReset: () => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button type="button" onClick={onCheck} className="rounded-md border border-teal-200/50 bg-teal-400/15 px-4 py-2 text-sm font-bold text-teal-50 hover:bg-teal-400/25">
        {check}
      </button>
      <button type="button" onClick={onReset} className="rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-300 hover:border-zinc-500">
        {reset}
      </button>
      {submitted && (
        <span className={`text-sm font-bold ${correct ? 'text-teal-200' : 'text-amber-200'}`}>
          {correct ? correctText : incorrectText}
        </span>
      )}
    </div>
  );
}

export { ExerciseActions };

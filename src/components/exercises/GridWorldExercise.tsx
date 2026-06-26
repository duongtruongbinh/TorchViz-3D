import { useState } from 'react';
import { checkRLNumericAnswer, type RLPracticeFixture } from '../learning/practice/adapters/reinforcementPracticeAdapter';
import { ExerciseActions } from './RLShapeExercise';

type GridWorldExerciseProps = {
  fixture: Extract<RLPracticeFixture, { type: 'gridworld' }>;
  text: {
    gridPrompt: string;
    qLearningFormula: string;
    sarsaFormula: string;
    check: string;
    reset: string;
    correct: string;
    incorrect: string;
  };
};

export default function GridWorldExercise({ fixture, text }: GridWorldExerciseProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const correct = checkRLNumericAnswer(answer, fixture.answer);
  const formula = fixture.algorithm === 'q-learning' ? text.qLearningFormula : text.sarsaFormula;

  return (
    <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
      <p className="text-sm leading-6 text-zinc-300">{text.gridPrompt}</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-[18rem_1fr]">
        <div className="grid aspect-square grid-cols-4 gap-1 rounded-md border border-zinc-800 bg-zinc-900/70 p-2">
          {Array.from({ length: fixture.gridSize * fixture.gridSize }).map((_, index) => {
            const label = `S${index}`;
            const active = label === fixture.state;
            const goal = index === fixture.gridSize * fixture.gridSize - 1;
            return (
              <div
                key={label}
                className={`flex items-center justify-center rounded border text-xs font-black ${
                  active
                    ? 'border-teal-200 bg-teal-400/25 text-teal-50'
                    : goal
                      ? 'border-amber-200/50 bg-amber-400/15 text-amber-100'
                      : 'border-zinc-800 bg-black/20 text-zinc-500'
                }`}
              >
                {goal ? 'G' : label}
              </div>
            );
          })}
        </div>
        <div>
          <div className="rounded-md border border-zinc-800 bg-zinc-900/70 p-3 font-mono text-xs leading-6 text-zinc-200">
            <div>{formula}</div>
            <div>state={fixture.state}, action={fixture.action}, reward={fixture.reward}</div>
            <div>Q={fixture.currentQ}, alpha={fixture.alpha}, gamma={fixture.gamma}</div>
            <div>{fixture.algorithm === 'q-learning' ? `max next Q=${fixture.nextMaxQ}` : `next action Q=${fixture.nextActionQ}`}</div>
          </div>
          <label className="mt-3 block">
            <span className="mb-1 block text-[11px] font-bold uppercase text-zinc-500">updated Q</span>
            <input
              value={answer}
              onChange={(event) => setAnswer(event.currentTarget.value)}
              className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-teal-300"
            />
          </label>
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
          setAnswer('');
          setSubmitted(false);
        }}
      />
    </div>
  );
}

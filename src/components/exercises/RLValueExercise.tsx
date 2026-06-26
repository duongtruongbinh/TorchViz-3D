import { useState } from 'react';
import { checkRLNumericAnswer, type RLPracticeFixture } from '../learning/practice/adapters/reinforcementPracticeAdapter';
import { ExerciseActions } from './RLShapeExercise';

type RLValueExerciseProps = {
  fixture: Extract<RLPracticeFixture, { type: 'bellman' }>;
  text: {
    bellmanPrompt: string;
    check: string;
    reset: string;
    correct: string;
    incorrect: string;
  };
};

export default function RLValueExercise({ fixture, text }: RLValueExerciseProps) {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const correct = checkRLNumericAnswer(answer, fixture.answer);

  return (
    <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
      <p className="text-sm leading-6 text-zinc-300">{text.bellmanPrompt}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_16rem]">
        <div className="rounded-md border border-zinc-800 bg-zinc-900/70 p-3">
          <div className="text-xs font-bold uppercase text-zinc-500">Q({fixture.state}, a)</div>
          <div className="mt-3 grid gap-2">
            {fixture.qValues.map((item) => (
              <div key={item.action} className="flex justify-between rounded border border-zinc-800 bg-black/20 px-3 py-2 font-mono text-sm text-zinc-200">
                <span>{item.action}</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="mb-1 block text-[11px] font-bold uppercase text-zinc-500">max Q</span>
          <input
            value={answer}
            onChange={(event) => setAnswer(event.currentTarget.value)}
            className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-teal-300"
          />
        </label>
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

import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { InlineMath } from '../../learningMdxComponents';

type Sample = { x: [number, number]; y: 1 | -1 };
type ExerciseMode = 'updates' | 'convergence';
type Answer = string[];
type Labels = {
  randomize: string; sample: string; vector: string; label: string;
  step: string; score: string; prediction: string; weight: string;
  check: string; clear: string; correct: string; incorrect: string;
  missing: string; expected: string; complete: string;
  initialWeight: string; randomWeight: string; invalidWeight: string; bias: string;
  method?: string; passes?: string; stochastic?: string; batch?: string; convergenceLimit?: string;
};
const initialSamples: Sample[] = [
  { x: [2, 1], y: 1 }, { x: [1, 2], y: -1 },
  { x: [-1, -1], y: -1 }, { x: [2, -1], y: 1 },
];
const emptyAnswers = (mode: ExerciseMode): Answer[] => mode === 'convergence'
  ? Array.from({ length: 2 }, () => ['', '', '', ''])
  : Array.from({ length: 4 }, () => ['', '', '', '', '']);

function solve(samples: Sample[], initialWeight: [number, number] = [0, 0], initialBias = 0) {
  let w: [number, number] = [...initialWeight];
  let b = initialBias;
  return samples.map(({ x, y }) => {
    const score = w[0] * x[0] + w[1] * x[1] + b;
    const prediction = score >= 0 ? 1 : -1;
    if (prediction !== y) {
      w = [w[0] + y * x[0], w[1] + y * x[1]];
      b += y;
    }
    return [score, prediction, ...w, b];
  });
}

function solveConvergence(samples: Sample[], initialWeight: [number, number], initialBias: number, batch: boolean) {
  let w: [number, number] = [...initialWeight];
  let b = initialBias;
  const predictsCorrectly = ({ x, y }: Sample) => (w[0] * x[0] + w[1] * x[1] + b >= 0 ? 1 : -1) === y;
  if (samples.every(predictsCorrectly)) return [0, ...w, b];
  for (let pass = 1; pass <= 5000; pass++) {
    if (batch) {
      const mistakes = samples.filter((sample) => !predictsCorrectly(sample));
      for (const { x, y } of mistakes) {
        w = [w[0] + y * x[0], w[1] + y * x[1]];
        b += y;
      }
    } else {
      for (const sample of samples) {
        if (!predictsCorrectly(sample)) {
          w = [w[0] + sample.y * sample.x[0], w[1] + sample.y * sample.x[1]];
          b += sample.y;
        }
      }
    }
    if (samples.every(predictsCorrectly)) return [pass, ...w, b];
  }
  return null;
}

function randomSamples(initialWeight: [number, number], initialBias: number): Sample[] {
  const integer = () => Math.floor(Math.random() * 7) - 3;
  for (let attempt = 0; attempt < 100; attempt++) {
    const normal = [integer(), integer()];
    if (normal.every((value) => value === 0)) continue;
    const samples: Sample[] = [];
    while (samples.length < 4) {
      const x: [number, number] = [integer(), integer()];
      const score = normal[0] * x[0] + normal[1] * x[1];
      if (score === 0 || samples.some((sample) => sample.x[0] === x[0] && sample.x[1] === x[1])) continue;
      samples.push({ x, y: score > 0 ? 1 : -1 });
    }
    const steps = solve(samples, initialWeight, initialBias);
    const updates = steps.filter((step, index) => step[1] !== samples[index].y).length;
    if (samples.some((sample) => sample.y === 1) && samples.some((sample) => sample.y === -1) && updates >= 2) return samples;
  }
  return initialSamples;
}

export function PerceptronExercise({ labels, children, mode = 'updates' }: { labels: Labels; children?: ReactNode; mode?: ExerciseMode }) {
  const id = useId();
  const [samples, setSamples] = useState(initialSamples);
  const [answers, setAnswers] = useState(() => emptyAnswers(mode));
  const [checked, setChecked] = useState(false);
  const [weightInputs, setWeightInputs] = useState<[string, string, string]>(['0', '0', '0']);
  const initialWeight: [number, number] = [Number(weightInputs[0]), Number(weightInputs[1])];
  const validWeight = weightInputs.every((value) => value.trim() !== '' && Number.isSafeInteger(Number(value)));
  const initialBias = Number(weightInputs[2]);
  const solution = useMemo(() => {
    if (!validWeight) return [];
    const w: [number, number] = [Number(weightInputs[0]), Number(weightInputs[1])];
    const b = Number(weightInputs[2]);
    if (mode === 'updates') return solve(samples, w, b);
    const stochastic = solveConvergence(samples, w, b, false);
    const batch = solveConvergence(samples, w, b, true);
    return stochastic && batch ? [stochastic, batch] : [];
  }, [samples, weightInputs, validWeight, mode]);
  const totalFields = mode === 'convergence' ? 8 : 20;
  const methods = [labels.stochastic, labels.batch];
  const isCorrect = (row: number, column: number) => answers[row][column].trim() !== ''
    && Number(answers[row][column]) === solution[row]?.[column];
  const correctCount = answers.reduce((total, row, index) => total + row.filter((_, column) => isCorrect(index, column)).length, 0);
  const reset = () => { setAnswers(emptyAnswers(mode)); setChecked(false); };
  const buttonClass = 'rounded-lg border border-[#B8C8DA] px-4 py-2 text-sm font-medium text-[#205089] hover:bg-[#EFF3F8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#205089]';
  const cellClass = 'border-b border-[#B8C8DA] px-3 py-3 text-left';
  const field = (row: number, column: number, name: string) => {
    const value = answers[row][column];
    const correct = isCorrect(row, column);
    const feedbackId = `${id}-${row}-${column}`;
    return <div className="min-w-[80px]">
      <input type="text" inputMode="numeric" value={value} aria-label={`${mode === 'convergence' ? methods[row] : `${labels.step} ${row + 1}`}, ${name}`}
        aria-invalid={checked && !correct} aria-describedby={checked ? feedbackId : undefined}
        className={`w-20 rounded-md border bg-white px-2 py-2 text-[#172A43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#205089] ${checked ? correct ? 'border-[#28734B]' : 'border-[#9F3450]' : 'border-[#B8C8DA]'}`}
        onChange={(event) => {
          const next = event.target.value;
          setAnswers((current) => current.map((answer, index) => index === row
            ? answer.map((entry, position) => position === column ? next : entry) as Answer : answer));
          setChecked(false);
        }} />
      {checked && <p id={feedbackId} className={`mt-1 text-xs ${correct ? 'text-[#28734B]' : 'text-[#9F3450]'}`}>
        {correct ? labels.correct : value.trim() === '' ? labels.missing : labels.incorrect}
        {!correct && <span className="block">{labels.expected} <InlineMath formula={`${solution[row][column]}`} /></span>}
      </p>}
    </div>;
  };
  const initialField = (index: number) => <input type="number" step="1" value={weightInputs[index]}
    aria-label={`${labels.initialWeight}, ${index === 2 ? 'b' : `w${index + 1}`}`}
    aria-invalid={weightInputs[index].trim() === '' || !Number.isSafeInteger(Number(weightInputs[index]))}
    aria-describedby={!validWeight ? `${id}-weight-error` : undefined}
    className="w-20 rounded-md border border-[#B8C8DA] bg-white px-2 py-2 text-[#172A43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#205089]"
    onChange={(event) => {
      const next = event.target.value;
      setWeightInputs((current) => current.map((value, position) => position === index ? next : value) as [string, string, string]);
      reset();
    }} />;
  return <div className="my-5">
    <button type="button" className={buttonClass} onClick={() => { setSamples(randomSamples(validWeight ? initialWeight : [0, 0], validWeight ? initialBias : 0)); reset(); }}>{labels.randomize}</button>
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-[#172A43]">
        <thead className="bg-[#EFF3F8]"><tr>{[labels.sample, labels.vector, labels.label].map((label) => <th key={label} scope="col" className={cellClass}>{label}</th>)}</tr></thead>
        <tbody>{samples.map((sample, index) => <tr key={index}>
          <td className={cellClass}><InlineMath formula={`${index + 1}`} /></td>
          <td className={cellClass}><InlineMath formula={`x^{(${index + 1})}=(${sample.x.join(',')})`} /></td>
          <td className={cellClass}><InlineMath formula={`y^{(${index + 1})}=${sample.y === 1 ? '+1' : '-1'}`} /></td>
        </tr>)}</tbody>
      </table>
    </div>
    <button type="button" className={buttonClass} onClick={() => {
      setWeightInputs(Array.from({ length: 3 }, () => `${Math.floor(Math.random() * 7) - 3}`) as [string, string, string]);
      reset();
    }}>{labels.randomWeight}</button>
    <div className="my-4 flex flex-wrap items-center gap-x-8 gap-y-4 text-[#205089]">
      <span>{labels.initialWeight}</span>
      <div className="flex items-center gap-3">
        <InlineMath formula="w=(" />
        {initialField(0)}
        <InlineMath formula="," />
        {initialField(1)}
        <InlineMath formula=")" />
      </div>
      <div className="flex items-center gap-3">
        <InlineMath formula="b=" />
        {initialField(2)}
      </div>
    </div>
    {!validWeight && <p id={`${id}-weight-error`} role="status" className="text-sm text-[#9F3450]">{labels.invalidWeight}</p>}
    {children}
    {validWeight && solution.length === 0 && <p role="status" className="text-sm text-[#9F3450]">{labels.convergenceLimit}</p>}
    {mode === 'convergence' ? <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-[#172A43]">
        <thead className="bg-[#EFF3F8]"><tr>{[labels.method, labels.passes, labels.weight, labels.bias].map((label) => <th key={label} scope="col" className={cellClass}>{label}</th>)}</tr></thead>
        <tbody>{methods.map((method, row) => <tr key={method}>
          <th scope="row" className={cellClass}>{method}</th>
          <td className={cellClass}>{field(row, 0, labels.passes ?? '')}</td>
          <td className={cellClass}><div className="flex items-start gap-2"><InlineMath formula="w=(" />{field(row, 1, 'w₁')}<InlineMath formula="," />{field(row, 2, 'w₂')}<InlineMath formula=")" /></div></td>
          <td className={cellClass}>{field(row, 3, labels.bias)}</td>
        </tr>)}</tbody>
      </table>
    </div> : (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-[#172A43]">
        <thead className="bg-[#EFF3F8]"><tr>{[labels.step, labels.vector, labels.score, labels.label, labels.prediction, labels.weight, labels.bias].map((label) => <th key={label} scope="col" className={cellClass}>{label}{label === labels.score && <> <InlineMath formula="f" /></>}</th>)}</tr></thead>
        <tbody>{samples.map((sample, row) => <tr key={row}>
          <th scope="row" className={cellClass}><InlineMath formula={`${row + 1}`} /></th>
          <td className={cellClass}><InlineMath formula={`(${sample.x.join(',')})`} /></td>
          <td className={cellClass}>{field(row, 0, `${labels.score} f`)}</td>
          <td className={cellClass}><InlineMath formula={sample.y === 1 ? '+1' : '-1'} /></td>
          <td className={cellClass}>{field(row, 1, labels.prediction)}</td>
          <td className={cellClass}><div className="flex items-start gap-2"><InlineMath formula="w=(" />{field(row, 2, 'w₁')}<InlineMath formula="," />{field(row, 3, 'w₂')}<InlineMath formula=")" /></div></td>
          <td className={cellClass}>{field(row, 4, labels.bias)}</td>
        </tr>)}</tbody>
      </table>
    </div>
    )}
    <div className="flex flex-wrap gap-3">
      <button type="button" disabled={!validWeight || solution.length === 0} className={`${buttonClass} bg-[#205089] !text-white hover:!bg-[#183E6B] disabled:cursor-not-allowed disabled:opacity-50`} onClick={() => setChecked(true)}>{labels.check}</button>
      <button type="button" className={buttonClass} onClick={reset}>{labels.clear}</button>
    </div>
    <p role="status" aria-live="polite" className="mt-3 text-sm text-[#205089]">{checked && (correctCount === totalFields ? labels.complete : `${labels.correct} ${correctCount}/${totalFields}`)}</p>
  </div>;
}

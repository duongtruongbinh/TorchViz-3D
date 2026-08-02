import { useState } from 'react';
import { useLearningMdxTheme } from '../../learningMdxComponents';
import { cx } from '../../theme';

type SequenceKind =
  | 'equal-mean'
  | 'deviations'
  | 'cancellation'
  | 'squared'
  | 'hand-calculation'
  | 'standard-deviation'
  | 'degrees-freedom'
  | 'formula-choice';

const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
const variance = (values: number[]) => {
  const average = mean(values);
  return values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
};
const format = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2);

function ReadableStatLabel({ children }: { children: string }) {
  const parts = children.split('x̄');
  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {index > 0 ? <span className="overline">x</span> : null}
          {part}
        </span>
      ))}
    </>
  );
}

function NumberLine({ data, domain, label, meanLabel }: { data: number[]; domain?: [number, number]; label: string; meanLabel: string }) {
  const theme = useLearningMdxTheme();
  const min = domain?.[0] ?? Math.min(...data, 0) - 1;
  const max = domain?.[1] ?? Math.max(...data, 10) + 1;
  const average = mean(data);
  const x = (value: number) => ((value - min) / (max - min)) * 100;
  const counts = new Map<number, number>();
  const ticks = Array.from({ length: 7 }, (_, index) => min + ((max - min) / 6) * index);
  return (
    <div className="min-w-0">
      <p className={cx('mb-1 text-center text-sm font-black', theme.titleText)}>{label}</p>
      <div role="img" aria-label={`${label}. ${meanLabel} ${format(average)}.`} className="relative mx-8 h-28 sm:mx-10">
        <span className={cx('absolute left-0 right-0 top-[4.25rem] h-0.5', theme.isLight ? 'bg-[#71869B]' : 'bg-[#8296AA]')} />
        {ticks.map((tick) => <span key={tick} className="absolute top-[3.95rem] -translate-x-1/2" style={{ left: `${x(tick)}%` }}>
          <span className={cx('block h-3 border-l', theme.isLight ? 'border-[#71869B]' : 'border-[#8296AA]')} />
          <span className={cx('mt-1 block whitespace-nowrap text-xs font-bold', theme.mutedText)}>{format(tick)}</span>
        </span>)}
        <span className={cx('absolute bottom-10 top-5 -translate-x-1/2 border-l-2 border-dashed', theme.isLight ? 'border-[#B76825]' : 'border-[#F0B172]')} style={{ left: `${x(average)}%` }} />
        <span className={cx('absolute top-0 -translate-x-1/2 whitespace-nowrap text-xs font-black', theme.accentText)} style={{ left: `${x(average)}%` }}>{meanLabel} {format(average)}</span>
        {data.map((value, index) => {
          const level = counts.get(value) ?? 0;
          counts.set(value, level + 1);
          return <span key={`${value}-${index}`} className={cx('absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full border', theme.isLight ? 'border-[#205089] bg-[#2F78B7]' : 'border-[#D5EEFF] bg-[#8CC8F2]')} style={{ left: `${x(value)}%`, top: `${50 - level * 17}px` }} />;
        })}
      </div>
    </div>
  );
}

export function VarianceConceptVisual({ ariaLabel, caption, data = [2, 4, 6, 8, 10], labels, kind }: {
  ariaLabel: string;
  caption: string;
  data?: number[];
  labels: string[];
  kind: SequenceKind;
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';

  let content: React.ReactNode;
  if (kind === 'equal-mean') {
    content = (
      <div className="grid divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <NumberLine data={[4, 5, 5, 5, 6]} label={labels[0]} meanLabel={labels[2]} />
        <NumberLine data={[1, 3, 5, 7, 9]} label={labels[1]} meanLabel={labels[2]} />
      </div>
    );
  } else if (kind === 'formula-choice') {
    content = (
      <div className={cx('grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0', theme.isLight ? 'divide-[#205089]/10' : 'divide-[#A8D4FF]/12')}>
        {labels.slice(0, 2).map((label, index) => (
          <section key={label} className="grid gap-3 px-5 py-6 text-center">
            <p className={cx('text-sm font-black', theme.accentText)}>{label}</p>
            <p className={cx('font-mono text-xl font-black', theme.titleText)}>{labels[index + 4]}</p>
            <p className={cx('text-sm font-semibold leading-6', theme.bodyText)}>{labels[index + 2]}</p>
          </section>
        ))}
      </div>
    );
  } else if (kind === 'degrees-freedom') {
    content = (
      <div className="grid gap-4 px-5 py-6 sm:grid-cols-4">
        {[-2, -1, 1, 2].map((value, index) => (
          <div key={index} className={cx('rounded-xl border px-3 py-4 text-center', border, index === 3 && (theme.isLight ? 'bg-[#FFF6E8]' : 'bg-[#F2C66D]/8'))}>
            <p className={cx('text-xs font-bold', theme.mutedText)}>{labels[index] ?? `${index + 1}`}</p>
            <p className={cx('mt-2 font-mono text-xl font-black', index === 3 ? theme.accentText : theme.titleText)}>{value > 0 ? `+${value}` : value}</p>
            <p className={cx('mt-2 text-xs font-semibold', theme.bodyText)}>{index === 3 ? labels[4] : labels[5]}</p>
          </div>
        ))}
      </div>
    );
  } else {
    const average = mean(data);
    const deviations = data.map((value) => value - average);
    const squared = deviations.map((value) => value ** 2);
    const rows = data.map((value, index) => ({ value, deviation: deviations[index], squared: squared[index] }));
    const showsSquared = kind === 'squared' || kind === 'hand-calculation' || kind === 'standard-deviation';
    const showsSummary = kind === 'hand-calculation' || kind === 'standard-deviation';
    const dataVariance = showsSummary ? variance(data) : null;
    content = (
      <div className="overflow-x-auto px-4 py-5 sm:px-6">
        <table className="w-full min-w-[32rem] border-collapse text-center text-sm">
          <thead><tr className={theme.isLight ? 'bg-[#EAF1F7]' : 'bg-[#A8D4FF]/8'}>
            <th className="px-3 py-3 font-black"><ReadableStatLabel>{labels[0]}</ReadableStatLabel></th>
            <th className="px-3 py-3 font-black"><ReadableStatLabel>{labels[1]}</ReadableStatLabel></th>
            {showsSquared && <th className="px-3 py-3 font-black"><ReadableStatLabel>{labels[2]}</ReadableStatLabel></th>}
          </tr></thead>
          <tbody>{rows.map((row, index) => <tr key={`${row.value}-${index}`} className={cx('border-t', border)}>
            <td className="px-3 py-3 font-bold">{row.value}</td>
            <td className={cx('px-3 py-3 font-mono font-black', row.deviation === 0 ? theme.mutedText : theme.accentText)}>{row.deviation > 0 ? '+' : ''}{format(row.deviation)}</td>
            {showsSquared && <td className="px-3 py-3 font-mono font-black">{format(row.squared)}</td>}
          </tr>)}</tbody>
          <tfoot><tr className={cx('border-t-2', border)}>
            <td className="px-3 py-3 font-black"><ReadableStatLabel>{labels[3] ?? labels[2]}</ReadableStatLabel></td>
            <td className="px-3 py-3 font-mono font-black">{format(deviations.reduce((sum, value) => sum + value, 0))}</td>
            {showsSquared && <td className="px-3 py-3 font-mono font-black">{format(squared.reduce((sum, value) => sum + value, 0))}</td>}
          </tr></tfoot>
        </table>
        {dataVariance !== null && <div className={cx('mt-4 grid gap-2 rounded-xl px-4 py-3 text-sm font-bold sm:grid-cols-2', theme.isLight ? 'bg-[#EDF7F1] text-[#285C38]' : 'bg-[#7FD3B1]/8 text-[#BFE8D7]')}>
          <span>{labels[4]} {format(dataVariance)}</span>
          <span>{labels[5]} {format(Math.sqrt(dataVariance))}</span>
        </div>}
      </div>
    );
  }

  return (
    <figure aria-label={ariaLabel} className={cx('overflow-hidden rounded-2xl border', border, theme.isLight ? 'bg-white' : 'bg-[#121A24]/45')}>
      {content}
      <figcaption className={cx('border-t px-5 py-3 text-sm font-bold leading-6 sm:px-6', border, theme.bodyText)}>{caption}</figcaption>
    </figure>
  );
}

export function VariancePointExplorer({ caption, data, feedback, labels, max, min, step }: {
  caption: string;
  data: number[];
  feedback: { far: string; near: string };
  labels: string[];
  max: number;
  min: number;
  step: number;
}) {
  const theme = useLearningMdxTheme();
  const [movingPoint, setMovingPoint] = useState(data.at(-1) ?? max);
  const values = [...data.slice(0, -1), movingPoint];
  const average = mean(values);
  const selectedDeviation = movingPoint - average;
  const datasetVariance = variance(values);
  const border = theme.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';
  const isFar = Math.abs(selectedDeviation) > (max - min) / 4;
  return (
    <section aria-label={caption} className={cx('overflow-hidden rounded-2xl border', border, theme.isLight ? 'bg-white' : 'bg-[#121A24]/45')}>
      <div className="px-4 pt-5 sm:px-6"><NumberLine data={values} domain={[min, max]} label={labels[0]} meanLabel={labels[1]} /></div>
      <div className={cx('grid gap-4 border-t px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto]', border)}>
        <label className={cx('grid gap-2 text-sm font-black', theme.titleText)}>
          <span>{labels[2]}: {format(movingPoint)}</span>
          <input type="range" min={min} max={max} step={step} value={movingPoint} onChange={(event) => setMovingPoint(Number(event.target.value))} className="w-full accent-[#2F78B7]" />
        </label>
        <dl className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm sm:grid-cols-4">
          {[[labels[1], average], [labels[3], selectedDeviation], [labels[4], selectedDeviation ** 2], [labels[5], datasetVariance], [labels[6], Math.sqrt(datasetVariance)]].map(([label, value]) => <div key={String(label)}><dt className={cx('text-xs font-bold', theme.mutedText)}>{label}</dt><dd className={cx('font-mono font-black', theme.titleText)}>{format(Number(value))}</dd></div>)}
        </dl>
      </div>
      <p aria-live="polite" className={cx('border-t px-5 py-3 text-sm font-bold leading-6', border, isFar ? theme.accentText : theme.bodyText)}>{isFar ? feedback.far : feedback.near}</p>
    </section>
  );
}

export function VarianceEstimatorComparison({ caption, labels, trueVariance }: {
  caption: string;
  labels: string[];
  trueVariance: number;
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';
  const series = [
    { label: labels[0], values: [8, 12, 16, 18, 20, 22, 24, 28, 32] },
    { label: labels[1], values: [10, 15, 20, 22, 25, 28, 30, 35, 40] },
  ];
  const domainMax = Math.ceil(Math.max(trueVariance, ...series.flatMap((item) => item.values)) * 1.1);
  return (
    <figure aria-label={caption} className={cx('overflow-hidden rounded-2xl border', border, theme.isLight ? 'bg-white' : 'bg-[#121A24]/45')}>
      <div className={cx('grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0', theme.isLight ? 'divide-[#205089]/10' : 'divide-[#A8D4FF]/12')}>
        {series.map((item, seriesIndex) => {
          const average = mean(item.values);
          return <section key={item.label} className="px-5 py-5">
          <h3 className={cx('text-sm font-black', theme.titleText)}>{item.label}</h3>
          <div className="relative mt-5 h-28" role="img" aria-label={`${item.label}. ${labels[2]} ${format(average)}. ${labels[3]} ${trueVariance}.`}>
            <span className={cx('absolute bottom-7 left-0 right-0 h-0.5', theme.isLight ? 'bg-[#71869B]' : 'bg-[#8296AA]')} />
            <span className="absolute bottom-7 top-0 w-0.5 bg-[#B76825]" style={{ left: `${(trueVariance / domainMax) * 100}%` }} />
            {item.values.map((value, index) => <span key={`${value}-${index}`} className={cx('absolute h-3 w-3 -translate-x-1/2 rounded-full', seriesIndex === 0 ? theme.isLight ? 'bg-[#71869B]' : 'bg-[#A7B6C5]' : theme.isLight ? 'bg-[#2F78B7]' : 'bg-[#8CC8F2]')} style={{ left: `${(value / domainMax) * 100}%`, bottom: `${34 + (index % 3) * 17}px` }} />)}
            <span className={cx('absolute bottom-0 left-0 text-xs font-bold', theme.mutedText)}>0</span>
            <span className={cx('absolute bottom-0 right-0 text-xs font-bold', theme.mutedText)}>{format(domainMax)}</span>
          </div>
          <p className={cx('text-sm font-black', seriesIndex === 0 ? theme.mutedText : theme.accentText)}>{labels[2]} {format(average)}</p>
        </section>;
        })}
      </div>
      <figcaption className={cx('border-t px-5 py-3 text-sm font-bold leading-6 sm:px-6', border, theme.bodyText)}>{caption}</figcaption>
    </figure>
  );
}

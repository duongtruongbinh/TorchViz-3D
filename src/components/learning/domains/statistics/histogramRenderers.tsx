import { ArrowDown, ChartColumnBig } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLearningMdxTheme } from '../../learningMdxComponents';
import { cx } from '../../theme';

type HistogramData = {
  counts: number[];
  edges: number[];
  max: number;
  min: number;
};

function buildHistogram(data: number[], binCount: number, domain?: [number, number]): HistogramData {
  const min = domain?.[0] ?? Math.min(...data);
  const max = domain?.[1] ?? Math.max(...data);
  const width = (max - min) / binCount || 1;
  const edges = Array.from({ length: binCount + 1 }, (_, index) => min + width * index);
  const counts = Array.from({ length: binCount }, () => 0);
  for (const value of data) {
    const index = value === max ? binCount - 1 : Math.min(binCount - 1, Math.floor((value - min) / width));
    counts[index] += 1;
  }
  return { counts, edges, max, min };
}

function HistogramSvg({ axisLabel, binCount, caption, countLabel, data, compact = false, domain, maxCountOverride, rangeLabel }: {
  axisLabel: string;
  binCount: number;
  caption: string;
  countLabel: string;
  data: number[];
  compact?: boolean;
  domain?: [number, number];
  maxCountOverride?: number;
  rangeLabel: string;
}) {
  const theme = useLearningMdxTheme();
  const histogram = useMemo(() => buildHistogram(data, binCount, domain), [binCount, data, domain]);
  const maxCount = maxCountOverride ?? Math.max(...histogram.counts, 1);
  const left = 48;
  const right = 692;
  const top = 20;
  const bottom = 216;
  const chartWidth = right - left;
  const chartHeight = bottom - top;
  const barWidth = chartWidth / binCount;
  const axis = theme.isLight ? '#71869B' : '#8296AA';
  const fill = theme.isLight ? '#2F78B7' : '#8CC8F2';
  const stroke = theme.isLight ? '#205089' : '#C5E5FA';

  const formatEdge = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(1);

  return (
    <div role="group" aria-label={caption} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 px-2 pb-2 sm:px-3">
      <span className={cx('self-center text-xs font-bold [writing-mode:vertical-rl] rotate-180', theme.mutedText)}>{countLabel}</span>
      <div className="min-w-0">
        <svg viewBox="0 0 720 226" aria-hidden="true" className={cx('w-full', compact ? 'h-40' : 'h-52')} preserveAspectRatio="none">
          <path d={`M${left} ${top}V${bottom}H${right}`} fill="none" stroke={axis} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {histogram.counts.map((count, index) => {
            const height = (count / maxCount) * (chartHeight - 12);
            return (
              <rect
                key={index}
                x={left + index * barWidth}
                y={bottom - height}
                width={Math.max(barWidth, 1)}
                height={height}
                fill={fill}
                fillOpacity={0.78}
                stroke={stroke}
                strokeWidth={binCount > 20 ? 0.65 : 1.2}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        <div className={cx('grid grid-cols-[auto_1fr_auto] items-start gap-2 px-1 text-xs font-bold', theme.mutedText)}>
          <span>{formatEdge(histogram.min)}</span>
          <span className="text-center">{axisLabel}</span>
          <span className="text-right">{formatEdge(histogram.max)}</span>
        </div>
      </div>
      <table className="sr-only">
        <caption>{caption}</caption>
        <thead><tr><th scope="col">{rangeLabel}</th><th scope="col">{countLabel}</th></tr></thead>
        <tbody>
          {histogram.counts.map((count, index) => (
            <tr key={index}>
              <td>{`[${formatEdge(histogram.edges[index])}, ${formatEdge(histogram.edges[index + 1])}${index === histogram.counts.length - 1 ? ']' : ')'}`}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HistogramConstructionVisual({ axisLabel, binEdges, caption, countLabel, data, rangeLabel, step }: {
  axisLabel: string;
  binEdges: number[];
  caption: string;
  countLabel: string;
  data: number[];
  rangeLabel: string;
  step: 2 | 3 | 4 | 5 | 6;
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';
  const min = binEdges[0];
  const max = binEdges.at(-1) ?? binEdges[0] + 1;
  const xPercentFor = (value: number) => 6 + ((value - min) / (max - min)) * 88;
  const displayed = step === 2 ? data.slice(0, 10) : data;
  const bins = binEdges.slice(0, -1).map((left, index) => ({ left, right: binEdges[index + 1], values: [] as number[] }));
  for (const value of data) {
    const binIndex = value === max ? bins.length - 1 : bins.findIndex((bin) => value >= bin.left && value < bin.right);
    if (binIndex >= 0) bins[binIndex].values.push(value);
  }

  if (step === 6) {
    return (
      <figure className={cx('overflow-hidden rounded-2xl border', border, theme.isLight ? 'bg-white' : 'bg-[#121A24]/45')}>
        <HistogramSvg axisLabel={axisLabel} binCount={bins.length} caption={caption} countLabel={countLabel} data={data} domain={[min, max]} rangeLabel={rangeLabel} />
        <figcaption className={cx('border-t px-5 py-3 text-sm font-bold leading-6 sm:px-6', border, theme.bodyText)}>{caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className={cx('overflow-hidden rounded-2xl border', border, theme.isLight ? 'bg-white' : 'bg-[#121A24]/45')}>
      <div role="img" aria-label={caption} className="relative mx-4 h-64 sm:mx-6">
        {step >= 4 ? bins.map((bin, index) => {
          const left = xPercentFor(bin.left);
          const width = xPercentFor(bin.right) - left;
          return <span key={bin.left} className={cx('absolute bottom-11 top-5', index % 2 === 0 ? theme.isLight ? 'bg-[#2F78B7]/7' : 'bg-[#8CC8F2]/7' : theme.isLight ? 'bg-[#83B49E]/7' : 'bg-[#9BDCC2]/7')} style={{ left: `${left}%`, width: `${width}%` }} aria-hidden="true" />;
        }) : null}
        <span className={cx('absolute bottom-11 left-[6%] right-[6%] h-0.5', theme.isLight ? 'bg-[#71869B]' : 'bg-[#8296AA]')} aria-hidden="true" />
        {binEdges.map((edge) => (
          <span key={edge} className="absolute bottom-5 -translate-x-1/2" style={{ left: `${xPercentFor(edge)}%` }} aria-hidden="true">
            {step >= 4 ? <span className={cx('absolute bottom-6 left-1/2 h-40 -translate-x-1/2 border-l border-dashed', theme.isLight ? 'border-[#71869B]/45' : 'border-[#8296AA]/50')} /> : null}
            <span className={cx('absolute bottom-5 left-1/2 h-3 -translate-x-1/2 border-l', theme.isLight ? 'border-[#71869B]' : 'border-[#8296AA]')} />
            <span className={cx('block min-w-8 text-center text-xs font-bold', theme.mutedText)}>{edge}</span>
          </span>
        ))}
        {step === 5 ? bins.flatMap((bin, binIndex) => bin.values.map((value, stackIndex) => (
          <span key={`${binIndex}-${value}-${stackIndex}`} className={cx('absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full', theme.isLight ? 'bg-[#2F78B7]' : 'bg-[#8CC8F2]')} style={{ left: `${xPercentFor((bin.left + bin.right) / 2)}%`, bottom: `${52 + stackIndex * 18}px` }} aria-hidden="true" />
        ))) : displayed.map((value, index) => (
          <span key={`${value}-${index}`} className={cx('absolute h-3.5 w-3.5 -translate-x-1/2 rounded-full', theme.isLight ? 'bg-[#2F78B7]' : 'bg-[#8CC8F2]', step === 3 ? 'opacity-60' : 'opacity-80')} style={{ left: `${xPercentFor(value)}%`, bottom: `${step === 3 ? 52 : 64 + (index % 2) * 18}px` }} aria-hidden="true" />
        ))}
        <span className={cx('absolute bottom-0 left-0 right-0 text-center text-xs font-bold', theme.mutedText)} aria-hidden="true">{axisLabel}</span>
      </div>
      <figcaption className={cx('border-t px-5 py-3 text-sm font-bold leading-6 sm:px-6', border, theme.bodyText)}>{caption}</figcaption>
    </figure>
  );
}

export function HistogramShapeVisual({ annotations, axisLabel, bins, caption, countLabel, data, rangeLabel }: {
  annotations: string[];
  axisLabel: string;
  bins: number;
  caption: string;
  countLabel: string;
  data: number[];
  rangeLabel: string;
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';
  return (
    <figure className={cx('overflow-hidden rounded-2xl border', border, theme.isLight ? 'bg-white' : 'bg-[#121A24]/45')}>
      <HistogramSvg axisLabel={axisLabel} binCount={bins} caption={caption} countLabel={countLabel} data={data} rangeLabel={rangeLabel} />
      <ul className={cx('grid border-t sm:grid-cols-3 sm:divide-x', border, theme.isLight ? 'divide-[#205089]/10' : 'divide-[#A8D4FF]/12')}>
        {annotations.map((annotation) => <li key={annotation} className={cx('px-4 py-3 text-center text-sm font-black', theme.bodyText)}>{annotation}</li>)}
      </ul>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}

export function HistogramBinComparison({ axisLabel, caption, configurations, countLabel, data, rangeLabel }: {
  axisLabel: string;
  caption: string;
  configurations: Array<{ bins: number; description: string; title: string }>;
  countLabel: string;
  data: number[];
  rangeLabel: string;
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';
  const sharedMaxCount = Math.max(...configurations.flatMap((configuration) => buildHistogram(data, configuration.bins).counts), 1);
  return (
    <figure className={cx('overflow-hidden rounded-2xl border', border, theme.isLight ? 'bg-white' : 'bg-[#121A24]/45')}>
      <div className={cx('grid divide-y', configurations.length > 1 && 'lg:grid-cols-3 lg:divide-x lg:divide-y-0', theme.isLight ? 'divide-[#205089]/10' : 'divide-[#A8D4FF]/12')}>
        {configurations.map((configuration) => (
          <section key={`${configuration.title}-${configuration.bins}`} className="grid content-start">
            <div className="px-4 pt-4 text-center">
              <h3 className={cx('text-sm font-black', theme.titleText)}>{configuration.title}</h3>
              <p className={cx('mt-1 text-xs font-bold leading-5', theme.mutedText)}>{configuration.description}</p>
            </div>
            <HistogramSvg axisLabel={axisLabel} binCount={configuration.bins} caption={`${configuration.title}: ${configuration.description}`} compact={configurations.length > 1} countLabel={countLabel} data={data} maxCountOverride={sharedMaxCount} rangeLabel={rangeLabel} />
          </section>
        ))}
      </div>
      <figcaption className={cx('border-t px-5 py-3 text-sm font-bold leading-6 sm:px-6', border, theme.bodyText)}>{caption}</figcaption>
    </figure>
  );
}

export function HistogramRulesVisual({ caption, n, rules }: {
  caption: string;
  n: number;
  rules: Array<{ description: string; formula: string; result: string; title: string }>;
}) {
  const theme = useLearningMdxTheme();
  const border = theme.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';
  return (
    <figure className={cx('overflow-hidden rounded-2xl border', border, theme.isLight ? 'bg-white' : 'bg-[#121A24]/45')}>
      <div className={cx('grid divide-y', rules.length > 1 && 'md:grid-cols-3 md:divide-x md:divide-y-0', theme.isLight ? 'divide-[#205089]/10' : 'divide-[#A8D4FF]/12')}>
        {rules.map((rule) => (
          <section key={rule.title} className="grid content-start gap-3 px-5 py-5 sm:px-6">
            <h3 className={cx('text-sm font-black', theme.titleText)}>{rule.title}</h3>
            <p className={cx('font-mono text-lg font-black', theme.accentText)}>{rule.formula}</p>
            <p className={cx('text-sm font-black', theme.titleText)}>{rule.result}</p>
            <p className={cx('text-sm font-semibold leading-6', theme.bodyText)}>{rule.description}</p>
          </section>
        ))}
      </div>
      <div className={cx('flex items-center justify-center gap-3 border-t px-5 py-4', border, theme.isLight ? 'bg-[#EEF4F9]' : 'bg-[#172232]')}>
        <span className={cx('text-sm font-black', theme.titleText)}>n = {n}</span>
        <ArrowDown className={cx('h-4 w-4 -rotate-90', theme.accentText)} strokeWidth={2.2} aria-hidden="true" />
        <span className={cx('text-sm font-bold', theme.bodyText)}>{caption}</span>
      </div>
    </figure>
  );
}

export function HistogramBinExplorer({ axisLabel, averageLabel, binsLabel, countLabel, data, feedback, initialBins, maxBins, minBins, observationsLabel, rangeLabel, task }: {
  axisLabel: string;
  averageLabel: string;
  binsLabel: string;
  countLabel: string;
  data: number[];
  feedback: { balanced: string; tooFew: string; tooMany: string };
  initialBins: number;
  maxBins: number;
  minBins: number;
  observationsLabel: string;
  rangeLabel: string;
  task: string;
}) {
  const theme = useLearningMdxTheme();
  const [bins, setBins] = useState(initialBins);
  const border = theme.isLight ? 'border-[#205089]/12' : 'border-[#A8D4FF]/14';
  const message = bins <= 5 ? feedback.tooFew : bins >= 24 ? feedback.tooMany : feedback.balanced;
  const messageTone = bins <= 5 ? theme.isLight ? 'bg-[#FFF6E8] text-[#8A5B12]' : 'bg-[#F2C66D]/9 text-[#F2C66D]' : bins >= 24 ? theme.isLight ? 'bg-[#FBEFE7] text-[#934B1C]' : 'bg-[#F0B172]/9 text-[#F0B172]' : theme.isLight ? 'bg-[#EDF7F1] text-[#2F6F59]' : 'bg-[#7FD3B1]/9 text-[#A9E4CC]';

  return (
    <section aria-label={task} className={cx('overflow-hidden rounded-2xl border', border, theme.isLight ? 'bg-white' : 'bg-[#121A24]/45')}>
      <div className="px-4 pt-4 sm:px-6 sm:pt-6">
        <HistogramSvg axisLabel={axisLabel} binCount={bins} caption={`${binsLabel}: ${bins}`} countLabel={countLabel} data={data} rangeLabel={rangeLabel} />
      </div>
      <div className={cx('grid gap-5 border-t px-5 py-5 sm:px-6', border, theme.isLight ? 'bg-[#F7FAFD]' : 'bg-[#172232]')}>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="histogram-bin-count" className={cx('text-sm font-black', theme.titleText)}>{binsLabel}</label>
            <output htmlFor="histogram-bin-count" className={cx('min-w-12 text-right text-lg font-black', theme.accentText)}>{bins}</output>
          </div>
          <input
            id="histogram-bin-count"
            type="range"
            min={minBins}
            max={maxBins}
            step="1"
            value={bins}
            onChange={(event) => setBins(Number(event.target.value))}
            className={cx('h-10 w-full cursor-pointer accent-[#205089]', theme.focusRing)}
          />
          <div className={cx('flex justify-between text-xs font-bold', theme.mutedText)} aria-hidden="true"><span>{minBins}</span><span>{maxBins}</span></div>
        </div>
        <dl className="grid gap-3 sm:grid-cols-3">
          <div><dt className={cx('text-xs font-black', theme.mutedText)}>{observationsLabel}</dt><dd className={cx('mt-1 text-base font-black', theme.titleText)}>{data.length}</dd></div>
          <div><dt className={cx('text-xs font-black', theme.mutedText)}>{binsLabel}</dt><dd className={cx('mt-1 text-base font-black', theme.titleText)}>{bins}</dd></div>
          <div><dt className={cx('text-xs font-black', theme.mutedText)}>{averageLabel}</dt><dd className={cx('mt-1 text-base font-black', theme.titleText)}>{(data.length / bins).toFixed(1)}</dd></div>
        </dl>
        <p aria-live="polite" className={cx('rounded-xl px-4 py-3 text-sm font-bold leading-6', messageTone)}>{message}</p>
        <p className={cx('flex items-start gap-2 text-sm font-semibold leading-6', theme.bodyText)}><ChartColumnBig className={cx('mt-1 h-4 w-4 shrink-0', theme.accentText)} strokeWidth={2} aria-hidden="true" />{task}</p>
      </div>
    </section>
  );
}

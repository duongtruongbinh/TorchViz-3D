import { ArrowRight, RefreshCw } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { useLearningMdxTheme } from '../../learningMdxComponents';
import { cx } from '../../theme';

type NormalVisualKind =
  | 'overview'
  | 'names'
  | 'frequency'
  | 'symmetry'
  | 'tails'
  | 'centers'
  | 'multimodal'
  | 'standard-normal'
  | 'scaler-shape'
  | 'skew'
  | 'tail-outlier';

type CurveSpec = {
  mean: number;
  sigma: number;
  opacity?: number;
};

const VIEW_WIDTH = 720;
const VIEW_HEIGHT = 250;
const LEFT = 34;
const RIGHT = 696;
const TOP = 18;
const BASELINE = 205;

function normalDensity(x: number, mean: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mean) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
}

function xScale(value: number, domain: [number, number]) {
  return LEFT + ((value - domain[0]) / (domain[1] - domain[0])) * (RIGHT - LEFT);
}

function curvePath(curve: CurveSpec, domain: [number, number], maxDensity = 0.52) {
  return Array.from({ length: 141 }, (_, index) => {
    const x = domain[0] + (index / 140) * (domain[1] - domain[0]);
    const px = xScale(x, domain);
    const py = BASELINE - (normalDensity(x, curve.mean, curve.sigma) / maxDensity) * (BASELINE - TOP);
    return `${index ? 'L' : 'M'}${px.toFixed(2)} ${py.toFixed(2)}`;
  }).join(' ');
}

function longTailPath(domain: [number, number]) {
  return Array.from({ length: 141 }, (_, index) => {
    const x = domain[0] + (index / 140) * (domain[1] - domain[0]);
    const density = 1 / (1 + (x / 1.15) ** 2);
    const px = xScale(x, domain);
    const py = BASELINE - density * (BASELINE - TOP - 8);
    return `${index ? 'L' : 'M'}${px.toFixed(2)} ${py.toFixed(2)}`;
  }).join(' ');
}

function MiniHistogram({ counts, frequencyLabel, label }: { counts: number[]; frequencyLabel: string; label: string }) {
  const theme = useLearningMdxTheme();
  const max = Math.max(...counts, 1);
  const left = 18;
  const right = 342;
  const top = 12;
  const baseline = 132;
  const barWidth = (right - left) / counts.length;
  return (
    <figure className="min-w-0">
      <svg viewBox="0 0 360 144" className="h-32 w-full" aria-hidden="true" preserveAspectRatio="none">
        <path d={`M${left} ${top}V${baseline}H${right}`} fill="none" stroke={theme.isLight ? '#7890A8' : '#8296AA'} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {counts.map((count, index) => (
          <rect
            key={index}
            x={left + index * barWidth}
            y={baseline - Math.max(4, (count / max) * (baseline - top - 6))}
            width={Math.max(1, barWidth)}
            height={Math.max(4, (count / max) * (baseline - top - 6))}
            fill={theme.isLight ? '#2F78B7' : '#8CC8F2'}
            fillOpacity="0.82"
            stroke={theme.isLight ? '#FFFFFF' : '#172232'}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <span className="sr-only">{frequencyLabel}: {counts.join(', ')}.</span>
      <figcaption className={cx('mt-2 text-center text-xs font-black', theme.titleText)}>{label}</figcaption>
    </figure>
  );
}

function PositionedHistogram({ counts, domain, end, frequencyLabel, label, rangeLabel, start }: {
  counts: number[];
  domain: [number, number];
  end: number;
  frequencyLabel: string;
  label: string;
  rangeLabel: string;
  start: number;
}) {
  const theme = useLearningMdxTheme();
  const max = Math.max(...counts, 1);
  const startX = xScale(start, domain);
  const endX = xScale(end, domain);
  const barWidth = (endX - startX) / counts.length;
  const ticks = [-4, 0, 4, 8, 12];
  return (
    <figure>
      <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="h-auto w-full" aria-hidden="true">
        <path d={`M${LEFT} ${BASELINE}H${RIGHT}`} stroke={theme.isLight ? '#71869B' : '#8296AA'} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {counts.map((count, index) => {
          const height = (count / max) * 150;
          return <rect key={index} x={startX + index * barWidth} y={BASELINE - height} width={barWidth} height={height} fill={theme.isLight ? '#2F78B7' : '#8CC8F2'} fillOpacity="0.78" stroke={theme.isLight ? '#FFFFFF' : '#172232'} strokeWidth="1" />;
        })}
        {ticks.map((tick) => <path key={tick} d={`M${xScale(tick, domain)} ${BASELINE}v6`} stroke={theme.isLight ? '#71869B' : '#8296AA'} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />)}
      </svg>
      <div className="relative mx-[4.7%] h-6" aria-hidden="true">
        {ticks.map((tick) => <span key={tick} className={cx('absolute -translate-x-1/2 text-xs font-bold', theme.mutedText)} style={{ left: `${((tick - domain[0]) / (domain[1] - domain[0])) * 100}%` }}>{tick}</span>)}
      </div>
      <span className="sr-only">{rangeLabel}: {start}–{end}; {frequencyLabel}: {counts.join(', ')}.</span>
      <figcaption className={cx('mt-1 text-center text-xs font-black', theme.titleText)}>{label}</figcaption>
    </figure>
  );
}

function CurveChart({
  ariaLabel,
  curves,
  domain = [-4, 4],
  histogram,
  markers = [],
}: {
  ariaLabel: string;
  curves: CurveSpec[];
  domain?: [number, number];
  histogram?: number[];
  markers?: Array<{ label: string; value: number }>;
}) {
  const theme = useLearningMdxTheme();
  const axis = theme.isLight ? '#71869B' : '#8296AA';
  const palette = theme.isLight ? ['#205089', '#2F6F59', '#A05218'] : ['#8CC8F2', '#9BDCC2', '#F0B172'];
  const bar = theme.isLight ? '#AFC8DE' : '#496F98';
  const maxHistogram = Math.max(...(histogram ?? [1]), 1);
  const barWidth = histogram ? (RIGHT - LEFT) / histogram.length : 0;
  return (
    <div role="img" aria-label={ariaLabel} className="min-w-0">
      <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="h-auto w-full" aria-hidden="true">
        <path d={`M${LEFT} ${BASELINE}H${RIGHT}`} stroke={axis} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {histogram?.map((count, index) => {
          const height = (count / maxHistogram) * 142;
          return <rect key={index} x={LEFT + index * barWidth} y={BASELINE - height} width={barWidth} height={height} fill={bar} fillOpacity="0.62" stroke={theme.isLight ? '#FFFFFF' : '#172232'} strokeWidth="1" />;
        })}
        {curves.map((curve, index) => (
          <path key={index} d={curvePath(curve, domain)} fill="none" stroke={palette[index % palette.length]} strokeWidth={index ? 3 : 4} strokeOpacity={curve.opacity ?? 1} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        ))}
        {markers.map((marker) => {
          const x = xScale(marker.value, domain);
          return <g key={`${marker.label}-${marker.value}`}><path d={`M${x} ${TOP + 6}V${BASELINE}`} stroke={axis} strokeDasharray="5 5" strokeWidth="1.2" vectorEffect="non-scaling-stroke" /><circle cx={x} cy={BASELINE} r="4" fill={palette[0]} /></g>;
        })}
      </svg>
      {markers.length ? (
        <div className="relative mx-[4.7%] h-7" aria-hidden="true">
          {markers.map((marker) => <span key={`${marker.label}-html`} className={cx('absolute top-0 -translate-x-1/2 whitespace-nowrap text-xs font-black', theme.mutedText)} style={{ left: `${((marker.value - domain[0]) / (domain[1] - domain[0])) * 100}%` }}>{marker.label}</span>)}
        </div>
      ) : null}
    </div>
  );
}

export function NormalDistributionVisual({ ariaLabel, caption, frequencyLabel, kind, labels = [], rangeLabel }: {
  ariaLabel: string;
  caption: string;
  frequencyLabel?: string;
  kind: NormalVisualKind;
  labels?: string[];
  rangeLabel?: string;
}) {
  const theme = useLearningMdxTheme();
  const surface = cx('overflow-hidden rounded-xl px-3 py-4 sm:px-5 sm:py-5', theme.isLight ? 'bg-[#F4F8FB]' : 'bg-[#121A24]');

  if (kind === 'skew') return (
    <figure className={surface} aria-label={ariaLabel}>
      <div className="grid gap-6 md:grid-cols-2">
        <MiniHistogram counts={[16, 24, 20, 14, 9, 6, 4, 3, 2, 1]} frequencyLabel={frequencyLabel ?? ''} label={labels[0]} />
        <MiniHistogram counts={[1, 2, 3, 4, 6, 9, 14, 20, 24, 16]} frequencyLabel={frequencyLabel ?? ''} label={labels[1]} />
      </div>
      <figcaption className={cx('mt-5 text-center text-base font-black', theme.titleText)}>{caption}</figcaption>
    </figure>
  );

  if (kind === 'scaler-shape') return (
    <figure className={surface} aria-label={ariaLabel}>
      <div className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
        <PositionedHistogram counts={[18, 23, 17, 12, 8, 5, 3, 2, 1]} domain={[-4, 12]} start={3} end={12} frequencyLabel={frequencyLabel ?? ''} rangeLabel={rangeLabel ?? ''} label={labels[0]} />
        <ArrowRight className={cx('mx-auto h-6 w-6 rotate-90 md:rotate-0', theme.accentText)} aria-hidden="true" />
        <PositionedHistogram counts={[18, 23, 17, 12, 8, 5, 3, 2, 1]} domain={[-4, 12]} start={-2} end={2.5} frequencyLabel={frequencyLabel ?? ''} rangeLabel={rangeLabel ?? ''} label={labels[1]} />
      </div>
      <figcaption className={cx('mt-4 text-center text-sm font-bold leading-6', theme.bodyText)}>{caption}</figcaption>
    </figure>
  );

  if (kind === 'tail-outlier') {
    const domain: [number, number] = [-7, 7];
    const extremeValues = [-5.8, 4.9, 6.1];
    return (
      <figure className={surface} aria-label={ariaLabel}>
        <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`} className="h-auto w-full" aria-hidden="true">
          <path d={`M${LEFT} ${BASELINE}H${RIGHT}`} stroke={theme.isLight ? '#71869B' : '#8296AA'} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <path d={longTailPath(domain)} fill="none" stroke={theme.isLight ? '#205089' : '#8CC8F2'} strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {extremeValues.map((value) => <circle key={value} cx={xScale(value, domain)} cy={BASELINE - 4} r="6" fill={theme.isLight ? '#A05218' : '#F0B172'} />)}
        </svg>
        <div className="grid grid-cols-3 gap-3 text-center">{labels.map((label) => <span key={label} className={cx('text-xs font-black', theme.titleText)}>{label}</span>)}</div>
        <figcaption className={cx('mt-3 text-center text-sm font-bold leading-6', theme.bodyText)}>{caption}</figcaption>
      </figure>
    );
  }

  const configs: Record<Exclude<NormalVisualKind, 'skew' | 'scaler-shape' | 'tail-outlier'>, {
    curves: CurveSpec[];
    domain?: [number, number];
    histogram?: number[];
    markerValues?: number[];
    showLabels?: boolean;
    labelOffset?: number;
  }> = {
    overview: { curves: [{ mean: 0, sigma: 1 }], showLabels: true },
    names: { curves: [{ mean: 0, sigma: 1 }], showLabels: true },
    frequency: { curves: [{ mean: 0, sigma: 1 }], markerValues: [-3, 0, 3] },
    symmetry: { curves: [{ mean: 0, sigma: 1 }], markerValues: [0], showLabels: true, labelOffset: 1 },
    tails: { curves: [{ mean: 0, sigma: 1 }], markerValues: [-2.6, 0, 2.6] },
    centers: { curves: [{ mean: 0, sigma: 1 }], markerValues: [0] },
    multimodal: { curves: [{ mean: -1.25, sigma: 0.72 }, { mean: 1.35, sigma: 0.78 }], markerValues: [-1.25, 1.35] },
    'standard-normal': { curves: [{ mean: 0, sigma: 1 }], markerValues: [-2, -1, 0, 1, 2] },
  };
  const config = configs[kind];
  const markers = config.markerValues?.map((value, index) => ({ value, label: labels[index] ?? '' }));
  const displayLabels = config.showLabels ? labels.slice(config.labelOffset ?? 0) : [];
  return (
    <figure className={surface} aria-label={ariaLabel}>
      <CurveChart ariaLabel={ariaLabel} curves={config.curves} domain={config.domain} histogram={config.histogram} markers={markers} />
      {displayLabels.length ? <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">{displayLabels.map((label) => <span key={label} className={cx('text-sm font-black', theme.titleText)}>{label}</span>)}</div> : null}
      <figcaption className={cx('mt-3 text-center text-sm font-bold leading-6', theme.bodyText)}>{caption}</figcaption>
    </figure>
  );
}

export function NormalParameterExplorer({
  curveAriaLabel,
  caption,
  feedback,
  meanMarkerLabel,
  mode,
  varianceLabel,
  meanLabel,
}: {
  curveAriaLabel: string;
  caption: string;
  feedback: { lower: string; baseline: string; higher: string };
  meanMarkerLabel: string;
  mode: 'mean' | 'variance';
  varianceLabel: string;
  meanLabel: string;
}) {
  const theme = useLearningMdxTheme();
  const inputId = useId();
  const [value, setValue] = useState(mode === 'mean' ? 0 : 4);
  const mean = mode === 'mean' ? value : 0;
  const variance = mode === 'variance' ? value : 4;
  const sigma = Math.sqrt(variance);
  const liveFeedback = value < (mode === 'mean' ? 0 : 4) ? feedback.lower : value > (mode === 'mean' ? 0 : 4) ? feedback.higher : feedback.baseline;
  return (
    <section aria-label={caption} className={cx('grid gap-4 rounded-xl px-4 py-5 sm:px-5', theme.isLight ? 'bg-[#F4F8FB]' : 'bg-[#121A24]')}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor={mode === 'mean' ? inputId : undefined} className={cx('grid gap-2 text-sm font-black', theme.titleText)}>
          <span className="flex justify-between gap-3"><span>{meanLabel}</span><output>{mean}</output></span>
          {mode === 'mean' ? <input id={inputId} type="range" min="-3" max="3" step="0.25" value={value} onChange={(event) => setValue(Number(event.target.value))} className={cx('w-full accent-[#205089]', theme.focusRing)} /> : <span className={cx('h-2 rounded-full', theme.isLight ? 'bg-[#B8C8DA]' : 'bg-[#496F98]/40')} />}
        </label>
        <label htmlFor={mode === 'variance' ? inputId : undefined} className={cx('grid gap-2 text-sm font-black', theme.titleText)}>
          <span className="flex justify-between gap-3"><span>{varianceLabel}</span><output>{variance}</output></span>
          {mode === 'variance' ? <input id={inputId} type="range" min="0.5" max="9" step="0.5" value={value} onChange={(event) => setValue(Number(event.target.value))} className={cx('w-full accent-[#205089]', theme.focusRing)} /> : <span className={cx('h-2 rounded-full', theme.isLight ? 'bg-[#B8C8DA]' : 'bg-[#496F98]/40')} />}
        </label>
      </div>
      <CurveChart ariaLabel={curveAriaLabel} curves={[{ mean, sigma }]} domain={[-7, 7]} markers={[{ label: `${meanMarkerLabel} ${mean}`, value: mean }]} />
      <p aria-live="polite" className={cx('text-center text-sm font-black leading-6', theme.titleText)}>{liveFeedback}</p>
      <p className={cx('text-center text-sm font-semibold leading-6', theme.bodyText)}>{caption}</p>
    </section>
  );
}

export function HistogramReadingInteraction({ caption, frequencyLabel, nextLabel, questions, revealLabel, scenarioLabel, scenarios }: {
  caption: string;
  frequencyLabel: string;
  nextLabel: string;
  questions: string[];
  revealLabel: string;
  scenarioLabel: string;
  scenarios: Array<{ title: string; counts: number[]; answer: string }>;
}) {
  const theme = useLearningMdxTheme();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const scenario = scenarios[scenarioIndex];
  const next = () => { setScenarioIndex((current) => (current + 1) % scenarios.length); setRevealed(false); };
  const questionList = useMemo(() => questions.slice(0, 5), [questions]);
  return (
    <section aria-label={caption} className={cx('grid gap-5 rounded-xl px-4 py-5 sm:px-5', theme.isLight ? 'bg-[#F4F8FB]' : 'bg-[#121A24]')}>
      <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div>
          <MiniHistogram counts={scenario.counts} frequencyLabel={frequencyLabel} label={`${scenarioLabel} ${scenarioIndex + 1} / ${scenarios.length}`} />
        </div>
        <ol className="grid gap-2">
          {questionList.map((question, index) => <li key={question} className={cx('grid grid-cols-[1.6rem_1fr] gap-2 text-sm font-bold leading-5', theme.bodyText)}><span className={cx('grid h-6 w-6 place-items-center rounded-full text-xs', theme.isLight ? 'bg-[#EAF1F7] text-[#123B68]' : 'bg-[#A8D4FF]/10 text-[#D7EAFE]')}>{index + 1}</span><span>{question}</span></li>)}
        </ol>
      </div>
      {revealed ? <div aria-live="polite" className={cx('rounded-xl px-4 py-3', theme.isLight ? 'bg-[#E2F0EA] text-[#285C38]' : 'bg-[#7FD3B1]/12 text-[#C5EBD0]')}><p className="text-sm font-black">{scenario.title}</p><p className="mt-1 text-sm font-semibold leading-6">{scenario.answer}</p></div> : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setRevealed(true)} disabled={revealed} className={cx('min-h-10 rounded-lg px-4 text-sm font-black disabled:cursor-not-allowed disabled:opacity-50', theme.button.primary)}>{revealLabel}</button>
        <button type="button" onClick={next} className={cx('inline-flex min-h-10 items-center gap-2 rounded-lg px-4 text-sm font-black', theme.button.secondary)}><RefreshCw className="h-4 w-4" aria-hidden="true" />{nextLabel}</button>
      </div>
    </section>
  );
}

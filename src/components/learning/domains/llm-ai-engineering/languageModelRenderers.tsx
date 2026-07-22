import { ArrowDown, ArrowRight, BarChart3, Bot, Database, ExternalLink, FileSearch, Languages, Minus, Plus, Scissors, Search, Trophy, Users, type LucideIcon } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { Language } from '../../../../lib/localization';
import { cx, getLearningLabTheme } from '../../theme';
import { getLearningLocalizedText as text } from '../../learningText';
import { DiagramConnectorLayer, ExponentComparisonChart, getDiagramAnchor, observeDiagramLayout, ProbabilityCurveChart, ProbabilitySignComparisonChart } from './diagramPrimitives';
import { StepPlaybackControls } from './rendererPrimitives';
import { getLlmRendererTheme } from './rendererTheme';
import type {
  LlmArInferencePipelineContent,
  LlmAutoregressiveDefinitionContent,
  LlmBenchmarkLikelihoodContent,
  LlmContentRendererProps,
  LlmHuggingFaceBenchmarksContent,
  LlmLossDerivationContent,
  LlmLossHandCalculationContent,
  LlmNextTokenLossContent,
  LlmOutputProjectionContent,
  LlmOutputProjectionFocus,
  LlmPerplexityGoodRangeContent,
  LlmPerplexityInterpretationContent,
  LlmPerplexitySequenceExampleContent,
  LlmPostTrainingEvaluationContent,
  LlmProbabilityDefinitionContent,
  LlmVocabularyOutputVectorContent,
} from './rendererTypes';

export function LlmHuggingFaceBenchmarks({ content, language, themeClasses }: LlmContentRendererProps<LlmHuggingFaceBenchmarksContent>) {
  const pointPresentation = {
    discover: { Icon: Search, color: themeClasses.isLight ? 'bg-[#FFF4C7] text-[#8A5A00]' : 'bg-[#FFD21E]/12 text-[#FFD21E]' },
    inspect: { Icon: Database, color: themeClasses.isLight ? 'bg-[#E7F0FA] text-[#205F99]' : 'bg-[#A8B8C8]/12 text-[#BFD3F2]' },
    compare: { Icon: BarChart3, color: themeClasses.isLight ? 'bg-[#EAF5E2] text-[#397B0A]' : 'bg-[#A8DB78]/10 text-[#A8DB78]' },
  } satisfies Record<LlmHuggingFaceBenchmarksContent['points'][number]['id'], { Icon: LucideIcon; color: string }>;
  const resourcePresentation = {
    helm: { Icon: BarChart3, mark: 'H', color: themeClasses.isLight ? 'bg-[#E7F0FA] text-[#205F99]' : 'bg-[#8FC8FF]/12 text-[#8FC8FF]' },
    'open-llm-leaderboard': { Icon: Trophy, mark: 'HF', color: themeClasses.isLight ? 'bg-[#FFF4C7] text-[#8A5A00]' : 'bg-[#FFD21E]/12 text-[#FFD86B]' },
  } satisfies Record<LlmHuggingFaceBenchmarksContent['resources'][number]['id'], { Icon: LucideIcon; mark: string; color: string }>;

  return (
    <section className="grid gap-5">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>
        {text(content.lead.before, language)}{' '}
        <span className={cx('rounded px-1.5 py-0.5 font-black', themeClasses.isLight ? 'bg-[#FFF0A8] text-[#5C4200]' : 'bg-[#FFD21E]/16 text-[#FFD86B]')}>{text(content.lead.highlight, language)}</span>.
      </p>
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.brief, language)}</p>

      <div className={cx('grid overflow-hidden rounded-xl border lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]', themeClasses.isLight ? 'border-[#205089]/12' : 'border-[#A8B8C8]/14')}>
        <div className={cx('grid content-center gap-3 p-5', themeClasses.isLight ? 'border-[#205089]/12 bg-[#FFF9E8]' : 'bg-[#FFD21E]/6')}>
          {content.points.map((point) => {
            const { Icon, color } = pointPresentation[point.id];
            return <div key={point.id} className="grid grid-cols-[40px_minmax(0,1fr)] items-start gap-3">
              <span className={cx('grid h-10 w-10 place-items-center rounded-xl', color)}><Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" /></span>
              <span className="grid gap-1">
                <span className={cx('text-sm font-black', themeClasses.titleText)}>{text(point.title, language)}</span>
                <span className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(point.description, language)}</span>
              </span>
            </div>;
          })}
          <a href={content.cta.href} target="_blank" rel="noreferrer" className={cx('mt-2 inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2 text-sm font-black', themeClasses.focusRing, themeClasses.isLight ? 'bg-[#FFD21E] text-[#3B2A00]' : 'bg-[#FFD21E] text-[#121A24]')}>
            {text(content.cta.label, language)}<ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <div className={cx('grid min-h-[19rem] place-items-center overflow-hidden p-4', themeClasses.isLight ? 'border-t border-[#205089]/10 bg-[#F8FAFC] lg:border-l lg:border-t-0' : 'border-t border-[#A8B8C8]/12 bg-[#121A24]/36 lg:border-l lg:border-t-0')}>
          <img src={content.image.src} alt={text(content.image.alt, language)} loading="lazy" className="h-full max-h-[24rem] w-full object-contain" />
        </div>
      </div>

      <div className="grid gap-3">
        <p className={cx('text-sm font-black', themeClasses.titleText)}>{text(content.resourcesLabel, language)}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {content.resources.map((resource) => {
            const { Icon, mark, color } = resourcePresentation[resource.id];
            return <article key={resource.id} className={cx('grid min-h-44 grid-rows-[auto_1fr_auto] gap-3 rounded-xl border p-4', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
              <div className="flex items-center gap-3">
                <span className={cx('grid h-10 min-w-10 place-items-center rounded-xl px-2', color)}>
                  <span className="sr-only">{mark}</span><Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className={cx('text-base font-black', themeClasses.titleText)}>{resource.name}</h3>
              </div>
              <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(resource.description, language)}</p>
              <a href={resource.href} target="_blank" rel="noreferrer" className={cx('inline-flex w-fit items-center gap-1.5 text-sm font-black', themeClasses.focusRing, themeClasses.accentText)}>
                {text(resource.ctaLabel, language)}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </article>;
          })}
        </div>
      </div>
    </section>
  );
}

export function LlmPerplexitySequenceExample({ content, language, themeClasses }: LlmContentRendererProps<LlmPerplexitySequenceExampleContent>) {
  return (
    <section className="grid gap-5">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.brief, language)}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {content.contrast.map((item) => (
          <div key={item.bestValue} className={cx('grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#F8FAFC]' : 'bg-[#121A24]/36')}>
            <div><p className={cx('text-sm font-black', themeClasses.titleText)}>{text(item.label, language)}</p><p className={cx('text-xs font-semibold', themeClasses.mutedText)}>{text(item.role, language)}</p></div>
            <code className={cx('rounded-md px-2 py-1 text-sm font-black', themeClasses.isLight ? 'bg-white text-[#205F99]' : 'bg-[#263B5B]/60 text-[#DCE8F4]')}>{item.bestValue}</code>
          </div>
        ))}
      </div>
      <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.note, language)}</p>
      <div className={cx('overflow-x-auto rounded-xl border px-5 py-5 text-center text-xl font-semibold sm:text-2xl', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF4FA] text-[#123B68]' : 'border-[#A8B8C8]/18 bg-[#A8B8C8]/8 text-[#E5EEF8]')} dangerouslySetInnerHTML={{ __html: katex.renderToString(content.formula, { displayMode: true, throwOnError: false }) }} />
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.transition, language)}</p>
      <div className={cx('overflow-x-auto rounded-xl border px-5 py-5 text-xl font-semibold sm:text-2xl', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF4FA] text-[#123B68]' : 'border-[#A8B8C8]/18 bg-[#A8B8C8]/8 text-[#E5EEF8]')}>
        <div className="mx-auto flex w-max min-w-full items-center justify-center">
          <span className="shrink-0" dangerouslySetInnerHTML={{ __html: katex.renderToString(content.walkthroughFormula.left, { throwOnError: false }) }} />
          <span className="shrink-0 opacity-25" dangerouslySetInnerHTML={{ __html: katex.renderToString(content.walkthroughFormula.mutedMiddle, { throwOnError: false }) }} />
          <span className="shrink-0" dangerouslySetInnerHTML={{ __html: katex.renderToString(content.walkthroughFormula.right, { throwOnError: false }) }} />
        </div>
      </div>
      <div className={cx('grid gap-4 rounded-xl border px-4 py-4 sm:px-5', themeClasses.isLight ? 'border-[#205089]/12 bg-[#F8FAFC]' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
        <p className={cx('text-sm font-black', themeClasses.accentText)}>{text(content.label, language)}</p>
        <div className="flex flex-wrap items-center gap-2">
          {content.tokens.map((token, index) => (
            <Fragment key={`${token}-${index}`}>
              {index > 0 ? <ArrowRight className={cx('h-4 w-4 shrink-0', themeClasses.mutedText)} strokeWidth={1.8} aria-hidden="true" /> : null}
              <code className={cx('rounded-lg px-3 py-2 text-base font-black', themeClasses.isLight ? 'bg-white text-[#205F99]' : 'bg-[#263B5B]/60 text-[#DCE8F4]')}>{token}</code>
            </Fragment>
          ))}
        </div>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.takeaway, language)}</p>
      </div>
    </section>
  );
}

export function LlmPerplexityInterpretation({ content, language, themeClasses }: LlmContentRendererProps<LlmPerplexityInterpretationContent>) {
  const initialPreset = content.calculator.presets[0];
  const makeRows = (preset: typeof initialPreset) => preset.candidates.map((candidate, index) => ({ ...candidate, id: `${preset.id}-${index}` }));
  const [activePresetId, setActivePresetId] = useState(initialPreset.id);
  const [prompt, setPrompt] = useState(initialPreset.prompt);
  const [rows, setRows] = useState(() => makeRows(initialPreset));
  const [groundTruthId, setGroundTruthId] = useState(`${initialPreset.id}-${initialPreset.groundTruthIndex}`);
  const groundTruthProbability = rows.find((row) => row.id === groundTruthId)?.probability ?? 0;
  const ppl = groundTruthProbability > 0 ? 100 / groundTruthProbability : Number.POSITIVE_INFINITY;
  const pplFormula = `\\operatorname{PPL}=\\frac{1}{p(\\text{token ground truth})}=\\frac{1}{${(groundTruthProbability / 100).toFixed(3)}}=${Number.isFinite(ppl) ? ppl.toFixed(2) : '\\infty'}`;

  const applyPreset = (preset: typeof initialPreset) => {
    setActivePresetId(preset.id);
    setPrompt(preset.prompt);
    setRows(makeRows(preset));
    setGroundTruthId(`${preset.id}-${preset.groundTruthIndex}`);
  };

  const updateProbability = (id: string, requested: number) => {
    setActivePresetId('custom');
    setRows((current) => {
      if (current.length === 1) return [{ ...current[0], probability: 100 }];
      const nextProbability = Math.min(100, Math.max(0, requested));
      const others = current.filter((row) => row.id !== id);
      const otherTotal = others.reduce((sum, row) => sum + row.probability, 0);
      const remaining = 100 - nextProbability;
      return current.map((row) => {
        if (row.id === id) return { ...row, probability: nextProbability };
        return { ...row, probability: otherTotal > 0 ? (row.probability / otherTotal) * remaining : remaining / others.length };
      });
    });
  };

  const addToken = () => {
    if (rows.length >= 8) return;
    const id = `custom-${Date.now()}`;
    setActivePresetId('custom');
    setRows((current) => [...current.map((row) => ({ ...row, probability: row.probability * 0.9 })), { id, token: `token ${current.length + 1}`, probability: 10 }]);
  };

  const removeToken = (id: string) => {
    if (rows.length <= 2) return;
    setActivePresetId('custom');
    setRows((current) => {
      const remaining = current.filter((row) => row.id !== id);
      const total = remaining.reduce((sum, row) => sum + row.probability, 0);
      return remaining.map((row) => ({ ...row, probability: total > 0 ? (row.probability / total) * 100 : 100 / remaining.length }));
    });
    if (groundTruthId === id) setGroundTruthId(rows.find((row) => row.id !== id)!.id);
  };

  return (
    <section className="grid gap-5">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className={cx('overflow-x-auto rounded-lg px-4 py-3 text-base font-semibold', themeClasses.isLight ? 'bg-[#EFF4FA] text-[#123B68]' : 'bg-[#263B5B]/45 text-[#DCE8F4]')} dangerouslySetInnerHTML={{ __html: katex.renderToString(pplFormula, { displayMode: true, throwOnError: false }) }} />

      <div className="grid gap-3 sm:grid-cols-2">
        {content.calculator.presets.map((preset) => (
          <button key={preset.id} type="button" onClick={() => applyPreset(preset)} className={cx('grid gap-4 rounded-xl border px-5 py-4 text-left transition-colors', themeClasses.focusRing, activePresetId === preset.id ? (themeClasses.isLight ? 'border-[#205F99] bg-[#EFF4FA]' : 'border-[#A8B8C8] bg-[#263B5B]/55') : (themeClasses.isLight ? 'border-[#205089]/12 bg-[#F8FAFC]' : 'border-[#A8B8C8]/14 bg-[#121A24]/36'))}>
            <span className={cx('text-xl font-black', themeClasses.accentText)}>{text(preset.label, language)}</span>
            <span className="flex flex-wrap gap-2">
              {preset.candidates.map((candidate) => <span key={candidate.token} className={cx('rounded-lg px-3 py-2 text-sm font-black', themeClasses.isLight ? 'bg-white text-[#205089]' : 'bg-[#121A24]/45 text-[#DCE8F4]')}>{candidate.token}<span className={cx('ml-2 text-xs', themeClasses.mutedText)}>{candidate.probability}%</span></span>)}
            </span>
          </button>
        ))}
      </div>

      <div className={cx('grid gap-4 rounded-xl border px-5 py-5', themeClasses.isLight ? 'border-[#205089]/14 bg-[#F8FAFC]' : 'border-[#A8B8C8]/16 bg-[#121A24]/36')}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className={cx('text-sm font-black', themeClasses.titleText)}>{text(content.calculator.title, language)}</p>{prompt ? <p className={cx('mt-1 text-sm font-semibold', themeClasses.bodyText)}>“{prompt}”</p> : null}</div>
          <div className={cx('rounded-lg px-4 py-2 text-right', themeClasses.isLight ? 'bg-[#DCEEFF]' : 'bg-[#263B5B]')}><span className={cx('block text-xs font-bold', themeClasses.mutedText)}>Perplexity</span><span className={cx('text-2xl font-black tabular-nums', themeClasses.accentText)}>{Number.isFinite(ppl) ? ppl.toFixed(2) : '∞'}</span></div>
        </div>
        <div className="grid gap-3">
          {rows.map((row) => {
            const isGroundTruth = row.id === groundTruthId;
            return <div key={row.id} className={cx('grid gap-3 rounded-lg border px-3 py-3 sm:grid-cols-[auto_minmax(7rem,0.45fr)_minmax(10rem,1fr)_4.5rem_auto] sm:items-center', isGroundTruth ? (themeClasses.isLight ? 'border-[#5BAA12]/35 bg-[#F5FAEF]' : 'border-[#A8DB78]/25 bg-[#A8DB78]/8') : (themeClasses.isLight ? 'border-[#205089]/10 bg-white' : 'border-[#A8B8C8]/12 bg-[#121A24]/45'))}>
              <input type="radio" name="ppl-ground-truth" checked={isGroundTruth} onChange={() => { setActivePresetId('custom'); setGroundTruthId(row.id); }} aria-label={`${text(content.calculator.groundTruthLabel, language)}: ${row.token}`} className="h-4 w-4 accent-[#5BAA12]" />
              <input value={row.token} onChange={(event) => { setActivePresetId('custom'); setRows((current) => current.map((item) => item.id === row.id ? { ...item, token: event.target.value } : item)); }} className={cx('min-w-0 rounded-md border px-2 py-1.5 text-sm font-bold outline-none', themeClasses.focusRing, themeClasses.isLight ? 'border-[#205089]/15 bg-white text-[#123B68]' : 'border-[#A8B8C8]/18 bg-[#121A24] text-[#E5EEF8]')} aria-label="Tên token" />
              <input type="range" min="0" max="100" step="1" value={row.probability} onChange={(event) => updateProbability(row.id, Number(event.target.value))} className="w-full accent-[#5BAA12]" aria-label={`Xác suất của token ${row.token}`} />
              <span className={cx('text-right text-sm font-black tabular-nums', isGroundTruth ? (themeClasses.isLight ? 'text-[#397B0A]' : 'text-[#A8DB78]') : themeClasses.titleText)}>{row.probability.toFixed(1)}%</span>
              <button type="button" onClick={() => removeToken(row.id)} disabled={rows.length <= 2} className={cx('grid h-8 w-8 place-items-center rounded-md disabled:cursor-not-allowed disabled:opacity-25', themeClasses.focusRing, themeClasses.mutedText)} aria-label={`Xóa token ${row.token}`}><Minus className="h-4 w-4" aria-hidden="true" /></button>
              {isGroundTruth ? <span className={cx('col-span-full text-xs font-black sm:col-start-2', themeClasses.isLight ? 'text-[#397B0A]' : 'text-[#A8DB78]')}>{text(content.calculator.groundTruthLabel, language)}</span> : null}
            </div>;
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={addToken} disabled={rows.length >= 8} className={cx('inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black disabled:opacity-30', themeClasses.focusRing, themeClasses.isLight ? 'border-[#205089]/15 bg-white text-[#205089]' : 'border-[#A8B8C8]/18 text-[#DCE8F4]')}><Plus className="h-4 w-4" aria-hidden="true" />{text(content.calculator.addTokenLabel, language)}</button>
          <span className={cx('text-xs font-black', themeClasses.mutedText)}>{text(content.calculator.totalLabel, language)}: {rows.reduce((sum, row) => sum + row.probability, 0).toFixed(1)}%</span>
        </div>
      </div>

      <div className={cx('grid gap-4 rounded-xl border px-5 py-5', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
        <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <div className={cx('grid gap-1 rounded-lg px-4 py-3 text-center', themeClasses.isLight ? 'bg-[#F1F5F9]' : 'bg-[#263B5B]/35')}>
            <span className={cx('text-xs font-black tracking-[0.12em]', themeClasses.mutedText)}>{content.trend.startYear}</span>
            <span className={cx('text-2xl font-black tabular-nums', themeClasses.titleText)}>{content.trend.startValue}</span>
          </div>
          <ArrowRight className={cx('mx-auto h-5 w-5 rotate-90 sm:rotate-0', themeClasses.mutedText)} aria-hidden="true" />
          <div className={cx('grid gap-1 rounded-lg px-4 py-3 text-center', themeClasses.isLight ? 'bg-[#EAF5E2]' : 'bg-[#A8DB78]/8')}>
            <span className={cx('text-xs font-black tracking-[0.12em]', themeClasses.mutedText)}>{content.trend.endYear}</span>
            <span className={cx('text-2xl font-black tabular-nums', themeClasses.isLight ? 'text-[#397B0A]' : 'text-[#A8DB78]')}>{content.trend.endValue}</span>
          </div>
        </div>
        <p className={cx('text-center text-sm leading-6', themeClasses.bodyText)}>
          {text(content.trend.explanation, language)}{' '}
          <a href={content.trend.reference.href} target="_blank" rel="noreferrer" className={cx('font-normal underline-offset-2 hover:underline', themeClasses.accentText)}>{content.trend.reference.label}</a>
        </p>
      </div>

    </section>
  );
}

export function LlmPerplexityGoodRange({ content, language, themeClasses }: LlmContentRendererProps<LlmPerplexityGoodRangeContent>) {
  const factorPresentation = {
    data: { Icon: Database, top: 'bg-[#DCE8F4]', icon: 'bg-white text-[#205089]' },
    tokenizer: { Icon: Scissors, top: 'bg-[#DCEEE8]', icon: 'bg-white text-[#2E6B5D]' },
    language: { Icon: Languages, top: 'bg-[#F4E8C8]', icon: 'bg-white text-[#70551A]' },
    evaluation: { Icon: FileSearch, top: 'bg-[#E9E0F2]', icon: 'bg-white text-[#69468A]' },
  } satisfies Record<'data' | 'tokenizer' | 'language' | 'evaluation', { Icon: LucideIcon; top: string; icon: string }>;
  const rangeTone = {
    strong: themeClasses.isLight ? 'border-[#5BAA12]/25 bg-[#F5FAEF]' : 'border-[#A8DB78]/20 bg-[#A8DB78]/8',
    acceptable: themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF4FA]' : 'border-[#A8B8C8]/18 bg-[#263B5B]/35',
    warning: themeClasses.isLight ? 'border-[#C98A1A]/25 bg-[#FFF8E8]' : 'border-[#E8B85D]/20 bg-[#E8B85D]/8',
  } as const;

  if (content.view === 'factors') return (
    <section className="grid gap-5">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {content.factors.map((factor) => {
          const { Icon, icon, top } = factorPresentation[factor.id];
          return <article key={factor.id} className={cx('grid min-h-[21rem] grid-rows-[120px_minmax(0,1fr)] overflow-hidden rounded-lg border', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
            <div className={cx('grid place-items-center border-b border-black/5', themeClasses.isLight ? top : 'bg-[#263B5B]')}>
              <div className={cx('grid h-16 w-16 place-items-center rounded-2xl border border-black/5 shadow-[0_12px_24px_rgba(30,42,56,0.12)]', themeClasses.isLight ? icon : 'bg-[#172A43] text-[#BFD3F2]')}>
                <Icon className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
              </div>
            </div>
            <div className="grid content-start gap-3 p-4">
              <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{text(factor.title, language)}</h3>
              <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(factor.description, language)}</p>
            </div>
          </article>
        })}
      </div>

      <div className={cx('grid gap-4 rounded-xl border-l-4 px-5 py-4', themeClasses.isLight ? 'border-[#C98A1A] bg-[#FFF8E8]' : 'border-[#E8B85D] bg-[#E8B85D]/8')}>
        <p className={cx('text-sm font-black', themeClasses.titleText)}>{text(content.reasoningExample.title, language)}</p>
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className={cx('rounded-lg px-3 py-2 text-sm font-bold', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]/45')}>{text(content.reasoningExample.facts[0], language)}</div>
          <ArrowRight className={cx('hidden h-4 w-4 sm:block', themeClasses.mutedText)} aria-hidden="true" />
          <div className={cx('rounded-lg px-3 py-2 text-sm font-bold', themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]/45')}>{text(content.reasoningExample.facts[1], language)}</div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className={cx('text-sm font-semibold', themeClasses.bodyText)}>{text(content.reasoningExample.question, language)}</span>
          <span className={cx('rounded-full px-3 py-1 text-xs font-black', themeClasses.isLight ? 'bg-[#F5E4BA] text-[#81570B]' : 'bg-[#E8B85D]/15 text-[#E8B85D]')}>{text(content.reasoningExample.answer, language)}</span>
        </div>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.reasoningExample.explanation, language)}</p>
      </div>
    </section>
  );

  return (
    <section className="grid gap-5">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="grid gap-3">
        <div className="grid gap-2">
          {content.ranges.map((item) => (
            <article key={item.range} className={cx('grid gap-3 rounded-xl border px-4 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-center', rangeTone[item.tone])}>
              <span className={cx('text-2xl font-black tabular-nums', themeClasses.accentText)}>{item.range}</span>
              <span className="grid gap-1">
                <span className={cx('text-sm font-black', themeClasses.titleText)}>{text(item.label, language)}</span>
                <span className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(item.description, language)}</span>
              </span>
            </article>
          ))}
        </div>
      </div>

      <div className={cx('rounded-xl border-l-4 px-5 py-4', themeClasses.isLight ? 'border-[#205F99] bg-[#EFF4FA]' : 'border-[#A8B8C8] bg-[#263B5B]/35')}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.takeaway, language)}</p>
      </div>

      <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.currentRole, language)}</p>

    </section>
  );
}

export function LlmBenchmarkLikelihood({ content, language, themeClasses }: LlmContentRendererProps<LlmBenchmarkLikelihoodContent>) {
  const selected = content.answers.reduce((best, answer) => answer.score > best.score ? answer : best, content.answers[0]);
  const stepNumberClass = themeClasses.isLight ? 'bg-[#205F99] text-white' : 'bg-[#A8B8C8] text-[#121A24]';

  if (content.compact) return (
    <section className="grid gap-4">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="flex items-start gap-3">
        <span className={cx('shrink-0 rounded-lg px-3 py-2 text-base font-black', stepNumberClass)}>{content.benchmark.name}</span>
        <p className={cx('pt-1 text-sm leading-6', themeClasses.bodyText)}>{text(content.benchmark.description, language)}</p>
      </div>
      <div className="grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
        <article className={cx('grid content-start gap-2 rounded-xl border px-4 py-3', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF4FA]' : 'border-[#A8B8C8]/18 bg-[#263B5B]/35')}>
          <span className={cx('text-xs font-black', themeClasses.accentText)}>1 · {text(content.labels.question, language)}</span>
          <p className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{text(content.question, language)}</p>
        </article>
        <ArrowRight className={cx('mx-auto hidden h-5 w-5 self-center lg:block', themeClasses.mutedText)} aria-hidden="true" />
        <article className={cx('grid content-start gap-2 rounded-xl border px-4 py-3', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
          <span className={cx('text-xs font-black', themeClasses.accentText)}>2 · {text(content.labels.likelihood, language)}</span>
          <div className={cx('overflow-x-auto text-center text-sm font-semibold', themeClasses.accentText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(content.formula, { throwOnError: false }) }} />
        </article>
        <ArrowRight className={cx('mx-auto hidden h-5 w-5 self-center lg:block', themeClasses.mutedText)} aria-hidden="true" />
        <article className={cx('grid content-start gap-2 rounded-xl border px-4 py-3', themeClasses.isLight ? 'border-[#5BAA12]/35 bg-[#F5FAEF]' : 'border-[#A8DB78]/25 bg-[#A8DB78]/8')}>
          <span className={cx('text-xs font-black', themeClasses.isLight ? 'text-[#397B0A]' : 'text-[#A8DB78]')}>3 · {text(content.labels.result, language)}</span>
          <div className="flex items-end justify-between gap-3">
            <p className={cx('text-base font-black', themeClasses.titleText)}>{selected.id}. {text(selected.text, language)}</p>
            <span className={cx('text-xl font-black tabular-nums', themeClasses.isLight ? 'text-[#397B0A]' : 'text-[#A8DB78]')}>{selected.score.toFixed(2)}</span>
          </div>
        </article>
      </div>
      <div className={cx('rounded-xl border-l-4 px-4 py-3', themeClasses.isLight ? 'border-[#C98A1A] bg-[#FFF8E8]' : 'border-[#E8B85D] bg-[#E8B85D]/8')}>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}><strong>{text(content.contamination.title, language)}:</strong> {text(content.contamination.body, language)}</p>
      </div>
    </section>
  );

  return (
    <section className="grid gap-5">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>

      <div className="flex items-start gap-3">
        <span className={cx('shrink-0 rounded-lg px-3 py-2 text-base font-black', stepNumberClass)}>{content.benchmark.name}</span>
        <p className={cx('pt-1 text-sm leading-6', themeClasses.bodyText)}>{text(content.benchmark.description, language)}</p>
      </div>

      <div className="grid gap-2">
        <article className={cx('grid gap-3 rounded-xl border px-5 py-4', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF4FA]' : 'border-[#A8B8C8]/18 bg-[#263B5B]/35')}>
          <div className="flex items-center gap-3">
            <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black', stepNumberClass)}>1</span>
            <h3 className={cx('text-sm font-black', themeClasses.accentText)}>{text(content.labels.question, language)}</h3>
          </div>
          <p className={cx('text-lg font-black leading-7', themeClasses.titleText)}>{text(content.question, language)}</p>
        </article>

        <ArrowDown className={cx('mx-auto h-5 w-5', themeClasses.mutedText)} aria-hidden="true" />

        <article className={cx('grid gap-4 rounded-xl border px-5 py-4', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black', stepNumberClass)}>2</span>
              <h3 className={cx('text-sm font-black', themeClasses.titleText)}>{text(content.labels.likelihood, language)}</h3>
            </div>
            <div className={cx('overflow-x-auto text-sm font-semibold', themeClasses.accentText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(content.formula, { throwOnError: false }) }} />
          </div>
          <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.method, language)}</p>
          <div className="grid gap-2 sm:grid-cols-2">
          {content.answers.map((answer) => {
            const isSelected = answer.id === selected.id;
            return <div key={answer.id} className={cx('grid gap-2 rounded-lg border px-4 py-3', isSelected ? (themeClasses.isLight ? 'border-[#5BAA12]/35 bg-[#F5FAEF]' : 'border-[#A8DB78]/25 bg-[#A8DB78]/8') : (themeClasses.isLight ? 'border-[#205089]/10 bg-[#F8FAFC]' : 'border-[#A8B8C8]/12 bg-[#263B5B]/25'))}>
              <div className="flex items-center justify-between gap-3">
                <span className={cx('text-sm font-black', themeClasses.titleText)}>{answer.id}. {text(answer.text, language)}</span>
                <span className={cx('text-sm font-black tabular-nums', isSelected ? (themeClasses.isLight ? 'text-[#397B0A]' : 'text-[#A8DB78]') : themeClasses.mutedText)}>{answer.score.toFixed(2)}</span>
              </div>
              <span className={cx('h-2 overflow-hidden rounded-full', themeClasses.isLight ? 'bg-[#E2E8F0]' : 'bg-[#263B5B]')}><span className={cx('block h-full rounded-full', isSelected ? 'bg-[#5BAA12]' : 'bg-[#8FA6BF]')} style={{ width: `${answer.score * 100}%` }} /></span>
            </div>;
          })}
          </div>
        </article>

        <ArrowDown className={cx('mx-auto h-5 w-5', themeClasses.mutedText)} aria-hidden="true" />

        <article className={cx('flex flex-wrap items-center gap-4 rounded-xl border px-5 py-4', themeClasses.isLight ? 'border-[#5BAA12]/35 bg-[#F5FAEF]' : 'border-[#A8DB78]/25 bg-[#A8DB78]/8')}>
          <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black', stepNumberClass)}>3</span>
          <div className="min-w-0 flex-1">
            <h3 className={cx('text-sm font-black', themeClasses.isLight ? 'text-[#397B0A]' : 'text-[#A8DB78]')}>{text(content.labels.result, language)}</h3>
            <p className={cx('mt-1 text-lg font-black leading-7', themeClasses.titleText)}>{selected.id}. {text(selected.text, language)}</p>
          </div>
          <div className="text-right">
            <p className={cx('text-xs font-bold', themeClasses.mutedText)}>{text(content.labels.highest, language)}</p>
            <p className={cx('text-2xl font-black tabular-nums', themeClasses.isLight ? 'text-[#397B0A]' : 'text-[#A8DB78]')}>{selected.score.toFixed(2)}</p>
          </div>
        </article>
      </div>

      <div className={cx('grid gap-2 rounded-xl border-l-4 px-5 py-4', themeClasses.isLight ? 'border-[#C98A1A] bg-[#FFF8E8]' : 'border-[#E8B85D] bg-[#E8B85D]/8')}>
        <p className={cx('text-sm font-black', themeClasses.titleText)}>{text(content.contamination.title, language)}</p>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.contamination.body, language)}</p>
      </div>
    </section>
  );
}

export function LlmPostTrainingEvaluation({ content, language, themeClasses }: LlmContentRendererProps<LlmPostTrainingEvaluationContent>) {
  const methodPresentation = {
    human: { Icon: Users, top: 'bg-[#DCE8F4]', icon: 'bg-white text-[#205089]' },
    judge: { Icon: Bot, top: 'bg-[#DCEEE8]', icon: 'bg-white text-[#2E6B5D]' },
  } satisfies Record<LlmPostTrainingEvaluationContent['methods'][number]['id'], { Icon: LucideIcon; top: string; icon: string }>;

  if (content.compact) return (
    <section className="grid gap-4">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="grid gap-3 sm:grid-cols-2">{content.methods.map((method) => {
        const { Icon, icon, top } = methodPresentation[method.id];
        return <article key={method.id} className={cx('grid min-h-[10rem] grid-cols-[76px_minmax(0,1fr)] overflow-hidden rounded-lg border', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
          <div className={cx('grid place-items-center border-r border-black/5', themeClasses.isLight ? top : 'bg-[#263B5B]')}>
            <div className={cx('grid h-11 w-11 place-items-center rounded-xl border border-black/5 shadow-[0_8px_18px_rgba(30,42,56,0.10)]', themeClasses.isLight ? icon : 'bg-[#172A43] text-[#BFD3F2]')}>
              <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
            </div>
          </div>
          <div className="grid content-start gap-2 p-4">
            <h3 className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{text(method.title, language)}</h3>
            <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(method.description, language)}</p>
          </div>
        </article>;
      })}</div>
      <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.next, language)}</p>
    </section>
  );

  return (
    <section className="grid gap-5">
      <div className={cx('rounded-xl border-l-4 px-5 py-4', themeClasses.isLight ? 'border-[#205F99] bg-[#EFF4FA]' : 'border-[#A8B8C8] bg-[#263B5B]/35')}><p className={cx('text-base font-semibold leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p></div>
      <div className="grid gap-3 sm:grid-cols-2">{content.methods.map((method) => {
        const { Icon, icon, top } = methodPresentation[method.id];
        return <article key={method.id} className={cx('grid min-h-[18rem] grid-rows-[120px_minmax(0,1fr)] overflow-hidden rounded-lg border', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
          <div className={cx('grid place-items-center border-b border-black/5', themeClasses.isLight ? top : 'bg-[#263B5B]')}>
            <div className={cx('grid h-16 w-16 place-items-center rounded-2xl border border-black/5 shadow-[0_12px_24px_rgba(30,42,56,0.12)]', themeClasses.isLight ? icon : 'bg-[#172A43] text-[#BFD3F2]')}>
              <Icon className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
            </div>
          </div>
          <div className="grid content-start gap-3 p-4">
            <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{text(method.title, language)}</h3>
            <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(method.description, language)}</p>
          </div>
        </article>;
      })}</div>
      <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.next, language)}</p>
    </section>
  );
}

export function LlmProbabilityDefinition({ content, language, themeClasses }: LlmContentRendererProps<LlmProbabilityDefinitionContent>) {
  const renderedFormula = katex.renderToString(content.formula, { displayMode: true, throwOnError: false });

  return (
    <section className="grid gap-5">
      <h2 className={cx('text-lg font-black leading-7', themeClasses.accentText)}>{text(content.title, language)}</h2>
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.definition, language)}</p>
      <div className={cx('overflow-x-auto rounded-lg border px-5 py-4 text-center font-serif text-xl font-semibold tracking-wide sm:text-2xl', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF4FA] text-[#123B68]' : 'border-[#A8B8C8]/18 bg-[#A8B8C8]/8 text-[#E5EEF8]')}>
        <span dangerouslySetInnerHTML={{ __html: renderedFormula }} />
      </div>
      <div className="grid gap-3">
        {content.examples.map((example) => (
          <div key={example.formula} className={cx('grid gap-2 rounded-lg border px-4 py-3', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
            <div className="min-w-0">
              <div className={cx('overflow-x-auto py-1 text-center text-lg font-semibold', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(example.formula, { throwOnError: false }) }} />
              <p className={cx('mt-1 text-sm leading-6', themeClasses.bodyText)}>→ {text(example.explanation, language)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function LlmAutoregressiveDefinition({ content, language, themeClasses }: LlmContentRendererProps<LlmAutoregressiveDefinitionContent>) {
  const renderedFormula = katex.renderToString(content.formula, { displayMode: true, throwOnError: false });

  return (
    <section className="grid gap-5">
      <h2 className={cx('text-lg font-black leading-7', themeClasses.accentText)}>{text(content.title, language)}</h2>
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>
        {text(content.leadSubject, language)}{text(content.leadMiddle, language)}{text(content.leadEmphasis, language)}.
      </p>
      <div className={cx('overflow-x-auto rounded-lg border px-5 py-5 text-center text-xl font-semibold sm:text-2xl', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF4FA] text-[#123B68]' : 'border-[#A8B8C8]/18 bg-[#A8B8C8]/8 text-[#E5EEF8]')}>
        <span dangerouslySetInnerHTML={{ __html: renderedFormula }} />
      </div>
      <div className="grid gap-2">
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.exampleLead, language)}</p>
        <div className={cx('grid gap-2 rounded-lg border px-4 py-3', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
          {content.exampleSteps.map((step) => (
            <div key={step} className={cx('overflow-x-auto text-center text-base', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(step, { throwOnError: false }) }} />
          ))}
        </div>
        <p className={cx('mt-1 text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.resultLead, language)}</p>
        <div className={cx('overflow-x-auto rounded-lg border px-4 py-3 text-center text-lg font-semibold', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF4FA] text-[#123B68]' : 'border-[#A8B8C8]/18 bg-[#A8B8C8]/8 text-[#E5EEF8]')} dangerouslySetInnerHTML={{ __html: katex.renderToString(content.resultFormula, { throwOnError: false }) }} />
      </div>
    </section>
  );
}

export function LlmArInferencePipeline({ content, step = 0, language, themeClasses }: {
  content: LlmArInferencePipelineContent;
  step?: number;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const llmTheme = getLlmRendererTheme(themeClasses);
  const activeStep = Math.min(Math.max(step, 0), content.steps.length - 1);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const tokenizerRef = useRef<HTMLDivElement | null>(null);
  const tokenIdsRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const distributionRef = useRef<HTMLDivElement | null>(null);
  const sampleRef = useRef<HTMLDivElement | null>(null);
  const detokenizeRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [connectorPaths, setConnectorPaths] = useState<string[]>([]);
  const stageTone = (stage: number) => cx(
    'transition-[filter,opacity] duration-200',
    activeStep === stage ? 'opacity-100' : activeStep > stage ? 'opacity-70' : 'opacity-20 saturate-[0.55]',
  );
  const connectorTone = (stage: number) => activeStep >= stage ? 'opacity-100' : 'opacity-15';

  useEffect(() => {
    const canvas = canvasRef.current;
    const elements = [tokenizerRef.current, tokenIdsRef.current, modelRef.current, distributionRef.current, sampleRef.current, detokenizeRef.current, containerRef.current, inputRef.current];
    if (!canvas || elements.some((element) => !element)) return;

    const [tokenizer, tokenIds, model, distribution, _sample, detokenize, container, inputEl] = elements as HTMLDivElement[];
    const updateConnectors = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const tokenizerAnchor = getDiagramAnchor(tokenizer, canvasRect);
      const tokenIdsAnchor = getDiagramAnchor(tokenIds, canvasRect);
      const modelAnchor = getDiagramAnchor(model, canvasRect);
      const distributionAnchor = getDiagramAnchor(distribution, canvasRect);
      const containerAnchor = getDiagramAnchor(container, canvasRect);
      const detokenizeAnchor = getDiagramAnchor(detokenize, canvasRect);
      const inputAnchor = getDiagramAnchor(inputEl, canvasRect);

      /* All horizontal connectors run at the common center Y */
      const flowY = modelAnchor.centerY;

      setConnectorPaths([
        /* 0: Tokenizer → Token IDs (straight horizontal) */
        `M ${tokenizerAnchor.right} ${flowY} H ${tokenIdsAnchor.left}`,
        /* 1: Token IDs → Model (straight horizontal) */
        `M ${tokenIdsAnchor.right} ${flowY} H ${modelAnchor.left}`,
        /* 2: Model → Distribution (straight horizontal) */
        `M ${modelAnchor.right} ${flowY} H ${distributionAnchor.left}`,
        /* 3: Distribution → Container (vertical down, center-aligned) */
        `M ${containerAnchor.centerX} ${distributionAnchor.bottom} V ${containerAnchor.top}`,
        /* 4: Autoregressive feedback loop: container bottom → input bottom */
        `M ${detokenizeAnchor.centerX} ${containerAnchor.bottom} Q ${(detokenizeAnchor.centerX + inputAnchor.centerX) / 2} ${containerAnchor.bottom + 48}, ${inputAnchor.centerX} ${inputAnchor.bottom}`,
      ]);
    };

    return observeDiagramLayout(canvas, elements as HTMLDivElement[], updateConnectors);
  }, []);

  return (
    <section className="grid gap-5">
      <div className="grid gap-1">
        <h2 className={cx('text-lg font-black leading-7', themeClasses.accentText)}>Bước {activeStep + 1}: {text(content.steps[activeStep].label, language)}</h2>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.steps[activeStep].description, language)}</p>
      </div>

      <div className="overflow-x-auto pb-2" aria-live="polite">
        <div ref={canvasRef} className="relative h-[30rem] w-full min-w-[64rem] overflow-hidden rounded-xl bg-gradient-to-br from-transparent to-[#205089]/[0.025]">
          <DiagramConnectorLayer
            color={llmTheme.connector}
            markerId="ar-pipeline-arrow"
            paths={connectorPaths.map((d, index) => {
              const isLoop = index === connectorPaths.length - 1;
              return { className: cx('transition-opacity duration-200', isLoop ? connectorTone(4) : connectorTone(index)), d, strokeDasharray: isLoop ? '5 4' : undefined, strokeWidth: isLoop ? 1.5 : 2 };
            })}
          />

          <div ref={inputRef} className={cx('absolute left-7 top-[12.5rem] grid w-[13.5rem] justify-items-center gap-2', stageTone(0))}>
            <ArrowDown className={cx('h-4 w-4 rotate-180', themeClasses.mutedText)} strokeWidth={1.6} aria-hidden="true" />
            <p className={cx('rounded-lg px-4 py-2 text-center text-base font-black', themeClasses.isLight ? 'bg-[#F3F6F9] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')}>{content.inputText}</p>
            <div className={cx('text-xs font-semibold', themeClasses.mutedText)}>Câu đầu vào</div>
          </div>

          <div className={cx('absolute left-5 top-[7.25rem] w-[13.5rem]', stageTone(0))}>
            <div ref={tokenizerRef} className={cx('rounded-xl px-4 py-6 text-center text-lg font-black', themeClasses.isLight ? 'bg-[#EBD9E8] text-[#56314F]' : 'bg-[#6C4B66]/55 text-[#F7DDF1]')}>Tokenizer</div>
          </div>

          <div className={cx('absolute left-[18rem] top-[4rem] grid w-16 justify-items-center gap-2', stageTone(0))}>
            <div className={cx('text-center text-[0.65rem] font-black uppercase tracking-wide', themeClasses.mutedText)}>Token IDs</div>
            <div ref={tokenIdsRef} className={cx('grid h-32 w-10 content-evenly justify-items-center rounded-lg', themeClasses.isLight ? 'bg-[#F4E5EF]' : 'bg-[#6C4B66]/55')}>
              {content.tokenIds.map((tokenId) => (
                <span key={tokenId} className={cx('grid h-6 w-6 place-items-center rounded-full text-xs font-black tabular-nums', themeClasses.isLight ? 'bg-[#F6CFE4] text-[#713255] ring-1 ring-[#8D436F]' : 'bg-[#D58AB5] text-[#2E1728] ring-1 ring-[#F4C8E1]/60')}>{tokenId}</span>
              ))}
            </div>
          </div>

          <div ref={modelRef} className={cx('absolute left-[42%] top-[3.25rem] grid h-48 w-32 place-items-center rounded-xl px-4 py-5 text-center', stageTone(1), themeClasses.isLight ? 'bg-[#DDF2C7] text-[#29471E]' : 'bg-[#52723C]/55 text-[#E1F5D1]')}>
            <div>
              <div className="text-base font-black">{text(content.modelLabel, language)}</div>
              <div className="mt-2 text-xs font-semibold leading-5">Forward</div>
            </div>
          </div>

          <div ref={distributionRef} className={cx('absolute right-4 top-[4.75rem] grid w-[clamp(17rem,25%,24rem)] gap-3', stageTone(2))}>
            <div className={cx('text-xs font-black uppercase tracking-wide', themeClasses.mutedText)}>Next-token distribution</div>
            <div className="grid gap-2">
              {content.candidates.map((candidate) => (
                <div key={candidate.token} className="grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className={cx('font-black', themeClasses.titleText)}>{candidate.token}</span>
                    <span className={cx('rounded px-1 py-0.5 text-[0.65rem] font-black tabular-nums', themeClasses.isLight ? 'bg-[#D8D2C2] text-[#514B3F]' : 'bg-[#575247] text-[#F1EBDD]')}>{candidate.tokenId}</span>
                  </span>
                  <span className={cx('h-3 overflow-hidden rounded-sm', themeClasses.isLight ? 'bg-[#E4E9EF]' : 'bg-[#263B5B]')}>
                    <span className="block h-full bg-[#88A978]" style={{ width: `${candidate.probability * 100}%` }} />
                  </span>
                  <span className={cx('text-right tabular-nums', themeClasses.titleText)}>{Math.round(candidate.probability * 100)}%</span>
                </div>
              ))}
            </div>
            <p className={cx('text-xs leading-5', themeClasses.bodyText)}>Phân phối xác suất cho token tiếp theo</p>
          </div>

          {/* Inference Pipeline: Sample + Detokenize container block */}
          <div ref={containerRef} className={cx('absolute right-4 top-[18.5rem] w-[clamp(19rem,44%,30rem)] rounded-xl border-2 border-dashed p-4', stageTone(3), themeClasses.isLight ? 'border-[#205089]/25 bg-[#205089]/[0.035]' : 'border-[#A8B8C8]/25 bg-[#A8B8C8]/[0.04]')}>
            <div className={cx('mb-3 text-[0.6rem] font-black uppercase tracking-widest', themeClasses.mutedText)}>
              Inference Pipeline
            </div>
            <div className="grid grid-cols-[auto_2rem_1fr] items-center gap-3">
              {/* Sample */}
              <div ref={sampleRef} className={cx('grid justify-items-center gap-1', stageTone(3))}>
                <div className={cx('text-[0.65rem] font-black uppercase tracking-wide', themeClasses.mutedText)}>Sample</div>
                <span className={cx('rounded-lg px-4 py-2 text-base font-black', themeClasses.isLight ? 'bg-[#F4D8A4] text-[#674518]' : 'bg-[#8B6734]/45 text-[#FFE5B4]')}>{content.sampledToken}</span>
                <span className={cx('min-w-8 rounded px-2 py-1 text-center text-xs font-black tabular-nums', themeClasses.isLight ? 'bg-[#D8D2C2] text-[#514B3F]' : 'bg-[#575247] text-[#F1EBDD]')}>{content.sampledTokenId}</span>
              </div>

              {/* Arrow */}
              <ArrowRight className={cx('h-5 w-5 justify-self-center', stageTone(4), themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />

              {/* Detokenize */}
              <div ref={detokenizeRef} className={cx('grid justify-items-center gap-2 text-center', stageTone(4))}>
                <div className={cx('text-[0.65rem] font-black uppercase tracking-wide', themeClasses.mutedText)}>Detokenize</div>
                <p className={cx('rounded-lg px-4 py-3 text-base font-black leading-6', themeClasses.isLight ? 'bg-[#E7EFF8] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')}>{content.outputText}</p>
              </div>
            </div>
          </div>

          {/* Autoregressive feedback loop label */}
          <div className={cx('absolute bottom-2 left-[26%] flex items-center gap-2', stageTone(4))}>
            <ArrowDown className={cx('h-3 w-3 rotate-90', themeClasses.mutedText)} strokeWidth={1.8} aria-hidden="true" />
            <span className={cx('text-[0.5rem] font-black uppercase tracking-widest', themeClasses.mutedText)}>
              Autoregressive loop
            </span>
            <ArrowDown className={cx('h-3 w-3 -rotate-90', themeClasses.mutedText)} strokeWidth={1.8} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function LlmVocabularyOutputVector({ content, language, themeClasses }: LlmContentRendererProps<LlmVocabularyOutputVectorContent>) {
  return (
    <section className="grid gap-5">
      <div className="grid gap-2">
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.corpusDefinition, language)}</p>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      </div>

      <div className="grid items-stretch gap-3 md:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,0.9fr)_auto_minmax(0,1.35fr)]">
        <div className={cx('grid content-center gap-2 rounded-lg p-4', themeClasses.isLight ? 'bg-[#F8FAFC]' : 'bg-[#121A24]/36')}>
          <div className={cx('text-xs font-black uppercase tracking-wide', themeClasses.mutedText)}>Corpus</div>
          <p className={cx('text-sm font-semibold leading-6', themeClasses.titleText)}>{text(content.corpusLabel, language)}</p>
        </div>
        <ArrowRight className={cx('mx-auto hidden h-6 w-6 self-center md:block', themeClasses.accentText)} aria-hidden="true" />
        <div className={cx('grid content-center gap-2 rounded-lg p-4', themeClasses.isLight ? 'bg-[#EFF4FA]' : 'bg-[#A8B8C8]/9')}>
          <div className={cx('text-xs font-black uppercase tracking-wide', themeClasses.mutedText)}>Vocabulary</div>
          <p className={cx('text-sm font-semibold leading-6', themeClasses.titleText)}>{text(content.vocabularyLabel, language)}</p>
        </div>
        <ArrowRight className={cx('mx-auto hidden h-6 w-6 self-center md:block', themeClasses.accentText)} aria-hidden="true" />
        <div className={cx('grid gap-3 rounded-lg p-4', themeClasses.isLight ? 'bg-[#F8FAFC]' : 'bg-[#121A24]/44')}>
          <div>
            <div className={cx('text-xs font-black uppercase tracking-wide', themeClasses.mutedText)}>Output vector</div>
            <p className={cx('mt-1 text-sm font-semibold leading-6', themeClasses.titleText)}>{text(content.vectorLabel, language)}</p>
          </div>
          <div className="grid gap-2">
            {content.entries.map((entry) => (
              <div key={entry.tokenId} className="grid grid-cols-[2.5rem_4.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-sm">
                <span className={cx('rounded px-1.5 py-0.5 text-center text-xs font-black tabular-nums', themeClasses.isLight ? 'bg-[#D8D2C2] text-[#514B3F]' : 'bg-[#575247] text-[#F1EBDD]')}>{entry.tokenId}</span>
                <span className={cx('truncate font-bold', themeClasses.titleText)}>{entry.token}</span>
                <span className={cx('h-3 overflow-hidden rounded-full', themeClasses.isLight ? 'bg-[#DDE4EE]' : 'bg-[#263B5B]')}><span className="block h-full rounded-full bg-[#4B78AD]" style={{ width: `${entry.probability * 100}%` }} /></span>
                <span className={cx('text-right text-xs tabular-nums', themeClasses.mutedText)}>{Math.round(entry.probability * 100)}%</span>
              </div>
            ))}
          </div>
          <div className={cx('text-right text-xs font-black', themeClasses.accentText)}>Σ p(token) = 1</div>
        </div>
      </div>

      <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.note, language)}</p>
    </section>
  );
}

export function LlmOutputProjection({ content, focus = 'overview', language, themeClasses }: {
  content: LlmOutputProjectionContent;
  focus?: LlmOutputProjectionFocus;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const llmTheme = getLlmRendererTheme(themeClasses);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const neuralNetworkRef = useRef<HTMLDivElement | null>(null);
  const contextVectorRef = useRef<HTMLDivElement | null>(null);
  const linearLayerRef = useRef<HTMLDivElement | null>(null);
  const logitsRef = useRef<HTMLDivElement | null>(null);
  const distributionRef = useRef<HTMLDivElement | null>(null);
  const [connectorPaths, setConnectorPaths] = useState<string[]>([]);
  const [softmaxPosition, setSoftmaxPosition] = useState<{ x: number; y: number } | null>(null);
  const isFocused = (...targets: LlmOutputProjectionFocus[]) => focus === 'overview' || targets.includes(focus);
  const focusTone = (...targets: LlmOutputProjectionFocus[]) => isFocused(...targets) ? 'opacity-100' : 'opacity-20 saturate-[0.55]';
  const connectorFocuses: LlmOutputProjectionFocus[] = ['context-vector', 'linear', 'logits', 'distribution'];

  useEffect(() => {
    const canvas = canvasRef.current;
    const elements = [neuralNetworkRef.current, contextVectorRef.current, linearLayerRef.current, logitsRef.current, distributionRef.current];
    if (!canvas || elements.some((element) => !element)) return;

    const [neuralNetwork, contextVector, linearLayer, logits, distribution] = elements as HTMLDivElement[];
    const updateConnectors = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const networkAnchor = getDiagramAnchor(neuralNetwork, canvasRect);
      const contextAnchor = getDiagramAnchor(contextVector, canvasRect);
      const linearAnchor = getDiagramAnchor(linearLayer, canvasRect);
      const logitsAnchor = getDiagramAnchor(logits, canvasRect);
      const distributionAnchor = getDiagramAnchor(distribution, canvasRect);
      const elbowX = contextAnchor.right + Math.max(28, (linearAnchor.left - contextAnchor.right) * 0.42);

      setConnectorPaths([
        `M ${networkAnchor.right} ${networkAnchor.centerY} H ${contextAnchor.left}`,
        `M ${contextAnchor.right} ${contextAnchor.centerY} H ${elbowX} V ${linearAnchor.centerY} H ${linearAnchor.left}`,
        `M ${linearAnchor.right} ${linearAnchor.centerY} H ${logitsAnchor.left}`,
        `M ${logitsAnchor.right} ${logitsAnchor.centerY} H ${distributionAnchor.left}`,
      ]);
      setSoftmaxPosition({
        x: logitsAnchor.right + (distributionAnchor.left - logitsAnchor.right) / 2,
        y: logitsAnchor.centerY - 28,
      });
    };

    return observeDiagramLayout(canvas, elements as HTMLDivElement[], updateConnectors);
  }, []);

  return (
    <section className="grid gap-5">
      <div className="grid gap-1">
        <h2 className={cx('text-lg font-black leading-7', themeClasses.accentText)}>{text(content.title, language)}</h2>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>
          {text(content.lead, language)}
          {content.leadFormula ? <span className="ml-1 inline-block" dangerouslySetInnerHTML={{ __html: katex.renderToString(content.leadFormula, { throwOnError: false }) }} /> : null}
        </p>
      </div>
      <div className="overflow-x-auto pb-2">
        <div ref={canvasRef} className="relative h-[30rem] w-full min-w-[64rem] overflow-hidden rounded-xl bg-gradient-to-br from-transparent to-[#205089]/[0.025]">
          <DiagramConnectorLayer
            color={llmTheme.connector}
            markerId="projection-arrow"
            paths={connectorPaths.map((d, index) => ({ className: cx('transition-opacity duration-200', isFocused(connectorFocuses[index]) ? 'opacity-100' : 'opacity-15'), d }))}
          />

          <div className={cx('absolute left-5 top-[15.15rem] w-[13.5rem] transition-[filter,opacity] duration-200', focusTone('context-input', 'context-vector'))}>
            <div ref={neuralNetworkRef} className={cx('rounded-xl px-4 py-6 text-center text-lg font-black', themeClasses.isLight ? 'bg-[#EBD9E8] text-[#56314F]' : 'bg-[#6C4B66]/55 text-[#F7DDF1]')}>Neural network</div>
          </div>

          <div className={cx('absolute bottom-5 left-7 w-[13.5rem] transition-[filter,opacity] duration-200', focusTone('context-input'))}>
            <div className="flex items-end justify-center gap-2">
              {content.contextTokens.map((token, tokenIndex) => (
                <div key={`${token}-${tokenIndex}`} className="grid justify-items-center gap-1.5">
                  <ArrowDown className={cx('h-4 w-4 rotate-180', themeClasses.mutedText)} strokeWidth={1.6} aria-hidden="true" />
                  <div className={cx('grid h-14 w-6 content-evenly justify-items-center rounded-md', themeClasses.isLight ? 'bg-[#E7EBF0]' : 'bg-[#263B5B]')}>
                    {[0, 1, 2].map((dot) => <span key={dot} className={cx('h-2 w-2 rounded-full', themeClasses.isLight ? 'bg-white ring-1 ring-[#667382]/60' : 'bg-[#A8B8C8]/70')} />)}
                  </div>
                  <span className={cx('text-sm font-black', themeClasses.titleText)}>{token}</span>
                </div>
              ))}
            </div>
            <div className={cx('mt-2 text-center text-xs font-semibold', themeClasses.mutedText)}>Input token embeddings</div>
          </div>

          <div className={cx('absolute left-[18rem] top-[11.25rem] grid w-16 justify-items-center gap-2 transition-[filter,opacity] duration-200', focusTone('context-vector', 'linear'))}>
            <div className={cx('text-center text-[0.65rem] font-black uppercase tracking-wide', themeClasses.mutedText)}>{text(content.stages[0].label, language)}</div>
            <div ref={contextVectorRef} className={cx('grid h-32 w-10 content-evenly justify-items-center rounded-lg', themeClasses.isLight ? 'bg-[#F4E5EF]' : 'bg-[#6C4B66]/55')}>
              {[0, 1, 2, 3, 4].map((dot) => <span key={dot} className={cx('h-3 w-3 rounded-full', themeClasses.isLight ? 'bg-[#F6CFE4] ring-1 ring-[#8D436F]' : 'bg-[#D58AB5] ring-1 ring-[#F4C8E1]/60')} />)}
            </div>
            <div className={cx('text-center text-sm font-semibold', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(content.stages[0].formula, { throwOnError: false }) }} />
            {content.stages[0].description ? <p className={cx('w-28 text-center text-xs leading-5', themeClasses.bodyText)}>{text(content.stages[0].description, language)}</p> : null}
          </div>

          <div ref={linearLayerRef} className={cx('absolute left-[42%] top-[4.5rem] grid h-48 w-32 place-items-center px-4 py-5 text-center transition-[filter,opacity] duration-200', focusTone('linear', 'logits'), themeClasses.isLight ? 'bg-[#DDF2C7]' : 'bg-[#52723C]/55')} style={{ clipPath: 'polygon(0 25%, 100% 0, 100% 100%, 0 75%)' }}>
            <div className={themeClasses.isLight ? 'text-[#29471E]' : 'text-[#E1F5D1]'}>
              <div className="text-base font-black">{text(content.stages[1].label, language)}</div>
              <div className="mt-2 text-base font-semibold" dangerouslySetInnerHTML={{ __html: katex.renderToString(content.stages[1].formula, { throwOnError: false }) }} />
              <div className="mt-2 text-xs leading-5">d → |V|</div>
            </div>
          </div>

          <div ref={logitsRef} className={cx('absolute left-[59%] top-[4.25rem] grid w-10 justify-items-center gap-1 transition-[filter,opacity] duration-200', focusTone('logits', 'distribution'))}>
            <div className={cx('text-[0.65rem] font-black uppercase tracking-wide', themeClasses.mutedText)}>{text(content.stages[2].label, language)}</div>
            <div className="grid content-evenly gap-1.5">{Array.from({ length: 8 }, (_, index) => <span key={index} className={cx('h-3.5 w-3.5 rounded-full', themeClasses.isLight ? 'bg-[#F1D4E4] ring-1 ring-[#8D436F]/55' : 'bg-[#D58AB5]/80')} />)}</div>
            <div className={cx('whitespace-nowrap text-xs font-semibold', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(content.stages[2].formula, { throwOnError: false }) }} />
          </div>

          <div
            className={cx('absolute grid -translate-x-1/2 justify-items-center gap-1 transition-[filter,opacity] duration-200', focusTone('distribution'))}
            style={softmaxPosition ? { left: softmaxPosition.x, top: softmaxPosition.y } : { visibility: 'hidden' }}
          >
            <div className={cx('text-sm font-black', themeClasses.titleText)}>softmax</div>
          </div>

          <div ref={distributionRef} className={cx('absolute right-4 top-[4rem] grid w-[clamp(17rem,25%,24rem)] gap-3 transition-[filter,opacity] duration-200', focusTone('distribution'))}>
            <div>
              <div className={cx('text-xs font-black uppercase tracking-wide', themeClasses.mutedText)}>Next-token distribution</div>
              <div className={cx('mt-1 text-sm font-semibold', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(content.stages[3].formula, { throwOnError: false }) }} />
            </div>
            <div className="grid gap-2">
              {content.probabilities.map((item) => (
                <div key={item.token} className="grid grid-cols-[3.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs">
                  <span className={cx('font-bold', themeClasses.titleText)}>{item.token}</span>
                  <span className={cx('h-3.5 overflow-hidden rounded-sm', themeClasses.isLight ? 'bg-[#E7EBF0]' : 'bg-[#263B5B]')}><span className="block h-full bg-[#86A873]" style={{ width: `${item.probability * 100}%` }} /></span>
                  <span className={cx('text-right tabular-nums', themeClasses.mutedText)}>{Math.round(item.probability * 100)}%</span>
                </div>
              ))}
            </div>
            <p className={cx('text-xs leading-5', themeClasses.bodyText)}>Probability distribution for the next token</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LlmNextTokenLoss({ content, position = 0, animated = false, language, themeClasses }: {
  content: LlmNextTokenLossContent;
  position?: number;
  animated?: boolean;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(animated);
  const totalAnimationSteps = content.sequence.length * 2;
  const activePosition = animated ? Math.floor(animationStep / 2) : Math.min(Math.max(position, 0), content.sequence.length - 1);
  const isUpdatePhase = animated && animationStep % 2 === 1;
  const targetToken = content.sequence[activePosition];
  const trainingPrefix = content.sequence.slice(0, activePosition);
  const trainingSuffix = content.sequence.slice(activePosition + 1);
  const candidates = content.vocabulary.map((token, index) => ({ token, probability: content.distributions[activePosition]?.[index] ?? 0 }));
  const updatedCandidates = content.vocabulary.map((token, index) => ({ token, probability: content.updatedDistributions[activePosition]?.[index] ?? 0 }));
  const targetIndex = content.vocabulary.indexOf(targetToken);
  const initialLoss = -Math.log(content.distributions[activePosition]?.[targetIndex] || Number.EPSILON);
  const updatedLoss = -Math.log(content.updatedDistributions[activePosition]?.[targetIndex] || Number.EPSILON);
  const renderedFormula = content.formula.replace('TARGET', targetToken === '<eos>' ? '\\text{<eos>}' : `\\text{${targetToken}}`);

  useEffect(() => {
    if (!animated || !isPlaying) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setAnimationStep((current) => {
        if (current >= totalAnimationSteps - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1800);
    return () => window.clearTimeout(timer);
  }, [animated, animationStep, isPlaying, totalAnimationSteps]);

  return (
    <section className="grid gap-5">
      <div className="grid gap-1">
        <h2 className={cx('text-lg font-black leading-7', themeClasses.accentText)}>{text(content.title, language)}</h2>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      </div>
      {animated ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className={cx('text-sm font-black tabular-nums', themeClasses.mutedText)}>
            Token {activePosition + 1}/{content.sequence.length} · {isUpdatePhase ? (language === 'vi' ? 'Cập nhật' : 'Update') : (language === 'vi' ? 'Dự đoán' : 'Predict')}
          </div>
          <StepPlaybackControls
            isPlaying={isPlaying}
            labels={{
              next: language === 'vi' ? 'Bước tiếp theo' : 'Next step',
              pause: language === 'vi' ? 'Tạm dừng' : 'Pause',
              play: language === 'vi' ? 'Phát' : 'Play',
              previous: language === 'vi' ? 'Bước trước' : 'Previous step',
              reset: language === 'vi' ? 'Phát lại' : 'Replay',
            }}
            nextDisabled={animationStep === totalAnimationSteps - 1}
            onNext={() => { setIsPlaying(false); setAnimationStep((current) => Math.min(totalAnimationSteps - 1, current + 1)); }}
            onPrevious={() => { setIsPlaying(false); setAnimationStep((current) => Math.max(0, current - 1)); }}
            onReset={() => { setAnimationStep(0); setIsPlaying(true); }}
            onTogglePlay={() => setIsPlaying((playing) => !playing)}
            playDisabled={!isPlaying && animationStep === totalAnimationSteps - 1}
            presentation="loss-animation"
            previousDisabled={animationStep === 0}
            themeClasses={themeClasses}
          />
        </div>
      ) : null}
      <div className={cx('grid justify-items-center rounded-xl px-5 pb-5 pt-20', themeClasses.isLight ? 'bg-[#F8FAFC]' : 'bg-[#121A24]/36')}>
        <div className={cx('flex flex-wrap items-baseline justify-center gap-x-2 text-xl font-semibold', themeClasses.titleText)}>
          <span className={cx('text-sm font-black uppercase tracking-wide', themeClasses.mutedText)}>Training example:</span>
          {trainingPrefix.length > 0 ? <span>{trainingPrefix.join(' ')}</span> : null}
          <span className={cx('relative', themeClasses.isLight ? 'text-[#5BAA12]' : 'text-[#A8DB78]')}>
            <span className="absolute bottom-[calc(100%+0.4rem)] left-1/2 grid w-max -translate-x-1/2 justify-items-center gap-1">
              <span className="text-sm font-black">{text(content.targetHint, language)}</span>
              <ArrowDown className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            </span>
            {targetToken}
          </span>
          {trainingSuffix.length > 0 ? <span className="opacity-35">{trainingSuffix.join(' ')}</span> : null}
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(8rem,0.45fr)_minmax(0,1fr)]">
        <div className="grid gap-3">
          <div className={cx('text-sm font-black', themeClasses.titleText)}>{text(content.predictionLabel, language)}</div>
          <div className="grid gap-2">
            {candidates.map((candidate) => {
              const isTarget = candidate.token === targetToken;
              return (
                <div key={candidate.token} className="grid grid-cols-[4rem_minmax(0,1fr)_3rem] items-center gap-2 text-sm">
                  <span className={cx('font-black', isTarget ? themeClasses.isLight ? 'text-[#5BAA12]' : 'text-[#A8DB78]' : themeClasses.titleText)}>{candidate.token}</span>
                  <span className={cx('h-3 overflow-hidden rounded-sm', themeClasses.isLight ? 'bg-[#E4E9EF]' : 'bg-[#263B5B]')}>
                    <span className={cx('block h-full', isTarget ? 'bg-[#75B936]' : 'bg-[#A8B0B8]')} style={{ width: `${candidate.probability * 100}%` }} />
                  </span>
                  <span className={cx('text-right tabular-nums', themeClasses.mutedText)}>{Math.round(candidate.probability * 100)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid justify-items-center gap-3">
          <div className={cx('text-sm font-black', themeClasses.titleText)}>{text(content.targetLabel, language)}</div>
          <div className={cx('grid overflow-hidden rounded-md', themeClasses.isLight ? 'bg-[#F1F3F5]' : 'bg-[#263B5B]/55')}>
            {candidates.map((candidate) => {
              const isTarget = candidate.token === targetToken;
              return <span key={candidate.token} className={cx('grid h-8 w-10 place-items-center text-sm tabular-nums', isTarget && (themeClasses.isLight ? 'bg-[#DDF6C5] font-black text-[#4A8D0B] ring-1 ring-inset ring-[#5BAA12]' : 'bg-[#537736] font-black text-[#E2F6CD] ring-1 ring-inset ring-[#A8DB78]'))}>{isTarget ? 1 : 0}</span>;
            })}
          </div>
        </div>

        <div className={cx('grid gap-3 transition-opacity duration-200', isUpdatePhase ? 'opacity-100' : 'opacity-35')}>
          <div className={cx('text-sm font-black', themeClasses.titleText)}>{text(content.optimizationLabel, language)}</div>
          <div className={cx('overflow-x-auto text-center text-lg font-semibold', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(renderedFormula, { throwOnError: false }) }} />
          <div className={cx('text-center text-sm font-black tabular-nums', isUpdatePhase ? themeClasses.accentText : themeClasses.mutedText)}>
            Loss: {initialLoss.toFixed(2)}{isUpdatePhase ? ` → ${updatedLoss.toFixed(2)}` : ''}
          </div>
          <div className="grid gap-2">
            {(isUpdatePhase ? updatedCandidates : candidates).map((candidate) => {
              const isTarget = candidate.token === targetToken;
              return (
                <div key={candidate.token} className="grid grid-cols-[4rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-sm">
                  <span className={cx('font-black', isTarget ? themeClasses.isLight ? 'text-[#5BAA12]' : 'text-[#A8DB78]' : themeClasses.titleText)}>{candidate.token}</span>
                  <span className={cx('h-3 overflow-hidden rounded-sm', themeClasses.isLight ? 'bg-[#E4E9EF]' : 'bg-[#263B5B]')}>
                    <span className={cx('block h-full', isTarget ? 'bg-[#75B936]' : 'bg-[#A8B0B8]')} style={{ width: `${candidate.probability * 100}%` }} />
                  </span>
                  <span className={cx('font-black', isTarget ? themeClasses.isLight ? 'text-[#5BAA12]' : 'text-[#A8DB78]' : themeClasses.mutedText)}>{isTarget ? `↑ ${text(content.increaseLabel, language)}` : `↓ ${text(content.decreaseLabel, language)}`}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.note, language)}</p>
    </section>
  );
}

export function LlmLossHandCalculation({ content, language, themeClasses }: LlmContentRendererProps<LlmLossHandCalculationContent>) {
  const [probability, setProbability] = useState(0.5);
  const loss = -Math.log(probability);
  const examples = [0.1, 0.5, 0.9];
  const contextText = content.sentence.slice(0, content.targetIndex).join(' ');
  const probabilityLabel = `p(${content.targetToken} | ${contextText})`;
  const formula = `\\mathcal{L} = -\\ln p(\\text{${content.targetToken}} \\mid \\text{${contextText}}) = -\\ln(${probability.toFixed(2)}) = ${loss.toFixed(3)}`;
  const otherWeightTotal = content.otherTokens.reduce((sum, item) => sum + item.weight, 0);
  const distribution = [
    { token: content.targetToken, probability, isTarget: true },
    ...content.otherTokens.map((item) => ({ token: item.token, probability: (1 - probability) * item.weight / otherWeightTotal, isTarget: false })),
  ];
  const maxCurveLoss = -Math.log(0.01);
  const curvePath = Array.from({ length: 100 }, (_, index) => {
    const p = 0.01 + index * 0.01;
    const x = 12 + p * 82;
    const y = 88 - (-Math.log(p) / maxCurveLoss) * 72;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
  const logCurvePath = Array.from({ length: 100 }, (_, index) => {
    const p = 0.01 + index * 0.01;
    const x = 12 + p * 82;
    const y = 16 + (-Math.log(p) / maxCurveLoss) * 72;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');

  return (
    <section className="grid gap-5">
      <div className="grid gap-1">
        <h2 className={cx('text-lg font-black leading-7', themeClasses.accentText)}>{text(content.title, language)}</h2>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      </div>

      <div className={cx('flex flex-wrap items-baseline justify-center gap-x-2 rounded-xl px-5 py-4 text-xl font-semibold', themeClasses.isLight ? 'bg-[#F8FAFC]' : 'bg-[#121A24]/36', themeClasses.titleText)}>
        <span className={cx('text-xs font-black uppercase tracking-wide', themeClasses.mutedText)}>Câu training:</span>
        {content.sentence.map((token, index) => <span key={`${token}-${index}`} className={index === content.targetIndex ? themeClasses.isLight ? 'font-black text-[#5BAA12]' : 'font-black text-[#A8DB78]' : index > content.targetIndex ? 'opacity-35' : ''}>{token}</span>)}
      </div>

      <div className={cx('grid gap-5 rounded-xl p-5', themeClasses.isLight ? 'bg-[#F8FAFC]' : 'bg-[#121A24]/36')}>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-4 text-sm font-black">
            <span className={themeClasses.titleText}>{probabilityLabel}</span>
            <span className={themeClasses.isLight ? 'text-[#5BAA12]' : 'text-[#A8DB78]'}>{probability.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.99"
            step="0.01"
            value={probability}
            onChange={(event) => setProbability(Number(event.target.value))}
            className="w-full accent-[#5BAA12]"
            aria-label={probabilityLabel}
          />
          <div className={cx('flex justify-between text-xs font-semibold', themeClasses.mutedText)}><span>0.01</span><span>0.50</span><span>0.99</span></div>
        </div>

        <div className={cx('overflow-x-auto text-center text-xl font-semibold', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { displayMode: true, throwOnError: false }) }} />

        <div className="grid items-center gap-6 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)]">
          <div className="grid gap-2">
            <div className={cx('text-sm font-black', themeClasses.titleText)}>Phân phối xác suất · Σp = 1</div>
            {distribution.map((item) => (
              <div key={item.token} className="grid grid-cols-[4rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-sm">
                <span className={cx('font-black', item.isTarget ? themeClasses.isLight ? 'text-[#5BAA12]' : 'text-[#A8DB78]' : themeClasses.titleText)}>{item.token}</span>
                <span className={cx('h-3 overflow-hidden rounded-sm', themeClasses.isLight ? 'bg-[#E4E9EF]' : 'bg-[#263B5B]')}><span className={cx('block h-full transition-[width] duration-200', item.isTarget ? 'bg-[#75B936]' : 'bg-[#A8B0B8]')} style={{ width: `${item.probability * 100}%` }} /></span>
                <span className={cx('text-right tabular-nums', themeClasses.mutedText)}>{item.probability.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <ProbabilityCurveChart ariaLabel="Đồ thị logarit tự nhiên theo xác suất của token đúng" curvePath={logCurvePath} maxValue={maxCurveLoss} mode="log" probability={probability} themeClasses={themeClasses} title="Đường cong ln(p)" value={loss} />
            <ProbabilityCurveChart ariaLabel="Đồ thị loss âm logarit theo xác suất của token đúng" curvePath={curvePath} maxValue={maxCurveLoss} mode="loss" probability={probability} themeClasses={themeClasses} title="Đường cong −ln(p)" value={loss} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {examples.map((exampleProbability) => {
            const exampleLoss = -Math.log(exampleProbability);
            return (
              <button key={exampleProbability} type="button" onClick={() => setProbability(exampleProbability)} className={cx('grid gap-2 rounded-lg px-4 py-3 text-left transition-colors', probability === exampleProbability ? themeClasses.isLight ? 'bg-[#DDF6C5]' : 'bg-[#537736]/60' : themeClasses.isLight ? 'bg-[#EEF2F6]' : 'bg-[#263B5B]/65')}>
                <span className={cx('text-sm font-black', themeClasses.titleText)}>p = {exampleProbability.toFixed(1)}</span>
                <span className={cx('text-lg font-black tabular-nums', exampleProbability >= 0.9 ? themeClasses.isLight ? 'text-[#5BAA12]' : 'text-[#A8DB78]' : themeClasses.titleText)}>Loss = {exampleLoss.toFixed(3)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.conclusion, language)}</p>
    </section>
  );
}

function renderInlineMath(value: string) {
  return value.split(/(\\\(.+?\\\))/g).filter(Boolean).map((part, index) => {
    const match = part.match(/^\\\((.+)\\\)$/);
    if (!match) return <Fragment key={part + index}>{part}</Fragment>;
    return <span key={part + index} className="inline-block px-0.5" dangerouslySetInnerHTML={{ __html: katex.renderToString(match[1], { throwOnError: false }) }} />;
  });
}

export function LlmLossDerivation({ content, language, themeClasses }: LlmContentRendererProps<LlmLossDerivationContent>) {
  const [showNegativeSign, setShowNegativeSign] = useState(true);
  const [demoProbability, setDemoProbability] = useState(0.5);
  const [productProbability, setProductProbability] = useState(0.25);
  const demoMagnitude = -Math.log(demoProbability);

  return (
    <section className="grid gap-5">
      {content.title || content.lead ? (
        <div className="grid gap-1">
          {content.title ? <h2 className={cx('text-lg font-black leading-7', themeClasses.accentText)}>{text(content.title, language)}</h2> : null}
          {content.lead ? <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.lead, language)}</p> : null}
        </div>
      ) : null}

      <div className="grid gap-3">
        {content.steps.map((step, index) => {
          const hasSignToggle = Boolean(step.formulaBeforeSign && step.formulaAfterSign && step.toggleLabel);
          return (
          <Fragment key={step.formula}>
            {step.transitionBefore ? (
              <p className={cx('border-t pt-5 text-sm font-semibold leading-6', themeClasses.bodyText, themeClasses.isLight ? 'border-[#DCE8F4]' : 'border-[#263B5B]')}>
                {renderInlineMath(text(step.transitionBefore, language))}
              </p>
            ) : null}
            <div className={cx('grid gap-3 rounded-xl px-5 py-4', themeClasses.isLight ? 'bg-[#F8FAFC]' : 'bg-[#121A24]/36')}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{index + 1}</span>
                  <span className={cx('text-sm font-black', themeClasses.titleText)}>{text(step.label, language)}</span>
                </div>
                {hasSignToggle ? (
                  <button type="button" role="switch" aria-checked={showNegativeSign} onClick={() => setShowNegativeSign((current) => !current)} className={cx('flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-black', themeClasses.focusRing, themeClasses.isLight ? 'text-[#205089]' : 'text-[#DCE8F4]')}>
                    <span>{text(step.toggleLabel!, language)}</span>
                    <span className={cx('relative h-5 w-9 overflow-hidden rounded-full transition-colors', showNegativeSign ? 'bg-[#2F78B7]' : themeClasses.isLight ? 'bg-[#CBD5E1]' : 'bg-[#3A4B5F]')}>
                      <span className={cx('absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform', showNegativeSign ? 'translate-x-4' : 'translate-x-0')} />
                    </span>
                  </button>
                ) : null}
              </div>
              {hasSignToggle ? (
                <div className={cx('flex items-center justify-center overflow-x-auto py-1 text-lg font-semibold sm:text-xl', themeClasses.titleText)}>
                  <span dangerouslySetInnerHTML={{ __html: katex.renderToString(step.formulaBeforeSign!, { throwOnError: false }) }} />
                  <span className={cx('inline-block px-1 transition-opacity', showNegativeSign ? 'opacity-100' : 'opacity-20')} dangerouslySetInnerHTML={{ __html: katex.renderToString('-', { throwOnError: false }) }} />
                  <span dangerouslySetInnerHTML={{ __html: katex.renderToString(step.formulaAfterSign!, { throwOnError: false }) }} />
                </div>
              ) : <div className={cx('overflow-x-auto py-1 text-center text-lg font-semibold sm:text-xl', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(step.formula, { displayMode: true, throwOnError: false }) }} />}
              {step.lengthNormalizationExample ? (
                <div className="grid gap-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {step.lengthNormalizationExample.rows.map((row) => (
                      <div key={row.productFormula} className={cx('grid gap-2 rounded-lg px-3 py-3', themeClasses.isLight ? 'bg-white' : 'bg-[#263B5B]/45')}>
                        <span className={cx('text-sm font-black', themeClasses.accentText)}>{text(row.label, language)}</span>
                        <span className={cx('overflow-x-auto text-center text-base font-semibold', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(row.productFormula, { throwOnError: false }) }} />
                      </div>
                    ))}
                  </div>
                  <p className={cx('text-center text-sm leading-6', themeClasses.bodyText)}>{text(step.lengthNormalizationExample.limitation, language)}</p>
                  <ArrowDown className={cx('mx-auto h-5 w-5', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
                  <div className={cx('overflow-x-auto py-1 text-center text-lg font-semibold', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(step.lengthNormalizationExample.normalizationFormula, { displayMode: true, throwOnError: false }) }} />
                  <div className="grid gap-2 sm:grid-cols-2">
                    {step.lengthNormalizationExample.rows.map((row) => (
                      <div key={row.normalizedFormula} className={cx('grid gap-2 rounded-lg px-3 py-3', themeClasses.isLight ? 'bg-white' : 'bg-[#263B5B]/45')}>
                        <span className={cx('text-sm font-black', themeClasses.accentText)}>{text(row.label, language)}</span>
                        <span className={cx('overflow-x-auto text-center text-base font-semibold', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(row.normalizedFormula, { throwOnError: false }) }} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {step.exponentComparison ? (
                <div className="grid items-center gap-4 lg:grid-cols-[minmax(14rem,0.65fr)_minmax(0,1.35fr)]">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between gap-3 text-sm font-black">
                      <span className={themeClasses.titleText}>Tích xác suất</span>
                      <span className={cx('flex items-baseline gap-1', themeClasses.isLight ? 'text-[#5BAA12]' : 'text-[#A8DB78]')}><span dangerouslySetInnerHTML={{ __html: katex.renderToString('\\prod_i p_i=', { throwOnError: false }) }} />{productProbability.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0.05" max="1" step="0.01" value={productProbability} onChange={(event) => setProductProbability(Number(event.target.value))} className="w-full accent-[#5BAA12]" aria-label="Tích xác suất dùng để so sánh số mũ một trên L và âm một trên L" />
                    <div className={cx('flex justify-between text-xs font-semibold', themeClasses.mutedText)}><span>0.05</span><span>0.50</span><span>1.00</span></div>
                    <div className="grid gap-1 text-sm font-black tabular-nums">
                      <span className={cx('flex items-baseline gap-1', themeClasses.titleText)}><span dangerouslySetInnerHTML={{ __html: katex.renderToString('(\\prod_i p_i)^{1/L}=', { throwOnError: false }) }} />{Math.pow(productProbability, 1 / step.exponentComparison.length).toFixed(3)}</span>
                      <span className={cx('flex items-baseline gap-1', themeClasses.accentText)}><span dangerouslySetInnerHTML={{ __html: katex.renderToString('(\\prod_i p_i)^{-1/L}=', { throwOnError: false }) }} />{Math.pow(productProbability, -1 / step.exponentComparison.length).toFixed(3)}</span>
                    </div>
                  </div>
                  <ExponentComparisonChart length={step.exponentComparison.length} product={productProbability} themeClasses={themeClasses} />
                </div>
              ) : null}
              {hasSignToggle ? (
                <div className="grid items-center gap-4 lg:grid-cols-[minmax(14rem,0.65fr)_minmax(0,1.35fr)]">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between gap-3 text-sm font-black">
                      <span className={themeClasses.titleText}>Xác suất token đúng</span>
                      <span className={themeClasses.isLight ? 'text-[#5BAA12]' : 'text-[#A8DB78]'}>p = {demoProbability.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0.01" max="0.99" step="0.01" value={demoProbability} onChange={(event) => setDemoProbability(Number(event.target.value))} className="w-full accent-[#5BAA12]" aria-label="Xác suất token đúng trong đồ thị loss" />
                    <div className={cx('flex justify-between text-xs font-semibold', themeClasses.mutedText)}><span>0.01</span><span>0.50</span><span>0.99</span></div>
                    <div className={cx('text-center text-base font-black tabular-nums', showNegativeSign ? themeClasses.accentText : themeClasses.titleText)}>
                      <span className={cx('transition-opacity', showNegativeSign ? 'opacity-100' : 'opacity-20')}>−</span>ln({demoProbability.toFixed(2)}) = {(showNegativeSign ? demoMagnitude : -demoMagnitude).toFixed(3)}
                    </div>
                  </div>
                  <ProbabilitySignComparisonChart activeMode={showNegativeSign ? 'loss' : 'log'} probability={demoProbability} themeClasses={themeClasses} />
                </div>
              ) : null}
              {step.explanation ? <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{renderInlineMath(text(step.explanation, language))}</p> : null}
            </div>
            {step.formulaCheckpointAfter ? (
              <div className={cx('overflow-x-auto rounded-xl border px-5 py-4 text-lg font-semibold sm:text-xl', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF4FA] text-[#123B68]' : 'border-[#A8B8C8]/18 bg-[#A8B8C8]/8 text-[#E5EEF8]')}>
                <div className="mx-auto flex w-max min-w-full items-center justify-center">
                  <span className="shrink-0 opacity-25" dangerouslySetInnerHTML={{ __html: katex.renderToString(step.formulaCheckpointAfter.before, { throwOnError: false }) }} />
                  <span className={cx('mx-1 shrink-0 rounded-md px-2 py-1', themeClasses.isLight ? 'bg-[#DCEEFF] text-[#205F99]' : 'bg-[#263B5B] text-[#DCE8F4]')} dangerouslySetInnerHTML={{ __html: katex.renderToString(step.formulaCheckpointAfter.focus, { throwOnError: false }) }} />
                  <span className="shrink-0 opacity-25" dangerouslySetInnerHTML={{ __html: katex.renderToString(step.formulaCheckpointAfter.after, { throwOnError: false }) }} />
                </div>
              </div>
            ) : null}
            {index < content.steps.length - 1 ? <ArrowDown className={cx('mx-auto h-5 w-5', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" /> : null}
          </Fragment>
          );
        })}
      </div>

      {content.conclusion ? <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.conclusion, language)}</p> : null}
    </section>
  );
}

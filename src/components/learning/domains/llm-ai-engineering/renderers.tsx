import { Angry, ArrowDown, ArrowRight, Braces, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, CircleDot, CornerDownLeft, Cpu, Database, Info, Monitor, MousePointer2, Pause, Play, RotateCcw, Scissors, SlidersHorizontal, Sparkles, Square, Type, type LucideIcon, Wrench, X } from 'lucide-react';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { LearningLessonExtra, LearningTokenExample } from '../../authoredTypes';
import type { LearningLocalizedText } from '../../../../core/learning/types';
import { getStrings, type Language } from '../../../../lib/localization';
import { cx, getLearningLabTheme } from '../../theme';
import { ExtraFrame } from '../../learningMdxComponents';
import { getLearningLocalizedText as text } from '../../learningText';
import { scrollLearningLabElementIntoView } from '../../lesson/scrolling';

const LLM_LEARNING_ASSETS: Record<string, string> = {
  'llm-from-scratch-roadmap.ai-hierarchy': new URL('../../../../assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/01-llm-from-scratch-roadmap-ai-hierarchy.png', import.meta.url).href,
  'llm-from-scratch-roadmap.next-token-loop': new URL('../../../../assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/01-llm-from-scratch-roadmap-next-token-loop.png', import.meta.url).href,
  'llm-from-scratch-roadmap.why-llms-popular-product': new URL('../../../../assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/01-llm-from-scratch-roadmap-why-llms-popular-product.png', import.meta.url).href,
  'llm-from-scratch-roadmap.why-llms-popular-technical': new URL('../../../../assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/01-llm-from-scratch-roadmap-why-llms-popular-technical.png', import.meta.url).href,
};

function getLlmLearningAssetUrl(assetId: string): string {
  return LLM_LEARNING_ASSETS[assetId] ?? '';
}

type LlmTrainingComponentsContent = {
  title: LearningLocalizedText;
  body: LearningLocalizedText;
  cards: Array<{ title: LearningLocalizedText; description: LearningLocalizedText }>;
};

type LlmAcademiaIndustryComparisonContent = Omit<LlmTrainingComponentsContent, 'title' | 'body'> & {
  academia: LearningLocalizedText;
  industry: LearningLocalizedText;
};

type LlmProbabilityDefinitionContent = {
  title: LearningLocalizedText;
  definition: LearningLocalizedText;
  formula: string;
  examples: Array<{ formula: string; explanation: LearningLocalizedText }>;
};

type LlmAutoregressiveDefinitionContent = {
  title: LearningLocalizedText;
  leadSubject: LearningLocalizedText;
  leadMiddle: LearningLocalizedText;
  leadEmphasis: LearningLocalizedText;
  formula: string;
  exampleLead: LearningLocalizedText;
  exampleSteps: string[];
  resultLead: LearningLocalizedText;
  resultFormula: string;
  note: LearningLocalizedText;
};

type LlmArInferencePipelineContent = {
  title: LearningLocalizedText;
  body: LearningLocalizedText;
  steps: Array<{ label: LearningLocalizedText; description: LearningLocalizedText }>;
  inputText: string;
  tokens: string[];
  tokenIds: number[];
  modelLabel: LearningLocalizedText;
  candidates: Array<{ token: string; tokenId: number; probability: number }>;
  sampledToken: string;
  sampledTokenId: number;
  outputText: string;
};

type LlmVocabularyOutputVectorContent = {
  lead: LearningLocalizedText;
  corpusDefinition: LearningLocalizedText;
  corpusLabel: LearningLocalizedText;
  vocabularyLabel: LearningLocalizedText;
  vectorLabel: LearningLocalizedText;
  entries: Array<{ token: string; tokenId: number; probability: number }>;
  note: LearningLocalizedText;
};

type LlmOutputProjectionContent = {
  title: LearningLocalizedText;
  lead: LearningLocalizedText;
  leadFormula?: string;
  stages: Array<{ label: LearningLocalizedText; formula: string; description?: LearningLocalizedText }>;
  contextTokens: string[];
  probabilities: Array<{ token: string; probability: number }>;
};

type LlmOutputProjectionFocus = 'overview' | 'context-input' | 'context-vector' | 'linear' | 'logits' | 'distribution';

type LlmNextTokenLossContent = {
  title: LearningLocalizedText;
  lead: LearningLocalizedText;
  targetHint: LearningLocalizedText;
  predictionLabel: LearningLocalizedText;
  targetLabel: LearningLocalizedText;
  optimizationLabel: LearningLocalizedText;
  increaseLabel: LearningLocalizedText;
  decreaseLabel: LearningLocalizedText;
  sequence: string[];
  vocabulary: string[];
  distributions: number[][];
  updatedDistributions: number[][];
  formula: string;
  note: LearningLocalizedText;
};

type LlmLossHandCalculationContent = {
  title: LearningLocalizedText;
  lead: LearningLocalizedText;
  conclusion: LearningLocalizedText;
  targetToken: string;
  sentence: string[];
  targetIndex: number;
  otherTokens: Array<{ token: string; weight: number }>;
};

type LlmLossDerivationContent = {
  title: LearningLocalizedText;
  lead?: LearningLocalizedText;
  steps: Array<{ label: LearningLocalizedText; formula: string; explanation: LearningLocalizedText }>;
  conclusion?: LearningLocalizedText;
};

export function LlmTrainingComponents({ content, language, themeClasses }: {
  content: LlmTrainingComponentsContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const icons: LucideIcon[] = [Braces, SlidersHorizontal, Database, CheckCircle2, Cpu];
  const palettes = [
    ['bg-[#AABBD8]', 'bg-[#EFF4FF] text-[#3C5680]'],
    ['bg-[#B9CBE8]', 'bg-[#EEF5FF] text-[#315D91]'],
    ['bg-[#A7C8CF]', 'bg-[#ECFBFD] text-[#32636C]'],
    ['bg-[#B7D8C2]', 'bg-[#EDFFF3] text-[#3E7050]'],
    ['bg-[#C3B8DF]', 'bg-[#F5F0FF] text-[#62518C]'],
  ] as const;

  return (
    <section className="grid gap-4">
      <div className="grid gap-1">
        <h2 className={cx('text-lg font-black leading-7', themeClasses.accentText)}>{text(content.title, language)}</h2>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.body, language)}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {content.cards.map((card, index) => {
          const Icon = icons[index] ?? Cpu;
          const [top, icon] = palettes[index] ?? palettes[0];
          return (
            <article key={text(card.title, language)} className={cx('learning-lab-focus-panel grid min-h-[25.625rem] grid-rows-[150px_minmax(0,1fr)] overflow-hidden rounded-lg border bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.54)]', themeClasses.isLight ? 'border-[#205089]/12' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
              <div className={cx('grid place-items-center border-b border-black/5', themeClasses.isLight ? top : 'bg-[#263B5B]')}>
                <div className={cx('grid h-16 w-16 place-items-center rounded-2xl border border-black/5 shadow-[0_12px_24px_rgba(30,42,56,0.12)]', themeClasses.isLight ? icon : 'bg-[#172A43] text-[#BFD3F2]')}>
                  <Icon className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
                </div>
              </div>
              <div className="grid content-start gap-3 p-4">
                <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{text(card.title, language)}</h3>
                <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(card.description, language)}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function LlmAcademiaIndustryComparison({ content, perspective, language, themeClasses }: {
  content: LlmAcademiaIndustryComparisonContent;
  perspective: 'academia' | 'industry';
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const icons: LucideIcon[] = [Braces, SlidersHorizontal, Database, CheckCircle2, Cpu];
  const palettes = [
    ['bg-[#AABBD8]', 'bg-[#EFF4FF] text-[#3C5680]'],
    ['bg-[#B9CBE8]', 'bg-[#EEF5FF] text-[#315D91]'],
    ['bg-[#A7C8CF]', 'bg-[#ECFBFD] text-[#32636C]'],
    ['bg-[#B7D8C2]', 'bg-[#EDFFF3] text-[#3E7050]'],
    ['bg-[#C3B8DF]', 'bg-[#F5F0FF] text-[#62518C]'],
  ] as const;

  return (
    <section className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-5">
        {([
          ['academia', 'Academia', content.academia],
          ['industry', 'Industry', content.industry],
        ] as const).filter(([panelPerspective]) => perspective === 'industry' || panelPerspective === 'academia').map(([panelPerspective, label, statement]) => {
          const isEmphasized = perspective === panelPerspective;
          return (
            <div key={panelPerspective} className={cx('rounded-lg border px-4 py-3 transition-[filter,opacity] duration-200', panelPerspective === 'academia' ? 'md:col-span-2' : 'md:col-span-3', isEmphasized ? 'opacity-100 saturate-100' : 'opacity-45 saturate-[0.72]', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF4FA]' : 'border-[#A8B8C8]/18 bg-[#A8B8C8]/8')}>
              <h2 className={cx('text-base font-black leading-6', isEmphasized ? themeClasses.accentText : themeClasses.titleText)}>{label}</h2>
              <p className={cx('mt-1 text-sm leading-6', themeClasses.bodyText)}>{text(statement, language)}</p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {content.cards.map((card, index) => {
          const Icon = icons[index] ?? Cpu;
          const [top, icon] = palettes[index] ?? palettes[0];
          const isEmphasized = perspective === 'academia' ? index < 2 : index >= 2;
          return (
            <article key={text(card.title, language)} className={cx('grid min-h-[25.625rem] grid-rows-[150px_minmax(0,1fr)] overflow-hidden rounded-lg border transition-[filter,opacity] duration-200', isEmphasized ? 'opacity-100 saturate-100' : 'opacity-45 saturate-[0.72]', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36')}>
              <div className={cx('grid place-items-center border-b border-black/5', themeClasses.isLight ? top : 'bg-[#263B5B]')}>
                <div className={cx('grid h-16 w-16 place-items-center rounded-2xl border border-black/5 shadow-[0_12px_24px_rgba(30,42,56,0.12)]', themeClasses.isLight ? icon : 'bg-[#172A43] text-[#BFD3F2]')}>
                  <Icon className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
                </div>
              </div>
              <div className="grid content-start gap-3 p-4">
                <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{text(card.title, language)}</h3>
                <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(card.description, language)}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function LlmProbabilityDefinition({ content, language, themeClasses }: {
  content: LlmProbabilityDefinitionContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
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

export function LlmAutoregressiveDefinition({ content, language, themeClasses }: {
  content: LlmAutoregressiveDefinitionContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
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
  const activeStep = Math.min(Math.max(step, 0), content.steps.length - 1);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const tokenizerRef = useRef<HTMLDivElement | null>(null);
  const tokenIdsRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const distributionRef = useRef<HTMLDivElement | null>(null);
  const [connectorPaths, setConnectorPaths] = useState<string[]>([]);
  const stageTone = (stage: number) => cx(
    'transition-[filter,opacity] duration-200',
    activeStep === stage ? 'opacity-100' : activeStep > stage ? 'opacity-70' : 'opacity-20 saturate-[0.55]',
  );
  const connectorTone = (stage: number) => activeStep >= stage ? 'opacity-100' : 'opacity-15';

  useEffect(() => {
    const canvas = canvasRef.current;
    const elements = [tokenizerRef.current, tokenIdsRef.current, modelRef.current, distributionRef.current];
    if (!canvas || elements.some((element) => !element)) return;

    const [tokenizer, tokenIds, model, distribution] = elements as HTMLDivElement[];
    const updateConnectors = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const anchor = (element: HTMLDivElement, side: 'left' | 'right') => {
        const rect = element.getBoundingClientRect();
        return {
          x: (side === 'left' ? rect.left : rect.right) - canvasRect.left,
          y: rect.top + rect.height / 2 - canvasRect.top,
        };
      };
      const tokenizerOut = anchor(tokenizer, 'right');
      const tokenIdsIn = anchor(tokenIds, 'left');
      const tokenIdsOut = anchor(tokenIds, 'right');
      const modelIn = anchor(model, 'left');
      const modelOut = anchor(model, 'right');
      const distributionIn = anchor(distribution, 'left');
      const elbowX = tokenIdsOut.x + Math.max(28, (modelIn.x - tokenIdsOut.x) * 0.42);

      setConnectorPaths([
        `M ${tokenizerOut.x} ${tokenizerOut.y} H ${tokenIdsIn.x}`,
        `M ${tokenIdsOut.x} ${tokenIdsOut.y} H ${elbowX} V ${modelIn.y} H ${modelIn.x}`,
        `M ${modelOut.x} ${modelOut.y} H ${distributionIn.x}`,
      ]);
    };

    const frameId = window.requestAnimationFrame(updateConnectors);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateConnectors);
    [canvas, ...elements].forEach((element) => element && observer?.observe(element));
    window.addEventListener('resize', updateConnectors);
    return () => {
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      window.removeEventListener('resize', updateConnectors);
    };
  }, []);

  return (
    <section className="grid gap-5">
      <div className="grid gap-1">
        <h2 className={cx('text-lg font-black leading-7', themeClasses.accentText)}>Bước {activeStep + 1}: {text(content.steps[activeStep].label, language)}</h2>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.steps[activeStep].description, language)}</p>
      </div>

      <div className="overflow-x-auto pb-2" aria-live="polite">
        <div ref={canvasRef} className="relative h-[30rem] w-full min-w-[64rem] overflow-hidden rounded-xl bg-gradient-to-br from-transparent to-[#205089]/[0.025]">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <marker id="ar-pipeline-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={themeClasses.isLight ? '#205089' : '#A8B8C8'} />
              </marker>
            </defs>
            {connectorPaths.map((path, index) => (
              <path
                key={path}
                d={path}
                fill="none"
                stroke={themeClasses.isLight ? '#205089' : '#A8B8C8'}
                strokeWidth="2"
                markerEnd="url(#ar-pipeline-arrow)"
                className={cx('transition-opacity duration-200', connectorTone(index))}
              />
            ))}
          </svg>

          <div className={cx('absolute bottom-5 left-7 grid w-[13.5rem] justify-items-center gap-2', stageTone(0))}>
            <ArrowDown className={cx('h-4 w-4 rotate-180', themeClasses.mutedText)} strokeWidth={1.6} aria-hidden="true" />
            <p className={cx('rounded-lg px-4 py-2 text-center text-base font-black', themeClasses.isLight ? 'bg-[#F3F6F9] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')}>{content.inputText}</p>
            <div className={cx('text-xs font-semibold', themeClasses.mutedText)}>Câu đầu vào</div>
          </div>

          <div className={cx('absolute left-5 top-[15.15rem] w-[13.5rem]', stageTone(0))}>
            <div ref={tokenizerRef} className={cx('rounded-xl px-4 py-6 text-center text-lg font-black', themeClasses.isLight ? 'bg-[#EBD9E8] text-[#56314F]' : 'bg-[#6C4B66]/55 text-[#F7DDF1]')}>Tokenizer</div>
          </div>

          <div className={cx('absolute left-[18rem] top-[11.25rem] grid w-16 justify-items-center gap-2', stageTone(0))}>
            <div className={cx('text-center text-[0.65rem] font-black uppercase tracking-wide', themeClasses.mutedText)}>Token IDs</div>
            <div ref={tokenIdsRef} className={cx('grid h-32 w-10 content-evenly justify-items-center rounded-lg', themeClasses.isLight ? 'bg-[#F4E5EF]' : 'bg-[#6C4B66]/55')}>
              {content.tokenIds.map((tokenId) => (
                <span key={tokenId} className={cx('grid h-6 w-6 place-items-center rounded-full text-xs font-black tabular-nums', themeClasses.isLight ? 'bg-[#F6CFE4] text-[#713255] ring-1 ring-[#8D436F]' : 'bg-[#D58AB5] text-[#2E1728] ring-1 ring-[#F4C8E1]/60')}>{tokenId}</span>
              ))}
            </div>
          </div>

          <div ref={modelRef} className={cx('absolute left-[42%] top-[4.5rem] grid h-48 w-32 place-items-center rounded-xl px-4 py-5 text-center', stageTone(1), themeClasses.isLight ? 'bg-[#DDF2C7] text-[#29471E]' : 'bg-[#52723C]/55 text-[#E1F5D1]')}>
            <div>
              <div className="text-base font-black">{text(content.modelLabel, language)}</div>
              <div className="mt-2 text-xs font-semibold leading-5">Forward</div>
            </div>
          </div>

          <div ref={distributionRef} className={cx('absolute right-4 top-[4rem] grid w-[clamp(17rem,25%,24rem)] gap-3', stageTone(2))}>
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

          <div className={cx('absolute right-[15rem] top-[20.5rem] grid justify-items-center gap-1', stageTone(3))}>
            <div className={cx('text-[0.65rem] font-black uppercase tracking-wide', themeClasses.mutedText)}>Sample</div>
            <span className={cx('rounded-lg px-4 py-2 text-base font-black', themeClasses.isLight ? 'bg-[#F4D8A4] text-[#674518]' : 'bg-[#8B6734]/45 text-[#FFE5B4]')}>{content.sampledToken}</span>
            <span className={cx('min-w-8 rounded px-2 py-1 text-center text-xs font-black tabular-nums', themeClasses.isLight ? 'bg-[#D8D2C2] text-[#514B3F]' : 'bg-[#575247] text-[#F1EBDD]')}>{content.sampledTokenId}</span>
          </div>

          <ArrowRight className={cx('absolute right-[12.5rem] top-[22.25rem] h-5 w-5', stageTone(4), themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />

          <div className={cx('absolute right-4 top-[20.5rem] grid w-44 justify-items-center gap-2 text-center', stageTone(4))}>
            <div className={cx('text-[0.65rem] font-black uppercase tracking-wide', themeClasses.mutedText)}>Detokenize</div>
            <p className={cx('rounded-lg px-4 py-3 text-base font-black leading-6', themeClasses.isLight ? 'bg-[#E7EFF8] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')}>{content.outputText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LlmVocabularyOutputVector({ content, language, themeClasses }: {
  content: LlmVocabularyOutputVectorContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
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
      const anchor = (element: HTMLDivElement, side: 'left' | 'right') => {
        const rect = element.getBoundingClientRect();
        return {
          x: (side === 'left' ? rect.left : rect.right) - canvasRect.left,
          y: rect.top + rect.height / 2 - canvasRect.top,
        };
      };
      const networkOut = anchor(neuralNetwork, 'right');
      const contextIn = anchor(contextVector, 'left');
      const contextOut = anchor(contextVector, 'right');
      const linearIn = anchor(linearLayer, 'left');
      const linearOut = anchor(linearLayer, 'right');
      const logitsIn = anchor(logits, 'left');
      const logitsOut = anchor(logits, 'right');
      const distributionIn = anchor(distribution, 'left');
      const elbowX = contextOut.x + Math.max(28, (linearIn.x - contextOut.x) * 0.42);

      setConnectorPaths([
        `M ${networkOut.x} ${networkOut.y} H ${contextIn.x}`,
        `M ${contextOut.x} ${contextOut.y} H ${elbowX} V ${linearIn.y} H ${linearIn.x}`,
        `M ${linearOut.x} ${linearOut.y} H ${logitsIn.x}`,
        `M ${logitsOut.x} ${logitsOut.y} H ${distributionIn.x}`,
      ]);
      setSoftmaxPosition({
        x: logitsOut.x + (distributionIn.x - logitsOut.x) / 2,
        y: logitsOut.y - 28,
      });
    };

    const frameId = window.requestAnimationFrame(updateConnectors);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateConnectors);
    [canvas, ...elements].forEach((element) => element && observer?.observe(element));
    window.addEventListener('resize', updateConnectors);
    return () => {
      window.cancelAnimationFrame(frameId);
      observer?.disconnect();
      window.removeEventListener('resize', updateConnectors);
    };
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
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <marker id="projection-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={themeClasses.isLight ? '#205089' : '#A8B8C8'} />
              </marker>
            </defs>
            {connectorPaths.map((path, index) => <path key={index} d={path} fill="none" stroke={themeClasses.isLight ? '#205089' : '#A8B8C8'} strokeWidth="2" markerEnd="url(#projection-arrow)" className={cx('transition-opacity duration-200', isFocused(connectorFocuses[index]) ? 'opacity-100' : 'opacity-15')} />)}
          </svg>

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
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => { setIsPlaying(false); setAnimationStep((current) => Math.max(0, current - 1)); }} disabled={animationStep === 0} className={cx('grid h-9 w-9 place-items-center rounded-lg disabled:opacity-30', themeClasses.isLight ? 'bg-[#EEF2F6] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')} aria-label={language === 'vi' ? 'Bước trước' : 'Previous step'}><ChevronLeft className="h-4 w-4" aria-hidden="true" /></button>
            <button type="button" onClick={() => setIsPlaying((playing) => !playing)} disabled={!isPlaying && animationStep === totalAnimationSteps - 1} className={cx('flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-black disabled:opacity-30', themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#A8B8C8] text-[#121A24]')}>
              {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
              {isPlaying ? (language === 'vi' ? 'Tạm dừng' : 'Pause') : (language === 'vi' ? 'Phát' : 'Play')}
            </button>
            <button type="button" onClick={() => { setIsPlaying(false); setAnimationStep((current) => Math.min(totalAnimationSteps - 1, current + 1)); }} disabled={animationStep === totalAnimationSteps - 1} className={cx('grid h-9 w-9 place-items-center rounded-lg disabled:opacity-30', themeClasses.isLight ? 'bg-[#EEF2F6] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')} aria-label={language === 'vi' ? 'Bước tiếp theo' : 'Next step'}><ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
            <button type="button" onClick={() => { setAnimationStep(0); setIsPlaying(true); }} className={cx('grid h-9 w-9 place-items-center rounded-lg', themeClasses.isLight ? 'bg-[#EEF2F6] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')} aria-label={language === 'vi' ? 'Phát lại' : 'Replay'}><RotateCcw className="h-4 w-4" aria-hidden="true" /></button>
          </div>
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

export function LlmLossHandCalculation({ content, language, themeClasses }: {
  content: LlmLossHandCalculationContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
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
  const pointX = 12 + probability * 82;
  const pointY = 88 - (loss / maxCurveLoss) * 72;
  const logPointY = 16 + (loss / maxCurveLoss) * 72;

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
            <figure className="grid gap-2">
              <div className={cx('text-sm font-black', themeClasses.titleText)}>Đường cong ln(p)</div>
              <svg viewBox="0 0 100 100" className="h-52 w-full" role="img" aria-label="Đồ thị logarit tự nhiên theo xác suất của token đúng">
                <path d="M 12 88 V 16 H 96" fill="none" stroke={themeClasses.isLight ? '#8A949E' : '#74859A'} strokeWidth="1" />
                {[0, 1, 2, 3, 4].map((tick) => {
                  const tickY = 16 + (tick / maxCurveLoss) * 72;
                  return <g key={tick}><line x1="10" y1={tickY} x2="12" y2={tickY} stroke={themeClasses.isLight ? '#8A949E' : '#74859A'} strokeWidth="0.8" /><text x="8" y={tickY + 1.7} textAnchor="end" fontSize="4.5" fill={themeClasses.isLight ? '#59636E' : '#A8B8C8'}>{tick === 0 ? '0' : `−${tick}`}</text></g>;
                })}
                <path d={logCurvePath} fill="none" stroke={themeClasses.isLight ? '#8D436F' : '#D58AB5'} strokeWidth="2" />
                <line x1={pointX} y1="16" x2={pointX} y2={logPointY} stroke={themeClasses.isLight ? '#5BAA12' : '#A8DB78'} strokeWidth="1" strokeDasharray="2 2" />
                <circle cx={pointX} cy={logPointY} r="2.6" fill={themeClasses.isLight ? '#5BAA12' : '#A8DB78'} />
                <text x="96" y="13" textAnchor="end" fontSize="5" fill={themeClasses.isLight ? '#59636E' : '#A8B8C8'}>p đúng → 1</text>
                <text x="5" y="12" textAnchor="middle" fontSize="5" fill={themeClasses.isLight ? '#59636E' : '#A8B8C8'} transform="rotate(-90 5 12)">ln(p)</text>
              </svg>
            </figure>

            <figure className="grid gap-2">
              <div className={cx('text-sm font-black', themeClasses.titleText)}>Đường cong −ln(p)</div>
              <svg viewBox="0 0 100 100" className="h-52 w-full" role="img" aria-label="Đồ thị loss âm logarit theo xác suất của token đúng">
                <path d="M 12 10 V 88 H 96" fill="none" stroke={themeClasses.isLight ? '#8A949E' : '#74859A'} strokeWidth="1" />
                {[0, 1, 2, 3, 4].map((tick) => {
                  const tickY = 88 - (tick / maxCurveLoss) * 72;
                  return <g key={tick}><line x1="10" y1={tickY} x2="12" y2={tickY} stroke={themeClasses.isLight ? '#8A949E' : '#74859A'} strokeWidth="0.8" /><text x="8" y={tickY + 1.7} textAnchor="end" fontSize="4.5" fill={themeClasses.isLight ? '#59636E' : '#A8B8C8'}>{tick}</text></g>;
                })}
                <path d={curvePath} fill="none" stroke={themeClasses.isLight ? '#205089' : '#A8B8C8'} strokeWidth="2" />
                <line x1={pointX} y1={pointY} x2={pointX} y2="88" stroke={themeClasses.isLight ? '#5BAA12' : '#A8DB78'} strokeWidth="1" strokeDasharray="2 2" />
                <circle cx={pointX} cy={pointY} r="2.6" fill={themeClasses.isLight ? '#5BAA12' : '#A8DB78'} />
                <text x="96" y="96" textAnchor="end" fontSize="5" fill={themeClasses.isLight ? '#59636E' : '#A8B8C8'}>p đúng → 1</text>
                <text x="5" y="12" textAnchor="middle" fontSize="5" fill={themeClasses.isLight ? '#59636E' : '#A8B8C8'} transform="rotate(-90 5 12)">loss</text>
              </svg>
            </figure>
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

export function LlmLossDerivation({ content, language, themeClasses }: {
  content: LlmLossDerivationContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <section className="grid gap-5">
      <div className="grid gap-1">
        <h2 className={cx('text-lg font-black leading-7', themeClasses.accentText)}>{text(content.title, language)}</h2>
        {content.lead ? <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.lead, language)}</p> : null}
      </div>

      <div className="grid gap-3">
        {content.steps.map((step, index) => (
          <Fragment key={step.formula}>
            <div className={cx('grid gap-3 rounded-xl px-5 py-4', themeClasses.isLight ? 'bg-[#F8FAFC]' : 'bg-[#121A24]/36')}>
              <div className="flex items-center gap-3">
                <span className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{index + 1}</span>
                <span className={cx('text-sm font-black', themeClasses.titleText)}>{text(step.label, language)}</span>
              </div>
              <div className={cx('overflow-x-auto py-1 text-center text-lg font-semibold sm:text-xl', themeClasses.titleText)} dangerouslySetInnerHTML={{ __html: katex.renderToString(step.formula, { displayMode: true, throwOnError: false }) }} />
              <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(step.explanation, language)}</p>
            </div>
            {index < content.steps.length - 1 ? <ArrowDown className={cx('mx-auto h-5 w-5', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" /> : null}
          </Fragment>
        ))}
      </div>

      {content.conclusion ? <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.conclusion, language)}</p> : null}
    </section>
  );
}

export function LlmAiHierarchy({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'motivation' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const intro = extra.body.map((paragraph) => text(paragraph, language));

  return (
    <div className="overflow-hidden">
      <div className="grid w-full gap-3">
        {intro.map((paragraph) => (
          <p key={paragraph} className={cx('text-sm leading-7', themeClasses.bodyText)}>
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-5 grid gap-6">
        <figure className="flex min-w-0 items-center justify-center">
          <img
            src={getLlmLearningAssetUrl(extra.image)}
            alt={text(extra.imageAlt, language)}
            className="aspect-[1672/941] w-full max-w-[42rem] object-contain"
            loading="lazy"
          />
        </figure>

        {extra.hierarchy && (
          <AiHierarchyFlow hierarchy={extra.hierarchy} language={language} themeClasses={themeClasses} />
        )}
      </div>
    </div>
  );
}

function AiHierarchyFlow({ hierarchy, language, themeClasses }: {
  hierarchy: NonNullable<Extract<LearningLessonExtra, { kind: 'motivation' }>['hierarchy']>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const leadingRows = hierarchy.rows.filter((row) => row.depth !== 'branch' && row.depth !== 'target');
  const branchRows = hierarchy.rows.filter((row) => row.depth === 'branch');
  const targetRows = hierarchy.rows.filter((row) => row.depth === 'target');
  const [activeRowName, setActiveRowName] = useState(hierarchy.rows[0]?.shortName ?? '');

  return (
    <div className="learning-lab-focus-group mt-5 grid w-full gap-3" aria-label={text(hierarchy.ariaLabel, language)}>
      {leadingRows.map((row) => (
        <HierarchyRow
          key={row.shortName}
          row={row}
          isActive={activeRowName === row.shortName}
          language={language}
          themeClasses={themeClasses}
          onActivate={setActiveRowName}
        />
      ))}

      {branchRows.length ? (
        <div className="grid gap-3 py-2">
          {hierarchy.branchLabel && (
            <div className={cx('text-sm font-semibold leading-6', themeClasses.mutedText)}>
              {text(hierarchy.branchLabel, language)}
            </div>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {branchRows.map((row) => (
              <HierarchyRow
                key={row.shortName}
                row={row}
                isActive={activeRowName === row.shortName}
                language={language}
                themeClasses={themeClasses}
                onActivate={setActiveRowName}
              />
            ))}
          </div>
        </div>
      ) : null}

      {targetRows.map((row) => (
        <HierarchyRow
          key={row.shortName}
          row={row}
          isActive={activeRowName === row.shortName}
          language={language}
          themeClasses={themeClasses}
          onActivate={setActiveRowName}
        />
      ))}
    </div>
  );
}

function HierarchyRow({ row, isActive, language, themeClasses, onActivate }: {
  row: NonNullable<Extract<LearningLessonExtra, { kind: 'motivation' }>['hierarchy']>['rows'][number];
  isActive: boolean;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onActivate: (shortName: string) => void;
}) {
  const isTarget = row.depth === 'target';
  const rowTone = isTarget
    ? themeClasses.isLight
      ? 'bg-[#205089]/8 shadow-[inset_3px_0_0_rgba(32,80,137,0.78)] hover:bg-[#205089]/12'
      : 'bg-[#A8B8C8]/10 shadow-[inset_3px_0_0_rgba(215,220,226,0.78)] hover:bg-[#A8B8C8]/14'
    : themeClasses.isLight
      ? 'bg-[#B8C8DA]/20 hover:bg-[#B8C8DA]/34'
      : 'bg-[#A8B8C8]/6 hover:bg-[#A8B8C8]/10';

  return (
    <div
      data-active={isActive ? 'true' : undefined}
      onFocus={() => onActivate(row.shortName)}
      onMouseEnter={() => onActivate(row.shortName)}
      className={cx(
        'learning-lab-focus-panel group grid gap-2 px-3 py-2 text-sm transition-[background-color,box-shadow,filter,opacity,transform] duration-200 sm:items-start',
        themeClasses.radius.button,
        rowTone,
        row.compact ? 'sm:grid-cols-[3.75rem_minmax(0,1fr)]' : 'sm:grid-cols-[4.5rem_minmax(0,1fr)]',
      )}
    >
      <div className={cx('font-black leading-6', isTarget ? themeClasses.accentText : themeClasses.titleText)}>
        {row.shortName}
      </div>
      <div className="min-w-0">
        <div className={cx('font-normal leading-6', themeClasses.titleText)}>{row.fullName}</div>
        <p className={cx('mt-0.5 leading-6', themeClasses.bodyText)}>{text(row.description, language)}</p>
      </div>
    </div>
  );
}


export function LlmConceptInteraction({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptInteraction' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedWordIndexes, setSelectedWordIndexes] = useState<number[]>([]);
  const [sentenceFeedbackPulseKey, setSentenceFeedbackPulseKey] = useState(0);
  const selectedOption = selectedIndex === null ? null : extra.options[selectedIndex];
  const labels = extra.labels;
  const noteText = extra.note ? text(extra.note, language) : '';
  const sentenceBuilder = extra.sentenceBuilder;
  const interactionPlacement = extra.interactionPlacement ?? 'inline';
  const selectedLabel = selectedOption ? text(selectedOption.label, language) : interactionPlacement === 'only' ? '_____' : text(extra.blankLabel, language);
  const isInteractionOnly = interactionPlacement === 'only';
  const shouldShowIntro = interactionPlacement !== 'only';
  const shouldShowInteractions = interactionPlacement !== 'none';
  const interactionOnlyPrompt = language === 'vi'
    ? 'Chọn từ để điền vào chỗ trống cho phù hợp.'
    : 'Choose words to fill the blank appropriately.';
  const neutralPlaceholderTone = themeClasses.isLight
    ? 'border-[#94A3B8]/28 bg-[#F8FAFC] text-[#64748B]'
    : 'border-[#A8B8C8]/18 bg-[#A8B8C8]/6 text-[#F2F6FA]/48';
  const selectedWords = sentenceBuilder ? selectedWordIndexes.map((index) => text(sentenceBuilder.choices[index], language)) : [];
  const targetSentences = sentenceBuilder ? sentenceBuilder.targets.map((target) => target.map((word) => text(word, language))) : [];
  const matchingTargets = targetSentences.filter((target) => selectedWords.every((word, index) => word === target[index]));
  const isSentenceComplete = matchingTargets.some((target) => selectedWords.length === target.length);
  const isSentenceOffTrack = sentenceBuilder ? selectedWords.length > 0 && matchingTargets.length === 0 : false;
  const firstViableTarget = matchingTargets[0] ?? targetSentences[0] ?? [];
  const optionFeedbackRef = useRef<HTMLDivElement | null>(null);
  const sentenceFeedbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedOption) return;
    optionFeedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [selectedOption]);

  useEffect(() => {
    if (!isSentenceComplete && !isSentenceOffTrack) return;
    setSentenceFeedbackPulseKey((value) => value + 1);
    const frameId = window.requestAnimationFrame(() => {
      scrollLearningLabElementIntoView(sentenceFeedbackRef.current);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [isSentenceComplete, isSentenceOffTrack]);

  return (
    <div className="py-1">
      {shouldShowIntro && (
        <div className={cx('mb-3 text-left text-lg font-black uppercase leading-7 tracking-wide md:text-xl', themeClasses.eyebrowText)}>
          {text(extra.title, language)}
        </div>
      )}

      {shouldShowIntro && (
        <ConceptIntroGrid extra={extra} noteText={noteText} language={language} themeClasses={themeClasses} />
      )}

      {isInteractionOnly && (
        <p className={cx('mb-3 text-left text-base font-black leading-7 md:text-lg', themeClasses.accentText)}>
          {interactionOnlyPrompt}
        </p>
      )}

      {shouldShowInteractions && (
        <div className={cx('mt-4 grid gap-3 rounded-lg border p-3 text-center', themeClasses.isLight ? 'border-[#205089]/14 bg-white' : 'border-[#A8B8C8]/16 bg-[#A8B8C8]/7')}>
          <div className="grid justify-items-center gap-2.5">
            {!isInteractionOnly && (
              <div className={cx('flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
                <Sparkles className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
                {text(labels.chooseNextToken, language)}
              </div>
            )}

            <div className={cx('flex flex-wrap items-center justify-center gap-2 text-base font-semibold leading-8 md:text-lg', themeClasses.titleText)}>
              <span>{text(extra.prompt, language)}</span>
              <span
                aria-label={!selectedOption ? text(extra.blankLabel, language) : undefined}
                className={cx(
                  'inline-flex min-h-10 min-w-[8rem] items-center justify-center rounded-lg border px-3 text-sm transition-colors',
                  isInteractionOnly && !selectedOption ? 'font-semibold' : 'font-black',
                  selectedOption?.isCorrect
                    ? themeClasses.isLight ? 'border-[#2FBF71]/42 bg-[#2FBF71]/14 text-[#1F6F48]' : 'border-[#2FBF71]/46 bg-[#2FBF71]/18 text-[#A6E8C1]'
                    : selectedOption
                      ? themeClasses.isLight ? 'border-[#C45151]/34 bg-[#C45151]/8 text-[#8C3333]' : 'border-[#F87171]/36 bg-[#F87171]/12 text-[#FCA5A5]'
                        : isInteractionOnly ? neutralPlaceholderTone : themeClasses.isLight ? 'border-[#205089]/24 bg-white/70 text-[#123B68]' : 'border-[#A8B8C8]/24 bg-[#121A24]/48 text-[#F2F6FA]',
                )}
              >
                {selectedLabel}
              </span>
            </div>

            {selectedOption && (
              <div ref={optionFeedbackRef} className={cx('flex w-full justify-center gap-2 text-center text-sm leading-6', selectedOption.isCorrect ? themeClasses.isLight ? 'text-[#1F6F48]' : 'text-[#A6E8C1]' : themeClasses.isLight ? 'text-[#8C3333]' : 'text-[#FCA5A5]')}>
                {selectedOption.isCorrect ? (
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Angry className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                )}
                <p>{text(selectedOption.feedback, language)}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-1.5" aria-label={text(extra.blankLabel, language)}>
            {extra.options.map((option, index) => {
              const isSelected = selectedIndex === index;
              const isCorrect = Boolean(option.isCorrect);
              return (
                <button
                  key={text(option.label, language)}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={cx(
                    'min-h-11 rounded-lg border px-4 py-2 text-left text-sm font-black shadow-sm transition-colors',
                    isSelected && isCorrect
                      ? themeClasses.isLight ? 'border-[#2FBF71]/50 bg-[#2FBF71]/16 text-[#1F6F48]' : 'border-[#2FBF71]/50 bg-[#2FBF71]/18 text-[#A6E8C1]'
                      : isSelected
                        ? themeClasses.isLight ? 'border-[#C45151]/38 bg-[#C45151]/10 text-[#8C3333]' : 'border-[#F87171]/40 bg-[#F87171]/14 text-[#FCA5A5]'
                          : themeClasses.isLight ? 'border-[#205089]/18 bg-white/78 text-[#123B68] hover:bg-[#DCE6F1]' : 'border-[#A8B8C8]/20 bg-[#121A24]/58 text-[#F2F6FA]/84 hover:bg-[#A8B8C8]/12',
                  )}
                >
                  {text(option.label, language)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {shouldShowInteractions && sentenceBuilder && (
        <div className={cx('mt-3 grid gap-3 rounded-lg border p-3 text-center', themeClasses.isLight ? 'border-[#205089]/14 bg-white' : 'border-[#A8B8C8]/16 bg-[#A8B8C8]/6')}>
          {!isInteractionOnly && (
            <div className={cx('flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
              <MousePointer2 className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
              {text(sentenceBuilder.title, language)}
            </div>
          )}

          <div className={cx('grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-8 md:text-lg', themeClasses.isLight ? 'bg-transparent text-[#030509]' : 'bg-[#121A24]/42 text-[#F2F6FA]')}>
            <div className="flex min-w-0 flex-wrap items-center justify-center gap-2">
              <span>{text(sentenceBuilder.prompt, language)}</span>
              {selectedWords.length ? (
                selectedWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className={cx(
                      'inline-flex min-h-9 items-center rounded-lg border px-3 text-sm font-black',
                      isSentenceOffTrack && index === selectedWords.findIndex((item, itemIndex) => item !== firstViableTarget[itemIndex])
                        ? themeClasses.isLight ? 'border-[#C45151]/36 bg-[#C45151]/10 text-[#8C3333]' : 'border-[#F87171]/40 bg-[#F87171]/14 text-[#FCA5A5]'
                        : themeClasses.isLight ? 'border-[#205089]/18 bg-[#DCE6F1] text-[#123B68]' : 'border-[#A8B8C8]/20 bg-[#A8B8C8]/10 text-[#F2F6FA]',
                    )}
                  >
                    {word}
                  </span>
                ))
              ) : (
                <span aria-label={text(labels.emptySentence, language)} className={cx('inline-flex min-h-9 min-w-[9rem] items-center justify-center rounded-lg border border-dashed px-3 text-sm font-semibold', isInteractionOnly ? neutralPlaceholderTone : themeClasses.isLight ? 'border-[#205089]/28 text-[#123B68]/70' : 'border-[#A8B8C8]/28 text-[#F2F6FA]/62')}>
                  {isInteractionOnly ? '_____' : text(labels.emptySentence, language)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedWordIndexes((current) => current.slice(0, -1))}
              disabled={!selectedWordIndexes.length}
              aria-label={text(labels.removeLastWord, language)}
              className={cx('inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30', themeClasses.isLight ? 'text-[#123B68] hover:bg-[#205089]/10' : 'text-[#F2F6FA]/76 hover:bg-[#A8B8C8]/14')}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            {sentenceBuilder.choices.map((choice, index) => {
              const isUsed = selectedWordIndexes.includes(index);
              return (
                <button
                  key={`${text(choice, language)}-${index}`}
                  type="button"
                  disabled={isUsed}
                  onClick={() => setSelectedWordIndexes((current) => [...current, index])}
                  className={cx(
                    'min-h-10 rounded-lg border px-3 py-2 text-sm font-black shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                    themeClasses.isLight ? 'border-[#205089]/18 bg-white/80 text-[#123B68] hover:bg-[#DCE6F1]' : 'border-[#A8B8C8]/20 bg-[#121A24]/58 text-[#F2F6FA]/84 hover:bg-[#A8B8C8]/12',
                  )}
                >
                  {text(choice, language)}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedWordIndexes([])}
              disabled={!selectedWordIndexes.length}
              className={cx('inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-40', themeClasses.isLight ? 'bg-[#205089]/10 text-[#123B68] hover:bg-[#205089]/14' : 'bg-[#A8B8C8]/10 text-[#F2F6FA]/76 hover:bg-[#A8B8C8]/14')}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {text(labels.reset, language)}
            </button>
          </div>

          {(isSentenceComplete || isSentenceOffTrack) && (
            <div
              key={sentenceFeedbackPulseKey}
              ref={sentenceFeedbackRef}
              className={cx(
                'learning-lab-answer-reveal flex w-full justify-center gap-2 rounded-lg border px-3 py-2.5 text-center text-sm font-semibold leading-6',
                isSentenceComplete
                  ? themeClasses.isLight ? 'border-[#1F6F48]/18 bg-[#E8F7EE] text-[#1F6F48]' : 'border-[#A6E8C1]/18 bg-[#A6E8C1]/10 text-[#A6E8C1]'
                  : themeClasses.isLight ? 'border-[#8C3333]/18 bg-[#FBECEC] text-[#8C3333]' : 'border-[#FCA5A5]/18 bg-[#FCA5A5]/10 text-[#FCA5A5]',
              )}
              role="status"
            >
              {isSentenceComplete ? (
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              ) : (
                <Angry className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              )}
              <p>{text(isSentenceComplete ? sentenceBuilder.success : sentenceBuilder.error, language)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ConceptIntroGrid({ extra, noteText, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptInteraction' }>;
  noteText: string;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const strings = getStrings(language).learningLab;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="grid min-h-[15rem] p-0">
        <figure className="flex min-h-full min-w-0 items-center justify-center overflow-hidden">
          <img
            src={getLlmLearningAssetUrl(extra.image)}
            alt={text(extra.imageAlt, language)}
            className={cx('aspect-[1672/941] w-full max-w-[34rem] object-contain', themeClasses.radius.card)}
            loading="lazy"
          />
        </figure>
      </section>

      <section className={getTheoryTileClass(themeClasses)}>
        <div className={cx('mb-3 text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
          {strings.coreIdea}
        </div>
        <div className="grid gap-3">
          {extra.body.map((paragraph) => (
            <p key={text(paragraph, language)} className={cx('text-sm leading-7', themeClasses.bodyText)}>
              {text(paragraph, language)}
            </p>
          ))}
        </div>
        {noteText && (
          <div className={cx('mt-4 flex gap-3 rounded-lg px-3 py-2.5 text-sm leading-6', themeClasses.sectionAccent.note)}>
            <Info className="mt-1 h-4 w-4 shrink-0" strokeWidth={2.1} aria-hidden="true" />
            <p>{noteText}</p>
          </div>
        )}
      </section>

    </div>
  );
}

export function TokenExampleBlock({ example, language, themeClasses, hideTitle = false }: {
  example: LearningTokenExample;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  hideTitle?: boolean;
}) {
  const [activeLabel, setActiveLabel] = useState(example.variants[0]?.label.en ?? example.specialCases[0]?.label.en ?? '');

  return (
    <section className={cx(getConceptTileClass(themeClasses), 'gap-4')}>
      {!hideTitle && (
        <div className={cx('text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
          {text(example.title, language)}
        </div>
      )}

      <div className="learning-lab-focus-group grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[...example.variants, ...example.specialCases].map((variant, variantIndex) => (
          <TokenExampleGroup
            key={text(variant.label, language)}
            item={variant}
            isActive={activeLabel === variant.label.en}
            toneIndex={variantIndex}
            language={language}
            themeClasses={themeClasses}
            onActivate={setActiveLabel}
          />
        ))}
      </div>

      <div className="mt-7 grid gap-2">
        {example.notes.map((note) => (
          <div key={text(note, language)} className={cx('mx-auto flex max-w-3xl gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold leading-6', themeClasses.sectionAccent.note)}>
            <CircleAlert className="mt-1 h-4 w-4 shrink-0 text-[#D97706]" strokeWidth={2.1} aria-hidden="true" />
            <p className="text-justify">{text(note, language)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TokenExampleGroup({ item, isActive, toneIndex, language, themeClasses, onActivate }: {
  item: {
    label: { en: string; vi: string };
    tokens: string[];
    description: { en: string; vi: string };
  };
  isActive: boolean;
  toneIndex: number;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onActivate: (label: string) => void;
}) {
  const label = text(item.label, language);
  const palette = getTokenExamplePalette(themeClasses, toneIndex);
  const icons: LucideIcon[] = [Type, Scissors, CircleDot, CornerDownLeft, Braces];
  const Icon = icons[toneIndex % icons.length] ?? Type;

  return (
    <div
      data-active={isActive ? 'true' : undefined}
      tabIndex={0}
      onFocus={() => onActivate(item.label.en)}
      onMouseEnter={() => onActivate(item.label.en)}
      className={cx(
        'learning-lab-focus-panel grid h-full min-h-[25.625rem] grid-rows-[150px_minmax(0,1fr)] overflow-hidden rounded-lg border shadow-[inset_0_1px_0_rgba(255,255,255,0.54)] transition-[box-shadow,filter,opacity,transform] duration-200',
        palette.card,
      )}
    >
      <div className={cx('grid place-items-center border-b', palette.top)}>
        <div className={cx('grid h-16 w-16 shrink-0 place-items-center rounded-2xl shadow-[0_12px_24px_rgba(30,42,56,0.12)]', palette.icon)}>
          <Icon className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
        </div>
      </div>
      <div className="grid content-start gap-3 p-4">
        <div className="grid gap-1">
          <div className={cx('text-base font-black leading-6', palette.title)}>{label}</div>
          <p className={cx('text-xs font-semibold leading-5', themeClasses.mutedText)}>{text(item.description, language)}</p>
        </div>
        <div className="flex flex-wrap content-start gap-2">
          {item.tokens.map((token) => (
            <span
              key={`${label}-${token}`}
              className={cx('inline-flex min-h-8 items-center rounded-md border px-2.5 font-mono text-xs font-black', palette.token)}
            >
              {token}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTokenExamplePalette(themeClasses: ReturnType<typeof getLearningLabTheme>, toneIndex: number) {
  const palettes = themeClasses.isLight
    ? [
        {
          card: 'border-[#2563EB]/14 bg-white',
          top: 'border-[#2563EB]/10 bg-[#EFF6FF]',
          icon: 'border border-[#2563EB]/14 bg-white text-[#1D4ED8]',
          title: themeClasses.titleText,
          token: 'border-[#2563EB]/14 bg-[#EFF6FF] text-[#1D4ED8]',
        },
        {
          card: 'border-[#7C3AED]/14 bg-white',
          top: 'border-[#7C3AED]/10 bg-[#F3EEFF]',
          icon: 'border border-[#7C3AED]/14 bg-white text-[#6D28D9]',
          title: themeClasses.titleText,
          token: 'border-[#7C3AED]/14 bg-[#F3EEFF] text-[#6D28D9]',
        },
        {
          card: 'border-[#F59E0B]/18 bg-white',
          top: 'border-[#F59E0B]/12 bg-[#FFF7E6]',
          icon: 'border border-[#F59E0B]/18 bg-white text-[#8A4F00]',
          title: themeClasses.titleText,
          token: 'border-[#F59E0B]/20 bg-[#FFF7E6] text-[#8A4F00]',
        },
        {
          card: 'border-[#2FBF71]/16 bg-white',
          top: 'border-[#2FBF71]/10 bg-[#ECFDF3]',
          icon: 'border border-[#2FBF71]/16 bg-white text-[#1F6F48]',
          title: themeClasses.titleText,
          token: 'border-[#2FBF71]/18 bg-[#ECFDF3] text-[#1F6F48]',
        },
        {
          card: 'border-[#EC4899]/14 bg-white',
          top: 'border-[#EC4899]/10 bg-[#FDF2F8]',
          icon: 'border border-[#EC4899]/14 bg-white text-[#BE185D]',
          title: themeClasses.titleText,
          token: 'border-[#EC4899]/14 bg-[#FDF2F8] text-[#BE185D]',
        },
      ]
    : [
        {
          card: 'border-[#7FB0FF]/18 bg-[#121A24]/36',
          top: 'border-[#7FB0FF]/14 bg-[#7FB0FF]/12',
          icon: 'border border-[#7FB0FF]/18 bg-[#7FB0FF]/10 text-[#DCEAFF]',
          title: themeClasses.titleText,
          token: 'border-[#7FB0FF]/20 bg-[#7FB0FF]/12 text-[#DCEAFF]',
        },
        {
          card: 'border-[#C4B5FD]/18 bg-[#121A24]/36',
          top: 'border-[#C4B5FD]/14 bg-[#C4B5FD]/12',
          icon: 'border border-[#C4B5FD]/18 bg-[#C4B5FD]/10 text-[#EEE8FF]',
          title: themeClasses.titleText,
          token: 'border-[#C4B5FD]/20 bg-[#C4B5FD]/12 text-[#EEE8FF]',
        },
        {
          card: 'border-[#FBBF24]/20 bg-[#121A24]/36',
          top: 'border-[#FBBF24]/14 bg-[#FBBF24]/12',
          icon: 'border border-[#FBBF24]/20 bg-[#FBBF24]/10 text-[#FFE7AD]',
          title: themeClasses.titleText,
          token: 'border-[#FBBF24]/20 bg-[#FBBF24]/12 text-[#FFE7AD]',
        },
        {
          card: 'border-[#74D99F]/18 bg-[#121A24]/36',
          top: 'border-[#74D99F]/14 bg-[#74D99F]/12',
          icon: 'border border-[#74D99F]/18 bg-[#74D99F]/10 text-[#DDF7E8]',
          title: themeClasses.titleText,
          token: 'border-[#74D99F]/20 bg-[#74D99F]/12 text-[#DDF7E8]',
        },
        {
          card: 'border-[#F9A8D4]/18 bg-[#121A24]/36',
          top: 'border-[#F9A8D4]/14 bg-[#F9A8D4]/12',
          icon: 'border border-[#F9A8D4]/18 bg-[#F9A8D4]/10 text-[#FFE3F1]',
          title: themeClasses.titleText,
          token: 'border-[#F9A8D4]/20 bg-[#F9A8D4]/12 text-[#FFE3F1]',
        },
      ];

  return palettes[toneIndex % palettes.length]!;
}

function getConceptTileClass(themeClasses: ReturnType<typeof getLearningLabTheme>) {
  return cx('grid min-h-[15rem] p-0', themeClasses.isLight ? 'text-[#123B68]' : 'text-[#F2F6FA]');
}

function getTheoryTileClass(themeClasses: ReturnType<typeof getLearningLabTheme>) {
  return cx(
    'grid min-h-[15rem] rounded-lg border p-4',
    themeClasses.isLight ? 'border-[#205089]/12 bg-[#F8FAFC]' : 'border-[#A8B8C8]/14 bg-[#A8B8C8]/6',
  );
}
export function LlmConceptPanelBlock({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptPanel' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const panelTitle = text(extra.title, language);
  const emphasis = extra.emphasis ? text(extra.emphasis, language) : '';
  const [titleBeforeEmphasis, titleAfterEmphasis] = emphasis ? panelTitle.split(emphasis) : [panelTitle, ''];
  const outlineGroupTitleText = themeClasses.isLight ? 'text-[#254F70]' : themeClasses.titleText;
  const outlineItemTitleText = themeClasses.isLight ? 'text-[#385F7A]' : themeClasses.titleText;
  const [activeOutlineItemKey, setActiveOutlineItemKey] = useState('0-0');
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);

  if (extra.id === 'tokenization-example' && extra.tokenExample) {
    return <TokenizationExamplePanel extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.id === 'iris-scale-comparison-roadmap') {
    return (
      <ExtraFrame
        title={panelTitle}
        themeClasses={themeClasses}
        customTitle={(
          <span className={cx('flex flex-wrap items-baseline gap-x-2 gap-y-1', themeClasses.eyebrowText)}>
            <span>{titleBeforeEmphasis}</span>
            <span className={cx('text-2xl font-black leading-none normal-case md:text-3xl', themeClasses.accentText)}>{emphasis}</span>
            <span>{titleAfterEmphasis}</span>
          </span>
        )}
      >
        <IrisScaleComparisonPanel extra={extra} language={language} themeClasses={themeClasses} />
      </ExtraFrame>
    );
  }

  return (
    <ExtraFrame
      title={panelTitle}
      themeClasses={themeClasses}
      customTitle={emphasis ? (
        <span className={cx('flex flex-wrap items-baseline gap-x-2 gap-y-1', themeClasses.eyebrowText)}>
          <span>{titleBeforeEmphasis}</span>
          <span className={cx('text-2xl font-black leading-none normal-case md:text-3xl', themeClasses.accentText)}>{emphasis}</span>
          <span>{titleAfterEmphasis}</span>
        </span>
      ) : undefined}
    >
      <div className="grid gap-4">
        {extra.body?.map((paragraph) => (
          <p key={text(paragraph, language)} className={cx('text-sm leading-7', themeClasses.bodyText)}>
            {text(paragraph, language)}
          </p>
        ))}

        {extra.tokenExample && (
          <TokenExampleBlock example={extra.tokenExample} language={language} themeClasses={themeClasses} hideTitle />
        )}

        {extra.highlights && extra.id === 'why-large' ? (
          <div className="learning-lab-focus-group grid gap-3 md:grid-cols-3">
            {extra.highlights.map((item, itemIndex) => {
              const scaleIcons = [SlidersHorizontal, Database, Cpu];
              return (
                <LlmScaleFactorCard
                  key={text(item.shortName, language)}
                  shortName={text(item.shortName, language)}
                  fullName={text(item.fullName, language)}
                  description={text(item.description, language)}
                  Icon={scaleIcons[itemIndex] ?? SlidersHorizontal}
                  toneIndex={itemIndex}
                  isActive={activeHighlightIndex === itemIndex}
                  themeClasses={themeClasses}
                  onActivate={() => setActiveHighlightIndex(itemIndex)}
                />
              );
            })}
          </div>
        ) : extra.highlights && extra.id === 'why-llms-are-popular-now' ? (
          <>
            <figure className={cx('mx-auto w-full max-w-4xl overflow-hidden rounded-lg border', themeClasses.isLight ? 'border-[#205089]/10 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/42')}>
              <img
                src={getLlmLearningAssetUrl('llm-from-scratch-roadmap.why-llms-popular-product')}
                alt="Ba lý do LLM dễ ứng dụng trong doanh nghiệp: dễ dùng, đa nhiệm và dễ tích hợp."
                className="aspect-[1672/941] w-full object-contain"
                loading="lazy"
              />
            </figure>
            <figure className={cx('mx-auto w-full max-w-4xl overflow-hidden rounded-lg border', themeClasses.isLight ? 'border-[#205089]/10 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/42')}>
              <img
                src={getLlmLearningAssetUrl('llm-from-scratch-roadmap.why-llms-popular-technical')}
                alt="Ba lý do kỹ thuật giúp AI hiện đại phát triển mạnh: Transformer, big data và GPU compute."
                className="aspect-[1672/941] w-full object-contain"
                loading="lazy"
              />
            </figure>
          </>
        ) : extra.highlights ? (
          <div className="learning-lab-focus-group grid gap-3">
            {extra.highlights.map((item, itemIndex) => (
              <ConceptHighlightRow
                key={text(item.shortName, language)}
                shortName={text(item.shortName, language)}
                fullName={text(item.fullName, language)}
                description={text(item.description, language)}
                links={item.links?.map((link) => ({ label: text(link.label, language), href: link.href }))}
                isActive={activeHighlightIndex === itemIndex}
                themeClasses={themeClasses}
                onActivate={() => setActiveHighlightIndex(itemIndex)}
              />
            ))}
          </div>
        ) : null}

        {extra.comparisonTable && (
          <div className={cx('overflow-hidden rounded-lg border', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/32')}>
            <div className={cx('hidden grid-cols-[7rem_repeat(3,minmax(0,1fr))] border-b text-xs font-black uppercase tracking-wide md:grid', themeClasses.isLight ? 'border-[#205089]/10 bg-[#EEF4FA] text-[#123B68]/72' : 'border-[#A8B8C8]/12 bg-[#A8B8C8]/8 text-[#F2F6FA]/62')}>
              {extra.comparisonTable.columns.map((column) => (
                <div key={text(column, language)} className="px-3 py-3">
                  {text(column, language)}
                </div>
              ))}
            </div>
            <div className="grid">
              {extra.comparisonTable.rows.map((row, rowIndex) => (
                <div
                  key={text(row.label, language)}
                  className={cx(
                    'grid gap-3 px-3 py-4 md:grid-cols-[7rem_repeat(3,minmax(0,1fr))] md:gap-0',
                    rowIndex > 0 && (themeClasses.isLight ? 'border-t border-[#205089]/10' : 'border-t border-[#A8B8C8]/12'),
                  )}
                >
                  <div className={cx('text-base font-black leading-6 md:text-sm', themeClasses.accentText)}>{text(row.label, language)}</div>
                  {row.cells.map((cell, cellIndex) => (
                    <div key={`${text(row.label, language)}-${cellIndex}`} className="min-w-0 md:px-3">
                      <div className={cx('mb-1 text-[11px] font-black uppercase tracking-wide md:hidden', themeClasses.mutedText)}>
                        {text(extra.comparisonTable?.columns[cellIndex + 1] ?? row.label, language)}
                      </div>
                      <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(cell, language)}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {extra.outline && (
          <div className="learning-lab-focus-group grid gap-6">
            {extra.outline.map((group, groupIndex) => (
              <div
                key={text(group.title, language)}
                className={cx(
                  'grid gap-3 border-l-2 pl-4',
                  themeClasses.isLight ? 'border-[#205089]/18' : 'border-[#A8B8C8]/20',
                )}
              >
                <div className="grid gap-3 sm:grid-cols-[3.75rem_minmax(0,1fr)] sm:items-start">
                  <div
                    className={cx(
                      'flex h-11 w-11 items-center justify-center rounded-lg text-lg font-black leading-none tabular-nums',
                      themeClasses.isLight ? 'bg-[#205089]/10 text-[#123B68]' : 'bg-[#A8B8C8]/12 text-[#F2F6FA]',
                    )}
                  >
                    {groupIndex + 1}
                  </div>
                  <div className="min-w-0">
                    <div className={cx('text-base font-black leading-6', outlineGroupTitleText)}>{text(group.title, language)}</div>
                    <p className={cx('mt-1 text-sm leading-6', themeClasses.bodyText)}>{text(group.body, language)}</p>
                  </div>
                </div>

                <div className="grid gap-1 sm:pl-14">
                  {group.items.map((item, itemIndex) => {
                    const itemKey = `${groupIndex}-${itemIndex}`;
                    const isActive = activeOutlineItemKey === itemKey;
                    return (
                      <div
                        key={text(item.title, language)}
                        data-active={isActive ? 'true' : undefined}
                        tabIndex={0}
                        onFocus={() => setActiveOutlineItemKey(itemKey)}
                        onMouseEnter={() => setActiveOutlineItemKey(itemKey)}
                        className={cx(
                          'learning-lab-focus-panel group grid gap-3 px-3 py-2.5 transition-[box-shadow,filter,opacity,transform] duration-200 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:items-start',
                          themeClasses.radius.button,
                          itemIndex > 0 && (themeClasses.isLight ? 'border-t border-[#205089]/8' : 'border-t border-[#A8B8C8]/10'),
                        )}
                      >
                        <span
                          className={cx(
                            'inline-flex min-h-8 w-fit items-center rounded-lg px-2 text-[11px] font-black leading-5 tabular-nums transition-colors',
                            themeClasses.isLight
                              ? 'bg-[#B8C8DA]/24 text-[#123B68] group-hover:bg-[#205089]/10'
                              : 'bg-[#A8B8C8]/8 text-[#D7EAFE] group-hover:bg-[#A8B8C8]/12',
                          )}
                        >
                          {groupIndex + 1}.{itemIndex + 1}
                        </span>
                        <div className="min-w-0 lg:grid lg:grid-cols-[minmax(9rem,0.26fr)_minmax(0,1fr)] lg:gap-4">
                          <div className={cx('text-sm font-black leading-6', outlineItemTitleText)}>{text(item.title, language)}</div>
                          <p className={cx('mt-1 text-sm leading-6 lg:mt-0', themeClasses.bodyText)}>{text(item.body, language)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {extra.links && (
          <div className="grid gap-2">
            {extra.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={cx('text-sm font-semibold leading-6 underline decoration-dotted underline-offset-4', themeClasses.accentText)}
              >
                {text(link.label, language)}
              </a>
            ))}
          </div>
        )}

        {extra.bodyAfter && (
          extra.id === 'why-split-ai-fields' ? (
            <div className="mx-auto grid max-w-3xl gap-2">
              {extra.bodyAfter.map((paragraph) => (
                <div key={text(paragraph, language)} className={cx('flex gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold leading-6', themeClasses.sectionAccent.note)}>
                  <CircleAlert className="mt-1 h-4 w-4 shrink-0 text-[#D97706]" strokeWidth={2.1} aria-hidden="true" />
                  <p>{text(paragraph, language)}</p>
                </div>
              ))}
            </div>
          ) : (
            extra.bodyAfter.map((paragraph) => (
              <p key={text(paragraph, language)} className={cx('text-sm leading-7', themeClasses.bodyText)}>
                {text(paragraph, language)}
              </p>
            ))
          )
        )}
      </div>
    </ExtraFrame>
  );
}

export function TransformerTranslationStepPanel({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptPanel' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const activeStep = Number(extra.id.replace('transformer-translation-step-', '')) || 1;
  const paragraphs = extra.body?.map((paragraph) => text(paragraph, language)) ?? [];
  const description = paragraphs.join(' ');
  const introParagraphs = activeStep === 1 && paragraphs.length >= 4 ? paragraphs.slice(0, 2) : [description];
  const bulletParagraphs = activeStep === 1 && paragraphs.length >= 4 ? paragraphs.slice(2) : [];
  const markdownBulletParagraphs = paragraphs.filter((paragraph) => paragraph.startsWith('- '));
  const plainParagraphs = markdownBulletParagraphs.length > 0
    ? paragraphs.filter((paragraph) => !paragraph.startsWith('- '))
    : [];

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        {markdownBulletParagraphs.length > 0 ? (
          <>
            {plainParagraphs.map((paragraph, index) => (
              <p key={paragraph} className={cx('text-sm leading-6', themeClasses.bodyText)}>
                {renderTransformerDescription(paragraph, index === 0 ? extra.links?.[0]?.href : undefined, themeClasses)}
              </p>
            ))}
            <ul className={cx('list-disc space-y-1 pl-5 text-sm leading-6', themeClasses.bodyText)}>
              {markdownBulletParagraphs.map((paragraph) => (
                <li key={paragraph}>{paragraph.slice(2)}</li>
              ))}
            </ul>
          </>
        ) : (
          introParagraphs.map((paragraph, index) => (
            <p key={paragraph} className={cx('text-sm leading-6', themeClasses.bodyText)}>
              {renderTransformerDescription(paragraph, index === 0 ? extra.links?.[0]?.href : undefined, themeClasses)}
            </p>
          ))
        )}
        {markdownBulletParagraphs.length === 0 && bulletParagraphs.length > 0 ? (
          <ol className={cx('list-decimal space-y-1 pl-5 text-sm leading-6', themeClasses.bodyText)}>
            {bulletParagraphs.map((paragraph) => (
              <li key={paragraph}>{renderTransformerBullet(paragraph)}</li>
            ))}
          </ol>
        ) : null}
      </div>

      <TransformerTranslationDiagram activeStep={activeStep} themeClasses={themeClasses} language={language} />
    </div>
  );
}

function renderTransformerBullet(paragraph: string): ReactNode {
  const [label, detail] = paragraph.split(': ');
  if (!detail) return paragraph;

  return (
    <>
      <strong>{label}</strong>: {detail}
    </>
  );
}

function renderTransformerDescription(
  description: string,
  paperHref: string | undefined,
  themeClasses: ReturnType<typeof getLearningLabTheme>,
): ReactNode {
  const phrase = '"Attention Is All You Need"';
  if (!paperHref || !description.includes(phrase)) return description;

  const [before, after] = description.split(phrase);
  return (
    <>
      {before}
      <a
        href={paperHref}
        target="_blank"
        rel="noreferrer"
        className={cx('underline decoration-dotted underline-offset-4', themeClasses.accentText)}
      >
        {phrase}
      </a>
      {after}
    </>
  );
}

function TransformerTranslationDiagram({
  activeStep,
  themeClasses,
  language,
}: {
  activeStep: number;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  language: Language;
}) {
  const labels = language === 'vi'
    ? {
        source: '"Anh trai vượt ngàn chông gai"',
        encoderPrep: 'Preprocessing',
        encoder: 'Encoder',
        embeddings: 'Vector mã hóa Embeddings',
        partial: '"披荆斩棘的__"',
        decoderPrep: 'Preprocessing',
        decoder: 'Decoder',
        complete: '"披荆斩棘的哥哥"',
      }
    : {
        source: '"Anh trai vượt ngàn chông gai"',
        encoderPrep: 'Preprocessing',
        encoder: 'Encoder',
        embeddings: 'Encoder vectors',
        partial: '"披荆斩棘的__"',
        decoderPrep: 'Preprocessing',
        decoder: 'Decoder',
        complete: '"披荆斩棘的哥哥"',
      };
  const connectorTone = themeClasses.isLight ? 'text-[#7892A8]' : 'text-[#A8B8C8]/72';
  const isOverviewStep = activeStep === 1;

  return (
    <div className="px-0 py-1">
      <div className="mx-auto grid w-full max-w-[52rem] gap-x-4 gap-y-1.5 md:grid-cols-[minmax(0,1fr)_11rem_3rem_minmax(0,1fr)]">
        <DiagramFlowItem>
          <DiagramBox active={false} visited={activeStep > 1} label={labels.source} kind="text" compactText themeClasses={themeClasses} className="min-h-12 w-full" />
        </DiagramFlowItem>
        <div className="hidden md:block" />
        <div className="hidden md:block" />
        <DiagramFlowItem>
          <DiagramBox active={activeStep === 5} visited={activeStep > 5} label={labels.partial} kind="text" themeClasses={themeClasses} className="min-h-12 w-full" />
        </DiagramFlowItem>

        <DiagramConnector active={activeStep === 2} tone={connectorTone} />
        <div className="hidden md:block" />
        <div className="hidden md:block" />
        <DiagramConnector active={activeStep === 6} tone={connectorTone} />

        <DiagramFlowItem>
          <DiagramPrepBox
            active={activeStep === 2}
            visited={activeStep > 2}
            expanded={activeStep === 2}
            title={labels.encoderPrep}
            inputLabel={labels.source}
            themeClasses={themeClasses}
          />
        </DiagramFlowItem>
        <div className="hidden md:block" />
        <div className="hidden md:block" />
        <DiagramFlowItem>
          <DiagramPrepBox
            active={activeStep === 6}
            visited={activeStep > 6}
            expanded={activeStep === 6}
            title={labels.decoderPrep}
            inputLabel={labels.partial}
            themeClasses={themeClasses}
          />
        </DiagramFlowItem>

        <DiagramConnector active={activeStep === 3} tone={connectorTone} />
        <div className="hidden md:block" />
        <div className="hidden md:block" />
        <DiagramConnector active={activeStep === 7} tone={connectorTone} />

        <DiagramFlowItem>
          <DiagramBox active={isOverviewStep || activeStep === 3} visited={activeStep > 3} label={labels.encoder} kind="module" tone="encoder" themeClasses={themeClasses} className="min-h-28 w-full" />
        </DiagramFlowItem>
        <div className="flex min-w-0 items-center justify-center gap-2">
          <ArrowRight className={cx('h-6 w-6 shrink-0 transition-opacity', activeStep === 4 ? 'opacity-100' : 'opacity-[0.36]', activeStep === 4 ? themeClasses.accentText : themeClasses.mutedText)} strokeWidth={2.6} aria-hidden="true" />
          <DiagramBox active={activeStep === 4} visited={activeStep > 4} label={labels.embeddings} kind="thin" themeClasses={themeClasses} className="min-h-16 w-full" />
        </div>
        <div className="hidden items-center justify-center md:flex">
          <ArrowRight className={cx('h-8 w-8 transition-opacity', activeStep === 4 || activeStep === 7 ? 'opacity-100' : 'opacity-[0.36]', activeStep === 4 || activeStep === 7 ? themeClasses.accentText : themeClasses.mutedText)} strokeWidth={2.6} aria-hidden="true" />
        </div>
        <DiagramFlowItem>
          <DiagramBox active={isOverviewStep || activeStep === 7} visited={activeStep > 7} label={labels.decoder} kind="module" tone="decoder" themeClasses={themeClasses} className="min-h-28 w-full" />
        </DiagramFlowItem>

        <div className="hidden md:block" />
        <div className="hidden md:block" />
        <div className="hidden md:block" />
        <DiagramConnector active={activeStep === 7 || activeStep === 8} tone={connectorTone} />

        <div className="hidden md:block" />
        <div className="hidden md:block" />
        <div className="hidden md:block" />
        <DiagramBox active={activeStep === 8} visited={activeStep > 8} label={labels.complete} kind="text" themeClasses={themeClasses} className="min-h-12 w-full" />
      </div>
    </div>
  );
}

function DiagramBox({
  active,
  visited,
  label,
  kind,
  tone,
  compactText = false,
  themeClasses,
  className,
}: {
  active: boolean;
  visited: boolean;
  label: string;
  kind: 'text' | 'thin' | 'module' | 'dark';
  tone?: 'encoder' | 'decoder';
  compactText?: boolean;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  className?: string;
}) {
  const base = 'grid whitespace-pre-line place-items-center px-2 text-center transition-[background-color,box-shadow,opacity,transform] duration-200 sm:px-3';
  const muted = active || visited ? 'opacity-100' : 'opacity-[0.42]';
  const activeRing = active ? (themeClasses.isLight ? 'scale-[1.015] shadow-[0_0_0_3px_rgba(32,80,137,0.2)]' : 'scale-[1.015] shadow-[0_0_0_3px_rgba(168,184,200,0.24)]') : '';
  const shapeClass = kind === 'module'
    ? 'rounded-[1.75rem] text-xl font-black leading-7 md:text-3xl'
    : kind === 'text'
      ? compactText
        ? 'rounded-none text-xs font-semibold leading-5 md:text-sm md:leading-6'
        : 'rounded-none text-sm font-semibold leading-5 md:text-lg md:leading-6'
      : kind === 'dark'
        ? 'rounded-lg text-xs font-black leading-5 md:text-base md:leading-6'
        : 'rounded-lg text-xs font-semibold leading-4 md:text-sm md:leading-5';
  const colorClass = kind === 'module'
    ? tone === 'decoder'
      ? themeClasses.isLight ? 'bg-[#CFE7F7] text-[#153D59]' : 'bg-[#183044] text-[#E7F4FB]'
      : themeClasses.isLight ? 'bg-[#E5E5E1] text-[#202427]' : 'bg-[#2A3036] text-[#F0F3F5]'
    : kind === 'dark'
      ? themeClasses.isLight ? 'bg-[#3E4853] text-white' : 'bg-[#D8E2EC]/18 text-[#F6FAFD]'
      : themeClasses.isLight ? 'bg-[#F8FAFC] text-[#1D2730]' : 'bg-[#0B1118] text-[#F6FAFD]';

  return (
    <div className={cx(base, muted, activeRing, shapeClass, colorClass, className)}>
      {label}
    </div>
  );
}

function DiagramPrepBox({
  active,
  visited,
  expanded,
  title,
  inputLabel,
  themeClasses,
}: {
  active: boolean;
  visited: boolean;
  expanded: boolean;
  title: string;
  inputLabel: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  if (!expanded) {
    return (
      <DiagramBox
        active={active}
        visited={visited}
        label={title}
        kind="thin"
        themeClasses={themeClasses}
        className="min-h-12 w-[88%]"
      />
    );
  }

  const muted = active || visited ? 'opacity-100' : 'opacity-[0.42]';
  const activeRing = active ? (themeClasses.isLight ? 'scale-[1.015] shadow-[0_0_0_3px_rgba(32,80,137,0.2)]' : 'scale-[1.015] shadow-[0_0_0_3px_rgba(168,184,200,0.24)]') : '';
  const shellTone = themeClasses.isLight ? 'bg-[#F8FAFC] text-[#1D2730]' : 'bg-[#0B1118] text-[#F6FAFD]';
  const stepTone = themeClasses.isLight ? 'bg-white/78 text-[#334155]' : 'bg-[#D8E2EC]/8 text-[#E2E8F0]';
  const arrowTone = themeClasses.isLight ? 'text-[#7892A8]' : 'text-[#A8B8C8]/72';
  const isDecoderInput = inputLabel.includes('披荆斩棘');
  const tokens = isDecoderInput ? ['披荆斩棘', '的'] : ['Anh', 'trai', 'vượt', 'ngàn', 'chông', 'gai'];
  const ids = isDecoderInput ? ['9301', '102'] : ['211', '842', '1904', '673', '2451', '998'];
  const steps = [
    { label: 'Tokens', value: tokens.join(' | ') },
    { label: 'Token IDs', value: ids.join(', ') },
    { label: 'Token embedding', value: '[T, d_model]' },
    { label: '+ Positional embedding', value: '[T, d_model]' },
  ];

  return (
    <div className={cx('grid w-[88%] gap-2 rounded-lg px-2.5 py-2.5 text-center transition-[box-shadow,opacity,transform] duration-200', muted, activeRing, shellTone)}>
      <div className="text-xs font-black leading-5 md:text-sm">{title}</div>
      <div className="grid gap-1.5">
        {steps.map((step, index) => (
          <Fragment key={`${title}-${step.label}`}>
            <div className={cx('grid min-h-8 place-items-center rounded-md px-2 text-[11px] font-semibold leading-4 md:text-xs', stepTone)}>
              <span className="font-black">{step.label}</span>
              <span className="mt-0.5 break-words font-semibold opacity-82">{step.value}</span>
            </div>
            {index < steps.length - 1 ? (
              <ArrowDown className={cx('mx-auto h-3.5 w-3.5', arrowTone)} strokeWidth={2.4} aria-hidden="true" />
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function DiagramConnector({
  active,
  tone,
}: {
  active: boolean;
  tone: string;
}) {
  return (
    <div className={cx('grid h-7 justify-items-center transition-opacity', active ? 'opacity-100' : 'opacity-[0.36]', tone)}>
      <div className="h-4 w-0.5 rounded-full bg-current" />
      <ArrowDown className="-mt-1 h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
    </div>
  );
}

function DiagramFlowItem({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 justify-center">
      {children}
    </div>
  );
}

function TokenizationExamplePanel({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptPanel' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  if (!extra.tokenExample) return null;

  return (
    <div className="grid gap-4">
      <p className={cx('text-base font-black leading-6', themeClasses.accentText)}>
        {language === 'vi' ? 'Ví dụ về Tokenization' : 'Tokenization example'}
      </p>
      <p className={cx('text-sm leading-6', themeClasses.bodyText)}>
        {language === 'vi' ? 'Qua chương sau chúng ta sẽ quay lại thảo luận kỹ hơn về Tokenization.' : 'We will return to tokenization in more detail in the next chapter.'}
      </p>

      <TokenExampleBlock example={extra.tokenExample} language={language} themeClasses={themeClasses} hideTitle />
    </div>
  );
}

function IrisScaleComparisonPanel({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptPanel' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const iris = extra.highlights?.[0];
  const llm = extra.highlights?.[1];
  if (!iris || !llm) return null;

  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:items-stretch">
      <ScaleComparisonCard
        eyebrow={text(iris.fullName, language)}
        value={text(iris.shortName, language)}
        description={text(iris.description, language)}
        tone="compact"
        themeClasses={themeClasses}
      />
      <ScaleComparisonCard
        eyebrow={text(llm.fullName, language)}
        value={text(llm.shortName, language)}
        description={text(llm.description, language)}
        tone="large"
        themeClasses={themeClasses}
      />
    </div>
  );
}

function ScaleComparisonCard({
  eyebrow,
  value,
  description,
  tone,
  themeClasses,
}: {
  eyebrow: string;
  value: string;
  description: string;
  tone: 'compact' | 'large';
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const toneClass = tone === 'compact'
    ? themeClasses.isLight
      ? 'border-[#2F6B55]/16 bg-[#EEF7F2]'
      : 'border-[#A6E8C1]/18 bg-[#173528]/52'
    : themeClasses.isLight
      ? 'border-[#2F6F9F]/16 bg-[#EEF6FB]'
      : 'border-[#8FC7EA]/18 bg-[#183044]/52';

  return (
    <div className={cx('grid min-h-44 grid-rows-[auto_1fr_auto] gap-4 rounded-lg border p-4', toneClass)}>
      <div className="grid min-h-24 content-start gap-2">
        <div className={cx('text-xs font-black uppercase leading-5 tracking-wide', themeClasses.eyebrowText)}>{eyebrow}</div>
        <div className={cx('break-all text-3xl font-black leading-none tracking-normal md:text-5xl', themeClasses.accentText)}>
          {value}
        </div>
      </div>
      <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{description}</p>
    </div>
  );
}

export function LlmTrainingLifecyclePanel({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptPanel' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const stages = extra.highlights ?? [];
  const bodyParagraphs = extra.body?.map((paragraph) => text(paragraph, language)) ?? [];
  const introParagraph = bodyParagraphs[0];

  return (
    <div className="grid gap-4">
      {introParagraph ? (
        <p className={cx('text-left text-sm font-normal leading-7', themeClasses.bodyText)}>
          {introParagraph}
        </p>
      ) : null}

      <div className="grid w-full gap-3 md:grid-cols-[minmax(0,1fr)_minmax(4rem,6rem)_minmax(0,1fr)] md:items-stretch">
        {stages.map((stage, index) => (
          <Fragment key={text(stage.shortName, language)}>
            <TrainingLifecycleCard
              title={text(stage.fullName, language)}
              label={language === 'vi' ? `Giai đoạn ${index + 1}` : `Stage ${index + 1}`}
              description={text(stage.description, language)}
              tone={index === 0 ? 'pretrain' : 'finetune'}
              align={index === 0 ? 'right' : 'left'}
              themeClasses={themeClasses}
            />
            {index === 0 && stages.length > 1 ? (
              <div className="hidden h-full items-center md:flex" aria-hidden="true">
                <div className="flex w-full items-center">
                  <span className={cx('h-2 w-2 shrink-0 rounded-full', themeClasses.isLight ? 'bg-[#123B68] opacity-70' : 'bg-[#F2F6FA] opacity-60')} />
                  <span className={cx('h-[3px] min-w-8 flex-1 rounded-full', themeClasses.isLight ? 'bg-[#123B68] opacity-55' : 'bg-[#F2F6FA] opacity-45')} />
                  <span className={cx('h-2 w-2 shrink-0 rounded-full', themeClasses.isLight ? 'bg-[#123B68] opacity-70' : 'bg-[#F2F6FA] opacity-60')} />
                </div>
              </div>
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function TrainingLifecycleCard({
  title,
  label,
  description,
  tone,
  align,
  themeClasses,
}: {
  title: string;
  label: string;
  description: string;
  tone: 'pretrain' | 'finetune';
  align: 'left' | 'right';
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const Icon = tone === 'pretrain' ? Database : Wrench;
  const palette = tone === 'pretrain'
    ? themeClasses.isLight
      ? {
          card: 'border-[#2563EB]/14 bg-white',
          top: 'border-[#2563EB]/10 bg-[#EFF6FF]',
          icon: 'border border-[#2563EB]/14 bg-white text-[#1D4ED8]',
        }
      : {
          card: 'border-[#7FB0FF]/18 bg-[#121A24]/36',
          top: 'border-[#7FB0FF]/14 bg-[#7FB0FF]/12',
          icon: 'border border-[#7FB0FF]/18 bg-[#7FB0FF]/10 text-[#DCEAFF]',
        }
    : themeClasses.isLight
      ? {
          card: 'border-[#2FBF71]/16 bg-white',
          top: 'border-[#2FBF71]/10 bg-[#ECFDF3]',
          icon: 'border border-[#2FBF71]/16 bg-white text-[#1F6F48]',
        }
      : {
          card: 'border-[#74D99F]/18 bg-[#121A24]/36',
          top: 'border-[#74D99F]/14 bg-[#74D99F]/12',
          icon: 'border border-[#74D99F]/18 bg-[#74D99F]/10 text-[#DDF7E8]',
        };

  return (
    <div className={cx(
      'learning-lab-focus-panel grid h-full min-h-[17rem] w-full max-w-[17rem] grid-rows-[6.5rem_minmax(0,1fr)] overflow-hidden rounded-lg border text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.54)]',
      align === 'right' ? 'justify-self-end' : 'justify-self-start',
      palette.card,
    )}>
      <div className={cx('grid h-[6.5rem] place-items-center border-b', palette.top)}>
        <div className={cx('grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center rounded-xl shadow-sm', palette.icon)}>
          <Icon className="h-6 w-6" strokeWidth={2.1} aria-hidden="true" />
        </div>
      </div>
      <div className="grid content-start gap-2.5 p-4">
        <div className="grid gap-1">
          <div className={cx('text-xs font-black uppercase leading-5 tracking-wide', themeClasses.mutedText)}>{label}</div>
          <div className={cx('text-base font-black leading-6', themeClasses.titleText)}>{title}</div>
        </div>
        <p className={cx('leading-6', themeClasses.bodyText)}>{description}</p>
      </div>
    </div>
  );
}

function ConceptHighlightRow({
  shortName,
  fullName,
  description,
  links,
  isActive,
  themeClasses,
  onActivate,
}: {
  shortName: string;
  fullName: string;
  description: string;
  links?: Array<{ label: string; href: string }>;
  isActive: boolean;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onActivate: () => void;
}) {
  const descriptionLines = description.split('\n').filter(Boolean);
  const rowTone = themeClasses.isLight
    ? 'border border-[#205089]/10 bg-white hover:bg-white'
    : 'border border-[#A8B8C8]/14 bg-[#121A24]/42 hover:bg-[#121A24]/56';

  return (
    <div
      data-active={isActive ? 'true' : undefined}
      tabIndex={0}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      className={cx(
        'learning-lab-focus-panel group grid gap-2 px-3 py-2 text-sm transition-[background-color,box-shadow,filter,opacity,transform] duration-200 sm:grid-cols-[7rem_minmax(0,1fr)] sm:items-start',
        themeClasses.radius.button,
        rowTone,
      )}
    >
      <div className={cx('whitespace-nowrap font-black leading-6', themeClasses.titleText)}>{shortName}</div>
      <div className="min-w-0">
        <div className={cx('font-normal leading-6', themeClasses.titleText)}>{fullName}</div>
        {descriptionLines.length > 1 ? (
          <ul className={cx('mt-1 grid gap-1 leading-6', themeClasses.bodyText)}>
            {descriptionLines.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-55" aria-hidden="true" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={cx('mt-0.5 leading-6', themeClasses.bodyText)}>{description}</p>
        )}
        <ConceptHighlightLinks links={links} className="mt-2" themeClasses={themeClasses} />
      </div>
    </div>
  );
}

function LlmScaleFactorCard({
  shortName,
  fullName,
  description,
  Icon,
  toneIndex,
  isActive,
  themeClasses,
  onActivate,
}: {
  shortName: string;
  fullName: string;
  description: string;
  Icon: LucideIcon;
  toneIndex: number;
  isActive: boolean;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onActivate: () => void;
}) {
  const palettes = themeClasses.isLight
    ? [
        {
          card: 'border-[#2563EB]/14 bg-white',
          top: 'border-[#2563EB]/10 bg-[#EFF6FF]',
          icon: 'border border-[#2563EB]/14 bg-white text-[#1D4ED8]',
        },
        {
          card: 'border-[#2FBF71]/16 bg-white',
          top: 'border-[#2FBF71]/10 bg-[#ECFDF3]',
          icon: 'border border-[#2FBF71]/16 bg-white text-[#1F6F48]',
        },
        {
          card: 'border-[#F59E0B]/18 bg-white',
          top: 'border-[#F59E0B]/12 bg-[#FFF7E6]',
          icon: 'border border-[#F59E0B]/18 bg-white text-[#8A4F00]',
        },
      ]
    : [
        {
          card: 'border-[#7FB0FF]/18 bg-[#121A24]/36',
          top: 'border-[#7FB0FF]/14 bg-[#7FB0FF]/12',
          icon: 'border border-[#7FB0FF]/18 bg-[#7FB0FF]/10 text-[#DCEAFF]',
        },
        {
          card: 'border-[#74D99F]/18 bg-[#121A24]/36',
          top: 'border-[#74D99F]/14 bg-[#74D99F]/12',
          icon: 'border border-[#74D99F]/18 bg-[#74D99F]/10 text-[#DDF7E8]',
        },
        {
          card: 'border-[#FBBF24]/20 bg-[#121A24]/36',
          top: 'border-[#FBBF24]/14 bg-[#FBBF24]/12',
          icon: 'border border-[#FBBF24]/20 bg-[#FBBF24]/10 text-[#FFE7AD]',
        },
      ];
  const palette = palettes[toneIndex % palettes.length]!;

  return (
    <div
      data-active={isActive ? 'true' : undefined}
      tabIndex={0}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      className={cx(
        'learning-lab-focus-panel grid h-full min-h-[18rem] grid-rows-[7rem_minmax(0,1fr)] overflow-hidden rounded-lg border text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.54)] transition-[background-color,box-shadow,filter,opacity,transform] duration-200',
        palette.card,
      )}
    >
      <div className={cx('grid h-28 place-items-center border-b', palette.top)}>
        <div className={cx('grid h-14 w-14 shrink-0 place-items-center rounded-xl shadow-sm', palette.icon)}>
          <Icon className="h-7 w-7" strokeWidth={2.1} aria-hidden="true" />
        </div>
      </div>
      <div className="grid content-start gap-3 p-4">
        <div className="grid gap-1">
          <div className={cx('text-xs font-black uppercase leading-5 tracking-wide', themeClasses.mutedText)}>{shortName}</div>
          <div className={cx('text-base font-black leading-6', themeClasses.titleText)}>{fullName}</div>
        </div>
        <p className={cx('leading-6', themeClasses.bodyText)}>{description}</p>
      </div>
    </div>
  );
}

function ConceptHighlightCard({
  shortName,
  fullName,
  description,
  links,
  toneIndex,
  hideFullName = false,
  isActive,
  themeClasses,
  onActivate,
}: {
  shortName: string;
  fullName: string;
  description: string;
  links?: Array<{ label: string; href: string }>;
  toneIndex: number;
  hideFullName?: boolean;
  isActive: boolean;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onActivate: () => void;
}) {
  const icons: LucideIcon[] = [Monitor, Square, Wrench, SlidersHorizontal, Database, Cpu];
  const Icon = icons[toneIndex % icons.length] ?? Monitor;
  const palettes = themeClasses.isLight
    ? [
        {
          card: 'border-[#2563EB]/14 bg-white',
          top: 'border-[#2563EB]/10 bg-[#EFF6FF]',
          icon: 'border border-[#2563EB]/14 bg-white text-[#1D4ED8]',
        },
        {
          card: 'border-[#7C3AED]/14 bg-white',
          top: 'border-[#7C3AED]/10 bg-[#F3EEFF]',
          icon: 'border border-[#7C3AED]/14 bg-white text-[#6D28D9]',
        },
        {
          card: 'border-[#2FBF71]/16 bg-white',
          top: 'border-[#2FBF71]/10 bg-[#ECFDF3]',
          icon: 'border border-[#2FBF71]/16 bg-white text-[#1F6F48]',
        },
        {
          card: 'border-[#F59E0B]/18 bg-white',
          top: 'border-[#F59E0B]/12 bg-[#FFF7E6]',
          icon: 'border border-[#F59E0B]/18 bg-white text-[#8A4F00]',
        },
        {
          card: 'border-[#EC4899]/14 bg-white',
          top: 'border-[#EC4899]/10 bg-[#FDF2F8]',
          icon: 'border border-[#EC4899]/14 bg-white text-[#BE185D]',
        },
        {
          card: 'border-[#0EA5E9]/16 bg-white',
          top: 'border-[#0EA5E9]/10 bg-[#F0F9FF]',
          icon: 'border border-[#0EA5E9]/16 bg-white text-[#0369A1]',
        },
      ]
    : [
        {
          card: 'border-[#7FB0FF]/18 bg-[#121A24]/36',
          top: 'border-[#7FB0FF]/14 bg-[#7FB0FF]/12',
          icon: 'border border-[#7FB0FF]/18 bg-[#7FB0FF]/10 text-[#DCEAFF]',
        },
        {
          card: 'border-[#C4B5FD]/18 bg-[#121A24]/36',
          top: 'border-[#C4B5FD]/14 bg-[#C4B5FD]/12',
          icon: 'border border-[#C4B5FD]/18 bg-[#C4B5FD]/10 text-[#EEE8FF]',
        },
        {
          card: 'border-[#74D99F]/18 bg-[#121A24]/36',
          top: 'border-[#74D99F]/14 bg-[#74D99F]/12',
          icon: 'border border-[#74D99F]/18 bg-[#74D99F]/10 text-[#DDF7E8]',
        },
        {
          card: 'border-[#FBBF24]/20 bg-[#121A24]/36',
          top: 'border-[#FBBF24]/14 bg-[#FBBF24]/12',
          icon: 'border border-[#FBBF24]/20 bg-[#FBBF24]/10 text-[#FFE7AD]',
        },
        {
          card: 'border-[#F9A8D4]/18 bg-[#121A24]/36',
          top: 'border-[#F9A8D4]/14 bg-[#F9A8D4]/12',
          icon: 'border border-[#F9A8D4]/18 bg-[#F9A8D4]/10 text-[#FFE3F1]',
        },
        {
          card: 'border-[#67E8F9]/18 bg-[#121A24]/36',
          top: 'border-[#67E8F9]/14 bg-[#67E8F9]/12',
          icon: 'border border-[#67E8F9]/18 bg-[#67E8F9]/10 text-[#CFFAFE]',
        },
      ];
  const palette = palettes[toneIndex % palettes.length]!;

  return (
    <div
      data-active={isActive ? 'true' : undefined}
      tabIndex={0}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      className={cx(
        'learning-lab-focus-panel grid h-full min-h-[24rem] w-full max-w-[17rem] justify-self-center grid-rows-[7rem_minmax(0,1fr)] overflow-hidden rounded-lg border text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.54)] transition-[background-color,box-shadow,filter,opacity,transform] duration-200',
        palette.card,
      )}
    >
      <div className={cx('grid h-28 place-items-center border-b', palette.top)}>
        <div className={cx('grid h-14 w-14 shrink-0 place-items-center rounded-xl shadow-sm', palette.icon)}>
          <Icon className="h-7 w-7" strokeWidth={2.1} aria-hidden="true" />
        </div>
      </div>
      <div className="grid content-start gap-3 p-4">
        <div className="grid gap-1">
          <div className={cx('text-xs font-black uppercase leading-5 tracking-wide', themeClasses.mutedText)}>{shortName}</div>
          {hideFullName ? null : (
            <div className={cx('text-base font-black leading-6', themeClasses.titleText)}>{fullName}</div>
          )}
        </div>
        <p className={cx('leading-6', themeClasses.bodyText)}>{description}</p>
        <ConceptHighlightLinks links={links} className="mt-1" themeClasses={themeClasses} />
      </div>
    </div>
  );
}

function ConceptPanelConnector({ themeClasses }: {
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <div className="hidden h-full place-items-center lg:grid" aria-hidden="true">
      <div className={cx('h-px w-full', themeClasses.isLight ? 'bg-[#205089]/18' : 'bg-[#A8B8C8]/18')} />
    </div>
  );
}

function ConceptHighlightLinks({
  links,
  className,
  themeClasses,
}: {
  links?: Array<{ label: string; href: string }>;
  className?: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  if (!links?.length) return null;

  return (
    <ul className={cx(className, 'grid gap-1.5 text-xs leading-5', themeClasses.bodyText)}>
      {links.map((link) => (
        <li key={link.href} className="flex min-w-0 gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-55" aria-hidden="true" />
          <span className="min-w-0">
            <span className={cx('font-black', themeClasses.titleText)}>{link.label}: </span>
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={cx('break-all font-semibold underline decoration-dotted underline-offset-4', themeClasses.accentText)}
            >
              {link.href}
            </a>
          </span>
        </li>
      ))}
    </ul>
  );
}

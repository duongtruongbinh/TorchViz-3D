import { ArrowDown, ArrowRight } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { Language } from '../../../../lib/localization';
import { cx, getLearningLabTheme } from '../../theme';
import { getLearningLocalizedText as text } from '../../learningText';
import { DiagramConnectorLayer, getDiagramAnchor, observeDiagramLayout, ProbabilityCurveChart } from './diagramPrimitives';
import { StepPlaybackControls } from './rendererPrimitives';
import { getLlmRendererTheme } from './rendererTheme';
import type {
  LlmArInferencePipelineContent,
  LlmAutoregressiveDefinitionContent,
  LlmContentRendererProps,
  LlmLossDerivationContent,
  LlmLossHandCalculationContent,
  LlmNextTokenLossContent,
  LlmOutputProjectionContent,
  LlmOutputProjectionFocus,
  LlmProbabilityDefinitionContent,
  LlmVocabularyOutputVectorContent,
} from './rendererTypes';

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

export function LlmLossDerivation({ content, language, themeClasses }: LlmContentRendererProps<LlmLossDerivationContent>) {
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

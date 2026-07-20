import { Angry, ArrowDown, ArrowLeftRight, ArrowRight, Braces, CheckCircle2, ChevronLeft, ChevronRight, CircleAlert, CircleDot, CornerDownLeft, Cpu, Database, Info, MousePointer2, Pause, Play, RotateCcw, Scissors, SlidersHorizontal, Sparkles, Type, type LucideIcon, Wrench, X } from 'lucide-react';
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

type LlmTokenizerMemoryContent = {
  cards: Array<{
    id: 'flexible' | 'robust' | 'efficient';
    cue: LearningLocalizedText;
    title: LearningLocalizedText;
    description: LearningLocalizedText;
    example: string;
  }>;
};

type LlmTokenizerCodeStructureContent = {
  lead: LearningLocalizedText;
  code: string[];
  challenge: { title: LearningLocalizedText; body: LearningLocalizedText; signals: string[] };
  improvement: { title: LearningLocalizedText; body: LearningLocalizedText; signals: string[] };
  takeaway: LearningLocalizedText;
};

type LlmTokenizerBoundaryMismatchContent = {
  lead: LearningLocalizedText;
  examples: Array<{
    id: 'number' | 'code';
    source: string;
    humanLabel: LearningLocalizedText;
    humanMeaning: LearningLocalizedText;
    tokenizations: string[][];
    tokenizerMeaning: LearningLocalizedText;
  }>;
  takeaway: LearningLocalizedText;
};

type LlmTokenizerFreeDirectionContent = {
  lead: LearningLocalizedText;
  subword: {
    title: LearningLocalizedText;
    sequence: string[];
    strength: LearningLocalizedText;
    constraint: LearningLocalizedText;
  };
  direct: {
    title: LearningLocalizedText;
    sequence: string[];
    strength: LearningLocalizedText;
    constraint: LearningLocalizedText;
  };
  takeaway: LearningLocalizedText;
};

type LlmTokenizerVocabularyLookupContent = {
  lead: LearningLocalizedText;
  entries: Array<{ token: string; id: number }>;
};

type LlmTokenizerIdMisconceptionsContent = {
  lead: LearningLocalizedText;
  entries: Array<{ token: string; id: number }>;
  nonMeanings: Array<LearningLocalizedText>;
  takeaway: LearningLocalizedText;
};

type LlmTokenizerCodeToIdsContent = {
  lead: LearningLocalizedText;
  note?: LearningLocalizedText;
  tokenizerName: string;
  tokenizerDescription: LearningLocalizedText;
  rawText: string;
  entries: Array<{ token: string; id: number }>;
  stages: Array<{
    id: 'load' | 'input' | 'encode' | 'inspect' | 'count';
    title: LearningLocalizedText;
    code: string[];
    answerCode?: string[];
    output?: string[];
  }>;
  takeaway: LearningLocalizedText;
};

type LlmTokenizerOutputComparisonContent = {
  lead: LearningLocalizedText;
  rawText: string;
  examples: Array<{
    id: 'general' | 'vietnamese';
    name: string;
    description: LearningLocalizedText;
    tokens: string[];
    ids: number[];
  }>;
  markerNote: LearningLocalizedText;
  takeaway: LearningLocalizedText;
};

type LlmTokenizerIdRoundTripContent = {
  lead: LearningLocalizedText;
  sourceText: string;
  tokens: string[];
  ids: number[];
  modelLabel: LearningLocalizedText;
  sampledToken: string;
  sampledTokenId: number;
  outputText: string;
};

type LlmTokenizerMergeTrainingContent = {
  example: string;
  merges: Array<{ sourceIndexes: number[]; result: string }>;
  initialTokens: string[];
  result: LearningLocalizedText;
  playgroundUrl: string;
};

type LlmTokenizerSequenceLengthContent = {
  characterTokens: string[];
  subwordTokens: string[];
  characterCount: string;
  subwordCount: string;
  takeaway: LearningLocalizedText;
};

type LlmTokenizerRegexWalkthroughContent = {
  lead: LearningLocalizedText;
  diagram?: { inputText: string; outputLabel: LearningLocalizedText; tokens: string[] };
  code: string[];
  output: string[];
  takeaway: LearningLocalizedText;
};

function renderTokenizerInlineCode(value: string, themeClasses: ReturnType<typeof getLearningLabTheme>): ReactNode {
  return value.split(/(`[^`]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`${index}-${part}`} className={cx('rounded px-1.5 py-0.5 font-mono text-[0.88em] font-semibold', themeClasses.isLight ? 'bg-[#E8EEF5] text-[#123B68]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{part.slice(1, -1)}</code>;
    }
    return <span key={`${index}-${part}`}>{part}</span>;
  });
}

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

const TRAINING_COMPONENT_ICONS: LucideIcon[] = [Braces, SlidersHorizontal, Database, CheckCircle2, Cpu];
const TRAINING_COMPONENT_PALETTES = [
  ['bg-[#AABBD8]', 'bg-[#EFF4FF] text-[#3C5680]'],
  ['bg-[#B9CBE8]', 'bg-[#EEF5FF] text-[#315D91]'],
  ['bg-[#A7C8CF]', 'bg-[#ECFBFD] text-[#32636C]'],
  ['bg-[#B7D8C2]', 'bg-[#EDFFF3] text-[#3E7050]'],
  ['bg-[#C3B8DF]', 'bg-[#F5F0FF] text-[#62518C]'],
] as const;

function TrainingComponentCard({ card, index, language, themeClasses, emphasisClass, focusPanel = false }: {
  card: LlmTrainingComponentsContent['cards'][number];
  index: number;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  emphasisClass?: string;
  focusPanel?: boolean;
}) {
  const Icon = TRAINING_COMPONENT_ICONS[index] ?? Cpu;
  const [top, icon] = TRAINING_COMPONENT_PALETTES[index] ?? TRAINING_COMPONENT_PALETTES[0];

  return (
    <article className={cx(
      focusPanel && 'learning-lab-focus-panel shadow-[inset_0_1px_0_rgba(255,255,255,0.54)]',
      'grid min-h-[25.625rem] grid-rows-[150px_minmax(0,1fr)] overflow-hidden rounded-lg border',
      emphasisClass && 'transition-[filter,opacity] duration-200',
      emphasisClass,
      themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36',
    )}>
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
}

export function LlmTrainingComponents({ content, language, themeClasses }: {
  content: LlmTrainingComponentsContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <section className="grid gap-4">
      <div className="grid gap-1">
        <h2 className={cx('text-lg font-black leading-7', themeClasses.accentText)}>{text(content.title, language)}</h2>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.body, language)}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {content.cards.map((card, index) => (
          <TrainingComponentCard key={text(card.title, language)} card={card} index={index} language={language} themeClasses={themeClasses} focusPanel />
        ))}
      </div>
    </section>
  );
}

const TOKENIZER_MEMORY_ICONS = {
  flexible: Scissors,
  robust: Sparkles,
  efficient: SlidersHorizontal,
} satisfies Record<LlmTokenizerMemoryContent['cards'][number]['id'], LucideIcon>;

const TOKEN_CHIP_PALETTES = [
  ['bg-[#DCE8F4] text-[#205089]', 'bg-[#263B5B] text-[#BFD3F2]'],
  ['bg-[#DCEEE8] text-[#2E6B5D]', 'bg-[#21483F] text-[#BFE6D7]'],
  ['bg-[#F4E8C8] text-[#70551A]', 'bg-[#594821] text-[#F4E8C8]'],
] as const;

export function LlmTokenizerMemory({ content, language, themeClasses }: {
  content: LlmTokenizerMemoryContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <section className="grid gap-3 py-1 md:grid-cols-3">
      {content.cards.map((card) => {
        const Icon = TOKENIZER_MEMORY_ICONS[card.id];
        const tokens = card.example.split(' · ');
        const [top, icon] = {
          flexible: themeClasses.isLight ? ['bg-[#DCE8F4]', 'bg-white text-[#205089]'] : ['bg-[#263B5B]', 'bg-[#172A43] text-[#BFD3F2]'],
          robust: themeClasses.isLight ? ['bg-[#DCEEE8]', 'bg-white text-[#2E6B5D]'] : ['bg-[#21483F]', 'bg-[#122D29] text-[#BFE6D7]'],
          efficient: themeClasses.isLight ? ['bg-[#F4E8C8]', 'bg-white text-[#70551A]'] : ['bg-[#594821]', 'bg-[#2C2412] text-[#F4E8C8]'],
        }[card.id];
        return (
          <article key={card.id} className={cx(
            'grid min-h-[24rem] grid-rows-[132px_minmax(0,1fr)] overflow-hidden rounded-lg border',
            themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/16 bg-[#121A24]/36',
          )}>
            <div className={cx('grid place-items-center border-b border-black/5', top)}>
              <div className={cx('grid h-16 w-16 place-items-center rounded-2xl shadow-[0_10px_24px_rgba(32,80,137,0.10)]', icon)}>
                <Icon className="h-8 w-8" strokeWidth={1.8} aria-hidden="true" />
              </div>
            </div>
            <div className="grid content-start gap-3 p-4">
              <p className={cx('text-xs font-black uppercase tracking-[0.08em]', themeClasses.accentText)}>{text(card.cue, language)}</p>
              <h3 className={cx('text-base font-black leading-6', themeClasses.titleText)}>{text(card.title, language)}</h3>
              <div className="flex flex-wrap gap-1.5">
                {tokens.map((token, index) => {
                  const palette = TOKEN_CHIP_PALETTES[index % TOKEN_CHIP_PALETTES.length] ?? TOKEN_CHIP_PALETTES[0];
                  return <code key={`${token}-${index}`} className={cx('rounded-md px-2.5 py-1.5 text-sm font-black', themeClasses.isLight ? palette[0] : palette[1])}>{token}</code>;
                })}
              </div>
              <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(card.description, language)}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export function LlmTokenizerCodeStructure({ content, language, themeClasses }: {
  content: LlmTokenizerCodeStructureContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const comparisonItems = [
    {
      ...content.challenge,
      Icon: CircleAlert,
      tone: themeClasses.isLight
        ? 'border-[#E07A5F]/24 bg-[#FFF7F4] text-[#9A3F2B]'
        : 'border-[#F29A82]/22 bg-[#F29A82]/8 text-[#FFC3B4]',
      chip: themeClasses.isLight ? 'bg-[#FBE4DD] text-[#8B3524]' : 'bg-[#F29A82]/14 text-[#FFD1C5]',
    },
    {
      ...content.improvement,
      Icon: CheckCircle2,
      tone: themeClasses.isLight
        ? 'border-[#2F9D68]/22 bg-[#F1FBF6] text-[#176B45]'
        : 'border-[#74D99F]/22 bg-[#74D99F]/8 text-[#BCECCF]',
      chip: themeClasses.isLight ? 'bg-[#DDF4E8] text-[#176B45]' : 'bg-[#74D99F]/14 text-[#D2F5DF]',
    },
  ];

  return (
    <section className="grid gap-4">
      <p className={cx('w-full text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className={cx(
          'overflow-hidden rounded-lg border',
          themeClasses.isLight ? 'border-[#205089]/14 bg-[#10263E]' : 'border-[#A8B8C8]/18 bg-[#0B1724]',
        )}>
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[#D7E7F8]">
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.08em]">
              <Braces className="h-4 w-4 text-[#74D99F]" strokeWidth={1.8} aria-hidden="true" />
              Python
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#9EB4CA]">
              <CornerDownLeft className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
              {language === 'vi' ? 'Khoảng trắng là cấu trúc' : 'Whitespace is structure'}
            </span>
          </div>
          <pre className="overflow-x-auto p-4 text-[0.86rem] leading-7 text-[#E8F1FA] md:p-5 md:text-sm"><code>
            {content.code.map((line, index) => {
              const indentation = line.match(/^\s*/)?.[0].length ?? 0;
              const source = line.trimStart();
              return (
                <span key={`${line}-${index}`} className="block whitespace-pre">
                  <span className="mr-3 inline-block w-4 select-none text-right text-[#5E7891]">{index + 1}</span>
                  {indentation > 0 ? <span className="text-[#74D99F]">{'→'.repeat(indentation / 4)} </span> : null}
                  <span>{source}</span><span className="select-none text-[#5E7891]"> ↵</span>
                </span>
              );
            })}
          </code></pre>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {comparisonItems.map(({ Icon, body, chip, signals, title, tone }) => (
            <article key={text(title, language)} className={cx('grid content-start gap-3 rounded-lg border p-4', tone)}>
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 shrink-0" strokeWidth={1.9} aria-hidden="true" />
                <h3 className="text-sm font-black uppercase tracking-[0.06em]">{text(title, language)}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {signals.map((signal) => <code key={signal} className={cx('rounded-md px-2 py-1 text-xs font-black', chip)}>{signal}</code>)}
              </div>
              <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(body, language)}</p>
            </article>
          ))}
        </div>
      </div>

      <div className={cx(
        'flex gap-3 rounded-lg border px-4 py-3.5',
        themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF6FC]' : 'border-[#7FB0FF]/18 bg-[#7FB0FF]/8',
      )}>
        <Sparkles className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.takeaway, language)}</p>
      </div>
    </section>
  );
}

export function LlmTokenizerBoundaryMismatch({ content, language, themeClasses }: {
  content: LlmTokenizerBoundaryMismatchContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <section className="grid gap-4">
      <p className={cx('w-full text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className={cx('grid gap-4', content.examples.length > 1 ? 'lg:grid-cols-2' : 'grid-cols-1')}>
        {content.examples.map((example) => {
          const Icon = example.id === 'number' ? Type : Braces;
          return (
            <article key={example.id} className={cx(
              'overflow-hidden rounded-lg border',
              themeClasses.isLight ? 'border-[#205089]/14 bg-white' : 'border-[#A8B8C8]/16 bg-[#121A24]/36',
            )}>
              <div className={cx(
                'flex items-center justify-between gap-3 border-b px-4 py-3',
                themeClasses.isLight ? 'border-[#205089]/10 bg-[#EFF4FA]' : 'border-[#A8B8C8]/12 bg-[#263B5B]/55',
              )}>
                <span className="flex items-center gap-2">
                  <Icon className={cx('h-4 w-4', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
                  <span className={cx('text-xs font-black uppercase tracking-[0.08em]', themeClasses.mutedText)}>{example.id === 'number' ? 'Number' : 'Python'}</span>
                </span>
                <code className={cx('text-base font-black', themeClasses.titleText)}>{example.source}</code>
              </div>

              <div className="grid gap-0 sm:grid-cols-2">
                <div className={cx('grid content-start gap-3 p-4 sm:border-r', themeClasses.isLight ? 'border-[#205089]/10' : 'border-[#A8B8C8]/12')}>
                  <span className={cx('text-xs font-black uppercase tracking-[0.08em]', themeClasses.accentText)}>{text(example.humanLabel, language)}</span>
                  <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(example.humanMeaning, language)}</p>
                </div>
                <div className="grid content-start gap-3 p-4">
                  <span className={cx('text-xs font-black uppercase tracking-[0.08em]', themeClasses.mutedText)}>Tokenizer</span>
                  <div className="grid gap-2">
                    {example.tokenizations.map((tokens, rowIndex) => (
                      <div key={`${example.id}-${rowIndex}`} className="flex flex-wrap items-center gap-1">
                        {tokens.map((token, tokenIndex) => {
                          const palette = TOKEN_CHIP_PALETTES[tokenIndex % TOKEN_CHIP_PALETTES.length] ?? TOKEN_CHIP_PALETTES[0];
                          return <code key={`${token}-${tokenIndex}`} className={cx('rounded px-2 py-1 text-xs font-black', themeClasses.isLight ? palette[0] : palette[1])}>{token}</code>;
                        })}
                      </div>
                    ))}
                  </div>
                  <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(example.tokenizerMeaning, language)}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className={cx(
        'flex items-start gap-3 rounded-lg border px-4 py-3.5',
        themeClasses.isLight ? 'border-[#D29A22]/24 bg-[#FFF8E8]' : 'border-[#E3B64B]/20 bg-[#594821]/20',
      )}>
        <CircleAlert className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.isLight ? 'text-[#8A5A00]' : 'text-[#F4D98A]')} strokeWidth={1.8} aria-hidden="true" />
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.takeaway, language)}</p>
      </div>
    </section>
  );
}

export function LlmTokenizerFreeDirection({ content, language, themeClasses }: {
  content: LlmTokenizerFreeDirectionContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const approaches = [
    {
      ...content.subword,
      Icon: Database,
      eyebrow: language === 'vi' ? 'Hiện tại phổ biến' : 'Common today',
      palette: themeClasses.isLight
        ? 'border-[#205089]/16 bg-[#F7FAFD] text-[#205089]'
        : 'border-[#7FB0FF]/18 bg-[#7FB0FF]/7 text-[#CFE2F7]',
    },
    {
      ...content.direct,
      Icon: Cpu,
      eyebrow: language === 'vi' ? 'Hướng nghiên cứu' : 'Research direction',
      palette: themeClasses.isLight
        ? 'border-[#2F9D68]/18 bg-[#F3FBF7] text-[#176B45]'
        : 'border-[#74D99F]/20 bg-[#74D99F]/7 text-[#C8F0D8]',
    },
  ];

  return (
    <section className="grid gap-4">
      <p className={cx('w-full text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="grid items-stretch gap-3 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        {approaches.map(({ Icon, constraint, eyebrow, palette, sequence, strength, title }, index) => (
          <Fragment key={text(title, language)}>
            {index === 1 ? (
              <div className="hidden items-center md:flex" aria-hidden="true">
                <ArrowRight className={cx('h-5 w-5', themeClasses.mutedText)} strokeWidth={1.7} />
              </div>
            ) : null}
            <article className={cx('grid content-start gap-4 rounded-lg border p-4 md:p-5', palette)}>
              <div className="flex items-start justify-between gap-3">
                <div className="grid gap-1">
                  <span className="text-[0.68rem] font-black uppercase tracking-[0.09em] opacity-75">{eyebrow}</span>
                  <h3 className="text-base font-black leading-6">{text(title, language)}</h3>
                </div>
                <Icon className="h-6 w-6 shrink-0" strokeWidth={1.7} aria-hidden="true" />
              </div>
              <div className="flex min-h-16 flex-wrap content-center gap-1.5">
                {sequence.map((unit, unitIndex) => (
                  <code key={`${unit}-${unitIndex}`} className={cx(
                    'rounded-md px-2 py-1.5 text-xs font-black',
                    themeClasses.isLight ? 'bg-white/90 shadow-[inset_0_0_0_1px_rgba(32,80,137,0.10)]' : 'bg-[#0B1724]/55',
                  )}>{unit}</code>
                ))}
              </div>
              <div className="grid gap-2 border-t border-current/10 pt-3 text-sm leading-6">
                <p><span className="font-black">+</span> {text(strength, language)}</p>
                <p><span className="font-black">−</span> {text(constraint, language)}</p>
              </div>
            </article>
          </Fragment>
        ))}
      </div>

      <div className={cx(
        'flex items-start gap-3 rounded-lg border px-4 py-3.5',
        themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF6FC]' : 'border-[#7FB0FF]/18 bg-[#7FB0FF]/8',
      )}>
        <Sparkles className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.takeaway, language)}</p>
      </div>
    </section>
  );
}

export function LlmTokenizerVocabularyLookup({ content, language, themeClasses }: {
  content: LlmTokenizerVocabularyLookupContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <section className="grid gap-5">
      <p className={cx('w-full text-left text-base leading-7', themeClasses.bodyText)}>
        <strong className={cx('font-black', themeClasses.titleText)}>{language === 'vi' ? 'Vocabulary là bảng ánh xạ. ' : 'Vocabulary is a lookup table. '}</strong>
        {text(content.lead, language)}
      </p>
      <div className={cx('mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border p-4 sm:p-6', themeClasses.isLight ? 'border-[#205089]/14 bg-[#F7FAFD]' : 'border-[#A8B8C8]/16 bg-[#121A24]/36')}>
        <div className="mb-4 flex items-center justify-center gap-2">
          <Database className={cx('h-5 w-5', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
          <span className={cx('text-xs font-black uppercase tracking-[0.12em]', themeClasses.mutedText)}>Vocabulary</span>
        </div>
        <div className="grid gap-2.5">
          {content.entries.map((entry) => (
            <div key={`${entry.token}-${entry.id}`} className="grid grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] items-center gap-2">
              <code className={cx('justify-self-end rounded-lg px-3 py-2 text-sm font-black sm:min-w-28 sm:text-center', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{entry.token}</code>
              <div className={cx('flex items-center justify-center', themeClasses.accentText)} aria-hidden="true">
                <ArrowLeftRight className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <span className={cx('grid h-10 min-w-20 justify-self-start place-items-center rounded-lg px-3 text-sm font-black tabular-nums', themeClasses.isLight ? 'bg-[#FFF0CF] text-[#674518] ring-1 ring-[#C68A2E]/35' : 'bg-[#8B6734]/40 text-[#FFE5B4] ring-1 ring-[#FFE5B4]/20')}>{entry.id}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LlmTokenizerIdMisconceptions({ content, language, themeClasses }: {
  content: LlmTokenizerIdMisconceptionsContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <section className="grid gap-5">
      <p className={cx('mx-auto max-w-3xl text-center text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className={cx('relative mx-auto grid w-full max-w-4xl gap-5 overflow-hidden rounded-2xl border p-5 sm:p-7', themeClasses.isLight ? 'border-[#E07A5F]/20 bg-[#FFF9F6]' : 'border-[#F29A82]/18 bg-[#F29A82]/6')}>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {content.entries.map((entry, index) => (
            <Fragment key={`${entry.token}-${entry.id}`}>
              {index > 0 ? <span className={cx('text-xl font-black', themeClasses.mutedText)}>&lt;</span> : null}
              <div className="grid justify-items-center gap-2">
                <span className={cx('grid h-14 min-w-20 place-items-center rounded-xl px-3 text-lg font-black tabular-nums', themeClasses.isLight ? 'bg-[#FFF0CF] text-[#674518] ring-1 ring-[#C68A2E]/35' : 'bg-[#8B6734]/40 text-[#FFE5B4] ring-1 ring-[#FFE5B4]/20')}>{entry.id}</span>
                <code className={cx('rounded-md px-2 py-1 text-xs font-black', themeClasses.isLight ? 'bg-white text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{entry.token}</code>
              </div>
            </Fragment>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3" aria-hidden="true">
          <div className={cx('h-px w-24', themeClasses.isLight ? 'bg-[#B5523A]/35' : 'bg-[#F6A995]/35')} />
          <X className={cx('h-7 w-7', themeClasses.isLight ? 'text-[#B5523A]' : 'text-[#F6A995]')} strokeWidth={2.2} />
          <div className={cx('h-px w-24', themeClasses.isLight ? 'bg-[#B5523A]/35' : 'bg-[#F6A995]/35')} />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {content.nonMeanings.map((item) => (
            <div key={text(item, language)} className={cx('grid min-h-20 place-items-center rounded-xl border px-3 py-3 text-center', themeClasses.isLight ? 'border-[#E07A5F]/18 bg-white/80' : 'border-[#F29A82]/16 bg-[#121A24]/30')}>
              <X className={cx('mb-1 h-4 w-4', themeClasses.isLight ? 'text-[#B5523A]' : 'text-[#F6A995]')} strokeWidth={2} aria-hidden="true" />
              <span className={cx('text-xs font-bold leading-5', themeClasses.bodyText)}>{text(item, language)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={cx('mx-auto flex max-w-3xl items-start gap-3 rounded-lg border px-4 py-3.5', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF6FC]' : 'border-[#7FB0FF]/18 bg-[#7FB0FF]/8')}>
        <CircleAlert className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.takeaway, language)}</p>
      </div>
    </section>
  );
}

export function LlmTokenizerCodeToIds({ content, language, themeClasses }: {
  content: LlmTokenizerCodeToIdsContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const [answerVisibility, setAnswerVisibility] = useState<Record<string, boolean>>({});

  const renderVisual = (stage: LlmTokenizerCodeToIdsContent['stages'][number]) => {
    if (stage.id === 'load') {
      return (
        <div className="grid justify-items-center gap-3 text-center">
          <div className={cx('grid h-16 w-16 place-items-center rounded-2xl', themeClasses.isLight ? 'bg-[#EBD9E8] text-[#8D436F]' : 'bg-[#6C4B66]/65 text-[#F7DDF1]')}>
            <Database className="h-8 w-8" strokeWidth={1.7} aria-hidden="true" />
          </div>
          <div className="grid gap-1">
            <strong className={cx('text-base font-black', themeClasses.titleText)}>{content.tokenizerName}</strong>
            <span className={cx('text-xs font-semibold', themeClasses.mutedText)}>{text(content.tokenizerDescription, language)}</span>
          </div>
        </div>
      );
    }

    if (stage.id === 'input') {
      return (
        <div className="grid justify-items-center gap-3">
          <span className={cx('text-[0.68rem] font-black uppercase tracking-[0.1em]', themeClasses.mutedText)}>Raw text</span>
          <code className={cx('rounded-xl px-5 py-3 text-lg font-black', themeClasses.isLight ? 'bg-white text-[#263B5B] ring-1 ring-[#205089]/10' : 'bg-[#263B5B] text-[#E5EEF8]')}>{content.rawText}</code>
        </div>
      );
    }

    if (stage.id === 'encode') {
      return (
        <div className="grid w-full gap-3">
          <code className={cx('mx-auto rounded-lg px-4 py-2 text-sm font-black', themeClasses.isLight ? 'bg-white text-[#263B5B] ring-1 ring-[#205089]/10' : 'bg-[#263B5B] text-[#E5EEF8]')}>{content.rawText}</code>
          <ArrowDown className={cx('mx-auto h-5 w-5', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
          <div className="flex flex-wrap justify-center gap-2">
            {content.entries.map((entry) => (
              <div key={`${entry.token}-${entry.id}`} className="grid justify-items-center gap-1.5">
                <code className={cx('rounded-md px-2.5 py-1.5 text-xs font-black', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{entry.token}</code>
                <ArrowDown className={cx('h-3.5 w-3.5', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
                <span className={cx('grid min-w-12 place-items-center rounded-md px-2 py-1.5 text-xs font-black tabular-nums', themeClasses.isLight ? 'bg-[#FFF0CF] text-[#674518]' : 'bg-[#8B6734]/40 text-[#FFE5B4]')}>{entry.id}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="grid w-full gap-3">
        <div className={cx('rounded-lg border px-3 py-3', themeClasses.isLight ? 'border-[#205089]/10 bg-white' : 'border-[#A8B8C8]/12 bg-[#121A24]/35')}>
          <span className={cx('mb-2 block text-[0.65rem] font-black uppercase tracking-[0.1em]', themeClasses.mutedText)}>Tokens</span>
          <div className="flex flex-wrap gap-1.5">{content.entries.map((entry) => <code key={entry.token} className={cx('rounded px-2 py-1 text-xs font-black', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{entry.token}</code>)}</div>
        </div>
        <div className={cx('rounded-lg border px-3 py-3', themeClasses.isLight ? 'border-[#C68A2E]/16 bg-[#FFF9ED]' : 'border-[#FFE5B4]/14 bg-[#8B6734]/15')}>
          <span className={cx('mb-2 block text-[0.65rem] font-black uppercase tracking-[0.1em]', themeClasses.mutedText)}>Token IDs</span>
          <div className="flex flex-wrap gap-1.5">{content.entries.map((entry) => <span key={entry.id} className={cx('rounded px-2 py-1 text-xs font-black tabular-nums', themeClasses.isLight ? 'bg-[#FFF0CF] text-[#674518]' : 'bg-[#8B6734]/40 text-[#FFE5B4]')}>{entry.id}</span>)}</div>
        </div>
      </div>
    );
  };

  return (
    <section className="grid gap-5">
      <p className={cx('w-full text-base leading-7', themeClasses.bodyText)}>{renderTokenizerInlineCode(text(content.lead, language), themeClasses)}</p>
      {content.note ? (
        <blockquote className={cx(
          'flex items-start gap-3 rounded-lg border-l-4 px-4 py-3.5',
          themeClasses.isLight ? 'border-[#C68A2E] bg-[#FFF9ED]' : 'border-[#E1B866] bg-[#8B6734]/15',
        )}>
          <Info className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
          <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{renderTokenizerInlineCode(text(content.note, language), themeClasses)}</p>
        </blockquote>
      ) : null}
      <div className="grid gap-3">
        {content.stages.map((stage, index) => (
          <Fragment key={stage.id}>
            {index > 0 ? <ArrowDown className={cx('mx-auto h-5 w-5', themeClasses.mutedText)} strokeWidth={1.7} aria-hidden="true" /> : null}
            <article className={cx('overflow-hidden rounded-xl border', themeClasses.isLight ? 'border-[#205089]/14 bg-[#F7FAFD]' : 'border-[#A8B8C8]/16 bg-[#121A24]/36')}>
              <div className={cx('border-b px-4 py-2.5', themeClasses.isLight ? 'border-[#205089]/10 bg-[#EFF4FA]' : 'border-[#A8B8C8]/12 bg-[#263B5B]/45')}>
                <h3 className={cx('text-xs font-black uppercase tracking-[0.08em]', themeClasses.titleText)}>{text(stage.title, language)}</h3>
              </div>
              <div className="grid lg:grid-cols-2">
                <div className={cx('grid min-h-40 place-items-center p-5 lg:border-r', themeClasses.isLight ? 'border-[#205089]/10' : 'border-[#A8B8C8]/12')}>
                  {renderVisual(stage)}
                </div>
                <div className="grid min-w-0 content-center bg-[#10253A] text-[#E7EEF6] dark:bg-[#08121D]">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5 text-[#DCE8F4]">
                    <span className="flex items-center gap-2">
                      <Braces className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                      <span className="text-[0.65rem] font-black uppercase tracking-[0.09em]">Python</span>
                    </span>
                    {stage.answerCode?.length ? (
                      <button
                        type="button"
                        className="rounded-md border border-white/15 bg-white/[0.08] px-2.5 py-1 text-[0.68rem] font-black text-[#DCE8F4] transition-colors hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9CC7EF]"
                        aria-pressed={Boolean(answerVisibility[stage.id])}
                        onClick={() => setAnswerVisibility((current) => ({
                          ...current,
                          [stage.id]: !current[stage.id],
                        }))}
                      >
                        {answerVisibility[stage.id] ? (language === 'vi' ? 'Ẩn đáp án' : 'Hide answer') : (language === 'vi' ? 'Hiện đáp án' : 'Show answer')}
                      </button>
                    ) : null}
                  </div>
                  <pre className="overflow-x-auto px-4 py-4 text-[0.78rem] leading-5"><code>{(answerVisibility[stage.id] && stage.answerCode ? stage.answerCode : stage.code).map((line, lineIndex, lines) => (
                    <Fragment key={`${stage.id}-${lineIndex}`}>
                      <span className={line.trimStart().startsWith('#') ? 'text-[#86D99D]' : undefined}>{line || ' '}</span>
                      {lineIndex < lines.length - 1 ? '\n' : null}
                    </Fragment>
                  ))}</code></pre>
                  {stage.output?.length ? (
                    <div className="border-t border-white/10 bg-black/20 px-4 py-3">
                      <span className="mb-2 block text-[0.65rem] font-black uppercase tracking-[0.1em] text-[#8EABC5]">Output</span>
                      <pre className="overflow-x-auto text-[0.76rem] leading-5 text-[#B9E6C8]"><code>{stage.output.join('\n')}</code></pre>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          </Fragment>
        ))}
      </div>
      <div className={cx('flex items-start gap-3 rounded-lg border px-4 py-3.5', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF6FC]' : 'border-[#7FB0FF]/18 bg-[#7FB0FF]/8')}>
        <Database className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{renderTokenizerInlineCode(text(content.takeaway, language), themeClasses)}</p>
      </div>
    </section>
  );
}

export function LlmTokenizerOutputComparison({ content, language, themeClasses }: {
  content: LlmTokenizerOutputComparisonContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <section className="grid gap-5">
      <p className={cx('w-full text-base leading-7', themeClasses.bodyText)}>{renderTokenizerInlineCode(text(content.lead, language), themeClasses)}</p>
      <div className="grid justify-items-center gap-2">
        <span className={cx('text-[0.68rem] font-black uppercase tracking-[0.1em]', themeClasses.mutedText)}>Raw text</span>
        <code className={cx('rounded-xl px-5 py-3 text-lg font-black', themeClasses.isLight ? 'bg-white text-[#263B5B] ring-1 ring-[#205089]/10' : 'bg-[#263B5B] text-[#E5EEF8]')}>{content.rawText}</code>
      </div>
      <ArrowDown className={cx('mx-auto h-5 w-5', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        {content.examples.map((example) => {
          const isVietnamese = example.id === 'vietnamese';
          return (
            <article key={example.id} className={cx(
              'grid content-start gap-4 rounded-xl border p-4 sm:p-5',
              isVietnamese
                ? (themeClasses.isLight ? 'border-[#2F9D68]/20 bg-[#F3FBF7]' : 'border-[#74D99F]/20 bg-[#74D99F]/7')
                : (themeClasses.isLight ? 'border-[#205089]/14 bg-[#F7FAFD]' : 'border-[#7FB0FF]/18 bg-[#7FB0FF]/7'),
            )}>
              <div className="flex items-start justify-between gap-3">
                <div className="grid gap-1">
                  <h3 className={cx('text-base font-black', themeClasses.titleText)}>{example.name}</h3>
                  <p className={cx('text-xs font-semibold', themeClasses.mutedText)}>{text(example.description, language)}</p>
                </div>
                <span className={cx(
                  'shrink-0 rounded-full px-3 py-1.5 text-xs font-black tabular-nums',
                  isVietnamese
                    ? (themeClasses.isLight ? 'bg-[#D8F3E4] text-[#176B45]' : 'bg-[#74D99F]/18 text-[#C8F0D8]')
                    : (themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]'),
                )}>{example.tokens.length} tokens</span>
              </div>
              <div className="flex flex-wrap content-start gap-2">
                {example.tokens.map((token, index) => (
                  <div key={`${token}-${index}`} className={cx('grid overflow-hidden rounded-lg border', themeClasses.isLight ? 'border-black/8 bg-white' : 'border-white/10 bg-[#121A24]/35')}>
                    <code className={cx('px-2.5 py-1.5 text-center text-xs font-black', themeClasses.isLight ? 'text-[#205089]' : 'text-[#DCE8F4]')}>{token}</code>
                    <span className={cx('border-t px-2.5 py-1 text-center text-[0.65rem] font-black tabular-nums', themeClasses.isLight ? 'border-black/6 bg-[#FFF0CF] text-[#674518]' : 'border-white/8 bg-[#8B6734]/35 text-[#FFE5B4]')}>{example.ids[index]}</span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
      <div className={cx('flex items-start gap-3 rounded-lg border px-4 py-3.5', themeClasses.isLight ? 'border-[#8D436F]/16 bg-[#FAEFF6]' : 'border-[#D58AB5]/18 bg-[#6C4B66]/20')}>
        <Info className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{renderTokenizerInlineCode(text(content.markerNote, language), themeClasses)}</p>
      </div>
      <div className={cx('flex items-start gap-3 rounded-lg border px-4 py-3.5', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF6FC]' : 'border-[#7FB0FF]/18 bg-[#7FB0FF]/8')}>
        <Database className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.takeaway, language)}</p>
      </div>
    </section>
  );
}

export function LlmTokenizerIdRoundTrip({ content, language, themeClasses }: {
  content: LlmTokenizerIdRoundTripContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const inputTextRef = useRef<HTMLDivElement | null>(null);
  const tokenizerRef = useRef<HTMLDivElement | null>(null);
  const inputIdsRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const outputIdRef = useRef<HTMLDivElement | null>(null);
  const detokenizerRef = useRef<HTMLDivElement | null>(null);
  const outputTextRef = useRef<HTMLDivElement | null>(null);
  const vocabularyRef = useRef<HTMLDivElement | null>(null);
  const [connectorPaths, setConnectorPaths] = useState<{ flow: string[]; vocabulary: string[] }>({ flow: [], vocabulary: [] });

  useEffect(() => {
    const canvas = canvasRef.current;
    const elements = [inputTextRef.current, tokenizerRef.current, inputIdsRef.current, modelRef.current, outputIdRef.current, detokenizerRef.current, outputTextRef.current, vocabularyRef.current];
    if (!canvas || elements.some((element) => !element)) return;

    const [inputText, tokenizer, inputIds, model, outputId, detokenizer, outputText, vocabulary] = elements as HTMLDivElement[];
    const updateConnectors = () => {
      const canvasRect = canvas.getBoundingClientRect();
      const anchor = (element: HTMLDivElement, side: 'top' | 'right' | 'bottom' | 'left') => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 - canvasRect.left;
        const centerY = rect.top + rect.height / 2 - canvasRect.top;
        if (side === 'top') return { x: centerX, y: rect.top - canvasRect.top };
        if (side === 'right') return { x: rect.right - canvasRect.left, y: centerY };
        if (side === 'bottom') return { x: centerX, y: rect.bottom - canvasRect.top };
        return { x: rect.left - canvasRect.left, y: centerY };
      };
      const inputBottom = anchor(inputText, 'bottom');
      const tokenizerTop = anchor(tokenizer, 'top');
      const tokenizerRight = anchor(tokenizer, 'right');
      const inputIdsLeft = anchor(inputIds, 'left');
      const inputIdsRight = anchor(inputIds, 'right');
      const modelLeft = anchor(model, 'left');
      const modelRight = anchor(model, 'right');
      const outputIdLeft = anchor(outputId, 'left');
      const outputIdRight = anchor(outputId, 'right');
      const detokenizerLeft = anchor(detokenizer, 'left');
      const detokenizerBottom = anchor(detokenizer, 'bottom');
      const outputTop = anchor(outputText, 'top');
      const tokenizerBottom = anchor(tokenizer, 'bottom');
      const vocabularyLeft = anchor(vocabulary, 'left');
      const vocabularyRight = anchor(vocabulary, 'right');
      const detokenizerVocabulary = anchor(detokenizer, 'bottom');
      const tokenizerElbowY = tokenizerBottom.y + Math.max(28, (vocabularyLeft.y - tokenizerBottom.y) * 0.55);
      const detokenizerElbowY = detokenizerVocabulary.y + Math.max(28, (vocabularyRight.y - detokenizerVocabulary.y) * 0.55);

      setConnectorPaths({
        flow: [
          `M ${inputBottom.x} ${inputBottom.y} V ${tokenizerTop.y}`,
          `M ${tokenizerRight.x} ${tokenizerRight.y} H ${inputIdsLeft.x}`,
          `M ${inputIdsRight.x} ${inputIdsRight.y} H ${modelLeft.x}`,
          `M ${modelRight.x} ${modelRight.y} H ${outputIdLeft.x}`,
          `M ${outputIdRight.x} ${outputIdRight.y} H ${detokenizerLeft.x}`,
          `M ${detokenizerBottom.x} ${detokenizerBottom.y} V ${outputTop.y}`,
        ],
        vocabulary: [
          `M ${tokenizerBottom.x} ${tokenizerBottom.y} V ${tokenizerElbowY} H ${vocabularyLeft.x} V ${vocabularyLeft.y}`,
          `M ${detokenizerVocabulary.x} ${detokenizerVocabulary.y} V ${detokenizerElbowY} H ${vocabularyRight.x} V ${vocabularyRight.y}`,
        ],
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
    <section className="grid gap-4">
      <p className={cx('w-full text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="overflow-x-auto pb-2">
        <div ref={canvasRef} className={cx('relative h-[30rem] w-full min-w-[66rem] overflow-hidden rounded-xl border', themeClasses.isLight ? 'border-[#205089]/14 bg-gradient-to-br from-[#FBFDFE] to-[#205089]/[0.035]' : 'border-[#A8B8C8]/16 bg-gradient-to-br from-[#121A24]/45 to-[#205089]/[0.08]')}>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <marker id="token-round-trip-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={themeClasses.isLight ? '#205089' : '#A8B8C8'} />
              </marker>
            </defs>
            {connectorPaths.flow.map((path) => <path key={path} d={path} fill="none" stroke={themeClasses.isLight ? '#205089' : '#A8B8C8'} strokeWidth="2" markerEnd="url(#token-round-trip-arrow)" />)}
            {connectorPaths.vocabulary.map((path) => <path key={path} d={path} fill="none" stroke={themeClasses.isLight ? '#8D436F' : '#D58AB5'} strokeWidth="1.75" strokeDasharray="6 5" />)}
          </svg>

          <div ref={inputTextRef} className="absolute left-6 top-6 grid w-52 justify-items-center gap-2">
            <span className={cx('text-[0.68rem] font-black uppercase tracking-[0.08em]', themeClasses.mutedText)}>Input text</span>
            <code className={cx('rounded-lg px-4 py-2 text-base font-black', themeClasses.isLight ? 'bg-[#F3F6F9] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')}>{content.sourceText}</code>
          </div>

          <div ref={tokenizerRef} className={cx('absolute left-6 top-[10rem] grid w-52 justify-items-center gap-2 rounded-xl px-4 py-5', themeClasses.isLight ? 'bg-[#EBD9E8] text-[#56314F]' : 'bg-[#6C4B66]/65 text-[#F7DDF1]')}>
            <span className="text-base font-black">Tokenizer</span>
            <div className="flex flex-wrap justify-center gap-1">{content.tokens.map((token, index) => <code key={`${token}-${index}`} className="rounded bg-white/45 px-1.5 py-0.5 text-xs font-black">{token}</code>)}</div>
          </div>

          <div className="absolute left-[18rem] top-[8rem] grid w-20 justify-items-center gap-2">
            <span className={cx('text-center text-[0.68rem] font-black uppercase tracking-[0.08em]', themeClasses.mutedText)}>Token IDs</span>
            <div ref={inputIdsRef} className={cx('grid min-h-36 w-12 content-evenly justify-items-center rounded-lg py-2', themeClasses.isLight ? 'bg-[#F4E5EF]' : 'bg-[#6C4B66]/55')}>
              {content.ids.map((id) => <span key={id} className={cx('grid h-8 w-8 place-items-center rounded-full text-[0.65rem] font-black tabular-nums', themeClasses.isLight ? 'bg-[#F6CFE4] text-[#713255] ring-1 ring-[#8D436F]' : 'bg-[#D58AB5] text-[#2E1728] ring-1 ring-[#F4C8E1]/60')}>{id}</span>)}
            </div>
          </div>

          <div ref={modelRef} className={cx('absolute left-[42%] top-[7rem] grid h-40 w-36 place-items-center rounded-xl px-4 text-center', themeClasses.isLight ? 'bg-[#DDF2C7] text-[#29471E]' : 'bg-[#52723C]/60 text-[#E1F5D1]')}>
            <div className="grid justify-items-center gap-2"><Cpu className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" /><span className="text-base font-black">{text(content.modelLabel, language)}</span><span className="text-xs font-semibold">Forward</span></div>
          </div>

          <div className="absolute right-[18rem] top-[8rem] grid w-20 justify-items-center gap-2">
            <span className={cx('text-center text-[0.68rem] font-black uppercase tracking-[0.08em]', themeClasses.mutedText)}>{language === 'vi' ? 'ID được chọn' : 'Selected ID'}</span>
            <div ref={outputIdRef} className={cx('grid h-20 w-12 place-items-center rounded-lg', themeClasses.isLight ? 'bg-[#FFF0CF]' : 'bg-[#8B6734]/40')}><span className={cx('grid h-8 w-8 place-items-center rounded-full text-xs font-black', themeClasses.isLight ? 'bg-[#F4D8A4] text-[#674518] ring-1 ring-[#C68A2E]' : 'bg-[#C49250] text-[#21170A] ring-1 ring-[#FFE5B4]/60')}>{content.sampledTokenId}</span></div>
          </div>

          <div ref={detokenizerRef} className={cx('absolute right-6 top-[10rem] grid w-52 justify-items-center gap-2 rounded-xl px-4 py-5', themeClasses.isLight ? 'bg-[#EBD9E8] text-[#56314F]' : 'bg-[#6C4B66]/65 text-[#F7DDF1]')}>
            <span className="text-base font-black">Detokenizer</span>
            <code className="rounded bg-white/45 px-2 py-1 text-sm font-black">{content.sampledToken}</code>
          </div>

          <div ref={outputTextRef} className="absolute bottom-6 right-6 grid w-52 justify-items-center gap-2">
            <code className={cx('rounded-lg px-4 py-2 text-base font-black', themeClasses.isLight ? 'bg-[#F3F6F9] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')}>{content.outputText}</code>
            <span className={cx('text-[0.68rem] font-black uppercase tracking-[0.08em]', themeClasses.mutedText)}>Output text</span>
          </div>

          <div ref={vocabularyRef} className={cx('absolute bottom-6 left-1/2 grid w-60 -translate-x-1/2 justify-items-center gap-1 rounded-xl border px-4 py-3 text-center', themeClasses.isLight ? 'border-[#8D436F]/24 bg-[#FAEFF6] text-[#56314F]' : 'border-[#D58AB5]/24 bg-[#6C4B66]/30 text-[#F7DDF1]')}>
            <Database className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            <span className="text-sm font-black">Shared Vocabulary</span>
            <span className="text-xs font-semibold">token ↔ token ID</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LlmTokenizerSequenceLength({ content, language, themeClasses }: {
  content: LlmTokenizerSequenceLengthContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const tokenRow = (tokens: string[], compact = false) => (
    <div className="flex flex-wrap gap-1.5">
      {tokens.map((token, index) => {
        const palette = TOKEN_CHIP_PALETTES[index % TOKEN_CHIP_PALETTES.length] ?? TOKEN_CHIP_PALETTES[0];
        const isSpace = token === '␠';
        return <code key={`${token}-${index}`} aria-label={isSpace ? (language === 'vi' ? 'Khoảng trắng' : 'Space') : undefined} className={cx(
          'rounded-md font-black',
          compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm',
          isSpace ? 'w-7' : undefined,
          themeClasses.isLight ? palette[0] : palette[1],
        )}>{isSpace ? '' : token}</code>;
      })}
    </div>
  );

  return (
    <section className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-2">
        <article className={cx('grid gap-4 rounded-lg border p-4', themeClasses.isLight ? 'border-[#B57B1C]/20 bg-[#FFF9ED]' : 'border-[#E3B64B]/20 bg-[#594821]/20')}>
          <div className="flex items-center justify-between gap-3"><h2 className={cx('text-base font-black', themeClasses.titleText)}>Character-level</h2><span className="rounded-full bg-[#F4E8C8] px-3 py-1 text-xs font-black text-[#70551A]">{content.characterCount}</span></div>
          {tokenRow(content.characterTokens, true)}
          <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{language === 'vi' ? 'Mỗi ký tự trở thành một token, nên dãy nhanh chóng kéo dài.' : 'Each character becomes a token, so the sequence grows quickly.'}</p>
        </article>
        <article className={cx('grid gap-4 rounded-lg border p-4', themeClasses.isLight ? 'border-[#205089]/20 bg-[#EFF4FA]' : 'border-[#BFD3F2]/20 bg-[#263B5B]/45')}>
          <div className="flex items-center justify-between gap-3"><h2 className={cx('text-base font-black', themeClasses.titleText)}>Subword</h2><span className="rounded-full bg-[#DCE8F4] px-3 py-1 text-xs font-black text-[#205089]">{content.subwordCount}</span></div>
          {tokenRow(content.subwordTokens)}
          <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{language === 'vi' ? 'Nhóm chuỗi con phổ biến để giữ dãy ngắn hơn.' : 'Groups common substrings to keep the sequence shorter.'}</p>
        </article>
      </div>
      <p className={cx('text-sm leading-7', themeClasses.bodyText)}>{text(content.takeaway, language)}</p>
    </section>
  );
}

export function LlmTokenizerRegexWalkthrough({ content, language, themeClasses }: {
  content: LlmTokenizerRegexWalkthroughContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const punctuationTokens = new Set([',', '.', ':', ';', '?', '!', '"', '(', ')', '--']);
  return (
    <section className="grid gap-5">
      <p className={cx('w-full text-base leading-7', themeClasses.bodyText)}>{renderTokenizerInlineCode(text(content.lead, language), themeClasses)}</p>
      {content.diagram ? (
        <div className="overflow-x-auto pb-1">
          <div className={cx('grid min-w-[54rem] justify-items-center gap-3 rounded-xl border px-6 py-5', themeClasses.isLight ? 'border-[#205089]/12 bg-gradient-to-b from-white to-[#F6FAFD]' : 'border-[#A8B8C8]/14 bg-gradient-to-b from-[#121A24]/46 to-[#0B1724]/28')}>
            <div className="grid justify-items-center gap-2">
              <span className={cx('text-xs font-black', themeClasses.mutedText)}>{language === 'vi' ? 'Văn bản đầu vào' : 'Input text'}</span>
              <code className={cx('w-fit rounded-lg border px-4 py-2.5 text-sm font-bold shadow-sm', themeClasses.isLight ? 'border-[#205089]/18 bg-white text-[#172A43]' : 'border-[#A8B8C8]/20 bg-[#0B1724]/62 text-[#E5EEF8]')}>{content.diagram.inputText}</code>
            </div>
            <div className={cx('grid h-9 w-9 place-items-center rounded-full', themeClasses.isLight ? 'bg-[#E6F0F8] text-[#205089]' : 'bg-[#263B5B] text-[#CFE2F7]')} aria-hidden="true">
              <ArrowDown className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="grid justify-items-center gap-2">
              <span className={cx('text-xs font-black', themeClasses.mutedText)}>{text(content.diagram.outputLabel, language)}</span>
              <div className="flex flex-nowrap justify-center gap-1.5">
                {content.diagram.tokens.map((token, index) => {
                  const isWhitespace = token === ' ';
                  const isEmpty = token === '';
                  const isPunctuation = punctuationTokens.has(token);
                  return <code key={`${token}-${index}`} className={cx(
                    'grid min-h-9 min-w-9 place-items-center rounded-md border px-2.5 py-1 text-sm font-bold shadow-sm',
                    isWhitespace
                      ? (themeClasses.isLight ? 'border-[#6B7F91]/20 bg-[#F1F4F6] text-[#607283]' : 'border-[#A8B8C8]/16 bg-[#A8B8C8]/8 text-[#A8B8C8]')
                      : isEmpty
                      ? (themeClasses.isLight ? 'border-[#B5523A]/22 bg-[#FFF1ED] text-[#9A3F2B]' : 'border-[#F29A82]/20 bg-[#F29A82]/10 text-[#FFC3B4]')
                      : isPunctuation
                      ? (themeClasses.isLight ? 'border-[#C68A2E]/28 bg-[#FFF4DD] text-[#674518]' : 'border-[#F4D8A4]/22 bg-[#8B6734]/34 text-[#FFE5B4]')
                      : (themeClasses.isLight ? 'border-[#205089]/16 bg-[#EDF5FB] text-[#173F69]' : 'border-[#7FB0FF]/18 bg-[#263B5B]/70 text-[#DCE8F4]'),
                  )}>{isWhitespace ? '␠' : isEmpty ? "''" : token}</code>;
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <div className="min-w-0 overflow-hidden rounded-xl bg-[#0B1220] shadow-[inset_0_0_0_1px_rgba(168,184,200,0.18)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F29A82]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#F4D8A4]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#74D99F]" />
            <span className="ml-2 text-[0.68rem] font-black uppercase tracking-[0.08em] text-[#A8B8C8]">Python</span>
          </div>
          <pre className="overflow-x-auto p-4 text-[0.82rem] leading-7 text-[#E8F1FA] md:p-5 md:text-sm"><code>{content.code.map((line, index) => <span key={`${index}-${line}`} className="block"><span className="mr-4 inline-block w-5 select-none text-right text-[#59708A]">{index + 1}</span>{line || ' '}</span>)}</code></pre>
          <div className="border-y border-white/10 bg-white/[0.035] px-4 py-2.5 text-[0.68rem] font-black uppercase tracking-[0.08em] text-[#A8B8C8]">Output</div>
          <pre className="min-w-0 overflow-x-auto whitespace-pre-wrap break-words p-4 text-xs leading-6 text-[#CFE2F7] md:p-5 md:text-[0.82rem]"><code>{content.output.join('\n')}</code></pre>
      </div>
      <div className={cx('flex gap-3 rounded-lg border px-4 py-3.5', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF6FC]' : 'border-[#7FB0FF]/18 bg-[#7FB0FF]/8')}>
        <Info className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{renderTokenizerInlineCode(text(content.takeaway, language), themeClasses)}</p>
      </div>
    </section>
  );
}

export function LlmTokenizerMergeTraining({ content, language, themeClasses }: {
  content: LlmTokenizerMergeTrainingContent;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const totalMerges = content.merges.length;
  const [completedMerges, setCompletedMerges] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeMerge = content.merges[completedMerges];

  type TokenSegment = { token: string; sourceIndexes: number[] };
  const applyMerge = (tokens: TokenSegment[], merge: LlmTokenizerMergeTrainingContent['merges'][number]) => {
    const sourcePairs = Array.from({ length: merge.sourceIndexes.length / 2 }, (_, index) => [merge.sourceIndexes[index * 2], merge.sourceIndexes[index * 2 + 1]] as const);
    const mergedTokens: TokenSegment[] = [];
    for (let index = 0; index < tokens.length; index += 1) {
      const current = tokens[index];
      const next = tokens[index + 1];
      const sourcePair = sourcePairs.find(([leftIndex, rightIndex]) => current?.sourceIndexes.includes(leftIndex) && next?.sourceIndexes.includes(rightIndex));
      if (current && next && sourcePair) {
        mergedTokens.push({ token: merge.result, sourceIndexes: [...current.sourceIndexes, ...next.sourceIndexes] });
        index += 1;
      } else if (tokens[index]) {
        mergedTokens.push(tokens[index]);
      }
    }
    return mergedTokens;
  };
  const tokensAfter = (mergeCount: number) => content.merges.slice(0, mergeCount).reduce(
    (tokens, merge) => applyMerge(tokens, merge),
    content.initialTokens.map((token, index) => ({ token, sourceIndexes: [index] })),
  );
  const currentTokens = tokensAfter(completedMerges);
  const activePairs = activeMerge
    ? Array.from({ length: activeMerge.sourceIndexes.length / 2 }, (_, index) => [activeMerge.sourceIndexes[index * 2], activeMerge.sourceIndexes[index * 2 + 1]] as const)
    : [];

  useEffect(() => {
    if (!isPlaying) return;
    if (completedMerges >= totalMerges) {
      setIsPlaying(false);
      return;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setCompletedMerges((current) => Math.min(current + 1, totalMerges));
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [completedMerges, isPlaying, totalMerges]);

  const tokenChips = (tokens: TokenSegment[], highlight: 'source' | 'merged' | undefined = undefined) => (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token, tokenIndex) => {
        const palette = TOKEN_CHIP_PALETTES[tokenIndex % TOKEN_CHIP_PALETTES.length] ?? TOKEN_CHIP_PALETTES[0];
        const isSpace = token.token === '␠';
        const endsFirstLine = isSpace && token.sourceIndexes.includes(10);
        const isActiveMerge = highlight === 'merged' && activePairs.some(([leftIndex, rightIndex]) => token.sourceIndexes.includes(leftIndex) && token.sourceIndexes.includes(rightIndex));
        const isActiveSource = highlight === 'source' && activeMerge?.sourceIndexes.some((sourceIndex) => token.sourceIndexes.includes(sourceIndex));
        const isHighlighted = isActiveMerge || isActiveSource;
        return <Fragment key={`${token.token}-${tokenIndex}`}>
          <code aria-label={isSpace ? (language === 'vi' ? 'Khoảng trắng' : 'Space') : undefined} className={cx(
            'inline-block rounded-md py-2 text-2xl font-black',
            isSpace ? 'w-10 px-0' : 'px-4',
            themeClasses.isLight ? palette[0] : palette[1],
            isHighlighted && (themeClasses.isLight
              ? 'learning-bpe-merged-token ring-2 ring-[#D29A22] ring-offset-2 ring-offset-white'
              : 'learning-bpe-merged-token ring-2 ring-[#E3B64B] ring-offset-2 ring-offset-[#121A24]'),
          )}>{isSpace ? '' : token.token}</code>
          {endsFirstLine && <span className="basis-full" aria-hidden="true" />}
        </Fragment>;
      })}
    </div>
  );

  return (
    <section className="grid gap-4">
      <code className={cx('w-fit rounded-md px-3 py-2 text-sm font-black', themeClasses.isLight ? 'bg-[#EFF4FA] text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]')}>
        {content.example}
      </code>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className={cx('text-sm font-black tabular-nums', themeClasses.mutedText)}>
          {activeMerge
            ? (language === 'vi' ? `Merge ${completedMerges + 1}/${totalMerges}` : `Merge ${completedMerges + 1}/${totalMerges}`)
            : (language === 'vi' ? 'Đã hoàn tất' : 'Complete')}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" disabled={completedMerges === 0} onClick={() => { setIsPlaying(false); setCompletedMerges((current) => Math.max(current - 1, 0)); }} className={cx('grid h-9 w-9 place-items-center rounded-lg disabled:cursor-not-allowed disabled:opacity-40', themeClasses.focusRing, themeClasses.isLight ? 'bg-[#EEF2F6] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')} aria-label={language === 'vi' ? 'Merge trước' : 'Previous merge'}><ChevronLeft className="h-4 w-4" aria-hidden="true" /></button>
          <button type="button" onClick={() => { if (isPlaying) setIsPlaying(false); else { if (completedMerges >= totalMerges) setCompletedMerges(0); setIsPlaying(true); } }} className={cx('flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-black', themeClasses.focusRing, themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#A8B8C8] text-[#121A24]')}>
            {isPlaying ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            {isPlaying ? (language === 'vi' ? 'Tạm dừng' : 'Pause') : (language === 'vi' ? 'Phát' : 'Play')}
          </button>
          <button type="button" disabled={completedMerges >= totalMerges} onClick={() => { setIsPlaying(false); setCompletedMerges((current) => Math.min(current + 1, totalMerges)); }} className={cx('grid h-9 w-9 place-items-center rounded-lg disabled:cursor-not-allowed disabled:opacity-40', themeClasses.focusRing, themeClasses.isLight ? 'bg-[#EEF2F6] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')} aria-label={language === 'vi' ? 'Merge tiếp theo' : 'Next merge'}><ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
          <button type="button" onClick={() => { setCompletedMerges(0); setIsPlaying(false); }} className={cx('grid h-9 w-9 place-items-center rounded-lg', themeClasses.focusRing, themeClasses.isLight ? 'bg-[#EEF2F6] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')} aria-label={language === 'vi' ? 'Đặt lại' : 'Reset'}><RotateCcw className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      </div>
      <article className={cx('learning-lab-focus-panel min-h-72 rounded-lg border p-5', themeClasses.isLight ? 'border-[#205089]/20 bg-white' : 'border-[#A8B8C8]/24 bg-[#121A24]/48')}>
        <div key={`tokens-${completedMerges}`}>{tokenChips(currentTokens, activeMerge ? 'source' : undefined)}</div>
      </article>
      <p className={cx('rounded-lg px-4 py-3 text-sm font-semibold leading-6', themeClasses.isLight ? 'bg-[#EFF4FA] text-[#205089]' : 'bg-[#263B5B]/55 text-[#DCE8F4]')}>
        {text(content.result, language)}
      </p>
      <a href={content.playgroundUrl} target="_blank" rel="noreferrer" className={cx('w-fit text-sm font-black underline underline-offset-4', themeClasses.focusRing, themeClasses.accentText)}>
        {language === 'vi' ? 'Mở tokenizer playground ↗' : 'Open tokenizer playground ↗'}
      </a>
    </section>
  );
}

export function LlmAcademiaIndustryComparison({ content, perspective, language, themeClasses }: {
  content: LlmAcademiaIndustryComparisonContent;
  perspective: 'academia' | 'industry';
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
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
          const isEmphasized = perspective === 'academia' ? index < 2 : index >= 2;
          return (
            <TrainingComponentCard
              key={text(card.title, language)}
              card={card}
              index={index}
              language={language}
              themeClasses={themeClasses}
              emphasisClass={isEmphasized ? 'opacity-100 saturate-100' : 'opacity-45 saturate-[0.72]'}
            />
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
      /* Raw edge X positions across the flow */
      const elEdge = (el: HTMLDivElement, side: 'left' | 'right') => {
        const rect = el.getBoundingClientRect();
        return (side === 'left' ? rect.left : rect.right) - canvasRect.left;
      };
      const elCenterY = (el: HTMLDivElement) => {
        const rect = el.getBoundingClientRect();
        return rect.top + rect.height / 2 - canvasRect.top;
      };
      const elTop = (el: HTMLDivElement) => el.getBoundingClientRect().top - canvasRect.top;
      const elBottom = (el: HTMLDivElement) => el.getBoundingClientRect().bottom - canvasRect.top;
      const elCenterX = (el: HTMLDivElement) => {
        const rect = el.getBoundingClientRect();
        return rect.left + rect.width / 2 - canvasRect.left;
      };

      const tokenizerR = elEdge(tokenizer, 'right');
      const tokenIdsL = elEdge(tokenIds, 'left');
      const tokenIdsR = elEdge(tokenIds, 'right');
      const modelL = elEdge(model, 'left');
      const modelR = elEdge(model, 'right');
      const modelCY = elCenterY(model);
      const distributionL = elEdge(distribution, 'left');
      const distributionB = elBottom(distribution);
      const containerT = elTop(container);
      const containerB = elBottom(container);
      const containerCX = elCenterX(container);
      const detokenizeCX = elCenterX(detokenize);
      const inputCX = elCenterX(inputEl);
      const inputB = elBottom(inputEl);

      /* All horizontal connectors run at the common center Y */
      const flowY = modelCY;

      setConnectorPaths([
        /* 0: Tokenizer → Token IDs (straight horizontal) */
        `M ${tokenizerR} ${flowY} H ${tokenIdsL}`,
        /* 1: Token IDs → Model (straight horizontal) */
        `M ${tokenIdsR} ${flowY} H ${modelL}`,
        /* 2: Model → Distribution (straight horizontal) */
        `M ${modelR} ${flowY} H ${distributionL}`,
        /* 3: Distribution → Container (vertical down, center-aligned) */
        `M ${containerCX} ${distributionB} V ${containerT}`,
        /* 4: Autoregressive feedback loop: container bottom → input bottom */
        `M ${detokenizeCX} ${containerB} Q ${(detokenizeCX + inputCX) / 2} ${containerB + 48}, ${inputCX} ${inputB}`,
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
              <marker id="ar-loop-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={themeClasses.isLight ? '#205089' : '#A8B8C8'} />
              </marker>
            </defs>
            {connectorPaths.map((path, index) => {
              const isLoop = index === connectorPaths.length - 1;
              return (
                <path
                  key={path}
                  d={path}
                  fill="none"
                  stroke={themeClasses.isLight ? '#205089' : '#A8B8C8'}
                  strokeWidth={isLoop ? 1.5 : 2}
                  strokeDasharray={isLoop ? '5 4' : 'none'}
                  markerEnd={isLoop ? 'url(#ar-loop-arrow)' : 'url(#ar-pipeline-arrow)'}
                  className={cx('transition-opacity duration-200', isLoop ? connectorTone(4) : connectorTone(index))}
                />
              );
            })}
          </svg>

          <div ref={inputRef} className={cx('absolute left-7 top-[16rem] grid w-[13.5rem] justify-items-center gap-2', stageTone(0))}>
            <ArrowDown className={cx('h-4 w-4 rotate-180', themeClasses.mutedText)} strokeWidth={1.6} aria-hidden="true" />
            <p className={cx('rounded-lg px-4 py-2 text-center text-base font-black', themeClasses.isLight ? 'bg-[#F3F6F9] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')}>{content.inputText}</p>
            <div className={cx('text-xs font-semibold', themeClasses.mutedText)}>Câu đầu vào</div>
          </div>

          <div className={cx('absolute left-5 top-[8.6rem] w-[13.5rem]', stageTone(0))}>
            <div ref={tokenizerRef} className={cx('rounded-xl px-4 py-6 text-center text-lg font-black', themeClasses.isLight ? 'bg-[#EBD9E8] text-[#56314F]' : 'bg-[#6C4B66]/55 text-[#F7DDF1]')}>Tokenizer</div>
          </div>

          <div className={cx('absolute left-[18rem] top-[5.75rem] grid w-16 justify-items-center gap-2', stageTone(0))}>
            <div className={cx('text-center text-[0.65rem] font-black uppercase tracking-wide', themeClasses.mutedText)}>Token IDs</div>
            <div ref={tokenIdsRef} className={cx('grid h-32 w-10 content-evenly justify-items-center rounded-lg', themeClasses.isLight ? 'bg-[#F4E5EF]' : 'bg-[#6C4B66]/55')}>
              {content.tokenIds.map((tokenId) => (
                <span key={tokenId} className={cx('grid h-6 w-6 place-items-center rounded-full text-xs font-black tabular-nums', themeClasses.isLight ? 'bg-[#F6CFE4] text-[#713255] ring-1 ring-[#8D436F]' : 'bg-[#D58AB5] text-[#2E1728] ring-1 ring-[#F4C8E1]/60')}>{tokenId}</span>
              ))}
            </div>
          </div>

          <div ref={modelRef} className={cx('absolute left-[42%] top-[5rem] grid h-48 w-32 place-items-center rounded-xl px-4 py-5 text-center', stageTone(1), themeClasses.isLight ? 'bg-[#DDF2C7] text-[#29471E]' : 'bg-[#52723C]/55 text-[#E1F5D1]')}>
            <div>
              <div className="text-base font-black">{text(content.modelLabel, language)}</div>
              <div className="mt-2 text-xs font-semibold leading-5">Forward</div>
            </div>
          </div>

          <div ref={distributionRef} className={cx('absolute right-4 top-[6.3rem] grid w-[clamp(17rem,25%,24rem)] gap-3', stageTone(2))}>
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
  const palette = getFocusCardPalette(themeClasses, toneIndex);
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

function getFocusCardPalette(themeClasses: ReturnType<typeof getLearningLabTheme>, toneIndex: number) {
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
  const palette = getFocusCardPalette(themeClasses, tone === 'pretrain' ? 0 : 3);

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
  const palette = getFocusCardPalette(themeClasses, [0, 3, 2][toneIndex % 3]!);

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

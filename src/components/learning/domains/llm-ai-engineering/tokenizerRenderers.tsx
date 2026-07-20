import { ArrowDown, ArrowLeftRight, ArrowRight, Braces, CheckCircle2, CircleAlert, CornerDownLeft, Cpu, Database, Info, Scissors, SlidersHorizontal, Sparkles, Type, type LucideIcon, X } from 'lucide-react';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { cx, getLearningLabTheme } from '../../theme';
import { getLearningLocalizedText as text } from '../../learningText';
import { DiagramConnectorLayer, getDiagramAnchor, observeDiagramLayout } from './diagramPrimitives';
import { LlmCallout, StepPlaybackControls, TokenChip, TokenIdBadge } from './rendererPrimitives';
import { getLlmRendererTheme } from './rendererTheme';
import type {
  LlmContentRendererProps,
  LlmTokenizerBoundaryMismatchContent,
  LlmTokenizerCodeStructureContent,
  LlmTokenizerCodeToIdsContent,
  LlmTokenizerFreeDirectionContent,
  LlmTokenizerIdMisconceptionsContent,
  LlmTokenizerIdRoundTripContent,
  LlmTokenizerMemoryContent,
  LlmTokenizerMergeTrainingContent,
  LlmTokenizerOutputComparisonContent,
  LlmTokenizerRegexWalkthroughContent,
  LlmTokenizerSequenceLengthContent,
  LlmTokenizerVocabularyLookupContent,
} from './rendererTypes';

function renderTokenizerInlineCode(value: string, themeClasses: ReturnType<typeof getLearningLabTheme>): ReactNode {
  return value.split(/(`[^`]+`)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`${index}-${part}`} className={cx('rounded px-1.5 py-0.5 font-mono text-[0.88em] font-semibold', themeClasses.isLight ? 'bg-[#E8EEF5] text-[#123B68]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{part.slice(1, -1)}</code>;
    }
    return <span key={`${index}-${part}`}>{part}</span>;
  });
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

export function LlmTokenizerMemory({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerMemoryContent>) {
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

export function LlmTokenizerCodeStructure({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerCodeStructureContent>) {
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

export function LlmTokenizerBoundaryMismatch({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerBoundaryMismatchContent>) {
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

export function LlmTokenizerFreeDirection({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerFreeDirectionContent>) {
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

export function LlmTokenizerVocabularyLookup({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerVocabularyLookupContent>) {
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
              <TokenChip className="justify-self-end rounded-lg px-3 py-2 text-sm font-black sm:min-w-28 sm:text-center" themeClasses={themeClasses}>{entry.token}</TokenChip>
              <div className={cx('flex items-center justify-center', themeClasses.accentText)} aria-hidden="true">
                <ArrowLeftRight className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <TokenIdBadge className={cx('grid h-10 min-w-20 justify-self-start place-items-center rounded-lg px-3 text-sm font-black tabular-nums', themeClasses.isLight ? 'ring-1 ring-[#C68A2E]/35' : 'ring-1 ring-[#FFE5B4]/20')} themeClasses={themeClasses}>{entry.id}</TokenIdBadge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LlmTokenizerIdMisconceptions({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerIdMisconceptionsContent>) {
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
      <LlmCallout className="mx-auto max-w-3xl" icon={CircleAlert} themeClasses={themeClasses}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.takeaway, language)}</p>
      </LlmCallout>
    </section>
  );
}

export function LlmTokenizerCodeToIds({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerCodeToIdsContent>) {
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
                <TokenChip className="rounded-md px-2.5 py-1.5 text-xs font-black" themeClasses={themeClasses}>{entry.token}</TokenChip>
                <ArrowDown className={cx('h-3.5 w-3.5', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
                <TokenIdBadge className="grid min-w-12 place-items-center rounded-md px-2 py-1.5 text-xs font-black tabular-nums" themeClasses={themeClasses}>{entry.id}</TokenIdBadge>
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
          <div className="flex flex-wrap gap-1.5">{content.entries.map((entry) => <TokenChip key={entry.token} className="rounded px-2 py-1 text-xs font-black" themeClasses={themeClasses}>{entry.token}</TokenChip>)}</div>
        </div>
        <div className={cx('rounded-lg border px-3 py-3', themeClasses.isLight ? 'border-[#C68A2E]/16 bg-[#FFF9ED]' : 'border-[#FFE5B4]/14 bg-[#8B6734]/15')}>
          <span className={cx('mb-2 block text-[0.65rem] font-black uppercase tracking-[0.1em]', themeClasses.mutedText)}>Token IDs</span>
          <div className="flex flex-wrap gap-1.5">{content.entries.map((entry) => <TokenIdBadge key={entry.id} className="rounded px-2 py-1 text-xs font-black tabular-nums" themeClasses={themeClasses}>{entry.id}</TokenIdBadge>)}</div>
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

export function LlmTokenizerOutputComparison({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerOutputComparisonContent>) {
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
      <LlmCallout icon={Info} themeClasses={themeClasses} tone="accent">
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{renderTokenizerInlineCode(text(content.markerNote, language), themeClasses)}</p>
      </LlmCallout>
      <div className={cx('flex items-start gap-3 rounded-lg border px-4 py-3.5', themeClasses.isLight ? 'border-[#205089]/14 bg-[#EFF6FC]' : 'border-[#7FB0FF]/18 bg-[#7FB0FF]/8')}>
        <Database className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.takeaway, language)}</p>
      </div>
    </section>
  );
}

export function LlmTokenizerIdRoundTrip({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerIdRoundTripContent>) {
  const llmTheme = getLlmRendererTheme(themeClasses);
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
      const inputAnchor = getDiagramAnchor(inputText, canvasRect);
      const tokenizerAnchor = getDiagramAnchor(tokenizer, canvasRect);
      const inputIdsAnchor = getDiagramAnchor(inputIds, canvasRect);
      const modelAnchor = getDiagramAnchor(model, canvasRect);
      const outputIdAnchor = getDiagramAnchor(outputId, canvasRect);
      const detokenizerAnchor = getDiagramAnchor(detokenizer, canvasRect);
      const outputAnchor = getDiagramAnchor(outputText, canvasRect);
      const vocabularyAnchor = getDiagramAnchor(vocabulary, canvasRect);
      const tokenizerElbowY = tokenizerAnchor.bottom + Math.max(28, (vocabularyAnchor.centerY - tokenizerAnchor.bottom) * 0.55);
      const detokenizerElbowY = detokenizerAnchor.bottom + Math.max(28, (vocabularyAnchor.centerY - detokenizerAnchor.bottom) * 0.55);

      setConnectorPaths({
        flow: [
          `M ${inputAnchor.centerX} ${inputAnchor.bottom} V ${tokenizerAnchor.top}`,
          `M ${tokenizerAnchor.right} ${tokenizerAnchor.centerY} H ${inputIdsAnchor.left}`,
          `M ${inputIdsAnchor.right} ${inputIdsAnchor.centerY} H ${modelAnchor.left}`,
          `M ${modelAnchor.right} ${modelAnchor.centerY} H ${outputIdAnchor.left}`,
          `M ${outputIdAnchor.right} ${outputIdAnchor.centerY} H ${detokenizerAnchor.left}`,
          `M ${detokenizerAnchor.centerX} ${detokenizerAnchor.bottom} V ${outputAnchor.top}`,
        ],
        vocabulary: [
          `M ${tokenizerAnchor.centerX} ${tokenizerAnchor.bottom} V ${tokenizerElbowY} H ${vocabularyAnchor.left} V ${vocabularyAnchor.centerY}`,
          `M ${detokenizerAnchor.centerX} ${detokenizerAnchor.bottom} V ${detokenizerElbowY} H ${vocabularyAnchor.right} V ${vocabularyAnchor.centerY}`,
        ],
      });
    };

    return observeDiagramLayout(canvas, elements as HTMLDivElement[], updateConnectors);
  }, []);

  return (
    <section className="grid gap-4">
      <p className={cx('w-full text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="overflow-x-auto pb-2">
        <div ref={canvasRef} className={cx('relative h-[30rem] w-full min-w-[66rem] overflow-hidden rounded-xl border', themeClasses.isLight ? 'border-[#205089]/14 bg-gradient-to-br from-[#FBFDFE] to-[#205089]/[0.035]' : 'border-[#A8B8C8]/16 bg-gradient-to-br from-[#121A24]/45 to-[#205089]/[0.08]')}>
          <DiagramConnectorLayer
            color={llmTheme.connector}
            markerId="token-round-trip-arrow"
            paths={[
              ...connectorPaths.flow.map((d) => ({ d })),
              ...connectorPaths.vocabulary.map((d) => ({ d, markerEnd: false, stroke: themeClasses.isLight ? '#8D436F' : '#D58AB5', strokeDasharray: '6 5', strokeWidth: 1.75 })),
            ]}
          />

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

export function LlmTokenizerSequenceLength({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerSequenceLengthContent>) {
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

export function LlmTokenizerRegexWalkthrough({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerRegexWalkthroughContent>) {
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
      <LlmCallout icon={Info} themeClasses={themeClasses}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{renderTokenizerInlineCode(text(content.takeaway, language), themeClasses)}</p>
      </LlmCallout>
    </section>
  );
}

export function LlmTokenizerMergeTraining({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerMergeTrainingContent>) {
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
        <StepPlaybackControls
          isPlaying={isPlaying}
          labels={{
            next: language === 'vi' ? 'Merge tiếp theo' : 'Next merge',
            pause: language === 'vi' ? 'Tạm dừng' : 'Pause',
            play: language === 'vi' ? 'Phát' : 'Play',
            previous: language === 'vi' ? 'Merge trước' : 'Previous merge',
            reset: language === 'vi' ? 'Đặt lại' : 'Reset',
          }}
          nextDisabled={completedMerges >= totalMerges}
          onNext={() => { setIsPlaying(false); setCompletedMerges((current) => Math.min(current + 1, totalMerges)); }}
          onPrevious={() => { setIsPlaying(false); setCompletedMerges((current) => Math.max(current - 1, 0)); }}
          onReset={() => { setCompletedMerges(0); setIsPlaying(false); }}
          onTogglePlay={() => { if (isPlaying) setIsPlaying(false); else { if (completedMerges >= totalMerges) setCompletedMerges(0); setIsPlaying(true); } }}
          previousDisabled={completedMerges === 0}
          themeClasses={themeClasses}
        />
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

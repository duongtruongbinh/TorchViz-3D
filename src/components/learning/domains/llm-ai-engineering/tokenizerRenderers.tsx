import { AlignJustify, ArrowDown, ArrowLeftRight, ArrowRight, Braces, CheckCircle2, CircleAlert, Coffee, CornerDownLeft, Cpu, Database, FileText, Hash, Info, ListOrdered, RefreshCw, Route, Scissors, Search, SlidersHorizontal, Sparkles, Type, type LucideIcon, X } from 'lucide-react';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { cx, getLearningLabTheme } from '../../theme';
import { getLearningLocalizedText as text } from '../../learningText';
import { DiagramConnectorLayer, getDiagramAnchor, observeDiagramLayout } from './diagramPrimitives';
import { CodeBlock } from '../../code/CodeBlock';
import { LlmCallout, StepPlaybackControls, TokenChip, TokenIdBadge } from './rendererPrimitives';
import { getLlmRendererTheme } from './rendererTheme';
import type {
  LlmBpeFallbackContent,
  LlmBpeInferenceFlowContent,
  LlmContentRendererProps,
  LlmEmbeddingPipelineVisualContent,
  LlmRawTextModelInputContent,
  LlmPaddingMaskContent,
  LlmSpecialTokenRolesContent,
  LlmSlidingWindowWorkedExampleContent,
  LlmTokenIdTensorShapeContent,
  LlmTokenizerBoundaryMismatchContent,
  LlmTokenizerCodeStructureContent,
  LlmTokenizerCodeToIdsContent,
  LlmTokenizerContextAmbiguityContent,
  LlmTokenizerFreeDirectionContent,
  LlmTokenizerIdMisconceptionsContent,
  LlmTokenizerIdRoundTripContent,
  LlmTokenizerContractContent,
  LlmTokenizerGranularityContent,
  LlmTokenizerMemoryContent,
  LlmTokenizerMergeTrainingContent,
  LlmTokenizerOutputComparisonContent,
  LlmTokenizerRegexWalkthroughContent,
  LlmTokenizerSequenceLengthContent,
  LlmTokenizerVocabularyLookupContent,
  LlmVocabularyTradeoffContent,
} from './rendererTypes';

export function LlmRawTextModelInput({ content, language, themeClasses }: LlmContentRendererProps<LlmRawTextModelInputContent>) {
  const stageClass = themeClasses.isLight
    ? 'border-[#CAD6E3] bg-white'
    : 'border-[#A8B8C8]/20 bg-[#121A24]/42';
  const correspondencePalettes = themeClasses.isLight
    ? [
        'bg-[#FBE7D6] text-[#8A4617]',
        'bg-[#DCE8F4] text-[#205089]',
        'bg-[#DCEEE8] text-[#2E6B5D]',
        'bg-[#F4E8C8] text-[#70551A]',
      ]
    : [
        'bg-[#5A351E] text-[#FFD5B5]',
        'bg-[#263B5B] text-[#BFD3F2]',
        'bg-[#21483F] text-[#BFE6D7]',
        'bg-[#594821] text-[#F4E8C8]',
      ];
  const rawTokens = content.rawText
    .replace(/^"|"$/g, '')
    .match(/[\p{L}\p{N}]+|[^\s\p{L}\p{N}]/gu) ?? [content.rawText];

  return (
    <section className="grid gap-4 py-1">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>

      <div className="grid items-center gap-3 lg:grid-cols-[12rem_4.5rem_minmax(0,1fr)] lg:gap-0">
        <LlmTransformerArchitectureOverview focus="input-embedding" themeClasses={themeClasses} />

        <div className="grid justify-items-center lg:hidden" aria-hidden="true">
          <ArrowDown className={cx('h-7 w-7', themeClasses.accentText)} strokeWidth={1.8} />
        </div>
        <svg viewBox="0 0 72 220" className="hidden h-[15rem] w-full overflow-visible lg:block" aria-hidden="true">
          <path d="M0 82 L72 18 M0 138 L72 202" fill="none" stroke={themeClasses.isLight ? '#3F8B59' : '#8CC9A0'} strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        <div className="min-w-0">
          <div className="flex flex-col items-stretch gap-3 xl:flex-row xl:items-stretch">
          <div className={cx('flex min-w-0 flex-1 flex-col justify-between gap-4 rounded-lg border p-4', stageClass)}>
            <div className="flex items-center justify-between gap-3">
              <span className={cx('flex items-center gap-2 text-sm font-black', themeClasses.titleText)}>
                <Type className="h-4 w-4" aria-hidden="true" /> Raw text
              </span>
              <span className={cx('rounded-full px-2 py-1 font-mono text-[11px] font-bold', themeClasses.isLight ? 'bg-[#FBE7D6] text-[#8A4617]' : 'bg-[#5A351E] text-[#FFD5B5]')}>string</span>
            </div>
            <div className="flex min-h-11 flex-wrap items-center gap-1.5 py-2 font-mono text-sm font-black">
              {rawTokens.map((token, index) => (
                <code key={`${token}-${index}`} className={cx('rounded px-2 py-1', correspondencePalettes[index % correspondencePalettes.length])}>
                  {token}
                </code>
              ))}
            </div>
            <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.rawTextNote, language)}</p>
          </div>

          <div className="flex shrink-0 flex-col items-center justify-center gap-1 py-1 text-center xl:w-20 xl:py-0">
            <span className={cx('text-[11px] font-bold leading-4', themeClasses.mutedText)}>Tokenizer</span>
            <ArrowDown className={cx('h-5 w-5 xl:hidden', themeClasses.accentText)} aria-hidden="true" />
            <ArrowRight className={cx('hidden h-5 w-5 xl:block', themeClasses.accentText)} aria-hidden="true" />
          </div>

          <div className={cx('flex min-w-0 flex-1 flex-col justify-between gap-4 rounded-lg border p-4', stageClass)}>
            <div className="flex items-center justify-between gap-3">
              <span className={cx('flex items-center gap-2 text-sm font-black', themeClasses.titleText)}>
                <Braces className="h-4 w-4" aria-hidden="true" /> Token IDs
              </span>
              <span className={cx('rounded-full px-2 py-1 font-mono text-[11px] font-bold', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#BFD3F2]')}>integer</span>
            </div>
            <div className="flex min-h-11 flex-wrap items-center gap-1.5 py-2 font-mono text-sm font-black">
              {content.tokenIds.map((tokenId, index) => (
                <code key={`${tokenId}-${index}`} className={cx('rounded px-2 py-1', correspondencePalettes[index % correspondencePalettes.length])}>
                  {tokenId}
                </code>
              ))}
            </div>
            <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.tokenIdsNote, language)}</p>
          </div>

          <div className="flex shrink-0 flex-col items-center justify-center gap-1 py-1 text-center xl:w-20 xl:py-0">
            <span className={cx('text-[11px] font-bold leading-4', themeClasses.mutedText)}>Embedding lookup</span>
            <ArrowDown className={cx('h-5 w-5 xl:hidden', themeClasses.accentText)} aria-hidden="true" />
            <ArrowRight className={cx('hidden h-5 w-5 xl:block', themeClasses.accentText)} aria-hidden="true" />
          </div>

          <div className={cx('flex min-w-0 flex-[1.15] flex-col justify-between gap-4 rounded-lg border p-4', stageClass)}>
            <div className="flex items-center justify-between gap-3">
              <span className={cx('flex items-center gap-2 text-sm font-black', themeClasses.titleText)}>
                <Database className="h-4 w-4" aria-hidden="true" /> Embedding tensor
              </span>
              <span className={cx('rounded-full px-2 py-1 font-mono text-[11px] font-bold', themeClasses.isLight ? 'bg-[#DCEEE8] text-[#2E6B5D]' : 'bg-[#21483F] text-[#BFE6D7]')}>float · (T, C)</span>
            </div>
            <div className="grid gap-1 py-2 font-mono text-xs font-bold">
              {content.embeddingRows.map((row, index) => (
                <div
                  key={`${index}-${row.join('-')}`}
                  className={cx('grid grid-cols-3 gap-1 rounded px-1 py-0.5 text-center', correspondencePalettes[index % correspondencePalettes.length])}
                >
                  {row.map((value, columnIndex) => (
                    <span
                      key={`${columnIndex}-${value}`}
                      className={cx('rounded px-1 py-1', themeClasses.isLight ? 'bg-white/35' : 'bg-black/10')}
                    >
                      {value}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.embeddingNote, language)}</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export function LlmTransformerArchitectureOverview({ focus, themeClasses }: {
  focus?: 'encoder-decoder' | 'input-embedding';
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const focusArchitectureBlocks = focus === 'encoder-decoder';
  const stroke = themeClasses.isLight ? '#3F8B59' : '#8CC9A0';
  const textColor = themeClasses.isLight ? '#327047' : '#D5F1DE';
  const blockFill = themeClasses.isLight ? '#F8F1D8' : '#3A392A';
  const attentionFill = themeClasses.isLight ? '#F3DDF0' : '#493448';
  const embeddingFill = themeClasses.isLight ? '#F3DDF0' : '#493448';
  const outputFill = themeClasses.isLight ? '#E0EAF8' : '#263B5B';
  const frameFill = themeClasses.isLight ? '#F2FAF3' : '#173025';

  if (focus === 'input-embedding') {
    return (
      <figure className="mx-auto w-full max-w-[15rem]">
        <svg viewBox="0 0 240 230" role="img" aria-labelledby="transformer-input-embedding-title" className="block h-auto w-full">
          <title id="transformer-input-embedding-title">Bước từ Inputs đến Input Embedding</title>
          <defs>
            <marker id="transformer-input-arrow" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill={stroke} />
            </marker>
          </defs>
          <g fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" markerEnd="url(#transformer-input-arrow)">
            <path d="M120 208 V170" />
            <path d="M120 82 V32" />
          </g>
          <rect x="30" y="82" width="180" height="88" rx="12" fill={embeddingFill} stroke={stroke} strokeWidth="3" />
          <g fill={textColor} fontFamily="ui-sans-serif, system-ui" fontWeight="700" textAnchor="middle">
            <text x="120" y="225" fontSize="20">Inputs</text>
            <text x="120" y="119" fontSize="19">Input</text>
            <text x="120" y="145" fontSize="19">Embedding</text>
          </g>
        </svg>
      </figure>
    );
  }

  return (
    <figure className="mx-auto w-full max-w-[48rem]">
      <svg viewBox="0 0 760 970" role="img" aria-labelledby="transformer-architecture-title" className="block h-auto w-full">
        <title id="transformer-architecture-title">Kiến trúc Transformer encoder-decoder từ input embedding đến output probabilities</title>
        <defs>
          <marker id="transformer-arrow" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" refX="8.5" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill={stroke} />
          </marker>
          <marker id="transformer-residual-arrow" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" refX="6.8" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={stroke} />
          </marker>
        </defs>
        <g transform="translate(0 18) scale(1 1.05)">
        <g fill={focusArchitectureBlocks ? (themeClasses.isLight ? '#E7F0FA' : '#263B5B') : frameFill} fillOpacity={focusArchitectureBlocks ? 0.96 : 0.72} stroke={focusArchitectureBlocks ? (themeClasses.isLight ? '#205089' : '#BFD3F2') : stroke} strokeWidth={focusArchitectureBlocks ? 5 : 3}>
          <rect x="85" y="230" width="240" height="410" rx="18" />
          <rect x="435" y="160" width="240" height="480" rx="18" />
        </g>
        <g fill="none" stroke={stroke} strokeWidth="2.65" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#transformer-arrow)">
          <path d="M205 842 V780" opacity={focusArchitectureBlocks ? 0.18 : 1} /><path d="M205 720 V699" opacity={focusArchitectureBlocks ? 0.18 : 1} /><path d="M205 661 V600" /><path d="M205 545 V510" /><path d="M205 465 V415" /><path d="M205 360 V335" />
          <path d="M555 842 V780" opacity={focusArchitectureBlocks ? 0.18 : 1} /><path d="M555 720 V699" opacity={focusArchitectureBlocks ? 0.18 : 1} /><path d="M555 661 V600" /><path d="M555 545 V510" /><path d="M555 465 V440" /><path d="M555 385 V350" /><path d="M555 305 V280" /><path d="M555 235 V220" /><path d="M555 175 V125" opacity={focusArchitectureBlocks ? 0.18 : 1} /><path d="M555 85 V75" opacity={focusArchitectureBlocks ? 0.18 : 1} /><path d="M555 35 V22" opacity={focusArchitectureBlocks ? 0.18 : 1} />
          <path d="M290 312 H345 Q360 312 360 327 V397 Q360 412 375 412 H470" />
        </g>
        <g fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.88" markerEnd="url(#transformer-residual-arrow)">
          <path d="M205 620 H103 V487 H120" /><path d="M205 450 H103 V312 H120" />
          <path d="M555 620 H657 V487 H640" /><path d="M555 450 H657 V327 H640" /><path d="M555 290 H657 V197 H640" />
        </g>
        <g fontFamily="ui-sans-serif, system-ui" fontWeight="700" textAnchor="middle" fill={textColor}>
          <text x="205" y="885" fontSize="20" opacity={focusArchitectureBlocks ? 0.18 : 1}>Inputs</text>
          <text x="555" y="885" fontSize="20" opacity={focusArchitectureBlocks ? 0.18 : 1}>Outputs (shifted right)</text>
          <text x="205" y="215" fontSize={focusArchitectureBlocks ? 22 : 18}>{focusArchitectureBlocks ? 'Encoder' : 'N × blocks'}</text>
          <text x={focusArchitectureBlocks ? 445 : 490} y="151" fontSize={focusArchitectureBlocks ? 20 : 18}>{focusArchitectureBlocks ? 'Decoder' : 'N × blocks'}</text>
          <text x="555" y="12" fontSize="22" opacity={focusArchitectureBlocks ? 0.18 : 1}>Output Probabilities</text>
        </g>

        {[
          { x: 120, y: 720, w: 170, h: 70, fill: embeddingFill, lines: ['Input', 'Embedding'] },
          { x: 120, y: 545, w: 170, h: 55, fill: attentionFill, lines: ['Multi-Head', 'Attention'] },
          { x: 120, y: 465, w: 170, h: 45, fill: blockFill, lines: ['Add & Norm'] },
          { x: 120, y: 360, w: 170, h: 55, fill: blockFill, lines: ['Feed Forward'] },
          { x: 120, y: 290, w: 170, h: 45, fill: blockFill, lines: ['Add & Norm'] },
          { x: 470, y: 720, w: 170, h: 70, fill: embeddingFill, lines: ['Output', 'Embedding'] },
          { x: 470, y: 535, w: 170, h: 55, fill: attentionFill, lines: ['Masked Multi-Head', 'Attention'] },
          { x: 470, y: 465, w: 170, h: 45, fill: blockFill, lines: ['Add & Norm'] },
          { x: 470, y: 385, w: 170, h: 55, fill: attentionFill, lines: ['Multi-Head', 'Attention'] },
          { x: 470, y: 305, w: 170, h: 45, fill: blockFill, lines: ['Add & Norm'] },
          { x: 470, y: 235, w: 170, h: 45, fill: blockFill, lines: ['Feed Forward'] },
          { x: 470, y: 175, w: 170, h: 45, fill: blockFill, lines: ['Add & Norm'] },
          { x: 470, y: 85, w: 170, h: 40, fill: outputFill, lines: ['Linear'] },
          { x: 470, y: 35, w: 170, h: 40, fill: attentionFill, lines: ['Softmax'] },
        ].map((block) => (
          <g key={`${block.x}-${block.y}-${block.lines.join('-')}`} opacity={focusArchitectureBlocks && (block.y === 720 || block.y < 160) ? 0.18 : 1}>
            <rect x={block.x} y={block.y} width={block.w} height={block.h} rx="10" fill={block.fill} stroke={stroke} strokeWidth="3" />
            <text x={block.x + block.w / 2} y={block.y + block.h / 2 - (block.lines.length - 1) * 11} textAnchor="middle" dominantBaseline="middle" fill={textColor} fontFamily="ui-sans-serif, system-ui" fontSize="18" fontWeight="700">
              {block.lines.map((line, index) => <tspan key={line} x={block.x + block.w / 2} dy={index === 0 ? 0 : 22}>{line}</tspan>)}
            </text>
          </g>
        ))}

        <g fill="none" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" opacity={focusArchitectureBlocks ? 0.18 : 1}>
          <circle cx="205" cy="680" r="18" fill={themeClasses.isLight ? '#FFFFFF' : '#121A24'} /><path d="M195 680 H215 M205 670 V690" />
          <circle cx="555" cy="680" r="18" fill={themeClasses.isLight ? '#FFFFFF' : '#121A24'} /><path d="M545 680 H565 M555 670 V690" />
          <path d="M187 680 C145 680 120 690 95 710" />
          <path d="M573 680 C615 680 640 690 665 710" />
        </g>
        <g fill={textColor} fontFamily="ui-sans-serif, system-ui" fontWeight="700" fontSize="17" opacity={focusArchitectureBlocks ? 0.18 : 1}>
          <text x="20" y="700">Positional</text><text x="20" y="722">Encoding</text>
          <text x="650" y="700">Positional</text><text x="650" y="722">Encoding</text>
        </g>
        </g>
      </svg>
    </figure>
  );
}

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

export function LlmTokenizerGranularity({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerGranularityContent>) {
  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className={cx('text-sm font-black', themeClasses.mutedText)}>{language === 'vi' ? 'Cùng một chuỗi:' : 'Same string:'}</span>
        <code className={cx('rounded-lg px-3 py-2 text-base font-black', themeClasses.isLight ? 'bg-[#E8EEF5] text-[#123B68]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{content.source}</code>
      </div>
      <div className="grid overflow-hidden rounded-xl border lg:grid-cols-3">
        {content.approaches.map((approach, index) => (
          <article
            key={approach.id}
            className={cx(
              'grid min-w-0 content-start gap-4 p-4',
              index > 0 && (themeClasses.isLight ? 'border-t border-[#CAD6E3] lg:border-l lg:border-t-0' : 'border-t border-[#A8B8C8]/18 lg:border-l lg:border-t-0'),
              approach.id === 'subword'
                ? (themeClasses.isLight ? 'bg-[#EDF5FB]' : 'bg-[#263B5B]/55')
                : (themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]/36'),
            )}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className={cx('text-base font-black', themeClasses.titleText)}>{approach.title}</h2>
              <span className={cx('rounded-full px-2.5 py-1 text-xs font-black tabular-nums', themeClasses.isLight ? 'bg-[#E8EEF5] text-[#123B68]' : 'bg-[#172A43] text-[#BFD3F2]')}>
                {approach.tokens.length} tokens
              </span>
            </div>
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {approach.tokens.map((token, tokenIndex) => (
                <TokenChip key={`${token}-${tokenIndex}`} className="min-w-0 rounded-md px-2 py-1 text-xs font-black" themeClasses={themeClasses}>{token}</TokenChip>
              ))}
            </div>
            <dl className="grid gap-2 text-sm leading-6">
              <div>
                <dt className={cx('font-black', themeClasses.accentText)}>{language === 'vi' ? 'Điểm mạnh' : 'Strength'}</dt>
                <dd className={themeClasses.bodyText}>{text(approach.strength, language)}</dd>
              </div>
              <div>
                <dt className={cx('font-black', themeClasses.mutedText)}>{language === 'vi' ? 'Đánh đổi' : 'Trade-off'}</dt>
                <dd className={themeClasses.bodyText}>{text(approach.cost, language)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <div className={cx('flex items-start gap-3 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#121A24]/48')}>
        <Type className={cx('mt-0.5 h-5 w-5 shrink-0', themeClasses.accentText)} strokeWidth={1.8} aria-hidden="true" />
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.whitespaceNote, language)}</p>
      </div>
      <LlmCallout icon={CircleAlert} tone="accent" themeClasses={themeClasses}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.misconception, language)}</p>
      </LlmCallout>
    </section>
  );
}

const TOKENIZER_CONTRACT_ICONS = {
  vocabulary: Database,
  ids: Hash,
  length: ListOrdered,
  roundtrip: RefreshCw,
} satisfies Record<LlmTokenizerContractContent['decisions'][number]['id'], LucideIcon>;

export function LlmTokenizerContract({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerContractContent>) {
  return (
    <section className="grid gap-4">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {content.decisions.map((decision) => {
          const Icon = TOKENIZER_CONTRACT_ICONS[decision.id];
          return (
            <article key={decision.id} className={cx('grid min-w-0 grid-cols-[2.75rem_minmax(0,1fr)] gap-3 rounded-lg px-4 py-4', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#121A24]/48')}>
              <span className={cx('grid h-11 w-11 place-items-center rounded-lg', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#BFD3F2]')}>
                <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
                  <h2 className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{text(decision.title, language)}</h2>
                  <code className={cx('break-words text-xs font-black', themeClasses.accentText)}>{decision.value}</code>
                </div>
                <p className={cx('mt-1 text-sm leading-6', themeClasses.bodyText)}>{text(decision.meaning, language)}</p>
              </div>
            </article>
          );
        })}
      </div>
      <div className={cx('flex items-start gap-3 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]')}>
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.9} aria-hidden="true" />
        <p className="text-sm font-semibold leading-6">{text(content.checkpoint, language)}</p>
      </div>
      <LlmCallout icon={CircleAlert} tone="accent" themeClasses={themeClasses}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.misconception, language)}</p>
      </LlmCallout>
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
        <CodeBlock
          code={content.code}
          showLineNumbers
          showWhitespace
          themeClasses={themeClasses}
          headerTrailing={
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#9EB4CA]">
              <CornerDownLeft className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
              {language === 'vi' ? 'Khoảng trắng là cấu trúc' : 'Whitespace is structure'}
            </span>
          }
        />

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
      <p className={cx('w-full text-center text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className={cx('relative mx-auto grid w-full max-w-4xl gap-5 overflow-hidden rounded-2xl border p-5 sm:p-7', themeClasses.isLight ? 'border-[#E07A5F]/20 bg-[#FFF9F6]' : 'border-[#F29A82]/18 bg-[#F29A82]/6')}>
        <div className="flex flex-wrap items-start justify-center gap-3 sm:gap-5">
          {content.entries.map((entry, index) => (
            <div key={`${entry.token}-${entry.id}`} className="grid justify-items-center gap-2">
              <div className="flex items-center gap-2">
                {index > 0 ? <span className={cx('text-xl font-black', themeClasses.mutedText)}>&lt;</span> : null}
                <span className={cx('grid h-14 min-w-20 place-items-center rounded-xl px-3 text-lg font-black tabular-nums', themeClasses.isLight ? 'bg-[#FFF0CF] text-[#674518] ring-1 ring-[#C68A2E]/35' : 'bg-[#8B6734]/40 text-[#FFE5B4] ring-1 ring-[#FFE5B4]/20')}>{entry.id}</span>
              </div>
              <code className={cx('rounded-md px-2 py-1 text-xs font-black', themeClasses.isLight ? 'bg-white text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{entry.token}</code>
            </div>
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
      <LlmCallout className="w-full" icon={CircleAlert} themeClasses={themeClasses}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.takeaway, language)}</p>
      </LlmCallout>
    </section>
  );
}

const TOKENIZER_CONTEXT_ICONS = {
  road: Route,
  sugar: Coffee,
} satisfies Record<LlmTokenizerContextAmbiguityContent['examples'][number]['id'], LucideIcon>;

export function LlmTokenizerContextAmbiguity({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenizerContextAmbiguityContent>) {
  return (
    <section className="grid gap-3">
      <div className="grid gap-4 rounded-2xl border border-[#205089]/12 bg-[#F8FAFC] p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {content.examples.map((example) => {
            const Icon = TOKENIZER_CONTEXT_ICONS[example.id];
            const accent = example.id === 'road'
              ? 'text-[#245E8D]'
              : 'text-[#73551D]';
            return (
              <article key={example.id} className="grid justify-items-center gap-2 text-center">
                <Icon className={cx('h-6 w-6', accent)} strokeWidth={1.7} aria-hidden="true" />
                <p className={cx('text-base font-bold leading-7 sm:text-lg', themeClasses.titleText)}>
                  “{example.before}<mark className="rounded bg-[#DCE8F4] px-1 font-black text-[#205089]">{content.token}</mark>{example.after}”
                </p>
                <span className={cx('text-sm font-black', accent)}>{text(example.meaning, language)}</span>
                <ArrowDown className={cx('mt-1 h-5 w-5', themeClasses.mutedText)} strokeWidth={1.7} aria-hidden="true" />
                <div className="flex flex-wrap justify-center gap-1.5" aria-label={language === 'vi' ? 'Dãy token ID' : 'Token ID sequence'}>
                  {example.tokenIds.map((tokenId, index) => {
                    const isTarget = index === example.highlightedTokenIndex;
                    return (
                      <span key={`${example.id}-${tokenId}-${index}`} className={cx(
                        'grid h-8 min-w-9 place-items-center rounded-md px-2 text-xs font-black tabular-nums',
                        isTarget
                          ? 'bg-[#2F78B7] text-white shadow-sm'
                          : 'bg-white text-[#64748B] ring-1 ring-[#205089]/10',
                      )}>{tokenId}</span>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

      </div>

      <LlmCallout className="w-full border-l-[3px]" icon={Info} themeClasses={themeClasses} tone="accent">
        <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.explanation, language)}</p>
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
                <div className="grid min-w-0 content-center gap-3 p-4 lg:p-5">
                  <CodeBlock
                    code={(answerVisibility[stage.id] && stage.answerCode ? stage.answerCode : stage.code)}
                    themeClasses={themeClasses}
                    headerTrailing={stage.answerCode?.length ? (
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
                    ) : undefined}
                  />
                  {stage.output?.length ? (
                    <CodeBlock variant="output" code={stage.output.join('\n')} copyable={false} themeClasses={themeClasses} />
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
      /* All horizontal connectors run at the common center Y */
      const flowY = modelAnchor.centerY;

      setConnectorPaths({
        flow: [
          `M ${inputAnchor.centerX} ${inputAnchor.bottom} V ${tokenizerAnchor.top}`,
          `M ${tokenizerAnchor.right} ${flowY} H ${inputIdsAnchor.left}`,
          `M ${inputIdsAnchor.right} ${flowY} H ${modelAnchor.left}`,
          `M ${modelAnchor.right} ${flowY} H ${outputIdAnchor.left}`,
          `M ${outputIdAnchor.right} ${flowY} H ${detokenizerAnchor.left}`,
          `M ${detokenizerAnchor.centerX} ${detokenizerAnchor.bottom} V ${outputAnchor.top}`,
        ],
        vocabulary: [
          `M ${tokenizerAnchor.centerX} ${tokenizerAnchor.bottom} L ${vocabularyAnchor.centerX} ${vocabularyAnchor.centerY}`,
          `M ${detokenizerAnchor.centerX} ${detokenizerAnchor.bottom} L ${vocabularyAnchor.centerX} ${vocabularyAnchor.centerY}`,
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

          <div ref={tokenizerRef} className={cx('absolute left-6 top-[9.125rem] grid w-52 justify-items-center gap-2 rounded-xl px-4 py-5', themeClasses.isLight ? 'bg-[#EBD9E8] text-[#56314F]' : 'bg-[#6C4B66]/65 text-[#F7DDF1]')}>
            <span className="text-base font-black">Tokenizer</span>
            <div className="flex flex-wrap justify-center gap-1">{content.tokens.map((token, index) => <code key={`${token}-${index}`} className="rounded bg-white/45 px-1.5 py-0.5 text-xs font-black">{token}</code>)}</div>
          </div>

          <div className="absolute left-[18rem] top-[6.2rem] grid w-20 justify-items-center gap-2">
            <span className={cx('text-center text-[0.68rem] font-black uppercase tracking-[0.08em]', themeClasses.mutedText)}>Token IDs</span>
            <div ref={inputIdsRef} className={cx('grid min-h-36 w-12 content-evenly justify-items-center rounded-lg py-2', themeClasses.isLight ? 'bg-[#F4E5EF]' : 'bg-[#6C4B66]/55')}>
              {content.ids.map((id) => <span key={id} className={cx('grid h-8 w-8 place-items-center rounded-full text-[0.65rem] font-black tabular-nums', themeClasses.isLight ? 'bg-[#F6CFE4] text-[#713255] ring-1 ring-[#8D436F]' : 'bg-[#D58AB5] text-[#2E1728] ring-1 ring-[#F4C8E1]/60')}>{id}</span>)}
            </div>
          </div>

          <div ref={modelRef} className={cx('absolute left-[42%] top-[7rem] grid h-40 w-36 place-items-center rounded-xl px-4 text-center', themeClasses.isLight ? 'bg-[#DDF2C7] text-[#29471E]' : 'bg-[#52723C]/60 text-[#E1F5D1]')}>
            <div className="grid justify-items-center gap-2"><Cpu className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" /><span className="text-base font-black">{text(content.modelLabel, language)}</span><span className="text-xs font-semibold">Forward</span></div>
          </div>

          <div className="absolute right-[18rem] top-[7.0rem] grid w-20 justify-items-center gap-2">
            <span className={cx('text-center text-[0.68rem] font-black uppercase tracking-[0.08em]', themeClasses.mutedText)}>{language === 'vi' ? 'ID được chọn' : 'Selected ID'}</span>
            <div ref={outputIdRef} className={cx('grid h-20 w-12 place-items-center rounded-lg', themeClasses.isLight ? 'bg-[#FFF0CF]' : 'bg-[#8B6734]/40')}><span className={cx('grid h-8 w-8 place-items-center rounded-full text-xs font-black', themeClasses.isLight ? 'bg-[#F4D8A4] text-[#674518] ring-1 ring-[#C68A2E]' : 'bg-[#C49250] text-[#21170A] ring-1 ring-[#FFE5B4]/60')}>{content.sampledTokenId}</span></div>
          </div>

          <div ref={detokenizerRef} className={cx('absolute right-6 top-[8.875rem] grid w-52 justify-items-center gap-2 rounded-xl px-4 py-5', themeClasses.isLight ? 'bg-[#EBD9E8] text-[#56314F]' : 'bg-[#6C4B66]/65 text-[#F7DDF1]')}>
            <span className="text-base font-black">Detokenizer</span>
            <code className="rounded bg-white/45 px-2 py-1 text-sm font-black">{content.sampledToken}</code>
          </div>

          <div ref={outputTextRef} className="absolute bottom-6 right-6 grid w-52 justify-items-center gap-2">
            <code className={cx('rounded-lg px-4 py-2 text-base font-black', themeClasses.isLight ? 'bg-[#F3F6F9] text-[#263B5B]' : 'bg-[#263B5B] text-[#E5EEF8]')}>{content.outputText}</code>
            <span className={cx('text-[0.68rem] font-black uppercase tracking-[0.08em]', themeClasses.mutedText)}>Output text</span>
          </div>

          <div ref={vocabularyRef} className={cx('absolute top-[18.25rem] left-1/2 grid w-60 -translate-x-1/2 justify-items-center gap-1 rounded-xl border px-4 py-3 text-center', themeClasses.isLight ? 'border-[#8D436F]/24 bg-[#FAEFF6] text-[#56314F]' : 'border-[#D58AB5]/24 bg-[#6C4B66]/30 text-[#F7DDF1]')}>
            <Database className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
            <span className="text-sm font-black">Shared Vocabulary</span>
            <span className="text-xs font-semibold">token ↔ token ID</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LlmTokenIdTensorShape({ content, language, themeClasses }: LlmContentRendererProps<LlmTokenIdTensorShapeContent>) {
  return (
    <section className="grid gap-5">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className={cx('grid min-w-0 gap-4 rounded-xl px-4 py-5 sm:px-6', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#0E1620]/62')}>
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className={cx('text-xs font-black uppercase tracking-[0.08em]', themeClasses.mutedText)}>input_ids</span>
            <div className="flex flex-wrap justify-end gap-2">
              <code className={cx('rounded-full px-2.5 py-1 text-xs font-black', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#BFD3F2]')}>{content.dtype}</code>
              <code className={cx('rounded-full px-2.5 py-1 text-xs font-black', themeClasses.isLight ? 'bg-[#DCEEE8] text-[#2E6B5D]' : 'bg-[#21483F] text-[#BFE6D7]')}>({content.batchSize}, {content.sequenceLength})</code>
            </div>
          </div>
          <div className="grid min-w-0 gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(content.ids.length, 8)}, minmax(0, 1fr))` }}>
            {content.ids.map((id, index) => (
              <TokenIdBadge key={`${id}-${index}`} className="grid min-w-0 place-items-center rounded-md px-1 py-3 text-xs font-black tabular-nums sm:text-sm" themeClasses={themeClasses}>{id}</TokenIdBadge>
            ))}
          </div>
          <div className={cx('flex items-center gap-2 text-xs font-black', themeClasses.accentText)}>
            <span className="h-px flex-1 bg-current/35" aria-hidden="true" />
            <span>T = {content.sequenceLength}</span>
            <span className="h-px flex-1 bg-current/35" aria-hidden="true" />
          </div>
          <p className={cx('text-center text-xs leading-5', themeClasses.mutedText)}>B = {content.batchSize}</p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {content.stages.map((stage) => (
          <article key={stage.contract} className={cx('grid min-w-0 content-start gap-1 rounded-lg px-3 py-3', themeClasses.isLight ? 'bg-[#EDF5FB]' : 'bg-[#263B5B]/45')}>
            <span className={cx('text-xs font-black', themeClasses.titleText)}>{text(stage.label, language)}</span>
            <code className={cx('min-w-0 break-words text-xs font-bold', themeClasses.accentText)}>{stage.value}</code>
            <span className={cx('text-[11px] leading-4', themeClasses.mutedText)}>{stage.contract}</span>
          </article>
        ))}
      </div>
      <div className={cx('flex items-start gap-3 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]')}>
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.9} aria-hidden="true" />
        <p className="text-sm font-semibold leading-6">{text(content.takeaway, language)}</p>
      </div>
      <LlmCallout icon={CircleAlert} tone="accent" themeClasses={themeClasses}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.misconception, language)}</p>
      </LlmCallout>
    </section>
  );
}

const SPECIAL_TOKEN_ICONS = {
  bos: ArrowRight,
  eos: CheckCircle2,
  pad: AlignJustify,
  unk: CircleAlert,
  boundary: Scissors,
} satisfies Record<LlmSpecialTokenRolesContent['tokens'][number]['id'], LucideIcon>;

export function LlmSpecialTokenRoles({ content, language, themeClasses }: LlmContentRendererProps<LlmSpecialTokenRolesContent>) {
  return (
    <section className="grid gap-4">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {content.tokens.map((item) => {
          const Icon = SPECIAL_TOKEN_ICONS[item.id];
          return (
            <article key={item.id} className={cx('grid min-w-0 content-start gap-3 rounded-lg px-4 py-4', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#121A24]/48')}>
              <div className="flex items-center justify-between gap-2">
                <span className={cx('grid h-9 w-9 place-items-center rounded-lg', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#BFD3F2]')}>
                  <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                </span>
                <code className={cx('min-w-0 break-words rounded-md px-2 py-1 text-xs font-black', themeClasses.isLight ? 'bg-white text-[#123B68]' : 'bg-[#172A43] text-[#DCE8F4]')}>{item.token}</code>
              </div>
              <h2 className={cx('text-sm font-black', themeClasses.titleText)}>{item.title}</h2>
              <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(item.role, language)}</p>
            </article>
          );
        })}
      </div>
      <div className={cx('flex items-start gap-3 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]')}>
        <Database className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
        <p className="text-sm font-semibold leading-6">{text(content.contract, language)}</p>
      </div>
      <LlmCallout icon={CircleAlert} tone="accent" themeClasses={themeClasses}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.misconception, language)}</p>
      </LlmCallout>
    </section>
  );
}

export function LlmPaddingMask({ content, language, themeClasses }: LlmContentRendererProps<LlmPaddingMaskContent>) {
  const columnCount = Math.max(...content.rows.map((row) => row.tokens.length));
  return (
    <section className="grid gap-5">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className={cx('grid min-w-0 gap-4 rounded-xl px-3 py-4 sm:px-5', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#0E1620]/62')}>
        {content.rows.map((row) => (
          <div key={row.label} className="grid min-w-0 gap-2">
            <span className={cx('text-xs font-black', themeClasses.mutedText)}>{row.label}</span>
            <div className="grid min-w-0 gap-1.5" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
              {row.tokens.map((token, index) => (
                <code
                  key={`${token}-${index}`}
                  className={cx(
                    'grid min-w-0 place-items-center rounded-md px-1 py-2 text-[10px] font-black sm:text-xs',
                    row.valid[index] === 0
                      ? (themeClasses.isLight ? 'bg-[#E8EEF5] text-[#6B7F91]' : 'bg-[#263B5B]/65 text-[#A8B8C8]')
                      : (themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]'),
                  )}
                >
                  {token}
                </code>
              ))}
            </div>
            <div className="grid min-w-0 gap-1.5" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
              {row.valid.map((value, index) => (
                <span key={`${value}-${index}`} className={cx('grid place-items-center rounded px-1 py-1 text-[10px] font-black tabular-nums', value === 0 ? (themeClasses.isLight ? 'bg-[#FBE7D6] text-[#8A4617]' : 'bg-[#5A351E] text-[#FFD5B5]') : (themeClasses.isLight ? 'bg-[#DCEEE8] text-[#2E6B5D]' : 'bg-[#21483F] text-[#BFE6D7]'))}>{value}</span>
              ))}
            </div>
          </div>
        ))}
        <div className={cx('flex items-center gap-2 text-xs font-black', themeClasses.accentText)}>
          <span className="h-px flex-1 bg-current/35" aria-hidden="true" />
          <span>T = {columnCount}</span>
          <span className="h-px flex-1 bg-current/35" aria-hidden="true" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={cx('rounded-lg px-4 py-3 text-sm leading-6', themeClasses.isLight ? 'bg-[#EDF5FB] text-[#123B68]' : 'bg-[#263B5B]/45 text-[#DCE8F4]')}><strong>PAD:</strong> {text(content.padMeaning, language)}</div>
        <div className={cx('rounded-lg px-4 py-3 text-sm leading-6', themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]')}><strong>valid mask:</strong> {text(content.maskMeaning, language)}</div>
      </div>
      <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.windowNote, language)}</p>
      <LlmCallout icon={CircleAlert} tone="accent" themeClasses={themeClasses}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.misconception, language)}</p>
      </LlmCallout>
    </section>
  );
}

export function LlmSlidingWindowWorkedExample({ content, language, themeClasses }: LlmContentRendererProps<LlmSlidingWindowWorkedExampleContent>) {
  const row = (values: number[], tone: 'input' | 'target' | 'corpus' = 'corpus') => (
    <div className="flex min-w-0 flex-wrap gap-1.5">
      {values.map((value, index) => (
        <span
          key={`${value}-${index}`}
          className={cx(
            'grid h-9 min-w-9 place-items-center rounded-md px-2 text-xs font-black tabular-nums',
            tone === 'target'
              ? (themeClasses.isLight ? 'bg-[#DCEEE8] text-[#2E6B5D]' : 'bg-[#21483F] text-[#BFE6D7]')
              : tone === 'input'
                ? (themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]')
                : (themeClasses.isLight ? 'bg-[#E8EEF5] text-[#52667A]' : 'bg-[#172A43] text-[#BFD3F2]'),
          )}
        >
          {value}
        </span>
      ))}
    </div>
  );
  const misconception = (
    <LlmCallout icon={CircleAlert} tone="accent" themeClasses={themeClasses}>
      <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.misconception, language)}</p>
    </LlmCallout>
  );

  if (content.view === 'chunk') {
    return (
      <section className="grid gap-5">
        <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
        <div className={cx('grid gap-4 rounded-xl px-4 py-5', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#0E1620]/62')}>
          <div><span className={cx('mb-2 block text-xs font-black', themeClasses.mutedText)}>Corpus IDs · N={content.corpus.length}</span>{row(content.corpus)}</div>
          <ArrowDown className={cx('mx-auto h-5 w-5', themeClasses.accentText)} aria-hidden="true" />
          <div className="grid justify-items-center gap-2">
            <span className={cx('text-xs font-black', themeClasses.mutedText)}>First chunk · T+1={content.contextLength + 1}</span>
            {row(content.chunk, 'input')}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <code className={cx('rounded-full px-3 py-1.5 text-xs font-black', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]')}>T={content.contextLength}</code>
            <code className={cx('rounded-full px-3 py-1.5 text-xs font-black', themeClasses.isLight ? 'bg-[#DCEEE8] text-[#2E6B5D]' : 'bg-[#21483F] text-[#BFE6D7]')}>stride={content.stride}</code>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <p className={cx('rounded-lg px-4 py-3 text-sm leading-6', themeClasses.isLight ? 'bg-[#EDF5FB] text-[#123B68]' : 'bg-[#263B5B]/45 text-[#DCE8F4]')}>{text(content.inputContract, language)}</p>
          <p className={cx('rounded-lg px-4 py-3 text-sm leading-6', themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]')}>{text(content.outputContract, language)}</p>
        </div>
        {misconception}
      </section>
    );
  }

  if (content.view === 'shift') {
    return (
      <section className="grid gap-5">
        <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
        <div className={cx('grid gap-4 rounded-xl px-4 py-5', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#0E1620]/62')}>
          <div className="grid items-center gap-3 sm:grid-cols-[5rem_minmax(0,1fr)]"><strong className={themeClasses.titleText}>input</strong>{row(content.input, 'input')}</div>
          <div className="grid items-center gap-3 sm:grid-cols-[5rem_minmax(0,1fr)]"><strong className={themeClasses.titleText}>target</strong>{row(content.target, 'target')}</div>
          <div className="grid gap-2 sm:grid-cols-3">
            {content.input.map((value, index) => <code key={`${value}-${index}`} className={cx('rounded-lg px-3 py-2 text-center text-sm font-black', themeClasses.isLight ? 'bg-white text-[#123B68]' : 'bg-[#172A43] text-[#DCE8F4]')}>{value} → {content.target[index]}</code>)}
          </div>
        </div>
        <code className={cx('w-fit max-w-full break-words rounded-lg px-3 py-2 text-sm font-black', themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]')}>{content.invariant}</code>
        {misconception}
      </section>
    );
  }

  if (content.view === 'stride') {
    return (
      <section className="grid gap-5">
        <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
        <div className="flex flex-wrap items-center gap-2">
          <code className={cx('rounded-full px-3 py-1.5 text-xs font-black', themeClasses.isLight ? 'bg-[#E8EEF5] text-[#123B68]' : 'bg-[#263B5B] text-[#DCE8F4]')}>N={content.corpusLength}</code>
          <code className={cx('rounded-full px-3 py-1.5 text-xs font-black', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#BFD3F2]')}>T={content.contextLength}</code>
          <code className={cx('rounded-full px-3 py-1.5 text-xs font-black', themeClasses.isLight ? 'bg-[#DCEEE8] text-[#2E6B5D]' : 'bg-[#21483F] text-[#BFE6D7]')}>stride={content.stride}</code>
          <span className={cx('text-sm font-black', themeClasses.bodyText)}>starts = [{content.starts.join(', ')}]</span>
        </div>
        <div className="grid gap-3">
          {content.samples.map((sample, index) => (
            <article key={content.starts[index]} className={cx('grid min-w-0 items-center gap-3 rounded-lg px-4 py-3 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto_minmax(0,1fr)]', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#121A24]/48')}>
              <span className={cx('text-xs font-black', themeClasses.mutedText)}>start {content.starts[index]}</span>
              {row(sample.input, 'input')}
              <ArrowDown className={cx('mx-auto h-4 w-4 sm:hidden', themeClasses.accentText)} aria-hidden="true" />
              <ArrowRight className={cx('hidden h-4 w-4 sm:block', themeClasses.accentText)} aria-hidden="true" />
              {row(sample.target, 'target')}
            </article>
          ))}
        </div>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.explanation, language)} <strong>start {content.invalidStart}</strong>.</p>
        {misconception}
      </section>
    );
  }

  if (content.view === 'batch') {
    const matrix = (values: number[][], tone: 'input' | 'target') => (
      <div className="grid gap-2">
        {values.map((valuesRow, index) => <div key={index}>{row(valuesRow, tone)}</div>)}
      </div>
    );
    return (
      <section className="grid gap-5">
        <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
        <div className={cx('grid gap-5 rounded-xl px-4 py-5 md:grid-cols-2', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#0E1620]/62')}>
          <div className="grid gap-2"><strong className={themeClasses.titleText}>input_ids</strong>{matrix(content.inputs, 'input')}</div>
          <div className="grid gap-2"><strong className={themeClasses.titleText}>target_ids</strong>{matrix(content.targets, 'target')}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <code className={cx('rounded-full px-3 py-1.5 text-xs font-black', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#205089]' : 'bg-[#263B5B] text-[#DCE8F4]')}>B={content.batchSize}</code>
          <code className={cx('rounded-full px-3 py-1.5 text-xs font-black', themeClasses.isLight ? 'bg-[#DCEEE8] text-[#2E6B5D]' : 'bg-[#21483F] text-[#BFE6D7]')}>T={content.contextLength}</code>
          <code className={cx('rounded-full px-3 py-1.5 text-xs font-black', themeClasses.isLight ? 'bg-[#E8EEF5] text-[#123B68]' : 'bg-[#172A43] text-[#BFD3F2]')}>(B,T)=({content.batchSize},{content.contextLength})</code>
        </div>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.explanation, language)}</p>
        {misconception}
      </section>
    );
  }

  const flow = (steps: typeof content.wrong, tone: 'wrong' | 'right') => (
    <div className="grid gap-2">
      {steps.map((step, index) => (
        <Fragment key={text(step, language)}>
          <div className={cx('rounded-lg px-4 py-3 text-sm font-semibold leading-6', tone === 'wrong' ? (themeClasses.isLight ? 'bg-[#FFF1ED] text-[#8B3524]' : 'bg-[#F29A82]/10 text-[#FFC3B4]') : (themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]'))}>{text(step, language)}</div>
          {index < steps.length - 1 ? <ArrowDown className={cx('mx-auto h-4 w-4', tone === 'wrong' ? 'text-[#B5523A]' : 'text-[#2E6B5D]')} aria-hidden="true" /> : null}
        </Fragment>
      ))}
    </div>
  );
  return (
    <section className="grid gap-5">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="grid gap-5 md:grid-cols-2">
        <div><h2 className={cx('mb-3 text-sm font-black', themeClasses.isLight ? 'text-[#8B3524]' : 'text-[#FFC3B4]')}>{language === 'vi' ? 'Sai: split sau khi tạo windows' : 'Wrong'}</h2>{flow(content.wrong, 'wrong')}</div>
        <div><h2 className={cx('mb-3 text-sm font-black', themeClasses.isLight ? 'text-[#24584D]' : 'text-[#CBEDE2]')}>{language === 'vi' ? 'Đúng: split tài liệu trước' : 'Right'}</h2>{flow(content.right, 'right')}</div>
      </div>
      <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.explanation, language)}</p>
      {misconception}
    </section>
  );
}

export function LlmEmbeddingPipelineVisual({ content, language, themeClasses }: LlmContentRendererProps<LlmEmbeddingPipelineVisualContent>) {
  const hasSingleComparison = content.comparisons?.length === 1;
  const [activeMixtureStep, setActiveMixtureStep] = useState(0);
  const filterBarPalettes = themeClasses.isLight
    ? [
        'bg-[#3679A8] text-white',
        'bg-[#477C6C] text-white',
        'bg-[#75629C] text-white',
        'bg-[#B66D32] text-white',
      ]
    : [
        'bg-[#6E9CC0] text-[#101923]',
        'bg-[#76A99B] text-[#101923]',
        'bg-[#9D8BC2] text-[#101923]',
        'bg-[#D39867] text-[#101923]',
      ];
  const defaultStepFlow = content.steps?.length ? (
    <div className={cx('grid gap-2', content.steps.length > 3 ? 'lg:grid-cols-4 lg:gap-0' : 'md:grid-cols-[repeat(3,minmax(0,1fr))] md:gap-0')}>
      {content.steps.map((step, index) => (
        <Fragment key={`${step.shape}-${index}`}>
          <article className={cx(
            'grid min-w-0 content-start gap-2 rounded-lg px-4 py-4 md:rounded-none',
            index === 0 && 'md:rounded-l-lg',
            index === content.steps!.length - 1 && 'md:rounded-r-lg',
            themeClasses.isLight ? (index % 2 === 0 ? 'bg-[#EDF5FB]' : 'bg-[#F5F8FB]') : (index % 2 === 0 ? 'bg-[#263B5B]/55' : 'bg-[#121A24]/48'),
          )}>
            <span className={cx('text-xs font-black', themeClasses.titleText)}>{text(step.label, language)}</span>
            <code className={cx('break-words text-sm font-black', themeClasses.accentText)}>{step.shape}</code>
            <p className={cx('text-xs leading-5', themeClasses.bodyText)}>{text(step.detail, language)}</p>
          </article>
          {index < content.steps!.length - 1 ? <ArrowDown className={cx('mx-auto h-4 w-4 md:hidden', themeClasses.accentText)} aria-hidden="true" /> : null}
        </Fragment>
      ))}
    </div>
  ) : null;
  const filterStepFlow = content.layout === 'filter-pipeline' && content.steps?.length ? (
    <div className={cx('overflow-hidden rounded-xl border', themeClasses.isLight ? 'border-[#205089]/14 bg-white' : 'border-[#A8B8C8]/16 bg-[#121A24]/36')}>
      <div className={cx('flex items-center justify-between gap-3 px-4 py-3 sm:px-5', themeClasses.isLight ? 'bg-[#EDF5FB]' : 'bg-[#263B5B]/55')}>
        <span className={cx('text-xs font-black uppercase tracking-[0.08em]', themeClasses.mutedText)}>
          {language === 'vi' ? 'Đầu vào minh họa' : 'Example input'}
        </span>
        <strong className={cx('text-lg font-black tabular-nums', themeClasses.titleText)}>
          {content.steps[0]?.beforeCount ?? 100} document
        </strong>
      </div>
      <ol className="grid">
        {content.steps.map((step, index) => {
          const initialCount = content.steps?.[0]?.beforeCount ?? 100;
          const beforeCount = step.beforeCount ?? initialCount;
          const afterCount = step.afterCount ?? beforeCount;
          const removedCount = beforeCount - afterCount;
          const remainingPercent = Math.max(24, Math.min(100, (afterCount / initialCount) * 100));
          return (
            <li
              key={`${step.shape}-${index}`}
              className={cx(
                'grid min-w-0 gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[minmax(16rem,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-6',
                index > 0 && (themeClasses.isLight ? 'border-t border-[#205089]/10' : 'border-t border-[#A8B8C8]/12'),
              )}
            >
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3 text-xs font-bold">
                  <span className={themeClasses.mutedText}>{language === 'vi' ? `Sau bước ${index + 1}` : `After step ${index + 1}`}</span>
                  <span className={themeClasses.isLight ? 'text-[#A54F00]' : 'text-[#FBC77D]'}>
                    {removedCount > 0 ? `−${removedCount} document` : null}
                  </span>
                </div>
                <div className={cx('h-11 overflow-hidden rounded-lg', themeClasses.isLight ? 'bg-[#E8EEF5]' : 'bg-[#172A43]')}>
                  <div
                    className={cx('flex h-full items-center justify-end rounded-lg px-3 transition-[width] duration-500', filterBarPalettes[index % filterBarPalettes.length])}
                    style={{ width: `${remainingPercent}%` }}
                  >
                    <strong className="whitespace-nowrap text-sm font-black tabular-nums">{afterCount} còn lại</strong>
                  </div>
                </div>
              </div>
              <div className="grid min-w-0 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className={cx('text-base font-black leading-6', themeClasses.titleText)}>{text(step.label, language)}</strong>
                  {step.shape.split(' · ').map((signal) => (
                    <code key={signal} className={cx('rounded-full px-2 py-0.5 text-[0.68rem] font-semibold', themeClasses.isLight ? 'bg-[#EDF5FB] text-[#205089]' : 'bg-[#263B5B]/70 text-[#DCE8F4]')}>
                      {signal}
                    </code>
                  ))}
                </div>
                <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(step.detail, language)}</p>
                {step.examples?.length ? (
                  <ul className={cx('grid list-disc gap-1 pl-5 text-sm font-semibold leading-5 marker:opacity-45', themeClasses.isLight ? 'text-[#52667A]' : 'text-[#BFD3F2]')}>
                    {step.examples.map((example) => <li key={text(example, language)}>{text(example, language)}</li>)}
                  </ul>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
      <div className={cx('flex flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-5', themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#A8B8C8] text-[#121A24]')}>
        <span className="text-xs font-black uppercase tracking-[0.08em]">{language === 'vi' ? 'Corpus minh họa' : 'Example corpus'}</span>
        <strong className="text-lg font-black tabular-nums">{content.steps.at(-1)?.afterCount ?? 50} document</strong>
      </div>
    </div>
  ) : null;
  const mixtureBoard = content.layout === 'mixture-board' && content.steps && content.steps.length >= 4 ? (
    <div className={cx('overflow-hidden rounded-xl border', themeClasses.isLight ? 'border-[#205089]/14 bg-white' : 'border-[#A8B8C8]/16 bg-[#121A24]/36')}>
      <div className={cx('px-4 py-3 text-xs font-black uppercase tracking-[0.08em]', themeClasses.isLight ? 'bg-[#EDF5FB] text-[#52667A]' : 'bg-[#263B5B]/55 text-[#BFD3F2]')}>
        {language === 'vi' ? 'Từ corpus đã lọc đến dữ liệu training' : 'From filtered corpus to training stream'}
      </div>
      <ol className={cx(
        "relative before:absolute before:bottom-10 before:left-[2.125rem] before:top-10 before:w-px before:content-[''] sm:before:left-[2.375rem]",
        themeClasses.isLight ? 'before:bg-[#205089]/18' : 'before:bg-[#A8B8C8]/22',
      )}>
        {content.steps.map((step, index) => {
          const StepIcon = [Database, FileText, SlidersHorizontal, RefreshCw][index] ?? Database;
          const isActive = index === activeMixtureStep;
          return (
            <li
              key={`${step.shape}-${index}`}
              tabIndex={0}
              aria-current={isActive ? 'step' : undefined}
              onMouseEnter={() => setActiveMixtureStep(index)}
              onFocus={() => setActiveMixtureStep(index)}
              className={cx(
                'relative grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] gap-3 px-4 py-4 transition-[background-color,opacity] duration-200 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-4 sm:px-5',
                themeClasses.focusRing,
                isActive ? 'opacity-100' : 'opacity-40',
                index > 0 && (themeClasses.isLight ? 'border-t border-[#205089]/10' : 'border-t border-[#A8B8C8]/12'),
                isActive && (themeClasses.isLight ? 'bg-[#F2F6FA]' : 'bg-[#263B5B]/24'),
              )}
            >
              <span className={cx(
                'relative z-10 grid h-9 w-9 place-items-center rounded-full text-sm font-black',
                isActive
                  ? (themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#A8B8C8] text-[#121A24]')
                  : (themeClasses.isLight ? 'bg-[#E8EEF5] text-[#205089]' : 'bg-[#172A43] text-[#BFD3F2]'),
              )}>
                {index + 1}
              </span>
              <div className="grid min-w-0 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <StepIcon className={cx('h-4 w-4', themeClasses.accentText)} strokeWidth={1.9} aria-hidden="true" />
                  <strong className={cx('text-base font-black leading-6', themeClasses.titleText)}>{text(step.label, language)}</strong>
                </div>
                <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(step.detail, language)}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {step.shape.split(/\s*[·+]\s*/).map((item, itemIndex) => (
                    <code key={item} className={cx(
                      'rounded-full px-4 py-2 text-base font-bold',
                      themeClasses.isLight
                        ? ['bg-[#DCE8F4] text-[#205089]', 'bg-[#DCEEE8] text-[#356A5C]', 'bg-[#EAE3F5] text-[#62518C]', 'bg-[#F8E4D3] text-[#9A5726]', 'bg-[#F2E3EA] text-[#8A4964]'][itemIndex % 5]
                        : ['bg-[#263B5B] text-[#DCE8F4]', 'bg-[#24443C] text-[#CBEDE2]', 'bg-[#392E56] text-[#D7CCF5]', 'bg-[#4A321F] text-[#FFDDBD]', 'bg-[#472D3A] text-[#F4CADB]'][itemIndex % 5],
                    )}>
                      {item}
                    </code>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  ) : null;
  const scaleDashboard = content.layout === 'scale-dashboard' && content.steps?.length ? (
    <div className="grid gap-3">
      <section className={cx('grid gap-4 rounded-xl px-5 py-5 sm:grid-cols-[minmax(10rem,0.42fr)_minmax(0,0.58fr)] sm:items-center', themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#A8B8C8] text-[#121A24]')}>
        <div>
          <span className="block text-[0.68rem] font-black uppercase tracking-[0.12em] opacity-65">{language === 'vi' ? 'Quy mô training data' : 'Training-data scale'}</span>
          <strong className="mt-1 block text-4xl font-black leading-none sm:text-5xl">{content.steps[0].shape}</strong>
        </div>
        <div>
          <strong className="text-base font-black">{text(content.steps[0].label, language)}</strong>
          <p className="mt-1 text-sm font-semibold leading-6 opacity-85">{text(content.steps[0].detail, language)}</p>
        </div>
      </section>
      {content.scaleNote ? (
        <p className={cx('border-l-2 px-4 py-1 text-sm font-semibold leading-6', themeClasses.isLight ? 'border-[#205089]/35 text-[#52667A]' : 'border-[#A8B8C8]/35 text-[#BFD3F2]')}>
          {text(content.scaleNote, language)}
        </p>
      ) : null}
    </div>
  ) : null;

  const scaleRisks = content.layout === 'scale-risks' && content.steps && content.steps.length >= 2 ? (
    <div className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-2">
        {[content.steps[0], content.steps[1]].map((step, index) => (
          <section
            key={step.shape}
            className={cx(
              'grid content-start gap-3 rounded-xl border bg-transparent px-4 py-4',
              themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8B8C8]/16',
            )}
          >
            <div className="flex items-center gap-2">
              {index === 0
                ? <CircleAlert className={cx('h-5 w-5', themeClasses.isLight ? 'text-[#A54F00]' : 'text-[#FBC77D]')} strokeWidth={1.9} aria-hidden="true" />
                : <Search className={cx('h-5 w-5', themeClasses.isLight ? 'text-[#62518C]' : 'text-[#D7CCF5]')} strokeWidth={1.9} aria-hidden="true" />}
              <strong className={cx('text-base font-black', themeClasses.titleText)}>{text(step.label, language)}</strong>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {step.shape.split(' · ').map((risk, riskIndex) => (
                <code key={risk} className={cx(
                  'rounded-full px-3 py-1.5 text-sm font-bold',
                  themeClasses.isLight
                    ? ['bg-[#DCE8F4] text-[#205089]', 'bg-[#DCEEE8] text-[#356A5C]', 'bg-[#EAE3F5] text-[#62518C]', 'bg-[#F8E4D3] text-[#9A5726]', 'bg-[#F2E3EA] text-[#8A4964]'][riskIndex % 5]
                    : ['bg-[#263B5B] text-[#DCE8F4]', 'bg-[#24443C] text-[#CBEDE2]', 'bg-[#392E56] text-[#D7CCF5]', 'bg-[#4A321F] text-[#FFDDBD]', 'bg-[#472D3A] text-[#F4CADB]'][riskIndex % 5],
                )}>
                  {risk}
                </code>
              ))}
            </div>
            <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(step.detail, language)}</p>
          </section>
        ))}
      </div>
    </div>
  ) : null;
  const continuousCycle = content.layout === 'continuous-cycle' && content.steps?.length ? (
    <section className={cx('overflow-hidden rounded-xl border', themeClasses.isLight ? 'border-[#205089]/14 bg-white' : 'border-[#A8B8C8]/16 bg-[#121A24]/36')}>
      <div className={cx('flex items-center gap-3 px-4 py-4 sm:px-5', themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#A8B8C8] text-[#121A24]')}>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15">
          <RefreshCw className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
        </span>
        <div>
          <span className="block text-[0.68rem] font-black uppercase tracking-[0.1em] opacity-65">{language === 'vi' ? 'Không phải pipeline chạy một lần' : 'Not a one-time pipeline'}</span>
          <strong className="text-lg font-black">{text(content.steps[0].label, language)}</strong>
        </div>
      </div>
      <div className="grid gap-4 px-4 py-5 sm:px-5">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
          {content.steps[0].shape.split(' → ').map((stage, index, stages) => (
            <li
              key={stage}
              className={cx(
                'relative grid min-h-24 content-center justify-items-center gap-2 rounded-xl px-3 py-3 text-center',
                index === stages.length - 1
                  ? (themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]')
                  : (themeClasses.isLight ? 'bg-[#EDF5FB] text-[#205089]' : 'bg-[#263B5B]/65 text-[#DCE8F4]'),
              )}
            >
              <span className={cx('grid h-7 w-7 place-items-center rounded-full text-xs font-black text-current', themeClasses.isLight ? 'bg-white/60' : 'bg-black/15')}>{index + 1}</span>
              <strong className="text-sm font-black">{stage}</strong>
              {index < stages.length - 1 ? <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 opacity-45 lg:block" strokeWidth={2.2} aria-hidden="true" /> : null}
            </li>
          ))}
        </ol>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.steps[0].detail, language)}</p>
      </div>
    </section>
  ) : null;
  const stepFlow = scaleDashboard ?? scaleRisks ?? continuousCycle ?? mixtureBoard ?? filterStepFlow ?? defaultStepFlow;
  const comparison = content.comparisons?.length ? (
    <div className={cx('grid overflow-hidden rounded-xl border', !hasSingleComparison && 'md:grid-cols-2')}>
      {content.comparisons.map((item, index) => (
        <article key={item.title} className={cx(
          'grid min-w-0 content-start gap-3 p-5',
          index > 0 && (themeClasses.isLight ? 'border-t border-[#CAD6E3] md:border-l md:border-t-0' : 'border-t border-[#A8B8C8]/18 md:border-l md:border-t-0'),
          hasSingleComparison || index > 0
            ? (themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]/36')
            : (themeClasses.isLight ? 'bg-[#EDF5FB]' : 'bg-[#263B5B]/55'),
        )}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className={cx('text-base font-black', themeClasses.titleText)}>{item.title}</h2>
            {item.href ? (
              <a
                className={cx(
                  'rounded-full px-2.5 py-1 text-xs font-semibold underline decoration-current/40 underline-offset-2 transition-colors hover:decoration-current',
                  themeClasses.focusRing,
                  themeClasses.isLight ? 'bg-[#E8EEF5] text-[#123B68]' : 'bg-[#263B5B] text-[#DCE8F4]',
                )}
                href={item.href}
                rel="noreferrer"
                target="_blank"
              >
                {item.shape}
              </a>
            ) : (
              <code className={cx('rounded-full px-2.5 py-1 text-xs font-black', themeClasses.isLight ? 'bg-[#E8EEF5] text-[#123B68]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{item.shape}</code>
            )}
          </div>
          <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(item.detail, language)}</p>
        </article>
      ))}
    </div>
  ) : null;
  const takeawayPanel = content.takeaway ? (
    <div className={cx('flex items-start gap-3 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]')}>
      {content.view === 'audit' ? <Route className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden="true" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />}
      <p className="text-sm font-semibold leading-6">{text(content.takeaway, language)}</p>
    </div>
  ) : null;
  const misconceptionPanel = content.misconception ? (
    <LlmCallout
      className={content.layout === 'scale-risks' ? '!bg-transparent' : undefined}
      icon={CircleAlert}
      tone="accent"
      themeClasses={themeClasses}
    >
      <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.misconception, language)}</p>
    </LlmCallout>
  ) : null;
  return (
    <section className="grid gap-5">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      {content.view === 'position' ? comparison : stepFlow}
      {content.code.length > 0 ? (
        <div className="grid gap-3">
          <CodeBlock code={content.code} showLineNumbers themeClasses={themeClasses} />
          {content.output?.length ? <CodeBlock variant="output" code={content.output.join('\n')} copyable={false} themeClasses={themeClasses} /> : null}
        </div>
      ) : null}
      {(content.layout === 'filter-pipeline' || content.layout === 'mixture-board' || content.layout === 'scale-dashboard' || content.layout === 'scale-risks') && takeawayPanel && misconceptionPanel ? (
        <div className="grid items-stretch gap-3 md:grid-cols-2">
          {takeawayPanel}
          {misconceptionPanel}
        </div>
      ) : (
        <>
          {takeawayPanel}
          {misconceptionPanel}
        </>
      )}
    </section>
  );
}

const BPE_INFERENCE_ICONS = {
  units: Type,
  match: Scissors,
  rank: ListOrdered,
  stop: CheckCircle2,
} satisfies Record<LlmBpeInferenceFlowContent['stages'][number]['id'], LucideIcon>;

export function LlmBpeInferenceFlow({ content, language, themeClasses }: LlmContentRendererProps<LlmBpeInferenceFlowContent>) {
  const renderTokens = (tokens: string[]) => (
    <div className="flex min-w-0 flex-wrap justify-center gap-1.5">
      {tokens.map((token, index) => (
        <TokenChip key={`${token}-${index}`} className="rounded-md px-2.5 py-1.5 text-sm font-black" themeClasses={themeClasses}>{token === '␠' ? 'space' : token}</TokenChip>
      ))}
    </div>
  );
  return (
    <section className="grid gap-5">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="grid gap-2 md:grid-cols-4 md:gap-0">
        {content.stages.map((stage, index) => {
          const Icon = BPE_INFERENCE_ICONS[stage.id];
          return (
            <Fragment key={stage.id}>
              <article className={cx(
                'grid min-w-0 grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-3 rounded-lg px-3 py-3 md:grid-cols-1 md:justify-items-center md:gap-2 md:rounded-none md:px-4 md:py-4 md:text-center',
                index === 0 && 'md:rounded-l-lg',
                index === content.stages.length - 1 && 'md:rounded-r-lg',
                themeClasses.isLight ? (index % 2 === 0 ? 'bg-[#EDF5FB]' : 'bg-[#F5F8FB]') : (index % 2 === 0 ? 'bg-[#263B5B]/55' : 'bg-[#121A24]/48'),
              )}>
                <span className={cx('grid h-10 w-10 place-items-center rounded-lg', themeClasses.isLight ? 'bg-white text-[#205089]' : 'bg-[#172A43] text-[#BFD3F2]')}>
                  <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className={cx('text-sm font-black leading-5', themeClasses.titleText)}>{text(stage.title, language)}</h2>
                  <p className={cx('mt-1 text-xs leading-5', themeClasses.bodyText)}>{text(stage.detail, language)}</p>
                </div>
              </article>
              {index < content.stages.length - 1 ? <ArrowDown className={cx('mx-auto h-4 w-4 md:hidden', themeClasses.accentText)} aria-hidden="true" /> : null}
            </Fragment>
          );
        })}
      </div>
      <div className={cx('grid items-center gap-3 rounded-xl px-4 py-5 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#0E1620]/62')}>
        {renderTokens(content.before)}
        <div className="grid justify-items-center gap-1">
          <span className={cx('text-xs font-black', themeClasses.mutedText)}>{text(content.rule, language)}</span>
          <ArrowDown className={cx('h-5 w-5 md:hidden', themeClasses.accentText)} aria-hidden="true" />
          <ArrowRight className={cx('hidden h-5 w-5 md:block', themeClasses.accentText)} aria-hidden="true" />
        </div>
        {renderTokens(content.after)}
      </div>
      <LlmCallout icon={CircleAlert} tone="accent" themeClasses={themeClasses}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.misconception, language)}</p>
      </LlmCallout>
    </section>
  );
}

export function LlmBpeFallback({ content, language, themeClasses }: LlmContentRendererProps<LlmBpeFallbackContent>) {
  return (
    <section className="grid gap-4">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="grid overflow-hidden rounded-xl border md:grid-cols-2">
        {content.examples.map((example, index) => (
          <article
            key={example.source}
            className={cx(
              'grid min-w-0 content-start gap-4 p-5',
              index > 0 && (themeClasses.isLight ? 'border-t border-[#CAD6E3] md:border-l md:border-t-0' : 'border-t border-[#A8B8C8]/18 md:border-l md:border-t-0'),
              themeClasses.isLight ? 'bg-white' : 'bg-[#121A24]/36',
            )}
          >
            <code className={cx('w-fit max-w-full break-words rounded-lg px-3 py-2 text-base font-black', themeClasses.isLight ? 'bg-[#E8EEF5] text-[#123B68]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{example.source}</code>
            <div className="flex min-w-0 flex-wrap gap-1.5">
              {example.tokens.map((token, tokenIndex) => <TokenChip key={`${token}-${tokenIndex}`} className="rounded-md px-2 py-1 text-xs font-black" themeClasses={themeClasses}>{token}</TokenChip>)}
            </div>
            <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(example.explanation, language)}</p>
          </article>
        ))}
      </div>
      <div className={cx('flex items-start gap-3 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]')}>
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
        <p className="text-sm font-semibold leading-6">{text(content.fallback, language)}</p>
      </div>
      <LlmCallout icon={CircleAlert} tone="accent" themeClasses={themeClasses}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.misconception, language)}</p>
      </LlmCallout>
    </section>
  );
}

export function LlmVocabularyTradeoff({ content, language, themeClasses }: LlmContentRendererProps<LlmVocabularyTradeoffContent>) {
  return (
    <section className="grid gap-4">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="grid overflow-hidden rounded-xl border md:grid-cols-2">
        {content.sides.map((side, index) => (
          <article
            key={side.id}
            className={cx(
              'grid content-start gap-4 p-5',
              index > 0 && (themeClasses.isLight ? 'border-t border-[#CAD6E3] md:border-l md:border-t-0' : 'border-t border-[#A8B8C8]/18 md:border-l md:border-t-0'),
              side.id === 'small'
                ? (themeClasses.isLight ? 'bg-[#FFF9ED]' : 'bg-[#594821]/20')
                : (themeClasses.isLight ? 'bg-[#EDF5FB]' : 'bg-[#263B5B]/55'),
            )}
          >
            <h2 className={cx('text-base font-black', themeClasses.titleText)}>{text(side.title, language)}</h2>
            <dl className="grid gap-3 text-sm leading-6">
              <div><dt className={cx('font-black', themeClasses.accentText)}>Sequence</dt><dd className={themeClasses.bodyText}>{text(side.sequence, language)}</dd></div>
              <div><dt className={cx('font-black', themeClasses.accentText)}>Embedding / output</dt><dd className={themeClasses.bodyText}>{text(side.matrix, language)}</dd></div>
              <div><dt className={cx('font-black', themeClasses.accentText)}>{language === 'vi' ? 'Học token' : 'Token learning'}</dt><dd className={themeClasses.bodyText}>{text(side.learning, language)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
      <div className={cx('grid gap-3 rounded-xl px-4 py-4', themeClasses.isLight ? 'bg-[#F5F8FB]' : 'bg-[#121A24]/48')}>
        <code className={cx('min-w-0 break-words text-sm font-black', themeClasses.titleText)}>{content.example.source}</code>
        <div className="grid gap-2 sm:grid-cols-2">
          {content.example.tokenizations.map((tokens, rowIndex) => (
            <div key={rowIndex} className="flex min-w-0 flex-wrap gap-1.5">
              {tokens.map((token, tokenIndex) => <TokenChip key={`${token}-${tokenIndex}`} className="rounded-md px-2 py-1 text-xs font-black" themeClasses={themeClasses}>{token}</TokenChip>)}
            </div>
          ))}
        </div>
      </div>
      <div className={cx('flex items-start gap-3 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#EAF5F0] text-[#24584D]' : 'bg-[#17332D] text-[#CBEDE2]')}>
        <SlidersHorizontal className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
        <p className="text-sm font-semibold leading-6">{text(content.takeaway, language)}</p>
      </div>
      <LlmCallout icon={CircleAlert} tone="accent" themeClasses={themeClasses}>
        <p className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>{text(content.misconception, language)}</p>
      </LlmCallout>
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
      <div className="grid gap-3">
        <CodeBlock code={content.code} showLineNumbers themeClasses={themeClasses} />
        {content.output.length > 0 ? <CodeBlock variant="output" code={content.output.join('\n')} copyable={false} themeClasses={themeClasses} /> : null}
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

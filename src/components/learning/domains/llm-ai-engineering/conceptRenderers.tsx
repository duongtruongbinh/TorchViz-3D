import { Angry, ArrowDown, ArrowLeft, ArrowRight, Braces, CheckCircle2, ChevronRight, CircleAlert, CircleDot, CornerDownLeft, Cpu, Database, Info, MousePointer2, RotateCcw, Scissors, SlidersHorizontal, Sparkles, Type, type LucideIcon, Wrench, X } from 'lucide-react';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import type { LearningLessonExtra, LearningTokenExample } from '../../authoredTypes';
import { getStrings, type Language } from '../../../../lib/localization';
import { cx, getLearningLabTheme } from '../../theme';
import { ExtraFrame } from '../../learningMdxComponents';
import { getLearningLocalizedText as text } from '../../learningText';
import { scrollLearningLabElementIntoView } from '../../lesson/scrolling';
import type {
  LlmAcademiaIndustryComparisonContent,
  LlmContentRendererProps,
  LlmPretrainingDatasetCardsContent,
  LlmTrainingComponentsContent,
} from './rendererTypes';

const LLM_LEARNING_ASSETS: Record<string, string> = {
  'llm-from-scratch-roadmap.ai-hierarchy': new URL('../../../../assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/01-llm-from-scratch-roadmap-ai-hierarchy.png', import.meta.url).href,
  'llm-from-scratch-roadmap.next-token-loop': new URL('../../../../assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/01-llm-from-scratch-roadmap-next-token-loop.png', import.meta.url).href,
  'llm-from-scratch-roadmap.why-llms-popular-product': new URL('../../../../assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/01-llm-from-scratch-roadmap-why-llms-popular-product.png', import.meta.url).href,
  'llm-from-scratch-roadmap.why-llms-popular-technical': new URL('../../../../assets/learning/llm-ai-engineering/llm-from-scratch/roadmap/01-llm-from-scratch-roadmap-why-llms-popular-technical.png', import.meta.url).href,
};

function getLlmLearningAssetUrl(assetId: string): string {
  return LLM_LEARNING_ASSETS[assetId] ?? '';
}

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

export function LlmTrainingComponents({ content, language, themeClasses }: LlmContentRendererProps<LlmTrainingComponentsContent>) {
  return (
    <section className="grid gap-4">
      <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(content.body, language)}</p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {content.cards.map((card, index) => (
          <TrainingComponentCard key={text(card.title, language)} card={card} index={index} language={language} themeClasses={themeClasses} focusPanel />
        ))}
      </div>
    </section>
  );
}

const PRETRAINING_DATASET_STYLES = {
  c4: ['bg-[#DCE8F4]', 'text-[#205089]', Database],
  pile: ['bg-[#E8E0F2]', 'text-[#69468A]', Braces],
  dolma: ['bg-[#DCEEE8]', 'text-[#2E6B5D]', SlidersHorizontal],
  fineweb: ['bg-[#F4E8C8]', 'text-[#70551A]', Sparkles],
} satisfies Record<LlmPretrainingDatasetCardsContent['datasets'][number]['id'], [string, string, LucideIcon]>;

export function LlmPretrainingDatasetCards({ content, language, themeClasses }: LlmContentRendererProps<LlmPretrainingDatasetCardsContent>) {
  return (
    <section className="grid gap-4">
      <p className={cx('text-base leading-7', themeClasses.bodyText)}>{text(content.lead, language)}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {content.datasets.map((dataset) => {
          const [topClass, accentClass, Icon] = PRETRAINING_DATASET_STYLES[dataset.id];
          return (
            <article
              key={dataset.id}
              className={cx(
                'grid min-h-[18rem] grid-rows-[7.5rem_minmax(0,1fr)] overflow-hidden rounded-lg border',
                themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/36',
              )}
            >
              <div className={cx('flex items-center justify-between gap-4 border-b border-black/5 px-5', themeClasses.isLight ? topClass : 'bg-[#263B5B]')}>
                <div>
                  <p className={cx('text-xs font-bold', themeClasses.isLight ? accentClass : 'text-[#BFD3F2]')}>{text(dataset.category, language)}</p>
                  <h3 className={cx('mt-1 text-2xl font-black tracking-[-0.02em]', themeClasses.titleText)}>{dataset.name}</h3>
                </div>
                <div className={cx('grid h-12 w-12 shrink-0 place-items-center rounded-xl', themeClasses.isLight ? `bg-white ${accentClass}` : 'bg-[#172A43] text-[#BFD3F2]')}>
                  <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                </div>
              </div>
              <div className="grid content-start gap-3 p-5">
                <p className={cx('font-mono text-lg font-black', themeClasses.accentText)}>{dataset.scale}</p>
                <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(dataset.brief, language)}</p>
                <a
                  href={dataset.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cx('mt-auto inline-flex w-fit items-center gap-1 text-sm font-bold underline decoration-1 underline-offset-4', themeClasses.accentText)}
                >
                  Dataset / paper <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
      <p className={cx('text-sm leading-6', themeClasses.mutedText)}>{text(content.note, language)}</p>
    </section>
  );
}

export function LlmAiHierarchy({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'motivation' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const intro = extra.body.map((paragraph) => text(paragraph, language));
  const conceptName = 'Artificial Intelligence (AI)';
  const [leadBeforeConcept, leadAfterConcept = ''] = intro[0]?.split(conceptName) ?? ['', ''];
  const communicationHighlight = 'giúp việc giao tiếp dễ dàng hơn';
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);
  const selectedRow = extra.hierarchy?.rows.find((candidate) => candidate.shortName === selectedKeyword);
  const aiRow = extra.hierarchy?.rows.find((candidate) => candidate.shortName === 'AI');
  const activeRow = selectedRow ?? aiRow;

  useEffect(() => {
    if (!selectedKeyword) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedKeyword(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedKeyword]);

  return (
    <div className="overflow-hidden">
      <section className="w-full" aria-label={language === 'vi' ? 'Phạm vi các lĩnh vực AI' : 'Scope of AI fields'}>
        <p className={cx('text-base font-semibold leading-8 [text-wrap:pretty] sm:text-lg', themeClasses.titleText)}>
          {leadBeforeConcept}<strong className={themeClasses.accentText}>Artificial Intelligence</strong>{language === 'vi' ? ' thành ' : ' into '}{leadAfterConcept.replace(/^\s*(và|and)\s*/i, '')}
        </p>

        <div className="mt-6 grid items-center gap-6 lg:grid-cols-[minmax(0,0.68fr)_minmax(28rem,1.32fr)] lg:gap-8">
          <div className={cx('grid gap-4 text-base leading-[1.625rem]', themeClasses.bodyText)}>
            {intro.slice(1).map((paragraph) => {
              const [beforeHighlight, afterHighlight] = paragraph.split(communicationHighlight);
              return (
                <p key={paragraph}>
                  {beforeHighlight}
                  {afterHighlight !== undefined && (
                    <span className={cx('font-semibold', themeClasses.accentText)}>
                      {communicationHighlight}
                    </span>
                  )}
                  {afterHighlight}
                </p>
              );
            })}
          </div>

          <figure className="flex min-w-0 items-center justify-center">
            <img
              src={getLlmLearningAssetUrl(extra.image)}
              alt={text(extra.imageAlt, language)}
              className="aspect-[1672/941] w-full object-contain"
              loading="lazy"
            />
          </figure>
        </div>

        <div
          className={cx('relative mt-6 overflow-hidden rounded-xl', themeClasses.isLight ? 'bg-[#205089]/[0.055]' : 'bg-[#A8B8C8]/[0.065]')}
          role="group"
          aria-label={extra.hierarchy ? text(extra.hierarchy.ariaLabel, language) : text(extra.imageAlt, language)}
        >
          <button
            type="button"
            aria-pressed={Boolean(selectedRow)}
            aria-label={selectedRow ? (language === 'vi' ? 'Nhấn lần nữa để quay lại sơ đồ tổng quan' : 'Click again to return to the overview') : undefined}
            title={selectedRow ? (language === 'vi' ? 'Nhấn lần nữa để quay lại' : 'Click again to go back') : undefined}
            onClick={() => setSelectedKeyword((current) => current ? null : 'AI')}
            className={cx(
              'flex min-h-20 w-full items-end justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70',
              themeClasses.isLight ? 'bg-[#205089] text-white' : 'bg-[#A8B8C8] text-[#121A24]',
            )}>
            <span key={activeRow?.shortName ?? 'AI'} className="learning-ai-scope-promote flex items-center gap-3 text-[2.75rem] font-black leading-none tracking-[-0.04em]">
              {selectedRow
                ? <ArrowLeft className="h-6 w-6 shrink-0" strokeWidth={2.4} aria-hidden="true" />
                : <ChevronRight className="h-6 w-6 shrink-0 opacity-80" strokeWidth={2.4} aria-hidden="true" />}
              {activeRow?.shortName ?? 'AI'}
            </span>
            <span key={activeRow?.fullName ?? 'Artificial Intelligence'} className="learning-ai-scope-promote flex items-center justify-end gap-3 pb-1 text-right text-xs font-bold sm:text-sm">
              <span className="opacity-80">{activeRow?.fullName ?? 'Artificial Intelligence'}</span>
            </span>
          </button>

          {selectedRow ? (
            <div key={selectedRow.shortName} className="grid min-h-[14.5rem] content-center px-6 py-8 sm:px-10">
              <p className={cx('w-full text-lg leading-8', themeClasses.bodyText)} aria-live="polite">
                {text(selectedRow.description, language).split(/(\s+)/).map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="learning-ai-scope-word"
                    style={{ animationDelay: `${120 + index * 28}ms` }}
                  >
                    {word}
                  </span>
                ))}
              </p>
            </div>
          ) : (
            <div className="p-3 sm:p-4">
              <div className={cx('mx-auto w-[90%] overflow-hidden rounded-lg', themeClasses.isLight ? 'bg-[#7395B6]/16' : 'bg-[#496F98]/18')}>
              <button type="button" onClick={() => setSelectedKeyword('ML')} className={cx('flex min-h-11 w-full items-center justify-between gap-3 px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70', themeClasses.isLight ? 'bg-[#7395B6] text-neutral-100' : 'bg-[#496F98] text-neutral-200')}>
                <span className="flex items-center gap-2 font-black"><ChevronRight className="h-4 w-4 opacity-75" strokeWidth={2.4} aria-hidden="true" />ML</span>
                <span className="text-xs font-bold opacity-75">Machine Learning</span>
              </button>

              <div className="p-2.5 sm:p-3">
                <div className={cx('mx-auto w-[84%] overflow-hidden rounded-lg', themeClasses.isLight ? 'bg-[#9DB3C9]/24' : 'bg-[#344C68]/26')}>
                  <button type="button" onClick={() => setSelectedKeyword('DL')} className={cx('flex min-h-11 w-full items-center justify-between gap-3 px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70', themeClasses.isLight ? 'bg-[#9DB3C9] text-neutral-100' : 'bg-[#344C68] text-neutral-200')}>
                    <span className="flex items-center gap-2 font-black"><ChevronRight className="h-4 w-4 opacity-75" strokeWidth={2.4} aria-hidden="true" />DL</span>
                    <span className="text-xs font-bold opacity-75">Deep Learning</span>
                  </button>

                  <div className="flex gap-2 p-2.5 sm:p-3">
                    <div className={cx('min-w-0 flex-1 overflow-hidden rounded-lg', themeClasses.isLight ? 'bg-[#C8D6E4]/38' : 'bg-[#293C52]/44')}>
                      <button type="button" onClick={() => setSelectedKeyword('CV')} className={cx('flex min-h-11 w-full items-center justify-between gap-2 px-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70', themeClasses.isLight ? 'bg-[#C8D6E4] text-[#173F5F]' : 'bg-[#293C52] text-[#F2F6FA]')}>
                        <span className="flex items-center gap-2 font-black"><ChevronRight className="h-4 w-4 opacity-70" strokeWidth={2.4} aria-hidden="true" />CV</span>
                      </button>
                    </div>
                    <div className={cx('min-w-0 flex-1 overflow-hidden rounded-lg', themeClasses.isLight ? 'bg-[#C8D6E4]/38' : 'bg-[#293C52]/44')}>
                      <button type="button" onClick={() => setSelectedKeyword('NLP')} className={cx('flex min-h-11 w-full items-center justify-between gap-2 px-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70', themeClasses.isLight ? 'bg-[#C8D6E4] text-[#173F5F]' : 'bg-[#293C52] text-[#F2F6FA]')}>
                        <span className="flex items-center gap-2 font-black"><ChevronRight className="h-4 w-4 opacity-70" strokeWidth={2.4} aria-hidden="true" />NLP</span>
                        <span className="hidden text-xs font-bold opacity-70 sm:inline">Language</span>
                      </button>
                      <div className="p-2">
                        <div className={cx('overflow-hidden rounded-md', themeClasses.isLight ? 'bg-[#D97706]/12' : 'bg-[#F6C453]/12')}>
                          <button type="button" onClick={() => setSelectedKeyword('LLM')} className={cx('flex min-h-11 w-full items-center justify-between gap-2 px-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80', themeClasses.isLight ? 'bg-[#D97706] text-white' : 'bg-[#F6C453] text-[#332006]')}>
                            <span className="flex items-center gap-2 font-black"><ChevronRight className="h-4 w-4 opacity-80" strokeWidth={2.4} aria-hidden="true" />LLM</span>
                            <span className="hidden text-xs font-bold opacity-70 sm:inline">{language === 'vi' ? 'Trọng tâm' : 'Our focus'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          )}
        </div>
      </section>
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

          <div className={cx('grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold leading-8 md:text-lg', themeClasses.isLight ? 'bg-transparent text-[#334155]' : 'bg-[#121A24]/42 text-[#F2F6FA]')}>
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
          <div key={text(note, language)} className={cx('flex w-full gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold leading-6', themeClasses.sectionAccent.note)}>
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

  if (extra.id === 'ai-scope-convention') {
    const scopeConvention = (
      <ScopeConventionPanel extra={extra} language={language} themeClasses={themeClasses} />
    );
    return panelTitle ? (
      <ExtraFrame title={panelTitle} themeClasses={themeClasses}>
        {scopeConvention}
      </ExtraFrame>
    ) : scopeConvention;
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
          <div className="grid gap-2">
            <div className="grid gap-2">
              {extra.comparisonTable.rows.map((row, rowIndex) => (
                <div
                  key={text(row.label, language)}
                  className={cx(
                    'grid overflow-hidden rounded-lg md:grid-cols-[7rem_minmax(0,1fr)]',
                    themeClasses.isLight
                      ? rowIndex === 0
                        ? 'bg-[#E8F0F7]'
                        : rowIndex === 1
                          ? 'bg-[#E8F2EF]'
                          : 'bg-[#FFF1DE]'
                      : rowIndex === 0
                        ? 'bg-[#496F98]/18'
                        : rowIndex === 1
                          ? 'bg-[#4F7D70]/18'
                          : 'bg-[#D97706]/16',
                  )}
                >
                  <div
                    className={cx(
                      'flex min-h-16 items-center px-4 py-3 text-2xl font-black tracking-[-0.03em] text-white md:min-h-full',
                      rowIndex === 0 ? 'bg-[#2F6F9F]' : rowIndex === 1 ? 'bg-[#477C6C]' : 'bg-[#D97706]',
                    )}
                  >
                    {text(row.label, language)}
                  </div>
                  <div className="grid md:grid-cols-3">
                    {row.cells.map((cell, cellIndex) => {
                      const bulletItems = text(cell, language)
                        .split(/[,;]\s*/)
                        .map((item) => item.trim().replace(/\.$/, ''))
                        .map((item) => item ? `${item[0].toLocaleUpperCase(language)}${item.slice(1)}` : item)
                        .filter(Boolean);

                      return (
                        <div
                          key={`${text(row.label, language)}-${cellIndex}`}
                          className={cx(
                            'min-w-0 px-4 py-3',
                            cellIndex > 0 && (themeClasses.isLight ? 'border-t border-black/8 md:border-l md:border-t-0' : 'border-t border-white/10 md:border-l md:border-t-0'),
                          )}
                        >
                          <div className={cx('mb-1 text-xs font-black leading-4', themeClasses.isLight ? 'text-[#254F70]' : 'text-[#D7EAFE]')}>
                            {text(extra.comparisonTable?.columns[cellIndex + 1] ?? row.label, language)}
                          </div>
                          <ul className={cx('grid list-disc pl-4 text-sm leading-5 marker:text-current/55', themeClasses.bodyText)}>
                            {bulletItems.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
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
            <div className="grid w-full gap-2">
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

function ScopeConventionPanel({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptPanel' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const historyRows = extra.highlights?.slice(0, 2) ?? [];

  return (
    <div className="grid gap-5">
      <div className="grid gap-2">
        {extra.body?.slice(0, 1).map((paragraph, index) => {
          const lines = text(paragraph, language).split('\n').filter(Boolean);
          if (lines.length > 0) {
            return (
              <div key={text(paragraph, language)} className={cx('grid gap-2 rounded-lg border px-3 py-3', themeClasses.isLight ? 'border-[#D97706]/18 bg-[#FFF7ED]' : 'border-[#F59E0B]/20 bg-[#3A2613]/40')}>
                <div className={cx('flex items-center gap-2 text-xs font-black uppercase tracking-wide', themeClasses.isLight ? 'text-[#A54F00]' : 'text-[#FBC77D]')}>
                  <CircleAlert className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                  <span>{language === 'vi' ? 'Đừng đọc sơ đồ như lịch sử tuyệt đối' : 'Do not read the diagram as absolute history'}</span>
                </div>
                <ul className="grid gap-2">
                  {lines.map((line) => (
                    <li key={line} className={cx('flex gap-2 text-sm font-semibold leading-6', themeClasses.bodyText)}>
                      <CheckCircle2 className={cx('mt-1 h-4 w-4 shrink-0', themeClasses.isLight ? 'text-[#D97706]' : 'text-[#F59E0B]')} strokeWidth={2.1} aria-hidden="true" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          return <p key={text(paragraph, language)} className={cx(index === 0 ? 'text-base font-semibold leading-7' : 'text-sm leading-7', themeClasses.bodyText)}>{lines[0]}</p>;
        })}
      </div>

      {historyRows.length > 0 ? (
        <div className="grid gap-2">
          {historyRows.map((item, index) => {
            const descriptionLines = text(item.description, language).split('\n').filter(Boolean);
            const bulletLines = descriptionLines.slice(0, 2);
            const closingLine = descriptionLines[2];
            return (
              <section
                key={text(item.shortName, language)}
                className={cx(
                  'grid overflow-hidden rounded-lg md:grid-cols-[6rem_minmax(0,1fr)]',
                  themeClasses.isLight ? (index === 0 ? 'bg-[#EEF4FA]' : 'bg-[#F0F4F2]') : 'bg-[#121A24]/38',
                )}
              >
                <div className={cx('flex items-center px-4 py-3 text-2xl font-black text-white', index === 0 ? 'bg-[#2F6F9F]' : 'bg-[#477C6C]')}>
                  {text(item.shortName, language)}
                </div>
                <div className="grid gap-2 px-4 py-3">
                  <ul className={cx('grid list-disc gap-0.5 pl-4 text-sm leading-5 marker:text-current/50', themeClasses.bodyText)}>
                    {bulletLines.map((line) => <li key={line}>{line}</li>)}
                  </ul>
                  {closingLine ? <p className={cx('text-sm leading-5', themeClasses.bodyText)}>{closingLine}</p> : null}
                </div>
              </section>
            );
          })}
        </div>
      ) : null}

      {extra.body?.slice(1).map((paragraph) => (
        <p key={text(paragraph, language)} className={cx('text-sm leading-7', themeClasses.bodyText)}>
          {text(paragraph, language)}
        </p>
      ))}

      <div className="grid items-stretch gap-2 md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)]">
        <div className={cx('grid content-center gap-1 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#DCE8F4] text-[#173F5F]' : 'bg-[#496F98]/28 text-[#DCE8F4]')}>
          <span className="text-xs font-bold opacity-70">{language === 'vi' ? 'DOMAIN DỮ LIỆU' : 'DATA DOMAIN'}</span>
          <strong className="text-xl font-black">CV / NLP</strong>
          <span className="text-xs leading-5 opacity-75">{language === 'vi' ? 'Hình ảnh · video · ngôn ngữ' : 'Images · video · language'}</span>
        </div>
        <div className={cx('grid h-8 place-items-center self-center text-2xl font-light md:h-auto', themeClasses.mutedText)} aria-hidden="true">+</div>
        <div className={cx('grid content-center gap-1 rounded-lg px-4 py-3', themeClasses.isLight ? 'bg-[#E4ECE8] text-[#315F53]' : 'bg-[#4F7D70]/26 text-[#D7EEE7]')}>
          <span className="text-xs font-bold opacity-70">{language === 'vi' ? 'NHÓM PHƯƠNG PHÁP' : 'METHOD FAMILY'}</span>
          <strong className="text-xl font-black">ML / DL</strong>
          <span className="text-xs leading-5 opacity-75">{language === 'vi' ? 'Thuật toán · neural networks' : 'Algorithms · neural networks'}</span>
        </div>
        <div className={cx('grid h-8 place-items-center self-center text-2xl font-light md:h-auto', themeClasses.mutedText)} aria-hidden="true">=</div>
        <div className={cx('grid content-center gap-1 rounded-lg px-4 py-3 text-white', themeClasses.isLight ? 'bg-[#205089]' : 'bg-[#496F98]')}>
          <span className="text-xs font-bold opacity-70">{language === 'vi' ? 'CÁCH ĐỌC TRONG KHÓA HỌC' : 'COURSE CONVENTION'}</span>
          <strong className="text-xl font-black">AI application</strong>
          <span className="text-xs leading-5 opacity-75">{language === 'vi' ? 'Phương pháp AI trong một domain' : 'AI methods within a domain'}</span>
        </div>
      </div>

      {extra.bodyAfter?.map((paragraph) => (
        <p key={text(paragraph, language)} className={cx('w-full text-sm font-semibold leading-6', themeClasses.accentText)}>
          {text(paragraph, language)}
        </p>
      ))}
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

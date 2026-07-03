import { Angry, CheckCircle2, Info, MousePointer2, RotateCcw, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import type { LearningLessonExtra } from '../../../../core/learning/types';
import { getStrings, type Language } from '../../../../lib/localization';
import { cx, getLearningLabTheme } from '../../theme';
import { getLearningAssetUrl } from '../../lesson/extras/assetRegistry';
import { text } from '../../lesson/extras/lessonExtraText';
import { scrollLearningLabElementIntoView } from '../../lesson/scrolling';

type LearningThemeClasses = ReturnType<typeof getLearningLabTheme>;

type DomainExtraProps<T extends LearningLessonExtra = LearningLessonExtra> = {
  extra: T;
  language: Language;
  themeClasses: LearningThemeClasses;
};

export function renderLlmAiEngineeringExtra({ extra, language, themeClasses }: DomainExtraProps): ReactElement | null {
  if (extra.kind === 'motivation') {
    return <MotivationBlock extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'conceptInteraction') {
    return <ConceptInteraction extra={extra} language={language} themeClasses={themeClasses} />;
  }

  return null;
}

function MotivationBlock({ extra, language, themeClasses }: {
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
            src={getLearningAssetUrl(extra.image)}
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

  return (
    <div className="mt-5 grid w-full gap-3" aria-label={text(hierarchy.ariaLabel, language)}>
      {leadingRows.map((row) => (
        <HierarchyRow key={row.shortName} row={row} language={language} themeClasses={themeClasses} />
      ))}

      {branchRows.length ? (
        <div className="grid gap-3 py-2">
          {hierarchy.branchLabel && (
            <div className={cx('text-xs font-normal uppercase tracking-wide', themeClasses.mutedText)}>
              {text(hierarchy.branchLabel, language)}
            </div>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {branchRows.map((row) => (
              <HierarchyRow key={row.shortName} row={row} language={language} themeClasses={themeClasses} />
            ))}
          </div>
        </div>
      ) : null}

      {targetRows.map((row) => (
        <HierarchyRow key={row.shortName} row={row} language={language} themeClasses={themeClasses} />
      ))}
    </div>
  );
}

function HierarchyRow({ row, language, themeClasses }: {
  row: NonNullable<Extract<LearningLessonExtra, { kind: 'motivation' }>['hierarchy']>['rows'][number];
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
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
      className={cx(
        'group grid gap-2 px-3 py-2 text-sm transition-colors sm:items-start',
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


function ConceptInteraction({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptInteraction' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedWordIndexes, setSelectedWordIndexes] = useState<number[]>([]);
  const [sentenceFeedbackPulseKey, setSentenceFeedbackPulseKey] = useState(0);
  const selectedOption = selectedIndex === null ? null : extra.options[selectedIndex];
  const selectedLabel = selectedOption ? text(selectedOption.label, language) : text(extra.blankLabel, language);
  const labels = extra.labels;
  const noteText = extra.note ? text(extra.note, language) : '';
  const sentenceBuilder = extra.sentenceBuilder;
  const interactionPlacement = extra.interactionPlacement ?? 'inline';
  const shouldShowIntro = interactionPlacement !== 'only';
  const shouldShowInteractions = interactionPlacement !== 'none';
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

      {shouldShowInteractions && (
        <div className={cx('mt-4 grid gap-3 rounded-lg border p-3 text-center', themeClasses.isLight ? 'border-[#205089]/14 bg-white' : 'border-[#A8B8C8]/16 bg-[#A8B8C8]/7')}>
        <div className="grid justify-items-center gap-2.5">
          <div className={cx('flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
            <Sparkles className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
            {text(labels.chooseNextToken, language)}
          </div>

          <div className={cx('flex flex-wrap items-center justify-center gap-2 text-base font-semibold leading-8 md:text-lg', themeClasses.titleText)}>
            <span>{text(extra.prompt, language)}</span>
            <span
              className={cx(
                'inline-flex min-h-10 min-w-[8rem] items-center justify-center rounded-lg border px-3 text-sm font-black transition-colors',
                selectedOption?.isCorrect
                  ? themeClasses.isLight ? 'border-[#2FBF71]/42 bg-[#2FBF71]/14 text-[#1F6F48]' : 'border-[#2FBF71]/46 bg-[#2FBF71]/18 text-[#A6E8C1]'
                  : selectedOption
                    ? themeClasses.isLight ? 'border-[#C45151]/34 bg-[#C45151]/8 text-[#8C3333]' : 'border-[#F87171]/36 bg-[#F87171]/12 text-[#FCA5A5]'
                    : themeClasses.isLight ? 'border-[#205089]/24 bg-white/70 text-[#123B68]' : 'border-[#A8B8C8]/24 bg-[#121A24]/48 text-[#F2F6FA]',
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
          <div className={cx('flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
            <MousePointer2 className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
            {text(sentenceBuilder.title, language)}
          </div>

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
                <span className={cx('inline-flex min-h-9 min-w-[9rem] items-center justify-center rounded-lg border border-dashed px-3 text-sm font-black', themeClasses.isLight ? 'border-[#205089]/28 text-[#123B68]/70' : 'border-[#A8B8C8]/28 text-[#F2F6FA]/62')}>
                  {text(labels.emptySentence, language)}
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
            src={getLearningAssetUrl(extra.image)}
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

      {extra.tokenExample && (
        <>
          <TokenExampleBlock example={extra.tokenExample} language={language} themeClasses={themeClasses} />
          <SpecialTokenBlock example={extra.tokenExample} language={language} themeClasses={themeClasses} />
        </>
      )}
    </div>
  );
}

function TokenExampleBlock({ example, language, themeClasses }: {
  example: NonNullable<Extract<LearningLessonExtra, { kind: 'conceptInteraction' }>['tokenExample']>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <section className={cx(getConceptTileClass(themeClasses), 'gap-4')}>
      <div className={cx('text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
        {text(example.title, language)}
      </div>

      <div className="grid gap-3">
        {example.variants.map((variant) => (
          <TokenExampleGroup key={text(variant.label, language)} item={variant} language={language} themeClasses={themeClasses} />
        ))}
      </div>

      <div className="grid gap-2">
        {example.notes.map((note) => (
          <div key={text(note, language)} className={cx('flex gap-2 text-sm font-semibold leading-6', themeClasses.bodyText)}>
            <Info className={cx('mt-1 h-4 w-4 shrink-0', themeClasses.accentText)} strokeWidth={2.1} aria-hidden="true" />
            <p>{text(note, language)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SpecialTokenBlock({ example, language, themeClasses }: {
  example: NonNullable<Extract<LearningLessonExtra, { kind: 'conceptInteraction' }>['tokenExample']>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <section className={cx(getConceptTileClass(themeClasses), 'gap-4')}>
      <div className={cx('text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
        {text(example.specialTitle, language)}
      </div>

      <div className="grid gap-3">
        {example.specialCases.map((item) => (
          <TokenExampleGroup key={text(item.label, language)} item={item} language={language} themeClasses={themeClasses} />
        ))}
      </div>
    </section>
  );
}

function TokenExampleGroup({ item, language, themeClasses }: {
  item: {
    label: { en: string; vi: string };
    tokens: string[];
    description: { en: string; vi: string };
  };
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <div className={cx('grid gap-3 rounded-lg border p-3', themeClasses.isLight ? 'border-[#205089]/10 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/42')}>
      <div>
        <div className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{text(item.label, language)}</div>
        <p className={cx('text-xs font-semibold leading-5', themeClasses.mutedText)}>{text(item.description, language)}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {item.tokens.map((token) => (
          <span
            key={`${text(item.label, language)}-${token}`}
            className={cx('inline-flex min-h-8 items-center rounded-md border px-2.5 font-mono text-xs font-black', themeClasses.isLight ? 'border-[#2F6B55]/14 bg-[#EEF7F2] text-[#1F5A46]' : 'border-[#A6E8C1]/18 bg-[#A6E8C1]/10 text-[#A6E8C1]')}
          >
            {token}
          </span>
        ))}
      </div>
    </div>
  );
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

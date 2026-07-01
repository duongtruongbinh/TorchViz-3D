import { Angry, ArrowRight, CheckCircle2, Code2, Info, ListChecks, MousePointer2, RotateCcw, Sigma, Sparkles, Waypoints, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { BlockMath } from 'react-katex';
import type { LearningLessonExtra } from '../../../core/learning/types';
import type { Language } from '../../../lib/localization';
import { cx, getLearningLabTheme } from '../theme';

const aiOverviewImageUrl = new URL('../../../../docs/assets/llm_from_scratch/ai_overview.png', import.meta.url).href;
const llmPredictImageUrl = new URL('../../../../docs/assets/llm_from_scratch/llm_predict.png', import.meta.url).href;

type LessonExtrasProps = {
  extras: LearningLessonExtra[];
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  className?: string;
};

export default function LessonExtras({ extras, language, themeClasses, className = 'mt-5 grid gap-5' }: LessonExtrasProps) {
  if (!extras.length) return null;

  return (
    <div className={className}>
      {extras.map((extra) => (
        <LessonExtraCard key={extra.id} extra={extra} language={language} themeClasses={themeClasses} />
      ))}
    </div>
  );
}

function LessonExtraCard({ extra, language, themeClasses }: {
  extra: LearningLessonExtra;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  if (extra.kind === 'motivation') {
    return <MotivationBlock extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'formula') {
    return (
      <ExtraFrame icon={<Sigma className="h-4 w-4" aria-hidden="true" />} title={text(extra.title, language)} themeClasses={themeClasses}>
        <div className={cx('overflow-x-auto px-3 py-3 text-sm', themeClasses.radius.card, themeClasses.isLight ? 'bg-white/62' : 'bg-[#0F1721]/58')}>
          <BlockMath math={extra.latex} />
        </div>
        {extra.note && <p className={cx('mt-2 text-xs leading-6', themeClasses.mutedText)}>{text(extra.note, language)}</p>}
      </ExtraFrame>
    );
  }

  if (extra.kind === 'exercise') {
    return (
      <ExtraFrame icon={<ListChecks className="h-4 w-4" aria-hidden="true" />} title={text(extra.title, language)} themeClasses={themeClasses}>
        <p className={cx('text-sm leading-6', themeClasses.bodyText)}>{text(extra.prompt, language)}</p>
        <ol className="mt-3 grid gap-2">
          {extra.tasks.map((task, index) => (
            <li key={text(task, language)} className={cx('grid grid-cols-[2rem_minmax(0,1fr)] gap-3 text-sm leading-6', themeClasses.bodyText)}>
              <span className={cx('font-black tabular-nums', themeClasses.accentText)}>{index + 1}</span>
              <span>{text(task, language)}</span>
            </li>
          ))}
        </ol>
        {extra.answer && (
          <div className={cx('mt-4 flex gap-2 text-sm leading-6', themeClasses.isLight ? 'text-[#1F6F48]' : 'text-[#A6E8C1]')}>
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            <span>{text(extra.answer, language)}</span>
          </div>
        )}
      </ExtraFrame>
    );
  }

  if (extra.kind === 'conceptInteraction') {
    return <ConceptInteraction extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'conceptPanel') {
    return <ConceptPanel extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'codeContract') {
    return (
      <ExtraFrame icon={<Code2 className="h-4 w-4" aria-hidden="true" />} title={text(extra.title, language)} themeClasses={themeClasses}>
        <div className="grid gap-2 md:grid-cols-3">
          <ContractItem label="Input" value={text(extra.input, language)} themeClasses={themeClasses} />
          <ContractItem label="Output" value={text(extra.output, language)} themeClasses={themeClasses} />
          <ContractItem label="Observe" value={text(extra.observe, language)} themeClasses={themeClasses} />
        </div>
      </ExtraFrame>
    );
  }

  return (
    <ExtraFrame icon={<Waypoints className="h-4 w-4" aria-hidden="true" />} title={text(extra.diagram.title, language)} themeClasses={themeClasses}>
      <DiagramView extra={extra} language={language} themeClasses={themeClasses} />
    </ExtraFrame>
  );
}

function MotivationBlock({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'motivation' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const intro = splitMotivationIntro(text(extra.body, language));

  return (
    <div className="overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="min-w-0">
          <div className="grid max-w-[70ch] gap-3">
            {intro.map((paragraph) => (
              <p key={paragraph} className={cx('text-sm leading-7', themeClasses.bodyText)}>
                {paragraph}
              </p>
            ))}
          </div>

          <AiHierarchyFlow themeClasses={themeClasses} />

        </div>

        <figure className="min-w-0 pt-5 lg:pt-0">
          <img
            src={aiOverviewImageUrl}
            alt={text(extra.imageAlt, language)}
            className="aspect-[1672/941] w-full object-contain"
            loading="lazy"
          />
        </figure>
      </div>
    </div>
  );
}

function AiHierarchyFlow({ themeClasses }: {
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <div className="mt-5 grid max-w-[70ch] gap-3" aria-label="AI hierarchy flow">
      <HierarchyRow shortName="AI" fullName="Artificial Intelligence" description="Vòng ngoài cùng, chứa mọi cách làm cho máy có hành vi thông minh." themeClasses={themeClasses} depth="widest" />
      <HierarchyRow shortName="ML" fullName="Machine Learning" description="Bên trong AI, nơi máy học từ dữ liệu thay vì làm theo luật cố định." themeClasses={themeClasses} depth="middle" />
      <HierarchyRow shortName="DL" fullName="Deep Learning" description="Bên trong ML, dùng nhiều lớp xử lý để học các pattern phức tạp hơn." themeClasses={themeClasses} depth="middle" />

      <div className="grid gap-3 py-2">
        <div className={cx('text-xs font-normal uppercase tracking-wide', themeClasses.mutedText)}>
          Deep Learning tách thành hai hướng chuyên biệt
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <HierarchyRow shortName="CV" fullName="Computer Vision" description="Xử lý hình ảnh." themeClasses={themeClasses} depth="branch" compact />
          <HierarchyRow shortName="NLP" fullName="Natural Language Processing" description="Xử lý ngôn ngữ." themeClasses={themeClasses} depth="branch" compact />
        </div>
      </div>

      <HierarchyRow shortName="LLM" fullName="Large Language Model" description="Nằm sâu hơn bên trong NLP, đây là phần chúng ta sẽ tập trung giải thích." themeClasses={themeClasses} depth="target" />
    </div>
  );
}

function HierarchyRow({
  shortName,
  fullName,
  description,
  themeClasses,
  depth,
  compact = false,
}: {
  shortName: string;
  fullName: string;
  description: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  depth: 'widest' | 'middle' | 'branch' | 'target';
  compact?: boolean;
}) {
  const isTarget = depth === 'target';
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
        compact ? 'sm:grid-cols-[3.75rem_minmax(0,1fr)]' : 'sm:grid-cols-[4.5rem_minmax(0,1fr)]',
      )}
    >
      <div className={cx('font-black leading-6', isTarget ? themeClasses.accentText : themeClasses.titleText)}>
        {shortName}
      </div>
      <div className="min-w-0">
        <div className={cx('font-normal leading-6', themeClasses.titleText)}>{fullName}</div>
        <p className={cx('mt-0.5 leading-6', themeClasses.bodyText)}>{description}</p>
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
  const selectedOption = selectedIndex === null ? null : extra.options[selectedIndex];
  const selectedLabel = selectedOption ? text(selectedOption.label, language) : text(extra.blankLabel, language);
  const noteText = extra.note ? text(extra.note, language) : '';
  const sentenceBuilder = extra.sentenceBuilder;
  const selectedWords = sentenceBuilder ? selectedWordIndexes.map((index) => text(sentenceBuilder.choices[index], language)) : [];
  const targetSentences = sentenceBuilder ? sentenceBuilder.targets.map((target) => target.map((word) => text(word, language))) : [];
  const matchingTargets = targetSentences.filter((target) => selectedWords.every((word, index) => word === target[index]));
  const isSentenceComplete = matchingTargets.some((target) => selectedWords.length === target.length);
  const isSentenceOffTrack = sentenceBuilder ? selectedWords.length > 0 && matchingTargets.length === 0 : false;
  const firstViableTarget = matchingTargets[0] ?? targetSentences[0] ?? [];

  return (
    <div className="py-1">
      <div className="grid gap-5 lg:grid-cols-[minmax(16rem,0.72fr)_minmax(0,1fr)]">
        <figure className="min-w-0">
          <img
            src={getConceptImageUrl(extra.image)}
            alt={text(extra.imageAlt, language)}
            className={cx('aspect-[1672/941] w-full object-contain', themeClasses.radius.card)}
            loading="lazy"
          />
        </figure>

        <div className="min-w-0">
          <div className={cx('mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
            <MousePointer2 className="h-4 w-4" aria-hidden="true" />
            <span>{text(extra.title, language)}</span>
          </div>

          <div className="grid max-w-[72ch] gap-3">
            {extra.body.map((paragraph) => (
              <p key={text(paragraph, language)} className={cx('text-sm leading-7', themeClasses.bodyText)}>
                {text(paragraph, language)}
              </p>
            ))}
          </div>

          {noteText && (
            <div className={cx('mt-4 flex gap-3 rounded-lg px-3 py-3 text-sm leading-6', themeClasses.isLight ? 'bg-[#205089]/8 text-[#123B68]' : 'bg-[#9ED0FF]/10 text-[#D7EAFE]')}>
              <Info className="mt-1 h-4 w-4 shrink-0" strokeWidth={2.1} aria-hidden="true" />
              <p>{noteText}</p>
            </div>
          )}
        </div>
      </div>

      <div className={cx('mt-5 grid gap-4 rounded-lg border p-4 text-center', themeClasses.isLight ? 'border-[#205089]/14 bg-[#B8C8DA]/18' : 'border-[#A8B8C8]/16 bg-[#A8B8C8]/7')}>
        <div className="grid justify-items-center gap-3">
          <div className={cx('flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
            <Sparkles className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
            {language === 'vi' ? 'Thử chọn token tiếp theo' : 'Choose the next token'}
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
            <div className={cx('mx-auto flex max-w-[64ch] gap-2 text-left text-sm leading-6', selectedOption.isCorrect ? themeClasses.isLight ? 'text-[#1F6F48]' : 'text-[#A6E8C1]' : themeClasses.isLight ? 'text-[#8C3333]' : 'text-[#FCA5A5]')}>
              {selectedOption.isCorrect ? (
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              ) : (
                <Angry className="mt-1 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              )}
              <p>{text(selectedOption.feedback, language)}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2" aria-label={text(extra.blankLabel, language)}>
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

      {sentenceBuilder && (
        <div className={cx('mt-4 grid gap-4 rounded-lg border p-4 text-center', themeClasses.isLight ? 'border-[#205089]/14 bg-[#B8C8DA]/14' : 'border-[#A8B8C8]/16 bg-[#A8B8C8]/6')}>
          <div className={cx('flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
            <MousePointer2 className="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
            {text(sentenceBuilder.title, language)}
          </div>

          <div className={cx('mx-auto grid w-full max-w-[76ch] grid-cols-[1fr_auto] items-center gap-2 rounded-lg px-3 py-3 text-base font-semibold leading-8 md:text-lg', themeClasses.isLight ? 'bg-white/62 text-[#030509]' : 'bg-[#121A24]/42 text-[#F2F6FA]')}>
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
                  {language === 'vi' ? 'chọn từng từ' : 'choose words'}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedWordIndexes((current) => current.slice(0, -1))}
              disabled={!selectedWordIndexes.length}
              aria-label={language === 'vi' ? 'Xóa từ vừa chọn' : 'Remove last word'}
              className={cx('inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30', themeClasses.isLight ? 'text-[#123B68] hover:bg-[#205089]/10' : 'text-[#F2F6FA]/76 hover:bg-[#A8B8C8]/14')}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
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

          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedWordIndexes([])}
              disabled={!selectedWordIndexes.length}
              className={cx('inline-flex min-h-9 items-center gap-2 rounded-lg px-3 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-40', themeClasses.isLight ? 'bg-[#205089]/10 text-[#123B68] hover:bg-[#205089]/14' : 'bg-[#A8B8C8]/10 text-[#F2F6FA]/76 hover:bg-[#A8B8C8]/14')}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
          </div>

          {(isSentenceComplete || isSentenceOffTrack) && (
            <div className={cx('mx-auto flex max-w-[64ch] gap-2 text-left text-sm leading-6', isSentenceComplete ? themeClasses.isLight ? 'text-[#1F6F48]' : 'text-[#A6E8C1]' : themeClasses.isLight ? 'text-[#8C3333]' : 'text-[#FCA5A5]')}>
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

function ExtraFrame({ icon, title, children, themeClasses, customTitle }: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  customTitle?: ReactNode;
}) {
  return (
    <div className="py-1">
      <div className={cx('mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide', themeClasses.eyebrowText)}>
        <span className="hidden" aria-hidden="true">{icon}</span>
        {customTitle ?? <span>{title}</span>}
      </div>
      {children}
    </div>
  );
}

function ConceptPanel({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptPanel' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const panelTitle = text(extra.title, language);
  const emphasis = extra.emphasis ? text(extra.emphasis, language) : '';
  const [titleBeforeEmphasis, titleAfterEmphasis] = emphasis ? panelTitle.split(emphasis) : [panelTitle, ''];

  return (
    <ExtraFrame
      icon={<Waypoints className="h-4 w-4" aria-hidden="true" />}
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

        {extra.highlights && (
          <div className="grid gap-3">
            {extra.highlights.map((item) => (
              <HierarchyRow
                key={text(item.shortName, language)}
                shortName={text(item.shortName, language)}
                fullName={text(item.fullName, language)}
                description={text(item.description, language)}
                themeClasses={themeClasses}
                depth="middle"
              />
            ))}
          </div>
        )}

        {extra.table && (
          <div className={cx('overflow-hidden border', themeClasses.radius.card, themeClasses.isLight ? 'border-[#205089]/14' : 'border-[#A8B8C8]/16')}>
            <div className={cx('grid grid-cols-2 text-xs font-black uppercase tracking-wide', themeClasses.isLight ? 'bg-[#B8C8DA]/32 text-[#123B68]' : 'bg-[#A8B8C8]/10 text-[#A8B8C8]')}>
              {extra.table.columns.map((column) => (
                <div key={text(column, language)} className="px-3 py-2">{text(column, language)}</div>
              ))}
            </div>
            {extra.table.rows.map((row, index) => (
              <div key={`${text(row.cells[0], language)}-${index}`} className={cx('grid grid-cols-2 border-t text-sm leading-6', themeClasses.isLight ? 'border-[#205089]/10' : 'border-[#A8B8C8]/12')}>
                {row.cells.map((cell) => (
                  <div key={text(cell, language)} className={cx('px-3 py-3', themeClasses.bodyText)}>{text(cell, language)}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {extra.steps && (
          <div className="grid gap-0">
            {extra.steps.map((step, index) => (
              <div key={text(step.title, language)} className={cx('grid gap-3 border-t py-3 first:border-t-0 sm:grid-cols-[2.5rem_minmax(0,1fr)]', themeClasses.isLight ? 'border-[#205089]/10' : 'border-[#A8B8C8]/12')}>
                <span className={cx('font-black tabular-nums leading-6', themeClasses.accentText)}>{String(index + 1).padStart(2, '0')}</span>
                <div className="min-w-0 md:grid md:grid-cols-[13rem_minmax(0,1fr)] md:gap-4">
                  <div className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{text(step.title, language)}</div>
                  <p className={cx('mt-1 text-sm leading-6 md:mt-0', themeClasses.bodyText)}>{text(step.body, language)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {extra.outline && (
          <div className="grid gap-6">
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
                    <div className={cx('text-base font-black leading-6', themeClasses.titleText)}>{text(group.title, language)}</div>
                    <p className={cx('mt-1 text-sm leading-6', themeClasses.bodyText)}>{text(group.body, language)}</p>
                  </div>
                </div>

                <div className="grid gap-1 sm:pl-14">
                  {group.items.map((item, itemIndex) => (
                    <div
                      key={text(item.title, language)}
                      className={cx(
                        'group grid gap-3 py-2.5 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:items-start',
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
                        <div className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{text(item.title, language)}</div>
                        <p className={cx('mt-1 text-sm leading-6 lg:mt-0', themeClasses.bodyText)}>{text(item.body, language)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {extra.bullets && (
          <ul className="grid gap-2">
            {extra.bullets.map((item) => (
              <li key={text(item, language)} className={cx('flex gap-3 text-sm leading-6', themeClasses.bodyText)}>
                <CheckCircle2 className={cx('mt-1 h-4 w-4 shrink-0', themeClasses.accentText)} strokeWidth={2} aria-hidden="true" />
                <span>{text(item, language)}</span>
              </li>
            ))}
          </ul>
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

        {extra.bodyAfter?.map((paragraph) => (
          <p key={text(paragraph, language)} className={cx('text-sm leading-7', themeClasses.bodyText)}>
            {text(paragraph, language)}
          </p>
        ))}
      </div>
    </ExtraFrame>
  );
}

function DiagramView({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'diagram' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const diagram = extra.diagram;
  if (diagram.variant === 'pipeline') {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {diagram.steps.map((step, index) => (
          <div key={`${text(step, language)}-${index}`} className="flex items-center gap-2">
            <span className={cx('text-sm font-semibold leading-6', themeClasses.bodyText)}>
              {text(step, language)}
            </span>
            {index < diagram.steps.length - 1 && <ArrowRight className={cx('h-4 w-4', themeClasses.mutedText)} aria-hidden="true" />}
          </div>
        ))}
      </div>
    );
  }

  if (diagram.variant === 'shape-flow') {
    return (
      <div className="grid gap-2">
        {diagram.steps.map((step, index) => (
          <div key={`${text(step.label, language)}-${step.shape}`} className={cx('grid gap-2 border-l-2 py-2 pl-3 text-sm md:grid-cols-[1.5rem_minmax(0,1fr)_minmax(8rem,0.6fr)] md:items-center', themeClasses.isLight ? 'border-[#205089]/16' : 'border-[#A8B8C8]/18')}>
            <span className={cx('flex h-6 w-6 items-center justify-center text-xs font-black', themeClasses.radius.icon, themeClasses.iconTile)}>{index + 1}</span>
            <span className={themeClasses.bodyText}>{text(step.label, language)}</span>
            <code className={cx('min-w-0 overflow-x-auto whitespace-nowrap text-xs', themeClasses.accentText)}>{step.shape}</code>
            {step.note && <p className={cx('md:col-start-2 md:col-span-2 text-xs leading-5', themeClasses.mutedText)}>{text(step.note, language)}</p>}
          </div>
        ))}
      </div>
    );
  }

  if (diagram.variant === 'matrix') {
    return (
      <div className="overflow-x-auto">
        <div className="grid w-max gap-1" style={{ gridTemplateColumns: `2.5rem repeat(${diagram.columns.length}, minmax(2.25rem, 1fr))` }}>
          <span />
          {diagram.columns.map((column) => <span key={column} className={cx('text-center text-xs font-semibold', themeClasses.mutedText)}>{column}</span>)}
          {diagram.rows.map((row) => (
            <MatrixRow key={row.label} row={row} themeClasses={themeClasses} />
          ))}
        </div>
        {diagram.legend && <p className={cx('mt-2 text-xs leading-5', themeClasses.mutedText)}>{text(diagram.legend, language)}</p>}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {diagram.tokens.map((token, index) => (
          <span key={`${token}-${index}`} className={cx('border px-2 py-1 font-mono text-xs', themeClasses.radius.icon, themeClasses.isLight ? 'border-[#205089]/14 bg-white/70 text-[#123B68]' : 'border-[#A8B8C8]/16 bg-[#172232] text-[#F2F6FA]')}>{token}</span>
        ))}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {diagram.windows.map((window, index) => (
          <div key={`${window.input.join('-')}-${index}`} className={cx('border-l-2 py-2 pl-3 text-xs', themeClasses.isLight ? 'border-[#205089]/18' : 'border-[#A8B8C8]/20')}>
            <div className={cx('font-black uppercase tracking-wide', themeClasses.eyebrowText)}>Window {index + 1}</div>
            <div className="mt-2 grid gap-1 font-mono">
              <span>input: [{window.input.join(', ')}]</span>
              <span>target: [{window.target.join(', ')}]</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MatrixRow({ row, themeClasses }: {
  row: Extract<Extract<LearningLessonExtra, { kind: 'diagram' }>['diagram'], { variant: 'matrix' }>['rows'][number];
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <>
      <span className={cx('text-center text-xs font-semibold', themeClasses.mutedText)}>{row.label}</span>
      {row.cells.map((cell, index) => (
        <span
          key={`${row.label}-${index}`}
          className={cx(
            'flex h-9 w-9 items-center justify-center border text-xs font-black',
            themeClasses.radius.icon,
            cell === 'allowed' && (themeClasses.isLight ? 'border-[#2FBF71]/24 bg-[#2FBF71]/12 text-[#1F6F48]' : 'border-[#2FBF71]/32 bg-[#2FBF71]/16 text-[#A6E8C1]'),
            cell === 'blocked' && (themeClasses.isLight ? 'border-[#C45151]/24 bg-[#C45151]/10 text-[#8C3333]' : 'border-[#F87171]/28 bg-[#F87171]/14 text-[#FCA5A5]'),
            cell === 'target' && (themeClasses.isLight ? 'border-[#205089]/28 bg-[#205089]/12 text-[#123B68]' : 'border-[#A8B8C8]/28 bg-[#496F98]/22 text-[#F2F6FA]'),
          )}
        >
          {cell === 'blocked' ? 'x' : cell === 'target' ? '*' : ''}
        </span>
      ))}
    </>
  );
}

function ContractItem({ label, value, themeClasses }: {
  label: string;
  value: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <div className={cx('border-l-2 py-2 pl-3 text-sm leading-6', themeClasses.isLight ? 'border-[#205089]/18' : 'border-[#A8B8C8]/20')}>
      <div className={cx('text-[11px] font-black uppercase tracking-wide', themeClasses.eyebrowText)}>{label}</div>
      <p className={cx('mt-1', themeClasses.bodyText)}>{value}</p>
    </div>
  );
}

function text(value: { en: string; vi: string }, language: Language): string {
  return value[language] ?? value.en;
}

function getConceptImageUrl(image: Extract<LearningLessonExtra, { kind: 'conceptInteraction' }>['image']): string {
  if (image === 'llm-predict') return llmPredictImageUrl;
  return llmPredictImageUrl;
}

function splitMotivationIntro(value: string): string[] {
  return value
    .replace(' Hãy tưởng tượng', '\nHãy tưởng tượng')
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

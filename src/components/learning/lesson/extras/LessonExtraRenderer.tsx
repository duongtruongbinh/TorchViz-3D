import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { useState } from 'react';
import type { LearningLessonExtra } from '../../../../core/learning/types';
import type { Language } from '../../../../lib/localization';
import { renderLlmAiEngineeringExtra } from '../../domains/llm-ai-engineering/renderers';
import { cx, getLearningLabTheme } from '../../theme';
import ExtraFrame from './ExtraFrame';
import { text } from './lessonExtraText';

type LessonExtraRendererProps = {
  extra: LearningLessonExtra;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
};

export default function LessonExtraRenderer({ extra, language, themeClasses }: LessonExtraRendererProps) {
  if (extra.kind === 'motivation' || extra.kind === 'conceptInteraction') {
    return renderLlmAiEngineeringExtra({ extra, language, themeClasses });
  }

  if (extra.kind === 'conceptPanel') {
    return <ConceptPanelBlock extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'quiz') {
    return <QuizBlock extra={extra} language={language} themeClasses={themeClasses} />;
  }

  return null;
}

function QuizBlock({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'quiz' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  return (
    <ExtraFrame title={text(extra.title, language)} themeClasses={themeClasses}>
      <div className="grid gap-4">
        {extra.questions.map((question, questionIndex) => (
          <QuizQuestion
            key={question.id}
            question={question}
            questionIndex={questionIndex}
            language={language}
            themeClasses={themeClasses}
          />
        ))}
      </div>
    </ExtraFrame>
  );
}

function QuizQuestion({
  question,
  questionIndex,
  language,
  themeClasses,
}: {
  question: Extract<LearningLessonExtra, { kind: 'quiz' }>['questions'][number];
  questionIndex: number;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const checkLabel = language === 'vi' ? 'Kiểm tra' : 'Check';
  const resetLabel = language === 'vi' ? 'Làm lại' : 'Reset';
  const isOrderMode = question.mode === 'order';
  const correctIds = isOrderMode
    ? question.correctOrder ?? []
    : question.options.filter((option) => option.isCorrect).map((option) => option.id);
  const canCheck = isOrderMode
    ? selectedIds.length === correctIds.length
    : selectedIds.length > 0;

  const toggleOption = (optionId: string) => {
    setFeedback(null);
    if (question.mode === 'single') {
      setSelectedIds([optionId]);
      return;
    }
    setSelectedIds((current) => (
      current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
    ));
  };

  const selectOrderOption = (optionId: string) => {
    if (selectedIds.includes(optionId)) return;
    setFeedback(null);
    setSelectedIds((current) => [...current, optionId]);
  };

  const reset = () => {
    setSelectedIds([]);
    setFeedback(null);
  };

  const checkAnswer = () => {
    const isCorrect = isOrderMode
      ? correctIds.every((id, index) => selectedIds[index] === id)
      : correctIds.length === selectedIds.length && correctIds.every((id) => selectedIds.includes(id));
    setFeedback(isCorrect ? 'correct' : 'incorrect');
  };

  return (
    <div className={cx('rounded-lg border p-4', themeClasses.isLight ? 'border-[#205089]/12 bg-white' : 'border-[#A8B8C8]/16 bg-[#A8B8C8]/6')}>
      <div className="flex flex-wrap items-start gap-3">
        <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black tabular-nums', themeClasses.isLight ? 'bg-[#205089]/10 text-[#123B68]' : 'bg-[#A8B8C8]/12 text-[#F2F6FA]')}>
          {questionIndex + 1}
        </span>
        <div className="min-w-0 flex-1">
          <div className={cx('text-sm font-black leading-6', themeClasses.isLight ? 'text-[#254F70]' : themeClasses.titleText)}>
            {text(question.title, language)}
          </div>
          <p className={cx('mt-1 text-sm leading-6', themeClasses.bodyText)}>{text(question.prompt, language)}</p>
        </div>
      </div>

      {isOrderMode ? (
        <div className="mt-4 grid gap-3">
          <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-lg border border-dashed px-3 py-2">
            {selectedIds.length ? (
              selectedIds.map((id, index) => {
                const option = question.options.find((item) => item.id === id);
                return (
                  <span key={id} className={cx('inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-black', themeClasses.isLight ? 'bg-[#D7E8F5] text-[#255E88]' : 'bg-[#A8B8C8]/12 text-[#D7EAFE]')}>
                    {index + 1}. {option ? text(option.label, language) : id}
                  </span>
                );
              })
            ) : (
              <span className={cx('text-sm font-semibold', themeClasses.mutedText)}>
                {language === 'vi' ? 'Chọn theo thứ tự từ rộng tới hẹp' : 'Pick from broadest to narrowest'}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {question.options.map((option) => {
              const isUsed = selectedIds.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={isUsed}
                  onClick={() => selectOrderOption(option.id)}
                  className={getQuizOptionClass(themeClasses, isUsed, false)}
                >
                  {text(option.label, language)}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {question.options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleOption(option.id)}
                className={getQuizOptionClass(themeClasses, false, isSelected)}
                aria-pressed={isSelected}
              >
                {text(option.label, language)}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={checkAnswer}
          disabled={!canCheck}
          className={cx(
            'inline-flex h-9 items-center justify-center rounded-lg px-3 text-xs font-black transition-colors disabled:cursor-not-allowed',
            canCheck
              ? themeClasses.isLight ? 'bg-[#205089] text-white hover:bg-[#123B68]' : 'bg-[#D7DCE2] text-[#121A24] hover:bg-[#F2F6FA]'
              : themeClasses.isLight ? 'bg-[#B8C8DA]/12 text-[#030509]/24' : 'bg-[#A8B8C8]/8 text-[#F2F6FA]/24',
          )}
        >
          {checkLabel}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={!selectedIds.length}
          className={cx('inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-35', themeClasses.isLight ? 'bg-[#205089]/8 text-[#123B68] hover:bg-[#205089]/12' : 'bg-[#A8B8C8]/10 text-[#F2F6FA]/76 hover:bg-[#A8B8C8]/14')}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {resetLabel}
        </button>
      </div>

      {feedback ? (
        <div className={cx('mt-3 flex gap-2 text-sm font-semibold leading-6', feedback === 'correct' ? themeClasses.isLight ? 'text-[#1F6F48]' : 'text-[#A6E8C1]' : themeClasses.isLight ? 'text-[#8C3333]' : 'text-[#FCA5A5]')}>
          {feedback === 'correct' ? <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /> : <XCircle className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />}
          <p>{text(feedback === 'correct' ? question.success : question.error, language)}</p>
        </div>
      ) : null}
    </div>
  );
}

function getQuizOptionClass(themeClasses: ReturnType<typeof getLearningLabTheme>, isDisabled: boolean, isSelected: boolean): string {
  return cx(
    'min-h-10 rounded-lg border px-3 py-2 text-sm font-black transition-colors disabled:cursor-not-allowed disabled:opacity-38',
    isSelected
      ? themeClasses.isLight
        ? 'border-[#2F6F9F]/34 bg-[#D7E8F5] text-[#255E88]'
        : 'border-[#A8B8C8]/28 bg-[#D7DCE2] text-[#121A24]'
      : isDisabled
        ? themeClasses.isLight
          ? 'border-[#205089]/10 bg-[#B8C8DA]/12 text-[#123B68]/35'
          : 'border-[#A8B8C8]/12 bg-[#A8B8C8]/6 text-[#F2F6FA]/35'
        : themeClasses.isLight
          ? 'border-[#205089]/16 bg-white/80 text-[#123B68] hover:bg-[#DCE6F1]'
          : 'border-[#A8B8C8]/20 bg-[#121A24]/58 text-[#F2F6FA]/84 hover:bg-[#A8B8C8]/12',
  );
}

function ConceptPanelBlock({ extra, language, themeClasses }: {
  extra: Extract<LearningLessonExtra, { kind: 'conceptPanel' }>;
  language: Language;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const panelTitle = text(extra.title, language);
  const emphasis = extra.emphasis ? text(extra.emphasis, language) : '';
  const [titleBeforeEmphasis, titleAfterEmphasis] = emphasis ? panelTitle.split(emphasis) : [panelTitle, ''];
  const outlineGroupTitleText = themeClasses.isLight ? 'text-[#254F70]' : themeClasses.titleText;
  const outlineItemTitleText = themeClasses.isLight ? 'text-[#385F7A]' : themeClasses.titleText;

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

        {extra.highlights && (
          <div className="grid gap-3">
            {extra.highlights.map((item) => (
              <ConceptHighlightRow
                key={text(item.shortName, language)}
                shortName={text(item.shortName, language)}
                fullName={text(item.fullName, language)}
                description={text(item.description, language)}
                themeClasses={themeClasses}
              />
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
                    <div className={cx('text-base font-black leading-6', outlineGroupTitleText)}>{text(group.title, language)}</div>
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
                        <div className={cx('text-sm font-black leading-6', outlineItemTitleText)}>{text(item.title, language)}</div>
                        <p className={cx('mt-1 text-sm leading-6 lg:mt-0', themeClasses.bodyText)}>{text(item.body, language)}</p>
                      </div>
                    </div>
                  ))}
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

        {extra.bodyAfter?.map((paragraph) => (
          <p key={text(paragraph, language)} className={cx('text-sm leading-7', themeClasses.bodyText)}>
            {text(paragraph, language)}
          </p>
        ))}
      </div>
    </ExtraFrame>
  );
}

function ConceptHighlightRow({
  shortName,
  fullName,
  description,
  themeClasses,
}: {
  shortName: string;
  fullName: string;
  description: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const rowTone = themeClasses.isLight
    ? 'bg-[#B8C8DA]/20 hover:bg-[#B8C8DA]/34'
    : 'bg-[#A8B8C8]/6 hover:bg-[#A8B8C8]/10';

  return (
    <div
      className={cx(
        'group grid gap-2 px-3 py-2 text-sm transition-colors sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:items-start',
        themeClasses.radius.button,
        rowTone,
      )}
    >
      <div className={cx('font-black leading-6', themeClasses.titleText)}>{shortName}</div>
      <div className="min-w-0">
        <div className={cx('font-normal leading-6', themeClasses.titleText)}>{fullName}</div>
        <p className={cx('mt-0.5 leading-6', themeClasses.bodyText)}>{description}</p>
      </div>
    </div>
  );
}

import { Check, CheckCircle2, Circle, CircleAlert, GripVertical, RotateCcw, Square, XCircle } from 'lucide-react';
import { Fragment, type DragEvent, useEffect, useRef, useState } from 'react';
import type { LearningLessonExtra } from '../../../../core/learning/types';
import { getStrings, type Language } from '../../../../lib/localization';
import { renderLlmAiEngineeringExtra } from '../../domains/llm-ai-engineering/renderers';
import { cx, getLearningLabTheme } from '../../theme';
import { getLearningAssetUrl } from './assetRegistry';
import { scrollLearningLabElementIntoView } from '../scrolling';
import ExtraFrame from './ExtraFrame';
import { text } from './lessonExtraText';

type LessonExtraRendererProps = {
  extra: LearningLessonExtra;
  language: Language;
  quizQuestionStates?: Record<string, QuizQuestionState>;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
};

export default function LessonExtraRenderer({
  extra,
  language,
  quizQuestionStates,
  themeClasses,
  onQuizQuestionStateChange,
}: LessonExtraRendererProps) {
  if (extra.kind === 'motivation' || extra.kind === 'conceptInteraction') {
    return renderLlmAiEngineeringExtra({ extra, language, themeClasses });
  }

  if (extra.kind === 'conceptPanel') {
    return <ConceptPanelBlock extra={extra} language={language} themeClasses={themeClasses} />;
  }

  if (extra.kind === 'quiz') {
    return (
      <QuizBlock
        extra={extra}
        language={language}
        quizQuestionStates={quizQuestionStates}
        themeClasses={themeClasses}
        onQuizQuestionStateChange={onQuizQuestionStateChange}
      />
    );
  }

  return null;
}

function QuizBlock({
  extra,
  language,
  quizQuestionStates,
  themeClasses,
  onQuizQuestionStateChange,
}: {
  extra: Extract<LearningLessonExtra, { kind: 'quiz' }>;
  language: Language;
  quizQuestionStates?: Record<string, QuizQuestionState>;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
}) {
  const [localQuestionStates, setLocalQuestionStates] = useState<Record<string, QuizQuestionState>>({});

  const updateQuestionState = (questionId: string, nextState: QuizQuestionState) => {
    if (onQuizQuestionStateChange) {
      onQuizQuestionStateChange(questionId, nextState);
      return;
    }
    setLocalQuestionStates((current) => ({ ...current, [questionId]: nextState }));
  };

  return (
    <div className="grid gap-4 py-1">
      {extra.questions.map((question) => (
        <QuizQuestion
          key={question.id}
          question={question}
          language={language}
          state={quizQuestionStates?.[question.id] ?? localQuestionStates[question.id] ?? emptyQuizQuestionState}
          themeClasses={themeClasses}
          onStateChange={(state) => updateQuestionState(question.id, state)}
        />
      ))}
    </div>
  );
}

export type QuizQuestionState = {
  selectedIds: string[];
  categoryAssignments?: Record<string, string>;
  feedback: 'correct' | 'incorrect' | null;
};

const emptyQuizQuestionState: QuizQuestionState = {
  selectedIds: [],
  categoryAssignments: {},
  feedback: null,
};

function QuizQuestion({
  question,
  language,
  state,
  themeClasses,
  onStateChange,
}: {
  question: Extract<LearningLessonExtra, { kind: 'quiz' }>['questions'][number];
  language: Language;
  state: QuizQuestionState;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onStateChange: (state: QuizQuestionState) => void;
}) {
  const strings = getStrings(language).learningLab;
  const isOrderMode = question.mode === 'order';
  const isCategorizeMode = question.mode === 'categorize';
  const quizPalette = getQuizPalette(themeClasses);
  const promptText = text(question.prompt, language);
  const [draggedOrderIndex, setDraggedOrderIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const feedbackRef = useRef<HTMLDivElement | null>(null);
  const { selectedIds, feedback } = state;
  const categoryAssignments = state.categoryAssignments ?? {};
  const orderIds = isOrderMode && selectedIds.length === question.options.length
    ? selectedIds
    : question.options.map((option) => option.id);
  const correctIds = isOrderMode
    ? question.correctOrder ?? []
    : question.options.filter((option) => option.isCorrect).map((option) => option.id);
  const canCheck = isOrderMode
    ? orderIds.length === correctIds.length
    : isCategorizeMode
      ? question.options.every((option) => categoryAssignments[option.id])
      : selectedIds.length > 0;
  const hasUserInput = selectedIds.length > 0 || Object.keys(categoryAssignments).length > 0;

  const toggleOption = (optionId: string) => {
    if (question.mode === 'single') {
      onStateChange({ selectedIds: [optionId], categoryAssignments, feedback: null });
      return;
    }
    const nextSelectedIds = selectedIds.includes(optionId)
      ? selectedIds.filter((id) => id !== optionId)
      : [...selectedIds, optionId];
    onStateChange({ selectedIds: nextSelectedIds, categoryAssignments, feedback: null });
  };

  const moveOrderOption = (fromIndex: number, targetIndex: number) => {
    if (targetIndex === fromIndex || targetIndex === fromIndex + 1) return;
    const nextIds = [...orderIds];
    const [movedId] = nextIds.splice(fromIndex, 1);
    if (!movedId) return;
    const adjustedTargetIndex = fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
    nextIds.splice(adjustedTargetIndex, 0, movedId);
    onStateChange({ selectedIds: nextIds, categoryAssignments, feedback: null });
  };

  const updateDropTargetIndex = (event: DragEvent<HTMLElement>, rowIndex: number) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const rowBounds = event.currentTarget.getBoundingClientRect();
    const isAfterRow = event.clientY > rowBounds.top + rowBounds.height / 2;
    setDropTargetIndex(rowIndex + (isAfterRow ? 1 : 0));
  };

  const clearOrderDragState = () => {
    setDraggedOrderIndex(null);
    setDropTargetIndex(null);
  };

  const reset = () => {
    onStateChange(emptyQuizQuestionState);
  };

  const assignCategoryOption = (optionId: string, categoryId: string | null) => {
    const nextAssignments = { ...categoryAssignments };
    if (categoryId) {
      nextAssignments[optionId] = categoryId;
    } else {
      delete nextAssignments[optionId];
    }
    onStateChange({ selectedIds, categoryAssignments: nextAssignments, feedback: null });
  };

  const checkAnswer = () => {
    const isCorrect = isOrderMode
      ? correctIds.every((id, index) => orderIds[index] === id)
      : isCategorizeMode
        ? question.options.every((option) => option.categoryId && categoryAssignments[option.id] === option.categoryId)
        : correctIds.length === selectedIds.length && correctIds.every((id) => selectedIds.includes(id));
    onStateChange({ selectedIds, categoryAssignments, feedback: isCorrect ? 'correct' : 'incorrect' });
  };

  useEffect(() => {
    if (!feedback) return;
    const frameId = window.requestAnimationFrame(() => {
      scrollLearningLabElementIntoView(feedbackRef.current);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [feedback]);

  return (
    <div className={cx(
      'py-1',
      quizPalette.card,
    )}>
      <div className="grid gap-2">
        <div className={cx('text-xl font-black leading-8 md:text-2xl md:leading-9', quizPalette.title)}>
          {text(question.title, language)}
        </div>
        {promptText ? (
          <p className={cx('text-xl font-black leading-8 md:text-2xl md:leading-9', quizPalette.prompt)}>{promptText}</p>
        ) : null}
      </div>

      {isOrderMode ? (
        <div className="mt-5 grid gap-1">
          {orderIds.map((id, index) => {
            const option = question.options.find((item) => item.id === id);
            if (!option) return null;
            return (
              <div key={id} className="grid gap-1">
                {dropTargetIndex === index && draggedOrderIndex !== null ? (
                  <div className={cx('h-1 rounded-full', quizPalette.dropLine)} />
                ) : null}
                <div
                  draggable
                  onDragStart={(event) => {
                    setDraggedOrderIndex(index);
                    setDropTargetIndex(index);
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', String(index));
                  }}
                  onDragEnd={clearOrderDragState}
                  onDragOver={(event) => updateDropTargetIndex(event, index)}
                  onDrop={(event) => {
                    event.preventDefault();
                    const fromIndex = Number(event.dataTransfer.getData('text/plain'));
                    if (Number.isNaN(fromIndex)) return;
                    moveOrderOption(fromIndex, dropTargetIndex ?? index);
                    clearOrderDragState();
                  }}
                  className={getQuizOrderRowClass(themeClasses, quizPalette, draggedOrderIndex === index)}
                >
                  <span className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-xs font-black tabular-nums', quizPalette.orderNumber)}>
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">{text(option.label, language)}</span>
                  <GripVertical className={cx('h-4 w-4 shrink-0', quizPalette.dragIcon)} strokeWidth={2.2} aria-hidden="true" />
                </div>
                {dropTargetIndex === orderIds.length && index === orderIds.length - 1 && draggedOrderIndex !== null ? (
                  <div className={cx('h-1 rounded-full', quizPalette.dropLine)} />
                ) : null}
              </div>
            );
          })}
        </div>
      ) : isCategorizeMode ? (
        <CategorizeQuestion
          assignments={categoryAssignments}
          feedback={feedback}
          language={language}
          question={question}
          quizPalette={quizPalette}
          onAssign={assignCategoryOption}
        />
      ) : (
        <div className="mt-5 grid gap-2">
          {question.options.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleOption(option.id)}
                className={getQuizOptionClass(quizPalette, false, isSelected)}
                aria-pressed={isSelected}
              >
                <span className={getQuizOptionMarkerClass(quizPalette, isSelected)}>
                  {isSelected ? (
                    <Check className="h-5 w-5" strokeWidth={2.6} aria-hidden="true" />
                  ) : question.mode === 'multi' ? (
                    <Square className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                  ) : (
                    <Circle className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                  )}
                </span>
                <span>{text(option.label, language)}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={checkAnswer}
          disabled={!canCheck}
          className={cx(
            'inline-flex h-10 min-w-[6.5rem] items-center justify-center rounded-lg px-4 text-xs font-black transition-colors disabled:cursor-not-allowed',
            canCheck ? quizPalette.checkButton : quizPalette.disabledButton,
          )}
        >
          {strings.check}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={!hasUserInput}
          className={cx('inline-flex h-10 items-center gap-2 rounded-lg px-4 text-xs font-black transition-colors disabled:cursor-not-allowed disabled:opacity-35', quizPalette.resetButton)}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          {strings.reset}
        </button>
      </div>

      {feedback ? (
        <div
          ref={feedbackRef}
          className={cx(
            'learning-lab-answer-reveal mt-4 flex gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold leading-6',
            feedback === 'correct' ? quizPalette.feedbackCorrect : quizPalette.feedbackIncorrect,
          )}
          role="status"
        >
          {feedback === 'correct' ? <CheckCircle2 className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" /> : <XCircle className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />}
          <p>{text(feedback === 'correct' ? question.success : question.error, language)}</p>
        </div>
      ) : null}
    </div>
  );
}

function CategorizeQuestion({
  assignments,
  feedback,
  language,
  question,
  quizPalette,
  onAssign,
}: {
  assignments: Record<string, string>;
  feedback: QuizQuestionState['feedback'];
  language: Language;
  question: Extract<LearningLessonExtra, { kind: 'quiz' }>['questions'][number];
  quizPalette: QuizPalette;
  onAssign: (optionId: string, categoryId: string | null) => void;
}) {
  const strings = getStrings(language).learningLab;
  const categories = question.categories ?? [];
  const unassignedOptions = question.options.filter((option) => !assignments[option.id]);
  const shouldShowIncorrect = feedback === 'incorrect';
  const isOptionIncorrect = (option: typeof question.options[number]) => (
    shouldShowIncorrect && Boolean(assignments[option.id]) && assignments[option.id] !== option.categoryId
  );

  const handleDrop = (event: DragEvent<HTMLElement>, categoryId: string | null) => {
    event.preventDefault();
    const optionId = event.dataTransfer.getData('text/plain');
    if (!optionId) return;
    onAssign(optionId, categoryId);
  };

  return (
    <div className="mt-5 grid gap-4">
      <div
        className={cx('grid min-h-16 gap-2 rounded-lg border border-dashed p-3', quizPalette.categoryBank)}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'move';
        }}
        onDrop={(event) => handleDrop(event, null)}
      >
        <div className={cx('text-xs font-black uppercase tracking-wide', quizPalette.categoryCaption)}>
          {strings.quizCategorizeUnsorted}
        </div>
        <div className="flex flex-wrap gap-2">
          {unassignedOptions.length ? unassignedOptions.map((option) => (
            <TokenChip
              isIncorrect={isOptionIncorrect(option)}
              key={option.id}
              label={text(option.label, language)}
              optionId={option.id}
              quizPalette={quizPalette}
            />
          )) : (
            <span className={cx('text-sm font-semibold leading-6', quizPalette.categoryCaption)}>
              {strings.quizCategorizeComplete}
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {categories.map((category) => {
          const categoryOptions = question.options.filter((option) => assignments[option.id] === category.id);
          const hasIncorrectOption = categoryOptions.some(isOptionIncorrect);
          return (
            <div
              key={category.id}
              className={cx(
                'grid min-h-28 gap-2 rounded-lg border border-dashed p-3 transition-colors',
                hasIncorrectOption ? quizPalette.categoryZoneIncorrect : quizPalette.categoryZone,
              )}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(event) => handleDrop(event, category.id)}
            >
              <div className={cx('text-sm font-black leading-6', quizPalette.categoryTitle)}>
                {text(category.label, language)}
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((option) => (
                  <TokenChip
                    isIncorrect={isOptionIncorrect(option)}
                    key={option.id}
                    label={text(option.label, language)}
                    optionId={option.id}
                    quizPalette={quizPalette}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TokenChip({
  isIncorrect,
  label,
  optionId,
  quizPalette,
}: {
  isIncorrect: boolean;
  label: string;
  optionId: string;
  quizPalette: QuizPalette;
}) {
  return (
    <span
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', optionId);
      }}
      className={cx(
        'inline-flex min-h-9 cursor-grab items-center rounded-lg border px-3 py-1.5 text-sm font-black leading-6 shadow-sm active:cursor-grabbing',
        isIncorrect ? quizPalette.tokenChipIncorrect : quizPalette.tokenChip,
      )}
    >
      {label}
    </span>
  );
}

type QuizPalette = ReturnType<typeof getQuizPalette>;

function getQuizPalette(themeClasses: ReturnType<typeof getLearningLabTheme>) {
  if (!themeClasses.isLight) {
    return {
      card: '',
      title: themeClasses.titleText,
      prompt: themeClasses.titleText,
      orderNumber: 'border-[#D7DCE2]/18 bg-[#D7DCE2] text-[#121A24]',
      dragIcon: 'text-[#D7EAFE]/76',
      optionSelected: 'border-[#A8B8C8]/28 bg-[#D7DCE2] text-[#121A24]',
      optionDisabled: 'border-[#A8B8C8]/12 bg-[#A8B8C8]/6 text-[#F2F6FA]/35',
      optionIdle: 'border-[#A8B8C8]/20 bg-[#121A24]/58 text-[#F2F6FA]/84 hover:bg-[#A8B8C8]/12',
      optionMarkerSelected: 'text-[#D7DCE2]',
      optionMarkerIdle: 'text-[#D7EAFE]',
      orderRow: 'border-[#A8B8C8]/20 bg-[#121A24]/58 text-[#F2F6FA]/84 hover:bg-[#A8B8C8]/12',
      orderRowDragging: 'opacity-55',
      dropLine: 'bg-[#D7DCE2]',
      categoryBank: 'border-[#A8B8C8]/18 bg-[#121A24]/28',
      categoryCaption: 'text-[#D7EAFE]/70',
      categoryZone: 'border-[#A8B8C8]/18 bg-[#A8B8C8]/6',
      categoryZoneIncorrect: 'border-[#FCA5A5]/42 bg-[#FCA5A5]/10',
      categoryTitle: 'text-[#F2F6FA]',
      tokenChip: 'border-[#A8B8C8]/20 bg-[#121A24]/58 text-[#F2F6FA]/84',
      tokenChipIncorrect: 'border-[#FCA5A5]/54 bg-[#FCA5A5]/14 text-[#FCA5A5]',
      checkButton: 'bg-[#D7DCE2] text-[#121A24] hover:bg-[#F2F6FA]',
      disabledButton: 'bg-[#A8B8C8]/8 text-[#F2F6FA]/24',
      resetButton: 'bg-[#A8B8C8]/10 text-[#F2F6FA]/76 hover:bg-[#A8B8C8]/14',
      feedbackCorrect: 'border-[#A6E8C1]/18 bg-[#A6E8C1]/10 text-[#A6E8C1]',
      feedbackIncorrect: 'border-[#FCA5A5]/18 bg-[#FCA5A5]/10 text-[#FCA5A5]',
    };
  }

  return {
    card: '',
    title: 'text-[#254F70]',
    prompt: 'text-[#102F4A]',
    orderNumber: 'border-[#2F6B55]/18 bg-[#DDEFE7] text-[#1F5A46]',
    dragIcon: 'text-[#385F7A]',
    optionSelected: 'border-[#2F6B55]/22 bg-[#EEF7F2] text-[#1F5A46] shadow-[0_6px_16px_rgba(47,107,85,0.08)]',
    optionDisabled: 'border-[#2F6B55]/10 bg-[#DDEFE7]/30 text-[#1F5A46]/35 shadow-none',
    optionIdle: 'border-[#2F6B55]/14 bg-white text-[#1F5A46] shadow-[0_4px_12px_rgba(47,107,85,0.06)] hover:border-[#2F6B55]/24 hover:bg-[#F6FAF8]',
    optionMarkerSelected: 'text-[#1F5A46]',
    optionMarkerIdle: 'text-[#1F5A46]',
    orderRow: 'border-[#2F6B55]/14 bg-white text-[#1F5A46] shadow-[0_4px_12px_rgba(47,107,85,0.06)] hover:border-[#2F6B55]/28 hover:bg-[#F6FAF8]',
    orderRowDragging: 'opacity-55',
    dropLine: 'bg-[#6FAF93]',
    categoryBank: 'border-[#2F6B55]/16 bg-[#F6FAF8]',
    categoryCaption: 'text-[#1F5A46]/68',
    categoryZone: 'border-[#2F6B55]/16 bg-white hover:bg-[#F6FAF8]',
    categoryZoneIncorrect: 'border-[#C45151]/42 bg-[#FBECEC]',
    categoryTitle: 'text-[#1F5A46]',
    tokenChip: 'border-[#2F6B55]/14 bg-[#EEF7F2] text-[#1F5A46] shadow-[0_4px_12px_rgba(47,107,85,0.06)]',
    tokenChipIncorrect: 'border-[#C45151]/48 bg-[#FBECEC] text-[#8C3333] shadow-[0_4px_12px_rgba(196,81,81,0.08)]',
    checkButton: 'border border-[#CBD5E1] bg-[#E2E8F0] text-[#0F172A] shadow-[0_8px_18px_rgba(15,23,42,0.10)] hover:bg-[#CBD5E1]',
    disabledButton: 'bg-[#B8C8DA]/12 text-[#030509]/24 shadow-none',
    resetButton: 'bg-[#2F6B55]/8 text-[#1F5A46] hover:bg-[#2F6B55]/12',
    feedbackCorrect: 'border-[#1F6F48]/18 bg-[#E8F7EE] text-[#1F6F48]',
    feedbackIncorrect: 'border-[#8C3333]/18 bg-[#FBECEC] text-[#8C3333]',
  };
}

function getQuizOptionClass(quizPalette: QuizPalette, isDisabled: boolean, isSelected: boolean): string {
  return cx(
    'inline-flex min-h-12 items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm font-black leading-6 transition-colors disabled:cursor-not-allowed disabled:opacity-45',
    isSelected
      ? quizPalette.optionSelected
      : isDisabled
        ? quizPalette.optionDisabled
        : quizPalette.optionIdle,
  );
}

function getQuizOrderRowClass(themeClasses: ReturnType<typeof getLearningLabTheme>, quizPalette: QuizPalette, isDragging: boolean): string {
  return cx(
    'flex min-h-12 cursor-grab items-center gap-3 rounded-lg border px-3 py-2 text-sm font-black leading-6 shadow-sm transition-colors active:cursor-grabbing',
    themeClasses.focusRing,
    quizPalette.orderRow,
    isDragging && quizPalette.orderRowDragging,
  );
}

function getQuizOptionMarkerClass(quizPalette: QuizPalette, isSelected: boolean): string {
  return cx(
    'grid h-6 w-6 shrink-0 place-items-center transition-colors',
    isSelected ? quizPalette.optionMarkerSelected : quizPalette.optionMarkerIdle,
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
  const [activeOutlineItemKey, setActiveOutlineItemKey] = useState('0-0');
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);

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

        {extra.highlights && extra.id === 'llm-data-pipeline-architecture' ? (
          <LlmPipelineArchitecture
            items={extra.highlights.map((item) => ({
              shortName: text(item.shortName, language),
              fullName: text(item.fullName, language),
              description: text(item.description, language),
            }))}
            themeClasses={themeClasses}
          />
        ) : extra.highlights && extra.id === 'why-llms-are-popular-now' ? (
          <>
            <div className="learning-lab-focus-group grid gap-3 md:grid-cols-3">
              {extra.highlights.slice(0, 3).map((item, itemIndex) => (
                <ConceptHighlightCard
                  key={text(item.shortName, language)}
                  shortName={text(item.shortName, language)}
                  fullName={text(item.fullName, language)}
                  description={text(item.description, language)}
                  links={item.links?.map((link) => ({ label: text(link.label, language), href: link.href }))}
                  toneIndex={itemIndex}
                  isActive={activeHighlightIndex === itemIndex}
                  themeClasses={themeClasses}
                  onActivate={() => setActiveHighlightIndex(itemIndex)}
                />
              ))}
            </div>
            <figure className={cx('mx-auto w-full max-w-4xl overflow-hidden rounded-lg border', themeClasses.isLight ? 'border-[#205089]/10 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/42')}>
              <img
                src={getLearningAssetUrl('llm-from-scratch-roadmap.why-llms-popular-product')}
                alt="Ba lý do LLM dễ ứng dụng trong doanh nghiệp: dễ dùng, đa nhiệm và dễ tích hợp."
                className="aspect-[1672/941] w-full object-contain"
                loading="lazy"
              />
            </figure>
            <div className="learning-lab-focus-group grid gap-3 md:grid-cols-3">
              {extra.highlights.slice(3).map((item, itemOffset) => {
                const itemIndex = itemOffset + 3;
                return (
                  <ConceptHighlightCard
                    key={text(item.shortName, language)}
                    shortName={text(item.shortName, language)}
                    fullName={text(item.fullName, language)}
                    description={text(item.description, language)}
                    links={item.links?.map((link) => ({ label: text(link.label, language), href: link.href }))}
                    toneIndex={itemIndex}
                    isActive={activeHighlightIndex === itemIndex}
                    themeClasses={themeClasses}
                    onActivate={() => setActiveHighlightIndex(itemIndex)}
                  />
                );
              })}
            </div>
            <figure className={cx('mx-auto w-full max-w-4xl overflow-hidden rounded-lg border', themeClasses.isLight ? 'border-[#205089]/10 bg-white' : 'border-[#A8B8C8]/14 bg-[#121A24]/42')}>
              <img
                src={getLearningAssetUrl('llm-from-scratch-roadmap.why-llms-popular-technical')}
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
          ) : extra.id === 'colab-coding-requirements' ? (
            <div className={cx('mx-auto flex max-w-3xl gap-3 rounded-lg px-4 py-3 text-sm font-semibold leading-6', themeClasses.sectionAccent.note)}>
              <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#D97706]" strokeWidth={2.1} aria-hidden="true" />
              <div className="min-w-0">
                {extra.bodyAfter.map((paragraph) => (
                  <p key={text(paragraph, language)}>{text(paragraph, language)}</p>
                ))}
              </div>
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

function ConceptHighlightCard({
  shortName,
  fullName,
  description,
  links,
  toneIndex,
  isActive,
  themeClasses,
  onActivate,
}: {
  shortName: string;
  fullName: string;
  description: string;
  links?: Array<{ label: string; href: string }>;
  toneIndex: number;
  isActive: boolean;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  onActivate: () => void;
}) {
  const lightTones = [
    'border border-[#2F6F9F]/14 bg-[#EEF6FB] hover:bg-[#E7F2FA]',
    'border border-[#2F6B55]/14 bg-[#EEF7F2] hover:bg-[#E7F2EC]',
    'border border-[#B7791F]/16 bg-[#FFF7E6] hover:bg-[#FFF1D1]',
  ];
  const darkTones = [
    'border border-[#8FC7EA]/18 bg-[#183044]/52 hover:bg-[#1D3951]/62',
    'border border-[#A6E8C1]/18 bg-[#173528]/52 hover:bg-[#1C4030]/62',
    'border border-[#F2C94C]/20 bg-[#3A2D12]/50 hover:bg-[#473716]/62',
  ];
  const rowTone = themeClasses.isLight
    ? lightTones[toneIndex % lightTones.length]
    : darkTones[toneIndex % darkTones.length];

  return (
    <div
      data-active={isActive ? 'true' : undefined}
      tabIndex={0}
      onFocus={onActivate}
      onMouseEnter={onActivate}
      className={cx(
        'learning-lab-focus-panel group grid content-start gap-2 px-3 py-3 text-sm transition-[background-color,box-shadow,filter,opacity,transform] duration-200',
        themeClasses.radius.button,
        rowTone,
      )}
    >
      <div className={cx('text-sm font-black leading-6', themeClasses.titleText)}>{shortName}</div>
      <div className={cx('text-sm font-normal leading-6', themeClasses.titleText)}>{fullName}</div>
      <p className={cx('leading-6', themeClasses.bodyText)}>{description}</p>
      <ConceptHighlightLinks links={links} className="mt-1" themeClasses={themeClasses} />
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

function LlmPipelineArchitecture({
  items,
  themeClasses,
}: {
  items: Array<{ shortName: string; fullName: string; description: string }>;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const tokenColors = [
    'border-[#62B8EE]/60 bg-[#E7F6FF] text-[#0B4F7D]',
    'border-[#85D96F]/60 bg-[#F0FBEA] text-[#22670F]',
    'border-[#F4B84A]/62 bg-[#FFF5DF] text-[#835300]',
    'border-[#C997F4]/62 bg-[#F7EEFF] text-[#5B1AA0]',
    'border-[#F08A9D]/62 bg-[#FFF0F3] text-[#8A2438]',
  ];
  const tokenDarkColors = [
    'border-[#62B8EE]/45 bg-[#12344A] text-[#D8F0FF]',
    'border-[#85D96F]/45 bg-[#183A22] text-[#DCF9D4]',
    'border-[#F4B84A]/48 bg-[#3B2B10] text-[#FFE8B3]',
    'border-[#C997F4]/45 bg-[#2D1D43] text-[#F0DEFF]',
    'border-[#F08A9D]/45 bg-[#45202A] text-[#FFE0E6]',
  ];
  const tokens = [
    { label: '"Tôi"', id: '1284', vector: '[0.20, -0.10, 0.70]', position: '[0.01, 0.00, -0.02]', input: '[0.21, -0.10, 0.68]' },
    { label: '" thích"', id: '920', vector: '[0.05, 0.40, -0.30]', position: '[0.02, -0.01, 0.00]', input: '[0.07, 0.39, -0.30]' },
    { label: '" học"', id: '371', vector: '[0.60, 0.10, 0.20]', position: '[0.03, 0.01, -0.01]', input: '[0.63, 0.11, 0.19]' },
    { label: '" LLM"', id: '44591', vector: '[-0.20, 0.80, 0.10]', position: '[0.04, -0.02, 0.02]', input: '[-0.16, 0.78, 0.12]' },
    { label: '"."', id: '13', vector: '[0.00, -0.30, 0.50]', position: '[0.05, 0.02, -0.03]', input: '[0.05, -0.28, 0.47]' },
  ];
  const promptTokens = tokens.slice(0, 2);
  const pipelineExamples: PipelineExample[] = [
    {
      parts: ['"Tôi thích"'],
      note: 'Một prompt/raw text được đưa vào. Trong dataset training, đây là một đoạn text có token kế tiếp đã biết; khi generation, đây là prefix để model sinh tiếp.',
    },
    {
      shape: 'T = 2 token',
      tokens: promptTokens.map((token) => token.label),
      note: 'Tokenizer cắt câu thành các token theo vocabulary của model.',
    },
    {
      shape: 'ids shape: [T]',
      tokens: promptTokens.map((token) => token.id),
      note: 'Mỗi token được đổi thành một integer cố định. Các id trong hình là minh họa; tokenizer thật có thể cắt tiếng Việt khác đi.',
    },
    {
      shape: '[T, d_model]',
      rows: promptTokens.map((token) => `${token.id} -> ${token.vector}`),
      note: 'Mỗi token id được tra thành một vector số cơ bản. Vector vẫn chưa có ngữ cảnh, chỉ là vector đại diện cho token đó.',
    },
    {
      shape: '[T, d_model]',
      rows: promptTokens.map((token) => `${token.vector} + ${token.position} = ${token.input}`),
      note: 'Cộng thêm positional embedding cùng chiều để model biết token đang ở vị trí nào trong context window.',
    },
    {
      shape: 'logits shape: [T, vocab_size]',
      flow: [
        {
          title: 'Input',
          label: '[T, d_model]',
          lines: promptTokens.map((token) => token.input),
        },
        {
          title: 'GPT blocks',
          label: 'context vectors',
          lines: ['pos 0 -> [0.18, ..., 0.31]', 'pos 1 -> [0.11, ..., 0.74]'],
        },
        {
          title: 'Logits',
          label: 'mỗi vị trí x vocab',
          lines: ['pos 0 -> [...V]', 'pos 1 -> [...V]'],
        },
        {
          title: 'Last logits',
          label: 'dùng khi generate',
          colorByRow: true,
          lines: ['3.2', '0.4', '...', '-1.1'],
        },
        {
          title: 'Vocab candidates',
          colorByRow: true,
          lines: ['" học"', '" ăn"', '...', '" xe"'],
        },
      ],
      note: 'GPT tạo logits trên toàn bộ vocabulary cho từng vị trí. Training có thể dùng mọi vị trí; generation thường lấy hàng logits cuối rồi argmax hoặc sampling.',
    },
    {
      shape: 'training branch',
      flow: [
        {
          title: 'Logits',
          label: '[T, vocab_size]',
          lines: ['pos 0 -> [...V]', 'pos 1 -> [...V]'],
        },
        {
          title: 'Targets',
          label: 'shifted [T]',
          tone: 'selected',
          lines: ['" thích"', '" học"'],
        },
        {
          title: 'Softmax',
          label: 'over vocab',
          lines: ['P(" học") = 0.82'],
        },
        {
          title: 'CE loss',
          lines: ['-log(0.82)'],
        },
      ],
      note: 'Trong training, target là token kế tiếp đã biết trong dataset. Softmax chạy trên toàn bộ vocab; model càng gán xác suất cao cho target thì loss càng thấp.',
    },
    {
      shape: 'generation branch',
      flow: [
        {
          title: 'Last logits',
          label: '[vocab_size]',
          lines: ['3.2', '0.4', '...', '-1.1'],
          colorByRow: true,
        },
        {
          title: 'Choose',
          label: 'argmax/sample',
          tone: 'selected',
          lines: ['id 371'],
        },
        {
          title: 'Token id',
          tone: 'selected',
          lines: ['371'],
        },
        {
          title: 'Decode',
          tone: 'selected',
          lines: ['" học"'],
        },
        {
          title: 'Prompt mới',
          tokens: ['"Tôi"', '" thích"', '" học"'],
          selectedTokenIndexes: [2],
        },
      ],
      note: 'Decode đổi token id đã chọn thành chữ, rồi append vào prompt. Nếu lặp lại GPT -> choose -> decode, câu sẽ dài thêm từng token.',
    },
  ];
  const frameTone = themeClasses.isLight
    ? 'bg-white'
    : 'bg-[#121A24]/42';
  const stepTone = themeClasses.isLight
    ? 'bg-white/60 text-[#062A4A]'
    : 'bg-[#A8B8C8]/6 text-[#E2EAF1]';
  const exampleTone = themeClasses.isLight
    ? 'border-[#205089]/10 bg-white/72 text-[#123B68]'
    : 'border-[#A8B8C8]/14 bg-[#0E1620]/42 text-[#E2EAF1]';
  const arrowTone = themeClasses.isLight ? 'text-[#7A8794]' : 'text-[#A8B8C8]/70';

  return (
    <div className={cx('overflow-hidden rounded-lg p-4 md:p-5', frameTone)}>
      <div className="grid gap-2">
        {items.map((item, itemIndex) => {
          const example = pipelineExamples[itemIndex];
          const nextItem = items[itemIndex + 1];
          const shouldShowStepArrow = Boolean(nextItem && !nextItem.shortName.endsWith('*'));
          return (
            <div key={item.fullName} className="grid gap-2">
              <div className="grid gap-3 lg:grid-cols-[9.5rem_minmax(0,1.2fr)_minmax(0,0.42fr)] lg:items-stretch">
                <div
                  className={cx(
                    'grid content-center rounded-lg px-2.5 py-2',
                    stepTone,
                  )}
                >
                  <div className="text-base font-medium leading-6">
                    {item.shortName}. {item.fullName}
                  </div>
                </div>
                <div className={cx('grid content-center rounded-lg border px-4 py-3 text-center', exampleTone)}>
                  <PipelineExampleView
                    example={example}
                    tokenTones={themeClasses.isLight ? tokenColors : tokenDarkColors}
                    themeClasses={themeClasses}
                  />
                </div>
                <div className={cx('grid content-center rounded-lg border px-4 py-3 text-center', exampleTone)}>
                  <p className={cx('text-center text-sm font-semibold leading-6', themeClasses.bodyText)}>{example?.note}</p>
                </div>
              </div>
              {shouldShowStepArrow ? (
                <div className="grid gap-3 lg:grid-cols-[9.5rem_minmax(0,1.2fr)_minmax(0,0.42fr)]" aria-hidden="true">
                  <div className="hidden lg:block" />
                  <div className={cx('grid h-5 w-full place-items-center text-center text-2xl font-black leading-none', arrowTone)}>
                    ↓
                  </div>
                  <div className="hidden lg:block" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type PipelineExample = {
  flow?: Array<{ title: string; label?: string; lines?: string[]; tokens?: string[]; selectedTokenIndexes?: number[]; colorByRow?: boolean; tone?: 'selected' }>;
  parts?: string[];
  rows?: string[];
  shape?: string;
  tokens?: string[];
  note: string;
};

function PipelineExampleView({
  example,
  tokenTones,
  themeClasses,
}: {
  example?: PipelineExample;
  tokenTones: string[];
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  if (!example) return null;

  const flowTitleTone = themeClasses.isLight ? 'text-[#123B68]' : 'text-[#F2F6FA]';
  const flowLabelTone = themeClasses.isLight ? 'text-[#57728D]' : 'text-[#B7C5D2]';
  const flowArrowTone = themeClasses.isLight ? 'text-[#7A8794]' : 'text-[#A8B8C8]/70';
  const rankedTones = themeClasses.isLight
    ? [
        'border-[#64748B] bg-[#64748B] text-white',
        'border-[#94A3B8] bg-[#94A3B8] text-white',
        'border-[#CBD5E1] bg-[#CBD5E1] text-[#243244]',
        'border-[#E2E8F0] bg-[#E2E8F0] text-[#243244]',
      ]
    : [
        'border-[#E2E8F0] bg-[#E2E8F0] text-[#111827]',
        'border-[#CBD5E1] bg-[#CBD5E1] text-[#111827]',
        'border-[#94A3B8] bg-[#94A3B8] text-[#111827]',
        'border-[#64748B] bg-[#64748B] text-white',
      ];
  const outputTokenTones = themeClasses.isLight
    ? [
        'border-[#7DD3FC]/60 bg-[#E0F2FE] text-[#075985]',
        'border-[#C4B5FD]/60 bg-[#EDE9FE] text-[#5B21B6]',
        'border-[#F9A8D4]/60 bg-[#FCE7F3] text-[#9D174D]',
      ]
    : [
        'border-[#7DD3FC]/42 bg-[#123A4A] text-[#E0F2FE]',
        'border-[#C4B5FD]/42 bg-[#2E225C] text-[#EDE9FE]',
        'border-[#F9A8D4]/42 bg-[#4A1D35] text-[#FCE7F3]',
      ];
  const getFlowTone = (
    column: NonNullable<PipelineExample['flow']>[number],
    columnIndex: number,
    lineIndex: number,
  ) => {
    if (column.tone === 'selected') return rankedTones[0];
    if (column.colorByRow) return rankedTones[lineIndex % rankedTones.length];
    return tokenTones[(columnIndex + lineIndex) % tokenTones.length];
  };

  return (
    <div className="grid justify-items-center gap-2">
      {example.shape ? (
        <span className={cx('rounded-full px-2.5 py-1 font-mono text-[0.68rem] font-black leading-4', flowLabelTone)}>
          {example.shape}
        </span>
      ) : null}
      {example.flow ? (
        <div className="flex w-full flex-col items-stretch gap-2 md:flex-row md:justify-center">
          {example.flow.map((column, columnIndex) => (
            <Fragment key={column.title}>
              <div className="grid min-w-0 flex-1 gap-1 px-1 py-1 text-center">
                <div className="grid min-h-9 content-start gap-0.5">
                  <div className={cx('text-[0.68rem] font-black leading-4', flowTitleTone)}>
                    {column.title}
                  </div>
                  {column.label ? (
                    <div className={cx('text-[0.68rem] font-medium leading-4', flowLabelTone)}>
                      {column.label}
                    </div>
                  ) : null}
                </div>
                <div className="grid content-center gap-1.5">
                  {column.lines?.map((line, lineIndex) => (
                    <span
                      key={`${column.title}-${line}`}
                      className={cx(
                        'break-words rounded-md border px-2 py-1 font-mono text-[0.68rem] font-black leading-4 md:text-xs',
                        getFlowTone(column, columnIndex, lineIndex),
                      )}
                    >
                      {line}
                    </span>
                  ))}
                  {column.tokens ? (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {column.tokens.map((token, tokenIndex) => (
                        <span
                          key={`${column.title}-${token}`}
                          className={cx(
                            'rounded-md border px-2 py-1 font-mono text-[0.68rem] font-black leading-4 md:text-xs',
                            column.selectedTokenIndexes?.includes(tokenIndex)
                              ? rankedTones[0]
                              : outputTokenTones[tokenIndex % outputTokenTones.length],
                          )}
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              {columnIndex < example.flow!.length - 1 ? (
                <div className={cx('grid grid-rows-[2.25rem_1fr] text-lg font-black leading-none', flowArrowTone)}>
                  <span aria-hidden="true" />
                  <span className="hidden place-items-center md:grid">→</span>
                  <span className="grid place-items-center md:hidden">↓</span>
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      ) : null}
      {example.rows ? (
        <div className="grid gap-1.5">
          {example.rows.map((row, rowIndex) => (
            <span
              key={row}
              className={cx(
                'rounded-md border px-2.5 py-1 font-mono text-xs font-black leading-5 md:text-sm',
                tokenTones[rowIndex % tokenTones.length],
              )}
            >
              {row}
            </span>
          ))}
        </div>
      ) : null}
      {example.tokens ? (
        <div className="flex flex-wrap justify-center gap-1.5">
          {example.tokens.map((token, tokenIndex) => (
            <span
              key={`${token}-${tokenIndex}`}
              className={cx(
                'rounded-md border px-2.5 py-1 font-mono text-xs font-black leading-5 md:text-sm',
                tokenTones[tokenIndex % tokenTones.length],
              )}
            >
              {token}
            </span>
          ))}
        </div>
      ) : null}
      {example.parts ? (
        <pre className="whitespace-pre-wrap break-words text-center font-mono text-sm font-black leading-6">
          {example.parts.join('\n')}
        </pre>
      ) : null}
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

function LlmPipelineArchitecture({
  items,
  themeClasses,
}: {
  items: Array<{ shortName: string; fullName: string; description: string }>;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const tokenColors = [
    'border-[#62B8EE]/60 bg-[#E7F6FF] text-[#0B4F7D]',
    'border-[#85D96F]/60 bg-[#F0FBEA] text-[#22670F]',
    'border-[#F4B84A]/62 bg-[#FFF5DF] text-[#835300]',
    'border-[#C997F4]/62 bg-[#F7EEFF] text-[#5B1AA0]',
    'border-[#F08A9D]/62 bg-[#FFF0F3] text-[#8A2438]',
  ];
  const tokenDarkColors = [
    'border-[#62B8EE]/45 bg-[#12344A] text-[#D8F0FF]',
    'border-[#85D96F]/45 bg-[#183A22] text-[#DCF9D4]',
    'border-[#F4B84A]/48 bg-[#3B2B10] text-[#FFE8B3]',
    'border-[#C997F4]/45 bg-[#2D1D43] text-[#F0DEFF]',
    'border-[#F08A9D]/45 bg-[#45202A] text-[#FFE0E6]',
  ];
  const tokens = [
    { label: '"Tôi"', id: '1284', vector: '[0.20, -0.10, 0.70]', position: '[0.01, 0.00, -0.02]', input: '[0.21, -0.10, 0.68]' },
    { label: '" thích"', id: '920', vector: '[0.05, 0.40, -0.30]', position: '[0.02, -0.01, 0.00]', input: '[0.07, 0.39, -0.30]' },
    { label: '" học"', id: '371', vector: '[0.60, 0.10, 0.20]', position: '[0.03, 0.01, -0.01]', input: '[0.63, 0.11, 0.19]' },
    { label: '" LLM"', id: '44591', vector: '[-0.20, 0.80, 0.10]', position: '[0.04, -0.02, 0.02]', input: '[-0.16, 0.78, 0.12]' },
    { label: '"."', id: '13', vector: '[0.00, -0.30, 0.50]', position: '[0.05, 0.02, -0.03]', input: '[0.05, -0.28, 0.47]' },
  ];
  const promptTokens = tokens.slice(0, 2);
  const pipelineExamples: PipelineExample[] = [
    {
      parts: ['"Tôi thích"'],
      note: 'Một prompt/raw text được đưa vào. Trong dataset training, đây là một đoạn text có token kế tiếp đã biết; khi generation, đây là prefix để model sinh tiếp.',
    },
    {
      shape: 'T = 2 token',
      tokens: promptTokens.map((token) => token.label),
      note: 'Tokenizer cắt câu thành các token theo vocabulary của model.',
    },
    {
      shape: 'ids shape: [T]',
      tokens: promptTokens.map((token) => token.id),
      note: 'Mỗi token được đổi thành một integer cố định. Các id trong hình là minh họa; tokenizer thật có thể cắt tiếng Việt khác đi.',
    },
    {
      shape: '[T, d_model]',
      rows: promptTokens.map((token) => `${token.id} -> ${token.vector}`),
      note: 'Mỗi token id được tra thành một vector số cơ bản. Vector vẫn chưa có ngữ cảnh, chỉ là vector đại diện cho token đó.',
    },
    {
      shape: '[T, d_model]',
      rows: promptTokens.map((token) => `${token.vector} + ${token.position} = ${token.input}`),
      note: 'Cộng thêm positional embedding cùng chiều để model biết token đang ở vị trí nào trong context window.',
    },
    {
      shape: 'logits shape: [T, vocab_size]',
      flow: [
        {
          title: 'Input',
          label: '[T, d_model]',
          lines: promptTokens.map((token) => token.input),
        },
        {
          title: 'GPT blocks',
          label: 'context vectors',
          lines: ['pos 0 -> [0.18, ..., 0.31]', 'pos 1 -> [0.11, ..., 0.74]'],
        },
        {
          title: 'Logits',
          label: 'mỗi vị trí x vocab',
          lines: ['pos 0 -> [...V]', 'pos 1 -> [...V]'],
        },
        {
          title: 'Last logits',
          label: 'dùng khi generate',
          colorByRow: true,
          lines: ['3.2', '0.4', '...', '-1.1'],
        },
        {
          title: 'Vocab candidates',
          colorByRow: true,
          lines: ['" học"', '" ăn"', '...', '" xe"'],
        },
      ],
      note: 'GPT tạo logits trên toàn bộ vocabulary cho từng vị trí. Training có thể dùng mọi vị trí; generation thường lấy hàng logits cuối rồi argmax hoặc sampling.',
    },
    {
      shape: 'training branch',
      flow: [
        {
          title: 'Logits',
          label: '[T, vocab_size]',
          lines: ['pos 0 -> [...V]', 'pos 1 -> [...V]'],
        },
        {
          title: 'Targets',
          label: 'shifted [T]',
          tone: 'selected',
          lines: ['" thích"', '" học"'],
        },
        {
          title: 'Softmax',
          label: 'over vocab',
          lines: ['P(" học") = 0.82'],
        },
        {
          title: 'CE loss',
          lines: ['-log(0.82)'],
        },
      ],
      note: 'Trong training, target là token kế tiếp đã biết trong dataset. Softmax chạy trên toàn bộ vocab; model càng gán xác suất cao cho target thì loss càng thấp.',
    },
    {
      shape: 'generation branch',
      flow: [
        {
          title: 'Last logits',
          label: '[vocab_size]',
          lines: ['3.2', '0.4', '...', '-1.1'],
          colorByRow: true,
        },
        {
          title: 'Choose',
          label: 'argmax/sample',
          tone: 'selected',
          lines: ['id 371'],
        },
        {
          title: 'Token id',
          tone: 'selected',
          lines: ['371'],
        },
        {
          title: 'Decode',
          tone: 'selected',
          lines: ['" học"'],
        },
        {
          title: 'Prompt mới',
          tokens: ['"Tôi"', '" thích"', '" học"'],
          selectedTokenIndexes: [2],
        },
      ],
      note: 'Decode đổi token id đã chọn thành chữ, rồi append vào prompt. Nếu lặp lại GPT -> choose -> decode, câu sẽ dài thêm từng token.',
    },
  ];
  const frameTone = themeClasses.isLight
    ? 'bg-white'
    : 'bg-[#121A24]/42';
  const stepTone = themeClasses.isLight
    ? 'bg-white/60 text-[#062A4A]'
    : 'bg-[#A8B8C8]/6 text-[#E2EAF1]';
  const exampleTone = themeClasses.isLight
    ? 'border-[#205089]/10 bg-white/72 text-[#123B68]'
    : 'border-[#A8B8C8]/14 bg-[#0E1620]/42 text-[#E2EAF1]';
  const arrowTone = themeClasses.isLight ? 'text-[#7A8794]' : 'text-[#A8B8C8]/70';

  return (
    <div className={cx('overflow-hidden rounded-lg p-4 md:p-5', frameTone)}>
      <div className="grid gap-2">
        {items.map((item, itemIndex) => {
          const example = pipelineExamples[itemIndex];
          const nextItem = items[itemIndex + 1];
          const shouldShowStepArrow = Boolean(nextItem && !nextItem.shortName.endsWith('*'));
          return (
            <div key={item.fullName} className="grid gap-2">
              <div className="grid gap-3 lg:grid-cols-[9.5rem_minmax(0,1.2fr)_minmax(0,0.42fr)] lg:items-stretch">
                <div
                  className={cx(
                    'grid content-center rounded-lg px-2.5 py-2',
                    stepTone,
                  )}
                >
                  <div className="text-base font-medium leading-6">
                    {item.shortName}. {item.fullName}
                  </div>
                </div>
                <div className={cx('grid content-center rounded-lg border px-4 py-3 text-center', exampleTone)}>
                  <PipelineExampleView
                    example={example}
                    tokenTones={themeClasses.isLight ? tokenColors : tokenDarkColors}
                    themeClasses={themeClasses}
                  />
                </div>
                <div className={cx('grid content-center rounded-lg border px-4 py-3 text-center', exampleTone)}>
                  <p className={cx('text-center text-sm font-semibold leading-6', themeClasses.bodyText)}>{example?.note}</p>
                </div>
              </div>
              {shouldShowStepArrow ? (
                <div className="grid gap-3 lg:grid-cols-[9.5rem_minmax(0,1.2fr)_minmax(0,0.42fr)]" aria-hidden="true">
                  <div className="hidden lg:block" />
                  <div className={cx('grid h-5 w-full place-items-center text-center text-2xl font-black leading-none', arrowTone)}>
                    ↓
                  </div>
                  <div className="hidden lg:block" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type PipelineExample = {
  flow?: Array<{ title: string; label?: string; lines?: string[]; tokens?: string[]; selectedTokenIndexes?: number[]; colorByRow?: boolean; tone?: 'selected' }>;
  parts?: string[];
  rows?: string[];
  shape?: string;
  tokens?: string[];
  note: string;
};

function PipelineExampleView({
  example,
  tokenTones,
  themeClasses,
}: {
  example?: PipelineExample;
  tokenTones: string[];
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  if (!example) return null;

  const flowTitleTone = themeClasses.isLight ? 'text-[#123B68]' : 'text-[#F2F6FA]';
  const flowLabelTone = themeClasses.isLight ? 'text-[#57728D]' : 'text-[#B7C5D2]';
  const flowArrowTone = themeClasses.isLight ? 'text-[#7A8794]' : 'text-[#A8B8C8]/70';
  const rankedTones = themeClasses.isLight
    ? [
        'border-[#64748B] bg-[#64748B] text-white',
        'border-[#94A3B8] bg-[#94A3B8] text-white',
        'border-[#CBD5E1] bg-[#CBD5E1] text-[#243244]',
        'border-[#E2E8F0] bg-[#E2E8F0] text-[#243244]',
      ]
    : [
        'border-[#E2E8F0] bg-[#E2E8F0] text-[#111827]',
        'border-[#CBD5E1] bg-[#CBD5E1] text-[#111827]',
        'border-[#94A3B8] bg-[#94A3B8] text-[#111827]',
        'border-[#64748B] bg-[#64748B] text-white',
      ];
  const outputTokenTones = themeClasses.isLight
    ? [
        'border-[#7DD3FC]/60 bg-[#E0F2FE] text-[#075985]',
        'border-[#C4B5FD]/60 bg-[#EDE9FE] text-[#5B21B6]',
        'border-[#F9A8D4]/60 bg-[#FCE7F3] text-[#9D174D]',
      ]
    : [
        'border-[#7DD3FC]/42 bg-[#123A4A] text-[#E0F2FE]',
        'border-[#C4B5FD]/42 bg-[#2E225C] text-[#EDE9FE]',
        'border-[#F9A8D4]/42 bg-[#4A1D35] text-[#FCE7F3]',
      ];
  const getFlowTone = (
    column: NonNullable<PipelineExample['flow']>[number],
    columnIndex: number,
    lineIndex: number,
  ) => {
    if (column.tone === 'selected') return rankedTones[0];
    if (column.colorByRow) return rankedTones[lineIndex % rankedTones.length];
    return tokenTones[(columnIndex + lineIndex) % tokenTones.length];
  };

  return (
    <div className="grid justify-items-center gap-2">
      {example.shape ? (
        <span className={cx('rounded-full px-2.5 py-1 font-mono text-[0.68rem] font-black leading-4', flowLabelTone)}>
          {example.shape}
        </span>
      ) : null}
      {example.flow ? (
        <div className="flex w-full flex-col items-stretch gap-2 md:flex-row md:justify-center">
          {example.flow.map((column, columnIndex) => (
            <Fragment key={column.title}>
              <div className="grid min-w-0 flex-1 gap-1 px-1 py-1 text-center">
                <div className="grid min-h-9 content-start gap-0.5">
                  <div className={cx('text-[0.68rem] font-black leading-4', flowTitleTone)}>
                    {column.title}
                  </div>
                  {column.label ? (
                    <div className={cx('text-[0.68rem] font-medium leading-4', flowLabelTone)}>
                      {column.label}
                    </div>
                  ) : null}
                </div>
                <div className="grid content-center gap-1.5">
                  {column.lines?.map((line, lineIndex) => (
                    <span
                      key={`${column.title}-${line}`}
                      className={cx(
                        'break-words rounded-md border px-2 py-1 font-mono text-[0.68rem] font-black leading-4 md:text-xs',
                        getFlowTone(column, columnIndex, lineIndex),
                      )}
                    >
                      {line}
                    </span>
                  ))}
                  {column.tokens ? (
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {column.tokens.map((token, tokenIndex) => (
                        <span
                          key={`${column.title}-${token}`}
                          className={cx(
                            'rounded-md border px-2 py-1 font-mono text-[0.68rem] font-black leading-4 md:text-xs',
                            column.selectedTokenIndexes?.includes(tokenIndex)
                              ? rankedTones[0]
                              : outputTokenTones[tokenIndex % outputTokenTones.length],
                          )}
                        >
                          {token}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
              {columnIndex < example.flow!.length - 1 ? (
                <div className={cx('grid grid-rows-[2.25rem_1fr] text-lg font-black leading-none', flowArrowTone)}>
                  <span aria-hidden="true" />
                  <span className="hidden place-items-center md:grid">→</span>
                  <span className="grid place-items-center md:hidden">↓</span>
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      ) : null}
      {example.rows ? (
        <div className="grid gap-1.5">
          {example.rows.map((row, rowIndex) => (
            <span
              key={row}
              className={cx(
                'rounded-md border px-2.5 py-1 font-mono text-xs font-black leading-5 md:text-sm',
                tokenTones[rowIndex % tokenTones.length],
              )}
            >
              {row}
            </span>
          ))}
        </div>
      ) : null}
      {example.tokens ? (
        <div className="flex flex-wrap justify-center gap-1.5">
          {example.tokens.map((token, tokenIndex) => (
            <span
              key={`${token}-${tokenIndex}`}
              className={cx(
                'rounded-md border px-2.5 py-1 font-mono text-xs font-black leading-5 md:text-sm',
                tokenTones[tokenIndex % tokenTones.length],
              )}
            >
              {token}
            </span>
          ))}
        </div>
      ) : null}
      {example.parts ? (
        <pre className="whitespace-pre-wrap break-words text-center font-mono text-sm font-black leading-6">
          {example.parts.join('\n')}
        </pre>
      ) : null}
    </div>
  );
}

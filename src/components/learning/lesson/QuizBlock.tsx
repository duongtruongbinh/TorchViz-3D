import { Check, CheckCircle2, Circle, GripVertical, RotateCcw, Square, XCircle } from 'lucide-react';
import { type DragEvent, useEffect, useRef, useState } from 'react';
import type { LearningLessonExtra } from '../authoredTypes';
import { getStrings, type Language } from '../../../lib/localization';
import { getLearningLocalizedText as text } from '../learningText';
import { cx, getLearningLabTheme } from '../theme';
import { scrollLearningLabElementIntoView } from './scrolling';

export default function QuizBlock({
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
        <div className={cx('text-base font-normal leading-7 md:text-lg md:leading-8', quizPalette.title)}>
          {text(question.title, language)}
        </div>
        {promptText ? (
          <p className={cx('text-base font-normal leading-7 md:text-lg md:leading-8', quizPalette.prompt)}>{promptText}</p>
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
  const unsortedLabel = question.unsortedLabel ? text(question.unsortedLabel, language) : strings.quizCategorizeUnsorted;
  const completeLabel = question.completeLabel ? text(question.completeLabel, language) : strings.quizCategorizeComplete;
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
        {question.hideUnsortedLabel ? null : (
          <div className={cx('text-xs font-black uppercase tracking-wide', quizPalette.categoryCaption)}>
            {unsortedLabel}
          </div>
        )}
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
              {completeLabel}
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

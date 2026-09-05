import { Check, CheckCircle2, Circle, GripVertical, RotateCcw, Square, XCircle } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { type DragEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { LearningLessonExtra } from '../authoredTypes';
import { getStrings, type Language } from '../../../lib/localization';
import { getLearningLocalizedText as text } from '../learningText';
import { cx, type getLearningLabTheme } from '../theme';
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
  const [activeId, setActiveId] = useState<string | null>(null);
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderIds.indexOf(active.id as string);
    const newIndex = orderIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    const nextIds = arrayMove(orderIds, oldIndex, newIndex);
    onStateChange({ selectedIds: nextIds, categoryAssignments, feedback: null });
  }, [orderIds, categoryAssignments, onStateChange]);

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

  const handleQuestionKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter') return;
    if (!canCheck) return;
    event.preventDefault();
    checkAnswer();
    event.currentTarget.closest('article')?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!feedback) return;
    const frameId = window.requestAnimationFrame(() => {
      scrollLearningLabElementIntoView(feedbackRef.current);
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [feedback]);

  return (
    <div
      data-quiz
      onKeyDown={handleQuestionKeyDown}
      className={cx(
        'py-1',
        quizPalette.card,
      )}>
      {promptText ? (
        <p className={cx('text-base font-semibold leading-7 md:text-lg md:leading-8', quizPalette.prompt)}>{renderQuizText(promptText, themeClasses)}</p>
      ) : null}

      {isOrderMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={orderIds} strategy={verticalListSortingStrategy}>
            <div className="mt-5 grid gap-1">
              {orderIds.map((id) => {
                const option = question.options.find((item) => item.id === id);
                if (!option) return null;
                return (
                  <SortableOrderRow
                    key={id}
                    id={id}
                    index={orderIds.indexOf(id)}
                    label={text(option.label, language)}
                    themeClasses={themeClasses}
                    quizPalette={quizPalette}
                  />
                );
              })}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeId ? (() => {
              const activeOption = question.options.find((item) => item.id === activeId);
              if (!activeOption) return null;
              return (
                <OrderRowOverlay
                  index={orderIds.indexOf(activeId)}
                  label={text(activeOption.label, language)}
                  quizPalette={quizPalette}
                />
              );
            })() : null}
          </DragOverlay>
        </DndContext>
      ) : isCategorizeMode ? (
        <CategorizeQuestion
          assignments={categoryAssignments}
          feedback={feedback}
          language={language}
          question={question}
          quizPalette={quizPalette}
          themeClasses={themeClasses}
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
                <span>{renderQuizText(text(option.label, language), themeClasses)}</span>
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
          <p>{renderQuizText(text(feedback === 'correct' ? question.success : question.error, language), themeClasses)}</p>
        </div>
      ) : null}
    </div>
  );
}

function SortableOrderRow({
  id,
  index,
  label,
  themeClasses,
  quizPalette,
}: {
  id: string;
  index: number;
  label: string;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
  quizPalette: QuizPalette;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={getQuizOrderRowClass(themeClasses, quizPalette, isDragging)}
      {...attributes}
      {...listeners}
    >
      <span className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-xs font-black tabular-nums', quizPalette.orderNumber)}>
        {index + 1}
      </span>
      <span className="min-w-0 flex-1">{label}</span>
      <GripVertical className={cx('h-4 w-4 shrink-0', quizPalette.dragIcon)} strokeWidth={2.2} aria-hidden="true" />
    </div>
  );
}

function OrderRowOverlay({
  index,
  label,
  quizPalette,
}: {
  index: number;
  label: string;
  quizPalette: QuizPalette;
}) {
  return (
    <div
      className={cx(
        'flex min-h-12 cursor-grabbing items-center gap-3 rounded-lg border px-3 py-2 text-sm font-normal leading-6 shadow-xl',
        quizPalette.orderRow,
      )}
      style={{ transform: 'scale(1.02)' }}
    >
      <span className={cx('grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-xs font-black tabular-nums', quizPalette.orderNumber)}>
        {index + 1}
      </span>
      <span className="min-w-0 flex-1">{label}</span>
      <GripVertical className={cx('h-4 w-4 shrink-0', quizPalette.dragIcon)} strokeWidth={2.2} aria-hidden="true" />
    </div>
  );
}

function renderQuizText(value: string, themeClasses: ReturnType<typeof getLearningLabTheme>): ReactNode {
  return value.split(/(`[^`]+`|"[^"]+"|\$[^$\n]+\$)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const html = katex.renderToString(part.slice(1, -1), { displayMode: false, throwOnError: false });
      return <span key={`${index}-${part}`} className="px-0.5 [&_.katex]:text-inherit" dangerouslySetInnerHTML={{ __html: html }} />;
    }
    const isBacktickCode = part.startsWith('`') && part.endsWith('`');
    const isQuotedCode = part.startsWith('"') && part.endsWith('"');
    if (isBacktickCode || isQuotedCode) {
      return <code key={`${index}-${part}`} className={cx('rounded px-1.5 py-0.5 font-mono text-[0.88em] font-semibold', themeClasses.isLight ? 'bg-[#E8EEF5] text-[#123B68]' : 'bg-[#263B5B] text-[#DCE8F4]')}>{part.slice(1, -1)}</code>;
    }
    return <span key={`${index}-${part}`}>{part}</span>;
  });
}

function CategorizeQuestion({
  assignments,
  feedback,
  language,
  question,
  quizPalette,
  themeClasses,
  onAssign,
}: {
  assignments: Record<string, string>;
  feedback: QuizQuestionState['feedback'];
  language: Language;
  question: Extract<LearningLessonExtra, { kind: 'quiz' }>['questions'][number];
  quizPalette: QuizPalette;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
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
        className={cx('grid min-h-16 gap-2 rounded-xl p-3.5', quizPalette.categoryBank)}
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
          {unassignedOptions.length ? (
            (question.oneByOne ? unassignedOptions.slice(0, 1) : unassignedOptions).map((option) => (
              <TokenChip
                isIncorrect={isOptionIncorrect(option)}
                key={option.id}
                label={text(option.label, language)}
                optionId={option.id}
                quizPalette={quizPalette}
                themeClasses={themeClasses}
              />
            ))
          ) : (
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
                'grid min-h-28 gap-2 rounded-xl border p-3.5 transition-colors',
                hasIncorrectOption ? quizPalette.categoryZoneIncorrect : quizPalette.categoryZone,
              )}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(event) => handleDrop(event, category.id)}
            >
              <div className={cx('text-xs font-black uppercase tracking-wide', quizPalette.categoryTitle)}>
                {text(category.label, language)}
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((option) => (
                  <TokenChip
                    isAssigned
                    isIncorrect={isOptionIncorrect(option)}
                    key={option.id}
                    label={text(option.label, language)}
                    optionId={option.id}
                    quizPalette={quizPalette}
                    themeClasses={themeClasses}
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
  isAssigned = false,
  isIncorrect,
  label,
  optionId,
  quizPalette,
  themeClasses,
}: {
  isAssigned?: boolean;
  isIncorrect: boolean;
  label: string;
  optionId: string;
  quizPalette: QuizPalette;
  themeClasses: ReturnType<typeof getLearningLabTheme>;
}) {
  const chipStyle = isAssigned
    ? isIncorrect ? quizPalette.tokenChipAssignedIncorrect : quizPalette.tokenChipAssigned
    : isIncorrect ? quizPalette.tokenChipIncorrect : quizPalette.tokenChip;

  return (
    <span
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', optionId);
      }}
      className={cx(
        'inline-flex min-h-9 cursor-grab items-center rounded-lg px-3.5 py-2 text-sm font-normal leading-6 transition-colors active:cursor-grabbing',
        chipStyle,
      )}
    >
      {renderQuizText(label, themeClasses)}
    </span>
  );
}

type QuizPalette = ReturnType<typeof getQuizPalette>;

export function getQuizPalette(themeClasses: ReturnType<typeof getLearningLabTheme>) {
  if (!themeClasses.isLight) {
    return {
      card: '',
      prompt: themeClasses.accentText,
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
      categoryBank: 'bg-[#121A24]/42',
      categoryCaption: 'text-[#D7EAFE]/70',
      categoryZone: 'border-[#A8B8C8]/18 bg-[#A8B8C8]/6',
      categoryZoneIncorrect: 'border-[#FCA5A5]/42 bg-[#FCA5A5]/10',
      categoryTitle: 'text-[#F2F6FA]',
      tokenChip: 'border-2 border-dashed border-[#A8B8C8]/30 bg-[#172232] text-[#F2F6FA]/90',
      tokenChipIncorrect: 'border-2 border-dashed border-[#FCA5A5]/54 bg-[#FCA5A5]/14 text-[#FCA5A5]',
      tokenChipAssigned: 'border border-[#A8B8C8]/20 bg-[#121A24]/60 text-[#F2F6FA]/90',
      tokenChipAssignedIncorrect: 'border border-[#FCA5A5]/50 bg-[#FCA5A5]/14 text-[#FCA5A5]',
      checkButton: 'bg-[#D7DCE2] text-[#121A24] hover:bg-[#F2F6FA]',
      disabledButton: 'bg-[#A8B8C8]/8 text-[#F2F6FA]/24',
      resetButton: 'bg-[#A8B8C8]/10 text-[#F2F6FA]/76 hover:bg-[#A8B8C8]/14',
      feedbackCorrect: 'border-[#A6E8C1]/18 bg-[#A6E8C1]/10 text-[#A6E8C1]',
      feedbackIncorrect: 'border-[#FCA5A5]/18 bg-[#FCA5A5]/10 text-[#FCA5A5]',
    };
  }

  return {
    card: '',
    prompt: 'text-[#2F78B7]',
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
    categoryBank: 'bg-[#EFF3F8]',
    categoryCaption: 'text-[#205089]/75',
    categoryZone: 'border-[#205089]/16 bg-white/90 shadow-sm hover:border-[#205089]/35 hover:bg-[#F8FAFC]',
    categoryZoneIncorrect: 'border-[#C45151]/40 bg-[#FBECEC]',
    categoryTitle: 'text-[#172A43]',
    tokenChip: 'border-2 border-dashed border-[#205089]/30 bg-white text-[#172A43] shadow-[0_2px_8px_rgba(32,80,137,0.06)] hover:border-[#205089]/60 hover:bg-[#FAFBFD]',
    tokenChipIncorrect: 'border-2 border-dashed border-[#C45151]/48 bg-[#FBECEC] text-[#8C3333] shadow-[0_2px_8px_rgba(196,81,81,0.08)]',
    tokenChipAssigned: 'border border-[#205089]/18 bg-[#F4F8FC] text-[#172A43] shadow-none hover:border-[#205089]/40 hover:bg-[#EAF2FA]',
    tokenChipAssignedIncorrect: 'border border-[#C45151]/50 bg-[#FBECEC] text-[#8C3333]',
    checkButton: 'border border-[#CBD5E1] bg-[#E2E8F0] text-[#172A43] shadow-[0_8px_18px_rgba(15,23,42,0.10)] hover:bg-[#CBD5E1]',
    disabledButton: 'bg-[#B8C8DA]/12 text-[#64748B]/40 shadow-none',
    resetButton: 'bg-[#2F6B55]/8 text-[#1F5A46] hover:bg-[#2F6B55]/12',
    feedbackCorrect: 'border-[#1F6F48]/18 bg-[#E8F7EE] text-[#1F6F48]',
    feedbackIncorrect: 'border-[#8C3333]/18 bg-[#FBECEC] text-[#8C3333]',
  };
}

function getQuizOptionClass(quizPalette: QuizPalette, isDisabled: boolean, isSelected: boolean): string {
  return cx(
    'inline-flex min-h-12 items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm font-normal leading-6 transition-colors disabled:cursor-not-allowed disabled:opacity-45',
    isSelected
      ? quizPalette.optionSelected
      : isDisabled
        ? quizPalette.optionDisabled
        : quizPalette.optionIdle,
  );
}

function getQuizOrderRowClass(themeClasses: ReturnType<typeof getLearningLabTheme>, quizPalette: QuizPalette, isDragging: boolean): string {
  return cx(
    'flex min-h-12 cursor-grab items-center gap-3 rounded-lg border px-3 py-2 text-sm font-normal leading-6 shadow-sm transition-colors active:cursor-grabbing',
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

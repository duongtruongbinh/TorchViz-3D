import React, { useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, CircleX, Lightbulb, X } from 'lucide-react';
import type { LayoutNode } from '../../lib/irTypes';
import type { getStrings } from '../../lib/localization';
import {
  buildValueExerciseModel,
  checkNumericAnswers,
  type ValueExerciseId,
  type ValueExerciseModel,
} from '../../lib/valueExerciseModels';
import { useExerciseModalLifecycle } from './useExerciseModalLifecycle';

export const ValueExercise: React.FC<{
  isOpen: boolean;
  exerciseId: ValueExerciseId | null;
  node: LayoutNode | null | undefined;
  fallbackModal?: boolean;
  t: ReturnType<typeof getStrings>['canvas']['demo'];
  language: 'en' | 'vi';
  theme?: 'dark' | 'light';
  displayMode?: 'modal' | 'inline';
  onClose?: () => void;
}> = ({ isOpen, exerciseId, node, t, language, theme = 'dark', displayMode = 'modal', onClose = () => {} }) => {
  const isInline = displayMode === 'inline';
  const titleId = useId();
  const model = useMemo(() => (
    exerciseId && node ? buildValueExerciseModel(exerciseId, node, language) : null
  ), [exerciseId, language, node]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [poolMode, setPoolMode] = useState<PoolMode>('max');
  const [poolKernel, setPoolKernel] = useState(2);
  const [poolStride, setPoolStride] = useState(2);
  const [poolAnswers, setPoolAnswers] = useState<string[]>([]);
  const [poolHintIndex, setPoolHintIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [activationHintIndex, setActivationHintIndex] = useState<number | null>(null);
  const { closeButtonRef } = useExerciseModalLifecycle({ isOpen: isOpen && !isInline, onClose });
  const poolOutput = useMemo(
    () => computePoolOutput(POOL_INPUT_MATRIX, poolKernel, poolStride, poolMode),
    [poolKernel, poolMode, poolStride],
  );
  const poolExpected = useMemo(() => poolOutput.flat(), [poolOutput]);

  useEffect(() => {
    if (!isOpen || !model) return;
    setAnswers(model.expectedAnswers.map(() => ''));
    setPoolMode(/avgpool/i.test(node?.op_type ?? '') ? 'avg' : 'max');
    setPoolKernel(2);
    setPoolStride(2);
    setPoolHintIndex(null);
    setActivationHintIndex(null);
    setSubmitted(false);
    setShowHint(false);
  }, [isOpen, model, node?.op_type]);

  useEffect(() => {
    setPoolAnswers(poolExpected.map(() => ''));
    setPoolHintIndex(null);
    setSubmitted(false);
  }, [poolExpected]);

  useEffect(() => {
    if (!showHint || model?.id !== 'pool-value') {
      setPoolHintIndex(null);
    }
    if (!showHint || model?.id !== 'activation-value') {
      setActivationHintIndex(null);
    }
  }, [model?.id, showHint]);

  const statuses = model ? checkNumericAnswers(answers, model.expectedAnswers) : [];
  const poolStatuses = checkNumericAnswers(poolAnswers, poolExpected);
  const poolCorrect = poolStatuses.filter(Boolean).length;
  const poolOutputCols = poolOutput[0]?.length ?? 0;
  const poolHintCell = poolHintIndex !== null && poolOutputCols > 0
    ? {
      row: Math.floor(poolHintIndex / poolOutputCols),
      col: poolHintIndex % poolOutputCols,
    }
    : null;
  const poolHintWindow = poolHintCell
    ? {
      row: poolHintCell.row * poolStride,
      col: poolHintCell.col * poolStride,
      size: poolKernel,
    }
    : null;
  const poolHintDetail = poolHintCell
    ? getPoolHintDetail(POOL_INPUT_MATRIX, poolHintCell.row, poolHintCell.col, poolKernel, poolStride, poolMode)
    : null;

  const showPoolHint = () => {
    const nextIndex = poolExpected.findIndex((expected, index) => (
      !checkNumericAnswers([poolAnswers[index] ?? ''], [expected])[0]
    ));
    const targetIndex = nextIndex >= 0 ? nextIndex : 0;
    setPoolHintIndex(targetIndex);
    setSubmitted(false);
    setShowHint(true);
    setPoolAnswers((current) => current.map((answer, index) => (
      index === targetIndex ? formatPoolValue(poolExpected[targetIndex]) : answer
    )));
  };

  const showActivationHint = () => {
    if (!model) return;
    const nextIndex = model.expectedAnswers.findIndex((expected, index) => (
      !checkNumericAnswers([answers[index] ?? ''], [expected])[0]
    ));
    const targetIndex = nextIndex >= 0 ? nextIndex : 0;
    setActivationHintIndex(targetIndex);
    setSubmitted(false);
    setShowHint(true);
    setAnswers((current) => current.map((answer, index) => (
      index === targetIndex ? formatPoolValue(model.expectedAnswers[targetIndex]) : answer
    )));
  };

  if (!isOpen || (!isInline && typeof document === 'undefined')) return null;

  const content = (
      <div
        className={`${isInline ? 'flex min-h-0 w-full flex-col overflow-hidden rounded-md border border-zinc-700/70 bg-zinc-950 text-zinc-100' : 'flex w-[min(86rem,calc(100%-1.25rem))] max-h-[calc(100vh-1.25rem)] flex-col overflow-hidden rounded-lg border border-zinc-700/70 bg-zinc-950 text-zinc-100 shadow-2xl'}`}
        role={isInline ? undefined : 'dialog'}
        aria-modal={isInline ? undefined : true}
        aria-labelledby={titleId}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-zinc-800 bg-zinc-950/95 px-4 py-3">
          <div className="min-w-0 self-center">
            <h2 id={titleId} className="text-sm font-bold uppercase tracking-wider text-zinc-100">
              {model?.title ?? t.exercises}
            </h2>
            {(model?.subtitle ?? node?.op_type) && (
              <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
                {model?.subtitle ?? node?.op_type}
              </p>
            )}
          </div>
          {!isInline ? (
            <button
              ref={closeButtonRef}
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center justify-self-end rounded-md border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-white"
              onClick={onClose}
              aria-label={t.closeExercise}
              title={t.closeExercise}
            >
              <X className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </button>
          ) : null}
        </div>

      {!model ? (
        <div className="min-h-0 flex-1 p-5 text-sm text-zinc-300">
          {t.noValueExercise}
        </div>
      ) : (
        <>
        <div className="min-h-0 flex-1 overflow-auto">
        {model.id === 'pool-value' ? (
          <div className="grid grid-cols-1 gap-5 p-5 xl:grid-cols-[minmax(22rem,1fr)_minmax(15rem,0.55fr)_minmax(22rem,1fr)]">
            <section className="min-w-0 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  {t.valueExercise.inputTable}
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  {POOL_INPUT_MATRIX.length} x {POOL_INPUT_MATRIX[0].length}
                </span>
              </div>
              <NumberGrid
                matrix={POOL_INPUT_MATRIX}
                highlightWindow={poolHintWindow}
                activeCell={poolHintDetail?.activeCell ?? null}
                tone="sky"
                cellClassName="min-h-12 text-base"
              />
            </section>

            <section className="flex min-w-0 flex-col justify-center gap-3 p-4">
              <div className="rounded-md border border-zinc-800 bg-zinc-950/80 p-4">
                <div className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-200">
                  {t.valueExercise.poolingConfig}
                </div>
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      {t.valueExercise.poolingType}
                    </span>
                    <select
                      value={poolMode}
                      onChange={(event) => setPoolMode(event.currentTarget.value as PoolMode)}
                      className="h-9 w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 text-sm font-semibold text-zinc-100 outline-none focus:border-sky-300"
                    >
                      <option value="max">MaxPool</option>
                      <option value="avg">AvgPool</option>
                    </select>
                  </label>
                  <StepperField
                    label="kernel"
                    value={poolKernel}
                    min={2}
                    max={3}
                    onChange={setPoolKernel}
                  />
                  <StepperField
                    label="stride"
                    value={poolStride}
                    min={1}
                    max={2}
                    onChange={setPoolStride}
                  />
                </div>
                <div className="mt-4 rounded-md border border-sky-300/15 bg-sky-400/10 px-3 py-2 font-mono text-[11px] font-bold text-sky-100">
                  output = {poolOutput.length} x {poolOutput[0]?.length ?? 0}
                </div>
              </div>
            </section>

            <section className="min-w-0 p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                  {t.valueExercise.fillOutput}
                </h3>
                <span className="text-[10px] font-mono text-zinc-500">
                  {submitted ? `${poolCorrect}/${poolExpected.length}` : `0/${poolExpected.length}`}
                </span>
              </div>
              <div
                className="grid gap-1 rounded-md border border-emerald-300/15 bg-zinc-950/80 p-2"
                style={{ gridTemplateColumns: `repeat(${poolOutput[0]?.length ?? 1}, minmax(0, 1fr))` }}
              >
                {poolExpected.map((expected, index) => {
                  const isCorrect = poolStatuses[index] ?? false;
                  const isHintCell = poolHintIndex === index;
                  return (
                    <input
                      key={`${poolMode}-${poolKernel}-${poolStride}-${index}`}
                      type="text"
                      inputMode="decimal"
                      value={poolAnswers[index] ?? ''}
                      onChange={(event) => {
                        const value = event.currentTarget.value.replace(/[^\d.-]/g, '');
                        setPoolAnswers((current) => current.map((item, answerIndex) => (
                          answerIndex === index ? value : item
                        )));
                      }}
                      className={`aspect-square min-h-12 rounded-sm border bg-zinc-900/75 px-1 text-center text-sm font-mono font-bold outline-none transition-colors ${
                        isHintCell
                          ? 'border-amber-300/80 bg-amber-300/14 text-amber-50 ring-1 ring-amber-300/25 animate-pulse'
                          : submitted
                          ? isCorrect
                            ? 'border-emerald-300/70 text-emerald-100 ring-1 ring-emerald-300/20'
                            : 'border-red-300/70 text-red-100 ring-1 ring-red-300/20'
                          : 'border-zinc-600/70 text-zinc-100 focus:border-sky-300'
                      }`}
                      aria-label={t.valueExercise.outputCell(index + 1)}
                      title={submitted && !isCorrect ? t.expected(expected) : undefined}
                    />
                  );
                })}
              </div>
            </section>

            {showHint && (
              <section className="rounded-lg border border-amber-500/20 bg-amber-950/5 p-4 text-sm text-amber-50 xl:col-span-3">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {t.hintExercise}
                </div>
                <div className="space-y-2 font-mono text-[11px] leading-relaxed text-zinc-300">
                  <div>
                    {poolHintCell
                      ? t.valueExercise.poolHint({
                        stride: poolStride,
                        outputRow: poolHintCell.row + 1,
                        outputCol: poolHintCell.col + 1,
                        windowRow: poolHintWindow!.row + 1,
                        windowCol: poolHintWindow!.col + 1,
                        mode: poolMode,
                      })
                      : t.valueExercise.poolHintIdle}
                  </div>
                  {poolHintDetail && (
                    <div className="rounded-md border border-amber-300/20 bg-zinc-950/80 px-3 py-2 text-amber-100">
                      {poolHintDetail.formula}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        ) : model.id === 'activation-value' ? (
          <ActivationValuePanel
            model={model}
            answers={answers}
            statuses={statuses}
            submitted={submitted}
            t={t}
            showHint={showHint}
            activationHintIndex={activationHintIndex}
            onAnswerChange={(index, value) => {
              setAnswers((current) => current.map((item, answerIndex) => (
                answerIndex === index ? value : item
              )));
              setActivationHintIndex(null);
              setShowHint(false);
            }}
          />
        ) : (
        <div className="grid grid-cols-1 gap-5 p-5 xl:grid-cols-[minmax(18rem,1fr)_minmax(16rem,0.8fr)_minmax(18rem,1fr)]">
          <section className="min-w-0 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                {model.displaySections[0]?.title ?? 'Input'}
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                {model.displaySections.length}
              </span>
            </div>
            <div className="grid gap-3">
              {model.displaySections.map((section) => (
                <div key={section.title} className="rounded-md border border-sky-300/15 bg-zinc-950/80 p-3">
                  <div className="mb-2 border-b border-zinc-800/80 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    {section.title}
                  </div>
                  <div className="space-y-1 font-mono text-sm font-bold leading-relaxed text-sky-100">
                    {section.rows.map((row) => <div key={row}>{row}</div>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex min-w-0 flex-col justify-center gap-3 p-4">
            <div className="rounded-md border border-zinc-800 bg-zinc-950/80 p-4">
              <div className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-200">
                {model.subtitle}
              </div>
              <p className="border-l-2 border-sky-500 pl-3.5 text-sm font-medium leading-relaxed text-zinc-100/95">
                {model.prompt}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {model.configRows.map((row) => (
                  <span key={row} className="rounded-md border border-sky-300/20 bg-sky-400/12 px-2.5 py-1 font-mono text-[10px] font-bold text-sky-100">
                    {row}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="min-w-0 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                {t.enterAnswer}
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                {submitted ? `${statuses.filter(Boolean).length}/${model.expectedAnswers.length}` : `0/${model.expectedAnswers.length}`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {model.expectedAnswers.map((expected, index) => {
                const answer = answers[index] ?? '';
                const hasStatus = submitted;
                const isCorrect = statuses[index] ?? false;
                return (
                  <label key={`${model.seed}-${index}`} className="block">
                    <span className="mb-1 block text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">{model.answerLabels[index]}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={answer}
                      onChange={(event) => {
                        const value = event.currentTarget.value.replace(/[^\d.-]/g, '');
                        setAnswers((current) => current.map((item, answerIndex) => (
                          answerIndex === index ? value : item
                        )));
                      }}
                      className={`h-10 w-full rounded-md border text-center text-sm font-semibold outline-none transition-all ${
                        hasStatus
                          ? isCorrect
                            ? 'border-emerald-500/50 bg-emerald-950/15 text-emerald-300 ring-1 ring-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.05)]'
                            : 'border-rose-500/50 bg-rose-950/15 text-rose-300 ring-1 ring-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.05)]'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/25'
                      }`}
                      aria-label={`Answer ${model.answerLabels[index]}`}
                    />
                    {hasStatus && (
                      <span className={`mt-1.5 flex items-center justify-center gap-1 text-[10px] font-medium leading-none ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isCorrect ? (
                          <>
                            <Check className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                            {t.correct}
                          </>
                        ) : (
                          <>
                            <CircleX className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                            {t.expected(expected)}
                          </>
                        )}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </section>

          {showHint && (
            <section className="rounded-lg border border-amber-500/20 bg-amber-950/5 p-4 text-sm text-amber-50 xl:col-span-3">
              <div className="mb-3 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                {t.hintExercise}
              </div>
              <div className="space-y-1.5 p-2.5 rounded bg-amber-950/20 border border-amber-500/10 font-mono text-[11px] text-zinc-300 leading-relaxed">
                {model.hintLines.map((line, idx) => (
                  <div key={line} className={idx > 0 ? "border-t border-amber-500/5 pt-1.5" : ""}>
                    {line}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-950/95 px-4 py-3">
          <p className="text-xs text-zinc-400">
            {model.id === 'pool-value'
              ? (submitted ? `${poolCorrect}/${poolExpected.length}` : `${poolOutput.length} x ${poolOutput[0]?.length ?? 0}`)
              : submitted
              ? `${statuses.filter(Boolean).length}/${model.expectedAnswers.length}`
              : t.enterAnswer}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-8 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white"
              onClick={() => {
                setAnswers(model.expectedAnswers.map(() => ''));
                setPoolAnswers(poolExpected.map(() => ''));
                setPoolHintIndex(null);
                setActivationHintIndex(null);
                setSubmitted(false);
                setShowHint(false);
              }}
            >
              {t.resetExercise}
            </button>
            <button
              type="button"
              className={`h-8 rounded-md border px-3 text-xs font-semibold transition-all ${
                showHint
                  ? 'border-amber-300/70 bg-amber-400/20 text-amber-100 ring-1 ring-amber-300/20'
                  : 'border-amber-300/45 bg-amber-400/14 text-amber-100 hover:bg-amber-400/24'
              }`}
              onClick={() => {
                if (model.id === 'pool-value') {
                  showPoolHint();
                  return;
                }
                if (model.id === 'activation-value') {
                  showActivationHint();
                  return;
                }
                setShowHint((visible) => !visible);
              }}
            >
              {t.hintExercise}
            </button>
            <button
              type="button"
              className="h-8 rounded-md border border-emerald-300/45 bg-emerald-400/18 px-3 text-xs font-semibold text-emerald-100 hover:bg-emerald-400/28"
              onClick={() => setSubmitted(true)}
            >
              {t.checkExercise}
            </button>
          </div>
        </div>
        </>
      )}
      </div>
  );

  if (isInline) {
    return (
      <div className={theme === 'light' ? 'learning-lab-light learning-exercise-modal-root' : ''}>
        {content}
      </div>
    );
  }

  return createPortal((
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm pointer-events-auto ${theme === 'light' ? 'learning-lab-light learning-exercise-modal-root' : ''}`}>
      {content}
    </div>
  ), document.body);
};

type PoolMode = 'max' | 'avg';
type DemoLabels = ReturnType<typeof getStrings>['canvas']['demo'];

const POOL_INPUT_MATRIX = [
  [2, 5, 1, 0, 3],
  [4, 7, 6, 2, 1],
  [3, 8, 9, 4, 2],
  [1, 6, 5, 7, 0],
  [2, 3, 4, 1, 5],
];

function computePoolOutput(input: number[][], kernel: number, stride: number, mode: PoolMode): number[][] {
  const rows = Math.floor((input.length - kernel) / stride) + 1;
  const cols = Math.floor((input[0].length - kernel) / stride) + 1;
  return Array.from({ length: rows }, (_, row) => (
    Array.from({ length: cols }, (_, col) => {
      const values: number[] = [];
      for (let kr = 0; kr < kernel; kr++) {
        for (let kc = 0; kc < kernel; kc++) {
          values.push(input[row * stride + kr][col * stride + kc]);
        }
      }
      if (mode === 'max') return Math.max(...values);
      return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
    })
  ));
}

function getPoolHintDetail(
  input: number[][],
  outputRow: number,
  outputCol: number,
  kernel: number,
  stride: number,
  mode: PoolMode,
): { activeCell: { row: number; col: number } | null; formula: string } {
  const startRow = outputRow * stride;
  const startCol = outputCol * stride;
  const values: Array<{ value: number; row: number; col: number }> = [];
  for (let kr = 0; kr < kernel; kr++) {
    for (let kc = 0; kc < kernel; kc++) {
      values.push({
        value: input[startRow + kr][startCol + kc],
        row: startRow + kr,
        col: startCol + kc,
      });
    }
  }

  if (mode === 'max') {
    const maxCell = values.reduce((best, item) => (item.value > best.value ? item : best), values[0]);
    return {
      activeCell: { row: maxCell.row, col: maxCell.col },
      formula: `max(${values.map((item) => item.value).join(', ')}) = ${maxCell.value}`,
    };
  }

  const sum = values.reduce((total, item) => total + item.value, 0);
  const avg = Number((sum / values.length).toFixed(2));
  return {
    activeCell: null,
    formula: `(${values.map((item) => item.value).join(' + ')}) / ${values.length} = ${formatPoolValue(avg)}`,
  };
}

function formatPoolValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

const NumberGrid: React.FC<{
  matrix: number[][];
  highlightWindow?: { row: number; col: number; size: number } | null;
  activeCell?: { row: number; col: number } | null;
  tone?: 'sky' | 'emerald';
  cellClassName?: string;
}> = ({ matrix, highlightWindow = null, activeCell = null, tone = 'sky', cellClassName = '' }) => (
  <div
    className="grid gap-1 rounded-md border border-sky-300/15 bg-zinc-950/80 p-2"
    style={{ gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, minmax(0, 1fr))` }}
  >
    {matrix.flatMap((row, rowIndex) => row.map((value, colIndex) => {
      const inWindow = !!highlightWindow
        && rowIndex >= highlightWindow.row
        && rowIndex < highlightWindow.row + highlightWindow.size
        && colIndex >= highlightWindow.col
        && colIndex < highlightWindow.col + highlightWindow.size;
      const active = activeCell?.row === rowIndex && activeCell?.col === colIndex;
      const color = tone === 'emerald' ? 'text-emerald-100' : 'text-sky-100';
      return (
        <div
          key={`${rowIndex}-${colIndex}`}
          className={`flex aspect-square items-center justify-center rounded-sm border font-mono font-bold ${
            active
              ? 'z-10 border-sky-100 bg-sky-300/40 text-white shadow-[0_0_18px_rgba(56,189,248,0.35)]'
              : inWindow
              ? 'border-amber-300/60 bg-amber-300/14 text-amber-50'
              : `border-zinc-700/70 bg-zinc-900/75 ${color}`
          } ${cellClassName}`}
        >
          {value}
        </div>
      );
    }))}
  </div>
);

const StepperField: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}> = ({ label, value, min, max, onChange }) => (
  <label className="block">
    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
      {label}
    </span>
    <div className="grid grid-cols-[2rem_minmax(0,1fr)_2rem] overflow-hidden rounded-md border border-zinc-700 bg-zinc-900">
      <button
        type="button"
        className="flex h-9 items-center justify-center border-r border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:text-zinc-700"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        -
      </button>
      <div className="flex h-9 items-center justify-center font-mono text-sm font-bold text-zinc-100">
        {value}
      </div>
      <button
        type="button"
        className="flex h-9 items-center justify-center border-l border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:text-zinc-700"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </button>
    </div>
  </label>
);

const ActivationValuePanel: React.FC<{
  model: ValueExerciseModel;
  answers: string[];
  statuses: boolean[];
  submitted: boolean;
  t: DemoLabels;
  showHint: boolean;
  activationHintIndex: number | null;
  onAnswerChange: (index: number, value: string) => void;
}> = ({ model, answers, statuses, submitted, t, showHint, activationHintIndex, onAnswerChange }) => {
  const inputValues = model.inputValues ?? readVectorSection(model.displaySections[0]?.rows[0] ?? '');

  return (
    <div className="grid grid-cols-1 gap-5 p-5 xl:grid-cols-[minmax(20rem,0.85fr)_minmax(22rem,1fr)_minmax(22rem,0.95fr)]">
      <section className="min-w-0 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            {t.valueExercise.inputVector}
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">
            {inputValues.length}
          </span>
        </div>
        <div className="rounded-md border border-sky-300/15 bg-zinc-950/80 p-3">
          <div className="grid grid-cols-5 gap-2">
            {inputValues.map((value, index) => {
              const isHintCell = activationHintIndex === index;
              return (
                <div
                  key={`${value}-${index}`}
                  className={`flex h-14 flex-col items-center justify-center rounded-sm border font-mono transition-all ${
                    isHintCell
                      ? 'border-amber-300/80 bg-amber-300/14 text-amber-50 ring-1 ring-amber-300/25 animate-pulse'
                      : value < 0
                      ? 'border-red-300/35 bg-red-400/10 text-red-100'
                      : value === 0
                        ? 'border-zinc-600/70 bg-zinc-900/75 text-zinc-300'
                        : 'border-sky-300/35 bg-sky-400/12 text-sky-100'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">x{index}</span>
                  <span className="text-sm font-bold">{formatPoolValue(value)}</span>
                </div>
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {t.valueExercise.reluKeepsPositive}
        </p>
      </section>

      <section className="flex min-w-0 flex-col justify-center gap-3 p-4">
        <div className="rounded-md border border-zinc-800 bg-zinc-950/80 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">ReLU</h3>
            <span className="rounded border border-sky-300/20 bg-sky-400/12 px-2 py-1 font-mono text-[10px] font-bold text-sky-100">
              {model.configRows[0] ?? 'rule=max(0, x)'}
            </span>
          </div>
          <ReluChart t={t} />
        </div>
      </section>

      <section className="min-w-0 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            {t.enterAnswer}
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">
            {submitted ? `${statuses.filter(Boolean).length}/${model.expectedAnswers.length}` : `0/${model.expectedAnswers.length}`}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2 rounded-md border border-emerald-300/15 bg-zinc-950/80 p-3">
          {model.expectedAnswers.map((expected, index) => {
            const hasStatus = submitted;
            const isCorrect = statuses[index] ?? false;
            const isHintCell = activationHintIndex === index;
            return (
              <label key={`${model.seed}-${index}`} className="block">
                <span className="mb-1 block text-center text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                  {model.answerLabels[index]}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={answers[index] ?? ''}
                  onChange={(event) => onAnswerChange(index, event.currentTarget.value.replace(/[^\d.-]/g, ''))}
                  className={`h-12 w-full rounded-sm border bg-zinc-900/75 px-1 text-center text-sm font-mono font-bold outline-none transition-colors ${
                    isHintCell
                      ? 'border-amber-300/80 bg-amber-300/14 text-amber-50 ring-1 ring-amber-300/25 animate-pulse'
                      : hasStatus
                      ? isCorrect
                        ? 'border-emerald-300/70 text-emerald-100 ring-1 ring-emerald-300/20'
                        : 'border-red-300/70 text-red-100 ring-1 ring-red-300/20'
                      : 'border-zinc-600/70 text-zinc-100 focus:border-sky-300'
                  }`}
                  aria-label={`Answer ${model.answerLabels[index]}`}
                  title={submitted && !isCorrect ? t.expected(expected) : undefined}
                />
              </label>
            );
          })}
        </div>
      </section>

      {showHint && (
        <section className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-zinc-200 xl:col-span-3">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-amber-400" strokeWidth={1.8} aria-hidden="true" />
            {t.hintExercise}
          </div>
          <div className="space-y-3 font-mono text-sm leading-relaxed text-zinc-300">
            <div>
              {activationHintIndex !== null
                ? t.valueExercise.activationHint({ index: activationHintIndex, input: inputValues[activationHintIndex] })
                : t.valueExercise.activationHintIdle}
            </div>
            {activationHintIndex !== null && (() => {
              const v = inputValues[activationHintIndex];
              const formula = v < 0
                ? `x${activationHintIndex} = ${v} < 0  ⇒  y${activationHintIndex} = max(0, ${v}) = 0`
                : `x${activationHintIndex} = ${v} ≥ 0  ⇒  y${activationHintIndex} = max(0, ${v}) = ${v}`;
              return (
                <div className="rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-2 text-zinc-100 font-bold">
                  {formula}
                </div>
              );
            })()}
            <div className="border-t border-zinc-800 mt-2.5 pt-2.5">
              <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
                {t.valueExercise.generalRule}
              </div>
              {model.hintLines.map((line) => (
                <div key={line} className="text-zinc-400">
                  • {line}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const ReluChart: React.FC<{ t: DemoLabels }> = ({ t }) => (
  <div className="relative h-52 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
    <svg viewBox="0 0 320 180" className="h-full w-full" role="img" aria-label={t.valueExercise.reluGraph}>
      <defs>
        <linearGradient id="relu-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="45%" stopColor="#64748b" />
          <stop offset="46%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <g stroke="#1f2937" strokeWidth="1">
        {[40, 80, 120, 160, 200, 240, 280].map((x) => <line key={`x-${x}`} x1={x} x2={x} y1="18" y2="154" />)}
        {[34, 64, 94, 124, 154].map((y) => <line key={`y-${y}`} x1="26" x2="298" y1={y} y2={y} />)}
      </g>
      <line x1="26" x2="298" y1="124" y2="124" stroke="#94a3b8" strokeWidth="1.5" />
      <line x1="152" x2="152" y1="18" y2="154" stroke="#94a3b8" strokeWidth="1.5" />
      <polyline points="42,124 152,124 276,28" fill="none" stroke="url(#relu-line)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="152" cy="124" r="4" fill="#fbbf24" />
      <text x="282" y="31" fill="#d1fae5" fontSize="12" fontWeight="700">y=x</text>
      <text x="48" y="116" fill="#cbd5e1" fontSize="12" fontWeight="700">0</text>
      <text x="160" y="139" fill="#fef3c7" fontSize="12" fontWeight="700">x=0</text>
      <text x="98" y="166" fill="#94a3b8" fontSize="11">{t.valueExercise.negativeInput}</text>
      <text x="206" y="166" fill="#67e8f9" fontSize="11">{t.valueExercise.positiveInput}</text>
    </svg>
  </div>
);

function readVectorSection(row: string): number[] {
  const matches = row.match(/-?\d+(?:\.\d+)?/g);
  return matches ? matches.map(Number) : [];
}

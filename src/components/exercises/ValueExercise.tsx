import React, { useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { LayoutNode } from '../../lib/irTypes';
import type { getStrings } from '../../lib/localization';
import {
  buildValueExerciseModel,
  checkNumericAnswers,
  type ValueExerciseId,
} from '../../lib/valueExerciseModels';

export const ValueExercise: React.FC<{
  isOpen: boolean;
  exerciseId: ValueExerciseId | null;
  node: LayoutNode | null | undefined;
  fallbackModal?: boolean;
  t: ReturnType<typeof getStrings>['canvas']['demo'];
  language: 'en' | 'vi';
  onClose: () => void;
}> = ({ isOpen, exerciseId, node, t, language, onClose }) => {
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

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal((
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm pointer-events-auto">
      <div
        className="flex w-[min(86rem,calc(100%-1.25rem))] max-h-[calc(100vh-1.25rem)] flex-col overflow-hidden rounded-lg border border-zinc-700/70 bg-zinc-950 text-zinc-100 shadow-2xl"
        role="dialog"
        aria-modal="true"
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
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center justify-self-end rounded-md border border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-zinc-500 hover:text-white"
            onClick={onClose}
            aria-label={t.closeExercise}
            title={t.closeExercise}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L8.94 10l-4.72 4.72a.75.75 0 1 0 1.06 1.06L10 11.06l4.72 4.72a.75.75 0 1 0 1.06-1.06L11.06 10l4.72-4.72a.75.75 0 1 0-1.06-1.06L10 8.94 5.28 4.22Z" />
            </svg>
          </button>
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
                  {language === 'vi' ? 'Bảng đầu vào' : 'Input table'}
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
                  {language === 'vi' ? 'Cấu hình pooling' : 'Pooling config'}
                </div>
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      {language === 'vi' ? 'Loại pooling' : 'Pooling type'}
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
                  {language === 'vi' ? 'Điền output' : 'Fill output'}
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
                      aria-label={`Output cell ${index + 1}`}
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
                      ? (language === 'vi'
                        ? `Với stride = ${poolStride}, ô output (${poolHintCell.row + 1}, ${poolHintCell.col + 1}) đọc window bắt đầu tại hàng ${poolHintWindow!.row + 1}, cột ${poolHintWindow!.col + 1}; sau đó lấy ${poolMode === 'max' ? 'giá trị lớn nhất' : 'trung bình'} trong window.`
                        : `With stride = ${poolStride}, output (${poolHintCell.row + 1}, ${poolHintCell.col + 1}) reads the window starting at row ${poolHintWindow!.row + 1}, col ${poolHintWindow!.col + 1}; then takes the ${poolMode === 'max' ? 'maximum value' : 'average'} from that window.`)
                      : (language === 'vi' ? 'Bấm Hint để xem một ô output.' : 'Press Hint to inspect one output cell.')}
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            {t.correct}
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M10 2a6 6 0 00-6 6c0 1.887.874 3.57 2.25 4.686A3.722 3.722 0 017.5 15.5c0 .6.4 1 1 1h3c.6 0 1-.4 1-1a3.722 3.722 0 011.25-2.814A6 6 0 0016 8a6 6 0 00-6-6z" />
                </svg>
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
                setSubmitted(false);
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
    </div>
  ), document.body);
};

type PoolMode = 'max' | 'avg';

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

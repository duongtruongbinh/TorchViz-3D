import React, { useEffect, useMemo, useState } from 'react';
import type { LayoutNode } from '../../lib/irTypes';
import type { getStrings } from '../../lib/localization';
import type { SpatialShapeSteps } from '../../lib/shapeMath';
import {
  buildShapeExerciseModel,
  type ShapeExerciseId,
  type ShapeExerciseModel,
} from '../../lib/shapeExerciseModels';
import { LearningDrawer } from './LearningDrawer';

type ShapeExerciseProps = {
  isOpen: boolean;
  exerciseId?: ShapeExerciseId;
  node: LayoutNode | null | undefined;
  fallbackModal?: boolean;
  t: ReturnType<typeof getStrings>['canvas']['demo'];
  language: 'en' | 'vi';
  onClose: () => void;
};

const DEFAULT_DIM_LABELS = ['N', 'C', 'H', 'W'];

export const ShapeExercise: React.FC<ShapeExerciseProps> = ({
  isOpen,
  exerciseId = 'shape-output',
  node,
  fallbackModal = false,
  t,
  language,
  onClose,
}) => {
  const model = useMemo(
    () => (node ? buildShapeExerciseModel(node, exerciseId, language) : null),
    [exerciseId, language, node],
  );
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!isOpen || !model) return;
    setAnswers(model.expectedShape.map(() => ''));
    setSubmitted(false);
    setShowHint(false);
  }, [isOpen, model]);

  const updateAnswer = (index: number, value: string) => {
    setAnswers((current) => current.map((answer, answerIndex) => (
      answerIndex === index ? value.replace(/[^\d-]/g, '') : answer
    )));
  };

  return (
    <LearningDrawer
      isOpen={isOpen}
      title={t.shapeExerciseTitle}
      subtitle={model?.opType ?? node?.op_type ?? 'Layer'}
      closeLabel={t.closeExercise}
      fallbackModal={fallbackModal}
      onClose={onClose}
    >
      {!model ? (
        <div className="p-5 text-sm text-zinc-300">
          {t.noShapeExercise}
        </div>
      ) : (
        <div className="space-y-5 overflow-y-auto p-5">
          <section className="grid gap-3 sm:grid-cols-2">
            <InfoPanel title={t.inputShapeLabel} value={formatShape(model.inputShape)} />
            <InfoPanel title={t.layerConfigLabel} value={model.configRows.join(' · ')} isConfig />
          </section>

          <section>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              {t.enterOutputShape}
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {model.expectedShape.map((expected, index) => {
                const answer = answers[index] ?? '';
                const isCorrect = answer.trim() !== '' && Number(answer) === expected;
                const hasStatus = submitted;
                const label = model.dimLabels?.[index] ?? DEFAULT_DIM_LABELS[index] ?? `D${index}`;
                return (
                  <label key={`${index}-${expected}`} className="block">
                    <span className="mb-1 block text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">{label}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={answer}
                      onChange={(event) => updateAnswer(index, event.target.value)}
                      className={`h-10 w-full rounded-md border text-center text-sm font-semibold outline-none transition-all ${
                        hasStatus
                          ? isCorrect
                            ? 'border-emerald-500/50 bg-emerald-950/15 text-emerald-300 ring-1 ring-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.05)]'
                            : 'border-rose-500/50 bg-rose-950/15 text-rose-300 ring-1 ring-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.05)]'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-100 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/25'
                      }`}
                      aria-label={`Output shape dimension ${label}`}
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

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900/60">
            <button
              type="button"
              className="h-9 flex items-center gap-1.5 rounded-md bg-gradient-to-r from-sky-500 to-blue-600 px-4 text-xs font-semibold text-white shadow-md hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] transition-all"
              onClick={() => setSubmitted(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              {t.checkAnswer}
            </button>
            <button
              type="button"
              className="h-9 flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 px-4 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white active:scale-[0.98] transition-all"
              onClick={() => {
                setAnswers(model.expectedShape.map(() => ''));
                setSubmitted(false);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.75a.75.75 0 00-.75.75v4.467a.75.75 0 001.5 0v-2.296l.312.311a7 7 0 0011.712-3.138.75.75 0 10-1.212-.6zM17 3.75a.75.75 0 00-1.5 0v2.296l-.312-.311a7 7 0 00-11.712 3.138.75.75 0 101.212.6 5.5 5.5 0 019.201-2.466l.312.311h-2.433a.75.75 0 000 1.5H16.25a.75.75 0 00.75-.75V3.75z" clipRule="evenodd" />
              </svg>
              {t.resetExercise}
            </button>
            <button
              type="button"
              className={`h-9 flex items-center gap-1.5 rounded-md border px-4 text-xs transition-all active:scale-[0.98] ${
                showHint
                  ? 'border-amber-500 bg-amber-950/20 text-amber-200'
                  : 'border-amber-500/30 bg-zinc-900/30 text-amber-200/90 hover:bg-amber-950/10 hover:border-amber-500/50'
              }`}
              onClick={() => setShowHint((visible) => !visible)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M10 2a6 6 0 00-6 6c0 1.887.874 3.57 2.25 4.686A3.722 3.722 0 017.5 15.5c0 .6.4 1 1 1h3c.6 0 1-.4 1-1a3.722 3.722 0 011.25-2.814A6 6 0 0016 8a6 6 0 00-6-6z" />
              </svg>
              {t.hintExercise}
            </button>
          </div>

          {showHint && <HintPanel model={model} hintLabel={t.hintExercise} />}
        </div>
      )}
    </LearningDrawer>
  );
};

const InfoPanel: React.FC<{ title: string; value: string; isConfig?: boolean }> = ({ title, value, isConfig }) => (
  <div className="rounded-lg border border-zinc-800/80 bg-gradient-to-br from-zinc-900/60 to-zinc-950/60 p-3 shadow-inner">
    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{title}</div>
    <div className="mt-1.5 flex flex-wrap gap-1.5 font-mono text-xs text-zinc-100">
      {isConfig ? (
        value.split(' · ').map((item) => (
          <span key={item} className="rounded-md border border-sky-500/10 bg-sky-950/20 px-2.5 py-0.5 text-sky-200 text-[10px] font-semibold">
            {item}
          </span>
        ))
      ) : (
        <span className="font-semibold text-sky-100 bg-zinc-950/40 px-2 py-0.5 rounded border border-zinc-800/50">
          {value}
        </span>
      )}
    </div>
  </div>
);

const HintPanel: React.FC<{ model: ShapeExerciseModel; hintLabel: string }> = ({ model, hintLabel }) => (
  <section className="rounded-lg border border-amber-500/20 bg-amber-950/5 p-4 text-sm text-amber-50">
    <div className="mb-3 text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M10 2a6 6 0 00-6 6c0 1.887.874 3.57 2.25 4.686A3.722 3.722 0 017.5 15.5c0 .6.4 1 1 1h3c.6 0 1-.4 1-1a3.722 3.722 0 011.25-2.814A6 6 0 0016 8a6 6 0 00-6-6z" />
      </svg>
      {hintLabel}
    </div>
    {model.breakdown ? (
      <div className="space-y-3">
        <HintLine axis="H" steps={model.breakdown.h} />
        <HintLine axis="W" steps={model.breakdown.w} />
      </div>
    ) : model.adaptiveHint ? (
      <div className="space-y-2 p-2.5 rounded bg-amber-950/20 border border-amber-500/10 font-mono text-[11px] text-amber-200">
        <div className="flex items-center justify-between">
          <span className="text-amber-400 font-bold">H</span>
          <span className="text-zinc-400">target_h = {model.adaptiveHint.h}</span>
        </div>
        <div className="flex items-center justify-between border-t border-amber-500/5 pt-1.5">
          <span className="text-amber-400 font-bold">W</span>
          <span className="text-zinc-400">target_w = {model.adaptiveHint.w}</span>
        </div>
      </div>
    ) : model.hintLines?.length ? (
      <div className="space-y-1.5 p-2.5 rounded bg-amber-950/20 border border-amber-500/10 font-mono text-[11px] text-zinc-300 leading-relaxed">
        {model.hintLines.map((line, idx) => (
          <div key={line} className={idx > 0 ? "border-t border-amber-500/5 pt-1" : ""}>
            {line}
          </div>
        ))}
      </div>
    ) : (
      <div className="text-xs text-amber-300/90 leading-relaxed p-1">
        Use the displayed output shape and preserve dimensions where the layer does not change them.
      </div>
    )}
  </section>
);

const HintLine: React.FC<{ axis: 'H' | 'W'; steps: SpatialShapeSteps }> = ({ axis, steps }) => (
  <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-amber-950/15 border border-amber-500/10 shadow-inner">
    <div className="flex items-center gap-1.5 flex-wrap font-mono text-[11px]">
      <span className="font-bold text-amber-400 text-xs">{axis}</span>
      <span className="text-amber-600/70">=</span>
      <span className="text-amber-200/90">floor(</span>
      <span className="text-zinc-300">
        ({steps.input} + 2×{steps.padding} - {steps.dilation}×({steps.kernel} - 1) - 1) / {steps.stride} + 1
      </span>
      <span className="text-amber-200/90">)</span>
    </div>
    <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300/80 border-t border-amber-500/5 pt-1.5">
      <span>=</span>
      <span>floor({steps.numerator} / {steps.stride} + 1)</span>
      <span className="text-amber-400 font-bold">= {steps.output}</span>
    </div>
  </div>
);

function formatShape(shape: number[]): string {
  return `[${shape.join(', ')}]`;
}

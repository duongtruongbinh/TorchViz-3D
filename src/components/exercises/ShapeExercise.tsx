import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { LayoutNode } from '../../lib/irTypes';
import type { getStrings } from '../../lib/localization';
import {
  getConv2dOutputShape,
  getConv2dShapeBreakdown,
  getPool2dOutputShape,
  getPool2dShapeBreakdown,
  type Conv2dShapeConfig,
  type Pool2dShapeConfig,
  type Shape2DParam,
  type SpatialShapeSteps,
} from '../../lib/shapeMath';
import {
  buildShapeExerciseModel,
  type ShapeExerciseId,
  type ShapeExerciseModel,
} from '../../lib/shapeExerciseModels';

type ShapeExerciseProps = {
  isOpen: boolean;
  exerciseId?: ShapeExerciseId;
  node: LayoutNode | null | undefined;
  t: ReturnType<typeof getStrings>['canvas']['demo'];
  language: 'en' | 'vi';
  onClose: () => void;
};

const DEFAULT_DIM_LABELS = ['B', 'C', 'H', 'W'];
const SPATIAL_HINT_INTERVAL_MS = 1700;

type SpatialHintToken = 'input' | 'padding' | 'dilation' | 'kernel' | 'combine' | 'floor';
type SpatialHintAxis = 'H' | 'W';
type SpatialHintStep = {
  axis: SpatialHintAxis;
  token: SpatialHintToken;
};

const SPATIAL_HINT_SEQUENCE: SpatialHintStep[] = [
  { axis: 'H', token: 'input' },
  { axis: 'H', token: 'padding' },
  { axis: 'H', token: 'dilation' },
  { axis: 'H', token: 'kernel' },
  { axis: 'H', token: 'combine' },
  { axis: 'H', token: 'floor' },
  { axis: 'W', token: 'input' },
  { axis: 'W', token: 'padding' },
  { axis: 'W', token: 'dilation' },
  { axis: 'W', token: 'kernel' },
  { axis: 'W', token: 'combine' },
  { axis: 'W', token: 'floor' },
];

const SectionHeader: React.FC<{ title: string; meta?: string; flush?: boolean }> = ({
  title,
  meta,
  flush = false,
}) => (
  <div className={`${flush ? '' : 'mb-3'} flex items-center justify-between gap-3`}>
    <div className="flex min-w-0 items-center">
      <h3 className="min-w-0 truncate text-xs font-bold uppercase tracking-wider text-zinc-200">{title}</h3>
    </div>
    {meta && <span className="shrink-0 text-[10px] font-mono text-zinc-500">{meta}</span>}
  </div>
);

type EditableShapeConfig =
  | {
    kind: 'conv';
    outChannels: string;
    kernel: string;
    stride: string;
    padding: string;
    dilation: string;
  }
  | {
    kind: 'pool';
    kernel: string;
    stride: string;
    padding: string;
    dilation: string;
  }
  | {
    kind: 'adaptive';
    outputH: string;
    outputW: string;
  };

export const ShapeExercise: React.FC<ShapeExerciseProps> = ({
  isOpen,
  exerciseId = 'shape-output',
  node,
  t,
  language,
  onClose,
}) => {
  const titleId = useId();
  const model = useMemo(
    () => (node ? buildShapeExerciseModel(node, exerciseId, language) : null),
    [exerciseId, language, node],
  );
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintPulse, setHintPulse] = useState(0);
  const [hintStepIndex, setHintStepIndex] = useState(0);
  const [hintPaused, setHintPaused] = useState(false);
  const [editableInputShape, setEditableInputShape] = useState<string[]>([]);
  const [editableConfig, setEditableConfig] = useState<EditableShapeConfig | null>(null);
  const hintRef = useRef<HTMLElement | null>(null);

  const configured = useMemo(
    () => (model
      ? applyEditableState(model, editableInputShape, editableConfig)
      : { model: null, inputError: null, configError: null }),
    [editableConfig, editableInputShape, model],
  );
  const exerciseModel = configured.model;

  useEffect(() => {
    if (!isOpen || !model) return;
    setEditableInputShape(model.inputShape.map(String));
    setEditableConfig(getEditableConfig(model));
  }, [isOpen, model]);

  useEffect(() => {
    if (!isOpen || !exerciseModel) return;
    setAnswers(exerciseModel.expectedShape.map(() => ''));
    setSubmitted(false);
    setShowHint(false);
    setHintPulse(0);
    setHintStepIndex(0);
    setHintPaused(false);
  }, [isOpen, exerciseModel?.expectedShape.join(','), exerciseModel?.configRows.join('|')]);

  useEffect(() => {
    if (!showHint || !hintRef.current) return;
    const frameId = window.requestAnimationFrame(() => {
      hintRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [hintPulse, showHint]);

  useEffect(() => {
    if (!showHint || !exerciseModel?.breakdown) {
      setHintStepIndex(0);
      return;
    }

    if (hintPaused) return;

    const intervalId = window.setInterval(() => {
      setHintStepIndex((index) => (index + 1) % SPATIAL_HINT_SEQUENCE.length);
    }, SPATIAL_HINT_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [exerciseModel?.breakdown, hintPaused, showHint]);

  const updateAnswer = (index: number, value: string) => {
    setAnswers((current) => current.map((answer, answerIndex) => (
      answerIndex === index ? value.replace(/[^\d-]/g, '') : answer
    )));
  };

  if (!isOpen) return null;

  const displayModel = exerciseModel ?? model;
  const activeHintStep = showHint && displayModel?.breakdown
    ? SPATIAL_HINT_SEQUENCE[hintStepIndex % SPATIAL_HINT_SEQUENCE.length]
    : null;
  const correctCount = displayModel
    ? displayModel.expectedShape.reduce((total, expected, index) => (
      total + (answers[index]?.trim() !== '' && Number(answers[index]) === expected ? 1 : 0)
    ), 0)
    : 0;
  const outputCells = displayModel?.expectedShape.length ?? 0;
  const reset = () => {
    if (!model || !displayModel) return;
    setEditableInputShape(model.inputShape.map(String));
    setEditableConfig(getEditableConfig(model));
    setAnswers(displayModel.expectedShape.map(() => ''));
    setSubmitted(false);
    setShowHint(false);
    setHintStepIndex(0);
    setHintPaused(false);
  };
  const moveHintStep = (delta: number) => {
    setHintStepIndex((index) => (
      (index + delta + SPATIAL_HINT_SEQUENCE.length) % SPATIAL_HINT_SEQUENCE.length
    ));
  };

  return createPortal((
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm pointer-events-auto">
      <div
        className="flex w-[min(76rem,calc(100%-1.25rem))] max-h-[calc(100vh-1.25rem)] flex-col overflow-hidden rounded-lg border border-zinc-700/70 bg-zinc-950 text-zinc-100 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-4 border-b border-zinc-800 bg-zinc-950/95 px-4 py-3">
          <div className="min-w-0 self-center">
            <h2 id={titleId} className="text-sm font-bold uppercase tracking-wider text-zinc-100">{t.shapeExerciseTitle}</h2>
          </div>
          <div className="min-w-0 justify-self-center rounded-md border border-sky-400/25 bg-sky-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-100">
            {model?.opType ?? node?.op_type ?? 'Layer'}
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

      {!displayModel ? (
        <div className="min-h-0 flex-1 p-5 text-sm text-zinc-300">
          {t.noShapeExercise}
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-auto">
            <div className="space-y-4 p-5">
              <section className="min-w-0 rounded-md border border-zinc-800 bg-zinc-900/45 p-4">
                <SectionHeader
                  title={t.inputShapeLabel}
                  meta={`${displayModel.inputShape.length}D`}
                />
                <ShapeReadout
                  values={editableInputShape.length ? editableInputShape : displayModel.inputShape.map(String)}
                  labels={displayModel.dimLabels}
                  error={configured.inputError}
                  activeHintStep={activeHintStep}
                  onChange={(index, value) => {
                    setEditableInputShape((current) => {
                      const next = current.length ? [...current] : displayModel.inputShape.map(String);
                      next[index] = value;
                      return next;
                    });
                    setSubmitted(false);
                  }}
                />
              </section>

              <section className="min-w-0 rounded-md border border-zinc-800 bg-zinc-900/45 p-4">
                <SectionHeader
                  title={t.layerConfigLabel}
                  meta={`${displayModel.configRows.length}`}
                />
                <ConfigEditor
                  config={editableConfig}
                  model={displayModel}
                  error={configured.configError}
                  activeHintStep={activeHintStep}
                  onChange={(nextConfig) => {
                    setEditableConfig(nextConfig);
                    setSubmitted(false);
                  }}
                />
              </section>

              <FormulaPanel model={displayModel} activeHintStep={activeHintStep} />

              <section className="rounded-md border border-emerald-400/25 bg-emerald-950/10 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <SectionHeader
                      title={t.enterOutputShape}
                      flush
                    />
                  </div>
                  <span className="shrink-0 rounded border border-emerald-300/35 bg-emerald-400/12 px-2.5 py-1 text-xs font-mono font-bold text-emerald-100">
                    {correctCount}/{outputCells}
                  </span>
                </div>

                <div className="rounded-md border border-emerald-300/15 bg-zinc-950/80 px-4 py-5">
                  <div className="flex flex-wrap items-end justify-center gap-2 font-mono">
                    <span className="pb-2 text-2xl font-bold text-zinc-500">[</span>
                    {displayModel.expectedShape.map((expected, index) => {
                      const answer = answers[index] ?? '';
                      const isCorrect = answer.trim() !== '' && Number(answer) === expected;
                      const hasStatus = submitted;
                      const label = displayModel.dimLabels?.[index] ?? DEFAULT_DIM_LABELS[index] ?? `D${index}`;
                      const isHintDimension = isActiveOutputHint(label, activeHintStep);
                      return (
                        <React.Fragment key={`${index}-${expected}`}>
                        <label className="block w-24">
                          <span className={`mb-1 block text-center text-[10px] font-bold uppercase tracking-wider ${
                            isHintDimension ? 'text-amber-200' : 'text-zinc-500'
                          }`}>{label}</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={answer}
                            onChange={(event) => updateAnswer(index, event.target.value)}
                            className={`h-12 w-full rounded-md border bg-zinc-950 px-1 text-center text-lg font-bold outline-none transition-all ${
                              hasStatus
                                ? isCorrect
                                  ? 'border-emerald-300/70 text-emerald-100 ring-1 ring-emerald-300/20'
                                  : 'border-red-300/70 text-red-100 ring-1 ring-red-300/20'
                                : isHintDimension
                                  ? 'border-amber-300/65 bg-amber-900/18 text-amber-50 ring-1 ring-amber-300/18 focus:border-amber-300/70'
                                  : 'border-zinc-700 text-zinc-100 hover:border-zinc-500 focus:border-sky-300 focus:ring-1 focus:ring-sky-300/25'
                            }`}
                            aria-label={`Output shape dimension ${label}`}
                          />
                          {hasStatus && (
                            <span className={`mt-1.5 block text-center text-[10px] font-medium leading-none ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isCorrect ? t.correct : t.expected(expected)}
                            </span>
                          )}
                        </label>
                        {index < displayModel.expectedShape.length - 1 && (
                          <span className="pb-3 text-xl font-bold text-zinc-600">,</span>
                        )}
                        </React.Fragment>
                      );
                    })}
                    <span className="pb-2 text-2xl font-bold text-zinc-500">]</span>
                  </div>
                </div>
              </section>

              {showHint && (
                <section
                  ref={hintRef}
                  className={hintPulse ? 'shape-hint-attention rounded-md' : 'rounded-md'}
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <SectionHeader title={t.hintExercise} flush />
                    {displayModel.breakdown ? (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded border border-zinc-700 bg-zinc-950 text-sm font-bold text-zinc-300 hover:border-amber-300/60 hover:text-amber-100"
                          onClick={() => moveHintStep(-1)}
                          aria-label="Previous hint step"
                          title="Previous hint step"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          className="flex h-7 min-w-14 items-center justify-center rounded border border-amber-300/25 bg-amber-400/10 px-2 text-center text-[11px] font-bold text-amber-100 hover:border-amber-300/60 hover:bg-amber-400/18"
                          onClick={() => setHintPaused((paused) => !paused)}
                          aria-label={hintPaused ? 'Play hint steps' : 'Pause hint steps'}
                          title={hintPaused ? 'Play hint steps' : 'Pause hint steps'}
                        >
                          {hintPaused ? 'Play' : 'Pause'}
                        </button>
                        <span className="min-w-14 rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-center font-mono text-[11px] font-bold text-amber-100">
                          {activeHintStep?.axis ?? 'H'} {((hintStepIndex % 6) + 1)}/6
                        </span>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded border border-zinc-700 bg-zinc-950 text-sm font-bold text-zinc-300 hover:border-amber-300/60 hover:text-amber-100"
                          onClick={() => moveHintStep(1)}
                          aria-label="Next hint step"
                          title="Next hint step"
                        >
                          ›
                        </button>
                      </div>
                    ) : (
                      <span className="text-[13px] font-mono text-zinc-500">
                        {displayModel.opType}
                      </span>
                    )}
                  </div>
                  <HintPanel model={displayModel} activeHintStep={activeHintStep} />
                </section>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
            <p className="text-xs text-zinc-400">
              {submitted ? `${correctCount}/${outputCells}` : t.enterOutputShape}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="h-8 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white"
                onClick={reset}
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
                  setShowHint((visible) => !visible);
                  setHintPulse((count) => count + 1);
                  setHintPaused(false);
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

const ShapeReadout: React.FC<{
  values: string[];
  labels?: string[];
  error: string | null;
  activeHintStep: SpatialHintStep | null;
  onChange: (index: number, value: string) => void;
}> = ({ values, labels, error, activeHintStep, onChange }) => (
  <div>
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {values.map((value, index) => {
        const label = labels?.[index] ?? DEFAULT_DIM_LABELS[index] ?? `D${index}`;
        return (
          <NumericField
            key={`${label}-${index}`}
            label={label}
            value={value}
            min={1}
            hintActive={isActiveInputHint(label, activeHintStep)}
            onChange={(nextValue) => onChange(index, nextValue)}
          />
        );
      })}
    </div>
    {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
  </div>
);

const NumericField: React.FC<{
  label: string;
  value: string;
  min?: number;
  hintActive?: boolean;
  onChange: (value: string) => void;
}> = ({ label, value, min = 1, hintActive = false, onChange }) => {
  const tone = getFieldTone(label);
  const stepValue = (delta: number) => {
    onChange(adjustNumberInputValue(value, delta, min));
  };

  return (
  <label className={`grid min-h-[4.4rem] grid-rows-[1.2rem_2rem] items-center gap-1 rounded-md border bg-zinc-950/80 px-2.5 py-2 transition-colors hover:border-zinc-600 focus-within:border-sky-300 focus-within:ring-1 focus-within:ring-sky-300/20 ${
    hintActive
      ? 'border-amber-300/60 bg-amber-900/14 ring-1 ring-amber-300/16'
      : 'border-zinc-700'
  }`}>
    <span className={`flex h-5 w-full items-center justify-center text-center text-[11px] font-bold uppercase leading-none tracking-wide ${
      hintActive ? 'text-amber-200' : tone.text
    }`}>{label}</span>
    <div className={`relative h-8 overflow-hidden rounded-sm border bg-zinc-900/70 ${
      hintActive ? 'border-amber-300/60 bg-amber-950/20' : 'border-zinc-800'
    }`}>
      <input
        className={`block h-full w-full bg-transparent px-6 text-center font-mono text-[16px] font-bold leading-8 outline-none ${
          hintActive ? 'text-amber-50' : tone.value
        }`}
        type="text"
        inputMode="numeric"
        value={normalizeNumberInputValue(value)}
        spellCheck={false}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
      <div className="absolute right-0 top-0 grid h-full w-5 grid-rows-2 border-l border-zinc-800/90">
        <button
          type="button"
          className="flex items-center justify-center text-[9px] leading-none text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          onClick={() => stepValue(1)}
          aria-label={`Increase ${label}`}
          title={`Increase ${label}`}
        >
          ▲
        </button>
        <button
          type="button"
          className="flex items-center justify-center border-t border-zinc-800/90 text-[9px] leading-none text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          onClick={() => stepValue(-1)}
          aria-label={`Decrease ${label}`}
          title={`Decrease ${label}`}
        >
          ▼
        </button>
      </div>
    </div>
  </label>
  );
};

function getFieldTone(label: string): { text: string; value: string } {
  const normalized = label.toLowerCase().replace(/\s+/g, '-');
  if (normalized === 'b' || normalized === 'batch') {
    return {
      text: 'text-cyan-300/75',
      value: 'text-cyan-100/90',
    };
  }
  if (normalized === 'c' || normalized === 'out-channels') {
    return {
      text: 'text-violet-300/75',
      value: 'text-violet-100/90',
    };
  }
  if (normalized === 'h' || normalized === 'output-h') {
    return {
      text: 'text-emerald-300/75',
      value: 'text-emerald-100/90',
    };
  }
  if (normalized === 'w' || normalized === 'output-w') {
    return {
      text: 'text-amber-300/75',
      value: 'text-amber-100/90',
    };
  }
  if (normalized === 'kernel') {
    return {
      text: 'text-sky-300/75',
      value: 'text-sky-100/90',
    };
  }
  if (normalized === 'stride') {
    return {
      text: 'text-lime-300/75',
      value: 'text-lime-100/90',
    };
  }
  if (normalized === 'padding') {
    return {
      text: 'text-fuchsia-300/75',
      value: 'text-fuchsia-100/90',
    };
  }
  if (normalized === 'dilation') {
    return {
      text: 'text-orange-300/75',
      value: 'text-orange-100/90',
    };
  }
  return {
    text: 'text-zinc-400',
    value: 'text-zinc-100',
  };
}

const ConfigEditor: React.FC<{
  config: EditableShapeConfig | null;
  model: ShapeExerciseModel;
  error: string | null;
  activeHintStep: SpatialHintStep | null;
  onChange: (config: EditableShapeConfig) => void;
}> = ({ config, model, error, activeHintStep, onChange }) => {
  if (!config) {
    return (
      <div>
        <div className="flex flex-wrap gap-2">
          {model.configRows.map((item) => (
            <span key={item} className="rounded border border-sky-300/25 bg-zinc-950 px-2.5 py-1 text-[13px] font-mono text-sky-100">
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const setField = (name: string, value: string) => {
    onChange({ ...config, [name]: value } as EditableShapeConfig);
  };
  const fields = getEditableFields(config);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
        {fields.map((field) => (
          <NumericField
            key={field.name}
            label={field.label}
            value={field.value}
            min={field.min}
            hintActive={isActiveConfigHint(field.name, activeHintStep)}
            onChange={(nextValue) => setField(field.name, nextValue)}
          />
        ))}
      </div>
      <p className={`mt-2 text-xs ${error ? 'text-red-300' : 'text-zinc-500'}`}>
        {error ?? 'Use integer values.'}
      </p>
    </div>
  );
};

const FormulaPanel: React.FC<{ model: ShapeExerciseModel; activeHintStep: SpatialHintStep | null }> = ({ model, activeHintStep }) => {
  if (model.breakdown) {
    return (
      <section className="rounded-md border border-zinc-800 bg-zinc-900/45 p-4">
        <SectionHeader title="Formula" meta={model.opType} />
        <SpatialFormulaPanel activeHintStep={activeHintStep} />
      </section>
    );
  }

  const rows = getFormulaRows(model);
  if (!rows.length) return null;

  return (
    <section className="rounded-md border border-zinc-800 bg-zinc-900/45 p-4">
      <SectionHeader title="Formula" meta={model.opType} />
      <div className="grid gap-2 lg:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-md border border-sky-300/15 bg-zinc-950/80 p-3">
            <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-sky-100">{row.label}</div>
            <div className="font-mono text-sm leading-relaxed text-zinc-300">{row.formula}</div>
            {row.substitution && (
              <div className="mt-1.5 border-t border-white/10 pt-1.5 font-mono text-[13px] leading-relaxed text-zinc-500">
                {row.substitution}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const SpatialFormulaPanel: React.FC<{ activeHintStep: SpatialHintStep | null }> = ({ activeHintStep }) => {
  const hintActive = !!activeHintStep;
  return (
  <div className="rounded-md border border-sky-300/15 bg-zinc-950/80 p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className={`text-[11px] font-bold uppercase tracking-wider ${
        hintActive ? 'text-amber-200' : 'text-sky-100'
      }`}>Spatial rule</div>
      {activeHintStep && (
        <div className="rounded border border-amber-300/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-100">
          {activeHintStep.axis}
        </div>
      )}
    </div>
    <div className="overflow-x-auto rounded border border-white/10 bg-black/25 px-4 py-3">
      <div className="min-w-max text-center font-mono text-base font-semibold leading-relaxed text-zinc-100">
        <FormulaToken>out</FormulaToken>
        <FormulaToken> = </FormulaToken>
        <FormulaToken active={activeHintStep?.token === 'floor'}>floor</FormulaToken>
        <FormulaToken>(</FormulaToken>
        <FormulaGroup active={activeHintStep?.token === 'combine'}>
          <FormulaToken>((</FormulaToken>
          <FormulaToken active={activeHintStep?.token === 'input'}>in</FormulaToken>
          <FormulaToken> + 2</FormulaToken>
          <FormulaToken active={activeHintStep?.token === 'padding'}>P</FormulaToken>
          <FormulaToken> - </FormulaToken>
          <FormulaToken active={activeHintStep?.token === 'dilation'}>D</FormulaToken>
          <FormulaToken>(</FormulaToken>
          <FormulaToken active={activeHintStep?.token === 'kernel'}>K</FormulaToken>
          <FormulaToken> - 1) - 1) / S) + 1</FormulaToken>
        </FormulaGroup>
        <FormulaToken>)</FormulaToken>
      </div>
    </div>
    <div className="mt-2 text-[13px] leading-relaxed text-zinc-500">
      P: padding, D: dilation, K: kernel, S: stride.
    </div>
  </div>
  );
};

const FormulaToken: React.FC<{ active?: boolean; children: React.ReactNode }> = ({
  active = false,
  children,
}) => (
  <span className={`rounded px-0.5 transition-colors ${
    active
      ? 'bg-amber-400/20 text-amber-50 ring-1 ring-amber-300/15'
      : 'text-zinc-100'
  }`}>
    {children}
  </span>
);

const FormulaGroup: React.FC<{ active?: boolean; children: React.ReactNode }> = ({ active = false, children }) => (
  <span className={`rounded px-1 transition-colors ${
    active ? 'bg-amber-400/16 text-amber-50 ring-1 ring-amber-300/20' : ''
  }`}>
    {children}
  </span>
);

function getSpatialAxisFromLabel(label: string): SpatialHintAxis | null {
  const normalized = label.trim().toLowerCase();
  if (normalized === 'h' || normalized === 'height') return 'H';
  if (normalized === 'w' || normalized === 'width') return 'W';
  return null;
}

function isActiveInputHint(label: string, step: SpatialHintStep | null): boolean {
  return !!step && step.token === 'input' && getSpatialAxisFromLabel(label) === step.axis;
}

function isActiveOutputHint(label: string, step: SpatialHintStep | null): boolean {
  return !!step && step.token === 'floor' && getSpatialAxisFromLabel(label) === step.axis;
}

function isActiveConfigHint(name: string, step: SpatialHintStep | null): boolean {
  if (!step) return false;
  if (step.token === 'padding') return name === 'padding';
  if (step.token === 'dilation') return name === 'dilation';
  if (step.token === 'kernel') return name === 'kernel';
  return step.token === 'combine' && name === 'stride';
}

const HintPanel: React.FC<{ model: ShapeExerciseModel; activeHintStep: SpatialHintStep | null }> = ({
  model,
  activeHintStep,
}) => (
  <section className="rounded-md border border-sky-300/15 bg-zinc-900/70 p-3">
    {model.breakdown ? (
      <div className="space-y-3">
        <HintLine axis="H" steps={model.breakdown.h} activeHintStep={activeHintStep} />
        <HintLine axis="W" steps={model.breakdown.w} activeHintStep={activeHintStep} />
      </div>
    ) : model.adaptiveHint ? (
      <div className="space-y-2 font-mono text-[13px] text-sky-100">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sky-100">H</span>
          <span className="text-zinc-400">target_h = {model.adaptiveHint.h}</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
          <span className="font-bold text-sky-100">W</span>
          <span className="text-zinc-400">target_w = {model.adaptiveHint.w}</span>
        </div>
      </div>
    ) : model.hintLines?.length ? (
      <div className="space-y-2 font-mono text-[13px] leading-relaxed text-sky-100">
        {model.hintLines.map((line, idx) => (
          <div key={line} className={idx > 0 ? "border-t border-white/10 pt-2" : ""}>
            {line}
          </div>
        ))}
      </div>
    ) : (
      <div className="text-xs leading-relaxed text-zinc-400">
        Use the displayed output shape and preserve dimensions where the layer does not change them.
      </div>
    )}
  </section>
);

function getFormulaRows(model: ShapeExerciseModel): Array<{ label: string; formula: string; substitution?: string }> {
  if (model.adaptiveHint) {
    return [
      { label: 'B', formula: 'B_out = B_in', substitution: `B_out = ${model.inputShape[0]}` },
      { label: 'C', formula: 'C_out = C_in', substitution: `C_out = ${model.inputShape[1]}` },
      { label: 'H', formula: 'H_out = target_h', substitution: `H_out = ${model.adaptiveHint.h}` },
      { label: 'W', formula: 'W_out = target_w', substitution: `W_out = ${model.adaptiveHint.w}` },
    ];
  }

  if (/batchnorm/i.test(model.opType)) {
    return [
      { label: 'Shape', formula: '[B_out, C_out, H_out, W_out] = [B_in, C_in, H_in, W_in]' },
      { label: 'Substitute', formula: `[B_out, C_out, H_out, W_out] = ${formatShape(model.inputShape)}` },
    ];
  }

  if (/attn|attention/i.test(model.opType)) {
    return [
      { label: 'Scores', formula: 'Q [B,T,Dk] x K^T [B,Dk,S] -> [B,T,S]' },
      { label: 'Context', formula: 'scores [B,T,S] x V [B,S,Dv] -> [B,T,Dv]' },
    ];
  }

  return model.hintLines?.length
    ? model.hintLines.map((line, index) => ({ label: `Rule ${index + 1}`, formula: line }))
    : [];
}

function getEditableConfig(model: ShapeExerciseModel): EditableShapeConfig | null {
  const rows = getConfigMap(model.configRows);
  if (model.breakdown && /conv/i.test(model.opType)) {
    return {
      kind: 'conv',
      outChannels: rows.out_channels ?? String(model.expectedShape[1] ?? model.inputShape[1] ?? 1),
      kernel: rows.kernel ?? '1',
      stride: rows.stride ?? '1',
      padding: rows.padding ?? '0',
      dilation: rows.dilation ?? '1',
    };
  }
  if (model.breakdown && /pool/i.test(model.opType)) {
    return {
      kind: 'pool',
      kernel: rows.kernel ?? '2',
      stride: rows.stride ?? rows.kernel ?? '2',
      padding: rows.padding ?? '0',
      dilation: rows.dilation ?? '1',
    };
  }
  if (model.adaptiveHint) {
    return {
      kind: 'adaptive',
      outputH: String(model.adaptiveHint.h),
      outputW: String(model.adaptiveHint.w),
    };
  }
  return null;
}

function applyEditableState(
  model: ShapeExerciseModel,
  inputShapeValues: string[],
  config: EditableShapeConfig | null,
): { model: ShapeExerciseModel; inputError: string | null; configError: string | null } {
  const inputShape = inputShapeValues.length ? inputShapeValues : model.inputShape.map(String);
  try {
    const parsedInputShape = inputShape.map((value, index) => {
      const label = DEFAULT_DIM_LABELS[index] ?? `D${index}`;
      return parsePositiveInteger(value, label);
    });
    const configured = applyEditableConfig({ ...model, inputShape: parsedInputShape }, config);
    return {
      model: configured.model,
      inputError: null,
      configError: configured.error,
    };
  } catch (error) {
    const configured = applyEditableConfig(model, config);
    return {
      model: configured.model,
      inputError: error instanceof Error ? error.message : 'Invalid input shape',
      configError: configured.error,
    };
  }
}

function applyEditableConfig(
  model: ShapeExerciseModel,
  config: EditableShapeConfig | null,
): { model: ShapeExerciseModel; error: string | null } {
  if (!config) return { model, error: null };

  try {
    if (config.kind === 'conv') {
      const convConfig: Conv2dShapeConfig = {
        outChannels: parsePositiveInteger(config.outChannels, 'out_channels'),
        kernelSize: parse2DParam(config.kernel, 'kernel'),
        stride: parse2DParam(config.stride, 'stride'),
        padding: parse2DParam(config.padding, 'padding', { min: 0 }),
        dilation: parse2DParam(config.dilation, 'dilation'),
      };
      return {
        model: {
          ...model,
          expectedShape: getConv2dOutputShape(model.inputShape, convConfig),
          configRows: getEditableConfigRows(config),
          breakdown: getConv2dShapeBreakdown(model.inputShape, convConfig),
          adaptiveHint: undefined,
        },
        error: null,
      };
    }

    if (config.kind === 'pool') {
      const poolConfig: Pool2dShapeConfig = {
        kernelSize: parse2DParam(config.kernel, 'kernel'),
        stride: parse2DParam(config.stride, 'stride'),
        padding: parse2DParam(config.padding, 'padding', { min: 0 }),
        dilation: parse2DParam(config.dilation, 'dilation'),
      };
      return {
        model: {
          ...model,
          expectedShape: getPool2dOutputShape(model.inputShape, poolConfig),
          configRows: getEditableConfigRows(config),
          breakdown: getPool2dShapeBreakdown(model.inputShape, poolConfig),
          adaptiveHint: undefined,
        },
        error: null,
      };
    }

    const outputH = parsePositiveInteger(config.outputH, 'output_h');
    const outputW = parsePositiveInteger(config.outputW, 'output_w');
    return {
      model: {
        ...model,
        expectedShape: [model.inputShape[0], model.inputShape[1], outputH, outputW],
        configRows: getEditableConfigRows(config),
        adaptiveHint: { h: outputH, w: outputW },
        breakdown: null,
      },
      error: null,
    };
  } catch (error) {
    return {
      model: { ...model, configRows: getEditableConfigRows(config) },
      error: error instanceof Error ? error.message : 'Invalid config',
    };
  }
}

function getEditableFields(config: EditableShapeConfig): Array<{ name: string; label: string; value: string; min?: number }> {
  if (config.kind === 'conv') {
    return [
      { name: 'outChannels', label: 'out channels', value: config.outChannels },
      { name: 'kernel', label: 'kernel', value: config.kernel },
      { name: 'stride', label: 'stride', value: config.stride },
      { name: 'padding', label: 'padding', value: config.padding, min: 0 },
      { name: 'dilation', label: 'dilation', value: config.dilation },
    ];
  }
  if (config.kind === 'pool') {
    return [
      { name: 'kernel', label: 'kernel', value: config.kernel },
      { name: 'stride', label: 'stride', value: config.stride },
      { name: 'padding', label: 'padding', value: config.padding, min: 0 },
      { name: 'dilation', label: 'dilation', value: config.dilation },
    ];
  }
  return [
    { name: 'outputH', label: 'output h', value: config.outputH },
    { name: 'outputW', label: 'output w', value: config.outputW },
  ];
}

function getEditableConfigRows(config: EditableShapeConfig): string[] {
  if (config.kind === 'conv') {
    return [
      `out_channels=${config.outChannels}`,
      `kernel=${config.kernel}`,
      `stride=${config.stride}`,
      `padding=${config.padding}`,
      `dilation=${config.dilation}`,
    ];
  }
  if (config.kind === 'pool') {
    return [
      `kernel=${config.kernel}`,
      `stride=${config.stride}`,
      `padding=${config.padding}`,
      `dilation=${config.dilation}`,
    ];
  }
  return [`output_size=[${config.outputH}, ${config.outputW}]`];
}

function getConfigMap(rows: string[]): Record<string, string> {
  return rows.reduce<Record<string, string>>((map, row) => {
    const [key, ...rest] = row.split('=');
    if (key && rest.length) map[key.trim()] = rest.join('=').trim();
    return map;
  }, {});
}

function parse2DParam(value: string, label: string, options: { min?: number } = {}): Shape2DParam {
  const cleaned = value.trim().replace(/^\[/, '').replace(/\]$/, '').replace(/^\(/, '').replace(/\)$/, '');
  const parts = cleaned.split(',').map((part) => part.trim()).filter(Boolean);
  if (parts.length === 1) return parseIntegerWithMin(parts[0], label, options);
  if (parts.length === 2) {
    return [
      parseIntegerWithMin(parts[0], `${label}_h`, options),
      parseIntegerWithMin(parts[1], `${label}_w`, options),
    ];
  }
  throw new Error(`${label} must be a number or tuple`);
}

function parsePositiveInteger(value: string, label: string): number {
  return parseIntegerWithMin(value, label, { min: 1 });
}

function parseIntegerWithMin(value: string, label: string, options: { min?: number } = {}): number {
  const min = options.min ?? 1;
  const parsed = Number(value.trim());
  if (!Number.isInteger(parsed) || parsed < min) {
    throw new Error(`${label} must be an integer >= ${min}`);
  }
  return parsed;
}

function normalizeNumberInputValue(value: string): string {
  const trimmed = value.trim();
  const cleaned = trimmed.replace(/^\[/, '').replace(/\]$/, '').replace(/^\(/, '').replace(/\)$/, '');
  return cleaned.split(',')[0]?.trim() ?? '';
}

function adjustNumberInputValue(value: string, delta: number, min: number): string {
  const current = Number(normalizeNumberInputValue(value));
  const base = Number.isInteger(current) ? current : min;
  return String(Math.max(min, base + delta));
}

const HintLine: React.FC<{
  axis: SpatialHintAxis;
  steps: SpatialShapeSteps;
  activeHintStep: SpatialHintStep | null;
}> = ({ axis, steps, activeHintStep }) => {
  const axisActive = activeHintStep?.axis === axis;
  const token = axisActive ? activeHintStep.token : null;
  const beforeFloor = steps.numerator / steps.stride + 1;
  return (
  <div className="flex flex-col gap-1.5 rounded-md border border-sky-300/15 bg-zinc-950 p-3">
    <div className="flex flex-wrap items-center gap-1.5 font-mono text-[13px]">
      <HintToken active={token === 'input'} className="text-xs font-bold text-sky-100">{axis}</HintToken>
      <span className="text-zinc-500">=</span>
      <HintToken active={token === 'floor'} className="text-sky-100">floor</HintToken>
      <span className="text-sky-100">(</span>
      <HintToken active={token === 'combine'} className="text-zinc-300">(</HintToken>
      <HintToken active={token === 'input'} className="text-zinc-300">{steps.input}</HintToken>
      <HintToken active={token === 'combine'} className="text-zinc-300"> + 2×</HintToken>
      <HintToken active={token === 'padding'} className="text-zinc-300">{steps.padding}</HintToken>
      <HintToken active={token === 'combine'} className="text-zinc-300"> - </HintToken>
      <HintToken active={token === 'dilation'} className="text-zinc-300">{steps.dilation}</HintToken>
      <HintToken active={token === 'combine'} className="text-zinc-300">×(</HintToken>
      <HintToken active={token === 'kernel'} className="text-zinc-300">{steps.kernel}</HintToken>
      <HintToken active={token === 'combine'} className="text-zinc-300"> - 1) - 1) / {steps.stride} + 1</HintToken>
      <span className="text-sky-100">)</span>
    </div>
    <div className="flex items-center gap-1.5 border-t border-white/10 pt-1.5 font-mono text-[13px] text-zinc-400">
      <span>=</span>
      <HintToken active={token === 'floor'}>floor</HintToken>
      <span>(</span>
      <HintToken active={token === 'combine'}>{steps.numerator} / {steps.stride} + 1</HintToken>
      <span>)</span>
      <span>=</span>
      <HintToken active={token === 'floor'}>floor({formatStepNumber(beforeFloor)})</HintToken>
      <HintToken active={token === 'floor'} className="font-bold text-emerald-100">= {steps.output}</HintToken>
    </div>
  </div>
  );
};

const HintToken: React.FC<{ active?: boolean; className?: string; children: React.ReactNode }> = ({
  active = false,
  className = '',
  children,
}) => (
  <span className={`rounded px-0.5 transition-colors ${
    active
      ? `${className} bg-amber-400/20 text-amber-50 ring-1 ring-amber-300/15`
      : className
  }`}>
    {children}
  </span>
);

function formatShape(shape: number[]): string {
  return `[${shape.join(', ')}]`;
}

function formatStepNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

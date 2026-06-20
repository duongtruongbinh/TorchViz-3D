import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { getStrings } from '../../lib/localization';

type DemoLabels = ReturnType<typeof getStrings>['canvas']['demo'];
type CellStatus = 'idle' | 'correct' | 'wrong';
type Difficulty = 'easy' | 'medium' | 'hard';

const ANSWER_DECIMALS = 2;
const KERNEL_SIZE = 3;
const KERNEL_PAIR_COUNT = KERNEL_SIZE * KERNEL_SIZE;
const HINT_PAIR_INTERVAL_MS = 1100;
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

const CHANNEL_LABEL_COLORS = [
  { active: 'text-red-300', inactive: 'text-red-400/45' },
  { active: 'text-emerald-300', inactive: 'text-emerald-400/45' },
  { active: 'text-blue-300', inactive: 'text-blue-400/45' },
];

function getChannelLabelColor(channelIndex: number, active: boolean) {
  const color = CHANNEL_LABEL_COLORS[channelIndex % CHANNEL_LABEL_COLORS.length];
  return active ? color.active : color.inactive;
}

type ExerciseConfig = {
  input: number[][][];
  kernel: number[][][];
};

type KernelPreset = {
  name: string;
  kernel: number[][][];
};

type CellCoord = {
  row: number;
  col: number;
};

type ProductTerm = {
  input: number;
  kernel: number;
  product: number;
};

const EXERCISES: Record<Difficulty, ExerciseConfig> = {
  easy: {
    input: [[
      [0.10, 0.35, 0.70, 0.20],
      [0.00, 0.55, 0.90, 0.45],
      [0.15, 0.80, 0.60, 0.10],
      [0.25, 0.40, 0.20, 0.05],
    ]],
    kernel: [[
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0],
    ]],
  },
  medium: {
    input: [[
      [0.00, 0.15, 0.45, 0.78, 0.35],
      [0.08, 0.42, 0.88, 0.62, 0.58],
      [0.02, 0.24, 0.52, 0.95, 0.72],
      [0.00, 0.12, 0.76, 0.68, 0.30],
      [0.18, 0.64, 0.82, 0.36, 0.14],
    ]],
    kernel: [[
      [0.25, 0, -0.25],
      [0.50, 0, -0.50],
      [0.25, 0, -0.25],
    ]],
  },
  hard: {
    input: [
      [
        [0.10, 0.40, 0.76, 0.55, 0.12],
        [0.00, 0.30, 0.90, 0.70, 0.26],
        [0.04, 0.20, 0.58, 0.92, 0.40],
        [0.00, 0.10, 0.36, 0.72, 0.30],
        [0.12, 0.38, 0.64, 0.28, 0.08],
      ],
      [
        [0.18, 0.12, 0.08, 0.22, 0.42],
        [0.30, 0.48, 0.24, 0.18, 0.36],
        [0.16, 0.62, 0.84, 0.44, 0.20],
        [0.05, 0.28, 0.76, 0.88, 0.34],
        [0.00, 0.14, 0.36, 0.60, 0.52],
      ],
      [
        [0.55, 0.28, 0.10, 0.00, 0.05],
        [0.70, 0.46, 0.22, 0.08, 0.02],
        [0.64, 0.82, 0.50, 0.24, 0.12],
        [0.22, 0.58, 0.92, 0.66, 0.18],
        [0.06, 0.20, 0.44, 0.78, 0.38],
      ],
    ],
    kernel: [
      [
        [0, -1, 0],
        [-1, 4, -1],
        [0, -1, 0],
      ],
      [
        [0.15, 0.15, 0.15],
        [0, 0.40, 0],
        [-0.15, -0.15, -0.15],
      ],
      [
        [0.25, 0, -0.25],
        [0.50, 0, -0.50],
        [0.25, 0, -0.25],
      ],
    ],
  },
};

const BASE_KERNEL_PRESETS: KernelPreset[] = [
  {
    name: 'Sobel X',
    kernel: [[
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ]],
  },
  {
    name: 'Sobel Y',
    kernel: [[
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ]],
  },
  {
    name: 'Sharpen',
    kernel: [[
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ]],
  },
  {
    name: 'Box blur',
    kernel: [[
      [0.11, 0.11, 0.11],
      [0.11, 0.11, 0.11],
      [0.11, 0.11, 0.11],
    ]],
  },
];

function formatCellValue(value: number): string {
  return value.toFixed(ANSWER_DECIMALS);
}

function parseNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function stringifyKernel(kernel: number[][][]): string[][][] {
  return kernel.map((channel) => channel.map((row) => row.map((value) => String(value))));
}

function expandKernelPreset(preset: KernelPreset, channels: number): number[][][] {
  return Array.from({ length: channels }, (_, index) => preset.kernel[index % preset.kernel.length]);
}

function isCloseEnough(input: string, expected: number): boolean {
  const parsed = Number(input);
  if (!Number.isFinite(parsed)) return false;
  return Math.abs(parsed - expected) <= 0.01;
}

function getOutputKey(row: number, col: number): string {
  return `${row}-${col}`;
}

function convolveTensor(input: number[][][], kernel: number[][][]): number[][] {
  const channels = Math.min(input.length, kernel.length);
  const rows = input[0].length - KERNEL_SIZE + 1;
  const cols = input[0][0].length - KERNEL_SIZE + 1;
  return Array.from({ length: rows }, (_, row) => (
    Array.from({ length: cols }, (_, col) => {
      let sum = 0;
      for (let ch = 0; ch < channels; ch++) {
        for (let kr = 0; kr < KERNEL_SIZE; kr++) {
          for (let kc = 0; kc < KERNEL_SIZE; kc++) {
            sum += input[ch][row + kr][col + kc] * kernel[ch][kr][kc];
          }
        }
      }
      return sum;
    })
  ));
}

function getChannelContributions(input: number[][][], kernel: number[][][], cell: CellCoord): number[] {
  return input.map((channelInput, channelIndex) => {
    const channelKernel = kernel[channelIndex] ?? kernel[0];
    let sum = 0;
    for (let kr = 0; kr < KERNEL_SIZE; kr++) {
      for (let kc = 0; kc < KERNEL_SIZE; kc++) {
        sum += channelInput[cell.row + kr][cell.col + kc] * channelKernel[kr][kc];
      }
    }
    return sum;
  });
}

function getHintProductRows(input: number[][][], kernel: number[][][], cell: CellCoord): ProductTerm[][] {
  return input.map((channelInput, channelIndex) => {
    const channelKernel = kernel[channelIndex] ?? kernel[0];
    const terms: ProductTerm[] = [];
    for (let kr = 0; kr < KERNEL_SIZE; kr++) {
      for (let kc = 0; kc < KERNEL_SIZE; kc++) {
        const inputValue = channelInput[cell.row + kr][cell.col + kc];
        const kernelValue = channelKernel[kr][kc];
        terms.push({
          input: inputValue,
          kernel: kernelValue,
          product: inputValue * kernelValue,
        });
      }
    }
    return terms;
  });
}

const DifficultyTabs: React.FC<{
  difficulty: Difficulty;
  t: DemoLabels;
  onChange: (difficulty: Difficulty) => void;
}> = ({ difficulty, t, onChange }) => {
  return (
    <div className="flex rounded-md border border-zinc-700 bg-zinc-950/65 p-1">
      {DIFFICULTIES.map((option) => (
        <button
          key={option}
          type="button"
          className={`h-7 rounded px-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${
            difficulty === option
              ? 'bg-sky-400/20 text-sky-100'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
          }`}
          onClick={() => onChange(option)}
        >
          {t.exerciseDifficulty(option)}
        </button>
      ))}
    </div>
  );
};

const MatrixGrid: React.FC<{
  matrix: number[][];
  cols: number;
  channelIndex: number;
  label?: string;
  labelActive?: boolean;
  labelClassName?: string;
  tint: 'sky' | 'emerald';
  highlightCell?: CellCoord | null;
  highlightWindow?: CellCoord | null;
  activePairIndex?: number | null;
}> = ({ matrix, cols, channelIndex, label, labelActive = false, labelClassName, tint, highlightCell = null, highlightWindow = null, activePairIndex = null }) => (
  <div className="w-full max-w-[32rem] min-w-0">
    {label && (
      <div className={`mb-1 text-[10px] font-bold uppercase tracking-wider ${
        labelClassName ?? (labelActive ? 'text-sky-100' : 'text-zinc-600')
      }`}>
        {label}
      </div>
    )}
    <div
      className={`grid gap-1 rounded-md border p-2 ${
        tint === 'sky'
          ? 'border-sky-300/15 bg-zinc-950/80'
          : 'border-emerald-300/15 bg-zinc-950/80'
      }`}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {matrix.flat().map((value, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const inWindow = !!highlightWindow
          && row >= highlightWindow.row
          && row < highlightWindow.row + KERNEL_SIZE
          && col >= highlightWindow.col
          && col < highlightWindow.col + KERNEL_SIZE;
        const isCell = highlightCell?.row === row && highlightCell?.col === col;
        const localWindowIndex = inWindow && highlightWindow
          ? (row - highlightWindow.row) * KERNEL_SIZE + (col - highlightWindow.col)
          : -1;
        const pairIndex = channelIndex * KERNEL_PAIR_COUNT + localWindowIndex;
        const isActivePair = inWindow && activePairIndex === pairIndex;

        return (
          <div
            key={index}
            className={`relative z-0 flex aspect-square min-h-7 items-center justify-center rounded-sm border text-[10px] font-mono ${
              tint === 'sky'
                ? isActivePair
                  ? 'z-10 border-sky-100 bg-sky-300/40 text-white shadow-[0_0_18px_rgba(56,189,248,0.35)]'
                  : inWindow
                    ? 'border-sky-200/70 bg-sky-400/30 text-sky-50'
                  : 'border-sky-200/10 bg-sky-400/10 text-sky-100'
                : isCell
                  ? 'border-emerald-200/70 bg-emerald-400/30 text-emerald-50 animate-pulse'
                  : 'border-emerald-200/10 bg-emerald-400/10 text-emerald-100'
            }`}
            style={{
              opacity: inWindow || isCell ? 1 : 0.28 + Math.min(Math.abs(value), 1) * 0.72,
            }}
          >
            <span>{formatCellValue(value)}</span>
          </div>
        );
      })}
    </div>
  </div>
);

const TensorChannelStack: React.FC<{
  input: number[][][];
  activeChannel: number;
  hintCell?: CellCoord | null;
  activePairIndex?: number | null;
  t: DemoLabels;
  onChannelChange: (channel: number) => void;
}> = ({ input, activeChannel, hintCell = null, activePairIndex = null, t, onChannelChange }) => {
  const channelCount = input.length;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative min-h-[29rem] overflow-visible pr-14 pt-8">
        {input.map((channel, channelIndex) => {
          const stackOffset = channelIndex;
          const isActive = channelIndex === activeChannel;
          return (
            <button
              key={channelIndex}
              type="button"
              className={`absolute left-0 top-16 w-[calc(100%-3.5rem)] max-w-[24rem] min-w-0 text-left transition-[opacity,filter] duration-200 ${
                isActive ? 'cursor-default' : 'cursor-pointer hover:brightness-125'
              }`}
              style={{
                zIndex: isActive ? channelCount + 1 : channelCount - stackOffset,
                transform: `translate(${stackOffset * 1.65}rem, ${stackOffset * -1.2}rem) scale(0.94)`,
                opacity: isActive ? 1 : 0.58,
              }}
              onClick={() => onChannelChange(channelIndex)}
              aria-label={t.channelLabel(channelIndex + 1)}
            >
              <MatrixGrid
                matrix={channel}
                cols={channel[0].length}
                channelIndex={channelIndex}
                label={t.channelLabel(channelIndex + 1)}
                labelActive={isActive}
                labelClassName={getChannelLabelColor(channelIndex, isActive)}
                tint="sky"
                highlightWindow={hintCell}
                activePairIndex={activePairIndex}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

const KernelChannelGrid: React.FC<{
  channel: string[][];
  channelIndex: number;
  active?: boolean;
  showLabel?: boolean;
  labelClassName?: string;
  hintActive?: boolean;
  activePairIndex?: number | null;
  t: DemoLabels;
  onChange: (channel: number, row: number, col: number, value: string) => void;
}> = ({ channel, channelIndex, active = true, showLabel = true, labelClassName, hintActive = false, activePairIndex = null, t, onChange }) => (
  <div className="flex flex-col items-start">
    {showLabel && (
      <div className={`mb-1 text-left text-[10px] font-bold uppercase tracking-wider ${
        labelClassName ?? (active ? 'text-amber-100' : 'text-zinc-600')
      }`}>
        {t.channelLabel(channelIndex + 1)}
      </div>
    )}
    <div
      className="grid gap-1.5 rounded-md border border-amber-300/15 bg-zinc-950/80 p-2"
      style={{ gridTemplateColumns: 'repeat(3, 3.5rem)' }}
    >
      {channel.flatMap((row, rowIndex) => row.map((value, colIndex) => {
        const pairIndex = channelIndex * KERNEL_PAIR_COUNT + rowIndex * KERNEL_SIZE + colIndex;
        const isActivePair = activePairIndex === pairIndex;
        return (
          <div key={`${channelIndex}-${rowIndex}-${colIndex}`} className="relative">
            <input
              className={`relative h-11 w-full rounded-sm border bg-zinc-900 px-1 text-center text-[12px] font-mono text-amber-100 outline-none focus:border-amber-200 ${
                isActivePair
                  ? 'z-10 border-amber-100 bg-amber-300/25 shadow-[0_0_18px_rgba(251,191,36,0.35)]'
                  : hintActive
                    ? 'border-amber-200/80'
                    : 'border-amber-300/30'
              } ${active ? '' : 'pointer-events-none'}`}
              type="text"
              inputMode="decimal"
              value={value}
              aria-label={t.kernelCell(channelIndex + 1, rowIndex + 1, colIndex + 1)}
              tabIndex={active ? 0 : -1}
              onChange={(event) => onChange(channelIndex, rowIndex, colIndex, event.currentTarget.value)}
            />
          </div>
        );
      }))}
    </div>
  </div>
);

const KernelChannelStack: React.FC<{
  kernelValues: string[][][];
  activeChannel: number;
  hintActive?: boolean;
  activePairIndex?: number | null;
  t: DemoLabels;
  onChannelChange: (channel: number) => void;
  onChange: (channel: number, row: number, col: number, value: string) => void;
}> = ({ kernelValues, activeChannel, hintActive = false, activePairIndex = null, t, onChannelChange, onChange }) => {
  const channelCount = kernelValues.length;

  return (
    <div className="p-3">
      <div className="-mt-3 mb-5 flex flex-col items-start gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
          {t.editableKernel}
        </span>
        <button
          type="button"
          className="h-7 rounded-md border border-sky-300/35 bg-sky-400/12 px-2.5 text-[10px] font-bold uppercase tracking-wider text-sky-100 hover:bg-sky-400/22"
          onClick={() => onChannelChange((activeChannel + 1) % channelCount)}
        >
          {t.changeChannel}
        </button>
      </div>
      <div className="relative min-h-[15rem] overflow-visible pr-8 pt-8">
        {kernelValues.map((channel, channelIndex) => {
          const stackOffset = channelIndex;
          const isActive = channelIndex === activeChannel;
          return (
            <div
              key={channelIndex}
              className={`absolute left-0 top-14 min-w-0 transition-[opacity,filter] duration-200 ${
                isActive ? 'cursor-default' : 'cursor-pointer hover:brightness-125'
              }`}
              style={{
                zIndex: isActive ? channelCount + 1 : channelCount - stackOffset,
                transform: `translate(${stackOffset * 1.65}rem, ${stackOffset * -1.05}rem) scale(0.95)`,
                opacity: isActive ? 1 : 0.58,
              }}
              onClick={() => onChannelChange(channelIndex)}
              role="button"
              tabIndex={isActive ? -1 : 0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onChannelChange(channelIndex);
                }
              }}
            >
              <KernelChannelGrid
                channel={channel}
                channelIndex={channelIndex}
                active={isActive}
                showLabel
                labelClassName={getChannelLabelColor(channelIndex, isActive)}
                hintActive={hintActive}
                activePairIndex={activePairIndex}
                t={t}
                onChange={onChange}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const KernelEditor: React.FC<{
  kernelValues: string[][][];
  activeChannel?: number;
  hintActive?: boolean;
  activePairIndex?: number | null;
  t: DemoLabels;
  onChannelChange?: (channel: number) => void;
  onChange: (channel: number, row: number, col: number, value: string) => void;
}> = ({ kernelValues, activeChannel = 0, hintActive = false, activePairIndex = null, t, onChannelChange, onChange }) => {
  if (kernelValues.length > 1 && onChannelChange) {
    return (
      <KernelChannelStack
        kernelValues={kernelValues}
        activeChannel={activeChannel}
        hintActive={hintActive}
        activePairIndex={activePairIndex}
        t={t}
        onChannelChange={onChannelChange}
        onChange={onChange}
      />
    );
  }

  return (
    <div className="p-3">
      <div className="mb-2 text-center text-[10px] font-bold uppercase tracking-wider text-amber-200">
        {t.editableKernel}
      </div>
      <div className="flex max-h-[22rem] flex-col items-center gap-4 overflow-auto px-1">
        {kernelValues.map((channel, channelIndex) => (
          <KernelChannelGrid
            key={channelIndex}
            channel={channel}
            channelIndex={channelIndex}
            showLabel={kernelValues.length > 1}
            hintActive={hintActive}
            activePairIndex={activePairIndex}
            t={t}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
};

export const ConvExerciseModal: React.FC<{
  isOpen: boolean;
  t: DemoLabels;
  onClose: () => void;
}> = ({ isOpen, t, onClose }) => {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [kernelValues, setKernelValues] = useState(() => stringifyKernel(EXERCISES.easy.kernel));
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);
  const [hintCell, setHintCell] = useState<CellCoord | null>(null);
  const [activePairIndex, setActivePairIndex] = useState<number | null>(null);
  const [activeInputChannel, setActiveInputChannel] = useState(0);
  const [activeKernelChannel, setActiveKernelChannel] = useState(0);

  const config = EXERCISES[difficulty];
  const numericKernel = useMemo(() => (
    kernelValues.map((channel) => channel.map((row) => row.map(parseNumber)))
  ), [kernelValues]);
  const answers = useMemo(() => convolveTensor(config.input, numericKernel), [config.input, numericKernel]);
  const hintContributions = useMemo(() => (
    hintCell ? getChannelContributions(config.input, numericKernel, hintCell) : []
  ), [config.input, hintCell, numericKernel]);
  const hintProductRows = useMemo(() => (
    hintCell ? getHintProductRows(config.input, numericKernel, hintCell) : []
  ), [config.input, hintCell, numericKernel]);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        const previousFocus = previousFocusRef.current;
        if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
      }
      return;
    }

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    wasOpenRef.current = true;

    const frameId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    setKernelValues(stringifyKernel(EXERCISES[difficulty].kernel));
    setValues({});
    setSubmitted(false);
    setHintCell(null);
    setActivePairIndex(null);
    setActiveInputChannel(0);
    setActiveKernelChannel(0);
  }, [difficulty]);

  useEffect(() => {
    setValues({});
    setSubmitted(false);
    setHintCell(null);
    setActivePairIndex(null);
  }, [kernelValues]);

  useEffect(() => {
    if (!hintCell) {
      setActivePairIndex(null);
      return;
    }

    setActivePairIndex(0);
    const totalPairs = config.input.length * KERNEL_PAIR_COUNT;
    let nextPair = 1;
    const intervalId = window.setInterval(() => {
      if (nextPair >= totalPairs) {
        window.clearInterval(intervalId);
        return;
      }
      setActivePairIndex(nextPair);
      nextPair += 1;
    }, HINT_PAIR_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [config.input.length, hintCell]);

  useEffect(() => {
    if (difficulty !== 'hard' || activePairIndex === null) return;
    const channel = Math.floor(activePairIndex / KERNEL_PAIR_COUNT);
    setActiveInputChannel(channel);
    setActiveKernelChannel(Math.min(channel, kernelValues.length - 1));
  }, [activePairIndex, difficulty, kernelValues.length]);

  if (!isOpen || typeof document === 'undefined') return null;

  const outputCells = answers.length * (answers[0]?.length ?? 0);
  const completedCells = answers.reduce((total, row, rowIndex) => (
    total + row.filter((expected, colIndex) => {
      const key = getOutputKey(rowIndex, colIndex);
      return isCloseEnough(values[key] ?? '', expected);
    }).length
  ), 0);

  const reset = () => {
    setValues({});
    setSubmitted(false);
    setHintCell(null);
    setActivePairIndex(null);
  };

  const showHint = () => {
    let nextCell: CellCoord | null = null;
    for (let rowIndex = 0; rowIndex < answers.length; rowIndex++) {
      for (let colIndex = 0; colIndex < answers[rowIndex].length; colIndex++) {
        const key = getOutputKey(rowIndex, colIndex);
        if (!isCloseEnough(values[key] ?? '', answers[rowIndex][colIndex])) {
          nextCell = { row: rowIndex, col: colIndex };
          break;
        }
      }
      if (nextCell) break;
    }

    const targetCell = nextCell ?? { row: 0, col: 0 };
    setHintCell(targetCell);
    setSubmitted(false);
    setValues((prev) => ({
      ...prev,
      [getOutputKey(targetCell.row, targetCell.col)]: formatCellValue(answers[targetCell.row][targetCell.col]),
    }));
  };

  const applyNextKernelPreset = () => {
    const nextIndex = (presetIndex + 1) % BASE_KERNEL_PRESETS.length;
    const nextPreset = BASE_KERNEL_PRESETS[nextIndex];
    setPresetIndex(nextIndex);
    setKernelValues(stringifyKernel(expandKernelPreset(nextPreset, config.input.length)));
  };

  const changeInputChannel = () => {
    setActiveInputChannel((channel) => (channel + 1) % config.input.length);
  };

  const updateKernel = (channel: number, row: number, col: number, value: string) => {
    setKernelValues((prev) => prev.map((channelValues, channelIndex) => (
      channelIndex !== channel
        ? channelValues
        : channelValues.map((rowValues, rowIndex) => (
          rowIndex !== row
            ? rowValues
            : rowValues.map((cellValue, colIndex) => (colIndex === col ? value : cellValue))
        ))
    )));
  };

  return createPortal((
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/82 backdrop-blur-xl pointer-events-auto">
      <div
        className="flex w-[min(86rem,calc(100%-1.25rem))] max-h-[calc(100vh-1.25rem)] flex-col overflow-hidden rounded-lg border border-white/15 bg-zinc-950/96 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-4 border-b border-white/10 px-4 py-3">
          <div className="min-w-0 self-center">
            <h2 id={titleId} className="text-sm font-bold uppercase tracking-wider text-sky-100">{t.exerciseTitle}</h2>
          </div>
          <div className="min-w-0 justify-self-center">
            <DifficultyTabs difficulty={difficulty} t={t} onChange={setDifficulty} />
          </div>
          <button
            ref={closeButtonRef}
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

        <div className="min-h-0 flex-1 overflow-auto">
          <div className="grid grid-cols-1 gap-5 p-5 xl:grid-cols-[minmax(18rem,1fr)_minmax(16rem,auto)_minmax(17rem,1fr)]">
            <section className="min-w-0">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">{t.inputMap}</h3>
                <span className="pr-10 text-[10px] font-mono text-white">
                  {config.input.length} x {config.input[0].length} x {config.input[0][0].length}
                </span>
              </div>
              {difficulty === 'hard' ? (
                <>
                  <button
                    type="button"
                    className="mb-3 h-7 rounded-md border border-sky-300/35 bg-sky-400/12 px-2.5 text-[10px] font-bold uppercase tracking-wider text-sky-100 hover:bg-sky-400/22"
                    onClick={changeInputChannel}
                  >
                    {t.changeChannel}
                  </button>
                  <TensorChannelStack
                    input={config.input}
                    activeChannel={activeInputChannel}
                    hintCell={hintCell}
                    activePairIndex={activePairIndex}
                    t={t}
                    onChannelChange={setActiveInputChannel}
                  />
                </>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {config.input.map((matrix, index) => (
                    <MatrixGrid
                      key={index}
                      matrix={matrix}
                      cols={matrix[0].length}
                      channelIndex={index}
                      label={config.input.length > 1 ? t.channelLabel(index + 1) : undefined}
                      tint="sky"
                      highlightWindow={hintCell}
                      activePairIndex={activePairIndex}
                    />
                  ))}
                </div>
              )}
            </section>

            <div className="flex min-w-0 flex-col items-center justify-center gap-3 px-1">
              <KernelEditor
                kernelValues={kernelValues}
                activeChannel={activeKernelChannel}
                hintActive={!!hintCell}
                activePairIndex={activePairIndex}
                t={t}
                onChannelChange={difficulty === 'hard' ? setActiveKernelChannel : undefined}
                onChange={updateKernel}
              />
              <button
                type="button"
                className="h-8 rounded-md border border-amber-300/35 bg-amber-400/12 px-3 text-[11px] font-bold uppercase tracking-wider text-amber-100 hover:bg-amber-400/22"
                onClick={applyNextKernelPreset}
                title={BASE_KERNEL_PRESETS[(presetIndex + 1) % BASE_KERNEL_PRESETS.length].name}
              >
                {t.randomKernel}
              </button>
            </div>

            <section className="min-w-0">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">{t.outputMap}</h3>
                <span className="text-[10px] font-mono text-zinc-500">{completedCells}/{outputCells}</span>
              </div>
              <div
                className="grid gap-1 rounded-md border border-emerald-300/15 bg-zinc-950/80 p-2"
                style={{ gridTemplateColumns: `repeat(${answers[0]?.length ?? 1}, minmax(0, 1fr))` }}
              >
                {answers.flatMap((row, rowIndex) => row.map((expected, colIndex) => {
                  const key = getOutputKey(rowIndex, colIndex);
                  const currentValue = values[key] ?? '';
                  const isHintCell = hintCell?.row === rowIndex && hintCell?.col === colIndex;
                  const status: CellStatus = !submitted || isHintCell || currentValue.trim() === ''
                    ? 'idle'
                    : isCloseEnough(currentValue, expected)
                      ? 'correct'
                      : 'wrong';

                  return (
                    <input
                      key={key}
                      className={`aspect-square min-h-8 rounded-sm border bg-zinc-900/75 px-1 text-center text-[11px] font-mono outline-none transition-colors ${
                        isHintCell
                          ? 'border-amber-300/80 text-amber-100 animate-pulse'
                          : status === 'correct'
                            ? 'border-emerald-300/70 text-emerald-100'
                            : status === 'wrong'
                              ? 'border-red-300/70 text-red-100'
                              : 'border-zinc-600/70 text-zinc-100 focus:border-sky-300'
                      }`}
                      type="text"
                      inputMode="decimal"
                      value={currentValue}
                      aria-label={t.outputCell(rowIndex + 1, colIndex + 1)}
                      title={t.outputCell(rowIndex + 1, colIndex + 1)}
                      onChange={(event) => {
                        const nextValue = event.currentTarget.value;
                        setSubmitted(false);
                        setValues((prev) => ({ ...prev, [key]: nextValue }));
                      }}
                    />
                  );
                }))}
              </div>
            </section>
          </div>

          {hintCell && (
            <div className="border-t border-white/10 px-5 py-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-[16px] font-bold uppercase tracking-wider text-sky-100">
                  {t.hintBreakdownTitle}
                </h3>
                <span className="text-[13px] font-mono text-zinc-500">
                  {t.outputCell(hintCell.row + 1, hintCell.col + 1)}
                </span>
              </div>
              <div className="rounded-md border border-sky-300/15 bg-sky-400/8 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  {hintProductRows.flatMap((terms, channelIndex) => {
                    const channelBits: React.ReactNode[] = [];
                    if (hintProductRows.length > 1) {
                      channelBits.push(
                        <span
                          key={`label-${channelIndex}`}
                          className="rounded border border-zinc-600/60 bg-zinc-900 px-2 py-1 text-[13px] font-bold uppercase tracking-wider text-zinc-300"
                        >
                          {t.channelLabel(channelIndex + 1)}
                        </span>,
                      );
                    }
                    terms.forEach((term, termIndex) => {
                      const globalIndex = channelIndex * KERNEL_PAIR_COUNT + termIndex;
                      if (channelBits.length > 0) {
                        channelBits.push(
                          <span key={`plus-${channelIndex}-${termIndex}`} className="text-[15px] text-zinc-500">
                            +
                          </span>,
                        );
                      }
                      channelBits.push(
                        <span
                          key={`term-${channelIndex}-${termIndex}`}
                          className={`rounded border px-2.5 py-1 text-[14px] font-mono transition-colors ${
                            activePairIndex === globalIndex
                              ? 'border-amber-200/70 bg-amber-300/20 text-amber-50 shadow-[0_0_18px_rgba(251,191,36,0.25)]'
                              : 'border-sky-300/25 bg-zinc-950/80 text-sky-100'
                          }`}
                        >
                          {formatCellValue(term.input)} x {formatCellValue(term.kernel)} = {formatCellValue(term.product)}
                        </span>,
                      );
                    });
                    return channelBits;
                  })}
                  <span className="px-1 text-lg font-bold text-emerald-200">=</span>
                  <span className="rounded border border-emerald-300/45 bg-emerald-400/15 px-2.5 py-1 text-[15px] font-mono font-bold text-emerald-100">
                    {formatCellValue(answers[hintCell.row][hintCell.col])}
                  </span>
                </div>
                {hintProductRows.length > 1 && (
                  <div className="mt-3 text-[13px] text-zinc-500">
                    {t.hintFormula(
                      hintContributions.map(formatCellValue).join(' + '),
                      formatCellValue(answers[hintCell.row][hintCell.col]),
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
          <p className="text-xs text-zinc-400">
            {submitted ? t.exerciseResult(completedCells, outputCells) : t.exerciseInstruction}
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
              className="h-8 rounded-md border border-amber-300/45 bg-amber-400/14 px-3 text-xs font-semibold text-amber-100 hover:bg-amber-400/24"
              onClick={showHint}
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
      </div>
    </div>
  ), document.body);
};

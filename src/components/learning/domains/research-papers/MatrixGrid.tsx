type Cell = { r: number; c: number };
type GridVariant = 'overview' | 'before' | 'after' | 'propagation';

const CONTAINER_CLASSES: Record<GridVariant, string> = {
  overview: 'rounded-xl border border-[#B8C8DA]/70 bg-slate-100 p-2 shadow-inner',
  before: 'rounded-xl border border-slate-200 bg-slate-50 p-2',
  after: 'rounded-xl border-2 border-[#10B981]/40 bg-[#F0FDF4] p-2',
  propagation: 'rounded-2xl border-2 border-[#B8C8DA] bg-slate-100 p-2.5 shadow-md',
};

const CELL_SIZE_CLASSES: Record<GridVariant, string> = {
  overview: 'size-5 sm:size-7',
  before: 'size-5 sm:size-6',
  after: 'size-5 sm:size-6',
  propagation: 'size-5 sm:size-7',
};

function getCellClasses({
  variant,
  isFocused,
  isNeighbor,
  isWaveFront,
  isZero,
  interactive,
}: {
  variant: GridVariant;
  isFocused: boolean;
  isNeighbor: boolean;
  isWaveFront: boolean;
  isZero: boolean;
  interactive: boolean;
}) {
  if (isFocused) {
    if (variant === 'after') return 'z-20 scale-125 bg-[#059669] font-black text-white shadow-lg ring-3 ring-[#10B981]/70';
    if (variant === 'propagation') return 'z-10 scale-110 bg-[#205089] font-black text-white shadow-md ring-2 ring-[#205089]';
    return interactive
      ? 'z-20 scale-110 bg-[#205089] font-bold text-white shadow ring-2 ring-[#205089]'
      : 'scale-110 bg-[#205089] font-black text-white shadow-md ring-2 ring-[#205089]';
  }
  if (variant === 'propagation') {
    if (isWaveFront) return 'scale-105 bg-amber-100 font-black text-amber-900 shadow-xs ring-1 ring-amber-400';
    return isZero
      ? 'border border-slate-200/40 bg-slate-50 font-normal text-slate-300 opacity-40'
      : 'border border-[#10B981]/40 bg-[#ECFDF5] font-bold text-[#065F46]';
  }
  if (isNeighbor) {
    const ring = interactive ? 'ring-[#205089]/40' : variant === 'after' ? 'ring-[#205089]/30' : 'ring-[#205089]/50';
    const weight = interactive ? 'font-semibold' : 'font-bold';
    return `z-10 bg-[#DCE7F5] ${weight} text-[#1E3A8A] ring-1 ${ring}`;
  }
  if (interactive) return variant === 'after' ? 'bg-white text-slate-600 hover:bg-slate-100' : 'bg-white/80 text-slate-500 hover:bg-slate-200';
  return 'bg-white/60 text-slate-400 opacity-40';
}

export function MatrixGrid({
  grid,
  focus,
  variant,
  showNeighborhood = false,
  waveRadius,
  onCellSelect,
}: {
  grid: number[][];
  focus: Cell;
  variant: GridVariant;
  showNeighborhood?: boolean;
  waveRadius?: number;
  onCellSelect?: (cell: Cell) => void;
}) {
  const interactive = Boolean(onCellSelect);
  return (
    <div className={`grid grid-cols-12 gap-0.5 sm:gap-1 ${CONTAINER_CLASSES[variant]}`}>
      {grid.flatMap((row, r) => row.map((value, c) => {
        const distance = Math.max(Math.abs(r - focus.r), Math.abs(c - focus.c));
        const isFocused = distance === 0;
        const transitionDuration = variant === 'propagation' ? 'duration-300' : variant === 'after' && interactive ? 'duration-200' : '';
        const className = `flex items-center justify-center rounded font-mono text-[10px] transition-all sm:text-xs ${transitionDuration} ${CELL_SIZE_CLASSES[variant]} ${getCellClasses({
          variant,
          isFocused,
          isNeighbor: showNeighborhood && distance <= 1,
          isWaveFront: waveRadius !== undefined && waveRadius > 0 && distance === waveRadius && value !== 0,
          isZero: value === 0,
          interactive,
        })}`;
        const key = `${r}-${c}`;

        return onCellSelect ? (
          <button key={key} type="button" onClick={() => onCellSelect({ r, c })} title={`Ô (${r}, ${c}) = ${value}. Nhấn để soi`} className={className}>
            {value}
          </button>
        ) : (
          <div key={key} className={className}>{value}</div>
        );
      }))}
    </div>
  );
}

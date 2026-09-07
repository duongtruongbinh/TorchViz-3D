export const GRID_SIZE = 12;
export const CELL_COUNT = GRID_SIZE * GRID_SIZE;
export const TARGET_CELL = { r: 5, c: 5 } as const;

export const STEP_LABELS = [
  '1. Vùng quan sát 3x3',
  '2. Dàn phẳng (Flatten)',
  '3. Mạng nơ-ron chấm điểm',
  '4. Cập nhật cục bộ ô đích',
  '5. Áp dụng song song toàn bộ',
  '6. Minh họa lan truyền',
] as const;

export const INITIAL_GRID: number[][] = [
  [5, 2, 8, 1, 4, 0, 3, 7, 9, 2, 6, 1],
  [1, 9, 0, 7, 2, 5, 8, 1, 0, 4, 3, 7],
  [6, 4, 1, 3, 5, 2, 9, 0, 6, 8, 2, 5],
  [0, 3, 8, 0, 4, 7, 1, 6, 3, 9, 0, 4],
  [7, 5, 2, 6, 0, 7, 2, 4, 8, 1, 5, 2],
  [2, 8, 4, 0, 1, 3, 5, 9, 2, 6, 3, 8],
  [9, 1, 7, 3, 8, 0, 4, 0, 4, 5, 1, 9],
  [3, 6, 0, 9, 5, 4, 2, 8, 7, 0, 4, 6],
  [8, 0, 5, 2, 7, 1, 4, 3, 9, 6, 8, 0],
  [4, 7, 3, 8, 0, 9, 1, 5, 2, 7, 4, 3],
  [0, 2, 9, 5, 6, 8, 3, 1, 0, 4, 9, 2],
  [6, 3, 1, 4, 2, 0, 7, 9, 5, 8, 1, 6],
];

export const PARALLEL_UPDATED_GRID: number[][] = [
  [2, 7, 3, 6, 1, 8, 0, 4, 5, 9, 1, 8],
  [8, 3, 6, 2, 9, 1, 4, 7, 5, 0, 8, 2],
  [3, 8, 7, 0, 2, 9, 4, 6, 1, 3, 7, 0],
  [7, 0, 2, 8, 1, 3, 7, 2, 8, 4, 6, 1],
  [4, 1, 9, 0, 4, 8, 8, 1, 3, 6, 0, 7],
  [6, 2, 0, 7, 6, 8, 2, 4, 7, 1, 8, 3],
  [1, 6, 3, 8, 7, 8, 9, 7, 1, 2, 6, 0],
  [8, 1, 7, 4, 0, 9, 6, 3, 2, 5, 1, 0],
  [1, 7, 2, 9, 3, 8, 0, 5, 4, 1, 2, 6],
  [9, 2, 8, 1, 6, 3, 7, 0, 8, 4, 9, 7],
  [5, 8, 4, 1, 2, 0, 7, 6, 3, 9, 1, 7],
  [2, 9, 5, 0, 8, 6, 1, 3, 0, 2, 7, 1],
];

export const SINGLE_CELL_UPDATED_GRID = INITIAL_GRID.map((row, r) =>
  row.map((value, c) => (r === TARGET_CELL.r && c === TARGET_CELL.c ? 8 : value)),
);

// Pedagogical propagation sequence; this is not a sampled rollout from the paper.
export const PROPAGATION_STAGES = [0, 1, 2, 3, 4, 5].map((radius) => {
  const baseGrid = radius === 5 ? PARALLEL_UPDATED_GRID : INITIAL_GRID;
  return baseGrid.map((row, r) => row.map((value, c) => {
    const distance = Math.max(Math.abs(r - TARGET_CELL.r), Math.abs(c - TARGET_CELL.c));
    if (distance === 0) return radius === 0 ? 3 : 8;
    return distance <= radius ? value : 0;
  }));
});

export const PATCH_3X3 = [[0, 7, 2], [1, 3, 5], [8, 0, 4]];
export const FLATTENED_PATCH = PATCH_3X3.flat();

export const LOGITS_DATA = [
  { digit: 0, logit: -1.2, probability: 0 },
  { digit: 1, logit: 0.4, probability: 0 },
  { digit: 2, logit: -0.8, probability: 0 },
  { digit: 3, logit: 1.5, probability: 0 },
  { digit: 4, logit: -2.1, probability: 0 },
  { digit: 5, logit: 0.1, probability: 0 },
  { digit: 6, logit: -0.5, probability: 0 },
  { digit: 7, logit: 0.3, probability: 0 },
  { digit: 8, logit: 5.8, probability: 100 },
  { digit: 9, logit: -1, probability: 0 },
];

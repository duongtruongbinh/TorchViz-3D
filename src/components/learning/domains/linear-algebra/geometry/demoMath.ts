export type Vector2D = [number, number];

/**
 * Multiplies a 2x2 matrix by a 2D column vector.
 */
export function apply2x2(M: number[][], v: Vector2D): Vector2D {
  return [
    M[0][0] * v[0] + M[0][1] * v[1],
    M[1][0] * v[0] + M[1][1] * v[1],
  ];
}

/**
 * Multiplies a matrix (m x n) by a column vector (n).
 */
export function matVec(M: number[][], v: number[]): number[] {
  return M.map((row) =>
    row.reduce((sum, val, c) => sum + val * (v[c] ?? 0), 0),
  );
}

/**
 * Multiplies two 2x2 matrices: C = A * B.
 */
export function matMul2x2(A: number[][], B: number[][]): number[][] {
  return [
    [
      A[0][0] * B[0][0] + A[0][1] * B[1][0],
      A[0][0] * B[0][1] + A[0][1] * B[1][1],
    ],
    [
      A[1][0] * B[0][0] + A[1][1] * B[1][0],
      A[1][0] * B[0][1] + A[1][1] * B[1][1],
    ],
  ];
}

/**
 * Computes the determinant of a 2x2 matrix: ad - bc.
 */
export function det2x2(M: number[][]): number {
  return M[0][0] * M[1][1] - M[0][1] * M[1][0];
}

/**
 * Computes the trace of a square matrix: sum of diagonal elements.
 */
export function traceMatrix(M: number[][]): number {
  const n = Math.min(M.length, M[0]?.length ?? 0);
  let tr = 0;
  for (let i = 0; i < n; i++) {
    tr += M[i][i];
  }
  return tr;
}

/**
 * Computes the Frobenius norm of a matrix: sqrt(sum(a_ij^2)).
 */
export function frobeniusNorm(M: number[][]): number {
  let sumSq = 0;
  for (let r = 0; r < M.length; r++) {
    for (let c = 0; c < M[r].length; c++) {
      sumSq += M[r][c] * M[r][c];
    }
  }
  return Math.sqrt(sumSq);
}

/**
 * Computes the orthogonal projection of vector v onto a direction lineDir.
 */
export function projectOnto2D(v: Vector2D, lineDir: Vector2D): Vector2D {
  const dotLL = lineDir[0] * lineDir[0] + lineDir[1] * lineDir[1];
  if (dotLL < 1e-12) return [0, 0];
  const dotVL = v[0] * lineDir[0] + v[1] * lineDir[1];
  const scale = dotVL / dotLL;
  return [lineDir[0] * scale, lineDir[1] * scale];
}

/**
 * Normalizes a 2D vector. Returns [0, 0] if magnitude is near zero.
 */
export function normalize2D(v: Vector2D): Vector2D {
  const mag = Math.hypot(v[0], v[1]);
  if (mag < 1e-6) return [0, 0];
  return [v[0] / mag, v[1] / mag];
}

/**
 * Computes stable 2D bounds for a set of points.
 */
export function getStable2DBounds(
  points: Vector2D[],
  options: {
    minSpan?: number;
    margin?: number;
    includeOrigin?: boolean;
  } = {},
): { minX: number; maxX: number; minY: number; maxY: number } {
  const { minSpan = 4, margin = 0.5, includeOrigin = true } = options;

  let minX = includeOrigin ? 0 : Infinity;
  let maxX = includeOrigin ? 0 : -Infinity;
  let minY = includeOrigin ? 0 : Infinity;
  let maxY = includeOrigin ? 0 : -Infinity;

  for (const [x, y] of points) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  // Ensure minimum span
  if (maxX - minX < minSpan) {
    const midX = (minX + maxX) / 2;
    minX = midX - minSpan / 2;
    maxX = midX + minSpan / 2;
  }
  if (maxY - minY < minSpan) {
    const midY = (minY + maxY) / 2;
    minY = midY - minSpan / 2;
    maxY = midY + minSpan / 2;
  }

  return {
    minX: Math.floor(minX - margin),
    maxX: Math.ceil(maxX + margin),
    minY: Math.floor(minY - margin),
    maxY: Math.ceil(maxY + margin),
  };
}

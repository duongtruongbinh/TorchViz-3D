import { vec } from 'mafs';

export { vec };
export type Vector2D = [number, number];

export function clampZero(val: number, eps = 1e-10): number {
  return Math.abs(val) < eps ? 0 : val;
}

export function cosine2D(a: vec.Vector2, b: vec.Vector2): number {
  const magA = vec.mag(a);
  const magB = vec.mag(b);
  if (magA === 0 || magB === 0) return 0;
  const rawCos = vec.dot(a, b) / (magA * magB);
  return clampZero(Math.max(-1, Math.min(1, rawCos)));
}

export function coordinatesInOrthonormalBasis(
  v: vec.Vector2,
  b1: vec.Vector2,
  b2: vec.Vector2,
): [number, number] {
  return [vec.dot(v, b1), vec.dot(v, b2)];
}

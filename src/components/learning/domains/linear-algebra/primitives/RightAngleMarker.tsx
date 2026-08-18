import { Polygon, vec } from 'mafs';

export interface RightAngleMarkerProps {
  vertex?: [number, number];
  directionA: [number, number];
  directionB: [number, number];
  size?: number;
  color?: string;
}

export function RightAngleMarker({
  vertex = [0, 0],
  directionA,
  directionB,
  size = 0.25,
  color = 'rgba(16, 185, 129, 0.3)',
}: RightAngleMarkerProps) {
  const magA = vec.mag(directionA);
  const magB = vec.mag(directionB);

  if (magA < 1e-6 || magB < 1e-6) {
    return null;
  }

  const uA = vec.scale(directionA, size / magA);
  const uB = vec.scale(directionB, size / magB);

  const p1 = vec.add(vertex, uA);
  const p2 = vec.add(p1, uB);
  const p3 = vec.add(vertex, uB);

  return (
    <Polygon
      points={[vertex, p1, p2, p3]}
      color={color}
    />
  );
}

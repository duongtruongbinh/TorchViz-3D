import { Plot, Text, vec } from 'mafs';

export interface AngleArcProps {
  center?: [number, number];
  v1: [number, number];
  v2: [number, number];
  radius?: number;
  label?: string;
  color?: string;
}

export function AngleArc({
  center = [0, 0],
  v1,
  v2,
  radius = 0.8,
  label,
  color = '#ec4899',
}: AngleArcProps) {
  if (vec.mag(v1) < 1e-6 || vec.mag(v2) < 1e-6) {
    return null;
  }

  const ang1 = Math.atan2(v1[1], v1[0]);
  const ang2 = Math.atan2(v2[1], v2[0]);

  let diff = ang2 - ang1;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  while (diff > Math.PI) diff -= 2 * Math.PI;

  const startAng = ang1;
  const endAng = ang1 + diff;
  const minAng = Math.min(startAng, endAng);
  const maxAng = Math.max(startAng, endAng);

  const midAng = (startAng + endAng) / 2;
  const labelDist = radius + 0.35;
  const labelPos: vec.Vector2 = [
    center[0] + labelDist * Math.cos(midAng),
    center[1] + labelDist * Math.sin(midAng),
  ];

  return (
    <>
      <Plot.Parametric
        domain={[minAng, maxAng]}
        xy={(t) => [
          center[0] + radius * Math.cos(t),
          center[1] + radius * Math.sin(t),
        ]}
        color={color}
        style="dashed"
        weight={2}
      />
      {label && (
        <Text
          x={labelPos[0]}
          y={labelPos[1]}
          size={14}
          color={color}
          attach="ne"
        >
          {label}
        </Text>
      )}
    </>
  );
}

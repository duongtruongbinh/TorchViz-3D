import { useId } from 'react';
import type { FUNDAMENTALS_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import type { LearningMdxComponent } from '../../learningMdxComponents';
import { InlineMath } from '../../learningMdxComponents';
import { cx, getLearningLabTheme } from '../../theme';
import { linearAlgebraMdxComponents } from '../linear-algebra/mdxComponents';
import { PerceptronExercise } from './PerceptronExercise';

type Props = {
  stage: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21;
  description: string;
  threshold?: number;
  marginHalfWidth?: number;
  showOutlierError?: boolean;
  labels: {
    normal: string;
    obese: string;
    axis: string;
    thresholds?: string;
    sample?: string;
    prediction?: string;
    equalDistance?: string;
    margin?: string;
    outlier?: string;
    outlierPrediction?: string;
    tradeoff?: string;
    variation?: string;
  };
};

const theme = getLearningLabTheme('light');
const x = (position: number) => 36 + position * 40;
const gray = '#8A94A3';
const blue = '#205089';
const red = '#9F3450';

export function SvmThresholdMotivation({ stage, description, labels, threshold, marginHalfWidth, showOutlierError = true }: Props) {
  const showThreshold = stage >= 4 && stage !== 15;
  const showSample = (showThreshold && stage !== 8 && stage < 11) || stage === 17 || stage === 19;
  const thresholdPosition = threshold ?? (stage >= 18 && stage !== 20 ? 6 : stage >= 16 ? 7.7 : stage === 12 ? 5 : stage === 13 ? 7 : stage >= 8 ? 6 : 5);
  const samplePosition = stage === 4 ? 4.5 : stage === 10 || stage === 17 || stage === 19 ? 6.5 : 5.5;
  const sampleColor = stage === 4 || stage === 9 ? blue : red;
  const allowOutlierError = stage >= 18 && stage !== 20;

  return (
    <figure className={cx('my-6 rounded-xl border px-4 py-5 sm:px-5', theme.semantic.neutral.border, theme.semantic.neutral.surface)}>
      <svg viewBox={`88 0 416 ${showThreshold ? 230 : 180}`} className="mx-auto w-full max-w-[560px]" role="img" aria-label={description}>
        <g opacity={stage === 7 || (stage >= 11 && stage <= 14) ? 0.22 : 1}>
        {/* A mouse silhouette introduces the animal represented by each dot. */}
        {!showThreshold && stage < 4 && <g transform="translate(42 0)" fill="#D5DCE5" stroke="#64748B" strokeWidth="1.5">
          <path d="M270,44 Q302,24 307,43 Q310,58 294,60" fill="none" strokeLinecap="round" />
          <ellipse cx="247" cy="42" rx="27" ry="17" />
          <ellipse cx="222" cy="40" rx="13" ry="11" />
          <circle cx="227" cy="26" r="8" />
          <circle cx="216" cy="39" r="1.8" fill="#334155" stroke="none" />
          <circle cx="209" cy="44" r="2" fill="#64748B" stroke="none" />
          <path d="M210,43l-9,-4 M210,46l-10,2 M234,57h8 M254,57h8" fill="none" strokeLinecap="round" />
        </g>}
        {stage >= 1 && <text x={x(3)} y="93" textAnchor="middle" fill={blue} fontSize="15">{labels.normal}</text>}
        {stage >= 2 && <text x={x(9)} y="93" textAnchor="middle" fill={red} fontSize="15">{labels.obese}</text>}
        {stage === 3 && (
          <g stroke="#64748B" strokeWidth="1.5">
            <text x={x(6)} y="93" textAnchor="middle" fill="#334155" stroke="none" fontSize="15">{labels.thresholds}</text>
            {[4.5, 5.25, 6, 6.75, 7.5].map((position) => (
              <path key={position} d={`M${x(position)},102v35`} strokeDasharray="4 3" />
            ))}
          </g>
        )}
        {marginHalfWidth !== undefined && <>
          <rect x={x(thresholdPosition - marginHalfWidth)} y="100" width={marginHalfWidth * 80} height="40" fill={blue} opacity="0.08" />
          <path d={`M${x(thresholdPosition - marginHalfWidth)},98v45 M${x(thresholdPosition + marginHalfWidth)},98v45`} stroke={blue} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        </>}
        <path d="M96,119H496" stroke="#64748B" strokeWidth="1.5" />
        <path d="M490,115l6,4 -6,4" fill="none" stroke="#64748B" strokeWidth="1.5" />
        {[2, 3, 4].map((position) => <circle key={position} cx={x(position)} cy="119" r="7" fill={stage >= 1 ? blue : gray} />)}
        {[8, 9, 10].map((position) => <circle key={position} cx={x(position)} cy="119" r="7" fill={stage >= 2 ? red : gray} />)}
        {stage >= 15 && <>
          <circle cx={x(7.4)} cy="119" r="7" fill={blue} stroke="#172A43" strokeWidth="2" opacity={allowOutlierError ? 0.45 : 1} />
          {allowOutlierError && showOutlierError && <path d={`M${x(7.4) - 10},106l20,26 M${x(7.4) + 10},106l-20,26`} stroke={red} strokeWidth="2" />}
          {!showSample && stage < 20 && labels.outlier && <>
            <text x={x(7.4)} y="25" textAnchor="middle" fill={blue} fontSize="15">{labels.outlier}</text>
            {stage === 18 && <text x={x(7.4)} y="47" textAnchor="middle" fill={red} fontSize="15">{labels.outlierPrediction}</text>}
            <path d={`M${x(7.4)},${stage === 18 ? 54 : 34}V108`} stroke="#64748B" strokeWidth="1" strokeDasharray="2 3" />
          </>}
        </>}
        {showSample && <>
          <circle cx={x(samplePosition)} cy="119" r="9" fill={sampleColor} stroke="#172A43" strokeWidth="2" />
          <text x={x(samplePosition)} y="25" textAnchor="middle" fill="#172A43" fontSize="15">{labels.sample}</text>
          <text x={x(samplePosition)} y="47" textAnchor="middle" fill={stage === 17 ? blue : sampleColor} fontSize="15">{labels.prediction}</text>
          <path d={`M${x(samplePosition)},54v52`} stroke="#64748B" strokeWidth="1" strokeDasharray="2 3" />
        </>}
        {stage >= 6 && showSample && <>
          <path d={`M${x(4)},181v10 M${x(4)},186H${x(samplePosition)} M${x(samplePosition)},181v10`} stroke={blue} strokeWidth="2" fill="none" />
          <path d={`M${x(samplePosition)},181v10 M${x(samplePosition)},186H${x(8)} M${x(8)},181v10`} stroke={red} strokeWidth="2" fill="none" />
        </>}
        {stage === 8 && <>
          <circle cx={x(4)} cy="119" r="11" stroke={blue} strokeWidth="2" fill="none" />
          <circle cx={x(8)} cy="119" r="11" stroke={red} strokeWidth="2" fill="none" />
          <path d={`M${x(4)},65v10 M${x(4)},70H${x(6)} M${x(6)},65v10`} stroke={blue} strokeWidth="2" fill="none" />
          <path d={`M${x(6)},65v10 M${x(6)},70H${x(8)} M${x(8)},65v10`} stroke={red} strokeWidth="2" fill="none" />
          <text x={x(6)} y="47" textAnchor="middle" fill="#172A43" fontSize="15">{labels.equalDistance}</text>
        </>}
        {(stage === 20 || stage === 21) && <>
          <text x="296" y="25" textAnchor="middle" fill="#172A43" fontSize="16" fontWeight="700">{labels.tradeoff}</text>
          <text x="296" y="47" textAnchor="middle" fill="#334155" fontSize="15">{labels.variation}</text>
          {(stage === 20 ? [6, 7.3] : [5.9, 6.1]).map((position) => (
            <path key={position} d={`M${x(position)},98v45`} stroke={blue} strokeWidth="1.5" opacity="0.4" strokeDasharray="3 3" />
          ))}
        </>}
        <text x="296" y={showThreshold ? 216 : 160} textAnchor="middle" fill="#334155" fontSize="16">{labels.axis}</text>
        </g>
        {stage >= 11 && stage <= 14 && <>
          <path d={`M${x(4)},78v30 M${x(thresholdPosition)},78v20 M${x(8)},78v30`} stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={x(4)} cy="119" r="7" fill={blue} />
          <circle cx={x(8)} cy="119" r="7" fill={red} />
          <circle cx={x(4)} cy="119" r="11" stroke={blue} strokeWidth="2" fill="none" />
          <circle cx={x(8)} cy="119" r="11" stroke={red} strokeWidth="2" fill="none" />
          <path d={`M${x(4)},64v12 M${x(4)},70H${x(thresholdPosition)} M${x(thresholdPosition)},64v12`} stroke={blue} strokeWidth={stage === 13 ? 1.5 : 3} opacity={stage === 13 ? 0.25 : 1} fill="none" />
          <path d={`M${x(thresholdPosition)},64v12 M${x(thresholdPosition)},70H${x(8)} M${x(8)},64v12`} stroke={red} strokeWidth={stage === 12 ? 1.5 : 3} opacity={stage === 12 ? 0.25 : 1} fill="none" />
          {stage !== 13 && stage !== 14 && <text x={x((4 + thresholdPosition) / 2)} y="48" textAnchor="middle" fill={blue} fontSize="16" fontWeight="700">{labels.margin}</text>}
          {stage !== 12 && stage !== 14 && <text x={x((thresholdPosition + 8) / 2)} y="48" textAnchor="middle" fill={red} fontSize="16" fontWeight="700">{labels.margin}</text>}
          {stage === 14 && <text x={x(6)} y="48" textAnchor="middle" fill="#172A43" fontSize="16" fontWeight="700">{labels.margin}</text>}
          {(stage === 12 || stage === 13) && <>
            <path d={`M${x(6)},98v45`} stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
            <path d={`M${x(6)},22H${x(thresholdPosition)} l${stage === 12 ? 6 : -6},-4 M${x(thresholdPosition)},22 l${stage === 12 ? 6 : -6},4`} stroke="#172A43" strokeWidth="1.5" fill="none" />
          </>}
        </>}
        {stage === 16 && <>
          <path d={`M${x(7.4)},64v12 M${x(7.4)},70H${x(7.7)} M${x(7.7)},64v12 M${x(7.7)},70H${x(8)} M${x(8)},64v12`} stroke="#172A43" strokeWidth="2" fill="none" />
          <text x={x(7.7)} y="195" textAnchor="middle" fill="#172A43" fontSize="15" fontWeight="700">{labels.margin}</text>
          <path d={`M${x(6)},98v45`} stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
        </>}
        {showThreshold && <>
          {stage === 7 && <rect x={x(5) - 9} y="90" width="18" height="60" rx="5" fill={blue} opacity="0.12" />}
          <path d={`M${x(thresholdPosition)},98v45`} stroke={stage === 7 ? blue : '#172A43'} strokeWidth={stage === 7 ? 3 : 2} strokeDasharray={stage === 7 ? undefined : '4 3'} />
          <text x={x(thresholdPosition)} y="165" textAnchor="middle" fill={stage === 7 ? blue : '#172A43'} fontWeight={stage === 7 ? 700 : undefined} fontSize="15">{labels.thresholds}</text>
        </>}
      </svg>
    </figure>
  );
}

export function SvmTwoDimensionalBoundary({
  showBoundary = false,
  mode,
  description,
  labels,
}: {
  showBoundary?: boolean;
  mode?: 'margin-points' | 'margin-band' | 'outside-margin' | 'inside-margin' | 'summary';
  description: string;
  labels: { mass: string; height: string; normal: string; obese: string; boundary?: string; margin?: string; supportVectors?: string };
}) {
  const clipId = useId();
  const hasBoundary = showBoundary || mode !== undefined;
  const bandVisible = mode !== undefined && mode !== 'margin-points';
  const slope = 0.32;
  const intercept = 269.66;
  const marginOffset = 9.54;
  const boundaryY = (px: number) => intercept - slope * px;
  const linePath = (offset = 0) => `M72,${boundaryY(72) + offset}L445,${boundaryY(445) + offset}`;
  const normalPoints = [[268, 224], [292, 222], [314, 216], [332, 207], [347, 191], [358, 176], [360, 164]];
  const obesePoints = [[90, 213], [110, 212], [132, 210], [158, 197], [366, 143], [378, 100], [390, 67], [406, 38]];
  // These labeled exceptions lie within the band, on the wrong side of the line.
  if (mode) {
    normalPoints.push([240, 187]);
    obesePoints.push([285, 184]);
  }

  function point(px: number, py: number, normal: boolean) {
    const signedDistance = py - boundaryY(px);
    const outside = Math.abs(signedDistance) > marginOffset + 0.01;
    const onMargin = Math.abs(Math.abs(signedDistance) - marginOffset) < 0.01;
    const misclassified = normal ? signedDistance < 0 : signedDistance > 0;
    const selected = mode === 'margin-points' ? onMargin
      : mode === 'summary' ? !outside
      : mode === 'outside-margin' ? outside
      : mode === 'inside-margin' ? !outside && misclassified
      : false;
    const dimmed = (mode === 'margin-points' || mode === 'outside-margin' || mode === 'inside-margin' || mode === 'summary') && !selected;
    const color = normal ? blue : red;
    return (
      <g key={`${normal}-${px}-${py}`} opacity={dimmed ? 0.2 : 1}>
        <circle cx={px} cy={py} r="6.5" fill={color} stroke="#172A43" strokeWidth="1" />
        {selected && <circle cx={px} cy={py} r="10" fill="none" stroke={color} strokeWidth="2" />}
        {mode === 'inside-margin' && selected && <path d={`M${px - 9},${py - 10}l18,20 M${px + 9},${py - 10}l-18,20`} stroke="#172A43" strokeWidth="1.5" />}
      </g>
    );
  }

  return (
    <figure className={cx('my-6 rounded-xl border px-4 py-5 sm:px-5', theme.semantic.neutral.border, theme.semantic.neutral.surface)}>
      <svg viewBox="0 0 480 300" className="mx-auto w-full max-w-[560px]" role="img" aria-label={description}>
        <defs><clipPath id={clipId}><rect x="72" y="24" width="373" height="226" /></clipPath></defs>
        {hasBoundary && <g clipPath={`url(#${clipId})`}>
          <path d={`M72,24H445V${boundaryY(445)}L72,${boundaryY(72)}Z`} fill={red} opacity="0.06" />
          <path d={`M72,${boundaryY(72)}L445,${boundaryY(445)}V250H72Z`} fill={blue} opacity="0.06" />
          {bandVisible && <>
            <path d={`M72,${boundaryY(72) - marginOffset}L445,${boundaryY(445) - marginOffset}L445,${boundaryY(445) + marginOffset}L72,${boundaryY(72) + marginOffset}Z`} fill="#B8C8DA" opacity="0.5" />
            <path d={linePath(marginOffset)} stroke={blue} strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
            <path d={linePath(-marginOffset)} stroke={red} strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
          </>}
          <path d={linePath()} stroke="#172A43" strokeWidth="2.5" />
        </g>}
        {hasBoundary && <>
          <text x="250" y="112" textAnchor="middle" fill="#172A43" fontSize="15" fontWeight="600">{labels.boundary}</text>
          <path d="M250,120L270,180" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" />
        </>}
        <path d="M72,24V250H450 M68,30l4,-6 4,6 M444,246l6,4 -6,4" stroke="#64748B" strokeWidth="1.5" fill="none" />
        {[137, 202, 267, 332, 397].map((px) => <path key={px} d={`M${px},246v8`} stroke="#64748B" />)}
        {[50, 100, 150, 200].map((py) => <path key={py} d={`M68,${py}h8`} stroke="#64748B" />)}
        {normalPoints.map(([px, py]) => point(px, py, true))}
        {obesePoints.map(([px, py]) => point(px, py, false))}
        {(mode === 'margin-points' || mode === 'summary') && <>
          {[[360, 164], [366, 143]].map(([px, py]) => {
            const delta = (slope * px + py - intercept) / (1 + slope * slope);
            const projectedX = px - slope * delta;
            const projectedY = py - delta;
            return <path key={px} d={`M${px},${py}L${projectedX},${projectedY}`} stroke="#172A43" strokeWidth="3" />;
          })}
          <text x="420" y="183" textAnchor="middle" fill="#172A43" fontSize="15" fontWeight="600">{labels.margin}</text>
          <path d="M403,173L363,158" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" />
        </>}
        <text x="260" y="284" textAnchor="middle" fill="#334155" fontSize="16">{labels.mass}</text>
        <text x="26" y="137" transform="rotate(-90 26 137)" textAnchor="middle" fill="#334155" fontSize="16">{labels.height}</text>
      </svg>
      <figcaption className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#334155]">
        <span className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#205089]" />{labels.normal}</span>
        <span className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#9F3450]" />{labels.obese}</span>
        {mode === 'summary' && <span className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full border-2 border-[#172A43]" />{labels.supportVectors}</span>}
      </figcaption>
    </figure>
  );
}

export function SvmThreeDimensionalBoundary({
  showPlane = false,
  planeOnly = false,
  equationLabel,
  description,
  labels,
}: {
  showPlane?: boolean;
  planeOnly?: boolean;
  equationLabel?: string;
  description: string;
  labels: { mass: string; height: string; length: string; classA: string; classB: string; plane?: string };
}) {
  // An oblique view keeps the vertical axis upright and separates the floor axes.
  // Keep the same coordinates in both figures; the separator is z = 1.15.
  const project = (px: number, py: number, pz: number) => [100 + 90 * px + 38 * py, 320 - 15 * px - 62 * py - 68 * pz];
  const path = (coordinates: number[][]) => coordinates.map(([px, py, pz], index) => `${index === 0 ? 'M' : 'L'}${project(px, py, pz).join(',')}`).join(' ');
  const classA = [[0.6, 0.2, 1.9], [1.2, 0.4, 2], [1.8, 0.9, 1.7], [2.2, 1.2, 1.65], [1, 1.7, 1.8]];
  const classB = [[0.5, 0.2, 0.45], [1.1, 0.4, 0.65], [1.5, 0.9, 0.5], [2.1, 1.4, 0.7], [0.8, 1.8, 0.4]];
  const planeCorners = [[0, 0, 1.15], [2.7, 0, 1.15], [2.7, 2.5, 1.15], [0, 2.5, 1.15]];

  function points(coordinates: number[][], color: string) {
    return coordinates.map(([px, py, pz]) => {
      const [sx, sy] = project(px, py, pz);
      const [onPlaneX, onPlaneY] = project(px, py, 1.15);
      return (
        <g key={`${px}-${py}-${pz}`}>
          {showPlane && <path d={`M${sx},${sy}L${onPlaneX},${onPlaneY}`} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.55" />}
          <circle cx={sx} cy={sy} r="7" fill={color} stroke="#172A43" strokeWidth="1" />
        </g>
      );
    });
  }

  return (
    <figure className={cx('my-6 rounded-xl border px-4 py-5 sm:px-5', theme.semantic.neutral.border, theme.semantic.neutral.surface)}>
      <svg viewBox="0 0 520 390" className="mx-auto w-full max-w-[560px]" role="img" aria-label={description}>
        {[0.5, 1, 1.5, 2].map((value) => (
          <g key={value} stroke="#B8C8DA" strokeWidth="1" opacity="0.5">
            <path d={path([[value, 0, 0], [value, 2.5, 0]])} />
            <path d={path([[0, value, 0], [2.7, value, 0]])} />
          </g>
        ))}
        <g stroke="#64748B" strokeWidth="1.5" fill="none">
          <path d={path([[0, 0, 0], [3, 0, 0]])} />
          <path d={path([[0, 0, 0], [0, 2.8, 0]])} />
          <path d={path([[0, 0, 0], [0, 0, 3.4]])} />
        </g>
        {!planeOnly && points(classB, red)}
        {showPlane && <path d={`${path(planeCorners)}Z`} fill="#B8C8DA" fillOpacity="0.5" stroke="#205089" strokeWidth="1.5" />}
        {!planeOnly && points(classA, blue)}
        <text x="376" y="303" textAnchor="middle" fill="#334155" fontSize="15">{labels.mass}</text>
        <text x="175" y="126" textAnchor="middle" fill="#334155" fontSize="15">{labels.height}</text>
        <text x="68" y="200" transform="rotate(-90 68 200)" textAnchor="middle" fill="#334155" fontSize="15">{labels.length}</text>
        {planeOnly && equationLabel && <foreignObject x="180" y="345" width="330" height="35"><div className="text-sm text-[#172A43]"><InlineMath formula={equationLabel} /></div></foreignObject>}
        {showPlane && !planeOnly && <>
          <text x="320" y="365" textAnchor="middle" fill="#172A43" fontSize="15" fontWeight="600">{labels.plane}</text>
          <path d="M320,348L373,152" stroke="#64748B" strokeWidth="1" strokeDasharray="3 3" />
        </>}
      </svg>
      {!planeOnly && <figcaption className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#334155]">
        <span className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#205089]" />{labels.classA}</span>
        <span className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#9F3450]" />{labels.classB}</span>
      </figcaption>}
    </figure>
  );
}

export function SvmKernelMotivation({ mapped = false, showBoundary = false, sampleDosage, description, labels }: {
  mapped?: boolean;
  showBoundary?: boolean;
  sampleDosage?: number;
  description: string;
  labels: { classA: string; classB: string; axis: string; squaredAxis?: string; boundary?: string; sample?: string };
}) {
  const classA = [65, 96, 128, 172, 344, 376, 408];
  const classB = [214, 232, 250, 268, 286, 304];
  // The same positive dosage values are used in the original and lifted views.
  const dosage = (position: number) => (position - 36) / 36;
  const project = (value: number) => [72 + value * 34.2, 245 - value * value * 1.8];
  const samplePosition = sampleDosage === undefined ? undefined : mapped ? project(sampleDosage) : [36 + sampleDosage * 36, 75];
  const parabola = Array.from({ length: 55 }, (_, index) => {
    const [px, py] = project(index * 0.2);
    return `${index === 0 ? 'M' : 'L'}${px},${py}`;
  }).join(' ');

  function points(positions: number[], color: string) {
    return positions.map((position) => {
      const [px, py] = mapped ? project(dosage(position)) : [position, 75];
      return <circle key={position} cx={px} cy={py} r="7" fill={color} stroke="#172A43" strokeWidth="1" />;
    });
  }

  return (
    <figure className={cx('my-6 rounded-xl border px-4 py-5 sm:px-5', theme.semantic.neutral.border, theme.semantic.neutral.surface)}>
      <svg viewBox={`0 0 480 ${mapped ? 305 : 155}`} className="mx-auto w-full max-w-[640px]" role="img" aria-label={description}>
        {mapped ? <>
          <path d="M72,30V245H452 M68,36l4,-6 4,6 M446,241l6,4 -6,4" stroke="#64748B" strokeWidth="1.5" fill="none" />
          <path d={parabola} stroke="#B8C8DA" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
          {showBoundary && <path d="M169.08,245L452,60.36" stroke="#334155" strokeWidth="2" fill="none" />}
          {[140, 209, 277, 346, 414].map((px) => <path key={px} d={`M${px},241v8`} stroke="#B8C8DA" />)}
          {[65, 110, 155, 200].map((py) => <path key={py} d={`M68,${py}h8`} stroke="#B8C8DA" />)}
          <text x="260" y="285" textAnchor="middle" fill="#334155" fontSize="16">{labels.axis}</text>
          <text x="27" y="140" transform="rotate(-90 27 140)" textAnchor="middle" fill="#334155" fontSize="16">{labels.squaredAxis}</text>
        </> : <>
          <path d="M36,75H452 M446,71l6,4 -6,4" stroke="#64748B" strokeWidth="1.5" fill="none" />
          {[72, 132, 192, 252, 312, 372, 432].map((px) => <path key={px} d={`M${px},70v10`} stroke="#B8C8DA" strokeWidth="1" />)}
          <text x="244" y="127" textAnchor="middle" fill="#334155" fontSize="16">{labels.axis}</text>
        </>}
        <g opacity={samplePosition ? 0.3 : 1}>
          {points(classA, red)}
          {points(classB, blue)}
        </g>
        {samplePosition && <>
          {mapped ? <>
            <path d={`M72,${samplePosition[1]}H${samplePosition[0]}V245`} stroke="#64748B" strokeDasharray="4 4" fill="none" />
            <text x="61" y={samplePosition[1] + 5} textAnchor="end" fill="#334155" fontSize="13">{sampleDosage! ** 2}</text>
            <text x={samplePosition[0]} y="263" textAnchor="middle" fill="#334155" fontSize="13">{sampleDosage}</text>
            <path d={`M${samplePosition[0] + 8},${samplePosition[1] + 8}l22,22`} stroke="#64748B" fill="none" />
            <text x={samplePosition[0] + 35} y={samplePosition[1] + 43} textAnchor="middle" fill="#334155" fontSize="13">{labels.sample} · ({sampleDosage}, {sampleDosage! ** 2})</text>
          </> : <>
            <path d={`M${samplePosition[0]},49V65`} stroke="#64748B" fill="none" />
            <text x={samplePosition[0]} y="42" textAnchor="middle" fill="#334155" fontSize="13">{labels.sample}</text>
            <text x={samplePosition[0]} y="101" textAnchor="middle" fill="#334155" fontSize="13">{sampleDosage}</text>
          </>}
          <circle cx={samplePosition[0]} cy={samplePosition[1]} r="8" fill={mapped && showBoundary ? (sampleDosage! ** 2 < 12.4 * sampleDosage! - 35.2 ? blue : red) : '#94A3B8'} stroke="#172A43" strokeWidth="2" />
        </>}
      </svg>
      <figcaption className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#334155]">
        <span className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#9F3450]" />{labels.classA}</span>
        <span className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#205089]" />{labels.classB}</span>
        {mapped && showBoundary && <span className="flex items-center gap-2"><span aria-hidden="true" className="w-5 border-t-2 border-[#334155]" />{labels.boundary}</span>}
      </figcaption>
    </figure>
  );
}

export function SvmKernelChoiceIllustration({ kernel, description }: {
  kernel: 'linear' | 'poly' | 'rbf';
  description: string;
}) {
  const examples = {
    linear: {
      boundary: 'M180,35V175',
      normal: [[85,70], [120,100], [90,145], [145,150], [135,55]],
      other: [[215,65], [270,55], [240,105], [285,140], [210,155]],
    },
    poly: {
      boundary: 'M55,156.875Q180,63.125 305,156.875',
      normal: [[100,160], [145,145], [185,155], [230,145], [265,165]],
      other: [[90,90], [140,65], [185,70], [235,75], [275,105]],
    },
    rbf: {
      boundary: 'M238,105A58,58 0 1,0 122,105A58,58 0 1,0 238,105',
      normal: [[155,85], [190,75], [180,110], [150,130], [210,130]],
      other: [[95,65], [180,30], [265,70], [270,145], [180,180], [90,150]],
    },
  };
  const example = examples[kernel];
  return <figure className={cx('my-4 rounded-xl border px-4 py-3', theme.semantic.neutral.border, theme.semantic.neutral.surface)}>
    <svg viewBox="0 0 360 220" className="mx-auto w-full max-w-[400px]" role="img" aria-label={description}>
      <path d="M40,25V195H325" stroke="#B8C8DA" strokeWidth="1.5" fill="none" />
      <path d={example.boundary} stroke="#334155" strokeWidth="2" fill="none" />
      {example.normal.map(([px, py], index) => <circle key={`blue-${index}`} cx={px} cy={py} r="6" fill={blue} stroke="#172A43" />)}
      {example.other.map(([px, py], index) => <circle key={`red-${index}`} cx={px} cy={py} r="6" fill={red} stroke="#172A43" />)}
    </svg>
  </figure>;
}

export function SvmHyperplaneMathIllustration({ lineOnly = false, lineLabel = 'x_2=ax_1+b', axisLabels = ['x_1', 'x_2'], showNormal = false, showScores = false, showEquation = false, showClassRule = false, slope = 1, intercept = -1, description }: {
  lineOnly?: boolean;
  lineLabel?: string;
  axisLabels?: [string, string];
  showNormal?: boolean;
  showScores?: boolean;
  showEquation?: boolean;
  showClassRule?: boolean;
  slope?: number;
  intercept?: number;
  description: string;
}) {
  const clipId = useId();
  const positive = [[2, 0.3], [3, 1], [4, 1.7], [5, 2.5], [6, 3.2]];
  const negative = [[1, 1], [1, 2], [1.8, 2.5], [3, 3], [4, 4], [5, 4.3]];
  const project = ([px, py]: number[]) => [72 + px * 50, 255 - py * 50];
  const [lineStartX, lineStartY] = project([0, intercept]);
  const [lineEndX, lineEndY] = project([7.16, slope * 7.16 + intercept]);
  const [normalStartX, normalStartY] = project([3.6, slope * 3.6 + intercept]);
  function points(coordinates: number[][], color: string) {
    return coordinates.filter((point) => !showEquation || (point[0] === 3 && point[1] === 1) || (point[0] === 1 && point[1] === 2)).map((point) => {
      const [px, py] = project(point);
      const selected = showScores && ((point[0] === 3 && point[1] === 1) || (point[0] === 1 && point[1] === 2));
      return <g key={point.join(',')} opacity={showScores && !selected ? 0.25 : 1}>
        <circle cx={px} cy={py} r="6.5" fill={color} stroke="#172A43" />
        {selected && <circle cx={px} cy={py} r="10" fill="none" stroke={color} strokeWidth="2" />}
      </g>;
    });
  }
  return <figure className={cx('my-6 rounded-xl border px-4 py-5 sm:px-5', theme.semantic.neutral.border, theme.semantic.neutral.surface)}>
    <svg viewBox="0 0 480 315" className="mx-auto w-full max-w-[560px]" role="img" aria-label={description}>
      <defs><clipPath id={clipId}><rect x="72" y="30" width="358" height="225" /></clipPath></defs>
      {(showScores || showEquation) && <>
        <path d="M72,30H347L122,255H72Z" fill={red} opacity="0.06" />
        <path d="M347,30H430V255H122Z" fill={blue} opacity="0.06" />
      </>}
      {showEquation && <>
        <foreignObject x="230" y="3" width="245" height="35"><div className="text-sm text-[#172A43]"><InlineMath formula="H:\ f(x)=0" /></div></foreignObject>
        <path d={`M260,35L${normalStartX},${normalStartY}`} stroke="#64748B" strokeWidth="1.3" strokeDasharray="4 3" fill="none" />
      </>}
      <path d="M72,30V255H430" stroke="#64748B" strokeWidth="1.5" fill="none" />
      <path d={`M${lineStartX},${lineStartY}L${lineEndX},${lineEndY}`} clipPath={`url(#${clipId})`} stroke="#172A43" strokeWidth="2.5" />
      {!lineOnly && points(positive, blue)}
      {!lineOnly && points(negative, red)}
      {lineOnly && <foreignObject x={showNormal ? 250 : 260} y={showNormal ? 215 : 145} width={showNormal ? 220 : 210} height="35"><div className="text-sm text-[#172A43]"><InlineMath formula={lineLabel} /></div></foreignObject>}
      {showNormal && (() => {
        const length = Math.hypot(slope, 1);
        const nx = 70 * slope / length;
        const ny = 70 / length;
        const tx = 10 / length;
        const ty = -10 * slope / length;
        const rx = 10 * slope / length;
        const ry = 10 / length;
        const endX = normalStartX + nx;
        const endY = normalStartY + ny;
        return <g>
          <path d={`M${normalStartX},${normalStartY}L${endX},${endY}`} stroke="#205089" strokeWidth="2.5" />
          <path d={`M${endX - 10 * slope / length + 5 / length},${endY - 10 / length - 5 * slope / length}L${endX},${endY}L${endX - 10 * slope / length - 5 / length},${endY - 10 / length + 5 * slope / length}`} fill="none" stroke="#205089" strokeWidth="2.5" />
          <path d={`M${normalStartX + tx},${normalStartY + ty}l${rx},${ry}l${-tx},${-ty}`} fill="none" stroke="#64748B" strokeWidth="1.5" />
          <foreignObject x={endX + 12} y={endY - 10} width="70" height="35"><div className="text-[#205089]"><InlineMath formula="w" /></div></foreignObject>
        </g>;
      })()}
      <foreignObject x="235" y="275" width="50" height="35"><div className="text-center text-[#334155]"><InlineMath formula={axisLabels[0]} /></div></foreignObject>
      <foreignObject x="26" y="125" width="40" height="35"><div className="text-center text-[#334155]"><InlineMath formula={axisLabels[1]} /></div></foreignObject>
      {!lineOnly && <>
        <foreignObject x={showClassRule ? 245 : showEquation ? 285 : 360} y="165" width={showClassRule ? 225 : showEquation ? 145 : 55} height="35"><div className="text-center text-sm text-[#205089]"><InlineMath formula={showClassRule ? 'f(x)\\geq0\\;\\Rightarrow\\;\\hat y=+1' : showEquation ? 'f(x)>0' : '+1'} /></div></foreignObject>
        <foreignObject x={showClassRule ? 80 : showEquation ? 95 : 135} y="45" width={showClassRule ? 225 : showEquation ? 145 : 55} height="35"><div className="text-center text-sm text-[#9F3450]"><InlineMath formula={showClassRule ? 'f(x)<0\\;\\Rightarrow\\;\\hat y=-1' : showEquation ? 'f(x)<0' : '-1'} /></div></foreignObject>
      </>}
      {showScores && <>
        <foreignObject x="235" y="217" width="180" height="30"><div className="text-[#205089]"><InlineMath formula="f(3,1)=1" /></div></foreignObject>
        <foreignObject x="90" y="100" width="180" height="30"><div className="text-[#9F3450]"><InlineMath formula="f(1,2)=-2" /></div></foreignObject>
      </>}
    </svg>
  </figure>;
}

export function SvmOptimizationIllustration({ mode = 'margin-boundaries', marginStage = 'boundaries', slack = 0, description }: {
  mode?: 'margin-boundaries' | 'soft-case';
  marginStage?: 'boundaries' | 'constraints' | 'segment' | 'direction';
  slack?: 0 | 0.5 | 1.5;
  description: string;
}) {
  const math = (formula: string, px: number, py: number, width = 140, color = '#172A43') =>
    <foreignObject x={px} y={py} width={width} height="32"><div className="text-sm" style={{ color }}><InlineMath formula={formula} /></div></foreignObject>;
  if (mode === 'soft-case') {
    const score = slack === 0 ? 1.5 : 1 - slack;
    const pointY = 180 - score * 80;
    const thresholdY = 180 - (1 - slack) * 80;
    return <figure className={cx('my-6 rounded-xl border px-4 py-5', theme.semantic.neutral.border, theme.semantic.neutral.surface)}>
      <svg viewBox="0 0 480 335" className="mx-auto w-full max-w-[620px]" role="img" aria-label={description}>
        <rect x="55" y="100" width="355" height="160" fill="#EFF3F8" />
        <g opacity="0.22">
          <path d="M55,100H410M55,260H410" stroke="#205089" strokeWidth="2" strokeDasharray="7 5" />
          {math('f(x)=+1', 65, 64, 130)}
          {math('f(x)=-1', 65, 265, 130)}
        </g>
        <g opacity="0.3">
          <path d="M55,180H410" stroke="#172A43" strokeWidth="2" />
          {math('f(x)=0', 65, 145, 130)}
        </g>
        <path d={`M55,${thresholdY}H410`} stroke="#205089" strokeWidth="2.5" strokeDasharray="4 4" />
        <circle cx="310" cy={pointY} r="11" fill="none" stroke={slack > 1 ? red : blue} strokeWidth="2" />
        <circle cx="310" cy={pointY} r="6" fill={blue} stroke="#172A43" />
        {math(`f(x_i)=${score}`, 330, pointY - 33, 145, blue)}
        {math('y_i=+1', 330, pointY + 8, 120, blue)}
        {math(`\\xi_i=${slack},\\quad 1-\\xi_i=${1 - slack}`, 95, 301, 330, blue)}
      </svg>
    </figure>;
  }
  return <figure className={cx('my-6 rounded-xl border px-4 py-5', theme.semantic.neutral.border, theme.semantic.neutral.surface)}>
    <svg viewBox="0 0 480 290" className="mx-auto w-full max-w-[620px]" role="img" aria-label={description}>
      <rect x="55" y="65" width="350" height="160" fill="#EFF3F8" opacity={marginStage === 'boundaries' || marginStage === 'constraints' ? 1 : 0.35} />
      <g opacity={marginStage === 'boundaries' || marginStage === 'constraints' ? 1 : 0.2}>
        <path d="M55,65H405" stroke={blue} strokeWidth="2" strokeDasharray="7 5" />
        <path d="M55,225H405" stroke={red} strokeWidth="2" strokeDasharray="7 5" />
        {math('w^\\top x+b=+1', 70, 27, 230, blue)}
        {math('w^\\top x+b=-1', 70, 240, 230, red)}
      </g>
      <g opacity="0.2">
        <path d="M55,145H405" stroke="#172A43" strokeWidth="2.5" />
        {math('w^\\top x+b=0', 70, 107, 230)}
      </g>
      {marginStage === 'constraints' && <>
        {[ [330, 35], [380, 40], [355, 65] ].map(([px, py]) => <circle key={`${px}-${py}`} cx={px} cy={py} r="6" fill={blue} stroke="#172A43" />)}
        {[ [330, 253], [380, 260], [355, 225] ].map(([px, py]) => <circle key={`${px}-${py}`} cx={px} cy={py} r="6" fill={red} stroke="#172A43" />)}
        <text x="230" y="176" textAnchor="middle" fill="#205089" fontSize="14">Không có điểm dữ liệu</text>
      </>}
      {(marginStage === 'segment' || marginStage === 'direction') && <>
        <path d={marginStage === 'direction' ? 'M290,225V65M284,75L290,65L296,75' : 'M290,225V65'} fill="none" stroke="#205089" strokeWidth="2.5" />
        <g opacity={marginStage === 'segment' ? 1 : 0.25}>
          <path d="M280,65V75H290M280,225V215H290" fill="none" stroke="#64748B" strokeWidth="1.5" />
          <circle cx="290" cy="65" r="6" fill={blue} stroke="#172A43" />
          <circle cx="290" cy="225" r="6" fill={red} stroke="#172A43" />
          {math('x_+', 301, 35, 50, blue)}
          {math('x_-', 301, 226, 50, red)}
        </g>
      </>}
      {marginStage === 'direction' && <>
        {math('x_+-x_-', 185, 175, 100, blue)}
        <path d="M430,200V100M424,110L430,100L436,110" fill="none" stroke="#205089" strokeWidth="2.5" />
        {math('\\frac{w}{\\lVert w\\rVert}', 420, 205, 60, blue)}
      </>}
      {marginStage === 'segment' && <>
        <path d="M350,65V225M344,73L350,65L356,73M344,217L350,225L356,217" fill="none" stroke="#205089" strokeWidth="2" />
        <rect x="317" y="129" width="66" height="32" fill="#EFF3F8" />
        {math('\\text{width}', 323, 130, 75, blue)}
      </>}
    </svg>
  </figure>;
}

export function PerceptronStateIllustration({ samples, sampleLabels, weight = [0, 0], bias = 0, description }: {
  samples: [number, number][];
  sampleLabels?: (1 | -1)[];
  weight?: [number, number];
  bias?: number;
  description: string;
}) {
  const clipId = useId();
  const project = (x: number, y: number) => [225 + 45 * x, 235 - 45 * y];
  const hasBoundary = weight[0] !== 0 || weight[1] !== 0;
  const boundary = !hasBoundary ? null : weight[1] !== 0
    ? [project(-3, (3 * weight[0] - bias) / weight[1]), project(3, (-3 * weight[0] - bias) / weight[1])]
    : [project(-bias / weight[0], -2), project(-bias / weight[0], 4)];
  return <figure className={cx('my-6 rounded-xl border px-4 py-5 sm:px-5', theme.semantic.neutral.border, theme.semantic.neutral.surface)}>
    <svg viewBox="0 0 450 375" className="mx-auto w-full max-w-[560px]" role="img" aria-label={description}>
      <defs><clipPath id={clipId}><rect x="90" y="55" width="270" height="270" /></clipPath></defs>
      <path d="M90,235H360 M225,55V325" fill="none" stroke="#B8C8DA" strokeWidth="1.5" />
      {[-2, -1, 1, 2].map((value) => <g key={`x-${value}`}>
        <path d={`M${225 + 45 * value},231v8`} stroke="#B8C8DA" />
        <foreignObject x={212 + 45 * value} y="244" width="26" height="28"><div className="text-center text-xs text-[#64748B]"><InlineMath formula={`${value}`} /></div></foreignObject>
      </g>)}
      {[-1, 1, 2, 3].map((value) => <g key={`y-${value}`}>
        <path d={`M221,${235 - 45 * value}h8`} stroke="#B8C8DA" />
        <foreignObject x="194" y={222 - 45 * value} width="22" height="28"><div className="text-center text-xs text-[#64748B]"><InlineMath formula={`${value}`} /></div></foreignObject>
      </g>)}
      <foreignObject x="371" y="220" width="45" height="32"><div className="text-[#334155]"><InlineMath formula="x_1" /></div></foreignObject>
      <foreignObject x="214" y="15" width="45" height="32"><div className="text-[#334155]"><InlineMath formula="x_2" /></div></foreignObject>
      {boundary && <path d={`M${boundary[0].join(',')}L${boundary[1].join(',')}`} clipPath={`url(#${clipId})`} stroke="#205089" strokeWidth="2.5" />}
      {samples.map(([x, y], index) => {
        const [px, py] = project(x, y);
        const color = sampleLabels?.[index] === 1 ? blue : sampleLabels?.[index] === -1 ? red : '#94A3B8';
        return <g key={`${x}-${y}-${index}`}>
          <circle cx={px} cy={py} r="7" fill={color} stroke="#64748B" strokeWidth="1.5" />
          <foreignObject x={x < 0 ? px - 32 : px + 12} y={py - 16} width="26" height="30"><div className="text-sm text-[#334155]"><InlineMath formula={`${index + 1}`} /></div></foreignObject>
        </g>;
      })}
    </svg>
  </figure>;
}

export const fundamentalsMdxComponents = {
  PerceptronStateIllustration,
  SvmOptimizationIllustration,
  PerceptronExercise,
  VectorPlane: linearAlgebraMdxComponents.VectorPlane,
  DotProductPlane: linearAlgebraMdxComponents.DotProductPlane,
  DotProductCoordinateDiagram: linearAlgebraMdxComponents.DotProductCoordinateDiagram,
  SvmThresholdMotivation,
  SvmTwoDimensionalBoundary,
  SvmThreeDimensionalBoundary,
  SvmKernelMotivation,
  SvmKernelChoiceIllustration,
  SvmHyperplaneMathIllustration,
} satisfies Record<(typeof FUNDAMENTALS_MDX_COMPONENT_NAMES)[number], LearningMdxComponent>;

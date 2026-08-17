import { lazy, Suspense } from 'react';
import type { LayoutNode } from '../../../../lib/irTypes';
import { getStrings } from '../../../../lib/localization';
import { CV_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import {
  useLearningMdxLesson,
  useLearningMdxTheme,
  type LearningMdxComponent,
} from '../../learningMdxComponents';
import { cx } from '../../theme';

const ShapeExercise = lazy(() => import('../../../exercises/ShapeExercise').then((module) => ({ default: module.ShapeExercise })));
const ValueExercise = lazy(() => import('../../../exercises/ValueExercise').then((module) => ({ default: module.ValueExercise })));
const ConvExercise = lazy(() => import('../../../exercises/ConvExercise').then((module) => ({ default: module.ConvExercise })));

type CvExerciseFixture = {
  opType: 'Conv2d' | 'MaxPool2d' | 'AvgPool2d';
  inputShape: number[];
  outputShape: number[];
  config?: {
    kernel?: number | [number, number];
    stride?: number | [number, number];
    padding?: number | [number, number];
    dilation?: number | [number, number];
  };
};

function CvExercise({ fixture }: { fixture: CvExerciseFixture }) {
  const { entryPoints, language, lessonId } = useLearningMdxLesson();
  const themeClasses = useLearningMdxTheme();
  const entryPoint = entryPoints.find((item) => item.kind === 'torchviz-exercise');
  if (!entryPoint) throw new Error(`CV exercise lesson ${lessonId} is missing its TorchViz entry point.`);
  const node = materializeExerciseNode(lessonId, fixture);
  const labels = getStrings(language).canvas.demo;
  const theme = themeClasses.isLight ? 'light' : 'dark';

  return (
    <div className={cx('learning-exercise-surface', themeClasses.isLight && 'learning-exercise-surface-light')}>
      <Suspense fallback={<div className={cx('min-h-40 animate-pulse rounded-lg border', themeClasses.surface.unavailable)} />}>
        {entryPoint.exerciseId === 'shape-output' ? (
          <ShapeExercise key={lessonId} isOpen exerciseId="shape-output" node={node} t={labels} language={language} theme={theme} displayMode="inline" />
        ) : entryPoint.exerciseId === 'pool-value' ? (
          <ValueExercise key={lessonId} isOpen exerciseId="pool-value" node={node} t={labels} language={language} theme={theme} displayMode="inline" />
        ) : entryPoint.exerciseId === 'conv-value' ? (
          <ConvExercise key={lessonId} isOpen t={labels} displayMode="inline" />
        ) : null}
      </Suspense>
    </div>
  );
}

function materializeExerciseNode(lessonId: string, fixture: CvExerciseFixture): LayoutNode {
  return {
    id: `learning-${lessonId}`,
    name: fixture.opType,
    op_type: fixture.opType,
    in_shape: fixture.inputShape,
    out_shape: fixture.outputShape,
    params: 0,
    meta: fixture.config ?? {},
    x: 0,
    y: 0,
    z: 0,
    width: 1,
    height: 1,
    depth: 1,
    color: '#205089',
  };
}

export const cvMdxComponents = {
  CvExercise,
} satisfies Record<typeof CV_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;

import type { EVOLUTIONARY_ALGORITHMS_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import { createLazyLearningVisual } from '../../lazyLearningVisual';
import type { LearningMdxComponent } from '../../learningMdxComponents';

const lazyNamed = createLazyLearningVisual('Đang tải trực quan hóa thuật toán tiến hóa...');

const loadVisualizers = () => import('./landscapeVisualizers');

export const eaMdxComponents = {
  LocalMinimaTrapExplorer: lazyNamed(loadVisualizers, 'LocalMinimaTrapExplorer'),
  GradientFailureModesVisualizer: lazyNamed(loadVisualizers, 'GradientFailureModesVisualizer'),
  ZeroOrderSamplingVisualizer: lazyNamed(loadVisualizers, 'ZeroOrderSamplingVisualizer'),
  BlackBoxFunctionVisualizer: lazyNamed(loadVisualizers, 'BlackBoxFunctionVisualizer'),
  LossToFitnessVisualizer: lazyNamed(loadVisualizers, 'LossToFitnessVisualizer'),
} as const satisfies Record<(typeof EVOLUTIONARY_ALGORITHMS_MDX_COMPONENT_NAMES)[number], LearningMdxComponent>;

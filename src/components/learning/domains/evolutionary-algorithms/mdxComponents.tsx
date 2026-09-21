import { lazy, Suspense, type ComponentProps, type ComponentType } from 'react';
import type { EVOLUTIONARY_ALGORITHMS_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import { useLearningMdxTheme, type LearningMdxComponent } from '../../learningMdxComponents';
import { cx } from '../../theme';

function VisualSkeleton() {
  const themeClasses = useLearningMdxTheme();
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Đang tải trực quan hóa thuật toán tiến hóa..."
      className={cx(
        'my-6 h-64 w-full animate-pulse rounded-xl border motion-reduce:animate-none transition-colors',
        themeClasses.semantic.neutral.border,
        themeClasses.semantic.neutral.surface,
      )}
    />
  );
}

function lazyNamed<T extends Record<string, ComponentType<any>>, K extends keyof T>(
  factory: () => Promise<T>,
  name: K,
): ComponentType<ComponentProps<T[K]>> {
  const LazyComponent = lazy(() => factory().then((module) => ({ default: module[name] })));
  return function WrappedLazyNamed(props: ComponentProps<T[K]>) {
    return (
      <Suspense fallback={<VisualSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

const loadVisualizers = () => import('./landscapeVisualizers');

export const eaMdxComponents = {
  LocalMinimaTrapExplorer: lazyNamed(loadVisualizers, 'LocalMinimaTrapExplorer'),
  GradientFailureModesVisualizer: lazyNamed(loadVisualizers, 'GradientFailureModesVisualizer'),
  ZeroOrderSamplingVisualizer: lazyNamed(loadVisualizers, 'ZeroOrderSamplingVisualizer'),
  BlackBoxFunctionVisualizer: lazyNamed(loadVisualizers, 'BlackBoxFunctionVisualizer'),
  LossToFitnessVisualizer: lazyNamed(loadVisualizers, 'LossToFitnessVisualizer'),
} as const satisfies Record<(typeof EVOLUTIONARY_ALGORITHMS_MDX_COMPONENT_NAMES)[number], LearningMdxComponent>;

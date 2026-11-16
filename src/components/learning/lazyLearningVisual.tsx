import { lazy, Suspense, type ComponentProps, type ComponentType } from 'react';
import { useLearningMdxTheme, type LearningMdxComponent } from './learningMdxComponents';
import { cx } from './theme';

function VisualSkeleton({ label }: { label: string }) {
  const themeClasses = useLearningMdxTheme();
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={label}
      className={cx(
        'my-6 h-64 w-full animate-pulse rounded-xl border motion-reduce:animate-none transition-colors',
        themeClasses.semantic.neutral.border,
        themeClasses.semantic.neutral.surface,
      )}
    />
  );
}

// Create wrappers at module scope so React retains their identity across renders.
export function createLazyLearningVisual(loadingLabel: string) {
  return function lazyNamed<T extends Record<keyof T, LearningMdxComponent>, K extends keyof T>(
    factory: () => Promise<T>,
    name: K,
  ): ComponentType<ComponentProps<T[K]>> {
    const LazyComponent = lazy(() => factory().then((module) => ({ default: module[name] })));
    return function WrappedLazyNamed(props: ComponentProps<T[K]>) {
      return (
        <Suspense fallback={<VisualSkeleton label={loadingLabel} />}>
          <LazyComponent {...props} />
        </Suspense>
      );
    };
  };
}

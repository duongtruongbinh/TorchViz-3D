import { lazy, Suspense, type ComponentType, type ReactElement } from 'react';

import {
  getLearningMdxLocaleCandidates,
  parseLearningMdxPath,
  type LearningMdxMetadata,
  type LearningMdxRuntimeCapabilities,
} from '../../core/learning/mdxContract';
import type { LearningCitationEvidence, LearningCitationLinkOnlyException } from '../../core/learning/citationEvidence';
import { getRetryableCachedPromise } from '../../core/learning/retryablePromiseCache';
import type { LearningDomainId, LearningLesson } from '../../core/learning/types';
import type { Language } from '../../lib/localization';
import type { QuizQuestionState } from './lesson/QuizBlock';
import {
  LearningMdxLessonProvider,
  LearningMdxThemeProvider,
  sharedLearningMdxComponents,
  type LearningMdxComponent,
  type LearningReferencePaper,
  type LearningThemeClasses,
} from './learningMdxComponents';

const LazyLessonReferences = lazy(() => (
  import('./learningMdxReferences').then(({ LessonReferences }) => ({ default: LessonReferences }))
));

type CompiledMdxComponent = ComponentType<{ components?: Record<string, LearningMdxComponent> }>;
type MdxModule = {
  default: CompiledMdxComponent;
  lessonMetadata: LearningMdxMetadata;
  lessonRuntime: LearningMdxRuntimeCapabilities;
};

type LessonModuleDescriptor = {
  domainId: string;
  lessonId: string;
  locale: string;
  filePath: string;
};

type LearningReferenceRuntime = {
  referenceCoverage?: { courseAnalysis?: string };
  referencePapers: readonly LearningReferencePaper[];
  featuredReferenceIds: readonly string[];
  citationEvidence: readonly LearningCitationEvidence[];
  citationLinkOnlyExceptions: readonly LearningCitationLinkOnlyException[];
};

export type LoadedLearningMdxLesson = LearningReferenceRuntime & {
  domainId: LearningDomainId;
  lessonId: string;
  locale: string;
  pageCount: number;
  Content: CompiledMdxComponent;
  components: Record<string, LearningMdxComponent>;
  entryPoints: LearningLesson['entryPoints'];
};

export type LearningMdxLessonDescriptor = {
  pageCount: number;
  pages: ReactElement[];
};

const LESSON_LOADERS = import.meta.glob<MdxModule>('../../content/learning/*/*.mdx');
const lessonModuleDescriptors = Object.keys(LESSON_LOADERS)
  .flatMap((filePath): LessonModuleDescriptor[] => {
    const parsed = parseLearningMdxPath(filePath);
    return parsed ? [{ ...parsed, filePath }] : [];
  });
const lessonModulePromises = new Map<string, Promise<MdxModule>>();
const domainComponentPromises = new Map<LearningDomainId, Promise<Record<string, LearningMdxComponent>>>();
let referenceComponentsPromise: Promise<Record<string, LearningMdxComponent>> | null = null;

const domainMdxComponentLoaders: Partial<Record<LearningDomainId, () => Promise<Record<string, LearningMdxComponent>>>> = {
  cv: () => import('./domains/cv/mdxComponents').then(({ cvMdxComponents }) => cvMdxComponents),
  'continual-learning-llm': () => import('./domains/continual-learning-llm/mdxComponents').then(({ continualLearningLlmMdxComponents }) => continualLearningLlmMdxComponents),
  'llm-ai-engineering': () => import('./domains/llm-ai-engineering/mdxComponents').then(({ llmMdxComponents }) => llmMdxComponents),
  'linear-algebra': () => import('./domains/linear-algebra/mdxComponents').then(({ linearAlgebraMdxComponents }) => linearAlgebraMdxComponents),
};

function loadLearningReferenceComponents(): Promise<Record<string, LearningMdxComponent>> {
  if (!referenceComponentsPromise) {
    referenceComponentsPromise = import('./learningMdxReferences').then(({ referenceLearningMdxComponents }) => referenceLearningMdxComponents);
  }
  return referenceComponentsPromise;
}

export async function loadLearningMdxLesson({
  fallbackLocales = [],
  language,
  lesson,
}: {
  fallbackLocales?: readonly string[];
  language: Language;
  lesson: LearningLesson;
}): Promise<LoadedLearningMdxLesson | null> {
  if (lesson.contentStatus !== 'published') return null;

  const availableModules = lessonModuleDescriptors.filter((descriptor) => (
    descriptor.domainId === lesson.domainId && descriptor.lessonId === lesson.id
  ));
  const selectedModule = getLearningMdxLocaleCandidates(language, fallbackLocales)
    .map((locale) => availableModules.find((descriptor) => descriptor.locale === locale))
    .find(Boolean)
    ?? [...availableModules].sort((left, right) => left.locale.localeCompare(right.locale))[0];
  if (!selectedModule) {
    throw new Error(`Published Learning Lab lesson has no MDX module: ${lesson.domainId}/${lesson.id}`);
  }

  const module = await loadLessonModule(selectedModule.filePath);
  assertSelectedLearningMdxModule(module, selectedModule, lesson);
  const [domainComponents, referenceRuntime, referenceComponents] = await Promise.all([
    module.lessonRuntime.needsDomainAdapter
      ? loadDomainMdxComponents(lesson.domainId)
      : Promise.resolve({}),
    module.lessonRuntime.needsReferenceRuntime
      ? loadLearningReferenceRuntime(lesson.domainId, lesson.id)
      : Promise.resolve(emptyLearningReferenceRuntime()),
    module.lessonRuntime.needsReferenceRuntime
      ? loadLearningReferenceComponents()
      : Promise.resolve({}),
  ]);

  return {
    domainId: lesson.domainId,
    lessonId: lesson.id,
    locale: selectedModule.locale,
    pageCount: module.lessonMetadata.pageCount ?? 1,
    Content: module.default,
    components: { ...sharedLearningMdxComponents, ...referenceComponents, ...domainComponents },
    entryPoints: lesson.entryPoints,
    ...referenceRuntime,
  };
}

export function getLearningMdxLesson({ loadedLesson, language, quizQuestionStates, themeClasses, onQuizQuestionStateChange }: {
  loadedLesson: LoadedLearningMdxLesson;
  language: Language;
  quizQuestionStates?: Record<string, QuizQuestionState>;
  themeClasses: LearningThemeClasses;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
}): LearningMdxLessonDescriptor {
  const lesson = loadedLesson;
  const { Content, components, domainId, lessonId } = lesson;
  const referenceCoverage = lesson.referenceCoverage;
  const authoredPages = Array.from({ length: lesson.pageCount }, (_, pageIndex) => (
    <LearningMdxThemeProvider key={`${domainId}-${lessonId}-${pageIndex}`} themeClasses={themeClasses}>
      <LearningMdxLessonProvider domainId={domainId} lessonId={lessonId} language={language} pageIndex={pageIndex} entryPoints={lesson.entryPoints} referencePapers={lesson.referencePapers} citationEvidence={lesson.citationEvidence} citationLinkOnlyExceptions={lesson.citationLinkOnlyExceptions} featuredReferenceIds={lesson.featuredReferenceIds} referenceCourseAnalysis={referenceCoverage?.courseAnalysis} quizQuestionStates={quizQuestionStates} onQuizQuestionStateChange={onQuizQuestionStateChange}>
        <div className="learning-mdx-content">
          <Content components={components} />
        </div>
      </LearningMdxLessonProvider>
    </LearningMdxThemeProvider>
  ));
  const referencePage = referenceCoverage ? (
    <LearningMdxThemeProvider key={`${domainId}-${lessonId}-references`} themeClasses={themeClasses}>
      <LearningMdxLessonProvider domainId={domainId} lessonId={lessonId} language={language} pageIndex={lesson.pageCount} entryPoints={lesson.entryPoints} referencePapers={lesson.referencePapers} featuredReferenceIds={lesson.featuredReferenceIds} referenceCourseAnalysis={referenceCoverage.courseAnalysis} quizQuestionStates={quizQuestionStates} onQuizQuestionStateChange={onQuizQuestionStateChange}>
        <div className="learning-mdx-content">
          <Suspense fallback={null}>
            <LazyLessonReferences />
          </Suspense>
        </div>
      </LearningMdxLessonProvider>
    </LearningMdxThemeProvider>
  ) : null;
  const pages = referencePage ? [...authoredPages, referencePage] : authoredPages;
  return { pageCount: pages.length, pages };
}

function loadLessonModule(filePath: string): Promise<MdxModule> {
  return getRetryableCachedPromise(lessonModulePromises, filePath, () => {
    const loader = LESSON_LOADERS[filePath];
    if (!loader) throw new Error(`Unknown Learning Lab MDX module: ${filePath}`);
    return loader();
  });
}

function loadDomainMdxComponents(domainId: LearningDomainId): Promise<Record<string, LearningMdxComponent>> {
  const loadComponents = domainMdxComponentLoaders[domainId];
  if (!loadComponents) return Promise.resolve({});
  return getRetryableCachedPromise(domainComponentPromises, domainId, loadComponents);
}

function emptyLearningReferenceRuntime(): LearningReferenceRuntime {
  return {
    referencePapers: [],
    featuredReferenceIds: [],
    citationEvidence: [],
    citationLinkOnlyExceptions: [],
  };
}

async function loadLearningReferenceRuntime(
  domainId: LearningDomainId,
  lessonId: string,
): Promise<LearningReferenceRuntime> {
  if (domainId !== 'continual-learning-llm') {
    return emptyLearningReferenceRuntime();
  }

  const [papers, evidence] = await Promise.all([
    import('../../content/learning/continual-learning-llm/papers.ts'),
    import('../../content/learning/continual-learning-llm/citationEvidence.ts'),
  ]);
  return {
    referenceCoverage: papers.continualLearningLessonReferenceCoverageById.get(lessonId),
    referencePapers: papers.getContinualLearningLessonPapers(lessonId),
    featuredReferenceIds: papers.getContinualLearningLessonFeaturedReferenceIds(lessonId),
    citationEvidence: evidence.getContinualLearningLessonCitationEvidence(lessonId),
    citationLinkOnlyExceptions: evidence.getContinualLearningLessonCitationLinkOnlyExceptions(lessonId),
  };
}

function assertSelectedLearningMdxModule(
  module: MdxModule,
  selectedModule: LessonModuleDescriptor,
  lesson: LearningLesson,
): void {
  const metadata = module.lessonMetadata;
  if (
    metadata.domainId !== selectedModule.domainId
    || metadata.id !== selectedModule.lessonId
    || metadata.locale !== selectedModule.locale
  ) {
    throw new Error(`Learning Lab MDX metadata does not match its path: ${selectedModule.filePath}`);
  }
  const catalogTitle = lesson.text?.title[selectedModule.locale as keyof typeof lesson.text.title];
  if (catalogTitle && metadata.title !== catalogTitle) {
    throw new Error(`Learning Lab MDX title does not match the catalog: ${selectedModule.filePath}`);
  }
  const pageCount = metadata.pageCount ?? 1;
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error(`Invalid Learning Lab MDX page count: ${selectedModule.filePath}`);
  }
}

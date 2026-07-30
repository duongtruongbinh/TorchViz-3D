import { useEffect, useState, type ComponentType, type ReactElement } from 'react';
import { learningCatalog } from '../../content/learning/index.ts';
import {
  getLearningMdxLocaleCandidates,
  parseLearningMdxPath,
  type LearningMdxMetadata,
} from '../../core/learning/mdxContract';
import type { LearningDomainId } from '../../core/learning/types';
import type { Language } from '../../lib/localization';
import { cvMdxComponents } from './domains/cv/mdxComponents';
import { llmMdxComponents } from './domains/llm-ai-engineering/mdxComponents';
import { linearAlgebraMdxComponents } from './domains/linear-algebra/mdxComponents';
import { statisticsMdxComponents } from './domains/statistics/mdxComponents';
import type { QuizQuestionState } from './lesson/QuizBlock';
import {
  LearningMdxLessonProvider,
  LearningMdxThemeProvider,
  sharedLearningMdxComponents,
  type LearningMdxComponent,
  type LearningThemeClasses,
} from './learningMdxComponents';

const domainMdxComponents: Partial<Record<LearningDomainId, Record<string, LearningMdxComponent>>> = {
  cv: cvMdxComponents,
  statistics: statisticsMdxComponents,
  'llm-ai-engineering': llmMdxComponents,
  'linear-algebra': linearAlgebraMdxComponents,
};

type CompiledMdxComponent = ComponentType<{ components?: Record<string, LearningMdxComponent> }>;
type MdxModule = {
  default: CompiledMdxComponent;
  lessonMetadata: LearningMdxMetadata;
};

type RegistryEntry = {
  domainId: LearningDomainId;
  lessonId: string;
  modules: Map<string, {
    filePath: string;
    load: () => Promise<MdxModule>;
  }>;
};

export type LearningMdxLessonDescriptor = {
  pageCount: number;
  pages: ReactElement[];
};

export type LearningMdxLessonLoadState = {
  status: 'missing' | 'loading' | 'ready' | 'error';
  lesson: LearningMdxLessonDescriptor | null;
};

const LESSON_MODULE_LOADERS = import.meta.glob<MdxModule>('../../content/learning/*/*.mdx');
const lessons = buildLessonRegistry();

export function useCompiledLearningMdxLesson({ domainId, language, lessonId, quizQuestionStates, themeClasses, onQuizQuestionStateChange }: {
  domainId: LearningDomainId;
  language: Language;
  lessonId: string;
  quizQuestionStates?: Record<string, QuizQuestionState>;
  themeClasses: LearningThemeClasses;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
}): LearningMdxLessonLoadState {
  const registryEntry = lessons.get(`${domainId}/${lessonId}`);
  const domain = learningCatalog.domains.find((item) => item.id === domainId);
  const localeCandidates = getLearningMdxLocaleCandidates(language, domain?.mdx?.fallbackLocales);
  const selectedModule = registryEntry
    ? localeCandidates.map((locale) => registryEntry.modules.get(locale)).find(Boolean)
      ?? [...registryEntry.modules.entries()].sort(([left], [right]) => left.localeCompare(right))[0]?.[1]
    : undefined;
  const requestKey = selectedModule ? `${domainId}/${lessonId}/${selectedModule.filePath}` : '';
  const [loadState, setLoadState] = useState<{
    requestKey: string;
    status: 'loading' | 'ready' | 'error';
    module?: MdxModule;
  } | null>(null);

  useEffect(() => {
    if (!selectedModule || !registryEntry) {
      setLoadState(null);
      return;
    }
    let cancelled = false;
    setLoadState((current) => (
      current?.requestKey === requestKey && current.status === 'ready'
        ? current
        : { requestKey, status: 'loading' }
    ));
    selectedModule.load()
      .then((module) => {
        if (cancelled) return;
        validateLoadedModule(module, selectedModule.filePath, registryEntry);
        setLoadState({ requestKey, status: 'ready', module });
      })
      .catch(() => {
        if (cancelled) return;
        setLoadState({ requestKey, status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, [registryEntry, requestKey, selectedModule]);

  if (!registryEntry || !selectedModule) return { status: 'missing', lesson: null };
  if (!loadState || loadState.requestKey !== requestKey || loadState.status === 'loading') {
    return { status: 'loading', lesson: null };
  }
  if (loadState.status === 'error' || !loadState.module) return { status: 'error', lesson: null };

  const Content = loadState.module.default;
  const pageCount = loadState.module.lessonMetadata.pageCount ?? 1;
  const components = { ...sharedLearningMdxComponents, ...(domainMdxComponents[domainId] ?? {}) };
  const pages = Array.from({ length: pageCount }, (_, pageIndex) => (
    <LearningMdxThemeProvider key={`${domainId}-${lessonId}-${pageIndex}`} themeClasses={themeClasses}>
      <LearningMdxLessonProvider domainId={domainId} lessonId={lessonId} language={language} pageIndex={pageIndex} quizQuestionStates={quizQuestionStates} onQuizQuestionStateChange={onQuizQuestionStateChange}>
        <div className="grid min-w-0 gap-5 py-1 [&_h2]:text-xl [&_h2]:font-black [&_h3]:text-base [&_h3]:font-black [&_h4]:text-base [&_h4]:font-black [&_h5]:text-sm [&_h5]:font-black [&_h6]:text-sm [&_h6]:font-black [&_ol]:grid [&_ol]:list-decimal [&_ol]:gap-2 [&_ol]:pl-5 [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2 [&_ul]:pl-5 [&_li]:text-sm [&_li]:leading-6"><Content components={components} /></div>
      </LearningMdxLessonProvider>
    </LearningMdxThemeProvider>
  ));
  return { status: 'ready', lesson: { pageCount, pages } };
}

function buildLessonRegistry(): Map<string, RegistryEntry> {
  const registry = new Map<string, RegistryEntry>();
  for (const [filePath, load] of Object.entries(LESSON_MODULE_LOADERS)) {
    const parsed = parseLearningMdxPath(filePath);
    if (!parsed) throw new Error(`Invalid Learning Lab MDX filename: ${filePath}`);
    const domain = learningCatalog.domains.find((item) => item.id === parsed.domainId);
    if (!domain) throw new Error(`Unknown Learning Lab MDX domain: ${filePath}`);
    const lessonExists = learningCatalog.lessons.some((lesson) => lesson.domainId === domain.id && lesson.id === parsed.lessonId);
    if (!lessonExists) throw new Error(`Learning Lab MDX lesson is missing from the catalog: ${filePath}`);
    const lesson = learningCatalog.lessons.find((item) => item.domainId === domain.id && item.id === parsed.lessonId);
    if (lesson?.contentStatus !== 'published') throw new Error(`Learning Lab MDX lesson is not published: ${filePath}`);
    const key = `${domain.id}/${parsed.lessonId}`;
    const entry = registry.get(key) ?? { domainId: domain.id, lessonId: parsed.lessonId, modules: new Map() };
    if (entry.modules.has(parsed.locale)) throw new Error(`Duplicate Learning Lab MDX locale: ${filePath}`);
    entry.modules.set(parsed.locale, { filePath, load });
    registry.set(key, entry);
  }
  return registry;
}

function validateLoadedModule(module: MdxModule, filePath: string, entry: RegistryEntry): void {
  const parsed = parseLearningMdxPath(filePath);
  if (!parsed) throw new Error(`Invalid Learning Lab MDX filename: ${filePath}`);
  if (
    module.lessonMetadata.domainId !== parsed.domainId
    || module.lessonMetadata.id !== parsed.lessonId
    || module.lessonMetadata.locale !== parsed.locale
  ) {
    throw new Error(`Learning Lab MDX metadata does not match its path: ${filePath}`);
  }
  if (entry.domainId !== parsed.domainId || entry.lessonId !== parsed.lessonId) {
    throw new Error(`Learning Lab MDX registry identity does not match its path: ${filePath}`);
  }
  const lesson = learningCatalog.lessons.find((item) => (
    item.domainId === entry.domainId && item.id === entry.lessonId
  ));
  const catalogTitle = (lesson?.text?.title as Record<string, string> | undefined)?.[parsed.locale];
  if (catalogTitle && module.lessonMetadata.title !== catalogTitle) {
    throw new Error(`Learning Lab MDX title does not match the catalog: ${filePath}`);
  }
  const pageCount = module.lessonMetadata.pageCount ?? 1;
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error(`Invalid Learning Lab MDX page count: ${filePath}`);
  }
}

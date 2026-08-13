import type { ComponentType, ReactElement } from 'react';
import { learningCatalog } from '../../content/learning/index.ts';
import {
  continualLearningLessonReferenceCoverageById,
  getContinualLearningLessonFeaturedReferenceIds,
  getContinualLearningLessonPapers,
} from '../../content/learning/continual-learning-llm/papers.ts';
import { getContinualLearningLessonCitationEvidence } from '../../content/learning/continual-learning-llm/citationEvidence.ts';
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
import type { QuizQuestionState } from './lesson/QuizBlock';
import {
  LearningMdxLessonProvider,
  LearningMdxThemeProvider,
  LessonReferences,
  sharedLearningMdxComponents,
  type LearningMdxComponent,
  type LearningThemeClasses,
} from './learningMdxComponents';

const domainMdxComponents: Partial<Record<LearningDomainId, Record<string, LearningMdxComponent>>> = {
  cv: cvMdxComponents,
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
  modules: Map<string, CompiledMdxComponent>;
  pageCount: number;
};

export type LearningMdxLessonDescriptor = {
  pageCount: number;
  pages: ReactElement[];
};

const LESSON_MODULES = import.meta.glob<MdxModule>(
  '../../content/learning/*/*.mdx',
  { eager: true },
);
const lessons = buildLessonRegistry();

export function getLearningMdxLesson({ domainId, language, lessonId, quizQuestionStates, themeClasses, onQuizQuestionStateChange }: {
  domainId: LearningDomainId;
  language: Language;
  lessonId: string;
  quizQuestionStates?: Record<string, QuizQuestionState>;
  themeClasses: LearningThemeClasses;
  onQuizQuestionStateChange?: (questionId: string, state: QuizQuestionState) => void;
}): LearningMdxLessonDescriptor | null {
  const lesson = lessons.get(`${domainId}/${lessonId}`);
  if (!lesson) return null;
  const domain = learningCatalog.domains.find((item) => item.id === domainId);
  const localeCandidates = getLearningMdxLocaleCandidates(language, domain?.mdx?.fallbackLocales);
  const Content = localeCandidates.map((locale) => lesson.modules.get(locale)).find(Boolean)
    ?? [...lesson.modules.entries()].sort(([left], [right]) => left.localeCompare(right))[0]?.[1];
  if (!Content) return null;
  const components = { ...sharedLearningMdxComponents, ...(domainMdxComponents[domainId] ?? {}) };
  const referenceCoverage = domainId === 'continual-learning-llm'
    ? continualLearningLessonReferenceCoverageById.get(lessonId)
    : undefined;
  const referencePapers = domainId === 'continual-learning-llm'
    ? getContinualLearningLessonPapers(lessonId)
    : [];
  const featuredReferenceIds = referenceCoverage
    ? getContinualLearningLessonFeaturedReferenceIds(lessonId)
    : [];
  const citationEvidence = domainId === 'continual-learning-llm'
    ? getContinualLearningLessonCitationEvidence(lessonId)
    : [];
  const authoredPages = Array.from({ length: lesson.pageCount }, (_, pageIndex) => (
    <LearningMdxThemeProvider key={`${domainId}-${lessonId}-${pageIndex}`} themeClasses={themeClasses}>
      <LearningMdxLessonProvider domainId={domainId} lessonId={lessonId} language={language} pageIndex={pageIndex} referencePapers={referencePapers} citationEvidence={citationEvidence} featuredReferenceIds={featuredReferenceIds} referenceCourseAnalysis={referenceCoverage?.courseAnalysis} quizQuestionStates={quizQuestionStates} onQuizQuestionStateChange={onQuizQuestionStateChange}>
        <div className="learning-mdx-content">
          <Content components={components} />
        </div>
      </LearningMdxLessonProvider>
    </LearningMdxThemeProvider>
  ));
  const referencePage = referenceCoverage ? (
    <LearningMdxThemeProvider key={`${domainId}-${lessonId}-references`} themeClasses={themeClasses}>
      <LearningMdxLessonProvider domainId={domainId} lessonId={lessonId} language={language} pageIndex={lesson.pageCount} referencePapers={referencePapers} featuredReferenceIds={featuredReferenceIds} referenceCourseAnalysis={referenceCoverage.courseAnalysis} quizQuestionStates={quizQuestionStates} onQuizQuestionStateChange={onQuizQuestionStateChange}>
        <div className="learning-mdx-content">
          <LessonReferences />
        </div>
      </LearningMdxLessonProvider>
    </LearningMdxThemeProvider>
  ) : null;
  const pages = referencePage ? [...authoredPages, referencePage] : authoredPages;
  return { pageCount: pages.length, pages };
}

function buildLessonRegistry(): Map<string, RegistryEntry> {
  const registry = new Map<string, RegistryEntry>();
  for (const [filePath, module] of Object.entries(LESSON_MODULES)) {
    const parsed = parseLearningMdxPath(filePath);
    if (!parsed) throw new Error(`Invalid Learning Lab MDX filename: ${filePath}`);
    const domain = learningCatalog.domains.find((item) => item.id === parsed.domainId);
    if (!domain) throw new Error(`Unknown Learning Lab MDX domain: ${filePath}`);
    const lessonExists = learningCatalog.lessons.some((lesson) => lesson.domainId === domain.id && lesson.id === parsed.lessonId);
    if (!lessonExists) throw new Error(`Learning Lab MDX lesson is missing from the catalog: ${filePath}`);
    const lesson = learningCatalog.lessons.find((item) => item.domainId === domain.id && item.id === parsed.lessonId);
    if (lesson?.contentStatus !== 'published') throw new Error(`Learning Lab MDX lesson is not published: ${filePath}`);
    if (module.lessonMetadata.domainId !== parsed.domainId || module.lessonMetadata.id !== parsed.lessonId || module.lessonMetadata.locale !== parsed.locale) {
      throw new Error(`Learning Lab MDX metadata does not match its path: ${filePath}`);
    }
    const catalogTitle = (lesson.text?.title as Record<string, string> | undefined)?.[parsed.locale];
    if (catalogTitle && module.lessonMetadata.title !== catalogTitle) {
      throw new Error(`Learning Lab MDX title does not match the catalog: ${filePath}`);
    }
    const pageCount = module.lessonMetadata.pageCount ?? 1;
    if (!Number.isInteger(pageCount) || pageCount < 1) throw new Error(`Invalid Learning Lab MDX page count: ${filePath}`);
    const key = `${domain.id}/${parsed.lessonId}`;
    const entry = registry.get(key) ?? { domainId: domain.id, lessonId: parsed.lessonId, modules: new Map(), pageCount };
    if (entry.pageCount !== pageCount) throw new Error(`Learning Lab MDX locale page count mismatch: ${filePath}`);
    if (entry.modules.has(parsed.locale)) throw new Error(`Duplicate Learning Lab MDX locale: ${filePath}`);
    entry.modules.set(parsed.locale, module.default);
    registry.set(key, entry);
  }
  return registry;
}

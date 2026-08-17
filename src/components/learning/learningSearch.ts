import searchDocumentLoaders from 'virtual:learning-mdx-search-loaders';
import {
  getLearningMdxLocaleCandidates,
  type LearningMdxSearchDocument,
} from '../../core/learning/mdxContract.ts';
import type { LearningDomainId } from '../../core/learning/types.ts';
import { getRetryableCachedPromise } from '../../core/learning/retryablePromiseCache.ts';

const searchDocumentsByLesson = new Map<string, Map<string, LearningMdxSearchDocument>>();
const searchDocumentPromises = new Map<LearningDomainId, Promise<void>>();

export function loadLearningSearchDocuments(domainId: LearningDomainId): Promise<void> {
  return getRetryableCachedPromise(searchDocumentPromises, domainId, async () => {
    const { default: searchDocuments } = await searchDocumentLoaders[domainId]();
    for (const document of searchDocuments) {
      const lessonKey = `${document.domainId}/${document.lessonId}`;
      const locales = searchDocumentsByLesson.get(lessonKey) ?? new Map<string, LearningMdxSearchDocument>();
      locales.set(document.locale, document);
      searchDocumentsByLesson.set(lessonKey, locales);
    }
  });
}

export function getLearningSearchDocument(
  domainId: string,
  lessonId: string,
  locale: string,
  fallbackLocales: readonly string[] = [],
): LearningMdxSearchDocument | null {
  const locales = searchDocumentsByLesson.get(`${domainId}/${lessonId}`);
  if (!locales) return null;
  for (const candidate of getLearningMdxLocaleCandidates(locale, fallbackLocales)) {
    const document = locales.get(candidate);
    if (document) return document;
  }
  return [...locales.values()].sort((left, right) => left.locale.localeCompare(right.locale))[0] ?? null;
}

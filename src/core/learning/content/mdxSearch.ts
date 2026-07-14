import searchDocuments from 'virtual:learning-mdx-search-documents';
import { learningCatalog } from './index.ts';
import {
  getLearningMdxLocaleCandidates,
  type LearningMdxSearchDocument,
} from './mdxContract.ts';

const searchDocumentsByLesson = new Map<string, Map<string, LearningMdxSearchDocument>>();

for (const document of searchDocuments) {
  const lessonKey = `${document.domainId}/${document.lessonId}`;
  const locales = searchDocumentsByLesson.get(lessonKey) ?? new Map<string, LearningMdxSearchDocument>();
  locales.set(document.locale, document);
  searchDocumentsByLesson.set(lessonKey, locales);
}

export function getLearningSearchDocument(
  domainId: string,
  lessonId: string,
  locale: string,
): LearningMdxSearchDocument | null {
  const locales = searchDocumentsByLesson.get(`${domainId}/${lessonId}`);
  if (!locales) return null;
  const fallbackLocales = learningCatalog.domains.find((domain) => domain.id === domainId)?.mdx?.fallbackLocales ?? [];
  for (const candidate of getLearningMdxLocaleCandidates(locale, fallbackLocales)) {
    const document = locales.get(candidate);
    if (document) return document;
  }
  return [...locales.values()].sort((left, right) => left.locale.localeCompare(right.locale))[0] ?? null;
}

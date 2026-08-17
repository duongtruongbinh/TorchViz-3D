import { materializeLearningCatalog } from '../../core/learning/materializeCatalog.ts';
import { getRetryableCachedPromise } from '../../core/learning/retryablePromiseCache.ts';
import type {
  LearningCatalog,
  LearningDomainId,
  LearningTableOfContents,
} from '../../core/learning/types.ts';

type LearningTocModule = {
  learningTableOfContents: LearningTableOfContents;
};

const tocLoaders = import.meta.glob<LearningTocModule>(
  '../../content/learning/*/table-of-contents.ts',
);
const domainCatalogPromises = new Map<LearningDomainId, Promise<LearningCatalog>>();
const fullCatalogPromises = new Map<'full', Promise<LearningCatalog>>();

export function loadLearningDomainCatalog(domainId: LearningDomainId): Promise<LearningCatalog> {
  return getRetryableCachedPromise(domainCatalogPromises, domainId, async () => {
    const modulePath = `../../content/learning/${domainId}/table-of-contents.ts`;
    const loadToc = tocLoaders[modulePath];
    if (!loadToc) throw new Error(`Unknown Learning Lab domain: ${domainId}`);
    const { learningTableOfContents } = await loadToc();
    if (learningTableOfContents.id !== domainId) {
      throw new Error(`Learning Lab TOC path/domain mismatch: ${modulePath}`);
    }
    return materializeLearningCatalog([learningTableOfContents]);
  });
}

export function loadFullLearningCatalog(): Promise<LearningCatalog> {
  return getRetryableCachedPromise(
    fullCatalogPromises,
    'full',
    () => import('../../content/learning/index.ts').then(({ learningCatalog }) => learningCatalog),
  );
}

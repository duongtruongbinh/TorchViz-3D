import type {
  LearningCatalog,
  LearningLocalizedText,
  LearningTableOfContents,
  LearningTocLessonSeed,
} from './types.ts';

export function materializeLearningCatalog(tables: readonly LearningTableOfContents[]): LearningCatalog {
  const catalog: LearningCatalog = {
    domains: tables.map((table) => ({
      id: table.id,
      text: table.text,
      status: table.status,
      trackIds: table.chapters.map((chapter) => chapter.id),
      ...(table.fallbackLocales || table.searchTextMode ? {
        mdx: {
          fallbackLocales: table.fallbackLocales ?? [],
          searchTextMode: table.searchTextMode ?? 'full',
        },
      } : {}),
    })),
    tracks: tables.flatMap((table) => table.chapters.map((chapter) => ({
      id: chapter.id,
      text: chapter.text,
      domainId: table.id,
      status: chapter.status ?? 'available',
      lessonIds: chapter.lessonIds.map(getLessonSeedId),
    }))),
    lessons: tables.flatMap((table) => table.chapters.flatMap((chapter, chapterIndex) => (
      chapter.lessonIds.map((lessonSeed, lessonIndex) => {
        const lesson = typeof lessonSeed === 'string' ? { id: lessonSeed } : lessonSeed;
        return {
          id: lesson.id,
          domainId: table.id,
          trackId: chapter.id,
          status: lesson.status ?? (
            chapterIndex === 0 && lessonIndex === 0
              ? table.firstLessonStatus ?? 'available'
              : table.defaultLessonStatus ?? 'locked'
          ),
          contentStatus: lesson.contentStatus ?? 'missing',
          tags: lesson.tags ?? [],
          entryPoints: lesson.entryPoints ?? [],
          text: {
            title: lesson.title ?? toLocalizedText(toReadableTitle(lesson.id)),
            theory: [],
          },
          sections: lesson.sections ?? table.sectionKinds.map((kind) => ({
            kind,
            refId: kind === 'theory' ? lesson.id : `${lesson.id}-${kind}`,
          })),
        };
      })
    ))),
    routeAliases: tables.flatMap((table) => (
      (table.routeAliases ?? []).map((alias) => ({ domainId: table.id, ...alias }))
    )),
  };
  assertLearningCatalog(catalog);
  return catalog;
}

function assertLearningCatalog(catalog: LearningCatalog): void {
  assertUnique(catalog.domains.map((domain) => domain.id), 'domain');
  assertUnique(catalog.tracks.map((track) => `${track.domainId}/${track.id}`), 'track');
  assertUnique(catalog.lessons.map((lesson) => `${lesson.domainId}/${lesson.id}`), 'lesson');
  assertUnique(catalog.lessons.flatMap((lesson) => lesson.entryPoints.map((entryPoint) => (
    `${entryPoint.kind}/${entryPoint.exerciseId}/${entryPoint.operationFamily}`
  ))), 'lesson entry point');

  for (const domain of catalog.domains) {
    for (const trackId of domain.trackIds) {
      if (!catalog.tracks.some((track) => track.domainId === domain.id && track.id === trackId)) {
        throw new Error(`Learning Lab domain ${domain.id} references unknown track ${trackId}`);
      }
    }
  }
  for (const track of catalog.tracks) {
    for (const lessonId of track.lessonIds) {
      const lesson = catalog.lessons.find((item) => item.domainId === track.domainId && item.id === lessonId);
      if (!lesson || lesson.trackId !== track.id) {
        throw new Error(`Learning Lab track ${track.domainId}/${track.id} references invalid lesson ${lessonId}`);
      }
    }
  }
  for (const lesson of catalog.lessons) {
    if (lesson.entryPoints.length && !lesson.tags.includes('exercise')) {
      throw new Error(`Learning Lab lesson ${lesson.domainId}/${lesson.id} has an exercise entry point without the exercise tag`);
    }
  }
  for (const alias of catalog.routeAliases ?? []) {
    if (alias.toTrackId && !catalog.tracks.some((track) => track.domainId === alias.domainId && track.id === alias.toTrackId)) {
      throw new Error(`Learning Lab route alias targets unknown track ${alias.domainId}/${alias.toTrackId}`);
    }
    if (alias.toLessonId && !catalog.lessons.some((lesson) => lesson.domainId === alias.domainId && lesson.id === alias.toLessonId)) {
      throw new Error(`Learning Lab route alias targets unknown lesson ${alias.domainId}/${alias.toLessonId}`);
    }
  }
}

function assertUnique(values: readonly string[], label: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`Duplicate Learning Lab ${label}: ${value}`);
    seen.add(value);
  }
}

function getLessonSeedId(seed: LearningTocLessonSeed): string {
  return typeof seed === 'string' ? seed : seed.id;
}

const TITLE_OVERRIDES: Record<string, string> = {
  ai: 'AI', api: 'API', apis: 'APIs', aws: 'AWS', bert: 'BERT', bleu: 'BLEU', cd: 'CD', ci: 'CI',
  cnn: 'CNN', dbscan: 'DBSCAN', dpo: 'DPO', dqn: 'DQN', gcp: 'GCP', gdpr: 'GDPR', gpt: 'GPT',
  gpu: 'GPU', grpo: 'GRPO', json: 'JSON', kl: 'KL', llm: 'LLM', llmops: 'LLMOps', mdp: 'MDP',
  ml: 'ML', mlops: 'MLOps', nlp: 'NLP', pca: 'PCA', pii: 'PII', ppo: 'PPO', q: 'Q', rag: 'RAG',
  rl: 'RL', rlaif: 'RLAIF', rlhf: 'RLHF', rouge: 'ROUGE', sarsa: 'SARSA', svd: 'SVD', td: 'TD',
  tf: 'TF', tsne: 't-SNE', umap: 'UMAP',
};

function toLocalizedText(value: string): LearningLocalizedText {
  return { en: value, vi: value };
}

function toReadableTitle(id: string): string {
  return id
    .split('-')
    .map((word) => TITLE_OVERRIDES[word.toLowerCase()] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

import type {
  LearningDomain,
  LearningDomainId,
  LearningDomainStatus,
  LearningLocalizedText,
  LearningLesson,
  LearningLessonExtra,
  LearningLessonSection,
  LearningLessonStatus,
  LearningTrack,
  LearningTrackStatus,
} from '../types.ts';

export type LearningChapterSeed = {
  id: string;
  textKey: string;
  lessonIds: LearningLessonSeed[];
  status?: LearningTrackStatus;
};

export type LearningLessonSeed = string | {
  id: string;
  title?: LearningLocalizedText;
  theory?: LearningLocalizedText[];
  extras?: LearningLessonExtra[];
  status?: LearningLessonStatus;
  sections?: LearningLessonSection[];
};

type PlaceholderContentArgs = {
  domainId: LearningDomainId;
  domainTextKey: string;
  domainStatus: LearningDomainStatus;
  chapters: LearningChapterSeed[];
  sectionKinds: LearningLessonSection['kind'][];
  firstLessonStatus?: LearningLessonStatus;
  defaultLessonStatus?: LearningLessonStatus;
};

export function buildPlaceholderContent({
  domainId,
  domainTextKey,
  domainStatus,
  chapters,
  sectionKinds,
  firstLessonStatus = 'available',
  defaultLessonStatus = 'locked',
}: PlaceholderContentArgs): {
  domain: LearningDomain;
  tracks: LearningTrack[];
  lessons: LearningLesson[];
} {
  return {
    domain: {
      id: domainId,
      textKey: domainTextKey,
      status: domainStatus,
      trackIds: chapters.map((chapter) => chapter.id),
    },
    tracks: chapters.map((chapter) => ({
      id: chapter.id,
      textKey: chapter.textKey,
      domainId,
      status: chapter.status ?? 'available',
      lessonIds: chapter.lessonIds.map(getLessonSeedId),
    })),
    lessons: chapters.flatMap((chapter, chapterIndex) => (
      chapter.lessonIds.map((lessonSeed, lessonIndex) => buildPlaceholderLesson({
        domainId,
        trackId: chapter.id,
        lessonSeed,
        sectionKinds,
        status: chapterIndex === 0 && lessonIndex === 0 ? firstLessonStatus : defaultLessonStatus,
      }))
    )),
  };
}

function getLessonSeedId(seed: LearningLessonSeed): string {
  return typeof seed === 'string' ? seed : seed.id;
}

function buildPlaceholderLesson({
  domainId,
  trackId,
  lessonSeed,
  sectionKinds,
  status,
}: {
  domainId: LearningDomainId;
  trackId: string;
  lessonSeed: LearningLessonSeed;
  sectionKinds: LearningLessonSection['kind'][];
  status: LearningLessonStatus;
}): LearningLesson {
  const lesson = typeof lessonSeed === 'string' ? { id: lessonSeed } : lessonSeed;
  const title = lesson.title ?? toLocalizedText(toReadableTitle(lesson.id));
  return {
    id: lesson.id,
    domainId,
    trackId,
    status: lesson.status ?? status,
    text: {
      title,
      theory: lesson.theory ?? [
        {
          en: 'Content is in progress.',
          vi: 'Nội dung đang hoàn thiện.',
        },
      ],
    },
    sections: lesson.sections ?? sectionKinds.map((kind) => ({
      kind,
      refId: kind === 'theory' ? lesson.id : `${lesson.id}-${kind}`,
    })),
    ...(lesson.extras ? { extras: lesson.extras } : {}),
    practice: [],
  };
}

const TITLE_OVERRIDES: Record<string, string> = {
  ai: 'AI',
  api: 'API',
  apis: 'APIs',
  aws: 'AWS',
  bert: 'BERT',
  bleu: 'BLEU',
  cd: 'CD',
  ci: 'CI',
  cnn: 'CNN',
  dbscan: 'DBSCAN',
  dpo: 'DPO',
  dqn: 'DQN',
  gcp: 'GCP',
  gdpr: 'GDPR',
  gpt: 'GPT',
  gpu: 'GPU',
  grpo: 'GRPO',
  json: 'JSON',
  kl: 'KL',
  llm: 'LLM',
  llmops: 'LLMOps',
  mdp: 'MDP',
  ml: 'ML',
  mlops: 'MLOps',
  nlp: 'NLP',
  pca: 'PCA',
  pii: 'PII',
  ppo: 'PPO',
  q: 'Q',
  rag: 'RAG',
  rl: 'RL',
  rlaif: 'RLAIF',
  rlhf: 'RLHF',
  rouge: 'ROUGE',
  sarsa: 'SARSA',
  svd: 'SVD',
  td: 'TD',
  tf: 'TF',
  tsne: 't-SNE',
  umap: 'UMAP',
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

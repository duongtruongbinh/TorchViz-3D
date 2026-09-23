import type {
  LearningCitationEvidence,
  LearningCitationLinkOnlyException,
} from '../../../core/learning/citationEvidence.ts';

type SurveySnippet = Pick<LearningCitationEvidence, 'excerpt' | 'searchText' | 'locator' | 'verificationUrl' | 'targetPrecision'>;

const reviewedAt = '2026-09-23';
const surveyPdf = (page: number) => `https://arxiv.org/pdf/2510.25117v2#page=${page}`;

const evidenceIdsByLesson: Record<string, readonly string[]> = {
  'unlearning-request-granularity-and-boundaries': ['request-granularity', 'problem-boundaries'],
  'unlearning-dataset-design-axes': ['dataset-design-axes'],
  'unlearning-benchmark-landscape': ['benchmark-landscape'],
  'llm-unlearning-method-taxonomy': ['method-taxonomy'],
  'sft-objective-families': ['sft-objective-families'],
  'rl-and-parameter-localization': ['rl-localization'],
  'modular-and-composite-unlearning': ['modular-composite'],
  'inference-time-unlearning': ['inference-time-methods'],
  'knowledge-memorization-metrics': ['knowledge-metrics'],
  'utility-robustness-efficiency-metrics': ['utility-robustness-efficiency'],
  'definition-effects-and-scaling-challenges': ['definition-data-challenges'],
  'robust-verifiable-and-beyond-data-unlearning': ['robust-verifiable-frontiers', 'beyond-data'],
  'relearning-jailbreak-vulnerabilities': ['relearning-jailbreak-vulnerabilities-survey'],
  'llm-lifecycle-management-future': ['llm-lifecycle-management-future-survey'],
};

const snippetByEvidenceId: Record<string, SurveySnippet> = {
  'request-granularity': {
    excerpt: 'Compared to sample-level unlearning, it requires not only erasing memorized content but also managing inter-entity correlations.',
    searchText: 'managing inter-entity correlations', locator: '§2.1.1, Types of Requests',
    verificationUrl: surveyPdf(4), targetPrecision: 'pdf-page',
  },
  'problem-boundaries': {
    excerpt: 'We briefly introduce these adjacent fields to clarify correlations and distinctions.',
    searchText: 'clarify correlations and distinctions', locator: '§2.2, Related Topics',
    verificationUrl: surveyPdf(5), targetPrecision: 'pdf-page',
  },
  'dataset-design-axes': {
    excerpt: 'The data can be classified in three different dimensions: content, task format and experiment paradigm.',
    searchText: 'content, task format and experiment paradigm', locator: '§4.1, Data',
    verificationUrl: surveyPdf(15), targetPrecision: 'pdf-page',
  },
  'benchmark-landscape': {
    excerpt: 'We compare 18 existing benchmarks from the perspectives of task format, content, and experimental paradigms.',
    searchText: 'compare 18 existing benchmarks', locator: '§1, Introduction',
    verificationUrl: surveyPdf(2), targetPrecision: 'pdf-page',
  },
  'method-taxonomy': {
    excerpt: 'The unlearning method can be applied to the training process, the trained model, or the inference stage.',
    searchText: 'training process, the trained model, or the inference stage', locator: '§3, Methods',
    verificationUrl: surveyPdf(5), targetPrecision: 'pdf-page',
  },
  'sft-objective-families': {
    excerpt: 'We first categorize the update method of different SFT algorithms based on their loss objectives.',
    searchText: 'categorize the update method of different SFT algorithms', locator: '§3.2.1, SFT',
    verificationUrl: surveyPdf(6), targetPrecision: 'pdf-page',
  },
  'rl-localization': {
    excerpt: 'Post-Training Unlearning involves altering the trained model, mainly through supervised fine-tuning or reinforcement training on selected parameters.',
    searchText: 'reinforcement training on selected parameters', locator: '§3, Methods',
    verificationUrl: surveyPdf(6), targetPrecision: 'pdf-page',
  },
  'modular-composite': {
    excerpt: 'Composite unlearning typically involves the integration of multiple distinct operations.',
    searchText: 'integration of multiple distinct operations', locator: '§3.2.5, Composite',
    verificationUrl: surveyPdf(12), targetPrecision: 'pdf-page',
  },
  'inference-time-methods': {
    excerpt: 'Inference-time Unlearning aims to achieve unlearning via input or output adjustments, rather than modifying the model parameters.',
    searchText: 'via input or output adjustments', locator: '§3, Methods',
    verificationUrl: surveyPdf(6), targetPrecision: 'pdf-page',
  },
  'knowledge-metrics': {
    excerpt: 'We divide knowledge memorization metrics into 10 categories to analyze their advantages and applicability.',
    searchText: 'knowledge memorization metrics into 10 categories', locator: '§1, Introduction',
    verificationUrl: surveyPdf(2), targetPrecision: 'pdf-page',
  },
  'utility-robustness-efficiency': {
    excerpt: 'Metrics include knowledge memorization, model utility, unlearning robustness and efficiency.',
    searchText: 'model utility, unlearning robustness and efficiency', locator: '§4, Evaluation',
    verificationUrl: surveyPdf(15), targetPrecision: 'pdf-page',
  },
  'definition-data-challenges': {
    excerpt: 'Current challenges include the lack of a strict and consistent definition, the variation of impacts across languages and data.',
    searchText: 'lack of a strict and consistent definition', locator: '§1, Introduction',
    verificationUrl: surveyPdf(2), targetPrecision: 'pdf-page',
  },
  'robust-verifiable-frontiers': {
    excerpt: 'Achieving verifiable and trustworthy unlearning remains critically important.',
    searchText: 'verifiable and trustworthy unlearning', locator: '§5.2.5, Verifiable and Certifiable Unlearning',
    verificationUrl: surveyPdf(23), targetPrecision: 'pdf-page',
  },
  'beyond-data': {
    excerpt: 'Unlearning requests often target not only concrete data but also abstract concepts or capabilities.',
    searchText: 'abstract concepts or capabilities', locator: '§5.2.3, Unlearning beyond Data',
    verificationUrl: surveyPdf(22), targetPrecision: 'pdf-page',
  },
  'relearning-jailbreak-vulnerabilities-survey': {
    excerpt: 'Achieving truly robust unlearning remains a critical and ongoing topic.',
    searchText: 'truly robust unlearning remains a critical',
    locator: '§5.2.4, Robust Unlearning',
    verificationUrl: surveyPdf(23), targetPrecision: 'pdf-page',
  },
  'llm-lifecycle-management-future-survey': {
    excerpt: 'Achieving truly robust unlearning remains a critical and ongoing topic.',
    searchText: 'truly robust unlearning remains a critical',
    locator: '§5.2.4, Robust Unlearning',
    verificationUrl: surveyPdf(23), targetPrecision: 'pdf-page',
  },
};

function evidence(
  lessonId: string,
  evidenceId: string,
  snippet: SurveySnippet,
): LearningCitationEvidence {
  return {
    id: evidenceId,
    lessonId,
    claimId: `${lessonId}-survey-claim`,
    paperId: 'qiu2025survey',
    ...snippet,
    sourceVersion: 'arXiv v2',
    retrievedAt: reviewedAt,
    review: { status: 'verified', verifiedAt: reviewedAt },
    quotation: { basis: 'short-quotation' },
    automatedAudit: {
      status: 'manual-required',
      reason: 'The evidence was reviewed against the pinned local arXiv v2 PDF; the automated audit does not extract PDF text.',
    },
  };
}

export const llmUnlearningCitationEvidence: readonly LearningCitationEvidence[] = Object.entries(evidenceIdsByLesson).flatMap(([lessonId, evidenceIds]) => {
  return evidenceIds.map((evidenceId) => evidence(
    lessonId,
    evidenceId,
    snippetByEvidenceId[evidenceId],
  ));
});

export const llmUnlearningCitationLinkOnlyExceptions: readonly LearningCitationLinkOnlyException[] = [];

export function getLlmUnlearningLessonCitationEvidence(lessonId: string): readonly LearningCitationEvidence[] {
  return llmUnlearningCitationEvidence.filter((item) => item.lessonId === lessonId);
}

export function getLlmUnlearningLessonCitationLinkOnlyExceptions(lessonId: string): readonly LearningCitationLinkOnlyException[] {
  return llmUnlearningCitationLinkOnlyExceptions.filter((item) => item.lessonId === lessonId);
}

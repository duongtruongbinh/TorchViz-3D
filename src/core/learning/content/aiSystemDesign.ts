import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';
import { buildPlaceholderContent, type LearningChapterSeed } from './seed.ts';

const chapters: LearningChapterSeed[] = [
  {
    id: 'ai-system-design-framework',
    textKey: 'aiSystemDesignFramework',
    lessonIds: [
      'clarify-requirements',
      'identify-ai-components',
      'data-flow-design',
      'model-selection-by-task',
      'scalability-planning',
      'cost-per-user',
      'ai-failure-reliability',
      'system-monitoring',
    ],
  },
  {
    id: 'classic-ai-system-designs',
    textKey: 'classicAiSystemDesigns',
    lessonIds: [
      'chatbot-with-memory',
      'rag-knowledge-base',
      'multi-llm-recommendation-system',
      'pdf-qa-at-scale',
      'ai-customer-support',
    ],
  },
  {
    id: 'inference-placement-strategy',
    textKey: 'inferencePlacementStrategy',
    lessonIds: [
      'backend-api-inference',
      'client-side-inference',
      'edge-inference',
      'async-queue-inference',
    ],
  },
  {
    id: 'caching-strategies',
    textKey: 'cachingStrategies',
    lessonIds: [
      'exact-match-caching',
      'semantic-caching',
      'prompt-template-caching',
    ],
  },
  {
    id: 'async-ai-architecture',
    textKey: 'asyncAiArchitecture',
    lessonIds: [
      'when-to-use-async-ai',
      'async-task-api-pattern',
      'worker-processing-pattern',
      'polling-webhook-completion',
    ],
  },
  {
    id: 'cost-aware-architecture',
    textKey: 'costAwareArchitecture',
    lessonIds: [
      'per-feature-model-selection',
      'prompt-compression-cost',
      'output-length-limits',
      'caching-cost-reduction',
      'free-tier-model-downgrade',
      'async-batching',
      'context-window-optimization',
    ],
  },
];

const aiSystemDesignContent = buildPlaceholderContent({
  domainId: 'ai-system-design',
  domainTextKey: 'aiSystemDesign',
  domainStatus: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
});

export const aiSystemDesignDomain: LearningDomain = aiSystemDesignContent.domain;
export const aiSystemDesignTracks: LearningTrack[] = aiSystemDesignContent.tracks;
export const aiSystemDesignLessons: LearningLesson[] = aiSystemDesignContent.lessons;

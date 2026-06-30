import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';
import { buildPlaceholderContent, type LearningChapterSeed } from './seed.ts';

const chapters: LearningChapterSeed[] = [
  {
    id: 'ai-safety-fundamentals',
    textKey: 'aiSafetyFundamentals',
    lessonIds: [
      'types-of-ai-harm',
      'alignment-problem',
      'hallucination-causes',
      'bias-fairness-ai-systems',
      'dual-use-concerns',
    ],
  },
  {
    id: 'prompt-injection-security',
    textKey: 'promptInjectionSecurity',
    lessonIds: [
      'direct-prompt-injection',
      'indirect-prompt-injection',
      'prompt-injection-defense-strategies',
      'jailbreaking-mitigations',
      'adversarial-testing-red-teaming',
    ],
  },
  {
    id: 'bias-fairness',
    textKey: 'biasFairness',
    lessonIds: [
      'sources-of-bias',
      'bias-types',
      'fairness-metrics',
      'bias-detection-tools',
      'bias-mitigation-strategies',
    ],
  },
  {
    id: 'privacy-data-governance',
    textKey: 'privacyDataGovernance',
    lessonIds: [
      'pii-training-inference',
      'gdpr-ai-compliance',
      'data-minimization',
      'right-to-erasure-ml',
      'differential-privacy-basics',
      'federated-learning',
    ],
  },
  {
    id: 'ai-transparency-explainability',
    textKey: 'aiTransparencyExplainability',
    lessonIds: [
      'model-cards',
      'system-cards',
      'shap-explainability',
      'lime-explainability',
      'attention-visualization',
      'chain-of-thought-explainability',
    ],
  },
  {
    id: 'responsible-ai-production',
    textKey: 'responsibleAiProduction',
    lessonIds: [
      'content-moderation-architecture',
      'safety-classifiers',
      'human-in-the-loop-high-stakes',
      'audit-trails-logging',
      'ai-incident-response',
      'ai-governance-frameworks',
    ],
  },
];

const aiEthicsSafetyGovernanceContent = buildPlaceholderContent({
  domainId: 'ai-ethics-safety-governance',
  domainTextKey: 'aiEthicsSafetyGovernance',
  domainStatus: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
});

export const aiEthicsSafetyGovernanceDomain: LearningDomain = aiEthicsSafetyGovernanceContent.domain;
export const aiEthicsSafetyGovernanceTracks: LearningTrack[] = aiEthicsSafetyGovernanceContent.tracks;
export const aiEthicsSafetyGovernanceLessons: LearningLesson[] = aiEthicsSafetyGovernanceContent.lessons;

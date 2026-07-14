import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'ai-safety-fundamentals',
    text: {
      title: { en: "1.1 AI Safety Fundamentals", vi: "1.1 AI Safety Fundamentals" },
      description: { en: "AI harms, alignment, hallucination, bias, fairness, and dual-use concerns.", vi: "Tác hại AI, alignment, hallucination, bias, fairness và dual-use." },
    },
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
    text: {
      title: { en: "1.2 Prompt Injection & Security", vi: "1.2 Prompt Injection & Security" },
      description: { en: "Direct and indirect injection, defenses, jailbreak mitigations, and adversarial red teaming.", vi: "Direct/indirect injection, phòng thủ, giảm jailbreak và red teaming đối kháng." },
    },
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
    text: {
      title: { en: "1.3 Bias & Fairness", vi: "1.3 Bias & Fairness" },
      description: { en: "Bias sources and types, fairness metrics, detection tools, and mitigation strategies.", vi: "Nguồn và loại bias, fairness metric, công cụ phát hiện và chiến lược giảm bias." },
    },
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
    text: {
      title: { en: "1.4 Privacy & Data Governance", vi: "1.4 Privacy & Data Governance" },
      description: { en: "PII, GDPR, data minimization, right to erasure, differential privacy, and federated learning.", vi: "PII, GDPR, data minimization, right to erasure, differential privacy và federated learning." },
    },
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
    text: {
      title: { en: "1.5 AI Transparency & Explainability", vi: "1.5 AI Transparency & Explainability" },
      description: { en: "Model cards, system cards, SHAP, LIME, attention visualization, and explanation tradeoffs.", vi: "Model card, system card, SHAP, LIME, attention visualization và tradeoff giải thích." },
    },
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
    text: {
      title: { en: "1.6 Responsible AI in Production", vi: "1.6 Responsible AI in Production" },
      description: { en: "Moderation architecture, safety classifiers, human review, audit trails, incident response, and governance frameworks.", vi: "Moderation architecture, safety classifier, human review, audit trail, incident response và governance framework." },
    },
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

export const learningTableOfContents = {
  id: 'ai-ethics-safety-governance',
  text: {
    title: { en: "AI Ethics, Safety & Governance", vi: "AI Ethics, Safety & Governance" },
    description: { en: "Handle AI risk with practical discipline: bias, privacy, hallucination, evaluation, red teaming, safety filters, model cards, audit trails, governance checklists, and deployment review habits.", vi: "Quản lý rủi ro AI bằng kỷ luật thực tế: bias, privacy, hallucination, evaluation, red teaming, safety filter, model card, audit trail, checklist governance và thói quen review trước khi deploy." },
  },
  status: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

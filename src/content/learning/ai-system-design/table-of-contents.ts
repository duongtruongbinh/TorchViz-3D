import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'ai-system-design-framework',
    text: {
      title: { en: "1.1 AI System Design Framework", vi: "1.1 AI System Design Framework" },
      description: { en: "Requirements, AI task decomposition, data flow, model choice, scale, cost, reliability, and monitoring.", vi: "Requirement, tách tác vụ AI, data flow, chọn model, scale, cost, reliability và monitoring." },
    },
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
    text: {
      title: { en: "1.2 Classic AI System Designs", vi: "1.2 Classic AI System Designs" },
      description: { en: "Chatbot memory, RAG, recommendation, PDF Q&A at scale, and AI customer support patterns.", vi: "Pattern chatbot memory, RAG, recommendation, PDF Q&A ở scale lớn và AI customer support." },
    },
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
    text: {
      title: { en: "1.3 Inference Placement Strategy", vi: "1.3 Inference Placement Strategy" },
      description: { en: "Choose backend, client-side, edge, or async queue inference based on security, latency, and workload.", vi: "Chọn inference ở backend, client, edge hoặc async queue theo security, latency và workload." },
    },
    lessonIds: [
      'backend-api-inference',
      'client-side-inference',
      'edge-inference',
      'async-queue-inference',
    ],
  },
  {
    id: 'caching-strategies',
    text: {
      title: { en: "1.4 Caching Strategies", vi: "1.4 Caching Strategies" },
      description: { en: "Exact match caching, semantic caching, and prompt template caching for AI systems.", vi: "Exact match caching, semantic caching và prompt template caching cho hệ thống AI." },
    },
    lessonIds: [
      'exact-match-caching',
      'semantic-caching',
      'prompt-template-caching',
    ],
  },
  {
    id: 'async-ai-architecture',
    text: {
      title: { en: "1.5 Async AI Architecture", vi: "1.5 Async AI Architecture" },
      description: { en: "Use task APIs, workers, polling, and webhooks when AI work is slow, expensive, or batch-oriented.", vi: "Dùng task API, worker, polling và webhook khi tác vụ AI chậm, tốn kém hoặc chạy batch." },
    },
    lessonIds: [
      'when-to-use-async-ai',
      'async-task-api-pattern',
      'worker-processing-pattern',
      'polling-webhook-completion',
    ],
  },
  {
    id: 'cost-aware-architecture',
    text: {
      title: { en: "1.6 Cost-Aware Architecture", vi: "1.6 Cost-Aware Architecture" },
      description: { en: "Route models per feature and reduce cost with compression, limits, caching, downgrades, batching, and context control.", vi: "Route model theo feature và giảm cost bằng compression, giới hạn output, cache, downgrade, batching và tối ưu context." },
    },
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

export const learningTableOfContents = {
  id: 'ai-system-design',
  text: {
    title: { en: "AI System Design", vi: "AI System Design" },
    description: { en: "Design complete AI products: requirements, data flow, model choice, RAG, memory, recommendations, inference placement, caching, latency, cost, reliability, observability, and interview-ready tradeoffs.", vi: "Thiết kế sản phẩm AI hoàn chỉnh: requirement, data flow, chọn model, RAG, memory, recommendation, vị trí inference, caching, latency, cost, reliability, observability và tradeoff cho phỏng vấn." },
  },
  status: 'placeholder',
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

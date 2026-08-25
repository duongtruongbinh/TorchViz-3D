import type {
  LearningTableOfContents,
  LearningTocTrackSeed,
} from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'sdc-lora-paper',
    text: {
      title: {
        en: 'LLM > Continual Learning > (2026) SDC-LoRA',
        vi: 'LLM > Continual Learning > (2026) SDC-LoRA',
      },
      description: {
        en: 'Singular-Subspace Drift Controlled LoRA to Mitigate Knowledge Forgetting (ACL 2026).',
        vi: 'Kiểm soát trôi dạt không gian con kỳ dị trong LoRA nhằm giảm thiểu quên lãng tri thức (ACL 2026).',
      },
    },
    lessonIds: [
      {
        id: 'sdc-lora',
        title: {
          en: 'SDC-LoRA (ACL 2026)',
          vi: 'SDC-LoRA (ACL 2026)',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sdc-lora-experiments',
        title: {
          en: 'Experiment Results',
          vi: 'Experiment Results',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sdc-lora-insights',
        title: {
          en: 'Key Insights',
          vi: 'Key Insights',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sdc-lora-debate',
        title: {
          en: 'Academic Debates & Limits',
          vi: 'Tranh luận & Giới hạn',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sdc-lora-quiz',
        title: {
          en: 'Quiz: SDC-LoRA (ACL 2026)',
          vi: 'Quiz: SDC-LoRA (ACL 2026)',
        },
        status: 'available',
        contentStatus: 'published',
      },
    ],
  },
  {
    id: 'sculpting-subspaces-paper',
    text: {
      title: {
        en: 'LLM > Continual Learning > (ICLR 2026) Sculpting Subspaces',
        vi: 'LLM > Continual Learning > (ICLR 2026) Sculpting Subspaces',
      },
      description: {
        en: 'Constrained Full Fine-Tuning in LLMs for Continual Learning (Red Hat & IBM Research, ICLR 2026).',
        vi: 'Tinh chỉnh toàn phần có ràng buộc trong LLM cho Học liên tục (Red Hat & IBM Research, ICLR 2026).',
      },
    },
    lessonIds: [
      {
        id: 'sculpting-subspaces-abstract',
        title: {
          en: 'Part 1: Abstract',
          vi: 'Phần 1: Tóm tắt (Abstract)',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sculpting-subspaces-introduction',
        title: {
          en: 'Part 2: Introduction & Related Work',
          vi: 'Phần 2: Giới thiệu & Tổng quan Nghiên cứu',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sculpting-subspaces-method',
        title: {
          en: 'Part 3: Methodology',
          vi: 'Phần 3: Phương pháp & Cơ chế',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sculpting-subspaces-experiments',
        title: {
          en: 'Part 4: Experiments',
          vi: 'Phần 4: Kết quả Thực nghiệm',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sculpting-subspaces-conclusion',
        title: {
          en: 'Part 5: Conclusion & Discussion',
          vi: 'Phần 5: Kết luận & Hướng phát triển',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sculpting-subspaces-debate',
        title: {
          en: 'Part 6: Academic Debates & Critical Analysis',
          vi: 'Phần 6: Tranh luận Học thuật & Phản biện',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sculpting-subspaces-quiz',
        title: {
          en: 'Quiz: Sculpting Subspaces (ICLR 2026)',
          vi: 'Quiz: Sculpting Subspaces (ICLR 2026)',
        },
        status: 'available',
        contentStatus: 'published',
      },
    ],
  },
];

export const learningTableOfContents = {
  id: 'research-papers',
  text: {
    title: {
      en: 'Random Research Paper',
      vi: 'Random Research Paper',
    },
    description: {
      en: 'Deep dives into impactful machine learning and AI research papers: mathematical foundations, failure modes, novel mechanisms, and empirical findings.',
      vi: 'Phân tích chuyên sâu các bài báo nghiên cứu AI và Machine Learning nổi bật: nền tảng toán học, cơ chế hoạt động, phân tích lỗi và phát hiện thực nghiệm.',
    },
  },
  status: 'active',
  fallbackLocales: ['vi'],
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

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
        vi: 'Singular-Subspace Drift Controlled LoRA to Mitigate Knowledge Forgetting (ACL 2026).',
      },
    },
    lessonIds: [
      {
        id: 'sdc-lora',
        title: {
          en: 'Abstract',
          vi: 'Abstract',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sdc-lora-quiz',
        title: {
          en: 'Quiz: Abstract',
          vi: 'Quiz: Abstract',
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
      vi: 'Deep dives into impactful machine learning and AI research papers: mathematical foundations, failure modes, novel mechanisms, and empirical findings.',
    },
  },
  status: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

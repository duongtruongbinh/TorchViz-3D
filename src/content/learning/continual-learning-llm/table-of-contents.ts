import type {
  LearningTableOfContents,
  LearningTocLessonSeed,
  LearningTocTrackSeed,
} from '../../../core/learning/types.ts';

type ContinualLearningLessonPair = {
  trackId: string;
  theory: Exclude<LearningTocLessonSeed, string>;
  quiz: Exclude<LearningTocLessonSeed, string>;
};

type ContinualLearningLessonPairInput = {
  trackId: string;
  id: string;
  titleEn: string;
  titleVi: string;
};

function lessonPair({
  trackId,
  id,
  titleEn,
  titleVi,
}: ContinualLearningLessonPairInput): ContinualLearningLessonPair {
  return {
    trackId,
    theory: {
      id,
      title: { en: titleEn, vi: titleVi },
      status: 'available',
      contentStatus: 'published',
    },
    quiz: {
      id: `${id}-quiz`,
      title: { en: 'Quiz', vi: 'Quiz' },
      status: 'available',
      contentStatus: 'published',
    },
  };
}

export const continualLearningLessonPairs: readonly ContinualLearningLessonPair[] = [
  lessonPair({
    trackId: 'cl-llm-fundamentals',
    id: 'continual-learning-llm-overview',
    titleEn: 'Overview',
    titleVi: 'Tổng quan',
  }),
  lessonPair({
    trackId: 'cl-llm-fundamentals',
    id: 'stability-plasticity-dilemma',
    titleEn: 'Stability–Plasticity',
    titleVi: 'Stability–Plasticity',
  }),
  lessonPair({
    trackId: 'cl-llm-fundamentals',
    id: 'catastrophic-forgetting-in-llms',
    titleEn: 'Catastrophic Forgetting',
    titleVi: 'Catastrophic Forgetting',
  }),
  lessonPair({
    trackId: 'cl-llm-fundamentals',
    id: 'catastrophic-forgetting-code-lab',
    titleEn: 'Forgetting Lab',
    titleVi: 'Lab đo Forgetting',
  }),
  lessonPair({
    trackId: 'cl-llm-fundamentals',
    id: 'cl-settings-til-dil-cil',
    titleEn: 'Incremental Learning Settings',
    titleVi: 'Phân loại kịch bản CL',
  }),
  lessonPair({
    trackId: 'cl-llm-fundamentals',
    id: 'vertical-horizontal-continuity',
    titleEn: 'Vertical and Horizontal CL',
    titleVi: 'Vertical và Horizontal CL',
  }),
  lessonPair({
    trackId: 'cl-llm-fundamentals',
    id: 'cl-methods-taxonomy-and-replay',
    titleEn: 'Forgetting Solution Families',
    titleVi: 'Nhóm giải pháp giảm quên',
  }),
  lessonPair({
    trackId: 'cl-llm-methods',
    id: 'replay-introduction',
    titleEn: 'Replay',
    titleVi: 'Replay',
  }),
  lessonPair({
    trackId: 'cl-llm-methods',
    id: 'replay-experience-code-lab',
    titleEn: 'Experience Replay Lab',
    titleVi: 'Lab Experience Replay',
  }),
  lessonPair({
    trackId: 'cl-llm-methods',
    id: 'parameter-regularization-ewc',
    titleEn: 'Regularization-Based Methods',
    titleVi: 'Regularization-Based Methods',
  }),
  lessonPair({
    trackId: 'cl-llm-methods',
    id: 'architecture-expansion-isolation',
    titleEn: 'Architecture Expansion',
    titleVi: 'Architecture Expansion',
  }),

  lessonPair({
    trackId: 'cl-llm-continuity',
    id: 'supplier-consumer-pipeline',
    titleEn: 'Supplier–Consumer Pipeline',
    titleVi: 'Pipeline Supplier–Consumer',
  }),
  lessonPair({
    trackId: 'cl-llm-continuity',
    id: 'vertical-cl-deep-dive',
    titleEn: 'Vertical Continual Learning',
    titleVi: 'Vertical Continual Learning',
  }),
  lessonPair({
    trackId: 'cl-llm-continuity',
    id: 'vertical-forgetting',
    titleEn: 'Vertical Forgetting',
    titleVi: 'Vertical Forgetting',
  }),
  lessonPair({
    trackId: 'cl-llm-continuity',
    id: 'horizontal-cl-deep-dive',
    titleEn: 'Horizontal Continual Learning',
    titleVi: 'Horizontal Continual Learning',
  }),
  lessonPair({
    trackId: 'cl-llm-continuity',
    id: 'horizontal-forgetting',
    titleEn: 'Horizontal Forgetting',
    titleVi: 'Horizontal Forgetting',
  }),
  lessonPair({
    trackId: 'cl-llm-continuity',
    id: 'continuity-to-learning-stages',
    titleEn: 'Chapter 4 Map',
    titleVi: 'Bản đồ sang Chương 4',
  }),

  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'continual-pretraining-pipeline',
    titleEn: 'Continual Pre-Training',
    titleVi: 'Continual Pre-training',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'cpt-effectiveness-efficiency',
    titleEn: 'CPT Efficiency',
    titleVi: 'Chi phí CPT',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'cpt-observations',
    titleEn: 'CPT Observations',
    titleVi: 'Ba quan sát về CPT',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'cpt-distribution-shifts',
    titleEn: 'CPT Distribution Shifts',
    titleVi: 'Các dạng shift trong CPT',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'cpt-other-directions',
    titleEn: 'Other CPT Directions',
    titleVi: 'Các hướng CPT khác',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'domain-adaptive-pretraining',
    titleEn: 'Domain-Adaptive Pre-Training',
    titleVi: 'Domain-Adaptive Pre-training',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'dap-observations',
    titleEn: 'DAP Observations',
    titleVi: 'Ba quan sát về DAP',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'dap-domain-landscape',
    titleEn: 'DAP Across Domains',
    titleVi: 'DAP theo từng domain',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'continual-finetuning-overview',
    titleEn: 'Continual Fine-Tuning',
    titleVi: 'Continual Fine-tuning',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'continual-instruction-tuning',
    titleEn: 'Continual Instruction Tuning',
    titleVi: 'Continual Instruction Tuning',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'continual-model-refinement',
    titleEn: 'Continual Model Refinement',
    titleVi: 'Continual Model Refinement',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'continual-model-alignment',
    titleEn: 'Continual Model Alignment',
    titleVi: 'Continual Model Alignment',
  }),
  lessonPair({
    trackId: 'cl-llm-stages',
    id: 'continual-multimodal-llms',
    titleEn: 'Continual Multimodal LLMs',
    titleVi: 'Continual Multimodal LLM',
  }),

  lessonPair({
    trackId: 'cl-llm-evaluation',
    id: 'core-cl-metrics',
    titleEn: 'Continual Learning Metrics',
    titleVi: 'Các thước đo đánh giá CL',
  }),
  lessonPair({
    trackId: 'cl-llm-evaluation',
    id: 'lama-knowledge-evaluation',
    titleEn: 'Extended Evaluation Methods',
    titleVi: 'Một số cách đánh giá mở rộng',
  }),
  lessonPair({
    trackId: 'cl-llm-evaluation',
    id: 'continual-learning-benchmarks',
    titleEn: 'Datasets and Benchmarks',
    titleVi: 'Dataset và Benchmark',
  }),

  lessonPair({
    trackId: 'cl-llm-discussion',
    id: 'anticipatory-recovering',
    titleEn: 'Anticipatory Recovering',
    titleVi: 'Anticipatory Recovering',
  }),
  lessonPair({
    trackId: 'cl-llm-discussion',
    id: 'til-dil-cil-new-roles',
    titleEn: 'New Roles of TIL, DIL, and CIL',
    titleVi: 'Vai trò mới của TIL, DIL, CIL',
  }),
  lessonPair({
    trackId: 'cl-llm-discussion',
    id: 'memory-bottlenecks',
    titleEn: 'The Role of Memory',
    titleVi: 'Vai trò của Memory',
  }),
  lessonPair({
    trackId: 'cl-llm-discussion',
    id: 'continual-llm-research-frontiers',
    titleEn: 'Future Directions',
    titleVi: 'Hướng nghiên cứu tương lai',
  }),
  lessonPair({
    trackId: 'cl-llm-discussion',
    id: 'continual-llm-conclusion',
    titleEn: 'Conclusion',
    titleVi: 'Kết luận',
  }),
];

const continualLearningSynthesisLesson = {
  id: 'continual-llm-synthesis',
  title: { en: 'Course Synthesis', vi: 'Bản đồ tổng hợp' },
  status: 'available',
  contentStatus: 'published',
} satisfies Exclude<LearningTocLessonSeed, string>;

function lessonIdsForTrack(trackId: string): LearningTocLessonSeed[] {
  return continualLearningLessonPairs
    .filter((pair) => pair.trackId === trackId)
    .flatMap((pair) => [pair.theory, pair.quiz]);
}

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'cl-llm-fundamentals',
    text: {
      title: {
        en: "1. Continual Learning Fundamentals",
        vi: "1. Nền tảng Continual Learning",
      },
      description: {
        en: "Core concepts of continual learning for LLMs, plastic-elastic tradeoff, stability-plasticity dilemma, and catastrophic forgetting.",
        vi: "Khái niệm cốt lõi của continual learning cho LLM, đánh đổi giữa độ linh hoạt và độ ổn định, và thảm họa quên tri thức (catastrophic forgetting).",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-fundamentals'),
  },
  {
    id: 'cl-llm-methods',
    text: {
      title: {
        en: "2. Main Approaches",
        vi: "2. Các hướng tiếp cận chính",
      },
      description: {
        en: "Four foundational retention strategies: replaying old data, constraining parameter updates, isolating or expanding model capacity, and distilling behavior from an earlier checkpoint.",
        vi: "Bốn chiến lược giữ năng lực cũ: phát lại dữ liệu, ràng buộc cập nhật tham số, cô lập hoặc mở rộng capacity, và distill hành vi từ checkpoint trước.",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-methods'),
  },
  {
    id: 'cl-llm-continuity',
    text: {
      title: {
        en: "3. Vertical & Horizontal Continual Learning",
        vi: "3. Vertical & Horizontal Continual Learning",
      },
      description: {
        en: "The supplier–consumer pipeline, vertical forgetting, horizontal forgetting, and the constraints unique to each direction.",
        vi: "Pipeline supplier–consumer, vertical forgetting, horizontal forgetting và các ràng buộc riêng của từng chiều.",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-continuity'),
  },
  {
    id: 'cl-llm-stages',
    text: {
      title: {
        en: "4. Continual Learning Stages for LLMs",
        vi: "4. Các giai đoạn học liên tục của LLM",
      },
      description: {
        en: "Continual pre-training, domain-adaptive pre-training, and continual fine-tuning as organized by the survey.",
        vi: "Continual pre-training, domain-adaptive pre-training và continual fine-tuning theo taxonomy của survey.",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-stages'),
  },
  {
    id: 'cl-llm-evaluation',
    text: {
      title: {
        en: "5. Evaluation Metrics & Benchmarks",
        vi: "5. Metric và Benchmark đánh giá",
      },
      description: {
        en: "General CL metrics, LAMA, FUAR, X-Delta, and benchmark families used across continual LLM settings.",
        vi: "Metric CL tổng quát, LAMA, FUAR, X-Delta và các nhóm benchmark cho continual LLM.",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-evaluation'),
  },
  {
    id: 'cl-llm-discussion',
    text: {
      title: {
        en: "6. Discussion & Future Directions",
        vi: "6. Discussion và hướng nghiên cứu",
      },
      description: {
        en: "Emergent properties, changing CL settings, memory bottlenecks, and future research directions from the survey.",
        vi: "Emergent properties, vai trò mới của các CL setting, nút thắt memory và các hướng nghiên cứu từ survey.",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-discussion'),
  },
  {
    id: 'cl-llm-synthesis',
    text: {
      title: {
        en: "7. Course Synthesis",
        vi: "7. Tổng hợp toàn khóa",
      },
      description: {
        en: "Connect objectives, continual-learning settings, training stages, constraints, methods, and evidence into one reusable reading framework.",
        vi: "Nối objective, kịch bản CL, stage huấn luyện, ràng buộc, phương pháp và bằng chứng thành một khung đọc thống nhất.",
      },
    },
    lessonIds: [continualLearningSynthesisLesson],
  },
];

export const learningTableOfContents = {
  id: 'continual-learning-llm',
  text: {
    title: {
      en: "Continual Learning for LLMs",
      vi: "Continual Learning cho LLMs",
    },
    description: {
      en: "Learn continual learning for LLMs through the concepts, methods, evaluation protocols, training stages, and research directions synthesized by Shi et al. (2025).",
      vi: "Học Continual Learning cho LLM qua khái niệm, phương pháp, protocol đánh giá, các giai đoạn huấn luyện và hướng nghiên cứu được Shi et al. (2025) tổng hợp.",
    },
  },
  status: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

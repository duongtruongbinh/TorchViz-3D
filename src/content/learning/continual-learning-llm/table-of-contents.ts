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
    titleEn: 'What Is Replay?',
    titleVi: 'Replay là gì?',
  }),
  lessonPair({
    trackId: 'cl-llm-methods',
    id: 'replay-experience-code-lab',
    titleEn: 'Experience Replay Lab',
    titleVi: 'Lab Experience Replay',
  }),

  lessonPair({
    trackId: 'cl-llm-pretraining-adaptation',
    id: 'continual-pretraining-pipeline',
    titleEn: 'Continual Pre-Training Pipeline',
    titleVi: 'Pipeline Continual Pre-training',
  }),
  lessonPair({
    trackId: 'cl-llm-pretraining-adaptation',
    id: 'cpt-effectiveness-efficiency',
    titleEn: 'CPT Effectiveness and Cost',
    titleVi: 'Hiệu quả và chi phí CPT',
  }),
  lessonPair({
    trackId: 'cl-llm-pretraining-adaptation',
    id: 'cpt-distribution-shifts',
    titleEn: 'CPT Distribution Shifts',
    titleVi: 'Các dạng shift trong CPT',
  }),
  lessonPair({
    trackId: 'cl-llm-pretraining-adaptation',
    id: 'domain-adaptive-pretraining',
    titleEn: 'Domain-Adaptive Pre-Training',
    titleVi: 'Domain-Adaptive Pre-training',
  }),
  lessonPair({
    trackId: 'cl-llm-pretraining-adaptation',
    id: 'dap-vertical-forgetting',
    titleEn: 'Vertical Forgetting in DAP',
    titleVi: 'Vertical Forgetting trong DAP',
  }),
  lessonPair({
    trackId: 'cl-llm-pretraining-adaptation',
    id: 'domain-adaptation-data-mixing',
    titleEn: 'Data Selection and Mixing',
    titleVi: 'Chọn và trộn dữ liệu',
  }),

  lessonPair({
    trackId: 'cl-llm-instruction-tuning-alignment',
    id: 'continual-finetuning-overview',
    titleEn: 'Continual Fine-Tuning',
    titleVi: 'Continual Fine-tuning',
  }),
  lessonPair({
    trackId: 'cl-llm-instruction-tuning-alignment',
    id: 'continual-instruction-tuning',
    titleEn: 'Continual Instruction Tuning',
    titleVi: 'Continual Instruction Tuning',
  }),
  lessonPair({
    trackId: 'cl-llm-instruction-tuning-alignment',
    id: 'continual-model-refinement',
    titleEn: 'Continual Model Refinement',
    titleVi: 'Continual Model Refinement',
  }),
  lessonPair({
    trackId: 'cl-llm-instruction-tuning-alignment',
    id: 'continual-model-alignment',
    titleEn: 'Continual Model Alignment',
    titleVi: 'Continual Model Alignment',
  }),
  lessonPair({
    trackId: 'cl-llm-instruction-tuning-alignment',
    id: 'continual-multimodal-llms',
    titleEn: 'Continual Multimodal LLMs',
    titleVi: 'Continual Multimodal LLM',
  }),

  lessonPair({
    trackId: 'cl-llm-replay-memory',
    id: 'experience-replay-buffers',
    titleEn: 'Experience Replay',
    titleVi: 'Experience Replay',
  }),
  lessonPair({
    trackId: 'cl-llm-replay-memory',
    id: 'coreset-selection-strategies',
    titleEn: 'Coreset Selection',
    titleVi: 'Chọn Coreset',
  }),
  lessonPair({
    trackId: 'cl-llm-replay-memory',
    id: 'generative-replay-llm',
    titleEn: 'Generative Replay',
    titleVi: 'Generative Replay',
  }),
  lessonPair({
    trackId: 'cl-llm-replay-memory',
    id: 'efficient-replay-selection',
    titleEn: 'Efficient Replay',
    titleVi: 'Chọn Replay hiệu quả',
  }),
  lessonPair({
    trackId: 'cl-llm-replay-memory',
    id: 'memory-constraint-spectrum',
    titleEn: 'Memory Constraints',
    titleVi: 'Ràng buộc bộ nhớ',
  }),
  lessonPair({
    trackId: 'cl-llm-replay-memory',
    id: 'controllable-external-memory',
    titleEn: 'External Memory',
    titleVi: 'Bộ nhớ ngoài',
  }),

  lessonPair({
    trackId: 'cl-llm-methods',
    id: 'parameter-regularization-ewc',
    titleEn: 'Regularization and EWC',
    titleVi: 'Regularization và EWC',
  }),
  lessonPair({
    trackId: 'cl-llm-methods',
    id: 'architecture-expansion-isolation',
    titleEn: 'Expansion and Isolation',
    titleVi: 'Mở rộng và cô lập tham số',
  }),
  lessonPair({
    trackId: 'cl-llm-regularization-peft',
    id: 'modular-lora-adapters',
    titleEn: 'LoRA and Adapters',
    titleVi: 'LoRA và Adapter',
  }),
  lessonPair({
    trackId: 'cl-llm-regularization-peft',
    id: 'continual-moe-expansion',
    titleEn: 'Continual MoE',
    titleVi: 'Continual MoE',
  }),
  lessonPair({
    trackId: 'cl-llm-regularization-peft',
    id: 'optimization-representation-preservation',
    titleEn: 'Representation Preservation',
    titleVi: 'Bảo tồn biểu diễn',
  }),

  lessonPair({
    trackId: 'cl-llm-evaluation-benchmarks',
    id: 'core-cl-metrics',
    titleEn: 'OP, F, BWT, and FWT',
    titleVi: 'OP, F, BWT và FWT',
  }),
  lessonPair({
    trackId: 'cl-llm-evaluation-benchmarks',
    id: 'knowledge-update-metrics',
    titleEn: 'FUAR and X-Delta',
    titleVi: 'FUAR và X-Delta',
  }),
  lessonPair({
    trackId: 'cl-llm-evaluation-benchmarks',
    id: 'continual-evaluation-protocols',
    titleEn: 'Evaluation Protocols',
    titleVi: 'Protocol đánh giá',
  }),
  lessonPair({
    trackId: 'cl-llm-evaluation-benchmarks',
    id: 'continual-learning-benchmarks',
    titleEn: 'Continual Learning Benchmarks',
    titleVi: 'Benchmark Continual Learning',
  }),
  lessonPair({
    trackId: 'cl-llm-evaluation-benchmarks',
    id: 'realistic-long-sequence-benchmarks',
    titleEn: 'Long-Sequence Benchmarks',
    titleVi: 'Benchmark chuỗi dài',
  }),
  lessonPair({
    trackId: 'cl-llm-evaluation-benchmarks',
    id: 'continual-monitoring-production',
    titleEn: 'Production Monitoring',
    titleVi: 'Giám sát production',
  }),
  lessonPair({
    trackId: 'cl-llm-evaluation-benchmarks',
    id: 'continual-llm-research-frontiers',
    titleEn: 'Research Frontiers',
    titleVi: 'Hướng nghiên cứu mới',
  }),
];

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
        en: "1.1 Fundamentals & Catastrophic Forgetting",
        vi: "1.1 Nền tảng Continual Learning & Catastrophic Forgetting",
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
        en: "1.2 Replay, Regularization & Architecture",
        vi: "1.2 Replay, Regularization & Architecture",
      },
      description: {
        en: "The three foundational continual-learning intervention families: replaying old data, constraining parameter updates, and isolating or expanding model capacity.",
        vi: "Ba nhóm can thiệp nền tảng: phát lại dữ liệu cũ, ràng buộc cập nhật tham số, và cô lập hoặc mở rộng capacity của mô hình.",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-methods'),
  },
  {
    id: 'cl-llm-pretraining-adaptation',
    text: {
      title: {
        en: "1.3 Continual Pre-training & Domain Adaptation",
        vi: "1.3 Continual Pre-training & Chuyển đổi Miền Tri thức",
      },
      description: {
        en: "Updating base model knowledge with dynamic text streams, domain-specific corpora, token distribution shifts, and vocabulary adaptation.",
        vi: "Cập nhật tri thức mô hình nền tảng với luồng dữ liệu liên tục, corpus chuyên ngành, sự dịch chuyển phân bố token và thích ứng từ vựng.",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-pretraining-adaptation'),
  },
  {
    id: 'cl-llm-instruction-tuning-alignment',
    text: {
      title: {
        en: "1.4 Continual Instruction Tuning & Alignment",
        vi: "1.4 Continual Instruction Tuning & Alignment",
      },
      description: {
        en: "Maintaining alignment, instruction-following skills, and safety guardrails across sequential task fine-tuning.",
        vi: "Duy trì tính alignment, khả năng tuân thủ chỉ thị và rào chắn an toàn qua các giai đoạn fine-tuning liên tục.",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-instruction-tuning-alignment'),
  },
  {
    id: 'cl-llm-replay-memory',
    text: {
      title: {
        en: "1.5 Replay & Memory-Based Methods",
        vi: "1.5 Phương pháp Replay & Bộ nhớ Phụ trợ",
      },
      description: {
        en: "Experience replay, buffer selection strategies, generative replay, and external memory architectures.",
        vi: "Tái sử dụng dữ liệu (replay buffer), chiến lược chọn mẫu, generative replay và các kiến trúc bộ nhớ ngoài.",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-replay-memory'),
  },
  {
    id: 'cl-llm-regularization-peft',
    text: {
      title: {
        en: "1.6 Regularization & PEFT Continual Learning",
        vi: "1.6 Regularization & PEFT trong Continual Learning",
      },
      description: {
        en: "EWC, weight regularization, mixture-of-experts (MoE) expansion, modular LoRA/adapter isolation, and parameter allocation.",
        vi: "EWC, ràng buộc trọng số, mở rộng Mixture-of-Experts (MoE), cô lập modular LoRA/adapter và phân bổ tham số.",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-regularization-peft'),
  },
  {
    id: 'cl-llm-evaluation-benchmarks',
    text: {
      title: {
        en: "1.7 Evaluation, Benchmarks & Research Frontiers",
        vi: "1.7 Đánh giá, Benchmark & Hướng Nghiên cứu",
      },
      description: {
        en: "Forgetting and transfer metrics, continual evaluation protocols, realistic benchmarks, production monitoring, and open research questions.",
        vi: "Metric về quên và chuyển giao, protocol đánh giá, benchmark thực tế, giám sát production và các câu hỏi nghiên cứu mở.",
      },
    },
    lessonIds: lessonIdsForTrack('cl-llm-evaluation-benchmarks'),
  },
];

export const learningTableOfContents = {
  id: 'continual-learning-llm',
  text: {
    title: {
      en: "Continual Learning",
      vi: "Continual Learning",
    },
    description: {
      en: "Master continual learning techniques for Large Language Models: catastrophic forgetting mitigation, continual pre-training, instruction tuning, experience replay, PEFT adapters, regularization, and benchmark evaluation.",
      vi: "Master các kỹ thuật Continual Learning cho Large Language Model: giảm catastrophic forgetting, continual pre-training, instruction tuning, experience replay, PEFT adapters, regularization và đánh giá benchmark.",
    },
  },
  status: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

import type {
  LearningContentStatus,
  LearningLessonStatus,
  LearningTableOfContents,
  LearningTocLessonSeed,
  LearningTocTrackSeed,
} from '../../../core/learning/types.ts';

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
    lessonIds: [
      lessonSeed(
        'continual-learning-llm-overview',
        'Overview',
        'Overview',
        'available',
        'published',
      ),
      lessonSeed(
        'continual-learning-llm-overview-quiz',
        'Quiz',
        'Quiz',
        'available',
        'published',
      ),
      lessonSeed(
        'catastrophic-forgetting-in-llms',
        'Catastrophic Forgetting in LLMs',
        'Catastrophic Forgetting trong LLM',
        'available',
        'published',
      ),
      lessonSeed(
        'catastrophic-forgetting-in-llms-quiz',
        'Quiz: Catastrophic Forgetting',
        'Quiz: Catastrophic Forgetting',
        'available',
        'published',
      ),
      lessonSeed(
        'catastrophic-forgetting-code-lab',
        'Lab: Đo lường Catastrophic Forgetting',
        'Lab: Đo lường Catastrophic Forgetting',
        'available',
        'published',
      ),
      'stability-plasticity-dilemma',
      'cl-vs-traditional-finetuning',
    ],
  },
  {
    id: 'cl-llm-pretraining-adaptation',
    text: {
      title: {
        en: "1.2 Continual Pre-training & Domain Adaptation",
        vi: "1.2 Continual Pre-training & Chuyển đổi Miền Tri thức",
      },
      description: {
        en: "Updating base model knowledge with dynamic text streams, domain-specific corpora, token distribution shifts, and vocabulary adaptation.",
        vi: "Cập nhật tri thức mô hình nền tảng với luồng dữ liệu liên tục, corpus chuyên ngành, sự dịch chuyển phân bố token và thích ứng từ vựng.",
      },
    },
    lessonIds: [
      'continual-pretraining-pipeline',
      'domain-adaptation-data-mixing',
      'token-distribution-shift',
      'vocabulary-expansion-adaptation',
    ],
  },
  {
    id: 'cl-llm-instruction-tuning-alignment',
    text: {
      title: {
        en: "1.3 Continual Instruction Tuning & Alignment",
        vi: "1.3 Continual Instruction Tuning & Alignment",
      },
      description: {
        en: "Maintaining alignment, instruction-following skills, and safety guardrails across sequential task fine-tuning.",
        vi: "Duy trì tính alignment, khả năng tuân thủ chỉ thị và rào chắn an toàn qua các giai đoạn fine-tuning liên tục.",
      },
    },
    lessonIds: [
      'continual-instruction-tuning',
      'safety-alignment-preservation',
      'preference-learning-drift',
      'multi-task-continual-sft',
    ],
  },
  {
    id: 'cl-llm-replay-memory',
    text: {
      title: {
        en: "1.4 Replay & Memory-Based Methods",
        vi: "1.4 Phương pháp Replay & Bộ nhớ Phụ trợ",
      },
      description: {
        en: "Experience replay, buffer selection strategies, generative replay, and external memory architectures.",
        vi: "Tái sử dụng dữ liệu (replay buffer), chiến lược chọn mẫu, generative replay và các kiến trúc bộ nhớ ngoài.",
      },
    },
    lessonIds: [
      'experience-replay-buffers',
      'generative-replay-llm',
      'coreset-selection-strategies',
      'retrieval-augmented-continual-learning',
    ],
  },
  {
    id: 'cl-llm-regularization-peft',
    text: {
      title: {
        en: "1.5 Regularization & PEFT Continual Learning",
        vi: "1.5 Regularization & PEFT trong Continual Learning",
      },
      description: {
        en: "EWC, weight regularization, mixture-of-experts (MoE) expansion, modular LoRA/adapter isolation, and parameter allocation.",
        vi: "EWC, ràng buộc trọng số, mở rộng Mixture-of-Experts (MoE), cô lập modular LoRA/adapter và phân bổ tham số.",
      },
    },
    lessonIds: [
      'ewc-weight-regularization',
      'modular-lora-adapters',
      'continual-moe-expansion',
      'parameter-allocation-isolation',
    ],
  },
  {
    id: 'cl-llm-evaluation-benchmarks',
    text: {
      title: {
        en: "1.6 Evaluation, Benchmarks & Safety",
        vi: "1.6 Đánh giá, Benchmarks & Safety cho Continual LLMs",
      },
      description: {
        en: "Forward/backward transfer metrics, forgetting metrics, benchmark datasets, continuous monitoring, and production safety.",
        vi: "Chỉ số chuyển giao tri thức (forward/backward transfer), chỉ số quên, bộ benchmark chuẩn, giám sát liên tục và an toàn vận hành.",
      },
    },
    lessonIds: [
      'forward-backward-transfer-metrics',
      'continual-learning-benchmarks',
      'evaluating-forgetting-at-scale',
      'continuous-monitoring-production',
    ],
  },
];

export const learningTableOfContents = {
  id: 'continual-learning-llm',
  text: {
    title: {
      en: "Continual Learning of LLM",
      vi: "Continual Learning của LLM",
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

function lessonSeed(
  id: string,
  titleEn: string,
  titleVi: string,
  status?: LearningLessonStatus,
  contentStatus: LearningContentStatus = 'missing',
): LearningTocLessonSeed {
  if (contentStatus !== 'published') {
    return {
      id,
      title: { en: titleEn, vi: titleVi },
    };
  }

  return {
    id,
    title: { en: titleEn, vi: titleVi },
    status,
    contentStatus,
  };
}

import type {
  LearningTableOfContents,
  LearningTocLessonSeed,
  LearningTocTrackSeed,
} from '../../../core/learning/types.ts';

export type LlmUnlearningLessonPair = {
  trackId: string;
  theoryId: string;
  quizId: string;
  title: { en: string; vi: string };
};

const pair = (
  trackId: string,
  theoryId: string,
  title: LlmUnlearningLessonPair['title'],
): LlmUnlearningLessonPair => ({
  trackId,
  theoryId,
  quizId: `${theoryId}-quiz`,
  title,
});

export const llmUnlearningLessonPairs: LlmUnlearningLessonPair[] = [
  pair('llm-unlearning-fundamentals', 'llm-unlearning-overview', {
    en: 'Machine Unlearning for LLMs: Overview',
    vi: 'Tổng quan Machine Unlearning cho LLMs',
  }),
  pair('llm-unlearning-fundamentals', 'memorization-extraction-attacks', {
    en: 'Memorization & Data Extraction Attacks',
    vi: 'Ghi nhớ Dữ liệu & Tấn công Trích xuất',
  }),
  pair('llm-unlearning-fundamentals', 'system-prompt-vs-retraining', {
    en: 'The Naive Fallacies: System Prompt vs Full Retraining',
    vi: 'Ảo tưởng Tiếp cận: System Prompt vs Full Retraining',
  }),
  pair('llm-unlearning-fundamentals', 'formal-unlearning-formulation', {
    en: 'Formal Definition: (Epsilon, Delta)-Unlearning',
    vi: 'Định nghĩa Hình thức: (Epsilon, Delta)-Unlearning',
  }),
  pair('llm-unlearning-fundamentals', 'unlearning-request-granularity-and-boundaries', {
    en: 'Request Granularity & Problem Boundaries',
    vi: 'Mức độ Yêu cầu & Ranh giới Bài toán',
  }),
  pair('llm-unlearning-fundamentals', 'whos-harry-potter-case-study', {
    en: "Case Study: 'Who's Harry Potter?'",
    vi: "Case Study: 'Who's Harry Potter?'",
  }),

  pair('non-llm-unlearning-foundations', 'sisa-architecture-sharding', {
    en: 'SISA Architecture: Sharding & Retraining Limits',
    vi: 'Kiến trúc SISA: Phân mảnh & Giới hạn Retraining',
  }),
  pair('non-llm-unlearning-foundations', 'kmeans-quantized-centroids', {
    en: 'K-Means & Bounded Quantized Centroids Unlearning',
    vi: 'K-Means & Quantized Centroids trong Machine Unlearning',
  }),
  pair('non-llm-unlearning-foundations', 'why-non-llm-fails-on-transformers', {
    en: 'Why Traditional Unlearning Fails on Generative Transformers',
    vi: 'Vì sao Unlearning Truyền thống Thất bại trên Transformer Sinh',
  }),

  pair('tofu-benchmark-dataset-design', 'fictitious-unlearning-need', {
    en: 'Why Synthetic Data? Ground-Truth Isolation in TOFU',
    vi: 'Vì sao Cần Dữ liệu Hư cấu? Cách ly Ground-Truth trong TOFU',
  }),
  pair('tofu-benchmark-dataset-design', 'tofu-split-mechanisms', {
    en: 'TOFU Dataset Splits: Forget, Retain, Real & World',
    vi: 'Phân chia Tập Dữ liệu TOFU: Forget, Retain, Real & World',
  }),
  pair('tofu-benchmark-dataset-design', 'gold-retrained-model-benchmark', {
    en: 'The Gold Retrained Model: The Theoretical Upper Bound',
    vi: 'Mô hình Retrain Vàng: Giới hạn Lý thuyết Hoàn hảo',
  }),
  pair('tofu-benchmark-dataset-design', 'unlearning-dataset-design-axes', {
    en: 'Dataset Design Axes for LLM Unlearning',
    vi: 'Các Trục Thiết kế Dữ liệu cho LLM Unlearning',
  }),
  pair('tofu-benchmark-dataset-design', 'unlearning-benchmark-landscape', {
    en: 'The LLM Unlearning Benchmark Landscape',
    vi: 'Toàn cảnh Benchmark LLM Unlearning',
  }),

  pair('core-unlearning-baselines', 'llm-unlearning-method-taxonomy', {
    en: 'Method Taxonomy: When Does Unlearning Happen?',
    vi: 'Phân loại Phương pháp: Unlearning Diễn ra Khi nào?',
  }),
  pair('core-unlearning-baselines', 'gradient-ascent-collapse', {
    en: 'Gradient Ascent (GA) & Catastrophic Fluency Collapse',
    vi: 'Gradient Ascent (GA) & Thảm họa Sụp đổ Ngôn ngữ',
  }),
  pair('core-unlearning-baselines', 'gradient-difference-balance', {
    en: 'Gradient Difference (GD): Balancing Forgetting and Utility',
    vi: 'Gradient Difference (GD): Cân bằng Quên và Duy trì',
  }),
  pair('core-unlearning-baselines', 'kl-minimization-mode-seeking', {
    en: 'KL Minimization, Mode-Seeking Dynamics & Reward Hacking',
    vi: 'KL Minimization, Động lực Mode-Seeking & Reward Hacking',
  }),
  pair('core-unlearning-baselines', 'dpo-unlearning-preference', {
    en: 'Preference Optimization: Adapting DPO for Fact Erasure',
    vi: 'Tối ưu Sở thích: Ứng dụng DPO để Xóa Tri thức',
  }),
  pair('core-unlearning-baselines', 'sft-objective-families', {
    en: 'SFT Objective Families for Unlearning',
    vi: 'Các Họ Mục tiêu SFT cho Unlearning',
  }),
  pair('core-unlearning-baselines', 'rl-and-parameter-localization', {
    en: 'Reinforcement Learning & Parameter Localization',
    vi: 'Reinforcement Learning & Định vị Tham số',
  }),
  pair('core-unlearning-baselines', 'modular-and-composite-unlearning', {
    en: 'Modular & Composite Unlearning',
    vi: 'Unlearning theo Module & Phương pháp Kết hợp',
  }),
  pair('core-unlearning-baselines', 'inference-time-unlearning', {
    en: 'Inference-Time Unlearning',
    vi: 'Unlearning tại Thời điểm Suy luận',
  }),

  pair('unlearning-evaluation-metrics', 'tripartite-evaluation-metrics', {
    en: 'The Tripartite Metrics: Probability, ROUGE & Truth Ratio',
    vi: 'Bộ ba Đo lường: Probability, ROUGE & Truth Ratio',
  }),
  pair('unlearning-evaluation-metrics', 'knowledge-memorization-metrics', {
    en: 'Knowledge & Memorization Metrics',
    vi: 'Thước đo Tri thức & Ghi nhớ',
  }),
  pair('unlearning-evaluation-metrics', 'utility-robustness-efficiency-metrics', {
    en: 'Utility, Robustness & Efficiency Metrics',
    vi: 'Thước đo Hữu dụng, Bền vững & Hiệu quả',
  }),
  pair('unlearning-evaluation-metrics', 'empirical-results-phi-llama', {
    en: 'Empirical Audit on Phi-1.5 & LLaMA-2: Baseline Failures',
    vi: 'Thực nghiệm trên Phi-1.5 & LLaMA-2: Sự Thất bại của Baseline',
  }),
  pair('unlearning-evaluation-metrics', 'forget-quality-utility-tradeoff', {
    en: 'The Pareto Barrier: Forget Quality vs Model Utility',
    vi: 'Rào cản Pareto: Chất lượng Quên vs Độ Hữu dụng Mô hình',
  }),

  pair('mechanistic-frontiers-challenges', 'entangled-knowledge-representations', {
    en: 'Entangled Knowledge Representations in Weight Subspaces',
    vi: 'Vùng Biểu diễn Đan xen trong Không gian Trọng số',
  }),
  pair('mechanistic-frontiers-challenges', 'relearning-jailbreak-vulnerabilities', {
    en: 'Adversarial Vulnerabilities: Relearning Speed & Jailbreaks',
    vi: 'Lỗ hổng Đối kháng: Tốc độ Học lại & Jailbreak',
  }),
  pair('mechanistic-frontiers-challenges', 'definition-effects-and-scaling-challenges', {
    en: 'Definition, Data Effects & Scaling Challenges',
    vi: 'Thách thức về Định nghĩa, Dữ liệu & Quy mô',
  }),
  pair('mechanistic-frontiers-challenges', 'robust-verifiable-and-beyond-data-unlearning', {
    en: 'Robust, Verifiable & Beyond-Data Unlearning',
    vi: 'Unlearning Bền vững, Kiểm chứng được & Vượt ngoài Dữ liệu',
  }),
  pair('mechanistic-frontiers-challenges', 'llm-lifecycle-management-future', {
    en: 'Unlearning in LLM Lifecycle Management: Future Horizons',
    vi: 'Unlearning trong Vòng đời LLM: Chân trời Tương lai',
  }),
];

const codeLabs: Record<string, LearningTocLessonSeed> = {
  'tofu-benchmark-dataset-design': {
    id: 'tofu-open-unlearning-setup-code-lab',
    status: 'available',
    contentStatus: 'missing',
    title: {
      en: 'Lab: TOFU Pipeline with Open-Unlearning',
      vi: 'Lab: Thiết lập TOFU với Open-Unlearning',
    },
  },
  'core-unlearning-baselines': {
    id: 'unlearning-baselines-training-code-lab',
    status: 'available',
    contentStatus: 'missing',
    title: {
      en: 'Lab: Training Baselines with Open-Unlearning',
      vi: 'Lab: Huấn luyện Baselines với Open-Unlearning',
    },
  },
  'unlearning-evaluation-metrics': {
    id: 'streamlit-unlearning-inspector-code-lab',
    status: 'available',
    contentStatus: 'missing',
    title: {
      en: 'Lab: Streamlit Interactive Unlearning Inspector',
      vi: 'Lab: Streamlit Kiểm định Unlearning Trực quan',
    },
  },
  'mechanistic-frontiers-challenges': {
    id: 'jailbreak-relearning-probe-code-lab',
    status: 'available',
    contentStatus: 'missing',
    title: {
      en: 'Lab: Jailbreak & Relearning Probing',
      vi: 'Lab: Kiểm thử Đối kháng & Tốc độ Học lại',
    },
  },
};

const lessonsFor = (trackId: string): LearningTocLessonSeed[] => {
  const lessons = llmUnlearningLessonPairs
    .filter((lesson) => lesson.trackId === trackId)
    .flatMap<LearningTocLessonSeed>((lesson) => [
      {
        id: lesson.theoryId,
        status: 'available',
        contentStatus: 'published',
        title: lesson.title,
      },
      {
        id: lesson.quizId,
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Quiz', vi: 'Quiz' },
      },
    ]);

  const codeLab = codeLabs[trackId];
  return codeLab ? [...lessons, codeLab] : lessons;
};

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'llm-unlearning-fundamentals',
    text: {
      title: { en: '1. Motivation & Core Formulations', vi: '1. Động lực & Định nghĩa Nền tảng' },
      description: {
        en: 'Why LLM unlearning is needed, what a request targets, and how success is defined.',
        vi: 'Vì sao cần LLM unlearning, yêu cầu xóa nhắm đến điều gì và cách định nghĩa thành công.',
      },
    },
    lessonIds: lessonsFor('llm-unlearning-fundamentals'),
  },
  {
    id: 'non-llm-unlearning-foundations',
    text: {
      title: { en: '2. Non-LLM Foundations & Transformer Limits', vi: '2. Nền tảng Non-LLM & Giới hạn trên Transformer' },
      description: {
        en: 'Classical exact and approximate unlearning, then the limits created by generative Transformers.',
        vi: 'Unlearning chính xác và gần đúng trong mô hình truyền thống, rồi các giới hạn do Transformer sinh tạo ra.',
      },
    },
    lessonIds: lessonsFor('non-llm-unlearning-foundations'),
  },
  {
    id: 'tofu-benchmark-dataset-design',
    text: {
      title: { en: '3. Benchmarks & Dataset Design', vi: '3. Benchmark & Thiết kế Dữ liệu' },
      description: {
        en: 'How TOFU and broader benchmarks construct forget/retain evidence under different data assumptions.',
        vi: 'Cách TOFU và các benchmark khác xây dựng bằng chứng quên/giữ dưới những giả định dữ liệu khác nhau.',
      },
    },
    lessonIds: lessonsFor('tofu-benchmark-dataset-design'),
  },
  {
    id: 'core-unlearning-baselines',
    text: {
      title: { en: '4. Method Taxonomy & Core Baselines', vi: '4. Phân loại Phương pháp & Baseline Cốt lõi' },
      description: {
        en: 'Training-time, post-training, and inference-time methods, from objective changes to modular systems.',
        vi: 'Phương pháp ở lúc huấn luyện, sau huấn luyện và lúc suy luận, từ đổi hàm mục tiêu đến hệ thống module.',
      },
    },
    lessonIds: lessonsFor('core-unlearning-baselines'),
  },
  {
    id: 'unlearning-evaluation-metrics',
    text: {
      title: { en: '5. Evaluation & Empirical Evidence', vi: '5. Đánh giá & Bằng chứng Thực nghiệm' },
      description: {
        en: 'A multi-axis evaluation of forgetting, utility, robustness, efficiency, and empirical trade-offs.',
        vi: 'Đánh giá đa trục về khả năng quên, hữu dụng, bền vững, hiệu quả và các đánh đổi thực nghiệm.',
      },
    },
    lessonIds: lessonsFor('unlearning-evaluation-metrics'),
  },
  {
    id: 'mechanistic-frontiers-challenges',
    text: {
      title: { en: '6. Mechanisms, Challenges & Frontiers', vi: '6. Cơ chế, Thách thức & Hướng Tương lai' },
      description: {
        en: 'Entangled representations, attacks, scale, verification, and unlearning across the LLM lifecycle.',
        vi: 'Biểu diễn đan xen, tấn công, quy mô, kiểm chứng và unlearning xuyên suốt vòng đời LLM.',
      },
    },
    lessonIds: lessonsFor('mechanistic-frontiers-challenges'),
  },
];

export const learningTableOfContents = {
  id: 'llm-unlearning',
  text: {
    title: { en: 'Machine Unlearning for LLMs', vi: 'Machine Unlearning cho LLMs' },
    description: {
      en: 'From request definitions and method families to evidence-based evaluation and open challenges in LLM unlearning.',
      vi: 'Từ định nghĩa yêu cầu và các họ phương pháp đến đánh giá dựa trên bằng chứng và thách thức mở của LLM unlearning.',
    },
  },
  status: 'active',
  fallbackLocales: ['vi'],
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

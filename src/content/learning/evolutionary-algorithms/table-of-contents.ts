import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  // Chapter 1: Tư duy Tối ưu hóa: Từ Gradient Descent đến Thuật toán Tiến hóa
  {
    id: 'optimization-mindset-gradients-to-evolution',
    text: {
      title: {
        en: "1. Optimization Mindset: From Gradients to Evolution",
        vi: "1. Tư duy Tối ưu hóa: Từ Gradients đến Tiến hóa",
      },
      description: {
        en: "Bridge the gap from familiar optimization concepts (Loss, Gradients, SGD) to derivative-free, zero-order black-box optimization inspired by natural selection.",
        vi: "Cầu nối từ các khái niệm tối ưu quen thuộc (Loss, Gradients, SGD) sang tối ưu hóa phi đạo hàm (Black-box Optimization) lấy cảm hứng từ chọn lọc tự nhiên.",
      },
    },
    lessonIds: [
      {
        id: 'gradient-limits-blackbox',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'When Gradients Fail: Black-Box Optimization', vi: 'Khi nào Gradient Descent Thất bại?' },
      },
      {
        id: 'gradient-limits-blackbox-quiz',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Quiz', vi: 'Quiz' },
      },
      {
        id: 'gradient-limits-blackbox-code-lab',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Code', vi: 'Code' },
      },
      {
        id: 'ml-to-ea-concept-mapping',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'From Machine Learning to Evolutionary Algorithms', vi: 'Từ Machine Learning đến Thuật toán Tiến hóa' },
      },
      {
        id: 'ml-to-ea-concept-mapping-quiz',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Quiz', vi: 'Quiz' },
      },
      {
        id: 'ml-to-ea-concept-mapping-code-lab',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Code', vi: 'Code' },
      },
      {
        id: 'ea-vs-gd-rastrigin-code-lab',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Code', vi: 'Code' },
      },
      {
        id: 'fitness-landscapes-selection',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Fitness Landscapes & Selection Pressure', vi: 'Fitness Landscape & Áp lực Chọn lọc' },
      },
      {
        id: 'fitness-landscapes-selection-quiz',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Quiz', vi: 'Quiz' },
      },
      {
        id: 'fitness-landscapes-selection-code-lab',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Code', vi: 'Code' },
      },
      {
        id: 'genotype-phenotype-representation',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Genotype & Phenotype: Solution Representation', vi: 'Genotype & Phenotype: Không gian Biểu diễn' },
      },
      {
        id: 'genotype-phenotype-representation-quiz',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Quiz', vi: 'Quiz' },
      },
      {
        id: 'crossover-mutation-operators',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Genetic Operators: Crossover & Mutation', vi: 'Toán tử Di truyền: Crossover & Mutation' },
      },
      {
        id: 'crossover-mutation-operators-quiz',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Quiz', vi: 'Quiz' },
      },
      {
        id: 'crossover-mutation-operators-code-lab',
        status: 'available',
        contentStatus: 'published',
        title: { en: 'Code', vi: 'Code' },
      },
    ],
  },

  // Chapter 2: Giải thuật Di truyền (Genetic Algorithms - GA)
  {
    id: 'genetic-algorithms-data-science',
    text: {
      title: {
        en: "2. Genetic Algorithms (GA)",
        vi: "2. Giải thuật Di truyền (GA)",
      },
      description: {
        en: "Master canonical genetic algorithms: chromosome representations, selection strategies, crossover, mutation, and feature selection applications.",
        vi: "Làm chủ giải thuật di truyền kinh điển: biểu diễn nhiễm sắc thể, chiến lược chọn lọc, lai ghép, đột biến và ứng dụng chọn lọc đặc trưng.",
      },
    },
    lessonIds: [
      { id: 'ga-encoding-population', status: 'locked', contentStatus: 'missing', title: { en: 'Chromosome Encoding & Population Init', vi: 'Mã hóa Nhiễm sắc thể & Khởi tạo Quần thể' } },
      { id: 'ga-encoding-population-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'ga-encoding-population-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
      { id: 'ga-selection-mechanisms', status: 'locked', contentStatus: 'missing', title: { en: 'Selection Mechanisms: Roulette vs Tournament', vi: 'Cơ chế Chọn lọc: Roulette vs Tournament' } },
      { id: 'ga-selection-mechanisms-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'ga-selection-mechanisms-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
      { id: 'ga-crossover-mutation', status: 'locked', contentStatus: 'missing', title: { en: 'Crossover & Mutation Operators', vi: 'Toán tử Lai ghép & Đột biến' } },
      { id: 'ga-crossover-mutation-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'ga-crossover-mutation-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
      { id: 'ga-feature-selection', status: 'locked', contentStatus: 'missing', title: { en: 'GA for Feature Selection in ML', vi: 'Ứng dụng GA: Chọn lọc Đặc trưng trong ML' } },
      { id: 'ga-feature-selection-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'ga-feature-selection-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
    ],
  },

  // Chapter 3: Chiến lược Tiến hóa & Tối ưu Tham số Liên tục (Evolution Strategies - ES)
  {
    id: 'evolution-strategies-continuous-opt',
    text: {
      title: {
        en: "3. Evolution Strategies & Continuous Optimization",
        vi: "3. Chiến lược Tiến hóa & Tối ưu Liên tục",
      },
      description: {
        en: "Continuous parameter optimization with (1+1)-ES, CMA-ES, and Differential Evolution for hyperparameter tuning.",
        vi: "Tối ưu hóa tham số liên tục với (1+1)-ES, CMA-ES và Vi phân Tiến hóa (DE) để tinh chỉnh siêu tham số.",
      },
    },
    lessonIds: [
      { id: 'es-gaussian-mutation', status: 'locked', contentStatus: 'missing', title: { en: 'Basic Evolution Strategies & 1/5 Rule', vi: 'Chiến lược Tiến hóa Cơ bản & Quy tắc 1/5' } },
      { id: 'es-gaussian-mutation-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'es-gaussian-mutation-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
      { id: 'cma-es-covariance-learning', status: 'locked', contentStatus: 'missing', title: { en: 'CMA-ES: Covariance Matrix Adaptation', vi: 'CMA-ES: Học Ma trận Hiệp phương sai' } },
      { id: 'cma-es-covariance-learning-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'cma-es-covariance-learning-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
      { id: 'differential-evolution-tuning', status: 'locked', contentStatus: 'missing', title: { en: 'Differential Evolution for Hyperparameter Tuning', vi: 'Vi phân Tiến hóa (DE) Tinh chỉnh Siêu tham số' } },
      { id: 'differential-evolution-tuning-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'differential-evolution-tuning-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
    ],
  },

  // Chapter 4: Lập trình Di truyền & AutoML
  {
    id: 'genetic-programming-automl',
    text: {
      title: {
        en: "4. Genetic Programming & AutoML",
        vi: "4. Lập trình Di truyền & AutoML",
      },
      description: {
        en: "Evolve computer programs, mathematical equations with Symbolic Regression, and multi-objective Pareto optimization (NSGA-II) for model trade-offs.",
        vi: "Tiến hóa chương trình máy tính, khám phá công thức toán học với Symbolic Regression, và tối ưu đa mục tiêu Pareto (NSGA-II) cho trade-off mô hình.",
      },
    },
    lessonIds: [
      { id: 'gp-symbolic-regression', status: 'locked', contentStatus: 'missing', title: { en: 'Symbolic Regression via Genetic Programming', vi: 'Hồi quy Biểu thức qua Lập trình Di truyền' } },
      { id: 'gp-symbolic-regression-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'gp-symbolic-regression-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
      { id: 'pareto-nsga-ii-tradeoffs', status: 'locked', contentStatus: 'missing', title: { en: 'Multi-Objective Trade-offs: Pareto Front & NSGA-II', vi: 'Đánh đổi Đa mục tiêu: Pareto Front & NSGA-II' } },
      { id: 'pareto-nsga-ii-tradeoffs-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'pareto-nsga-ii-tradeoffs-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
    ],
  },

  // Chapter 5: Neuroevolution & Modern AI
  {
    id: 'neuroevolution-modern-ai',
    text: {
      title: {
        en: "5. Neuroevolution & Modern AI",
        vi: "5. Tiến hóa Mạng nơ-ron & AI Hiện đại",
      },
      description: {
        en: "Scale evolutionary optimization to deep neural networks: OpenAI ES without backpropagation, Neural Architecture Search (AutoML), and Quality Diversity.",
        vi: "Mở rộng tối ưu hóa tiến hóa cho mạng nơ-ron sâu: OpenAI ES không cần lan truyền ngược, Tìm kiếm Kiến trúc Mạng (NAS) và Quality Diversity.",
      },
    },
    lessonIds: [
      { id: 'openai-es-deep-learning', status: 'locked', contentStatus: 'missing', title: { en: 'OpenAI ES: Evolution Without Backpropagation', vi: 'OpenAI ES: Huấn luyện Mạng không cần Backpropagation' } },
      { id: 'openai-es-deep-learning-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'openai-es-deep-learning-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
      { id: 'evolutionary-nas', status: 'locked', contentStatus: 'missing', title: { en: 'Evolutionary Neural Architecture Search (AutoML)', vi: 'Tìm kiếm Kiến trúc Mạng Nơ-ron (AutoML/NAS)' } },
      { id: 'evolutionary-nas-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'evolutionary-nas-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
      { id: 'quality-diversity-map-elites', status: 'locked', contentStatus: 'missing', title: { en: 'Quality Diversity & MAP-Elites Algorithm', vi: 'Quality Diversity & Thuật toán MAP-Elites' } },
      { id: 'quality-diversity-map-elites-quiz', status: 'locked', contentStatus: 'missing', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'quality-diversity-map-elites-code-lab', status: 'locked', contentStatus: 'missing', title: { en: 'Code', vi: 'Code' } },
    ],
  },
];

export const learningTableOfContents = {
  id: 'evolutionary-algorithms',
  text: {
    title: { en: "Evolutionary Algorithms", vi: "Thuật toán tiến hóa" },
    description: {
      en: "From first-order gradient limitations to population-based black-box optimization: genetic algorithms, CMA-ES, genetic programming, and modern neuroevolution.",
      vi: "Từ giới hạn của Gradient Descent đến tối ưu hóa black-box dựa trên quần thể: giải thuật di truyền, CMA-ES, lập trình di truyền và neuroevolution hiện đại.",
    },
  },
  status: 'partial',
  fallbackLocales: ['vi'],
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

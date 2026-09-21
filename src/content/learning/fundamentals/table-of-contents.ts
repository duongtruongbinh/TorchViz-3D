import type { 
  LearningTableOfContents, 
  LearningTocLessonSeed,
  LearningTocTrackSeed ,
} from '../../../core/learning/types.ts';

type MachineLearningLessonPair = {
  trackId: string;
  theory: Exclude<LearningTocLessonSeed, string>;
  quiz: Exclude<LearningTocLessonSeed, string>;
};

type MachineLearningLessonPairInput = {
  trackId: string;
  id: string;
  titleEn: string;
  titleVi: string;
};

function lessonPair ({
  trackId,
  id,
  titleEn,
  titleVi,
}: MachineLearningLessonPairInput) : MachineLearningLessonPair {
  return {
    trackId,
    theory: {
      id,
      title: { en: titleEn, vi:titleVi },
      status: 'available',
      contentStatus: 'published',
    },
    quiz: {
      id: `${id}-quiz`,
      title: { en: 'Quiz', vi: 'Quiz' },
      status: 'available',
      contentStatus: 'published',
    }
  };
}

export const machineLearningLessonPair: readonly MachineLearningLessonPair[] = [
  lessonPair({
    trackId: 'tensor-shape-fundamentals',
    id: 'shape-basics',
    titleEn: 'Shape Basics',
    titleVi: 'Shape Basics',
  }),
  lessonPair({
    trackId: 'value-flow',
    id: 'linear-activation',
    titleEn: 'Linear Activation',
    titleVi: 'Linear Activation',
  }),
  lessonPair({
    trackId: 'core-ml-concepts',
    id: 'supervised-unsupervised-rl',
    titleEn: 'Supervised & Unsupervised Reinforcement Learning',
    titleVi: 'Học tăng cường có giám sát và không giám sát',
  }),
  lessonPair({
    trackId: 'core-ml-concepts',
    id: 'train-validation-test',
    titleEn: 'Train Validation Test',
    titleVi: 'Train Validation Test',
  }),
  lessonPair({
    trackId: 'core-ml-concepts',
    id: 'overfitting-underfitting',
    titleEn: 'Overfitting Underfitting',
    titleVi: 'Quá khớp và Thiếu khớp',
  }),
  lessonPair({
    trackId: 'core-ml-concepts',
    id: 'bias-variance-tradeoff',
    titleEn: 'Bias Variance Tradeoff',
    titleVi: 'Độ lệch, Độ nhạy, Sự đánh đổi',
  }),
  lessonPair({
    trackId: 'core-ml-concepts',
    id: 'cross-validation-k-fold',
    titleEn: 'Cross Validation K Fold',
    titleVi: 'Cross Validation K Fold',
  }),
  lessonPair({
    trackId: 'core-ml-concepts',
    id: 'evaluation-metrics',
    titleEn: 'Evaluation Metrics',
    titleVi: 'Chỉ số đánh giá',
  }),
  lessonPair({
    trackId: 'linear-logistic-regression',
    id: 'linear-regression',
    titleEn: 'Linear Regression',
    titleVi: 'Hồi quy tuyến tính',
  }),
  lessonPair({
    trackId: 'linear-logistic-regression',
    id: 'logistic-regression',
    titleEn: 'Logistic Regression',
    titleVi: 'Hồi quy Logistic',
  }),
  lessonPair({
    trackId: 'linear-logistic-regression',
    id: 'regression-cost-functions',
    titleEn: 'Regression Cost Functions',
    titleVi: 'Các hàm chi phí hồi quy',
  }),
  lessonPair({
    trackId: 'linear-logistic-regression',
    id: 'regularization-l1-l2',
    titleEn: 'Regularization L1 L2',
    titleVi: 'Điều chuẩn L1 L2',
  }),
  lessonPair({
    trackId: 'linear-logistic-regression',
    id: 'one-vs-rest',
    titleEn: 'One Vs Rest',
    titleVi: 'One Vs Rest',
  }),
  lessonPair({
    trackId: 'decision-trees-ensembles',
    id: 'decision-tree-splitting',
    titleEn: 'Decision Tree Splitting',
    titleVi: 'Phân chia Decision Tree',
  }),
  lessonPair({
    trackId: 'decision-trees-ensembles',
    id: 'random-forests',
    titleEn: 'Random Forests',
    titleVi: 'Random Forests',
  }),
  lessonPair({
    trackId: 'decision-trees-ensembles',
    id: 'gradient-boosting',
    titleEn: 'Gradient Boosting',
    titleVi: 'Gradient Boosting',
  }),
  lessonPair({
    trackId: 'decision-trees-ensembles',
    id: 'feature-importance',
    titleEn: 'Feature Importance',
    titleVi: 'Tầm quan trọng của đặc trưng',
  }),
  lessonPair({
    trackId: 'unsupervised-learning',
    id: 'k-means-clustering',
    titleEn: 'K Means Clustering',
    titleVi: 'K Means Clustering',
  }),
  lessonPair({
    trackId: 'unsupervised-learning',
    id: 'dbscan-clustering',
    titleEn: 'DBSCAN Clustering',
    titleVi: 'DBSCAN Clustering',
  }),
  lessonPair({
    trackId: 'unsupervised-learning',
    id: 'pca-dimensionality-reduction',
    titleEn: 'PCA Dimensionality Reduction',
    titleVi: 'Giảm chiều dữ liệu bằng PCA',
  }),
  lessonPair({
    trackId: 'unsupervised-learning',
    id: 'tsne-umap-visualization',
    titleEn: 't-SNE UMAP Visualization',
    titleVi: 'Trực quan hóa t-SNE và UMAP',
  }),
  lessonPair({
    trackId: 'hyperparameter-tuning',
    id: 'grid-random-search',
    titleEn: 'Grid Random Search',
    titleVi: 'Tìm kiếm ngẫu nhiên trên lưới',
  }),
  lessonPair({
    trackId: 'hyperparameter-tuning',
    id: 'bayesian-optimization',
    titleEn: 'Bayesian Optimization',
    titleVi: 'Tối ưu hóa Bayes',
  }),
  lessonPair({
    trackId: 'hyperparameter-tuning',
    id: 'training-hyperparameters',
    titleEn: 'Training Hyperparameters',
    titleVi: 'Siêu tham số huấn luyện',
  }),
  lessonPair({
    trackId: 'hyperparameter-tuning',
    id: 'early-stopping',
    titleEn: 'Early Stopping',
    titleVi: 'Early Stopping',
  }),
  lessonPair({
    trackId: 'ml-with-scikit-learn',
    id: 'sklearn-pipelines',
    titleEn: 'Sklearn Pipelines',
    titleVi: 'Sklearn Pipelines',
  }),
  lessonPair({
    trackId: 'ml-with-scikit-learn',
    id: 'sklearn-preprocessors',
    titleEn: 'Sklearn Preprocessors',
    titleVi: 'Tiền xử lý Sklearn',
  }),
  lessonPair({
    trackId: 'ml-with-scikit-learn',
    id: 'sklearn-model-selection',
    titleEn: 'Sklearn Model Selection',
    titleVi: 'Lựa chọn mô hình Sklearn',
  }),
  lessonPair({
    trackId: 'ml-with-scikit-learn',
    id: 'sklearn-saving-models',
    titleEn: 'Sklearn Saving Models',
    titleVi: 'Lưu mô hình Sklearn',
  }),
  lessonPair({
    trackId: 'ml-with-scikit-learn',
    id: 'sklearn-api-pattern',
    titleEn: 'Sklearn API Pattern',
    titleVi: 'Sklearn API Pattern',
  }),
];

const machineLearningSynthesisLesson = {
  id: 'machine-learning-synthesis',
  title: { en: 'Course Synthesis', vi: 'Bản đồ khóa học' },
  status: 'available',
  contentStatus: 'published',
} satisfies Exclude<LearningTocLessonSeed, string>;

function lessonIdsForTrack(trackId: string): LearningTocLessonSeed[] {
  return machineLearningLessonPair
    .filter((pair) => pair.trackId === trackId)
    .flatMap((pair) => [pair.theory, pair.quiz]);
}

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'tensor-shape-fundamentals',
    text: {
      title: { 
        en: "Tensor shape fundamentals", 
        vi: "Tensor shape fundamentals" },
      description: { 
        en: "Read and predict shapes through core layers.", 
        vi: "Đọc và dự đoán shape qua các layer cơ bản." },
    },
    lessonIds: lessonIdsForTrack('tensor-shape-fundamentals'),
  },
  {
    id: 'value-flow',
    text: {
      title: { en: "Value flow", vi: "Value flow" },
      description: { en: "Follow values through Linear and activation operations.", vi: "Theo dõi giá trị qua Linear và activation." },
    },
    lessonIds: lessonIdsForTrack('value-flow'),
  },
  {
    id: 'core-ml-concepts',
    text: {
      title: { en: "1. Core ML Concepts", vi: "1. Core ML Concepts" },
      description: { en: "Classic dataset splits, generalization, validation, and metrics.", vi: "Dataset split, generalization, validation và metrics nền tảng." },
    },
    lessonIds: lessonIdsForTrack('core-ml-concepts'),
  },
  {
    id: 'linear-logistic-regression',
    text: {
      title: { en: "2. Linear & Logistic Regression", vi: "2. Linear & Logistic Regression" },
      description: { en: "Regression, classification, costs, regularization, and one-vs-rest.", vi: "Regression, classification, cost, regularization và one-vs-rest." },
    },
    lessonIds: lessonIdsForTrack('linear-logistic-regression'),
  },
  {
    id: 'decision-trees-ensembles',
    text: {
      title: { en: "3. Decision Trees & Ensembles", vi: "3. Decision Trees & Ensembles" },
      description: { en: "Trees, forests, boosting, and feature importance.", vi: "Tree, forest, boosting và feature importance." },
    },
    lessonIds: lessonIdsForTrack('decision-trees-ensembles'),
  },
  {
    id: 'unsupervised-learning',
    text: {
      title: { en: "4. Unsupervised Learning", vi: "4. Unsupervised Learning" },
      description: { en: "Clustering, dimensionality reduction, and embedding visualization.", vi: "Clustering, giảm chiều và trực quan hóa embedding." },
    },
    lessonIds: lessonIdsForTrack('unsupervised-learning'),
  },
  {
    id: 'hyperparameter-tuning',
    text: {
      title: { en: "5. Hyperparameter Tuning", vi: "5. Hyperparameter Tuning" },
      description: { en: "Search strategies, training knobs, and early stopping.", vi: "Chiến lược search, tham số train và early stopping." },
    },
    lessonIds: lessonIdsForTrack('hyperparameter-tuning'),
  },
  {
    id: 'ml-with-scikit-learn',
    text: {
      title: { en: "6. ML with Scikit-Learn", vi: "6. ML với Scikit-Learn" },
      description: { en: "Pipelines, preprocessors, model selection, persistence, and API patterns.", vi: "Pipeline, preprocessor, model selection, lưu model và pattern API." },
    },
    lessonIds: lessonIdsForTrack('ml-with-scikit-learn'),
  },
  {
    id: 'ml-llm-synthesis',
    text: {
      title: {
        en: "7. Course Synthesis",
        vi: "7. Tổng hợp toàn khóa",
      },
      description: {
        en: "Connect core concepts, model families, evaluation, tuning, and Scikit-Learn workflows into one practical Machine Learning roadmap.",
        vi: "Kết nối khái niệm nền tảng, nhóm mô hình, đánh giá, tuning và workflow Scikit-Learn thành một lộ trình Machine Learning thực tế.",
      },
    },
    lessonIds: [machineLearningSynthesisLesson],
  },
];

export const learningTableOfContents = {
  id: 'fundamentals',
  text: {
    title: { en: "Machine Learning", vi: "Machine Learning" },
    description: { en: "Move from data splits and evaluation into regression, classification, trees, ensembles, unsupervised learning, tuning, and practical Scikit-Learn workflows for baseline AI systems.", vi: "Đi từ chia dữ liệu và evaluation đến regression, classification, tree, ensemble, unsupervised learning, tuning và workflow Scikit-Learn thực tế cho hệ thống AI baseline." },
  },
  status: 'placeholder',
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

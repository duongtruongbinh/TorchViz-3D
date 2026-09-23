import type { 
  LearningContentStatus,
  LearningLessonStatus,
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
  status?: LearningLessonStatus;
  contentStatus?: LearningContentStatus;
  quizStatus?: LearningLessonStatus;
  quizContentStatus?: LearningContentStatus;
};

function lessonPair ({
  trackId,
  id,
  titleEn,
  titleVi,
  status = 'available',
  contentStatus = 'published',
  quizStatus,
  quizContentStatus,
}: MachineLearningLessonPairInput) : MachineLearningLessonPair {
  return {
    trackId,
    theory: {
      id,
      title: { en: titleEn, vi:titleVi },
      status,
      contentStatus,
    },
    quiz: {
      id: `${id}-quiz`,
      title: { en: 'Quiz', vi: 'Quiz' },
      status: quizStatus ?? status,
      contentStatus: quizContentStatus ?? contentStatus,
    }
  };
}

export const machineLearningLessonPair: readonly MachineLearningLessonPair[] = [
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'supervised-unsupervised-rl',
    titleEn: 'Supervised & Unsupervised Reinforcement Learning',
    titleVi: 'Học có giám sát, Học không giám sát và Học tăng cường',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'linear-regression',
    titleEn: 'Linear Regression',
    titleVi: 'Hồi quy tuyến tính',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'train-validation-test',
    titleEn: 'Train Validation Test',
    titleVi: 'Train Validation Test',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'regression-cost-functions',
    titleEn: 'Regression Cost Functions',
    titleVi: 'Các hàm chi phí hồi quy',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'overfitting-underfitting',
    titleEn: 'Overfitting Underfitting',
    titleVi: 'Quá khớp và Thiếu khớp',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'bias-variance-tradeoff',
    titleEn: 'Bias Variance Tradeoff',
    titleVi: 'Độ lệch, Độ nhạy, Sự đánh đổi',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'regularization-l1-l2',
    titleEn: 'Regularization L1 L2',
    titleVi: 'Điều chuẩn L1 L2',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'cross-validation-k-fold',
    titleEn: 'Cross Validation K Fold',
    titleVi: 'Cross Validation K Fold',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'variability-splits-seeds',
    titleEn: 'Variability across Splits and Seeds',
    titleVi: 'Độ biến động giữa các split và seed',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'bootstrap-confidence-intervals',
    titleEn: 'Bootstrap Confidence Intervals',
    titleVi: 'Khoảng tin cậy bằng bootstrap',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'prediction-intervals',
    titleEn: 'Prediction Intervals',
    titleVi: 'Khoảng dự đoán',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'leakage-code-lab',
    titleEn: 'Lab: Detecting Data Leakage',
    titleVi: 'Lab phát hiện data leakage',
    status: 'locked',
    contentStatus: 'missing',
    quizStatus: 'available',
    quizContentStatus: 'published',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'linear-regression-code-lab',
    titleEn: 'Lab: Linear Regression from Formula to Scikit-Learn',
    titleVi: 'Lab Linear Regression từ công thức đến Scikit-Learn',
    status: 'locked',
    contentStatus: 'missing',
    quizStatus: 'available',
    quizContentStatus: 'published',
  }),
  lessonPair({
    trackId: 'linear-regression-foundations',
    id: 'regression-metrics',
    titleEn: 'Regression Metrics',
    titleVi: 'Chỉ số đánh giá hồi quy',
  }),
  lessonPair({
    trackId: 'logistic-classification',
    id: 'logistic-regression',
    titleEn: 'Logistic Regression',
    titleVi: 'Hồi quy Logistic',
  }),
  lessonPair({
    trackId: 'logistic-classification',
    id: 'linear-activation',
    titleEn: 'Linear Activation',
    titleVi: 'Linear Activation',
  }),
  lessonPair({
    trackId: 'logistic-classification',
    id: 'one-vs-rest',
    titleEn: 'One Vs Rest',
    titleVi: 'One Vs Rest',
  }),
  lessonPair({
    trackId: 'logistic-classification',
    id: 'k-nearest-neighbors',
    titleEn: 'k-Nearest Neighbors',
    titleVi: 'k-Nearest Neighbors',
  }),
  lessonPair({
    trackId: 'logistic-classification',
    id: 'naive-bayes',
    titleEn: 'Naive Bayes',
    titleVi: 'Naive Bayes',
  }),
  lessonPair({
    trackId: 'logistic-classification',
    id: 'support-vector-machines',
    titleEn: 'Support Vector Machine',
    titleVi: 'Support Vector Machine',
  }),
  lessonPair({
    trackId: 'logistic-classification',
    id: 'mixed-classification-code-lab',
    titleEn: 'Lab: Mixed-Type Classification Pipeline',
    titleVi: 'Lab classification pipeline với dữ liệu hỗn hợp',
    status: 'locked',
    contentStatus: 'missing',
    quizStatus: 'available',
    quizContentStatus: 'published',
  }),
  lessonPair({
    trackId: 'logistic-classification',
    id: 'classification-metrics',
    titleEn: 'Classification Metrics',
    titleVi: 'Chỉ số đánh giá phân loại',
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
    trackId: 'decision-trees-ensembles',
    id: 'model-comparison-code-lab',
    titleEn: 'Lab: Comparing Logistic Regression, Random Forest and Gradient Boosting',
    titleVi: 'Lab so sánh Logistic Regression, Random Forest và Gradient Boosting',
    status: 'locked',
    contentStatus: 'missing',
    quizStatus: 'available',
    quizContentStatus: 'published',
  }),
  lessonPair({
    trackId: 'unsupervised-learning',
    id: 'k-means-clustering',
    titleEn: 'K Means Clustering',
    titleVi: 'K Means Clustering',
  }),
  lessonPair({
    trackId: 'unsupervised-learning',
    id: 'gaussian-mixture-models',
    titleEn: 'Gaussian Mixture Models',
    titleVi: 'Gaussian Mixture Models',
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
    trackId: 'unsupervised-learning',
    id: 'clustering-code-lab',
    titleEn: 'Lab: Clustering without Labels',
    titleVi: 'Lab clustering và đánh giá không có nhãn',
    status: 'locked',
    contentStatus: 'missing',
    quizStatus: 'available',
    quizContentStatus: 'published',
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
    trackId: 'hyperparameter-tuning',
    id: 'nested-cv-code-lab',
    titleEn: 'Lab: Nested CV without Touching Test Data',
    titleVi: 'Lab Nested CV và tuning không chạm test set',
    status: 'locked',
    contentStatus: 'missing',
    quizStatus: 'available',
    quizContentStatus: 'published',
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
    id: 'linear-regression-foundations',
    text: {
      title: { en: "1. Linear Regression", vi: "1. Hồi quy tuyến tính" },
      description: { en: "Core ML through regression: splits, loss, generalization, regularization, validation, uncertainty intervals, and metrics.", vi: "Học ML qua hồi quy: chia dữ liệu, loss, tổng quát hóa, regularization, validation, độ bất định và các chỉ số đánh giá." },
    },
    lessonIds: lessonIdsForTrack('linear-regression-foundations'),
  },
  {
    id: 'logistic-classification',
    text: {
      title: { en: "2. Logistic Regression & Classification", vi: "2. Hồi quy Logistic và phân loại" },
      description: { en: "Logistic regression, activation, OvR, nearest neighbors, Naive Bayes, SVM and classification evaluation.", vi: "Logistic Regression, activation, OvR, k-NN, Naive Bayes, SVM và đánh giá phân loại." },
    },
    lessonIds: lessonIdsForTrack('logistic-classification'),
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
      description: { en: "K-Means, Gaussian mixtures, DBSCAN, dimensionality reduction, and embedding visualization.", vi: "K-Means, Gaussian Mixture Models, DBSCAN, giảm chiều và trực quan hóa embedding." },
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
    description: { en: "Learn core concepts through Linear Regression, then classification, task-specific evaluation, ensembles, unsupervised learning, tuning, and Scikit-Learn workflows.", vi: "Học khái niệm nền tảng qua Linear Regression, rồi phân loại, đánh giá theo bài toán, ensemble, học không giám sát, tuning và workflow Scikit-Learn." },
  },
  status: 'placeholder',
  chapters,
  sectionKinds: ['theory', 'code'],
  routeAliases: [
    { fromTrackId: 'tensor-shape-fundamentals', toTrackId: 'linear-regression-foundations' },
    { fromLessonId: 'shape-basics', toTrackId: 'logistic-classification', toLessonId: 'linear-activation' },
    { fromLessonId: 'shape-basics-quiz', toTrackId: 'logistic-classification', toLessonId: 'linear-activation' },
    { fromTrackId: 'value-flow', toTrackId: 'logistic-classification' },
    { fromTrackId: 'core-ml-concepts', toTrackId: 'linear-regression-foundations' },
    { fromTrackId: 'linear-logistic-regression', toTrackId: 'linear-regression-foundations' },
    { fromLessonId: 'evaluation-metrics', toTrackId: 'linear-regression-foundations', toLessonId: 'regression-metrics' },
    { fromLessonId: 'evaluation-metrics-quiz', toTrackId: 'linear-regression-foundations', toLessonId: 'regression-metrics-quiz' },
  ],
} satisfies LearningTableOfContents;

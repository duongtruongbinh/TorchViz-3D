import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  // Chapter 1: System & Product Design
  {
    id: 'system-product-design',
    text: {
      title: { en: "1. System & Product Design", vi: "1. Thiết kế Hệ thống & Sản phẩm AI" },
      description: {
        en: "Define problems, metrics, business objectives, architectural choices, compute environments, and inference strategies.",
        vi: "Xác định bài toán, KPI/Metrics, tính khả thi, kiến trúc hệ thống, môi trường tính toán và chiến lược inference.",
      },
    },
    lessonIds: [
      { id: 'product-design', status: 'available', contentStatus: 'published', title: { en: 'Product Design', vi: 'Thiết kế Sản phẩm AI' } },
      { id: 'product-design-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Product Design', vi: 'Quiz: Thiết kế Sản phẩm' } },
      { id: 'product-design-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Framing & Baseline', vi: 'Lab: Xác lập Bài toán & Baseline' } },
      { id: 'system-overview', status: 'available', contentStatus: 'published', title: { en: 'System Architecture Overview', vi: 'Tổng quan Kiến trúc Hệ thống' } },
      { id: 'system-overview-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Architecture Overview', vi: 'Quiz: Tổng quan Kiến trúc' } },
      { id: 'system-overview-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Environment Setup', vi: 'Lab: Thiết lập Môi trường' } },
      { id: 'data-layer-design', status: 'available', contentStatus: 'published', title: { en: 'Data Layer Architecture', vi: 'Kiến trúc Tầng Dữ liệu (Data Layer)' } },
      { id: 'data-layer-design-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Data Layer', vi: 'Quiz: Tầng Dữ liệu' } },
      { id: 'data-layer-design-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Storage & Contracts', vi: 'Lab: Lưu trữ & Data Contracts' } },
      { id: 'compute-layer-design', status: 'available', contentStatus: 'published', title: { en: 'Compute Layer Architecture', vi: 'Kiến trúc Tầng Tính toán (Compute Layer)' } },
      { id: 'compute-layer-design-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Compute Layer', vi: 'Quiz: Tầng Tính toán' } },
      { id: 'compute-layer-design-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Compute Orchestration', vi: 'Lab: Điều phối Cụm Compute' } },
      { id: 'serving-layer-design', status: 'available', contentStatus: 'published', title: { en: 'Serving Layer Architecture', vi: 'Kiến trúc Tầng Serving (Serving Layer)' } },
      { id: 'serving-layer-design-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Serving Layer', vi: 'Quiz: Tầng Serving' } },
      { id: 'serving-layer-design-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Serving & Benchmark', vi: 'Lab: Đóng gói API & Đo Latency' } },
      { id: 'control-layer-design', status: 'available', contentStatus: 'published', title: { en: 'Control Layer Architecture', vi: 'Kiến trúc Tầng Kiểm soát (Control Layer)' } },
      { id: 'control-layer-design-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Control Layer', vi: 'Quiz: Tầng Kiểm soát' } },
      { id: 'control-layer-design-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Observability & Circuit Breaker', vi: 'Lab: Giám sát & Circuit Breaker' } },
    ],
  },

  // Chapter 2: Data Engineering & Preprocessing
  {
    id: 'data-engineering-preprocessing',
    text: {
      title: { en: "2. Data Engineering & Preprocessing", vi: "2. Kỹ thuật & Xử lý Dữ liệu" },
      description: {
        en: "Exploratory data analysis, cleaning, tokenization, transformations, and distributed datasets with Ray Data.",
        vi: "Phân tích khám phá (EDA), làm sạch dữ liệu, tokenization, biến đổi đặc trưng và xử lý dữ liệu phân tán với Ray Data.",
      },
    },
    lessonIds: [
      { id: 'data-preparation-eda', status: 'available', contentStatus: 'published', title: { en: 'Data Prep & EDA', vi: 'Thu thập Dữ liệu & EDA' } },
      { id: 'data-preparation-eda-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Data Prep & EDA', vi: 'Quiz: Thu thập & EDA' } },
      { id: 'data-preparation-eda-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: EDA with Pandas', vi: 'Lab: Phân tích Dữ liệu với Pandas' } },
      { id: 'preprocessing-distributed-data', status: 'available', contentStatus: 'published', title: { en: 'Preprocessing & Distributed Data', vi: 'Tiền xử lý & Dữ liệu Phân tán' } },
      { id: 'preprocessing-distributed-data-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Preprocessing', vi: 'Quiz: Tiền xử lý Dữ liệu' } },
      { id: 'preprocessing-distributed-data-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Ray Data Pipeline', vi: 'Lab: Pipeline với Ray Data' } },
    ],
  },

  // Chapter 3: Training, Experiment Tracking & Evaluation
  {
    id: 'training-tracking-evaluation',
    text: {
      title: { en: "3. Training, Tracking & Evaluation", vi: "3. Huấn luyện, Thử nghiệm & Đánh giá" },
      description: {
        en: "Distributed training with Ray Train & PyTorch, experiment tracking with MLflow, hyperparameter tuning, and multi-slice evaluation.",
        vi: "Huấn luyện phân tán với Ray Train & PyTorch, quản lý thử nghiệm qua MLflow, tuning siêu tham số và đánh giá đa phân khúc.",
      },
    },
    lessonIds: [
      { id: 'distributed-training', status: 'available', contentStatus: 'published', title: { en: 'Distributed Training', vi: 'Huấn luyện Phân tán' } },
      { id: 'distributed-training-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Training', vi: 'Quiz: Huấn luyện Phân tán' } },
      { id: 'distributed-training-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: PyTorch & Ray Train', vi: 'Lab: Huấn luyện với Ray Train' } },
      { id: 'experiment-tracking', status: 'available', contentStatus: 'published', title: { en: 'Experiment Tracking', vi: 'Quản lý Thử nghiệm (Tracking)' } },
      { id: 'experiment-tracking-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Tracking', vi: 'Quiz: Quản lý Thử nghiệm' } },
      { id: 'experiment-tracking-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: MLflow Tracking', vi: 'Lab: Thực hành với MLflow' } },
      { id: 'tuning-evaluation', status: 'available', contentStatus: 'published', title: { en: 'Tuning & Sliced Evaluation', vi: 'Tuning & Đánh giá Slice' } },
      { id: 'tuning-evaluation-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Evaluation', vi: 'Quiz: Tuning & Đánh giá' } },
      { id: 'tuning-evaluation-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Ray Tune & Slicing', vi: 'Lab: Tinh chỉnh & Đánh giá Phân khúc' } },
    ],
  },

  // Chapter 4: Testing ML Systems
  {
    id: 'testing-ml-systems',
    text: {
      title: { en: "4. Testing ML Systems", vi: "4. Kiểm thử Hệ thống ML Toàn diện" },
      description: {
        en: "Code unit testing, data validation suites (Great Expectations), and model behavioral testing (invariance, directional, MFT).",
        vi: "Kiểm thử code (unit tests), kiểm thử dữ liệu (Great Expectations) và kiểm thử hành vi mô hình (invariance, directional, MFT).",
      },
    },
    lessonIds: [
      { id: 'code-testing', status: 'available', contentStatus: 'published', title: { en: 'Code & Pipeline Testing', vi: 'Kiểm thử Code & Pipeline' } },
      { id: 'code-testing-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Code Testing', vi: 'Quiz: Kiểm thử Code' } },
      { id: 'code-testing-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Pytest for ML', vi: 'Lab: Pytest cho Pipeline ML' } },
      { id: 'data-validation', status: 'available', contentStatus: 'published', title: { en: 'Data Validation', vi: 'Kiểm thử Dữ liệu (Data Testing)' } },
      { id: 'data-validation-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Data Validation', vi: 'Quiz: Kiểm thử Dữ liệu' } },
      { id: 'data-validation-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Great Expectations', vi: 'Lab: Kiểm thử với Great Expectations' } },
      { id: 'model-behavioral-testing', status: 'available', contentStatus: 'published', title: { en: 'Model Behavioral Testing', vi: 'Kiểm thử Hành vi Mô hình' } },
      { id: 'model-behavioral-testing-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Model Testing', vi: 'Quiz: Kiểm thử Mô hình' } },
      { id: 'model-behavioral-testing-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Behavioral Test Suite', vi: 'Lab: Xây dựng Behavioral Suite' } },
    ],
  },

  // Chapter 5: Reproducibility & Versioning
  {
    id: 'reproducibility-versioning',
    text: {
      title: { en: "5. Reproducibility & Versioning", vi: "5. Quản lý Phiên bản & Chuẩn hóa Code" },
      description: {
        en: "Data and model artifact versioning with DVC, environment reproducibility, pre-commit hooks, and styling standards.",
        vi: "Quản lý phiên bản dữ liệu và mô hình với DVC, chuẩn hóa code với pre-commit hooks và quản lý môi trường.",
      },
    },
    lessonIds: [
      { id: 'data-model-versioning', status: 'available', contentStatus: 'published', title: { en: 'Data & Model Versioning', vi: 'Versioning Dữ liệu & Model' } },
      { id: 'data-model-versioning-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Versioning', vi: 'Quiz: Quản lý Phiên bản' } },
      { id: 'data-model-versioning-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: DVC & Remote Storage', vi: 'Lab: DVC & Remote Storage' } },
      { id: 'code-quality-precommit', status: 'available', contentStatus: 'published', title: { en: 'Code Quality & Pre-commit', vi: 'Chuẩn hóa Code & Pre-commit' } },
      { id: 'code-quality-precommit-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Code Quality', vi: 'Quiz: Chuẩn hóa Code' } },
      { id: 'code-quality-precommit-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Pre-commit Setup', vi: 'Lab: Cấu hình Pre-commit' } },
    ],
  },

  // Chapter 6: Deployment & Serving
  {
    id: 'deployment-serving',
    text: {
      title: { en: "6. Deployment & Serving", vi: "6. Triển khai & Phục vụ Mô hình" },
      description: {
        en: "Real-time serving with FastAPI and Ray Serve, containerization with Docker, and rollout strategies (Canary, Blue-Green).",
        vi: "Phục vụ thời gian thực với FastAPI và Ray Serve, đóng gói Docker và chiến lược rollout (Canary, Blue-Green).",
      },
    },
    lessonIds: [
      { id: 'model-serving-fastapi-ray', status: 'available', contentStatus: 'published', title: { en: 'FastAPI & Ray Serve', vi: 'Phục vụ với FastAPI & Ray Serve' } },
      { id: 'model-serving-fastapi-ray-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Serving', vi: 'Quiz: Model Serving' } },
      { id: 'model-serving-fastapi-ray-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Real-time Inference API', vi: 'Lab: Xây dựng Inference API' } },
      { id: 'containerization-release', status: 'available', contentStatus: 'published', title: { en: 'Containerization & Rollouts', vi: 'Đóng gói Docker & Release' } },
      { id: 'containerization-release-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Containers', vi: 'Quiz: Docker & Release' } },
      { id: 'containerization-release-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Production Dockerfile', vi: 'Lab: Dockerfile Sản xuất' } },
    ],
  },

  // Chapter 7: CI/CD Workflows for ML
  {
    id: 'cicd-workflows-ml',
    text: {
      title: { en: "7. CI/CD for AI Systems", vi: "7. CI/CD & Tự động hóa Pipeline" },
      description: {
        en: "Automated testing, continuous training (CT), and continuous delivery (CD) using GitHub Actions.",
        vi: "Kiểm thử tự động, continuous training (CT) và continuous delivery (CD) với GitHub Actions.",
      },
    },
    lessonIds: [
      { id: 'ml-cicd-github-actions', status: 'available', contentStatus: 'published', title: { en: 'CI/CD with GitHub Actions', vi: 'CI/CD với GitHub Actions' } },
      { id: 'ml-cicd-github-actions-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: CI/CD', vi: 'Quiz: CI/CD cho ML' } },
      { id: 'ml-cicd-github-actions-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: GitHub Actions Workflow', vi: 'Lab: Workflow CI/CD Tự động' } },
    ],
  },

  // Chapter 8: Monitoring, Drift & Continuous Retraining
  {
    id: 'monitoring-drift-retraining',
    text: {
      title: { en: "8. Monitoring & Maintenance", vi: "8. Giám sát, Drift & Huấn luyện lại" },
      description: {
        en: "Data drift and concept drift detection (Evidently), system observability (Prometheus/Grafana), and automated retraining triggers.",
        vi: "Phát hiện Data Drift và Concept Drift (Evidently), giám sát hệ thống (Prometheus/Grafana) và tự động kích hoạt retraining.",
      },
    },
    lessonIds: [
      { id: 'monitoring-drift-detection', status: 'available', contentStatus: 'published', title: { en: 'Drift Detection & Monitoring', vi: 'Giám sát & Phát hiện Drift' } },
      { id: 'monitoring-drift-detection-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Monitoring', vi: 'Quiz: Giám sát Hệ thống' } },
      { id: 'monitoring-drift-detection-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Evidently AI Drift Suite', vi: 'Lab: Báo cáo Drift với Evidently' } },
      { id: 'feedback-loops-retraining', status: 'available', contentStatus: 'published', title: { en: 'Feedback Loops & Retraining', vi: 'Vòng lặp Phản hồi & Retraining' } },
      { id: 'feedback-loops-retraining-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz: Retraining', vi: 'Quiz: Chiến lược Retraining' } },
      { id: 'feedback-loops-retraining-code-lab', status: 'available', contentStatus: 'published', title: { en: 'Lab: Automated Retrain Trigger', vi: 'Lab: Trigger Retraining Tự động' } },
    ],
  },
];

export const learningTableOfContents = {
  id: 'mlops-llmops-production-systems',
  text: {
    title: { en: "MLOps & Production Systems", vi: "MLOps & Hệ thống Sản xuất" },
    description: {
      en: "Learn how to responsibly design, develop, test, deploy, and monitor production-grade machine learning applications from first principles.",
      vi: "Học cách thiết kế, phát triển, kiểm thử, triển khai và giám sát hệ thống Machine Learning thực tế trên môi trường sản xuất từ nguyên lý gốc.",
    },
  },
  status: 'partial',
  fallbackLocales: ['vi'],
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

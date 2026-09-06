import type {
  LearningTableOfContents,
  LearningTocTrackSeed,
} from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'sales-forecasting-project',
    text: {
      title: {
        en: 'Data Science Projects > Retail & E-Commerce > Project 3.2 - Sales Forecasting (LightGBM & SHAP)',
        vi: 'Data Science Projects > Retail & E-Commerce > Project 3.2 - Sales Forecasting (LightGBM & SHAP)',
      },
      description: {
        en: 'End-to-end multi-year retail daily sales forecasting with strict forecast horizon H=28 days, automated leakage testing, 53 engineered features, 5 tree models, and TreeSHAP explainability (Source: AI VIET NAM).',
        vi: 'Dự án dự báo doanh thu chuỗi thương mại điện tử 10 năm với ràng buộc khoảng dự báo H=28 ngày, chống rò rỉ dữ liệu tự động, 53 đặc trưng, 5 mô hình cây và giải thích bằng TreeSHAP (Nguồn: AI VIET NAM).',
      },
    },
    lessonIds: [
      {
        id: 'sales-forecasting-problem-and-dataset',
        title: {
          en: 'Part 1: Problem Formulation & Pipeline',
          vi: 'Phần 1: Bài toán & Thiết kế Luồng giải quyết',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sales-forecasting-data-structure-audit',
        title: {
          en: 'Part 2: Raw Data Structure Audit',
          vi: 'Phần 2: Phân tích Cấu trúc Dữ liệu thô',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sales-forecasting-data-cleaning',
        title: {
          en: 'Part 3: Data Cleaning & Integrity Checks',
          vi: 'Phần 3: Làm sạch Dữ liệu & Chốt chặn An toàn',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sales-forecasting-eda-and-seasonality',
        title: {
          en: 'Part 4: Revenue EDA & Seasonality Cycles',
          vi: 'Phần 4: Phân tích Chuỗi Doanh thu & Mùa vụ',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sales-forecasting-feature-engineering',
        title: {
          en: 'Part 5: 53-Feature Engineering & Leakage Probe',
          vi: 'Phần 5: Xây dựng 53 Đặc trưng & Phép thử Rò rỉ',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sales-forecasting-model-training-and-evaluation',
        title: {
          en: 'Part 6: Model Benchmark, Bias Diagnosis & SHAP',
          vi: 'Phần 6: Huấn luyện, Giải mã Thiên lệch & TreeSHAP',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sales-forecasting-conformal-prediction-intervals-code-lab',
        title: {
          en: 'Code: Conformal Prediction Intervals',
          vi: 'Code: Khoảng Dự báo bằng Conformal Calibration',
        },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'sales-forecasting-quiz',
        title: {
          en: 'Quiz: Sales Forecasting Production Mastery',
          vi: 'Quiz: Kiểm tra Năng lực Dự án Sales Forecasting',
        },
        status: 'available',
        contentStatus: 'published',
      },
    ],
  },
  {
    id: 'credit-risk-scoring-project',
    status: 'placeholder',
    text: {
      title: {
        en: 'Data Science Projects > Finance & Banking > Credit Risk Scoring & Default Prediction',
        vi: 'Data Science Projects > Finance & Banking > Credit Risk Scoring & Default Prediction',
      },
      description: {
        en: 'Credit probability of default (PD) estimation, Weight of Evidence (WoE) transformation, Information Value (IV), scorecard modeling, and Basel II/III regulatory alignment.',
        vi: 'Mô hình chấm điểm rủi ro tín dụng và ước lượng xác suất vỡ nợ (PD), biến đổi WoE, tính Information Value, xây dựng scorecard theo chuẩn Basel II/III.',
      },
    },
    lessonIds: [
      {
        id: 'credit-risk-overview',
        title: {
          en: 'Credit Risk Scoring: Architecture & Methodology',
          vi: 'Mô hình Điểm Rủi ro Tín dụng: Tổng quan & Kiến trúc',
        },
        status: 'next',
        contentStatus: 'missing',
      },
    ],
  },
  {
    id: 'defect-detection-project',
    status: 'placeholder',
    text: {
      title: {
        en: 'AI Projects > Computer Vision > Real-Time Defect Detection with YOLOv11 & TensorRT',
        vi: 'AI Projects > Computer Vision > Real-Time Defect Detection with YOLOv11 & TensorRT',
      },
      description: {
        en: 'High-throughput industrial surface inspection on manufacturing assembly lines with edge optimization, TensorRT quantization, and low-latency inference.',
        vi: 'Phát hiện lỗi bề mặt sản phẩm công nghiệp tốc độ cao trên dây chuyền sản xuất sử dụng YOLOv11, tối ưu hóa TensorRT và suy luận biên độ trễ thấp.',
      },
    },
    lessonIds: [
      {
        id: 'defect-detection-overview',
        title: {
          en: 'Defect Detection Pipeline & Edge Deployment',
          vi: 'Phát hiện Lỗi Bề mặt Công nghiệp & Triển khai Biên',
        },
        status: 'next',
        contentStatus: 'missing',
      },
    ],
  },
  {
    id: 'enterprise-rag-assistant-project',
    status: 'placeholder',
    text: {
      title: {
        en: 'AI Projects > Natural Language Processing > Enterprise Knowledge RAG Assistant with Hybrid Search',
        vi: 'AI Projects > Natural Language Processing > Enterprise Knowledge RAG Assistant with Hybrid Search',
      },
      description: {
        en: 'Production-grade enterprise retrieval-augmented generation: dense + BM25 hybrid search, contextual reranking, document parsing, guardrails, and Ragas evaluation.',
        vi: 'Hệ thống RAG doanh nghiệp: tìm kiếm lai dense + BM25, reranking ngữ cảnh, trích xuất tài liệu phức tạp, rào chắn an toàn và đánh giá bằng Ragas.',
      },
    },
    lessonIds: [
      {
        id: 'enterprise-rag-overview',
        title: {
          en: 'Enterprise RAG Architecture & Evaluation',
          vi: 'Kiến trúc & Đánh giá Hệ thống RAG Doanh nghiệp',
        },
        status: 'next',
        contentStatus: 'missing',
      },
    ],
  },
];

export const learningTableOfContents = {
  id: 'ai-projects',
  text: {
    title: {
      en: 'AI Projects',
      vi: 'Dự án AI',
    },
    description: {
      en: 'Hands-on end-to-end AI and Data Science projects across retail, finance, computer vision, and NLP with real-world datasets, pipelines, and production evaluation.',
      vi: 'Các dự án thực chiến AI và Data Science qua các lĩnh vực bán lẻ, tài chính, thị giác máy tính và NLP với dữ liệu thực tế, quy trình chuẩn mực và đánh giá chuyên sâu.',
    },
  },
  status: 'active',
  fallbackLocales: ['vi'],
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

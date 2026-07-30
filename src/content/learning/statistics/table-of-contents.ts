import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters = [
  {
    "id": "probability",
    "text": {
      "title": {
        "en": "1. Probability",
        "vi": "1. Xác suất"
      },
      "description": {
        "en": "Random experiments, events, probability rules, conditioning, Bayes' theorem, and Naive Bayes.",
        "vi": "Phép thử ngẫu nhiên, biến cố, các quy tắc xác suất, xác suất có điều kiện, định lý Bayes và Naive Bayes."
      }
    },
    "lessonIds": [
      {
        "id": "ch01-probability-origins",
        "title": {
          "en": "1.1 Origins and Intuition of Probability",
          "vi": "1.1 Khởi nguồn và trực giác xác suất"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-probability-origins-quiz",
        "title": {
          "en": "Quiz",
          "vi": "Quiz"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-experiments-events-sample-space",
        "title": {
          "en": "1.2 Experiments, Events, and Sample Spaces",
          "vi": "1.2 Phép thử, biến cố và không gian mẫu"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-experiments-events-sample-space-quiz",
        "title": {
          "en": "Quiz",
          "vi": "Quiz"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-event-relations",
        "title": {
          "en": "1.3 Relations Between Events",
          "vi": "1.3 Quan hệ giữa các biến cố"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-event-relations-quiz",
        "title": {
          "en": "Quiz",
          "vi": "Quiz"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-probability-definitions-properties",
        "title": {
          "en": "1.4 Probability Definitions and Properties",
          "vi": "1.4 Định nghĩa và tính chất xác suất"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-probability-definitions-properties-quiz",
        "title": {
          "en": "Quiz",
          "vi": "Quiz"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-empirical-probability",
        "title": {
          "en": "1.5 Frequency and Empirical Probability",
          "vi": "1.5 Tần số và xác suất thực nghiệm"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-empirical-probability-quiz",
        "title": {
          "en": "Quiz",
          "vi": "Quiz"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-conditional-probability",
        "title": {
          "en": "1.6 Conditional Probability and the Multiplication Rule",
          "vi": "1.6 Xác suất có điều kiện và quy tắc nhân"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-conditional-probability-quiz",
        "title": {
          "en": "Quiz",
          "vi": "Quiz"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-total-probability",
        "title": {
          "en": "1.7 The Law of Total Probability",
          "vi": "1.7 Công thức xác suất toàn phần"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-total-probability-quiz",
        "title": {
          "en": "Quiz",
          "vi": "Quiz"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-bayes-naive-bayes",
        "title": {
          "en": "1.8 Bayes' Theorem and Naive Bayes",
          "vi": "1.8 Định lý Bayes và Naive Bayes"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-bayes-naive-bayes-quiz",
        "title": {
          "en": "Quiz",
          "vi": "Quiz"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-probability-exercises",
        "title": {
          "en": "1.9 Probability Exercises",
          "vi": "1.9 Bài tập xác suất"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch01-probability-exercises-quiz",
        "title": {
          "en": "Quiz",
          "vi": "Quiz"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "statistical-learning",
    "text": {
      "title": {
        "en": "2. Statistical Learning",
        "vi": "2. Học thống kê"
      },
      "description": {
        "en": "Core learning problems, estimation, model accuracy, bias-variance, and a first Python lab.",
        "vi": "Các bài toán học cốt lõi, ước lượng, độ chính xác mô hình, đánh đổi độ chệch–phương sai và bài lab Python đầu tiên."
      }
    },
    "lessonIds": [
      {
        "id": "ch02-classical-statistics-fundamentals",
        "title": {
          "en": "2.0 Classical Statistics Fundamentals",
          "vi": "2.0 Nền tảng Thống kê Cổ điển"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch02-what-is-statistical-learning",
        "title": {
          "en": "2.1 What Is Statistical Learning?",
          "vi": "2.1 Học thống kê là gì?"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch02-assessing-model-accuracy",
        "title": {
          "en": "2.2 Assessing Model Accuracy",
          "vi": "2.2 Đánh giá độ chính xác của mô hình"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch02-python-introduction-lab",
        "title": {
          "en": "2.3 Lab: Introduction to Python",
          "vi": "2.3 Lab: Nhập môn Python"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch02-exercises",
        "title": {
          "en": "2.4 Exercises",
          "vi": "2.4 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "linear-regression",
    "text": {
      "title": {
        "en": "3. Linear Regression",
        "vi": "3. Hồi quy tuyến tính"
      },
      "description": {
        "en": "Simple and multiple regression, inference, diagnostics, qualitative predictors, and Python practice.",
        "vi": "Hồi quy đơn và bội, suy luận, chẩn đoán, biến dự báo định tính và thực hành Python."
      }
    },
    "lessonIds": [
      {
        "id": "ch03-simple-linear-regression",
        "title": {
          "en": "3.1 Simple Linear Regression",
          "vi": "3.1 Hồi quy tuyến tính đơn"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch03-multiple-linear-regression",
        "title": {
          "en": "3.2 Multiple Linear Regression",
          "vi": "3.2 Hồi quy tuyến tính bội"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch03-regression-model-considerations",
        "title": {
          "en": "3.3 Other Considerations in the Regression Model",
          "vi": "3.3 Những cân nhắc khác trong mô hình hồi quy"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch03-marketing-plan",
        "title": {
          "en": "3.4 The Marketing Plan",
          "vi": "3.4 Kế hoạch marketing"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch03-linear-regression-knn-comparison",
        "title": {
          "en": "3.5 Comparison of Linear Regression with K -Nearest Neighbors",
          "vi": "3.5 So sánh hồi quy tuyến tính với K láng giềng gần nhất"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch03-linear-regression-lab",
        "title": {
          "en": "3.6 Lab: Linear Regression",
          "vi": "3.6 Lab: Hồi quy tuyến tính"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch03-exercises",
        "title": {
          "en": "3.7 Exercises",
          "vi": "3.7 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "classification",
    "text": {
      "title": {
        "en": "4. Classification",
        "vi": "4. Phân loại"
      },
      "description": {
        "en": "Logistic regression, discriminant analysis, naive Bayes, generalized linear models, and classification labs.",
        "vi": "Hồi quy logistic, phân tích biệt thức, Bayes ngây thơ, mô hình tuyến tính tổng quát và các bài lab phân loại."
      }
    },
    "lessonIds": [
      {
        "id": "ch04-classification-overview",
        "title": {
          "en": "4.1 An Overview of Classification",
          "vi": "4.1 Tổng quan về phân loại"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch04-why-not-linear-regression",
        "title": {
          "en": "4.2 Why Not Linear Regression?",
          "vi": "4.2 Tại sao không dùng hồi quy tuyến tính?"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch04-logistic-regression",
        "title": {
          "en": "4.3 Logistic Regression",
          "vi": "4.3 Hồi quy logistic"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch04-generative-classification-models",
        "title": {
          "en": "4.4 Generative Models for Classification",
          "vi": "4.4 Mô hình sinh cho phân loại"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch04-classification-method-comparison",
        "title": {
          "en": "4.5 A Comparison of Classification Methods",
          "vi": "4.5 So sánh các phương pháp phân loại"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch04-generalized-linear-models",
        "title": {
          "en": "4.6 Generalized Linear Models",
          "vi": "4.6 Mô hình tuyến tính tổng quát"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch04-classification-lab",
        "title": {
          "en": "4.7 Lab: Logistic Regression, LDA, QDA, and KNN",
          "vi": "4.7 Lab: Hồi quy logistic, LDA, QDA và KNN"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch04-exercises",
        "title": {
          "en": "4.8 Exercises",
          "vi": "4.8 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "resampling-methods",
    "text": {
      "title": {
        "en": "5. Resampling Methods",
        "vi": "5. Các phương pháp lấy mẫu lại"
      },
      "description": {
        "en": "Validation sets, leave-one-out and k-fold cross-validation, bootstrap estimation, and Python labs.",
        "vi": "Tập xác thực, xác thực chéo leave-one-out và k-fold, ước lượng bootstrap cùng các bài lab Python."
      }
    },
    "lessonIds": [
      {
        "id": "ch05-cross-validation",
        "title": {
          "en": "5.1 Cross-Validation",
          "vi": "5.1 Xác thực chéo"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch05-bootstrap",
        "title": {
          "en": "5.2 The Bootstrap",
          "vi": "5.2 Bootstrap"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch05-resampling-lab",
        "title": {
          "en": "5.3 Lab: Cross-Validation and the Bootstrap",
          "vi": "5.3 Lab: Xác thực chéo và bootstrap"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch05-exercises",
        "title": {
          "en": "5.4 Exercises",
          "vi": "5.4 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "linear-model-selection-regularization",
    "text": {
      "title": {
        "en": "6. Linear Model Selection and Regularization",
        "vi": "6. Lựa chọn và điều chuẩn mô hình tuyến tính"
      },
      "description": {
        "en": "Subset selection, ridge, lasso, dimension reduction, high-dimensional data, and regularization labs.",
        "vi": "Lựa chọn tập con, ridge, lasso, giảm chiều, dữ liệu nhiều chiều và các bài lab điều chuẩn."
      }
    },
    "lessonIds": [
      {
        "id": "ch06-subset-selection",
        "title": {
          "en": "6.1 Subset Selection",
          "vi": "6.1 Lựa chọn tập con"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch06-shrinkage-methods",
        "title": {
          "en": "6.2 Shrinkage Methods",
          "vi": "6.2 Các phương pháp co rút"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch06-dimension-reduction-methods",
        "title": {
          "en": "6.3 Dimension Reduction Methods",
          "vi": "6.3 Các phương pháp giảm chiều"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch06-high-dimensional-considerations",
        "title": {
          "en": "6.4 Considerations in High Dimensions",
          "vi": "6.4 Những cân nhắc trong không gian nhiều chiều"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch06-regularization-lab",
        "title": {
          "en": "6.5 Lab: Linear Models and Regularization Methods",
          "vi": "6.5 Lab: Mô hình tuyến tính và các phương pháp điều chuẩn"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch06-exercises",
        "title": {
          "en": "6.6 Exercises",
          "vi": "6.6 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "moving-beyond-linearity",
    "text": {
      "title": {
        "en": "7. Moving Beyond Linearity",
        "vi": "7. Vượt ra ngoài tính tuyến tính"
      },
      "description": {
        "en": "Polynomial and step functions, splines, local regression, generalized additive models, and nonlinear labs.",
        "vi": "Hàm đa thức và hàm bậc thang, spline, hồi quy cục bộ, mô hình cộng tổng quát và các bài lab phi tuyến."
      }
    },
    "lessonIds": [
      {
        "id": "ch07-polynomial-regression",
        "title": {
          "en": "7.1 Polynomial Regression",
          "vi": "7.1 Hồi quy đa thức"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch07-step-functions",
        "title": {
          "en": "7.2 Step Functions",
          "vi": "7.2 Hàm bậc thang"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch07-basis-functions",
        "title": {
          "en": "7.3 Basis Functions",
          "vi": "7.3 Hàm cơ sở"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch07-regression-splines",
        "title": {
          "en": "7.4 Regression Splines",
          "vi": "7.4 Spline hồi quy"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch07-smoothing-splines",
        "title": {
          "en": "7.5 Smoothing Splines",
          "vi": "7.5 Spline làm trơn"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch07-local-regression",
        "title": {
          "en": "7.6 Local Regression",
          "vi": "7.6 Hồi quy cục bộ"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch07-generalized-additive-models",
        "title": {
          "en": "7.7 Generalized Additive Models",
          "vi": "7.7 Mô hình cộng tổng quát"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch07-nonlinear-modeling-lab",
        "title": {
          "en": "7.8 Lab: Non-Linear Modeling",
          "vi": "7.8 Lab: Mô hình hóa phi tuyến"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch07-exercises",
        "title": {
          "en": "7.9 Exercises",
          "vi": "7.9 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "tree-based-methods",
    "text": {
      "title": {
        "en": "8. Tree-Based Methods",
        "vi": "8. Các phương pháp dựa trên cây"
      },
      "description": {
        "en": "Decision trees, bagging, random forests, boosting, BART, and tree-based Python labs.",
        "vi": "Cây quyết định, bagging, rừng ngẫu nhiên, boosting, BART và các bài lab Python dựa trên cây."
      }
    },
    "lessonIds": [
      {
        "id": "ch08-decision-tree-basics",
        "title": {
          "en": "8.1 The Basics of Decision Trees",
          "vi": "8.1 Nền tảng của cây quyết định"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch08-tree-ensemble-methods",
        "title": {
          "en": "8.2 Bagging, Random Forests, Boosting, and Bayesian Additive Regression Trees",
          "vi": "8.2 Bagging, rừng ngẫu nhiên, boosting và cây hồi quy cộng Bayes"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch08-tree-methods-lab",
        "title": {
          "en": "8.3 Lab: Tree-Based Methods",
          "vi": "8.3 Lab: Các phương pháp dựa trên cây"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch08-exercises",
        "title": {
          "en": "8.4 Exercises",
          "vi": "8.4 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "support-vector-machines",
    "text": {
      "title": {
        "en": "9. Support Vector Machines",
        "vi": "9. Máy vector hỗ trợ"
      },
      "description": {
        "en": "Hyperplanes, margins, support vector classifiers, nonlinear kernels, multiclass strategies, and SVM labs.",
        "vi": "Siêu phẳng, biên, bộ phân loại vector hỗ trợ, kernel phi tuyến, chiến lược đa lớp và các bài lab SVM."
      }
    },
    "lessonIds": [
      {
        "id": "ch09-maximal-margin-classifier",
        "title": {
          "en": "9.1 Maximal Margin Classifier",
          "vi": "9.1 Bộ phân loại biên cực đại"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch09-support-vector-classifiers",
        "title": {
          "en": "9.2 Support Vector Classifiers",
          "vi": "9.2 Bộ phân loại vector hỗ trợ"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch09-support-vector-machines",
        "title": {
          "en": "9.3 Support Vector Machines",
          "vi": "9.3 Máy vector hỗ trợ"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch09-multiclass-svms",
        "title": {
          "en": "9.4 SVMs with More than Two Classes",
          "vi": "9.4 SVM với nhiều hơn hai lớp"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch09-svm-logistic-regression-relationship",
        "title": {
          "en": "9.5 Relationship to Logistic Regression",
          "vi": "9.5 Mối quan hệ với hồi quy logistic"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch09-svm-lab",
        "title": {
          "en": "9.6 Lab: Support Vector Machines",
          "vi": "9.6 Lab: Máy vector hỗ trợ"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch09-exercises",
        "title": {
          "en": "9.7 Exercises",
          "vi": "9.7 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "deep-learning",
    "text": {
      "title": {
        "en": "10. Deep Learning",
        "vi": "10. Học sâu"
      },
      "description": {
        "en": "Neural networks, CNNs, document and sequence models, optimization, double descent, and deep learning labs.",
        "vi": "Mạng nơ-ron, CNN, mô hình tài liệu và chuỗi, tối ưu hóa, double descent và các bài lab học sâu."
      }
    },
    "lessonIds": [
      {
        "id": "ch10-single-layer-neural-networks",
        "title": {
          "en": "10.1 Single Layer Neural Networks",
          "vi": "10.1 Mạng nơ-ron một lớp"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch10-multilayer-neural-networks",
        "title": {
          "en": "10.2 Multilayer Neural Networks",
          "vi": "10.2 Mạng nơ-ron nhiều lớp"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch10-convolutional-neural-networks",
        "title": {
          "en": "10.3 Convolutional Neural Networks",
          "vi": "10.3 Mạng nơ-ron tích chập"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch10-document-classification",
        "title": {
          "en": "10.4 Document Classification",
          "vi": "10.4 Phân loại tài liệu"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch10-recurrent-neural-networks",
        "title": {
          "en": "10.5 Recurrent Neural Networks",
          "vi": "10.5 Mạng nơ-ron hồi quy"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch10-when-to-use-deep-learning",
        "title": {
          "en": "10.6 When to Use Deep Learning",
          "vi": "10.6 Khi nào nên dùng học sâu"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch10-fitting-neural-network",
        "title": {
          "en": "10.7 Fitting a Neural Network",
          "vi": "10.7 Khớp một mạng nơ-ron"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch10-interpolation-double-descent",
        "title": {
          "en": "10.8 Interpolation and Double Descent",
          "vi": "10.8 Nội suy và double descent"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch10-deep-learning-lab",
        "title": {
          "en": "10.9 Lab: Deep Learning",
          "vi": "10.9 Lab: Học sâu"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch10-exercises",
        "title": {
          "en": "10.10 Exercises",
          "vi": "10.10 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "survival-analysis-censored-data",
    "text": {
      "title": {
        "en": "11. Survival Analysis and Censored Data",
        "vi": "11. Phân tích sống còn và dữ liệu kiểm duyệt"
      },
      "description": {
        "en": "Censoring, Kaplan-Meier curves, log-rank tests, Cox models, shrinkage, and survival-analysis labs.",
        "vi": "Kiểm duyệt, đường cong Kaplan–Meier, kiểm định log-rank, mô hình Cox, co rút và các bài lab phân tích sống còn."
      }
    },
    "lessonIds": [
      {
        "id": "ch11-survival-censoring-times",
        "title": {
          "en": "11.1 Survival and Censoring Times",
          "vi": "11.1 Thời gian sống còn và thời gian kiểm duyệt"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch11-censoring-details",
        "title": {
          "en": "11.2 A Closer Look at Censoring",
          "vi": "11.2 Xem xét kỹ hơn về kiểm duyệt"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch11-kaplan-meier-curve",
        "title": {
          "en": "11.3 The Kaplan–Meier Survival Curve",
          "vi": "11.3 Đường cong sống còn Kaplan–Meier"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch11-log-rank-test",
        "title": {
          "en": "11.4 The Log-Rank Test",
          "vi": "11.4 Kiểm định log-rank"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch11-survival-regression-models",
        "title": {
          "en": "11.5 Regression Models With a Survival Response",
          "vi": "11.5 Mô hình hồi quy với biến đáp ứng sống còn"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch11-cox-model-shrinkage",
        "title": {
          "en": "11.6 Shrinkage for the Cox Model",
          "vi": "11.6 Co rút cho mô hình Cox"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch11-additional-survival-topics",
        "title": {
          "en": "11.7 Additional Topics",
          "vi": "11.7 Các chủ đề bổ sung"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch11-survival-analysis-lab",
        "title": {
          "en": "11.8 Lab: Survival Analysis",
          "vi": "11.8 Lab: Phân tích sống còn"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch11-exercises",
        "title": {
          "en": "11.9 Exercises",
          "vi": "11.9 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "unsupervised-learning",
    "text": {
      "title": {
        "en": "12. Unsupervised Learning",
        "vi": "12. Học không giám sát"
      },
      "description": {
        "en": "Principal components, matrix completion, clustering, practical choices, and unsupervised Python labs.",
        "vi": "Thành phần chính, hoàn thiện ma trận, phân cụm, lựa chọn thực tiễn và các bài lab Python không giám sát."
      }
    },
    "lessonIds": [
      {
        "id": "ch12-unsupervised-learning-challenge",
        "title": {
          "en": "12.1 The Challenge of Unsupervised Learning",
          "vi": "12.1 Thách thức của học không giám sát"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch12-principal-components-analysis",
        "title": {
          "en": "12.2 Principal Components Analysis",
          "vi": "12.2 Phân tích thành phần chính"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch12-missing-values-matrix-completion",
        "title": {
          "en": "12.3 Missing Values and Matrix Completion",
          "vi": "12.3 Giá trị thiếu và hoàn thiện ma trận"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch12-clustering-methods",
        "title": {
          "en": "12.4 Clustering Methods",
          "vi": "12.4 Các phương pháp phân cụm"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch12-unsupervised-learning-lab",
        "title": {
          "en": "12.5 Lab: Unsupervised Learning",
          "vi": "12.5 Lab: Học không giám sát"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch12-exercises",
        "title": {
          "en": "12.6 Exercises",
          "vi": "12.6 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  },
  {
    "id": "multiple-testing",
    "text": {
      "title": {
        "en": "13. Multiple Testing",
        "vi": "13. Kiểm định nhiều giả thuyết"
      },
      "description": {
        "en": "Hypothesis testing, family-wise error, false discovery rate, resampling, and multiple-testing labs.",
        "vi": "Kiểm định giả thuyết, sai số theo họ, tỷ lệ phát hiện sai, lấy mẫu lại và các bài lab kiểm định nhiều giả thuyết."
      }
    },
    "lessonIds": [
      {
        "id": "ch13-hypothesis-testing-review",
        "title": {
          "en": "13.1 A Quick Review of Hypothesis Testing",
          "vi": "13.1 Ôn nhanh về kiểm định giả thuyết"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch13-multiple-testing-challenge",
        "title": {
          "en": "13.2 The Challenge of Multiple Testing",
          "vi": "13.2 Thách thức của kiểm định nhiều giả thuyết"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch13-family-wise-error-rate",
        "title": {
          "en": "13.3 The Family-Wise Error Rate",
          "vi": "13.3 Tỷ lệ sai số theo họ"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch13-false-discovery-rate",
        "title": {
          "en": "13.4 The False Discovery Rate",
          "vi": "13.4 Tỷ lệ phát hiện sai"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch13-resampling-p-values-fdr",
        "title": {
          "en": "13.5 A Re-Sampling Approach to p -Values and False Discovery Rates",
          "vi": "13.5 Phương pháp lấy mẫu lại cho giá trị p và tỷ lệ phát hiện sai"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch13-multiple-testing-lab",
        "title": {
          "en": "13.6 Lab: Multiple Testing",
          "vi": "13.6 Lab: Kiểm định nhiều giả thuyết"
        },
        "status": "available",
        "contentStatus": "published"
      },
      {
        "id": "ch13-exercises",
        "title": {
          "en": "13.7 Exercises",
          "vi": "13.7 Bài tập"
        },
        "status": "available",
        "contentStatus": "published"
      }
    ]
  }
] satisfies LearningTocTrackSeed[];

export const learningTableOfContents = {
  id: 'statistics',
  text: {
    title: { en: 'Probability & Statistics', vi: 'Xác suất & Thống kê' },
    description: { en: 'Learn probability and statistical learning from foundations to modern methods through theory, worked examples, Python labs, and exercises.', vi: 'Học xác suất và học thống kê từ nền tảng đến các phương pháp hiện đại qua lý thuyết, ví dụ có lời giải, bài lab Python và bài tập.' },
  },
  status: 'active',
  fallbackLocales: ['en'],
  searchTextMode: 'metadata',
  chapters,
  sectionKinds: ['theory', 'code', 'calculation'],
  routeAliases: [
    { fromTrackId: 'introduction', toTrackId: 'probability' },
    { fromLessonId: 'ch01-overview-statistical-learning', toTrackId: 'probability', toLessonId: 'ch01-probability-origins' },
    { fromLessonId: 'ch01-history-statistical-learning', toTrackId: 'probability', toLessonId: 'ch01-experiments-events-sample-space' },
    { fromLessonId: 'ch01-about-islp', toTrackId: 'probability', toLessonId: 'ch01-event-relations' },
    { fromLessonId: 'ch01-who-should-read', toTrackId: 'probability', toLessonId: 'ch01-probability-definitions-properties' },
    { fromLessonId: 'ch01-notation-matrix-algebra', toTrackId: 'probability', toLessonId: 'ch01-empirical-probability' },
    { fromLessonId: 'ch01-book-organization', toTrackId: 'probability', toLessonId: 'ch01-conditional-probability' },
    { fromLessonId: 'ch01-datasets', toTrackId: 'probability', toLessonId: 'ch01-total-probability' },
    { fromLessonId: 'ch01-book-website', toTrackId: 'probability', toLessonId: 'ch01-bayes-naive-bayes' },
    { fromLessonId: 'ch01-acknowledgements', toTrackId: 'probability', toLessonId: 'ch01-probability-exercises' },
  ],
} satisfies LearningTableOfContents;

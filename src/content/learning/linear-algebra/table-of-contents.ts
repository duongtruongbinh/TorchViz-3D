import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  // Chapter 1 — Vectors & Matrices
  {
    id: 'vectors-matrices',
    text: {
      title: { en: '1. Vectors & Matrices', vi: '1. Vector & Ma trận' },
      description: {
        en: 'Build intuition for vectors as geometric objects, then master vector operations, dot products, norms, normalization, and cosine similarity. Extend to matrix operations and the critical difference between element-wise and matrix products.',
        vi: 'Xây dựng trực giác về vector như đối tượng hình học, thành thạo các phép toán vector, tích vô hướng, chuẩn, chuẩn hóa và độ tương đồng cosine. Mở rộng sang phép toán ma trận và sự khác biệt quan trọng giữa tích element-wise và tích ma trận.',
      },
    },
    lessonIds: [
      { id: 'vectors-intuition', contentStatus: 'published', title: { en: 'Vector Intuition', vi: 'Trực giác về Vector' } },
      { id: 'vector-operations', contentStatus: 'published', title: { en: 'Vector Operations', vi: 'Các phép toán Vector cơ bản' } },
      { id: 'dot-product', contentStatus: 'published', title: { en: 'Dot Product', vi: 'Tích vô hướng (Dot Product)' } },
      { id: 'vector-norms', contentStatus: 'published', title: { en: 'Vector Norms', vi: 'Chuẩn của Vector (Vector Norms)' } },
      { id: 'unit-vectors-normalization', contentStatus: 'published', title: { en: 'Unit Vectors & Normalization', vi: 'Vector Đơn vị và Chuẩn hóa' } },
      { id: 'cosine-similarity', contentStatus: 'published', title: { en: 'Cosine Similarity', vi: 'Độ tương đồng Cosine (Cosine Similarity)' } },
      { id: 'orthogonality', contentStatus: 'published', title: { en: 'Orthogonality', vi: 'Tính Vuông góc (Orthogonality)' } },
      { id: 'matrix-operations', contentStatus: 'published', title: { en: 'Matrix Operations', vi: 'Phép toán Ma trận' } },
      { id: 'elementwise-vs-matrix-product', contentStatus: 'published', title: { en: 'Element-wise vs Matrix Product', vi: 'Tích Element-wise và tích Ma trận' } },
    ],
  },

  // Chapter 2 — Solving Linear Equations
  {
    id: 'solving-linear-equations',
    text: {
      title: { en: '2. Solving Linear Equations', vi: '2. Giải hệ phương trình tuyến tính' },
      description: {
        en: 'Represent and solve systems of linear equations using Gaussian elimination and LU decomposition, then understand the role of identity and inverse matrices.',
        vi: 'Biểu diễn và giải hệ phương trình tuyến tính bằng khử Gauss và phân tích LU, sau đó hiểu vai trò của ma trận đơn vị và ma trận nghịch đảo.',
      },
    },
    lessonIds: [
      { id: 'systems-of-linear-equations', contentStatus: 'published', title: { en: 'Systems of Linear Equations', vi: 'Hệ phương trình tuyến tính' } },
      { id: 'gaussian-elimination', contentStatus: 'published', title: { en: 'Gaussian Elimination', vi: 'Khử Gaussian' } },
      { id: 'lu-decomposition', contentStatus: 'published', title: { en: 'LU Decomposition', vi: 'Phân tích LU' } },
      { id: 'identity-inverse-matrix', contentStatus: 'published', title: { en: 'Identity & Inverse Matrices', vi: 'Ma trận đơn vị và Ma trận nghịch đảo' } },
    ],
  },

  // Chapter 3 — Vector Spaces & Subspaces
  {
    id: 'vector-spaces-subspaces',
    text: {
      title: { en: '3. Vector Spaces & Subspaces', vi: '3. Không gian vector & Không gian con' },
      description: {
        en: 'Explore the abstract structure of vector spaces and subspaces, including column space, null space, linear independence, basis, rank, and linear transformations.',
        vi: 'Khám phá cấu trúc trừu tượng của không gian vector và không gian con, bao gồm không gian cột, không gian null, độc lập tuyến tính, cơ sở, hạng và biến đổi tuyến tính.',
      },
    },
    lessonIds: [
      'vector-spaces-subspaces',
      'column-space-null-space',
      'linear-independence-basis',
      'matrix-rank',
      'linear-transformations',
    ],
  },

  // Chapter 4 — Orthogonality & Least Squares
  {
    id: 'orthogonality-least-squares',
    text: {
      title: { en: '4. Orthogonality & Least Squares', vi: '4. Trực giao & Bình phương tối thiểu' },
      description: {
        en: 'Project vectors orthogonally onto subspaces, orthogonalize bases with Gram-Schmidt, and solve least squares approximation problems.',
        vi: 'Chiếu vector trực giao lên không gian con, trực giao hóa cơ sở với Gram-Schmidt và giải bài toán xấp xỉ bình phương tối thiểu.',
      },
    },
    lessonIds: [
      'orthogonal-projections',
      'gram-schmidt',
      'systems-least-squares',
    ],
  },

  // Chapter 5 — Determinants
  {
    id: 'determinants',
    text: {
      title: { en: '5. Determinants', vi: '5. Định thức' },
      description: {
        en: 'Build geometric intuition for determinants and learn their key properties and computational formulas.',
        vi: 'Xây dựng trực giác hình học cho định thức và học các tính chất chính cùng công thức tính toán.',
      },
    },
    lessonIds: [
      'determinant-intuition',
      'determinant-properties-formulas',
    ],
  },

  // Chapter 6 — Eigenvalues & Eigenvectors
  {
    id: 'eigenvalues-eigenvectors',
    text: {
      title: { en: '6. Eigenvalues & Eigenvectors', vi: '6. Trị riêng & Vector riêng' },
      description: {
        en: 'Discover eigenvalues and eigenvectors, matrix diagonalization, and applications including PCA.',
        vi: 'Khám phá trị riêng và vector riêng, đường chéo hóa ma trận và các ứng dụng bao gồm PCA.',
      },
    },
    lessonIds: [
      'matrix-trace',
      'eigenvalues-eigenvectors',
      'diagonalization',
      'pca-eigenvalues',
    ],
  },

  // Chapter 7 — Singular Value Decomposition
  {
    id: 'singular-value-decomposition',
    text: {
      title: { en: '7. Singular Value Decomposition', vi: '7. Phân tích giá trị suy biến (SVD)' },
      description: {
        en: 'Understand the SVD as the capstone of linear algebra, from geometric intuition to dimensionality reduction.',
        vi: 'Hiểu SVD như đỉnh cao của đại số tuyến tính, từ trực giác hình học đến giảm chiều.',
      },
    },
    lessonIds: [
      'svd-intuition',
      'svd-dimensionality-reduction',
    ],
  },
];

export const learningTableOfContents = {
  id: 'linear-algebra',
  text: {
    title: { en: 'Linear Algebra', vi: 'Linear Algebra' },
    description: { en: 'A complete foundation in linear algebra following Gilbert Strang\'s curriculum: vectors, matrices, solving linear systems, vector spaces, orthogonality, determinants, eigenvalues, and the SVD.', vi: 'Nền tảng đại số tuyến tính hoàn chỉnh theo giáo trình Gilbert Strang: vector, ma trận, giải hệ phương trình, không gian vector, trực giao, định thức, trị riêng và SVD.' },
  },
  status: 'active',
  chapters,
  sectionKinds: ['theory', 'calculation'],
} satisfies LearningTableOfContents;

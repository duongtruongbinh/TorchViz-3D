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
      { id: 'vectors-intuition', status: 'available', contentStatus: 'published', title: { en: 'Vector Intuition', vi: 'Trực giác về Vector' } },
      { id: 'vectors-intuition-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'vector-operations', status: 'available', contentStatus: 'published', title: { en: 'Vector Operations', vi: 'Các phép toán Vector' } },
      { id: 'vector-operations-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'vector-norms', status: 'available', contentStatus: 'published', title: { en: 'Vector Norms', vi: 'Độ dài và Norm của Vector' } },
      { id: 'vector-norms-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'unit-vectors-normalization', status: 'available', contentStatus: 'published', title: { en: 'Unit Vectors & Normalization', vi: 'Vector đơn vị và Chuẩn hóa' } },
      { id: 'unit-vectors-normalization-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'dot-product', status: 'available', contentStatus: 'published', title: { en: 'Dot Product', vi: 'Dot Product' } },
      { id: 'dot-product-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'cosine-similarity', status: 'available', contentStatus: 'published', title: { en: 'Cosine Similarity', vi: 'Cosine Similarity và Góc giữa hai Vector' } },
      { id: 'cosine-similarity-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'matrix-operations', status: 'available', contentStatus: 'published', title: { en: 'Matrix Operations', vi: 'Ma trận và các phép toán cơ bản' } },
      { id: 'matrix-operations-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'elementwise-vs-matrix-product', status: 'available', contentStatus: 'published', title: { en: 'Element-wise vs Matrix Product', vi: 'Element-wise và Matrix Product' } },
      { id: 'elementwise-vs-matrix-product-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
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
      { id: 'systems-of-linear-equations', status: 'available', contentStatus: 'published', title: { en: 'Systems of Linear Equations', vi: 'Hệ phương trình tuyến tính và Ax = b' } },
      { id: 'systems-of-linear-equations-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'gaussian-elimination', status: 'available', contentStatus: 'published', title: { en: 'Gaussian Elimination', vi: 'Khử Gaussian' } },
      { id: 'gaussian-elimination-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'lu-decomposition', status: 'available', contentStatus: 'published', title: { en: 'LU Decomposition', vi: 'LU Decomposition' } },
      { id: 'lu-decomposition-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'identity-inverse-matrix', status: 'available', contentStatus: 'published', title: { en: 'Identity & Inverse Matrices', vi: 'Identity và Inverse Matrix' } },
      { id: 'identity-inverse-matrix-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
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
      { id: 'vector-spaces-subspaces', status: 'available', contentStatus: 'published', title: { en: 'Vector Space and Subspace', vi: 'Vector Space và Subspace' } },
      { id: 'vector-spaces-subspaces-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'column-space-null-space', status: 'available', contentStatus: 'published', title: { en: 'Column Space & Null Space', vi: 'Column Space và Null Space' } },
      { id: 'column-space-null-space-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'linear-independence-basis', status: 'available', contentStatus: 'published', title: { en: 'Linear Independence, Basis & Dimension', vi: 'Linear Independence, Basis và Dimension' } },
      { id: 'linear-independence-basis-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'matrix-rank', status: 'available', contentStatus: 'published', title: { en: 'Matrix Rank', vi: 'Matrix Rank' } },
      { id: 'matrix-rank-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'linear-transformations', status: 'available', contentStatus: 'published', title: { en: 'Linear Transformations', vi: 'Linear Transformations' } },
      { id: 'linear-transformations-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
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
      { id: 'orthogonality', status: 'available', contentStatus: 'published', title: { en: 'Orthogonality & Orthonormal Sets', vi: 'Orthogonality và Orthonormal Sets' } },
      { id: 'orthogonality-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'orthogonal-projections', status: 'available', contentStatus: 'published', title: { en: 'Orthogonal Projections', vi: 'Orthogonal Projections' } },
      { id: 'orthogonal-projections-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'gram-schmidt', status: 'available', contentStatus: 'published', title: { en: 'Gram-Schmidt & QR', vi: 'Gram Schmidt và QR' } },
      { id: 'gram-schmidt-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'systems-least-squares', status: 'available', contentStatus: 'published', title: { en: 'Least Squares', vi: 'Least Squares' } },
      { id: 'systems-least-squares-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
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
      { id: 'determinant-intuition', status: 'available', contentStatus: 'published', title: { en: 'Determinant Intuition', vi: 'Determinant: Trực giác Hình học' } },
      { id: 'determinant-intuition-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'determinant-properties-formulas', status: 'available', contentStatus: 'published', title: { en: 'Determinant Properties & Formulas', vi: 'Determinant: Tính chất và Công thức' } },
      { id: 'determinant-properties-formulas-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
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
      { id: 'matrix-trace', status: 'available', contentStatus: 'published', title: { en: 'Matrix Trace', vi: 'Matrix Trace' } },
      { id: 'matrix-trace-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'eigenvalues-eigenvectors', status: 'available', contentStatus: 'published', title: { en: 'Eigenvalues & Eigenvectors', vi: 'Eigenvalues và Eigenvectors' } },
      { id: 'eigenvalues-eigenvectors-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'diagonalization', status: 'available', contentStatus: 'published', title: { en: 'Diagonalization & Spectral View', vi: 'Diagonalization và Spectral View' } },
      { id: 'diagonalization-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'pca-eigenvalues', status: 'available', contentStatus: 'published', title: { en: 'PCA via Eigenvalues', vi: 'PCA qua Eigenvalues' } },
      { id: 'pca-eigenvalues-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
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
      { id: 'svd-intuition', status: 'available', contentStatus: 'published', title: { en: 'SVD Intuition', vi: 'SVD: Trực giác và Cấu trúc' } },
      { id: 'svd-intuition-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
      { id: 'svd-dimensionality-reduction', status: 'available', contentStatus: 'published', title: { en: 'Truncated SVD & Dimensionality Reduction', vi: 'Truncated SVD và Dimensionality Reduction' } },
      { id: 'svd-dimensionality-reduction-quiz', status: 'available', contentStatus: 'published', title: { en: 'Quiz', vi: 'Quiz' } },
    ],
  },
];

export const learningTableOfContents = {
  id: 'linear-algebra',
  text: {
    title: { en: 'Linear Algebra', vi: 'Linear Algebra' },
    description: {
      en: 'A core linear algebra foundation following the conceptual progression of Strang and MIT 18.06: vectors, matrices, solving linear systems, vector spaces, orthogonality, determinants, eigenvalues, and SVD.',
      vi: 'Nền tảng đại số tuyến tính cốt lõi theo trình tự tiếp cận trực giác của Strang và MIT 18.06: vector, ma trận, giải hệ phương trình, không gian vector, trực giao, định thức, trị riêng và SVD.',
    },
  },
  status: 'active',
  firstLessonStatus: 'available',
  defaultLessonStatus: 'available',
  chapters,
  sectionKinds: ['theory', 'calculation'],
} satisfies LearningTableOfContents;

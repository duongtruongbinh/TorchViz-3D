import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const linearAlgebraTrack: LearningTocTrackSeed = {
  id: 'linear-algebra',
  text: {
    title: { en: 'Linear Algebra', vi: 'Linear Algebra' },
    description: { en: 'Vectors, matrices, solving linear systems, vector spaces, orthogonality, determinants, eigenvalues, SVD, and applications in ML.', vi: 'Vector, ma trận, giải hệ phương trình tuyến tính, không gian vector, trực giao, định thức, trị riêng, SVD và ứng dụng trong ML.' },
  },
  lessonIds: [
    // Chapter 1 — Vectors & Matrices
    { id: 'vectors-intuition', contentStatus: 'published', title: { en: 'Vector Intuition', vi: 'Trực giác về Vector' } },
    { id: 'vector-operations', contentStatus: 'published', title: { en: 'Vector Operations', vi: 'Các phép toán Vector cơ bản' } },
    { id: 'dot-product', contentStatus: 'published', title: { en: 'Dot Product', vi: 'Tích vô hướng (Dot Product)' } },
    { id: 'vector-norms', contentStatus: 'published', title: { en: 'Vector Norms', vi: 'Chuẩn của Vector (Vector Norms)' } },
    { id: 'unit-vectors-normalization', contentStatus: 'published', title: { en: 'Unit Vectors & Normalization', vi: 'Vector Đơn vị và Chuẩn hóa' } },
    { id: 'cosine-similarity', contentStatus: 'published', title: { en: 'Cosine Similarity', vi: 'Độ tương đồng Cosine (Cosine Similarity)' } },
    { id: 'orthogonality', contentStatus: 'published', title: { en: 'Orthogonality', vi: 'Tính Vuông góc (Orthogonality)' } },
    { id: 'matrix-operations', contentStatus: 'published', title: { en: 'Matrix Operations', vi: 'Phép toán Ma trận' } },
    { id: 'elementwise-vs-matrix-product', contentStatus: 'published', title: { en: 'Element-wise vs Matrix Product', vi: 'Tích Element-wise và tích Ma trận' } },

    // Chapter 2 — Solving Linear Equations
    { id: 'systems-of-linear-equations', contentStatus: 'published', title: { en: 'Systems of Linear Equations', vi: 'Hệ phương trình tuyến tính' } },
    { id: 'gaussian-elimination', contentStatus: 'published', title: { en: 'Gaussian Elimination', vi: 'Khử Gaussian' } },
    { id: 'lu-decomposition', contentStatus: 'published', title: { en: 'LU Decomposition', vi: 'Phân tích LU' } },
    { id: 'identity-inverse-matrix', contentStatus: 'published', title: { en: 'Identity & Inverse Matrices', vi: 'Ma trận đơn vị và Ma trận nghịch đảo' } },

    // Chapter 3 — Vector Spaces & Subspaces
    'vector-spaces-subspaces',
    'column-space-null-space',
    'linear-independence-basis',
    'matrix-rank',
    'linear-transformations',

    // Chapter 4 — Orthogonality & Least Squares
    'orthogonal-projections',
    'gram-schmidt',
    'systems-least-squares',

    // Chapter 5 — Determinants
    'determinant-intuition',
    'determinant-properties-formulas',

    // Chapter 6 — Eigenvalues & Eigenvectors
    'matrix-trace',
    'eigenvalues-eigenvectors',
    'diagonalization',
    'pca-eigenvalues',

    // Chapter 7 — SVD
    'svd-intuition',
    'svd-dimensionality-reduction',
  ],
};

export const learningTableOfContents = {
  id: 'linear-algebra',
  text: {
    title: { en: 'Linear Algebra', vi: 'Linear Algebra' },
    description: { en: 'A complete foundation in linear algebra following Gilbert Strang\'s curriculum: vectors, matrices, solving linear systems, vector spaces, orthogonality, determinants, eigenvalues, and the SVD.', vi: 'Nền tảng đại số tuyến tính hoàn chỉnh theo giáo trình Gilbert Strang: vector, ma trận, giải hệ phương trình, không gian vector, trực giao, định thức, trị riêng và SVD.' },
  },
  status: 'active',
  chapters: [linearAlgebraTrack],
  sectionKinds: ['theory', 'calculation'],
} satisfies LearningTableOfContents;

import type { LINEAR_ALGEBRA_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import { createLazyLearningVisual } from '../../lazyLearningVisual';
import type { LearningMdxComponent } from '../../learningMdxComponents';

const lazyNamed = createLazyLearningVisual('Đang tải trực quan hóa toán học...');

const loadOverview = () => import('./overviewRenderers');
const loadVector = () => import('./vectorRenderers');
const loadMatrix = () => import('./matrixRenderers');
const loadSystem = () => import('./systemRenderers');
const loadSpace = () => import('./spaceRenderers');
const loadOrthogonality = () => import('./orthogonalityRenderers');
const loadDeterminant = () => import('./determinantRenderers');
const loadEigen = () => import('./eigenRenderers');
const loadSvd = () => import('./svdRenderers');

export const linearAlgebraMdxComponents = {
  // Chapter 0 (1)
  AiDataRepresentationDemo: lazyNamed(loadOverview, 'AiDataRepresentationDemo'),

  // Chapter 1 (24)
  CoordinateRepresentationDiagram: lazyNamed(loadVector, 'CoordinateRepresentationDiagram'),
  CosineAngleExplorer: lazyNamed(loadVector, 'CosineAngleExplorer'),
  CosineMotivationDiagram: lazyNamed(loadVector, 'CosineMotivationDiagram'),
  DistancePlane: lazyNamed(loadVector, 'DistancePlane'),
  DotProductAngleExplorer: lazyNamed(loadVector, 'DotProductAngleExplorer'),
  DotProductPlane: lazyNamed(loadVector, 'DotProductPlane'),
  DotProductCoordinateDiagram: lazyNamed(loadVector, 'DotProductCoordinateDiagram'),
  EmbeddingCosineDiagram: lazyNamed(loadVector, 'EmbeddingCosineDiagram'),
  HadamardProductGrid: lazyNamed(loadMatrix, 'HadamardProductGrid'),
  L2NormTriangle: lazyNamed(loadVector, 'L2NormTriangle'),
  MatrixExplorer: lazyNamed(loadMatrix, 'MatrixExplorer'),
  MatrixProductExplorer: lazyNamed(loadMatrix, 'MatrixProductExplorer'),
  MatrixTransposeExplorer: lazyNamed(loadMatrix, 'MatrixTransposeExplorer'),
  MatrixVectorProductExplorer: lazyNamed(loadMatrix, 'MatrixVectorProductExplorer'),
  NormUnitBallDiagram: lazyNamed(loadVector, 'NormUnitBallDiagram'),
  NormalizationPlane: lazyNamed(loadVector, 'NormalizationPlane'),
  NormalizationProcess: lazyNamed(loadVector, 'NormalizationProcess'),
  OuterProductExplorer: lazyNamed(loadMatrix, 'OuterProductExplorer'),
  ProductOverview: lazyNamed(loadMatrix, 'ProductOverview'),
  ScalarVectorPlane: lazyNamed(loadVector, 'ScalarVectorPlane'),
  UnitVectorPlane: lazyNamed(loadVector, 'UnitVectorPlane'),
  VectorAdditionPlane: lazyNamed(loadVector, 'VectorAdditionPlane'),
  VectorNormPlane: lazyNamed(loadVector, 'VectorNormPlane'),
  VectorPlane: lazyNamed(loadVector, 'VectorPlane'),
  VectorSubtractionPlane: lazyNamed(loadVector, 'VectorSubtractionPlane'),

  // Chapter 2 (5)
  ColumnCombinationExplorer: lazyNamed(loadSystem, 'ColumnCombinationExplorer'),
  GaussianEliminationStepper: lazyNamed(loadSystem, 'GaussianEliminationStepper'),
  GaussJordanInverseStepper: lazyNamed(loadSystem, 'GaussJordanInverseStepper'),
  LinearSystemCasesExplorer: lazyNamed(loadSystem, 'LinearSystemCasesExplorer'),
  LUFactorizationExplorer: lazyNamed(loadSystem, 'LUFactorizationExplorer'),

  // Chapter 3 (5)
  SubspaceClosureExplorer: lazyNamed(loadSpace, 'SubspaceClosureExplorer'),
  ColumnNullSpaceExplorer: lazyNamed(loadSpace, 'ColumnNullSpaceExplorer'),
  BasisIndependenceExplorer: lazyNamed(loadSpace, 'BasisIndependenceExplorer'),
  RankPivotExplorer: lazyNamed(loadSpace, 'RankPivotExplorer'),
  LinearTransformationExplorer: lazyNamed(loadSpace, 'LinearTransformationExplorer'),

  // Chapter 4 (4)
  OrthogonalityExplorer: lazyNamed(loadOrthogonality, 'OrthogonalityExplorer'),
  ProjectionExplorer: lazyNamed(loadOrthogonality, 'ProjectionExplorer'),
  GramSchmidtExplorer: lazyNamed(loadOrthogonality, 'GramSchmidtExplorer'),
  LeastSquaresExplorer: lazyNamed(loadOrthogonality, 'LeastSquaresExplorer'),

  // Chapter 5 (2)
  DeterminantAreaExplorer: lazyNamed(loadDeterminant, 'DeterminantAreaExplorer'),
  DeterminantRowOpsExplorer: lazyNamed(loadDeterminant, 'DeterminantRowOpsExplorer'),

  // Chapter 6 (4)
  TraceEigenvalueLink: lazyNamed(loadEigen, 'TraceEigenvalueLink'),
  EigenvectorExplorer: lazyNamed(loadEigen, 'EigenvectorExplorer'),
  DiagonalizationExplorer: lazyNamed(loadEigen, 'DiagonalizationExplorer'),
  PCAProjectionExplorer: lazyNamed(loadEigen, 'PCAProjectionExplorer'),

  // Chapter 7 (2)
  SVDGeometryExplorer: lazyNamed(loadSvd, 'SVDGeometryExplorer'),
  TruncatedSVDExplorer: lazyNamed(loadSvd, 'TruncatedSVDExplorer'),
} satisfies Record<typeof LINEAR_ALGEBRA_MDX_COMPONENT_NAMES[number], LearningMdxComponent>;

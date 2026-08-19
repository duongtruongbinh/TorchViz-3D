import type { LINEAR_ALGEBRA_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import type { LearningMdxComponent } from '../../learningMdxComponents';
import { AiDataRepresentationDemo } from './overviewRenderers';
import {
  CoordinateRepresentationDiagram,
  CosineAngleExplorer,
  CosineMotivationDiagram,
  DistancePlane,
  DotProductAngleExplorer,
  DotProductPlane,
  EmbeddingCosineDiagram,
  L2NormTriangle,
  NormUnitBallDiagram,
  NormalizationPlane,
  NormalizationProcess,
  ScalarVectorPlane,
  UnitVectorPlane,
  VectorAdditionPlane,
  VectorNormPlane,
  VectorPlane,
  VectorSubtractionPlane,
} from './vectorRenderers';
import {
  HadamardProductGrid,
  MatrixExplorer,
  MatrixProductExplorer,
  MatrixTransposeExplorer,
  MatrixVectorProductExplorer,
  OuterProductExplorer,
  ProductOverview,
} from './matrixRenderers';
import {
  ColumnCombinationExplorer,
  GaussianEliminationStepper,
  GaussJordanInverseStepper,
  LinearSystemCasesExplorer,
  LUFactorizationExplorer,
} from './systemRenderers';
import {
  SubspaceClosureExplorer,
  ColumnNullSpaceExplorer,
  BasisIndependenceExplorer,
  RankPivotExplorer,
  LinearTransformationExplorer,
} from './spaceRenderers';
import {
  OrthogonalityExplorer,
  ProjectionExplorer,
  GramSchmidtExplorer,
  LeastSquaresExplorer,
} from './orthogonalityRenderers';
import {
  DeterminantAreaExplorer,
  DeterminantRowOpsExplorer,
} from './determinantRenderers';
import {
  TraceEigenvalueLink,
  EigenvectorExplorer,
  DiagonalizationExplorer,
  PCAProjectionExplorer,
} from './eigenRenderers';
import {
  SVDGeometryExplorer,
  TruncatedSVDExplorer,
} from './svdRenderers';

export const linearAlgebraMdxComponents = {
  // Chapter 0 (1)
  AiDataRepresentationDemo,

  // Chapter 1 (24)
  CoordinateRepresentationDiagram,
  CosineAngleExplorer,
  CosineMotivationDiagram,
  DistancePlane,
  DotProductAngleExplorer,
  DotProductPlane,
  EmbeddingCosineDiagram,
  HadamardProductGrid,
  L2NormTriangle,
  MatrixExplorer,
  MatrixProductExplorer,
  MatrixTransposeExplorer,
  MatrixVectorProductExplorer,
  NormUnitBallDiagram,
  NormalizationPlane,
  NormalizationProcess,
  OuterProductExplorer,
  ProductOverview,
  ScalarVectorPlane,
  UnitVectorPlane,
  VectorAdditionPlane,
  VectorNormPlane,
  VectorPlane,
  VectorSubtractionPlane,

  // Chapter 2 (5)
  ColumnCombinationExplorer,
  GaussianEliminationStepper,
  GaussJordanInverseStepper,
  LinearSystemCasesExplorer,
  LUFactorizationExplorer,

  // Chapter 3 (5)
  SubspaceClosureExplorer,
  ColumnNullSpaceExplorer,
  BasisIndependenceExplorer,
  RankPivotExplorer,
  LinearTransformationExplorer,

  // Chapter 4 (4)
  OrthogonalityExplorer,
  ProjectionExplorer,
  GramSchmidtExplorer,
  LeastSquaresExplorer,

  // Chapter 5 (2)
  DeterminantAreaExplorer,
  DeterminantRowOpsExplorer,

  // Chapter 6 (4)
  TraceEigenvalueLink,
  EigenvectorExplorer,
  DiagonalizationExplorer,
  PCAProjectionExplorer,

  // Chapter 7 (2)
  SVDGeometryExplorer,
  TruncatedSVDExplorer,
} satisfies Record<(typeof LINEAR_ALGEBRA_MDX_COMPONENT_NAMES)[number], LearningMdxComponent>;

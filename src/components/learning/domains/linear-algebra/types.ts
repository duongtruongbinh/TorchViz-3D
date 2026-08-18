export type Vector2D = [number, number];

export interface VectorPlaneProps {
  ariaLabel: string;
  x?: number;
  y?: number;
  label?: string;
  showComponents?: boolean;
  interactive?: boolean;
}

export interface CoordinateRepresentationDiagramProps {
  ariaLabel: string;
}

export interface VectorAdditionPlaneProps {
  ariaLabel: string;
  u?: Vector2D;
  v?: Vector2D;
  showParallelogram?: boolean;
  interactive?: boolean;
}

export interface ScalarVectorPlaneProps {
  ariaLabel: string;
  v?: Vector2D;
  vector?: Vector2D;
  defaultAlpha?: number;
  initialScalar?: number;
  interactive?: boolean;
}

export interface VectorSubtractionPlaneProps {
  ariaLabel: string;
  u?: Vector2D;
  v?: Vector2D;
}

export interface VectorNormPlaneProps {
  ariaLabel: string;
  v1?: Vector2D;
  v2?: Vector2D;
  vectors?: Vector2D[];
}

export interface L2NormTriangleProps {
  ariaLabel: string;
  v?: Vector2D;
  vector?: Vector2D;
}

export interface DistancePlaneProps {
  ariaLabel: string;
  p1?: Vector2D;
  p2?: Vector2D;
  x?: Vector2D;
  y?: Vector2D;
}

export interface NormUnitBallDiagramProps {
  ariaLabel: string;
}

export interface NormalizationPlaneProps {
  ariaLabel: string;
  v?: Vector2D;
  vectors?: Vector2D[];
}

export interface UnitVectorPlaneProps {
  ariaLabel: string;
}

export interface NormalizationProcessProps {
  ariaLabel: string;
}

export interface DotProductPlaneProps {
  ariaLabel: string;
  a?: Vector2D;
  b?: Vector2D;
  interactive?: boolean;
}

export interface DotProductAngleExplorerProps {
  ariaLabel: string;
}

export interface CosineMotivationDiagramProps {
  ariaLabel: string;
}

export interface CosineAngleExplorerProps {
  ariaLabel: string;
  interactive?: boolean;
}

export interface EmbeddingCosineDiagramProps {
  ariaLabel: string;
}

export interface MatrixExplorerProps {
  ariaLabel: string;
  values?: number[][];
  highlight?: 'all' | 'indices';
}

export interface MatrixTransposeExplorerProps {
  ariaLabel: string;
  values?: number[][];
}

export interface ProductOverviewProps {
  ariaLabel: string;
}

export interface HadamardProductGridProps {
  ariaLabel: string;
}

export interface OuterProductExplorerProps {
  ariaLabel: string;
}

export interface MatrixVectorProductExplorerProps {
  ariaLabel: string;
  interactive?: boolean;
}

export interface MatrixProductExplorerProps {
  ariaLabel: string;
  interactive?: boolean;
}

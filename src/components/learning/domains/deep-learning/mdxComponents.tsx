import type { DEEP_LEARNING_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import type { LearningMdxComponent } from '../../learningMdxComponents';
import { ActivationFunctionDiagram } from './ActivationFunctionDiagram';
import { BackpropCycleDiagram } from './BackpropCycleDiagram';
import { ChainRuleLinksDiagram } from './ChainRuleLinksDiagram';
import { ConvolutionOperationExplorer } from './ConvolutionOperationExplorer';
import { FullyConnectedDiagram } from './FullyConnectedDiagram';
import { GradientDescentDirectionDiagram } from './GradientDescentDirectionDiagram';
import { HandwrittenDigitBlackboxDiagram } from './HandwrittenDigitBlackboxDiagram';
import {
  InceptionBottleneckDiagram,
  UnetSkipConnectionDiagram,
} from './InceptionBottleneckAndUnetDiagram';
import { IrisExperimentsDiagram } from './IrisExperimentsDiagram';
import { IrisScatterPlot } from './IrisScatterPlot';
import { LossFunctionDiagram } from './LossFunctionDiagram';
import { OptimizationDiagram } from './OptimizationDiagram';
import { PaddingStrideExplorer } from './PaddingStrideExplorer';
import { PerceptronBoundaryExplorer } from './PerceptronBoundaryExplorer';
import { PerceptronGeometryDiagram } from './PerceptronGeometryDiagram';
import { PoolingAndParamsExplorer } from './PoolingAndParamsExplorer';
import { PyTorchComputationGraphDiagram } from './PyTorchComputationGraphDiagram';

type DeepLearningComponentName = (typeof DEEP_LEARNING_MDX_COMPONENT_NAMES)[number];

export const deepLearningMdxComponents = {
  ActivationFunctionDiagram: ActivationFunctionDiagram as LearningMdxComponent,
  BackpropCycleDiagram,
  ChainRuleLinksDiagram,
  ConvolutionOperationExplorer,
  FullyConnectedDiagram: FullyConnectedDiagram as LearningMdxComponent,
  GradientDescentDirectionDiagram,
  HandwrittenDigitBlackboxDiagram,
  InceptionBottleneckDiagram,
  IrisExperimentsDiagram,
  IrisScatterPlot,
  LossFunctionDiagram: LossFunctionDiagram as LearningMdxComponent,
  OptimizationDiagram: OptimizationDiagram as LearningMdxComponent,
  PaddingStrideExplorer,
  PerceptronBoundaryExplorer,
  PerceptronGeometryDiagram: PerceptronGeometryDiagram as LearningMdxComponent,
  PoolingAndParamsExplorer,
  PyTorchComputationGraphDiagram,
  UnetSkipConnectionDiagram,
} satisfies Record<DeepLearningComponentName, LearningMdxComponent>;

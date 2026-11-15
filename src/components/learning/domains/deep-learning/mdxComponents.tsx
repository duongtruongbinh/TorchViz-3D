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

export const deepLearningMdxComponents: Record<string, LearningMdxComponent> = {
  ActivationFunctionDiagram,
  BackpropCycleDiagram,
  ChainRuleLinksDiagram,
  ConvolutionOperationExplorer,
  FullyConnectedDiagram,
  GradientDescentDirectionDiagram,
  HandwrittenDigitBlackboxDiagram,
  InceptionBottleneckDiagram,
  IrisExperimentsDiagram,
  IrisScatterPlot,
  LossFunctionDiagram,
  OptimizationDiagram,
  PaddingStrideExplorer,
  PerceptronBoundaryExplorer,
  PerceptronGeometryDiagram,
  PoolingAndParamsExplorer,
  PyTorchComputationGraphDiagram,
  UnetSkipConnectionDiagram,
};

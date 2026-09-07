import type { RESEARCH_PAPERS_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import type { LearningMdxComponent } from '../../learningMdxComponents';
import { MatrixTransformStepper } from './MatrixTransformStepper';

export const researchPapersMdxComponents = {
  MatrixTransformStepper,
} satisfies Record<(typeof RESEARCH_PAPERS_MDX_COMPONENT_NAMES)[number], LearningMdxComponent>;

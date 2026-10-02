import type { RESEARCH_PAPERS_MDX_COMPONENT_NAMES } from '../../../../content/learning/mdxComponents';
import type { LearningMdxComponent } from '../../learningMdxComponents';
import { MatrixTransformStepper } from './MatrixTransformStepper';
import { PaperExcerpt } from './PaperExcerpt';

export const researchPapersMdxComponents = {
  MatrixTransformStepper,
  PaperExcerpt,
} satisfies Record<(typeof RESEARCH_PAPERS_MDX_COMPONENT_NAMES)[number], LearningMdxComponent>;

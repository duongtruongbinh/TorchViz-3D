import { materializeLearningCatalog } from '../../core/learning/materializeCatalog.ts';
import type { LearningTableOfContents } from '../../core/learning/types.ts';
import { learningTableOfContents as aiEthicsSafetyGovernanceToc } from './ai-ethics-safety-governance/table-of-contents.ts';
import { learningTableOfContents as aiSystemDesignToc } from './ai-system-design/table-of-contents.ts';
import { learningTableOfContents as cvToc } from './cv/table-of-contents.ts';
import { learningTableOfContents as continualLearningLlmToc } from './continual-learning-llm/table-of-contents.ts';
import { learningTableOfContents as deepLearningToc } from './deep-learning/table-of-contents.ts';
import { learningTableOfContents as fundamentalsToc } from './fundamentals/table-of-contents.ts';
import { learningTableOfContents as llmAiEngineeringToc } from './llm-ai-engineering/table-of-contents.ts';
import { learningTableOfContents as linearAlgebraToc } from './linear-algebra/table-of-contents.ts';
import { learningTableOfContents as mlopsLlmopsProductionSystemsToc } from './mlops-llmops-production-systems/table-of-contents.ts';
import { learningTableOfContents as nlpToc } from './nlp/table-of-contents.ts';
import { learningTableOfContents as programmingFoundationToc } from './programming-foundation/table-of-contents.ts';
import { learningTableOfContents as reinforcementLearningToc } from './reinforcement-learning/table-of-contents.ts';
import { learningTableOfContents as evolutionaryAlgorithmsToc } from './evolutionary-algorithms/table-of-contents.ts';
import { learningTableOfContents as researchPapersToc } from './research-papers/table-of-contents.ts';
import { learningTableOfContents as robotLearningToc } from './robot-learning/table-of-contents.ts';

export const learningTableOfContents = [
  programmingFoundationToc,
  linearAlgebraToc,
  fundamentalsToc,
  deepLearningToc,
  cvToc,
  nlpToc,
  llmAiEngineeringToc,
  continualLearningLlmToc,
  mlopsLlmopsProductionSystemsToc,
  aiSystemDesignToc,
  reinforcementLearningToc,
  aiEthicsSafetyGovernanceToc,
  robotLearningToc,
  evolutionaryAlgorithmsToc,
  researchPapersToc,
] satisfies LearningTableOfContents[];

export const learningCatalog = materializeLearningCatalog(learningTableOfContents);

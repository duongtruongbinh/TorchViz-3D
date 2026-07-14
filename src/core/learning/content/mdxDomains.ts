import { CV_MDX_COMPONENT_NAMES } from './cv/mdxComponents.ts';
import { LLM_MDX_COMPONENT_NAMES } from './llm-ai-engineering/mdxComponents.ts';
import { SHARED_LEARNING_MDX_COMPONENT_NAMES } from './mdxContract.ts';

const domainMdxComponentNames = {
  cv: CV_MDX_COMPONENT_NAMES,
  'llm-ai-engineering': LLM_MDX_COMPONENT_NAMES,
} as const;

export function getAllowedLearningMdxComponentNames(domainId: string): readonly string[] {
  const domainNames = domainMdxComponentNames[domainId as keyof typeof domainMdxComponentNames] ?? [];
  return [...SHARED_LEARNING_MDX_COMPONENT_NAMES, ...domainNames];
}

/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { ComponentType } from 'react';
  import type { LearningMdxRuntimeCapabilities } from './core/learning/mdxContract';

  export const lessonMetadata: {
    domainId: string;
    id: string;
    locale: string;
    title: string;
    headings: string[];
    keywords: string[];
    pageCount?: number;
  };
  export const lessonRuntime: LearningMdxRuntimeCapabilities;

  const MdxContent: ComponentType<{
    components?: Record<string, ComponentType<Record<string, unknown>>>;
  }>;

  export default MdxContent;
}

declare module 'virtual:learning-mdx-search-loaders' {
  import type { LearningMdxSearchDocument } from './core/learning/mdxContract';
  import type { LearningDomainId } from './core/learning/types';

  const loaders: Record<LearningDomainId, () => Promise<{ default: LearningMdxSearchDocument[] }>>;
  export default loaders;
}

declare module 'virtual:learning-home-catalog' {
  import type { LearningHomeDomainSummary } from './core/learning/types';

  const domains: LearningHomeDomainSummary[];
  export default domains;
}

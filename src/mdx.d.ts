/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { ComponentType } from 'react';

  export const lessonMetadata: {
    domainId: string;
    id: string;
    locale: string;
    title: string;
    headings: string[];
    keywords: string[];
    pageCount?: number;
  };

  const MdxContent: ComponentType<{
    components?: Record<string, ComponentType<Record<string, unknown>>>;
  }>;

  export default MdxContent;
}

declare module 'virtual:learning-mdx-search-documents' {
  import type { LearningMdxSearchDocument } from './core/learning/mdxContract';

  const documents: LearningMdxSearchDocument[];
  export default documents;
}

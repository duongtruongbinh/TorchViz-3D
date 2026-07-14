export type LearningDomainId =
  | 'programming-foundation'
  | 'math-statistics-ai'
  | 'fundamentals'
  | 'deep-learning'
  | 'cv'
  | 'nlp'
  | 'llm-ai-engineering'
  | 'mlops-llmops-production-systems'
  | 'ai-system-design'
  | 'ai-ethics-safety-governance'
  | 'reinforcement-learning'
  | 'robot-learning';

export type LearningDomainStatus = 'active' | 'partial' | 'placeholder';
export type LearningTrackStatus = 'available' | 'placeholder';
export type LearningLessonStatus = 'available' | 'next' | 'locked';
export type LearningContentStatus = 'missing' | 'draft' | 'published';
export type LearningLessonTag = 'exercise';
export type LearningExerciseOperationFamily = 'conv2d' | 'pool2d';

export type LearningLessonEntryPoint = {
  kind: 'torchviz-exercise';
  exerciseId: string;
  operationFamily: LearningExerciseOperationFamily;
};

export type LearningLocalizedText = {
  en: string;
  vi: string;
};

export type LearningAssetId = string;

export type LearningLessonSection = {
  kind: 'theory' | 'code' | 'calculation';
  refId: string;
};

export type LearningTokenExample = {
  title: LearningLocalizedText;
  variants: Array<{
    label: LearningLocalizedText;
    tokens: string[];
    description: LearningLocalizedText;
  }>;
  specialCases: Array<{
    label: LearningLocalizedText;
    tokens: string[];
    description: LearningLocalizedText;
  }>;
  notes: LearningLocalizedText[];
};

export type LearningLessonExtra =
  | {
      kind: 'motivation';
      id: string;
      sectionRefId?: string;
      title: LearningLocalizedText;
      image: LearningAssetId;
      imageAlt: LearningLocalizedText;
      body: LearningLocalizedText[];
      hierarchy?: {
        ariaLabel: LearningLocalizedText;
        rows: Array<{
          shortName: string;
          fullName: string;
          description: LearningLocalizedText;
          depth: 'widest' | 'middle' | 'branch' | 'target';
          compact?: boolean;
        }>;
        branchLabel?: LearningLocalizedText;
      };
    }
  | {
      kind: 'conceptInteraction';
      id: string;
      sectionRefId?: string;
      title: LearningLocalizedText;
      body: LearningLocalizedText[];
      note?: LearningLocalizedText;
      image: LearningAssetId;
      imageAlt: LearningLocalizedText;
      prompt: LearningLocalizedText;
      blankLabel: LearningLocalizedText;
      labels: {
        chooseNextToken: LearningLocalizedText;
        emptySentence: LearningLocalizedText;
        removeLastWord: LearningLocalizedText;
        reset: LearningLocalizedText;
      };
      options: Array<{
        label: LearningLocalizedText;
        isCorrect?: boolean;
        feedback: LearningLocalizedText;
      }>;
      interactionPlacement?: 'inline' | 'none' | 'only';
      sentenceBuilder?: {
        title: LearningLocalizedText;
        prompt: LearningLocalizedText;
        targets: LearningLocalizedText[][];
        choices: LearningLocalizedText[];
        success: LearningLocalizedText;
        error: LearningLocalizedText;
      };
    }
  | {
      kind: 'conceptPanel';
      id: string;
      sectionRefId?: string;
      title: LearningLocalizedText;
      emphasis?: LearningLocalizedText;
      body?: LearningLocalizedText[];
      bodyAfter?: LearningLocalizedText[];
      highlights?: Array<{
        shortName: LearningLocalizedText;
        fullName: LearningLocalizedText;
        description: LearningLocalizedText;
        links?: Array<{
          label: LearningLocalizedText;
          href: string;
        }>;
      }>;
      comparisonTable?: {
        columns: LearningLocalizedText[];
        rows: Array<{
          label: LearningLocalizedText;
          cells: LearningLocalizedText[];
        }>;
      };
      outline?: Array<{
        title: LearningLocalizedText;
        body: LearningLocalizedText;
        items: Array<{
          title: LearningLocalizedText;
          body: LearningLocalizedText;
        }>;
      }>;
      links?: Array<{
        label: LearningLocalizedText;
        href: string;
      }>;
      tokenExample?: LearningTokenExample;
    }
  | {
      kind: 'quiz';
      id: string;
      sectionRefId?: string;
      title: LearningLocalizedText;
      questions: Array<{
        id: string;
        title: LearningLocalizedText;
        prompt: LearningLocalizedText;
        mode: 'order' | 'single' | 'multi' | 'categorize';
        hideUnsortedLabel?: boolean;
        unsortedLabel?: LearningLocalizedText;
        completeLabel?: LearningLocalizedText;
        options: Array<{
          id: string;
          label: LearningLocalizedText;
          isCorrect?: boolean;
          categoryId?: string;
        }>;
        categories?: Array<{
          id: string;
          label: LearningLocalizedText;
        }>;
        correctOrder?: string[];
        success: LearningLocalizedText;
        error: LearningLocalizedText;
      }>;
    };

export type LearningLesson = {
  id: string;
  domainId: LearningDomainId;
  trackId: string;
  status: LearningLessonStatus;
  contentStatus: LearningContentStatus;
  tags: LearningLessonTag[];
  entryPoints: LearningLessonEntryPoint[];
  text?: {
    title: LearningLocalizedText;
    eyebrow?: LearningLocalizedText;
    duration?: LearningLocalizedText;
    theory: LearningLocalizedText[];
  };
  sections: LearningLessonSection[];
};

export type LearningTocLessonSeed = string | {
  id: string;
  title?: LearningLocalizedText;
  status?: LearningLessonStatus;
  contentStatus?: LearningContentStatus;
  tags?: LearningLessonTag[];
  entryPoints?: LearningLessonEntryPoint[];
  sections?: LearningLessonSection[];
};

export type LearningTocTrackSeed = {
  id: string;
  text: {
    title: LearningLocalizedText;
    description: LearningLocalizedText;
  };
  lessonIds: LearningTocLessonSeed[];
  status?: LearningTrackStatus;
};

export type LearningTableOfContents = {
  id: LearningDomainId;
  text: {
    title: LearningLocalizedText;
    description: LearningLocalizedText;
  };
  status: LearningDomainStatus;
  fallbackLocales?: string[];
  sectionKinds: LearningLessonSection['kind'][];
  firstLessonStatus?: LearningLessonStatus;
  defaultLessonStatus?: LearningLessonStatus;
  chapters: LearningTocTrackSeed[];
  routeAliases?: Omit<LearningRouteAlias, 'domainId'>[];
};

export type LearningTrack = {
  id: string;
  text: {
    title: LearningLocalizedText;
    description: LearningLocalizedText;
  };
  domainId: LearningDomainId;
  lessonIds: string[];
  status: LearningTrackStatus;
};

export type LearningDomain = {
  id: LearningDomainId;
  text: {
    title: LearningLocalizedText;
    description: LearningLocalizedText;
  };
  status: LearningDomainStatus;
  trackIds: string[];
  mdx?: {
    fallbackLocales: string[];
  };
};

export type LearningRouteAlias = {
  domainId: LearningDomainId;
  fromTrackId?: string;
  fromLessonId?: string;
  toTrackId?: string;
  toLessonId?: string;
};

export type LearningCatalog = {
  domains: LearningDomain[];
  tracks: LearningTrack[];
  lessons: LearningLesson[];
  routeAliases?: LearningRouteAlias[];
};

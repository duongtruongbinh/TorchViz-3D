export type LearningDomainId =
  | 'programming-foundation'
  | 'linear-algebra'
  | 'fundamentals'
  | 'deep-learning'
  | 'cv'
  | 'nlp'
  | 'llm-ai-engineering'
  | 'continual-learning-llm'
  | 'mlops-llmops-production-systems'
  | 'ai-system-design'
  | 'ai-ethics-safety-governance'
  | 'reinforcement-learning'
  | 'robot-learning'
  | 'research-papers';

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

export type LearningLessonSection = {
  kind: 'theory' | 'code' | 'calculation';
  refId: string;
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

export type LearningDomainReadinessState = 'ready' | 'updating' | 'unupdated';

export type LearningDomainReadiness = {
  domain: LearningDomain;
  isReady: boolean;
  readinessState: LearningDomainReadinessState;
};

export type LearningHomeDomainSummary = {
  domain: LearningDomain;
  lessonCount: number;
  isReady: boolean;
  readinessState: LearningDomainReadinessState;
};

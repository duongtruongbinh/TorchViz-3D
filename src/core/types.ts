export type LearningPracticeKind = 'shape' | 'value' | 'review';

export type LearningPracticeRef = {
  id: string;
  kind: LearningPracticeKind;
  exerciseId: 'conv-value' | 'shape-output' | 'attention-shape' | 'pool-value' | 'linear-value' | 'activation-value';
  targetOperation: string;
  approval?: {
    status: 'approved' | 'unavailable';
    implementedBy?: string;
  };
  reuseStatus: 'metadata' | 'model-backed' | 'embedded';
  fixture: LearningNodeFixture;
};

export type LearningNodeFixture = {
  opType: string;
  inShape: number[];
  outShape: number[];
  meta?: Record<string, unknown>;
};

export type LearningLesson = {
  id: string;
  status: 'available' | 'next' | 'locked';
  practice: LearningPracticeRef[];
};

export type LearningPath = {
  id: string;
  lessons: LearningLesson[];
};

export type LearningDomain = {
  id: string;
  lessonIds: string[];
};

export type LearningRole = {
  id: string;
  domains: LearningDomain[];
};

export type LearningDomainId =
  | 'fundamentals'
  | 'cv'
  | 'nlp'
  | 'reinforcement-learning'
  | 'robot-learning';

export type LearningDomainStatus = 'active' | 'partial' | 'placeholder';
export type LearningTrackStatus = 'available' | 'placeholder';
export type LearningLessonStatus = 'available' | 'next' | 'locked';
export type LearningPracticeApprovalStatus = 'approved' | 'unavailable';

export type LearningPracticeApproval = {
  status: LearningPracticeApprovalStatus;
  implementedBy?: string;
};

export type TensorExerciseId =
  | 'conv-value'
  | 'shape-output'
  | 'attention-shape'
  | 'pool-value'
  | 'linear-value'
  | 'activation-value';

export type TensorPracticeKind = 'shape' | 'value' | 'review';

export type ReinforcementExerciseId =
  | 'rl-mdp-components'
  | 'rl-bellman-value'
  | 'rl-q-learning-gridworld'
  | 'rl-sarsa-gridworld';

export type ReinforcementPracticeKind = 'rl-shape' | 'rl-value' | 'gridworld';

export type PracticeReuseStatus = 'metadata' | 'model-backed' | 'embedded';

export type TensorPracticeRef = {
  family: 'tensor';
  id: string;
  kind: TensorPracticeKind;
  exerciseId: TensorExerciseId;
  targetOperation: string;
  approval?: LearningPracticeApproval;
  reuseStatus: PracticeReuseStatus;
};

export type ReinforcementPracticeRef = {
  family: 'reinforcement-learning';
  id: string;
  kind: ReinforcementPracticeKind;
  exerciseId: ReinforcementExerciseId;
  targetConcept: string;
  approval?: LearningPracticeApproval;
  reuseStatus: PracticeReuseStatus;
};

export type PlaceholderPracticeRef = {
  family: 'placeholder';
  id: string;
  kind: 'placeholder';
  targetConcept: string;
  approval?: LearningPracticeApproval;
  reuseStatus: 'metadata';
};

export type LearningPracticeRef = TensorPracticeRef | ReinforcementPracticeRef | PlaceholderPracticeRef;

export type LearningLessonSection = {
  kind: 'theory' | 'code' | 'practice' | 'calculation';
  refId: string;
};

export type LearningLesson = {
  id: string;
  domainId: LearningDomainId;
  trackId: string;
  status: LearningLessonStatus;
  sections: LearningLessonSection[];
  practice: LearningPracticeRef[];
};

export type LearningTrack = {
  id: string;
  domainId: LearningDomainId;
  lessonIds: string[];
  status: LearningTrackStatus;
};

export type LearningDomain = {
  id: LearningDomainId;
  status: LearningDomainStatus;
  trackIds: string[];
};

export type LearningCatalog = {
  domains: LearningDomain[];
  tracks: LearningTrack[];
  lessons: LearningLesson[];
};

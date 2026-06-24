export type RLLearningPracticeKind = 'rl-shape' | 'rl-value' | 'gridworld';

export type RLExerciseId =
  | 'rl-mdp-components'
  | 'rl-bellman-value'
  | 'rl-q-learning-gridworld'
  | 'rl-sarsa-gridworld';

export type RLApprovalStatus = 'approved' | 'unavailable';

export type RLLearningPracticeRef = {
  id: string;
  kind: RLLearningPracticeKind;
  exerciseId: RLExerciseId;
  targetConcept: string;
  approval?: {
    status: RLApprovalStatus;
    implementedBy?: string;
  };
  reuseStatus: 'metadata' | 'model-backed' | 'embedded';
};

export type RLLearningLesson = {
  id: string;
  status: 'available' | 'next' | 'locked';
  practice: RLLearningPracticeRef[];
};

export type RLLearningPath = {
  id: string;
  lessons: RLLearningLesson[];
};

export type RLLearningDomain = {
  id: string;
  lessonIds: string[];
};

export type RLLearningRole = {
  id: string;
  domains: RLLearningDomain[];
};

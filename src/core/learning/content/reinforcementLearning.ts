import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';

export const reinforcementLearningDomain: LearningDomain = {
  id: 'reinforcement-learning',
  textKey: 'reinforcementLearning',
  status: 'active',
  trackIds: ['tabular-control', 'policy-behavior'],
};

export const reinforcementLearningTracks: LearningTrack[] = [
  {
    id: 'tabular-control',
    textKey: 'tabularControl',
    domainId: 'reinforcement-learning',
    status: 'available',
    lessonIds: ['rl-mdp-basics', 'rl-bellman', 'rl-q-learning', 'rl-sarsa'],
  },
  {
    id: 'policy-behavior',
    textKey: 'policyBehavior',
    domainId: 'reinforcement-learning',
    status: 'available',
    lessonIds: ['rl-mdp-basics', 'rl-q-learning', 'rl-sarsa'],
  },
];

export const reinforcementLearningLessons: LearningLesson[] = [
  {
    id: 'rl-mdp-basics',
    domainId: 'reinforcement-learning',
    trackId: 'tabular-control',
    status: 'available',
    sections: [{ kind: 'theory', refId: 'rl-mdp-basics' }, { kind: 'practice', refId: 'rl-mdp-components-gridworld' }],
    practice: [
      {
        family: 'reinforcement-learning',
        id: 'rl-mdp-components-gridworld',
        kind: 'rl-shape',
        exerciseId: 'rl-mdp-components',
        targetConcept: 'MDP state, action, transition, reward, discount, episode, policy',
        approval: { status: 'approved', implementedBy: 'Codex' },
        reuseStatus: 'embedded',
      },
    ],
  },
  {
    id: 'rl-bellman',
    domainId: 'reinforcement-learning',
    trackId: 'tabular-control',
    status: 'available',
    sections: [{ kind: 'theory', refId: 'rl-bellman' }, { kind: 'practice', refId: 'rl-bellman-q-table-value' }],
    practice: [
      {
        family: 'reinforcement-learning',
        id: 'rl-bellman-q-table-value',
        kind: 'rl-value',
        exerciseId: 'rl-bellman-value',
        targetConcept: 'Bellman expectation and optimality from a small Q-table',
        approval: { status: 'approved', implementedBy: 'Codex' },
        reuseStatus: 'embedded',
      },
    ],
  },
  {
    id: 'rl-q-learning',
    domainId: 'reinforcement-learning',
    trackId: 'tabular-control',
    status: 'next',
    sections: [{ kind: 'theory', refId: 'rl-q-learning' }, { kind: 'practice', refId: 'rl-q-learning-gridworld-step' }],
    practice: [
      {
        family: 'reinforcement-learning',
        id: 'rl-q-learning-gridworld-step',
        kind: 'gridworld',
        exerciseId: 'rl-q-learning-gridworld',
        targetConcept: 'Off-policy temporal-difference update with epsilon-greedy action selection',
        approval: { status: 'approved', implementedBy: 'Codex' },
        reuseStatus: 'embedded',
      },
    ],
  },
  {
    id: 'rl-sarsa',
    domainId: 'reinforcement-learning',
    trackId: 'tabular-control',
    status: 'locked',
    sections: [{ kind: 'theory', refId: 'rl-sarsa' }, { kind: 'practice', refId: 'rl-sarsa-gridworld-step' }],
    practice: [
      {
        family: 'reinforcement-learning',
        id: 'rl-sarsa-gridworld-step',
        kind: 'gridworld',
        exerciseId: 'rl-sarsa-gridworld',
        targetConcept: 'On-policy temporal-difference update using the next selected action',
        approval: { status: 'approved', implementedBy: 'Codex' },
        reuseStatus: 'embedded',
      },
    ],
  },
];

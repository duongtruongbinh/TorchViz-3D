import type { RLLearningPath, RLLearningRole } from './rlTypes';

export const rlLearningPath: RLLearningPath = {
  id: 'torchviz-rl-foundations',
  lessons: [
    {
      id: 'rl-mdp-basics',
      status: 'available',
      practice: [
        {
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
      status: 'available',
      practice: [
        {
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
      status: 'next',
      practice: [
        {
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
      status: 'locked',
      practice: [
        {
          id: 'rl-sarsa-gridworld-step',
          kind: 'gridworld',
          exerciseId: 'rl-sarsa-gridworld',
          targetConcept: 'On-policy temporal-difference update using the next selected action',
          approval: { status: 'approved', implementedBy: 'Codex' },
          reuseStatus: 'embedded',
        },
      ],
    },
  ],
};

export const rlLearningLessons = rlLearningPath.lessons;

export const rlLearningRoles: RLLearningRole[] = [
  {
    id: 'reinforcement-learning',
    domains: [
      {
        id: 'tabular-control',
        lessonIds: ['rl-mdp-basics', 'rl-bellman', 'rl-q-learning', 'rl-sarsa'],
      },
      {
        id: 'policy-behavior',
        lessonIds: ['rl-mdp-basics', 'rl-q-learning', 'rl-sarsa'],
      },
    ],
  },
  {
    id: 'robot-learning',
    domains: [],
  },
];

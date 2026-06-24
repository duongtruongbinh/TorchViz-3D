import type { RLLearningPracticeRef } from '../../core/rlTypes';

export type RLPracticeFixture =
  | {
      type: 'mdp';
      states: string[];
      actions: string[];
      transitions: Array<{ from: string; action: string; to: string; reward: number }>;
      discount: number;
      answer: {
        state: string;
        action: string;
        reward: string;
        discount: string;
      };
    }
  | {
      type: 'bellman';
      state: string;
      discount: number;
      qValues: Array<{ action: string; value: number }>;
      answer: number;
    }
  | {
      type: 'gridworld';
      algorithm: 'q-learning' | 'sarsa';
      gridSize: number;
      state: string;
      action: string;
      reward: number;
      currentQ: number;
      nextMaxQ: number;
      nextActionQ: number;
      alpha: number;
      gamma: number;
      answer: number;
    };

const FIXTURES: Record<string, RLPracticeFixture> = {
  'rl-mdp-components-gridworld': {
    type: 'mdp',
    states: ['S0', 'S1', 'S2', 'Goal'],
    actions: ['right', 'down'],
    transitions: [
      { from: 'S0', action: 'right', to: 'S1', reward: -1 },
      { from: 'S1', action: 'right', to: 'Goal', reward: 10 },
      { from: 'S0', action: 'down', to: 'S2', reward: -1 },
    ],
    discount: 0.9,
    answer: { state: 'S1', action: 'right', reward: '10', discount: '0.9' },
  },
  'rl-bellman-q-table-value': {
    type: 'bellman',
    state: 'S1',
    discount: 0.9,
    qValues: [
      { action: 'left', value: 1.2 },
      { action: 'right', value: 4.5 },
      { action: 'down', value: 2.1 },
    ],
    answer: 4.5,
  },
  'rl-q-learning-gridworld-step': {
    type: 'gridworld',
    algorithm: 'q-learning',
    gridSize: 4,
    state: 'S5',
    action: 'right',
    reward: -1,
    currentQ: 0.4,
    nextMaxQ: 2,
    nextActionQ: 1.2,
    alpha: 0.5,
    gamma: 0.9,
    answer: 1.1,
  },
  'rl-sarsa-gridworld-step': {
    type: 'gridworld',
    algorithm: 'sarsa',
    gridSize: 4,
    state: 'S5',
    action: 'right',
    reward: -1,
    currentQ: 0.4,
    nextMaxQ: 2,
    nextActionQ: 1.2,
    alpha: 0.5,
    gamma: 0.9,
    answer: 0.74,
  },
};

export function isRLPracticeApproved(practice: RLLearningPracticeRef): boolean {
  return practice.approval?.status === 'approved' && Boolean(practice.approval.implementedBy);
}

export function getRLPracticeFixture(practice: RLLearningPracticeRef): RLPracticeFixture | null {
  if (!isRLPracticeApproved(practice)) return null;
  return FIXTURES[practice.id] ?? null;
}

export function checkRLNumericAnswer(answer: string, expected: number, tolerance = 0.01): boolean {
  const parsed = Number(answer);
  return Number.isFinite(parsed) && Math.abs(parsed - expected) <= tolerance;
}

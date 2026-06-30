import type { LearningDomain, LearningLesson, LearningTrack } from '../types.ts';
import { buildPlaceholderContent, type LearningChapterSeed } from './seed.ts';

const chapters: LearningChapterSeed[] = [
  {
    id: 'rl-fundamentals',
    textKey: 'rlFundamentals',
    lessonIds: [
      {
        id: 'markov-decision-processes',
        title: { en: 'MDP basics', vi: 'Nền tảng MDP' },
        theory: [
          {
            en: 'An MDP defines states, actions, transition dynamics, rewards, a discount factor, episodes, and a policy.',
            vi: 'MDP định nghĩa state, action, dynamics chuyển trạng thái, reward, hệ số discount, episode và policy.',
          },
          {
            en: 'The useful debugging habit is to name which part of the environment each symbol represents before applying an update.',
            vi: 'Thói quen debug hữu ích là gọi tên từng ký hiệu thuộc phần nào của environment trước khi áp dụng công thức.',
          },
        ],
      },
      'agent-environment-state-action-reward',
      'policy-state-action-mapping',
      {
        id: 'value-function',
        title: { en: 'Bellman values', vi: 'Giá trị Bellman' },
        theory: [
          {
            en: 'Bellman equations connect a current value to immediate reward plus discounted future value.',
            vi: 'Phương trình Bellman nối giá trị hiện tại với reward tức thời cộng giá trị tương lai đã discount.',
          },
          {
            en: 'For optimality, the agent chooses the action with the highest future value estimate.',
            vi: 'Với tối ưu, agent chọn action có ước lượng giá trị tương lai cao nhất.',
          },
        ],
      },
      'q-function',
      'exploration-vs-exploitation',
      'discount-factor-gamma',
    ],
  },
  {
    id: 'value-based-methods',
    textKey: 'valueBasedMethods',
    lessonIds: [
      {
        id: 'q-learning',
        title: { en: 'Q-Learning update', vi: 'Cập nhật Q-Learning' },
        theory: [
          {
            en: 'Q-Learning is off-policy: the target uses the best next action, even if exploration picked something else.',
            vi: 'Q-Learning là off-policy: target dùng action kế tiếp tốt nhất, dù exploration có thể chọn action khác.',
          },
          {
            en: 'The update moves the old Q estimate toward reward plus discounted max next Q.',
            vi: 'Cập nhật kéo ước lượng Q cũ về reward cộng max next Q đã discount.',
          },
        ],
      },
      {
        id: 'sarsa-on-policy-td',
        title: { en: 'SARSA update', vi: 'Cập nhật SARSA' },
        theory: [
          {
            en: 'SARSA is on-policy: the target uses the next action actually selected by the current policy.',
            vi: 'SARSA là on-policy: target dùng action kế tiếp thật sự được policy hiện tại chọn.',
          },
          {
            en: 'Comparing SARSA with Q-Learning makes the policy boundary visible in one update.',
            vi: 'So sánh SARSA với Q-Learning làm rõ ranh giới policy chỉ trong một cập nhật.',
          },
        ],
      },
      'deep-q-network',
      'double-dueling-dqn-prioritized-replay',
    ],
  },
  {
    id: 'policy-based-methods',
    textKey: 'policyBasedMethods',
    lessonIds: [
      'reinforce-policy-gradient',
      'actor-critic-methods',
      'proximal-policy-optimization',
      'group-relative-policy-optimization',
    ],
  },
  {
    id: 'rl-for-llms',
    textKey: 'rlForLlms',
    lessonIds: [
      'rlhf-pipeline',
      'reward-model-training',
      'ppo-kl-constraint',
      'direct-preference-optimization-rl',
      'rlaif',
      'constitutional-ai-rl',
      'process-reward-models',
      'outcome-reward-models',
    ],
  },
  {
    id: 'multi-agent-rl',
    textKey: 'multiAgentRl',
    lessonIds: [
      'cooperative-vs-competitive-agents',
      'game-theory-basics',
      'self-play-training',
      'multi-agent-communication',
    ],
  },
];

const reinforcementLearningContent = buildPlaceholderContent({
  domainId: 'reinforcement-learning',
  domainTextKey: 'reinforcementLearning',
  domainStatus: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
});

export const reinforcementLearningDomain: LearningDomain = reinforcementLearningContent.domain;
export const reinforcementLearningTracks: LearningTrack[] = reinforcementLearningContent.tracks;
export const reinforcementLearningLessons: LearningLesson[] = reinforcementLearningContent.lessons.map((lesson) => {
  if (lesson.id === 'markov-decision-processes') {
    return {
      ...lesson,
      sections: [{ kind: 'theory', refId: 'markov-decision-processes' }, { kind: 'practice', refId: 'rl-mdp-components-gridworld' }],
      practice: [
        {
          family: 'reinforcement-learning',
          id: 'rl-mdp-components-gridworld',
          kind: 'rl-shape',
          exerciseId: 'rl-mdp-components',
          targetConcept: 'MDP state, action, transition, reward, discount, episode, policy',
          approval: { status: 'unapproved', implementedBy: 'duytrannd' },
          reuseStatus: 'embedded',
        },
      ],
    };
  }

  if (lesson.id === 'value-function') {
    return {
      ...lesson,
      sections: [{ kind: 'theory', refId: 'value-function' }, { kind: 'practice', refId: 'rl-bellman-q-table-value' }],
      practice: [
        {
          family: 'reinforcement-learning',
          id: 'rl-bellman-q-table-value',
          kind: 'rl-value',
          exerciseId: 'rl-bellman-value',
          targetConcept: 'Bellman expectation and optimality from a small Q-table',
          approval: { status: 'unapproved', implementedBy: 'duytrannd' },
          reuseStatus: 'embedded',
        },
      ],
    };
  }

  if (lesson.id === 'q-learning') {
    return {
      ...lesson,
      sections: [{ kind: 'theory', refId: 'q-learning' }, { kind: 'practice', refId: 'rl-q-learning-gridworld-step' }],
      practice: [
        {
          family: 'reinforcement-learning',
          id: 'rl-q-learning-gridworld-step',
          kind: 'gridworld',
          exerciseId: 'rl-q-learning-gridworld',
          targetConcept: 'Off-policy temporal-difference update with epsilon-greedy action selection',
          approval: { status: 'unapproved', implementedBy: 'duytrannd' },
          reuseStatus: 'embedded',
        },
      ],
    };
  }

  if (lesson.id === 'sarsa-on-policy-td') {
    return {
      ...lesson,
      sections: [{ kind: 'theory', refId: 'sarsa-on-policy-td' }, { kind: 'practice', refId: 'rl-sarsa-gridworld-step' }],
      practice: [
        {
          family: 'reinforcement-learning',
          id: 'rl-sarsa-gridworld-step',
          kind: 'gridworld',
          exerciseId: 'rl-sarsa-gridworld',
          targetConcept: 'On-policy temporal-difference update using the next selected action',
          approval: { status: 'unapproved', implementedBy: 'duytrannd' },
          reuseStatus: 'embedded',
        },
      ],
    };
  }

  return lesson;
});

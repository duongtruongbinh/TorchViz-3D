import type { LearningTableOfContents, LearningTocTrackSeed } from '../../../core/learning/types.ts';

const chapters: LearningTocTrackSeed[] = [
  {
    id: 'rl-fundamentals',
    text: {
      title: { en: "1.1 RL Fundamentals", vi: "1.1 RL Fundamentals" },
      description: { en: "MDPs, agents, environments, policies, values, Q-functions, exploration, and discounting.", vi: "MDP, agent, environment, policy, value, Q-function, exploration và discount factor." },
    },
    lessonIds: [
      'markov-decision-processes',
      'agent-environment-state-action-reward',
      'policy-state-action-mapping',
      'value-function',
      'q-function',
      'exploration-vs-exploitation',
      'discount-factor-gamma',
    ],
  },
  {
    id: 'value-based-methods',
    text: {
      title: { en: "1.2 Value-Based Methods", vi: "1.2 Value-Based Methods" },
      description: { en: "Q-learning, DQN, Double DQN, Dueling DQN, prioritized replay, and TD update practice.", vi: "Q-learning, DQN, Double DQN, Dueling DQN, prioritized replay và practice TD update." },
    },
    lessonIds: [
      'q-learning',
      'sarsa-on-policy-td',
      'deep-q-network',
      'double-dueling-dqn-prioritized-replay',
    ],
  },
  {
    id: 'policy-based-methods',
    text: {
      title: { en: "1.3 Policy-Based Methods", vi: "1.3 Policy-Based Methods" },
      description: { en: "REINFORCE, actor-critic methods, PPO for RLHF, and GRPO for reasoning models.", vi: "REINFORCE, actor-critic, PPO cho RLHF và GRPO cho reasoning model." },
    },
    lessonIds: [
      'reinforce-policy-gradient',
      'actor-critic-methods',
      'proximal-policy-optimization',
      'group-relative-policy-optimization',
    ],
  },
  {
    id: 'rl-for-llms',
    text: {
      title: { en: "1.4 RL for LLMs", vi: "1.4 RL for LLMs" },
      description: { en: "RLHF, reward models, PPO with KL constraints, DPO, RLAIF, Constitutional AI, PRMs, and ORMs.", vi: "RLHF, reward model, PPO với KL constraint, DPO, RLAIF, Constitutional AI, PRM và ORM." },
    },
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
    text: {
      title: { en: "1.5 Multi-Agent RL", vi: "1.5 Multi-Agent RL" },
      description: { en: "Cooperative and competitive agents, game theory, self-play, and multi-agent communication.", vi: "Agent hợp tác/cạnh tranh, game theory, self-play và multi-agent communication." },
    },
    lessonIds: [
      'cooperative-vs-competitive-agents',
      'game-theory-basics',
      'self-play-training',
      'multi-agent-communication',
    ],
  },
];

export const learningTableOfContents = {
  id: 'reinforcement-learning',
  text: {
    title: { en: "Reinforcement Learning", vi: "Reinforcement Learning" },
    description: { en: "Learn decision-making systems step by step: agents, environments, rewards, MDPs, value functions, Bellman updates, Q-tables, Q-Learning, SARSA, policy behavior, and the bridge toward RLHF.", vi: "Học hệ thống ra quyết định từng bước: agent, environment, reward, MDP, value function, Bellman update, Q-table, Q-Learning, SARSA, policy behavior và cầu nối đến RLHF." },
  },
  status: 'placeholder',
  chapters,
  sectionKinds: ['theory', 'code'],
  routeAliases: [
    { fromTrackId: 'tabular-control', toTrackId: 'rl-fundamentals' },
    { fromTrackId: 'policy-behavior', toTrackId: 'value-based-methods' },
    { fromLessonId: 'rl-mdp-basics', toTrackId: 'rl-fundamentals', toLessonId: 'markov-decision-processes' },
    { fromLessonId: 'rl-bellman', toTrackId: 'rl-fundamentals', toLessonId: 'value-function' },
    { fromLessonId: 'rl-q-learning', toTrackId: 'value-based-methods', toLessonId: 'q-learning' },
    { fromLessonId: 'rl-sarsa', toTrackId: 'value-based-methods', toLessonId: 'sarsa-on-policy-td' },
  ],
} satisfies LearningTableOfContents;

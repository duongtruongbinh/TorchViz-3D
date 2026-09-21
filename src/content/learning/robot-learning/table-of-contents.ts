import type { LearningTableOfContents } from '../../../core/learning/types.ts';

export const learningTableOfContents = {
  id: 'robot-learning',
  text: {
    title: { en: "Robot Learning", vi: "Robot Learning" },
    description: { en: "Prepare for embodied AI topics: perception-action loops, robot state, control basics, imitation learning, reinforcement learning for robotics, sim-to-real gaps, safety, and evaluation.", vi: "Chuẩn bị cho embodied AI: vòng lặp perception-action, trạng thái robot, control cơ bản, imitation learning, reinforcement learning cho robotics, khoảng cách sim-to-real, safety và evaluation." },
  },
  status: 'placeholder',
  sectionKinds: ['theory', 'code'],
  chapters: [{
    id: 'embodied-agents',
    text: {
      title: { en: "Embodied agents", vi: "Embodied agents" },
      description: { en: "Robot Learning content will be added later.", vi: "Nội dung Robot Learning sẽ được bổ sung sau." },
    },
    lessonIds: [
      'robot-state-action',
      {
        id: 'control-loop-basics',
        sections: [
          { kind: 'theory', refId: 'control-loop-basics' },
          { kind: 'calculation', refId: 'control-loop-basics-calculation' },
        ],
      },
      'imitation-learning',
      {
        id: 'sim-to-real',
        sections: [
          { kind: 'theory', refId: 'sim-to-real' },
          { kind: 'calculation', refId: 'sim-to-real-calculation' },
        ],
      },
    ],
  }],
  firstLessonStatus: 'locked',
} satisfies LearningTableOfContents;

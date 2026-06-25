import type { LearningDomainId, LearningLesson, LearningPracticeRef, LearningTrack } from '../../core/learning/types';
import {
  getLearningLessonText,
  getLearningPracticeText,
  getStrings,
  type Language,
} from '../../lib/localization';

type BasicText = {
  title: string;
  description: string;
};

export function getDomainText(language: Language, domainId: LearningDomainId): BasicText {
  const isVi = language === 'vi';
  const text: Record<LearningDomainId, BasicText> = {
    fundamentals: {
      title: isVi ? 'ML Foundations' : 'ML Foundations',
      description: isVi
        ? 'Nền tảng tensor shape, value flow và layer contracts.'
        : 'Tensor shape, value flow, and layer-contract fundamentals.',
    },
    cv: {
      title: 'Computer Vision',
      description: isVi
        ? 'CNN, convolution, pooling và classifier shape/value practice.'
        : 'CNN, convolution, pooling, and classifier shape/value practice.',
    },
    nlp: {
      title: 'NLP',
      description: isVi
        ? 'Attention, sequence, embedding shape và các bài sequence model.'
        : 'Attention, sequence, embedding shape, and sequence model practice.',
    },
    'reinforcement-learning': {
      title: 'Reinforcement Learning',
      description: isVi
        ? 'MDP, Bellman, Q-table, Q-Learning, SARSA và GridWorld practice.'
        : 'MDPs, Bellman values, Q-tables, Q-Learning, SARSA, and GridWorld practice.',
    },
    'robot-learning': {
      title: 'Robot Learning',
      description: isVi
        ? 'Giữ chỗ cho embodied agents, control và robotics practice.'
        : 'Reserved for embodied agents, control, and robotics practice.',
    },
  };

  return text[domainId];
}

export function getTrackText(language: Language, track: LearningTrack): BasicText {
  const isVi = language === 'vi';
  const text: Record<string, BasicText> = {
    'tensor-shape-fundamentals': {
      title: isVi ? 'Tensor shape fundamentals' : 'Tensor shape fundamentals',
      description: isVi ? 'Đọc và dự đoán shape qua các layer cơ bản.' : 'Read and predict shapes through core layers.',
    },
    'value-flow': {
      title: isVi ? 'Value flow' : 'Value flow',
      description: isVi ? 'Theo dõi giá trị qua Linear và activation.' : 'Follow values through Linear and activation operations.',
    },
    'cnn-shape-value': {
      title: isVi ? 'CNN shape and value' : 'CNN shape and value',
      description: isVi ? 'Convolution và pooling từ shape đến giá trị.' : 'Convolution and pooling from shape math to values.',
    },
    'attention-shapes': {
      title: isVi ? 'Attention shapes' : 'Attention shapes',
      description: isVi ? 'Batch, token và embedding dimensions trong attention.' : 'Batch, token, and embedding dimensions in attention.',
    },
    'tabular-control': {
      title: isVi ? 'Tabular Control' : 'Tabular Control',
      description: isVi
        ? 'MDP, Bellman và cập nhật Q từng transition.'
        : 'MDPs, Bellman values, and Q updates one transition at a time.',
    },
    'policy-behavior': {
      title: isVi ? 'Policy Behavior' : 'Policy Behavior',
      description: isVi
        ? 'So sánh off-policy Q-Learning với on-policy SARSA.'
        : 'Compare off-policy Q-Learning with on-policy SARSA.',
    },
    'embodied-agents': {
      title: isVi ? 'Embodied agents' : 'Embodied agents',
      description: isVi ? 'Nội dung Robot Learning sẽ được bổ sung sau.' : 'Robot Learning content will be added later.',
    },
  };

  return text[track.id] ?? { title: track.id, description: '' };
}

export function getUnifiedLessonText(language: Language, lesson: LearningLesson) {
  const strings = getStrings(language);
  if (lesson.domainId === 'reinforcement-learning') {
    const lessons = strings.reinforcementLearning.lessons as Record<string, LessonText>;
    return lessons[toContentKey(lesson.id)] ?? { title: lesson.id, eyebrow: '', duration: '', theory: [] };
  }
  return getLearningLessonText(strings.learningLab, lesson);
}

export function getUnifiedPracticeText(language: Language, practice: LearningPracticeRef) {
  const strings = getStrings(language);
  if (practice.family === 'reinforcement-learning') {
    const practiceItems = strings.reinforcementLearning.practiceItems as Record<string, PracticeText>;
    return practiceItems[toContentKey(practice.id)] ?? { title: practice.id };
  }
  if (practice.family === 'tensor') {
    return getLearningPracticeText(strings.learningLab, practice);
  }
  return { title: practice.id };
}

type LessonText = {
  title: string;
  eyebrow: string;
  duration: string;
  theory: string[];
};

type PracticeText = {
  title: string;
};

function toContentKey(id: string): string {
  return id.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

import type { LearningTableOfContents } from '../../../core/learning/types.ts';

export const learningTableOfContents = {
  id: 'cv',
  text: {
    title: { en: "Computer Vision", vi: "Computer Vision" },
    description: { en: "Follow image tensors through vision models: NCHW shape, kernels, stride, padding, convolution values, pooling effects, flattening, classifier heads, transfer learning, and visual feature reasoning.", vi: "Theo dấu tensor ảnh qua model vision: shape NCHW, kernel, stride, padding, giá trị convolution, hiệu ứng pooling, flatten, classifier head, transfer learning và suy luận feature thị giác." },
  },
  status: 'partial',
  fallbackLocales: ['vi'],
  sectionKinds: ['theory', 'code'],
  chapters: [
    {
      id: 'cv-introduction',
      text: {
        title: { en: "Computer Vision Foundations & History", vi: "Nền tảng & Lịch sử Computer Vision" },
        description: {
          en: "Visual intelligence foundations, two historical threads, their review quizzes, dual-use impact, and future directions.",
          vi: "Nền tảng trí thông minh thị giác, hai luồng lịch sử kèm quiz, tác động dual-use và các hướng phát triển tương lai.",
        },
      },
      lessonIds: [
        {
          id: 'computer-vision-intro',
          title: { en: 'Introduction to Computer Vision', vi: 'Giới thiệu về Computer Vision' },
          status: 'available',
          contentStatus: 'published',
        },
        {
          id: 'computer-vision-intro-quiz',
          title: { en: 'Quiz', vi: 'Quiz' },
          status: 'available',
          contentStatus: 'published',
        },
        {
          id: 'classical-computer-vision-timeline',
          title: { en: 'Thread 1: Classical Computer Vision', vi: 'Thread 1: Classical Computer Vision' },
          status: 'available',
          contentStatus: 'published',
        },
        {
          id: 'classical-computer-vision-timeline-quiz',
          title: { en: 'Quiz', vi: 'Quiz' },
          status: 'available',
          contentStatus: 'published',
        },
        {
          id: 'deep-learning-computer-vision-timeline',
          title: { en: 'Thread 2: Neural Networks & Deep Learning', vi: 'Thread 2: Neural Networks & Deep Learning' },
          status: 'available',
          contentStatus: 'published',
        },
        {
          id: 'deep-learning-computer-vision-timeline-quiz',
          title: { en: 'Quiz', vi: 'Quiz' },
          status: 'available',
          contentStatus: 'published',
        },
        {
          id: 'computer-vision-dual-use',
          title: { en: 'Computer Vision: Benefits, Risks & Responsibility', vi: 'Computer Vision: Lợi ích, Rủi ro & Trách nhiệm' },
          status: 'available',
          contentStatus: 'published',
        },
        {
          id: 'computer-vision-future-and-learning-path',
          title: { en: 'The Future of Computer Vision & Learning Path', vi: 'Tương lai Computer Vision & Lộ trình Học tập' },
          status: 'available',
          contentStatus: 'published',
        },
      ],
    },
    {
      id: 'cnn-shape-value',
    text: {
      title: { en: "Deep Learning Basics", vi: "Nền tảng Deep Learning" },
      description: { en: "Start with image classification and a linear baseline, then learn convolution and pooling from shapes to values.", vi: "Bắt đầu từ Image Classification và baseline tuyến tính, sau đó học convolution và pooling từ shape đến giá trị." },
    },
    lessonIds: [
      {
        id: 'image-classification-linear-classifier',
        title: { en: 'Image Classification with a Linear Classifier', vi: 'Image Classification với Linear Classifier' },
        status: 'available',
        contentStatus: 'published',
      },
      {
        id: 'image-classification-linear-classifier-quiz',
        title: { en: 'Quiz', vi: 'Quiz' },
        status: 'available',
        contentStatus: 'published',
      },
      'conv2d-output',
      {
        id: 'conv2d-shape-exercise',
        title: { en: 'Conv2d Output Shape Exercise', vi: 'Bài tập output shape Conv2d' },
        status: 'available',
        contentStatus: 'published',
        tags: ['exercise'],
        entryPoints: [{ kind: 'torchviz-exercise', exerciseId: 'shape-output', operationFamily: 'conv2d' }],
      },
      {
        id: 'conv2d-value-exercise',
        title: { en: 'Conv2d Value Exercise', vi: 'Bài tập giá trị Conv2d' },
        status: 'available',
        contentStatus: 'published',
        tags: ['exercise'],
        entryPoints: [{ kind: 'torchviz-exercise', exerciseId: 'conv-value', operationFamily: 'conv2d' }],
      },
      {
        id: 'pooling-output',
        status: 'available',
      },
      {
        id: 'pooling-shape-exercise',
        title: { en: 'Pooling Output Shape Exercise', vi: 'Bài tập output shape Pooling' },
        status: 'available',
        contentStatus: 'published',
        tags: ['exercise'],
        entryPoints: [{ kind: 'torchviz-exercise', exerciseId: 'shape-output', operationFamily: 'pool2d' }],
      },
      {
        id: 'pooling-value-exercise',
        title: { en: 'Pooling Value Exercise', vi: 'Bài tập giá trị Pooling' },
        status: 'available',
        contentStatus: 'published',
        tags: ['exercise'],
        entryPoints: [{ kind: 'torchviz-exercise', exerciseId: 'pool-value', operationFamily: 'pool2d' }],
      },
      'cnn-classifier-head',
      {
        id: 'batchnorm-dropout',
        sections: [
          { kind: 'theory', refId: 'batchnorm-dropout' },
          { kind: 'calculation', refId: 'batchnorm-dropout-calculation' },
        ],
      },
      'vision-augmentation',
    ],
  }],
} satisfies LearningTableOfContents;

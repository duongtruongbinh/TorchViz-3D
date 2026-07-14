import type { LearningTableOfContents } from '../../../core/learning/types.ts';

export const learningTableOfContents = {
  id: 'cv',
  text: {
    title: { en: "Computer Vision", vi: "Computer Vision" },
    description: { en: "Follow image tensors through vision models: NCHW shape, kernels, stride, padding, convolution values, pooling effects, flattening, classifier heads, transfer learning, and visual feature reasoning.", vi: "Theo dấu tensor ảnh qua model vision: shape NCHW, kernel, stride, padding, giá trị convolution, hiệu ứng pooling, flatten, classifier head, transfer learning và suy luận feature thị giác." },
  },
  status: 'active',
  fallbackLocales: ['vi'],
  sectionKinds: ['theory', 'code'],
  chapters: [{
    id: 'cnn-shape-value',
    text: {
      title: { en: "CNN shape and value", vi: "CNN shape and value" },
      description: { en: "Convolution and pooling from shape math to values.", vi: "Convolution và pooling từ shape đến giá trị." },
    },
    lessonIds: [
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

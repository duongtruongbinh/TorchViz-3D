import type { LayoutNode } from './irTypes';

type ExerciseLanguage = 'en' | 'vi';

export type ValueExerciseId = 'pool-value' | 'linear-value' | 'activation-value';

export type ValueExerciseDisplaySection = {
  title: string;
  rows: string[];
};

export type ValueExerciseModel = {
  id: ValueExerciseId;
  seed: string;
  title: string;
  subtitle: string;
  prompt: string;
  configRows: string[];
  displaySections: ValueExerciseDisplaySection[];
  answerLabels: string[];
  expectedAnswers: number[];
  hintLines: string[];
};

export function buildValueExerciseModel(
  id: ValueExerciseId,
  node: LayoutNode,
  language: ExerciseLanguage = 'en',
): ValueExerciseModel | null {
  if (id === 'pool-value') return buildPoolExercise(node, language);
  if (id === 'linear-value') return buildLinearExercise(node, language);
  if (id === 'activation-value') return buildActivationExercise(node, language);
  return null;
}

export function checkNumericAnswers(
  answers: string[],
  expectedAnswers: number[],
  tolerance = 0.01,
): boolean[] {
  return expectedAnswers.map((expected, index) => {
    if ((answers[index] ?? '').trim() === '') return false;
    const parsed = Number(answers[index]);
    return Number.isFinite(parsed) && Math.abs(parsed - expected) <= tolerance;
  });
}

function buildPoolExercise(node: LayoutNode, language: ExerciseLanguage): ValueExerciseModel | null {
  if (/adaptiveavgpool/i.test(node.op_type)) return null;

  if (/maxpool(?:2d)?/i.test(node.op_type)) {
    const window = [
      [1, 5],
      [2, 3],
    ];
    return {
      id: 'pool-value',
      seed: 'pool-value:max',
      title: language === 'vi' ? 'Bài tập giá trị Pooling' : 'Pooling value',
      subtitle: 'MaxPool',
      prompt: language === 'vi'
        ? 'Chọn giá trị lớn nhất trong cửa sổ 2x2 này.'
        : 'Choose the max value in this 2x2 window.',
      configRows: ['kernel=2', 'stride=2', 'mode=max'],
      displaySections: [{ title: language === 'vi' ? 'Cửa sổ' : 'Window', rows: formatMatrix(window) }],
      answerLabels: ['max'],
      expectedAnswers: [5],
      hintLines: language === 'vi'
        ? ['So sánh các giá trị: 1, 5, 2, 3.', 'Giá trị lớn nhất là 5.']
        : ['Compare all values: 1, 5, 2, 3.', 'The largest value is 5.'],
    };
  }

  if (/avgpool(?:2d)?/i.test(node.op_type)) {
    const window = [
      [2, 4],
      [6, 8],
    ];
    return {
      id: 'pool-value',
      seed: 'pool-value:avg',
      title: language === 'vi' ? 'Bài tập giá trị Pooling' : 'Pooling value',
      subtitle: 'AvgPool',
      prompt: language === 'vi'
        ? 'Tính giá trị trung bình trong cửa sổ 2x2 này.'
        : 'Compute the average value in this 2x2 window.',
      configRows: ['kernel=2', 'stride=2', 'mode=average'],
      displaySections: [{ title: language === 'vi' ? 'Cửa sổ' : 'Window', rows: formatMatrix(window) }],
      answerLabels: ['avg'],
      expectedAnswers: [5],
      hintLines: language === 'vi'
        ? ['Cộng các ô: 2 + 4 + 6 + 8 = 20.', 'Chia cho 4 ô: 20 / 4 = 5.']
        : ['Sum the window: 2 + 4 + 6 + 8 = 20.', 'Divide by 4 cells: 20 / 4 = 5.'],
    };
  }

  return null;
}

function buildLinearExercise(node: LayoutNode, language: ExerciseLanguage): ValueExerciseModel | null {
  if (!/linear/i.test(node.op_type)) return null;

  const input = [2, -1, 0.5];
  const weights = [0.25, -2, 4];
  const bias = -0.5;
  const output = dot(input, weights) + bias;

  return {
    id: 'linear-value',
    seed: 'linear-value:dot',
    title: language === 'vi' ? 'Bài tập giá trị Linear' : 'Linear value',
    subtitle: language === 'vi' ? 'Một neuron đầu ra' : 'One output neuron',
    prompt: language === 'vi'
      ? 'Tính y = input · weight + bias.'
      : 'Compute y = input · weight + bias.',
    configRows: ['in_features=3', 'out_neuron=1'],
    displaySections: [
      { title: 'Input', rows: [formatVector(input)] },
      { title: 'Weight', rows: [formatVector(weights)] },
      { title: 'Bias', rows: [String(bias)] },
    ],
    answerLabels: ['y'],
    expectedAnswers: [output],
    hintLines: language === 'vi'
      ? [
        'Tích vô hướng: 2*0.25 + (-1)*(-2) + 0.5*4 = 4.5.',
        'Cộng bias: 4.5 + (-0.5) = 4.',
      ]
      : [
        'Dot product: 2*0.25 + (-1)*(-2) + 0.5*4 = 4.5.',
        'Add bias: 4.5 + (-0.5) = 4.',
      ],
  };
}

function buildActivationExercise(node: LayoutNode, language: ExerciseLanguage): ValueExerciseModel | null {
  if (node.op_type.toLowerCase() !== 'relu') return null;

  const input = [-2, 0, 3, -0.5, 1];
  const output = input.map((value) => Math.max(0, value));

  return {
    id: 'activation-value',
    seed: 'activation-value:relu',
    title: language === 'vi' ? 'Bài tập giá trị Activation' : 'Activation value',
    subtitle: 'ReLU',
    prompt: language === 'vi'
      ? 'Áp dụng ReLU cho từng phần tử của vector.'
      : 'Apply ReLU to each vector element.',
    configRows: ['rule=max(0, x)'],
    displaySections: [{ title: 'Input', rows: [formatVector(input)] }],
    answerLabels: output.map((_, index) => `y${index}`),
    expectedAnswers: output,
    hintLines: language === 'vi'
      ? [
        'ReLU giữ nguyên giá trị dương.',
        'ReLU đổi giá trị âm thành 0.',
        `Output: ${formatVector(output)}.`,
      ]
      : [
        'ReLU keeps positive values unchanged.',
        'ReLU changes negative values to 0.',
        `Output: ${formatVector(output)}.`,
      ],
  };
}

function dot(left: number[], right: number[]): number {
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

function formatMatrix(matrix: number[][]): string[] {
  return matrix.map((row) => formatVector(row));
}

function formatVector(values: number[]): string {
  return `[${values.join(', ')}]`;
}

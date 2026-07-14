import type { LearningLocalizedText } from '../../core/learning/types.ts';

type LearningAssetId = string;

export type LearningTokenExample = {
  title: LearningLocalizedText;
  variants: Array<{
    label: LearningLocalizedText;
    tokens: string[];
    description: LearningLocalizedText;
  }>;
  specialCases: Array<{
    label: LearningLocalizedText;
    tokens: string[];
    description: LearningLocalizedText;
  }>;
  notes: LearningLocalizedText[];
};

export type LearningLessonExtra =
  | {
      kind: 'motivation';
      id: string;
      sectionRefId?: string;
      title: LearningLocalizedText;
      image: LearningAssetId;
      imageAlt: LearningLocalizedText;
      body: LearningLocalizedText[];
      hierarchy?: {
        ariaLabel: LearningLocalizedText;
        rows: Array<{
          shortName: string;
          fullName: string;
          description: LearningLocalizedText;
          depth: 'widest' | 'middle' | 'branch' | 'target';
          compact?: boolean;
        }>;
        branchLabel?: LearningLocalizedText;
      };
    }
  | {
      kind: 'conceptInteraction';
      id: string;
      sectionRefId?: string;
      title: LearningLocalizedText;
      body: LearningLocalizedText[];
      note?: LearningLocalizedText;
      image: LearningAssetId;
      imageAlt: LearningLocalizedText;
      prompt: LearningLocalizedText;
      blankLabel: LearningLocalizedText;
      labels: {
        chooseNextToken: LearningLocalizedText;
        emptySentence: LearningLocalizedText;
        removeLastWord: LearningLocalizedText;
        reset: LearningLocalizedText;
      };
      options: Array<{
        label: LearningLocalizedText;
        isCorrect?: boolean;
        feedback: LearningLocalizedText;
      }>;
      interactionPlacement?: 'inline' | 'none' | 'only';
      sentenceBuilder?: {
        title: LearningLocalizedText;
        prompt: LearningLocalizedText;
        targets: LearningLocalizedText[][];
        choices: LearningLocalizedText[];
        success: LearningLocalizedText;
        error: LearningLocalizedText;
      };
    }
  | {
      kind: 'conceptPanel';
      id: string;
      sectionRefId?: string;
      title: LearningLocalizedText;
      emphasis?: LearningLocalizedText;
      body?: LearningLocalizedText[];
      bodyAfter?: LearningLocalizedText[];
      highlights?: Array<{
        shortName: LearningLocalizedText;
        fullName: LearningLocalizedText;
        description: LearningLocalizedText;
        links?: Array<{
          label: LearningLocalizedText;
          href: string;
        }>;
      }>;
      comparisonTable?: {
        columns: LearningLocalizedText[];
        rows: Array<{
          label: LearningLocalizedText;
          cells: LearningLocalizedText[];
        }>;
      };
      outline?: Array<{
        title: LearningLocalizedText;
        body: LearningLocalizedText;
        items: Array<{
          title: LearningLocalizedText;
          body: LearningLocalizedText;
        }>;
      }>;
      links?: Array<{
        label: LearningLocalizedText;
        href: string;
      }>;
      tokenExample?: LearningTokenExample;
    }
  | {
      kind: 'quiz';
      id: string;
      sectionRefId?: string;
      title: LearningLocalizedText;
      questions: Array<{
        id: string;
        title: LearningLocalizedText;
        prompt: LearningLocalizedText;
        mode: 'order' | 'single' | 'multi' | 'categorize';
        hideUnsortedLabel?: boolean;
        unsortedLabel?: LearningLocalizedText;
        completeLabel?: LearningLocalizedText;
        options: Array<{
          id: string;
          label: LearningLocalizedText;
          isCorrect?: boolean;
          categoryId?: string;
        }>;
        categories?: Array<{
          id: string;
          label: LearningLocalizedText;
        }>;
        correctOrder?: string[];
        success: LearningLocalizedText;
        error: LearningLocalizedText;
      }>;
    };

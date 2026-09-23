import { llmUnlearningLessonPairs } from './table-of-contents.ts';
import {
  llmUnlearningPapers as generatedPapers,
  type LlmUnlearningPaper,
} from './papers.generated.ts';

export type LlmUnlearningClaimPaperEvidence = {
  paperId: string;
  role: 'primary-example' | 'additional-evidence';
  exposure: 'inline' | 'reference-page';
  reason?: string;
};

export type LlmUnlearningLessonReferenceCoverage = {
  lessonId: string;
  claims: readonly {
    id: string;
    summary: string;
    surveyLocator: string;
    papers: readonly LlmUnlearningClaimPaperEvidence[];
  }[];
  courseAnalysis?: string;
};

const surveyPaper: LlmUnlearningPaper = {
  id: 'qiu2025survey',
  title: 'A Survey on Unlearning in Large Language Models',
  authors: ['Ruichen Qiu', 'Jiajun Tan', 'Jiayue Pu', 'Xiaoyu Ji', 'Peian Yang', 'Artur Hecker', 'Kui Ren'],
  year: 2025,
  venue: 'arXiv',
  arxivId: '2510.25117',
  url: 'https://arxiv.org/abs/2510.25117v2',
  kind: 'misc',
};

export const llmUnlearningPapers: readonly LlmUnlearningPaper[] = [surveyPaper, ...generatedPapers];
export const llmUnlearningPaperById = new Map(llmUnlearningPapers.map((paper) => [paper.id, paper]));

const surveyLocatorByTrack: Record<string, string> = {
  'llm-unlearning-fundamentals': '§1–§2.2',
  'non-llm-unlearning-foundations': '§2.1 và §3.1',
  'tofu-benchmark-dataset-design': '§4.1 và Table 3',
  'core-unlearning-baselines': '§3.1–§3.3',
  'unlearning-evaluation-metrics': '§4.1–§4.2',
  'mechanistic-frontiers-challenges': '§5.1–§5.2',
};

const primaryReferencesByLesson: Partial<Record<string, readonly string[]>> = {
  'sisa-architecture-sharding': ['Bourtoule2021Machine'],
  'whos-harry-potter-case-study': ['Liu2024Revisiting'],
  'fictitious-unlearning-need': ['Maini2024TOFU'],
  'tofu-split-mechanisms': ['Maini2024TOFU'],
  'gold-retrained-model-benchmark': ['Maini2024TOFU'],
  'unlearning-dataset-design-axes': ['Maini2024TOFU', 'Shi2024MUSE'],
  'unlearning-benchmark-landscape': ['Maini2024TOFU', 'Shi2024MUSE', 'Li2024WMDP', 'Jin2024RWKU'],
  'gradient-ascent-collapse': ['Feng2024Finegrained', 'Zhang2024Negative'],
  'gradient-difference-balance': ['Bu2024Unlearning'],
  'kl-minimization-mode-seeking': ['Wang2025Balancing'],
  'dpo-unlearning-preference': ['Mekala2024Alternate', 'Zhang2024Negative'],
  'rl-and-parameter-localization': ['Guo2024Robust', 'guo2024mechanistic'],
  'inference-time-unlearning': ['Pawelczyk2024Context', 'Ji2024Reversing'],
  'tripartite-evaluation-metrics': ['Maini2024TOFU'],
  'knowledge-memorization-metrics': ['Maini2024TOFU', 'Shi2024MUSE'],
  'utility-robustness-efficiency-metrics': ['Shi2024MUSE'],
  'relearning-jailbreak-vulnerabilities': ['fan2025towards'],
  'definition-effects-and-scaling-challenges': ['choi2024cross', 'zhang2025catastrophic'],
  'robust-verifiable-and-beyond-data-unlearning': ['Guo2024Robust', 'guo2024mechanistic'],
  'llm-lifecycle-management-future': ['zhang2025catastrophic'],
};

export const llmUnlearningLessonReferenceCoverage = llmUnlearningLessonPairs.map((lesson) => {
  const surveyLocator = surveyLocatorByTrack[lesson.trackId] ?? '§1–§5';
  const primaryReferences = primaryReferencesByLesson[lesson.theoryId] ?? [];
  return {
    lessonId: lesson.theoryId,
    claims: [{
      id: `${lesson.theoryId}-survey-claim`,
      summary: `The lesson synthesizes the survey evidence relevant to ${lesson.title.en}.`,
      surveyLocator,
      papers: [
        { paperId: 'qiu2025survey', role: 'additional-evidence', exposure: 'inline' },
        ...primaryReferences.map((paperId) => ({
          paperId,
          role: 'primary-example' as const,
          exposure: 'reference-page' as const,
          reason: `Primary work listed by the survey for ${lesson.title.en}.`,
        })),
      ],
    }],
    courseAnalysis: 'Nội dung diễn giải và cấu trúc sư phạm do khóa học tổng hợp; trang tham khảo phân biệt bài survey với các công trình gốc tiêu biểu.',
  } satisfies LlmUnlearningLessonReferenceCoverage;
});

export const llmUnlearningLessonReferenceCoverageById = new Map(
  llmUnlearningLessonReferenceCoverage.map((item) => [item.lessonId, item]),
);

export function getLlmUnlearningLessonFeaturedReferenceIds(lessonId: string): string[] {
  const coverage = llmUnlearningLessonReferenceCoverageById.get(lessonId);
  if (!coverage) return [];
  return [...new Set(coverage.claims.flatMap((claim) => claim.papers)
    .filter((item) => item.exposure !== 'reference-page')
    .map((item) => item.paperId))].sort();
}

export function getLlmUnlearningLessonPapers(lessonId: string): LlmUnlearningPaper[] {
  const coverage = llmUnlearningLessonReferenceCoverageById.get(lessonId);
  if (!coverage) return [];
  const ids = new Set(coverage.claims.flatMap((claim) => claim.papers).map((item) => item.paperId));
  return [...ids].sort().flatMap((paperId) => {
    const paper = llmUnlearningPaperById.get(paperId);
    return paper ? [paper] : [];
  });
}

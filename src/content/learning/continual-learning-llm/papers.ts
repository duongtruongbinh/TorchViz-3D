import {
  continualLearningPaperById as generatedPaperById,
  continualLearningPapers as generatedPapers,
  surveyDirectReferenceIdsBySection,
  surveyReferenceIdsBySection,
  type ContinualLearningPaper,
} from './papers.generated.ts';

export type SurveyEvidenceRole = 'primary-example' | 'additional-evidence' | 'alternative-approach' | 'qualifying-evidence';
export type EvidenceExposure = 'inline' | 'paper-summary' | 'reference-page';

export type ContinualLearningClaimPaperEvidence = {
  paperId: string;
  role: SurveyEvidenceRole;
  exposure: EvidenceExposure;
  reason?: string;
};

export type ContinualLearningClaimReferenceCoverage = {
  id: string;
  summary: string;
  surveyLocator?: string;
  surveySections?: readonly string[];
  includeDescendants?: boolean;
  includeSurveySectionEvidence?: boolean;
  papers: readonly ContinualLearningClaimPaperEvidence[];
  courseAnalysis?: string;
};

export type ContinualLearningLessonReferenceCoverage = {
  lessonId: string;
  claims: readonly ContinualLearningClaimReferenceCoverage[];
  courseAnalysis?: string;
};

const additionalPapers = [
  {
    id: 'shi2024continualSurvey',
    title: 'Continual Learning of Large Language Models: A Comprehensive Survey',
    authors: ['Haizhou Shi', 'Zihao Xu', 'Hengyi Wang', 'Weiyi Qin', 'Wenyuan Wang', 'Yibin Wang', 'Zifeng Wang', 'Sayna Ebrahimi', 'Hao Wang'],
    year: 2024,
    venue: 'arXiv',
    arxivId: '2404.16789',
    url: 'https://arxiv.org/abs/2404.16789',
    kind: 'misc',
  },
  {
    id: 'zenke2017continual',
    title: 'Continual Learning Through Synaptic Intelligence',
    authors: ['Friedemann Zenke', 'Ben Poole', 'Surya Ganguli'],
    year: 2017,
    venue: 'Proceedings of the 34th International Conference on Machine Learning',
    url: 'https://proceedings.mlr.press/v70/zenke17a.html',
    kind: 'inproceedings',
  },
  {
    id: 'zheng2025spurious',
    title: 'Spurious Forgetting in Continual Learning of Language Models',
    authors: ['Junhao Zheng', 'Xidi Cai', 'Shengjie Qiu', 'Qianli Ma'],
    year: 2025,
    venue: 'arXiv',
    arxivId: '2501.13453',
    url: 'https://arxiv.org/abs/2501.13453',
    kind: 'misc',
  },
] as const satisfies readonly ContinualLearningPaper[];

export const continualLearningPapers: readonly ContinualLearningPaper[] = [...generatedPapers, ...additionalPapers];
export const continualLearningPaperById: ReadonlyMap<string, ContinualLearningPaper> = new Map(
  continualLearningPapers.map((paper) => [paper.id, paper]),
);

export const continualLearningLessonReferenceCoverage = [
  coverage('continual-learning-llm-overview', [
    claim('static-model-and-update-motivation', 'Static checkpoints motivate continual updates; RAG and model adaptation solve different needs.', '§1, §4.2 và §4.3.4', primary(['thulke2024climategpt'])),
    claim('sequential-learning-interference', 'Sequential learning can interfere with previously learned behavior.', '§2.2', primary(['mccloskey1989catastrophic'])),
  ]),
  coverage('stability-plasticity-dilemma', [claim('stability-plasticity-tradeoff', 'Continual learning must balance retention and acquisition.', '§2.2', primary(['wang2024comprehensive']))]),
  coverage('catastrophic-forgetting-in-llms', [claim('catastrophic-forgetting-foundation', 'Learning a new stage can damage performance on earlier knowledge or tasks.', '§1–§2.2', primary(['mccloskey1989catastrophic']))]),
  coverage('catastrophic-forgetting-code-lab', [claim('lab-forgetting-interpretation', 'The lab demonstrates measured forgetting but does not prove that knowledge is permanently erased.', undefined, primary(['zheng2025spurious']))], 'Thí nghiệm và diễn giải trong lab do khóa học xây dựng; paper được dùng để đối chiếu hiện tượng spurious forgetting.'),
  coverage('cl-settings-til-dil-cil', [claim('til-dil-cil-settings', 'TIL, DIL, and CIL differ in what changes and whether a task signal is available.', '§2.2.1', primary(['van2022three', 'kim2022theoretical']))]),
  coverage('vertical-horizontal-continuity', [claim('vertical-horizontal-framework', 'Continual LLM updates can be organized along vertical and horizontal continuity.', '§3', primary(['qin2023recyclable']))]),
  coverage('cl-methods-taxonomy-and-replay', [claim('cl-method-taxonomy', 'Replay, regularization, architecture, and optimization/representation methods address different constraints.', '§2.2.2', primary(['wang2024comprehensive', 'shi2024unified']), ['S2.SS2.SSS2'])]),
  coverage('replay-introduction', [claim('replay-generalization-limit', 'Small replay buffers approximate rather than reproduce full historical retraining.', '§2.2.2', primary(['shi2024unified']))]),
  coverage('replay-experience-code-lab', [claim('replay-lab-boundary', 'Replay reduces forgetting in the course fixture; broader conclusions require external evidence.', undefined, [
    ...summarized(['zheng2025spurious']),
    ...further(['shi2024unified'], 'The paper supplies theoretical context for replay but is not the source of the course fixture output.'),
  ])], 'Kết quả chạy mẫu thuộc fixture của khóa học; paper được dùng để kiểm tra phạm vi diễn giải.'),
  coverage('parameter-regularization-ewc', [claim('parameter-regularization', 'Parameter-importance penalties trade plasticity for retention.', '§2.2.2', [
    ...summarized(['kirkpatrick2017overcoming']),
    ...primary(['zenke2017continual']),
  ])]),
  coverage('architecture-expansion-isolation', [claim('architecture-expansion', 'Dedicated or expanded capacity can reduce parameter interference while adding routing costs.', '§2.2.2', primary(['wistuba2023']))]),
  coverage('supplier-consumer-pipeline', [claim('supplier-consumer', 'Supplier and consumer stages have different access, compute, and adaptation constraints.', '§3', primary(['qin2023recyclable']))]),
  coverage('vertical-cl-deep-dive', [claim('vertical-specialization-pipeline', 'Vertical continuity moves a checkpoint from general pre-training toward domain and task specialization.', '§3.1', primary(['qin2023recyclable']))]),
  coverage('vertical-forgetting', [claim('vertical-forgetting', 'Downstream specialization can reduce upstream general abilities.', '§3.1', primary(['wistuba2023']))]),
  coverage('horizontal-cl-deep-dive', [claim('horizontal-adaptation', 'Horizontal continuity updates comparable stages over time or across domains.', '§3.2', summarized(['jin2022lifelong']))]),
  coverage('horizontal-forgetting', [claim('horizontal-forgetting', 'Forgetting can accumulate over long stage sequences and abrupt distribution shifts.', '§3.2', primary(['jin2022lifelong']))]),
  coverage('continuity-to-learning-stages', [claim('chapter-four-continuity-map', 'The course maps vertical stages to horizontal update sequences.', '§3–§4', primary(['shi2024unified']))]),
  coverage('continual-pretraining-pipeline', [claim('cpt-pipeline', 'CPT shifts the practical bottleneck from storage alone toward data and compute efficiency.', '§3.2 và §4.1', [])]),
  coverage('cpt-effectiveness-efficiency', [claim('cpt-effectiveness-efficiency', 'CPT methods improve update effectiveness or reduce data and compute cost.', '§4.1.1', primary(['qin2022elle', 'amba2021dynamic', 'xie2023efficient']), ['S4.SS1.SSS1'])]),
  coverage('cpt-observations', [claim('cpt-study-observations', 'Current CPT experiments remain short relative to production update sequences.', '§4.1.2', primary(['yildiz2024investigating']), ['S4.SS1.SSS2'])]),
  coverage('cpt-distribution-shifts', [claim('cpt-distribution-shifts', 'Language, content, and temporal shifts require different CPT strategies.', '§4.1.3', primary(['li2024examining', 'yildiz2024investigating', 'gupta2023continual', 'ibrahim2024simple', 'jin2022lifelong', 'qin2023recyclable', 'gururangan2022demix', 'chen2023lifelong', 'cossu2022continual', 'jang2022towards', 'jang2022temporalwiki', 'dhingra2022time']))]),
  coverage('cpt-other-directions', [claim('cpt-other-directions', 'Data selection, dynamic updates, and sustainability broaden the CPT design space.', '§4.1.3', primary(['zhao2024large', 'lin2024rho', 'chen2024take', 'amba2021dynamic', 'loureiro2022timelms', 'attanasio2023worth']))]),
  coverage('domain-adaptive-pretraining', [claim('dap-pipeline', 'Domain-adaptive pre-training specializes a general checkpoint while risking vertical forgetting.', '§4.2', primary(['gururangan2020dont']), ['S4.SS2'])]),
  coverage('dap-observations', [claim('dap-survey-observations', 'Survey-table counts show that DAP work often addresses forgetting without naming it as CL.', '§4.2.1', [], ['S4.SS2.SSS1'])]),
  coverage('dap-domain-landscape', [claim('dap-domain-landscape', 'Legal, medical, financial, scientific, code, and other DAP studies use different data and retention strategies.', '§4.2.2, Table 2', primary(['huang2023lawyer', 'colombo2024saullm7b', 'guo2023continuous', 'xie2024me', 'Chen2023HuatuoGPTII', 'yan2023af', 'Lu2023BBTFin', 'li2023cfgpt', 'takahashi2024pretraining', 'xie2023efficient', 'Zhang2023xuanyuan', 'Bi2023OCEANGPT', 'deng2023learning', 'Nguyen2023AstroLLaMA', 'Zheng2023MarineGPT', 'thulke2024climategpt', 'lin2023geogalactica', 'Azerbayev2023LLEMMA', 'Yang2023PLLaMa', 'rozière2024code', 'paul2024ircoder', 'wu2024llama', 'han2021econet', 'zhou2020pre', 'cheng2024adapting', 'shen2024tag', 'nakamura2024aurora', 'fujii2024continual', 'dou2024sailor']), ['S4.SS2.SSS2'])]),
  coverage('continual-finetuning-overview', [claim('cft-overview', 'CFT spans task/domain settings and method families across downstream update stages.', '§4.3–§4.3.2, Table 3', primary(['zhao2024sapt', 'das2024larimar', 'lin2024mitigating', 'mehta2023empirical', 'zheng2023learn', 'winata2023overcoming', 'ke2021achieve', 'qin2021lfpt5', 'chen2024parameterizing']), ['S4.SS3', 'S4.SS3.SSS1', 'S4.SS3.SSS2'])]),
  coverage('continual-instruction-tuning', [claim('continual-instruction-tuning', 'Continual instruction tuning balances new instruction following with retention and routing.', '§4.3.3', primary(['scialom2022fine', 'he2024dont', 'huang2024mitigating', 'mok2023large', 'yin2022contintin', 'wang2023orthogonal', 'zhao2024sapt']), ['S4.SS3.SSS3'])]),
  coverage('continual-model-refinement', [claim('continual-model-refinement', 'Model refinement methods edit or retrieve targeted knowledge while limiting collateral changes.', '§4.3.4', primary(['hartvigsen2023aging', 'yu2023melo', 'das2024larimar', 'hu2024wilke', 'wang2024wise', 'hase2023does']), ['S4.SS3.SSS4'])]),
  coverage('continual-model-alignment', [claim('continual-model-alignment', 'Sequential alignment updates can trade new preference learning against prior alignment.', '§4.3.5', primary(['lin2024mitigating', 'zhangcppo', 'zhang2023copf']), ['S4.SS3.SSS5'])]),
  coverage('continual-multimodal-llms', [claim('continual-multimodal-learning', 'Multimodal continual learning must retain cross-modal capabilities while adding tasks or concepts.', '§4.3.6', primary(['zhai2023investigating', 'zheng2024antiforgetting', 'he2023continual', 'zhu2024model', 'zhao2024reconstruct', 'chen2024coin']), ['S4.SS3.SSS6'])]),
  coverage('core-cl-metrics', [claim('core-cl-metrics', 'OP, F, BWT, and FWT measure complementary aspects of continual performance.', '§2.2.3 và Appendix B.1', [], ['S2.SS2.SSS3'])]),
  coverage('lama-knowledge-evaluation', [claim('knowledge-and-capability-evaluation', 'LAMA/CKL and TRACE separate knowledge updates, forgetting, and general capability changes.', '§5', primary(['petroni2019language', 'jang2022towards', 'wang2023trace']), ['S5'])]),
  coverage('continual-learning-benchmarks', [claim('continual-benchmark-map', 'Benchmarks should be selected by application, shift, and update protocol.', '§5', [], ['S5'])]),
  coverage('anticipatory-recovering', [claim('anticipatory-recovery', 'Training structure can make later recovery from interference easier.', '§6.1', primary(['yang2024reawakening']), ['S6.SS1'])]),
  coverage('til-dil-cil-new-roles', [claim('incremental-settings-for-llms', 'Instructions, vocabulary expansion, and routing change how TIL/DIL/CIL appear in LLMs.', '§6.2', [], ['S6.SS2'])]),
  coverage('memory-bottlenecks', [claim('memory-access-bottlenecks', 'Storage, compute, upstream access, and privacy create distinct replay constraints.', '§6.3', [], ['S6.SS3'])]),
  coverage('continual-llm-research-frontiers', [claim('research-frontiers', 'Theory, prediction, explicit memory, and Bayesian updates remain open directions.', '§6.4', primary(['wang2024comprehensive', 'shi2024unified', 'he2024dont', 'jin2024model', 'das2024larimar', 'ramsauer2021hopfield', 'lu2023ibcl']), ['S6.SS4'])]),
  coverage('continual-llm-conclusion', [claim('survey-conclusion', 'Robust self-evolving LLMs still require stronger theory and evaluation.', '§7', [])]),
  coverage('continual-llm-synthesis', [claim('course-synthesis', 'The checklist synthesizes claims already evidenced in Chapters 1–6.', '§1–§7', [])], 'Checklist tổng hợp lại các claim đã được dạy và dẫn nguồn ở từng chương; page này không lặp lại toàn bộ bibliography của survey.'),
] as const satisfies readonly ContinualLearningLessonReferenceCoverage[];

export const continualLearningLessonReferenceCoverageById = new Map(
  continualLearningLessonReferenceCoverage.map((item) => [item.lessonId, item]),
);

export function getContinualLearningLessonClaimEvidence(lessonId: string): ContinualLearningClaimPaperEvidence[] {
  const coverageItem = continualLearningLessonReferenceCoverageById.get(lessonId);
  if (!coverageItem) return [];
  const evidence = new Map<string, ContinualLearningClaimPaperEvidence>();
  for (const claimItem of coverageItem.claims) {
    if (claimItem.surveyLocator) {
      evidence.set('shi2024continualSurvey', {
        paperId: 'shi2024continualSurvey',
        role: 'additional-evidence',
        exposure: 'inline',
      });
    }
    for (const item of claimItem.papers) evidence.set(item.paperId, item);
    if (!claimItem.includeSurveySectionEvidence || !claimItem.surveySections?.length) continue;
    const sectionMap = claimItem.includeDescendants ? surveyReferenceIdsBySection : surveyDirectReferenceIdsBySection;
    for (const paperId of claimItem.surveySections.flatMap((sectionId) => sectionMap[sectionId as keyof typeof sectionMap] ?? [])) {
      if (evidence.has(paperId)) continue;
      evidence.set(paperId, {
        paperId,
        role: 'additional-evidence',
        exposure: 'reference-page',
        reason: `Additional evidence cited by the survey for ${claimItem.id} (${claimItem.surveyLocator ?? claimItem.surveySections.join(', ')}).`,
      });
    }
  }
  return [...evidence.values()];
}

export function getContinualLearningLessonReferenceIds(lessonId: string): string[] {
  return getContinualLearningLessonClaimEvidence(lessonId).map((item) => item.paperId).sort();
}

export function getContinualLearningLessonFeaturedReferenceIds(lessonId: string): string[] {
  return getContinualLearningLessonClaimEvidence(lessonId)
    .filter((item) => item.exposure !== 'reference-page')
    .map((item) => item.paperId)
    .sort();
}

export function getContinualLearningLessonPapers(lessonId: string): ContinualLearningPaper[] {
  const papers: ContinualLearningPaper[] = [];
  for (const paperId of getContinualLearningLessonReferenceIds(lessonId)) {
    const paper = continualLearningPaperById.get(paperId);
    if (paper) papers.push(paper);
  }
  return papers;
}

export function formatContinualLearningPaperCitation(paper: ContinualLearningPaper): string {
  const firstAuthor = paper.authors[0]?.split(',')[0]?.trim() || paper.title;
  const authorLabel = paper.authors.length > 1 ? `${firstAuthor} et al.` : firstAuthor;
  return `${authorLabel}${paper.year ? ` (${paper.year})` : ''}`;
}

function coverage(
  lessonId: string,
  claims: readonly ContinualLearningClaimReferenceCoverage[],
  courseAnalysis?: string,
): ContinualLearningLessonReferenceCoverage {
  return { lessonId, claims, courseAnalysis };
}

function claim(
  id: string,
  summary: string,
  surveyLocator: string | undefined,
  papers: readonly ContinualLearningClaimPaperEvidence[],
  surveySections: readonly string[] = [],
  includeDescendants = false,
): ContinualLearningClaimReferenceCoverage {
  return {
    id,
    summary,
    surveyLocator,
    surveySections,
    includeDescendants,
    includeSurveySectionEvidence: surveySections.length > 0,
    papers,
  };
}

function primary(paperIds: readonly string[]): ContinualLearningClaimPaperEvidence[] {
  return paperIds.map((paperId) => ({ paperId, role: 'primary-example', exposure: 'inline' }));
}

function summarized(paperIds: readonly string[]): ContinualLearningClaimPaperEvidence[] {
  return paperIds.map((paperId) => ({ paperId, role: 'primary-example', exposure: 'paper-summary' }));
}

function further(paperIds: readonly string[], reason: string): ContinualLearningClaimPaperEvidence[] {
  return paperIds.map((paperId) => ({ paperId, role: 'additional-evidence', exposure: 'reference-page', reason }));
}

if (generatedPaperById.size !== generatedPapers.length) {
  throw new Error('Generated Continual Learning paper IDs must be unique.');
}

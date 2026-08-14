import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { discoverLearningMdxFiles, inspectLearningMdx, validateLearningMdxFiles, validateLearningMdxSource } from '../../scripts/learningContentMdx.ts';
import { learningCatalog } from '../content/learning/index.ts';
import { continualLearningLessonPairs } from '../content/learning/continual-learning-llm/table-of-contents.ts';
import {
  continualLearningCitationEvidence,
  continualLearningCitationEvidenceById,
  continualLearningCitationLinkOnlyExceptionById,
  continualLearningCitationLinkOnlyExceptions,
} from '../content/learning/continual-learning-llm/citationEvidence.ts';
import {
  continualLearningLessonReferenceCoverage,
  continualLearningPaperById,
  continualLearningPapers,
  getContinualLearningLessonClaimEvidence,
  getContinualLearningLessonFeaturedReferenceIds,
  getContinualLearningLessonPapers,
  getContinualLearningLessonReferenceIds,
} from '../content/learning/continual-learning-llm/papers.ts';
import { citationEvidenceTargetLabel } from '../core/learning/citationEvidence.ts';
import { indexLearningReferences } from '../core/learning/referenceIndex.ts';
import { getLearningMdxComponentNames, parseLearningMdxPath } from '../core/learning/mdxContract.ts';
import { getAllowedLearningMdxComponentNames } from '../content/learning/mdxComponents.ts';
import type { LearningCatalog } from '../core/learning/types.ts';

const lessonFiles = discoverLearningMdxFiles('src/content/learning');
const publishedLessonIds = learningCatalog.lessons
  .filter((lesson) => lesson.contentStatus === 'published')
  .map((lesson) => lesson.id);
const expectedPageCounts: Record<string, number> = {
  'minimal-llm-project-skeleton': 1,
  'llm-from-scratch-roadmap': 3,
  'llm-component-checkpoint-quiz': 3,
  'llm-system-components': 3,
  'llm-system-components-quiz': 3,
  'language-modeling-next-token': 5,
  'language-modeling-next-token-quiz': 5,
  'ar-language-model-inference-pipeline': 6,
  'ar-language-model-inference-pipeline-quiz': 5,
  'llm-output-head-and-loss': 6,
  'llm-output-head-and-loss-quiz': 4,
  'llm-next-token-loss': 3,
  'llm-next-token-loss-quiz': 7,
  'llm-scale-and-development': 4,
  'llm-scale-and-development-quiz': 3,
  'llm-data-pipeline-overview': 9,
  'llm-data-pipeline-checkpoint-quiz': 9,
  'loss-perplexity-hand-calculation': 4,
  'benchmark-likelihood-quiz': 8,
  'evaluation-beyond-perplexity': 2,
  'tokenization-why-it-matters': 2,
  'tokenization-why-it-matters-quiz': 4,
  'tokenizer-regex-from-scratch': 6,
  'tokenizer-regex-from-scratch-quiz': 5,
  'tokenization-bpe-tiktoken': 4,
  'tokenization-bpe-tiktoken-quiz': 4,
  'tokenization-token-ids-vocabulary': 4,
  'tokenization-raw-text-to-token-ids': 5,
  'tokenization-token-ids-vocabulary-quiz': 4,
  'llm-evaluation-foundations': 1,
  'evaluation-dataset-design': 1,
  'deterministic-and-reference-metrics': 1,
  'human-evaluation-rubrics': 1,
  'inter-rater-agreement': 1,
  'pointwise-and-pairwise-evaluation': 1,
  'llm-as-a-judge': 1,
  'llm-judge-biases': 1,
  'benchmark-selection-and-contamination': 1,
  'hallucination-and-factuality-evaluation': 1,
  'rag-evaluation': 1,
  'llm-safety-foundations': 1,
  'refusal-calibration': 1,
  'toxicity-bias-and-privacy': 1,
  'jailbreak-and-prompt-injection': 1,
  'guardrails-for-llm-applications': 1,
  'llm-red-teaming': 1,
  'production-regression-evals': 1,
  'evaluation-ab-testing': 1,
  'evaluation-harness-code': 1,
  'conv2d-shape-exercise': 1,
  'conv2d-value-exercise': 1,
  'pooling-shape-exercise': 1,
  'pooling-value-exercise': 1,
  'vectors-intuition': 6,
  'vector-operations': 6,
  'dot-product': 6,
  'vector-norms': 6,
  'unit-vectors-normalization': 5,
  'cosine-similarity': 5,
  'orthogonality': 5,
  'matrix-operations': 6,
  'elementwise-vs-matrix-product': 6,
  'systems-of-linear-equations': 6,
  'gaussian-elimination': 6,
  'lu-decomposition': 6,
  'identity-inverse-matrix': 6,
  'continual-learning-llm-overview': 5,
  'stability-plasticity-dilemma': 2,
  'cl-settings-til-dil-cil': 4,
  'continual-learning-llm-overview-quiz': 8,
  'catastrophic-forgetting-in-llms': 1,
  'catastrophic-forgetting-in-llms-quiz': 4,
  'catastrophic-forgetting-code-lab': 8,
  'catastrophic-forgetting-code-lab-quiz': 4,
  'cl-methods-taxonomy-and-replay': 1,
  'cl-methods-taxonomy-and-replay-quiz': 3,
  'replay-introduction': 2,
  'replay-introduction-quiz': 3,
  'replay-experience-code-lab': 15,
  'replay-experience-code-lab-quiz': 11,
};
const expectedQuizQuestionIds: Record<string, string[]> = {
  'catastrophic-forgetting-code-lab-quiz': ['code-lab-forgetting-phenomenon', 'code-lab-cause-of-forgetting', 'code-lab-metric-sensitivity', 'code-lab-solutions-forward'],
  'catastrophic-forgetting-in-llms-quiz': ['catastrophic-forgetting-definition', 'why-new-task-causes-forgetting', 'llm-cl-unique-challenges', 'pattern-and-accuracy-behavior'],
  'continual-learning-llm-overview-quiz': ['statically-pretrained-nature', 'why-static-llm-insufficient', 'why-not-retrain-from-scratch', 'rag-vs-continual-learning', 'cl-core-goal', 'cl-core-challenge', 'lifelong-learning-analogy', 'method-choice'],
  'cl-methods-taxonomy-and-replay-quiz': ['cl-method-families', 'optimization-based-cl', 'representation-based-cl'],
  'replay-introduction-quiz': ['replay-training-objective', 'replay-constraints', 'replay-bound-tradeoff'],
  'replay-experience-code-lab-quiz': ['replay-lab-environment-config', 'replay-lab-data-separation', 'replay-lab-evaluation-metrics', 'replay-lab-naive-result', 'replay-lab-buffer-composition', 'replay-lab-retention-result', 'replay-lab-spurious-forgetting-nuance', 'replay-lab-operational-takeaway', 'replay-lab-threshold-evidence', 'replay-lab-paper-mapping', 'replay-lab-paper-scope'],
  'llm-component-checkpoint-quiz': ['ai-hierarchy-order', 'choose-problem-domain', 'role-domain-convention'],
  'llm-system-components-quiz': ['classify-system-components', 'academia-focus', 'industry-focus'],
  'language-modeling-next-token-quiz': ['technical-understanding', 'language-modeling-definition', 'llm-learning-objective', 'valid-token-examples', 'chain-rule-result'],
  'ar-language-model-inference-pipeline-quiz': ['ar-inference-order', 'sampling-role', 'corpus-vocabulary', 'output-vector-length', 'probability-sum'],
  'llm-output-head-and-loss-quiz': ['context-vector-role', 'projection-shape', 'logits-properties', 'softmax-role'],
  'llm-next-token-loss-quiz': ['shifted-target', 'one-hot-target', 'loss-behavior', 'manual-loss', 'why-log', 'negative-sign', 'sequence-loss'],
  'llm-scale-and-development-quiz': ['why-large', 'scale-comparison', 'popularity-factors'],
  'llm-data-pipeline-checkpoint-quiz': ['pretraining-facts', 'finetuning-facts', 'training-stage-task-match', 'transformer-main-blocks', 'encoder-input-prep-order', 'why-position-embedding', 'encoder-context', 'decoder-input-prep', 'decoder-generation-loop'],
  'tokenization-why-it-matters-quiz': ['word-level-limitations', 'two-extremes', 'subword-benefit', 'sequence-length-cost'],
  'tokenizer-regex-from-scratch-quiz': ['capturing-whitespace', 'punctuation-split-output', 'cleanup-comprehension', 'tokenize-function', 'regex-limitations'],
  'tokenization-bpe-tiktoken-quiz': ['bpe-initialization', 'bpe-training-loop', 'merge-rank-inference', 'tokenization-limitations'],
  'tokenization-token-ids-vocabulary-quiz': ['vocabulary-lookup', 'token-id-meaning', 'token-id-context', 'text-id-round-trip'],
  'benchmark-likelihood-quiz': ['nll-and-ppl', 'ground-truth-probability', 'length-normalization', 'interpret-ppl-four', 'ppl-dependencies', 'valid-ppl-comparison', 'ppl-versus-reasoning', 'ppl-current-role'],
};

test('Learning Lab MDX paths support optional chapter-and-node prefixes', () => {
  assert.deepEqual(
    parseLearningMdxPath('src/content/learning/llm-ai-engineering/1.1.6-language-modeling-next-token.vi.mdx'),
    { domainId: 'llm-ai-engineering', lessonId: 'language-modeling-next-token', locale: 'vi' },
  );
  assert.deepEqual(
    parseLearningMdxPath('src/content/learning/cv/conv2d-shape-exercise.vi.mdx'),
    { domainId: 'cv', lessonId: 'conv2d-shape-exercise', locale: 'vi' },
  );
});

test('continual-learning MDX filenames mirror chapter and TOC order', () => {
  const tracks = learningCatalog.tracks.filter((track) => track.domainId === 'continual-learning-llm');
  const expectedFilenames = tracks.flatMap((track, chapterIndex) => (
    track.lessonIds.map((lessonId, nodeIndex) => `${chapterIndex + 1}.1.${nodeIndex + 1}-${lessonId}.vi.mdx`)
  ));
  const actualFilenames = lessonFiles
    .filter((file) => parseLearningMdxPath(file)?.domainId === 'continual-learning-llm')
    .map((file) => file.replaceAll('\\', '/').split('/').at(-1));

  assert.deepEqual(actualFilenames.sort(), expectedFilenames.sort());
});

test('every Learning Lab MDX file follows the generic catalog, locale, metadata, and component contract', async () => {
  assert.equal(lessonFiles.length, 145);
  assert.ok(lessonFiles.every((file) => file.endsWith('.vi.mdx')));
  assert.deepEqual(lessonFiles.map((file) => parseLearningMdxPath(file)?.lessonId).sort(), publishedLessonIds.sort());
  const documents = await validateLearningMdxFiles(lessonFiles, learningCatalog);
  assert.equal(documents.length, 145);
  for (const lessonFile of lessonFiles) {
    const source = readFileSync(lessonFile, 'utf8');
    const parsed = parseLearningMdxPath(lessonFile);
    assert.ok(parsed, `Invalid Learning Lab MDX filename: ${lessonFile}`);
    const inspection = await inspectLearningMdx(source, lessonFile);
    assert.equal(inspection.metadata.domainId, parsed.domainId);
    assert.equal(inspection.metadata.id, parsed.lessonId);
    assert.equal(inspection.metadata.locale, parsed.locale);
    const expectedPageCount = expectedPageCounts[parsed.lessonId] ?? Number(inspection.metadata.pageCount ?? 1);
    assert.equal(Number(inspection.metadata.pageCount ?? 1), expectedPageCount);
    if (expectedPageCount > 1 && !inspection.quizQuestionIds.length) {
      assert.deepEqual(inspection.pageIndexes, Array.from({ length: expectedPageCount }, (_, index) => index));
    }
    if (expectedQuizQuestionIds[parsed.lessonId]) assert.deepEqual(inspection.quizQuestionIds, expectedQuizQuestionIds[parsed.lessonId]);
    if (parsed.domainId === 'cv') assert.equal(inspection.cvExerciseFixtures.length, 1);
    const allowedComponents = new Set(getAllowedLearningMdxComponentNames(parsed.domainId));
    for (const componentName of getLearningMdxComponentNames(source)) assert.ok(allowedComponents.has(componentName), `Unexpected Learning Lab MDX component: ${componentName}`);
  }
  const requirements = documents.find((document) => document.lessonId === 'minimal-llm-project-skeleton')?.text ?? '';
  for (const requirement of ['Google Colab', 'Python', 'uv', 'VSCode']) assert.match(requirements, new RegExp(requirement));
});

test('published continual-learning pairs map theory concepts to quiz questions exactly', async () => {
  const domainFiles = lessonFiles.filter((file) => parseLearningMdxPath(file)?.domainId === 'continual-learning-llm');
  const inspectionByLessonId = new Map<string, Awaited<ReturnType<typeof inspectLearningMdx>>>();

  for (const file of domainFiles) {
    const parsed = parseLearningMdxPath(file);
    assert.ok(parsed);
    inspectionByLessonId.set(parsed.lessonId, await inspectLearningMdx(readFileSync(file, 'utf8'), file));
  }

  for (const pair of continualLearningLessonPairs) {
    const theory = learningCatalog.lessons.find((lesson) => lesson.domainId === 'continual-learning-llm' && lesson.id === pair.theory.id);
    const quiz = learningCatalog.lessons.find((lesson) => lesson.domainId === 'continual-learning-llm' && lesson.id === pair.quiz.id);
    assert.ok(theory);
    assert.ok(quiz);
    if (theory.contentStatus !== 'published') continue;

    const theoryInspection = inspectionByLessonId.get(pair.theory.id);
    const quizInspection = inspectionByLessonId.get(pair.quiz.id);
    assert.ok(theoryInspection, `published theory ${pair.theory.id} needs an MDX file`);
    assert.ok(quizInspection, `published quiz ${pair.quiz.id} needs an MDX file`);
    const theoryConceptIds = theoryInspection.metadata.conceptIds;
    assert.ok(Array.isArray(theoryConceptIds) && theoryConceptIds.length, `${pair.theory.id} needs conceptIds`);
    assert.deepEqual(quizInspection.metadata.conceptIds, theoryConceptIds);
    assert.deepEqual(quizInspection.quizQuestionIds, theoryConceptIds);
    assert.deepEqual(quizInspection.citationReferences, [], `${pair.quiz.id} must not receive inline citation evidence`);
    assert.deepEqual(quizInspection.paperSummaryReferences, [], `${pair.quiz.id} must not receive reference analysis blocks`);
    assert.ok(!continualLearningLessonReferenceCoverage.some((coverage) => coverage.lessonId === pair.quiz.id), `${pair.quiz.id} must not receive a generated reference page`);
  }
});

test('continual-learning paper coverage is complete, unique, and resolvable', async () => {
  const domainFiles = lessonFiles.filter((file) => parseLearningMdxPath(file)?.domainId === 'continual-learning-llm');
  const theoryIds = domainFiles
    .map((file) => parseLearningMdxPath(file)?.lessonId)
    .filter((lessonId): lessonId is string => typeof lessonId === 'string' && !lessonId.endsWith('-quiz'))
    .sort();
  assert.equal(theoryIds.length, 40);
  assert.deepEqual(continualLearningLessonReferenceCoverage.map((item) => item.lessonId).sort(), theoryIds);
  assert.equal(continualLearningPapers.length, continualLearningPaperById.size);
  const claimIds = new Set<string>();

  const identifiers = new Set<string>();
  for (const paper of continualLearningPapers) {
    assert.notEqual(paper.year, null, `${paper.id} needs a reviewed publication year`);
    for (const identifier of [paper.doi && `doi:${paper.doi.toLowerCase()}`, paper.arxivId && `arxiv:${paper.arxivId.toLowerCase().replace(/v\d+$/, '')}`].filter(Boolean) as string[]) {
      assert.ok(!identifiers.has(identifier), `duplicate paper identifier ${identifier}`);
      identifiers.add(identifier);
    }
  }

  for (const coverage of continualLearningLessonReferenceCoverage) {
    const referenceIds = getContinualLearningLessonReferenceIds(coverage.lessonId);
    assert.ok(referenceIds.length || coverage.courseAnalysis, `${coverage.lessonId} needs papers or an explicit course-analysis exception`);
    for (const paperId of referenceIds) assert.ok(continualLearningPaperById.has(paperId), `${coverage.lessonId} references unknown paper ${paperId}`);
    assert.ok(coverage.claims.length, `${coverage.lessonId} needs at least one reviewed claim row`);
    for (const claim of coverage.claims) {
      assert.ok(!claimIds.has(claim.id), `duplicate claim id ${claim.id}`);
      claimIds.add(claim.id);
      assert.ok(claim.summary.trim(), `${claim.id} needs a reviewable claim summary`);
      if (claim.includeSurveySectionEvidence) {
        assert.ok(claim.surveyLocator, `${claim.id} expands survey evidence but has no survey locator`);
        assert.ok(claim.surveySections?.length, `${claim.id} expands survey evidence but has no source section`);
      }
    }
    for (const evidence of getContinualLearningLessonClaimEvidence(coverage.lessonId)) {
      assert.ok(continualLearningPaperById.has(evidence.paperId), `${coverage.lessonId} references unknown paper ${evidence.paperId}`);
      if (evidence.exposure === 'reference-page') assert.ok(evidence.reason?.trim(), `${coverage.lessonId}/${evidence.paperId} needs a further-reading reason`);
    }
  }

  assert.equal(continualLearningCitationEvidence.length, continualLearningCitationEvidenceById.size, 'citation evidence IDs must be unique');
  assert.equal(continualLearningCitationLinkOnlyExceptions.length, continualLearningCitationLinkOnlyExceptionById.size, 'citation exception IDs must be unique');
  assert.equal(
    new Set([...continualLearningCitationEvidence.map((item) => item.id), ...continualLearningCitationLinkOnlyExceptions.map((item) => item.id)]).size,
    continualLearningCitationEvidence.length + continualLearningCitationLinkOnlyExceptions.length,
    'citation occurrence IDs must be unique across evidence and exception registries',
  );
  for (const evidence of continualLearningCitationEvidence) {
    const coverage = continualLearningLessonReferenceCoverage.find((item) => item.lessonId === evidence.lessonId);
    assert.ok(coverage, `${evidence.id} references unknown lesson ${evidence.lessonId}`);
    const claim = coverage.claims.find((item) => item.id === evidence.claimId);
    assert.ok(claim, `${evidence.id} references unknown claim ${evidence.claimId}`);
    assert.ok(continualLearningPaperById.has(evidence.paperId), `${evidence.id} references unknown paper ${evidence.paperId}`);
    assert.ok(getContinualLearningLessonClaimEvidence(evidence.lessonId).some((item) => item.paperId === evidence.paperId), `${evidence.id} paper is not linked to its reviewed claim`);
    assert.ok(evidence.excerpt.includes(evidence.searchText), `${evidence.id} searchText must be an exact excerpt substring`);
    assert.match(evidence.verificationUrl, /^https?:\/\//, `${evidence.id} needs an HTTP(S) verification target`);
    assert.match(evidence.retrievedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(evidence.review.status, 'verified');
    assert.match(evidence.review.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(evidence.locator.trim(), `${evidence.id} needs a human-readable locator`);
    assert.ok(citationEvidenceTargetLabel(evidence.targetPrecision).length > 0);
    if (evidence.targetPrecision === 'html-anchor') {
      assert.ok(new URL(evidence.verificationUrl).hash, `${evidence.id} claims HTML precision without an anchor`);
    }
    if (evidence.targetPrecision === 'pdf-page') {
      assert.match(new URL(evidence.verificationUrl).hash, /^#page=\d+$/, `${evidence.id} claims PDF precision without a page target`);
    }
    if (evidence.verificationUrl.includes('arxiv.org/html/')) {
      assert.match(evidence.sourceVersion ?? '', /^arXiv v\d+$/, `${evidence.id} must pin its reviewed arXiv version`);
      assert.match(new URL(evidence.verificationUrl).pathname, /v\d+$/, `${evidence.id} must target the reviewed arXiv version`);
    }
    if (evidence.quotation.basis === 'redistributable-license') {
      assert.match(evidence.quotation.licenseUrl ?? '', /^https?:\/\//, `${evidence.id} needs its source license URL`);
    }
    if (evidence.automatedAudit?.status === 'manual-required') {
      assert.ok(evidence.automatedAudit.reason.trim(), `${evidence.id} needs a manual-audit reason`);
    }
  }

  for (const exception of continualLearningCitationLinkOnlyExceptions) {
    const coverage = continualLearningLessonReferenceCoverage.find((item) => item.lessonId === exception.lessonId);
    const claim = coverage?.claims.find((item) => item.id === exception.claimId);
    assert.ok(claim, `${exception.id} references an unknown lesson or claim`);
    assert.ok(getContinualLearningLessonClaimEvidence(exception.lessonId).some((item) => item.paperId === exception.paperId), `${exception.id} paper is not linked to its reviewed claim`);
    assert.ok(continualLearningPaperById.has(exception.paperId), `${exception.id} references unknown paper ${exception.paperId}`);
    assert.ok(exception.reason.trim(), `${exception.id} needs a concrete link-only reason`);
    assert.match(exception.verificationUrl, /^https?:\/\//, `${exception.id} needs an HTTP(S) target`);
    assert.match(exception.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
  }

  const usedEvidenceIds = new Set<string>();
  const usedExceptionIds = new Set<string>();
  let paperSummaryCount = 0;

  for (const file of domainFiles.filter((candidate) => !parseLearningMdxPath(candidate)?.lessonId.endsWith('-quiz'))) {
    const parsed = parseLearningMdxPath(file);
    assert.ok(parsed);
    const inspection = await inspectLearningMdx(readFileSync(file, 'utf8'), file);
    const source = readFileSync(file, 'utf8');
    assert.doesNotMatch(
      source,
      /^Nguồn(?: tổng hợp| liên quan)?:/m,
      `${parsed.lessonId} must place prose evidence beside the claim instead of in a trailing source line`,
    );
    assert.doesNotMatch(source, /^#{1,6} .*<Cite\b/m, `${parsed.lessonId} must place citations after local prose claims, not inside headings`);
    const coverageIds = new Set(getContinualLearningLessonReferenceIds(parsed.lessonId));
    const authoredPaperIds = new Set(inspection.paperReferenceIds);
    for (const paperId of inspection.paperReferenceIds) {
      assert.ok(continualLearningPaperById.has(paperId), `${parsed.lessonId} cites unknown paper ${paperId}`);
      assert.ok(coverageIds.has(paperId), `${parsed.lessonId} cites ${paperId} outside its claim coverage`);
    }
    for (const citation of inspection.citationReferences) {
      assert.notEqual(Boolean(citation.evidenceId), Boolean(citation.exceptionId), `${parsed.lessonId}/${citation.paperId} must declare exactly one evidence or link-only exception ID`);
      if (citation.evidenceId) {
        assert.ok(!usedEvidenceIds.has(citation.evidenceId), `${citation.evidenceId} must identify one citation occurrence`);
        usedEvidenceIds.add(citation.evidenceId);
        const evidence = continualLearningCitationEvidenceById.get(citation.evidenceId);
        assert.ok(evidence, `${parsed.lessonId} cites unknown evidence ${citation.evidenceId}`);
        assert.equal(evidence.lessonId, parsed.lessonId, `${citation.evidenceId} belongs to another lesson`);
        assert.equal(evidence.paperId, citation.paperId, `${citation.evidenceId} belongs to another paper`);
        if (citation.locator) {
          assert.equal(evidence.locator, citation.locator, `${citation.evidenceId} locator must match its authored citation`);
        }
      }
      if (citation.exceptionId) {
        assert.ok(!usedExceptionIds.has(citation.exceptionId), `${citation.exceptionId} must identify one citation occurrence`);
        usedExceptionIds.add(citation.exceptionId);
        const exception = continualLearningCitationLinkOnlyExceptionById.get(citation.exceptionId);
        assert.ok(exception, `${parsed.lessonId} cites unknown exception ${citation.exceptionId}`);
        assert.equal(exception.lessonId, parsed.lessonId, `${citation.exceptionId} belongs to another lesson`);
        assert.equal(exception.paperId, citation.paperId, `${citation.exceptionId} belongs to another paper`);
      }
    }
    assert.ok(inspection.citationReferences.length > 0, `${parsed.lessonId} needs at least one reviewed Cite occurrence`);
    paperSummaryCount += inspection.paperSummaryReferences.length;
    for (const evidence of getContinualLearningLessonClaimEvidence(parsed.lessonId)) {
      if (evidence.exposure !== 'reference-page') {
        assert.ok(authoredPaperIds.has(evidence.paperId), `${parsed.lessonId} must expose ${evidence.paperId} beside its claim`);
      }
      if (evidence.exposure === 'paper-summary') {
        const escapedPaperId = evidence.paperId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        assert.match(source, new RegExp(`<PaperSummary[\\s\\S]*?paper=["']${escapedPaperId}["']`), `${parsed.lessonId} must analyze ${evidence.paperId} with PaperSummary`);
      }
    }
    const declaredIds = inspection.metadata.referenceIds;
    if (declaredIds !== undefined) {
      assert.deepEqual([...declaredIds as string[]].sort(), [...new Set(inspection.paperReferenceIds)].sort(), `${parsed.lessonId} referenceIds must match authored citation components`);
    }
  }
  assert.deepEqual([...usedEvidenceIds].sort(), continualLearningCitationEvidence.map((evidence) => evidence.id).sort(), 'every reviewed evidence record must be used exactly once');
  assert.deepEqual([...usedExceptionIds].sort(), continualLearningCitationLinkOnlyExceptions.map((exception) => exception.id).sort(), 'every link-only exception must be used exactly once');
  assert.equal(paperSummaryCount, 3, 'the three authored PaperSummary occurrences must remain inventoried');
  assert.ok(getContinualLearningLessonReferenceIds('continual-learning-llm-overview').length <= 4, 'overview must not inherit the survey introduction bibliography');
  assert.ok(getContinualLearningLessonReferenceIds('continual-llm-synthesis').length <= 2, 'synthesis must not duplicate the full course bibliography');
  const reachableIds = new Set(continualLearningLessonReferenceCoverage.flatMap((coverage) => getContinualLearningLessonReferenceIds(coverage.lessonId)));
  assert.deepEqual(
    continualLearningPapers.filter((paper) => reachableIds.has(paper.id) && paper.url.includes('scholar.google.com')).map((paper) => paper.id),
    [],
    'papers exposed by a lesson must use canonical primary URLs instead of Scholar search fallbacks',
  );
  assert.deepEqual(
    continualLearningPapers.filter((paper) => paper.url.includes('scholar.google.com')).map((paper) => paper.id),
    ['kandel2000principles'],
    'only the documented, currently unused Kandel book record may retain a Scholar discovery fallback',
  );
});

test('continual-learning references assemble as one dedicated final runtime page', () => {
  assert.equal(continualLearningLessonReferenceCoverage.length, 40);
  const registry = readFileSync('src/components/learning/learningMdxRegistry.tsx', 'utf8');
  assert.match(registry, /const authoredPages = Array\.from\(\{ length: lesson\.pageCount \}/);
  assert.match(registry, /const referencePage = referenceCoverage \? \(/);
  assert.match(registry, /pageIndex=\{lesson\.pageCount\}/);
  assert.match(registry, /const pages = referencePage \? \[\.\.\.authoredPages, referencePage\] : authoredPages/);
  assert.match(registry, /return \{ pageCount: pages\.length, pages \}/);
  assert.doesNotMatch(registry, /pageIndex === lesson\.pageCount - 1.*<LessonReferences/);
  const referencePageAssembly = registry.slice(registry.indexOf('const referencePage ='), registry.indexOf('const pages ='));
  assert.doesNotMatch(referencePageAssembly, /citationEvidence=/, 'the final paper-map page must remain preview-free');
  assert.doesNotMatch(referencePageAssembly, /citationLinkOnlyExceptions=/, 'the final paper-map page must not receive occurrence review data');
  const components = readFileSync('src/components/learning/learningMdxComponents.tsx', 'utf8');
  assert.match(components, /const citation = `\[\$\{referenceIndex\}\]`/);
  assert.match(components, /startIndex=\{featured\.length \+ 1\}/, 'additional references must continue after featured numbering');
});

test('lesson reference indexes put featured papers first and reuse one number per paper', () => {
  const papers = [{ id: 'additional-a' }, { id: 'featured-b' }, { id: 'featured-a' }, { id: 'additional-b' }];
  const indexed = indexLearningReferences(papers, ['featured-a', 'featured-b']);
  assert.deepEqual(indexed.ordered.map((paper) => paper.id), ['featured-b', 'featured-a', 'additional-a', 'additional-b']);
  assert.equal(indexed.featuredCount, 2);
  assert.deepEqual(Object.fromEntries(indexed.indexById), {
    'featured-b': 1,
    'featured-a': 2,
    'additional-a': 3,
    'additional-b': 4,
  });
  assert.deepEqual(['featured-b', 'featured-b'].map((paperId) => indexed.indexById.get(paperId)), [1, 1], 'repeated citations must resolve to one paper index');

  for (const coverage of continualLearningLessonReferenceCoverage) {
    const lessonPapers = getContinualLearningLessonPapers(coverage.lessonId);
    const featuredIds = getContinualLearningLessonFeaturedReferenceIds(coverage.lessonId);
    const lessonIndex = indexLearningReferences(lessonPapers, featuredIds);
    assert.deepEqual(
      [...lessonIndex.indexById.values()],
      Array.from({ length: lessonPapers.length }, (_, index) => index + 1),
      `${coverage.lessonId} final reference numbering must be continuous`,
    );
    for (const evidence of continualLearningCitationEvidence.filter((item) => item.lessonId === coverage.lessonId)) {
      assert.ok(lessonIndex.indexById.has(evidence.paperId), `${evidence.id} must resolve to its final-page paper number`);
    }
    for (const exception of continualLearningCitationLinkOnlyExceptions.filter((item) => item.lessonId === coverage.lessonId)) {
      assert.ok(lessonIndex.indexById.has(exception.paperId), `${exception.id} must resolve to its final-page paper number`);
    }
  }
});

test('continual-learning quizzes vary correct positions and keep one defensible answer shape', async () => {
  const quizInspections = await Promise.all(continualLearningLessonPairs.map(async (pair) => {
    const file = lessonFiles.find((candidate) => parseLearningMdxPath(candidate)?.lessonId === pair.quiz.id);
    assert.ok(file, `missing quiz MDX for ${pair.quiz.id}`);
    return inspectLearningMdx(readFileSync(file, 'utf8'), file);
  }));
  const questions = quizInspections.flatMap((inspection) => inspection.quizQuestions);
  const singleQuestions = questions.filter((question) => question.mode === 'single');
  const multiQuestions = questions.filter((question) => question.mode === 'multi');

  assert.equal(questions.length, 162);
  assert.equal(singleQuestions.length, 161);
  assert.equal(multiQuestions.length, 1);
  assert.equal(multiQuestions[0]?.id, 'replay-constraints');
  assert.ok(questions.every((question) => question.optionCount === 4));
  assert.ok(singleQuestions.every((question) => question.correctOptionIndexes.length === 1));
  assert.equal(multiQuestions[0]?.correctOptionIndexes.length, 2);

  for (const inspection of quizInspections) {
    const usedPositions = new Set(inspection.quizQuestions.flatMap((question) => question.correctOptionIndexes));
    assert.ok(
      usedPositions.size >= Math.min(inspection.quizQuestions.length, 3),
      `${String(inspection.metadata.id)} should use varied answer positions without forcing an A–D permutation`,
    );

    const singlePositions = inspection.quizQuestions.map((question) => (
      question.correctOptionIndexes.length === 1 ? question.correctOptionIndexes[0] : null
    ));
    for (let index = 0; index + 2 < singlePositions.length; index += 1) {
      const window = singlePositions.slice(index, index + 3);
      if (window.some((position) => position === null)) continue;
      const [first, second, third] = window as [number, number, number];
      const firstStep = (second - first + 4) % 4;
      const secondStep = (third - second + 4) % 4;
      assert.ok(
        !(firstStep === secondStep && (firstStep === 1 || firstStep === 3)),
        `${String(inspection.metadata.id)} should not expose a cyclic three-answer pattern`,
      );
    }
  }

  const singlePositionCounts = [0, 0, 0, 0];
  const allCorrectFlagCounts = [0, 0, 0, 0];
  for (const question of questions) {
    for (const index of question.correctOptionIndexes) {
      allCorrectFlagCounts[index] += 1;
      if (question.mode === 'single') singlePositionCounts[index] += 1;
    }
  }
  assert.deepEqual([...singlePositionCounts].sort((a, b) => a - b), [39, 40, 41, 41]);
  assert.deepEqual([...allCorrectFlagCounts].sort((a, b) => a - b), [40, 40, 41, 42]);

  const sequenceCounts = new Map<string, number>();
  for (const inspection of quizInspections) {
    const sequence = inspection.quizQuestions
      .map((question) => question.correctOptionIndexes.join(''))
      .join('|');
    sequenceCounts.set(sequence, (sequenceCounts.get(sequence) ?? 0) + 1);
  }
  assert.ok(Math.max(...sequenceCounts.values()) <= 3, 'quiz files should not restart one predictable answer sequence');
});

test('generic MDX contract rejects imports, executable expressions, and unknown components', async () => {
  const metadata = "{ domainId: 'cv', id: 'x', locale: 'vi', title: 'x', headings: ['x'], keywords: ['x'] }";
  await assert.rejects(() => inspectLearningMdx(`import X from './x'\n\nexport const lessonMetadata = ${metadata}\n\n<X />`, 'fixture.mdx', 'cv'), /imports|unexpected|parse import/i);
  await assert.rejects(() => inspectLearningMdx("export const lessonMetadata = { domainId: 'cv', id: 'x', locale: 'vi', title: run(), headings: ['x'], keywords: ['x'] }", 'fixture.mdx', 'cv'), /executable|unsupported/i);
  await assert.rejects(() => inspectLearningMdx(`export const lessonMetadata = ${metadata};\n\n<Unknown />`, 'fixture.mdx', 'cv'), /unexpected MDX component/i);
});

test('shared visual primitives accept static semantic data', async () => {
  const metadata = "{ domainId: 'cv', id: 'x', locale: 'vi', title: 'x', headings: ['x'], keywords: ['x'] }";
  const source = `export const lessonMetadata = ${metadata}

<ConceptFlow ariaLabel="Flow" items={[{ title: 'A', detail: 'B' }]} />
<ExperimentChecklist ariaLabel="Checklist" items={[{ title: 'A', action: 'B', check: 'C' }]} />
<ComparisonMatrix ariaLabel="Matrix" columns={['A']} rows={[{ label: 'B', values: ['C'], highlightedColumn: 0 }]} />
<DatasetComposition ariaLabel="Dataset" totalLabel="3 samples" segments={[{ label: 'A', value: 2, valueLabel: '2' }, { label: 'B', value: 1, valueLabel: '1', tone: 'accent' }]} />
<MetricBars ariaLabel="Metrics" items={[{ label: 'A', value: 75, valueLabel: '75%', tone: 'success' }]} />
<ConceptSpectrum ariaLabel="Spectrum" items={[{ label: 'A', detail: 'B' }]} />
<CourseCards ariaLabel="Cards" exampleLabel="Example" takeawayLabel="Impact" items={[{ title: 'A', example: 'B', takeaway: 'C' }]} />
<EvidenceCards ariaLabel="Evidence" items={[{ eyebrow: 'Experiment', value: '75%', label: 'Retention', insight: 'Replay helps.', tone: 'success' }]} />`;
  const inspection = await inspectLearningMdx(source, 'fixture.mdx', 'cv');
  assert.deepEqual(inspection.pageIndexes, []);
  assert.deepEqual(inspection.quizQuestionIds, []);
});

test('continual-learning visuals use global semantic primitives without shared domain leakage', () => {
  const sharedComponents = readFileSync('src/components/learning/learningMdxComponents.tsx', 'utf8');
  const continualSources = lessonFiles
    .filter((file) => parseLearningMdxPath(file)?.domainId === 'continual-learning-llm')
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');

  for (const componentName of ['ConceptFlow', 'ExperimentChecklist', 'ComparisonMatrix', 'DatasetComposition', 'MetricBars', 'ConceptSpectrum', 'CourseCards', 'EvidenceCards']) {
    assert.match(sharedComponents, new RegExp(`export function ${componentName}\\b`));
  }
  assert.match(sharedComponents, /aria-label=\{ariaLabel\}/);
  assert.match(sharedComponents, /<caption className="sr-only">\{ariaLabel\}<\/caption>/);
  assert.doesNotMatch(sharedComponents, /continual-learning-llm\./);
  assert.doesNotMatch(continualSources, /<RequirementsGrid|<RequirementCard|assetKey=/);
});

test('generic MDX contract rejects empty or duplicate concept ids', async () => {
  const metadata = "{ domainId: 'cv', id: 'x', locale: 'vi', title: 'x', headings: ['x'], keywords: ['x']";
  const catalogText = { title: { en: 'CV', vi: 'CV' }, description: { en: '', vi: '' } };
  const catalog: LearningCatalog = {
    domains: [{ id: 'cv', text: catalogText, status: 'active', trackIds: ['cv-basics'] }],
    tracks: [{ id: 'cv-basics', text: catalogText, domainId: 'cv', lessonIds: ['x'], status: 'available' }],
    lessons: [{ id: 'x', domainId: 'cv', trackId: 'cv-basics', status: 'available', contentStatus: 'published', tags: [], entryPoints: [], text: { title: { en: 'x', vi: 'x' }, theory: [] }, sections: [] }],
  };
  const filePath = 'src/content/learning/cv/x.vi.mdx';
  await assert.rejects(
    () => validateLearningMdxSource(`export const lessonMetadata = ${metadata}, conceptIds: [] }`, filePath, catalog),
    /conceptIds must be a non-empty string array/,
  );
  await assert.rejects(
    () => validateLearningMdxSource(`export const lessonMetadata = ${metadata}, conceptIds: ['same', 'same'] }`, filePath, catalog),
    /conceptIds must be unique/,
  );
});

test('generic MDX contract accepts negative numeric literals but rejects other unary expressions', async () => {
  const metadata = "{ domainId: 'cv', id: 'x', locale: 'vi', title: 'x', headings: ['x'], keywords: ['x'] }";
  const inspection = await inspectLearningMdx(`export const lessonMetadata = ${metadata}\n\n<MdxPage page={-1} />`, 'fixture.mdx', 'cv');
  assert.deepEqual(inspection.pageIndexes, [-1]);
  await assert.rejects(
    () => inspectLearningMdx(`export const lessonMetadata = { domainId: 'cv', id: 'x', locale: 'vi', title: +1, headings: ['x'], keywords: ['x'] }`, 'fixture.mdx', 'cv'),
    /executable|unsupported/i,
  );
});

test('a Markdown-only CV lesson uses the generic contract without invoking its optional adapter', async () => {
  const cvLesson = learningCatalog.lessons.find((lesson) => lesson.domainId === 'cv');
  assert.ok(cvLesson);
  const source = `export const lessonMetadata = { domainId: 'cv', id: '${cvLesson.id}', locale: 'vi', title: 'Convolution', headings: ['Basics'], keywords: ['kernel'] }\n\n## Basics\n\nConvolution dùng một kernel trên ảnh.`;
  const fixtureCatalog: LearningCatalog = {
    domains: [learningCatalog.domains.find((domain) => domain.id === 'cv')!],
    tracks: learningCatalog.tracks.filter((track) => track.domainId === 'cv'),
    lessons: [{
      ...cvLesson,
      contentStatus: 'published',
      text: { title: { en: 'Convolution', vi: 'Convolution' }, theory: [] },
    }],
  };
  const document = await validateLearningMdxSource(source, `src/content/learning/cv/${cvLesson.id}.vi.mdx`, fixtureCatalog);
  assert.match(document.text, /Convolution dùng một kernel/);
  assert.deepEqual(getAllowedLearningMdxComponentNames('cv'), ['LessonNote', 'LessonImage', 'MdxQuiz', 'MdxPage', 'RequirementCard', 'RequirementsGrid', 'CourseCards', 'EvidenceCards', 'ConceptFlow', 'StageContinuityMap', 'ExperimentChecklist', 'SelfCheckList', 'ComparisonMatrix', 'PaperTradeoff', 'DatasetComposition', 'MetricBars', 'ConceptSpectrum', 'Cite', 'PaperSummary', 'LessonReferences', 'InlineMath', 'BlockMath', 'CvExercise']);
  await assert.rejects(
    () => inspectLearningMdx(`${source}\n\n<AiHierarchy content={{}} />`, `src/content/learning/cv/${cvLesson.id}.vi.mdx`, 'cv'),
    /unexpected MDX component AiHierarchy/,
  );
});

test('CV exercise validation requires one static fixture matching the catalog operation family', async () => {
  const lesson = learningCatalog.lessons.find((item) => item.id === 'conv2d-shape-exercise');
  assert.ok(lesson);
  const metadata = "{ domainId: 'cv', id: 'conv2d-shape-exercise', locale: 'vi', title: 'Bài tập output shape Conv2d', headings: ['Bài tập'], keywords: ['conv2d'] }";
  const path = 'src/content/learning/cv/conv2d-shape-exercise.vi.mdx';
  const catalog: LearningCatalog = {
    domains: [learningCatalog.domains.find((domain) => domain.id === 'cv')!],
    tracks: [learningCatalog.tracks.find((track) => track.id === 'cnn-shape-value')!],
    lessons: [lesson],
  };
  await assert.rejects(() => validateLearningMdxSource(`export const lessonMetadata = ${metadata}\n\n## Bài tập`, path, catalog), /one CvExercise fixture/);
  await assert.rejects(() => validateLearningMdxSource(`export const lessonMetadata = ${metadata}\n\n## Bài tập\n\n<CvExercise fixture={{ opType: 'MaxPool2d', inputShape: [1, 3, 8, 8], outputShape: [1, 3, 4, 4] }} />`, path, catalog), /operation does not match/);
});

test('generic validation rejects unknown catalog nodes, metadata drift, and duplicate locales', async () => {
  const validMetadata = "{ domainId: 'cv', id: 'convolution-basics', locale: 'vi', title: 'Convolution', headings: ['Basics'], keywords: ['kernel'] }";
  const catalogText = { title: { en: 'CV', vi: 'CV' }, description: { en: '', vi: '' } };
  const catalog: LearningCatalog = {
    domains: [{ id: 'cv', text: catalogText, status: 'active', trackIds: ['cv-basics'] }],
    tracks: [{ id: 'cv-basics', text: catalogText, domainId: 'cv', lessonIds: ['convolution-basics'], status: 'available' }],
    lessons: [{ id: 'convolution-basics', domainId: 'cv', trackId: 'cv-basics', status: 'available', contentStatus: 'published', tags: [], entryPoints: [], sections: [] }],
  };
  const filePath = 'src/content/learning/cv/convolution-basics.vi.mdx';
  await assert.doesNotReject(() => validateLearningMdxSource(`export const lessonMetadata = ${validMetadata}\n\n## Basics`, filePath, catalog));
  const titledCatalog: LearningCatalog = {
    ...catalog,
    lessons: [{ ...catalog.lessons[0], text: { title: { en: 'Convolution', vi: 'Tích chập' }, theory: [] } }],
  };
  await assert.rejects(
    () => validateLearningMdxSource(`export const lessonMetadata = ${validMetadata}\n\n## Basics`, filePath, titledCatalog),
    /title does not match the catalog/,
  );
  await assert.rejects(() => validateLearningMdxSource(`export const lessonMetadata = ${validMetadata}`, 'src/content/learning/unknown/convolution-basics.vi.mdx', catalog), /unknown Learning Lab domain/);
  await assert.rejects(() => validateLearningMdxSource(`export const lessonMetadata = ${validMetadata}`, 'src/content/learning/cv/missing.vi.mdx', catalog), /lesson does not exist/);
  await assert.rejects(() => validateLearningMdxSource(`export const lessonMetadata = ${validMetadata}`, 'src/content/learning/cv/convolution-basics.en.mdx', catalog), /metadata does not match/);
  await assert.rejects(() => validateLearningMdxFiles([lessonFiles[0], lessonFiles[0]], learningCatalog), /duplicate lesson locale/);
});

test('shared lesson assembly and search contain no LLM-specific branch or import', () => {
  const detail = readFileSync('src/components/learning/lesson/LessonDetail.tsx', 'utf8');
  const rail = readFileSync('src/components/learning/lesson/LessonRail.tsx', 'utf8');
  const contract = readFileSync('src/core/learning/mdxContract.ts', 'utf8');
  const tooling = readFileSync('scripts/learningContentMdx.ts', 'utf8');
  for (const source of [detail, rail, contract, tooling]) {
    assert.doesNotMatch(source, /llm-ai-engineering|renderLlm|virtual:llm/);
  }
});

test('migrated MDX lessons no longer have duplicate legacy extras or pilot renderer code', () => {
  const renderer = [
    'conceptRenderers.tsx',
    'languageModelRenderers.tsx',
    'tokenizerRenderers.tsx',
  ].map((fileName) => readFileSync(`src/components/learning/domains/llm-ai-engineering/${fileName}`, 'utf8')).join('\n');
  assert.equal(existsSync('src/content/learning/llm-ai-engineering/extras.ts'), false);
  assert.doesNotMatch(renderer, /colab-coding-requirements/);
});

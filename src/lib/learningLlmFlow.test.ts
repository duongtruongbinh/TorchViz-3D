import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import ts from 'typescript';

import { discoverLearningMdxFiles } from '../../scripts/learningContentMdx.ts';
import { learningCatalog } from '../content/learning/index.ts';
import { parseLearningMdxPath } from '../core/learning/mdxContract.ts';
import {
  getLearningLessonsForTrack,
  getLearningTrack,
  resolveLearningLessonRoute,
} from '../core/learning/selectors.ts';

type LlmTargetRole =
  | 'theory'
  | 'quiz'
  | 'calculation'
  | 'code'
  | 'production-pattern'
  | 'hybrid';

type RecapAudit = readonly [
  theoryId: string,
  quizId: string,
  assessedObjective?: string,
];

type QuizAudit = {
  theoryPrerequisiteId: string;
  allowedPrerequisiteIds: readonly string[];
};

const expectedOrderByTrack = {
  'llm-from-scratch-orientation': [
    'minimal-llm-project-skeleton', 'llm-from-scratch-roadmap',
    'llm-component-checkpoint-quiz', 'llm-system-components',
    'llm-system-components-quiz', 'language-modeling-next-token',
    'language-modeling-next-token-quiz', 'ar-language-model-inference-pipeline',
    'ar-language-model-inference-pipeline-quiz', 'llm-output-head-and-loss',
    'llm-output-head-and-loss-quiz', 'llm-next-token-loss',
    'llm-next-token-loss-quiz', 'llm-scale-and-development',
    'llm-scale-and-development-quiz',
  ],
  'text-data-and-tokenization': [
    'text-embeddings-overview', 'text-embeddings-overview-quiz',
    'tokenization-why-it-matters', 'tokenization-why-it-matters-quiz',
    'tokenizer-regex-from-scratch', 'tokenizer-regex-from-scratch-quiz',
    'tokenization-bpe-tiktoken', 'tokenization-bpe-tiktoken-quiz',
    'tokenization-token-ids-vocabulary',
    'tokenization-token-ids-vocabulary-quiz',
    'tokenization-raw-text-to-token-ids', 'tokenization-special-tokens',
    'tokenization-special-tokens-quiz',
    'sliding-window-and-embedding-calculation', 'token-counting-hand-quiz',
    'tokenizer-and-dataloader-code', 'tokenization-data-pipeline',
    'tokenization-embedding-input-quiz',
  ],
  'attention-and-transformers-from-scratch': [
    'causal-self-attention-theory', 'attention-mechanism-checkpoint-quiz',
    'attention-score-shape-calculation', 'multi-head-attention-theory',
    'multi-head-attention-theory-quiz', 'multi-head-attention-code',
  ],
  'gpt-model-from-scratch': [
    'gpt-block-theory', 'gpt-block-checkpoint-quiz',
    'gpt-parameter-shape-calculation', 'gpt-module-code',
  ],
  'pretraining-and-generation': [
    'llm-data-pipeline-overview', 'llm-data-pipeline-checkpoint-quiz',
    'next-token-pretraining-theory', 'next-token-pretraining-theory-quiz',
    'loss-perplexity-hand-calculation', 'benchmark-likelihood-quiz',
    'training-loop-and-generation-code', 'evaluation-beyond-perplexity',
    'evaluation-beyond-perplexity-quiz', 'generation-decoding-theory',
    'generation-strategies-quiz', 'generation-sampling-calculation',
    'generation-strategies-code',
  ],
  'finetuning-and-alignment': [
    'finetuning-objectives-theory', 'finetuning-objectives-theory-quiz',
    'classification-finetuning-theory', 'classification-finetuning-quiz',
    'classification-head-calculation', 'classification-finetuning-code',
    'instruction-finetuning-theory', 'instruction-data-quality-quiz',
    'instruction-batch-mask-calculation',
    'classification-and-instruction-finetune-code', 'lora-finetuning-theory',
    'lora-finetuning-theory-quiz', 'lora-minimal-code',
  ],
  'llm-fundamentals': [
    'transformer-at-scale', 'transformer-at-scale-quiz',
    'context-window-limits', 'kv-cache-inference', 'tokenization-at-scale',
    'llm-pretraining', 'llm-positional-encodings',
    'llm-positional-encodings-quiz', 'flash-attention',
    'flash-attention-quiz', 'grouped-query-attention',
    'sliding-window-attention', 'scaling-laws', 'instruction-tuning', 'rlhf',
    'rlhf-quiz', 'constitutional-ai', 'direct-preference-optimization',
  ],
  'llm-evaluation': [
    'llm-evaluation-foundations', 'llm-evaluation-foundations-quiz',
    'deterministic-and-reference-metrics', 'evaluation-dataset-design',
    'human-evaluation-rubrics', 'human-evaluation-rubrics-quiz',
    'inter-rater-agreement', 'pointwise-and-pairwise-evaluation',
    'llm-as-a-judge', 'llm-judge-biases',
    'benchmark-selection-and-contamination',
    'benchmark-selection-and-contamination-quiz',
    'hallucination-and-factuality-evaluation', 'rag-evaluation',
    'llm-safety-foundations', 'llm-safety-foundations-quiz',
    'refusal-calibration', 'toxicity-bias-and-privacy',
    'jailbreak-and-prompt-injection',
    'jailbreak-and-prompt-injection-quiz',
    'guardrails-for-llm-applications', 'llm-red-teaming',
    'production-regression-evals', 'production-regression-evals-quiz',
    'evaluation-ab-testing', 'evaluation-harness-code',
  ],
  'production-prompt-engineering': [
    'system-prompt', 'system-prompt-quiz', 'user-prompt',
    'assistant-turn-history', 'role-prompting', 'zero-shot-prompting',
    'zero-shot-prompting-quiz', 'few-shot-examples',
    'one-shot-few-shot-prompting', 'clear-instruction-format-boundaries',
    'clear-instruction-format-boundaries-quiz', 'examples-output-constraints',
    'prompt-negative-instructions', 'structured-output-prompting',
    'structured-output-prompting-quiz', 'chain-of-thought',
    'self-consistency', 'react-prompting', 'tree-of-thought',
    'prompt-chaining', 'prompt-chaining-quiz', 'prompt-compression',
    'prompt-versioning-changelogs', 'prompt-ab-testing',
    'prompt-injection-defense', 'langsmith-observability',
    'openai-playground', 'anthropic-console', 'promptlayer-tracking',
  ],
  'working-with-ai-apis': [
    'chat-completions-api', 'chat-completions-api-quiz',
    'function-calling-tool-use', 'json-mode-structured-outputs',
    'streaming-responses-sse', 'embeddings-api', 'batch-api',
    'token-counting-tiktoken', 'rate-limits-quotas', 'vision-api-gpt4v',
    'assistants-api-file-search', 'anthropic-messages-api',
    'anthropic-streaming', 'anthropic-system-prompts',
    'anthropic-long-context', 'anthropic-vision-support',
    'anthropic-tool-use', 'gemini-models', 'gemini-multimodal-inputs',
    'gemini-search-grounding', 'gemini-context-caching', 'mistral-models',
    'mistral-json-mode', 'mistral-function-calling',
    'ollama-open-source-models', 'peft-finetuning-llama',
    'llama-3-models-api', 'ollama-local-llama', 'cohere-provider',
    'nvidia-nim', 'groq-inference', 'together-ai-hosting',
    'replicate-hosting',
  ],
  'api-integration-patterns': [
    'context-window-management', 'prompt-compression-cost-control',
    'count-tokens-before-sending', 'truncation-strategies',
    'conversation-summarization', 'partial-response-handling',
    'perceived-latency', 'sse-streaming-chunks', 'client-stream-rendering',
    'model-routing-by-complexity', 'api-error-fallbacks',
    'exponential-backoff-jitter', 'provider-quota-management',
    'queue-request-management', 'circuit-breaker-pattern',
    'token-usage-logging', 'sha256-response-caching', 'async-pipelines',
  ],
  'secure-api-integration': [
    'no-frontend-api-keys', 'no-frontend-api-keys-quiz',
    'env-files-secret-manager', 'backend-proxy-pattern',
    'redis-per-user-rate-limits', 'api-key-rotation', 'logging-monitoring',
  ],
} as const;

const roleIds = {
  theory: [
    'llm-from-scratch-roadmap', 'llm-system-components',
    'language-modeling-next-token', 'ar-language-model-inference-pipeline',
    'llm-output-head-and-loss', 'llm-scale-and-development',
    'text-embeddings-overview', 'tokenization-why-it-matters',
    'tokenization-bpe-tiktoken', 'tokenization-token-ids-vocabulary',
    'tokenization-special-tokens', 'tokenization-data-pipeline',
    'causal-self-attention-theory', 'multi-head-attention-theory',
    'gpt-block-theory', 'llm-data-pipeline-overview',
    'next-token-pretraining-theory', 'evaluation-beyond-perplexity',
    'generation-decoding-theory', 'finetuning-objectives-theory',
    'classification-finetuning-theory', 'instruction-finetuning-theory',
    'lora-finetuning-theory', 'transformer-at-scale',
    'llm-positional-encodings', 'flash-attention', 'rlhf',
    'llm-evaluation-foundations', 'human-evaluation-rubrics',
    'benchmark-selection-and-contamination', 'llm-safety-foundations',
    'jailbreak-and-prompt-injection', 'production-regression-evals',
    'system-prompt', 'zero-shot-prompting',
    'clear-instruction-format-boundaries', 'structured-output-prompting',
    'prompt-chaining', 'chat-completions-api', 'anthropic-messages-api',
    'mistral-models', 'ollama-open-source-models',
    'context-window-management', 'partial-response-handling',
    'model-routing-by-complexity', 'no-frontend-api-keys',
  ],
  quiz: [
    'llm-component-checkpoint-quiz', 'llm-system-components-quiz',
    'language-modeling-next-token-quiz',
    'ar-language-model-inference-pipeline-quiz',
    'llm-output-head-and-loss-quiz', 'llm-next-token-loss-quiz',
    'llm-scale-and-development-quiz', 'tokenization-why-it-matters-quiz',
    'tokenizer-regex-from-scratch-quiz', 'tokenization-bpe-tiktoken-quiz',
    'tokenization-token-ids-vocabulary-quiz',
    'tokenization-special-tokens-quiz', 'token-counting-hand-quiz',
    'tokenization-embedding-input-quiz',
    'attention-mechanism-checkpoint-quiz', 'gpt-block-checkpoint-quiz',
    'llm-data-pipeline-checkpoint-quiz', 'benchmark-likelihood-quiz',
    'generation-strategies-quiz', 'classification-finetuning-quiz',
    'instruction-data-quality-quiz', 'llm-pretraining',
    'instruction-tuning', 'direct-preference-optimization',
    'evaluation-dataset-design', 'llm-judge-biases', 'rag-evaluation',
    'toxicity-bias-and-privacy', 'llm-red-teaming', 'role-prompting',
    'one-shot-few-shot-prompting', 'prompt-negative-instructions',
    'tree-of-thought', 'promptlayer-tracking', 'rate-limits-quotas',
    'anthropic-streaming', 'mistral-json-mode', 'peft-finetuning-llama',
    'prompt-compression-cost-control', 'perceived-latency',
    'api-error-fallbacks', 'logging-monitoring',
    'text-embeddings-overview-quiz', 'multi-head-attention-theory-quiz',
    'next-token-pretraining-theory-quiz',
    'evaluation-beyond-perplexity-quiz',
    'finetuning-objectives-theory-quiz', 'lora-finetuning-theory-quiz',
    'transformer-at-scale-quiz', 'llm-positional-encodings-quiz',
    'flash-attention-quiz', 'rlhf-quiz',
    'llm-evaluation-foundations-quiz', 'human-evaluation-rubrics-quiz',
    'benchmark-selection-and-contamination-quiz',
    'llm-safety-foundations-quiz',
    'jailbreak-and-prompt-injection-quiz',
    'production-regression-evals-quiz', 'system-prompt-quiz',
    'zero-shot-prompting-quiz',
    'clear-instruction-format-boundaries-quiz',
    'structured-output-prompting-quiz', 'prompt-chaining-quiz',
    'chat-completions-api-quiz', 'no-frontend-api-keys-quiz',
  ],
  calculation: [
    'tokenization-raw-text-to-token-ids',
    'sliding-window-and-embedding-calculation',
    'attention-score-shape-calculation', 'gpt-parameter-shape-calculation',
    'loss-perplexity-hand-calculation', 'generation-sampling-calculation',
    'classification-head-calculation', 'instruction-batch-mask-calculation',
    'context-window-limits', 'kv-cache-inference', 'grouped-query-attention',
    'scaling-laws', 'deterministic-and-reference-metrics',
    'inter-rater-agreement', 'pointwise-and-pairwise-evaluation',
    'hallucination-and-factuality-evaluation', 'refusal-calibration',
    'evaluation-ab-testing', 'assistant-turn-history', 'few-shot-examples',
    'chain-of-thought', 'self-consistency', 'prompt-compression',
    'prompt-ab-testing', 'embeddings-api', 'batch-api',
    'token-counting-tiktoken', 'anthropic-long-context',
    'gemini-context-caching', 'count-tokens-before-sending',
    'truncation-strategies', 'exponential-backoff-jitter',
    'provider-quota-management', 'circuit-breaker-pattern',
    'sha256-response-caching', 'redis-per-user-rate-limits',
  ],
  code: [
    'tokenizer-regex-from-scratch', 'tokenizer-and-dataloader-code',
    'multi-head-attention-code', 'gpt-module-code',
    'training-loop-and-generation-code', 'generation-strategies-code',
    'classification-finetuning-code',
    'classification-and-instruction-finetune-code', 'lora-minimal-code',
    'sliding-window-attention', 'llm-as-a-judge',
    'guardrails-for-llm-applications', 'evaluation-harness-code',
    'user-prompt', 'examples-output-constraints', 'react-prompting',
    'openai-playground', 'anthropic-console', 'function-calling-tool-use',
    'json-mode-structured-outputs', 'streaming-responses-sse',
    'anthropic-system-prompts', 'anthropic-vision-support',
    'anthropic-tool-use', 'gemini-multimodal-inputs',
    'mistral-function-calling', 'ollama-local-llama',
    'sse-streaming-chunks', 'client-stream-rendering', 'async-pipelines',
    'backend-proxy-pattern',
  ],
  'production-pattern': [
    'minimal-llm-project-skeleton', 'tokenization-at-scale',
    'constitutional-ai', 'prompt-versioning-changelogs',
    'prompt-injection-defense', 'langsmith-observability',
    'vision-api-gpt4v', 'assistants-api-file-search', 'gemini-models',
    'gemini-search-grounding', 'llama-3-models-api', 'cohere-provider',
    'nvidia-nim', 'groq-inference', 'together-ai-hosting',
    'replicate-hosting', 'conversation-summarization',
    'queue-request-management', 'token-usage-logging',
    'env-files-secret-manager', 'api-key-rotation',
  ],
  hybrid: ['llm-next-token-loss'],
} as const satisfies Record<LlmTargetRole, readonly string[]>;

const recapAudits = [
  ['llm-from-scratch-roadmap', 'llm-component-checkpoint-quiz', 'Choose the correct LLM project layer for a concrete task.'],
  ['llm-system-components', 'llm-system-components-quiz', 'Trace data and responsibility through an LLM system.'],
  ['language-modeling-next-token', 'language-modeling-next-token-quiz', 'Apply next-token probability and autoregressive factorization.'],
  ['ar-language-model-inference-pipeline', 'ar-language-model-inference-pipeline-quiz', 'Trace token IDs, logits, probabilities, and generated state.'],
  ['llm-output-head-and-loss', 'llm-output-head-and-loss-quiz', 'Distinguish hidden states, logits, probabilities, and their shapes.'],
  ['llm-scale-and-development', 'llm-scale-and-development-quiz', 'Reason about scale trade-offs without treating size as capability.'],
  ['text-embeddings-overview', 'text-embeddings-overview-quiz', 'Trace raw text to token and embedding tensors.'],
  ['tokenization-why-it-matters', 'tokenization-why-it-matters-quiz', 'Choose token units for boundary and vocabulary constraints.'],
  ['tokenization-bpe-tiktoken', 'tokenization-bpe-tiktoken-quiz', 'Apply BPE training and inference distinctions.'],
  ['tokenization-token-ids-vocabulary', 'tokenization-token-ids-vocabulary-quiz', 'Trace encode/decode behavior and vocabulary invariants.'],
  ['tokenization-special-tokens', 'tokenization-special-tokens-quiz', 'Choose boundary, padding, and unknown-token behavior.'],
  ['tokenization-data-pipeline', 'tokenization-embedding-input-quiz', 'Validate token and positional embedding shapes.'],
  ['causal-self-attention-theory', 'attention-mechanism-checkpoint-quiz', 'Apply causal masking without relying on untaught multi-head details.'],
  ['multi-head-attention-theory', 'multi-head-attention-theory-quiz', 'Trace head splitting, attention shapes, and merging.'],
  ['gpt-block-theory', 'gpt-block-checkpoint-quiz', 'Trace residual, normalization, attention, and MLP state.'],
  ['llm-data-pipeline-overview', 'llm-data-pipeline-checkpoint-quiz', 'Trace training and generation pipeline state.'],
  ['next-token-pretraining-theory', 'next-token-pretraining-theory-quiz', 'Validate shifted targets, loss inputs, and training state.'],
  ['evaluation-beyond-perplexity', 'evaluation-beyond-perplexity-quiz', 'Choose evaluation protocols beyond likelihood.'],
  ['generation-decoding-theory', 'generation-strategies-quiz', 'Select decoding behavior from quality and reproducibility constraints.'],
  ['finetuning-objectives-theory', 'finetuning-objectives-theory-quiz', 'Choose a fine-tuning objective from the task contract.'],
  ['classification-finetuning-theory', 'classification-finetuning-quiz', 'Validate classification heads, labels, and evaluation boundaries.'],
  ['instruction-finetuning-theory', 'instruction-data-quality-quiz', 'Validate instruction samples, masks, and data quality.'],
  ['lora-finetuning-theory', 'lora-finetuning-theory-quiz', 'Reason about rank, frozen weights, and trainable adapters.'],
  ['transformer-at-scale', 'transformer-at-scale-quiz', 'Trace scaled transformer memory and inference trade-offs.'],
  ['llm-positional-encodings', 'llm-positional-encodings-quiz', 'Apply positional encoding contracts at long context.'],
  ['flash-attention', 'flash-attention-quiz', 'Distinguish exact attention semantics from IO-aware execution.'],
  ['rlhf', 'rlhf-quiz', 'Trace preference data, reward signals, and policy optimization risks.'],
  ['llm-evaluation-foundations', 'llm-evaluation-foundations-quiz', 'Specify an evaluation case, result, metric, and decision rule.'],
  ['human-evaluation-rubrics', 'human-evaluation-rubrics-quiz', 'Design anchored rubrics and calibrated judging protocols.'],
  ['benchmark-selection-and-contamination', 'benchmark-selection-and-contamination-quiz', 'Select benchmarks and control contamination.'],
  ['llm-safety-foundations', 'llm-safety-foundations-quiz', 'Apply a threat model and calibrated refusal policy.'],
  ['jailbreak-and-prompt-injection', 'jailbreak-and-prompt-injection-quiz', 'Separate untrusted data from instructions and authorization.'],
  ['production-regression-evals', 'production-regression-evals-quiz', 'Define release gates and regression evaluation suites.'],
  ['system-prompt', 'system-prompt-quiz', 'Apply instruction authority and trust boundaries.'],
  ['zero-shot-prompting', 'zero-shot-prompting-quiz', 'Write and validate a minimal zero-shot contract.'],
  ['clear-instruction-format-boundaries', 'clear-instruction-format-boundaries-quiz', 'Separate instructions, data, and output format.'],
  ['structured-output-prompting', 'structured-output-prompting-quiz', 'Choose schema-constrained output and validation behavior.'],
  ['prompt-chaining', 'prompt-chaining-quiz', 'Design typed stage boundaries and failure handling.'],
  ['chat-completions-api', 'chat-completions-api-quiz', 'Map Responses and Chat Completions into one internal contract.'],
  ['anthropic-messages-api', 'anthropic-streaming', 'Map Anthropic content blocks and stop state into the internal contract.'],
  ['mistral-models', 'mistral-json-mode', 'Choose Mistral capabilities and lifecycle behavior explicitly.'],
  ['ollama-open-source-models', 'peft-finetuning-llama', 'Choose model, license, quantization, and local runtime deliberately.'],
  ['context-window-management', 'prompt-compression-cost-control', 'Allocate context budget while preserving provenance.'],
  ['partial-response-handling', 'perceived-latency', 'Handle partial streams, cancellation, and terminal state.'],
  ['model-routing-by-complexity', 'api-error-fallbacks', 'Route and fail over by capability, risk, and SLO.'],
  ['no-frontend-api-keys', 'no-frontend-api-keys-quiz', 'Enforce the browser/server/provider credential boundary.'],
] as const satisfies readonly RecapAudit[];

const applicationQuizAudits = {
  'llm-next-token-loss-quiz': quizAudit(
    'llm-output-head-and-loss',
    'Compute and debug shifted next-token loss.',
    ['llm-output-head-and-loss', 'llm-next-token-loss'],
  ),
  'tokenizer-regex-from-scratch-quiz': quizAudit(
    'tokenization-why-it-matters',
    'Debug regex tokenizer boundaries and fallback behavior.',
    ['tokenization-why-it-matters', 'tokenizer-regex-from-scratch'],
  ),
  'token-counting-hand-quiz': quizAudit(
    'tokenization-special-tokens',
    'Validate sliding windows, labels, and leakage boundaries.',
    ['tokenization-special-tokens', 'sliding-window-and-embedding-calculation'],
  ),
  'benchmark-likelihood-quiz': quizAudit(
    'next-token-pretraining-theory',
    'Interpret NLL and perplexity under one declared protocol.',
    ['next-token-pretraining-theory', 'loss-perplexity-hand-calculation'],
  ),
  'llm-pretraining': quizAudit(
    'transformer-at-scale',
    'Apply context, cache, and tokenization trade-offs at scale.',
    ['transformer-at-scale', 'context-window-limits', 'kv-cache-inference', 'tokenization-at-scale'],
  ),
  'instruction-tuning': quizAudit(
    'transformer-at-scale',
    'Apply architecture and scaling choices to instruction tuning.',
    [
      'transformer-at-scale', 'llm-positional-encodings', 'flash-attention',
      'grouped-query-attention', 'sliding-window-attention', 'scaling-laws',
    ],
  ),
  'direct-preference-optimization': quizAudit(
    'rlhf',
    'Compare preference-learning objectives and failure modes.',
    ['rlhf', 'constitutional-ai'],
  ),
  'evaluation-dataset-design': quizAudit(
    'llm-evaluation-foundations',
    'Design representative, isolated, and versioned evaluation data.',
    ['llm-evaluation-foundations', 'deterministic-and-reference-metrics'],
  ),
  'llm-judge-biases': quizAudit(
    'human-evaluation-rubrics',
    'Detect position, verbosity, calibration, and leakage bias.',
    ['human-evaluation-rubrics', 'inter-rater-agreement', 'pointwise-and-pairwise-evaluation', 'llm-as-a-judge'],
  ),
  'rag-evaluation': quizAudit(
    'benchmark-selection-and-contamination',
    'Diagnose retrieval and generation quality separately.',
    ['benchmark-selection-and-contamination', 'hallucination-and-factuality-evaluation'],
  ),
  'toxicity-bias-and-privacy': quizAudit(
    'llm-safety-foundations',
    'Evaluate subgroup, privacy, and refusal trade-offs.',
    ['llm-safety-foundations', 'refusal-calibration'],
  ),
  'llm-red-teaming': quizAudit(
    'jailbreak-and-prompt-injection',
    'Build safe adversarial cases and validate layered controls.',
    ['jailbreak-and-prompt-injection', 'guardrails-for-llm-applications'],
  ),
  'role-prompting': quizAudit(
    'system-prompt',
    'Resolve role authority against server-side business state.',
    ['system-prompt', 'user-prompt', 'assistant-turn-history'],
  ),
  'one-shot-few-shot-prompting': quizAudit(
    'zero-shot-prompting',
    'Select examples only when evaluation justifies them.',
    ['zero-shot-prompting', 'few-shot-examples'],
  ),
  'prompt-negative-instructions': quizAudit(
    'clear-instruction-format-boundaries',
    'Prefer verifiable constraints over fragile negative wording.',
    ['clear-instruction-format-boundaries', 'examples-output-constraints'],
  ),
  'tree-of-thought': quizAudit(
    'structured-output-prompting',
    'Use bounded verification and authorized tool loops.',
    ['structured-output-prompting', 'chain-of-thought', 'self-consistency', 'react-prompting'],
  ),
  'promptlayer-tracking': quizAudit(
    'prompt-chaining',
    'Version, evaluate, secure, and observe a prompt workflow.',
    [
      'prompt-chaining', 'prompt-compression', 'prompt-versioning-changelogs',
      'prompt-ab-testing', 'prompt-injection-defense', 'langsmith-observability',
      'openai-playground', 'anthropic-console',
    ],
  ),
  'rate-limits-quotas': quizAudit(
    'chat-completions-api',
    'Apply request contracts, budgets, streaming, and rate-limit handling.',
    [
      'chat-completions-api', 'function-calling-tool-use',
      'json-mode-structured-outputs', 'streaming-responses-sse',
      'embeddings-api', 'batch-api', 'token-counting-tiktoken',
    ],
  ),
  'logging-monitoring': quizAudit(
    'no-frontend-api-keys',
    'Operate secrets, rate limits, rotation, logging, and incident response.',
    [
      'no-frontend-api-keys', 'env-files-secret-manager',
      'backend-proxy-pattern', 'redis-per-user-rate-limits', 'api-key-rotation',
    ],
  ),
} as const satisfies Record<string, QuizAudit>;

const recapQuizAudits = Object.fromEntries(recapAudits.map(
  ([theoryId, quizId, assessedObjective]) => [
    quizId,
    quizAudit(theoryId, assessedObjective, [theoryId]),
  ],
)) as Record<string, QuizAudit>;

const quizAudits: Record<string, QuizAudit> = {
  ...recapQuizAudits,
  ...applicationQuizAudits,
};

const roleById = new Map<string, LlmTargetRole>();
for (const [role, ids] of Object.entries(roleIds) as Array<[LlmTargetRole, readonly string[]]>) {
  for (const id of ids) {
    assert.equal(roleById.has(id), false, `${id} has more than one target role`);
    roleById.set(id, role);
  }
}

const expectedIds = Object.values(expectedOrderByTrack).flat();
const expectedGlobalIndex = new Map<string, number>(
  expectedIds.map((id, index) => [id, index]),
);

test('LLM flow audit manifest covers the exact 200-route target', () => {
  const catalogIds = learningCatalog.lessons
    .filter((lesson) => lesson.domainId === 'llm-ai-engineering')
    .map((lesson) => lesson.id);

  assert.equal(expectedIds.length, 200);
  assert.equal(new Set(expectedIds).size, 200);
  assert.deepEqual([...catalogIds].sort(), [...expectedIds].sort());
  assert.deepEqual([...roleById.keys()].sort(), [...expectedIds].sort());
  assert.deepEqual(
    Object.fromEntries(Object.entries(roleIds).map(([role, ids]) => [role, ids.length])),
    {
      theory: 46,
      quiz: 65,
      calculation: 36,
      code: 31,
      'production-pattern': 21,
      hybrid: 1,
    },
  );
});

test('LLM tracks follow the approved canonical order and all routes resolve', () => {
  for (const [trackId, expectedOrder] of Object.entries(expectedOrderByTrack)) {
    const track = getLearningTrack(learningCatalog, 'llm-ai-engineering', trackId);
    assert.ok(track, `missing LLM track ${trackId}`);
    assert.deepEqual(
      getLearningLessonsForTrack(learningCatalog, track).map((lesson) => lesson.id),
      expectedOrder,
    );
    for (const lessonId of expectedOrder) {
      const resolved = resolveLearningLessonRoute(learningCatalog, {
        domainId: 'llm-ai-engineering',
        trackId,
        lessonId,
      });
      assert.equal(resolved?.lesson.id, lessonId);
    }
  }
});

test('every target theory is followed by exactly one declared recap Quiz', () => {
  assert.equal(recapAudits.length, 46);
  assert.equal(Object.keys(quizAudits).length, 65);

  for (const [trackId, order] of Object.entries(expectedOrderByTrack)) {
    for (let index = 0; index < order.length; index += 1) {
      const lessonId = order[index];
      if (roleById.get(lessonId) !== 'theory') continue;
      const nextId = order[index + 1];
      assert.ok(nextId, `${trackId}/${lessonId} has no recap node`);
      assert.equal(roleById.get(nextId), 'quiz', `${trackId}/${lessonId} is not followed by a Quiz`);
      assert.equal(
        quizAudits[nextId]?.theoryPrerequisiteId,
        lessonId,
        `${trackId}/${nextId} does not recap its immediate theory`,
      );
      assert.notEqual(roleById.get(order[index - 1]), 'theory', `${trackId} has adjacent theory nodes`);
    }
  }
});

test('every Quiz declares taught prerequisites', () => {
  for (const quizId of roleIds.quiz) {
    const audit = quizAudits[quizId];
    assert.ok(audit, `${quizId} is missing its Quiz audit`);
    assert.ok(audit.allowedPrerequisiteIds.includes(audit.theoryPrerequisiteId));
    const quizIndex = expectedGlobalIndex.get(quizId);
    assert.notEqual(quizIndex, undefined);
    for (const prerequisiteId of audit.allowedPrerequisiteIds) {
      const prerequisiteIndex = expectedGlobalIndex.get(prerequisiteId);
      assert.notEqual(prerequisiteIndex, undefined, `${quizId} has unknown prerequisite ${prerequisiteId}`);
      assert.ok(
        prerequisiteIndex! < quizIndex!,
        `${quizId} asks ${prerequisiteId} before it is taught`,
      );
    }
  }
});

test('all 31 code-role lessons contain executable or syntax-valid code fences', () => {
  const scopedFiles = discoverLearningMdxFiles('src/content/learning/llm-ai-engineering');
  const fileByLessonId = new Map(scopedFiles.map((file) => [parseLearningMdxPath(file)!.lessonId, file]));

  for (const lessonId of roleIds.code) {
    const file = fileByLessonId.get(lessonId);
    assert.ok(file, `missing code lesson file for ${lessonId}`);
    const source = readFileSync(file, 'utf8');
    assertCodeFenceEvidence(source, lessonId);
  }
});

test('LLM authored content keeps images local and ownership out of the TOC', () => {
  for (const filePath of discoverLearningMdxFiles('src/content/learning/llm-ai-engineering')) {
    const source = readFileSync(filePath, 'utf8');
    assert.doesNotMatch(source, /!\[[^\]]*]\(\s*https?:\/\//, `${filePath} uses a remote Markdown image`);
    assert.doesNotMatch(source, /<img\b[^>]*\bsrc=["']https?:\/\//, `${filePath} uses a remote HTML image`);
  }
  const tocSource = readFileSync(
    'src/content/learning/llm-ai-engineering/table-of-contents.ts',
    'utf8',
  );
  assert.doesNotMatch(tocSource, /MdxQuiz|lessonMetadata|questions\s*:|practice\s*:/);
});

function collectFencedCodeBlocks(source: string): Array<{ language: string; code: string }> {
  return Array.from(source.matchAll(/(?:```|~~~)([^\n`~]*)\n([\s\S]*?)(?:```|~~~)/g)).map((match) => ({
    language: match[1].trim().toLowerCase(),
    code: match[2].trim(),
  }));
}

function assertCodeFenceEvidence(source: string, lessonId: string): void {
  const codeBlocks = collectFencedCodeBlocks(source);
  assert.ok(codeBlocks.length > 0, `${lessonId} requires at least one fenced code block`);
  for (const block of codeBlocks) {
    if (['python', 'py'].includes(block.language)) {
      const pythonCommand = process.env.PYTHON ?? (existsSync('/usr/bin/python3') ? 'python3' : 'python');
      const tempDir = mkdtempSync(path.join(os.tmpdir(), 'torchviz-mdx-'));
      const tempFile = path.join(tempDir, 'snippet.py');
      writeFileSync(tempFile, block.code, 'utf8');
      try {
        execFileSync(pythonCommand, ['-m', 'py_compile', tempFile], { stdio: 'pipe' });
      } finally {
        rmSync(tempDir, { recursive: true, force: true });
      }
    }
    if (['ts', 'typescript', 'tsx', 'jsx', 'js', 'javascript'].includes(block.language)) {
      const result = ts.transpileModule(block.code, {
        compilerOptions: {
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2020,
        },
      });
      assert.equal(result.diagnostics?.length ?? 0, 0, `${lessonId} has TypeScript syntax errors`);
    }
  }
}

function quizAudit(
  theoryPrerequisiteId: string,
  _assessedObjective: string,
  allowedPrerequisiteIds: readonly string[],
): QuizAudit {
  return {
    theoryPrerequisiteId,
    allowedPrerequisiteIds,
  };
}

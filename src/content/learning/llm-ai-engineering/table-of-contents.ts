import type {
  LearningContentStatus,
  LearningLessonStatus,
  LearningTableOfContents,
  LearningTocLessonSeed,
  LearningTocTrackSeed,
} from '../../../core/learning/types.ts';

// Each lessonSeed below is one node in the lesson table of contents.
// Concept panels inside a lesson are slides/steps, not TOC nodes.
const chapters: LearningTocTrackSeed[] = [
  {
    id: 'llm-from-scratch-orientation',
    text: {
      title: { en: "1.1 Overview", vi: "1.1 Tổng quan" },
      description: { en: "A TorchViz-native loop for learning LLM internals: theory, hand reasoning, then code.", vi: "Vòng học LLM internals theo kiểu TorchViz: lý thuyết, suy luận bằng tay, rồi code." },
    },
    lessonIds: [
      lessonSeed(
        'minimal-llm-project-skeleton',
        'Requirements',
        'Yêu cầu chuẩn bị',
        'next',
        'published',
      ),
      lessonSeed(
        'llm-from-scratch-roadmap',
        'LLM from scratch roadmap',
        'Roadmap LLM from Scratch',
        'available',
        'published',
      ),
      lessonSeed(
        'llm-component-checkpoint-quiz',
        'Roadmap checkpoint quiz',
        'Quiz',
        'available',
        'published',
      ),
    ],
  },
  {
    id: 'text-data-and-tokenization',
    text: {
      title: { en: "1.2 Text Data & Tokenization", vi: "1.2 Text Data & Tokenization" },
      description: { en: "Raw text, token ids, context windows, batches, and the first dataloader.", vi: "Text thô, token id, context window, batch và dataloader đầu tiên." },
    },
    lessonIds: [
      lessonSeed(
        'llm-data-pipeline-overview',
        'LLM data pipeline overview',
        'Pipeline dữ liệu của LLM',
        undefined,
        'published',
      ),
      lessonSeed(
        'llm-data-pipeline-checkpoint-quiz',
        'LLM data pipeline checkpoint quiz',
        'Quiz',
        undefined,
        'published',
      ),
      lessonSeed(
        'tokenization-why-it-matters',
        'Why tokenization matters',
        'Tokenization để làm gì?',
      ),
      lessonSeed(
        'tokenization-regex-tokenizer',
        'Regex tokenizer',
        'Tokenizer đơn giản bằng regex',
      ),
      lessonSeed(
        'tokenization-token-ids-vocabulary',
        'Token IDs and vocabulary',
        'Token IDs và vocabulary',
      ),
      lessonSeed(
        'tokenization-bpe-tiktoken',
        'BPE and tiktoken',
        'BPE và tiktoken',
      ),
      lessonSeed(
        'tokenization-special-tokens',
        'Special tokens',
        'Special tokens',
      ),
      lessonSeed(
        'tokenization-data-pipeline',
        'Tokenization pipeline',
        'Pipeline sau tokenization',
      ),
      lessonSeed(
        'token-counting-hand-quiz',
        'Token counting hand quiz',
        'Quiz tính token bằng tay',
      ),
      lessonSeed(
        'tokenizer-and-dataloader-code',
        'Tokenizer and dataloader code',
        'Code tokenizer và dataloader',
      ),
    ],
  },
  {
    id: 'attention-and-transformers-from-scratch',
    text: {
      title: { en: "1.3 Attention & Transformers From Scratch", vi: "1.3 Attention & Transformers From Scratch" },
      description: { en: "Causal masks, QKV shapes, attention scores, heads, and a minimal attention module.", vi: "Causal mask, shape QKV, attention score, head và module attention tối thiểu." },
    },
    lessonIds: [
      lessonSeed(
        'causal-self-attention-theory',
        'Causal self-attention theory',
        'Lý thuyết causal self-attention',
      ),
      lessonSeed(
        'attention-score-shape-calculation',
        'Attention score and shape calculation',
        'Tính score và shape attention',
      ),
      lessonSeed(
        'multi-head-attention-code',
        'Multi-head attention code',
        'Code multi-head attention',
      ),
    ],
  },
  {
    id: 'gpt-model-from-scratch',
    text: {
      title: { en: "1.4 GPT Model From Scratch", vi: "1.4 GPT Model From Scratch" },
      description: { en: "Decoder-only blocks, residual streams, normalization, MLPs, logits, and parameter checks.", vi: "Decoder-only block, residual stream, normalization, MLP, logits và kiểm tra parameter." },
    },
    lessonIds: [
      lessonSeed(
        'gpt-block-theory',
        'GPT block theory',
        'Lý thuyết GPT block',
      ),
      lessonSeed(
        'gpt-parameter-shape-calculation',
        'GPT parameter and shape calculation',
        'Tính parameter và shape của GPT',
      ),
      lessonSeed(
        'gpt-module-code',
        'GPT module code',
        'Code module GPT',
      ),
    ],
  },
  {
    id: 'pretraining-and-generation',
    text: {
      title: { en: "1.5 Pretraining & Generation", vi: "1.5 Pretraining & Generation" },
      description: { en: "Next-token loss, perplexity, training loops, checkpoints, and autoregressive generation.", vi: "Next-token loss, perplexity, training loop, checkpoint và generation autoregressive." },
    },
    lessonIds: [
      lessonSeed(
        'next-token-pretraining-theory',
        'Next-token pretraining theory',
        'Lý thuyết pretraining next-token',
      ),
      lessonSeed(
        'loss-perplexity-hand-calculation',
        'Loss and perplexity calculation',
        'Tính loss và perplexity',
      ),
      lessonSeed(
        'training-loop-and-generation-code',
        'Training loop and generation code',
        'Code training loop và generation',
      ),
    ],
  },
  {
    id: 'finetuning-and-alignment',
    text: {
      title: { en: "1.6 Fine-tuning & Alignment", vi: "1.6 Fine-tuning & Alignment" },
      description: { en: "Classification, instruction data, supervised fine-tuning, and preference-oriented thinking.", vi: "Classification, instruction data, supervised fine-tuning và tư duy theo preference." },
    },
    lessonIds: [
      lessonSeed(
        'finetuning-objectives-theory',
        'Fine-tuning objectives theory',
        'Lý thuyết objective fine-tuning',
      ),
      lessonSeed(
        'instruction-data-quality-quiz',
        'Instruction data quality quiz',
        'Quiz chất lượng instruction data',
      ),
      lessonSeed(
        'classification-and-instruction-finetune-code',
        'Classification and instruction fine-tune code',
        'Code fine-tune classification và instruction',
      ),
    ],
  },
  {
    id: 'llm-fundamentals',
    text: {
      title: { en: "2.1 LLM Fundamentals", vi: "2.1 LLM Fundamentals" },
      description: { en: "Scaled transformer architecture, inference internals, training methods, preferences, and scaling laws.", vi: "Kiến trúc transformer ở scale lớn, inference internals, training, preference learning và scaling laws." },
    },
    lessonIds: [
      'transformer-at-scale',
      'context-window-limits',
      'kv-cache-inference',
      'tokenization-at-scale',
      'llm-positional-encodings',
      'flash-attention',
      'grouped-query-attention',
      'sliding-window-attention',
      'llm-pretraining',
      'instruction-tuning',
      'rlhf',
      'constitutional-ai',
      'direct-preference-optimization',
      'scaling-laws',
    ],
  },
  {
    id: 'production-prompt-engineering',
    text: {
      title: { en: "2.2 Prompt Engineering", vi: "2.2 Prompt Engineering" },
      description: { en: "Prompt anatomy, prompting techniques, production constraints, injection defense, and prompt tools.", vi: "Cấu trúc prompt, kỹ thuật prompting, ràng buộc production, chống prompt injection và tooling." },
    },
    lessonIds: [
      'system-prompt',
      'user-prompt',
      'assistant-turn-history',
      'few-shot-examples',
      'zero-shot-prompting',
      'one-shot-few-shot-prompting',
      'chain-of-thought',
      'self-consistency',
      'react-prompting',
      'tree-of-thought',
      'structured-output-prompting',
      'role-prompting',
      'prompt-chaining',
      'clear-instruction-format-boundaries',
      'prompt-negative-instructions',
      'examples-output-constraints',
      'prompt-versioning-changelogs',
      'prompt-ab-testing',
      'prompt-compression',
      'prompt-injection-defense',
      'promptlayer-tracking',
      'langsmith-observability',
      'openai-playground',
      'anthropic-console',
    ],
  },
  {
    id: 'working-with-ai-apis',
    text: {
      title: { en: "2.3 Working with AI APIs", vi: "2.3 Working with AI APIs" },
      description: { en: "OpenAI, Anthropic, Gemini, Mistral, LLaMA, Ollama, and provider-specific API patterns.", vi: "OpenAI, Anthropic, Gemini, Mistral, LLaMA, Ollama và pattern API theo provider." },
    },
    lessonIds: [
      'chat-completions-api',
      'function-calling-tool-use',
      'json-mode-structured-outputs',
      'streaming-responses-sse',
      'embeddings-api',
      'vision-api-gpt4v',
      'assistants-api-file-search',
      'batch-api',
      'token-counting-tiktoken',
      'rate-limits-quotas',
      'anthropic-messages-api',
      'anthropic-system-prompts',
      'anthropic-long-context',
      'anthropic-vision-support',
      'anthropic-tool-use',
      'anthropic-streaming',
      'gemini-models',
      'gemini-multimodal-inputs',
      'gemini-search-grounding',
      'gemini-context-caching',
      'mistral-models',
      'mistral-function-calling',
      'mistral-json-mode',
      'ollama-open-source-models',
      'llama-3-models-api',
      'ollama-local-llama',
      'peft-finetuning-llama',
      'cohere-provider',
      'nvidia-nim',
      'groq-inference',
      'together-ai-hosting',
      'replicate-hosting',
    ],
  },
  {
    id: 'api-integration-patterns',
    text: {
      title: { en: "2.4 API Integration Patterns", vi: "2.4 API Integration Patterns" },
      description: { en: "Token limits, streaming, retries, queues, cost controls, caching, async work, and fallbacks.", vi: "Token limit, streaming, retry, queue, kiểm soát cost, cache, async work và fallback." },
    },
    lessonIds: [
      'count-tokens-before-sending',
      'truncation-strategies',
      'context-window-management',
      'conversation-summarization',
      'sse-streaming-chunks',
      'partial-response-handling',
      'client-stream-rendering',
      'perceived-latency',
      'exponential-backoff-jitter',
      'provider-quota-management',
      'queue-request-management',
      'circuit-breaker-pattern',
      'token-usage-logging',
      'model-routing-by-complexity',
      'prompt-compression-cost-control',
      'sha256-response-caching',
      'async-pipelines',
      'api-error-fallbacks',
    ],
  },
  {
    id: 'secure-api-integration',
    text: {
      title: { en: "2.5 Secure API Integration", vi: "2.5 Secure API Integration" },
      description: { en: "API key safety, backend proxies, per-user rate limits, key rotation, logging, and monitoring.", vi: "Bảo vệ API key, backend proxy, rate limit theo user, key rotation, logging và monitoring." },
    },
    lessonIds: [
      'no-frontend-api-keys',
      'env-files-secret-manager',
      'backend-proxy-pattern',
      'redis-per-user-rate-limits',
      'api-key-rotation',
      'logging-monitoring',
    ],
  },
];

export const learningTableOfContents = {
  id: 'llm-ai-engineering',
  text: {
    title: { en: "LLMs", vi: "LLMs" },
    description: { en: "Study LLMs from internals to product use: token data, causal attention, GPT blocks, logits, generation, fine-tuning, alignment, prompt engineering, API integration, streaming, cost, and security patterns.", vi: "Học LLM từ internals đến sản phẩm: dữ liệu token, causal attention, GPT block, logits, generation, fine-tuning, alignment, prompt engineering, tích hợp API, streaming, cost và security pattern." },
  },
  status: 'active',
  fallbackLocales: ['vi'],
  chapters,
  sectionKinds: ['theory', 'code'],
} satisfies LearningTableOfContents;

function lessonSeed(
  id: string,
  titleEn: string,
  titleVi: string,
  status?: LearningLessonStatus,
  contentStatus: LearningContentStatus = 'missing',
): LearningTocLessonSeed {
  if (contentStatus !== 'published') {
    return {
      id,
      title: { en: titleEn, vi: titleVi },
    };
  }

  return {
    id,
    title: { en: titleEn, vi: titleVi },
    status,
    contentStatus,
  };
}

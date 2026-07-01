import type { LearningLessonExtra } from '../../types.ts';
import { LLM_AI_ENGINEERING_REFERENCE_LINKS } from './references.ts';

export const llmFromScratchExtras: Record<string, LearningLessonExtra[]> = {
  'llm-from-scratch-roadmap': [
    motivation(
      'llm-roadmap-motivation',
      'llm-from-scratch-roadmap',
      'Tổng quan',
      'Trước khi bàn về các mô hình ngôn ngữ lớn, hãy cùng phân tách Artificial Intelligence (AI) và các lĩnh vực thành phần của nó theo phạm vi từ lớn đến nhỏ. Hãy tưởng tượng đây là những vòng tròn lồng vào nhau: vòng ngoài cùng rộng nhất, càng vào trong càng hẹp và càng chuyên biệt.',
      'Sơ đồ tổng quan các lĩnh vực AI từ phạm vi rộng đến chuyên biệt.',
    ),
    conceptInteraction(
      'what-is-llm',
      'llm-from-scratch-roadmap',
      'LLM là gì?',
      [
        'Khi bạn đặt câu hỏi với ChatGPT, bản chất là bạn đang đưa cho một mô hình LLM một đoạn văn bản mở đầu và nó sẽ dự đoán xem tiếp theo nên trả lời cho bạn như thế nào.',
        'LLM, viết tắt của Large Language Model, là một mô hình được huấn luyện để dự đoán token tiếp theo trong một chuỗi. Token có thể là một từ, một phần của từ, dấu câu, hoặc ký hiệu đặc biệt. Quá trình này lặp đi lặp lại nhiều lần cho đến khi mô hình tạo ra một câu, một đoạn văn, hoặc một câu trả lời hoàn chỉnh.',
      ],
      '',
      'Hình minh họa LLM nhận prompt, dự đoán token tiếp theo, rồi lặp lại để tạo câu trả lời. Hình ảnh sẽ được bổ sung sau.',
      'Tôi cảm thấy',
      'chọn một đáp án',
      [
        option('rất vui', true, 'Quá dễ hen. Về sau bạn sẽ thấy LLM không chỉ nối chữ theo bề mặt, mà còn học được nhiều pattern ngữ nghĩa từ rất nhiều ví dụ văn bản.'),
        option('chiếc bàn', false, 'Sao lại “chiếc bàn” được trời? Doesn\'t make any sense!!'),
        option('17.3', false, 'Lựa chọn táo bạo đấy, đủ để tụi mình cảm thấy bất ngờ. Chọn lại đi.'),
      ],
      sentenceBuilder(
        'Ghép thành một câu trả lời',
        'Tôi cảm thấy',
        [
          ['rất', 'vui', 'vì', 'hôm', 'nay', 'trời', 'đẹp'],
          ['admin', 'rất', 'đẹp', 'trai'],
        ],
        ['rất', 'chiếc', 'vui', 'admin', '17.3', 'vì', 'hôm', 'bàn', 'nay', 'trời', 'đẹp', 'trai', 'khá', 'ổn'],
        'Đúng rồi. Một câu trả lời dài cũng được tạo từ nhiều bước nhỏ như vậy. Đặc biệt nếu bạn chọn câu admin đẹp trai thì model này khá là có gu đấy.',
        'Sai nhịp rồi. Bấm hoàn tác hoặc làm lại, chứ câu này đang chuẩn bị đi du lịch hơi xa.',
      ),
    ),
    conceptPanel('why-large', 'llm-from-scratch-roadmap', 'Tại sao gọi là Large Language Model?', {
      emphasis: 'Large',
      body: [
        'Chữ Large chủ yếu nói về quy mô: nhiều tham số hơn, nhiều dữ liệu hơn, và quá trình train tốn nhiều compute hơn.',
      ],
      highlights: [
        ['Params', 'Số tham số', 'GPT-2 có 117M tham số; các model hiện đại có thể lên tới hàng trăm tỷ hoặc hơn.'],
        ['Data', 'Dữ liệu', 'Training thường cần lượng văn bản rất lớn, từ hàng chục đến hàng trăm GB hoặc hơn.'],
        ['Compute', 'Thời gian train', 'Một model lớn có thể train nhiều ngày hoặc nhiều tuần trên cluster GPU.'],
      ],
      bodyAfter: [
        'Quy mô lớn, nhưng kiến thức cơ bản đều giống nhau. Trong course này, mục tiêu là hiểu rõ từng cơ chế và tự build một phiên bản nhỏ GPT-mini.',
      ],
    }),
    conceptPanel('course-section-roadmap', 'llm-from-scratch-roadmap', 'Roadmap domain LLM & AI Engineering', {
      outline: [
        ['LLM from scratch', 'Phần nền tảng nhất: hiểu cách text được biến thành dữ liệu học, sau đó ghép dần thành một GPT mini có thể train và generate.', [
          ['Orientation', 'Nhìn toàn cảnh LLM gồm những mảnh nào và mỗi mảnh nối với nhau ra sao.'],
          ['Text data & tokenization', 'Biến văn bản thành các mảnh nhỏ để model có thể xử lý bằng số.'],
          ['Attention & Transformers', 'Hiểu cơ chế giúp model đọc ngữ cảnh trước đó khi dự đoán phần tiếp theo.'],
          ['GPT model', 'Ghép embedding, attention, MLP và output head thành một model GPT mini.'],
          ['Pretraining & generation', 'Train model bằng next-token loss rồi dùng nó để sinh văn bản từng bước.'],
          ['Fine-tuning & alignment', 'Điều chỉnh model cho task cụ thể hơn bằng dữ liệu và objective phù hợp.'],
        ]],
        ['LLM fundamentals', 'Các khái niệm nền để hiểu model lớn trong thực tế vận hành như thế nào.', [
          ['Scale & context', 'Transformer at scale, context window, KV cache và các giới hạn khi context dài.'],
          ['Attention variants', 'Flash attention, grouped-query attention và sliding-window attention.'],
          ['Training & alignment', 'Pretraining, instruction tuning, RLHF, DPO và scaling laws.'],
        ]],
        ['Production prompt engineering', 'Cách viết, tổ chức và kiểm soát prompt khi đưa LLM vào sản phẩm.', [
          ['Prompt structure', 'System prompt, user prompt, history, examples và output constraints.'],
          ['Reasoning patterns', 'Few-shot, chain-of-thought, ReAct, self-consistency và prompt chaining.'],
          ['Prompt operations', 'Versioning, A/B testing, compression, injection defense và observability.'],
        ]],
        ['Working with AI APIs', 'Làm việc với provider thật: gọi model, stream output, dùng tool và xử lý multimodal.', [
          ['OpenAI-style APIs', 'Chat completions, function calling, structured outputs, streaming và embeddings.'],
          ['Provider differences', 'Anthropic, Gemini, Mistral, Llama, Ollama và các hosted inference provider.'],
          ['Practical limits', 'Token counting, rate limits, quota và batch/caching khi gọi API.'],
        ]],
        ['Integration & security', 'Những pattern cần có để app dùng LLM ổn định, tiết kiệm và an toàn hơn.', [
          ['Reliability patterns', 'Retry, queue, circuit breaker, fallback và partial response handling.'],
          ['Cost & latency control', 'Model routing, prompt compression, caching và usage logging.'],
          ['Secure integration', 'Không để API key ở frontend, backend proxy, rate limit và key rotation.'],
        ]],
      ],
    }),
    conceptPanel('llm-main-references', 'llm-from-scratch-roadmap', 'Nguồn tham khảo chính', {
      links: LLM_AI_ENGINEERING_REFERENCE_LINKS.map(({ label, href }) => [label, href]),
    }),
  ],
  'llm-component-checkpoint-quiz': [
    exercise('component-shape-check', 'llm-component-checkpoint-quiz-calculation', 'Bài tập shape component', 'Dùng B = 4, T = 8, C = 64, V = 1000 để kiểm tra pipeline.', [
      'Token ids có shape nào?',
      'Embedding sau lookup có shape nào?',
      'Logits cuối model có shape nào?',
    ], 'Đáp án: token ids `(4, 8)`, embedding `(4, 8, 64)`, logits `(4, 8, 1000)`.'),
  ],
  'minimal-llm-project-skeleton': [
    codeContract('project-skeleton-contract', 'minimal-llm-project-skeleton-code', 'Contract skeleton project', 'Config nhỏ, text mẫu, vocab size, context window, model dimension.', 'Các module tách riêng: config, dataset, model, train, generate.', 'Mỗi module có input/output rõ; chưa chạy training thật.'),
  ],
  'tokenization-theory-from-scratch': [
    diagram('tokenization-pipeline', 'tokenization-theory-from-scratch', {
      variant: 'pipeline',
      title: loc('Text đi vào model như thế nào'),
      steps: ['raw text', 'tokens', 'special tokens', 'token ids', 'token embeddings', 'positional embeddings', 'sequence tensor'].map(loc),
    }),
    exercise('special-token-check', 'tokenization-theory-from-scratch', 'Checkpoint special token', 'Dùng các special tokens được reference nêu để kiểm tra dữ liệu trước khi train.', [
      'Khi nào dùng `<|endoftext|>` thay vì `[EOS]`?',
      'Nếu batch có padding, token padding có nên góp loss không?',
      'Vì sao BPE giảm nhu cầu dùng `<|unk|>` cho từ lạ?',
    ], 'Đáp án mong đợi: `<|endoftext|>` tách nguồn text độc lập; padding nên được mask khỏi loss; BPE bẻ từ lạ thành subword/ký tự thay vì thay bằng unknown token.'),
  ],
  'token-counting-hand-quiz': [
    diagram('sliding-window-example', 'token-counting-hand-quiz-calculation', {
      variant: 'sliding-window',
      title: loc('Sliding window input-target'),
      tokens: ['10', '23', '44', '7', '8', '9', '2'],
      windows: [
        { input: ['10', '23', '44', '7'], target: ['23', '44', '7', '8'] },
        { input: ['23', '44', '7', '8'], target: ['44', '7', '8', '9'] },
        { input: ['44', '7', '8', '9'], target: ['7', '8', '9', '2'] },
      ],
    }),
    exercise('token-counting-answer', 'token-counting-hand-quiz-calculation', 'Bài tập token window', 'Với token ids `[10, 23, 44, 7, 8, 9, 2]`, context window 4, stride 1.', [
      'Liệt kê tất cả input-target pairs.',
      'Nếu batch gom 3 window, input tensor có shape nào?',
      'Nếu vocab size là 50, logits có shape nào?',
    ], 'Đáp án: 3 pairs; input `(3, 4)`; logits `(3, 4, 50)`.'),
  ],
  'tokenizer-and-dataloader-code': [
    codeContract('tokenizer-dataloader-contract', 'tokenizer-and-dataloader-code-code', 'Contract tokenizer + dataloader', 'Text nhỏ và vocabulary học từ corpus mẫu.', 'Token ids, sliding windows, batch `(B, T)` cho input và target.', 'Decode vài sample để thấy target lệch input đúng một token.'),
  ],
  'causal-self-attention-theory': [
    formula('attention-formula', 'causal-self-attention-theory', 'Scaled dot-product attention', String.raw`\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V`, 'Mask `M` đặt vị trí tương lai thành số rất âm trước softmax.'),
    diagram('causal-mask-small', 'causal-self-attention-theory', {
      variant: 'matrix',
      title: loc('Causal mask cho T = 4'),
      columns: ['0', '1', '2', '3'],
      rows: [
        { label: '0', cells: ['target', 'blocked', 'blocked', 'blocked'] },
        { label: '1', cells: ['allowed', 'target', 'blocked', 'blocked'] },
        { label: '2', cells: ['allowed', 'allowed', 'target', 'blocked'] },
        { label: '3', cells: ['allowed', 'allowed', 'allowed', 'target'] },
      ],
      legend: loc('Ô x bị chặn trước softmax; ô * là vị trí token tự đọc chính nó.'),
    }),
  ],
  'attention-score-shape-calculation': [
    diagram('qkv-shape-flow', 'attention-score-shape-calculation-calculation', {
      variant: 'shape-flow',
      title: loc('Q/K/V shape flow'),
      steps: [
        { label: loc('Embedding input'), shape: '(B, T, C) = (2, 4, 8)' },
        { label: loc('Tách head'), shape: '(B, H, T, D) = (2, 2, 4, 4)' },
        { label: loc('Score Q @ K^T'), shape: '(B, H, T, T) = (2, 2, 4, 4)' },
        { label: loc('Context per head'), shape: '(B, H, T, D) = (2, 2, 4, 4)' },
        { label: loc('Ghép head'), shape: '(B, T, C) = (2, 4, 8)' },
      ],
    }),
    exercise('attention-shape-answer', 'attention-score-shape-calculation-calculation', 'Bài tập attention shape', 'Cho B = 2, T = 4, C = 8, H = 2.', [
      'Tính D cho mỗi head.',
      'Tính shape của Q, K, V sau khi tách head.',
      'Tính shape của attention score.',
    ], 'Đáp án: D = 4; Q/K/V `(2, 2, 4, 4)`; score `(2, 2, 4, 4)`.'),
  ],
  'multi-head-attention-code': [
    codeContract('mha-code-contract', 'multi-head-attention-code-code', 'Contract multi-head attention', 'Tensor embedding `(B, T, C)` và causal mask theo T.', 'Tensor output `(B, T, C)` để cộng residual.', 'Attention weights từng hàng cộng xấp xỉ 1 và không token nào nhìn tương lai.'),
    exercise('attention-dropout-check', 'multi-head-attention-code-code', 'Checkpoint attention dropout', 'Reference gist áp dropout sau khi có attention weights trong ví dụ causal attention.', [
      'Dropout chạy ở training hay eval?',
      'Nếu dropout zero một số attention weights, output shape có đổi không?',
      'Khi generate text, vì sao cần `model.eval()`?',
    ], 'Đáp án: dropout chỉ dùng khi training; output shape không đổi; `model.eval()` tắt dropout để generation không bị random bởi training regularization.'),
  ],
  'gpt-block-theory': [
    diagram('gpt-block-pipeline', 'gpt-block-theory', {
      variant: 'pipeline',
      title: loc('Một GPT block giữ nguyên shape'),
      steps: ['x', 'LayerNorm', 'Causal attention', 'Residual', 'LayerNorm', 'MLP', 'Residual'].map(loc),
    }),
    formula('layernorm-formula', 'gpt-block-theory', 'LayerNorm trên chiều channel', String.raw`\operatorname{LayerNorm}(x)=\gamma\frac{x-\mu}{\sqrt{\sigma^2+\epsilon}}+\beta`, 'Mean và variance được tính trên feature/channel của từng vị trí token.'),
  ],
  'gpt-parameter-shape-calculation': [
    formula('gpt-param-formula', 'gpt-parameter-shape-calculation-calculation', 'Đếm parameter GPT nhỏ', String.raw`N \approx VC + TC + L(4C^2 + 8C^2) + CV`, 'Bỏ qua bias và LayerNorm để tập trung vào các ma trận lớn.'),
    exercise('gpt-param-answer', 'gpt-parameter-shape-calculation-calculation', 'Bài tập parameter', 'Cho V = 1000, T = 16, C = 64, L = 2, H = 4.', [
      'Tính token embedding parameter.',
      'Tính positional embedding parameter.',
      'Tính shape logits khi B = 8.',
    ], 'Đáp án: token embedding 64,000; positional embedding 1,024; logits `(8, 16, 1000)`.'),
  ],
  'gpt-module-code': [
    codeContract('gpt-module-contract', 'gpt-module-code-code', 'Contract GPT module', 'Batch token ids `(B, T)`.', 'Logits `(B, T, vocab_size)`.', 'Model chỉ nhận token ids và trả logits; loss thuộc training loop.'),
  ],
  'next-token-pretraining-theory': [
    diagram('next-token-pipeline', 'next-token-pretraining-theory', {
      variant: 'pipeline',
      title: loc('Next-token training loop'),
      steps: ['input window', 'GPT logits', 'target shifted right', 'cross-entropy', 'optimizer step'].map(loc),
    }),
  ],
  'loss-perplexity-hand-calculation': [
    formula('cross-entropy-formula', 'loss-perplexity-hand-calculation-calculation', 'Cross-entropy và perplexity', String.raw`\mathcal{L}=-\frac{1}{N}\sum_{i=1}^{N}\log p_i,\qquad \operatorname{PPL}=e^{\mathcal{L}}`, '`p_i` là xác suất model gán cho target token đúng ở vị trí i.'),
    exercise('loss-ppl-answer', 'loss-perplexity-hand-calculation-calculation', 'Bài tập loss/perplexity', 'Cho xác suất target đúng lần lượt là 0.5, 0.25, 0.125.', [
      'Tính loss từng token bằng log tự nhiên.',
      'Tính loss trung bình.',
      'Tính perplexity bằng `exp(loss)`.',
    ], 'Đáp án gần đúng: loss trung bình 1.386; perplexity 4.0.'),
  ],
  'training-loop-and-generation-code': [
    codeContract('training-generation-contract', 'training-loop-and-generation-code-code', 'Contract train + generate', 'Batch `(x, y)` từ dataloader hoặc prompt token ids khi generate.', 'Train step trả loss scalar; generation trả token ids mới.', 'Training dùng target/loss; generation chỉ dùng logits cuối và không có target.'),
    exercise('decoding-checkpoint', 'training-loop-and-generation-code-code', 'Checkpoint decoding', 'Cho logits `[4.51, 0.89, -1.90, 6.75, 1.63, -1.62, -1.89, 6.28, 1.79]` với vocab id 3 là `forward` và id 7 là `toward`.', [
      'Greedy decoding chọn id nào?',
      'Temperature lớn hơn 1 làm phân phối sắc hơn hay đều hơn?',
      'Top-k với k = 3 giữ lại bao nhiêu token ứng viên trước softmax?',
    ], 'Đáp án: greedy chọn id 3 vì logit 6.75 lớn nhất; temperature > 1 làm phân phối đều hơn; top-k giữ 3 token có logit cao nhất.'),
    exercise('training-bells-placeholder', 'training-loop-and-generation-code-code', 'Placeholder bổ sung: training bells', 'Reference có giải thích warmup, cosine decay, gradient clipping, và AdamW checkpoint. Course hiện tại chưa có lab riêng cho các kỹ thuật này.', [
      'Cần bổ sung bài tập tính learning-rate warmup.',
      'Cần bổ sung visual cosine decay theo step.',
      'Cần bổ sung bài tính gradient norm trước/sau clipping.',
    ], 'Giữ ở dạng placeholder vì triển khai đúng cần một training-loop lab riêng, không nằm trong pass metadata hiện tại.'),
  ],
  'finetuning-objectives-theory': [
    diagram('finetuning-objective-flow', 'finetuning-objectives-theory', {
      variant: 'pipeline',
      title: loc('Fine-tuning thay đổi dữ liệu và objective'),
      steps: ['base model', 'task data', 'loss mask / head', 'fine-tuned behavior', 'evaluation'].map(loc),
    }),
  ],
  'instruction-data-quality-quiz': [
    exercise('instruction-data-quality-check', 'instruction-data-quality-quiz-calculation', 'Quiz chất lượng instruction data', 'Lấy 5 prompt-response pairs và gắn nhãn lỗi dữ liệu.', [
      'Pair nào có instruction mơ hồ?',
      'Pair nào sai format so với prompt?',
      'Pair nào bị leaky evaluation hoặc thiếu refusal cần thiết?',
    ], 'Checkpoint tốt: mỗi lỗi phải gắn với hành vi model sẽ học sai, không chỉ nhận xét chung chung.'),
  ],
  'classification-and-instruction-finetune-code': [
    codeContract('finetune-code-contract', 'classification-and-instruction-finetune-code-code', 'Contract fine-tuning code', 'Batch classification hoặc batch prompt-response đã format.', 'Classification logits trên class hoặc next-token logits cho response.', 'Khác biệt chính nằm ở collator, target, metric, và loss mask.'),
    exercise('instruction-mask-check', 'classification-and-instruction-finetune-code-code', 'Bài tập instruction loss mask', 'Với target `[6, 50256, 50256, 50256]`, collator muốn giữ token kết thúc đầu tiên nhưng bỏ qua padding sau đó.', [
      'Target sau khi thay padding bằng ignore index là gì?',
      'PyTorch `cross_entropy` mặc định bỏ qua label nào?',
      'Vì sao không thay toàn bộ `50256` bằng `-100`?',
    ], 'Đáp án: `[6, 50256, -100, -100]`; ignore index mặc định là `-100`; giữ `50256` đầu tiên để model học tín hiệu response kết thúc.'),
    exercise('lora-placeholder', 'classification-and-instruction-finetune-code-code', 'Placeholder bổ sung: LoRA', 'Reference có phần LoRA: giữ weight gốc và học hai ma trận nhỏ A, B để xấp xỉ cập nhật weight.', [
      'Cần bổ sung formula `W_updated = W + AB` bằng KaTeX.',
      'Cần bổ sung shape exercise cho A, B và rank r.',
      'Cần bổ sung code contract riêng cho thay Linear bằng LinearWithLoRA.',
    ], 'Giữ placeholder vì LoRA là appendix/extension, không thuộc 18 lesson lõi đã scope ban đầu.'),
  ],
};


function loc(value: string) {
  return { en: value, vi: value };
}

function diagram(
  id: string,
  sectionRefId: string,
  diagram: Extract<LearningLessonExtra, { kind: 'diagram' }>['diagram'],
): LearningLessonExtra {
  return { kind: 'diagram', id, sectionRefId, diagram };
}

function motivation(
  id: string,
  sectionRefId: string,
  title: string,
  body: string,
  imageAlt: string,
): LearningLessonExtra {
  return {
    kind: 'motivation',
    id,
    sectionRefId,
    title: loc(title),
    image: 'ai-overview',
    imageAlt: loc(imageAlt),
    body: loc(body),
  };
}

function formula(
  id: string,
  sectionRefId: string,
  title: string,
  latex: string,
  note: string,
): LearningLessonExtra {
  return { kind: 'formula', id, sectionRefId, title: loc(title), latex, note: loc(note) };
}

function exercise(
  id: string,
  sectionRefId: string,
  title: string,
  prompt: string,
  tasks: string[],
  answer: string,
): LearningLessonExtra {
  return { kind: 'exercise', id, sectionRefId, title: loc(title), prompt: loc(prompt), tasks: tasks.map(loc), answer: loc(answer) };
}

function conceptInteraction(
  id: string,
  sectionRefId: string,
  title: string,
  body: string[],
  note: string,
  imageAlt: string,
  prompt: string,
  blankLabel: string,
  options: Array<{ label: string; isCorrect?: boolean; feedback: string }>,
  builder?: Extract<LearningLessonExtra, { kind: 'conceptInteraction' }>['sentenceBuilder'],
): LearningLessonExtra {
  return {
    kind: 'conceptInteraction',
    id,
    sectionRefId,
    title: loc(title),
    body: body.map(loc),
    note: loc(note),
    imageAlt: loc(imageAlt),
    image: 'llm-predict',
    prompt: loc(prompt),
    blankLabel: loc(blankLabel),
    options: options.map((item) => ({
      label: loc(item.label),
      isCorrect: item.isCorrect,
      feedback: loc(item.feedback),
    })),
    sentenceBuilder: builder,
  };
}

function option(label: string, isCorrect: boolean, feedback: string) {
  return { label, isCorrect, feedback };
}

function conceptPanel(
  id: string,
  sectionRefId: string,
  title: string,
  config: {
    emphasis?: string;
    body?: string[];
    bodyAfter?: string[];
    highlights?: string[][];
    table?: {
      columns: string[];
      rows: string[][];
    };
    steps?: string[][];
    outline?: Array<[string, string, string[][]]>;
    bullets?: string[];
    links?: string[][];
  },
): LearningLessonExtra {
  return {
    kind: 'conceptPanel',
    id,
    sectionRefId,
    title: loc(title),
    emphasis: config.emphasis ? loc(config.emphasis) : undefined,
    body: config.body?.map(loc),
    bodyAfter: config.bodyAfter?.map(loc),
    highlights: config.highlights?.map((item) => ({
      shortName: loc(item[0]),
      fullName: loc(item[1]),
      description: loc(item[2]),
    })),
    table: config.table
      ? {
          columns: config.table.columns.map(loc),
          rows: config.table.rows.map((row) => ({ cells: row.map(loc) })),
        }
      : undefined,
    steps: config.steps?.map((step) => ({ title: loc(step[0]), body: loc(step[1]) })),
    outline: config.outline?.map((group) => ({
      title: loc(group[0]),
      body: loc(group[1]),
      items: group[2].map((item) => ({ title: loc(item[0]), body: loc(item[1]) })),
    })),
    bullets: config.bullets?.map(loc),
    links: config.links?.map((link) => ({ label: loc(link[0]), href: link[1] })),
  };
}

function sentenceBuilder(
  title: string,
  prompt: string,
  targets: string[][],
  choices: string[],
  success: string,
  error: string,
) {
  return {
    title: loc(title),
    prompt: loc(prompt),
    targets: targets.map((target) => target.map(loc)),
    choices: choices.map(loc),
    success: loc(success),
    error: loc(error),
  };
}

function codeContract(
  id: string,
  sectionRefId: string,
  title: string,
  input: string,
  output: string,
  observe: string,
): LearningLessonExtra {
  return { kind: 'codeContract', id, sectionRefId, title: loc(title), input: loc(input), output: loc(output), observe: loc(observe) };
}

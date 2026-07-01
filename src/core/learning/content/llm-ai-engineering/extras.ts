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
};

function loc(value: string) {
  return { en: value, vi: value };
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
    image: 'llm-from-scratch-roadmap.ai-hierarchy',
    imageAlt: loc(imageAlt),
    body: loc(body),
  };
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
    image: 'llm-from-scratch-roadmap.next-token-loop',
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
    outline?: Array<[string, string, string[][]]>;
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
    outline: config.outline?.map((group) => ({
      title: loc(group[0]),
      body: loc(group[1]),
      items: group[2].map((item) => ({ title: loc(item[0]), body: loc(item[1]) })),
    })),
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

import type { LearningLessonExtra, LearningTokenExample } from '../../types.ts';
import { LLM_AI_ENGINEERING_REFERENCE_LINKS } from './references.ts';

export const llmFromScratchExtras: Record<string, LearningLessonExtra[]> = {
  'llm-data-pipeline-overview': [
    conceptPanel('llm-training-lifecycle', 'llm-data-pipeline-overview', 'Quy trình chung để tạo LLM', {
      body: [
        'Một LLM thường được tạo qua hai giai đoạn lớn.',
        'Pretraining là giai đoạn ban đầu, khi model học trên tập dữ liệu lớn và đa dạng để hình thành hiểu biết rộng về ngôn ngữ.',
        'Fine-tuning dùng model đã pretrain làm nền tảng, rồi huấn luyện thêm trên dữ liệu hẹp hơn cho một tác vụ hoặc lĩnh vực cụ thể.',
      ],
      highlights: [
        ['Pretraining', 'Pretraining', ''],
        ['Fine-tuning', 'Fine-tuning', ''],
      ],
    }),
    conceptPanel('transformer-translation-step-1', 'llm-data-pipeline-overview', 'Bước 1:', {
      body: [
        'Tất cả đều dựa trên Transformer, kiến trúc được giới thiệu trong bài báo năm 2017 "Attention Is All You Need".',
        'Transformer ban đầu được dùng để dịch ngôn ngữ và có hai khối chính:',
        'Encoder: đọc câu gốc và biến nó thành dạng số để máy có thể xử lý.',
        'Decoder: dùng thông tin từ encoder để viết câu dịch, từng token một.',
      ],
      links: [
        ['Paper: Attention Is All You Need', 'https://arxiv.org/abs/1706.03762'],
      ],
    }),
    conceptPanel('transformer-translation-step-2', 'llm-data-pipeline-overview', 'Bước 2: Chuẩn bị input cho encoder', {
      body: [
        'Câu nguồn không đi thẳng vào mạng nơ-ron dưới dạng chữ.',
        '- Nó sẽ được tách thành các token.',
        '- Mỗi token được quy đổi thành một con số tương ứng gọi là token id.',
        '- Một con số đơn lẻ không thể đại diện đủ cho ý nghĩa của token, nên token id sẽ được biến đổi thành một vector gọi là token embedding. Lúc này model mới biết input có những thông tin gì, tuy nhiên chưa phân biệt được các token đang đứng ở vị trí nào trong câu.',
        '- Positional embedding được cộng thêm để encoder biết cả nội dung lẫn vị trí của từng token.',
      ],
    }),
    conceptPanel('transformer-translation-step-3', 'llm-data-pipeline-overview', 'Bước 3: Encoder đọc toàn bộ câu nguồn', {
      body: [
        'Encoder có quyền nhìn toàn bộ câu nguồn "Anh trai vượt ngàn chông gai" để tạo representation có ngữ cảnh cho từng vị trí.',
      ],
    }),
    conceptPanel('transformer-translation-step-4', 'llm-data-pipeline-overview', 'Bước 4: Encoder trả embedding vector cho decoder', {
      body: [
        'Đến bước này, encoder đã tạo ra chuỗi embedding vector cho câu nguồn. Mỗi vector không chỉ mang thông tin mã hóa về một token, mà còn chứa ngữ cảnh từ các token khác trong câu. Decoder sẽ dùng chuỗi vector này để hiểu câu nguồn và tạo bản dịch từng token một.',
      ],
    }),
    conceptPanel('transformer-translation-step-5', 'llm-data-pipeline-overview', 'Bước 5: Decoder nhận câu đã dịch một phần', {
      body: [
        'Ở giai đoạn cuối của ví dụ, decoder đã có "披荆斩棘的__" và cần điền token/từ tiếp theo.',
      ],
    }),
    conceptPanel('transformer-translation-step-6', 'llm-data-pipeline-overview', 'Bước 6: Chuẩn bị input cho decoder', {
      body: [
        'Phần output đã có cũng đi qua cùng kiểu chuẩn bị: tách token, đổi thành token ids, tra embedding và cộng positional embedding trước khi vào decoder.',
      ],
    }),
    conceptPanel('transformer-translation-step-7', 'llm-data-pipeline-overview', 'Bước 7: Decoder sinh từng từ', {
      body: [
        'Decoder dùng context từ encoder và phần câu đích đã có để dự đoán từ tiếp theo. Trong ví dụ này, từ cần sinh là "哥哥".',
      ],
    }),
    conceptPanel('transformer-translation-step-8', 'llm-data-pipeline-overview', 'Bước 8: Hoàn thành bản dịch', {
      body: [
        'Sau khi token mới được sinh và ghép vào câu, bản dịch trở thành "披荆斩棘的哥哥".',
      ],
    }),
  ],
  'llm-data-pipeline-checkpoint-quiz': [
    quiz('llm-data-pipeline-checkpoint-quiz', 'llm-data-pipeline-checkpoint-quiz', 'Quiz kiểm tra nhanh', [
      {
        id: 'pretraining-facts',
        title: 'Chọn các ý đúng về Pretraining',
        prompt: '',
        mode: 'multi',
        options: [
          ['pretraining-initial-stage', 'Là giai đoạn ban đầu.', true],
          ['pretraining-large-data', 'Model học trên tập dữ liệu lớn và đa dạng.', true],
          ['pretraining-broad-language', 'Giúp model hình thành hiểu biết rộng về ngôn ngữ.', true],
          ['pretraining-narrow-task', 'Chỉ học trên dữ liệu hẹp cho một tác vụ cụ thể.', false],
        ],
        success: 'Đúng. Pretraining là giai đoạn đầu, dùng dữ liệu lớn và đa dạng để tạo nền hiểu biết rộng.',
        error: 'Chưa đúng. Hãy nhớ pretraining là giai đoạn đầu và học trên dữ liệu lớn, đa dạng.',
      },
      {
        id: 'finetuning-facts',
        title: 'Chọn các ý đúng về Fine-tuning',
        prompt: '',
        mode: 'multi',
        options: [
          ['finetuning-from-pretrained', 'Dùng model đã pretrain làm nền tảng.', true],
          ['finetuning-narrow-data', 'Huấn luyện thêm trên dữ liệu hẹp hơn.', true],
          ['finetuning-specific-purpose', 'Nhắm tới một tác vụ hoặc lĩnh vực cụ thể.', true],
          ['finetuning-first-stage', 'Là giai đoạn đầu tiên để model học ngôn ngữ từ đầu.', false],
        ],
        success: 'Đúng. Fine-tuning lấy model đã pretrain rồi huấn luyện thêm cho mục tiêu hẹp hơn.',
        error: 'Chưa đúng. Fine-tuning không bắt đầu từ đầu; nó dùng model đã pretrain làm nền.',
      },
      {
        id: 'training-stage-task-match',
        title: 'Kéo từng ví dụ vào đúng giai đoạn tương ứng.',
        prompt: '',
        mode: 'categorize',
        hideUnsortedLabel: true,
        completeLabel: 'Tất cả ví dụ đã được kéo vào nhóm.',
        categories: [
          ['pretraining', 'Pretraining'],
          ['fine-tuning', 'Fine-tuning'],
        ],
        options: [
          ['pretraining-large-corpus', 'Học từ một corpus lớn gồm nhiều loại văn bản.', 'pretraining'],
          ['pretraining-general-language', 'Học các pattern ngôn ngữ chung.', 'pretraining'],
          ['finetuning-chat-format', 'Huấn luyện thêm để trả lời theo format chat.', 'fine-tuning'],
          ['finetuning-domain-support', 'Huấn luyện thêm cho dữ liệu customer support.', 'fine-tuning'],
        ],
        success: 'Đúng. Pretraining tạo nền rộng; fine-tuning điều chỉnh nền đó cho task hoặc lĩnh vực cụ thể.',
        error: 'Chưa đúng. Ví dụ dữ liệu lớn, đa dạng thuộc pretraining; ví dụ huấn luyện thêm cho mục tiêu hẹp thuộc fine-tuning.',
      },
      {
        id: 'transformer-main-blocks',
        title: 'Chọn một đáp án',
        prompt: 'Trong Transformer ban đầu dùng cho dịch ngôn ngữ, có mấy block chính và chúng dùng để làm gì?',
        mode: 'single',
        options: [
          ['encoder-decoder', 'Có 2 block chính: Encoder đọc câu gốc và biến nó thành dạng số để máy xử lý; Decoder dùng thông tin từ encoder để viết câu dịch từng token một.', true],
          ['tokenizer-only', 'Có 1 block chính: Tokenizer đọc câu gốc và trực tiếp viết câu dịch hoàn chỉnh.', false],
          ['training-stages', 'Có 2 block chính: Pretraining học dữ liệu lớn và Fine-tuning học dữ liệu hẹp hơn.', false],
          ['input-prep-blocks', 'Có 3 block chính: Token id, Embedding, và Positional embedding, mỗi block tự sinh ra một phần bản dịch.', false],
        ],
        success: 'Đúng. Transformer dịch máy ban đầu có hai block chính: encoder đọc câu nguồn, decoder viết câu dịch từng token một.',
        error: 'Chưa đúng. Ở slide này, hai block chính cần nhớ là Encoder và Decoder.',
      },
      {
        id: 'encoder-input-prep-order',
        title: 'Sắp xếp thứ tự',
        prompt: 'Sắp xếp pipeline chuẩn bị input cho encoder',
        mode: 'order',
        options: [
          ['token-embedding', 'Token id -> token embedding'],
          ['tokenize', 'Tách câu thành token'],
          ['positional-embedding', 'Cộng positional embedding'],
          ['token-id', 'Token -> token id'],
        ],
        correctOrder: ['tokenize', 'token-id', 'token-embedding', 'positional-embedding'],
        success: 'Đúng. Text phải thành token, token id, token embedding, rồi mới thêm thông tin vị trí.',
        error: 'Chưa đúng thứ tự. Hãy đi từ chữ người đọc được sang vector mà encoder xử lý.',
      },
      {
        id: 'why-position-embedding',
        title: 'Chọn một đáp án',
        prompt: 'Vì sao cần positional embedding?',
        mode: 'single',
        options: [
          ['position', 'Vì token embedding cho biết token là gì, nhưng chưa cho biết token đứng ở vị trí nào trong câu.', true],
          ['translate-directly', 'Vì positional embedding tự dịch câu nguồn sang câu đích.', false],
          ['replace-tokenizer', 'Vì positional embedding thay thế tokenizer.', false],
          ['remove-encoder', 'Vì positional embedding làm encoder không còn cần thiết.', false],
        ],
        success: 'Đúng. Positional embedding bổ sung thông tin thứ tự/vị trí cho token embedding.',
        error: 'Chưa đúng. Token embedding nói về nội dung token; positional embedding thêm vị trí của token.',
      },
    ]),
  ],
  'llm-from-scratch-roadmap': [
    motivation(
      'llm-roadmap-motivation',
      'llm-from-scratch-roadmap',
      'Tổng quan',
      [
        'Trước khi bàn về các mô hình ngôn ngữ lớn, hãy cùng phân tách Artificial Intelligence (AI) và các lĩnh vực thành phần của nó theo phạm vi từ lớn đến nhỏ.',
        'Hãy tưởng tượng đây là những vòng tròn lồng vào nhau: vòng ngoài cùng rộng nhất, càng vào trong càng hẹp và càng chuyên biệt.',
      ],
      'Sơ đồ tổng quan các lĩnh vực AI từ phạm vi rộng đến chuyên biệt.',
      aiHierarchy(),
    ),
    conceptPanel('why-split-ai-fields', 'llm-from-scratch-roadmap', 'Vì sao cần chia như vậy?', {
      body: [
        'Khi bài toán khác nhau, dữ liệu đầu vào, cách đánh giá, mô hình phù hợp, lỗi thường gặp và công cụ làm việc cũng khác nhau. Chọn một nhánh phù hợp với sở thích và thế mạnh giúp bạn học đúng kỹ năng thay vì gom mọi thứ vào một chữ AI rất rộng.',
      ],
      comparisonTable: {
        columns: ['Nhánh', 'Bài toán thường gặp', 'Công cụ / mô hình', 'Kỹ năng & công việc'],
        rows: [
          ['ML', 'Dự đoán churn, scoring tín dụng, phân cụm khách hàng, dự báo nhu cầu.', 'Scikit-learn, XGBoost, LightGBM, feature store, tabular pipelines.', 'Feature engineering, metrics, experiment tracking; ML Engineer, Data Scientist.'],
          ['CV', 'Nhận diện vật thể, phân loại ảnh, OCR, kiểm tra lỗi sản phẩm bằng camera.', 'CNN, ViT, YOLO, augmentation, OpenCV, labeling tools.', 'Xử lý ảnh/video, dataset labeling, deployment edge; Computer Vision Engineer.'],
          ['LLM', 'Chatbot, summarization, RAG search, extraction, coding assistant, agent workflow.', 'Tokenizer, Transformer, embedding, vector database, prompt/tool calling APIs.', 'Tokenization, context, prompting, evaluation, serving; LLM Engineer, AI Product Engineer.'],
        ],
      },
      bodyAfter: [
        'Với sinh viên mới ra trường, việc tìm hiểu doanh nghiệp đang giải bài toán gì trước khi apply rất quan trọng. Nếu bạn hiểu domain của họ và điều chỉnh CV, project, cách kể kinh nghiệm theo đúng bài toán đó, cơ hội mở ra những cuộc trò chuyện chất lượng sẽ cao hơn rất nhiều.',
      ],
    }),
    conceptInteraction(
      'what-is-llm',
      'llm-from-scratch-roadmap',
      'Large Language Model là gì?',
      [
        'Các mô hình ngôn ngữ lớn (Large Language Models - LLM), chẳng hạn như những mô hình đứng sau ChatGPT, là các mô hình mạng nơ-ron sâu được phát triển mạnh trong vài năm gần đây. Chúng mở ra một giai đoạn mới cho xử lý ngôn ngữ tự nhiên (NLP): thay vì chỉ làm tốt một vài bài toán hẹp, LLM có thể đọc, tạo, tóm tắt, dịch, trả lời câu hỏi, phân tích cảm xúc, trích xuất thông tin và hỗ trợ viết code trong cùng một giao diện ngôn ngữ tự nhiên.',
        'Trước khi có LLM hiện đại, nhiều phương pháp NLP truyền thống rất hữu ích cho các tác vụ cụ thể như phân loại email rác, gán nhãn văn bản, hoặc nhận dạng những pattern đơn giản có thể mô tả bằng luật thủ công hay mô hình nhỏ hơn. Nhưng chúng thường kém linh hoạt hơn ở những tác vụ cần hiểu chỉ thị dài, dùng ngữ cảnh phức tạp, hoặc tạo ra văn bản mới mạch lạc. Ví dụ, việc viết một email hoàn chỉnh từ vài gạch đầu dòng là chuyện khá tự nhiên với LLM hiện nay, nhưng không hề đơn giản với nhiều thế hệ mô hình ngôn ngữ trước đó.',
        'Khi nói LLM "hiểu" ngôn ngữ, ta cần hiểu theo nghĩa kỹ thuật: mô hình xử lý chuỗi token và tạo ra văn bản có vẻ mạch lạc, phù hợp với ngữ cảnh, chứ không có ý thức hay sự thấu hiểu giống con người. Khả năng này đến từ deep learning, lượng dữ liệu văn bản rất lớn, và quá trình huấn luyện giúp mô hình học được nhiều pattern về cú pháp, ngữ nghĩa, style viết và quan hệ giữa các ý trong câu.',
        'Khi bạn đặt câu hỏi với ChatGPT, bản chất là bạn đưa cho mô hình một đoạn văn bản mở đầu. LLM đọc toàn bộ ngữ cảnh đã có, rồi dự đoán token tiếp theo nên xuất hiện là gì. Token có thể là một từ, một phần của từ, dấu câu, khoảng trắng, hoặc ký hiệu đặc biệt.',
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
      undefined,
      { interactionPlacement: 'none' },
    ),
    conceptPanel('tokenization-example', 'llm-from-scratch-roadmap', 'Ví dụ tokenization', {
      tokenExample: tokenizationExample(),
    }),
    conceptInteraction(
      'what-is-llm-interactions',
      'llm-from-scratch-roadmap',
      'Thử model dự đoán từng bước',
      [],
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
        'Đúng rồi. Một câu trả lời dài cũng được tạo từ nhiều bước nhỏ như vậy. Đặc biệt nếu bạn chọn câu admin rất đẹp trai thì model này khá là có gu đấy.',
        'Sai nhịp rồi. Bấm hoàn tác hoặc làm lại, chứ câu này đang chuẩn bị đi du lịch hơi xa.',
      ),
      {
        interactionPlacement: 'only',
      },
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
    conceptPanel('iris-scale-comparison-roadmap', 'llm-from-scratch-roadmap', 'Large đến mức nào?', {
      emphasis: 'Large',
      highlights: [
        ['2', 'Mô hình Iris', 'Bài toán Iris có thể đạt độ chính xác cao với một mô hình rất nhỏ.'],
        ['~100,000,000,000+', 'LLM hiện đại', 'LLM cần quy mô lớn để học ngôn ngữ, ngữ cảnh và tri thức phức tạp.'],
      ],
    }),
    conceptPanel('why-llms-are-popular-now', 'llm-from-scratch-roadmap', 'Vì sao LLM phổ biến đến vậy?', {
      body: [
        'LLM không chỉ mạnh hơn các model NLP cũ. Điểm làm chúng phổ biến là chúng biến rất nhiều bài toán khác nhau thành một giao diện quen thuộc: nhập ngôn ngữ tự nhiên, nhận lại câu trả lời, đoạn code, bản tóm tắt, hoặc dữ liệu đã được cấu trúc.',
      ],
      highlights: [
        ['Dễ dùng', 'Ngôn ngữ tự nhiên trở thành giao diện', 'Người dùng không cần biết cú pháp phức tạp. Họ có thể mô tả mục tiêu bằng lời, giống như đang trao đổi với một trợ lý.'],
        ['Đa nhiệm', 'Một model có thể làm nhiều việc', 'Cùng một nền tảng có thể chat, tóm tắt, dịch, phân tích cảm xúc, trích xuất thông tin, viết code, hoặc hỗ trợ tìm kiếm tri thức.'],
        ['Dễ tích hợp', 'API và tooling làm tốc độ thử nghiệm rất nhanh', 'Doanh nghiệp có thể bắt đầu bằng API, prompt, RAG, tool calling hoặc workflow agent trước khi nghĩ tới training model riêng.'],
        ['Transformer', 'Kiến trúc giúp học ngữ cảnh dài hiệu quả hơn', 'Transformer thay đổi cách model xử lý chuỗi: attention cho phép mỗi token đọc các token liên quan trong context, đồng thời dễ song song hóa hơn RNN/LSTM khi train trên dữ liệu lớn.'],
        ['Big data', 'Internet tạo ra nguồn text khổng lồ để pretrain', 'Web text, sách, code, tài liệu và dữ liệu hội thoại giúp model học nhiều pattern ngôn ngữ, kiến thức phổ thông, style viết và cấu trúc task khác nhau.'],
        ['GPU/Compute', 'Phần cứng làm scale trở nên khả thi', 'GPU/TPU và hạ tầng distributed training cho phép train model nhiều tham số trên batch lớn trong thời gian chấp nhận được, biến ý tưởng scale thành sản phẩm thực tế.'],
      ],
      bodyAfter: [
        'Vì vậy LLM vừa là một hướng nghiên cứu model, vừa là một nền tảng sản phẩm. Người học cần hiểu cơ chế bên trong để biết khi nào model thật sự phù hợp, khi nào cần dữ liệu tốt hơn, và khi nào cần thiết kế hệ thống xung quanh model.',
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
  'minimal-llm-project-skeleton': [
    conceptPanel('colab-coding-requirements', 'minimal-llm-project-skeleton', 'Yêu cầu & setup trước khi học', {
      body: [
        'Giai đoạn đầu của course khuyến nghị chạy tuần tự trên Google Colab. Bạn chỉ cần chuẩn bị đủ vài tool bên dưới, sau đó tập trung vào token, shape, mask, logits, loss và generation loop.',
      ],
      highlights: [
        ['Cần biết trước', 'Nền tảng tối thiểu', 'Biết dùng Google Colab và đọc lỗi Python đơn giản.\nNắm NumPy và PyTorch cơ bản: tensor, module, forward, loss.\nĐã học Neural Networks và các sequence-to-sequence model như RNN, LSTM, GRU.'],
        ['Google Colab', 'Môi trường chính cho giai đoạn đầu', 'Dùng để mở notebook, chạy cell từ trên xuống dưới, upload dataset/file .py khi cần, và bật GPU ở các phần train nặng.'],
        ['Python', 'Ngôn ngữ và runtime chính', 'Cần biết chạy script/notebook, đọc traceback cơ bản, dùng pip/venv ở mức đơn giản. Nếu chỉ chạy Colab thì Python đã có sẵn, nhưng local vẫn nên cài Python để làm project sau này.'],
        ['uv', 'Tool cài dependency nhanh', 'Dùng để cài requirements trong Colab hoặc local nhanh hơn pip. Ví dụ trên Colab có thể chạy ở cell đầu: pip install uv && uv pip install --system -r https://raw.githubusercontent.com/rasbt/LLMs-from-scratch/refs/heads/main/requirements.txt'],
        ['VSCode', 'Editor cho local/project về sau', 'Chưa bắt buộc ở những notebook đầu, nhưng nên chuẩn bị để đọc code nhiều file, chỉnh module, dùng terminal, Git và extension Python khi chuyển sang project GPT-mini hoàn chỉnh.'],
        ['Kiểm tra được', 'Mỗi bước phải in shape và ví dụ nhỏ', 'Section nào tạo tensor hoặc object mới thì phải có output quan sát được: shape, vài giá trị mẫu, hoặc một assert đơn giản.\nNếu một cell lỗi, sửa ngay tại cell đó rồi chạy lại các cell phụ thuộc phía sau; đừng nhảy qua lỗi rồi debug ở cuối notebook.'],
      ],
      highlightLinks: [
        [],
        [
          ['Document', 'https://colab.research.google.com/'],
          ['Video', 'https://www.youtube.com/watch?v=RLYoEyIHL6A'],
        ],
        [
          ['Document', 'https://docs.python.org/3/using/index.html'],
          ['Video', 'https://www.youtube.com/watch?v=YYXdXT2l-Gg'],
        ],
        [
          ['Document', 'https://docs.astral.sh/uv/getting-started/installation/'],
          ['Video', 'https://www.youtube.com/watch?v=AMdG7IjgSPM'],
        ],
        [
          ['Document', 'https://code.visualstudio.com/docs/setup/setup-overview'],
          ['Video', 'https://learn.microsoft.com/en-us/shows/visual-studio-code/learn-visual-studio-code-in-7min-official-beginner-tutorial'],
        ],
        [],
      ],
      bodyAfter: [
        'Tóm lại: chuẩn bị Colab, Python, uv và VSCode ở mức vừa đủ. Course sẽ bắt đầu bằng Colab cho đơn giản, sau đó mới chuyển sang local/VSCode khi cần làm việc như một project thật.',
        'Về sau, đến chương build GPT-mini hoàn chỉnh, chúng ta sẽ gom các phần đã chạy trên Colab thành project OOP với cấu trúc thư mục rõ ràng hơn: config, tokenizer/dataset, model, trainer, generator và checkpoint.',
      ],
    }),
  ],
  'llm-component-checkpoint-quiz': [
    quiz('llm-roadmap-checkpoint-quiz', 'llm-component-checkpoint-quiz', 'Quiz kiểm tra nhanh', [
      {
        id: 'ai-hierarchy-order',
        title: 'Sắp xếp thứ tự theo mức độ tổng quát',
        prompt: '',
        mode: 'order',
        options: [
          ['ml', 'ML'],
          ['llm', 'LLM'],
          ['ai', 'AI'],
          ['cv-nlp', 'CV / NLP'],
          ['dl', 'DL'],
        ],
        correctOrder: ['ai', 'ml', 'dl', 'cv-nlp', 'llm'],
        success: 'Đúng rồi. AI là phạm vi rộng nhất, ML nằm trong AI, DL nằm trong ML, CV và NLP là hai nhánh dưới DL, còn LLM nằm sâu trong NLP.',
        error: 'Chưa đúng thứ tự. Hãy đi từ phạm vi rộng nhất tới phần chuyên biệt nhất.',
      },
      {
        id: 'llm-learning-objective',
        title: 'Chọn một đáp án',
        prompt: 'LLM học bằng cách nào?',
        mode: 'single',
        options: [
          ['next-token', 'Dự đoán token tiếp theo trong một chuỗi văn bản dựa trên dữ liệu đã thấy.', true],
          ['image-label', 'Gán nhãn thủ công từng ảnh rồi học nhận diện vật thể.', false],
          ['rules-only', 'Lưu một bộ luật ngữ pháp cố định và áp dụng nguyên văn.', false],
          ['one-shot-answer', 'Tạo toàn bộ câu trả lời trong một lượt duy nhất mà không dự đoán từng bước.', false],
        ],
        success: 'Chính xác. Next-token prediction là objective nền tảng của LLM.',
        error: 'Chưa đúng. Hãy nhớ LLM sinh câu trả lời bằng nhiều bước dự đoán token kế tiếp.',
      },
      {
        id: 'valid-token-examples',
        title: 'Phân loại token',
        prompt: 'Kéo từng ví dụ vào đúng loại token',
        mode: 'categorize',
        categories: [
          ['word', 'Một từ'],
          ['subword', 'Một phần của từ'],
          ['punctuation-whitespace', 'Dấu câu & khoảng trắng'],
          ['special-symbol', 'Ký hiệu đặc biệt'],
        ],
        options: [
          ['hello', 'hello', 'word'],
          ['model', 'model', 'word'],
          ['sub-ing', '##ing', 'subword'],
          ['sub-tion', 'tion', 'subword'],
          ['comma', ',', 'punctuation-whitespace'],
          ['question-mark', '?', 'punctuation-whitespace'],
          ['space', 'space', 'punctuation-whitespace'],
          ['newline', '\\n', 'punctuation-whitespace'],
          ['bos', '<BOS>', 'special-symbol'],
          ['eos', '<EOS>', 'special-symbol'],
        ],
        success: 'Đúng. Token có thể là từ, mảnh từ, dấu câu, khoảng trắng hoặc special token.',
        error: 'Chưa khớp. Hãy nhớ token là đơn vị văn bản/ký hiệu nhỏ đi vào model.',
      },
      {
        id: 'why-large',
        title: 'Chọn tất cả ý đúng',
        prompt: 'Vì sao LLM được gọi là "Large"?',
        mode: 'multi',
        options: [
          ['params', 'Số tham số rất lớn, từ hàng trăm triệu tới hàng nghìn tỷ.', true],
          ['data', 'Dữ liệu huấn luyện khổng lồ, có thể lên tới hàng trăm GB văn bản.', true],
          ['compute', 'Thời gian huấn luyện dài trên nhiều GPU.', true],
          ['always-correct', 'Vì model luôn trả lời đúng.', false],
          ['only-long-output', 'Vì model chỉ tạo được câu trả lời rất dài.', false],
        ],
        success: 'Đúng rồi. Large nói về scale: parameters, data và compute.',
        error: 'Chưa đủ. Hãy chọn các lý do liên quan tới quy mô tham số, dữ liệu và compute.',
      },
      {
        id: 'pattern-learning-fill',
        title: 'Chọn tất cả từ điền đúng',
        prompt: 'Điền vào chỗ trống: "Sau 1000 lần luyện tập, model đã ___ được pattern."',
        mode: 'multi',
        options: [
          ['learned', 'học', true],
          ['noticed', 'nhận ra', true],
          ['memorized', 'ghi nhớ', true],
          ['deleted', 'xóa', false],
          ['ignored', 'bỏ qua', false],
        ],
        success: 'Chuẩn. Cả "học", "nhận ra", và "ghi nhớ" đều diễn đạt được việc model bắt được pattern.',
        error: 'Chưa đúng. Các đáp án hợp lý phải nói rằng model đã bắt được pattern.',
      },
    ]),
  ],
};

function loc(en: string, vi = en) {
  return { en, vi };
}

function motivation(
  id: string,
  sectionRefId: string,
  title: string,
  body: string[],
  imageAlt: string,
  hierarchy?: Extract<LearningLessonExtra, { kind: 'motivation' }>['hierarchy'],
): LearningLessonExtra {
  return {
    kind: 'motivation',
    id,
    sectionRefId,
    title: loc(title),
    image: 'llm-from-scratch-roadmap.ai-hierarchy',
    imageAlt: loc(imageAlt),
    body: body.map((paragraph) => loc(paragraph)),
    hierarchy,
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
  config?: {
    interactionPlacement?: Extract<LearningLessonExtra, { kind: 'conceptInteraction' }>['interactionPlacement'];
    tokenExample?: {
      title: string;
      variants: Array<[string, string[], string]>;
      specialTitle: string;
      specialCases: Array<[string, string[], string]>;
      notes: string[];
    };
  },
): LearningLessonExtra {
  return {
    kind: 'conceptInteraction',
    id,
    sectionRefId,
    title: loc(title),
    body: body.map((paragraph) => loc(paragraph)),
    note: loc(note),
    imageAlt: loc(imageAlt),
    image: 'llm-from-scratch-roadmap.next-token-loop',
    prompt: loc(prompt),
    blankLabel: loc(blankLabel),
    labels: {
      chooseNextToken: loc('Choose the next token', 'Thử chọn token tiếp theo'),
      emptySentence: loc('choose words', 'chọn từng từ'),
      removeLastWord: loc('Remove last word', 'Xóa từ vừa chọn'),
      reset: loc('Reset'),
    },
    options: options.map((item) => ({
      label: loc(item.label),
      isCorrect: item.isCorrect,
      feedback: loc(item.feedback),
    })),
    interactionPlacement: config?.interactionPlacement,
    tokenExample: config?.tokenExample
      ? {
        title: loc(config.tokenExample.title),
        variants: config.tokenExample.variants.map(([label, tokens, description]) => ({
          label: loc(label),
          tokens,
          description: loc(description),
        })),
        specialTitle: loc(config.tokenExample.specialTitle),
        specialCases: config.tokenExample.specialCases.map(([label, tokens, description]) => ({
          label: loc(label),
          tokens,
          description: loc(description),
        })),
        notes: config.tokenExample.notes.map((note) => loc(note)),
      }
      : undefined,
    sentenceBuilder: builder,
  };
}

function option(label: string, isCorrect: boolean, feedback: string) {
  return { label, isCorrect, feedback };
}

function aiHierarchy(): Extract<LearningLessonExtra, { kind: 'motivation' }>['hierarchy'] {
  return {
    ariaLabel: loc('AI hierarchy flow'),
    branchLabel: loc('Deep Learning tách thành hai hướng chuyên biệt'),
    rows: [
      {
        shortName: 'AI',
        fullName: 'Artificial Intelligence',
        description: loc('Vòng ngoài cùng, chứa mọi cách làm cho máy có hành vi thông minh.'),
        depth: 'widest',
      },
      {
        shortName: 'ML',
        fullName: 'Machine Learning',
        description: loc('Bên trong AI, nơi máy học từ dữ liệu thay vì làm theo luật cố định.'),
        depth: 'middle',
      },
      {
        shortName: 'DL',
        fullName: 'Deep Learning',
        description: loc('Bên trong ML, dùng nhiều lớp xử lý để học các pattern phức tạp hơn.'),
        depth: 'middle',
      },
      {
        shortName: 'CV',
        fullName: 'Computer Vision',
        description: loc('Xử lý hình ảnh.'),
        depth: 'branch',
        compact: true,
      },
      {
        shortName: 'NLP',
        fullName: 'Natural Language Processing',
        description: loc('Xử lý ngôn ngữ.'),
        depth: 'branch',
        compact: true,
      },
      {
        shortName: 'LLM',
        fullName: 'Large Language Model',
        description: loc('Nằm sâu hơn bên trong NLP, đây là phần chúng ta sẽ tập trung giải thích.'),
        depth: 'target',
      },
    ],
  };
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
    highlightLinks?: string[][][];
    comparisonTable?: {
      columns: string[];
      rows: string[][];
    };
    outline?: Array<[string, string, string[][]]>;
    links?: string[][];
    tokenExample?: LearningTokenExample;
  },
): LearningLessonExtra {
  return {
    kind: 'conceptPanel',
    id,
    sectionRefId,
    title: loc(title),
    emphasis: config.emphasis ? loc(config.emphasis) : undefined,
    body: config.body?.map((paragraph) => loc(paragraph)),
    bodyAfter: config.bodyAfter?.map((paragraph) => loc(paragraph)),
    highlights: config.highlights?.map((item, itemIndex) => ({
      shortName: loc(item[0]),
      fullName: loc(item[1]),
      description: loc(item[2]),
      links: config.highlightLinks?.[itemIndex]?.map((link) => ({
        label: loc(link[0]),
        href: link[1],
      })),
    })),
    comparisonTable: config.comparisonTable ? {
      columns: config.comparisonTable.columns.map((column) => loc(column)),
      rows: config.comparisonTable.rows.map((row) => ({
        label: loc(row[0]),
        cells: row.slice(1).map((cell) => loc(cell)),
      })),
    } : undefined,
    outline: config.outline?.map((group) => ({
      title: loc(group[0]),
      body: loc(group[1]),
      items: group[2].map((item) => ({ title: loc(item[0]), body: loc(item[1]) })),
    })),
    links: config.links?.map((link) => ({ label: loc(link[0]), href: link[1] })),
    tokenExample: config.tokenExample,
  };
}

function tokenizationExample(): LearningTokenExample {
  return {
    title: loc('Ví dụ tokenization'),
    variants: [
      {
        label: loc('Word tokens'),
        tokens: ['I', 'love', 'tokenization', '!'],
        description: loc('Cắt gần giống cách người đọc nhìn thấy từng từ và dấu câu.'),
      },
      {
        label: loc('Sub-word tokens'),
        tokens: ['I', 'love', 'token', 'ization', '!'],
        description: loc('Từ dài hoặc từ lạ có thể bị bẻ thành các mảnh nhỏ hơn.'),
      },
    ],
    specialTitle: loc('Trường hợp đặc biệt'),
    specialCases: [
      {
        label: loc('Dấu câu'),
        tokens: [',', '.', '?', '!'],
        description: loc('Dấu câu thường được giữ thành token riêng để model học nhịp câu.'),
      },
      {
        label: loc('Khoảng trắng'),
        tokens: ['space', '\\n'],
        description: loc('Một số tokenizer giữ khoảng trắng hoặc xuống dòng như tín hiệu riêng.'),
      },
      {
        label: loc('Special tokens'),
        tokens: ['<BOS>', '<EOS>', '<PAD>'],
        description: loc('Token điều khiển biên câu, kết thúc chuỗi, hoặc padding batch.'),
      },
    ],
    notes: [
      loc('Không có một cách chia token duy nhất đúng cho mọi model. BPE, WordPiece, SentencePiece, GPT tokenizer hay Llama tokenizer có thể cắt cùng một câu thành các dãy token khác nhau.'),
    ],
  };
}

function quiz(
  id: string,
  sectionRefId: string,
  title: string,
  questions: Array<{
    id: string;
    title: string;
    prompt: string;
    mode: Extract<LearningLessonExtra, { kind: 'quiz' }>['questions'][number]['mode'];
    hideUnsortedLabel?: boolean;
    unsortedLabel?: string;
    completeLabel?: string;
    categories?: Array<[string, string]>;
    options: Array<[string, string, (boolean | string)?]>;
    correctOrder?: string[];
    success: string;
    error: string;
  }>,
): LearningLessonExtra {
  return {
    kind: 'quiz',
    id,
    sectionRefId,
    title: loc(title),
    questions: questions.map((question) => ({
      id: question.id,
      title: loc(question.title),
      prompt: loc(question.prompt),
      mode: question.mode,
      hideUnsortedLabel: question.hideUnsortedLabel,
      unsortedLabel: question.unsortedLabel ? loc(question.unsortedLabel) : undefined,
      completeLabel: question.completeLabel ? loc(question.completeLabel) : undefined,
      categories: question.categories?.map(([categoryId, label]) => ({
        id: categoryId,
        label: loc(label),
      })),
      options: question.options.map(([optionId, label, answer]) => ({
        id: optionId,
        label: loc(label),
        isCorrect: typeof answer === 'boolean' ? answer : undefined,
        categoryId: typeof answer === 'string' ? answer : undefined,
      })),
      correctOrder: question.correctOrder,
      success: loc(question.success),
      error: loc(question.error),
    })),
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
    targets: targets.map((target) => target.map((word) => loc(word))),
    choices: choices.map((choice) => loc(choice)),
    success: loc(success),
    error: loc(error),
  };
}

import type { LearningDomain, LearningLesson, LearningLessonExtra, LearningLessonSection, LearningLessonStatus, LearningTrack } from '../types.ts';
import { buildPlaceholderContent, type LearningChapterSeed } from './seed.ts';

const APPROVED_LESSON = {
  id: 'llm-from-scratch-roadmap',
  approvedBy: 'nmkhiem',
} as const;

const chapters: LearningChapterSeed[] = [
  {
    id: 'llm-from-scratch-orientation',
    textKey: 'llmFromScratchOrientation',
    lessonIds: [
      lessonSeed(
        'llm-from-scratch-roadmap',
        'LLM from scratch roadmap',
        'Roadmap LLM from scratch',
        [],
        ['theory'],
        'available',
      ),
      lessonSeed(
        'llm-component-checkpoint-quiz',
        'Component checkpoint quiz',
        'Quiz kiểm tra thành phần',
        [
          'Bài kiểm tra này dùng để xác nhận bạn đã đặt đúng vai trò của từng thành phần trước khi viết code. Một lỗi rất phổ biến khi học LLM from scratch là nhớ tên các module, nhưng không biết tensor nào đi vào đâu và tensor nào được so với target.',
          'Hãy tự vẽ chuỗi xử lý cho một câu ngắn: text -> token ids -> token embedding + positional embedding -> nhiều GPT block -> logits -> cross-entropy loss. Ở mỗi mũi tên, hãy ghi shape dự kiến bằng ký hiệu batch, sequence length, vocab size, và embedding dimension.',
          'Câu hỏi lý thuyết đầu tiên: vì sao output cuối của model là logits trên toàn vocabulary, chứ không phải trực tiếp là một chữ hoặc một token? Câu trả lời đúng phải nhắc đến việc softmax và loss cần một điểm số cho từng token ứng viên.',
          'Câu hỏi thứ hai: causal mask nằm ở đâu trong pipeline? Nó không thuộc tokenizer và cũng không thuộc loss; nó nằm trong attention score trước softmax để mỗi vị trí không nhìn thấy token tương lai.',
          'Câu hỏi thứ ba: nếu context window dài 8, batch size là 4, vocab size là 1000, model dimension là 64, logits cuối cùng nên có shape nào? Nếu bạn trả lời được `(4, 8, 1000)` và giải thích vì sao không phải `(4, 8, 64)`, bạn đã sẵn sàng sang skeleton code.',
        ],
        ['theory', 'calculation'],
        'available',
      ),
      lessonSeed(
        'minimal-llm-project-skeleton',
        'Minimal LLM project skeleton',
        'Khung project LLM tối thiểu',
        [
          'Một project LLM from scratch tối thiểu nên tách rõ các trách nhiệm: cấu hình, dữ liệu, model, training loop, và generation. Nếu trộn tất cả vào một file lớn, bạn vẫn có thể chạy thử, nhưng rất khó kiểm tra vì lỗi tokenization, lỗi shape, và lỗi loss sẽ chồng lên nhau.',
          'File cấu hình nên chứa những con số làm thay đổi shape: vocab size, context window, embedding dimension, số layer, số head, dropout, batch size, và learning rate. Khi một shape sai, bạn quay lại config trước, không đoán mò trong từng module.',
          'File dataset nhận text hoặc danh sách token ids và trả về cặp input-target. Input là chuỗi token từ vị trí `t` đến `t + context - 1`; target là cùng cửa sổ đó nhưng dịch sang phải một bước. Đây là cầu nối trực tiếp giữa tokenization và next-token prediction.',
          'File model nhận batch token ids và trả về logits có shape `(batch, sequence, vocab_size)`. Trong pass đầu, model chỉ cần khai báo các module chính và mô tả forward path, chưa cần training thật trong Learning Lab.',
          'Code step của bài này sẽ hiện thực hóa skeleton: input là một cấu hình nhỏ và vài dòng text mẫu; output là cấu trúc file/module rõ ràng cùng một forward contract. Điều cần quan sát là mọi file đều trả lời được câu hỏi: nó nhận gì, trả gì, và shape nào phải được giữ ổn định.',
        ],
        ['theory', 'code'],
        'next',
      ),
    ],
  },
  {
    id: 'text-data-and-tokenization',
    textKey: 'textDataAndTokenization',
    lessonIds: [
      lessonSeed(
        'tokenization-theory-from-scratch',
        'Tokenization theory',
        'Lý thuyết tokenization',
        [
          'LLM không đọc chữ như con người. Nó nhận một dãy số nguyên gọi là token ids. Tokenization là bước biến text thô thành dãy id ổn định để model có thể tra embedding và xử lý bằng tensor.',
          'Một token có thể là một ký tự, một từ, một mảnh subword, dấu câu, khoảng trắng, hoặc special token. Lựa chọn vocabulary quyết định model nhìn thế giới bằng đơn vị nào: quá thô thì không xử lý được từ mới, quá nhỏ thì sequence dài và tốn context window.',
          'Special tokens xử lý những tình huống không phải chữ thường: `<|unk|>` cho token chưa biết, `<|endoftext|>` để ngăn cách hai nguồn text độc lập, `[BOS]`/`[EOS]` cho biên sequence, và `[PAD]` để padding batch. Các token này vẫn là token thật, vẫn có id, và vẫn có thể ảnh hưởng loss nếu bạn không mask đúng.',
          'BPE là một bước tiến so với tokenizer tách từ đơn giản. Thay vì thay toàn bộ từ lạ bằng `<|unk|>`, BPE có thể bẻ từ thành subword hoặc ký tự nhỏ hơn. Nhờ vậy tokenizer thường parse được từ mới mà vẫn giữ vocabulary hữu hạn.',
          'Trong pipeline LLM, tokenization đứng trước mọi thứ khác. Nếu tokenizer cắt một câu thành 30 token thay vì 12 token, attention phải xử lý ma trận lớn hơn, dataloader tạo nhiều cửa sổ hơn, và training loop nhìn thấy nhiều target hơn.',
          'Token embedding chỉ tra vector theo token id. Cùng một id ở vị trí đầu hay cuối sequence sẽ lấy cùng vector. Vì self-attention tự thân không biết thứ tự tuyệt đối, GPT cộng thêm positional embedding có cùng dimension với token embedding để model biết token đang nằm ở đâu trong context window.',
          'Điểm cần hiểu sâu là tokenizer không chỉ là tiện ích I/O. Nó định nghĩa biên giới của bài toán dự đoán: model không dự đoán "từ tiếp theo" theo nghĩa ngôn ngữ tự nhiên, mà dự đoán token tiếp theo theo vocabulary cụ thể.',
          'Khi học from scratch, bạn có thể bắt đầu bằng tokenizer rất đơn giản để thấy dòng dữ liệu. Sau đó mới thay bằng BPE hoặc tokenizer thật. Điều cốt lõi cần giữ là mapping hai chiều: text -> token ids để train, và token ids -> text để generation có thể đọc được.',
        ],
        ['theory'],
      ),
      lessonSeed(
        'token-counting-hand-quiz',
        'Token counting hand quiz',
        'Quiz tính token bằng tay',
        [
          'Bài này buộc bạn tính token bằng tay để thấy context window là tài nguyên hữu hạn. Trước khi có tokenizer thật, hãy dùng một quy ước đơn giản: tách theo khoảng trắng và giữ dấu câu như token riêng.',
          'Với câu `I love tiny LLMs.`, nếu tách thành `I`, `love`, `tiny`, `LLMs`, `.`, ta có 5 token. Nếu thêm special token `<bos>` ở đầu và `<eos>` ở cuối, sequence trở thành 7 token. Hai token đặc biệt này cũng chiếm chỗ trong context window.',
          'Giả sử context window là 6, câu trên sau khi thêm `<bos>/<eos>` không vừa trong một cửa sổ đầy đủ. Bạn cần quyết định cắt ngắn, bỏ special token, hoặc dùng sliding window. Đây là quyết định dữ liệu, không phải lỗi của model.',
          'Bài tập tính tay: với token ids `[10, 23, 44, 7, 8, 9, 2]` và context window 4, hãy tạo các cặp input-target bằng sliding window stride 1. Input đầu là `[10, 23, 44, 7]`, target đầu là `[23, 44, 7, 8]`.',
          'Câu hỏi kiểm tra: nếu batch gồm 3 cửa sổ, mỗi cửa sổ dài 4, input tensor có shape nào? Nếu vocab size là 50, logits sau model có shape nào? Câu trả lời cần nối token counting với downstream shape, không chỉ đếm số phần tử.',
        ],
        ['theory', 'calculation'],
      ),
      lessonSeed(
        'tokenizer-and-dataloader-code',
        'Tokenizer and dataloader code',
        'Code tokenizer và dataloader',
        [
          'Code step này hiện thực hóa đường đi tối thiểu từ text sang batch, không cố xây tokenizer production. Input là một đoạn text nhỏ và một vocabulary được tạo từ corpus mẫu; output là token ids, các cửa sổ input-target, và batch tensor.',
          'Tokenizer tối thiểu cần hai cấu trúc: `stoi` để map string token sang id, và `itos` để map id về string token. Khi encode, text được cắt theo quy ước đơn giản rồi đổi thành id. Khi decode, id được ghép lại để kiểm tra dòng dữ liệu có mất thông tin nghiêm trọng không.',
          'Theo reference gist, tokenizer thực tế cần xử lý boundary và padding. Trong lab tối thiểu, hãy để sẵn slot cấu hình cho `<|endoftext|>` và `[PAD]`, nhưng chưa cần implement BPE thật. Nếu sequence trong cùng batch dài ngắn khác nhau, padding chỉ là kỹ thuật batching; target padding phải được mask khỏi loss ở bài fine-tuning.',
          'Dataloader nhận dãy token ids dài và tạo sliding windows. Với mỗi vị trí bắt đầu, input lấy `context_window` token, target lấy cùng độ dài nhưng dịch phải một bước. Đây chính là dữ liệu cho next-token prediction.',
          'Batching chỉ gom nhiều cặp input-target lại với nhau. Điều cần quan sát là batch không thay đổi nghĩa của dữ liệu; nó chỉ thêm chiều batch ở đầu. Nếu một sample có shape `(T)`, batch sẽ có shape `(B, T)`.',
          'Khi code chạy đúng, bạn nên in ra một vài sample decode được: input text fragment và target text fragment lệch một token. Nếu mắt bạn thấy target thật sự là "token kế tiếp" của input ở từng vị trí, phần dữ liệu đã sẵn sàng cho model.',
        ],
        ['theory', 'code'],
      ),
    ],
  },
  {
    id: 'attention-and-transformers-from-scratch',
    textKey: 'attentionAndTransformersFromScratch',
    lessonIds: [
      lessonSeed(
        'causal-self-attention-theory',
        'Causal self-attention theory',
        'Lý thuyết causal self-attention',
        [
          'Self-attention cho mỗi token tạo representation mới bằng cách nhìn các token khác trong cùng sequence. Trong LLM decoder-only, attention phải có tính causal: token ở vị trí hiện tại chỉ được đọc chính nó và các token trước đó, không được đọc tương lai.',
          'Ba tensor Q, K, V là ba cách chiếu cùng embedding đầu vào. Query hỏi "vị trí này đang tìm thông tin gì", Key mô tả "mỗi vị trí đang có đặc điểm gì để được chú ý", và Value chứa nội dung sẽ được trộn lại sau khi có trọng số attention.',
          'Attention score được tính bằng Q nhân K chuyển vị, thường chia cho căn bậc hai của head dimension để giữ scale ổn định. Sau đó causal mask đặt các vị trí tương lai thành giá trị rất âm trước softmax, làm xác suất chú ý vào tương lai gần như bằng 0.',
          'Gist nhấn mạnh hai cách nghĩ về mask. Cách dễ hiểu là đặt trọng số tương lai về 0 rồi chuẩn hóa lại từng hàng. Cách hiệu quả hơn trong code là đặt score tương lai thành `-inf` trước softmax, vì `exp(-inf)` gần như bằng 0.',
          'Dropout trong attention chỉ dùng khi training. Nó có thể được áp trên attention weights sau softmax để model không quá phụ thuộc vào một vài liên kết chú ý cụ thể. Khi `model.eval()`, dropout tắt để generation ổn định.',
          'Trong pipeline LLM, causal attention là nơi model xây ngữ cảnh. Token embedding ban đầu chỉ biết identity và vị trí; sau attention, representation của một token đã chứa thông tin từ prefix trước nó trong context window.',
          'Điều cần nhớ là causal mask không làm model "thông minh" hơn, mà làm bài toán training khớp với generation. Khi generate từng token từ trái sang phải, tương lai chưa tồn tại; training cũng phải tôn trọng ràng buộc đó.',
        ],
        ['theory'],
      ),
      lessonSeed(
        'attention-score-shape-calculation',
        'Attention score and shape calculation',
        'Tính score và shape attention',
        [
          'Bài tính tay này giúp bạn kiểm tra attention bằng shape trước khi nhìn code. Giả sử batch size `B = 2`, sequence length `T = 4`, model dimension `C = 8`, số head `H = 2`, vậy mỗi head có dimension `D = 4`.',
          'Sau projection, Q, K, V ban đầu có thể có shape `(B, T, C)`. Khi tách head, shape trở thành `(B, H, T, D)`. Nếu bạn không tách đúng, phép nhân attention sẽ trộn nhầm chiều head với chiều sequence.',
          'Score của từng head là `Q @ K^T` trên chiều `D`, nên shape là `(B, H, T, T)`. Hai chiều `T` có ý nghĩa khác nhau: hàng là vị trí đang hỏi, cột là vị trí được đọc.',
          'Causal mask cho `T = 4` là ma trận tam giác dưới. Hàng 0 chỉ đọc cột 0; hàng 1 đọc cột 0 và 1; hàng 2 đọc cột 0, 1, 2; hàng 3 đọc cả 0..3. Hãy tự đánh dấu những ô bị cấm trước khi softmax.',
          'Sau softmax, trọng số attention nhân với V để tạo context per head có shape `(B, H, T, D)`. Khi ghép head lại, output trở về `(B, T, C)`. Nếu shape cuối không quay về model dimension, GPT block phía sau sẽ không nối residual được.',
        ],
        ['theory', 'calculation'],
      ),
      lessonSeed(
        'multi-head-attention-code',
        'Multi-head attention code',
        'Code multi-head attention',
        [
          'Code step này xây multi-head attention ở mức tối thiểu. Input là tensor embedding có shape `(batch, sequence, model_dim)`; output phải giữ cùng shape để có thể cộng residual trong GPT block.',
          'Bước đầu là tạo linear projection cho Q, K, V. Một implementation gọn có thể dùng ba layer riêng hoặc một layer lớn sinh ra `3 * model_dim` rồi tách. Cách nào cũng phải kiểm tra được shape trước và sau projection.',
          'Tiếp theo, code reshape tensor thành nhiều head: từ `(B, T, C)` sang `(B, H, T, D)`. Đây là điểm dễ sai nhất vì `view`, `transpose`, hoặc `contiguous` có thể làm bạn tưởng shape đúng nhưng thứ tự chiều sai.',
          'Causal mask được tạo theo sequence length hiện tại, áp vào score trước softmax. Trong implementation tối thiểu, mask có thể là một buffer tam giác dưới hoặc một tensor tạo động theo `T`.',
          'Sau softmax, attention dropout có thể zero thêm một số liên kết trong lúc training. Đây là regularization, không phải một phần bắt buộc của phép tính inference. Vì vậy test nên kiểm tra cả mode training và eval nếu sau này lab có code chạy thật.',
          'Output của từng head được ghép lại thành `(B, T, C)` rồi đi qua output projection. Điều cần quan sát khi test là: không token nào nhìn tương lai, attention weights trên mỗi hàng cộng xấp xỉ 1, và output shape không đổi so với input.',
        ],
        ['theory', 'code'],
      ),
    ],
  },
  {
    id: 'gpt-model-from-scratch',
    textKey: 'gptModelFromScratch',
    lessonIds: [
      lessonSeed(
        'gpt-block-theory',
        'GPT block theory',
        'Lý thuyết GPT block',
        [
          'Một GPT block là đơn vị lặp chính của decoder-only Transformer. Nó thường gồm normalization, causal self-attention, residual connection, normalization thứ hai, feed-forward network, và residual connection thứ hai.',
          'Attention trộn thông tin theo chiều sequence: token hiện tại đọc prefix trước nó. Feed-forward network xử lý từng vị trí độc lập theo chiều channel: nó mở rộng model dimension, áp activation, rồi nén về model dimension.',
          'Residual connection giúp block học phần bổ sung thay vì phải viết lại toàn bộ representation. Nếu attention hoặc MLP chưa hữu ích ở đầu training, residual vẫn cho tín hiệu đi qua, làm model sâu dễ train hơn.',
          'Layer normalization giữ activation ở mỗi vị trí có mean gần 0 và variance gần 1 trên chiều channel. Điều này làm training sâu ổn định hơn, nhất là khi gradient có thể quá nhỏ hoặc quá lớn.',
          'MLP trong GPT thường dùng GELU thay vì ReLU đơn giản. GELU là activation mượt hơn: nó không chỉ cắt âm/dương cứng, mà cho tín hiệu đi qua theo một đường cong mềm. Trong course này, GELU là một concept cần biết, chưa cần tự chứng minh công thức.',
          'Trong nhiều GPT hiện đại, dạng pre-norm được dùng: normalize trước attention hoặc MLP, rồi cộng residual sau module. Invariant quan trọng là mỗi block nhận và trả `(B, T, C)` để có thể xếp chồng nhiều lần.',
          'Trong pipeline LLM, nhiều GPT block xếp chồng biến token embedding ban đầu thành representation giàu ngữ cảnh. Block đầu học quan hệ gần và đơn giản; các block sau có thể tổng hợp mẫu dài hơn, dù trong model nhỏ điều này chỉ là trực giác học tập.',
        ],
        ['theory'],
      ),
      lessonSeed(
        'gpt-parameter-shape-calculation',
        'GPT parameter and shape calculation',
        'Tính parameter và shape của GPT',
        [
          'Bài tính này giúp bạn nhìn GPT như một hệ thống shape và parameter, không phải một hộp đen. Giả sử vocab size `V = 1000`, context window `T = 16`, model dimension `C = 64`, số layer `L = 2`, số head `H = 4`.',
          'Token embedding có khoảng `V * C` parameter, tức `1000 * 64 = 64,000`. Positional embedding học được có `T * C = 1,024` parameter. Hai phần này cộng lại tạo input representation shape `(B, T, C)`.',
          'Trong một attention block, nếu Q, K, V mỗi projection là `C x C`, tổng ba projection là `3 * C * C`. Output projection thêm `C * C`. Bỏ qua bias, attention có khoảng `4 * C * C` parameter.',
          'MLP thường mở rộng lên `4C`, nên hai linear layer có `C * 4C + 4C * C = 8C^2` parameter. Với `C = 64`, MLP mỗi block lớn hơn attention trong cách đếm đơn giản này.',
          'Output head đưa representation từ `C` về logits trên `V`, nên có `C * V` parameter nếu không tie weight với embedding. Câu hỏi kiểm tra: với batch size `B = 8`, logits cuối có shape `(8, 16, 1000)`; parameter count không phụ thuộc batch size.',
        ],
        ['theory', 'calculation'],
      ),
      lessonSeed(
        'gpt-module-code',
        'GPT module code',
        'Code module GPT',
        [
          'Code step này ghép các module đã học thành một model decoder-only nhỏ. Input là batch token ids có shape `(B, T)`; output là logits có shape `(B, T, vocab_size)`.',
          'Forward path bắt đầu bằng token embedding lookup để biến id thành vector `(B, T, C)`. Positional embedding được cộng vào để model phân biệt token ở vị trí 0 với token ở vị trí 10, dù token id giống nhau.',
          'Sau đó tensor đi qua một danh sách GPT block. Mỗi block phải giữ shape `(B, T, C)` để residual connection và block tiếp theo hoạt động. Đây là invariant quan trọng nhất của model body.',
          'Reference gist dùng GPT-2 124M làm mốc: transformer block được lặp 12 lần, còn bản lớn hơn lặp nhiều hơn. Trong TorchViz lab, con số layer chỉ là config học tập; mục tiêu là thấy shape và dòng dữ liệu không đổi qua stack block.',
          'Final normalization làm representation ổn định trước output head. Output head là linear layer chiếu từ `C` sang `vocab_size`, tạo logits cho từng vị trí trong sequence.',
          'Điều cần quan sát trong code là contract rõ ràng: model không nhận text, không tự tokenize, không tự tính loss nếu chưa truyền target. Nó chỉ nhận token ids và trả logits; training loop mới quyết định logits được so với target như thế nào.',
        ],
        ['theory', 'code'],
      ),
    ],
  },
  {
    id: 'pretraining-and-generation',
    textKey: 'pretrainingAndGeneration',
    lessonIds: [
      lessonSeed(
        'next-token-pretraining-theory',
        'Next-token pretraining theory',
        'Lý thuyết pretraining next-token',
        [
          'Next-token pretraining dạy model dự đoán token kế tiếp tại mọi vị trí trong một context window. Với input `[x0, x1, x2]`, target tương ứng là `[x1, x2, x3]`. Model học bằng cách làm logits tại mỗi vị trí gần với target token của vị trí đó.',
          'Điểm mạnh của objective này là dữ liệu text thô tự tạo nhãn. Bạn không cần con người gán label cho từng ví dụ; chỉ cần dịch sequence sang phải một token là có target.',
          'Cross-entropy loss đo model đặt xác suất bao nhiêu cho token đúng. Nếu logits làm token đúng có xác suất cao, loss thấp. Nếu model tự tin vào token sai, loss cao. Đây là tín hiệu gradient cho toàn bộ embedding, attention, MLP, và output head.',
          'Causal mask là điều kiện cần để objective không bị gian lận. Nếu token ở vị trí hiện tại nhìn được target ở tương lai, loss có thể thấp nhưng model không học khả năng generation thật.',
          'Validation loss chạy trên dữ liệu không cập nhật weight. Nếu train loss tiếp tục giảm nhưng validation loss đứng yên hoặc tăng, model có thể đang memorizing dữ liệu nhỏ thay vì học pattern tổng quát.',
          'Trong pipeline, pretraining nối dataloader, GPT model, loss, optimizer như AdamW, validation, và checkpoint. Mỗi phần nhỏ có thể đúng riêng lẻ nhưng training vẫn sai nếu input-target bị lệch, mask sai, hoặc logits/target reshape sai trước loss.',
        ],
        ['theory'],
      ),
      lessonSeed(
        'loss-perplexity-hand-calculation',
        'Loss and perplexity calculation',
        'Tính loss và perplexity',
        [
          'Bài này biến loss từ một con số mơ hồ thành phép tính có thể kiểm tra. Giả sử tại một vị trí, vocabulary có 3 token và model sau softmax cho xác suất `[0.7, 0.2, 0.1]`. Nếu target là token 0, cross-entropy là `-log(0.7)`.',
          'Nếu target là token 2, loss là `-log(0.1)`, lớn hơn nhiều vì model đặt xác suất thấp cho đáp án đúng. Cross-entropy không quan tâm token sai nào đứng thứ hai; nó chỉ nhìn xác suất của target đúng.',
          'Với nhiều vị trí trong batch, loss thường là trung bình của cross-entropy trên tất cả token target hợp lệ. Nếu có padding token, bạn cần mask padding ra khỏi loss; trong dataset tối thiểu không padding thì việc này đơn giản hơn.',
          'Perplexity thường được tính là `exp(loss)`. Nếu loss trung bình là `1.0`, perplexity khoảng `2.718`. Trực giác: model đang bối rối tương đương phải chọn giữa khoảng 2.7 token hiệu quả ở mỗi bước.',
          'Bài tập tính tay: cho ba target có xác suất đúng lần lượt `0.5`, `0.25`, `0.125`, hãy tính loss trung bình bằng log tự nhiên và perplexity. Sau đó giải thích vì sao perplexity tăng nhanh khi xác suất target đúng giảm.',
        ],
        ['theory', 'calculation'],
      ),
      lessonSeed(
        'training-loop-and-generation-code',
        'Training loop and generation code',
        'Code training loop và generation',
        [
          'Code step này mô tả training loop tối thiểu, không triển khai training thật trong Learning Lab hiện tại. Input của loop là batch `(x, y)` từ dataloader; output của model là logits; output của loss là một số scalar để optimizer cập nhật tham số.',
          'Một train step gồm: đưa input vào model, reshape logits và target cho cross-entropy, tính loss, zero gradient, backward, optimizer step. Thứ tự này quan trọng vì gradient cũ không được lẫn vào step mới.',
          'Validation chạy cùng forward và loss nhưng không cập nhật tham số. Nó giúp bạn phân biệt model thật sự học pattern tổng quát hay chỉ giảm loss trên batch training vừa thấy.',
          'Checkpoint lưu config, model state, optimizer state nếu cần, và thông tin step. Với project học tập, checkpoint còn là cách kiểm tra reproducibility: cùng config và seed nên cho hành vi gần giống nhau.',
          'Generation là vòng autoregressive: bắt đầu từ prompt token ids, cắt về context window nếu quá dài, lấy logits ở vị trí cuối, chọn token tiếp theo bằng greedy hoặc sampling, nối token mới vào sequence, rồi lặp lại. Điều cần quan sát là generation dùng cùng model nhưng không dùng target hay loss.',
          'Gist có thêm temperature scaling và top-k sampling để tránh output quá đơn điệu của greedy decoding. Temperature thấp làm phân phối sắc hơn; temperature cao làm phân phối đều hơn. Top-k chỉ cho sampling trong nhóm k token có logit cao nhất.',
          'Các kỹ thuật như learning-rate warmup, cosine decay, gradient clipping, và LoRA đã có giải thích trong reference, nhưng cần lab riêng để dạy đúng. Trong course hiện tại, chúng được đánh dấu là placeholder bổ sung, không đưa vào code contract chính.',
        ],
        ['theory', 'code'],
      ),
    ],
  },
  {
    id: 'finetuning-and-alignment',
    textKey: 'finetuningAndAlignment',
    lessonIds: [
      lessonSeed(
        'finetuning-objectives-theory',
        'Fine-tuning objectives theory',
        'Lý thuyết objective fine-tuning',
        [
          'Fine-tuning bắt đầu từ một base model đã học phân phối ngôn ngữ, rồi điều chỉnh nó cho hành vi mục tiêu. Mục tiêu có thể là classification, instruction following, domain adaptation, hoặc preference alignment.',
          'Điểm khác giữa pretraining và fine-tuning nằm chủ yếu ở dữ liệu và objective. Pretraining dùng text liên tục với next-token loss rộng. Fine-tuning dùng ví dụ có cấu trúc hơn: input-label, prompt-response, hoặc cặp response được ưu tiên.',
          'Classification fine-tuning có thể thay hoặc thêm head để dự đoán nhãn. Instruction fine-tuning thường vẫn dùng next-token loss, nhưng chỉ trên phần response hoặc trên format prompt-response được thiết kế rõ.',
          'Classification fine-tuning là bài toán chuyên biệt: model chỉ cần chọn trong tập nhãn đã biết, ví dụ spam/not spam. Instruction fine-tuning linh hoạt hơn vì model học prompt-response cho nhiều task, nhưng thường cần dữ liệu tốt hơn và compute lớn hơn.',
          'Fine-tuning không tự động làm model an toàn hay đúng hơn. Nếu data có lỗi, thiếu refusal phù hợp, hoặc format không nhất quán, model sẽ học cả thói quen xấu đó. Data quality vì vậy là một phần của objective, không chỉ là tiền xử lý.',
          'Trong pipeline, fine-tuning đứng sau pretraining và trước evaluation/deployment. Nó sử dụng lại tokenizer, model architecture, logits, loss, và optimizer, nhưng thay đổi cách tạo example và cách đo hành vi mong muốn.',
        ],
        ['theory'],
      ),
      lessonSeed(
        'instruction-data-quality-quiz',
        'Instruction data quality quiz',
        'Quiz chất lượng instruction data',
        [
          'Bài quiz này kiểm tra xem bạn có nhìn dữ liệu instruction như một objective học được hay không. Một cặp prompt-response tốt phải cho model thấy rõ yêu cầu, ngữ cảnh, giới hạn, và kiểu câu trả lời mong muốn.',
          'Câu hỏi đầu tiên: nếu prompt yêu cầu "giải thích ngắn gọn" nhưng response dài nhiều đoạn và lan man, model sẽ học gì? Nó có thể học rằng instruction về độ dài không quan trọng. Đây là lỗi alignment ở mức dữ liệu.',
          'Câu hỏi thứ hai: nếu dataset chỉ có câu trả lời hoàn hảo và không có ví dụ refusal cho yêu cầu không phù hợp, model có học được khi nào nên từ chối không? Thường là không; hành vi refusal cần được biểu diễn nhất quán trong dữ liệu hoặc objective riêng.',
          'Câu hỏi thứ ba: evaluation example có được trộn vào training không? Nếu có, điểm evaluation sẽ mất ý nghĩa. Bạn cần giữ một tập kiểm tra riêng để đo hành vi sau fine-tuning.',
          'Bài tập phân loại: lấy 5 prompt-response pairs và gắn nhãn `clear`, `ambiguous`, `format mismatch`, `unsafe`, hoặc `leaky evaluation`. Mục tiêu không phải tranh luận đạo đức rộng, mà là kiểm tra liệu dữ liệu có dạy đúng hành vi mà code fine-tuning sắp tối ưu hay không.',
        ],
        ['theory', 'calculation'],
      ),
      lessonSeed(
        'classification-and-instruction-finetune-code',
        'Classification and instruction fine-tune code',
        'Code fine-tune classification và instruction',
        [
          'Code step này phác thảo hai đường fine-tuning phổ biến: classification và instruction. Cả hai dùng lại backbone Transformer, nhưng khác ở cách chuẩn bị batch, target, và metric đánh giá.',
          'Với classification, input là token ids của văn bản hoặc prompt, output mong muốn là nhãn. Code có thể lấy representation ở vị trí cuối hoặc một pooling đơn giản, rồi đưa qua classification head để tạo logits trên số lớp.',
          'Với classification, loss thường chỉ nhìn logits ở token cuối: `model(input_batch)[:, -1, :]`. Accuracy dùng để đánh giá, còn cross-entropy vẫn là loss để backprop vì accuracy không differentiable.',
          'Với instruction fine-tuning, input là chuỗi đã format gồm instruction, optional context, và response. Target thường là token của response; phần prompt hoặc padding có thể được thay bằng `-100` để `cross_entropy(ignore_index=-100)` bỏ qua khi tính loss.',
          'Training loop vẫn giống về cơ chế: forward, loss, backward, optimizer step. Khác biệt nằm ở collator và loss mask. Nếu mask sai, model có thể học copy prompt thay vì học trả lời.',
          'Evaluation cho classification nhìn accuracy, F1, hoặc confusion matrix. Evaluation cho instruction cần prompt held-out và tiêu chí chất lượng response như đúng yêu cầu, đúng format, không bịa theo ngữ cảnh, và refusal hợp lý. Trong pass này, code lesson chỉ mô tả contract đó, chưa chạy fine-tuning thật.',
        ],
        ['theory', 'code'],
      ),
    ],
  },
  {
    id: 'llm-fundamentals',
    textKey: 'llmFundamentals',
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
    textKey: 'productionPromptEngineering',
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
    textKey: 'workingWithAiApis',
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
    textKey: 'apiIntegrationPatterns',
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
    textKey: 'secureApiIntegration',
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

const llmAiEngineeringContent = buildPlaceholderContent({
  domainId: 'llm-ai-engineering',
  domainTextKey: 'llmAiEngineering',
  domainStatus: 'active',
  chapters,
  sectionKinds: ['theory', 'code'],
});

const llmFromScratchExtras: Record<string, LearningLessonExtra[]> = {
  'llm-from-scratch-roadmap': [
    motivation(
      'llm-roadmap-motivation',
      'llm-from-scratch-roadmap',
      'Motivation',
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
      links: [
        ['Repo: Building-LLMs-from-scratch', 'https://github.com/codewithdark-git/Building-LLMs-from-scratch'],
        ['Sách: Build a Large Language Model (From Scratch), Sebastian Raschka', 'https://www.manning.com/books/build-a-large-language-model-from-scratch'],
      ],
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

export const llmAiEngineeringDomain: LearningDomain = llmAiEngineeringContent.domain;
export const llmAiEngineeringTracks: LearningTrack[] = llmAiEngineeringContent.tracks;
export const llmAiEngineeringLessons: LearningLesson[] = llmAiEngineeringContent.lessons.map((lesson) => {
  const extras = lesson.id === APPROVED_LESSON.id ? llmFromScratchExtras[lesson.id] : undefined;
  return extras ? { ...lesson, extras } : lesson;
});

function lessonSeed(
  id: string,
  titleEn: string,
  titleVi: string,
  theoryVi: string[],
  sectionKinds: LearningLessonSection['kind'][],
  status?: LearningLessonStatus,
): LearningChapterSeed['lessonIds'][number] {
  if (id !== APPROVED_LESSON.id) {
    return {
      id,
      title: { en: titleEn, vi: titleVi },
    };
  }

  return {
    id,
    title: { en: titleEn, vi: titleVi },
    theory: theoryVi.map((paragraph) => ({ en: paragraph, vi: paragraph })),
    sections: sectionKinds.map((kind) => ({
      kind,
      refId: kind === 'theory' ? id : `${id}-${kind}`,
    })),
    status,
  };
}

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

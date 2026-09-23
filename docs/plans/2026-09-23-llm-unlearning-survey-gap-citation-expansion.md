---
title: "LLM Unlearning — Survey Coverage and Citation Expansion"
status: done
created: 2026-09-23T19:28:01+07:00
updated: 2026-09-23T20:58:55+07:00
author: Codex
task: "Hoàn thiện và dọn gọn domain llm-unlearning từ arXiv:2510.25117v2, giữ Code Lab trống, bỏ citation boilerplate, chỉ giữ một plan và commit"
supersedes: []
---

# Goal and outcome

Hoàn thiện Learning Lab `llm-unlearning` theo *A Survey on Unlearning in Large
Language Models* (`arXiv:2510.25117v2`) với trải nghiệm phù hợp người học mới,
citation có thể truy vết, một Quiz ngay sau mỗi theory node và bốn Code Lab để
trống cho người dùng bổ sung sau.

Kết quả triển khai:

- 66 authored MDX: 33 theory và 33 Quiz; 4 Code Lab còn canonical TOC node với
  `contentStatus: missing` và không có MDX;
- thêm 12 cặp theory/Quiz để lấp taxonomy phương pháp, benchmark, metric và
  challenge/future gaps;
- 33/33 pair có cùng `conceptIds`; question IDs bằng đúng tập concept đã dạy;
- 33/33 theory có citation và trang nguồn cuối; Quiz không tải reference runtime;
- bibliography 201 paper được sinh từ source của arXiv v2, cộng survey làm
  nguồn tổng hợp; 16 inline evidence gắn với claim cụ thể được review theo PDF v2;
- giữ 21 ảnh 16:9, mỗi ảnh dùng đúng một lần; các ảnh rủi ro cao được kiểm tra
  lại ở kích thước lesson và vẫn truyền đạt được thesis nhờ hình đơn giản,
  alt/caption và prose đi kèm;
- hai node Chapter 6 quá tải được tách lại: relearning/jailbreak thành 4 trang,
  lifecycle thành 6 trang;
- catalog đích: 70 node trong domain, 66 published và 4 missing.

# Durable decisions

1. Canonical lesson IDs và routes cũ được giữ nguyên. TOC export
   `llmUnlearningLessonPairs` là hợp đồng duy nhất cho 33 cặp.
2. Grammar trình bày authored content chỉ dùng `ConceptHierarchy`,
   `ConceptFlow`, `LessonNote`, cùng primitive chức năng `LessonImage`, math,
   citation và quiz.
3. Citation dùng reference runtime chung. `learningMdxRegistry.tsx` dùng loader
   map theo domain; `vite.config.ts` hợp nhất reference lesson keys mà không đưa
   bibliography vào home bundle.
4. Survey dùng cho taxonomy/synthesis. Các primary paper tiêu biểu xuất hiện ở
   reference page; phân tích và cấu trúc sư phạm được ghi là course analysis.
5. Evidence PDF có exact excerpt, search text, locator, versioned URL và ngày
   review. Audit đánh dấu `manual-required` vì script không extract PDF text;
   đây là trạng thái có chủ ý sau khi đối chiếu local v2, không phải citation bị
   thiếu.
6. Code Lab không được author trong scope này. Vì vậy domain ở readiness
   `updating`, dù toàn bộ theory/Quiz đã hoàn tất.

# Final curriculum map

| Chapter | Theory focus | Pairs |
|---|---|---:|
| 1. Fundamentals | động lực, memorization, prompt/retrain boundary, formal lens, request granularity, WHP case | 6 |
| 2. Historical foundations | SISA, quantized centroids, giới hạn khi chuyển sang Transformer sinh | 3 |
| 3. Data and benchmarks | TOFU, gold reference, data design axes, benchmark landscape | 5 |
| 4. Methods | timing taxonomy, GA/GD/KL/DPO, SFT objectives, RL/localization, modular/composite, inference-time | 9 |
| 5. Evaluation | tripartite intuition, memorization metrics, utility/robustness/efficiency, empirical audit, Pareto trade-off | 5 |
| 6. Challenges and lifecycle | entanglement, relearning/jailbreak, definition/data/scale, robust/verifiable/beyond-data, lifecycle | 5 |

# Survey coverage matrix

`taught` nghĩa là có theory node sở hữu nội dung. `summarized` nghĩa là khóa
học dạy mental model và giới hạn nhưng không liệt kê toàn bộ paper/biến thể.

| Survey section | Status | Course owner / rationale |
|---|---|---|
| §1 Introduction | taught | overview và curriculum map |
| §2.1.1 Request types | taught | request granularity and boundaries |
| §2.1.2 Goals of unlearning | taught | overview, formal formulation, gold retrained |
| §2.2.1 Memorization and extraction | taught | memorization and extraction attacks |
| §2.2.2 Knowledge updating | taught | problem boundaries; model editing được đối chiếu nhưng không mở thành domain riêng |
| §2.2.3 Alignment | taught | prompt/guardrail boundary và inference-time suppression |
| §3.1 Training-time | taught | SISA và method taxonomy |
| §3.2.1 SFT | taught | GA/GD/KL/DPO và SFT objective families |
| §3.2.2 RL | taught | RL and parameter localization |
| §3.2.3 Parameter localization | taught | RL/localization và entangled representations |
| §3.2.4 New structures | taught | modular unlearning |
| §3.2.5 Composite | taught | modular and composite unlearning |
| §3.3 Inference-time | taught | input, representation/logit và output surfaces |
| §4.1.1 Task format | taught | dataset design axes |
| §4.1.2 Content | taught | real versus fictitious content |
| §4.1.3 Experiment paradigm | taught | with/without controlled fine-tuning |
| §4.1.4 Dataset composition | taught | TOFU splits, forget/retain/neighbor/world roles |
| §4.1.5 Existing benchmarks | summarized | benchmark landscape dạy cách chọn; không ghi nhớ toàn bộ 18 benchmark |
| §4.2.1 Knowledge memorization | taught | output, judge, logit, rank và MIA windows |
| §4.2.2 Model utility | taught | retain/general capability metrics |
| §4.2.3 Robustness | taught | paraphrase, jailbreak và relearning protocol |
| §4.2.4 Efficiency | taught | time, compute, memory và updated parameters |
| §5.1.1 Definition/evaluation | taught | formal lens và definition ambiguity |
| §5.1.2 Effective evaluation | taught | metric triangulation và multi-axis scorecard |
| §5.1.3 Effects of unlearning | taught | empirical audit, Pareto trade-off và entanglement |
| §5.1.4 Across languages | taught | cross-lingual challenge và jailbreak surface |
| §5.1.5 Across data | taught | in/out-of-distribution, frequency và multi-hop effects |
| §5.1.6 In reality | taught | lifecycle, audit trail và deployment transformations |
| §5.1.7 Scalability | taught | model scale, quantization và specialized architecture pressure |
| §5.1.8 Continuous unlearning | taught | sequential request state and cumulative utility |
| §5.2.1 Specialized settings | summarized | module/MoE/tool scenarios; implementation details ngoài scope |
| §5.2.2 Unlearning as tools | summarized | defense/analysis use được định vị, không mở thành lab |
| §5.2.3 Beyond data | taught | concept, capability và source influence targets |
| §5.2.4 Robust unlearning | taught | robustness ladder and threat-model boundary |
| §5.2.5 Verifiable/certifiable | taught | verification/certification claims and assumptions |
| §6 Conclusions | summarized | lifecycle close và research boundary |

Không còn section nội dung nào chưa phân loại. Chi tiết triển khai từng method,
toàn bộ bảng paper và việc chạy benchmark mới nằm ngoài scope của course.

# Beginner, pacing, and visual audit

- Mỗi page có đúng một `##` và tối đa hai `###`; focused test chặn trang vượt
  650 prose words và component ngoài grammar cho phép.
- 15 legacy pages còn 413–548 prose words. Chúng được giữ sau review vì mỗi
  trang vẫn chỉ sở hữu một causal mechanism hoặc một derivation gắn với visual:
  Chapter 1 narrative/formal pages, TOFU motivation/gold, KL/DPO mechanism,
  tripartite/Pareto evaluation và entanglement. Đây là ngoại lệ có ghi nhận cho
  ngưỡng 400 từ; không trang nào còn gộp taxonomy, metric và production advice.
- Lifecycle giảm từ khoảng 700–1.000 từ/trang xuống 6 slide riêng. Relearning
  không còn khẳng định attack hữu hạn là bằng chứng tuyệt đối và được tách theo
  access, protocol, jailbreak surface và interpretation.
- 21 ảnh đều có tỷ lệ 16:9 và một thesis thị giác. Audit chi tiết các ảnh
  overview, epsilon/delta, gold distribution, empirical behavior,
  relearning/jailbreak và lifecycle cho thấy label chính đọc được, luồng trái
  sang phải rõ và caption đủ để người mới không phải suy đoán biểu tượng. Không
  cần regenerate ảnh trong scope này.

# Compacted predecessor history

| Absorbed plan | Status | Durable decision and outcome |
|---|---|---|
| `2026-09-22-init-llm-unlearning-domain.md` | done | Khởi tạo feature branch, domain ID, sáu track, Eraser presentation, catalog wiring và cặp overview/Quiz đầu tiên. |
| `2026-09-22-llm-unlearning-curriculum-rollout.md` | completed | Tạo sáu chapter, 21 theory, 21 quiz, 4 lab và asset rollout; verify/cdn checks được ghi nhận. |
| `2026-09-22-llm-unlearning-comprehensive-review-refactor.md` | completed | Chuẩn hóa thuật ngữ, ownership giữa chapter, quiz và 21 doodle 16:9; focused test pass. |
| `2026-09-22-llm-lifecycle-management-future-rewrite.md` | completed | Mở rộng lifecycle/audit và tạo ảnh lifecycle; nội dung quá tải sau đó được plan hiện tại tách lại. |
| `2026-09-22-llm-unlearning-curriculum-storytelling-expansion-plan.md` | completed | Đặt arc trực giác–cơ chế–trade-off cho 21 theory; kế thừa nhưng bỏ mục tiêu kéo dài prose. |
| `2026-09-22-memorization-extraction-attacks-pedagogical-rewrite.md` | draft | Đề xuất deep rewrite cho lesson 1.1.3; quyết định component/math được hấp thụ bởi standardization. |
| `2026-09-22-llm-unlearning-full-curriculum-pedagogical-standardization.md` | done | Khóa grammar vào ConceptFlow/ConceptHierarchy/LessonNote; ghi nhận verify 166/166 và build pass. |
| `2026-09-23-llm-unlearning-chapter-1-pedagogical-refinement.md` | ad-hoc plan | Chuẩn hóa ký hiệu, visual semantics và map sáu chương; không có frontmatter outcome riêng. |
| `2026-09-23-llm-unlearning-chapters-2-to-6-pedagogical-refinement.md` | ad-hoc plan | Chuẩn hóa KaTeX và note rhythm ở Chapters 2–6; không có execution log riêng. |

Genesis và tám plan trung gian đã được hấp thụ rồi xóa để tài liệu này là plan
duy nhất của nhánh. `supersedes` được đặt lại thành mảng rỗng vì không còn plan
tiền nhiệm vật lý để liên kết.

# Verification and cleanup

- `npx tsx --test src/lib/llmUnlearningContent.test.ts`: 7/7 pass.
- Citation evidence audit: 16/16 claim-specific occurrences accounted for; 16
  PDF records có explicit manual-review status, 0 link-only exceptions.
- `npm run verify`: typecheck pass, 169 tests pass, Vite production build pass.
- Catalog stats: 17 domains, 109 tracks, 847 lessons, 375 published, 472 missing.
- PDF nguồn chỉ được xóa sau lượt `npm run verify` xanh và sau khi generator,
  bibliography, evidence locator cùng matrix này đã được lưu.
- Cleanup cuối: PDF đã xóa; chỉ còn owning plan; link scan không còn inbound
  reference đến các plan đã hấp thụ; scoped `git diff --check` pass.
- Lượt `npm run verify` sau cleanup tiếp tục pass toàn bộ typecheck, 169 tests
  và production build. Global `git diff --check` còn cảnh báo blank line trong
  `AGENTS.md`, là thay đổi có sẵn ngoài scope nên được bảo toàn.

# Remaining out of scope

- Nội dung, fixture, notebook, citation hoặc Quiz cho bốn Code Lab.
- English translation, benchmark training mới hoặc domain-specific UI widget.
- Chứng nhận pháp lý hay claim rằng một empirical test hữu hạn chứng minh xóa
  tuyệt đối.

# Follow-up cleanup and commit

Yêu cầu ngày 2026-09-23 được xem là phê duyệt trực tiếp cho đợt dọn gọn này.

1. Rà diff và dependency graph để loại code, data hoặc citation evidence không
   còn được runtime/tests sử dụng; không chạm các thay đổi ngoài nhánh.
2. Xóa toàn bộ citation boilerplate mở bài bị lặp khỏi lesson; giữ citation chỉ
   khi nó gắn với một claim cụ thể có giá trị sư phạm.
3. Hấp thụ genesis plan vào tài liệu này và xóa genesis để nhánh chỉ còn một
   plan LLM Unlearning.
4. Chạy focused tests, citation/catalog audit và `npm run verify`; cập nhật log,
   stage đúng phạm vi rồi commit trên feature branch hiện tại.

Kết quả follow-up:

- Xóa 19 câu citation boilerplate và 19 evidence record theo track không còn
  claim cụ thể; còn 16/16 evidence được dùng đúng một lần trong authored prose.
- Rút generator khỏi các bảng override sao chép từ Continual Learning: xóa toàn
  bộ arXiv override không được dùng, chỉ giữ hai canonical override có mặt trong
  bibliography hiện tại và đổi tên thư mục tạm theo domain.
- Thêm regression assertion chặn boilerplate quay lại và chặn evidence mồ côi.
- Hấp thụ rồi xóa genesis plan; nhánh chỉ còn tài liệu plan này.
- Focused test 7/7, citation audit 16/16, catalog check, typecheck, 169/169 tests
  và Vite production build đều pass trước khi stage/commit.

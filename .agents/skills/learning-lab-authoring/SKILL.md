---
name: learning-lab-authoring
description: >-
  Universal guide and standards for authoring Learning Lab lessons, blog posts, and deep-dives across all domains:
  pedagogical structure, terminology and wording rules, formula presentation, typography constraints,
  and illustration asset selection and generation.
---

# Learning Lab Universal Lesson & Content Authoring Guide

Skill này định nghĩa toàn bộ tiêu chuẩn viết bài học, hướng dẫn kỹ thuật (deep-dive), quy chuẩn dùng từ (wording), trình bày công thức toán học và phương pháp lựa chọn/tạo minh họa (illustrations) áp dụng cho **tất cả các chủ đề/domain** trong TorchViz-3D Learning Lab (Linear Algebra, Deep Learning, Computer Vision, NLP, LLM & AI Engineering, MLOps/LLMOps, Continual Learning, AI System Design, Reinforcement Learning, Research Papers...).

---

## 1. Cấu trúc và Nhịp điệu Bài học (Pedagogical Architecture & Pacing)

Mỗi bài học cần mang lại trải nghiệm tiếp thu trực quan, đi từ **Trực giác/Hiện tượng $\to$ Bản chất cơ chế $\to$ Công thức & Thực nghiệm**. Tùy theo nhóm chủ đề, tuân thủ các khung phân tách chuẩn sau:

### A. Nhóm Kiến trúc Mô hình & Cơ chế Nâng cao (Model Architecture / Mechanism / Research Papers)
- **Phần 1: Bối cảnh & Nghịch lý / Vấn đề (Context & The Paradox):** 
  - Khởi đầu bằng trực giác bài toán và kiến trúc cơ sở.
  - Nêu bật nghịch lý kỹ thuật (ví dụ: tại sao adapter nhỏ vẫn gây quên thảm họa, tại sao mạng sâu bị vanishing gradient, tại sao attention chuẩn tốn $O(N^2)$).
  - Kết thúc bằng một **câu hỏi dẫn dắt (Leading Question)** sang bản chất không gian tiềm ẩn.
- **Phần 2: Bản chất Biểu diễn & Động lực Lý thuyết (Representation & Motivation):**
  - Mổ xẻ cách thông tin/gradient được nén và truyền tải trong không gian ẩn (Latent space, Manifold, Feature subspace, Energy concentration).
  - Xác lập nguyên tắc bảo toàn / tối ưu cần đạt được.
- **Phần 3: Giải pháp Toán học, Cơ chế Can thiệp & Kiểm chứng (Mechanism & Validation):**
  - Công thức toán học cốt lõi kèm phân rã hình học.
  - Ví dụ số học cụ thể (thay số thực tế) để người đọc thấy rõ sự thay đổi trước/sau.
  - Bảng so sánh định lượng đa benchmark (đo lường trade-offs, accuracy, latency, forgetting mitigation).

### B. Nhóm Nền tảng Toán & Giải tích (Linear Algebra / Deep Learning Foundations)
- **Trực giác hình học trước:** Luôn bắt đầu bằng ý nghĩa không gian 2D/3D (phép biến đổi, xoay trục, co dãn không gian, phân bố phương sai).
- **Công thức đại số:** Trình bày dạng ma trận/vector rõ ràng, định nghĩa tường minh từng thành phần.
- **Ý nghĩa trong Machine Learning:** Giải thích tại sao khái niệm toán học này lại quyết định sự thành bại của mô hình AI hiện đại.

### C. Nhóm Kỹ thuật Hệ thống & Quy trình (MLOps, LLMOps, AI System Design)
- **Nhu cầu bài toán thực tế:** Thách thức trong môi trường production (data drift, scale, latency, pipeline reliability).
- **Thiết kế luồng xử lý (Architectural Flow):** Sơ đồ khối các thành phần trong hệ thống.
- **Trade-offs & Best Practices:** Phân tích ưu/nhược điểm giữa các giải pháp và quy chuẩn triển khai chuẩn.

---

## 2. Tiêu chuẩn Wording và Dùng từ (Terminology & Phrasing Standards)

### A. Quy tắc Typography & In đậm (Bold)
- **Hạn chế chữ in nghiêng (*italics*):** Do chữ in nghiêng gây khó nhìn và giảm độ rõ nét khi đọc kỹ thuật, ưu tiên sử dụng văn bản thường hoặc in đậm đúng chỗ.
- **In đậm (**bold**) có chọn lọc và súc tích:**
  - Chỉ in đậm khi cần nhấn mạnh thuật ngữ cốt lõi, từ khóa quan trọng hoặc giúp người đọc quét nhanh (scan) ý chính.
  - Cụm in đậm phải **ngắn gọn (chỉ 1–4 từ)**, tuyệt đối không in đậm cả câu hoặc cả đoạn dài.

### B. Giữ nguyên thuật ngữ chuyên ngành tiếng Anh chuẩn
Giữ nguyên các thuật ngữ kỹ thuật cốt lõi ở tiêu đề và nội dung để đảm bảo tính chuẩn xác học thuật và tra cứu toàn cầu:
- *Linear Algebra & Spectral Theory:* `Eigenvalues & Eigenvectors`, `Singular Value Decomposition (SVD)`, `Low-Dimensional Manifold and Representation Directions`, `Principal Subspace`, `Minor Subspace`, `Orthogonal Basis`, `Rank Deficiency`.
- *Model Architecture & Training:* `Self-Attention`, `Feed-Forward / MLP`, `Residual Connection`, `Batch Normalization`, `Layer Normalization`, `Down-projection`, `Up-projection`, `Linear Bottleneck`, `Gradient Flow`, `Backpropagation`.
- *PEFT & Continual Learning:* `Low-Rank Adaptation (LoRA)`, `Singular-Subspace Drift (SD)`, `Spectral Calibration`, `Catastrophic Forgetting`, `Zero Inference Overhead`.
- *MLOps & Systems:* `Feature Store`, `Data Versioning`, `Model Registry`, `Continuous Training (CT)`, `Inference Latency`, `Throughput`.

### C. Độ chính xác kỹ thuật trong câu chữ
- **Phân biệt rành mạch quy mô:** 
  - Toàn bộ mô hình có *hàng tỷ tham số* (7B, 70B parameters).
  - Từng ma trận trọng số đơn lẻ $W_0$ có *hàng chục triệu tham số* (~16.7M parameters).
  - Adapter rank thấp có *hàng chục nghìn tham số* (~65K parameters).
- **Tránh lặp từ:** Không lặp lại cùng một động từ/danh từ mang tính mô tả trong các câu liền kề (ví dụ: tránh dùng liên tiếp "mở rộng", "thêm vào", "nâng cao").
- **Dùng từ ngữ kỹ thuật chuẩn xác:** 
  - *Thay vì:* "thêm trọng số vào mô hình"
  - *Nên dùng:* "điều chỉnh trọng số bằng cách cộng thêm một lượng biến thiên $\Delta W$"
  - *Thay vì:* "phân rã SVD trên mô hình"
  - *Nên dùng:* "phân rã SVD trên chính ma trận trọng số gốc $W_0$"

---

## 3. Quy chuẩn Trình bày Công thức Toán học (Mathematical Pedagogy & Formatting)

Việc viết công thức tổng quát là bắt buộc để đảm bảo tính chặt chẽ, nhưng **luôn phải giả định rằng công thức tổng quát trừu tượng gây khó khăn cho người đọc**. Do đó, tùy theo ngữ cảnh bài học, bắt buộc áp dụng 1 trong 2 luồng sư phạm sau:

### A. Hai Hướng Tiếp cận Sư phạm Toán học

1. **Cách 1: Đi từ Cơ bản $\to$ Nâng cao (Bottom-Up — Ví dụ đơn giản $\to$ Trực giác $\to$ Công thức tổng quát):**
   - **Áp dụng khi:** Giới thiệu khái niệm toán học mới, trừu tượng hoặc phức tạp (ví dụ: giải thích SVD, Không gian con kỳ dị, Phép chiếu, Eigenvalues, Convolution).
   - **Quy trình:**
     1. Đưa ra ví dụ trực quan số học 2D cực kỳ đơn giản (như ma trận $2 \times 2$).
     2. Chỉ ra trực giác hình học (sự xoay trục, lệch góc $\theta$, co dãn năng lượng).
     3. Khái quát hóa lên công thức tổng quát $d \times k$ hoặc không gian $N$ chiều.

2. **Cách 2: Đi từ Tổng quát $\to$ Thay số thực tế (Top-Down — Công thức tổng quát $\to$ Thế số $\to$ Định lượng):**
   - **Áp dụng khi:** Nhắc lại (recap) nhanh một kiến trúc đã biết, hoặc khi cần trình bày khung tổng quan trước khi bóc tách (ví dụ: kiến trúc LoRA adapter, LayerNorm, Loss function).
   - **Quy trình:**
     1. Nêu công thức tổng quát kèm kích thước (Shape) rõ ràng.
     2. Thế số cụ thể từ mô hình thực tế (như LLaMA 7B/8B).
     3. Rút ra kết luận so sánh định lượng trực quan (như giảm 256 lần tham số).

### B. Quy tắc Định dạng Công thức (Formatting Rules)
1. **Tách thành từng dòng riêng biệt (BlockMath):** Tuyệt đối không nhồi nhét phương trình phức tạp vào giữa dòng văn bản.
2. **Kèm kích thước (Shape) rõ ràng:** Sử dụng `\underbrace` để chú thích số chiều của từng tensor/ma trận:
   ```mdx
   <BlockMath formula="\Delta W \in \mathbb{R}^{d \times k} = \underbrace{B}_{\mathbb{R}^{d \times r}} \cdot \underbrace{A}_{\mathbb{R}^{r \times k}}" />
   ```
3. **Luôn có dòng thế số thực tế:** Đi kèm ví dụ cụ thể cho mô hình/hệ thống thực tế (ví dụ: LLaMA 7B/8B với $d=4096, k=4096, r=8$):
   ```mdx
   <BlockMath formula="\Delta W \in \mathbb{R}^{4096 \times 4096} = \underbrace{B}_{4096 \times 8} \cdot \underbrace{A}_{8 \times 4096}" />
   ```
4. **Định lượng so sánh trực quan:** Luôn tính toán số lượng tham số / FLOPs cụ thể và tỷ lệ chênh lệch (ví dụ: $65{,}536$ tham số — nhỏ hơn 256 lần so với ma trận gốc $16.7\text{M}$).

---

## 4. Quy chuẩn Lựa chọn và Tạo Hình ảnh Minh họa (Visual-First & Illustration Standards)

### A. Quy tắc Vàng: Dùng Hình ảnh (Image) Tóm tắt Nội dung Dài & Phức tạp
Khi gặp một phần kiến thức có dung lượng văn bản dài, lý thuyết trừu tượng hoặc chuỗi lập luận nhiều bước:
- **Bắt buộc sử dụng 1 Hình ảnh Minh họa (Summary Illustration / Visual Anchor)** đặt ngay đầu phần để cô đọng toàn bộ ý chính thành mô hình tư duy trực quan (mental model).
- **Nguyên tắc 80/20:** Người đọc chỉ cần nhìn hình ảnh minh họa là đã nắm bắt được **80% bản chất và dòng chảy câu chuyện**. Phần văn bản (text) bên dưới chỉ đóng vai trò thuyết minh bổ trợ ngắn gọn, không lặp lại dài dòng.

### B. Ma trận Chuyển đổi Trực quan (Visual Replacement Matrix)
Tùy theo loại thông tin, chuyển đổi trực tiếp thành hình ảnh / sơ đồ thay vì viết văn xuôi:

| Loại thông tin | Thay vì dùng Bullet Point / Đoạn văn | Chuyển đổi thành Visual Component / Illustration |
| :--- | :--- | :--- |
| **1 Con số / Metric then chốt** | Câu văn dài chứa số liệu | **Stat Hero Card / Metric Badge:** Thẻ làm nổi bật con số siêu to (`256×`, `0.1%`, `99%`) kèm nhãn ngắn (1–2 từ) và mini gauge / progress bar. |
| **1 Keyword / Khái niệm cốt lõi** | Định nghĩa chữ dài dòng | **Spotlight Concept Card:** Thẻ viền pastel nổi bật với Keyword in đậm và một **phép ẩn dụ thị giác** (Ổ khóa = Frozen Weights, Phễu = Bottleneck, Nam châm = Attention). |
| **Phân loại / Nhiều ý con** | Danh sách gạch đầu dòng nhiều cấp | **Hierarchy Tree / Branching Cards (`<ConceptHierarchy />`):** Sơ đồ cây phân cấp. **Quy tắc định dạng:** Root node luôn là **keyword ngắn gọn (không subtitle)**, các Leaf nodes **bắt buộc đánh số thứ tự vào keyword** (`1. ...`, `2. ...`) kèm `detail` súc tích và màu sắc `tone` phân biệt. |
| **So sánh Đối chiếu** | Bảng text ưu/nhược điểm | **Dual Side-by-Side Panels:** 2 thẻ đặt song song (*Before vs After*, *Standard vs Proposed*) với màu nền đối lập nhẹ (soft red vs soft green). |
| **Quy trình / Trình tự** | Liệt kê Bước 1, Bước 2, Bước 3 | **Sequential Conveyor / Pipeline Flow:** Băng chuyền các khối thao tác nối nhau bởi mũi tên dòng chảy dữ liệu. |
| **Tỷ lệ & Năng lượng** | Giải thích phần trăm bằng lời | **Stacked Energy Bar / Balance Scale:** Thanh pin chia phân đoạn ($99\%$ vs $1\%$) hoặc cán cân thể hiện sự chênh lệch trọng lượng. |
| **Tác động & Lỗi phát sinh** | Mô tả lỗi bằng lời | **Cause-and-Effect Card:** Hộp nguyên nhân $\xrightarrow{\text{kích hoạt}}$ Hộp hậu quả kèm biểu cảm trực quan của mascot. |

### C. Vị trí đặt hình ảnh trong bài
- Đặt khối minh họa `<LessonImage ... />` ngay sau khi giới thiệu công thức/cấu trúc tổng quan và trước khi bóc tách chi tiết từng thành phần phụ.
- Giúp người học có ngay bức tranh tổng thể (mental model) trước khi đọc phân tích chi tiết.

### D. Phong cách minh họa (Educational Doodle 16:9)
Áp dụng thống nhất cho tất cả các domain trong Learning Lab:
- **Tỷ lệ:** 16:9 Landscape.
- **Layout:** Từ 2 đến 4 thẻ bo góc (rounded cards/panels) nằm ngang trên nền trắng hoặc pastel sáng.
- **Nét vẽ:** Viền đen vẽ tay đậm (bold black hand-drawn outlines), màu điểm xuyết pastel thanh lịch, mascot hình que thân thiện minh họa hành động.
- **Nguyên tắc "Visual First":** Hình vẽ phải tự giải thích được ý tưởng thông qua vật thể, mũi tên, khối hộp, cán cân, dòng chảy dữ liệu; hạn chế tối đa chữ viết (chỉ giữ nhãn 1–3 từ, không chèn đoạn văn hay công thức dày đặc vào ảnh).

### E. Quy trình Khởi tạo Hình ảnh & Tạo Placeholder
- **Tuân thủ Template chuẩn:** Hình ảnh luôn được thiết kế theo đúng template giáo dục chuẩn tại [`.agents/rules/learning-lab-image-generation.md`](.agents/rules/learning-lab-image-generation.md).
- **Hỏi ý kiến User trước khi tạo ảnh thật:** Do việc sinh ảnh (image generation) phức tạp và cần thống nhất trước về ý tưởng thị giác (visual metaphor), tuyệt đối **không tự ý chạy công cụ tạo ảnh ngay** mà phải tóm lược ý tưởng đề xuất và hỏi ý kiến user trước.
- **Tạo Placeholder minh họa ngay trong bài:** Để creator và người đọc dễ hình dung bố cục bài viết, hãy tạo ngay một **khối Placeholder** tại vị trí dự định đặt ảnh (bằng sơ đồ khối ASCII hoặc thẻ `<LessonImage ... />` kèm `alt` và `caption` mô tả chi tiết nội dung tranh).

---

## 5. Quy chuẩn Đồng bộ Metadata & Mục lục (Catalog Sync)

Mỗi file MDX bài học phải tuân thủ nghiêm ngặt tính toàn vẹn hệ thống:

1. **`lessonMetadata.title`:** Phải khớp 100% từng ký tự (kể cả số thứ tự) với `title` tương ứng của locale trong file `table-of-contents.ts` của domain.
2. **`lessonMetadata.headings`:** Phải chứa danh sách chính xác các tiêu đề `### Heading` xuất hiện trong nội dung bài học.
3. **Tập trung ngôn ngữ tiếng Việt (`.vi.mdx`):** Toàn bộ bài học trong Learning Lab hiện tại tập trung 100% vào tiếng Việt (`.vi.mdx`). Mọi hoạt động biên soạn, tinh chỉnh câu chữ, công thức và trực quan hóa đều thực hiện trực tiếp trên file `.vi.mdx`.

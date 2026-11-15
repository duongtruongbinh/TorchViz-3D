---
title: "Deep Learning Chapter 1.2: CNN Foundations, Classic Architectures, U-Net & Interleaved Quizzes"
status: done
created: 2026-11-16T03:10:00+07:00
updated: 2026-11-16T03:45:00+07:00
author: khiem
task: "Author Chapter 1.2 Convolutional Neural Networks (CNNs) including CNN foundations, comparative analysis of classic/modern CNN architectures (LeNet, AlexNet, VGG, Inception, ResNet), U-Net for semantic segmentation, interleaved quizzes, interactive Light-Mode SVG diagrams, regenerated educational doodles, and a PyTorch Code Lab."
supersedes: []
---

# Goal

Author the full **Chapter 1.2: Convolutional Neural Networks (CNNs)** curriculum in `src/content/learning/deep-learning/` based on the user's 3 reference notes (`Convolutional_Neural_Network.pdf`, `Popular_CNN_architectures.pdf`, `UNet.pdf`), refining mathematical precision, regenerating/replacing low-quality diagrams with clean Light-Mode interactive SVG components and educational doodle illustrations, splitting heavy topics into digestible nodes, and interleaving **Quiz** nodes and a **Code Lab**.

# Scope

- **In scope**:
  - Update `src/content/learning/deep-learning/table-of-contents.ts` for track `convolutional-neural-networks` (`1.2`) to include 10 structured nodes (6 theory lessons, 3 interleaved quizzes, 1 PyTorch Code Lab).
  - Author 10 Vietnamese `.vi.mdx` files (`1.2.1` through `1.2.10`) following `learning-lab-authoring` and `ai-unslop` standards.
  - Create interactive Light-Mode SVG components in `src/components/learning/domains/deep-learning/` (sliding convolution & filter explorer, padding/stride/receptive-field visualizer, pooling & parameter table breakdown, architecture comparison & bottleneck/residual block diagrams, U-Net encoder-decoder skip-connection diagram) and register them in `mdxComponents.tsx` and `src/content/learning/mdxComponents.ts`.
  - Generate canonical 16:9 Light-Mode educational doodle illustrations where appropriate and store them under `src/assets/learning/deep-learning/`.
  - Sync catalog stats (`npm run sync:catalog-stats`) and update `src/lib/learningCatalog.test.ts` if lesson counts change.
- **Out of scope**:
  - Modifying Learning Lab core routing or UI shell outside `deep-learning`.

# Planned 10-Node Curriculum for Chapter 1.2 (`convolutional-neural-networks`)

1. **`1.2.1-convolution-operation.vi.mdx` — Tại sao cần CNN & Phép Tích chập (Convolution & Kernel)** (2 pages)
   - **Page 1:** Hạn chế của `Flatten + Fully Connected` trên ảnh 2D/RGB ($32 \times 32 \times 3 \to 3{,}072$ chiều): mất cấu trúc lân cận 2D, bùng nổ tham số, nhạy cảm dịch chuyển; tư duy giữ nguyên lưới 2D và chia sẻ trọng số (*Weight Sharing*).
   - **Page 2:** Khái niệm Kernel/Filter $k \times k$ ($k$ lẻ), ẩn dụ "chiếc kính lúp" soi từng vùng cục bộ, phép nhân element-wise rồi cộng tổng ($Y = X \otimes W$), và bộ lọc thực tế (Identity, Edge Detection, Sharpen, Box Blur) kèm interactive diagram.

2. **`1.2.2-padding-stride-receptive-field.vi.mdx` — Padding, Stride & Receptive Field** (3 pages)
   - **Page 1:** Vấn đề co kích thước & mất thông tin biên khi trượt kernel; kỹ thuật **Zero Padding ($p$)** (`Valid` vs `Same` padding).
   - **Page 2:** **Stride ($s$)**, điều kiện bước nhảy hợp lệ, công thức tổng quát:
     $$H_{\text{out}} = \left\lfloor \frac{H_{\text{in}} - k + 2p}{s} \right\rfloor + 1, \quad W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} - k + 2p}{s} \right\rfloor + 1$$
     (Phân biệt rõ số $+1$ đếm cửa sổ đầu tiên trong công thức không gian với $+1_{\text{bias}}$ trong công thức đếm tham số).
   - **Page 3:** Tích chập trên ảnh nhiều kênh (RGB $3\text{D}$ tensor), chồng nhiều bộ lọc tạo **Feature Maps**, **Point-wise Conv ($1 \times 1$)** đổi chiều sâu, **Receptive Field** và phân cấp đặc trưng (*Low-level $\to$ Mid-level $\to$ High-level*).

3. **`1.2.3-pooling-and-feature-maps.vi.mdx` — Pooling, Batch Norm & Đếm Tham số CNN** (3 pages)
   - **Page 1:** **Max Pooling**, **Average Pooling**, **Global Average Pooling (GAP)**: cơ chế giảm chiều không gian, tăng tính bất biến dịch chuyển nhỏ, chống overfitting với **$0$ tham số học**; tại sao Max Pooling phù hợp để giữ đặc trưng mạnh (như chữ trắng trên nền đen MNIST).
   - **Page 2:** **Batch Normalization** trong CNN (`BatchNorm2d`, $4 \times C$ tham số) và bộ công thức đếm tham số chuẩn cho `Conv2d` ($((K \times K \times C_{\text{in}}) + 1) \times C_{\text{out}}$) và `Linear` ($(D_{\text{in}} + 1) \times D_{\text{out}}$).
   - **Page 3:** Giải phẫu & tính tay từng tầng cho 2 kiến trúc CNN thực tế (bao gồm cả `padding='same'`, `dilation_rate=2`, `BatchNorm`, `Dropout`, và `Conv 1×1`).

4. **`1.2.4-cnn-foundations-quiz.vi.mdx` — Quiz: Nền tảng CNN & Đếm Tham số** (8 questions)
   - Đan xen kiểm tra kiến thức từ `1.2.1`–`1.2.3`: điểm yếu Flatten+FC, phép tính $X \otimes W$, Padding/Stride, $1 \times 1$ Conv, Pooling ($0$ params), và bài tập tính nhanh Output Shape + số Params.

5. **`1.2.5-classic-cnn-architectures.vi.mdx` — Các Kiến trúc CNN Kinh điển (Phần 1): LeNet-5, AlexNet & VGG-16** (3 pages)
   - **Page 1: LeNet-5 (1998):** Chuẩn mực `CONV → POOL → FC`, phân tích chi tiết 7 tầng & cách tính $61{,}706$ tham số, bối cảnh lịch sử (`AvgPool`, `Tanh/Sigmoid`, kernel $5 \times 5$).
   - **Page 2: AlexNet (2012):** Bước nhảy $60\text{M}$ tham số trên ảnh màu RGB $224 \times 224$, tại sao đổi `Tanh` $\to$ `ReLU` và `AvgPool` $\to$ `MaxPool` (Overlapping), `Dropout`, `Data Augmentation`; phản biện việc dùng kernel lớn ($11 \times 11, 5 \times 5$) & `LRN`; giải mã câu hỏi bẫy về 2 luồng song song (chia 2 GPU GTX 580 do giới hạn VRAM 3GB).
   - **Page 3: VGG-16 (2014):** Triết lý thay kernel lớn bằng chuỗi kernel nhỏ $3 \times 3$ đồng nhất (`Conv 3×3 × n → MaxPool`); chứng minh bằng Receptive Field và bài toán tiết kiệm tham số ($2 \times 3 \times 3$ tốn $54$ params so với $1 \times 5 \times 5$ tốn $75$ params khi $C=3$, lại có thêm tầng phi tuyến `ReLU`).

6. **`1.2.6-modern-cnn-inception-resnet.vi.mdx` — Các Kiến trúc CNN Kinh điển (Phần 2): Inception & ResNet** (3 pages)
   - **Page 1: Inception-v1 / GoogLeNet (2014):** Tư duy mở rộng theo chiều rộng (Multi-scale branches: $1 \times 1, 3 \times 3, 5 \times 5, \text{MaxPool}$ ghép `Concat` để bắt vật thể đa kích thước); bài toán giảm $\sim 10\times$ chi phí tính toán nhờ **Bottleneck $1 \times 1$ Conv** ($120.4\text{M} \to 12.4\text{M}$ ops); **Auxiliary Classifiers** ($\mathcal{L}_{\text{total}} = \mathcal{L}_{\text{main}} + 0.3\mathcal{L}_{\text{aux1}} + 0.3\mathcal{L}_{\text{aux2}}$) và `GAP` giúp mạng 22 tầng chỉ nặng $5\text{M}$ params.
   - **Page 2: Inception-v2/v3 & Depthwise Separable Conv:** Phân rã $5 \times 5 \to 2 \times (3 \times 3)$, phân rã bất đối xứng $n \times n \to 1 \times n + n \times 1$, và **Depthwise Separable Convolution** cho thiết bị di động (MobileNet).
   - **Page 3: ResNet-50 (2015) & Bảng Tổng hợp So sánh:** Cơ chế **Skip Connection** ($y = \mathcal{F}(x) + x$) chống vanishing gradient và bảo toàn đặc trưng; khối **Bottleneck Residual Block** ($1 \times 1 \text{ nén} \to 3 \times 3 \to 1 \times 1 \text{ khôi phục}$), phân biệt **Identity Block** vs **Projection Block**, cùng bảng đối chiếu toàn diện 5 kiến trúc (`LeNet-5`, `AlexNet`, `VGG-16`, `Inception`, `ResNet`).

7. **`1.2.7-cnn-architectures-quiz.vi.mdx` — Quiz: So sánh & Giải phẫu Các Kiến trúc CNN** (8 questions)
   - Đan xen kiểm tra kiến thức từ `1.2.5`–`1.2.6`: lợi ích xếp chồng $3 \times 3$ của VGG, vai trò $1 \times 1$ Bottleneck & Auxiliary Loss trong Inception, câu hỏi bẫy AlexNet 2 GPU, động lực học của nhánh chính/nhánh phụ, và Skip Connection trong ResNet.

8. **`1.2.8-unet-semantic-segmentation.vi.mdx` — Kiến trúc U-Net & Phân đoạn Ảnh Ngữ nghĩa (Semantic Segmentation)** (3 pages)
   - **Page 1:** Bài toán **Semantic Segmentation** (phân loại từng pixel, ứng dụng trong ảnh Y khoa & xe tự hành); mâu thuẫn giữa **Tầng nông độ phân giải cao** (giữ chi tiết vị trí *Where / Pixel Location*) và **Tầng sâu độ phân giải thấp** (giàu ngữ nghĩa *What / Semantic* nhưng mất biên giới sắc nét).
   - **Page 2:** Giải phẫu cấu trúc chữ **U** đối xứng (Ronneberger et al., 2015): **Contracting Path (Encoder)** nén không gian & tăng kênh ($64 \to 1024$), **Bottleneck**, và **Expansive Path (Decoder)** dùng `Up-convolution (Transposed Conv 2×2)` khôi phục độ phân giải + `Conv 1×1` xuất bản đồ xác suất từng pixel.
   - **Page 3:** Cơ chế **Skip Connections (Copy & Concatenate)** nối ngang từng cặp Encoder–Decoder cùng cấp độ phân giải: kết hợp biên sắc nét từ Encoder với vùng ngữ nghĩa từ Decoder; giải đáp tại sao chỉ nối ngang các khối cùng kích thước $(H, W)$ và phân biệt phép `Concat` của U-Net với phép cộng `+` của ResNet.

9. **`1.2.9-unet-and-segmentation-quiz.vi.mdx` — Quiz: Receptive Field, Semantic Segmentation & U-Net** (6 questions)
   - Kiểm tra kiến thức phần U-Net: đánh đổi độ phân giải vs Receptive Field, vai trò Encoder/Decoder/Skip Connection, phép ghép kênh `Concat`, và lớp `Conv 1×1` cuối mạng.

10. **`1.2.10-cnn-code-lab.vi.mdx` — Code Lab: Huấn luyện CNN, Soi Feature Maps & Cài đặt U-Net với PyTorch** (2 pages)
    - **Page 1:** Xây dựng & huấn luyện CNN trên ảnh với PyTorch (`nn.Conv2d`, `nn.BatchNorm2d`, `nn.MaxPool2d`), kiểm chứng bảng tham số `torchinfo.summary` với công thức tính tay, và trực quan hóa **Feature Maps** qua các tầng nông $\to$ sâu.
    - **Page 2:** Tự cài đặt `ResidualBlock` (ResNet) và mô hình `MiniUNet` (Encoder + Bottleneck + `ConvTranspose2d` Decoder + `torch.cat` Skip Connections), kiểm tra kích thước tensor $(B, C, H, W)$ qua từng bước.

# Verification Plan

- Run `npm run sync:catalog-stats` and `npm run check:catalog-stats`.
- Run `npx biome check` on all new/modified `.ts` and `.tsx` files.

# Execution Log

- Updated `src/content/learning/deep-learning/table-of-contents.ts` with 10 published nodes in Chapter `1.2 Convolutional Neural Networks (CNNs)` (`1.2.1`–`1.2.10`).
- Authored 10 Vietnamese `.vi.mdx` lessons, quizzes, and Code Lab (`1.2.1` through `1.2.10`).
- Created interactive Light-Mode SVG diagrams (`ConvolutionOperationExplorer.tsx`, `PaddingStrideExplorer.tsx`, `PoolingAndParamsExplorer.tsx`, `InceptionBottleneckAndUnetDiagram.tsx`) and registered them in `mdxComponents.tsx` and `src/content/learning/mdxComponents.ts`.
- Generated 2 canonical 16:9 educational doodle illustrations (`cnn_flatten_vs_sliding_kernel.jpg`, `unet_where_plus_what.jpg`) and extracted/cleaned 11 high-resolution white-background reference diagrams into `src/assets/learning/deep-learning/`.
- Synced `wiki/reference/catalog-stats.md`, `wiki/concepts/learning-lab.md`, and `src/lib/learningCatalog.test.ts` (`987` total lessons, `535` published).

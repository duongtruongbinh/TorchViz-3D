---
title: Continual Learning Curriculum, Interactive Labs, and Learning Lab Framework Refinements
status: done
created: 2026-09-09T11:40:00+07:00
updated: 2026-09-12T10:50:00+07:00
author: nmkhiem
task: "Curriculum overhaul, interactive code labs, and framework UI refactoring for Continual Learning LLM domain"
---

# Bối cảnh & Mục tiêu

Nhánh `feat/continual-learning-domain` thực hiện chuẩn hóa toàn diện domain **Continual Learning for LLMs**, xây dựng 2 bài thực hành code lab chuyên sâu, tinh chỉnh hệ thống giao diện Learning Lab và bổ sung bộ nguyên tắc đánh giá sư phạm.

---

# 1. Khung Kỹ thuật & Giao diện Learning Lab

- **Tiêu đề trang động từ nội dung MDX (`pageHeadings`):**
  - Trích xuất tự động heading đầu tiên (`h2`–`h6`) của từng trang `<MdxPage>` trong quá trình build-time / load lesson.
  - Hiển thị tiêu đề này lên thanh header của `LessonDetail`, đồng thời ẩn heading trùng lặp trong nội dung bằng class `sr-only` để đảm bảo ngữ nghĩa và khả năng tiếp cận (screen reader).
  - Fallback an toàn về tiêu đề bài học từ catalog đối với các trang không có heading riêng biệt hoặc trang tài liệu tham khảo.

- **Chuẩn hóa Callout `<LessonNote>`:**
  - Thiết kế lại hệ thống callout theo bảng màu Light Mode chuẩn (`#205089`, `#2E8A5A`, `#2E7BC4`, `#56B92A`, `#D5962F`, `#F43F5E`).
  - Hỗ trợ các tone ngữ cảnh rõ ràng: `note`, `info`, `tip`, `warning`, `danger`, `success` đi kèm icon Lucide tương ứng.
  - Thêm cơ chế fallback an toàn về `default` khi gặp tone không định nghĩa.

- **Tối ưu hiển thị & Chống tràn Layout:**
  - Bổ sung `grid-cols-1`, `min-w-0`, `break-words` vào `.learning-mdx-content` và các container con.
  - Sửa lỗi hiển thị co giãn của `<Flowchart />` (`min-w-0`, overflow scrolling) và đường nối phân cấp của `<ConceptHierarchy />`.

- **Bộ quy tắc sư phạm (Pedagogical Judgment Checklist):**
  - Bổ sung Phần 6 vào `.agents/rules/learning-lab-authoring.md` và skill `learning-lab-authoring`:
    1. *Terminology Familiarity Audit:* Kiểm tra tần suất và điểm xuất hiện đầu tiên của thuật ngữ chuyên ngành.
    2. *Concept Retention & Recall Audit:* Mô hình suy giảm trí nhớ qua khoảng cách bài đọc để đặt điểm nhắc lại (recap).
    3. *Design Component Selection Logic:* Bảng định tuyến chọn component UI phù hợp theo mục đích truyền tải.

---

# 2. Nội dung Bài học & Các Code Lab

### A. Tinh chỉnh Nền tảng (Chapter 1)
- Tinh gọn luồng diễn giải tổng quan Continual Learning, bổ sung hình vẽ minh họa cân bằng Stability-Plasticity dạng đòn bẩy trực quan.
- Bổ sung baseline kiểm thử held-out độc lập trong lab Quên lãng Thảm khốc (Catastrophic Forgetting).
- **Lab TIL, DIL, CIL (`1.1.11` + Quiz `1.1.12`):**
  - Thực nghiệm hóa 3 kịch bản học tăng dần trên dữ liệu thực tế (MASSIVE cho TIL/CIL, Amazon Reviews Multi cho DIL).
  - Cố định backbone Transformer (Multilingual MiniLM), so sánh hành vi định tuyến task ID, domain shift và cạnh tranh không gian nhãn.

### B. Mở rộng Phương pháp & Benchmark Chuẩn hóa (Chapter 2)
- Cập nhật lý thuyết Experience Replay và giới hạn của bộ nhớ đệm nhỏ.
- **Lab Sequential CL Baseline (`2.1.5` + Quiz `2.1.6`):**
  - Kế thừa protocol chuẩn từ O-LoRA (Wang et al., 2023 - task order 1: DBPedia $\to$ Amazon $\to$ Yahoo $\to$ AG News) và EasyCL.
  - Thu nhỏ kiến trúc phù hợp phần cứng phổ thông (SmolLM2 360M trên GPU Colab T4 đơn).
  - Xây dựng ma trận đánh giá đầy đủ $R_{i,j}$ ($4 \times 4$), đo lường chính xác Average Accuracy và Backward Transfer (BWT) giữa Sequential Fine-tuning (SeqFT) và Replay.
  - Thảo luận sâu về động lực suy giảm loss, sự đánh đổi tỷ lệ replay và vai trò của tri thức pre-training.

### C. Đánh số lại và Đồng bộ Catalog
- Cập nhật `table-of-contents.ts`, `papers.ts`, `citationEvidence.ts` và 16 file MDX downstream.
- Khóa toàn bộ 42 cặp Theory/Quiz liền kề, nâng tổng số bài học Continual Learning lên 85 bài (toàn bộ catalog: 777 bài).

---

# 3. Kết quả Xác minh

- `npm run verify` kiểm tra toàn bộ hệ thống:
  - `tsc --noEmit`: 0 lỗi type.
  - Vitest: 161/161 tests passed (bao gồm kiểm thử catalog, MDX syntax, trích xuất page headings, tính phân bố đáp án quiz).
  - Production build: Thành công toàn bộ bundles.

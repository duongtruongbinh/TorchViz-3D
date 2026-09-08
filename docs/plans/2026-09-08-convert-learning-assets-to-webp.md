# Plan: Chuyển đổi toàn bộ Learning Assets từ PNG sang WebP

Date: 2026-09-08
Branch: fix/change-image-type

## Bối cảnh & Mục tiêu
- Dung lượng repository và `dist/` build output hiện tại là 169 MB, vượt qua hạn mức 100 MB của gói Vercel Hobby.
- Trong đó, `src/assets/learning/` chứa 142 file PNG uncompressed với tổng dung lượng 112 MB, kéo theo `dist/assets/` lên tới 133 MB.
- Mục tiêu: Chuyển đổi toàn bộ 142 file PNG sang WebP (quality=85, method=6), cập nhật các tham chiếu MDX và code, giảm dung lượng `dist/` xuống ~60 MB.

## Các bước thực hiện
1. **Viết script chuyển đổi ảnh**:
   - `scripts/convert-png-to-webp.py`: dùng Pillow 12.3.0 chuyển đổi tất cả file `.png` trong `src/assets/learning/` sang `.webp`.
   - Giữ nguyên độ trong suốt (alpha) nếu có, nén chất lượng cao.
   - Xác thực mở lại file `.webp` trước khi xóa file `.png` gốc.
2. **Cập nhật mã nguồn & MDX**:
   - `src/components/learning/domains/llm-ai-engineering/conceptRenderers.tsx`: cập nhật 4 đường dẫn ảnh sang `.webp`.
   - `src/components/learning/learningMdxComponents.tsx`: bổ sung fallback `.png -> .webp` trong `LessonImage`.
   - Toàn bộ các file `.mdx` trong `src/content/learning/`: thay thế `assetPath="...png"` thành `assetPath="...webp"`.
3. **Kiểm thử & Đo lường**:
   - Chạy `npm run verify` (`tsc`, test suite, và `vite build`).
   - Đo lại kích thước `src/assets/` và `dist/`.

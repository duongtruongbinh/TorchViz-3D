# Hướng Dẫn Thiết Lập Cloudflare R2 & Đồng Bộ Assets Cho TorchViz-3D

Tài liệu này hướng dẫn chi tiết cách thiết lập **Cloudflare R2** (Object Storage S3-compatible không tính phí egress) để lưu trữ và phân phối hình ảnh bài học của TorchViz-3D, cùng cách sử dụng script tự động đồng bộ.

---

## 1. Tại Sao Dùng Cloudflare R2?

1. **Không tính phí egress (Egress-free):** Cloudflare R2 không tính phí tải dữ liệu ra Internet (khác với AWS S3 hay Google Cloud Storage).
2. **Miễn phí 10GB lưu trữ / tháng:** Đủ cho toàn bộ hình ảnh và tài nguyên bài học của repo.
3. **Tích hợp mạng CDN toàn cầu:** Tốc độ tải ảnh nhanh và độ trễ thấp ở mọi khu vực.
4. **Chuẩn S3-compatible:** Sử dụng trực tiếp các công cụ và SDK tương thích AWS S3.

---

## 2. Các Bước Thiết Lập Trên Cloudflare Dashboard

### Bước 1: Tạo R2 Bucket
1. Đăng nhập vào [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Chọn mục **R2** trên thanh điều hướng bên trái.
3. Nhấp **Create bucket**.
4. Đặt tên bucket, ví dụ: `torchviz-assets`.
5. Chọn vùng lưu trữ (Location: Automatic hoặc chọn khu vực gần nhất), sau đó nhấp **Create Bucket**.

### Bước 2: Bật Truy Cập Công Khai (Public Development URL hoặc Custom Domains)

Trên giao diện mới của Cloudflare, trong tab **Settings** của bucket (như hình ảnh của bạn), tính năng public được chia thành 2 mục rõ ràng:

- **Cách 1: Bật Public Development URL (Nhanh nhất - Dùng ngay không cần có tên miền riêng)**
  1. Cuộn xuống mục **Public Development URL** (hoặc nhấp vào menu *Public Development URL* ở thanh bên trái).
  2. Nhấp vào nút **Enable** màu xanh ở góc phải.
  3. Xác nhận bật (*Allow access*).
  4. Cloudflare sẽ cấp cho bạn một URL công khai dạng: `https://pub-xxxxxxxxxxxxxxxx.r2.dev`. Đây chính là URL dùng cho `VITE_ASSETS_CDN_URL`.

- **Cách 2: Gán Custom Domains (Dành cho Production khi bạn có tên miền riêng trên Cloudflare)**
  1. Tại mục **Custom Domains**, nhấp vào nút **+ Add** ở góc phải.
  2. Nhập domain/subdomain mong muốn (ví dụ: `assets.yourdomain.com`).
  3. Nhấp **Continue** và làm theo hướng dẫn để Cloudflare tự động kết nối DNS và cấp SSL.

### Bước 3: Tạo R2 API Token (S3 Credentials)
1. Quay lại trang tổng quan **R2**.
2. Ở menu bên phải, nhấp vào **Manage R2 API Tokens**.
3. Nhấp **Create API token**.
4. Điền thông tin:
   - **Token name:** `torchviz-r2-sync`
   - **Permissions:** Chọn **Object Read & Write**
   - **Specify bucket(s):** Chọn bucket `torchviz-assets` (hoặc All buckets)
5. Nhấp **Create API Token**.
6. Lưu lại các thông tin hiển thị (chú ý: secret key chỉ hiển thị một lần duy nhất):
   - **Access Key ID**
   - **Secret Access Key**
   - **Account ID** (hoặc Endpoint URL: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`)

---

## 3. Cấu Hình Biến Môi Trường

Thêm biến môi trường trong **Vercel Dashboard → Settings → Environment Variables** (hoặc file `.env` khi dev local):

| Key | Value |
|-----|-------|
| `ASSETS_CDN_URL` | `https://pub-xxxx.r2.dev` hoặc custom domain |

> `vite.config.ts` đọc `ASSETS_CDN_URL` tại build time và inject vào client bundle qua `define`. Cùng một key dùng cho cả Vercel lẫn file `.env` local — không cần tiền tố `VITE_`.

```env
# Cloudflare R2 S3 Credentials
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=torchviz-assets

# Public URL hoặc Custom Domain phục vụ CDN
R2_PUBLIC_URL=https://assets.yourdomain.com

# Client-side CDN URL (Vercel env var + local .env đều dùng cùng key này)
ASSETS_CDN_URL=https://pub-xxxxxxxxxxxxxxxx.r2.dev
```

---

## 4. Sử Dụng Script Đồng Bộ Hình Ảnh

Dự án cung cấp script `scripts/syncR2Assets.ts` tích hợp sẵn trong `package.json`.

### Chạy thử (Dry-run)
Kiểm tra danh sách file sẽ được upload, dung lượng và trạng thái mà không ghi lên R2:
```bash
npm run sync:r2:dry-run
```

### Đồng bộ gia tăng (Incremental Sync)
Chỉ upload những ảnh mới hoặc ảnh có dung lượng thay đổi (bỏ qua những ảnh đã tồn tại giống hệt trên R2):
```bash
npm run sync:r2
```

### Buộc upload lại toàn bộ (Force upload)
Nếu bạn muốn ghi đè lại toàn bộ các file trên R2:
```bash
node scripts/syncR2Assets.ts --force
```

---

## 5. Cơ Chế Fallback Khi Tải Ảnh

Trong `LessonImage` component (`src/components/learning/learningMdxComponents.tsx`):
- `ASSETS_CDN_URL` được `vite.config.ts` đọc lúc build và inject thành hằng `__ASSETS_CDN_URL__` vào bundle.
- Khi `__ASSETS_CDN_URL__` có giá trị: Component tải ảnh từ Cloudflare CDN. Nếu gặp lỗi, tự động fallback về bundle cục bộ.
- Khi `__ASSETS_CDN_URL__` rỗng: Nạp từ bundle cục bộ (offline dev vẫn hoạt động bình thường).

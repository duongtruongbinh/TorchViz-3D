---
title: Learning Home Course Card Grid
status: done
created: 2026-07-14T00:00:00+07:00
updated: 2026-07-14T12:54:00+07:00
author: duongtruongbinh
task: "Rút gọn phần mục lục Learning Home và đổi catalog domain thành lưới thẻ dọc có nhận diện riêng."
supersedes:
  - docs/plans/2026-07-12-learning-lab-ui-ux-polish.md
---

# Goal

Làm Home Learning Lab gọn hơn và giúp 12 domain dễ phân biệt, dễ quét nhanh:
bỏ câu mô tả dư, chỉ giữ một tiêu đề catalog, và trình bày domain bằng các thẻ
dọc nhiều cột với màu/visual riêng.

# Lineage

Supersedes [2026-07-12-learning-lab-ui-ux-polish](./2026-07-12-learning-lab-ui-ux-polish.md),
plan đang sở hữu thiết kế Learning Home hiện tại.

# Decisions (locked)

- “Mỗi thẻ” trong yêu cầu là thẻ domain/course ở `DomainCatalog`, không thay đổi
  lesson rail hay lesson detail.
- Bỏ hẳn copy `syllabusBody`, gồm câu “Xem nhanh từng domain...” ở bản tiếng Việt.
- Hợp nhất `syllabusLabel` và `syllabusTitle` thành một heading ngắn, tránh hai
  dòng “Mục lục khóa học” / “Duyệt toàn bộ catalog Learning Lab” cùng mục đích.
- Mỗi domain có icon Lucide và palette riêng; visual là DOM/CSS nhẹ, không thêm
  ảnh tải ngoài hoặc dependency mới.
- Thẻ có tỷ lệ dọc, phần visual ở trên và nội dung/metadata ở dưới; desktop hiển
  thị nhiều thẻ hơn mỗi hàng, responsive vẫn không tràn ngang.
- Giữ nguyên catalog data, status, số bài học/practice, route và whole-card
  navigation.

# Phases

1. Cập nhật localized heading và xóa copy catalog dư.
2. Tách/reuse mapping icon domain và thêm palette visual theo domain.
3. Đổi `DomainCatalog` sang responsive portrait-card grid nhiều cột.
4. Chạy `npm run verify`; kiểm tra Home ở desktop và compact nếu môi trường cho phép.
5. Ghi execution log và cập nhật trang wiki Learning Lab hiện có nếu convention
   Home thực tế thay đổi.

# Out of scope

- Không đổi nội dung bài học, domain course page, lesson rail/detail, sidebar,
  header, routing hoặc catalog schema.
- Không thêm progress, rating, recommendation hay dữ liệu marketing mới.

# Execution log

- 2026-07-14T00:00:00+07:00 — Đã đọc workflow, repo briefing, Learning Lab
  plans/wiki, localization và implementation `DomainCatalog`; lưu draft plan.
- 2026-07-14T12:49:09+07:00 — User duyệt bằng “go”; plan chuyển qua
  `approved` rồi `executing`, bắt đầu sửa runtime.
- 2026-07-14T12:54:00+07:00 — Xóa `syllabusTitle`/`syllabusBody`, chỉ giữ một
  heading catalog; chuyển 12 domain sang responsive portrait-card grid và dùng
  icon/palette riêng qua `domainPresentation.ts`.
- 2026-07-14T12:54:00+07:00 — `npm run verify` đạt: TypeScript, 93 tests và
  production build đều pass; advisory Three.js chunk lớn không thay đổi.
- 2026-07-14T12:54:00+07:00 — Playwright xác nhận 1440px hiển thị 4 thẻ/hàng
  (thẻ đầu 253x440px), 390px hiển thị thẻ 366x410px không tràn ngang; route từ
  card mở đúng lesson, console có 0 errors và 0 warnings.
- 2026-07-14T12:54:00+07:00 — Đồng bộ convention Home mới vào trang wiki
  Learning Lab hiện có; plan hoàn tất.

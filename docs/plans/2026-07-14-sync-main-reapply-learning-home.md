---
title: Sync Main and Reapply Learning Home
status: done
created: 2026-07-14T12:55:00+07:00
updated: 2026-07-14T12:58:34+07:00
author: Codex
task: "Pull the latest main refactor and preserve or reapply the approved Learning Home card changes."
supersedes:
  - docs/plans/2026-07-14-learning-home-course-card-grid.md
---

# Goal

Cập nhật working tree lên `origin/main` mới nhất mà không mất thay đổi Home chưa
commit, giải conflict theo refactor mới của main và giữ lại kết quả UI đã duyệt.

# Lineage

Supersedes [2026-07-14-learning-home-course-card-grid](./2026-07-14-learning-home-course-card-grid.md).

# Decisions (locked)

- Tạo bản sao an toàn của toàn bộ thay đổi tracked và untracked trước khi pull.
- Fetch `origin`, cập nhật local `main` bằng fast-forward; không reset cứng.
- Nếu cấu trúc đổi lớn, ưu tiên implementation/architecture từ `origin/main`, rồi
  áp lại yêu cầu: bỏ copy trùng và dùng responsive portrait domain cards có
  icon/palette riêng.
- Không commit hoặc push trong task này.
- Sau merge/reapply, chạy `npm run verify` và kiểm tra conflict markers/status.

# Phases

1. Backup thay đổi hiện tại và fetch remote.
2. Fast-forward local main, sau đó restore/reapply thay đổi Home.
3. Giải conflict thủ công theo các quyết định trên.
4. Chạy verification, ghi execution log và đồng bộ docs nếu đường dẫn sở hữu đổi.

# Out of scope

- Không sửa các refactor mới của main ngoài phần cần thiết để tích hợp Home.
- Không commit, push, rebase lịch sử đã publish hoặc dùng destructive reset.

# Execution log

- 2026-07-14T12:55:00+07:00 — Kiểm tra local đang ở `main` commit `a516674`,
  Home changes chưa commit; lưu draft sync plan trước khi thao tác Git.
- 2026-07-14T12:56:00+07:00 — User duyệt bằng “go”; plan chuyển qua
  `approved` rồi `executing`.
- 2026-07-14T12:57:00+07:00 — Stash toàn bộ tracked/untracked changes, fetch
  `origin/main`, rồi fast-forward `main` từ `a516674` lên `6093693`
  (`Refactor/llm content pipeline (#42)`).
- 2026-07-14T12:57:00+07:00 — Giải conflict `DomainCatalog` bằng cách giữ MDX
  catalog/data flow mới của main và áp lại portrait-card grid. Bỏ practice count
  khỏi card vì refactor mới đã xóa catalog practice contract.
- 2026-07-14T12:57:00+07:00 — Giữ quyết định xóa copy catalog trùng trong
  localization; chuyển docs update từ wiki cũ đã bị main xóa sang
  `wiki/concepts/learning-lab.md`.
- 2026-07-14T12:58:34+07:00 — Chạy `npm install` theo lockfile mới và
  `npm run verify`: TypeScript pass, 107 tests pass, MDX validation pass và
  production build pass. Không còn conflict marker hay unmerged path; plan done.

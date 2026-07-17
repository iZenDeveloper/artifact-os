# Vertical Content OS - Getting Started Guide

Hướng dẫn fork Open Design và bắt đầu xây dựng Vertical Content OS.

## 1. Yêu cầu hệ thống

- Node.js >= 22 (khuyến nghị 24)
- pnpm >= 10.33
- Git
- (Tùy chọn) Docker & Docker Compose
- Một coding agent mạnh (Claude Code, Cursor, Windsurf, hoặc Grok CLI)

## 2. Bước 1: Fork và Clone Repository

```bash
# Fork repo trên GitHub trước
git clone https://github.com/<your-username>/open-design.git
cd open-design

# Thêm upstream để dễ cập nhật sau này
git remote add upstream https://github.com/nexu-io/open-design.git
git fetch upstream
```

## 3. Bước 2: Cài đặt dependencies

```bash
corepack enable
pnpm install
```

## 4. Bước 3: Chạy dự án ở chế độ development

### Chạy Web App + Daemon

```bash
pnpm tools-dev run web
```

Truy cập tại `http://localhost:3000` (hoặc port được chỉ định).

### Chạy với Docker (khuyến nghị cho production-like)

```bash
cd deploy
cp .env.example .env
# Chỉnh sửa .env nếu cần
docker compose up -d
```

Truy cập tại `http://localhost:7456`

## 5. Cấu trúc thư mục quan trọng cần nắm

```
open-design/
├── apps/
│   ├── web/              # Next.js frontend (UI)
│   ├── daemon/           # Node.js backend daemon
│   └── desktop/          # Electron app (tùy chọn)
├── skills/               # Nơi chứa tất cả skills ← QUAN TRỌNG
├── design-systems/       # Nơi chứa Design Systems ← QUAN TRỌNG
├── plugins/              # Nơi chứa plugins
├── docs/                 # Tài liệu gốc của Open Design
├── deploy/               # Docker & deployment config
└── prompt-templates/     # Prompt templates
```

## 6. Hiểu nhanh cách Open Design hoạt động

1. User nhập brief + chọn **Skill** + **Design System**
2. Web gửi request đến **Daemon**
3. Daemon load `SKILL.md` + `DESIGN.md`
4. Gọi Agent (Claude Code / Cursor...) để generate artifact
5. Artifact được preview trong sandboxed iframe
6. User export hoặc chỉnh sửa tiếp

## 7. Bắt đầu customize cho Vertical Content OS

### 7.1 Tạo cấu trúc cho multi-vertical (Khuyến nghị làm sớm)

Tạo các thư mục sau trong repo của bạn:

```
skills/
├── shared/                    # Skill dùng chung cho nhiều vertical
├── marketing/
│   ├── content-repurposer/
│   ├── social-content-factory/
│   └── ad-variants-generator/
├── education/
└── legal/

design-systems/
├── personal/
│   ├── minimal/
│   └── bold/
├── client/
│   └── professional-clean/
├── education/
└── legal/
```

### 7.2 Tạo Design System đầu tiên

1. Tạo thư mục `design-systems/personal/minimal/`
2. Tạo file `DESIGN.md` theo schema 9 phần của Open Design.
3. (Tùy chọn) Tạo `manifest.json`

### 7.3 Tạo Skill đầu tiên (ví dụ: content-repurposer)

1. Tạo thư mục `skills/shared/content-repurposer/`
2. Tạo file `SKILL.md` với YAML frontmatter + workflow chi tiết.
3. Thêm `assets/` và `references/` nếu cần.

## 8. Lệnh hữu ích

```bash
# Validate skill
od skill validate skills/shared/content-repurposer

# Chạy daemon ở chế độ dev
pnpm tools-dev run daemon

# Build production
pnpm build
```

## 9. Workflow phát triển khuyến nghị

1. Tạo branch mới cho từng vertical hoặc tính năng lớn.
2. Phát triển skill → test với agent thật → điều chỉnh.
3. Commit thường xuyên + viết docs ngắn gọn.
4. Sau khi có vài skill ổn → đóng gói thành Plugin.

## 10. Tài liệu tham khảo quan trọng

- `docs/skills-protocol.md` — Cách viết SKILL.md
- `docs/architecture.md` — Kiến trúc gốc của Open Design
- `design-systems/README.md` — Cách tạo Design System
- `plugins/spec/SPEC.md` — Cách tạo Plugin

## 11. Lời khuyên khi bắt đầu

- **Đừng sửa core** của Open Design quá nhiều ở giai đoạn đầu.
- Tập trung vào **Skills** và **Design Systems** trước.
- Test output thực tế với agent mạnh (Claude 4 / Grok 4.5 / Cursor).
- Ưu tiên chất lượng skill hơn số lượng.

---

**Bắt đầu ngay** bằng cách:

1. Fork repo
2. Tạo cấu trúc thư mục multi-vertical
3. Tạo Design System đầu tiên (`personal/minimal`)
4. Xây skill `content-repurposer`

Chúc bạn phát triển thành công!

---

**Trạng thái**: Draft v0.1  
**Ngày**: 2026-07-17
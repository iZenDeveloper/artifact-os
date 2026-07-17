# Vertical Content OS - High-Level Architecture

## 1. Tổng quan kiến trúc

Vertical Content OS được xây dựng dựa trên việc **fork và mở rộng Open Design**, kết hợp với **OmniRoute** làm lớp Gateway.

Kiến trúc tổng thể tuân theo nguyên tắc **tách biệt rõ ràng** giữa các lớp:

- **Gateway Layer**: Xử lý model routing, provider management, governance.
- **Vertical Content Layer**: Xử lý logic tạo nội dung chuyên biệt theo ngành.
- **Presentation Layer**: Giao diện và workflow cho người dùng.

## 2. Sơ đồ kiến trúc tổng thể

```
                        User / Coding Agent
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    GATEWAY LAYER                            │
│  (Dựa trên OmniRoute - có thể fork & mở rộng)               │
│                                                             │
│  • Model Routing & Smart Selection                          │
│  • Multi-provider Fallback                                  │
│  • Token Compression & Cost Control                         │
│  • Guardrails & Safety                                      │
│  • MCP Exposure                                             │
│  • Vertical-aware Routing (mở rộng)                         │
│  • Auth / Quota / Logging (tùy chọn)                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              VERTICAL CONTENT OS LAYER                      │
│  (Fork từ Open Design + Custom Extensions)                  │
│                                                             │
│  ┌──────────────────────┐    ┌──────────────────────────┐  │
│  │   Skills Layer       │    │   Design Systems Layer   │  │
│  │  - Marketing Skills  │    │  - Personal Brand        │  │
│  │  - Education Skills  │    │  - Client Brand Kits     │  │
│  │  - Legal Skills      │    │  - Vertical-specific     │  │
│  │  - Shared Skills     │    │    (Education, Legal)    │  │
│  └──────────────────────┘    └──────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Core Extensions (Open Design)              │  │
│  │  • Artifact Generation & Preview                     │  │
│  │  • Export (HTML, PDF, PPTX, MP4, ready-to-post)      │  │
│  │  • Plugin System                                     │  │
│  │  • Session & Project Management                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 3. Chi tiết các lớp

### 3.1 Gateway Layer (OmniRoute-based)

**Trách nhiệm chính:**
- Định tuyến request đến đúng model/provider theo chiến lược (cost, quality, speed, vertical).
- Quản lý BYOK và nhiều provider.
- Cung cấp MCP interface cho các agent.
- (Mở rộng) Hỗ trợ vertical-aware routing và context injection.

**Công nghệ:** Fork từ OmniRoute (TypeScript, Node.js)

### 3.2 Vertical Content Layer (Open Design-based)

Đây là lớp cốt lõi của dự án.

**Thành phần chính:**

| Thành phần | Mô tả | Mức độ custom |
|------------|-------|---------------|
| **Skills** | Workflow tạo nội dung theo vertical | Cao (tạo mới nhiều) |
| **Design Systems** | Brand voice, tone, visual identity theo vertical | Cao (tạo mới) |
| **Plugins** | Đóng gói vertical pack | Trung bình |
| **Core Runtime** | Artifact generation, preview, export | Thấp - Trung bình |
| **UI/UX Layer** | Chat, preview, library, brand switcher | Trung bình - Cao |

### 3.3 Shared / Cross-vertical Components

- `content-repurposer` (skill dùng chung)
- Các skill hỗ trợ chung (hook generation, copy frameworks...)
- Base templates và references

## 4. Nguyên tắc thiết kế kiến trúc

1. **Vertical Isolation**  
   Mỗi vertical có Skills + Design Systems riêng, dễ bật/tắt hoặc phát triển độc lập.

2. **Shared Core**  
   Giữ nguyên hoặc mở rộng tối thiểu core của Open Design để dễ maintain khi upstream cập nhật.

3. **Gateway as Thin Layer**  
   OmniRoute chủ yếu xử lý model/provider. Logic vertical nằm chủ yếu ở lớp trên.

4. **Extensibility**  
   Dễ dàng thêm vertical mới chỉ bằng cách thêm thư mục Skills và Design Systems.

5. **Local-first**  
   Giữ tinh thần local-first, data sovereignty.

## 5. Điểm mở rộng chính (Extension Points)

| Extension Point | Vị trí | Cách sử dụng cho Vertical |
|-----------------|--------|---------------------------|
| **New Skill** | `skills/<vertical>-xxx/` | Tạo workflow chuyên biệt cho ngành |
| **Design System** | `design-systems/<vertical>-brand/` | Định nghĩa tone + visual cho ngành |
| **Plugin** | `plugins/<vertical>-pack/` | Đóng gói toàn bộ vertical pack |
| **UI Components** | `apps/web/` | Thêm Brand Switcher, Platform Preview, Repurpose Flow |
| **References** | `skills/<vertical>-xxx/references/` | Chứa domain knowledge, best practices |

## 6. Công nghệ Stack

- **Base Framework**: Open Design (Next.js + Node.js daemon)
- **Gateway**: OmniRoute (fork)
- **Ngôn ngữ**: TypeScript
- **Package Manager**: pnpm
- **Build**: Nix (tùy chọn)

## 7. Lưu trữ & Data Flow

- Artifact và project: File system + SQLite (theo Open Design)
- Vertical knowledge: Nằm trong `references/` của từng skill
- Design tokens: Trong `design-systems/`

## 8. Rủi ro kiến trúc & Giảm thiểu

| Rủi ro | Giảm thiểu |
|--------|------------|
| Upstream Open Design thay đổi lớn | Giữ core ít thay đổi nhất có thể, tách biệt extension |
| Tích hợp OmniRoute phức tạp | Bắt đầu với OmniRoute gần như nguyên bản, mở rộng dần |
| Vertical bị phụ thuộc lẫn nhau | Thiết kế skill modular, hạn chế phụ thuộc chéo |

---

**Trạng thái**: Draft v0.1  
**Ngày**: 2026-07-17
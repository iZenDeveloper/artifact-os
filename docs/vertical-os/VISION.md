# Artifact OS - Project Vision

## 1. Tên dự án
**Artifact OS** (tên tạm thời)

## 2. Mục tiêu tổng quát
Xây dựng một nền tảng **Artifact OS** dựa trên việc fork và mở rộng **Open Design**, cho phép tạo nội dung chuyên biệt theo ngành (vertical) với chất lượng cao, nhất quán về brand voice, và có khả năng mở rộng theo thời gian.

Nền tảng tập trung vào việc biến agent (Claude, Cursor, Grok, v.v.) thành một **content team chuyên biệt theo ngành**.

## 3. Đối tượng người dùng mục tiêu

### Giai đoạn 1 (MVP) — **P0 only**
- **Content Creator cá nhân** (personal brand, đa nền)
- **Marketer / Freelancer** (nhiều client hoặc brand cá nhân)

### Giai đoạn 1 mở rộng → 2
- Agency nhỏ & vừa (Client Package, multi-brand workflow)
- In-house marketing team

### Giai đoạn sau
- Agency lớn / enterprise content ops
- Tổ chức giáo dục (Education)
- Công ty luật / Legal department (Legal)
- Finance, Healthcare, v.v.

Chi tiết segments + pain + moat: **[MARKETING_VERTICAL.md](./MARKETING_VERTICAL.md)**.

## 4. Giá trị cốt lõi (Core Value)

| Giá trị | Mô tả |
|--------|-------|
| **Vertical Specialization** | Nội dung được tạo ra với hiểu biết sâu về ngành (tone, cấu trúc, best practice) |
| **Brand Consistency** | Dễ dàng duy trì brand voice nhất quán qua Design Systems |
| **Content Repurposing mạnh** | Biến 1 nội dung thành nhiều format phù hợp từng nền tảng và ngành |
| **Local-first & Sovereignty** | Toàn bộ dữ liệu và xử lý nằm local, phù hợp enterprise |
| **Extensible & Modular** | Dễ dàng thêm vertical mới mà không phá vỡ hệ thống hiện tại |
| **Agent-native** | Tận dụng tối đa sức mạnh của các coding agent hiện đại |

## 5. Phạm vi ban đầu (MVP Scope)

**Vertical đầu tiên:** Marketing & Content Creation

**Tính năng cốt lõi (3 trụ):**
1. **Repurposing** — 1 source → multi-platform (**text + visual direction + script**, không render video MVP)
2. **Brand + Strategy** — Brand Switcher + DESIGN.md Voice & Tone + objective/funnel/persona
3. **Platform optimization** — XHS/TikTok first-class; LinkedIn/Threads/Email ready-to-post

Còn: Plugin pack Marketing · shared marketing knowledge · hook lab · ad variants.

**Không trong MVP:** email sequence product, full content calendar product, competitor analysis, video render.

**Vertical tiếp theo (dự kiến):**
1. Education
2. Legal

## 6. Nguyên tắc thiết kế (Design Principles)

1. **Modular First** — Mọi thứ được thiết kế để dễ mở rộng theo vertical.
2. **Separation of Concerns** — Tách rõ:
   - Gateway / Model Routing (OmniRoute)
   - Artifact OS content logic (Skills + Design Systems)
   - Presentation & Workflow (UI/UX)
3. **Quality over Quantity** — Ưu tiên chất lượng nội dung theo ngành thay vì số lượng tính năng.
4. **Local-first** — Giữ tinh thần local-first của Open Design.
5. **Human-in-the-loop friendly** — Đặc biệt quan trọng với Legal và Education.
6. **Composable** — Skills có thể kết hợp với nhau.

## 7. Tầm nhìn dài hạn (Long-term Vision)

Trở thành một nền tảng **Vertical AI Content Platform** cho phép:
- Mỗi ngành có một "Content OS Pack" chuyên biệt.
- Dễ dàng kết hợp giữa các vertical (ví dụ: repurposing nội dung từ Marketing sang Education).
- Có lớp Governance & Control Plane mạnh (dựa trên OmniRoute hoặc tương tự).
- Hỗ trợ cả individual creator lẫn enterprise team.

## 8. Công nghệ nền tảng

- **Base**: Fork từ [nexu-io/open-design](https://github.com/nexu-io/open-design)
- **Gateway Layer**: Dựa trên OmniRoute (open source)
- **AI Assistant chính**: Grok 4.5 (xAI)
- **Ngôn ngữ**: TypeScript (theo Open Design)
- **Triển khai**: Local-first + hỗ trợ hybrid/on-prem

## 9. Success Metrics (Giai đoạn 1)

- Người dùng có thể tạo xong một bộ content đa nền tảng chất lượng cao chỉ trong 1-2 prompt lớn.
- Dễ dàng chuyển đổi giữa Personal Brand và Client Brand.
- Thời gian tạo nội dung giảm đáng kể so với làm thủ công.
- Vertical Pack có thể được chia sẻ và tái sử dụng dễ dàng.

---

**Trạng thái tài liệu**: Draft v0.1  
**Ngày cập nhật**: 2026-07-17  
**Tác giả**: Elton + Grok 4.5
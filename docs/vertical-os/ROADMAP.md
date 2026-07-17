# Vertical Content OS - MVP Roadmap

## Mục tiêu tổng quát

Xây dựng **Vertical Content OS** theo từng giai đoạn, bắt đầu từ Marketing & Content Creation (Vertical 1), sau đó mở rộng sang Education và Legal.

---

## Giai đoạn 1: Foundation & Marketing Vertical (MVP)

**Thời gian ước tính**: 4–8 tuần (tùy tốc độ)

### Mục tiêu
- Fork Open Design thành công và chạy ổn định.
- Xây dựng được **Marketing & Content Creation Vertical** có thể dùng thực tế.
- Có ít nhất 3-5 skill chất lượng cao cho marketer/content creator.
- Hỗ trợ chuyển đổi Brand (Personal ↔ Client) mượt mà.
- Có Plugin pack để dễ chia sẻ/cài đặt.

### Các công việc chính

| STT | Công việc | Loại | Ưu tiên | Ghi chú |
|-----|-----------|------|---------|--------|
| 1 | Fork repo + setup môi trường dev | Setup | Cao | Hiểu cấu trúc Open Design |
| 2 | Tạo tài liệu nội bộ (Vision, Architecture, Guides) | Docs | Cao | Đang thực hiện |
| 3 | Thiết kế cấu trúc thư mục cho multi-vertical | Architecture | Cao | `skills/marketing/`, `design-systems/personal/`, v.v. |
| 4 | Tạo 3-4 Design Systems cơ bản | Design System | Cao | Personal Minimal, Personal Bold, Professional Clean, Client Template |
| 5 | Xây skill `content-repurposer` (ưu tiên cao nhất) | Skill | Rất cao | **Done** · Content Pro v2.2 · **MVP = text + visual direction + script (no video render)** |
| 5b | Shared marketing refs + `hook-engine` | Skill/Docs | Cao | **Done** · frameworks/psych + hooks lab |
| 6 | Xây skill `social-content-factory` | Skill | Cao | **Done** · Content Pro v2.2 batch |
| 7 | Cải thiện / mở rộng `card-xiaohongshu` nếu cần | Skill | Trung bình | Rất quan trọng với creator Việt Nam |
| 8 | Xây skill `ad-variants-generator` | Skill | Trung bình | **Done** · Content Pro v2.2 matrix |
| 9 | Thêm Brand/Client Switcher vào UI | UI/UX | Cao | Rất cần cho agency |
| 10 | Thêm Platform Preview Modes (XHS, TikTok, LinkedIn) | UI/UX | Cao | Giúp creator hình dung output |
| 11 | Tạo Plugin pack cho Marketing Vertical | Plugin | Cao | **Done** · `plugins/community/marketing-vertical-pack` |
| 12 | Test thực tế với Claude Code / Cursor / Grok | Testing | Cao | Đánh giá chất lượng output |
| 13 | Viết tài liệu hướng dẫn sử dụng Vertical Pack | Docs | Trung bình | README cho người dùng cuối |

### Kết quả mong đợi sau Giai đoạn 1
- Người dùng có thể tạo bộ content đa nền tảng chất lượng cao chỉ với 1-2 prompt.
- Dễ dàng chuyển đổi giữa Personal Brand và Client Brand.
- Có một Vertical Pack có thể cài đặt và sử dụng ngay.

---

## Giai đoạn 2: Nâng cấp UX & Stability

**Thời gian ước tính**: 3–5 tuần

### Mục tiêu
- Cải thiện đáng kể trải nghiệm người dùng cho marketer/content creator.
- Ổn định hệ thống và giảm lỗi.
- Bắt đầu chuẩn bị cho vertical tiếp theo.

### Công việc chính
- Hoàn thiện **Repurpose Flow** (dedicated flow)
- Variants Comparison View
- Content Library cơ bản (lọc theo client/vertical)
- Cải thiện Export (Client Package)
- Tối ưu hiệu năng và ổn định daemon
- Viết test cho các skill quan trọng
- Cải thiện onboarding cho người dùng mới

---

## Giai đoạn 3: Education Vertical

**Thời gian ước tính**: 4–6 tuần

### Mục tiêu
- Xây dựng Education Vertical Pack hoàn chỉnh.
- Tái sử dụng tối đa các component từ Marketing Vertical.

### Công việc chính
- Tạo Design Systems cho Education (Academic, Modern Training, K12...)
- Xây các skill chuyên biệt:
  - `lesson-deck`
  - `course-landing`
  - `educational-carousel`
  - `student-onboarding-kit`
  - `lecture-to-content-repurposer`
- Thêm domain knowledge vào `references/`
- Test với giáo viên / content creator giáo dục

---

## Giai đoạn 4: Legal Vertical (Nâng cao)

**Thời gian ước tính**: 6–8 tuần

### Mục tiêu
- Xây dựng Legal Vertical với yêu cầu chất lượng và độ chính xác cao.

### Công việc chính
- Tạo Design Systems chuyên nghiệp cho Legal
- Xây skill:
  - `contract-summary`
  - `legal-deck`
  - `compliance-report`
  - `client-advisory`
  - `legal-explainer`
- Thiết kế flow có **Human Review** rõ ràng
- Thêm disclaimer / accuracy warning
- Tham khảo ý kiến chuyên gia luật (nếu có)

---

## Giai đoạn 5: Gateway Integration (OmniRoute)

**Thời gian**: Song song hoặc sau Giai đoạn 2

### Mục tiêu
- Tích hợp hoặc mở rộng OmniRoute làm lớp Gateway.
- Hỗ trợ vertical-aware routing và context injection.

### Công việc chính
- Đánh giá và fork OmniRoute
- Thêm vertical routing logic
- Thiết kế cách inject Design System theo vertical
- Test end-to-end với cả hai lớp

---

## Tóm tắt Roadmap

| Giai đoạn | Tên | Thời gian | Vertical | Trạng thái |
|-----------|-----|-----------|----------|------------|
| 1 | Foundation & Marketing MVP | 4-8 tuần | Marketing | Đang bắt đầu |
| 2 | UX & Stability | 3-5 tuần | Marketing | Sau Giai đoạn 1 |
| 3 | Education Vertical | 4-6 tuần | Education | Sau Giai đoạn 2 |
| 4 | Legal Vertical | 6-8 tuần | Legal | Sau Giai đoạn 3 |
| 5 | Gateway Integration | Song song / Sau | Tất cả | Tùy chiến lược |

---

**Ghi chú**: 
- Roadmap này có thể điều chỉnh linh hoạt tùy theo tiến độ thực tế và feedback.
- Ưu tiên chất lượng skill và Design System hơn số lượng tính năng.

---

**Trạng thái**: Draft v0.1  
**Ngày cập nhật**: 2026-07-17
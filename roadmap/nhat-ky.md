# Nhật Ký Sprint - Hỷ Lạc Việt

> Ghi chép lịch sử phát triển sau mỗi sprint.

---

## Sprint: SEO & Indexing — 2026-02-28

### Mục tiêu
- Website chưa được Google index → triển khai SEO kỹ thuật đầy đủ
- Dọn dẹp folder roadmap → chuẩn hóa 4 file

### Đã hoàn thành
- ✅ Tạo `sitemap.ts` — dynamic sitemap cho tất cả routes + products
- ✅ Tạo `robots.ts` — cho phép crawl toàn bộ
- ✅ Thêm metadata riêng cho 4 sub-pages (gioi-thieu, lien-he, may-do, san-pham)
- ✅ Thêm JSON-LD Organization schema
- ✅ Thêm JSON-LD Product schema cho trang chi tiết sản phẩm
- ✅ Sửa constants.ts: domain `.com` → `.vn`
- ✅ Gộp 4 file design spec → `spec-driven.md`
- ✅ Cập nhật `thong-tin-du-an.md` (tech stack đúng thực tế)
- ✅ Tạo `roadmap.md` và `nhat-ky.md`

### Ghi chú kỹ thuật
- Các page dùng `'use client'` → metadata export qua `layout.tsx` (server component) trong mỗi thư mục
- Next.js App Router conventions: `sitemap.ts`, `robots.ts` tự generate response

---

## Lịch Sử Trước Sprint

### v1.0 — MVP Launch (2026-01 → 2026-02)
- Frontend Next.js 14 với design system "Imperial Zen"
- Backend Rust/Axum API
- Admin panel Vue 3
- Deploy Docker + Traefik trên VPS
- 5 pages: Trang chủ, Sản phẩm, Chi tiết SP, Giới thiệu, May đo, Liên hệ
- Hero section: 3-gallery marquee với parallax
- Product showcase: Coverflow Swiper
- Mobile: Full responsive, hamburger menu

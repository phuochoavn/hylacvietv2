# Roadmap - Hỷ Lạc Việt

> Cập nhật sau mỗi sprint.  
> Phiên bản: v1.0 — 2026-02-28

---

## Tổng Quan Giai Đoạn

```
Phase 1: MVP Website ✅ (đã hoàn thành)
Phase 2: SEO & Indexing 🔄 (đang triển khai)
Phase 3: Content & Marketing (kế hoạch)
Phase 4: E-commerce Expansion (tương lai)
```

---

## Phase 1: MVP Website ✅

- [x] Frontend Next.js 14 — Trang chủ, Sản phẩm, Giới thiệu, May đo, Liên hệ
- [x] Backend Rust/Axum — API products, settings, auth
- [x] Admin Vue 3 — CRUD sản phẩm, quản lý settings, hero galleries
- [x] Deploy Docker + Traefik trên VPS
- [x] SSL tự động via Let's Encrypt
- [x] Design system "Imperial Zen"

---

## Phase 2: SEO & Indexing + Performance ✅

- [x] Tạo sitemap.xml (dynamic)
- [x] Tạo robots.txt
- [x] Metadata riêng từng page
- [x] JSON-LD structured data (Organization + Product)
- [x] Sửa canonical URLs
- [x] Tối ưu Core Web Vitals — Performance Sprint (commit `1ee8bc6`)
  - Loại bỏ Preloader (block LCP 2.8-10s)
  - Server-side Hero data fetch (ISR, revalidate 60s)
  - Lazy-load below-fold sections (ssr: false)
  - Chuyển layout từ `force-dynamic` sang `auto` (ISR)
  - Tắt particles + Lenis trên mobile
- [ ] Submit Google Search Console
- [ ] Submit Bing Webmaster
- [ ] Thêm Open Graph images cho mỗi page

---

## Phase 3: Content & Marketing (Kế hoạch)

- [ ] Blog / Tin tức (CMS)
- [ ] Landing page cho từng dòng sản phẩm
- [ ] Tích hợp Google Analytics 4
- [ ] Facebook Pixel
- [ ] Email marketing (newsletter)

---

## Phase 4: E-commerce Expansion (Tương lai)

- [ ] Giỏ hàng & thanh toán online
- [ ] Hệ thống đặt lịch tư vấn trực tuyến
- [ ] Tài khoản khách hàng
- [ ] Loyalty program
- [ ] Multi-language (EN/VI)

---

## Backlog / Ideas

- [ ] PWA (Progressive Web App)
- [ ] Dark mode toggle
- [ ] Video background hero
- [ ] AR try-on áo dài
- [ ] Chatbot tư vấn tự động

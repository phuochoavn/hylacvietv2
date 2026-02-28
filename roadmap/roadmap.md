# Roadmap - Hỷ Lạc Việt

> Cập nhật sau mỗi sprint.  
> Phiên bản: v1.2 — 2026-02-28 (Sub-Page Homogenization)

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

## Phase 2.5: Mobile Performance & Accessibility ✅

> Mobile 77 → 91 | Desktop 96 → 98 | Accessibility 94 → 100 (target)

### Tier 1: Font Optimization
- [x] Convert OTF → WOFF2 (CottaFree -43%, SVN-Magellin -33%)
- [x] Giảm Roboto weights 4 → 2 (400, 700)
- [x] Preload CottaFree.woff2

### Tier 2: CSS Per-Page Splitting
- [x] Tách 9 CSS files khỏi global main.css (158KB → 14KB core)
- [x] Import per-page: hero.css, sections.css, products.css, showroom.css, etc.

### Tier 3–4: LCP & JS
- [x] Xác nhận hero image đã có `priority`
- [x] Tạo `.browserslistrc` modern browsers (loại 13KB polyfills)

### Tier 5: Cache
- [x] Uploads cache 7d → 30d immutable

### Accessibility Fixes
- [x] Fix color contrast: section-label, title-accent → `--gold-dark`
- [x] Fix footer copyright-sub opacity 0.25 → 0.55
- [x] Fix heading hierarchy: `<h4>Showroom</h4>` → `<h3>` + update CSS selector `.info-text h4` → `.info-text h3`

---

## Phase 2.6: Sub-Page Homogenization ✅

> Dynamic API images + CSS fix trên 4 sub-pages

### Sản phẩm `/san-pham`
- [x] Fix CSS — thêm `import showroom.css` bị thiếu sau CSS splitting

### May đo `/may-do`
- [x] Thay ảnh tĩnh → ảnh API (`craft_step1_image`, `craft_step3_image`)
- [x] Bỏ phần "Thêu Tay" → thay nội dung dựa trên quy trình trang chủ
- [x] Cập nhật journey step 4

### Giới thiệu `/gioi-thieu`
- [x] Tất cả ảnh (hero, story section 1 & 2) → ảnh API

### Liên hệ `/lien-he`
- [x] Viết lại hoàn toàn page — bỏ SVG icons, framer-motion
- [x] Ảnh hero + showroom → ảnh API
- [x] Fix Cloudflare negative 522 cache trên CSS chunk hash
- [x] Thêm `contact.css` vào global `main.css` (redundancy)

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

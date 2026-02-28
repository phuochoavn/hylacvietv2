# Nhật Ký Sprint - Hỷ Lạc Việt

> Ghi chép lịch sử phát triển sau mỗi sprint.

---

## Sprint: Accessibility Fixes — 2026-02-28

### Mục tiêu
- Accessibility score 94 → 100

### Đã hoàn thành
- ✅ **Color contrast** — `section-label-premium.light` và `title-accent` đổi từ `--gold-light`/`--gold` → `--gold-dark` (#8B6914) cho WCAG AA
- ✅ **Footer copyright-sub** — opacity 0.25 → 0.55 (text gần invisible trước đó)
- ✅ **Heading hierarchy** — `<h4>Showroom</h4>` → `<h3>` + update CSS selector `.info-text h4` → `.info-text h3`

### Files thay đổi
| File | Thay đổi |
|------|----------|
| `sections.css` | Contrast fix: `.section-label-premium.light`, `.title-accent`, `.info-text h3` |
| `layout.css` | `.copyright-sub` opacity 0.25 → 0.55 |
| `ContactCTA.tsx` | `<h4>` → `<h3>` |

### Commit
- `d45576d` — a11y: fix color contrast and heading hierarchy for accessibility score

---

## Sprint: Mobile Performance Optimization — 2026-02-28

### Mục tiêu
- Mobile PageSpeed 77 → 90+ (đạt 91 ✅)
- Desktop 96 → 98 ✅

### Đã hoàn thành

#### Tier 1: Font Optimization
- ✅ **OTF → WOFF2** — CottaFree (14KB→8KB, -43%), SVN-Magellin (45KB→30KB, -33%)
- ✅ **Giảm Google Font weights** — Roboto 4 weights → 2 weights (400, 700), tiết kiệm ~25KB
- ✅ **Font preload** — `<link preload>` cho CottaFree.woff2

#### Tier 2: CSS Per-Page Splitting (tác động lớn nhất)
- ✅ **Tách 9 CSS files** khỏi global `main.css` — render-blocking CSS giảm từ 158KB → 14KB core
- ✅ **Per-page imports** — hero.css, sections.css, products.css, showroom.css, etc. chỉ load khi cần

#### Tier 3–4: LCP & JS
- ✅ **Hero image priority** — đã có sẵn `priority` attribute
- ✅ **`.browserslistrc`** — chỉ modern browsers, loại ~13KB polyfills không cần thiết

#### Tier 5: Cache
- ✅ **Uploads cache** — 7 days → 30 days immutable (images là WebP bất biến)

### Files thay đổi
| File | Thay đổi |
|------|----------|
| `main.css` | Xóa 9 page-specific CSS imports, font-face WOFF2 primary |
| `layout.tsx` | Roboto weights 4→2, preload CottaFree.woff2 |
| `page.tsx` | Thêm `import hero.css` |
| `BelowFoldSections.tsx` | Thêm `import sections.css`, `products.css` |
| `san-pham/page.tsx` | Thêm `import products.css` |
| `gioi-thieu/page.tsx` | Thêm `import showroom.css` |
| `next.config.ts` | Uploads cache 7d → 30d immutable |
| `.browserslistrc` | **MỚI** — modern browsers only |
| `CottaFree.woff2` | **MỚI** — converted from OTF |
| `SVN-Magellin.woff2` | **MỚI** — converted from OTF |

### Commits
- `9f31cb9` — perf: mobile optimization - font WOFF2, CSS per-page split, browserslist, cache headers
- `3b9e3c6` — fix: add products.css import to BelowFoldSections for homepage ProductShowcase

---

## Sprint: Performance Optimization Round 3 — 2026-02-28

### Mục tiêu
- LCP 21.9s → <4s bằng cách fix root cause: `opacity: 0` trên text, framer-motion

### Đã hoàn thành
- ✅ **Xóa hoàn toàn framer-motion** khỏi Hero.tsx (0 imports, ~45KB JS)
- ✅ **Title/tagline render ngay** — không `opacity: 0` → text = LCP element
- ✅ **CSS crossfade** thay AnimatePresence cho slide transition
- ✅ **Vanilla JS scroll** thay useScroll/useTransform
- ✅ **AVIF format support** trong next.config.ts
- ✅ **Bỏ 2048 deviceSize** (không cần thiết)

### Commit
- `f0992aa` — perf(round3): remove framer-motion from Hero, fix LCP

---

## Sprint: Performance Optimization Round 2 — 2026-02-28

### Mục tiêu
- LCP 21.6s → giảm mạnh bằng cách render Hero image ngay lập tức
- Giảm JS bundle ~60KB+ (framer-motion deferred)

### Đã hoàn thành
- ✅ **Hero LCP instant** — First bg image `opacity: 1` ngay, không chờ animation
- ✅ **CSS animations thay framer-motion** — hero-anim-* keyframes cho text entrance
- ✅ **CSS Ken Burns zoom** — thay framer-motion scale animation (20s infinite)
- ✅ **CSS marquee scroll** — thay framer-motion infinite scroll cho gallery
- ✅ **Lazy-load layout effects** — ScrollProgress, CustomCursor, SmoothScroll, FloatingContactButtons dùng `ssr: false` qua `LayoutEffects.tsx`
- ✅ **Mobile: tắt Ken Burns** — giảm GPU trên mobile
- ✅ **prefers-reduced-motion** — tôn trọng accessibility
- ✅ **Mouse parallax disabled on mobile** — tiết kiệm CPU

### Files thay đổi
| File | Thay đổi |
|------|----------|
| `Hero.tsx` | Rewrite: CSS animations, instant LCP image, remove framer-motion entrance |
| `hero.css` | +110 lines: keyframes, staggered delays, marquee scroll, media queries |
| `LayoutEffects.tsx` | **MỚI** — lazy-load 4 effects components |
| `layout.tsx` | Dùng LayoutEffects thay 4 imports riêng lẻ |

### Commit
- `dce71c2` — perf(round2): CSS animations for Hero LCP, lazy-load layout effects

---

## Sprint: Performance Optimization — 2026-02-28

### Mục tiêu
- Mobile PageSpeed score 63 → cải thiện LCP, TBT, CLS
- Loại bỏ các bottleneck chính: Preloader, client-side waterfall, heavy JS

### Đã hoàn thành
- ✅ **Loại bỏ Preloader** — block LCP 2.8-10s, thay bằng natural loading
- ✅ **Server-side Hero fetch** — `page.tsx` async server component, ISR revalidate 60s
- ✅ **Lazy-load below-fold** — 6 sections dùng `ssr: false` (BelowFoldSections wrapper)
- ✅ **ISR Layout** — `force-dynamic` → `auto`, metadata ISR với revalidate 60s
- ✅ **Mobile optimizations** — Tắt particles (CSS media query), Lenis đã skip `<768px`

### Files thay đổi
| File | Thay đổi |
|------|----------|
| `layout.tsx` | Bỏ Preloader, dynamic → auto |
| `page.tsx` | Async server component, server-side fetch |
| `BelowFoldSections.tsx` | **MỚI** — client wrapper cho `ssr: false` |
| `Hero.tsx` | Nhận `serverSettings` prop, skip client fetch |
| `hero.css` | Thêm `@media (max-width: 768px)` hide particles |

### Commit
- `1ee8bc6` — perf: remove preloader, server-side hero fetch, lazy-load below-fold, ISR layout, disable particles on mobile

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

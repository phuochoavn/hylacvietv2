# Giao Diện Trang Chủ - Hỷ Lạc Việt v5.0

## Tổng Quan

Trang chủ đã được **migrate hoàn toàn sang Next.js 14** với App Router, giữ nguyên triết lý thiết kế **Imperial Zen** - kết hợp giữa vẻ đẹp cổ điển Á Đông và hiệu ứng motion hiện đại.

---

## Công Nghệ Stack

| Thành phần | Công nghệ | Ghi chú |
|------------|-----------|---------|
| **Framework** | Next.js 14 (App Router) | Server Components + Client Components |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Vanilla CSS + CSS Variables | Design System chuẩn xác |
| **Animation** | GSAP + ScrollTrigger | npm packages (không CDN) |
| **Fonts** | Noto Serif Display + Roboto | Google Fonts import |
| **Images** | Next.js Image / HTML img | Tự động optimize |

---

## Cấu Trúc Thư Mục

```
frontend/src/
├── app/
│   ├── layout.tsx          # Root layout (Header, Footer)
│   ├── page.tsx             # Homepage + ScrollCine
│   ├── globals.css          # Global styles + Design System
│   ├── about/page.tsx       # Giới thiệu
│   ├── contact/page.tsx     # Liên hệ
│   └── products/
│       ├── page.tsx         # Danh sách sản phẩm
│       └── [id]/page.tsx    # Chi tiết sản phẩm
├── components/
│   ├── Header.tsx           # Navigation + Mobile menu
│   ├── Footer.tsx           # Footer links + contact
│   └── ScrollCine.tsx       # GSAP scroll animations
└── public/images/           # Static images
```

---

## Danh Sách Sections (Homepage)

### 1. Header (Fixed)
| Thuộc tính | Chi tiết |
|------------|----------|
| **File** | `components/Header.tsx` |
| **Type** | Client Component (`"use client"`) |
| **Vị trí** | Fixed top, z-index: 1000 |
| **Hiệu ứng** | Transparent → Solid on scroll |
| **CSS** | Glassmorphism, backdrop-filter: blur(20px) |
| **Mobile** | Hamburger menu, full-screen overlay |
| **Status** | ✅ Hoàn thành |

---

### 2. Hero Section
| Thuộc tính | Chi tiết |
|------------|----------|
| **File** | `app/page.tsx` |
| **Layout** | Centered, full viewport height |
| **Background** | Next.js Image với priority loading |
| **Overlay** | Gradient vignette (#1a1614) |
| **Content** | Logo text, tagline, 2 CTA buttons |
| **Animation** | `[data-reveal]` - GSAP fade + slide up |
| **Status** | ✅ Hoàn thành |

---

### 3. Brand Story (Câu Chuyện)
| Thuộc tính | Chi tiết |
|------------|----------|
| **Layout** | 2 columns (image + text), grid |
| **Image** | `[data-parallax]` - GSAP yPercent scroll |
| **Text** | `[data-reveal]`, `[data-fade-up]` |
| **CSS** | .story-grid, gap: 80px |
| **Status** | ✅ Hoàn thành |

---

### 4. Philosophy Quote
| Thuộc tính | Chi tiết |
|------------|----------|
| **Background** | section-dark (#1a1614) |
| **Content** | Quote Phật Giáo + áo dài |
| **Typography** | Noto Serif Display, italic |
| **Animation** | `[data-opacity-scroll]` - scrub 0.2→1 |
| **Status** | ✅ Hoàn thành |

---

### 5. Product Lines (4 Dòng Áo Dài)
| Thuộc tính | Chi tiết |
|------------|----------|
| **Layout** | Horizontal flex, scrollable |
| **Products** | Truyền thống, Cưới, Pháp phục, Thêu tay |
| **Card** | .product-line-card với hover lift effect |
| **Animation** | GSAP stagger fade-up |
| **Note** | ⚠️ Horizontal scroll bị disable (gây lỗi React) |
| **Status** | ✅ Hoàn thành (vertical mode) |

---

### 6. Materials (Chất Liệu)
| Thuộc tính | Chi tiết |
|------------|----------|
| **Layout** | 3-column grid |
| **Materials** | Lụa Tơ Tằm, Gấm, Chỉ Thêu |
| **Icons** | Emoji (🌿 💎 🧵) |
| **Animation** | GSAP stagger với delay |
| **Status** | ✅ Hoàn thành |

---

### 7. Craftsmanship (Hành Trình Tạo Tác) ⭐
| Thuộc tính | Chi tiết |
|------------|----------|
| **Background** | section-dark |
| **Layout** | 2 columns: sticky media + scrolling steps |
| **Steps** | 01-04: Vẽ Mẫu, Cắt Vải, Thêu Tay, Hoàn Thiện |
| **Media** | 4 images với CSS crossfade (.active class) |
| **Scroll** | CSS `position: sticky` (không dùng GSAP pin) |
| **Animation** | GSAP onEnter/onEnterBack swap active image |
| **Status** | ✅ Hoàn thành |

> **Lưu ý quan trọng:** Không sử dụng GSAP ScrollTrigger.pin() vì gây lỗi React DOM khi navigate. Thay vào đó dùng CSS `position: sticky`.

---

### 8. Testimonials
| Thuộc tính | Chi tiết |
|------------|----------|
| **Layout** | 3-column grid |
| **Content** | 3 testimonial cards với quotes |
| **Avatar** | Initials (TL, TH, MN) |
| **Animation** | GSAP stagger slide-up |
| **Status** | ✅ Hoàn thành |

---

### 9. Consultation (Tư Vấn)
| Thuộc tính | Chi tiết |
|------------|----------|
| **Background** | section-dark |
| **Layout** | Centered form |
| **Fields** | Họ tên, SĐT, Loại áo, Ghi chú |
| **Submit** | Button với gold styling |
| **Status** | ✅ Hoàn thành (UI only, chưa có backend) |

---

### 10. Contact CTA
| Thuộc tính | Chi tiết |
|------------|----------|
| **Layout** | Centered với 2 buttons |
| **Buttons** | Gọi điện, Chat Zalo |
| **Links** | tel:, zalo.me deeplink |
| **Status** | ✅ Hoàn thành |

---

### 11. Footer
| Thuộc tính | Chi tiết |
|------------|----------|
| **File** | `components/Footer.tsx` |
| **Background** | Dark (#1a1614) |
| **Layout** | 4-column grid |
| **Sections** | Brand, Links, Contact, Social |
| **Status** | ✅ Hoàn thành |

---

## ScrollCine Component

### Kiến trúc Animation (Stable)

```typescript
// components/ScrollCine.tsx
"use client";

// Các hiệu ứng được hỗ trợ:
1. [data-reveal]       → Fade + slide up
2. [data-parallax]     → Image yPercent scroll  
3. [data-opacity-scroll] → Opacity 0.2 → 1 scrub
4. [data-fade-up]      → Fade + slide up
5. .craft-step         → Crossfade images
6. .material-card      → Stagger fade
7. .testimonial-card   → Stagger slide
8. .product-line-card  → Stagger fade
```

### Những gì KHÔNG dùng (để tránh lỗi)

| Tính năng | Lý do tránh |
|-----------|-------------|
| `ScrollTrigger.pin()` | Sửa đổi DOM → React removeChild error |
| Horizontal scroll GSAP | Sửa đổi DOM → lỗi navigate |
| `SplitType` với line mask | DOM manipulation conflicts |
| GSAP trong layout.tsx | Chạy mọi page, gây lỗi cleanup |

---

## CSS Variables (Imperial Zen)

```css
:root {
  --color-gold: #c9a227;
  --color-gold-light: #e5d4a8;
  --color-gold-dark: #8b7355;
  --color-cream: #fffff0;
  --color-dark: #1a1614;
  --color-text: #3d3530;
  
  --font-serif: 'Noto Serif Display', Georgia, serif;
  --font-sans: 'Roboto', system-ui, sans-serif;
  
  --header-height: 90px;
  --container-width: 1200px;
}
```

---

## Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| **1024px** | Reduce padding, 2-column grids |
| **768px** | Single column, mobile menu, stacked |
| **375px** | Mobile optimized |

---

## Trạng Thái Hoàn Thành

| Component | Status | Notes |
|-----------|--------|-------|
| Header | ✅ Done | Glassmorphism, scroll effect |
| Hero | ✅ Done | Priority image, CTA buttons |
| Brand Story | ✅ Done | Parallax image |
| Philosophy | ✅ Done | Opacity scroll |
| Product Lines | ✅ Done | Vertical layout |
| Materials | ✅ Done | 3 cards |
| Craftsmanship | ✅ Done | Sticky + crossfade |
| Testimonials | ✅ Done | 3 cards |
| Consultation | ✅ Done | Form UI |
| Contact CTA | ✅ Done | Tel + Zalo |
| Footer | ✅ Done | 4 columns |
| ScrollCine | ✅ Done | No-pinning architecture |

---

## Còn Cần Làm

- [ ] Kết nối form consultation với backend/Zalo
- [ ] Product detail page (`/products/[id]`)
- [ ] Thêm loading states
- [ ] SEO meta tags cho từng page
- [ ] Performance audit (Lighthouse)
- [ ] Mobile menu animation
- [ ] Image lazy loading optimization

---

## Commands

```bash
# Development
cd /opt/hylacviet/frontend
npm run dev -- -H 0.0.0.0

# Build
npm run build

# Start production
npm start
```

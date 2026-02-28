# Spec Driven - Hỷ Lạc Việt

> Tổng hợp tất cả design specification & research notes.  
> Cập nhật sau mỗi sprint.

---

## 1. Design System — "Imperial Zen"

### Color Palette
| Tên | Hex | Sử dụng |
|-----|-----|---------|
| Rice Paper (Giấy Dó) | `#F9F7F1` | Background chính |
| Stone Grey (Đá) | `#E6DBD4` | Secondary sections |
| Imperial Cinnabar (Son) | `#800020` | Accent, CTA |
| Aged Gold (Thếp) | `#C5A059` | Links, emphasis |
| Monk's Robe (Nâu Sồng) | `#5E4737` | Text, grounding |

### CSS Tokens (Production)
```css
:root {
  --color-gold: #c9a227;
  --color-gold-light: #e5d4a8;
  --color-gold-dark: #8b7355;
  --color-cream: #fffff0;
  --color-dark: #1a1614;
  --color-text: #3d3530;
  --c-paper: #F9F7F1;
  --c-gold: #C5A059;
  --c-lacquer: #921709;
  --c-ink: #2B231F;
  --c-stone: #E6DBD4;
}
```

### Easings ("Zen Physics")
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-slow: cubic-bezier(0.65, 0, 0.35, 1);
```

### Typography
- **Headings**: Cormorant Garamond (next/font), letter-spacing: -0.02em
- **Body**: Roboto (next/font), line-height: 1.6–1.8
- **Brand Name**: Cotta Free (custom @font-face)
- Max line-length: 65 characters

### Texture Strategy
- SVG noise filter (opacity 3–5%) cho "Giấy Dó" effect
- Subtle gradient shift on dark sections ("Lãnh Mỹ A" sheen)

### Iconography "Monoline Zen"
- Ultra-thin stroke (1–1.5px), rounded terminals
- Colors: Monk's Brown hoặc Aged Gold only

---

## 2. Header Spec — "Fog over the Citadel"

### State A (Top — transparent)
- Completely transparent, links float over hero image
- Logo in Aged Gold or White

### State B (Scrolled — frosted)
- "Frosted Rice Paper" strip
- `backdrop-filter: blur(12px) saturate(180%)`
- Noise texture overlay + gold bottom border

### Hover Effect
- Golden line draws from center out: `scaleX(0)` → `scaleX(1)`
- Text shifts to Lacquer Red (`#921709`)

---

## 3. Hero Spec — "The Golden Hour"

### Vignette Gradient
```css
background: linear-gradient(
  to right,
  rgba(0,0,0,0.6) 0%,
  rgba(0,0,0,0.3) 40%,
  rgba(0,0,0,0) 100%
);
```

### Typography
- Headline: Cormorant Garamond, Light 300
- Subtitle: Roboto, 0.875rem, letter-spacing: 0.2em

### Entrance Animation
1. Image: `scale(1.1)` → `scale(1.0)` over 20s
2. Subtitle: fade-up at 0.5s delay
3. Title: fade-up at 0.7s delay
4. CTA: fade-up at 1s delay

---

## 4. Homepage Sections

| # | Section | Status | Key Notes |
|---|---------|--------|-----------|
| 1 | Header (Fixed) | ✅ | Glassmorphism, scroll effect |
| 2 | Hero | ✅ | 3-gallery marquee, parallax |
| 3 | Brand Story | ✅ | Parallax image, 2-column |
| 4 | Philosophy Quote | ✅ | Opacity scroll |
| 5 | Product Showcase | ✅ | Coverflow Swiper |
| 6 | Craftsmanship | ✅ | Sticky + crossfade |
| 7 | Measurement Journey | ✅ | Timeline bespoke |
| 8 | Contact CTA | ✅ | Tel + Zalo |
| 9 | Footer | ✅ | 4 columns |

### ScrollCine / Animation System
```
[data-reveal]         → Fade + slide up (framer-motion)
[data-parallax]       → Image yPercent scroll
[data-opacity-scroll] → Opacity 0.2 → 1 scrub
```

### Những gì KHÔNG dùng (để tránh lỗi React)
| Tính năng | Lý do |
|-----------|-------|
| `ScrollTrigger.pin()` | Sửa đổi DOM → React error |
| Horizontal scroll GSAP | Sửa đổi DOM → lỗi navigate |
| `SplitType` với line mask | DOM manipulation conflicts |

---

## 5. CSS Refinements

### Hero Typography Fix
- Cinematic Vignette gradient từ bottom + text shadow
```css
.hero-headline {
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  font-weight: 300;
  letter-spacing: -0.02em;
}
```

### Dark Section Lacquer Texture
- Warm brown (`#2b231f`) thay vì pure black + noise + golden borders

### Icon Sizing
| Context | Size | Stroke |
|---------|------|--------|
| Feature section | 48–64px | 1.2px |
| Utility menu | 24–32px | 1px |

---

## 6. Responsive Breakpoints

| Breakpoint | Changes |
|------------|---------|
| **1024px** | Reduce padding, 2-column grids |
| **768px** | Single column, mobile menu, stacked |
| **375px** | Mobile optimized |

---

## 7. Micro-interactions
- **Duration**: 0.8s – 1.2s (slow, zen)
- **Easing**: `cubic-bezier(0.2, 0.0, 0.2, 1.0)`
- Parallax texture on background

---

## 8. CTAs
- "Đặt lịch tư vấn" thay vì "Mua ngay"
- Conversational booking flow (via Zalo)

---

*Gộp từ: giao-dien-trang-chu.md, imperial-zen-header-hero.md, imperial-zen-research.md, last-mile-css-research.md*  
*Sprint: SEO Sprint — 2026-02-28*

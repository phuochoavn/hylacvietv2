# Last Mile CSS Refinements

> **Lưu ý**: Tài liệu nghiên cứu về CSS specifics

## 1. Hero Typography Fix

**Vấn đề**: Text trắng trên background busy, thiếu contrast

**Giải pháp**: Cinematic Vignette gradient từ bottom + text shadow

```css
.hero-section::after {
  background: linear-gradient(
    to bottom,
    rgba(20, 20, 20, 0) 0%,
    rgba(20, 20, 20, 0.6) 70%,
    rgba(20, 20, 20, 0.9) 100%
  );
  height: 60%;
}

.hero-headline {
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  font-weight: 300;
  letter-spacing: -0.02em;
}
```

---

## 2. Dark Section Lacquer Texture

**Vấn đề**: Pure black thiếu depth

**Giải pháp**: Warm brown (#2b231f) + noise texture + golden borders

```css
.bespoke-section {
  background-color: #2b231f; /* Not pure black */
}

.icon-container {
  border-top: 1px solid rgba(197, 160, 89, 0.3);
  border-bottom: 1px solid rgba(197, 160, 89, 0.3);
}

.icon-item {
  border-right: 1px solid rgba(197, 160, 89, 0.1);
}
```

---

## 3. Product Placeholder

**Vấn đề**: "Đang cập nhật" = error message

**Giải pháp**: "TÁC PHẨM ĐANG HOÀN THIỆN" + silhouette effect

---

## 4. Icon Sizing

| Context | Size | Stroke |
|---------|------|--------|
| Feature section | 48-64px | 1.2px |
| Utility menu | 24-32px | 1px |

**Tại sao 1.2px?**
- 1px quá mảnh cho icon 64px
- 2px quá chunky
- 1.2px = Fine Art elegance + visible on high-DPI

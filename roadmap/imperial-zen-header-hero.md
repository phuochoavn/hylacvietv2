# Imperial Zen - Header & Hero Specification

> **Source**: Design specification for "Digital Cinema" experience

## Color Tokens
```css
--c-paper: #F9F7F1;
--c-gold: #C5A059;
--c-lacquer: #921709;
--c-ink: #2B231F;
--c-stone: #E6DBD4;
```

## Easings ("Zen Physics")
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-slow: cubic-bezier(0.65, 0, 0.35, 1);
```

---

## Header: "Fog over the Citadel"

### State A (Top)
- Completely transparent
- Links float over hero image
- Logo in Aged Gold or White

### State B (Scrolled)
- "Frosted Rice Paper" strip
- `backdrop-filter: blur(12px) saturate(180%)`
- Noise texture overlay
- Gold bottom border

### Hover Effect
- Golden line draws from center out
- `transform: scaleX(0)` → `scaleX(1)`
- `transform-origin: center`
- Text shifts to Lacquer Red (#921709)

---

## Hero: "The Golden Hour"

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
- Headline: Noto Serif Display, Light 300
- Subtitle: Be Vietnam Pro, 0.875rem, letter-spacing: 0.2em

### Entrance Animation
1. Image: scale(1.1) → scale(1.0) over 20s
2. Subtitle: fade-up at 0.5s delay
3. Title: fade-up at 0.7s delay
4. CTA: fade-up at 1s delay

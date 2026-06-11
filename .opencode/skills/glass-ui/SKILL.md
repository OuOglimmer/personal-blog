---
name: glass-ui
description: Use when writing SCSS or styling for Vue components in this look-blog project. The project uses a custom glass-morphism design system with predefined SCSS mixins.
---

# Glass UI Design System

This skill covers the glass-morphism SCSS mixins and styling conventions used throughout the look-blog project.

## SCSS Mixins (`@/styles/glass.scss`)

Always import first in `<style scoped lang="scss">`:
```scss
@use '@/styles/glass' as *;
```

### Available Mixins

```scss
// Full-page wrapper with relative positioning and overflow-x hidden
@include page-layout;

// Centers content vertically & horizontally on screen
// Adds top/bottom padding for header/footer clearance
@include page-center;

// Glass card: semi-transparent bg, backdrop-blur, white border, rounded
@include glass-card;
// └── provides: background rgba(255,255,255,0.08), blur 16px, border-radius 20px, padding 48px 40px, text-align center

// Large title (3rem) with responsive down to 2rem
@include glass-card-title;

// Subtitle/description paragraph (1.2rem, 0.8 opacity)
@include glass-card-desc;
```

### Typical Page Layout

```vue
<style scoped lang="scss">
@use '@/styles/glass' as *;

.page {
  @include page-layout;
}

.page-center {
  @include page-center;
}

.glass-card {
  @include glass-card;
  h1 { @include glass-card-title; }
  p { @include glass-card-desc; }
}
</style>
```

## Color Palette

- **Background base**: `rgba(10, 10, 22, ...)` dark purple-black
- **Glass cards**: `rgba(255, 255, 255, 0.06)` to `0.08`
- **Glass borders**: `rgba(255, 255, 255, 0.1)` to `0.15`
- **Text**: `#fff` (white), with opacity for secondary
- **Accent**: `#667eea` (purple-blue), sometimes `#42b883` (vue green)
- **Text secondary**: `opacity: 0.6` to `0.8` on white

## Blur & Backdrop

Every glass element MUST include both properties:
```scss
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
```

Blur values by context:
- Cards: `blur(16px)`
- Header: `blur(20px)`
- Content cards: `blur(12px)`
- Overlays: `blur(20px)`

## Interactive Effects

### Hover Card Lift
```scss
transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
cursor: pointer;

&:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}
```

### Performance
- Use `will-change: transform, opacity` on scroll-animated elements
- Use CSS `transform` and `opacity` only for animations (never `top`/`left`)

### Tags/Badges
```scss
// Pill tag
font-size: 0.75rem;
padding: 2px 10px;
border-radius: 12px;
background: rgba(255, 255, 255, 0.1);
border: 1px solid rgba(255, 255, 255, 0.15);
```

## Responsive Breakpoint

```scss
@media (max-width: 640px) {
  // max-width: 95vw, padding: 32px 20px for glass-card
  // grid-template-columns: 1fr for grids
  // font-size: 2rem for titles
}
```

## Key Rules

1. Never use solid white backgrounds; always use translucent rgba
2. Always pair `backdrop-filter` with `-webkit-backdrop-filter`
3. Use `position: relative; z-index: 1` on cards above background layers
4. Use `position: fixed; z-index: 100` for the header
5. Prefer `gap` over margin for spacing in flex/grid layouts
6. Text colors use opacity on white (`rgba(255,255,255,0.7)`) not gray hex

# UI Style Guide: Glassmorphism & Interactive Effects

> A comprehensive guide to replicate the liquid glass hover effect and overall UI style from this portfolio

---

## 📦 Essential Files Checklist

### Font Files
**Location:** `static/fonts/` (production) or `src/lib/assets/fonts/` (fallback)

Required files:
- `ppneuebit-bold.otf` - Bold display font
- `ppmondwest-regular.otf` - Regular body font

**Installation:**
1. Place `.otf` files in `static/fonts/`
2. Add `@font-face` declarations in `src/app.css` (see below)

### Color Tokens
**Location:** `src/app.css`

```css
:root {
    --color-blue: #1900FF;      /* Primary brand color */
    --color-white: #FFFFFF;     /* Light backgrounds */
    --color-black: #000000;     /* Dark text */
    --color-mutedgray: #4C4C4C; /* Secondary text */
}
```

### External Fonts
**Google Fonts:**
- **Zalando Sans** (variable font) - Used for project cards
- **Inter Variable** - Used for descriptions

Add to `src/app.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Zalando+Sans:ital,wdth,wght@0,75..125,200..900;1,75..125,200..900&display=swap');
```

---

## 🔮 The Liquid Glass Effect

### Complete CSS Implementation

```css
.card {
    width: 100%;
    height: 100%;
    border-radius: 28px;
    overflow: hidden;
    
    /* ━━━ GLASSMORPHISM CORE ━━━ */
    background: linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.32) 0%,   /* Top-left: bright white */
        rgba(25, 0, 255, 0.05) 40%,     /* Mid: subtle blue tint */
        rgba(80, 60, 255, 0.10) 100%    /* Bottom-right: purple glow */
    );
    
    backdrop-filter: blur(18px) saturate(160%);
    -webkit-backdrop-filter: blur(18px) saturate(160%);
    
    /* ━━━ MULTI-TONE BORDER ━━━ */
    border: 1px solid rgba(25, 0, 255, 0.14);
    border-top-color: rgba(255, 255, 255, 0.5);    /* Lighter top edge */
    border-left-color: rgba(255, 255, 255, 0.3);   /* Lighter left edge */
    
    /* ━━━ BASE SHADOW (no hover) ━━━ */
    box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.45),   /* Inner highlight */
        0 4px 24px rgba(25, 0, 255, 0.07);          /* Soft outer shadow */
    
    /* ━━━ 3D TRANSFORM SETUP ━━━ */
    transform-style: preserve-3d;
    will-change: transform;
    
    transition:
        transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        box-shadow 0.22s ease;
}
```

### Key Glassmorphism Parameters

| Property | Value | Purpose |
|----------|-------|---------|
| `backdrop-filter` | `blur(18px) saturate(160%)` | Creates frosted glass effect |
| `background` | Multi-stop gradient with alpha | Subtle color shift + transparency |
| `border-radius` | `28px` | Smooth, modern rounded corners |
| `border` | Multi-color (top/left lighter) | Simulates light reflection |
| `box-shadow` | Dual (inset + outer) | Depth and inner highlight |

---

## 🎯 Interactive 3D Tilt Effect

### Implementation Pattern

#### 1. Wrapper with Perspective
```svelte
<div
    class="card-wrap"
    style="perspective: 1100px;"
    onmousemove={(e) => onMouseMove(e, i)}
    onmouseleave={() => onMouseLeave(i)}
>
```

**Why `perspective: 1100px`?**
- Creates the 3D space depth
- Higher value = more subtle 3D effect
- Applied to parent, not the card itself

#### 2. Tilt State Management
```typescript
// State for each card (rx = rotateX, ry = rotateY)
let tilts = $state(Array.from(
    { length: 4 }, 
    () => ({ rx: 0, ry: 0, hovering: false })
));

// Mouse move handler
function onMouseMove(e: MouseEvent, i: number) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    
    // Normalize mouse position to -1...1 range
    const nx = (e.clientX - rect.left) / rect.width  * 2 - 1;
    const ny = (e.clientY - rect.top)  / rect.height * 2 - 1;
    
    const MAX = 12;  // Max rotation in degrees
    tilts[i] = { 
        rx: -ny * MAX,  // Invert Y for natural tilt
        ry: nx * MAX, 
        hovering: true 
    };
}

// Reset on mouse leave
function onMouseLeave(i: number) {
    tilts[i] = { rx: 0, ry: 0, hovering: false };
}
```

#### 3. Dynamic Styling
```svelte
<div
    class="card"
    style="
        transform: rotateX({tilts[i].rx}deg) 
                   rotateY({tilts[i].ry}deg) 
                   scale({tilts[i].hovering ? 1.025 : 1});
        
        box-shadow: {tilts[i].hovering
            ? `${-tilts[i].ry * 0.7}px ${tilts[i].rx * 0.7}px 52px rgba(25,0,255,0.20), 
               inset 0 1px 0 rgba(255,255,255,0.58)`
            : 'inset 0 1px 0 rgba(255,255,255,0.45), 
               0 4px 24px rgba(25,0,255,0.07)'};
    "
>
```

**Hover Shadow Formula:**
- **X offset:** `-tilts[i].ry * 0.7` (inverted, follows tilt)
- **Y offset:** `tilts[i].rx * 0.7` (follows tilt)
- **Blur:** `52px` (large for dramatic effect)
- **Color:** `rgba(25,0,255,0.20)` (brand blue at 20% opacity)

---

## 🎨 Complete Component Template

### Copy-Paste Starter

```svelte
<script lang="ts">
    let { items = [] } = $props();
    
    let tilts = $state(Array.from(
        { length: items.length }, 
        () => ({ rx: 0, ry: 0, hovering: false })
    ));
    
    function onMouseMove(e: MouseEvent, i: number) {
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width  * 2 - 1;
        const ny = (e.clientY - rect.top)  / rect.height * 2 - 1;
        const MAX = 12;
        tilts[i] = { rx: -ny * MAX, ry: nx * MAX, hovering: true };
    }
    
    function onMouseLeave(i: number) {
        tilts[i] = { rx: 0, ry: 0, hovering: false };
    }
</script>

<div class="grid">
    {#each items as item, i}
        <div
            class="card-wrap"
            style="perspective: 1100px;"
            onmousemove={(e) => onMouseMove(e, i)}
            onmouseleave={() => onMouseLeave(i)}
        >
            <div
                class="glass-card"
                style="
                    transform: rotateX({tilts[i].rx}deg) rotateY({tilts[i].ry}deg) scale({tilts[i].hovering ? 1.025 : 1});
                    box-shadow: {tilts[i].hovering
                        ? `${-tilts[i].ry * 0.7}px ${tilts[i].rx * 0.7}px 52px rgba(25,0,255,0.20), inset 0 1px 0 rgba(255,255,255,0.58)`
                        : 'inset 0 1px 0 rgba(255,255,255,0.45), 0 4px 24px rgba(25,0,255,0.07)'};
                "
            >
                <h3 class="title zalando" class:bold={tilts[i].hovering}>
                    {item.title}
                </h3>
                <p class="description">{item.description}</p>
            </div>
        </div>
    {/each}
</div>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem;
    }
    
    .card-wrap {
        cursor: pointer;
        height: 100%;
    }
    
    .glass-card {
        width: 100%;
        height: 100%;
        padding: 1.5rem;
        border-radius: 28px;
        
        /* GLASSMORPHISM */
        background: linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.32) 0%,
            rgba(25, 0, 255, 0.05) 40%,
            rgba(80, 60, 255, 0.10) 100%
        );
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        
        /* BORDERS */
        border: 1px solid rgba(25, 0, 255, 0.14);
        border-top-color: rgba(255, 255, 255, 0.5);
        border-left-color: rgba(255, 255, 255, 0.3);
        
        /* 3D SETUP */
        transform-style: preserve-3d;
        will-change: transform;
        
        transition:
            transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.22s ease;
    }
    
    .title {
        font-size: 20px;
        font-weight: 400;
        color: var(--color-blue);
        margin-bottom: 0.5rem;
        transition: font-weight 0.18s ease;
    }
    
    .title.bold {
        font-weight: 700;
    }
    
    .description {
        font-size: 13px;
        font-weight: 300;
        color: rgba(25, 0, 255, 0.52);
        line-height: 1.5;
    }
</style>
```

---

## ⚙️ Customization Parameters

### Adjust These Values for Different Effects

#### Glass Opacity
```css
/* More transparent */
background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.15) 0%,   /* Lower = more transparent */
    rgba(25, 0, 255, 0.03) 40%,
    rgba(80, 60, 255, 0.05) 100%
);

/* More opaque */
background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.65) 0%,   /* Higher = more opaque */
    rgba(25, 0, 255, 0.12) 40%,
    rgba(80, 60, 255, 0.18) 100%
);
```

#### Blur Intensity
```css
/* Subtle blur */
backdrop-filter: blur(8px) saturate(140%);

/* Original */
backdrop-filter: blur(18px) saturate(160%);

/* Extreme blur */
backdrop-filter: blur(32px) saturate(180%);
```

#### Tilt Sensitivity
```typescript
const MAX = 8;   // Subtle tilt
const MAX = 12;  // Original (recommended)
const MAX = 20;  // Dramatic tilt
```

#### Hover Scale
```svelte
scale({tilts[i].hovering ? 1.025 : 1})  <!-- Original: 2.5% growth -->
scale({tilts[i].hovering ? 1.05 : 1})   <!-- Larger: 5% growth -->
scale({tilts[i].hovering ? 1.01 : 1})   <!-- Subtle: 1% growth -->
```

#### Shadow Intensity
```css
/* Hover shadow */
box-shadow: 
    ${-tilts[i].ry * 0.7}px 
    ${tilts[i].rx * 0.7}px 
    52px                          /* Blur radius */
    rgba(25,0,255,0.20),         /* Color opacity */
    inset 0 1px 0 rgba(255,255,255,0.58);

/* Adjust blur (24-80px range) */
/* Adjust opacity (0.10-0.35 range) */
```

---

## 🎬 Slide Transitions (Bonus)

### Bi-directional Slide Animation

```typescript
import { cubicOut } from "svelte/easing";

let dir = $state<1 | -1>(1); // 1 = forward, -1 = backward

function slideIn(node: Element, { duration = 640 }) {
    const d = dir;
    return {
        duration,
        css: (t: number) => {
            const e = cubicOut(t);
            return `
                opacity: ${e};
                transform: translateY(${(1 - e) * (d === 1 ? 100 : -100)}%);
            `;
        }
    };
}

function slideOut(node: Element, { duration = 640 }) {
    const d = dir;
    return {
        duration,
        css: (t: number) => {
            const e = cubicOut(1 - t);
            return `
                opacity: ${t};
                transform: translateY(${e * (d === 1 ? -100 : 100)}%);
            `;
        }
    };
}
```

**Usage:**
```svelte
{#key currentPage}
<div
    class="content"
    in:slideIn={{ duration: 640 }}
    out:slideOut={{ duration: 640 }}
>
    <!-- content -->
</div>
{/key}
```

---

## 📐 Typography Classes

### Font Setup in `src/app.css`

```css
/* Custom Fonts */
@font-face {
    font-family: 'PP Neue Bit';
    src: url('/fonts/ppneuebit-bold.otf') format('opentype'),
         url('/lib/fonts/ppneuebit-bold.otf') format('opentype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}

@font-face {
    font-family: 'PP Mondwest';
    src: url('/fonts/ppmondwest-regular.otf') format('opentype'),
         url('/lib/fonts/ppmondwest-regular.otf') format('opentype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
}

/* Utility Classes */
.mondwest {
    font-family: 'PP Mondwest', sans-serif;
    font-weight: 400;
}

.neuebit {
    font-family: 'PP Neue Bit', sans-serif;
    font-weight: 700;
}

.zalando {
    font-family: 'Zalando Sans', sans-serif;
    font-weight: 200;
}

.h1 { font-size: 54px; }
.h2 { font-size: 36px; }
```

### Usage Pattern
```svelte
<h1 class="neuebit h1">Big Title</h1>
<h2 class="mondwest h2">Subtitle</h2>
<p class="zalando">Body text with variable font</p>
```

---

## 🧩 Common Patterns

### Dot Pagination Indicators
```svelte
<div class="dots">
    {#each pages as _, pi}
        <button
            class="dot"
            class:active={pi === currentPage}
            onclick={() => currentPage = pi}
            aria-label="Page {pi + 1}"
        ></button>
    {/each}
</div>

<style>
    .dots {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
    
    .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        border: none;
        background: rgba(25, 0, 255, 0.18);
        cursor: pointer;
        transition: background 0.25s ease, transform 0.25s ease;
        padding: 0;
    }
    
    .dot.active {
        background: var(--color-blue);
        transform: scale(1.35);
    }
</style>
```

### Bold on Hover (Variable Font)
```svelte
<span class="zalando" class:bold={isHovering}>
    Text
</span>

<style>
    .card-title {
        font-weight: 400;
        transition: font-weight 0.18s ease;
    }
    
    .card-title.bold {
        font-weight: 700;
    }
</style>
```

---

## 🚀 Quick Start Checklist

- [ ] Copy `ppneuebit-bold.otf` and `ppmondwest-regular.otf` to `static/fonts/`
- [ ] Add `@font-face` declarations to `src/app.css`
- [ ] Add color tokens to `:root` in `src/app.css`
- [ ] Import Zalando Sans in `src/app.css`
- [ ] Create new component with glass card template (above)
- [ ] Test glassmorphism effect on different backgrounds
- [ ] Adjust blur/opacity/shadow to taste
- [ ] Add tilt state management
- [ ] Implement mouse move handlers
- [ ] Test on different screen sizes

---

## 🎯 Browser Compatibility Notes

- **`backdrop-filter`:** Include `-webkit-` prefix for Safari
- **`saturate()`:** Works in all modern browsers (Safari 9+)
- **`transform-style: preserve-3d`:** Supported everywhere except IE11
- **`font-display: swap`:** Prevents FOIT (Flash of Invisible Text)

### Fallback Pattern
```css
@supports not (backdrop-filter: blur(18px)) {
    .glass-card {
        background: rgba(255, 255, 255, 0.85);
        /* Solid fallback for old browsers */
    }
}
```

---

## 📚 Reference Files

| File | Purpose |
|------|---------|
| [`src/lib/ProjectsPanel.svelte`](src/lib/ProjectsPanel.svelte) | Complete implementation reference |
| [`src/app.css`](src/app.css) | Fonts, colors, global styles |
| [`src/routes/+page.svelte`](src/routes/+page.svelte) | Usage in context |

---

**Last Updated:** February 24, 2026  
**Effect Name:** Liquid Glass + 3D Tilt  
**Tested On:** Chrome 120+, Firefox 120+, Safari 17+

# Design System Rules for Figma-to-Code Integration

> Comprehensive guidelines for converting Figma designs to code in this SvelteKit + TailwindCSS v4 portfolio project

---

## 1. Token Definitions

### Color Tokens
Colors are defined as CSS custom properties in [src/app.css](src/app.css):

```css
:root {
    --color-blue: #1900FF;
    --color-white: #FFFFFF;
    --color-black: #000000;
    --color-mutedgray: #4C4C4C;
}
```

**Usage Pattern:**
- Use `var(--color-blue)` for primary brand color
- Use `var(--color-white)` for light backgrounds
- Use `var(--color-black)` for dark text/backgrounds
- Use `var(--color-mutedgray)` for secondary/muted text

**When Converting from Figma:**
- Map Figma primary brand colors to `var(--color-blue)`
- Map neutral grays to `var(--color-mutedgray)`
- For additional colors from Figma, add new CSS custom properties following the `--color-[name]` pattern

### Typography Tokens
Custom fonts are loaded via `@font-face` in [src/app.css](src/app.css):

**Font Families:**
```css
.mondwest {
    font-family: 'PP Mondwest', sans-serif;
    font-weight: 400;
}

.neuebit {
    font-family: 'PP Neue Bit', sans-serif;
    font-weight: 700;
}
```

**Font Sizes:**
```css
.h1 { font-size: 54px; }
.h2 { font-size: 36px; }
```

**Font Files Location:**
- Primary: `/static/fonts/` (production)
- Fallback: `/src/lib/assets/fonts/` (development)
- Files: `ppmondwest-regular.otf`, `ppneuebit-bold.otf`

**When Converting from Figma:**
- Map Figma display/heading text → `class="neuebit h1"` or `class="neuebit h2"`
- Map Figma body/paragraph text → `class="mondwest"`
- For new sizes, add utility classes like `.h3`, `.h4`, etc.
- Always include appropriate Tailwind text utilities for responsive sizing

### Spacing Tokens
This project uses **Tailwind CSS v4** spacing utilities. No custom spacing tokens defined.

**Standard Pattern:**
- Use Tailwind spacing: `p-4`, `m-8`, `gap-6`, etc.
- Use Tailwind responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

**When Converting from Figma:**
- Convert Figma spacing values to nearest Tailwind spacing scale (4px = 1 unit)
- Example: Figma 16px → `p-4`, Figma 32px → `p-8`

---

## 2. Component Library

### Component Location
- **Reusable Components:** `src/lib/*.svelte`
- **Story Components:** `src/stories/*.svelte` (Storybook examples)
- **Route Components:** `src/routes/+page.svelte`, etc.

### Component Architecture: **Svelte 5 (Runes API)**

**Modern Svelte 5 Patterns:**

```svelte
<script lang="ts">
  // Props using $props() rune
  interface Props {
    label: string;
    primary?: boolean;
    size?: 'small' | 'medium' | 'large';
    onclick?: () => void;
  }
  
  const { primary = false, size = 'medium', label, ...props }: Props = $props();
  
  // Derived state using $derived rune
  let mode = $derived(primary ? 'button--primary' : 'button--secondary');
</script>

<button
  type="button"
  class={['button', `button--${size}`, mode].join(' ')}
  {...props}
>
  {label}
</button>
```

**Key Patterns:**
- Use `$props()` rune for component props (NOT `export let`)
- Use `$derived` for computed values (NOT `$:`)
- Use `$state` for reactive state (NOT `let` with `$:`)
- TypeScript interfaces for prop types

### Component Documentation
**Storybook is configured** (`src/stories/` folder)

**Story Pattern:**
```svelte
<!-- Button.stories.svelte -->
<script lang="ts">
  import Button from './Button.svelte';
</script>

<!-- Stories go here -->
```

**When Adding New Components:**
1. Create component in `src/lib/[ComponentName].svelte`
2. Export from `src/lib/index.ts` if needed for library use
3. Create story file in `src/stories/[ComponentName].stories.svelte`
4. Use scoped CSS or separate `.css` file for component-specific styles

---

## 3. Frameworks & Libraries

### UI Framework
- **Framework:** SvelteKit 2.49.1 with Svelte 5.45.6
- **Routing:** File-based routing in `src/routes/`
- **Layout System:** `+layout.svelte` files for nested layouts

### Styling Framework
- **Primary:** Tailwind CSS v4.1.17 (latest version with Vite plugin)
- **Plugins:** 
  - `@tailwindcss/forms` - Form styling utilities
  - `@tailwindcss/typography` - Typography styles for prose content
- **Configuration:** [src/routes/layout.css](src/routes/layout.css)

```css
@import 'tailwindcss';
@plugin '@tailwindcss/forms';
@plugin '@tailwindcss/typography';
```

### Build System
- **Bundler:** Vite 7.2.6
- **Vite Plugins:**
  - `@tailwindcss/vite` - Tailwind CSS v4 integration
  - `@sveltejs/kit/vite` - SvelteKit plugin
  - `vite-plugin-devtools-json` - Dev tools support

**Configuration:** [vite.config.ts](vite.config.ts)
```typescript
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({ 
  plugins: [tailwindcss(), sveltekit(), devtoolsJson()] 
});
```

### Development Tools
- **Type Checking:** TypeScript 5.9.3 with strict mode
- **Testing:** Playwright (E2E), Vitest (unit/component)
- **Linting:** ESLint 9 (flat config) + Prettier
- **Component Dev:** Storybook 10.1.10

---

## 4. Asset Management

### Asset Storage Structure
```
static/
├── fonts/              # Font files (public)
│   ├── ppmondwest-regular.otf
│   └── ppneuebit-bold.otf
└── robots.txt

src/lib/assets/
├── favicon.svg         # Imported assets
└── fonts/              # Font fallback location
    ├── ppmondwest-regular.otf
    └── ppneuebit-bold.otf
```

### Asset Import Patterns

**Static Assets (public):**
```svelte
<!-- Reference via absolute path -->
<img src="/images/hero.jpg" alt="Hero" />
```

**Imported Assets (bundled):**
```svelte
<script>
  import favicon from '$lib/assets/favicon.svg';
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>
```

**Font Loading:**
```css
@font-face {
    font-family: 'PP Neue Bit';
    src: url('/fonts/ppneuebit-bold.otf') format('opentype'),
         url('/lib/fonts/ppneuebit-bold.otf') format('opentype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
}
```

### Asset Optimization
- **Build-time:** Vite handles asset optimization automatically
- **Font Display:** Uses `font-display: swap` for better performance
- **No CDN Configuration:** Assets served from build output

**When Adding Assets from Figma:**
1. Export images as WebP or AVIF for photos (better compression)
2. Export icons/illustrations as SVG when possible
3. Place in `static/` for public assets or `src/lib/assets/` for bundled assets
4. Use descriptive filenames: `hero-background.avif`, `icon-arrow.svg`

---

## 5. Icon System

### Current State
**No dedicated icon system implemented yet.**

**When Adding Icons from Figma:**

**Option A: SVG Components (Recommended)**
```svelte
<!-- src/lib/icons/ArrowIcon.svelte -->
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...$$props}>
  <path d="M12 5l7 7-7 7" stroke="currentColor" stroke-width="2"/>
</svg>
```

Usage:
```svelte
<script>
  import ArrowIcon from '$lib/icons/ArrowIcon.svelte';
</script>

<ArrowIcon class="text-blue-500" />
```

**Option B: Static SVG Files**
```svelte
<img src="/icons/arrow.svg" alt="Arrow" />
```

**Option C: Icon Library Integration**
Consider adding `lucide-svelte` or `heroicons` for common icons:
```bash
pnpm add lucide-svelte
```

### Icon Naming Convention
When creating custom icons:
- **Format:** `[category]-[name].svelte` or `[Category][Name]Icon.svelte`
- **Examples:** `arrow-right.svelte`, `ArrowRightIcon.svelte`
- **Location:** `src/lib/icons/`

---

## 6. Styling Approach

### CSS Methodology: **Hybrid (Tailwind + Scoped CSS)**

### Primary Approach: Tailwind Utility Classes
```svelte
<div class="flex flex-col items-center justify-center min-h-screen px-4">
  <h1 class="text-[var(--color-blue)] mondwest text-center -mt-8">
    Welcome
  </h1>
</div>
```

### Secondary: Component-Scoped CSS
```svelte
<button class="custom-button">Click me</button>

<style>
  .custom-button {
    /* Component-specific styles */
    border-radius: 12px;
    transition: transform 0.2s;
  }
  
  .custom-button:hover {
    transform: scale(1.05);
  }
</style>
```

### Tertiary: Separate CSS Files for Complex Components
```svelte
<script>
  import './button.css';
</script>

<button class="storybook-button storybook-button--primary">
  Click me
</button>
```

### Global Styles
- **Location:** [src/app.css](src/app.css) (tokens, fonts)
- **Layout Styles:** [src/routes/layout.css](src/routes/layout.css) (Tailwind imports)
- **Import Order:** `layout.css` → `app.css` in `+layout.svelte`

### CSS Custom Properties with Tailwind
```svelte
<!-- Using CSS variables with Tailwind's arbitrary values -->
<div class="text-[var(--color-blue)] bg-[var(--color-white)]">
  Content
</div>
```

### Responsive Design Pattern
```svelte
<div class="
  px-4 sm:px-6 md:px-8 
  text-sm sm:text-base md:text-lg
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
">
  <!-- Responsive content -->
</div>
```

**Breakpoints (Tailwind defaults):**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Animation Patterns
**Svelte Transitions:**
```svelte
<script>
  import { fade, slide } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
</script>

{#if visible}
  <div transition:fade={{duration: 300, easing: cubicOut}}>
    Content
  </div>
{/if}
```

**CSS Animations:** Define in `<style>` blocks or use Tailwind's animate utilities.

---

## 7. Project Structure

### Directory Organization
```
c:\Users\tejas\prog\port\
├── src/
│   ├── lib/                    # Reusable components & utilities
│   │   ├── index.ts           # Library exports
│   │   ├── *.svelte           # Shared components
│   │   └── assets/            # Bundled assets (favicon, etc.)
│   │       └── fonts/         # Font files (fallback)
│   ├── routes/                # SvelteKit file-based routing
│   │   ├── +layout.svelte     # Root layout
│   │   ├── +page.svelte       # Index page
│   │   └── layout.css         # Tailwind imports
│   ├── stories/               # Storybook component examples
│   │   ├── *.svelte           # Component implementations
│   │   ├── *.stories.svelte   # Storybook stories
│   │   └── *.css              # Component styles
│   ├── app.css                # Global styles & tokens
│   ├── app.d.ts               # TypeScript declarations
│   └── app.html               # HTML template
├── static/                    # Public assets (served as-is)
│   └── fonts/                 # Font files (production)
├── e2e/                       # Playwright E2E tests
├── package.json               # Dependencies & scripts
├── svelte.config.js           # SvelteKit configuration
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── eslint.config.js           # ESLint flat config
```

### File Naming Conventions
- **Components:** PascalCase - `Button.svelte`, `LoadingAnimator.svelte`
- **Routes:** Kebab-case with SvelteKit conventions - `+page.svelte`, `+layout.svelte`
- **Styles:** Kebab-case - `button.css`, `header.css`
- **Utilities:** camelCase - `index.ts`, `utils.ts`

### Import Aliases
- **`$lib`**: Resolves to `src/lib/`
- **`$app`**: SvelteKit app imports (`$app/navigation`, `$app/stores`)

**Example:**
```svelte
<script>
  import Component from '$lib/Component.svelte';
  import { page } from '$app/stores';
</script>
```

### Feature Organization Pattern
**Current:** Simple flat structure in `src/lib/` and `src/routes/`

**For Scaling (Recommended):**
```
src/lib/
├── components/         # UI components
│   ├── ui/            # Generic UI (buttons, inputs)
│   └── features/      # Feature-specific components
├── utils/             # Helper functions
├── stores/            # Svelte stores
└── types/             # TypeScript types
```

---

## 8. Figma-to-Code Workflow

### Step-by-Step Conversion Process

#### 1. Analyze Figma Design
- Identify reusable components vs. one-off layouts
- Note color values and map to existing tokens
- Check typography styles
- Identify spacing patterns

#### 2. Token Mapping
- **Colors:** Map to `var(--color-*)` or add new tokens to `app.css`
- **Fonts:** Use `.mondwest` or `.neuebit` classes
- **Spacing:** Convert to Tailwind spacing scale

#### 3. Component Creation
```svelte
<!-- src/lib/[ComponentName].svelte -->
<script lang="ts">
  interface Props {
    // Define props from Figma properties/variants
  }
  
  const { prop1, prop2 = 'default' }: Props = $props();
</script>

<div class="/* Tailwind classes */">
  <!-- Component markup -->
</div>

<style>
  /* Component-specific styles if needed */
</style>
```

#### 4. Layout Implementation
```svelte
<!-- src/routes/[route]/+page.svelte -->
<script>
  import Component from '$lib/Component.svelte';
</script>

<main class="min-h-screen /* layout classes */">
  <Component />
</main>
```

#### 5. Responsive Behavior
- Use Tailwind responsive prefixes: `sm:`, `md:`, `lg:`
- Test at all breakpoints
- Use `flex`, `grid` with responsive variations

#### 6. Add Interactions
```svelte
<script>
  import { fade, slide } from 'svelte/transition';
  
  let isOpen = $state(false);
  
  function toggle() {
    isOpen = !isOpen;
  }
</script>

<button onclick={toggle}>Toggle</button>

{#if isOpen}
  <div transition:slide>Content</div>
{/if}
```

#### 7. Testing
- Create Storybook story in `src/stories/`
- Run `pnpm storybook` to preview
- Write component tests if needed

---

## 9. Best Practices & Conventions

### TypeScript Usage
- **Always use TypeScript** for components with props
- Define explicit `interface Props`
- Use type annotations for functions

### Accessibility
- Use semantic HTML elements
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Test with Storybook's a11y addon

### Performance
- Use `font-display: swap` for custom fonts
- Optimize images (WebP/AVIF for photos, SVG for icons)
- Lazy load heavy components with Svelte's `{#await}`
- Use Vite's code splitting automatically

### Code Style
- **Formatter:** Prettier with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss`
- **Linter:** ESLint with Svelte and TypeScript plugins
- Run `pnpm format` before committing
- Run `pnpm lint` to check for issues

### Component Props
```svelte
<script lang="ts">
  // ✅ Good: Explicit types, defaults, destructuring
  interface Props {
    title: string;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
  }
  
  const { title, size = 'md', onClick, ...rest }: Props = $props();
</script>

<!-- Spread remaining props -->
<button {...rest} onclick={onClick}>
  {title}
</button>
```

### State Management
```svelte
<script>
  import { writable } from 'svelte/store';
  
  // Local state (Svelte 5 rune)
  let count = $state(0);
  
  // Derived state
  let doubled = $derived(count * 2);
  
  // Reactive effects
  $effect(() => {
    console.log('Count changed:', count);
  });
</script>
```

---

## 10. Common Patterns from Existing Codebase

### Loading States
Pattern from [src/routes/+page.svelte](src/routes/+page.svelte):
```svelte
<script>
  import { fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  
  let showLoader = $state(true);
  
  function hideLoader() {
    showLoader = false;
  }
  
  setTimeout(hideLoader, 5000);
</script>

{#if showLoader}
  <div transition:fade={{duration: 300, easing: cubicOut}}>
    <LoadingAnimator on:animationComplete={hideLoader} />
  </div>
{:else}
  <div>
    <MainContent />
  </div>
{/if}
```

### Text Rotation/Animation
Pattern from [src/lib/loadingAnimator.svelte](src/lib/loadingAnimator.svelte):
```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { slide } from 'svelte/transition';
  
  let greetings = ['Loading...', 'Please Wait...'];
  let index = $state(0);
  let roller;
  
  onMount(() => {
    roller = setInterval(() => {
      if (index === greetings.length - 1) index = 0;
      else index++;
    }, 1250);
  });
  
  onDestroy(() => {
    clearInterval(roller);
  });
</script>

{#key index}
  <h1 transition:slide>{greetings[index]}</h1>
{/key}
```

### Canvas Integration
Pattern for creative effects:
```svelte
<canvas id="halftoneCanvas" class="max-w-full h-auto"></canvas>

<script>
  let halftoneCanvas;
  
  onMount(() => {
    halftoneCanvas = document.getElementById('halftoneCanvas');
    const ctx = halftoneCanvas.getContext('2d');
    // Canvas drawing logic...
  });
</script>
```

---

## 11. Quick Reference Checklist

When converting a Figma design to code:

- [ ] Map colors to existing tokens or add new ones in `app.css`
- [ ] Use `.mondwest` or `.neuebit` for custom fonts
- [ ] Convert spacing to Tailwind scale (4px = 1 unit)
- [ ] Create component in `src/lib/` with TypeScript interface
- [ ] Use Svelte 5 runes (`$props()`, `$state`, `$derived`)
- [ ] Apply Tailwind utilities first, scoped CSS second
- [ ] Add responsive classes (`sm:`, `md:`, `lg:`)
- [ ] Include transitions/animations with Svelte's built-in functions
- [ ] Create Storybook story for documentation
- [ ] Test component in isolation and in context
- [ ] Run `pnpm format` and `pnpm lint`
- [ ] Add TypeScript types for all props and functions
- [ ] Ensure accessibility (semantic HTML, ARIA labels)
- [ ] Optimize assets (WebP/AVIF for images, SVG for icons)

---

## 12. Resources & Commands

### Development Commands
```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm preview          # Preview production build
pnpm storybook        # Launch Storybook
pnpm test:e2e         # Run Playwright tests
pnpm format           # Format code with Prettier
pnpm lint             # Lint with ESLint
pnpm check            # Type check with svelte-check
```

### Important File Paths
- Design Tokens: [src/app.css](src/app.css)
- Tailwind Config: [src/routes/layout.css](src/routes/layout.css)
- Build Config: [vite.config.ts](vite.config.ts)
- SvelteKit Config: [svelte.config.js](svelte.config.js)
- TypeScript Config: [tsconfig.json](tsconfig.json)

### Documentation Links
- [SvelteKit Docs](https://svelte.dev/docs/kit/introduction)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/$state)
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Storybook for SvelteKit](https://storybook.js.org/docs/get-started/frameworks/sveltekit)

---

**Last Updated:** January 8, 2026  
**Project Version:** 0.0.1  
**Stack:** SvelteKit 2 + Svelte 5 + Tailwind CSS v4 + TypeScript + Storybook

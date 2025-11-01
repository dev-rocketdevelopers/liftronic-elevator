# Copilot Instructions for Liftronic Elevators Website

## Architecture Overview

This is a Next.js 15.5.2 + React 19.1.0 website with Sanity CMS for an elevator company. **Server Components First** - default to RSC, use `"use client"` only for interactivity (forms, animations, event handlers). Deploy to Cloudflare Pages via `@opennextjs/cloudflare`.

## Critical Path Aliases & Imports

- **Always use `~/` for imports** from `src/` - never `../../` relative paths
- Motion library imports depend on component type:
  - Client: `import { motion } from "motion/react"`
  - Server: `import * as motion from "motion/react-client"`
- Icons via `getIcon()` from `~/sanity/utils/iconMapper.ts` (maps string names to React Icons components)

## Sanity CMS Integration Pattern

**Data Flow:** Server Components → GROQ query in `~/sanity/utils/get*.ts` → Type from `~/sanity/lib/*Types.ts`

Example:

```typescript
// Server Component
import { getProductRanges } from "~/sanity/utils/getProductRanges";
import type { ProductRange } from "~/sanity/lib/productRangeTypes";

export default async function ProductsPage() {
  const ranges = await getProductRanges(); // Server-side fetch with revalidate: 3600
  return <ProductsClient ranges={ranges} />;
}
```

**Image Optimization:** All Sanity images use query params: `?w=800&h=600&fit=crop&auto=format&fm=webp&q=85`. LQIP placeholders via `.asset->metadata.lqip` in GROQ.

**Null Handling:** Sanity references can return `null` - always filter arrays:

```typescript
products?.filter((p): p is Product => p !== null);
```

## Navigation & Routing

- **Smooth Scrolling:** Use `useSmoothScroll()` hook for anchor links (e.g., `#contact`)
- **DO NOT USE** `useViewTransition` - not utilized in this project
- **Location-Based SEO:** Dynamic route `/products/[slug]/[city]` requires 1500+ words per city page
- **Mega Menus:** Navbar uses hover state management with 150ms open delay, 200ms close delay (see `~/hooks/useMegaMenu.ts`)

## Styling System (Tailwind v4)

**Semantic Color Tokens** (defined in `globals.css`):

- `bg-brand` / `text-brand`: #00a86b (primary green)
- `bg-accent` / `text-accent`: #2ae394 (bright green)
- `text-charcoal` / `bg-charcoal`: #333333 (dark gray)
- `bg-soft`: #f9f9f9 (light background)

**Glass Morphism:** Pre-defined classes `glass-solid` and `glass-transparent` for navbar/modals.

**Container:** Uses CSS custom property `--container: min(1200px, 100vw - 2rem)` - apply via `.container` class.

**Mobile-First:** Always start with base styles, add `md:` and `lg:` breakpoints.

## Component Organization

```
src/components/
├── layout/         # Navbar, Footer (shared across pages)
│   └── navbar/     # Mega menu subcomponents
├── homepage/       # Hero, Services, Testimonials, etc.
├── products/       # ProductCard, ProductCarousel, etc.
├── services/       # ServiceCard, etc.
├── blog/           # BlogCard, PortableTextRenderer
└── [shared]/       # ContactForm, CatalogModal (root level)
```

**Naming:** PascalCase files, one component per file. Server components in route folders, client components marked with `"use client"`.

## Form Handling Pattern

All forms use `react-hook-form` + `zod` validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "~/lib/validation-schemas";

const form = useForm({
  resolver: zodResolver(contactFormSchema),
});
```

Validation schemas centralized in `~/lib/validation-schemas.ts`.

## Development Workflow

```bash
pnpm dev      # Turbopack dev server on :3000
pnpm build    # Production build (run before PRs)
pnpm lint     # ESLint - MUST pass before commits
```

**No automated tests** - validate manually. Lint is the only guardrail.

## Environment Variables (`.env.local`)

Required for local dev:

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
NEXT_PUBLIC_SITE_URL
```

Never commit secrets. Sanity Studio at `/studio` route.

## Animation Patterns

- Entrance animations: `motion.div` with stagger delays (e.g., `delay: index * 0.05`)
- Mega menu transitions: 200ms with blur + scale effects
- Page transitions: `nextjs-toploader` (already configured)
- Carousels: Use Motion library `AnimatePresence` for slides

## TypeScript Strictness

- No `any` types - explicit types for props, hooks, returns
- Import types with `import type { ... }`
- Sanity types auto-generated in `~/sanity/lib/*Types.ts`

## Common Gotchas

1. **Server vs Client Motion:** Wrong import crashes build
2. **Sanity Nulls:** Filter arrays before mapping to avoid `Cannot read properties of null`
3. **Path Aliases:** Using `../../` breaks refactoring - always use `~/`
4. **Image Remote Patterns:** Only `cdn.sanity.io` allowed in `next.config.ts`
5. **Glass Classes:** Don't override `glass-solid` - it's scroll-adaptive

## Key Files to Reference

- `AGENTS.md` - Full architecture documentation
- `src/components/layout/navbar/NavbarClient.tsx` - Complex client component example
- `src/sanity/lib/queries.ts` - GROQ query patterns
- `src/app/globals.css` - Tailwind v4 theme tokens
- `src/hooks/useMegaMenu.ts` - Custom hook with timers pattern

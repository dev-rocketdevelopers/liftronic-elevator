# Production Performance Audit

Date: March 7, 2026
Project: `lift-v1`
Scope: Next.js 15 App Router + Sanity CMS + Vercel deployment
Mode: Read-only audit, except for one targeted cache fix already applied to popup revalidation

## Current Status

- Popup-driven 60-second regeneration issue has already been fixed in [src/sanity/utils/getPopups.ts](/Users/sushil/Projects/React/lift-v1/src/sanity/utils/getPopups.ts).
- That change aligned popup fetch revalidation with the intended 1-hour ISR window for the shared public layout.
- The items below are the remaining production performance findings and recommended follow-up work.

## Critical Changes Before Launch

### 1. `/blogs` is rendering dynamically instead of as prerendered ISR HTML
- File: [src/app/(main)/blogs/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/blogs/page.tsx)
- Current behavior:
  - The route awaits `searchParams` in both `generateMetadata()` and the page component.
  - This makes the route request-time rendered in practice.
  - `revalidate = 3600` only applies to the internal data fetches, not to prerendered HTML output.
- Why this matters:
  - You lose the main benefit of static generation for the blog index.
  - Under traffic, the page pays request-time render cost instead of serving prerendered HTML.
- Exact fix:
  - Move pagination to a path-based route such as `/blogs/page/[n]` and use `generateStaticParams()`, or
  - Keep query-string pagination but accept SSR intentionally and document it.
- Estimated impact: High

### 2. Middleware is running on nearly every request without a real consumer
- File: [src/middleware.ts](/Users/sushil/Projects/React/lift-v1/src/middleware.ts)
- Current behavior:
  - Middleware injects `x-pathname` into request headers.
  - The codebase does not currently read that header through `headers()`.
  - The matcher still runs on a broad slice of public traffic.
- Why this matters:
  - Middleware adds avoidable request overhead before routing.
  - It taxes every matched request, including pages that do not need request-time logic.
- Exact fix:
  - Remove the middleware entirely if the header is unused, or
  - Narrow the matcher to only the exact routes that need it, excluding `/api`, metadata routes, and all irrelevant assets.
- Estimated impact: High

## High-Impact Changes

### 1. Route data is fetched twice per request/build pass because `cache()` is not used
- Files:
  - [src/app/(main)/products/[slug]/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/products/[slug]/page.tsx)
  - [src/app/(main)/services/[slug]/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/services/[slug]/page.tsx)
  - [src/app/(main)/blogs/[slug]/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/blogs/[slug]/page.tsx)
  - [src/app/(main)/products/[slug]/[city]/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/products/[slug]/[city]/page.tsx)
  - [src/app/(main)/branches/[slug]/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/branches/[slug]/page.tsx)
- Current behavior:
  - `generateMetadata()` fetches the Sanity entity.
  - The page body fetches the same entity again.
  - No `react cache()` usage exists in the repo to deduplicate this work.
- Why this matters:
  - It doubles Sanity traffic for important detail pages.
  - It increases render time and makes cache behavior harder to reason about.
- Exact fix:
  - Wrap the slug loaders in `cache()`, or
  - Share a single memoized server fetch helper between metadata and page rendering.
- Estimated impact: High

### 2. Product, service, and blog detail pages are oversized client islands
- Files:
  - [src/app/(main)/products/[slug]/ProductPageClient.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/products/[slug]/ProductPageClient.tsx)
  - [src/app/(main)/services/[slug]/ServicePageClient.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/services/[slug]/ServicePageClient.tsx)
  - [src/app/(main)/blogs/[slug]/BlogPostClient.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/blogs/[slug]/BlogPostClient.tsx)
- Current behavior:
  - Entire detail pages are marked `"use client"`.
  - Large static sections like hero blocks, long descriptions, FAQ content, feature lists, and blog body content hydrate in the browser.
  - The main reasons are view transitions, prefetch behavior, modal state, and similar small interactions.
- Why this matters:
  - The JS bundle is larger than necessary.
  - Hydration cost increases on the most SEO-sensitive pages.
- Exact fix:
  - Keep the page shell as a Server Component.
  - Split out small client children for gallery modals, FAQ accordions, and optional navigation enhancements.
- Estimated impact: High

### 3. Shared shell data is fetched repeatedly across layout, footer, and homepage
- Files:
  - [src/app/(main)/layout.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/layout.tsx)
  - [src/components/layout/Footer.tsx](/Users/sushil/Projects/React/lift-v1/src/components/layout/Footer.tsx)
  - [src/app/(main)/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/page.tsx)
- Current behavior:
  - `contactInfo`, `socials`, `companyInfo`, `branches`, and `homePageSettings` are fetched in multiple places.
- Why this matters:
  - It repeats server work and Sanity requests.
  - Shared layout content becomes more expensive than necessary on every page.
- Exact fix:
  - Hoist shared shell fetches to the highest common server boundary.
  - Memoize reusable Sanity helpers with `cache()`.
- Estimated impact: Medium

### 4. Many shared Sanity utilities rely on implicit cache behavior
- Files:
  - [src/sanity/utils/getContactInfo.ts](/Users/sushil/Projects/React/lift-v1/src/sanity/utils/getContactInfo.ts)
  - [src/sanity/utils/getSocials.ts](/Users/sushil/Projects/React/lift-v1/src/sanity/utils/getSocials.ts)
  - [src/sanity/utils/getAboutUs.ts](/Users/sushil/Projects/React/lift-v1/src/sanity/utils/getAboutUs.ts)
  - [src/sanity/utils/getServices.ts](/Users/sushil/Projects/React/lift-v1/src/sanity/utils/getServices.ts)
  - [src/sanity/utils/getCertificates.ts](/Users/sushil/Projects/React/lift-v1/src/sanity/utils/getCertificates.ts)
  - [src/sanity/utils/getTestimonials.ts](/Users/sushil/Projects/React/lift-v1/src/sanity/utils/getTestimonials.ts)
  - [src/sanity/utils/getClients.ts](/Users/sushil/Projects/React/lift-v1/src/sanity/utils/getClients.ts)
- Current behavior:
  - Several utilities call `client.fetch()` without explicit `next: { revalidate }` or `tags`.
  - Cache lifetime is therefore inherited or implicit rather than intentionally defined.
- Why this matters:
  - The app’s caching policy becomes inconsistent and fragile.
  - Updates may appear stale or update at unexpected times.
- Exact fix:
  - Add explicit `next: { revalidate, tags }` to shared Sanity utilities.
  - Prefer tag-based invalidation from Sanity webhooks for editorial updates.
- Estimated impact: Medium

### 5. Static param routes are not locked down
- Files:
  - [src/app/(main)/blogs/[slug]/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/blogs/[slug]/page.tsx)
  - [src/app/(main)/services/[slug]/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/services/[slug]/page.tsx)
  - [src/app/(main)/products/[slug]/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/products/[slug]/page.tsx)
  - [src/app/(main)/products/[slug]/[city]/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/products/[slug]/[city]/page.tsx)
  - [src/app/(main)/branches/[slug]/page.tsx](/Users/sushil/Projects/React/lift-v1/src/app/(main)/branches/[slug]/page.tsx)
- Current behavior:
  - These routes use `generateStaticParams()`.
  - None of them set `dynamicParams = false`.
- Why this matters:
  - Unknown future slugs still rely on on-demand behavior.
  - Production behavior for newly added CMS entries stays less predictable than necessary.
- Exact fix:
  - Set `dynamicParams = false` where only known params should exist, or
  - Keep on-demand generation intentionally and document that choice.
- Estimated impact: Medium

### 6. Large icon mapping is increasing client bundle cost
- Files:
  - [src/sanity/utils/iconMapper.ts](/Users/sushil/Projects/React/lift-v1/src/sanity/utils/iconMapper.ts)
  - [src/components/homepage/Hero.tsx](/Users/sushil/Projects/React/lift-v1/src/components/homepage/Hero.tsx)
- Current behavior:
  - A broad `react-icons` surface is imported into a shared icon mapper.
  - Client components consume that mapper.
- Why this matters:
  - More icon code can end up in the client bundle than any individual screen actually needs.
- Exact fix:
  - Split icon mapping by usage domain, or
  - Resolve icon names server-side and pass only the chosen icon identity into smaller client code paths.
- Estimated impact: Medium

## Low Hanging Fruits

### 1. Hero LCP image is missing `sizes`
- File: [src/components/homepage/Hero.tsx](/Users/sushil/Projects/React/lift-v1/src/components/homepage/Hero.tsx)
- Current behavior:
  - The main hero image uses `fill` and `priority` but no `sizes`.
- Expected/correct behavior:
  - Above-the-fold images should declare realistic viewport sizing.
- One-line fix:
  - Add a `sizes` prop matching the hero’s actual rendered width.
- Estimated impact: Medium

### 2. Some responsive `next/image` usage is missing `sizes`
- Files:
  - [src/components/media/MediaPreview.tsx](/Users/sushil/Projects/React/lift-v1/src/components/media/MediaPreview.tsx)
  - [src/components/aboutus/CertificatesSection.tsx](/Users/sushil/Projects/React/lift-v1/src/components/aboutus/CertificatesSection.tsx)
- Current behavior:
  - `fill` images in the modal and certificate grid do not specify `sizes`.
- Expected/correct behavior:
  - Responsive images should describe their slot width so Next can pick the right source.
- One-line fix:
  - Add `sizes` to both components.
- Estimated impact: Low

### 3. Portable Text images could be more responsive
- File: [src/components/blog/PortableTextRenderer.tsx](/Users/sushil/Projects/React/lift-v1/src/components/blog/PortableTextRenderer.tsx)
- Current behavior:
  - Blog body images render at a fixed nominal size with no `sizes`.
- Expected/correct behavior:
  - Content images should adapt to actual article width and viewport size.
- One-line fix:
  - Add `sizes` and use width-targeted Sanity URLs.
- Estimated impact: Low

### 4. Client-side media components are building Sanity URLs in the browser
- Files:
  - [src/components/media/MediaCard.tsx](/Users/sushil/Projects/React/lift-v1/src/components/media/MediaCard.tsx)
  - [src/components/media/MediaPreview.tsx](/Users/sushil/Projects/React/lift-v1/src/components/media/MediaPreview.tsx)
- Current behavior:
  - `@sanity/image-url` and the Sanity client are imported in client components just to construct image URLs.
- Expected/correct behavior:
  - These URLs should be computed on the server or passed as serialized strings.
- One-line fix:
  - Precompute media URLs in GROQ or a server utility before passing them to the client.
- Estimated impact: Low

## Configuration Risks

### 1. Sanity client uses CDN reads while the app depends heavily on ISR
- File: [src/sanity/lib/client.ts](/Users/sushil/Projects/React/lift-v1/src/sanity/lib/client.ts)
- Current behavior:
  - Frontend Sanity reads use `useCdn: true`.
- Why this is a risk:
  - You are stacking Sanity CDN freshness and Next ISR freshness.
  - Editorial updates can be delayed by multiple cache layers unless invalidation is carefully managed.
- Exact fix:
  - Either switch server-rendered ISR reads to `useCdn: false`, or
  - Keep `true` and standardize on explicit tags plus webhook-based revalidation.
- Estimated impact: Medium

### 2. Experimental view transitions are enabled
- Files:
  - [next.config.ts](/Users/sushil/Projects/React/lift-v1/next.config.ts)
  - [src/hooks/useViewTransition.ts](/Users/sushil/Projects/React/lift-v1/src/hooks/useViewTransition.ts)
- Current behavior:
  - `experimental.viewTransition` is enabled globally.
  - That feature is helping justify large client boundaries on content pages.
- Why this is a risk:
  - Experimental features can regress performance and complicate hydration strategy.
- Exact fix:
  - Remove the flag unless measured gains justify the cost, or
  - Restrict view transition usage to small, isolated client islands.
- Estimated impact: Medium

### 3. `compress` is not explicitly disabled for Vercel
- File: [next.config.ts](/Users/sushil/Projects/React/lift-v1/next.config.ts)
- Current behavior:
  - `compress` is omitted.
- Why this is a risk:
  - Vercel already handles compression at the edge.
  - Keeping framework compression enabled is unnecessary.
- Exact fix:
  - Add `compress: false`.
- Estimated impact: Low

### 4. API routes are Node serverless functions without region or duration controls
- Files:
  - [src/app/api/contact/route.ts](/Users/sushil/Projects/React/lift-v1/src/app/api/contact/route.ts)
  - [src/app/api/catalog/route.ts](/Users/sushil/Projects/React/lift-v1/src/app/api/catalog/route.ts)
  - [src/app/api/private-experience/route.ts](/Users/sushil/Projects/React/lift-v1/src/app/api/private-experience/route.ts)
- Current behavior:
  - They import `nodemailer`, so they are Node handlers.
  - No `preferredRegion` or `maxDuration` is declared.
- Why this is a risk:
  - Cold starts and SMTP latency are more expensive when the function region is not chosen deliberately.
  - Timeouts are harder to reason about under production load.
- Exact fix:
  - Add `preferredRegion` close to the main audience.
  - Set `maxDuration` intentionally based on SMTP and Google Sheets latency.
- Estimated impact: Medium

### 5. Root sitemap freshness does not reflect real content freshness
- Files:
  - [src/app/sitemap.ts](/Users/sushil/Projects/React/lift-v1/src/app/sitemap.ts)
  - [src/app/(main)/blogs/sitemap.ts](/Users/sushil/Projects/React/lift-v1/src/app/(main)/blogs/sitemap.ts)
  - [src/app/(main)/products/sitemap.ts](/Users/sushil/Projects/React/lift-v1/src/app/(main)/products/sitemap.ts)
  - [src/app/(main)/services/sitemap.ts](/Users/sushil/Projects/React/lift-v1/src/app/(main)/services/sitemap.ts)
  - [src/app/(main)/media/sitemap.ts](/Users/sushil/Projects/React/lift-v1/src/app/(main)/media/sitemap.ts)
- Current behavior:
  - Some sitemap entries stamp `lastModified` with build-time `new Date()`.
  - Others regenerate hourly and still use synthetic timestamps.
- Why this is a risk:
  - Search engines receive freshness hints that do not reflect actual content updates.
- Exact fix:
  - Use real document timestamps from Sanity for sitemap entries.
- Estimated impact: Low

## Notes

- No direct client-side Sanity `client.fetch()` usage was found in app UI components.
- No `next/dynamic(..., { ssr: false })` misuse was found.
- No major `headers()`, `cookies()`, or `draftMode()` driven SSR fallbacks were found outside the `/blogs` query-param issue.
- No PPR setup was found in route segments or `next.config.ts`.

## Recommended Next Order

1. Keep the popup 60-second regression fix already applied.
2. Decide whether `/blogs` should be true SSG/ISR or intentional SSR.
3. Deduplicate repeated Sanity fetches with `cache()`.
4. Break large detail pages back into server-rendered shells plus small client islands.
5. Normalize shared Sanity utility cache policy with explicit `revalidate` and tags.

import type { QueryParams } from "next-sanity";
import { client } from "~/sanity/lib/client";

export const SANITY_REVALIDATE_SECONDS = 604800;

export const SANITY_CACHE_TAGS = {
  about: "sanity:about",
  blogs: "sanity:blogs",
  blogSitemap: "sanity:sitemap:blogs",
  branches: "sanity:branches",
  certificates: "sanity:certificates",
  companyInfo: "sanity:company-info",
  contactInfo: "sanity:contact-info",
  footerLinks: "sanity:footer-links",
  forms: "sanity:forms",
  home: "sanity:home",
  homeSeo: "sanity:home-seo",
  homeSettings: "sanity:home-settings",
  media: "sanity:media",
  mediaSitemap: "sanity:sitemap:media",
  popups: "sanity:popups",
  productRanges: "sanity:product-ranges",
  products: "sanity:products",
  productSitemap: "sanity:sitemap:products",
  services: "sanity:services",
  serviceSitemap: "sanity:sitemap:services",
  socials: "sanity:socials",
} as const;

function dynamicTag(kind: string, value: string): string {
  return `sanity:${kind}:${encodeURIComponent(value).slice(0, 180)}`;
}

export const SANITY_DETAIL_TAGS = {
  branch: (slug: string) => dynamicTag("branch", slug),
  post: (slug: string) => dynamicTag("post", slug),
  product: (slug: string) => dynamicTag("product", slug),
  productLocation: (productSlug: string, citySlug: string) =>
    dynamicTag("product-location", `${productSlug}/${citySlug}`),
  service: (slug: string) => dynamicTag("service", slug),
} as const;

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;
  tags: readonly string[];
  revalidate?: number;
};

export async function sanityFetch<Result>({
  query,
  params = {},
  tags,
  revalidate = SANITY_REVALIDATE_SECONDS,
}: SanityFetchOptions): Promise<Result> {
  return client.fetch<Result>(query, params, {
    next: {
      revalidate,
      tags: [...new Set(tags)],
    },
  });
}

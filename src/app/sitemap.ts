import { groq } from "next-sanity";
import type { MetadataRoute } from "next";
import { client } from "~/sanity/lib/client";
import { sanityFetchOptions } from "~/sanity/lib/fetchOptions";

type RouteFreshness = {
  home?: string;
  aboutus?: string;
  services?: string;
  products?: string;
  blogs?: string;
  media?: string;
};

const routeFreshnessQuery = groq`{
  "home": *[_type in ["homePageSeo", "homePageSettings", "companyInfo", "contactInfo", "social", "client", "testimonial", "performance", "service", "productRange", "faq"]] | order(_updatedAt desc)[0]._updatedAt,
  "aboutus": *[_type in ["companyInfo", "timeline", "teamMember", "whyChooseUs", "visionMissionValues", "certificate"]] | order(_updatedAt desc)[0]._updatedAt,
  "services": *[_type == "service"] | order(_updatedAt desc)[0]._updatedAt,
  "products": *[_type in ["product", "productRange"]] | order(_updatedAt desc)[0]._updatedAt,
  "blogs": *[_type == "post"] | order(_updatedAt desc)[0]._updatedAt,
  "media": *[_type == "media"] | order(_updatedAt desc)[0]._updatedAt
}`;

const getLastModified = (value?: string): Date => {
  return value ? new Date(value) : new Date();
};

export const runtime = "nodejs";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const freshness = await client.fetch<RouteFreshness>(
    routeFreshnessQuery,
    {},
    sanityFetchOptions,
  );

  return [
    {
      url: `${siteUrl}/`,
      lastModified: getLastModified(freshness.home),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/aboutus`,
      lastModified: getLastModified(freshness.aboutus),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: getLastModified(freshness.services),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: getLastModified(freshness.products),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blogs`,
      lastModified: getLastModified(freshness.blogs),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/media`,
      lastModified: getLastModified(freshness.media),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}

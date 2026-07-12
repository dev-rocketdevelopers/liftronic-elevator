import type { MetadataRoute } from "next";
import { client } from "~/sanity/lib/client";
import { groq } from "next-sanity";
import { getSiteUrl } from "~/lib/site-url";

type ServiceSitemap = {
  slug: string;
  _updatedAt: string;
  sitemapPriority?: number;
  changeFrequency?: "daily" | "weekly" | "monthly" | "yearly";
};

async function getServicesForSitemap(): Promise<ServiceSitemap[]> {
  return client.fetch(
    groq`*[_type == "service" && defined(slug.current)] | order(_updatedAt desc) {
      "slug": slug.current,
      _updatedAt,
      sitemapPriority,
      changeFrequency
    }`,
    {},
    { next: { revalidate: 86400 } },
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const services = await getServicesForSitemap();

  const serviceUrls: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified: service._updatedAt,
    changeFrequency:
      (service.changeFrequency as "daily" | "weekly" | "monthly" | "yearly") ||
      "monthly",
    priority: service.sitemapPriority || 0.8,
  }));

  // Add services list page
  const serviceListPage: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/services`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
  ];

  return [...serviceListPage, ...serviceUrls];
}

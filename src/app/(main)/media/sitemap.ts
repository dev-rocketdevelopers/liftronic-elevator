import type { MetadataRoute } from "next";
import { client } from "~/sanity/lib/client";
import { groq } from "next-sanity";
import { getSiteUrl } from "~/lib/site-url";

type MediaSitemap = {
  slug: string;
  publishedAt: string;
  _updatedAt: string;
};

async function getMediaForSitemap(): Promise<MediaSitemap[]> {
  return client.fetch(
    groq`*[_type == "media" && defined(publishedAt)] | order(publishedAt desc) {
      "slug": _id,
      publishedAt,
      _updatedAt
    }`,
    {},
    { next: { revalidate: 86400 } }, // Revalidate daily
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const mediaItems = await getMediaForSitemap();

  const mediaUrls: MetadataRoute.Sitemap = mediaItems.map((item) => ({
    url: `${siteUrl}/media#${item.slug}`,
    lastModified: item._updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // Add media list page
  const mediaListPage: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/media`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  return [...mediaListPage, ...mediaUrls];
}

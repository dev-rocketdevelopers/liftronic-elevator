import type { MetadataRoute } from "next";
import { client } from "~/sanity/lib/client";
import { groq } from "next-sanity";
import { getSiteUrl } from "~/lib/site-url";

type BlogPostSitemap = {
  slug: string;
  publishedAt: string;
  _updatedAt: string;
};

async function getBlogPostsForSitemap(): Promise<BlogPostSitemap[]> {
  return client.fetch(
    groq`*[_type == "post" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) {
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }`,
    {},
    { next: { revalidate: 86400 } }, // Revalidate daily
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const posts = await getBlogPostsForSitemap();

  const blogPostUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blogs/${post.slug}`,
    lastModified: post._updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Add blog list page
  const blogListPage: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/blogs`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  return [...blogListPage, ...blogPostUrls];
}

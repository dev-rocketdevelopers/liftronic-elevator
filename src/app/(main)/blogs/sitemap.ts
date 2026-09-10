import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { getSiteUrl } from "~/lib/site-url";
import { sanityFetch, SANITY_CACHE_TAGS } from "~/sanity/lib/cache";

type BlogPostSitemap = {
  slug: string;
  publishedAt: string;
  _updatedAt: string;
};

async function getBlogPostsForSitemap(): Promise<BlogPostSitemap[]> {
  return sanityFetch<BlogPostSitemap[]>({
    query: groq`*[_type == "post" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc) {
      "slug": slug.current,
      publishedAt,
      _updatedAt
    }`,
    tags: [SANITY_CACHE_TAGS.blogSitemap],
  });
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

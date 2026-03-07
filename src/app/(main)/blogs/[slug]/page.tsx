import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostContent from "~/components/blog/BlogPostContent";
import { client } from "~/sanity/lib/client";
import { sanityFetchOptions } from "~/sanity/lib/fetchOptions";
import { postBySlugQuery, postSlugsQuery } from "~/sanity/lib/queries";
import type { BlogPostFull } from "~/sanity/lib/blogTypes";

const getPostBySlug = cache(async (slug: string): Promise<BlogPostFull | null> => {
  return client.fetch(
    postBySlugQuery,
    { slug },
    sanityFetchOptions,
  );
});

const getAllPostSlugs = cache(async (): Promise<string[]> => {
  return client.fetch(postSlugsQuery, {}, sanityFetchOptions);
});

// Legacy blog post data - kept for reference, can be removed after content migration
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const authorName = post.author?.name || "Liftronic Team";
  const authorSlug = post.author?.slug || "liftronic";
  const imageUrl = post.mainImage || `${siteUrl}/assets/service_banner.png`;
  const imageAlt = post.imageAlt || `${post.title} cover image`;
  const tag = post.tag || "Insights";

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords?.join(", "),
    authors: [{ name: authorName }],
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
          width: 1200,
          height: 800,
        },
      ],
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt || post.publishedAt,
      authors: [authorName],
      section: tag,
      tags: post.seoKeywords || [],
      url: `${siteUrl}/blogs/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: [imageUrl],
      creator: `@${authorSlug}`,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const authorName = post.author?.name || "Liftronic Team";
  const authorSlug = post.author?.slug || "liftronic";
  const imageUrl = post.mainImage || `${siteUrl}/assets/service_banner.png`;
  const imageAlt = post.imageAlt || `${post.title} cover image`;
  const tag = post.tag || "Insights";
  const getBlockText = (block: BlogPostFull["body"][number]) => {
    if (!("children" in block) || !Array.isArray(block.children)) {
      return "";
    }

    return block.children
      .map((child) => ("text" in child ? child.text || "" : ""))
      .join(" ");
  };

  // Calculate word count for reading time
  const wordCount = post.body
    .filter((block) => block._type === "block")
    .map(getBlockText)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  // Article JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 800,
      caption: imageAlt,
    },
    author: {
      "@type": "Person",
      name: authorName,
      url: `${siteUrl}/blogs?author=${authorSlug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Lift Solutions",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    articleSection: tag,
    keywords: post.seoKeywords?.join(", "),
    wordCount,
    url: `${siteUrl}/blogs/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blogs/${slug}`,
    },
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteUrl}/blogs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${siteUrl}/blogs/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogPostContent post={post} />
    </>
  );
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export const revalidate = 3600; // 60 minutes
export const dynamicParams = false;

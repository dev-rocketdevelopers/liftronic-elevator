import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPageClient from "./ProductPageClient";
import { productBySlugQuery, productSlugsQuery } from "~/sanity/lib/queries";
import {
  sanityFetch,
  SANITY_CACHE_TAGS,
  SANITY_DETAIL_TAGS,
} from "~/sanity/lib/cache";
import type { ProductFull } from "~/sanity/lib/productTypes";
import { getSiteUrl } from "~/lib/site-url";

async function getProductBySlug(slug: string): Promise<ProductFull | null> {
  return sanityFetch<ProductFull | null>({
    query: productBySlugQuery,
    params: { slug },
    tags: [SANITY_DETAIL_TAGS.product(slug)],
  });
}

async function getAllProductSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({
    query: productSlugsQuery,
    tags: [SANITY_CACHE_TAGS.products],
  });
}

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const siteUrl = getSiteUrl();

  return {
    title: product.seoTitle || `${product.title} | Lift Solutions`,
    description: product.seoDescription || product.description,
    keywords: product.seoKeywords?.join(", "),
    alternates: {
      canonical: `/products/${slug}`,
    },
    openGraph: {
      title: product.seoTitle || product.title,
      description: product.seoDescription || product.description,
      images: product.mainImage
        ? [
            {
              url: product.mainImage,
              alt: product.imageAlt || product.title,
              width: 1200,
              height: 800,
            },
          ]
        : [],
      type: "website",
      url: `${siteUrl}/products/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product.seoTitle || product.title,
      description: product.seoDescription || product.description,
      images: product.mainImage ? [product.mainImage] : [],
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

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const siteUrl = getSiteUrl();

  // Product JSON-LD
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.mainImage
      ? {
          "@type": "ImageObject",
          url: product.mainImage,
          width: 1200,
          height: 800,
          caption: product.imageAlt || product.title,
        }
      : undefined,
    brand: {
      "@type": "Organization",
      name: "Lift Solutions",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "INR",
      url: `${siteUrl}/products/${slug}`,
    },
    url: `${siteUrl}/products/${slug}`,
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
        name: "Products",
        item: `${siteUrl}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `${siteUrl}/products/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}

// Generate static paths for all products
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export const revalidate = 604800;

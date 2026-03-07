import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "~/sanity/lib/client";
import { groq } from "next-sanity";
import ProductDetailContent, {
  type LocationPageData,
} from "~/components/products/ProductDetailContent";
import { sanityFetchOptions } from "~/sanity/lib/fetchOptions";
import type { ProductFull } from "~/sanity/lib/productTypes";

interface ProductWithLocation extends ProductFull {
  locationPage: LocationPageData;
}

const getProductWithLocation = cache(
  async (
    productSlug: string,
    citySlug: string,
  ): Promise<ProductWithLocation | null> => {
  const query = groq`*[_type == "product" && slug.current == $productSlug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    subtitle,
    description,
    "tags": tags[]->{
      _id,
      title,
      "slug": slug.current
    },
    "keyFeatures": keyFeatures[0...6]->{
      _id,
      title,
      description,
      icon
    },
    specifications,
    "faqs": faqs[]->{
      _id,
      question,
      answer
    },
    "mainImage": mainImage.asset->url + "?w=1200&h=800&fit=crop&auto=format&fm=webp&q=90",
    "imageAlt": mainImage.alt,
    "gallery": gallery[]{
      _key,
      "url": asset->url + "?w=1200&h=900&fit=crop&auto=format&fm=webp&q=85",
      "lqip": asset->metadata.lqip,
      "alt": alt
    },
    "seoTitle": seo.metaTitle,
    "seoDescription": seo.metaDescription,
    "seoKeywords": seo.keywords,
    "locationPage": locationPages[@.citySlug.current == $citySlug][0] {
      city,
      "citySlug": citySlug.current,
      uniqueContent,
      metaTitle,
      metaDescription,
      keywords,
      published,
      enableIndexing
    }
  }`;

  const product = await client.fetch(
    query,
    { productSlug, citySlug },
      sanityFetchOptions,
  );

  if (!product || !product.locationPage || !product.locationPage.published) {
    return null;
  }

  return product;
  },
);

const getAllLocationProductParams = cache(async () => {
  const query = groq`*[_type == "product" && defined(locationPages)] {
    "productSlug": slug.current,
    "cities": locationPages[published == true] {
      "citySlug": citySlug.current
    }
  }`;

  const products = await client.fetch(
    query,
    {},
    sanityFetchOptions,
  );

  const params: { slug: string; city: string }[] = [];

  for (const product of products) {
    for (const city of product.cities || []) {
      if (city.citySlug) {
        params.push({
          slug: product.productSlug,
          city: city.citySlug,
        });
      }
    }
  }

  return params;
});

type Props = {
  params: Promise<{
    slug: string;
    city: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, city } = await params;
  const product = await getProductWithLocation(slug, city);

  if (!product || !product.locationPage) {
    return {
      title: "Product Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const locationPage = product.locationPage;

  return {
    title: locationPage.metaTitle || `${product.title} | ${locationPage.city}`,
    description: locationPage.metaDescription || product.description,
    keywords: locationPage.keywords?.join(", "),
    alternates: {
      canonical: locationPage.enableIndexing
        ? `/products/${slug}/${city}`
        : `/products/${slug}`,
    },
    openGraph: {
      title:
        locationPage.metaTitle || `${product.title} | ${locationPage.city}`,
      description: locationPage.metaDescription || product.description,
      images: product.mainImage
        ? [
            {
              url: product.mainImage,
              alt: `${product.title} in ${locationPage.city}`,
              width: 1200,
              height: 800,
            },
          ]
        : [],
      type: "website",
      url: `${siteUrl}/products/${slug}/${city}`,
    },
    twitter: {
      card: "summary_large_image",
      title:
        locationPage.metaTitle || `${product.title} | ${locationPage.city}`,
      description: locationPage.metaDescription || product.description,
      images: product.mainImage ? [product.mainImage] : [],
    },
    robots: {
      index: locationPage.enableIndexing,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export default async function LocationProductPage({ params }: Props) {
  const { slug, city } = await params;
  const product = await getProductWithLocation(slug, city);

  if (!product || !product.locationPage) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const locationPage = product.locationPage;

  // Product JSON-LD with location
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.title} - ${locationPage.city}`,
    description: locationPage.metaDescription || product.description,
    image: product.mainImage
      ? {
          "@type": "ImageObject",
          url: product.mainImage,
          width: 1200,
          height: 800,
          caption: `${product.title} in ${locationPage.city}`,
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
      url: `${siteUrl}/products/${slug}/${city}`,
      areaServed: {
        "@type": "City",
        name: locationPage.city,
      },
    },
    url: `${siteUrl}/products/${slug}/${city}`,
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
      {
        "@type": "ListItem",
        position: 4,
        name: locationPage.city,
        item: `${siteUrl}/products/${slug}/${city}`,
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

      <main>
        {/* Main Product Page with location content after FAQ */}
        <ProductDetailContent product={product} locationPage={locationPage} />
      </main>
    </>
  );
}

// Generate static paths for all published location products
export async function generateStaticParams() {
  return await getAllLocationProductParams();
}

export const revalidate = 3600; // 60 minutes
export const dynamicParams = false;

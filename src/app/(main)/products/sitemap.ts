import type { MetadataRoute } from "next";
import { client } from "~/sanity/lib/client";
import { groq } from "next-sanity";
import { getSiteUrl } from "~/lib/site-url";

type ProductSitemap = {
  productSlug: string;
  _updatedAt?: string;
  mainImage?: string;
  gallery?: string[];
  locationPages?: {
    citySlug: string;
    published: boolean;
    enableIndexing: boolean;
  }[];
};

async function getProductsForSitemap(): Promise<ProductSitemap[]> {
  return client.fetch(
    groq`*[_type == "product" && defined(slug.current)] | order(_updatedAt desc) {
      "productSlug": slug.current,
      _updatedAt,
      "mainImage": mainImage.asset->url,
      "gallery": gallery[].asset->url,
      "locationPages": locationPages[]{
        "citySlug": citySlug.current,
        published,
        enableIndexing
      }
    }`,
    {},
    { next: { revalidate: 86400 } },
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const products = await getProductsForSitemap();

  const urls: MetadataRoute.Sitemap = [];

  // Add products list page
  urls.push({
    url: `${siteUrl}/products`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  });

  // Add each product and its location pages
  for (const product of products) {
    const images: string[] = [];
    if (product.mainImage) images.push(product.mainImage);
    if (product.gallery) images.push(...product.gallery);

    // Add product details page
    urls.push({
      url: `${siteUrl}/products/${product.productSlug}`,
      lastModified: product._updatedAt || new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: images.length > 0 ? images : undefined,
    });

    // Add location-specific pages (only if published and indexing enabled)
    for (const locationPage of product.locationPages || []) {
      if (locationPage.published && locationPage.enableIndexing) {
        urls.push({
          url: `${siteUrl}/products/${product.productSlug}/${locationPage.citySlug}`,
          lastModified: product._updatedAt || new Date().toISOString(),
          changeFrequency: "monthly" as const,
          priority: 0.7,
          images: images.length > 0 ? images : undefined,
        });
      }
    }
  }

  return urls;
}

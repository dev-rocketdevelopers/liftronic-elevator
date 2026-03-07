import { groq } from "next-sanity";
import { cache } from "react";
import { client } from "../lib/client";
import { sanityFetchOptions } from "../lib/fetchOptions";
import { ServiceOffered, ServiceOfferedFull } from "../lib/serviceTypes";

// Get all services for listing page with lazy loading support
export const getServices = cache(async (): Promise<ServiceOffered[]> => {
  const query = groq`*[_type == "service"] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    summary,
    "image": image.asset->url,
    "imageLqip": image.asset->metadata.lqip,
    "imageAlt": image.alt,
    tags,
    featured
  }`;

  return client.fetch<ServiceOffered[]>(query, {}, sanityFetchOptions);
});

// Get featured services only
export const getFeaturedServices = cache(async (): Promise<ServiceOffered[]> => {
  const query = groq`*[_type == "service" && featured == true] | order(_createdAt desc) {
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    summary,
    "image": image.asset->url,
    "imageLqip": image.asset->metadata.lqip,
    "imageAlt": image.alt,
    tags,
    featured
  }`;

  return client.fetch<ServiceOffered[]>(query, {}, sanityFetchOptions);
});

// Get service by slug for detail page
export const getServiceBySlug = cache(
  async (slug: string): Promise<ServiceOfferedFull | null> => {
  const query = groq`*[_type == "service" && slug.current == $slug][0]{
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    summary,
    description,
    "image": image.asset->url,
    "imageAlt": image.alt,
    icon,
    tags,
    featured,
    features,
    specifications,
    "seoTitle": seo.metaTitle,
    "seoDescription": seo.metaDescription,
    "seoKeywords": seo.keywords,
    "faqs": faqs[]-> {
      question,
      answer
    },
    "relatedServices": *[_type == "service" && slug.current != $slug && featured == true][0...3]{
      _id,
      title,
      "slug": slug.current,
      summary,
      "image": image.asset->url,
      "imageLqip": image.asset->metadata.lqip,
      "imageAlt": image.alt,
      icon,
      tags,
      featured
    }
  }`;

    return client.fetch<ServiceOfferedFull | null>(
      query,
      { slug },
      sanityFetchOptions,
    );
  },
);

// Get services by tags with pagination support
export const getServicesByTag = cache(
  async (
    tag: string,
    limit = 10,
    offset = 0,
  ): Promise<ServiceOffered[]> => {
  const query = groq`*[_type == "service" && $tagName in tags] | order(_createdAt desc) [$offset...($offset + $limit)] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    summary,
    "image": image.asset->url,
    "imageLqip": image.asset->metadata.lqip,
    "imageAlt": image.alt,
    tags,
    featured
  }`;

    return client.fetch<ServiceOffered[]>(
      query,
      { tagName: tag, limit, offset },
      sanityFetchOptions,
    );
  },
);

// Generate static params for service pages
export const getServiceSlugs = cache(async (): Promise<string[]> => {
  const query = groq`*[_type == "service"]{"slug": slug.current}`;
  const services = await client.fetch<{ slug: string }[]>(
    query,
    {},
    sanityFetchOptions,
  );
  return services.map((service) => service.slug);
});

// Get services with pagination for lazy loading
export const getServicesPage = cache(
  async (limit = 6, offset = 0): Promise<ServiceOffered[]> => {
  const query = groq`*[_type == "service"] | order(_createdAt desc) [$offset...($offset + $limit)] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    "slug": slug.current,
    summary,
    "image": image.asset->url,
    "imageLqip": image.asset->metadata.lqip,
    "imageAlt": image.alt,
    tags,
    featured
  }`;

    return client.fetch<ServiceOffered[]>(
      query,
      { limit, offset },
      sanityFetchOptions,
    );
  },
);

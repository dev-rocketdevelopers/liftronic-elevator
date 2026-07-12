import { groq } from "next-sanity";
import { ServiceOffered, ServiceOfferedFull } from "../lib/serviceTypes";
import {
  sanityFetch,
  SANITY_CACHE_TAGS,
  SANITY_DETAIL_TAGS,
} from "../lib/cache";

// Get all services for listing page with lazy loading support
export async function getServices(): Promise<ServiceOffered[]> {
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

  return sanityFetch<ServiceOffered[]>({
    query,
    tags: [SANITY_CACHE_TAGS.services],
  });
}

// Get featured services only
export async function getFeaturedServices(): Promise<ServiceOffered[]> {
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

  return sanityFetch<ServiceOffered[]>({
    query,
    tags: [SANITY_CACHE_TAGS.services],
  });
}

// Get service by slug for detail page
export async function getServiceBySlug(
  slug: string,
): Promise<ServiceOfferedFull | null> {
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

  return sanityFetch<ServiceOfferedFull | null>({
    query,
    params: { slug },
    tags: [SANITY_CACHE_TAGS.services, SANITY_DETAIL_TAGS.service(slug)],
  });
}

// Get services by tags with pagination support
export async function getServicesByTag(
  tag: string,
  limit = 10,
  offset = 0,
): Promise<ServiceOffered[]> {
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

  return sanityFetch<ServiceOffered[]>({
    query,
    params: { tagName: tag, limit, offset },
    tags: [SANITY_CACHE_TAGS.services],
  });
}

// Generate static params for service pages
export async function getServiceSlugs(): Promise<string[]> {
  const query = groq`*[_type == "service"]{"slug": slug.current}`;
  const services = await sanityFetch<{ slug: string }[]>({
    query,
    tags: [SANITY_CACHE_TAGS.services],
  });
  return services.map((service) => service.slug);
}

// Get services with pagination for lazy loading
export async function getServicesPage(
  limit = 6,
  offset = 0,
): Promise<ServiceOffered[]> {
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

  return sanityFetch<ServiceOffered[]>({
    query,
    params: { limit, offset },
    tags: [SANITY_CACHE_TAGS.services],
  });
}

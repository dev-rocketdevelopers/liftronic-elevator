import { groq } from "next-sanity";
import { client } from "../lib/client";
import type { ProductRange } from "../lib/productRangeTypes";
import type { ServiceOffered } from "../lib/serviceTypes";
import type { ContactInfo } from "../../../typings";

/**
 * Navbar data structure optimized for mega menu display
 */
export type NavbarData = {
  productRanges: ProductRange[];
  services: ServiceOffered[];
  contactInfo: ContactInfo | null;
};

/**
 * Optimized query for navbar mega menu data
 * Fetches product ranges with nested products and all services
 */
const navbarDataQuery = groq`{
  "productRanges": *[_type == "productRange"] | order(featured desc, order asc, title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "image": image.asset->url + "?w=600&h=400&fit=crop&auto=format&fm=webp&q=80",
    "imageLqip": image.asset->metadata.lqip,
    "imageAlt": image.alt,
    featured,
    order,
    "productCount": count(products),
    "products": products[]->{
      _id,
      title,
      "slug": slug.current,
      subtitle,
      "mainImage": mainImage.asset->url + "?w=400&h=300&fit=crop&auto=format&fm=webp&q=80",
      "mainImageLqip": mainImage.asset->metadata.lqip,
      "imageAlt": mainImage.alt,
      featured
    }
  },
  "services": *[_type == "service"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    "image": image.asset->url + "?w=400&h=300&fit=crop&auto=format&fm=webp&q=80",
    "imageLqip": image.asset->metadata.lqip,
    "imageAlt": image.alt,
    featured
  }[0...12],
  "contactInfo": *[_type == "contactInfo"][0]{
    _id,
    supportPhone,
    supportPhoneLabel,
    email,
    emailLabel,
    salesPhone,
    salesPhoneLabel,
    serviceArea
  }
}`;

/**
 * Fetches navbar data for mega menu display
 * @returns Promise<NavbarData> Navbar data with product ranges and services
 */
export async function getNavbarData(): Promise<NavbarData> {
  return client.fetch<NavbarData>(
    navbarDataQuery,
    {},
    { next: { revalidate: 3600 } } // Revalidate every hour
  );
}

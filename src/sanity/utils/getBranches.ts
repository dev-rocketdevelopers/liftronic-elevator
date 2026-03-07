import { cache } from "react";
import { client } from "../lib/client";
import { sanityFetchOptions } from "../lib/fetchOptions";
import type { Branch } from "../lib/branchTypes";

const branchQuery = `*[_type == "branch" && isActive == true] | order(order asc) {
  _id,
  name,
  "slug": slug.current,
  city,
  address,
  phone,
  email,
  mapUrl,
  description,
  isActive,
  order
}`;

const singleBranchQuery = `*[_type == "branch" && slug.current == $slug && isActive == true][0] {
  _id,
  name,
  "slug": slug.current,
  city,
  address,
  phone,
  email,
  mapUrl,
  description,
  heroTitle,
  tagline,
  legacySection {
    title,
    body
  },
  whyChooseReasons[] {
    title,
    description
  },
  stiltzExperience {
    intro,
    experiences[] {
      title,
      description
    }
  },
  bookingSection {
    description,
    conciergePhone,
    visitAddress,
    gpsLink
  },
  privateExperienceFormConfig {
    formGoogleSheetUrl,
    formRecipientEmails
  },
  specializedEngineering[] {
    title,
    subtitle,
    description,
    features[] {
      title,
      description
    }
  },
  quoteEmail,
  closingQuote,
  contactPerson {
    name,
    position,
    photo {
      asset -> { url, metadata { dimensions } },
      alt,
      hotspot
    },
    email,
    phone
  },
  teamMembers[] {
    name,
    position,
    bio,
    image {
      asset -> { url, metadata { dimensions } },
      alt,
      hotspot
    },
    email,
    phone
  },
  mediaGallery[] {
    title,
    description,
    type,
    image {
      asset -> { url, metadata { dimensions } },
      alt,
      hotspot
    },
    youtubeUrl
  },
  "stiltzProducts": stiltzProducts[] -> {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    description,
    "mainImage": mainImage.asset->url + "?w=1200&h=900&fit=crop&auto=format&fm=webp&q=85",
    "mainImageLqip": mainImage.asset->metadata.lqip,
    "imageAlt": mainImage.alt
  },
  sectionVisibility {
    legacy,
    stiltzExperience,
    whyChoose,
    specializedEngineering,
    consultant,
    stiltzProducts,
    team,
    media
  },
  isActive,
  order
}`;

export const getBranches = cache(async (): Promise<Branch[]> => {
  return client.fetch<Branch[]>(branchQuery, {}, sanityFetchOptions);
});

export const getBranchBySlug = cache(
  async (slug: string): Promise<Branch | null> => {
    return client.fetch<Branch | null>(
      singleBranchQuery,
      { slug },
      sanityFetchOptions,
    );
  },
);

import { groq } from "next-sanity";
import { cache } from "react";
import { client } from "~/sanity/lib/client";
import { sanityFetchOptions } from "~/sanity/lib/fetchOptions";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export type HomePageSeoData = {
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  ogImage?: {
    asset: {
      _ref: string;
      _type: string;
    };
    alt: string;
  };
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  structuredData?: {
    organizationName?: string;
    organizationDescription?: string;
    faqEnabled?: boolean;
  };
};

const homePageSeoQuery = groq`*[_type == "homePageSeo"][0] {
  metaTitle,
  metaDescription,
  keywords,
  ogImage {
    asset,
    alt
  },
  canonicalUrl,
  robotsIndex,
  robotsFollow,
  structuredData {
    organizationName,
    organizationDescription,
    faqEnabled
  }
}`;

export const getHomePageSeo = cache(async (): Promise<HomePageSeoData | null> => {
  return client.fetch(homePageSeoQuery, {}, sanityFetchOptions);
});

export function getOgImageUrl(ogImage: HomePageSeoData["ogImage"]): string | null {
  if (!ogImage?.asset) return null;
  return urlFor(ogImage).width(1200).height(630).url();
}

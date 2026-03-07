import { cache } from "react";
import { client } from "../lib/client";
import { sanityFetchOptions } from "../lib/fetchOptions";
import { homePageSettingsQuery } from "../lib/queries";
import type { FAQ } from "../lib/homePageTypes";
import type { PortableTextBlock } from "@portabletext/types";

export interface SEOContentSection {
  title: string;
  content: PortableTextBlock[];
  keywords?: string[];
  order: number;
  defaultExpanded: boolean;
}

export interface HomePageSettings {
  featuredFaqs: FAQ[];
  showFaqSection: boolean;
  seoContentSections: SEOContentSection[];
  showSeoContentSection: boolean;
  productOptions?: string[];
}

export const getHomePageSettings = cache(
  async (): Promise<HomePageSettings> => {
  const settings = await client.fetch(
    homePageSettingsQuery,
    {},
      sanityFetchOptions,
  );

  // Default values
  const defaults: HomePageSettings = {
    featuredFaqs: [],
    showFaqSection: true,
    seoContentSections: [],
    showSeoContentSection: true,
    productOptions: [
      "Passenger Elevator",
      "Freight Elevator",
      "Home Elevator",
      "Hospital Elevator",
      "Capsule Elevator",
      "Escalator",
      "Moving Walkway",
      "Other",
    ],
  };

  // Provide defaults if no settings document exists or if fields are missing
  if (!settings) {
    return defaults;
  }

  return {
    featuredFaqs: settings.featuredFaqs || defaults.featuredFaqs,
    showFaqSection: settings.showFaqSection ?? defaults.showFaqSection,
    seoContentSections: settings.seoContentSections || defaults.seoContentSections,
    showSeoContentSection: settings.showSeoContentSection ?? defaults.showSeoContentSection,
    productOptions: settings.productOptions || defaults.productOptions,
  };
  },
);

import { client } from "../lib/client";
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

export async function getHomePageSettings(): Promise<HomePageSettings> {
  const settings = await client.fetch(
    homePageSettingsQuery,
    {},
    { next: { revalidate: 86400 } }, // Cache for 24 hours
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
    seoContentSections:
      settings.seoContentSections || defaults.seoContentSections,
    showSeoContentSection:
      settings.showSeoContentSection ?? defaults.showSeoContentSection,
    productOptions: settings.productOptions || defaults.productOptions,
  };
}

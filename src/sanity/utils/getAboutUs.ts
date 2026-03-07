import { groq } from "next-sanity";
import { cache } from "react";
import { client } from "~/sanity/lib/client";
import { sanityFetchOptions } from "~/sanity/lib/fetchOptions";
import type {
  CompanyInfo,
  Timeline,
  TeamMember,
  WhyChooseUs,
  VisionMissionValues,
} from "~/sanity/lib/aboutTypes";

// Get company information
export const getCompanyInfo = cache(async (): Promise<CompanyInfo | null> => {
  const query = groq`*[_type == "companyInfo"][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    establishedYear,
    tagline,
    aboutHeading,
    aboutDescription,
    whoWeAreTitle,
    whoWeAreContent,
    keyPoints,
    "heroImage": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    stats,
    homepageAboutTitle,
    homepageAboutSubtitle,
    homepageAboutDescription,
    homepageFeatures
  }`;

  return client.fetch<CompanyInfo | null>(query, {}, sanityFetchOptions);
});

// Get timeline milestones
export const getTimeline = cache(async (): Promise<Timeline[]> => {
  const query = groq`*[_type == "timeline"] | order(order asc) {
    _id,
    _createdAt,
    year,
    title,
    description,
    featured,
    order
  }`;

  return client.fetch<Timeline[]>(query, {}, sanityFetchOptions);
});

// Get featured timeline milestones only
export const getFeaturedTimeline = cache(
  async (limit = 3): Promise<Timeline[]> => {
  const query = groq`*[_type == "timeline" && featured == true] | order(order asc) [0...${limit}] {
    _id,
    _createdAt,
    year,
    title,
    description,
    featured,
    order
  }`;

    return client.fetch<Timeline[]>(query, {}, sanityFetchOptions);
  },
);

// Get team members
export const getTeamMembers = cache(async (): Promise<TeamMember[]> => {
  const query = groq`*[_type == "teamMember" && featured == true] | order(order asc) {
    _id,
    _createdAt,
    name,
    position,
    bio,
    "image": image.asset->url,
    "imageLqip": image.asset->metadata.lqip,
    "imageAlt": image.alt,
    email,
    phone,
    linkedin,
    featured,
    order
  }`;

  return client.fetch<TeamMember[]>(query, {}, sanityFetchOptions);
});

// Get all team members (for a dedicated team page)
export const getAllTeamMembers = cache(async (): Promise<TeamMember[]> => {
  const query = groq`*[_type == "teamMember"] | order(order asc) {
    _id,
    _createdAt,
    name,
    position,
    bio,
    "image": image.asset->url,
    "imageLqip": image.asset->metadata.lqip,
    "imageAlt": image.alt,
    email,
    phone,
    linkedin,
    featured,
    order
  }`;

  return client.fetch<TeamMember[]>(query, {}, sanityFetchOptions);
});

// Get why choose us points
export const getWhyChooseUs = cache(async (): Promise<WhyChooseUs[]> => {
  const query = groq`*[_type == "whyChooseUs" && active == true] | order(order asc) {
    _id,
    _createdAt,
    title,
    description,
    icon,
    features,
    order,
    active
  }`;

  return client.fetch<WhyChooseUs[]>(query, {}, sanityFetchOptions);
});

// Get vision, mission, and values
export const getVisionMissionValues = cache(
  async (): Promise<VisionMissionValues | null> => {
  const query = groq`*[_type == "visionMissionValues"][0] {
    _id,
    _createdAt,
    title,
    visionTitle,
    visionDescription,
    visionIcon,
    missionTitle,
    missionDescription,
    missionIcon,
    commitmentTitle,
    commitmentDescription,
    commitmentIcon,
    values
  }`;

    return client.fetch<VisionMissionValues | null>(
      query,
      {},
      sanityFetchOptions,
    );
  },
);

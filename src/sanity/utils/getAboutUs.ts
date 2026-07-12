import { groq } from "next-sanity";
import { cache } from "react";
import { client } from "~/sanity/lib/client";
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

  return client.fetch<CompanyInfo | null>(
    query,
    {},
    { next: { revalidate: 86400 } },
  );
});

// Get timeline milestones
export async function getTimeline(): Promise<Timeline[]> {
  const query = groq`*[_type == "timeline"] | order(order asc) {
    _id,
    _createdAt,
    year,
    title,
    description,
    featured,
    order
  }`;

  return client.fetch<Timeline[]>(query);
}

// Get featured timeline milestones only (all featured timelines, no limit)
export async function getFeaturedTimeline(): Promise<Timeline[]> {
  const query = groq`*[_type == "timeline" && featured == true] | order(order asc) {
    _id,
    _createdAt,
    year,
    title,
    description,
    featured,
    order
  }`;

  return client.fetch<Timeline[]>(query);
}

// Get team members
export async function getTeamMembers(): Promise<TeamMember[]> {
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

  return client.fetch<TeamMember[]>(query);
}

// Get all team members (for a dedicated team page)
export async function getAllTeamMembers(): Promise<TeamMember[]> {
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

  return client.fetch<TeamMember[]>(query);
}

// Get why choose us points
export async function getWhyChooseUs(): Promise<WhyChooseUs[]> {
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

  return client.fetch<WhyChooseUs[]>(query);
}

// Get vision, mission, and values
export async function getVisionMissionValues(): Promise<VisionMissionValues | null> {
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

  return client.fetch<VisionMissionValues | null>(query);
}

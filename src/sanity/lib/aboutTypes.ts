// About Us related types

export type CompanyInfo = {
  _id: string;
  title: string;
  establishedYear: string;
  tagline?: string;
  aboutHeading?: string;
  aboutDescription?: string;
  whoWeAreTitle?: string;
  whoWeAreContent?: unknown; // PortableText content
  keyPoints?: string[];
  heroImage?: string;
  heroImageAlt?: string;
  stats?: CompanyStat[];
  requestQuoteStats?: RequestQuoteStat[];
  // Homepage About Section
  homepageAboutTitle?: string;
  homepageAboutSubtitle?: string;
  homepageAboutDescription?: unknown; // PortableText block content
  homepageFeatures?: HomepageFeature[];
  _createdAt: string;
  _updatedAt?: string;
};

export type CompanyStat = {
  label: string;
  value: number;
  suffix?: string;
  icon?: string;
};

export type RequestQuoteStat = {
  value: string;
  label: string;
};

export type HomepageFeature = {
  title: string;
  description: string;
  icon?: string;
};

export type Timeline = {
  _id: string;
  year: string;
  title: string;
  description: string;
  featured?: boolean;
  order: number;
  _createdAt: string;
};

export type TeamMember = {
  _id: string;
  name: string;
  position: string;
  bio?: string;
  image: string;
  imageLqip?: string;
  imageAlt?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  featured?: boolean;
  order: number;
  _createdAt: string;
};

export type WhyChooseUs = {
  _id: string;
  title: string;
  description: string;
  icon: string;
  features?: string[];
  order: number;
  active?: boolean;
  _createdAt: string;
};

export type VisionMissionValues = {
  _id: string;
  title?: string;
  visionTitle?: string;
  visionDescription: string;
  visionIcon?: string;
  missionTitle?: string;
  missionDescription: string;
  missionIcon?: string;
  commitmentTitle?: string;
  commitmentDescription: string;
  commitmentIcon?: string;
  values?: CoreValue[];
  _createdAt: string;
};

export type CoreValue = {
  title: string;
  description: string;
  icon?: string;
};

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetailContent from "~/components/services/ServiceDetailContent";
import { getServiceBySlug, getServiceSlugs } from "~/sanity/utils/getServices";
import { ServiceOfferedFull } from "~/sanity/lib/serviceTypes";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service could not be found.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const title = service.seoTitle || `${service.title} | Liftronic Services`;
  const description = service.seoDescription || service.summary;
  const keywords = service.seoKeywords || service.tags || [];

  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: `${siteUrl}/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: service.image ? [service.image] : [`${siteUrl}/liftronic.png`],
      type: "website",
      url: `${siteUrl}/services/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: service.image ? [service.image] : [`${siteUrl}/liftronic.png`],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

// ISR: Revalidate every 60 minutes (3600 seconds)
export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service: ServiceOfferedFull | null = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Service JSON-LD
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "Liftronic Elevator",
      url: siteUrl,
    },
    serviceType: service.title,
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    url: `${siteUrl}/services/${slug}`,
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${siteUrl}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `${siteUrl}/services/${slug}`,
      },
    ],
  };

  // FAQPage JSON-LD (if FAQs exist)
  const faqJsonLd = service.faqs && service.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <ServiceDetailContent service={service} />
    </>
  );
}

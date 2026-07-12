import type { Metadata } from "next";
import { getSocial } from "~/sanity/utils/getSocials";
import { getContactInfo } from "~/sanity/utils/getContactInfo";
import { getCompanyInfo } from "~/sanity/utils/getAboutUs";
import { homePageDataQuery } from "~/sanity/lib/queries";
import { sanityFetch, SANITY_CACHE_TAGS } from "~/sanity/lib/cache";
import type { HomePageData } from "~/sanity/lib/homePageTypes";
import { getFeaturedServices } from "~/sanity/utils/getServices";
import { getHomePageSeo, getOgImageUrl } from "~/sanity/utils/getHomePageSeo";
import { getHomePageSettings } from "~/sanity/utils/getHomePageSettings";
import Hero from "~/components/homepage/Hero";
import AboutUs from "~/components/homepage/AboutUs";
import ProductsInteractive from "~/components/products/ProductsInteractive";
import Services from "~/components/homepage/Services";
import ClientsMarquee from "~/components/homepage/ClientsMarquee";
import MediaPreview from "~/components/homepage/MediaPreview";
import BlogSection from "~/components/homepage/BlogSection";

import FAQSection from "~/components/homepage/FAQSection";
import SEOContentSection from "~/components/homepage/SEOContentSection";
import ContactSection from "~/components/homepage/ContactSection";
import FooterSitemapLinks from "~/components/layout/FooterSitemapLinks";
import { getSiteUrl } from "~/lib/site-url";

// Next.js requires a statically analyzable literal for route segment config.
export const revalidate = 604800;

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getHomePageSeo();
  const siteUrl = getSiteUrl();

  // Fallback defaults if no SEO data in Sanity
  const title =
    seoData?.metaTitle ||
    "Liftronic Elevator - Premium Elevator & Lift Solutions";
  const description =
    seoData?.metaDescription ||
    "Leading elevator manufacturer in India. We provide design, installation, maintenance, and modernization services for passenger lifts, home elevators, and commercial lift systems.";
  const keywords = seoData?.keywords || [
    "elevator manufacturer",
    "lift installation",
    "elevator maintenance",
    "home elevator",
    "commercial lift",
    "elevator modernization",
    "lift service India",
  ];
  const ogImageUrl = seoData?.ogImage
    ? getOgImageUrl(seoData.ogImage)
    : `${siteUrl}/liftronic.png`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    alternates: {
      canonical: seoData?.canonicalUrl || siteUrl,
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "Liftronic Elevator",
      images: [
        {
          url: ogImageUrl || `${siteUrl}/liftronic.png`,
          width: 1200,
          height: 630,
          alt: seoData?.ogImage?.alt || "Liftronic Elevator Solutions",
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl || `${siteUrl}/liftronic.png`],
    },
    robots: {
      index: seoData?.robotsIndex ?? true,
      follow: seoData?.robotsFollow ?? true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

async function getHomePageData(): Promise<HomePageData> {
  return sanityFetch<HomePageData>({
    query: homePageDataQuery,
    tags: [SANITY_CACHE_TAGS.home],
  });
}

export default async function Home() {
  const [
    socials,
    contactInfo,
    companyInfo,
    homeData,
    services,
    seoData,
    homePageSettings,
  ] = await Promise.all([
    getSocial(),
    getContactInfo(),
    getCompanyInfo(),
    getHomePageData(),
    getFeaturedServices().catch(() => []),
    getHomePageSeo(),
    getHomePageSettings(),
  ]);

  const siteUrl = getSiteUrl();
  const primaryAddress =
    contactInfo?.addresses?.find((item) => /head|hq/i.test(item.label ?? "")) ||
    contactInfo?.addresses?.[0];

  // Calculate average rating from testimonials
  const testimonialRatings = homeData.testimonials
    .map((t) => t.rating)
    .filter((rating): rating is number => typeof rating === "number");

  const averageRating =
    testimonialRatings.length > 0
      ? (
          testimonialRatings.reduce((sum, rating) => sum + rating, 0) /
          testimonialRatings.length
        ).toFixed(1)
      : null;

  const reviewCount = homeData.testimonials.length;

  // Organization JSON-LD (enhanced from layout)
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoData?.structuredData?.organizationName || "Liftronic Elevator",
    description:
      seoData?.structuredData?.organizationDescription ||
      "Leading elevator and lift solutions provider in India",
    url: siteUrl,
    logo: `${siteUrl}/liftronic.png`,
    sameAs: socials.map((s) => s.url).filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: contactInfo?.email || "info@liftronicelevator.com",
      telephone: contactInfo?.supportPhone || "+91-22-2567-8910",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    ...(averageRating &&
      reviewCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: averageRating,
          reviewCount: reviewCount.toString(),
          bestRating: "5",
          worstRating: "1",
        },
      }),
  };

  // LocalBusiness JSON-LD
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: seoData?.structuredData?.organizationName || "Liftronic Elevator",
    image: `${siteUrl}/liftronic.png`,
    "@id": siteUrl,
    url: siteUrl,
    telephone: contactInfo?.supportPhone || "+91-22-2567-8910",
    email: contactInfo?.email || "info@liftronicelevator.com",
    address: primaryAddress?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: primaryAddress.address,
          addressLocality: "Mumbai",
          addressRegion: "Maharashtra",
          addressCountry: "IN",
        }
      : undefined,
    priceRange: "₹₹₹",
    ...(averageRating &&
      reviewCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: averageRating,
          reviewCount: reviewCount.toString(),
          bestRating: "5",
          worstRating: "1",
        },
      }),
  };

  // ItemList JSON-LD for featured products
  const productListJsonLd =
    homeData.featuredProducts.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: homeData.featuredProducts.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Product",
              name: product.title,
              description: product.description,
              url: `${siteUrl}/products/${product.slug}`,
            },
          })),
        }
      : null;

  // FAQPage JSON-LD for SEO
  const faqPageJsonLd =
    homePageSettings &&
    homePageSettings.showFaqSection &&
    homePageSettings.featuredFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homePageSettings.featuredFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  // Review schema for testimonials
  const reviewSchemas =
    homeData.testimonials.length > 0
      ? homeData.testimonials.slice(0, 10).map((testimonial) => ({
          "@context": "https://schema.org",
          "@type": "Review",
          author: {
            "@type": "Person",
            name: testimonial.testimonialFrom,
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: testimonial.rating || 5,
            bestRating: 5,
            worstRating: 1,
          },
          reviewBody: testimonial.testimonialDetail,
          itemReviewed: {
            "@type": "Organization",
            name: "Liftronic Elevator",
            url: siteUrl,
          },
        }))
      : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />
      {productListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productListJsonLd),
          }}
        />
      )}
      {faqPageJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
        />
      )}
      {reviewSchemas.map((reviewSchema, index) => (
        <script
          key={`review-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      ))}
      <main suppressHydrationWarning>
        <Hero socials={socials} contactInfo={contactInfo} />
        <AboutUs companyInfo={companyInfo} />
        <Services services={services} />
        <ProductsInteractive products={homeData.featuredProducts} />
        <ClientsMarquee clients={homeData.clients} />
        <MediaPreview mediaItems={homeData.featuredMedia} />
        <BlogSection blogs={homeData.featuredBlogs} />
        {homePageSettings &&
          homePageSettings.showFaqSection &&
          homePageSettings.featuredFaqs.length > 0 && (
            <FAQSection faqs={homePageSettings.featuredFaqs} />
          )}
        {homePageSettings &&
          homePageSettings.showSeoContentSection &&
          homePageSettings.seoContentSections.length > 0 && (
            <SEOContentSection sections={homePageSettings.seoContentSections} />
          )}
        <ContactSection
          contactInfo={contactInfo}
          productOptions={homePageSettings?.productOptions}
        />
      </main>
      <FooterSitemapLinks />
    </>
  );
}

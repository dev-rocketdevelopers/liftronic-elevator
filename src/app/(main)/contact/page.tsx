import type { Metadata } from "next";
import ContactSection from "~/components/homepage/ContactSection";
import { getSiteUrl } from "~/lib/site-url";
import { getContactInfo } from "~/sanity/utils/getContactInfo";
import { getHomePageSettings } from "~/sanity/utils/getHomePageSettings";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Contact Us For Elevator Manufacturer | Liftronic Elevator",
  description:
    "Elevator Manufacturer Company offering quality vertical transport solutions with design, installation, support. Contact us for elevators in Mumbai, Maharashtra.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us For Elevator Manufacturer | Liftronic Elevator",
    description:
      "Elevator Manufacturer Company offering quality vertical transport solutions with design, installation, support. Contact us for elevators in Mumbai, Maharashtra.",
    url: "/contact",
    siteName: "Liftronic Elevator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us For Elevator Manufacturer | Liftronic Elevator",
    description:
      "Elevator Manufacturer Company offering quality vertical transport solutions with design, installation, support. Contact us for elevators in Mumbai, Maharashtra.",
  },
};

export default async function ContactPage() {
  const [contactInfo, homePageSettings] = await Promise.all([
    getContactInfo(),
    getHomePageSettings(),
  ]);

  const siteUrl = getSiteUrl();
  const productOptions = homePageSettings?.productOptions ?? [];
  const primaryAddress =
    contactInfo?.addresses?.find((item) => /head|hq/i.test(item.label ?? "")) ||
    contactInfo?.addresses?.[0];

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Liftronic Elevator",
    url: `${siteUrl}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "Liftronic Elevator",
      url: siteUrl,
      email: contactInfo?.email,
      telephone: contactInfo?.supportPhone,
      address: primaryAddress?.address
        ? {
            "@type": "PostalAddress",
            streetAddress: primaryAddress.address,
            addressLocality: "Mumbai",
            addressRegion: "Maharashtra",
            addressCountry: "IN",
          }
        : undefined,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <div className="pt-20 md:pt-24">
        <ContactSection
          contactInfo={contactInfo}
          productOptions={productOptions}
        />
      </div>
    </>
  );
}

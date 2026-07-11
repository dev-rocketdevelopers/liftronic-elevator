// app/(main)/services/page.tsx

import type { Metadata } from "next";
import ServiceCard from "~/components/services/ServiceCard";
import CallToActionSection from "~/components/CallToActionSection";
import PageIntroBody from "~/components/PageIntroBody";
import { getServices } from "~/sanity/utils/getServices";
import { ServiceOffered } from "~/sanity/lib/serviceTypes";

export const metadata: Metadata = {
  title: "Services - Elevator Solutions | Lift Solutions",
  description:
    "Complete elevator care throughout every lifecycle. From initial design consultation to emergency repairs, comprehensive elevator services for residential, commercial, and industrial properties.",
  openGraph: {
    title: "Complete elevator care throughout every lifecycle - Services",
    description:
      "From initial design consultation to emergency repairs, comprehensive elevator services that ensure safety, reliability, and optimal performance.",
    type: "website",
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services - Elevator Solutions | Lift Solutions",
    description: "Complete elevator care throughout every lifecycle.",
  },
  alternates: {
    canonical: "/services",
  },
};

export const revalidate = 86400; // 24 hours

export default async function ServicesPage() {
  // Fetch services from Sanity backend
  const services: ServiceOffered[] = await getServices();

  return (
    <main>
      <PageIntroBody
        heading="Services"
        subheading="Complete elevator care across every lifecycle stage, from design consultation and installation support to maintenance, modernization, and emergency response."
      />

      {/* All Services Grid */}
      <section className="pb-12 pt-12 shadow-sm md:pb-16 md:pt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                title={service.title}
                summary={service.summary}
                tags={service.tags}
                serviceId={service.slug}
                badge={service.featured ? "Featured" : undefined}
                imageSrc={service.image}
                imageAlt={service.imageAlt}
                blurDataURL={service.imageLqip}
              />
            ))}
          </div>
        </div>
      </section>

      <CallToActionSection />
    </main>
  );
}

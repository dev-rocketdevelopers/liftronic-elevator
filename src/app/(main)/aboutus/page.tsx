// app/(main)/aboutus/page.tsx

import Image from "next/image";
import { BiCheck } from "react-icons/bi";
import WhyUsSection from "~/components/aboutus/WhyUsSection";
import VisionMissionValues from "~/components/aboutus/VisionMissionValues";
import TeamSection from "~/components/aboutus/TeamSection";
import TimelineSection from "~/components/aboutus/TimelineSection";
import CertificatesSection from "~/components/aboutus/CertificatesSection";
import CallToActionSection from "~/components/CallToActionSection";
import {
  getCompanyInfo,
  getFeaturedTimeline,
  getWhyChooseUs,
  getVisionMissionValues,
  getTeamMembers,
} from "~/sanity/utils/getAboutUs";
import { getAllCertificates } from "~/sanity/utils/getCertificates";
import type {
  CompanyInfo,
  Timeline,
  WhyChooseUs,
  VisionMissionValues as VMVType,
  TeamMember,
} from "~/sanity/lib/aboutTypes";
import type { Certificate } from "~/sanity/lib/certificateTypes";
import { PortableText } from "@portabletext/react";

export const revalidate = 604800;

export default async function AboutPage() {
  // Fetch data from Sanity with error handling
  let companyInfo: CompanyInfo | null = null;
  let featuredTimeline: Timeline[] = [];
  let whyChooseUs: WhyChooseUs[] = [];
  let visionMissionValues: VMVType | null = null;
  let teamMembers: TeamMember[] = [];
  let certificates: Certificate[] = [];

  try {
    [
      companyInfo,
      featuredTimeline,
      whyChooseUs,
      visionMissionValues,
      teamMembers,
      certificates,
    ] = await Promise.all([
      getCompanyInfo().catch(() => null),
      getFeaturedTimeline().catch(() => []),
      getWhyChooseUs().catch(() => []),
      getVisionMissionValues().catch(() => null),
      getTeamMembers().catch(() => []),
      getAllCertificates().catch(() => []),
    ]);
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    // Components will use fallback data
  }

  // Fallback data if backend is not ready
  const defaultInfo = {
    establishedYear: "2009",
    tagline: "15+ Years of Excellence",
    aboutHeading: "About Liftronic",
    aboutDescription:
      "Pioneering the future of vertical transportation with innovative solutions, uncompromising safety, and exceptional service excellence.",
    whoWeAreTitle: "Who We Are",
    heroImage: "/illustrations/lift02.png",
    keyPoints: [
      "Industry-leading safety standards and certifications",
      "Cutting-edge technology and smart elevator solutions",
      "Comprehensive services from installation to maintenance",
      "24/7 emergency support and rapid response times",
    ],
  };

  const info = companyInfo || defaultInfo;
  return (
    <main>
      {/* Who We Are Section */}
      <section className="pt-28 md:pt-32 pb-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-8">
                {info?.whoWeAreTitle || "Who We Are"}
              </h2>

              {companyInfo?.whoWeAreContent ? (
                <div className="space-y-6 text-gray-600 leading-relaxed prose prose-lg max-w-none">
                  <PortableText value={companyInfo.whoWeAreContent as never} />
                </div>
              ) : (
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p className="text-lg">
                    Liftronic stands as a beacon of innovation and excellence in
                    the elevator industry. Founded in {info?.establishedYear},
                    we have grown from a small startup to a leading provider of
                    comprehensive vertical transportation solutions.
                  </p>

                  <p className="text-lg">
                    Our journey began with a simple yet powerful vision: to
                    transform the way people move within buildings through
                    cutting-edge technology, unwavering safety standards, and
                    exceptional customer service.
                  </p>

                  <p className="text-lg">
                    Today, we serve hundreds of satisfied clients across the
                    nation, from residential complexes to towering commercial
                    buildings, always delivering solutions that exceed
                    expectations and stand the test of time.
                  </p>
                </div>
              )}

              {/* Key Points */}
              <div className="mt-8 space-y-4">
                {(info?.keyPoints || []).map((point, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <BiCheck className="text-accent text-2xl flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image & Timeline */}
            <div className="space-y-8">
              {/* Hero Image */}
              <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={info?.heroImage || "/illustrations/lift02.png"}
                  alt={
                    companyInfo?.heroImageAlt ||
                    "Liftronic team and modern elevator installation"
                  }
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-2xl font-bold">Modern Solutions</div>
                  <div className="text-white/80">For Every Building</div>
                </div>
              </div>

              {/* Company Timeline */}
              <TimelineSection timelines={featuredTimeline} />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyUsSection reasons={whyChooseUs} />

      {/* Vision, Mission & Values */}
      <VisionMissionValues data={visionMissionValues || undefined} />

      {/* Certificates Section */}
      <CertificatesSection certificates={certificates} />

      {/* Our Team */}
      <TeamSection members={teamMembers} />

      <CallToActionSection />
    </main>
  );
}

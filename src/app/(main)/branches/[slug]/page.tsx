import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBranchBySlug, getBranches } from "~/sanity/utils/getBranches";
import { getHomePageSettings } from "~/sanity/utils/getHomePageSettings";
import BranchHero from "~/components/branches/BranchHero";
import BranchLegacySection from "~/components/branches/BranchLegacySection";
import BranchWhyChoose from "~/components/branches/BranchWhyChoose";
import BranchStiltzExperience from "~/components/branches/BranchStiltzExperience";
import BranchSpecializedEngineering from "~/components/branches/BranchSpecializedEngineering";
import BranchConsultantSection from "~/components/branches/BranchConsultantSection";
import BranchInfoSection from "~/components/branches/BranchInfoSection";
import BranchGoaContactForm from "~/components/branches/BranchGoaContactForm";
import BranchSiltzProducts from "~/components/branches/BranchSiltzProducts";
import BranchMediaGallery from "~/components/branches/BranchMediaGallery";
import BranchTeamSection from "~/components/branches/BranchTeamSection";

interface BranchPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BranchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);

  if (!branch) {
    return {
      title: "Branch Not Found",
    };
  }

  return {
    title: `${branch.name} | Liftronic Elevators`,
    description:
      branch.description ||
      `Visit our ${branch.city} branch for elevator solutions.`,
    openGraph: {
      title: `${branch.name} | Liftronic Elevators`,
      description:
        branch.description ||
        `Visit our ${branch.city} branch for elevator solutions.`,
      url: `/branches/${branch.slug}`,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const branches = await getBranches();
  return branches.map((branch) => ({
    slug: branch.slug,
  }));
}

type BgVariant = "white" | "soft";

export default async function BranchPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const [branch, homePageSettings] = await Promise.all([
    getBranchBySlug(slug),
    getHomePageSettings(),
  ]);

  if (!branch) {
    notFound();
  }

  const isGoa = branch.slug === "goa";
  const sv = branch.sectionVisibility;

  /** Section visible unless explicitly hidden in CMS */
  const on = (key: keyof NonNullable<typeof sv>) => sv?.[key] !== false;

  /** Truthy check for a value or non-empty array */
  const has = (v: unknown) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v);

  // Declarative section registry — filtered sections drive alternating bg.
  const sections: Array<{
    key: string;
    renders: boolean;
    element: (bg: BgVariant) => React.ReactNode;
  }> = [
    {
      key: "legacy",
      renders: on("legacy") && has(branch.legacySection?.body),
      element: (bg) => (
        <BranchLegacySection legacy={branch.legacySection} bgVariant={bg} />
      ),
    },
    {
      key: "stiltz-experience",
      renders:
        on("stiltzExperience") &&
        (has(branch.stiltzExperience?.intro) ||
          has(branch.stiltzExperience?.experiences)),
      element: (bg) => (
        <BranchStiltzExperience
          experience={branch.stiltzExperience}
          bookingSection={branch.bookingSection}
          branchSlug={branch.slug}
          branchName={branch.name}
          bgVariant={bg}
        />
      ),
    },
    {
      key: "why-choose",
      renders: on("whyChoose") && has(branch.whyChooseReasons),
      element: (bg) => (
        <BranchWhyChoose
          reasons={branch.whyChooseReasons}
          city={branch.city}
          branchSlug={branch.slug}
          bgVariant={bg}
        />
      ),
    },
    {
      key: "specialized",
      renders:
        on("specializedEngineering") && has(branch.specializedEngineering),
      element: (bg) => (
        <BranchSpecializedEngineering
          sections={branch.specializedEngineering}
          branchSlug={branch.slug}
          bgVariant={bg}
        />
      ),
    },
    {
      key: "consultant",
      renders:
        on("consultant") &&
        (isGoa ||
          has(branch.contactPerson?.name) ||
          has(branch.contactPerson?.phone) ||
          has(branch.contactPerson?.email) ||
          has(branch.quoteEmail) ||
          has(branch.closingQuote)),
      element: (bg) => (
        <BranchConsultantSection
          quoteEmail={branch.quoteEmail}
          closingQuote={branch.closingQuote}
          branchSlug={branch.slug}
          photoUrl={branch.contactPerson?.photo?.asset?.url}
          bio={branch.description}
          city={branch.city}
          contactName={branch.contactPerson?.name}
          contactPosition={branch.contactPerson?.position}
          contactPhone={branch.contactPerson?.phone}
          contactEmail={branch.contactPerson?.email}
          bgVariant={bg}
        />
      ),
    },
    {
      key: "stiltz-products",
      renders: on("stiltzProducts") && has(branch.stiltzProducts),
      element: (bg) => (
        <BranchSiltzProducts products={branch.stiltzProducts!} bgVariant={bg} />
      ),
    },
    {
      key: "team",
      renders: on("team") && has(branch.teamMembers),
      element: (bg) => (
        <BranchTeamSection teamMembers={branch.teamMembers!} bgVariant={bg} />
      ),
    },
    {
      key: "media",
      renders: on("media") && has(branch.mediaGallery),
      element: (bg) => (
        <BranchMediaGallery mediaItems={branch.mediaGallery!} bgVariant={bg} />
      ),
    },
    {
      key: "contact",
      renders: true,
      element: (bg) =>
        isGoa ? (
          <BranchGoaContactForm
            branch={branch}
            productOptions={homePageSettings.productOptions ?? []}
          />
        ) : (
          <BranchInfoSection branch={branch} bgVariant={bg} />
        ),
    },
  ];

  return (
    <main>
      <BranchHero branch={branch} />
      {sections
        .filter((s) => s.renders)
        .map((s, i) => (
          <React.Fragment key={s.key}>
            {s.element(i % 2 === 0 ? "soft" : "white")}
          </React.Fragment>
        ))}
    </main>
  );
}

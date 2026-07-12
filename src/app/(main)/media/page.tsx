import type { Metadata } from "next";
import CallToActionSection from "~/components/CallToActionSection";
import PageIntroBody from "~/components/PageIntroBody";
import { mediaQuery } from "~/sanity/lib/queries";
import type { MediaItem } from "~/sanity/lib/mediaTypes";
import MediaPageClient from "~/components/media/MediaPageClient";
import { sanityFetch, SANITY_CACHE_TAGS } from "~/sanity/lib/cache";

export const metadata: Metadata = {
  title: "Media Gallery - Elevator Installations & Projects | Lift Solutions",
  description:
    "Explore our latest elevator projects, product showcases, and behind-the-scenes content showcasing our elevator solutions and installations.",
  openGraph: {
    title: "Media Gallery - Elevator Installations & Projects",
    description:
      "Discover our latest projects, product showcases, and behind-the-scenes content showcasing our elevator solutions and installations.",
    type: "website",
    url: "/media",
  },
  twitter: {
    card: "summary_large_image",
    title: "Media Gallery - Elevator Installations & Projects",
    description:
      "Explore our latest elevator projects, product showcases, and installations.",
  },
  alternates: {
    canonical: "/media",
  },
};

async function getAllMedia(): Promise<MediaItem[]> {
  return sanityFetch<MediaItem[]>({
    query: mediaQuery,
    tags: [SANITY_CACHE_TAGS.media],
  });
}

export const revalidate = 604800;

export default async function MediaPage() {
  const mediaItems = await getAllMedia();

  return (
    <main>
      <PageIntroBody
        heading="Media Gallery"
        subheading="Explore our latest elevator installations, product showcases, project highlights, and behind-the-scenes media from completed work."
      />

      <MediaPageClient mediaItems={mediaItems} />

      <CallToActionSection
        title="Want to see your project featured?"
        description="Get in touch with us to discuss your elevator needs and join our gallery of successful installations."
        primaryAction={{
          label: "Start Your Project",
          href: "/#contact",
        }}
        secondaryAction={{
          label: "View Products",
          href: "/products",
        }}
      />
    </main>
  );
}
